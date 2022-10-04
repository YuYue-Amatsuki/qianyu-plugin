//项目运行加载所有定时插件
import fs from "fs"
import moment from 'moment'
import chokidar from 'chokidar'
import { cacelds, ds } from "../utils/schedule.js"
import lodash from 'lodash'
import { segment } from "oicq"
import path from "path"
const __dirname = process.cwd();
const bs = __dirname + '/plugins/qianyu-plugin/data/ds/'

if (!fs.existsSync(`${__dirname}/plugins/qianyu-plugin/data/`)) {
    fs.mkdirSync(`${__dirname}/plugins/qianyu-plugin/data/`)
}
if (!fs.existsSync(bs)) {
    fs.mkdirSync(bs)
}
//读取文件夹下所有的js文件
export class init {
    constructor() {
        //this.watch()
        this.dir = process.cwd() + '/plugins/qianyu-plugin/'
        this.watcher = {}
        this.apps = []
        this.priority = []
    }
    async getPlugins() {
        let ret = []
        let files = fs.readdirSync(this.dir + '/apps', { withFileTypes: true })
        for (let val of files) {
            ret.push({
                name: `qianyu-plugin/${val.name}`,
                path: `../apps/${val.name}`
            })
            /** 监听热更新 */
            this.watch('qianyu-plugin', val.name)
            continue
        }
        return ret
    }
    async load(isRefresh = false) {
        if (!lodash.isEmpty(this.priority) && !isRefresh) return
        const files = await this.getPlugins()
        for (let File of files) {
            try {
                let tmp = await import(File.path)
                lodash.forEach(tmp, (p, i) => {
                    if (!p.prototype) {
                        return
                    }
                    /* eslint-disable new-cap */
                    let plugin = new p()
                    logger.debug(`载入插件 [${File.name}][${plugin.name}]`)
                    this.priority.push({
                        class: p,
                        key: File.name,
                        priority: plugin.priority
                    })
                })

            } catch (error) {
                if (error.stack.includes('Cannot find package')) {
                    packageErr.push({ error, File })
                } else {
                    logger.error(`载入插件错误：${logger.red(File.name)}`)
                    logger.error(decodeURI(error.stack))
                }
            }
        }
        lodash.forEach(this.priority, (p) => {
            this.apps.push(p.class)
        })
    }
    /** 监听热更新 */
    watch(dirName, appName) {
        this.watchDir(dirName)
        if (this.watcher[`${dirName}.${appName}`]) return

        let file = `${this.dir}/apps/${appName}`
        const watcher = chokidar.watch(file)
        let key = `${dirName}/${appName}`

        /** 监听修改 */
        watcher.on('change', async path => {
            logger.mark(`[修改插件][${dirName}][${appName}]`)
            let tmp = {}
            try {
                tmp = await import(`../apps/${appName}?${moment().format('x')}`)
            } catch (error) {
                logger.error(`载入插件错误：${logger.red(dirName + '/' + appName)}`)
                logger.error(decodeURI(error.stack))
                return
            }
            lodash.forEach(tmp, (p) => {
                /* eslint-disable new-cap */
                let plugin = new p()
                for (let i in this.priority) {
                    if (this.priority[i].key == key) {
                        this.priority[i].class = p
                        this.priority[i].priority = plugin.priority
                        this.apps[i] = p
                    }
                }
            })
        })

        /** 监听删除 */
        watcher.on('unlink', async path => {
            logger.mark(`[卸载插件][${dirName}][${appName}]`)
            this.watcher[`${dirName}.${appName}`].removeAllListeners('change')
        })

        this.watcher[`${dirName}.${appName}`] = watcher
    }


    watchDir(dirName) {
        if (this.watcher[dirName]) return
        let file = `${this.dir}apps/`
        const watcher = chokidar.watch(file)
        watcher.on('add', async PluPath => {
            let appName = path.basename(PluPath)
            if (!appName.endsWith('.js')) return
            let key = `${dirName}/${appName}`

            this.watch(dirName, appName)

            logger.mark(`[新增插件][${dirName}][${appName}]`)
            let tmp = {}
            try {
                tmp = await import(`../apps/${appName}?${moment().format('x')}`)
            } catch (error) {
                logger.error(`载入插件错误：${logger.red(dirName + '/' + appName)}`)
                logger.error(decodeURI(error.stack))
                return
            }

            if (tmp.apps) tmp = { ...tmp.apps }

            lodash.forEach(tmp, (p) => {
                if (!p.prototype) {
                    logger.error(`[载入失败][${dirName}][${appName}] 格式错误已跳过`)
                    return
                }
            })
        })
        this.watcher[dirName] = watcher
    }

}



export async function startTask() {
    let userlist = fs.readdirSync(bs).filter((file) => file.endsWith(".json"));
    for (let u of userlist) {
        let userinfo = JSON.parse(await fs.readFileSync(bs + u))
        let user_id = Number(u.replace(".json", ""))
        for (let task of userinfo.task) {
            if (moment().isBefore(task.endTime)) {
                await cacelds(user_id + task.name)
                await ds(user_id + task.name, task.endTime, () => {
                    if (task.group_id == undefined) {
                        Bot.sendPrivateMsg(user_id, task.content)
                    } else {
                        if (task.at != undefined) {
                            user_id = task.at
                        }
                        if (img != undefined) {
                            Bot.sendGroupMsg(task.group_id, segment.image(img))
                        }
                        let msg = [segment.at(user_id), task.content]
                        Bot.sendGroupMsg(task.group_id, msg)
                    }
                    userinfo.task.forEach((t, index) => {
                        if (t.name == task.name) {
                            userinfo.task.splice(index, 1)
                            fs.writeFileSync(bs + user_id + ".json", JSON.stringify(userinfo))
                        }
                    })
                })

            }
        }
    }
}



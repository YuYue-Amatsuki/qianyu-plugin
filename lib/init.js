
//项目运行加载所有定时插件
import fs from "fs"
import moment from 'moment'
import { cacelds, ds } from "../utils/schedule.js"
import { segment } from "oicq"
const __dirname = process.cwd();
const bs = __dirname + '/plugins/qianyu-plugin/resources/data/ds/'

if (!fs.existsSync(`${__dirname}/plugins/qianyu-plugin/resources/data/`)) {
    fs.mkdirSync(`${__dirname}/plugins/qianyu-plugin/resources/data/`)
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
        let files = fs.readdirSync(this.dir + '/apps').filter(file => file.endsWith('.js'))
        files.forEach((file) => {
            ret.push(import(`../apps/${file}`))
        })
        ret = await Promise.allSettled(ret)
        let apps = {}
        for (let i in files) {
            let name = files[i].replace('.js', '')

            if (ret[i].status != 'fulfilled') {
                logger.error(`载入插件错误：${logger.red(name)}`)
                logger.error(ret[i].reason)
                continue
            }
            apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
        }
        return apps
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
                        if (task.img != undefined) {
                            Bot.sendGroupMsg(task.group_id, segment.image(task.img))
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



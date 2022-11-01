import fs from "fs"

//获取插件优先级，获取插件权限，禁用插件
class loader {
    constructor() {
        //定义属性
        this.dir = process.cwd() + '/plugins/qianyu-plugin/'
    }

    //加载
    async init() {
        let apps = this.loadapp()
    }

    //加载插件功能
    async loadapp() {
        let set = []
        let files = fs.readdirSync(this.dir + '/apps').filter(file => file.endsWith('.js'))
        files.forEach(item => {
            set.push(import(`../apps/${item}`))
        });
        set = await Promise.allSettled(set)
        let apps = {};
        for (let i in files) {
            let name = files[i].replace('.js', '')
            if (set[i].status != 'fulfilled') {
                logger.error(`载入插件错误：${logger.red(name)}`)
                logger.error(set[i].reason)
                continue
            }
            let val = set[i].value[Object.keys(set[i].value)[0]]
            if (val) {
                apps[name] = val
            }

        }
        return apps
    }

    //获取权限
    async getPermissions() {

    }

    //禁用插件
    async disableApp() {

    }

    //加载定时任务
    async timeTask() {

    }
}


export default new loader()
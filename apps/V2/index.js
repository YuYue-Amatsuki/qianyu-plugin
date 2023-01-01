import fs from 'fs'
import Runtime from '../../../../lib/plugins/runtime.js'
const rtime = new Runtime()
const path = `${process.cwd()}/plugins/qianyu-plugin/apps/V2`
const jslist = fs.readdirSync(path).filter(item => item != 'index.js')
let appslist = []
let suclist = []
global.BotConfig = {
    account: {
        qq: rtime.cfg.qq
    }
}
for (let j of jslist) {
    try {
        let v = await import(`./${j}`)
        let name = j.replace('.js', "")
        let apps = {
            id: name,
            name: name,
            desc: name,
            event: 'message',
            rule: []
        }
        for (let r in v.rule) {
            apps.rule.push({
                reg: v.rule[r].reg,
                desc: v.rule[r].describe,
                fnc: r,
                fuc: v[r]
            })
        }
        suclist.push(name + '\n')
        appslist.push(apps)
    } catch (error) {
        continue;
    }

}
if (appslist.length > 0) {
    Bot.pickFriend(rtime.cfg.masterQQ[0]).sendMsg([`共成功加载v2插件${suclist.length}个,分别是:\n`, ...suclist])
}

export default appslist

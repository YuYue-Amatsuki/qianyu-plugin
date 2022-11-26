import { filemage, returnImg } from '../utils/index.js'
import lodash from 'lodash'
import { segment } from 'oicq'
let file = new filemage()

let apps = {
    id: 'help',
    name: '千羽帮助',
    desc: '帮助',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^千羽帮助|^帮助',
    desc: '帮助',
    fnc: 'help',
    fuc: help
})

let isopenhelp = false

async function help(e) {
    if (!isopenhelp && e.msg == '帮助') return false
    let helplist = JSON.parse(await redis.get('qianyu:helplist')) || []
    let helpImgPath = '../resources/html/help/help.jpg'
    let data = await file.getyamlJson("config/help")
    if (!e.isMaster) {
        data.helplist.splice(data.helplist.length - 1, 1)
    }
    if (!lodash.isEqual(data.helplist, helplist)) {
        await redis.set("qianyu:helplist", JSON.stringify(data.helplist))
        data.path = './plugins/qianyu-plugin/resources/html/help/help.jpg'
        this.reply(await returnImg('help', data))
    } else {
        if (file.is_exists(helpImgPath)) {
            return this.reply(segment.image("./plugins/qianyu-plugin/resources/html/help/help.jpg"))
        }
    }

    return true
}


export default apps
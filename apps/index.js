import plugin from '../../../lib/plugins/plugin.js'
import v2 from './V2/index.js'
import v3 from './V3/index.js'
import Set from '../lib/qianyuSet.js'
import { wz } from './V3/Game/wz.js'
import { jx } from './V3/Global/shorttv.js'
import lodash from 'lodash'
let as = []
let apps = [...v2, ...v3]
let blacklist = Set.blacklis || []
let globelist = Set.globelist || []
let gapps = []
let gclass = []
for (let i in apps) {
    if (blacklist.includes(apps[i].id)) continue;
    if (globelist.includes(apps[i].id)) {
        gapps.push(apps[i])
        continue;
    }
    let p = class extends plugin {
        constructor() {
            super({
                name: apps[i].name,
                /** 功能描述 */
                dsc: apps[i].event,
                event: apps[i].event,
                /** 优先级，数字越小等级越高 */
                priority: apps[i].priority || 50,
                rule: apps[i].rule,

            })
            this.task = apps[i].task || {}
        }
    }
    for (let r in apps[i].rule) {
        p.prototype[apps[i].rule[r].fnc] = apps[i].rule[r].fuc
    }
    for (let r in apps[i].fuc) {
        p.prototype[apps[i].fuc[r].fnc] = apps[i].fuc[r].fuc
    }
    p.prototype.makeGroupMsg = makeGroupMsg
    as[apps[i].id] = p
}
for (let a of gapps) {
    let p = class extends plugin {
        constructor() {
            super({
                name: a.name,
                /** 功能描述 */
                dsc: a.event,
                event: a.event,
                /** 优先级，数字越小等级越高 */
                priority: a.priority || 50,
                rule: a.rule,

            })
            this.task = a.task || {}
        }
    }
    for (let r in a.rule) {
        p.prototype[a.rule[r].fnc] = a.rule[r].fuc
    }
    for (let r in a.fuc) {
        p.prototype[a.fuc[r].fnc] = a.fuc[r].fuc
    }
    p.prototype.makeGroupMsg = makeGroupMsg
    let pl = new p()
    gclass.push(pl)

}
Bot.on("message", async (e) => {
    //伪装任务 
    let iswz = await redis.get('qianyu:wz:iswz')
    if (iswz) {
        await wz(e)
    }
    //视频解析(b站)
    await jx(e)
    for (let g in gclass) {
        gclass[g].e = e
        for (let r in gclass[g].rule) {
            if (new RegExp(gclass[g].rule[r].reg).test(e.msg)) {
                gclass[g].rule[r].fuc.call(gclass[g], e)
            }
        }
        if (gclass[g].getContextGroup) {
            let context = gclass[g].getContextGroup()
            if (!lodash.isEmpty(context)) {
                for (let fnc in context) {
                    gclass[g][fnc](context[fnc])
                }
                return
            }
        }
    }


})
async function makeGroupMsg(title, msg, end) {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
        let info = await Bot.getGroupMemberInfo(this.e.group_id, Bot.uin)
        nickname = info.card ?? info.nickname
    }
    let userInfo = {
        user_id: Bot.uin,
        nickname
    }

    let forwardMsg = []
    if (title) {
        forwardMsg.push({
            ...userInfo,
            message: title
        })
    }
    msg.forEach(item => {
        forwardMsg.push({
            ...userInfo,
            message: item
        })
    });

    if (end) {
        forwardMsg.push({
            ...userInfo,
            message: end
        })
    }
    /** 制作转发内容 */
    if (this.e.isGroup) {
        forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
        forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
        .replace(/\n/g, '')
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
        .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

    return forwardMsg
}

export default as


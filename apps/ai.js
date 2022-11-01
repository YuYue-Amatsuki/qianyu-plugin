import { geturldata, filemage } from '../utils/index.js'
import Cfg from '../../../lib/config/config.js'
import lodash from 'lodash'
let file = new filemage()
let cfg = {
    isPrivate: true,
    isGroup: true,
    probability: 100,
    ai: "思知"
}
let gcfg = {
    isopen: true,
    probability: 40,
    ai: '思知'
}

let apps = {
    id: 'ai',
    name: '人工智障ai',
    desc: '人工智障ai',
    event: 'message',
    priority: 100000,
    rule: []
}

apps.rule.push({
    reg: '',
    desc: '智障ai',
    fnc: 'ffai',
    fuc: ffai
})


async function ffai(e) {
    let config = await redis.get('qianyu:ai:config') || cfg
    let groupconfig = await redis.get(`qianyu:ai:config:${e.group_id}`) || gcfg
    let radom = lodash.random(1, 100)
    if (e.isGroup) {
        let gcfg = Cfg.getGroup(e.group_id)
        let gqz = gcfg.botAlias
        let gz = gqz.join("|")
        let reg = new RegExp(`${gz}`)
        if (config.isGroup == false) return ""
        if (e.atBot || reg.test(e.raw_message)) {
            return await getai(e, config.ai, groupconfig.ai, this)
        }
        for (let i in groupconfig) {
            if (i == e.group_id) {
                let gconfig = groupconfig[i]
                if (gconfig.isopen) {
                    if (radom <= gconfig.probability) {
                        await getai(e, config.ai, gconfig.ai, this)
                    }
                }
            }
        }
    }
    if (e.isPrivate) {
        if (config.isPrivate == false) return ""
        if (radom <= config.probability) {
            await getai(e, config.ai, undefined, this)
        }
    }
}

//ai
async function getai(e, ai, gconfig, that) {
    if (e.isPrivate) {
        await choieai(e.msg, ai, that)
    }
    if (e.isGroup) {
        if (!gconfig) {
            gconfig = ai
        }
        await choieai(e.msg, gconfig, that)
    }
}


async function choieai(msg, ai, that) {
    let aidata = await file.getyaml("resources/data/api/ai")
    let botname = await redis.get(`qianyu:ai:botname`)
    let ailist = aidata.ailist
    console.log(ai)
    let aida = ailist.find(list => list.name == ai)
    console.log(aida);
    if (!aida) return
    await geturldata(`${aida.url}${encodeURI(msg)}`, aida.data, (res) => {
        let respose;
        if (ai == '菲菲') {
            let msglist = res.split("━━━━━━━━━")
            respose = msglist[1].replace(/\n/g, "")
        } else {
            respose = res
        }
        that.reply(`${respose.replace(/小思|菲菲|小爱/g, botname ? botname : ai)}`)
    })

}

export default apps
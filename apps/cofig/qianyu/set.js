import { returnImg } from '../../../utils/index.js'
import { config, configlist, gcofiglist, bscofig, cofigall } from './setcofig.js'
let apps = {
    id: 'set',
    name: '千羽设置',
    desc: '千羽设置',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^#千羽设置',
    desc: '设置',
    fnc: 'set',
    fuc: set
})

let botname = ''

let isbjx;

let aicfg = {
    isPrivate: true,
    isGroup: true,
    probability: 100,
    ai: "思知"
}

let gaicfg = {
    isopen: false,
    gprobability: 40,
    gai: '思知'
}

let bscfg = {
    isChieseTime: false,
    isImg: false,
    isCored: false
}


let coflistcopy = []

async function set(e) {
    if (!e.isMaster) {
        return this.reply("无权限！")
    }
    let img, m;
    let cfg = Object.keys(config)
    let msg = e.msg.replace("#千羽设置", "")
    let value = cfg.find(item => msg.includes(item))
    let bsglist = JSON.parse(await redis.get('qianyu:bstime:grouplist')) || []
    isbjx = await redis.get(`qianyu:isbjx:${e.group_id}`) ? await redis.get(`qianyu:isbjx:${e.group_id}`) : false
    botname = await redis.get('qianyu:ai:botname') || aicfg.ai
    aicfg = JSON.parse(await redis.get('qianyu:ai:config')) || aicfg
    gaicfg = JSON.parse(await redis.get(`qianyu:ai:config:${e.group_id}`)) || gaicfg
    bscfg = JSON.parse(await redis.get(`qianyu:bstime:config:${e.group_id}`)) || bscfg
    coflistcopy = JSON.parse(JSON.stringify(configlist))

    if (e.isGroup) {
        coflistcopy[0].configlist.push(...gcofiglist)
        coflistcopy.push(bscofig)
        coflistcopy[1].configlist[3].status = bsglist.includes(e.group_id)
    }
    coflistcopy.push(cofigall)
    coflistcopy[coflistcopy.length - 1].configlist[0].status = isbjx == null ? false : true
    if (value) {
        //有这个设置
        m = msg.replace(value, "")//值
        if (value.includes("报时")) {
            if (e.isGroup && config[value].range == "Group") {
                if (value == "群报时") {
                    if (m == '开启') {
                        if (!bsglist.includes(e.group_id)) {
                            bsglist.push(e.group_id)
                        }
                        coflistcopy[1].configlist[3].status = true
                    } else if (m == "关闭") {
                        if (bsglist.includes(e.group_id)) {
                            bsglist.splice(bsglist.findIndex(item => item == e.group_id), 1)
                        }
                        coflistcopy[1].configlist[3].status = false
                    }
                    await setcofig('bstime:grouplist', JSON.stringify(bsglist))
                } else {
                    await controlOpen(m, config[value].name + e.group_id, bscfg, config[value].key)
                }
            }
        } else if (value.includes("解析")) {
            if (e.isGroup && config[value].range == "Group") {
                await controlOpen(m, config[value].name + ":" + e.group_id, undefined, config[value].key)
            }
        }
        else {
            if (e.isGroup && config[value].range == "Group") {
                await controlOpen(m, config[value].name + e.group_id, gaicfg, config[value].key)
            } else if (config[value].range == "All") {
                await controlOpen(m, config[value].name, config[value].key ? aicfg : undefined, config[value].key)
            }
        }

    }
    //改变值
    getvalue({ ...aicfg, ...gaicfg, ...bscfg, })
    img = await returnImg('admin', {
        data: coflistcopy
    })
    return this.reply(img)
}

function getvalue(data) {
    coflistcopy.forEach((item, idx) => {
        item.configlist.forEach((i, index) => {
            if (i.name != '群报时' && i.name != 'b站解析') {
                coflistcopy[idx].configlist[index].status = i.name == 'ai名称' ? botname : data[config[i.name].key]
            } else if (i.name == 'b站解析') {
                coflistcopy[idx].configlist[index].status = isbjx
            }
        })
    })
}

async function controlOpen(m, name, data, key) {
    if (m == '开启') {
        if (data) {
            data[key] = true
            await setcofig(name, JSON.stringify(data))
        } else {
            isbjx = true
            await setcofig(name, 1)
        }
    } else if (m == "关闭") {
        if (data) {
            data[key] = false
            await setcofig(name, JSON.stringify(data))
        } else {
            isbjx = false
            await deletecofig(name)
        }
    } else if (m >= 0 && m <= 100) {
        data[key] = m
        await setcofig(name, JSON.stringify(data))
    } else if (!data) {
        //ai名称
        botname = m
        await setcofig(name, m)
    } else if (/菲菲|青云客|夸克|小爱同学|思知/.test(m)) {
        data[key] = m
        await setcofig(name, JSON.stringify(data))
    }
}

async function setcofig(name, val) {
    await redis.set(`qianyu:${name}`, val).then(() => {
        logger.mark(`[千羽]设置${name}开启`)
    }).catch(err => {
        logger.error(`[千羽]设置${name}开启失败`, err)
    })
}

async function deletecofig(name) {
    await redis.del(`qianyu:${name}`).then(() => {
        logger.mark(`[千羽]设置${name}关闭`)
    }).catch(err => {
        logger.error(`[千羽]设置${name}关闭失败`, err)
    })
}

export default apps
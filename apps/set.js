import { returnImg } from '../utils/index.js'
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

let coflistcopy = []

async function set(e) {
    if (!e.isMaster) {
        return this.reply("无权限！")
    }
    let msg = e.msg.replace("#千羽设置", "")
    let img;
    botname = await redis.get('qianyu:ai:botname') || aicfg.ai
    aicfg = JSON.parse(await redis.get('qianyu:ai:config')) || aicfg
    gaicfg = JSON.parse(await redis.get(`qianyu:ai:config:${e.group_id}`)) || gaicfg
    let m;
    coflistcopy = JSON.parse(JSON.stringify(configlist))
    let cfg = Object.keys(config)
    let value = cfg.find(item => msg.includes(item))
    if (e.isGroup) {
        coflistcopy[0].configlist.push(...gcofiglist)
    }
    if (value) {
        //有这个设置
        m = msg.replace(value, "")//值
        if (value.includes("报时")) {

        } else {
            if (e.isGroup && config[value].range == "Group") {
                await controlOpen(m, config[value].name + e.group_id, gaicfg, config[value].key)
            } else if (config[value].range == "All") {
                await controlOpen(m, config[value].name, config[value].key ? aicfg : undefined, config[value].key)
            }
        }

    }
    //改变值
    getvalue({ ...aicfg, ...gaicfg })
    img = await returnImg('admin', {
        data: coflistcopy
    })
    return this.reply(img)
}

function getvalue(data) {
    coflistcopy.forEach((item, idx) => {
        item.configlist.forEach((i, index) => {
            coflistcopy[idx].configlist[index].status = i.name == 'ai名称' ? botname : data[config[i.name].key]
        })
    })
}

async function controlOpen(m, name, data, key) {
    if (m == '开启') {
        data[key] = true
        await setcofig(name, JSON.stringify(data))
    } else if (m == "关闭") {
        data[key] = false
        await setcofig(name, JSON.stringify(data))
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

let configlist = [
    {
        title: 'AI相关',
        configlist: [
            {
                name: 'ai私聊',
                reg: '#千羽设置ai私聊开启/关闭',
                desc: '私聊ai设置'
            },
            {
                name: 'ai群聊',
                reg: '#千羽设置群聊开启/关闭',
                desc: '群聊ai设置(全局)'
            },
            {
                name: 'ai概率',
                reg: '#千羽设置ai概率100（0-100）',
                desc: 'ai设置触发概率（私聊概率）'
            },
            {
                name: '私聊ai',
                reg: '#千羽设置私聊ai',
                desc: '可以设置ai为菲菲、青云客、夸克、小爱同学、思知'
            },
            {
                name: 'ai名称',
                reg: '#千羽设置ai名称',
                desc: '可以设置bot的名字'
            }
        ]
    }
]
let gcofiglist = [{
    name: '群ai',
    reg: '#千羽设置群ai开启/关闭',
    desc: '群ai设置开关'
},
{
    name: 'ai群概率',
    reg: '#千羽设置ai群概率100（0-100）',
    desc: 'ai设置触发概率设置（每个群独立配置）'
},
{
    name: '群聊ai',
    reg: '#千羽设置群聊ai青云客',
    desc: '可以设置ai为菲菲、青云客、夸克、小爱同学、思知'
}]

let bscofig = {
    title: '报时相关',
    configlist: [
        {
            name: '中文报时',
            reg: 'ai设置私聊开启/关闭',
            desc: '私聊ai设置'
        },
        {
            name: '图片报时',
            reg: 'ai设置群聊开启/关闭',
            desc: '群聊ai设置(关闭群ai不生效)'
        },
        {
            name: '语音报时',
            reg: 'ai设置概率100（0-100）',
            desc: 'ai设置触发概率（私聊概率）'
        },
        {
            name: '群报时',
            reg: 'ai设置概率100（0-100）',
            desc: 'ai设置触发概率（私聊概率）'
        }
    ]
}

const config = {
    ai私聊: {
        name: 'ai:config',
        key: 'isPrivate',
        range: 'All'
    },
    ai群聊: {
        name: 'ai:config',
        key: "isGroup",
        range: 'All'
    },

    ai概率: {
        name: 'ai:config',
        key: 'probability',
        range: 'All'
    },
    ai群概率: {
        name: 'ai:config:',
        key: 'gprobability',
        range: 'Group'
    },
    私聊ai: {
        name: 'ai:config',
        key: 'ai',
        range: 'All'
    },
    群ai: {
        name: 'ai:config:',
        key: 'isopen',
        range: 'Group'
    },
    群聊ai: {
        name: 'ai:config:',
        key: 'gai',
        range: 'Group'
    },
    ai名称: {
        name: 'ai:botname',
        key: undefined,
        range: 'All'
    }
}


export default apps
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
                reg: '#千羽设置ai群聊开启/关闭',
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
            reg: '#千羽设置中文报时开启/关闭',
            desc: '小时数中文显示'
        },
        {
            name: '图片报时',
            reg: '#千羽设置图片报时开启/关闭',
            desc: '报时时发送一张图片'
        },
        {
            name: '语音报时',
            reg: '#千羽设置语音报时开启/关闭',
            desc: '可莉语音报时'
        },
        {
            name: '群报时',
            reg: '#千羽设置群报时开启/关闭',
            desc: '群报时开启设置'
        }
    ]
}

let cofigall = {
    title: '全局设置',
    configlist: [
        {
            name: 'b站解析',
            reg: '#千羽设置b站解析开启/关闭',
            desc: '获取消息中的b站链接发送视频'
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
    },
    中文报时: {
        name: 'bstime:config:',
        key: "isChieseTime",
        range: 'Group'
    },
    图片报时: {
        name: 'bstime:config:',
        key: "isImg",
        range: 'Group'
    },
    语音报时: {
        name: 'bstime:config:',
        key: "isCored",
        range: 'Group'
    },
    群报时: {
        name: 'bstime:grouplist',
        key: undefined,
        range: 'Group'
    },
    b站解析: {
        name: 'isbjx',
        key: undefined,
        range: 'All'
    }
}

export { config, configlist, gcofiglist, bscofig, cofigall }

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
                desc: '可以设置ai为青云客、夸克、小爱同学、思知'
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
    desc: '可以设置ai青云客、夸克、小爱同学、思知'
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
            name: '报时角色',
            reg: '#千羽设置报时角色+原神角色',
            desc: '设置语音报时和文本的原神角色（请使用正规角色名，不要使用代称）'
        },
        {
            name: '群报时',
            reg: '#千羽设置群报时开启/关闭',
            desc: '群报时开启设置'
        }
    ]
}

let jxcofig = {
    title: '解析相关',
    configlist: [
        {
            name: 'b站解析',
            reg: '#千羽设置b站解析开启/关闭',
            desc: '获取消息中的b站链接发送视频'
        },
        {
            name: '短视频解析',
            reg: '#千羽设置短视频解析开启/关闭',
            desc: '获取消息中的短视频链接发送视频（支持b站、抖音、快手、皮皮虾）'
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
    报时角色: {
        name: 'bstime:config:',
        key: "character",
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
        range: 'Group'
    },
    短视频解析: {
        name: 'isstvjx',
        key: undefined,
        range: 'Group'
    }
}
const ysjs = [
    "流浪者",
    "珐露珊",
    "莱依拉",
    "纳西妲",
    "妮露",
    "坎蒂丝",
    "赛诺",
    "多莉",
    "提纳里",
    "柯莱",
    "鹿野院平藏",
    "久岐忍",
    "夜兰",
    "空",
    "荧",
    "神里绫人",
    "八重神子",
    "云堇",
    "申鹤",
    "荒泷一斗",
    "五郎",
    "优菈",
    "阿贝多",
    "托马",
    "胡桃",
    "达达利亚",
    "雷电将军",
    "珊瑚宫心海",
    "埃洛伊",
    "宵宫",
    "神里绫华",
    "枫原万叶",
    "温迪",
    "刻晴",
    "莫娜",
    "可莉",
    "琴",
    "迪卢克",
    "七七",
    "魈",
    "钟离",
    "甘雨",
    "早柚",
    "九条裟罗",
    "凝光",
    "菲谢尔",
    "班尼特",
    "丽莎",
    "行秋",
    "迪奥娜",
    "安柏",
    "重云",
    "雷泽",
    "芭芭拉",
    "罗莎莉亚",
    "香菱",
    "凯亚",
    "北斗",
    "诺艾尔",
    "砂糖",
    "辛焱",
    "烟绯"
]

export { config, configlist, gcofiglist, bscofig, jxcofig, ysjs }

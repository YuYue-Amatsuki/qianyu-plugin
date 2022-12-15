import { geturldata } from '../../utils/index.js'
import { segment } from 'oicq'
import lodash from 'lodash'
let apps = {
    id: 'cjs',
    name: '猜角色',
    desc: '猜角色',
    event: 'message',
    rule: [],
    fuc: []
}

apps.rule.push({
    reg: '^#猜角色',
    desc: '猜角色',
    fnc: 'guesscharacter',
    fuc: guesscharacter
})

apps.fuc.push({
    fnc: 'guess',
    fuc: guess
})


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



let chartlist = {}
let timer = {}


async function guesscharacter(e) {
    if (chartlist[e.group_id]) {
        return this.reply("当前正在进行猜角色，请勿重复发起！")
    }
    this.reply("下面我将随机发送一段原神角色语音，请在40s猜出。")
    let characterid = lodash.random(0, ysjs.length - 1)
    chartlist[e.group_id] = ysjs[characterid]
    await geturldata({ url: `http://www.whpioneer.xyz/api/getcharactercord/${characterid + 1}`, data: ['data'], headers: { source: qySource } }, async res => {
        let random = lodash.random(0, res.data.length - 1)
        this.reply(segment.record(res.data[random].url))
        this.setContext('guess', true)
        timer[e.group_id] = setTimeout(() => {
            if (chartlist[e.group_id]) {
                this.reply(`没有人回答对呢，正确答案是${chartlist[e.group_id]}`)
                delete chartlist[this.e.group_id]
                this.finish('guess', true)
            }
        }, 40 * 1000)
    })
}

async function guess() {
    if (this.e.msg === chartlist[this.e.group_id]) {
        delete chartlist[this.e.group_id]
        this.reply("恭喜你答对了!", true)
        clearTimeout(timer[this.e.group_id])
        this.finish('guess', true)
    }
}




export default apps
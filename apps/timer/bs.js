import { segment } from 'oicq'
import { filemage, ds, geturldata } from '../../utils/index.js'
import moment from 'moment'
import lodash from 'lodash'
let file = new filemage()
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
let Cfg = await file.getyamlJson("config/baoshi")
let apps = {
    id: 'bs',
    name: '千羽报时',
    desc: '报时',
    event: 'message',
    rule: []
}

let bscfg = {
    isChieseTime: false,
    isImg: false,
    isCored: false,
    character: '可莉'
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await ds("bs", `0 0 ${Cfg.htime} * * *`, async () => {
    let grouplist = JSON.parse(await redis.get('qianyu:bstime:grouplist')) || []
    for (let g of grouplist) {
        let bscf = { ...bscfg, ...JSON.parse(await redis.get(`qianyu:bstime:config:${g}`)) }
        let character = bscf.character ? bscf.character : '可莉'
        let msg = []
        let hour = moment().hour()
        if (bscf.isChieseTime) {
            hour = Cfg.chineseTime[hour]
        }
        msg.push(`现在是北京时间${hour}点整~`)
        if (bscf.isImg && !bscf.isCored) {
            msg.push(segment.image("https://img.xjh.me/random_img.php?return=302"))
        }
        if (bscf.isCored) {
            console.log("进来了");
            await geturldata({ url: `http://www.whpioneer.xyz/api/getcharactercord/${ysjs.findIndex(item => item == character) + 1}`, data: ['data'], headers: { source: qySource } }, async res => {
                let random = lodash.random(0, res.data.length - 1)
                msg[0] = `${hour}点了，${res.data[random].text}`
                if (bscf.isImg) {
                    msg[1] = segment.image(`./plugins/qianyu-plugin/resources/img/可莉/可莉${lodash.random(1, 14)}.jpg`)
                }
                msg[2] = segment.record(res.data[random].url)
                for (let m of msg) {
                    Bot.sendGroupMsg(g, m)
                    await sleep(3000)
                }
            })
        } else {
            for (let m of msg) {
                Bot.sendGroupMsg(g, m)
                await sleep(3000)
            }
        }

    }
})

export default apps
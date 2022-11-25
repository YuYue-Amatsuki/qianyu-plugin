import { segment } from 'oicq'
import { filemage, ds } from '../utils/index.js'
import moment from 'moment'
import lodash from 'lodash'
let file = new filemage()
let Cfg = await file.getyaml("config/baoshi")
let apps = {
    id: 'recordApi',
    name: '语音',
    desc: '语音',
    event: 'message',
    rule: []
}

let bscfg = {
    isChieseTime: false,
    isImg: false,
    isCored: false
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

await ds("bs", `0 0 ${Cfg.htime} * * *`, async () => {
    let grouplist = JSON.parse(await redis.get('qianyu:bstime:grouplist')) || []
    for (let g of grouplist) {
        bscfg = JSON.parse(await redis.get(`qianyu:bstime:config:${g}`)) || bscfg
        let msg = []
        let hour = moment().hour()
        if (bscfg.isChieseTime) {
            hour = Cfg.chineseTime[hour]
        }
        msg.push(`现在是北京时间${hour}点整~`)
        if (bscfg.isImg && !bscfg.isCored) {
            msg.push(segment.image("https://img.xjh.me/random_img.php?return=302"))
        }
        if (bscfg.isCored) {
            let index = Cfg.htime.indexOf(moment().hour())
            msg[0] = `${hour}点了，${Cfg.CoredText[index]}`
            if (bscfg.isImg) {
                msg[1] = segment.image(`./plugins/qianyu-plugin/resources/img/可莉/可莉${lodash.random(1, 14)}.jpg`)
            }
            msg[2] = segment.record(`./plugins/qianyu-plugin/resources/record/报时/${moment().hour()}.ogg`)
        }
        for (let m of msg) {
            Bot.sendGroupMsg(g, m)
            await sleep(1000)
        }
    }
})

export default apps
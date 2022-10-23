import moment from 'moment'
import { segment } from 'oicq'
import { cacelds, ds } from "../utils/schedule.js"
import { filemage } from '../utils/filemage.js';
import lodash from 'lodash'
let file = new filemage()
let Cfg = await file.getyaml("config/baoshi")

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class bstime extends plugin {
    constructor() {
        super({
            /** 功能名称asa */
            name: '报时',
            /** 功能描述 */
            dsc: '千羽报时',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^报时设置',
                    fnc: 'bscofig'
                }
            ]
        })
    }

    async bscofig(e) {
        if (!e.isMaster) {
            return this.reply("暂无权限！")
        }
        let parms = e.msg.replace("报时设置", "")
        let cofig = await getcofig()
        if (parms == "") {
            let msg = [`中文报时[${cofig.isChieseTime ? "开启" : "关闭"}]\n`,
            `图片报时[${cofig.isImg ? "开启" : "关闭"}]\n`,
            `语音报时[${cofig.isCored ? "开启" : "关闭"}]\n`,
            `群报时[${cofig.grouplist.includes(e.group_id) ? "开启" : "关闭"}]`
            ]

            return this.reply(msg)
        }
        if (parms.includes("群报时")) {
            console.log(e.group_id)
            let p = parms.replace("群报时", "")
            if (p == "开启") {
                if (cofig.grouplist.includes(e.group_id)) {
                    return this.reply("群报时已经开启过了~")
                } else {
                    cofig.grouplist.push(e.group_id)
                    await this.setcofig('grouplist', JSON.stringify(cofig.grouplist))
                    return this.reply("群报时已开启！")
                }
            } else if (p == '关闭') {
                if (cofig.grouplist.includes(e.group_id)) {
                    let index = cofig.grouplist.indexOf(e.group_id)
                    cofig.grouplist.splice(index, 1)
                    await this.setcofig('grouplist', JSON.stringify(cofig.grouplist))
                    return this.reply("群报时已经关闭！")
                } else {
                    return this.reply("群报时还未开启！")
                }
            } else {
                return this.reply("无效的设置！")
            }
        }
        else if (parms.includes("中文报时")) {
            console.log("中文报时")
            let p = parms.replace("中文报时", "")
            await this.bssetcofig('isChieseTime', p, '中文报时')
        }
        else if (parms.includes("图片报时")) {
            let p = parms.replace("图片报时", "")
            await this.bssetcofig('isImg', p, '图片报时')
        }
        else if (parms.includes("语音报时")) {
            let p = parms.replace("语音报时", "")
            await this.bssetcofig('isCored', p, '语音报时')
        } else {
            return this.reply("无效的设置！")
        }

    }

    async bssetcofig(name, isopen, val) {
        if (isopen == '开启') {
            await this.setcofig(name, "1")
            return this.reply(`${val}已开启！`)
        } else {
            await this.deletecofig(name)
            return this.reply(`${val}已关闭！`)
        }
    }


    async setcofig(name, val) {
        await redis.set(`qianyu:bstime:${name}`, val).then(() => {
            logger.mark(`[千羽]已启用${name}`)
        }).catch(err => {
            logger.error(`[千羽]启用失败${name}`, err)
        })
    }

    async deletecofig(name) {
        await redis.del(`qianyu:bstime:${name}`).then(() => {
            logger.mark(`[千羽]已关闭${name}`)
        }).catch(err => {
            logger.error(`[千羽]关闭失败${name}`, err)
        })
    }

}

async function getcofig() {
    let isChieseTime = await redis.get('qianyu:bstime:isChieseTime') || false
    let isImg = await redis.get('qianyu:bstime:isImg') || false
    let isCored = await redis.get('qianyu:bstime:isCored') || false
    let grouplist = JSON.parse(await redis.get('qianyu:bstime:grouplist')) || []
    return {
        isChieseTime: isChieseTime,
        isImg: isImg,
        isCored: isCored,
        grouplist: grouplist
    }
}
let cofig = await getcofig()
if (cofig.grouplist != null) {
    await cacelds("bs")
    await ds("bs", `0 * ${Cfg.htime} * * *`, async () => {
        cofig = await getcofig()
        for (let g of cofig.grouplist) {
            let msg = []
            let hour = moment().hour()
            if (cofig.isChieseTime) {
                hour = Cfg.chineseTime[hour]
            }
            msg.push(`现在是北京时间${hour}点整~`)
            if (cofig.isImg && !cofig.isCored) {
                msg.push(segment.image("https://img.xjh.me/random_img.php?return=302"))
            }
            if (cofig.isCored) {
                let index = Cfg.htime.indexOf(moment().hour())
                msg[0] = `${hour}点了，${Cfg.CoredText[index]}`
                msg[1] = segment.image(`./plugins/qianyu-plugin/resources/img/可莉/可莉${lodash.random(1, 14)}.jpg`)
                let cord = segment.record(`./plugins/qianyu-plugin/resources/报时/${moment().hour()}.ogg`);
                Bot.sendGroupMsg(g, cord)
            }
            Bot.sendGroupMsg(g, msg)
            sleep(500)
        }
    })
} 
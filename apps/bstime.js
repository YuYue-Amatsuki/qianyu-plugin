/**
 * @Author: uixmsi
 * @Date: 2022-10-02 16:25:35
 * @LastEditTime: 2022-10-04 12:02:53
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\bstime.js
 * @版权声明
 **/
import moment from 'moment'
import { segment } from 'oicq'
import { cacelds, ds } from "../utils/schedule.js"
import plugin from '../../../lib/plugins/plugin.js'
import { filemage } from '../utils/filemage.js';
let file = new filemage()
let cofig = await file.getyaml("baoshi_config")
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
                    reg: '^报时设置$',
                    fnc: 'bscofig'
                },

            ]
        })
    }

    async bscofig(e) {
        let msg = [`中文报时[${cofig.isChieseTime ? "开启" : "关闭"}]\n`,
        `图片报时[${cofig.isImg ? "开启" : "关闭"}]\n`,
        `语音报时[${cofig.isCored ? "开启" : "关闭"}]\n`,
        `表情报时[${cofig.isBiaoqing ? "开启" : "关闭"}]\n`,
        ]
        this.reply(msg)
    }

}

await cacelds("bs")
await ds("bs", `0 0 ${cofig.htime} * * *`, async () => {
    for (let g of cofig.grouplist) {
        let msg = []
        let hour = moment().hour()
        if (cofig.isChieseTime) {
            hour = cofig.chineseTime[hour]
        }
        msg.push(`现在是北京时间${hour}点整`)
        if (cofig.isImg) {
            msg.push(segment.image("https://img.xjh.me/random_img.php?return=302"))
        }
        if (cofig.isCored) {
            let index = cofig.htime.indexOf(moment().hour())
            msg[0] = `${hour}点了，${cofig.CoredText[index]}`
            let cord = segment.record(`./plugins/qianyu-plugin/resources/报时/${moment().hour()}.ogg`);
            Bot.sendGroupMsg(g, cord)
        }
        Bot.sendGroupMsg(g, msg)
    }
})




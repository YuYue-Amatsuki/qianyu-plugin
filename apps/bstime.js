/**
 * @Author: uixmsi
 * @Date: 2022-10-02 16:25:35
 * @LastEditTime: 2022-10-03 23:30:34
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\bstime.js
 * @版权声明
 **/
import moment from 'moment'
import { segment } from 'oicq'
import { cacelds, ds } from "../utils/schedule.js"
import plugin from '../../../lib/plugins/plugin.js'
let grouplist = [213311278]
let htime = [0, 1, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
let chineseTime = ['零', '一', '两', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三']
let cofig = {
    isChieseTime: true,//是否中文
    isImg: true,//是否有图片
    isCored: true,//是否语音
    isBiaoqing: false//是否表情
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
await ds("bs", `0 0 ${htime} * * *`, async () => {
    for (let g of grouplist) {
        let msg = []
        let hour = moment().hour()
        if (cofig.isChieseTime) {
            hour = chineseTime[hour]
        }
        msg.push(`现在是北京时间${hour}点整`)
        if (cofig.isImg) {
            msg.push(segment.image("https://img.xjh.me/random_img.php?return=302"))
        }
        if (cofig.isCored) {
            let cord = segment.record(`./plugins/qianyu-plugin/resources/报时/${moment().hour()}.ogg`);
            Bot.sendGroupMsg(g, cord)
        }
        Bot.sendGroupMsg(g, msg)
    }
})


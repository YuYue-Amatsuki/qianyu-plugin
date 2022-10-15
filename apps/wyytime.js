import { ds } from '../utils/schedule.js'
import { filemage } from '../utils/filemage.js';
import { segment } from 'oicq'
import lodash from 'lodash'
let grouplist = [
    213311278
]
let file = new filemage()
let title = [
    "我们生而为人，我们生而陌路",
    "自作自受，自生自灭，自导自演，自痴自笑",
    "我即为地狱",
    "我们是家长手中的商品，我们被互相攀比和折磨着，我们无从选择"
    ,
    "   生    死"
    ,
    "无人生还。"
    ,
    "自作多情吧？其实你根本一直都是一个人好吗？"
    ,
    " 愿 孤 独 与 我 永 远 相 伴 。"
    ,
    " 理解，所有不辞而别。"
    ,
    "梦里，你也不属于我"
    ,
    "我总不能耗尽一生，等你一句有可能。"
    ,
    "没人会爱你的"
    ,
    "来梦里看看我吧，求你了"
    ,
    "是时候结束了。"
    ,
    "你，后悔吗？"
    ,
    "我再问你一遍，你真的能忘记那个人吗？"

    , "你不明白满怀期待的心酸"
]
export class help extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '网易云时间',
            /** 功能描述 */
            dsc: '网易云时间',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
        })
        this.task = {
            cron: '0 0 0 * * ?',
            name: '查询人物动作是否完成',
            fnc: () => this.wyyyy()
        }
    }

    async wyyyy(e) {
        let data = await file.getlist("resources/wyy")
        let random = lodash.random(1, data.length)
        let msg = [`网易云电台时间:\n今天的主题是：${title[random - 1]}`]
        for (let g of grouplist) {
            Bot.sendGroupMsg(g, msg)
            Bot.sendGroupMsg(g, segment.record(process.cwd() + `/plugins/qianyu-plugin/resources/wyy/网易云最丧评论${random}.mp3`))
        }

    }

}


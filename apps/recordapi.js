/**
 * @Author: uixmsi
 * @Date: 2022-10-15 21:28:31
 * @LastEditTime: 2022-10-15 21:50:12
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\recordapi.js
 * @版权声明
 **/
import { segment } from 'oicq'
import { Api } from '../lib/api.js'
let api = new Api()
let textlist = await api.getApiList('record')
let reg = getreg()
export class recordContent extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '音频api',
            /** 功能描述 */
            dsc: '一句话',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: reg,
                    fnc: 'apirecord'
                }
            ]
        })
    }
    async apirecord(e) {
        let parm;
        let msg = e.msg
        let tkx = /(糗事播报段子来了|波波有理|妙宇连朱|非常溜佳期|今晚脱口秀|娱乐逗翻天|上班脱口秀)/
        if (tkx.test(msg)) {
            parm = encodeURI(e.msg)
            msg = "(糗事播报段子来了|波波有理|妙宇连朱|非常溜佳期|今晚脱口秀|娱乐逗翻天|上班脱口秀)"
        }
        await api.getRecord(msg, async (res) => {
            let reslist = res.res.split("播放链接:")
            this.reply(segment.record(reslist[1]))
        }, parm)
    }


}
function getreg() {
    let reg = ''
    textlist.recordapi.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.name}$`
    });
    return reg
}

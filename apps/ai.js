/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-05 17:08:36
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\ai.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import { geturldata, geturldata2 } from '../utils/request.js'
export class botai extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '文本api',
            /** 功能描述 */
            dsc: '一句话',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 100000,
            rule: [
                {
                    reg: '',
                    fnc: 'ffai'
                }
            ]
        })
    }
    async ffai(e) {
        await geturldata2(`https://api.ddwoo.top/api/ff.php?msg=${encodeURI(e.msg)}`, (res) => {
            let msglist = res.split("━━━━━━━━━")
            let msg = msglist[1].replace(/\n/g, "")
            this.reply(msg)
        })
    }

}

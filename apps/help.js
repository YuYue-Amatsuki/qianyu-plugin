/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-08 15:56:15
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\help.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import { returnImg } from "../utils/puppeteer.js"
import { filemage } from '../utils/filemage.js';
let file = new filemage()
export class help extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '千羽帮助',
            /** 功能描述 */
            dsc: '千羽帮助',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^千羽帮助$',
                    fnc: 'qianyu_help'
                },

            ]
        })
    }

    //千羽帮助
    async qianyu_help(e) {
        let data = await file.getyaml("config/help")
        let img = await returnImg('help', data)
        this.reply(img)
    }

}
let baoshi = await file.getyaml("config/baoshi")
let grouplist = []
grouplist.push(1738384845)
baoshi.grouplist = grouplist
console.log(baoshi)
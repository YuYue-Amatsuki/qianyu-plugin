/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-04 11:50:51
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\help.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
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
        let helplist = await file.getyaml("help_cofig")
        let img = await puppeteer.screenshot("help", {
            tplFile: `./plugins/qianyu-plugin/resources/help/help.html`,
            _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
            /** 绝对路径 */
            helplist: helplist.helplist
        });
        this.reply(img)
    }

}

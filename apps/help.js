/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-09-29 00:52:19
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\help.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import { segment } from "oicq"
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

    //修仙帮助
    async qianyu_help(e) {
        let helplist = [
            {
                title: '记录挖矿/狗粮时间',
                desc: '记下当前时间挖矿时间，三/一天后提醒'
            },
            {
                title: '水晶矿/狗粮刷新时间',
                desc: '查看水晶矿狗粮冷却'
            },
            {
                title: '挖矿记录',
                desc: '统计挖矿记录'
            },
            {
                title: '水晶矿路线图',
                desc: '发送一张水晶矿采集路线图'
            },
            {
                title: '定时列表',
                desc: '获取所有定时'
            }
        ]
        let img = await puppeteer.screenshot("help", {
            tplFile: `./plugins/qianyu-plugin/resources/help/help.html`,
            _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
            /** 绝对路径 */
            helplist: helplist
        });
        this.reply(img)
    }

}
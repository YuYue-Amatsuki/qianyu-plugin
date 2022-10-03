/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-03 23:55:58
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\help.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import { segment } from "oicq"
import YAML from 'yaml'
import fs from 'node:fs'
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
        let helplist = YAML.parse(fs.readFileSync(`${process.cwd()}/plugins/qianyu-plugin/config/help_cofig.yaml`, "utf-8"))
        let img = await puppeteer.screenshot("help", {
            tplFile: `./plugins/qianyu-plugin/resources/help/help.html`,
            _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
            /** 绝对路径 */
            helplist: helplist.helplist
        });
        this.reply(img)
    }

}

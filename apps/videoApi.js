/**
 * @Author: uixmsi
 * @Date: 2022-10-02 16:25:35
 * @LastEditTime: 2022-10-08 15:49:20
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\videoApi.js
 * @版权声明
 **/
import moment from 'moment'
import { segment } from 'oicq'
import { cacelds, ds } from "../utils/schedule.js"
import plugin from '../../../lib/plugins/plugin.js'
import { filemage } from '../utils/filemage.js';
let file = new filemage()
let cofig = await file.getyaml("config/baoshi")
export class video extends plugin {
    constructor() {
        super({
            /** 功能名称asa */
            name: '视频',
            /** 功能描述 */
            dsc: '视频api整合',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^发个视频$',
                    fnc: 'sendvideo'
                },

            ]
        })
    }
}

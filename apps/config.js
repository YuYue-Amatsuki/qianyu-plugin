/**
 * @Author: uixmsi
 * @Date: 2022-10-08 15:51:16
 * @LastEditTime: 2022-10-10 01:12:26
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\config.js
 * @版权声明
 **/
/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-05 17:13:10
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
            name: '千羽设置',
            /** 功能描述 */
            dsc: '千羽设置',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^千羽设置$',
                    fnc: 'qianyu_config'
                },

            ]
        })
    }

    //千羽设置
    async qianyu_config(e) {
        let ai = await file.getyaml("config/ai/ai")
        let gailist = await file.getyaml("config/ai/group")
        let gai;
        let num = ['零', '一']
        for (let i in gailist) {
            if (i == e.group_id) {
                gai = gailist[i]
            }
        }
        let configlist = [
            {
                title: 'AI相关',
                configlist: [
                    {
                        name: '私聊ai',
                        reg: 'ai设置私聊开启/关闭',
                        status: ai.isPrivate,
                        desc: '私聊ai设置'
                    },
                    {
                        name: '群聊ai',
                        reg: 'ai设置群聊开启/关闭',
                        status: ai.isGroup,
                        desc: '群聊ai设置(关闭群ai不生效)'
                    },
                    {
                        name: 'ai触发概率',
                        reg: 'ai设置概率100（0-100）',
                        status: ai.probability > 1 ? ai.probability : num[ai.probability],
                        desc: 'ai设置触发概率（私聊概率）'
                    },
                    {
                        name: '私聊ai',
                        reg: 'ai设置青云客',
                        status: ai.ai,
                        desc: '可以设置ai为菲菲、青云客、小源、夸克、小爱同学、思知'
                    },
                    {
                        name: '群ai开关',
                        reg: 'ai设置群ai开启/关闭',
                        status: gai == undefined ? false : gai.isopen,
                        desc: 'ai设置触发概率设置（每个群独立配置）'
                    },
                    {
                        name: '群ai触发概率',
                        reg: 'ai设置概率100（0-100）',
                        status: gai == undefined ? 100 : gai.probability > 1 ? gai.probability : num[gai.probability],
                        desc: 'ai设置触发概率设置（每个群独立配置）'
                    },
                    {
                        name: '群聊ai',
                        reg: 'ai设置青云客',
                        status: gai == undefined ? ai.ai : gai.ai,
                        desc: '可以设置ai为菲菲、青云客、小源、夸克、小爱同学、思知'
                    },

                ]
            }
        ]
        let img = await returnImg('admin', {
            data: configlist
        })

        this.reply(img)
    }

}
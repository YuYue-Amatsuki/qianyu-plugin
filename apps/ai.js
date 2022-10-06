/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-06 15:06:51
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\ai.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import { geturldata } from '../utils/request.js'
import { filemage } from '../utils/filemage.js'
import lodash from 'lodash'
let file = new filemage()
export class botai extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '文本api',
            /** 功能描述 */
            dsc: '一句话',
            event: 'message',
            /** 优先级，数字越小等级越高 fd*/
            priority: 100000,
            rule: [
                {
                    reg: '^ai设置',
                    fnc: 'aiconfig'
                },
                {
                    reg: '^ai帮助',
                    fnc: 'aihelp'
                },
                {
                    reg: '',
                    fnc: 'ffai'
                }
            ]
        })
    }
    async ffai(e) {
        let config = await file.getyaml("config/ai/ai")
        let groupconfig = await file.getyaml("config/ai/group")
        let radom = lodash.random(0, 100)
        if (e.isGroup) {
            if (config.isGroup == false) return ""
            for (let i in groupconfig) {
                if (i == e.group_id) {
                    let gconfig = groupconfig[i]
                    if (gconfig.isopen) {
                        if (radom <= gconfig.probability) {
                            await this.getff(e)
                        }
                    }
                }
            }
        }
        if (e.isPrivate) {
            if (config.isPrivate == false) return ""
            if (radom <= config.probability) {
                await this.getff(e)
            }
        }
    }

    //菲菲ai
    async getff(e) {
        await geturldata(`https://api.ddwoo.top/api/ff.php?msg=${encodeURI(e.msg)}`, 'data', (res) => {
            console.log(res)
            let msglist = res.split("━━━━━━━━━")
            let msg = msglist[1].replace(/\n/g, "")
            this.reply(msg)
        })
    }

    async aiconfig(e) {
        let config = await file.getyaml("config/ai/ai")
        let groupconfig = await file.getyaml("config/ai/group")
        let parm = e.msg.replace("ai设置", "")
        if (e.isPrivate) {
            if (!e.isMaster) {
                return this.reply("暂无权限")
            } else {
                if (parm.includes('开启')) {
                    await this.aiopenclose(e, config, parm, "开启", true)
                }
                if (parm.includes('关闭')) {
                    await this.aiopenclose(e, config, parm, "关闭", false)
                }
                if (parm.includes('概率')) {
                    await this.aiSetProbability(e, config, parm)
                }

            }
        }
        if (e.isGroup) {
            if (e.isMaster || e.member.is_owner || e.member.is_admin) {
                if (parm.includes('开启')) {
                    await this.aiopenclose(e, groupconfig, parm, "开启", true)
                }
                if (parm.includes('关闭')) {
                    await this.aiopenclose(e, groupconfig, parm, "关闭", false)
                }
                if (parm.includes('概率')) {
                    await this.aiSetProbability(e, groupconfig, parm)
                }
            } else {
                return this.reply("暂无权限")
            }
        }
    }

    //ai帮助
    async aihelp(e) {
        let msg = "ai帮助\n\t\tai设置(私聊/群聊)开启（仅支持私聊设置）\n\t\tai设置概率(0-100)（私聊设置概率仅影响私聊，群聊一样不互相影响）\n\t\tai设置群聊关闭后所有群的ai都不会触发\n\t\tai设置群ai关闭/开启和概率每个群都是独立的\n\t\t后期将进行单个群聊ai指定，敬请期待！\n"
        this.reply(msg)
    }

    async aiopenclose(e, config, parm, type, isopen) {
        let p = parm.replace(type, "")
        if (p == "私聊") {
            config.isPrivate = isopen
        } else if (p == "群聊") {
            config.isGroup = isopen
        } else if (p == "群ai") {
            let isexist = false
            for (let i in config) {
                if (i == e.group_id) {
                    isexist = true
                    config[i].isopen = isopen
                }
            }
            if (!isexist) {
                config[e.group_id] = {
                    isopen: isopen,
                    probability: 100
                }
            }

            await file.writeyaml("config/ai/group", config)
            return this.reply(`${p}设置已${type}!`)
        } else {
            return this.reply("无效的设置")
        }
        this.reply(`${p}设置已${type}!`)
        await file.writeyaml("config/ai/ai", config)
    }

    async aiSetProbability(e, config, parm) {
        let gl = Number(parm.replace("概率", ""))
        if (gl > 100 || gl < 0) {
            return this.reply("ai触发的概率的合法值在0-100，请重新设置！")
        }
        if (e.isGroup) {
            let isexist = false
            for (let i in config) {
                if (i == e.group_id) {
                    isexist = true
                    config[i].probability = gl
                }
            }
            if (!isexist) {
                config[e.group_id] = {
                    isopen: true,
                    probability: gl
                }
            }
            this.reply(`群ai触发概率设置为${gl}!`)
            await file.writeyaml("config/ai/group", config)
        }
        if (e.isPrivate) {
            config.probability = gl
            this.reply(`ai触发概率设置为${gl}!`)
            await file.writeyaml("config/ai/ai", config)
        }
    }

}
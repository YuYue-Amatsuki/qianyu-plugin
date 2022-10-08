/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-08 21:44:21
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
                            await this.getai(e, config.ai, gconfig.ai)
                        }
                    }
                }
            }
        }
        if (e.isPrivate) {
            if (config.isPrivate == false) return ""
            if (radom <= config.probability) {
                await this.getai(e, config.ai)
            }
        }
    }

    //ai
    async getai(e, ai, gconfig) {
        if (e.isPrivate) {
            await this.choieai(e.msg, ai)
        }
        if (e.isGroup) {
            if (!gconfig) {
                gconfig = ai
            }
            await this.choieai(e.msg, gconfig)
        }


    }

    async choieai(msg, ai) {
        let aidata = await file.getyaml("config/api/ai")
        let ailist = aidata.ailist
        ailist.forEach(async list => {
            if (list.name == ai) {
                await geturldata(`${list.url}${encodeURI(msg)}`, list.data, (res) => {
                    let respose;
                    if (ai == '菲菲') {
                        let msglist = res.split("━━━━━━━━━")
                        respose = msglist[1].replace(/\n/g, "")
                    } else {
                        respose = res
                    }
                    this.reply(`${respose}`)
                })
            }
        });
    }

    async aiconfig(e) {
        let config = await file.getyaml("config/ai/ai")
        let groupconfig = await file.getyaml("config/ai/group")
        let aidata = await file.getyaml("config/api/ai")
        let ailist = aidata.ailist
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
                ailist.forEach(async (item) => {
                    if (parm == item.name) {
                        await this.setai(e, config, parm)
                    }
                })
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
                ailist.forEach(async (item) => {
                    if (parm == item.name) {
                        await this.setai(e, groupconfig, parm)
                    }
                })
            } else {
                return this.reply("暂无权限")
            }
        }
    }

    async setai(e, config, ai) {
        if (e.isPrivate) {
            config.ai = ai
            await file.writeyaml("config/ai/ai", config)
            return this.reply(`ai回复设置为${ai}!`)
        } else {
            let isexist = false
            for (let i in config) {
                if (i == e.group_id) {
                    isexist = true
                    config[i].ai = ai
                }
            }
            if (!isexist) {
                config[e.group_id] = {
                    isopen: true,
                    probability: 100,
                    ai: ai
                }
            }
            await file.writeyaml("config/ai/group", config)
            return this.reply(`ai回复设置为${ai}!`)
        }
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
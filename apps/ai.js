import { geturldata } from '../utils/request.js'
import { filemage } from '../utils/filemage.js'
import Cfg from '../../../lib/config/config.js'
import lodash from 'lodash'
let file = new filemage()
let cofig = {
    isPrivate: true,
    isGroup: true,
    probability: 100,
    ai: "思知"
}

export class botai extends plugin {
    constructor() {
        super({
            name: '人工智障ai',
            dsc: '一句话',
            event: 'message',
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
        let radom = lodash.random(1, 100)
        if (e.isGroup) {
            let gcfg = Cfg.getGroup(e.group_id)
            let gqz = gcfg.botAlias
            let gz = gqz.join("|")
            let reg = new RegExp(`${gz}`)
            if (config.isGroup == false) return ""
            if (e.atBot || reg.test(e.raw_message)) {
                return await this.getai(e, config.ai, groupconfig.ai)
            }
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

    async getAiCfg() {

    }

    async choieai(msg, ai) {
        let aidata = await file.getyaml("resources/data/api/ai")
        let botname = await redis.get(`qianyu:ai:botname`)
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
                    this.reply(`${respose.replace(/小思|菲菲|小爱/g, botname ? botname : ai)}`)
                })
            }
        });
    }

    async aiconfig(e) {
        let config = await file.getyaml("config/ai/ai")
        let groupconfig = await file.getyaml("config/ai/group")
        let aidata = await file.getyaml("resources/data/api/ai")
        let ailist = aidata.ailist
        let parm = e.msg.replace("ai设置", "")
        if (parm.includes("名称")) {
            let name = parm.replace("名称", "")
            await redis.set(`qianyu:ai:botname`, name).then(() => {
                logger.mark(`[千羽]ai设置名称${name}`)
            }).catch(err => {
                logger.error(`[千羽]ai设置名称失败${name}`, err)
            })
            return this.reply(`ai设置名称为${name}`)
        }
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
        console.log(p)
        if (e.isPrivate && p == "群ai") {
            return this.reply("无效的设置")
        }
        if (e.isGroup && (p == "私聊" || p == "群聊")) {
            return this.reply("无效的设置")
        }
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

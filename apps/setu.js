import { getDate } from '../utils/dateFormat.js'
import { segment } from 'oicq'
import { Api } from '../lib/api.js'
let api = new Api()
export class setu extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '千羽涩图',
            /** 功能描述 */
            dsc: '涩图涩图',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^涩图设置',
                    fnc: 'setuset'
                },
                {
                    reg: '^搜索',
                    fnc: 'soutur18'
                },
                {
                    reg: '^随机涩图',
                    fnc: 'sjsetu'
                }

            ]
        })
    }
    async setuset(e) {
        let set = e.msg.replace("涩图设置", "")
        let isch = await redis.get(`qianyu:setu:chehui:${e.group_id}`)
        let chcd = await redis.get(`qianyu:setu:chehuicd:${e.group_id}`)
        if (!e.isMaster) {
            return this.reply(`暂无权限设置！`)
        }
        if (set == "") {
            return this.reply(`随机涩图撤回【${(isch == null ? false : true) ? '开启' : '关闭'}】\n随机涩图撤回cd【${isch == null ? '不撤回' : chcd ? chcd : 15}】`)
        }
        if (e.isGroup) {
            if (set.includes("群黑名单")) {
                let msg = set.replace("群黑名单", "")
                let groupblack = await redis.get(`qianyu:setu:groupblack:${e.group_id}`)
                if (msg == "开启") {
                    if (groupblack) {
                        return this.reply("这个群已经在我的黑名单里小本本记下了！")
                    } else {
                        await this.setcofig(`groupblack:${e.group_id}`, "1")
                        this.reply("黑名单小本本记下来。")
                        return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/小本本记下.jpg"))
                    }
                } else if (msg == "关闭") {
                    if (groupblack) {
                        await this.deletecofig(`groupblack:${e.group_id}`)
                        this.reply("黑名单已经划掉啦~")
                        return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/开心.jpg"))
                    } else {
                        return this.reply("这个群不在黑名单里哦！")
                    }

                } else {
                    return this.reply("无效的设置！")
                }
            }
        }

        if (set.includes("r18")) {
            let r18set = set.replace("r18", "")
            if (r18set.includes("撤回")) {
                let msg = r18set.replace("撤回", "")
                if (msg == "开启") {
                    await this.setcofig(`r18chehui`, "true")
                } else if (msg == "关闭") {
                    await this.deletecofig(`r18chehui`)
                } else {
                    return this.reply("无效的设置！")
                }
                return this.reply(`r18涩图撤回已【${msg}】`)
            }
            if (r18set > 0 && r18set <= 120) {
                await this.setcofig(`r18cd`, `${r18set}`)
                return this.reply(`r18涩图撤回cd设置为${r18set}秒！`)
            } else {
                return this.reply(`cd设置无效！cd设置范围为1-120秒`)
            }
        } else {
            if (set.includes("撤回")) {
                let msg = set.replace("撤回", "")
                if (msg == "开启") {
                    await this.setcofig(`chehui:${e.group_id}`, "true")
                } else if (msg == "关闭") {
                    await this.deletecofig(`chehui:${e.group_id}`)
                } else {
                    return this.reply("无效的设置！")
                }
                return this.reply(`随机涩图撤回已【${msg}】`)
            }
            if (set > 0 && set <= 120) {
                await this.setcofig(`chehuicd:${e.group_id}`, `${set}`)
                return this.reply(`随机涩图撤回cd设置为${set}秒！`)
            } else {
                return this.reply(`cd设置无效！cd设置范围为1-120秒`)
            }
        }


    }

    async sjsetu(e) {
        let groupblack = await redis.get(`qianyu:setu:groupblack:${e.group_id}`)
        if (groupblack) {
            return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/不可以瑟瑟.jpg"))
        }
        let url = "https://ovooa.com/API/Pximg/"
        await api.getapi(url, ['data', "urls", "original"], async (res) => {
            await this.sendmsg(e, res)
        })
    }

    async soutur18(e) {
        if (e.isGroup) {
            this.reply("群里不可以瑟瑟")
            return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/不可以瑟瑟.jpg"))
        }
        let r18cd = await redis.get(`qianyu:setu:r18cd`)//r18cd
        let r18ch = await redis.get(`qianyu:setu:r18chehui`)//r18撤回
        let keyword = e.msg.replace("搜索", "")
        let url = `https://api.lolicon.app/setu/v2?tag=${encodeURI(keyword)}&proxy=i.pixiv.re&r18=1`
        await api.getapi(url, ['data', '0'], async (res) => {
            let resurl = res.urls.original//.replace("i.pixiv.re", "i.acgmx.com")
            let tags = '';
            res.tags.forEach((item, index) => {
                tags += item + (index == res.tags.length - 1 ? '' : '、')
            });
            let msg = [
                `标题:  ${res.title}\n`,
                `作者:  ${res.author}\n`,
                `作品ID:  ${res.pid}\n`,
                `作者ID:  ${res.uid}\n`,
                `标签:  ${tags}\n`,
                `上传日期:  ${getDate(res.uploadDate, '-')}\n`,
                segment.image(resurl)
            ]
            await this.reply(msg, false, e.isMaster ? undefined : r18ch ? { recallMsg: r18cd ? r18cd : 15 } : r18ch == null ? undefined : { recallMsg: r18cd ? r18cd : 15 })
        }).catch((err) => {
            this.reply("没有搜到这个结果呢~")
        })
    }

    async sendmsg(e, res) {
        let isch = await redis.get(`qianyu:setu:chehui:${e.group_id}`)
        isch = isch == null ? false : true
        let chcd = await redis.get(`qianyu:setu:chehuicd:${e.group_id}`)
        let msg;
        if (e.isGroup) {
            msg = await Bot.pickGroup(e.group_id).sendMsg(segment.image(res)).catch(async function (err) {
                msg = await Bot.pickGroup(e.group_id).sendMsg(`图片被风控了，被风控的图片是${res}！`)
                let msgid = msg.message_id
                if (isch) {
                    setTimeout(() => {
                        e.group.recallMsg(msgid);
                    }, (chcd ? chcd : 15) * 1000);
                }
            })
            if (msg && isch) {
                setTimeout(() => {
                    e.group.recallMsg(msg.message_id);
                }, (chcd ? chcd : 15) * 1000);
            }
        } else {
            msg = await Bot.pickUser(e.user_id).sendMsg(segment.image(res)).catch(async function (err) {
                msg = await Bot.pickUser(e.user_id).sendMsg(`图片被风控了，被风控的图片是${res}！`)
            })
            if (msg && isch) {
                setTimeout(() => {
                    e.friend.recallMsg(msg.message_id);
                }, (chcd ? chcd : 15) * 1000);
            }
        }
    }

    async setcofig(name, val) {
        await redis.set(`qianyu:setu:${name}`, val).then(() => {
            logger.mark(`[千羽]已启用${name}`)
        }).catch(err => {
            logger.error(`[千羽]启用失败${name}`, err)
        })
    }

    async deletecofig(name) {
        await redis.del(`qianyu:setu:${name}`).then(() => {
            logger.mark(`[千羽]已关闭${name}`)
        }).catch(err => {
            logger.error(`[千羽]关闭失败${name}`, err)
        })
    }
}

/**
 * @Author: uixmsi
 * @Date: 2022-10-07 17:11:51
 * @LastEditTime: 2022-10-18 01:28:15
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\imageApi.js
 * @版权声明
 **/
import { segment } from 'oicq'
import { Api } from '../lib/api.js'
let api = new Api()
let textlist = await api.getApiList('image')
let reg = getreg()
let stcd = 15//随机涩图cd 单位s
let chehui = true //是否撤回
let blackgroup = []
export class imgContent extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '图片api',
            /** 功能描述 */
            dsc: '返回张图',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: reg,
                    fnc: 'apiimg'
                },
                {
                    reg: '^涩图设置',
                    fnc: 'setuset'
                },
                {
                    reg: '^搜索',
                    fnc: 'soutur18'
                }
            ]
        })
    }
    async setuset(e) {
        let set = e.msg.replace("涩图设置", "")
        if (!e.isMaster) {
            return this.reply(`暂无权限设置！`)
        }
        if (set == "") {
            return this.reply(`涩图撤回【${chehui ? '开启' : '关闭'}】\n涩图撤回cd【${stcd}】`)
        }
        if (e.isGroup) {
            if (set.includes("群黑名单")) {
                let msg = set.replace("群黑名单", "")
                let gisexeit;
                blackgroup.forEach((item) => {
                    if (item == e.group_id) {
                        gisexeit = true
                    }
                })
                if (msg == "开启") {
                    if (gisexeit) {
                        return this.reply("这个群已经在我的黑名单里小本本记下了！")
                    } else {
                        blackgroup.push(e.group_id)
                        this.reply("黑名单小本本记下来。")
                        return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/小本本记下.jpg"))
                    }
                } else if (msg == "关闭") {
                    if (gisexeit) {
                        blackgroup.forEach((item, index) => {
                            if (item == e.group_id) {
                                blackgroup.splice(index, 1)
                            }
                        })
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

        if (set.includes("撤回")) {
            let msg = set.replace("撤回", "")
            if (msg == "开启") {
                chehui = true
            } else if (msg == "关闭") {
                chehui = false
            } else {
                return this.reply("无效的设置！")
            }
            return this.reply(`涩图撤回已【${chehui ? '开启' : '关闭'}】`)
        }
        if (set > 0 && set < 120) {
            stcd = set
            return this.reply(`涩图撤回cd设置为【${stcd}】秒！`)
        } else {
            return this.reply(`cd设置无效！cd设置范围为1-119秒`)
        }
    }

    async soutur18(e) {
        if (e.isGroup) {
            this.reply("群里不可以瑟瑟")
            return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/不可以瑟瑟.jpg"))
        }
        let keyword = e.msg.replace("搜索", "")
        let url = `https://api.lolicon.app/setu/v2?tag=${encodeURI(keyword)}&proxy=i.pixiv.re&r18=1`
        await api.getapi(url, ['data', '0', 'urls', 'original'], async (res) => {
            let resurl = res.replace("i.pixiv.re", "i.acgmx.com")
            let msg = await this.reply(segment.flash(resurl))
            setTimeout(() => {
                e.friend.recallMsg(msg.message_id);
            }, 30 * 1000);
        }).catch((err) => {
            this.reply("没有搜到这个结果呢~")
        })
    }

    async apiimg(e) {
        let parm;
        let msg = e.msg
        let cate = /(女仆|jk制服|兔女郎|夏日泳装|动漫类|幼齿|萝莉|少女|御姐|巨乳|丰满微胖|黑丝|白丝|肉丝|网丝|吊带袜|腿控|脚控|臀控|旗袍)/
        let tx = ['男头', '女头', '动漫头像', "动漫女头", "动漫男头"]
        if (tx.includes(msg)) {
            let cs = ['a1', 'b1', 'c1', 'c2', 'c3']
            parm = cs[tx.indexOf(msg)] + "&format=images"
            msg = "(男头|女头|动漫头像|动漫男头|动漫女头)"
        }
        if (msg.includes("米游社表情包")) {
            parm = msg.replace("米游社表情包", "") == null ? undefined : msg.replace("米游社表情包", "")
            msg = "米游社表情包$|^米游社表情包(0|1|2|3|4)"
        }
        if (msg == '甘城猫猫表情包' || msg == '猫羽雫表情包') {
            msg = "(甘城猫猫|^猫羽雫)表情包"
        }
        if (cate.test(msg)) {
            msg = "(女仆|jk制服|兔女郎|夏日泳装|动漫类|萝莉|少女|御姐|巨乳|丰满微胖|黑丝|白丝|肉丝|网丝|吊带袜|腿控|脚控|旗袍)美图"
            parm = e.msg.replace("美图", "") == null ? undefined : encodeURI(e.msg.replace("美图", "") + "&format=json")
        }
        if (msg == "随机涩图" && blackgroup.includes(e.group_id)) {
            return this.reply(segment.image(process.cwd() + "/plugins/qianyu-plugin/resources/img/不可以瑟瑟.jpg"))
        }
        await api.getImage(msg, async (res) => {
            if (res.isurl) {
                if (msg == "随机涩图") {
                    res.res = res.res.replace("i.pixiv.re", "i.acgmx.com")
                }
                await this.sendmsg(e, res, msg)

            } else {
                if (res.islist) {
                    let mes = []
                    let js = { qq: 2548285036, name: "不是机器人" }
                    res.res.forEach((item, index) => {
                        if (res.res.length > 5 ? index < 5 : index < res.res.length) {
                            mes.push({
                                message: segment.image(item),
                                nickname: js.name,//不是机器人
                                user_id: js.qq,
                            });
                        }
                    })
                    return this.reply(await e.group.makeForwardMsg(mes))
                }
                this.reply(res)
            }
        }, parm)
    }


    async sendmsg(e, res, reg) {
        let msg;
        if (e.isGroup) {
            msg = await Bot.pickGroup(e.group_id).sendMsg(segment.image(res.res)).catch(async function (err) {
                msg = await Bot.pickGroup(e.group_id).sendMsg(`图片被风控了，被风控的图片是${res.res}！`)
                let msgid = msg.message_id
                if (chehui) {
                    setTimeout(() => {
                        e.group.recallMsg(msgid);
                    }, stcd * 1000);
                }
            })
            if (reg == "随机涩图" && msg && chehui) {
                setTimeout(() => {
                    e.group.recallMsg(msg.message_id);
                }, stcd * 1000);
            }
        } else {
            msg = await Bot.pickUser(e.user_id).sendMsg(reg == "随机涩图" ? segment.flash(res.res) : segment.image(res.res)).catch(async function (err) {
                msg = await Bot.pickUser(e.user_id).sendMsg(`图片被风控了，被风控的图片是${res.res}！`)
            })
            if (reg == "随机涩图" && msg && chehui) {
                setTimeout(() => {
                    e.friend.recallMsg(msg.message_id);
                }, stcd * 1000);
            }
        }
    }
}

function getreg() {
    let reg = ''
    textlist.imagelist.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.name}$`
    });
    return reg
}

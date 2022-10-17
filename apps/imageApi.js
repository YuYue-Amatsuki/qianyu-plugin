/**
 * @Author: uixmsi
 * @Date: 2022-10-07 17:11:51
 * @LastEditTime: 2022-10-17 18:15:05
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
                }
            ]
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

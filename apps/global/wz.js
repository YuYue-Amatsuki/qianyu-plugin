//尾缀
import loader from '../../../../lib/plugins/loader.js'
import lodash from 'lodash'
import { segment } from 'oicq'
export function wz(wzmsg) {
    loader.reply = function (e) {
        if (e.reply) {
            e.replyNew = e.reply
            /**
             * @param msg 发送的消息
             * @param quote 是否引用回复
             * @param data.recallMsg 群聊是否撤回消息，0-120秒，0不撤回
             * @param data.at 是否at用户
             */
            e.reply = async (msg = '', quote = false, data = {}) => {
                if (!msg) return false

                /** 禁言中 */
                if (e.isGroup && e?.group?.mute_left > 0) return false

                let { recallMsg = 0, at = '' } = data

                if (at && e.isGroup) {
                    let text = ''
                    if (e?.sender?.card) {
                        text = lodash.truncate(e.sender.card, { length: 10 })
                    }
                    if (at === true) {
                        at = Number(e.user_id)
                    } else if (!isNaN(at)) {
                        let info = e.group.pickMember(at).info
                        text = info?.card ?? info?.nickname
                        text = lodash.truncate(text, { length: 10 })
                    }

                    if (Array.isArray(msg)) {
                        msg = [segment.at(at, text), ...msg]
                    } else {
                        msg = [segment.at(at, text), msg]
                    }



                }
                let wmsg = JSON.parse(await redis.get('qianyu:wzmsg')) || ""
                if (Array.isArray(msg)) {
                    console.log(1);
                    msg.push(wzmsg)
                } else if (typeof (msg) == 'string') {
                    if (!msg.includes("尾缀已设置为")) {
                        msg += wzmsg
                    }

                }

                let msgRes
                try {
                    msgRes = await e.replyNew(loader.checkStr(msg), quote)
                } catch (err) {
                    if (typeof msg != 'string') {
                        if (msg.type == 'image' && Buffer.isBuffer(msg?.file)) msg.file = {}
                        msg = lodash.truncate(JSON.stringify(msg), { length: 300 })
                    }
                    logger.error(`发送消息错误:${msg}`)
                    logger.error(err)
                }

                if (recallMsg > 0 && msgRes?.message_id) {
                    if (e.isGroup) {
                        setTimeout(() => e.group.recallMsg(msgRes.message_id), recallMsg * 1000)
                    } else if (e.friend) {
                        setTimeout(() => e.friend.recallMsg(msgRes.message_id), recallMsg * 1000)
                    }
                }
                loader.count(e, msg)
                return msgRes
            }
        } else {
            e.reply = async (msg = '', quote = false, data = {}) => {
                if (!msg) return false
                loader.count(e, msg)
                if (e.group_id) {
                    return await e.group.sendMsg(msg).catch((err) => {
                        logger.warn(err)
                    })
                } else {
                    let friend = Bot.fl.get(e.user_id)
                    if (!friend) return
                    return await Bot.pickUser(e.user_id).sendMsg(msg).catch((err) => {
                        logger.warn(err)
                    })
                }
            }
        }
    }
}

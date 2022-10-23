import moment from 'moment'
import schedule from "node-schedule";
import { dowmimg } from '../utils/downimg.js';
import cfg from '../../../lib/config/config.js'
import { segment } from 'oicq';
export class wz extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '千羽帮助',
            /** 功能描述 */
            dsc: '千羽帮助',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 90000,
            rule: [
                {
                    reg: '^#伪装',
                    fnc: 'weiz'
                },
                {
                    reg: '^#结束伪装$',
                    fnc: 'stopwz'
                }
            ]
        })
    }

    async weiz(e) {
        if (!e.isMaster) {
            return this.reply("暂无权限！")
        }
        let iswz = await redis.get('qianyu:wz:iswz')
        let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
        if (iswz) {
            return this.reply("正在伪装中，请等待当前伪装任务结束！")
        }
        if (!e.isGroup) {
            return this.reply("非群聊无法伪装！")
        }
        if (!e.at) {
            return this.reply("没有@指定目标伪装失败！")
        }
        let atuserinfo = await Bot.pickMember(e.group_id, e.at).getSimpleInfo()
        atuserinfo.avatar = await Bot.pickMember(e.group_id, e.at).getAvatarUrl()
        atuserinfo.group_name = await Bot.pickMember(e.group_id, e.at).card
        atuserinfo.group_id = e.group_id
        if (!myuserinfo) {
            myuserinfo = await Bot.pickMember(e.group_id, e.self_id).getSimpleInfo()
            myuserinfo.avatar = await Bot.pickMember(e.group_id, e.self_id).getAvatarUrl()
            await dowmimg(myuserinfo.avatar, process.cwd() + '/plugins/qianyu-plugin/resources/img/', '头像')
            await redis.set('qianyu:wz:myinfo', JSON.stringify(myuserinfo))
        }
        await redis.set('qianyu:wz:atuserinfo', JSON.stringify(atuserinfo))
        await redis.set('qianyu:wz:iswz', '1')
        await Bot.setAvatar(atuserinfo.avatar)
        await Bot.setNickname(atuserinfo.nickname)
        Bot.pickGroup(e.group_id).setCard(e.self_id, atuserinfo.group_name)
        this.reply("伪装任务开始！我已经伪装成指定目标，接下来10分钟，我会模仿伪装目标说话！ai任务将无法运行！")
        this.wztask(e)
    }

    async wztask(e) {
        schedule.scheduleJob('wz', moment().add(10, 'm').format(), async () => {
            let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
            await Bot.setAvatar(process.cwd() + '/plugins/qianyu-plugin/resources/img/头像.jpg')
            await Bot.setNickname(myuserinfo.nickname)
            Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
            await redis.del('qianyu:wz:iswz')
            this.reply("伪装任务已结束！")
        })
    }


    async stopwz(e) {
        if (!e.isMaster) {
            return this.reply("暂无权限！")
        }
        let iswz = await redis.get('qianyu:wz:iswz')
        let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
        if (!iswz) {
            return this.reply("还没有进行伪装任务！")
        }
        if (!e.isGroup) {
            return this.reply("非法的指令！")
        }
        await Bot.setAvatar(process.cwd() + '/plugins/qianyu-plugin/resources/img/头像.jpg')
        await Bot.setNickname(myuserinfo.nickname)
        Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
        await redis.del('qianyu:wz:iswz')
        schedule.cancelJob('wz');
        this.reply("伪装任务已结束！")
    }
}

Bot.on("message", async (e) => {
    if (e.user_id == cfg.qq) return
    // 判断是否主人消息
    if (cfg.masterQQ.includes(e.user_id)) return
    if (!e.isGroup) return
    let iswz = await redis.get('qianyu:wz:iswz')
    if (!iswz) return
    let atuserinfo = JSON.parse(await redis.get('qianyu:wz:atuserinfo'))
    if (e.group_id != atuserinfo.group_id) return
    if (e.user_id != atuserinfo.user_id) return
    let msg = e.message
    let sendmsg = []
    for (let m of msg) {
        switch (m.type) {
            case 'image':
                sendmsg.push(segment.image(m.url))
                break;
            case 'text':
                sendmsg.push(m.text)
                break;
            case 'bface':
                sendmsg.push(segment.bface(m.file))
                break
        }
    }
    e.reply(sendmsg)
    new Promise((resolve) => setTimeout(resolve, 500));
})

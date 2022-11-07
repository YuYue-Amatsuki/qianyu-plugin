import plugin from "../../../lib/plugins/plugin.js"
export class Plugin extends plugin {
    constructor(data) {
        super({
            /** 功能名称 */
            name: data.name,
            /** 功能描述 */
            dsc: data.event,
            event: data.event,
            /** 优先级，数字越小等级越高 */
            priority: data.priority,
            rule: data.rule
        })
        this.Permissions = data.Permissions || 'all' //all所有人,master主人,onwer管理员或者群主
        this.timeTask = data.timeTask || [] //定时任务
    }

    //制作穿转发群消息
    async makeGroupMsg(title, msg, end) {
        console.log("今顶顶顶")
        let nickname = Bot.nickname
        if (this.e.isGroup) {
            let info = await Bot.getGroupMemberInfo(this.e.group_id, Bot.uin)
            nickname = info.card ?? info.nickname
        }
        let userInfo = {
            user_id: Bot.uin,
            nickname
        }

        let forwardMsg = []
        if (title) {
            forwardMsg.push({
                ...userInfo,
                message: title
            })
        }
        msg.forEach(item => {
            forwardMsg.push({
                ...userInfo,
                message: item
            })
        });

        if (end) {
            forwardMsg.push({
                ...userInfo,
                message: end
            })
        }

        /** 制作转发内容 */
        if (this.e.isGroup) {
            forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
        } else {
            forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
        }

        /** 处理描述 */
        forwardMsg.data = forwardMsg.data
            .replace(/\n/g, '')
            .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, '___')
            .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

        return forwardMsg
    }

} 
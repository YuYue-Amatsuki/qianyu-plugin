let apps = {
    id: 'chehui',
    name: '引用撤回',
    desc: '引用撤回',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^撤回$',
    fnc: 'yschehui',
    fuc: yschehui
})

async function yschehui(e) {
    if (e.source) {
        if (e.source.user_id == e.self_id) {
            let msgid = (await e.group.getChatHistory(e.source.seq, 1))[0].message_id
            if (!e.isMaster && (e.member.is_admin || e.member.is_owner)) {
                this.reply("你是管理员，可以自己撤回消息哦！")
            } else {
                let res = await e.group.recallMsg(msgid)
                if (!res) {
                    this.reply("伦家不是管理员，不能撤回超过2分钟的消息呢~")
                }
            }
        }
    }
}



export default apps
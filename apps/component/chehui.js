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
            if (e.member.is_admin || e.member.is_owner) {
                this.reply("你是管理员，可以自己撤回消息哦！")
            } else {
                let reslut = await e.group.recallMsg(e.source.seq, e.source.rand)
                if (!reslut) {
                    this.reply("伦家不是管理员，不能撤回超过两分钟的消息哦！请联系管理员撤回！")
                }
            }
        }
    }
}



export default apps
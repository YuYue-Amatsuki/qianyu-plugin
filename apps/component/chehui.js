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
                await Bot.pickGroup(e.group_id).recallMsg(e.source.seq, e.source.rand, 2)
            }
        }
    }
}



export default apps
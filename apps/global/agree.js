let apps = {
    id: 'agree',
    name: '同意入群申请',
    desc: '同意入群申请',
    event: 'message',
    priority: 1,
    rule: []
}



apps.rule.push({
    reg: '^同意$|^拒绝$',
    desc: '',
    fnc: 'agreerequest',
    fuc: agreerequest
})


async function agreerequest(e) {
    let requestlist = JSON.parse(await redis.get(`qianyu:request:${e.group_id}`)) || []
    let yes = /拒绝/.test(e.msg) ? false : true
    if (requestlist.length > 0) {
        if (e.source) {
            if (!e.isMaster && !e.member.is_admin && !e.member.is_owner) {
                return this.reply("暂无权限！")
            }
            requestlist.forEach((element, index) => {
                if (element.infoseq === e.source.seq) {
                    if (element.type === 'add') {
                        Bot.pickUser(element.user_id).setGroupReq(e.group_id, element.seq, yes)
                        this.reply(`已${yes ? '同意' : '拒绝'}${element.nickname}的群申请！`, true)
                    } else {
                        Bot.pickUser(element.user_id).setGroupInvite(e.group_id, element.seq, yes)
                        this.reply(`已${yes ? '同意' : '拒绝'}${element.nickname}的群邀请！`, true)
                    }
                    requestlist.splice(index, 1)
                }
            });
        }
    }
    redis.set(`qianyu:request:${e.group_id}`, JSON.stringify(requestlist))
}

export default apps
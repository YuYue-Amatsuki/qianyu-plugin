let apps = {
    id: 'request',
    name: '检测入群申请',
    desc: '检测入群申请',
    event: 'request.group',
    priority: 1,
    rule: [],
    fuc: []
}


apps.fuc.push({
    fnc: 'accept',
    fuc: accept
})

let apps2 = {
    id: 'agree',
    name: '同意入群申请',
    desc: '同意入群申请',
    event: 'message',
    rule: []
}

apps2.rule.push({
    reg: '^同意$|^拒绝$',
    desc: '',
    fnc: 'agreerequest',
    fuc: agreerequest
})


let requestlist = [];

async function accept(e) {
    let request = {
        user_id: e.user_id,
        group_id: e.group_id,
        nickname: e.nickname,
        type: e.sub_type,
        seq: e.seq,
    }
    if (e.sub_type === 'add') {
        let msg = await this.reply(`有新的入群申请啦！\n昵称:${e.nickname}\nQQ:${e.user_id}\n${e.comment}\n回复同意或者拒绝。`)
        request.infoseq = msg.seq
    }
    if (e.sub_type === 'invite') {
        let msg = await this.reply(`有新的入群邀请啦！\n昵称:${e.nickname}\nQQ:${e.user_id}\n回复同意或者拒绝。`)
        request.infoseq = msg.seq
    }
    requestlist.push(request)
}


async function agreerequest(e) {
    let yes = /拒绝/.test(e.msg) ? false : true
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
export default [apps, apps2]
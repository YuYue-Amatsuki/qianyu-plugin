let apps = {
    id: 'request',
    name: '入群申请',
    desc: '入群申请',
    event: 'request.group',
    priority: 1,
    rule: []
}



apps.rule.push({
    reg: '.*',
    desc: '',
    fnc: 'request',
    fuc: request
})


async function request(e) {
    let requestlist = JSON.parse(await redis.get(`qianyu:request:${e.group_id}`)) || []
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
    redis.set(`qianyu:request:${e.group_id}`, JSON.stringify(requestlist))

}

export default apps
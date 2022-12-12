let apps = {
    id: 'request',
    name: '入群申请',
    desc: '入群申请',
    event: 'request.group.add',
    priority: 1,
    rule: []
}


apps.rule.push({
    reg: '.*',
    desc: '',
    fnc: 'request',
    fuc: request
})

let addgrouplist = []




async function request(e) {
    this.reply(`有新的入群申请啦！\n昵称:${e.nickname}\nQQ:${e.user_id}\n${e.comment}`)
    e.approve(true)
}


async function add() {

}

export default apps
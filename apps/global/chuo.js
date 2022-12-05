let apps = {
    id: 'chuo',
    name: '千羽戳一戳',
    desc: '千羽戳一戳',
    event: 'notice.*.poke',
    priority: 1,
    rule: []
}


apps.rule.push({
    reg: '.*',
    desc: '戳一戳',
    fnc: 'cho',
    fuc: cho
})





async function cho(e) {
    console.log("触发戳一戳了");
    let isshutdown = await redis.get('qianyu:manage:isshutdown')
    let isMasterPet = await redis.get('qianyu:manage:isMasterPet')
    if (isshutdown == null) {
        if (isMasterPet && e.isMaster) {
            return false
        } else if (isMasterPet && !e.isMaster) {
            return true
        }
        return false
    } else {
        return true
    }
}


export default apps
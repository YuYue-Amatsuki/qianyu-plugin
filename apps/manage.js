let apps = {
    id: 'manage',
    name: '千羽管理',
    desc: '管理',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '',
    desc: '管理',
    fnc: 'control',
    priority: 1,
    fuc: control
})

async function control(e) {
    if (e.isMaster) {
        return false
    } else {
        return true
    }
}


export default apps
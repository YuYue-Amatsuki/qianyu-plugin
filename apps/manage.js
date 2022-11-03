let apps = {
    id: 'manage',
    name: '千羽管理',
    desc: '管理',
    event: 'message',
    priority: 1,
    rule: []
}


apps.rule.push({
    reg: '#关机',
    desc: '管理',
    fnc: 'shutdown',
    fuc: shutdown
})

apps.rule.push({
    reg: '#开机',
    desc: '管理',
    fnc: 'shutdown',
    fuc: shutdown
})

apps.rule.push({
    reg: '',
    desc: '管理',
    fnc: 'control',
    fuc: control
})



let isShutdown = false

async function control(e) {
    if (!isShutdown) {//
        console.log("过滤消息")
        return false
    } else {
        console.log("拦截小溪")
        return true
    }
}

async function shutdown(e) {
    if (e.msg == "#关机") {
        isShutdown = true
        return this.reply("我关机了，接下来不接收指令了哦！")
    } else {
        isShutdown = false
        return this.reply("开机工作！")
    }
}


export default apps
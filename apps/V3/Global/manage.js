import { wz } from './wz.js'
let apps = {
    id: 'manage',
    name: '千羽管理',
    desc: '管理',
    event: 'message',
    priority: 1,
    rule: []
}


apps.rule.push({
    reg: '^#千羽关机$',
    desc: '管理',
    fnc: 'shutdown',
    fuc: shutdown
})

apps.rule.push({
    reg: '^#千羽开机$',
    desc: '管理',
    fnc: 'shutdown',
    fuc: shutdown
})

apps.rule.push({
    reg: '^只听主人的话$|^开私家车$|^开公交车$|^共享宠物$',
    desc: '管理',
    fnc: 'masterpet',
    fuc: masterpet
})


apps.rule.push({
    reg: '^#尾缀设置',
    desc: '尾缀',
    fnc: 'wzcofig',
    fuc: wzcofig
})


apps.rule.push({
    reg: '',
    desc: '管理',
    fnc: 'control',
    fuc: control
})

let msg = JSON.parse(await redis.get('qianyu:wzmsg')) || ""
wz(msg)

async function control(e) {

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

async function masterpet(e) {
    if (!e.isMaster) {
        return this.reply("暂无权限！")
    }
    if (e.msg == "只听主人的话" || e.msg == "开私家车") {
        await redis.set('qianyu:manage:isMasterPet', 1)
        this.reply("现在我是主人您的专属宠物了！让我做什么都可以哦~")
    } else {
        await redis.del('qianyu:manage:isMasterPet')
        this.reply("从现在开始我是大家的宠物了~轻点哦！")
    }
}

async function shutdown(e) {
    if (!e.isMaster) {
        return this.reply("暂无权限！")
    }
    if (e.msg == "#千羽关机") {
        await redis.set('qianyu:manage:isshutdown', 1)
        return this.reply("我关机了，接下来不接收指令了哦！")
    } else {
        await redis.del('qianyu:manage:isshutdown')
        return this.reply("开机工作！")
    }
}

async function wzcofig(e) {
    if (!e.isMaster) {
        return this.reply("暂无权限！")
    }
    let msg = JSON.parse(await redis.get('qianyu:wzmsg')) || ""
    msg = msg.replace(/\+/, "")
    let wzmsg = e.msg.replace('#尾缀设置', "").replace(new RegExp(msg, 'g'), "")
    await redis.set('qianyu:wzmsg', JSON.stringify(wzmsg))
    this.reply(`尾缀已设置为${wzmsg}`)
    wz(wzmsg)
}

await redis.del('qianyu:manage:isshutdown')

export default apps
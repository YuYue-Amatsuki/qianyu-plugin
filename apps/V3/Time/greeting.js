import moment from "moment"
import lodash from 'lodash'
let apps = {
    id: 'greeting',
    name: '早晚安',
    desc: '早晚安',
    event: 'message',
    rule: [],
    fuc: [],
    task: {
        name: '早晚安',
        fnc: clearTime,
        cron: '10 0 0 * * ?'
    }
}


apps.rule.push({
    reg: '^早$|^早安$|^早上好$',
    desc: '早安',
    fnc: 'morning',
    fuc: morning
})

apps.rule.push({
    reg: '^晚$|^晚安$|^晚上好$',
    desc: '晚安',
    fnc: 'night',
    fuc: night
})


let monightlist = {}

let monringMsg = {
    morn: ['早！', '早上好！', ' 早起的鸟儿有虫吃，加油!', '早安~', '新的一天又开始了。', '小鸟说早早早，花儿也在对着我欢笑~'],
    noon: ['太阳都屁股了，你才起来啊~', '大懒猪，哼哼哼哼~', '大懒虫起不来，略略略~', '太懒了，现在才起来！'],
    afternoon: ['早什么早，都要晚上了。', '早你个头。', '别早安了，我都准备下班回家了'],
    night: ['我都准备洗洗睡了，还早，哼！', '哈~睡觉。', '不是...你看看几点了，哼！'],
    over: ['zzz...zzz', 'zzz...', 'zzzz...涩图...嘿嘿...', 'zzz..有猪猪在叫我...zzz']
}

let eveningMsg = {
    morn: ['猝死吧你！', '别睡了通宵吧...哼哼哼！', '你还知道睡觉啊!'],
    noon: ['睡什么睡，修仙吧~', '不如别睡了，晚安啥~'],
    afternoon: ['睡那么早，我才不信。', '哈，这个点睡觉？'],
    night: ['呼...呼...已经睡着了哦~呼...'],
    over: ['zzz...zzz', 'zzz...', 'zzzz...涩图...嘿嘿...', 'zzz..有猪猪在叫我...zzz']
}


async function morning(e) {
    if (!monightlist[e.group_id]) {
        monightlist[e.group_id] = {
            mlist: [],//早安的人
            mnum: 0,//早安人数
            nlist: [],//晚安的人
            nnum: 0//晚安人数
        }
    }
    let hours = moment().hours()
    let msg = ``;
    if (e.msg == '早安' && ismorning() && !monightlist[e.group_id].mlist.includes(e.user_id)) {
        let userdata = JSON.parse(await redis.get(`qianyu:greeting:${e.user_id}`)) || {}
        redis.set(`qianyu:greeting:${e.user_id}`, JSON.stringify({ ...userdata, mtime: moment().format() }))
        monightlist[e.group_id].mnum += 1
        monightlist[e.group_id].mlist.push(e.user_id)
        console.log(userdata);
        if (userdata.ntime) {
            msg = `早安成功！你的睡眠时长为${update(userdata.ntime)},`
        }
        return this.reply(msg + `你是本群今天第${monightlist[e.group_id].mnum}个起床的！`, true)
    }
    if (hours >= 6 && hours < 10) {
        this.reply(monringMsg.morn[lodash.random(0, monringMsg.morn.length - 1)], true)
    }
    else if (hours <= 14 && hours >= 10) {
        this.reply(monringMsg.noon[lodash.random(0, monringMsg.noon.length - 1)], true)
    } else if (hours <= 18 && hours >= 15) {
        this.reply(monringMsg.afternoon[lodash.random(0, monringMsg.afternoon.length - 1)], true)
    } else if (hours > 18 && hours < 21) {
        this.reply(monringMsg.night[lodash.random(0, monringMsg.night.length - 1)], true)
    }
    else if (hours >= 21 || hours < 6) {
        this.reply(monringMsg.over[lodash.random(0, monringMsg.night.length - 1)], true)
    }

}
async function night(e) {
    if (!monightlist[e.group_id]) {
        monightlist[e.group_id] = {
            mlist: [],//早安的人
            mnum: 0,//早安人数
            nlist: [],//晚安的人
            nnum: 0//晚安人数
        }
    }
    let hours = moment().hours()
    let msg = ``;
    if (e.msg == '晚安' && isevening() && !monightlist[e.group_id].nlist.includes(e.user_id)) {
        let userdata = JSON.parse(await redis.get(`qianyu:greeting:${e.user_id}`)) || {}
        redis.set(`qianyu:greeting:${e.user_id}`, JSON.stringify({ ...userdata, ntime: moment().format() }))
        monightlist[e.group_id].nnum += 1
        monightlist[e.group_id].nlist.push(e.user_id)
        if (userdata.mtime) {
            msg = `晚安成功！你的清醒时长为${update(userdata.mtime)},`
        }

        return this.reply(msg + `你是本群今天第${monightlist[e.group_id].nnum}个睡觉的！`, true)
    }
    if (hours >= 6 && hours < 10) {
        this.reply(eveningMsg.morn[lodash.random(0, eveningMsg.morn.length - 1)], true)
    }
    else if (hours <= 14 && hours >= 10) {
        this.reply(eveningMsg.noon[lodash.random(0, eveningMsg.noon.length - 1)], true)
    } else if (hours <= 18 && hours >= 15) {
        this.reply(eveningMsg.afternoon[lodash.random(0, eveningMsg.afternoon.length - 1)], true)
    }
    else if (hours > 18 && hours < 21) {
        this.reply(eveningMsg.night[lodash.random(0, eveningMsg.night.length - 1)], true)
    }
    else if (hours >= 21 || hours < 6) {
        this.reply(eveningMsg.over[lodash.random(0, eveningMsg.night.length - 1)], true)
    }
}

function ismorning() {
    let hours = moment().hours()
    return hours >= 6 && hours <= 12
}

function isevening() {
    let hours = moment().hours()
    return hours >= 21 || hours <= 3
}

function clearTime() {
    monightlist = {}
}

function update(time) {
    let diff = moment().diff(time)
    let h = moment.duration(diff).hours()
    let m = moment.duration(diff).minutes()
    let s = moment.duration(diff).seconds()
    return `${h}时${m}分${s}秒`
}


export default apps
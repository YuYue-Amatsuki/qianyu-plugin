import lodash from 'lodash'
import { segment } from 'oicq'
import { groupPock } from './poke.js'
let apps = {
    id: 'groupevent',
    name: '群事件检测',
    desc: '群事件检测',
    event: 'notice.group',
    priority: 1,
    rule: [],
    fuc: []
}

apps.fuc.push({
    fnc: 'accept',
    fuc: accept
})


let apps2 = {
    id: 'groupset',
    name: '群事件设置',
    desc: '群事件设置',
    event: 'message',
    rule: [],
    fuc: []
}

apps2.rule.push({
    reg: '^#千羽群设置',
    desc: '',
    fnc: 'groupset',
    fuc: groupset
})

apps2.fuc.push({
    fnc: 'getset',
    fuc: getset
})

let set_type = ''

let Groupset = {
    ischehui: false,
    isaddgroup: true,
    isdegroup: true,
    isban: false
}

let msglist = ['我看到你说要女装了，撤回没用！', '你为什么要撤回你的女装照！', '你说要给我主人包一个大红，我看到了！', '撤回干嘛，让我康康！', '?']

async function accept(e) {
    let msg;
    let groupset = JSON.parse(await redis.get('qianyu:groupset')) || Groupset
    switch (e.sub_type) {
        case 'recall':
            if (!groupset.ischehui) {
                return false
            }
            if (!this.e.isMaster && !this.e.user_id !== e.self_id) {
                this.reply([segment.at(this.e.user_id), " ", msglist[lodash.random(0, msglist.length - 1)]])
            }
            break;
        case 'ban':
            if (!groupset.isban) {
                return false
            }
            let userinfo = await Bot.pickMember(e.group_id, e.user_id).getSimpleInfo()
            if (e.duration != 0) {
                this.reply(`${userinfo.nickname}被管理员口球了${e.duration / 60}分钟！`)
            }
            else {
                this.reply(`${userinfo.nickname}从口球刑罚中解放了！`)
            }
            break;
        case 'increase':
            if (!groupset.isaddgroup) {
                return false
            }
            msg = [segment.at(e.user_id), `欢迎${e.nickname}小可爱进群啦啦啦~`]
            let { addmsg: addmsg } = JSON.parse(await redis.get(`qianyu:groupset:${e.group_id}`)) || JSON.parse(await redis.get(`qianyu:addmsg`)) || ''
            if (addmsg) {
                addmsg.unshift(segment.at(e.user_id))
                msg = addmsg
            }
            this.reply(msg)
            break;
        case 'decrease':
            if (!groupset.isdegroup) {
                return false
            }
            let name;
            if (e.member) {
                name = e.member.card || e.member.nickname
            }
            msg = `用户${name ? name + '(' + e.user_id + ')' : '(' + e.user_id + ')'}被本堂主送走了~`
            let { leave: leave } = JSON.parse(await redis.get(`qianyu:groupset:${e.group_id}`)) || JSON.parse(await redis.get(`qianyu:leave`)) || ''
            if (leave) {
                leave.unshift(`${e.member.nickname || e.member.card}(${e.user_id})`)
                msg = leave
            }
            this.reply(msg)
            break;
        case 'poke':
            await groupPock(e)
            console.log("触发了");
            break
    }

}

async function groupset(e) {
    if (!e.isMaster) {
        return this.reply('无权限！')
    }
    let set = e.msg.replace("#千羽群设置", "")
    let msg, isopen;
    set = set.replace(/开启|关闭/g, '')
    switch (set) {
        case '进群回复':
            isopen = e.msg.replace(`#千羽群设置${set}`, '')
            if (isopen == '开启') {
                await setgroup({ name: '进群回复', key: 'isaddgroup', value: true }, e)
            } else if (isopen == '关闭') {
                await setgroup({ name: '进群回复', key: 'isaddgroup', value: false }, e)
            } else {
                msg = '请发送要回复的进群欢迎词！'
            }
            break;
        case '退群回复':
            isopen = e.msg.replace(`#千羽群设置${set}`, '')
            if (isopen == '开启') {
                await setgroup({ name: '退群回复', key: 'isdegroup', value: true }, e)
            } else if (isopen == '关闭') {
                await setgroup({ name: '退群回复', key: 'isdegroup', value: false }, e)
            } else {
                msg = '请发送要回复的送走词！'
            }
            break;
        case '禁言提示':
            isopen = e.msg.replace(`#千羽群设置${set}`, '')
            if (isopen == '开启') {
                await setgroup({ name: '禁言提示', key: 'isban', value: true }, e)
            } else if (isopen == '关闭') {
                await setgroup({ name: '禁言提示', key: 'isban', value: false }, e)
            }
            break;
        case '撤回提示':
            isopen = e.msg.replace(`#千羽群设置${set}`, '')
            if (isopen == '开启') {
                await setgroup({ name: '撤回提示', key: 'ischehui', value: true }, e)
            } else if (isopen == '关闭') {
                await setgroup({ name: '撤回提示', key: 'ischehui', value: false }, e)
            }
            break;
        default:
            return this.reply('无效的设置')
    }
    if (msg) {
        set_type = set
        this.reply(msg)
        let isGroup = e.isGroup ?? false
        this.setContext('getset', isGroup, 60)
    }

}

async function getset() {
    if (!this.e.isMaster) return
    let msg = [];
    this.e.message.forEach(item => {
        if (item.type === 'text') {
            msg.push(item.text)
        } else if (item.type === 'image') {
            msg.push(segment.image(item.url))
        }
    });
    if (this.e.isGroup) {
        let groupset = JSON.parse(await redis.get(`qianyu:groupset:${this.e.group_id}`)) || []
        switch (set_type) {
            case '进群回复':
                redis.set(`qianyu:groupset:${this.e.group_id}`, JSON.stringify({ ...groupset, addmsg: msg }))
                break;
            case '退群回复':
                redis.set(`qianyu:groupset:${this.e.group_id}`, JSON.stringify({ ...groupset, leave: msg }))
                break;
        }
    } else {
        switch (set_type) {
            case '进群回复':
                redis.set(`qianyu:addmsg`, JSON.stringify({ addmsg: msg }))
                break;
            case '退群回复':
                redis.set(`qianyu:leave`, JSON.stringify({ leave: msg }))
                break;
        }
    }
    this.reply(`${set_type}设置完毕！`)
    this.finish('getset', this.e.isGroup)
}



async function setgroup(data, e) {
    let groupset = JSON.parse(await redis.get('qianyu:groupset')) || Groupset
    e.reply(`${data.name}已${data.value ? '开启' : '关闭'}!`)
    groupset[data.key] = data.value
    redis.set('qianyu:groupset', JSON.stringify(groupset))
}




export default [apps, apps2]
import lodash from 'lodash'
import { segment } from 'oicq'
import { filemage, geturldata } from '../../../utils/index.js'
let file = new filemage()
const path = process.cwd() + '/plugins/qianyu-plugin'

let apps = {
    id: 'chuoset',
    name: '戳一戳设置',
    desc: '戳一戳设置',
    event: 'message',
    rule: [],
    fuc: []
}

apps.rule.push({
    reg: '^#千羽戳一戳',
    desc: '',
    fnc: 'setchuo',
    fuc: setchuo
})

export async function groupPock(e) {
    let isopen = await redis.get(`qianyu:chuo`)
    if (!isopen) return
    let { yugl, textgl, imggl, fjgl, hggl, recordlist, textlist, isurlimg, memberChuoOpen } = file.getyamlJson('/config/chuo')
    if (e.user_id !== e.self_id) {
        return await otherpock(e, memberChuoOpen)
    }
    let radom = lodash.random(0, 100)
    if (radom >= (100 - yugl)) {
        await geturldata({ url: `https://ovooa.com/API/yuyin/api.php?msg=${recordlist[lodash.random(0, recordlist.length - 1)]}& type=json`, data: ['url'] }, (res) => {
            e.reply(segment.record(res.data))
        })

    }
    else if (radom >= (100 - (yugl + textgl))) {
        e.reply(textlist[lodash.random(0, textlist.length - 1)])
    } else if (radom >= (100 - (yugl + textgl + imggl))) {
        if (isurlimg) {
            await geturldata({ url: `https://ovooa.com/API/dou/?type=json`, data: ['data', 'image'] }, (res) => {
                console.log(res);
                e.reply(segment.image(res.data))
            })
        } else {
            let imglist = file.getfilelist('/resources/img/表情包/')
            e.reply(segment.image(`${path}/resources/img/表情包/${imglist[lodash.random(0, imglist.length - 1)]}`))
        }

    }
    else if (radom >= (100 - (yugl + textgl + imggl + hggl))) {
        e.reply("假装提升了一点好感度")
    }
    else if (radom >= (100 - (yugl + textgl + imggl + fjgl))) {
        e.group.pokeMember(e.operator_id)
        e.reply("反击！哼！")
    } else {
        e.group.muteMember(e.operator_id, 60)
        e.reply("给你禁言一分钟。")
    }
}

async function otherpock(e, memberChuoOpen) {
    if (!memberChuoOpen) return
    if (e.operator_id === e.self_id) return
    let radom = lodash.random(0, 10)
    let userinfo = await Bot.pickMember(e.group_id, e.user_id).getSimpleInfo()
    if (radom > 5) {
        e.reply(`${userinfo.nickname} 对你的好感提升了一点。`)
    } else {
        e.reply(`${userinfo.nickname} 对你的好感下降了一点。`)
    }

}


async function setchuo(e) {
    if (!e.isMaster) {
        return this.reply("暂无权限")
    }
    let isopen = e.msg.replace("#千羽戳一戳", "")
    if (isopen === '开启') {
        await redis.set(`qianyu:chuo`, 1)
        this.reply("千羽戳一戳开启成功！")
    } else if (isopen === '关闭') {
        await redis.del(`qianyu:chuo`)
        this.reply("千羽戳一戳关闭成功！")
    } else {
        this.reply("无效的设置！")
    }

}


export default apps
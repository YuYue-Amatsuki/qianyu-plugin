import fetch from 'node-fetch'
import { Api } from '../lib/api.js'
import { dowmvideo, dowmimg, ds, cacelds } from '../utils/index.js'
import { segment } from 'oicq'
import moment from 'moment'
import cfg from '../../../lib/config/config.js'
let api = new Api()

let apps = {
    id: 'allon',
    name: '伪装目标',
    desc: '伪装目标',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^#伪装',
    desc: '智障ai',
    fnc: 'weiz',
    fuc: weiz
})

apps.rule.push({
    reg: '^#结束伪装$',
    desc: '智障ai',
    fnc: 'stopwz',
    fuc: stopwz
})

async function weiz(e) {
    let iswz = await redis.get('qianyu:wz:iswz')
    let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
    if (iswz) {
        return this.reply("正在伪装中，请等待当前伪装任务结束！")
    }
    if (!e.isGroup) {
        return this.reply("非群聊无法伪装！")
    }
    if (!e.at) {
        return this.reply("没有@指定目标伪装失败！")
    }
    if (e.at == e.self_id) {
        return this.reply("不能模仿我自己哦！")
    }
    let atuserinfo = await Bot.pickMember(e.group_id, e.at).getSimpleInfo()
    atuserinfo.avatar = await Bot.pickMember(e.group_id, e.at).getAvatarUrl()
    atuserinfo.group_name = await Bot.pickMember(e.group_id, e.at).card
    atuserinfo.group_id = e.group_id
    if (!myuserinfo) {
        myuserinfo = await Bot.pickMember(e.group_id, e.self_id).getSimpleInfo()
        myuserinfo.avatar = await Bot.pickMember(e.group_id, e.self_id).getAvatarUrl()
        const file = process.cwd() + '/plugins/qianyu-plugin/resources/img/'
        await redis.set('qianyu:wz:myinfo', JSON.stringify(myuserinfo))
        await dowmimg(myuserinfo.avatar, file, '头像.jpg', 'qq')
    }
    await redis.set('qianyu:wz:atuserinfo', JSON.stringify(atuserinfo))
    await redis.set('qianyu:wz:InitiatorInfo', JSON.stringify({
        user_id: e.user_id,
        group_id: e.group_id
    }))
    await redis.set('qianyu:wz:iswz', '1')
    await Bot.setAvatar(atuserinfo.avatar)
    await Bot.setNickname(atuserinfo.nickname)
    Bot.pickGroup(e.group_id).setCard(e.self_id, atuserinfo.group_name)
    this.reply("伪装任务开始！我已经伪装成指定目标，接下来10分钟，我会模仿伪装目标说话！！")
    wztask(e)
}

async function stopwz(e) {
    let iswz = await redis.get('qianyu:wz:iswz')
    let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
    if (!iswz) {
        return this.reply("还没有进行伪装任务！")
    }
    if (!e.isGroup) {
        return this.reply("非法的指令！")
    }
    let InitiatorInfo = JSON.parse(await redis.get('qianyu:wz:InitiatorInfo'))
    if (e.user_id != InitiatorInfo.user_id && e.user_id != cfg.masterQQ) {
        return this.reply("只有发起人才能结束伪装！")
    }
    if (InitiatorInfo.group_id != e.group_id) {
        return this.reply("只有发起的群才能结束伪装！")
    }
    await Bot.setAvatar(process.cwd() + '/plugins/qianyu-plugin/resources/img/头像.jpg')
    await Bot.setNickname(myuserinfo.nickname)
    Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
    await redis.del('qianyu:wz:iswz')
    await redis.del('qianyu:wz:InitiatorInfo')
    await cacelds('wz');
    this.reply("伪装任务已结束！")
}


async function wztask(e) {
    await ds('wz', moment().add(10, 'm').format(), async () => {
        let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
        await Bot.setAvatar(process.cwd() + '/plugins/qianyu-plugin/resources/img/头像.jpg')
        await Bot.setNickname(myuserinfo.nickname)
        Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
        await redis.del('qianyu:wz:iswz')
        await redis.del('qianyu:wz:InitiatorInfo')
        e.reply("伪装任务已结束！")
    })
}

Bot.on("message", async (e) => {
    let iswz = await redis.get('qianyu:wz:iswz')
    if (iswz) {
        if (e.user_id == cfg.qq) return
        // 判断是否主人消息
        // if (cfg.masterQQ.includes(e.user_id)) return
        if (!e.isGroup) return
        let iswz = await redis.get('qianyu:wz:iswz')
        if (!iswz) return
        let atuserinfo = JSON.parse(await redis.get('qianyu:wz:atuserinfo'))
        if (e.group_id != atuserinfo.group_id) return
        if (e.user_id != atuserinfo.user_id) return
        let msg = e.message
        let sendmsg = []
        for (let m of msg) {
            switch (m.type) {
                case 'image':
                    sendmsg.push(segment.image(m.url))
                    break;
                case 'text':
                    if (e.source != undefined) {
                        Bot.sendGroupMsg(e.group_id, [segment.at(e.source.user_id), " ", m.text], e.source)
                    } else {
                        sendmsg.push(m.text)
                    }
                    break;
                case 'face':
                    sendmsg.push(segment.face(m.id))
                    break
                case 'bface':
                    sendmsg.push(segment.bface(m.file))
                    break
                case 'at':
                    sendmsg.push(segment.at(m.qq))
                    break;
            }
        }
        if (!e.source) {
            e.reply(sendmsg)
        }
    }
    let isbjx = await redis.get('qianyu:isbjx')
    if (isbjx) {
        let msg;
        e.message.forEach(element => {
            if (element.type == 'text') {
                msg = element.text
            }
        });
        let urllist = ['b23.tv', 'm.bilibili.com', 'www.bilibili.com']
        let reg = new RegExp(`${urllist[0]}|${urllist[1]}|${urllist[2]}`)
        if (reg.test(msg)) {
            const reg2 = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
            let url = msg.match(reg2)
            let bv;
            if (url[0].includes('https://b23.tv/')) {
                await api.getapi(`https://xiaobai.klizi.cn/API/other/url_restore.php?url=${url}`, ['redirect_url', '0'], async (res) => {
                    url[0] = res
                })
            }
            let reg3 = new RegExp(/(BV.*?).{10}/)
            bv = url[0].match(reg3)[0]
            let videourl = 'https://www.bilibili.com/video/' + bv
            await api.getapi(`http://tfkapi.top/API/bzjx.php?url=${videourl}`, ['data', '0'], async (res) => {
                let response = await fetch(res.video_url);
                let buff = await response.arrayBuffer();
                await dowmvideo('b站', "video.mp4", buff, () => {
                    e.reply(segment.video(`file:///${process.cwd()}/plugins/qianyu-plugin/resources/video/b站/video.mp4`))
                })
            })
        }
    }

})

await redis.del('qianyu:wz:iswz')
export default apps
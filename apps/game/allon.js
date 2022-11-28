import fetch from 'node-fetch'
import { Api } from '../../lib/api.js'
import { dowmvideo, dowmimg, ds, cacelds } from '../../utils/index.js'
import { segment } from 'oicq'
import moment from 'moment'
import cfg from '../../../../lib/config/config.js'
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

let CD = {}

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
    if (!cfg.masterQQ.includes(e.user_id)) {
        if (CD[e.user_id]) {
            if (CD[e.user_id].cd) {
                return this.reply("伪装还在cd中！")
            }
            if (CD[e.user_id].times > 10) {
                return this.reply("今日伪装次数不足，每人每天限定10次！")
            } else {
                CD[e.user_id].times += 1
            }
        } else {
            CD[e.user_id] = {
                times: 1
            }
        }
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
        await dowmimg(myuserinfo.avatar, file, `${e.self_id}头像`, 'qq')
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
    await wztask(e)
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
    if (e.user_id != InitiatorInfo.user_id && !cfg.masterQQ.includes(e.user_id)) {
        return this.reply("只有发起人才能结束伪装！")
    }
    if (InitiatorInfo.group_id != e.group_id) {
        return this.reply("只有发起的群才能结束伪装！")
    }
    await Bot.setAvatar(process.cwd() + `/plugins/qianyu-plugin/resources/img/${e.self_id}头像.jpg`)
    await Bot.setNickname(myuserinfo.nickname)
    Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
    await redis.del('qianyu:wz:iswz')
    await redis.del('qianyu:wz:InitiatorInfo')
    await cacelds('wz');
    if (!cfg.masterQQ.includes(e.user_id)) {
        CD[e.user_id].cd = true
        await ds('wzcd', moment().add(10, 'm').format(), async () => {
            CD[e.user_id].cd = false
        })
    }
    this.reply("伪装任务已结束！发起人进入10分钟冷却！（主人除外！）")
}

//12点重置
await ds('wz', `0 0 0 * * *`, async () => {
    CD = {}
})

async function wztask(e) {
    await ds('wz', moment().add(10, 'm').format(), async () => {
        let myuserinfo = JSON.parse(await redis.get('qianyu:wz:myinfo'))
        await Bot.setAvatar(process.cwd() + `/plugins/qianyu-plugin/resources/img/${e.self_id}头像.jpg`)
        await Bot.setNickname(myuserinfo.nickname)
        Bot.pickGroup(e.group_id).setCard(e.self_id, myuserinfo.nickname)
        redis.del('qianyu:wz:iswz')
        redis.del('qianyu:wz:InitiatorInfo')
        e.reply("伪装任务已结束！发起人进入10分钟冷却！（主人除外！）")
        //进入cd
        if (!cfg.masterQQ.includes(e.user_id)) {
            CD[e.user_id].cd = true
            await ds('wzcd', moment().add(10, 'm').format(), async () => {
                CD[e.user_id].cd = false
            })
        }

    })
}

let videobv;

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
    let isbjx = await redis.get(`qianyu:isbjx:${e.group_id}`)
    if (isbjx) {
        let msg;
        e.message.forEach(element => {
            if (element.type == 'text') {
                msg = element.text
            } else if (element.type == 'json') {
                let data = JSON.parse(element.data)
                msg = data.meta.qqdocurl
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
            console.log(bv);
            if (bv == videobv) {
                return
            }
            let videourl = 'https://www.bilibili.com/video/' + bv
            videobv = bv
            await api.getapi(`http://fuyhi.top/api/bilibili_jx/api.php?url=${videourl}`, ['data', '0'], async (res) => {
                console.log("视频解析中》》》》");
                let response = await fetch(res.video_url);
                let buff = await response.arrayBuffer();
                await dowmvideo('b站', "video.mp4", buff, () => {
                    e.reply(segment.video(`file:///${process.cwd()}/plugins/qianyu-plugin/resources/video/b站/video.mp4`))
                    videobv = ''
                })
            })
        }
    }

})

await redis.del('qianyu:wz:iswz')
await redis.del('qianyu:wz:atuserinfo')
await redis.del('qianyu:wz:InitiatorInfo')
await redis.del('qianyu:wz:myinfo')
global.qySource = 'qianyu-plugin'

export default apps
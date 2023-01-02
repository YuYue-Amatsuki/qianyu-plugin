import fetch from 'node-fetch'
import { segment } from 'oicq'
import { returnImg } from '../../utils/index.js'
let apps = {
    id: 'pivix',
    name: 'pivix',
    desc: 'pivix',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: '^来点p站涩图',
    desc: '来点p站涩图',
    fnc: 'pivix',
    fuc: pivix
})

apps.rule.push({
    reg: '^来点r18涩图',
    desc: '来点r18涩图',
    fnc: 'r18',
    fuc: r18
})



let writegroup = [816366626]

let cd = {}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pivix(e) {
    let rep = await fetch(`https://xiaobapi.top/api/xb/api/pixiv.php`)
    let res = await rep.json()
    for (let i of res.data) {
        if (e.isGroup) {
            let fkmsg = [`标题:  ${i.title}\n作者:  ${i.uname}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.r18 ? 'r18' : '涩图'}`]
            await Bot.pickGroup(e.group_id).sendMsg(fkmsg)
        }
    }
}

async function r18(e) {
    if (!writegroup.includes(e.group_id)) {
        return this.reply("暂无权限！")
    }
    let page = e.msg.replace("来点r18涩图", "") || 1
    let rep = await fetch(`http://127.0.0.1/api/pivixr18/${page}`)
    let res = await rep.json()
    let that = this
    for (let i of res.data) {
        if (this.e.isGroup) {
            let url = i.url.replace("https://www.pixiv.net/artworks/", "https://pixiv.re/") + ".jpg"
            await returnImg('setu', { url: url, path: './plugins/qianyu-plugin/resources/html/setu/setu.jpg', wk: 0 })
            let fkmsg = [`标题:  ${i.title}\n作者:  ${i.uname}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.nsfw_tag == 0 ? '全年龄' : i.nsfw_tag == 1 ? '涩图' : 'r18'}`, segment.image(`./plugins/qianyu-plugin/resources/html/setu/setu.jpg`), `原图链接:${url}`]
            await Bot.pickGroup(e.group_id).sendMsg(fkmsg).catch(async err => {
                await sendMsg(that, e, i, 0)
            })
            await sleep(30000)
        }
    }
    this.reply('涩图已发放完毕！')
}

async function searchpivix(e) {
    if (!writegroup.includes(e.group_id)) {
        return this.reply("暂无权限！")
    }
    let page = e.msg.replace(/[^\d.]/g, "") || 1
    let title = e.msg.replace("搜索", "").replace(page, "")

    let rep = await fetch(`http://127.0.0.1/api/pivixsearch/${title}/${page}`)
    let res = await rep.json()
    let that = this
    for (let i of res.data) {
        // msglist.push(msg)https://pixiv.re、https://pixiv.nl
        if (this.e.isGroup) {
            let url = i.url.replace("https://www.pixiv.net/artworks/", "https://pixiv.re/") + ".jpg"
            await returnImg('setu', { url: url, path: './plugins/qianyu-plugin/resources/html/setu/setu.jpg', wk: 0 })
            let fkmsg = [`标题:  ${i.title}\n作者:  ${i.uname}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.nsfw_tag == 0 ? '全年龄' : i.nsfw_tag == 1 ? '涩图' : 'r18'}`, segment.image(`./plugins/qianyu-plugin/resources/html/setu/setu.jpg`), `原图链接:${url}`]
            await Bot.pickGroup(e.group_id).sendMsg(fkmsg).catch(async err => {
                await sendMsg(that, e, i, 0)
            })
            await sleep(30000)
            // })
        }
    }
    this.reply(`搜索${title}已发送完毕！`)
}


async function sendMsg(that, e, i, index) {
    let url = i.url.replace("https://www.pixiv.net/artworks/", "https://pixiv.re/") + ".jpg"
    await returnImg('setu', { url: url, path: './plugins/qianyu-plugin/resources/html/setu/setu.jpg', wk: index })
    let fkmsg = [`标题:  ${i.title}\n作者:  ${i.uname}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.nsfw_tag == 0 ? '全年龄' : i.nsfw_tag == 1 ? '涩图' : 'r18'}`, segment.image(`./plugins/qianyu-plugin/resources/html/setu/setu.jpg`), `原图链接:${url}`]
    await Bot.pickGroup(e.group_id).sendMsg(await that.makeGroupMsg('pivix', fkmsg)).catch(async err => {
        if (err) {
            await sendMsg(that, e, i, index + 1)
        } else {
            return
        }
    })
}

export default apps



import fetch from 'node-fetch'
import { segment } from 'oicq'
import { filemage } from '../../../utils/index.js'
let file = new filemage()
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

apps.rule.push({
    reg: '^#历史',
    desc: '历史涩图',
    fnc: 'history',
    fuc: history
})


let r18cd = 15//r18撤回cd

async function pivix(e) {
    let selist = await file.getyamlJson('/resources/data/se/se') || []
    let rep = await fetch(`https://xiaobapi.top/api/xb/api/pixiv.php`)
    let data = await rep.json()
    let i = data.data[0]
    let url = i.urls.original.replace("https://pic.8il.cc", "https://i.pixiv.re")
    let fkmsg = [`标题:  ${i.title}\n作者:  ${i.author}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.r18 ? 'r18' : '涩图'}`, segment.image(url)]
    if (e.isGroup) {
        await Bot.pickGroup(e.group_id).sendMsg(fkmsg)
    } else {
        await Bot.pickUser(e.user_id).sendMsg(fkmsg)
    }
    selist.push(url)
    await file.writeyaml('/resources/data/se/se', selist)
}

async function r18(e) {
    let rep = await fetch(`https://xiaobapi.top/api/xb/api/pixiv_r18.php`)
    let r18list = await file.getyamlJson('/resources/data/se/r18') || []
    let data = await rep.json()
    let i = data.data[0]
    let msg;
    let url = i.urls.original.replace("https://pic.8il.cc", "https://i.pixiv.re")
    let fkmsg = [`标题:  ${i.title}\n作者:  ${i.author}\n作品ID:  ${i.pid}\n作者ID:  ${i.uid}\n标签:  ${i.tags}\n涩图类型：${i.r18 ? 'r18' : '涩图'}`, segment.image(url)]
    if (e.isGroup) {
        try {
            msg = await Bot.pickGroup(e.group_id).sendMsg(await this.makeGroupMsg('\/\/\/\/色批\/\/\/\/', fkmsg))
            setTimeout(() => {
                e.group.recallMsg(msg.message_id);
            }, r18cd * 1000);
        } catch (error) {
            msg = await Bot.pickGroup(e.group_id).sendMsg(`图片被风控了，给你直链自己看吧！\n直链: ${url}`)
            setTimeout(() => {
                e.group.recallMsg(msg.message_id);
            }, r18cd * 1000);
        }
    } else {
        await Bot.pickUser(e.user_id).sendMsg(await this.makeGroupMsg('\/\/\/\/色批\/\/\/\/', fkmsg))
    }
    r18list.push(url)
    await file.writeyaml('/resources/data/se/r18', r18list)
}

async function history(e) {
    let msg = e.msg.replace("#历史", "")
    let name;
    let msglist = []
    if (msg === '涩图') {
        name = 'se'
    } else if (msg === 'r18涩图') {
        name = 'r18'
    }
    let list = await file.getyamlJson(`/resources/data/se/${name}`) || []
    if (!list) {
        this.reply("暂无历史记录！")
    } else {
        for (let l of list) {
            msglist.push(segment.image(l))
        }
        try {
            if (e.isGroup) {
                await Bot.pickGroup(e.group_id).sendMsg(`不可以在群里看(>~~~<)`)
            } else {
                await Bot.pickUser(e.user_id).sendMsg(await this.makeGroupMsg('\/\/\/\/色批\/\/\/\/', msglist))
            }

        } catch (error) {
            console.log(error);
        }
    }

}




export default apps



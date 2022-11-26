import { filemage, ds } from '../../../utils/index.js'
let file = new filemage(`config/config/`)

let apps = {
    id: 'prefix',
    name: '云崽群前缀',
    desc: '群前缀设置',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^#群前缀(开启|关闭)',
    desc: '前缀开启',
    fnc: 'openPrefix',
    fuc: openPrefix
})

apps.rule.push({
    reg: '^#设置前缀',
    desc: '前缀设置',
    fnc: 'setPrefix',
    fuc: setPrefix
})



async function openPrefix(e) {
    if (!e.isMaster) {
        return this.reply("权限不足！")
    }
    let text = e.msg.replace(/#|群前缀/g, "")
    let group = await file.getyamlDocuments('group')
    if (text == '开启') {
        group.setIn([Number(e.group_id), "onlyReplyAt"], 1)
    } else if (text == '关闭') {
        group.setIn([Number(e.group_id), "onlyReplyAt"], 0)
    } else {
        console.log("无效的设置!")
    }
    await file.writeyaml('group', group.toString())
    this.reply(`群前缀已${text}!`)
}

async function setPrefix(e) {
    if (!e.isMaster) {
        return this.reply("权限不足！")
    }
    let name = e.msg.replace("#设置前缀", "")
    let group = await file.getyamlDocuments('group')
    group.setIn([Number(e.group_id), "botAlias"], [name])
    await file.writeyaml('group', group.toString())
    this.reply(`群前缀已设置为${name}!`)
}

export default apps

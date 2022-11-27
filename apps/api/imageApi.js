import { Api } from '../../lib/api.js'
import { segment } from 'oicq'
let api = new Api()
let textlist = await api.getApiList('image')
let apps = {
    id: 'imageApi',
    name: '千羽图片',
    desc: '图片类api合集',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: getreg(),
    desc: '图片api合集',
    fnc: 'apiimg',
    fuc: apiimg
})

function getreg() {
    let reg = ''
    textlist.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.name}$`
    });
    return reg
}

async function apiimg(e) {
    let parm;
    let msg = e.msg
    let cate = /(女仆|jk制服|兔女郎|夏日泳装|动漫类|幼齿|萝莉|少女|御姐|巨乳|丰满微胖|黑丝|白丝|肉丝|网丝|吊带袜|腿控|脚控|旗袍)/
    let tx = ['男头', '女头', '动漫头像', "动漫女头", "动漫男头"]
    if (tx.includes(msg)) {
        let cs = ['a1', 'b1', 'c1', 'c2', 'c3']
        parm = cs[tx.indexOf(msg)] + "&format=images"
    }
    if (msg.includes("米游社表情包")) {
        parm = msg.replace("米游社表情包", "") == null ? undefined : msg.replace("米游社表情包", "")
    }
    if (cate.test(msg)) {
        parm = e.msg.replace("美图", "") == null ? undefined : encodeURI(e.msg.replace("美图", "") + "&format=json")
    }
    let { name: str } = textlist.find(item => {
        let reg = new RegExp(item.name)
        if (reg.test(msg)) {
            return true
        }
    })
    await api.getImage(str, async (res) => {
        if (res.isurl) {
            await this.reply(segment.image(res.res))
        } else {
            if (res.islist) {
                let mes = []
                res.res.forEach((item, index) => {
                    if (res.res.length > 5 ? index < 5 : index < res.res.length) {
                        mes.push(segment.image(item))
                    }
                })
                return this.reply(await this.makeGroupMsg(e.msg, mes))
            }
            this.reply(res)
        }
    }, parm)
}

export default apps
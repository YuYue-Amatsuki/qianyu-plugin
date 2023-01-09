import { Api } from '../../../lib/api.js'
import { segment } from 'oicq'

let api = new Api()
let textlist = await api.getApiList('text')

let apps = {
    id: 'textApi',
    name: '千羽文本',
    desc: '文本类api合集',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: getreg(),
    desc: '文本api合集',
    fnc: 'apitext',
    fuc: apitext
})

apps.rule.push({
    reg: '^缘分',
    desc: '检测两个人的缘分',
    fnc: 'yf',
    fuc: yf
})


apps.rule.push({
    reg: '^查权重',
    desc: '检测qq号权重',
    fnc: 'qz',
    fuc: qz
})

function getreg() {
    let reg = ''
    textlist.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.reg}$`
    });
    return reg
}

async function apitext(e) {
    let parm;
    let msg = e.msg
    let yllist = ["动漫", "恋爱", "鼓励", "孤独", "搞笑", "友情", "歌词", "经典"]
    if (msg.includes('语录') && yllist.includes(msg.replace("语录", ""))) {
        parm = encodeURI(msg.replace("语录", ""))
    }
    if (msg.includes("天气")) {
        parm = encodeURI(msg.replace("天气", "")) + "&n=1"
    }
    let { reg: str } = textlist.find(item => {
        let reg = new RegExp(item.reg)
        if (reg.test(msg)) {
            return true
        }
    })
    await api.getText(str, async (res) => {
        console.log(res);
        let remsg = res;
        if (msg != '舔狗日记' && msg != '每日一文' && msg != "天气|天气") {
            remsg = res.replace(/[\r\n]/g, "")
        }
        if (msg == "每日一文") {
            let msglist = remsg.content.replace(/(\n)/g, "*").split("*")
            let mes = []
            msglist.forEach((item) => {
                mes.push("    " + item);
            })
            return this.reply(await this.makeGroupMsg(res.title, mes))
        }
        if (msg == '网易云热评') {
            let text = res.split("\n")
            remsg = text[text.length - 1]
        }
        if (msg == '口吐芬芳') {
            res = res.split('"')
            remsg = res[res.length - 2]
        }
        this.reply(remsg)
    }, parm)
}


async function yf(e) {
    let msg = e.msg.replace("缘分", "").replace(/\s*/g, "")
    let isat;
    let name1;
    let name2;
    let namelist = [];
    e.message.forEach((item) => {
        if (item.type == "at") {
            namelist.push(item.text.replace(/@/g, ""))
            isat = true
        }
    })
    if (!isat) {
        let namelist = msg.replace("和", "|").split("|")
        name1 = namelist[0]
        name2 = namelist[1]
    } else {
        name1 = namelist[0]
        name2 = namelist[1]
    }
    await api.getapi(`https://xiaobai.klizi.cn/API/other/yf.php?name1=${encodeURI(name1)}&name2=${encodeURI(name2)}`, 0, (res) => {
        console.log(res);
        if (res.length == 2) {
            return this.reply("只支持中文名称哦,名字里有特殊字符的不行啦~")
        }

        this.reply(res)
    })

}

async function qz(e) {
    let msg = e.msg.replace("查权重", "")
    let qq;
    let at;
    if (msg == "" && !e.at) {
        qq = e.user_id
    } else if (e.at) {
        qq = e.at
        e.message.forEach((item) => {
            if (item.type == 'at') {
                at = item.text.replace("@", "")
            }
        })
    } else {
        qq = msg
    }
    await api.getapi(`http://tfapi.top/API/qqqz.php?type=json&qq=${qq}`, 0, (res) => {
        res = JSON.parse(res)
        if (res.code == 201) {
            return this.reply("查询失败！")
        } else {
            let rendmsg = []
            if (qq == e.user_id) {
                rendmsg.push(segment.at(qq))
            }
            if (res.qz != null) {
                rendmsg.push(`\nQQ: ${qq}\n查询状态：查询成功！\n权重: ${res.qz}\n权重越低，封号概率越大哦，要注意哟~`)
            } else {
                rendmsg.push("没查询到数据呢~再试一次吧！")
            }
            this.reply(rendmsg)
        }

    })
}

export default apps
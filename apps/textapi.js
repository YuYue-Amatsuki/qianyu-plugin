/**
 * @Author: uixmsi
 * @Date: 2022-10-05 00:51:12
 * @LastEditTime: 2022-10-15 21:08:26
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\textApi.js
 * @版权声明
 **/
import { Api } from '../lib/api.js'
let api = new Api()
let textlist = await api.getApiList('text')
let reg = getreg()
export class textContent extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '文本api',
            /** 功能描述 */
            dsc: '一句话',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: reg,
                    fnc: 'apitext'
                },
                {
                    reg: '^缘分',
                    fnc: 'yf'
                }
            ]
        })
    }
    async apitext(e) {
        let parm;
        let msg = e.msg
        let yllist = ["动漫", "恋爱", "鼓励", "孤独", "搞笑", "友情", "歌词", "经典"]
        if (msg == '网易云热评') {
            parm = 1887917182
        }
        if (msg.includes('语录') && yllist.includes(msg.replace("语录", ""))) {
            parm = encodeURI(msg.replace("语录", ""))
            msg = "(动漫|恋爱|鼓励|孤独|搞笑|友情|歌词|经典)语录"
        }
        if (msg.includes('答案之书')) {
            msg = "答案之书|^答案之书"
        }
        await api.getText(msg, async (res) => {
            let remsg = res;
            if (msg != '舔狗日记' && msg != '每日一文') {
                remsg = res.replace(/[\r\n]/g, "")
            }
            if (msg == "每日一文") {
                let msglist = remsg.replace(/(\n)/g, "*").split("*")
                let mes = []
                let js = { qq: 2548285036, name: "不是机器人" }
                msglist.forEach((item) => {
                    mes.push({
                        message: "    " + item,
                        nickname: js.name,//不是机器人
                        user_id: js.qq,
                    });
                })
                return this.reply(await e.group.makeForwardMsg(mes))
            }
            if (msg == '网易云热评') {
                let text = res.split("\n")
                remsg = text[text.length - 1]
            }
            this.reply(remsg)
        }, parm)
    }

    async yf(e) {
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
            console.log(res.length)
            if (res.length == 2) {
                return this.reply("只支持中文名称哦,名字里有特殊字符的不行啦~")
            }
            this.reply(res)
        })

    }
}
function getreg() {
    let reg = ''
    textlist.textapi.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.desc}$`
    });
    return reg
}

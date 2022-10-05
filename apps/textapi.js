/**
 * @Author: uixmsi
 * @Date: 2022-09-27 17:09:10
 * @LastEditTime: 2022-10-05 13:34:36
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\textapi.js
 * @版权声明
 **/
import { segment } from 'oicq'
import plugin from '../../../lib/plugins/plugin.js'
import { Api } from '../lib/api.js'
let api = new Api()
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
                    reg: '^人间凑数$',
                    fnc: 'coushu'
                },
                {
                    reg: '^一言$',
                    fnc: 'yiyan'
                },
                {
                    reg: '^古诗名句$',
                    fnc: 'gsmj'
                },
                {
                    reg: '^每日一言$',
                    fnc: 'mryy'
                },
                {
                    reg: '^名人一言$',
                    fnc: 'mryy2'
                },
                {
                    reg: '(动漫|恋爱|鼓励|孤独|搞笑|友情|歌词|伤感|经典)语录$',
                    fnc: 'yl'
                },
                {
                    reg: '^网易云热评$',
                    fnc: 'wyyrp'
                },
                {
                    reg: '^人生哲理$',
                    fnc: 'rszl'
                },
                {
                    reg: '^舔狗日记$',
                    fnc: 'tgrj'
                },
                {
                    reg: '^土味情话$',
                    fnc: 'twqh'
                },
                {
                    reg: '^骚话$',
                    fnc: 'sh'
                },
                {
                    reg: '^口吐芬芳$',
                    fnc: 'ktff'
                },
            ]
        })
    }

    //人间凑数
    async coushu(e) {
        await api.getText("我在人间凑数的日子", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }

    //一言
    async yiyan(e) {
        await api.getText("一言", (res) => {
            this.reply(res)
        })
    }

    //古诗名句
    async gsmj(e) {
        await api.getText("古诗名句", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }
    async mryy(e) {
        await api.getText("每日一句", (res) => {
            let msg = res.split("\n")
            let img = msg[0].replace("±img=", "").replace("±", "")
            return this.reply(segment.image(img))
        })
    }

    async mryy2(e) {
        await api.getText("名人一言", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }
    async yl(e) {
        let yltype = e.msg.replace("语录", "")
        if (yltype == "伤感") {
            await api.getText("伤感语录", (res) => {
                let msg = res.replace("\n", "")
                this.reply(msg)
            })
        } else {
            await api.getText("语录", (res) => {
                let msg = res.replace("\n", "")
                this.reply(msg)
            }, `?type=${encodeURI(yltype)}`)
        }

    }
    async wyyrp(e) {
        let id = 1887917182
        await api.getText("网易云热评", (res) => {
            let msg = res.split("\n")
            this.reply(msg[msg.length - 1])
        }, `?id=${id}`)
    }

    async rszl(e) {
        await api.getText("人生哲理", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }

    async tgrj(e) {
        await api.getText("舔狗日记", (res) => {
            this.reply(res)
        })
    }

    async twqh(e) {
        await api.getText("土味情话", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }

    async sh(e) {
        await api.getText("骚话", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }
    async ktff(e) {
        await api.getText("口吐芬芳", (res) => {
            let msg = res.replace("\n", "")
            this.reply(msg)
        })
    }
}

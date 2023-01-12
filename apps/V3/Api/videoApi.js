import { Api } from '../../../lib/api.js'
import { dowmvideo, ds } from '../../../utils/index.js'
import { segment } from 'oicq'
import moment from 'moment'
import fetch from 'node-fetch'
let api = new Api()
let videolist = await api.getApiList('video')
let path = `${process.cwd()}/plugins/qianyu-plugin/`
let apps = {
    id: 'videoApi',
    name: '千羽视频',
    desc: '视频类api合集',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: getreg(),
    desc: '视频类api合集',
    fnc: 'apivideo',
    fuc: apivideo
})

function getreg() {
    let reg = ''
    videolist.forEach((item, index) => {
        reg += `${index == 0 ? '' : '|'}^${item.reg}$`
    });
    return reg
}
let cd = {}
let iscd = false
async function apivideo(e) {
    let msg = e.msg
    let parms;
    if (cd[e.group_id]) {
        return this.reply("还在cd中！")
    }
    let { reg: str } = videolist.find(item => {
        let reg = new RegExp(item.reg)
        if (reg.test(msg)) {
            return true
        }
    })
    if (msg.includes('抖音搜索')) {
        parms = msg.replace("抖音搜索", "")
    }
    await api.getVideo(str, async (res) => {
        if (!res) {
            return this.reply("请求错误！请重试！")
        }
        if (msg.includes('抖音搜索')) {
            if (res.sp.includes(".mp3")) {
                res = res.fm
            } else {
                res = res.sp
            }
            msg = '抖音搜索'
        }
        if (res.includes('.douyinpic')) {
            return e.reply(segment.image(res))
        }
        if (iscd) {
            cd[e.group_id] = true
        }
        let response = await fetch(res);
        if (response.headers.get('content-type') == 'text/html;charset=utf-8') {
            let html = await response.text()
            const reg2 = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
            let url = html.match(reg2)[0]
            response = await fetch(url);
        }
        let buff = await response.arrayBuffer();
        await dowmvideo('短视频', `${msg}.mp4`, buff, async () => {
            e.reply(segment.video(`file:///${path}/resources/video/短视频/${msg}.mp4`))
            await ds('video', moment().add(30, 's').format(), async () => {
                if (iscd) {
                    delete cd[e.group_id]
                }
            })
        })
    }, parms)

}


export default apps
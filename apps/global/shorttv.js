import fetch from 'node-fetch'
import { segment } from 'oicq'
import { dowmvideo } from '../../utils/index.js'
import { Api } from '../../lib/api.js'
let api = new Api()
let videobv = ''
export async function jx(e) {
    //获取链接
    let msg;
    e.message.forEach(element => {
        if (element.type == 'text') {
            msg = element.text
        } else if (element.type == 'json') {
            let data = JSON.parse(element.data)
            msg = data.meta.detail_1.qqdocurl
        }

    });
    console.log(msg);
    let shorttv = ['b23.tv', 'v.douyin.com', 'v.kuaishou.com', 'h5.pipix.com']
    let urllist = ['m.bilibili.com', 'www.bilibili.com']
    let reg1 = new RegExp(`${shorttv[0]}|${shorttv[1]}|${shorttv[2]}|${shorttv[3]}`)
    let reg2 = new RegExp(`${urllist[0]}|${urllist[1]}`)
    let isbjx = await redis.get(`qianyu:isbjx:${e.group_id}`)
    let isstvjx = await redis.get(`qianyu:isstvjx:${e.group_id}`)
    if (reg1.test(msg) && isstvjx) {
        await shorttvjx(e, msg)
    } else if (reg2.test(msg) && isbjx) {
        await bjx(e, msg)
    }

}



async function shorttvjx(e, msg) {
    //短链接解析
    const reg2 = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    let url = msg.match(reg2)[0].split("?")[0]
    await api.getapi(`https://xiaobapi.top/api/xb/api/tiktok_ks.php?url=${url}`, ['message', 'url'], async (res) => {
        console.log("短视频解析中》》》》");
        let response = await fetch(res);
        let buff = await response.arrayBuffer();
        await dowmvideo('短视频', "video.mp4", buff, () => {
            e.reply(segment.video(`file:///${process.cwd()}/plugins/qianyu-plugin/resources/video/短视频/video.mp4`))
            videobv = ''
        })
    })
}

async function bjx(e, msg) {
    //b站解析
    const reg2 = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    let url = msg.match(reg2)
    console.log(url);
    let bv;
    let reg3 = new RegExp(/(BV.*?).{10}/)
    bv = url[0].match(reg3)[0]
    if (bv == videobv) {
        return
    }
    let videourl = 'https://www.bilibili.com/video/' + bv
    videobv = bv
    await api.getapi(`http://fuyhi.top/api/bilibili_jx/api.php?url=${videourl}`, ['data', '0'], async (res) => {
        console.log("b站视频解析中》》》》");
        let response = await fetch(res.video_url);
        let buff = await response.arrayBuffer();
        await dowmvideo('b站', "video.mp4", buff, () => {
            e.reply(segment.video(`file:///${process.cwd()}/plugins/qianyu-plugin/resources/video/b站/video.mp4`))
            videobv = ''
        })
    })
}

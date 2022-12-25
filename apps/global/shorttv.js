import fetch from 'node-fetch'
import { segment } from 'oicq'
import { dowmvideo } from '../../utils/index.js'
import { Api } from '../../lib/api.js'
let api = new Api()
let videobv = ''
let path = `${process.cwd()}/plugins/qianyu-plugin/`
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
    let shorttv = ['v.douyin.com', 'v.kuaishou.com', 'h5.pipix.com']
    let urllist = ['b23.tv', 'm.bilibili.com', 'www.bilibili.com']
    let reg1 = new RegExp(`${shorttv[0]}|${shorttv[1]}|${shorttv[2]}`)
    let reg2 = new RegExp(`${urllist[0]}|${urllist[1]}|${urllist[2]}`)
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
    await api.getapi(`https://api.wya6.cn/api/Short_video_analysis?return=json&url=${url}`, ['data', 'url'], async (res) => {
        console.log("短视频解析中》》》》");
        let response = await fetch(res);
        let buff = await response.arrayBuffer();
        await dowmvideo('短视频', "video.mp4", buff, () => {
            e.reply(segment.video(`file:///${path}/resources/video/短视频/video.mp4`))
            videobv = ''
        })
    })
}

async function bjx(e, msg) {
    //b站解析
    const reg2 = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
    let url = msg.match(reg2)
    if (url[0].includes('https://b23.tv/')) {
        await api.getapi(`https://xiaobai.klizi.cn/API/other/url_restore.php?url=${url}`, ['redirect_url', '0'], async (res) => {
            url = res
            await bili(e, [url])
        })
    } else {
        await bili(e, url)
    }

}

async function bili(e, url) {
    let reg3 = new RegExp(/(BV.*?).{10}/)
    let bv;
    console.log(url);
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
            e.reply(segment.video(`file:///${path}/resources/video/b站/video.mp4`))
            videobv = ''
        })
    })
}

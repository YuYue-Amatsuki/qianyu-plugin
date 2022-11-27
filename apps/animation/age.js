import jsdom from 'jsdom'
import { segment } from 'oicq'
import { geturldata } from '../../utils/index.js'
let JSDOM = jsdom.JSDOM
let apps = {
    id: 'age',
    name: 'age',
    desc: 'age',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^(今日|今天|每日)(推荐动漫|动漫推荐)',
    desc: '推荐动漫',
    fnc: 'dayanimat',
    fuc: dayanimat
})
let datalist = []

async function dayanimat(e) {
    let msglist = []
    let page = e.msg.replace(/(今日|今天|每日)(推荐动漫|动漫推荐)/g, "") || 1;
    if (page > 5) {
        return this.reply("没有了，呜呜呜呜~~~~~")
    }
    if (datalist.length > 0) {
        if (datalist[page - 1]) {
            for (let d of datalist[page - 1]) {
                msglist.push([d.name, segment.image(d.img)])
            }
            return this.reply(await this.makeGroupMsg('今日推荐动漫', msglist, `第${datalist.length}页`))
        }
    }

    await geturldata('https://www.agemys.net/recommend?page=' + page, 0, (res) => {
        let document = new JSDOM(res.data).window.document
        let alist = document.querySelectorAll(".anime_icon2")
        datalist[page - 1] = []
        for (let i = 0; i < alist.length; i++) {
            let name = alist[i].querySelector(".anime_icon2_name>a").innerHTML
            let img = alist[i].querySelector('img').src
            datalist[page - 1].push({ name: name, img: img })
        }
    })
    for (let d of datalist[page - 1]) {
        msglist.push([d.name, segment.image(d.img)])
    }
    this.reply(await this.makeGroupMsg('今日推荐动漫', msglist, `第${page}页`))
}





export default apps
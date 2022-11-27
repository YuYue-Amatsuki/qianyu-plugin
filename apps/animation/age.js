import { segment } from 'oicq'
import { geturldata, ds } from '../../utils/index.js'
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
    if (page < 1) {
        return this.reply("乱搞！不理你了！")
    }
    if (datalist.length > 0) {
        if (datalist[page - 1]) {
            for (let d of datalist[page - 1]) {
                msglist.push([d.name, segment.image(d.img)])
            }
            return this.reply(await this.makeGroupMsg('今日推荐动漫', msglist, `第${datalist.length}页`))
        }
    }

    await geturldata({
        url: 'http://127.0.0.1/api/ageedtj/' + page, data: ['data'], headers: { source: qySource }
    }, async (res) => {
        datalist[page - 1] = []
        for (let r of res.data) {
            datalist[page - 1].push({ name: r.name, img: r.img })
            msglist.push([r.name, segment.image(r.img)])
        }
        this.reply(await this.makeGroupMsg('今日推荐动漫', msglist, `第${page}页`))
    })


}
await ds("bs", `0 0 0 * * *`, async () => {
    datalist = []
})

export default apps
import { Api } from '../../../lib/api.js'
import { returnImg, geturldata } from '../../../utils/index.js'
let api = new Api()
let apps = {
    id: 'apilist',
    name: '千羽接口管理器',
    desc: '千羽接口管理器',
    event: 'message',
    rule: []
}


apps.rule.push({
    reg: 'api检测',
    desc: 'api检测',
    fnc: 'apitest',
    fuc: apitest
})


async function apitest(e) {
    if (!e.isMaster) {
        return this.reply('暂无权限！')
    }
    let textlist = []
    let imglist = []
    let textapilist = await api.getApiList('text')
    let imageapilist = await api.getApiList('image')
    this.reply('正在检测中—————请稍后！')
    textlist = await test(textapilist)
    imglist = await test(imageapilist)
    let apilist = [
        {
            name: '文本API',
            list: textlist
        }, {
            name: '图片API',
            list: imglist
        }
    ]
    this.reply(await returnImg('api', { apilist: apilist }))
}

async function test(data) {
    let list = []
    for (let i of data) {
        await geturldata(i, (res) => {
            list.push({ name: i.name, code: res.responseStatus })
        })
    }
    return list
}


export default apps
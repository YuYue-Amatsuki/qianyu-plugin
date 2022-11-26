import { segment } from 'oicq'
import { filemage, geturldata } from '../../utils/index.js'
import moment from 'moment'
import lodash from 'lodash'
let file = new filemage()
let { imagelist } = await file.getyamlJson('resources/data/api/image')
let { textapi } = await file.getyamlJson('resources/data/api/text')
let { ailist } = await file.getyamlJson('resources/data/api/ai')
let apps = {
    id: 'api',
    name: 'api管理',
    desc: 'api管理',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^文本api测试$',
    desc: '测试文本api',
    fnc: 'testtext',
    fuc: testtext
})

apps.rule.push({
    reg: '^图片api测试$',
    desc: '测试图片api',
    fnc: 'testimage',
    fuc: testimage
})


async function testtext(e) {
    let sucnum = 0, defnaum = 0, timeoutnum = 0;
    this.reply("正在测试中,请稍后...")
    for (let i of textapi) {
        let data = await geturldata(i.url, i.data, async res => {
            if (res.responseStatus == 200) {
                sucnum++
            } else if (res.responseStatus == 400) {
                defnaum++
            }
            else if (res.responseStatus == 404) {
                defnaum++
            }
            else if (res.responseStatus == 408) {
                timeoutnum++
            }

        })
        if (data) {
            defnaum++
        }
    }
    this.reply(`总收录${textapi.length}个接口，其中成功接口${sucnum}个,失效接口${defnaum}个,超时接口${timeoutnum}个。`)
}

async function testimage(e) {
    let sucnum = 0, defnaum = 0, timeoutnum = 0;
    this.reply("正在测试中,请稍后...")
    for (let i of imagelist) {
        let data = await geturldata(i.url, i.data, async res => {
            if (res.responseStatus == 200) {
                sucnum++
            } else if (res.responseStatus == 400) {
                defnaum++
            }
            else if (res.responseStatus == 404) {
                defnaum++
            }
            else if (res.responseStatus == 408) {
                timeoutnum++
            }

        })
        if (data) {
            defnaum++
        }
    }
    this.reply(`总收录${imagelist.length}个接口，其中成功接口${sucnum}个,失效接口${defnaum}个,超时接口${timeoutnum}个。`)
}



export default apps
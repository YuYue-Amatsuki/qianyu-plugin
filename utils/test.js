/**
 * @Author: uixmsi
 * @Date: 2022-10-16 00:23:44
 * @LastEditTime: 2022-10-16 11:56:45
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\test.js
 * @版权声明
 **/
import lodash from 'lodash'
import { filemage } from './filemage.js'
import { geturldata } from './request.js'
let url = "http://api.qingyunke.com/api.php?key=free&appid=0&msg=" //青云客
const file = new filemage()
let msg = "折"
let botname = "真寻"
let info = await file.get_fileinfo('/resources/data/anime.json')
let returnmsg;
let istshf;
for (let i in info) {
    if (msg.includes(i)) {
        istshf = true
        returnmsg = info[i][lodash.random(info[i].length - 1)]
    }
}
if (!istshf) {
    await geturldata(url, ['content'], (res) => {
        let noanwer = [`你说个“${msg}”是什么意思`, `${msg}？不明白你说啥，麻烦您老说明白点`, `把话说详细点，发个“${msg}”能说明什么`, `${msg}？`, `“${msg}”是啥意思？`]
        if (noanwer.includes(res)) {
            noresult()
        }
    }, msg)
}

async function noresult() {
    let isimg = lodash.random(0, 5) <= 2 ? true : false
    let nomsg = [`${botname}不知道哦！`, '哦哦~~', '哦~', 'en~', '嗯。', '嗯？', '嗯嗯~', `${botname}不懂你说的这个东西呢！`, `虽然${botname}不知道，但是${botname}可以学！`]
    if (isimg) {
        let imglist = await file.getlist('resources/img/noresult')
        returnmsg = "这是图片哦"
    } else {
        returnmsg = nomsg[lodash.random(0, nomsg.length - 1)]
    }

}

console.log(returnmsg)

console.log(imglist)
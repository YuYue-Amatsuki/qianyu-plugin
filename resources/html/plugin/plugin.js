import fs from 'fs'
import { Restart } from '../other/restart.js'
import { segment } from 'oicq'
let path = `${process.cwd()}/plugins/qianyu-plugin`
let e = JSON.parse(await redis.get('qianyu:xf'))
let msg = '恭喜你已卸载云崽最大bug千羽插件！'
if (e) {
    del(path)
}
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

if (e) {
    if (e.isGroup) {
        Bot.sendGroupMsg(e.group_id, [segment.at(e.user_id), " ", msg], { message: e.message, rand: e.rand, seq: e.seq, time: e.time, user_id: e.user_id })
    } else {
        Bot.pickUser(e.user_id).sendMsg(msg)
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
}

redis.del('qianyu:xf')

import { wz } from '../game/wz.js'
import { jx } from './shorttv.js'

let apps = {
    id: 'allon',
    name: '全局',
    desc: '全局',
    event: 'message',
    rule: []
}

Bot.on("message", async (e) => {
    //伪装任务
    let iswz = await redis.get('qianyu:wz:iswz')
    if (iswz) {
        await wz(e)
    }
    //视频解析(b站)
    await jx(e)

})

export default apps
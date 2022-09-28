/**
 * @Author: uixmsi
 * @Date: 2022-09-29 00:22:34
 * @LastEditTime: 2022-09-29 01:25:18
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\bstime.js
 * @版权声明
 **/
import moment from 'moment'
import { cacelds, ds } from "../utils/schedule.js"
let grouplist = [213311278]

await cacelds("bs")
await ds("bs", '0 0 0,1,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *', () => {
    for (let g of grouplist) {
        let hour = moment().hour()
        Bot.sendGroupMsg(g, `现在是北京时间${hour}点~~`)
    }
})

/**
 * @Author: uixmsi
 * @Date: 2022-09-29 00:41:07
 * @LastEditTime: 2022-09-29 00:46:47
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\schedule.js
 * @版权声明
 **/
import schedule from "node-schedule";

/******* 
 * @description: 取消定时任务
 * @param {*} name 定时器名字
 * @return {*}
 * @use: 
 */
export async function cacelds(name) {
    for (var i in schedule.scheduledJobs) {
        if (schedule.scheduledJobs[i].name == name) {
            schedule.cancelJob(name);
        }
    }
}

/******* 
 * @description: 创建定时任务
 * @param {*} timeid 定时器名字
 * @param {*} time 时间
 * @param {*} fn 方法
 * @return {*}
 * @use: 
 */
export async function ds(timeid, time, fn) {
    schedule.scheduleJob(timeid, time, async () => {
        fn()
    })
}
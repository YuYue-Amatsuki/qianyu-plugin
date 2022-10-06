/**
 * @Author: uixmsi
 * @Date: 2022-09-27 16:45:00
 * @LastEditTime: 2022-10-06 16:12:52
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\index.js
 * @版权声明
 **/
import { init, startTask } from './lib/init.js'

//打印启动日志
logger.info(`--------------------------`);
logger.info(`千羽初号机已启动~`);
logger.info(`--------------------------`);

//加载定时任务
await startTask()

//将所有的js加入到apps中sdds
let main = new init()
await main.load()
let apps = main.apps
//导出
export { apps };

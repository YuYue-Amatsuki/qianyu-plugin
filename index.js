/**
 * @Author: uixmsi
 * @Date: 2022-09-27 16:45:00
 * @LastEditTime: 2022-09-29 01:24:35
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\index.js
 * @版权声明
 **/
import fs from "node:fs";
import { startTask } from './lib/init.js'
//打印启动日志
logger.info(`--------------------------`);
logger.info(`千羽初号机已启动~`);
logger.info(`--------------------------`);


//读取文件夹下所有的js文件
const files = fs
  .readdirSync("./plugins/qianyu-plugin/apps")
  .filter((file) => file.endsWith(".js"));

//加载定时任务
await startTask()

//将所有的js加入到apps中
let apps = {};
for (let file of files) {
  let name = file.replace(".js", "");
  console.log(await import('./apps/' + file))
  if (name == "bstime") {
    apps[name] = (await import('./apps/' + file));
  } else {
    apps[name] = (await import('./apps/' + file))[name];
  }

  console.log(apps)
}
//导出
export { apps };

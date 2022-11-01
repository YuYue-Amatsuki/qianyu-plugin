/**
 * @Author: uixmsi
 * @Date: 2022-10-26 15:26:10
 * @LastEditTime: 2022-10-27 13:27:41
 * @LastEditors: uixmsi
 * @Description:
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin2\app.js
 * @版权声明
 **/
//引入init
// import loader from './lib/Loader.js'
// import al from './lib/getallplugin.js'
// let apps = await loader.loadapp()
// let a = new al()
// await a.load()
import apps from './apps/index.js'
logger.info(`--------------------------`);
logger.info(`千羽初号机已启动~`);
logger.info(`--------------------------`);
export { apps }

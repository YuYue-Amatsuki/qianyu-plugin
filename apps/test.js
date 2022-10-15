/**
 * @Author: uixmsi
 * @Date: 2022-10-15 01:19:40
 * @LastEditTime: 2022-10-15 17:13:06
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\test.js
 * @版权声明
 **/

import { filemage } from "../utils/filemage.js"
let file = new filemage()
let data = await file.getyaml("config/help")
console.log(data)
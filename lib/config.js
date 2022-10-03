/**
 * @Author: uixmsi
 * @Date: 2022-09-29 17:51:17
 * @LastEditTime: 2022-09-29 17:57:04
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\config\config.js
 * @版权声明
 **/
import YAML from 'yaml'
import fs from 'fs'
let file = process.cwd() + '/plugins/qianyu-plugin/config/help_cofig.yaml'

let data = YAML.parse(
    fs.readFileSync(file, 'utf8'))
console.log(data.helplist)
/**
 * @Author: uixmsi
 * @Date: 2022-10-04 13:09:32
 * @LastEditTime: 2022-10-04 13:24:01
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\puppeteer.js
 * @版权声明
 **/
import puppeteer from "../../../lib/puppeteer/puppeteer.js";

export async function returnImg(name, data) {
    let img = await puppeteer.screenshot(name, {
        tplFile: `./plugins/qianyu-plugin/resources/${name}/${name}.html`,
        _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
        /** 绝对路径 */
        ...data
    });
    return img
}

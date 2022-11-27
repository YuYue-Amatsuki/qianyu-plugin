/**
 * @Author: uixmsi
 * @Date: 2022-10-04 13:09:32
 * @LastEditTime: 2022-10-25 10:22:13
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\puppeteer.js
 * @版权声明
 **/
import puppeteer from "../lib/puppeteer.js";

export async function returnImg(name, data) {
    let layoutPath = process.cwd() + `/plugins/qianyu-plugin/resources/common/layout/`
    let img = await puppeteer.screenshot(name, {
        tplFile: `./plugins/qianyu-plugin/resources/html/${name}/${name}.html`,
        _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
        /** 绝对路径 */
        defaultLayout: layoutPath + 'default.html',
        ...data,
        pageGotoParams: { waitUntil: 'load', timeout: 0 }
    });
    return img
}

/**
 * @Author: uixmsi
 * @Date: 2022-10-04 23:54:39
 * @LastEditTime: 2022-10-07 22:58:16
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\request.js
 * @版权声明
 **/
import fetch from "node-fetch";
export async function geturldata(url, data, suc, parms) {
    if (parms != undefined) {
        url += parms
    }
    if (data == 0) {
        try {
            let response = await fetch(url);
            let data = await response.text();
            suc(data)
        } catch (error) {
            console.log('Request Failed', error);
        }
    } else {
        let respon = await fetch(url)
        let json = await respon.json()
        let dc = json
        for (let i in data) {
            dc = dc[data[i]]
        }
        suc(dc)
    }
}
/**
 * @Author: uixmsi
 * @Date: 2022-10-04 23:54:39
 * @LastEditTime: 2022-10-06 15:08:09
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
    if (data == 'data') {
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
        suc(json[data])
    }
}


/**
 * @Author: uixmsi
 * @Date: 2022-10-04 23:54:39
 * @LastEditTime: 2022-10-05 12:19:32
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\request.js
 * @版权声明
 **/
import fetch from "node-fetch";
import axios from 'axios'
export async function geturldata(url, parms) {
    if (parms != undefined) {
        url += parms
    }
    let reposn = await fetch(url)
    let json = await reposn.json()
    return json
}

export async function geturldata2(url, suc, parms) {
    if (parms != undefined) {
        url += parms
    }
    axios.get(url).then((res) => {
        if (res.data != undefined) {
            suc(res.data)
        }
    })
}
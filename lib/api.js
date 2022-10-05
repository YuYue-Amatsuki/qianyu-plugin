/**
 * @Author: uixmsi
 * @Date: 2022-10-05 00:53:21
 * @LastEditTime: 2022-10-05 17:00:01
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\lib\api.js
 * @版权声明
 **/
import { geturldata, geturldata2 } from "../utils/request.js"
import { filemage } from "../utils/filemage.js"
let file = new filemage()
export class Api {
    constructor() { }
    async getText(name, suc, parms) {
        let textlist = await this.getApi('text')
        let data;
        textlist.forEach(async element => {
            if (element.desc == name) {
                if (element.data == 'data') {
                    data = await geturldata2(element.url, (res) => {
                        suc(res)
                    }, parms)
                } else {
                    data = await geturldata(element.url, parms)
                    suc(data[element.data])
                }
            }
        });
    }
    getImage() {

    }
    getVideo() {

    }

    async getApi(type) {
        if (type == 'text') {
            let apilist = await file.getyaml('config/api/text')
            return apilist.textapi
        } else if (type == 'image') {
            return apilist.imgapi
        } else {
            return apilist.videoapi
        }
    }
}
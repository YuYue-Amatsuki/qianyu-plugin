/**
 * @Author: uixmsi
 * @Date: 2022-10-05 00:53:21
 * @LastEditTime: 2022-10-07 17:41:12
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\lib\api.js
 * @版权声明
 **/
import { geturldata } from "../utils/request.js"
import { filemage } from "../utils/filemage.js"
let file = new filemage()
export class Api {
    constructor() { }
    async getText(name, suc, parms) {
        let textlist = await this.getApi('text')
        let data;
        textlist.forEach(async element => {
            if (element.desc == name) {
                data = await geturldata(element.url, element.data, (res) => {
                    suc(res)
                }, parms)
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
            let apilist = await file.getyaml('config/api/image')
            return apilist.imgapi
        } else {
            return apilist.videoapi
        }
    }
}
let apilist = await file.getyaml('config/api/text')

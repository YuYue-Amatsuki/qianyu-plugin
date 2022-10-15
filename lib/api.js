/**
 * @Author: uixmsi
 * @Date: 2022-10-05 00:53:21
 * @LastEditTime: 2022-10-15 21:46:56
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
        textlist.forEach(async element => {
            if (element.desc == name) {
                await geturldata(element.url, element.data, (res) => {
                    suc(res)
                }, parms)
            }
        });
    }
    async getImage(name, suc, parms) {
        let textlist = await this.getApi('image')
        textlist.forEach(async element => {
            if (element.name == name) {
                if (element.data == 1) {
                    suc({ res: element.url, isurl: true })
                }
                else if (element.data != 1) {
                    await geturldata(element.url, element.data, (res) => {
                        if (typeof res == "string") {
                            res = { res: res, isurl: true }
                        }
                        if (element.islist) {
                            res = { res: res, islist: true }
                        }
                        suc(res)
                    }, parms)
                }
            }
        });
    }
    getVideo() {

    }
    async getRecord(name, suc, parms) {
        let textlist = await this.getApi('record')
        textlist.forEach(async element => {
            if (element.name == name) {
                if (element.data == 1) {
                    suc({ res: element.url, isurl: true })
                }
                else if (element.data != 1) {
                    await geturldata(element.url, element.data, (res) => {
                        if (typeof res == "string") {
                            res = { res: res, isurl: true }
                        }
                        if (element.islist) {
                            res = { res: res, islist: true }
                        }
                        suc(res)
                    }, parms)
                }
            }
        });
    }

    async getapi(url, data, suc, parms) {
        await geturldata(url, data, (res) => {
            suc(res)
        }, parms)
    }

    async getApi(type) {
        if (type == 'text') {
            let apilist = await file.getyaml('resources/data/api/text')
            return apilist.textapi
        } else if (type == 'image') {
            let apilist = await file.getyaml('resources/data/api/image')
            return apilist.imagelist
        } else if (type == 'record') {
            let apilist = await file.getyaml('resources/data/api/record')
            return apilist.recordapi
        }
    }
    async getApiList(type) {
        if (type == 'text') {
            let apilist = await file.getyaml('resources/data/api/text')
            return apilist
        } else if (type == 'image') {
            let apilist = await file.getyaml('resources/data/api/image')
            return apilist
        }
        else if (type == 'record') {
            let apilist = await file.getyaml('resources/data/api/record')
            return apilist
        }
    }
}

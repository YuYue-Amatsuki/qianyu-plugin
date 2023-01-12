/**
 * @Author: uixmsi
 * @Date: 2022-10-04 13:09:32
 * @LastEditTime: 2022-10-25 10:22:13
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\utils\puppeteer.js
 * @版权声明
 **/
import Runtime from '../../../lib/plugins/runtime.js'
const path = `/plugins/qianyu-plugin/resources/`
const rtime = new Runtime()

export async function returnImg(name, data) {
    return await rtime.render('qianyu-plugin', `/html/${name}/${name}.html`, {
        ...data,
    },
        {
            retType: 'base64',
            beforeRender({ data }) {
                let resPath = data.pluResPath
                return {
                    ...data,
                    _res_path: resPath
                }
            }
        }
    )
}

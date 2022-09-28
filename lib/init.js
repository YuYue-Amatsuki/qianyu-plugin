/**
 * @Author: uixmsi
 * @Date: 2022-09-29 00:28:28
 * @LastEditTime: 2022-09-29 00:50:50
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\lib\init.js
 * @版权声明
 **/
//项目运行加载所有定时插件dcdsrtefd
import fs from "fs"
import moment from 'moment'
import { cacelds, ds } from "../utils/schedule.js"

const __dirname = process.cwd();
const bs = __dirname + '/plugins/qianyu-plugin/data/ds/'

export async function startTask() {
    console.log("加载所有定时任务")
    let userlist = fs.readdirSync(bs).filter((file) => file.endsWith(".json"));
    for (let u of userlist) {
        let userinfo = JSON.parse(await fs.readFileSync(bs + u))
        let user_id = Number(u.replace(".json", ""))
        for (let task of userinfo.task) {
            if (moment().isBefore(task.endTime)) {
                //  console.log(user_id + task.name)
                await cacelds(user_id + task.name)
                await ds(user_id + task.name, task.endTime, () => {
                    if (task.group_id == undefined) {
                        Bot.sendPrivateMsg(user_id, task.content)
                    } else {
                        let msg = [segment.at(user_id), task.content]
                        Bot.sendGroupMsg(task.group_id, msg)
                    }
                    userinfo.task.forEach((t, index) => {
                        if (t.name == task.name) {
                            userinfo.task.splice(index, 1)
                            fs.writeFileSync(bs + user_id + ".json", JSON.stringify(userinfo))
                        }
                    })
                })

            }
        }
    }
}


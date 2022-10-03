/**
 * @Author: uixmsi
 * @Date: 2022-09-24 21:39:00
 * @LastEditTime: 2022-10-04 00:11:54
 * @LastEditors: uixmsi
 * @Description: 
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\apps\定时提醒.js
 * @版权声明
 **/
import plugin from '../../../lib/plugins/plugin.js'
import moment from 'moment'
import { filemage } from '../utils/filemage.js'
import path from "path"
import { segment } from "oicq"
import puppeteer from "../../../lib/puppeteer/puppeteer.js";
import { ds } from '../utils/schedule.js'
//推送群
const __dirname = path.resolve();
const bs = 'data/ds/'
//创建文件夹dsdtrtr

const file = new filemage()
console.log(file)
export class baoshi extends plugin {
    constructor() {
        super({
            name: '挖矿提醒',
            dsc: '提醒挖矿',
            /** https://oicqjs.github.io/oicq/#eventsdsd懂得dfd dsddfdfdssdsds*sdsdsdddfdf
            event: 'message',d
            /** 优先级，数字越小等级越高 */
            priority: 100,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^记录挖矿时间', //匹配消息正则，命令正则fdfd
                    /** 执行方法 */
                    fnc: 'wkjl'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^水晶矿刷新时间', //匹配消息正则，命令正则dsds
                    /** 执行方法 */
                    fnc: 'sxsj'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^记录狗粮时间', //匹配消息正则，命令正则fdsfdsdssdcsdsfd
                    /** 执行方法 */
                    fnc: 'gljl'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^狗粮刷新时间', //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'sxgl'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^挖矿记录', //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'getwknum'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^水晶矿路线图', //匹配消息正则，命令正则
                    /** 执行方法 */
                    fnc: 'wklx'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^定时列表', //匹配消息正则，命令正则ffggfgf
                    /** 执行方法 */
                    fnc: 'dslist'
                },
            ]
        })
    }
    /* 挖矿记录 */
    async wkjl(e) {
        let user = await this.checkuser(e)
        let searchData;
        if (!user) {
            user = {
                wk: {
                    wknum: 1,
                    knum: 172
                }, task: []
            }
        } else {
            //用户存在
            searchData = this.searchjl(user, "水晶矿刷新")
        }
        if (searchData != undefined) {
            if (searchData.isCD) {
                return this.reply("水晶矿还在冷却当中~~")
            }
            user = {
                wk: {
                    wknum: user.wk == undefined ? 1 : user.wk.wknum + 1,
                    knum: user.wk == undefined ? 172 : user.wk.knum + 172
                }, task: user.task
            }
        }
        this.writejl(e, user, { name: '水晶矿刷新', now: moment().format(), cron: moment().add(3, 'd').format(), content: "矿已经重新生成了！快来挖矿啊" }, searchData == undefined ? undefined : searchData.index)
        let msg = []
        if (e.isGroup) {
            msg.push(segment.at(e.user_id))
        }
        msg.push("已成功记录挖矿时间！")
        this.reply(msg)
        await ds(e.user_id + "水晶矿刷新", moment().add(3, 'd').format(), async () => {
            let msg = []
            if (e.isGroup) {
                msg.push(segment.at(e.user_id))
            }
            msg.push("矿已经重新生成了！快来挖矿啊！")
            this.reply(msg)
            await this.deletejl(e, user, "水晶矿刷新")
        })
    }

    //水晶矿刷新时间
    async sxsj(e) {
        //检查用户信息
        let user = await this.checkuser(e)
        if (!user) {
            return this.reply("你还没有记录挖矿时间呢~发送记录挖矿时间，再来查看时间吧！")
        }
        let endTime;
        user.task.forEach((item) => {
            if (item.name == "水晶矿刷新") {
                endTime = item.endTime
            }
        })
        this.reply(`水晶矿还差${differTime(moment().format(), moment(endTime))}刷新！`)

    }

    async gljl(e) {
        let user = await this.checkuser(e)
        let searchData;
        if (!user) {
            user = {
                task: []
            }
        } else {
            //用户存在
            searchData = this.searchjl(user, "狗粮刷新")
        }
        if (searchData != undefined) {
            if (searchData.isCD) {
                return this.reply("狗粮还在冷却当中~~")
            }
        }
        this.writejl(e, user, { name: '狗粮刷新', now: moment().format(), cron: moment().add(1, 'd').format(), content: "狗粮已经重新生成了！快来拿啊" }, searchData == undefined ? undefined : searchData.index)
        let msg = []
        if (e.isGroup) {
            msg.push(segment.at(e.user_id))
        }
        msg.push("已成功记录狗粮时间！")
        this.reply(msg)
        await ds(e.user_id + "狗粮刷新", moment().add(1, 'd').format(), async () => {
            let msg = []
            if (e.isGroup) {
                msg.push(segment.at(e.user_id))
            }
            msg.push("狗粮已经重新生成了！快来拿啊！")
            this.reply(msg)
            await this.deletejl(e, user, "狗粮刷新")
        })
    }

    //狗粮刷新时间sds
    async sxgl(e) {
        //检查用户信息
        let user = await this.checkuser(e)
        if (!user) {
            return this.reply("你还没有记录狗粮时间呢~发送记录狗粮时间，再来查看时间吧！")
        }
        let endTime;
        user.task.forEach((item) => {
            if (item.name == "狗粮刷新") {
                endTime = item.endTime
            }
        })
        this.reply(`狗粮还差${differTime(moment().format(), moment(endTime))}刷新！`)

    }



    //挖矿统计
    async getwknum(e) {
        let user = await this.checkuser(e)
        if (!user || user.wk == undefined) {
            return this.reply("暂无挖矿记录！")
        } else {
            this.reply(`挖矿次数:${user.wk.wknum}\n水晶矿数量:${user.wk.knum}`)
        }
    }

    //检查用户数据
    async checkuser(e) {
        //如果存在返回数据，如果不存在返回falsefdfd
        let path = bs + e.user_id + ".json"
        let userinfo = await file.get_fileinfo(path)
        return userinfo
    }

    //挖矿路线图
    async wklx(e) {
        this.reply(segment.image(`${__dirname}/plugins/qianyu-plugin/data/挖矿路线图.jpg`))
    }

    //写入记录
    async writejl(e, userinfo, task, index) {
        //是否有记录，有则覆盖,无则添加
        if (!index) {
            userinfo.task.push({ name: task.name, startTime: task.now, endTime: task.cron, content: task.content, group_id: e.group_id == undefined ? undefined : e.group_id })
        } else {
            userinfo.task[index] = { name: task.name, startTime: task.now, endTime: task.cron, content: task.content, group_id: e.group_id == undefined ? undefined : e.group_id }
        }
        await file.write_file(bs + e.user_id + ".json", userinfo)
    }

    //查询记录
    searchjl(userinfo, name) {
        let isexist = false//是否存在记录
        let isAfter = false;//是否已经可以重新覆盖
        let index;//记录在数组中的位置
        let isCD = false
        userinfo.task.forEach((item, index) => {
            //有覆盖
            if (item.name == name) {
                isexist = true
                if (moment().isAfter(item.endTime)) {
                    isAfter = true
                    index = index
                }
            }
        })
        if (!isAfter && isexist) {
            //冷却中
            isCD = true
        }
        return {
            isexist: isexist,
            index: index,
            isAfter: isAfter,
            isCD: isCD
        }
    }

    //删除记录
    async deletejl(e, user, name) {
        user.task.forEach(async (t, index) => {
            if (t.name == name) {
                user.task.splice(index, 1)
                await file.write_file(bs + e.user_id + ".json", user)
            }
        })
    }

    //定时列表
    async dslist(e) {
        let user = await this.checkuser(e)
        if (!user) {
            //不存在用户数据
            return this.reply("你还没有定时任务！")
        } else {
            let msg = []
            user.task.forEach((item) => {
                let jlux = differTime(moment().format(), moment(item.endTime))//距离时间
                msg.push(`${item.name}还差${jlux}`)
            })
            let img = await puppeteer.screenshot("timelist", {
                tplFile: `./plugins/qianyu-plugin/resources/timelist/timelist.html`,
                _res_path: process.cwd() + '/plugins/qianyu-plugin/resources/',
                /** 绝对路径 */
                timelist: msg
            });
            this.reply(img)
        }
    }
}

function differTime(startTime, endTime) {
    //const year = moment(endTime).diff(moment(startTime), 'years')//年year + "年" + month + "月" +
    //const month = moment(endTime).diff(moment(startTime), 'months') % 12//月
    const day = moment(endTime).diff(moment(startTime), 'days')  //
    const hour = moment(endTime).diff(moment(startTime), 'hours') % 24
    const minute = moment(endTime).diff(moment(startTime), 'minutes') % 60//
    const second = moment(endTime).diff(moment(startTime), 'seconds') % 60
    return day + "天" + hour + "时" + minute + "分" + second + "秒"
}

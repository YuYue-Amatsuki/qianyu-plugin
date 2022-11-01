import { Plugin } from '../lib/Plugin.js'
import help from './help.js'
import imageApi from './imageApi.js'
import textApi from './textApi.js'
import set from './set.js'
import ai from './ai.js'
import update from './update.js'
//import manage from './manage.js'
//从插件接收方法和设置
let apps = [help, imageApi, textApi, set, ai, update] //manage
let as = []
for (let i in apps) {
    let p = class extends Plugin {
        constructor() {
            super({
                name: apps[i].name,
                /** 功能描述 */
                dsc: apps[i].event,
                event: apps[i].event,
                /** 优先级，数字越小等级越高 */
                priority: apps[i].priority || 50,
                rule: apps[i].rule
            })
        }
    }
    for (let r in apps[i].rule) {
        p.prototype[apps[i].rule[r].fnc] = apps[i].rule[r].fuc
    }

    as[apps[i].id] = p
}

export default as
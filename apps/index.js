import { Plugin } from '../lib/Plugin.js'
import help from './help.js'
import imageApi from './api/imageApi.js'
import textApi from './api/textApi.js'
import Api from './api/api.js'
import set from './cofig/qianyu/set.js'
import ai from './global/ai.js'
import update from './update.js'
import bs from './timer/bs.js'
import manage from './global/manage.js'
import setu from './se/setu.js'
import sqtj from './component/sqtj.js'
import wz from './game/wz.js'
import pivix from './se/pivix.js'
import prefix from './cofig/yunzai/prefix.js'
import age from './animation/age.js'
import allon from './global/allon.js'
import chuo from './global/chuo.js'
import chehui from './component/chehui.js'
import version from './component/version.js'
import plugins from './component/plugins.js'
import request from './global/request.js'
import agree from './global/agree.js'
import guess from './game/guessCharacter.js'
//从插件接收方法和设置
let apps = [help, imageApi, textApi, set, ai, update, bs, manage, sqtj, wz, pivix, prefix, Api, age, allon, chehui, version, chuo, plugins, request, agree, guess] //
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
    for (let r in apps[i].fuc) {
        p.prototype[apps[i].fuc[r].fnc] = apps[i].fuc[r].fuc
    }
    as[apps[i].id] = p
}

export default as
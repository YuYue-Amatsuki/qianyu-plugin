import * as dataFormat from './dateFormat.js'
import { dowmimg, dowmvideo } from './downimg.js'
import { filemage } from './filemage.js'
import { returnImg } from './puppeteer.js'
import { geturldata } from './request.js'
import { ds, cacelds } from './schedule.js'

export { dataFormat, dowmimg, filemage, returnImg, geturldata, ds, cacelds, dowmvideo }

let page = "推荐动漫".replace(/(今日|今天|每日)推荐动漫/g, "") || 1;
console.log(page);
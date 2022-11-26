import { segment } from 'oicq'
import { filemage, ds } from '../../utils/index.js'
import moment from 'moment'
import lodash from 'lodash'
let file = new filemage()
let Cfg = await file.getyaml("config/baoshi")
let apps = {
    id: 'recordApi',
    name: '语音',
    desc: '语音',
    event: 'message',
    rule: []
}

let bscfg = {
    isChieseTime: false,
    isImg: false,
    isCored: false
}

export default apps
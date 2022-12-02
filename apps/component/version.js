import fs from 'fs'
import lodash from 'lodash'
import { returnImg } from '../../utils/index.js'
const path = process.cwd() + '/plugins/qianyu-plugin/version.md'
let Version;
let loglist = []
let index = 0
let logidx = 0
let apps = {
    id: 'version',
    name: '千羽版本',
    desc: '千羽版本',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^#千羽版本$',
    fnc: 'version',
    fuc: version
})


async function version(e) {
    let vs = getversion()
    this.reply(await returnImg('version', vs))
}

export function getversion() {
    let logs = fs.readFileSync(path, 'utf-8')
    logs = logs.split("\n")
    let versionlist = logs.filter((item) => {
        return item.includes("##")
    })

    lodash.forEach(logs, (item) => {
        if (item.includes("##")) {
            index = versionlist.findIndex(i => i == item)
            Version = logs[0].replace("##", "")
            loglist[index] = {
                loglist: []
            }
            logidx = 0

            loglist[index].Version = item.replace("##", "")
        }
        if (item.includes("-")) {
            if (!loglist[index].loglist[logidx]) {
                loglist[index].loglist[logidx] = {
                    logs: []
                }
            }

            if (item.includes("  -")) {
                loglist[index].loglist[logidx - 1].logs.push(item.replace("-", ""))
                loglist[index].loglist.pop()
            } else {
                loglist[index].loglist[logidx].value = item.replace("-", "")
                logidx++
            }
        }
    })
    return {
        version: Version,
        loglist: loglist
    }
}

export default apps
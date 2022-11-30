import fs from 'fs'
import lodash from 'lodash'
const path = process.cwd() + '/plugins/qianyu-plugin/version.md'
let logs = fs.readFileSync(path, 'utf-8')
logs = logs.split("\n")
let Version;
let loglist = []
let index = 0
let logidx = 0
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
            loglist[index].loglist[logidx - 1].logs.push(item)
        } else {
            loglist[index].loglist[logidx].value = item
            logidx++
        }
    }
})
for (let i of loglist) {
    console.log(i);
    for (let a in i.loglist) {
        console.log(i.loglist[a].logs);
    }
}
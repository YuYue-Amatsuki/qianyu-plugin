import fs from 'fs'
const path = `${process.cwd()}/plugins/qianyu-plugin/apps/V3`
const jslist = fs.readdirSync(path).filter(item => item != 'index.js')
let appslist = []
for (let j of jslist) {
    if (j.includes('.js')) {
        let { default: a } = await import(`./${j}`)
        if (!a) {
            continue;
        }
        if (a instanceof Array) {
            appslist.push(...a)
            continue;
        }
        appslist.push(a)
    } else {
        let dir = fs.readdirSync(path + `/${j}`)
        for (let d of dir) {
            let { default: a } = await import(`./${j}/${d}`)
            if (!a) {
                continue;
            }
            if (a instanceof Array) {
                appslist.push(...a)
                continue;
            }
            appslist.push(a)
        }
    }
}

export default appslist
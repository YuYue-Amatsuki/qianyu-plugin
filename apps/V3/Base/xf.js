import fs from 'fs'
const path = './plugins/qianyu-plugin/resources/html/help/help.jpg'
let apps = {
    id: 'xfqianyu',
    name: '千羽修复',
    desc: '修复千羽产生的一切问题',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^(#|一键|)修复千羽插件',
    desc: '修复',
    fnc: 'xfqianyu',
    fuc: xfqianyu
})


async function xfqianyu(e) {
    if (!e.isMaster) {
        return this.reply("无权限！")
    }
    let cache = [];
    let json_str = JSON.stringify(e, function (key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }
            cache.push(value);
        }
        return value;
    });
    redis.set('qianyu:xf', json_str)
    let file = `${process.cwd()}/plugins/qianyu-plugin/resources/html/plugin/plugin.js`
    let newfile = `${process.cwd()}/plugins/example/xf.js`
    fs.rename(file, newfile, err => {
        if (!err) {
            console.log("移动完成！");
            cache = null;
        } else {
            e.reply("未知错误,无法修复！");
        }
    })
}




export default apps
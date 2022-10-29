import fs from 'fs'
import { promisify } from 'util';
import http from 'http'
import https from 'https'
import path from 'path';
const writeFile = promisify(fs.writeFile);
let cwname;
export async function dowmimg(src, dir, name) {
    cwname = name
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
    if (/\.(jpg|png|git)$/.test(src)) {
        await urlToImg(src, dir);
    }
    else {
        await base64ToImg(src, dir);
    }
}
// url -> img
const urlToImg = promisify((url, dir, callback) => {
    const mod = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    console.log(ext)
    const file = path.join(dir, `${cwname}.jpg`);
    console.log(file)
    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback();
                console.log(file);
            })
    })
})
//base64 -> img
const base64ToImg = async function (base64Str, dir) {
    //data:image/jpeg:base64,/sssss
    const matches = base64Str.match(/^data:(.+?);base64,(.+)/);
    try {
        const ext = matches[1].split('/')[1]
            .replace('jpeg', 'jpg');
        const file = path.join(dir, `${Date.now()}.${ext}`);
        await writeFile(file, matches[2], 'base64');
        console.log(file);

    } catch (error) {
        console.log(error);
        console.log('非法 base64字符串')
    }
}
// 文件管理
//文件操作：增删改查
import fs from 'fs'
import YAML from 'yaml'
let _path = process.cwd()
export class filemage {
    /******* 
     * @description:  
     * @param {*} filename  获取文件名
     * @return {*}
     * @use: 
     */
    constructor(path) {
        let dirpath = path || '/plugins/qianyu-plugin/'
        this.path = `${_path}/${dirpath}`
        if (!fs.existsSync(this.path)) {
            fs.mkdirSync(this.path)
        }
    }
    /******* 
     * @description: 
     * @param {*} name 文件名
     * @return {*}
     * @use: 
     */
    async get_fileinfo(name) {
        let data;
        if (fs.existsSync(this.path + name)) {
            data = JSON.parse(fs.readFileSync(this.path + name, "utf-8"))
        }
        return data
    }
    /******* 
     * @description: 创建/修改文件
     * @param {*} name 文件名
     * @param {*} data 数据
     * @param {*} iscreate 是否是创建 
     * @return {*}
     * @use: 
     */
    async write_file(name, data) {
        let iscreate;
        if (!fs.existsSync(this.path + name)) {
            iscreate = true
        }
        fs.writeFileSync(this.path + name, JSON.stringify(data))
        return iscreate
    }

    async delete_file(name) {
        let msg;
        let isdelete;
        let info = new Promise(resolve => {
            fs.unlink(this.path + name, (err) => {
                if (err) {
                    isdelete = false
                    msg = err
                } else {
                    isdelete = true;
                    msg = "文件删除成功！";
                }
                resolve({ isdelete: isdelete, msg: msg })
            })
        })

        return await info
    }
    async is_exists(path) {
        if (!fs.existsSync(path)) {
            return false
        } else {
            return true
        }

    }
    async getfilelist(path) {
        return fs.readdirSync(this.path + path)
    }
    async getyaml(name) {
        let data = YAML.parse(fs.readFileSync(`${this.path}${name}.yaml`, "utf-8"))
        return data
    }
    async writeyaml(name, data) {
        fs.writeFileSync(`${this.path}${name}.yaml`, YAML.stringify(data))
    }
}  
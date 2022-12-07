import fs from 'node:fs'
import lodash from 'lodash'

export default class PluginsLoader {
    constructor() {
        this.dir = './plugins'
        this.plugins = {
            pluginPackList: [],
            plugins: []
        }
        this.rule = []
    }

    /**
     * 监听事件加载
     * @param isRefresh 是否刷新
     */
    async load() {
        const files = this.getPlugins()
        for (let File of files) {
            if (File.name === "qianyu-plugin") return
            let tmp = await import(File.path)
            if (tmp.apps) tmp = { ...tmp.apps }
            lodash.forEach(tmp, (p, i) => {
                if (!p) return
                if (!p.prototype) {
                    return
                }
                let text = new RegExp("example|genshin|other|system", "g")
                if (text.test(File.name)) return
                let plugin = new p()
                File.rule = plugin.rule
                this.rule.push(File)
            })

        }
    }



    getPlugins() {
        let ignore = ['index.js']
        let files = fs.readdirSync(this.dir, { withFileTypes: true })
        let ret = []
        for (let val of files) {
            let filepath = '../../' + val.name
            let tmp = {
                name: val.name
            }
            let text = new RegExp("example|genshin|other|system|^\\.", "g")
            if (!text.test(val.name)) {
                this.plugins.pluginPackList.push(val.name)
            }

            if (val.isFile()) {

                if (!val.name.endsWith('.js')) continue
                if (ignore.includes(val.name)) continue
                tmp.path = filepath
                ret.push(tmp)
                continue
            }

            if (fs.existsSync(`${this.dir}/${val.name}/index.js`)) {
                tmp.path = filepath + '/index.js'
                ret.push(tmp)
                continue
            }

            let apps = fs.readdirSync(`${this.dir}/${val.name}`, { withFileTypes: true })
            for (let app of apps) {
                if (val.name === 'example') {
                    let name = app.name.replace(".js", "")
                    this.plugins.plugins.push(name)
                }
                if (!app.name.endsWith('.js')) continue
                if (ignore.includes(app.name)) continue
                ret.push({
                    name: `${val.name}/${app.name}`,
                    path: `../../${val.name}/${app.name}`
                })

                continue
            }
        }

        return ret
    }
    getPackList() {
        let text = new RegExp("example|genshin|other|system|^\\.", "g")
        let files = fs.readdirSync(this.dir, { withFileTypes: true })
        for (let val of files) {
            let stat = fs.statSync(this.dir + `/${val.name}`)
            if (!text.test(val.name)) {
                if (stat.isDirectory()) {
                    this.plugins.pluginPackList.push(val.name)
                }

            }
        }
    }
    getJsList() {
        let files = fs.readdirSync(this.dir + '/example', { withFileTypes: true }).filter(file => file.name.endsWith('.js'))
        for (let f of files) {
            this.plugins.plugins.push(f.name)
        }
    }
}





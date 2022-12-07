import PluginsLoader from '../../lib/getallplugin.js'

let apps = {
    id: 'plugins',
    name: '插件管理',
    desc: '插件',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^查看所有插件$',
    fnc: 'pluginlist',
    fuc: pluginlist
})

async function pluginlist(e) {
    let plugins = new PluginsLoader();
    plugins.getJsList()
    plugins.getPackList()
    this.reply(await this.makeGroupMsg('plugins数量', [...plugins.plugins.pluginPackList], `总共有${plugins.plugins.pluginPackList.length}个插件。`))
    this.reply(await this.makeGroupMsg('js数量', [...plugins.plugins.plugins], `总共有${plugins.plugins.plugins.length}个js。`))
}



export default apps
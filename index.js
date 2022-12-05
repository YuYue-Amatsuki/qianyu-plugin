import apps from './apps/index.js'
import PluginsLoader from './lib/getallplugin.js'
logger.info(`--------------------------`);
logger.info(`千羽初号机已启动~`);
logger.info(`--------------------------`);
export { apps }
let plugin = new PluginsLoader();
await plugin.load()
console.log(plugin.plugins);
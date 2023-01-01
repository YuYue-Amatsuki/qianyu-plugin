import { filemage } from '../utils/index.js'
let file = new filemage()
class qianyuSet {
    constructor() {

    }

    get blacklist() {
        return file.getyamlJson('/config/set').blacklist
    }
    get globelist() {
        return file.getyamlJson('/config/set').globelist
    }
}

export default new qianyuSet()
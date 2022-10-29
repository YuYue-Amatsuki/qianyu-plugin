export class Plugin extends plugin {
    constructor(data) {
        super({
            /** 功能名称 */
            name: data.name,
            /** 功能描述 */
            dsc: data.event,
            event: data.event,
            /** 优先级，数字越小等级越高 */
            priority: data.priority,
            rule: data.rule
        })
        this.Permissions = data.Permissions
        this.timeTask = data.timeTask || {}
    }

    //制作穿转发群消息
    async makeGroupMsg() {

        return Bot.makeForwardMsg()
    }

} 
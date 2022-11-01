import { createRequire } from "module";
import lodash from "lodash";
import { Restart } from '../../other/restart.js'

const require = createRequire(import.meta.url);
const { exec, execSync } = require("child_process");

// 是否在更新中
let uping = false;

let apps = {
    id: 'update',
    name: '更新插件',
    desc: '更新插件代码',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^#*千羽(插件)?(强制)?更新',
    desc: '更新',
    fnc: 'update',
    fuc: update
})

let that;

/**
 * rule - 更新千羽插件
 * @returns
 */
async function update() {
    that = this
    if (!that.e.isMaster) return false;

    /** 检查是否正在更新中 */
    if (uping) {
        await that.reply("已有命令更新中..请勿重复操作");
        return;
    }

    /** 检查git安装 */
    if (!(await checkGit())) return;

    const isForce = that.e.msg.includes("强制");

    /** 执行更新 */
    await runUpdate(isForce);

    /** 是否需要重启 */
    if (that.isUp) {
        // await that.reply("更新完毕，请重启云崽后生效")
        setTimeout(() => restart(), 2000)
    }
}

function restart() {
    new Restart(that.e).restart()
}

/**
 * 千羽插件更新函数
 * @param {boolean} isForce 是否为强制更新
 * @returns
 */
async function runUpdate(isForce) {
    let command = "git -C ./plugins/qianyu-plugin/ pull --no-rebase";
    if (isForce) {
        command = `git -C ./plugins/qianyu-plugin/ checkout . && ${command}`;
        that.e.reply("正在执行强制更新操作，请稍等");
    } else {
        that.e.reply("正在执行更新操作，请稍等");
    }
    /** 获取上次提交的commitId，用于获取日志时判断新增的更新日志 */
    that.oldCommitId = await getcommitId("qianyu-plugin");
    uping = true;
    let ret = await exectSync(command);
    uping = false;

    if (ret.error) {
        logger.mark(`${that.e.logFnc} 更新失败：千羽插件`);
        gitErr(ret.error, ret.stdout);
        return false;
    }

    /** 获取插件提交的最新时间 */
    let time = await getTime("qianyu-plugin");

    if (/(Already up[ -]to[ -]date|已经是最新的)/.test(ret.stdout)) {
        await that.reply(`千羽插件已经是最新版本\n最后更新时间：${time}`);
    } else {
        await that.reply(`千羽插件\n最后更新时间：${time}`);
        that.isUp = true;
        /** 获取千羽组件的更新日志 */
        let log = await getLog("qianyu-plugin");
        await that.reply(log);
    }

    logger.mark(`${that.e.logFnc} 最后更新时间：${time}`);

    return true;
}

/**
 * 获取千羽插件的更新日志
 * @param {string} plugin 插件名称
 * @returns
 */
async function getLog(plugin = "") {
    let cm = `cd ./plugins/${plugin}/ && git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%m-%d %H:%M"`;

    let logAll;
    try {
        logAll = await execSync(cm, { encoding: "utf-8" });
    } catch (error) {
        logger.error(error.toString());
        that.reply(error.toString());
    }

    if (!logAll) return false;

    logAll = logAll.split("\n");

    let log = [];
    for (let str of logAll) {
        str = str.split("||");
        if (str[0] == that.oldCommitId) break;
        if (str[1].includes("Merge branch")) continue;
        log.push(str[1]);
    }
    let line = log.length;
    log = log.join("\n\n");

    if (log.length <= 0) return "";

    let end = "";
    end =
        "更多详细信息，请前往gitee查看\nhttps://gitee.com/think-first-sxs/qianyu-plugin";

    log = await makeForwardMsg(`千羽插件更新日志，共${line}条`, log, end);

    return log;
}

/**
 * 获取上次提交的commitId
 * @param {string} plugin 插件名称
 * @returns
 */
async function getcommitId(plugin = "") {
    let cm = `git -C ./plugins/${plugin}/ rev-parse --short HEAD`;

    let commitId = await execSync(cm, { encoding: "utf-8" });
    commitId = lodash.trim(commitId);

    return commitId;
}

/**
 * 获取本次更新插件的最后一次提交时间
 * @param {string} plugin 插件名称
 * @returns
 */
async function getTime(plugin = "") {
    let cm = `cd ./plugins/${plugin}/ && git log -1 --oneline --pretty=format:"%cd" --date=format:"%m-%d %H:%M"`;

    let time = "";
    try {
        time = await execSync(cm, { encoding: "utf-8" });
        time = lodash.trim(time);
    } catch (error) {
        logger.error(error.toString());
        time = "获取时间失败";
    }
    return time;
}

/**
 * 制作转发消息
 * @param {string} title 标题 - 首条消息
 * @param {string} msg 日志信息
 * @param {string} end 最后一条信息
 * @returns
 */
async function makeForwardMsg(title, msg, end) {
    let nickname = Bot.nickname;
    if (that.e.isGroup) {
        let info = await Bot.getGroupMemberInfo(that.e.group_id, Bot.uin);
        nickname = info.card || info.nickname;
    }
    let userInfo = {
        user_id: Bot.uin,
        nickname,
    };

    let forwardMsg = [
        {
            ...userInfo,
            message: title,
        },
        {
            ...userInfo,
            message: msg,
        },
    ];

    if (end) {
        forwardMsg.push({
            ...userInfo,
            message: end,
        });
    }

    /** 制作转发内容 */
    if (that.e.isGroup) {
        forwardMsg = await that.e.group.makeForwardMsg(forwardMsg);
    } else {
        forwardMsg = await that.e.friend.makeForwardMsg(forwardMsg);
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
        .replace(/\n/g, "")
        .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
        .replace(/___+/, `<title color="#777777" size="26">${title}</title>`);

    return forwardMsg;
}

/**
 * 处理更新失败的相关函数
 * @param {string} err
 * @param {string} stdout
 * @returns
 */
async function gitErr(err, stdout) {
    let msg = "更新失败！";
    let errMsg = err.toString();
    stdout = stdout.toString();

    if (errMsg.includes("Timed out")) {
        let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, "");
        await that.reply(msg + `\n连接超时：${remote}`);
        return;
    }

    if (/Failed to connect|unable to access/g.test(errMsg)) {
        let remote = errMsg.match(/'(.+?)'/g)[0].replace(/'/g, "");
        await that.reply(msg + `\n连接失败：${remote}`);
        return;
    }

    if (errMsg.includes("be overwritten by merge")) {
        await that.reply(
            msg +
            `存在冲突：\n${errMsg}\n` +
            "请解决冲突后再更新，或者执行#强制更新，放弃本地修改"
        );
        return;
    }

    if (stdout.includes("CONFLICT")) {
        await that.reply([
            msg + "存在冲突\n",
            errMsg,
            stdout,
            "\n请解决冲突后再更新，或者执行#强制更新，放弃本地修改",
        ]);
        return;
    }

    await that.reply([errMsg, stdout]);
}

/**
 * 异步执行git相关命令
 * @param {string} cmd git命令
 * @returns
 */
async function exectSync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { windowsHide: true }, (error, stdout, stderr) => {
            console.log(error)
            resolve({ error, stdout, stderr });
        });
    });
}

/**
 * 检查git是否安装
 * @returns
 */
async function checkGit() {
    let ret = await execSync("git --version", { encoding: "utf-8" });
    if (!ret || !ret.includes("git version")) {
        await that.reply("请先安装git");
        return false;
    }
    return true;
}


export default apps
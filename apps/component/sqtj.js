import moment from "moment";
import { returnImg, ds } from '../../utils/index.js'
import lodash from "lodash"
let apps = {
    id: 'sqtj',
    name: '水群排名',
    desc: '水群排名',
    event: 'message',
    rule: []
}

apps.rule.push({
    reg: '^水群统计$',
    fnc: 'sqts',
    fuc: sqts
})

let ing = {};

let ranklistData = {}

async function sqts(e) {
    if (ing[e.group_id]) {
        e.reply("还在生成中，请稍后！");
        return true;
    }
    ing[e.group_id] = 1;
    e.reply("正在分析今天的聊天记录，稍后生成榜单！");
    let CharHistory = await e.group.getChatHistory(0, 1);
    let seq = CharHistory[0].seq;
    ranklistData[e.group_id] = ranklistData[e.group_id] ? ranklistData[e.group_id] : {
        lastseq: 0,
        acount: 0
    }
    let CharList = ranklistData[e.group_id].list ? ranklistData[e.group_id].list : {};
    let allcount = 0;
    let isover;
    for (let i = seq; i > 0; i = i - 20) {
        let CharTemp = await e.group.getChatHistory(i, 20);
        if (CharTemp.length == 0) {
            break;
        }
        for (const key in CharTemp) {
            if (CharTemp[key].length == 0) {
                continue;
            }
            if (CharTemp[key].user_id == e.self_id) {
                continue;
            }
            if (ranklistData[e.group_id].lastseq != 0 && CharTemp[key].seq === ranklistData[e.group_id].lastseq) {
                isover = true
                break;
            }
            if (CharTemp[key].time < moment().hour(0).minute(0).second(0).unix()) {
                isover = true
                break;
            }
            allcount++;
            if (CharList[CharTemp[key].user_id]) {
                CharList[CharTemp[key].user_id].times += 1;
                CharList[CharTemp[key].user_id].uname = CharTemp[key].sender.card ? CharTemp[key].sender.card : CharTemp[key].sender.nickname;
                if (CharTemp[key].raw_message == "[动画表情]") {
                    CharList[CharTemp[key].user_id].facestime += 1
                }
            } else {
                CharList[CharTemp[key].user_id] = {
                    times: 1,
                    user_id: CharTemp[key].user_id,
                    facestime: 0,
                    uname: CharTemp[key].sender.card ? CharTemp[key].sender.card : CharTemp[key].sender.nickname
                };

            }
        }
        if (isover) {
            break;
        }
    }
    ranklistData[e.group_id].list = CharList
    ranklistData[e.group_id].lastseq = seq
    ranklistData[e.group_id].acount += allcount
    let groupmemberlist = await e.group.getMemberMap()
    let memberlist = []
    ranklistData[e.group_id].acount += allcount
    for (let m of groupmemberlist) {
        memberlist.push(m[1])
    }
    memberlist = lodash.orderBy(memberlist, 'last_sent_time', 'asc')
    memberlist[0].lastmsgtime = moment.unix(memberlist[0].last_sent_time).fromNow().replace(/\s*/g, "")
    let CharArray = [];
    for (const key in CharList) {
        CharArray.push(CharList[key]);
    }
    CharArray.sort((a, b) => {
        return b.times - a.times
    })
    let bclist = lodash.orderBy(CharArray, 'facestime', 'desc')
    let l = Math.ceil(CharArray.length / 10);
    CharArray = CharArray.slice(0, CharArray.length > 10 ? 10 : CharArray.length);
    for (let i in CharArray) {
        CharArray[i].Percentage = (CharArray[i].times / ranklistData[e.group_id].acount * 100).toFixed(2)
    }
    let img = await returnImg('list', {
        charlist: CharArray, dsw: CharArray[0], bqd: bclist[0], shwz: memberlist[0]
    })
    this.reply(img)
    ing[e.group_id] = 0;
    return true; //返回true 阻挡消息不再往下
}
await ds("bs", `0 0 0 * * *`, async () => {
    ranklistData = {}
})

export default apps
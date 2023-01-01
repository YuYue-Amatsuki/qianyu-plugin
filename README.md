## 千羽插件 2

### 1.安装

云崽根目录下执行安装命令

```javascript
git clone --depth=1 https://gitee.com/think-first-sxs/qianyu-plugin.git ./plugins/qianyu-plugin/
```

### 2.功能

![输入图片说明](resources/html/help/help.jpg)

1. #### v2 云崽插件用于 v3 云崽（仅 js 插件）

   ##### 使用说明

   将 v2 的 js 插件放入 qianyu-plugin/apps/V2/目录下即可

   ##### 注意事项

   - 此功能会自动跳过引入错误的插件
   - 引入插件是使用者个人行为，如有侵权作者不负任何责任
   - 作者不会在此目录下放入任何插件
   - 作者不负责引入插件中的内部错误，如有报错请放弃此插件
   - 请勿删除目录下的 index.js 文件，改文件为引入插件文件，删除会导致引入错误

2. #### 群事件

   - 进退群回复，支持自定义回复
     - #千羽群设置进群回复（支持图片文字）
     - #千羽群设置退群回复（支持图片文字）
     - 私聊设置则为全局群配置，群里为当前群配置，群独立配置
   - 群撤回回复
     - 需要自己手动添加群号，后续增加指令
   - 有趣禁用提醒
     - 口球你喜欢吗？
   - 回复通过群申请
     - 由于和老版插件功能重复，已关闭
   - 群戳一戳
     - #千羽戳一戳开启/关闭
     - 戳一戳配置文件在 qianyu-plugin/config/chuo.yaml,详细配置请看配置文件

3. #### 其他功能

   - 早晚安功能

### 3.设置

#### 禁用功能（仅千羽插件功能）

在 qianyu-plugin/config/目录下的 set.yaml 文件配置

```yaml
blacklist: #黑名单（禁用功能）
  - ai #比如禁用ai
```

功能的具体名称请根据每个功能文件的 id 为准，比如 ai:

```javascript
let apps = {
  id: "ai", //以这个id为准
  name: "人工智障ai",
  desc: "人工智障ai",
  event: "message",
  priority: 100000,
  rule: [],
};
```

#### 全局功能设置（仅千羽插件功能）

在 qianyu-plugin/config/目录下的 set.yaml 文件配置

```yaml
globelist: #全局功能列表（在此添加的功能不会受到群前缀的影响，会正常的响应）
  - greeting #全局响应早晚安，不受群前缀的影响
```

设置全局的功能，将不受云崽设置的群前缀影响，即使开了前缀，配置了全局的功能也能无前缀响应

### 4.交流与反馈

QQ 群：644134535

### 5.支持作者

爱发电：[https://afdian.net/a/qianyu-plugin](https://gitee.com/link?target=https%3A%2F%2Fafdian.net%2Fa%2Fqianyu-plugin)

打赏名单

|  昵称  | 打赏金额 |
| :----: | :------: |
| 黑甘雨 |    60    |
|  倾听  |    10    |
|  久遇  |    10    |
|  黑兔  |    5     |
|  噎羊  |    5     |

#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

#### 免责声明

1. 功能仅限内部交流与小范围使用，请勿将 Yunzai-Bot 及 qianyu-plugin 用于任何以盈利为目的的场景.
2. 图片与其他素材均来自于网络，仅供交流学习使用，如有侵权请联系，会立即删除.

#### 访问数量：

[![访问量](https://profile-counter.glitch.me/qianyu-plugin/count.svg)](https://gitee.com/think-first-sxs/qianyu-plugin/)

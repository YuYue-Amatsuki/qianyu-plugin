/**
 * @Author: uixmsi
 * @Date: 2022-10-18 21:37:09
 * @LastEditTime: 2022-10-23 22:14:27
 * @LastEditors: uixmsi
 * @Description:
 * @FilePath: \Yunzai-Bot\plugins\qianyu-plugin\lib\test.js
 * @版权声明
 **/
// let list = [23, 55, 33, 5, 6, 18, 100, 3]
// for (let i = 0; i < list.length - 1; i++) {
//     for (let j = 0; j < list.length - 1 - i; j++) {
//         if (list[j] > list[j + 1]) {
//             let temp = list[j + 1]
//             list[j + 1] = list[j]
//             list[j] = temp
//         }
//     }
// }
import { segment } from "oicq";
let facelist = []
for (let i = 0; i < 325; i++) {
    facelist.push(`表情id:${i}${segment.face(i)}`)
}
console.log(facelist)
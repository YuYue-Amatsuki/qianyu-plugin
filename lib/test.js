/**
 * @Author: uixmsi
 * @Date: 2022-10-18 21:37:09
 * @LastEditTime: 2022-10-22 23:43:19
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
let m = '派蒙'
let msg = ['小小', '派蒙']
let gz = msg.join("|")
let reg = new RegExp(`${gz}`)
console.log(reg.test(m))

/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-03-22 14:48:02
 */

export const getStrFullLength = (str = '') =>
    str.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0)
        if (charCode >= 0 && charCode <= 128) {
            return pre + 1
        }
        return pre + 2
    }, 0)

export const cutStrByFullLength = (str = '', maxLength = 0) => {
    let showLength = 0
    return str.split('').reduce((pre, cur) => {
        const charCode = cur.charCodeAt(0)
        if (charCode >= 0 && charCode <= 128) {
            showLength += 1
        } else {
            showLength += 2
        }
        if (showLength <= maxLength) {
            return pre + cur
        }
        return pre
    }, '')
}

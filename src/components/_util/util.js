/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-02-28 11:06:24
 */

/**
 * 清理空值，对象
 * @param children
 * @returns {*[]}
 */
export function filterEmpty (children = []) {
    return children.filter(c => c.tag || (c.text && c.text.trim() !== ''))
}

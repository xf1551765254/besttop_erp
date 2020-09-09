/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-02-28 09:16:52
 */
export function actionToObject (json) {
    try {
        return JSON.parse(json)
    } catch (e) {
        console.log('err', e.message)
    }
    return []
}

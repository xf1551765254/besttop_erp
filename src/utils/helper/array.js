/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-12 17:39:30
 * @LastEditTime: 2019-04-21 22:39:08
 */
function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    const arrDo = {}
    // 对象数组转对象，入参数组，key，value，如arr2obj([{a:'x',b:1},{a:'y',b:2}],'a','b')返回{x:1,y:2}
    arrDo.arr2obj = (arr = [], key, val) => {
        return arr.reduce((res, cur) => ({ ...res, [cur[key]]: cur[val] }), {})
    }
    // 对象转数组，入参对象，key的key，value的key,如obj2arr({x:1,y:2},a,b)返回[{a:'x',b:1},{a:'y',b:2}]
    arrDo.obj2arr = (obj = {}, key, val) => {
        return Object.keys(obj).reduce((accu, cur) => [...accu, { [key]: cur, [val]: obj[cur] }], [])
    }

    !Vue.prototype.$arrDo && Object.defineProperties(Vue.prototype, {
        $arrDo: {
            get () {
                return arrDo
            }
        }
    })
}

export default plugin

/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-12 17:39:30
 * @LastEditTime: 2019-04-21 22:28:45
 */
import { Decimal } from 'decimal.js'
function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    const math = {}
    // x+y
    math.add = (x, y, fixed = 2) => {
        return new Decimal(x).add(new Decimal(y)).toNumber()
            .toFixed(fixed)
    }
    // x-y
    math.sub = (x, y, fixed = 2) => {
        return new Decimal(x).sub(new Decimal(y)).toNumber()
            .toFixed(fixed)
    }
    // x/y
    math.div = (x, y, fixed = 2) => {
        return new Decimal(x).div(new Decimal(y)).toNumber()
            .toFixed(fixed)
    }
    // x*y
    math.mul = (x, y, fixed = 2) => {
        return new Decimal(x).mul(new Decimal(y)).toNumber()
            .toFixed(fixed)
    }
    // |n|
    math.abs = (x, fixed = 2) => {
        return new Decimal(x).abs().toNumber().toFixed(fixed)
    }
    // 千分位
    math.price = (n, fixed = 2) => {
        return Number(n).toFixed(fixed).toString().replace(/(\d)(?=(?:\d{3})+(?:\.))/g, '$1,')
    }
    // 求平均值, 入参number数组
    math.avrg = (arr = [], fixed = 2) => {
        return arr.reduce((pre, cur, i, a) => (i < a.length - 1 ? pre + cur : (pre + cur) / a.length)).toFixed(fixed)
    }
    // 求最大公约数, 入参number数组
    math.maxDenom = (arr = []) => {
        return arr.reduce(maxDenom)
    }
    // 求最小公倍数, 入参number数组
    math.minMulti = (arr = []) => {
        return arr.reduce(minMulti)
    }

    !Vue.prototype.$math && Object.defineProperties(Vue.prototype, {
        $math: {
            get () {
                return math
            }
        }
    })
}
// 欧几里得算法
function maxDenom (a, b) {
    return b ? maxDenom(b, a % b) : a
}
function minMulti (a, b) {
    return a * b / maxDenom(a, b)
}
export default plugin

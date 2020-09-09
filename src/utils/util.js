/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-01 13:53:01
 */
import moment from 'moment'

export function timeToText (time) {
    if (moment(time).isAfter(moment().set({ hour: 0, minute: 0, second: 0 }))) return '今天'
    if (moment(time).isAfter(moment().subtract({ days: 1 }).set({ hour: 0, minute: 0, second: 0 }))) return '昨天'
    if (moment(time).isAfter(moment().subtract({ days: 3 }).set({ hour: 0, minute: 0, second: 0 }))) return '三天前'
    return moment(time).format('YYYY-MM-DD hh:mm:ss')
}
export function timeFix () {
    const time = new Date()
    const hour = time.getHours()
    return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome () {
    const arr = [
        '欢迎登录贝图ERP！',
        '感谢使用贝图ERP！',
        '贝图欢迎您！',
        '感谢您的使用！'
    ]
    const index = Math.floor((Math.random() * arr.length))
    return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
    const event = document.createEvent('HTMLEvents')
    event.initEvent('resize', true, true)
    event.eventType = 'message'
    window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
    if (id === '') {
        return
    }
    setTimeout(() => {
        document.body.removeChild(document.getElementById(id))
    }, timeout)
}
// 获取url参数
export function pageUrlGet (name) {
    var reg = new RegExp('(^|&)' + name.toLocaleLowerCase() + '=([^&]*)(&|$)')
    var r = window.location.search.substr(1).toLocaleLowerCase().match(reg)
    if (r != null) return decodeURI(r[2]); return null
}
// 银行卡、信用卡卡号展示格式化
export function cardFormatShow (cardStr) {
    if (cardStr !== '') {
        return cardStr.trim().replace(/\D/g, '').replace(/....(?!$)/g, '$& ')
    } else {
        return ''
    }
}
// 银行卡、信用卡卡号去格式化
export function cardFormatRemove (cardStr) {
    if (cardStr !== '') {
        return cardStr.trim().replace(/[ ]/g, '')
    } else {
        return ''
    }
}
// 金额转大写
export function lowToUp (n) {
    const fraction = ['角', '分']
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟'] ]
    const head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    let s = ''
    for (let i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (let i = 0; i < unit[0].length && n > 0; i++) {
        let p = ''
        for (let j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

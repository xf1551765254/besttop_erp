/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-12 17:39:30
 * @LastEditTime: 2019-04-24 15:40:28
 */
import Vue from 'vue'
import moment from 'moment'
import store from '../../store'
import axios from 'axios'
import { URL, PATH } from '@/config/api.config'
import { ACCESS_TOKEN } from '@/store/mutation-types'

function randomNum (n) {
    var res = ''
    for (var i = 0; i < n; i++) {
        res += Math.floor(Math.random() * 10)
    }
    return res
}
function putLogs (info, type = '[INFO]') {
    const {
        appName,
        userAgent,
        onLine
    } = navigator
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const header = `${type}${time} - ${store.getters.code} - ${store.getters.pageName}`
    const appinfo = `onLine:${onLine} - ${appName} - ${userAgent}`
    const log = `${header} - ${appinfo} - ${info}`
    const id = `${store.getters.code}${moment(time).format('x')}${randomNum(4)}`
    try {
        Vue.prototype.$idb.transaction(['logs'], 'readwrite').objectStore('logs').put({ id, log, time })
    } catch (err) {}
}
function sendLogs () {
    const logs = []
    const objectStore = Vue.prototype.$idb.transaction('logs').objectStore('logs')
    objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result
        if (cursor) {
            logs.push(cursor.value)
            cursor.continue()
        } else {
            Vue.prototype.$logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}-->上报日志`, true)
            if (logs.length > 0) {
                // 上报日志
                axios({
                    baseURL: URL,
                    url: PATH.logApi,
                    method: 'post',
                    headers: {
                        Authorization: Vue.ls.get(ACCESS_TOKEN)
                        // token: ''
                    },
                    data: { list: logs }
                }).then(res => {
                    if (res.data.flag === 1) {
                        Vue.prototype.$logger.info(`${moment().format('YYYY-MM-DD HH:mm:ss')}-->共上报${logs.length}条`)
                        logs.map(o => {
                            Vue.prototype.$idb.transaction('logs', 'readwrite').objectStore('logs').delete(o.id)
                        })
                    } else {
                        Vue.prototype.$logger.info('上报失败！')
                    }
                }).catch(() => { Vue.prototype.$logger.info(`${logs.length}条上报失败！`) })
            }
        }
    }
    setTimeout(() => {
        sendLogs()
    }, 600000)
}

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    const logger = {}

    logger.info = (info, type) => {
        info = JSON.stringify(info)
        putLogs(info)
        if (process.env.NODE_ENV === 'production') return
        if (type) {
            console.log(`%c ${info}`, 'background:#000;color:#fff')
        } else {
            console.log(`%c ${info}`, 'background:#8dc63f;color:#000')
        }
    }
    logger.post = (info, type) => {
        info = JSON.stringify(info)
        putLogs(info)
        if (process.env.NODE_ENV === 'production') return
        if (type) {
            console.log(`%c ${info}`, 'background:#6739b6;color:#fff')
        } else {
            console.log(`%c ${info}`, 'background:#00b545;color:#000')
        }
    }
    logger.warning = (warning) => {
        warning = JSON.stringify(warning)
        console.log(`%c ${warning}`, 'background:#9c26b0;color:#fff')
        putLogs(warning, '[WARNING]')
    }
    logger.error = (error) => {
        error = JSON.stringify(error)
        console.log(`%c ${error}`, 'background:#e54d42;color:#fff')
        putLogs(error, '[ERROR]')
    }
    logger.sendLogs = sendLogs

    !Vue.prototype.$logger && Object.defineProperties(Vue.prototype, {
        $logger: {
            get () {
                return logger
            }
        }
    })
}

export default plugin

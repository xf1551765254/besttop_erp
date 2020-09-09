/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2019-01-24 15:06:56
 * @LastEditors: Oak
 * @LastEditTime: 2019-04-22 09:40:12
 */
'use strict'
import notification from 'ant-design-vue/es/notification'
export default () => {
    return new Promise((resolve, reject) => {
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
        if (!indexedDB) {
            notification.error({
                message: '错误',
                description: '您的浏览器不支持indexedDB数据库，建议下载并使用Chrome！'
            })
            resolve(null)
        }

        const request = indexedDB.open('erp_web', 1)

        let db

        request.onerror = function (e) {
            notification.error({
                message: '错误',
                description: 'indexedDB数据库连接错误，请您清理缓存后刷新页面！'
            })
            resolve(null)
        }

        request.onsuccess = function (e) {
            db = e.target.result
            resolve(db)
        }

        request.onupgradeneeded = function (e) {
            db = e.target.result
            db.createObjectStore('columns', { keyPath: 'id' })
            db.createObjectStore('app', { keyPath: 'key' })
            db.createObjectStore('api', { keyPath: 'path' })
            db.createObjectStore('logs', { keyPath: 'id' })
            resolve(db)
        }
    })
}

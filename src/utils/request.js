/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-17 18:12:36
 */
'use strict'
import Vue from 'vue'
import { URL, PATH, CONFIG } from '@/config/api.config'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN, LAST_SYSTEM_NAME } from '@/store/mutation-types'
import { VueAxios } from './axios'
import is from 'is_js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
 * POST封装
 * @param {Object} pams 参数
 * 参数内容：
 * {
 *      path:       必须传，api名称，在app/web/framework/network/config.api.js配置
 *      body:       默认为{},请求body,
 *      headers:    默认已经封装‘Authorization’；表格请求需要传tableCode
 *      config：{
 *          params:     默认为null，需要拼接在url上的参数
 *          method:     默认POST
 *          ……          其他可覆盖项，参考app/web/framework/network/config.api.js
 *      }
 * }
 */
const service = (pams) => {
    console.log(pams)

    return new Promise((resolve, reject) => {
        let loginfo = 'NO BODY'
        if (is.object(pams.body) && is.not.empty(pams.body)) {
            loginfo = JSON.stringify(pams.body)
        }
        Vue.prototype.$logger.post(`[发起请求]->[${pams.path}]->[${loginfo}]`, true)
        // 检查参数是否合法
        checkPams(pams).then(checkPamsRes => {
            if (!checkPamsRes) { resolve({ flag: 0 }) }
            // 检查权限并获取功能接口URL
            getApi(pams.path).then(urlPath => {
                if (!urlPath) {
                    Vue.prototype.$confirm({
                        title: '警告',
                        content: `权限限制${pams.path}，刷新权限可能会造成页面未保存信息丢失，是否继续？`,
                        onOk () {
                            setTimeout(() => {
                                window.location.reload()
                            }, 1000)
                        },
                        onCancel () {
                            Vue.prototype.$message.info('暂不登录')
                        }
                    })
                    resolve({ flag: 0 })
                } else {
                    runPost(urlPath, pams).then(res => {
                        resolve(res)
                    })
                }
            })
        })
    })
}

/**
 * @name: 检查参数是否合法
 * @msg:
 * @param {type}
 * @return:
 */
async function checkPams (pams) {
    return new Promise((resolve, reject) => {
        if (is.not.json(pams)) {
            notification.error({ message: '参数错误', description: '参数必须是JSON格式' })
            resolve(false)
        }
        if (!('path' in pams)) {
            notification.error({ message: '参数错误', description: '缺少PATH参数' })
            resolve(false)
        }
        if (('body' in pams) && !is.json(pams.body)) {
            notification.error({ message: '参数错误', description: 'BODY必须是JSON格式' })
            resolve(false)
        }
        if (('headers' in pams) && !is.json(pams.headers)) {
            notification.error({ message: '参数错误', description: 'HEADERS必须是JSON格式' })
            resolve(false)
        }
        if (('config' in pams) && !is.json(pams.config)) {
            notification.error({ message: '参数错误', description: 'CONFIG必须是JSON格式' })
            resolve(false)
        }
        resolve(true)
    })
}

/**
 * @name: 根据权限，获取接口URL
 * @msg:
 * @param {type}
 * @return:
 */
async function getApi (path) {
    return new Promise((resolve, reject) => {
        if (path in PATH) {
            resolve(PATH[path])
        } else {
            const GetRes = Vue.prototype.$idb.transaction(['api']).objectStore('api').get(path)
            GetRes.onsuccess = () => {
                if (is.not.undefined(GetRes.result)) {
                    resolve(GetRes.result.url)
                } else {
                    resolve(false)
                }
            }
            GetRes.onerror = () => {
                resolve(false)
            }
        }
    })
}

/**
 * @name: 发起请求
 * @msg:
 * @param {type}
 * @return:
 */
async function runPost (path, pams) {
    const headers = Object.assign({
        'X-Requested-With': 'XMLHttpRequest',
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        // token: Vue.ls.get(ACCESS_TOKEN),
        'bt-custom-common': `system-type:erp,current-system:btspc-${Vue.ls.get(LAST_SYSTEM_NAME)}`,
        'module-name': document.location.pathname.split('/').pop()
    }, pams.headers || {})

    // 组装参数
    const c = { ...CONFIG }
    const config = { ...c, ...pams.config || {} }
    const cacheUrl = Vue.ls.get('SERVER_API') // 临时API
    config.baseURL = cacheUrl || pams.URL || URL
    config.url = path
    config.headers = headers

    if (is.not.undefined(pams.formData)) {
        config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
        config.data = pams.formData
    } else {
        const body = {}
        for (const k in pams.body) {
            if (is.undefined(pams.body[k])) {
                body[k] = ''
            } else if (is.not.null(pams.body[k])) {
                body[k] = pams.body[k]
            }
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        // if (pams.isOld) {
        //     config.headers = { 'Content-Type': 'application/json;charset=UTF-8' }
        // }
        config.data = JSON.stringify(body)
    }

    let response
    let res = { flag: 0 }
    NProgress.start()
    try {
        response = await axios(config)
        if (config.isSteamData) {
            NProgress.done()
            return response
        }
        res = await checkResponse(response.data, path)
    } catch (err) {
        Vue.prototype.$logger.error(err)
        let message = err.message
        if (err && is.not.undefined(err.response) && is.not.undefined(err.response.status)) {
            switch (err.response.status) {
            case 400:
                message = '400：处理失败'
                break
            case 401:
                message = '401：未授权，请重新登录'
                break
            case 403:
                message = '403：拒绝访问'
                break
            case 404:
                message = '404：请求错误,未找到该资源'
                break
            case 405:
                message = '405：请求方法未允许'
                break
            case 408:
                message = '408：请求超时'
                break
            case 500:
                message = '500：服务器端出错'
                break
            case 501:
                message = '501：网络未实现'
                break
            case 502:
                message = '502：网络错误'
                break
            case 503:
                message = '503：服务不可用'
                break
            case 504:
                message = '504：网络超时'
                break
            case 505:
                message = '505：HTTP版本不支持该请求'
                break
            default:
                message = `连接错误${err.response.status}`
            }
        } else {
            message = '连接到服务器失败'
        }
        notification.error({ message: '请求错误', description: message })
        if (pams.path === 'getRole') {
            store.dispatch('Logout').then(() => {
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            })
        }
    }
    NProgress.done()
    return res
}

/**
 * @name: 分类处理请求回调
 * @msg:
 * @param {type}
 * @return:
 */
async function checkResponse ({ flag, message, data, other }, path) {
    if (message && (message.indexOf('Error') > 0 || message.length > 128)) {
        Vue.prototype.$logger.error(`[请求返回]->[${path}]->[message：${message}]`)
        message = '服务器堆栈错误！'
    } else {
        Vue.prototype.$logger.post(`[请求返回]->[${path}]->[message：${message}]`)
    }
    return new Promise((resolve, reject) => {
        switch (flag) {
        case 1:
            if (is.string(message) && is.not.inArray(message, ['成功', '操作成功', '查询成功'])) {
                Vue.prototype.$message.success(message)
            }
            resolve({ flag: 1, data: data, other: other })
            break
        case 2:
            Vue.prototype.$message.error(message)
            resolve({ flag: 0 })
            break
        case 3:
            notification.warning({
                message: '警告',
                description: message
            })
            resolve({ flag: 0 })
            break
        case 4:
            Vue.prototype.$error({
                title: '错误',
                content: message
            })
            resolve({ flag: 0 })
            break
        case 5:
            resolve({ flag: 0 })
            break
        case 6:// 6 = 刷新表格
            resolve({ flag: 6, message })
            break
        case 7:
            Vue.prototype.$confirm({
                title: '警告',
                content: `权限限制，是刷新权限？`,
                onOk () {
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            })
            resolve({ flag: 0 })
            break
        case 8:
            resolve({ flag: 0 })
            break
        case 9:
            Vue.prototype.$confirm({
                title: '登录态已失效，是否重新登录?',
                content: '点击确定将前往登录页。',
                onOk () {
                    store.dispatch('Logout').then(() => {
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                    })
                    resolve({ flag: 0 })
                },
                onCancel () {
                    Vue.prototype.$message.info('暂不登录')
                    resolve({ flag: 0 })
                }
            })
            break
        default:
            resolve({ flag: 0 })
            break
        }
    })
}
const installer = {
    vm: {},
    install (Vue, router = {}) {
        Vue.use(VueAxios, router, service)
    }
}

export {
    installer as VueAxios,
    service as axios
}

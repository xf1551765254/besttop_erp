/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-31 14:51:52
 */
import Vue from 'vue'
import { login, getRole } from '@/api/login'
import {
    ACCESS_TOKEN,
    LAST_PATH_NAME,
    USER_INFO,
    USER_CODE,
    USER_NAME,
    USER_AVATAR,
    LAST_SYSTEM_NAME,
    STORE_INFO } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
    state: {
        token: '',
        code: '',
        name: '',
        welcome: '',
        avatar: '',
        system: [],
        pageRoles: [],
        actions: [],
        info: {},
        storeInfo: {},
        lastSystemName: '',
        taxRate: [],
        messageCount: 0
    },

    mutations: {
        SET_MESSAGE_COUNT: (state, messageCount) => {
            state.messageCount = messageCount
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_CODE: (state, code) => {
            state.code = code
            Vue.ls.set(USER_CODE, code)
        },
        SET_NAME: (state, { name, welcome }) => {
            state.name = name
            state.welcome = welcome
            Vue.ls.set(USER_NAME, name)
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
            Vue.ls.set(USER_AVATAR, avatar)
        },
        SET_SYSTEM_ROLES: (state, system) => {
            state.system = system
        },
        SET_PAGE_ROLES: (state, pageRoles) => {
            state.pageRoles = pageRoles
        },
        SET_ACTIONS: (state, actions) => {
            state.actions = actions
        },
        SET_INFO: (state, info) => {
            state.info = info
            Vue.ls.set(USER_INFO, info)
        },
        SET_STORE: (state, storeInfo) => {
            state.storeInfo = storeInfo
            Vue.ls.set(STORE_INFO, storeInfo)
        },
        SET_LAST_SYSTEM_NAME: (state, lastSystemName) => {
            state.lastSystemName = lastSystemName
            Vue.ls.set(LAST_SYSTEM_NAME, lastSystemName)
        },
        SET_TAXRATE: (state, taxRate) => {
            state.taxRate = taxRate
        },
        SET_TAXRATESALE: (state, taxRateSale) => {
            state.taxRateSale = taxRateSale
        }
    },

    actions: {
        setStore ({ commit }, storeInfo) {
            commit('SET_STORE', storeInfo)
        },
        setLastSystemName ({ commit }, name) {
            commit('SET_LAST_SYSTEM_NAME', name)
        },
        // 登录
        Login ({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    if (response.flag === 1) {
                        const result = response.data
                        Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                        commit('SET_TOKEN', result.token)
                        commit('SET_CODE', result.userInfo.code)
                        commit('SET_NAME', { name: result.userInfo.name, welcome: welcome() })
                        commit('SET_AVATAR', result.userInfo.avatar || 'https://image.besttop.top/pc/avatar.png')
                        commit('SET_INFO', result.userInfo)
                        resolve(response)
                    } else {
                        reject(new Error())
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户权限
        GetRole ({ commit }) {
            return new Promise((resolve, reject) => {
                Vue.prototype.$logger.info('初始化用户权限中...', true)
                getRole().then(response => {
                    if (response.flag === 1) {
                        const result = response.data
                        // 初始化API接口
                        let i = 1
                        const timer = setInterval(() => {
                            if (Vue.prototype.$idb) {
                                const apiDB = Vue.prototype.$idb.transaction(['api'], 'readwrite').objectStore('api')
                                result.api.forEach(api => {
                                    apiDB.put(api)
                                })
                                clearInterval(timer)
                            }
                            if (i > 100) {
                                Vue.prototype.$message.error('数据库错误，启动失败，请刷新！')
                                clearInterval(timer)
                            }
                            Vue.prototype.$logger.info(`正在检查数据库,第${i++}次`, true)
                        }, 200)
                        // 初始化系统权限
                        commit('SET_SYSTEM_ROLES', result.system)
                        // 初始化页面权限
                        if (result.permissions && result.permissions.length > 0) {
                            commit('SET_ACTIONS', result.permissions)
                            const pages = result.permissions.map(per => { return per.permissionId })
                            var pageRoles = [...new Set([...pages, ...result.node])]
                            commit('SET_PAGE_ROLES', pageRoles)
                        } else {
                            reject(new Error('getRole: permissions must be a non-null array !'))
                        }
                        const system = Vue.ls.get(LAST_SYSTEM_NAME) || result.system[0]
                        resolve({ roles: pageRoles, system })
                    } else {
                        reject(new Error('获取权限错误'))
                    }
                }).catch(error => {
                    reject(error)
                }).finally(() => {
                    Vue.prototype.$logger.info('初始化用户权限结束', true)
                })
            })
        },

        // 登出
        Logout ({ commit, state }) {
            return new Promise((resolve) => {
                commit('SET_TOKEN', '')
                commit('SET_PAGE_ROLES', [])
                commit('SET_ACTIONS', [])
                commit('SET_SYSTEM_ROLES', [])
                commit('SET_STORE', {})
                commit('SET_INFO', {})
                commit('SET_CODE', '')
                Vue.ls.remove(ACCESS_TOKEN) // 清理登录态
                Vue.ls.remove(LAST_PATH_NAME) // 清理最后路由
                Vue.ls.remove(STORE_INFO) // 清理登录门店信息
                Vue.ls.remove(USER_INFO) // 清理用户资料
                Vue.ls.remove(USER_CODE) // 清理用户账户
                Vue.ls.remove('SERVER_API') // 清理URL
                Vue.prototype.$idb.transaction(['columns'], 'readwrite').objectStore('columns').clear()
                Vue.prototype.$idb.transaction(['app'], 'readwrite').objectStore('app').clear()
                Vue.prototype.$idb.transaction(['api'], 'readwrite').objectStore('api').clear()
                // logout(state.token).then(() => {
                //     resolve()
                // }).catch(() => {
                //     resolve()
                // })
                resolve()
            })
        }

    }
}

export default user

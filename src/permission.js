/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-05-06 17:39:22
 */
import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN, STORE_INFO } from '@/store/mutation-types'
import config from '@/config/defaultSettings'

NProgress.configure({ showSpinner: false }) // 进度条

const whiteList = ['login', 'register', 'registerResult', 'dashboard', '404', '403', '500'] // 页面权限白名单

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (to.meta.title) {
        document.title = `${to.meta.title}-${config.system}`
    } else {
        document.title = config.system
    }
    if (Vue.ls.get(ACCESS_TOKEN) && Vue.ls.get(STORE_INFO)) {
        /* has token */
        if (to.path === '/user/login') {
            next({ path: '/dashboard' })
            NProgress.done()
        } else {
            if (store.getters.pageRoles.length === 0) {
                store
                    .dispatch('GetRole')
                    .then(roles => {
                        store.dispatch('GenerateRoutes', roles).then(() => {
                            // 根据roles权限生成可访问的路由表
                            // 动态添加可访问路由表
                            router.addRoutes(store.getters.addRouters)
                            const redirect = decodeURIComponent(from.query.redirect || to.path)
                            if (from.name === 'login') {
                                setTimeout(() => {
                                    if (to.path === redirect) {
                                        // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                                        next({ ...to, replace: true })
                                    } else {
                                        // 跳转到目的路由
                                        next({ path: redirect })
                                    }
                                }, 500)
                            } else {
                                if (to.path === redirect) {
                                    // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                                    next({ ...to, replace: true })
                                } else {
                                    // 跳转到目的路由
                                    next({ path: redirect })
                                }
                            }
                        })
                    })
                    .catch((e) => {
                        Vue.prototype.$logger.error(e)
                        notification.error({
                            message: '错误',
                            description: '未查询到该用户权限结构，请重新登录！'
                        })
                        store.dispatch('Logout').then(() => {
                            // next({ path: '/user/login', query: { redirect: to.fullPath } })
                            if (from.name === 'login') {
                                next({ path: '/403', query: { redirect: to.fullPath } })
                            } else {
                                next({ path: '/user/login', query: { redirect: to.fullPath } })
                            }
                        })
                    })
            } else {
                next()
            }
        }
    } else {
        if (whiteList.includes(to.name)) {
            // 在免登录白名单，直接进入
            next()
        } else {
            next({ path: '/user/login', query: { redirect: to.fullPath } })
            NProgress.done()
        }
    }
})

router.afterEach((to) => {
    NProgress.done()
    store.dispatch('setPageName', to.name)
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <a-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 */
const action = Vue.directive('action', {
    bind: function (el, binding, vnode) {
        const actionName = binding.arg
        const roles = store.getters.actions
        const permissionId = vnode.context.$route.meta.permission[0]
        let actions = []
        roles.forEach(p => {
            if (p.permissionId !== permissionId) {
                return
            }
            actions = p.actions
        })
        if (actions.indexOf(actionName) < 0) {
            Vue.prototype.$logger.warning(`无权限-->${permissionId}--${actionName}`)
            el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
        }
    }
})

export {
    action
}

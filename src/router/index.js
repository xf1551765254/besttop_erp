/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-06-13 10:03:35
 */
import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

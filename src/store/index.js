/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-06-02 19:52:18
 */
import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import customer from './modules/customer'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        app,
        user,
        permission,
        customer
    },
    state: {

    },
    mutations: {

    },
    actions: {

    },
    getters
})

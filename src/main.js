/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-23 16:00:14
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from '@/utils/request'

import './core/use'
import bootstrap from './core/bootstrap'
import '@/permission'
import '@/utils/filter'

import DBinit from './core/indexedDB'

import i18n from './utils/i18n/language'

import { Icon } from 'ant-design-vue'

import { Table, TableColumn, Tree, Button, Divider, InfiniteScroll, Input, Select, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1078508_vxa2xwj9rga.js'
})
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Tree.name, Tree)
Vue.component(Button.name, Button)
Vue.component(Divider.name, Divider)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)
Vue.use(InfiniteScroll)

Vue.config.productionTip = false

Vue.use(VueAxios, router)
Vue.component('icon-font', IconFont)

export const app = new Vue({
    router,
    store,
    i18n,
    beforeCreate () {
        // 本地数据库
        if (!Vue.prototype.hasOwnProperty('$idb')) {
            Vue.prototype.$logger.info('连接本地数据库中...', true)
            DBinit().then(idb => {
                Vue.prototype.$idb = idb
                Vue.prototype.$logger.info('本地数据库连接成功', true)
                Vue.prototype.$logger.info('启动日志管理器', true)
                Vue.prototype.$logger.sendLogs()
            })
        }
    },
    created () {
        bootstrap()
    },
    render: h => h(App)
}).$mount('#app')

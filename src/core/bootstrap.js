/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-31 14:50:12
 */
import Vue from 'vue'
import store from '@/store/'
import {
    ACCESS_TOKEN,
    DEFAULT_COLOR,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR_WEAK,
    SIDEBAR_TYPE,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_TAB,
    USER_CODE,
    USER_NAME,
    USER_AVATAR,
    USER_INFO,
    LAST_SYSTEM_NAME,
    STORE_INFO
} from '@/store/mutation-types'
import config from '@/config/defaultSettings'
import { welcome } from '@/utils/util'

export default function Initializer () {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('TOGGLE_MULTI_TAB', Vue.ls.get(DEFAULT_MULTI_TAB, config.multiTab))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    store.commit('SET_CODE', Vue.ls.get(USER_CODE))
    store.commit('SET_NAME', { name: Vue.ls.get(USER_NAME), welcome: welcome() })
    store.commit('SET_AVATAR', Vue.ls.get(USER_AVATAR) || 'https://image.besttop.top/pc/avatar.png')
    store.commit('SET_INFO', Vue.ls.get(USER_INFO))
    store.commit('SET_LAST_SYSTEM_NAME', Vue.ls.get(LAST_SYSTEM_NAME))
    store.commit('SET_STORE', Vue.ls.get(STORE_INFO))
    store.commit('SET_TAXRATE', config.taxRate)
    store.commit('SET_TAXRATESALE', config.taxRateSale)

    // last step
}

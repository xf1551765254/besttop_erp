/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-25 14:14:18
 */
import Vue from 'vue'
import {
    SIDEBAR_TYPE,
    DEFAULT_THEME,
    DEFAULT_LAYOUT_MODE,
    DEFAULT_COLOR,
    DEFAULT_COLOR_WEAK,
    DEFAULT_FIXED_HEADER,
    DEFAULT_FIXED_SIDEMENU,
    DEFAULT_FIXED_HEADER_HIDDEN,
    DEFAULT_CONTENT_WIDTH_TYPE,
    DEFAULT_MULTI_TAB
} from '@/store/mutation-types'

const app = {
    state: {
        sidebar: true,
        device: 'desktop',
        theme: '',
        layout: '',
        contentWidth: '',
        fixedHeader: false,
        fixSiderbar: false,
        autoHideHeader: false,
        color: null,
        weak: false,
        multiTab: true,
        pageName: '',
        themeSetting: true,
        windowHeight: '',
        chooseStore: false,
        windowWidth: ''
    },
    mutations: {
        SET_CHOOSE_STORE: (state, chooseStore) => {
            state.chooseStore = chooseStore
        },
        SET_THEME_SETTING: (state, themeSetting) => {
            state.themeSetting = themeSetting
        },
        SET_PAGE_NAME: (state, name) => {
            state.pageName = name
        },
        SET_SIDEBAR_TYPE: (state, type) => {
            state.sidebar = type
            Vue.ls.set(SIDEBAR_TYPE, type)
        },
        CLOSE_SIDEBAR: (state) => {
            Vue.ls.set(SIDEBAR_TYPE, true)
            state.sidebar = false
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        TOGGLE_THEME: (state, theme) => {
            Vue.ls.set(DEFAULT_THEME, theme)
            state.theme = theme
        },
        TOGGLE_LAYOUT_MODE: (state, layout) => {
            Vue.ls.set(DEFAULT_LAYOUT_MODE, layout)
            state.layout = layout
        },
        TOGGLE_FIXED_HEADER: (state, fixed) => {
            Vue.ls.set(DEFAULT_FIXED_HEADER, fixed)
            state.fixedHeader = fixed
        },
        TOGGLE_FIXED_SIDERBAR: (state, fixed) => {
            Vue.ls.set(DEFAULT_FIXED_SIDEMENU, fixed)
            state.fixSiderbar = fixed
        },
        TOGGLE_FIXED_HEADER_HIDDEN: (state, show) => {
            Vue.ls.set(DEFAULT_FIXED_HEADER_HIDDEN, show)
            state.autoHideHeader = show
        },
        TOGGLE_CONTENT_WIDTH: (state, type) => {
            Vue.ls.set(DEFAULT_CONTENT_WIDTH_TYPE, type)
            state.contentWidth = type
        },
        TOGGLE_COLOR: (state, color) => {
            Vue.ls.set(DEFAULT_COLOR, color)
            state.color = color
        },
        TOGGLE_WEAK: (state, flag) => {
            Vue.ls.set(DEFAULT_COLOR_WEAK, flag)
            state.weak = flag
        },
        TOGGLE_MULTI_TAB: (state, bool) => {
            Vue.ls.set(DEFAULT_MULTI_TAB, bool)
            state.multiTab = bool
        },
        SET_WINDOW_HEIGHT: (state, windowHeight) => {
            state.windowHeight = windowHeight
        },
        SET_WINDOW_WIDTH: (state, windowWidth) => {
            state.windowWidth = windowWidth
        }
    },
    actions: {
        setChooseStore ({ commit }, chooseStore) {
            commit('SET_CHOOSE_STORE', chooseStore)
        },
        setThemeSetting ({ commit }, themeSetting) {
            commit('SET_THEME_SETTING', themeSetting)
        },
        setPageName ({ commit }, name) {
            commit('SET_PAGE_NAME', name)
        },
        setSidebar ({ commit }, type) {
            commit('SET_SIDEBAR_TYPE', type)
        },
        CloseSidebar ({ commit }) {
            commit('CLOSE_SIDEBAR')
        },
        ToggleDevice ({ commit }, device) {
            commit('TOGGLE_DEVICE', device)
        },
        ToggleTheme ({ commit }, theme) {
            commit('TOGGLE_THEME', theme)
        },
        ToggleLayoutMode ({ commit }, mode) {
            commit('TOGGLE_LAYOUT_MODE', mode)
        },
        ToggleFixedHeader ({ commit }, fixedHeader) {
            if (!fixedHeader) {
                commit('TOGGLE_FIXED_HEADER_HIDDEN', false)
            }
            commit('TOGGLE_FIXED_HEADER', fixedHeader)
        },
        ToggleFixSiderbar ({ commit }, fixSiderbar) {
            commit('TOGGLE_FIXED_SIDERBAR', fixSiderbar)
        },
        ToggleFixedHeaderHidden ({ commit }, show) {
            commit('TOGGLE_FIXED_HEADER_HIDDEN', show)
        },
        ToggleContentWidth ({ commit }, type) {
            commit('TOGGLE_CONTENT_WIDTH', type)
        },
        ToggleColor ({ commit }, color) {
            commit('TOGGLE_COLOR', color)
        },
        ToggleWeak ({ commit }, weakFlag) {
            commit('TOGGLE_WEAK', weakFlag)
        },
        ToggleMultiTab ({ commit }, bool) {
            commit('TOGGLE_MULTI_TAB', bool)
        }
    }
}

export default app

/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2018-12-27 18:41:20
 * @LastEditors: Oak
 * @LastEditTime: 2019-03-02 23:35:46
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './cn'
import en from './en'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

// 自动设置语言
const navLang = navigator.language || false
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
const myLang = window.localStorage.lang || localLang || 'zh-CN'
Vue.config.lang = myLang

// 多语言配置
Vue.locale = () => {}

const messages = {
    'en-US': { ...enLocale, ...en },
    'zh-CN': { ...zhLocale, ...cn }
}
const i18n = new VueI18n({
    locale: myLang,
    messages
})

export default i18n

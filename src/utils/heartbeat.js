/*
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-23 12:45:18
 * @LastEditTime: 2019-04-29 13:53:47
 */
import Vue from 'vue'
import axios from 'axios'
import { URL, PATH } from '@/config/api.config'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import store from '@/store'

let ifmodal = false
const heart = () => {
    Vue.prototype.$logger.info('→→→ 心跳 ←←←', true)
    // 发送心跳
    axios({
        baseURL: URL,
        url: PATH.heartUrl,
        method: 'post',
        headers: {
            Authorization: Vue.ls.get(ACCESS_TOKEN)
            // token: Vue.ls.get(ACCESS_TOKEN)
        },
        data: {}
    }).then(res => {
        if (res.data.flag === 1) {
            const webVersion = res.data.data.version
            store.commit('SET_MESSAGE_COUNT', res.data.data.count || 0)
            // 检查版本
            const Version = Vue.ls.get('VERSION')
            if (Version === null && webVersion !== -1) {
                Vue.ls.set('VERSION', webVersion)
            } else {
                if (Version !== webVersion && webVersion !== -1) {
                    if (!ifmodal) {
                        Vue.prototype.$confirm({
                            title: '新版本已经准备好，是否更新?',
                            content: '更新后若提示无权限问题请点击确定即可。',
                            onOk () {
                                try {
                                    Vue.prototype.$idb.close()
                                    indexedDB.deleteDatabase('erp_web')
                                    Vue.ls.set('VERSION', webVersion)
                                } catch (error) { console.error(error) }
                                setTimeout(() => {
                                    window.location.reload()
                                }, 2000)
                                ifmodal = false
                            },
                            onCancel () { ifmodal = false }
                        })
                        ifmodal = true
                    }
                }
            }
        }
    }).catch(() => {})

    // 递归定时
    setTimeout(() => {
        heart()
    }, 300000)
}

export default heart

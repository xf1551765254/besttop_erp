<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: haile
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-19 09:43:13
 -->
<template>
  <a-locale-provider :locale="locale">
    <!-- <a-config-provider :getPopupContainer="triggerNode => triggerNode.parentNode"> -->
    <div id="app">
      <router-view />
    </div>
    <!-- </a-config-provider> -->
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import heart from '@/utils/heartbeat'

export default {
    data () {
        return {
            locale: zhCN
        }
    },
    mounted () {
        const { $store } = this
        $store.commit('SET_WINDOW_HEIGHT', document.documentElement.clientHeight)
        $store.commit('SET_WINDOW_WIDTH', document.documentElement.clientWidth)
        deviceEnquire(deviceType => {
            switch (deviceType) {
            case DEVICE_TYPE.DESKTOP:
                $store.commit('TOGGLE_DEVICE', 'desktop')
                $store.dispatch('setSidebar', true)
                break
            case DEVICE_TYPE.TABLET:
                $store.commit('TOGGLE_DEVICE', 'tablet')
                $store.dispatch('setSidebar', false)
                break
            case DEVICE_TYPE.MOBILE:
            default:
                $store.commit('TOGGLE_DEVICE', 'mobile')
                $store.dispatch('setSidebar', true)
                break
            }
            this.$logger.info(`运行环境->${deviceType === DEVICE_TYPE.TABLET ? '桌面浏览器' : deviceType === DEVICE_TYPE.MOBILE ? '移动版' : '桌面版'}`, true)
        })
        if (window) {
            window.onresize = () => {
                const windowHeight = document.documentElement.clientHeight
                const windowWidth = document.documentElement.clientWidth
                $store.commit('SET_WINDOW_HEIGHT', windowHeight)
                $store.commit('SET_WINDOW_WIDTH', windowWidth)
            }
        }
        // 心跳
        heart()
    // this.$card.read()
    }
}
</script>
<style>
#app {
  height: 100%;
}
</style>

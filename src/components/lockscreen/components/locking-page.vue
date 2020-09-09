<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2018-12-22 14:46:01
 * @LastEditors: Oak
 * @LastEditTime: 2019-02-28 17:37:43
 -->
<style lang="less">
  @import '../styles/locking-page.less';
</style>

<template>
  <div style="width: 100%;height: 100%;background: #1D2225">
    <div class="unlock-con">
      <unlock :show-unlock="showUnlock" @on-unlock="handleUnlock"></unlock>
    </div>
  </div>
</template>

<script>
import unlock from './unlock.vue'
export default {
    components: {
        unlock
    },
    data () {
        return {
            showUnlock: false
        }
    },
    methods: {
        handleUnlock () {
            const lockScreenBack = document.getElementById('lock_screen_back')
            this.showUnlock = false
            lockScreenBack.style.zIndex = -1
            lockScreenBack.style.boxShadow = '0 0 0 0 #1D2225 inset'
            this.$router.push({
                name: this.$ls.get('LAST_PATH_NAME') // 解锁之后跳转到锁屏之前的页面
            })
        }
    },
    mounted () {
        this.showUnlock = true
        if (!document.getElementById('lock_screen_back')) {
            const lockdiv = document.createElement('div')
            lockdiv.setAttribute('id', 'lock_screen_back')
            lockdiv.setAttribute('class', 'lock-screen-back')
            document.body.appendChild(lockdiv)
        }
        const lockScreenBack = document.getElementById('lock_screen_back')
        lockScreenBack.style.zIndex = -1
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2018-12-22 15:12:17
 * @LastEditors: Oak
 * @LastEditTime: 2019-02-28 19:54:49
 -->
<style lang="less" scoped>
@import "./styles/lockscreen.less";
</style>

<template>
  <div @click="lockScreen">
    <a-icon style="font-size: 16px; padding: 4px" type="lock" />
  </div>
</template>

<script>
const setLockBackSize = () => {
    const x = document.body.clientWidth
    const y = document.body.clientHeight
    const r = Math.sqrt(x * x + y * y)
    return parseInt(r)
}
export default {
    name: 'LockScreen',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        lockScreen () {
            const lockScreenBack = document.getElementById('lock_screen_back')
            lockScreenBack.style.transition = 'all 3s'
            lockScreenBack.style.zIndex = 10000
            lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize + 'px #667aa6 inset'
            this.showUnlock = true
            setTimeout(() => {
                lockScreenBack.style.transition = 'all 0s'
                this.$router.push({
                    name: 'locking'
                })
            }, 800)
            this.$ls.set('LOCK_SCREEN_STATUS', true)
            this.$ls.set('LAST_PATH_NAME', this.$route.name)
        }
    },
    mounted () {
        let lockScreenBack
        if (!document.getElementById('lock_screen_back')) {
            const lockdiv = document.createElement('div')
            lockdiv.setAttribute('id', 'lock_screen_back')
            lockdiv.setAttribute('class', 'lock-screen-back')
            document.body.appendChild(lockdiv)
            lockScreenBack = document.getElementById('lock_screen_back')
            window.addEventListener('resize', () => {
                const size = setLockBackSize()
                this.lockScreenSize = size
                lockScreenBack.style.transition = 'all 0s'
                lockScreenBack.style.width = lockScreenBack.style.height = size + 'px'
            })
        } else {
            lockScreenBack = document.getElementById('lock_screen_back')
        }
        const size = setLockBackSize()
        this.lockScreenSize = size
        lockScreenBack.style.transition = 'all 3s'
        lockScreenBack.style.width = lockScreenBack.style.height = size + 'px'
    }
}
</script>

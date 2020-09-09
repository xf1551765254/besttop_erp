<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2018-12-22 15:12:17
 * @LastEditTime: 2019-02-28 17:30:39
 -->
<style lang="less" scoped>
    .full-screen-btn-con {
    display: inline-block;
    width: 30px;
    text-align: center;
    cursor: pointer;
    i {
        vertical-align: middle;
        transition: all .3s;
    }
    i:hover {
        color: #00C1DE !important;
        transition: all .3s;
    }
    }
</style>

<template>
  <div @click="handleChange" v-if="showFullScreenBtn">
    <a-icon style="font-size: 16px; padding: 4px" :type="value?'fullscreen-exit':'fullscreen'" />
  </div>
</template>

<script>
export default {
    name: 'FullScreen',
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showFullScreenBtn () {
            return window.navigator.userAgent.indexOf('MSIE') < 0
        }
    },
    methods: {
        handleFullscreen () {
            const main = document.body
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen()
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen()
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen()
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen()
                }
            }
        },
        handleChange () {
            this.handleFullscreen()
        }
    },
    created () {
        let isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen
        isFullscreen = !!isFullscreen
        document.addEventListener('fullscreenchange', () => {
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
        })
        document.addEventListener('mozfullscreenchange', () => {
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
        })
        document.addEventListener('webkitfullscreenchange', () => {
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
        })
        document.addEventListener('msfullscreenchange', () => {
            this.$emit('input', !this.value)
            this.$emit('on-change', !this.value)
        })
        this.$emit('input', isFullscreen)
    }
}
</script>

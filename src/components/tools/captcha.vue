<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2018-12-22 14:46:01
 * @LastEditors: Oak
 * @LastEditTime: 2019-03-15 09:25:43
 -->
<template>
  <div>
    <div id="_umfp" style="display:inline;width:1px;height:1px;overflow:hidden"></div>
    <div class="ln">
      <div :id="dynamicId()"></div>
    </div>
  </div>
</template>

<script>
import { noCaptcha } from 'alicdn-js-nc'

function randomCode (length) {
    let str = ''
    for (; str.length < length; str += Math.random().toString(36).substr(2)) {
    // init
    }
    return str.substr(0, length)
}

export default {
    name: 'Captcha',
    props: {
        scene: {
            type: String,
            required: true
        },
        width: {
            type: String,
            default: '300'
        },
        appkey: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            ncId: ''
        }
    },
    computed: {

    },
    mounted () {
        let nc = null
        const ncScene = this.scene // 场景,不可更改
        const ncToken = [this.appkey, (new Date()).getTime(), Math.random()].join(':')
        const ncOption = {
            renderTo: '#' + this.ncId, // 渲染到该DOM ID指定的Div位置
            appkey: this.appkey,
            scene: ncScene,
            token: ncToken,
            customWidth: this.width || 300,
            callback: (data) => { // 校验成功回调
                this.$emit('callback', { csessionid: data.csessionid, sig: data.sig, token: ncToken, scene: ncScene, nc })
            },
            error (s) {
                nc.reset()
            },
            verifycallback (data) {
            }
        }
        /* eslint new-cap: ["error", { "newIsCap": false }] */
        nc = new noCaptcha()
        nc.init(ncOption)
        /* 滑块高度 */
        // document.querySelector('.nc_scale span').style.height = '34px';
        /* 滑过时的背景色 */
        // document.querySelector('.nc_scale div.nc_bg').style.background = '#00C1DE';
        const s = document.createElement('style')
        let h = `html .nc_scale span {
                height: 34px !important;
            }
            html .nc_scale div.nc_bg {
                background: #00C1DE !important;
            }`
        h = h.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&')
        // s.type = 'text/css';
        s.appendChild(document.createTextNode(h))
        document.head.appendChild(s)
    },
    methods: {
        dynamicId () {
            this.ncId = randomCode(10)
            return this.ncId
        }
    }

}
</script>
<style lang="less" scoped>
    .ln {
    padding: 0px;
    }

    .ln .h {
    display: inline-block;
    width: 4em;
    }

    .ln input {
    border: solid 1px #999;
    padding: 5px 8px;
    }
</style>

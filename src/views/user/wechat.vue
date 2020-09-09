<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-13 19:02:07
 * @LastEditTime: 2019-04-17 10:26:40
 -->
<template>
  <a-popover
    :title="`${config.miniApp}小程序`"
    trigger="hover"
    :visible="hovered"
    @visibleChange="handleHoverChange"
  >
    <div slot="content">微信小程序搜索{{ config.miniApp }}或点此扫码</div>
    <a-popover
      title="打开微信扫一扫"
      trigger="click"
      :visible="clicked"
      @visibleChange="handleClickChange"
    >
      <div slot="content">
        <img class="scan" :src="imgdata" alt="">
      </div>
      <slot></slot>
    </a-popover>
  </a-popover>
</template>
<style lang="less" scoped>
    .scan{
        height: 200px;
        width: 200px;
    }
</style>

<script>
import config from '@/config/defaultSettings'
import { WECHAT } from '@/config/api.config'
import { axios } from '../../utils/request'
export default {
    data () {
        return {
            clicked: false,
            hovered: false,
            config,
            imgdata: ''
        }
    },
    mounted () {
        if (config.miniAppId.length > 0) {
            this.getQrCode()
        }
    },
    methods: {
        getQrCode () {
            axios({
                path: 'WechatGetQrCode',
                method: 'POST',
                URL: WECHAT,
                body: {
                    appid: config.miniAppId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.imgdata = res.data
                }
            })
        },
        hide () {
            this.clicked = false
            this.hovered = false
        },
        handleHoverChange (visible) {
            this.clicked = false
            this.hovered = visible
        },
        handleClickChange (visible) {
            this.clicked = visible
            this.hovered = false
        }
    }
}
</script>

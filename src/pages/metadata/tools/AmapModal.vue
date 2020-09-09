<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-07-09 13:53:49
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-09 15:09:35
 -->
<template>
  <a-modal
    v-model="visible"
    destroyOnClose
    centered
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :width="width">
    <template slot="footer">
      <a-button key="back" @click="cancel">关闭</a-button>
      <a-button key="submit" type="primary" @click="submit">确定</a-button>
    </template>
    <div class="addressClass">
      <a-input v-model="addressTemp"/>
    </div>
    <div class="full">
      <a-icon :type="fullValue?'fullscreen-exit':'fullscreen'" @click="fullClick"/>
    </div>
    <Amap @drag="onDrag" :mapWidth="'100%'" :mapHeight="height" :lat="lat" :lng="lng"></Amap>
  </a-modal>
</template>
<style lang="less" scoped>
.addressClass{
    margin-bottom: 10px;
}
.full{
    position: absolute;
    z-index: 99;
    font-size: 30px;
    right: 30px;
}
</style>
<script>
import Amap from '@comp/Amap'
export default {
    name: 'AmapModal',
    components: {
        Amap
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        address: {
            type: String,
            default: ''
        },
        lat: {
            type: String,
            default: ''
        },
        lng: {
            type: String,
            default: ''
        }

    },
    data: function () {
        return {
            visible: false,
            width: 800,
            height: '600px',
            addressTemp: '',
            addressData: {},
            fullValue: false
        }
    },
    methods: {
        fullClick () {
            this.fullValue = !this.fullValue
            if (this.fullValue) {
                this.width = this.$store.getters.windowWidth * 0.9
                this.height = (this.$store.getters.windowHeight * 0.9 - 150) + 'px'
            } else {
                this.width = this.$store.getters.windowWidth * 0.6
                this.height = (this.$store.getters.windowHeight * 0.7 - 150) + 'px'
            }
        },
        cancel () {
            this.$emit('input', false)
        },
        submit () {
            if (!this.addressData.address) {
                this.$message.warning('您尚未选择地址！')
                return
            } else {
                this.addressData.address = this.addressTemp
            }
            this.$emit('dragMap', this.addressData)
            this.$emit('input', false)
        },
        onDrag (data) {
            this.addressTemp = data.address
            this.addressData = data
        }
    },
    watch: {
        value (val) {
            this.width = this.$store.getters.windowWidth * 0.6
            this.height = (this.$store.getters.windowHeight * 0.7 - 150) + 'px'
            this.visible = val
            this.addressTemp = this.$props.address
        }
    }
}
</script>

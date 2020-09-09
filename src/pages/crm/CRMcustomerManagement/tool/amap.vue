<!--
 * @Description: 新增顾客地址地图
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-21 13:41:55
 * @LastEditors: lin
 * @LastEditTime: 2019-08-21 15:52:16
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
    <Amap @drag="onDrag" :mapWidth="'100%'" :mapHeight="height" :lat="addressData.lat" :lng="addressData.lng"></Amap>
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
        },
        addressData: {
            type: Object,
            default: () => { return {} }
        }

    },
    data: function () {
        return {
            visible: false,
            width: 800,
            height: '600px',
            addressTemp: '',
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
            this.visible = false
            this.$emit('input', false)
        },
        submit () {
            if (!this.addressTemp) {
                this.$message.warning('您尚未选择地址！')
            } else {
                this.visible = false
                this.$emit('dragMap', this.addressData)
                this.$emit('input', false)
            }
        },
        onDrag (data) {
            this.addressTemp = data.address
            this.addressData.address = data.address
            this.addressData.lat = data.position.lat + ''
            this.addressData.lng = data.position.lng + ''
            this.addressData.province = data.addressComponent.province
            this.addressData.city = data.addressComponent.city
            this.addressData.area = data.addressComponent.district
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.width = this.$store.getters.windowWidth * 0.6
                this.height = (this.$store.getters.windowHeight * 0.7 - 150) + 'px'
                this.visible = val
                this.addressTemp = this.$props.addressData.address
                console.log(this.addressTemp)
            }
        }
    }
}
</script>

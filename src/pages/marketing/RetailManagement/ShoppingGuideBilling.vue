<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-18 10:36:27
 * @LastEditors: haile
 * @LastEditTime: 2019-08-15 20:39:55
 -->
<template>
  <div class="box">
    <component
      :is="currentTabComponent"
      :goodsData="goodsData"
      :currentCustomer="currentCustomer"
      :goodsDetailStatus="goodsDetailStatus"
      @activeComponent="activeComponent"
      @updateData="updateData"
      @updateCustomer="updateCustomer"
    >
    </component>
  </div>
</template>

<script>
// import GoodsList from './components/GoodsList'
// import GoodsDetail from './GoodsDetail/GoodsDetail'
import GoodsDetail from './GoodsDetail/index'
import Settle from './Settle/Settle'

export default {
    name: 'ShoppingGuideBilling',
    components: {
        // GoodsList,
        GoodsDetail,
        Settle
    },
    data () {
        return {
            currentTabComponent: 'GoodsDetail',
            goodsData: {},
            currentCustomer: {},
            goodsDetailStatus: 0
        }
    },
    methods: {
        /**
         * @name: 组件切换
         * @msg:
         * @param {type} com:0--列表，1--详情，2--结算
         * @return: null
         */
        activeComponent (com) {
            if (com === 0) {
                // this.currentTabComponent = GoodsList
            } else if (com === 1) {
                this.currentTabComponent = GoodsDetail
            } else if (com === 2) {
                this.currentTabComponent = Settle
            }
        },
        /**
         * @name: 更新组件数据
         * @msg:
         * @param {type} type: 0--列表，1--详情，2--结算；data--组件数据
         * @return: null
         */
        updateData (passData) {
            const type = passData.type
            const data = passData.data
            this.goodsData = data
            this.goodsDetailStatus = type
            console.log('==========', type, data)
        },
        updateCustomer (passData) {
            console.log('customerInfo', passData)
            this.currentCustomer = Object.assign(this.currentCustomer, passData)
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'ShoppingGuideBilling') {
                this.activeComponent(0)
            }
        }
    }
}
</script>

<style scoped>
.box{
    height: 100%;
}
</style>

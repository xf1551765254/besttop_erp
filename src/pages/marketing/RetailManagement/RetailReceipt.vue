<!--
 * @Description:零售收款
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-20 11:14:34
 * @LastEditors: haile
 * @LastEditTime: 2019-08-26 17:25:35
 -->
<template>
  <div class="box" :style="{height: height}">
    <component
      :is="currentTabComponent"
      :settleOrders="settleOrders"
      :settleCustomer="settleCustomer"
      :settleFlag="settleFlag"
      :ifDeposit="ifDeposit"
      :goodsData="orderInfo"
      :goodsDetailStatus="goodsDetailStatus"
      @activeComponent="activeComponent"
      @updateData="updateData"
      @updateOrderInfo="updateOrderInfo"
      @updateCustomer="updateCustomer"
      @clearData="clearData"
    >
    </component>
  </div>
</template>

<script>
import Settle from './Settle/Settle'
import OrderList from './OrderList/OrderList'
import GoodsDetail from './GoodsDetail/index'
export default {
    name: 'RetailReceipt',
    components: {
        Settle,
        OrderList,
        GoodsDetail
    },
    data () {
        return {
            currentTabComponent: 'Settle',
            settleOrders: [],
            settleCustomer: {},
            height: '',
            // 结算订单来源标识：0--待结算/快捷支付；1--未完成；2--扫码支付
            settleFlag: 2,
            ifDeposit: 0,
            // 商品详情标识：0--新增开单；1--详情；2--编辑
            goodsDetailStatus: 1,
            orderCode: '',
            orderInfo: {}
        }
    },
    created () {
        this.height = this.$store.getters.windowHeight - 140 + 'px'
    },
    methods: {
        // com  ：2商品详情 （查看） 3 商品详情 （编辑）
        activeComponent (com) {
            if (com === 0) {
                this.currentTabComponent = Settle
            } else if (com === 1) {
                this.currentTabComponent = OrderList
            } else if (com === 2) {
                this.currentTabComponent = GoodsDetail
                this.goodsDetailStatus = 1
            } else if (com === 3) {
                this.currentTabComponent = GoodsDetail
                this.goodsDetailStatus = 2
            }
        },
        updateData (passData) {
            this.settleCustomer = passData[0]
            this.settleOrders = passData[1]
            this.settleFlag = passData[2]
            this.ifDeposit = passData[3]
            console.log('passData', passData)
        },
        updateCustomer (customerInfo) {
            this.settleCustomer = customerInfo
        },
        updateOrderInfo (orderInfo) {
            this.orderInfo = orderInfo
        },
        clearData () {
            this.settleOrders = []
            this.settleCustomer = {}
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'RetailReceipt') {
                this.activeComponent(0)
            }
        },
        '$store.state.getters.windowHeight' (val, oldVal) {
            console.log('/*******************/', val)
            this.height = val - 140 + 'px'
        }
    }
}
</script>

<style lang="less" scoped>
.ant-layout-sider-children {
    overflow: auto!important;
}
</style>

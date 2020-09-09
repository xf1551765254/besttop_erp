<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: haile
 * @Date: 2019-04-17 10:55:21
 * @LastEditTime: 2019-07-22 11:29:51
 -->
<template>
  <div class="index">
    <component
      :is="currentTabComponent"
      @activeComponent="activeComponent"
      @updates="updates"
      :isSpecial="isSpecial"
      :customer="customer"
      :customerCode="customerCode"
      :goodsId="goodsId"
      :salesApproach="salesApproach"
      :warehouse="warehouse"
      :packupCode="packupCode"
      :notSubmittedCount="notSubmittedCount"
      :skuCount="skuCount"
      :isAdd="isAdd"
      :code="code"
    ></component>
  </div>
</template>
<script>
import DistributionOrder from './components/DistributionOrder'
import GoodsDetails from './components/GoodsDetails'
import OrderStatus from './components/OrderStatus'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'

export default {
    name: 'DistributionOrder',
    components: {
        DistributionOrder,
        GoodsDetails,
        OrderStatus
    },
    data () {
        return {
            // 当前组件
            currentTabComponent: DistributionOrder,
            isSpecial: '',
            // 当前客户
            customer: '',
            // 当前客户code
            customerCode: '',
            // 商品id
            goodsId: {},
            // 销售途径
            salesApproach: '0',
            // 提货位置code
            warehouse: {},
            // 提货类型
            packupCode: '2',
            // 历史客户
            // 未提交数量
            notSubmittedCount: 0,
            // 订单数量
            skuCount: 0,
            // 详情页面 修改/新增
            isAdd: true,
            // 待确认数量
            selectBillCount: 0,
            // 待确认sku 数量
            billSelectSkuCount: 0,
            code: ''
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    created () {
        this.agetCounts()
    },
    methods: {
        /**
         * @name: 动态组件
         * @msg:    动态组件切换
         * @param {number} 0：主页 ；1:详情页 ；2 开票状态页面；3：选择渠道客户跳转 开票状态页面 tab 2 4: 详情页面编辑开票 跳转 开票状态页面 tab3
         * @return:
         */
        activeComponent (component) {
            if (component === 0) {
                this.currentTabComponent = DistributionOrder
            } else if (component === 1) {
                this.currentTabComponent = GoodsDetails
            } else if (component === 2) {
                this.currentTabComponent = OrderStatus
                this.isSpecial = '1'
            }
        },
        updates (type, data) {
            console.log(type, data)
            if (type === 'agetCounts') {
                this.agetCounts()
                this.agetSkuCounts()
            } else if (type === 'aget') {
                this.agetCounts()
            } else {
                this[type] = data
            }
        },
        agetCounts () {
            const code = { status: 0, createBy: this.userInfo.code, saleStoreCode: this.storeInfo.code }
            // const code = { status: 0, createBy: this.userInfo.code, saleStoreCode: this.storeInfo.code, customerCode: this.customerCode }
            axios({
                path: 'DistWholesaleOrderSelectOrderCount',
                method: 'post',
                body: code
            }).then(res => {
                if (res.flag === 1) {
                    // console.log(res)
                    this.notSubmittedCount = res.data.orderCount
                    console.log(this.notSubmittedCount)
                }
            })
        },
        agetSkuCounts () {
            // sku 数
            const data = { status: 0, createBy: this.userInfo.code, saleStoreCode: this.storeInfo.code, customerCode: this.customerCode }
            axios({
                path: 'DistWholesaleOrderDetailSelectSkuCount',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.skuCount = res.data.skuCount
                }
            })
        }

    }

}
</script>

<style lang="less" scoped>
.index{
    height: 100%;
}
</style>

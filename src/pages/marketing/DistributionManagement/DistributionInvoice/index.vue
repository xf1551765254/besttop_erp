<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: laikt
 * @Date: 2019-04-17 10:55:21
 * @LastEditTime: 2019-07-20 09:56:21
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
      :selectBillCount="selectBillCount"
      :billSelectSkuCount="billSelectSkuCount"
      :isAdd="isAdd"
    ></component>
  </div>
</template>
<script>
import DistributionInvoice from './components/DistributionInvoice'
import InvoiceDetails from './components/InvoiceDetails'
import InvoiceStatus from './components/InvoiceStatus'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
export default {
    name: 'DistributionInvoice',
    components: {
        DistributionInvoice,
        InvoiceDetails,
        InvoiceStatus
    },
    data () {
        return {
            // 当前组件
            currentTabComponent: InvoiceStatus,
            isSpecial: 0, // 当前客户
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
            // 待确认sku 数量
            billSelectSkuCount: 0,
            // 详情页面 修改/新增
            isAdd: true,
            // 待确认数量
            selectBillCount: 0
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
                this.currentTabComponent = DistributionInvoice
            } else if (component === 1) {
                this.currentTabComponent = InvoiceDetails
            } else if (component === 2) {
                this.currentTabComponent = InvoiceStatus
                this.isSpecial = 1
            } else if (component === 3) {
                this.currentTabComponent = InvoiceStatus
                this.isSpecial = 2
            } else if (component === 4) {
                this.currentTabComponent = InvoiceStatus
                this.isSpecial = 3
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
            const code = { status: 1, createBy: this.userInfo.code, saleStoreCode: this.storeInfo.code }
            axios({
                path: 'DistWholesaleBillSelectBillCount',
                method: 'post',
                body: code
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.selectBillCount = res.data.orderCount
                }
            })
        },
        agetSkuCounts () {
            const data = { status: 1, createBy: this.userInfo.code, saleStoreCode: this.storeInfo.code, customerCode: this.customerCode }
            axios({
                path: 'DistWholesaleBillDetailSelectSkuCount',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.billSelectSkuCount = res.data.skuCount
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

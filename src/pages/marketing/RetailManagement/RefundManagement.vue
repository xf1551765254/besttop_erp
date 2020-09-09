<!--
 * @Description: 退款管理
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-17 10:03:15
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 14:37:17
 -->
<template>
  <div class="refund-management">
    <component
      :is="currentTabComponent"
      :code="code"
      :customerName="customerName"
      :refundedCode="refundedCode"
      @activeComponent="activeComponent"
      @updateSearchCondation="updateSearchCondation"
      @updateRefundCode="updateRefundCode"
    >
    </component>
  </div>
</template>

<script>
import Refund from './RefundManagement/Refund'
import RefundList from './RefundManagement/RefundList'
export default {
    name: 'RefundManagement',
    components: {
        Refund,
        RefundList
    },
    data () {
        return {
            currentTabComponent: 'Refund',
            customerName: '',
            code: '',
            refundedCode: ''
        }
    },
    methods: {
        activeComponent (com) {
            if (com === 0) {
                this.currentTabComponent = Refund
            } else if (com === 1) {
                this.currentTabComponent = RefundList
            }
        },
        updateSearchCondation (passData) {
            this.customerName = passData
            this.code = passData
        },
        updateRefundCode (refundCode) {
            this.refundedCode = refundCode
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'RefundManagement') {
                this.activeComponent(0)
            }
        }
    }
}
</script>

<style lang="less" scoped>
.refund-management{
    height: calc(100% - 21px);
}
</style>

<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-07-19 15:14:42
 -->
<template>
  <div id="homepage">
    <a-tabs @change="tabsChange">
      <a-tab-pane tab="采购订单" key="1"></a-tab-pane>
      <a-tab-pane tab="样机入库" key="2"></a-tab-pane>
      <a-tab-pane tab="入库" key="3"></a-tab-pane>
    </a-tabs>
    <div v-if="tabShow === '1'">
      <ProcurementStorage />
    </div>
    <div v-else-if="tabShow === '2'">
      <PrototypePutInstorage />
    </div>
    <div v-else-if="tabShow === '3'">
      <StockManagement />
    </div>
  </div>
</template>
<script>
import ProcurementStorage from './commodity/ProcurementStorage'
import PrototypePutInstorage from './commodity/PrototypePutInstorage'
import StockManagement from './commodity/StockManagement'
export default {
    name: 'InboundManagement',
    components: { ProcurementStorage, PrototypePutInstorage, StockManagement },
    data () {
        return {
            tabShow: '1'
        }
    },
    methods: {
        tabsChange (e) {
            if (e === '1') {
                this.tabShow = '1'
            } else if (e === '2') {
                this.tabShow = '2'
            } else if (e === '3') {
                this.tabShow = '3'
            }
            console.log(e, this.tabShow)
        }
    }
}
</script>
<style lang='less'>
    #homepage {
        .ant-tabs-nav-scroll {
            background: #fff;
        }
    }
</style>

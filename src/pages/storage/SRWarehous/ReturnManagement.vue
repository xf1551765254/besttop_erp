<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-23 15:47:21
 -->
<template>
  <div id="homepage">
    <a-tabs @change="tabsChange">
      <a-tab-pane tab="采购退库" key="1"></a-tab-pane>
      <a-tab-pane tab="样机退库" key="2"></a-tab-pane>
      <a-tab-pane tab="退库" key="3"></a-tab-pane>
    </a-tabs>
    <div v-if="tabShow === '1'">
      <WithdrawingDocuments />
    </div>
    <div v-else-if="tabShow === '2'">
      <prototypeCancellingStocks/>
    </div>
    <div v-else-if="tabShow === '3'">
      <cancellingStocks/>
    </div>
  </div>
</template>
<script>
import WithdrawingDocuments from './cancellingStocks/WithdrawingDocuments'
import prototypeCancellingStocks from './cancellingStocks/prototypeCancellingStocks'
import cancellingStocks from './cancellingStocks/cancellingStocks'
export default {
    name: 'ReturnManagement',
    components: { WithdrawingDocuments, prototypeCancellingStocks, cancellingStocks },
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

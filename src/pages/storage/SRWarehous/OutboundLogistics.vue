<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-22 09:25:00
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-07 10:21:21
 -->
<!-- 物流出库 -->
<template>
  <div id="homepage">
    <a-tabs @change="tabsChange">
      <a-tab-pane tab="送货出库" key="1"></a-tab-pane>
      <a-tab-pane tab="换货出库" key="2"></a-tab-pane>
      <a-tab-pane tab="现场提货出库" key="3"></a-tab-pane>
    </a-tabs>
    <div v-if="tabShow === '1'">
      <OutboundDelivery />
    </div>
    <div v-else-if="tabShow === '2'">
      <ExchangeOutbound />
    </div>
    <div v-else-if="tabShow === '3'">
      <SinceTheProposedLibrary />
    </div>
  </div>
</template>
<script>
import OutboundDelivery from './deliverystorage/OutboundDelivery'
import ExchangeOutbound from './deliverystorage/ExchangeOutbound'
import SinceTheProposedLibrary from './deliverystorage/SinceTheProposedLibrary'
export default {
    name: 'LogisticsWarehousing',
    components: { OutboundDelivery, ExchangeOutbound, SinceTheProposedLibrary },
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

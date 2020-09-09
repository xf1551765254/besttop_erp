<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-22 09:25:00
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-05 11:18:59
 -->
<!-- 物流入库 -->
<template>
  <div id="homepage">
    <a-tabs @change="tabsChange">
      <a-tab-pane tab="送货入库" key="1"></a-tab-pane>
      <a-tab-pane tab="退换货入库" key="2"></a-tab-pane>
      <a-tab-pane tab="现场提货退货入库" key="3"></a-tab-pane>
    </a-tabs>
    <div v-if="tabShow === '1'">
      <DeliveryPutInStorage />
    </div>
    <div v-else-if="tabShow === '2'">
      <ChangingOrRefunding />
    </div>
    <div v-else-if="tabShow === '3'">
      <PickUpInStore />
    </div>
  </div>
</template>
<script>
import ChangingOrRefunding from './logistics/ChangingOrRefunding'
import DeliveryPutInStorage from './logistics/DeliveryPutInStorage'
import PickUpInStore from './logistics/PickUpInStore'
export default {
    name: 'LogisticsWarehousing',
    components: { ChangingOrRefunding, DeliveryPutInStorage, PickUpInStore },
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

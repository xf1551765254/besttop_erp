<!--
 * @Description: 款台小票打印模板
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-07 20:54:56
 * @LastEditTime: 2019-08-21 09:24:51
 -->
<template>
  <div class="box">
    <p class="ticket-header">东鸽电器-{{ $store.getters.storeInfo.name }}欢迎您</p>
    <div>顾客姓名：{{ ticketInfo.customerName }}</div>
    <div>收款时间：{{ ticketInfo.orderInfoList[0].updateTime }}</div>
    <div>开票导购：{{ ticketInfo.orderInfoList[0].cashierCode }} {{ ticketInfo.orderInfoList[0].cashierNmae }}</div>
    <div class="ticket-code" v-for="(item,index) in ticketInfo.orderInfoList" :key="index">
      <div class="amount">金额：{{ item.actualPay }}</div>
      <VueBarcode :value="item.orderCode" :options="cashBarCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .box {
    font-size: 16px;
    width: 400px;
    padding: 10px;
    div{
      padding-left: 10px;
    }
    .ticket-header {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
    }
    .ticket-code{
      padding: 0px;
      margin-top: 10px;
      .amount {
        padding-left: 10px;

      }
      /deep/ svg{
        width: 100%;
      }
    }
  }
</style>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'CashTicket',
    components: {
        VueBarcode
    },
    props: {
        ticketInfo: {
            type: Object,
            default: () => {}
        }
    },
    data: function () {
        return {
            cashBarCodeOptions: {
                format: 'CODE128',
                displayValue: true,
                height: 50,
                fontSize: 16,
                background: '#ffffff',
                lineColor: '#000000'
            }
        }
    }
}
</script>

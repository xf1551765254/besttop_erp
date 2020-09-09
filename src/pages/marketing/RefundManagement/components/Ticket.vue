<!--
 * @Description: 小票打印预览
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-07 20:54:56
 * @LastEditTime: 2019-06-13 15:52:21
 -->
<template>
  <div class="box">
    <p class="ticket-header">新百电器 新百店欢迎您</p>
    <p class="time">退款时间：{{ ticketInfo.orderInfoList[0].updateTime }}</p>
    <div class="ticket-content">
      <div>
        <span>退款单号</span>
        <span>金额</span>
      </div>
      <a-divider dashed/>
      <a-divider dashed/>
      <div class="order-list" v-for="(item,index) in ticketInfo.orderInfoList" :key="index">
        <div class="order-info">
          <span class="order-code">{{ item.orderCode }}</span>
          <span class="order-amount">{{ item.settlementAmount }}</span>
        </div>
        <p>满返:{{ item.sendTicket }}, 满用:{{ item.receiveTicket }}, 满减:{{ item.sendGift }}</p>
      </div>
      <a-divider dashed/>
      <a-divider dashed/>
      <div>
        <span>合计：</span>
        <span>{{ ticketInfo.totalPay }}</span>
      </div>
      <div v-for="record in ticketInfo.shoppingPayRecordList" :key="record.id">
        <span>{{ record.payTypeName }}:</span>
        <span>{{ Number(record.payAmount).toFixed(2) }}</span>
      </div>
      <div>
        <span>收银员:</span>
        <span>{{ ticketInfo.orderInfoList[0].cashierCode }} {{ ticketInfo.orderInfoList[0].cashierNmae }}</span>
      </div>
      <div>
        <span>流水号:</span>
        <span>{{ ticketInfo.orderInfoList[0].payNumber }}</span>
      </div>
    </div>
    <div class="ticket-footer">
      {{ ticketInfo.reminder }}
    </div>
    <div class="ticket-code">
      <VueBarcode :value="ticketInfo.orderInfoList[0].payNumber" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /deep/ .ant-divider-horizontal {
    margin: 3px 0;
  }
  .box {
    padding: 10px;
    font-size: 16px;
    width: 400px;
    margin-bottom: 10px;
    .ticket-header,
    .time {
      text-align: center;
    }
    .ticket-content {
      div {
          display: flex;
          justify-content: space-between;
      }
      .order-list {
          display: block;
          .order-info{
            display: flex;
            justify-content: space-between;
            padding: 0px;
          }
          p {
              text-align: left;
          }
      }
    }
    .ticket-footer {
      // margin-top: 10px;
    }
    .ticket-code {
      text-align: center;
      /deep/ svg{
        width: 100%;
      }
    }
  }
</style>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'Ticket',
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
            barCodeOptions: {
                format: 'CODE128',
                displayValue: false,
                height: 50,
                background: '#ffffff',
                lineColor: '#000000'
            }
        }
    }
}
</script>

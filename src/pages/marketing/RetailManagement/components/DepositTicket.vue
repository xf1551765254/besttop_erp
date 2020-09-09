<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-12 09:21:40
 * @LastEditors: haile
 * @LastEditTime: 2019-08-12 19:33:07
 -->
<template>
  <div class="refund-ticket">
    <div class="ticket-header">东鸽电器-{{ $store.getters.storeInfo.name }}欢迎您</div>
    <p class="time">收款时间：{{ ticketInfo.orderInfoList[0].updateTime }}</p>
    <!-- 商品信息 -->
    <div class="order-info">
      <p class="info-header">
        <span>商品</span>
        <span>金额</span>
      </p>
      <div class="info-text">
        <div>
          <p>{{ ticketInfo.orderInfoList[0].skuName }}</p>
          <p>{{ ticketInfo.orderInfoList[0].skuCode }} {{ ticketInfo.orderInfoList[0].skuModel }}</p>
        </div>
        <div>
          {{ ticketInfo.orderInfoList[0].actualPay }}
        </div>
      </div>
    </div>
    <!-- 金额 -->
    <div class="amount-list">
      <p>
        <span>合计：</span>
        <span>{{ initPrice(ticketInfo.totalActualAmount) }}</span>
      </p>
      <p v-for="(item, index) in ticketInfo.shoppingPayRecordList" :key="index">
        <span>{{ item.payTypeName }}</span>
        <span>{{ initPrice(item.shouldAmount) }}</span>
      </p>
      <p>
        <span>收银员：</span>
        <span>{{ ticketInfo.orderInfoList[0].cashierCode }} {{ ticketInfo.orderInfoList[0].cashierName }}</span>
      </p>
      <p>
        <span>流水号：</span>
        <span>{{ ticketInfo.orderInfoList[0].payNumber }}</span>
      </p>
    </div>
    <!-- 温馨提示 -->
    <div>
      温馨提示：{{ ticketInfo.reminder }}
    </div>
    <!-- 条形码 -->
    <div class="ticket-code">
      <VueBarcode :value="ticketInfo.orderInfoList[0].payNumber" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
  </div>
</template>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'DepositTicket',
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
    },
    methods: {
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }
}
</script>

<style lang="less" scoped>
.refund-ticket {
    padding: 5px;
    width: 390px;
    font-size: 16px;
    margin-bottom: 10px;
    p {
        margin-bottom: 0;
    }
    .ticket-header {
        font-size: 18px;
        font-weight: 700;
        text-align: center;
    }
    .time {
      text-align: center
    }
    .order-info {
        .info-header {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000;
        }
        .info-text {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #000;
            padding: 10px 0;
        }
    }
    .amount-list {
        padding: 10px 0;
        >p {
            display: flex;
            justify-content: space-between;
        }
    }
    .ticket-code {
        width: 100%;
        text-align: center;
        margin-top: 10px;
    }
}
</style>

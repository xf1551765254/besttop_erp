<!--
 * @Description: 小票打印预览
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-07 20:54:56
 * @LastEditTime: 2019-08-23 16:37:35
 -->
<template>
  <div class="ticket-box" id="ticket-box">
    <h1 class="ticket-header">东鸽电器-{{ $store.getters.storeInfo.name }}欢迎您</h1>
    <p class="time">收款时间：{{ ticketInfo.orderInfoList[0].updateTime }}</p>
    <!-- 订单列表区域 -->
    <div class="ticket-content">
      <div class="order-item" v-for="(order, oi) in ticketInfo.orderInfoList" :key="oi">
        <p><span>销售单号</span><span>{{ order.orderCode }}</span></p>
        <p><span>商品</span><span>{{ order.skuName }}</span></p>
        <p><span>销售价</span><span>{{ initPrice(order.actualPay) }}</span></p>
        <p><span>数量</span><span>x{{ order.quantity }}</span></p>
        <div class="activity">
          <!-- 电子币 -->
          <div v-if="order.coinList.length > 0">
            <span v-for="(coin, ci) in order.coinList" :key="ci">【{{ coin.scheduleRuleName }}: {{ coin.scheduleAmount }}】</span>
          </div>
          <!-- 促销券 -->
          <div v-if="order.promotionList.length > 0">
            <span v-for="(promotion, pi) in order.promotionList" :key="pi">【{{ promotion.scheduleRuleName }}: {{ promotion.scheduleAmount }}】</span>
          </div>
          <!-- AB账户 -->
          <span v-if="order.couponA > 0">【A账户：{{ Number(order.couponA).toFixed(2) }}】</span>
          <span v-if="order.couponB > 0">【B账户：{{ Number(order.couponB).toFixed(2) }}】</span>
          <!-- 厂家券/商场券 -->
          <span v-if="order.manufactorCouponUseAmount > 0">【厂家券：{{ Number(order.manufactorCouponUseAmount).toFixed(2) }}】</span>
          <span v-if="order.marketCouponUseAmount > 0">【商场券：{{ Number(order.marketCouponUseAmount).toFixed(2) }}】</span>
        </div>
        <!-- 单品活动 -->
        <div class="single">
          <p v-if="order.reduceRule && JSON.stringify(order.reduceRule) !== '{}'"><span>【满减活动】</span><span>实减：{{ Number(order.reduceRule.scheduleAmount).toFixed(2) }}</span></p>
          <p v-if="order.backRule && JSON.stringify(order.backRule) !== '{}'"><span>【满返活动】</span><span>{{ Number(order.backRule.scheduleAmount).toFixed(2) }}</span></p>
          <p v-if="order.singleGiftList.length > 0"><span>【满赠活动】</span><span>{{ order.singleGiftList[0].name }} x{{ order.singleGiftList[0].quantity }}</span></p>
          <div v-if="order.bindingGoodsList.length > 0" class="bind">
            <div>【捆绑销售】</div>
            <div class="bind-goods">
              <p v-for="(goods, gi) in order.bindingGoodsList" :key="gi">
                {{ goods.name }} x{{ goods.quantity }}
              </p>
            </div>
          </div>
        </div>
        <div style="margin-bottom: 6px;">签收验证码：{{ order.authCode }}</div>
      </div>
      <!-- 套购活动区域 -->
      <div class="arbitrage" v-if="show">
        <div v-if="ticketInfo.reduceList.length > 0">
          <p v-for="(reduceItem, ri) in ticketInfo.reduceList" :key="ri">
            <span>【套购满减】</span>
            <span>实减：{{ Number(reduceItem.scheduleAmount).toFixed(2) }}</span>
          </p>
        </div>
        <div v-if="ticketInfo.backList.length > 0">
          <p v-for="(backItem, bi) in ticketInfo.backList" :key="bi">
            <span>【套购满返】</span>
            <span>{{ backItem.scheduleRuleName }}: {{ Number(backItem.scheduleAmount).toFixed(2) }}</span>
          </p>
        </div>
        <div v-if="ticketInfo.giftList.length > 0">
          <p v-for="(giftItem, gi) in ticketInfo.giftList" :key="gi">
            <span>【套购满赠】</span>
            <span>{{ giftItem.skuName }}  x{{ giftItem.quantity }}</span>
          </p>
        </div>
        <p v-if="ticketInfo.freeRule && JSON.stringify(ticketInfo.freeRule) !== '{}'">
          <span>【套购满免】</span>
          <span>{{ ticketInfo.freeRule.skuName }}  {{ ticketInfo.freeRule.quantity }}</span>
          <span>{{ ticketInfo.freeRule.scheduleRuleName }}</span>
          <span>免：{{ Number(ticketInfo.freeRule.scheduleAmount).toFixed(2) }}</span>
        </p>
      </div>
    </div>
    <!-- 金额/收款记录/收营员 -->
    <div class="ticket-footer">
      <p><span>销售合计：</span><span>{{ ticketInfo.totalActualAmount }}</span></p>
      <p><span>电子币合计：</span><span>{{ Number(ticketInfo.coinAmount).toFixed(2) }}</span></p>
      <p><span>促销券合计：</span><span>{{ Number(ticketInfo.promotionAmount).toFixed(2) }}</span></p>
      <p><span>应收款合计：</span><span>{{ ticketInfo.totalPay }}</span></p>
      <p v-for="(payRecord, i) in ticketInfo.shoppingPayRecordList" :key="i">
        <span>{{ payRecord.payTypeName }}</span>
        <span>{{ Number(payRecord.payAmount).toFixed(2) }}</span>
      </p>
      <p><span>收银员：</span><span>{{ ticketInfo.orderInfoList[0].cashierCode }} {{ ticketInfo.orderInfoList[0].cashierName }}</span></p>
      <p><span>流水号：</span><span>{{ ticketInfo.orderInfoList[0].payNumber }}</span></p>
    </div>
    <!-- 温馨提示 -->
    <div>
      {{ ticketInfo.reminder }}
    </div>
    <!-- 条形码 -->
    <div class="ticket-code">
      <VueBarcode :value="ticketInfo.orderInfoList[0].payNumber" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /deep/ .ant-divider-horizontal {
    margin: 3px 0;
  }
  .ticket-box {
    padding: 5px;
    width: 390px;
    font-size: 16px;
    margin-bottom: 10px;
    border: 2px solid #000;
    p {
        margin-bottom: 0;
    }
    .ticket-header {
        font-size: 18px;
        font-weight: 700;
        text-align: center;
    }
    .ticket-content {
        border: 2px dashed #000;
        > div {
            border-bottom: 2px dashed #000;
            padding: 5px;
        }
        > div:last-of-type {
            border-bottom: none;
            border-top: 2px dashed #000;
        }
        > div:nth-last-child(2) {
            border: none;
        }
        .order-item {
            >p {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
            }
            .activity {
                word-wrap:break-word;
                margin-top: 10px;
                >div {
                    display: inline-block;
                }
            }
            .single {
                p,
                .bind {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 6px;
                }
                .bind {
                    .bind-goods {

                    }
                }
            }
        }
        .arbitrage {
            p {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                > span {
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
    .ticket-footer {
        margin: 10px 0;
        p {
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
    mounted () {
        if (this.ticketInfo.giftList.length > 0 || this.ticketInfo.backList.length > 0 || this.ticketInfo.reduceList.length > 0 || (this.ticketInfo.freeRule && JSON.stringify(this.ticketInfo.freeRule) !== '{}')) {
            this.show = true
            console.log(this.show)
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
            },
            show: false
        }
    },
    methods: {
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }
}
</script>

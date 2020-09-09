<!--
 * @Description: 订单列表
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 15:33:53
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 11:06:21
 -->
<template>
  <div class="order-list">
    <div class="list-header">
      <div></div>
      结算商品列表
    </div>
    <div class="list-content">
      <div class="list-item" v-for="(order, oi) in singleList" :key="oi">
        <div class="item-header">
          <p>
            <span>订单号：{{ order.code }}</span>
          </p>
          <div class="goods-info">
            <div class="img-box">
              <img style="display:block;width:100%;height:auto;" v-if="order.skuInfo.mainGoodsPic[0]" :src="order.skuInfo.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="order.skuInfo.name">
              <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="order.skuInfo.name">
            </div>
            <div class="detail-text">
              <p style="font-weight: 700;">{{ order.skuInfo.name }} - {{ order.skuInfo.code }}</p>
              <p>{{ order.skuInfo.model }}</p>
              <p>数量：x{{ order.skuInfo.quantity }}</p>
            </div>
            <div class="service-list" v-if="order.serviceCoupons">
            </div>
          </div>
        </div>
        <div class="item-activity" v-if="!order.ifDeposit">
          <div class="ele">
            <div class="item-activity-name">
              使用电子币：
            </div>
            <div class="item-activity-list">
              <div v-if="order.electronic.length > 0">
                <div class="ele">
                  <div v-for="(ele, ei) in order.electronic" :key="ei" class="ele-item">
                    <span>{{ ele.scheduleRuleDefineName }}</span>
                    <span>{{ initPrice(ele.actualAmount) }}</span>
                    <div class="triangle-topleft"></div>
                  </div>
                </div>
              </div>
              <div v-else>暂无可用电子币</div>
            </div>
          </div>
          <div class="other-all">
            <div class="item-activity-name">
              其他促销券：
            </div>
            <div class="item-activity-list">
              <div class="promotion">
                <div v-for="(promotion, pi) in order.promotionCoupons" :key="pi">
                  <span>{{ promotion.scheduleRuleName ? promotion.scheduleRuleName : '促销券' }}</span>
                  <span>{{ initPrice(promotion.scheduleAmount) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
                <div v-if="order.aUseAmount !== 0">
                  <span>A账户</span>
                  <span>{{ initPrice(order.aUseAmount) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
                <div v-if="order.bUseAmount !== 0">
                  <span>B账户</span>
                  <span>{{ initPrice(order.bUseAmount) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
                <div v-if="order.marketCouponAmount && order.marketCouponAmount !== 0">
                  <span>商场券</span>
                  <span>{{ initPrice(order.marketCouponAmount ? order.marketCouponAmount : 0) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
                <div v-if="order.manufacturerCouponAmount && order.manufacturerCouponAmount !== 0">
                  <span>厂家券</span>
                  <span>{{ initPrice(order.manufacturerCouponAmount ? order.manufacturerCouponAmount: 0) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
                <div v-if="order.reduceDefine && JSON.stringify(order.reduceDefine) !== '{}' ">
                  <span>满{{ order.reduceDefine.reachAmount }}减{{ order.reduceDefine.rateAmount }}</span>
                  <span>{{ initPrice(order.reduceDefine.actualAmount) }}</span>
                  <div class="triangle-topleft"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="item-footer" :class="{'advance-footer': order.ifDeposit}">
          <div v-if="!order.ifDeposit">共优惠：{{ initPrice(order.discountsAmount) }}</div>
          <div v-else class="advance-sale">定金预售</div>
          <div>应退款：<span style="display: inline-block;width: auto;color:#FF2323;font-size:14px;font-weight:700">{{ initPrice(order.shouldPay) }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goodsPhoto from '@assets/goods.png'

export default {
    name: 'OrderList',
    props: {
        singleList: {
            type: Array,
            default: () => []
        }
    },
    mounted () {
        console.log('传入的订单列表', this.singleList)
    },
    methods: {
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        moveErrorImg (event) {
            event.currentTarget.src = goodsPhoto
        }
    }
}
</script>

<style lang="less" scoped>
p {
    margin-bottom: 5px;
}
.order-list {
    height: 69.5%;
    background: #fff;
    margin-bottom: 5px;
    border-radius: 6px;
    .list-header {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 700;
        padding-left: 10px;
        >div {
            display: inline-block;
            width: 4px;
            height: 14px;
            border-radius: 2px;
            background: #408BFF;
        }
    }
    .list-content {
        height: calc(100% - 30px);
        max-height: calc(100% - 30px);
        padding: 5px;
        overflow-y: auto;
        .list-item {
            border: 1px dotted #408BFF;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 10px;
            .item-header {
                background: #F5F9FF;
                padding: 6px 12px;
                .goods-info {
                    display: flex;
                    .img-box {
                        display: flex;
                        align-content: centerl;
                        width: 60px;
                        height: 60px;
                        background: #fff;
                        img {
                            display: inline-block;
                            width: 100%;
                            height: auto;
                        }
                    }
                    .detail-text {
                        flex: 1;
                        padding-left: 12px;
                        > p {
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                    }
                    .service-list {
                        width: 200px;
                    }
                }
                .delActive {
                    font-size: 14px;
                    font-weight: bold;
                }
            }
            .item-footer {
                font-size: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                height: 30px;
                line-height: 30px;
                background: #F5F9FF;
                .advance-sale {
                    width: 72px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    background: #408BFF;
                    color: #fff;
                }
            }
            .advance-footer {
                background: #FFF;
            }
            .item-activity {
                font-size: 12px;
                padding: 5px 12px;
                >div {
                    display: flex;
                    margin-bottom: 10px;
                    .item-activity-name {
                        width: 72px;
                    }
                    .item-activity-list {
                        flex: 1;
                        .promotion {
                            >div {
                                position: relative;
                                display: inline-block;
                                height: 24px;
                                padding: 2px 0;
                                margin-right: 10px;
                                margin-bottom: 5px;
                                border-radius: 2px;
                                border: 1px solid #408BFF;
                                .triangle-topleft{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 0;
                                    height: 0;
                                    border-top: 8px solid #408BFF;
                                    border-right: 8px solid transparent;
                                }
                                span {
                                    display: inline-block;
                                    padding: 0 5px;
                                }
                                span:first-of-type {
                                    border-right: 1px solid #E6E6E6;
                                }
                            }
                        }
                        .ele {
                            .ele-item {
                                position: relative;
                                display: inline-block;
                                height: 24px;
                                padding: 2px 0;
                                margin-right: 10px;
                                margin-bottom: 5px;
                                border-radius: 2px;
                                border: 1px solid #408BFF;
                                .triangle-topleft{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 0;
                                    height: 0;
                                    border-top: 8px solid #408BFF;
                                    border-right: 8px solid transparent;
                                }
                                span {
                                    display: inline-block;
                                    padding: 0 5px;
                                }
                                span:first-of-type {
                                    border-right: 1px solid #E6E6E6;
                                }
                            }
                        }
                        .ant-checkbox-wrapper.ele-item {
                            /deep/ .ant-checkbox {
                                display: none;
                            }
                            /deep/ .ant-checkbox + span {
                                position: relative;
                                display: block!important;
                                padding: 2px 0;
                                font-size: 12px;
                                border: 1px solid #E6E6E6;
                                >span{
                                    display: inline-block;
                                    padding: 0 5px;
                                    border-right: 1px solid #E6E6E6;
                                }
                                .ant-inout-number {
                                    font-size: 12px;
                                }
                                .triangle-topleft{
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 0;
                                    height: 0;
                                    border-top: 8px solid #E6E6E6;
                                    border-right: 8px solid transparent;
                                }
                            }
                        }
                        .ant-checkbox-wrapper-checked.ele-item {
                            /deep/ .ant-checkbox + span {
                                border: 1px solid #408BFF!important;
                                .triangle-topleft{
                                    border-top: 8px solid #408BFF;
                                    border-right: 8px solid transparent;
                                }
                            }
                        }
                    }
                }
            }
        }

    }
}
</style>

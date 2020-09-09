<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-21 14:11:18
 * @LastEditors: haile
 * @LastEditTime: 2019-08-26 10:33:28
 -->
<template>
  <div class="refund-orderlist">
    <div class="pay-number">
      <div class="header">
        <div class="header-info">
          <span>流水号：31231321231321</span>
          <span>退货单号：TEST0333-00000016</span>
          <span>时间：2019-08-21 14:17:14</span>
          <span>导购：张三0123456</span>
          <span>顾客：hle13152411070</span>
        </div>
        <div class="header-opt">
          <span>详情</span>
          <span style="margin-left: 23px;">打印小票</span>
        </div>
      </div>
      <div class="content">
        <div class="order-item">
          <div class="left">
            <img src="" alt="">
            <div>
              <p>销售单号：TEST0333-00000133</p>
              <p>
                <span>SKUNAME SKUCODE SKUMODEL</span>
                <span>x1</span>
              </p>
              <p>
                {{ initPrice(1000) }}
              </p>
            </div>
          </div>
          <div class="right">
            <p>
              <span>提货方式：仓库配送</span>
              <span>提货位置：西城仓</span>
              <span>申请原因：发错货</span>
            </p>
            <p>
              <span>收货人：hle 13152411070</span>
              <span>
                <a-button type="primary" size="small">补冲发票</a-button>
              </span>
            </p>
            <p>
              地址：绿地蓝海大厦
            </p>
          </div>
        </div>
        <div class="order-item">
          <div class="left">
            <img src="" alt="">
            <div>
              <p>销售单号：TEST0333-00000133</p>
              <p>
                <span>SKUNAME SKUCODE SKUMODEL</span>
                <span>x1</span>
              </p>
              <p>
                {{ initPrice(1000) }}
              </p>
            </div>
          </div>
          <div class="right">
            <p>
              <span>提货方式：仓库配送</span>
              <span>提货位置：西城仓</span>
              <span>申请原因：发错货</span>
            </p>
            <p>
              <span>收货人：hle 13152411070</span>
              <span>
                <a-button type="primary" size="small">补冲发票</a-button>
              </span>
            </p>
            <p>
              地址：绿地蓝海大厦
            </p>
          </div>
        </div>
      </div>
      <div class="footer" v-if="status !== 3">
        <span>应退金额：{{ initPrice(2000) }}</span>
        <span>已退金额：{{ initPrice(500) }}</span>
        <span>
          尾款金额：<span style="color: #1980ff;margin-right: 10px;">{{ initPrice(1500) }}</span>
          <a-button type="primary" v-if="status === 1" @click="toRefund">退款</a-button>
          <a-button type="primary" v-if="status === 2" @click="toRefund">继续退款</a-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'RefundOrderList',
    props: {
        status: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {

        }
    },
    methods: {
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        toRefund () {
            this.$emit('toRefund')
        }
    }
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.refund-orderlist {
    padding: 15px;
    .pay-number {
        background: #fff;
        margin-bottom: 10px;
        font-size: 12px;
        border: 1px solid #EBEFF8;
        .header {
            display: flex;
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            border-bottom: 1px solid #EBEFF8;
            .header-info {
                flex: 1;
                >span {
                    margin-right:31px;
                }
            }
            .header-opt {
                width: 110px;
                text-align: right;
                color: #1980FF;
            }
        }
        .content {
            background: #fff;
            .order-item {
                display: flex;
                border-bottom: 1px solid #EBEFF8;
                > div {
                    height: 80px;
                    margin: 10px 0;
                    flex: 1;
                }
                .left {
                    display: flex;
                    border-right: 1px solid #EBEFF8;
                    padding: 0 10px;
                    img {
                        display: inline-block;
                        width: 80px;
                        height: 80px;
                        margin-right: 10px;
                    }
                    > div {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        > p:nth-of-type(2) {
                            display: flex;
                            justify-content: space-between;
                        }
                    }
                }
                .right {
                    padding: 0 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    > p:nth-of-type(2) {
                        display: flex;
                        justify-content: space-between;
                        align-content: center;
                    }
                }
            }
        }
        .footer {
            display: flex;
            justify-content: space-between;
            height: 42px;
            line-height: 42px;
            padding: 0 10px;
            > span {
                display: block;
            }
        }
    }
}
</style>

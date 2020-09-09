<!--
 * @Description: 退款列表
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-29 08:48:41
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 14:38:49
 -->
<template>
  <div class="refundlist-box">
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach">
    </seachBox>
    <!-- 订单列表 -->
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="待退款（1）" key="1">
        <div class="refund-orderlist">
          <div class="pay-number" v-for="(payNumber, pi) in pendingList" :key="pi">
            <div class="header">
              <div class="header-info">
                <span>流水号：{{ payNumber.payNumber }}</span>
                <span>退货单号：{{ payNumber.code }}</span>
                <span>时间：{{ payNumber.auditTime }}</span>
                <span>导购：{{ payNumber.guideName }}{{ payNumber.guideCode }}</span>
                <span>顾客：{{ payNumber.customerName }} {{ payNumber.customerTelephone }}</span>
              </div>
            </div>
            <div class="content">
              <div class="order-item" v-for="(order, oi) in payNumber.detailList" :key="oi">
                <div class="left">
                  <img v-if="order.mainGoodsPic[0]" :src="order.mainGoodsPic[0]" @error.once="moveErrorImg($event)">
                  <img v-else src="@assets/goods.png">
                  <div>
                    <p>销售单号：{{ order.sourceCode }}</p>
                    <p>
                      <span>{{ order.skuName }} {{ order.skuCode }} {{ order.skuModel }}</span>
                      <span>x{{ order.quantity }}</span>
                    </p>
                    <p>
                      {{ initPrice(order.actualPrice) }}
                    </p>
                  </div>
                </div>
                <div class="right">
                  <p>
                    <span>提货方式：{{ order.stockOutName }}</span>
                    <span>提货位置：{{ order.pickStoreName }}</span>
                    <span>申请原因：{{ order.applyReasonName }}</span>
                  </p>
                  <p>
                    <span>收货人：{{ order.consigneeName }} {{ order.consigneeTelephone }}</span>
                    <span>
                      <!-- <a-button type="primary" size="small">补冲发票</a-button> -->
                    </span>
                  </p>
                  <p>
                    地址：{{ order.consigneeAddressDetail }}
                  </p>
                </div>
              </div>
            </div>
            <div class="footer">
              <span>应退金额：{{ initPrice(payNumber.shouldRedundAmount) }}</span>
              <span>已退金额：{{ initPrice(payNumber.refundAmout) }}</span>
              <span>
                尾款金额：<span style="color: #1980ff;margin-right: 10px;">{{ initPrice(payNumber.balanceAmount) }}</span>
                <a-button type="primary" @click="toRefund(payNumber.code)">退款</a-button>
              </span>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="退款中（1）" key="2">
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
                      <!-- <a-button type="primary" size="small">补冲发票</a-button> -->
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
                      <!-- <a-button type="primary" size="small">补冲发票</a-button> -->
                    </span>
                  </p>
                  <p>
                    地址：绿地蓝海大厦
                  </p>
                </div>
              </div>
            </div>
            <div class="footer">
              <span>应退金额：{{ initPrice(2000) }}</span>
              <span>已退金额：{{ initPrice(500) }}</span>
              <span>
                尾款金额：<span style="color: #1980ff;margin-right: 10px;">{{ initPrice(1500) }}</span>
                <a-button type="primary" @click="toRefund">继续退款</a-button>
              </span>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="已退款（1）" key="3">
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
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import goodsPhoto from '@assets/goods.png'
import moment from 'moment'
import SeachBox from '@comp/seachBox'
import RefundOrderList from './components/RefundOrderList'
export default {
    name: 'RefundList',
    components: {
        SeachBox,
        RefundOrderList
    },
    props: {
        code: {
            type: String,
            default: ''
        },
        customerName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            seachValue: {},
            conditions: [
                { title: '退款单号', type: 'input', key: 'code' },
                { title: '销售单号', type: 'input', key: 'sourceCode' },
                { title: '导购姓名', type: 'input', key: 'guideName' },
                { title: '顾客姓名', type: 'input', key: 'customerName' }
            ],
            defaultActiveKey: 1,
            pendingList: [],
            status: 'return_apply_status:3' // 带退款
        }
    },
    mounted () {
        if (this.code !== '' || this.customerName !== '') {
            this.seachValue.code = this.code
            this.seachValue.customerName = this.customerName
        }
        this.queryList()
    },
    methods: {
        toRefund (refundCode) {
            this.$emit('updateRefundCode', refundCode)
            this.$emit('activeComponent', 0)
        },
        onSeach (val) {
            this.queryList()
        },
        onReload () {
            this.seachValue = {}
        },
        callback (key) {
            this.defaultActiveKey = Number(key)
            if (key === '1') {
                this.status = 'return_apply_status:3'
            } else if (key === '2') {
                this.status = 'return_apply_status:6'
            } else {
                this.status = 'return_apply_status:4'
            }
            this.queryList()
        },
        async queryList () {
            this.seachValue.status = this.status
            this.seachValue.storeCode = this.$store.getters.storeInfo.code
            const res = await axios({
                path: 'RefundQueryRefundedList',
                method: 'post',
                body: this.seachValue
            })
            if (res.flag === 1) {
                console.log('待退款列表', res.data)
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        item.auditTime = moment(item.auditTime).format('YYYY-MM-DD HH:MM:SS')
                        item.detailList.forEach(order => {
                            const pic = order.picture ? order.picture.split(',') : ['']
                            order.mainGoodsPic = pic
                        })
                    })
                }
                this.pendingList = res.data
            }
        },
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
/deep/ .ant-tabs-nav-scroll {
    text-align: center;
}
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
                cursor: pointer;
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
                    > p:nth-of-type(1) {
                        span {
                            margin-right: 20px;
                        }
                    }
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

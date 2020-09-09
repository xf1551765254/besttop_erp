<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-08-10 10:16:41
 * @LastEditors: haile
 * @LastEditTime: 2019-08-21 13:10:54
 -->
<template>
  <div class="deposit-refund">
    <div class="search">
      <a-input
        placeholder="请输入顾客/流水号（或扫描票据）"
        @focus="onSearchFocus"
        @blur="searchFocus=false"
        v-model="orderCode"
        @pressEnter="onSearch"
        ref="userNameInput"
        :maxLength="18">
        <a-icon slot="prefix" type="search" style="transform: translateX(-120px);" />
        <a-icon v-if="orderCode" slot="suffix" type="close-circle" @click="emitEmpty" />
      </a-input>
    </div>
    <a-tabs :activeKey="defaultActiveKey" @change="callback" class="deposit-content">
      <a-tab-pane :tab="`未退款（${unRefundList.length}）`" key="1">
        <ul class="order-list">
          <li v-for="(el,index) in unRefundList" :key="index" :class="{active:actionIndex===index}">
            <div class="order-title">
              <span>
                流水号：{{ el.payNumber }}
              </span>
              <span>
                时间：{{ el.createTime }}
              </span>
              <span>
                导购：{{ el.guideName }}
              </span>
              <span>
                顾客：{{ el.customerName }} {{ el.customerPhone }}
              </span>
              <a-button type="primary" @click="action(el)">退款</a-button>
            </div>
            <div class="order-content">
              <img v-if="el.pic" :src="el.pic" @error.once="moveErrorImg($event)" :alt="el.skuName" class="goods-img">
              <img v-else src="@assets/goods.png" alt="" class="goods-img">
              <div class="order-msg" >
                <p>
                  <span>
                    {{ el.skuName }}  {{ el.payNumber }}
                  </span>
                  <span>
                    {{ el.skuModel }}
                  </span>

                </p>
                <p>
                  支付方式：{{ el.payTypeName||'' }}
                  支付凭证：{{ el.referNumber||'' }}
                  支付金额：{{ initPrice(el.payAmount) }}
                </p>
                <p>

                  应退金额：
                  <span class="price">
                    {{ initPrice(el.payAmount) }}
                  </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </a-tab-pane>
      <a-tab-pane :tab="`已退款（${refundList.length}）`" key="2">
        <ul class="order-list">
          <li v-for="(el,index) in refundList" :key="index" :class="{active:actionIndex===index}">
            <div class="order-title">
              <span>
                流水号：{{ el.payNumber }}
              </span>
              <span>
                时间：{{ el.createTime }}
              </span>
              <span>
                导购：{{ el.guideName }}
              </span>
              <span>
                顾客：{{ el.customerName }} {{ el.customerPhone }}
              </span>
              <a-button type="primary" @click="ticket (el)">打印小票</a-button>
            </div>
            <div class="order-content">
              <img v-if="el.pic" :src="el.pic" @error.once="moveErrorImg($event)" :alt="el.skuName" class="goods-img">
              <img v-else src="@assets/goods.png" alt="" class="goods-img">
              <div class="order-msg" >
                <p>
                  <span>
                    {{ el.skuName }}  {{ el.payNumber }}
                  </span>

                </p>
                <p>
                  <span>
                    {{ el.skuModel }}
                  </span>
                  <!-- 支付方式：{{ el.payTypeName||"" }}
                  支付凭证：{{ el.referNumber||'' }}
                  支付金额：{{ initPrice(el.payAmount) }} -->
                </p>
                <p>

                  应退金额：{{ initPrice(el.payAmount) }}

                </p>
              </div>
              <div class="order-reason">
                <p>
                  <span class="lable">
                    申请原因：
                  </span>
                  <span>
                    {{ el.reasonName }}
                  </span>
                </p>
                <p>
                  <span class="lable">
                    备注：
                  </span>
                  <span>
                    {{ el.note }}
                  </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="退款"
      v-model="refundModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
    >
      <div class="refundModal">
        <p>
          <span>退款方式：{{ refunding.payTypeName||"" }}</span>
          <span>退款凭证：{{ refunding.referNumber||'' }}</span>
          <span>退款金额：<span class="price">{{ initPrice(refunding.payAmount) }}</span></span>
        </p>
        <a-form
          :form="form"
          ref="input"

        >
          <a-form-item
            label="申请原因："
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            ref="search-input"

          >
            <a-select
              v-decorator="[
                'reason'
              ]"
              placeholder="请选择申请原因"

            >
              <a-select-option v-for="applyEl in applyReasonList" :value="applyEl.code" :key="applyEl.code">{{ applyEl.value }}</a-select-option>

            </a-select>
          </a-form-item>
          <a-form-item
            label="退款码："
            :label-col="{ span: 2}"
            :wrapper-col="{ span: 22 }"
          >
            <a-input
              width="100%"
              style="width: 100%;"
              placeholder="请输入或扫入退款码"
              v-decorator="[
                'magneticStripe'
              ]"
            ></a-input>
          </a-form-item>
          <a-form-item
            label="备注："
            :label-col="{ span: 2}"
            :wrapper-col="{ span: 22 }"
          >
            <a-textarea
              width="100%"

              style="width: 100%;"
              :autosize="{ minRows: 2, maxRows: 6 }"
              placeholder="请输入备注"
              v-decorator="[
                'note', {rules: [{max: 255, message: '请输入255个字以内的备注'}]}
              ]"
            />
          </a-form-item>
        </a-form>
        <div class="actions">
          <a-button type="primary" @click="cancelHandler">
            取消0
          </a-button>
          <a-button type="primary" key="submit" @click="cashHandler">
            现金退款F2
          </a-button>
          <a-button type="primary" @click="originalRoadHandler">
            原路返还F1
          </a-button>
        </div>
      </div>

      <template slot="footer">
        <!-- <a-popconfirm title="确认放弃已填写的信息？" @confirm="handleOk">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
        </a-popconfirm> -->
        <a-button key="back" @click="handleOk">关闭</a-button>
        <a-button type="primary" @click="handleOk">
          确定
        </a-button>
      </template>
    </a-modal>
    <a-modal
      title="打印小票"
      v-model="ticketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
    >
      <div class="refund-ticket" id="print-box">
        <div class="ticket-header">东鸽电器-{{ $store.getters.storeInfo.name }}欢迎您</div>
        <p class="time">收款时间：{{ ticketInfo.updateTime }}</p>
        <!-- 商品信息 -->
        <div class="order-info">
          <p class="info-header">
            <span>商品</span>
            <span>金额</span>
          </p>
          <div class="info-text">
            <div>
              <p>{{ ticketInfo.skuName }}</p>
              <p>{{ ticketInfo.skuCode }} {{ ticketInfo.skuModel }}</p>
            </div>
            <div>
              {{ ticketInfo.actualPay }}
            </div>
          </div>
        </div>
        <!-- 金额 -->
        <div class="amount-list">
          <p>
            <span>合计：</span>
            <span>{{ initPrice(ticketInfo.payAmount) }}</span>
          </p>
          <p>
            <span>{{ ticketInfo.payTypeName }}</span>
            <span>{{ initPrice(ticketInfo.shouldAmount) }}</span>
          </p>
          <p>
            <span>收银员：</span>
            <span>{{ ticketInfo.guideCode }} {{ ticketInfo.guideName }}</span>
          </p>
          <p>
            <span>流水号：</span>
            <span>{{ ticketInfo.payNumber }}</span>
          </p>
        </div>
        <!-- 温馨提示 -->
        <div>
          温馨提示：{{ ticketInfo.reminder }}
        </div>
        <!-- 条形码 -->
        <div class="ticket-code">
          <VueBarcode :value="ticketInfo.payNumber" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
        </div>
      </div>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="ticketModal=false">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="printTag">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import userPhoto from '@assets/goods.png'
import moment from 'moment'
// import DepositTicket from './components/DepositTicket'
import VueBarcode from '@chenfengyuan/vue-barcode'
import print from 'print-js'

export default {
    name: 'DepositRefund',
    components: {
        VueBarcode
    },
    data () {
        return {
            //
            searchFocus: true,
            defaultActiveKey: '1',
            form: this.$form.createForm(this),
            // orderCode: '00000339', // 156560124837677
            orderCode: '156560124837677', // 00000339
            refundList: [],
            unRefundList: [],
            refundModal: false,
            refunding: {},
            applyReasonList: [],
            actionIndex: 0,
            scrollTop: 0,
            ticketModal: false,
            ticketInfo: {},
            barCodeOptions: {
                format: 'CODE128',
                displayValue: false,
                height: 50,
                background: '#ffffff',
                lineColor: '#000000'
            }
        }
    },
    mounted () {
        // this.queryCustomerDeposit()

        this.queryApplyReason()
        document.onkeydown = (e) => {
            console.log(e)
            if (this.$route.name !== 'DepositRefund') {
                return
            }
            const key = window.event.keyCode
            if (key === 9) {
                // tab
                if (this.refundModal) {
                    // e.preventDefault()
                }
            } else if (key === 112) {
                // F1
                if (this.refundModal) {
                    e.preventDefault()
                    this.cashHandler()
                }
            } else if (key === 113) {
                // F2
                if (this.refundModal) {
                    e.preventDefault()
                    this.originalRoadHandler()
                }
            } else if (key === 37 && !this.refundModal) {
                //   37	Left（左箭头）
                e.preventDefault()
                this.defaultActiveKey = '1'
            } else if (key === 38 && !this.refundModal) {
                // 38	Up（上箭头）
                e.preventDefault()
                if (this.actionIndex > 0) {
                    console.log(this.actionIndex--)
                    this.actionIndex = this.actionIndex--
                    this.scrollTop = this.scrollTop - 180
                    document.documentElement.scrollTop = this.scrollTop// 不需要加单位
                }
            } else if (key === 39 && !this.refundModal) {
                // 39	Right（右箭头）
                e.preventDefault()
                this.defaultActiveKey = '2'
            } else if (key === 40 && !this.refundModal) {
                // 40	Down（下箭头）
                e.preventDefault()
                if (this.defaultActiveKey === '1') {
                    if (this.actionIndex < this.unRefundList.length - 1) {
                        console.log(this.actionIndex++)
                        this.actionIndex = this.actionIndex++
                        this.scrollTop = this.scrollTop + 180
                        document.documentElement.scrollTop = this.scrollTop// 不需要加单位
                    }
                } else {
                    if (this.actionIndex < this.refundList.length - 1) {
                        console.log(this.actionIndex++)
                        this.actionIndex = this.actionIndex++
                        this.scrollTop = this.scrollTop + 180
                        document.documentElement.scrollTop = this.scrollTop// 不需要加单位
                    }
                }

                // this.wzPayHandle(2)
            } else if (key === 13 && !this.refundModal && !this.searchFocus) {
                // 回车 0
                console.log(this.searchFocus)

                e.preventDefault()
                if (this.defaultActiveKey === '1' && this.unRefundList.length > 0) {
                    this.refunding = this.unRefundList[this.actionIndex]
                    this.refundModal = true
                } else if (this.defaultActiveKey === '2' && this.refundList.length > 0) {
                    this.refunding = this.refundList[this.actionIndex]
                    this.refundModal = true
                }
            } else if (key === 96) {
                // 数字键盘 0
                if (this.refundModal) {
                    e.preventDefault()
                    this.cancelHandler()
                }
            }
        }
    },

    methods: {
        moment,

        /**
         * @name:价格格式化
         * @msg:
         * @param {type}
         * @return:
         */
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        callback (key) {
            console.log(key)
            this.actionIndex = 0
            this.defaultActiveKey = key
        },
        // 退款
        emitEmpty () {
            this.$refs.userNameInput.focus()
            this.orderCode = ''
        },
        // ScheduleCouponRuleDefineQueryCustomerDeposit
        queryCustomerDeposit () {
            axios({
                path: 'ScheduleCouponRuleDefineQueryCustomerDeposit',
                method: 'POST',
                body: {
                    customerCode: this.orderCode
                }
            }).then(res => {
                if (res.flag === 1 && res.data) {
                    this.unRefundList = res.data.unRefundList
                    this.unRefundList.forEach(item => {
                        const pic = item.picture ? item.picture.split(',') : ['']
                        item.pic = pic[0]
                    })
                    this.refundList = res.data.refundList
                    this.refundList.forEach(item => {
                        const pic = item.picture ? item.picture.split(',') : ['']
                        item.pic = pic[0]
                    })
                    this.actionIndex = 0
                    this.searchFocus = false
                }
            })
        },
        // 申请原因
        queryApplyReason () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'customer_deposit_reason'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.applyReasonList = res.data
                    this.applyReasonList.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                    })
                    console.log(this.applyReasonList)
                }
            })
        },
        // 搜索商品
        onSearch (e) {
            // const keyCode = window.event ? e.keyCode : e.which
            console.log('回车搜索', e)
            if (this.orderCode) {
                this.queryCustomerDeposit()
            }
        },
        onSearchFocus () {
            this.searchFocus = true
        },
        handleOk (e) {
            e.preventDefault()
            this.refundModal = false
            this.form.resetFields()
        },
        action (el) {
            console.log(el)
            this.refunding = el
            console.log(this.refunding)
            this.refundModal = true
            // const time = setTimeout(() => {
            //     this.$refs['search-input'].focus()
            //     // clearTimeout(time)
            // }, 50)
        },
        ticket (el) {
            console.log(el)
            this.ticketInfo = el
            console.log(this.ticketInfo)
            this.ticketModal = true
        },
        refundShoppingTrolley ({ reason, magneticStripe, note }) {
            axios({
                path: 'RefundRefundShoppingTrolley',
                method: 'POST',
                body: {
                    type: 3,
                    orderIds: [this.refunding.id],
                    // magneticStripe: '', // 退款码
                    payType: this.refunding.payType,
                    referNumber: this.refunding.referNumber,
                    magneticStripe,
                    reason,
                    note

                }
            }).then(res => {
                console.log(res.data)
                if (res.flag === 1) {
                    this.$message.success('退款成功')
                } else {
                    this.$message.error('退款失败')
                }
            })
        },
        // 取消
        cancelHandler () {
            this.refundModal = false
            this.form.resetFields()
        },
        // 现金退款
        cashHandler () {
            console.log('现金退款')
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    this.refundShoppingTrolley(values)
                }
            })
        },
        // 原路返回
        originalRoadHandler (e) {
            console.log('原路')
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    this.refundShoppingTrolley(values)
                }
            })
            // this.wzPay.wzTitle = '微信支付'
            // this.payType = 'shopping_pay_record_pay_type:3'

            // this.wzPay.wzTitle = '支付宝支付'
            // this.payType = 'shopping_pay_record_pay_type:2'
        },
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        }

    }

}
</script>

<style lang="less" scoped>
    .deposit-refund{
        height: 100%;
        padding: 15px;

        // background-color: #ffffff;
        .search{
            width: 100%;
            /deep/ .ant-input-prefix{
                left: 50%;
                .anticon-search{
                    color: #1890FF;
                }
            }

            /deep/ .ant-input{
                text-align: center;
                height: 44px;
                border-radius: 0;
            }
        }
        .deposit-content{
            /deep/ .ant-tabs-bar{
                text-align: center;
                border-bottom: none;
            }
            .order-list{
                margin: 0;
                padding: 0;
                width: 100%;
                li+li{
                    margin-top: 20px;
                }
                >li.active{
                    border:1px solid #1890FF;
                }
                >li{
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height:180px;
                    background-color: #ffffff;
                    .order-title{
                        height:60px;
                        border-bottom: 1px solid #EBEFF8;
                        line-height: 60px;
                        color: #333333;
                        padding-left: 15px;
                        font-size: 12px;
                        span+span{
                            margin-left: 15px;
                        }
                        .ant-btn-primary{
                            float: right;
                            margin: 13px;
                        }
                    }
                    .order-content{
                        height: 120px;
                        padding: 10px;
                        img{
                            width: 100px;
                            height: 100px;
                            float: left;
                            margin-right: 10px;
                        }
                        .order-msg{
                            // float: left;
                            display: table-cell;
                            vertical-align: middle;
                            margin-left: 10px;
                            margin-right: 16px;
                            width: 440px;
                            height: 100px;
                            p{
                                font-size: 12px;
                                color: #333333;
                                    margin: 6px 0;
                                .price{
                                    font-size: 16px;
                                    color: #1890FF;
                                }
                            }

                        }
                        .order-reason{
                            display: table-cell;
                            // float: left;
                            margin-left: 10px;
                            border-left: 1px solid #EBEFF8;
                            margin-top: 10px;
                            padding-top: 10px;
                            font-size: 12px;

                            p{
                                .lable{
                                    display: inline-block;
                                    width: 100px;
                                    text-align: right;
                                }
                            }
                        }
                    }
                }
            }
        }

    }
    .refundModal{
        p{
            font-size: 12px;
            color: #333333;
            // text-align: center;
            height: 50px;
            width: 620px;
            margin: 0 auto;
            display: flex;
            justify-content:space-between;
            .price{
                font-size: 16px;
                color: #1890FF;
            }
        }
        .ant-form{
            border-top:1px solid #E8E8E8;
            padding-top: 26px;
            /deep/  .ant-select-selection{
                border-radius: 0;
            }
            /deep/  .ant-input{
                border-radius: 0;
            }
        }
        .actions{
            width: 100%;
            text-align: center;
            .ant-btn {
                width:140px;
                height:66px;
                // background:rgba(24,144,255,1);
                border-radius:4px;
            }
            .ant-btn+.ant-btn{
                margin-left: 98px;
            }
        }
    }
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

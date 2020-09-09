<!--
 * @Description: 退款申请/继续退款/详情
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-05-27 19:09:22
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 14:03:14
 -->
<template>
  <div class="box">
    <!-- 申请单 -->
    <div class="apply-box">
      <!-- 基础信息 -->
      <div class="base-info">
        <h2>基础信息</h2>
        <a-row>
          <a-col :sm="8" :md="2" :xl="2">退款单号</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <a-input disabled v-model="refundCode"/>
          </a-col>
          <a-col :sm="8" :md="2" :xl="2" :offset="8">退款状态</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <a-input disabled v-model="refundStatus"/>
          </a-col>
        </a-row>
      </div>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="goods-info-header">
          <h2>商品信息</h2>
          <div>
            <a-button type="primary" @click="goodsQuery=true" :disabled="disableChoose">添加商品</a-button>
            <a-button type="primary" @click="openSalesOrderModal" :disabled="disableChoose">选择销售单</a-button>
            <a-button type="primary" @click="openReturnOrderModal" :disabled="disableChoose">选择承职服务联系单</a-button>
          </div>
        </div>
        <div class="goods-info-content">
          <div class="paynumber" v-show="orderList.length>0">
            <div class="paynumber-text">
              <span v-show="orderInfo.payNumber">流水号：{{ orderInfo.payNumber }}</span>
              <span>导购：{{ orderInfo.guideName }} {{ orderInfo.guideCode }}</span>
              <span>顾客：{{ customerInfo.name }}:{{ customerInfo.telephone }}</span>
            </div>
            <div class="add-customer-btn">
              <a-button type="primary" size="small" @click="addEditAddress" v-show="orderSourceFlag===0">添加顾客</a-button>
            </div>
          </div>
          <div v-if="orderSourceFlag!==0">
            <a-row class="order" v-for="(item,index) in orderList" :key="index">
              <a-col :span="12" class="order-left">
                <p>
                  <span v-show="item.originalCode">销售单号：{{ item.originalCode }}</span>
                </p>
                <div>
                  <img :src="item.pic" height="90" width="90">
                  <div class="order-info">
                    <p>
                      <span>{{ item.name }}</span>
                      <span style="float:right">{{ item.code }}</span>
                    </p>
                    <p>
                      <span>{{ item.skuProperty }}</span>
                      <span class="quantity">
                        <a-input-number size="small" v-model="item.quantity" :disabled="optionFlag!==0 || orderSourceFlag!==0" @change="quantityChangeHandler"/>
                      </span>
                    </p>
                    <p>售价：{{ initPrice(item.actualPrice) }}</p>
                  </div>
                </div>
              </a-col>
              <a-col :span="12" class="order-right">
                <div>
                  <span v-if="item.invoiceSerialNum">发票已打</span>
                  <a-button @click="delOrder(item)" :disabled="optionFlag!==0">删除</a-button>
                </div>
                <div>销售店：{{ item.storeName }}</div>
                <a-row v-if="item.stockOutName">
                  <a-col :span="12">提货方式：{{ item.stockOutName }}</a-col>
                  <a-col :span="12">提货位置：{{ item.pickStoreName }}</a-col>
                </a-row>
                <div>
                  申请原因：
                  <a-select
                    v-model="item.returnReason"
                    style="width: 120px"
                    :disabled="optionFlag!==0"
                    size="small">
                    <a-select-option v-for="(applyEl,i) in applyReasonList" :value="applyEl.configKey" :key="i">{{ applyEl.value }}</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-textarea placeholder="问题描述" :rows="2" v-model="item.returnDescription" :disabled="optionFlag!==0"/>
                </div>
              </a-col>
              <a-col :span="24" class="goods-info-footer" v-show="orderList.length>0">
                <a-col :span="6">收货人：{{ item.consigneeName }}</a-col>
                <a-col :span="6">联系电话：{{ item.consigneeTelephone }}</a-col>
                <a-col :span="12">地址：{{ item.consigneeAddress }}</a-col>
              </a-col>
            </a-row>
          </div>
          <div v-if="orderSourceFlag===0">
            <a-row class="order" v-for="(item,index) in orderList" :key="index">
              <a-col :span="12" class="order-left">
                <p>
                  <span v-show="item.originalCode">销售单号：{{ item.originalCode }}</span>
                </p>
                <div>
                  <img :src="item.pic" height="90" width="90">
                  <div class="order-info">
                    <p>
                      <span>{{ item.skuName }}</span>
                      <span style="float:right">{{ item.code }}</span>
                    </p>
                    <p>
                      <span>{{ item.skuProperty }}</span>
                      <span class="quantity">
                        <a-input-number size="small" :min="1" v-model="item.quantity" :disabled="optionFlag!==0 || orderSourceFlag!==0" @change="val => quantityChangeHandler(val, item)"/>
                      </span>
                    </p>
                    <p>售价：{{ initPrice(item.actualPrice) }}</p>
                  </div>
                </div>
              </a-col>
              <a-col :span="12" class="order-right">
                <div>
                  <span v-if="item.invoiceSerialNum">发票已打</span>
                  <a-button @click="delOrder(item)" :disabled="optionFlag!==0">删除</a-button>
                </div>
                <div>销售店：{{ item.storeName }}</div>
                <div>
                  申请原因：
                  <a-select
                    v-model="item.returnReason"
                    style="width: 120px"
                    size="small">
                    <a-select-option v-for="(applyEl,i) in applyReasonList" :value="applyEl.configKey" :key="i">{{ applyEl.value }}</a-select-option>
                  </a-select>
                </div>
                <div>
                  <a-textarea placeholder="问题描述" :rows="2" v-model="item.returnDescription" :disabled="optionFlag!==0"/>
                </div>
              </a-col>
              <a-col :span="24" class="goods-info-footer" v-show="orderList.length>0">
                <a-col :span="6">收货人：{{ item.consigneeName }}</a-col>
                <a-col :span="6">联系电话：{{ item.consigneeTelephone }}</a-col>
                <a-col :span="12">地址：{{ item.consigneeAddress }}</a-col>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
      <!-- 促销记录 -->
      <div class="activity-info" v-if="activityList.length>0">
        <Promotion :orderIds="orderIds"/>
      </div>
      <!-- 收款记录 -->
      <div class="receive-info" v-if="payRecord.length>0">
        <h2>交易记录</h2>
        <p v-for="(item, index) in payRecord" :key="index">
          <span class="pay-name">{{ item.payTypeName }}：</span>
          <span style="margin-right:10px;">{{ initPrice(item.payAmount) }}</span>
          <!-- <span>{{ item.finish === 2 ? '(已退款)' : '(未退款)' }}</span> -->
        </p>
      </div>
      <!-- 退款记录 -->
      <!-- <div class="refund-info" v-if="refundRecord.length>0">
        <h2>退款记录</h2>
        <p v-for="(item,index) in refundRecord" :key="index">
          <span class="pay-name">{{ item.payTypeName }}</span>
          <span>{{ initPrice(item.payAmount) }}</span>
        </p>
      </div> -->
      <!-- 金额 -->
      <div class="amount-info">
        <div>
          <span>实退金额：</span>
          <a-input-number
            :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
            :max="actualMaxAmount"
            v-model="acturalRefund"
            @change="actualAmountChange"
            :disabled="optionFlag!==0"
            class="actual-style"
          />
        </div>
        <div>
          <span>应退金额</span> ：{{ initPrice(shouldRefund) }}
        </div>
        <a-textarea placeholder="请输入备注信息" :rows="2" v-model="note" :disabled="optionFlag!==0"/>
      </div>
      <!-- 退款方式 -->
      <div class="refund-methods">
        <a-button type="primary" :disabled="disableScanPay" @click="openRefundModal(0)">扫码</a-button>
        <a-button type="primary" :disabled="disableCashPay" @click="openRefundModal(1)">现金</a-button>
      </div>
    </div>
    <!-- 选择承职服务单 -->
    <SalesOrderList :salesOrderVisible="salesOrderVisible" @cancelChooseOrders="cancelChooseOrders" @setSalesOrder="setSalesOrder" ref="salesOrder"></SalesOrderList>
    <ReturnOrderList :returnOrdersVisible="returnOrdersVisible" @cancelReturnOrders="cancelReturnOrders" @setReturnOrder="setReturnOrder" ref="returnOrder"></ReturnOrderList>
    <!-- 新增/编辑用户信息 -->
    <a-modal
      :title="addEditAddressTitle"
      v-model="addEditAddressModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelAddCustomer">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="confirmAddCustomer">
          确定
        </a-button>
      </template>
      <a-form :form="userForm">
        <a-row class="doc">
          <a-col :span="4">电话:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone', {initialValue:customerInfo.telephone || '', validateTrigger:'blur'}, queryCustomer)"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name', {initialValue:customerInfo.name || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">性别:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.sex', {initialValue:customerInfo.sex || 0})" >
                <a-radio :value="0">
                  男
                </a-radio>
                <a-radio :value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入详细地址" v-decorator="$check('customer.address', {initialValue:customerInfo.address || ''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、楼牌号等" v-decorator="$check('customer.addressDetail', {initialValue:customerInfo.addressDetail || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">默认收货地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.isDefault', {initialValue:customerInfo.isDefault || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragCustomerMap" :mapWidth="'100%'" :mapHeight="'300px'" :zoom="13"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 商品选择器 -->
    <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple></goods>
    <!-- 现金退款弹框 -->
    <a-modal
      :title="refundTitle"
      v-model="refundModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button @click="cashCancel">取消</a-button>
        <a-button type="primary" @click="handleRefund">
          确定
        </a-button>
      </template>
      <div>
        <div v-if="refundTitle!=='扫码退款'">
          <a-row>
            <a-col :span="3">退款金额：</a-col>
            <a-col :span="21">{{ initPrice(acturalRefund) }}</a-col>
          </a-row>
        </div>
        <div v-if="refundTitle==='扫码退款'">
          <p>请扫描付款码</p>
          <a-row>
            <a-col :span="3" style="height:32px;line-height:32px;">商户单号：</a-col>
            <a-col :span="21">
              <a-input v-model="magneticStripe" placeholder="请扫描退款码"/>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
    <!-- 扫码退款 -->
  </div>
</template>

<script>
import SalesOrderList from './SalesOrderList'
import ReturnOrderList from './ReturnOrderList'
import goods from '@pages/marketing/MarketingScheduleManagement/components/goods'
import Amap from '@comp/Amap'
import Promotion from '@pages/marketing/RetailManagement/components/Promotion'
import { axios } from '@/utils/request'

export default {
    name: 'Refund',
    components: {
        SalesOrderList,
        ReturnOrderList,
        goods,
        Amap,
        Promotion
    },
    props: {
        optionFlag: {
            type: Number,
            required: true
        },
        payNumber: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            salesOrderVisible: false,
            goodsVisible: false,
            returnOrdersVisible: false,
            addEditAddressModal: false,
            isAdd: true,
            customerInfo: {},
            loading: false,
            userForm: this.$form.createForm(this),
            userAddress: [],
            addEditAddressTitle: '',
            // 商品选择器
            goodsQuery: false,
            // 退款单来源标识 0-添加商品/1-添加销售单/2-添加承职单
            orderSourceFlag: -1,
            disableCashPay: true,
            disableScanPay: true,
            disableChoose: false,
            orderList: [],
            orderInfo: {},
            // 收款记录
            payRecord: [],
            // 促销活动记录
            activityList: [],
            // 应退金额
            shouldRefund: 0,
            //
            acturalRefund: 0,
            payAmount: 0,
            balanceAmount: 0,
            // 备注信息：
            note: '',
            // 退款单code
            refundedCode: [],
            // 销售单code
            orderIds: [],
            isFirst: true,
            refundModal: false,
            refundTitle: '',
            payType: '',
            refundCode: '',
            refundStatus: '',
            // 付款条形码
            magneticStripe: '',
            lastTime: new Date().getTime(),
            nextTime: new Date().getTime(),
            lastCode: '',
            nextCode: '',
            actualMaxAmount: 0,
            applyReasonList: [],
            ifReturn: false
        }
    },
    mounted () {
        if (this.optionFlag !== 0) {
            this.isFirst = false
            this.queryRefundDetail()
            if (this.optionFlag === 1) {
                this.refundStatus = '退款中'
            } else {
                this.refundStatus = '已退款'
            }
        } else {
            this.orderInfo = {
                guideCode: this.$store.getters.userInfo.code,
                guideName: this.$store.getters.userInfo.name
            }
        }
        console.log('传入数据：', this.optionFlag, this.payNumber)
    },
    methods: {
        actualAmountChange (val) {
            this.payAmount = val
        },
        async openRefundModal (flag) {
            if (this.orderSourceFlag === 1) {
                await this.queryIfReturn()
                if (this.ifReturn) {
                    if (flag === 0) {
                        this.refundTitle = '扫码退款'
                        this.payType = ''
                    } else {
                        this.refundTitle = '现金退款'
                        this.payType = 'shopping_pay_record_pay_type:10'
                    }
                    this.refundModal = true
                } else {
                    self.refundModal = false
                    this.magneticStripe = ''
                }
            } else {
                if (flag === 0) {
                    this.refundTitle = '扫码退款'
                    this.payType = ''
                } else {
                    this.refundTitle = '现金退款'
                    this.payType = 'shopping_pay_record_pay_type:10'
                }
                this.refundModal = true
            }
        },
        // 数量变更退款金额重新计算
        quantityChangeHandler (quantity, order) {
            console.log('数量变化：', quantity, order)
            this.shouldRefund = this.acturalRefund = 0
            this.orderList.forEach(item => {
                if (item.code === order.code) {
                    item.quantity = quantity
                }
            })
            this.orderList.forEach(item => {
                this.acturalRefund += Number(item.actualPrice) * Number(item.quantity)
            })
            this.shouldRefund = this.acturalRefund
        },
        // 编辑/详情--根据退款单号查询退款单详情
        queryRefundDetail () {
            const self = this
            axios({
                path: 'RefundQueryRefund',
                method: 'POST',
                body: {
                    payNumber: self.payNumber,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(async res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.isFirst = false
                    // 初始化顾客信息
                    data.name = data.customerName
                    this.customerInfo = data
                    // 初始化订单信息
                    this.orderInfo = {
                        guideCode: data.guideCode,
                        guideName: data.guideName,
                        payNumber: data.originalPayNumber
                    }
                    // 初始化订单列表
                    data.shoppingTrolleyDetailList.forEach(item => {
                        item.actualPrice = item.skuActualPrice
                        item.unitPrice = item.skuUnitPrice
                        item.storeName = this.$store.getters.storeInfo.name
                        item.quantity = item.skuQuantity
                        item.name = item.skuName
                        // item.pic = item.skuPicture.split(',')[0]
                    })
                    this.orderList = data.shoppingTrolleyDetailList
                    const refundOrderIds = []
                    this.orderList.forEach(item => {
                        if (item.originalCode) {
                            this.orderIds.push(item.originalCode)
                        }
                        this.refundedCode.push(item.code)
                        refundOrderIds.push(item.code)
                    })

                    this.refundedCode = refundOrderIds
                    await this.queryPayRecord(this.orderIds)
                    this.disableChoose = true
                    this.refundCode = data.payNumber
                    this.note = this.orderList[0].note
                    if (this.optionFlag === 2) {
                        this.shouldRefund = data.shouldRefundAmount
                        this.acturalRefund = data.actualRefundAmount
                    }
                }
            })
        },
        // 取消现金退款
        cashCancel () {
            this.refundModal = false
            this.payAmount = 0
            this.magneticStripe = ''
        },
        async queryIfReturn () {
            const self = this
            const orderIds = []
            this.orderList.forEach(item => {
                orderIds.push(item.originalCode)
            })
            const res = await axios({
                path: 'RefundQueryIfReturn',
                method: 'POST',
                body: {
                    storeId: self.$store.getters.storeInfo.code,
                    orderIds: orderIds
                }
            })
            if (res.flag === 1) {
                self.ifReturn = true
            } else {
                self.ifReturn = false
            }
        },
        handleRefund () {
            if (this.isFirst) {
                this.addRefund()
            } else {
                this.refund()
            }
        },
        refund () {
            let params = {}
            if (this.payType !== '') {
                params = {
                    guideCode: this.orderInfo.guideCode,
                    guideName: this.orderInfo.guideName,
                    customerId: this.customerInfo.customerId,
                    shouldAmount: this.shouldRefund,
                    payAmount: this.acturalRefund,
                    balanceAmount: this.acturalRefund,
                    actualAmount: this.acturalRefund,
                    orderIds: this.refundedCode,
                    storeId: this.$store.getters.storeInfo.code,
                    paymentNo: this.orderInfo.payNumber,
                    payType: this.payType,
                    type: 0
                }
            } else {
                params = {
                    guideCode: this.orderInfo.guideCode,
                    guideName: this.orderInfo.guideName,
                    shouldAmount: this.shouldRefund,
                    actualAmount: this.shouldRefund,
                    customerId: this.customerInfo.customerId,
                    orderIds: this.refundedCode,
                    storeId: this.$store.getters.storeInfo.code,
                    magneticStripe: this.magneticStripe,
                    paymentNo: this.orderInfo.payNumber,
                    payType: this.payType,
                    type: 1
                }
            }
            axios({
                path: 'RefundRefundShoppingTrolley',
                method: 'POST',
                body: params
            }).then(res => {
                if (res.flag === 1) {
                    console.log('退款', res.data)
                    if (this.orderSourceFlag !== 1) {
                        this.isFirst = true
                        this.$emit('closeApplyModal')
                    } else {
                        this.refundModal = false
                        this.magneticStripe = ''
                        this.refundCode = res.data.payNumber
                        this.refundStatus = '已退款'
                        this.queryPayRecord(this.orderIds)
                    }
                }
            })
        },
        async completeRefund () {
            const res = await axios({
                path: 'RefundRefundSuccessHandle',
                method: 'POST',
                body: {
                    orderIds: this.refundedCode
                }
            })
            if (res.flag === 1) {
                console.log('付款完成：', res.data)
            }
        },
        // 添加退款申请
        addRefund () {
            console.log('this.orderList: ', this.orderList)
            const shoppingTrolleyRequestList = []
            this.orderList.forEach((item, index) => {
                console.log(item)
                const temp = {}
                const shoppingTrolley = {
                    originalCode: item.originalCode,
                    storeCode: item.storeCode,
                    storeId: item.storeId,
                    guideCode: item.guideCode,
                    guideName: item.guideName,
                    note: this.note,
                    customerName: item.customerName,
                    customerTelephone: item.customerTelephone,
                    customerAddressId: item.customerAddressId,
                    consigneeName: item.consigneeName,
                    consigneeTelephone: item.consigneeTelephone,
                    consigneeAddress: item.consigneeAddress,
                    consigneeLatitude: item.consigneeLatitude,
                    consigneeLongitude: item.consigneeLongitude
                }
                const shoppingTrolleySkuList = []
                shoppingTrolleySkuList[0] = {
                    name: item.skuName,
                    model: item.skuModel,
                    code: item.code,
                    rate: item.rate,
                    taxRate: item.taxRate,
                    skuPrice: item.skuPrice,
			              unitPrice: item.unitPrice,
			              actualPrice: item.actualPrice,
                    quantity: item.quantity,
                    businessType: item.businessType,
                    contractCode: item.contractCode,
                    isGroupFlag: 0,
                    ifStock: item.ifStock,
                    priceCost: item.priceCost,
			              returnDescription: item.returnDescription,
			              returnReason: item.returnReason,
                    skuProperty: item.skuProperty,
			              classCode: item.classCode,
			              className: item.className,
			              brandCode: item.brandCode,
			              brandName: item.brandName,
			              providerCode: item.providorCode,
			              providerName: item.providorName
                }
                temp.shoppingTrolley = shoppingTrolley
                temp.shoppingTrolleySkuList = shoppingTrolleySkuList
                shoppingTrolleyRequestList.push(temp)
                console.log(shoppingTrolleyRequestList)
            })
            axios({
                path: 'RefundAddRefund',
                method: 'POST',
                body: {
                    shoppingTrolleyRequestList
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('添加退款单申请：', res.data)
                    this.isFirst = false
                    this.refundedCode = res.data
                    this.refund()
                }
            })
        },
        // 商品选择器选中商品
        onSelectAddGoods (addStoreArr) {
            console.log('addStoreArr', addStoreArr)
            this.queryApplyReason()
            this.orderSourceFlag = 0
            this.disableChoose = true
            this.disableCashPay = false
            this.disableScanPay = true
            const newData = [...this.orderList]
            const error = []
            addStoreArr.forEach(item => {
                const has = newData.filter(o => o.skuCode === item.skuCode)
                if (has.length === 0) {
                    this.orderList.push({
                        payNumber: '',
                        returnReason: '',
                        returnDescription: '',
                        storeCode: this.$store.getters.storeInfo.code,
                        storeId: this.$store.getters.storeInfo.id,
                        storeName: this.$store.getters.storeInfo.name,
                        code: item.skuCode,
                        skuName: item.skuName,
                        skuModel: item.skuModel,
                        skuProperty: item.skuProperty,
                        rate: item.skuDRate,
                        taxRate: item.skuTaxRate,
                        unitPrice: item.skuPrice,
                        priceCost: item.skuPtCost,
                        businessType: item.businessType,
                        contractCode: item.code,
                        quantity: 1, // 数量
                        isGroupFlag: 0,
                        ifStock: `${item.isStock}`,
                        actualPrice: item.skuPrice,
                        providorCode: item.providerCode,
                        providorName: item.providerName,
                        classCode: item.classCode,
			                  className: item.className,
			                  brandCode: item.brandCode,
                        brandName: item.brandName,
                        consigneeAddress: '',
                        consigneeName: '',
                        consigneeTelephone: '',
                        consigneeLatitude: '',
                        consigneeLongitude: '',
                        customerName: '',
                        customerTelephone: '',
                        customerAddressId: '',
                        guideCode: this.$store.getters.userInfo.code,
                        guideName: this.$store.getters.userInfo.name,
                        note: ''
                    })
                } else {
                    error.push(item.skuCode)
                }
            })
            console.log('this.orderList:', this.orderList)
            this.orderList.forEach(item => {
                this.acturalRefund = this.shouldRefund += (item.actualPrice * item.quantity)
                this.actualMaxAmount = Number.MAX_SAFE_INTEGER
            })
            this.orderInfo.guideCode = this.$store.getters.userInfo.code
            this.orderInfo.guideName = this.$store.getters.userInfo.name
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        // 设置添加销售单数据
        setSalesOrder (data) {
            this.orderIds = []
            console.log('销售单传入的值：', data)
            this.orderSourceFlag = 1
            this.disableChoose = true
            this.disableCashPay = false
            this.disableScanPay = false
            this.customerInfo = data[0]
            this.orderInfo = data[1]
            this.orderList = data[2]
            this.orderList.forEach(item => {
                this.orderIds.push(item.originalCode)
                this.acturalRefund += (Number(item.actualPrice) * Number(item.quantity))
                this.actualMaxAmount = this.acturalRefund
            })
            console.log(this.acturalRefund)
            this.queryPayRecord()
            this.queryApplyReason()
        },
        // 设置添加承职服务单数据
        setReturnOrder (data) {
            this.orderIds = []
            console.log('承职单传入的值：', data)
            this.orderSourceFlag = 2
            this.disableChoose = true
            this.disableCashPay = false
            this.disableScanPay = true
            this.customerInfo = data[0]
            this.orderInfo = data[1]
            this.orderList = data[2]
            this.orderList.forEach(item => {
                this.orderIds.push(item.code)
                this.acturalRefund = this.shouldRefund = this.payAmount = this.balanceAmount += (Number(item.actualPrice) * Number(item.quantity))
            })
            this.queryApplyReason()
        },
        // 查询收款/退款记录
        async queryPayRecord () {
            this.acturalRefund = this.payAmount = this.shouldRefund = this.balanceAmount = 0
            let orderIds = []
            if (this.orderIds.length > 0) {
                orderIds = [...this.orderIds, ...this.refundedCode]
            } else {
                orderIds = this.refundedCode
            }
            const res = await axios({
                path: 'ShoppingPayRecordQueryTradePayRecord',
                method: 'POST',
                body: {
                    orderIds: orderIds
                }
            })
            if (res.flag === 1) {
                this.acturalRefund = 0
                const data = res.data.shoppingPayRecords
                if (this.optionFlag !== 2) {
                    const temp = data.filter(item => item.finish !== 2)
                    if (temp.length === 0) {
                        this.completeRefund()
                        this.disableCashPay = this.disableScanPay = true
                        this.$emit('closeApplyModal')
                    } else {
                        this.disableCashPay = false
                        const scanArr = temp.filter(item => item.payTypeName === '支付宝支付' || item.payTypeName === '微信支付')
                        if (scanArr.length > 0) {
                            this.disableScanPay = false
                        } else {
                            this.disableScanPay = true
                        }
                    }
                }
                data.forEach(item => {
                    this.actualMaxAmount = this.acturalRefund = this.payAmount = this.shouldRefund = this.balanceAmount += item.payAmount
                })
                this.payRecord = data
            }
        },
        // 根据手机号查询顾客信息
        queryCustomer (rule, value, callback) {
            console.log(value)
            const self = this
            if (value) {
                axios({
                    path: 'CustomerManageQueryInfo',
                    method: 'post',
                    body: {
                        telephone: value
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data.length > 0) {
                            this.isAdd = false
                            this.addEditAddressTitle = '编辑顾客地址'
                            const data = res.data[0]
                            data.customerName = data.consigneeName = data.name
                            data.customerTelephone = data.consigneeTelephone = data.telephone
                            data.consigneeAddress = data.address
                            data.consigneeAddressDetail = data.addressDetail
                            data.consigneeLongitude = data.latitude
                            data.consigneeLatitude = data.longitude
                            data.customerAddressId = data.id
                            this.customerInfo = data
                            console.log('根据手机号查出的顾客', this.customerInfo)
                            self.userForm.setFieldsValue({ 'telephone': data.telephone, 'name': data.name, 'sex': data.sex, 'address': data.address, 'addressDetail': data.addressDetail })
                        } else {
                            this.isAdd = true
                            this.addEditAddressTitle = '新增顾客地址'
                            this.customerInfo = {}
                            self.userForm.setFieldsValue({ 'name': '', 'sex': '', 'address': '', 'addressDetail': '' })
                        }
                    }
                })
            }
            callback()
        },
        // 添加顾客拖动地图
        dragCustomerMap (data) {
            this.userForm.setFieldsValue({
                address: data.address
            })
            this.customerInfo.latitude = data.position.lat
            this.customerInfo.longitude = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
            this.customerInfo.address = data.address
            console.log('拖动地图后的customerInfo:', this.customerInfo)
        },
        // 关闭添加顾客模态框
        cancelAddCustomer () {
            this.addEditAddressModal = false
        },
        // 提交添加顾客信息
        confirmAddCustomer (e) {
            const self = this
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    this.customerInfo = { ...this.customerInfo, ...values }
                    if (this.isAdd) {
                        const customerAddress = [{}]
                        customerAddress[0] = { ...this.customerInfo }
                        customerAddress[0].isDefault = 1
                        this.customerInfo.customerAddress = [ ...customerAddress ]
                    }
                    axios({
                        path: self.isAdd ? 'CustomerManageAddCustomerAndAddress' : 'CustomerManageUpdateCustomer',
                        method: 'post',
                        body: self.customerInfo
                    }).then(res => {
                        if (res.flag === 1) {
                            const data = res.data
                            data.customerName = data.consigneeName = data.name
                            data.customerTelephone = data.consigneeTelephone = data.telephone
                            data.consigneeAddress = data.address
                            data.consigneeAddressDetail = data.addressDetail
                            data.consigneeLongitude = data.latitude
                            data.consigneeLatitude = data.longitude
                            data.customerId = data.id
                            this.customerInfo = data
                            this.orderList.forEach(item => {
                                item.consigneeName = this.customerInfo.name
                                item.consigneeTelephone = this.customerInfo.telephone
                                item.consigneeAddress = this.customerInfo.address
                                item.customerId = this.customerInfo.id
                                item.consigneeLongitude = data.latitude
                                item.consigneeLatitude = data.longitude
                                item.customerName = data.name
                                item.customerTelephone = data.telephone
                            })
                            console.log('orderList', this.orderList)
                            this.addEditAddressModal = false
                        }
                        this.loading = false
                    })
                }
            })
        },
        // 删除添加的一条数据
        delOrder (orderInfo) {
            console.log('删除条目：', orderInfo)
            // this.acturalRefund = 0
            if (this.orderSourceFlag === 0) {
                this.orderList = this.orderList.filter(item => item.code !== orderInfo.code)
                this.acturalRefund = this.shouldRefund = 0
                this.orderList.forEach(item => {
                    this.acturalRefund = this.shouldRefund += (item.actualPrice * item.quantity)
                    this.actualMaxAmount = Number.MAX_SAFE_INTEGER
                })
            } else if (this.orderSourceFlag === 1) {
                this.orderList = this.orderList.filter(item => item.originalCode !== orderInfo.originalCode)
                this.disableScanPay = true
                this.acturalRefund = this.shouldRefund = 0
                this.orderList.forEach(item => {
                    this.acturalRefund = this.shouldRefund += (item.actualPrice * item.quantity)
                })
            } else {
                this.orderList = this.orderList.filter(item => item.code !== orderInfo.code)
            }
            if (this.orderList.length === 0) {
                this.disableChoose = false
                this.disableCashPay = true
                this.disableScanPay = true
                this.acturalRefund = this.shouldRefund = 0
                this.payRecord = []
                this.note = ''
                this.customerInfo = {}
                this.orderInfo = {}
                if (this.orderSourceFlag === 1) {
                    this.$refs.salesOrder.clear()
                } else if (this.orderSourceFlag === 2) {
                    this.$refs.returnOrder.clear()
                }
                this.orderSourceFlag = -1
                console.log('订单全部删除：', this.orderList, this.acturalRefund, this.shouldRefund)
            }
        },
        // 打开销售单列表模态框
        openSalesOrderModal () {
            this.salesOrderVisible = true
        },
        // 关闭销售单列表
        cancelChooseOrders (val) {
            this.salesOrderVisible = val
        },
        // 确认选中销售单
        confirmOrders () {
            this.salesOrderVisible = true
        },
        // 新增/编辑顾客
        addEditAddress () {
            if (JSON.stringify(this.customerInfo) !== '{}') {
                this.addEditAddressTitle = '编辑顾客信息'
                this.isAdd = false
            } else {
                this.addEditAddressTitle = '新增顾客信息'
                this.isAdd = true
            }
            this.addEditAddressModal = true
        },
        // 选择顾客地址信息
        chooseAddress (index, id) {
            this.addressNow = index
            if (this.addressNow === this.addressPre) {
                // 取消选中
                this.isAddressActive = this.addressPre = -1
            } else {
                // 选中
                this.isAddressActive = this.addressPre = index
            }
        },
        // 打开承职服务联系单模态框
        openReturnOrderModal () {
            this.returnOrdersVisible = true
        },
        // 关闭承职服务联系单模态框
        cancelReturnOrders (val) {
            this.returnOrdersVisible = val
        },
        // 确认选中承职单
        confirmReturnOrders () {
            this.returnOrdersVisible = false
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        queryApplyReason () {
            axios({
                path: 'DistOriginDataQueryApplyReasonList',
                method: 'post',
                body: {}
            }).then(res => {
                if (res.flag === 1) {
                    this.applyReasonList = res.data
                    this.applyReasonList.forEach(el => {
                        el.configKey = el.configKey + ''
                    })
                    console.log(this.applyReasonList)
                }
            })
        }
    }
}
</script>

<style lang="less">
@import "../../../../assets/modalStyle.less";
</style>

<style lang="less" scoped>
h2 {
  margin: 0;
}
.apply-box {
  &>div {
    border: 1px solid #ccc;
    margin-bottom: -1px;
    padding: 10px;
  }
  // 商品信息
  .goods-info {
    padding: 0;
    &-header {
      display: flex;
      padding: 10px;
      justify-content: space-between;
      border-bottom: 1px solid #ccc;
      .ant-btn {
        margin-left: 10px;
      }
    }
    &-content {
      .paynumber {
        display: flex;
        justify-content: space-between;
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
        border-bottom: 1px solid #ccc;
        &-text {
          span {
            margin-right: 40px;
          }
        }
      }
      .order {
        border-bottom: 1px solid #ccc;
        margin-top: -1px;
        .order-left {
          padding: 10px;
          &>p {
            height: 35px;
            line-height: 35px;
            margin: 0;
          }
          div {
            display: flex;
            img {
              display: block;
              height: 90px;
              width: auto;
            }
            .order-info {
              display: block;
              flex: 2;
              padding-left: 20px;
              .quantity {
                float: right;
              }
            }
          }
        }
        .order-right {
          padding: 10px;
          border-left: 1px solid #ccc;
          div {
            margin-bottom: 10px;
          }
          .ant-btn {
            float: right;
          }
        }
      }
    }
    &-footer {
      line-height: 30px;
      border-top: 1px solid #ccc;
      padding: 0 10px;
      .ant-col-6,
      .ant-col-12 {
        font-weight: 400;
        text-align: left;
      }
    }
  }
  // 促销记录
  .activity-info {
    .ant-col-12 {
      text-align: center;
      .activity-name {
        color: #1890ff;
        text-align: right;
      }
      .ant-col-16 {
        padding-left: 10px;
        text-align: left;
      }
    }
    .activity-left {
      border-right: 1px solid #ccc;
    }
  }
  //收款记录
  .receive-info {
    p{
      text-align: right;
      .pay-name {
        display: inline-block;
        width: 100px;
        text-align: right;
        color: #1890ff;
      }
    }
  }
  // 退款记录
  .refund-info {
    p{
      text-align: right;
      .pay-name {
        display: inline-block;
        width: 100px;
        text-align: right;
        color: #1890ff;
      }
    }
  }
  // 金额
  .amount-info {
    &>div {
      display: inline-block;
      margin-right: 20px;
      margin-bottom: 10px;
      span {
        font-size: 21px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
    }
  }
  // 退款方式
  .refund-methods {
    .ant-btn {
      margin-right: 10px;
    }
  }
}
.search-box {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  .left {
    flex: 1;
    display: flex;
    div {
      width: 80px;
      height: 32px;
      line-height: 32px;
    }
  }
  .right {
    flex: 2;
    text-align: right;
  }
}
.list-box {
  padding-top: 20px;
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
  .customer-address {
    font-size: 12px;
    position:relative;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    .address-left {
      display: inline-block;
      width: 90px;
      border:1px dotted #eee;
      margin-right: 10px;
      text-align: center
    }
    .address-right {
      padding: 0 2px;
      background: #aaa;
      color: #fff;
      margin-left:10px;
    }
    .default {
      background: rgb(56,173,255);
      color: #fff;
    }
    .address-opts {
      position: absolute;
      right:10px;
      a {
        text-decoration: none;
        margin-left: 10px;
        color: rgb(56,173,255);
      }
    }
  }
}
.actual-style {
  min-width: 120px;
}
</style>

<!--
 * @Description: 订单列表
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-20 13:51:39
 * @LastEditors: haile
 * @LastEditTime: 2019-08-23 17:06:13
 -->
<template>
  <div class="box">
    <a-row>
      <a-col :span="16" :offset="4">
        <a-button style="height: 40px;" @click="toSettlePage">
          <a-icon type="left" />返回
        </a-button>
        <a-input-search
          placeholder="请输入导购/顾客/订单号"
          @search="onSearch"
          v-model="searchCondition"
          enterButton
          size="large"
          style="width:80%;margin-left:5%;margin-bottom:20px"/>
        <a-tabs @change="callback" type="card">
          <a-tab-pane :tab="`待结算(${orderNums.unsettledOrdersCount})`" key="1">
            <a-card :title="item.nameAndPhone" v-for="(item,index) in unsettledOrders" :key="index">
              <!-- 顾客对应商品列表 -->
              <a-checkbox-group @change="checkChangeHandler(item)" v-model="checkedObj[item.customerCode]">
                <div class="goods" v-for="(goods,i) in item.shoppingTrolleySkuResponseList" :key="i">
                  <a-row>
                    <a-col :span="1" style="padding:35px 0"><a-checkbox :value="goods" :disabled="goods.disabled"></a-checkbox></a-col>
                    <!-- 商品图片 -->
                    <a-col :span="3" style="padding:0 10px;display:flex;align-items:center;height:99px">
                      <!-- <img :src="goods.skuPicture" style="display:block;width:100%;height:auto;"> -->
                      <img style="display:block;width:100%;height:auto;" v-if="goods.mainGoodsPic[0]" :src="goods.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="goods.skuName">
                      <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="goods.skuName">
                    </a-col>
                    <!-- 商品信息 -->
                    <a-col :span="10">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    </a-col>
                    <!-- 商品数量和库存 -->
                    <a-col :span="4" style="padding-top:20px">
                      <!-- <a-input-number :min="1" :max="10" :defaultValue="Number(goods.skuQuantity)" @change="quantityChangeHandler" /> -->
                      <pre>购买数量：{{ goods.skuQuantity }}</pre>
                      <!-- <pre>库    存：{{ goods.skuInventory }}</pre> -->
                    </a-col>
                    <!-- 商品操作 -->
                    <a-col :span="6" class="right">
                      <p>
                        <a href="#" :class="(isActiveCustomer===index)&&(isActiveaClass===i)&&isActivea?'active':''" @click="handleClick(0, i, index, goods, item.customerId)">详情</a>
                        <!-- <a href="#" :class="(isActiveCustomer===index)&&(isActivebClass===i)&&isActiveb?'active':''" @click="handleClick(1, i, index, goods, item.customerId)">编辑</a> -->
                        <a href="#" v-action:delete :class="(isActiveCustomer===index)&&(isActivecClass===i)&&isActivec?'active':''" @click="handleClick(2, i, index,goods)">删除</a>
                      <!-- <a href="#" :class="{active: isActived}" @click="handleClick(3)">配送</a> -->
                      </p>
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.updateTime }}</p>
                    </a-col>
                  </a-row>
                </div>
              </a-checkbox-group>
              <template slot="actions">
                <div class="unsettle-footer">
                  <div class="checkall">
                    <a-checkbox @change="onCheckAllChange(item, $event)" :indeterminate="item.indeterminate" :checked="item.checkAll">全选</a-checkbox>
                  </div>
                  <div class="unsettle-right">
                    <div>
                      收款金额：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ Number(item.totalPrice).toFixed(2) }}</span>
                    </div>
                    <a-button type="primary" v-action:query @click="toSettle(0,item)">收款</a-button>
                  </div>
                </div>
              </template>
            </a-card>
          </a-tab-pane>
          <!-- <a-tab-pane :tab="`未支付(${orderNums.unpayOrdersCount})`" key="2">
            <a-card :title="item.nameAndPhone" v-for="item in unpayOrders" :key="item.customerId">
              <div class="payNumberBox" v-for="payNumber in item.shoppingTrolleySkuResponseList" :key="payNumber.payNumber">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="toPrintTicket(0, payNumber)">补打小票</a>
                  </div>
                </div>
                <div class="goods" v-for="(goods, index) in payNumber.shoppingTrolleyDetailList" :key="index">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px;display:flex;align-items:center;height:99px;">
                      <img style="display:block;width:100%;height:auto;" v-if="goods.mainGoodsPic[0]" :src="goods.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="goods.skuName">
                      <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="goods.skuName">
                    </a-col>
                    <a-col :span="12">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="right" style="padding-top:20px">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.updateTime }}</p>
                    </a-col>
                  </a-row>
                </div>
                <div class="payNumber-pay">
                  <div>
                  </div>
                  <div class="pay-right">
                    <div>
                      收款金额：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ initPrice(Number(payNumber.shoppingPayRecordVO.shouldAmount)) }}</span>
                    </div>
                    <a-button type="primary" @click="toSettle(1,item,payNumber)">收款</a-button>
                  </div>
                </div>
              </div>
            </a-card>
          </a-tab-pane> -->
          <a-tab-pane :tab="`未完成(${orderNums.uncompletedOrdersCount})`" key="3">
            <a-card :title="item.nameAndPhone" v-for="item in uncompletedOrders" :key="item.customerId">
              <div class="payNumberBox" v-for="(payNumber,index) in item.shoppingTrolleySkuResponseList" :key="index">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="getPayRecord(payNumber)" class="payRecord">收款记录</a>
                  </div>
                </div>
                <div class="goods" v-for="(goods, i) in payNumber.shoppingTrolleyDetailList" :key="i">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px;display:flex;align-items:center;height:99px;">
                      <img style="display:block;width:100%;height:auto;" v-if="goods.mainGoodsPic[0]" :src="goods.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="goods.skuName">
                      <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="goods.skuName">
                    </a-col>
                    <a-col :span="12">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="order-info">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.updateTime }}</p>
                    </a-col>
                  </a-row>
                </div>
                <div class="payNumber-pay">
                  <div>
                    已支付：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ initPrice(Number(payNumber.shoppingPayRecordVO.totalPay)) }}</span>
                  </div>
                  <div class="pay-right">
                    <div>
                      尾款金额：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ initPrice(Number(payNumber.shoppingPayRecordVO.shouldAmount-payNumber.shoppingPayRecordVO.totalPay)) }}</span>
                    </div>
                    <a-button type="primary" @click="toSettle(1,item,payNumber)">继续收款</a-button>
                  </div>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :tab="`已完成(${orderNums.completedOrdersCount})`" key="4">
            <a-card :title="item.nameAndPhone" v-for="item in completedOrders" :key="item.customerId">
              <div class="payNumberBox" v-for="payNumber in item.shoppingTrolleySkuResponseList" :key="payNumber.payNumber">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="getPayRecord(payNumber)" class="payRecord">收款记录</a>
                    <a href="#" @click="toPrintTicket(1, payNumber)">补打小票</a>
                  </div>
                </div>
                <div class="goods" v-for="goods in payNumber.shoppingTrolleyDetailList" :key="goods.id">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px;display:flex;align-items:center;height:99px;">
                      <img style="display:block;width:100%;height:auto;" v-if="goods.mainGoodsPic[0]" :src="goods.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="goods.skuName">
                      <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="goods.skuName">
                    </a-col>
                    <a-col :span="10">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="order-info">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.updateTime }}</p>
                    </a-col>
                    <a-col :span="2" style="padding-top:35px">
                      <a href="#" @click="showInvoiceList(item, goods)" v-if="goods.returnedFlag==='0'">补打发票</a>
                      <a href="#" @click="invoiceCancellation(payNumber.payNumber, goods)" v-else>补冲发票</a>
                    </a-col>
                    <div class="returned" v-if="goods.returnedFlag==='1'">
                      <img src="@assets/refunded_icon.png" width="50" height="50">
                    </div>
                  </a-row>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
        <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
          <a-pagination
            :pageSizeOptions="pageSizeOptions"
            :total="total"
            showSizeChanger
            :pageSize="pageSize"
            v-model="current"
            @showSizeChange="onShowSizeChange"
            @change="pageChange"
          >
            <template slot="buildOptionText" slot-scope="props">
              <span v-if="props.value!=='50'">{{ props.value }}条/页</span>
              <span v-if="props.value==='50'">全部</span>
            </template>
          </a-pagination>
        </div>
      </a-col>
    </a-row>
    <!-- 流水收款记录 -->
    <a-modal
      title="收款记录"
      v-model="payRecordModal"
      :closable="false"
      :keyboard="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="() => {this.payRecordModal=false}">
          关闭
        </a-button>
      </template>
      <p v-for="(item,index) in shoppingPayRecords" :key="index">
        <span style="display:inline-block;width:150px;text-align:right;color:#1890ff;">{{ item.payTypeName }} ： </span>
        <span>{{ initPrice(item.payAmount) }}</span>
      </p>
    </a-modal>
    <!-- 补打小票 -->
    <a-modal
      title="小票打印"
      v-model="ticketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button type="primary" @click="ticketModal = false">取消</a-button>
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box" style="width:400px;">
        <Ticket :ticketInfo="ticketInfo"></Ticket>
      </div>
    </a-modal>
    <a-modal
      title="小票打印"
      v-model="cashTicketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button type="primary" @click="cashTicketModal = false">取消</a-button>
        <a-button @click="printCahsTicket" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-cashTicket" style="width:400px;">
        <CashTicket :ticketInfo="ticketInfo"></CashTicket>
      </div>
    </a-modal>
    <!-- 发票组件 -->
    <Invoice :customerInfo="currentCustomer" :openFlag="openFlag" :orderIds="orderCodeList" :operationType="2" @setOpenFlag="setOpenFlag"></Invoice>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import goodsPhoto from '@assets/goods.png'
import CashTicket from '../components/CashTicket'
import Ticket from '../components/Ticket'
import Invoice from '../Settle/Invoice'
import print from 'print-js'
const unPayStatus = 'shopping_trolley_status:2'
const unCompleteStatus = 'shopping_trolley_status:3'
const completeStatus = 'shopping_trolley_status:4'
export default {
    name: 'OrderList',
    components: {
        CashTicket,
        Ticket,
        Invoice
    },
    data () {
        return {
            searchCondition: '',
            unsettledOrders: [],
            unpayOrders: [],
            uncompletedOrders: [],
            completedOrders: [],
            checkedObj: {},
            settleGoods: [],
            settleCustomer: {},
            orderIds: [],
            // 分页
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            current: 1,
            pageSize: 10,
            total: 0,
            orderNums: {
                unsettledOrdersCount: 0,
                unpayOrdersCount: 0,
                uncompletedOrdersCount: 0,
                completedOrdersCount: 0
            },
            activeKey: 1,
            // 激活类标识
            isActivea: false,
            isActiveb: false,
            isActivec: false,
            isActived: false,
            // 待结算一条记录
            isActiveaClass: -1,
            isActivebClass: -1,
            isActivecClass: -1,
            isActiveCustomer: -1,
            payRecordModal: false,
            shoppingPayRecords: [],
            invoiceModal: false,
            openFlag: false,
            currentCustomer: {},
            orderCodeList: [],
            ticketModal: false,
            ticketInfo: {},
            cashTicketModal: false
        }
    },
    mounted () {
        this.getUnsettledOrders()
        this.getOrderList(unPayStatus)
        this.getOrderList(unCompleteStatus)
        this.getOrderList(completeStatus)
    },
    methods: {
        toSettlePage () {
            this.$emit('activeComponent', 0)
        },
        moveErrorImg (event) {
            event.currentTarget.src = goodsPhoto
        },
        showInvoiceList (customer, orderInfo) {
            this.currentCustomer = customer
            this.orderCodeList = []
            this.orderCodeList.push(orderInfo.code)
            console.log('顾客税票列表', customer, orderInfo)
            this.openFlag = true
        },
        setOpenFlag (data) {
            this.openFlag = data
            console.log('\\\\\\\\\\', this.openFlag)
        },
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        printCahsTicket () {
            print({
                printable: 'print-cashTicket',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        toSettle (flag, customer, payNumber) {
            if (flag === 0) {
                if (this.checkedObj[customer.customerCode] === undefined || this.checkedObj[customer.customerCode].length === 0) {
                    this.$message.warning('请先选择要结算的商品')
                    return false
                } else {
                    this.checkedObj[customer.customerCode].forEach(item => {
                        item.skuAmount = item.skuActualPrice * item.skuQuantity
                        item.selectedAmount = 0
                        item.salesAmount = item.actualPay
                        item.saleNum = item.skuQuantity
                        item.storeCode = this.$store.getters.storeInfo.code
                    })
                    this.settleGoods = [...this.checkedObj[customer.customerCode]]
                    this.settleGoods.forEach(item => {
                        item.actualPrice = Number(item.skuActualPrice)
                        item.quantity = Number(item.saleNum)
                        this.orderIds.push(item.code)
                    })
                    this.settleCustomer = { ...customer }
                    const depositLength = this.settleGoods.filter(order => order.ifDeposit === 1).length
                    console.log('11313', this.settleGoods, depositLength)
                    if (depositLength > 0 && depositLength !== this.settleGoods.length) {
                        this.$message.warning('定金销售单和普通销售单不能同时支付')
                        this.checkedObj[customer.customerCode] = []
                        return false
                    } else {
                        if (depositLength > 1) {
                            this.$message.warning('定金预售单只能单笔支付')
                            this.checkedObj[customer.customerCode] = []
                            return false
                        } else {
                            let ifDeposit = 0
                            this.settleGoods.forEach(order => {
                                if (order.ifDeposit === 1) {
                                    ifDeposit = 1
                                }
                            })
                            this.$emit('updateData', [this.settleCustomer, this.settleGoods, flag, ifDeposit])
                            this.$emit('activeComponent', 0)
                        }
                    }
                }
            } else {
                this.settleGoods = [...payNumber.shoppingTrolleyDetailList]
                this.settleCustomer = { ...customer }
                let ifDeposit = 0
                this.settleGoods.forEach(order => {
                    if (order.ifDeposit === 1) {
                        ifDeposit = 1
                    }
                })
                this.$emit('updateData', [this.settleCustomer, this.settleGoods, flag, ifDeposit])
                this.$emit('activeComponent', 0)
            }
        },
        onShowSizeChange (current, pageSize) {
            this.pageSize = pageSize
        },
        pageChange (current) {
            this.current = current
            if (this.activeKey === 1) {
                this.getUnsettledOrders()
            } else if (this.activeKey === 2) {
                this.getOrderList(unPayStatus)
            } else if (this.activeKey === 3) {
                this.getOrderList(unCompleteStatus)
            } else {
                this.getOrderList(completeStatus)
            }
        },
        onSearch (value) {
            if (this.activeKey === 1) {
                this.getUnsettledOrders(value)
            } else if (this.activeKey === 2) {
                this.getOrderList(unPayStatus, value)
            } else if (this.activeKey === 3) {
                this.getOrderList(unCompleteStatus, value)
            } else {
                this.getOrderList(completeStatus, value)
            }
            this.searchCondition = ''
        },
        getPayRecord (payNumber) {
            const orderIds = []
            payNumber.shoppingTrolleyDetailList.forEach(item => {
                orderIds.push(item.code)
            })
            axios({
                path: 'ShoppingPayRecordQueryShoppingPayRecord',
                method: 'post',
                body: {
                    orderIds,
                    status: 1,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.shoppingPayRecords = [...res.data.shoppingPayRecords]
                    this.payRecordModal = true
                }
            })
        },
        toPrintTicket (flag, payNumber) {
            this.orderCodeList = []
            payNumber.shoppingTrolleyDetailList.forEach(item => {
                this.orderCodeList.push(item.code)
            })
            this.queryTicketInfo(flag)
        },
        async queryTicketInfo (flag) {
            const res = await axios({
                path: 'ApiPaymentQueryPrintPayInfo',
                method: 'post',
                body: {
                    orderIds: this.orderCodeList
                }
            })
            if (res.flag === 1) {
                this.ticketInfo = res.data
                if (flag === 0) {
                    this.cashTicketModal = true
                } else {
                    this.ticketModal = true
                }
            }
        },
        handleClick (val, i, index, orderInfo, customerId) {
            console.log('订单详情：', orderInfo, customerId)
            const self = this
            console.log('val', val, i)
            if (val === 0) {
                // 详情
                this.isActiveCustomer = index
                this.isActiveaClass = i
                this.isActivea = true
                this.isActiveb = this.isActivec = this.isActived = false
                this.$emit('updateOrderInfo', orderInfo)
                this.$emit('activeComponent', 2)

                // this.goodsInfo = orderInfo
            } else if (val === 1) {
                // 编辑
                this.isActivebClass = i
                this.isActiveb = true
                this.isActivea = this.isActivec = this.isActived = false
                this.$emit('updateOrderInfo', orderInfo)
                this.$emit('activeComponent', 3)
                // this.goodsInfo = orderInfo
            } else if (val === 2) {
                // 删除
                this.isActivecClass = i
                this.isActivec = true
                this.isActivea = this.isActiveb = this.isActived = false
                const ids = []
                ids.push(orderInfo.code)
                this.$confirm({
                    title: '删除提示',
                    content: '确定删除选中项？删除将不可恢复',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'ShoppingTrolleyDeleteShoppingTrolley',
                            method: 'post',
                            body: {
                                ids: ids
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                self.getUnsettledOrders()
                            }
                        })
                    },
                    onCancel () {
                        self.$message.info('已取消')
                    }
                })
            } else {
                this.isActive = i
                this.isActived = true
                this.isActivea = this.isActiveb = this.isActivec = false
            }
        },
        callback (key) {
            this.pageSize = 10
            this.current = 1
            if (key === '1') {
                this.settleGoods = []
                this.activeKey = 1
                this.getUnsettledOrders()
            } else if (key === '2') {
                this.getOrderList(unPayStatus)
                this.activeKey = 2
                this.total = this.orderNums.unpayOrdersCount
            } else if (key === '3') {
                this.getOrderList(unCompleteStatus)
                this.activeKey = 3
                this.total = this.orderNums.uncompletedOrdersCount
            } else {
                this.getOrderList(completeStatus)
                this.activeKey = 4
                this.total = this.orderNums.completedOrdersCount
            }
        },
        checkChangeHandler (item) {
            console.log(item)
            item.totalPrice = 0
            this.checkedObj = Object.assign({}, this.checkedObj)
            const checkedList = this.checkedObj[item.customerCode]
            checkedList.forEach(goods => {
                item.totalPrice += goods.skuQuantity * goods.skuActualPrice
            })
            item.indeterminate = !!checkedList.length && (checkedList.length < item.shoppingTrolleySkuResponseList.length)
            item.checkAll = checkedList.length === item.shoppingTrolleySkuResponseList.length
        },
        onCheckAllChange (item, e) {
            this.checkedObj[item.customerCode] = e.target.checked ? item.shoppingTrolleySkuResponseList : []
            if (this.checkedObj[item.customerCode].length > 0) {
                this.checkedObj[item.customerCode].forEach(goods => {
                    item.totalPrice += goods.skuQuantity * goods.skuActualPrice
                })
            } else {
                item.totalPrice = 0
            }
            item.indeterminate = false
            item.checkAll = e.target.checked
            console.log('全选/全不选', item, this.checkedObj)
        },
        async getUnsettledOrders (searchCondition) {
            const res = await axios({
                path: 'ShoppingTrolleyQueryUnSettledOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    rows: this.pageSize,
                    page: this.current,
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    searchCondition: searchCondition
                }
            })
            if (res.flag === 1) {
                const data = res.data.list
                this.orderNums.unsettledOrdersCount = this.total = res.data.total
                data.forEach(item => {
                    this.checkedObj[item.customerId] = []
                    item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                    if (item.shoppingTrolleySkuResponseList.length > 0) {
                        item.totalPrice = 0
                        item.checkAll = false
                        // 顾客待结算所有商品结合
                        item.idsList = [...item.shoppingTrolleySkuResponseList]
                        const goods = item.shoppingTrolleySkuResponseList
                        goods.forEach(subItem => {
                            subItem.disabled = false
                            const pic = subItem.skuPicture ? subItem.skuPicture.split(',') : ['']
                            subItem.mainGoodsPic = pic
                        })
                    }
                })
                this.unsettledOrders = [...data]
                console.log('待结算--', this.unsettledOrders)
            }
        },
        async getOrderList (status, searchCondition) {
            const res = await axios({
                path: 'ShoppingTrolleyQueryCompletedOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    status: status,
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    rows: this.pageSize,
                    page: this.current,
                    searchCondition: searchCondition
                }
            })
            if (res.flag === 1) {
                const data = res.data.list
                if (status === unPayStatus) {
                    this.orderNums.unpayOrdersCount = res.data.total
                    data.forEach(item => {
                        item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        item.shoppingTrolleySkuResponseList.forEach(payNumber => {
                            payNumber.shoppingTrolleyDetailList.forEach(order => {
                                const pic = order.skuPicture ? order.skuPicture.split(',') : ['']
                                order.mainGoodsPic = pic
                            })
                        })
                    })
                    this.unpayOrders = [ ...data ]
                } else if (status === unCompleteStatus) {
                    this.orderNums.uncompletedOrdersCount = res.data.total
                    data.forEach(item => {
                        item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        item.shoppingTrolleySkuResponseList.forEach(payNumber => {
                            payNumber.shoppingTrolleyDetailList.forEach(order => {
                                const pic = order.skuPicture ? order.skuPicture.split(',') : ['']
                                order.mainGoodsPic = pic
                            })
                        })
                    })
                    this.uncompletedOrders = [ ...data ]
                    console.log('----uncompletedOrders----', this.uncompletedOrders)
                } else {
                    this.orderNums.completedOrdersCount = res.data.total
                    data.forEach(item => {
                        item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        item.shoppingTrolleySkuResponseList.forEach(payNumber => {
                            payNumber.shoppingTrolleyDetailList.forEach(order => {
                                const pic = order.skuPicture ? order.skuPicture.split(',') : ['']
                                order.mainGoodsPic = pic
                            })
                        })
                    })
                    this.completedOrders = [ ...data ]
                }
            }
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }

}
</script>

<style lang="less" scoped>
.box {
    height: 100%;
    overflow-y: auto;
}
/deep/.ant-tabs-nav-scroll {
  border: 1px solid #ddd;
  background: #fff;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border:none;
  border-radius: 0;
  margin: 0;
  background: #fff;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  background: #1890ff;
  color: #fff;
}
.ant-checkbox-group{
  width: 100%;
  height:100%;
}
/deep/.ant-card-bordered {
  margin-bottom: 20px;
  .ant-card-body {
    padding: 0;
    .payNumber {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      height:24px;
      line-height: 24px;
      margin-top: 15px;
      div{
        display: inline-block;
      }
      .number{
        padding-left: 30px;
      }
      .payNumberOpt{
        padding-right:20px;
        a{
          text-decoration: none;
        }
        .payRecord {
          margin-right: 10px;
        }
      }
    }
  }
}
// 流水号对应结算
.payNumber-pay {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  padding-left: 24px;
  .pay-right {
    display: flex;
    padding-right:30px;
    .ant-btn {
      margin-top:9px;
      margin-left: 10px;
    }
  }
}
// 商品列表
.goods {
  border-bottom: 1px solid #eee;
  padding:15px;
  .ant-row {
    position: relative;
    .returned {
      position: absolute;
      left: 50%;
      top: 50%;
      width:50px;
      height: 50px;
    }
  }
  .ant-col-3 {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: inline-block;
      height: 99px;
      width: auto;
    }
  }
  .ant-col-8,
  .ant-col-10,
  .ant-col-12 {
    p {
      font-weight: 700;
      margin: 3px;
    }
  }
  .order-info,
  .pay-record {
    padding-top: 10px;
    padding-left: 10px;
    pre {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 2px;
      // text-align: center;
    }
  }
  .order-info{
    p{
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 10px;
      text-align: center;
    }
  }
}
// 详情/编辑/删除/配送激活类
.right {
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  p{
    margin-bottom: 10px;
  }
  a {
    text-decoration: none;
    font-size: 12px;
    color:rgba(0,0,0,0.65);
    margin-right: 5px;
  }
  .active {
    color: #1890ff;
  }
}
// 未支付底部样式
.unsettle-footer{
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  .checkall{
    padding-left: 15px;
  }
  .unsettle-right{
    display:flex;
    padding-right: 30px;
    .ant-btn{
      margin-top: 5px;
      margin-left: 10px;
    }
  }
}
/deep/.ant-card-actions > li{
  margin: 0;
}
/deep/.ant-card-actions > li > span{
  display:block;
  width: 100%;
  height:42px;
  .ant-row {
    height: 42px;
    line-height: 42px;
    font-size: 12px;
  }
}
.pay-detail {
  font-size: 12px;
  font-weight: 400;
  color: #ccc;
  border-left: 1px solid #eee;
  text-align: center;
}
</style>

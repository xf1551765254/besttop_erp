<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-05-28 14:30:30
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-15 14:13:59
 -->
<template>
  <div class="handler">

    <!-- 基础信息 -->
    <div class="base-info">
      <a-form
        :form="form"

      >
        <h2>基础信息</h2>
        <a-row>
          <a-col :sm="8" :md="2" :xl="2">单号</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <a-input disabled v-model="returnData.applyMain.code"/>
          </a-col>
          <a-col :sm="8" :md="2" :xl="2" :offset="8">状态</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <a-input v-model="returnData.applyMain.status" disabled/>
          </a-col>
          <a-col :sm="8" :md="2" :xl="2">服务类型</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <a-select v-model="returnData.applyMain.type" style="width: 100%" :disabled="isDelatis===0">
              <a-select-option value="1">退货</a-select-option>
              <a-select-option value="2">换货</a-select-option>
            </a-select>
          </a-col>
          <a-col :sm="8" :md="2" :xl="2" :offset="8">预约取货时间</a-col>
          <a-col :sm="16" :md="6" :xl="6">
            <!-- <a-date-picker v-model="moment(returnData.applyMain.pickUpTime, dateFormat)" width="100%"/> -->
            <a-date-picker v-model="returnData.applyMain.pickUpTime" :format="dateFormat" @change="setTime" :disabled="isDelatis===0" style="width: 100%"/>
          </a-col>
        </a-row>
      </a-form></div>
    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="goods-info-header">
        <h2>商品信息</h2>
        <div v-if="isDelatis!==0">
          <a-button type="primary" @click="openGoodsModal" :disabled="isAddGoods===1">添加商品</a-button>
          <a-button type="primary" @click="openSalesOrderModal" :disabled="isAddGoods===2">选择销售单</a-button>
        </div>
      </div>
      <div class="goods-info-content">
        <div class="paynumber">
          <div class="paynumber-text">
            <span>流水号：{{ returnData.applyMain.code }}</span>
            <span>导购：{{ returnData.applyMain.guideName }}</span>
            <span>顾客：{{ returnData.applyMain.customerName }}</span>
          </div>
          <div class="add-customer-btn">
            <a-button type="primary" size="small" @click="addEditCustomer()" v-if="isDelatis!==0" :disabled="isAddGoods===1">添加顾客</a-button>
          </div>
        </div>
        <a-row class="order" v-for="(el,index) in returnData.applyDetail" :key="index">
          <a-col :span="12" class="order-left">
            <p>销售单号：{{ el.sourceCode }}</p>
            <div>
              <img :src="el.picture" height="90" width="90">
              <div class="order-info">
                <p>
                  <span>{{ el.skuName }}</span>
                  <span>{{ el.skuCode }}</span>
                </p>
                <p>
                  <span
                    style="width: 200px;display: inline-block;">{{ el.skuModel }}</span>
                  <span v-if="isAddGoods===2" style="float:right"> x <a-input-number style="display: inline-block;" v-model="el.quantity" /></span>
                  <span style="float:right" v-else> x {{ el.quantity }}</span>
                </p>
              </div>
            </div>
          </a-col>
          <a-col :span="12" class="order-right">
            <div>
              <span style="margin-right:20px;" >销售店：
                <span>{{ el.saleStoreName }}</span>
              </span>
              <span style="margin-right:20px;" v-if="isAddGoods!==2">提货方式：
                <span>{{ el.stockOutName }}</span>
              </span>
              <span>提货位置：
                <a-select v-if="isAddGoods===2" v-model="el.pickStoreCode" style="width: 120px" size="small" :disabled="isDelatis===0">
                  <a-select-option v-for="(pick,i) in WarehouseList" :value="pick.code" :key="i">{{ pick.name }}</a-select-option>
                </a-select>
                <span v-else>{{ el.pickStoreName }}</span>

              </span>
              <a-button v-if="isDelatis!==0" @click="deleteIndex(index)">删除</a-button>
            </div>
            <div>
              <a-form-item>
                申请原因：
                <a-select
                  v-model="el.applyReason"
                  style="width: 120px"
                  size="small"
                  :disabled="isDelatis===0">
                  <a-select-option v-for="(applyEl,i) in applyReasonList" :value="applyEl.configKey" :key="i">{{ applyEl.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div>
              <a-textarea v-model="el.applyDescription" placeholder="问题描述" :disabled="isDelatis===0" :rows="2"/>
            </div>
          </a-col>
          <div class="goods-info-footer">
            <span>收货人：{{ el.consigneeName }}</span>
            <span>联系电话：{{ el.consigneeTelephone }}</span>
            <span>地址：{{ el.consigneeAddressDetail }}</span>
          </div>
        </a-row>
        <div class="inscribe">
          <h2>落款信息</h2>
          <a-row>
            <a-col :sm="8" :md="2" :xl="2">审核人</a-col>
            <a-col :sm="16" :md="6" :xl="6">
              <a-input disabled v-model="returnData.applyMain.auditBy"/>
            </a-col>
            <a-col :sm="8" :md="2" :xl="2" :offset="8">制单人</a-col>
            <a-col :sm="16" :md="6" :xl="6">
              <a-input v-model="returnData.applyMain.createBy" disabled/>
            </a-col>
            <a-col :sm="8" :md="2" :xl="2">审核时间</a-col>
            <a-col :sm="16" :md="6" :xl="6">
              <a-input v-model="returnData.applyMain.auditTime" disabled/>
            </a-col>
            <a-col :sm="8" :md="2" :xl="2" :offset="8">制单时间</a-col>
            <a-col :sm="16" :md="6" :xl="6">
              <a-input v-model="returnData.applyMain.createTime" disabled/>
            </a-col>
            <a-col :sm="8" :md="2" :xl="2">备注</a-col>
            <a-col :sm="16" :md="6" :xl="6">
              <a-textarea v-model="returnData.applyMain.note" :disabled="isDelatis===0" placeholder="请输入备注" :rows="2"/>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <!-- 选择销售单模态框 -->
    <!-- <a-modal
      title="选择销售单"
      v-model="salesOrderVisible"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelChooseOrders">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">取消</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" @click="confirmOrders">
          确定
        </a-button>
      </template>
    </a-modal> -->
    <SelectGoods :salesOrderVisible="salesOrderVisible" @cancelReturnOrders="salesOrderVisible=false" @setData="setGoods" />

    <!-- 添加顾客 -->
    <SelectCustomers :queryCustomerModal.sync="queryCustomerModal" @closeCustomerModal="queryCustomerModal=false" @customer="getCustomer"></SelectCustomers>
    <goods :visible.sync="goodsQuery" @onSelect="onSelect" multiple/>
  </div>
</template>

<script>

import { axios } from '@/utils/request'
import moment from 'moment'
import goods from '@/pages/marketing/MarketingScheduleManagement/components/goods'
import { mapGetters } from 'vuex'
import SelectGoods from './SelectGoods'
import SelectCustomers from './SelectCustomers'
export default {
    name: 'Handle',
    components: {
        goods,
        SelectGoods,
        SelectCustomers
    },
    props: {
        isDelatis: {
            type: Number,
            default: 0
        },
        returnData: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    data () {
        return {
            salesOrderVisible: false,
            GoodsVisible: false,
            queryCustomerModal: false,
            customerModal: false,
            customerInfo: {},
            loading: false,
            form: this.$form.createForm(this),
            // 查询返回详情数据
            // returnData: {},
            // 请求品类品牌传的参数
            pams: {},
            // 退换原因
            applyReasonList: [],
            // 商品选择
            goodsQuery: false,
            // 提货位置数组
            WarehouseList: [],
            // 是否新增商品
            isAddGoods: 0,
            // 商品下标
            goodsIndex: 0,
            addEditAddressTitle: '',
            // 选择销售单数据
            salesList: [],
            dateFormat: 'YYYY-MM-DD'
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    watch: {
        // returnData: {
        //     handler (newData, oldeDate) {
        //         console.log(newData)
        //         if (newData.applyDetail.length === 0) {
        //             this.isAddGoods = 0
        //         }
        //     },
        //     deep: true
        //     // immediate: true
        // }
        'returnData.applyDetail': {
            handler (newData, oldeDate) {
                console.log(newData)
                if (this.isAddGoods === 2) {
                    this.returnData.applyDetail.forEach(el => {
                        el.consigneeName = this.returnData.applyMain.customerName
                        el.consigneeTelephone = this.returnData.applyMain.customerTelephone
                        el.consigneeAddress = this.returnData.applyMain.consigneeAddress
                        el.consigneeAddressDetail = this.returnData.applyMain.consigneeAddressDetail
                        el.consigneeLongitude = this.returnData.applyMain.longitude
                        el.consigneeLatitude = this.returnData.applyMain.latitude
                    })
                }
            },
            deep: true
        }
    },
    created () {
        console.log(this.isDelatis)
        console.log(this.returnData)
        this.queryApplyReason()
        // if (this.isDelatis !== 1) {
        //     // this.queryCodeReturn()
        // } else {
        //     this.returnData = {
        //         'applyMain': {
        //             'storeCode': this.storeInfo.code, // 申请店code
        //             'guideCode': this.userInfo.code, // 导购编码
        //             'guideName': this.userInfo.name, // 导购姓名
        //             'customerCode': '', // 顾客编码
        //             'customerName': '', // 顾客姓名
        //             'pickUpTime': new Date(), // 预约取货时间
        //             'auditBy': '', // 审核人
        //             'auditTime': null, // 审核时间
        //             'status': '', // 审核状态
        //             'type': '', // 服务类型
        //             'note': '' // 审核备注
        //         },
        //         'applyDetail': []
        //     }
        // }
    },
    mounted () {
        if (this.isDelatis !== 0) {
            this.queryStoreWarehouseList()
        }
        // this.$nextTick(() => {
        //     console.log(this.returnData)
        //     if (this.returnData.applyDetail.length === 0) {
        //         this.isAddGoods = 0
        //     } else if (this.returnData.applyDetail[0].source === '销售单') {
        //         this.isAddGoods = 1
        //     } else if (this.returnData.applyDetail[0].source === '第三方售后') {
        //         this.isAddGoods = 2
        //     }
        // })
    },
    updated () {
        console.log(this.returnData)
        if (this.returnData.applyDetail.length === 0) {
            this.isAddGoods = 0
        } else if (this.returnData.applyDetail[0].source === '销售单') {
            this.isAddGoods = 1
        } else if (this.returnData.applyDetail[0].source === '第三方售后') {
            this.isAddGoods = 2
        }
    },
    methods: {
        moment,
        setTime (e) {
            console.log(e)
        },
        queryStoreWarehouseList () {
            const data = {
                code: this.storeInfo.code
            }
            axios({
                path: 'DistOriginDataQueryStoreWarehouseList',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        if (res.data.length > 0) {
                            this.WarehouseList = res.data
                            console.log(this.WarehouseList)
                        }
                    }
                }
            })
        },
        setGoods (data) {
            console.log(data)
            // this.returnData.applyMain.code = data.payNumber
            this.returnData.applyMain.customerName = data.customerName
            this.returnData.applyMain.customerCode = data.customerCode
            this.returnData.applyMain.customerTelephone = data.telephone
            this.returnData.applyMain.latitude = data.shoppingTrolleyDetailList[0].consigneeLatitude
            this.returnData.applyMain.longitude = data.shoppingTrolleyDetailList[0].consigneeLongitude
            this.returnData.applyMain.guideCode = data.guideCode // 导购员code
            this.returnData.applyMain.guideName = data.guideName // 导购员Name
            this.returnData.applyMain.consigneeAddress = data.shoppingTrolleyDetailList[0].concatAddress
            this.returnData.applyMain.consigneeAddress = data.shoppingTrolleyDetailList[0].consigneeAddressDetail || data.shoppingTrolleyDetailList[0].consigneeAddress
            const list = []
            data.shoppingTrolleyDetailList.forEach(el => {
                list.push({
                    // 'returnApplyCode': '',
                    'source': '销售单', // 订单来源
                    'sourceCode': el.code, // 销售单号
                    'payNumber': data.payNumber, // 流水号
                    'applyReason': '', // 申请原因
                    'applyDescription': '', // 申请描述
                    'consigneeName': el.consigneeName, // '收货人姓名', // *必填
                    'consigneeTelephone': el.consigneeTelephone, // '收货人电话', // *必填
                    'consigneeAddress': el.consigneeAddress, // '收货人地址', // *必填
                    'consigneeAddressDetail': el.consigneeAddressDetail || el.consigneeAddress, // '收货人地址详细', // *非必填
                    'consigneeLongitude': el.consigneeLongitude, // '收货人位置经度', //* 非必填
                    'consigneeLatitude': el.consigneeLatitude, // '收货人位置纬度', // *非必填
                    'pickStoreCode': el.pickStoreCode || this.WarehouseList[0].code, // 提货店code
                    'pickStoreName': el.pickStoreName || this.WarehouseList[0].name, // 提货店code
                    'saleStoreCode': this.storeInfo.code, // 销售店code
                    'saleStoreName': this.storeInfo.name, // 销售店code
                    'skuCode': el.skuCode, // sku编码
                    'skuName': el.skuName, // sku名称
                    'skuModel': el.skuModel, // sku型号
                    'skuType': el.skuType, // 联营\自营
                    'skuProperty': el.skuProperty, // sku属性
                    'unitPrice': el.skuUnitPrice, // 单价
                    'actualPrice': el.skuActualPrice, // 实际售卖价
                    'providerCode': el.providerCode, // 供货商编码
                    'providerName': el.providerName, // 供货商名称
                    'contractCode': el.contractCode, // 合同号
                    'businessType': el.businessType, // 经营方式
                    'quantity': el.skuQuantity, // 数量
                    'rate': el.skuTaxRate, // 扣率
                    'taxRate': el.skuTaxRate, // 税率
                    'pic': el.skuPicture ? el.skuPicture.split(',')[0] : '',
                    'picture': el.skuPicture, // 图片
                    'isGroupFlag': el.returnedFlag, // 商品绑定类型
                    'note': '', // 详情单备注
                    ifIntsall: el.ifIntsall, // 审核备注
                    stockOut: el.stockOut, // 提货方式code
                    stockOutName: el.stockOutName// 提货方式name

                })
            })
            this.returnData.applyDetail = list
            this.isAddGoods = 1
            // this.returnData.applyDetail =
            // this.orderSourceFlag = 1
            // this.disableChoose = true
            // this.customerInfo = data[0]
            // this.orderInfo = data[1]
            // this.orderList = data[2]
            // const orderIds = []
            // this.orderList.forEach(item => {
            //     orderIds.push(item.code)
            //     this.acturalRefund += (Number(item.actualPrice) * Number(item.quantity))
            // })
            console.log(this.acturalRefund)
        },
        getCustomer (customer) {
            console.log(customer)
            this.returnData.applyMain.customerCode = customer.code
            this.returnData.applyMain.customerAddressId = customer.id
            this.returnData.applyMain.customerName = customer.name
            this.returnData.applyMain.customerTelephone = customer.telephone
            this.returnData.applyMain.longitude = customer.longitude
            this.returnData.applyMain.latitude = customer.latitude
            this.returnData.applyMain.consigneeAddress = customer.address
            this.returnData.applyMain.consigneeAddressDetail = customer.concatAddress
            this.returnData.applyDetail.forEach(el => {
                el.consigneeName = this.returnData.applyMain.customerName
                el.consigneeTelephone = this.returnData.applyMain.customerTelephone
                el.consigneeAddress = this.returnData.applyMain.consigneeAddress
                el.consigneeAddressDetail = this.returnData.applyMain.consigneeAddressDetail
                el.consigneeLongitude = this.returnData.applyMain.longitude
                el.consigneeLatitude = this.returnData.applyMain.latitude
                el.customerAddressId = this.returnData.applyMain.customerAddressId

                //  el.consigneeName= el.consigneeName, // '收货人姓名', // *必填
                //     el.consigneeTelephone= el.consigneeTelephone, // '收货人电话', // *必填
                //     el.consigneeAddress= el.consigneeAddress, // '收货人地址', // *必填
                //     el.consigneeAddressDetail= el.consigneeAddressDetail, // '收货人地址详细', // *非必填
                //     el.consigneeLongitude=el.consigneeLongitude, // '收货人位置经度', //* 非必填
                //     e.consigneeLatitude= el.consigneeLatitude, // '收货人位置纬度', // *非必填
            })
            console.log(customer)
        },
        /// dist/originData/queryApplyReasonList
        /// DistReturnApplyAuditByApplyCode
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
        },
        // 查询code对应信息
        queryCodeReturn () {
            axios({
                path: 'DistReturnApplyFindOne',
                method: 'post',
                body: {
                    codeSearch: this.searchCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.returnData = res.data
                    if (this.returnData.applyDetail[0].source === '第三方售后') {
                        this.isAddGoods = 2
                    } else {
                        this.isAddGoods = 1
                    }
                    console.log(this.returnData)
                }
            })
        },

        openQueryCustomerModal () {
            this.queryCustomerModal = true
        },

        // 新增/编辑顾客信息
        addEditCustomer (index) {
            // this.goodsIndex = index
            console.log('ss')
            if (this.returnData.applyDetail.length > 0) {
                this.queryCustomerModal = true
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择商品！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        },
        // 提交添加顾客信息
        confirmAddCustomer (e) {
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.customerInfo = { ...this.customerInfo, ...values }
                    console.log('顾客表单提交信息:', this.customerInfo)
                    this.customerModal = false
                }
            })
        },

        // 打开添加商品模态框
        openGoodsModal () {
            this.goodsQuery = true
            console.log('1111')
        },
        // 关闭添加商品列表
        cancelChooseGoods () {

        },
        // 确认选中的商品
        confirmGoods () {

        },
        // 打开销售单列表模态框
        openSalesOrderModal () {
            this.salesOrderVisible = true
        },

        // 关闭销售单列表
        cancelChooseOrders () {
            this.salesOrderVisible = false
        },
        // 确认选中销售单
        confirmOrders () {
            this.salesOrderVisible = true
        },
        // 删除商品信息
        deleteIndex (index) {
            this.$delete(this.returnData.applyDetail, index)
        },

        // 商品选择事件,入参为用户选中的数据，array类型
        onSelect (arr) {
            console.log(arr)
            const newData = [...this.returnData.applyDetail]
            const error = []
            arr.forEach(el => {
                const has = newData.filter(o => o.skuCode === el.skuCode)
                console.log(has)

                this.isAddGoods = 2

                if (has.length === 0) {
                    const pic = el.pic ? el.pic.split(',') : ['']
                    console.log(pic)
                    this.returnData.applyDetail.push(
                        {
                            'returnApplyCode': '',
                            'source': '第三方售后', // 订单来源
                            'sourceCode': '', // 销售单号
                            'payNumber': '', // 流水号
                            'applyReason': '', // 申请原因
                            'applyDescription': '', // 申请描述
                            'customerAddressId': '', // 收货人地址主键
                            'pickStoreCode': this.WarehouseList[0].code, // 提货店code
                            'pickStoreName': this.WarehouseList[0].name, // 提货店名称
                            'saleStoreCode': this.storeInfo.code, // 销售店code
                            'saleStoreName': this.storeInfo.name, // 销售店名称
                            'skuCode': el.skuCode, // sku编码
                            'skuName': el.skuName, // sku名称
                            'skuModel': el.skuModel, // sku型号
                            'skuType': el.skuType, // 联营\自营
                            'skuProperty': el.skuProperty, // sku属性
                            'unitPrice': null, // 单价
                            'actualPrice': null, // 实际售卖价
                            'providerCode': el.providerCode, // 供货商编码
                            'providerName': el.providerName, // 供货商名称
                            'contractCode': el.contractCode, // 合同号
                            'businessType': '', // 经营方式
                            'quantity': 1, // 数量
                            'rate': null, // 扣率
                            'taxRate': null, // 税率
                            'pic': pic[0],
                            'picture': el.pic, // 图片
                            'isGroupFlag': null,
                            'isGroupFlagName': '', // 商品绑定类型
                            'consigneeName': '', // 收货人姓名
                            'consigneeAddress': '', // 收获人地址
                            'consigneeTelephone': '', // 收获人电话
                            'note': '' // 详情单备注
                        }
                    )
                } else {
                    error.push(el.skuCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../../assets/modalStyle.less";
</style>

<style lang="less" scoped>
.handler {
  .base-info,.goods-info{
      border: 1px solid #ccc;
    margin-bottom: -1px;
    padding: 10px;
  }
  // 商品信息
  .goods-info {
    &-header {
      display: flex;
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
        border-bottom: 1px solid #ccc;
        &-text {
          span {
            margin-right: 40px;
          }
        }
      }
      .order {
        border-bottom: 1px solid #ccc;
        .order-left {
          padding: 10px 0;
          div {
            display: flex;
            img {
              display: block;
            }
            .order-info {
              display: block;
              padding-left: 20px;
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
    //   height: 30px;
      line-height: 30px;
      margin-top: 10px;
      border-top: 1px solid #ccc;
      clear: both;
      span {
        margin-right: 60px;
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
  // 记录
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
  // 方式
  .refund-methods {
    .ant-btn {
      margin-right: 10px;
    }
  }
}

</style>

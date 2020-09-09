<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-05-28 14:30:30
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-27 16:30:22
 -->
<template>
  <div class="handler">
    <!-- 基础信息 -->
    <div class="base-info">
      <h2>基础信息</h2>
      <a-form
        :form="form"
      >
        <a-row :gutter="10" v-if="isDelatis!==1">
          <a-col :sm="24" :md="12" :xl="8">
            <a-form-item label="单号">
              <a-input
                style="width:100%"
                placeholder="单号"
                disabled
                v-model="returnData.applyMain.code"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="12" :xl="16">
            <a-form-item label="状态">
              <a-input
                style="width:100%"
                placeholder="状态"
                disabled
                v-model="returnData.applyMain.statusName"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :sm="24" :md="12" :xl="8">
            <a-form-item label="预约取货时间">
              <a-date-picker
                style="width:100%"
                :disabled="isDelatis===0"
                format="YYYY-MM-DD"
                placeholder="请选择时间"
                v-model="returnData.applyMain.pickUpTime"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="24" :md="12" :xl="16">
            <a-form-item label="备注">
              <a-textarea
                style="width:100%"
                :disabled="isDelatis===0"
                placeholder="请输入备注"
                v-model="returnData.applyMain.note"
                :rows="1"/>
            </a-form-item>
          </a-col>

        </a-row>
      </a-form>

    </div>
    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="goods-info-header">
        <h2>商品信息</h2>
        <div v-if="isDelatis!==0" style="line-height:60px;">
          <a-button type="primary" @click="openGoodsModal" :disabled="isAddGoods===1" v-if="this.type===1" size="small">添加商品</a-button>
          <a-button type="primary" @click="openSalesOrderModal" :disabled="isAddGoods===2" v-if="this.type===2" size="small">选择销售单</a-button>
        </div>
      </div>
      <div class="goods-info-content">
        <div class="paynumber">
          <div class="paynumber-text">
            <span v-if="isAddGoods===1">流水号：{{ returnData.applyMain.payNumber }}</span>
            <span>导购：{{ returnData.applyMain.guideName }}</span>
            <span>顾客：{{ returnData.applyMain.customerName }}</span>
          </div>
          <div class="add-customer-btn" v-if="this.type===1">
            <a-button
              type="primary"
              size="small"
              @click="addEditCustomer()"
              v-if="isDelatis!==0"
              :disabled="isAddGoods===1"
            >添加顾客</a-button>
          </div>
        </div>
        <a-row class="order-nogood" v-if="returnData.applyDetail.length===0">
          暂无商品
        </a-row>
        <a-row class="order" v-for="(el,index) in returnData.applyDetail" :key="index" v-else>
          <a-col :span="24" class="order-item">
            <div :span="8" class="order-left" >
              <div>
                <img :src="el.picture" height="64" width="80">
                <div class="order-info">
                  <div>
                    <p>销售单号：{{ el.sourceCode }}</p>
                    <p>{{ el.skuName }}</p>
                    <p>{{ el.skuCode }} - {{ el.skuModel }}</p>
                  </div>

                </div>
                <div class="number">
                  <!-- <span
                    style="width: 200px;display: inline-block;">{{ el.skuModel }}</span> -->
                  <span style="float:right"> <a-input-number style="display: inline-block;" v-model="el.quantity" :disabled="isDelatis===0" /></span>

                </div>
              </div>
            </div>
            <div :span="16" class="order-right" >
              <div class="order-select">
                <div>
                  <span style="margin-right:20px;" >销售店：
                    <span>{{ el.saleStoreName }}</span>
                  </span>
                  <span style="margin-right:20px;">提货方式：
                    <a-select
                      v-if="isAddGoods===2"
                      @change="stockHandler(el,el.stockOut)"
                      v-model="el.stockOut"
                      style="width: 120px"
                      size="small"
                      :disabled="isDelatis===0">
                      <a-select-option v-for="(take,i) in takeType" :value="take.code" :key="i">{{ take.value }}</a-select-option>
                    </a-select>
                    <span v-else>{{ el.stockOutName }}</span>
                  </span>
                  <span style="display:inline-block;" v-if="el.stockOut!=='shopping_stock_out:1'">提货位置：
                    <a-select v-if="isAddGoods===2" v-model="el.pickStoreCode" size="small" :disabled="isDelatis===0">
                      <a-select-option v-for="(pick,i) in WarehouseList" :value="pick.code" :key="i">{{ pick.code }}-{{ pick.name }}</a-select-option>
                    </a-select>
                    <span v-else>{{ el.pickStoreName }}</span>
                  </span>
                  <span style="margin-left:20px;display: inline-block;">
                    申请原因：
                    <a-select
                      v-model="el.applyReason"
                      style="width: 120px"
                      size="small"
                      :disabled="isDelatis===0">
                      <a-select-option v-for="(applyEl,i) in applyReasonList" :value="applyEl.configKey" :key="i">{{ applyEl.value }}</a-select-option>
                    </a-select>
                  </span>

                </div>
                <div>
                  <a-textarea v-model="el.applyDescription" placeholder="问题描述" :disabled="isDelatis===0" :rows="1"/>
                </div>
              </div>
              <div class="order-del">
                <a-button v-if="isDelatis!==0" type="danger" @click="deleteIndex(index)">删除</a-button>
              </div>
            </div>
          </a-col>

          <div class="goods-info-footer">
            <span>收货人：{{ el.consigneeName }}</span>
            <span>联系电话：{{ el.consigneeTelephone }}</span>
            <span>地址：{{ el.consigneeAddressDetail }}</span>
          </div>
        </a-row>
        <div class="inscribe">
          <!-- <h2>落款信息</h2> -->
          <p>
            <span>
              审核人：{{ returnData.applyMain.auditBy }}
            </span>
            <span>
              审核时间：{{ returnData.applyMain.auditTime }}
            </span>
            <span>
              制单人：{{ returnData.applyMain.createBy }}
            </span>
            <span>
              制单时间：{{ returnData.applyMain.createTime }}
            </span>
          </p>

        </div>
      </div>
    </div>
    <!-- 选择销售单模态框 -->
    <SelectGoods :salesOrderVisible="salesOrderVisible" @cancelReturnOrders="salesOrderVisible=false" @setData="setGoods" />

    <!-- 添加顾客 -->
    <SelectCustomers :queryCustomerModal.sync="queryCustomerModal" @closeCustomerModal="queryCustomerModal=false" @customer="getCustomer"></SelectCustomers>
    <goods :visible.sync="goodsQuery" @onSelect="onSelect" multiple/>
  </div>
</template>

<script>

import { axios } from '@/utils/request'
import moment from 'moment'
// import goods from '@/pages/marketing/MarketingScheduleManagement/components/goods'
import goods from '@/pages/marketing/BundledGoodsSettings/goods'
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
        },
        type: {
            type: Number,
            default: 1
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
            // 提货方式
            takeType: [],
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
                // if (this.isAddGoods === 2) {
                //     this.returnData.applyDetail.forEach(el => {
                //         el.consigneeName = this.returnData.applyMain.customerName
                //         el.consigneeTelephone = this.returnData.applyMain.customerTelephone
                //         el.consigneeAddress = this.returnData.applyMain.consigneeAddress
                //         el.consigneeAddressDetail = this.returnData.applyMain.consigneeAddressDetail
                //         el.consigneeLongitude = this.returnData.applyMain.longitude
                //         el.consigneeLatitude = this.returnData.applyMain.latitude
                //     })
                // }
            },
            deep: true,
            immediate: true

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
        this.getMsgStaticData()
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
        // 原单退货修改 提货方式
        stockHandler (el, stockOut) {
            if (stockOut === 'shopping_stock_out:1') {
                el.pickStoreCode = ''
                el.pickStoreName = ''
            }
        },
        getMsgStaticData () {
            axios({
                path: 'DistOriginDataQueryTakeTypeList', // 接口path名，必传
                method: 'post'
                // body: {
                //     type: 'system_notice_type'
                // }
            }).then(res => {
                if (res.flag === 1) {
                    this.takeType = res.data
                    this.takeType.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                    })
                    // console.log('sssssssssssssss', this.takeType)

                    // this.seachValue.type = this.takeType[0].code
                }
            })
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
            this.returnData.applyMain.payNumber = data.payNumber
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
        async onSelect (arr) {
            console.log(arr)
            const newData = [...this.returnData.applyDetail]
            const error = []
            const stockOutLsit = []
            let res
            let data = []
            arr.forEach(item => {
                if (item.businessType === 'provider_contract_business_type:1') {
                    item.stockOut = 'shopping_stock_out:2'
                    item.stockOutName = '集中配送'
                } else {
                    stockOutLsit.push({
                        storeCode: this.storeInfo.code,
                        skuCode: item.skuCode
                    })
                }
            })
            if (stockOutLsit.length > 0) {
                res = await axios({
                    path: 'DistPurchaseFindStockOutDefaultValue',
                    method: 'post',
                    body: {
                        requestList: stockOutLsit
                    }
                })
                if (res.flag === 1) {
                    data = res.data || []
                }
            }

            arr.forEach(el => {
                data.forEach(sku => {
                    if (el.skuCode === sku.skuCode) {
                        el.stockOut = sku.stockOut
                        el.stockOutName = sku.stockOutName
                    }
                })
                const has = newData.filter(o => o.skuCode === el.skuCode)
                console.log(has)
                this.isAddGoods = 2
                if (has.length === 0 && el.stockOut) {
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
                            'note': '', // 详情单备注
                            stockOut: el.stockOut,
                            stockOutName: el.stockOutName
                        }
                    )
                } else {
                    error.push(el.skuCode)
                }
            })
            // }

            // stockOut

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
@import "../../../../../assets/modalStyle.less";
</style>
<style lang="less" scoped>
.handler {
  .base-info,.goods-info{
      >h2{
          font-size: 14px;
          color: #39adff;
          margin: 0;
          padding: 20px 0;
          border-bottom: 1px solid #cccccc;
          margin-bottom: 14px;
      }
    //   border: 1px solid #ccc;
    margin-bottom: -1px;
    padding: 10px;
  }
  // 商品信息
  .goods-info {
    &-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #cccccc;
    margin-bottom: 0;
      >h2{
          font-size: 14px;
          color: #39adff;
          margin: 0;
          padding: 20px 0;

        }
      .ant-btn {
        margin-left: 10px;
      }
    }
    &-content {
      .paynumber {
        display: flex;
        justify-content: space-between;
        height: 42px;
        line-height: 42px;
        border: 1px solid #ccc;
        // border-bottom: none;
        border-top: none;
        padding:0 16px;
        &-text {
          span {
            margin-right: 40px;
          }
        }
      }
      .order {
        border: 1px solid #ccc;
        border-top: none;
        display: inline-block;
        width: 100%;
        .order-item{
            padding:16px;
        }
        .order-left {
        //   padding: 10px;
        float: none;
        display: inline-block;
        width: 450px;
          >div {
             float: left;
             width: 100%;

            img {
              display: block;
                float: left;

            }
            .order-info {
              display: block;
             float: left;
              padding-left: 20px;
              width: calc( 100% - 200px);
              >div{
                  float: left;
                  p{
                      margin-bottom: 2px;
                  }
              }
            }
            .number{
                float: left;
                width:100px
              }
          }
        }
        .order-right {
          padding:0 0 0 16px;
        float: none;
        display: inline-block;
        width: calc(100% - 450px);

          border-left: 1px solid #ccc;
          .order-select{
              float: left;
              width:calc(100% - 80px);
            div {
                margin-bottom: 4px;
            }
          }

          .order-del{
              width: 80px;
              float: left;
              line-height: 66px;
              text-align: right;
                .ant-btn {
                    border:none;
                    background-color: white;;
                    // float: right;
                }
                .ant-btn:hover{
                    background-color: #f5222d;
                    color: white;
                }
          }

        }
      }
    }
    .order-nogood{
        padding:16px;
        text-align: center;
        border:1px solid #cccccc;
        border-top:none;
    }
    .inscribe{
        p{
            padding: 20px;
            margin: 0;
            >span{
                margin-right: 16px;
            }
        }
    }
    &-footer {
    //   height: 30px;
      line-height: 30px;
      margin-top: 10px;
      border-top: 1px solid #ccc;
      clear: both;
      padding:0 16px;
      span {
        margin-right: 60px;
      }
    }
  }

}
.layout-box .box /deep/ .center{
    padding: 0 ;
    background: none;
}
</style>

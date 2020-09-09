<!--
 * @Description: 商品详情模板
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-08 16:44:05
 * @LastEditTime: 2019-07-12 15:43:43
 -->
<template>
  <div class="box">
    <div :style="`height:${height}px;overflow:auto;`">
      <div class="goods-box">
        <!-- <img class="goods-box-img" :src="skuDetails.src" alt=""> -->
        <img class="goods-box-img" src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70">
        <a-card class="goods-box-info-box">
          <a-row class="title">{{ `${skuDetails.name } ${skuDetails.model} ${skuDetails.code}` }}</a-row>
          <a-row class="price">{{ initPrice(skuDetails.unitPrice) }}</a-row>
          <a-row class="property">
            <div style="line-height:40px;font-weight:bold">规格型号：</div>
            <div class="right">
              <span class="btn-style" :class="{defaultStyle:s.current, propertyActive:isActiveProperty===index}" v-for="(s,index) in baseSkuProperties" :key="index" @click="selectProperty(s,index)">{{ s.specs }}</span>
            </div>
          </a-row>
          <a-row class="info store-info">
            <span>出库方式：</span>
            <a-select style="min-width:120px;" v-model="defaultStockOut" @change="stockOutChangeHandler" :disabled="editable">
              <a-select-option
                v-for="item in stockOut"
                :key="`${item.type}:${item.configKey}`"
                :value="`${item.type}:${item.configKey}`">
                {{ item.value }}
              </a-select-option>
            </a-select>
            <span style="margin-left:20px;" v-if="showbaseStore">{{ defaultStockOut==='shopping_stock_out:3' ? '送货厂家: ': '提货位置：' }}</span>
            <a-select
              v-model="pickStoreCode"
              :options="baseStore"
              @change="baseStoreChangeHandler"
              v-if="showbaseStore"
              style="min-width:220px;"
              :disabled="editable">
            </a-select>
          </a-row>
          <a-divider dashed />
          <a-row class="btn-box">
            <div class="left-box">
              <span class="mark-title">实际售价：</span>
              <a-input-number
                :min="Number(skuDetails.priceMin)"
                :disabled="editable"
                v-model="actualPrice"
                @change="value=>actualPriceChangeHandler(value,skuDetails.priceMin)"/>
              <span style="margin-left:10px;">限价：{{ Number(skuDetails.priceMin).toFixed(2) }}</span>
            </div>
            <div class="right-box">
              <span style="font-weight:bold;margin-right:20px;" v-if="skuDetails.ifStock === '1'">可卖数：{{ skuDetails.inventory }}</span>
              <a-input-number
                style="margin-right:10px;"
                :min="1"
                :max="skuDetails.ifStock === '1' ? skuDetails.inventory : Number.MAX_SAFE_INTEGER"
                :disabled="editable"
                v-model="quantity"
                @change="value=>quantityChangeHandler(value,skuDetails.inventory)"/>
              <!-- <a-button type="primary" @click="addSalesBill">加入销售开单</a-button> -->
              <a-button type="primary" :disabled="disableAddSalesBill" @click="updateSalesBill" v-show="!editable">更新订单</a-button>
            </div>
          </a-row>
        </a-card>
      </div>
      <a-collapse v-model="collapseActiveKey">
        <!-- 捆绑商品 -->
        <a-collapse-panel header="捆绑商品" key="1" class="bind-goods">
          <a-checkbox-group @change="bindChange" v-model="bindArr" :disabled="editable">
            <a-card v-for="(item,index) in group.bindGoods" :key="index">
              <div class="bind-box">
                <div class="check-box">
                  <a-checkbox :value="item.skuCode"></a-checkbox>
                </div>
                <div class="goods-box">
                  <div class="img-box">
                    <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70">
                  </div>
                  <div class="goods-info">
                    <p>{{ item.skuName }}</p>
                    <p>{{ initPrice(item.price) }}</p>
                  </div>
                  <div class="goods-quantity">
                    x{{ item.quantity }}
                  </div>
                </div>
              </div>
            </a-card>
          </a-checkbox-group>
        </a-collapse-panel>
        <a-collapse-panel key="2">
          <template slot="header">
            营销活动
            <a-icon style="margin-left:10px;" type="question-circle-o" />
          </template>
          <a-card
            class="card-style"
            v-for="(item, index) in singleSchedule"
            :key="index"
            :class="item.selected?'active':''"
            @click.stop="chooseActivity(item)">
            <div class="activity-box">
              <span :class="[spanStyle, item.selected?'span-active':'']">
                {{ item.activityName }}
              </span>
              <div class="activity-desc">
                {{ item.desc }}
              </div>
              <div class="amount">
                <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'">应减：{{ item.shouldRateAmount }}</div>
                <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'" @click.stop.prevent>
                  实减：
                  <a-input-number
                    :min="1"
                    :max="item.maxAmount"
                    v-model="actualSub"
                    :disabled="item.isChange === '0'"
                    @change="value=>activityChangeHandler(0,value,item.maxAmount)"/>
                </div>
                <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'">应返：{{ item.shouldRateAmount }}</div>
                <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'" @click.stop.prevent>
                  实返：
                  <a-input-number
                    :min="1"
                    :max="item.maxAmount"
                    v-model="actualReturn"
                    :disabled="item.isChange === '0'"
                    @change="value=>activityChangeHandler(1,value,item.maxAmount)"/>
                </div>
              </div>
            </div>
            <div class="gift" v-if="item.gifts" >
              <a-checkbox-group @change="giftChange(item)" v-model="giftsArr" :disabled="disableChooseGift">
                <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
                  <div @click.stop>
                    <a-checkbox :value="gift.skuCode"></a-checkbox>
                  </div>
                  <div class="gift-img">
                    <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
                  </div>
                  <div class="gift-info">
                    <a-row>
                      <p>{{ gift.skuName }}</p>
                      <p>{{ initPrice(gift.skuPrice) }}</p>
                      <p>x{{ gift.skuNum }}</p>
                    </a-row>
                  </div>
                </div>
              </a-checkbox-group>
            </div>
          </a-card>
        </a-collapse-panel>
        <a-collapse-panel key="6">
          <template slot="header">
            营销活动
            <a-icon style="margin-left:10px;" type="question-circle-o" />
          </template>
          <SingleSchedule :singleSchedule="singleSchedule" :initData="initData"/>
        </a-collapse-panel>
        <!-- 套购活动 -->
        <a-collapse-panel key="3">
          <template slot="header">
            <span>您还可以参加以下套购有券活动，具体操作在结算界面</span>
            <a-icon style="margin-left:10px;" type="question-circle-o" />
          </template>
          <a-card style="margin-top:-1px;" v-for="(item,index) in arbitrageSchedule" :key="index">
            <div class="activity-box">
              <span :class="spanStyle">
                {{ item.activityName }}
              </span>
              <div class="activity-desc">
                {{ item.desc }}
              </div>
              <div class="amount">
              </div>
            </div>
            <div class="gift" v-if="item.gifts">
              <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
                <div class="gift-img">
                  <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70">
                </div>
                <div class="gift-info">
                  <p>{{ gift.skuName }}</p>
                  <p>{{ initPrice(gift.skuPrice) }}</p>
                  <p>x{{ gift.skuNum }}</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-collapse-panel>
        <!-- 店长优惠券 -->
        <a-collapse-panel header="店长优惠券" key="4">
          <a-col :span="12">
            <a-col :span="24" class="mark-conter" style="font-weight:bold;padding-left:20px;">A账户可用余额：{{ initPrice(coupons.acanUse) }}</a-col>
            <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">B账户可用余额：{{ initPrice(coupons.bcanUse) }}</a-col>
            <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">当笔提成：{{ initPrice(coupons.bBushMoney) }}</a-col>
          </a-col>
          <a-col :span="12">
            <a-col :span="8" class="mark-title">A账户使用额：</a-col>
            <a-col :span="16" class="mark-conter">
              <a-input-number
                :min="0"
                :max="coupons.acanUse"
                :disabled="editable"
                size="small"
                v-model="aUseAmount"
                @change="aChangeHandler"/>
            </a-col>
            <a-col :span="8" class="mark-title">B账户使用额：</a-col>
            <a-col :span="16" class="mark-conter">
              <a-input-number
                :min="0"
                :max="coupons.bcanUse"
                :disabled="editable"
                size="small"
                v-model="bUseAmount"
                @change="bChangeHandler"/>
            </a-col>
          </a-col>
        </a-collapse-panel>
        <!-- 配送 -->
        <a-collapse-panel header="配送地址" key="5">
          <div style="margin-bottom:10px;">
            <a-checkbox @change="installChange" :checked="isInstall===1?true:false" :disabled="editable">需要安装请勾选</a-checkbox>
            <div style="display:inline-block;margin-left:20px;">
              <span style="margin-right:10px">配送时间:</span>
              <a-date-picker
                placeholder="请选择配送时间"
                format="YYYY-MM-DD HH:mm"
                :disabledDate="disabledDate"
                :disabled="editable"
                v-model="sendTime"
                :showTime="{ format: 'YYYY-MM-DD HH:mm' }"/>
            </div>
          </div>
          <a-card>
            <p style="font-weight:700;margin-bottom:10px;position:relative">
              收货人信息
              <a href="#" class="addAddress" @click="openQueryCustomerModal">选择收货地址</a>
            </p>
            <p class="customer-address" v-if="JSON.stringify(customerAddress)!=='{}'">
              <span class="address-left">{{ customerAddress.name }}</span>
              <span>{{ customerAddress.address }}{{ customerAddress.addressDetail }}</span>
              <span class="address-right" v-if="customerAddress.isDefault">默认地址</span>
            </p>
            <SelectCustomers
              :openFlag="1"
              :customerId="customerId"
              :queryCustomerModal.sync="queryCustomerModal"
              :userInfo="customerInfo"
              @closeCustomerModal="queryCustomerModal=false"
              @setAddress="setAddress"
              @passUserInfo="passUserInfo">
            </selectcustomers></a-card>
          <div style="margin-top:10px">
            <a-textarea placeholder="请输入备注" :autosize="true" v-model="note" :disabled="editable"/>
          </div>
        </a-collapse-panel>
      </a-collapse></div>
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
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="()=>{addEditAddressModal=false}">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="addressSubmit">
          确定
        </a-button>
      </template>
      <!-- 顾客信息表单 -->
      <a-form :form="addressForm">
        <a-row class="doc">
          <a-col :span="4">电话:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customerAddress.telephone', {initialValue:customerAddressInfo.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customerAddress.name', {initialValue:customerAddressInfo.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('customerAddress.address', {initialValue:customerAddressInfo.address || ''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、门牌号等" v-decorator="$check('customerAddress.addressDetail', {initialValue:customerAddressInfo.addressDetail || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">默认收货地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customerAddress.isDefault', {initialValue:customerAddressInfo.isDefault || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragAddressMap" :mapWidth="'100%'" :mapHeight="'400px'" :lat="customerAddressInfo.latitude" :lng="customerAddressInfo.longitude"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import moment from 'moment'
import Amap from '@comp/Amap'
import SelectCustomers from './SelectCustomers'
import SingleSchedule from './SingleSchedule'

export default {
    name: 'GoodsDetail',
    components: {
        Amap,
        SelectCustomers,
        SingleSchedule
    },
    props: {
        // 商品信息
        goodsInfo: {
            type: Object,
            required: true,
            default: () => {}
        },
        height: {
            type: Number,
            required: true,
            default: 0
        },
        // 顾客id
        customerId: {
            type: String,
            required: true
        },
        // 是否允许可编辑
        editable: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            initData: {},
            skuDetails: {},
            skus: [],
            defaultSku: [],
            // 出库方式
            stockOut: [],
            // 仓库列表
            baseStore: [],
            // 默认出库方式
            defaultStockOut: '',
            // 提货位置显示/隐藏标识
            showbaseStore: false,
            // 提货店id
            pickStoreCode: this.$store.getters.storeInfo.code,
            skuCode: '',
            skuName: '',
            skuModel: '',
            unitPrice: 0,
            // 商品实际售价
            actualPrice: 0,
            oldPrice: 0,
            // 购买数量
            quantity: 1,
            // 活动百叶窗key
            collapseActiveKey: ['1', '2', '3', '4', '5'],
            // 店长优惠券
            coupons: {},
            // 店长优惠券相关数据
            aUseAmount: 0,
            bUseAmount: 0,
            // 捆绑商品
            group: {},
            bindArr: [],
            bindGroup: [],
            // 单品活动
            singleSchedule: [],
            returnStandard: 1,
            returnRateAmount: 0,
            returnMaxAmount: 0,
            actualReturn: 0,
            subStandard: 1,
            subRateAmount: 0,
            subMaxAmount: 0,
            actualSub: 0,
            giveStandard: 0,
            treturnStandard: 1,
            tsubStandard: 1,
            tgiveStandard: 0,
            // 套购活动
            arbitrageSchedule: [],
            // 是否使用优惠券
            isCoupon: 0,
            // 是否捆绑商品
            isGroup: 0,
            // 是否安装
            isInstall: 0,
            // 是否参加营销活动
            isSchedule: 0,
            isAddressActive: -1,
            isActivityActive: -1,
            activityPre: -1,
            activityNow: -1,
            // 选中的活动id
            selectedActivityId: '',
            // 选中的活动
            chosenActivity: {},
            chosenActivityId: '',
            // 样式类名
            addressLeft: 'address-left',
            defaultClass: 'default',
            spanStyle: 'span-style',
            addressForm: this.$form.createForm(this),
            // 顾客地址集合
            userAddress: [],
            // 要编辑的顾客地址信息
            addEditAddressModal: false,
            customerAddressInfo: {},
            addressInfo: {},
            addressPre: -1,
            addressNow: -1,
            // 选中的地址信息id
            customerAddress: {},
            customerAddressId: '',
            addEditAddressTitle: '',
            // 配送中的备注信息
            note: '',
            isAdd: false,
            loading: false,
            // sku刷新请求参数
            skuProperties: [],
            beforBindPrice: 0,
            isFirst: true,
            isActivityFirst: true,
            // 配送时间
            sendTime: moment(),
            ifStock: '0',
            // 主商品id
            id: '',
            isActiveProperty: -1,
            baseSkuProperties: [],
            giftsArr: [],
            gifts: [],
            disableChooseGift: true,
            bMax: 0,
            isBaseStore: false,
            baseSkuProperty: '',
            queryCustomerModal: false,
            disableAddSalesBill: false,
            isShowInventory: false,
            customerInfo: {},
            giftDisable: false
        }
    },
    computed: {
        // 总金额
        totalPrice () {
            const { mul } = this.$math
            return Number(mul(this.actualPrice, this.quantity))
        }
    },
    async created () {
        this.isActiveProperty = -1
        this.oldPrice = this.goodsInfo.skuUnitPrice
        // this.skuCode = this.goodsInfo.skuCode
        await this.getSkuDetails(this.goodsInfo.skuCode)
        await this.getInventory(this.goodsInfo.skuCode)
        await this.queryStockOut(this.skuDetails.code)
        await this.getOrderDetails(this.goodsInfo.code)
        await this.queryBindingGoods()
        await this.queryCoupons()
        await this.querySingleSchedule()
        await this.queryArbitrageSchedule()
        await this.getGoodsSkus(this.goodsInfo.skuCode)
        // this.initMainPro()
        this.initCoupon()
        this.initGroup()
        this.initActivity()
        this.initAddressInfo()
        this.initModal()
        await this.refreshInventory()
    },
    methods: {
        passUserInfo (userInfo) {
            console.log('传入的顾客信息：', userInfo)
            this.customerInfo.customerName = userInfo.customerName
            this.customerInfo.customerTelephone = userInfo.customerTelephone
        },
        async getOrderDetails (code) {
            const res = await axios({
                path: 'ShoppingTrolleyQueryShoppingTrolley',
                method: 'post',
                body: {
                    code
                }
            })
            if (res.flag === 1) {
                this.initData = { ...res.data }
                this.customerInfo = this.initData.shoppingTrolley
                this.customerInfo.name = this.customerInfo.customerName
                this.customerInfo.telephone = this.customerInfo.customerTelephone
                this.customerAddressId = this.initData.shoppingTrolley.customerAddressId
                this.isInstall = this.initData.shoppingTrolley.isInstall
                this.pickStoreCode = res.data.shoppingTrolley.pickStoreCode
                res.data.shoppingTrolleySkuList.forEach(item => {
                    if (item.isGroupFlag === 0) {
                        this.skuDetails.code = item.code
                        this.skuDetails.classCode = item.classCode
                        this.skuDetails.brandCode = item.brandCode
                        this.actualPrice = item.actualPrice
                        this.quantity = item.quantity
                        this.id = item.id
                    }
                })
            }
        },
        setAddress (address) {
            this.customerAddress = address
            const data = {
                consigneeName: address.name,
                consigneeTelephone: address.telephone,
                consigneeAddress: address.concatAddress,
                consigneeLongitude: address.longitude,
                consigneeLatitude: address.latitude,
                consigneeAddressDetail: address.addressDetail
            }
            this.customerAddressId = address.id
            this.customerAddress = { ...address, ...data }
            console.log('传入的地址信息：', address)
        },
        openQueryCustomerModal () {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                this.queryCustomerModal = true
            }
        },
        giftChange (activity) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                if (activity.isShow === '0') {
                    this.disableChooseGift = true
                    return
                } else {
                    this.gifts = []
                    this.disableChooseGift = false
                    const newGift = this.giftsArr[this.giftsArr.length - 1]
                    this.giftsArr.splice(0, this.giftsArr.length)
                    this.giftsArr.push(newGift)
                    if (this.giftsArr[0] !== undefined) {
                        this.singleSchedule.forEach(item => {
                            if (item.gifts) {
                                item.selected = true
                                item.gifts.forEach(subItem => {
                                    if (subItem.skuCode === this.giftsArr[0]) {
                                        subItem = {
                                            isGroupFlag: 2,
                                            storeCode: this.$store.getters.storeInfo.code,
                                            name: subItem.skuName,
                                            code: subItem.skuCode,
                                            picture: subItem.skuPic,
                                            unit_price: subItem.skuPrice,
                                            quantity: subItem.skuNum,
                                            skuType: subItem.giftType
                                        }
                                        this.gifts.push(subItem)
                                    }
                                })
                            } else {
                                item.selected = false
                            }
                        })
                        activity.startTime = activity.updateTime = activity.endTime = null
                        activity.scheduleRuleName = activity.name
                        activity.makeStoreCode = this.$store.getters.storeInfo.code
                        activity.standard = activity.reachUnitPrice
                        this.chosenActivity = { ...activity }
                    } else {
                        activity.selected = false
                        this.chosenActivity = {}
                    }
                }
                console.log('-----------------', this.chosenActivity, this.gifts)
            }
        },
        aChangeHandler (val) {
            if (val > this.coupons.acanUse) {
                this.$message.warning('使用额超过可用额度')
            }
        },
        bChangeHandler (val) {
            const { add } = this.$math
            if (val > Number(add(this.coupons.bcanUse, this.coupons.bBushMoney))) {
                this.$message.warning('使用额超过可用额度')
            }
        },
        // 更新销售开单
        updateSalesBill () {
            if (this.check(this.quantity)) {
                this.quantity = 1
                this.$message.warning('购买数量不能为小数')
                return false
            } else if (this.isBaseStore && this.customerAddressId === '') {
                this.$message.warning('请添加收货地址信息')
                return false
            } else if (this.chosenActivity.scheduleType === 'schedule_rule_define_schedule_type:3') {
                if (this.gifts.length === 0) {
                    this.$message.warning('请选择赠品')
                    return false
                }
            }
            let shoppingScheduleRule = {}
            const properties = []
            this.defaultSku.forEach(item => {
                properties.push(item.split(',')[1])
            })
            if (!this.chosenActivity.id) {
                shoppingScheduleRule = null
            } else {
                this.chosenActivity.scheduleEffectType = this.chosenActivity.effectType
                delete this.chosenActivity['id']
                shoppingScheduleRule = { ...this.chosenActivity }
                shoppingScheduleRule.scheduleRuleCode = this.chosenActivity.code !== undefined ? this.chosenActivity.code : null
                shoppingScheduleRule.contractCode = this.skuDetails.contractCode
                shoppingScheduleRule.providerCode = this.skuDetails.providerCode
                if (!shoppingScheduleRule.scheduleRuleName) {
                    shoppingScheduleRule.scheduleRuleName = this.initData.shoppingScheduleRule.scheduleRuleName
                    shoppingScheduleRule.standard = this.initData.shoppingScheduleRule.standard
                    shoppingScheduleRule.makeStoreCode = this.initData.shoppingScheduleRule.makeStoreCode
                }
                shoppingScheduleRule.endTime = shoppingScheduleRule.startTime = shoppingScheduleRule.updateTime = null
                if (this.chosenActivity.activityName === '单品满减') {
                    shoppingScheduleRule.scheduleAmount = this.actualSub
                } else {
                    shoppingScheduleRule.scheduleAmount = this.actualReturn
                }
                console.log('提交的营销活动：', shoppingScheduleRule)
            }
            if (this.aUseAmount !== 0 || this.bUseAmount !== 0) {
                this.isCoupon = 1
            }
            const shoppingTrolley = {}
            shoppingTrolley.aamount = this.coupons.acanUse
            shoppingTrolley.auseAmount = this.aUseAmount
            shoppingTrolley.bamount = this.coupons.bcanUse
            shoppingTrolley.bpushAmount = this.coupons.bBushMoney
            shoppingTrolley.buseAmount = this.bUseAmount
            shoppingTrolley.consigneeName = this.customerAddress.consigneeName
            shoppingTrolley.consigneeTelephone = this.customerAddress.consigneeTelephone
            shoppingTrolley.consigneeAddress = this.customerAddress.consigneeAddress
            shoppingTrolley.consigneeAddressDetail = this.customerAddress.consigneeAddressDetail
            shoppingTrolley.consigneeLongitude = this.customerAddress.consigneeLongitude
            shoppingTrolley.consigneeLatitude = this.customerAddress.consigneeLatitude
            shoppingTrolley.customerAddressId = this.customerAddressId
            shoppingTrolley.customerName = this.customerInfo.customerName
            shoppingTrolley.customerTelephone = this.customerInfo.customerTelephone
            shoppingTrolley.customerId = this.customerId
            shoppingTrolley.guideCode = this.$store.getters.userInfo.code
            shoppingTrolley.guideName = this.$store.getters.userInfo.name
            shoppingTrolley.isCoupon = this.isCoupon
            shoppingTrolley.isGroup = this.isGroup
            shoppingTrolley.isInstall = this.isInstall
            shoppingTrolley.isSchedule = this.isSchedule
            shoppingTrolley.note = this.note
            shoppingTrolley.id = this.initData.shoppingTrolley.id
            shoppingTrolley.code = this.initData.shoppingTrolley.code
            shoppingTrolley.stockOut = this.defaultStockOut
            shoppingTrolley.storeCode = this.$store.getters.storeInfo.code
            shoppingTrolley.pickStoreCode = this.pickStoreCode
            shoppingTrolley.sendTime = this.sendTime
            shoppingTrolley.storeId = this.$store.getters.storeInfo.id
            console.log('提交的其他信息：', shoppingTrolley)
            let shoppingTrolleySkuList = []
            shoppingTrolleySkuList[0] = {}
            shoppingTrolleySkuList[0].ifStock = this.skuDetails.ifStock
            shoppingTrolleySkuList[0].businessType = this.skuDetails.businessType
            shoppingTrolleySkuList[0].classCode = this.skuDetails.classCode
            shoppingTrolleySkuList[0].className = this.skuDetails.className
            shoppingTrolleySkuList[0].brandCode = this.skuDetails.brandCode
            shoppingTrolleySkuList[0].brandName = this.skuDetails.brandName
            shoppingTrolleySkuList[0].actualPrice = this.actualPrice
            shoppingTrolleySkuList[0].batchNo = this.skuDetails.batchNo
            shoppingTrolleySkuList[0].code = this.skuDetails.code
            shoppingTrolleySkuList[0].contractCode = this.skuDetails.contractCode
            shoppingTrolleySkuList[0].id = this.id
            shoppingTrolleySkuList[0].isGroupFlag = 0
            shoppingTrolleySkuList[0].model = this.skuDetails.model
            shoppingTrolleySkuList[0].name = this.skuDetails.name
            shoppingTrolleySkuList[0].providerCode = this.skuDetails.providerCode
            shoppingTrolleySkuList[0].providerName = this.skuDetails.providerName
            shoppingTrolleySkuList[0].quantity = this.quantity
            shoppingTrolleySkuList[0].skuProperty = this.baseSkuProperty
            shoppingTrolleySkuList[0].storeCode = this.$store.getters.storeInfo.code
            shoppingTrolleySkuList[0].unitPrice = this.skuDetails.unitPrice
            console.log('更新订单-赠品：', this.chosenActivity, this.bindGroup)
            if (this.chosenActivity.gifts) {
                shoppingTrolleySkuList = [...shoppingTrolleySkuList, ...this.gifts]
            }
            if (this.bindGroup.length > 0) {
                shoppingTrolleySkuList = [...shoppingTrolleySkuList, ...this.bindGroup]
            }
            console.log('更新订单', { shoppingScheduleRule, shoppingTrolley, shoppingTrolleySkuList })
            axios({
                path: 'ShoppingTrolleyUpdateShoppingTrolley',
                method: 'post',
                body: {
                    shoppingScheduleRule,
                    shoppingTrolley,
                    shoppingTrolleySkuList
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('更新订单后', res.data)
                    this.$emit('refreshUnSettleOrders')
                }
            })
        },
        // setInitData (objData) {
        //     this.initData = { ...objData }
        //     this.customerInfo = this.initData.shoppingTrolley
        //     this.isInstall = this.initData.shoppingTrolley.isInstall
        //     // this.initMainPro()
        //     // this.initCoupon()
        //     // this.initGroup()
        //     // this.initModal()
        //     // this.initAddressInfo()
        //     // this.initActivity()
        // },
        initMainPro () {
            this.initData.shoppingTrolleySkuList.forEach(item => {
                if (item.isGroupFlag === 0) {
                    this.actualPrice = item.actualPrice
                    this.quantity = item.quantity
                    this.id = item.id
                }
            })
            // await this.refreshActivity()
        },
        // 初始化店长优惠券
        initCoupon () {
            this.aUseAmount = this.initData.shoppingTrolley.auseAmount
            this.bUseAmount = this.initData.shoppingTrolley.buseAmount
        },
        // 初始化选中的单品活动
        initActivity () {
            this.singleSchedule.forEach((item, index) => {
                if (this.initData.shoppingScheduleRule !== null && this.initData.shoppingScheduleRule.scheduleEffectType === item.effectType && this.initData.shoppingScheduleRule.scheduleType === item.scheduleType) {
                    this.isSchedule = 1
                    this.isActivityActive = this.activityPre = index
                    this.chosenActivity = { ...item }
                    if (this.initData.shoppingScheduleRule.scheduleType === 'schedule_rule_define_schedule_type:1') {
                        this.actualReturn = this.initData.shoppingScheduleRule.scheduleAmount
                        item.selected = true
                        // this.disableChooseGift = true
                    } else if (this.initData.shoppingScheduleRule.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        this.actualSub = this.initData.shoppingScheduleRule.scheduleAmount
                        item.selected = true
                        // this.disableChooseGift = true
                    } else if (this.chosenActivity.gifts) {
                        // this.disableChooseGift = false
                        this.initData.shoppingTrolleySkuList.forEach(subItem => {
                            if (subItem.isGroupFlag === 2) {
                                item.selected = true
                                this.giftsArr.push(subItem.code)
                                subItem.unit_price = subItem.unitPrice
                                subItem.id = ''
                                this.gifts.push(subItem)
                                console.log('++++++++++', this.giftsArr)
                            }
                        })
                    }
                }
            })
        },
        // 初始化捆绑商品
        initGroup () {
            console.log('初始化捆绑商品方法被调用')
            this.initData.shoppingTrolleySkuList.forEach(item => {
                if (item.isGroupFlag === 1) {
                    this.bindArr.push(item.code)
                    this.bindGroup.push(item)
                }
            })
        },
        // 初始化规格型号
        async initModal () {
            this.defaultStockOut = this.initData.shoppingTrolley.stockOut
            console.log('oooooooooooooooooo', this.defaultStockOut)
            if (this.defaultStockOut === 'shopping_stock_out:1') {
                this.showbaseStore = false
                this.pickStoreCode = this.$store.getters.storeInfo.code
            } else if (this.defaultStockOut === 'shopping_stock_out:2') {
                this.showbaseStore = true
                await this.queryBaseStore()
                this.pickStoreCode = this.initData.shoppingTrolley.pickStoreCode
            } else {
                this.showbaseStore = true
                await this.queryProvider()
                this.pickStoreCode = this.initData.shoppingTrolley.pickStoreCode
            }
        },
        // 初始化地址信息
        initAddressInfo () {
            const data = this.initData.shoppingTrolley
            data.name = data.consigneeName
            data.address = data.consigneeAddress
            data.addressDetail = data.consigneeAddressDetail
            this.customerAddress = data
            this.sendTime = moment(this.initData.shoppingTrolley.sendTime)
            this.note = this.initData.shoppingTrolley.note
        },
        // 新增/编辑地址提交
        addressSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { addressForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.customerAddressId
                    }
                    this.loading = true
                    values.customerId = this.customerId
                    values.latitude = this.addressInfo.lat
                    values.longitude = this.addressInfo.lng
                    values.province = this.addressInfo.province
                    values.city = this.addressInfo.city
                    values.area = this.addressInfo.area
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAddress' : 'CustomerManageUpdateCustomerAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditAddressModal = false
                            this.getCustomerAddress()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 删除地址
        deleteAddress (id) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                const self = this
                this.$confirm({
                    title: '提示',
                    content: '删除后不可恢复，确定删除吗？',
                    onOk () {
                        axios({
                            path: 'CustomerManageDeleteCustomerAddress',
                            method: 'post',
                            body: {
                                id: id
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                self.getCustomerAddress()
                            }
                        })
                    }
                })
            }
        },
        // 拖动地图
        dragAddressMap (data) {
            this.addressInfo.address = data.address
            this.addressForm.setFieldsValue({
                address: data.address
            })
            this.addressInfo.lat = data.position.lat
            this.addressInfo.lng = data.position.lng
            this.addressInfo.province = data.addressComponent.province
            this.addressInfo.city = data.addressComponent.city
            this.addressInfo.area = data.addressComponent.district
        },
        // 新增/编辑顾客地址
        addEditAddress (index, addressInfo) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                if (index === -1) {
                    this.isAdd = true
                    this.customerAddressInfo = {}
                    this.addEditAddressTitle = '新增收货地址'
                } else {
                    this.isAdd = false
                    addressInfo.latitude = String(addressInfo.latitude)
                    addressInfo.longitude = String(addressInfo.longitude)
                    this.customerAddressInfo = addressInfo
                    this.customerAddressId = addressInfo.id
                    this.addEditAddressTitle = '编辑收货地址'
                }
                this.addEditAddressModal = true
            }
        },
        // 配送时间禁用
        disabledDate (current) {
            return moment(current).isBefore(moment().subtract(1, 'days'))
        },
        // 选择配送地址
        chooseAddress (index, id) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                this.addressNow = index
                if (this.addressNow === this.addressPre) {
                // 取消选中
                    this.isAddressActive = this.addressPre = -1
                    this.customerAddressId = ''
                    this.isBaseStore = false
                } else {
                // 选中
                    this.isAddressActive = this.addressPre = index
                    this.customerAddressId = id
                    this.isBaseStore = true
                }
            }
        },
        // 获取顾客地址信息
        getCustomerAddress () {
            if (this.customerId !== '') {
                axios({
                    path: 'CustomerManageQueryUserAddress',
                    method: 'POST',
                    body: {
                        id: this.customerId
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.userAddress = [...res.data]
                    }
                })
            } else {
                this.userAddress = []
            }
        },
        // 是否安装监听
        installChange (e) {
            this.isInstall = e.target.checked ? 1 : 0
            console.log('是否安装：', e, this.isInstall)
        },
        chooseActivity (activity) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                if (activity.scheduleType === 'schedule_rule_define_schedule_type:1' || activity.scheduleType === 'schedule_rule_define_schedule_type:2') {
                    console.log('1111111111111111111111111')
                    this.giftsArr = []
                    this.gifts = []
                    this.singleSchedule.forEach(item => {
                        if (item.scheduleType === activity.scheduleType) {
                            item.selected = !item.selected
                            if (item.selected === true) {
                                activity.startTime = activity.updateTime = activity.endTime = null
                                activity.scheduleRuleName = activity.name
                                activity.makeStoreCode = this.$store.getters.storeInfo.code
                                activity.standard = activity.reachUnitPrice
                                this.chosenActivity = { ...activity }
                                console.log('选择的营销活动：', this.chosenActivity)
                            } else {
                                this.chosenActivity = {}
                                console.log('选择的营销活动：', this.chosenActivity)
                            }
                        } else {
                            item.selected = false
                        }
                    })
                } else {
                    return false
                }
            }
        },
        // 捆绑商品选择
        bindChange (checkedValues) {
            console.log('选中的捆绑商品', checkedValues)
            this.beforBindPrice = this.totalPrice
            if (checkedValues.length > 0) {
                if (this.group.bindNum !== 0 && checkedValues.length > this.group.bindNum) {
                    this.$message.warning(`最多只能选择${this.group.bindNum}个商品`)
                    checkedValues.pop()
                }
                this.isGroup = 1
                this.actualPrice = this.group.mainSkuPrice
                this.clearAB()
                this.clearActivity()
                const tempBindGoods = []
                this.group.bindGoods.forEach(item => {
                    item.actualPrice = item.priceDisc
                    item.code = item.skuCode
                    item.name = item.skuName
                    item.isGroupFlag = 1
                    item.storeCode = this.$store.getters.storeInfo.code
                    item.unitPrice = item.unit
                    item.createTime = item.updateTime = ''
                    checkedValues.forEach(subItem => {
                        if (item.skuCode === subItem) {
                            tempBindGoods.push(item)
                        }
                    })
                })
                this.bindGroup = [...tempBindGoods]
                this.bindGroup.forEach(item => {
                    this.initData.shoppingTrolleySkuList.forEach(subItem => {
                        if (subItem.isGroupFlag === 1 && item.code === subItem.code) {
                            item.id = subItem.id
                        }
                    })
                })
            } else {
                this.isGroup = 0
                this.actualPrice = this.oldPrice
                this.bindGroup = []
                this.clearAB()
                this.clearActivity()
            }
            this.refreshActivity()
        },
        refreshActivity () {
            this.clearAB()
            this.clearActivity()
            this.queryBindingGoods()
            this.queryCoupons()
            this.querySingleSchedule()
            this.queryArbitrageSchedule()
        },
        // 清除AB
        clearAB () {
            const { add } = this.$math
            if (this.aUseAmount > this.coupons.acanUse || this.bUseAmount > Number(add(this.coupons.bcanUse, this.coupons.bBushMoney))) {
                this.aUseAmount = this.bUseAmount = 0
            }
        },
        // 清除活动
        clearActivity () {
            if (this.totalPrice < this.chosenActivity.reachAmount) {
                this.chooseActivity(this.activityPre, this.chosenActivity)
            }
        },
        // 查询捆绑商品列表
        async queryBindingGoods () {
            const self = this
            const res = await axios({
                path: 'GroupDefineQueryBindingGoods',
                method: 'POST',
                body: {
                    skuCode: self.skuDetails.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                this.group = res.data
            }
        },
        // 查询店长优惠券列表
        async queryCoupons () {
            const self = this
            const res = await axios({
                path: 'CouponsUseGetCoupons',
                method: 'POST',
                body: {
                    skuCode: self.skuDetails.code,
                    storeCode: this.$store.getters.storeInfo.code,
                    classCode: self.skuDetails.classCode,
                    brandCode: self.skuDetails.brandCode,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.coupons = res.data
            }
        },
        // 查询单品活动
        async querySingleSchedule () {
            const self = this
            const res = await axios({
                path: 'ScheduRuleGetSingleSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.skuDetails.classCode,
                    brandCode: self.skuDetails.brandCode,
                    skuCode: self.skuDetails.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                const data = res.data
                if (data.length > 0) {
                    data.forEach(item => {
                        item.selected = false
                        if (item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                            item.activityName = '单品满返'
                            item.desc = `满${item.reachUnitPrice}返${item.rateAmount}`
                            this.actualReturn = item.shouldRateAmount
                        } else if (item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                            item.activityName = '单品满减'
                            item.desc = `满${item.reachUnitPrice}减${item.rateAmount}`
                            this.actualSub = item.shouldRateAmount
                        } else {
                            item.activityName = '单品满赠'
                            item.desc = `满${item.reachAmount}赠以下商品`
                            if (item.isShow === '0') {
                                this.disableChooseGift = true
                                this.giftDisable = true
                            } else {
                                this.disableChooseGift = false
                                this.giftDisable = false
                            }
                        }
                    })
                    this.singleSchedule = data
                }
                console.log('单品活动：', this.singleSchedule)
            }
        },
        // 查询套购活动
        async queryArbitrageSchedule () {
            this.arbitrageSchedule = []
            const self = this
            const res = await axios({
                path: 'ScheduRuleGetArbitrageSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.skuDetails.classCode,
                    brandCode: self.skuDetails.brandCode,
                    skuCode: self.skuDetails.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                const data = res.data
                if (data.length > 0) {
                    data.forEach(item => {
                        if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                            console.log(1)
                            item.activityName = '套购满返'
                            item.desc = `满${item.reachAmount}返${item.rateAmountT}`
                        } else if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                            console.log(2)
                            item.activityName = '套购满减'
                            item.desc = `满${item.reachAmount}减${item.rateAmountT}`
                        } else {
                            console.log(3)
                            item.activityName = '套购满赠'
                            item.desc = `满${item.reachAmount}赠以下商品`
                        }
                    })
                }
                this.arbitrageSchedule = data
                console.log('套购活动：', res.data)
            }
        },
        // 查询满用活动
        async queryFullUseSchedule () {
            const self = this
            const res = axios({
                path: 'ScheduRuleGetFullUseSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.skuDetails.classCode,
                    brandCode: self.skuDetails.brandCode,
                    skuCode: self.skuDetails.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                console.log('满用活动', res.data)
                const data = res.data
                if (data.length > 0) {
                    data.forEach(item => {
                        item.activityName = '满用'
                        item.desc = `满${item.reachAmount}可用${item.rateAmount}电子券`
                    })
                    this.arbitrageSchedule.push(data[0])
                }
            }
        },
        // 实际售价监听
        actualPriceChangeHandler (val, priceMin) {
            if (val < priceMin) {
                this.$message.warning('实际售价不能小于限价')
            }
        },
        // 选择规格型号
        async selectProperty (property, index) {
            if (this.editable === true) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                this.isActiveProperty = index
                this.bindArr = []
                this.isInstall = 0
                this.baseSkuProperty = property.specs
                this.baseSkuProperties.forEach(item => {
                    if (item.skuCode === property.skuCode) {
                        item.current = true
                    }
                    item.current = false
                })
                this.showbaseStore = false
                this.pickStoreCode = this.$store.getters.storeInfo.code
                await this.getSkuDetails(property.skuCode, this.pickStoreCode)
                await this.getInventory(property.skuCode, this.pickStoreCode)
                await this.queryStockOut(property.skuCode)
                await this.queryBindingGoods()
                await this.queryCoupons()
                await this.querySingleSchedule()
                await this.queryArbitrageSchedule()
            }
        },
        // 提货位置监听
        async baseStoreChangeHandler (val) {
            this.pickStoreCode = val
            await this.refreshInventory()
        },
        // 查询商品规格型号
        async getGoodsSkus (code) {
            this.skus = []
            if (code) {
                const res = await axios({
                    path: 'DistOriginDataFindSkuPropertyBySkuCode',
                    method: 'POST',
                    body: { code }
                })
                if (res.flag === 1) {
                    console.log('商品属性：', res.data)
                    const data = res.data
                    data.forEach(item => {
                        if (item.current) {
                            this.baseSkuProperty = item.specs
                        }
                    })
                    this.baseSkuProperties = data
                }
            }
        },
        // 查询商品详情
        async getSkuDetails (code, pickStoreCode) {
            const self = this
            const { flag, data } = await axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuDetails',
                method: 'POST',
                body: {
                    code: code,
                    noteA: pickStoreCode,
                    storeCode: this.$store.getters.storeInfo.code
                }
            })
            if (flag === 1) {
                self.actualPrice = self.oldPrice = data.unitPrice
                // self.getInventory(code, pickStoreCode)
            }
            // .then(res => {
            //     if (res.flag === 1) {
            //         self.actualPrice = self.oldPrice = res.data.unitPrice
            //         self.getInventory(code, pickStoreCode)
            //     }
            // })
            // if (flag === 1) {
            //     // self.skuDetails = {
            //     //     code: res.data.code,
            //     //     name: res.data.name,
            //     //     model: res.data.model,
            //     //     unitPrice: res.data.unitPrice,
            //     //     priceMin: Number(res.data.priceMin),
            //     //     businessType: res.data.businessType,
            //     //     batchNo: res.data.batchNo,
            //     //     providerCode: res.data.providerCode,
            //     //     providerName: res.data.providerName,
            //     //     contractCode: res.data.contractCode,
            //     //     brandCode: res.data.brandCode,
            //     //     classCode: res.data.classCode,
            //     //     brandName: res.data.brandName,
            //     //     rate: res.data.rate,
            //     //     taxRate: res.data.taxRate,
            //     //     src: 'https://img11.360buyimg.com/n1/jfs/t29518/5/50591075/273007/2bc96965/5be66874N2b394fba.jpg'
            //     // }
            //     // self.actualPrice = res.data.unitPrice
            //     // self.queryBindingGoods()
            //     // self.queryCoupons()
            //     // self.querySingleSchedule()
            //     // self.queryArbitrageSchedule()
            //     self.getInventory(code, pickStoreCode)
            // }
        },
        async getInventory (code, pickStoreCode) {
            const self = this
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuContract',
                method: 'POST',
                body: {
                    noteA: pickStoreCode,
                    code: code,
                    storeCode: self.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                self.skuDetails = {
                    code: res.data.code,
                    name: res.data.name,
                    model: res.data.model,
                    unitPrice: res.data.unitPrice,
                    businessType: res.data.businessType,
                    batchNo: res.data.batchNo,
                    providerCode: res.data.providerCode,
                    providerName: res.data.providerName,
                    contractCode: res.data.contractCode,
                    brandCode: res.data.brandCode,
                    className: res.data.className,
                    priceMin: Number(res.data.priceMin),
                    skuType: res.data.skuType,
                    classCode: res.data.classCode,
                    brandName: res.data.brandName,
                    rate: res.data.rate,
                    taxRate: res.data.taxRate,
                    ifStock: res.data.ifStock,
                    inventory: res.data.inventory,
                    src: 'https://img11.360buyimg.com/n1/jfs/t29518/5/50591075/273007/2bc96965/5be66874N2b394fba.jpg'
                }
                // self.queryStockOut(res.data.code)
                // self.queryBindingGoods()
                // self.queryCoupons()
                // self.querySingleSchedule()
                // self.queryArbitrageSchedule()
                this.disableAddSalesBill = false
            } else {
                this.disableAddSalesBill = true
            }
        },
        async refreshInventory () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryStockInfo',
                method: 'POST',
                body: {
                    storeCode: this.pickStoreCode, // 切换到仓库code
                    code: this.skuDetails.code
                }
            })
            if (res.flag === 1) {
                this.skuDetails.inventory = res.data.inventory
            }
        },
        // 查询出库方式
        async queryStockOut (skuCode) {
            this.stockOut = []
            const res = await axios({
                path: 'ShoppingTrolleyQueryStockOut',
                method: 'POST',
                body: {
                    skuCode: skuCode
                }
            })
            if (res.flag === 1) {
                let data = res.data
                this.defaultStockOut = `${data[0].type}:${data[0].configKey}`
                this.isBaseStore = false
                if (this.skuDetails.businessType === 'provider_contract_business_type:2' && this.skuDetails.ifStock === '0') {
                    data = data.filter(item => item.configKey !== 2)
                    this.isShowInventory = false
                } else if (this.skuDetails.businessType === 'provider_contract_business_type:1' && this.skuDetails.ifStock === '1') {
                    data = data.filter(item => item.configKey !== 3)
                    this.isShowInventory = true
                } else if (this.skuDetails.businessType === 'provider_contract_business_type:2' && this.skuDetails.ifStock === '1') {
                    this.isShowInventory = true
                    data = data.filter(item => item.configKey !== 3)
                }
                this.stockOut = [...data]
            }
            // .then(res => {
            //     if (res.flag === 1) {
            //         let data = res.data
            //         this.defaultStockOut = `${data[0].type}:${data[0].configKey}`
            //         this.isBaseStore = false
            //         if (this.skuDetails.businessType === 'provider_contract_business_type:2' && this.skuDetails.ifStock === '0') {
            //             data = data.filter(item => item.configKey !== 2)
            //             this.isShowInventory = false
            //         } else if (this.skuDetails.businessType === 'provider_contract_business_type:1' && this.skuDetails.ifStock === '1') {
            //             data = data.filter(item => item.configKey !== 3)
            //             this.isShowInventory = true
            //         } else if (this.skuDetails.businessType === 'provider_contract_business_type:2' && this.skuDetails.ifStock === '1') {
            //             this.isShowInventory = true
            //             data = data.filter(item => item.configKey !== 3)
            //         }
            //         this.stockOut = [...data]
            //     }
            // })
        },
        // 出库方式变化监听
        stockOutChangeHandler (value) {
            this.baseStore = []
            this.defaultStockOut = value
            this.showbaseStore = false
            if (value === 'shopping_stock_out:1') {
                this.showbaseStore = false
                this.isBaseStore = false
                this.baseStore = []
                this.pickStoreCode = this.$store.getters.storeInfo.code
                this.refreshInventory()
            } else if (value === 'shopping_stock_out:2') {
                // 仓库送货
                this.showbaseStore = true
                this.isBaseStore = true
                this.queryBaseStore()
            } else if (value === 'shopping_stock_out:3') {
                // 厂家配送
                this.showbaseStore = true
                this.isBaseStore = false
                this.queryProvider()
            }
        },
        // 购买数量变化监听
        quantityChangeHandler (val, inventory) {
            if (typeof val === 'string') {
                this.quantity = 1
            } else if (val > inventory && this.ifStock === '1') {
                this.$message.warning('库存不足')
            }
        },
        // 仓库送货
        async queryBaseStore () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryBaseStore',
                method: 'POST',
                body: {
                    id: this.$store.getters.storeInfo.id
                }
            })
            if (res.flag === 1) {
                this.showbaseStore = true
                const data = res.data
                data.forEach(item => {
                    item.title = `${item.code}--${item.name}`
                    item.key = item.id
                    item.value = item.code
                })
                this.baseStore = [...data]
                this.pickStoreCode = data[0].code
                console.log('3333333333333333', this.pickStoreCode)
                // this.refreshInventory()
            }
        },
        // 厂家配送
        async queryProvider () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryProviderBySku',
                method: 'POST',
                body: {
                    code: this.skuDetails.code
                }
            })
            if (res.flag === 1) {
                if (res.data.length > 0) {
                    this.showbaseStore = true
                    const data = res.data
                    data.forEach(item => {
                        item.title = `${item.code}--${item.name}`
                        item.key = item.id
                        item.value = item.code
                    })
                    this.pickStoreCode = data[0].code
                    this.baseStore = [...data]
                }
            }
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        // 小数验证
        check (c) {
            const r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/
            return r.test(c)
        },
        closeHandler () {
            this.isFirst = true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ShoppingGuideBilling') {
            }
        },
        totalPrice (newVal, oldVal) {
            if (oldVal !== 0 && JSON.stringify(this.skuDetails) !== '{}') {
                this.clearAB()
                this.singleSchedule.forEach(item => {
                    if (newVal < item.reachAmount) {
                        this.querySingleSchedule()
                    }
                    this.clearActivity()
                })
                this.arbitrageSchedule.forEach(item => {
                    if (newVal < item.reachAmount) {
                        this.queryArbitrageSchedule()
                    }
                })
                this.queryCoupons()
            }
        }
        // totalPrice: {
        //     handler (newVal, oldVal) {
        //         if (newVal <= oldVal) {
        //             this.aUseAmount = this.bUseAmount = 0
        //             this.chooseActivity(this.activityPre, this.chosenActivityId)
        //         }
        //         if (newVal >= this.subStandard || newVal >= this.returnStandard || newVal >= this.giveStandard || newVal >= this.tsubStandard || newVal >= this.treturnStandard || newVal >= this.tgiveStandard) {
        //             this.getActivities(this.skuDetails.skuCode, this.skuDetails.classCode, this.skuDetails.brandCode)
        //             this.actualSub = this.shouldSub
        //             this.actualReturn = this.shouldReturn
        //             this.singleSchedule.forEach(item => {
        //                 if (newVal >= item.standard) {
        //                     item.isShow = true
        //                 } else {
        //                     item.isShow = false
        //                 }
        //             })
        //             this.arbitrageSchedule.forEach(item => {
        //                 if (newVal >= item.standard) {
        //                     item.isShow = true
        //                 } else {
        //                     item.isShow = false
        //                 }
        //             })
        //         } else {
        //             this.singleSchedule.forEach(item => {
        //                 item.isShow = false
        //             })
        //             this.arbitrageSchedule.forEach(item => {
        //                 item.isShow = false
        //             })
        //         }
        //     }
        // }
    }
}
</script>

<style lang="less" scoped>
.ant-card-bordered{
  margin: 0px;
}
.btn-box{
    width:100%;
    display: flex;
    display: -webkit-inline-flex;
    flex-flow:row nowrap;
    justify-content: space-between;
    align-items:center;
    line-height:32px;
    font-size:14px;
    .left-box{
        width: 50%;
        flex-flow:row nowrap;
        justify-content: flex-start;
    }
    .right-box{
        width: 50%;
        flex-flow:row nowrap;
        justify-content: flex-end;
    }
}
.mark-title{
    text-align: right;
    font-weight: bold;
    padding-right: 10px;
    font-size: 12px;
    line-height: 34px;
}
.mark-conter{
    font-size: 12px;
    line-height:34px;
}
.goods-box{
    display: flex;
    display: -webkit-inline-flex;
    width: 100%;
    margin-bottom: 20px;
    min-height: 270px;
    padding-left: 20px;
    flex-flow:row nowrap;
    justify-content: flex-start;
    &-img{
        max-width:400px;
        width:auto;
        height: 270px;
        display: block;
    }
    &-info-box{
        min-height: 270px;
        width:100%;
        padding: 10px;
        margin-left: 20px;
        .title{
            font-weight: bold;
            font-size: 20px;
            line-height: 40px;
            color:#000;
            margin-right: 5px;
        }
        .price{
            font-weight: bold;
            font-size: 30px;
            line-height: 40px;
            color:#000;
            margin-right: 5px;
        }
        .info{
            font-weight: bold;
            font-size: 14px;
            line-height: 40px;
            margin-right: 5px;
        }
        .property {
          margin: 10px 0;
          display: flex;
          .right {
            span {
              margin: 0 10px 10px 0;
            }
          }
        }
        .store-info{
            // display: flex;
            // display: -webkit-inline-flex;
            // flex-flow:row nowrap;
            // justify-content: flex-start;
        }
    }
}
// 商品瀑布流
.img-info{
    padding: 0 10px;
    width:100%;
    .price{
        font-weight: bold;
        font-size: 1.5;
        line-height: 2;
        color:#000;

    }
    .title{
        font-size: 14px;
        line-height: 2;
        color:#000;
    }
    .info{
        font-size: 14px;
        line-height: 2;
        color:#9fa8bb;
    }
}
.seach-box{
    margin-bottom: 10px;
}
img{
  width:auto;
  height: auto;
  max-width: 100%;
  display: block;
}
.user {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
}
// 抽屉样式
.ant-drawer-body {
    padding: 0;
    .user-list {
      padding: 0;
      list-style: none;
      li {
        cursor: pointer;
        display:flex;
        padding-left: 20px;
        height: 39px;
        line-height:39px;
        border-bottom:1px solid #ccc;
        .user-info {
          flex: 3;
          display: inline-block;
        }
        .user-cart {
          flex: 1;
          display: inline-block;
          text-align: center;
          color: rgb(56,173,255);
        }
        .user-edit {
          flex: 1;
          display: inline-block;
          text-align: center
        }
      }
  }
}
// 购物车复选框组样式
.ant-checkbox-group {
  width: 100%;
  .pro{
    height:100px;
    .fbox {
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    img {
      height: 70px;
      width:70px;
      margin-top: 15px;
    }
    .pro-info {
      display:flex;
      flex-direction: column;
      justify-content:space-between;
      padding: 15px 0 15px 10px;
      .pro-title {
        font-weight: 700;
        padding-right: 15px;
      }
      p {
        height: 20px;
        line-height:20px;
      }
      .pro-pc{
        display: flex;
        justify-content: space-between;
        padding-right: 15px;
        .price {
          color: rgb(56,173,255);
        }
        .count {
          font-size: 12px;
          color: #aaa;
        }
      }
    }
  }
}
.addAddress{
  position: absolute;
  right:10px;
  text-decoration: none;
  color: rgb(56,173,255);
  font-weight: 400;
  font-size:12px;
}
// 顾客地址
.customer-address {
  font-size: 12px;
  position:relative;
  height: 32px;
  line-height: 32px;
  .address-left {
    display: inline-block;
    width: 90px;
    border:1px dotted #eee;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;
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
// 选中活动激活样式
.active{
  border:1px solid rgb(56,173,255);
  color: rgb(56,173,255);
}
.span-style{
  display: inline-block;
  width: 80px;
  height: 30px;
  margin-right: 10px;
  padding: 5px;
  font-size:12px;
  border:1px dotted #eee;
  color:#aaa;
  text-align:center;
}
.span-active{
  font-size:12px;
  background: rgb(56,173,255);
  color: #fff;
  text-align:center;
  border:1px dotted #eee;
}
//营销活动样式重写
/deep/.ant-card-bordered {
  margin-bottom: 0px !important;
  /deep/.ant-card-body {
  padding:10px !important;
  .activity-box{
    display: flex;
    .activity-desc{
      height:32px;
      line-height: 32px;
      flex: 3;
    }
    .amount {
      display: flex;
      height:32px;
      line-height: 32px;
      flex:1;
      div{
        flex: 1;
      }
    }
  }
}
}

// 赠品样式重写
.gift {
  margin-bottom: 10px;
  .ant-checkbox-wrapper {
    width: 80px;
    text-align: center;
    height: 90px;
    line-height: 90px;
  }
  .gift-box{
    display: flex;
    .gift-img {
      width: 70px;
      height: 90px;
      margin: 10px;
    }
    .gift-info {
      padding-top: 10px;
      flex:1;
      p{
        margin-bottom: 12px;
        font-weight: 700;
      }
    }
  }
}
// 捆绑商品样式重写
.bind-goods{
  /deep/.ant-card-body {
    padding: 10px;
    .bind-box {
      display: flex;
      height: 100px;
      .check-box{
        width: 30px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .goods-box {
        display: flex;
        flex: 1;
        .img-box{
          width: 70px;
          height: 90px;
          margin: 10px;
        }
        .goods-info{
          padding-top: 10px;
          flex:8;
          p{
            margin-bottom: 12px;
            font-weight: 700;
          }
        }
        .goods-quantity{
          flex:2;
          height:100px;
          line-height: 100px;
        }
      }
    }
  }
}
// 规格型号
.btn-style {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border: 1px solid #ccc;
  text-align: center;
  padding: 0 10px;
  border-radius: 3px;
  cursor: pointer;
}
.defaultStyle,
.propertyActive {
  background: #1890ff;
  color: #fff;
  border: none;
}

</style>

<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: laikt
 * @Date: 2019-04-18 15:04:31
 * @LastEditTime: 2019-08-23 14:49:29
 -->
<template>
  <div class="goods">
    <div class="details-header">
      <ul>
        <li>
          客户渠道：<span>{{ isAdd?customerCode+'-'+customer:goods.customerCode+'-'+goods.customerName }}</span>
        </li>
        <li>
          提货类型：<span>{{ isAdd? packupCode==='1'?"客户自提":"集中配送":goods.takeType==='1'?"客户自提":"集中配送" }}</span>
        </li>
        <li>
          提货位置：<span>{{ isAdd?warehouse.code+'-'+ warehouse.name: goods.takeStoreCode+'-'+goods.takeStoreName }}</span>
        </li>
        <li>
          分销类型：<span>{{ isAdd?salesApproach==='0'?"经销":"代销":goods.saleType===0?"经销":"代销" }}</span>
        </li>
      </ul>
      <div class="goods-menu">
        <a-popover trigger="click" placement="bottom" :visible="clicked" @visibleChange="handleClickChange">
          <template slot="content">
            <p @click="isChange(0)">新增开票</p>
            <p @click="isChange(2)">开票主页（{{ selectBillCount }}）</p>
          </template>
          <div>
            新增开票 <a-icon type="bars" />
          </div>
        </a-popover>
      </div>
    </div>
    <div :gutter="10" type="flex" justify="center" class="goods-details">
      <div class="details">
        <img
          v-if="goods.mainGoodsPic[0]"
          :src="goods.mainGoodsPic[0]||''"
          alt=""
          @error.once="moveErrorImg($event)"
          class="goods-img">
        <!-- <img v-if="rep.goodPic[0]" :src="rep.goodPic[0]" alt="" @error.once="moveErrorImg($event)"> -->
        <img v-else src="@assets/goods.png" alt="" class="goods-img">
        <div class="operation">
          <h1> {{ goods.mainGoodsCode }}  {{ goods.mainGoodsName }} {{ goods.mainGoodsModel }}</h1>
          <h3>分销价格：<span>¥ {{ goods.minPrice.toFixed(2) }}～{{ goods.maxPrice.toFixed(2) }}</span></h3>
          <div class="specifications">
            <ul>
              <li v-for="item in goods.wholesaleBillDetailList" :key="item.skuCode" class="sku-item">
                <div class="item-title">
                  <span>{{ item.skuCode }} {{ item.skuName }}</span>
                </div>
                <div class="item-price">
                  <template v-if="item.type==='null'">
                    ¥  <a-input-number v-model="item.billPrice" />
                  </template>
                  <template v-else>
                    ¥ {{ item.billPrice.toFixed(2) ||item.goodsPrice.toFixed(2) }}
                  </template>
                </div>
                <div class="item-secl" v-if="item.skuPolicyList&&item.skuPolicyList.length">
                  <a-select
                    :placeholder="item.skuPolicyList&&item.skuPolicyList.length?`当前支持${item.skuPolicyList.length-1}活动可选`:'暂无活动'"
                    style="width: 180px"
                    @change="handleChange(item)"
                    v-model="item.strategyDefineType">
                    <a-select-option :value="sku.type" v-for="sku in item.skuPolicyList" :key="sku.type">{{ sku.name }}</a-select-option>
                  </a-select>
                </div>
                <div class="item-secl" v-else>
                  {{ item.strategyDefineName||'暂无活动' }}
                </div>
                <div class="item-num">
                  {{ item.numbers }}可售
                </div>
                <div class="item-thenum">
                  <template v-if="item.strategyDefineNum==='7'">
                    <a-input-number
                      :min="0"
                      :max="1"
                      v-model="item.billQuantity"
                      @change="defaultValue(item)">
                    </a-input-number></template>
                  <template v-else>
                    <a-input-number
                      :min="0"
                      v-model="item.billQuantity"

                      @change="defaultValue(item)"/>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="count">
        <p>
          合计：<span>{{ totalNum }} 台</span> <span> {{ totalPrice.toFixed(2) }} 元</span>
        </p>
        <a-button-group size="large">
          <a-button size="large" @click="addOrder()" v-if="isAdd">加入开票</a-button>
          <a-button size="large" @click="editOrder()" v-else>确定</a-button>
          <a-button size="large" @click="notOrder()">未提交订单({{ selectBillCount }})</a-button>
        </a-button-group>
      </div>
      <div class="introduction" v-html="goods.introduction">

      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
import userPhoto from '@assets/goods.png'

export default {
    name: 'GoodsDetails',
    props: {
        customer: {
            type: String,
            default: ''
        },
        customerCode: {
            type: String,
            default: ''
        },
        goodsId: {
            type: Object,
            default: function () {
                return {}
            }
        },
        salesApproach: {
            type: String,
            default: ''
        },
        warehouse: {
            type: Object,
            default: function () {
                return {}
            }
        },
        packupCode: {
            type: String,
            default: ''
        },
        selectBillCount: {
            type: Number,
            default: 0
        },
        billSelectSkuCount: {
            type: Number,
            default: 0
        },
        isAdd: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            clicked: false,
            goods: {},
            // 总价格
            totalPrice: 0,
            // 总个数
            totalNum: 0,
            skuStockNum: '',
            skuCodes: []
            // // 是否新增
            // isAdd: false

        }
    },

    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    /**
     * @name: 监听 商品信息 计算价格
     * @msg:
     * @param {type}
     * @return:
     */
    watch: {
        goods: {
            handler (newName, oldName) {
                // console.log(newName)
                if (newName) {
                    if (newName.wholesaleBillDetailList) {
                        this.totalPrice = 0
                        this.totalNum = 0
                        newName.wholesaleBillDetailList.forEach(el => {
                            // el.billQuantity = 0
                            this.totalPrice += el.billQuantity * el.billPrice
                            this.totalNum += el.billQuantity
                        })
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    /**
     * @name: 创建时判断是否为新增状态
     * @msg:
     * @param {type}
     * @return:
     */
    created () {
        console.log(this.goodsId)
        // this.goods =
        // debugger
        const goods = JSON.parse(JSON.stringify(this.goodsId))

        if (this.isAdd) {
            goods.wholesaleBillDetailList = goods.wholesaleOrderDetailList
            this.skuCodes = []
            goods.wholesaleBillDetailList.forEach(el => {
            // el.billQuantity = 0
                this.skuCodes.push(el.skuCode)
                el.strategyDefineCode = undefined
                el.goodsPrice = el.billPrice
                el.billPrice = el.billPrice || el.price || 0
                el.strategyDefineNum = el.strategyDefineType ? el.strategyDefineType.split(':')[1] : ''
                el.strategyDefineType = el.strategyDefineType || undefined
                el.goodCode = goods.mainGoodsCode
                el.goodName = goods.mainGoodsName
                el.goodPic = goods.mainGoodsPic[0]
                // el.skuPolicyList = el.skuPolicyList || []
                if (el.skuPolicyList && el.skuPolicyList.length) {
                    el.skuPolicyList.push({
                        name: '不参加活动',
                        strategyDefineCode: 'null',
                        type: '',
                        strategyPrice: el.billPrice
                    })
                }
            })
            this.goods = goods
            this.queryGoodsNum()
        } else {
            console.log(goods.wholesaleBillDetailList)

            const data = {
                saleStoreCode: this.storeInfo.code,
                // createBy: this.userInfo.code, // 订单状态
                takeStoreCode: goods.takeStoreCode,
                // 订单状态
                status: '1',
                // 订单号
                code: goods.code,
                searchParam: goods.goodCode

            }
            // 修改时请求详细数据
            this.findOrderEdit(data)
        }
    },
    methods: {
        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        //  条件查询  商品库存接口
        queryGoodsNum () {
            axios({
                path: 'DistLogisticsFindSkuStockNumByParam',
                method: 'post',
                body: {
                    storeCode: this.warehouse.code,
                    codeList: this.skuCodes
                }
            }).then((res) => {
                if (res.flag === 1) {
                    this.skuStockNum = res.data
                    this.goods.wholesaleBillDetailList.forEach(sku => {
                        this.skuStockNum.forEach(num => {
                            if (sku.skuCode === num.skuCode) {
                                sku.numbers = num.stockNum
                            }
                        })
                    })
                }
            })
        },
        /**
         * @name: 获取编辑数据
         * @msg:
         * @param {type}
         * @return:
         */
        findOrderEdit (data) {
            axios({
                path: 'DistWholesaleBillFindBillEdit',
                method: 'post',
                body: data
            }).then((res) => {
                if (res.flag === 1) {
                    if (res.data) {
                        // console.log(res.data)
                        this.goods = res.data
                        console.log(this.goods)

                        // this.goods.forEach(el => {
                        this.goods = JSON.parse(JSON.stringify(res.data))

                        const pic = this.goods.mainGoodsPic ? this.goods.mainGoodsPic.split(',') : ['']
                        console.log(pic)
                        // this.goods.wholesaleBillDetailList.forEach(el => {
                        //     el.strategyDefineNum = el.strategyDefineType ? el.strategyDefineType.split(':')[1] : ''
                        //     el.strategyDefineType = el.strategyDefineType || undefined
                        //     // el.skuPolicyList = el.skuPolicyList || []
                        // })
                        this.skuCodes = []
                        this.goods.mainGoodsPic = pic
                        this.goods.wholesaleBillDetailList.forEach((el, index) => {
                            // el.billPrice =
                            this.skuCodes.push(el.skuCode)
                            el.strategyDefineNum = el.strategyDefineType ? el.strategyDefineType.split(':')[1] : ''
                            el.strategyDefineType = el.strategyDefineType || undefined
                            const data = res.data.wholesaleBillDetailList[index]
                            el.goodsPrice = data.billPrice || data.price || 0
                            console.log(el.goodsPrice)
                            if (el.skuPolicyList && el.skuPolicyList.length) {
                                // console.log(el.skuPolicyList[el.skuPolicyList.length - 1].strategyDefineCode)
                                // el.skuPolicyList[el.skuPolicyList.length - 1].strategyDefineCode = el.skuPolicyList[el.skuPolicyList.length - 1].strategyDefineCode || 'null'
                                // console.log(el.skuPolicyList[el.skuPolicyList.length - 1].strategyDefineCode)
                                el.skuPolicyList.push({
                                    name: '不参加活动',
                                    strategyDefineCode: 'null',
                                    type: '',
                                    strategyPrice: el.billPrice
                                })
                                el.skuPolicyList.forEach(item => {
                                    console.log(el.strategyDefineType, item.type)
                                    if (el.strategyDefineType === item.type) {
                                        el.billPrice = item.strategyPrice
                                    }
                                })
                            }
                        })
                        this.queryGoodsNum()

                        // })
                    }
                }
            })
        },
        /**
         * @name: 提交编辑状态下数据
         * @msg:
         * @param {type}
         * @return:
         */
        editOrder () {
            if (this.totalNum > 0) {
                const data = JSON.parse(JSON.stringify(this.goods))
                // const data = this.goods
                data.saleAmount = this.totalPrice// *价格总数
                data.sourceType = data.sourceType || '3'
                data.wholesaleBillDetailList = data.wholesaleBillDetailList.filter(el => {
                    return el.billQuantity > 0
                })
                delete data.mainGoodsPic

                console.log(data)
                axios({
                    path: 'DistWholesaleBillUpdateBillEdit',
                    method: 'post',
                    body: {
                        wholesaleBillVoList: [data]
                    }
                }).then((res) => {
                    if (res.flag === 1) {
                        let secondsToGo = 3
                        const modal = this.$success({
                            title: '提示',
                            content: '编辑开票成功'
                        })
                        const interval = setInterval(() => {
                            secondsToGo -= 1
                        }, 1000)
                        setTimeout(() => {
                            clearInterval(interval)
                            modal.destroy()
                        }, secondsToGo * 1000)
                        this.$emit('activeComponent', 4)
                    }
                })
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
        // 组件切换 0:主页；1:详情；2：订单
        isChange (com) {
            this.$emit('activeComponent', com)
            this.clicked = false
        },
        defaultValue (value) {
            console.log(value)
            if (value.billQuantity === '' || typeof value.billQuantity === 'undefined') {
                value.billQuantity = 0
            }
        },
        /**
         * @name: 菜单显示隐藏控制
         * @msg:
         * @param {type}
         * @return:
         */
        handleClickChange (visible) {
            // console.log(visible)
            this.clicked = visible
        },
        /**
         * @name: 修改活动策略
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (value) {
            console.log(value)
            if (typeof value.strategyDefineType === 'undefined') {
                value.billPrice = value.goodsPrice
                return
            }
            value.skuPolicyList.forEach(el => {
                if (value.strategyDefineType === el.type) {
                    if (value.strategyDefineType !== '') {
                        value.billPrice = el.strategyPrice
                        if (this.isAdd) {
                            axios({
                                path: 'DistWholesaleOrderDetailFindOrderSkuInfoByCode',
                                method: 'post',
                                body: {
                                    saleStoreCode: this.storeInfo.code,
                                    createBy: this.userInfo.code,
                                    takeStoreCode: this.warehouse.code,
                                    customerCode: this.customerCode,
                                    wholesaleType: this.salesApproach,
                                    takeType: this.packupCode,
                                    skuCode: value.skuCode,
                                    strategyDefineType: value.strategyDefineType || null,
                                    sourceCode: this.goods.sourceCode,
                                    sourceType: this.goods.sourceType
                                }
                            }).then((res) => {
                                if (res.flag === 1 && res.data === 'true') {
                                    value.strategyDefineName = el.name
                                    value.strategyDefineCode = el.strategyDefineCode
                                    value.strategyDefineNum = value.strategyDefineType.split(':')[1]
                                    value = Object.assign({}, value)
                                } else {
                                    value.billPrice = value.goodsPrice

                                    value.strategyDefineType = undefined
                                }
                            })
                        } else {
                            if (value.strategyDefineType.split(':')[1] === '7') {
                                axios({
                                    path: 'DistWholesaleOrderDetailFindEditPrototypeByCumstomerCode',
                                    method: 'post',
                                    body: {
                                        code: this.goods.code,
                                        customerCode: this.goods.customerCode,
                                        skuCode: value.skuCode
                                    }
                                }).then((res) => {
                                    if (res.flag === 1 && res.data === 'true') {
                                        value.strategyDefineName = el.name
                                        value.strategyDefineCode = el.strategyDefineCode
                                        value.strategyDefineNum = value.strategyDefineType.split(':')[1]
                                        value = Object.assign({}, value)
                                    } else {
                                        value.billPrice = value.goodsPrice
                                        value.strategyDefineType = undefined
                                    }
                                })
                            } else {
                                value.strategyDefineName = el.name
                                value.strategyDefineCode = el.strategyDefineCode
                                value.strategyDefineNum = value.strategyDefineType.split(':')[1]
                                console.log(value)
                            }
                        }
                    } else {
                        value.billPrice = value.goodsPrice
                        value.strategyDefineType = undefined
                    }
                }
            })
        },
        /**
         * @name: 添加订单
         * @msg:
         * @param {type}
         * @return:
         */
        addOrder () {
            const data = JSON.parse(JSON.stringify(this.goods))
            if (this.totalPrice > 0 && this.totalNum > 0) {
                data.saleStoreCode = data.saleStoreCode || this.storeInfo.code//*  店code
                data.makeStoreCode = data.makeStoreCode || this.storeInfo.code // *    店code
                data.takeType = this.packupCode
                data.sourceType = '3'
                data.takeStoreCode = this.warehouse.code
                data.customerName = this.customer
                data.customerCode = this.customerCode
                data.wholesaleType = this.salesApproach
                data.chargeByName = this.userInfo.name
                data.chargeByCode = this.userInfo.code
                data.saleAmount = this.totalPrice// *价格总数
                data.saleType = '1'
                data.receiveCustomerAddress = data.receiveCustomerAddress || ''
                data.receiveCustomerName = data.receiveCustomerAddress || ''
                data.receiveCustomerPhone = data.receiveCustomerAddress || ''
                data.mainGoodsPic = data.mainGoodsPic.join(',')
                data.wholesaleBillDetailList = data.wholesaleBillDetailList.filter(el => {
                    return el.billQuantity > 0
                })
                data.wholesaleBillDetailList.forEach(el => {
                    el.strategyDefineType = el.strategyDefineType || null
                    // console.log(el.strategyDefineType)
                })
                delete data.wholesaleOrderDetailList
                // console.log(data.wholesaleBillDetailList)
                axios({
                    path: 'DistWholesaleBillAddDistributionBill',
                    method: 'post',
                    body: {
                        wholesaleBillVoList: [data]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res)
                        let secondsToGo = 3
                        const modal = this.$success({
                            title: '提示',
                            content: '加入开票成功'
                        })
                        const interval = setInterval(() => {
                            secondsToGo -= 1
                        }, 1000)
                        setTimeout(() => {
                            clearInterval(interval)
                            modal.destroy()
                        }, secondsToGo * 1000)
                        this.$emit('activeComponent', 0)

                    // commit('SETSELECTSKUCOUNT', res.data.skuCount)
                    }
                })
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
        /**
         * @name: 跳转未提交订单
         * @msg:
         * @param {type}
         * @return:
         */
        notOrder () {
            // 组件切换 0:主页；1:详情；2：订单
            this.$emit('activeComponent', 2)
        }
    }
}
</script>

<style lang="less" scoped>
.goods{
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    .details-header{
        height: 51px;
        overflow: hidden;
        >ul{
            margin: 0;
            padding: 0;
            background-color: #FEFBE7;
            width: calc( 100% - 90px);
            height: 50px;
            float: left;
            >li{
                list-style: none;
                width: 25%;
                border-right: 1px solid #E3E3E3;
                border-bottom: 1px solid #E3E3E3;
                text-align: center;
                line-height: 50px;
                float: left;
                box-sizing: border-box;
                >span{
                    color: #56A0E8;
                }
            }
        }
    }
    .goods-menu{
        width: 90px;
        height: 50px;
        float: left;
        color: #56A0E8;
        cursor: pointer;
        >div{
            text-align: center;
            line-height: 50px;
            border-bottom: 1px solid #E3E3E3;

        }

    }
    .introduction{
        clear: both;
    }
    .goods-details{
        width: 1000px;
        min-width: 1000px;
        margin: 0 auto ;
        padding:20px 0;
        overflow: hidden;
        .details{
            overflow: hidden;
             .goods-img{
                width:250px;
                height: 220px;
                border:1px solid #E3E3E3;
                float: left;
            }
            .operation{
                float: left;
                width: 730px;
                margin-left: 20px;
                >h1{
                    color: #333333;
                    font-size: 20px;
                }
                >h3{
                    color: #333333;
                    span{
                        color: #D35C57;
                    }

                }
                .specifications{
                    .specifications-title{
                        color: #989898;
                        float: left;
                        height: 50px;
                        line-height: 50px;
                    }
                    >ul{
                        margin: 0;
                        padding: 0;
                        float: left;
                        // margin-left: 24px;
                        >li{
                            list-style: none;
                            padding: 0;
                        }
                    }

                }
                .sku-item{
                    // height: 40px;
                    border-bottom: 1px solid #989898;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    >div{
                        line-height: 40px;
                        margin-left: 19px;

                    }
                    >div:first-child{
                        margin-left:0;
                    }
                    .item-title{
                        width: 220px;
                        // overflow: hidden;
                        // text-overflow:ellipsis;
                        // white-space: nowrap;
                    }
                    .item-price{
                        width: 102px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        text-align: center;
                    }
                    .item-secl{
                        width: 160px;
                        text-align: center;
                        /deep/ .ant-select-selection--single{
                            border:none
                        }
                    }
                    .item-num{
                        width:80px;
                        text-align: center;
                    }
                }
            }

        }
        .count{
            width: 730px;
            height: 44px;
            line-height: 44px;
            background-color: #F4F4F4;
            float: right;
            >p{
                float: left;
                width: 370px;
                padding-left: 34px;
                border:1px solid #E1E1E1;
                box-sizing: border-box;
                border-right: none;

                span{
                    display: inline-block;
                    color: #E77774;
                    font-size: 16px;
                    line-height: 26px;
                    padding: 0 25px;
                    text-align: center;
                }
                span:first-child{
                    border-right: 1px solid #E1E1E1;
                }
            }
            .ant-btn-group {
                float: right;
                >button{
                    border:none;
                    border-radius: 0;
                    width: 180px;
                    height: 46px;
                    color: #ffffff;
                    background-color: #5DAAF9;

                }
                button:first-child{
                    background-color: #D48C4B;
                }

            }
        }

    }

}
.ant-popover-inner-content{
    p{
        margin: 0;
        text-align: center;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
    }
    p:hover{
        color: #56A0E8;

    }
    p:nth-child(2){
        border-top: 1px solid #E3E3E3;
    }
}

</style>

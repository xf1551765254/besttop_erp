<!--
 * @Description: 添加销售单
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-05-28 10:34:47
 * @LastEditors: haile
 * @LastEditTime: 2019-07-05 15:42:09
 -->
<template>
  <div class="box">
    <!-- 选择销售单模态框 -->
    <a-modal
      title="选择销售单"
      v-model="salesOrderVisible"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <!-- footer -->
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelChooseOrders">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">取消</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" @click="confirmOrders">
          确定
        </a-button>
      </template>
      <!-- 顶部工具栏 -->
      <seachBox
        :conditions="conditions"
        v-model="seachValue"
        @onReload="onReload"
        @onSeach="onSeach">
      </seachbox>
      <!-- 销售单列表 -->
      <div class="list-box">
        <a-checkbox-group @change="onChange">
          <a-card v-for="(item,index) in salesList" :key="index">
            <div class="card-header">
              <div class="header-text">
                <a-checkbox :value="item"></a-checkbox>
                <span>流水号：{{ item.payNumber }}</span>
                <span>导购：{{ item.guideName }} {{ item.guideCode }}</span>
                <span>顾客：{{ item.customerName }} {{ item.telephone }}</span>
              </div>
            </div>
            <div class="card-content">
              <a-row class="order" v-for="(order,i) in item.shoppingTrolleyDetailList" :key="i">
                <a-col :span="12" class="order-left">
                  <p>销售单号：<span style="margin-right:10px">{{ order.code }}</span>  {{ order.createTime }}</p>
                  <div>
                    <img src="https://img12.360buyimg.com/n5/s54x54_jfs/t29338/297/862339806/61742/72dc83bd/5c00ac2cNe242a4d4.jpg" height="90" width="90">
                    <div class="order-info">
                      <p>
                        <span>{{ order.skuName }}</span>
                        <span style="margin-left:10px">{{ order.skuCode }}</span>
                      </p>
                      <p>
                        <span>{{ order.skuProperty }}</span>
                        <span style="margin-left:10px">x{{ order.skuQuantity }}</span>
                      </p>
                      <p>售价: {{ initPrice(order.skuActualPrice) }}</p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="12" class="order-right">
                  <p>收货人：{{ order.consigneeName }}</p>
                  <p>手机号: {{ order.consigneeTelephone }}</p>
                  <p>地址：{{ order.consigneeAddress }}</p>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-checkbox-group>
      </div>
    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import clonedeep from 'lodash.clonedeep'
export default {
    name: 'SalesOrderList',
    components: {
        seachBox
    },
    props: {
        salesOrderVisible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            seachValue: {},
            conditions: [
                { title: '销售单号', type: 'input', key: 'code' },
                { title: '导购姓名', type: 'input', key: 'guideCode' },
                { title: '顾客姓名', type: 'input', key: 'customerName' }
            ],
            // 销售单列表
            salesList: [],
            // 选中的销售单
            orderList: [],
            // 顾客信息
            customerInfo: {},
            // 订单列表其他信息
            orderInfo: {}

        }
    },
    mounted () {
        // this.querySalesList({})
    },
    methods: {
        // 工具栏清空
        onReload () {
            this.seachValue = {}
        },
        // 工具栏搜索
        onSeach (e) {
            console.log(e)
            this.querySalesList(e)
        },
        // 多条件查询销售单
        querySalesList (searchInfo) {
            const self = this
            axios({
                path: 'RefundQuerySalesList',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    code: searchInfo.code,
                    guideCode: searchInfo.guideCode,
                    customerName: searchInfo.customerName
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.shoppingTrolleyDetailList.forEach(subItem => {
                            subItem.originalCode = subItem.code
                        })
                    })
                    this.salesList = data
                    console.log('查询销售单列表：', this.salesList)
                }
            })
        },
        onChange (checkedValue) {
            if (checkedValue.length > 0) {
                checkedValue.splice(0, checkedValue.length - 1)
                console.log('checkedValue:', checkedValue)
                this.orderList = []
                this.customerInfo = {}
                this.orderInfo = {}
                const data = clonedeep(checkedValue[0].shoppingTrolleyDetailList)
                data.forEach(item => {
                    const tempObj = Object.create(item)
                    tempObj.originalCode = item.code
                    tempObj.code = item.skuCode
                    tempObj.name = tempObj.skuName
                    tempObj.modal = tempObj.skuModel
                    tempObj.actualPrice = item.skuActualPrice
                    tempObj.isGroupFlag = 0
                    tempObj.quantity = item.skuQuantity
                    tempObj.returnReason = ''
                    tempObj.returnDescription = ''
                    tempObj.stockOutName = item.stockOutName
                    tempObj.pickStoreName = item.pickStoreName
                    this.orderList.push(tempObj)
                })
                this.customerInfo = checkedValue[0]
                this.customerInfo.name = this.customerInfo.customerName
                this.customerInfo.customerTelephone = this.customerInfo.telephone
                this.orderInfo.guideCode = checkedValue[0].guideCode
                this.orderInfo.guideName = checkedValue[0].guideName
                this.orderInfo.payNumber = checkedValue[0].payNumber
                console.log('选中的承职单：', this.orderList)
            }
        },
        // 关闭销售单列表
        cancelChooseOrders () {
            this.salesList = []
            this.$emit('cancelChooseOrders', false)
        },
        confirmOrders () {
            this.$emit('setSalesOrder', [this.customerInfo, this.orderInfo, this.orderList])
            this.cancelChooseOrders()
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        clear () {
            this.customerInfo = {}
            this.orderInfo = {}
            this.orderList = []
        }
    }
}
</script>

<style lang="less" scoped>
.list-box {
    height:520px;
    overflow: auto;
    margin-top: 10px;
    .ant-checkbox-group {
        width: 100%;
        .ant-card {
            margin-bottom: 20px;
            /deep/ .ant-card-body {
            padding: 0;
            .card-header {
              padding: 10px;
              box-sizing: border-box;
              border-bottom: 1px solid #ccc;
              .header-text {
                span {
                  margin-right: 30px;
                }
              }
            }
            .card-content {
              .order {
                border-bottom: 1px solid #ccc;
                .order-left {
                  padding: 10px;
                  border-right: 1px solid #ccc;
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
                  padding: 10px 0 10px 10px;
                  .ant-btn {
                    float: right;
                  }
                }
              }
            }
            }
        }
    }

}
</style>

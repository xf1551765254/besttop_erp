<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-05-28 14:36:02
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-19 19:40:39
 -->
<template>
  <div class="selectGoods">
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
      <template slot="footer">
        <!-- <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelChooseOrders">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
        </a-popconfirm> -->
        <a-button key="back" @click="cancelChooseOrders">取消</a-button>

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
                  <p>销售店：{{ `${order.storeCode}-${order.storeName||''}` }}</p>
                  <p>提货方式：{{ order.stockOutName }}</p>
                  <p>提货位置：{{ `${order.pickStoreCode}-${order.pickStoreName}` }}</p>
                  <!-- 这种无slot写法按钮插入在新增之前 -->
                  <p><a-button type="primary" size="small" style="margin-right:20px;" @click="getDeliverBySourceCode(order.code)">查看物流</a-button></p>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-checkbox-group>
      </div>
    </a-modal>
    <a-modal
      title="物流信息"
      :width="900"
      :visible="visible"
      @cancel="visible=false"

    >
      <div class="logistics">
        <a-tabs :defaultActiveKey="0" :tabPosition="'left'" :style="{ height: '500px'}" @prevClick="callback" @nextClick="callback">
          <a-tab-pane :tab="`物流单号${el.code}`" :key="index" v-for="(el,index) in logistics">
            <a-timeline>
              <a-timeline-item color="green" v-for="logs in el.logs" :key="logs.id">
                <p>{{ logs.happenType }}</p>
                <div>
                  <span>{{ logs.createName }}</span>
                  <span>{{ logs.createTime }}</span>
                  <span>{{ logs.note }}</span>
                </div>
              </a-timeline-item>

            </a-timeline>
          </a-tab-pane>

        </a-tabs>

      </div>
      <template slot="footer">
        <a-button key="back" @click="visible=false">关闭</a-button>
      </template>

    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'SelectGoods',
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
            orderInfo: {},
            // 物流
            visible: false,
            logistics: []
        }
    },
    created () {
        this.querySalesList({})
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
                    customerName: searchInfo.customerName,
                    isReturnApply: 'true',
                    stockOut: 'shopping_stock_out:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.salesList = res.data
                    console.log('查询销售单列表：', this.salesList)
                }
            })
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        // 销售单数据选择
        onChange (checkedValue) {
            console.log('checkedValue:', checkedValue)
            if (checkedValue.length > 0) {
                if (checkedValue.length === 1) {
                    this.orderList = checkedValue[0]
                } else {
                    checkedValue.pop()
                    this.orderList = checkedValue[0]
                    let secondsToGo = 3
                    const modal = this.$success({
                        title: '提示',
                        content: '只能选择一个销售单！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                }
                // this.orderList = checkedValue[0].shoppingTrolleyDetailList
                // this.customerInfo = checkedValue[0]
                // this.customerInfo.name = this.customerInfo.customerName
                // this.orderInfo.guideCode = checkedValue[0].guideCode
                // this.orderInfo.guideName = checkedValue[0].guideName
                // this.orderInfo.payNumber = checkedValue[0].payNumber
                console.log('选中的销售单：', this.orderList)
            }
        },
        // 关闭销售单列表
        cancelChooseOrders () {
            this.$emit('cancelReturnOrders', false)
        },
        confirmOrders () {
            this.$emit('setData', this.orderList)
            this.cancelChooseOrders()
        },
        getDeliverBySourceCode (sourceCode) {
            axios({
                path: 'DistLogisticsFindBillDeliverBySourceCode',
                method: 'post',
                body: {
                    sourceCode
                }
            }).then(res => {
                console.log(res.data)
                if (res.flag === 1 && res.data && res.data.length > 0) {
                    this.logistics = res.data
                    this.visible = true
                } else {
                    this.logistics = []
                }
            })
        },
        callback (key) {
            console.log(key)
            this.activeKey = key
            // this.queryReturnList()
        }

    }
}
</script>

<style lang="less" scoped>
.selectGoods{
    padding: 0;
}
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
    /deep/ .ant-tabs-content {
        padding: 10px 24px;
    }
</style>

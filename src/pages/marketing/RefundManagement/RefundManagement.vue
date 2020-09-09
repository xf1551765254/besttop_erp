<!--
 * @Description: 退款管理
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-05-27 09:25:53
 * @LastEditors: haile
 * @LastEditTime: 2019-07-06 14:42:43
 -->
<template>
  <div class="box">
    <!-- 顶部工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" @click="openRefundModal(0)" size="small">申请退款</a-button>
    </seachbox>
    <!-- 退款管理列表 -->
    <div class="list-box" :style="{height:windowHeight-230+'px'}">
      <a-tabs @change="callback" v-model="activeKey">
        <a-tab-pane :tab="`退款中(${refundingList.length})`" key="1">
          <a-card v-for="(item,index) in refundingList" :key="index">
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="header-text">
                <span>退款单号：{{ item.payNumber }}</span>
                <span>{{ item.createTime }}</span>
                <span>导购：{{ item.guideName }} {{ item.guideCode }}</span>
                <span>顾客：{{ item.customerName }} {{ item.telephone }}</span>
              </div>
              <div class="header-btn">
              </div>
            </div>
            <!-- 卡片内容 -->
            <div class="card-content">
              <a-row class="order" v-for="(order, i) in item.shoppingTrolleyDetailList" :key="i">
                <a-col :span="12" class="order-left">
                  <p v-show="order.originalCode">销售单号：{{ order.originalCode }}</p>
                  <div>
                    <img src="https://img10.360buyimg.com/n7/jfs/t1/7871/2/2142/126058/5bd158e9E737b9e25/68020b048b23f7dd.jpg" height="90" width="90">
                    <div class="order-info">
                      <p>
                        <span>{{ order.skuName }}</span>
                        <span>{{ order.skuCode }}</span>
                      </p>
                      <p>
                        <span>{{ order.skuProperty }}</span>
                        <span>x{{ order.skuQuantity }}</span>
                      </p>
                      <p>{{ initPrice(order.skuActualPrice) }}</p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="12" class="order-right">
                  <p>收货人：{{ order.consigneeName }} {{ order.consigneeTelephone }}</p>
                  <p>地址：{{ order.consigneeAddress }}</p>
                  <p>申请原因： {{ order.returnReason }}</p>
                </a-col>
              </a-row>
            </div>
            <!-- 卡片尾部 -->
            <div class="card-footer">
              <div class="footer-left">
                <p>应退金额：{{ initPrice(item.shouldRefundAmount) }}</p>
                <p>已退金额：{{ initPrice(item.refundedAmount) }}</p>
              </div>
              <div class="footer-right">
                <span>还需退款：{{ initPrice(item.shouldRefundAmount + item.refundedAmount) }}</span>
                <a-button type="primary" @click="openRefundModal(1, item.payNumber)">继续退款</a-button>
              </div>
            </div>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :tab="`已退款(${refundedList.length})`" key="2">
          <a-card v-for="(item,index) in refundedList" :key="index">
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="header-text">
                <span>退款单号：{{ item.payNumber }}</span>
                <span>{{ item.createTime }}</span>
                <span>导购：{{ item.guideName }} {{ item.guideCode }}</span>
                <span>顾客：{{ item.customerName }} {{ item.telephone }}</span>
              </div>
              <div class="header-btn">
                <a-button type="primary" size="small" @click="openRefundModal(2, item.payNumber)">详情</a-button>
                <a-button type="primary" size="small" style="margin-left:10px;" @click="toPrintTicket(item.shoppingTrolleyDetailList)">打印小票</a-button>
              </div>
            </div>
            <!-- 卡片内容 -->
            <div class="card-content">
              <a-row class="order" v-for="(order,i) in item.shoppingTrolleyDetailList" :key="i">
                <a-col :span="12" class="order-left">
                  <p v-show="order.originalCode">销售单号：{{ order.originalCode }}</p>
                  <div>
                    <img src="https://img10.360buyimg.com/n7/jfs/t1/7871/2/2142/126058/5bd158e9E737b9e25/68020b048b23f7dd.jpg" height="90" width="90">
                    <div class="order-info">
                      <p>
                        <span>{{ order.skuName }}</span>
                        <span>{{ order.skuCode }}</span>
                      </p>
                      <p>
                        <span>{{ order.skuProperty }}</span>
                        <span>x{{ order.skuQuantity }}</span>
                      </p>
                      <p>{{ initPrice(order.skuActualPrice) }}</p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="12" class="order-right">
                  <p>
                    收货人：{{ order.consigneeName }} {{ order.consigneeTelephone }}
                    <a-button type="primary" size="small" @click="invoiceCancellation(item.payNumber, order)" v-if="order.originalCode">冲销发票</a-button>
                  </p>
                  <p>地址：{{ order.consigneeAddress }}</p>
                  <p>申请原因： {{ order.returnReason }}</p>
                </a-col>
              </a-row>
            </div>
            <!-- 卡片底部 -->
            <div class="card-footer">
              <p>已退金额： {{ initPrice(item.refundedAmount) }}</p>
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 分页 -->
    <!-- <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
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
    </div> -->
    <!-- 申请退款 -->
    <bt-modal
      v-model="refundVisible"
      :submitClick="closeApplyModal"
      :subBtn="false"
      title="退款管理"
    >
      <Refund :optionFlag="optionFlag" :payNumber="payNumber" @closeApplyModal="closeApplyModal"></Refund>
    </bt-modal>
    <!-- 打印小票 -->
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
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box">
        <Ticket :ticketInfo="ticketInfo"></Ticket>
      </div>
    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Refund from './components/Refund'
import Ticket from './components/Ticket'
import print from 'print-js'
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
export default {
    name: 'RefundManagement',
    components: {
        seachBox,
        BtModal,
        Refund,
        Ticket
    },
    data () {
        return {
            seachValue: {},
            conditions: [
                { title: '销售单号', type: 'input', key: 'code' },
                { title: '导购姓名', type: 'input', key: 'guideCode' },
                { title: '顾客姓名', type: 'input', key: 'customerName' }
            ],
            activeKey: '1',
            refundVisible: false,
            ticketModal: false,
            ticketInfo: {},
            // 0-申请退款，1-继续退款，2-详情
            optionFlag: -1,
            // 退款单状态
            status: 'shopping_trolley_status:7',
            // 分页
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            current: 0,
            pageSize: 10,
            total: 0,
            // 退款单列表
            refundingList: [],
            refundedList: [],
            payNumber: ''
        }
    },
    mounted () {
        const refundingStatus = 'shopping_trolley_status:7'
        const refundedStatus = 'shopping_trolley_status:8'
        this.queryRefundList(refundingStatus, {})
        this.queryRefundList(refundedStatus, {})
    },
    computed: {
        ...mapGetters(['windowHeight'])
    },
    methods: {
        // 冲销发票
        invoiceCancellation (payNumber, orderInfo) {
            console.log('===============', payNumber, orderInfo)
            axios({
                path: 'NuonuoInvoiceRequestBilling',
                method: 'post',
                body: {
                    orderIds: [orderInfo.code],
                    invoiceType: 2,
                    operationType: 1,
                    payNumber: payNumber
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                }
            })
        },
        // 打印小票
        toPrintTicket (orders) {
            console.log('orders', orders)
            const orderIds = []
            orders.forEach(item => {
                orderIds.push(item.code)
            })
            axios({
                path: 'ApiPaymentQueryPrintPayInfo',
                method: 'post',
                body: {
                    orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询到小票信息', res.data)
                    this.ticketInfo = res.data
                    this.ticketModal = true
                }
            })
        },
        // 工具栏清空
        onReload () {
            this.seachValue = {}
        },
        // 工具栏搜索
        onSeach (e) {
            console.log(e)
            this.queryRefundList(this.status, e)
        },
        // 多条件换查询退款单列表
        queryRefundList (status, searchInfo) {
            const tempFlag = JSON.stringify(searchInfo) === '{}'
            const self = this
            axios({
                path: 'RefundQueryRefundList',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    status: status, // （shopping_trolley_status:8已退款；shopping_trolley_status:7退款中）
                    page: self.current,
                    rows: self.pageSize,
                    code: tempFlag ? null : searchInfo.code,
                    guideCode: tempFlag ? null : searchInfo.guideCode,
                    customerName: tempFlag ? null : searchInfo.customerName
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询退款列表：', res.data)
                    const data = res.data
                    data.forEach(item => {
                        item.shoppingTrolleyDetailList.forEach(subItem => {
                            subItem.customerAddress = subItem.consigneeAddress
                        })
                    })
                    if (status === 'shopping_trolley_status:8') {
                        this.refundedList = res.data
                    } else {
                        this.refundingList = res.data
                    }
                }
            })
        },
        // 分页
        onShowSizeChange (current, pageSize) {
            this.pageSize = pageSize
        },
        pageChange (current) {
            this.current = current
        },
        // 申请退款
        openRefundModal (flag, payNumber) {
            this.optionFlag = flag
            if (this.optionFlag !== 0) {
                this.payNumber = payNumber
            }
            this.refundVisible = true
        },
        // 关闭申请退款
        closeApplyModal () {
            this.refundVisible = false
            this.queryRefundList('shopping_trolley_status:7', {})
            this.queryRefundList('shopping_trolley_status:8', {})
        },
        // tab切换
        callback (key) {
            this.status = key === '1' ? 'shopping_trolley_status:7' : 'shopping_trolley_status:8'
            this.queryRefundList(this.status, {})
        },
        // 关闭打印小票模态框
        printTicketCancel () {
            this.ticketModal = false
        },
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {

    }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-bordered {
  margin-bottom: 20px;
  .ant-card-body {
    padding: 0px;
  }
}
.list-box {

  height: calc(100% - 66px);
  overflow-y: auto;
  .ant-card-body {
    .card-header {
      display: flex;
      justify-content: space-between;
      padding: 10px;
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
              p {
                display: flex;
                justify-content: space-between;
              }
            }
          }
        }
        .order-right {
          padding: 10px;
          .ant-btn {
            float: right;
          }
        }
      }
    }
    .card-footer {
      display: flex;
      font-size: 16px;
      height: 49px;
      line-height: 49px;
      padding-left: 10px;
      justify-content: space-between;
      .footer-left {
        p {
          height: 24px;
          line-height: 24px;
          margin: 0;
        }
      }
      .footer-right {
        .ant-btn {
          margin: 0 10px;
        }
      }
    }
  }
}

/deep/ .button-box {
  /deep/ .ant-btn-primary {
    display: none !important;
  }
}
</style>
<style lang="less">

</style>

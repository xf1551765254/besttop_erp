<!--
 * @Description: 退款
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-29 08:48:29
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 17:35:51
 -->
<template>
  <fullscreen
    ref="fullscreen"
    id="fullscreen"
    class="fullscreenClass"
    style="background-color:#f8f8f8;"
    @change="fullscreenChange">
    <div class="refund-box">
      <!-- 头部工具栏 -->
      <div class="header">
        <div class="full-toggle">
          <a-button style="margin: 5px 10px 0 0" shape="circle" :icon="fullscreen?'fullscreen-exit':'fullscreen'" @click="fullClick"/>
        </div>
        <div class="customer-info">
          <p> 顾客：{{ currentCustomer.customerName }}</p>
          <p>{{ currentCustomer.customerPhone }}</p>
        </div>
        <div class="search-box">
          <a-input-search
            placeholder="请输入顾客/单号(或扫描票据)"
            @search="onSearch"
            v-model="searchCondition"
            enterButton
            autoFocus
            size="large"
            ref="search-input"
            style="width:80%;margin-left:10%;margin-bottom:20px"/>
        </div>
        <a-button type="primary" @click="toRefundList">待退款</a-button>
      </div>
      <!-- 主体内容 -->
      <div class="main">
        <div class="left">
          <PayRecord :scrollY="tableHeight" :dataSource="dataSource"></PayRecord>
          <AmountList :amountList="amountList"></AmountList>
          <Payment></Payment>
        </div>
        <div class="center">
          <OrderList :singleList="singleList"></OrderList>
          <Arbitrage></Arbitrage>
        </div>
        <div class="right">
          <CustomerRights></CustomerRights>
        </div>
      </div>
    </div>
  </fullscreen>

</template>

<script>
import { axios } from '@/utils/request'
import PayRecord from './components/PayRecord'
import AmountList from './components/AmountList'
import Payment from './components/Payment'
import OrderList from './components/OrderList'
import Arbitrage from './components/Arbitrage'
import CustomerRights from './components/CustomerRights'

export default {
    name: 'Refund',
    components: {
        PayRecord,
        AmountList,
        Payment,
        OrderList,
        Arbitrage,
        CustomerRights
    },
    props: {
        refundedCode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            currentCustomer: {},
            searchCondition: '',
            tableHeight: 0,
            dataSource: [],
            tbodyHeight: 0,
            fullscreen: false,
            singleList: [],
            refundCode: '',
            amountList: {}
        }
    },
    async mounted () {
        this.tableHeight = this.$store.getters.windowHeight - 200
        if (this.refundedCode !== '') {
            this.refundCode = this.refundedCode
            await this.queryRefundDetail()
            await this.queryPayRecord()
        }
    },
    methods: {
        async onSearch (val) {
            if (val === '') {
                return false
            } else {
                await this.queryList()
                this.searchCondition = ''
            }
        },
        toRefundList () {
            this.$emit('activeComponent', 1)
        },
        fullscreenChange (fullscreen) {
            this.fullscreen = fullscreen
            this.tbodyHeight = this.$refs.main.clientHeight - 372
        },
        fullClick () {
            this.$refs['fullscreen'].toggle()
        },
        async queryPayRecord () {
            const orderIds = []
            this.singleList.forEach(item => {
                orderIds.push(item.code)
            })
            const res = await axios({
                path: 'ShoppingPayRecordQueryTradePayRecord',
                method: 'POST',
                body: {
                    orderIds: orderIds
                }
            })
            if (res.flag === 1) {
                if (res.data.shoppingPayRecords) {
                    this.dataSource = res.data.shoppingPayRecords
                }
            }
        },
        async queryList () {
            const res = await axios({
                path: 'RefundQueryRefundedList',
                method: 'post',
                body: {
                    status: 'return_apply_status:3',
                    storeCode: this.$store.getters.storeInfo.code,
                    customerName: this.searchCondition,
                    code: this.searchCondition
                }
            })
            if (res.flag === 1) {
                console.log('待退款列表', res.data)
                if (res.data.length > 1) {
                    this.$emit('activeComponent', 1)
                    this.$emit('updateSearchCondation', this.searchCondition)
                } else if (res.data.length === 1) {
                    this.refundCode = res.data[0].code
                    this.queryRefundDetail()
                    this.queryPayRecord()
                } else {
                    return false
                }
            }
        },
        async queryRefundDetail () {
            const res = await axios({
                path: 'ShoppingScheduleQueryRefundDetail',
                method: 'post',
                body: {
                    refundCode: this.refundCode
                }
            })
            if (res.flag === 1) {
                if (res.data && JSON.stringify(res.data) !== '{}') {
                    res.data.singleList.forEach(item => {
                        const pic = item.skuInfo.picture ? item.skuInfo.picture.split(',') : ['']
                        item.skuInfo.mainGoodsPic = pic
                    })
                    this.singleList = res.data.singleList
                    this.amountList = { ...res.data }
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
p {
    margin-bottom: 5px;
}
.fullscreenClass {
    height: 100%;
    .refund-box {
        background-color: #eee;
        height: 100%;
        font-size: 12px;
        .header {
            box-sizing: content-box;
            padding: 10px;
            display: flex;
            height: 50px;
            .customer-info {
                height: 40px;
                p {
                    color: #408BFF;
                    font-size: 14px;
                    margin-bottom: 5px;
                }
            }
            .ant-btn{
                height: 40px;
                border: 1px solid #fff;
                border-radius: 10px;
            }
            .search-box {
                flex: 1
            }
        }
        .main {
            width: 100%;
            padding: 10px;
            display: flex;
            height: calc(100% - 70px);
            .left {
                min-width: 290px;
                flex: 1;
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            .right {
                min-width: 250px;
                flex: 1;
                height: 100%;
            }
            .center {
                height: 100%;
                flex: 3;
                margin: 0 5px;
            }
        }
    }
}

</style>

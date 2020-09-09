<!--
 * @Description: 赠品发放
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-06 09:16:41
 * @LastEditors: lin
 * @LastEditTime: 2019-08-26 10:41:53
 -->
<template>
  <div class="box giftIoIssue" :style="{height:windowHeight-150+'px'}">
    <!-- tab栏切换 -->
    <a-tabs :defaultActiveKey="defaultActiveKey" @change="callback">
      <!-- 赠品发放 -->
      <a-tab-pane tab="赠品发放" key="1">
        <a-row class="header-option">
          <a-col :span="16">
            <a-input-search @search="onSearch" v-model="seach">
              <a-button slot="enterButton">查询</a-button>
            </a-input-search>
          </a-col>
          <a-col :span="8" style="padding-right:10px;cursor:pointer" @click="toHistoryData">
            发放历史数据
          </a-col>
        </a-row>
        <a-card>
          <div class="paynumbers">
            销售流水号：
            <span v-for="(item, index) in payNumberList" :key="index" @click="goDetails">{{ item }}</span>
            <a-button v-if="payNumberList.length>0" @click="clear" style="margin-right:10px">清空</a-button>
            <a-button type="primary" v-if="payNumberList.length>0" @click="queryActivies">查询</a-button>
          </div>
          <!-- 单品发放单 -->
          <ScheduleItem
            :giftsList="itemGifts"
            :flag="0"
            @openGrantModal="openGrantModal"
            :previewVisbel.sync="previewVisbel"
            :orderId.sync="orderId"
            :defaultActiveKey="defaultActiveKey"
            v-if="itemGifts.length>0"></ScheduleItem>
          <!-- 套购发放单 -->
          <ScheduleItem
            :giftsList="multipleItemGifts"
            :flag="1"
            :previewVisbel.sync="previewVisbel"
            :orderId.sync="orderId"
            @openGrantModal="openGrantModal"
            :defaultActiveKey="defaultActiveKey"
            v-if="multipleItemGifts.length>0"></ScheduleItem>
        </a-card>
      </a-tab-pane>
      <!-- 赠品回收 -->
      <a-tab-pane tab="赠品回收" key="2">
        <a-row class="header-option">
          <a-col :span="16">
            <a-input-search @search="onSearch" v-model="seachvalue">
              <a-button slot="enterButton">查询</a-button>
            </a-input-search>
          </a-col>
          <a-col :span="8" style="padding-right:10px" @click="toHistoryData">
            发放历史数据
          </a-col>
        </a-row>
        <a-card>
          <div class="paynumbers">
            赠品发放单号：
            <!-- <span v-for="(item, index) in payNumberList" :key="index" @click="goDetails">{{ item }}</span> -->
            <span>{{ recycleCode }}</span>
            <a-button v-if="recycleCode" @click="clear" style="margin-right:10px">清空</a-button>
            <a-button type="primary" v-if="recycleCode" @click="queryRecycleGifts">查询</a-button>
          </div>
          <!-- 回收单 -->
          <!-- 单品发放单 -->
          <ScheduleItem
            :giftsList="recycleGifts"
            :flag="0"
            :previewVisbel.sync="previewVisbel"
            :orderId.sync="orderId"
            @openGrantModal="openGrantModal"
            :defaultActiveKey="defaultActiveKey"
            v-if="recycleGifts.length>0"></ScheduleItem>
          <!-- 套购发放单 -->
          <!-- <ScheduleItem
            :giftsList="multipleItemGifts"
            :flag="1"
            @openGrantModal="openGrantModal"
            v-if="multipleItemGifts.length>0"></ScheduleItem> -->
          <!-- <ScheduleItem></ScheduleItem> -->
        </a-card>
      </a-tab-pane>
      <!-- 手工满赠 -->
      <a-tab-pane tab="手工满赠" key="3">
        <a-row class="">
          <a-col :span="16">
            <a-input-search
              placeholder="请输入顾客手机号（或扫描二维码）"
              @search="onHandWorkSearch"
              v-model="handSearchValue"
            >
              <a-button slot="enterButton">查询</a-button>
            </a-input-search>
          </a-col>
          <a-col :span="8" style="text-align:right">
            <a-button @click="customerQuery=true">添加顾客</a-button>
            <a-button style="margin-left:10px" @click="handHistoryQuery=true">发放历史</a-button>
          </a-col>
        </a-row>
        <!-- 顾客信息 -->
        <div class="handWorkTab">
          <a-row class="titleSet" style="margin-top:20px">顾客信息</a-row>
          <a-row style="">
            <a-col :sm="7" :md="3" :xl="2">顾客手机号</a-col>
            <a-col :sm="17" :md="9" :xl="10">
              <a-input
                style="width:100%"
                placeholder=""
                disabled
                v-model="handWorkForm.customerTelephone"/>
            </a-col>
            <a-col :sm="7" :md="3" :xl="2">顾客姓名</a-col>
            <a-col :sm="17" :md="9" :xl="10">
              <a-input
                style="width:100%"
                placeholder=""
                disabled
                v-model="handWorkForm.customerName"/>
            </a-col>
            <a-col :sm="7" :md="3" :xl="2">顾客地址</a-col>
            <a-col :sm="17" :md="21" :xl="22">
              <a-input
                placeholder=""
                disabled
                v-model="handWorkForm.customerAddress">
              </a-input>
            </a-col>
          </a-row>
        </div>
        <a-divider/>
        <!-- 选择礼品 -->
        <div>
          <a-row class="titleSet" style="margin-top:20px">选择礼品</a-row>
          <a-radio-group name="radioGroup" style="width:100%" v-model="selsectTable">
            <a-table
              rowKey="skuCode"
              :columns="tableColumns"
              size="small"
              :pagination="false"
              :scroll="scroll"
              :dataSource="detailTableData"
              bordered >
              <template slot="skuName" slot-scope="text, record, index">
                <div >
                  <a-tooltip v-if="text&&text.length > 20" :key="text" :title="text">
                    <span>{{ `${text.slice(0, 20)}...` }}</span>
                  </a-tooltip>
                  <span v-else> {{ text }} </span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record, index">
                <div class="editable-row-operations">
                  <a-radio :value="record"></a-radio>
                </div>
              </template>
            </a-table>

          </a-radio-group>
        </div>
        <a-row style="text-align:right" class="Btnfooter">
          <a-button @click="handwrkConfirm">确认发放</a-button>
        </a-row>
        <!-- 添加顾客 -->
        <customer :visible.sync="customerQuery" @onClose="getCustomerData"></customer>
        <!-- 手工满赠发放历史数据 -->
        <HandHistory :visible.sync="handHistoryQuery" />
        <!-- 手工小票 -->
        <HandTicket :visible.sync="handTicketQuery" :ticketData="handTicketData" @onConfirm="handClose"/>
      </a-tab-pane>
    </a-tabs>
    <!-- 发放历史数据 -->
    <a-modal
      title="发放历史数据"
      v-model="historyDataModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="'80%'"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="historyDataModal=false">关闭</a-button>
      </template>
      <HistoryData></HistoryData>
    </a-modal>
    <!-- 发放确认 -->
    <a-modal
      title="发放确认"
      v-model="grantModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="grantModal=false">关闭</a-button>
        <a-button key="submit" type="primary" @click="toPrint(1)">确定</a-button>
      </template>
      <div>
        是否发放？请确认
        <p style="color:#f00;font-size:12px;margin-top:10px">赠品发放时请核查领取客户身份</p>
      </div>
    </a-modal>
    <!-- 收回确认 -->
    <a-modal
      title="回收确认"
      v-model="recoveryModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="recoveryModal=false">关闭</a-button>
        <a-button key="submit" type="primary" @click="toPrint(0)">确定</a-button>
      </template>
      <div>
        是否回收？请确认
        <a-textarea placeholder="请输入回收备注" :rows="2" style="margin:10px 0" v-model="note"/>
        <p style="color:#f00;font-size:12px">赠品回收时请核查领取客户身份</p>
      </div>
    </a-modal>
    <!-- 手工满赠发放确认 -->
    <a-modal
      title="发放确认"
      v-model="grantHandModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      :width="400"
      centered>
      <template slot="footer">
        <a-button key="back" @click="grantHandModal=false">关闭</a-button>
        <a-button key="submit" type="primary" @click="toPrintHand()">确定</a-button>
      </template>
      <div style="font-size:15px;text-align:center">
        是否发放？请确认
        <p style="color:#f00;font-size:12px;margin-top:10px">礼品发放时请核查领取客户身份</p>
      </div>
    </a-modal>
    <!-- 小票打印 -->
    <a-modal
      :title="ticketTitle"
      v-model="ticketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :zIndex="1001"
      destroyOnClose
      centered>
      <!-- 页脚 -->
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box">
        <Ticket :type="ticketType" :ticketTitle="ticketTitle" :ticketData="ticketData"></Ticket>
      </div>
    </a-modal>
    <!-- 预览 -->
    <ActiveRulesPreview ref="previewRef" v-model="previewVisbel" :orderId="orderId"/>
  </div>
</template>

<script>
import print from 'print-js'
import Ticket from './components/Ticket'
import SalesOrderList from './components/SalesOrderList'
import HistoryData from './components/HistoryData'
import ScheduleItem from './components/ScheduleItem'
import customer from './components/customerModal'
import HandHistory from './components/handHistory'
import HandTicket from './components/handTicket'
import ActiveRulesPreview from './preview/ActiveRulesPreview'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
export default {
    name: 'GiftIoIssue',
    components: {
        Ticket,
        HistoryData,
        SalesOrderList,
        ScheduleItem,
        ActiveRulesPreview,
        customer,
        HandHistory,
        HandTicket
    },
    data () {
        return {
            defaultActiveKey: '1',
            payNumber: '',
            payNumberList: [],
            grantModal: false,
            historyDataModal: false,
            recoveryModal: false,
            ticketModal: false,
            ticketTitle: '',
            ticketType: 0,
            // 单品赠品列表
            itemGifts: [],
            // 套购赠品列表
            multipleItemGifts: [],
            grantData: {},
            lastTime: new Date().getTime(),
            nextTime: new Date().getTime(),
            lastCode: '',
            nextCode: '',
            ticketData: {},
            recycleGifts: [],
            note: '',
            previewVisbel: false,
            orderId: '',
            recycleCode: '',
            seach: '',
            seachvalue: '',

            // 手工满赠
            handSearchValue: undefined,
            handWorkForm: {
                customerTelephone: '',
                customerName: '',
                customerAddress: '',
                code: ''
            },
            // 礼品列表
            tableColumns: [
                { title: '单选', key: 'operation', width: 70, fixed: 'left', align: 'center', scopedSlots: { customRender: 'action' } },
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 150, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 150 },
                { title: '数量', dataIndex: 'skuQuantity', align: 'center', width: 120 },
                { title: '分摊金额（元）', dataIndex: 'rateAmount', align: 'center', width: 120 },
                { title: '备注', dataIndex: 'note', align: 'center', width: 250 }
            ],
            detailTableData: [],
            scroll: {
                x: 1190,
                y: this.$store.getters.windowHeight - 560
            },
            selsectTable: {},
            customerQuery: false,
            grantHandModal: false,
            handHistoryQuery: false,
            handTicketQuery: false,
            handTicketData: {}
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo', 'windowHeight'])
    },
    mounted () {
    // this.$nextTick(() => {
    //     document.addEventListener('keypress', (e) => {
    //         this.nextCode = e.which
    //         this.nextTime = new Date().getTime()
    //         if (this.lastCode != null && this.lastTime != null && this.nextTime - this.lastTime <= 99) {
    //             // this.payNumber += String.fromCharCode(this.lastCode)
    //             console.log(this.payNumberList)
    //         } else if (this.lastCode != null && this.lastTime != null && this.nextTime - this.lastTime < 500) {
    //             this.payNumber += ','
    //         }
    //         this.lastCode = this.nextCode
    //         this.lastTime = this.nextTime
    //         // if (e.which === 13 && this.payNumber !== '') {
    //         //     if (this.defaultActiveKey === '1') {
    //         //         this.payNumberList.push(this.payNumber)
    //         //     } else {
    //         //         this.recycleCode = this.payNumber
    //         //     }
    //         //     this.payNumber = ''
    //         // }
    //     })
    // })
    },
    watch: {
        seach (newData) {
            console.log(newData)
            if (newData.length >= 15) {
                this.payNumberList.push(newData)
                this.seach = ''
            }
        },
        seachvalue (newData) {
            console.log(newData)
            if (newData.length >= 15) {
                this.recycleCode = newData
                this.seachvalue = ''
            }
        }
    },
    methods: {
        /**
         * @name: 查询套购活动
         * @msg:
         * @param {Array} payNumberList
         * @return:
         */
        queryActivies () {
            const data = this.payNumberList.filter(el => {
                return el !== ''
            })
            axios({
                path: 'ScheduleGiftQueryGifts',
                method: 'POST',
                body: {
                    payNumberList: data,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('套购活动信息', res.data)
                    // if (res.data.itemGifts.length === 0 && res.data.multipleItemGifts.length === 0) {
                    //     this.$message.warning('暂无数据')
                    // }
                    res.data.itemGifts.forEach(item => {
                        item.define.orderCode = item.orderCode
                        item.define.payNumber = item.payNumber
                        item.selectedRowKeys = []
                        if (item.gifts.length > 0) {
                            item.gifts.forEach(subItem => {
                                subItem.orderCode = item.orderCode
                                subItem.payNumber = item.payNumber
                            })
                        }
                    })
                    this.itemGifts = res.data.itemGifts

                    console.log(this.itemGifts)

                    res.data.multipleItemGifts.forEach(item => {
                        item.define.orderCode = item.orderCode
                        item.define.payNumber = item.payNumber
                        item.selectedRowKeys = []
                        if (item.gifts.length > 0) {
                            item.gifts.forEach(subItem => {
                                subItem.orderCode = item.orderCode
                                subItem.payNumber = item.payNumber
                            })
                        }
                    })
                    this.multipleItemGifts = res.data.multipleItemGifts

                    // this.multipleItemGifts.forEach(el => {
                    //     this.giftsObjtect[el.orderCode] = {}
                    // })
                    // this.itemGifts.forEach(el => {
                    //     this.giftsObjtect[el.orderCode] = {}
                    // })
                    // // this.giftsObjtect=myMap
                    // console.log(this.giftsObjtect)
                    // this.giftsObjtect
                }
            })
        },
        queryRecycleGifts () {
            if (this.recycleCode.length < 15) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '不是有效的流水单号'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                axios({
                    path: 'ScheduleGiftQueryRecycleGifts',
                    method: 'POST',
                    body: {
                        code: this.recycleCode
                    }
                }).then(res => {
                    if (res.flag === 1 && res.data) {
                        this.recycleGifts = [
                            {
                                orderCode: res.data.orderCode,
                                payNumber: res.data.payNumber,
                                selectedRowKeys: [],
                                define: res.data,
                                gifts: [res.data]
                            }
                        ]

                        // res.data.multipleItemGifts.forEach(item => {
                        //     item.define.orderCode = item.orderCode
                        //     item.define.payNumber = item.payNumber
                        //     item.gifts.forEach(subItem => {
                        //         subItem.picture = 'https://m.360buyimg.com/babel/jfs/t1/51105/17/3027/235754/5d0ce73dEe47624a4/5021eb5fafa11a99.jpg!q80'
                        //     })
                        // })
                        // this.multipleItemGifts = [res.data]
                    } else {
                        this.recycleGifts = []
                    }
                })
            }
        },
        // tab栏切换监听
        callback (value) {
            this.defaultActiveKey = value
            // if (value === '1') {
            //     this.queryActivies()
            // } else {
            //     this.queryRecycleGifts()
            // }
            if (value === '3') {
                this.handGetTableData()
            }
        },
        // 输入框查询
        onSearch (e) {
            console.log(e)
            if (this.defaultActiveKey === '1' && this.payNumberList.length > 0) {
                this.queryActivies()
            } else if (this.defaultActiveKey === '2' && this.recycleCode !== '') {
                this.queryRecycleGifts()
            } else {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请选择扫码添加流水单号'
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
        // 清空
        clear () {
            if (this.defaultActiveKey === '1') {
                this.payNumberList = []
            } else {
                this.recycleCode = ''
            }
        },
        // 销售单详情
        goDetails () {

        },
        // 表格选择
        onSelectChange (code) {
            console.log(code)
        },
        openGrantModal (grantData) {
            this.grantData = grantData
            if (this.defaultActiveKey === '1') {
                this.grantModal = true
            } else {
                this.note = ''
                this.recoveryModal = true
            }
        },
        // 发放
        grant () {
            const data = JSON.parse(JSON.stringify(this.grantData))
            delete data.id
            console.log(data)

            // data.skuCode = '0200000501'
            axios({
                path: 'ScheduleGiftAddGiftRecord',
                method: 'POST',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    console.log('发放返回信息', res.data)
                    this.ticketModal = true
                    this.grantModal = false
                    this.ticketData = res.data
                }
            })
        },
        // 收回
        recovery () {
            const data = {
                id: this.grantData.id,
                note: this.note
            }
            console.log(data)

            axios({
                path: 'ScheduleGiftAddRecycleGiftRecord',
                method: 'POST',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    this.ticketData = res.data
                    this.ticketModal = true
                    this.recoveryModal = false
                    console.log('发放返回信息', res.data)
                }
            })
        },
        toPrint (flag) {
            if (flag === 1) {
                this.ticketTitle = '赠品发放小票'
                this.ticketType = 1
                console.log(this.grantData)
                this.grant()
            } else {
                this.ticketTitle = '赠品回收小票'
                this.ticketType = 0
                this.recovery()
            }
        },
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
            this.grantModal = false
            this.recoveryModal = false
            this.ticketModal = false
            if (this.defaultActiveKey === '1') {
                this.queryActivies()
            } else if (this.defaultActiveKey === '2') {
                this.queryRecycleGifts()
            }
        },
        // 取消打印
        printTicketCancel () {
            this.ticketModal = false
            if (this.defaultActiveKey === '1') {
                this.queryActivies()
            } else if (this.defaultActiveKey === '2') {
                this.queryRecycleGifts()
            }
        },
        // 查看发放历史数据
        toHistoryData () {
            this.historyDataModal = true
        },
        /**
         * @name: 手工满赠查询
         */
        onHandWorkSearch (value) {
            axios({
                path: 'ScheduleGiftQueryDefineDetailsByCustomer',
                method: 'post',
                body: {
                    customerPhone: value,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    const obj = { ...res.data.customer }
                    const newArr = [ ...res.data.details ]
                    if (obj) {
                        // this.handWorkForm.customerTelephone = obj.telephone
                        // this.handWorkForm.customerName = obj.name
                        // this.handWorkForm.customerAddress = obj.address + obj.addressDetail
                        // this.handWorkForm.code = obj.code
                    }
                    this.detailTableData = newArr
                }
            })
        },
        /**
         * @name: 手工满赠获取表格数据
        */
        handGetTableData () {
            axios({
                path: 'ScheduleGiftQueryDefineDetailsByCustomer',
                method: 'post',
                body: {
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const newArr = [ ...res.data ]
                    this.detailTableData = newArr
                }
            })
        },
        /**
         * @name: 手工满赠顾客信息
         */
        getCustomerData (obj) {
            this.handWorkForm.customerTelephone = obj.telephone
            this.handWorkForm.customerName = obj.name
            this.handWorkForm.customerAddress = obj.address + obj.addressDetail
            this.handWorkForm.code = obj.code
        },
        /**
         * @name: 手工满赠确认发放
         */
        handwrkConfirm () {
            if (!this.handWorkForm.customerTelephone) {
                return this.$message.error('请输入顾客信息进行查询')
            }
            if (Object.keys(this.selsectTable).length === 0) {
                return this.$message.error('请选择礼品')
            }
            this.grantHandModal = true
        },
        /**
         * @name:手工满赠确认
         */
        toPrintHand () {
            const obj = {
                customerPhone: this.handWorkForm.code,
                storeCode: this.$store.getters.storeInfo.code,
                defineDetails: [this.selsectTable]
            }
            axios({
                path: 'ScheduleGiftAddManualRecord',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    this.grantHandModal = false
                    this.handTicketQuery = true
                    this.handTicketData = res.data
                }
            })
        },
        /**
         * @name: 手工满赠小票弹框关闭
         */
        handClose () {
            this.handWorkForm.customerTelephone = ''
            this.handWorkForm.customerName = ''
            this.handWorkForm.customerAddress = ''
            this.handWorkForm.code = ''
            this.handSearchValue = undefined
        }
    }
}
</script>

<style lang="less" scoped>
.giftIoIssue{
    background-color: #fff;
    height: 100%;
    overflow: auto;
}
.box {
  padding: 0 10px;
  .header-option {
    .ant-col-8 {
      height: 40px;
      line-height: 40px;
      text-align: right;
    }
  }
  .paynumbers {
    margin-bottom: 10px;
    span {
      margin-right: 15px;
      cursor: pointer;
    }
  }
  // .gift-list {
  //   margin-bottom: 10px;
  //   .card-header {
  //     display: flex;
  //     justify-content: space-between;
  //     margin-bottom: 10px;
  //     span {
  //       margin-right: 15px;
  //     }
  //   }
  //   .card-content {
  //     p {
  //       margin-bottom: 10px;
  //       .ant-btn {
  //         float: right;
  //       }
  //     }
  //   }
  // }
}
#print-box {
  width: 400px;
}
.handWorkTab{
  .ant-col-xl-2, .ant-col-sm-7, .ant-col-md-3{
    text-align: right;
    font-weight: 700;
    padding-right: 10px;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    margin-bottom: 15px;
  }
  .ant-col-sm-17, .ant-col-md-9, .ant-col-xl-10{
    margin-bottom: 15px;
  }
}
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
 }
 .Btnfooter{
   position: fixed;
   bottom:45px;
   right:10px;
 }
</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-23 13:56:14
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach" >
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="addRegister">暂存登记</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="addDelivery">暂存出库</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="detailsSumbit">预览</a-button>
    </seachBox>

    <a-spin :spinning="spinning">
      <div class="mint" :style="{ height: $store.getters.windowHeight - 250 + 'px' }">
        <div v-if="billsList.length === 0" class="noData">
          暂无数据...
        </div>
        <a-radio-group @change="onChange" >
          <a-row v-for="(item, index) in billsList" :key="index" type="flex" align="middle" justify="space-around">
            <a-col :span="1" style="text-align: center">
              <a-radio :value="item" ></a-radio>
            </a-col>
            <a-col :span="23">
              <div class="mintBox">
                <div class="mintHead">
                  <a-row>
                    <a-col :sm="2" :md="3" :xl="2">送货单号:</a-col>
                    <a-col :sm="22" :md="5" :xl="3">{{ item.code }}</a-col>
                    <a-col :sm="2" :md="3" :xl="2">预约时间:</a-col>
                    <a-col :sm="22" :md="5" :xl="4">{{ item.keepSendPreTime }}</a-col>
                    <a-col :sm="2" :md="3" :xl="2">司机姓名:</a-col>
                    <a-col :sm="22" :md="5" :xl="3">{{ item.driverName }}</a-col>
                    <a-col :sm="2" :md="3" :xl="2">状态:</a-col>
                    <a-col :sm="22" :md="5" :xl="2">{{ item.statusName }}</a-col>
                    <a-col :sm="2" :md="3" :xl="2">暂存状态:</a-col>
                    <a-col :sm="22" :md="5" :xl="2">{{ item.keepStatusName }}</a-col>
                    <a-col :sm="2" :md="3" :xl="2">备注:</a-col>
                    <a-col :sm="22" :md="5" :xl="10">{{ item.keepNote }}</a-col>
                  </a-row>
                </div>
                <hr>
                <div class="mintMid">
                  <div class="mintBillsLeft">
                    <div class="mintImg">
                      <img :src="item.skuImg" alt="找不到图片" class="img" v-if="item.skuImg" :onerror="defaultImgUrl">
                      <img src="@assets/goods.png" class="img" v-else>
                    </div>
                    <div class="mintMidSku">
                      <div style="margin: 9px 0;">{{ item.skuName }}</div>
                      <span style="margin-right: 10px">{{ item.skuCode }}</span>
                      <span style="margin-right: 10px">{{ item.skuModel }}</span>
                      <span>数量:{{ item.skuNum || '' }}台</span>
                    </div>
                  </div>
                  <div class="mintBillsRight">
                    <pre> <a-icon type="user" /> {{ item.custName }}  {{ item.custPhone }}</pre>
                    <pre> <a-icon type="environment" style="color: red" /> {{ item.custAddr }}</pre>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-radio-group>
      </div>
    </a-spin>
    <a-modal
      centered
      :width="800"
      class="doc"
      destroyOnClose
      title="暂存登记"
      :closable="false"
      :maskClosable="false"
      v-model="registerVisible"
      :bodyStyle="{height:'584px',width:'800px'}"
      @ok="onRegister">
      <h4>暂存信息</h4>
      <a-row class="doc">
        <a-col :span="4">暂存预约送货时间</a-col>
        <a-col :span="20">
          <a-date-picker
            format="YYYY-MM-DD HH:mm:ss"
            :disabledDate="disabledDate"
            v-model="storageObj.reginsterDates"
            style="width: 100%"/>
        </a-col>
        <a-col :span="4">暂存预约备注</a-col>
        <a-col :span="20">
          <a-textarea placeholder="请输入备注" v-model="storageObj.keepNote" maxlength="250" style="resize: none;"/>
        </a-col>
      </a-row>
      <div style="margin: 5px 0;">
        <span style="margin-right: 480px">送货单信息</span>
        <span><a-input
          placeholder="请输入/扫描送货单号"
          size="small"
          style="width: 200px"
          v-model="codes"
          @pressEnter="onFind(codes)"
          :disabled="disabled" /></span>
      </div>
      <div class="clientServiced">
        <a-row v-for="(item, index) in storageList" :key="index" type="flex" align="middle" justify="space-around">
          <a-col :span="24">
            <div class="mintBox">
              <div class="mintHead">
                <a-row>
                  <a-col :span="3">送货单号单号:</a-col>
                  <a-col :span="4">{{ item.code }}</a-col>
                  <a-col :span="3">预约送货时间:</a-col>
                  <a-col :span="4">{{ item.sendTime }}</a-col>
                  <a-col :span="1">线路:</a-col>
                  <a-col :span="4">{{ item.routeName }}</a-col>
                  <a-col :span="1">状态:</a-col>
                  <a-col :span="2">{{ item.statusName }}</a-col>
                  <a-col :span="1">
                    <a-button type="primary" size="small" style="margin: 0 5px" @click="onBillsDel(index)">删除</a-button>
                  </a-col>
                  <a-col :span="2">备注:</a-col>
                  <a-col :span="10">{{ item.sendNote }}</a-col>
                </a-row>
              </div>
              <hr>
              <div class="mintMid">
                <div class="cutoffRule"></div>
                <a-row type="flex" align="middle">
                  <a-col :span="12" style="border-right: 1px solid #ccc;">
                    <div class="mintImg">
                      <img :src="item.skuImg" class="img" v-if="item.skuImg" :onerror="defaultImgUrl">
                      <img src="@assets/goods.png" class="img" v-else>
                    </div>
                    <div class="mintMidSku">
                      <span class="skuName">{{ item.skuName }}</span>
                      <span>{{ item.skuCode }}</span>
                      <span>{{ item.skuModel }}</span>
                      <span>数量:{{ item.skuNum || '' }}台</span>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <pre>  <a-icon type="user" /> {{ item.custName }}  {{ item.custPhone }}</pre>
                    <pre>  <a-icon type="environment" style="color: red" /> {{ item.custAddr }}</pre>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <preview
      v-model="previewVisbel"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent">
      <div slot="C" title="商品详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    </preview>
  </div>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import moment from 'moment'
export default {
    name: 'TemporaryReport',
    components: { seachBox, Preview },
    data () {
        return {
            disabled: false,
            codes: '',
            spinning: false,
            previewContent: {},
            previewVisbel: false,
            storageObj: {
                reginsterDates: moment()
            }, // 登记数据
            registerVisible: false, // 控制暂存登记打开
            billsList: [],
            storageList: [],
            tags: [],
            orderId: '',
            // 表头id
            tableCode: '',
            // 负责人
            customerLIst: [],
            // 接口
            tableApiPath: '',
            // 工具栏搜索框
            conditions: [
                {
                    key: 'dateType',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: '0', label: '销售日期' },
                        { value: '1', label: '预约送货时间' }
                    ]
                },
                {
                    title: '开始时间',
                    key: 'beginTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'endTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '送货单号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    key: 'keepStatus',
                    type: 'select',
                    title: '暂存状态',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 'bill_deliver_keep_status:2', label: '已暂存' },
                        { value: 'bill_deliver_keep_status:3', label: '已出库' }
                    ]
                }
            ],
            // 工具栏按钮定义
            btns: ['export', 'print'],
            // 搜索框默认值
            seachValue: {
                beginTime: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: '1'
            },
            billsData: [],
            // 基础信息
            previewHeaders: [
                { key: 'code', name: '送货单号' },
                { key: 'sourceCode', name: '源单号' },
                { key: 'saleStoreName', name: '销货位置' },
                { key: 'saleDate', name: '销货时间' },
                { key: 'pickStoreName', name: '提货位置' },
                { key: 'pickTypeName', name: '提货方式' },
                { key: 'custName', name: '顾客姓名' },
                { key: 'keepSendPreTime', name: '暂存预约送货时间' },
                { key: 'custPhone', name: '手机号' },
                { key: 'statusName', name: '送货单状态' },
                { key: 'recUserno', name: '暂存状态' },
                { key: 'route', name: '线路' },
                { key: 'custAddr', name: '地址' },
                { key: 'vehicle', name: '送货车辆' },
                { key: 'driverName', name: '司机姓名' },
                { key: 'keepName', name: '暂存登记人' },
                { key: 'keepTime', name: '暂存登记时间' },
                { key: 'keepSendName', name: '暂存出库人' },
                { key: 'keepSendTime', name: '暂存出库时间' },
                { key: 'keepNote', name: '暂存备注' }
            ],
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '商品条码', dataIndex: 'skuBarcode', width: 100, align: 'center' },
                { title: '品牌', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '品类', dataIndex: 'className', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 200, align: 'center' },
                { title: '数量', dataIndex: 'skuNum', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            // reginsterDates: moment(),
            deliverCode: '',
            detailsData: [],
            judgeApi: false,
            page: 1,
            total: 1,
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            checked: false
        }
    },
    mounted () {
        console.log(this.$store.getters.windowHeight)
        this.$nextTick(() => {
            const a = document.getElementsByClassName('mint')
            a[0].addEventListener('scroll', this.onScroll)
        })
    },
    methods: {
        onFind (code) {
            if (!code) { return }
            this.disabled = true
            if (this.storageList.length > 0) {
                return this.$message.error('已存在单据,请先提交该单据!')
            }
            axios({
                path: 'DistributionDelverTempFindTemp',
                method: 'post',
                body: {
                    code: code,
                    keepStatus: '4'
                }
            }).then(res => {
                this.disabled = false
                this.codes = ''
                if (res.flag === 1) {
                    const arr = res.data.list
                    console.log(arr, '当前,,,,,,')
                    if (arr.length === 1) {
                        this.storageList = [...arr]
                        this.storageObj.reginsterDates = moment(arr[0].sendTime)
                    } else {
                        this.$message.warning('数据异常!')
                    }
                }
            })
        },
        getScrollTop () {
            let scrollTop = null
            if (document.getElementsByClassName('mint')[0] && document.getElementsByClassName('mint')[0].scrollTop) {
                scrollTop = document.getElementsByClassName('mint')[0].scrollTop
            }
            return scrollTop
        },
        onScroll () {
            if (document.getElementsByClassName('mint')[0].scrollHeight - this.getScrollTop() === this.$store.getters.windowHeight - 250) {
                this.tableTS({
                    rows: 5,
                    page: this.page++
                })
            }
        },
        tableTS (data) {
            console.log(this.total, 999)
            if (this.total === this.billsList.length) { return }
            this.spinning = true
            axios({
                path: 'DistributionDelverTempFindTemp',
                method: 'post',
                body: data
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.billsList.push(...res.data.list)
                    this.total = res.data.total
                }
            })
        },
        detailsSumbit () {
            console.log(this.detailsData)
            if (this.detailsData.length === 0) { return this.$message.error('请选择单据!') }
            this.orderId = this.detailsData.code
            this.previewContent.headers = {
                ...this.detailsData
            }
            this.billsData = [this.detailsData]
            this.previewVisbel = true
        },
        /**
         * @name:出库
         */
        addDelivery () {
            if (!this.deliverCode) { return this.$message.warning('请选择单据!') }
            const that = this
            this.$confirm({
                title: '暂存出库',
                content: '送货单号:' + that.deliverCode + ',确认现在出库吗?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistributionDelverTempUpdateTempOutWarehouse',
                        method: 'post',
                        body: { ids: that.storageObj.ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deliverCode = ''
                            that.storageObj = {}
                            that.onSeach({ keepStatus: 'bill_deliver_keep_status:3' })
                        }
                    })
                }
            })
        },
        /**
         * @name:暂存登记时间限制
         */
        disabledDate (e) {
            return e <= moment().add(1, 'days')
        },
        disabledDateTime () {
            return {
                disabledHours: () => this.range(0, 24).splice(0, moment().hour()),
                disabledMinutes: () => this.range(0, moment().minute()),
                disabledSeconds: () => [0, moment().second()]
            }
        },
        range (start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },
        /**
         * @name:登记提交
         */
        onRegister () {
            if (!this.storageObj.reginsterDates) { return this.$message.error('请选择预约时间!') }
            this.storageObj.keepSendPreTime = this.storageObj.reginsterDates.format('YYYY-MM-DD HH:mm:ss')
            console.log(this.storageList)
            this.storageObj.ids = [this.storageList[0].id]
            axios({
                path: 'DistributionDelverTempUpdateTemp',
                method: 'post',
                body: this.storageObj
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.storageObj = {}
                    this.detailsData = []
                    this.storageList = []
                    this.onSeach({ keepStatus: 'bill_deliver_keep_status:2' })
                }
            })
        },
        /**
         * @name: 点击暂存登记按钮
         */
        addRegister () {
            this.codes = ''
            this.storageList = []
            this.registerVisible = true
        },
        onChange (e) {
            console.log(e)
            this.detailsData = { ...e.target.value }
            this.deliverCode = e.target.value.code
            this.storageObj.ids = [e.target.value.id]
            this.storageObj.reginsterDates = moment(e.target.value.keepSendPreTime)
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e = {}) {
            console.log(e, '搜索框数据')
            // if (JSON.stringify(e) === '{}') {
            this.tableTS({
                rows: 5,
                page: this.page++
            })
            //     return
            // }
            axios({
                path: 'DistributionDelverTempFindTemp',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.total = res.data.total
                    this.billsList = res.data.list
                }
            })
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {

            } else if (e === 'del') {

            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionDelverTempFind', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
               * @name:删除单据
               */
        onBillsDel (del) {
            console.log(del)
            this.storageList.splice(del, 1)
        }
    }
}
</script>
<style lang='less' scoped>
    .mint {
        margin: 0 10px;
        border: 1px solid #ccc;
        padding: 10px;
        min-width: 876px;
        overflow-y: auto;
        box-sizing: border-box;
        background: #fff;
        .ant-radio-group {
            .mintBox {
                margin-bottom: 10px;
                font-size: 12px;
                border:1px solid #ccc;
                hr {
                    margin: 0;
                }
                .mintHead {
                    padding: 5px;
                }
                .mintMid {
                    height: 82px;
                    min-width: 800px;
                    box-sizing: border-box;
                    .mintBillsLeft {
                      width: 50%;
                      height: 100%;
                      display: inline-block;
                      border-right: 1px solid #ccc;
                      .mintImg {
                        .img {
                            width: 60px;
                            height: 60px;
                            margin: 0 10px;
                        }
                          width: 80px;
                          height: 80px;
                          float: left;
                          padding: 10px 0;
                      }
                      .mintMidSku {
                          float: left;
                          margin-top: 15px;
                          margin-bottom: 22px;
                      }
                    }
                    .mintBillsRight {
                      width: 50%;
                      height: 100%;
                      display: inline-block;
                    }
                    /* .mintImg {
                        .img {
                            width: 60px;
                            height: 60px;
                            position: absolute;
                            top: 50%;
                            margin-top: -30px;
                        }
                        width: 80px;
                        height: 80px;
                        position: relative;
                        padding-left: 10px;
                        display: inline-block;
                    }
                    .mintMidSku {
                        display: inline-block;
                        margin-bottom: 22px;
                    } */
                }
            }
            width: 100%;
        }
    }
.clientServiced {
    height: 422px;
    overflow-y: auto;
    padding: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    .doc {
        .ant-input-number {
            width:100%;
        }
    }
    .mintBox {
        margin-bottom: 10px;
        font-size: 12px;
        border: 1px solid #ccc;
    hr {
        margin: 0;
    }
    .mintHead {
        padding: 5px;
    }
    .mintMid {
        height: 82px;
        box-sizing: border-box;
        overflow: hidden;
        .mintImg {
            .img {
                padding:0;
                border:0;
                width: 60px;
                height: 60px;
                position: absolute;
                top: 50%;
                margin-top: -30px;
            }
            width: 80px;
            height: 80px;
            position: relative;
            padding: 0 10px;
            float: left;
        }
        .mintMidSku {
            height: 82px;
            line-height: 34px;
            span {
                margin-right: 10px;
            }
            .skuName {
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                width: 230px;
                display: inline-block;
            }
        }
    }
    }
}
.noData {
    width: 100%;
    height: 100%;
    text-align: center;
    margin: 100px 0;
}
</style>

<!--
 * @Description: ERP
 * @Version: V0.0.10
 * @Company: BestTop
 * @Author: shuai
 * @Date: 2019-07-29 19:38:14
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-23 14:37:57
 -->
<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-07-24 12:16:04
 -->
<template>
  <div>
    <div style="margin:10px 0px">
      <a-button
        class="billType"
        v-for="(item, index) in billTypeList"
        :key="index"
        @click="billTypeChange(item)"
        :style="{background: item.backColor, color: item.color}"
      >{{ item.name }}({{ item.am }})
      </a-button>
    </div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="onSorting(-1)">分拣</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="canCelSortOut(-1)">取消分拣</a-button>
    </seachBox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <!-- 拆单 -->
    <a-modal
      v-model="DispatchVisible"
      title="拆单"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="600"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'300px',width:'600px'}"
      centered>
      <div class="clientService" style="height: 260px">
        <a-row type="flex" align="middle" justify="space-around">
          <a-col :span="24">
            <div class="mintBox">
              <div class="mintHead">
                <a-row>
                  <a-col :span="3">送货单号:</a-col>
                  <a-col :span="5">{{ billObj.code }}</a-col>
                  <a-col :span="4">预约送货时间:</a-col>
                  <a-col :span="5">{{ billObj.sendTime }}</a-col>
                </a-row>
              </div>
              <hr>
              <div class="mintMid">
                <div class="mintImg">
                  <img :src="billObj.imgUrl" alt="暂无图片" class="img" v-if="billObj.imgUrl">
                  <img src="@assets/goods.png" class="img" v-else>
                </div>
                <div class="mintMidSku">
                  <pre>{{ billObj.skuName }}  {{ billObj.skuCode }}  {{ billObj.skuModel }}</pre>
                  <span>原数量: {{ billObj.skuNums }}</span>
                  <span>拆分后数量: {{ amounts }}</span>
                </div>
              </div>
            </div>
            <a-row class="doc">
              <a-col :span="4">拆分数量</a-col>
              <a-col :span="8"><a-input-number :min="0" v-model="billObj.am" @change="amountChange" /></a-col>
              <a-col :span="4">预约送货时间</a-col>
              <a-col :span="8"><a-date-picker format="YYYY-MM-DD HH:mm:ss" :disabledDate="disabledDate" style="width: 100%" v-model="billObj.sendTimes" showTime /></a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div slot="footer">
        <a-button @click="() => DispatchVisible = false" size="small">取消</a-button>
        <a-button @click="onDispatchConfirm(billObj)" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <!-- 取消分拣 -->
    <a-modal
      v-model="cancelDispatchVisible"
      title="取消分拣"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="400"
      class="doc"
      :bodyStyle="{height:'250px',width:'400px'}"
      destroyOnClose
      centered>
      <h4>确定取消分拣?</h4>
      <div>
        取消原因:
        <a-select
          style="width: 100%"
          v-model="cancelObj.chacelNote"
          :options="cancelList"
          allowClear
          showSearch/>
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="cancelObj.note" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => cancelDispatchVisible = false" size="small" >否</a-button>
        <a-button @click="onSortingOffSelect(cancelObj)" type="primary" size="small" >是</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<style lang="less">
.billType {
    margin: 0 10px;
}
// 拆单
.clientService {
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
            display: inline-block;
            span {
                margin-right: 10px;
            }
        }
    }
    }
}
</style>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import getStatus from '@comp/statusAll/getStatus'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
export default {
    name: 'SortingManage',
    components: {
        SeachBox,
        NewTable,
        detailsPreview,
        getStatus
    },
    data () {
        return {
            pams: {},
            detailsTitle: '分拣管理详情',
            previewVisbel: false,
            // title按钮
            billTypeList: [
                {
                    name: '全部',
                    am: 0,
                    billType: '',
                    backColor: '#1890ff',
                    color: '#fff'
                },
                {
                    name: '零售',
                    am: 0,
                    billType: 'bill_deliver_sale_type:1',
                    color: '#606266'
                },
                {
                    name: '分销',
                    am: 0,
                    billType: 'bill_deliver_sale_type:2',
                    color: '#606266'
                },
                {
                    name: '内部调拨',
                    am: 0,
                    billType: 'bill_deliver_sale_type:3',
                    color: '#606266'
                },
                {
                    name: '第三方派单',
                    am: 0,
                    billType: 'bill_deliver_sale_type:4',
                    color: '#606266'
                }
            ],
            billTypeBtn: '',
            // 工具栏
            conditions: [
                {
                    key: 'dateType',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 0, label: '销售日期' },
                        { value: 1, label: '预约送货时间' }
                    ]
                },
                {
                    title: '开始时间',
                    key: 'saleDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'saleAsDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '综合查询',
                    type: 'input',
                    key: 'condy',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '提货位置',
                    key: 'pickStoreCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                    // path: 'OrganizationStoreFindCondition'
                },
                {
                    title: '品牌',
                    type: 'input',
                    key: 'brandCode',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '品类',
                    key: 'classCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'GoodsCategoryFindTreeOption'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 'bill_deliver_status:1', label: '待分拣' },
                        { value: 'bill_deliver_status:2', label: '待派工' }
                    ]
                },
                {
                    title: '线路',
                    key: 'route',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                }
            ],
            btns: ['del', 'export', 'print'],
            seachValue: {
                saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: 1,
                status: 'bill_deliver_status:1'
            },
            // 主表
            tableCode: '89cde90d766a4c69995ed5d5af87cf83:SortingManage',
            tableApiPath: 'DeliverDivisionFindSorting',
            disContextMenu: [],
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '拆单',
                    action: 'SortingManage.add',
                    fc: this.splitOpenASingle
                },
                {
                    name: '分拣',
                    action: 'SortingManage.add',
                    fc: this.onSorting
                },
                {
                    name: '取消分拣',
                    action: 'SortingManage.add',
                    fc: this.canCelSortOut
                },
                {
                    name: '预览',
                    action: 'SortingManage.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            // 拆单
            DispatchVisible: false,
            billObj: {
                sendTimes: moment(),
                code: '',
                sendTime: '',
                skuName: '',
                skuCode: '',
                skuModel: '',
                skuNums: 0,
                am: 0
            },
            // 取消分拣
            cancelDispatchVisible: false,
            cancelList: [],
            cancelObj: {},
            sortOutId: []

        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableCode = '89cde90d766a4c69995ed5d5af87cf83:SortingManage'
            // this.tableApiPath = 'DeliverDivisionFindSorting'
            this.$refs.newTable.setTableColumns(this.tableCode)
            this.$refs.newTable.setContextmenu(this.rightMenu)
            this.onSeach(this.seachValue)
        })
        this.getAll()
    },
    computed: {
        amounts () {
            let sum = null
            if (this.billObj.am === 0) {
                sum = 0
            } else {
                sum = this.billObj.skuNums - this.billObj.am
            }
            return sum
        }
    },
    methods: {
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '送货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '送货单来源', code: e.billTypeName },
                { name: '预约送货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        /**
         * @name: 取消分拣
         * @msg:
         * @param {type}
         * @return:
         */
        canCelSortOut (e) {
            console.log(e)
            this.sortOutId = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_deliver_status:1') {
                        this.$message.warning('选中数据存在未分拣数据！')
                        return
                    } else {
                        this.sortOutId = map(this.selectArr, 'id')
                    }
                }
            } else {
                this.sortOutId.push(e.id)
            }
            this.onSelectConfig('bill_deliver_log_happen_type_sorting')
            this.cancelDispatchVisible = true
        },
        /**
         * @name: 取消分拣提交
         * @msg:
         * @param {type}
         * @return:
         */
        onSortingOffSelect (e) {
            if (!e.chacelNote) { return this.$message.error('请选择取消原因!') }
            e.ids = this.sortOutId
            const that = this
            axios({
                path: 'BillDeliverUpdateCancelSorting',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.cancelObj = {}
                    that.onSeach(that.seachValue)
                    this.cancelDispatchVisible = false
                }
            })
        },
        /**
         * @name: 取消原因
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectConfig (type) {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: type
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.configKey
                        i.title = i.value
                    })
                    this.cancelList = [...data]
                }
            })
        },
        /**
         * @name: 分拣
         * @msg:
         * @param {type}
         * @return:
         */
        onSorting (e) {
            console.log(e)
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_deliver_status:2') {
                        this.$message.warning('选中数据存在已分拣数据！')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            const that = this
            this.$confirm({
                title: '分拣',
                content: '是否确认单据分拣?',
                onOk () {
                    axios({
                        path: 'BillDeliverUpdateSorting',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.onSeach(that.seachValue)
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 拆单弹框
         * @msg:
         * @param {type}
         * @return:
         */
        splitOpenASingle (e) {
            console.log(e)
            const obj = { ...e }
            obj.skuNums = obj.skuNum
            if (obj.skuNums <= 1) { return this.$message.warning('送货数量小于等于1,不能拆单!') }
            this.billObj = Object.assign(this.billObj, obj)
            this.DispatchVisible = true
        },
        /**
         * @name: 拆单
         * @msg:
         * @param {type}
         * @return:
         */
        onDispatchConfirm (e) {
            if (!e.sendTimes) { return this.$message.warning('请选择预约送货时间') }
            e.sendTime = e.sendTimes.format('YYYY-MM-DD HH:mm:ss')
            e.skuNum = e.am
            e.isReturn = null
            axios({
                path: 'BillDeliverAddSplit',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.onSeach(this.seachValue)
                    this.DispatchVisible = false
                }
            })
        },
        /**
         * @name: 拆分数量
         * @msg:
         * @param {type}
         * @return:
         */
        amountChange () {
            if (this.billObj.am >= this.billObj.skuNums) {
                this.billObj.am = this.billObj.skuNums - 1
            }
        },
        /**
         * @name: 拆单时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        },
        /**
         * @name: title按钮切换
         * @msg:
         * @param {type}
         * @return:
         */
        billTypeChange (e) {
            this.billTypeBtn = e.billType
            for (const i of this.billTypeList) {
                if (e.billType === i.billType) {
                    i.backColor = '#1890ff'
                    i.color = '#fff'
                } else {
                    i.backColor = ''
                    i.color = '#606266'
                }
            }
            this.seachValue.billType = e.billType
            this.onSeach(this.seachValue)
        },
        /**
         * @name: 工具栏按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'add') {
                // console.log('新增')
            } else if (e === 'del') {
                // console.log('批量删除')
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DeliverDivisionFindSorting', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {
                billType: this.billTypeBtn
            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            axios({
                path: 'DeliverDivisionFindSorting',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    // 获取单据状态数量
                    this.billTypeList.forEach(e => {
                        if (e.billType === '') {
                            e.am = data.typeDsf + data.typeLs + data.typeFx + data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:1') {
                            e.am = data.typeLs
                        } else if (e.billType === 'bill_deliver_sale_type:2') {
                            e.am = data.typeFx
                        } else if (e.billType === 'bill_deliver_sale_type:3') {
                            e.am = data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:4') {
                            e.am = data.typeDsf
                        }
                    })
                    this.$set(this.conditions[8], 'selectDataArr', data.routes)
                    // this.$refs.newTable.setTableData(data.list, { path: 'DeliverDivisionFindSorting' })
                    const obj = Object.assign(this.seachValue, { path: 'DeliverDivisionFindSorting' })
                    this.$refs.newTable.reload(this.tableCode, obj)
                }
            })
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_deliver_status:1') {
                this.disContextMenu = ['取消分拣']
            } else if (status === 'bill_deliver_status:2') {
                this.disContextMenu = ['拆单', '分拣']
            }
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
        },
        getAll () {
            // 机构
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.$set(this.conditions[4], 'selectDataArr', data)
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'SortingManage') {
            }
        }
    }
}
</script>

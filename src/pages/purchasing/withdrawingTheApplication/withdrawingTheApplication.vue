<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-26 17:13:20
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      showOrganize
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :orderId="orderId"
      :tags="tags"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索供应商"
                :getPopupContainer="trigger => trigger.parentNode"
                :options="providerArr"
                @change="theGoodsLocation"
                @search="priverSearch"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('applyWithdrawing.providerCode',{initialValue:BaseMessageObj.providerCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('applyWithdrawing.makeStore', {initialValue:`${this.$store.getters.storeInfo.code}-${this.$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">退货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                ref="applyStore"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请检索退货位置"
                :filterOption="filterOption"
                :options="distributionCenterArr"
                @search="LocationSearch"
                style="width:100%"
                v-decorator="$check('applyWithdrawing.applyStore',{initialValue:BaseMessageObj.applyStore})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索申请人"
                showSearch
                allowClear
                :getPopupContainer="trigger => trigger.parentNode"
                :filterOption="filterOption"
                :options="applicantArr"
                @search="applicantSearch"
                style="width:100%"
                v-decorator="$check('applyWithdrawing.applyBy',{initialValue:BaseMessageObj.applyBy})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('applyWithdrawing.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="commodityAdd">添加商品</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" type="danger">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="batchId"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scroll">
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:60px">退货数量 :</span>
            <span>{{ salesReturnNumber }}</span>
            <span style="margin-left:120px">退货总额 ：</span>
            <span>{{ sumChangeM(theTotalReturn) }}</span>
            <span style="margin-left:120px">退货总额(不含税) ：</span>
            <span>{{ sumChangeM(theTotalReturnNo) }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.batchId)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-for="col in ['returnPrice','applyNumber','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'returnPrice'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.batchId, col)" />
              <a-input-number
                v-else-if="col === 'applyNumber'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :formatter="value => `-${value}`"
                :parser="value => value.replace('-', '')"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.batchId, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChange(e.target.value, record.batchId, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('applyWithdrawing.createBy', {initialValue:BaseMessageObj.createBy || `${this.$store.getters.code}-${this.$store.getters.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('applyWithdrawing.createTime', {initialValue:BaseMessageObj.createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsB :visible.sync="storeQuery" :pams="pams" @onSelect="onSelectBounced"/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import Preview from '@pages/purchasing/withdrawingTheApplication/preview/withdrawingTheApplicationPreview'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import moment from 'moment'
import is from 'is_js'
import getStatus from '@comp/statusAll/getStatus'
import goodsB from '@pages/purchasing/withdrawingTheApplication/goodsBounced/goodsB'
export default {
    name: 'WithdrawingTheApplication',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        goodsB,
        Preview
    },
    data () {
        return {
            previewVisbel: false,
            title: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '审核人',
                    key: 'approveBy',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
                {
                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // filter: true,
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // body: {
                    //     type: 'apply_withdrawing_status'
                    // }
                    title: '单据状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '制单开始时间',
                    type: 'date',
                    key: 'startTime'
                },
                {
                    title: '制单结束时间',
                    type: 'date',
                    key: 'endTime'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'withdrawingTheApplication.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'withdrawingTheApplication.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'withdrawingTheApplication.verify',
                    fc: this.auditHandler
                },
                {
                    name: '预览',
                    action: 'withdrawingTheApplication.get',
                    fc: this.detailsSumbit
                }
            ],
            seachValue: {
                startTime: moment().subtract({ days: 7 }),
                endTime: moment()
            },
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            rowId: {},
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '现库存', dataIndex: 'stockNumber', width: 80, align: 'right' },
                { title: '退货价', dataIndex: 'returnPrice', width: 150, scopedSlots: { customRender: 'returnPrice' } },
                { title: '退货数量', dataIndex: 'applyNumber', width: 100, scopedSlots: { customRender: 'applyNumber' } },
                { title: '退货价(不含税)', dataIndex: 'returnPriceNo', width: 100, align: 'right' },
                { title: '批次号', dataIndex: 'batchNumber', width: 100 },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'unit', width: 50 },
                { title: '税率', dataIndex: 'rates', width: 50, align: 'right' },
                { title: '零售价', dataIndex: 'price', width: 80, align: 'right' },
                { title: '退货总额', dataIndex: 'returnAmount', width: 100, align: 'right' },
                { title: '退货总额(不含税)', dataIndex: 'returnAmountNo', width: 150, align: 'right' },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, align: 'center', scopedSlots: { customRender: 'action' } }
            ], // 表头
            categoryinfoData: [], // 表体
            orderId: '',
            tags: [],
            scroll: { x: 2220, y: 350 },
            applicantArr: [], // 申请人
            storeQuery: false,
            pams: {},
            providerArr: [],
            distributionCenterArr: [],
            providerId: '',
            flagProviderCode: false, // 开启供应商下拉框提示
            theTotalReturn: '0', // 退货总额
            theTotalReturnNo: '0', // 退货总额不含税
            salesReturnNumber: '0', // 退货数量
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '070602d8b62e4c6e8ba76f9a5ec7407a:withdrawingTheApplication'
            this.tableApiPath = 'ApplyWithdrawingFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('apply_withdrawing_status', this.conditions[2])
        this.seachValue = {
            startTime: moment().subtract({ days: 7 }),
            endTime: moment(),
            status: 'apply_withdrawing_status:1'
        }
    },
    methods: {
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 总计
         * @msg:
         * @param {type}
         * @return:
         */
        total () {
            const { add } = this.$math
            const totalArr = [...this.categoryinfoData]
            const salesReturnNumberArr = []
            const ReturnOfThePriceNoArr = []
            const theTotalReturnNoArr = []
            for (const item of totalArr) {
                salesReturnNumberArr.push(item.applyNumber)
                ReturnOfThePriceNoArr.push(item.returnAmount)
                theTotalReturnNoArr.push(item.returnAmountNo)
            }
            this.salesReturnNumber = salesReturnNumberArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.theTotalReturn = ReturnOfThePriceNoArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.theTotalReturnNo = theTotalReturnNoArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        /**
         * @name: 获取供应商
         * @msg:
         * @param {type}
         * @return:
         */
        // providerFun () {
        //     axios({
        //         path: 'CustomerSupplierFindOption',
        //         method: 'post',
        //         body: {},
        //         headers: {}
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             console.log('获取供应商', res.data)
        //             res.data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.providerArr = [...res.data]
        //         }
        //     })
        // },
        onSelectBounced (arr) {
            console.log(arr, '选择商品')
            this.categoryinfoSelectedRowKeys = []
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.batchId === i.batchId)
                const { add, div, mul } = this.$math
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        batchId: i.batchId,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        batchNumber: i.batchNumber,
                        unit: i.unit,
                        skuModel: i.skuModel,
                        discount: i.discount,
                        discounts: this.rateTransform(i.discount),
                        rates: this.rateTransform(i.rate),
                        rate: i.rate,
                        stockNumber: i.stockNumber,
                        price: i.price,
                        returnPrice: i.skuPtCost,
                        returnPriceNo: div(i.skuPtCost, add(1, i.rate, 2), 2),
                        applyNumber: 1,
                        returnAmount: mul(1, i.skuPtCost, 2),
                        returnAmountNo: div(mul(1, i.skuPtCost, 2), add(1, i.rate, 2), 2)
                    })
                } else {
                    error.push(i.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.total()
            console.log(this.categoryinfoData)
        },
        commodityAdd () {
            if (!this.providerId) {
                this.$message.warning(`请选择供应商!`)
            } else if (!this.$refs.applyStore.value) {
                this.$message.warning(`请选择退货位置!`)
            } else {
                this.pams = {
                    storeCode: this.$refs.applyStore.value.split('-')[0],
                    providerCode: this.providerId
                }
                this.storeQuery = true
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const newData = [...this.categoryinfoData]
                if (newData.length === 0) {
                    this.$message.warning(`请添加退库商品!`)
                    return
                }
                for (const i of newData) {
                    if (i.applyNumber === 0) {
                        this.$message.warning(`商品编码为${i.skuCode}退货数量为0，请输入实配数量!`)
                        return
                    }
                }
                values.makeStore = values.makeStore.split('-')[0]
                values.createBy = values.createBy.split('-')[0]
                values.providerCode = values.providerCode.split('-')[0]
                values.applyBy = values.applyBy.split('-')[0]
                values.applyStore = values.applyStore.split('-')[0]
                if (!err) {
                    let addArr = {}
                    this.submitLoading = true
                    addArr = Object.assign(values, { detail: newData })
                    if (this.addEdit === 'edit') {
                        addArr = Object.assign(addArr, this.rowId)
                    }
                    axios({
                        path: this.addEdit === 'add' ? 'ApplyWithdrawingAdd' : 'ApplyWithdrawingUpdate',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                            this.categoryinfoData = []
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
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
            if (status === 'apply_withdrawing_status:1') {
                this.disContextMenu = []
            } else if (status === 'apply_withdrawing_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
        // 搜索框方法
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ApplyWithdrawingFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ApplyWithdrawingFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
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
        /**
         * @name: 表格右击删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (row) {
            this.onDel(row)
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'ApplyWithdrawingAudit',
                        method: 'post',
                        body: {
                            id: e.id
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 取消确认
         * @msg:
         * @param {type}
         * @return:
         */
        cancelTheConfirmation (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否取消确认?',
                onOk () {
                    axios({
                        path: 'DistributionBillAllotWithdraw',
                        method: 'post',
                        body: {
                            id: e.id,
                            sourceStoreCode: that.$store.getters.storeInfo.code
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 删除方法
         * @msg:
         * @param {type}
         * @return:
         */
        onDel (e) {
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
                    if (statusArr[item] === 'apply_withdrawing_status:2') {
                        this.$message.warning('选中数据存在已审核数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'ApplyWithdrawingDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            this.categoryinfoData = []
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                this.addEdit = 'add'
                this.BaseMessageObj = {
                    applyTime: moment(),
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.title = '新增退库申请单'
                this.orderId = ''
                this.tags = []
                this.providerId = ''
                this.salesReturnNumber = '0'
                this.theTotalReturn = '0' // 退货总额
                this.theTotalReturnNo = '0' // 退货总额不含税
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑', index)
                this.rowId = {
                    id: index.id,
                    code: index.code
                }
                this.providerId = index.providerCode
                console.log(index.providerCode, '777777777777777777')
                const arr = { ...index }
                arr.createBy = `${arr.createBy}-${arr.createName}`
                arr.makeStore = `${arr.makeStore}-${arr.makeStoreName}`
                arr.providerCode = `${arr.providerCode}-${arr.providerName}`
                arr.applyBy = `${arr.applyBy}-${arr.applyName}`
                arr.applyStore = `${arr.applyStore}-${arr.applyStoreName}`
                this.BaseMessageObj = arr
                this.addEdit = 'edit'
                this.title = '编辑退库申请单'
                this.orderId = index.code
                this.tags = ['uncheck']
                this.editTheDetails(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        /**
         * @name: 编辑详情
         * @msg:
         * @param {type}
         * @return:
         */
        editTheDetails (e) {
            axios({
                path: 'ApplyWithdrawingFindDetail',
                method: 'post',
                body: {
                    code: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('编辑详情', res.data)
                    const { mul, div, add } = this.$math
                    const { abs } = this.$math
                    const editArr = res.data
                    editArr.forEach(i => {
                        i.index = this.indexNumber++
                        i.discounts = this.rateTransform(i.discount)
                        i.rates = this.rateTransform(i.rate)
                        i.applyNumber = abs(i.applyNumber, 0)
                        i.returnPriceNo = div(i.returnPrice, add(1, i.rate, 2), 2)
                        i.returnAmount = mul(i.applyNumber, i.returnPrice, 2)
                        i.returnAmountNo = div(i.returnAmount, add(1, i.rate, 2), 2)
                    })
                    this.categoryinfoData = res.data
                    this.total()
                }
            })
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (batchId) {
            console.log(batchId)
            if (batchId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].batchId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.batchId !== batchId)
            }
            this.total()
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isAfter()
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const { mul, div, add } = this.$math
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.batchId)[0]
            if (target) {
                target[col] = val
                if (col === 'returnPrice' || col === 'applyNumber') {
                    if (!is.number(val)) {
                        return
                    }
                    if (Number(target.applyNumber) > Number(target.stockNumber)) {
                        this.$message.warning(`${target.skuName}商品的sku库存量为${target.stockNumber}，不能退出${target.applyNumber}，请重新输入`)
                        target.applyNumber = target.stockNumber
                    }
                    target.returnAmount = mul(target.applyNumber, target.returnPrice, 2)
                    console.log(target.returnAmount, '----------------', target.skuTaxRate)
                    target.returnAmountNo = div(target.returnAmount, add(1, target.rate, 2), 2)
                }
                this.categoryinfoData = newData
            }
            this.total()
        },
        priverSearch (e) {
            console.log(e, '555555555555555')
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'CustomerSupplierFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.providerArr = [...data]
                    }
                })
            }, 300)
        },
        applicantSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'PermissionsUserFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.applicantArr = [...data]
                    }
                })
            }, 300)
        },
        LocationSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    condition: e,
                    type: 'store_type:2,store_type:3',
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'OrganizationStoreFind',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.distributionCenterArr = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 获取退货位置
         * @msg:
         * @param {type}
         * @return:
         */
        distributionCenter () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    type: 'store_type:2,store_type:3'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取配送中心', res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.distributionCenterArr = [...data]
                }
            })
        },
        theGoodsLocation (e) {
            this.providerId = e
            this.flagProviderCode = true
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        providerId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flagProviderCode) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                                that.salesReturnNumber = '0'
                                that.theTotalReturn = '0' // 退货总额
                                that.theTotalReturnNo = '0' // 退货总额不含税
                            },
                            onCancel () {
                                console.log(oldval)
                                that.providerId = oldval
                                that.form.setFieldsValue({ providerCode: oldval })
                            }
                        })
                    }
                }
                this.flagProviderCode = false
            }
        },
        addEditModel (val) {
            if (!val) {
                this.BaseMessageObj = {}
                this.categoryinfoData = []
                this.indexNumber = 1
            }
        }

    }
}
</script>

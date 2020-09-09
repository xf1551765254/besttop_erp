<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-28 15:34:25
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :rowSelect="false"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
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
      <template slot="footer">
        <a-button style="margin-left:10px;" @click="submitClick($event,'1')" type="primary">提交审核</a-button>
      </template>
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                disabled
                v-decorator="$check('WithdrawingDocuments.providerCode',{initialValue:BaseMessageObj.providerCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                disabled
                v-decorator="$check('WithdrawingDocuments.code',{initialValue:BaseMessageObj.code})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('WithdrawingDocuments.makeStore', {initialValue: BaseMessageObj.makeStore})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">退库位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                disabled
                v-decorator="$check('WithdrawingDocuments.applyStore',{initialValue:BaseMessageObj.applyStore})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">验收人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索验收人"
                style="width: 100%"
                v-decorator="$check('WithdrawingDocuments.entryBy', {initialValue:BaseMessageObj.entryBy})"
                :options="customerLIst"
                @search="applicantSearch"
                :filterOption="false"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('WithdrawingDocuments.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-table
          rowKey="batchId"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scroll">
          <!-- <template v-for="col in ['note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input
                v-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChange(e.target.value, record.batchId, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template> -->
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:60px">退库数量 :</span>
            <span>{{ salesReturnNumber }}</span>
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
                v-decorator="$check('applyWithdrawing.createBy', {initialValue:BaseMessageObj.createBy})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('applyWithdrawing.createTime', {initialValue:BaseMessageObj.createTime || createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style scoped>
.baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import seachBox from '@comp/seachBox'
import Preview from '../preview/ReturnManagementPurchasePreview'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
export default {
    name: 'ReturnManagement',
    components: { seachBox, NewTable, Preview, BtModal },
    data () {
        return {
            createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            tags: [],
            orderId: '',
            billsData: [],
            previewVisbel: false,
            // 多选选中
            deleteAll: [],
            // 控制右键菜单
            disContextMenu: [],
            // 接口
            tableApiPath: '',
            // 表头id
            tableCode: '',
            // 搜索框默认值
            seachValue: {
                beginMakeTime: moment().subtract({ days: 7 }),
                endMakeTime: moment(),
                makeStoreCode: this.$store.getters.storeInfo.code
            },
            // 工具栏按钮定义
            btns: ['export', 'print'],
            conditions: [
                {
                    title: '供应商',
                    key: 'provider',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'CustomerSupplierFindOption'
                },
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单开始时间',
                    key: 'beginMakeTime',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'endMakeTime',
                    type: 'date'
                },
                {
                    title: '制单人',
                    key: 'makeUserCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }
            ],
            MenuOperations: [
                {
                    name: '退库',
                    action: 'ReturnManagement.add',
                    fc: this.cancellingStocksHandler
                },
                {
                    name: '预览',
                    action: 'ReturnManagement.get',
                    fc: this.detailsSumbit
                }
            ],
            addEditModel: false,
            submitLoading: false,
            BaseMessageObj: {},
            scroll: { x: 1350, y: 350 },
            title: '退库',
            form: this.$form.createForm(this),
            categoryinfoColumns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '批次号', dataIndex: 'batchNumber', align: 'left', width: 90 },
                { title: '退货数量', dataIndex: 'entryQtty', align: 'right', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'left', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'left', width: 300 },
                { title: '规格型号', dataIndex: 'model', align: 'left', width: 300 },
                { title: '品牌', dataIndex: 'brandName', align: 'left', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', align: 'left', width: 50 },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } }
            ], // 表头
            categoryinfoData: [], // 表体
            salesReturnNumber: 0, // 退库数量
            customerLIst: [], // 负责人
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '5ee363e3d1ae4f4aa3316554d6ba83b1:WithdrawingDocuments'
            this.tableApiPath = 'DistributionBillExitFindApplyWithdrawing'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
    },
    methods: {
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
            for (const item of totalArr) {
                salesReturnNumberArr.push(item.applyNumber)
            }
            this.salesReturnNumber = salesReturnNumberArr.reduce(function (prev, cur) {
                return add(prev, cur, 0)
            }, 0)
        },
        /**
         * @name: 提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e, item) {
            console.log(item)
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const newData = [...this.categoryinfoData]
                const { abs } = this.$math
                values.makeStoreCode = values.makeStore.split('-')[0]
                values.createBy = values.createBy.split('-')[0]
                values.entryMakeStoreCode = values.applyStore.split('-')[0]
                values.provider = values.providerCode.split('-')[0]
                values.entryBy = values.entryBy.split('-')[0]
                values.sourceCode = values.code
                values.billSource = 1
                if (item > 0) {
                    values.submitAndAudit = 1
                } else {
                    values.submitAndAudit = 2
                }
                newData.forEach(i => {
                    i.entryQtty = Number(abs(i.entryQtty))
                })
                if (!err) {
                    let addArr = {}
                    this.submitLoading = true
                    addArr = Object.assign(values, { billEntryDetails: newData })
                    axios({
                        path: 'DistributionBillExitAddExit',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        detailsSumbit (e) {
            console.log(e, '本行数据')
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 退库
         * @msg:
         * @param {type}
         * @return:
         */
        cancellingStocksHandler (e) {
            console.log(e)
            const row = { ...e }
            row.createBy = `${row.createBy}-${row.createName}`
            row.makeStore = `${row.makeStore}-${row.makeStoreName}`
            row.applyStore = `${row.applyStore}-${row.applyStoreName}`
            row.providerCode = `${row.providerCode}-${row.providerName}`
            this.BaseMessageObj = { ...row }
            axios({
                path: 'DistributionBillExitFindApplyWithdrawingDetail',
                method: 'post',
                body: {
                    code: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const editArr = res.data
                    editArr.forEach(i => {
                        i.index = this.indexNumber++
                        i.entryQtty = i.applyNumber
                        i.basicUnit = i.unit
                        i.model = i.skuModel
                        i.taxRate = i.rate
                    })
                    this.categoryinfoData = res.data
                    this.total()
                }
                this.addEditModel = true
            })
        },
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.batchId)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionBillExitFindApplyWithdrawing', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus, '审核状态')
            if (billStatus === 'bill_entry_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            e.path = 'DistributionBillExitFindApplyWithdrawing'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {
                makeStoreCode: this.$store.getters.storeInfo.code
            }
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
                        this.customerLIst = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 下拉框
         */
        getAll () {
            // 获取退货人信息
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '负责人')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.customerLIst = [...data]
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ReturnManagement') {

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

<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-28 15:51:57
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
      @onSeach="onSeach">
      <a-button size="small" type="primary" style="margin-right:10px" v-action:add @click="jointOperationbePutInStorage">联营退库</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="clientVisible"
      title="退库单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <template slot="footer">
        <a-button style="margin-left:10px;" @click="submitData($event,'1')" type="primary">提交审核</a-button>
      </template>
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索供应商"
                v-decorator="$check('cancellingStocks.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                :filterOption="false"
                allowClear
                @search="handleSearchSupplierCode"
                :disabled="invoicesType"
                showSearch/>
            </a-form-item>
          </a-col>
          <div v-if="invoicesType">
            <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input v-decorator="$check('cancellingStocks.sourceCode',{initialValue:billsForm.sourceCode})" disabled/>
              </a-form-item>
            </a-col>
          </div>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('cancellingStocks.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('cancellingStocks.entryMakeStoreCode',{initialValue:billsForm.entryMakeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">验收人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索验收人"
                :disabled="invoicesType"
                v-decorator="$check('cancellingStocks.entryBy', {initialValue:billsForm.entryBy})"
                @search="handleSearchBuyBy"
                :options="customerLIst"
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
              <a-textarea v-decorator="$check('cancellingStocks.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">退库明细</h4>
        <div v-if="!invoicesType">
          <a-button class="editable-add-btn" size="small" @click="addManage">选择商品</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button size="small" class="categoryinfo-btn" type="danger">删除</a-button>
          </a-popconfirm>
        </div>
        <a-table
          rowKey="skuCode"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :rowSelection="invoicesType?null:{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :pagination="false"
          :scroll="{x:1450,y:350}">
          <template v-for="col in ['entryQtty', 'note' ]" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="!invoicesType && col === 'entryQtty'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :formatter="value => `-${value}`"
                :parser="value => value.replace('-', '')"
                :value="text"
                @change="e => InputStorageChange(e, record.skuCode, col)" />
              <a-input
                v-else-if="!invoicesType && col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.skuCode, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="footer">
            <h3 style="display:inline;">总计</h3>
            <span style="margin-left:50px">数量:</span>
            <span></span>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.skuCode)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('cancellingStocks.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('cancellingStocks.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsBounced :flagObj="flagObj" :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="selectData"/>
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
import getStatus from '@comp/statusAll/getStatus'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import Preview from '../preview/ReturnManagementCancellingStocksPreview'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsBounced'
export default {
    name: 'CancellingStocks',
    components: { seachBox, NewTable, BtModal, goodsBounced, Preview, getStatus },
    data () {
        return {
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
            seachValue: {},
            // 工具栏按钮定义
            btns: ['del', 'export', 'print'],
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
                    title: '单据状态',
                    type: 'select',
                    key: 'billStatus',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '类型',
                    key: 'provider',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'CustomerSupplierFindOption'
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
                    name: '编辑',
                    action: 'ReturnManagement.get',
                    fc: this.cancellingStocksHandler
                },
                {
                    name: '删除',
                    action: 'ReturnManagement.delete',
                    fc: this.onDel
                },
                {
                    name: '审核',
                    action: 'ReturnManagement.verify',
                    fc: this.anditHandler
                },
                {
                    name: '预览',
                    action: 'ReturnManagement.get',
                    fc: this.detailsSumbit
                }
            ],
            clientVisible: false,
            submitLoading: false,
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            billsForm: {},
            form: this.$form.createForm(this), // 表单
            customerLIst: [], // 负责人
            providerList: [],
            selectedRowKeys: [],
            columns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '退库数量', dataIndex: 'entryQtty', width: 100, align: 'right', scopedSlots: { customRender: 'entryQtty' } },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'model', width: 300, align: 'left' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 90, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
                { title: '单位', dataIndex: 'basicUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } }
            ],
            storeQuery: false,
            pamsBounced: {}, // 添加商品传入参数
            addEdit: '',
            rowId: '',
            invoicesType: false, // 单据类型
            flagObj: {},
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '34cf75fdbf96451b9c6f604b622afcf3:cancellingStocks'
            this.tableApiPath = 'DistributionBillExitFindExit'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_entry_status', this.conditions[2])
        this.seachValue = {
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment(),
            billStatus: 'bill_entry_status:1'
        }
    },
    methods: {
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerLIst.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
        /**
         * @name: 供应商搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchSupplierCode (value) {
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.providerList.length = 0
                this.getData({
                    name: value
                }, path)
            }, 300)
        },
        /**
         * @name: 数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    if (path === 'CustomerSupplierFindOption') {
                        this.providerList = data
                    } else if (path === 'PermissionsUserFindOption') {
                        this.customerLIst = data
                    }
                }
            })
        },

        submitData (e, item) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const newData = [...this.billsData]
                const { abs } = this.$math
                values.makeStoreCode = values.makeStoreCode.split('-')[0]
                values.entryMakeStoreCode = values.entryMakeStoreCode.split('-')[0]
                values.makeUserCode = values.makeUserCode.split('-')[0]
                values.provider = values.provider.split('-')[0]
                values.entryBy = values.entryBy.split('-')[0]
                values.billSource = 2
                if (item > 0) {
                    values.submitAndAudit = 1
                } else {
                    values.submitAndAudit = 2
                }
                if (this.addEdit === 'edit') {
                    values.id = this.rowId
                }
                newData.forEach(i => {
                    i.entryQtty = Number(abs(i.entryQtty))
                })
                if (!err) {
                    let addArr = {}
                    this.submitLoading = true
                    addArr = Object.assign(values, { billEntryDetails: newData })
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionBillExitAddExit' : 'DistributionBillExitUpdateExit',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.clientVisible = false
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
         * @name: 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        cancellingStocksHandler (e) {
            console.log(e)
            this.addEdit = 'edit'
            this.rowId = e.id
            const row = { ...e }
            row.makeStoreCode = `${row.makeStoreCode}-${row.makeStoreName}`
            row.entryMakeStoreCode = `${row.entryMakeStoreCode}-${row.entryMakeStoreName}`
            row.makeUserCode = `${row.makeUserCode}-${row.makeUserName}`
            row.provider = `${row.provider}-${row.providerName}`
            row.entryBy = `${row.entryBy}-${row.entryByName}`
            this.billsForm = row
            axios({
                path: 'DistributionBillExitFindExitDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    const { abs } = this.$math
                    if (e.billSource === 1) {
                        this.invoicesType = true
                    } else {
                        this.invoicesType = false
                        data.forEach(i => {
                            i.index = this.indexNumber++
                            i.entryQtty = Number(abs(i.entryQtty))
                        })
                    }
                    this.billsData = data
                    this.clientVisible = true
                }
            })
        },
        /**
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
         */
        anditHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'DistributionBillExitAuditExit',
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
        addManage () {
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            this.pamsBounced.provider = this.form.getFieldValue('provider').split('-')[0]
            this.pamsBounced.storeCode = this.form.getFieldValue('makeStoreCode').split('-')[0]
            this.pamsBounced.businessType = 'provider_contract_business_type:2'
            this.flagObj = {
                url: true,
                flag: 1
            }
            this.storeQuery = true
        },
        /**
         * @name: 联营入库
         * @msg:
         * @param {type}
         * @return:
         */
        jointOperationbePutInStorage () {
            this.addEdit = 'add'
            this.billsForm = {}
            this.billsData = []
            this.invoicesType = false
            this.clientVisible = true
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (skuCode) {
            console.log(skuCode)
            if (skuCode === -1) {
                const billsData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in billsData) {
                        if (billsData[j].skuCode === this.selectedRowKeys[i]) {
                            billsData.splice(j, 1)
                        }
                    }
                }
                this.billsData = billsData
            } else {
                const billsData = [...this.billsData]
                this.billsData = billsData.filter(item => item.skuCode !== skuCode)
            }
        },
        /**
         * @name:选中添加的商品
         */
        selectData (e) {
            console.log(e)
            const arr = [...e]
            this.form.setFieldsValue({ sourceCode: '' })
            const error = []
            arr.forEach(i => {
                const list = this.billsData.filter(o => o.skuCode === i.skuCode)
                if (list.length === 0) {
                    this.billsData.unshift({
                        index: this.indexNumber++,
                        detailId: i.id,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        model: i.skuModel,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        basicUnit: i.skuUnit,
                        entryQtty: 1,
                        taxRate: i.skuTaxRate
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
            console.log(this.billsData, 999999999)
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[key] = val
                this.billsData = newData
            }
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                this.$refs.newTable.exportFile('DistributionBillExitFindExit', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            if (e === 1) {
                arr = [...this.deleteAll]
            } else {
                arr.push(e.id)
            }
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
                return
            }
            const that = this
            this.$confirm({
                title: '删除确认',
                content: '删除后不可恢复，确定继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistributionBillExitDeleteExit',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll = []
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {

                }
            })
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
        onContextmenuChange (e) {
            console.log(e, '审核状态')
            if (e.billStatus === 'bill_entry_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            e.path = 'DistributionBillExitFindExit'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ReturnManagement') {

            }
        },
        clientVisible (val) {
            if (!val) {
                this.billsData = []
                this.billsForm = {}
                this.indexNumber = 1
            }
        }
    }
}
</script>

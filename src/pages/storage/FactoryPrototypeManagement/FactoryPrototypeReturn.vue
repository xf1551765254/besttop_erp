<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-27 17:16:50
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
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="clientVisible"
      title="厂家样机退库单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索供应商"
                v-decorator="$check('bill_sample_entry.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                @change="providerChange"
                @search="priverSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_entry.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">退库位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索退库位置"
                v-decorator="$check('bill_sample_entry.storeCode',{initialValue:billsForm.storeCode })"
                :options="distributionCenterArr"
                @search="LocationSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_sample_entry.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">商品详情</h4>
        <a-button class="editable-add-btn" @click="addManage">选择商品</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="{x:1650,y:350}">
          <template v-for="col in ['recN', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'recN'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :formatter="value => `-${value}`"
                :parser="value => value.replace('-', '')"
                :precision="0"
                :value="text"
                @change="e => InputStorageChange(e, record.id, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.id, col)"
              />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.id)" okText="是" cancelText="否">
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
              <a-input v-decorator="$check('bill_sample_entry.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_entry.makeDt', {initialValue: billsForm.makeDt || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <Goods :visible.sync="userQuery" @onSelect="onUserSelect" :pams="userSet" multiple></Goods>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>
<script>
import Goods from '@pages/storage/FactoryPrototypeManagement/contractGoods/goods'
import Preview from './preview/FactoryPrototypeReturnPreview'
import getStatus from '@comp/statusAll/getStatus'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import BtModal from '@comp/Modal'
// 单据表格表头
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '商品SKU编码', dataIndex: 'skuCode', width: 100, align: 'left' },
    { title: '商品SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
    { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
    { title: '申请退库数量', dataIndex: 'recN', width: 150, align: 'right', scopedSlots: { customRender: 'recN' } },
    { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'left' },
    { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'left' },
    { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'FactoryPrototypeReturn',
    components: { seachBox, NewTable, Goods, BtModal, Preview },
    data () {
        return {
            provider: '',
            previewVisbel: false,
            // 供应商
            providerList: [],
            tags: [],
            orderId: '',
            bt_id: '',
            deleteAll: [],
            // 控制新增 || 编辑
            bt_Save: false,

            title: '',
            // 单据表头
            columns,
            // 客户传入参数
            userSet: {},
            // 表格多选
            userAll: [],
            // 单据表格表体
            billsData: [],
            // 单据默认值
            billsForm: {},
            // 表头id
            tableCode: '',
            // 接口
            tableApiPath: '',
            userQuery: false,
            // 控制弹窗
            clientVisible: false,
            // 多选选中单据
            selectedRowKeys: [],
            // 工具栏搜索框
            conditions: [
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
                    // path: 'OrganizationConfigFindByType',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'makeUserno',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
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
                    title: '制单开始时间',
                    key: 'beginMakeTime',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'endMakeTime',
                    type: 'date'
                }
            ],
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'FactoryPrototypeReturn.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'FactoryPrototypeReturn.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '确认',
                    action: 'FactoryPrototypeReturn.confirm',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '取消确认',
                    action: 'FactoryPrototypeReturn.cancel',
                    fc: this.cancelTheConfirmation
                },
                {
                    name: '预览',
                    action: 'FactoryPrototypeStorage.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ],
            // 加载状态
            loading: false,
            // 表格右击禁用
            disContextMenu: [],
            // 表单
            form: this.$form.createForm(this),
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            // 搜索框默认值
            seachValue: {
                billStatus: 'bill_sample_entry_status:1',
                beginMakeTime: moment().subtract(7, 'days'),
                endMakeTime: moment()
            },
            // 制单时间
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            // 退库时间默认当天
            postDate: moment(),
            statusData: [],
            distributionCenterArr: [],
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '3bb33923a8154f37855ec804028a2464:FactoryPrototypeReturn'
            this.tableApiPath = 'SampleSampleExitFindExit'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
            getStatus('bill_sample_entry_status', this.conditions[1])
            this.seachValue = {
                billStatus: 'bill_sample_entry_status:1',
                beginMakeTime: moment().subtract(7, 'days'),
                endMakeTime: moment()
            }
        })
    },
    methods: {
        // getStatus () {
        //     axios({
        //         path: 'OrganizationConfigFindByType',
        //         method: 'past',
        //         body: { type: 'bill_sample_entry_status' }
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.title = i.value
        //                 i.value = `${i.type}:${i.configKey}`
        //                 i.key = `${i.type}:${i.configKey}`
        //             })
        //             this.$set(this.conditions[1], 'selectDataArr', data)
        //             console.log(this.conditions[1], 'status')
        //             this.seachValue.billStatus = 'bill_sample_entry_status:1'
        //         }
        //     })
        // },
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name:监听供应商
         */
        providerChange (e) {
            console.log(e, '供应商')
            if (this.billsData.length === 0) {
                this.provider = e
            }
            if (this.billsData.length > 0) {
                const that = this
                that.$confirm({
                    title: '',
                    content: '当前操作将会清除明细,是否继续?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.billsData = []
                        that.provider = e
                    },
                    onCancel () {
                        // that.billsForm.provider = that.provider
                        that.form.setFieldsValue({ provider: that.provider })
                        console.log(that.billsForm.provider, 55555555)
                    }
                })
            }
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            console.log(e, '编辑')
            this.orderId = e.code
            this.tags = ['uncheck']
            this.bt_id = e.id
            this.provider = e.provider
            this.billsForm = { ...e }
            this.billsForm.recDt = moment(e.recDt)
            this.billsForm.storeCode = `${e.storeCode}-${e.storeName}`
            this.billsForm.provider = `${e.provider}-${e.providerName}`
            this.billsForm.makeStoreCode = `${e.makeStoreCode}-${e.makeStoreName}`
            this.billsForm.makeUserno = `${e.makeUserno}-${e.makeUserName}`
            axios({
                path: 'SampleSampleExitFindExitDetail',
                method: 'post',
                body: {
                    id: e.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '编辑获取表格')
                    const data = res.data
                    data.forEach(i => {
                        i.index = this.indexNumber++
                    })

                    this.billsData = data
                }
            })
        },
        /**
         * @name:选中客户数据
         */
        async onUserSelect (e) {
            console.log(e, '添加')
            const error = []
            e.forEach(item => {
                item.recN = 1
                const list = this.billsData.filter(o => o.detailId === item.detailId)
                if (list.length === 0) {
                    item.index = this.indexNumber++
                    this.billsData.push(item)
                } else {
                    error.push(item.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name:保存单据
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = values
                    formDate.makeStoreCode = values.makeStoreCode.split('-')[0]
                    formDate.makeUserno = values.makeUserno.split('-')[0]
                    formDate.storeCode = values.storeCode.split('-')[0]
                    formDate.provider = values.provider.split('-')[0]
                    formDate.recDt = moment(formDate.recDt).format('YYYY-MM-DD hh:mm:ss')
                    formDate.billSampleEntryDetails = this.billsData
                    formDate.sourceType = 'allot_source_type:2'
                    if (formDate.billSampleEntryDetails.length === 0) {
                        this.loading = false
                        return this.$message.error('请选择明细,明细不能为空!')
                    }
                    for (const i of formDate.billSampleEntryDetails) {
                        if (!i.recN) {
                            this.loading = false
                            return this.$message.warning('当前提交退库数量不能为空!')
                        }
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    }
                    axios({
                        path: this.bt_Save ? 'SampleSampleExitUpdateExit' : 'SampleSampleExitAddExit',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.getDate()
                            this.clientVisible = false
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            if (key === 'recN' && typeof val !== 'number') return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                this.billsData = newData
            }
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
        onSeach (e) {
            console.log(e, this.conditions[2], '点击搜索')
            e.path = 'SampleSampleExitFindExit'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.bt_Save = false
                this.billsForm = {}
                this.billsData = []
                this.orderId = ''
                this.tags = []
                this.clientVisible = true
                this.loading = false
                this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SampleSampleExitFindExit', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            if (mun === 'edit') {
                this.bt_Save = true
                this.editRow(e)
                this.clientVisible = true
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
            }
        },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            if (e === 1) {
                arr = this.deleteAll
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
                        path: 'SampleSampleExitDeleteExit',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll = []
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 确认
         */
        auditSumbit (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否确认当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SampleSampleEntryPurchaseConfirm',
                        method: 'post',
                        body: {
                            id: e.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                }
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
                        path: 'SampleSampleEntryPurchaseNoConfirm',
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
         * @name:右击表格
         */
        onContextmenuChange (e) {
            console.log(e.billStatus)
            if (e.billStatus === 'bill_sample_entry_status:1') {
                this.disContextMenu = ['取消确认']
            } else if (e.billStatus === 'bill_sample_entry_status:2') {
                this.disContextMenu = ['编辑', '删除', '确认', '取消确认']
            } else if (e.billStatus === 'bill_sample_entry_status:3') {
                this.disContextMenu = ['编辑', '删除', '确认']
            }
        },
        /**
         * @name: 单据新增行
         */
        addManage () {
            if (!this.form.getFieldValue('provider')) {
                return this.$message.error('请选择供应商!')
            }
            if (!this.form.getFieldValue('storeCode')) {
                return this.$message.error('请选择退库位置!')
            }
            this.userSet.provider = this.form.getFieldValue('provider').split('-')[0]
            this.userSet.storeCode = this.form.getFieldValue('storeCode').split('-')[0]
            this.userQuery = true
        },
        /**
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del, '单据删除')
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].id === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.id !== del)
            }
            this.selectedRowKeys = []
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('3bb33923a8154f37855ec804028a2464:FactoryPrototypeReturn', { path: 'SampleSampleExitFindExit' })
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
                        this.providerList = [...data]
                    }
                })
            }, 300)
        },
        LocationSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    code: this.$store.getters.storeInfo.code,
                    condition: e,
                    status: '0',
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'OrganizationStoreFindStoreAndDirect',
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
         * @name: 下拉框
         */
        getAll () {
            // 获取供应商
            axios({
                path: 'CustomerSupplierFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '供应商')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.providerList = [...data]
                }
            })
            // 获取收获位置
            axios({
                path: 'OrganizationStoreFindStoreAndDirect',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code,
                    status: '0'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取收获位置', res.data)
                    const arr = res.data
                    arr.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.distributionCenterArr = [...arr]
                }
            })
        }
    },
    watch: {
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

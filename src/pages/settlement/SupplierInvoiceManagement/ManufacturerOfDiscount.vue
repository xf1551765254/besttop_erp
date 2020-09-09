
<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-27 10:45:30
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
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 弹窗 -->
    <bt-modal
      v-model="editVisible"
      title="厂家折让单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.sourceCode',{initialValue:billsForm.sourceCode})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                v-decorator="$check('BillRebate.provider',{initialValue:billsForm.provider} ) "
                :options="providerList"
                @select="providerSelect"
                @search="priverSearch"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('BillRebate.chargeUserno', {initialValue:billsForm.chargeUserno})"
                :options="customerLIst"
                @search="applicantSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">折让类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                v-decorator="$check('BillRebate.billType',{initialValue:billsForm.billType} ) "
                :options="billTypeList"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code} : ${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('BillRebate.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">厂家折让单</h4>
        <a-button class="editable-add-btn" @click="deliveryStorage">选择入库单折让</a-button>
        <a-button class="editable-add-btn" @click="chargeAgainst ">增加商品</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="{x:1800, y:350}">
          <template v-for="col in ['priceInOrig','qtty', 'reason', 'priceIn']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'priceInOrig'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputChange(e, record.id, col)" />
              <a-input-number
                v-else-if="col === 'priceIn'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputChange(e, record.id, col)" />
              <a-input-number
                v-else-if="col === 'qtty'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :value="text"
                :precision="0"
                @change="e => InputChange(e, record.id, col)" />
              <a-input
                v-else-if="col === 'reason'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.id, col)"
              />
              <span v-else>{{ text }}</span>
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
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:120px">折让数量:</span>
            <span>{{ qtty }}</span>
            <span style="margin-left:120px">折让金额:</span>
            <span>{{ rebateAmount }}</span>
            <span style="margin-left:120px">不含税折让:</span>
            <span>{{ taxAxclusiveAmount }}</span>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">录入人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code} : ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">录入时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.auditUserno',)" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillRebate.auditTime')" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <rebateStorage ref="rebateStorage" :visible.sync="rebateStorageQuery" @onSelect="rebateStorageSelect" @amountInvoice="amountInvoice" :pams="rebateStoragePams" />
      <chargeAgainst :visible.sync="chargeAgainstQuery" @onSelectForm="rebateStorageSelect" :pams="chargeAgainstPams" multiple/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import rebateStorage from '@pages/settlement/SupplierInvoiceManagement/user/rebateStorage'
import chargeAgainst from '@pages/settlement/SupplierInvoiceManagement/user/chargeAgainst'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import Preview from './preview/ManufacturerOfDiscountPreview'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
const billsData = []
const columns = [
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'model', width: 300 },
    { title: '单位', dataIndex: 'basicUnit', width: 50 },
    { title: '零售价', dataIndex: 'price', width: 100, align: 'right' },
    { title: '税率', dataIndex: 'taxRates', width: 50, align: 'right' },
    { title: '原进价', dataIndex: 'priceInOrig', width: 100, align: 'right', scopedSlots: { customRender: 'priceInOrig' } },
    { title: '折让进价', dataIndex: 'priceIn', width: 100, align: 'right', scopedSlots: { customRender: 'priceIn' } },
    { title: '折让数量', dataIndex: 'qtty', width: 100, align: 'right', scopedSlots: { customRender: 'qtty' } },
    { title: '折让金额', dataIndex: 'rebateAmount', width: 100, align: 'right' },
    { title: '不含税折让', dataIndex: 'taxAxclusiveAmount', width: 100, align: 'right' },
    { title: '原因', dataIndex: 'reason', scopedSlots: { customRender: 'reason' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'ManufacturerOfDiscount',
    components: { seachBox, NewTable, rebateStorage, chargeAgainst, BtModal, Preview },
    data () {
        this.cacheData = billsData.map(item => ({ ...item }))
        return {
            tags: [],
            orderId: '',
            // 不含税折让
            taxAxclusiveAmount: '0.00',
            // 折让金额
            rebateAmount: '0.00',
            // 折让数量
            qtty: '0',
            amountInvoiceData: 0,
            charge: [],
            bt_id: '',
            bt_Save: false,
            // 冲销入参
            chargeAgainstPams: {},
            // 入库单入参
            rebateStoragePams: {},
            // 控制冲销选择框
            chargeAgainstQuery: false,
            // 控制入库单选择框
            rebateStorageQuery: false,
            // 单据标题
            title: '',
            // 单据明细表格
            billsData,
            // 单据明细表头
            columns,
            // 类型
            billTypeList: [],
            // 表单数据
            billsForm: [],
            // 负责人
            customerLIst: [],
            // 供应商
            providerList: [],
            // 单据弹窗
            editVisible: false,
            // 主表多选选中
            deleteAll: [],
            // 表头id
            tableCode: '',
            // 接口
            tableApiPath: '',
            // 表格右击禁用
            disContextMenu: [],
            // 搜索框默认值
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            // 单据表格多选
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
                    title: '制单开始时间',
                    key: 'auditTimeA',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'auditTimeB',
                    type: 'date'
                },
                {
                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_rebate_status', grade: '1' }
                    title: '确认状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
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
                    action: 'ManufacturerOfDiscount.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'ManufacturerOfDiscount.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'ManufacturerOfDiscount.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'ManufacturerOfDiscount.get',
                    fc: this.previewFun
                }
            ],
            loading: false,
            // 表单
            form: this.$form.createForm(this),
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            // 预览
            previewVisbel: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'c5459f040a6945718b11c2931b9148be7:ManufacturerOfDiscount'
            this.tableApiPath = 'InvoiceRebateFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_rebate_status', this.conditions[3])
        this.seachValue = {
            status: 'bill_rebate_status:1',
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment()
        }
        this.getAll()
    },
    methods: {
        previewFun (e) {
            console.log(e)
            this.orderId = e.code
            this.previewVisbel = true
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name:计算合计
         */
        count (data) {
            const { add } = this.$math
            const qtty = []
            const rebateAmount = []
            const taxAxclusiveAmount = []
            for (const item of data) {
                qtty.push(item.qtty)
                rebateAmount.push(item.rebateAmount)
                taxAxclusiveAmount.push(item.taxAxclusiveAmount)
            }
            this.qtty = qtty.reduce(function (prev, cur) {
                return add(prev, cur, 0)
            }, 0)
            this.rebateAmount = rebateAmount.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.taxAxclusiveAmount = taxAxclusiveAmount.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        amountInvoice (e) {
            this.amountInvoiceData = e
        },
        /**
         * @name:监听费用单表格编辑
         */
        InputChange (val, count, key) {
            if (val === '') {
                return
            }
            console.log(val, count, key, '监听')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.id)[0]
            console.log(target, 344563546365)
            if (target) {
                target[key] = val
                const { sub, mul, div, add } = this.$math
                const mun = sub(target.priceIn, target.priceInOrig)
                target.rebateAmount = mul(mun, target.qtty)
                target['taxAxclusiveAmount'] = div(target['rebateAmount'], add(1, target['taxRate']))
                this.billsData = newData
                this.count(this.billsData)
            }
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            const arr = { ...e }
            this.orderId = arr.code
            this.tags = ['uncheck']
            this.bt_id = arr.id
            this.editVisible = true
            this.providerSelect(arr.provider)
            console.log(arr.makeTime, '4356424')
            // arr.makeTime = moment(arr.makeTime)
            this.billsForm = { ...arr }
            axios({
                path: 'InvoiceRebateDetailFindDetail',
                method: 'post',
                body: {
                    rebateId: arr.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { sub, mul, div, add } = this.$math
                    for (const i of res.data.list) {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.rebateAmount = mul(sub(i.priceIn, i.priceInOrig), i.qtty)
                        i['taxAxclusiveAmount'] = div(mul(sub(i.priceIn, i.priceInOrig), i.qtty), add(1, i['taxRate']))
                    }
                    console.log(res.data, '编辑获取表格')
                    this.billsData = res.data.list
                    this.count(this.billsData)
                }
            })
        },
        /**
         * @name:增加商品
         */
        chargeAgainstSelect (e) {
            console.log(e)
        },
        /**
         * @name:打开增加商品弹窗
         */
        chargeAgainst () {
            if (!this.chargeAgainstPams.provider) {
                return this.$message.warning('请选择供应商!')
            }
            this.chargeAgainstQuery = true
        },
        /**
         * @name:监听供应商
         */
        providerSelect (val) {
            this.rebateStoragePams.provider = val
            this.chargeAgainstPams.provider = val
            console.log(val, '供应商')
        },
        /**
         * @name: 选择入库单
         */
        deliveryStorage () {
            if (!this.rebateStoragePams.provider) {
                return this.$message.error('您尚未选中供应商,请先选择供应商!')
            }
            this.$refs.rebateStorage.getData()
            this.rebateStorageQuery = true
        },
        /**
         * @name:入库单返回数据
         */
        rebateStorageSelect (e) {
            console.log(e, '入库单数据')
            if (this.billsData.length > 0) {
                const error = []
                e.forEach(mun => {
                    const list = this.billsData.filter(o => o.entryDetailId === mun.entryDetailId)
                    if (list.length === 0) {
                        this.billsData.push({
                            entryDetailId: mun.entryDetailId,
                            id: mun.id,
                            skuCode: mun.skuCode,
                            skuName: mun.skuName,
                            model: mun.model,
                            basicUnit: mun.basicUnit,
                            price: mun.price,
                            taxRate: mun.taxRate,
                            taxRates: this.rateTransform(mun.taxRate),
                            priceInOrig: mun.priceInOrig,
                            priceIn: mun.priceIn,
                            qtty: 0,
                            rebateAmount: 0.00,
                            taxAxclusiveAmount: 0.00,
                            atInvoice: mun.amountInvoice,
                            Bool: mun.Bool,
                            reason: mun.reason
                        })
                    } else {
                        error.push(mun.name)
                    }
                })
                if (error.length > 0) {
                    this.$notification.error({
                        message: '提示',
                        description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                    })
                }
            } else {
                e.forEach(obj => {
                    this.billsData.push({
                        id: obj.id,
                        entryDetailId: obj.entryDetailId,
                        skuCode: obj.skuCode,
                        skuName: obj.skuName,
                        model: obj.model,
                        basicUnit: obj.basicUnit,
                        price: obj.price,
                        taxRate: obj.taxRate,
                        taxRates: this.rateTransform(obj.taxRate),
                        priceInOrig: obj.priceInOrig,
                        priceIn: obj.priceIn,
                        qtty: 0,
                        rebateAmount: 0,
                        taxAxclusiveAmount: 0,
                        atInvoice: obj.amountInvoice,
                        Bool: obj.Bool,
                        reason: obj.reason
                    })
                })
            }
            this.count(this.billsData)
        },
        /**
         * @name: 保存
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = {}
                    const atInArr = []
                    const aInArr = []
                    formDate.billRebate = { ...values }
                    const { add } = this.$math
                    formDate.billRebateDetails = [...this.billsData]
                    for (const i of formDate.billRebateDetails) {
                        if (!i.priceInOrig || !i.priceIn || !i.qtty) {
                            this.loading = false
                            return this.$message.warning('明细数据不能存在空值,请完善数据再次提交!')
                        }
                        if (i.Bool === false && i.qtty < 1) {
                            this.loading = false
                            return this.$message.warning('折让数量不能为负数!')
                        }
                        atInArr.push(Number(i.rebateAmount))
                        aInArr.push(Number(i.taxAxclusiveAmount))
                    }
                    formDate.billRebate.atIn = atInArr.reduce((prev, cur) => {
                        return add(prev, cur, 2)
                    }, 0)
                    formDate.billRebate.aIn = aInArr.reduce((prev, cur) => {
                        return add(prev, cur, 2)
                    }, 0)
                    formDate.billRebate.atInvoice = this.amountInvoiceData

                    if (formDate.billRebateDetails.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    if (this.bt_Save) {
                        formDate.billRebate.id = this.bt_id
                    } else {
                        formDate.billRebate.makeStoreCode = this.$store.getters.storeInfo.code
                        formDate.billRebate.makeUserno = this.$store.getters.userInfo.code
                        for (const i of formDate.billRebateDetails) {
                            i.id = ''
                        }
                    }
                    axios({
                        path: this.bt_Save ? 'InvoiceRebateUpdateRebate' : 'InvoiceRebateAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.editVisible = false
                            this.getDate()
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },

        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.bt_Save = false
                this.billsData = []
                this.billsForm = {}
                this.orderId = ''
                this.tags = []
                this.title = '新增'
                this.editVisible = true
                this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ManufacturerOfDiscount', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            console.log(e, '编辑')
            if (mun === 'edit') {
                console.log('编辑')
                this.title = '编辑'
                this.bt_Save = true
                this.editRow(e)
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'InvoiceRebateFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.charge = []
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
                this.charge.push(i)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_rebate_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
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
                        path: 'InvoiceRebateDeleteRebate',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {

                }
            })
        },
        /**
         * @name: 审核
         */
        auditSumbit (e) {
            const that = this
            this.$confirm({
                title: '审核确认',
                content: '是否确认审核当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'InvoiceRebateAudit',
                        method: 'post',
                        body: {
                            id: e.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.getDate()
                        }
                    })
                },
                onCancel () {

                }
            })
        },
        priverSearch (e) {
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
            // 获取类型
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_rebate_bill_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data)
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.billTypeList = [...data]
                }
            })
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('c5459f040a6945718b11c2931b9148be7:ManufacturerOfDiscount', { path: 'InvoiceRebateFind' })
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = []
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del)
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
            if (this.billsData.length === 0) {
                this.selectedRowKeys = []
            }
        }
    }
}
</script>
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

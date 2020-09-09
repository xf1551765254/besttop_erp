<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-21 10:25:03
 * @LastEditTime: 2019-08-27 09:58:23
 -->
<template>
  <div>
    <!-- 发票勾兑弹窗 -->
    <bt-modal
      v-model="btVisible"
      title="发票勾兑单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">采集单号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width:100%"
                v-decorator="$check('invoiceRecord.jionCode', {initialValue:billsForm.jionCode})"
                :options="jionCodeList"
                allowClear
                @change="jionChange" />
              <!-- <a-input v-decorator="$check('invoiceRecord.jionCode',{initialValue:billsForm.jionCode})" @pressEnter="gather" /> -->
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width:100%"
                v-decorator="$check('invoiceRecord.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                allowClear
                @change="providerChange"
                @search="priverSearch" />
              <!-- <a-input v-decorator="$check('invoiceRecord.provider',{initialValue:billsForm.provider})" disabled/> -->
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                style="width: 100%"
                v-decorator="$check('invoiceRecord.chargeUserno', {initialValue:billsForm.chargeUserno})"
                :options="customerLIst"
                @search="applicantSearch" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">税票金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('invoiceRecord.invoiceAmount',{initialValue:billsForm.invoiceAmount || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">红字金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="maxRedAmount"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('invoiceRecord.redAmount',{initialValue:billsForm.redAmount || 0.00})"
                allowClear
                :disabled="redDisabled"
                @change="redAmountChange"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">蓝字金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.blueAmount',{initialValue: billsForm.blueAmount || 0.00})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">勾兑金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('invoiceRecord.recordAmount',{initialValue:billsForm.recordAmount || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">勾兑差额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('invoiceRecord.recordDifferences',{initialValue:billsForm.recordDifferences || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">税票清单</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.invoiceBillListing',{initialValue: billsForm.invoiceBillListing})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code} : ${$store.getters.storeInfo.name}`})" disabled/>
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
                v-decorator="$check('invoiceRecord.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">发票勾兑单</h4>
        <a-button class="editable-add-btn" @click="addManage">税票勾兑处理</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="blendId"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="scrollXY">
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.blendId)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">录入人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code} : ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">录入时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.auditUserCode',)" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('invoiceRecord.auditTime')" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 选择开票单据 -->
      <invoice :visible.sync="invoiceQuery" ref="reference" @onSelect="oninvoiceSelect" :pams="invoicePams" multiple/>
      <!-- 发票勾兑 -->
      <BlendTags ref="BlendTagsRef" :visible.sync="blendQuery" @onSelect="onblendSelect" :pams="blendPams" multiple/>
    </bt-modal>
  </div>
</template>
<style lang="less">
    @import "../../../../assets/modalStyle.less";
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
import invoice from '@pages/settlement/SupplierInvoiceManagement/BlendingTheInvoices/invoice'
import BlendTags from '@pages/settlement/SupplierInvoiceManagement/BlendingTheInvoices/blendTags'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import moment from 'moment'
export default {
    name: 'BlendingTheInvoiceChild',
    components: { seachBox, NewTable, invoice, BlendTags, BtModal },
    props: {
        btsave: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            provideCode: null,
            jionCode: null,
            maxRedAmount: null,
            redDisabled: true, // 红字金额控制显示
            providerList: [], // 供应商下拉框数据
            jionCodeList: [], // 采集单号数据
            btVisible: false,
            tags: [],
            orderId: '',
            textareaAll: 0,
            estimate: false,
            // 采集单号
            odd: '',
            bt_id: '',
            // 控制新增/ 编辑
            bt_Save: false,
            // 发票勾兑入参
            blendPams: {},
            // 发票勾兑弹窗
            blendQuery: false,
            // 开票单据入参
            invoicePams: {},
            // 开票单据弹窗控制
            invoiceQuery: false,
            // 负责人
            customerLIst: [],
            // 表单数据
            billsForm: {},
            // 按钮状态
            loading: false,
            // 表单
            form: this.$form.createForm(this),
            // 制单时间
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            // 单据表格表头
            columns: [
                { title: '核销类型', dataIndex: 'recordType', width: 100 },
                { title: '单据号', dataIndex: 'billCode', width: 150 },
                { title: '税票价', dataIndex: 'priceCostInvoice', width: 150, align: 'right' },
                { title: '税率', dataIndex: 'taxRates', width: 50, align: 'right' },
                { title: '应核销', dataIndex: 'fee', width: 100 },
                { title: '勾兑差额(含税)', dataIndex: 'recordDifferences', width: 250, align: 'right' },
                { title: '勾兑差额', dataIndex: 'onRecordDifferences', width: 150, align: 'right' },
                { title: '勾兑金额', dataIndex: 'recordAmount', width: 150, align: 'right' },
                { title: '原进价', dataIndex: 'priceCost', width: 150 },
                { title: '数量', dataIndex: 'qtty', width: 150 },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'name', width: 300 },
                { title: '规格型号', dataIndex: 'model', width: 300 },
                { title: '机构编码', dataIndex: 'storeCode', width: 80 },
                { title: '机构名称', dataIndex: 'storeName', width: 150 },
                { title: '分类编码', dataIndex: 'classCode', width: 80 },
                { title: '分类名称', dataIndex: 'className', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName', width: 150 },
                { title: '经营类型', dataIndex: 'goodsTypeName', width: 100 },
                { title: '备注', dataIndex: 'note' },
                { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            // 单据表格表体
            billsData: [],
            scrollXY: {
                x: 3800,
                y: 350
            },
            // 单据表格多选
            selectedRowKeys: []
        }
    },
    watch: {
        value: {
            handler (val) {
                this.btVisible = val
                this.redDisabled = true
                // this.onProvider() // 查询供应商
                this.collectNumber() // 查询采集单号
                console.log(this.btVisible)
            },
            immediate: true
        },
        btVisible (val) {
            this.$emit('input', val)
        }
    },
    methods: {
        confirmation (e) {
            if (e) {
                axios({
                    path: 'InvoiceJionFindNoRecord',
                    method: 'past',
                    body: {
                        code: e
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        // this.odd = val
                        const { provider, id, invoiceAmount } = res.data[0]
                        this.invoicePams.id = id
                        this.invoiceQuery = true
                        this.blendPams.provider = provider
                        this.provideCode = provider
                        this.form.setFieldsValue({ provider: provider, blueAmount: invoiceAmount })
                        console.log(invoiceAmount, '5555555555555555555555')
                        if (invoiceAmount) {
                            this.maxRedAmount = invoiceAmount
                            this.redDisabled = false
                        }
                        if (this.bt_Save) {
                            this.blendPams.id = this.bt_id
                        } else {
                            this.blendPams.id = ''
                        }
                        this.billsData = []
                    } else {
                        // if (this.odd === val) {
                        //     // this.odd = ''
                        // }
                        this.invoiceQuery = false
                        console.log(3333333)
                        this.invoicePams.id = ''
                        // this.form.setFieldsValue({
                        //     jionCode: this.odd
                        // })
                    }
                })
            }
        },
        /**
         * @name: 监听红字金额输入
         */
        redAmountChange (e) {
            if (this.form.getFieldValue('invoiceAmount')) {
                const blueAmount = this.$math.sub(this.form.getFieldValue('invoiceAmount'), e)
                this.form.setFieldsValue({ blueAmount: blueAmount })
            }
        },
        /**
         * @name: 监听采集单号选中
         */
        jionChange (e) {
            console.log(e)
            if (this.billsData.length > 0) {
                const that = this
                this.$confirm({
                    title: '提示',
                    content: `切换采集单号将会清空当前表单明细,是否继续?`,
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.jionCode = e
                        that.billsData = []
                        that.confirmation(e)
                    },
                    onCancel () {
                        that.form.setFieldsValue({ 'jionCode': that.jionCode })
                    }
                })
            } else {
                this.jionCode = e
                this.confirmation(e)
            }
        },
        /**
         * @name: 监听供应商选中
         */
        providerChange (e) {
            console.log(e)
            if (this.billsData.length > 0) {
                const that = this
                this.$confirm({
                    title: '提示',
                    content: `切换供应商将会清空当前表单明细,是否继续?`,
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.provideCode = e
                        that.billsData = []
                        that.form.resetFields()
                        that.collectNumber(e)
                    },
                    onCancel () {
                        that.form.setFieldsValue({ 'provider': that.provideCode })
                    }
                })
            } else {
                this.provideCode = e
                this.form.resetFields()
                // this.form.setFieldsValue({ 'provider': e })
                this.collectNumber(e)
            }
        },
        /**
         * @name: 下拉框采集单号
         */
        collectNumber (code) {
            axios({
                path: 'InvoiceJionFindHandover',
                method: 'post',
                body: {
                    provider: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.title = i.code
                        i.key = i.code
                        i.value = i.code
                    })
                    this.jionCodeList = [...data]
                }
            })
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
        /**
         * @name: 获取供应商
         */
        // onProvider () {
        //     axios({
        //         path: 'CustomerSupplierFindOption',
        //         method: 'post'
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data.list
        //             console.log(res.data, '供应商')
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}:${i.name}`
        //                 i.value = i.code
        //             })
        //             this.providerList = [...data]
        //         }
        //     })
        // },
        count (data) {
            console.log(data, 'jisuan')
            const { add, sub, div, mul } = this.$math
            const arr = []
            for (const i of data) {
                if (i.recordType === '商品核销') {
                    // 勾兑差额(含税) = 发票含税进价 - 验收含税进价 * 数量
                    i.recordDifferences = mul(sub(i.priceCostInvoice, i.priceCost), i.qtty)
                    // 勾兑差额(不含税) = (勾兑差额(含税) /(1+税率%) / 税率暂无, 数字代替
                    i.recordDifferences = div(mul(sub(i.priceCostInvoice, i.priceCost), i.qtty), add(1, i.taxRate))
                    // 勾兑金额 = (数量*税票价/(1+税率%),2) / 税率暂无, 数字代替
                    i.recordAmount = div(mul(i.qtty, i.priceCostInvoice), add(1, i.taxRate))
                    // arr.push({ recordAmount: i.recordAmount, recordDifferences: i.recordDifferences })
                    // const recordAmounts = arr.reduce((prev, cur) => {
                    //     return add(prev, cur.recordAmount, 2)
                    // }, 0)
                    // const recordDifferences = arr.reduce((prev, cur) => {
                    //     return add(prev, cur.recordDifferences, 2)
                    // }, 0)
                    // console.log(recordAmounts, recordDifferences, '计算和')
                    // this.form.setFieldsValue({ recordAmount: recordAmounts, recordDifferences: recordDifferences })
                } else if (i.recordType === '费用核销') {
                    // // 勾兑差额(含税) = - 实收费用
                    i.recordDifferences = -i.feeProfit
                    // // 勾兑差额(不含税) = (勾兑差额(含税) /(1+税率%),2) / 税率接口暂无,数字代替
                    i.recordDifferences = div(-i.feeProfit, add(1, i.taxRate))
                    // // 勾兑金额 = (勾兑差额(含税) /(1+税率%),2)
                    i.recordAmount = div(-i.feeProfit, add(1, i.taxRate))
                }
                arr.push({ recordAmount: i.recordAmount, recordDifferences: i.recordDifferences })
            }
            const recordAmounts = arr.reduce((prev, cur) => {
                return add(prev, cur.recordAmount, 2)
            }, 0)
            const recordDifferences = arr.reduce((prev, cur) => {
                return add(prev, cur.recordDifferences, 2)
            }, 0)
            console.log(recordAmounts, recordDifferences, '计算和')
            this.form.setFieldsValue({ recordAmount: recordAmounts, recordDifferences: recordDifferences })
        },
        /**
         * @name:清空弹窗
         */
        onSwitch () {
            this.billsData = []
            this.billsForm = {}
            this.bt_Save = false
            this.bt_id = ''
            this.orderId = ''
            this.tags = []
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            const obj = { ...e }
            this.orderId = obj.code
            this.tags = ['uncheck']
            this.bt_id = obj.id
            this.bt_Save = true
            obj.provider = `${obj.provider}:${obj.providerName}`
            obj.makeStoreCode = `${obj.makeStoreCode}:${obj.makeStoreName}`
            // makeUserCode
            obj.makeUserCode = `${obj.makeUserCode}:${obj.makeUserName}`
            obj.blueAmount = this.$math.sub(obj.invoiceAmount, obj.redAmount)
            this.billsForm = obj
            this.odd = obj.jionCode
            this.blendPams.provider = e.provider
            this.blendPams.id = e.id
            axios({
                path: 'InvoiceBlendFindDetailById',
                method: 'post',
                body: {
                    recordId: obj.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '编辑获取表格')
                    for (const i of res.data.list) {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.blendId = i.id
                        if (i.recordType === 'invoice_record_detail_record_type:1') {
                            i.recordType = '商品核销'
                        } else if (i.recordType === 'invoice_record_detail_record_type:2') {
                            i.recordType = '费用核销'
                        }
                    }
                    this.billsData = res.data.list
                    this.count(this.billsData)
                }
            })
        },
        /**
         * @name: 添加明细
         */
        onblendSelect (e) {
            const error = []
            // const array = []
            const { add } = this.$math
            if (this.billsData.length > 0) {
                // 循环表格 判断是否有重复添加,
                e.forEach(item => {
                    item.taxRates = this.rateTransform(item.taxRate)
                    console.log(this.billsData, '单据表')
                    const list = this.billsData.filter(o => o.providerFeeDetailId === item.providerFeeDetailId)
                    console.log(e, list, '添加')
                    // 不重复项, 添加到单据表格
                    if (list.length === 0) {
                        this.billsData.push(item)
                    } else {
                        error.push(item.name)
                    }
                })
            } else {
                e.forEach(item => {
                    item.taxRates = this.rateTransform(item.taxRate)
                })
                this.billsData.push(...e)
            }

            // 重复提示
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
                return
            }
            const arr = []
            // 表单计算项
            this.billsData.forEach(mun => {
                // if (mun.recordType === '商品核销') { arr.push({ recordAmount: mun.recordAmount, recordDifferences: mun.recordDifferences }) }
                arr.push({ recordAmount: mun.recordAmount, recordDifferences: mun.recordDifferences })
            })
            const recordAmounts = arr.reduce((prev, cur) => {
                return add(prev, cur.recordAmount, 2)
            }, 0)
            const recordDifferences = arr.reduce((prev, cur) => {
                return add(prev, cur.recordDifferences, 2)
            }, 0)
            console.log(recordAmounts, recordDifferences, '计算和')
            this.form.setFieldsValue({ recordAmount: recordAmounts, recordDifferences: recordDifferences })
        },
        /**
         * @name: 选择开票单据数据
         */
        oninvoiceSelect (e) {
            console.log(e, '选择开票单据数据')
            const { add } = this.$math
            const arr = []
            const list = []
            for (const i of e) {
                arr.push(i.invoiceAmount)
                list.push(i.invoiceNo)
            }
            const invoiceBillListing = list.join(',')
            const invoiceAmount = arr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.form.setFieldsValue({ invoiceAmount: invoiceAmount, invoiceBillListing: invoiceBillListing })
        },
        /**
         * @name:采集单号获取供应商
         */
        // gather (e) {
        //     const val = e.target.value
        //     if (!this.odd) {
        //         this.odd = val
        //         console.log('第一个输入采集单')
        //     } else if (this.odd && this.odd !== val) {
        //         // this.billsData = []
        //         this.form.setFieldsValue({ jionCode: val })
        //         console.log('输入不同采集单, 清空明细表格')
        //     } else if (this.odd && this.odd === val && this.billsForm.provider) {
        //         return
        //         // console.log('输入相同采集单, 添加明细')
        //     }
        //     if (val) {
        //         axios({
        //             path: 'InvoiceJionFindJionByStore',
        //             method: 'past',
        //             body: {
        //                 code: val,
        //                 makeStoreCode: this.$store.getters.storeInfo.code
        //             }
        //         }).then(res => {
        //             console.log(res, 'laipiao')
        //             if (res.flag === 1) {
        //                 this.odd = val
        //                 const { provider, providerName, id } = res.data
        //                 this.invoicePams.id = id
        //                 this.invoiceQuery = true
        //                 this.blendPams.provider = provider
        //                 this.form.setFieldsValue({ provider: `${provider}:${providerName}` })
        //                 if (this.bt_Save) {
        //                     this.blendPams.id = this.bt_id
        //                 } else {
        //                     this.blendPams.id = ''
        //                 }
        //                 this.billsData = []
        //             } else {
        //                 // if (this.odd === val) {
        //                 //     // this.odd = ''
        //                 // }
        //                 this.invoiceQuery = false
        //                 console.log(3333333)
        //                 this.invoicePams.id = ''
        //                 this.form.setFieldsValue({
        //                     jionCode: this.odd
        //                 })
        //             }
        //         })
        //     }
        // },
        /**
         * @name:保存单据
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    console.log(formDate, '保存')
                    formDate.invoiceRecordDetails = [...this.billsData]
                    for (const i of formDate.invoiceRecordDetails) {
                        i.id = ''
                        if (i.recordType === '商品核销') {
                            i.recordType = 'invoice_record_detail_record_type:1'
                        } else if (i.recordType === '费用核销') {
                            i.recordType = 'invoice_record_detail_record_type:2'
                        }
                    }
                    if (formDate.invoiceRecordDetails.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    formDate.provider = formDate.provider.split(':')[0]
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                        formDate.makeStoreCode = formDate.makeStoreCode.split(':')[0]
                        formDate.makeUserCode = formDate.makeUserCode.split(':')[0]
                    } else {
                        formDate.makeStoreCode = this.$store.getters.storeInfo.code
                        formDate.makeUserCode = this.$store.getters.userInfo.code
                    }
                    axios({
                        path: this.bt_Save ? 'InvoiceBlendUpdate' : 'InvoiceBlendAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.billsData = []
                            this.odd = ''
                            this.estimate = false
                            this.blendPams.provider = ''
                            this.btVisible = false
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 税票勾兑处理按钮
         */
        addManage () {
            if (!this.blendPams.provider) {
                return this.$message.error('请确认供应商!')
            } else if (this.billsData.length < 1 && this.bt_Save) {
                this.blendPams.id = ''
                this.$refs.BlendTagsRef.seach(this.blendPams)
            } else if (this.bt_Save === false) {
                this.$refs.BlendTagsRef.EmptyTotal()
            }
            this.$refs.BlendTagsRef.obtainForm(this.form.getFieldsValue())
            this.blendQuery = true
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
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
                        if (categoryinfoData[j].blendId === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.blendId !== del)
            }
            this.selectedRowKeys = []
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        }
    }
}
</script>

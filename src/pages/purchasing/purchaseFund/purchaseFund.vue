<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-07 09:00:27
 * @LastEditTime: 2019-08-26 18:51:01
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      showOrganize
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
      @onContextmenuChange="onContextmenuChange"
    ></NewTable>
    <!-- 弹窗 -->
    <bt-modal
      v-model="editVisible"
      title="采购资金拨付"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <template slot="title">
        <p style="display: inline-block;margin-bottom: 0;vertical-align: middle;">{{ `${title}${'采购资金拨付单'}` }}</p>
      </template>
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请检索供应商"
                :getPopupContainer="trigger => trigger.parentNode"
                style="width:100%"
                v-decorator="$check('BillAppropriation.providerCode',{initialValue:billsForm.providerCode} ) "
                :options="providerCode"
                :filterOption="false"
                @search="priverSearch"
                @select="providerChange"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.originalCode',{initialValue:billsForm.originalCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联系电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.phone',{initialValue:billsForm.phone})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联系传真</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.fax',{initialValue:billsForm.fax})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开户行</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.openingBank',{initialValue:billsForm.openingBank})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">账号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.openingBankAmount',{initialValue:billsForm.openingBankAmount})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">业务员</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width:100%"
                placeholder="请检索业务员"
                :filterOption="false"
                :getPopupContainer="trigger => trigger.parentNode"
                v-decorator="$check('BillAppropriation.saleBy',{initialValue:billsForm.saleBy} ) "
                :options="saleByList"
                @search="saleBySearch"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">付款方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width:100%"
                :filterOption="filterOption"
                placeholder="请选择付款方式"
                :getPopupContainer="trigger => trigger.parentNode"
                v-decorator="$check('BillAppropriation.payType',{initialValue:billsForm.payType} ) "
                :options="statusList"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">资金拨出日</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('BillAppropriation.payTime',{initialValue:billsForm.payTime || payTime})"
                allowClear/>
            </a-form-item>
          </a-col>

          <a-col :sm="8" :md="4" :xl="3">票据号码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入票据号码" v-decorator="$check('BillAppropriation.invoiceCode',{initialValue:billsForm.invoiceCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">拨款金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                @blur="payAmountChange"
                v-decorator="$check('BillAppropriation.payAmount',{initialValue:billsForm.payAmount || 0.00})"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">大写金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.payAmountD',{initialValue:billsForm.payAmountD})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">付款说明</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入付款说明"
                v-decorator="$check('BillAppropriation.explainAmount',{initialValue:billsForm.explainAmount})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
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
                v-decorator="$check('BillAppropriation.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">税票信息</h4>
        <div class="taxReceipt">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">公司名称:</a-col>
            <a-col :sm="16" :md="8" :xl="5">{{ billInformation.sname || '' }}</a-col>
            <a-col :sm="8" :md="4" :xl="3">公司电话:</a-col>
            <a-col :sm="16" :md="8" :xl="5">{{ billInformation.telTax || '' }}</a-col>
            <a-col :sm="8" :md="4" :xl="3">纳税人识别号:</a-col>
            <a-col :sm="16" :md="8" :xl="5">{{ billInformation.taxNo || '' }}</a-col>
            <a-col :sm="8" :md="4" :xl="3">开户行及账号:</a-col>
            <a-col :sm="16" :md="8" :xl="8">{{ `${billInformation.bank || ''}-${billInformation.acctNo || ''}` }}</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">公司地址:</a-col>
            <a-col :sm="16" :md="20" :xl="21">{{ billInformation.addressTax || '' }}</a-col>
          </a-row>
        </div>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.createBy', {initialValue:billsForm.createBy || `${$store.getters.code} - ${$store.getters.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.createTime', {initialValue: billsForm.createTime || createTime} )" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillAppropriation.orderStoreCode', {initialValue: billsForm.orderStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
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
import preview from './preview/purchaseFundPreview'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { lowToUp } from '@utils/util'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'PurchaseFund',
    components: { seachBox, NewTable, BtModal, preview },
    data () {
        return {
            previewVisbel: false,
            tags: [],
            orderId: '',
            // 税票信息
            billInformation: {},
            saleByList: [],
            loading: false,
            billsForm: {},
            // 表单
            form: this.$form.createForm(this),
            bt_Save: false,
            payTime: moment(),
            // 控制新增/ 编辑开关
            editVisible: false,
            // 罚款方式
            statusList: [],
            // 供应商
            providerCode: [],
            disContextMenu: [],
            title: '',
            // 右击选中数据
            auditObj: [],
            // 删除选中
            deleteAll: [],
            // 绑定搜索
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
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
                    // body: { type: 'bill_appropriation_status', grade: '1' }
                    title: '单据状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'createBy',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }

            ],
            tableCode: '',
            tableApiPath: '',
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'purchaseFund.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'purchaseFund.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'purchaseFund.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '确认',
                    action: 'purchaseFund.confirm',
                    fc: row => {
                        this.getRow(row, 'notarize')
                    }
                },
                {
                    name: '取消确认',
                    action: 'purchaseFund.cancel',
                    fc: row => {
                        this.getRow(row, 'cancelConfirmation')
                    }
                },
                {
                    name: '预览',
                    action: 'purchaseFund.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ],
            createTime: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ace7897690084a26995a351db30e89b2:purchaseFund'
            this.tableApiPath = 'BillAppropriationFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_appropriation_status', this.conditions[3])
        this.seachValue = {
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment(),
            status: 'bill_appropriation_status:1'
        }
        this.getStore()
    },
    methods: {
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 金额转大写
         */
        payAmountChange () {
            const mun = this.form.getFieldsValue().payAmount
            console.log(mun)
            console.log(Number(mun), '金额')
            const res = lowToUp(Number(mun))
            this.form.setFieldsValue({ payAmountD: res })
        },
        /**
         * @name: 监听供应商
         */
        async providerChange (val, key) {
            // console.log(val, key, '--------------------')
            let billsFormData = {}
            this.form.setFieldsValue(billsFormData)
            const res = await axios({
                path: 'CustomerSupplierFind',
                method: 'post',
                body: {
                    code: val
                }
            })
            if (res.flag === 1) {
                const values = { ...res.data.list[0] }
                if (values.payMode) { values.payMode = Number(values.payMode.split(':')[1]) }
                // console.log(values)
                billsFormData = {
                    phone: values.linkTele,
                    fax: values.linkFax,
                    openingBank: values.accountBank,
                    openingBankAmount: values.accountNo,
                    payType: values.payMode,
                    saleBy: values.saleBy ? `${values.saleBy}-${values.saleByName}` : ''
                }
                this.form.setFieldsValue(billsFormData)
            }
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
                    const formDate = { ...values }
                    formDate.saleBy = formDate.saleBy.split('-')[0]
                    formDate.providerCode = formDate.providerCode.split('-')[0]
                    formDate.storeCode = this.$store.getters.storeInfo.code
                    formDate.createBy = formDate.createBy.split('-')[0]
                    formDate.orderStoreCode = formDate.orderStoreCode.split('-')[0]
                    if (this.bt_Save) {
                        formDate.id = this.billsForm.id
                    }
                    if (formDate.payAmount === 0) {
                        this.loading = false
                        return this.$message.error('拨款金额不能为零!')
                    }
                    console.log(formDate, '保存')
                    formDate.payTime = moment(values.payTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    axios({
                        path: this.bt_Save ? 'BillAppropriationUpdate' : 'BillAppropriationAdd',
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
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('810e4693f16d487da1b724270fee4130:purchaseFund', { path: 'BillAppropriationFind' })
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status, approvalStatus }) {
            console.log(status, approvalStatus, '状态')
            if (status === 'bill_appropriation_status:1') {
                this.disContextMenu = ['审核', '取消确认']
            } else if (status === 'bill_appropriation_status:3' && approvalStatus !== 'approval_bill_type_status:1') {
                this.disContextMenu = ['新增', '编辑', '删除', '确认', '取消确认']
            } else if (status === 'bill_appropriation_status:2') {
                this.disContextMenu = ['新增', '编辑', '审核', '删除', '确认', '取消确认']
            } else if (status === 'bill_appropriation_status:3' && approvalStatus === 'approval_bill_type_status:1') {
                this.disContextMenu = ['新增', '编辑', '删除', '确认']
            }
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.editVisible = true
                this.bt_Save = false
                this.billsForm = {
                    saleBy: `${this.$store.getters.code}-${this.$store.getters.name}`
                }
                this.orderId = ''
                this.tags = []
                this.title = '新增'
                this.getTaxt(this.$store.getters.storeInfo.code)
                this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else if (e === 'del') {
                console.log('批量删除')
                if (this.deleteAll.length < 1) {
                    return this.$message.warning('您尚未选中任何数据！')
                }
                this.onDel(1)
            } else if (e === 'export') {
                console.log('打印')
                this.$refs.newTable.exportFile('BillAppropriationFind', this.seachValue)
            } else if (e === 'print') {
                console.log('导出')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            console.log(e.status, '编辑')
            if (mun === 'edit') {
                console.log(e, '编辑')
                this.editVisible = true
                this.bt_Save = true
                this.billsForm = { ...e }
                this.orderId = this.billsForm.code
                this.tags = ['uncheck']
                this.title = '编辑'
                this.getTaxt(this.billsForm.orderStoreCode)
                this.billsForm.payTime = moment(this.billsForm.payTime)
                this.billsForm.payType = Number(this.billsForm.payType.split(':')[1])
                this.billsForm.saleBy = `${this.billsForm.saleBy}-${this.billsForm.saleName}`
                this.billsForm.providerCode = `${this.billsForm.providerCode}-${this.billsForm.providerName}`
                this.billsForm.createBy = `${this.billsForm.createBy}-${this.billsForm.createName}`
                this.billsForm.orderStoreCode = `${this.billsForm.orderStoreCode}-${this.billsForm.orderStoreName}`
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'notarize') {
                if (e.status === 'bill_appropriation_status:3') {
                    return this.$message.warning('所选信息已确认,请务重复确认!')
                }
                this.notarizeSumbit(e)
            } else if (mun === 'cancelConfirmation') {
                console.log('取消确认')
                this.cancelConfirmationSumbit(e)
            } else if (mun === 'details') {
                console.log('预览')
                this.detailsSumbit(e)
            }
        },
        cancelConfirmationSumbit (e) {
            const that = this
            this.$confirm({
                title: '取消确认单据',
                content: '是否取消确认当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillAppropriationCancelConfirm',
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
            console.log(e, '搜索框数据')
            e.path = 'BillAppropriationFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChange (keys, rows) {
            console.log(keys, rows)
            this.deleteAll = rows
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
                        path: 'BillAppropriationDelete',
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
                        path: 'BillAppropriationAudit',
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
        /**
         * @name: 确认
         */
        notarizeSumbit (e) {
            const that = this
            this.$confirm({
                title: '确认单据',
                content: '是否确认当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillAppropriationAuditBegin',
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
         * @name: 获取税票信息
         */
        getTaxt (code) {
            console.log(code)
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    code: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '税票信息')
                    this.billInformation = res.data.list[0]
                }
            })
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
                        this.providerCode = [...data]
                    }
                })
            }, 300)
        },
        saleBySearch (e) {
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
                        this.saleByList = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 下拉框
         */
        getStore () {
            // 获取供应商
            // axios({
            //     path: 'CustomerSupplierFindOption',
            //     method: 'post'
            // }).then(res => {
            //     if (res.flag === 1) {
            //         const data = res.data
            //         console.log(data)
            //         data.forEach(i => {
            //             i.key = i.code
            //             i.title = `${i.code}:${i.name}`
            //             i.value = i.code
            //         })
            //         this.providerCode = [...data]
            //     }
            // })
            // 获取付款方式
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'settle_accounts_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '付款')
                    data.forEach(i => {
                        i.key = i.configKey
                        i.title = i.value
                        i.value = i.configKey
                    })
                    this.statusList = [...data]
                    console.log(this.statusList, '你好')
                }
            })
            // 获取业务员
            // axios({
            //     path: 'PermissionsUserFindOption',
            //     method: 'post'
            // }).then(res => {
            //     if (res.flag === 1) {
            //         const data = res.data
            //         console.log(data)
            //         data.forEach(i => {
            //             i.key = i.code
            //             i.title = `${i.code}:${i.name}`
            //             i.value = i.code
            //         })
            //         this.saleByList = [...data]
            //     }
            // })
        },
        /**
         * @name: 生效时间过滤
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        }
    },
    watch: {
        '$store.stare.app.pageName' (val) {
            if (val === 'purchaseFund') {
                // this.getDate()
            }
        },
        'billsForm.providerCode': function (val, oldVal) {
            console.log(val) // => 变化之后的数据
            console.log(oldVal) // => 变化之前的数据
        }
    }
}
</script>

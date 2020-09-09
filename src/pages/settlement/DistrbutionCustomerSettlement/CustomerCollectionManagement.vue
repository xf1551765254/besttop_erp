<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 15:16:08
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
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
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick">
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">渠道客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                :filterOption="filterOption"
                placeholder="请选择渠道客户"
                @change="onChangeClient"
                :options="clientArr"
                v-decorator="$check('billReceive.custNo',{initialValue:BaseMessageObj.custNo})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                v-decorator="$check('billReceive.mkStoreCode',{initialValue:BaseMessageObj.mkStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收款方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="paymentTypeArr"
                placeholder="请选择收款方式"
                v-decorator="$check('billReceive.receiveMode',{initialValue:BaseMessageObj.receiveMode})"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收款凭证</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
               placeholder="请输入收款凭证"
                v-decorator="$check('billReceive.receiveInvoiceNo',{initialValue:BaseMessageObj.receiveInvoiceNo})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收款日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('billReceive.receiveDate',{initialValue:BaseMessageObj.receiveDate})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">发票号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
              placeholder="请输入发票号"
                v-decorator="$check('billReceive.invoiceNo',{initialValue:BaseMessageObj.invoiceNo})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">上期未收</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                disabled
                style="width: 100%"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('billReceive.notYetReceived',{initialValue:BaseMessageObj.notYetReceived})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">应收金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                disabled
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('billReceive.shouldReceive',{initialValue:BaseMessageObj.shouldReceive})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">冲减预收款金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                disabled
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('billReceive.prePay',{initialValue:BaseMessageObj.prePay})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">实收金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                @change="onChangeOfficialReceipts"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('billReceive.factReceive',{initialValue:BaseMessageObj.factReceive})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">转入下期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                disabled
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('billReceive.nextReceive',{initialValue:BaseMessageObj.nextReceive})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billReceive.mkStoreCode', {initialValue:BaseMessageObj.mkStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billReceive.note',{initialValue:this.BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">订单详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">新增</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" size="small">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="chargeOffId"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          :pagination="false"
          size="small"
          bordered
          :scroll="{x:1350,y:350}">
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:30px">收款数量：</span>
            <span>{{ receiptNumber }}</span>
            <span style="margin-left:100px">收款价格/折让：</span>
            <span>{{ sumChangeM(receivingThePrice) }}</span>
            <span style="margin-left:100px">收款金额：</span>
            <span>{{ sumChangeM(receivableAmount) }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.chargeOffId)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billReceive.makeUserCode', {initialValue:BaseMessageObj.makeUserCode || `${$store.getters.code}-${$store.getters.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billReceive.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <Gathering :visible.sync="storeQuery" :pams="pams" @onSelect="onProviderSelect"/>
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
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import Gathering from '@pages/settlement/DistrbutionCustomerSettlement/clientLimit/gathering'
import map from 'lodash.map'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
import Preview from './preview/CustomerCollectionManagementPreview'
export default {
    name: 'CustomerCollectionManagement',
    components: {
        NewTable,
        SeachBox,
        Gathering,
        BtModal,
        Preview
    },
    data () {
        return {
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
                    title: '单据状态',
                    type: 'select',
                    key: 'status',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    type: 'select',
                    key: 'makeUserCode',
                    path: 'PermissionsUserFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单时间开始范围',
                    type: 'date',
                    key: 'timeA'
                },
                {
                    title: '制单时间结束范围',
                    type: 'date',
                    key: 'timeB'
                },
                {
                    title: '客户名称',
                    type: 'select',
                    key: 'custNo',
                    path: 'CustomerDistributorsFindInfoBySelected',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                }

            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'CustomerCollectionManagement.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'CustomerCollectionManagement.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'CustomerCollectionManagement.verify',
                    fc: this.auditHandler
                },
                {
                    name: '预览',
                    action: 'CustomerCollectionManagement.get',
                    fc: this.previewFun
                }
            ],
            seachValue: {
                timeA: moment().subtract({ months: 1 }),
                timeB: moment()
            },
            disContextMenu: [],
            addEditModel: false, // 新增模态框显示隐藏
            submitLoading: false, // 按钮loading状态
            form: this.$form.createForm(this),
            BaseMessageObj: {},
            categoryinfoSelectedRowKeys: [], // 详情选中项
            categoryinfoColumns: [ // 采购订单详情表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '类型', dataIndex: 'wholesaleTypeName', width: 100 },
                { title: '源单据号', dataIndex: 'wholesaleCode', width: 100 },
                { title: '发生位置', dataIndex: 'storeCode', width: 100 },
                { title: '发生位置名称', dataIndex: 'storeName', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', width: 100 },
                { title: '税率', dataIndex: 'taxRates', width: 100,align: 'right' },
                { title: '收款数量', dataIndex: 'numbers', width: 100,align: 'right' },
                { title: '收款价格/折让', dataIndex: 'unitPrice', width: 100,align: 'right' },
                { title: '收款金额', dataIndex: 'amountPay', width: 100,align: 'right' },
                { title: '审核时间', dataIndex: 'auditTime', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData: [], // 表体
            storeQuery: false, // 组件弹框
            pams: {},
            title: '',
            clientArr: [], // 客户
            paymentTypeArr: [], // 付款方式
            custCodeId: '',
            receiptNumber: '0',
            receivingThePrice: '0.00',
            receivableAmount: '0.00',
            prePaySave: '0.00', // 渠道客户限额监控表中累计预收款金额-累计冲减预收款
            notYetReceivedSave: '0.00',
            rowId: '',
            orderId: '',
            tags: [],
            // 预览
            previewVisbel: false,
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '62518ecd037146e2be7030f3e0707f67:CustomerCollectionManagement'
            this.tableApiPath = 'BillReceivablesFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.client()
        this.paymentType()
        getStatus('bill_receive_status', this.conditions[1])
        this.seachValue = {
            status: 'bill_receive_status:1',
            timeA: moment().subtract(7, 'days'),
            timeB: moment()
        }
    },
    computed: {

    },
    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        onChangeOfficialReceipts (e) {
            console.log(e)
            if (!this.custCodeId) {
                this.$message.warning('请选择渠道客户！')
            } else {
                this.total(this.categoryinfoData)
                const { add, sub } = this.$math
                const num = add(this.notYetReceivedSave, this.receivableAmount, 2)// 上期未结金额+应收金额
                let prePayNum = ''
                if (Number(num) > Number(this.prePaySave)) {
                    prePayNum = this.prePaySave
                } else {
                    prePayNum = num
                }
                const factReceiveNum = e
                const nextReceiveNum = sub(sub(num, prePayNum, 2), factReceiveNum, 2)
                this.form.setFieldsValue({
                    prePay: prePayNum,
                    factReceive: factReceiveNum,
                    nextReceive: nextReceiveNum
                })
            }
        },
        /**
         * @name: 客户监听事件
         * @msg:
         * @param {type}
         * @return:
         */
        onChangeClient (e) {
            console.log(e)
            this.custCodeId = e
            axios({
                path: 'BillReceivablesFindNextReceive',
                method: 'post',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    custNo: e
                } // 参数，选传
            }).then(res => {
                if (res.flag === 1) {
                    console.log('上期未付', res)
                    this.BaseMessageObj = {
                        notYetReceived: res.data.notYetReceived,
                        shouldReceive: 0,
                        prePay: 0,
                        factReceive: 0,
                        nextReceive: 0,
                        receiveDate: moment(),
                        makeTime: moment().format('YYYY-MM-DD HH:mm:ss')

                    }
                    this.notYetReceivedSave = res.data.notYetReceived
                    this.prePaySave = res.data.preReceive
                    this.total(this.categoryinfoData)
                    this.writeDownAdvancePayment()
                }
            })
        },
        /**
         * @name: 客户信息下拉框
         * @msg:
         * @param {type}
         * @return:
         */
        client () {
            axios({
                path: 'CustomerDistributorsFindInfoBySelected',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = `${i.code}-${i.name}`
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.clientArr = [...data]
                    console.log('客户', this.clientArr)
                }
            })
        },
        filterOption (input, option) {
            console.log(input, option)
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        onProviderSelect (Obj) {
            console.log(Obj, '选择商品')
            this.BaseMessageObj.byTime = Obj.time
            const error = []
            Obj.arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.chargeOffId === i.id)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        chargeOffId: i.id,
                        wholesaleType: i.wholesaleType,
                        wholesaleTypeName: i.wholesaleTypeName,
                        wholesaleCode: i.wholesaleCode,
                        storeCode: i.storeCode,
                        storeName: i.storeName,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        skuModel: i.skuModel,
                        basicUnit: i.basicUnit,
                        taxRate: i.taxRate,
                        taxRates: this.rateTransform(i.taxRate),
                        numbers: i.numbers,
                        unitPrice: i.unitPrice,
                        amountPay: i.amountPay,
                        auditTime: i.auditTime
                    })
                    this.total(this.categoryinfoData)
                    this.writeDownAdvancePayment()
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
            console.log('获取表格中的数据', this.categoryinfoData)
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (chargeOffId) {
            if (chargeOffId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].chargeOffId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.chargeOffId !== chargeOffId)
            }
            this.total(this.categoryinfoData)
            this.writeDownAdvancePayment()
        },
        /**
         * @name: 新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            console.log('弹框新增')
            if (!this.custCodeId) {
                this.$message.warning('请选择渠道客户！')
                return
            }
            this.storeQuery = true
            this.pams = {
                storeCode: this.$store.getters.storeInfo.code,
                custNo: this.custCodeId
            }
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const newData = [...this.categoryinfoData]
            if (newData.length === 0) {
                this.$message.warning('您尚未添加预收款详情！')
                return
            }
            for (const item of newData) {
                item.amountPay = this.sumChangeS(item.amountPay)
                item.unitPrice = this.sumChangeS(item.unitPrice)
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                values.makeTime = moment(values.makeTime).format('YYYY-MM-DD HH:mm:ss')
                values.receiveDate = moment(values.receiveDate).format('YYYY-MM-DD HH:mm:ss')
                values.mkStoreCode = values.mkStoreCode ? values.mkStoreCode.split('-')[0] : ''
                values.makeUserCode = values.makeUserCode ? values.makeUserCode.split('-')[0] : ''
                if (!err) {
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        const addArr = Object.assign(values, { billReceiveDetails: newData })
                        axios({
                            path: 'BillReceivablesAdd',
                            method: 'post',
                            body: addArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        const addArr = Object.assign(values, { billReceiveDetails: newData }, { id: this.rowId })
                        axios({
                            path: 'BillReceivablesUpdate',
                            method: 'post',
                            body: addArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    }
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'BillReceivablesAudit',
                        method: 'post',
                        body: {
                            id: e.id
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
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
            if (status === 'bill_receive_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
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
                this.$refs.newTable.exportFile('BillReceivablesFind', this.seachValue)
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
            e.path = 'BillReceivablesFind'
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
                    if (statusArr[item] === 'provider_fee_status：2') {
                        this.$message.error('选中数据存在已审核数据，不可删除')
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
                        path: 'BillReceivablesDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        } else if (res.flag === 6) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
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
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                console.log('新增')
                this.addEdit = 'add'
                this.title = '新增客户收款单'
                this.BaseMessageObj = {
                    receiveDate: moment(),
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    notYetReceived: 0,
                    shouldReceive: 0,
                    prePay: 0,
                    factReceive: 0,
                    nextReceive: 0
                }
                this.orderId = ''
                this.tags = []
                this.custCodeId = ''
                this.categoryinfoData = []
                this.receiptNumber = '0.00'
                this.receivingThePrice = '0.00'
                this.receivableAmount = '0.00'
                this.prePaySave = '0.00'
                this.notYetReceivedSave = '0.00'
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑', index)
                this.rowId = index.id
                this.title = '编辑客户收款单'
                this.addEdit = 'edit'
                this.editAssign(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        editAssign (e) {
            axios({
                path: 'BillReceivablesFindDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '-----------')
                    const arr = res.data
                    this.orderId = e.code
                    this.tags = ['uncheck']

                    this.custCodeId = e.custNo
                    this.BaseMessageObj = {
                        mkStoreCode: e.mkStoreCode ? `${e.mkStoreCode}-${e.mkStoreName}` : '',
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}-${e.makeUserName}` : '',
                        code: e.code,
                        custNo: e.custNo,
                        receiveMode: e.receiveMode,
                        receiveInvoiceNo: e.receiveInvoiceNo,
                        receiveDate: moment(e.receiveDate),
                        invoiceNo: e.invoiceNo,
                        notYetReceived: e.notYetReceived,
                        shouldReceive: e.shouldReceive,
                        prePay: e.prePay,
                        factReceive: e.factReceive,
                        nextReceive: e.nextReceive,
                        makeTime: e.makeTime
                    }
                    arr.forEach(i => {
                        i.index = this.indexNumber++
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.unitPrice = this.sumChangeM(i.unitPrice)
                        i.amountPay = this.sumChangeM(i.amountPay)
                    })
                    this.categoryinfoData = arr
                    this.total(this.categoryinfoData)
                }
            })
        },
        /**
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
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
         * @name: 付款方式
         * @msg:
         * @param {type}
         * @return:
         */
        paymentType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'settle_accounts_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('付款类型', res)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.paymentTypeArr = [...data]
                }
            })
        },
        total (data) {
            const { add } = this.$math
            const receiptNumberArr = []// 收款数量
            const receivingThePriceArr = []// 收款价格
            const receivableAmountArr = []// 收款金额
            for (const item of data) {
                receiptNumberArr.push(item.numbers)
                receivingThePriceArr.push(this.sumChangeS(item.unitPrice))
                receivableAmountArr.push(this.sumChangeS(item.amountPay))
            }
            this.receiptNumber = receiptNumberArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.receivingThePrice = receivingThePriceArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.receivableAmount = receivableAmountArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.BaseMessageObj.shouldReceive = this.receivableAmount
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        /**
         * @name: 冲减预收款判断
         * @msg:
         * @param {type}
         * @return:
         */
        writeDownAdvancePayment () {
            const { add, sub } = this.$math
            const num = add(this.notYetReceivedSave, this.receivableAmount, 2)// 上期未结金额+应收金额
            let prePayNum = null
            console.log(num, '上期未结金额+应收金额')
            console.log(this.prePaySave)
            if (Number(num) > Number(this.prePaySave)) {
                prePayNum = this.prePaySave
            } else {
                prePayNum = num
                console.log('else', this.BaseMessageObj.prePay)
            }
            const factReceiveNum = sub(num, prePayNum, 2)
            console.log(prePayNum, factReceiveNum, '0000000')
            const nextReceiveNum = sub(sub(num, prePayNum, 2), factReceiveNum, 2)
            this.form.setFieldsValue({
                prePay: prePayNum,
                factReceive: factReceiveNum,
                nextReceive: nextReceiveNum
            })
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        }

    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CustomerCollectionManagement') {
                this.client()
                this.paymentType()
            }
        },
        addEditModel (val) {
            if (!val) {
                this.categoryinfoData = []
                this.indexNumber = 1
                this.BaseMessageObj = {}
            }
        }
    }
}
</script>

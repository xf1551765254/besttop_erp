<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-28 14:46:28
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
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      title="供应商付款单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="supplierAllList"
                placeholder="请选择供应商"
                v-decorator="$check('billSum.provider',{initialValue:BaseMessageObj.provider})"
                @change="supplierChange"
                @search="handleSearchSupplier"
                showSearch
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">截止日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('billSum.byTime',{initialValue:BaseMessageObj.byTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开户行</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                disabled
                v-decorator="$check('billSum.accountBank',{initialValue:BaseMessageObj.accountBank})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">账号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                disabled
                v-decorator="$check('billSum.accountNo',{initialValue:BaseMessageObj.accountNo})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">付款方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请选择付款方式"
                :options="paymentTypeArr"
                v-decorator="$check('billSum.payMode',{initialValue:BaseMessageObj.payMode})"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">付款凭证</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                placeholder="请输入付款凭证"
                v-decorator="$check('billSum.payInvno',{initialValue:BaseMessageObj.payInvno})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">发票号码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                placeholder="请输入发票号码"
                v-decorator="$check('billSum.invoiceNo',{initialValue:BaseMessageObj.invoiceNo})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billSum.upStoreCode',{initialValue:BaseMessageObj.upStoreCode || upStoreCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索负责人"
                :filterOption="false"
                @search="handleSearchBuyBy"
                showSearch
                v-decorator="$check('billSum.chargeUserno', {initialValue:BaseMessageObj.chargeUserno || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})"
                :options="customerList"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billSum.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">付款单详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">新增</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" size="small">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="code"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scrollXY"
        >
          <template slot="footer" style="height:20px">

            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:30px">销售额：</span>
            <span>{{ amountInTotal }}</span>
            <span style="margin-left:120px">应付款金额：</span>
            <span>{{ shouldPayTotal }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.code)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row style="margin-bottom:20px">
          <a-col :span="2"></a-col>
          <a-col :span="20">
            <a-table
              rowKey="tb_web_id"
              :columns="totalColumns"
              :dataSource="totalData"
              :pagination="false"
              size="small"
              :scroll="{x:400}"
              bordered
            >
              <template v-for="col in [ 'outOfPocket']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input-number
                    v-if="col === 'outOfPocket'"
                    style="margin: -5px 0;width:100%;"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :step="1"
                    :precision="2"
                    :value="text"
                    @change="e => footerChange(e, record.tb_web_id, col)" />
                  <span v-else>{{ text }}</span>
                </div>
              </template>
              <template slot="footer" style="height:20px">
                <span>本次付款金额（大写）：</span>
                <span>{{ thisPaymentChinese }}</span>
              </template>
            </a-table>
            <a-col :span="2"></a-col>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billSum.makeUserno', {initialValue:BaseMessageObj.makeUserno || `${$store.getters.code}-${$store.getters.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billSum.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <supplier :visible.sync="storeQuery" :pams="pams" @onSelect="onProviderSelect" multiple/>
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
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import is from 'is_js'
import supplier from '@pages/settlement/SupplierSettlementManagement/toop/supplier'
import { lowToUp } from '@utils/util'
import BtModal from '@comp/Modal'
import getStatus from '@comp/statusAll/getStatus'
import Preview from '@pages/settlement/SupplierSettlementManagement/preview/SupplierPaymentPreview'
const categoryinfoData = []
export default {
    name: 'SupplierPayment',
    components: {
        NewTable,
        SeachBox,
        supplier,
        BtModal,
        Preview
    },
    data () {
        return {
            // 负责人
            customerList: [],
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
                    // title: '审核状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_sum_status' }
                    title: '单据状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                { title: '供应商',
                    type: 'select',
                    key: 'provider',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单时间开始范围',
                    type: 'date',
                    key: 'beginMakeTime'
                },
                {
                    title: '制单时间结束范围',
                    type: 'date',
                    key: 'endMakeTime'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'SupplierPayment.edit',
                    fc: this.editHandler
                },
                {
                    name: '取消确认',
                    action: 'SupplierPayment.verify',
                    fc: this.reconfirmHandler
                },
                {
                    name: '审核',
                    action: 'SupplierPayment.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'SupplierPayment.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'SupplierPayment.get',
                    fc: this.previewFun
                }
            ],
            // 新增model
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {
            },
            supplierAllList: [],
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            categoryinfoColumns: [ // 采购订单详情表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '结算单号', dataIndex: 'payBillCode', width: 100 },
                { title: '销售额', dataIndex: 'sale', width: 100, align: 'right' },
                { title: '应付金额', dataIndex: 'atPay', width: 100, align: 'right' },
                // { title: '制单人', dataIndex: 'makeUserName', width: 150 },
                // { title: '制单时间', dataIndex: 'makeTime', width: 150 },
                // { title: '制单位置', dataIndex: 'makeStoreName', width: 150 },
                // { title: '审核人', dataIndex: 'auditUserName', width: 150 },
                // { title: '审核时间', dataIndex: 'auditTime', width: 150 },
                { title: '操作', key: 'operation', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData, // 表体
            categoryinfoID: 0, // 行唯一
            rowId: '',
            scrollXY: {
                x: 400,
                y: 350
            },
            multiple: true, // 是否多选模式，可选，默认单选。
            addEdit: '', // 控制新增编辑
            disContextMenu: [], // 右键菜单的name
            seachValue: {
                beginMakeTime: moment().subtract({ days: 7 }),
                endMakeTime: moment()
            },
            storeQuery: false,
            paymentTypeArr: [],
            pams: {},
            providerId: '',
            totalData: [
                {
                    tb_web_id: '01',
                    unpaid: '0',
                    handle: '0',
                    outOfPocket: '0',
                    surplus: '0'
                }
            ],
            totalColumns: [
                { title: '上期未付', dataIndex: 'unpaid', width: 100, align: 'right' },
                { title: '本期应付', dataIndex: 'handle', width: 100, align: 'right' },
                { title: '本期实付', dataIndex: 'outOfPocket', width: 100, scopedSlots: { customRender: 'outOfPocket' }, align: 'right' },
                { title: '本期结余', dataIndex: 'surplus', width: 100, align: 'right' }
            ],
            amountInTotal: '0.00',
            shouldPayTotal: '0.00',
            thisPaymentChinese: '', // 金额转中文
            upStoreCode: '',
            upStore: '',
            upToT: '',
            orderId: '',
            tags: [],
            // 预览
            previewVisbel: false,
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '34e4da78cdbe4f4aac0490358740248e:SupplierPayment'
            this.tableApiPath = 'SupplierSumFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('bill_sum_status', this.conditions[1])
        this.seachValue = {
            status: 'bill_sum_status:1',
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment()
        }
        this.paymentType()
    },
    computed: {
        signDtDefaultValue () {
            return moment()
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
                this.customerList.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
        handleSearchSupplier (value) {
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.supplierAllList.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
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
                    if (path === 'PermissionsUserFindOption') {
                        this.customerList = data
                    } else if (path === 'CustomerSupplierFindOption') {
                        this.supplierAllList = data
                    }
                }
            })
        },
        previewFun (e) {
            console.log(e)
            this.orderId = e.code
            this.previewVisbel = true
        },
        surplusSum (a) {
            axios({
                path: 'SupplierSumFindDelay',
                method: 'POST',
                body: {
                    provider: a,
                    makeStoreCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('本期结余', res)
                    this.totalData[0].unpaid = res.data
                }
            })
        },
        upToTime (a) {
            axios({
                path: 'SupplierPayFindNoSumBeginTime',
                method: 'POST',
                body: {
                    provider: a,
                    makeStoreCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('time', res)
                    this.upToT = res.data
                }
            })
        },
        /**
         * @name: 隶属公司
         * @msg:
         * @param {type}
         * @return:
         */
        onUpStoreCode (e) {
            axios({
                path: 'OrganizationStoreFindStoreByCode',
                method: 'post',
                body: {
                    code: e
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '隶属公司')
                    const data = res.data
                    this.upStoreCode = `${data.code}-${data.name}`
                    this.upStore = data.code
                }
            })
        },
        /**
         * @name: 查询供应商信息
         * @msg:
         * @param {type}
         * @return:
         */
        supplierChange (value) {
            this.providerId = value
            this.upToTime(value)
            this.surplusSum(value)
            if (is.not.string(value)) {
                this.BaseMessageObj = {}
            } else {
                axios({
                    path: 'CustomerSupplierFindById',
                    method: 'post',
                    body: {
                        code: value,
                        makeStoreCode: this.$store.getters.storeInfo.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res.data)
                        this.form.setFieldsValue({
                            accountBank: res.data.accountBank,
                            accountNo: res.data.accountNo,
                            payMode: res.data.payMode
                        })
                    }
                })
            }
        },
        onProviderSelect (Obj) {
            console.log(Obj, '选择商品')
            this.BaseMessageObj.byTime = Obj.time
            const error = []
            Obj.arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.payBillCode === i.code)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        code: i.code,
                        payBillCode: i.code,
                        sale: i.amountIn,
                        atPay: i.shouldPay,
                        makeUserName: i.makeUserName,
                        makeTime: i.makeTime,
                        makeStoreName: i.makeStoreName,
                        auditUserName: i.auditUserName,
                        auditTime: i.auditTime,
                        auditUserno: i.auditUserno,
                        makeStoreCode: i.makeStoreCode,
                        makeUserno: i.makeUserno
                    })
                } else {
                    error.push(i.code)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            console.log('获取表格中的数据', this.categoryinfoData)
            this.total(this.categoryinfoData)
        },
        /**
         * @name: 总计
         * @msg:
         * @param {type}
         * @return:
         */
        total (data) {
            const { add } = this.$math
            const amountIn = []
            const shouldPay = []
            data.forEach(i => {
                if (i.sale === undefined || i.sale === '') {
                    i.sale = 0
                }
                if (i.atPay === undefined || i.atPay === '') {
                    i.atPay = 0
                }
                amountIn.push(i.sale)
                shouldPay.push(i.atPay)
            })
            this.amountInTotal = amountIn.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.shouldPayTotal = shouldPay.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.totalData[0].handle = this.shouldPayTotal
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_sum_status:1') {
                this.disContextMenu = ['取消确认']
            } else if (status === 'bill_sum_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核', '取消确认']
            } else if (status === 'bill_sum_status:3') {
                this.disContextMenu = ['编辑', '删除']
            }
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isAfter()
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
                this.$refs.newTable.exportFile('SupplierSumFind', this.seachValue)
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
            e.path = 'SupplierSumFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            // console.log(keys, rows)
            this.selectArr = rows
        },
        /**
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (e) {
            console.log('编辑', e)
            if (e.status === 'bill_sum_status:2') {
                this.$message.error('单据已审核,不可编辑')
            } else {
                this.addData(e)
                this.rowId = e.id
            }
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
                        path: 'SupplierSumAudit',
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
        reconfirmHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'SupplierSumUpdateDisconfirmation',
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
                    if (statusArr[item] === 'bill_sum_status:2') {
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
                        path: 'SupplierSumDelete',
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
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
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
                this.BaseMessageObj = {
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.categoryinfoData = []
                this.totalData = [
                    {
                        tb_web_id: '01',
                        unpaid: '0',
                        handle: '0',
                        outOfPocket: '0',
                        surplus: '0'
                    }
                ]
                this.thisPaymentChinese = ''
                this.providerId = ''
                this.amountInTotal = '0.00'
                this.shouldPayTotal = '0.00'
                this.orderId = ''
                this.tags = []
                this.onUpStoreCode(this.$store.getters.storeInfo.code)
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEdit = 'edit'
                this.editAssign(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        /**
         * @name: 编辑赋初值操作
         * @msg:
         * @param {type}
         * @return:
         */
        editAssign (e) {
            this.onUpStoreCode(e.makeStoreCode)
            axios({
                path: 'SupplierSumFindDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('本行数据', e)
                    console.log('详细信息', res)
                    this.orderId = e.code
                    this.tags = ['uncheck']
                    this.BaseMessageObj = {
                        provider: e.provider,
                        byTime: moment(e.byTime),
                        accountBank: e.accountBank,
                        accountNo: e.accountNo,
                        payMode: e.payMode,
                        payInvno: e.payInvno,
                        invoiceNo: e.invoiceNo,
                        upStoreCode: this.upStoreCode,
                        makeTime: e.makeTime,
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}-${e.chargeUsernoName}` : '',
                        makeUserno: e.makeUserno ? `${e.makeUserno}-${e.makeUsernoName}` : ''
                    }
                    this.providerId = e.provider
                    axios({
                        path: 'SupplierSumFindDelay',
                        method: 'POST',
                        body: {
                            provider: e.provider,
                            makeStoreCode: this.$store.getters.storeInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('本期结余', res)
                            this.totalData[0].unpaid = res.data
                        }
                    })
                    this.totalData[0].handle = e.atPay
                    this.totalData[0].surplus = e.factPay
                    this.totalData[0].outOfPocket = e.delay
                    this.thisPaymentChinese = lowToUp(e.delay)
                    this.amountInTotal = e.sale
                    this.shouldPayTotal = e.atPay
                    const arr = res.data.list
                    arr.forEach(i => {
                        i.index = this.indexNumber++
                        i.tb_web_id = i.id
                        i.makeUserno = e.makeUserno
                        i.makeTime = e.makeTime
                        i.makeStoreName = e.makeStoreName
                    })
                    this.categoryinfoData = arr
                }
            })
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
            const newData = [...this.categoryinfoData]
            // if (Number(this.totalData[0].outOfPocket) === 0) {
            //     this.$message.error('本期实付为0,不能添加')
            //     return
            // }
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    console.log(newData)
                    this.submitLoading = true
                    values.upStoreCode = this.upStore
                    values.makeUserno = values.makeUserno ? values.makeUserno.split('-')[0] : ''
                    values.chargeUserno = values.chargeUserno ? values.chargeUserno.split('-')[0] : ''
                    values.byTime = moment(values.byTime).format('YYYY-MM-DD')
                    const addArr = Object.assign(
                        values,
                        { billSumDetails: newData },
                        { delay: this.totalData[0].surplus },
                        { sale: this.amountInTotal },
                        { atPay: this.shouldPayTotal },
                        { factPay: this.totalData[0].outOfPocket },
                        { makeStoreCode: this.$store.getters.storeInfo.code }
                    )
                    if (this.addEdit === 'add') {
                        axios({
                            path: 'SupplierSumAdd',
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
                        const saveArr = Object.assign(values, { id: this.rowId })
                        axios({
                            path: 'SupplierSumUpdate',
                            method: 'post',
                            body: saveArr,
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
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            if (this.providerId === '' || this.providerId === undefined) {
                this.$message.warning('请选择供应商！')
                return
            }
            this.pams = {
                provider: this.providerId,
                makeStoreCode: this.$store.getters.storeInfo.code
            }
            this.storeQuery = true
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (code) {
            console.log(code)
            console.log()
            if (code === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].code === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.code !== code)
            }
            this.total(this.categoryinfoData)
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
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        footerChange (val, count, col) {
            console.log(val, count, col)
            const { add, sub } = this.$math
            const newData = [...this.totalData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (val === '' || val === undefined) {
                    return
                }
                target[col] = val
                this.totalData = newData
                target.surplus = sub(add(target.unpaid, target.handle, 2), target.outOfPocket, 2)
                this.thisPaymentChinese = lowToUp(target.outOfPocket)
                if (col === 'outOfPocket' && this.categoryinfoData.length !== 0) {
                    if (target.surplus < 0) {
                        target.unpaid = 0.00
                        target.handle = 0.00
                        target.outOfPocket = 0.00
                        target.surplus = 0.00
                        this.total(this.categoryinfoData)
                        this.$message.warning('本期实付金额应小于等于上期未付和本期应付之和！')
                    }
                }
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'SupplierPayment') {
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

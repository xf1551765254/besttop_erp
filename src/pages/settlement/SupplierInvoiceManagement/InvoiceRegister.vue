<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-27 09:46:02
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
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 弹窗 -->
    <bt-modal
      v-model="editVisible"
      title="发票登记单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">交接人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.jionUserName',{initialValue:billsForm.jionUserName})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">采集位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.makeStoreCode', {initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code} : ${$store.getters.storeInfo.name}`})" disabled/>
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
                v-decorator="$check('InvoiceJion.invoiceAmount',{initialValue:billsForm.invoiceAmount || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">交接状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.jionStatusName',{initialValue:billsForm.jionStatusName || '未交接'})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">邮寄日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                v-decorator="$check('InvoiceJion.postDate',{initialValue:billsForm.postDate || postDate})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">接收日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                v-decorator="$check('InvoiceJion.recTime',{initialValue:billsForm.recTime || postDate})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">快递单号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.courierNumber',{initialValue:billsForm.courierNumber})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                v-decorator="$check('InvoiceJion.provider',{initialValue:billsForm.provider} ) "
                :options="providerList"
                @search="priverSearch"
                showSearch
                allowClear/>
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
                v-decorator="$check('InvoiceJion.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">发票登记单</h4>
        <a-button class="editable-add-btn" @click="()=>{goodsQuery = true, invoiceForm = {}, disabled=true}">扫码录入</a-button>
        <a-button class="editable-add-btn" @click="()=>{goodsQuery = true, invoiceForm = {}, disabled=false}">手动录入</a-button>
        <a-button class="editable-add-btn" type="danger" @click="billsDel()">删除</a-button>
        <a-table
          rowKey="bt_web_id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="scrollXY">
          <template v-for="col in ['invoiceAmount','note', 'invoiceTimes']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'invoiceAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-date-picker
                v-else-if="col === 'invoiceTimes'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)"
              />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.bt_web_id, col)"
              />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.bt_web_id)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">登记人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code} : ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">登记时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <a-modal
      v-model="goodsQuery"
      keyboard
      :maskClosable="false"
      :width="500"
      :footer="null"
      destroyOnClose
      centered
      class="doc mat">
      <template slot="title">
        <p style="display: inline-block;margin-bottom: 0;vertical-align: middle;">{{ "发票录入" }}</p>
      </template>
      <a-form :form="enterForm" @submit="onAffirm">
        <a-row class="doc">
          <a-col :span="4" v-if="disabled">扫描:</a-col>
          <a-col :span="20" v-if="disabled">
            <a-form-item>
              <a-input
                type="tel"
                style="-webkit-text-security:disc;text-security:disc;"
                v-decorator="$check('InvoiceJion.scan', {initialValue: invoiceForm.scan})"
                @pressEnter="scanKey"
                autoFocus/>
            </a-form-item>
          </a-col>
        </a-row>
        <h4>发票信息</h4>
        <a-row class="doc">
          <a-col :span="4">发票代码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.invoiceCode', {initialValue: invoiceForm.invoiceCode})" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="4">发票号码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('InvoiceJion.invoiceNo', {initialValue: invoiceForm.invoiceNo})" :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="4">金额(不含税)</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('InvoiceJion.invoiceAmount', {initialValue: invoiceForm.invoiceAmount})"
                :disabled="disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="4">开票日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                v-decorator="$check('InvoiceJion.invoiceTimes',{initialValue:invoiceForm.invoiceTimes})"
                :disabled="disabled"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="!disabled">
          <a-col :span="24" class="col">
            <a-form-item>
              <a-button type="primary" html-type="submit">确定</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .mat {
        .ant-form {
            border-top: 0;
            border-left: 0;
            .ant-input-number {
                width: 100%;
            }
        }
        .col {
            text-align: center;
            margin-top: 10px;
            height:30px;
        }
    }
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
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import moment from 'moment'
import Preview from './preview/InvoiceRegisterPreview'
import getStatus from '@comp/statusAll/getStatus'
const billsData = []
export default {
    name: 'InvoiceRegister',
    components: { seachBox, NewTable, BtModal, Preview },
    data () {
        this.cacheData = billsData.map(item => ({ ...item }))
        // style="-webkit-text-security:disc;text-security:disc;"
        return {
            disabled: true,
            tags: [],
            orderId: '',
            bt_id: '',
            bt_Save: false,
            invoiceForm: {},
            loading: false,
            billsForm: {},
            title: '',
            billsData,
            editVisible: false,
            selectedRowKeys: [],
            goodsQuery: false,
            providerList: [],
            // 录入表单
            enterForm: this.$form.createForm(this),
            // 表单
            form: this.$form.createForm(this),
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
                timeA: moment().subtract({ days: 7 }),
                timeB: moment()
            },
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
                    key: 'timeA',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'timeB',
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
                    // body: { type: 'invoice_jion_status', grade: '1' }
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
                    action: 'InvoiceRegister.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'InvoiceRegister.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'InvoiceRegister.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'InvoiceRegister.get',
                    fc: this.previewFun
                }
            ],
            // 单据表头
            columns: [
                { title: '发票代码', dataIndex: 'invoiceCode', width: 150, align: 'center' },
                { title: '发票号码', dataIndex: 'invoiceNo', width: 150, align: 'center' },
                { title: '金额(不含税)', dataIndex: 'invoiceAmount', width: 200, align: 'center', scopedSlots: { customRender: 'invoiceAmount' } },
                { title: '开票日期', dataIndex: 'invoiceTimes', width: 200, align: 'center', scopedSlots: { customRender: 'invoiceTimes' } },
                { title: '核销', dataIndex: 'flagName', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            scrollXY: {
                x: 1100,
                y: 350
            },
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            makeTime: moment().format('YYYY-MM-DD H:mm:ss'),
            postDate: moment(),
            // 预览
            previewVisbel: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9db3a8b74567418a9396744a48a72128:InvoiceRegister'
            this.tableApiPath = 'InvoiceJionFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('invoice_jion_status', this.conditions[3])
        this.seachValue = {
            status: 'invoice_jion_status:1',
            timeA: moment().subtract({ days: 7 }),
            timeB: moment()
        }
        this.getAll()
    },
    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 扫描
         */
        async scanKey (e) {
            console.log(e, '扫描')
            const reg = /^[0-9]{2}\,[0-9]{2}\,[0-9]+\,[0-9]+\,[0-9]{1,}[.][0-9]{2}\,(19|20)[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[01])\,.*$/
            if (!reg.test(e.target.value)) {
                setTimeout(e => {
                    this.enterForm.resetFields()
                    this.invoiceForm = {}
                }, 1000)
                return this.$message.error('格式错误,请重新扫描!')
            }
            const obj = {}
            const arr = e.target.value.split(',')
            for (const key in arr) {
                obj[`${'nature'}${key}`] = arr[key]
            }
            console.log(obj, '6666666666666666')
            const objAll = {
                flagName: '未核销',
                invoiceNo: obj.nature3,
                invoiceCode: obj.nature2,
                invoiceAmount: obj.nature4,
                invoiceTimes: moment(obj.nature5),
                bt_web_id: `${obj.nature2}${obj.nature3}`
            }
            // const objRow = {
            //     flagName: '未核销',
            //     invoiceNo: obj.nature3,
            //     invoiceCode: obj.nature2,
            //     invoiceAmount: obj.nature4,
            //     bt_web_id: `${obj.nature2}${obj.nature3}`,
            //     invoiceTimes: moment(obj.nature5).format('YYYY-MM-DD')
            // }
            console.log(objAll, '录入')
            this.enteringHttp(objAll)
            // const res = await axios({
            //     path: 'InvoiceJionFindInvoiceCheck',
            //     mounted: 'post',
            //     body: objRow
            // })
            // if (res.flag === 1) {
            //     for (const i of this.billsData) {
            //         if (i.bt_web_id === objAll.bt_web_id) {
            //             this.enterForm.resetFields()
            //             return this.$message.error('发票录入重复,请重新录入!')
            //         }
            //     }
            //     // this.goodsQuery = false
            //     this.invoiceForm = objAll
            //     console.log(this.billsForm, '扫描')
            //     this.billsData.push(objAll)
            //     this.enterForm.resetFields()
            // } else {
            //     setTimeout(e => {
            //         this.enterForm.resetFields()
            //         this.invoiceForm = {}
            //     }, 1000)
            // }
        },
        async enteringHttp (obj) {
            obj.invoiceTime = moment(obj.invoiceTimes)
            const res = await axios({
                path: 'InvoiceJionFindInvoiceCheck',
                mounted: 'post',
                body: obj
            })
            if (res.flag === 1) {
                for (const i of this.billsData) {
                    if (i.bt_web_id === obj.bt_web_id) {
                        this.enterForm.resetFields()
                        return this.$message.error('发票录入重复,请重新录入!')
                    }
                }
                console.log(obj, '7777777777777777')
                this.invoiceForm = obj
                this.billsData.push(obj)
                this.enterForm.resetFields()
            } else {
                setTimeout(e => {
                    this.enterForm.resetFields()
                    this.invoiceForm = {}
                }, 1000)
            }
        },
        /**
         * @name:发票手动录入确认
         */
        onAffirm (e) {
            console.log(e)
            e.preventDefault() // 防止事件穿透
            const { enterForm: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    if (!values.invoiceCode || !values.invoiceNo || !values.invoiceAmount) {
                        return this.$message.error('表单未填写完成!')
                    } else {
                        const reg = new RegExp('^[0-9]*$')
                        if (!reg.test(values.invoiceCode) || !reg.test(values.invoiceNo)) { return this.$message.error('当前提交数据格式错误!') }
                        const formDate = { ...values }
                        // formDate.invoiceTimes = moment(values.invoiceTimes).format('YYYY-MM-DD')
                        formDate.flagName = '未核销'
                        formDate.bt_web_id = `${values.invoiceCode}${values.invoiceNo}`
                        this.enteringHttp(formDate)
                    }
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:监听单据表格编辑
         */
        InputChange (val, count, key) {
            console.log(val, count, key, '监听')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                if (key === 'invoiceAmount') {
                    const arr = []
                    const { add } = this.$math
                    for (const i of newData) {
                        arr.push(i.invoiceAmount)
                    }
                    console.log(arr, '数组')
                    const invoiceAmount = arr.reduce((prev, cur) => {
                        return add(prev, cur, 2)
                    }, 0)
                    this.$set(this.billsForm, invoiceAmount, 'invoiceAmount')
                }
                target[key] = val
                this.billsData = newData
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
                    console.log(formDate, '保存')
                    formDate.recTime = moment(values.recTime).format('YYYY-MM-DD')
                    formDate.postDate = moment(values.postDate).format('YYYY-MM-DD')
                    formDate.list = this.billsData
                    for (const i of formDate.list) {
                        i.invoiceTime = moment(i.invoiceTimes).format('YYYY-MM-DD')
                    }
                    if (formDate.list.length < 1) {
                        this.loading = false
                        return this.$message.warning('请录入发票信息')
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    } else {
                        formDate.makeStoreCode = this.$store.getters.storeInfo.code
                        formDate.makeUserCode = this.$store.getters.userInfo.code
                    }
                    axios({
                        path: this.bt_Save ? 'InvoiceJionUpdate' : 'InvoiceJionAdd',
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
         * @name:右键编辑按钮
         */
        editRow (e) {
            const arr = { ...e }
            this.orderId = arr.code
            this.tags = ['uncheck']
            this.bt_id = arr.id
            arr.recTime = moment(arr.recTime)
            arr.postDate = moment(arr.postDate)
            this.billsForm = { ...arr }
            axios({
                path: 'InvoiceJionFindByJionId',
                method: 'post',
                body: {
                    id: arr.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.editVisible = true
                    for (const i of res.data) {
                        i.bt_web_id = `${i.invoiceNo}${i.invoiceCode}`
                        i.invoiceTimes = moment(i.invoiceTime)
                    }
                    console.log(res.data, '编辑获取表格')
                    this.billsData = res.data
                }
            })
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.billsData = []
                this.billsForm = {}
                this.title = '新增'
                this.orderId = ''
                this.tags = []
                this.bt_Save = false
                this.editVisible = true
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('InvoiceJionFind', this.seachValue)
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
                this.editRow(e)
                this.title = '编辑'
                this.bt_Save = true
                this.editVisible = true
            } else if (mun === 'del') {
                console.log(e, '删除')
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
            e.path = 'InvoiceJionFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
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
        onContextmenuChange ({ status }) {
            if (status === 'invoice_jion_status:1') {
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
                arr = [...this.deleteAll]
            } else {
                arr.push(e.id)
            }
            console.log(arr, this.deleteAll, '啥呀')
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
            } else {
                const that = this
                this.$confirm({
                    title: '删除确认',
                    content: '删除后不可恢复，确定继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'InvoiceJionDelete',
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
            }
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
                        path: 'InvoiceJionAudit',
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
        /**
         * @name: 下拉框
         */
        getAll () {
            // 获取用户信息
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data)
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.customerLIst = [...data]
                }
            })
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        billsDel () {
            const that = this
            this.$confirm({
                title: '审核确认',
                content: '是否确认删除当前选中?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    that.categoryinfoDelete(-1)
                }
            })
        },
        /**
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del)
            if (del === -1) {
                const billsData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in billsData) {
                        if (billsData[j].bt_web_id === this.selectedRowKeys[i]) {
                            billsData.splice(j, 1)
                        }
                    }
                }
                this.billsData = billsData
            } else {
                const billsData = [...this.billsData]
                this.billsData = billsData.filter(item => item.bt_web_id !== del)
            }
            this.selectedRowKeys = []
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('9db3a8b74567418a9396744a48a72128:InvoiceRegister', { path: 'InvoiceJionFind' })
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        }
    },
    watch: {
        billsData: {
            handler (newValue, oldValue) {
                const arr = []
                const { add } = this.$math
                for (const i of newValue) {
                    arr.push(Number(i.invoiceAmount))
                }
                const invoiceAmounts = arr.reduce((prev, cur) => {
                    return add(prev, cur, 2)
                }, 0)
                console.log(invoiceAmounts)
                this.billsForm.invoiceAmount = invoiceAmounts
            }
        }
    }
}
</script>

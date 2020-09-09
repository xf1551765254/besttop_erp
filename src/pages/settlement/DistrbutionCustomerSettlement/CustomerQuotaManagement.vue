<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-27 16:20:42
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
      title="客户限额管理"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billCustLimitSet.storeCode',{initialValue:billsForm.storeCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索负责人"
                @search="handleSearchBuyBy"
                :filterOption="false"
                showSearch
                v-decorator="$check('billCustLimitSet.chargeUserCode', {initialValue:billsForm.chargeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})"
                :options="customerLIst"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索申请人"
                :filterOption="false"
                showSearch
                @search="handleSearchBuyBy"
                v-decorator="$check('billCustLimitSet.applyUserCode', {initialValue:billsForm.applyUserCode})"
                :options="customerLIst"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billCustLimitSet.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input style="width:100%;" v-decorator="$check('billCustLimitSet.note',{initialValue:billsForm.note})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">客户限额设置</h4>
        <a-button class="editable-add-btn" @click="addManage">新增</a-button>
        <a-button class="editable-add-btn" type="danger" @click="billsDel(-1)">删除</a-button>
        <a-table
          rowKey="custNo"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="{x:1000}">
          <template v-for="col in ['limitA', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'limitA'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputStorageChange(e, record.custNo, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.custNo, col)"
              />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.custNo)" okText="是" cancelText="否">
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
              <a-input v-decorator="$check('billCustLimitSet.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billCustLimitSet.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <clientLimit :visible.sync="userQuery" @onSelect="onUserSelect" :pams="userSet" multiple></clientLimit>
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
import clientLimit from '@pages/settlement/DistrbutionCustomerSettlement/clientLimit/clientLimit'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import BtModal from '@comp/Modal'
import getStatus from '@comp/statusAll/getStatus'
import Preview from './preview/CustomerQuotaManagementPreview'
// 单据表格表头
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '客户编码', dataIndex: 'custNo', width: 100, align: 'left' },
    { title: '客户名称', dataIndex: 'custName', width: 200, align: 'left' },
    { title: '原设定限额', dataIndex: 'origLimitA', width: 200, align: 'right' },
    { title: '新设定限额', dataIndex: 'limitA', width: 200, align: 'right', scopedSlots: { customRender: 'limitA' } },
    { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'CustomerQuotaManagement',
    components: { seachBox, NewTable, clientLimit, BtModal, Preview },
    data () {
        return {
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
            // 负责人
            customerLIst: [],
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
                    title: '单据状态',
                    type: 'select',
                    key: 'status',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []

                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_cust_limit_set_status', grade: '1' }
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
                    action: 'CustomerQuotaManagement.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'CustomerQuotaManagement.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'CustomerQuotaManagement.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'CustomerQuotaManagement.get',
                    fc: this.previewFun
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
            seachValue: {},
            // 制单时间
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            // 预览
            previewVisbel: false,
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'c6bace613d9e48499a672b7e4b48319e:CustomerQuotaManagement'
            this.tableApiPath = 'CustLimitFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_cust_limit_set_status', this.conditions[3])
        this.seachValue = {
            status: 'bill_cust_limit_set_status:1',
            beginMakeTime: moment().subtract({ months: 1 }),
            endMakeTime: moment()
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
                    this.customerLIst = data
                }
            })
        },
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            console.log(e, '编辑')
            const arr = { ...e }
            this.orderId = arr.code
            this.tags = ['uncheck']
            this.bt_id = arr.id
            arr.makeUserCode = arr.makeUserCode ? `${arr.makeUserCode}-${arr.makeUserName}` : ''
            arr.makeStoreCode = arr.makeStoreCode ? `${arr.makeStoreCode}-${arr.makeStoreName}` : ''
            arr.storeCode = arr.storeCode ? `${arr.storeCode}-${arr.storeName}` : ''
            arr.chargeUserCode = arr.chargeUserCode ? `${arr.chargeUserCode}-${arr.chargeUserName}` : ''
            arr.applyUserCode = arr.applyUserCode ? `${arr.applyUserCode}-${arr.applyUserName}` : ''
            this.billsForm = arr
            axios({
                path: 'CustLimitFindDetail',
                method: 'post',
                body: {
                    id: arr.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '编辑获取表格')
                    for (const i of res.data.list) {
                        i.index = this.indexNumber++
                        if (i.origLimitA > 0) {
                            i.origLimitA = `￥${i.origLimitA}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                    }
                    this.billsData = res.data.list
                }
            })
        },
        /**
         * @name:选中客户数据
         */
        async onUserSelect (e) {
            console.log(e, '添加')
            const error = []
            const arr = []
            e.forEach(item => {
                arr.push(item.code)
            })
            if (arr.length > 0) {
                const res = await axios({
                    path: 'CustMonitorFindByCustNosAndStoreCode',
                    method: 'post',
                    body: {
                        custNos: arr,
                        storeCode: this.$store.getters.storeInfo.code
                    }
                })
                if (res.flag === 1) {
                    console.log(res.data, '客户限额')
                    for (const i of res.data) {
                        const list = this.billsData.filter(o => o.custNo === i.custNo)
                        if (list.length === 0) {
                            if (i.limitAmount > 0) {
                                this.billsData.push({
                                    index: this.indexNumber++,
                                    id: i.id,
                                    custName: i.custName,
                                    custNo: i.custNo,
                                    origLimitA: `￥${i.limitAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                })
                            } else {
                                this.billsData.push({
                                    index: this.indexNumber++,
                                    id: i.id,
                                    custName: i.custName,
                                    custNo: i.custNo,
                                    origLimitA: i.limitAmount
                                })
                            }
                        } else {
                            error.push(i.name)
                        }
                    }
                }
            }
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
            console.log(this.bt_Save, '444444')
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = values
                    console.log(formDate)
                    formDate.applyUserCode = values.applyUserCode ? values.applyUserCode.split('-')[0] : ''
                    formDate.makeUserCode = values.makeUserCode ? values.makeUserCode.split('-')[0] : ''
                    formDate.makeStoreCode = values.makeStoreCode ? values.makeStoreCode.split('-')[0] : ''
                    formDate.storeCode = values.storeCode ? values.storeCode.split('-')[0] : ''
                    formDate.chargeUserCode = values.chargeUserCode ? values.chargeUserCode.split('-')[0] : ''
                    formDate.billCustLimitSetDetails = this.billsData
                    for (const i of formDate.billCustLimitSetDetails) {
                        if (i.origLimitA) {
                            i.origLimitA = i.origLimitA.replace(/\￥\s?|(,*)/g, '')
                        }
                        if (i.limitA === undefined) {
                            this.loading = false
                            return this.$message.warning('当前提交客户新设定限额异常!')
                        }
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    }
                    this.loading = true
                    axios({
                        path: this.bt_Save ? 'CustLimitUpdate' : 'CustLimitAdd',
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
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.custNo)[0]
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
            console.log(e, '搜索框数据')
            e.path = 'CustLimitFind'
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
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.title = '新增'
                this.bt_Save = false
                this.billsForm = {}
                this.billsData = []
                this.orderId = ''
                this.tags = []
                this.clientVisible = true
                this.makeTime = moment().format('YYYY-MM-DD hh:mm:ss')
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CustLimitFind', this.seachValue)
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
                this.title = '编辑'
                this.bt_Save = true
                this.editRow(e)
                this.clientVisible = true
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'cancelAffirm') {
                console.log('取消确认')
                this.cancelAffirm(e)
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
                        path: 'CustLimitDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
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
                        path: 'CustLimitAudit',
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
                }
            })
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_cust_limit_set_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name: 单据新增行
         */
        addManage () {
            console.log('新增单据')
            this.userQuery = true
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
            console.log(del, '单据删除')
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].custNo === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.custNo !== del)
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
            this.$refs.newTable.setTableData('c6bace613d9e48499a672b7e4b48319e:CustomerQuotaManagement', { path: 'CustLimitFind' })
        }
    },
    watch: {
        editVisible (val) {
            if (!val) {
                this.billsData = []
                this.indexNumber = 1
                this.billsForm = {}
            }
        }

    }
}
</script>

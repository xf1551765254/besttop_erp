<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 15:19:32
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
      @onSeach="onSeach">
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="addData(-1)">延期申请</a-button>
    </seachBox>
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
      :submitClick="submitClick"
    >
      <h4 class="baseInfo">
        申请内容
      </h4>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                style="width: 100%"
                showSearch
                v-decorator="$check('custDelayPaySet.storeCode',{initialValue: `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                :disabled="showAddEdit"
                style="width: 100%"
                showSearch
                placeholder="请选择客户"
                :filterOption="filterOption"
                :options="clientArr"
                v-decorator="$check('custDelayPaySet.custCode',{initialValue:this.BaseMessageObj.custCode})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabled="showAddEdit"
                @change="onChangeBeginTime"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('custDelayPaySet.beginTime',{initialValue:BaseMessageObj.beginTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabled="showAddEdit"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('custDelayPaySet.endTime',{initialValue:BaseMessageObj.endTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                placeholder="请输入申请金额"
                :disabled="showAddEdit"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('custDelayPaySet.delayAmount',{initialValue:BaseMessageObj.delayAmount})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea :disabled="showAddEdit" placeholder="请输入备注" v-decorator="$check('custDelayPaySet.makeNote',{initialValue:BaseMessageObj.makeNote})" :autosize="{ minRows: 2, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <div v-if="showAddEdit">
          <h4 class="baseInfo">付款确认</h4>
          <a-row class="doc">
            <a-col :sm="8" :md="4" :xl="3">实际付款日期</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-date-picker
                  style="width: 100%"
                  :disabledDate="payTimeData"
                  v-decorator="$check('custDelayPaySet.payTime',{initialValue:BaseMessageObj.payTime})"
                  allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">备注</a-col>
            <a-col :sm="16" :md="20" :xl="21">
              <a-form-item>
                <a-textarea placeholder="请输入备注" v-decorator="$check('custDelayPaySet.payNote',{initialValue:this.BaseMessageObj.payNote})" :autosize="{ minRows: 2, maxRows: 2 }" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </bt-modal>
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
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'CustomerCostManagement',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            btns: ['del', 'export', 'print'],
            organizeCodeData: [], // 组织机构数组
            conditions: [
                {
                    title: '机构编码',
                    type: 'treeSelect',
                    key: 'storeCode',
                    filter: true,
                    selectDataArr: []
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
                    title: '客户编码',
                    type: 'select',
                    key: 'custCode',
                    path: 'CustomerDistributorsFindInfoBySelected',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                },
                {
                    title: '申请开始时间',
                    type: 'date',
                    key: 'timeA'
                },
                {
                    title: '申请结束时间',
                    type: 'date',
                    key: 'timeB'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'CustomerCostManagement.edit',
                    fc: this.addData
                },
                {
                    name: '付款确认',
                    action: 'CustomerCostManagement.verify',
                    fc: this.confirmationOfPayment
                },
                {
                    name: '删除',
                    action: 'CustomerCostManagement.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'LineManagement.get',
                    fc: e => this.$refs.newTable.showDetails('客户延期付款详情', e)
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false, // 新增模态框显示隐藏
            submitLoading: false, // 按钮loading状态
            form: this.$form.createForm(this),
            BaseMessageObj: {},
            addEdit: '', // 新增编辑状态
            showAddEdit: '', // 新增编辑的显示隐藏
            title: '',
            rowId: '',
            clientArr: [],
            orderId: '',
            tags: [],
            beginTimeId: null
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '562bc391737246ff9c96183595bc1e0a:CustomerCostManagement'
            this.tableApiPath = 'CustSetFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.client()
        this.getOrganizeCodeData()
        getStatus('cust_delay_pay_set_status', this.conditions[1])
        this.seachValue = {
            status: 'cust_delay_pay_set_status:1',
            timeA: moment().subtract({ months: 1 }),
            timeB: moment()
        }
    },
    methods: {
        /**
         * @name: 付款确认
         * @msg:
         * @param {type}
         * @return:
         */
        confirmationOfPayment (e) {
            this.addEdit = 'affirm'
            this.showAddEdit = true
            this.title = '客户付款确认'
            this.addEditModel = true
            this.rowId = e.id
            this.BaseMessageObj = {
                custCode: e.custCode,
                beginTime: moment(e.beginTime),
                endTime: moment(e.endTime),
                delayAmount: e.delayAmount,
                makeNote: e.makeNote,
                payTime: moment()
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
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    console.log(values, '----------')
                    if (values.beginTime.unix() > values.endTime.unix()) {
                        this.$message.warning('开始日期不能晚于结束日期！')
                        return
                    }
                    values.storeCode = this.$store.getters.storeInfo.code
                    this.submitLoading = true
                    values.beginTime = moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss')
                    values.endTime = moment(values.endTime).format('YYYY-MM-DD HH:mm:ss')
                    if (this.addEdit === 'add') {
                        axios({
                            path: 'CustSetAdd',
                            method: 'post',
                            body: values,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else if (this.addEdit === 'edit') {
                        const addArr = Object.assign(values, { id: this.rowId })
                        axios({
                            path: 'CustSetUpdate',
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
                    } else if (this.addEdit === 'affirm') {
                        values.payTime = moment(values.payTime).format('YYYY-MM-DD HH:mm:ss')
                        const addArr = Object.assign(values, { id: this.rowId })
                        axios({
                            path: 'CustSetConfirm',
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
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'cust_delay_pay_set_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '删除', '付款确认']
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

            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CustSetFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            this.showAddEdit = false
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                console.log('新增')
                this.addEdit = 'add'
                this.title = '新增客户延期申请'
                this.BaseMessageObj = {
                    beginTime: moment(),
                    endTime: moment().add({ months: 1 })
                }
                this.tags = []
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑', index)
                this.addEdit = 'edit'
                this.rowId = index.id
                this.title = '编辑客户延期申请'
                this.tags = ['unconfirm']

                this.BaseMessageObj = {
                    custCode: index.custCode,
                    beginTime: moment(index.beginTime),
                    endTime: moment(index.endTime),
                    delayAmount: index.delayAmount,
                    makeNote: index.makeNote
                }
            }
            this.addEditModel = true
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            console.log(e, '------------------')
            e.path = 'CustSetFind'
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
                    if (statusArr[item] === 'cust_delay_pay_set_status:2' || statusArr[item] === 'cust_delay_pay_set_status:3') {
                        this.$message.error('选中数据存在已付款数据，不可删除')
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
                        path: 'CustSetDelete',
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
                }
            })
        },
        filterOption (input, option) {
            console.log(input, option)
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        getOrganizeCodeData () {
            axios({
                path: 'OrganizationGroupFrameworkFindOptionTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log('组织机构', data)
                    this.organizeCodeData = this.initTree(data)
                    // this.conditions[0].selectDataArr = this.organizeCodeData
                    console.log(this.organizeCodeData)
                    this.$set(this.conditions[0], 'selectDataArr', this.organizeCodeData)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(i => {
                i.key = i.code
                i.title = `${i.code}-${i.name}`
                i.value = i.code
                if ('children' in i) {
                    i.children = this.initTree(i.children)
                } else {
                    i.isLeaf = true
                }
                arr.push(i)
            })
            return arr
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isBefore()
        },
        payTimeData (e) {
            return moment(e).isAfter()
        },
        onChangeBeginTime (e) {
            this.beginTimeId = e
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CustomerCostManagement') {
                this.client()
                this.getOrganizeCodeData()
            }
        },
        beginTimeId: {
            handler (val, oldval) {
                console.log('监听时间', val)
                this.BaseMessageObj.endTime = moment(val).add({ months: 1 })
            }
        }
    }
}
</script>

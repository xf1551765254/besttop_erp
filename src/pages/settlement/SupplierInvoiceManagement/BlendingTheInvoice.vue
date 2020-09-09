<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-07-29 17:28:17
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
    <BlendingTheInvoiceChild
      v-model="editVisible"
      ref="blendRef"
      :btsave.sync="bt_Save"
      :title="title">
    </BlendingTheInvoiceChild >
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import BlendingTheInvoiceChild from '@pages/settlement/SupplierInvoiceManagement/BlendingTheInvoices/BlendingTheInvoiceChild'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import Preview from './preview/BlendingTheInvoicePreview'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'BlendingTheInvoice',
    components: { seachBox, NewTable, BlendingTheInvoiceChild, Preview },
    data () {
        return {
            billsData: [],
            tags: [],
            orderId: '',
            title: '',
            bt_Save: false,
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
                beginMakeTime: moment().subtract({ days: 7 }),
                endMakeTime: moment()
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
                    key: 'beginMakeTime',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'endMakeTime',
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
                    // body: { type: 'invoice_record_status', grade: '1' }
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
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'BlendingTheInvoice.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'BlendingTheInvoice.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'BlendingTheInvoice.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '取消确认',
                    action: 'BlendingTheInvoice.verify',
                    fc: row => {
                        this.getRow(row, 'cancelAffirm')
                    }
                },
                {
                    name: '预览',
                    action: 'BlendingTheInvoice.get',
                    fc: this.previewFun
                }
            ],
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            // 预览
            previewVisbel: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9d12929fce3f4f49a357c5e85ce5ba6e:BlendingTheInvoice'
            this.tableApiPath = 'InvoiceBlendFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('invoice_record_status', this.conditions[3])
        this.seachValue = {
            status: 'invoice_record_status:1',
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment()
        }
        this.getAll()
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
                this.title = '新增'
                this.editVisible = true
                console.log(this.editVisible, '新增')
                this.$refs.blendRef.onSwitch()
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('InvoiceBlendFind', this.seachValue)
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
                this.editVisible = true
                // 传入编辑数据
                this.$refs.blendRef.editRow(e)
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
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'InvoiceBlendFind'
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
            if (status === 'invoice_record_status:1') {
                this.disContextMenu = [ '取消确认' ]
            } else if (status === 'invoice_record_status:3') {
                this.disContextMenu = ['新增', '编辑', '删除']
            } else if (status === 'invoice_record_status:2') {
                this.disContextMenu = ['新增', '编辑', '审核', '删除', '取消确认']
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
                        path: 'InvoiceBlendDelete',
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
                content: '是否审核当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'InvoiceBlendAudit',
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
         * @name: 取消确认
         */
        cancelAffirm (e) {
            const that = this
            this.$confirm({
                title: '',
                content: '是否取消确认单据?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    axios({
                        path: 'InvoiceBlendUpdateDisconfirmation',
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
            // 获取供应商
            axios({
                path: 'CustomerSupplierFindOption',
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
                    this.providerList = [...data]
                }
            })
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('9d12929fce3f4f49a357c5e85ce5ba6e:BlendingTheInvoice', { path: 'InvoiceBlendFind' })
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        }
    },
    watch: {
        editVisible (val, oldVal) {
            if (!val) {
                this.getDate()
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-07-29 17:28:02
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
    <SettlementChild
      v-model="editVisible"
      ref="settlementChildRef"
      :btsave.sync="bt_Save"
      :title="title"
      multiple>
    </SettlementChild>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import SettlementChild from '@pages/settlement/DistrbutionCustomerSettlement/clientLimit/settlementChild'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import Preview from './preview/CommissionSettlementPreview'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'CommissionSettlement',
    components: { seachBox, NewTable, SettlementChild, Preview },
    data () {
        return {
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
            seachValue: {},
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
                    action: 'CommissionSettlement.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'CommissionSettlement.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'CommissionSettlement.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'CommissionSettlement.get',
                    fc: this.previewFun
                }
            ],
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            // 预览
            billsData: [],
            tags: [],
            orderId: '',
            previewVisbel: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '1f1bf6a68ffe4bb29ff7ba1ac9948b14:CommissionSettlement'
            this.tableApiPath = 'WholesalePayFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_wholesale_pay_status', this.conditions[3])
        this.seachValue = {
            status: 'bill_wholesale_pay_status:1',
            beginMakeTime: moment().subtract(7, 'days'),
            endMakeTime: moment()
        }
    },
    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
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
                this.title = '新增'
                this.editVisible = true
                this.$refs.settlementChildRef.getAll()
                this.$refs.settlementChildRef.clearAll()
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('WholesalePayFind', this.seachValue)
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
                this.$refs.settlementChildRef.editRow(e)
                this.$refs.settlementChildRef.getAll()
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
            e.path = 'WholesalePayFind'
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
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            if (status === 'bill_wholesale_pay_status:1') {
                this.disContextMenu = []
            } else if (status === 'bill_wholesale_pay_status:2') {
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
                        path: 'WholesalePayDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll.length = 0
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
                        path: 'WholesalePayAudit',
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
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('1f1bf6a68ffe4bb29ff7ba1ac9948b14:CommissionSettlement', { path: 'WholesalePayFind' })
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

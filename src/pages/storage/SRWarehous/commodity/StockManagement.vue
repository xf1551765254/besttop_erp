<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-19 09:28:27
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-21 16:15:44
 -->
 <!-- 入库 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" size="small" @click="jointOperationAdd">联营入库</a-button>
    </seachBox>
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
    <StockManagementEdit v-model="clientVisible" :code="pamsCode" />
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import StockManagementEdit from '@pages/storage/edit/StockManagementEdit'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import Preview from '../preview/InboundManagementPreview'
import { axios } from '@/utils/request'
import getStatus from '@comp/statusAll/getStatus'
import moment from 'moment'
export default {
    name: 'ProcurementStorage',
    components: { seachBox, NewTable, Preview, StockManagementEdit, getStatus },
    data () {
        return {
            pamsCode: '',
            disabled: false,
            bt_Save: false,
            bt_id: null,
            pamsBounced: {}, // 添加商品传入参数
            storeQuery: false,
            flagObj: {}, // 添加商品传入商品
            selectedRowKeys: [], // 单据明细选中
            clientVisible: false,
            loading: false,
            billsData: [], // 明细表格
            billsForm: {}, // 单据数据
            providerList: [], // 供应商
            customerLIst: [], // 验货人
            tags: [],
            orderId: '',
            previewVisbel: false,
            editVisible: false, // 单据控制
            // 多选选中
            deleteAll: [],
            // 控制右键菜单
            disContextMenu: [],
            // 接口
            tableApiPath: '',
            // 表头id
            tableCode: '',
            // 搜索框默认值
            seachValue: {
                beginMakeTime: moment().subtract(7, 'days'),
                endMakeTime: moment(),
                makeStoreCode: this.$store.getters.storeInfo.code
            },
            provider: null,
            // 工具栏按钮定义
            btns: ['del', 'export', 'print'],
            form: this.$form.createForm(this), // 表单
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss'), // 制单时间
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
                    title: '单据状态',
                    type: 'select',
                    key: 'billStatus',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'makeUserCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
                {
                    title: '供应商',
                    key: 'provider',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'CustomerSupplierFindOption'
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
                }
            ],
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'InboundManagement.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'InboundManagement.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'InboundManagement.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'InboundManagement.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'fba053b2cb3443c99a19d27f83902240:StockManagement'
            this.tableApiPath = 'DistributionBillEntryFindEntry'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_entry_status', this.conditions[1])
        this.seachValue = {
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment(),
            billStatus: 'bill_entry_status:1'
        }
    },
    methods: {
        jointOperationAdd () {
            // this.getAll()
            this.getRow({}, 'add')
        },
        /**
             * @name:监听工具栏按钮
             */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionBillEntryFindEntry', this.seachValue)
                console.log('导出')
            } else if (e === 'del') {
                console.log('批量删除')
                if (this.deleteAll.length < 1) {
                    return this.$message.warning('您尚未选中任何数据！')
                }
                this.onDel(1)
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
             * @name:表格编辑/删除/审核操作监听
             */
        getRow (e, mun) {
            if (mun === 'add') {
                this.pamsCode = ''
                this.clientVisible = true
            } if (mun === 'edit') {
                this.pamsCode = e.code
                this.clientVisible = true
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
            }
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
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus, '审核状态')
            if (billStatus === 'bill_entry_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
             * @name:获取搜索框数据
             */
        onSeach (e) {
            e.path = 'DistributionBillEntryFindEntry'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
             * @name: 清空搜索
             */
        onReload () {
            this.seachValue = {}
        },
        /**
             * @name: 刷新表格
             */
        getDate () {
            this.$refs.newTable.setTableData('bd5e2cb922b04f039e5274e6cd356bdc:StockManagement', { path: 'DistributionBillEntryFindEntry' })
        },
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
      * @name: 单据表格多选
      */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
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
                        path: 'DistributionBillEntryDeleteEntry',
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
                        path: 'DistributionBillEntryAuditEntry',
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
        }
    },
    watch: {
        clientVisible (val) {
            if (!val) {
                this.getDate()
            }
        }
    }
}
</script>

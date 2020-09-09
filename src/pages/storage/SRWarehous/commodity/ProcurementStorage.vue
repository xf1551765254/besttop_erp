<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-19 09:26:03
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-22 17:11:12
 -->
<!-- 采购入库 -->
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
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
    <ProcurementStorageEdit v-model="clientVisible" :code="pamsCode" />
  </div>
</template>
<script>
import seachBox from '@comp/seachBox'
import Preview from '../preview/ProcurementStoragePreview'
import NewTable from '@comp/newTable'
import moment from 'moment'
import ProcurementStorageEdit from '@pages/storage/edit/ProcurementStorageEdit'
export default {
    name: 'ProcurementStorage',
    components: { seachBox, NewTable, Preview, ProcurementStorageEdit },
    data () {
        return {
            pamsCode: '',
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
                endMakeTime: moment()
            },
            // 工具栏按钮定义
            btns: ['export', 'print'],
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
                // {
                //     title: '单据状态',
                //     type: 'select',
                //     key: 'billStatus',
                //     label: 'title',
                //     value: ['type', 'configKey'],
                //     filter: true,
                //     selectDataArr: []
                // },
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
                    name: '入库',
                    action: 'InboundManagement.add',
                    fc: row => {
                        this.getRow(row, 'add')
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
            this.tableCode = 'ec4219d1e7224f89ba6bf6b9e2b8915a:ProcurementStorage'
            this.tableApiPath = 'DistributionBillEntryFindBillOrder'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
    },
    methods: {
        /**
           * @name:监听工具栏按钮
           */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionBillEntryFindBillOrder', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
           * @name:表格编辑/删除/审核操作监听
           */
        getRow (e, mun) {
            if (mun === 'add') {
                this.pamsCode = e.code
                this.clientVisible = true
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
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
           * @name:获取搜索框数据
           */
        onSeach (e) {
            e.path = 'DistributionBillEntryFindBillOrder'
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
            this.$refs.newTable.setTableData('8500f65dca4c49ac8acf62ba39df8495:ProcurementStorage', { path: 'DistributionBillEntryFindBillOrder' })
        },
        detailsSumbit (e) {
            console.log(123455666666)
            this.orderId = e.code
            this.previewVisbel = true
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    },
    watch: {
        clientVisible (val) {
            if (!val) {
                console.log(444444444444444444444444444444444444444444444444)
                this.getDate()
            }
        }
    }
}
</script>

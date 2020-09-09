<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-19 09:27:08
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-22 17:32:56
 -->
<!-- 样机入库 -->
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
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
    <PrototypePutInstorageEdit v-model="clientVisible" :code="pamsCode" />
  </div>
</template>
<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import Preview from '../preview/PrototypePutInstoragePreview'
import moment from 'moment'
import PrototypePutInstorageEdit from '@pages/storage/edit/PrototypePutInstorageEdit'
const columns = [
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'skuModel', width: 300 },
    { title: '入库数量', dataIndex: 'recN', width: 100, align: 'right', scopedSlots: { customRender: 'recN' } },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'center' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
    { title: '单位', dataIndex: 'skuUnit', width: 50 },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
]
export default {
    name: 'PrototypePutInstorage',
    components: { seachBox, NewTable, Preview, PrototypePutInstorageEdit },
    data () {
        return {
            pamsCode: '',
            selectedRowKeys: [], // 单据明细选中
            clientVisible: false,
            loading: false,
            columns,
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
                billStatus: 'bill_sample_entry_status:3'
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
            this.tableCode = '751d6594217e44339813ada0785f9d6d:PrototypePutInstorage'
            this.tableApiPath = 'SampleSampleEntryFindEntryConfirm'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
    },
    methods: {
        /**
             * @name:监听工具栏按钮
             */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('SampleSampleEntryFindEntryConfirm', this.seachValue)
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
                console.log(e, '66666666666666666666666666666666666666666666')
                this.pamsCode = e.code
                this.clientVisible = true
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
            }
        },
        /**
             * @name:右击表格
             */
        onContextmenuChange ({ billStatus }) {
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
            e.path = 'SampleSampleEntryFindEntryConfirm'
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
            this.$refs.newTable.setTableData('44d7ef7487e4475da92be5ff2d778976:PrototypePutInstorage', { path: 'SampleSampleEntryFindEntryConfirm' })
        },
        detailsSumbit (e) {
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
                this.getDate()
            }
        }
    }
}
</script>

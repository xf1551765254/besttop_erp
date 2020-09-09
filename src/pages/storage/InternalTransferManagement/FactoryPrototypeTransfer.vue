<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-22 16:53:54
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
    <FactoryPrototypeTransferEdit v-model="clientVisible" :title="title" :code="pamsCode"/>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
</style>
<script>
// import Goods from '@pages/storage/FactoryPrototypeManagement/contractGoods/skuStock'
import Preview from './preview/FactoryPrototypeTransferPreview'
import getStatus from '@comp/statusAll/getStatus'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import BtModal from '@comp/Modal'
import FactoryPrototypeTransferEdit from '@pages/storage/edit/FactoryPrototypeTransferEdit'
// 单据表格表头
const columns = [
    { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
    { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
    { title: '商品SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
    { title: '商品SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
    { title: '规格型号', dataIndex: 'skuModel', width: 200, align: 'center' },
    { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'center' },
    { title: '调拨数量', dataIndex: 'qtty', width: 150, align: 'center', scopedSlots: { customRender: 'qtty' } },
    { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'FactoryPrototypeTransfer',
    components: { seachBox, NewTable, BtModal, Preview, FactoryPrototypeTransferEdit },
    data () {
        return {
            pamsCode: '',
            previewVisbel: false,
            //  调出店
            dStoreCodeList: [],
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
                    title: '开始时间',
                    key: 'beginMakeTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'endMakeTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
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
                    key: 'makeUserno',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }
            ],
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'FactoryPrototypeTransfer.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'FactoryPrototypeTransfer.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '确认',
                    action: 'FactoryPrototypeTransfer.confirm',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '取消确认',
                    action: 'FactoryPrototypeTransfer.cancel',
                    fc: this.cancelTheConfirmation
                },
                {
                    name: '预览',
                    action: 'FactoryPrototypeTransfer.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
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
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            // 退库时间默认当天
            postDate: moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '438c9a4ea99248ff9ba85a7dc1e1295c:FactoryPrototypeTransfer'
            this.tableApiPath = 'SampleAllotFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_sample_allot_status', this.conditions[3])
        this.seachValue = {
            billStatus: 'bill_sample_allot_status:1',
            beginMakeTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
            endMakeTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    },
    methods: {
    /**
         * @name: 审核
         */
        auditSumbit (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否确认当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistributionBillAllotsPurchaseConfirmYj',
                        method: 'post',
                        body: {
                            id: e.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                }
            })
        },
        /**
         * @name: 取消确认
         * @msg:
         * @param {type}
         * @return:
         */
        cancelTheConfirmation (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否取消确认?',
                onOk () {
                    axios({
                        path: 'DistributionBillAllotsUpdateNoConfirm',
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
         * @name: 详情
         */
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name:选中客户数据
         */
        async onUserSelect (e) {
            console.log(e, '添加')
            const error = []
            e.forEach(item => {
                item.qtty = 1
                const list = this.billsData.filter(o => o.detailId === item.detailId)
                if (list.length === 0) {
                    this.billsData.unshift(item)
                } else {
                    error.push(item.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
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
            e.path = 'SampleAllotFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增', e)
                this.pamsCode = ''
                this.clientVisible = true
                this.title = '新增厂家样机调拨单'
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SampleAllotFind', this.seachValue)
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
                this.pamsCode = e.code
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
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
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
                        path: 'SampleAllotDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll = []
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 取消出库
         */
        cancelAffirm (e) {
            const that = this
            this.$confirm({
                title: '',
                content: '是否取消出库?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    axios({
                        path: 'SampleAllotUpdateNoConfirm',
                        method: 'post',
                        body: {
                            id: e.id,
                            makeStoreCode: that.$store.getters.storeInfo.code
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
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus)
            if (billStatus === 'bill_sample_allot_status:1') {
                this.disContextMenu = ['取消确认']
            } else if (billStatus === 'bill_sample_allot_status:2' || billStatus === 'bill_sample_allot_status:3') {
                this.disContextMenu = ['编辑', '确认', '删除', '取消确认']
            } else if (billStatus === 'bill_sample_allot_status:4') {
                this.disContextMenu = ['编辑', '删除', '确认']
            }
        },
        /**
         * @name: 单据新增行
         */
        addManage () {
            this.userSet.storeCode = this.form.getFieldValue('outStoreCode')
            this.userQuery = true
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
            this.$refs.newTable.setTableData('438c9a4ea99248ff9ba85a7dc1e1295c:FactoryPrototypeTransfer', { path: 'SampleAllotFind' })
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

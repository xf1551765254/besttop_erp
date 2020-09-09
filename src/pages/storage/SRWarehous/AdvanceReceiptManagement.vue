<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-21 15:11:06
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
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <AdvanceReceiptManagementEdit v-model="addEditModel" :title="title" :code="pamsCode" />
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
import getStatus from '@comp/statusAll/getStatus'
import Preview from './preview/AdvanceReceiptManagementPreview'
import AdvanceReceiptManagementEdit from '@pages/storage/edit/AdvanceReceiptManagementEdit'
export default {
    name: 'AdvanceReceiptManagement',
    components: {
        NewTable,
        SeachBox,
        Preview,
        AdvanceReceiptManagementEdit
    },
    data () {
        return {
            EditModel: false,
            pamsCode: '',
            title: '',
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
                    title: '单据状态',
                    type: 'select',
                    key: 'billStatus',
                    filter: true,
                    label: 'title',
                    value: ['type', 'configKey'],
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'makeUser',
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
                    type: 'date',
                    key: 'timeA'
                },
                {
                    title: '制单结束时间',
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
                    action: 'AdvanceReceiptManagement.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'AdvanceReceiptManagement.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'AdvanceReceiptManagement.verify',
                    fc: this.auditHandler
                },
                {
                    name: '预览',
                    action: 'AdvanceReceiptManagement.get',
                    fc: this.previewFun
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            rowId: '',
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'center' },
                { title: '发生数量', dataIndex: 'recN', width: 150, align: 'center', scopedSlots: { customRender: 'recN' } },
                { title: '品牌', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'center' },
                // { title: '条码', dataIndex: 'barCode', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ], // 表头
            categoryinfoData: [], // 表体
            orderId: '',
            tags: [],
            scroll: { x: 1550 },
            storeQuery: false,
            providerArr: [], // 供应商
            applicantArr: [], // 负责人
            providerId: '',
            pamsBounced: {},
            recTypeArr: [], // 类型
            storageType: 'receivableInAdvance',
            recTypeId: '',
            flag: false, // 标志位
            // 预览
            previewVisbel: false,
            flagObj: {},
            verificationStatusArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b1ef12b796cf4c05bdefeaecff6a09d1:AdvanceReceiptManagement'
            this.tableApiPath = 'DistributionBillPreEntryFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('bill_pre_entry_status', this.conditions[1])
        this.seachValue = {
            billStatus: 'bill_pre_entry_status:1',
            timeA: moment().subtract(7, 'days'),
            timeB: moment()
        }
    },
    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus)
            if (billStatus === 'bill_pre_entry_status:1') {
                this.disContextMenu = []
            } else if (billStatus === 'bill_pre_entry_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
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
                this.$refs.newTable.exportFile('DistributionBillPreEntryFind', this.seachValue)
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
            e.path = 'DistributionBillPreEntryFind'
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
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'DistributionBillPreEntryAudit',
                        method: 'post',
                        body: {
                            id: e.id,
                            sourceStoreCode: that.$store.getters.storeInfo.code
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
                const statusArr = map(this.selectArr, 'billStatus')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_pre_entry_status:2') {
                        this.$message.warning('选中数据存在已审核数据，不可删除')
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
                        path: 'DistributionBillPreEntryDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
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
                this.pamsCode = ''
                this.title = '新增预收/退货单'
                this.addEditModel = true
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEditModel = true
                this.pamsCode = index.code
            }
            // 打开modal
        }
    },
    watch: {
        addEditModel (val) {
            if (!val) {
                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
            }
        },
        providerId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flag) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    recDt: moment(),
                                    recType: 'bill_pre_entry_rec_type:1',
                                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                            },
                            onCancel () {
                                console.log(oldval)
                                that.providerId = oldval
                                that.form.setFieldsValue({ provider: oldval })
                            }
                        })
                    }
                }
                this.flag = false
            }
        },
        recTypeId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flag) {
                    if (val === 'bill_pre_entry_rec_type:1') {
                        this.storageType = 'receivableInAdvance'
                    } else {
                        this.storageType = 'salesReturn'
                    }
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    recDt: moment(),
                                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                            },
                            onCancel () {
                                console.log(oldval, '----------------')
                                that.recTypeId = oldval
                                that.form.setFieldsValue({ recType: oldval })
                            }
                        })
                    }
                }
                this.flag = false
            }
        }
    }
}
</script>

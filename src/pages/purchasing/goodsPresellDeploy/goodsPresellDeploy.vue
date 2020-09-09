<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-20 11:14:52
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      showOrganize
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <GoodsPresellDeployEdit v-model="EditModel" :title="title" :code="pamsCode" />
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
import GoodsPresellDeployEdit from '@pages/purchasing/purchasingEdit/GoodsPresellDeployEdit'
import Preview from '@pages/purchasing/goodsPresellDeploy/preview/goodsPresellDeployPreview'
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
const categoryinfoData = []
export default {
    name: 'GoodsPresellDeploy',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        Preview,
        GoodsPresellDeployEdit
    },
    data () {
        this.cacheData = categoryinfoData.map(item => ({ ...item }))
        return {
            title: '',
            pamsCode: '',
            previewVisbel: false,
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
                    // title: '审核状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_pre_sale_status' }
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
                },
                {
                    title: '制单开始时间',
                    type: 'date',
                    key: 'auditTimeA'
                },
                {
                    title: '制单结束时间',
                    type: 'date',
                    key: 'auditTimeB'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'goodsPresellDeploy.edit',
                    fc: this.editHandler
                },
                {
                    name: '审核',
                    action: 'goodsPresellDeploy.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'goodsPresellDeploy.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'goodsPresellDeploy.get',
                    fc: this.detailsSumbit
                }
            ],
            // 新增model
            addEditModel: false,
            EditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {},
            managerByArr: [], // 负责人
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            categoryinfoData, // 表体
            categoryinfoID: 0, // 行唯一
            rowId: '',
            scrollXY: {
                x: 1600
            },
            goodsQuery: false, // 是否开启弹窗
            multiple: true, // 是否多选模式，可选，默认单选。
            pams: {}, // 条件，可选
            addEdit: '', // 控制新增编辑
            disContextMenu: [], // 右键菜单的name
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            orderId: '',
            tags: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '97fb0af72b7a44c8a4e3ef37f70d48a1:goodsPresellDeploy'
            this.tableApiPath = 'BillSaleFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('bill_pre_sale_status', this.conditions[1])
        this.seachValue = {
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment(),
            status: 'bill_pre_sale_status:1'
        }
        this.BaseMessageObjManagerBy()
    },
    computed: {
        signDtDefaultValue () {
            return moment()
        }
    },

    methods: {
        detailsSumbit (e) {
            console.log(e, '详情')
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 获取负责人
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjManagerBy () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.managerByArr = [...data]
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
            if (status === 'bill_pre_sale_status:1') {
                this.disContextMenu = []
            } else if (status === 'bill_pre_sale_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().subtract({ days: 1 }))
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
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('BillSaleFind', this.seachValue)
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
            e.path = 'BillSaleFind'
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
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (e) {
            this.addData(e)
            this.rowId = e.id
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const arr = []
            arr.push(e.id)
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'BillSaleAudit',
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
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    if (statusArr[item] === 'bill_pre_sale_status:2') {
                        this.$message.warning('选中数据存在已审核数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'BillSaleDelete',
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
                // this.addEdit = 'add'
                // this.orderId = ''
                // this.tags = []
                // this.addEmpty()
                this.title = '新增商品预售配置单'
                this.pamsCode = ''
            } else {
                /**
                 * 编辑
                 */
                // this.addEdit = 'edit'
                // this.editAssign(index)
                this.pamsCode = index.code
            }
            // 打开modal
            this.EditModel = true
        },
        /**
         * @name: 新增清空
         * @msg:
         * @param {type}
         * @return:
         */
        addEmpty () {
            this.BaseMessageObj = {
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            this.BaseMessageObj.expectedArrivalDate = this.signDtDefaultValue
            this.BaseMessageObj.type = 1
            this.categoryinfoData = []
        },
        /**
         * @name: 编辑赋初值操作
         * @msg:
         * @param {type}
         * @return:
         */
        editAssign (e) {
            const arr = { ...e }
            this.categoryinfoData = []
            arr.expectedArrivalDate = moment(arr.expectedArrivalDate)
            arr.type = Number(arr.type)
            arr.createBy = `${arr.createBy}-${arr.createName}`
            this.BaseMessageObj = arr
            this.orderId = arr.code
            this.tags = ['uncheck']
            axios({
                path: 'BillSaleDetailFindDetail',
                method: 'post',
                body: {
                    preSaleId: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list

                    arr.forEach(i => {
                        this.categoryinfoID++
                        i.tbWebId = i.skuCode + i.storeId
                    })
                    this.categoryinfoData = arr
                }
            })
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
            const newData = [...this.categoryinfoData]
            if (newData.length === 0) {
                return this.$message.error('您没有添加商品信息')
            }
            for (const i of newData) {
                if (!i.preSaleQuantity || i.preSaleQuantity === '0') {
                    return this.$message.warning(`商品名称为${i.skuName}预售数量有误，请输入预售数量!`)
                }
            }
            validateFields((err, values) => {
                if (!err) {
                    this.submitLoading = true
                    values.storeCode = this.$store.getters.storeInfo.code
                    if (this.addEdit === 'add') {
                        const saveArr = Object.assign(values, { billPreSaleDetails: newData })
                        axios({
                            path: 'BillSaleAdd',
                            method: 'post',
                            body: saveArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        const saveArr = Object.assign(values, { id: this.rowId }, { billPreSaleDetails: newData })
                        axios({
                            path: 'BillSaleUpdate',
                            method: 'post',
                            body: saveArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
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
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            this.goodsQuery = true
            this.$refs.goodsRef.delForm()
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (tbWebId) {
            if (tbWebId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].tbWebId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.tbWebId !== tbWebId)
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        /**
         * @name: 搜索弹框事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (arr) {
            this.categoryinfoSelectedRowKeys = []
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        tbWebId: i.skuCode,
                        storeName: i.storeName,
                        storeId: i.storeCode,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        model: i.model,
                        currentNumber: i.currentNumber,
                        preSaleQuantity: 0,
                        note: i.note
                    })
                } else {
                    error.push(i.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        }
    },
    watch: {
        EditModel (val) {
            if (!val) {
                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
            }
        }
    }
}
</script>

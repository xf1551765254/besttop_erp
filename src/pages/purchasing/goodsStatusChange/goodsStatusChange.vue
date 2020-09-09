<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-05 17:41:30
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
    <bt-modal
      v-model="addEditModel"
      title="商品状态变更单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="chargeUsernoArr"
                placeholder="请选择负责人"
                :filterOption="filterOption"
                :getPopupContainer="trigger => trigger.parentNode"
                showSearch
                v-decorator="$check('billChange.chargeUserno',{initialValue:this.BaseMessageObj.chargeUserno})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">采购员</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="chargeUsernoArr"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请选择采购员"
                :filterOption="filterOption"
                v-decorator="$check('billChange.purchaseUser',{initialValue:this.BaseMessageObj.purchaseUser})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billChange.makeStoreCode',{initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billChange.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">订单详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd">新增</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" type="danger">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="tbWebId"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          :pagination="false"
          size="small"
          bordered
          :scroll="scrollXY"
        >
          <template v-for="col in ['type','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-select
                v-if="col === 'type'"
                :defaultValue="record.type"
                :options="typeArr"
                @focus="e => focusChange(e, record.tbWebId, col)"
                :getPopupContainer="trigger => trigger.parentNode"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.tbWebId, col)"
              />
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.tbWebId)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billChange.createBy', {initialValue: BaseMessageObj.createBy || `${$store.getters.code}-${$store.getters.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                :disabledDate="signDtDisabledDate"
                style="width: 100%"
                disabled
                v-decorator="$check('billChange.createTime',{initialValue:BaseMessageObj.createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
      <goods :visible.sync="goodsQuery" :pams="pams" @onSelect="onSelect" multiple/>
    </bt-modal>
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
import Preview from '@pages/purchasing/goodsStatusChange/preview/goodsStatusChangePreview'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import map from 'lodash.map'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
import goods from '@pages/purchasing/goodsStatusChange/goods'
const categoryinfoData = []
export default {
    name: 'GoodsStatusChange',
    components: {
        NewTable,
        SeachBox,
        goods,
        BtModal,
        Preview
    },
    data () {
        this.cacheData = categoryinfoData.map(item => ({ ...item }))
        return {
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
                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_change_status' }
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
                    action: 'goodsStatusChange.edit',
                    fc: this.editHandler
                },
                {
                    name: '审核',
                    action: 'goodsStatusChange.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'goodsStatusChange.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'goodsStatusChange.get',
                    fc: this.detailsSumbit
                }
            ],
            // 新增model
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {},
            chargeUsernoArr: [],
            typeArr: [],
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            categoryinfoColumns: [ // 采购订单详情表头
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 90 },
                { title: 'SKU名称', dataIndex: 'name', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'model', align: 'center', width: 250 },
                { title: '税率', dataIndex: 'taxRates', align: 'center', width: 100 },
                { title: '零售价', dataIndex: 'price', align: 'center', width: 100 },
                { title: '含税成本价', dataIndex: 'priceCost', align: 'center', width: 100 },
                { title: '变动类型', dataIndex: 'type', align: 'center', width: 150, scopedSlots: { customRender: 'type' } },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
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
            typeB: '',
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            orderId: '',
            tags: [],
            typeArrSave: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '543761fe5b2644a18b6758bca84231e3:goodsStatusChange'
            this.tableApiPath = 'BillChangeFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('bill_change_status', this.conditions[1])
        this.seachValue = {
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment(),
            status: 'bill_change_status:1'
        }
        this.BaseMessageObjChargeUserno()
        this.BaseMessageObjType()
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
        focusChange (val, count, key) {
            console.log(val, count, key)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                if (target.status === 'base_sku_status:2') {
                    this.typeArr = this.statusFun(['bill_change_detail_type:1', 'bill_change_detail_type:2', 'bill_change_detail_type:3', 'bill_change_detail_type:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:3') {
                    this.typeArr = this.statusFun(['bill_change_detail_type:4', 'bill_change_detail_type:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:4') {
                    this.typeArr = this.statusFun(['bill_change_detail_type:4', 'bill_change_detail_type:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:6') {
                    this.typeArr = this.statusFun(['bill_change_detail_type:4', 'bill_change_detail_type:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:1' || target.status === 'base_sku_status:5') {
                    this.typeArr = this.typeArrSave
                }
            }
        },
        statusFun (e, arr) {
            const itemArr = []
            for (const j of e) {
                for (const i of arr) {
                    if (i.value === j) {
                        itemArr.push(i)
                    }
                }
            }
            console.log(itemArr, '=============')
            return itemArr
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_change_status:1') {
                this.disContextMenu = []
            } else if (status === 'bill_change_status:2') {
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
                this.$refs.newTable.exportFile('BillChangeFind', this.seachValue)
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
            e.path = 'BillChangeFind'
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
            if (e.status === 'bill_change_status:2') {
                this.$message.error('单据已审核,不可编辑')
            } else {
                this.addData(e)
                this.rowId = e.id
            }
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'BillChangeAudit',
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
                    if (statusArr[item] === 'bill_change_status:2') {
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
                        path: 'BillChangeDelete',
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
                this.addEdit = 'add'
                this.orderId = ''
                this.tags = []
                this.addEmpty()
            } else {
                /**
                 * 编辑
                 */
                this.addEdit = 'edit'
                this.editAssign(index)
            }
            // 打开modal
            this.addEditModel = true
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
                path: 'BillChangeDetailFind',
                method: 'post',
                body: {
                    changeCode: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        this.categoryinfoID++
                        i.tbWebId = this.categoryinfoID++
                        i.taxRates = this.rateTransform(i.taxRate)
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
                this.$message.error('您没有添加商品信息')
                return
            }
            for (const i of newData) {
                if (!i.type) {
                    return this.$message.warning(`商品编码为${i.skuCode}未选择变更类型，请选择变更类型！`)
                }
            }
            validateFields((err, values) => {
                values.makeStoreCode = this.$store.getters.storeInfo.code
                values.createBy = this.$store.getters.code

                if (!err) {
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        axios({
                            path: 'BillChangeAdd',
                            method: 'post',
                            body: {
                                billChange: values,
                                billChangeDetailList: newData
                            },
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        const saveArr = Object.assign(values, { id: this.rowId })
                        axios({
                            path: 'BillChangeUpdate',
                            method: 'post',
                            body: {
                                billChange: saveArr,
                                billChangeDetailList: newData
                            },
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
         * @name: 获取负责人
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjChargeUserno () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.code}-${i.name}`
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.chargeUsernoArr = [...data]
                }
            })
        },
        /**
         * @name: 获取商品类型
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_change_detail_type',
                    orderbyField: 'keySort'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.typeArr = [...data]
                    this.typeArrSave = [...data]
                    console.log(this.typeArr, '类型')
                }
            })
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            this.goodsQuery = true
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
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                const has = this.categoryinfoData.filter(o => o.skuCode === i.code)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        tbWebId: i.code,
                        skuCode: i.code,
                        name: i.name,
                        model: i.model,
                        taxRates: this.rateTransform(i.taxRate),
                        taxRate: i.taxRate,
                        price: i.price,
                        priceCost: i.ptCost,
                        status: i.status

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
        '$store.state.app.pageName' (val) {
            if (val === 'goodsStatusChange') {
                this.BaseMessageObjChargeUserno()
                this.BaseMessageObjType()
            }
        }
    }
}
</script>

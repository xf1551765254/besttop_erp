<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 10:24:11
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
      :title="title"
      :popconfirm="false"
      :orderId="orderId"
      :tags="tags"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">调出位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索调出位置"
                :options="distributionCenterArr"
                @change="theGoodsLocation"
                @search="LocationSearch"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('billAllotC.sourceStoreCode',{initialValue:BaseMessageObj.sourceStoreCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">调入位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索调入位置"
                :options="distributionCenterArr"
                @search="LocationSearch"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('billAllotC.destinationStoreCode',{initialValue:BaseMessageObj.destinationStoreCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billAllotC.makeStoreId', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索负责人"
                :options="applicantArr"
                showSearch
                allowClear
                :filterOption="false"
                style="width:100%"
                @search="applicantSearch"
                v-decorator="$check('billAllotC.chargeBy',{initialValue:BaseMessageObj.chargeBy})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billAllotC.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">商品详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="goodsAdd(1)">选择调拨商品</a-button>
          <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)">删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          :pagination="false"
          size="small"
          bordered
          :scroll="scroll">
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:100px">总数量：</span>
            <span>{{ totalQuantity }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-for="col in ['qtty','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'qtty'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChange(e.target.value, record.skuCode, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billAllotC.createBy', {initialValue: BaseMessageObj.createBy || `${this.$store.getters.code}-${this.$store.getters.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billAllotC.createTime', {initialValue:BaseMessageObj.createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsBounced :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="onSelectBounced"/>
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
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import moment from 'moment'
import goodsBounced from './popUp/goodsBounced'
import Preview from './preview/allotInteriorPreview'
import getStatus from '@comp/statusAll/getStatus'
import is from 'is_js'
export default {
    name: 'AllotInterior',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        goodsBounced,
        Preview
    },
    data () {
        return {
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
                    title: '审核人',
                    key: 'auditBy',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
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
                    action: 'allotInterior.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'allotInterior.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '确认',
                    action: 'allotInterior.confirm',
                    fc: this.auditHandler
                },
                {
                    name: '取消确认',
                    action: 'allotInterior.cancel',
                    fc: this.cancelTheConfirmation
                },
                {
                    name: '预览',
                    action: 'allotInterior.get',
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
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '调拨数量', dataIndex: 'qtty', width: 100, scopedSlots: { customRender: 'qtty' } },
                { title: '现库存', dataIndex: 'curNumber', align: 'right', width: 80 },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 50 },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', align: 'center', width: 100, scopedSlots: { customRender: 'action' } }
            ], // 表头
            categoryinfoData: [], // 表体
            orderId: '',
            tags: [],
            scroll: { x: 1650, y: 350 },
            storeQuery: false,
            distributionCenterArr: [], // 收获位置
            applicantArr: [], // 负责人
            theGoodsLocationId: '',
            pamsBounced: {},
            totalQuantity: '0',
            // retailPrice: '0.00', // 零售价
            // costPrice: '0.00', // 成本价
            // 预览
            previewVisbel: false,
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'aa1927bf109c48439e0f234b9b9df9a4:allotInterior'
            this.tableApiPath = 'DistributionBillAllotsFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.distributionCenter()
        this.applicant()
        getStatus('bill_allot_status', this.conditions[2])
        this.seachValue = {
            billStatus: 'bill_allot_status:1',
            auditTimeA: moment().subtract(7, 'days'),
            auditTimeB: moment()
        }
    },
    methods: {
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
                        path: 'DistributionBillAllotsPurchaseWithdraw',
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
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 总计
         * @msg:
         * @param {type}
         * @return:
         */
        total () {
            const { add, mul } = this.$math
            const totalArr = [...this.categoryinfoData]
            const totalQuantityArr = []
            // const retailPriceArr = []
            // const costPriceArr = []
            for (const item of totalArr) {
                totalQuantityArr.push(item.qtty)
                // retailPriceArr.push(mul(item.price, item.qtty, 2))
                // costPriceArr.push(mul(item.priceCost, item.qtty, 2))
            }
            this.totalQuantity = totalQuantityArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            // this.retailPrice = retailPriceArr.reduce(function (prev, cur) {
            //     return add(prev, cur, 2)
            // }, 0)
            // this.costPrice = costPriceArr.reduce(function (prev, cur) {
            //     return add(prev, cur, 2)
            // }, 0)
        },
        onSelectBounced (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        skuModel: i.model,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        skuUnit: i.basicUnit,
                        curNumber: i.curNumber,
                        qtty: 0
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
            this.totalQuantity = '0'
            // this.retailPrice = '0.00'
            // this.costPrice = '0.00'
            this.total()
        },
        theGoodsLocation (e) {
            this.theGoodsLocationId = e
            this.BaseMessageObj = {
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')

            }
            this.categoryinfoData = []
        },
        goodsAdd (e) {
            if (!this.theGoodsLocationId) {
                this.$message.warning('请选择调出位置！')
            } else {
                this.storeQuery = true
                this.pamsBounced = {
                    storeCode: this.theGoodsLocationId
                }
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
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const newData = [...this.categoryinfoData]
                if (newData.length === 0) {
                    this.$message.warning(`请添加需要调拨商品!`)
                    return
                }
                for (const i of newData) {
                    if (i.qtty === 0) {
                        this.$message.warning(`商品编码为${i.skuCode}实配数量为0，请输入实配数量!`)
                        return
                    } else if (i.curNumber === 0 || !i.curNumber) {
                        return this.$message.warning(`商品编码为${i.skuCode}现库存为0，不能提交!`)
                    }
                }
                if (values.sourceStoreCode === values.destinationStoreCode) {
                    return this.$message.warning(`调入位置和调出位置不能相同!`)
                }
                let addArr = {}
                values.makeStoreId = this.$store.getters.storeInfo.code
                values.createBy = this.$store.getters.code
                values.chargeBy = values.chargeBy ? values.chargeBy.split('-')[0] : ''
                values.sourceStoreCode = values.sourceStoreCode.split('-')[0]
                values.destinationStoreCode = values.destinationStoreCode.split('-')[0]
                addArr = Object.assign(values, { billAllotDetails: newData }, { sourceType: 'allot_source_type:1' })
                if (this.addEdit === 'edit') {
                    addArr = Object.assign(addArr, { id: this.rowId })
                } else {
                    addArr = Object.assign(addArr, { billType: 'bill_allot_type:1' })
                }
                if (!err) {
                    this.submitLoading = true
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionBillAllotsAdd' : 'DistributionBillAllotsUpdate',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                            this.categoryinfoData = []
                        }
                    })
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
        onContextmenuChange (e) {
            console.log(e.billStatus)
            if (e.billStatus === 'bill_allot_status:1') {
                this.disContextMenu = ['取消确认']
            } else if (e.billStatus === 'bill_allot_status:2' || e.billStatus === 'bill_allot_status:3') {
                this.disContextMenu = ['编辑', '删除', '确认', '取消确认']
            } else if (e.billStatus === 'bill_allot_status:4') {
                this.disContextMenu = ['编辑', '删除', '确认']
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
                this.$refs.newTable.exportFile('DistributionBillAllotsFind', this.seachValue)
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
            e.path = 'DistributionBillAllotsFind'
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
                content: '是否确认当前信息?',
                onOk () {
                    axios({
                        path: 'DistributionBillAllotsPurchaseConfirm',
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
                    if (statusArr[item] === 'bill_allot_status:2') {
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
                        path: 'DistributionBillAllotsDelete',
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
                this.addEdit = 'add'
                this.BaseMessageObj = {
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    chargeBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.title = '新增调拨单'
                this.orderId = ''
                this.tags = []
                this.theGoodsLocationId = ''
                this.categoryinfoData = []
                this.totalQuantity = '0'
                // this.retailPrice = '0.00'
                // this.costPrice = '0.00'
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.rowId = index.id
                const arr = { ...index }
                arr.createBy = `${arr.createBy}-${arr.createByName}`
                arr.sourceStoreCode = `${arr.sourceStoreCode}-${arr.sourceStoreName}`
                arr.destinationStoreCode = `${arr.destinationStoreCode}-${arr.destinationStoreName}`
                arr.chargeBy = arr.chargeBy ? `${arr.chargeBy}-${arr.chargeByName}` : ''
                this.BaseMessageObj = arr
                this.addEdit = 'edit'
                this.title = '编辑调拨单'
                this.orderId = ''
                this.tags = ['uncheck']
                this.theGoodsLocationId = index.sourceStoreCode
                this.editTheDetails(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        /**
         * @name: 编辑详情
         * @msg:
         * @param {type}
         * @return:
         */
        editTheDetails (e) {
            console.log('编辑', e)
            axios({
                path: 'DistributionBillAllotsFindDetail',
                method: 'post',
                body: {
                    code: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('编辑详情', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.index = this.indexNumber++
                    })
                    this.categoryinfoData = data
                    this.total()
                }
            })
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (skuCode) {
            console.log(skuCode)
            if (skuCode === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.skuCode !== skuCode)
            }
            this.total()
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isAfter()
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            if (col === 'qtty') {
                if (!val || is.not.number(val) || val < 0) return
            }
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[col] = val
                if (Number(target.qtty) > Number(target.curNumber)) {
                    this.$message.warning(`${target.skuName}商品的sku库存量为${target.curNumber}，不能配出${target.qtty}，请重新输入`)
                    target.qtty = 0
                }
                this.categoryinfoData = newData
                this.total()
            }
        },
        LocationSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    code: this.$store.getters.storeInfo.code,
                    condition: e,
                    status: '0',
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'OrganizationStoreFindStoreAndDirect',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.distributionCenterArr = [...data]
                    }
                })
            }, 300)
        },
        applicantSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'PermissionsUserFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.applicantArr = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 获取收获位置
         * @msg:
         * @param {type}
         * @return:
         */
        distributionCenter () {
            // axios({
            //     path: 'OrganizationStoreFindStoreAndDirect',
            //     method: 'post',
            //     body: {
            //         code: this.$store.getters.storeInfo.code,
            //         status: 0
            //     },
            //     headers: {}
            // }).then(res => {
            //     if (res.flag === 1) {
            //         console.log('获取收获位置', res.data)
            //         const arr = res.data
            //         arr.forEach(i => {
            //             i.key = i.code
            //             i.title = `${i.code}-${i.name}`
            //             i.value = i.code
            //         })
            //         this.distributionCenterArr = [...arr]
            //     }
            // })
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        applicant () {
            // axios({
            //     path: 'PermissionsUserFindOption',
            //     method: 'post',
            //     body: {},
            //     headers: {}
            // }).then(res => {
            //     if (res.flag === 1) {
            //         console.log('获取负责人', res.data)
            //         const data = res.data
            //         data.forEach(i => {
            //             i.key = i.code
            //             i.title = `${i.code}-${i.name}`
            //             i.value = i.code
            //         })
            //         this.applicantArr = [...data]
            //     }
            // })
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'allotInterior') {
                this.distributionCenter()
                this.applicant()
            }
        },
        addEditModel (val) {
            if (!val) {
                this.indexNumber = 1
                this.BaseMessageObj = {}
                this.categoryinfoData = []
            }
        }
    }
}
</script>

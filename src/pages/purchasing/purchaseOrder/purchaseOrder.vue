<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-28 15:08:13
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
    <bt-modal
      v-model="addEditModel"
      title="采购订单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="handleSubmit">
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                ref="noteA"
                @change="onChangeNoteA"
                @search="priverSearch"
                :getPopupContainer="trigger => trigger.parentNode"
                :filterOption="false"
                placeholder="请选择供应商"
                :options="noteAArr"
                v-decorator="$check('BillOrber.noteA',{initialValue:BaseMessageObj.noteA})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">合同编码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                ref="contractCode"
                showSearch
                :getPopupContainer="trigger => trigger.parentNode"
                @change="onChangeContractCode"
                :filterOption="filterOption"
                placeholder="请选择合同编码"
                :options="contractCodeArr"
                v-decorator="$check('BillOrber.contractCode',{initialValue:BaseMessageObj.contractCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                :getPopupContainer="trigger => trigger.parentNode"
                :filterOption="filterOption"
                :options="receiveStoreCode"
                placeholder="请选择收货位置"
                v-decorator="$check('BillOrber.receiveStoreCode',{initialValue:BaseMessageObj.receiveStoreCode})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">采购类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="commodityType"
                @change="onChangeType"
                :getPopupContainer="trigger => trigger.parentNode"
                v-decorator="$check('BillOrber.type',{initialValue:BaseMessageObj.type})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('BillOrber.expectedArrivalDate',{initialValue:BaseMessageObj.expectedArrivalDate})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货联系人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                placeholder="请输入收货联系人"
                v-decorator="$check('BillOrber.noteB',{initialValue:BaseMessageObj.noteB})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联系电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%;"
                placeholder="请输入联系电话"
                v-decorator="$check('BillOrber.noteC',{initialValue:BaseMessageObj.noteC})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('BillOrber.note',{initialValue:BaseMessageObj.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
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
          size="small"
          :pagination="false"
          bordered
          :scroll="scrollXY"
        >
          <template slot="footer">
            <h3 style="display:inline;">总计</h3>
            <span style="margin-left:60px">订货数量 :</span>
            <span>{{ orderGoodsNumber }}</span>
            <span style="margin-left:120px">订货金额 ：</span>
            <span>{{ sumChangeM(orderGoodsNumberSum) }}</span>
            <span style="margin-left:120px">订货金额(不含税) ：</span>
            <span>{{ sumChangeM(orderGoodsNumberSumNo) }}</span>
          </template>
          <template v-for="col in [ 'skuDRate','purchasePrice', 'pricePre','orderQuantity','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'skuDRate'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                :value="text"
                :precision="2"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input-number
                v-else-if="col === 'purchasePrice'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input-number
                v-else-if="col === 'pricePre'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input-number
                v-else-if="col === 'orderQuantity'"
                style="margin: -5px 0;width:100%;"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.tbWebId, col)"
              />
              <span v-else>{{ text }}</span>
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
                v-decorator="$check('BillPrice.createBy', {initialValue:BaseMessageObj.createBy || `${$store.getters.code}-${$store.getters.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('BillOrber.createTime',{initialValue:BaseMessageObj.createTime})"/>
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
import Preview from '@pages/purchasing/purchaseOrder/preview/purchaseOrderPreview'
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
import goods from '@pages/purchasing/purchaseOrder/goods'
const categoryinfoData = []
export default {
    name: 'PurchaseOrder',
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
                    // title: '审核状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_order_status' }
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
                    title: '供应商',
                    type: 'select',
                    key: 'providerCode',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
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
                    action: 'purchaseOrder.edit',
                    fc: this.editHandler
                },
                {
                    name: '审核',
                    action: 'purchaseOrder.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'purchaseOrder.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'purchaseOrder.get',
                    fc: this.detailsSumbit
                }
            ],
            // 新增model
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {
                noteA: '',
                contractCode: '',
                receiveStoreCode: '',
                type: '',
                expectedArrivalDate: '',
                noteB: '',
                noteC: '',
                note: ''
            },
            noteAArr: [],
            flagId: false,
            contractCodeArr: [],
            receiveStoreCode: [],
            commodityType: [],
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            categoryinfoColumns: [ // 采购订单详情表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'left', width: 90, scopedSlots: { customRender: 'skuCode' } },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'left', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'left', width: 300 },
                { title: '订包装量', dataIndex: 'orderQuantity', align: 'right', width: 100, scopedSlots: { customRender: 'orderQuantity' } },
                { title: '预估售价', dataIndex: 'pricePre', align: 'right', width: 100, scopedSlots: { customRender: 'pricePre' } },
                { title: '采购价', dataIndex: 'purchasePrice', align: 'right', width: 100 },
                { title: '订货额', dataIndex: 'stockPrice123', align: 'right', width: 100 },
                { title: '毛利额', dataIndex: 'orderQuantity11', align: 'right', width: 100 },
                { title: '毛利率', dataIndex: 'saleNWee411', align: 'right', width: 100 },
                { title: '每包含量', dataIndex: 'orderPack', align: 'right', width: 100 },
                { title: '税率', dataIndex: 'skuTaxRates', align: 'right', width: 100 },
                { title: '月返点', dataIndex: 'normalRebates', align: 'right', width: 100 },
                { title: '订货总量', dataIndex: 'orderGoodsGross', align: 'right', width: 100 },
                { title: '现库存', dataIndex: 'nowStock', align: 'right', width: 100 },
                { title: '商品条码', dataIndex: 'barcode', align: 'left', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', align: 'left', width: 50 },
                { title: '月销量', dataIndex: 'name11', align: 'right', width: 100 },
                { title: '倒1周', dataIndex: 'saleNWeek1', align: 'right', width: 100 },
                { title: '倒2周', dataIndex: 'saleNWeek2', align: 'right', width: 100 },
                { title: '倒3周', dataIndex: 'saleNWeek3', align: 'right', width: 100 },
                { title: '倒4周', dataIndex: 'saleNWeek4', align: 'right', width: 100 },
                { title: '可预售天数', dataIndex: 'safeDays', align: 'right', width: 100 },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData, // 表体
            rowId: '',
            noteAId: '',
            contractId: '',
            scrollXY: {
                x: 3050,
                y: 350
            },
            goodsQuery: false, // 是否开启弹窗
            multiple: true, // 是否多选模式，可选，默认单选。
            pams: {}, // 条件，可选
            addEdit: '', // 控制新增编辑
            disContextMenu: [], // 右键菜单的name
            seachValue: {
                auditTimeA: moment().subtract({ months: 7 }),
                auditTimeB: moment()
            },
            orderId: '',
            contractCodeId: '',
            typeId: '',
            tags: [],
            orderGoodsNumber: '0', // 订货数量
            orderGoodsNumberSum: '0', // 订货金额
            orderGoodsNumberSumNo: '0', // 订货金额未税
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '15099c3dedcc4cc3a7b6b3c2858ab34a:purchaseOrder'
            this.tableApiPath = 'BillOrderFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('bill_order_status', this.conditions[1])
        this.seachValue = {
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment(),
            status: 'bill_order_status:1'
        }
        this.BaseMessageObjReceiveStoreCode()
        this.BaseMessageObjCommodityType()
    },
    computed: {
        signDtDefaultValue () {
            return moment().add({ days: 1 })
        }
    },

    methods: {
        onChangeType (e) {
            this.flagId = true
            this.typeId = e
        },
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
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
         * @name: 总计
         * @msg:
         * @param {type}
         * @return:
         */
        total () {
            const { add, div } = this.$math
            const totalArr = [...this.categoryinfoData]
            if (totalArr.length === 0) {
                this.orderGoodsNumber = 0
                this.orderGoodsNumberSum = 0
                this.orderGoodsNumberSumNo = 0
                return
            }
            const salesReturnNumberArr = []
            const orderGoodsNumberSumArr = []
            const orderGoodsNumberSumNoArr = []
            for (const item of totalArr) {
                salesReturnNumberArr.push(item.orderGoodsGross)
                orderGoodsNumberSumArr.push(item.stockPrice123)
                orderGoodsNumberSumNoArr.push(div(item.stockPrice123, add(1, item.skuTaxRate, 2), 2))
            }
            this.orderGoodsNumber = salesReturnNumberArr.reduce(function (prev, cur) {
                return add(prev, cur, 0)
            }, 0)
            this.orderGoodsNumberSum = orderGoodsNumberSumArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.orderGoodsNumberSumNo = orderGoodsNumberSumNoArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
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
            if (status === 'bill_order_status:1') {
                this.disContextMenu = []
            } else if (status === 'bill_order_status:2') {
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
            return moment(e).isBefore(moment().startOf('day'))
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
                this.$refs.newTable.exportFile('BillOrderFind', this.seachValue)
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
            e.path = 'BillOrderFind'
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
            if (e.status === 'bill_order_status:2') {
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
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'BillOrderAudit',
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
        onChangeNoteA (idH) {
            console.log(idH)
            this.flagId = true
            this.noteAId = idH
            if (this.categoryinfoData.length === 0) {
                if (!idH) {
                    this.contractCodeArr = []
                } else {
                    this.BaseMessageObjContractCode(idH)
                }
                this.form.setFieldsValue({ contractCode: '' })
            }
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
                    if (statusArr[item] === 'bill_order_status:2') {
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
                        path: 'BillOrderDelete',
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
                this.categoryinfoData = []
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
            this.orderGoodsNumber = 0
            this.orderGoodsNumberSum = 0
            this.orderGoodsNumberSumNo = 0
            this.BaseMessageObj.expectedArrivalDate = this.signDtDefaultValue
            this.BaseMessageObj.type = 'commodity_type:1'
            this.BaseMessageObj.receiveStoreCode = `${this.$store.getters.storeInfo.code}-${this.$store.getters.storeInfo.name}`
            this.categoryinfoData = []
        },
        /**
         * @name: 编辑赋初值操作
         * @msg:
         * @param {type}
         * @return:
         */
        editAssign (e) {
            console.log(e)
            this.categoryinfoData = []
            const arr = { ...e }
            this.orderId = arr.code
            this.typeId = arr.type
            this.tags = ['uncheck']
            this.contractCodeId = e.providerContractId
            this.BaseMessageObjContractCode(arr.noteA)
            arr.expectedArrivalDate = moment(arr.expectedArrivalDate)
            arr.createBy = `${e.createBy}-${e.createName}`
            arr.noteA = `${e.noteA}-${e.noteName}`
            arr.receiveStoreCode = `${e.receiveStoreCode}-${e.receiveStoreName}`
            this.BaseMessageObj = arr
            this.noteAId = arr.noteA
            axios({
                path: 'BillOrderDetailFindDetail',
                method: 'post',
                body: {
                    orderCode: e.code
                },
                headers: {}
            }).then(res => {
                console.log(res.data)
                if (res.flag === 1) {
                    const arr = res.data.list
                    const { add, mul, div, sub } = this.$math
                    arr.forEach(i => {
                        i.index = this.indexNumber++
                        const monthlySales = add(add(i.saleNWeek1, i.saleNWeek2, 0), add(i.saleNWeek3, i.saleNWeek4, 0), 0)// 月销量
                        const theTotalOrder = mul(i.orderPack, i.orderQuantity, 0)// 订货总量
                        i.orderGoodsGross = theTotalOrder
                        const theTotalAmountOfTheOrder = mul(theTotalOrder, i.pricePre, 2)// 订货总额
                        const grossProfitMargin = sub(theTotalAmountOfTheOrder, mul(theTotalOrder, i.purchasePrice), 2)// 毛利
                        const grossProfitRate = div(grossProfitMargin, theTotalAmountOfTheOrder, 2)// 毛利率
                        let presell = ''
                        console.log(monthlySales)
                        if (monthlySales === '0') {
                            console.log('可预售天数')
                            presell = 0// 可预售天数
                        } else {
                            presell = div(theTotalOrder, div(monthlySales, 28, 0), 0)// 可预售天数
                        }
                        i.tbWebId = i.skuCode
                        i.stockPrice123 = mul(theTotalOrder, i.purchasePrice, 2)
                        i.safeDays = presell
                        i.orderQuantity11 = grossProfitMargin
                        if (!grossProfitRate) {
                            i.saleNWee411 = 0
                        } else {
                            i.saleNWee411 = grossProfitRate
                        }
                        i.name11 = monthlySales
                        i.skuTaxRates = this.rateTransform(i.skuTaxRate)
                        i.normalRebates = this.rateTransform(i.normalRebate)
                    })
                    this.categoryinfoData = arr
                    this.total()
                }
            })
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const newData = [...this.categoryinfoData]
                if (newData.length === 0) {
                    this.$message.error('您没有添加商品信息')
                    return
                }
                values.expectedArrivalDate = moment(values.expectedArrivalDate).format('YYYY-MM-DD')
                values.receiveStoreCode = values.receiveStoreCode.split('-')[0]
                if (!err) {
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        values.createBy = this.$store.getters.code
                        axios({
                            path: 'BillOrderAdd',
                            method: 'post',
                            body: {
                                billOrder: values,
                                billOrderDetails: newData
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
                        saveArr.noteA = saveArr.noteA.split('-')[0]
                        saveArr.createBy = saveArr.createBy.split('-')[0]
                        axios({
                            path: 'BillOrderUpdate',
                            method: 'post',
                            body: {
                                billOrder: saveArr,
                                billOrderDetails: newData
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
        priverSearch (e) {
            console.log(e, '555555555555555')
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'CustomerSupplierFindOption',
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
                        this.noteAArr = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 获取合同编码
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjContractCode (id) {
            axios({
                path: 'ProviderSelectByProvider',
                method: 'post',
                body: {
                    providerCode: id,
                    businessType: 'provider_contract_business_type:1'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.providerContractName}`
                        i.value = i.code
                    })
                    this.contractCodeArr = [...data]
                }
            })
        },
        /**
         * @name: 获取收货位置
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjReceiveStoreCode () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.receiveStoreCode = [...data]
                    console.log(this.receiveStoreCode, '555555555555')
                }
            })
            console.log(this.receiveStoreCode, '55555555555577777777777777777777777777777777777777777777777777777777')
        },
        /**
         * @name: 获取商品类型
         * @msg:
         * @param {type}
         * @return:
         */
        BaseMessageObjCommodityType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'commodity_type'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.title = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.commodityType = [...data]
                }
            })
        },
        onChangeContractCode (idH, idE) {
            this.flagId = true
            this.contractId = idH
            console.log(idH, idE.data.props.providerContractId)
            this.contractCodeId = idE.data.props.providerContractId
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            if (!this.$refs.noteA.value) {
                return this.$message.warning('请选择供应商！')
            }
            if (!this.$refs.contractCode.value) {
                return this.$message.warning('请选择合同编码！')
            }
            if (!this.form.getFieldValue('receiveStoreCode')) {
                return this.$message.warning('请选择收货位置！')
            }
            this.pams = {
                providerContractId: this.contractCodeId,
                receiveStoreCode: this.form.getFieldValue('receiveStoreCode'),
                type: this.form.getFieldValue('type')
            }
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
            this.total()
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
            console.log(val, count, col)
            if (val === '' || val === undefined) {
                return
            }
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                console.log('编辑室的本行数据', target)
                target[col] = val
                this.countFun(target)
                this.categoryinfoData = newData
                this.total()
            }
        },
        countFun (target) {
            const { sub, div, mul } = this.$math
            const num = mul(target.orderPack, target.orderQuantity)// 每包含量*订货数量
            console.log(num, '订货总量')
            target.orderGoodsGross = num
            target.stockPrice123 = mul(num, target.purchasePrice, 2)
            const num2 = mul(num, target.pricePre)// 订货总量*成交价（预估价）
            console.log(num2, '订货总额')
            // 因后台数据不完全，防止计算报错，部分给出默认值
            console.log(target.name11, '-------')
            if (Number(target.name11) === 0 || !target.name11) {
                target.safeDays = 0
            } else {
                target.safeDays = div(num, div(target.name11, 28, 0), 0)// 订货总量/日平均销量      总销量/28（单位：天）
                console.log(target.safeDays, '可预售天数')
            }
            console.log(target.purchasePrice, '----------')
            target.orderQuantity11 = sub(num2, mul(num, target.purchasePrice))// 订货总额-订货量*进货价
            console.log(target.orderQuantity11, '毛利额')
            console.log(num2, '123456')
            if (Number(target.orderQuantity11) === 0 || Number(num2) === 0) {
                console.log('执行')
                target.saleNWee411 = 0
            } else {
                target.saleNWee411 = div(target.orderQuantity11, num2)// 毛利额/订货总额
            }
            console.log(target.saleNWee411, '毛利率')
        },
        /**
         * @name: 搜索弹框事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (arr) {
            console.log(arr, '-------------')
            const { add, mul, div, sub } = this.$math
            this.categoryinfoSelectedRowKeys = []
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                // 因后台数据不完全，防止计算报错，部分给出默认值
                if (!i.saleNWeek1) {
                    i.saleNWeek1 = 0
                }
                if (!i.saleNWeek2) {
                    i.saleNWeek2 = 0
                }
                if (!i.saleNWeek3) {
                    i.saleNWeek3 = 0
                }
                if (!i.saleNWeek4) {
                    i.saleNWeek4 = 0
                }
                if (!i.orderQuantity) {
                    i.orderQuantity = 1
                }
                if (!i.orderPack) {
                    i.orderPack = 0
                }
                if (!i.purchasePrice) {
                    i.purchasePrice = 0
                }
                const purchasePrice = mul(i.stockPrice, sub(1, i.normalRebate, 4), 2)
                const monthlySales = add(add(i.saleNWeek1, i.saleNWeek2, 0), add(i.saleNWeek3, i.saleNWeek4, 0), 0)// 月销量
                const theTotalOrder = mul(i.orderPack, i.orderQuantity, 0)// 订货总量
                const theTotalAmountOfTheOrder = mul(theTotalOrder, purchasePrice, 2)// 订货总额
                const grossProfitMargin = sub(mul(theTotalOrder, i.stockPrice), theTotalAmountOfTheOrder, 2)// 毛利
                let grossProfitRate = div(grossProfitMargin, theTotalAmountOfTheOrder, 2)// 毛利率
                let presell = ''
                console.log(monthlySales, theTotalOrder)
                if (monthlySales === '0') {
                    console.log('可预售天数')
                    presell = 0// 可预售天数
                } else {
                    presell = div(theTotalOrder, div(monthlySales, 28, 0), 0)// 可预售天数
                    console.log(presell, '可预售天数')
                }
                if (grossProfitRate === null) {
                    grossProfitRate = 0
                }
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        tbWebId: i.skuCode,
                        skuCode: i.skuCode,
                        barcode: i.barcode,
                        skuName: i.skuName,
                        skuModel: i.skuModel,
                        basicUnit: i.skuUnit,
                        orderPack: i.orderPack,
                        skuTaxRate: i.skuTaxRate,
                        skuTaxRates: i.skuTaxRates,
                        skuDRate: i.skuDRate,
                        normalRebate: i.normalRebate,
                        normalRebates: this.rateTransform(i.normalRebate),
                        orderQuantity: i.orderQuantity,
                        name11: monthlySales,
                        saleNWeek1: i.saleNWeek1,
                        saleNWeek2: i.saleNWeek2,
                        saleNWeek3: i.saleNWeek3,
                        saleNWeek4: i.saleNWeek4,
                        safeDays: presell,
                        purchasePrice: purchasePrice,
                        skuPrice: i.skuPrice,
                        pricePre: i.skuPrice,
                        stockPrice123: theTotalAmountOfTheOrder,
                        orderQuantity11: grossProfitMargin,
                        saleNWee411: grossProfitRate,
                        note: i.note,
                        orderGoodsGross: theTotalOrder,
                        nowStock: i.numbers
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
            this.total()
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        addEditModel (val) {
            if (!val) {
                this.categoryinfoData = []
                this.indexNumber = 1
                this.BaseMessageObj = {}
            }
        },
        '$store.state.app.pageName' (val) {
            if (val === 'purchaseOrder') {
                this.BaseMessageObjReceiveStoreCode()
                this.BaseMessageObjCommodityType()
            }
        },
        noteAId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flagId) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    expectedArrivalDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    type: 'commodity_type:1'
                                }
                                that.categoryinfoData = []
                                that.orderGoodsNumber = '0'
                                that.orderGoodsNumberSum = '0'
                                that.orderGoodsNumberSumNo = '0'
                                that.contractCodeArr = []
                                that.BaseMessageObjContractCode(val)
                            },
                            onCancel () {
                                console.log(oldval)
                                that.noteAId = oldval
                                that.form.setFieldsValue({ noteA: oldval })
                            }
                        })
                    }
                }
                this.flagId = false
            }
        },
        contractId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flagId) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    expectedArrivalDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    type: 'commodity_type:1'
                                }
                                that.categoryinfoData = []
                                that.orderGoodsNumber = '0'
                                that.orderGoodsNumberSum = '0'
                                that.orderGoodsNumberSumNo = '0'
                            },
                            onCancel () {
                                console.log(oldval)
                                that.contractId = oldval
                                that.form.setFieldsValue({ contractCode: oldval })
                            }
                        })
                    }
                }
                this.flagId = false
            }
        },
        typeId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flagId) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    expectedArrivalDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                                    createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                                that.orderGoodsNumber = '0'
                                that.orderGoodsNumberSum = '0'
                                that.orderGoodsNumberSumNo = '0'
                            },
                            onCancel () {
                                console.log(oldval)
                                if (oldval === 'commodity_type:2') {
                                    that.typeId = 'commodity_type:2'
                                    that.form.setFieldsValue({ type: 'commodity_type:2' })
                                } else {
                                    that.typeId = 'commodity_type:1'
                                    that.form.setFieldsValue({ type: 'commodity_type:1' })
                                }
                            }
                        })
                    }
                }
                this.flagId = false
            }
        }
    }
}
</script>

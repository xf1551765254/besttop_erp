<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-01 13:52:08
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
          <a-col :sm="8" :md="4" :xl="3">调入分店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择调入分店"
                :options="distributionCenterArr"
                @change="theGoodsLocation"
                :filterOption="filterOption"
                style="width:100%"
                v-decorator="$check('billAllotC.destinationStoreCode',{initialValue:BaseMessageObj.destinationStoreCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">调出分店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billAllotC.sourceStoreCode', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billAllotC.makeStoreId', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="goodsAdd(1)">添加调拨商品</a-button>
          <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)">删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scroll">
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:100px">总数量：</span>
            <span>{{ totalQuantity }}</span>
            <span style="margin-left:150px">成本总额：</span>
            <span>{{ sumChangeM(costPrice) }}</span>
            <span style="margin-left:100px">零售总额：</span>
            <span>{{ sumChangeM(retailPrice) }}</span>
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
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择负责人"
                :options="applicantArr"
                showSearch
                :filterOption="filterOption"
                style="width:100%"
                v-decorator="$check('billAllotC.chargeBy',{initialValue:BaseMessageObj.chargeBy})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billAllotC.createBy', {initialValue:`${this.$store.getters.code}-${this.$store.getters.name}`})"
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
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billAllotC.auditBy')"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billAllotC.auditTime')"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('billAllotC.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 2, maxRows: 2 }" />
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
import getStatus from '@comp/statusAll/getStatus'
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsBounced'
import Preview from './preview/StoreTransferPreview'
import is from 'is_js'
export default {
    name: 'StoreTransfer',
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
                    title: '单据状态',
                    type: 'select',
                    key: 'billStatus',
                    filter: true,
                    label: 'title',
                    value: ['type', 'configKey'],
                    selectDataArr: []
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
                    action: 'StoreTransfer.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'StoreTransfer.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'StoreTransfer.verify',
                    fc: this.auditHandler
                },
                {
                    name: '取消审核',
                    action: 'StoreTransfer.verify',
                    fc: this.cancelTheConfirmation
                },
                {
                    name: '预览',
                    action: 'StoreTransfer.get',
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
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100, align: 'center' },
                { title: '品牌', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '税率', dataIndex: 'skuTaxRate', width: 100, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
                { title: '成本价(含税)', dataIndex: 'priceCost', width: 150, align: 'center' },
                { title: '调拨数量', dataIndex: 'qtty', width: 100, align: 'center', scopedSlots: { customRender: 'qtty' } },
                { title: '现库存', dataIndex: 'curNumber', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ], // 表头
            categoryinfoData: [], // 表体
            orderId: '',
            tags: [],
            scroll: { x: 1500 },
            storeQuery: false,
            distributionCenterArr: [], // 收获位置
            applicantArr: [], // 负责人
            theGoodsLocationId: '',
            pamsBounced: {},
            totalQuantity: '0',
            retailPrice: '0.00', // 零售价
            costPrice: '0.00', // 成本价
            // 预览
            previewVisbel: false,
            theStoreTypeId: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ea529e6ffedf4735aaa1a945f21404d9:StoreTransfer'
            this.tableApiPath = 'DistributionBillAllotFindb'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.distributionCenter()
        this.applicant()
        this.theStoreType()
        getStatus('bill_allot_status', this.conditions[1])
        this.seachValue = {
            billStatus: 'bill_allot_status:1',
            auditTimeA: moment().subtract(7, 'days'),
            auditTimeB: moment()
        }
    },
    methods: {
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
            const retailPriceArr = []
            const costPriceArr = []
            for (const item of totalArr) {
                totalQuantityArr.push(item.qtty)
                retailPriceArr.push(mul(item.price, item.qtty, 2))
                costPriceArr.push(mul(item.priceCost, item.qtty, 2))
            }
            this.totalQuantity = totalQuantityArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.retailPrice = retailPriceArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.costPrice = costPriceArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        onSelectBounced (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        skuModel: i.skuModel,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        skuUnit: i.skuUnit,
                        price: i.skuPrice,
                        skuTaxRate: i.skuTaxRate,
                        curNumber: i.numbers,
                        qtty: 0,
                        priceCost: i.skuPtCost
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
            this.retailPrice = '0.00'
            this.costPrice = '0.00'
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
                this.$message.warning('请选择收获位置！')
            } else {
                this.storeQuery = true
                this.pamsBounced = {
                    providerContractStoreCode: this.$store.getters.storeInfo.code
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
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                let addArr = {}
                values.sourceStoreCode = this.$store.getters.storeInfo.code
                values.makeStoreId = this.$store.getters.storeInfo.code
                values.createBy = this.$store.getters.code
                addArr = Object.assign(values, { billAllotDetails: newData })
                if (this.addEdit === 'edit') {
                    addArr = Object.assign(addArr, { id: this.rowId })
                } else {
                    addArr = Object.assign(addArr, { billType: 'bill_allot_type:2' })
                }
                if (!err) {
                    this.submitLoading = true
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionBillAllotAdd' : 'DistributionBillAllotUpdate',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
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
                if (this.$store.getters.storeInfo.code === e.sourceStoreCode) {
                    this.disContextMenu = ['取消审核']
                } else {
                    this.disContextMenu = ['编辑', '删除', '审核', '取消审核']
                }
            } else if (e.billStatus === 'bill_allot_status:3') {
                if (this.$store.getters.storeInfo.code === e.sourceStoreCode) {
                    this.disContextMenu = ['编辑', '删除', '审核']
                } else if (this.$store.getters.storeInfo.code === e.destinationStoreCode) {
                    this.disContextMenu = ['编辑', '删除', '取消审核']
                } else {
                    this.disContextMenu = ['编辑', '删除', '审核', '取消审核']
                }
            } else if (e.billStatus === 'bill_allot_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核', '取消审核']
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
                this.$refs.newTable.exportFile('DistributionBillAllotFindb', this.seachValue)
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
            e.path = 'DistributionBillAllotFindb'
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
                        path: 'DistributionBillAllotAudit',
                        method: 'post',
                        body: {
                            id: e.id,
                            loginStoreCode: that.$store.getters.storeInfo.code
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
                        path: 'DistributionBillAllotWithdraw',
                        method: 'post',
                        body: {
                            id: e.id,
                            loginStoreCode: that.$store.getters.storeInfo.code
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
            if (this.theStoreTypeId === 'store_type:3') {
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
                            path: 'DistributionBillAllotDelete',
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
            } else {
                if (this.theStoreTypeId === 'store_type:1') {
                    return this.$message.warning('当前登录店为总部，不能操作该业务')
                } else if (this.theStoreTypeId === 'store_type:2' || this.theStoreTypeId === 'store_type:4') {
                    return this.$message.warning('当前登录店为配送中心，不能操作该业务')
                }
            }
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            if (this.theStoreTypeId === 'store_type:3') {
                if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                    this.addEdit = 'add'
                    this.BaseMessageObj = {
                        createTime: moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                    this.title = '新增店间调拨单'
                    this.orderId = ''
                    this.tags = []
                    this.theGoodsLocationId = ''
                    this.categoryinfoData = []
                    this.totalQuantity = '0'
                    this.retailPrice = '0.00'
                    this.costPrice = '0.00'
                } else {
                /**
                 * 编辑
                 */
                    console.log('编辑')
                    this.rowId = index.id
                    this.BaseMessageObj = index
                    this.addEdit = 'edit'
                    this.title = '编辑店间调拨单'
                    this.orderId = ''
                    this.tags = ['uncheck']
                    this.theGoodsLocationId = index.destinationStoreCode
                    this.editTheDetails(index)
                }
                // 打开modal
                this.addEditModel = true
            } else {
                if (this.theStoreTypeId === 'store_type:1') {
                    return this.$message.warning('当前登录店为总部，不能操作该业务')
                } else if (this.theStoreTypeId === 'store_type:2' || this.theStoreTypeId === 'store_type:4') {
                    return this.$message.warning('当前登录店为配送中心，不能操作该业务')
                }
            }
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
                path: 'DistributionBillAllotDetailFindDetail',
                method: 'post',
                body: {
                    code: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('编辑详情', res.data)
                    this.categoryinfoData = res.data
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
        /**
         * @name: 获取收获位置
         * @msg:
         * @param {type}
         * @return:
         */
        distributionCenter () {
            axios({
                path: 'OrganizationStoreFindStoreAndDirect',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code,
                    status: '1'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取收获位置', res.data)
                    const arr = []
                    for (const item of res.data) {
                        if (item.code !== this.$store.getters.storeInfo.code) {
                            arr.push({
                                key: item.code,
                                title: `${item.code}-${item.name}`,
                                value: item.code
                            })
                        }
                    }
                    this.distributionCenterArr = [...arr]
                    // res.data.forEach(i => {
                    //     i.key = i.code
                    //     i.title = `${i.code}-${i.name}`
                    //     i.value = i.code
                    // })
                    // this.distributionCenterArr = [...res.data]
                }
            })
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        applicant () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取负责人', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.applicantArr = [...data]
                }
            })
        },
        theStoreType () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取店面类型', res.data.list[0].type)
                    this.theStoreTypeId = res.data.list[0].type
                }
            })
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'StoreTransfer') {
                this.distributionCenter()
                this.applicant()
                this.theStoreType()
            }
        }
    }
}
</script>

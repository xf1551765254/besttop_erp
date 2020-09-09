<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-07 09:00:27
 * @LastEditTime: 2019-08-26 17:38:23
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      showOrganize
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange"
    ></NewTable>
    <!-- 弹窗 -->
    <bt-modal
      v-model="editVisible"
      title="采购价格调整"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                ref="supplier"
                placeholder="请检索供应商"
                v-decorator="$check('BillPurchasePrice.supplier',{initialValue:billsForm.supplier} ) "
                :options="supplierList"
                showSearch
                @search="priverSearch"
                @change="supplierChange"
                :filterOption="false"
                :defaultActiveFirstOption="false"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">合同名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                ref="contractCode"
                placeholder="请先检索供应商"
                v-decorator="$check('BillPurchasePrice.contractCode',{initialValue:billsForm.contractCode} ) "
                :options="contractCodeList"
                @change="contractChange"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :filterOption="false"
                placeholder="请检索负责人"
                v-decorator="$check('BillPurchasePrice.managerBy', {initialValue:billsForm.managerBy})"
                :options="customerLIst"
                @search="customerSearch"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('BillPurchasePrice.effectTime',{initialValue:billsForm.effectTime || effectTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">采购员</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                placeholder="请检索采购员"
                :filterOption="filterOption"
                v-decorator="$check('BillPurchasePrice.purchasingBy', {initialValue:billsForm.purchasingBy})"
                :options="customerLIst"
                @search="customerSearch"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPurchasePrice.createStoreCode', {initialValue:billsForm.createStoreCode || `${$store.getters.storeInfo.code} - ${$store.getters.storeInfo.name}`})" disabled/>
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
                v-decorator="$check('BillPurchasePrice.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">采购价格调整单</h4>
        <a-button class="editable-add-btn" @click="addTable">新增</a-button>
        <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
          <a-button class="editable-add-btn">删除</a-button>
        </a-popconfirm>
        <a-table
          rowKey="bt_web_id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="scrollXY">
          <template v-for="col in ['deductionRate','ptIn', 'reason', 'type','normalRebateNew','specialRebateNew']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="record.flagType && col === 'deductionRate'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-input
                v-else-if="col === 'reason'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.bt_web_id, col)"
              />
              <a-input-number
                v-else-if="record.flagType && col === 'ptIn'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-select
                v-else-if="col === 'type'"
                :options="typeArr"
                @focus="e => focusChange(e, record.bt_web_id, col)"
                :defaultValue="record.type"
                style="margin: -5px 0;width:100%;"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-input-number
                v-else-if="col === 'normalRebateNew'"
                style="width: 100%"
                :min="0"
                :max="100"
                :precision="2"
                :step="1"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              />
              <a-input-number
                v-else-if="col === 'specialRebateNew'"
                style="width: 100%"
                :min="0"
                :max="100"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => saveRow(record.bt_web_id)" style="margin-right:10px;">保存</a>
                <a-popconfirm title="是否取消编辑?" @confirm="() => cancelRow(record.bt_web_id)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => edit(record.bt_web_id)" style="margin-right:10px;" v-if="editDel">编辑</a>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.bt_web_id)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">

          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPurchasePrice.createBy', {initialValue:billsForm.createBy || `${$store.getters.userInfo.code} - ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPurchasePrice.createTime', {initialValue: billsForm.createTime || createTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelect" :pams="pams" multiple/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>
<script>
import goods from '@pages/purchasing/acquisitionStrategy/toop/acquisition'
import Preview from '@pages/purchasing/acquisitionStrategy/preview/acquisitionStrategyPreview'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import clonedeep from 'lodash.clonedeep'
const billsData = []
export default {
    name: 'AcquisitionStrategy',
    components: { seachBox, NewTable, goods, BtModal, Preview },
    data () {
        this.cacheData = billsData.map(item => ({ ...item }))
        return {
            previewVisbel: false, // 详情弹窗
            orderId: '',
            tags: [],
            editDel: false,
            providerCode: '',
            pams: {},
            createTime: '',
            // 变动类型
            typeArr: [],
            // 获取负责人
            customerLIst: [],
            // 获取合同
            contractCodeList: [],
            // 获取供应商
            supplierList: [],
            billsData,
            loading: false,
            bt_id: '',
            bt_Save: false,
            selectedRowKeys: [],
            // 控制商品弹窗
            goodsQuery: false,
            billsForm: {},
            title: '',
            // 控制新增/ 编辑开关
            editVisible: false,
            disContextMenu: [],
            // 表单
            form: this.$form.createForm(this),
            // 右击选中数据
            auditObj: [],
            // 删除选中
            deleteAll: [],
            // 绑定搜索
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment(),
                status: 'bill_purchase_price_status:1'
            },
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
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
                    title: '制单开始时间',
                    key: 'auditTimeA',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'auditTimeB',
                    type: 'date'
                },
                {
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
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }
            ],
            tableCode: '',
            tableApiPath: '',
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'acquisitionStrategy.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'acquisitionStrategy.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'acquisitionStrategy.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'acquisitionStrategy.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ],
            scrollXY: {
                x: 2200
            },
            // 单据表头
            columns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '新含税进价', dataIndex: 'ptIn', width: 100, align: 'right', scopedSlots: { customRender: 'ptIn' } },
                { title: '原含税进价', dataIndex: 'ptInOrig', width: 100, align: 'right' },
                { title: '新扣率', dataIndex: 'deductionRate', width: 100, align: 'right', scopedSlots: { customRender: 'deductionRate' } },
                { title: '原扣率', dataIndex: 'deductionRateOrigs', width: 100, align: 'right' },
                { title: '新正常返点', dataIndex: 'normalRebateNew', width: 100, align: 'right', scopedSlots: { customRender: 'normalRebateNew' } },
                { title: '原正常返点', dataIndex: 'normalRebates', width: 100, align: 'right' },
                { title: '新特价返点', dataIndex: 'specialRebateNew', width: 100, align: 'right', scopedSlots: { customRender: 'specialRebateNew' } },
                { title: '原特价返点', dataIndex: 'specialRebates', width: 100, align: 'right' },
                { title: '变更类型', dataIndex: 'type', width: 100, align: 'left', scopedSlots: { customRender: 'type' } },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'right' },
                { title: '原因', dataIndex: 'reason', align: 'left', scopedSlots: { customRender: 'reason' } },
                { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            typeArrSave: [],
            effectTime: moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd23e3a41eefd4ca099fac59769f268cd:acquisitionStrategy'
            this.tableApiPath = 'BillPurchaseFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.defaultStatus()
        this.BaseMessageObjType()
    },
    methods: {
    /**
     * @name: 序号
     */
        taIndex (data) {
            let num = 1
            data.forEach(i => {
                i.index = num++
            })
        },
        defaultStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_purchase_price_status',
                    grade: '1'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[3], 'selectDataArr', data)
                    this.seachValue = {
                        auditTimeA: moment().subtract({ days: 7 }),
                        auditTimeB: moment(),
                        status: 'bill_purchase_price_status:1'
                    }
                }
            })
        },
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        focusChange (val, count, key) {
            console.log(val, count, key)
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                if (target.status === 'base_sku_status:3') {
                    this.typeArr = this.statusFun(['bill_purchase_price_goods_status:1', 'bill_purchase_price_goods_status:3', 'bill_purchase_price_goods_status:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:2') {
                    this.typeArr = this.statusFun(['bill_purchase_price_goods_status:1', 'bill_purchase_price_goods_status:2', 'bill_purchase_price_goods_status:4', 'bill_purchase_price_goods_status:5'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:4') {
                    this.typeArr = this.statusFun(['bill_purchase_price_goods_status:1', 'bill_purchase_price_goods_status:5', 'bill_purchase_price_goods_status:6'], this.typeArrSave)
                }
                if (target.status === 'base_sku_status:1' || target.status === 'base_sku_status:5' || target.status === 'base_sku_status:6') {
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
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name:单据内商品控制
         */
        addTable () {
            const val = this.providerCode
            console.log(val, 'code')
            if (!val) {
                return this.$message.warning('请先选择供应商!')
            } else if (!this.$refs.contractCode.value) {
                return this.$message.warning('请先选择合同编码!')
            } else {
                this.pams = { providerCode: val, code: this.$refs.contractCode.value.split('-')[0] }
                this.goodsQuery = true
            }
        },
        contractChange (val) {
            if (this.billsData.length > 0) {
                const that = this
                this.$confirm({
                    title: '选择合同编码',
                    content: '已存在明细数据,是否清空?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        that.billsData = []
                    },
                    onCancel () {

                    }
                })
            }
        },
        /**
         * @name:监听供应商
         */
        supplierChange (e) {
            if (this.billsData.length === 0) {
                this.providerCode = e
                this.getmest(e)
            }
            if (this.billsData.length > 0) {
                const that = this
                that.$confirm({
                    title: '',
                    content: '当前操作将会清除明细,是否继续?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.billsData = []
                        that.providerCode = e
                        that.form.setFieldsValue({ contractCode: '' })
                        that.getmest(e)
                    },
                    onCancel () {
                        that.billsForm.supplier = that.providerCode
                        that.form.setFieldsValue({ supplier: that.providerCode })
                    }
                })
            }
        },
        getmest (e) {
            axios({
                path: 'ProviderSelectByProvider',
                method: 'post',
                body: {
                    providerCode: e
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    console.log(data)
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.providerContractName}`
                        i.value = i.code
                    })
                    this.form.setFieldsValue({ contractCode: '' })
                    this.contractCodeList = [...data]
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
                    type: 'bill_purchase_price_goods_status',
                    orderbyField: 'keySort'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('商品类型', res.data)
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
         * @name:获取选中商品
         */
        onSelect (e) {
            console.log(e, '选择商品')
            const error = []
            const { mul } = this.$math
            e.forEach(mun => {
                const has = this.billsData.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    console.log(mun, '添加商品')
                    this.billsData.push({
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        skuModel: mun.skuModel,
                        price: mun.skuPrice,
                        deductionRateOrig: mun.skuDRate,
                        ptInOrig: mun.stockPrice,
                        bt_web_id: mun.skuCode,
                        deductionRate: mul(mun.skuDRate, 100),
                        ptIn: mun.stockPrice,
                        reason: '',
                        flagType: true,
                        deductionRateOrigs: this.rateTransform(mun.skuDRate),
                        status: mun.status,
                        type: 'bill_purchase_price_goods_status:1',
                        normalRebates: this.rateTransform(mun.normalRebate),
                        specialRebates: this.rateTransform(mun.specialRebate),
                        normalRebate: mun.normalRebate,
                        specialRebate: mun.specialRebate,
                        normalRebateNew: 0,
                        specialRebateNew: 0
                    })
                } else {
                    error.push(mun.skuName)
                }
                this.taIndex(this.billsData)
                console.log(this.billsData, '5534536')
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 保存
         */
        submitData (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).startOf('day').format('YYYY-MM-DD')
                    formDate.createStoreCode = formDate.createStoreCode.split('-')[0]
                    formDate.createBy = formDate.createBy.split('-')[0]
                    formDate.supplier = formDate.supplier.split('-')[0]
                    formDate.contractCode = formDate.contractCode.split('-')[0]
                    if (formDate.purchasingBy) {
                        formDate.purchasingBy = formDate.purchasingBy.split('-')[0]
                    }
                    if (formDate.managerBy) {
                        formDate.managerBy = formDate.managerBy.split('-')[0]
                    }
                    const data = clonedeep(this.billsData)
                    if (data.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    for (const i of data) {
                        if (!i.type) {
                            return this.$message.warning(`商品编码为${i.skuCode}未选择变更类型，请选择变更类型！`)
                        }
                        i.deductionRate = String(i.deductionRate).replace('%', '') / 100
                        i.normalRebateNew = this.$math.div(i.normalRebateNew, 100, 4)
                        i.specialRebateNew = this.$math.div(i.specialRebateNew, 100, 4)
                    }

                    console.log(data, '表格数据2')
                    console.log(formDate, '保存')
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    } else {
                        formDate.createStoreCode = this.$store.getters.storeInfo.code
                        formDate.createBy = this.$store.getters.userInfo.code
                    }
                    this.loading = true
                    axios({
                        path: this.bt_Save ? 'BillPurchaseUpdateAll' : 'BillPurchaseAdd',
                        method: 'post',
                        body: {
                            billPurchasePrice: formDate,
                            billPurchasePriceDetailsList: data
                        }
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.editVisible = false
                            this.getDate()
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            console.log(e)
            const arr = { ...e }
            this.orderId = arr.code
            this.bt_id = arr.id
            this.editVisible = true
            this.providerCode = arr.supplier
            arr.effectTime = moment(arr.effectTime)
            arr.supplier = `${arr.supplier}-${arr.supplierName}`
            arr.createBy = `${arr.createBy}-${arr.createName}`
            arr.createStoreCode = `${arr.createStoreCode}-${arr.createStoreName}`
            arr.managerBy = arr.managerBy ? `${arr.managerBy}-${arr.managerName}` : ''
            arr.purchasingBy = arr.purchasingBy ? `${arr.purchasingBy}-${arr.purchasingName}` : ''
            arr.contractCode = `${arr.contractCode}-${arr.providerContractName}`
            this.billsForm = { ...arr }
            this.tags = ['uncheck']
            axios({
                path: 'BillDetailFindDetail',
                method: 'post',
                body: {
                    purchasePriceCode: arr.code
                }
            }).then(res => {
                console.log(res, '---------------------------')
                if (res.flag === 1) {
                    const { mul } = this.$math
                    let num = 1
                    for (const i of res.data.list) {
                        i.index = num++
                        i.bt_web_id = i.skuCode
                        i.deductionRateOrigs = this.rateTransform(i.deductionRateOrig)
                        i.normalRebates = this.rateTransform(i.normalRebate)
                        i.specialRebates = this.rateTransform(i.specialRebate)
                        i.normalRebateNew = mul(i.normalRebateNew, 100, 2)
                        i.specialRebateNew = mul(i.specialRebateNew, 100, 2)
                        if (i.type === 'bill_purchase_price_goods_status:1') {
                            i.deductionRate = mul(i.deductionRate, 100, 2)
                            i.flagType = true
                        } else {
                            i.deductionRate = `${String(mul(i.deductionRate, 100, 2))}%`
                            i.flagType = false
                        }
                    }
                    console.log(res.data.list, '编辑获取表格')
                    this.billsData = res.data.list
                    this.taIndex(this.billsData)
                }
            })
        },
        /**
         * @name: 单据表格行编辑按钮
         */
        edit (index) {
            console.log(index)
            const newData = [...this.billsData]
            console.log(newData, '编辑')
            this.cacheData = newData.map(item => ({ ...item }))
            let target = newData[index]
            for (const item of newData) {
                if (item.bt_web_id === index) {
                    target = item
                }
            }
            if (target) {
                target.editable = true
                this.billsData = newData
            }
        },
        /**
         * @name: 保存单据行编辑
         */
        saveRow (e) {
            console.log(e)
            const newData = [...this.billsData]
            const target = newData.filter(item => e === item.bt_web_id)[0]
            if (target) {
                console.log(target)
                delete target.editable
                this.billsData = newData
                this.cacheData = newData.map(item => ({ ...item }))
            }
        },
        /**
         * @name: 取消单据行编辑
         */
        cancelRow (key) {
            const newData = [...this.billsData]
            const target = newData.filter(item => key === item.bt_web_id)[0]
            if (target) {
                console.log(target)
                Object.assign(target, this.cacheData.filter(item => key === item.bt_web_id)[0])
                delete target.editable
                this.billsData = newData
            }
        },
        /**
         * @name:监听单据表格编辑
         */
        InputChange (val, count, key) {
            console.log(val, count, key)
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                target[key] = val
                console.log(target, '监听')
                console.log(target.deductionRate)
                if (key === 'type') {
                    if (target.type === 'bill_purchase_price_goods_status:1') {
                        target.deductionRate = target.deductionRate.replace('%', '')
                        target.flagType = true
                    } else {
                        target.deductionRate = `${String(target.deductionRate).replace('%', '')}%`
                        target.flagType = false
                    }
                }
                this.billsData = newData
            }
        },

        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('d23e3a41eefd4ca099fac59769f268cd:acquisitionStrategy', { path: 'BillPurchaseFind' })
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            if (status === 'bill_purchase_price_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.editVisible = true
                this.bt_Save = false
                this.billsData = []
                this.billsForm = {
                    managerBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.orderId = ''
                this.tags = []
                this.title = '新增'
            } else if (e === 'del') {
                console.log('批量删除')
                if (this.deleteAll.length < 1) {
                    return this.$message.warning('您尚未选中任何数据！')
                }
                this.onDel(1)
            } else if (e === 'export') {
                console.log('打印')
                this.$refs.newTable.exportFile('BillPurchaseFind', this.seachValue)
            } else if (e === 'print') {
                console.log('导出')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            console.log(e, '编辑')
            if (mun === 'edit') {
                console.log('编辑')
                this.billsData = []
                this.editRow(e)
                this.title = '编辑'
                this.bt_Save = true
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
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del)
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].bt_web_id === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.bt_web_id !== del)
            }
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
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
            e.path = 'BillPurchaseFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 生效时间过滤
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        },
        /**
         * @name:表格多选方法
         */
        onChange (keys, rows) {
            console.log(keys, rows)
            this.deleteAll = rows
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
                        path: 'BillPurchaseDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.del(arr, 'id')
                            that.deleteAll = []
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
                content: '是否确认审核当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillPurchaseAuditing',
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
        },
        customerSearch (e) {
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
                        this.customerLIst = [...data]
                    }
                })
            }, 300)
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
                        this.supplierList = [...data]
                    }
                })
            }, 300)
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
        }
    },
    watch: {
        '$store.stare.app.pageName' (val) {
            if (val === 'acquisitionStrategy') {
                this.defaultStatus()
            }
        },
        editVisible (val) {
            if (!val) {
                this.billsData = []
                this.contractCodeList = []
            }
        }
    }
}
</script>

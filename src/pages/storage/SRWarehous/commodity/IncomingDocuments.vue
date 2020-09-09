<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-05-10 13:55:11
 * @LastEditTime: 2019-08-08 10:35:01
 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      title="入库管理单"
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
                style="width: 100%"
                v-decorator="$check('bill_entry.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                :filterOption="filterOption"
                @change="providerChange"
                allowClear
                showSearch
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.sourceCode',{initialValue:billsForm.sourceCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}:${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.entryMakeStoreCode',{initialValue:billsForm.entryMakeStoreCode || `${$store.getters.storeInfo.code}:${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">入库明细</h4>
        <a-button class="editable-add-btn" @click="addManage">添加商品</a-button>
        <a-button class="editable-add-btn" @click="addGoodsDvance">选择预收货单</a-button>
        <a-button class="editable-add-btn" @click="addPurchaseOrder">选择采购订单</a-button>
        <a-button class="editable-add-btn" type="danger" @click="onDelete(-1)">删除</a-button>
        <a-table
          rowKey="skuCode"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="{x:2300, y: 300}">
          <template v-for="col in ['entryQtty', 'note', 'priceIn']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'entryQtty'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputStorageChange(e, record.skuCode, col)" />
              <a-input-number
                v-else-if="record.inputState && col === 'priceIn'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputStorageChange(e, record.skuCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.skuCode, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="footer">
            <h3 style="display:inline;">总计</h3>
            <span style="margin-left:120px">数量:</span>
            <span>{{ countAll }}</span>
            <span style="margin-left:50px">进价总额:</span>
            <span>{{ sumChangeM(amontIn) }}</span>
            <span style="margin-left:120px">进价总额(不含税):</span>
            <span>{{ sumChangeM(amuntExcludingTaxIn) }}</span>
            <span style="margin-left:120px">零售价总额:</span>
            <span>{{ sumChangeM(amountSale) }}</span>

          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.skuCode)" okText="是" cancelText="否">
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
              <a-input v-decorator="$check('bill_entry.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code}:${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.auditBy',)" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.auditTime')" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">验货人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('bill_entry.entryBy', {initialValue:billsForm.entryBy})"
                :options="customerLIst"
                :filterOption="filterOption"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_entry.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsBounced :flagObj="flagObj" :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="selectData"/>
      <goodsDvance :visible.sync="goodsDvanceQuery" @onSelect="goodsDvanceSelect" :pams="goodsDvancePams"/>
      <purchaseOrder :visible.sync="purchaseOrderQuery" @onSelect="purchaseOrderSelect" :pams="purchaseOrderPams"/>
    </bt-modal>
  </div>
</template>
<script>
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsBounced'
import goodsDvance from '@pages/storage/SRWarehous/commodity/goodsDvance'
import purchaseOrder from '@pages/storage/SRWarehous/commodity/purchaseOrder'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
import is from 'is_js'
const columns = [
    { title: '订货未收量', dataIndex: 'entryQttys', width: 100, align: 'center' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'center' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 200, align: 'center' },
    { title: '规格型号', dataIndex: 'model', width: 250, align: 'center' },
    { title: '单位', dataIndex: 'basicUnit', width: 50, align: 'center' },
    { title: '税率', dataIndex: 'taxRates', width: 80, align: 'center' },
    { title: '入库数量', dataIndex: 'entryQtty', width: 150, align: 'center', scopedSlots: { customRender: 'entryQtty' } },
    { title: '进价', dataIndex: 'priceIn', width: 150, align: 'center', scopedSlots: { customRender: 'priceIn' } },
    { title: '进价(不含税)', dataIndex: 'onPriceIn', width: 100, align: 'center' },
    { title: '进价总额', dataIndex: 'amontIn', width: 100, align: 'center' },
    { title: '进价总额(不含税)', dataIndex: 'amuntExcluding', width: 150, align: 'center' },
    { title: '零售价总额', dataIndex: 'amountRetail', width: 100, align: 'center' },
    { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
    { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'IncomingDocuments',
    components: { BtModal, goodsBounced, goodsDvance, purchaseOrder },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableLoading: false,
            bt_Save: false,
            bt_id: '',
            rate: '', // 最高比率
            inputState: true, // 进价是否可输入
            provider: '', // 供应商
            flagObj: {}, // 添加商品传入商品
            pamsBounced: {}, // 添加商品传入参数
            storeQuery: false, // 添加商品控制
            amountSale: 0, // 零售价总额
            amontIn: 0, // 进价总额
            countAll: 0, // 数量总计
            amuntExcludingTaxIn: 0, // 不含税进价总额
            columns, // 单据表头
            billsData: [], // 明细表格
            billsForm: {}, // 单据数据
            loading: false, // 加载状态
            tags: [],
            orderId: '',
            userSet: {}, // 添加商品传入参数
            providerList: [], // 供应商
            customerLIst: [], // 负责人
            selectedRowKeys: [], // 单据明细选中
            clientVisible: false, // 单据弹窗控制
            goodsDvanceQuery: false, // 预收货弹窗控制
            goodsDvancePams: {}, // 预收货单传入参数
            purchaseOrderQuery: false, // 采购订单弹窗控制
            purchaseOrderPams: {}, // 采购订单传入数据
            form: this.$form.createForm(this), // 表单
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss') // 制单时间
        }
    },
    watch: {
        value: {
            handler (val) {
                this.clientVisible = val
                console.log(val)
            },
            immediate: true
        },
        clientVisible (val) {
            this.$emit('input', val)
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name:采购订单弹窗
         */
        addPurchaseOrder () {
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            this.purchaseOrderPams = {
                provider: this.form.getFieldValue('provider'),
                makeStoreCode: this.$store.getters.storeInfo.code,
                billsData: this.billsData
            }
            this.purchaseOrderQuery = true
        },
        /**
         * @name:采购订单添加选中返回数据
         */
        purchaseOrderSelect (e) {
            console.log(e, '采购订单明细')
            this.form.setFieldsValue({ sourceCode: e[0].sourceCode })
            this.billsData = []
            const { add, div, mul, sub } = this.$math
            const arr = []
            const arrs = []
            const allCount = []
            e.forEach(i => {
                this.billsData.push({
                    detailId: i.id,
                    entryDetailType: 3,
                    inputState: this.inputState,
                    skuCode: i.skuCode,
                    skuName: i.skuName,
                    model: i.skuModel,
                    brandName: i.brandName,
                    brandCode: i.brandCode,
                    basicUnit: i.unit,
                    priceIn: i.purchasePrice,
                    taxRates: this.rateTransform(i.skuTaxRate),
                    taxRate: i.skuTaxRate,
                    price: i.skuPrice,
                    priceCost: i.purchasePrice,
                    entryQttys: sub(i.orderQuantity, i.chargeQuantity, 0),
                    entryQtty: sub(i.orderQuantity, i.chargeQuantity),
                    // 进价不含税
                    onPriceIn: div(i.purchasePrice, add(1, i.skuTaxRate)),
                    // 进价总额
                    amontIn: mul(i.purchasePrice, sub(i.orderQuantity, i.chargeQuantity)),
                    // 进价总额不含税
                    amuntExcluding: mul(div(i.purchasePrice, add(1, i.skuTaxRate)), sub(i.orderQuantity, i.chargeQuantity)),
                    // 零售价总额
                    amountRetail: mul(sub(i.orderQuantity, i.chargeQuantity), i.skuPrice)
                })
                arr.push(mul(i.purchasePrice, sub(i.orderQuantity, i.chargeQuantity)))
                arrs.push(mul(i.skuPrice, sub(i.orderQuantity, i.chargeQuantity)))
                allCount.push(sub(i.orderQuantity, i.chargeQuantity))
            })
            const amontInAll = arr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.amontIn = amontInAll
            this.amuntExcludingTaxIn = div(amontInAll, add(1, this.billsData[0].taxRate))
            // 零售价总额
            const amountSaleAll = arrs.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.amountSale = amountSaleAll
            const allCounts = allCount.reduce((prev, cur) => {
                return add(prev, cur, 0)
            }, 0)
            this.countAll = allCounts
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            this.getAll()
            this.tableLoading = true
            this.bt_Save = true
            const obj = { ...e }
            console.log(obj, '编辑数据')
            this.bt_id = obj.id
            this.provider = obj.provider
            this.orderId = obj.code
            this.tags = ['uncheck']
            obj.makeStoreCode = `${obj.makeStoreCode}:${obj.makeStoreName}`
            obj.entryMakeStoreCode = `${obj.entryMakeStoreCode}:${obj.entryMakeStoreName}`
            obj.makeUserCode = `${obj.makeUserCode}:${obj.makeUserName}`
            this.billsForm = obj
            axios({
                path: 'DistributionBillEntryFindEntryDetail',
                method: 'post',
                body: {
                    id: obj.id
                }
            }).then(res => {
                this.tableLoading = false
                if (res.flag === 1) {
                    const { sub } = this.$math
                    console.log(res.data)
                    for (const i of res.data) {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.inputState = this.inputState
                        i.priceCost = i.priceIn
                        if (i.entryDetailType === 3) {
                            i.entryQttys = sub(i.orderQuantity, i.chargeQuantity, 0)
                        } else {
                            i.entryQttys = 0
                        }
                    }
                    this.billsData = res.data
                    if (this.billsData.length > 0) {
                        this.count(this.billsData)
                    }
                }
            })
        },
        /**
         * @name: 预收货单返回数据
         */
        goodsDvanceSelect (e) {
            console.log(e, '预收货明细')
            this.form.setFieldsValue({ sourceCode: e[0].sourceCode })
            this.billsData = []
            const { add, div, mul } = this.$math
            const arr = []
            const arrs = []
            const allCount = []
            e.forEach(i => {
                this.billsData.push({
                    detailId: i.id,
                    entryDetailType: 2,
                    inputState: this.inputState,
                    skuCode: i.skuCode,
                    skuName: i.skuName,
                    model: i.model,
                    brandName: i.brandName,
                    brandCode: i.brandCode,
                    basicUnit: i.basicUnit,
                    priceIn: i.priceIn,
                    taxRate: i.taxRate,
                    taxRates: this.rateTransform(i.taxRate),
                    price: i.price,
                    priceCost: i.priceIn,
                    entryQttys: 0,
                    entryQtty: i.recN,
                    // 进价不含税
                    onPriceIn: div(i.priceIn, add(1, i.taxRate)),
                    // 进价总额
                    amontIn: mul(i.priceIn, i.recN),
                    // 进价总额不含税
                    amuntExcluding: mul(div(i.priceIn, add(1, i.taxRate)), i.recN),
                    // 零售价总额
                    amountRetail: mul(i.recN, i.price)
                })
                arr.push(mul(i.priceIn, i.recN))
                arrs.push(mul(i.price, i.recN))
                allCount.push(i.recN)
            })
            const amontInAll = arr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.amontIn = amontInAll
            this.amuntExcludingTaxIn = div(amontInAll, add(1, this.billsData[0].taxRate))
            // 零售价总额
            const amountSaleAll = arrs.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.amountSale = amountSaleAll
            const allCounts = allCount.reduce((prev, cur) => {
                return add(prev, cur, 0)
            }, 0)
            this.countAll = allCounts
        },
        /**
         * @name: 预收货弹窗控制
         */
        addGoodsDvance () {
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            this.goodsDvancePams = {
                provider: this.form.getFieldValue('provider'),
                storeCode: this.$store.getters.storeInfo.code,
                type: 'bill_pre_entry_rec_type:2',
                billStatus: 'bill_pre_entry_status:2',
                billsData: this.billsData
            }
            this.goodsDvanceQuery = true
        },
        /**
         * @name:监听供应商
         */
        providerChange (e) {
            console.log(e, '供应商')
            if (this.billsData.length === 0) {
                this.provider = e
            }
            if (this.billsData.length > 0) {
                const that = this
                that.$confirm({
                    title: '',
                    content: '当前操作将会清除明细,是否继续?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.form.setFieldsValue({ sourceCode: '' })
                        that.billsData = []
                        that.provider = e
                        that.countAll = 0
                        that.amontIn = 0
                        that.amuntExcludingTaxIn = 0
                        that.amountSale = 0
                    },
                    onCancel () {
                        // that.billsForm.provider = that.provider
                        that.form.setFieldsValue({ provider: that.provider })
                        console.log(that.billsForm.provider, 55555555)
                    }
                })
            }
        },
        /**
         * @name:选中添加的商品
         */
        selectData (e) {
            console.log(e)
            const { objArr } = e
            const { add, div } = this.$math
            this.form.setFieldsValue({ sourceCode: '' })
            if (e.obj === 'empty') {
                this.billsData = []
                this.amontIn = 0
                this.amountSale = 0
                this.amuntExcludingTaxIn = 0
            }
            const error = []
            objArr.forEach(i => {
                const list = this.billsData.filter(o => o.skuCode === i.skuCode)
                if (list.length === 0) {
                    this.billsData.unshift({
                        detailId: i.id,
                        entryDetailType: 1,
                        inputState: this.inputState,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        model: i.skuModel,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        basicUnit: i.skuUnit,
                        priceIn: i.stockPrice,
                        taxRate: i.skuTaxRate,
                        taxRates: this.rateTransform(i.skuTaxRate),
                        price: i.skuPrice,
                        priceCost: i.stockPrice,
                        entryQttys: 0,
                        entryQtty: 0,
                        // 进价不含税
                        onPriceIn: div(i.stockPrice, add(1, i.skuTaxRate)),
                        // 进价总额
                        amontIn: 0,
                        // 进价总额不含税
                        amuntExcluding: 0,
                        // 零售价总额
                        amountRetail: 0
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
            console.log(this.billsData, 999999999)
        },
        /**
         * @name: 输入计算
         */
        count (data) {
            console.log(data, 'bainge')
            const { add, mul, div } = this.$math
            if (data.length > 0) {
                const arr = []
                const arrs = []
                const allCount = []
                data.forEach(i => {
                    // 进货价不含税
                    i.onPriceIn = div(i.priceIn, add(1, i.taxRate))
                    // 进价总额 进价*入库数量
                    i.amontIn = mul(i.priceIn, i.entryQtty)
                    // 进价总额不含税
                    i.amuntExcluding = mul(div(i.priceIn, add(1, i.taxRate)), i.entryQtty)
                    // 零售价总额 零售价*入库数量
                    i.amountRetail = mul(i.price, i.entryQtty)
                    arr.push(mul(i.priceIn, i.entryQtty))
                    arrs.push(mul(i.price, i.entryQtty))
                    allCount.push(i.entryQtty)
                })
                // 进价总额
                const amontInAll = arr.reduce((prev, cur) => {
                    return add(prev, cur, 2)
                }, 0)
                this.amontIn = amontInAll.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.amuntExcludingTaxIn = div(amontInAll, add(1, data[0].taxRate)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                // 零售价总额
                const amountSaleAll = arrs.reduce((prev, cur) => {
                    return add(prev, cur, 2)
                }, 0)
                this.amountSale = amountSaleAll.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                console.log(this.amountSale, '总额')
                const allCounts = allCount.reduce((prev, cur) => {
                    return add(prev, cur, 0)
                }, 0)
                this.countAll = allCounts
            } else {
                this.amontIn = 0
                this.amuntExcludingTaxIn = 0
                this.amountSale = 0
                this.countAll = 0
            }
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const { div, mul } = this.$math
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[key] = val
                if (key !== 'note' && is.not.number(val) && val < 0) {
                    return this.$message.warning('请输入数字!')
                }
                if (key === 'entryQtty') {
                    if (target['entryDetailType'] === 3 && target['entryQtty'] > Number(target['entryQttys'])) {
                        console.log(target['entryQttys'])
                        return this.$message.warning('入库数量不能大于订货未收量!')
                    }
                }
                if (key === 'priceIn') {
                    const num = div(target['priceIn'], target['priceCost'], 2)
                    console.log(Number(num), Number(this.rate), target['priceCost'], '进价限制')
                    if (Number(num) > Number(this.rate)) {
                        this.$message.warning('进价受限!')
                        target['priceIn'] = mul(target['priceCost'], this.rate)
                    }
                }
                if (target['priceIn'] && target['entryQtty']) {
                    console.log(target)
                    this.count(newData)
                }
                this.billsData = newData
            }
        },
        /**
        * @name:保存单据
        */
        submitData (e) {
            // this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                const { div } = this.$math
                if (!err) {
                    const formDate = values
                    const err = []
                    formDate.billEntryDetails = [...this.billsData]
                    if (formDate.billEntryDetails.length === 0) {
                        this.loading = false
                        return this.$message.error('请选择明细,明细不能为空!')
                    }
                    for (const i of formDate.billEntryDetails) {
                        console.log(i.entryQtty, '777777777777')
                        if (i['entryDetailType'] === 3 && i['entryQtty'] > Number(i['entryQttys'])) {
                            err.push(i.skuName)
                        }
                        if (!i.entryQtty || i.entryQtty < 1) {
                            this.loading = false
                            return this.$message.warning('当前提交数据入库数量不能小于1!')
                        }
                        if (!i.priceIn) {
                            this.loading = false
                            return this.$message.warning('当前提交数据进价不能小于1!')
                        }
                        const num = div(i['priceIn'], i['priceCost'], 2)
                        console.log(this.rate)
                        if (this.inputState && Number(num) > Number(this.rate)) {
                            this.loading = false
                            return this.$message.warning('当前明细中进价受限!')
                        }
                        if (i['entryDetailType'] === 3 && i['entryQtty'] > Number(i['entryQttys'])) {
                            this.loading = false
                            return this.$message.warning('当前明细中入库数量上限!')
                        }
                    }
                    if (err.length > 0) {
                        this.loading = false
                        return this.$message.warning('当前提交明细' + err.join(',') + '入库数量上限!')
                    }
                    formDate.entryMakeStoreCode = formDate.entryMakeStoreCode.split(':')[0]
                    formDate.makeStoreCode = formDate.makeStoreCode.split(':')[0]
                    formDate.makeUserCode = formDate.makeUserCode.split(':')[0]
                    formDate.amontIn = this.sumChangeS(this.amontIn)
                    formDate.amuntExcludingTaxIn = this.sumChangeS(this.amuntExcludingTaxIn)
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    }
                    axios({
                        path: this.bt_Save ? 'DistributionBillEntryUpdateEntry' : 'DistributionBillEntryAddEntry',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.clientVisible = false
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
    * @name: 添加商品打开弹窗
    */
        addManage () {
            console.log(this.form.getFieldValue('sourceCode'), '新增单据')
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            this.flagObj = {
                flagLength: this.billsData.length,
                sourceCode: this.form.getFieldValue('sourceCode'),
                url: true
            }
            this.pamsBounced.provider = this.form.getFieldValue('provider')
            this.pamsBounced.storeCode = this.form.getFieldValue('makeStoreCode').split(':')[0]
            this.storeQuery = true
        },
        /**
    * @name: 单据表格多选
    */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
    * @name:单据表格删除
    */
        categoryinfoDelete (del) {
            console.log(del, '单据删除')
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.skuCode !== del)
            }
            this.selectedRowKeys = []
            this.count(this.billsData)
        },
        /**
    * @name: 点击新增 清空数据
    * @msg:
    * @param {type}
    * @return:
    */
        empty () {
            this.orderId = ''
            this.tags = []
            this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            this.billsForm = {}
            this.billsData = []
            this.getAll()
            this.countAll = 0
            this.amontIn = 0
            this.amuntExcludingTaxIn = 0
            this.amountSale = 0
            this.bt_Save = false
        },
        /**
         * @name: 删除
         */
        onDelete (del) {
            if (this.selectedRowKeys.length < 1) { return this.$message.warning('您尚未选中数据!') }
            const that = this
            this.$confirm({
                title: '删除',
                content: '是否确认删除当前选中信息?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    that.categoryinfoDelete(del)
                },
                onCancel () {

                }
            })
        },
        /**
         * @name: 下拉框
         */
        getAll () {
            // 获取退货人信息
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '负责人')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.customerLIst = [...data]
                }
            })
            // 获取供应商
            axios({
                path: 'CustomerSupplierFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '供应商')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.providerList = [...data]
                }
            })
            // 参数查询
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: { type: 'if_allow_update_price', grade: '2' }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '获取进价参数')
                    if (res.data.length > 0 && res.data[0].value === '1') {
                        this.inputState = true
                        axios({
                            path: 'OrganizationConfigFindByType',
                            method: 'post',
                            body: { type: 'if_update_price_rate', grade: '2' }
                        }).then(res => {
                            if (res.flag === 1) {
                                console.log(res.data, '参数2')
                                this.rate = res.data[0].value
                            }
                        })
                    } else {
                        this.inputState = false
                    }
                }
            })
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }

}
</script>
</template>

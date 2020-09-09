<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-04-02 14:38:23
 * @LastEditTime: 2019-08-28 12:19:55
 -->
<template>
  <div>
    <!-- 供应商结算 -->
    <bt-modal
      v-model="BtVisible"
      title="供应商结算单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">结算单据</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.code',{initialValue:billsForm.code})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.provider',{initialValue:billsForm.provider})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">合同编码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.contractCode',{initialValue:billsForm.contractCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">截止日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.closeTime',{initialValue:billsForm.closeTime})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">付款日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.payTime',{initialValue:billsForm.payTime})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">店代码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.makeStoreCode',{initialValue:billsForm.makeStoreCode || $store.getters.storeInfo.code} )" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.upStoreCode',{initialValue:billsForm.upStoreCode || upStoreCode })" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">本期应结</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('BillPay.suggestPay',{initialValue:billsForm.suggestPay || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">扣费明细</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('BillPay.rebate',{initialValue:billsForm.rebate || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">费用核销</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('BillPay.fee',{initialValue:billsForm.fee || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">本期结算</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('BillPay.shouldPay',{initialValue:billsForm.shouldPay || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">销售总额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('BillPay.amountIn',{initialValue:billsForm.amountIn || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索负责人"
                v-decorator="$check('BillPay.chargeUserno', {initialValue:billsForm.chargeUserno})"
                :options="customerLIst"
                @search="handleSearchBuyBy"
                :filterOption="false"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">会计</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索会计"
                @search="handleSearchBuyBy"
                :filterOption="false"
                showSearch
                v-decorator="$check('BillPay.accountUserno', {initialValue:billsForm.accountUserno})"
                :options="customerLIst"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('BillPay.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <h2>
            本期付款(大写): {{ billsForm.paid }}
          </h2>
        </a-row>
        <h4 class="baseInfo">结算明细</h4>
        <a-button class="editable-add-btn" @click="addManage">选择结算供应商</a-button>
        <a-button class="editable-add-btn" @click="reconsitution">重算单据</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-tabs @change="callback" type="card">
          <a-tab-pane tab="销售明细" key="1">
            <a-table
              :dataSource="salesDetailData"
              :columns="salesDetailColumns"
              rowKey="id"
              :scroll="{x: 2050, y:350}"
              :pagination="false"
              size="small"
              bordered>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="扣费明细" key="2">
            <a-table
              :pagination="false"
              :dataSource="deductionDetailData"
              :columns="deductionDetailColumns"
              rowKey="id"
              :scroll="{x: 1050,y:350}"
              size="small"
              bordered>
              <template v-for="col in ['factFee']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input-number
                    v-if="col === 'factFee'"
                    style="margin: -5px 0;width:100%;"
                    :min="0.00"
                    :max="Number.MAX_SAFE_INTEGER"
                    :step="1"
                    :precision="2"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    :value="text"
                    @change="e => InputStorageChange(e, record.id, col)" />
                </div>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="费用监控单" key="3">
            <a-table
              :rowSelection="{selectedRowKeys: costMonitoringRow, onChange: onCostMonitoring}"
              :pagination="false"
              :dataSource="costMonitoringData"
              :columns="costMonitoringColumns"
              rowKey="id"
              :scroll="{x: 2050}"
              size="small"
              bordered>
              <template v-for="col in ['factFee']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input-number
                    v-if="col === 'factFee'"
                    style="margin: -5px 0;width:100%;"
                    :min="0.00"
                    :max="Number.MAX_SAFE_INTEGER"
                    :step="1"
                    :precision="2"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    :value="text"
                    @change="e => InputCostChange(e, record.id, col)" />
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span>
                    <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.id)" okText="是" cancelText="否">
                      <a href="#">删除</a>
                    </a-popconfirm>
                  </span>
                </div>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code} : ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPay.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <SelectSuppliers ref="SelectSuppliersRef" :visible.sync="perVisible" @onselect="selectData"/>
    </bt-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import SelectSuppliers from '@pages/settlement/SupplierSettlementManagement/Suppluer/selectSuppliers'
import moment from 'moment'
import BtModal from '@comp/Modal'
import { lowToUp } from '@utils/util'
// 销售明细
const salesDetailColumns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '销售单号', dataIndex: 'sourceCode', width: 200, align: 'left' },
    { title: '分店编码', dataIndex: 'storeCodeSale', width: 150, align: 'left' },
    { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'left' },
    { title: '商品编码', dataIndex: 'skuCode', width: 150, align: 'left' },
    { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'left' },
    { title: '规格', dataIndex: 'skuModel', width: 150, align: 'left' },
    { title: '日期', dataIndex: 'dateOfOccurrence', width: 200, align: 'left' },
    { title: '扣率', dataIndex: 'discounts', width: 100, align: 'right' },
    { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'right' },
    { title: '数量', dataIndex: 'saleNumber', width: 100, align: 'right' },
    { title: '商场毛利', dataIndex: 'saleProfit', width: 200, align: 'right' },
    { title: '应付金额', dataIndex: 'shouldPay', width: 200, align: 'right' },
    { title: '应付金额(不含税)', dataIndex: 'CaoPriceIn', width: 200, align: 'right' },

    { title: '税率', dataIndex: 'taxRates', width: 200, align: 'right' },
    { title: '备注', dataIndex: 'note', width: 200, align: 'left' }
]
// 扣费明细
const deductionDetailColumns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '时间', dataIndex: 'dateOfOccurrence', width: 200, align: 'left' },
    { title: '合同单号/活动单号', dataIndex: 'scheduleDefineCode', width: 150, align: 'left' },
    { title: '项目名称', dataIndex: 'feeTypeName', width: 150, align: 'left' },
    { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'right' },
    { title: '比率', dataIndex: 'ratio', width: 100, align: 'right' },
    { title: '应扣费用', dataIndex: 'shouldFee', width: 150, align: 'right' },
    { title: '实扣费用', dataIndex: 'factFee', width: 150, align: 'right', scopedSlots: { customRender: 'factFee' } },
    { title: '税率', dataIndex: 'taxRates', width: 150, align: 'right' },
    { title: '销售单号', dataIndex: 'sourceCode', width: 150, align: 'left' },
    { title: '备注', dataIndex: 'note', width: 200, align: 'left' }
]
// 费用监控单
const costMonitoringColumns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '单据号', dataIndex: 'sourceCode', width: 200, align: 'left' },
    { title: '费用类型', dataIndex: 'feeType', width: 150, align: 'left' },
    { title: '分店编码', dataIndex: 'storeCodeSale', width: 200, align: 'left' },
    { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'left' },
    { title: '品类编码', dataIndex: 'classCode', width: 150, align: 'left' },
    { title: '品类名称', dataIndex: 'className', width: 150, align: 'left' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 150, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
    { title: '经营类型', dataIndex: 'businessTypeName', width: 100, align: 'left' },
    { title: '销售数量', dataIndex: 'saleNumber', width: 200, align: 'right' },
    { title: '销售总额', dataIndex: 'saleAmount', width: 150, align: 'right' },
    { title: '实扣费用', dataIndex: 'factFee', width: 150, align: 'right', scopedSlots: { customRender: 'factFee' } },
    { title: '应扣费用', dataIndex: 'shouldFee', width: 150, align: 'right' },
    { title: '备注', dataIndex: 'note', width: 500, align: 'left' },
    { title: '操作', dataIndex: 'operation', fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'DocumentSettlement',
    components: { SelectSuppliers, BtModal },
    props: {
        btsave: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            BtVisible: false,
            tags: [],
            orderId: '',
            loading: false,
            bt_id: '',
            tabChange: '1',
            // 隶属公司
            upStoreCode: '',
            // 费用监控单表头
            costMonitoringColumns,
            // 费用监控单数据
            costMonitoringData: [],
            // 费用监控单选中
            costMonitoringRow: [],
            // 扣费明细表头
            deductionDetailColumns,
            // 扣费明细数据
            deductionDetailData: [],
            // 扣费明细选中
            deductionDetailRow: [],
            // 销售明细表头
            salesDetailColumns,
            // 销售明细数据
            salesDetailData: [],
            // 销售明细选中数据
            salesDetailRow: [],
            // 负责人
            customerLIst: [],
            // 默认表单数据
            billsForm: {},
            // 控制选择供应商
            perVisible: false,
            // 定义表单
            form: this.$form.createForm(this),
            // 制单时间
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            indexNumberOne: 1,
            indexNumberTwo: 1,
            indexNumberThree: 1
        }
    },
    watch: {
        value: {
            handler (val) {
                this.BtVisible = val
                console.log(val, 555555)
            },
            immediate: true
        },
        BtVisible (val) {
            this.$emit('input', val)
            if (!val) {
                this.indexNumberOne = 1
                this.indexNumberTwo = 1
                this.indexNumberThree = 1
            }
        }
    },
    mounted () {

    },
    methods: {
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerLIst.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
        getData (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.customerLIst = data
                }
            })
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 重算金额
         */
        reconsitution () {
            console.log('重算')
            this.countAll(this.salesDetailData, this.deductionDetailData, this.costMonitoringData)
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            const obj = { ...e }
            console.log(obj, '编辑数据')
            this.bt_id = obj.id
            this.orderId = obj.code
            this.tags = ['uncheck']
            // obj.provider = `${obj.provider}:${obj.providerName}`
            obj.makeUserno = `${obj.makeUserno}:${obj.makeUserName}`
            this.billsForm = obj
            axios({
                path: 'SupplierPayFindDetail',
                method: 'post',
                body: {
                    id: obj.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { add, div } = this.$math
                    if (res.data.salesDetails.length > 0) {
                        for (const i of res.data.salesDetails) {
                            i.index = this.indexNumberOne++
                            i.taxRates = this.rateTransform(i.taxRate)
                            i.CaoPriceIn = div(i.shouldPay, add(1, i.taxRate))
                        }
                    }
                    if (res.data.deductionDetails.length > 0) {
                        for (const i of res.data.deductionDetails) {
                            i.index = this.indexNumberTwo++
                        }
                    }
                    if (res.data.feeDetails.length > 0) {
                        for (const i of res.data.feeDetails) {
                            i.index = this.indexNumberThree++
                        }
                    }
                    this.salesDetailData = res.data.salesDetails
                    this.deductionDetailData = res.data.deductionDetails
                    this.costMonitoringData = res.data.feeDetails
                    this.reconsitution()
                }
            })
        },
        /**
         * @name: 删除方法:
         */
        delChange (data, row) {
            const salesDetailData = data
            for (const i in row) {
                for (const j in salesDetailData) {
                    if (salesDetailData[j].id === row[i]) {
                        salesDetailData.splice(j, 1)
                    }
                }
            }
            data = salesDetailData
        },
        /**
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            if (del === -1) {
                if (this.tabChange === '1' && this.salesDetailRow.length > 0) {
                    console.log(323242341)
                    this.delChange(this.salesDetailData, this.salesDetailRow)
                } else if (this.tabChange === '2' && this.deductionDetailRow.length > 0) {
                    this.delChange(this.deductionDetailData, this.deductionDetailRow)
                } else if (this.tabChange === '3' && this.costMonitoringRow.length > 0) {
                    this.delChange(this.costMonitoringData, this.costMonitoringRow)
                }
            } else {
                const costMonitoringData = [...this.costMonitoringData]
                this.costMonitoringData = costMonitoringData.filter(item => item.id !== del)
            }
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.deductionDetailData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                this.countAll(this.salesDetailData, this.deductionDetailData, this.costMonitoringData)
                this.deductionDetailData = newData
            }
        },
        /**
         * @name:监听编辑
         */
        InputCostChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.costMonitoringData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                this.countAll(this.salesDetailData, this.deductionDetailData, this.costMonitoringData)
                this.costMonitoringData = newData
            }
        },
        /**
         * @name: 添加明细
         */
        onblendSelect (billsData, e, index) {
            const error = []
            if (billsData.length > 0) {
                // 循环表格 判断是否有重复添加,
                e.forEach(item => {
                    // 找出不重复项
                    const list = e.filter(o => o.detailId === item.detailId)
                    // 不重复项, 添加到单据表格
                    if (list.length === 0) {
                        if (index === 'one') {
                            item.index = this.indexNumberOne++
                        } else if (index === 'two') {
                            item.index = this.indexNumberTwo++
                        } else if (index === 'three') {
                            item.index = this.indexNumberThree++
                        }
                        billsData.push(item)
                    } else {
                        error.push(item.name)
                    }
                })
            } else {
                const item = { ...e[0] }
                if (index === 'one') {
                    item.index = this.indexNumberOne++
                } else if (index === 'two') {
                    item.index = this.indexNumberTwo++
                } else if (index === 'three') {
                    item.index = this.indexNumberThree++
                }
                billsData.push(item)
            }
            // 重复提示
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name:选中结算供应商数据
         */
        selectData (e) {
            console.log(e, '9999999999999999999999999999999999')
            if (e.salesDetailList.length > 0) {
                this.onblendSelect(this.salesDetailData, e.salesDetailList, 'one')
            }
            if (e.deductionDetailList.length > 0) {
                this.onblendSelect(this.deductionDetailData, e.deductionDetailList, 'two')
            }
            if (e.costMonitoringList.length > 0) {
                this.onblendSelect(this.costMonitoringData, e.costMonitoringList, 'three')
            }
            this.form.setFieldsValue({
                provider: e.formData.provider,
                contractCode: e.formData.contractCode,
                closeTime: e.formData.closeTime
            })
            this.countAll(this.salesDetailData, this.deductionDetailData, this.costMonitoringData)
        },
        /**
         * @name:计算
         */
        countAll (salesDetailData, deductionDetailData, costMonitoringData) {
            const { add, sub } = this.$math
            // 计算本期应结
            const sArr = []
            const aArr = []
            salesDetailData.forEach(e => {
                sArr.push(e.shouldPay)
                aArr.push(e.saleAmount)
            })
            const suggestPay = sArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            const amountIn = aArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            const dArr = []
            deductionDetailData.forEach(e => {
                dArr.push(e.factFee)
            })
            const rebate = dArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            const cArr = []
            costMonitoringData.forEach(e => {
                cArr.push(e.shouldFee)
            })
            const fee = dArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            const shouldPay = sub(sub(suggestPay, rebate), fee)
            const paid = lowToUp(shouldPay)
            this.billsForm.paid = paid
            this.form.setFieldsValue({ suggestPay: suggestPay, rebate: rebate, fee: fee, amountIn: amountIn, shouldPay: shouldPay })
        },
        /**
         * @name:提交单据
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.upStoreCode = formDate.upStoreCode.split(':')[0]
                    formDate.makeUserno = formDate.makeUserno.split(':')[0]
                    formDate.provider = formDate.provider.split(':')[0]
                    formDate.billPayDetails = [...this.salesDetailData, ...this.deductionDetailData, ...this.costMonitoringData]
                    if (this.$props.btsave) {
                        formDate.id = this.bt_id
                    }
                    console.log(formDate, '保存')
                    axios({
                        path: this.$props.btsave ? 'SupplierPayUpdate' : 'SupplierPayAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.odd = ''
                            this.BtVisible = false
                            // this.$emit('update:visible', false)
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:打开选择供应商弹窗
         */
        addManage () {
            this.$refs.SelectSuppliersRef.locating(1)
            this.perVisible = true
        },
        /**
         * @name:销售明细选中
         */
        onSalesSales (e) {
            this.salesDetailRow = e
            console.log(this.salesDetailRow, '选中销售明细')
        },
        /**
         * @name:扣费明细选中
         */
        onSalesDeduction (e) {
            this.deductionDetailRow = e
            console.log(this.deductionDetailRow, '选中扣费明细')
        },
        /**
         * @name:选中费用监控
         */
        onCostMonitoring (e) {
            this.costMonitoringRow = e
            console.log(this.costMonitoringRow, '选中费用监控单')
        },
        /**
         * @name:tab栏切换
         */
        callback (key) {
            this.tabChange = key
            console.log(key, '切换tab')
        },
        /**
         * @name: 清理表格数据 / 更新时间
         */
        clearAll () {
            this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            this.salesDetailData = []
            this.deductionDetailData = []
            this.costMonitoringData = []
            this.billsForm = {}
            this.orderId = ''
            this.tags = []
        },
        /**
         * @name:隶属公司
         */
        onUpStoreCode () {
            this.clearAll()
            axios({
                path: 'OrganizationStoreFindStoreByCode',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '隶属公司')
                    const data = res.data
                    this.upStoreCode = `${data.code}:${data.name}`
                }
            })
        }
    }
}
</script>
<style lang="less">
    @import "../../../../assets/modalStyle.less";
</style>
<style scoped>
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
        line-height: 2
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
    h2 {
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        height: 100%;
        margin-bottom: 0;
    }
</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-04-02 18:03:37
 * @LastEditTime: 2019-08-28 13:47:47
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择供应商"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <h2 style="text-align:center">选择结算供应商</h2>
      <a-form :form="form">
        <a-row>
          <a-col :span="2" class="col">供应商</a-col>
          <a-col :span="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('BillPay.provider', {initialValue:SelectSuppliers.provider})"
                :options="customerLIst"
                @search="handleSearchBuyBy"
                :filterOption="false"
                @change="onChange"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="2" class="col">合同编码</a-col>
          <a-col :span="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('BillPay.contractCode', {initialValue:SelectSuppliers.contractCode})"
                :options="contractCodeList"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="2" class="col">截止日期</a-col>
          <a-col :span="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                allowClear
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('BillPay.closeTime',{initialValue:SelectSuppliers.closeTime || closeTime})"
              />
            </a-form-item>
          </a-col>
          <a-button v-if="!inheritAttrs" key="submit" type="primary" @click="locating">查询</a-button>
          <a-popconfirm
            v-if="inheritAttrs"
            title="已存在数据,是否刷新数据!"
            @confirm="locating"
            okText="是"
            cancelText="否">
            <a-button type="primary">查询</a-button>
          </a-popconfirm>
        </a-row>
      </a-form>
      <div class="tabsStyle">
        <a-tabs @change="callback" type="card">
          <a-tab-pane tab="销售明细" key="1">
            <a-table
              :pagination="{defaultPageSize:5}"
              :dataSource="salesDetailData"
              :columns="salesDetailColumns"
              rowKey="id"
              :scroll="{x: 1500}"
              size="small"
              bordered>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="扣费明细" key="2">
            <a-table
              :pagination="{defaultPageSize:5}"
              :dataSource="deductionDetailData"
              :columns="deductionDetailColumns"
              rowKey="id"
              :scroll="{x: 1000}"
              size="small"
              bordered>
            </a-table>
          </a-tab-pane>
          <a-tab-pane tab="费用监控单" key="3">
            <a-table
              :rowSelection="{selectedRowKeys: costMonitoringRow, onChange: onCostMonitoring}"
              :pagination="{defaultPageSize:5}"
              :dataSource="costMonitoringData"
              :columns="costMonitoringColumns"
              rowKey="id"
              :scroll="{x: 2000}"
              size="small"
              bordered>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div slot="footer">
        <a-button @click="() => {$emit('update:visible', false)}" size="small" >取消</a-button>
        <a-button @click="blendProSubmit" type="primary" size="small" >确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import is from 'is_js'
import moment from 'moment'
import { axios } from '@/utils/request'
// 销售明细
const salesDetailColumns = [
    { title: '分店编码', dataIndex: 'storeCodeSale', width: 150, align: 'left' },
    { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'left' },
    { title: '商品编码', dataIndex: 'skuCode', width: 150, align: 'left' },
    { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'left' },
    { title: '规格', dataIndex: 'skuModel', width: 150, align: 'left' },
    { title: '日期', dataIndex: 'dateOfOccurrence', width: 200, align: 'left' },
    { title: '扣率', dataIndex: 'discounts', width: 100, align: 'right' },
    { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'right' },
    { title: '数量', dataIndex: 'saleNumber', width: 150, align: 'right' },
    { title: '商场毛利', dataIndex: 'saleProfit', width: 150, align: 'right' },
    { title: '销售单号', dataIndex: 'sourceCode', width: 150, align: 'left' },
    { title: '税率', dataIndex: 'taxRates', width: 100, align: 'right' },
    { title: '备注', dataIndex: 'note', width: 200, align: 'left' }
]
// 扣费明细
const deductionDetailColumns = [
    { title: '时间', dataIndex: 'dateOfOccurrence', width: 200, align: 'left' },
    { title: '合同单号/活动单号', dataIndex: 'scheduleDefineCode', width: 250, align: 'left' },
    { title: '项目名称', dataIndex: 'feeTypeName', width: 150, align: 'left' },
    { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'right' },
    { title: '比率', dataIndex: 'ratio', width: 100, align: 'right' },
    { title: '应扣费用', dataIndex: 'shouldFee', width: 150, align: 'right' },
    { title: '实扣费用', dataIndex: 'factFee', width: 200, align: 'right' },
    { title: '税率', dataIndex: 'taxRates', width: 150, align: 'right' },
    { title: '销售单号', dataIndex: 'sourceCode', width: 150, align: 'left' },
    { title: '备注', dataIndex: 'note', width: 200, align: 'left' }
]
// 费用监控单
const costMonitoringColumns = [
    { title: '单据号', dataIndex: 'code', width: 200, align: 'left' },
    { title: '费用类型', dataIndex: 'name', width: 150, align: 'left' },
    { title: '分店编码', dataIndex: 'storeCode', width: 200, align: 'left' },
    { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'left' },
    { title: '品类编码', dataIndex: 'classCode', width: 150, align: 'left' },
    { title: '品类名称', dataIndex: 'className', width: 150, align: 'left' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 150, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
    { title: '经营类型', dataIndex: 'goodsTypeName', width: 100, align: 'left' },
    { title: '销售数量', dataIndex: 'saleNumber', width: 200, align: 'right' },
    { title: '销售总额', dataIndex: 'saleAmount', width: 150, align: 'right' },
    { title: '销售占比', dataIndex: 'shareRates', width: 150, align: 'right' },
    { title: '费用', dataIndex: 'fee', width: 150, align: 'right' },
    { title: '备注', dataIndex: 'note', width: 500, align: 'left' }
]
export default {
    name: 'SelectSuppliers',
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            SelectSuppliers: {},
            // 查询数据
            formData: {},
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
            // 合同编码数据
            contractCodeList: [],
            // 供应商数据
            customerLIst: [],
            // 截止日期
            closeTime: moment().subtract(1, 'days'),
            // 定义表单
            form: this.$form.createForm(this)
        }
    },
    computed: {
        inheritAttrs () {
            return this.salesDetailData.length > 0 || this.deductionDetailData.length > 0 || this.costMonitoringData.length > 0
        }
    },
    mounted () {
    },
    methods: {
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerLIst.length = 0
                this.getData({
                    name: value
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
         * @name:确认选中
         */
        blendProSubmit () {
            // 单据明细汇总对象
            const selectDatas = {
                salesDetailList: [],
                deductionDetailList: [],
                costMonitoringList: [],
                formData: this.formData
            }
            // 引入计算
            const { sub, add, div, mul } = this.$math
            // 过滤销售明细选中数据
            const salesDetailList = this.salesDetailData
            // 过滤扣费明细选中数据
            const deductionDetailList = this.deductionDetailData
            // 过滤费用监控单选中数据
            const costMonitoringList = this.costMonitoringData.filter(s => is.inArray(s.id, this.costMonitoringRow))
            console.log(costMonitoringList, '监控')
            // 销售明细
            if (salesDetailList.length > 0) {
                for (const i of salesDetailList) {
                    i.detailId = i.id
                    i.taxRates = this.rateTransform(i.taxRate)
                    i.discounts = this.rateTransform(i.discount)
                    i.payType = 'bill_pay_detail_pay_type:1'
                    // 计算应付金额(含税) = 销售额 -应扣费用(应扣费用=round(销售额*扣率/100,2))
                    i.shouldPay = sub(i.saleAmount, mul(i.discount, i.saleAmount))
                    // 应付金额(不含税)=应付金额(含税)/(1+税率)
                    i.CaoPriceIn = div(sub(i.saleAmount, mul(i.discount, i.saleAmount)), add(1, i.taxRate))
                }
                selectDatas.salesDetailList.push(...salesDetailList)
            }
            if (deductionDetailList.length > 0) {
                deductionDetailList.forEach(e => {
                    e.taxRates = this.rateTransform(e.taxRate)
                    e.payType = 'bill_pay_detail_pay_type:2'
                    e.detailId = e.id
                })
                selectDatas.deductionDetailList.push(...deductionDetailList)
            }
            // 监控单
            if (costMonitoringList.length > 0) {
                for (const i of costMonitoringList) {
                    i.detailId = i.id
                    i.payType = 'bill_pay_detail_pay_type:3'
                    i.feeType = i.name
                    i.businessType = i.goodsType
                    i.businessTypeName = i.goodsTypeName
                    i.sourceCode = i.code
                    i.storeCodeSale = i.storeCode
                    i.shouldFee = i.fee
                    i.factFee = i.fee
                    i.detailId = i.id
                }
                selectDatas.costMonitoringList.push(...costMonitoringList)
            }
            if (selectDatas.costMonitoringList.length > 0 || selectDatas.deductionDetailList.length > 0 || selectDatas.salesDetailList.length > 0) {
                this.$emit('onselect', selectDatas)
                this.$emit('update:visible', false)
                this.clearAll()
            } else {
                return this.$message.warning('选中数据为空,请先选择至少一条数据!')
            }
        },
        /**
         * @name: 干掉选中
         */
        clearAll () {
            this.salesDetailRow = []
            this.deductionDetailRow = []
            this.costMonitoringRow = []
            this.salesDetailData = []
            this.deductionDetailData = []
            this.costMonitoringData = []
        },
        /**
         * @name:销售明细选中
         */
        onSalesSales (e) {
            this.salesDetailRow = e
            console.log(e, '选中销售明细')
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
         * @name: tab切换
         */
        callback (key) {
            console.log(key, 'tab切换')
        },
        /**
         * @name: 截止时间
         */
        signDtDisabledDate (e) {
            return moment(e) < moment(this.closeTime) || moment(e) > moment().subtract({ days: 1 })
        },
        /**
         * @name: 监听供应商 调出当前供应商下合同编码
         */
        onChange (e) {
            console.log(e, '供应商')
            if (!e) {
                this.contractCodeList = []
                this.form.setFieldsValue({ contractCode: '' })
            } else {
                axios({
                    path: 'SupplierPayFindBeginTime',
                    method: 'post',
                    body: {
                        provider: e,
                        makeStoreCode: this.$store.getters.storeInfo.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res)
                        this.closeTime = moment(res.data)
                    }
                })
            }
            // 获取合同编码
            axios({
                path: 'SupplierPayFindContractByProvider',
                method: 'post',
                body: {
                    provider: e
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.providerContractName}`
                        i.value = i.code
                    })
                    this.form.setFieldsValue({ contractCode: '' })
                    this.contractCodeList = [...data]
                } else {
                    this.form.setFieldsValue({ contractCode: '' })
                    this.contractCodeList = []
                }
            })
        },
        /**
         * @name: 查询
         */
        locating (e) {
            if (e === 1) {
                this.salesDetailData = []
                this.deductionDetailData = []
                this.costMonitoringData = []
                this.SelectSuppliers = {}
                return
            }
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    values.closeTime = moment(values.closeTime).startOf('day').format('YYYY-MM-DD')
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    this.formData = values
                    // 监控单
                    axios({
                        path: 'ProviderMonitorFindDetailByProvider',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('费用监控', res.data)
                            const data = res.data.list
                            data.forEach((i) => {
                                console.log(i.shareRate, '6666666666666666666')
                                i.shareRates = this.rateTransform(i.shareRate)
                                i.taxRates = this.rateTransform(i.taxRate)
                            })
                            this.costMonitoringData = [...data]
                        }
                    })
                    // 销售明细
                    axios({
                        path: 'SupplierPayFindSalesDetail',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('销售明细', res.data)
                            const data = res.data
                            data.forEach((i) => {
                                i.taxRates = this.rateTransform(i.taxRate)
                            })
                            this.salesDetailData = [...data]
                        }
                    })
                    // 扣费明细
                    axios({
                        path: 'SupplierPayFindDeductionDetail',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('扣费明细', res.data)
                            const data = res.data
                            data.forEach((i) => {
                                i.taxRates = this.rateTransform(i.taxRate)
                            })
                            this.deductionDetailData = [...data]
                        }
                    })
                }
            })
        },
        /**
         * @name:监听入库单表格编辑
         */
        InputStorageChange (val, count, key) {
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.deductionDetailData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                this.blendData = newData
            }
        }
    }
}
</script>
<style lang="less">
    .col {
        height: 38px;
        line-height: 38px;
        text-align: right;
        padding-right:2px;
    }
    .tabsStyle {
        .ant-tabs-bar {
            margin: 0;
            border-bottom: 0;
            .ant-tabs-nav {
                width: 100%;
                .ant-tabs-tab {
                    margin-right: 0;
                    width: 33.333%;
                    text-align: center;
                    border-radius: 0;
                }
            }
        }
    }

</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 11:33:24
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:25:42
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="供应商结算"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="销售明细" :isTable="true" :columns="columnsA" :data="salesDetailData"></div>
    <div slot="D" title="扣费明细" :isTable="true" :columns="columnsB" :data="deductionDetailData"></div>
    <div slot="E" title="费用监控单" :isTable="true" :columns="columnsC" :data="costMonitoringData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `负责人:${previewFooters.chargeUserno || ''}` }}</pre>
          <pre>{{ `制单人:${previewFooters.makeUserno || ''}` }}</pre>
          <pre>{{ `审核人：${previewFooters.auditUserno || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `会计：${previewFooters.accountUserno || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.auditTime || ''}` }}</pre>
        </a-col>
      </a-row>
    </div>
  </preview>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
export default {
    components: { Preview },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            previewVisbel: false,
            tags: [],
            previewContent: {},
            previewFooters: {},
            previewHeaders: [
                { key: 'code', name: '结算单据' },
                { key: 'provider', name: '供应商' },
                { key: 'contractCode', name: '合同编码' },
                { key: 'closeTime', name: '截止日期' },
                { key: 'payTime', name: '付款日期' },
                { key: 'makeStoreCode', name: '店代码' },
                { key: 'upStoreCode', name: '隶属公司' },
                { key: 'suggestPay', name: '本期应结' },
                { key: 'rebate', name: '扣费明细' },
                { key: 'fee', name: '费用核销' },
                { key: 'shouldPay', name: '本期结算' },
                { key: 'amountIn', name: '销售总额' }
            ],
            columnsA: [
                { title: '分店编码', dataIndex: 'storeCodeSale', width: 150, align: 'center' },
                { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '规格', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '日期', dataIndex: 'dateOfOccurrence', width: 200, align: 'center' },
                { title: '扣率', dataIndex: 'discount', width: 100, align: 'center' },
                { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'center' },
                { title: '数量', dataIndex: 'saleNumber', width: 100, align: 'center' },
                { title: '商场毛利', dataIndex: 'saleProfit', width: 200, align: 'center' },
                { title: '应付金额', dataIndex: 'shouldPay', width: 200, align: 'center' },
                { title: '应付金额(不含税)', dataIndex: 'CaoPriceIn', width: 200, align: 'center' },
                { title: '销售单号', dataIndex: 'sourceCode', width: 200, align: 'center' },
                { title: '税率', dataIndex: 'taxRates', width: 200, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            columnsB: [
                { title: '时间', dataIndex: 'dateOfOccurrence', width: 200, align: 'center' },
                { title: '合同单号/活动单号', dataIndex: 'scheduleDefineCode', width: 150, align: 'center' },
                { title: '项目名称', dataIndex: 'feeTypeName', width: 150, align: 'center' },
                { title: '销售额', dataIndex: 'saleAmount', width: 100, align: 'center' },
                { title: '比率', dataIndex: 'ratio', width: 100, align: 'center' },
                { title: '应扣费用', dataIndex: 'shouldFee', width: 150, align: 'center' },
                { title: '实扣费用', dataIndex: 'factFee', width: 150, align: 'center' },
                { title: '税率', dataIndex: 'taxRates', width: 150, align: 'center' },
                { title: '销售单号', dataIndex: 'sourceCode', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            columnsC: [
                { title: '单据号', dataIndex: 'sourceCode', width: 200, align: 'center' },
                { title: '费用类型', dataIndex: 'feeType', width: 150, align: 'center' },
                { title: '分店编码', dataIndex: 'storeCodeSale', width: 200, align: 'center' },
                { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 150, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 150, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '经营类型', dataIndex: 'businessTypeName', width: 100, align: 'center' },
                { title: '销售数量', dataIndex: 'saleNumber', width: 200, align: 'center' },
                { title: '销售总额', dataIndex: 'saleAmount', width: 150, align: 'center' },
                { title: '实扣费用', dataIndex: 'factFee', width: 150, align: 'center' },
                { title: '应扣费用', dataIndex: 'shouldFee', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            salesDetailData: [],
            deductionDetailData: [],
            costMonitoringData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (id) {
            axios({
                path: 'SupplierPayFindDetail',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { add, div } = this.$math
                    if (res.data.salesDetails.length > 0) {
                        for (const i of res.data.salesDetails) {
                            i.taxRates = this.rateTransform(i.taxRate)
                            i.CaoPriceIn = div(i.shouldPay, add(1, i.taxRate))
                        }
                    }
                    this.salesDetailData = res.data.salesDetails
                    this.deductionDetailData = res.data.deductionDetails
                    this.costMonitoringData = res.data.feeDetails
                    this.previewVisbel = true
                }
            })
        },
        detailHandler (detailData) {
            this.salesDetailData.length = 0
            this.deductionDetailData.length = 0
            this.costMonitoringData.length = 0
            axios({
                path: 'SupplierPayFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_pay_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'bill_pay_status:3') {
                        this.tags = ['confirm']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        code: e.code,
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        contractCode: e.contractCode,
                        closeTime: e.closeTime,
                        payTime: e.payTime,
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        upStoreCode: e.upStoreCode ? `${e.upStoreCode}--${e.upStoreName}` : '',
                        suggestPay: String(e.suggestPay),
                        rebate: String(e.rebate),
                        fee: String(e.fee),
                        shouldPay: String(e.shouldPay),
                        amountIn: String(e.amountIn)

                    }
                    this.previewFooters = {
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUserName}` : '',
                        accountUserno: e.accountUserno ? `${e.accountUserno}--${e.accountUserName}` : '',
                        makeUserno: e.makeUserno ? `${e.makeUserno}--${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUserno: e.auditUserno ? `${e.auditUserno}--${e.auditUserName}` : '',
                        auditTime: e.auditTime,
                        note: e.note
                    }
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailHandler()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

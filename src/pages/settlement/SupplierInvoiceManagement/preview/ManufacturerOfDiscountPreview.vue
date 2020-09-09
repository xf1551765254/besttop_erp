<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 10:47:22
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="厂家折让"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="厂家折让详情" :isTable="true" :columns="columnsA" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `录入人:${previewFooters.makeUserno || ''}` }}</pre>
          <pre>{{ `录入时间：${previewFooters.makeTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditUserno || ''}` }}</pre>
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
            previewFooters: {},
            previewContent: {},
            tags: [],
            previewHeaders: [
                { key: 'sourceCode', name: '源单据号' },
                { key: 'provider', name: '供应商' },
                { key: 'chargeUserno', name: '负责人' },
                { key: 'billType', name: '折让类型' },
                { key: 'makeStoreCode', name: '制单店' }
            ],
            // 单据表头
            columnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'model', width: 300 },
                { title: '单位', dataIndex: 'basicUnit', width: 50 },
                { title: '零售价', dataIndex: 'price', width: 100 },
                { title: '税率', dataIndex: 'taxRates', width: 50, align: 'right' },
                { title: '原进价', dataIndex: 'priceInOrig', width: 150, align: 'right' },
                { title: '折让进价', dataIndex: 'priceIn', width: 150, align: 'right' },
                { title: '折让数量', dataIndex: 'qtty', width: 150, align: 'right' },
                { title: '折让金额', dataIndex: 'rebateAmount', width: 100, align: 'right' },
                { title: '不含税折让', dataIndex: 'taxAxclusiveAmount', width: 100, align: 'right' },
                { title: '原因', dataIndex: 'reason' }
            ],
            billsData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (id) {
            axios({
                path: 'InvoiceRebateDetailFindDetail',
                method: 'post',
                body: {
                    rebateId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { sub, mul, div, add } = this.$math
                    for (const i of res.data.list) {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.rebateAmount = mul(sub(i.priceIn, i.priceInOrig), i.qtty)
                        i['taxAxclusiveAmount'] = div(mul(sub(i.priceIn, i.priceInOrig), i.qtty), add(1, i['taxRate']))
                    }
                    this.billsData = res.data.list
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'InvoiceRebateFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_rebate_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        sourceCode: e.sourceCode,
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUserName}` : '',
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        billType: e.billTypeName,
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserno: e.makeUserno ? `${e.makeUserno}--${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUserno: e.auditUserno ? `${e.auditUserno}--${e.auditByName}` : '',
                        auditTime: e.auditTime
                    }
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

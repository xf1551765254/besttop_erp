<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 09:54:44
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="发票勾兑"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="发票勾兑详情" :isTable="true" :columns="columnsA" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `录入人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `录入时间：${previewFooters.makeTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditUserCode || ''}` }}</pre>
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
                { key: 'jionCode', name: '采集单号' },
                { key: 'provider', name: '供应商' },
                { key: 'chargeUserno', name: '负责人' },
                { key: 'invoiceAmount', name: '税票金额' },
                { key: 'recordAmount', name: '勾兑金额' },
                { key: 'recordDifferences', name: '勾兑差额' },
                { key: 'invoiceBillListing', name: '税票清单' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '核销类型', dataIndex: 'recordType', width: 150 },
                { title: '单据号', dataIndex: 'billCode', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', width: 90 },
                { title: '商品名称', dataIndex: 'name', width: 300 },
                { title: '规格型号', dataIndex: 'model', width: 300 },
                { title: '机构编码', dataIndex: 'storeCode', width: 80 },
                { title: '机构名称', dataIndex: 'storeName', width: 150 },
                { title: '分类编码', dataIndex: 'classCode', width: 80 },
                { title: '分类名称', dataIndex: 'className', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName', width: 150 },
                { title: '经营类型', dataIndex: 'goodsTypeName', width: 150 },
                { title: '数量', dataIndex: 'qtty', width: 150, align: 'right' },
                { title: '原进价', dataIndex: 'priceCost', width: 150, align: 'rihgt' },
                { title: '单据序号', dataIndex: 'sequenceNumber', width: 50, align: 'right' },
                { title: '税票价', dataIndex: 'priceCostInvoice', width: 150, align: 'rihgt' },
                { title: '税率', dataIndex: 'taxRates', width: 50, align: 'right' },
                { title: '应核销', dataIndex: 'fee', width: 100 },
                { title: '勾兑差额(含税)', dataIndex: 'onRecordDifferences', width: 200, align: 'right' },
                { title: '勾兑差额', dataIndex: 'recordDifferences', width: 150, align: 'right' },
                { title: '勾兑金额', dataIndex: 'recordAmount', width: 150, align: 'right' },
                { title: '备注', dataIndex: 'note' }
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
                path: 'InvoiceBlendFindDetailById',
                method: 'post',
                body: {
                    recordId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.blendId = i.id
                        if (i.recordType === 'invoice_record_detail_record_type:1') {
                            i.recordType = '商品核销'
                        } else if (i.recordType === 'invoice_record_detail_record_type:2') {
                            i.recordType = '费用核销'
                        }
                    }
                    this.billsData = res.data.list
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'InvoiceBlendFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'invoice_record_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'invoice_record_status:3') {
                        this.tags = ['confirm']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        jionCode: e.jionCode,
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUserName}` : '',
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        invoiceAmount: e.invoiceAmount,
                        recordAmount: e.recordAmount,
                        recordDifferences: e.recordDifferences,
                        invoiceBillListing: e.invoiceBillListing,
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}--${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUserCode: e.auditUserCode ? `${e.auditUserCode}--${e.auditUserName}` : '',
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

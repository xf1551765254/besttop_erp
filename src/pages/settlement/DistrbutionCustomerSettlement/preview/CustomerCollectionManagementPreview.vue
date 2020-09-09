<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-27 16:22:48
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="客户收款单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="客户收款详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
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
                { key: 'custNo', name: '渠道客户' },
                { key: 'mkStoreCode', name: '隶属公司' },
                { key: 'receiveMode', name: '收款方式' },
                { key: 'receiveInvoiceNo', name: '收款凭证' },
                { key: 'receiveDate', name: '收款日期' },
                { key: 'invoiceNo', name: '发票号' },
                { key: 'notYetReceived', name: '上期未收' },
                { key: 'shouldReceive', name: '应收金额' },
                { key: 'prePay', name: '冲减预收款金额' },
                { key: 'factReceive', name: '实收金额' },
                { key: 'nextReceive', name: '转入下期' },
                { key: 'mkStoreCode', name: '制单位置' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '类型', dataIndex: 'wholesaleTypeName', width: 100 },
                { title: '源单据号', dataIndex: 'wholesaleCode', width: 100 },
                { title: '发生位置', dataIndex: 'storeCode', width: 100 },
                { title: '发生位置名称', dataIndex: 'storeName', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', width: 100 },
                { title: '税率', dataIndex: 'taxRates', width: 100, align: 'right' },
                { title: '收款数量', dataIndex: 'numbers', width: 100, align: 'right' },
                { title: '收款价格/折让', dataIndex: 'unitPrice', width: 100, align: 'right' },
                { title: '收款金额', dataIndex: 'amountPay', width: 100, align: 'right' },
                { title: '审核时间', dataIndex: 'auditTime' }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (id) {
            axios({
                path: 'BillReceivablesFindDetail',
                method: 'post',
                body: {
                    id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data
                    arr.forEach(i => {
                        i.taxRates = this.rateTransform(i.taxRate)
                    })
                    this.categoryinfoData = arr
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'BillReceivablesFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_receive_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        custNo: e.custNo ? `${e.custNo}-${e.custName}` : '',
                        mkStoreCode: e.mkStoreCode ? `${e.mkStoreCode}-${e.mkStoreName}` : '',
                        receiveMode: e.receiveModeName,
                        receiveInvoiceNo: e.receiveInvoiceNo,
                        receiveDate: e.receiveDate,
                        invoiceNo: e.invoiceNo,
                        notYetReceived: String(e.notYetReceived),
                        shouldReceive: String(e.shouldReceive),
                        prePay: String(e.prePay),
                        factReceive: String(e.factReceive),
                        nextReceive: String(e.nextReceive),
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}-${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUserCode: e.auditUserCode ? `${e.auditUserCode}-${e.auditUserName}` : '',
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

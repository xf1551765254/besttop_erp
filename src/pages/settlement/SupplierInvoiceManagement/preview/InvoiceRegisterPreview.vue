<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 09:26:44
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="发票登记"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="发票登记详情" :isTable="true" :columns="columnsA" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `登记人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `登记时间：${previewFooters.makeTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditBy || ''}` }}</pre>
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
                { key: 'jionUserName', name: '交接人' },
                { key: 'makeStoreCode', name: '采集位置' },
                { key: 'invoiceAmount', name: '税票金额' },
                { key: 'jionStatusName', name: '交接状态' },
                { key: 'postDate', name: '邮寄日期' },
                { key: 'recTime', name: '接收日期' },
                { key: 'courierNumber', name: '快递单号' },
                { key: 'provider', name: '供应商' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '发票代码', dataIndex: 'invoiceCode', width: 150, align: 'center' },
                { title: '发票号码', dataIndex: 'invoiceNo', width: 150, align: 'center' },
                { title: '金额(不含税)', dataIndex: 'invoiceAmount', width: 200, align: 'center' },
                { title: '开票日期', dataIndex: 'invoiceTimes', width: 200, align: 'center' },
                { title: '核销', dataIndex: 'flagName', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'InvoiceJionFindByJionId',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data) {
                        i.invoiceTimes = i.invoiceTime
                    }
                    this.billsData = res.data
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'InvoiceJionFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'invoice_jion_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        jionUserName: e.jionUserCode ? `${e.jionUserCode}--${e.jionUserName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName} ` : '',
                        invoiceAmount: e.invoiceAmount,
                        postDate: e.postDate,
                        recTime: e.recTime,
                        courierNumber: e.courierNumber,
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        jionStatusName: e.jionStatusName,
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}--${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditTime: e.auditTime,
                        auditBy: e.auditBy ? `${e.auditBy}--${e.auditByName}` : ''
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

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-27 16:23:39
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="分销结算单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="分销结算单" :isTable="true" :columns="columnsA" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
          <pre>{{ `制单位置:${previewFooters.makeStoreCode || ''}` }}</pre>
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
            // 基础信息
            previewHeaders: [
                { key: 'custNo', name: '渠道客户' },
                { key: 'storeCode', name: '隶属公司' },
                { key: 'currentShouldAmount', name: '分销金额' },
                { key: 'fee', name: '折让金额' },
                { key: 'currentPayAmount', name: '实结金额' },
                { key: 'makeUserCode', name: '制单人' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '类型', dataIndex: 'typeName', width: 100, align: 'left' },
                { title: '源单据号', dataIndex: 'wholesaleCode', width: 150, align: 'left' },
                { title: '发生位置编码', dataIndex: 'storeCode', width: 200, align: 'left' },
                { title: '发生位置名称', dataIndex: 'storeName', width: 200, align: 'left' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '单位', dataIndex: 'basicUnit', width: 100, align: 'left' },
                { title: '税率', dataIndex: 'taxRates', width: 150, align: 'right' },
                { title: '成本价', dataIndex: 'amountCost', width: 150, align: 'right' },
                { title: '分销价', dataIndex: 'wholesalePrice', width: 150, align: 'right' },
                { title: '结算数量', dataIndex: 'number', width: 150, align: 'right' },
                { title: '结算单价/折让价', dataIndex: 'payPrice', width: 250, align: 'right' },
                { title: '结算金额', dataIndex: 'amount', width: 150, align: 'right' },
                { title: '备注', dataIndex: 'note', align: 'left' }
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
                path: 'WholesalePayFindDetail',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.taxRates = this.rateTransform(i.taxRate)
                    }
                    this.billsData = res.data.list
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'WholesalePayFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_wholesale_pay_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        custNo: e.custNo ? `${e.custNo}-${e.custName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
                        currentShouldAmount: String(e.currentShouldAmount),
                        fee: String(e.fee),
                        currentPayAmount: String(e.currentPayAmount),
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}-${e.makeUserName}` : '',
                        note: e.note

                    }
                    this.previewFooters = {

                        makeTime: e.makeTime,
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
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

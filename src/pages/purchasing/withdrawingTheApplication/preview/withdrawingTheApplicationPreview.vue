<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 17:35:51
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="退库申请单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="退库申请单详情" :isTable="true" :columns="detailsColumns" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.approveBy || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.approveTime || ''}` }}</pre>
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
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'unit', width: 50 },
                { title: '扣率', dataIndex: 'discounts', width: 80, align: 'right' },
                { title: '税率', dataIndex: 'rates', width: 80, align: 'right' },
                { title: '现库存', dataIndex: 'stockNumber', width: 80, align: 'right' },
                { title: '零售价', dataIndex: 'price', align: 'right', width: 100 },
                { title: '退货价', dataIndex: 'returnPrice', width: 150, scopedSlots: { customRender: 'returnPrice' } },
                { title: '退货价(不含税)', dataIndex: 'returnPriceNo', width: 150, align: 'right' },
                { title: '批次号', dataIndex: 'batchNumber', width: 100 },
                { title: '退货数量', dataIndex: 'applyNumber', align: 'center', width: 100, scopedSlots: { customRender: 'applyNumber' } },
                { title: '退货总额', dataIndex: 'returnAmount', align: 'right', width: 100 },
                { title: '退货总额(不含税)', dataIndex: 'returnAmountNo', align: 'right', width: 150 },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
            ],
            categoryinfoData: [],
            // 基础信息
            previewHeaders: [
                { key: 'providerCode', name: '供应商' },
                { key: 'makeStore', name: '制单位置' },
                { key: 'applyStore', name: '退货位置' },
                { key: 'applyBy', name: '申请人' },
                { key: 'note', name: '备注' }
            ]
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail () {
            axios({
                path: 'ApplyWithdrawingFindDetail',
                method: 'post',
                body: {
                    code: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const { mul, div, add } = this.$math
                    const { abs } = this.$math
                    const editArr = res.data
                    editArr.forEach(i => {
                        i.discounts = this.rateTransform(i.discount)
                        i.rates = this.rateTransform(i.rate)
                        i.applyNumber = abs(i.applyNumber, 0)
                        i.returnPriceNo = div(i.returnPrice, add(1, i.rate, 2), 2)
                        i.returnAmount = mul(i.applyNumber, i.returnPrice, 2)
                        i.returnAmountNo = div(i.returnAmount, add(1, i.rate, 2), 2)
                    })
                    this.categoryinfoData = res.data
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'ApplyWithdrawingFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'apply_withdrawing_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        providerCode: e.providerCode ? `${e.providerCode}-${e.providerName}` : '',
                        makeStore: e.makeStore ? `${e.makeStore}-${e.makeStoreName}` : '',
                        applyStore: e.applyStore ? `${e.applyStore}-${e.applyStoreName}` : '',
                        applyBy: e.applyBy ? `${e.applyBy}-${e.applyName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createName}` : '',
                        createTime: e.createTime,
                        approveTime: e.approveTime,
                        approveBy: e.approveBy ? `${e.approveBy}-${e.approveName}` : ''
                    }
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
                this.findDetail()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

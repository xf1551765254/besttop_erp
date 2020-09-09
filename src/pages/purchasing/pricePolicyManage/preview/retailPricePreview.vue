<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-19 14:46:37
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="零售价格调整"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="零售价格调整单详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
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
            // 基础信息
            previewHeaders: [
                { key: 'originalCode', name: '源单据号' },
                { key: 'tempObjArr', name: '生效机构' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'managerBy', name: '负责人' },
                { key: 'storeCode', name: '制单位置' },
                { key: 'note', name: '备注' }
            ],
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 400 },
                { title: '单位', dataIndex: 'unit', width: 100 },
                { title: '审定售价', dataIndex: 'newPrice', width: 150, scopedSlots: { customRender: 'newPrice' } },
                { title: '原售价', dataIndex: 'origPrice' },
                { title: '限价', dataIndex: 'priceMin', width: 150, align: 'center', scopedSlots: { customRender: 'priceMin' } }
            ],
            billsData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail () {
            axios({
                path: 'BillPritailQuetyByCode',
                method: 'post',
                body: {
                    priceBillCode: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { mul, sub } = this.$math
                    for (const i of res.data.list) {
                        i.bt_web_id = i.skuCode
                        i.origDeductionRates = this.rateTransform(i.origDeductionRate)
                        i.deductionRate = mul(i.deductionRate, 100)
                        Object.assign(i, { countNow: mul(sub(i.newPrice, i.origPrice), i.goodsNum) })
                    }
                    this.billsData = res.data.list
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillPriceQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_price_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        ...e,
                        tempObjArr: e.effectStoreName,
                        managerBy: e.managerBy ? `${e.managerBy}-${e.managerByName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
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

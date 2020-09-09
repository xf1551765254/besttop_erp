<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 16:13:04
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="采购退库"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="商品详情" :isTable="true" :columns="detailsColumns" :data="categoryinfoData"></div>
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
                { title: '批次号', dataIndex: 'batchNumber', width: 90,align: 'left' },
                { title: '退货数量', dataIndex: 'applyNumber', align: 'right', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'left', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'left', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'left', width: 300 },
                { title: '品牌', dataIndex: 'brandName', align: 'left', width: 100 },
                { title: '单位', dataIndex: 'unit', align: 'left', width: 50 },    
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } }
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
                path: 'DistributionBillExitFindApplyWithdrawingDetail',
                method: 'post',
                body: {
                    code: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
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
                        providerCode: e.providerCode ? `${e.providerCode}--${e.providerName}` : '',
                        makeStore: e.makeStore ? `${e.makeStore}--${e.makeStoreName}` : '',
                        applyStore: e.applyStore ? `${e.applyStore}--${e.applyStoreName}` : '',
                        applyBy: e.applyBy ? `${e.applyBy}--${e.applyName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}--${e.createName}` : '',
                        createTime: e.createTime,
                        approveTime: e.approveTime,
                        approveBy: e.approveBy ? `${e.approveBy}--${e.approveName}` : ''
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
            if (!val) {
                this.previewFooters = {}
                this.previewContent = {}
                this.categoryinfoData = []
            }
        }
    }
}
</script>

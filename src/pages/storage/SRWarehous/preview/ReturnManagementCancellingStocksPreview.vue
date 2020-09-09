<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-23 16:00:37
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="退库"
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
            detailsColumns: [
                { title: '退库数量', dataIndex: 'entryQtty', width: 100, align: 'right', scopedSlots: { customRender: 'entryQtty' } },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'model', width: 300, align: 'left' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 90, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
                { title: '单位', dataIndex: 'basicUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } }
            ],
            categoryinfoData: [],
            // 基础信息
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'sourceCode', name: '源单据号' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'entryMakeStoreCode', name: '收货位置' },
                { key: 'entryBy', name: '验收人' },
                { key: 'note', name: '备注' }
            ]
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (id) {
            axios({
                path: 'DistributionBillExitFindExitDetail',
                method: 'post',
                body: {
                    id
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
                path: 'DistributionBillExitFindExit',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'apply_withdrawing_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        provider: e.provider ? `${e.provider}-${e.providerName}` : '',
                        sourceCode: e.sourceCode,
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
                        entryMakeStoreCode: e.entryMakeStoreCode ? `${e.entryMakeStoreCode}-${e.entryMakeStoreName}` : '',
                        entryBy: e.entryBy ? `${e.entryBy}-${e.entryByName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createByName}` : '',
                        createTime: e.createTime,
                        auditTime: e.auditTime,
                        auditBy: e.auditBy ? `${e.auditBy}-${e.auditByName}` : ''
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
            if (!val) {
                this.previewFooters = {}
                this.previewContent = {}
                this.categoryinfoData = []
            }
        }
    }
}
</script>

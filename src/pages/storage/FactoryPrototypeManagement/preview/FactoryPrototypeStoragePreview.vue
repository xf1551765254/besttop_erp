<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 16:19:28
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="厂家样机入库单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="厂家样机入库单详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUserno || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeDt || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auUserno || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.auDt || ''}` }}</pre>
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
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '入库数量', dataIndex: 'recN', width: 150, align: 'right', scopedSlots: { customRender: 'recN' } },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'left' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } }
            ],
            // 基础信息
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'storeCode', name: '收货位置' },
                { key: 'recDt', name: '收货时间' },
                { key: 'note', name: '备注' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'SampleSampleEntryFindEntryDetail',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.previewVisbel = true
                    this.billsData = res.data
                }
            })
        },
        detailsSumbit () {
            axios({
                path: 'SampleSampleEntryFindEntry',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.billStatus === 'bill_sample_entry_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        recDt: e.recDt,
                        provider: e.provider ? `${e.provider}-${e.providerName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserno: e.makeUserno ? `${e.makeUserno}-${e.makeUserName}` : '',
                        makeDt: e.makeDt,
                        auDt: e.auDt,
                        auUserno: e.auUserno ? `${e.auUserno}-${e.auUserName}` : ''
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
                this.billsData = []
                this.previewFooters = {}
                this.previewContent = {}
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-20 10:17:14
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
        </a-col>
        <a-col :span="12">
          <pre>{{ `制单时间：${previewFooters.makeDt || ''}` }}</pre>
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
                { title: '申请数量', dataIndex: 'recN', width: 70, align: 'right' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'left' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 90, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'left' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'left' }
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
                path: 'SampleSampleEntryFindEntryDetailPurchase',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.billsData = res.data
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            axios({
                path: 'SampleSampleEntryFindEntryPurchase',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    console.log(e)
                    this.findDetail(e.id)
                    if (e.billStatus === 'bill_sample_entry_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.billStatus === 'bill_sample_entry_status:2') {
                        this.tags = ['check']
                    } else if (e.billStatus === 'bill_sample_entry_status:3') {
                        this.tags = ['confirm']
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
                        makeDt: e.makeDt
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

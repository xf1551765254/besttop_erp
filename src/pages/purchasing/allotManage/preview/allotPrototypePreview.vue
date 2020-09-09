<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 10:50:21
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="厂家样机调拨单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="厂家样机调拨单详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
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
            previewHeaders: [
                { key: 'outStoreCode', name: '调出位置' },
                { key: 'inStoreCode', name: '调入位置' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'chargeUserno', name: '负责人' },
                { key: 'note', name: '备注' }

            ],
            detailsColumns: [
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'left' },
                { title: '商品SKU编码', dataIndex: 'skuCode', width: 150, align: 'left' },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 150, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 200, align: 'left' },
                { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'left' },
                { title: '调拨数量', dataIndex: 'qtty', width: 150, align: 'right' },
                { title: '备注', dataIndex: 'note', align: 'left' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'SampleAllotsFindDetail',
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
                path: 'SampleAllotsFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.billStatus === 'bill_sample_allot_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.billStatus === 'bill_sample_allot_status:2' || e.billStatus === 'bill_sample_allot_status:3') {
                        this.tags = ['check']
                    } else if (e.billStatus === 'bill_sample_allot_status:4') {
                        this.tags = ['confirm']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        outStoreCode: e.outStoreCode ? `${e.outStoreCode}-${e.outStoreName}` : '',
                        inStoreCode: e.inStoreCode ? `${e.inStoreCode}-${e.inStoreName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}-${e.chargeUserName}` : '',
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

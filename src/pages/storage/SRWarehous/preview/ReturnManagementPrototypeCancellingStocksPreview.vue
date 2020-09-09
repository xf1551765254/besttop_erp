<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 16:07:50
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="厂家样机退库单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="厂家样机退库单" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
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
                { title: '申请退库数量', dataIndex: 'recN', width: 100, align: 'right' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } }
            ],
            // 基础信息
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'storeCode', name: '退库位置' },
                { key: 'recDt', name: '退库时间' },
                { key: 'recUserno', name: '退库人' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'SampleSampleExitFindExitDetail',
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
                path: 'SampleSampleExitFindExit',
                method: 'post',
                body: {
                    code: this.orderIdyarn
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
                    this.previewContent.headers = {
                        recDt: e.recDt,
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}--${e.storeName}` : '',
                        recUserno: e.recUserno ? `${e.recUserno}--${e.recUserName}` : ''
                    }
                    this.previewFooters = {
                        makeUserno: e.makeUserno ? `${e.makeUserno}--${e.makeUserName}` : '',
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUserName}` : '',
                        makeDt: e.makeDt,
                        note: e.note,
                        auDt: e.auDt,
                        auUserno: e.auUserno ? `${e.auUserno}--${e.auUserName}` : ''
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
                this.billsData = []
            }
        }
    }
}
</script>

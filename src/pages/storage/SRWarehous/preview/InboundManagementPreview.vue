<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-21 16:20:06
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="入库管理"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="入库管理详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `验货人：${previewFooters.entryBy || ''}` }}</pre>
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
                { title: '入库数量', dataIndex: 'entryQtty', width: 80, align: 'right' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'model', width: 300 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', width: 50 },
                { title: '备注', dataIndex: 'note' }
            ],
            // 基础信息
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'batchNumber', name: '批次号' },
                { key: 'sourceCode', name: '源单据号' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'entryMakeStoreCode', name: '收货位置' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'DistributionBillEntryFindEntryDetail',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.billsData = res.data
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'DistributionBillEntryFindEntry',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.billStatus === 'bill_entry_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        ...e,
                        provider: e.provider ? `${e.provider}-${e.providerName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
                        entryMakeStoreCode: e.entryMakeStoreCode ? `${e.entryMakeStoreCode}-${e.entryMakeStoreName}` : ''
                    }
                    this.previewFooters = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}-${e.makeUserName}` : '',
                        entryBy: e.entryBy ? `${e.entryBy}-${e.entryByName}` : '',
                        makeTime: e.makeTime,
                        note: e.note,
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
        }
    }
}
</script>

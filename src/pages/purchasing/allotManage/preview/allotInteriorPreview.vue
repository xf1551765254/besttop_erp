<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-20 10:41:09
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="内部调拨"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="内部调拨详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
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
                { key: 'sourceStoreCode', name: '调出位置' },
                { key: 'destinationStoreCode', name: '调入位置' },
                { key: 'makeStoreId', name: '制单位置' },
                { key: 'chargeBy', name: '负责人' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '调拨数量', dataIndex: 'qtty', width: 80, align: 'right' },
                { title: '现库存', dataIndex: 'curNumber', width: 80, align: 'right' },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 50 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'DistributionBillAllotsFindDetail',
                method: 'post',
                body: {
                    code: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    this.categoryinfoData = res.data
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'DistributionBillAllotsFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.billStatus === 'bill_allot_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.billStatus === 'bill_allot_status:2' || e.billStatus === 'bill_allot_status:3') {
                        this.tags = ['check']
                    } else if (e.billStatus === 'bill_allot_status:4') {
                        this.tags = ['confirm']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        sourceStoreCode: e.sourceStoreCode ? `${e.sourceStoreCode}-${e.sourceStoreName}` : '',
                        destinationStoreCode: e.destinationStoreCode ? `${e.destinationStoreCode}-${e.destinationStoreName}` : '',
                        makeStoreId: e.makeStoreId ? `${e.makeStoreId}-${e.makeStoreName}` : '',
                        chargeBy: e.chargeBy ? `${e.chargeBy}-${e.chargeByName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createByName}` : '',
                        createTime: e.createTime
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

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:30:56
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="库间调拨"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="库间调拨详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `负责人:${previewFooters.chargeBy || ''}` }}</pre>
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditBy || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.auditTime || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
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
                { key: 'sourceStoreCode', name: '配送中心' },
                { key: 'destinationStoreCode', name: '收货位置' },
                { key: 'makeStoreId', name: '制单位置' }
            ],
            // 单据表头
            columnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 50 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '税率', dataIndex: 'skuTaxRate', width: 100 },
                { title: '零售价', dataIndex: 'price', width: 150 },
                { title: '成本价(含税)', dataIndex: 'priceCost', width: 150 },
                { title: '调拨数量', dataIndex: 'qtty', width: 100 },
                { title: '现库存', dataIndex: 'curNumber', width: 100 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'DistributionBillAllotDetailFindDetail',
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
                path: 'DistributionBillAllotFinda',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.billStatus === 'bill_pre_entry_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        sourceStoreCode: e.sourceStoreCode ? `${e.sourceStoreCode}--${e.sourceStoreName}` : '',
                        destinationStoreCode: e.destinationStoreCode ? `${e.destinationStoreCode}--${e.destinationStoreName}` : '',
                        makeStoreId: e.makeStoreId ? `${e.makeStoreId}--${e.makeStoreName}` : ''
                    }
                    this.previewFooters = {
                        chargeBy: e.chargeBy ? `${e.chargeBy}--${e.chargeByName}` : '',
                        createBy: e.createBy ? `${e.createBy}--${e.createByName}` : '',
                        createTime: e.createTime,
                        auditBy: e.auditBy ? `${e.auditBy}--${e.auditByName}` : '',
                        auditTime: e.auditTime,
                        note: e.note
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

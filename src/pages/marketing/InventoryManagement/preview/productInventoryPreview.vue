<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:08:37
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="商品盘点单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="商品盘点单详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
    <div slot="footer">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">录入人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.input || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">录入时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.inputTime || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.audit || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.auditTime || '' }}</a-col>
      </a-row>
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">备注</a-col>
        <a-col :sm="16" :md="20" :xl="21">{{ previewFooters.note || '' }}</a-col>
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
                { key: 'makeStore', name: '制单位置' },
                { key: 'stocktaking', name: '盘点人' },
                { key: 'stocktakingTime', name: '盘点日期' }
            ],
            previewColumns: [
                { title: '分类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '分类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '商品条码', dataIndex: 'skuBarcode', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 70, align: 'center' },
                { title: '成本价（元）', dataIndex: 'priceCost', width: 150, align: 'center' },
                { title: '零售价（元）', dataIndex: 'price', width: 150, align: 'center' },
                { title: '税率（%）', dataIndex: 'skuRate', width: 100, align: 'center', customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '账面存量', dataIndex: 'origNumber', width: 100, align: 'center' },
                { title: '待送货量', dataIndex: 'tobeSendNumber', width: 100, align: 'center' },
                { title: '系统实物存量', dataIndex: 'systemQuantity', width: 150, align: 'center' },
                { title: '账面库存金额（元）', dataIndex: 'origAmount', width: 150, align: 'center' },
                { title: '系统实物库存金额（元）', dataIndex: 'systemAmount', width: 180, align: 'center' },
                { title: '盘点实物存量', dataIndex: 'stocktakingNumber', width: 150, align: 'center', scopedSlots: { customRender: 'stocktakingNumber' } },
                { title: '盘点实物库存金额（元）', dataIndex: 'stocktakingAmount', width: 180, align: 'center' },
                { title: '差异金额（元）', dataIndex: 'differenceAmount', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'StocktakingStocktQueryDetail',
                method: 'post',
                body: {
                    stocktakingId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.list
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.epreviewTableData.length = 0
            axios({
                path: 'StocktakingStocktQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'stocktaking_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'stocktaking_status:2') {
                        this.tags = ['check']
                    }

                    this.previewContent.headers = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        stocktaking: detailData.stocktakingBy ? `${detailData.stocktakingBy} - ${detailData.stocktakingName}` : '',
                        stocktakingTime: detailData.stocktakingTime
                    }
                    this.previewFooters = {
                        input: detailData.inputBy ? `${detailData.inputBy} - ${detailData.inputName}` : '',
                        inputTime: detailData.inputTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditName}` : '',
                        auditTime: detailData.auditTime,
                        note: detailData.note
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

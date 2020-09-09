<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:11:48
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="商品领用"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="商品领用详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
    <div slot="footer">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.make || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.makeTime || '' }}</a-col>
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
                { key: 'use', name: '领用人' },
                { key: 'type', name: '领用类型' },
                { key: 'useTime', name: '领用时间' },
                { key: 'chargeBy', name: '负责人' }
            ],
            previewColumns: [
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '商品SKU编码', dataIndex: 'skuCode', width: 120, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '商品条码', dataIndex: 'barcode', width: 100, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
                { title: '成本价', dataIndex: 'priceCost', width: 100, align: 'center' },
                { title: '税率（%）',
                    dataIndex: 'taxRate',
                    width: 100,
                    align: 'center',
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}`
                },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '库存数量', dataIndex: 'stockNumber', width: 100, align: 'center' },
                { title: '领用数量', dataIndex: 'useNumber', width: 100, align: 'center' },
                { title: '成本金额(含税)', dataIndex: 'taxCost', width: 150, align: 'center' },
                { title: '成本金额(不含税)', dataIndex: 'taxFreeCost', width: 150, align: 'center' },
                { title: '销售金额', dataIndex: 'saleAmount', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'InventoryGoodsUseQueryGoodsUseDetail',
                method: 'post',
                body: {
                    id
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
                path: 'InventoryGoodsUseQueryGoodsUse',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'goods_use_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'goods_use_status:2') {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        use: detailData.useBy ? `${detailData.useBy} - ${detailData.useName}` : '',
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        chargeBy: detailData.chargeBy ? `${detailData.chargeBy} - ${detailData.chargeName}` : '',
                        useTime: detailData.useTime,
                        type: detailData.typeValue
                    }
                    this.previewFooters = {
                        make: detailData.makeBy ? `${detailData.makeBy} - ${detailData.makeName}` : '',
                        makeTime: detailData.makeTime,
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

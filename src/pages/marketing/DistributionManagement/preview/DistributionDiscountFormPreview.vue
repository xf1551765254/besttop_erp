<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 11:33:24
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:07:54
 -->
<template>
  <Preview
    v-model="previewVisbel"
    title="分销折让单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent" >
    <div slot="A" title="分销折让单详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
    <div slot="footer">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.create || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.createTime || '' }}</a-col>
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
  </Preview>
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
            previewHeaders: [
                { key: 'sourceCode', name: '源单据号' },
                { key: 'makeStore', name: '制单位置' },
                { key: 'storeCode', name: '折让店' },
                { key: 'customerCode', name: '客户' },
                { key: 'chargeBy', name: '负责人' },
                { key: 'type', name: '折让类型' },
                { key: 'wholesaleAllowancesWay', name: '折让方式' }
            ],
            tags: [],
            previewFooters: {},
            previewContent: {},
            epreviewTableData: [],
            previewColumns: [
                { title: 'SKU编码', dataIndex: 'code', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'model', width: 150, align: 'center' },
                { title: '税率（%）', dataIndex: 'taxRate', width: 100, align: 'center', customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '原分销价（元）', dataIndex: 'originalWholesalePrice', width: 150, align: 'center' },
                { title: '折让价（元）', dataIndex: 'wholesaleAllowancesPrice', width: 150, align: 'center' },
                { title: '折让数量', dataIndex: 'quantity', width: 100, align: 'center' },
                { title: '折让金额（元）', dataIndex: 'wholesaleAllowancesAmount', width: 150, align: 'center' },
                { title: '折让原因', dataIndex: 'wholesaleAllowancesReason', align: 'center' }
            ]
        }
    },
    methods: {
        findDetailList (id) {
            axios({
                path: 'DistWholesaleAllowancesQueryWholesaleAllowancesDetailList',
                method: 'post',
                body: {
                    wholesaleAllowancesId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.epreviewTableData.length = 0
            axios({
                path: 'DistWholesaleAllowancesQueryWholesaleAllowancesList',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetailList(detailData.id)
                    if (detailData.status === 'wholesale_allowances_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'wholesale_allowances_status:2') {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        storeCode: detailData.storeCode ? `${detailData.storeCode} - ${detailData.storeName}` : '',
                        customerCode: detailData.customerCode ? `${detailData.customerCode} - ${detailData.customerName}` : '',
                        chargeBy: detailData.chargeBy ? `${detailData.chargeBy} - ${detailData.chargeName}` : '',
                        sourceCode: detailData.sourceCode,
                        type: detailData.type,
                        wholesaleAllowancesWay: detailData.wholesaleAllowancesWay
                    }
                    this.previewFooters = {
                        create: detailData.createBy ? `${detailData.createBy} - ${detailData.createName}` : '',
                        createTime: detailData.createTime,
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

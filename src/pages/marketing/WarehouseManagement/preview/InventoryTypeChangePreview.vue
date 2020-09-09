<!--
 * @Description: 预览
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:12:09
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="商品盘点单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
                { key: 'type', name: '变更类型' },
                { key: 'applyBy', name: '申请人' }
            ],
            previewColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '正品存量', dataIndex: 'quantity', width: 100, align: 'center' },
                { title: '样品存量', dataIndex: 'sampleQuantity', width: 100, align: 'center' },
                { title: '残次存量', dataIndex: 'defectiveQuantity', width: 100, align: 'center' },
                { title: '在维修量', dataIndex: 'repairQuantity', width: 100, align: 'center' },
                { title: '转换数量', dataIndex: 'turnQuantity', width: 100, align: 'center' },
                { title: '转换原因', dataIndex: 'reason', align: 'center' }
            ],
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'InventoryTurnQueryDetail',
                method: 'post',
                body: {
                    inventoryTypeTurnId: id
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
                path: 'InventoryTurnQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'inventory_type_turn_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'inventory_type_turn_status:2') {
                        this.tags = ['check']
                    } else {
                        this.tags = ['effective']
                    }
                    this.previewContent.headers = {
                        applyBy: detailData.applyBy ? `${detailData.applyBy} - ${detailData.applyName}` : '',
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
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

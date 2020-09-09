<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:14:45
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="商品预售配置"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="商品预售配置详情" :isTable="true" :columns="detailsColumns" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
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
            // 基础信息
            previewHeaders: [
                { key: 'managerBy', name: '负责人' },
                { key: 'note', name: '备注' }
            ],
            detailsColumns: [ // 采购订单详情表头
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'model', align: 'center', width: 250 },
                { title: '生效位置', dataIndex: 'storeName', align: 'center', width: 150 },
                { title: '当前账面库存', dataIndex: 'currentNumber', align: 'center', width: 150 },
                { title: '允许预售数量', dataIndex: 'preSaleQuantity', align: 'center', width: 150, scopedSlots: { customRender: 'preSaleQuantity' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'BillSaleDetailFindDetail',
                method: 'post',
                body: {
                    preSaleId: id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        this.categoryinfoID++
                        i.tbWebId = i.skuCode + i.storeId
                    })
                    this.categoryinfoData = arr
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillSaleFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_pre_sale_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        managerBy: e.managerBy ? `${e.managerBy}--${e.managerName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}--${e.createName}` : '',
                        createTime: e.createTime,
                        auditTime: e.auditTime,
                        auditBy: e.auditBy ? `${e.auditBy}--${e.auditName}` : ''
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

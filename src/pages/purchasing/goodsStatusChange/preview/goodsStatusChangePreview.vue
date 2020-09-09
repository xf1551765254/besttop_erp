<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:15:08
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="商品状态变更"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="商品状态变更单详情" :isTable="true" :columns="detailsColumns" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditUser || ''}` }}</pre>
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
                { key: 'chargeUserno', name: '负责人' },
                { key: 'purchaseUser', name: '采购员' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'note', name: '备注' }
            ],
            detailsColumns: [ // 采购订单详情表头
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: 'SKU名称', dataIndex: 'name', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'model', align: 'center', width: 250 },
                { title: '税率', dataIndex: 'taxRates', align: 'center', width: 100 },
                { title: '零售价', dataIndex: 'price', align: 'center', width: 100 },
                { title: '含税成本价', dataIndex: 'priceCost', align: 'center', width: 100 },
                { title: '变动类型', dataIndex: 'type', align: 'center', width: 150, scopedSlots: { customRender: 'type' } },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail () {
            axios({
                path: 'BillChangeDetailFind',
                method: 'post',
                body: {
                    changeCode: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        this.categoryinfoID++
                        i.type = i.typeName
                        i.tbWebId = this.categoryinfoID++
                        i.taxRates = this.rateTransform(i.taxRate)
                    })
                    this.categoryinfoData = arr
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillChangeFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_change_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUsernoName}` : '',
                        purchaseUser: e.purchaseUser ? `${e.purchaseUser}--${e.purchaseUserName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}--${e.createName}` : '',
                        createTime: e.createTime,
                        auditTime: e.auditTime,
                        auditUser: e.auditUser ? `${e.auditUser}--${e.auditUserName}` : ''
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

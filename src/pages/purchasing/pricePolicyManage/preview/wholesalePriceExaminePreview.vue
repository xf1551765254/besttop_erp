<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-20 11:31:24
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="分销特价审批单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="分销特价审批单详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.approveBy || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.approveTime || ''}` }}</pre>
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
                { key: 'originalCode', name: '源单据号' },
                { key: 'applyStoreCode', name: '申请位置' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'customerCode', name: '客户' },
                { key: 'note', name: '备注' }
            ],
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '分销价', dataIndex: 'wholesalePrice', width: 100, align: 'right' },
                { title: '提货数量', dataIndex: 'goodsNum', width: 100, align: 'right', scopedSlots: { customRender: 'goodsNum' } },
                { title: '申请价格', dataIndex: 'applyPrice', width: 100, align: 'right', scopedSlots: { customRender: 'applyPrice' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'BillApprovedetailQueryByCode',
                method: 'post',
                body: {
                    whApproveCode: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.bt_web_id = i.skuCode
                    }
                    this.billsData = res.data.list
                }
                this.previewVisbel = true
            }
            )
        },
        detailsSumbit () {
            axios({
                path: 'BillApproveFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_wholesale_approve_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'bill_wholesale_approve_status:3') {
                        this.tags = ['effective']
                    } else if (e.status === 'bill_wholesale_approve_status:2') {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        ...e,
                        applyStoreCode: e.applyStoreCode ? `${e.applyStoreCode}-${e.applyStoreName}` : '',
                        customerCode: e.customerCode ? `${e.customerCode}-${e.customerName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createName}` : '',
                        createTime: e.createTime,
                        approveTime: e.approveTime,
                        approveBy: e.approveBy ? `${e.approveBy}-${e.approveName}` : ''
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

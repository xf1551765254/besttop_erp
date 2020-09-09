<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 11:33:24
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:32:15
 -->
<template>
  <Preview
    v-model="previewVisbel"
    title="返利确认单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent" >
    <div slot="A" title="返利确认单详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
                { key: 'makeStore', name: '制单位置' },
                { key: 'saleStoreCode', name: '销售位置' },
                { key: 'strategyDefineCode', name: '政策名称' },
                { key: 'customerCode', name: '客户' }
            ],
            tags: [],
            previewFooters: {},
            previewContent: {},
            epreviewTableData: [],
            previewColumns: [
                { title: '政策类型', dataIndex: 'strategyType', align: 'center', width: 150 },
                { title: '应返金额', dataIndex: 'shouldRebateAmount', align: 'center', width: 100 },
                { title: '调整金额', dataIndex: 'adjustAmount', align: 'center', width: 100, scopedSlots: { customRender: 'adjustAmount' } },
                { title: '实际返利金额', dataIndex: 'actualRebateAmount', align: 'center', width: 150 },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } }
            ]
        }
    },
    methods: {
        findDetailList (id) {
            axios({
                path: 'DistWholesaleRebateQueryDetail',
                method: 'post',
                body: {
                    rebateConfirmCode: id
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
                path: 'DistWholesaleRebateQueryRebateConfirm',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetailList(detailData.code)
                    if (detailData.status === 'wholesale_rebate_confirm_status:0') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'wholesale_rebate_confirm_status:1') {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        saleStoreCode: detailData.saleStoreCode ? `${detailData.saleStoreCode} - ${detailData.saleStoreName}` : '',
                        customerCode: detailData.customerCode ? `${detailData.customerCode} - ${detailData.customerName}` : '',
                        chargeBy: detailData.chargeBy ? `${detailData.chargeBy} - ${detailData.chargeName}` : '',
                        strategyDefineCode: detailData.strategyDefineCode ? `${detailData.strategyDefineCode} - ${detailData.strategyDefineName}` : ''
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

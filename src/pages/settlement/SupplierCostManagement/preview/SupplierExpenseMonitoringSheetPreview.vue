<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 18:12:59
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="费用监控单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="费用监控单详情" :isTable="true" :columns="this.showH?columnsA:columnsB" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditUserno || ''}` }}</pre>
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
            previewHeaders: [
                { key: 'sourceOrganize', name: '机构信息' },
                { key: 'chargeUserno', name: '负责人' },
                { key: 'type', name: '单据类型' },
                { key: 'feeAmount', name: '费用金额' },
                { key: 'feeType', name: '费用类型' },
                { key: 'startDate', name: '开始日期' },
                { key: 'endDate', name: '结束日期' },
                { key: 'note', name: '备注' }
            ],
            columnsA: [ // 表头
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 100 },
                { title: '供应商编码', dataIndex: 'provider', width: 100 },
                { title: '供应商名称', dataIndex: 'providerName', width: 100 },
                { title: '品类', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'goodsType', width: 100 },
                { title: '销售数量', dataIndex: 'saleNumber', width: 100, align: 'right' },
                { title: '销售金额', dataIndex: 'saleAmount', width: 100, align: 'right' },
                { title: '销售占比', dataIndex: 'shareRates', width: 100, align: 'right' },
                { title: '费用', dataIndex: 'fee', width: 200, align: 'right' },
                { title: '备注', dataIndex: 'note' }
            ],
            columnsB: [
                { title: '供应商编码', dataIndex: 'provider', width: 100 },
                { title: '供应商名称', dataIndex: 'providerName', width: 100 },
                { title: '机构编码', dataIndex: 'storeCode', width: 150 },
                { title: '机构名称', dataIndex: 'storeName', width: 150 },
                { title: '品类', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'goodsType', width: 100 },
                { title: '税率', dataIndex: 'taxRates', width: 50, align: 'right' },
                { title: '费用类型', dataIndex: 'name', width: 150 },
                { title: '费用', dataIndex: 'fee', align: 'right' }
            ],
            categoryinfoData: [],
            showH: false
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (id, type) {
            axios({
                path: 'ProviderMonitorFindDetail',
                method: 'post',
                body: {
                    feeId: id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.providerFeeDetails
                    if (type === 0) {
                        this.showH = true
                        for (const item of arr) {
                            item.shareRates = this.rateTransform(item.shareRate)
                            if (item.goodsType === 'provider_contract_business_type:1') {
                                item.goodsType = '自营'
                            }
                            if (item.goodsType === 'provider_contract_business_type:2' || item.goodsType === 'provider_contract_business_type:3') {
                                item.goodsType = '联营'
                            }
                        }
                    } else {
                        this.showH = false
                        for (const item of arr) {
                            item.taxRates = this.rateTransform(item.taxRate)
                            if (item.goodsType === 'provider_contract_business_type:1') {
                                item.goodsType = '自营'
                            }
                            if (item.goodsType === 'provider_contract_business_type:2' || item.goodsType === 'provider_contract_business_type:3') {
                                item.goodsType = '联营'
                            }
                        }
                    }

                    this.categoryinfoData = arr
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'ProviderMonitorFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id, e.type)
                    if (e.status === 'provider_fee_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        sourceOrganize: e.sourceOrganize ? `${e.sourceOrganize}--${e.sourceOrganizeName}` : '',
                        type: e.typeName,
                        feeAmount: e.feeAmount,
                        feeType: e.feeType,
                        startDate: e.startDate,
                        endDate: e.endDate,
                        chargeUserno: e.chargeUserno ? `${e.chargeUserno}--${e.chargeUsernoName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeTime: e.makeTime,
                        auditUserno: e.auditUserno ? `${e.auditUserno}--${e.auditUsernoName}` : '',
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
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

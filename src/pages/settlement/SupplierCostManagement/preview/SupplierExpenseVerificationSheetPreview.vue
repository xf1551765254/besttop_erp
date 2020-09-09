<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 18:35:08
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="核销单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="核销单详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.auditUserCode || ''}` }}</pre>
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
                { key: 'provider', name: '供应商' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'goodsType', width: 100 },
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 100 },
                { title: '费用监控单号', dataIndex: 'feeCode', width: 100 },
                { title: '费用项目', dataIndex: 'name', width: 100 },
                { title: '净毛利核销(含税)', dataIndex: 'feeProfit', width: 200, align: 'right' },
                { title: '净毛利核销(未税)', dataIndex: 'feeProfitW', width: 200, align: 'right' },
                { title: '赞返核销', dataIndex: 'feeSponsor', width: 100, align: 'right' },
                { title: '未核销费用', dataIndex: 'fee', width: 100, align: 'right' },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'ProviderFactDetailSelectFeeFactDetail',
                method: 'post',
                body: {
                    id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.providerFeeFactDetails
                    const { add, mul } = this.$math
                    arr.forEach(i => {
                        if (i.goodsType === 'provider_contract_business_type:1') {
                            i.goodsType = '自营'
                        }
                        if (i.goodsType === 'provider_contract_business_type:2' || i.goodsType === 'provider_contract_business_type:3') {
                            i.goodsType = '联营'
                        }
                        i.feeProfitW = mul(i.feeProfit, add(1, i.taxRate), 6)
                    })
                    this.categoryinfoData = arr
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'ProviderFactSelectFeeFact',
                method: 'post',
                body: {
                    code: this.orderId,
                    reinforcedFilter: [],
                    page: 1,
                    rows: 25
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'provider_fee_fact_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'provider_fee_fact_status:3') {
                        this.tags = ['confirm']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        provider: e.provider ? `${e.provider}--${e.providerName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}--${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUserCode: e.auditUserCode ? `${e.auditUserCode}--${e.auditUserName}` : '',
                        auditTime: e.auditTime
                        
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

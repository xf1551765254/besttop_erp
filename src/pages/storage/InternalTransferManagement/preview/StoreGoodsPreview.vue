<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:27:18
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="门店要货"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="门店要货详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
          <pre>{{ `审核人：${previewFooters.auditUser || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核时间：${previewFooters.auditTime || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
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
                { key: 'toStoreCode', name: '要货位置' },
                { key: 'fromStoreCode', name: '出货位置' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'requLv', name: '要货等级' },
                { key: 'applyBy', name: '申请人' },
                { key: 'applyTime', name: '申请时间' }
            ],
            // 单据表头
            columnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200, align: 'center' },
                { title: '品牌', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'center' },
                { title: '零售价', dataIndex: 'skuPrice', width: 150, align: 'center' },
                { title: '成本价(含税)', dataIndex: 'skuPtCost', width: 150, align: 'center' },
                { title: '税率', dataIndex: 'skuTaxRates', width: 100, align: 'center' },
                { title: '要货数量', dataIndex: 'qtty', width: 150, align: 'center' },
                { title: '现库存', dataIndex: 'numbers', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail (code, fromStoreCode) {
            axios({
                path: 'DistributionBillRequDetaiSelect',
                method: 'post',
                body: {
                    requCode: code,
                    fromStoreCode: fromStoreCode
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.skuTaxRates = this.rateTransform(i.skuTaxRate)
                    })
                    this.categoryinfoData = data
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'DistributionBillRequFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.code, e.fromStoreCode)
                    if (e.billStatus === 'bill_pre_entry_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        toStoreCode: e.toStoreCode ? `${e.toStoreCode}--${e.toStoreName}` : '',
                        fromStoreCode: e.fromStoreCode ? `${e.fromStoreCode}--${e.fromStoreName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        requLv: e.requLvName,
                        applyBy: e.applyBy ? `${e.applyBy}--${e.applyName}` : '',
                        applyTime: e.applyTime
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}--${e.createName}` : '',
                        createTime: e.createTime,
                        auditUser: e.auditBy ? `${e.auditBy}--${e.auditName}` : '',
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

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-21 11:27:39
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="采购价格调整单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="采购价格调整详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
          <pre>{{ `制单位置：${previewFooters.createStoreCode || ''}` }}</pre>
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
                { key: 'supplierName', name: '供应商' },
                { key: 'contractCode', name: '合同名称' },
                { key: 'managerBy', name: '负责人' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'purchasingBy', name: '采购员' },
                { key: 'note', name: '备注' }
            ],
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '新含税进价', dataIndex: 'ptIn', width: 90, align: 'right' },
                { title: '原含税进价', dataIndex: 'ptInOrig', width: 90, align: 'right' },
                { title: '新扣率', dataIndex: 'deductionRate', width: 80, align: 'right' },
                { title: '原扣率', dataIndex: 'deductionRateOrigs', width: 80, align: 'right' },
                { title: '新正常返点', dataIndex: 'normalRebateNew', width: 80, align: 'center' },
                { title: '原正常返点', dataIndex: 'normalRebate', width: 80, align: 'center' },
                { title: '新特价返点', dataIndex: 'specialRebateNew', width: 80, align: 'center' },
                { title: '原特价返点', dataIndex: 'specialRebate', width: 80, align: 'center' },
                { title: '变更类型', dataIndex: 'type', width: 80, align: 'left' },
                { title: '零售价', dataIndex: 'price', width: 80, align: 'right' },
                { title: '原因', dataIndex: 'reason', align: 'left' }
            ],
            billsData: []
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        findDetail () {
            axios({
                path: 'BillDetailFindDetail',
                method: 'post',
                body: {
                    purchasePriceCode: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.deductionRateOrigs = this.rateTransform(i.deductionRateOrig)
                        i.deductionRate = this.rateTransform(i.deductionRate)
                        i.flagType = true
                        i.type = i.typeName
                        i.normalRebate = this.rateTransform(i.normalRebate)
                        i.specialRebate = this.rateTransform(i.specialRebate)
                        i.normalRebateNew = this.rateTransform(i.normalRebateNew)
                        i.specialRebateNew = this.rateTransform(i.specialRebateNew)
                    }
                    this.billsData = res.data.list
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillPurchaseFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_purchase_price_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'bill_purchase_price_status:3') {
                        this.tags = ['effective']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        effectTime: e.effectTime,
                        supplierName: e.supplier ? `${e.supplier}-${e.supplierName}` : '',
                        contractCode: e.contractCode ? `${e.contractCode}-${e.providerContractName}` : '',
                        managerBy: e.managerBy ? `${e.managerBy}-${e.managerName}` : '',
                        note: e.note,
                        purchasingBy: e.purchasingBy ? `${e.purchasingBy}-${e.purchasingName}` : ''
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createName}` : '',
                        createTime: e.createTime,
                        approveBy: e.approveBy ? `${e.approveBy}-${e.approveName}` : '',
                        approveTime: e.approveTime,
                        createStoreCode: e.createStoreCode ? `${e.createStoreCode}-${e.createStoreName}` : ''
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

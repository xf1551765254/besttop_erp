<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 17:05:49
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="采购订单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="采购订单详情" :isTable="true" :columns="categoryinfoColumns" :data="categoryinfoData"></div>
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
                { key: 'noteA', name: '供应商' },
                { key: 'contractCode', name: '合同编码' },
                { key: 'receiveStoreCode', name: '收货位置' },
                { key: 'expectedArrivalDate', name: '收货时间' },
                { key: 'noteB', name: '收货联系人' },
                { key: 'noteC', name: '联系电话' },
                { key: 'type', name: '采购类型' },
                { key: 'note', name: '备注' }
            ],
            categoryinfoColumns: [ // 采购订单详情表头
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'left', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'left', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'left', width: 300 },
                { title: '订包装量', dataIndex: 'orderQuantity', align: 'right', width: 80 },
                { title: '预估售价', dataIndex: 'pricePre', align: 'right', width: 80 },
                { title: '采购价', dataIndex: 'purchasePrice', align: 'right', width: 80 },
                { title: '订货额', dataIndex: 'stockPrice123', align: 'right', width: 80 },
                { title: '毛利额', dataIndex: 'orderQuantity11', align: 'right', width: 80 },
                { title: '毛利率', dataIndex: 'saleNWee411', align: 'right', width: 80 },
                { title: '每包含量', dataIndex: 'orderPack', align: 'right', width: 80 },
                { title: '税率', dataIndex: 'skuTaxRates', align: 'right', width: 80 },
                { title: '月返点', dataIndex: 'normalRebates', align: 'right', width: 80 },
                { title: '订货总量', dataIndex: 'orderGoodsGross', align: 'right', width: 80 },
                { title: '现库存', dataIndex: 'nowStock', align: 'right', width: 80 },
                { title: '商品条码', dataIndex: 'barcode', align: 'left', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', align: 'left', width: 50 },
                { title: '月销量', dataIndex: 'name11', align: 'right', width: 100 },
                { title: '倒1周', dataIndex: 'saleNWeek1', align: 'right', width: 80 },
                { title: '倒2周', dataIndex: 'saleNWeek2', align: 'right', width: 80 },
                { title: '倒3周', dataIndex: 'saleNWeek3', align: 'right', width: 80 },
                { title: '倒4周', dataIndex: 'saleNWeek4', align: 'right', width: 80 },
                { title: '可预售天数', dataIndex: 'safeDays', align: 'right', width: 80 },
                { title: '备注', dataIndex: 'note', align: 'left' }
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
                path: 'BillOrderDetailFindDetail',
                method: 'post',
                body: {
                    orderCode: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    const { add, mul, div, sub } = this.$math
                    arr.forEach(i => {
                        const monthlySales = add(add(i.saleNWeek1, i.saleNWeek2, 0), add(i.saleNWeek3, i.saleNWeek4, 0), 0)// 月销量
                        const theTotalOrder = mul(i.orderPack, i.orderQuantity, 0)// 订货总量
                        i.orderGoodsGross = theTotalOrder
                        const theTotalAmountOfTheOrder = mul(theTotalOrder, i.pricePre, 2)// 订货总额
                        const grossProfitMargin = sub(theTotalAmountOfTheOrder, mul(theTotalOrder, i.purchasePrice), 2)// 毛利
                        const grossProfitRate = div(grossProfitMargin, theTotalAmountOfTheOrder, 2)// 毛利率
                        let presell = ''
                        console.log(monthlySales)
                        if (monthlySales === '0') {
                            console.log('可预售天数')
                            presell = 0// 可预售天数
                        } else {
                            presell = div(theTotalOrder, div(monthlySales, 28, 0), 0)// 可预售天数
                        }
                        i.tbWebId = i.skuCode
                        i.stockPrice123 = mul(theTotalOrder, i.purchasePrice, 2)
                        i.safeDays = presell
                        i.orderQuantity11 = grossProfitMargin
                        i.saleNWee411 = grossProfitRate
                        i.name11 = monthlySales
                        i.skuTaxRates = this.rateTransform(i.skuTaxRate)
                        i.normalRebates = this.rateTransform(i.normalRebate)
                    })
                    this.categoryinfoData = arr
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillOrderFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    console.log(e, '123456')
                    if (e.status === 'bill_order_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        ...e,
                        noteA: e.noteA ? `${e.noteA}-${e.noteName}` : '',
                        receiveStoreCode: e.receiveStoreCode ? `${e.receiveStoreCode}-${e.receiveStoreName}` : '',
                        type: e.typeName,
                        contractCode: e.contractCode ? `${e.contractCode}-${e.contractName}` : '',
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

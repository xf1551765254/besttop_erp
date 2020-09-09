<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-27 11:11:20
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="采购订单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="采购订单详情" :isTable="true" :columns="detailsColumns" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUserCode || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
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
            detailsColumns: [
                { title: '订货未收量', dataIndex: 'entryQttys', width: 80, align: 'right' },
                { title: '入库数量', dataIndex: 'entryQtty', width: 80, align: 'right' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', width: 50 },
                { title: '备注', dataIndex: 'note' }
            ],
            // 基础信息
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'entryMakeStoreCode', name: '收货位置' },
                { key: 'expectedArrivalDate', name: '收货时间' },
                { key: 'noteB', name: '收货联系人' },
                { key: 'noteC', name: '联系电话' },
                { key: 'typeName', name: '采购类型' },
                { key: 'note', name: '备注' }
            ],
            billsData: []
        }
    },
    methods: {
        /**
         * @name: 序号
         */
        taIndex (data) {
            let num = 1
            data.forEach(i => {
                i.index = num++
            })
        },
        findDetail (code) {
            axios({
                path: 'DistributionBillEntryFindBillOrderDetail',
                method: 'post',
                body: {
                    code: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    for (const i of res.data) {
                        i.entryQttys = this.$math.sub(i.orderQuantity, i.chargeQuantity, 0)
                        i.entryQtty = i.chargeQuantity
                        i.basicUnit = i.unit
                    }
                    this.billsData = [...res.data]
                    this.taIndex(this.billsData)
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'BillOrderFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.code)
                    if (e.billStatus === 'bill_order_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        ...e,
                        provider: e.noteA ? `${e.noteA}-${e.noteName}` : '',
                        makeStoreCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
                        entryMakeStoreCode: e.receiveStoreCode ? `${e.receiveStoreCode}-${e.receiveStoreName}` : '',
                        entryBy: e.entryBy ? `${e.entryBy}-${e.entryByName}` : ''
                    }
                    this.previewFooters = {
                        makeUserCode: e.createBy ? `${e.createBy}-${e.createName}` : '',
                        makeTime: e.createTime,
                        note: e.note,
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
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

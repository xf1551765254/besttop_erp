<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-28 10:11:24
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="预收/退库"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="预收/退库详情" :isTable="true" :columns="columnsA" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.makeUser || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.makeTime || ''}` }}</pre>
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
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'storeCode', name: '制单位置' },
                { key: 'verificationStatus', name: '是否核销' },
                { key: 'recType', name: '类型' },
                { key: 'recDt', name: '收/退货日期' },
                { key: 'chargeUser', name: '负责人' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '发生数量', dataIndex: 'recN', width: 80, align: 'right' },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 50 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoData: []
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
        findDetail (id, type) {
            axios({
                path: 'DistributionBillPreEntryGet',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const { abs } = this.$math
                    const editArr = res.data.preEntryDetaillist
                    editArr.forEach(i => {
                        i.skuUnit = i.basicUnit
                        i.skuModel = i.model
                        if (type === 'bill_pre_entry_rec_type:2') {
                            i.recN = abs(i.recN, 0)
                        }
                    })
                    this.categoryinfoData = editArr
                    // this.taIndex(this.categoryinfoData)
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.categoryinfoData.length = 0
            axios({
                path: 'DistributionBillPreEntryFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id, e.recType)
                    if (e.billStatus === 'bill_pre_entry_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        verificationStatus: e.verificationStatus ? e.verificationStatusName : '',
                        provider: e.provider ? `${e.provider}-${e.providerName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
                        recType: e.recTypeName,
                        recDt: e.recDt,
                        chargeUser: e.chargeUser ? `${e.chargeUser}-${e.chargeUserName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        makeUser: e.makeUser ? `${e.makeUser}-${e.makeUserName}` : '',
                        makeTime: e.makeTime,
                        auditUser: e.auditUser ? `${e.auditUser}-${e.auditUserName}` : '',
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

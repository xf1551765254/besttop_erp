<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-14 10:14:33
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="内部销售价格策略"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="内部销售价格策略详情" :isTable="true" :columns="columnsA" :data="billsData"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
          <pre>{{ `备注：${previewFooters.note || ''}` }}</pre>
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
                { key: 'tempObjArr', name: '生效分店' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'managerBy', name: '负责人' }
            ],
            // 单据表头
            columnsA: [
                { title: 'sku编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: 'sku名称', dataIndex: 'skuName', width: 200, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'center' },
                { title: '调拨价', dataIndex: 'insidePrice', width: 150, align: 'center' },
                { title: '成本价格', dataIndex: 'ptCost', width: 150, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 50, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'BillInsidetailQueryByCode',
                method: 'post',
                body: {
                    insideCode: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.bt_web_id = i.skuCode
                    }
                    this.billsData = res.data.list
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'BillInsideQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_inside_price_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        originalCode: e.originalCode,
                        tempObjArr: e.effectStoreName,
                        effectTime: e.effectTime,
                        managerBy: e.managerBy ? `${e.managerBy}-${e.managerByName}` : ''
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createByName}` : '',
                        createTime: e.createTime,
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
                this.findDetail()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

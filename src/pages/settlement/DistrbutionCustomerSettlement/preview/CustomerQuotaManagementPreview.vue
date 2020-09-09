<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-27 16:22:17
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="客户限额管理"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="C" title="客户限额详情" :isTable="true" :columns="columnsA" :data="billsData"></div>
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
                { key: 'storeCode', name: '隶属公司' },
                { key: 'chargeUserCode', name: '负责人' },
                { key: 'makeStoreCode', name: '制单位置' },
                { key: 'applyUserCode', name: '申请人' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            columnsA: [
                { title: '客户编码', dataIndex: 'custNo', width: 100, align: 'left' },
                { title: '客户名称', dataIndex: 'custName', width: 200, align: 'left' },
                { title: '原设定限额', dataIndex: 'origLimitA', width: 200, align: 'right' },
                { title: '新设定限额', dataIndex: 'limitA', width: 200, align: 'right' },
                { title: '备注', dataIndex: 'note', align: 'left' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'CustLimitFindDetail',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.billsData = res.data.list
                    this.previewVisbel = true
                }
            })
        },
        detailsSumbit () {
            this.billsData.length = 0
            axios({
                path: 'CustLimitFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                    if (e.status === 'bill_cust_limit_set_status:1') {
                        this.tags = ['uncheck']
                    } else {
                        this.tags = ['check']
                    }
                    this.orderId = e.code
                    this.previewContent.headers = {
                        storeCode: e.storeCode ? `${e.storeCode}--${e.storeName}` : '',
                        chargeUserCode: e.chargeUserCode ? `${e.chargeUserCode}--${e.chargeUserName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}--${e.makeStoreName}` : '',
                        applyUserCode: e.applyUserCode ? `${e.applyUserCode}--${e.applyUserName}` : '',
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

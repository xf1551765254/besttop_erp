<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 11:33:24
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-28 15:56:07
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="供应商付款单"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="付款单详情" :isTable="true" :columns="categoryinfoColumns" :data="categoryinfoData"></div>
    <div slot="footer">
      <a-row style="margin-bottom:20px">
        <a-col :span="2"></a-col>
        <a-col :span="20">
          <a-table
            rowKey="tb_web_id"
            :columns="totalColumns"
            :dataSource="totalData"
            :pagination="false"
            size="small"
            :scroll="{x:400}"
            bordered
          >
          </a-table>
          <a-col :span="2"></a-col>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
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
            tags: [],
            categoryinfoData: [],
            previewContent: {},
            previewFooters: {},
            previewHeaders: [
                { key: 'provider', name: '供应商' },
                { key: 'byTime', name: '截止日期' },
                { key: 'accountBank', name: '开户行' },
                { key: 'accountNo', name: '账号' },
                { key: 'payMode', name: '付款方式' },
                { key: 'payInvno', name: '付款凭证' },
                { key: 'invoiceNo', name: '发票号码' },
                { key: 'upStoreCode', name: '隶属公司' },
                { key: 'chargeBy', name: '负责人' },
                { key: 'note', name: '备注' }
            ],
            // 单据表头
            categoryinfoColumns: [
                { title: '结算单号', dataIndex: 'payBillCode', width: 200 },
                { title: '销售额', dataIndex: 'sale', width: 200, align: 'right' },
                { title: '应付金额', dataIndex: 'atPay', align: 'right' }
            ],
            totalColumns: [
                { title: '上期未付', dataIndex: 'unpaid', width: 100, align: 'right' },
                { title: '本期应付', dataIndex: 'handle', width: 100, align: 'right' },
                { title: '本期实付', dataIndex: 'outOfPocket', width: 100, align: 'right' },
                { title: '本期结余', dataIndex: 'surplus', width: 100, align: 'right' }
            ],
            totalData: [
                {
                    tb_web_id: '01',
                    unpaid: '0',
                    handle: '0',
                    outOfPocket: '0',
                    surplus: '0'
                }
            ]
        }
    },
    methods: {
        supplierSumFindDetail (e) {
            axios({
                path: 'SupplierSumFindDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    this.categoryinfoData = arr
                }
            })
        },
        findStoreByCode (e) {
            axios({
                path: 'OrganizationStoreFindStoreByCode',
                method: 'post',
                body: {
                    code: e.makeStoreCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.$set(this.previewContent.headers, 'upStoreCode', `${data.code}:${data.name}`)
                }
                this.previewVisbel = true
            })
        },
        detailHandler (detailData) {
            this.categoryinfoData.length = 0
            axios({
                path: 'SupplierSumFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.supplierSumFindDetail(e)
                    this.findStoreByCode(e)
                    if (e.status === 'bill_sum_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'bill_sum_status:3') {
                        this.tags = ['confirm']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        provider: e.provider ? `${e.provider}-${e.providerName}` : '',
                        byTime: e.byTime,
                        accountBank: e.accountBank,
                        accountNo: e.accountNo,
                        payMode: e.payModeName,
                        payInvno: e.payInvno,
                        invoiceNo: e.invoiceNo,
                        upStoreCode: e.upStoreCode ? `${e.upStoreCode}-${e.upStoreName}` : '',
                        chargeBy: e.chargeBy ? `${e.chargeBy}-${e.chargeByName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {

                        createBy: e.createBy ? `${e.createBy}-${e.createByName}` : '',
                        createTime: e.createTime,
                        auditUserno: e.auditUserno ? `${e.auditUserno}-${e.auditUsernoName}` : '',
                        auditTime: e.auditTime

                    }
                    this.providerId = e.provider
                    axios({
                        path: 'SupplierSumFindDelay',
                        method: 'POST',
                        body: {
                            provider: e.provider,
                            makeStoreCode: this.$store.getters.storeInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('本期结余', res)
                            this.totalData[0].unpaid = res.data
                        }
                    })
                    this.totalData[0].handle = e.atPay
                    this.totalData[0].surplus = e.factPay
                    this.totalData[0].outOfPocket = e.delay
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailHandler()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

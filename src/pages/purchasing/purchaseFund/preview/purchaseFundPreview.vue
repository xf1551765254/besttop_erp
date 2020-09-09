<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 18:59:15
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="采购资金拨付"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="税票信息">
      <a-row>
        <a-col :sm="4" :md="4" :xl="2">公司名称</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ billInformation.sname || '' }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">公司地址</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ billInformation.addressTax || '' }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">公司电话</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ billInformation.telTax || '' }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">纳税人识别号</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ billInformation.taxNo || '' }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">开户行账号</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ `${billInformation.bank || ''}-${billInformation.acctNo || ''}` }}</span></a-col>
      </a-row>
    </div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
          <pre>{{ `制单位置：${previewFooters.orderStoreCode || ''}` }}</pre>
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
import { lowToUp } from '@utils/util'
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
            // 税票信息
            billInformation: {},
            previewFooters: {},
            previewContent: {},
            tags: [],
            // 基础信息
            previewHeaders: [
                { key: 'providerCode', name: '供应商' },
                { key: 'originalCode', name: '源单据号' },
                { key: 'phone', name: '联系电话' },
                { key: 'fax', name: '联系传真' },
                { key: 'openingBank', name: '开户行' },
                { key: 'openingBankAmount', name: '账号' },
                { key: 'saleBy', name: '业务员' },
                { key: 'payType', name: '付款方式' },
                { key: 'payTime', name: '资金拨出日' },
                { key: 'invoiceCode', name: '票据号码' },
                { key: 'payAmount', name: '拨款金额' },
                { key: 'payAmountD', name: '大写金额' },
                { key: 'explainAmount', name: '付款说明' },
                { key: 'note', name: '备注' }
            ]
        }
    },
    methods: {
        getTaxt (code) {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    code: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.billInformation = res.data.list[0]
                }
            })
        },
        detailsSumbit () {
            axios({
                path: 'BillAppropriationFind',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'bill_appropriation_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'bill_appropriation_status:3') {
                        this.tags = ['confirm']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        ...e,
                        payAmount: e.payAmount ? `￥ ${e.payAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '',
                        providerCode: e.providerCode ? `${e.providerCode}--${e.providerName}` : '',
                        payType: e.payTypeName,
                        payAmountD: lowToUp(Number(e.payAmount)),
                        saleBy: e.saleBy ? `${e.saleBy}--${e.saleName}` : '',
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}--${e.createName}` : '',
                        createTime: e.createTime,
                        approveTime: e.approveTime,
                        approveBy: e.approveBy ? `${e.approveBy}--${e.approveName}` : '',
                        orderStoreCode: `${e.orderStoreCode}--${e.orderStoreName}`
                    }
                    this.getTaxt(e.orderStoreCode)
                }
            })
        }
    },
    watch: {
        value (val) {
            this.previewVisbel = val
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

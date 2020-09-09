<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:09:29
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="收款方式控制"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="收款方式控制详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
    <div slot="footer">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.make || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.makeTime || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.audit || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewFooters.auditTime || '' }}</a-col>
      </a-row>
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">备注</a-col>
        <a-col :sm="16" :md="20" :xl="21">{{ previewFooters.note || '' }}</a-col>
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
        },
        epreviewTableData: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            previewVisbel: false,
            previewFooters: {},
            previewContent: {},
            tags: [],
            previewHeaders: [
                { key: 'makeStore', name: '制单位置' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'store', name: '生效分店' }
            ],
            // 表格表头 基础信息
            previewColumns: [
                { title: '付款方式', align: 'center', dataIndex: 'payType', width: 150 },
                { title: '是否控制付款', align: 'center', dataIndex: 'isControl', width: 150, customRender: (text, record, index) => text === '0' ? '否' : '是' },
                { title: '厂家承担（%）', align: 'center', dataIndex: 'assumeRate', width: 150, customRender: (text, record, index) => `${Number(text).toFixed(2)}` },
                { title: '公司承担（%）', align: 'center', dataIndex: 'ownRate', width: 150, customRender: (text, record, index) => `${Number(text).toFixed(2)}` },
                { title: '规则描述', align: 'center', dataIndex: 'note' }
            ]
        }
    },
    mounted () {

    },
    methods: {
        findDetail (id) {
            axios({
                path: 'PaymentControlQueryDetail',
                method: 'post',
                body: {
                    typeControlId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    const newObj = [...this.epreviewTableData]
                    newObj.forEach(i => {
                        const target = res.data.list.filter(o => o.payType === i.value)
                        if (target.length > 0) {
                            i.isControl = target[0].isControl
                            i.assumeRate = target[0].assumeRate
                            i.ownRate = target[0].ownRate
                            i.note = target[0].note
                        } else {
                            i.isControl = 0
                            i.assumeRate = 0
                            i.ownRate = 100
                            i.note = ''
                        }
                    })
                    this.tableData = newObj
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'PaymentControlQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'payment_type_control_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'payment_type_control_status:2') {
                        this.tags = ['check']
                    }
                    const store = []
                    if (detailData.storeId) {
                        const arr1 = detailData.storeId ? detailData.storeId.split(',') : []
                        const arr2 = detailData.storeName ? detailData.storeName.split(',') : []
                        arr1.forEach((item, k) => {
                            arr2.forEach((o, j) => {
                                if (k === j) {
                                    store.push(item + '-' + o)
                                }
                            })
                        })
                    }
                    this.previewContent.headers = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        store: store.join(','),
                        effectTime: detailData.effectTime
                    }
                    this.previewFooters = {
                        make: detailData.makeBy ? `${detailData.makeBy} - ${detailData.makeName}` : '',
                        makeTime: detailData.makeTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditName}` : '',
                        auditTime: detailData.auditTime,
                        note: detailData.note
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

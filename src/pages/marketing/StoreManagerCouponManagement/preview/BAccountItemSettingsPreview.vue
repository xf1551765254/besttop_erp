<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:10:34
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="B账户商品配置"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="B账户商品配置详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
            previewColumns: [
                { title: '商品编码', width: 180, align: 'center', dataIndex: 'skuCode' },
                { title: '商品名称', width: 180, align: 'center', dataIndex: 'skuName' },
                { title: '规格型号', width: 180, align: 'center', dataIndex: 'skuModel' },
                { title: '提成金额（元）', width: 180, align: 'center', dataIndex: 'pushMoney' },
                { title: '备注', align: 'center', dataIndex: 'note' }

            ],
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'CouponBQueryDetail',
                method: 'post',
                body: {
                    couponBDefineId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.list
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.epreviewTableData.length = 0
            axios({
                path: 'CouponBQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'coupon_define_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'coupon_define_status:2') {
                        this.tags = ['check']
                    } else {
                        this.tags = ['effective']
                    }
                    const store = []
                    if (detailData.storeCode) {
                        const arr1 = detailData.storeCode.split(',')
                        const arr2 = detailData.storeName.split(',')
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

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:10:13
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="A账户设置"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="A账户设置详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
                { key: 'business', name: '组织机构' },
                { key: 'effectTime', name: '生效日期' }
            ],
            previewColumns: [
                { title: '分店代码', dataIndex: 'storeCode', width: 180, align: 'center' },
                { title: '分店名称', dataIndex: 'storeName', width: 180, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 180, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 180, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '额度(元)', dataIndex: 'amount', width: 120, align: 'center' },
                { title: '使用率（%）', dataIndex: 'useRate', width: 150, align: 'center', customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'CouponAQueryDetail',
                method: 'post',
                body: {
                    couponADefineId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = [...res.data.list]
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.epreviewTableData.length = 0
            axios({
                path: 'CouponAQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    this.previewContent.headers = {
                        business: detailData.businessUnit ? `${detailData.businessUnit} - ${detailData.businessName}` : '',
                        effectTime: detailData.effectTime
                    }
                    if (detailData.status === 'coupon_define_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'coupon_define_status:2') {
                        this.tags = ['check']
                    } else {
                        this.tags = ['effective']
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

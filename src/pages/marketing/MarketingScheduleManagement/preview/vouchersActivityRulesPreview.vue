<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:09:48
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="用券活动规则单"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="用券活动规则单详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
                { key: 'scheduleDefineId', name: '活动名称' },
                { key: 'isChange', name: '金额是否可修改' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'store', name: '生效分店' }
            ],
            previewColumns: [
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 100 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '使用金额（元）', dataIndex: 'rateAmount', align: 'center', width: 150 },
                { title: '上限金额（元）', dataIndex: 'maxAmount', align: 'center', width: 150 },
                { title: '达标金额（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 150 },
                { title: '分摊比率（%）', dataIndex: 'rateProvider', align: 'center', width: 150, customRender: (text, record, index) => `${Number(text * 100).toFixed(2)}` },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            // 单据表头
            epreviewTableData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'ScheduRuleQueryDetail',
                method: 'post',
                body: {
                    ruleDefineId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.defineDetails
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.epreviewTableData.length = 0
            axios({
                path: 'ScheduRuleQueryVouchers',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'schedule_rule_define_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'schedule_rule_define_status:2') {
                        this.tags = ['check']
                    } else if (detailData.status === 'schedule_rule_define_status:3') {
                        this.tags = ['effective']
                    } else if (detailData.status === 'schedule_rule_define_status:5') {
                        this.tags = ['noeffective']
                    } else {
                        this.tags = ['stoped']
                    }
                    const store = []
                    if (detailData.storeCode) {
                        const arr1 = detailData.storeCode ? detailData.storeCode.split(',') : []
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
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        scheduleDefineId: detailData.defineName,
                        isChange: detailData.isChange === '0' ? '否' : '是'
                    }
                    this.previewFooters = {
                        make: detailData.createBy ? `${detailData.createBy} - ${detailData.createName}` : '',
                        makeTime: detailData.createTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditByName}` : '',
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

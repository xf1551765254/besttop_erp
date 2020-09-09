<!--
 * @Description: 单品满减
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-23 11:41:09
 * @LastEditors: lin
 * @LastEditTime: 2019-08-15 14:21:16
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="单品满减活动规则单"
      :tags="previewTags"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="满减规则">
        <a-col :sm="8" :md="4" :xl="3">达标金额</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewForm.standardAmount||'' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">满金额</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewForm.reachAmount||'' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">上限金额</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewForm.maxAmount||'' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">减金额</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewForm.rateAmount||'' }}</a-col>
      </div>
      <div slot="B" title="商品列表详情" :isTable="true" :columns="previewColumns" :data="previewTableData"></div>
      <div slot="footer">
        <a-row>
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewForm.make }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewForm.makeTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewForm.makeStore }}</a-col>
          <a-col :md="4" :lg="3" :xl="3" v-if="previewForm.auditTime">审核人：</a-col>
          <a-col :md="8" :lg="5" :xl="5" v-if="previewForm.auditTime"> {{ previewForm.audit }}</a-col>
          <a-col :md="4" :lg="3" :xl="3" v-if="previewForm.auditTime">审核时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5" v-if="previewForm.auditTime"> {{ previewForm.auditTime }}</a-col>
        </a-row>
      </div>
    </Preview>
  </div>
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
            previewForm: {},
            previewContent: {},

            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'name', name: '规则名称' },
                { key: 'scheduleDefineName', name: '活动名称' },
                { key: 'store', name: '生效机构' },
                { key: 'ifChange', name: '金额是否可修改' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'note', name: '备注' }
            ],
            previewColumns: [
                { title: '品类', dataIndex: 'concatClass', align: 'center', width: 200 },
                { title: '品牌', dataIndex: 'concatBrand', align: 'center', width: 200 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 100 },
                { title: '单位', dataIndex: 'unit', align: 'center', width: 120 },
                { title: '分摊比率（%）',
                    dataIndex: 'rateProvider',
                    align: 'center',
                    width: 120,
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '达标单价（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 120 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            previewTableData: []

        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'ScheduRuleQueryDetail',
                method: 'post',
                body: {
                    ruleDefineId: id,
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.previewTableData = res.data.defineDetails
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'ScheduRuleQueryScheduleRule',
                method: 'post',
                body: {
                    code: this.orderId,
                    scheduleType: 'schedule_rule_define_schedule_type:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'schedule_rule_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'schedule_rule_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'schedule_rule_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'schedule_rule_define_status:4') {
                        this.previewTags = ['stoped']
                    } else {
                        this.previewTags = ['expired']
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
                        name: detailData.name,
                        scheduleDefineName: detailData.defineName,
                        store: store.join('，'),
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        ifChange: detailData.ifChange === 1 ? '是' : '否',
                        note: detailData.note
                    }
                    this.previewForm = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        make: detailData.makeBy ? `${detailData.makeBy} - ${detailData.makeName}` : '',
                        makeTime: detailData.makeTime,
                        audit: `${detailData.auditBy} - ${detailData.auditByName}`,
                        auditTime: detailData.auditTime,
                        standardAmount: detailData.standardAmount,
                        reachAmount: detailData.reachAmount,
                        maxAmount: detailData.maxAmount,
                        rateAmount: detailData.rateAmount
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

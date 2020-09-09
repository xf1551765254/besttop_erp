<!--
 * @Description: 促销券使用规则
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-07 17:14:05
 * @LastEditors: lin
 * @LastEditTime: 2019-08-15 17:38:46
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="促销券使用规则"
      :tags="previewTags"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="B" title="商品详情" :isTable="true" :columns="previewColumns" :data="previewTableData"></div>
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
            previewContent: {},
            returnRule: {},
            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'scheduleCouponTypeDefineCode', name: '促销券类型' },
                { key: 'name', name: '规则名称' },
                { key: 'store', name: '生效机构' },
                { key: 'effectType', name: '有效期类型' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'standardAmount', name: '达标金额' },
                { key: 'reachAmount', name: '满金额' },
                { key: 'useAmount', name: '用金额' },
                { key: 'maxAmount', name: '上限金额' },
                { key: 'note', name: '备注' }
            ],
            previewColumns: [
                { title: '品类', dataIndex: 'classCodeName', align: 'center', width: 200 },
                { title: '品牌', dataIndex: 'brandCodeName', align: 'center', width: 200 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 100 },
                { title: '单位', dataIndex: 'unit', align: 'center', width: 120 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            previewTableData: [],

            previewForm: {}

        }
    },
    methods: {
        detailsSumbit () {
            axios({
                path: 'ScheduleCouponRuleDefineFindOne',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data
                    this.previewTableData = [...res.data.detailList]
                    if (detailData.status === 'schedule_coupon_rule_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'schedule_coupon_rule_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'schedule_coupon_rule_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'schedule_coupon_rule_define_status:4') {
                        this.previewTags = ['noeffective']
                    }

                    this.previewContent.headers = {
                        scheduleCouponTypeDefineCode: detailData.scheduleCouponTypeDefineCode + detailData.typeDefineName,
                        name: detailData.name,
                        store: detailData.effectStoreName,
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        effectType: detailData.effectType === 1 ? '临时有效' : '长期有效',
                        standardAmount: detailData.standardAmount,
                        reachAmount: detailData.reachAmount,
                        useAmount: detailData.useAmount,
                        maxAmount: detailData.maxAmount,
                        note: detailData.note
                    }
                    this.previewForm = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        make: detailData.createBy ? `${detailData.createBy} - ${detailData.createByName}` : '',
                        makeTime: detailData.createTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditByName}` : '',
                        auditTime: detailData.auditTime

                    }
                    this.previewVisbel = true
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

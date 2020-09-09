<!--
 * @Description: 档期活动规则预览
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-13 17:50:56
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:09:05
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      :tags="previewTags"
      title="活动规则单"
      :orderId="orderId"
      :headers="isArbitrageType?previewHeadersTow:previewHeaders"
      :content="previewContent" >
      <!--  满免  满赠 -->
      <div
        slot="A"
        v-if="isFreeGift"
        title="活动规则单详情"
        :isTable="true"
        :columns="tableColumnsOne"
        :data="detailDataOne"></div>
      <!-- 满减 满返 -->
      <div
        slot="B"
        v-if="!isFreeGift"
        title="活动规则单详情"
        :isTable="true"
        :columns="isArbitrageType?tableColumnsThree:tableColumnsTow"
        :data="detailDataTow"></div>
      <!-- 赠品规则表格 -->
      <div
        slot="C"
        v-if="isGift"
        title="赠品规则设置详情"
        :isTable="true"
        :columns="tableColumnsGift"
        :data="detailDataGift"></div>
      <!--  满免规则 -->
      <div
        slot="D"
        v-if="isFree"
        title="满免规则设置详情"
        :isTable="true"
        :columns="tableColumnsFree"
        :data="detailDataFree"></div>
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
    </Preview>
  </div>
</template>
<style lang="less">

</style>
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
            previewTags: [],
            previewHeaders: [
                { key: 'makeStore', name: '制单位置' },
                { key: 'scheduleName', name: '活动名称' },
                { key: 'scheduleType', name: '活动类型' },
                { key: 'isChange', name: '金额是否可修改', isUnique: 'out' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'store', name: '生效分店' },
                { key: 'reachAmount', name: '达标金额' },
                { key: 'isShow', name: '是否显性', isUnique: 'out' }
            ],
            previewHeadersTow: [
                { key: 'makeStore', name: '制单位置' },
                { key: 'scheduleName', name: '活动名称' },
                { key: 'scheduleType', name: '活动类型' },
                { key: 'isChange', name: '金额是否可修改' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'store', name: '生效分店' },
                { key: 'reachAmount', name: '达标金额' },
                { key: 'maxAmount', name: '上限金额' },
                { key: 'rateAmount', name: '返/减金额' }
            ],
            isGift: true, // 是否是赠品
            isFree: false,
            isFreeGift: true,
            isArbitrageType: false, // 是否为套购满返满减
            previewFooters: {},
            previewContent: {},
            // 满免  满赠
            tableColumnsOne: [
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 150 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 150 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 150 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '规格属性', dataIndex: 'skuProperty', align: 'center', width: 150 },
                { title: '达标单价（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 150 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            detailDataOne: [],
            // 满减 满返
            tableColumnsTow: [
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 150 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 150 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '规格属性', dataIndex: 'skuProperty', align: 'center', width: 150 },
                { title: '达标金额（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 150 },
                { title: '上限金额（元）', dataIndex: 'maxAmount', align: 'center', width: 150 },
                { title: '返/减金额（元）', dataIndex: 'rateAmount', align: 'center', width: 150 },
                { title: '分摊比率（%）',
                    dataIndex: 'rateProvider',
                    align: 'center',
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}`,
                    width: 150 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            detailDataTow: [],
            // 套购  满减 满返表头
            tableColumnsThree: [
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 150 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 150 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '规格属性', dataIndex: 'skuProperty', align: 'center', width: 150 },
                { title: '达标单价（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 150 },
                { title: '分摊比率（%）',
                    dataIndex: 'rateProvider',
                    align: 'center',
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}`,
                    width: 150 },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } }
            ],
            // 赠品规则表格
            tableColumnsGift: [
                { title: '达标金额（元）', dataIndex: 'reachAmount', align: 'center', width: 150 },
                { title: '赠品/券编码', dataIndex: 'skuCode', align: 'center', width: 150 },
                { title: '赠品/券名称', dataIndex: 'skuName', align: 'center', width: 300 },
                { title: '类型', dataIndex: 'giftTypeName', align: 'center', width: 150 },
                { title: '赠品单价（元）', dataIndex: 'skuPrice', align: 'center', width: 150 },
                { title: '赠品数量', dataIndex: 'skuNum', align: 'center', width: 150 },
                { title: '赠品上限（元）', dataIndex: 'maxAmount', align: 'center', width: 150 },
                { title: '分担金额（元）', dataIndex: 'rateAmount', align: 'center', width: 150 },
                { title: '是否有效',
                    dataIndex: 'isEffect',
                    align: 'center',
                    width: 150,
                    customRender: (text, record) => text === '1' ? '是' : '否' },
                { title: '备注说明', dataIndex: 'note', align: 'center' }
            ],
            detailDataGift: [],
            // 满免规则
            tableColumnsFree: [
                { title: '达标金额（元）', width: 150, dataIndex: 'standard', align: 'center' },
                { title: '满免方式', dataIndex: 'typeName', width: 150, align: 'center' },
                { title: '分摊比率（%）',
                    dataIndex: 'rate',
                    align: 'center',
                    width: 150,
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            detailDataFree: []
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
                    const obj = { ...res.data }
                    this.setTableData(obj)
                }
            })
        },
        /**
         * @name: 基础信息和落款信息
         * @msg:
         * @param {type}
         * @return:
         */
        setRowData () {
            axios({
                path: 'ScheduRuleQueryScheduleRule',
                method: 'post',
                body: {
                    code: this.orderId
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
                    const newArr = this.previewHeaders.filter(o => !o.isUnique)
                    if (detailData.scheduleType === 'schedule_rule_define_schedule_type:1' || detailData.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        this.isGift = false
                        this.isFreeGift = false
                        this.isArbitrageType = false
                        this.isFree = false
                        newArr.splice(3, 0, { key: 'isChange', name: '金额是否可修改', isUnique: 'out' })
                    } else if (detailData.scheduleType === 'schedule_rule_define_schedule_type:3' || detailData.scheduleType === 'schedule_rule_define_schedule_type:6') {
                        this.isGift = true
                        this.isFreeGift = true
                        this.isArbitrageType = false
                        this.isFree = false
                        newArr.push({ key: 'isShow', name: '是否显性', isUnique: 'out' })
                    } else if (detailData.scheduleType === 'schedule_rule_define_schedule_type:4' || detailData.scheduleType === 'schedule_rule_define_schedule_type:5') {
                        this.isGift = false
                        this.isArbitrageType = true
                        this.isFree = false
                    } else if (detailData.scheduleType === 'schedule_rule_define_schedule_type:7') {
                        this.isGift = false
                        this.isFreeGift = true
                        this.isArbitrageType = false
                        this.isFree = true
                    }
                    this.previewHeaders = newArr

                    this.previewContent.headers = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        store: store.join(','),
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        reachAmount: detailData.reachAmount,
                        isShow: detailData.isShow === '0' ? '否' : '是',
                        scheduleName: detailData.defineName,
                        scheduleType: detailData.scheduleValue,
                        isChange: detailData.isChange === '0' ? '否' : '是',
                        maxAmount: detailData.maxAmount,
                        rateAmount: detailData.rateAmount
                    }
                    this.previewFooters = {
                        make: `${detailData.createBy} - ${detailData.createName}`,
                        makeTime: detailData.createTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditByName}` : '',
                        auditTime: detailData.auditTime,
                        note: detailData.note
                    }
                }
            })
        },
        /**
         * @name: 表格详情
         * @msg:
         * @param {type}
         * @return:
         */
        setTableData (tableObj) {
            const detailData = tableObj.defineDetails ? [...tableObj.defineDetails] : []
            const giftData = tableObj.ruleGifts ? [...tableObj.ruleGifts] : []
            const freeData = tableObj.exemptionList ? [...tableObj.exemptionList] : []
            if (this.isFreeGift) {
                this.detailDataOne = detailData
                this.detailDataTow = []
            } else {
                this.detailDataOne = []
                this.detailDataTow = detailData
            }
            this.detailDataGift = giftData
            this.detailDataFree = freeData
            this.previewVisbel = true
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.setRowData()
            }
        },
        previewVisbel (val) {
            this.$emit('input', false)
        }

    }
}
</script>

<!--
 * @Description: 礼品规则单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-01 15:34:30
 * @LastEditors: lin
 * @LastEditTime: 2019-08-19 17:48:21
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="礼品规则单"
      :tags="previewTags"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="礼品信息" :isTable="true" :columns="previewColumns" :data="previewTableData"></div>
      <div slot="B" title="不参与分摊的供应商" :isTable="true" :columns="previewColumnsTow" :data="previewTableDataTow"></div>
      <div slot="footer">
        <a-row>
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewFooters.make }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewFooters.makeTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewFooters.makeStore }}</a-col>
          <a-col :md="4" :lg="3" :xl="3" v-if="previewFooters.auditTime">审核人：</a-col>
          <a-col :md="8" :lg="5" :xl="5" v-if="previewFooters.auditTime"> {{ previewFooters.audit }}</a-col>
          <a-col :md="4" :lg="3" :xl="3" v-if="previewFooters.auditTime">审核时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5" v-if="previewFooters.auditTime"> {{ previewFooters.auditTime }}</a-col>
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
            previewFooters: {},
            previewContent: {},

            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'name', name: '规则名称' },
                { key: 'store', name: '生效机构' },
                { key: 'startTime', name: '开始时间' },
                { key: 'endTime', name: '结束时间' },
                { key: 'note', name: '备注' }
            ],
            previewColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价（元）', dataIndex: 'skuPrice', align: 'center', width: 120 },
                { title: '分摊金额（元）', dataIndex: 'rateAmount', align: 'center', width: 120 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            previewTableData: [],
            previewColumnsTow: [
                { title: '供应商编码', dataIndex: 'providerCode', align: 'center', width: 100 },
                { title: '供应商名称', dataIndex: 'providerName', align: 'center' }
            ],
            previewTableDataTow: []

        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'ScheduleGiftQueryDetail',
                method: 'post',
                body: {
                    id: id,
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.previewTableData = [...res.data.detailVoList]
                    this.previewTableDataTow = [...res.data.list]
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'ScheduleGiftQueryDefine',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'schedule_limit_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'schedule_limit_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'schedule_limit_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'schedule_limit_define_status:4') {
                        this.previewTags = ['stoped']
                    }
                    const store = []
                    if (detailData.effectStore) {
                        const arr1 = detailData.effectStore.split(',')
                        const arr2 = detailData.effectStoreName.split(',')
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
                        store: store.join('，'),
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        
                        note: detailData.note
                    }
                    this.previewFooters = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        make: detailData.createBy ? `${detailData.createBy} - ${detailData.createName}` : '',
                        makeTime: detailData.createTime,
                        audit: `${detailData.auditBy} - ${detailData.auditName}`,
                        auditTime: detailData.auditTime
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

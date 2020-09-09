<!--
 * @Description:
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-26 17:33:28
 * @LastEditors: lin
 * @LastEditTime: 2019-08-06 09:58:07
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="电子币分摊规则"
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
                { key: 'scheduleCoinTypeDefineCode', name: '电子币类型' },
                { key: 'name', name: '规则名称' },
                { key: 'store', name: '生效机构' },
                { key: 'effectType', name: '有效期类型' },
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
                    customRender: (text) => `${Number(text * 100).toFixed(2)}` },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            previewTableData: [],

            previewForm: {}

        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'CoinShareQueryDetail',
                method: 'post',
                body: {
                    id: id,
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.previewTableData = [...res.data]
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'CoinShareQueryShareList',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'schedule_coin_share_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'schedule_coin_share_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'schedule_coin_share_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'schedule_coin_share_define_status:4') {
                        this.previewTags = ['noeffective']
                    }
                    const store = []
                    if (detailData.storeCode) {
                        const arr1 = detailData.storeCode.split(',')
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
                        scheduleCoinTypeDefineCode: detailData.defineName,
                        name: detailData.name,
                        store: store.join(','),
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        effectType: detailData.effectTypeName,
                        note: detailData.note
                    }
                    this.previewForm = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        make: detailData.createBy ? `${detailData.createBy} - ${detailData.createName}` : '',
                        makeTime: detailData.createTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditName}` : '',
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

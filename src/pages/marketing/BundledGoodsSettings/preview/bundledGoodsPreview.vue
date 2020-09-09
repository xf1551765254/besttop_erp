<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lmt
 * @LastEditTime: 2019-07-24 19:07:11
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="捆绑商品设置"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div slot="A" title="捆绑商品详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
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
            previewDetailData: {},
            epreviewTableData: [],
            tags: [],
            // 基础信息
            previewHeaders: [
                { key: 'apply', name: '申请人' },
                { key: 'makeStore', name: '制单位置' },
                { key: 'store', name: '生效分店' },
                { key: 'startTime', name: '开始日期' },
                { key: 'endTime', name: '结束日期' },
                { key: 'bindQuantity', name: '捆绑限制' },
                { key: 'mainSku', name: '主销售商品' },
                { key: 'price', name: '主商品零售价' },
                { key: 'mainSkuModel', name: '主销售商品规格' },
                { key: 'mainSkuPrice', name: '捆绑后售价' }
            ],
            previewColumns: [
                { title: '捆绑商品编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '捆绑商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '捆绑商品规格', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '零售价（元）', dataIndex: 'price', width: 150, align: 'center' },
                { title: '捆绑设定价（元）', dataIndex: 'priceDisc', width: 150, align: 'center' },
                { title: '捆绑数量', dataIndex: 'quantity', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            billsData: []
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'GroupDefineQueryDetail',
                method: 'post',
                body: {
                    groupDefineId: id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.list
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'GroupDefineQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    this.previewDetailData = { ...detailData }
                    if (detailData.status === 'group_goods_define_status:1') {
                        this.tags = ['uncheck']
                    } else if (detailData.status === 'group_goods_define_status:2') {
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
                        apply: detailData.applyBy ? `${detailData.applyBy} - ${detailData.applyName}` : '',
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        store: store.join(','),
                        startTime: detailData.startTime,
                        endTime: detailData.endTime,
                        bindQuantity: detailData.bindName,
                        mainSku: detailData.mainSkuCode ? `${detailData.mainSkuCode} - ${detailData.mainSkuName}` : '',
                        price: detailData.price,
                        mainSkuModel: detailData.mainSkuModel,
                        mainSkuPrice: detailData.mainSkuPrice
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

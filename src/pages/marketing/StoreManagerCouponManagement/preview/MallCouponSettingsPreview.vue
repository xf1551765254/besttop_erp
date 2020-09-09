<!--
 * @Description: 商场券预览
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-27 16:18:19
 * @LastEditors: lin
 * @LastEditTime: 2019-07-27 16:37:18
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="商场券配置"
      :tags="previewTags"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="B" title="商品详情" :isTable="true" :columns="previewColumns" :data="previewTableData"></div>
      <div slot="footer">
        <a-row>
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewForm.create }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ previewForm.createTime }}</a-col>
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
                { key: 'store', name: '生效机构' },
                { key: 'effectTime', name: '生效日期' },
                { key: 'note', name: '备注' }
            ],
            previewColumns: [
                { title: '机构代码', dataIndex: 'storeCode', width: 100, align: 'center' },
                { title: '机构名称', dataIndex: 'storeName', width: 180, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '使用比例（%）',
                    dataIndex: 'couponRate',
                    align: 'center',
                    width: 120,
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            previewTableData: [],

            previewForm: {}

        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'CouponQueryCouponDefineDetail',
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
                path: 'CouponQueryList',
                method: 'post',
                body: {
                    code: this.orderId,
                    type: 'coupon_define_type:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'coupon_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'coupon_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'coupon_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'coupon_define_status:4') {
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
                        store: store.join(','),
                        effectTime: detailData.effectTime,
                        note: detailData.note
                    }
                    this.previewForm = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        create: detailData.createBy ? `${detailData.createBy} - ${detailData.createName}` : '',
                        createTime: detailData.createTime,
                        audit: detailData.auditBy ? `${detailData.auditBy} - ${detailData.auditByName}` : '',
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

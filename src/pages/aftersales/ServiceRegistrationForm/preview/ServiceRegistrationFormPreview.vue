<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: lin
 * @LastEditTime: 2019-07-26 15:04:42
 -->
<template>
  <preview
    v-model="previewVisbel"
    :title="`服务登记单：${tabsActiveKeyPre}`"
    :tags="previewTags"
    :orderId="orderId"
    :headers="tabsActiveKeyPre==='系统售后服务登记'?previewHeaders:[]"
    :content="previewContent">
    <div slot="B" title="顾客信息">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">顾客姓名</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.customerName||'' }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">顾客手机号</a-col>
        <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.customerTelephone||'' }}</a-col>
      </a-row>
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">顾客地址</a-col>
        <a-col :sm="16" :md="20" :xl="21" class="aColHeightNo">
          <a-tooltip placement="topLeft" autoAdjustOverflow>
            <template slot="title">
              <span> {{ previewDetailData.customerAddress }}</span>
            </template>
            {{ previewDetailData.customerAddress }}
          </a-tooltip>
        </a-col>
      </a-row>
    </div>
    <div slot="D" title="商品信息" v-if="tabsActiveKeyPre==='系统售后服务登记'">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">品类</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.class }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">品牌</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.brand }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">SKU编码</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.skuCode }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">SKU名称</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.skuName }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">规格型号</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.skuModel }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">数量</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.skuQuantity }}</a-col>
      </a-row>
    </div>
    <div slot="E" title="问题记录" v-if="tabsActiveKeyPre==='第三方售后服务登记'">
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">单据类型</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.typeName }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">预约时间</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.orderInstallTime }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">问题标题</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.troubleTitle }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">品类</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.class }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">品牌</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.brand }}</a-col>
        <a-col :sm="8" :md="4" :xl="3">商品名称</a-col>
        <a-col :sm="16" :md="8" :xl="5">{{ previewDetailData.skuName }}</a-col>
      </a-row>
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">问题描述</a-col>
        <a-col :sm="16" :md="8" :xl="5" style="height:auto">{{ previewDetailData.troubleApplyNote }}</a-col>
      </a-row>
    </div>
    <div slot="footer">
      <a-row>
        <a-col :sm="8" :md="4" :xl="2">制单人</a-col>
        <a-col :sm="16" :md="8" :xl="4">{{ previewDetailData.create || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="2">制单时间</a-col>
        <a-col :sm="16" :md="8" :xl="4">{{ previewDetailData.createTime || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="2" v-if="previewDetailData.audit">审核人</a-col>
        <a-col :sm="16" :md="8" :xl="4" v-if="previewDetailData.audit">{{ previewDetailData.audit || '' }}</a-col>
        <a-col :sm="8" :md="4" :xl="2" v-if="previewDetailData.audit">审核时间</a-col>
        <a-col :sm="16" :md="8" :xl="4" v-if="previewDetailData.audit">{{ previewDetailData.auditTime || '' }}</a-col>
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
        },
        tabsActiveKeyPre: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            previewVisbel: false,
            previewDetailData: {},
            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'typeName', name: '单据类型' },
                { key: 'sourceCode', name: '源单据号' },
                { key: 'saleStore', name: '销售位置' },
                { key: 'orderInstallTime', name: '预约时间' },
                { key: 'troubleTitle', name: '问题标题' },
                { key: 'troubleApplyNote', name: '问题描述' }

            ],
            previewContent: {},
            problemImage: []
        }
    },
    methods: {
        detailsSumbit () {
            axios({
                path: 'TroubleApplyQueryList',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.previewContent.headers = {
                        typeName: detailData.typeName,
                        sourceCode: detailData.sourceCode,
                        saleStore: detailData.saleStoreCode ? `${detailData.saleStoreCode}-${detailData.saleStoreCodeName}` : '',
                        sourceName: detailData.sourceName,
                        orderInstallTime: detailData.orderInstallTime,
                        troubleTitle: detailData.troubleTitle,
                        troubleApplyNote: detailData.troubleApplyNote
                    }
                    this.previewDetailData = {
                        code: detailData.code,
                        customerAddress: detailData.customerAddress,
                        customerName: detailData.customerName,
                        customerTelephone: detailData.customerTelephone,
                        troubleTitle: detailData.troubleTitle,
                        troubleDescribe: detailData.troubleApplyNote,
                        troubleApplyNote: detailData.troubleApplyNote,
                        class: detailData.classCode ? `${detailData.classCode}-${detailData.className}` : '',
                        brand: detailData.brandCode ? `${detailData.brandCode}-${detailData.brandName}` : '',
                        skuCode: detailData.skuCode,
                        skuModel: detailData.skuModel,
                        skuName: detailData.skuName,
                        skuQuantity: detailData.skuQuantity,
                        typeName: detailData.typeName,
                        orderInstallTime: detailData.orderInstallTime,
                        audit: detailData.auditBy ? `${detailData.auditBy}-${detailData.auditByName}` : '',
                        auditTime: detailData.auditTime,
                        create: detailData.createBy ? `${detailData.createBy}-${detailData.createByName}` : '',
                        createTime: detailData.createTime
                    }
                    if (detailData.status === 'trouble_apply_status:2') {
                        this.previewTags = ['uncheck']
                    } else {
                        this.previewTags = ['check']
                    }
                    if (detailData.troublePicture) {
                        this.problemImage = detailData.troublePicture.split(',')
                    } else {
                        this.problemImage = []
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

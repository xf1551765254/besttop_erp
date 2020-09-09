<!--
 * @Description: 延保服务规则单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-02 14:01:29
 * @LastEditors: lin
 * @LastEditTime: 2019-08-19 17:27:51
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="延保服务规则单"
      :tags="previewTags"
      :orderId="orderId"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="延保商品详情" :isTable="true" :columns="previewColumns" :data="previewTableData"></div>
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
            previewTableData: [],
            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'skuType', name: '商品类型' },
                { key: 'name', name: '规则名称' },
                { key: 'store', name: '生效机构' },
                { key: 'effectClass', name: '品类' },
                { key: 'note', name: '备注' }
            ],
            previewColumns: [
                { title: '起始价格（元）', dataIndex: 'minAmount', align: 'center', width: 150 },
                { title: '截止价格（元）', dataIndex: 'maxAmount', align: 'center', width: 150 },
                { title: '延保类型', dataIndex: 'acppTypeName', align: 'center', width: 150 },
                { title: '延保金（元）', dataIndex: 'acppAmount', align: 'center', width: 150 },
                { title: '编码', dataIndex: 'thirdPartyCode', align: 'center', width: 120 },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ]
        }
    },
    methods: {
        findDetail (id) {
            axios({
                path: 'AcppRuleDefineFindOne',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.previewTableData = [...res.data.detailBOList]
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            axios({
                path: 'AcppRuleDefineFindRuleDefinePageList',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data.list[0]
                    this.findDetail(detailData.id)
                    if (detailData.status === 'acpp_rule_define_status:1') {
                        this.previewTags = ['uncheck']
                    } else if (detailData.status === 'acpp_rule_define_status:2') {
                        this.previewTags = ['check']
                    } else if (detailData.status === 'acpp_rule_define_status:3') {
                        this.previewTags = ['effective']
                    } else if (detailData.status === 'acpp_rule_define_status:4') {
                        this.previewTags = ['stoped']
                    }
                    this.previewContent.headers = {
                        skuType: detailData.skuTypeName,
                        name: detailData.name,
                        store: detailData.effectStoreName,
                        effectClass: detailData.effectClassName,
                        note: detailData.note
                    }
                    this.previewFooters = {
                        makeStore: detailData.makeStoreCode ? `${detailData.makeStoreCode} - ${detailData.makeStoreName}` : '',
                        make: detailData.createBy ? `${detailData.createBy} - ${detailData.createByName}` : '',
                        makeTime: detailData.createTime,
                        audit: `${detailData.auditBy} - ${detailData.auditByName}`,
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

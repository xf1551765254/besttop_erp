<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-21 14:39:50
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="分销渠道政策配置"
    :tags="tags"
    :orderId="orderId"
    :headers="previewHeaders"
    :content="previewContent">
    <div
      v-if="slotA"
      slot="A"
      title="特价机"
      :isTable="true"
      :columns="categoryinfoColumnsA"
      :data="categoryinfoDataA"></div>
    <div
      v-if="slotB"
      slot="B"
      title="追加政策"
      :isTable="true"
      :columns="categoryinfoColumnsB"
      :data="categoryinfoDataB"></div>
    <div
      v-if="slotC"
      slot="C"
      title="提货规模"
      :isTable="true"
      :columns="categoryinfoColumnsC"
      :data="categoryinfoDataC"></div>
    <div
      v-if="slotD"
      slot="D"
      title="常规机政策价"
      :isTable="true"
      :columns="categoryinfoColumnsD"
      :data="categoryinfoDataD"></div>
    <div
      v-if="slotE"
      slot="E"
      title="销售奖励机型"
      :isTable="true"
      :columns="categoryinfoColumnsE"
      :data="categoryinfoDataE"></div>
    <div
      v-if="slotF"
      slot="F"
      title="样机政策"
      :isTable="true"
      :columns="categoryinfoColumnsF"
      :data="categoryinfoDataF"></div>
    <div
      v-if="slotG"
      slot="G"
      title="高端出样"
      :isTable="true"
      :columns="categoryinfoColumnsG"
      :data="categoryinfoDataG"></div>
    <div
      v-if="slotH"
      slot="H"
      title="提货台阶"
      :isTable="true"
      :columns="categoryinfoColumnsH"
      :data="categoryinfoDataH"></div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `制单人:${previewFooters.createBy || ''}` }}</pre>
          <pre>{{ `制单时间：${previewFooters.createTime || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `审核人：${previewFooters.approveBy || ''}` }}</pre>
          <pre>{{ `审核时间：${previewFooters.approveTime || ''}` }}</pre>
        </a-col>
      </a-row>
    </div>
  </preview>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
const plainOptions = ['特价机', '追加政策', '提货规模', '常规机政策价', '销售奖励机型', '样机政策', '高端出样', '提货台阶']
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
            // 基础信息
            previewHeaders: [
                { key: 'name', name: '单据名称' },
                { key: 'classCode', name: '商品品类' },
                { key: 'BrandObjArr', name: '商品品牌' },
                { key: 'beginTime', name: '开始时间' },
                { key: 'endTime', name: '结束时间' },
                { key: 'tempObjArr', name: '生效机构' },
                { key: 'note', name: '备注' }
            ],
            slotA: false,
            slotB: false,
            slotC: false,
            slotD: false,
            slotE: false,
            slotF: false,
            slotG: false,
            slotH: false,
            categoryinfoDataA: [],
            categoryinfoDataB: [],
            categoryinfoDataC: [],
            categoryinfoDataD: [],
            categoryinfoDataE: [],
            categoryinfoDataF: [],
            categoryinfoDataG: [],
            categoryinfoDataH: [],
            categoryinfoColumnsA: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '特价', dataIndex: 'strategyPrice', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsB: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '开始时间', dataIndex: 'startTime', width: 200 },
                { title: '结束时间', dataIndex: 'finishTime', width: 200 },
                { title: '限时抢购价', dataIndex: 'strategyPrice', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsC: [
                { title: '提货额起', dataIndex: 'scopeMin', width: 150 },
                { title: '提货额止', dataIndex: 'scopeMax', width: 150 },
                { title: '特价机比例%', dataIndex: 'spriceRate', width: 100 },
                { title: '形式1：提货奖励', dataIndex: 'rewards', width: 100 },
                { title: '形式3：规模台阶返点', dataIndex: 'stepsReturn', width: 100 },
                { title: '形式4:现汇奖励', dataIndex: 'shapeCash', width: 100 },
                { title: '形式5率', dataIndex: 'shapeA', width: 100 },
                { title: '形式6率', dataIndex: 'shapeB', width: 100 },
                { title: '形式7额', dataIndex: 'shapeC', width: 100 },
                { title: '形式8额', dataIndex: 'shapeD', width: 100 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsD: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '政策价', dataIndex: 'strategyPrice', width: 150 },
                { title: '起提数量', dataIndex: 'strategyNum', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsE: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '销售奖励', dataIndex: 'strategyPrice', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsF: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '样机价', dataIndex: 'strategyPrice', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsG: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '政策价', dataIndex: 'strategyPrice', width: 150 },
                { title: '备注', dataIndex: 'note' }
            ],
            categoryinfoColumnsH: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '规格型号', dataIndex: 'skuModel', width: 250 },
                { title: '分销价', dataIndex: 'priceA', width: 150 },
                { title: '台阶1',
                    width: 200,
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumA', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceA', width: 100
                        }
                    ]
                },
                { title: '台阶2',
                    width: 200,
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumB', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceB', width: 100
                        }
                    ] },
                { title: '台阶3',
                    width: 200,
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumC', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceC', width: 100
                        }
                    ] },
                { title: '台阶4',
                    width: 200,
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumD', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceD', width: 100
                        }
                    ]
                },
                { title: '备注', dataIndex: 'note' }
            ]
        }
    },
    methods: {
        findDetail () {
            axios({
                path: 'ChannelDefineQueryByCode',
                method: 'post',
                body: {
                    code: this.orderId
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const itemData = res.data
                    this.checkedList = []
                    if (itemData.particPrice.length !== 0) {
                        this.slotA = true
                        this.categoryinfoDataA = itemData.particPrice
                    }
                    if (itemData.appendPrice.length !== 0) {
                        this.slotB = true
                        this.categoryinfoDataB = itemData.appendPrice
                    }
                    if (itemData.deliveryScale.length !== 0) {
                        this.slotC = true
                        this.categoryinfoDataC = itemData.deliveryScale
                    }
                    if (itemData.routinePrice.length !== 0) {
                        this.slotD = true
                        this.categoryinfoDataD = itemData.routinePrice
                    }
                    if (itemData.salesAward.length !== 0) {
                        this.slotE = true
                        this.categoryinfoDataE = itemData.salesAward
                    }
                    if (itemData.halfOffSample.length !== 0) {
                        this.slotF = true
                        this.categoryinfoDataF = itemData.halfOffSample
                    }
                    if (itemData.highSample.length !== 0) {
                        this.slotG = true
                        this.categoryinfoDataG = itemData.highSample
                    }
                    if (itemData.extractSteps.length !== 0) {
                        this.slotH = true
                        this.checkedList.push(plainOptions[7])
                        itemData.extractSteps.forEach(i => {
                            const arr = i.stepsDetaile
                            for (const item of arr) {
                                if (item.strategySteps === 'strategyStepsA') {
                                    i.strategyNumA = item.strategyNum
                                    i.strategyPriceA = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsB') {
                                    i.strategyNumB = item.strategyNum
                                    i.strategyPriceB = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsC') {
                                    i.strategyNumC = item.strategyNum
                                    i.strategyPriceC = item.strategyPrice
                                }
                                if (item.strategySteps === 'strategyStepsD') {
                                    i.strategyNumD = item.strategyNum
                                    i.strategyPriceD = item.strategyPrice
                                }
                            }
                        })
                        this.categoryinfoDataH = itemData.extractSteps
                    }
                }
                this.previewVisbel = true
            })
        },
        detailsSumbit () {
            this.categoryinfoDataA.length = 0
            this.categoryinfoDataB.length = 0
            this.categoryinfoDataC.length = 0
            this.categoryinfoDataD.length = 0
            this.categoryinfoDataE.length = 0
            this.categoryinfoDataF.length = 0
            this.categoryinfoDataG.length = 0
            this.categoryinfoDataH.length = 0
            this.slotA = false
            this.slotB = false
            this.slotC = false
            this.slotD = false
            this.slotE = false
            this.slotF = false
            this.slotG = false
            this.slotH = false
            axios({
                path: 'ChannelDefineQuery',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    if (e.status === 'wholesale_strategy_define_status:1') {
                        this.tags = ['uncheck']
                    } else if (e.status === 'wholesale_strategy_define_status:3') {
                        this.tags = ['effective']
                    } else if (e.status === 'wholesale_strategy_define_status:4') {
                        this.tags = ['noeffective']
                    } else {
                        this.tags = ['check']
                    }
                    this.previewContent.headers = {
                        name: e.name,
                        classCode: e.classCode ? `${e.classCode}-${e.className}` : '',
                        BrandObjArr: e.brandCode ? `${e.brandCode}-${e.brandName}` : '',
                        beginTime: e.beginTime,
                        endTime: e.endTime,
                        tempObjArr: e.effectStoreName,
                        note: e.note
                    }
                    this.previewFooters = {
                        createBy: e.createBy ? `${e.createBy}-${e.createName}` : '',
                        createTime: e.createTime,
                        approveTime: e.approveTime,
                        approveBy: e.approveBy ? `${e.approveBy}-${e.approveName}` : ''
                    }
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
                this.findDetail()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

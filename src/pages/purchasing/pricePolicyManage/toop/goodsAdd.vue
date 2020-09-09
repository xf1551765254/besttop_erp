<!--
 * @Description:
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-16 13:47:29
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择SKU商品"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-col :span="24">
                <a-input addonBefore="编码/名称" placeholder="请输入搜索值" @change="seach" />
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="tbWebId"
                  :scroll="scrollXy"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.tbWebId)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.name||'未选择'}]-详情` }}</div>
              </template>
              <a-row v-for="(item, index) in details" :key="index">
                <span class="title">{{ `${item.name}：` }}</span>
                <span>{{ cacheObj[item.key] }}</span>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple" :disabled="isNotMulSelect">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    .ant-modal-wrap{
        z-index: 4000;
    }
    .card-box{
        max-height:540px;
        overflow:auto;
        .title{
            font-weight: bold;
        }
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
</style>

<script>
import { axios } from '@/utils/request'
import is from 'is_js'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        },
        goodsFlag: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [],
            dataSource: [],
            cacheObj: {},
            details: [],
            // 特价机表头及详情
            SpecialOfferColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '特价', dataIndex: 'strategyPrice', width: 100, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            SpecialOfferDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '特价', key: 'strategyPrice' }
            ],
            // 额外追加政策
            policyColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '限时抢购价', dataIndex: 'strategyPrice', width: 100, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            policyDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '限时抢购价', key: 'strategyPrice' }
            ],
            // 提货规模
            scaleColumns: [
                { title: '提货额起', dataIndex: 'scopeMin', width: 100 },
                { title: '提货额止', dataIndex: 'scopeMax', width: 100 },
                { title: '特价机比例%', dataIndex: 'spriceRate', width: 200 },
                { title: '形式1：提货奖励', dataIndex: 'rewards', width: 200 },
                { title: '形式3：规模台阶返点', dataIndex: 'stepsReturn' },
                { title: '形式5率', dataIndex: 'shapeA', width: 100 },
                { title: '形式6率', dataIndex: 'shapeB', width: 100 },
                { title: '形式7额', dataIndex: 'shapeC', width: 100 },
                { title: '形式8额', dataIndex: 'shapeD', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            scaleDetails: [
                { name: '提货额起', key: 'scopeMin' },
                { name: '提货额止', key: 'scopeMax' },
                { name: '特价机比例%', key: 'spriceRate' },
                { name: '形式1：提货奖励', key: 'rewards' },
                { name: '形式3：规模台阶返点', key: 'stepsReturn' },
                { name: '形式5率', key: 'shapeA' },
                { name: '形式6率', key: 'shapeB' },
                { name: '形式7额', key: 'shapeC' },
                { name: '形式8额', key: 'shapeD' }
            ],
            // 常规政策价
            RegularPolicyColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 150 },
                { title: '政策价', dataIndex: 'strategyPrice', width: 150 },
                { title: '起提数量', dataIndex: 'strategyNum', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            RegularPolicyDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '政策价', key: 'strategyPrice' },
                { name: '起提数量', key: 'strategyNum' }
            ],
            // 销售奖励机型
            SalesIncentiveColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '销售奖励', dataIndex: 'strategyPrice', width: 100, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            SalesIncentiveDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '销售奖励', key: 'strategyPrice' }
            ],
            // 五折出样政策
            HalfOffColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 150 },
                { title: '五折样机价', dataIndex: 'priceA', width: 150, scopedSlots: { customRender: 'priceA' } },
                { title: '政策价', dataIndex: 'strategyPrice', width: 150, scopedSlots: { customRender: 'strategyPrice' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            HalfOffDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '五折样机价', key: 'strategyPrice' },
                { name: '政策价', key: 'strategyPrice' }
            ],
            // 高端出样
            HighEndOutSampleColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 150 },
                { title: '会议价', dataIndex: 'strategyPrice', width: 150, scopedSlots: { customRender: 'strategyPrice' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            HighEndOutSampleDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '会议价', key: 'strategyPrice' }
            ],
            // 提货台阶
            PickUpTheGoodsColumns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 150 },
                { title: '商品名称', dataIndex: 'skuName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 150 },
                { title: '批发价', dataIndex: 'strategyPrice', width: 150, scopedSlots: { customRender: 'strategyPrice2' } },
                { title: '台阶1',
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumA', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceA', width: 100
                        }
                    ] },
                { title: '台阶2',
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumB', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceB', width: 100
                        }
                    ] },
                { title: '台阶3',
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumC', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceC', width: 100
                        }
                    ] },
                { title: '台阶4',
                    children: [
                        {
                            title: '提货数', dataIndex: 'strategyNumD', width: 100
                        },
                        {
                            title: '政策价', dataIndex: 'strategyPriceD', width: 100
                        }
                    ] },
                { title: '备注', dataIndex: 'note', width: 150, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            PickUpTheGoodsDetails: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '批发价', key: 'strategyPrice' },
                { name: '提货数', key: 'strategyNumA' },
                { name: '政策价', key: 'strategyPriceA' },
                { name: '提货数', key: 'strategyNumB' },
                { name: '政策价', key: 'strategyPriceB' },
                { name: '提货数', key: 'strategyNumC' },
                { name: '政策价', key: 'strategyPriceC' },
                { name: '提货数', key: 'strategyNumD' },
                { name: '政策价', key: 'strategyPriceD' }
            ],
            isNotSelect: false

        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        /**
         * @name: 手动设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        setTableData (data) {
            this.dataSource = data
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    code: e.target.value
                })
            }, 300)
        },
        /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */
        customRow (record, index) {
            return {
                props: {

                },
                on: {
                    click: () => {
                        this.cacheObj = record
                        if (is.empty(this.cacheObj)) {
                            this.isLoading = true
                        } else {
                            this.isLoading = false
                        }
                    },
                    mouseenter: (e) => {
                        // console.log(e);
                        // console.log(index);
                        // console.log(record);
                        // this.cacheObj = record;
                    }
                }
            }
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.tbWebId, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                this.$emit('onSelect', selectDatas)
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (key) {
            const selectDatas = this.dataSource.filter(o => o.tbWebId === key)
            if (selectDatas.length > 0) {
                this.$emit('onSelect', [selectDatas[0]])
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}) {
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            console.log('接口', newPams)
            axios({
                path: 'GoodsInformationFindGoodsByCode',
                method: 'POST',
                body: {
                    classCode: newPams.classCode,
                    brandCode: newPams.brandCode,
                    // classCode: '5511',
                    // brandCode: '1070',
                    page: 1,
                    rows: 9999
                }
            }).then(res => {
                this.spinning = false
                console.log('详细信息', res.data)
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        i.tbWebId = i.code
                        i.skuCode = i.code
                        i.skuName = i.name
                        i.skuModel = i.model
                        // i.strategyPrice = i.strategyPrice,
                        // i.scopeMin = i.scopeMin,
                        // i.scopeMax = i.scopeMax,
                        // i.spriceRate = i.spriceRate,
                        // i.rewards = i.rewards,
                        // i.stepsReturn = i.stepsReturn,
                        // i.shapeA = i.shapeA,
                        // i.shapeB = i.shapeB,
                        // i.shapeC = i.shapeC,
                        // i.shapeD = i.shapeD,
                        // i.strategyNum = i.strategyNum,
                        // i.strategyNumA = i.strategyNumA,
                        // i.strategyNumB = i.strategyNumB,
                        // i.strategyNumC = i.strategyNumC,
                        // i.strategyNumD = i.strategyNumD,
                        // i.strategyPriceA = i.strategyPriceA,
                        // i.strategyPriceB = i.strategyPriceB,
                        // i.strategyPriceC = i.strategyPriceC,
                        // i.strategyPriceD = i.strategyPriceD
                    })
                    this.dataSource = arr
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        },
        goodsFlag: {
            handler (val, oldval) {
                console.log('表头', val)
                if (val === 'SpecialOffer') {
                    this.columns = this.SpecialOfferColumns
                    this.details = this.SpecialOfferDetails
                    this.scrollXy = { x: 450 }
                }
                if (val === 'policy') {
                    this.columns = this.policyColumns
                    this.details = this.policyDetails
                    this.scrollXy = { x: 450 }
                }
                if (val === 'scale') {
                    this.columns = this.scaleColumns
                    this.details = this.scaleDetails
                    this.scrollXy = { x: 1000 }
                }
                if (val === 'RegularPolicy') {
                    this.columns = this.RegularPolicyColumns
                    this.details = this.RegularPolicyDetails
                    this.scrollXy = { x: 800 }
                }
                if (val === 'SpecialOffer') {
                    this.columns = this.SalesIncentiveColumns
                    this.details = this.SalesIncentiveDetails
                    this.scrollXy = { x: 450 }
                }
                if (val === 'HalfOff') {
                    this.columns = this.HalfOffColumns
                    this.details = this.HalfOffDetails
                    this.scrollXy = { x: 450 }
                }
                if (val === 'HighEndOutSample') {
                    this.columns = this.HighEndOutSampleColumns
                    this.details = this.HighEndOutSampleDetails
                    this.scrollXy = { x: 450 }
                }
                if (val === 'PickUpTheGoods') {
                    this.columns = this.PickUpTheGoodsColumns
                    this.details = this.PickUpTheGoodsDetails
                    this.scrollXy = { x: 450 }
                }
            },
            immediate: true
        }

    }
}
</script>

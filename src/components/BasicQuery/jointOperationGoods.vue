<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-31 11:17:41
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
        <a-row :gutter="20" class="doc">
          <a-col :span="14">
            <a-row>
              <!-- <a-col :span="24">
                <a-input addonBefore="编码/名称" placeholder="请输入搜索值" @change="seach" />
              </a-col> -->
              <a-col :span="4">供应商</a-col>
              <a-col :span="20">
                <a-form-item>
                  <a-select
                    style="width: 100%"
                    :filterOption="filterOption"
                    placeholder="请选择品类"
                    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                    :options="categoryArr"
                    @change="seachC"
                    showSearch
                    allowClear>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">合同</a-col>
              <a-col :span="20">
                <a-form-item>
                  <a-select
                    style="width: 100%"
                    :filterOption="filterOption"
                    placeholder="请选择品类"
                    :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                    :options="categoryArr"
                    @change="seachC"
                    showSearch
                    allowClear>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">编码/名称</a-col>
              <a-col :span="20">
                <a-form-item>
                  <a-input placeholder="请输入编码/名称" @change="seach" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="skuCode"
                  :scroll="{x:580}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.skuCode)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.skuName||'未选择'}]-详情` }}</div>
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
@import "../../assets/modalStyle.less";
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
        defaultSelect: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 50 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 50 },
                { title: '商品名称', dataIndex: 'goodsName', width: 50 },
                { title: 'SKU属性', dataIndex: 'skuProperty', width: 50 },
                { title: '商品类型', dataIndex: 'goodsTypeName', width: 80 },
                { title: '商品规格', dataIndex: 'goodsModel' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: 'SKU编码', key: 'skuCode' },
                { name: 'SKU名称', key: 'skuName' },
                { name: '商品编码', key: 'goodsCode' },
                { name: '商品名称', key: 'goodsName' },
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '商品类型', key: 'goodsTypeName' },
                { name: '规格型号', key: 'goodsModel' },
                { name: 'SKU零售价', key: 'skuPrice' },
                { name: 'SKU分销价', key: 'skuPriceW' },
                { name: 'SKU扣率', key: 'skuDrate' },
                // { name: 'SKU地市县扣率', key: 'skuDrateReg' },
                { name: 'SKU成本价', key: 'skuPtCost' },
                { name: '品类编码', key: 'skuClassCode' },
                { name: '品类名称', key: 'skuClassName' },
                { name: '单位', key: 'skuBasicUnit' },
                { name: '货号', key: 'goodNo' },
                { name: '包装含量', key: 'goodsContent' },
                { name: '产地', key: 'goodsProduce' },
                { name: '税率', key: 'goodsTaxRate' },
                { name: '商品状态', key: 'goodsStatus' },
                { name: 'SKU状态', key: 'skuStatusName' },
                { name: '重要性', key: 'goodsAbc' },
                { name: '引入日期', key: 'goodsIntroduceDate' },
                { name: '作废日期', key: 'goodsDisuseDate' },
                { name: '商品简称', key: 'goodsShortName' },
                { name: '商品属性', key: 'skuProperty' },
                { name: '管理标志', key: 'goodsFlagName' },
                { name: '在市状态', key: 'goodsTask' },
                { name: 'SKU备注', key: 'skuNote' },
                { name: '商品备注', key: 'goodsNote' }
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
                    condition: e.target.value
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.skuCode, this.selectedRowKeys))
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
        select (skuCode) {
            const selectDatas = this.dataSource.filter(o => o.skuCode === skuCode)
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
            this.dataSource.length = 0
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                condition: '',
                // include: {
                //     type: []
                // },
                // exclude: {
                //     type: ''
                // },
                page: 1,
                rows: 99
            }, newPams)
            axios({
                path: 'GoodsSkuFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    const data = []
                    if (res.data.list) {
                        res.data.list.forEach(s => {
                            data.push({
                                skuCode: s.code,
                                skuName: s.name,
                                goodsCode: s.goodsCode || s.code,
                                goodsName: s.goodsName || s.name,
                                goodsShortName: s.goodsShortName,
                                brandCode: s.brandCode,
                                brandName: s.brandName,
                                goodsType: s.goodsType,
                                goodsTypeName: s.goodsTypeName,
                                goodsModel: s.goodsModel,
                                skuPrice: s.price,
                                skuPriceW: s.priceW,
                                skuDrate: s.rate,
                                // skuDrateReg: s.rateReg,
                                skuId: s.id,
                                goodsId: s.goodsId,
                                skuPtCost: s.ptCost,
                                skuStatus: s.status,
                                skuClassCode: s.classCode,
                                skuClassName: s.className,
                                skuStatusName: s.statusName,
                                goodsContent: s.goodsContent,
                                skuBasicUnit: s.basicUnit,
                                goodNo: s.goodNo,
                                goodsProduce: s.goodsProduce,
                                goodsTaxRate: s.goodsTaxRate,
                                goodsStatus: s.goodsStatus,
                                goodsAbc: s.goodsAbc,
                                goodsIntroduceDate: s.goodsIntroduceDate,
                                goodsDisuseDate: s.goodsDisuseDate,
                                goodsFlag: s.goodsFlag,
                                goodsFlagName: s.goodsFlagName,
                                goodsTask: s.goodsTask,
                                skuNote: s.note,
                                skuProperty: s.property,
                                goodsNote: s.goodsNote
                            })
                        })
                    }
                    this.dataSource = data
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                if (this.$props.defaultSelect.length > 0) {
                    this.selectedRowKeys = [...this.$props.defaultSelect]
                } else {
                    this.selectedRowKeys.length = 0
                }
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

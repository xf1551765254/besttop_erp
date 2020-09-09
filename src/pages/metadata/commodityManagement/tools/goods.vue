<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-26 16:18:31
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择商品"
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
                  rowKey="goodsCode"
                  :scroll="{x:480}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.goodsCode)" size="small" :disabled="isNotSelect">选择</a-button>
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
                { title: '商品编码', dataIndex: 'goodsCode', width: 50 },
                { title: '商品名称', dataIndex: 'goodsName', width: 150 },
                { title: '商品类型', dataIndex: 'goodsType', width: 80 },
                { title: '商品规格', dataIndex: 'goodsModel', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '商品编码', key: 'goodsCode' },
                { name: '商品名称', key: 'goodsName' },
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '商品类型', key: 'goodsType' },
                { name: '规格型号', key: 'goodsModel' },
                { name: '品类编码', key: 'classCode' },
                { name: '品类名称', key: 'className' },
                { name: '单位', key: 'basicUnit' },
                { name: '货号', key: 'goodNo' },
                { name: '包装含量', key: 'goodsContent' },
                { name: '产地', key: 'goodsProduce' },
                { name: '税率', key: 'goodsTaxRate' },
                { name: '商品状态', key: 'goodsStatusName' },
                { name: '重要性', key: 'goodsAbcName' },
                { name: '引入日期', key: 'goodsIntroduceDate' },
                { name: '管理标志', key: 'goodsFlag' },
                { name: '在市状态', key: 'goodsTask' },
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.goodsCode, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                this.$emit('onSelect', selectDatas)
                this.selectedRowKeys.length = 0
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
        select (goodsCode) {
            const selectDatas = this.dataSource.filter(o => o.goodsCode === goodsCode)
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
            this.dataSource.length = 0
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                condition: '',
                page: 1,
                rows: 99
            }, newPams)
            axios({
                path: 'GoodsInformationSearch',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    const data = []
                    if (res.data.list) {
                        res.data.list.forEach(s => {
                            data.push({
                                goodsCode: s.goodsCode || s.code,
                                goodsName: s.goodsName || s.name,
                                brandCode: s.brandCode,
                                brandName: s.brandName,
                                classCode: s.classCode,
                                className: s.className,
                                goodsType: s.typeConfig,
                                type: s.type,
                                goodsModel: s.model,
                                goodsId: s.id,
                                basicUnit: s.basicUnit,
                                goodNo: s.goodNo,
                                goodsProduce: s.produce,
                                goodsTaxRate: s.taxRate,
                                goodsStatus: s.status,
                                goodsAbc: s.abc,
                                goodsStatusName: s.statusConfig,
                                goodsAbcName: s.abcName,
                                goodsIntroduceDate: s.introduceDate,
                                goodsFlag: s.flagConfig,
                                goodsTask: s.task,
                                goodsNote: s.note,
                                goodsContent: s.content
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

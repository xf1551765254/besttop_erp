<!--
 * @Description: 商品选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-03 14:17:54
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择SKU商品"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="900"
      class="doc"
      destroyOnClose
      wrapClassName="colCess"
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="24">
            <a-row type="flex" align="middle">
              <a-col :span="3" style="text-align:right">品类：</a-col>
              <a-col :span="9">
                <a-tree-select
                  style="width: 100%"
                  placeholder="请选择品类"
                  :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                  :treeData="categoryArr"
                  treeDefaultExpandAll
                  dropdownMatchSelectWidth
                  treeNodeFilterProp="title"
                  v-model="chooseSearchForm.classCode"
                  showSearch
                  allowClear>
                </a-tree-select>
              </a-col>
              <a-col :span="3" style="text-align:right">品牌：</a-col>
              <a-col :span="9">
                <a-select
                  showSearch
                  placeholder="请选择品牌"
                  style="width: 100%"
                  :filterOption="filterOption"
                  v-model="chooseSearchForm.brandCode"
                  allowClear>
                  <a-select-option
                    v-for="item in brandArr"
                    :value="item.value"
                    :key="item.key">{{ item.title }}</a-select-option>
                </a-select>
              </a-col>

            </a-row>
            <a-row style="margin-top:10px" type="flex" align="middle">
              <a-col :span="3" style="text-align:right">SKU商品：</a-col>
              <a-col :span="9">
                <a-input
                  ref="beginNumberRef"
                  v-model="chooseSearchForm.skuCode"
                  placeholder="请输入SKU编码/SKU名称/规格型号"/>
              </a-col>
              <a-col :span="12" style="text-align:right">
                <a-button
                  size="small"
                  style="margin-left:10px"
                  type="primary"
                  icon="search"
                  @click="getData">
                  搜索
                </a-button>
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="skuCode"
                  :scroll="{x:1150}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :pagination="{defaultPageSize:9}"
                  :dataSource="dataSource"
                  size="small"
                  bordered>
                  <template v-for="col in ['skuName','skuModel','className','brandName']" :slot="col" slot-scope="text, record, index">
                    <div :key="col">
                      <a-tooltip v-if="text.length&&text.length > 10" :title="text">
                        <span>{{ `${text.slice(0, 10)}...` }}</span>
                      </a-tooltip>
                      <span v-else>{{ text }}</span>
                    </div>
                  </template>
                  <a-button slot="action" slot-scope="record" @click="select(record.bt_web_id)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
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
    .colCess{
        .ant-col-3{
            // line-height: 30px
        }
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
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: false,
            selectedRowKeys: [],
            columns: [
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 150, scopedSlots: { customRender: 'className' } },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, scopedSlots: { customRender: 'brandName' } },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, scopedSlots: { customRender: 'skuModel' } },
                { title: '零售价', dataIndex: 'skuPrice', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],

            dataSource: [],
            isNotSelect: false,
            chooseSearchForm: {},

            // 下拉框
            categoryArr: [], // 品类
            brandArr: [] // 品牌
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    mounted () {
        this.getObjCategory()
        this.getObjBrandArr()
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

        },
        /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */

        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.bt_web_id, this.selectedRowKeys))
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
            const selectDatas = this.dataSource.filter(o => o.bt_web_id === key)
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
         * @name: 搜索品牌
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        getObjCategory () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.categoryArr = this.initTree(data)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        /**
         * @name: 获取品牌
         * @msg:
         * @param {type}
         * @return:
         */
        getObjBrandArr () {
            axios({
                path: 'GoodsBrandFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = [...res.data]
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = data
                }
            })
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData () {
            this.spinning = true
            const newPams = Object.assign(this.$props.pams, this.chooseSearchForm)
            const p = Object.assign({
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'HotCommoditiesQuerySku',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                // console.log('goods', res)
                if (res.flag === 1) {
                    this.dataSource = res.data
                    // console.log(res.data)
                    for (const i of this.dataSource) {
                        i.bt_web_id = i.skuCode
                    }
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

<!--
 * @Description: 商品SKU
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-22 14:31:48
 * @LastEditTime: 2019-06-04 09:41:09
 -->

<template>
  <div>
    <a-modal
      v-model="visible"
      title="SKU商品选择"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="900"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-form>
                <a-row class="doc">
                  <a-col :span="6">商品编码/名称</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachSku" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">品类</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-tree-select
                        style="width: 100%"
                        placeholder="请选择搜索值"
                        @change="seach"
                        :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                        :treeData="categoryArr"
                        treeDefaultExpandAll
                        dropdownMatchSelectWidth
                        showSearch
                        allowClear>
                      </a-tree-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">品牌</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-select
                        showSearch
                        @change="seachbrand"
                        placeholder="请选择搜索值"
                        :filterOption="filterOption"
                        style="width: 100%"
                        :options="brandArr"
                        allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="bt_web_id"
                  :scroll="{x:920}"
                  :pagination="{defaultPageSize:8}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.bt_web_id)" size="small" :disabled="isNotSelect">选择</a-button>
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
                <span v-if="item.key==='skuRate' ">{{ Number(`${cacheObj[item.key]}`*100).toFixed(2) }}</span>
                <span v-else>{{ cacheObj[item.key] }}</span>
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
        }
        // tmp: {
        //     type: String,
        //     default: () => { return {} }
        // }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            isNotSelect: false,
            selectedRowKeys: [],
            columns: [
                { title: '商品SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 150 },
                { title: '单位', dataIndex: 'skuUnit', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '商品SKU编码', key: 'skuCode' },
                { name: '商品SKU名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '品类编码', key: 'classCode' },
                { name: '品类名称', key: 'className' },
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '单位', key: 'skuUnit' }
            ],
            // 下拉框
            categoryArr: [], // 品类
            brandArr: [], // 品牌

            classCode: '', // 品类
            brandCode: '', // 品牌
            skuCode: ''// sku
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
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach ({ target }) {
            this.classCode = target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        /**
         * @name: 品牌搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachbrand (e) {
            this.brandCode = e
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        /**
         * @name: sku搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachSku (e) {
            this.skuCode = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
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
            console.table(selectedRowKeys, '监听')
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
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('获取品牌', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = [...data]
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
            const pams = {
                classCode: this.classCode,
                brandCode: this.brandCode,
                skuCode: this.skuCode
            }
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 9999
            }, newPams)
            // console.log(pams, '测试')
            axios({
                path: 'TroubleApplyFindSku',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                // console.log(6666666, res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    // console.log(res.data.list)
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
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

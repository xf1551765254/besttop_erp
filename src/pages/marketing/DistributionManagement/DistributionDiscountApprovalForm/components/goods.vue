<!--
 * @Description: 分销批发选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-20 15:44:33
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择SKU商品"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc setSeach"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning" class="col6">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-form>
              <a-row class="doc">
                <a-col :span="4" class="">SKU商品</a-col>
                <a-col :span="20" class="">
                  <a-form-item>
                    <a-input placeholder="请输入编码/名称" @change="seach" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc col7">
                <a-col :span="4" class="">供应商</a-col>
                <a-col :span="8" class="">
                  <a-form-item>
                    <a-select
                      showSearch
                      @change="seachProviderCode"
                      placeholder="请选择供应商"
                      :filterOption="filterOption"
                      style="width: 100%"
                      :options="prividorArr"
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :span="4" class="">品牌</a-col>
                <a-col :span="8" class="">
                  <a-form-item>
                    <a-select
                      showSearch
                      @change="seachbrandCode"
                      placeholder="请选择品牌"
                      :filterOption="filterOption"
                      style="width: 100%"
                      :options="brandArr"
                      allowClear/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc col7">
                <a-col :span="4" class="">品类</a-col>
                <a-col :span="20" class="">
                  <a-form-item>
                    <a-tree-select
                      style="width: 100%"
                      placeholder="请选择品牌"
                      @change="seachClassCode"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      :treeData="categoryArr"
                      treeDefaultExpandAll
                      treeNodeFilterProp="title"
                      dropdownMatchSelectWidth
                      showSearch
                      allowClear>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="skuCode"
                  :scroll="{x:960}"
                  :pagination="{defaultPageSize:10}"
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
                <span v-if="item.key==='skuTaxRate' ">{{ Number(`${cacheObj[item.key]}`*100).toFixed(2) }}</span>
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
<style lang="less">
    .setSeach .col7 .col5{
        text-align: right;
        font-weight: bold;
        font-size: 12px;
        background-color: #f5f5f5;
    }
    .setSeach .col6 .col7 .col6{
      padding-right: 0px;
    }
</style>

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
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', width: 150 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品牌名称', dataIndex: 'className', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 70 },
                { title: '供应商编码', dataIndex: 'providerCode', width: 120 },
                { title: '供应商名称', dataIndex: 'providerName', width: 150 },
                { title: '成本价（元）', dataIndex: 'skuPtCost', width: 100 },
                { title: '零售价（元）', dataIndex: 'skuPrice', width: 100 },
                { title: '分销价', dataIndex: 'skuPriceW', width: 100 },
                { title: '税率（%）', dataIndex: 'skuTaxRate', width: 120, customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],

            dataSource: [],
            cacheObj: {},
            details: [
                { name: '品类编码', key: 'classCode' },
                { name: '品牌名称', key: 'className' },
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '单位', key: 'skuUnit' },
                { name: '供应商编码', key: 'providerCode' },
                { name: '供应商名称', key: 'providerName' },
                { name: '成本价（元）', key: 'skuPtCost' },
                { name: '零售价（元）', key: 'skuPrice' },
                { name: '分销价（元）', key: 'skuPriceW' },
                { name: '税率（%）', key: 'skuTaxRate' },
                { name: '账面存量', key: 'bookNumbers' }
            ],
            // 下拉框
            categoryArr: [], // 品类
            brandArr: [], // 品牌
            prividorArr: [], // 供应商

            skuCode: '',
            classCode: '',
            brandCode: '',
            providerCode: '',
            isNotSelect: false
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
        this.getPrividorArr()
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
            this.skuCode = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        seachbrandCode (e) {
            // this.goodsClassCodeId = e
            this.brandCode = e
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        seachClassCode (e) {
            this.classCode = e
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        seachProviderCode (e) {
            this.providerCode = e
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
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
        },
        /**
         * @name: 搜索品牌和供应商
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
         * @name: 获取供应商
         * @msg:
         * @param {type}
         * @return:
         */
        getPrividorArr () {
            axios({
                path: 'GoodsCategoryFindOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.prividorArr = [...data]
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
                skuCode: this.skuCode,
                classCode: this.classCode,
                brandCode: this.brandCode,
                providerCode: this.providerCode
            }
            // console.log(pams)
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 10
            }, newPams)
            axios({
                path: 'DistWholesaleRebatePlanSelectProviderContractSkus',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = res.data.list
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

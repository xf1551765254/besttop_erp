<!--
 * @Description: 商品盘点单选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-12 17:18:51
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
                    <a-input placeholder="请输入SKU编码/名称" @change="seach" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc col7">
                <a-col :span="4">库存分类</a-col>
                <a-col :span="8">
                  <a-form-item>
                    <a-select
                      showSearch
                      @change="seachFlag"
                      placeholder="请选择库存分类"
                      :filterOption="filterOption"
                      style="width: 100%"
                      :options="flagArr"
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
                      @change="seachClassCode"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      :treeData="categoryArr"
                      treeDefaultExpandAll
                      dropdownMatchSelectWidth
                      treeNodeFilterProp="title"
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
                  :scroll="{x:2250}"
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
// import { mapGetters } from 'vuex'
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
                { title: '商品条码', dataIndex: 'barCode', width: 100 },
                { title: '规格型号', dataIndex: 'model', width: 100 },
                { title: '单位', dataIndex: 'basicUnit', width: 100 },
                { title: '成本价', dataIndex: 'priceCost', width: 100 },
                { title: '零售价', dataIndex: 'price', width: 100 },
                { title: '税率（%）', dataIndex: 'skuRate', width: 100, customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '账面存量', dataIndex: 'bookNumbers', width: 100 },
                { title: '待送货量', dataIndex: 'tobeSendNumber', width: 100 },
                { title: '实物存量', dataIndex: 'curNumber', width: 100 },
                { title: '调入在途', dataIndex: 'moveInNumber', width: 100 },
                { title: '调出在途', dataIndex: 'moveOutNumber', width: 100 },
                { title: '正品库存', dataIndex: 'norNumber', width: 100 },
                { title: '样品存量', dataIndex: 'smpNumber', width: 100 },
                { title: '残次存量', dataIndex: 'lemNumber', width: 100 },
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
                { name: '商品条码', key: 'barCode' },
                { name: '规格型号', key: 'model' },
                { name: '单位', key: 'basicUnit' },
                { name: '成本价', key: 'priceCost' },
                { name: '零售价', key: 'price' },
                { name: '税率（%）', key: 'skuRate' },
                { name: '账面存量', key: 'bookNumbers' },
                { name: '待送货量', key: 'tobeSendNumber' },
                { name: '实物存量', key: 'curNumber' },
                { name: '调入在途', key: 'moveInNumber' },
                { name: '调出在途', key: 'moveOutNumber' },
                { name: '正品库存', key: 'norNumber' },
                { name: '样品存量', key: 'smpNumber' },
                { name: '残次存量', key: 'lemNumber' }
            ],
            flagArr: [
                { key: 0, value: 0, title: '零库存商品' },
                { key: 1, value: 1, title: '有库存商品' }
            ], // 库存
            // 下拉框
            categoryArr: [], // 品类
            brandArr: [], // 品牌
            prividorArr: [], // 供应商

            skuCode: '',
            classCode: '',
            brandCode: '',
            providerCode: '',
            flag: '',
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
        seachFlag (e) {
            this.flag = e
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
                    mouseenter: (e) => {}
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
                        i.title = i.name
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
                flag: this.flag,
                providerCode: this.providerCode
            }
            // console.log(pams)
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                storeCode: this.$store.getters.storeInfo.code,
                // include: {
                //     type: ['store_type:2', 'store_type:3']
                // },
                // exclude: {
                //     type: 'provider_type:3'
                // },
                page: 1,
                rows: 15
            }, newPams)
            axios({
                path: 'StocktakingStocktQueryChooseStocktaking',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                console.log('goods', res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    console.log(res.data)
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

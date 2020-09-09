<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-26 17:26:05
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
            <a-row class="doc">
              <a-col :span="24">
                <a-col :span="4">生效位置</a-col>
                <a-col :span="20">
                  <a-form-item>
                    <a-select
                      ref="storeRef"
                      mode="multiple"
                      placeholder="请选择生效位置"
                      :maxTagCount="1"
                      style="width:85%"
                      :options="fenDianArr"
                      :open="false"
                      @focus="selectFocusEffect"
                      v-model="tempObjArr"
                      allowClear/>
                    <a href="javascript:;" @click="selectFocusEffect">
                      <a-icon style="width:15%;line-height:36px;" type="edit" />
                    </a>
                  </a-form-item>
                </a-col>
                <a-col :span="4">商品品牌</a-col>
                <a-col :span="20">
                  <a-form-item>
                    <a-select
                      ref="BrandRef"
                      mode="multiple"
                      placeholder="请选择商品品牌"
                      :maxTagCount="1"
                      style="width:85%"
                      :options="brandArr"
                      :open="false"
                      @focus="BrandFocus"
                      v-model="BrandObjArr"
                      allowClear/>
                    <a href="javascript:;" @click="BrandFocus">
                      <a-icon style="width:15%;line-height:36px;" type="edit" />
                    </a>
                  </a-form-item>
                </a-col>
                <a-col :span="4">品类</a-col>
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
                <a-col :span="10">
                  <a-form-item>
                    <a-input
                      placeholder="请输入编码/名称"
                      style="width:100%; border-radius: 0"
                      v-model="skuCodeId"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="10">
                  <a-button @click="seach" style="width: 100%; margin-top: 2px; border-radius: 0" type="primary">查询</a-button>
                </a-col>
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="tbWebId"
                  :scroll="{x:600}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="pagination"
                  @change="pagingChange"
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
                <div>{{ `[${cacheObj.skuName||'未选择'}]-详情` }}</div>
              </template>
              <a-row v-for="(item, index) in details" :key="index">
                <span class="title">{{ `${item.name}：` }}</span>
                <span>{{ cacheObj[item.tbWebId] }}</span>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple" :disabled="isNotMulSelect">选择</a-button>
      </div>
      <stores :visible.sync="storeQuery" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" :objData="objData"/>
      <brand :visible.sync="brandQuery" @onSelect="onSelectBrand" :defaultSelect="BrandObjArr"/>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
@import "../../../assets/modalStyle.less";
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
import map from 'lodash.map'
import brand from '@comp/BasicQuery/brand'
// 导入生效分店组件
import stores from '@pages/purchasing/goodsPresellDeploy/stores'
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
    components: { stores, brand },
    data () {
        return {
            pagination: {},
            skuCodeId: '',
            objData: false,
            seachTimer: '',
            isLoading: true,
            spinning: false,
            selectedRowKeys: [],
            columns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'model', width: 100 },
                { title: '当前账面库存', dataIndex: 'currentNumber' },
                { title: '操作', tbWebId: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '商品编码', tbWebId: 'skuCode' },
                { name: '商品名称', tbWebId: 'skuName' },
                { name: '规格型号', tbWebId: 'model' },
                { name: '当前账面库存', tbWebId: 'currentNumber' }
            ],
            categoryArr: [], // 品类
            maxTagCount: 1, // 生效分店展示数量
            goodsClassCodeId: '',
            goodsBranchCode: '',
            isNotSelect: false,
            fenDianArr: [], // 生效分店
            tempObjArr: [],
            storeQuery: false,
            brandArr: [], // 品牌
            BrandObjArr: [],
            brandQuery: false

        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    mounted () {
        this.BaseMessageObjcategory()
    },
    methods: {
        /**
         * @name: 获取品牌
         * @msg:
         * @param {type}
         * @return:
         */
        queryBrand () {
            axios({
                path: 'GoodsBrandFind',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = [...data]
                }
            })
        },
        delForm () {
            this.dataSource = []
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectBrand (arr) {
            const newarr = [...this.BrandObjArr]
            this.BrandObjArr = [...new Set([...newarr, ...map(arr, 'code')])]
        },
        /**
         * @name: 品牌弹框
         * @msg:
         * @param {type}
         * @return:
         */
        BrandFocus () {
            this.brandQuery = true
            this.$refs.BrandRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            if (!arr[0].mun) {
                this.dataSource = []
            }
            const newarr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...newarr, ...map(arr, 'code')])] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQuery = true
            this.queryFenDian()
            if (this.dataSource.length > 0) {
                this.objData = true
            } else {
                this.objData = false
            }
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        pagingChange (e) {
            this.pagination.current = e.current
            const obj = {
                skuCode: this.skuCodeId || '',
                storeCode: this.tempObjArr || [],
                goodsClassCode: this.goodsClassCodeId || '',
                goodsBranchCode: this.BrandObjArr[0] || ''
            }
            this.getData(obj)
        },
        /**
         * @name: 获取分店
         * @msg:
         * @param {type}
         * @return:
         */
        queryFenDian () {
            axios({
                path: 'OrganizationStoreFindStoreAndDirect',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code,
                    status: 2
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.fenDianArr = [...data]
                    console.log(this.fenDianArr, '门店')
                }
            })
        },
        /**
         * @name: 品类搜索
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
        BaseMessageObjcategory () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(d => {
                        d.key = d.code
                        d.title = `${d.code}-${d.name}`
                        d.value = d.code
                    })
                    this.categoryArr = data
                }
            })
        },
        // initTree (data) {
        //     const arr = []
        //     data.forEach(d => {
        //         d.key = d.code
        //         d.title = `${d.code}-${d.name}`
        //         d.value = d.code
        //         if ('children' in d) {
        //             d.children = this.initTree(d.children)
        //         } else {
        //             d.isLeaf = true
        //         }
        //         arr.push(d)
        //     })
        //     return arr
        // },
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
            const obj = {
                skuCode: this.skuCodeId || '',
                storeCode: this.tempObjArr || [],
                goodsClassCode: this.goodsClassCodeId || '',
                goodsBranchCode: this.BrandObjArr[0] || ''
            }
            console.log(obj, '查询')
            this.pagination.current = 1
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData(obj)
            }, 300)
        },
        seachC (e) {
            this.goodsClassCodeId = e
            // clearTimeout(this.seachTimer)
            // // this.seachTimer = setTimeout(() => {
            // //     this.getData()
            // // }, 300)
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
        select (code) {
            const selectDatas = this.dataSource.filter(o => o.tbWebId === code)
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
        getData (pams) {
            if (this.tempObjArr.length === 0) {
                return this.$message.warning('请选择生效位置')
            }
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: this.pagination.current,
                rows: this.pagination.pageSize
            }, newPams)
            this.spinning = true
            axios({
                path: 'BillSaleFindCommodityConfigureSku',
                method: 'POST',
                body: p
            }).then(res => {
                console.log('获取数据', res)
                this.spinning = false
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        i.tbWebId = i.skuCode + i.storeCode
                    })
                    this.dataSource = arr
                    this.pagination.total = res.data.total
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.skuCodeId = ''
                this.tempObjArr = []
                this.goodsClassCodeId = ''
                this.BrandObjArr = []
                this.pagination = {
                    total: 0,
                    current: 1,
                    pageSize: 8,
                    showQuickJumper: true
                }
                this.queryFenDian()
                this.queryBrand()
            }
        },
        storeQuery (val) {
            if (!val) {
                this.pagination = {
                    total: 0,
                    current: 1,
                    pageSize: 8,
                    showQuickJumper: true
                }
            }
        },
        tempObjArr: function (val, oldVal) {
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                // this.getData()
            }, 300)
        },
        BrandObjArr: function (val, oldVal) {
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                // this.getData()
            }, 300)
        }
    }
}
</script>

<!--
 * @Description: 组织架构
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-27 09:08:07
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入件型编码/件型编码" @change="onChange" />
          <a-directory-tree
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :treeData="treeData"
            :selectedKeys.sync="selectedKeys"
            :autoExpandParent="autoExpandParent"
            :loading="loading"
            @select="onSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="tableSelect">
        </NewTable>
      </div>
    </holy-grail-layout>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <a-row class="doc">
        <a-col :sm="8" :md="4" :xl="3">商品编码</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          <a-input @change="skuCodeChange" placeholder="请输入商品编码" />
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">品类</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          <a-tree-select
            ref="classCode"
            style="width: 100%"
            placeholder="请选择商品品类"
            treeNodeFilterProp="title"
            :treeData="typeArr"
            showSearch
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            @change="classCodeChange"
            allowClear>
          </a-tree-select>
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">品牌</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          <a-select
            ref="BrandRef"
            mode="multiple"
            :getPopupContainer="trigger => trigger.parentNode"
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
        </a-col>
        <a-col :sm="8" :md="4" :xl="3"></a-col>
        <a-col :sm="16" :md="8" :xl="5">
          <a-button type="primary" @click="search">搜索</a-button>
        </a-col>
      </a-row>
      <h4 class="baseInfo">详情信息</h4>
      <a-table
        rowKey="skuCode"
        :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
        :columns="categoryinfoColumns"
        :dataSource="categoryinfoData"
        size="small"
        bordered
        :loading="tableLoading"
        @change="handleTableChange"
        :pagination="pagination">
      </a-table>
      <brand :visible.sync="brandQuery" @onSelect="onSelectBrand" :defaultSelect="BrandObjArr"/>
    </bt-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import BtModal from '@comp/Modal'
import brand from '@comp/BasicQuery/brand'
export default {
    name: 'ProductTypeManagement',
    components: { NewTable, SeachBox, HolyGrailLayout, BtModal, brand },
    data () {
        return {
            selectedKeys: [],
            brandQuery: false,
            tableCode: '',
            tableApiPath: '',
            conditions: [
                {
                    title: '商品',
                    type: 'input',
                    key: 'skuName'
                },
                {
                    title: '品牌',
                    type: 'input',
                    key: 'brandCode'
                },
                {
                    title: '品类',
                    type: 'treeSelect',
                    key: 'classCode',
                    filter: true,
                    selectDataArr: []
                }
                // {
                //     title: '品类',
                //     type: 'select',
                //     key: 'classCode',
                //     path: 'GoodsCategoryFindOption',
                //     label: ['code', 'name'],
                //     value: 'code',
                //     filter: true,
                //     body: {
                //         type: 'code'
                //     }
                // }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {},
            expandedKeys: [],
            loading: false,
            treeData: [],
            treeDataSearch: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '删除',
                    action: 'productTypeManagement.delete',
                    fc: this.deleteHandler
                }
            ],
            addEditModel: false, // 弹窗
            title: '',
            submitLoading: false,
            tableSelectRows: [],
            treeId: {},
            // 新增modeal
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [
                { title: '商品编码', dataIndex: 'skuCode', align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'model', align: 'center' },
                { title: '品牌', dataIndex: 'brandName', align: 'center' },
                { title: '单位', dataIndex: 'basicUnit', align: 'center' },
                { title: '品类', dataIndex: 'className', align: 'center' }
            ], // 表头
            categoryinfoData: [],
            typeArr: [],
            brandArr: [],
            BrandObjArr: [],
            classCodeId: '',
            skuCodeId: '',
            autoExpandParent: true,
            pagination: {
                total: 0,
                pageSize: 16,
                current: 1,
                showQuickJumper: true,
                hideOnSinglePage: true
            },
            tableLoading: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ce429af4482e423a9af056c772b5f3b1:productTypeManagement'
            this.tableApiPath = 'DistributionModelSkuTypeFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.getTree()
        this.queryType()
        this.queryBrand()
    },
    methods: {
        skuCodeChange (e) {
            this.skuCodeId = e.target.value
        },
        handleTableChange (pagination) {
            console.log(pagination)
            this.pagination.current = pagination.current
            this.goodsFun()
        },
        classCodeChange (e) {
            console.log(e)
            this.classCodeId = e
        },
        search () {
            // console.log('skuCode', this.$refs.skuCode.stateValue)
            // console.log('brandCode', this.BrandObjArr)
            this.pagination.current = 1
            this.goodsFun()
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        queryType () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                console.log('品类', res)
                if (res.flag === 1) {
                    const data = res.data
                    this.typeArr = this.initTreeT(data)
                    this.$set(this.conditions[2], 'selectDataArr', this.typeArr)
                }
            })
        },
        initTreeT (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTreeT(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        deleteHandler (e) {
            this.onDel(e)
        },
        onDel (e) {
            let arr = []
            if (e === -1) {
                if (this.tableSelectRows.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                arr = map(this.tableSelectRows, 'id')
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'DistributionModelSkuTypeDel',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys)
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            if (this.categoryinfoSelectedRowKeys.length === 0) {
                return this.$message.warning('请选择商品!')
            }
            const arr = [...this.categoryinfoData]
            const newArr = []
            for (const i of this.categoryinfoSelectedRowKeys) {
                for (const j of arr) {
                    if (i === j.skuCode) {
                        newArr.push(j)
                    }
                }
            }
            axios({
                path: 'DistributionModelSkuTypeAdd',
                method: 'post',
                body: {
                    modelSkus: newArr,
                    modelCode: this.treeId.code
                },
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath, ...this.seachValue })
                    this.addEditModel = false
                }
            })
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            this.categoryinfoSelectedRowKeys = []
            if (!this.treeId.code || this.treeId.code === '-1') {
                return this.$message.warning('请选择件型！')
            }
            this.classCodeId = ''
            this.BrandObjArr = []
            this.title = '新增商品'
            // 打开modal
            this.goodsFun()
            this.addEditModel = true
        },
        goodsFun () {
            this.categoryinfoSelectedRowKeys = []
            this.tableLoading = true
            axios({
                path: 'GoodsInformationSearch',
                method: 'post',
                body: {
                    name: this.skuCodeId,
                    classCode: this.classCodeId,
                    brandCode: this.BrandObjArr[0],
                    modelCode: this.treeId.code,
                    page: this.pagination.current,
                    rows: this.pagination.pageSize
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '123456789')
                    this.pagination.total = res.data.total
                    const categoryinfoDataArr = []
                    for (const i of res.data.list) {
                        categoryinfoDataArr.push(
                            {
                                skuCode: i.code,
                                skuName: i.name,
                                brandCode: i.brandCode,
                                brandName: i.brandName,
                                classCode: i.classCode,
                                className: i.className,
                                basicUnit: i.inUnit,
                                model: i.model
                            }
                        )
                    }
                    this.categoryinfoData = categoryinfoDataArr
                    this.tableLoading = false
                }
            })
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keys, e) {
            console.log(e.node.dataRef)
            const id = e.node.dataRef.code
            this.$set(this.seachValue, 'modelCode', id)
            this.treeId = e.node.dataRef
            this.$refs.newTable.setTableData('3233b262b2bc44529a60ae351c2b2eb6:productTypeManagement', {
                path: 'DistributionModelSkuTypeFind',
                modelCode: id
            })
        },
        // 表格多选
        tableSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'DistributionModelTypeFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = [res.data]
                    console.log('组织机构', data)
                    this.treeData = this.initTree(data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['-1']
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                if (d.code === '-1') {
                    d.title = d.name
                } else {
                    d.title = `${d.code}-${d.name}`
                }
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
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {
            console.log(e.target.value)
            if (e.target.value) {
                const newData = JSON.parse(JSON.stringify(this.treeDataSearch))
                this.expandedKeys.length = 0
                const data = this.getParentKey(e.target.value, newData)
                this.autoExpandParent = true
                this.treeData = [...data]
            } else {
                this.treeData = JSON.parse(JSON.stringify(this.treeDataSearch))
            }
        },
        getParentKey (value, tree) {
            const newArr = []
            tree.forEach(item => {
                if (item.title.indexOf(value) >= 0) {
                    this.expandedKeys.push(item.key)
                    newArr.push(item)
                } else if (item.children) {
                    const data = this.getParentKey(value, item.children)
                    if (data.length > 0) {
                        item.children = data
                        newArr.push(item)
                    }
                }
            })
            return newArr
        },
        onExpand  (expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.$delete(this.seachValue, 'modelCode')
            this.seachValue = {}
            this.selectedKeys = ['-1']
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionModelSkuTypeFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'DistributionModelSkuTypeFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
            this.getTree()
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'productTypeManagement') {
                this.getTree()
                this.queryType()
                this.queryBrand()
            }
        }
    }
}
</script>

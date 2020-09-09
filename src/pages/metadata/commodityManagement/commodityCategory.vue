<!--
 * @Description: 商品品类
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:27:28
 * @LastEditTime: 2019-08-07 14:50:46
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-178}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <a-directory-tree
            defaultExpandAll
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :treeData="treeData"
            @select="onSelect"
          >
          </a-directory-tree>
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onTableSelect"/>
      </div>
    </holy-grail-layout>
    <a-modal
      v-model="editVisible"
      :title="modalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="600"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="subLoading" @click="subClick">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">上级品类</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-select
                placeholder="请选择商品品类"
                showSearch
                disabled
                :open="false"
                style="width:85%"
                v-decorator="$check('category.parentId',{initialValue:selectedRow.parentId==='0'?'':selectedRow.parentId}) "
                :options="treeSelectData"/>
              <a href="javascript:;" @click="categoryinfoAdd" :disabled="!isAdd">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="!isAdd">品类编码</a-col>
          <a-col :span="20" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('category.code', {initialValue:selectedRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">品类名称</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input
                v-decorator="$check('category.name', {initialValue:selectedRow.name || ''})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">核算级别</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group
                v-decorator="$check('category.isCheck', {initialValue:selectedRow.isCheck || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea
                placeholder="备注信息"
                v-decorator="$check('category.note', {initialValue:selectedRow.note || ''})"
                :autosize="{minRows: 2, maxRows: 6}"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <upload :fileList="fileList" :fileLength="fileLength" @uploadFileList="uploadFileList"></upload>
          </a-col>
        </a-row>
      </a-form>
      <category :visible.sync="categoryQuery" :pams="pams" @onSelect="onCategorySelect"/>
    </a-modal>
    <recover-modal v-model="recoverVisble" status="1" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .action-card{
        overflow:auto;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import category from '@comp/BasicQuery/category'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import RecoverModal from '../tools/RecoverModal'
import upload from '../tools/upload'
export default {
    name: 'CommodityCategory',
    components: {
        NewTable,
        seachBox,
        category,
        HolyGrailLayout,
        RecoverModal,
        upload
    },
    data () {
        return {
            form: this.$form.createForm(this),
            treeSelectData: [],
            editVisible: false,
            subLoading: false,
            modalTitle: '新增品类信息',
            conditions: [
                { title: '品类编码', type: 'input', key: 'code' },
                { title: '品类名称', type: 'input', key: 'name' }
            ],
            btns: ['add', 'del', 'recover', 'export'],
            seachValue: {},
            treeData: [],
            treeDataSearch: [],
            tableCode: '',
            tableApiPath: '',
            menuOpt: [
                { name: '编辑', action: 'commodityCategory.edit', fc: (e) => { this.Edit(e) } },
                { name: '详情', action: 'commodityCategory.get', fc: e => this.$refs.newTable.showDetails('商品品类详情', e) },
                { name: '删除', action: 'commodityCategory.delete', fc: ({ id }) => { this.del(id) } }
            ],
            tableSelectRows: [],
            isAdd: false,
            selectedRow: {},
            categoryQuery: false,
            pams: {
                level: 1
            },
            expandedKeys: [],
            autoExpandParent: true,
            recoverVisble: false,
            fileList: [],
            fileLength: ['上传LOGO']
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b762db8a77fb468bb29aefe758c035ba:commodityCategory'
            this.tableApiPath = 'GoodsCategoryFindAllChildren'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTreeData()
        this.getAllTreeData()
    },
    methods: {
        // 图片上传
        uploadFileList (data) {
            this.fileList = data
        },
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'GoodsCategoryFindAllChildren' })
        },
        categoryinfoAdd () {
            this.categoryQuery = true
        },
        /**
         * @name: 品类选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onCategorySelect (arr) {
            this.form.setFieldsValue({
                parentId: arr[0].id
            })
        },
        /**
         * @name: 提交表单
         * @msg:
         * @param {type}
         * @return:
         */
        subClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.selectedRow.id
                    }
                    const fileList = this.fileList.map(x => x.fileUrl)
                    values.logoUrl = fileList.join(',')
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'GoodsCategoryAdd' : 'GoodsCategoryUpdate',
                        method: 'POST',
                        body: values
                    }).then(res => {
                        this.getTreeData()
                        this.subLoading = false
                        if (res.flag === 1) {
                            this.editVisible = false
                            this.$refs.newTable.setTableData('b762db8a77fb468bb29aefe758c035ba:commodityCategory', {
                                path: 'GoodsCategoryFindAllChildren'
                            })
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        onTableSelect (selectedRowKeys, selectedRows) {
            this.tableSelectRows = [...selectedRows]
        },
        onSelect (keys, e) {
            this.$set(this.seachValue, 'parentId', keys[0])
            if (e.selected && keys.length > 0) {
                this.$refs.newTable.setTableData('b762db8a77fb468bb29aefe758c035ba:commodityCategory', {
                    path: 'GoodsCategoryFindAllChildren',
                    parentId: keys[0]
                })
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
        onChange (e) {
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
        /**
         * @name: 右键编辑
         * @msg:
         * @param {type}
         * @return:
         */
        Edit (e) {
            this.fileList = []
            this.getAllTreeData()
            this.selectedRow = { ...e }
            if (e.logoUrl) {
                const pic = e.logoUrl.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
            }
            this.isAdd = false
            this.modalTitle = '编辑品类信息'
            this.editVisible = true
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        del (id) {
            const self = this
            self.$confirm({
                title: '警告',
                content: '删除操作不可恢复，是否继续？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'GoodsCategoryDel',
                        method: 'POST',
                        body: { ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.getTreeData()
                            self.$refs.newTable.del(ids)
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 获取树形的数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTreeData () {
            axios({
                path: 'GoodsCategoryFindTree',
                method: 'POST'
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = initTreeData(insertData('', res.data))
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['0']
                }
            })
        },
        /**
         * @name: 获取所有品类，下拉树形选择
         * @msg:
         * @param {type}
         * @return:
         */
        getAllTreeData () {
            axios({
                path: 'GoodsCategoryFindAllTree',
                method: 'POST'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.code}:${i.name}`
                        i.title = `${i.code}--${i.name}`
                        i.value = i.id
                    })
                    this.treeSelectData = [...data]
                }
            })
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            this.getAllTreeData()
            if (e === 'add') {
                this.isAdd = true
                this.modalTitle = '新增品类信息'
                this.selectedRow = {}
                this.fileList = []
                this.editVisible = true
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.del(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('GoodsCategoryFindAllChildren', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            // this.$delete(this.seachValue, 'parentId')
            e.path = 'GoodsCategoryFindAllChildren'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },

        subCancel () {
            this.editVisible = false
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CommodityCategory') {
                this.getTreeData()
                this.$refs.newTable.setTableData('b762db8a77fb468bb29aefe758c035ba:commodityCategory', {
                    path: 'GoodsCategoryFindAllChildren'
                })
            }
        }
    }
}
function initTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const x = {}
        x.title = i.name
        x.key = i.id
        if ('children' in i) {
            x.children = initTreeData(i.children)
        } else {
            x.isLeaf = true
        }
        newArr.push(x)
    })
    return newArr
}
function insertData (id, arr) {
    const endArr = []
    const pArr = arr.filter(o => o.parentId === id)
    pArr.forEach(i => {
        const x = arr.filter(o => o.parentId === i.id)
        if (x.length > 0) {
            i.children = insertData(i.id, arr)
        }
        endArr.push(i)
    })
    return endArr
}
</script>

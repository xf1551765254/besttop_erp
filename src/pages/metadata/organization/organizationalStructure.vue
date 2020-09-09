<!--
 * @Description: 组织架构
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-22 17:22:23
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
        <a-card hoverable :style="`height:${$store.getters.windowHeight-178}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <a-directory-tree
            defaultExpandAll
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :treeData="treeData"
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
      v-model="addEditModal"
      :title="addEditModalTitle"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="4">上级架构</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-tree-select
                :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                :disabled="!isAdd"
                :treeData="treeAllData"
                treeNodeFilterProp="title"
                v-decorator="$check('organization.parentId', {initialValue:selectedSingleRow.parentId==='0'?'':selectedSingleRow.parentId})"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4" v-if="!isAdd">架构编码</a-col>
          <a-col :sm="16" :md="8" :xl="8" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('organization.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">架构名称</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入架构名称" v-decorator="$check('organization.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">机构类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('organization.type', {initialValue:selectedSingleRow.type || 'organization_type:2'})" :options="orgTypeArr"/>
            </a-form-item>
          </a-col> -->
          <!-- <a-col :sm="8" :md="4" :xl="3">年度</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择年度"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :filterOption="filterOption"
                showSearch
                v-decorator="$check('organization.year', {initialValue:selectedSingleRow.year})"
                :options="yearArr"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="4">机构信息</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select
                placeholder="请选择机构"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :filterOption="filterOption"
                showSearch
                v-decorator="$check('organization.storeId', {initialValue:selectedSingleRow.storeId})"
                :options="storeArr"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">电话</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入电话" v-decorator="$check('organization.telephone', {initialValue:selectedSingleRow.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">人数</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input-number style="width:100%;" :min="0" :precision="0" placeholder="请输入人数" v-decorator="$check('organization.numberPeople', {initialValue:selectedSingleRow.numberPeople || 0})"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">税率</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('organization.incomeTaxRate', {initialValue:selectedSingleRow.incomeTaxRate ||$store.getters.taxRate[0].value})" :options="$store.getters.taxRate" allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="4">状态</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('organization.status', {initialValue:selectedSingleRow.status})" :options="statusArr">
                <!-- <a-select-option value="正常">正常</a-select-option>
                <a-select-option value="停用">停用</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">启用签批</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group v-decorator="$check('organization.isSign', {initialValue:selectedSingleRow.isSign || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <!-- <a-col :sm="8" :md="4" :xl="3">预算末级项</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group v-decorator="$check('organization.isFinalStage', {initialValue:selectedSingleRow.isFinalStage || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">预算设置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group v-decorator="$check('organization.isBudgetSet', {initialValue:selectedSingleRow.isBudgetSet || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <a-col v-if="!isAdd" :sm="0" :md="4" :xl="4"></a-col>
          <a-col v-if="!isAdd" :sm="0" :md="8" :xl="8"></a-col>
          <a-col :sm="8" :md="4" :xl="4">备注</a-col>
          <a-col :sm="16" :md="20" :xl="20">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 6}" v-decorator="$check('organization.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <recover-modal v-model="recoverVisble" status="6" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import BtModal from '@comp/Modal'
import RecoverModal from '../tools/RecoverModal'
export default {
    name: 'OrganizationalStructure',
    components: { NewTable, SeachBox, HolyGrailLayout, BtModal, RecoverModal },
    data () {
        return {
            recoverVisble: false,
            // 表单
            form: this.$form.createForm(this),
            // 新增/编辑标题
            addEditModalTitle: '',
            // 新增/编辑标识
            addEditModal: false,
            // 树形选中数据
            treeSelectData: [],
            // 加载标识
            loading: false,
            // 树形数据
            treeData: [],
            treeDataSearch: [],
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['add', 'del', 'recover', 'export'],
            // 工具栏表单数据收集
            seachValue: {},
            // 工具栏表单配置
            conditions: [
                {
                    key: 'parentId',
                    type: 'treeSelect',
                    title: '上级架构',
                    selectDataArr: []
                    // disabled: true
                },
                {
                    key: 'code',
                    type: 'input',
                    title: '编码'
                },
                {
                    key: 'name',
                    type: 'input',
                    title: '名称'
                },
                {
                    key: 'type',
                    type: 'select',
                    title: '类型',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'organization_type'
                    },
                    filter: true
                }
            ],
            // 单项/多项删除
            tableSelectRows: [],
            // 选中行数据
            selectedSingleRow: {},
            // 是否添加表示
            isAdd: true,
            // 表格右键菜单配置
            menuOpt: [
                { name: '编辑', action: 'organizationalStructure.edit', fc: this.editHandler },
                { name: '详情', action: 'organizationalStructure.get', fc: e => this.$refs.newTable.showDetails('架构信息详情', e) },
                { name: '删除', action: 'organizationalStructure.delete', fc: ({ id }) => { this.onDel(id) } }
            ],
            // 新增/编辑组织类型
            // orgTypeArr: [],
            // 新增/编辑分店
            storeArr: [],
            // yearArr: [],
            // 新增/编辑隶属公司
            // subComArr: [],
            // 新增/编辑树形数据
            treeAllData: [],
            expandedKeys: [],
            autoExpandParent: true,
            statusArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9ef01aab8be842999bbba6f72daf0136:organizationalStructure'
            this.tableApiPath = 'OrganizationGroupFrameworkFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTree()
        this.getTreeAllData()
        this.getConfig()
    },
    methods: {
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'OrganizationGroupFrameworkFindBySelected' })
        },
        // 分店搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        // 提交
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    console.log('va', values)
                    if (!this.isAdd) {
                        values = Object.assign(this.selectedSingleRow, { ...values })
                    }
                    axios({
                        path: this.isAdd ? 'OrganizationGroupFrameworkAdd' : 'OrganizationGroupFrameworkUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath, ...this.seachValue })
                            // 刷新左侧树
                            this.getTree()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 工具栏搜索表单清空
        onReload () {
            this.seachValue = {}
        },
        // 表格右键编辑监听
        editHandler (row) {
            this.isAdd = false
            this.selectedSingleRow = { ...row }
            this.addEditStorefront()
        },
        // 工具栏按钮事件监听
        onSeachClick (e) {
            if (e === 'add') {
                this.isAdd = true
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('OrganizationGroupFrameworkFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            // this.getOrgArr()
            this.getStoreArr()
            this.getTreeAllData()
            this.getConfig()
            if (index === -1) {
                this.selectedSingleRow = {}
                this.addEditModalTitle = '新增架构信息'
            } else {
                this.addEditModalTitle = '编辑架构信息'
            }
            this.addEditModal = true
        },
        // 表格多选
        tableSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        // 工具栏搜索
        onSeach (e) {
            // this.$delete(this.seachValue, 'code')
            e.path = 'OrganizationGroupFrameworkFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        // 右键删除和多项删除
        onDel (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'OrganizationGroupFrameworkDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                            // 刷新左侧树
                            self.getTree()
                        }
                    })
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
            const id = e.node.dataRef.id
            this.$set(this.seachValue, 'parentId', id)
            this.$refs.newTable.setTableData(this.tableCode, {
                path: 'OrganizationGroupFrameworkFindBySelected',
                parentId: id
            })
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
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
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
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'OrganizationGroupFrameworkFindTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = insertData('', res.data)
                    this.$set(this.conditions[0], 'selectDataArr', this.treeData)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['0']
                }
            })
        },
        // 时间禁用
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('minute'))
        },
        // 新增/编辑分店数据获取
        getStoreArr () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = `${item.code}-${item.name}`
                        item.value = item.id
                    })
                    this.storeArr = [ ...data ]
                }
            })
        },
        // 新增/编辑上级组织数据获取
        getTreeAllData () {
            axios({
                path: 'OrganizationGroupFrameworkFindAllChildren',
                method: 'post',
                body: {
                    page: 1,
                    row: 9999
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.treeAllData = initTreeData(res.data.list)
                }
            })
        },
        getConfig () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'base_organization_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.statusArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.status = data[0].value
                    }
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'OrganizationalStructure') {
                this.getTree()
                this.getTreeAllData()
            }
        }
    }
}
function initTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const pArr = arr.filter(o => i.parentId && o.id === i.parentId)
        if (pArr.length < 1) {
            i.key = i.code
            i.value = i.id
            i.title = i.code ? `${i.code}-${i.name}` : i.name
            i.children = insertTreeData(i.id, arr)
            newArr.push(i)
        }
    })
    newArr.sort((a, b) => { return a.key - b.key })
    return newArr
}
function insertTreeData (id, arr) {
    const endArr = []
    const pArr = arr.filter(o => o.parentId === id)
    pArr.forEach(i => {
        const x = arr.filter(o => o.parentId === id)
        if (x.length > 0) {
            const children = insertTreeData(i.id, arr)
            if (children.length > 0) {
                i.children = [...children]
            }
        }
        i.key = i.code
        i.value = i.id
        i.title = i.code ? `${i.code}-${i.name}` : i.name
        endArr.push(i)
    })
    return endArr
}
// 递归组装树
function insertData (id, arr) {
    const endArr = []
    const pArr = arr.filter(o => o.parentId === id)
    pArr.forEach(i => {
        const x = arr.filter(o => o.parentId === id)
        if (x.length > 0) {
            i.children = insertData(i.id, arr)
        }
        i.key = i.id
        i.title = i.name
        i.value = i.id
        endArr.push(i)
    })
    return endArr
}
</script>

<!--
 * @Description: 岗位架构
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:25:17
 * @LastEditTime: 2019-08-22 17:22:41
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
          <a-col :sm="8" :md="4" :xl="3">上级岗位</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-tree-select
                :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                :disabled="!isAdd"
                :treeData="treeAllData"
                treeNodeFilterProp="title"
                v-decorator="$check('quarters.parentId', {initialValue:selectedSingleRow.parentId==='0'?'':selectedSingleRow.parentId})"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">岗位编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('quarters.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">岗位名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入岗位名称" v-decorator="$check('quarters.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">隶属机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择隶属机构"
                showSearch
                :filterOption="filterOption"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="$check('quarters.organization', {initialValue:selectedSingleRow.organization})"
                :options="subjectionArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                showSearch
                v-decorator="$check('quarters.chargeUserNo', {initialValue:selectedSingleRow.chargeUserNo})"
                notFoundContent="请输入负责人进行检索"
                placeholder="请输入负责人"
                :filterOption="false"
                @search="getFrincipaArr"
                allowClear>
                <a-select-option v-for="d in principalArr" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">允许审批</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('quarters.isSpecial', {initialValue:selectedSingleRow.isSpecial||0})">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入电话" v-decorator="$check('quarters.telephone', {initialValue:selectedSingleRow.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">传真</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入传真" v-decorator="$check('quarters.fax', {initialValue:selectedSingleRow.fax || ''})"/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('quarters.status', {initialValue:selectedSingleRow.status})" :options="basePostStatus"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">任职资格</a-col>
          <a-col :span="24">
            <a-form-item style="margin-bottom: 0;">
              <a-textarea placeholder="请输入任职资格" :autosize="{minRows: 2,maxRows: 9}" v-decorator="$check('quarters.qualify', {initialValue:selectedSingleRow.qualify || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">主要职责</a-col>
          <a-col :span="24">
            <a-form-item style="margin-bottom: 0;">
              <a-textarea placeholder="请输入主要职责" :autosize="{minRows: 2,maxRows: 9}" v-decorator="$check('quarters.duty', {initialValue:selectedSingleRow.duty || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">辅助职责</a-col>
          <a-col :span="24">
            <a-form-item style="margin-bottom: 0;">
              <a-textarea placeholder="请输入辅助职责" :autosize="{minRows: 2,maxRows: 9}" v-decorator="$check('quarters.auxiliaryDuty', {initialValue:selectedSingleRow.auxiliaryDuty || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">备注</a-col>
          <a-col :span="24">
            <a-form-item style="margin-bottom: 0;">
              <a-textarea placeholder="请输入备注" :autosize="{minRows: 2,maxRows: 9}" v-decorator="$check('quarters.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
  </div>
</template>
<script>
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
export default {
    name: 'QuartersStructure',
    components: { NewTable, SeachBox, HolyGrailLayout, BtModal },
    data () {
        return {
            // 表单
            form: this.$form.createForm(this),
            // 新增/编辑标题
            addEditModalTitle: '',
            // 新增/编辑标识
            addEditModal: false,
            // 加载标识
            loading: false,
            // 树形数据
            treeData: [],
            treeDataSearch: [],
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['add', 'del', 'export'],
            // 工具栏表单数据收集
            seachValue: {},
            // 工具栏表单配置
            conditions: [
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
                    key: 'organization',
                    type: 'select',
                    title: '隶属机构',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'OrganizationGroupFrameworkFind',
                    body: { orderbyField: 'code asc' }
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
                { name: '编辑', action: 'quartersStructure.edit', fc: this.editHandler },
                { name: '详情', action: 'quartersStructure.get', fc: e => this.$refs.newTable.showDetails('岗位架构详情', e) },
                { name: '删除', action: 'quartersStructure.delete', fc: ({ id }) => { this.onDel(id) } }
            ],
            // 隶属机构
            subjectionArr: [],
            // 负责人
            principalArr: [],
            // 状态
            basePostStatus: [],
            // 新增/编辑树形数据
            treeAllData: [],
            expandedKeys: [],
            autoExpandParent: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '352e2ad1f87b4744bb36a53ef2611cc7:quartersStructure'
            this.tableApiPath = 'OrganizationJobFramworkFindAllChildren'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        // 查询树
        this.getTree()
        this.getbasePostStatus()
    },
    methods: {
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        getFrincipaArr (e) {
            if (e === '') return
            if (this.timer) { clearTimeout(this.timer) }
            this.timer = setTimeout(() => {
                this.getPrincipal(e)
            }, 300)
        },
        // 提交
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values = Object.assign(this.selectedSingleRow, { ...values })
                    }
                    axios({
                        path: this.isAdd ? 'OrganizationJobFramworkAdd' : 'OrganizationJobFramworkUpdate',
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
            console.log(row)
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
                this.$refs.newTable.exportFile('OrganizationJobFramworkFindBySelected', this.seachValue)
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            // 查询机构
            this.getSubCompanyArr()
            // 查询负责人
            // this.getPrincipal()
            // 查询状态
            this.getbasePostStatus()
            // 查询上级
            this.getTreeAllData()
            if (index === -1) {
                this.selectedSingleRow = {}
                this.addEditModalTitle = '新增岗位架构信息'
            } else {
                this.addEditModalTitle = '编辑岗位架构信息'
            }
            this.addEditModal = true
        },
        // 表格多选
        tableSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        // 工具栏搜索
        onSeach (e) {
            // this.$delete(this.seachValue, 'parentId')
            e.path = 'OrganizationJobFramworkFindBySelected'
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
                        path: 'OrganizationJobFramworkDel',
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
                path: 'OrganizationJobFramworkFindAllChildren',
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
                path: 'OrganizationJobFramworkFindTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = this.insertData('', res.data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['0']
                }
            })
        },
        // 递归组装树
        insertData (id, arr) {
            const endArr = []
            const pArr = arr.filter(o => o.parentId === id)
            pArr.forEach(i => {
                const x = arr.filter(o => o.parentId === id)
                if (x.length > 0) {
                    i.children = this.insertData(i.id, arr)
                }
                i.key = i.id
                i.title = i.name
                endArr.push(i)
            })
            return endArr
        },
        // 时间禁用
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('minute'))
        },
        // 获取隶属机构
        getSubCompanyArr () {
            axios({
                path: 'OrganizationGroupFrameworkFind',
                method: 'post',
                body: { orderbyField: 'code asc' }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = item.id
                        item.title = `${item.code}-${item.name}`
                        item.value = item.code
                    })
                    this.subjectionArr = [ ...data ]
                }
            })
        },
        // 获取负责人
        getPrincipal (code) {
            axios({
                path: 'PermissionsUserQuery',
                method: 'post',
                body: { code: code, orderbyField: 'code asc' }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = item.id
                        item.title = `${item.code}-${item.name}`
                        item.value = item.code
                    })
                    this.principalArr = [ ...data ]
                }
            })
        },
        // 获取状态
        getbasePostStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'base_post_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = item.id
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.basePostStatus = [ ...data ]
                    if (this.isAdd) {
                        this.selectedSingleRow.status = data[0].value
                    }
                }
            })
        },
        // 新增/编辑上级岗位数据获取
        getTreeAllData () {
            axios({
                path: 'OrganizationJobFramworkFindAllTree',
                method: 'post',
                body: {
                    page: 1,
                    row: 9999
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.treeAllData = initAllTreeData(this.insertData('0', res.data))
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'QuartersStructure') {
                this.getTree()
            }
        }
    }
}
function initAllTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const x = {}
        x.title = `${i.code}-${i.name}`
        x.key = i.code
        x.value = i.id
        if ('children' in i) {
            x.children = initAllTreeData(i.children)
        } else {
            x.isLeaf = true
        }
        newArr.push(x)
    })
    newArr.sort((a, b) => { return a.key - b.key })
    return newArr
}
</script>

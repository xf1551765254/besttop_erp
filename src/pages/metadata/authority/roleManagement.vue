<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:30:26
 * @LastEditTime: 2019-08-22 18:36:46
 -->
<template>
  <div>
    <holy-grail-layout left="500px" style="margin:0px 10px;" :hideClose="true">
      <div slot="left">
        <!-- 工具栏 -->
        <seachBox
          seachTitle="角色筛选"
          :conditions="conditions"
          :btns="btns"
          v-model="seachValue"
          @onReload="onReload"
          @onClick="onSeachClick"
          @onSeach="onSeach"/>
        <NewTable
          :height="leftTableHeight"
          ref="newTable"
          headerTitle="角色管理"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onSelect"
          @onClickChange="onClickRow">
        </NewTable>
      </div>
      <div slot="center" style="margin-right: 10px;">
        <div :style="`height:${tableHeight}px;`">
          <seachBox
            seachTitle="已添加用户筛选"
            :conditions="addedConditions"
            v-model="addedSeachValue"
            @onReload="onAddedReload"
            @onSeach="getAddedUserSeach">
            <a-button
              @click="onAddBtnClick"
              icon="save"
              size="small"
              v-action:add
              type="primary">取消添加</a-button>
          </seachBox>
          <NewTable
            :height="scrollHeight"
            ref="addedUser"
            :headerTitle="`${currentRole} 已添加用户`"
            :tableCode="tableCode1"
            :tableApiPath="tableApiPathAdded"
            :pams="{...addedSeachValue, roleId:clickSingleRow.id}"
            @onSelect="onAddedSelectChange">
          </NewTable>
        </div>
        <div :style="`height:${tableHeight}px;`">
          <seachBox
            seachTitle="未添加用户筛选"
            :conditions="addedConditions"
            v-model="unAddedSeachValue"
            @onReload="onUnAddedReload"
            @onSeach="getUnAddedUserSeach">
            <a-button
              @click="onUnAddBtnClick"
              icon="save"
              size="small"
              v-action:add
              type="primary">添加</a-button>
          </seachBox>
          <NewTable
            :height="scrollHeight"
            ref="unAddedUser"
            :headerTitle="`${currentRole} 未添加用户`"
            :tableCode="tableCode1"
            :tableApiPath="tableApiPathUnAdded"
            :pams="{...unAddedSeachValue, roleId:clickSingleRow.id}"
            @onSelect="onUnAddedSelectChange">
          </NewTable>
        </div>
      </div>
    </holy-grail-layout>
    <!-- 添加/编辑模态框 -->
    <a-modal
      :title="storefrontAddEditModalTitle"
      v-model="storefrontAddEditModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4" v-if="!isAdd">编号</a-col>
          <a-col :span="8" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('rolemanage.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">角色名称</a-col>
          <a-col :span="!isAdd? 8 : 20">
            <a-form-item>
              <a-input placeholder="请输入角色名称" v-decorator="$check('rolemanage.name', {initialValue:selectedSingleRow.name || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 赋权模态框 -->
    <a-modal
      title="赋权"
      :visible="authorizationVisible"
      @ok="authorizationOk"
      :confirmLoading="confirmLoading"
      @cancel="authorizationCancel"
    >
      <a-card hoverable class="action-card">
        <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
        <a-tree
          v-if="treeshow"
          checkable
          v-model="checkedKeys"
          @check="onCheck"
          :loading="treeLoading"
          :treeData="treeData"
        />
      </a-card>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
    .action-card{
        max-height:500px;
        // height:100%;
        overflow:auto;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import is from 'is_js'
import map from 'lodash.map'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'

export default {
    name: 'RoleManagement',
    components: {
        NewTable,
        SeachBox,
        HolyGrailLayout
    },
    data () {
        const self = this
        return {
            tableCode1: '92f9b7042b7b4cf1b724fed7062be844:userManagement',
            tableApiPathAdded: 'PermissionsUserFindUserListByRoleId',
            tableApiPathUnAdded: 'PermissionsUserFindListByRoleId',
            leftTableHeight: (this.$store.getters.windowHeight - 218),
            tableHeight: (this.$store.getters.windowHeight - 140) / 2,
            scrollHeight: (this.$store.getters.windowHeight - 300) / 2,
            treeshow: false,
            tableCode: '',
            tableApiPath: '',
            roleId: '',
            authorizationVisible: false,
            confirmLoading: false,
            treeLoading: true,
            treeData: [],
            checkedKeys: [],
            // 右键编辑菜单集合
            contextmenuArr: [
                {
                    name: '编辑',
                    action: 'roleManagement.edit',
                    fc: this.editHandler
                },
                {
                    name: '删除',
                    action: 'roleManagement.delete',
                    fc: ({ id }) => { this.onDel(id) }
                },
                {
                    name: '赋权',
                    action: 'roleManagement.authorization',
                    fc: record => {
                        self.authorization(record)
                    }
                }
            ],

            // 工具栏按钮集合
            btns: ['add', 'del', 'export'],
            // 工具栏搜索数据收集
            seachValue: {},
            // 工具栏搜索内容配置
            conditions: [
                { title: '角色编号', type: 'input', key: 'code' },
                { title: '角色名称', type: 'input', key: 'name' }
            ],
            // 添加/编辑模态框标题
            storefrontAddEditModalTitle: '',
            // 添加/编辑模态框打开关闭标识
            storefrontAddEditModal: false,
            form: this.$form.createForm(this),
            flag: [],
            loading: false,
            // 添加标识
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            tableSelectRows: [],
            columns: [
                { title: '#', dataIndex: 'bt_index', width: 40 },
                { title: '用户编码', dataIndex: 'code', width: 100 },
                { title: '姓名', dataIndex: 'name', width: 100 },
                { title: '手机号码', dataIndex: 'phone', width: 150 },
                { title: '职务', dataIndex: 'job', width: 100 },
                { title: '用户状态', dataIndex: 'statusConfig', width: 100 },
                { title: '所属机构', dataIndex: 'storeNameConfig' }
                // { title: '操作', key: 'operation', fixed: 'right', width: 80, scopedSlots: { customRender: 'action' } }
            ],
            clickSingleRow: {},
            // 已添加工具栏搜索内容配置
            addedConditions: [
                { title: '#', dataIndex: 'web_index', width: 40 },
                { title: '用户编码', type: 'input', key: 'code' },
                { title: '姓名', type: 'input', key: 'name' },
                { title: '机构', type: 'input', key: 'storeName' },
                { title: '职务', type: 'input', key: 'job' }
            ],
            addedSeachValue: {},
            unAddedSeachValue: {},
            selectedRowKeysAdded: [],
            selectedRowKeysUnAdded: [],
            selectedRowsAdded: [],
            selectedRowsUnAdded: [],
            currentRole: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '7cc4980fec7c40b4a4818d589ea59618:roleManagement'
            this.tableApiPath = 'PermissionsRoleQuery'
            this.$refs.newTable.setContextmenu(this.contextmenuArr)
            this.$refs.addedUser.setTableColumns(this.tableCode1)
            this.$refs.unAddedUser.setTableColumns(this.tableCode1)
        })
    },
    methods: {
        /**
         * @name: 获取权限树数据
         * @msg:
         * @param {type}
         * @return:
         */
        authorization (record) {
            this.treeData.length = 0
            this.checkedKeys.length = 0
            this.treeLoading = true
            this.roleId = record.id
            axios({
                path: 'PermissionsRoleMenuQueryAuthorization',
                method: 'post',
                body: { roleId: record.id }
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = this.initTreeData(res.data)
                    const arr = expandTree(this.treeData)
                    this.checkedKeys = map(arr, 'key')
                    console.log('共', this.checkedKeys.length, '个权限')
                    this.authorizationVisible = true
                    this.treeshow = true
                    this.treeLoading = false
                }
            })
        },
        /**
         * @name: 赋权
         * @msg:
         * @param {type}
         * @return:
         */
        authorizationOk () {
            this.confirmLoading = true
            axios({
                path: 'PermissionsRoleMenuAuthorizationRole',
                method: 'post',
                body: { roleId: this.roleId, menu: this.treeData }
            }).then(res => {
                this.confirmLoading = false
                if (res.flag === 1) {
                    this.treeshow = false
                    this.authorizationVisible = false
                }
            })
        },
        authorizationCancel () {
            this.treeshow = false
            this.authorizationVisible = false
        },
        /**
         * @name: 初始化树数据，遍历， 赋予层级关系key
         * @msg:
         * @param {type}
         * @return:
         */
        initTreeData (data, y = 0) {
            const arr = []
            for (let i = 0; i < data.length; i++) {
                const x = {}
                x.key = `${y}-${i}`
                x.id = data[i].id
                x.isChoose = data[i].isChoose
                if (data[i].isLeaf) {
                    x.isLeaf = data[i].isLeaf
                    x.title = this.$t(`action.${data[i].name}`)
                } else {
                    x.title = this.$t(`menu.${data[i].name}`)
                }
                if ('children' in data[i]) {
                    x.children = this.initTreeData(data[i].children, x.key)
                }
                arr.push(x)
            }
            return arr
        },
        /**
         * @name: 根据复选框，处理数据的ischoose
         * @msg:
         * @param {type}
         * @return:
         */
        chooseCheck (treeData, keys) {
            treeData.forEach(t => {
                if (is.inArray(t.key, keys)) {
                    t.isChoose = 1
                } else {
                    t.isChoose = 0
                }
                if ('children' in t) {
                    this.chooseCheck(t.children, keys)
                }
            })
        },
        /**
         * @name: 复选框改变时，对数据做对应调整
         * @msg:
         * @param {type}
         * @return:
         */
        onCheck (selectedKeys) {
            this.chooseCheck(this.treeData, selectedKeys)
        },
        /**
         * @name: 搜索框搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange () {

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
            e.path = 'PermissionsRoleQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            console.log(row)
            this.selectedSingleRow = { ...row }
            this.addEditRole()
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditRole(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('PermissionsRoleQuery', this.seachValue)
            }
        },
        // 新增/编辑
        addEditRole (index) {
            this.storefrontAddEditModal = true
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增用户角色信息'
            } else {
                this.isAdd = false
                this.storefrontAddEditModalTitle = '编辑用户角色信息'
            }
        },
        // 模态框关闭
        subCancel () {
            this.storefrontAddEditModal = false
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    axios({
                        path: this.isAdd ? 'PermissionsRoleAdd' : 'PermissionsRoleUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.storefrontAddEditModal = false
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            console.log(111)
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
                        path: 'PermissionsRoleDel',
                        method: 'post',
                        body: { ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
        },
        //= =========================================================角色添加用户==========================================================================================
        onClickRow (row) {
            this.currentRole = `${row.code}-${row.name}`
            this.clickSingleRow = { ...row }
            this.$refs.addedUser.setTableData(this.tableCode1, {
                path: 'PermissionsUserFindUserListByRoleId',
                roleId: this.clickSingleRow.id
            })
            this.$refs.unAddedUser.setTableData(this.tableCode1, {
                path: 'PermissionsUserFindListByRoleId',
                roleId: this.clickSingleRow.id
            })
        },
        getAddedUserSeach (e = {}) {
            e.path = 'PermissionsUserFindUserListByRoleId'
            this.$refs.addedUser.setTableData(this.tableCode1, e)
        },
        getUnAddedUserSeach (e = {}) {
            e.path = 'PermissionsUserFindListByRoleId'
            this.$refs.unAddedUser.setTableData(this.tableCode1, e)
        },
        // 已添加用户选中
        onAddedSelectChange (k, r) {
            this.selectedRowKeysAdded = [...k]
            this.selectedRowsAdded = [...r]
        },
        // 未添加用户选中
        onUnAddedSelectChange (k, r) {
            this.selectedRowKeysUnAdded = [...k]
            this.selectedRowsUnAdded = [...r]
        },
        /**
         * @name: 已添加筛选条件清空
         */
        onAddedReload () {
            this.addedSeachValue = {}
        },
        /**
         * @name: 取消添加按钮点击
         */
        onAddBtnClick (e) {
            if (this.selectedRowsAdded.length > 0) {
                const userIds = map(this.selectedRowsAdded, 'id')
                axios({
                    path: 'PermissionsUserRoleDelBatch',
                    method: 'post',
                    body: {
                        roleId: this.clickSingleRow.id,
                        userIds
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.getAddedUserSeach()
                        this.getUnAddedUserSeach()
                    }
                })
            } else {
                this.$message.warning('您尚未选中任何数据！')
            }
        },
        /**
         * @name: 未添加筛选条件清空
         */
        onUnAddedReload () {
            this.unAddedSeachValue = {}
        },
        /**
         * @name: 添加按钮点击
         */
        onUnAddBtnClick () {
            if (this.selectedRowsUnAdded.length > 0) {
                const userIds = map(this.selectedRowsUnAdded, 'id')
                axios({
                    path: 'PermissionsUserRoleAddBatch',
                    method: 'post',
                    body: {
                        roleId: this.clickSingleRow.id,
                        userIds
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.getAddedUserSeach()
                        this.getUnAddedUserSeach()
                    }
                })
            } else {
                this.$message.warning('您尚未选中任何数据！')
            }
        }
    }
}
/**
 * @name: 计算并过滤需要默认选中的节点
 * @msg:
 * @param {type}
 * @return:
 */
function expandTree (treeData, arr = []) {
    treeData.forEach(T => {
        if (T.children && T.children.length > 0) {
            expandTree(T.children, arr)
        } else {
            if (T.isLeaf && T.isChoose === 1) {
                arr.push(T)
            }
        }
    })
    return arr
}
</script>

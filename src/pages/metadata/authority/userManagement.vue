<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:30:06
 * @LastEditTime: 2019-08-22 17:21:20
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
    <!-- 数据表格 -->
    <holy-grail-tree @onTreeSelect="onTreeSelect">
      <div slot="table">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onSelect">
        </NewTable>
      </div>
    </holy-grail-tree>
    <!-- 新增/编辑模态框 -->
    <bt-modal
      :title="storefrontAddEditModalTitle"
      v-model="storefrontAddEditModal"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="4" v-if="!isAdd">用户编码</a-col>
          <a-col :sm="16" :md="8" :xl="8" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('user.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">姓名</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入姓名" v-decorator="$check('user.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">性别</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-radio-group
                v-decorator="$check('user.gender', {initialValue:selectedSingleRow.gender||1})">
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">所属机构</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select
                :filterOption="filterOption"
                showSearch
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="$check('user.storeId', {initialValue:selectedSingleRow.storeId || ''})"
                :options="subStores"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">职务</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入职务" v-decorator="$check('user.job', {initialValue:selectedSingleRow.job || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">生日</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-date-picker style="width:100%" v-decorator="$check('user.birthday', {initialValue:selectedSingleRow.birthday})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">固话</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入固话" v-decorator="$check('user.telephone', {initialValue:selectedSingleRow.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">手机</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入手机" v-decorator="$check('user.phone', {initialValue:selectedSingleRow.phone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">卡号</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入卡号" v-decorator="$check('user.cardNo', {initialValue:selectedSingleRow.cardNo || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">电子邮件地址</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入电子邮件地址" v-decorator="$check('user.email', {initialValue:selectedSingleRow.email || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">计算机物理地址</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入计算机物理地址" v-decorator="$check('user.macId', {initialValue:selectedSingleRow.macId || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">进入系统标志</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('user.isAllowLogin', {initialValue:selectedSingleRow.isAllowLogin || ''})" :options="joinSysFlags"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">用户状态</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('user.status', {initialValue:selectedSingleRow.status || ''})" :options="statusArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">登录类型</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('user.loginType', {initialValue:selectedSingleRow.loginType || ''})" :options="loginTypeArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">移动端角色</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" mode="multiple" :maxTagCount="2" v-decorator="$check('user.type', {initialValue:selectedSingleRow.type})" :options="userTypeArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">用户角色</a-col>
          <a-col :sm="16" :md="isAdd?20:8" :xl="isAdd?20:8">
            <a-form-item>
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                mode="multiple"
                v-decorator="$check('user.roleIds', {initialValue:selectedSingleRow.roleIds || []})"
                :options="rolesArr"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 修改密码模态框 -->
    <a-modal
      title="重置密码"
      v-model="resetPasswordModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="600"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="psdloading" @click="handleResetPsd">
          确定
        </a-button>
      </template>
      <a-form :form="psdForm">
        <a-row class="doc">
          <a-col :span="4">用户名称</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input v-decorator="$check('resetpsd.id',{initialValue:selectedRow.id})" v-show="false"/>
              <a-input v-decorator="$check('resetpsd.name',{initialValue:selectedRow.name})" disabled />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="4">新密码</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input type="password" placeholder="请输入新密码" v-decorator="$check('user.passwordNew',{},validateToNextPassword)"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">确认密码</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input type="password" placeholder="请输入确认密码" v-decorator="$check('base.password',{},compareToFirstPassword)"/>
            </a-form-item>
          </a-col> -->
          <!-- <a-col :span="4">密码类型</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('resetpsd.type', {initialValue:1})">
                <a-radio :value="1">
                  登陆密码
                </a-radio>
                <a-radio :value="2">
                  工作密码
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
          <a-col :span="4">默认密码</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input v-decorator="$check('base.password',{initialValue:'123456'})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 盘点赋权模态框 -->
    <a-modal
      :title="setStockakModalTitle"
      v-model="setStockakModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="400"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button @click="subCancel">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="handleSetStock">
          确定
        </a-button>
      </template>
      <a-row class="doc">
        <a-col >
          <a-radio-group
            :options="[{label:'普通用户',value:'user'},{label:'管理员',value:'admin'},{label:'抽盘',value:'check'}]"
            v-model="userStocktak"/>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import md5 from 'md5'
import BtModal from '@comp/Modal'
import HolyGrailTree from '../tools/HolyGrailTree'
export default {
    name: 'Usermanagement',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        HolyGrailTree
    },
    data: function () {
        return {
            tableCode: '',
            tableApiPath: '',
            // 表格右键操作集合
            menuOpt: [
                { name: '编辑', action: 'userManagement.edit', fc: this.editHandler },
                { name: '详情', action: 'userManagement.get', fc: e => this.$refs.newTable.showDetails('用户管理详情', e) },
                { name: '删除', action: 'userManagement.delete', fc: ({ id }) => { this.onDel(id) } },
                { name: '重置密码', action: 'userManagement.edit', fc: this.chanagPasswordHandler }
            ],
            // 工具栏按钮组
            btns: ['add', 'del', 'export'],
            // 工具栏表单搜索内容对象
            seachValue: {},
            // 工具栏搜索表单配置
            conditions: [
                { title: '用户编号', type: 'input', key: 'code' },
                { title: '姓名', type: 'input', key: 'name' },
                { title: '机构',
                    type: 'select',
                    key: 'storeId',
                    path: 'OrganizationStoreFind',
                    label: ['code', 'name'],
                    value: 'id',
                    filter: true
                }
            ],
            // 新增/编辑模态框标题
            storefrontAddEditModalTitle: '',
            // 新增/编辑模态框打开关闭标识
            storefrontAddEditModal: false,
            // 修改密码模态框打开关闭标识
            resetPasswordModal: false,
            // 用户盘点赋权模态框标题
            setStockakModalTitle: '盘点赋权',
            // 用户盘点赋权打开关闭标识
            setStockakModal: false,
            // 新增/编辑模态框分店下拉框数据
            subStores: [],
            // 新增/编辑模态框进入系统标志下拉框数据
            joinSysFlags: [],
            // 新增/编辑模态框用户状态下拉框数据
            statusArr: [],
            // 新增/编辑模态框登陆类型下拉框数据
            loginTypeArr: [],
            // 用户类型下拉数据
            userTypeArr: [],
            //  新增/编辑模态框用户角色下拉框数据
            rolesArr: [],
            // 新增/编辑表单
            form: this.$form.createForm(this),
            // 修改密码表单
            psdForm: this.$form.createForm(this),
            // loading标识
            loading: false,
            // 是否为添加操作标识
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除
            tableSelectRows: [],
            // 用户盘点权限
            userStocktak: '',
            selectedRow: {},
            psdloading: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '92f9b7042b7b4cf1b724fed7062be844:userManagement'
            this.tableApiPath = 'PermissionsUserQuery'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        if (this.$store.getters.system.indexOf('stocktaking') >= 0) {
            this.menuOpt.push({ name: '盘点赋权', action: 'userManagement.authorization', fc: this.setStocktakPerHandler })
        }
    },
    methods: {
        // validateToNextPassword  (rule, value, callback) {
        //     const regex = /^[a-zA-Z0-9]{5,20}$/
        //     if (value && regex.test(value)) {
        //         callback()
        //     } else {
        //         callback(new Error('密码为5-20位数字或字母'))
        //     }
        // },
        // compareToFirstPassword  (rule, value, callback) {
        //     if (!value || value !== this.psdForm.getFieldValue('passwordNew')) {
        //         callback(new Error('两次密码不一致'))
        //     } else {
        //         callback()
        //     }
        // },
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
            e.path = 'PermissionsUserQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        // 分店搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
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
                this.$refs.newTable.exportFile('PermissionsUserQuery', this.seachValue)
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getSubStores()
            this.getConfig()
            this.getRoles()
            if (index === -1) {
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增用户管理信息'
            } else {
                this.storefrontAddEditModalTitle = '编辑用户管理信息'
            }
            this.storefrontAddEditModal = true
        },
        /**
         * @name:新增/编辑分店下拉框数据请求
         */
        getSubStores () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item) => {
                        item.key = item.id
                        item.title = `${item.code}-${item.name}`
                        item.value = item.id
                    })
                    this.subStores = [...data]
                }
            })
        },
        /**
         * @name: 请求系统参数数据
         */
        getConfig () {
            axios({
                path: 'OrganizationConfigFindByTypes',
                method: 'post',
                body: {
                    types: ['base_user_status', 'base_user_login_type', 'sys_user_is_allow_login', 'sys_user_type']
                }
            }).then(res => {
                if (res.flag === 1) {
                    const statusData = res.data.base_user_status
                    const loginData = res.data.base_user_login_type
                    const flagData = res.data.sys_user_is_allow_login
                    const userData = res.data.sys_user_type
                    statusData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    loginData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    flagData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    userData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.statusArr = [...statusData]
                    this.loginTypeArr = [...loginData]
                    this.joinSysFlags = [...flagData]
                    this.userTypeArr = [...userData]
                    if (this.isAdd) {
                        this.selectedSingleRow.isAllowLogin = flagData[0].value
                        this.selectedSingleRow.status = statusData[0].value
                        this.selectedSingleRow.loginType = loginData[0].value
                        this.selectedSingleRow.type = [userData[0].value]
                    }
                }
            })
        },
        /**
         * @name: 新增/编辑用户角色下拉框数据请求
         */
        getRoles () {
            axios({
                path: 'PermissionsRoleQuery',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item) => {
                        item.key = item.id
                        item.title = item.name
                        item.value = item.id
                    })
                    this.rolesArr = [...data]
                }
            })
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.isAdd = false
            this.selectedSingleRow = { ...row }
            this.selectedSingleRow.type = this.selectedSingleRow.type ? this.selectedSingleRow.type.split(',') : []
            this.selectedSingleRow.birthday = this.selectedSingleRow.birthday && moment(this.selectedSingleRow.birthday, 'YYYY-MM-DD')
            this.addEditStorefront()
        },
        /**
         * @name: 表格右键修改密码监听
         */
        chanagPasswordHandler (row) {
            this.selectedRow = { ...row }
            this.resetPasswordModal = true
        },
        /**
         * @name: 表格右键盘点赋权监听
         */
        setStocktakPerHandler (row) {
            this.selectedSingleRow = { ...row }
            this.userStocktak = this.selectedSingleRow.stocktakeLimit || 'user'
            this.setStockakModal = true
        },
        /**
         * @name: 单项删除和多项删除
         */
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
                        path: 'PermissionsUserDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
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
                    values.type = values.type && values.type.join(',')
                    values.birthday = values.birthday && values.birthday.startOf('days').format('YYYY-MM-DD')
                    axios({
                        path: this.isAdd ? 'PermissionsUserAdd' : 'PermissionsUserUpdate',
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
        handleResetPsd (e) {
            e.preventDefault() // 防止事件穿透
            const { psdForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.psdloading = true
                    const params = { }
                    params.id = values.id
                    // if (values.type === 1) {
                    params.password = md5(values.password)
                    // } else {
                    // params.passwordWork = md5(values.password)
                    // }
                    axios({
                        path: 'PermissionsUserResetPwd',
                        method: 'post',
                        body: params
                    }).then(res => {
                        if (res.flag === 1) {
                            this.resetPasswordModal = false
                        }
                        this.psdloading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        handleSetStock (e) {
            e.preventDefault() // 防止事件穿透
            if (this.userStocktak === '') {
                this.$message.warning('请选择权限类型')
                return false
            } else {
                this.loading = true
                axios({
                    path: 'PermissionsUserUpdateWechatPermission',
                    method: 'post',
                    body: {
                        id: this.selectedSingleRow.id,
                        condition: this.userStocktak
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.setStockakModal = false
                        this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                    }
                    this.loading = false
                })
            }
        },
        // 模态框关闭
        subCancel () {
            this.resetPasswordModal = false
            this.setStockakModal = false
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onTreeSelect (code) {
            this.$set(this.seachValue, 'organize', code)
            this.$refs.newTable.setTableData(this.tableCode, {
                path: 'PermissionsUserQuery',
                organize: code
            })
        }
    }
}
</script>

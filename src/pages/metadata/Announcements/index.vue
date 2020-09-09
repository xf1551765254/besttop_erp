<template>
  <div>
    <seachBox
      @onSeach="onSeach"
      :btns="btns"
      v-model="searchParams"
      @onReload="onReload"
      @onClick="openAddModal"
      :conditions="conditions" />
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
    />
    <a-modal
      destroyOnClose
      :getContainer="getContainer"
      title="新增公告"
      :confirmLoading="addLoading"
      @ok="submit"
      v-model="showAddModal">
      <a-form :form="form">
        <a-form-item
          label="标题"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }" >
          <a-input v-decorator="[ 'name', { rules: [ { required: true, message: '请输入标题' } ] } ]" />
        </a-form-item>
        <a-form-item
          label="内容"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }" >
          <Editor v-decorator="[ 'content', { rules: [ { required: true, message: '请输入内容！'} ] } ]" />
        </a-form-item>
        <a-form-item
          label="封面图片"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }" >
          <Upload
            :fileLength="['封面']"
            :fileList="fileList"
            @uploadFileList="uploadFileList"
          />
        </a-form-item>
        <a-form-item
          label="用户范围"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }" >
          <div>
            <a-radio-group v-model="rangeType">
              <a-radio value="sys_notice_range:1">全部用户</a-radio>
              <a-radio value="sys_notice_range:2">角色用户</a-radio>
            </a-radio-group>
            <a-select
              v-decorator="[ 'role', { rules: [ { required: true, message: '请选择角色' } ] } ]"
              v-if="rangeType === 'sys_notice_range:2'"
              mode="multiple"
              placeholder="请选择角色"
              @change="onChange"
              @select="onRoleSelected"
              style="width:auto;min-width:250px" >
              <a-select-option
                v-for="item in roleList"
                :key="item.id"
                :value="item.id" >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 5, span: 15 }">
          <a-table
            size="small"
            :pagination="false"
            rowKey="code"
            :loading="loading"
            :rowSelection="rowSelection"
            v-if="rangeType === 'sys_notice_range:2'"
            :columns="columns"
            :dataSource="userList" />
        </a-form-item>
      </a-form>

    </a-modal>
    <a-modal :getContainer="getContainer" :footer="null" title="公告预览" v-model="showPreview" >
      <a-form-item
        label="标题"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 17 }" >
        {{ currentRow.name }}
      </a-form-item>
      <a-form-item
        label="内容"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 17 }" >
        <div v-html="currentRow.content" ></div>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script>

import NewTable from '@comp/newTable'
import Editor from '@comp/editor/editor'
import Upload from '@comp/upload'
import SeachBox from '@comp/seachBox'

import { axios } from '@/utils/request'
export default {
    components: { NewTable, Editor, Upload, SeachBox },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd179968382bf40dca1405e2f709a9e13:Announcements'
            this.tableApiPath = 'SysNoticeFindBySelected'
            this.$refs.newTable.setContextmenu([
                { name: '预览', fc: this.queryNoticeDetails, action: 'storefrontInformation.edit' }
            ])
        })
    },
    created () {
        this.getRoleList()
    },
    data () {
        return {
            searchParams: {},
            btns: ['add', 'query'],
            addLoading: false,
            showAddModal: false,
            loading: false,
            showPreview: false,
            rangeType: 'sys_notice_range:1',
            form: this.$form.createForm(this),
            currentRow: {},
            fileList: [],
            roleList: [],
            selectedRowKeys: [],
            selectedRoleIds: [],
            tableCode: '',
            tableApiPath: '',
            columns: [
                { title: '用户编码', dataIndex: 'code' },
                { title: '用户姓名', dataIndex: 'key' },
                { title: '职务', dataIndex: 'name' },
                { title: '所属机构', dataIndex: 'storeNameConfig' },
                { title: '手机号', dataIndex: 'phone' }
            ],
            conditions: [
                { title: '标题', type: 'input', key: 'name' },
                { title: '发布人', type: 'input', key: 'createBy' },
                { title: '用户范围',
                    type: 'select',
                    key: 'rangeType',
                    filter: false,
                    value: 'value',
                    label: 'label',
                    selectDataArr: [
                        { label: '全部用户', value: 'sys_notice_range:1' },
                        { label: '角色用户', value: 'sys_notice_range:2' }
                    ]
                }
            ]
        }
    },
    computed: {
        rowSelection () {
            const { selectedRowKeys } = this
            return {
                selectedRowKeys,
                onChange: (keys) => {
                    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
                    this.selectedRowKeys = keys
                }
            }
        },
        userList () {
            let list = []
            const keys = []
            this.roleList.forEach(v => {
                if (this.selectedRoleIds.includes(v.id)) {
                    list = [...list, ...(v.userList || [])]
                }
            })
            list = list.filter(v => {
                if (!keys.includes(v.code)) {
                    keys.push(v.code)
                    return true
                } else {
                    return false
                }
            })
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.selectedRowKeys = keys
            return list
        }
    },
    methods: {
        onReload () {
            this.searchParams = {}
        },
        onSeach (params) {
            this.$refs.newTable.setTableData(this.tableCode, {
                path: this.tableApiPath,
                ...params
            })
        },
        getContainer (el) {
            return this.$el
        },
        queryNoticeDetails (row) {
            this.currentRow = row
            this.showPreview = true
            axios({ path: 'SysNoticeFindById', body: { id: row.id } }).then(({ data }) => {
                this.currentRow.content = data.content
            })
        },
        submit () {
            const { form, rangeType, selectedRowKeys, fileList } = this
            form.validateFields((err, { role, ...parmas }) => {
                if (!err) {
                    this.addLoading = true
                    const body = {
                        rangeType,
                        pic: (fileList[0] || {}).fileUrl,
                        ...parmas
                    }
                    if (rangeType === 'sys_notice_range:2') {
                        body.receiveList = selectedRowKeys.map(code => ({ receiveCode: code }))
                    }
                    axios({ body, path: 'SysNoticeAdd' })
                        .finally(() => { this.addLoading = false })
                        .then(({ flag }) => {
                            if (flag) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.showAddModal = false
                            }
                        })
                }
            })
        },
        onChange (keys) {
            this.selectedRoleIds = keys
        },
        onRoleSelected (id, node) {
            this.roleList.find(v => {
                if (v.id === id) {
                    // 判断当前角色是否已请求过数据
                    if (v.userList) return true // 若数据存在 跳出循环
                    // 不存在 则请求角色拥有的用户 并绑定到当前项
                    this.getUserList(id).then(list => this.$set(v, 'userList', list))
                    return true
                }
                return false
            })
        },
        getRoleList () {
            axios({ path: 'PermissionsRoleQuery' }).then(res => {
                if (res.flag === 1) {
                    this.roleList = res.data.list
                }
            })
        },
        getUserList (roleId) {
            const body = {
                roleId,
                'reinforcedFilter': [],
                'orderbyField': 'code asc '
            }
            this.loading = true
            return axios({ path: 'PermissionsUserFindUserListByRoleId', body }).then(res => {
                this.loading = false
                return res.data.list
            })
        },
        uploadFileList (fileList) {
            this.fileList = fileList
        },
        openAddModal (name) {
            if (name === 'add') {
                this.showAddModal = true
            }
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal{
    width:60vw!important;
}
/deep/ .ant-modal-body{
    max-height: 70vh;
    overflow: scroll
}
/deep/.ant-table-body {
  margin: 0 !important;
}
/deep/ .ant-table table {
  text-align: center;
}
/deep/.ql-container {
  height: 300px;
  overflow: scroll;
}
form {
  background: #fff;
  padding: 30px 0;
}
/deep/.quill-editor {
  padding: 0;
  overflow: hidden;
  height: 400px !important;
}
/deep/.ql-toolbar {
  margin-top: -15px;
  // padding-top: 0
}
</style>

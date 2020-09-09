<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-27 09:14:39
 -->
<template>
  <div>
    <a-row :gutter="10">
      <a-col :span="8">
        <a-card title="页面" hoverable class="action-card">
          <AddMenuItem @succ="getTree" />
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <LeftTree
            :treeData="treeData"
            :loading="loading"
            @select="onSelect"
            @reload="getTree"
          />
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card title="功能" hoverable class="action-card">
          <a-button class="editable-add-btn" @click="handleAdd" :disabled="disabledAdd">新增</a-button>
          <a-button class="editable-add-btn" style="margin-left:20px" type="primary" @click="handleSub" :disabled="disabledSub">提交</a-button>
          <a-icon :type="icon?'check-circle':'close-circle'" theme="filled" :style="`margin-left:20px;fontSize:20px;color:${icon?'#43c731':'#f36c6c'};`"/>
          <a-table
            style="margin-top:20px"
            bordered
            :dataSource="actionList"
            :columns="columns"
            :scroll="{ x: '100%'}"
            size="small"
            rowKey="menuUrl">
            <template slot="apiPaths" slot-scope="text">
              <a-tooltip placement="top">
                <template slot="title">
                  <a-row v-for="(item, index) in text" :key="index">
                    <span>{{ `${index+1} - ${item}` }}</span>
                  </a-row>
                </template>
                <span>{{ getText(text) }}</span>
              </a-tooltip>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a style="margin-right:20px;" @click="onEdit(record)">编辑</a>
              <a-popconfirm
                v-if="actionList.length"
                title="确认删除?"
                @confirm="() => onDelete(record.menuUrl)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-modal
      title="配置功能并关联接口"
      v-model="visible"
      @ok="handleOk"
      :destroyOnClose="true"
      :maskClosable="false"
    >
      <a-select
        style="width: 100%"
        @change="actionChange"
        :value="selectedItemsAction"
        placeholder="请选择功能"
        :disabled="!isAdd"
        allowClear>
        <a-select-option v-for="(item, index) in getAction" :key="index" :value="item.action">{{ item.actionName }}</a-select-option>
      </a-select>
      <a-select
        mode="multiple"
        style="width: 100%;margin-top:20px;"
        @change="apiChange"
        :value="selectedItemsApi"
        placeholder="请粘贴你用到的接口，若存在则失焦后自动出现"
        :open="false"
        allowClear>
        <a-select-option v-for="(item, index) in apis" :key="index" :value="item">{{ item }}</a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    .action-card{
        max-height:720px;
        // height:100%;
        overflow:auto;
    }
</style>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
import keyby from 'lodash.keyby'
import AddMenuItem from './AddMenuItem'
import LeftTree from './LeftTree'
export default {
    name: 'Center',
    components: {
        AddMenuItem,
        LeftTree
    },
    data () {
        return {
            visible: false,
            icon: true,
            loading: true,
            treeData: [],
            actionList: [],
            columns: [{
                title: 'action',
                dataIndex: 'menuUrl',
                width: 100
            }, {
                title: '名称',
                dataIndex: 'menuName',
                width: 100
            }, {
                title: 'API',
                dataIndex: 'apiPaths',
                scopedSlots: { customRender: 'apiPaths' }
            }, {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 100,
                scopedSlots: { customRender: 'operation' }
            }],
            actions: [
                { action: 'add', actionName: '增加', disabled: false },
                { action: 'edit', actionName: '编辑', disabled: false },
                { action: 'update', actionName: '变更', disabled: false },
                { action: 'delete', actionName: '删除', disabled: false },
                { action: 'query', actionName: '查询', disabled: false },
                { action: 'get', actionName: '详情', disabled: false },
                { action: 'verify', actionName: '审核', disabled: false },
                { action: 'approve', actionName: '审批', disabled: false },
                { action: 'confirm', actionName: '确认', disabled: false },
                { action: 'cancel', actionName: '取消', disabled: false },
                { action: 'stop', actionName: '终止', disabled: false },
                { action: 'unauthorization', actionName: '免权', disabled: false },
                { action: 'authorization', actionName: '赋权', disabled: false },
                { action: 'enable', actionName: '启用', disabled: false },
                { action: 'disable', actionName: '禁用', disabled: false },
                { action: 'import', actionName: '导入', disabled: false },
                { action: 'export', actionName: '导出', disabled: false },
                { action: 'print', actionName: '打印', disabled: false },
                { action: 'copy', actionName: '复制', disabled: false },
                { action: 'recover', actionName: '删除恢复', disabled: false }
            ],
            apis: [],
            action: {},
            code: null,
            disabledAdd: true,
            disabledSub: true,
            selectedItemsAction: undefined,
            selectedItemsApi: undefined,
            isAdd: true,
            sysType: ''

        }
    },
    computed: {
        getAction () {
            const keys = keyby(this.actionList, 'menuUrl')
            return this.actions.filter(o => !(o.action in keys))
        }
    },
    mounted () {
        this.getTree()
        this.getApi()
    },
    methods: {
        getText (t) {
            return t.length > 0 ? (t.join(',').substring(0, 40) + '...') : '无'
        },
        handleSub () {
            axios({
                path: 'ActionMenuFunctionAddAction',
                method: 'post',
                body: { parentCode: this.code, actionMenus: this.actionList, sysType: this.sysType }
            }).then(res => {
                if (res.flag === 1) {
                    this.icon = true
                }
            })
        },
        apiChange (value) {
            this.action.api = value
            this.selectedItemsApi = value
        },
        actionChange (value) {
            const action = this.action
            this.action = Object.assign(action, this.actions.find(item => {
                if (item.action === value) {
                    return item
                }
            }))

            this.selectedItemsAction = value
        },
        onEdit ({ menuUrl, menuName, apiPaths }) {
            this.action.api = apiPaths
            this.selectedItemsApi = apiPaths
            this.selectedItemsAction = menuUrl
            const action = this.action
            this.action = Object.assign(action, this.actions.find(item => {
                if (item.action === menuUrl) {
                    return item
                }
            }))
            this.isAdd = false
            this.visible = true
        },
        onDelete (menuUrl) {
            const actionList = [...this.actionList]
            this.actionList = actionList.filter(item => item.menuUrl !== menuUrl)
            this.icon = false
            this.disabledSub = false
        },
        handleAdd () {
            this.selectedItemsAction = undefined
            this.selectedItemsApi = undefined
            this.isAdd = true
            this.visible = true
        },
        handleOk () {
            const keys = Object.keys(this.action)
            if (is.not.inArray('action', keys) || is.not.inArray('actionName', keys)) {
                this.$message.error('你还没有选择功能')
                return
            }
            if (is.not.inArray('api', keys) || this.action.api.length === 0) {
                this.$message.error('你还没有选择API')
                return
            }
            if (this.isAdd) {
                this.actionList.push({
                    menuUrl: this.action.action,
                    menuName: this.action.actionName,
                    apiPaths: this.action.api
                })
            } else {
                const x = this.actionList.find(o => (o.menuUrl === this.action.action))
                x.apiPaths = this.action.api
            }
            this.icon = false
            this.disabledSub = false
            this.visible = false
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keys, e) {
            this.action = {}
            if (e.selectedNodes.length > 0 && e.selectedNodes[0].data.props.isLeaf) {
                this.sysType = e.selectedNodes[0].data.props.sysType
                this.code = e.selectedNodes[0].data.props.code
                axios({
                    path: 'ActionMenuFunctionFindActionByMenu',
                    method: 'post',
                    body: { code: this.code }
                }).then(res => {
                    if (res.flag === 1) {
                        this.actionList = res.data.actionMenus
                        this.disabledAdd = false
                        this.icon = true
                        if (this.actionList.length === 0) {
                            this.disabledSub = true
                        }
                    }
                })
            } else {
                this.code = null
                this.disabledAdd = true
                this.disabledSub = true
                this.actionList.length = 0
            }
        },
        onChange (e) {
            console.log(e.target.value)
        },
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'ActionMenuFunctionFindAllMenu',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = this.initTreeData(res.data)
                    this.loading = false
                    console.log(this.treeData)
                }
            })
        },

        /**
         * @name: 初始化树数据，遍历
         * @msg:
         * @param {type}
         * @return:
         */
        initTreeData (data) {
            const arr = []
            data.forEach(i => {
                const x = {}
                x.key = i.index
                x.title = this.$t(`menu.${i.key}`)
                if (i.isLeaf) {
                    x.isLeaf = true
                    x.code = i.code
                    x.sysType = i.sysType
                }
                if ('children' in i) {
                    x.children = this.initTreeData(i.children)
                }
                arr.push(x)
            })
            return arr
        },
        /**
         * @name: 获取所有api
         * @msg:
         * @param {type}
         * @return:
         */
        getApi () {
            axios({
                path: 'ActionMenuFunctionFindAllApi',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.apis = res.data
                }
            })
        },
        getSystem () {
            axios({
                path: 'ActionMenuFunctionFindSysList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.systemArr = res.data
                }
            })
        }
    }
}
</script>

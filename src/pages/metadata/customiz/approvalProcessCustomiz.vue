<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:32:22
 * @LastEditTime: 2019-08-22 18:08:42
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
      @onSeach="onSeach">
      <a-button
        type="primary"
        size="small"
        icon="setting"
        v-action:add
        @click="onSettingAction"
      >配置</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      :pams="seachValue"
      @onSelect="onSelect">
    </NewTable>
    <!-- 添加/编辑模态框 -->
    <a-modal
      :title="addEditModalTitle"
      v-model="addEditModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="900"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">审批对象</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-tree-select
                :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                :disabled="!isAdd"
                :treeData="actionArr"
                treeNodeFilterProp="title"
                v-decorator="$check('approval.actionCode', {initialValue:selectedSingleRow.actionCode?`${selectedSingleRow.actionCode}-${selectedSingleRow.menuCode}`:''})"
                showSearch
                @change="onTreeChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">流程名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入流程名称" v-decorator="$check('approval.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">时间范围</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-range-picker format="YYYY年MM月DD日" :disabledDate="disabledStartDate" v-decorator="$check('approval.datatime', {initialValue:selectedSingleRow.datatime || defaultdatatime})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">机构信息</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-tree-select
                :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                :disabled="!isAdd"
                :treeData="treeAllData"
                treeNodeFilterProp="title"
                v-decorator="$check('approval.storeCode', {initialValue:selectedSingleRow.storeCode})"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">是否启用</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-radio-group :disabled="!isAdd" v-decorator="$check('approval.status', {initialValue:selectedSingleRow.status})">
                <a-radio v-for="i in statusTypeArr" :key="i.key" :value="i.value">{{ i.title }}</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">推送方式</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-checkbox-group v-decorator="$check('approval.pushType',{initialValue:selectedSingleRow.pushType})">
                <a-checkbox v-for="i in pushTypeArr" :key="i.key" :value="i.value">{{ i.title }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24" style="border-right: 1px solid #e8e8e8;">
            <div class="approval-box">
              <div class="approval-title">
                <span>审批流程</span>
              </div>
              <div class="approval-sub-box">
                <div class="detailBox" style="background-color: #bfbfbf3d;">
                  <div style="border-bottom: 1px solid #d9d9d9">
                    <div class="detailBox-item">部门负责人</div>
                  </div>
                  <div class="detailBox-item">审批：1人</div>
                </div>
                <div v-for="(item, index) in approvalFlowList" :key="index" style="display: flex; align-items: center;">
                  <div class="approval-icon">
                    <a-icon type="arrow-right"/>
                  </div>
                  <div class="detailBox" >
                    <div style="border-bottom: 1px solid #d9d9d9;position: relative;">
                      <div class="detailBox-item">{{ item.nodeName }}</div>
                      <div class="detailBox-icon" @click="deleteNode(item)"><a-icon type="close"></a-icon></div>
                    </div>
                    <div @click="showNodeDetail(item)">
                      <div class="detailBox-item">
                        审批：<span>{{ item.approveRole.length>0 ? `${item.approveRole.length}角色  `: '' }}</span>
                        <span>{{ item.approveUser.length>0 ? `${item.approveUser.length}人`: '' }}</span>
                      </div>
                      <div class="detailBox-item" v-if="item.readRole.length>0 || item.readUser.length>0">
                        阅办：<span>{{ item.readRole.length>0 ? `${item.readRole.length}角色  `: '' }}</span>
                        <span>{{ item.readUser.length>0 ? `${item.readUser.length}人`: '' }}</span></div>
                    </div>
                  </div>
                </div>
                <div class="approval-icon" @click="editNodeModal">
                  <a-icon type="plus"/>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="4">抄送人</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-select
                placeholder="请选择用户"
                style="width:85%"
                ref="userRef"
                mode="multiple"
                :maxTagCount="2"
                :options="carbonArr"
                :open="false"
                @focus="usersAdd"
                v-model="carbonSelectArr"
                allowClear
              />
              <a href="javascript:;" @click="usersAdd">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('approval.note', {initialValue:selectedSingleRow.note || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <users
        :visible.sync="usersVisible"
        @onSelect="onUsersSelect"
        :disArr="disArr"
        :defaultSelect="carbonSelectArr"/>
    </a-modal>
    <a-modal
      :visible="nodeModal"
      title="审批流程节点"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="680"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="nodeCancel">关闭</a-button>
        <a-button key="submit" type="primary" @click="nodeOk">确定</a-button>
      </template>
      <a-row class="doc">
        <a-row>
          <a-col :span="4">节点名称</a-col>
          <a-col :span="20">
            <a-input v-model="nodeObj.nodeName" />
          </a-col>
        </a-row>
        <div class="node-title">设置可选审批人</div>
        <a-row>
          <a-col :span="4">添加角色</a-col>
          <a-col :span="20">
            <a-select
              showSearch
              :filterOption="filterOption"
              placeholder="请选择角色"
              style="width:100%;"
              mode="multiple"
              :maxTagCount="4"
              v-model="nodeObj.approveRole"
              :options="rolesArr"
              allowClear/>
          </a-col>
          <a-col :span="4">添加指定成员</a-col>
          <a-col :span="20">
            <div class="user-box" @click="approveUserAdd">
              <ul v-if="nodeObj.approveUser">
                <li v-for="(item,index) in nodeObj.approveUser" :key="index" v-show="index < 3">
                  <div>{{ `${item.code}-${item.name}` }}</div>
                </li>
                <li v-if="nodeObj.approveUser.length > 3"><div>...</div></li>
              </ul>
            </div>
            <a href="javascript:;" @click="approveUserAdd">
              <a-icon style="width:10%;line-height:36px;" type="edit" />
            </a>
          </a-col>
          <a-col :span="4">设置功能</a-col>
          <a-col :span="20">
            <a-checkbox-group v-model="nodeObj.funKey" @change="checkboxChange">
              <a-checkbox v-for="(item) in funKeyArr" :key="item.key" :value="item.value">{{ item.title }}</a-checkbox>
            </a-checkbox-group>
          </a-col>
        </a-row>
        <div class="node-title" v-show="nodeObj.funKey&&nodeObj.funKey.indexOf('approval_fun_key:4')!=-1">设置可选阅办人</div>
        <a-row v-show="nodeObj.funKey&&nodeObj.funKey.indexOf('approval_fun_key:4')!=-1">
          <a-col :span="4">添加角色</a-col>
          <a-col :span="20">
            <a-select
              showSearch
              :filterOption="filterOption"
              placeholder="请选择角色"
              style="width:100%;"
              mode="multiple"
              :maxTagCount="4"
              v-model="nodeObj.readRole"
              :options="rolesArr"
              allowClear/>
          </a-col>
          <a-col :span="4">添加指定成员</a-col>
          <a-col :span="20">
            <div class="user-box" @click="readUserAdd">
              <ul v-if="nodeObj.readUser">
                <li v-for="(item,index) in nodeObj.readUser" :key="index" v-show="index < 3">
                  <div>{{ `${item.code}-${item.name}` }}</div>
                </li>
                <li v-if="nodeObj.readUser.length > 3"><div>...</div></li>
              </ul>
            </div>
            <a href="javascript:;" @click="readUserAdd">
              <a-icon style="width:10%;line-height:36px;" type="edit" />
            </a>
          </a-col>
        </a-row>
      </a-row>
      <users-tool
        :visible.sync="approveUserVisible"
        :userType="2"
        @onSelect="onApproveUsersSelect"
        :defaultSelect="approveUserSelectArr"/>
      <users-tool
        :visible.sync="readUserVisible"
        :userType="4"
        @onSelect="onReadUsersSelect"
        :defaultSelect="readUserSelectArr"/>
    </a-modal>
    <!-- 查看 -->
    <a-modal
      title="审批流详情"
      v-model="previewModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="hidePreview">关闭</a-button>
      </template>
      <a-row class="doc">
        <a-col :span="4">审批对象</a-col>
        <a-col :span="8">
          <div style="padding: 0px 4px;border-top: 1px solid #e8e8e8">{{ selectedSingleRow.billName }}</div>
        </a-col>
        <a-col :span="4">流程名称</a-col>
        <a-col :span="8">
          <div style="padding: 0px 4px;border-top: 1px solid #e8e8e8">{{ selectedSingleRow.name }}</div>
        </a-col>
        <a-col :span="4">时间范围</a-col>
        <a-col :span="20">
          <a-range-picker format="YYYY年MM月DD日" :value="selectedSingleRow.datatime" disabled/>
        </a-col>
        <a-col :span="4">机构信息</a-col>
        <a-col :span="20">
          <!-- <div style="padding: 0px 4px;">{{ `${selectedSingleRow.storeCode}-${selectedSingleRow.storeName}` }}</div> -->
          <a-tree-select style="width:100%;" v-model="selectedSingleRow.storeCode" disabled :treeData="treeAllData" />
        </a-col>
        <a-col :span="4">是否启用</a-col>
        <a-col :span="8">
          <a-radio-group :value="selectedSingleRow.status" disabled>
            <a-radio v-for="i in statusTypeArr" :key="i.key" :value="i.value">{{ i.title }}</a-radio>
          </a-radio-group>
        </a-col>
        <a-col :span="4">推送方式</a-col>
        <a-col :span="8">
          <a-form-item>
            <a-checkbox-group :value="selectedSingleRow.pushType" disabled>
              <a-checkbox v-for="i in pushTypeArr" :key="i.key" :value="i.value">{{ i.title }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-col>
        <a-col :span="24" style="display:flex;">
          <div class="userPre">
            <span style="width:100%;">审批流程</span>
          </div>
          <div class="approval-box-pre">
            <div class="approval-sub-box">
              <div class="detailBox">
                <div class="detailBox-left">节点1</div>
                <div class="detailBox-right" style="height:40px;line-height:40px;">部门负责人</div>
              </div>
              <div class="detailBox" v-for="(item, index) in approvalFlowList" :key="index">
                <div class="detailBox-left">{{ item.nodeName }}</div>
                <div class="detailBox-right">
                  <div class="detailBox-item" v-if="item.approveRole.length>0">审批角色：{{ item.approveRole }}</div>
                  <div class="detailBox-item" v-if="item.approveUser.length>0">审批指定成员：{{ item.approveUser }}</div>
                  <div class="detailBox-item" v-if="item.readRole.length>0">阅办角色：{{ item.readRole }}</div>
                  <div class="detailBox-item" v-if="item.readUser.length>0">阅办指定成员：{{ item.readUser }}</div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="24" style="display:flex;">
          <div class="userPre"><span style="width:100%;">抄送人</span></div>
          <a-select
            style="width:83.3%"
            mode="multiple"
            :options="carbonArr"
            v-model="carbonSelectArr"
            disabled
          />
        </a-col>
        <a-col :span="24" v-if="selectedSingleRow.note">
          <div class="notePre">{{ selectedSingleRow.note }}</div>
        </a-col>
      </a-row>
    </a-modal>
    <!-- 配置 -->
    <a-modal
      title="配置审批流定义按钮"
      :visible="menuTreeVisible"
      @ok="authorizationOk"
      @cancel="authorizationCancel"
    >
      <a-card hoverable class="action-card" :style="`max-height:${$store.getters.windowHeight-320}px;overflow:auto;`">
        <a-tree
          checkable
          v-model="checkedKeys"
          :treeData="menuTreeData"
        />
      </a-card>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
@import "../../../assets/modalStyle.less";
    .user-box{
        width:90%;
        border:1px solid #d9d9d9;
        height:36px;float:left;
        padding-left: 5px;
        padding-right: 10px;
            ul{
                margin: 0;
                padding: 0;
                list-style: none;
            }
            li{
                float:left;
                margin-right: 4px;
                overflow: hidden;
                color: rgba(0, 0, 0, 0.65);
                background-color: #fafafa;
                border: 1px solid #e8e8e8;
                border-radius: 2px;
                margin-top: 3px;
                height: 24px;
                line-height: 22px;
                padding: 0 10px;
            }
    }
    .ant-checkbox-group{
        padding-left: 10px;
    }
    .approval-icon{
        margin: 0 5px;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size:27px;
    }
    .approval-box{
        display: flex;
        align-items: center;
        flex-flow: row;
        margin: 20px;
        .approval-sub-box{
            display: flex;
            flex-flow: wrap;
            align-items: center;
        }
        .detailBox{
            min-width: 120px;
            min-height: 100px;
            border: 1px solid #d9d9d9;
            margin: 10px 0;
        }
        .detailBox-item {
            margin: 10px;
        }
        .detailBox-icon{
            position: absolute;
            right: 5px;top: -8px;
            font-size: 16px;
            height: 40px;
        }
    }
    .approval-title{
        text-align: right;
        font-weight: bold;
        padding-right: 30px;
        font-size: 12px;
        width: 17%;
        height: 40px;
        line-height: 40px;
    }
    .node-title{
        width: 100%;
        font-weight: bold;
        height: 36px;
        line-height: 36px;
        font-size: 12px;
        padding-left: 10px;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
        background-color: #f5f5f5;
    }
    .approval-box-pre{
        // display: flex;
        // flex-flow: row;
        // align-items: center;
        width: 83.4%;
        // min-height: 100px;
        // border-left: 1px solid #e8e8e8;
        border-right: 1px solid #e8e8e8;
        // .approval-title-pre{
        //     text-align: right;
        //     font-weight: bold;
        //     padding-right: 30px;
        //     font-size: 12px;
        //     width:16.6%;
        // }
        .approval-sub-box{
            // width: 83.4%;
            display: flex;
            flex-flow: wrap;
            align-items: center;
            border-left: 1px solid #d9d9d9;
        }
        .detailBox{
            display: flex;
            align-items: center;
            width:100%;
            min-height: 40px;
            border-bottom: 1px solid #d9d9d9;
            .detailBox-left{
                width:30%;
                padding: 0 10px;
            }
            .detailBox-right{
                width: 70%;
                border-left: 1px solid #d9d9d9;
                padding: 0 10px;
            }
            .detailBox-item{
                padding: 5px 0;
            }
        }
    }
    .notePre{
        padding: 5px 10px;
        border: 1px solid #d9d9d9;
    }
    .userPre{
        display: flex;
        justify-content: right;
        align-items: center;
        text-align: right;
        font-weight: bold;
        padding-right: 10px;
        width: 16.6%;
        font-size: 12px;
        background-color: #f5f5f5;
        border-bottom: 1px solid #e8e8e8;

    }
</style>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import users from './tools/carbonUsers'
import usersTool from './tools/user'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import is from 'is_js'
export default {
    name: 'ApprovalProcessCustomiz',
    components: {
        NewTable,
        seachBox,
        users,
        usersTool
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            disContextMenu: [],
            // 表格数据右击编辑菜单
            menuOpt: [
                { name: '编辑',
                    action: 'approvalProcessCustomiz.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'approvalProcessCustomiz.get',
                    fc: this.getDetail
                    // fc: e => this.$refs.newTable.showDetails('审批流程详情', e)
                }, { name: '删除',
                    action: 'approvalProcessCustomiz.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, { name: '启用',
                    action: 'approvalProcessCustomiz.enable',
                    fc: ({ id }) => { this.onUpdate(id, 'approval_status:1') }
                }, { name: '停用',
                    action: 'approvalProcessCustomiz.disable',
                    fc: ({ id }) => { this.onUpdate(id, 'approval_status:2') }
                }
            ],
            // 工具栏按钮组
            btns: ['add', 'del'],
            // 工具栏搜索表单内容收集
            seachValue: {},
            // 工具栏搜索表单配置
            conditions: [
                {
                    title: '审批对象',
                    type: 'select',
                    key: 'menuCode',
                    selectDataArr: [],
                    label: 'title',
                    value: 'value',
                    filter: true
                },
                {
                    title: '状态',
                    type: 'select',
                    key: 'status',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'approval_status'
                    }
                }
            ],
            // 新增/编辑模态框标题
            addEditModalTitle: '',
            // 新增/编辑模态框打开关闭标识
            addEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            // 按钮加载标识
            loading: false,
            // 是否添加标识
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除
            tableSelectRows: [],
            // 新增/编辑下拉框-单据类型
            actionArr: [],
            // 新增/编辑下拉框-机构信息
            treeAllData: [],
            defaultdatatime: [moment().startOf('day'), moment().startOf('day').add({ years: 1 })],
            // 抄送人
            usersVisible: false,
            carbonSelectArr: [],
            carbonArr: [],
            previewModal: false,
            // 审批流节点
            nodeModal: false,
            nodeObj: {},
            // 新增/编辑审批流节点-用户角色
            rolesArr: [],
            // 新增/编辑审批流节点 审批人
            approveUserVisible: false,
            approveUserSelectArr: [],
            // 新增/编辑审批流节点 阅办人
            readUserVisible: false,
            readUserSelectArr: [],
            // 新增/编辑审批流-审批流程节点
            approvalFlowList: [],
            // 是否新增审批流节点
            isAddNode: false,
            // 功能设置系统参数
            funKeyArr: [],
            // 推送方式
            pushTypeArr: [],
            // 状态 启用/停用
            statusTypeArr: [],
            // 审批流定义菜单配置
            menuTreeVisible: false,
            menuTreeData: [],
            checkedKeys: [],
            disArr: [],
            billName: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd06bfe83970144fa946c3d829dd1c719:approvalProcessCustomiz'
            this.tableApiPath = 'SysApprovalDefineFindApprovalList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.queryUser()
        this.getActionType()
        this.getConfigType()
    },
    methods: {
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('day'))
        },
        onContextmenuChange (tableRow) {
            // 启用
            if (tableRow.status === 'approval_status:1') {
                this.disContextMenu = ['编辑', '删除', '启用']
            } else {
                this.disContextMenu = ['停用']
            }
        },
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'SysApprovalDefineFindApprovalList'
            this.$refs.newTable.reload(this.tableCode, e)
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
            }
        },

        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        onTreeChange (value, node) {
            this.billName = node.join('')
        },
        /**
         * 添加审批流流程节点
         */
        editNodeModal () {
            this.isAddNode = true
            const num = this.approvalFlowList ? this.approvalFlowList.length + 1 : 1
            this.nodeObj = { key: num, nodeName: `节点${num}`, approveRole: [], approveUser: [], funKey: ['approval_fun_key:1', 'approval_fun_key:2'], readRole: [], readUser: [] }
            this.nodeModal = true
        },
        /**
         * 展示审批流节点详情
         */
        showNodeDetail (item) {
            this.isAddNode = false
            this.nodeObj = { ...item }
            console.log('detail', this.nodeObj)
            this.nodeModal = true
        },
        /**
         * 删除审批流节点
         */
        deleteNode (item) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    self.approvalFlowList = self.approvalFlowList.filter(o => o.key !== item.key)
                }
            })
        },
        /**
         * 判断是否选中“阅办”功能
         */
        checkboxChange (e) {
            if (e.indexOf('approval_fun_key:4') === -1) {
                this.$set(this.nodeObj, 'readRole', [])
                this.$set(this.nodeObj, 'readUser', [])
            }
        },
        /**
         * 新增节点模态框关闭
         */
        nodeCancel () {
            this.nodeModal = false
        },
        /**
         * 新增节点确定
         */
        nodeOk () {
            if (this.nodeObj.nodeName.length > 10 || this.nodeObj.nodeName.length < 1) {
                return this.$message.warning('节点名称为1~10字')
            }
            if (is.inArray(this.nodeObj.nodeName, map(this.approvalFlowList, 'nodeName'))) {
                return this.$message.warning('节点名称已经存在，请重新输入')
            }
            if (this.nodeObj.funKey.length < 1) {
                return this.$message.warning('请选择功能')
            }
            if (this.nodeObj.funKey.indexOf('approval_fun_key:1') >= 0) {
                if (this.nodeObj.approveRole.length < 1 && this.nodeObj.approveUser.length < 1) {
                    return this.$message.warning('请选择审批角色或审批人员')
                }
            }
            if (this.nodeObj.funKey.indexOf('approval_fun_key:4') >= 0) {
                if (this.nodeObj.readRole.length < 1 && this.nodeObj.readUser.length < 1) {
                    return this.$message.warning('请选择阅办角色或阅办人员')
                }
            }
            const peopleList = []
            this.nodeObj.approveRole.forEach(i => {
                const x = this.rolesArr.find(o => o.value === i)
                peopleList.push({
                    type: 1,
                    code: i,
                    name: x.title
                })
            })
            this.nodeObj.readRole.forEach(i => {
                const x = this.rolesArr.find(o => o.value === i)
                peopleList.push({
                    type: 3,
                    code: i,
                    name: x.title
                })
            })
            this.nodeObj.peopleList = [...peopleList, ...this.nodeObj.approveUser, ...this.nodeObj.readUser]
            if (this.isAddNode) {
                this.approvalFlowList.push(this.nodeObj)
            } else {
                this.approvalFlowList = this.approvalFlowList.map(t => {
                    return t.key === this.nodeObj.key ? this.nodeObj : t
                })
            }
            this.nodeModal = false
        },

        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getRoles()
            this.queryUser()
            this.getActionType()
            this.getConfigType()
            this.getTreeAllData()
            if (index === -1) {
                this.approvalFlowList.length = 0
                this.selectedSingleRow = {}
                this.carbonSelectArr.length = 0
                this.addEditModalTitle = '新增审批流程信息'
            } else {
                this.addEditModalTitle = '编辑审批流程信息'
            }
            this.addEditModal = true
        },
        approveUserAdd () {
            this.approveUserSelectArr = [...this.nodeObj.approveUser]
            this.approveUserVisible = true
        },
        onApproveUsersSelect (e) {
            const error = []
            const tempArr = []
            // 抄送人,阅办人不能是审批人
            const temp = [ ...map(this.nodeObj.readUser, 'code'), ...this.carbonSelectArr ]
            e.forEach(o => {
                if (is.not.inArray(o.code, temp)) {
                    tempArr.push(o)
                } else {
                    error.push(o.code)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}用户为抄送人/阅办人，不能添加为审批人`
                })
            }
            this.$set(this.nodeObj, 'approveUser', tempArr)
        },
        readUserAdd (arr) {
            this.readUserSelectArr = [...this.nodeObj.readUser]
            this.readUserVisible = true
        },
        onReadUsersSelect (e) {
            const error = []
            const tempArr = []
            // 抄送人，审批人不能是阅办人
            const temp = [ ...map(this.nodeObj.approveUser, 'code'), ...this.carbonSelectArr ]
            e.forEach(o => {
                if (is.not.inArray(o.code, temp)) {
                    tempArr.push(o)
                } else {
                    error.push(o.code)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}用户为抄送人/审批人，不能添加为阅办人`
                })
            }
            this.$set(this.nodeObj, 'readUser', tempArr)
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
                        item.value = item.code
                    })
                    this.rolesArr = [...data]
                }
            })
        },

        /**
         * 查询用户
         */
        queryUser () {
            axios({
                path: 'PermissionsUserFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.carbonArr = [...data]
                }
            })
        },
        usersAdd () {
            let tempArr = []
            this.approvalFlowList.forEach(o => {
                tempArr = tempArr.concat(o.readUser, o.approveUser)
            })
            this.disArr = [...new Set(map(tempArr, 'code'))]
            this.usersVisible = true
            this.$refs.userRef.blur()
        },
        /**
         * 选择用户返回数据
         */
        onUsersSelect (e) {
            this.carbonSelectArr = map(e, 'code')
        },
        hidePreview () {
            this.previewModal = false
        },
        getDetail (row) {
            const self = this
            this.findApprovalById(row.id, function (row) {
                self.selectedSingleRow = { ...row }
                self.selectedSingleRow.pushType = row.pushType ? row.pushType.split(',') : []
                self.selectedSingleRow.datatime = []
                self.selectedSingleRow.datatime.push(moment(row.beginTime))
                self.selectedSingleRow.datatime.push(moment(row.endTime))
                self.carbonSelectArr = row.copierCode ? row.copierCode.split(',') : []
                row.processList.sort((a, b) => { return a.sort - b.sort })
                row.processList.forEach((o, index) => {
                    o.approveRole = []
                    o.readRole = []
                    o.approveUser = []
                    o.readUser = []
                    if (o.peopleList) {
                        o.peopleList.forEach(i => {
                            if (i.type === 1) {
                                o.approveRole.push(`${i.code}-${i.name}`)
                            } else if (i.type === 3) {
                                o.readRole.push(`${i.code}-${i.name}`)
                            } else if (i.type === 2) {
                                o.approveUser.push(`${i.storeCode}:${i.code}-${i.name}`)
                            } else if (i.type === 4) {
                                o.readUser.push(`${i.storeCode}:${i.code}-${i.name}`)
                            }
                        })
                        o.approveUser = o.approveUser.join(', ')
                        o.readUser = o.readUser.join(', ')
                        o.approveRole = o.approveRole.join(', ')
                        o.readRole = o.readRole.join(', ')
                    }
                    o.funKey = o.funKey.split(',')
                })
                self.approvalFlowList = [...row.processList]
                self.previewModal = true
            })
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.isAdd = false
            this.approvalFlowList.length = 0
            this.carbonSelectArr.length = 0
            this.selectedSingleRow.length = 0
            const self = this
            this.findApprovalById(row.id, function (row) {
                self.selectedSingleRow = { ...row }
                self.selectedSingleRow.pushType = row.pushType ? row.pushType.split(',') : []
                self.selectedSingleRow.datatime = []
                self.selectedSingleRow.datatime.push(moment(row.beginTime))
                self.selectedSingleRow.datatime.push(moment(row.endTime))
                self.carbonSelectArr = row.copierCode ? row.copierCode.split(',') : []
                row.processList.sort((a, b) => { return a.sort - b.sort })
                row.processList.forEach((o, index) => {
                    o.approveRole = []
                    o.readRole = []
                    o.approveUser = []
                    o.readUser = []
                    const list = []
                    if (o.peopleList) {
                        o.peopleList.map(i => {
                            if (i.type === 1) {
                                o.approveRole.push(i.code)
                            } else if (i.type === 3) {
                                o.readRole.push(i.code)
                            }
                            list.push({
                                type: i.type,
                                code: i.code,
                                name: i.name,
                                storeCode: i.storeCode
                            })
                        })
                        o.peopleList = [...list]
                        o.approveUser = list.filter(i => i.type === 2)
                        o.readUser = list.filter(i => i.type === 4)
                    }
                    o.funKey = o.funKey.split(',')
                    o.key = index + 1
                })
                self.billName = row.billName
                self.approvalFlowList = [...row.processList]
                self.addEditStorefront()
            })
        },
        /**
         * @name:表格右击详情监听
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
                        path: 'SysApprovalDefineDelApproval',
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
         * @name:表格右击详情监听
         */
        onUpdate (id, status) {
            const self = this
            this.$confirm({
                title: '提示',
                content: `确认${status === 'approval_status:2' ? '停用' : '启用'}此审批流吗？`,
                onOk () {
                    const ids = [id]
                    axios({
                        path: 'SysApprovalDefineChangeStatus',
                        method: 'post',
                        body: {
                            ids: ids,
                            status: status
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData(self.tableCode, { path: self.tableApiPath })
                        }
                    })
                }
            })
        },
        findApprovalById (id, callBack) {
            axios({
                path: 'SysApprovalDefineFindApprovalById',
                method: 'post',
                body: {
                    id
                }
            }).then(res => {
                if (res.flag === 1) {
                    callBack(res.data)
                }
            })
        },
        /**
         * @name:新增/编辑模态框获取单据类型
         */
        getActionType () {
            axios({
                path: 'PermissionsRoleMenuQueryMenuByApproval',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.actionArr = this.initActionTreeData(res.data)
                    this.$set(this.conditions[0], 'selectDataArr', this.actionArr)
                }
            })
        },
        initActionTreeData (data, y = 0) {
            const arr = []
            for (let i = 0; i < data.length; i++) {
                const x = {}
                x.key = `${y}-${i}`
                if (data[i].isLeaf) {
                    x.value = `${data[i].id}-${data[i].parentCode}`
                    x.isLeaf = data[i].isLeaf
                    x.title = `${this.$t(`menu.${data[i].parentName}`)}${this.$t(`action.${data[i].name}`)}`
                } else {
                    x.value = data[i].id
                    x.title = this.$t(`menu.${data[i].name}`)
                    x.disabled = true
                }
                if ('children' in data[i]) {
                    x.children = this.initActionTreeData(data[i].children, x.key)
                }
                arr.push(x)
            }
            return arr
        },
        /**
         * @name:新增/编辑模态框获取单据类型
         */
        getConfigType () {
            axios({
                path: 'OrganizationConfigFindByTypes',
                method: 'post',
                body: {
                    types: ['approval_fun_key', 'approval_push_type', 'approval_status']
                }
            }).then(res => {
                if (res.flag === 1) {
                    const funData = res.data.approval_fun_key
                    funData.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.funKeyArr = [...funData]
                    const pushData = res.data.approval_push_type
                    pushData.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.pushTypeArr = [...pushData]
                    const statusData = res.data.approval_status
                    statusData.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.statusTypeArr = [...statusData]
                    if (this.isAdd) {
                        this.selectedSingleRow.pushType = []
                        this.selectedSingleRow.pushType.push(pushData[0].value)
                        this.selectedSingleRow.status = statusData[0].value
                    }
                }
            })
        },
        // 新增/编辑组织数据获取
        getTreeAllData () {
            axios({
                path: 'OrganizationGroupFrameworkFindAll',
                method: 'post',
                body: {
                    page: 1,
                    row: 9999
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.treeAllData = initAllTreeData(initChildData('0', res.data.list))
                }
            })
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            if (this.approvalFlowList.length < 1) {
                return this.$message.warn('请添加审批流程')
            }
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    const codes = values.actionCode.split('-')
                    values.menuCode = codes[1]
                    values.actionCode = codes[0]
                    values.billName = this.billName
                    values.pushType = values.pushType.join(',')
                    values.beginTime = moment(values.datatime[0]).format('YYYY-MM-DD')
                    values.endTime = moment(values.datatime[1]).format('YYYY-MM-DD')
                    values.copierCode = this.carbonSelectArr.join(',')
                    const nameArr = this.carbonArr.filter(o => is.inArray(o.value, this.carbonSelectArr))
                    values.copierName = (map(nameArr, 'name')).join(',')
                    const list = []
                    this.approvalFlowList.map((o, index) => {
                        list.push({
                            nodeName: o.nodeName,
                            sort: index + 1,
                            funKey: o.funKey.join(','),
                            peopleList: o.peopleList
                        })
                    })
                    values.processList = [...list]
                    axios({
                        path: this.isAdd ? 'SysApprovalDefineAdd' : 'SysApprovalDefineUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 模态框关闭
        subCancel () {
            this.addEditModal = false
        },
        authorizationCancel () {
            this.menuTreeVisible = false
        },
        authorizationOk () {
            const arr = this.chooseCheck(this.menuTreeData, this.checkedKeys)
            const codes = [...new Set(arr)]
            axios({
                path: 'ActionMenuFunctionUpdateMenuAction',
                method: 'post',
                body: {
                    codes
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.menuTreeVisible = false
                }
            })
        },
        chooseCheck (treeData, keys) {
            let arr = []
            treeData.forEach(t => {
                if (is.inArray(t.key, keys)) {
                    arr.push(t.id)
                    t.parentCode && arr.push(t.parentCode)
                }
                if ('children' in t) {
                    const subArr = this.chooseCheck(t.children, keys)
                    arr = [...arr, ...subArr]
                }
            })
            return arr
        },
        /**
         * @name: 获取按钮树数据
         * @msg:
         * @param {type}
         * @return:
         */
        onSettingAction () {
            this.menuTreeData.length = 0
            this.checkedKeys.length = 0
            axios({
                path: 'PermissionsRoleMenuQueryMenuAction',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.menuTreeData = this.initTreeData(res.data)
                    const arr = expandTree(this.menuTreeData)
                    this.checkedKeys = map(arr, 'key')
                    this.menuTreeVisible = true
                }
            })
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
                    x.parentCode = data[i].parentCode
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
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }
}
function initChildData (id, arr) {
    const endArr = []
    const pArr = arr.filter(o => o.parentId === id)
    pArr.forEach(i => {
        const x = arr.filter(o => o.parentId === id)
        if (x.length > 0) {
            i.children = initChildData(i.id, arr)
        }
        i.key = i.id
        i.title = i.name
        endArr.push(i)
    })
    return endArr
}
function initAllTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const x = {}
        x.title = `${i.code}-${i.name}`
        x.key = i.id
        x.value = i.storeCode ? i.storeCode : i.id
        x.disabled = !i.storeCode
        x.code = i.code
        if ('children' in i) {
            x.children = initAllTreeData(i.children)
        } else {
            x.isLeaf = true
        }
        newArr.push(x)
    })
    newArr.sort((a, b) => { return a.code - b.code })
    return newArr
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

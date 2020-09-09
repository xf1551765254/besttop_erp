<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-06-15 17:42:53
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-09 10:48:19
 -->
<template>
  <div class="notificationManagement">
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button type="primary" size="small" style="margin-right:10px" @click="auditHandler(0)">置顶</a-button>
        <a-button type="primary" size="small" style="margin-right:10px" @click="auditCancel(0)">取消置顶</a-button>
        <a-button type="primary" @click="deleteHandler(0)" size="small">作废</a-button>                  <!-- 这种无slot写法按钮插入在新增之前 -->
      </div>
    </seachbox>
    <a-tabs :defaultActiveKey="seachValue.newsType" :tabPosition="'left'" @change="callback" style="float:left" class="msg-tab">
      <a-tab-pane :tab="msg.value" :key="msg.code" v-for="msg in masgType">
      </a-tab-pane>
    </a-tabs>
    <NewTable
      style="float:left;width:calc(100% - 149px);"
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    />
    <!-- 修改 -->
    <bt-modal
      v-model="addEditModal"
      :title="addEditTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">标题名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入标题名称"
                v-decorator="$check('notificationManagement.titles',{initialValue:tableSingleData.titles||''})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">副标题名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入消息名称"
                v-decorator="$check('notificationManagement.subtitle',{initialValue:tableSingleData.subtitle||''})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="min-height:350px;">
          <a-col :sm="8" :md="4" :xl="3">发送内容</a-col>
          <a-col :sm="16" :md="17" :xl="18" class="clear content" style="height: auto">
            <a-form-item>
              <editor
                v-model="tableSingleData.sendContent"
                style="width:100%;height:300px;"
              ></editor>
              <a-input
                style="display:none"
                placeholder="请输入内容"
                v-decorator="$check('notificationManagement.sendContent',{initialValue:tableSingleData.sendContent||''})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="addMsg-handle">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">用户范围</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-radio-group name="radioGroup" @change="setUserRange" v-decorator="$check('notificationManagement.userRange',{initialValue:tableSingleData.userRange||''})">
                  <a-radio v-for="option in userAbout" :key="option.configKey" :value="`${option.type}:${option.configKey}`">{{ option.value }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>

        </a-row>
        <a-row v-if="tableSingleData.userRange==='system_notice_user_range:1'">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">顾客信息</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">发送顾客标签</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  placeholder="请选择发送顾客标签"
                  showSearch
                  mode="multiple"
                  v-model="tableSingleData.custType"
                  allowClear

                >
                  <a-select-option v-for="item in customerLabel" :key="item.code" :value="item.code">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <div>
              <a-col :sm="8" :md="4" :xl="3"></a-col>
              <a-col :sm="16" :md="20" :xl="21">
                <a-button type="primary" @click="queryCustomer" :disabled="isCustType" style="margin-right:10px">添加客户</a-button>
                <a-button type="primary" :disabled="isCustType" style="margin-right:10px" @click="deleteCustomer" >删除</a-button>
              </a-col>
            </div>
          </a-row>
          <a-row>
            <div style="clear:both">
              <!-- </a-col> -->
              <a-col :sm="8" :md="4" :xl="3"></a-col>
              <a-col :sm="16" :md="8" :xl="11" class="clear" style="height:auto;margin: 0;">
                <a-form-item>
                  <a-table
                    :rowKey="record => record.id"
                    :columns="customerColumns"
                    :dataSource="tableSingleData.custId"
                    size="small"
                    bordered
                    :rowSelection="{
                      selectedRowKeys:selectedRowCustKeys,
                      onChange: custTableChange,
                    }"
                    :pagination="false"
                  >
                  </a-table>
                </a-form-item>
              </a-col>
            </div>
          </a-row>
        </a-row>
        <a-row class="addMsg-handle">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">封面</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" style="height:auto">
              <a-form-item>
                <upload :fileList="tableSingleData.coverPicture" :fileLength="['封面']" @uploadFileList="uploadFileList"></upload>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">发送类型</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-select
                  placeholder="请选择发送类型"
                  showSearch
                  mode="multiple"
                  v-decorator="$check('notificationManagement.sendTypes',{initialValue:tableSingleData.sendTypes||''})"
                  allowClear
                >
                  <a-select-option v-for="item in sendTypeLsit" :key="item.sendTypes" :value="item.code">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">发送方式</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-radio-group name="radioGroup" @change="setSendMode" v-decorator="$check('notificationManagement.sendMode',{initialValue:tableSingleData.sendMode||[]})">
                  <a-radio v-for="option in sendModeLsit" :key="option.configKey" :value="`${option.type}:${option.configKey}`">{{ option.value }}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">发送时间</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-date-picker
                  showTime
                  :disabled="tableSingleData.sendMode!=='system_notice_send_mode:1'"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择时间"
                  v-decorator="$check('notificationManagement.sendTime',{initialValue:moment(tableSingleData.sendTime||{})})"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
      </a-form>
      <a-divider dashed/>
      <!-- 添加表格 -->
    </bt-modal>
    <!-- 选择客户 -->
    <a-modal
      title="选择客户"
      :width="900"
      :visible="visible"
      @cancel="visible=false"
      @ok="handleOk"
    >
      <seachBox
        :conditions="addCustomerOnditions"
        v-model="addCustomerSeachValue"
        @onClick="addCustomerOnSeachClick"
        @onReload="addCustomerOnReload"
        @onSeach="addCustomerOnSeach">
      </seachbox>
      <div class="customer">
        <a-table
          :rowKey="record => record.id"
          :columns="customerColumns"
          :dataSource="customer"
          size="small"
          bordered
          :rowSelection="{
            selectedRowKeys:selectedRowKeys,
            onChange: tableChange,
          }"
          @change="handleTableChange"
          :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
        >
        </a-table>
      </div>
    </a-modal>
    <!-- 预览 -->
    <a-modal
      title="预览"
      :width="900"
      :visible="detailMoal"
      @cancel="detailMoal=false"
    >
      <div class="logistics" v-html="tableSingleData.sendContent">
      </div>
      <template slot="footer">
        <a-button key="back" @click="detailMoal=false">关闭</a-button>
      </template>

    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import moment from 'moment'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import editor from '@comp/editor/editor'
import upload from '@comp/upload'

export default {
    name: 'NotificationManagement',
    components: {
        seachBox,
        NewTable,
        upload,
        BtModal,
        editor
    },
    data () {
        return {
            sendContent: '',
            conditions: [
                { title: '标题名称', type: 'input', key: 'titles' },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'system_notice_send_status'
                    }

                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '结束日期',
                    mat: 'YYYY-MM-DD'
                }

            ], // array,编辑框的配置
            seachValue: {
                type: '',
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // json,默认值，编辑框的值，双向绑定
            btns: ['add', 'edit', 'del', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            // 主表格
            tableCode: '',
            tableApiPath: '',
            tableIdsArr: [],
            tableRowsArr: [],
            // 单行选中的值
            tableSingleData: {},
            form: this.$form.createForm(this),
            strategyDefineValue: '', // 政策
            customerValue: '', // 客户
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                {
                    name: '置顶',
                    action: 'notificationManagement.enable',
                    fc: this.auditHandler
                },
                {
                    name: '取消置顶',
                    action: 'notificationManagement.enable',
                    fc: this.auditCancel
                },
                {
                    name: '作废',
                    action: 'notificationManagement.disable',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'notificationManagement.query',
                    fc: this.detailHandler
                }
            ],
            tags: ['uncheck'],
            addEditTitle: '',
            addEditModal: false,
            submitLoading: false,
            // 用户范围
            userAbout: [],
            // 通知类型
            masgType: [],
            // 顾客标签
            customerLabel: [],
            customerColumns: [{
                title: '名称',
                dataIndex: 'name',
                key: 'name'
            }, {
                title: '电话',
                dataIndex: 'telephone',
                key: 'telephone'
            }, {
                title: '客户标签',
                dataIndex: 'labelName',
                key: 'labelName'
            }],
            customer: [],

            // 添加顾客对话框
            addCustomer: false,
            visible: false,
            addCustomerOnditions: [
                { title: '顾客姓名', type: 'input', key: 'name' },
                {
                    key: 'labels',
                    type: 'select',
                    title: '标签',
                    label: 'value',
                    mode: 'multiple',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'customer_label'
                    }
                }
            ], // array,编辑框的配置
            addCustomerSeachValue: {
                name: '',
                labels: []
            }, // json,默认值，编辑框的值，双向绑定
            isAdd: 0,
            selectedRowKeys: [],
            selectedRowCustKeys: [],
            selectedRows: [],
            detailMoal: false,
            customerModeLsit: [],
            sendModeLsit: [],
            sendTypeLsit: [],
            isCustType: false,
            pagination: {
                defaultCurrent: 1,
                pageSize: 10,
                total: 0
            }

        }
    },
    mounted () {
        this.getMsgStaticData()
        // console.log('这是当前的quill实例对象', this.editor)
    },
    watch: {
        'tableSingleData.custType': {
            handler (newData) {
                console.log(newData)
                if (newData && newData.length > 0) {
                    this.tableSingleData.custId = []
                    this.isCustType = true
                } else {
                    this.isCustType = false
                }
            },
            deep: true
        },
        'seachValue.startTime' (val, oldVal) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val, oldVal) {
            if (val && this.seachValue.startTime) {
                if (moment(val).isBefore(this.seachValue.startTime)) {
                    this.seachValue.startTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'tableSingleData.sendContent' (val, oldVal) {
            console.log(val)
            // this.tableSingleData.sendContent = val
            this.form.setFieldsValue({ sendContent: val

            })
            // console.log(this.tableSingleData.sendContent)
        }
    },
    methods: {
        moment,
        /**
        列表接口 SystemNoticeQueryList
        参数：{"type":"system_notice_type:0"}
        新增 url:http://192.168.198.146:10011/api-crm/system/notice/addSystemNotice
        入参：{"custType":"001","type":"system_notice_type:0","title":"测试55","subtitle":"测试55-5","sendContent":"54654654","userRange":"system_notice_user_range:1","sendTypes":"system_notice_send_type:1","sendMode":"system_notice_send_mode:0"}
        添加顾客 SystemNoticeQueryCustomer
            SystemNoticeQueryCustomer
SystemNoticeUpdateStatus
                SystemNoticeUpdateTop
        新增 SystemNoticeAddSystemNotice
        SystemNoticeAddSystemNotice
        参数：{"label":"001"}
         */
        getMsgStaticData () {
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_notice_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.masgType = res.data
                    this.masgType.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                    this.seachValue.type = this.masgType[0].code
                    this.$nextTick(() => {
                        this.tableCode = 'afd058c69b264c2d9bcb4e832c29c9e1:notificationManagement'
                        this.tableApiPath = 'SystemNoticeQueryList'
                        this.$refs.newTable.setContextmenu(this.menuOpt)
                    })
                }
            })

            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_notice_user_range'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.userAbout = res.data
                    // this.userAbout.forEach(el => {
                    //     el.code = el.type + ':' + el.configKey
                    //     // console.log(el.code)
                    // })
                }
            })

            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'customer_label'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.customerLabel = res.data
                    this.customerLabel.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                }
            })
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_notice_send_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.sendTypeLsit = res.data
                    this.sendTypeLsit.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                }
            })
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_notice_send_mode'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.sendModeLsit = res.data
                    this.sendModeLsit.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                }
            })
        },
        onReload () { // 清空的实现，将seachValue置空。
            const code = this.seachValue.type
            this.seachValue = {
                type: code
            }
        },

        onSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            this.reLoadTableData()
        },

        queryCustomer () {
            console.log('aaa')
            this.visible = true
            this.customer = []
            this.addCustomerSeachValue = {}
            // this.addCustomerOnSeach()
        },

        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'disable') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要作废的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SystemNoticeQueryList')
            }
        },
        onSelect (ketIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'SystemNoticeQueryList' })
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.top === '0') {
                this.disContextMenu = ['取消置顶']
            } else {
                this.disContextMenu = ['置顶']
            }
        },
        // 预览
        detailHandler (addEditData) {
            this.detailMoal = true
            this.tableSingleData = addEditData
            // this.tableSingleData = {
            //     id: addEditData.id,
            //     type: addEditData.newsType,
            //     title: addEditData.title,
            //     subtitle: addEditData.subtitle,
            //     sendContent: addEditData.sendContent, // 操作类型
            //     userRange: addEditData.userRange, // 富文本显示内容
            //     custType: addEditData.custType,
            //     sendTypes: addEditData.sendTypes, // 富文本真实内容
            //     sendMode: addEditData.sendMode, // 选择参数
            //     coverPicture: addEditData.coverPicture,
            //     custId: addEditData.custId,
            //     sendTime: addEditData.sendTime
            // }
        },
        /**
         * @name: 作废
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            console.log(delEventData)

            const _this = this
            if (delEventData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'system_notice_send_status:1')
                if (!isAuit) {
                    this.$message.warning('只有未发送的才能进行此操作')
                    return
                }
            }
            if (delEventData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.$confirm({
                    title: '提示',
                    content: '确定选中项全部作废？作废后将不可更改',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'SystemNoticeUpdateStatus', // 接口path名，必传
                            method: 'post',
                            body: {
                                ids: delEventData === 0 ? _this.tableIdsArr : [delEventData.id]
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        /**
         * @name: 置顶
         * @msg:
         * @param {type}
         * @return:
         */

        auditHandler (autiData) {
            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.top === '0')
                if (!isAuit) {
                    this.$message.warning('只有未置顶的才能进行此操作')
                    return
                }
            }
            if (autiData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.$confirm({
                    title: '提示',
                    content: '此操作将进行置顶， 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'SystemNoticeUpdateTop', // 接口path名，必传
                            method: 'post',
                            body: {
                                ids: autiData === 0 ? _this.tableIdsArr : [autiData.id],
                                top: '1'
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        // 取消审核
        auditCancel (autiData) {
            console.log(autiData)
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.top === '1')
                if (!isAuit) {
                    this.$message.warning('只有已置顶的才能进行此操作')
                    return
                }
            }
            const _this = this
            if (autiData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.$confirm({
                    title: '提示',
                    content: '此操作将进行取消置顶, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'SystemNoticeUpdateTop', // 接口path名，必传
                            method: 'post',
                            body: {
                                ids: autiData === 0 ? _this.tableIdsArr : [autiData.id],
                                top: '0'
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = 0
                this.addEditTitle = '新增'
                this.addEditModal = true
                console.log(this.seachValue)
                this.tableSingleData = {
                    type: this.seachValue.type,
                    titles: '',
                    subtitle: '',
                    sendContent: '', // 操作类型
                    userRange: '', // 富文本显示内容
                    custType: [],
                    sendTypes: [], // 富文本真实内容
                    sendMode: '', // 选择参数
                    coverPicture: [],
                    custId: [],
                    sendTime: undefined
                }
            }
        },
        // 新增提交
        submitInfo (e) {
            e.preventDefault()

            const { form: { validateFields } } = this
            console.log(this.tableSingleData)

            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    const ids = []
                    this.tableSingleData.custId.forEach(el => {
                        ids.push(el.id)
                    })

                    const data = {
                        type: this.tableSingleData.type,
                        titles: values.titles,
                        subtitle: values.subtitle,
                        sendContent: this.tableSingleData.sendContent, // 操作类型
                        userRange: values.userRange, // 富文本显示内容
                        custType: this.tableSingleData.custType,
                        sendTypes: values.sendTypes, // 富文本真实内容
                        sendMode: values.sendMode, // 选择参数
                        coverPicture: this.tableSingleData.coverPicture.length > 0 ? this.tableSingleData.coverPicture[0].fileUrl : '',
                        custId: ids,
                        sendTime: values.sendMode === 'system_notice_send_mode:0' ? '' : this.tableSingleData.sendTime
                        //  moment(this.tableSingleData.sendTime).format('YYYY-MM-DD HH:mm:ss')
                    }

                    console.log(data)

                    axios({
                        path: 'SystemNoticeAddSystemNotice', // 接口path名，必传
                        method: 'post',
                        body: data
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                            console.log(res.data)
                        }
                    })
                }
            })
        },
        setSendMode (el) {
            console.log(el)
            this.tableSingleData.sendMode = el.target.value
            if (el.target.value !== 'system_notice_send_mode:0') {
                this.tableSingleData.sendTime = new Date()
            } else {
                this.tableSingleData.sendTime = {}
            }
        },
        setUserRange (el) {
            console.log(el)
            this.tableSingleData.userRange = el.target.value
        },

        // table 事件
        tableChange (selectedRowKeys, selectedRows) {
            console.log(selectedRowKeys, selectedRows)
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = selectedRows
        },
        custTableChange (selectedRowKeys, selectedRows) {
            console.log(selectedRowKeys, selectedRows)
            this.selectedRowCustKeys = selectedRowKeys
        },
        handleTableChange () {

        },
        deleteCustomer () {
            this.tableSingleData.custId = this.tableSingleData.custId.filter(el => {
                return this.selectedRowCustKeys.indexOf(el.id) === -1
            })
        },
        handleOk () {
            const arr = this.selectedRows
            const error = []
            arr.forEach(el => {
                const has = this.tableSingleData.custId.filter(o => o.id === el.id)
                console.log(has)
                this.isAddGoods = 2
                if (has.length === 0) {
                    this.tableSingleData.custId.push(el)
                } else {
                    error.push(el.id)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.visible = false
        },
        callback (key) {
            this.seachValue.type = key
            this.reLoadTableData()
            console.log(key)
        },
        // 选择客户
        addCustomerOnSeachClick (e) {
            // if (e === 'add') {
            //     this.addEdit(-1)
            // } else if (e === 'del') {
            //     if (this.tableIdsArr.length === 0) {
            //         this.$message.warning('请选择要删除的列表')
            //     } else {
            //         this.deleteHandler(-1)
            //     }
            // } else if (e === 'export') {
            //     this.$refs.newTable.exportFile('SystemNoticeQueryList')
            // }
        },
        addCustomerOnReload () { // 清空的实现，将seachValue置空。
            this.addCustomerseachValue = {}
        },
        addCustomerOnSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            const data = e
            data.pageNum = this.pagination.defaultCurrent
            data.pageSize = this.pagination.pageSize
            axios({
                path: 'SystemNoticeQueryCustomer', // 接口path名，必传
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    this.customer = res.data
                }
            })
            // this.reLoadTableData()
        },
        // 图片上传
        uploadFileList (data) {
            console.log(data)
            this.tableSingleData.coverPicture = data
            // this.fileList = data
        }

    }
}
</script>

<style lang="less" scoped>
    .notificationManagement{
        background-color: #ffffff;
        height: 100%;
        padding-top: 20px;

        .clear::after{
            clear: both;

        }
        .clear{
            height: auto
        }
        .content{
            /deep/ .ant-spin-container{
                height: 100%;
                /deep/ .editor{
                    height: 100% !important;
                    /deep/  .ql-container{
                            height: calc(100% - 66px);
                    }
                }
            }
        }
    }
</style>

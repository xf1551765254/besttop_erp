<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-06-15 17:42:53
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-04 15:33:14
 -->
<template>
  <div class="messageTemplate">
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button type="primary" size="small" style="margin-right:10px" @click="auditHandler(0)">审核</a-button>
        <a-button type="primary" @click="auditCancel(0)" size="small">取消审核</a-button>
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
      :tags="tags">
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">消息类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <!-- <a-select
                style="width:100%"
                placeholder="请选择消息类型"
                showSearch
                v-decorator="$check('MessageTemplate.newsType',{initialValue:tableSingleData.newsType})"
                allowClear
                disabled>
                <a-select-option v-for="item in masgType" :key="`${item.type}:${item.configKey}`" :value="`${item.type}:${item.configKey}`">{{ item.value }}</a-select-option>
              </a-select> -->
              <a-input
                style="width:100%"
                disabled
                placeholder="请输入消息类型"
                v-decorator="$check('MessageTemplate.newsTypeName',{initialValue:tableSingleData.newsTypeName||''})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">消息名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入消息名称"
                v-decorator="$check('MessageTemplate.newsName',{initialValue:tableSingleData.newsName||''})"
                :disabled="isAdd===2"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">推送方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-checkbox-group
                :options="options"
                :disabled="isAdd===2"
                v-decorator="$check('MessageTemplate.pushMode',{initialValue:tableSingleData.pushMode||[]})" />

            </a-form-item>
          </a-col>

        </a-row>
        <a-row class="addMsg-handle">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">推送条件配置</a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">操作类型</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  style="width:100%"
                  placeholder="请选择操作类型"
                  showSearch
                  :disabled="isAdd===2"
                  v-decorator="$check('MessageTemplate.operationType',{initialValue:tableSingleData.operationType})"
                  allowClear>
                  <a-select-option v-for="item in handleType" :key="`${item.type}:${item.configKey}`" :value="`${item.type}:${item.configKey}`">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-row>

              <a-col :sm="8" :md="4" :xl="3">推送内容配置</a-col>
              <a-col :sm="16" :md="20" :xl="18">
                <a-form-item>
                  <!-- <editor v-model="text" v-decorator="$check('MessageTemplate.strategyDefineCode',{initialValue:tableSingleData.pushLabel})"></editor> -->
                  <!-- <quill-editor
                    class="editor"
                    style="300px"
                    v-decorator="$check('MessageTemplate.pushLabel',{initialValue:tableSingleData.pushLabel})"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)">
                  </quill-editor> -->

                  <div v-if="isAdd===2" v-html="tableSingleData.pushLabel"></div>
                  <quill-editor
                    v-else
                    class="editor"
                    style="300px"
                    v-model="tableSingleData.pushLabel"
                    ref="myQuillEditor"
                    :options="editorOption"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                    @change="onEditorChange($event)">
                  </quill-editor>
                  <a-input
                    style="display:none"
                    placeholder="请输入推送内容"
                    v-decorator="$check('MessageTemplate.pushContent',{initialValue:tableSingleData.pushContent||''})"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="8" :md="4" :xl="3">选择参数</a-col>
              <a-col :sm="16" :md="20" :xl="18">
                <a-form-item>
                  <a-select
                    placeholder="请选择操作类型"
                    showSearch
                    mode="multiple"
                    :value="tableSingleData.params"
                    allowClear
                    :disabled="isAdd===2"
                    @change="setTpl">
                    <a-select-option v-for="item in paramsList" :key="`${item.paramCode}:${item.paramName}`" :value="`${item.paramCode}:${item.paramName}`">{{ item.paramName }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :sm="8" :md="4" :xl="3">备注说明</a-col>
              <a-col :sm="16" :md="20" :xl="18" style="">
                <a-form-item>
                  <!-- <editor v-model="text" v-decorator="$check('MessageTemplate.strategyDefineCode',{initialValue:tableSingleData.pushLabel})"></editor> -->

                  <a-textarea
                    :disabled="isAdd===2"
                    style="width:100%"
                    placeholder="请输入备注说明"
                    v-decorator="$check('MessageTemplate.note',{initialValue:tableSingleData.note||''})"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-row>

        </a-row>
      </a-form>
      <!-- 详情表格 -->
    </bt-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
// import editor from '@comp/editor/editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// import ImageResize from 'quill-image-resize-module'

// Quill.register('modules/imageResize', ImageResize)

export default {
    name: 'MessageTemplate',
    components: {
        seachBox,
        NewTable,
        BtModal,
        // editor
        quillEditor
    },
    data () {
        return {
            conditions: [
                { title: '消息名称', type: 'input', key: 'newsCode' },

                {
                    key: 'pushMode',
                    type: 'select',
                    title: '推送方式',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'system_news_push_mode'
                    }

                }, {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'system_news_status'
                    }
                }
            ], // array,编辑框的配置
            seachValue: {
                newsType: '',
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }, // json,默认值，编辑框的值，双向绑定
            btns: ['add', 'del', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            // 主表格
            tableCode: '',
            tableApiPath: '',
            // table复选的id
            tableIdsArr: [],
            // table复选的数据
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
                    name: '编辑',
                    action: 'messageTemplate.edit',
                    fc: this.addEdit
                },
                {
                    name: '审核',
                    action: 'messageTemplate.verify',
                    fc: this.auditHandler
                },
                {
                    name: '取消审核',
                    action: 'messageTemplate.verify',
                    fc: this.auditCancel
                },
                {
                    name: '删除',
                    action: 'messageTemplate.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'messageTemplate.get',
                    fc: this.detailHandler
                }
            ],
            masgType: [],
            handleType: [],
            paramsList: [],
            addEditTitle: '',
            addEditModal: false,
            submitLoading: false,
            tags: ['uncheck'],
            options: [
                { label: '系统', value: 'system_news_push_mode:1' },
                { label: '短信', value: 'system_news_push_mode:2' }
                // { label: 'Orange', value: 'system_news_push_mode:' }
            ],
            // 富文本
            quillIndex: 0,
            editorOption: {
                placeholder: '',
                theme: 'snow', // 主题
                modules: {
                    toolbar: null

                }
            },
            isAdd: 0,
            formatText: []

        }
    },
    created () {
        // this.getMsgStaticData()
    },
    mounted () {
        this.getMsgStaticData()
        // console.log('这是当前的quill实例对象', this.editor)
    },
    computed: {
        // editor () {
        //     return this.$refs.myQuillEditor.quill
        // }
    },
    methods: {
        /**
        列表接口 url：SystemNewsQuerySystemNesList
        参数：{"newsType":"物流信息"}
        新增 url SystemNewsAddSystemNes
        参数：{"newsType":"售后信息","newsName":"测试333","pushMode":"system_news_push_mode:1","operationType":"system_news_operation_type:1"}"userRange":"system_notice_user_range:1","sendType":"system_notice_send_type:1","sendMode":"system_notice_send_mode:0"}
        编辑 url:SystemNewsUdpateSystemNews
        参数：{"id":"742d5bf69a0a453899d63e8b16e8f8c8","newsType":"售后信息","newsName":"测试444","pushMode":"system_news_push_mode:1","operationType":"system_news_operation_type:1"}
        启用 SystemNewsUdpateStatus
        参数：{"id":"742d5bf69a0a453899d63e8b16e8f8c8","status":"system_news_push_mode:2"}
        删除 SystemNewsDeleteSystemNews
        参数：{"ids":["742d5bf69a0a453899d63e8b16e8f8c8"]}

        SystemNewsQueryList
         */
        getMsgStaticData () {
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_news_news_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.masgType = res.data
                    this.masgType.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                    this.seachValue.newsType = this.masgType[0].code
                    this.$nextTick(() => {
                        this.tableCode = '7ad5243301fd45d19d0ca50c1f047599:MessageTemplate'
                        this.tableApiPath = 'SystemNewsQuerySystemNesList'
                        this.$refs.newTable.setContextmenu(this.menuOpt)
                    })
                }
            })
            axios({
                path: 'SystemNewsQueryList', // 接口path名，必传
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    this.paramsList = res.data
                    res.data.forEach(el => {
                        // this.formatText.push(` ${el.paramName} `)
                        el.formatText = ` ${el.paramName} `
                    })
                    // console.log(this.formatText)
                }
            })
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_news_operation_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.handleType = res.data
                    this.handleType.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                }
            })
        },
        onReload () { // 清空的实现，将seachValue置空。
            const code = this.seachValue.newsType
            this.seachValue = {
                newsType: code
            }
        },

        onSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            this.reLoadTableData()
        },
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'edit') {
                if (this.tableIdsArr.length === 0 || this.tableIdsArr.length > 1) {
                    this.$message.warning('请选择要编辑的一组数据')
                } else if (this.tableIdsArr.length === 1) {
                    this.addEdit(this.tableRowsArr[0])
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SystemNewsQuerySystemNesList')
            }
        },
        onSelect (ketIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')

            this.tableRowsArr = keyRows
            console.log(this.tableIdsArr, this.tableRowsArr)
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'SystemNewsQuerySystemNesList' })
        },
        onContextmenuChange (tableRow) {
            console.log(tableRow)

            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'system_news_status:1') {
                this.disContextMenu = ['取消审核']
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
         * @name: 删除表格
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            console.log(delEventData)

            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'system_news_status:1')
                console.log(isAuit)
                if (!isAuit) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除后将不可更改',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemNewsDeleteSystemNews', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        // 取消审核
        auditCancel (autiData) {
            console.log(autiData)
            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'system_news_status:2')
                if (!isAuit) {
                    this.$message.warning('只有已审核的才能进行此操作')
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
                    content: '此操作将进行取消审核，取消后后将不可使用, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'SystemNewsUpdateStatus', // 接口path名，必传
                            method: 'post',
                            body: {
                                ids: autiData === 0 ? _this.tableIdsArr : [autiData.id],
                                status: 'system_news_status:1'
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
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            // const _this = this
            // let arr = []
            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'system_news_status:1')
                if (!isAuit) {
                    this.$message.warning('只有未审核的才能进行此操作')
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
                    content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'SystemNewsUpdateStatus', // 接口path名，必传
                            method: 'post',
                            body: {
                                ids: autiData === 0 ? _this.tableIdsArr : [autiData.id],
                                status: 'system_news_status:2'
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
            // console.log(_this.tableIdsArr)
        },
        detailHandler (addEditData) {
            this.isAdd = 2
            this.addEditTitle = '预览'
            this.addEditModal = true
            this.tableSingleData = {
                newsType: addEditData.newsType,
                newsTypeName: addEditData.newsTypeName,
                newsName: addEditData.newsName,
                pushMode: addEditData.pushMode === 'system_news_push_mode:3' ? ['system_news_push_mode:1', 'system_news_push_mode:2'] : addEditData.pushMode,
                operationType: addEditData.operationType, // 操作类型
                pushLabel: addEditData.pushLabel, // 富文本显示内容
                pushContent: addEditData.pushContent, // 富文本真实内容
                params: addEditData.params || [], // 选择参数
                note: addEditData.note
            }
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            console.log(addEditData)
            if (addEditData === -1) {
                this.isAdd = 0
                this.addEditTitle = '新增'
                this.addEditModal = true
                console.log(this.seachValue)
                let newsType = ''
                this.masgType.forEach(el => {
                    if (el.code === this.seachValue.newsType) {
                        newsType = el.value
                    }
                })
                this.tableSingleData = {
                    newsType: this.seachValue.newsType,
                    newsTypeName: newsType,
                    newsName: '',
                    pushMode: [],
                    operationType: '', // 操作类型
                    pushLabel: '', // 富文本显示内容
                    pushContent: '', // 富文本真实内容
                    params: [], // 选择参数
                    note: ''
                }
            } else {
                this.isAdd = 1
                this.addEditTitle = '编辑'
                this.addEditModal = true
                this.tableSingleData = {
                    id: addEditData.id,
                    newsType: addEditData.newsType,
                    newsTypeName: addEditData.newsTypeName,
                    newsName: addEditData.newsName,
                    pushMode: addEditData.pushMode === 'system_news_push_mode:3' ? ['system_news_push_mode:1', 'system_news_push_mode:2'] : [addEditData.pushMode],
                    operationType: addEditData.operationType, // 操作类型
                    pushLabel: addEditData.pushLabel, // 富文本显示内容
                    pushContent: addEditData.pushContent, // 富文本真实内容
                    params: addEditData.params || [], // 选择参数
                    note: addEditData.note
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
                    this.paramsList.forEach(el => {
                        if (this.tableSingleData.pushContent.indexOf(el.formatText)) {
                            const reg = new RegExp(el.formatText)
                            // console.log()
                            this.tableSingleData.pushContent = this.tableSingleData.pushContent.replace(reg, el.paramCode)
                            console.log(this.tableSingleData.pushContent)
                        }
                    })
                    const data = {
                        id: this.tableSingleData.id,
                        newsType: this.tableSingleData.newsType,
                        newsTypeName: values.newsTypeName,
                        newsName: values.newsName,
                        pushMode: values.pushMode.length === 2 ? 'system_news_push_mode:3' : values.pushMode[0] || '',
                        operationType: values.operationType, // 操作类型
                        pushLabel: this.tableSingleData.pushLabel, // 富文本显示内容
                        pushContent: this.tableSingleData.pushContent,
                        // 富文本真实内容
                        params: this.tableSingleData.params,
                        note: values.note
                    }
                    console.log(data)
                    axios({
                        path: this.isAdd === 0 ? 'SystemNewsAddSystemNes' : 'SystemNewsUpdateSystemNews', // 接口path名，必传
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

        callback (key) {
            this.seachValue.newsType = key
            this.reLoadTableData()
            console.log(key)
        },
        // 富文本事件 start
        // 编辑器光标离开 将编辑器内容发射给父组件
        onEditorBlur (quill) {

        },
        // 编辑器获得光标
        onEditorFocus (quill) {
            quill.enable(true) // 实现达到上限字符可删除
            this.quillIndex = this.$refs.myQuillEditor.quill.selection.savedRange.index
            // console.log(this.$refs.myQuillEditor.quill.selection.savedRange.index)
        },
        onEditorReady (quill) {
            console.log(quill)
        },
        // 编辑器文本发生变化
        onEditorChange ({ quill, html, text }) {
            // { quill, html, text }
            // console.log(quill)
            this.quillIndex = this.$refs.myQuillEditor.quill.selection.savedRange.index
            this.tableSingleData.pushContent = text
            this.form.setFieldsValue({
                pushContent: this.tableSingleData.pushContent
            }) // console.log(this.tableSingleData.pushContent)
        },
        // 富文本事件 end
        setTpl (value) {
            console.log(value)
            console.log(this.tableSingleData.params)
            // 判断是否添加
            if (value.length > this.tableSingleData.params.length) {
                this.tableSingleData.params = value
                const data = value[value.length - 1].split(':')
                console.log(data[1])
                this.$refs.myQuillEditor.quill.insertText(this.quillIndex, ' ', {
                    'color': 'rgba(0, 0, 0, 0.65)',
                    'bold': false
                })
                this.$refs.myQuillEditor.quill.insertText(this.quillIndex, data[1], {
                    'color': 'red',
                    'bold': true
                })
                this.$refs.myQuillEditor.quill.insertText(this.quillIndex, ' ', {
                    'color': 'rgba(0, 0, 0, 0.65)',
                    'bold': false
                })
                // this.$refs.myQuillEditor.quill.format('color', 'rgba(0, 0, 0, 0.65)')
                // 添加code
                // this.tableSingleData.pushContent += data[0]
                // // 删除文字
                // this.tableSingleData.pushContent = this.tableSingleData.pushContent.split(data[1]).join('')
                console.log(this.tableSingleData.pushContent)
            } else {
                // 筛选删除的项
                const newData = value.concat(this.tableSingleData.params).filter(function (v, i, arr) {
                    // console.log(arr)
                    return arr.indexOf(v) === arr.lastIndexOf(v)
                })
                this.tableSingleData.params = value
                console.log(newData)
                // debugger
                // 删除的项
                const code = ` ${newData[newData.length - 1].split(':')[1]} `

                const index = this.tableSingleData.pushContent.indexOf(code)
                console.log(index, code.length)
                if (index !== -1) {
                    console.log(` ${code} `)
                    this.$refs.myQuillEditor.quill.deleteText(index, code.length)
                    // console.log(code[0])
                    // console.log(this.tableSingleData.pushContent)
                    console.log(this.tableSingleData.pushLabel)
                }
            }
        }

    }
}
</script>

<style lang="less" scoped>
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
    .messageTemplate{
        height: 100%;
        background-color: #fff;
        padding-top: 20px;

        //富文本
        .ant-spin-nested-loading > div > .ant-spin {
            max-height: 550px;
        }
        .editor {
        line-height: normal; /*!important;*/
        /* height: 550px; */
        }
        .ql-snow .ql-tooltip[data-mode=link]::before {
            content: "请输入链接地址:";
        }
        .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
            border-right: 0px;
            content: '保存';
            padding-right: 0px;
        }

        .ql-snow .ql-tooltip[data-mode=video]::before {
            content: "请输入视频地址:";
        }

        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
            content: '14px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
            content: '10px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
            content: '18px';
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
            content: '32px';
        }

        .ql-snow .ql-picker.ql-header .ql-picker-label::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item::before {
            content: '文本';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
            content: '标题1';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
            content: '标题2';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
            content: '标题3';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
            content: '标题4';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
            content: '标题5';
        }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
            content: '标题6';
        }

        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
            content: '标准字体';
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
            content: '衬线字体';
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
            content: '等宽字体';
        }
    }
</style>

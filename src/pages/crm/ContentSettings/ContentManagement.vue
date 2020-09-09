<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-06-15 17:42:53
 * @LastEditors: haile
 * @LastEditTime: 2019-07-11 17:09:03
 -->
<template>
  <div class="ContentManagement">
    <div class="class-tree">
      <a-tree
        :treeData="treeData"
        :selectedKeys.sync="classCode"
        autoExpandParent
        checkStrictly
        defaultExpandAll
        @select="handSelect"
      >
      </a-tree>
    </div>
    <div class="class-content">
      <seachBox
        :conditions="conditions"
        :btns="btns"
        v-model="seachValue"
        @onClick="onSeachClick"
        @onReload="onReload"
        @onSeach="onSeach">
        <a-button
          size="small"
          type="primary"
          icon="play-circle"
          style="margin-right:10px"
          v-action:enable
          @click="enableHandler(-1)">启用</a-button>
        <a-button size="small" type="primary" icon="stop" v-action:disable @click="disableHandler(-1)">停用</a-button>
      </seachbox>
      <NewTable
        ref="newTable"
        :tableCode="tableCode"
        :tableApiPath="tableApiPath"
        :pams="seachValue"
        :disContextMenu="disContextMenu"
        @onContextmenuChange="onContextmenuChange"
        @onSelect="onSelect"
      />
      <!-- 修改 -->

    </div>
    <bt-modal
      v-model="addEditModal"
      :title="addEditTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
    >
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">分类名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入标题名称"
                disabled
                v-decorator="$check('ContentManagement.className',{initialValue:tableSingleData.className||''})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">标题名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入标题名称"
                v-decorator="$check('ContentManagement.titles',{initialValue:tableSingleData.titles||''})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">副标题名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入消息名称"
                v-decorator="$check('ContentManagement.subtitle',{initialValue:tableSingleData.subtitle||''})"
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
                style="display:none;"
                placeholder="请输入内容"
                v-decorator="$check('ContentManagement.sendContent',{initialValue:tableSingleData.sendContent||''})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="addMsg-handle">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">封面图</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" style="height:auto">
              <a-form-item>
                <upload :fileList="tableSingleData.coverPicture" :fileLength="['封面']" @uploadFileList="uploadFileList"></upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择状态"
                showSearch
                v-decorator="$check('ContentManagement.status',{initialValue:tableSingleData.status||''})"
                allowClear
              >
                <a-select-option v-for="item in statusList" :key="item.code" :value="item.code">{{ item.value }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-row style="clear:both" v-if="tableSingleData.className!=='企业介绍'">
            <!-- </a-col> -->
            <a-col :sm="8" :md="4" :xl="3"></a-col>
            <a-col :sm="16" :md="8" :xl="11">
              <a-form-item>
                <a-checkbox-group @change="onChangeRecommend" v-decorator="$check('ContentManagement.recommend',{initialValue:tableSingleData.recommend||[]})">
                  <a-checkbox value="0">是否推荐</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="clear:both" v-if="!tableSingleData.isRecommend">
            <!-- </a-col> -->
            <a-col :sm="8" :md="4" :xl="3"></a-col>
            <a-col :sm="16" :md="8" :xl="11">
              <a-form-item>
                <a-input-number size="small" :min="1" :max="100000" v-decorator="$check('ContentManagement.sort',{initialValue:tableSingleData.sort||''})" :disabled="tableSingleData.isRecommend"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="clear:both">
            <!-- </a-col> -->
            <a-col :sm="8" :md="4" :xl="3"></a-col>
            <a-col :sm="16" :md="8" :xl="11" class="clear">
              <a-form-item>
                <a-checkbox-group @change="onChangeTermValidity" v-decorator="$check('ContentManagement.termValidity',{initialValue:tableSingleData.termValidity||[]})" >
                  <a-checkbox value="0">是否设置有效期</a-checkbox>
                </a-checkbox-group>
              </a-form-item>

            </a-col>
          </a-row>
          <a-row style="clear:both" v-if="!tableSingleData.isTermValidity">
            <!-- </a-col> -->
            <a-col :sm="0" :md="4" :xl="3"></a-col>
            <a-col :sm="8" :md="4" :xl="3">开始时间</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-date-picker
                  showTime
                  :disabledDate="disabledDate"
                  :disabledTime="disabledDateTime"
                  :disabled="tableSingleData.isTermValidity"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择时间"
                  :allowClear="false"
                  v-decorator="$check('notificationManagement.startTime',{initialValue:moment(tableSingleData.startTime||{})})"
                />
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">结束时间</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-date-picker
                  showTime
                  :allowClear="false"
                  :disabledDate="disabledDate"
                  :disabledTime="disabledDateTime"
                  :disabled="tableSingleData.isTermValidity"
                  format="YYYY-MM-DD HH:mm"
                  placeholder="请选择时间"
                  v-decorator="$check('notificationManagement.endTime',{initialValue:moment(tableSingleData.endTime||{})})"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-row>
        <a-row class="addMsg-handle">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">备注说明</a-col>
            <a-col :sm="16" :md="20" :xl="18">
              <a-form-item>
                <a-textarea
                  style="width:100%"
                  placeholder="请输入备注说明"
                  v-decorator="$check('MessageTemplate.note',{initialValue:tableSingleData.note||''})"/>
              </a-form-item>
            </a-col>
          </a-row>

        </a-row>
      </a-form>
      <a-divider dashed/>
    </bt-modal>
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
    name: 'ContentManagement',
    components: {
        seachBox,
        NewTable,
        upload,
        BtModal,
        editor
    },
    data () {
        return {
            treeData: [],
            classCode: [],
            treeCode: '',
            className: [],
            conditions: [
                { title: '标题名称', type: 'input', key: 'titles' },
                {
                    key: 'startValidTime',
                    type: 'date',
                    title: '新增开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endValidTime',
                    type: 'date',
                    title: '新增结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '有效期开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '有效期结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'system_introduction_status'
                    }
                }

            ], // array,编辑框的配置
            statusList: [],
            seachValue: {
                id: '',
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // json,默认值，编辑框的值，双向绑定
            btns: ['add', 'edit', 'del', 'export', 'print', 'get', 'enable', 'disable'], // 定义要显示的按钮，默认内置这5个。
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
                    name: '启用',
                    action: 'ContentManagement.enable',
                    fc: this.enableHandler
                },
                {
                    name: '停用',
                    action: 'ContentManagement.enable',
                    fc: this.disableHandler
                },
                {
                    name: '编辑',
                    action: 'ContentManagement.edit',
                    fc: this.addEdit
                },
                {
                    name: '删除',
                    action: 'ContentManagement.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'ContentManagement.query',
                    fc: this.detailHandler
                }
            ],
            addEditTitle: '',
            addEditModal: false,
            submitLoading: false,
            isAdd: 0,
            detailMoal: false,
            ischild: false,
            treeList: []

        }
    },
    mounted () {
        this.getClassify()
        this.getMsgStaticData()
        console.log(moment().hours())
    },
    watch: {

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
        'seachValue.startValidTime' (val, oldVal) {
            if (val && this.seachValue.startValidTime) {
                if (moment(val).isAfter(this.seachValue.startValidTime)) {
                    this.seachValue.startValidTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endValidTime' (val, oldVal) {
            if (val && this.seachValue.endValidTime) {
                if (moment(val).isBefore(this.seachValue.endValidTime)) {
                    this.seachValue.endValidTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'tableSingleData.sendContent' (val, oldVal) {
            console.log(val)
            if (typeof val !== 'undefined' && val !== null) {
                this.form.setFieldsValue({ sendContent: val })
            }
        },
        classCode (val) {
            console.log(val)
            if (val) {
                this.seachValue.id = val[0]
            }
        }
    },
    methods: {
        moment,
        range (start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },

        disabledDate (current) {
            return moment(current).isBefore(moment().startOf('day'))
        },
        disabledDateTime () {
            return {
                disabledHours: () => this.range(0, 24).splice(0, moment().hours()),
                disabledMinutes: () => this.range(0, moment().minutes()),
                disabledSeconds: () => [0, 59]
            }
        },
        getClassify () {
            axios({
                path: 'SystemClassifyQueryList',
                method: 'post',
                body: {
                    typeId: 3
                }
            }).then(res => {
                if (res.flag === 1 && res.data) {
                    console.log(res.data)
                    res.data.forEach(el => {
                        el.key = el.id
                        el.title = el.typeName
                        // this.treeList.push(el)
                        el.code = el.typeCode
                        if (el.children) {
                            // this.treeList.push(...el.children)
                            el.children.forEach(item => {
                                item.key = item.id
                                item.title = item.className
                                item.code = item.classCode
                            })
                        }
                    })
                    this.treeData = res.data
                    console.log(this.treeList)
                    console.log(this.treeData[0].key)
                    this.classCode = [this.treeData[0].id]
                    this.treeCode = this.treeData[0].code
                    console.log(this.treeCode)

                    this.className = this.treeData[0].title
                    this.seachValue.id = this.classCode[0]
                    const code = this.seachValue.id
                    this.treeData.forEach(el => {
                        if (code === el.id) {
                            this.ischild = !el.children.length > 0
                            console.log(this.ischild)

                            // if (this.ischild) {
                            //     this.disContextMenu = ['新增']
                            // } else {
                            //     this.disContextMenu = []
                            // }
                        }
                    })
                    this.$nextTick(() => {
                        this.tableCode = '21926405c8a141028bcf4c4617e9179c:ContentManagement'
                        this.tableApiPath = 'SystemIntroductionQueryList'
                        this.$refs.newTable.setContextmenu(this.menuOpt)
                    })
                }
            })
        },
        handSelect (selectedKeys, e) {
            console.log(selectedKeys)
            console.log(e)
            if (selectedKeys.length > 0) {
                const code = selectedKeys[0]
                this.seachValue.id = selectedKeys[0]
                this.reLoadTableData()
                this.treeCode = e.node.dataRef.code
                console.log(this.treeCode)
                const isFirst = this.treeData.some(el => {
                    return el.id === code
                })
                if (isFirst) {
                    this.treeData.forEach(el => {
                        if (code === el.id) {
                            this.className = e.node.title
                            this.ischild = !el.children.length > 0
                        }
                    })
                } else {
                    this.ischild = true
                    this.className = e.node.title
                }
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择菜单！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        },
        onChangeRecommend (e) {
            console.log(e)

            if (e && e.length > 0) {
                this.queryMaxSort()
                this.tableSingleData.isRecommend = false
            } else {
                this.tableSingleData.isRecommend = true
            }
            console.log(this.tableSingleData)
        },
        onChangeTermValidity (e) {
            if (e && e.length > 0) {
                this.tableSingleData.isTermValidity = false
            } else {
                this.tableSingleData.isTermValidity = true
            }
        },
        /**
        列表接口 SystemIntroductionQueryList
        删除 SystemIntroductionDeleteSystemIntroduction
           新增     SystemIntroductionAddSystemIntroduction
           二级分类详情 SystemIntroductionSystemIntroductionDetail
           二级分类内容编辑接口 SystemIntroductionUpdateSystemIntroduction
           system/introduction/updateStatus
            用/停用接口（批量） SystemIntroductionUpdateStatus
           查询最大排序接口 SystemIntroductionQueryMaxSort
        参数：{"label":"001"}
         */
        queryMaxSort () {
            axios({
                path: 'SystemIntroductionQueryMaxSort', // 接口path名，必传
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    this.tableSingleData.sort = res.data
                }
            })
        },
        getMsgStaticData () {
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_introduction_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.statusList = res.data
                    this.statusList.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })

                    console.log(this.statusList)
                }
            })
        },
        onReload () { // 清空的实现，将seachValue置空。
            this.seachValue = {}
            this.classCode = [this.treeData[0].id]
        },

        onSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            this.reLoadTableData()
        },

        queryCustomer () {
            console.log('aaa')
            this.visible = true
            this.addCustomerOnSeach()
        },

        onSeachClick (e) {
            console.log(e)
            console.log(this.tableIdsArr.length)

            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'edit') {
                if (this.tableIdsArr.length === 0 || this.tableIdsArr.length > 1) {
                    this.$message.warning('请选择要编辑的一组数据')
                } else if (this.tableIdsArr.length === 1) {
                    this.addEdit(this.tableRowsArr[0])
                }
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SystemIntroductionQueryList')
            }
        },
        onSelect (ketIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'SystemIntroductionQueryList' })
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(tableRow.status === 'system_introduction_status:1')

            if (tableRow.status === 'system_introduction_status:1') {
                this.disContextMenu = ['启用']
            } else {
                this.disContextMenu = ['停用']
            }
        },
        // 预览
        detailHandler (addEditData) {
            this.detailMoal = true
            this.tableSingleData = addEditData
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            console.log(delEventData)
            let arr = []
            const self = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'system_introduction_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行删除操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemIntroductionDeleteSystemIntroduction', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 启用
         * @msg:
         * @param {type}
         * @return:
         */

        enableHandler (autiData) {
            let arr = []
            const self = this
            if (autiData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要启用的列表')
                }
                const newData = [...this.tableRowsArr]
                // const isDisabled = newData.filter(o => o.status !== 'system_introduction_status:2')
                // if (isDisabled.length > 0) {
                //     this.$message.warning('只有停用状态的才能进行启用操作')
                //     return
                // }
                const isAuit = newData.every(o => o.status === 'system_introduction_status:2')
                if (!isAuit) {
                    this.$message.warning('只有停用状态的才能进行启用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(autiData.id)
            }
            this.$confirm({
                title: '提示',
                content: '确定选中项全部启用？',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemIntroductionUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'system_introduction_status:1'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        // 禁用
        disableHandler (disData) {
            let arr = []
            const self = this
            if (disData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要停用的列表')
                }
                // const newData = [...this.tableRowsArr]
                // const isEnable = newData.filter(o => o.status !== 'system_introduction_status:1')
                // if (isEnable.length > 0) {
                //     this.$message.warning('只有启用状态的才能进行停用操作')
                //     return
                // }
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'system_introduction_status:1')
                if (!isAuit) {
                    this.$message.warning('只有启用状态的才能进行停用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(disData.id)
            }
            this.$confirm({
                title: '提示',
                content: '确定选中项全部停用？',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemIntroductionUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'system_introduction_status:2'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            console.log(addEditData)

            if (!this.ischild) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择可以添加内容的菜单！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                console.log(addEditData)
                if (addEditData === -1) {
                    this.isAdd = 0
                    this.addEditTitle = '新增'
                    this.addEditModal = true
                    console.log(this.seachValue)
                    this.tableSingleData = {
                        classCode: this.treeCode,
                        className: this.className,
                        titles: '',
                        subtitle: '',
                        content: '',
                        sendContent: '', // 操作类型
                        coverPicture: [],
                        status: this.statusList[0].code,
                        recommend: '', // 是否推荐
                        isRecommend: true,
                        sort: '', // 排序
                        termValidity: '', // 是否设置有效期
                        isTermValidity: true,
                        startTime: '',
                        endTime: '',
                        note: ''
                    }
                } else {
                    if (addEditData.status === 'system_introduction_status:1') {
                        this.$message.warning('启用状态不能进行此操作')
                        return
                    }
                    // const newData = JSON.parse(JSON.stringify(addEditData))
                    const newData = { ...addEditData }
                    console.log(newData)
                    this.isAdd = 1
                    this.addEditTitle = '编辑'
                    // this.tableSingleData = newData
                    this.tableSingleData.sendContent = newData.sendContent
                    this.tableSingleData.recommend = [newData.recommend] // 是否推荐
                    this.tableSingleData.isRecommend = newData.recommend !== '0'
                    this.tableSingleData.termValidity = [newData.termValidity] // 是否推荐
                    this.tableSingleData.isTermValidity = newData.termValidity !== '0'
                    this.tableSingleData.coverPicture = newData.coverPicture ? [{ url: newData.coverPicture }] : []
                    console.log(this.tableSingleData)
                    this.addEditModal = true
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
                    const data = {
                        id: this.tableSingleData.id,
                        classCode: this.tableSingleData.classCode,
                        className: values.className,
                        titles: values.titles,
                        subtitle: values.subtitle,
                        sendContent: this.tableSingleData.sendContent,
                        coverPicture: this.tableSingleData.coverPicture.length > 0 ? this.tableSingleData.coverPicture[0].fileUrl : '',
                        status: values.status,
                        recommend: !this.tableSingleData.isRecommend ? '0' : '1', // 是否推荐
                        sort: !this.tableSingleData.isRecommend ? values.sort : '', // 排序
                        termValidity: !this.tableSingleData.isTermValidity ? '0' : '1', // 是否设置有效期
                        startTime: !this.tableSingleData.isTermValidity ? values.startTime : '',
                        endTime: !this.tableSingleData.isTermValidity ? values.endTime : '',
                        note: values.note
                    }
                    console.log(data)

                    axios({
                        path: this.isAdd === 0 ? 'SystemIntroductionAddSystemIntroduction' : 'SystemIntroductionUpdateSystemIntroduction', // 接口path名，必传
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
    .ContentManagement{
        background-color: #ffffff;
        .class-tree{
            width: 260px;
            padding-top: 20px;
            height: 100%;
            float: left;

        }
        .class-content{
            padding-top: 20px;
            width: calc(100% - 260px);
            height: 100%;
            border-left: 1px solid #ccc;
            padding-left: 20px;
            float: left;
        }
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

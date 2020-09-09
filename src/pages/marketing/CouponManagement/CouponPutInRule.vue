<!--
 * @Description: 促销券投放
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-09 10:12:13
 * @LastEditors: lin
 * @LastEditTime: 2019-08-27 15:58:18
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
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          type="primary"
          v-action:enable
          size="small"
          style="margin-right:10px"
          icon="caret-right"
          @click="onSeachClick('enable')">启用</a-button>
        <a-button
          type="primary"
          v-action:disable
          size="small"
          style="margin-right:10px"
          icon="stop"
          @click="onSeachClick('disable')">停用</a-button>
      </div>
    </seachBox>
    <!-- 主表 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect" >
    </NewTable>
    <!-- 新增 编辑 -->
    <bt-modal
      :title="AddEditModalTitle"
      v-model="AddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <a-form :form="form">
        <a-row class="titleSet" style="">投放规则信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('CouponRulePulish.name', {initialValue:tableSingleData.name||''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">投放范围</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择投放范围"
                :filterOption="filterOption"
                style="width: 100%"
                :disabled="!isAdd"
                :options="publishRangeDropArr"
                @change="publishRangeValue"
                v-decorator="$check('CouponRulePulish.publishRange', {initialValue:tableSingleData.publishRange})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">投放方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择投放方式"
                :filterOption="filterOption"
                :maxTagCount="1"
                mode="multiple"
                style="width: 100%"
                :options="publishWayDropArr"
                v-decorator="$check('CouponRulePulish.ranges', {initialValue:tableSingleData.ranges||[]})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择状态"
                :filterOption="filterOption"
                style="width: 100%"
                :options="statusDropArr"
                v-decorator="$check('CouponRulePulish.status', {initialValue:tableSingleData.status})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDateStart"
                @change="changeStrtData"
                v-decorator="$check('CouponRulePulish.startTime', {initialValue:tableSingleData.startTime})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDateEndAndConStart"
                @change="changeEndData"
                v-decorator="$check('CouponRulePulish.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="1" v-decorator="$check('CouponRulePulish.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="titleSet" style="">促销券信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">促销券类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择促销券类型"
                :filterOption="filterOption"
                style="width: 100%"
                :options="couponTypeDropArr"
                v-decorator="$check('CouponRulePulish.couponType', {initialValue:tableSingleData.couponType})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">券金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入券金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('CouponRulePulish.couponAmount', {initialValue:tableSingleData.couponAmount||0},AmountHandler)"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">券销售金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入券销售金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('CouponRulePulish.couponSalePrice', {initialValue:tableSingleData.couponSalePrice||0})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">投放总量</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入投放总量"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                v-decorator="$check('CouponRulePulish.publishTotalQuantity', {initialValue:tableSingleData.publishQuantity||1},publishQuantityHandler)"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">每人限领</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入每人限领数"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                v-decorator="$check('CouponRulePulish.limitQuantity', {initialValue:tableSingleData.limitQuantity||1},publishMaxQuantityHandler)"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">券开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                @change="changeConStartData"
                :disabledDate="disabledDateEndAndConStart"
                v-decorator="$check('CouponRulePulish.couponStartTime', {initialValue:tableSingleData.couponStartTime})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">券结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDateCouEnd"
                v-decorator="$check('CouponRulePulish.couponEndTime', {initialValue:tableSingleData.couponEndTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="titleSet" style="">赠送信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3" >是否允许赠送</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择"
                style="width:100%"
                @change="ifSendValue"
                v-decorator="$check('CouponRulePulish.ifSend', {initialValue:tableSingleData.ifSend||0})">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">赠送总量</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入赠送总量"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :disabled="ifSendStatus"
                v-decorator="$check('CouponRulePulish.sendQuantity', {initialValue:tableSingleData.sendQuantity},sendQuantityHandler)"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">赠送限领</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入赠送限领"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :disabled="ifSendStatus"
                v-decorator="$check('CouponRulePulish.sendMaxQuantity', {initialValue:tableSingleData.sendMaxQuantity},sendMaxQuantityHandler)"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="titleSet" style="">分享信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3" >是否允许分享</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择有"
                style="width:100%"
                @change="ifShareValue"
                v-decorator="$check('CouponRulePulish.ifShare', {initialValue:tableSingleData.ifShare||0})">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">分享标题</a-col>
          <a-col :sm="16" :md="8" :xl="13">
            <a-form-item>
              <a-input
                placeholder="请输入分享标题"
                :disabled="ifShareStatus"
                v-decorator="$check('CouponRulePulish.shareTitle', {initialValue:tableSingleData.shareTitle||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 分享文案 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea
                :disabled="ifShareStatus"
                placeholder="请输入分享内容"
                :autosize="{ minRows: 1}"
                v-decorator="$check('CouponRulePulish.shareContent', {initialValue:tableSingleData.shareContent||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">分享图片</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <a-form-item v-if="!ifShareStatus">
              <upload :fileList="fileList" :fileLength="['上传图片']" @uploadFileList="uploadFileList" />
            </a-form-item>
            <a-form-item v-else>
              <a-upload
                name="avatar"
                listType="picture-card"
                class="avatar-uploader"
                :disabled="true"
                :showUploadList="false">
                <div >
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import moment from 'moment'
import BtModal from '@comp/Modal'
import upload from '@comp/upload'
import Preview from '@pages/marketing/CouponManagement/preview/CouponPutInRulePreview'
export default {
    name: 'CouponPutInRule',
    components: { NewTable, SeachBox, BtModal, upload, Preview },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '规则编码'
                },
                {
                    key: 'name',
                    type: 'input',
                    title: '规则名称'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '创建人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'validateStartTime',
                    type: 'date',
                    title: '创建开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'validateEndTime',
                    type: 'date',
                    title: '创建结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'label',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                },
                {
                    key: 'publishRange',
                    type: 'select',
                    title: '投放范围',
                    label: 'label',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                }

            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                validateStartTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                validateEndTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 主表格
            tableCode: '',
            tableApiPath: '',
            disContextMenu: [],
            moenuOPT: [
                { name: '编辑',
                    action: 'CouponPutInRule.edit',
                    fc: this.addEdit
                },
                { name: '启用',
                    action: 'CouponPutInRule.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'CouponPutInRule.disable',
                    fc: this.disableHandler
                },
                { name: '删除',
                    action: 'CouponPutInRule.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'CouponPutInRule.get',
                    fc: this.detailHandler
                }
            ],
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // 新增编辑弹框
            tags: ['uncheck'], // 单据状态
            AddEditModal: false,
            isAdd: false,
            // 新增编辑模态框头
            AddEditModalTitle: '',
            subLoading: false,
            form: this.$form.createForm(this),
            ifSendStatus: true, // 是否赠送
            ifShareStatus: true, // 是否分享
            fileList: [], // 轮播图
            // 规则开始value时间
            disabledDateStarting: moment().startOf('day'),
            disabledDateEnding: moment().startOf('day'),
            disabledDateConStrating: moment().startOf('day'),

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            publishRangeDropArr: [],
            publishWayDropArr: [],
            statusDropArr: [],
            couponTypeDropArr: [] //
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '96511ecbbe22426cbb9297d511b2b9a6:CouponPutInRule'
            this.tableApiPath = 'ScheduPublishQueryList'
            this.$refs.newTable.setContextmenu(this.moenuOPT)
        })
        this.getPublishWayDropArr()
        this.getPublishRangeDropArr()
        this.getStatusDropArr()
        this.getCouponTypeDropArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'ScheduPublishQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ScheduPublishQueryList')
            } else if (e === 'enable') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要启用的列表')
                } else {
                    this.enableHandler(-1)
                }
            } else if (e === 'disable') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要停用的列表')
                } else {
                    this.disableHandler(-1)
                }
            }
        },
        /**
         * @name: 更新表格
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduPublishQueryList' })
        },
        /**
         * @name: 表格的多选
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 表格右击
         */
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'schedule_coupon_publish_status:1') {
                this.disContextMenu = ['启用']
            } else {
                this.disContextMenu = ['禁用', '编辑', '停用']
            }
        },
        /**
         * @name: 启用
         */
        enableHandler (enabledData) {
            let arr = []
            const _this = this
            if (enabledData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'schedule_coupon_publish_status:2')
                if (isAuit.length > 0) {
                    this.$message.warning('只有停用的才能进行此操作')
                    return
                }
                arr = map(this.tableRowsArr, 'code')
            } else {
                arr.push(enabledData.code)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部启用？',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduPublishStatusStart', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
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
        },
        /**
         * @name: 停用
         */
        disableHandler (disableData) {
            let arr = []
            const _this = this
            if (disableData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'schedule_coupon_publish_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有启用的才能进行此操作')
                    return
                }
                arr = map(this.tableRowsArr, 'code')
            } else {
                arr.push(disableData.code)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部启用？',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduPublishStatusStop', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
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
        },
        /**
         * @name: 主表删除
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
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
                        path: 'ScheduPublishDeleteScheduleCouponPublish', // 接口path名，必传
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
        /**
         * @name: 新增 编辑
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = true
                this.ifSendStatus = true // 是否赠送
                this.ifShareStatus = true // 是否分享
                this.AddEditModalTitle = '新增促销券投放规则'
                this.tableSingleData = {}
                this.fileList = []
                this.$nextTick(() => {
                    this.disabledDateStarting = moment().startOf('day')
                    this.disabledDateEnding = moment().startOf('day')
                    this.disabledDateConStrating = moment().startOf('day')
                })
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑促销券投放规则'
                const obj = { ...addEditData }
                if (obj.publishWay) {
                    obj.ranges = obj.publishWay.split(',')
                } else {
                    obj.ranges = []
                }
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                obj.couponEndTime = moment(obj.couponEndTime)
                obj.couponStartTime = moment(obj.couponStartTime)
                this.$nextTick(() => {
                    if (obj.startTime.isAfter(moment())) {
                        this.disabledDateStarting = obj.startTime.startOf('day')
                    } else {
                        this.disabledDateStarting = moment().startOf('day')
                    }
                    if (obj.endTime.isAfter(moment())) {
                        this.disabledDateEnding = obj.endTime.startOf('day')
                    } else {
                        this.disabledDateEnding = moment().startOf('day')
                    }
                    if (obj.couponStartTime.isAfter(moment())) {
                        this.disabledDateConStrating = obj.couponStartTime.startOf('day')
                    } else {
                        this.disabledDateConStrating = moment().startOf('day')
                    }
                })
                this.ifSendStatus = obj.ifSend === 0
                this.ifShareStatus = obj.ifShare === 0
                const pic = obj.sharePicture.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
                this.tableSingleData = obj
            }
            this.AddEditModal = true
        },
        /* @name: 弹框提交
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                    }
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.couponStartTime = values.couponStartTime.startOf('day').format('YYYY-MM-DD')
                    values.couponEndTime = values.couponEndTime.startOf('day').format('YYYY-MM-DD')
                    const fileList = this.fileList.map(x => x.fileUrl)
                    values.sharePicture = fileList.join(',')
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ScheduPublishAddScheduleCouponPublish' : 'ScheduPublishUpdateScheduleCouponPublish',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.subLoading = false
                        if (res.flag === 1) {
                            this.AddEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 金额不能为0 check
         */
        AmountHandler (rule, value, callback) {
            if (value === 0) {
                const str = '输入的金额不能为0'
                callback(str)
            } else {
                callback()
            }
        },
        /**
         * @name: 投放总量 check
         */
        publishQuantityHandler (rule, value, callback) {
            const form = this.form
            const limitQuantity = form.getFieldValue('limitQuantity')
            if (value && limitQuantity) {
                form.validateFields(['limitQuantity'], { force: true })
            }
            if (value === 0) {
                const str = '输入的投放总量不能为0'
                callback(str)
            } else {
                callback()
            }
        },
        /**
         * @name: 每人限领 check
         */
        publishMaxQuantityHandler (rule, value, callback) {
            const form = this.form
            if (value === 0) {
                const str = '输入的每人限领数不能为0'
                callback(str)
            } else if (value && value > form.getFieldValue('publishTotalQuantity')) {
                const str = '每人限领数不能大于投放总量的数量'
                callback(str)
            } else {
                callback()
            }
        },
        /**
         * @name: 赠送总量  check
         */
        sendQuantityHandler (rule, value, callback) {
            const form = this.form
            const sendMaxQuantity = form.getFieldValue('sendMaxQuantity')
            if (value && sendMaxQuantity) {
                form.validateFields(['sendMaxQuantity'], { force: true })
            }
            if (!this.ifSendStatus) {
                if (value === 0) {
                    const str = '输入的投放总量不能为0'
                    callback(str)
                } else if (!value) {
                    const str = '请输入赠送总量'
                    callback(str)
                } else {
                    callback()
                }
            } else {
                callback()
            }
        },
        /**
         * @name: 赠送限领 check
         */
        sendMaxQuantityHandler (rule, value, callback) {
            const form = this.form
            if (!this.ifSendStatus) {
                if (value === 0) {
                    const str = '输入的每人限领数不能为0'
                    callback(str)
                } else if (value && value > form.getFieldValue('sendQuantity')) {
                    const str = '赠送限领不能大于赠送总量 '
                    callback(str)
                } else if (!value) {
                    const str = '请输入赠送限领'
                    callback(str)
                } else {
                    callback()
                }
            } else {
                callback()
            }
        },
        /**
         * @name:投放范围change
         */
        publishRangeValue (value) {
            const form = this.form
            const ifSend = form.getFieldValue('ifSend')
            if (ifSend === 1) {
                if (value === 'schedule_coupon_publish_publish_range:3') {
                    this.ifSendStatus = false
                } else {
                    this.ifSendStatus = true
                }
                this.form.setFieldsValue({
                    sendQuantity: 1,
                    sendMaxQuantity: 1
                })
            } else {
                this.ifSendStatus = true
            }
        },
        /**
         * @name:  是否允许赠送change
         */
        ifSendValue (value) {
            const form = this.form
            if (value === 0) {
                this.ifSendStatus = true
                this.form.setFieldsValue({
                    sendQuantity: undefined,
                    sendMaxQuantity: undefined
                })
            } else {
                const publishRange = form.getFieldValue('publishRange')
                if (publishRange === 'schedule_coupon_publish_publish_range:3') {
                    this.ifSendStatus = false
                } else {
                    this.ifSendStatus = true
                }
                this.form.setFieldsValue({
                    sendQuantity: 1,
                    sendMaxQuantity: 1
                })
            }
        },
        /**
         * @name: 是否允许分享  change
         */
        ifShareValue (value) {
            if (value === 0) {
                this.ifShareStatus = true
                this.form.setFieldsValue({
                    shareTitle: undefined,
                    shareContent: undefined
                })
                this.fileList = []
            } else {
                this.ifShareStatus = false
            }
        },
        /**
         * @name: 图片上传
         */
        uploadFileList (data) {
            this.fileList = data
        },
        /**
         * @name: 规则开始禁止时间
         */
        disabledDateStart (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 规则开始时间变化
         */
        changeStrtData (data, dataStarting) {
            if (data) {
                this.disabledDateStarting = data.startOf('day')
            } else {
                this.disabledDateStarting = moment().startOf('day')
            }
            const form = this.form
            const endTime = form.getFieldValue('endTime')
            const couponStartTime = form.getFieldValue('couponStartTime')
            if (endTime) {
                if (data.isAfter(endTime)) {
                    this.form.setFieldsValue({
                        endTime: moment(data)
                    })
                }
            }
            if (couponStartTime) {
                if (data.isAfter(couponStartTime)) {
                    this.form.setFieldsValue({
                        endTime: moment(data)
                    })
                }
            }
            const couponEndTime = form.getFieldValue('couponEndTime')
            if (couponEndTime) {
                if (data.isAfter(couponEndTime)) {
                    this.form.setFieldsValue({
                        couponEndTime: moment(data)
                    })
                }
            }
        },
        /**
         * @name: 规则结束时间禁止  和券的开始时间
         */
        disabledDateEndAndConStart (curent) {
            return moment(curent).isBefore(this.disabledDateStarting)
        },
        /**
         * @name:  规则结束时间变化
         */
        changeEndData (data, dataStarting) {
            console.log(dataStarting)
            if (data) {
                this.disabledDateEnding = data.startOf('day')
            } else {
                this.disabledDateEnding = moment().startOf('day')
            }
            const form = this.form
            const couponEndTime = form.getFieldValue('couponEndTime')
            if (couponEndTime) {
                if (data.isAfter(couponEndTime)) {
                    this.form.setFieldsValue({
                        couponEndTime: moment(data)
                    })
                }
            }
        },
        /**
         * @name: 券开始时间change
         */
        changeConStartData (data, dataStarting) {
            if (data) {
                this.disabledDateConStrating = data.startOf('day')
            } else {
                this.disabledDateConStrating = moment().startOf('day')
            }
            const form = this.form
            const couponEndTime = form.getFieldValue('couponEndTime')
            if (couponEndTime) {
                if (data.isAfter(couponEndTime)) {
                    this.form.setFieldsValue({
                        couponEndTime: moment(data)
                    })
                }
            }
        },
        /**
         * @name: 券结束时间
         */
        disabledDateCouEnd (curent) {
            const data = moment(this.disabledDateEnding).isAfter(this.disabledDateConStrating) ? this.disabledDateEnding : this.disabledDateConStrating
            return moment(curent).isBefore(data)
        },
        /**
         * @name:范围
         */
        getPublishRangeDropArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'schedule_coupon_publish_publish_range'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.label = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[6], 'selectDataArr', dataArr)
                    this.publishRangeDropArr = dataArr
                }
            })
        },
        /**
         * @name: 方式
         */
        getPublishWayDropArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'schedule_coupon_publish_publish_way'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.label = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.publishWayDropArr = dataArr
                }
            })
        },
        // 状态
        getStatusDropArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'schedule_coupon_publish_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.label = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[5], 'selectDataArr', dataArr)
                    this.statusDropArr = dataArr
                }
            })
        },
        /**
         * @name: 券类型
         */
        getCouponTypeDropArr () {
            axios({
                path: 'ScheduleCouponTypeDefineQueryDefineList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.couponTypeDropArr = dataArr
                }
            })
        },
        /**
         * @name: 搜索
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /* @name: 详情
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'CouponPutInRule') {
                this.getPublishWayDropArr()
                this.getPublishRangeDropArr()
                this.getStatusDropArr()
                this.getCouponTypeDropArr()
            }
        },
        'seachValue.validateStartTim' (val, oldVal) {
            if (val && this.seachValue.validateEndTime) {
                if (moment(val).isAfter(this.seachValue.validateEndTime)) {
                    this.seachValue.validateEndTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.validateEndTime' (val, oldVal) {
            if (val && this.seachValue.validateStartTim) {
                if (moment(val).isBefore(this.seachValue.validateStartTim)) {
                    this.seachValue.validateStartTim = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
.avatar-uploader > .ant-upload {
    width: 112px;
    height: 112px;

  }
</style>
<style lang="less">
.avatar-uploader{
     .ant-upload.ant-upload-select-picture-card{
         margin-left:10px;
         margin-top:5px;
         margin-bottom:15px;
     }
     .ant-upload-select-picture-card i {
        font-size: 20px;
        color: #999;
    }
    .ant-upload-select-picture-card .ant-upload-text {
        color: #666;
    }
 }
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
</style>

<!--
 * @Description: 广告管理
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-19 17:32:08
 * @LastEditors: lin
 * @LastEditTime: 2019-07-05 17:20:56
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
      @onSeach="onSeach" >
      <div class="btn-box">
        <a-button
          size="small"
          type="primary"
          icon="play-circle"
          style="margin-right:10px"
          v-action:enable
          @click="enableHandler(-1)">启用</a-button>
        <a-button size="small" type="primary" icon="stop" v-action:disable @click="disableHandler(-1)">停用</a-button>
      </div>
    </seachBox>
    <!-- main table -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增 编辑 -->
    <bt-modal
      v-model="addEditModel"
      :title="AddEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code" >
      <a-form :form="form" class="">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">广告标题</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input
                placeholder="请输入广告标题"
                v-decorator="$check('AdvertisingManagement.titles', {initialValue:tableSingleData.titles||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">内容</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0" class="setEdit">
            <a-form-item>
              <editor v-model="modalText" style="height:500px;"></editor>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">轮播图</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <a-form-item>
              <upload :fileList="fileList" :fileLength="['上传图片']" @uploadFileList="uploadFileList" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择状态"
                style="width: 100%"
                :options="statusArr"
                v-decorator="$check('AdvertisingManagement.status',{initialValue:tableSingleData.status||'marketing_advert_status:1'})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="4" :md="4" :xl="3">是否推荐</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group @change="changeIsRecommend" v-decorator="$check('AdvertisingManagement.isRecommend', {initialValue:tableSingleData.isRecommend||0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :sm="4" :md="4" :xl="3">排序</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="1"
                :disabled="sortDis"
                :max="Number.MAX_SAFE_INTEGER"
                placeholder="请输入排序"
                v-decorator="$check('AdvertisingManagement.sort', {initialValue:tableSingleData.sort||sort})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="4" :md="4" :xl="3">是否设置有效期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group @change="changeTermValidity" v-decorator="$check('AdvertisingManagement.termValidity', {initialValue:tableSingleData.termValidity||0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                :allowClear="false"
                :disabled="timeDisabled"
                :disabledDate="disabledDateStart"
                format="YYYY-MM-DD HH:00:00"
                style="width:100%"
                :disabledTime="disabledDateTime"
                :showTime="{format:'HH'}"
                v-decorator="$check('AdvertisingManagement.startTime', {initialValue:tableSingleData.startTime})"
                @change="changeData"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabled="timeDisabled"
                :allowClear="false"
                format="YYYY-MM-DD HH:00:00"
                :disabledDate="disabledDateEnd"
                :disabledTime="disabledDateTime"
                :showTime="{format:'HH'}"
                @change="changeDataEndTime"
                v-decorator="$check('AdvertisingManagement.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 预览 -->
    <a-modal
      title="广告管理预览"
      :visible="previewDetail"
      centered
      :maskClosable="false"
      :closable="false"
      width="800px"
      wrapClassName="aCol" >
      <template slot="footer">
        <a-button type="primary" @click="previewDetail=false">关闭</a-button>
      </template>
      <a-form>
        <a-row >
          <a-col :sm="8" :md="4" :xl="3">广告标题：</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="">
            {{ tableSingleData.title }}
          </a-col>
        </a-row>
        <a-row style="margin-top:20px">
          <a-col :sm="8" :md="4" :xl="3">内容：</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <pre v-html="tableSingleData.content"></pre>
          </a-col>
        </a-row>
        <a-row style="margin-top:20px">
          <a-col :sm="8" :md="4" :xl="3">轮播图：</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <div>
              <img :src="tableSingleData.coverPicture&&tableSingleData.coverPicture.split(',')[0]" alt="" height="90px" width="90px">
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
}
</style>
<style lang="less" scoped>
.setEdit{
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
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import editor from '@comp/editor/editor'
import upload from '@comp/upload'
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    name: 'AdvertisingManagement',
    components: { NewTable, SeachBox, BtModal, editor, upload },
    data () {
        return {
            conditions: [
                {
                    key: 'titles',
                    type: 'input',
                    title: '广告标题'
                },
                {
                    key: 'beginCreateTime',
                    type: 'date',
                    title: '新增开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endCreateTime',
                    type: 'date',
                    title: '新增结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    filter: true,
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'marketing_advert_status'
                    }
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                beginCreateTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endCreateTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值

            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'AdvertisingManagement.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'AdvertisingManagement.delete',
                    fc: this.deleteHandler
                },
                { name: '启用',
                    action: 'AdvertisingManagement.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'AdvertisingManagement.disable',
                    fc: this.disableHandler
                },
                { name: '预览',
                    action: 'AdvertisingManagement.get',
                    fc: this.detailHandler
                }
            ],

            // 新增 编辑 单据
            // 弹框
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            AddEditModalTitle: '', // 弹框title
            submitLoading: false,
            isAdd: false,
            // 表单
            form: this.$form.createForm(this),
            fileList: [], // 轮播图
            modalText: '', // 文本编辑器
            disabledDateStarting: moment(), // 开始时间的值
            endTimeData: moment().add({ days: 1 }), // 结束时间的值
            sortDis: true,
            timeDisabled: true,
            sort: '',

            // 预览
            previewDetail: false,

            // 下拉框
            statusArr: []
        }
    },
    computed: {},
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '1e5b0af80cf641e1a8878c73f8eb1998:AdvertisingManagement'
            this.tableApiPath = 'MarketingAdvertQueryAdvert'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getStatusDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'MarketingAdvertQueryAdvert'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
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
                this.$refs.newTable.exportFile('MarketingAdvertQueryAdvert')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'MarketingAdvertQueryAdvert' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(tableRow)
            if (tableRow.status === 'marketing_advert_status:1') {
                this.disContextMenu = ['启用', '删除']
            } else {
                this.disContextMenu = ['停用']
            }
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delData) {
            let arr = []
            const self = this
            if (delData === -1) {
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'marketing_advert_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行删除操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'MarketingAdvertDelAdvert', // 接口path名，必传
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
        enableHandler (enableData) {
            let arr = []
            const self = this
            if (enableData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要启用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'marketing_advert_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行启用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(enableData.id)
            }
            this.$confirm({
                title: '启用提示',
                content: '确定选中项全部启用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'MarketingAdvertUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_advert_status:1'
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
         * @name: 停用
         * @msg:
         * @param {type}
         * @return:
         */
        disableHandler (disData) {
            let arr = []
            const self = this

            if (disData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要停用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isEnable = newData.filter(o => o.status !== 'marketing_advert_status:1')
                if (isEnable.length > 0) {
                    this.$message.warning('只有启用状态的才能进行停用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(disData.id)
            }
            this.$confirm({
                title: '停用提示',
                content: '确定选中项全部停用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'MarketingAdvertUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_advert_status:2'
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
         * @name: 新增编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditDate) {
            this.getSort()
            this.addEditModel = true
            if (addEditDate === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '新增广告管理'
                this.tableSingleData = {}
                this.fileList = []
                this.$nextTick(() => {
                    this.disabledDateStarting = moment()
                })
                this.sortDis = true
                this.timeDisabled = true
                this.modalText = ''
            } else {
                this.fileList = []
                this.isAdd = false
                this.AddEditModalTitle = '编辑广告管理'
                const obj = { ...addEditDate }
                obj.startTime = addEditDate.startTime ? moment(obj.startTime).set('minute', 0).set('second', 0) : addEditDate.startTime
                obj.endTime = addEditDate.endTime ? moment(obj.endTime).set('minute', 0).set('second', 0) : addEditDate.endTime
                const pic = obj.coverPicture.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
                this.$nextTick(() => {
                    this.disabledDateStarting = addEditDate.startTime ? obj.startTime : moment()
                })
                this.modalText = obj.content
                this.tableSingleData = obj
                this.sortDis = obj.isRecommend !== 1
                this.timeDisabled = obj.termValidity !== 1
            }
        },
        /**
         * @name: 新增 编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    if (!this.modalText) {
                        return this.$message.error('请输入内容')
                    } else {
                        values.content = this.modalText
                    }
                    if (this.fileList.length === 0) {
                        return this.$message.error('请上传轮播图')
                    } else {
                        const fileList = this.fileList.map(x => x.fileUrl)
                        values.coverPicture = fileList.join(',')
                    }
                    if (values.termValidity === 1) {
                        if (!values.startTime) {
                            return this.$message.error('请选择开始时间')
                        }
                        if (!values.endTime) {
                            return this.$message.error('请选择结束时间')
                        }
                    }
                    if (values.endTime) {
                        values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (values.startTime) {
                        values.startTime = values.startTime.format('YYYY-MM-DD HH:mm:ss')
                    }
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'MarketingAdvertAddAdvert' : 'MarketingAdvertUpdateAdvert',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModel = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 图片上传
         * @msg:
         * @param {type}
         * @return:
         */
        uploadFileList (data) {
            this.fileList = data
        },
        /**
         * @name: 开始时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateStart (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 开始时间改变时
         * @msg:
         * @param {type}
         * @return:
         */
        changeData (data, dataString) {
            console.log(dataString)
            this.disabledDateStarting = dataString
        },
        /**
         * @name:结束时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateEnd (curent) {
            return moment(curent).isBefore(moment(this.disabledDateStarting).startOf('day'))
        },
        /**
         * @name: 结束时间
         * @msg:
         * @param {type}
         * @return:
         */
        changeDataEndTime (endtimeVal, endtimeValString) {
            this.endTimeData = endtimeValString
        },
        range (start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },
        disabledDateTime () {
            return {
                disabledMinutes: () => this.range(1, 60),
                disabledSeconds: () => this.range(1, 60)
            }
        },
        /**
         * @name: 是否推荐值改变
         * @msg:
         * @param {type}
         * @return:
         */
        changeIsRecommend (e) {
            if (e.target.value === 1) {
                this.sortDis = false
            } else {
                this.sortDis = true
                if (this.isAdd) {
                    this.form.setFieldsValue({
                        sort: this.sort
                    })
                } else {
                    this.form.setFieldsValue({
                        sort: this.tableSingleData.sort
                    })
                }
            }
        },
        /**
         * @name: 是否设置有改变
         * @msg:
         * @param {type}
         * @return:
         */
        changeTermValidity (e) {
            if (e.target.value === 1) {
                this.timeDisabled = false
                if (this.isAdd) {
                    this.form.setFieldsValue({
                        startTime: moment().set('minute', 0).set('second', 0),
                        endTime: moment().add({ days: 1 }).set('minute', 0).set('second', 0)
                    })
                } else {
                    this.form.setFieldsValue({
                        startTime: this.tableSingleData.startTime,
                        endTime: this.tableSingleData.endTime
                    })
                }
            } else {
                this.timeDisabled = true
                this.form.setFieldsValue({
                    startTime: null,
                    endTime: null
                })
            }
        },
        /**
         * @name: 获取状态
         * @msg:
         * @param {type}
         * @return:
         */
        getStatusDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'marketing_advert_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.statusArr = dataArr
                }
            })
        },
        /**
         * @name: 获取排序的值
         * @msg:
         * @param {type}
         * @return:
         */
        getSort () {
            axios({
                path: 'MarketingAdvertQueryMaxSort',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.sort = res.data
                }
            })
        },
        /**
         * @name: 预览
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.previewDetail = true
        }

    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'AdvertisingManagement') {
                this.getStatusDorpArr()
            }
        },
        'seachValue.beginCreateTime' (val, oldVal) {
            if (val && this.seachValue.endCreateTime) {
                if (moment(val).isAfter(this.seachValue.endCreateTime)) {
                    this.seachValue.endCreateTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endCreateTime' (val, oldVal) {
            if (val && this.seachValue.beginCreateTime) {
                if (moment(val).isBefore(this.seachValue.beginCreateTime)) {
                    this.seachValue.beginCreateTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        disabledDateStarting (val, oldval) {
            if (val) {
                if ((moment(val)).isAfter(this.endTimeData)) {
                    this.form.setFieldsValue({
                        endTime: moment(val)
                    })
                }
            }
        }
    }
}
</script>

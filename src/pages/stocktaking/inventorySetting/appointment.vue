<!--
 * @Description: 预约管理
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: lmt
 * @Date: 2019-03-13 08:57:12
 * @LastEditTime: 2019-04-16 18:59:21
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
      <a-button type="primary" size="small" @click="addHandler(0)" v-action:add>小时工预约</a-button>
      <a-button type="primary" size="small" @click="addHandler(1)" style="margin-left:10px;margin-right:10px" v-action:add>盘点预约</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onSelect"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <a-modal
      :title="addEditModalTitle"
      v-model="addEditModal"
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
          <a-col :span="4">预约类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 100%" v-decorator="$check('management.bookingType', {initialValue:selectedSingleRow.bookingType || ''})" :options="bookingTypeArr" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="isTemporary">盘点编码</a-col>
          <a-col :span="8" v-if="isTemporary">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                optionFilterProp="children"
                :filterOption="filterOption"
                v-decorator="$check('management.defineCode', {initialValue:selectedSingleRow.defineCode || ''})"
                :options="defineCodeArr"
                allowClear
                @change="defineCodeChangeHandler"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">标题</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入标题" v-decorator="$check('management.bookingTitle', {initialValue:selectedSingleRow.bookingTitle})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">设定人数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number :min="1" :max="9999" v-decorator="$check('management.setNumber', {initialValue:selectedSingleRow.setNumber || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">预约门店</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('management.bookingStorecode', {initialValue:selectedSingleRow.bookingStorecode || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">预约开始时间</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledStartDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('management.bookingStart',{initialValue:selectedSingleRow.bookingStart})"
                @change="changeStart"
                showTime/>
            </a-form-item>
          </a-col>
          <a-col :span="4">预约结束时间</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('management.bookingEnd',{initialValue:selectedSingleRow.bookingEnd})"
                showTime/>
            </a-form-item>
          </a-col>
          <a-col :span="4">到岗时间</a-col>
          <a-col :span="isTemporary?8:20">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledArrivalDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('management.arrivalDate',{initialValue:selectedSingleRow.arrivalDate})"
                showTime/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入描述" :autosize="{ minRows: 2, maxRows: 6 }" style="height:40px;padding:0 5px;max-height:40px;width:100%" v-decorator="$check('provider.bookingDescription', {initialValue:selectedSingleRow.bookingDescription || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" style="height:40px;padding:0 5px;max-height:40px;width:100%" v-decorator="$check('provider.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 预约作废模态框 -->
    <a-modal
      title="预约作废"
      v-model="invalidModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="invalidSubmit">确定</a-button>
      </template>
      <a-form :form="invalidForm">
        <a-row class="doc">
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入作废备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('management.note', {initialValue:selectedSingleRow.bookingDescription || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import is from 'is_js'
import map from 'lodash.map'
export default {
    name: 'Appointment',
    components: {
        NewTable,
        SeachBox
    },
    data () {
        return {
            // 表单
            form: this.$form.createForm(this),
            invalidForm: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['del'],
            // 工具栏表单组
            conditions: [
                {
                    key: 'bookingStorecode',
                    type: 'select',
                    title: '分店名称',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'defineCode',
                    type: 'select',
                    title: '盘点编码',
                    label: ['code', 'stocktakingDate'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    key: 'bookingStatus',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'booking_management_booking_status'
                    }
                },
                {
                    key: 'bookingStart',
                    type: 'date',
                    title: '开始时间',
                    mat: 'YYYY-MM-DD HH:mm:ss',
                    showTime: true
                },
                {
                    key: 'bookingEnd',
                    type: 'date',
                    title: '结束时间',
                    mat: 'YYYY-MM-DD HH:mm:ss',
                    showTime: true
                },
                {
                    key: 'bookingTitle',
                    type: 'input',
                    title: '盘点名称'
                }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 表格右键菜单
            menuOpt: [
                { name: '编辑',
                    action: 'appointment.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'appointment.get',
                    fc: e => this.$refs.newTable.showDetails('预约管理详情', e)
                }, { name: '审核',
                    action: 'appointment.verify',
                    fc: ({ id }) => { this.appointmentAudit(id) }
                }, { name: '作废',
                    action: 'appointment.edit',
                    fc: ({ id }) => { this.appointmentInvalid(id) }
                }, { name: '删除',
                    action: 'appointment.delete',
                    fc: this.deleteHandler
                }
            ],
            // 添加标识
            isAdd: true,
            // 加载标识
            loading: false,
            // 表格删除id集合
            rowsId: [],
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增/编辑模态框标题
            addEditModalTitle: '',
            // 新增/编辑模态框打开/关闭标识
            addEditModal: false,
            // 新增/编辑模态框中盘点编码数据获取
            defineCodeArr: [],
            // 新增/编辑模态框中预约类型数据获取
            bookingTypeArr: [],
            // 新增/编辑模态框中状态数据获取
            bookingStatusArr: [],
            // 表格右键菜单禁用
            disContextMenu: [],
            // 作废模态框打开/关闭标识
            invalidModal: false,
            // 作废数据id
            invalidId: '',
            // 临时工标示
            isTemporary: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '4d32f8d28e2842ab9b42ac0730bb929b:appointment'
            this.tableApiPath = 'BookingManagementFind'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getDefineCode()
        this.getBookingType()
        this.getBookingStatus()
    },
    methods: {
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
            e.path = 'BookingManagementFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'del') {
                if (this.rowsId.length > 0) {
                    this.onDel()
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            }
        },
        /**
         * @name: 表格选择
         */
        onSelect (k, r) {
            this.rowsId = map(r, 'id')
        },
        addHandler (index) {
            console.log(index)
            this.addEdit(-1)
            if (index === 0) {
                this.isTemporary = false
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        bookingType: 'booking_management_booking_type:2'
                    })
                })
            } else {
                this.isTemporary = true
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        bookingType: 'booking_management_booking_type:1'
                    })
                })
            }
        },
        // 新增/编辑模态框
        addEdit (index) {
            this.getDefineCode()
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.addEditModalTitle = '新增预约管理信息'
            } else {
                this.isAdd = false
                this.addEditModalTitle = '编辑预约管理信息'
            }
            this.addEditModal = true
        },
        // 单项/多项删除
        onDel () {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'BookingManagementDel',
                        method: 'post',
                        body: {
                            ids: self.rowsId
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(self.rowsId, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 右键监听
         */
        onContextmenuChange (row) {
            if (row.bookingStatus === 'booking_management_booking_status:1') {
                this.disContextMenu = ['作废']
            } else if (row.bookingStatus === 'booking_management_booking_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            } else {
                this.disContextMenu = ['编辑', '删除', '审核', '作废']
            }
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            this.selectedSingleRow.bookingStart = moment(this.selectedSingleRow.bookingStart)
            this.selectedSingleRow.bookingEnd = moment(this.selectedSingleRow.bookingEnd)
            this.selectedSingleRow.arrivalDate = moment(this.selectedSingleRow.arrivalDate)
            this.addEdit()
        },
        /**
         * @name: 表格右键审核监听
         */
        appointmentAudit (id) {
            const self = this
            this.$confirm({
                title: '警告',
                content: '审核后不可取消，是否继续？',
                onOk () {
                    axios({
                        path: 'BookingManagementApproval',
                        method: 'POST',
                        body: {
                            id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData(self.tableCode, {
                                path: self.tableApiPath
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 表格右键作废监听
         */
        appointmentInvalid (id) {
            this.invalidId = id
            console.log(id)
            this.invalidModal = true
        },
        /**
         * @name:表格右击删除监听
         */
        deleteHandler (row) {
            this.rowsId.push(row.id)
            this.onDel()
        },
        // 盘点编码搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        // 模态框关闭
        subCancel () {
            this.addEditModal = false
            this.invalidModal = false
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
                    values.arrivalDate = moment(values.arrivalDate).format('YYYY-MM-DD HH:mm:ss')
                    values.bookingStart = moment(values.bookingStart).format('YYYY-MM-DD HH:mm:ss')
                    values.bookingEnd = moment(values.bookingEnd).format('YYYY-MM-DD HH:mm:ss')
                    values.bookingStorecode = values.bookingStorecode.split('-')[0]
                    axios({
                        path: this.isAdd ? 'BookingManagementAdd' : 'BookingManagementUpdate',
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
        /**
         * @name: 作废信息提交
         */
        invalidSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.id = this.invalidId
                    axios({
                        path: 'BookingManagementInvalid',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.invalidModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 新增/编辑模态框中盘点编码数据获取
         */
        getDefineCode () {
            axios({
                path: 'StocktakeDefineFindOngoingOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(111111, data)
                    data.forEach((item, index) => {
                        item.stocktakingDate = moment(item.stocktakingDate).format('YYYY-MM-DD')
                        item.key = index + 1
                        item.title = `${item.code}-${item.storeName}-${item.stocktakingDate}`
                        item.value = item.code
                    })
                    this.defineCodeArr = [...res.data]
                }
            })
        },
        /**
         * @name: 新增/编辑模态框预约类型数据获取
         */
        getBookingType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'booking_management_booking_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.bookingTypeArr = [...res.data]
                }
            })
        },
        /**
         * @name: 新增/编辑模态框状态数据获取
         */
        getBookingStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'booking_management_booking_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.bookingStatusArr = [...res.data]
                }
            })
        },
        // 预约开始时间changeHandler
        changeStart (date, dateString) {
            // this.$nextTick(() => {
            //     this.form.setFieldsValue({
            //         bookingEnd: moment(date).add({ days: 1 })
            //     })
            // })
        },
        // 预约开始时间禁用
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('minute'))
        },
        // 预约结束时间禁用
        disabledEndDate (current) {
            const StartDate = this.form.getFieldsValue().bookingStart
            if (is.undefined(StartDate)) {
                return true
            } else {
                return moment(current).isBefore(moment(StartDate))
            }
        },
        // 到岗时间禁用
        disabledArrivalDate (current) {
            return moment(current).isBefore(moment().startOf('days'))
        },
        // 盘点编码监听
        defineCodeChangeHandler (value) {
            const tempObj = this.defineCodeArr.filter(item => {
                return item.code === value
            })[0]
            this.$nextTick(() => {
                this.form.setFieldsValue({
                    bookingStorecode: `${tempObj.storeCode}-${tempObj.storeName}`
                })
            })
        }

    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'appointment') {
                this.getDefineCode()
                this.getBookingType()
                this.getBookingStatus()
            }
        },
        'seachValue.bookingStorecode': {
            handler (val) {
                if (val) {
                    axios({
                        path: 'StocktakeDefineFindDefineByStoreCode',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.seachValue, 'defineCode', '')
                            this.$set(this.conditions[1], 'selectDataArr', res.data)
                        }
                    })
                } else {
                    this.$set(this.conditions[1], 'selectDataArr', [])
                }
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
.ant-input-number{
    width: 100%;
}
</style>

<!--
 * @Description: 电子券定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-08 09:37:27
 * @LastEditTime: 2019-07-23 20:17:21
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
          v-action:edit
          size="small"
          style="margin-right:10px"
          icon="file-done"
          @click="confirm('isM')">确认</a-button>
        <a-button
          type="primary"
          v-action:edit
          size="small"
          style="margin-right:10px"
          icon="stop"
          @click="disable('isM')">停用</a-button>
        <a-button
          type="primary"
          v-action:verify
          size="small"
          icon="check-circle"
          @click="using('isM')">启用</a-button>
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
    <!-- 新增编辑弹框 -->
    <a-modal
      v-model="addEditModal"
      :title="addEditModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered >
      <template slot="footer">
        <a-button @click="addEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="submitClick">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">电子券类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入券类型"
                v-decorator="$check('ElectronicTicketDefine.name',{initialValue:tableSingleData.name})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">状态</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                disabled
                style="width:100%"
                placeholder=""
                v-decorator="$check('ElectronicTicketDefine.statusName',{initialValue:tableSingleData.statusName||'未确认'})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">电子券金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入券金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('ElectronicTicketDefine.amount', {initialValue:tableSingleData.amount||0})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">销售价</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入销售价"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('ElectronicTicketDefine.amount1', {initialValue:tableSingleData.amount||0})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">发放角色</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-select
                placeholder="请选择用户"
                style="width:90%"
                ref="userRef"
                mode="multiple"
                :maxTagCount="3"
                :options="roleUserArr"
                :open="false"
                v-model="roleUserSelectArr"
                allowClear
              />
              <a href="javascript:;" @click="usersAdd">
                <a-icon style="width:10%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :span="4">每人限领数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入限领数量"
                style="width:100%"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                v-decorator="$check('ElectronicTicketDefine.amount3', {initialValue:tableSingleData.amount||1})"/>
            </a-form-item>
          </a-col>
          <a-col span="4">截止日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                placeholder="请选择截止日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                :disabledDate="disabledDateOrder"
                v-decorator="$check('ActivityRule.effectDate', {initialValue:tableSingleData.effectDate||setStartTime})"/>
            </a-form-item>
          </a-col>
          <users
            :visible.sync="usersVisible"
            @onSelect="onUsersSelect"
            :defaultSelect="roleUserSelectArr"/>
        </a-row>
        <!-- <a-row class="lastChildCrm">
          <a-col :span="3">备注</a-col>
          <a-col :span="21">
            <a-form-item>
              <a-textarea
                style="width:100%"
                :rows="2"
                placeholder="请输入备注"
                v-decorator="$check('ElectronicTicketDefine.note',{initialValue:tableSingleData.note})"
              />
            </a-form-item>
          </a-col>
        </a-row> -->
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.btn-box{
  display: flex;
  display: -webkit-flex;
  flex-flow:row nowrap;
}
</style>
<style lang="less" scoped>
.lastChildCrm{
    border:1px solid #e8e8e8;
    background-color: #f5f5f5;
    .ant-form-item  {
        margin-bottom:0px;
    }
    .ant-col-3 {
        text-align: right;
        font-weight: bold;
        padding-right: 10px;
        font-size: 12px;
        background-color: #f5f5f5;
        line-height: 36px;
    }
    textarea.ant-input {
        margin-bottom:0px;
        min-height: 36px;
        border-radius:0;
    }

}
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import users from './components/issueRole'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'ElectronicTicketDefine',
    components: { NewTable, SeachBox, users },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '券编码/类型'
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
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'electronic_coupon_status'
                    }
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 主表格
            tableCode: '',
            tableApiPath: '',
            disContextMenu: [],
            moenuOPT: [
                { name: '编辑',
                    action: 'ElectronicTicketDefine.edit',
                    fc: this.addEdit
                },
                { name: '确认',
                    action: 'ElectronicTicketDefine.verify',
                    fc: this.confirm
                },
                { name: '停用',
                    action: 'ElectronicTicketDefine.disable',
                    fc: this.disable
                },
                { name: '启用',
                    action: 'ElectronicTicketDefine.enable',
                    fc: this.using
                },
                { name: '删除',
                    action: 'ElectronicTicketDefine.delete',
                    fc: this.deleteHandler
                }
                // {
                //     name: '详情',
                //     action: 'ElectronicTicketDefine.get',
                //     fc: e => this.$refs.newTable.showDetails('电子券类型定义详情', e)
                // }
            ],
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],

            // 新增编辑弹框
            addEditModal: false,
            addEditModalTitle: '',
            submitLoading: false,
            form: this.$form.createForm(this),
            isAdd: false,
            // 发放校色
            usersVisible: false,
            roleUserSelectArr: [],

            // 下拉框
            roleUserArr: []
        }
    },
    computed: {
        setStartTime () {
            return moment().add(1, 'days')
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '461f4ce04d984ce78c0993a6bad1b5df:ElectronicTicketDefine'
            this.tableApiPath = 'ElectronicCouponQueryList'
            this.$refs.newTable.setContextmenu(this.moenuOPT)
        })
        this.queryUser()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ElectronicCouponQueryList'
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
                this.$refs.newTable.exportFile('ElectronicCouponQueryList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ElectronicCouponQueryList' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'electronic_coupon_status:1') {
                this.disContextMenu = ['停用', '启用']
            } else if (tableRow.status === 'electronic_coupon_status:2') {
                this.disContextMenu = ['编辑', '删除', '确认', '启用']
            } else if (tableRow.status === 'electronic_coupon_status:3') {
                this.disContextMenu = ['编辑', '删除', '确认', '停用']
            }
        },
        /**
         * @name: 新增编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.addEditModal = true
            if (addEditData === -1) {
                this.tableSingleData = {}
                this.addEditModalTitle = '新增电子券定义'
                this.isAdd = true
            } else {
                this.addEditModalTitle = '编辑电子券定义'
                this.isAdd = false
                this.tableSingleData = { ...addEditData }
            }
        },
        /**
         * @name: 新增编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (values.amount === 0) {
                        return this.$message.error('输入的券金额要大于0')
                    }
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'ElectronicCouponAdd' : 'ElectronicCouponUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 发放角色
        usersAdd () {
            this.usersVisible = true
            this.$refs.userRef.blur()
        },
        onUsersSelect (e) {
            this.roleUserSelectArr = map(e, 'code')
        },
        /**
         * @name: 截至日期
         */
        disabledDateOrder (curent) {
            return moment(curent).isBefore(moment().startOf('day')).add(1, 'days')
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
                    this.roleUserArr = [...data]
                }
            })
        },
        /**
         * @name: 确认
         * @msg:
         * @param {type}
         * @return:
         */
        confirm (confirmData) {
            const arr = []
            const self = this
            if (confirmData === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    return this.$message.warning('请选择要进行此操作的列表')
                }
                const isConfirm = this.tableRowsArr.filter(o => o.status !== 'electronic_coupon_status:1')
                if (isConfirm.length > 0) {
                    return this.$message.warning('只有未确认的状态才能进行此操作')
                }
                this.tableIdsArr.forEach(item => {
                    arr.push({ id: item, type: '1' })
                })
            } else {
                arr.push({ id: confirmData.id, type: '1' })
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项进行确认？进行后将不可恢复',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ElectronicCouponUpdateStatus',
                        method: 'post',
                        body: {
                            ids: arr
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
        disable (disableData) {
            const arr = []
            const self = this
            if (disableData === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    return this.$message.warning('请选择要进行此操作的列表')
                }
                const isConfirm = this.tableRowsArr.filter(o => o.status !== 'electronic_coupon_status:2')
                if (isConfirm.length > 0) {
                    return this.$message.warning('只有已确认的状态才能进行此操作')
                }
                this.tableIdsArr.forEach(item => {
                    arr.push({ id: item, type: '2' })
                })
            } else {
                arr.push({ id: disableData.id, type: '2' })
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项进行停用？进行后将不可恢复',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ElectronicCouponUpdateStatus',
                        method: 'post',
                        body: {
                            ids: arr
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
         * @name: 启用
         * @msg:
         * @param {type}
         * @return:
         */
        using (useData) {
            const arr = []
            const self = this
            if (useData === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    return this.$message.warning('请选择要进行此操作的列表')
                }
                const isConfirm = this.tableRowsArr.filter(o => o.status !== 'electronic_coupon_status:3')
                if (isConfirm.length > 0) {
                    return this.$message.warning('只有已停用的状态才能进行此操作')
                }
                this.tableIdsArr.forEach(item => {
                    arr.push({ id: item, type: '3' })
                })
            } else {
                arr.push({ id: useData.id, type: '3' })
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项进行启用？',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ElectronicCouponUpdateStatus',
                        method: 'post',
                        body: {
                            ids: arr
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
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delData) {
            const arr = []
            const self = this
            if (delData === -1) {
                if (this.tableIdsArr.length === 0) {
                    return this.$message.warning('请选择要进行此操作的列表')
                }
                const isConfirm = this.tableRowsArr.filter(o => o.status !== 'electronic_coupon_status:1')
                if (isConfirm.length > 0) {
                    return this.$message.warning('只有未确认的状态才能进行此操作')
                }
                this.tableIdsArr.forEach(item => {
                    arr.push({ id: item })
                })
            } else {
                arr.push({ id: delData.id })
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ElectronicCouponDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(map(arr, 'id'), 'id')
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'ElectronicTicketDefine') {
                this.queryUser()
            }
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
        }
    }
}
</script>

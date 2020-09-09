<!--
 * @Description: 积分兑换规则定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-19 17:31:49
 * @LastEditors: lin
 * @LastEditTime: 2019-07-03 12:49:46
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
    <!-- 新增  编辑 -->
    <a-modal
      v-model="addEditModal"
      :title="addEditModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered>
      <template slot="footer">
        <!-- <a-popconfirm title="确认放弃已填写的信息？" @confirm="submitCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm> -->
        <a-button key="back" @click="addEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="submitClick">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">积分金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                v-decorator="$check('IntegralExchange.pointAmount', {initialValue:tableSingleData.pointAmount||0.00},handlePointAmount)"
                placeholder="请输入积分金额"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">电子券额度</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                v-decorator="$check('IntegralExchange.couponAmount', {initialValue:tableSingleData.couponAmount||0.00},handleAmount)"
                placeholder="请输入电子券额度"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">可兑换次数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                v-decorator="$check('IntegralExchange.convertAmount', {initialValue:tableSingleData.convertAmount||1})"
                placeholder="请输入可兑换量"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">状态</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择状态"
                style="width: 100%"
                :options="statusArr"
                v-decorator="$check('IntegralExchange.status',{initialValue:tableSingleData.status||'marketing_points_convert_status:1'})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">备注</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                style="width:100%"
                placeholder="请输入备注"
                v-decorator="$check('IntegralExchange.note',{initialValue:tableSingleData.note||''})"
              />
            </a-form-item>
          </a-col>
        </a-row>
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
    .ant-col-4 {
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
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    name: 'IntegralExchangeRuleDefinie',
    components: { NewTable, SeachBox },
    data () {
        return {
            conditions: [
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    filter: true,
                    label: 'title',
                    value: ['type', 'configKey'],
                    selectDataArr: []
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '制单开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制单结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '新增人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
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
                    action: 'IntegralExchangeRuleDefinie.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'IntegralExchangeRuleDefinie.delete',
                    fc: this.deleteHandler
                },
                { name: '启用',
                    action: 'IntegralExchangeRuleDefinie.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'IntegralExchangeRuleDefinie.disable',
                    fc: this.disableHandler
                }
            ],

            // 新增 编辑
            addEditModal: false,
            addEditModalTitle: '',
            submitLoading: false,
            form: this.$form.createForm(this),
            isAdd: false,

            // 下拉框
            statusArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'a718b4dfcf9e48cdb6bee547570e7e01:IntegralExchangeRuleDefinie'
            this.tableApiPath = 'PointConvertQueryPointsConvertList'
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
            e.path = 'PointConvertQueryPointsConvertList'
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
                this.$refs.newTable.exportFile('GroupDefineQuery')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'PointConvertQueryPointsConvertList' })
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
            if (tableRow.status === 'marketing_points_convert_status:1') {
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
                const isDisabled = newData.filter(o => o.status !== 'marketing_points_convert_status:2')
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
                        path: 'PointConvertDeletePointsConvert', // 接口path名，必传
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
                const isDisabled = newData.filter(o => o.status !== 'marketing_points_convert_status:2')
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
                        path: 'PointConvertUpdateMarketingConvertStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_points_convert_status:1'
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
                const isEnable = newData.filter(o => o.status !== 'marketing_points_convert_status:1')
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
                        path: 'PointConvertUpdateMarketingConvertStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_points_convert_status:2'
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
            if (addEditData === -1) {
                this.addEditModalTitle = '新增兑换规则定义'
                this.isAdd = true
                this.tableSingleData = {}
            } else {
                this.addEditModalTitle = '编辑兑换规则定义'
                this.isAdd = false
            }
            this.addEditModal = true
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
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'PointConvertAddPointsConvert' : 'PointConvertUpdatePointsConvert',
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
        /**
         * @name: 表单校验
         * @msg:
         * @param {type}
         * @return:
         */
        handlePointAmount (rule, value, callback) {
            if (value === 0) {
                const str = '输入的积分金额不能为0'
                callback(str)
            } else {
                callback()
            }
        },
        /**
         * @name: 表单校验
         * @msg:
         * @param {type}
         * @return:
         */
        handleAmount (rule, value, callback) {
            if (value === 0) {
                const str = '输入的电子券额度不能为0'
                callback(str)
            } else {
                callback()
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
                    type: 'marketing_points_convert_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[0], 'selectDataArr', dataArr)
                    this.statusArr = dataArr
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'IntegralExchangeRuleDefinie') {
                this.getStatusDorpArr()
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

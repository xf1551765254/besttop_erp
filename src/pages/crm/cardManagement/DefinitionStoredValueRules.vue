<!--
 * @Description: 储值规则定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-21 18:41:48
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 11:11:11
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增弹框 -->
    <a-modal
      v-model="AddEditModal"
      class="doc"
      :title="AddEditModalTile"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      wrapClassName="setDocCss"
      style="top: 20px;"
      destroyOnClose
      centered>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">规则名称</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('StoredValueRules.name', {initialValue:tableSingleData.name})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">定义额度</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                placeholder="请输入定义额度"
                v-decorator="$check('StoredValueRules.limitValue', {initialValue:tableSingleData.limitValue||0.00},limitValueHandler)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" class="">定义类型</a-col>
          <a-col :span="8" style="">
            <a-form-item class="">
              <a-select
                placeholder="请选择定义类型"
                style="width:100%"
                @change="changeTypeValue"
                v-decorator="$check('StoredValueRules.type', {initialValue:tableSingleData.type||'1'})">
                <a-select-option value="1">赠送额度</a-select-option>
                <a-select-option value="2">折扣</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="defaultType==='1'">赠送额度</a-col>
          <a-col :span="8" v-if="defaultType==='1'">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                placeholder="请输入赠送额度"
                v-decorator="$check('StoredValueRules.sendValue', {initialValue:tableSingleData.sendValue||0.00})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="defaultType==='2'">折扣（%）</a-col>
          <a-col :span="8" v-if="defaultType==='2'">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="100"
                :precision="2"
                :step="1"
                placeholder="请输入折扣"
                v-decorator="$check('StoredValueRules.sendValue1', {initialValue:tableSingleData.sendValue1||0.00},limitValueHandler)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4" class="">是否修改额度</a-col>
          <a-col :span="8" style="">
            <a-form-item class="">
              <a-select
                placeholder="请选择是否修改额度"
                style="width:100%"
                v-decorator="$check('StoredValueRules.modifyFlag', {initialValue:tableSingleData.modifyFlag||0})">
                <a-select-option :value="0">不可修改</a-select-option>
                <a-select-option :value="1">可修改</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">开始日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledStartDate"
                @change="handleStartChange"
                v-decorator="$check('StoredValueRules.startTime',{initialValue:tableSingleData.startTime})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">结束日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledEndDate"
                v-decorator="$check('StoredValueRules.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="AddEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="subLoading" @click="handleSubmit">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.table-nowrap{
    white-space:nowrap;
    text-overflow:ellipsis;
    margin: 0 10px;
}
.setDocCss .ant-select-disabled svg{
    display: none;
}
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox },
    name: 'DefinitionStoredValueRules',
    data () {
        return {
            conditions: [
                {
                    key: 'name',
                    type: 'input',
                    title: '规则名称'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '定义开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '定义结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'ruleBy',
                    type: 'select',
                    title: '规则定义人',
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
            menuOpt: [
                { name: '编辑',
                    action: 'DefinitionStoredValueRules.edit',
                    fc: this.addEditHandler
                },
                { name: '删除',
                    action: 'DefinitionStoredValueRules.delete',
                    fc: this.deleteHandler
                }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            // 新增
            form: this.$form.createForm(this),
            AddEditModal: false, //
            AddEditModalTile: '',
            subLoading: false,
            isAdd: false, // 判断 是否为新增  编辑
            cardName: '', // 卡名称
            defaultType: '1', // 定义类型
            disabledDateStarting: moment()// 开始日期
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ca779a1fb0d0455d9f97f89e1b90984c:DefinitionStoredValueRules'
            this.tableApiPath = 'CardRuleQueryCardRules'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
    /**
    * @name: // 表格数据搜索
    */
        onSeach (e) {
            e.path = 'CardRuleQueryCardRules'
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
            if (e === 'export') {
                this.$refs.newTable.exportFile('CardRuleQueryCardRules')
            } else if (e === 'add') {
                this.addEditHandler(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            }
        },
        /**
    * @name: 刷新表格
    */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardRuleQueryCardRules' })
        },
        /**
     * @name: 表格右击
    */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'card_rule_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '删除']
            }
        },
        /**
     * @name: 表格的多选
     */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
     * @name: 删除
     */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                // const newData = [...this.tableRowsArr]
                // const NoDel = newData.filter(o => o.status !== 'schedule_rule_define_status:1')
                // if (NoDel.length > 0) {
                //     this.$message.warning('只有未审核的才能进行此操作')
                //     return
                // }
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
                        path: 'CardRuleDelete', // 接口path名，必传
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
     * @name: 弹框关闭
     */
        formCancel () {
            this.AddEditModal = false
        },
        /**
     * @name: 新增
     */
        addEditHandler (addEditDate) {
            this.AddEditModal = true
            if (addEditDate === -1) {
                this.isAdd = true
                this.AddEditModalTile = '新增储值规则定义'
                this.tableSingleData = {}
                this.defaultType = '1'
                this.$nextTick(() => {
                    this.disabledDateStarting = moment().startOf('day')
                })
            } else {
                this.isAdd = false
                this.AddEditModalTile = '编辑储值规则定义'
                const obj = { ...addEditDate }
                this.defaultType = addEditDate.type
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                this.$nextTick(() => {
                    this.disabledDateStarting = obj.startTime
                })
                obj.sendValue1 = obj.sendValue
                this.tableSingleData = obj
            }
        },
        /**
     * @name:弹框体提交:
     */
        handleSubmit (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.ruleStore = this.tableSingleData.ruleStore
                    } else {
                        values.ruleStore = this.$store.getters.storeInfo.code
                    }
                    if (values.type === '2') {
                        values.sendValue = values.sendValue1
                    }
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'CardRuleAdd' : 'CardRuleUpdate',
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
     * @name: 定义类型
     */
        changeTypeValue (value) {
            this.defaultType = value
        },
        /**
     * @name: 开始时间变化
    */
        handleStartChange (data, dataStarting) {
            if (data) {
                this.disabledDateStarting = data.startOf('day')
            } else {
                this.disabledDateStarting = moment().startOf('day')
            }
            const form = this.form
            const endTime = form.getFieldValue('endTime')
            if (endTime) {
                if (data.isAfter(endTime)) {
                    this.form.setFieldsValue({
                        endTime: moment(data)
                    })
                }
            }
        },
        /**
    * @name: 开始时间禁用
    */
        disabledStartDate (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
    * @name: 结束时间禁用
    */
        disabledEndDate (curent) {
            return moment(curent).isBefore(this.disabledDateStarting)
        },
        /**
     * @name: 定义金额
     */
        limitValueHandler (rule, value, callback) {
            if (value === 0) {
                const str = '输入的不能为0'
                callback(str)
            } else {
                callback()
            }
        }
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
        }
    }
}
</script>

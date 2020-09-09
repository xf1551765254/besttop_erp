<!--
 * @Description: 档期活动定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 11:01:00
 * @LastEditTime: 2019-08-20 17:40:01
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
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增 编辑 按钮 -->
    <bt-modal
      :title="SchedulModalTitle"
      v-model="SchedulAddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :tags="tags">
      <div style="padding-right:11%">
        <a-form :form="form">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">档期名称</a-col>
            <a-col :sm="16" :md="20" :xl="21">
              <a-form-item>
                <a-input
                  placeholder="请输入档期名称"
                  :disabled="effectActive"
                  v-decorator="$check('Schedule.name', {initialValue:defaultForm.name||''})"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">生效机构 </a-col>
            <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px" v-if="!effectActive">
              <a-form-item>
                <a-select
                  ref="storeEffectRef"
                  placeholder="请选择生效机构"
                  mode="multiple"
                  :open="false"
                  style="width:90%"
                  v-model="tempObjArrEffect"
                  :options="effectStoreArr"
                  :autoFocus="true"
                  allowClear>
                </a-select>
                <a href="javascript:;" @click="selectFocusEffect">
                  <a-icon style="width:10%;line-height:36px;" type="edit" />
                </a>
                <!-- 生效分店 -->
                <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
              </a-form-item>
            </a-col>
            <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px" v-else>
              <a-form-item>
                <a-select
                  ref="storeEffectRef"
                  placeholder=""
                  mode="multiple"
                  disabled
                  :open="false"
                  style="width:100%"
                  v-model="tempObjArrEffect"
                  :options="effectStoreArr"
                  :autoFocus="true"
                  allowClear>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
            <a-col :sm="16" :md="8" :xl="9">
              <a-form-item>
                <a-date-picker
                  :disabledDate="disabledDateStart"
                  style="width:100%"
                  :disabled="effectActive"
                  v-decorator="$check('Schedule.startTime', {initialValue:defaultForm.startTime})"
                  @change="changeData"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
            <a-col :sm="16" :md="8" :xl="9">
              <a-form-item>
                <a-date-picker
                  style="width:100%"
                  :disabledDate="disabledDate"
                  @change="changeDataEndTime"
                  v-decorator="$check('Schedule.endTime', {initialValue:defaultForm.endTime})"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3" class="">
              档期描述
            </a-col>
            <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
              <a-form-item class="">
                <a-textarea
                  placeholder="请输入描述"
                  :rows="2"
                  v-decorator="$check('Schedule.note', {initialValue:defaultForm.note||''})"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">定义时间</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-date-picker
                  disabled
                  style="width:100%"
                  format="YYYY-MM-DD"
                  v-decorator="$check('Schedule.makeTime', {initialValue:defaultForm.makeTime})"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">定义人</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input
                  placeholder=""
                  v-decorator="$check('Schedule.makeByEs', {initialValue:`${defaultForm.makeBy}--${defaultForm.makeName}`})"
                  disabled/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">定义位置</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input
                  placeholder=""
                  v-decorator="$check('Schedule.makeStoreCodeF', {initialValue:`${defaultForm.makeStoreCode}--${defaultForm.makeStoreName}`})"
                  disabled/>
              </a-form-item>
            </a-col>
          </a-row>

        </a-form>
      </div>
    </bt-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
</style>
<style lang="less" scoped>

</style>

<script>
// import { mapGetters } from 'vuex'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import store from '@comp/BasicQuery/store'
import moment from 'moment'
import map from 'lodash.map'
export default {
    name: 'ScheduleActivityDefinition',
    components: { NewTable, SeachBox, BtModal, store },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '档期编码'
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
                    key: 'name',
                    type: 'input',
                    title: '档期名称'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '档期状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'schedule_define_status'
                    }
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
            disContextMenu: [],
            moenuOPT: [
                { name: '编辑',
                    action: 'ScheduleActivityDefinition.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'ScheduleActivityDefinition.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'ScheduleActivityDefinition.get',
                    fc: e => this.$refs.newTable.showDetails('档期活动定义详情', e)
                }
            ],
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],

            // 新增 编辑
            tags: [], // 状态
            SchedulModalTitle: '新增',
            SchedulAddEditModal: false, // 弹框打开
            subLoading: false, // 提交加载按钮
            form: this.$form.createForm(this),
            defaultForm: {},
            effectActive: false, // 已生效的日期
            disabledDateString: moment().startOf('day'),
            endTimeData: moment().add({ days: 1 }),

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值
            // 下拉框
            effectStoreArr: []
        }
    },
    computed: {
        setStartTime () {
            return moment()
        },
        setEndTime () {
            return moment().add({ days: 1 })
        },
        setmakeTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'dcecadafae6a4beea0208099362ceff5:ScheduleActivityDefinition'
            this.tableApiPath = 'ScheduDefineQuery'
            this.$refs.newTable.setContextmenu(this.moenuOPT)
        })
        this.getEffectStoreArr()
    },
    methods: {
        disabledDateStart (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        changeData (data, dataString) {
            if (data) {
                this.disabledDateString = data.startOf('day')
            }
            return dataString
        },
        disabledDate (curent) {
            return moment(curent).isBefore(this.disabledDateString)
        },
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ScheduDefineQuery'
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
                this.$refs.newTable.exportFile('ScheduDefineQuery')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduDefineQuery' })
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
            if (tableRow.status === 'schedule_define_status:1') {
                this.disContextMenu = []
            } else if (tableRow.status === 'schedule_define_status:2') {
                this.disContextMenu = ['删除']
            } else {
                this.disContextMenu = ['编辑', '删除']
            }
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isSelect = newData.filter(o => o.status !== 'schedule_define_status:1')
                if (isSelect.length > 0) {
                    this.$message.warning('只有未生效的才能进行此操作')
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
                        path: 'ScheduDefineDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                            _this.tableIdsArr = []
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler () {},
        /**
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (dataParams) {
            this.SchedulAddEditModal = true
            if (dataParams === -1) {
                this.effectActive = false
                this.defaultForm = {
                    price: 0,
                    startTime: this.setStartTime,
                    endTime: this.setEndTime,
                    makeTime: this.setmakeTime,
                    makeName: this.$store.getters.name,
                    makeBy: this.$store.getters.code,
                    makeStoreCode: this.$store.getters.storeInfo.code,
                    makeStoreName: this.$store.getters.storeInfo.name
                }
                this.$nextTick(() => {
                    this.disabledDateString = moment().startOf('day')
                })
                // 清除数据
                this.SchedulModalTitle = '新增档期活动'
                // this.form.resetFields()
                this.tempObjArrEffect = [] // 有效分店
                this.isAdd = true
            } else {
                this.disabledDateStart()
                console.log(dataParams)
                this.isAdd = false
                const obj = { ...dataParams }
                const { startTime, endTime, makeTime } = obj
                obj.startTime = moment(startTime)
                obj.endTime = moment(endTime)
                obj.makeTime = moment(makeTime)
                if (!obj.effectStore) {
                    this.tempObjArrEffect = []
                } else {
                    obj.effectStore = obj.effectStore.split(',')
                    this.tempObjArrEffect = [...obj.effectStore]
                }
                this.$nextTick(() => {
                    this.disabledDateString = moment(obj.startTime).startOf('day')
                })
                this.endTimeData = obj.endTime
                this.defaultForm = Object.assign(this.defaultForm, obj)

                if (dataParams.status === 'schedule_define_status:1') {
                    this.effectActive = false
                    this.SchedulModalTitle = '编辑档期活动'
                    // console.log(this.defaultForm.startTime, this.defaultForm.endTime)
                } else if (dataParams.status === 'schedule_define_status:2') {
                    this.effectActive = true
                    this.SchedulModalTitle = '编辑档期活动的结束时间'
                    this.$nextTick(() => {
                        this.disabledDateString = moment().startOf('day')
                    })
                }
            }
        },

        formCancel () {
            this.SchedulAddEditModal = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            const _this = this
            // console.log(123)
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            // console.log(validateFields)
            validateFields((err, values) => {
                if (!err) {
                    _this.subLoading = true
                    if (!_this.isAdd) {
                        values.id = _this.tableSingleData.id
                        values.makeStoreCode = _this.defaultForm.makeStoreCode
                        values.makeBy = _this.defaultForm.makeBy
                    } else {
                        values.makeStoreCode = _this.$store.getters.storeInfo.code
                    }
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.makeTime = values.makeTime.format('YYYY-MM-DD')
                    values.effectStore = this.tempObjArrEffect.join(',')
                    values.makeStoreCode = _this.$store.getters.storeInfo.code
                    axios({
                        path: _this.isAdd ? 'ScheduDefineAdd' : 'ScheduDefineUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        _this.subLoading = false
                        if (res.flag === 1) {
                            _this.SchedulAddEditModal = false
                            _this.reLoadTableData()
                            // console.log('lin123', res)
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        changeDataEndTime (endtimeVal, endtimeValString) {
            this.endTimeData = endtimeValString
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name:  生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        getEffectStoreArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = `${i.code}:${i.name}`
                        i.title = `${i.code}--${i.name}`
                        i.value = i.code
                    })
                    this.effectStoreArr = [...data]
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'ScheduleActivityDefinition') {
                this.getEffectStoreArr()
            }
        },
        disabledDateString (val, oldval) {
            if (val) {
                if (val.isAfter(this.endTimeData)) {
                    this.form.setFieldsValue({
                        endTime: moment(val)
                    })
                }
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

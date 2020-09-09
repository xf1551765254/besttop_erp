<!--
 * @Description: 收款反控制
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Julia
 * @LastEditors: lin
 * @Date: 2019-03-07 18:26:36
 * @LastEditTime: 2019-08-20 19:39:37
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"
    ></seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onSelect"
      @onContextmenuChange="onContextmenuChange"
    >
    </NewTable>
    <!-- 新增、编辑模态框 -->
    <bt-modal
      v-model="payeeControlAddEditModal"
      :title="payeeControlAddEditModalTitle"
      :submitClick="isAdd?submitInfo:editInfo"
      :submitLoading="subLoading"
      :popconfirm="false"
      :orderId="tableSingleData.code"
      :tags="tags">
      <a-form :form="baseInfoData">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">
            定义位置
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <!-- <a-input placeholder="" v-decorator="$check('payeeControlData.makeStoreCode', {initialValue:tableSingleData.makeStoreCode})" disabled /> -->
              <a-select
                showSearch
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                disabled
                v-decorator="$check('payeeControlData.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            生效日期
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('payeeControlData.effectTime', {initialValue:tableSingleData.effectTime || setEndTime})"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            生效分店
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-select
              mode="multiple"
              style="width:90%"
              placeholder="请选择生效分店"
              :options="makeStoreCodeDorpArr"
              :maxTagCount="1"
              :open="false"
              v-model="tempObjArr"
              allowClear
              ref="storeRef"/>
            <a href="javascript:;" @click="selectFocusEffect">
              <a-icon style="width:10%;line-height:36px;" type="edit" />
            </a>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="key"
          size="small"
          :pagination="{hideOnSinglePage:true}"
          :columns="tableColumns"
          :dataSource="tableData"
          bordered >
          <template v-for="col in ['isControl','assumeRate', 'ownRate', 'note']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-switch
                v-if=" col === 'isControl'"
                checkedChildren="是"
                unCheckedChildren="否"
                :checked="text==1"
                @change="e => isControlChange(e, record.key)"
              />
              <a-input-number
                v-else-if=" col === 'assumeRate'"
                style="margin: -5px 0"
                :value="text"
                :min="0.00"
                :max="100"
                :precision="2"
                :formatter="value =>changeAssumeRate(value,record)"
                @change="e => handleChange(e, record.key, col)"
                :disabled="record.isControl==1"
              />
              <a-input-number
                v-else-if=" col === 'ownRate'"
                style="margin: -5px 0"
                :value="text"
                :min="0.00"
                :max="100"
                :precision="2"
                :formatter="value => changeAssumeRate(value,record)"
                @change="e => handleChange(e, record.key, col)"
                :disabled="record.isControl==1"
              />
              <a-input
                v-else-if=" col === 'note'"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
              />
            </div>
          </template>
        </a-table>
      </div>
      <!-- 落款信息 -->
      <a-divider dashed />
      <a-form :form="baseInfoData">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">
            制单人
          </a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-select
                disabled
                showSearch
                style="width: 100%"
                :options="makeByDropArr"
                v-decorator="$check('payeeControlData.createBy',{initialValue:tableSingleData.makeBy||`${this.$store.getters.code}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            制单时间
          </a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-date-picker
                disabled
                placeholder=""
                style="width: 100%"
                v-decorator="$check('payeeControlData.makeTime', {initialValue:tableSingleData.makeTime ||setStartTime})"
                format="YYYY-MM-DD HH:mm:ss"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">
            审核人
          </a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-select
                disabled
                showSearch
                style="width: 100%"
                :options="makeByDropArr"
                v-decorator="$check('payeeControlData.auditBy',{initialValue:tableSingleData.auditBy})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            审核时间
          </a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-date-picker
                placeholder=""
                disabled
                style="width: 100%"
                v-decorator="$check('payeeControlData.auditTime', {initialValue:tableSingleData.auditTime})"
                format="YYYY-MM-DD HH:mm:ss"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('payeeControlData.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <store :visible.sync="storeQuery" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId" :epreviewTableData="epreviewTableData"></preview>
  </div>
</template>
<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import Preview from './preview/payeeControlPreview'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import moment from 'moment'
import store from '@comp/BasicQuery/store'
import is from 'is_js'
export default {
    name: 'PayeeControl',
    components: {
        SeachBox,
        NewTable,
        store,
        BtModal,
        Preview
    },
    data () {
        return {
            isClick: true,
            // 搜索框设置
            conditions: [
                {
                    title: '控制单号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '制单开始日期',
                    type: 'date',
                    key: 'startTime'
                },
                {
                    title: '制单结束日期',
                    type: 'date',
                    key: 'endTime'
                },
                {
                    title: '制单状态',
                    type: 'select',
                    key: 'status',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    body: {
                        type: 'payment_type_control_status'
                    },
                    filter: true
                },
                {
                    key: 'makeBy',
                    type: 'select',
                    title: '制单人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }
            ],
            // 按钮
            btns: ['add', 'del', 'export', 'print'],
            // 搜索的值
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            // 表格Id
            tableCode: '',
            // 表格数据路径
            tableApiPath: '',
            // 右键菜单
            disContextMenu: [],
            // 多选
            tableIdsArr: [],
            tableRowsArr: [],
            // 新增、编辑模态框
            tags: ['uncheck'], // 单据状态
            payeeControlAddEditModal: false,
            // 新增、编辑模态框标题
            payeeControlAddEditModalTitle: '',
            // 详情表格头部
            tableColumns: [
                {
                    title: '序号',
                    align: 'center',
                    customRender: (text, record, index) => `${index + 1}`
                },
                {
                    title: '付款方式',
                    align: 'left',
                    dataIndex: 'value'
                },
                {
                    title: '是否控制付款',
                    align: 'center',
                    dataIndex: 'isControl',
                    scopedSlots: {
                        customRender: 'isControl'
                    }
                },
                {
                    title: '厂家承担（%）',
                    align: 'center',
                    dataIndex: 'assumeRate',
                    scopedSlots: {
                        customRender: 'assumeRate'
                    }
                },
                {
                    title: '公司承担（%）',
                    align: 'center',
                    dataIndex: 'ownRate',
                    scopedSlots: {
                        customRender: 'ownRate'
                    }
                },
                {
                    title: '规则描述',
                    align: 'center',
                    dataIndex: 'note',
                    scopedSlots: {
                        customRender: 'note'
                    }
                }
            ],
            // 详情表格表体
            tableData: [],
            // 新增表格数据
            baseInfoData: this.$form.createForm(this),
            // 基础信息默认值
            tableSingleData: {
            },
            // 生效分店数组
            makeStoreCodeDorpArr: [],
            // 新增提交按钮
            isAdd: false,
            subLoading: false,
            // 右键菜单
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'PayeeControl.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'PayeeControl.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'PayeeControl.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                { name: '预览',
                    action: 'PayeeControl.get',
                    fc: this.detailHandler
                }
            ],
            // 行信息
            rowObj: {},
            // 生效分店模态框
            storeQuery: false,
            tempObjArr: [],
            makeByDropArr: [],
            // 预览
            previewVisbel: false,
            orderId: '',
            epreviewTableData: []
        }
    },
    computed: {
        setStartTime () {
            return moment()
        },
        setEndTime () {
            return moment().add({ days: 1 })
        }
    },
    mounted () {
        // 默认加载
        this.$nextTick(() => {
            this.tableCode = 'b0bc1677eb3c439e80a13809a503c489:payeeControl'
            this.tableApiPath = 'PaymentControlQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        // 加载详情
        this.queryPayMethods()
    },
    methods: {
        changeAssumeRate (value, row) {
            if (row.isControl === 0) {
                return value
            } else {
                return value
            }
        },
        /**
         * @name: 收款方控制开关
         * @msg:
         * @param {type}
         * @return:
         */
        isControlChange (e, key) {
            // console.log(key)
            const newData = [...this.tableData]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                target.isControl = e ? 1 : 0
                if (target.isControl) {
                    target.assumeRate = ''
                    target.ownRate = ''
                } else {
                    target.assumeRate = 0
                    target.ownRate = 100
                }
                this.tableData = newData
            }
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQuery = true
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            this.tempObjArr = [...map(arr, 'code')]
        },
        /**
         * @name: 点击功能按钮的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            /**
             * @name: 新增弹框
             * @msg:
             * @param {type}
             * @return:
             */
            if (e === 'add') {
                this.addEditPayeeControl(-1)
            } else if (e === 'del') {
                /**
               * @name: 表格删除
               * @msg:
               * @param {type}
               * @return:
               */
                if (this.tableIdsArr.length <= 0) {
                    this.$message.warning('请选择需要删除的数据！')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('PaymentControlQuery', this.seachValue)
            }
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        /**
         * @name: 清空搜索条件
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'PaymentControlQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 表格更新
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(
                this.tableCode,
                {
                    path: 'PaymentControlQuery'
                })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            if (tableRow.status === 'payment_type_control_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name: 表格编辑、删除、审核操作监听
         * @msg:
         * @param {type}
         * @return:
         */
        getRow (e, mun) {
            console.log(e, '点击')
            this.rowObj = e
            if (mun === 'edit') {
                this.addEditPayeeControl(e)
            } else if (mun === 'del') {
                // alert('删除')
                this.deleteHandler(e)
            } else if (mun === 'audit') {
                this.auditHandler(e)
            }
        },
        /**
         * @name: 新增/编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEditPayeeControl (index) {
            // 加载分店信息
            this.effectiveBranch()
            this.getMakeByDropArr()
            this.payeeControlAddEditModal = true
            if (index === -1) {
                this.isAdd = true
                // console.log('新增测试');
                this.tableSingleData = {}
                this.tempObjArr = []
                this.payeeControlAddEditModalTitle = '新增收款方式控制'
                this.tableData.forEach(i => {
                    i.isControl = 0
                    i.assumeRate = 0
                    i.ownRate = 100
                    i.note = ''
                })
            } else {
                this.isAdd = false
                this.payeeControlAddEditModalTitle = '编辑收款方式控制'
                this.rowObj.effectTime = moment(this.rowObj.effectTime)
                this.rowObj.makeTime = moment(this.rowObj.makeTime)
                // console.log()
                if (this.rowObj.storeId) {
                    this.tempObjArr = this.rowObj.storeId.split(',')
                } else {
                    this.tempObjArr = []
                }
                //
                this.tableSingleData.note = this.rowObj.note
                this.tableSingleData.code = this.rowObj.code
                axios({
                    path: 'PaymentControlQueryDetail',
                    method: 'post',
                    body: {
                        typeControlId: index.id
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.flag === 1) {
                        const newObj = [...this.tableData]
                        newObj.forEach(i => {
                            const target = res.data.list.filter(o => o.payType === i.value)
                            if (target.length > 0) {
                                i.isControl = target[0].isControl
                                i.assumeRate = target[0].assumeRate
                                i.ownRate = target[0].ownRate
                                i.note = target[0].note
                            } else {
                                i.isControl = 0
                                i.assumeRate = 0
                                i.ownRate = 100
                                i.note = ''
                            }
                        })
                        this.tableData = newObj
                    }
                })
            }
        },
        /**
         * @name: 生效日期校验
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().set({ hour: 0, minute: 0, second: 0 }))
        },
        /**
         * @name: 生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        effectiveBranch () {
            axios({
                path: 'OrganizationStoreFindOption'
            }).then(res => {
                console.log(res)
                if (res.flag === 1) {
                    res.data.forEach(item => {
                        item.title = item.code + '--' + item.name
                        item.value = item.code
                        item.key = item.code
                    })
                    this.makeStoreCodeDorpArr = res.data
                }
            })
        },
        /**
         * @name: 制单人
         * @msg:
         * @param {type}
         * @return:
         */
        getMakeByDropArr () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}--${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.makeByDropArr = dataArr
                }
            })
        },
        /**
         * @name: 新增请求详细信息
         * @msg:
         * @param {type}
         * @return:
         */
        queryPayMethods () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'settle_accounts_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = []
                    res.data.forEach(i => {
                        data.push({
                            key: i.id,
                            value: i.value,
                            type: i.type,
                            configKey: i.configKey
                        })
                    })
                    this.tableData = [...data]
                    this.epreviewTableData = [...data]
                }
            })
        },
        /**
         * @name: 监听详情弹框行编辑
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (value, key, column) {
            const { sub } = this.$math
            const newData = [...this.tableData]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                if (column === 'assumeRate') {
                    target.assumeRate = value
                    target.ownRate = sub(100, value)
                } else if (column === 'ownRate') {
                    target.ownRate = value
                    target.assumeRate = sub(100, value)
                } else {
                    target[column] = value
                }
                this.tableData = [...newData]
            }
        },
        /**
         * @name: 确认关闭弹框按钮
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.tempObjArr = []
            this.payeeControlAddEditModal = false
        },

        /**
         * @name: 新增提交按钮
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            console.log('add')
            // 防止事件穿透
            e.preventDefault()
            // 引入validateFields
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            console.log(newData)
            validateFields((err, values) => {
                for (const i of newData) {
                    i.id = null
                    i.payType = i.value
                    // if (i.assumeRate) {
                    //     i.assumeRat = div(i.assumeRat, 100, 4)
                    //     i.ownRate = div(i.ownRate, 100, 4)
                    // }
                }
                if (!err) {
                    const formDate = { ...values }
                    console.log(formDate, '保存')
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = moment(values.makeTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.storeId = this.tempObjArr
                    formDate.makeStoreCode = this.$store.getters.storeInfo.code
                    formDate.detail = newData
                    if (is.array(formDate.storeId)) {
                        formDate.storeId = this.tempObjArr.join(',')
                    }

                    this.subLoading = true
                    axios({
                        path: 'PaymentControlAdd',
                        body: formDate
                    }).then(res => {
                        this.subLoading = false
                        console.log(res)
                        this.tempObjArr = []
                        if (res.flag === 1) {
                            this.payeeControlAddEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 编辑确定按钮
         * @msg:
         * @param {type}
         * @return:
         */
        editInfo (e) {
            console.log('edit')
            // alert('编辑测试');
            // 防止事件穿透
            e.preventDefault()
            // 引入validateFields
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            validateFields((err, values) => {
                for (const i of newData) {
                    i.payType = i.value
                }
                if (!err) {
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = moment(values.makeTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.storeId = this.tempObjArr
                    formDate.detail = newData
                    formDate.id = this.rowObj.id
                    if (formDate.detail.length < 1) {
                        return this.$message.warning('请先添加明细')
                    }
                    if (is.array(formDate.storeId)) {
                        formDate.storeId = this.tempObjArr.join(',')
                    }
                    this.subLoading = true
                    axios({
                        path: 'PaymentControlUpdate',
                        body: formDate
                    }).then(res => {
                        this.subLoading = false
                        console.log(res)
                        if (res.flag === 1) {
                            this.payeeControlAddEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            // alert('单行测试')
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'payment_type_control_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复！',
                okText: '确定',
                okType: 'danger',
                canelText: '取消',
                onOk () {
                    axios({
                        path: 'PaymentControlDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            const _this = this
            console.log(_this.$store.getters.userInfo, autiData + '测试')
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        // 接口path名，必传
                        path: 'PaymentControlAudit',
                        method: 'post',
                        body: {
                            id: autiData.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'PayeeControl') {
                // 加载详情
                this.queryPayMethods()
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
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .documentNo {
        display: inline-block;
        border: 1px solid #38adff;
        width: 100px;
        height: 25px;
        margin-left: 10px;
        vertical-align: middle;
        background: #ebf7ff;
        border-radius: 2px;
        color: #38adff;
        text-align: center;
        font-size: 12px;
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        margin: 0 15px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
</style>

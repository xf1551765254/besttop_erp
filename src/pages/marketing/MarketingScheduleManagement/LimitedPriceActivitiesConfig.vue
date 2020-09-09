<!--
 * @Description: 限量限价
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-29 09:57:38
 * @LastEditors: lin
 * @LastEditTime: 2019-08-26 18:16:11
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
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :disContextMenu="disContextMenu"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增 编辑弹框 -->
    <bt-modal
      :title="AddEditModalTitle"
      v-model="AddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="titleSet" style="">基础信息</a-row>
        <a-row class="">
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('LimitedPrice.name', {initialValue:tableSingleData.name||''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeEffectRef"
                placeholder="请选择生效机构"
                mode="multiple"
                :maxTagCount="1"
                :open="false"
                style="width:85%"
                v-model="tempObjArrEffect"
                :options="effectStoreArr"
                :autoFocus="true"
                allowClear>
              </a-select>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
              <!-- 生效分店 -->
              <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                :disabledDate="disabledDateStart"
                style="width:100%"
                :showTime="true"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('LimitedPrice.startTime', {initialValue:tableSingleData.startTime})"
                @change="changeData"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDate"
                :showTime="true"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('LimitedPrice.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('LimitedPrice.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 详情表格 -->
      <div class="table-input-inner">
        <a-row class="titleSet" style="">商品列表</a-row>
        <a-button size="small" @click="addDetails" style="margin-bottom:5px">新增</a-button>
        <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
        <!-- 详情表格 -->
        <div class="table-nowrap">
          <a-table
            rowKey="skuCode"
            :columns="tableColumns"
            size="small"
            :pagination="false"
            :scroll="{ x: 1400}"
            :dataSource="detailTableData"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            bordered>
            <template v-for="col in ['skuName','maxQuantity','minPrice','maxPrice','manufacturerCouponRateOne','note']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <div v-if="col==='skuName'">
                  <a-tooltip v-if="text&&text.length > 20" :key="text" :title="text">
                    <span>{{ `${text.slice(0, 20)}...` }}</span>
                  </a-tooltip>
                  <span v-else> {{ text }} </span>
                </div>
                <a-input-number
                  v-if="col === 'minPrice'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input-number
                  v-if="col === 'maxQuantity'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="0"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input-number
                  v-else-if="col === 'maxPrice'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input-number
                  v-else-if="col === 'manufacturerCouponRateOne'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0"
                  :max="100"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input
                  v-else-if="col === 'note'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.tb_web_id, col)"/>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div class="editable-row-operations">
                <span>
                  <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.tb_web_id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 落款信息 -->
      <a-form>
        <a-row class="titleSet" style="margin-top:10px">落款信息</a-row>
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 增加商品弹框 -->
    <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple/>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import store from '@comp/BasicQuery/store'
import goods from '@pages/marketing/BundledGoodsSettings/goods'
import Preview from '@pages/marketing/MarketingScheduleManagement/preview/LimitedPriceActivitiesConfigPre'
export default {
    components: { NewTable, SeachBox, BtModal, store, goods, Preview },
    name: 'LimitedPriceActivitiesConfig',
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'limitStartTime',
                    type: 'date',
                    title: '制单开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'limitEndTime',
                    type: 'date',
                    title: '制单结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '审核状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'schedule_limit_define_status'
                    }
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '制单人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                limitStartTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                limitEndTime: moment().format('YYYY-MM-DD')
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
                    action: 'LimitedPriceActivitiesConfig.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'LimitedPriceActivitiesConfig.delete',
                    fc: this.deleteHandler
                },
                { name: '审核',
                    action: 'LimitedPriceActivitiesConfig.verify',
                    fc: this.auditHandler
                },
                { name: '预览',
                    action: 'LimitedPriceActivitiesConfig.get',
                    fc: this.detailHandler
                }
            ],

            // 新增编辑弹框
            tags: ['uncheck'], // 单据状态
            AddEditModal: false,
            isAdd: false,
            // 新增编辑模态框头
            AddEditModalTitle: '',
            subLoading: false,
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值
            // 时间
            disabledDateStarting: moment().startOf('day'),

            // 商品列表
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 120 },
                { title: '限价', dataIndex: 'minPrice', align: 'center', width: 120 },
                { title: '限量', dataIndex: 'maxQuantity', align: 'center', width: 120, scopedSlots: { customRender: 'maxQuantity' } },
                { title: '活动价（元）', dataIndex: 'maxPrice', align: 'center', width: 120, scopedSlots: { customRender: 'maxPrice' } },
                { title: '厂家券比例（%）', dataIndex: 'manufacturerCouponRateOne', align: 'center', width: 120, scopedSlots: { customRender: 'manufacturerCouponRateOne' } },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            detailTableData: [],
            selectedRowKeys: [], // 选中的值 skucode

            /// 增加的商品
            goodsQuery: false,

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ce087fbe45d64755b2a57cf325d30acd:LimitedPriceActivitiesConfig'
            this.tableApiPath = 'ScheduleLimitQueryList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'ScheduleLimitQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         */
        onReload () {
            this.seachValue = { }
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
                this.$refs.newTable.exportFile('ScheduleLimitQueryList')
            }
        },
        /**
         * @name: 更新表格
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduleLimitQueryList' })
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
            if (tableRow.status === 'schedule_limit_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
         * @name: 主表删除
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'schedule_limit_define_status:1')
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
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduleLimitDeleteScheduleLimitDefine', // 接口path名，必传
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
         * @name: 主表审核
         */
        auditHandler (autiData) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduleLimitUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: [ autiData.id ]
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
         * @name: 新增 编辑
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '新增限量限价活动配置'
                this.tableSingleData = { }
                this.tempObjArrEffect = [] // 生效机构
                this.detailTableData = [] // 表格数据
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.disabledDateStarting = moment().startOf('day')
            } else {
                const { mul } = this.$math
                this.isAdd = false
                this.AddEditModalTitle = '编辑限量限价活动配置'
                const obj = { ...addEditData }
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                this.disabledDateStarting = obj.startTime
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')

                if (!obj.effectStore) {
                    this.tempObjArrEffect = []
                } else {
                    obj.effectStore = obj.effectStore.split(',')
                    this.tempObjArrEffect = [...obj.effectStore]
                }
                this.tableSingleData = obj
                axios({
                    path: 'ScheduleLimitQueryScheduleLimitDefineDetail',
                    methods: 'post',
                    body: {
                        id: addEditData.id,
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data]
                        data.forEach(item => {
                            item.tb_web_id = item.skuCode
                            item.manufacturerCouponRateOne = mul(item.manufacturerCouponRate, 100, 2)
                        })
                        this.detailTableData = data
                    }
                })
            }
            this.AddEditModal = true
        },
        /**
         * @name: 弹框提交
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const { div } = this.$math
                    const newData = [...this.detailTableData]
                    if (newData.length === 0) {
                        return this.$message.error('请选择商品列表')
                    }
                    newData.forEach(item => {
                        item.manufacturerCouponRate = div(item.manufacturerCouponRateOne, 100, 4)
                    })
                    values.endTime = values.endTime.format('YYYY-MM-DD HH:mm:ss')
                    values.startTime = values.startTime.format('YYYY-MM-DD HH:mm:ss')
                    values.effectStore = this.tempObjArrEffect.join(',')
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                    }
                    values.detailParamList = newData
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ScheduleLimitAddScheduleLimitDefine' : 'ScheduleLimitUpdateScheduleLimitDefine',
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
         * @name: 生效机构弹框
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效机构
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 时间
         */
        disabledDateStart (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        changeData (data, dataStarting) {
            if (data) {
                this.disabledDateStarting = data
            } else {
                this.disabledDateStarting = moment()
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
        disabledDate (curent) {
            return moment(curent).isBefore(this.disabledDateStarting)
        },
        /**
         * @name: 表格选择
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = selectKeys
        },
        /**
         * @name: 订单详情删除
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.detailTableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.detailTableData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.detailTableData]
                this.detailTableData = newData.filter(item => item.tb_web_id !== keyId)
            }
        },
        /**
         * @name: 编辑 表格 编辑时
         */
        InputChange (val, count, key) {
            const newData = [...this.detailTableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (key === 'manufacturerCouponRateOne' || key === 'maxPrice' || key === 'minPrice') {
                    target[key] = val || 0
                } else if (key === 'maxQuantity') {
                    target[key] = val || 1
                } else {
                    target[key] = val
                }
                this.detailTableData = newData
            }
        },
        /**
         * @name: 详情 新增
         */
        addDetails () {
            this.goodsQuery = true
        },
        /**
         * @name: 增加 的商品
         */
        onSelectAddGoods (addSeleckData) {
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.detailTableData.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    this.detailTableData.push({
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        skuModel: mun.skuModel,
                        skuPrice: mun.skuPrice,
                        minPrice: mun.minPrice,
                        maxQuantity: 1,
                        maxPrice: 0,
                        manufacturerCouponRateOne: 0,
                        note: '',
                        tb_web_id: mun.skuCode
                    })
                } else {
                    error.push(mun.skuCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name:  生效机构
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
        },
        /**
         * @name: 详情
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'LimitedPriceActivitiesConfig') {
                this.getEffectStoreArr()
            }
        },
        'seachValue.limitStartTime' (val, oldVal) {
            if (val && this.seachValue.limitEndTime) {
                if (moment(val).isAfter(this.seachValue.limitEndTime)) {
                    this.seachValue.limitEndTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.limitEndTime' (val, oldVal) {
            if (val && this.seachValue.limitStartTime) {
                if (moment(val).isBefore(this.seachValue.limitStartTime)) {
                    this.seachValue.limitStartTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>
<style lang="less">
.activeNameSet .ant-select-arrow svg{
    display:none;
}
.table-input-inner{
    .ant-input-number-input{
        height: 28px;
    }
}
</style>
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

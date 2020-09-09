<!--
 * @Description: 礼品规则
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-29 09:57:19
 * @LastEditors: lin
 * @LastEditTime: 2019-08-20 17:21:32
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
    <!-- 新增 编辑 弹框 -->
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
                v-decorator="$check('GiftRuleSheet.name', {initialValue:tableSingleData.name||''})"/>
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
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                :disabledDate="disabledDateStart"
                style="width:100%"
                v-decorator="$check('GiftRuleSheet.startTime', {initialValue:tableSingleData.startTime})"
                @change="changeData"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDate"
                v-decorator="$check('GiftRuleSheet.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('GiftRuleSheet.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 详情表格 -->
      <div class="table-input-inner">
        <a-row class="titleSet" style="">礼品信息</a-row>
        <a-button size="small" @click="addDetails" style="margin-bottom:5px">新增</a-button>
        <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
        <!-- 详情表格 -->
        <div class="table-nowrap">
          <a-table
            rowKey="skuCode"
            :columns="tableColumns"
            size="small"
            :pagination="false"
            :scroll="{ x: 1130}"
            :dataSource="detailTableData"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            bordered>
            <template v-for="col in ['skuName','rateAmount','note','skuQuantity']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <div v-if="col==='skuName'">
                  <a-tooltip v-if="text&&text.length > 20" :key="text" :title="text">
                    <span>{{ `${text.slice(0, 20)}...` }}</span>
                  </a-tooltip>
                  <span v-else> {{ text }} </span>
                </div>
                <a-input-number
                  v-else-if="col === 'skuQuantity'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="1"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="0"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input-number
                  v-else-if="col === 'rateAmount'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
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
            <template slot="action" slot-scope="text, record, index">
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
      <!-- 不参与分摊的供应商 -->
      <div class="table-input-inner">
        <a-row class="titleSet" style="margin-top:10px">不参与分摊的供应商</a-row>
        <a-row>
          <a-col :span="2" style="line-height:32px;text-align:right">供应商：</a-col>
          <a-col :span="7">
            <a-select
              ref="storeEffectRef"
              placeholder="请输入供应商编码或名称搜索"
              :filterOption="false"
              style="width:100%"
              :options="provideArr"
              @search="provideSaerch"
              @select="valuePriovde"
              showSearch
              allowClear>
            </a-select>
          </a-col>
        </a-row>
        <div style="margin-top:10px">
          <a-table
            rowKey="providerCode"
            :columns="tableColumnsProvider"
            size="small"
            :pagination="false"
            :dataSource="detailTableDataProvider"
            :rowSelection="{selectedRowKeys: selectedRowKeysProvider, onChange: onSelectChangeProvider}"
            bordered>
            <template slot="note" slot-scope="text, record, index">
              <div>
                <a-input
                  style="margin: -3px 0; width:100%;height:30px"
                  :value="text"
                  @change="e => InputChangeProvider(e.target.value, record.tb_web_id)"/>
              </div>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span>
                  <a-popconfirm title="是否确定删除?" @confirm="() => deleteRowProvider(record.tb_web_id)">
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
    <goods :visible.sync="goodsQuery" title="选择礼品" @onSelect="onSelectAddGoods" :pams="{type:'goods_type:6'}" multiple />
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
import goods from '@pages/marketing/ActivityRuleSheet/components/giftGoods'
import Preview from '@pages/marketing/MarketingScheduleManagement/preview/GiftRuleSheetPreview'
export default {
    components: { NewTable, SeachBox, BtModal, store, goods, Preview },
    name: 'GiftRuleSheet',
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
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
                    key: 'status',
                    type: 'select',
                    title: '审核状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'schedule_gift_define_status'
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
                    action: 'GiftRuleSheet.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'GiftRuleSheet.delete',
                    fc: this.deleteHandler
                },
                { name: '审核',
                    action: 'GiftRuleSheet.verify',
                    fc: this.auditHandler
                },
                { name: '预览',
                    action: 'GiftRuleSheet.get',
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
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价（元）', dataIndex: 'skuPrice', align: 'center', width: 120 },
                { title: '数量', dataIndex: 'skuQuantity', align: 'center', width: 120, scopedSlots: { customRender: 'skuQuantity' } },
                { title: '分摊金额（元）', dataIndex: 'rateAmount', align: 'center', width: 120, scopedSlots: { customRender: 'rateAmount' } },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            detailTableData: [],
            selectedRowKeys: [], // 选中的值 skucode
            /// 增加的商品
            goodsQuery: false,

            tableColumnsProvider: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '供应商编码', dataIndex: 'providerCode', align: 'center' },
                { title: '供应商名称', dataIndex: 'providerName', align: 'center' },
                // { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            detailTableDataProvider: [],
            selectedRowKeysProvider: [],

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: [],
            provideArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '74fb6140191644baa10f902d7ccd3c4f:GiftRuleSheet'
            this.tableApiPath = 'ScheduleGiftQueryDefine'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'ScheduleGiftQueryDefine'
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
                this.$refs.newTable.exportFile('ScheduleGiftQueryDefine')
            }
        },
        /**
         * @name: 更新表格
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduleGiftQueryDefine' })
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
            if (tableRow.status === 'schedule_gift_define_status:1') {
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
                const isAuit = newData.filter(o => o.status !== 'schedule_gift_define_status:1')
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
                        path: 'ScheduleGiftDelDefine', // 接口path名，必传
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
                        path: 'ScheduleGiftAuditDefine', // 接口path名，必传
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
                this.AddEditModalTitle = '新增礼品规则单'
                this.tableSingleData = { }
                this.tempObjArrEffect = [] // 生效机构
                this.detailTableData = [] // 表格数据
                this.detailTableDataProvider = []
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.disabledDateStarting = moment().startOf('day')
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑礼品规则单'
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
                    path: 'ScheduleGiftQueryDetail',
                    methods: 'post',
                    body: {
                        id: addEditData.id,
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data.detailVoList]
                        const dataTow = [...res.data.list]
                        data.forEach(item => {
                            item.tb_web_id = item.skuCode
                        })
                        dataTow.forEach(item => {
                            item.tb_web_id = item.providerCode
                        })
                        this.detailTableData = data
                        this.detailTableDataProvider = dataTow
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
                    const newData = [...this.detailTableData]
                    const newDataTow = [...this.detailTableDataProvider]
                    if (newData.length === 0) {
                        return this.$message.error('请选择礼品商品列表')
                    }
                    values.endTime = values.endTime.format('YYYY-MM-DD')
                    values.startTime = values.startTime.format('YYYY-MM-DD')
                    values.effectStore = this.tempObjArrEffect.join(',')
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                    }
                    values.detailParamList = newData
                    values.providerList = newDataTow
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ScheduleGiftAddDefine' : 'ScheduleGiftUpdateDefine',
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
                        rateAmount: 0,
                        skuQuantity: 1,
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
                target[key] = val
                this.detailTableData = newData
            }
        },

        /**
         * @name: 供应商 表格选择
         */
        onSelectChangeProvider (selectKeys, selectRows) {
            this.selectedRowKeysProvider = selectKeys
        },
        /**
         * @name: 供应商 编辑
         */
        InputChangeProvider (val, count, key) {
            const newData = [...this.detailTableDataProvider]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                target['note'] = val
                this.detailTableDataProvider = newData
            }
        },
        /**
         * @name: 供应商 删除
         */
        deleteRowProvider (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.detailTableDataProvider]
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.detailTableDataProvider = deleteoData
            } else {
                const newData = [...this.detailTableDataProvider]
                this.detailTableDataProvider = newData.filter(item => item.tb_web_id !== keyId)
            }
        },
        /**
         * @name: 供应商 商品添加
         */
        valuePriovde (value) {
            const exist = this.detailTableDataProvider.filter(o => o.providerCode === value)
            if (exist.length === 0) {
                const obj = this.provideArr.filter(o => o.code === value)[0]
                if (obj) {
                    this.detailTableDataProvider.push({
                        providerCode: obj.code,
                        providerName: obj.name,
                        note: '',
                        tb_web_id: obj.code
                    })
                }
            } else {
                this.$notification.error({
                    message: '提示',
                    description: '此供应已经添加过了'
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
         * @name: 供应商搜索
         * @msg:
         * @param {type}
         * @return:
         */
        provideSaerch (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.provideArr.length = 0
                this.getProvide(value)
            }, 300)
        },
        /**
         * @name:  供应商
         */
        getProvide (value) {
            axios({
                path: 'CustomerSupplierFindBySelected',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    condition: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = `${i.code}:${i.name}`
                        i.title = `${i.code}--${i.name}`
                        i.value = i.code
                    })
                    this.provideArr = [...data]
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
            if (to === 'GiftRuleSheet') {
                this.getEffectStoreArr()
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
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

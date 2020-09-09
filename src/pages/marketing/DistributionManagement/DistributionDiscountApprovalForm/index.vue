<!--
 * @Description: 分销折让审批单
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lin
 * @Date: 2019-04-17 11:17:47
 * @LastEditTime: 2019-08-20 15:57:19
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seach-box
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
    </seach-box>
    <!-- min table -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    />
    <!-- 单据 -->
    <bt-modal
      v-model="addEditModel"
      :title="addEdiTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="setDocCss">
          <!-- <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                v-decorator="$check('DistributionDiscountApprovalForm.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                disabled/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">折让店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                v-decorator="$check('DistributionDiscountApprovalForm.storeCode',{initialValue:tableSingleData.storeCode||`${this.$store.getters.storeInfo.code}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="customerRef"
                showSearch
                allowClear
                style="width: 100%"
                @change="changeCustomerValue"
                @search="handlecustomerCodeDorpArr"
                :filterOption="false"
                :options="customerCodeArr"
                v-decorator="$check('DistributionDiscountApprovalForm.customerCode',{initialValue:tableSingleData.customerCode})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="createByDorpArr"
                @search="handlechargeByDorpArr"
                :filterOption="false"
                v-decorator="$check('DistributionDiscountApprovalForm.chargeBy',{initialValue:tableSingleData.chargeBy})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :row="2"
                v-decorator="$check('DistributionDiscountApprovalForm.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格 -->
      <div>
        <!-- 上方按钮 -->
        <div>
          <a-button size="small" @click="addDetails" style="margin-left:10px;margin-bottom:5px">新增</a-button>
          <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
        </div>
        <!-- 表格 -->
        <div class="table-nowrap">
          <a-table
            rowKey="code"
            :columns="tableDetailColumns"
            :dataSource="tableDetailData"
            size="small"
            :pagination="false"
            :scroll="{x:1770}"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            bordered>
            <template
              v-for="col in ['originalWholesalePrice','wholesaleAllowancesPrice','quantity','wholesaleAllowancesReason']"
              :slot="col"
              slot-scope="text, record, index">
              <div :key="col">
                <a-input-number
                  v-if="col==='originalWholesalePrice'"
                  style="margin:-5px 0;width:100%"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.code, col)"/>
                <a-input-number
                  v-else-if="col==='wholesaleAllowancesPrice'"
                  style="margin:-5px 0;width:100%"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.code, col)"/>
                <a-input-number
                  v-else-if="col==='quantity'"
                  style="margin:-5px 0;width:100%"
                  :min="1"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="0"
                  :value="text"
                  @change="e => InputChange(e, record.code, col)"/>
                <a-input
                  v-else-if="col === 'wholesaleAllowancesReason'"
                  style="margin: -5px 0; width:100%"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.code, col)"
                />
                <span v-else>{{ text }}</span>
              </div>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span>
                  <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.code)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <a-divider dashed />
      <!-- 落款信息 -->
      <a-form :form="form">
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
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
import BtModal from '@comp/Modal'
import goods from './components/goods'
import Preview from '@pages/marketing/DistributionManagement/DistributionDiscountApprovalForm/preview/preview'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'DistributionDiscountApprovalForm',
    components: { NewTable, SeachBox, BtModal, goods, Preview },
    data: function () {
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
                    title: '制单开始时间',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制单结束时间',
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
                        type: 'wholesale_rebate_plan_status'
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
            },
            // 表格赋值
            tableCode: '',
            tableApiPath: '',
            // 单行选中的值
            tableSingleData: {},
            // 表格多选框的值
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOPT: [
                { name: '编辑',
                    action: 'DistributionDiscountApprovalForm.edit',
                    fc: this.addEdit
                },
                { name: '审核',
                    action: 'DistributionDiscountApprovalForm.verify',
                    fc: this.auditHandler
                },
                { name: '删除',
                    action: 'DistributionDiscountApprovalForm.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'DistributionDiscountApprovalForm.get',
                    fc: this.detailHandler
                }
            ],
            // 单据
            addEditModel: false,
            addEdiTitle: '',
            submitLoading: false,
            tags: ['uncheck'],
            isAdd: false,
            // form 表单
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 客户的值
            customerValue: '',
            // 单据表格
            tableDetailColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: 'SKU编码', dataIndex: 'code', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'model', width: 150, align: 'center' },
                { title: '税率(%)', dataIndex: 'taxRate', width: 100, align: 'center', customRender: (text, record) => `${Number(text * 100).toFixed(2)}` },
                { title: '原分销价（元）', dataIndex: 'originalWholesalePrice', width: 150, align: 'center', scopedSlots: { customRender: 'originalWholesalePrice' } },
                { title: '折让价（元）', dataIndex: 'wholesaleAllowancesPrice', width: 150, align: 'center', scopedSlots: { customRender: 'wholesaleAllowancesPrice' } },
                { title: '折让数量', dataIndex: 'quantity', width: 100, align: 'center', scopedSlots: { customRender: 'quantity' } },
                { title: '折让金额（元）', dataIndex: 'wholesaleAllowancesAmount', width: 100, align: 'center' },
                { title: '折让原因', dataIndex: 'wholesaleAllowancesReason', width: 300, align: 'center', scopedSlots: { customRender: 'wholesaleAllowancesReason' } },
                { title: '操作', key: 'operation', width: 70, align: 'center', fixed: 'right', scopedSlots: { customRender: 'action' } }
            ],
            tableDetailData: [],
            selectedRowKeys: [], // 选中的值 code
            selectedRows: [], // 选中的值
            delIdArr: [], // 单据 详情表格 编辑的删除传的id
            // 表格新增的数据
            goodsQuery: false,

            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            customerCodeArr: [], // 客户
            createByDorpArr: [], // 申请人
            makeStoreCodeDorpArr: [] // 制单位置
        }
    },
    computed: {
        setStartTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd21fe79367ac4f9c8868ff0c008a4143:DistributionDiscountApprovalForm'
            this.tableApiPath = 'DistWholesaleRebatePlanQueryWholesaleRebatePlanList'
            this.$refs.newTable.setContextmenu(this.menuOPT)
        })
        this.getMakeStoreCodeDorpArr()
    },
    methods: {
        /**
       * @name: 查询表格
       */
        onSeach (e) {
            e.path = 'DistWholesaleRebatePlanQueryWholesaleRebatePlanList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空数据
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:工具栏功能按键
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
                this.$ref.newTable.exportFile('DistWholesaleRebatePlanQueryWholesaleRebatePlanList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistWholesaleRebatePlanQueryWholesaleRebatePlanList' })
        },
        /**
         * @name: 表格多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyIndex, keyRows) {
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
            // console.log(tableRow)
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'wholesale_rebate_plan_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
         * @name: 删除表格
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'wholesale_rebate_plan_status:1')
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
                content: '确定选中项全部删除？删除后将不可更改',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistWholesaleRebatePlanDeleteWholesaleRebatePlanAndDetail', // 接口path名，必传
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
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
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
                        path: 'DistWholesaleRebatePlanAuditWholesaleRebatePlan', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: [autiData.id]
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
         * @name: 折让店
         * @msg:
         * @param {type}
         * @return:
         */
        getMakeStoreCodeDorpArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    name: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.makeStoreCodeDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 查 询分 负 责  人
         */
        handlechargeByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.createByDorpArr.length = 0
                this.getCreateByDorpArr(value)
            }, 300)
        },
        /**
         * @name:  负 责  人
         */
        getCreateByDorpArr (value) {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    name: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.createByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 查询客户
         */        
        handlecustomerCodeDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerCodeArr.length = 0
                this.getCustomerCodeDorpArr(value)
            }, 300)
        },
        /**
         * @name: 客户
         */
        getCustomerCodeDorpArr (value) {
            axios({
                path: 'CustomerDistributorsFindBySelected',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    code: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.customerCodeArr = dataArr
                }
            })
        },
        /**
         * @name: 下拉框过滤修改
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 客户下拉框变化
         * @msg:
         * @param {type}
         * @return:
         */
        changeCustomerValue (value) {
            const _this = this
            if (this.tableDetailData.length === 0) {
                this.customerValue = value
            } else {
                this.$confirm({
                    title: '提示',
                    content: '客户变换，商品详情数据将被清空是否继续',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        const hasIdArr = map(_this.tableDetailData, 'id')
                        if (hasIdArr.length > 0) {
                            hasIdArr.forEach(item => {
                                _this.delIdArr.push(item)
                            })
                        }
                        _this.tableDetailData = []
                        _this.customerValue = value
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                        _this.form.setFieldsValue({
                            customerCode: _this.customerValue
                        })
                    }
                })
            }
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.addEditModel = true
            this.delIdArr = []
            if (addEditData === -1) {
                this.isAdd = true
                this.tableSingleData = {}
                this.addEdiTitle = '新增分销折让审批单'
                this.tableDetailData = []
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.isAdd = false
                this.tableSingleData = { ...addEditData }
                this.defauilForm.makeStoreCode = this.tableSingleData.makeStoreCode
                this.defauilForm.makeStoreName = this.tableSingleData.makeStoreName
                this.defauilForm.createBy = this.tableSingleData.createBy
                this.defauilForm.createName = this.tableSingleData.createName
                this.defauilForm.createTime = this.tableSingleData.createTime
                this.addEdiTitle = '编辑分销折让审批单'
                this.getCreateByDorpArr(addEditData.chargeBy)
                this.getCustomerCodeDorpArr(addEditData.customerCode)
                axios({
                    path: 'DistWholesaleRebatePlanQueryWholesaleRebatePlanDetailList',
                    method: 'post',
                    body: {
                        wholesaleRebatePlanId: addEditData.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.tableDetailData = res.data
                    }
                })
            }
        },
        /**
         * @name: 单据提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableDetailData.length === 0) {
                        this.$message.warning('请新增商品')
                        return
                    }
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    values.createTime = this.defauilForm.createTime
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    this.submitLoading = true
                    values.ids = this.delIdArr
                    axios({
                        path: this.isAdd ? 'DistWholesaleRebatePlanAddWholesaleRebatePlanAndDetail' : 'DistWholesaleRebatePlanUpdateWholesaleRebatePlanAndDetail',
                        method: 'post',
                        body: {
                            wholesaleRebatePlan: values,
                            wholesaleRebatePlanDetailList: this.tableDetailData
                        }
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
         * @name: 单据 详情表格新增
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            if (!this.$refs.customerRef.value) {
                this.$message.warning('请选择客户')
                return
            }
            this.goodsQuery = true
        },
        /**
         * @name:单据 增加 的商品
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectAddGoods (addSeleckData) {
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.tableDetailData.filter(o => o.code === mun.skuCode)
                if (has.length === 0) {
                    this.tableDetailData.push({
                        code: mun.skuCode,
                        skuName: mun.skuName,
                        brandCode: mun.brandCode,
                        brandName: mun.brandName,
                        unit: mun.skuUnit,
                        model: mun.skuModel,
                        taxRate: mun.skuTaxRate,
                        originalWholesalePrice: mun.skuPriceW,
                        wholesaleAllowancesPrice: '0',
                        quantity: 1,
                        priceCost: mun.skuPtCost,
                        price: mun.skuPrice,
                        wholesaleAllowancesAmount: Number(mun.skuPriceW).toFixed(2),
                        wholesaleAllowancesReason: '',
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
         * @name: 单据详情表格 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.tableDetailData]
                const hasIdArr = map(this.selectedRows, 'id')
                if (hasIdArr.length > 0) {
                    hasIdArr.forEach(item => {
                        this.delIdArr.push(item)
                    })
                }
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].code === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.tableDetailData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.tableDetailData]
                this.tableDetailData = newData.filter(item => item.code !== keyId)
                const selectId = newData.filter(item => item.code === keyId)[0]
                if (selectId.id) {
                    this.delIdArr.push(selectId.id)
                }
            }
        },
        /**
         * @name: 表格选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = selectKeys
            this.selectedRows = selectRows
        },
        /**
         * @name: 单据 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, key) {
            const { sub, mul } = this.$math
            const newData = [...this.tableDetailData]
            const target = newData.filter(item => count === item.code)[0]
            if (target) {
                if (key === 'quantity') {
                    target[key] = val || 1
                } else if (key === 'originalWholesalePrice' || key === 'wholesaleAllowancesPrice') {
                    target[key] = val || 0
                } else {
                    target[key] = val
                }
                if (target.originalWholesalePrice >= 0 && target.wholesaleAllowancesPrice >= 0 && target.quantity >= 1) {
                    target.wholesaleAllowancesAmount = mul(sub(target.originalWholesalePrice, target.wholesaleAllowancesPrice, 2), target.quantity, 2)
                }
                this.tableDetailData = newData
            }
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
        },
        '$store.state.app.pageName' (to, from) {
            if (to === 'DistributionDiscountApprovalForm') {
                this.getMakeStoreCodeDorpArr()
            }
        }
    }
}
</script>

<style scoped>

</style>

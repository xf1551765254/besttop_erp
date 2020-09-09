/* eslint-disable use-isnan */
<!--
 * @Description: 返利确认单
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-17 11:17:26
 * @LastEditTime: 2019-08-20 15:41:54
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="condition"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- main table -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"/>
    <!-- 单据 -->
    <bt-modal
      v-model="addEditModal"
      :title="addEditTitle"
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
                style="width:100%"
                :options="makeStoreCodeDorpArr"
                v-decorator="$check('RebateConfirmation.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                disabled/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">销售位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="saleStoreCodeRef"
                style="width:100%"
                :options="makeStoreCodeDorpArr"
                v-decorator="$check('RebateConfirmation.saleStoreCode',{initialValue:tableSingleData.saleStoreCode||`${this.$store.getters.storeInfo.code}` })"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">政策名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="strategyDefineRef"
                style="width:100%"
                placeholder="请选择政策名称"
                showSearch
                :filterOption="filterOption"
                @change="changeStrategyDefineValue"
                :options="strategyDefineCodeArr"
                v-decorator="$check('RebateConfirmation.strategyDefineCode',{initialValue:tableSingleData.strategyDefineCode})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="customerRef"
                style="width:100%"
                showSearch
                placeholder="客户"
                @search="handlecustomerCodeDorpArr"
                :filterOption="false"
                @change="changeCustomerValue"
                :options="customerCodeArr"
                v-decorator="$check('RebateConfirmation.customerCode',{initialValue:tableSingleData.customerCode})"
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
                v-decorator="$check('RebateConfirmation.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed/>
      <!-- 详情表格 -->
      <div>
        <!-- 上方表格 -->
        <div>
          <a-button size="small" @click="getDetailData" style="margin-left:10px;margin-bottom:5px">取渠道返利政策</a-button>
          <a-button size="small" @click="reSetDetailData" style="margin-left:5px;margin-bottom:5px">重置</a-button>
        </div>
        <!-- 表格 -->
        <div class="table-nowrap">
          <a-table
            rowKey="strategyType"
            size="small"
            :pagination="false"
            :columns="tableDetailColumes"
            :dataSource="tableDetailData"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            bordered>
            <template
              v-for="col in ['note','adjustAmount']"
              :slot="col"
              slot-scope="text, record, index">
              <div :key="col">
                <a-input-number
                  v-if="col==='adjustAmount'"
                  style="margin:-5px 0;width:100%"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.strategyType, col)"/>
                <a-input
                  v-else-if="col === 'note'"
                  style="margin: -5px 0; width:100%"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.strategyType, col)"/>
              </div>
            </template>
            <template slot="footer" slot-scope="currentPageData">
              <a-row type="flex" justify="space-between">
                <a-col :span="2" style="margin-right:4%"><h4 >总计：</h4></a-col>
                <a-col :span="7"><span>应返金额：{{ shouldRebateAmount }}</span></a-col>
                <a-col :span="7"><span>调整金额：{{ adjustAmountAll }}</span></a-col>
                <a-col :span="7"><span>实返金额：{{ actualRebateAmount }}</span></a-col>
              </a-row>
            </template>
            <template slot="action" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span>
                  <a @click="()=>detailRow(record)">详情</a>
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <a-divider dashed/>
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
    </bt-modal>
    <!-- 返利明细 -->
    <a-modal
      title="返利明细"
      :visible="rebateDetail"
      centered
      :maskClosable="false"
      :closable="false"
      :bodyStyle="{'padding-top':'10px'}"
      width="800px">
      <template slot="footer">
        <a-button type="primary" @click="rebateDetail=false">关闭</a-button>
      </template>
      <a-tabs v-model="defaulTabKey" @change="callback">
        <a-tab-pane tab="提货规模" key="提货规模">
          <a-spin :spinning="spinning">
            <a-table
              rowKey="project"
              :columns="rebateColumnsOne"
              :dataSource="rebateDataOne"
              size="small"
              :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
              bordered>
            </a-table>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="常规机政策价" key="常规机政策价">
          <a-spin :spinning="spinning">
            <a-table
              rowKey="skuCode"
              :columns="rebateColumnsTow"
              :dataSource="rebateDataTow"
              size="small"
              :scroll="{x:1200}"
              :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
              bordered>
              <template slot="title" slot-scope="currentPageData">
                常规机政策价合计（元）：{{ rebateCountTow }}
              </template>
            </a-table>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="销售奖励机型" key="销售奖励机型">
          <a-spin :spinning="spinning">
            <a-table
              rowKey="skuCode"
              :columns="rebateColumnsThree"
              :dataSource="rebateDataThree"
              size="small"
              :scroll="{x:1000}"
              :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
              bordered>
              <template slot="title" slot-scope="currentPageData">
                销售奖励机型合计（元）：{{ rebateCountThree }}
              </template>
            </a-table>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="高端出样" key="高端出样">
          <a-spin :spinning="spinning">
            <a-table
              rowKey="skuCode"
              :columns="rebateColumnsFour"
              :dataSource="rebateDataFour"
              size="small"
              :scroll="{x:1100}"
              :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
              bordered>
              <template slot="title" slot-scope="currentPageData">
                高端出样合计（元）：{{ rebateCountFour }}
              </template>
            </a-table>
          </a-spin>
        </a-tab-pane>
        <a-tab-pane tab="提货台阶" key="提货台阶">
          <a-spin :spinning="spinning">
            <a-table
              rowKey="skuCode"
              :columns="rebateColumnsFive"
              :dataSource="rebateDataFive"
              size="small"
              :scroll="{x:1200}"
              :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
              bordered>
              <template slot="title" slot-scope="currentPageData">
                提货台阶合计（元）：{{ rebateCountFive }}
              </template>
            </a-table>
          </a-spin>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
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
<style lang="less" scoped>

</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/RebateConfirmationPreview'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'RebateConfirmation',
    components: { NewTable, SeachBox, BtModal, Preview },
    data: function () {
        return {
            // 搜索工具
            condition: [
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
                        type: 'wholesale_rebate_confirm_status'
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
                },
                {
                    key: 'strategyDefineCode',
                    type: 'select',
                    title: '渠道政策',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'DistPurchaseFindWholesaleRebatePolicyList'
                },
                {
                    key: 'customerCode',
                    type: 'select',
                    title: '客户',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'CustomerDistributorsFindBySelected'
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
            //  表格多选框的值
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOPT: [
                {
                    name: '编辑',
                    action: 'RebateConfirmation.edit',
                    fc: this.addEdit
                },
                {
                    name: '审核',
                    action: 'RebateConfirmation.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'RebateConfirmation.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'DistributionDiscountForm.get',
                    fc: this.detailHandler
                }
            ],
            // 单据
            addEditModal: false,
            addEditTitle: '',
            tags: ['uncheck'],
            isAdd: false,
            // form
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            strategyDefineValue: '', // 政策
            customerValue: '', // 客户
            submitLoading: false,
            // 单据表格
            tableDetailColumes: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '政策类型', dataIndex: 'strategyType', align: 'center' },
                { title: '应返金额', dataIndex: 'shouldRebateAmount', align: 'center' },
                { title: '调整金额', dataIndex: 'adjustAmount', align: 'center', scopedSlots: { customRender: 'adjustAmount' } },
                { title: '实际返利金额', dataIndex: 'actualRebateAmount', align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            tableDetailData: [],
            selectedRowKeys: [], // 选中的值 code
            selectedRows: [], // 选中的值
            shouldRebateAmount: '0.00', // 应返利金额
            actualRebateAmount: '0.00', // 实际返利金额
            adjustAmountAll: '0.00', // 调整金额
            // 返利 明细
            rebateDetail: false,
            defaulTabKey: '提货规模',
            spinning: false,
            // 提货规模 1
            rebateColumnsOne: [
                { title: '序号', width: 50, align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '计算项目', dataIndex: 'project', align: 'center' },
                { title: '政策', dataIndex: 'policy', align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            rebateDataOne: [],

            // 常规机政策价 2
            rebateColumnsTow: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center', width: 150 },
                { title: '品牌', dataIndex: 'trademark', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center', width: 100 },
                { title: '提货金额', dataIndex: 'pickingUpMoney', align: 'center', width: 100 },
                { title: '起提数', dataIndex: 'startingNumber', align: 'center', width: 100 },
                { title: '政策价', dataIndex: 'policyMoney', align: 'center', width: 100 },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', width: 100 }
            ],
            rebateDataTow: [],
            rebateCountTow: '0.00',

            // 销售奖励 3
            rebateColumnsThree: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center', width: 150 },
                { title: '品牌', dataIndex: 'trademark', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center', width: 100 },
                { title: '单台奖励', dataIndex: 'policyMoney', align: 'center', width: 100 },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', width: 100 }
            ],
            rebateDataThree: [],
            rebateCountThree: '0.00',

            // 高端出样 4
            rebateColumnsFour: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center', width: 150 },
                { title: '品牌', dataIndex: 'trademark', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center', width: 100 },
                { title: '提货金额', dataIndex: 'pickingUpMoney', align: 'center', width: 100 },
                // { title: '起提数', dataIndex: 'startNum', align: 'center', width: 100 },
                { title: '政策价', dataIndex: 'policyMoney', align: 'center', width: 100 },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', width: 100 }
            ],
            rebateDataFour: [],
            rebateCountFour: '0.00',

            // 提货台阶 5
            rebateColumnsFive: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center', width: 150 },
                { title: '品牌', dataIndex: 'trademark', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center', width: 100 },
                { title: '提货金额', dataIndex: 'pickingUpMoney', align: 'center', width: 100 },
                { title: '台阶数', dataIndex: 'step', align: 'center', width: 100 },
                { title: '政策价金额', dataIndex: 'policyMoney', align: 'center', width: 100 },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', width: 100 }
            ],
            rebateDataFive: [],
            rebateCountFive: '0.00',

            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            makeStoreCodeDorpArr: [],
            customerCodeArr: [],
            createByDorpArr: [],
            strategyDefineCodeArr: []
        }
    },
    computed: {
        setStartTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'c6d4003a0db6416bb8a1f7ed9b009bfb:RebateConfirmation'
            this.tableApiPath = 'DistWholesaleRebateQueryRebateConfirm'
            this.$refs.newTable.setContextmenu(this.menuOPT)
        })
        this.getMakeStoreCodeDorpArr()
        this.getStrategyDefineCodeDropArr()
    },
    methods: {
        onSeach (e) {
            e.path = 'DistWholesaleRebateQueryRebateConfirm'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onReload () {
            this.seachValue = {}
        },
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
                this.$refs.newTable.exportFile('DistWholesaleRebateQueryRebateConfirm')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistWholesaleRebateQueryRebateConfirm' })
        },
        onSelect (ketIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        onContextmenuChange (tableRow) {
            this.tableSingData = { ...tableRow }
            if (tableRow.status === 'wholesale_rebate_confirm_status:0') {
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
                const isAuit = newData.filter(o => o.status !== 'wholesale_rebate_confirm_status:0')
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
                        path: 'DistWholesaleRebateDeleteConfirm', // 接口path名，必传
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
                        path: 'DistWholesaleRebateAuditConfirm', // 接口path名，必传
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
         * @name: 销售位置
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
         * @msg:
         * @param {type}
         * @return:
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
         * @name: 渠道政策
         * @msg:
         * @param {type}
         * @return:
         */
        getStrategyDefineCodeDropArr () {
            axios({
                path: 'DistPurchaseFindWholesaleRebatePolicyList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = `${i.code}:${i.name}`
                        i.key = i.code
                    })
                    this.strategyDefineCodeArr = dataArr
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
         * @name: 政策名称
         * @msg:
         * @param {type}
         * @return:
         */
        changeStrategyDefineValue (value) {
            const _this = this
            if (this.tableDetailData.length === 0) {
                this.strategyDefineValue = value
            } else {
                this.$confirm({
                    title: '提示',
                    content: '政策名称变换，详情数据将被清空是否继续',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        _this.tableDetailData = []
                        _this.strategyDefineValue = value
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                        _this.form.setFieldsValue({
                            strategyDefineCode: _this.strategyDefineValue
                        })
                    }
                })
            }
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
                    content: '客户变换，详情数据将被清空是否继续',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
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
            this.addEditModal = true
            if (addEditData === -1) {
                this.addEditTitle = '新增返利确认单'
                this.tableDetailData = []
                this.tableSingleData = {}
                this.isAdd = true
                this.shouldRebateAmount = '0.00'
                this.actualRebateAmount = '0.00'
                this.adjustAmountAll = '0.00'
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
                this.tableSingleData.strategyDefineCode = addEditData.strategyDefineCode + ':' + addEditData.strategyDefineName
                this.strategyDefineValue = addEditData.strategyDefineCode + ':' + addEditData.strategyDefineName
                this.addEditTitle = '编辑返利确认单'
                this.getCustomerCodeDorpArr(addEditData.customerCode)
                axios({
                    path: 'DistWholesaleRebateQueryDetail',
                    method: 'post',
                    body: {
                        rebateConfirmCode: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.tableDetailData = res.data
                        this.shouldRebateAmount = addEditData.shouldAmount
                        this.actualRebateAmount = addEditData.actualAmount
                        this.adjustAmountAll = (Number(addEditData.actualAmount) - Number(addEditData.shouldAmount)).toFixed(2)
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
                        this.$message.warning('请设置渠道政策详情')
                        return
                    }
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                    }
                    values.createTime = this.defauilForm.createTime
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.shouldRebateAmount = this.shouldRebateAmount
                    values.actualRebateAmount = this.actualRebateAmount
                    values.detailList = this.tableDetailData
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'DistWholesaleRebateAddRebateConfirm' : 'DistWholesaleRebateUpdateRebateConfirm',
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
         * @name: 详情表格的合计
         * @msg:
         * @param {type}
         * @return:
         */
        count (arrData) {
            const shouldRebateAmountArr = []
            const actualRebateAmountArr = []
            const adjustAmountAllArr = []
            const { add } = this.$math
            if (arrData.length > 0) {
                arrData.forEach(item => {
                    shouldRebateAmountArr.push(item.shouldRebateAmount)
                    actualRebateAmountArr.push(item.actualRebateAmount)
                    adjustAmountAllArr.push(item.adjustAmount)
                })
                this.shouldRebateAmount = shouldRebateAmountArr.reduce((pre, cur) => {
                    return add(pre, cur, 2)
                }, 0)
                this.actualRebateAmount = actualRebateAmountArr.reduce((pre, cur) => {
                    return add(pre, cur, 2)
                }, 0)
                this.adjustAmountAll = adjustAmountAllArr.reduce((pre, cur) => {
                    return add(pre, cur, 2)
                }, 0)
            } else {
                this.shouldRebateAmount = '0.00'
                this.actualRebateAmount = '0.00'
                this.adjustAmountAll = '0.00'
            }
        },
        /**
         * @name: 取渠道政策
         * @msg:
         * @param {type}
         * @return:
         */
        getDetailData () {
            if (!this.$refs.customerRef.value) {
                this.$message.warning('请选择客户信息')
                return
            }
            if (!this.$refs.strategyDefineRef.value) {
                this.$message.warning('请选择政策信息')
                return
            }
            const obj = this.strategyDefineCodeArr.filter(o => o.value === this.strategyDefineValue)[0]
            // console.log(obj)
            if (obj) {
                axios({
                    path: 'DistWholesaleRebateReportFindWholesaleRebateReportInfo',
                    method: 'post',
                    body: {
                        strategyDefineCode: obj.code,
                        customerCodeList: [this.$refs.customerRef.value],
                        startTime: obj.beginTime,
                        endTime: obj.endTime,
                        saleStoreCodeList: [this.$refs.saleStoreCodeRef.value]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data.sumPickingUpScaleByCustomer || res.data.sumPickingUpScaleByCustomer === 0) {
                            const newDataTable = [
                                { strategyType: '提货规模', shouldRebateAmount: 10.00, adjustAmount: 0, actualRebateAmount: 10, note: '' },
                                { strategyType: '常规机政策价', shouldRebateAmount: 10.00, adjustAmount: 0, actualRebateAmount: 10, note: '' },
                                { strategyType: '销售奖励机型', shouldRebateAmount: 10.00, adjustAmount: 0, actualRebateAmount: 10, note: '' },
                                { strategyType: '高端出样', shouldRebateAmount: 10.00, adjustAmount: 0, actualRebateAmount: 10, note: '' },
                                { strategyType: '提货台阶', shouldRebateAmount: 10.00, adjustAmount: 0, actualRebateAmount: 10, note: '' }
                            ]
                            newDataTable[0]['shouldRebateAmount'] = res.data['sumPickingUpScaleByCustomer']
                            newDataTable[0]['actualRebateAmount'] = res.data['sumPickingUpScaleByCustomer']
                            newDataTable[1]['shouldRebateAmount'] = res.data['sumConventionalPolicyByCustomer']
                            newDataTable[1]['actualRebateAmount'] = res.data['sumConventionalPolicyByCustomer']
                            newDataTable[2]['shouldRebateAmount'] = res.data['sumSalesIncentivesByCustomer']
                            newDataTable[2]['actualRebateAmount'] = res.data['sumSalesIncentivesByCustomer']
                            newDataTable[3]['shouldRebateAmount'] = res.data['sumHighEndByCustomer']
                            newDataTable[3]['actualRebateAmount'] = res.data['sumHighEndByCustomer']
                            newDataTable[4]['shouldRebateAmount'] = res.data['sumPickUpStepsByCustomer']
                            newDataTable[4]['actualRebateAmount'] = res.data['sumPickUpStepsByCustomer']
                            this.tableDetailData = [...newDataTable]
                            this.count(this.tableDetailData)
                        }
                    }
                })
            }
        },
        /**
         * @name: 重置渠道政策
         * @msg:
         * @param {type}
         * @return:
         */
        reSetDetailData () {
            this.tableDetailData = []
            this.count(this.tableDetailData)
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
            const { add } = this.$math
            const newData = [...this.tableDetailData]
            const target = newData.filter(item => count === item.strategyType)[0]
            if (target) {
                if (key === 'adjustAmount') {
                    target[key] = val || 0
                    if (!isNaN(Number(target[key]))) {
                        target['actualRebateAmount'] = add(target['shouldRebateAmount'], target[key], 2)
                        this.count(newData)
                    }
                } else {
                    target[key] = val
                }
                this.tableDetailData = newData
            }
        },
        /**
         * @name:  单据 表格 操作详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailRow (row) {
            this.rebateDetail = true
            this.defaulTabKey = row.strategyType
            this.spinning = true
            const obj = this.strategyDefineCodeArr.filter(o => o.value === this.strategyDefineValue)[0]
            axios({
                path: 'DistWholesaleRebateReportFindWholesaleRebateReportDetail',
                method: 'past',
                body: {
                    strategyDefineCode: obj.code,
                    customerCodeList: [this.$refs.customerRef.value],
                    saleStoreCodeList: [this.$store.getters.storeInfo.code],
                    startTime: obj.beginTime,
                    endTime: obj.endTime
                }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    let rebateDataObj = {}
                    if (res.data.wholesaleRebatePickingUpScale) {
                        rebateDataObj = res.data.wholesaleRebatePickingUpScale
                    }
                    const newData = [
                        {
                            project: '提货金额',
                            policy: rebateDataObj.pickingUpMoney,
                            note: ''
                        },
                        {
                            project: '特价机金额',
                            policy: rebateDataObj.policyMoney,
                            note: ''
                        },
                        {
                            project: '特价机计划比例',
                            policy: rebateDataObj.policyPlanPercent,
                            note: ''
                        },
                        {
                            project: '特价机计划金额',
                            policy: rebateDataObj.policyPlanMoney,
                            note: ''
                        },
                        {
                            project: '实际特价机比例',
                            policy: rebateDataObj.policyRealPercent,
                            note: ''
                        },
                        {
                            project: '实际特价机金额',
                            policy: rebateDataObj.policyRealMoney,
                            note: ''
                        },
                        {
                            project: '提货额区间',
                            policy: rebateDataObj.pickingUpMoneySection,
                            note: ''
                        },
                        {
                            project: '规模返点比例',
                            policy: rebateDataObj.rebatePointPercent,
                            note: ''
                        },
                        {
                            project: '形式3：规模台阶返点',
                            policy: rebateDataObj.rebatePointMoney,
                            note: ''
                        }
                    ]
                    this.rebateDataOne = newData
                    this.rebateDataTow = res.data.wholesaleRebateConventionalPolicyList
                    this.rebateCountTow = Number(res.data.sumConventionalPolicyByCustomer).toFixed(2)
                    this.rebateDataThree = res.data.wholesaleRebateSalesIncentivesList
                    this.rebateCountThree = Number(res.data.sumSalesIncentivesByCustomer).toFixed(2)
                    this.rebateDataFour = res.data.wholesaleRebateHighEndList
                    this.rebateCountFour = Number(res.data.sumHighEndByCustomer).toFixed(2)
                    this.rebateDataFive = res.data.wholesaleRebatePickUpStepsList
                    this.rebateCountFive = Number(res.data.sumPickUpStepsByCustomer).toFixed(2)
                }
            })
        },
        callback (keyValue) {

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
        'seachValue.startTime' (val) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime = moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val) {
            if (val && this.seachValue.startTime) {
                if (moment(val).isBefore(this.seachValue.endTime)) {
                    this.seachValue.startTime = moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        '$store.state.app.pageName' (to) {
            if (to === 'RebateConfirmation') {
                this.getMakeStoreCodeDorpArr()
                this.getStrategyDefineCodeDropArr()
            }
        }
    }
}
</script>

<style scoped>

</style>

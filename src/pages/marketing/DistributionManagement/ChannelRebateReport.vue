<!--
 * @Description: 渠道返利报表
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-04-17 11:18:45
 * @LastEditTime: 2019-07-03 16:14:38
 -->
<template>
  <div class="channelRebateReport" ref="channelRebateReport">
    <!-- 工具栏 -->
    <seach-box
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <a-button type="primary" size="small" @click="findWholesaleRebateReportDetail">返利明细</a-button>
    </seach-box>
    <!-- min table -->
    <!-- <div class="total">
      <span>提货规模合计：</span>
      <span>常规机政策价合计：</span>
      <span>销售奖励机型合计：</span>
      <span>高端样机合计：</span>
      <span>提货台阶合计：</span>
    </div> -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    />
    <a-modal
      title="返利明细"
      :visible="visible"
      width="980px"
      @cancel="visible=false"
      :getContainer="() => $refs.channelRebateReport"

    >
      <a-tabs :defaultActiveKey="defaultActiveKey" @change="callback">
        <a-tab-pane tab="提货规模" key="1">
          <a-table
            rowKey="code"
            :columns="tableDetailColumns"
            :dataSource="reportDetail.wholesaleRebatePickingUpScale"
            size="small"
            bordered
            :pagination="false"
          ></a-table>
        </a-tab-pane>
        <a-tab-pane tab="常规机政策价" key="2">
          <div class="total">
            <span>常规机政策价合计：{{ reportDetail.sumConventionalPolicyByCustomer }}</span>
          </div>
          <a-table
            rowKey="code"
            :columns="tableDetailColumns1"
            :dataSource="reportDetail.wholesaleRebateConventionalPolicyList"
            size="small"
            bordered
            :pagination="false"

          ></a-table>
        </a-tab-pane>
        <a-tab-pane tab="销售奖励机型" key="3" >
          <div class="total">
            <span>销售奖励机型合计：{{ reportDetail.sumSalesIncentivesByCustomer }}</span>
          </div>
          <a-table
            rowKey="code"
            :columns="tableDetailColumns2"
            :dataSource="reportDetail.wholesaleRebateSalesIncentivesList"
            size="small"
            bordered
            :pagination="false"
          ></a-table>
        </a-tab-pane>
        <a-tab-pane tab="高端样机" key="4">
          <div class="total">
            <span>高端样机合计：{{ reportDetail.sumHighEndByCustomer }}</span>
          </div>
          <a-table
            rowKey="code"
            :columns="tableDetailColumns3"
            :dataSource="reportDetail.wholesaleRebateHighEndList"
            size="small"
            bordered
            :pagination="false"

          ></a-table>
        </a-tab-pane>
        <a-tab-pane tab="提货台阶" key="5">
          <div class="total">
            <span>提货台阶合计：{{ reportDetail.sumPickUpStepsByCustomer }}</span>
          </div>
          <a-table
            rowKey="code"
            :columns="tableDetailColumns4"
            :dataSource="reportDetail.wholesaleRebatePickUpStepsList"
            size="small"
            bordered
            :pagination="false"
          ></a-table>
        </a-tab-pane>
      </a-tabs>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
export default {
    name: 'ChannelRebateReport',
    components: { NewTable, SeachBox },
    data: function () {
        return {
            // 搜索工具
            conditions: [
                {
                    key: 'strategyDefineCode',
                    title: '政策',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    selectDataArr: this.rebatePolicyList
                },
                {
                    key: 'saleStoreCodeList',
                    title: '销售位置编码',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99,
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'customerCodeList',
                    title: '客户',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99,
                    path: 'DistOriginDataQueryChannelCustomerList',
                    body: {}
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '政策开始时间',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '政策结束时间',
                    mat: 'YYYY-MM-DD'
                }

            ],
            btns: ['export', 'print'],
            seachValue: {
                strategyDefineCode: '',
                saleStoreCodeList: [],
                customerCodeList: [],
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            },
            // 主表格
            tableCode: '',
            tableApiPath: '',
            // 单行选中的值
            tableSingleData: {},
            // 表格选中中的数据
            tableIdsArr: [],
            taleRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '返利明细',
                    action: 'ChannelRebateReport.query',
                    fc: this.findWholesaleRebateReportDetail
                }
            ],
            // 政策数组
            rebatePolicyList: [],
            // 返利
            visible: false,
            defaultActiveKey: '1',
            // 提货规模
            tableDetailColumns: [
                { title: '序号', width: 50, align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '计算项目', dataIndex: 'project', align: 'center' },
                { title: '政策', dataIndex: 'policy', align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            // ("常规机政策价金额汇总")
            // sumConventionalPolicyByCustomer;
            tableDetailColumns1: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center' },
                { title: '品牌', dataIndex: 'trademark', align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center' },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center' },
                { title: '提货金额', dataIndex: 'pickingUpMoney', align: 'center', customRender: (text, record, index) => record.pickingUpMoney.toFixed(2) },
                { title: '起提数', dataIndex: 'startingNumber', align: 'center' },
                { title: '政策价', dataIndex: 'policyMoney', align: 'center', customRender: (text, record, index) => record.policyMoney.toFixed(2) },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', customRender: (text, record, index) => record.allowanceMoney.toFixed(2) }
            ],
            // 销售奖励机型：
            tableDetailColumns2: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center' },
                { title: '品牌', dataIndex: 'trademark', align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center' },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center' },
                { title: '单台奖励', dataIndex: 'policyMoney', align: 'center', customRender: (text, record, index) => record.policyMoney.toFixed(2) },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', customRender: (text, record, index) => record.allowanceMoney.toFixed(2) }
            ],
            // 高端样机
            // ("高端出样金额汇总")sumHighEndByCustomer;
            tableDetailColumns3: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center' },
                { title: '品牌', dataIndex: 'trademark', align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center' },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center' },
                { title: '提货金额', dataIndex: 'pickingUpMoney', align: 'center', customRender: (text, record, index) => record.pickingUpMoney.toFixed(2) },
                { title: '起提数', dataIndex: 'startingNumber', align: 'center' },
                { title: '政策价', dataIndex: 'policyMoney', align: 'center', customRender: (text, record, index) => record.policyMoney.toFixed(2) },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', customRender: (text, record, index) => record.allowanceMoney.toFixed(2) }
            ],
            // 提货台阶：
            tableDetailColumns4: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'category', align: 'center' },
                { title: '品牌', dataIndex: 'trademark', align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center' },
                { title: '提货数量', dataIndex: 'pickingUpNum', align: 'center' },
                { title: '台阶数', dataIndex: 'stepsNum', align: 'center' },
                { title: '政策价金额', dataIndex: 'policyMoney', align: 'center', customRender: (text, record, index) => record.policyMoney.toFixed(2) },
                { title: '返利金额', dataIndex: 'allowanceMoney', align: 'center', customRender: (text, record, index) => record.allowanceMoney.toFixed(2) }
            ],
            tableDetailData: [],
            reportDetail: {}
        }
    },
    computed: {
        setStartTime () {
            return moment()
        }
    },
    created () {
    },
    async mounted () {
        /// DistWholesaleRebateReportFindWholesaleRebateReportPageList
        // POST DistWholesaleRebateReportFindWholesaleRebateReportDetail
        // POST DistPurchaseFindWholesaleRebatePolicyList
        // this.seachValue.strategyDefineCode = this.seachValue
        console.log(this.seachValue)
        await this.findWholesaleRebatePolicyList()

        // this.getCreateByDorpArr()
        // this.getMakeStoreCodeDorpArr()
        // this.getCustomerCodeDorpArr()
    },
    methods: {
        /**
       * @name: 表格搜索
       * @msg:
       * @param {type}
       * @return:
       */
        onSeach (e) {
            e.path = 'DistWholesaleRebateReportFindWholesaleRebateReportPageList'
            console.log(e)
            this.rebatePolicyList.forEach(el => {
                if (e.strategyDefineCode === el.code) {
                    e.startTime = el.beginTime
                    e.endTime = el.endTime
                }
            })
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
                this.$refs.newTable.exportFile('DistWholesaleRebateReportFindWholesaleRebateReportPageList')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistWholesaleRebateReportFindWholesaleRebateReportPageList' })
        },
        onSelect (keyIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'wholesale_allowances_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        showModal () {
            this.visible = true
        },
        /**
         * @name: 获取返利明细
         * @msg:
         * @param {type}
         * @return:
         */
        findWholesaleRebateReportDetail (e) {
            console.log(e)

            this.visible = true
            const data = {
                strategyDefineCode: this.seachValue.strategyDefineCode,
                saleStoreCodeList: [e.saleStoreCode],
                customerCodeList: [e.customerCode],
                startTime: this.seachValue.startTime,
                endTime: this.seachValue.endTime
            }
            axios({
                path: 'DistWholesaleRebateReportFindWholesaleRebateReportDetail',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    if (res.data) {
                        this.reportDetail = res.data
                        const newlist = [
                            {
                                project: '提货金额',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.pickingUpMoney,
                                note: ''
                            },
                            {
                                project: '特价机金额',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.policyMoney,
                                note: ''
                            },
                            {
                                project: '特价机计划比例',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.policyPlanPercent,
                                note: ''
                            },
                            {
                                project: '特价机计划金额',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.policyPlanMoney,
                                note: ''
                            }, {
                                project: '实际特价机比例',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.policyRealPercent,
                                note: ''
                            },
                            {
                                project: '实际特价机金额',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.policyRealMoney,
                                note: ''
                            },
                            {
                                project: '提货额区间',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.pickingUpMoneySection,
                                note: ''
                            }, {
                                project: '规模返点比例',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.rebatePointPercent,
                                note: ''
                            },
                            {
                                project: '形式3：规模台阶返点',
                                policy: this.reportDetail.wholesaleRebatePickingUpScale.rebatePointMoney,
                                note: `（提货金额-特价机金额）*${this.reportDetail.wholesaleRebatePickingUpScale.rebatePointPercent}`
                            }
                        ]
                        this.reportDetail.wholesaleRebatePickingUpScale = newlist
                        // console.log(this.reportDetail.wholesaleRebatePickingUpScale)
                    } else {
                        this.reportDetail = {}
                    }
                }
            })
        },
        handleCancel (e) {
            console.log('Clicked cancel button')
            this.visible = false
        },
        callback (key) {
            console.log(key)
        },
        findWholesaleRebatePolicyList () {
            axios({
                path: 'DistPurchaseFindWholesaleRebatePolicyList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    // console.log(res)
                    if (res.data) {
                        this.rebatePolicyList = res.data
                        this.$set(this.conditions[0], 'selectDataArr', this.rebatePolicyList)

                        // console.log(res.data[0])
                        this.seachValue.strategyDefineCode = res.data[0].code
                        this.seachValue.startTime = res.data[0].beginTime
                        this.seachValue.endTime = res.data[0].endTime
                        this.seachValue.startTime = moment(this.seachValue.startTime).format('YYYY-MM-DD')
                        this.seachValue.endTime = moment(this.seachValue.endTime).format('YYYY-MM-DD')
                        this.$nextTick(() => {
                            this.tableCode = '4f9d05a30ae54fc4b9106e1670730525:ChannelRebateReport'
                            this.tableApiPath = 'DistWholesaleRebateReportFindWholesaleRebateReportPageList'
                            this.$refs.newTable.setContextmenu(this.menuOpt)
                        })
                    }
                }
            })
        }

    }
}
</script>

<style scoped lang="less">
.channelRebateReport{
    .total{
        padding:10px 15px;
        span{
            display: inline-block;
            margin-right: 20px;
        }
    }
}
</style>

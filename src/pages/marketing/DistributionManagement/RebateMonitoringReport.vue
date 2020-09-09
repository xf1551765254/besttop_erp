<!--
 * @Description: 返利监控报表
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-04-17 11:18:28
 * @LastEditTime: 2019-07-29 11:18:02
 -->
<template>
  <div class="RebateMonitoringReport" ref="RebateMonitoringReport">
    <!-- 工具栏 -->
    <seach-box
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
    </seach-box>
    <!-- <a-table
      :columns="notBillColumns"
      :dataSource="tableData"
      :pagination="false"

    >
    </a-table> -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    />
  </div>
</template>

<script>
import moment from 'moment'
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
export default {
    name: 'RebateMonitoringReport',
    components: { NewTable, SeachBox },

    data: function () {
        return {
            conditions: [
                {
                    key: 'storeCode',
                    title: '销售位置',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99,
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'customerCode',
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
                    key: 'startAuditTime',
                    type: 'date',
                    unAllowClear: true,
                    title: '开始时间',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endAuditTime',
                    unAllowClear: true,
                    type: 'date',
                    title: '结束时间',
                    mat: 'YYYY-MM-DD'
                }

            ],
            notBillColumns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '销售位置编码', dataIndex: 'storeCode', key: 'storeCode' },
                { title: '销售位置名称', dataIndex: 'storeName', key: 'storeName' },
                { title: '客户编码', dataIndex: 'customerCode', key: 'customerCode' },
                { title: '客户名称', dataIndex: 'customerName', key: 'customerName' },
                { title: '发生时间', dataIndex: 'auditTime', key: 'auditTime' },
                { title: '单据类型', dataIndex: 'billType', key: 'billType' },
                { title: '单据号', dataIndex: 'orderNo', key: 'orderNo' },
                { title: '期初金额', dataIndex: 'beginAmount', key: 'beginAmount' },
                { title: '返利金额', dataIndex: 'rebateAmount', key: 'rebateAmount' },
                { title: '折让金额', dataIndex: 'allowancesAmount', key: 'allowancesAmount' },
                { title: '余额', dataIndex: 'balance', key: 'balance' },
                { title: '备注', width: 200, dataIndex: 'note', key: 'note' }

            ],
            tableData: [],

            btns: ['export', 'print'],
            seachValue: {
                storeCode: [],
                customerCode: [],
                startAuditTime: moment().startOf('day').subtract({ days: 7 }).format('YYYY-MM-DD'),
                endAuditTime: moment().startOf('day').format('YYYY-MM-DD')
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
            menuOpt: []
        }
    },
    computed: {
        setStartTime () {
            return moment()
        }
    },
    async mounted () {
        console.log(this.seachValue)
        // this.queryWholesaleRebateReport()
        this.$nextTick(() => {
            this.tableCode = '0703897a857a427d8ea891032afc9037:RebateMonitoringReport'
            this.tableApiPath = 'WholesaleBiQueryWholesaleRebateReport'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        moment,
        /**
       * @name: 表格搜索
       * @msg:
       * @param {type}
       * @return:
       */
        // WholesaleBiQueryWholesaleRebateReport
        // onSeach (e) {
        //     this.queryWholesaleRebateReport()
        // },
        onSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            this.reLoadTableData()
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'WholesaleBiQueryWholesaleRebateReport' })
        },
        onReload () {
            this.seachValue = {
                storeCode: [],
                customerCode: [],
                startAuditTime: moment().startOf('day').subtract({ days: 7 }).format('YYYY-MM-DD'),
                endAuditTime: moment().startOf('day').format('YYYY-MM-DD')
            }
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
                this.$refs.newTable.exportFile('WholesaleBiQueryWholesaleRebateReport')
            }
        },

        // onSelect (keyIndex, keyRows) {
        //     this.tableIdsArr = map(keyRows, 'id')
        //     this.tableRowsArr = keyRows
        // },
        queryWholesaleRebateReport () {
            axios({
                path: 'WholesaleBiQueryWholesaleRebateReport',
                method: 'post',
                body: this.seachValue
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.tableData = res.data
                    }
                }
            })
        }
    }
}
</script>

<style scoped>

</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-05 16:57:20
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import moment from 'moment'
export default {
    name: 'TemporaryReport',
    components: { seachBox, NewTable, BtModal },
    data () {
        return {
            tags: [],
            orderId: '',
            // 表头id
            tableCode: '',
            // 负责人
            customerLIst: [],
            // 接口
            tableApiPath: '',
            // 工具栏搜索框
            conditions: [
                {
                    key: 'dateType',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 1, label: '销售日期' },
                        { value: 2, label: '预约送货时间' },
                        { value: 3, label: '暂存登记时间' }
                    ]
                },
                {
                    title: '开始时间',
                    key: 'beginTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'endTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '送货单号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '暂存状态',
                    type: 'select',
                    key: 'keepStatus',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'bill_deliver_keep_status', grade: '1' }
                }
            ],
            // 工具栏按钮定义
            btns: ['export', 'print'],
            // 搜索框默认值
            seachValue: {
                beginTime: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'f0210f1538fc46d3a4e8d1ecef47c32c:TemporaryReport'
            this.tableApiPath = 'DistributionDelverTempFindTemp'
        })
    },
    methods: {
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'DistributionDelverTempFindTemp'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
            } else if (e === 'del') {

            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionDelverTempFindTemp', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        }
    }
}
</script>

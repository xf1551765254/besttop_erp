<!--
 * @Description: 卡使用报表
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-07-04 20:54:16
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
      :rowSelect="false"
      :pams="seachValue">
    </NewTable>
  </div>
</template>
<style lang="less">

</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
// import { axios } from '@/utils/request'
export default {
    components: { NewTable, SeachBox },
    name: 'CardUsageReport',
    data () {
        return {
            conditions: [
                {
                    key: 'cardNo',
                    type: 'input',
                    title: '卡号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '使用开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '使用结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'payNumber',
                    type: 'input',
                    title: '消费单号'
                },
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '使用位置',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'OrganizationStoreFind'
                }
            ],
            btns: ['export', 'print'],
            seachValue: {}, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '' // path
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b75ab9263067423698dc65c0991023b4:cardUsageReport'
            this.tableApiPath = 'TradeRecordQueryValueRecords'
            // this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'TradeRecordQueryValueRecords'
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
            if (e === 'export') {
                this.$refs.newTable.exportFile('TradeRecordQueryValueRecords')
            }
        }
    }
}
</script>

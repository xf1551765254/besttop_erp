<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:29:16
 * @LastEditTime: 2019-07-08 16:05:46
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import moment from 'moment'
export default {
    name: 'SystemLog',
    components: {
        NewTable,
        seachBox
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            // 工具栏数据定义--start
            seachValue: {},
            conditions: [
                { title: '用户编码', type: 'input', key: 'userCode' },
                { title: '系统类型', type: 'input', key: 'type' },
                { title: '模块名称', type: 'input', key: 'moduleName' },
                { title: '开始时间', type: 'date', key: 'beginTime', mat: 'YYYY-MM-DD HH:mm:ss', showTime: true },
                { title: '结束时间', type: 'date', key: 'endTime', mat: 'YYYY-MM-DD HH:mm:ss', showTime: true }
            ],
            // 工具栏数据定义--end
            menuOpt: [
                { name: '详情', action: 'systemLog.get', fc: e => this.$refs.newTable.showDetails('日志详情', e) }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$set(this.seachValue, 'beginTime', moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'))
            this.$set(this.seachValue, 'endTime', moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'))
            this.tableCode = '22f71f1da1b841e8b0d361a049530e35:systemLog'
            this.tableApiPath = 'SysLogFindSysLogSearch'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        /**
         * @name: 将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索
         */
        onSeach (e) {
            e.path = 'SysLogFindSysLogSearch'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    }
}
</script>

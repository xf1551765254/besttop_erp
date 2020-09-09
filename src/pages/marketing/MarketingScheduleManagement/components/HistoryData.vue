<!--
 * @Description: 发放历史数据
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-10 16:54:22
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-05 15:30:53
 -->
<template>
  <div class="box">
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach">
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
    ></NewTable>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
// import moment from 'moment'

export default {
    name: 'HistoryData',
    components: {
        seachBox,
        NewTable
    },
    data () {
        return {
            conditions: [
                { title: '顾客姓名', type: 'input', key: 'customerName' },
                { title: '顾客电话', type: 'input', key: 'customerPhone' },
                { title: '销售单号', type: 'input', key: 'orderCode' },
                { title: '发放开始时间', type: 'date', key: 'startTime', mat: 'YYYY-MM-DD HH:mm:ss', showTime: true },
                { title: '发放结束时间', type: 'date', key: 'endTime', mat: 'YYYY-MM-DD HH:mm:ss', showTime: true },
                {
                    title: '发放状态',
                    type: 'select',
                    key: 'type',
                    label: 'name',
                    value: 'code',
                    selectDataArr: [
                        {
                            code: 'schedule_gift_record_type:1',
                            name: '已发放'
                        },
                        {
                            code: 'schedule_gift_record_type:2',
                            name: '已回收'
                        }
                    ]
                }
            ],
            seachValue: {},
            tableCode: '',
            tableApiPath: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '63773c591afd416c9b29011c22268cde:ScheduleGiftQueryGiftHistoryRecord'
            this.tableApiPath = 'ScheduleGiftQueryGiftHistoryRecord'
        })
    },
    methods: {
        onReload () {
            this.seachValue = {}
        },
        onSeach (e) {
            e.path = 'ScheduleGiftQueryGiftHistoryRecord'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    }
}
</script>

<style lang="less" scoped>

</style>

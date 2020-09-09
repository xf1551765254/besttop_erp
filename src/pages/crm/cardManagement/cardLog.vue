<!--
 * @Description: 卡日志
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-28 18:39:38
 * @LastEditTime: 2019-07-11 15:52:24
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"
    />
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :rowSelect="false"
      :pams="seachValue">
    </newtable>
  </div>
</template>
<style lang="less" scoped>

</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox },
    name: 'CardLog',
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
                    title: '操作开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '操作结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'typeName',
                    type: 'select',
                    title: '卡名称',
                    label: 'typeName',
                    value: 'typeName',
                    filter: true,
                    path: 'CardDefineQueryAllName'
                },
                {
                    key: 'operationStore',
                    type: 'select',
                    title: '操作位置',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'OrganizationStoreFind'
                },
                {
                    key: 'operationType',
                    type: 'select',
                    title: '操作类型',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'card_log_operation_type'
                    }
                }
            ],
            btns: ['export', 'print'],
            seachValue: {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '' // path
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ce7affff28ee46299871e42d5218fb1d:cardLog'
            this.tableApiPath = 'CardLogQueryCardLogs'
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
            e.path = 'CardLogQueryCardLogs'
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
                this.$refs.newTable.exportFile('CardLogQueryCardLogs')
            }
        }
    }
}
</script>

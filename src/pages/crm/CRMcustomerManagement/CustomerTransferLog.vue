<!--
 * @Description: 顾客转移日志
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-26 17:40:39
 * @LastEditors: lin
 * @LastEditTime: 2019-08-27 15:52:55
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

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox },
    name: 'HappenLog',
    data () {
        return {
            conditions: [
                {
                    key: 'transferOutCode',
                    type: 'select',
                    title: '转出人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '操作人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '操作人机构',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'OrganizationStoreFindCondition'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '转移开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '转移结束日期',
                    mat: 'YYYY-MM-DD'
                }
            ],
            btns: ['export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '' // path
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'e444751185f04a5d85c5838386605973:CustomerTransferLog'
            this.tableApiPath = 'CustomerTransferQueryList'
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
            e.path = 'CustomerTransferQueryList'
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
                this.$refs.newTable.exportFile('CustomerTransferQueryList')
            }
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
        }
    }
}
</script>

<!--
 * @Description: 卡报表
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-07-11 11:22:02
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
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    components: { NewTable, SeachBox },
    name: 'CardStatement',
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
                    title: '储值开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '储值结束日期',
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
                    key: 'status',
                    type: 'select',
                    title: '卡状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'card_make_status'
                    }
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
            this.tableCode = '9975cc212dd44bc2901d46a1fed0f73c:cardStatement'
            this.tableApiPath = 'CardMakeQueryCardReport'
            // this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTableData()
    },

    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CardMakeQueryCardReport'
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
                this.$refs.newTable.exportFile('CardMakeQueryCardReport')
            }
        },
        /**
         * @name: grt 表格数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTableData () {
            axios({
                path: 'CardMakeQueryCardReport',
                mathod: 'post'
            }).then(res => {
                // console.log('总计', res)
                if (res.flag === 1) {
                    this.count(res.data.list)
                }
            })
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
                if (moment(val).isBefore(this.seachValue.startTime)) {
                    this.seachValue.startTime = moment(val).subtract(7, 'days').format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>

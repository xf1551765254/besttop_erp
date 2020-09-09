<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-17 14:34:37
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
  <style lang="less" scoped>
  </style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
export default {
    name: 'ChannelCustomerQuotaMonitoring',
    components: {
        NewTable,
        SeachBox
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            seachValue: {

            },
            btns: ['export', 'print'],
            conditions: [
                {
                    title: '发生位置',
                    type: 'select',
                    key: 'storeCodes',
                    path: 'OrganizationStoreFind',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    multiple: true,
                    mode: 'multiple',
                    maxTagCount: 99
                },
                {
                    title: '客户',
                    type: 'select',
                    key: 'custNos',
                    path: '',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    multiple: true,
                    mode: 'multiple',
                    maxTagCount: 99
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'aa438057942245b0a22e5ce28c75e460:ChannelCustomerQuotaMonitoring'
            // this.tableApiPath = 'CustMonitorFind'
        })
    },
    methods: {
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        // 搜索框方法
        /**
           * @name:搜索框清空
           * @msg:
           * @param {type}
           * @return:
           */
        onReload () {
            this.seachValue = {}
        },
        /**
           * @name:功能按钮时的事件
           * @msg:
           * @param {type}
           * @return:
           */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {

            } else if (e === 'edit') {

            } else if (e === 'del') {

            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CustMonitorFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
           * @name: 搜索
           * @msg:
           * @param {type}
           * @return:
           */
        onSeach (e) {
            e.path = 'CustMonitorFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'storeList') {
                this.queryType()
            }
        }
    }
}
</script>

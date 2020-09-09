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
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onSelect">
    </NewTable>
  </div>
</template>
<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
export default {
    components: {
        SeachBox,
        NewTable
    },
    data () {
        return {
            btns: ['add', 'del', 'recover', 'export'],
            conditions: [
                { title: '模板编码', type: 'input', key: 'code' },
                { title: '模板名称', type: 'input', key: 'name' },
                { title: '屏幕编码', type: 'input', key: 'screenCode' },
                { title: '展示状态',
                    type: 'select',
                    key: 'type',
                    label: 'value',
                    value: 'status',
                    body: {}
                }
            ],
            seachValue: {},
            tableCode: '',
            tableApiPath: '',
            tableSelectRows: []
        }
    },
    methods: {
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        onSelect () {

        },
        onReload () {

        },
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditShelf(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        onSeach () {

        }
    }
}
</script>
<style lang="less" scoped>

</style>

<template>
  <div class="table-mini-box">
    <el-table
      ref="miniTable"
      :data="tableData"
      @row-dblclick="rowDblclick"
      @row-click="rowClick"
      @current-change="currentChange"
      :row-style="rowStyle"
      :height="tableHeight"
      row-key="code"
      header-cell-class-name="header-cell"
      style="width: 100%"
      size="mini"
      empty-tex="暂无数据"
      border>
      <table-header :headerData="tableHeaderData" :hasAction="false"/>
    </el-table>
  </div>
</template>
<script>
import { uuid } from 'vue-uuid'
import { axios } from '@/utils/request'
import { initTableColumns } from '@comp/newTable/init.js'
import TableHeader from './TableHeader'

export default {
    name: 'MiniTable',
    components: { TableHeader },
    props: {
        header: {
            type: Array,
            default: () => []
        },
        showHeader: {
            type: Array,
            default: () => []
        },
        data: {
            type: Array,
            default: () => []
        },
        tableCode: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 500
        }
    },
    data () {
        return {
            tableData: [],
            tableHeaderData: [],
            tableHeight: 0,
            row: {}
        }
    },
    methods: {
        doLayout () {
            this.$refs.miniTable.doLayout()
        },
        setCurrentRow (row) {
            this.row = row
            this.$refs.miniTable.setCurrentRow(row)
        },
        rowClick (row, column, event) {
            console.log('单击行', row)
            this.setCurrentRow(row)
            this.$emit('row-click', row)
        },
        rowDblclick (row, column, event) {
            this.$emit('row-db-click', row)
        },
        currentChange (currentRow, oldCurrentRow) {
            this.$emit('row-current-change', {
                val: currentRow,
                oldval: oldCurrentRow
            })
        },
        rowStyle ({ row, rowIndex }) {
            if (row.code === this.row.code) {
                return 'background-color: #1890FF;color: #fff;font-weight: 500;'
            }
        }
    },
    watch: {
        data: {
            handler (val, oldval) {
                this.tableData = [...val]
                this.tableData.map(o => o.__id = uuid.v1().replace(/-/g, ''))
                if (this.tableData.length > 0) {
                    const oldIndex = this.tableData.findIndex(o => o.code === this.row.code)
                    this.row = this.tableData[oldIndex < 0 ? 0 : oldIndex]
                }
            },
            deep: true,
            immediate: true
        },
        header: {
            handler (val, oldval) {
                if (this.$props.tableCode === '') {
                    this.tableHeaderData = val
                }
            },
            deep: true,
            immediate: true
        },
        tableCode: {
            handler (val, oldval) {
                if (val) {
                    initTableColumns(val).then((res) => {
                        const tableheader = res.filter(o => o.isHidden == 0)
                        if (this.$props.showHeader.length > 0) {
                            this.tableHeaderData = tableheader.filter(o => this.$props.showHeader.indexOf(o.dataIndex) >= 0)
                        } else {
                            this.tableHeaderData = tableheader
                        }
                    })
                }
            },
            immediate: true
        },
        height: {
            handler (val, oldval) {
                if (val) {
                    this.tableHeight = val
                }
            },
            immediate: true
        }
    }
}
</script>
<style lang="less">
.table-mini-box{
    padding-left:10px;
    .el-table--mini td{
        padding: 0;
    }
    .header-cell{
        padding: 4px 6px;
    }
    .el-table th>.cell{
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
    }
    .el-table .cell{
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
        padding-left: 0px;
        padding-right: 0px;
    }
    .cell .ant-input{
        padding:4px 2px;
        height: 100%;
        font-size: 12px;
        border-radius: 0px;
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
    }
}
</style>

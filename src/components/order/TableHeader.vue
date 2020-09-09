<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-08 15:50:18
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-22 16:43:26
 -->
<template>
  <div class="tableHeader">
    <el-table-column
      fixed="left"
      align="center"
      width="50">
      <template slot="header">
        <a-popconfirm icon="列过滤" placement="bottomLeft" okText="重置" @confirm="resetHeader">
          <template slot="title">
            <div class="header-check-box">
              <div v-for="(tableHeaderItem, index) in tableHeaderCheckBox" :key="index">
                <a-checkbox
                  @change="e=>onTableHeaderChange(e.target.checked, tableHeaderItem.dataIndex)"
                  :checked="tableHeaderCheckBoxValue.indexOf(tableHeaderItem.dataIndex) >= 0"
                  defaultChecked>{{ tableHeaderItem.title }}</a-checkbox>
                <br/>
              </div>
            </div>
          </template>
          <icon-font class="icon icon-setting" type="icon-systemset"/>
        </a-popconfirm>
      </template>
      <template slot-scope="scope">{{ scope.$index+1 }}</template>
    </el-table-column>
    <template v-for="header in headerData">
      <template v-if="tableHeaderCheckBoxValue.indexOf(header.dataIndex) >= 0">
        <el-table-column
          :key="Math.random() || header.dataIndex"
          :prop="header.dataIndex"
          :label="header.title"
          :sortable="header.sortable">
          <template slot-scope="scope">
            <el-select
              class="tableSelect"
              v-if="header.type === 'select' && header.dataIndex === value.__property && scope.row.__id === value.__id && canEditList.some(o=>o.dataIndex === header.dataIndex)"
              @focus="getSelect(header)"
              style="width:100%;"
              v-model="scope.row[header.dataIndex]">
              <el-option
                v-for="item in header.selectOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <a-input
              v-if="header.type !== 'select' && header.dataIndex === value.__property && scope.row.__id === value.__id && canEditList.some(o=>o.dataIndex === header.dataIndex)"
              :defaultValue="scope.row[header.dataIndex]"
              v-model="cellInputValue"
              onfocus="this.select()"
              @change="e => onInputChange(e, scope.$index, header.dataIndex)"
              @keyup.enter="keyEnterDown(scope.$index, header.dataIndex, value.__id, scope.row)"
              autoFocus>
              <a-icon v-if="header.modalType" slot="suffix" type="ellipsis" @click.native.prevent="cellBtnClick(scope.row.__id, header, scope.row)"/>
            </a-input>
            <span v-else>{{ header.type === 'select' ? getLabel(header.selectOptions, scope.row[header.dataIndex]) : scope.row[header.dataIndex] }}</span>
          </template>
        </el-table-column>
      </template>
    </template>
    <el-table-column
      v-if="hasAction"
      fixed="right"
      label="操作"
      align="center"
      width="60">
      <template slot-scope="scope">
        <a-tooltip
          placement="top"
          title="删除"
          :mouseEnterDelay="2"
          arrowPointAtCenter>
          <icon-font class="icon" type="icon-del" @click.native.prevent="deleteRow(scope.row)"/>
        </a-tooltip>
        <a-tooltip
          v-if="canCopy"
          placement="top"
          title="复制"
          :mouseEnterDelay="2"
          arrowPointAtCenter>
          <icon-font class="icon icon-operating" type="icon-copy" @click.native.prevent="copyRow(scope.row)"/>
        </a-tooltip>
      </template>
    </el-table-column>
  </div>
</template>

<script>

export default {
    name: 'TableHeader',
    components: { },
    props: {
        value: {
            type: Object,
            default: () => { return { __id: null, __property: null } }
        },
        canEditList: {
            type: Array,
            default: () => []
        },
        rowData: {
            type: Object,
            default: () => {}
        },
        headerData: {
            type: Array,
            default: () => []
        },
        hasAction: {
            type: Boolean,
            default: true
        },
        canCopy: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            cellInputValue: '',
            tableHeaderCheckBox: [],
            tableHeaderCheckBoxValue: [],
            tableHeaderCheckBoxValueReset: [],
        }
    },
    mounted () {
        console.log('默认', this.tableHeaderCheckBoxValue)
    },
    methods: {
        getSelect (e) {
            if (e.isEmit) {
                this.$emit('onGetSelectOption', e)
            }
        },
        getLabel(arr, value){
            const val = arr.filter(o => o.value === value)
            return val.length > 0 ? val[0].label : ''
        },
        resetHeader () {
            this.tableHeaderCheckBoxValue = [...this.tableHeaderCheckBoxValueReset]
        },
        onTableHeaderChange (checked, dataIndex) {
            if (checked) {
                this.tableHeaderCheckBoxValue = [...new Set([...this.tableHeaderCheckBoxValue, dataIndex])]
            } else {
                const arr = this.tableHeaderCheckBoxValue.filter(o => o !== dataIndex)
                this.tableHeaderCheckBoxValue = [...arr]
            }
        },
        onInputChange (e, index, dataIndex) {
            const {target:{value}} = e
            console.log(value, index, dataIndex)
            this.$emit('onEditCell', value, index, dataIndex)
        },
        // 删除行
        deleteRow (row) {
            this.$emit('onDel', row)
        },
        // 复制行
        copyRow (index) {
            this.$emit('onCopy', index)
        },
        // 单元格按钮点击
        cellBtnClick (rowId, header, row) {
            this.$emit('onCellBtnClick', { rowId, header, row })
        },
        // 按下回车
        keyEnterDown (index, dataIndex, __id, row) {
            // row[dataIndex] = this.cellInputValue
            this.$set(row, dataIndex, this.cellInputValue)
            const __dataIndex = this.$props.canEditList.findIndex(o => o.dataIndex === dataIndex)
            if (__dataIndex >= this.$props.canEditList.length - 1) {
                this.$emit('input', {
                    __property: this.$props.canEditList[0].dataIndex,
                    __index: index + 1,
                    __type: this.$props.canEditList[0].modalType
                })
            } else {
                this.$emit('input', {
                    __property: this.$props.canEditList[__dataIndex + 1].dataIndex,
                    __fileProportion: this.$props.canEditList[__dataIndex + 1].fileProportion,
                    __id,
                    __type: this.$props.canEditList[0].modalType
                })
            }
        }
    },
    watch: {
        value: {
            handler (val, oldval) {
                if (val.__property) {
                    this.cellInputValue = this.$props.rowData[val.__property]
                }else{
                    this.cellInputValue = ''
                }
            },
            deep: true,
            immediate: true
        },
        headerData: {
            handler (val, oldval) {
                this.tableHeaderCheckBox.length = 0
                this.tableHeaderCheckBoxValue.length = 0
                this.tableHeaderCheckBoxValueReset.length = 0
                val.forEach(o => {
                    this.tableHeaderCheckBox.push({ dataIndex: o.dataIndex, title: o.title })
                    this.tableHeaderCheckBoxValue.push(o.dataIndex)
                    this.tableHeaderCheckBoxValueReset.push(o.dataIndex)
                })
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

<style lang="less">
.tableSelect {
    width: 100%;
    .el-input__inner{
        border: 0 !important;
        height: 24px !important;
        line-height: 24px !important;
    }
    .el-input__icon{
        line-height: 24px !important;
    }
}
.el-table--mini td{
    padding: 2px 0;
}
.ant-input-affix-wrapper .ant-input-suffix {
    right: 2px;
    border-radius: 50%;
    color: #fc6363;
}
.ant-input-affix-wrapper .ant-input-suffix:hover{
    background-color: #fc6363;
    color: #fff;
}
.icon{
    &-operating{
        margin-left: 10px;
    }
    &-setting{
        font-size: 16px;
    }
    &:hover{
        color: red;
    }
}
.header-check-box{
    max-height: 500px;
    overflow: auto;
    padding: 4px;
}
.el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0px;
}
</style>

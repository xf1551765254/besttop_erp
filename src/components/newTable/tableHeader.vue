<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-04-09 15:20:52
 * @LastEditTime: 2019-08-19 15:33:08
 -->
<template>
  <div>
    <a-modal
      title="表头配置"
      v-model="value"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="900"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit"> 确定 </a-button>
      </template>
      <a-row :gutter="16">
        <a-col :span="14">
          <a-table
            ref="headerTable"
            bordered
            :dataSource="columns"
            :columns="cols"
            :loading="tableLoading"
            :scroll="{x:500, y:600}"
            :customRow="customRow"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
            :pagination="{defaultPageSize:1000, hideOnSinglePage: true}"
            size="small"
            rowKey="code">
            <template slot="dataKey" slot-scope="text, record">
              <span :style="{color: getColor(text, record)}">{{ text }}</span>
            </template>
            <template slot="dataTitle" slot-scope="text, record">
              <span :style="{color: getColor(text, record)}">{{ text }}</span>
            </template>
          </a-table>
        </a-col>
        <a-col :span="10">
          <a-row class="doc">
            <a-col :span="6">名称</a-col>
            <a-col :span="18">
              <a-input v-model="name" allowClear :disabled="getDis() || isMultiple" @change="titleChange"/>
            </a-col>
            <a-col :span="6">对齐方式</a-col>
            <a-col :span="18">
              <a-select style="width: 100%" v-model="align" :options="alignArr" :disabled="getDis()" @change="alignChange"/>
            </a-col>
            <a-col :span="6">宽度</a-col>
            <a-col :span="18">
              <a-input-number
                style="width: 100%"
                v-model="width"
                :min="80"
                :max="1000"
                :formatter="value => `${value}px`"
                :parser="value => value.replace('px', '')"
                @change="widthChange"
                :disabled="getDis()"/>
            </a-col>
            <a-col :span="6"><span class="title">是否隐藏</span></a-col>
            <a-col :span="18">
              <a-switch style="margin-left:20px" v-model="isHidden" @change="switchChange" :disabled="getDis()">
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </a-col>
            <a-col :span="6"><span class="title">排序</span></a-col>
            <a-col :span="18">
              <a-switch style="margin-left:20px" v-model="sorter" @change="sorterChange" :disabled="getDis() || !sortable">
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch><span v-if="!sortable" class="info-sorte">不支持排序</span>
            </a-col>
            <a-col :span="6"><span class="title">列锁定</span></a-col>
            <a-col :span="18">
              <a-select style="width:100%" v-model="fixed" @change="fixedChange" :disabled="getDis()" >
                <a-select-option value="left">左侧</a-select-option>
                <a-select-option value="right">右侧</a-select-option>
                <a-select-option :value="0">不锁定</a-select-option>
              </a-select>
            </a-col>
            <a-col v-if="!isProd" :span="6"><span class="title">排序>开发</span></a-col>
            <a-col v-if="!isProd" :span="18">
              <a-switch style="margin-left:20px" v-model="sortable" @change="sortableChange" :disabled="getDis()">
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </a-col>
            <a-col :span="6">格式化</a-col>
            <a-col :span="18">
              <a-select style="width: 100%" v-model="formatter" :options="formatterArr" :disabled="getDis()" @change="formatterChange"/>
            </a-col>
          </a-row>
          <div style="padding: 10px 0;">设置默认排序字段</div>
          <a-row class="doc" v-for="(item, index) in sortColumn" :key="index">
            <a-col :span="6">排序字段{{ index + 1 }}</a-col>
            <a-col :span="8">
              <a-select style="width:100%;" v-model="item.column" allowClear>
                <a-select-option v-for="d in sortColumnArr" :disabled="getDisable(d.code)" :key="d.code">{{ d.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select style="width:100%;" v-model="item.sortOrder" allowClear>
                <a-select-option value="asc">升序</a-select-option>
                <a-select-option value="desc">降序</a-select-option>
              </a-select>
            </a-col>
            <div class="sortClass">
              <a-col :span="4">
                <a-col :span="12">
                  <a-button
                    style="padding:0 5px;"
                    v-if="index===sortColumn.length-1 && sortColumn.length < 3"
                    icon="plus"
                    type="primary"
                    @click="changeSortColumnList(1)"/>
                </a-col>
                <a-col :span="12">
                  <a-button
                    style="padding:0 5px;"
                    v-if="index>0"
                    icon="delete"
                    type="danger"
                    :disabled="item.disabled"
                    @click="changeSortColumnList(-1,index)"/>
                </a-col>
              </a-col>
            </div>
          </a-row>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<style lang="less">
    @import "../../assets/modalStyle.less";
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
    }
    .info-sorte{
        font-size: 10px;
        color: #b3b3b3;
        margin-left: 10px;
    }
    .sortClass{
        .ant-col-4{
            padding-right: 0 !important;
        }
    }
</style>

<script>
import { axios } from '@/utils/request'
import TouchMoveTable from 'touch-move-table'
import is from 'is_js'
import { isCloudEnv } from '@/config/api.config'
import map from 'lodash.map'
let rowCache = {}
export default {
    name: 'TableHeader',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        tableCode: {
            type: String,
            default: ''
        }

    },
    data: function () {
        return {
            columns: [],
            loading: false,
            tableLoading: false,
            isProd: isCloudEnv,
            cols: [
                { title: '字段', dataIndex: 'code', width: 200, scopedSlots: { customRender: 'dataKey' } },
                { title: '列项', dataIndex: 'name', scopedSlots: { customRender: 'dataTitle' } }
            ],
            code: '',
            width: 100,
            align: '',
            name: '',
            fixed: 0,
            isHidden: false,
            sortable: false,
            sorter: false,
            formatter: 'Text',
            formatterArr: [
                { value: 'Text', title: '文本' },
                { value: 'DateTime', title: '时间' },
                { value: 'Date', title: '日期' },
                { value: 'Sex', title: '性别' },
                { value: 'Tiny', title: '是否' },
                { value: 'Image', title: '图片' },
                { value: 'percentage', title: '百分比' },
                { value: 'price', title: '货币' },
                { value: 'Html', title: '超文本' }
            ],
            alignArr: [ { value: 'left', title: '居左' }, { value: 'center', title: '居中' }, { value: 'right', title: '居右' } ],
            selectedRowKeys: [],
            isMultiple: false,
            sortColumnArr: [],
            sortColumn: [{ column: '', sortOrder: 'asc' }]
        }
    },
    mounted () {

    },
    methods: {
        changeSortColumnList (type, index) {
            if (type < 0) {
                this.sortColumn.splice(index, 1)
            } else {
                this.sortColumn.push({ column: '', sortOrder: 'asc' })
            }
        },
        onChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
            this.isMultiple = this.selectedRowKeys.length > 0
            if (this.isMultiple) {
                rowCache = this.columns.filter(o => o.code === this.selectedRowKeys[0])[0]
                this.align = rowCache.align
                this.isHidden = rowCache.isHidden === 1
                this.formatter = rowCache.formatter
                this.width = rowCache.width
                this.sorter = rowCache.sorter
                this.sortable = rowCache.sortable
                this.fixed = ['left', 'right'].includes(rowCache.fixed) ? rowCache.fixed : 0
            }
        },
        formatterChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).formatter = e
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].formatter = e
            }
        },
        widthChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).width = e
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].width = e
            }
        },
        alignChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).align = e
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].align = e
            }
        },
        titleChange ({ target }) {
            this.columns.filter(o => o.code === rowCache.code)[0].name = target.value
        },
        /**
         * @name: 隐藏开关
         * @msg:
         * @param {type}
         * @return:
         */
        switchChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).isHidden = e ? 1 : 0
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].isHidden = e ? 1 : 0
            }
        },
        sorterChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).sorter = e
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].sorter = e
            }
        },
        fixedChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.find(o => o.code === item).fixed = e
                })
            } else {
                this.columns.find(o => o.code === rowCache.code).fixed = e
            }
        },
        sortableChange (e) {
            if (this.isMultiple) {
                this.selectedRowKeys.forEach(item => {
                    this.columns.filter(o => o.code === item)[0].sortable = e
                    if (!e) {
                        // this.sorter = false
                        this.columns.filter(o => o.code === item)[0].sorter = false
                    }
                })
            } else {
                this.columns.filter(o => o.code === rowCache.code)[0].sortable = e
                if (!e) {
                    // this.sorter = false
                    this.columns.filter(o => o.code === rowCache.code)[0].sorter = false
                }
            }
        },
        /**
         * @name: 是否禁用
         * @msg:
         * @param {type}
         * @return:
         */
        getDis () {
            return is.empty(rowCache)
        },
        /**
         * @name: 获取颜色
         * @msg:
         * @param {type}
         * @return:
         */
        getColor (text, row) {
            return row.isHidden === 0 ? '#000' : '#e54d42'
        },
        /**
         * @name: 点击
         * @msg:
         * @param {type}
         * @return:
         */
        customRow (record) {
            if (this.isMultiple) {
                return
            }
            const self = this
            return {
                on: { // 事件
                    click: () => {
                        rowCache = record
                        self.code = record.code
                        self.align = record.align
                        self.name = record.name
                        self.isHidden = record.isHidden === 1
                        self.formatter = record.formatter
                        self.width = record.width
                        self.sorter = record.sorter
                        self.sortable = record.sortable
                        self.fixed = ['left', 'right'].includes(record.fixed) ? record.fixed : 0
                    }
                }
            }
        },
        /**
         * @name: 行拖拽
         * @msg:
         * @param {type}
         * @return:
         */
        rowDrop () {
            const tbody = document.querySelector('.ant-modal-body .ant-table-tbody')
            const _this = this
            TouchMoveTable.init(tbody, {
                forceFallback: true, // 禁用原生样式
                chosenClass: 'choose', // 选中单元样式
                fallbackClass: 'TouchMoveTable-fallback', // 跟随鼠标的class
                onlyMoveY: true, // 是否只垂直移动
                animation: 20,
                ghostClass: 'TouchMoveTable-choose', // 影子副本样式

                scroll: true,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                onUpdate ({ newIndex, oldIndex }) {
                    const currRow = _this.columns.splice(oldIndex, 1)[0]
                    _this.columns.splice(newIndex, 0, currRow)
                }
            })
        },
        /**
         * @name: 关闭
         * @msg:
         * @param {type}
         * @return:
         */
        subCancel () {
            this.$emit('input', false)
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit () {
            const sortArr = []
            this.sortColumn.forEach(o => {
                if (o.column) {
                    sortArr.push({
                        index: sortArr.length + 1,
                        column: o.column,
                        sortOrder: o.sortOrder === 'desc' ? o.sortOrder : 'asc'
                    })
                }
            })
            this.loading = true
            axios({
                path: 'TableColumnUpdate',
                method: 'POST',
                body: { baseTableColumn: this.columns, defaultSort: sortArr }
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    const tableCode = this.$props.tableCode
                    this.$message.success('成功')
                    this.$idb.transaction(['columns'], 'readwrite').objectStore('columns').delete(tableCode)
                    setTimeout(() => {
                        this.$emit('colChange', tableCode)
                        this.$emit('input', false)
                    }, 500)
                }
            })
        },
        getDisable (code) {
            const data = map(this.sortColumn, 'column')
            if (data.includes(code)) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        value (val) {
            if (val) {
                if (this.$props.tableCode === '') {
                    this.$message.error('ERROR: 表头定制tableCode缺失')
                    this.$emit('input', false)
                } else {
                    this.selectedRowKeys.length = 0
                    this.isMultiple = false
                    this.tableLoading = true
                    axios({
                        path: 'TableColumnQuery',
                        method: 'post',
                        body: { tableCode: this.$props.tableCode.split(':')[0] }
                    }).then(res => {
                        this.rowDrop()
                        this.tableLoading = false
                        if (res.flag === 1) {
                            this.columns = res.data
                            const other = res.other && res.other.length > 0 ? res.other.sort((a, b) => { return a.index - b.index }) : [{ column: '', sortOrder: 'asc' }]
                            this.sortColumn = other
                            this.sortColumnArr = this.columns.filter(o => o.sortable === true)
                        }
                    })
                }
            } else {
                rowCache = {}
                this.code = ''
                this.width = 100
                this.align = ''
                this.name = ''
                this.isHidden = false
                this.sorter = false
                this.formatter = 'Text'
            }
        }
    }
}
</script>

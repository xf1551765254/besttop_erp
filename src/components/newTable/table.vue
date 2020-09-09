<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-28 20:04:48
 * @LastEditTime: 2019-08-19 13:57:46
 -->
<template>
  <div :style="`height:${tableHeight}px;margin: 0 10px;`" v-action:query>
    <a-alert v-if="combineds.length>0 || condition.length>0" style="margin:10px 10px;" type="info" showIcon >
      <div slot="message">
        <a-tag v-if="condition.length>0" color="pink">筛选中</a-tag>
        <template v-if="combineds.length>0">
          <span v-for="(item, index) in combineds" :key="index" class="info-text">
            {{ `${item.name}合计：` }}<span :style="{color:item.sum<0?'#e54d42':'#000'}">{{ item.sum }}</span>
            ；</span>
        </template>
      </div>
    </a-alert>
    <a-table
      ref="table"
      rowKey="bt_id"
      size="small"
      :dataSource="dataSource"
      :columns="_columns"
      :rowSelection="rowSelection"
      :pagination="userPagination || pagination"
      :loading="loading"
      :scroll="{ x:getWidth, y:scrollHeight }"
      :showHeader="showHeader"
      @change="handleTableChange"
      @expand="handleTableExpand"
      :customRow="customRow"
      :customHeaderRow="customHeaderRow"
      :expandedRowKeys="defaultExpandedRowKeys"
      :rowClassName="(record, index) => { if(index % 2 === 1) return 'table-bg-row' }"
      bordered>
      <!--<div v-for="(item, index) in columns" :key="index" :slot="item.dataIndex" slot-scope="text" :style="{maxWidth:(item.width || (rowSelect?200:262))-17+'px'}">
        <Formatter :value="text" :mat="item.formatter" v-if="slots.indexOf(item.dataIndex)<0" />
      </div>
      <div v-for="(item, index) in slots" :key="index" :slot="item" slot-scope="text, record">
        <slot :name="item" :text="text" :record="record"></slot>
      </div> -->
      <template v-for="(item, index) in _columns" :slot="item.dataIndex" slot-scope="text">
        <div :key="index" :style="{maxWidth:(item.width || (rowSelect?200:262))-17+'px'}">
          <Formatter :value="text" :mat="item.formatter" v-if="slots.indexOf(item.dataIndex)<0" />
        </div>
      </template>
      <template v-for="(item, index) in slots" :slot="item" slot-scope="text, record">
        <div :key="index" >
          <slot :name="item" :text="text" :record="record"></slot>
        </div>
      </template>
      <template slot="title" v-if="headerTitle.length > 0">
        <div>{{ headerTitle }}</div>
      </template>
    </a-table>
    <v-contextmenu ref="tableRow" theme="bright" :disabled="contextmenuDisabled" @hide="hide">
      <template v-for="(item, index) in contextmenuArr">
        <VContextmenuSubmenu v-if="'children' in item" :key="`I-${index}`">
          <template v-for="(childrenItem, childrenIndex) in item.children">
            <VContextmenuSubmenu v-if="'children' in childrenItem" :key="`II-${childrenIndex}`">
              <v-contextmenu-item v-for="(t, i) in childrenItem.children" :key="`KKK-${i}`" @click="t.fc(recordRow)" :disabled="checkDis(t, recordRow)">{{ t.name }}</v-contextmenu-item>
            </VContextmenuSubmenu>
            <v-contextmenu-item v-else :key="`KK-${childrenIndex}`" @click="childrenItem.fc(recordRow)" :disabled="checkDis(childrenItem, recordRow)">{{ childrenItem.name }}</v-contextmenu-item>
            <!-- childrenItem.disabled || $action(item.action) || autoDis(item.autoDis, recordRow) -->
          </template>
        </VContextmenuSubmenu>
        <v-contextmenu-item v-else :key="`K-${index}`" @click="item.fc(recordRow)" :disabled="checkDis(item, recordRow)">{{ item.name }}</v-contextmenu-item>
      </template>
    </v-contextmenu>
    <v-contextmenu ref="tableHeader" theme="bright">
      <v-contextmenu-item
        v-for="(item, index) in tableHeaderArr"
        :key="`Col-${index}`"
        @click="item.fn"
        :disabled="item.disabled">{{ item.name }}</v-contextmenu-item>
    </v-contextmenu>
    <detailsModal ref="detailsModalRef" :value.sync="showDetailsModal"/>
    <ExportToFile
      v-model="exportVisbel"
      :path="exportPath"
      :body="exportBody"
      :cols="exportCols"
      :fileType="fileType"
      :fileName="fileName"
      :isDiy="isDiy"></ExportToFile>
    <table-header v-model="tableheadervisbel" :tableCode="tableCode" @colChange="getNewCols"/>
    <do-filter v-model="filterVisbel" :cols="getColumnsData()" @onFilter="onFilter"/>
  </div>
</template>
<style lang="less" scoped>
    .table-nowrap{
        margin: 0 10px;
    }
    .info-text{
        font-weight: bold;
    }
</style>
<style lang="less">
    .table-bg-row{
        background-color: #f5f5f58a;
    }
    .ant-table{
        font-size: 12px !important;
        .ant-table-thead{
            th{
                background: #f5f5f58a !important;
                font-weight: 600 !important;
                text-align: center !important;
            }
        }
        .ant-table-tbody{
            td{
                padding: 5px 8px !important;
            }
        }
        .ant-table-selection-column{
            min-width: 40px !important;
            width: 40px !important;
        }
    }
    .ant-pagination{
        font-size: 12px !important;
        margin: 8px 0 !important;
    }
</style>
<script>
import { isCompanyEnv } from '@/config/api.config'
import is from 'is_js'
import detailsModal from './detailsModal'
import { initTableColumns, initTableData } from './init'
import ExportToFile from '../exportToFile'
import Formatter from './formatterComp'
import TableHeader from './tableHeader'
import DoFilter from './doFilter'
import { axios } from '@/utils/request'
var page = 1
var rows = 25
var initRows = 25

export default {
    name: 'NewTable',
    components: { detailsModal, ExportToFile, Formatter, TableHeader, DoFilter },
    props: {
        // 是否显示表头
        showHeader: {
            type: Boolean,
            default: true
        },
        // 表格CODE
        tableCode: {
            type: String,
            default: 'none'
        },
        tableApiPath: {
            type: String,
            default: ''
        },
        height: {
            type: Number,
            default: 0
        },
        disContextMenu: {
            type: Array,
            default: () => []
        },
        pams: {
            type: Object,
            default: () => {}
        },
        slots: {
            type: Array,
            default: () => []
        },
        rowSelect: {
            type: Boolean,
            default: true
        },
        userPagination: {
            type: Object || null,
            default: null
        },
        headerTitle: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            // 表格高度
            tableHeight: this.$store.getters.windowHeight - 220 + 42,
            // 滚动区域高度
            scrollHeight: this.$store.getters.windowHeight - 310 + 42,
            // 多选配置
            rowSelection: null,
            // 表头
            columns: [],
            // 表体
            dataSource: [],
            // 分页器
            pagination: {
                size: 'small',
                defaultPageSize: rows,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `本页 ${range[0]}-${range[1]} 共 ${total} 条`,
                pageSizeOptions: ['25', '50', '75', '100', '200']
            },
            // 表格loading
            loading: false,
            // 右键菜单默认展示
            contextmenuDisabled: false,
            // 右键菜单项
            contextmenuArr: [],
            contextmenuArrCache: [],
            // 点击事件数据缓存
            recordRow: {},
            detailsTitle: '详情',
            showDetailsModal: false,
            exportVisbel: false,
            exportPath: '',
            exportBody: {},
            exportCols: [],
            combineds: [],
            tableheadervisbel: false,
            tableHeaderArr: [
                { name: '配置表头', fn: this.tableHeaderClick },
                { name: '重置表头', fn: this.tableColumnReset }
            ],
            title: '',
            isDiy: false,
            fileType: 'excel',
            defaultExpandedRowKeys: [],
            filterVisbel: false,
            condition: [],
            tableApiCache: '',
            orderbyField: '',
            scrollTable: null,
            defaultOrderbyField: '',
            setTable: false
        }
    },
    computed: {
        getWidth () {
            let width = 280
            this.columns.forEach(c => {
                if (is.number(c.width)) {
                    width += c.width
                }
            })
            return width
        },
        fileName () {
            let fileName = ''
            try {
                console.log(this.$props.tableCode.split(':')[1])
                fileName = this.$t(`menu.${this.$props.tableCode.split(':')[1]}`) || '文件'
                console.log(fileName)
            } catch (error) {
                fileName = '文件'
                console.log(error)
            }
            console.log(fileName)
            return fileName
        },
        _columns () {
            const fixedLeftColumns = []
            const fixedRightColumns = []
            const columns = []
            this.columns.map((v, i) => {
                if (v.fixed === 'left' || v.fixed === true) {
                    fixedLeftColumns.push(v)
                }
                if (v.fixed === 'right') {
                    fixedRightColumns.push(v)
                }
                if (!v.fixed) {
                    columns.push(v)
                }
            })
            return [
                ...fixedLeftColumns,
                ...columns,
                ...fixedRightColumns
            ]
        }
    },
    mounted () {
        if (isCompanyEnv) {
            this.tableHeaderArr.push(...[
                { name: '同步表头', fn: this.devFlushToTest }
            ])
        }
    },
    methods: {
        checkDis (t, r) {
            const { disabled, action, autoDis } = t
            let auto = false
            if (is.array(autoDis)) {
                autoDis.forEach(({ key, dis, undis }) => {
                    if (is.array(dis)) {
                        if (dis.indexOf(r[key]) >= 0) {
                            auto = true
                        }
                    }
                    if (is.array(undis)) {
                        if (undis.indexOf(r[key]) < 0) {
                            auto = true
                        }
                    }
                })
            }
            return !!(disabled || this.$action(action) || auto)
        },
        onFilter (condition) {
            this.condition = condition
            this.setTableData(this.$props.tableCode, { path: this.tableApiCache }).then()
        },
        /**
         * @name: 筛选项
         * @msg:
         * @param {type}
         * @return:
         */
        doFilter () {
            this.filterVisbel = true
        },
        /**
         * @name: 控制行展开或收起
         * @msg:
         * @param {type}
         * @return:
         */
        handleTableExpand (expanded, record) {
            if (expanded) {
                this.defaultExpandedRowKeys.push(record.bt_id)
            } else {
                const arr = this.defaultExpandedRowKeys.filter(id => id !== record.bt_id)
                this.defaultExpandedRowKeys = [...arr]
            }
        },
        /**
         * @name: 设置表头，重新请求
         * @msg:
         * @param {type}
         * @return:
         */
        getNewCols (tableCode) {
            this.$logger.info(tableCode)
            this.setTableColumns(tableCode).then()
        },
        /**
         * @name: 使表格回到第一页
         * @msg:
         * @param {type}
         * @return:
         */
        initPage () {
            const pagination = { ...this.pagination }
            page = 1
            pagination.current = 1
            pagination.pageSize = initRows
            rows = initRows
            this.pagination = { ...pagination }
        },
        /**
         * @name: 导出
         * @msg:
         * @param {type}
         * @return:
         */
        exportFile (path, body = {}, isDiy = false, fileType = 'excel') {
            this.exportPath = path
            this.exportBody = body
            this.isDiy = isDiy
            this.fileType = fileType
            this.exportCols = this.getColumnsData()
            this.exportVisbel = true
        },
        /**
         * @name: 获取表头字段
         * @msg:
         * @param {type}
         * @return:
         */
        getColumnsData () {
            const cols = []
            this.columns.forEach(c => {
                if (c.dataIndex !== 'web_index') {
                    cols.push({
                        key: c.dataIndex,
                        name: c.title
                    })
                }
            })
            return cols
        },
        /**
         * @name: 获取表体
         * @msg:
         * @param {type}
         * @return:
         */
        getTableData () {
            return [...this.dataSource]
        },
        /**
         * @name: 详情弹窗
         * @msg:
         * @param {type}
         * @return:
         */
        showDetails (title, row) {
            this.showDetailsModal = true
            this.$nextTick(() => {
                this.$refs.detailsModalRef.setCols(title, this.columns, row)
            })
        },
        /**
         * @name: 表格删除
         * @msg:
         * @param {type}
         * @return:
         */
        del (arr, key = 'id') {
            let ids = []
            if (is.string(arr)) {
                ids.push(arr)
            } else if (is.array(arr)) {
                ids = [...arr]
            }
            const data = [...this.dataSource]
            const newdata = data.filter(o => is.not.inArray(o[key], ids))
            this.dataSource = newdata
        },
        /**
         * @name: 重载表格
         * @msg:
         * @param {type}
         * @return:
         */
        async reload (tableCode, pams = {}) {
            await this.setTableColumns(tableCode)
            const newpams = Object.assign({ ...this.$props.pams }, pams)
            await this.setTableData(tableCode, newpams)
        },
        /**
         * @name: 多选改变时
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectedRowKeys, selectedRows) {
            this.$set(this.rowSelection, 'selectedRowKeys', [...selectedRowKeys])
            this.$emit('onSelect', selectedRowKeys, selectedRows)
        },
        /**
         * @name: 设置表头
         * @msg:
         * @param {type}
         * @return:
         */
        async setTableColumns (data) {
            this.columns.length = 0
            const res = await initTableColumns(data, true)
            const columnsData = res.data ? res.data : []
            columnsData.forEach(c => {
                c.fixed = ['left', 'right'].includes(c.fixed) ? c.fixed : 0
                c.scopedSlots = { customRender: c.dataIndex }
                c.sorter = c.sorter && c.sortable
            })
            this.columns = [{
                title: '#',
                dataIndex: 'web_index',
                width: 40,
                align: 'center',
                fixed: true
            }, ...columnsData]
            this.defaultOrderbyField = res.other
            if (this.setTable) {
                const pams = Object.assign({ path: this.$props.tableApiPath }, { ...this.$props.pams })
                this.setTableData(this.$props.tableCode, pams).then()
            }
        },
        /**
         * @name: 设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        async setTableData (data, pams = {}, isSearch = true) {
            this.loading = true
            this.dataSource.length = 0
            if (isSearch) { this.initPage() }
            const newpams = Object.assign({ ...this.$props.pams, reinforcedFilter: this.condition, orderbyField: this.orderbyField || this.defaultOrderbyField }, pams)
            if (is.string(data)) { this.tableApiCache = newpams.path }
            const res = await initTableData(data, Object.assign({
                page, rows
            }, newpams))
            if (is.object(this.rowSelection)) {
                this.$set(this.rowSelection, 'selectedRowKeys', [])
            }
            this.$emit('onSelect', [], [])
            const exKeys = []
            for (let i = 1; i <= res.data.length; i++) {
                res.data[i - 1]['web_index'] = i
                exKeys.push(res.data[i - 1].bt_id)
            }
            this.defaultExpandedRowKeys = [...exKeys]
            this.dataSource = res.data
            this.loading = false
            if (is.string(data)) {
                const pagination = { ...this.pagination }
                pagination.total = res.total || 0
                this.pagination = pagination
                this.combineds.length = 0
                if (res.combined) {
                    const combined = res.combined
                    const cols = this.getColumnsData()
                    const combineds = []
                    Object.keys(combined).forEach(k => {
                        const col = cols.filter(o => o.key === k)
                        if (col.length > 0) {
                            combineds.push({
                                sum: combined[k],
                                ...col[0]
                            })
                        }
                    })
                    if (combineds.length > 0) {
                        this.scrollHeight = this.$store.getters.windowHeight - 360
                        this.combineds = combineds
                    }
                }
            }
        },
        /**
         * @name: 设置右键菜单
         * @msg:
         * @param {type}
         * @return:
         */
        setContextmenu (arr) {
            if (arr.length > 0) {
                this.contextmenuArr = [...arr]
                this.contextmenuArrCache = [...arr]
                this.contextmenuDisabled = false
            } else {
                this.contextmenuDisabled = true
            }
        },
        /**
         * @name: 分页、排序、筛选变化时触发
         * @msg:
         * @param {type}
         * @return:
         */
        handleTableChange (pagination, filters, sorter) {
            const pager = { ...this.pagination }
            pager.current = pagination.current
            pager.pageSize = pagination.pageSize
            this.pagination = pager
            rows = pagination.pageSize
            page = pagination.current
            const body = {
                rows,
                page,
                path: this.$props.tableApiPath,
                ...filters
            }
            if (sorter.field && sorter.order) {
                this.orderbyField = `${sorter.field} ${sorter.order === 'ascend' ? 'asc' : 'desc'}`
            } else {
                this.orderbyField = ''
            }
            this.setTableData(this.$props.tableCode, body, false).then()
        },
        /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */
        customRow (record) {
            const self = this
            return {
                props: {

                },
                on: { // 事件
                    click: () => {
                        self.$emit('onClickChange', record)
                    },
                    mouseenter: () => {

                    },
                    contextmenu: (parameter) => {
                        // 防止事件穿透
                        parameter.preventDefault()
                        // 多浏览器禁用右键选中文本
                        try {
                            if (document.selection) {
                                if (document.selection.empty) { document.selection.empty() } else {
                                    document.selection = null
                                }
                            } else if (window.getSelection) {
                                window.getSelection().removeAllRanges()
                            }
                        } catch (e) {}
                        // 打开表体行右键菜单
                        self.$emit('onContextmenuChange', record)
                        self.recordRow = record
                        self.$refs.tableRow.show({ top: parameter.clientY, left: parameter.clientX })
                    }
                }
            }
        },
        /**
         * @name: 表头行右键屏蔽
         * @msg:
         * @param {type}
         * @return:
         */
        customHeaderRow (record) {
            const self = this
            return {
                props: {},
                on: { // 事件
                    click: () => { },
                    mouseenter: () => { },
                    contextmenu: (parameter) => {
                        // 防止事件穿透
                        parameter.preventDefault()
                        // 多浏览器禁用右键选中文本
                        try {
                            if (document.selection) {
                                if (document.selection.empty) { document.selection.empty() } else {
                                    document.selection = null
                                }
                            } else if (window.getSelection) {
                                window.getSelection().removeAllRanges()
                            }
                        } catch (e) {}
                        this.title = parameter.target.textContent
                        self.$refs.tableHeader.show({ top: parameter.clientY, left: parameter.clientX })
                    }
                }
            }
        },
        tableHeaderClick () {
            this.tableheadervisbel = true
        },
        /**
         * @name: 右键菜单隐藏，清空缓存的事件数据
         * @msg:
         * @param {type}
         * @return:
         */
        hide () {
            this.recordRow = {}
        },
        tableColumnReset () {
            const self = this
            this.$confirm({
                title: '提示',
                content: isCompanyEnv ? '确定将表头恢复至开发环境表头？' : '确定将表头恢复至系统默认表头？',
                onOk () {
                    axios({
                        path: 'TableColumnReset',
                        body: {
                            pageName: self.tableCode.split(':')[1],
                            tableCode: self.tableCode.split(':')[0]
                        }
                    }).then()
                }
            })
        },
        devFlushToTest () {
            const self = this
            this.$confirm({
                title: '提示',
                content: '确定将开发环境表头同步至测试环境？',
                onOk () {
                    axios({
                        path: 'devFlushToTest',
                        method: 'post',
                        body: {
                            pageName: self.tableCode.split(':')[1],
                            tableCode: self.tableCode.split(':')[0]
                        }
                    }).then()
                }
            })
        }
    },
    watch: {
        tableCode (val, oldval) {
            if (val.indexOf(':') > 0) {
                this.columns.length = 0
                this.setTableColumns(val).then()
            } else {
                this.$message.error(`tableCode-->【${val}】有误`)
            }
        },
        tableApiPath (val, oldval) {
            if (is.string(val) && is.not.empty(val)) {
                if (this.columns.length > 0) {
                    this.setTable = false
                    const pams = Object.assign({ path: val }, { ...this.$props.pams })
                    this.setTableData(this.$props.tableCode, pams).then()
                } else {
                    this.setTable = true
                }
            } else {
                this.setTable = false
                this.$message.error(`tableApiPath-->【${val}】有误`)
            }
        },
        height: {
            handler (val) {
                if (val === 0) {
                    this.tableHeight = this.$store.getters.windowHeight - 220 + 42
                } else {
                    this.tableHeight = val
                    this.scrollHeight = val - 90
                }
            },
            immediate: true
        },
        '$store.getters.windowHeight': {
            handler (val) {
                if (this.$props.height === 0) {
                    this.tableHeight = val - 220 + 42
                    this.scrollHeight = val - 310 + 42
                }
            }
        },
        disContextMenu: {
            handler (val, oldval) {
                const data = [...this.contextmenuArrCache]
                this.contextmenuArr = dis(data, val)
            },
            deep: true
        },
        rowSelect: {
            handler (val) {
                if (val) {
                    this.rowSelection = {
                        onChange: this.onSelectChange,
                        fixed: true
                    }
                } else {
                    this.rowSelection = null
                }
            },
            immediate: true
        }
    }
}
function dis (arr, disarr) {
    const newarr = []
    arr.forEach(c => {
        if ('children' in c) {
            c.children = dis(c.children, disarr)
        } else {
            if (is.inArray(c.name, disarr)) {
                c.disabled = true
            } else {
                c.disabled = false
            }
        }
        newarr.push(c)
    })
    return newarr
}
</script>

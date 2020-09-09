<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-18 16:53:23
 -->
<template>
  <div style="margin:0px 10px;">
    <a-row :gutter="10">
      <a-col :span="7">
        <a-card hoverable class="action-card">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <a-directory-tree
            defaultExpandAll
            :treeData="treeData"
            @select="onSelect"
          >
            <template slot="title" slot-scope="{title}">
              <span>{{ `1-${$t(title)}` }}</span>
            </template>
          </a-directory-tree>
        </a-card>
      </a-col>
      <a-col :span="17">
        <a-card hoverable class="action-card table-nowrap">
          <a-button class="editable-add-btn" @click="hiddenSelect" :disabled="disabledAdd">一键隐藏</a-button>
          <a-button class="editable-add-btn" style="margin-left:20px" @click="showSelect" :disabled="disabledAdd">一键显示</a-button>
          <a-button class="editable-add-btn" style="margin-left:20px" @click="editSelect" :disabled="disabledAdd">一键编辑</a-button>
          <a-button class="editable-add-btn" style="margin-left:20px" @click="saveSelect" :disabled="disabledSub">一键保存</a-button>
          <a-button class="editable-add-btn" style="margin-left:20px" type="primary" @click="handleSub" :disabled="disabledSub">提交</a-button>
          <a-icon :type="icon?'check-circle':'close-circle'" theme="filled" :style="`margin-left:20px;fontSize:20px;color:${icon?'#43c731':'#f36c6c'};`"/>
          <a-table
            style="margin-top:20px"
            bordered
            :dataSource="data"
            :columns="columns"
            :pagination="{defaultPageSize:1000}"
            :scroll="{ x: 700 }"
            size="small"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            rowKey="code">
            <template v-for="col in ['name', 'width', 'align','isHidden']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <a-input
                  v-if="record.editable && col === 'name'"
                  style="margin: -5px 0;width:100%;"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.code, col)" />
                <a-input-number
                  v-else-if="record.editable && col === 'width'"
                  style="margin: -5px 0;width:100%;"
                  :min="80"
                  :max="300"
                  :value="text"
                  @change="e => handleChange(e, record.code, col)" />
                <a-select
                  v-else-if="record.editable && col === 'align'"
                  style="margin: -5px 0;width:100%;"
                  :defaultValue="text"
                  @change="e => handleChange(e, record.code, col)">
                  <a-select-option value="left">左对齐</a-select-option>
                  <a-select-option value="center">居中</a-select-option>
                  <a-select-option value="right">右对齐</a-select-option>
                </a-select>
                <a-switch
                  v-else-if="record.editable && col === 'isHidden'"
                  checkedChildren="是"
                  unCheckedChildren="否"
                  :checked="text==1"
                  @change="e => handleChange(e?1:0, record.code, col)"/>
                <template v-else-if="col === 'align'">{{ {left:'左对齐',center:'居中',right:'右对齐'}[text] }}</template>
                <template v-else-if="col === 'isHidden'">{{ text==1?'隐藏':'展示' }}</template>
                <template v-else>{{ text }}</template>
              </div>
            </template>
            <template slot="operation" slot-scope="text, record">
              <div class="editable-row-operations">
                <span v-if="record.editable">
                  <a @click="() => save(record.code)" style="margin-right:10px;">保存</a>
                  <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.code)">
                    <a>取消</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a @click="() => edit(record.code)" style="margin-right:10px;">编辑</a>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="less" scoped>
    .action-card{
        max-height:720px;
        // height:100%;
        overflow:auto;
    }
    .TouchMoveTable-fallback{
        background-color: blueviolet;
    }
    .choose{
        background-color: blue;
    }
    .TouchMoveTable-choose{
        background-color: red;
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        overflow:auto;
    }
</style>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
import findIndex from 'lodash.findindex'
import TouchMoveTable from 'touch-move-table'
const data = []
export default {
    name: 'TableHeaderManagement',
    components: { },
    data () {
        this.cacheData = data.map(item => ({ ...item }))
        return {
            visible: false,
            icon: true,
            treeData: [],
            data,
            columns: [
                { title: 'KEY', dataIndex: 'code', width: 80 },
                { title: '名称', dataIndex: 'name', scopedSlots: { customRender: 'name' } },
                { title: '宽度', dataIndex: 'width', width: 100, scopedSlots: { customRender: 'width' } },
                { title: '对齐方式', dataIndex: 'align', width: 100, scopedSlots: { customRender: 'align' } },
                { title: '隐藏', dataIndex: 'isHidden', width: 100, scopedSlots: { customRender: 'isHidden' } },
                { title: '操作', dataIndex: 'operation', width: 100, scopedSlots: { customRender: 'operation' } }
            ],
            disabledAdd: true,
            disabledSub: true,
            tableCode: '',
            selectedRowKeys: []
        }
    },
    computed: {

    },
    mounted () {
        this.getTree()
        this.rowDrop()
    },
    methods: {
        /**
         * @name: 行拖拽
         * @msg:
         * @param {type}
         * @return:
         */
        rowDrop () {
            const tbody = document.querySelector('.ant-table-tbody')
            const _this = this
            TouchMoveTable.init(tbody, {
                forceFallback: true, // 禁用原生样式
                chosenClass: 'choose', // 选中单元样式
                fallbackClass: 'TouchMoveTable-fallback', // 跟随鼠标的class
                onlyMoveY: true, // 是否只垂直移动
                animation: 50,
                ghostClass: 'TouchMoveTable-choose', // 影子副本样式

                scroll: true,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                onUpdate ({ newIndex, oldIndex }) {
                    const currRow = _this.data.splice(oldIndex, 1)[0]
                    _this.data.splice(newIndex, 0, currRow)
                    _this.disabledSub = false
                    _this.icon = false
                }
            })
        },
        /**
         * @name: 多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 表格input编辑
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (value, code, column) {
            const newData = [...this.data]
            const target = newData.filter(item => code === item.code)[0]
            if (target) {
                target[column] = value
                this.data = newData
            }
        },
        /**
         * @name: 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        edit (code) {
            const index = findIndex(this.data, o => code === o.code)
            const newData = [...this.data]
            const target = newData.filter(item => code === item.code)[0]
            if (target) {
                target.editable = true
                this.data = newData
            }
        },
        /**
         * @name: 保存
         * @msg:
         * @param {type}
         * @return:
         */
        save (code) {
            const newData = [...this.data]
            const target = newData.filter(item => code === item.code)[0]
            if (target) {
                delete target.editable
                this.data = newData
                this.cacheData = newData.map(item => ({ ...item }))
                this.icon = false
                this.disabledSub = false
            }
        },
        /**
         * @name: 取消
         * @msg:
         * @param {type}
         * @return:
         */
        cancel (code) {
            const newData = [...this.data]
            const target = newData.filter(item => code === item.code)[0]
            if (target) {
                Object.assign(target, this.cacheData.filter(item => code === item.code)[0])
                delete target.editable
                this.data = newData
            }
        },
        /**
         * @name: 多选隐藏
         * @msg:
         * @param {type}
         * @return:
         */
        hiddenSelect () {
            const data = [...this.data]
            data.forEach(d => {
                if (is.inArray(d.code, this.selectedRowKeys)) {
                    d.isHidden = 1
                }
            })
            this.data = [...data]
            this.disabledSub = false
        },
        /**
         * @name: 一键显示
         * @msg:
         * @param {type}
         * @return:
         */
        showSelect () {
            const data = [...this.data]
            data.forEach(d => {
                if (is.inArray(d.code, this.selectedRowKeys)) {
                    d.isHidden = 0
                }
            })
            this.data = [...data]
            this.disabledSub = false
        },
        /**
         * @name: 一键编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editSelect () {
            const data = [...this.data]
            data.forEach(d => {
                if (is.inArray(d.code, this.selectedRowKeys)) {
                    d.editable = true
                }
            })
            this.data = [...data]
            this.disabledSub = false
        },
        /**
         * @name: 一键保存
         * @msg:
         * @param {type}
         * @return:
         */
        saveSelect () {
            const data = [...this.data]
            data.forEach(d => {
                if (is.inArray(d.code, this.selectedRowKeys)) {
                    d.editable = false
                }
            })
            this.data = [...data]
        },
        /**
         * @name: 提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSub () {
            axios({
                path: 'TableColumnUpdate',
                method: 'post',
                body: { baseTableColumn: this.data }
            }).then(res => {
                if (res.flag === 1) {
                    this.icon = true
                }
            })
        },
        /**
         * @name: 树选中事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keys, e) {
            if (e.selectedNodes.length > 0 && e.selectedNodes[0].data.props.isLeaf) {
                this.tableCode = e.selectedNodes[0].data.props.tableCode
                axios({
                    path: 'TableColumnQuery',
                    method: 'post',
                    body: { tableCode: this.tableCode }
                }).then(res => {
                    if (res.flag === 1) {
                        this.data = res.data
                        this.disabledAdd = false
                        this.icon = true
                        if (this.data.length === 0) {
                            this.disabledSub = true
                        }
                    }
                })
            } else {
                this.code = null
                this.disabledAdd = true
                this.disabledSub = true
                this.data.length = 0
            }
        },
        /**
         * @name: 树过滤
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {

        },
        getTree () {
            axios({
                path: 'ActionMenuFunctionFindAllMenu',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.treeData = this.initTreeData(res.data)
                }
            })
        },
        /**
         * @name: 初始化树数据，遍历
         * @msg:
         * @param {type}
         * @return:
         */
        initTreeData (data) {
            const arr = []
            data.forEach(i => {
                const x = {}
                x.key = i.index
                x.title = this.$t(`menu.${i.key}`)
                if (i.isLeaf) {
                    x.isLeaf = true
                    x.sysType = i.sysType
                    x.tableCode = i.tableCode
                }
                if ('children' in i) {
                    x.children = this.initTreeData(i.children)
                }
                arr.push(x)
            })
            return arr
        }
    }
}
</script>

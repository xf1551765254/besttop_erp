<!--
 * @Description: 组织架构
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-23 15:14:22
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
      @onSeach="onSeach">
      <a-button
        icon="tool"
        v-action:add
        style="margin-left:10px;"
        type="primary"
        size="small"
        @click="addData">配置</a-button>
    </seachBox>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入件型编码/件型编码" @change="onChange" />
          <a-directory-tree
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :selectedKeys.sync="selectedKeys"
            :treeData="treeData"
            :loading="loading"
            @select="onSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="tableSelect">
        </NewTable>
      </div>
    </holy-grail-layout>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">件型名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled placeholder="请输入件型名称" v-decorator="$check('modelRoute.name', {initialValue:BaseMessageObj.name})" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">件型描述</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea disabled placeholder="请输入件型描述" v-decorator="$check('modelRoute.description',{initialValue:BaseMessageObj.description})" :autosize="{ minRows: 2, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-table
          rowKey="routeCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          bordered
          :pagination="false">
          <template v-for="col in ['handlingCharge','logisticsFee','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'handlingCharge'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.routeCode, col)" />
              <a-input-number
                v-else-if="col === 'logisticsFee'"
                style="margin: -5px 0;width:100%;"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.routeCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChange(e.target.value, record.routeCode, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
      </a-form>
    </bt-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import BtModal from '@comp/Modal'
export default {
    name: 'LinePartsManagement',
    components: { NewTable, SeachBox, HolyGrailLayout, BtModal },
    data () {
        return {
            selectedKeys: [],
            tableCode: '',
            tableApiPath: '',
            conditions: [
                {
                    title: '线路',
                    type: 'input',
                    key: 'routeName'
                }
            ],
            btns: ['del', 'export', 'print'],
            seachValue: {},
            expandedKeys: [],
            loading: false,
            treeData: [],
            treeDataSearch: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '删除',
                    action: 'linePartsManagement.delete',
                    fc: this.deleteHandler
                }
            ],
            addEditModel: false, // 弹窗
            title: '',
            submitLoading: false,
            tableSelectRows: [],
            BaseMessageObj: {},
            addEdit: '',
            form: this.$form.createForm(this),
            treeId: {},
            // 新增modeal
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [
                { title: '线路编号', dataIndex: 'routeCode', width: 100, align: 'center' },
                { title: '线路名称', dataIndex: 'routeName', width: 200, align: 'center' },
                { title: '搬运费（元）', dataIndex: 'handlingCharge', width: 200, align: 'center', scopedSlots: { customRender: 'handlingCharge' } },
                { title: '物流费（元）', dataIndex: 'logisticsFee', width: 200, align: 'center', scopedSlots: { customRender: 'logisticsFee' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
            ], // 表头
            categoryinfoData: [],
            autoExpandParent: true
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '54b4a7ccf6ab4d0681a2f70f3805712d:linePartsManagement'
            this.tableApiPath = 'DistributionModelRouteFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.getTree()
    },
    methods: {
        deleteHandler (e) {
            this.onDel(e)
        },
        onDel (e) {
            let arr = []
            if (e === -1) {
                if (this.tableSelectRows.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                arr = map(this.tableSelectRows, 'id')
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'DistributionModelRouteDel',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.routeCode)[0]
            if (target) {
                target[col] = val
                if (!val) {
                    if (col === 'handlingCharge') {
                        target.handlingCharge = 0
                    }
                    if (col === 'logisticsFee') {
                        target.logisticsFee = 0
                    }
                }
                this.categoryinfoData = newData
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys)
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            if (this.categoryinfoSelectedRowKeys.length === 0) {
                return this.$message.warning('请选择线路！')
            }
            const arr = [...this.categoryinfoData]
            const newArr = []
            for (const i of this.categoryinfoSelectedRowKeys) {
                for (const j of arr) {
                    if (i === j.routeCode) {
                        j.isChoose = 1
                        newArr.push(j)
                    } else {
                        j.isChoose = 0
                    }
                }
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    this.submitLoading = true
                    values.routes = newArr
                    values.modelCode = this.treeId.code
                    console.log(values, '------------------')
                    axios({
                        path: 'DistributionModelRouteAdd',
                        method: 'post',
                        body: values,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath, ...this.seachValue })
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            this.categoryinfoSelectedRowKeys = []
            if (!this.treeId.code || this.treeId.code === '-1') {
                return this.$message.warning('请选择件型！')
            }
            console.log(this.treeId, '-------------------')
            this.BaseMessageObj = {
                name: this.treeId.name,
                description: this.treeId.description
            }
            this.title = '新增线路件型'
            axios({
                path: 'DistributionModelRouteFindRoute',
                method: 'post',
                body: {
                    modelCode: this.treeId.code,
                    page: 1,
                    rows: 9999
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    const arr = res.data.list
                    for (const item of arr) {
                        if (item.isChoose === 1) {
                            this.categoryinfoSelectedRowKeys.push(item.routeCode)
                        }
                    }
                    this.categoryinfoData = res.data.list
                }
            })
            // 打开modal
            this.addEditModel = true
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keys, e) {
            console.log(e.node.dataRef)
            const id = e.node.dataRef.code
            this.$set(this.seachValue, 'modelCode', id)
            this.treeId = e.node.dataRef
            this.$refs.newTable.setTableData('08553e1e6a544ed0916d43a403334af9:linePartsManagement', {
                path: 'DistributionModelRouteFind',
                modelCode: id
            })
        },
        // 表格多选
        tableSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'DistributionModelTypeFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = [res.data]
                    console.log(data)
                    this.treeData = this.initTree(data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['-1']
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                if (d.code === '-1') {
                    d.title = d.name
                } else {
                    d.title = `${d.code}-${d.name}`
                }
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
        /**
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {
            console.log(e.target.value)
            if (e.target.value) {
                const newData = JSON.parse(JSON.stringify(this.treeDataSearch))
                this.expandedKeys.length = 0
                const data = this.getParentKey(e.target.value, newData)
                this.autoExpandParent = true
                this.treeData = [...data]
            } else {
                this.treeData = JSON.parse(JSON.stringify(this.treeDataSearch))
            }
        },
        getParentKey (value, tree) {
            const newArr = []
            tree.forEach(item => {
                if (item.title.indexOf(value) >= 0) {
                    this.expandedKeys.push(item.key)
                    newArr.push(item)
                } else if (item.children) {
                    const data = this.getParentKey(value, item.children)
                    if (data.length > 0) {
                        item.children = data
                        newArr.push(item)
                    }
                }
            })
            return newArr
        },
        onExpand  (expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.$delete(this.seachValue, 'modelCode')
            this.seachValue = {}
            this.selectedKeys = ['-1']
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
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionModelRouteFind', this.seachValue)
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
            e.path = 'DistributionModelRouteFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'linePartsManagement') {
                this.getTree()
            }
        }
    }
}
</script>

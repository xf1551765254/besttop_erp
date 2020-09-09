<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-12 21:31:05
 * @LastEditTime: 2019-04-16 15:14:40
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onSeach="onSeach"
      @onReload="onReload"
      @onClick="onSeachClick"/>
    <!-- 搜索树和数据表格 -->
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onTreeChange" />
          <a-directory-tree
            defaultExpandAll
            :treeData="treeData"
            @select="SelectTreeNode"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :disContextMenu="disContextMenu"
          :pams="seachValue"
          @onSelect="onSelect"
          @onContextmenuChange="onContextmenuChange"
        >
        </NewTable>
      </div>
    </holy-grail-layout>
    <!-- 新增/编辑模态框 -->
    <a-modal
      :title="addEditModalTitle"
      v-model="addEditModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">盘点分店</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.storeCode', {initialValue:storeName})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">盘点日期</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD"
                v-decorator="$check('stocktakDefine.stocktakingDate',{initialValue:selectedSingleRow.stocktakingDate})"
                :disabled="isStoktakingDate()"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">开始时间</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledStartDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('stocktakDefine.stocktakingStart',{initialValue:selectedSingleRow.stocktakingStart})"
                showTime/>
            </a-form-item>
          </a-col>
          <a-col :span="4">结束时间</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-date-picker
                style="width:100%;"
                :disabledDate="disabledEndDate"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('stocktakDefine.stocktakingEnd',{initialValue:selectedSingleRow.stocktakingEnd})"
                showTime/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('stocktakDefine.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import is from 'is_js'
import moment from 'moment'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
export default {
    name: 'Stocktak',
    components: {
        NewTable,
        SeachBox,
        HolyGrailLayout
    },
    data: function () {
        return {
            form: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['add', 'del'],
            // 工具栏表单组
            conditions: [
                { title: '分店', type: 'input', key: 'storeCode', disabled: true },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'stocktake_define_status'
                    }
                },
                { title: '开始时间', type: 'date', key: 'stocktakingStartDate' },
                { title: '结束时间', type: 'date', key: 'stocktakingEndDate' }

            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 表格右键菜单
            menuOpt: [
                { name: '编辑',
                    action: 'stocktak.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'stocktak.get',
                    fc: e => this.$refs.newTable.showDetails('预约管理详情', e)
                }, { name: '删除',
                    action: 'stocktak.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'stocktak.verify',
                    fc: this.confirmHandler
                }
            ],
            // 添加标识
            isAdd: true,
            // 加载标识
            loading: false,
            // 表格删除id集合
            rowsId: [],
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增/编辑模态框标题
            addEditModalTitle: '',
            // 新增/编辑模态框打开/关闭标识
            addEditModal: false,
            // 左侧搜索树数据
            treeData: [],
            // 左侧搜索树数据，用于搜索框检索
            treeDataSearch: [],
            // 批量删除数组
            mutilDelArr: [],
            // 选择分店店面信息
            storeInfo: '',
            // 新增/编辑店面信息
            storeName: '',
            // 新增/编辑中分店地址
            storeArr: [],
            // 新增/编辑中盘点状态
            statusArr: [],
            // 表格右键禁用按钮
            disContextMenu: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '77c9e2aeadc9494588a0ad62aab559f1:stocktak'
            this.tableApiPath = 'StocktakeDefineFind'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTree()
        this.getStoreArr()
    },
    methods: {
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'StocktakeDefineFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.rowsId.length > 0) {
                    this.onDel()
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            }
        },
        // 新增/编辑模态框
        addEdit (index) {
            if (index === -1) {
                if (this.storeInfo === '') {
                    this.$message.warning('请先选择分店')
                    return false
                }
                this.storeName = this.storeInfo
                this.isAdd = true
                this.selectedSingleRow = {}
                this.addEditModalTitle = '新增盘点设定信息'
            } else {
                this.storeName = `${this.selectedSingleRow.storeCode}-${this.selectedSingleRow.storeName}`
                this.isAdd = false
                this.addEditModalTitle = '编辑盘点设定信息'
            }
            this.addEditModal = true
        },
        // 单项/多项删除
        onDel () {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'StocktakeDefineDel',
                        method: 'post',
                        body: {
                            ids: self.rowsId
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(self.rowsId, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 表格右击推送本行数据
         */
        onContextmenuChange (row) {
            this.disContextMenu = []
            if (row.status !== 'stocktake_define_status:1') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
        /**
         * @name: 表格选择
         */
        onSelect (k, r) {
            this.rowsId = map(r, 'id')
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            this.selectedSingleRow.stocktakingStart = moment(this.selectedSingleRow.stocktakingStart)
            this.selectedSingleRow.stocktakingEnd = moment(this.selectedSingleRow.stocktakingEnd)
            this.selectedSingleRow.stocktakingDate = moment(this.selectedSingleRow.stocktakingDate)
            this.addEdit()
        },
        /**
         * @name:表格右击删除监听
         */
        deleteHandler (row) {
            this.rowsId.push(row.id)
            this.onDel()
        },
        /**
         * @name: 表格右击审核监听
         */
        confirmHandler (row) {
            axios({
                path: 'StocktakeDefineApproval',
                method: 'post',
                body: { id: row.id }
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                }
            })
        },
        // 模态框关闭
        subCancel () {
            this.addEditModal = false
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    values.stocktakingStart = values.stocktakingStart ? moment(values.stocktakingStart).format('YYYY-MM-DD HH:mm:ss') : ''
                    values.stocktakingEnd = values.stocktakingEnd ? moment(values.stocktakingEnd).format('YYYY-MM-DD HH:mm:ss') : ''
                    values.stocktakingDate = values.stocktakingDate ? moment(values.stocktakingDate).format('YYYY-MM-DD') : ''
                    values.storeCode = values.storeCode.split('-')[0]
                    axios({
                        path: this.isAdd ? 'StocktakeDefineAdd' : 'StocktakeDefineUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 获取左侧数据
         */
        getTree () {
            this.loading = true
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.parentId = '0'
                        item.key = item.code
                        item.children = []
                        item.title = item.code + '-' + item.name
                        item.isLeaf = true
                    })
                    this.treeData = [...data]
                    this.treeDataSearch = [...data]
                }
            })
        },
        /**
         * @name: 树选中
         */
        SelectTreeNode (keys, e) {
            this.storeInfo = `${e.node.dataRef.code}-${e.node.dataRef.name}`
            const storeCode = e.node.dataRef.code
            this.$set(this.seachValue, 'storeCode', storeCode)
            this.$refs.newTable.setTableData('6b551fd164254c47aaf7c8a2e5cbb02e:stocktak', {
                path: 'StocktakeDefineFind',
                storeCode: storeCode
            })
        },

        /**
         * @name: 树过滤
         */
        onTreeChange (e) {
            if (e.target.value) {
                const newData = [...this.treeDataSearch]
                const data = newData.filter(item => item.name.indexOf(e.target.value) >= 0 || item.code.indexOf(e.target.value) >= 0)
                this.treeData = [...data]
            } else {
                this.treeData = [...this.treeDataSearch]
            }
        },
        isStoktakingDate () {
            const StartDate = this.form.getFieldsValue().stocktakingStart
            if (is.undefined(StartDate) || is.null(StartDate)) {
                return true
            } else {
                return false
            }
        },
        // 预约开始时间禁用
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('days'))
        },
        // 预约结束时间禁用
        disabledEndDate (current) {
            const StartDate = this.form.getFieldsValue().stocktakingStart
            if (is.undefined(StartDate)) {
                return true
            } else {
                return moment(current).isBefore(moment(StartDate).startOf('days'))
            }
        },
        // 新增/编辑分店地址获取
        getStoreArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = index + 1
                        item.title = item.name
                        item.value = item.code
                    })
                    this.storeArr = [...data]
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'Stocktak') {
                this.getTree()
                this.getStoreArr()
            }
        }

    }
}
</script>

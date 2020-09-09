<!--
 * @Description: 店面地块
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-02 13:46:02
 * @LastEditTime: 2019-08-22 17:23:22
 -->
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
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <bt-modal
      v-model="storefrontAddEditModal"
      :title="storefrontAddEditModalTitle"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">楼层</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select placeholder="请选择楼层" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('layout.floorId', {initialValue:selectedSingleRow.floorId})" :options="floorId" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('layout.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">面积m2</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入面积" v-decorator="$check('layout.area', {initialValue:selectedSingleRow.area || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">显示标志</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入显示标志" v-decorator="$check('layout.tag', {initialValue:selectedSingleRow.tag || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地块级别</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select placeholder="请选择地块级别" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('layout.layoutLevel', {initialValue:selectedSingleRow.layoutLevel})" :options="plotRankArr" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营品牌</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                showSearch
                v-decorator="$check('layout.brandId', {initialValue:selectedSingleRow.brandName})"
                notFoundContent="请输入经营品牌进行检索"
                placeholder="请输入经营品牌"
                :filterOption="false"
                @search="getBrandArr">
                <a-select-option v-for="d in runBrandArr" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">X1</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入X1" v-decorator="$check('layout.x1', {initialValue:selectedSingleRow.x1 || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">Y1</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入Y1" v-decorator="$check('layout.y1', {initialValue:selectedSingleRow.y1 || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">X2</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入X2" v-decorator="$check('layout.x2', {initialValue:selectedSingleRow.x2 || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">Y2</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入Y2" v-decorator="$check('layout.y2', {initialValue:selectedSingleRow.y2 || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入块地描述" :autosize="{minRows:2, maxRows: 6}" v-decorator="$check('layout.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 6}" v-decorator="$check('layout.note', {initialValue:selectedSingleRow.note || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
export default {
    name: 'StorefrontPlot',
    components: {
        NewTable,
        seachBox,
        BtModal
    },
    data () {
        return {
            // 表格数据定义--start
            tableCode: '',
            tableApiPath: '',
            menuOpt: [
                { name: '编辑',
                    action: 'storefrontPlot.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'storefrontPlot.get',
                    fc: e => this.$refs.newTable.showDetails('店面地块详情', e)
                }, { name: '删除',
                    action: 'storefrontPlot.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }
            ],
            // 表格数据定义--end
            // 工具栏数据定义--start
            btns: ['add', 'del', 'export'],
            seachValue: {},
            conditions: [
                { title: '楼层名称', type: 'input', key: 'name' },
                { title: '编码', type: 'input', key: 'code' }
            ],
            // 工具栏数据定义--end
            // 模态框数据定义--start
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            floorId: [],
            plotRankArr: [],
            runBrandArr: [],
            // 模态框数据定义--end
            loading: false,
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除
            tableSelectRows: [],
            timer: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'db4f02fa2d5b43c9bfd5672c7b507ffe:storefrontPlot'
            this.tableApiPath = 'OrganizationLayoutFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getPlotRankArr()
    },
    methods: {
        // 工具栏方法定义--start
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
            e.path = 'OrganizationLayoutFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('OrganizationLayoutFindBySelected', this.seachValue)
            }
        },
        getBrandArr (e) {
            if (e === '') return
            if (this.timer) { clearTimeout(this.timer) }
            this.timer = setTimeout(() => {
                this.getRunBrandArr(e)
            }, 300)
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getFloorId()
            this.getPlotRankArr()
            // this.getRunBrandArr()
            if (index === -1) {
                // 清除数据
                this.isAdd = true
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增店面地块信息'
            } else {
                this.isAdd = false
                this.storefrontAddEditModalTitle = '编辑店面地块信息'
            }
            this.storefrontAddEditModal = true
        },
        /**
         * @name: 获取下拉框楼层数据
         */
        getFloorId () {
            axios({
                path: 'OrganizationFloorFind',
                method: 'post',
                body: {
                    orderbyField: 'code asc'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = `${item.code}-${item.name}`
                        item.value = item.id
                    })
                    this.floorId = [...data]
                }
            })
        },
        /**
         * @name: 获取下拉框块地级别数据
         */
        getPlotRankArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'floor_grade'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.plotRankArr = [...data]
                }
            })
        },
        /**
         * @name: 获取下拉框经营品牌数据
         */
        getRunBrandArr (value) {
            axios({
                path: 'GoodsBrandFind',
                method: 'post',
                body: {
                    orderbyField: 'code asc',
                    code: value,
                    page: 1,
                    rows: 100
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = item.code + '-' + item.name
                        item.value = item.id
                    })
                    this.runBrandArr = [...data]
                }
            })
        },
        // 工具栏方法定义--end
        // 表格方法定义--start
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            this.addEditStorefront()
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'OrganizationLayoutDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
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
                        if (values.brandId === this.selectedSingleRow.brandName) {
                            values.brandId = this.selectedSingleRow.brandId
                        }
                    }
                    axios({
                        path: this.isAdd ? 'OrganizationLayoutAdd' : 'OrganizationLayoutUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.storefrontAddEditModal = false
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }

        // 模态框方法定义--end
    }
}
</script>

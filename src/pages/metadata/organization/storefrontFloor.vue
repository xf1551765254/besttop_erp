<!--
 * @Description: 店面楼层
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:25:36
 * @LastEditTime: 2019-08-22 17:22:54
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
      @onSelect="onSelect"
    >
    </NewTable>
    <!-- 添加/编辑模态框 -->
    <bt-modal
      v-model="storefrontAddEditModal"
      :title="storefrontAddEditModalTitle"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">分店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择分店"
                :filterOption="filterOption"
                showSearch
                v-decorator="$check('floor.storeId', {initialValue:selectedSingleRow.storeId})"
                :options="subStores"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">楼层编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('floor.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">楼层</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入楼层" v-decorator="$check('floor.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select placeholder="请选择类型" :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('floor.type', {initialValue:selectedSingleRow.type})" :options="floorTypes" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营面积</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input addonAfter="m²" placeholder="请输入经营面积" v-decorator="$check('floor.areaSize', {initialValue:selectedSingleRow.areaSize || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">销售占比</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input addonAfter="%" placeholder="请输入销售占比" v-decorator="$check('floor.saleRate', {initialValue:selectedSingleRow.saleRate || ''})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">毛利占比</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input addonAfter="%" placeholder="请输入毛利占比" v-decorator="$check('floor.profitRate', {initialValue:selectedSingleRow.profitRate || ''})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">费用占比</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input addonAfter="%" placeholder="请输入费用占比" v-decorator="$check('floor.feeRate', {initialValue:selectedSingleRow.feeRate || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                showSearch
                v-decorator="$check('floor.charger', {initialValue:selectedSingleRow.userName})"
                notFoundContent="请输入两位关键字检索"
                placeholder="请输入负责人"
                :filterOption="false"
                @search="getFrincipaArr"
                allowClear>
                <a-select-option v-for="d in managers" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('floor.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <recover-modal v-model="recoverVisble" status="7" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import RecoverModal from '../tools/RecoverModal'
export default {
    name: 'StorefrontFloor',
    components: {
        NewTable,
        seachBox,
        BtModal,
        RecoverModal
    },
    data () {
        return {
            recoverVisble: false,
            tableCode: '',
            tableApiPath: '',
            menuOpt: [
                { name: '编辑',
                    action: 'storefrontFloor.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'storefrontFloor.get',
                    fc: e => this.$refs.newTable.showDetails('店面楼层详情', e)
                }, { name: '删除',
                    action: 'storefrontFloor.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }
            ],
            btns: ['add', 'del', 'recover', 'export'],
            seachValue: {},
            conditions: [
                { title: '分店编码', type: 'input', key: 'storeId' },
                { title: '编码', type: 'input', key: 'code' },
                { title: '类型',
                    type: 'select',
                    key: 'type',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'floor_type' }
                },
                { title: '楼层', type: 'input', key: 'name' }
            ],
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            subStores: [],
            floorTypes: [],
            managers: [],
            loading: false,
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除
            tableSelectRows: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9de4fc37d3944bb29dc86afec62c49b3:storefrontFloor'
            this.tableApiPath = 'OrganizationFloorFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTypes()
    },
    methods: {
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'OrganizationFloorFindBySelected' })
        },
        getFrincipaArr (e) {
            if (e.length < 2) return
            if (this.timer) { clearTimeout(this.timer) }
            this.timer = setTimeout(() => {
                this.getManagers(e)
            }, 300)
        },
        // 分店搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
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
            e.path = 'OrganizationFloorFindBySelected'
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
                this.$refs.newTable.exportFile('OrganizationFloorFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            // 请求分店数据
            this.getSubstores()
            // 请求类型数据
            this.getTypes()
            // 请求负责人信息
            // this.getManagers()
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增店面楼层信息'
            } else {
                this.isAdd = false
                this.storefrontAddEditModalTitle = '编辑店面楼层信息'
            }
            this.storefrontAddEditModal = true
        },
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
                        path: 'OrganizationFloorDel',
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
         * @name: 获取下拉框分店数据
         */
        getSubstores () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    page: '1',
                    rows: '9999'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = `${item.code}-${item.name}`
                        item.value = item.code
                    })
                    this.subStores = [...data]
                }
            })
        },
        /**
         * @name: 获取下拉框分类数据
         */
        getTypes () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'floor_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.floorTypes = res.data
                    console.log(this.floorTypes)
                }
            })
        },
        /**
         * @name: 获取下拉框负责人数据
         */
        getManagers (code) {
            axios({
                path: 'PermissionsUserQuery',
                method: 'post',
                body: { code: code }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = `${item.code}-${item.name}`
                        item.value = item.code
                    })
                    this.managers = res.data.list
                }
            })
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            this.selectedSingleRow.userName = this.selectedSingleRow.userCode ? `${this.selectedSingleRow.userCode || ''}-${this.selectedSingleRow.userName || ''}` : ''
            this.addEditStorefront()
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
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
                        // 负责人未修改
                        if (values.charger === this.selectedSingleRow.userName) {
                            values.charger = this.selectedSingleRow.charger
                        }
                    }
                    axios({
                        path: this.isAdd ? 'OrganizationFloorAdd' : 'OrganizationFloorUpdate',
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
    }
}

</script>

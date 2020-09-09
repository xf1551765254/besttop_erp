<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-22 17:20:57
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
      :title="storefrontAddEditModalTitle"
      v-model="storefrontAddEditModal"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="4" v-if="!isAdd">客户编码</a-col>
          <a-col :sm="16" :md="8" :xl="8" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('channel.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">客户名称</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入客户名称" v-decorator="$check('channel.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">客户简称</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入客户简称" v-decorator="$check('channel.sname', {initialValue:selectedSingleRow.sname || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">区域</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('channel.region', {initialValue:selectedSingleRow.region})" :options="storeRegionArr" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">客户类型</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('channel.type', {initialValue:selectedSingleRow.type})" :options="channelTypeArr" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">渠道属性</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('channel.channelType', {initialValue:selectedSingleRow.channelType})" :options="channelAttributesArr" allowClear/>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="4">批发扣率</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="1"
                :precision="4"
                :step="1"
                @focus="$event.currentTarget.select()"
                v-decorator="$check('channel.pRate', {initialValue:selectedSingleRow.pRate || ''})"
              />
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="4">对应主往来客户</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-select
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                :filterOption="filterOption"
                showSearch
                placeholder="请输入对应主往来客户"
                notFoundContent="请输入两位关键字检索"
                v-decorator="$check('channel.mainCust', {initialValue:selectedSingleRow.mainCust})"
                @search="getMainCustArr"
                allowClear>
                <a-select-option v-for="d in mainCustArr" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="4">账期天数</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入账期天数" v-decorator="$check('channel.netdays', {initialValue:selectedSingleRow.netdays || ''})"/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="4">联系人</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入联系人" v-decorator="$check('channel.person', {initialValue:selectedSingleRow.person || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">联系手机号</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('channel.telephone', {initialValue:selectedSingleRow.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">联系电话</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('channel.tele', {initialValue:selectedSingleRow.tele || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">传真</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入传真" v-decorator="$check('channel.fax', {initialValue:selectedSingleRow.fax || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="4">账号</a-col>
          <a-col :sm="16" :md="8" :xl="8">
            <a-form-item>
              <a-input placeholder="请输入账号" v-decorator="$check('channel.account', {initialValue:selectedSingleRow.account || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="0" :md="isAdd?4:0" :xl="isAdd?4:0"></a-col>
          <a-col :sm="0" :md="isAdd?8:0" :xl="isAdd?8:0"></a-col>
          <a-col :sm="8" :md="4" :xl="4">联系地址</a-col>
          <a-col :sm="16" :md="20" :xl="20">
            <a-form-item>
              <a-input placeholder="请点击右侧图标选择联系地址" v-decorator="$check('channel.address', {initialValue:selectedSingleRow.address || ''})">
                <a-icon slot="addonAfter" type="environment" @click="onShowMap"/>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 6}" v-decorator="$check('channel.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <AmapModal :address="address" :lat="lat" :lng="lng" @dragMap="dragMap" v-model="amapVisble"></AmapModal>
    <editor-modal v-model="editVisble" :pams="editPams" type="channel"/>
    <recover-modal v-model="recoverVisble" status="4" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import EditorModal from '@comp/editor/EditorModal'
import map from 'lodash.map'
import AmapModal from '../tools/AmapModal'
import BtModal from '@comp/Modal'
import RecoverModal from '../tools/RecoverModal'
export default {
    name: 'ChannelCustomers',
    components: {
        NewTable,
        seachBox,
        EditorModal,
        AmapModal,
        BtModal,
        RecoverModal
    },
    data () {
        return {
            timer: '',
            // 表格数据定义--start
            tableCode: '',
            tableApiPath: '',
            editVisble: false,
            editPams: {},
            menuOpt: [
                { name: '编辑',
                    action: 'channelCustomers.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'channelCustomers.get',
                    fc: e => this.$refs.newTable.showDetails('渠道客户管理详情', e)
                }, { name: '删除',
                    action: 'channelCustomers.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, {
                    name: '渠道客户文案',
                    action: 'channelCustomers.edit',
                    fc: e => this.editText(e)
                }
            ],
            // 表格数据定义--end
            // 工具栏数据定义--start
            btns: ['add', 'del', 'recover', 'export'],
            seachValue: {},
            conditions: [
                { title: '客户编码', type: 'input', key: 'code' },
                { title: '客户名称', type: 'input', key: 'name' },
                { title: '客户类型',
                    type: 'select',
                    key: 'type',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'channel_type' }
                },
                { title: '渠道属性',
                    type: 'select',
                    key: 'channelType',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'channel_attr' }
                },
                { title: '区域',
                    type: 'select',
                    key: 'region',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'store_region' }
                }
            ],
            // 工具栏数据定义--end
            // 模态框数据定义--start
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            storeRegionArr: [],
            channelTypeArr: [],
            channelAttributesArr: [],
            mainCustArr: [],
            // 模态框数据定于--end
            loading: false,
            // 模态框数据定于--end
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除id
            tableSelectRows: [],
            lat: '',
            lng: '',
            address: '',
            amapVisble: false,
            recoverVisble: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'dd6520294eed4c79a611a70a63f5853c:channelCustomers'
            this.tableApiPath = 'CustomerDistributorsFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        // this.getMainCustArr()
        this.getChannelAttributesArr()
        this.getChannelTypeArr()
        this.getStoreRegionArr()
    },
    methods: {
        onShowMap () {
            this.address = this.form.getFieldsValue().address
            this.amapVisble = true
        },
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CustomerDistributorsFindBySelected' })
        },
        // 地图返回数据
        dragMap (data) {
            console.log(data)
            this.form.setFieldsValue({
                address: data.address
            })
            this.lat = data.position.lat.toString()
            this.lng = data.position.lng.toString()
        },
        editText (row) {
            this.selectedSingleRow = row
            this.editPams = { id: row.id }
            this.editVisble = true
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
            e.path = 'CustomerDistributorsFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.isAdd = true
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CustomerDistributorsFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            // this.getMainCustArr()
            this.getChannelAttributesArr()
            this.getChannelTypeArr()
            this.getStoreRegionArr()
            if (index === -1) {
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增渠道客户信息'
            } else {
                this.storefrontAddEditModalTitle = '编辑渠道客户信息'
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
                        path: 'CustomerDistributorsDel',
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
         * @name: 请求区域数据
         */
        getStoreRegionArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'store_region'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.storeRegionArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.region = data[0].value
                    }
                }
            })
        },
        /**
         * @name: 请求渠道类型数据
         */
        getChannelTypeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'channel_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.channelTypeArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.type = data[0].value
                    }
                }
            })
        },
        /**
         * @name: 请求渠道属性数据
         */
        getChannelAttributesArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'channel_attr'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.channelAttributesArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.channelType = data[0].value
                    }
                }
            })
        },
        /**
         * @name: 请求往来客户数据
         */
        getMainCustArr (e) {
            if (e.length < 2) return
            if (this.timer) { clearTimeout(this.timer) }
            this.timer = setTimeout(() => {
                axios({
                    path: 'CustomerDistributorsFindBySelected',
                    method: 'post',
                    body: {
                        page: 1,
                        rows: 50,
                        code: e
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach((item, index) => {
                            item.key = item.id
                            item.title = `${item.code}-${item.name}`
                            item.value = item.code
                        })
                        this.mainCustArr = [...data]
                    }
                })
            }, 500)
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
            this.isAdd = false
            this.selectedSingleRow = { ...row }
            this.lat = row.latitude && row.latitude.toString()
            this.lng = row.longitude && row.longitude.toString()
            this.addEditStorefront()
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
        // 表格方法定义--end
        // 模态框方法定义--start
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                console.log(values)
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    values.longitude = this.lng
                    values.latitude = this.lat
                    axios({
                        path: this.isAdd ? 'CustomerDistributorsAdd' : 'CustomerDistributorsUpdate',
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

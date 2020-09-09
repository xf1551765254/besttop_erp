<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:23:56
 * @LastEditTime: 2019-08-22 17:23:08
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
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <holy-grail-tree @onTreeSelect="onTreeSelect">
      <div slot="table">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onSelect">
        </NewTable>
      </div>
    </holy-grail-tree>
    <!-- 新增编辑 -->
    <bt-modal
      v-model="storefrontAddEditModal"
      :title="storefrontAddEditModalTitle"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <div class="titleInfo">
          基础信息
        </div>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('store.type', {initialValue:selectedSingleRow.type})" :options="typeArr" @change="onTypeChange"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">机构编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('store.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">机构全称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入机构全称" @blur="e=>onBlur(e)" v-decorator="$check('store.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">简称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入机构简称" v-decorator="$check('store.sname', {initialValue:selectedSingleRow.sname || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                v-decorator="$check('store.chargerId', {initialValue:selectedSingleRow.chargeUserName})"
                notFoundContent="请输入两位关键字检索"
                placeholder="请输入负责人"
                style="width: 100%"
                :filterOption="false"
                @search="getFrincipaArr"
                allowClear>
                <a-select-option v-for="d in frincipalArr" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入电话" v-decorator="$check('store.tele', {initialValue:selectedSingleRow.tele || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营区域</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select v-decorator="$check('store.region', {initialValue:selectedSingleRow.region})" :options="manageArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营面积/m²</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入经营面积" v-decorator="$check('store.area', {initialValue:selectedSingleRow.area || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">传真</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入传真" v-decorator="$check('store.fax', {initialValue:selectedSingleRow.fax || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select v-decorator="$check('store.status', {initialValue:selectedSingleRow.status})" :options="statusArr"/>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="titleInfo">其他信息</div>
        <a-row>
          <div v-show="storeType=='store_type:1'||storeType=='store_type:6'">
            <a-col :sm="8" :md="4" :xl="3">账号</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input placeholder="请输入账号" v-decorator="$check('store.acctNo', {initialValue:selectedSingleRow.acctNo || ''})"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">税票电话</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input placeholder="请输入税票电话" v-decorator="$check('store.telTax', {initialValue:selectedSingleRow.telTax || ''})"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">开户行</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input placeholder="请输入开户行" v-decorator="$check('store.bank', {initialValue:selectedSingleRow.bank || ''})"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">税务登记号</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input placeholder="请输入税务登记号" v-decorator="$check('store.taxNo', {initialValue:selectedSingleRow.taxNo || ''})"/>
              </a-form-item>
            </a-col>
          </div>
          <a-col :sm="8" :md="4" :xl="3" v-show="!isAdd || (storeType!='store_type:1'&&storeType!='store_type:6')">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-show="!isAdd || (storeType!='store_type:1'&&storeType!='store_type:6')">
            <a-form-item>
              <a-select
                placeholder="请选择隶属公司"
                v-decorator="$check('store.upStoreId', {initialValue:selectedSingleRow.id && selectedSingleRow.upStoreId === selectedSingleRow.id ? `${selectedSingleRow.code}-${selectedSingleRow.name}` : selectedSingleRow.upStoreId})"
                :options="subCompanyArray"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-show="storeType=='store_type:3'||storeType=='store_type:6'">对应配送中心</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-show="storeType=='store_type:3'||storeType=='store_type:6'">
            <a-form-item>
              <a-select
                placeholder="请选择对应配送中心"
                v-decorator="$check('store.directUnder', {initialValue:selectedSingleRow.directUnder})"
                :options="DCArray"
                allowClear
                mode="multiple"
                :maxTagCount="1"/>
            </a-form-item>
          </a-col>
          <a-col :sm="0" :md="4" :xl="3" v-show="storeType=='store_type:2'||storeType=='store_type:4'"></a-col>
          <a-col :sm="0" :md="8" :xl="13" v-show="storeType=='store_type:2'||storeType=='store_type:4'"></a-col>
          <a-col :sm="0" :md="0" :xl="3" v-show="storeType=='store_type:3'"></a-col>
          <a-col :sm="0" :md="0" :xl="5" v-show="storeType=='store_type:3'"></a-col>
          <div v-show="storeType=='store_type:1'||storeType=='store_type:6'">
            <!-- <a-col :sm="8" :md="4" :xl="3">子公司独立核算</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select v-decorator="$check('store.isSub', {initialValue:selectedSingleRow.isSub || 0})">
                  <a-select-option :value="1">是</a-select-option>
                  <a-select-option :value="0">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col> -->
            <a-col :sm="0" :md="isAdd?0:4" :xl="3" v-show="storeType=='store_type:1'"></a-col>
            <a-col :sm="0" :md="isAdd?0:8" :xl="isAdd?13:5" v-show="storeType=='store_type:1'"></a-col>
            <a-col :sm="0" :md="4" :xl="3" v-show="isAdd&&storeType=='store_type:6'"></a-col>
            <a-col :sm="0" :md="8" :xl="5" v-show="isAdd&&storeType=='store_type:6'"></a-col>
            <a-col :sm="8" :md="4" :xl="3">税票地址</a-col>
            <a-col :sm="16" :md="20" :xl="21">
              <a-form-item>
                <a-input placeholder="请输入税票地址" v-decorator="$check('store.addressTax', {initialValue:selectedSingleRow.addressTax || ''})"/>
              </a-form-item>
            </a-col>
          </div>
          <a-col :sm="8" :md="4" :xl="3" v-show="storeType!='store_type:5'">详细地址</a-col>
          <a-col :sm="16" :md="20" :xl="21" v-show="storeType!='store_type:5'">
            <a-form-item>
              <a-input placeholder="请点击右侧图标选择详细地址" v-decorator="$check('store.address', {initialValue:selectedSingleRow.address || ''})">
                <a-icon slot="addonAfter" type="environment" @click="onShowMap"/>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <AmapModal :address="address" :lat="lat" :lng="lng" @dragMap="dragMap" v-model="amapVisble"></AmapModal>
    <recover-modal v-model="recoverVisble" status="5" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
    <preview
      v-model="previewVisbel"
      title="机构信息详情">
      <div slot="A" title="基础信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">类型</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.typeName }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">机构编码</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.code }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">机构全称</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.name }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">简称</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.sname }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.chargeUserCode ? `${previewDetail.chargeUserCode}-${previewDetail.chargeUserName}` : '' }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">电话</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.tele }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">经营区域</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.regionName }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">经营面积/m²</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.area }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">传真</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.fax }}</span></a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.statusName }}</span></a-col>
        </a-row>
      </div>
      <div slot="B" title="其他信息">
        <a-row>
          <div v-if="previewDetail.type=='store_type:1'||previewDetail.type=='store_type:6'">
            <a-col :sm="8" :md="4" :xl="3">账号</a-col>
            <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.acctNo }}</span></a-col>
            <a-col :sm="8" :md="4" :xl="3">税票电话</a-col>
            <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.telTax }}</span></a-col>
            <a-col :sm="8" :md="4" :xl="3">开户行</a-col>
            <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.bank }}</span></a-col>
            <a-col :sm="8" :md="4" :xl="3">税务登记号</a-col>
            <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ previewDetail.taxNo }}</span></a-col>
          </div>
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <span class="text">{{ previewDetail.upStoreName }}</span>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewDetail.type=='store_type:3'||previewDetail.type=='store_type:6'">对应配送中心</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="previewDetail.type=='store_type:3'||previewDetail.type=='store_type:6'">
            <span class="text">{{ previewDetail.storeName }}</span>
          </a-col>

          <a-col :sm="0" :md="4" :xl="3" v-show="previewDetail.type=='store_type:2'||previewDetail.type=='store_type:4'"></a-col>
          <a-col :sm="0" :md="8" :xl="5" v-show="previewDetail.type=='store_type:2'||previewDetail.type=='store_type:4'"></a-col>
          <a-col :sm="0" :md="0" :xl="3" v-show="previewDetail.type=='store_type:3'"></a-col>
          <a-col :sm="0" :md="0" :xl="5" v-show="previewDetail.type=='store_type:3'"></a-col>

          <div v-if="previewDetail.type=='store_type:1'||previewDetail.type=='store_type:6'">
            <!-- <a-col :sm="8" :md="4" :xl="3">子公司独立核算</a-col>
            <a-col :sm="16" :md="8" :xl="5"><span class="text">{{ `${previewDetail.isSub == 1? '是' : '否'}` }}</span></a-col> -->
            <a-col :sm="0" :md="4" :xl="3" v-show="previewDetail.type=='store_type:1'"></a-col>
            <a-col :sm="0" :md="8" :xl="5" v-show="previewDetail.type=='store_type:1'"></a-col>
            <a-col :sm="8" :md="4" :xl="3">税票地址</a-col>
            <a-col :sm="16" :md="20" :xl="21"><span class="text">{{ previewDetail.addressTax }}</span></a-col>
          </div>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewDetail.type!='store_type:5'">详细地址</a-col>
          <a-col :sm="16" :md="20" :xl="21" v-if="previewDetail.type!='store_type:5'"><span class="text">{{ previewDetail.address }}</span></a-col>
        </a-row>
      </div>
    </preview>
  </div>
</template>
<style lang="less" scoped>
.titleInfo{
    margin-left: 25px;
    color: #38adff;
    margin-bottom: 10px;
}
</style>

<script>
import BtModal from '@comp/Modal'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import RecoverModal from '../tools/RecoverModal'
import HolyGrailTree from '../tools/HolyGrailTree'
import AmapModal from '../tools/AmapModal'
import Preview from '@comp/Modal/preview'
export default {
    name: 'StorefrontInformation',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        RecoverModal,
        HolyGrailTree,
        AmapModal,
        Preview
    },
    data () {
        return {
            recoverVisble: false,
            timer: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'recover', 'export'],
            conditions: [
                { title: '机构编码', type: 'input', key: 'code' },
                { title: '机构名称', type: 'input', key: 'name' },
                { title: '经营区域',
                    type: 'select',
                    key: 'region',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'store_region', grade: '1' }
                },
                { title: '类型',
                    type: 'select',
                    key: 'type',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'store_type', grade: '1' }
                }
            ],
            seachValue: {},
            menuOpt: [
                { name: '编辑', action: 'storefrontInformation.edit', fc: this.editHandler },
                { name: '详情', action: 'storefrontInformation.get', fc: this.getHandler },
                // { name: '详情', action: 'storefrontInformation.get', fc: e => this.$refs.newTable.showDetails('机构信息详情', e) },
                { name: '删除', action: 'storefrontInformation.delete', fc: ({ id }) => { this.onDel(id) } }
            ],
            // 加载
            loading: false,
            // 表单
            form: this.$form.createForm(this),
            // 经营区域
            manageArr: [],
            // 类型
            typeArr: [],
            // 负责人
            frincipalArr: [],
            // 对应配送中心
            DCArray: [],
            // 隶属公司
            subCompanyArray: [],
            // 内部供应商
            // intraProviderArr: [],
            // 新增/编辑模态框
            storefrontAddEditModal: false,
            // 新增/编辑模态框头
            storefrontAddEditModalTitle: '',
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 单项/多项删除
            tableSelectRows: [],
            lat: '',
            lng: '',
            storeType: '',
            amapVisble: false,
            address: '',
            previewVisbel: false,
            previewDetail: {},
            statusArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'bddc171ec3954356aea7530d835a6de8:storefrontInformation'
            this.tableApiPath = 'OrganizationStoreFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.queryManage()
        this.queryType()
        this.queryStatus()
        this.addModelSubCompany()
    },
    methods: {
        onShowMap () {
            this.address = this.form.getFieldsValue().address
            this.amapVisble = true
        },
        onTypeChange (e) {
            this.storeType = e
        },
        onBlur (e) {
            this.form.setFieldsValue({
                sname: e.target.value
            })
        },
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'OrganizationStoreFindBySelected' })
        },
        getFrincipaArr (e) {
            if (e.length < 2) return
            if (this.timer) { clearTimeout(this.timer) }
            this.timer = setTimeout(() => {
                this.addModelPrincipal(e)
            }, 300)
        },
        // 地图返回数据
        dragMap (data) {
            this.form.setFieldsValue({
                address: data.address
            })
            this.lat = data.position.lat + ''
            this.lng = data.position.lng + ''
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        // 表格右击编辑row
        editHandler (row) {
            this.isAdd = false
            this.selectedSingleRow = { ...row }
            this.storeType = this.selectedSingleRow.type
            this.lat = row.latitude + ''
            this.lng = row.longitude + ''
            this.addEditStorefront()
        },
        getHandler (row) {
            this.previewDetail = { ...row }
            this.previewVisbel = true
        },
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
                        path: 'OrganizationStoreDel',
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
         * @name: 工具栏表单内容重置
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏搜索功能
         */
        onSeach (e) {
            e.path = 'OrganizationStoreFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e, true)
        },
        /**
         * @name: 工具栏功能按键事件监听
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
                this.$refs.newTable.exportFile('OrganizationStoreFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        /**
         * @name: 新增编辑模态框获取经营区域数据获取
         */
        queryManage () {
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'store_region',
                    grade: '1'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.manageArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.region = data[0].value
                    }
                }
            })
        },
        /**
         * @name: 新增编辑模态框获取机构状态数据请求
         */
        queryStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'base_store_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data || []
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.statusArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.status = data[0].value
                    }
                }
            })
        },
        /**
         * @name: 新增编辑模态框获取类型数据请求
         */
        queryType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'store_type',
                    grade: '1'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.typeArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.type = data[0].value
                        this.storeType = `${data[0].type}:${data[0].configKey}`
                    }
                }
            })
        },
        /**
         * @name: 新增编辑模态框请求负责人数据请求
         */
        addModelPrincipal (code) {
            axios({
                path: 'PermissionsUserQuery',
                method: 'post',
                body: { code: code }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((i, index) => {
                        i.key = index
                        i.title = `${i.code}-${i.name}`
                        i.value = i.id
                    })
                    this.frincipalArr = [...data]
                }
            })
        },
        /**
         * @name: 新增编辑模态框隶属公司数据请求 取综合机构和分子类型
         */
        addModelSubCompany () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: { type: 'store_type:1,store_type:6' }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((i, index) => {
                        i.key = index
                        i.title = `${i.code}-${i.name}`
                        i.value = i.id
                    })
                    this.subCompanyArray = [...data]
                }
            })
        },
        /**
         * @name: 新增编辑模态框对应配送中心数据请求
         */
        addModelDC () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    type: 'store_type:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((i, index) => {
                        i.key = index
                        i.title = `${i.code}-${i.name}`
                        i.value = i.id
                    })
                    this.DCArray = [...data]
                }
            })
        },
        /**
         * @name: 新增编辑模态框内部供应商数据请求
         */
        // addModelIntraProvider () {
        //     axios({
        //         path: 'CustomerSupplierFind',
        //         method: 'post',
        //         body: {
        //             type: 'provider_type:3',
        //             orderbyField: 'code asc'
        //         }
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data.list
        //             data.forEach((i, index) => {
        //                 i.key = index
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.id
        //             })
        //             this.intraProviderArr = res.data.list
        //         }
        //     })
        // },
        /**
         * @name:添加/编辑handler
         */
        addEditStorefront (index) {
            this.queryManage()
            this.queryType()
            this.queryStatus()
            this.addModelSubCompany()
            // this.addModelIntraProvider()
            this.addModelDC()
            this.storefrontAddEditModal = true
            if (index === -1) {
                this.selectedSingleRow = {}
                this.storefrontAddEditModalTitle = '新增机构信息'
            } else {
                // 负责人显示code-name
                this.selectedSingleRow.chargeUserName = this.selectedSingleRow.chargeUserCode ? `${this.selectedSingleRow.chargeUserCode || ''}-${this.selectedSingleRow.chargeUserName || ''} ` : ''
                this.selectedSingleRow.directUnder = this.selectedSingleRow.directUnder ? this.selectedSingleRow.directUnder.split(',') : []
                this.storefrontAddEditModalTitle = '编辑机构信息'
            }
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
                        // 负责人未修改
                        if (values.chargerId === this.selectedSingleRow.chargeUserName) {
                            values.chargerId = this.selectedSingleRow.chargerId
                        }
                        if (values.upStoreId === `${this.selectedSingleRow.code}-${this.selectedSingleRow.name}`) {
                            values.upStoreId = this.selectedSingleRow.upStoreId
                        }
                    }
                    values.longitude = this.lng
                    values.latitude = this.lat
                    values.directUnder = values.directUnder && values.directUnder.join(',')
                    axios({
                        path: this.isAdd ? 'OrganizationStoreAdd' : 'OrganizationStoreUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.storefrontAddEditModal = false
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
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onTreeSelect (code) {
            this.$set(this.seachValue, 'organize', code)
            this.$refs.newTable.setTableData(this.tableCode, {
                path: 'OrganizationStoreFindBySelected',
                organize: code
            })
        }
    }
}
</script>

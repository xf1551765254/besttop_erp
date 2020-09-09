<!--
 * @Description: 供应商
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:26:41
 * @LastEditTime: 2019-08-23 16:08:02
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
    <!-- 表格数据 -->
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
        <div class="titleInfo">基础信息</div>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">供应商编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('provider.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入供应商名称" v-decorator="$check('provider.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择供应商类型"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-decorator="$check('provider.type', {initialValue:selectedSingleRow.type})"
                :options="supplierTypeArr"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">企业性质</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('provider.property', {initialValue:selectedSingleRow.property})" :options="enterpriseArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('provider.status', {initialValue:selectedSingleRow.status})" :options="clientStateArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">法人代表</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入法人代表" v-decorator="$check('provider.generalManager', {initialValue:selectedSingleRow.generalManager || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联络人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联络人" v-decorator="$check('provider.linkMan', {initialValue:selectedSingleRow.linkMan || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联络人头衔</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联络人头衔" v-decorator="$check('provider.linkManTitle', {initialValue:selectedSingleRow.linkManTitle || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联系电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('provider.linkTele', {initialValue:selectedSingleRow.linkTele || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联络传真</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联络传真" v-decorator="$check('provider.linkFax', {initialValue:selectedSingleRow.linkFax || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联络email</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联络email" v-decorator="$check('provider.linkEmail', {initialValue:selectedSingleRow.linkEmail || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入订货电话" v-decorator="$check('provider.orderTele', {initialValue:selectedSingleRow.orderTele || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货传真</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入订货传真" v-decorator="$check('provider.orderFax', {initialValue:selectedSingleRow.orderFax || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货email</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入订货email" v-decorator="$check('provider.orderEmail', {initialValue:selectedSingleRow.orderEmail || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="titleInfo">其他信息</div>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">税务登记号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入税务登记号" v-decorator="$check('provider.taxRegNo', {initialValue:selectedSingleRow.taxRegNo || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">税率</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('provider.taxRate', {initialValue:selectedSingleRow.taxRate ||$store.getters.taxRate[0].value})" :options="$store.getters.taxRate"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开户银行</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入开户银行" v-decorator="$check('provider.accountBank', {initialValue:selectedSingleRow.accountBank || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">账户名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入账户名称" v-decorator="$check('provider.accountName', {initialValue:selectedSingleRow.accountName || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">账号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入账号" v-decorator="$check('provider.accountNo', {initialValue:selectedSingleRow.accountNo || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货日</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number style="width:100%" :min="0" :max="6" :precision="0" v-decorator="$check('provider.buyWeekday', {initialValue:selectedSingleRow.buyWeekday})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货周期(日)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number :min="0" style="width:100%" placeholder="请输入订货周期" v-decorator="$check('provider.buyWeeks', {initialValue:selectedSingleRow.buyWeeks || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">送货期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number :min="0" style="width:100%" placeholder="请输入送货期" v-decorator="$check('provider.deliveryDay', {initialValue:selectedSingleRow.deliveryDay || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">订货有效期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number :min="0" style="width:100%" placeholder="请输入订货有效期" v-decorator="$check('provider.cancelDay', {initialValue:selectedSingleRow.cancelDay || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结算方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('provider.payMode', {initialValue:selectedSingleRow.payMode})" :options="closeWayArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">月结天数</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number :min="0" style="width:100%" placeholder="请输入月结天数" v-decorator="$check('provider.payCycle', {initialValue:selectedSingleRow.payCycle || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">发票类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('provider.invoiceType', {initialValue:selectedSingleRow.invoiceType})" :options="billTypeArr"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">业务负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入业务负责人" v-decorator="$check('provider.inchargeUserNo', {initialValue:selectedSingleRow.inchargeUserNo || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">淘汰日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker placeholder="请输入淘汰日期" style="width: 100%" v-decorator="$check('provider.disuseDate', {initialValue:selectedSingleRow.disuseDate})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">引入日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker @change="onChange" style="width: 100%" v-decorator="$check('provider.introduceDate', {initialValue:selectedSingleRow.introduceDate})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">邮政编码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入邮政编码" v-decorator="$check('provider.postCode', {initialValue:selectedSingleRow.postCode || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="0" :md="0" :xl="3"></a-col>
          <a-col :sm="0" :md="0" :xl="13"></a-col>
          <a-col :sm="8" :md="4" :xl="3">详细地址</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input placeholder="请点击右侧图标选择详细地址" v-decorator="$check('provider.address', {initialValue:selectedSingleRow.address || ''})">
                <a-icon slot="addonAfter" type="environment" @click="onShowMap"/>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入供应商备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('provider.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <upload :fileList="fileList" :fileLength="fileLength" @uploadFileList="uploadFileList"></upload>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <AmapModal :address="address" :lat="lat" :lng="lng" @dragMap="dragMap" v-model="amapVisble"></AmapModal>
    <editor-modal v-model="editVisble" :pams="editPams" type="supplier"/>
    <recover-modal v-model="recoverVisble" status="3" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
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
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import AmapModal from '../tools/AmapModal'
import upload from '@comp/upload'
import EditorModal from '@comp/editor/EditorModal'
import BtModal from '@comp/Modal'
import RecoverModal from '../tools/RecoverModal'
export default {
    name: 'Supplier',
    components: {
        NewTable,
        seachBox,
        AmapModal,
        upload,
        EditorModal,
        BtModal,
        RecoverModal
    },
    data () {
        return {
            recoverVisble: false,
            text: '',
            tableCode: '',
            tableApiPath: '',
            editVisble: false,
            editPams: {},
            menuOpt: [
                { name: '编辑',
                    action: 'supplier.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'supplier.get',
                    fc: e => this.$refs.newTable.showDetails('供应商管理详情', e)
                }, { name: '删除',
                    action: 'supplier.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, {
                    name: '供应商文案',
                    action: 'supplier.edit',
                    fc: e => this.editText(e)
                }
            ],
            btns: ['add', 'del', 'recover', 'export'],
            seachValue: {},
            conditions: [
                { title: '供应商编码', type: 'input', key: 'code' },
                { title: '供应商名称', type: 'input', key: 'name' },
                { title: '供应商类型',
                    type: 'select',
                    key: 'type',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'provider_type' }
                },
                { title: '企业性质',
                    type: 'select',
                    key: 'property',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'company_nature_type' }
                }

            ],
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            supplierTypeArr: [],
            enterpriseArr: [],
            clientStateArr: [],
            closeWayArr: [],
            billTypeArr: [],
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
            fileList: [],
            fileLength: ['LOGO', '营业执照', '上传图片', '上传图片', '上传图片']
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ea81d25bd65e4557bff8627e4505e333:supplier'
            this.tableApiPath = 'CustomerSupplierFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getSupplierTypeArr()
        this.getEnterpriseArr()
        this.getConfig()
    },
    methods: {
        onShowMap () {
            this.address = this.form.getFieldsValue().address
            this.amapVisble = true
        },
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CustomerSupplierFindBySelected' })
        },
        editText (row) {
            this.selectedSingleRow = row
            this.editPams = { id: row.id }
            this.editVisble = true
        },
        // 图片上传
        uploadFileList (data) {
            this.fileList = data
        },
        // 地图返回数据
        dragMap (data) {
            console.log(data)
            this.form.setFieldsValue({
                address: data.address,
                postCode: data.adcode
            })
            this.lat = data.position.lat.toString()
            this.lng = data.position.lng.toString()
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
            e.path = 'CustomerSupplierFindBySelected'
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
                this.$refs.newTable.exportFile('CustomerSupplierFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getSupplierTypeArr()
            this.getEnterpriseArr()
            this.getConfig()
            if (index === -1) {
                this.selectedSingleRow = {}
                this.fileList = []
                this.selectedSingleRow.introduceDate = moment()
                this.storefrontAddEditModalTitle = '新增供应商信息'
            } else {
                this.storefrontAddEditModalTitle = '编辑供应商信息'
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
                        path: 'CustomerSupplierDel',
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
         * @name: 请求供应商类型数据
         */
        getSupplierTypeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'provider_type',
                    grade: '3'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.supplierTypeArr = [...data]
                }
            })
        },
        /**
         * @name: 请求企业性质数据
         */
        getEnterpriseArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'company_nature_type',
                    geade: '3'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.enterpriseArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.property = data[0].value
                    }
                }
            })
        },
        /**
         * @name:请求系统参数数据 客户状态 结算方式 发票类型
         */
        getConfig () {
            axios({
                path: 'OrganizationConfigFindByTypes',
                method: 'post',
                body: {
                    types: ['base_provider_status', 'settle_accounts_type', 'invoice_type']
                }
            }).then(res => {
                if (res.flag === 1) {
                    const statusData = res.data.base_provider_status
                    const accountData = res.data.settle_accounts_type
                    const invoiceData = res.data.invoice_type
                    statusData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.clientStateArr = [...statusData]
                    accountData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.closeWayArr = [...accountData]
                    invoiceData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.billTypeArr = [...invoiceData]
                    if (this.isAdd) {
                        this.selectedSingleRow.status = statusData[0].value
                        this.selectedSingleRow.payMode = accountData[0].value
                        this.selectedSingleRow.invoiceType = invoiceData[0].value
                    }
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
            this.isAdd = false
            this.fileList = []
            this.selectedSingleRow = { ...row }
            this.lat = row.latitude && row.latitude.toString()
            this.lng = row.longitude && row.longitude.toString()
            if (row.pic) {
                const pic = row.pic.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
            }
            this.selectedSingleRow.introduceDate = this.selectedSingleRow.introduceDate ? moment(this.selectedSingleRow.introduceDate) : null
            this.selectedSingleRow.disuseDate = this.selectedSingleRow.disuseDate ? moment(this.selectedSingleRow.disuseDate) : null

            this.addEditStorefront()
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
        // 表格方法定义--end
        // 模态框方法定义--start
        onChange () { },
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
                    const fileList = this.fileList.map(x => x.fileUrl)
                    values.pic = fileList.join(',')
                    values.introduceDate = values.introduceDate ? moment(values.introduceDate).format('YYYY-MM-DD') : ''
                    values.disuseDate = values.disuseDate ? moment(values.disuseDate).format('YYYY-MM-DD') : ''
                    axios({
                        path: this.isAdd ? 'CustomerSupplierAdd' : 'CustomerSupplierUpdate',
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

<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-12 15:44:30
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-28 15:21:19
 -->
 <!-- 联营入库 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      title="入库"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('bill_entry.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                :filterOption="false"
                placeholder="请检索供应商"
                @search="handleSearchSupplierCode"
                allowClear
                showSearch
                :disabled="disabled"
                @change="providerChange"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.sourceCode',{initialValue:billsForm.sourceCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.entryMakeStoreCode',{initialValue:billsForm.entryMakeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">验收人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('bill_entry.entryBy', {initialValue:billsForm.entryBy})"
                :options="customerLIst"
                @search="handleSearchBuyBy"
                :filterOption="false"
                placeholder="请检索验收人"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_entry.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">入库明细</h4>
        <a-button size="small" @click="addManage" v-if="disabled === false">添加商品</a-button>
        <a-button class="editable-add-btn" type="danger" size="small" @click="onDelete(-1)">删除</a-button>
        <a-table
          rowKey="skuCode"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :pagination="false"
          :scroll="{x:1500, y: 350}">
          <template v-for="col in ['entryQtty']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'entryQtty'"
                style="margin: -5px 0;width:100%;"
                :min="1"
                :max="9999999"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputStorageChange(e, record.skuCode, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.skuCode)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button type="primary" style="margin-left: 10px" @click="submitData(form, '1')">提交审核</a-button>
      </template>
      <goodsBounced :flagObj="flagObj" :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="selectData"/>
    </bt-modal>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsBounced'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '入库数量', dataIndex: 'entryQtty', width: 100, align: 'right', scopedSlots: { customRender: 'entryQtty' } },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
    { title: '规格型号', dataIndex: 'model', width: 300, align: 'left' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
    { title: '单位', dataIndex: 'basicUnit', width: 50, align: 'left' },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    components: {
        BtModal,
        goodsBounced
    },
    data () {
        return {
            columns,
            bt_id: '',
            provider: '',
            orderId: '',
            disabled: false,
            tags: [],
            flagObj: {},
            billsForm: {},
            billsData: [],
            pamsBounced: {},
            providerList: [],
            customerLIst: [],
            selectedRowKeys: [],
            loading: false,
            storeQuery: false,
            clientVisible: false,
            form: this.$form.createForm(this),
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss')
        }
    },
    props: {
        code: {
            type: String,
            default: String
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.getData(this.$props.code)
                console.log(val, '555555555555555555')
            }
        },
        clientVisible (val) {
            if (!val) {
                this.$emit('input', false)
            }
        }
    },
    methods: {
        /**
         * @name: 序号
         */
        taIndex (data) {
            let num = 1
            data.forEach(i => {
                i.index = num++
            })
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerLIst.length = 0
                this.getDataFun({
                    condition: value
                }, path)
            }, 300)
        },
        /**
         * @name: 供应商搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchSupplierCode (value) {
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.providerList.length = 0
                this.getDataFun({
                    name: value
                }, path)
            }, 300)
        },
        /**
         * @name: 数据
         * @msg:
         * @param {type}
         * @return:
         */
        getDataFun (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    if (path === 'CustomerSupplierFindOption') {
                        this.providerList = data
                    } else if (path === 'PermissionsUserFindOption') {
                        this.customerLIst = data
                    }
                }
            })
        },
        /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            this.billsData = []
            if (code) {
                const res = await axios({
                    path: 'DistributionBillEntryFindEntry',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    console.log(data, '123456')
                    this.bt_id = data.id
                    this.orderId = data.code
                    this.tags = ['uncheck']
                    this.provider = data.provider
                    data.entryBy = `${data.entryBy}-${data.entryByName}`
                    data.provider = `${data.provider}-${data.providerName}`
                    data.entryMakeStoreCode = `${data.entryMakeStoreCode}-${data.entryMakeStoreName}`
                    data.makeStoreCode = `${data.makeStoreCode}-${data.makeStoreName}`
                    data.makeUserCode = `${data.makeUserCode}-${data.makeUserName}`
                    this.billsForm = data
                    if (data.billSource === 2) {
                        this.disabled = false
                    } else if (data.billSource === 1) {
                        this.disabled = true
                    }
                    if (res.data.list.length !== 0) {
                        this.clientVisible = true
                        const detail = await axios({
                            path: 'DistributionBillEntryFindEntryDetail',
                            method: 'post',
                            body: {
                                id: data.id
                            }
                        })
                        if (detail.flag === 1) {
                            this.billsData = [...detail.data]
                            this.taIndex(this.billsData)
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            } else {
                this.disabled = false
                this.billsForm = {}
                this.billsData = []
                this.orderId = ''
                this.tags = []
                this.loading = false
                this.clientVisible = true
                this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },
        submitData (e, sum) {
            // e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                // if (!this.form.getFieldValue('entryBy')) { return this.$message.warning('请选择验收人!') }
                if (!err) {
                    const formDate = { ...values }
                    formDate.billEntryDetails = [...this.billsData]
                    if (formDate.billEntryDetails.length === 0) {
                        this.loading = false
                        return this.$message.error('请选择明细,明细不能为空!')
                    }
                    formDate.entryMakeStoreCode = formDate.entryMakeStoreCode.split('-')[0]
                    formDate.makeStoreCode = formDate.makeStoreCode.split('-')[0]
                    formDate.makeUserCode = formDate.makeUserCode.split('-')[0]
                    formDate.provider = formDate.provider.split('-')[0]
                    formDate.entryBy = formDate.entryBy.split('-')[0]
                    // debugger
                    if (this.code) {
                        formDate.id = this.bt_id
                    } else {
                        formDate.billSource = 2
                    }
                    if (sum) { // 后台要求字段
                        formDate.submitAndAudit = 1
                    } else {
                        formDate.submitAndAudit = 4
                    }
                    this.loading = true
                    axios({
                        path: this.code ? 'DistributionBillEntryUpdateEntry' : 'DistributionBillEntryAddEntry',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            this.clientVisible = false
                        }
                    })
                } else {
                    // this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
        * @name: 添加商品打开弹窗
        */
        addManage () {
            console.log(this.form.getFieldValue('sourceCode'), '新增单据')
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            this.flagObj = {
                flagLength: this.billsData.length,
                sourceCode: this.form.getFieldValue('sourceCode'),
                url: true
            }
            this.pamsBounced.businessType = 'provider_contract_business_type:2'
            this.pamsBounced.provider = this.form.getFieldValue('provider')
            this.pamsBounced.storeCode = this.form.getFieldValue('makeStoreCode').split('-')[0]
            this.storeQuery = true
        },
        /**
           * @name: 删除
           */
        onDelete (del) {
            if (this.selectedRowKeys.length < 1) { return this.$message.warning('您尚未选中数据!') }
            const that = this
            this.$confirm({
                title: '删除',
                content: '是否确认删除当前选中信息?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    that.categoryinfoDelete(del)
                },
                onCancel () {

                }
            })
        },
        /**
        * @name:单据表格删除
        */
        categoryinfoDelete (del) {
            console.log(del, '单据删除')
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.skuCode !== del)
            }
            this.selectedRowKeys = []
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[key] = val
                this.billsData = newData
            }
        },
        /**
         * @name:监听供应商
         */
        providerChange (e) {
            console.log(e, '供应商')
            if (this.billsData.length === 0) {
                this.provider = e
            }
            if (this.billsData.length > 0) {
                const that = this
                that.$confirm({
                    title: '',
                    content: '当前操作将会清除明细,是否继续?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.form.setFieldsValue({ sourceCode: '' })
                        that.billsData = []
                        that.provider = e
                    },
                    onCancel () {
                        // that.billsForm.provider = that.provider
                        that.form.setFieldsValue({ provider: that.provider })
                        console.log(that.billsForm.provider, 55555555)
                    }
                })
            }
        },
        /**
         * @name:选中添加的商品
         */
        selectData (e) {
            console.log(e)
            const { objArr } = e
            // const { add, div } = this.$math
            this.form.setFieldsValue({ sourceCode: '' })
            if (e.obj === 'empty') {
                this.billsData = []
            }
            const error = []
            objArr.forEach(i => {
                const list = this.billsData.filter(o => o.skuCode === i.skuCode)
                if (list.length === 0) {
                    this.billsData.unshift({
                        detailId: i.id,
                        entryDetailType: 1,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        model: i.skuModel,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        basicUnit: i.skuUnit,
                        entryQtty: 1,
                        taxRate: i.skuTaxRate
                    })
                } else {
                    error.push(i.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.taIndex(this.billsData)
            console.log(this.billsData, 999999999)
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }
}
</script>

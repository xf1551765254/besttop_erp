<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-14 17:41:41
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-26 19:07:54
 -->
 <!-- 厂家样机入库 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      :title="title ? title : '编辑厂家样机入库申请单'"
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
                placeholder="请检索供应商"
                v-decorator="$check('bill_sample_entryA.provider', {initialValue:billsForm.provider})"
                :options="providerList"
                @change="providerChange"
                @search="priverSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_entryA.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索收货位置"
                v-decorator="$check('bill_sample_entryA.storeCode',{initialValue:billsForm.storeCode})"
                :options="distributionCenterArr"
                @search="LocationSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                v-decorator="$check('bill_sample_entryA.recDt',{initialValue:billsForm.recDt || postDate})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_sample_entryA.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">商品详情</h4>
        <a-button class="editable-add-btn" @click="addManage">选择商品</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="{x:1650,y:350}">
          <template v-for="col in ['recN', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'recN'"
                style="margin: -5px 0;width:100%;"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputStorageChange(e, record.id, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.id, col)"
              />
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.id)" okText="是" cancelText="否">
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
              <a-input v-decorator="$check('bill_sample_entryA.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_entryA.makeDt', {initialValue: billsForm.makeDt || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <Goods :visible.sync="userQuery" @onSelect="onUserSelect" :pams="userSet" multiple></Goods>
    </bt-modal>
  </div>
</template>
<script>
import Goods from '@pages/storage/FactoryPrototypeManagement/contractGoods/goods'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
    { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
    { title: '申请入库数量', dataIndex: 'recN', width: 100, align: 'right', scopedSlots: { customRender: 'recN' } },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'left' },
    { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
    { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    components: { BtModal, Goods },
    props: {
        title: {
            type: String,
            default: String
        },
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
                this.getData(this.code)
                console.log(val, '555555555555555555')
            }
        },
        clientVisible (val) {
            if (!val) {
                this.$emit('input', false)
                this.billsData = []
                this.billsForm = {}
                this.indexNumber = 1
            }
        }
    },
    data () {
        return {
            columns,
            bt_id: '',
            orderId: '',
            provider: '',
            tags: [],
            userSet: {},
            billsData: [],
            billsForm: {},
            providerList: [],
            selectedRowKeys: [],
            distributionCenterArr: [],
            loading: false,
            userQuery: false,
            clientVisible: false,
            postDate: moment(),
            form: this.$form.createForm(this),
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            indexNumber: 1
        }
    },
    methods: {
        /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            if (code) {
                const res = await axios({
                    path: 'SampleSampleEntryFindEntry',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    this.orderId = data.code
                    this.tags = ['uncheck']
                    this.bt_id = data.id
                    this.provider = data.provider
                    this.billsForm = { ...data }
                    this.billsForm.recDt = moment(data.recDt)
                    this.billsForm.storeCode = `${data.storeCode}-${data.storeName}`
                    this.billsForm.provider = `${data.provider}-${data.providerName}`
                    this.billsForm.makeStoreCode = `${data.makeStoreCode}-${data.makeStoreName}`
                    this.billsForm.makeUserno = `${data.makeUserno}-${data.makeUserName}`
                    console.log(this.billsForm, '666666666666666666')
                    if (res.data.list.length !== 0) {
                        this.clientVisible = true
                        const detail = await axios({
                            path: 'SampleSampleEntryFindEntryDetail',
                            method: 'post',
                            body: {
                                id: this.billsForm.id
                            }
                        })
                        if (detail.flag === 1) {
                            const data = detail.data
                            data.forEach(i => {
                                i.index = this.indexNumber++
                            })

                            this.billsData = data
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            } else {
                this.billsForm = {}
                this.billsData = []
                this.orderId = ''
                this.tags = []
                this.loading = false
                this.clientVisible = true
                this.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
                console.log('应该新增啊')
            }
        },
        /**
         * @name:保存单据
         */
        submitData (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = values
                    formDate.makeStoreCode = values.makeStoreCode.split('-')[0]
                    formDate.makeUserno = values.makeUserno.split('-')[0]
                    formDate.storeCode = values.storeCode.split('-')[0]
                    formDate.provider = values.provider.split('-')[0]
                    formDate.recDt = moment(formDate.recDt).format('YYYY-MM-DD hh:mm:ss')
                    formDate.billSampleEntryDetails = this.billsData
                    formDate.sourceType = 'allot_source_type:2'
                    if (formDate.billSampleEntryDetails.length === 0) {
                        return this.$message.error('请选择明细,明细不能为空!')
                    }
                    for (const i of formDate.billSampleEntryDetails) {
                        if (!i.recN) {
                            return this.$message.warning('当前提交入库数量不能为空!')
                        }
                    }
                    if (this.code) {
                        formDate.id = this.bt_id
                    }
                    this.loading = true
                    axios({
                        path: this.code ? 'SampleSampleEntryUpdateEntry' : 'SampleSampleEntryAddEntry',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.clientVisible = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 单据新增行
         */
        addManage () {
            console.log('新增单据')
            if (!this.form.getFieldValue('provider')) {
                return this.$message.warning('请选择供应商!')
            }
            if (!this.form.getFieldValue('storeCode')) {
                return this.$message.warning('请选择收货位置!')
            }
            this.userSet.provider = this.form.getFieldValue('provider').split('-')[0]
            this.userSet.storeCode = this.form.getFieldValue('storeCode').split('-')[0]
            this.userQuery = true
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
                        if (categoryinfoData[j].id === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.id !== del)
            }
            this.selectedRowKeys = []
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name:监听编辑
         */
        InputStorageChange (val, count, key) {
            if (!val) return
            console.log(val, count, key, '监听输入变化')
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                this.billsData = newData
            }
        },
        /**
         * @name:选中客户数据
         */
        async onUserSelect (e) {
            console.log(e, '添加')
            const error = []
            e.forEach(item => {
                item.recN = 1
                const list = this.billsData.filter(o => o.detailId === item.detailId)
                if (list.length === 0) {
                    item.index = this.indexNumber++
                    this.billsData.push(item)
                } else {
                    error.push(item.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
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
                        that.billsData = []
                        that.provider = e
                    },
                    onCancel () {
                        that.billsForm.provider = that.provider
                        that.form.setFieldsValue({ provider: that.provider })
                        console.log(that.billsForm.provider, 55555555)
                    }
                })
            }
        },
        priverSearch (e) {
            console.log(e, '555555555555555')
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'CustomerSupplierFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.providerList = [...data]
                    }
                })
            }, 300)
        },
        LocationSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    code: this.$store.getters.storeInfo.code,
                    condition: e,
                    status: '0',
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'OrganizationStoreFindStoreAndDirect',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.distributionCenterArr = [...data]
                    }
                })
            }, 300)
        }
    }
}
</script>

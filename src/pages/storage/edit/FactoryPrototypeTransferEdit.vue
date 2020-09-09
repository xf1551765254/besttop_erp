 <!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-12 09:15:26
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-26 15:04:02
 -->
<!-- 厂家样机调拨单 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      :title="title ? title : '编辑厂家样机调拨单'"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">调出位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索调出位置"
                @change="onChangeOutStoreCode"
                v-decorator="$check('bill_sample_allot.outStoreCode', {initialValue:billsForm.outStoreCode})"
                :options="dStoreCodeList"
                @search="LocationSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">调入位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索调入位置"
                v-decorator="$check('bill_sample_allot.inStoreCode', {initialValue:billsForm.inStoreCode})"
                :options="dStoreCodeList"
                @search="LocationSearch"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_allot.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索负责人"
                style="width: 100%"
                v-decorator="$check('bill_sample_allot.chargeUserno', {initialValue:billsForm.chargeUserno})"
                :options="customerLIst"
                @search="applicantSearch"
                showSearch/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_sample_allot.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
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
          :scroll="{x:1550,y:350}">
          <template v-for="col in ['qtty', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'qtty'"
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
              <a-input v-decorator="$check('bill_sample_allot.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code}:${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_sample_allot.makeDt', {initialValue: billsForm.makeDt || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <Goods :visible.sync="userQuery" @onSelect="onUserSelect" :pams="userSet" multiple></Goods>
    </bt-modal>
  </div>
</template>
<script>
import BtModal from '@comp/Modal'
import moment from 'moment'
import { axios } from '@/utils/request'
import Goods from '@pages/storage/FactoryPrototypeManagement/contractGoods/skuStock'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
    { title: '调拨数量', dataIndex: 'qtty', width: 80, align: 'right', scopedSlots: { customRender: 'qtty' } },
    { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
    { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80, align: 'left' },
    { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
    { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    components: {
        BtModal,
        Goods
    },
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
                this.billsForm = {}
                this.billsData = []
                this.indexNumber = 1
            }
        },
        outStoreCodeId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.outStoreCodeflag) {
                    if (this.billsData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.billsForm = {
                                    makeStoreCode: `${that.$store.getters.storeInfo.code}-${that.$store.getters.storeInfo.name}`
                                }
                                that.billsData = []
                            },
                            onCancel () {
                                console.log(oldval)
                                that.outStoreCodeId = oldval
                                that.form.setFieldsValue({ outStoreCode: oldval })
                            }
                        })
                    }
                }
                this.outStoreCodeflag = false
            }
        }
    },
    data () {
        return {
            columns,
            bt_id: '',
            orderId: '',
            tags: [],
            userSet: {},
            billsData: [],
            billsForm: {},
            customerLIst: [],
            dStoreCodeList: [],
            selectedRowKeys: [],
            loading: false,
            userQuery: false,
            clientVisible: false,
            form: this.$form.createForm(this),
            makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
            outStoreCodeId: '',
            outStoreCodeflag: false,
            indexNumber: 1
        }
    },
    methods: {
        onChangeOutStoreCode (e) {
            this.outStoreCodeflag = true
            this.outStoreCodeId = e
        },
        /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            if (code) {
                const res = await axios({
                    path: 'SampleAllotFind',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    this.bt_id = data.id
                    this.orderId = ''
                    this.tags = ['uncheck']
                    this.billsForm = { ...data }
                    this.billsForm.makeStoreCode = `${data.makeStoreCode}-${data.makeStoreName}`
                    this.billsForm.makeUserno = `${data.makeUserno}-${data.makeUserName}`
                    this.billsForm.outStoreCode = `${data.outStoreCode}-${data.outStoreName}`
                    this.billsForm.inStoreCode = `${data.inStoreCode}-${data.inStoreName}`
                    this.billsForm.chargeUserno = data.chargeUserno ? `${data.chargeUserno}-${data.chargeUserName}` : ''
                    this.outStoreCodeId = data.outStoreCode
                    console.log(this.billsForm, '666666666666666666')
                    if (res.data.list.length !== 0) {
                        this.clientVisible = true
                        const detail = await axios({
                            path: 'SampleAllotFindDetail',
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
                this.billsForm = {
                    chargeUserno: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
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
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = values
                    console.log(formDate)
                    formDate.makeStoreCode = values.makeStoreCode.split('-')[0]
                    formDate.makeUserno = values.makeUserno.split('-')[0]
                    formDate.outStoreCode = values.outStoreCode.split('-')[0]
                    formDate.inStoreCode = values.inStoreCode.split('-')[0]

                    formDate.chargeUserno = formDate.chargeUserno ? values.chargeUserno.split('-')[0] : ''
                    formDate.billSampleAllotDetails = this.billsData
                    if (formDate.billSampleAllotDetails.length === 0) {
                        this.loading = false
                        return this.$message.warning('请选择明细,明细不能为空!')
                    }
                    for (const i of formDate.billSampleAllotDetails) {
                        if (!i.qtty) {
                            this.loading = false
                            return this.$message.warning('当前提交调拨数量不能为空!')
                        }
                    }
                    if (this.code) {
                        formDate.id = this.bt_id
                    }
                    if (formDate.outStoreCode === formDate.inStoreCode) {
                        this.loading = false
                        return this.$message.warning('当前调出位置和调入位置不能相同!')
                    }
                    axios({
                        path: this.code ? 'SampleAllotUpdate' : 'SampleAllotAdd',
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
                    this.loading = false
                    this.$message.warning(Object.values(err)[0]['errors'][0]['message'])
                }
            })
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
         * @name:选中客户数据
         */
        async onUserSelect (e) {
            console.log(e, '添加')
            const warning = []
            e.forEach(item => {
                item.qtty = 1
                const list = this.billsData.filter(o => o.detailId === item.detailId)
                if (list.length === 0) {
                    item.index = this.indexNumber++
                    this.billsData.push(item)
                } else {
                    warning.push(item.skuName)
                }
            })
            if (warning.length > 0) {
                this.$notification.warning({
                    message: '提示',
                    description: `有${warning.length}项添加失败，${warning.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 单据新增行
         */
        addManage () {
            if (!this.form.getFieldValue('outStoreCode')) {
                return this.$message.warning('请选择调出位置!')
            }
            this.userSet.storeCode = this.form.getFieldValue('outStoreCode').split('-')[0]
            this.userQuery = true
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
                        this.dStoreCodeList = [...data]
                    }
                })
            }, 300)
        },
        applicantSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'PermissionsUserFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.customerLIst = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 下拉框
         */
        getAll () {
            // 获取退货人信息
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '负责人')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.customerLIst = [...data]
                }
            })
            // 获取调入店
            axios({
                path: 'OrganizationStoreFindStoreAndDirect',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code,
                    status: 0
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    const arr = []
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                        if (i.code !== this.$store.getters.storeInfo.code) {
                            arr.push(i)
                        }
                    })
                    this.dStoreCodeList = arr
                    console.log(this.dStoreCodeList, '调入店')
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>

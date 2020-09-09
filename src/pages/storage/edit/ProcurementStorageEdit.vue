<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-12 14:33:47
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-27 11:08:51
 -->
<!-- 采购入库 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      title="采购入库"
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
              <a-input
                style="width: 100%"
                v-decorator="$check('bill_entry.provider', {initialValue:billsForm.provider})"
                :disabled="true"
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
              <a-input v-decorator="$check('bill_entry.makeStoreCode',{initialValue:billsForm.makeStoreCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.entryMakeStoreCode',{initialValue:billsForm.entryMakeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">验货人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('bill_entry.entryBy', {initialValue:billsForm.entryBy})"
                :options="customerLIst"
                :filterOption="false"
                placeholder="请检索验货人"
                @search="handleSearchEntryBy"
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
        <a-button class="editable-add-btn" type="danger" @click="onDelete(-1)">删除</a-button>
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
                :max="Number(record.entryQttys)"
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
    </bt-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '订货未收量', dataIndex: 'entryQttys', width: 80, align: 'right' },
    { title: '入库数量', dataIndex: 'entryQtty', width: 80, align: 'right', scopedSlots: { customRender: 'entryQtty' } },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'skuModel', width: 300 },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
    { title: '品牌名称', dataIndex: 'brandName', width: 100 },
    { title: '单位', dataIndex: 'basicUnit', width: 50 },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    components: {
        BtModal
    },
    data () {
        return {
            columns,
            orderId: '',
            tags: [],
            billsForm: {},
            billsData: [],
            customerLIst: [],
            selectedRowKeys: [],
            loading: false,
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
                console.log(val, '7777777777')
                this.$emit('input', val)
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
        handleSearchEntryBy (value) {
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
                    this.customerLIst = data
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
                    path: 'DistributionBillEntryFindBillOrder',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    console.log(data, '1234567897')
                    this.orderId = data.code
                    this.tags = ['check']
                    this.billsForm = {
                        provider: `${data.noteA}-${data.noteName}`,
                        sourceCode: data.code,
                        entryMakeStoreCode: `${data.receiveStoreCode}-${data.receiveStoreCodeName}`,
                        makeUserCode: `${data.createBy}-${data.createName}`,
                        makeStoreCode: `${this.$store.getters.storeInfo.code}-${this.$store.getters.storeInfo.name}`,
                        makeTime: data.createTime,
                        orderDt: data.createTime,
                        orderBy: data.createBy,
                        orderMakeStoreCode: data.storeCode
                    }
                    if (res.data.list.length !== 0) {
                        this.clientVisible = true
                        const detail = await axios({
                            path: 'DistributionBillEntryFindBillOrderDetail',
                            method: 'post',
                            body: {
                                code: code
                            }
                        })
                        if (detail.flag === 1) {
                            for (const i of detail.data) {
                                i.entryQttys = this.$math.sub(i.orderQuantity, i.chargeQuantity, 0)
                                i.entryQtty = i.chargeQuantity
                                i.basicUnit = i.unit
                            }
                            this.billsData = [...detail.data]
                            this.taIndex(this.billsData)
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            }
        },
        /**
         * @name:提交
         */
        submitData (e, sum) {
            this.loading = true
            // e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = values
                    formDate.billEntryDetails = [...this.billsData]
                    if (formDate.billEntryDetails.length === 0) {
                        this.loading = false
                        return this.$message.error('明细不能为空!')
                    }
                    for (const i of formDate.billEntryDetails) {
                        i.priceIn = i.purchasePrice
                        i.taxRate = i.skuTaxRate
                    }
                    const { orderDt, orderBy, orderMakeStoreCode } = this.billsForm
                    formDate.entryMakeStoreCode = formDate.entryMakeStoreCode.split('-')[0]
                    formDate.makeStoreCode = formDate.makeStoreCode.split('-')[0]
                    formDate.makeUserCode = formDate.makeUserCode.split('-')[0]
                    formDate.provider = formDate.provider.split('-')[0]
                    formDate.billSource = 1
                    formDate.orderDt = orderDt
                    formDate.orderBy = orderBy
                    formDate.orderMakeStoreCode = orderMakeStoreCode
                    if (sum) {
                        formDate.submitAndAudit = 1
                    } else {
                        formDate.submitAndAudit = 4
                    }
                    axios({
                        path: 'DistributionBillEntryAddEntry',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            this.clientVisible = false
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
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

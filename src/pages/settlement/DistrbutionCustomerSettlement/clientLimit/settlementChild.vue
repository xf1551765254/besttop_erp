<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-04-23 15:18:41
 * @LastEditTime: 2019-08-27 15:15:25
 -->
<template>
  <div>
    <!-- 发票勾兑弹窗 -->
    <bt-modal
      v-model="btValue"
      title="分销结算单"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">渠道客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请选择渠道客户"
                v-decorator="$check('billWholesalePay.custNo', {initialValue:billsForm.custNo})"
                :options="clientList"
                @change="custChange"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">隶属公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billWholesalePay.storeCode',{initialValue:billsForm.storeCode || `${$store.getters.storeInfo.code} - ${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">分销金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('billWholesalePay.currentShouldAmount',{initialValue:billsForm.currentShouldAmount || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">折让金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('billWholesalePay.fee',{initialValue:billsForm.fee || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">实结金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                v-decorator="$check('billWholesalePay.currentPayAmount',{initialValue:billsForm.currentPayAmount || 0.00})"
                allowClear
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billWholesalePay.makeStoreCode', {initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code} - ${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billWholesalePay.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">分销结算单</h4>
        <a-button class="editable-add-btn" @click="addManage">选择分销结算</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="detailId"
          size="small"
          :loading="loading"
          :columns="columns"
          :dataSource="billsData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :pagination="false"
          :scroll="{x: 2550,y:350}">
          <template v-for="col in ['payPrice', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'payPrice'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                @change="e => InputStorageChange(e, record.detailId, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.detailId, col)"
              />
              <template v-else>{{ text }}</template>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.detailId)" okText="是" cancelText="否">
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
              <a-input v-decorator="$check('billWholesalePay.makeUserCode', {initialValue:billsForm.makeUserCode || `${$store.getters.userInfo.code} - ${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('billWholesalePay.makeTime', {initialValue: billsForm.makeTime || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <SelectiveDistribution ref="selectiveDistributionRef" :visible.sync="distributionQuery" @onSelect="onSelect" :pams="pams" multiple/>
    </bt-modal>
  </div>
</template>
<script>
import SelectiveDistribution from '@pages/settlement/DistrbutionCustomerSettlement/clientLimit/selectiveDistribution'
import { axios } from '@/utils/request'
import moment from 'moment'
import BtModal from '@comp/Modal'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '类型', dataIndex: 'typeName', width: 100, align: 'left' },
    { title: '源单据号', dataIndex: 'wholesaleCode', width: 150, align: 'left' },
    { title: '发生位置编码', dataIndex: 'storeCode', width: 200, align: 'left' },
    { title: '发生位置名称', dataIndex: 'storeName', width: 200, align: 'left' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'left' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'left' },
    { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
    { title: '单位', dataIndex: 'basicUnit', width: 100, align: 'left' },
    { title: '税率', dataIndex: 'taxRates', width: 150, align: 'right' },
    { title: '成本价', dataIndex: 'amountCost', width: 150, align: 'right' },
    { title: '分销价', dataIndex: 'wholesalePrice', width: 150, align: 'right' },
    { title: '结算数量', dataIndex: 'number', width: 150, align: 'right' },
    { title: '结算单价/折让价', dataIndex: 'payPrice', width: 250, align: 'right', scopedSlots: { customRender: 'payPrice' } },
    { title: '结算金额', dataIndex: 'amount', width: 150, align: 'right' },
    { title: '备注', dataIndex: 'note', width: 300, align: 'left', scopedSlots: { customRender: 'note' } },
    { title: '操作', dataIndex: 'operation', width: 100, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
]
export default {
    name: 'SettlementChild',
    components: { SelectiveDistribution, BtModal },
    props: {
        btsave: {
            type: Boolean,
            default: false
        },
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            tags: [],
            orderId: '',
            btValue: false,
            setLoading: false,
            bt_id: '',
            pams: {},
            // 表单数据
            billsForm: {},
            // 状态
            loading: false,
            submitLoading: false,
            distributionQuery: false,
            // 单据表头
            columns,
            // 单据表格表体
            billsData: [],
            // 渠道客户
            clientList: [],
            // 单据选中
            selectedRowKeys: [],
            // 表单
            form: this.$form.createForm(this),
            // 制单时间
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss'),
            indexNumber: 1
        }
    },
    watch: {
        value: {
            handler (val) {
                this.btValue = val
                console.log(this.btValue)
            },
            immediate: true
        },
        btValue (val) {
            this.$emit('input', val)
            this.billsData = []
            this.indexNumber = 1
            this.billsForm = {}
        }
    },

    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name:监听客户
         */
        custChange (e) {
            axios({
                path: 'WholesalePayFindNoAdd',
                method: 'post',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    custNo: e
                }
            })
        },
        /**
         * @name:清空数据
         */
        clearAll () {
            this.billsData = []
            this.billsForm = []
            this.orderId = ''
            this.tags = []
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            const obj = { ...e }
            this.orderId = obj.code
            this.tags = ['uncheck']
            this.bt_id = obj.id
            this.bt_Save = true
            obj.makeUserCode = `${obj.makeUserCode}-${obj.makeUserName}`
            obj.makeStoreCode = `${obj.makeStoreCode}-${obj.makeStoreName}`
            obj.storeCode = `${obj.storeCode}-${obj.storeName}`

            this.billsForm = obj
            axios({
                path: 'WholesalePayFindDetail',
                method: 'post',
                body: {
                    id: obj.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '编辑获取表格')
                    for (const i of res.data.list) {
                        i.index = this.indexNumber++
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.Bool = false
                        i.amount = `￥${i.amount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    this.billsData = res.data.list
                }
            })
        },
        /**
         * @name: 计算总计:
         */
        totalizator () {
            const { sub, add } = this.$math
            const amount = []
            const fee = []
            this.billsData.forEach(obj => {
                amount.push(obj.amount.replace(/\￥\s?|(,*)/g, ''))
                const strAmount = amount.reduce((prev, cur) => {
                    return add(prev, cur, 2)
                }, 0)
                if (obj.type === 'bill_wholesale_pay_detail_type:2') {
                    fee.push(obj.amount.replace(/\￥\s?|(,*)/g, ''))
                }
                const strFee = fee.reduce((prev, cur) => {
                    return add(prev, cur, 2)
                }, 0)
                const currentPayAmounts = sub(strAmount, strFee)
                this.form.setFieldsValue({
                    currentShouldAmount: strAmount,
                    fee: strFee,
                    currentPayAmount: currentPayAmounts
                })
            })
        },
        /**
         * @name:监听表格编辑
         */
        InputStorageChange (val, count, key) {
            console.log(val)
            const { mul } = this.$math
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.detailId)[0]
            if (target) {
                target[key] = val
                const str = mul(target['number'], target['payPrice'])
                target.amount = '￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.totalizator()
                this.billsData = newData
            }
        },
        /**
         * @name:选中数据
         */
        onSelect (e) {
            console.log(e, 55555555)
            if (this.billsData.length > 0) {
                e.forEach(i => {
                    for (const j in this.billsData) {
                        if (i.detailId === this.billsData[j].detailId) {
                            console.log(i, this.billsData[j])
                            this.billsData.splice(j, 1)
                        }
                    }
                    i.index = this.indexNumber++
                    this.billsData.push(i)
                })
            } else {
                e.index = this.indexNumber++
                this.billsData.push(...e)
            }
            this.totalizator()
        },
        /**
         * @name:提交
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.billWholesalePayDetails = [...this.billsData]
                    formDate.billWholesalePayDetails.forEach(o => {
                        o.amount = o.amount.replace(/\￥\s?|(,*)/g, '')
                    })
                    if (formDate.billWholesalePayDetails.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                        formDate.makeUserCode = formDate.makeUserCode.split('-')[0]
                        formDate.makeStoreCode = formDate.makeStoreCode.split('-')[0]
                        formDate.storeCode = formDate.storeCode.split('-')[0]
                    } else {
                        formDate.makeStoreCode = this.$store.getters.storeInfo.code
                        formDate.makeUserCode = this.$store.getters.userInfo.code
                        formDate.storeCode = this.$store.getters.storeInfo.code
                    }
                    axios({
                        path: this.bt_Save ? 'WholesalePayUpdate' : 'WholesalePayAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.billsData = []
                            this.btValue = false
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:分销结算按钮
         */
        addManage () {
            const str = this.form.getFieldsValue().custNo
            if (!str) {
                this.$message.warning('请先选择客户!')
            } else {
                this.pams.custNo = str
                const arr = []
                if (this.billsData.length > 0) {
                    this.billsData.forEach(e => {
                        arr.push(e.detailId)
                    })
                    console.log(arr, '单据选中')
                    // 传入选中明细
                    // this.$refs.selectiveDistributionRef.onSelectChange(arr)
                }
                // 传入查询时间
                this.$refs.selectiveDistributionRef.seach(moment().subtract(1, 'days'), arr, this.billsData)
                this.distributionQuery = true
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
                        if (categoryinfoData[j].detailId === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.detailId !== del)
            }
            if (this.billsData.length === 0) {
                this.selectedRowKeys = []
            }
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            this.selectedRowKeys = []
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name:下拉框
         */
        getAll () {
            this.makeTime = moment().format('YYYY-MM-DD hh:mm:ss')
            // 渠道客户
            axios({
                path: 'CustomerDistributorsFindInfoBySelected',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    res.data.list.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.clientList = res.data.list
                }
            })
        }
    }
}
</script>

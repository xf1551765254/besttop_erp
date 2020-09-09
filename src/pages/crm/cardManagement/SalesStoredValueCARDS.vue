<!--
 * @Description: 储值卡销售
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-21 18:42:03
 * @LastEditors: lin
 * @LastEditTime: 2019-08-28 16:30:16
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
    </seachbox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onSelect">
    </newtable>
    <!-- 新增  -->
    <bt-modal
      title="卡销售"
      v-model="AddModal"
      :subBtn="false" >
      <a-row>
        <a-col :span="12" >
          <div v-if="customer.telephone">
            {{ `${customer.name}-${customer.telephone}` }}
          </div>
        </a-col>
        <a-col :span="12">
          <div>
            <a-row type="flex" justify="end">
              <a-col :span="7" style="text-align:right"><a-button type="primary" @click="addCustomerModal=true">添加顾客</a-button></a-col>
              <a-col :span="16" style="margin-left:10px">
                <a-input-search
                  placeholder="请输入顾客姓名/手机号"
                  @search="onSearch"/>
              </a-col>

            </a-row>
          </div>
        </a-col>
      </a-row>
      <!-- 添加顾客 -->
      <addCustomer :visible.sync="addCustomerModal" @onClose="getCustomerData"></addCustomer>
      <!-- 储值信息 -->
      <div :style="cenetrStyle" class="listData">
        <div style="width:28%;padding-right:10px;height:100%" class="left">
          <div style="height:100%" class="leftList">
            <a-row class="titleSet" style="padding:5px">储值记录</a-row>
            <div style="padding:5px;width:100%" >
              <a-table
                rowKey="id"
                size="small"
                :columns="storeColumns"
                :dataSource="RecordStoredValueData">
              </a-table>
            </div>
          </div>
        </div>
        <div style="width:72%;height:100%" class="right">
          <a-form :form="form">
            <a-row class="titleSet" style="">选择规则</a-row>
            <a-row>
              <a-col :span="4">规则：</a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-select
                    style="width: 100%"
                    placeholder="请选择储值规则"
                    v-model="formData.amountRule"
                    :options="amountRuleArr"
                    @search="handleAmountRuleDorpArr"
                    @select="amountRuleChange"
                    @change="amountRuleValueChange"
                    showSearch
                    allowClear>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row class="titleSet">输入金额</a-row>
            <a-row>
              <a-col :span="4">支付金额：</a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-input-number
                    style="width:100%"
                    :main="0"
                    :max="Number.MAX_SAEF_INTEGER"
                    v-model="formData.payAmount"
                    :disabled="isChangePayAmount"
                    :precision="2"
                    @change="changePayAmount"
                    placeholder="请输入支付金额" >
                  </a-input-number>
                </a-form-item>
              </a-col>
              <a-col :span="4">充值金额：</a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-input-number
                    style="width:100%"
                    :main="0"
                    :max="Number.MAX_SAEF_INTEGER"
                    v-model="formData.amount"
                    :disabled="isChangeAmount"
                    :precision="2"
                    placeholder="请输入充值金额" >
                  </a-input-number>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="text-align:right">
              <a-button @click="handerRulesConfirm">储值确认</a-button>
            </a-row>
          </a-form>
        </div>
      </div>
    </bt-modal>
    <!-- 刷卡弹窗 -->
    <a-modal
      title="刷卡确认"
      v-model="cardModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="400" >
      <template slot="footer">
        <a-button key="back" @click="cardModal=false">关闭</a-button>
      </template>
      <div>
        储值金额（元）：{{ Number(formData.amount).toFixed(2) }}
      </div>
      <div>
        <div style="font-size:16px;text-align:center">
          <p style="">等待写入，请刷卡</p>
          <a-button size="small" :loading="bruchSubLoading" @click="doRriteCard">{{ bruchSubLoading?'正在刷卡':'开始刷卡' }}</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import addCustomer from './component/addCustomer'
import BtModal from '@comp/Modal'
import moment from 'moment'
import map from 'lodash.map'
import card from '@/utils/card'
import { axios } from '@/utils/request'
export default {
    components: { SeachBox, NewTable, BtModal, addCustomer },
    name: 'SalesStoredValueCARDS',
    data () {
        return {
            cenetrStyle: {
                widght: this.$store.getters.windowWidth + 'px',
                height: this.$store.getters.windowHeight * 0.68 + 'px'
            },
            conditions: [
                {
                    key: 'cardRuleName',
                    type: 'select',
                    title: '储值规则',
                    label: 'name',
                    value: 'code',
                    filter: true,
                    path: 'CardRuleQueryCardRules'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '销售开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '销售结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'customerPhone',
                    type: 'input',
                    title: '顾客'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '销售人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }

            ],
            btns: ['add', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            tableCode: '', // id
            tableApiPath: '', // path
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // 新增
            AddModal: false,
            customer: {
                code: '',
                name: '',
                telephone: ''
            },
            // 添加顾客
            addCustomerModal: false,

            // 确认储值
            form: this.$form.createForm(this),
            formData: {
                amountRule: undefined,
                amount: '',
                payAmount: ''
            },
            isChangeAmount: false,
            isChangePayAmount: false,
            valueRuleDate: {},
            // 刷卡
            cardModal: false,
            bruchSubLoading: false,

            // 储值记录
            storeColumns: [
                { title: '储值卡号', dataIndex: 'cardNo', align: 'center' },
                { title: '支付金额', dataIndex: 'payAmount', align: 'center' }
            ],
            RecordStoredValueData: [],

            // 下拉框
            amountRuleArr: []
        }
    },
    computed: { },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '858c5ad020db4a14aed86d65e0cff6db:SalesStoredValueCARDS'
            this.tableApiPath = 'CardSaleQueryList'
        })
    },
    methods: {
        /**
       * @name: // 表格数据搜索
       */
        onSeach (e) {
            e.path = 'CardSaleQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
       * @name: 清空按钮
       */
        onReload () {
            this.seachValue = {}
        },
        /**
        * @name: 工具栏功能按键
        */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('CardSaleQueryList')
            } else if (e === 'add') {
                this.addHandler()
            }
        },
        /**
        * @name: 刷新表格
        */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardSaleQueryList' })
        },
        /**
        * @name: 表格的多选
       */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
       * @name: 新增
       */
        addHandler () {
            this.AddModal = true
            this.isChangeAmount = false
            this.isChangePayAmount = false
            this.formData.amount = ''
            this.formData.payAmount = ''
            this.RecordStoredValueData = []
            this.formData.amountRule = undefined
            for (const i in this.valueRuleDate) {
                delete this.valueRuleDate[i]
            }
        },
        /**
       * @name: 查询顾客
      */
        onSearch (value) {
            axios({
                path: 'CustomerUserQueryByTelAndName',
                method: 'post',
                body: {
                    telephone: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.length > 0) {
                        const data = res.data[0]
                        this.customer.code = data.code
                        this.customer.name = data.name
                        this.customer.telephone = data.telephone
                    } else {
                        this.customer.code = ''
                        this.customer.name = ''
                        this.customer.telephone = ''
                    }
                }
            })
        },
        /**
       * @name: 添加顾客
       */
        getCustomerData (data) {
            console.log(data)
            this.customer.code = data.code
            this.customer.name = data.name
            this.customer.telephone = data.telephone
        },
        /**
         * @name: 规则值选择
         */
        amountRuleChange (value) {
            if (value) {
                const obj = this.amountRuleArr.filter(o => value === o.code)[0]
                console.log(obj)
                if (obj) {
                    this.valueRuleDate = { ...obj }
                    if (obj.modifyFlag === 1) {
                        this.isChangePayAmount = false
                        this.isChangeAmount = true
                    } else {
                        this.isChangePayAmount = true
                        this.isChangeAmount = true
                    }
                    this.formData.payAmount = obj.payAmount
                    this.formData.amount = obj.amount
                }
            }
        },
        /**
         * @name: 规则值变化
         */
        amountRuleValueChange (value) {
            if (!value) {
                this.isChangePayAmount = false
                this.isChangeAmount = false
                this.formData.amount = ''
                this.formData.payAmount = ''
                for (const i in this.valueRuleDate) {
                    delete this.valueRuleDate[i]
                }
            }
        },
        /**
         * @name: 支付金额值变化
         */
        changePayAmount (value) {
            console.log(value)
            const { add, mul, div } = this.$math
            const obj = { ...this.valueRuleDate }
            if (value) {
                if (obj.type === '1') {
                    this.formData.amount = add(value, obj.sendValue, 2)
                } else {
                    this.formData.amount = mul(100, div(value, obj.sendValue, 2), 2)
                }
            } else if (value === 0) {
                if (obj.type === '1') {
                    this.formData.amount = add(value, obj.sendValue, 2)
                } else {
                    this.formData.amount = 0.00
                }
            }
        },
        /**
         * @name: 储值确认按钮
         */
        handerRulesConfirm () {
            console.log(this.formData.amount)
            if (!this.formData.amount) {
                return this.$message.warning('请确认储值金额')
            }
            this.cardModal = true
        },
        /**
         * @name: 确认储值
         */
        rulesSubmit (val) {
            const obj = {
                customerPhone: this.customer.telephone,
                customerName: this.customer.name,
                customerCode: this.customer.code,
                payAmount: this.formData.payAmount,
                totalAmount: this.formData.amount,
                magneticStripe: val
            }
            axios({
                path: 'CardSaleAddRecord',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    const data = { ...res.data }
                    this.RecordStoredValueData.push(data)
                }
            })
        },
        /**
         * @name: 开始刷卡
         */
        doRriteCard () {
            this.bruchSubLoading = true
            const self = this
            // values.magneticStripe = cardId
            card.onRead((res, err) => {
                console.log('123', res, err)
                self.bruchSubLoading = false
                if (!err) {
                    const val = res
                    self.$confirm({
                        title: '提示',
                        content: '刷卡成功！是否确认储值',
                        onOk () {
                            self.rulesSubmit(val)
                        }
                    })
                    self.cardModal = false
                } else {
                    this.$message.error('刷卡失败')
                }
                card.readStop()
            })
        },
        /**
         * @name: 规则搜索
         */
        handleAmountRuleDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.amountRuleArr.length = 0
                this.getAmountRuleDorpArr(value)
            }, 300)
        },
        /**
         * @name: 规则
         */
        getAmountRuleDorpArr (value) {
            axios({
                path: 'CardRuleQueryCardRules',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    code: value,
                    status: 'card_rule_status:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.amountRuleArr = dataArr
                }
            })
        }
    },
    watch: {
        'seachValue.startTime' (val, oldVal) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val, oldVal) {
            if (val && this.seachValue.startTime) {
                if (moment(val).isBefore(this.seachValue.startTime)) {
                    this.seachValue.startTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.listData{
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    .left{
        color: #101010;
        overflow-y: auto;
        .leftList{
            border:1px solid #e8e8e8;
            // box-shadow: 0px 0px 5px #888888;
            // -webkit-box-shadow: 0px 0px 5px #888888;
        }
    }
    .titleSet{
      font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
    }

}
</style>

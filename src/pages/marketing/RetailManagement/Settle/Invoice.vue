<!--
 * @Description: 顾客税票信息列表
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-09 15:55:52
 * @LastEditors: haile
 * @LastEditTime: 2019-08-19 17:41:25
 -->
<template>
  <div class="invoice-box">
    <a-modal
      :title="invoiceList.taxTitle"
      v-model="invoiceList.taxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="9999"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button key="back" @click="invoiceListClose">关闭</a-button>
        <a-button key="submit" type="primary" @click.stop="addEditTax(-1)">
          新增发票
        </a-button>
      </template>
      <div>
        <a-collapse accordion v-if="customerTaxInfo.length > 0">
          <a-collapse-panel v-for="(item,index) in customerTaxInfo" :key="index">
            <template slot="header">
              <a-row>
                <a-col :span="6">{{ item.invoiceName }}</a-col>
                <a-col :span="4" :offset="14" class="taxOptions">
                  <a href="#" @click="toPrintInvoice(item)">打印</a>
                  <a href="#" @click.stop="addEditTax(0, item)">编辑</a>
                  <a href="#" @click.stop="delTaxInfo(item.id)">删除</a>
                </a-col>
              </a-row>
            </template>
            <div v-if="item.type===2">
              <p>发票抬头：{{ item.invoiceName }}</p>
              <p>纳税人识别号：{{ item.invoiceCode }}</p>
              <p>地址：{{ item.address }}</p>
              <p>电话号码：{{ item.telephone }}</p>
              <p>开户行名称：{{ item.bankName }}</p>
              <p>开户行账号：{{ item.bankCode }}</p>
            </div>
            <div v-else>
              <p>发票抬头：{{ item.invoiceName }}</p>
              <p>电话号码：{{ item.telephone }}</p>
              <p>地址：{{ item.address }}</p>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <div v-else>
          暂无发票信息
        </div>
      </div>
    </a-modal>
    <a-modal
      :title="addEdit.addEditTaxTitle"
      v-model="addEdit.addEditTaxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10000"
      class="doc"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button @click="addEditTaxCancel">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="addEditTaxSubmit">
          确定
        </a-button>
      </template>
      <a-form :form="taxForm">
        <a-row class="doc">
          <a-col :span="4">税票类型:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-model="radioValue">
                <a-radio :value="2">公司</a-radio>
                <a-radio :value="1">个人</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">发票抬头:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入发票抬头" v-decorator="$check('customer.invoiceName',{initialValue:addEditTaxInfo.invoiceName || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">纳税人识别号:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入纳税人识别号" v-decorator="$check('customer.invoiceCode',{initialValue:addEditTaxInfo.invoiceCode || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">电话号码:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入电话号码" v-decorator="$check('customer.telephone',{initialValue:addEditTaxInfo.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">开户行名称:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入开户行名称" v-decorator="$check('customer.bankName',{initialValue:addEditTaxInfo.bankName || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">开户行账号:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入开户行账号" v-decorator="$check('customer.bankCode',{initialValue:addEditTaxInfo.bankCode || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="radioValue===2?8:20">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('customer.address',{initialValue:addEditTaxInfo.address || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="发票打印"
      v-model="invoiceModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10001"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box" >
        <div style="margin-top:80px">
          <Invoicetpl :invoiceList="returnInvoiceInfo"></Invoicetpl>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import { lowToUp } from '@utils/util'
import print from 'print-js'
import jrQrcode from 'jr-qrcode'
import Invoicetpl from '../components/Invoicetpl'
export default {
    name: 'Invoice',
    components: {
        Invoicetpl
    },
    props: {
        customerInfo: {
            type: Object,
            default: () => {}
        },
        openFlag: {
            type: Boolean,
            default: false
        },
        orderIds: {
            type: Array,
            default: () => []
        },
        operationType: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            invoiceList: {
                taxTitle: '',
                taxModal: false
            },
            addEdit: {
                addEditTaxTitle: '',
                addEditTaxModal: false
            },
            addEditTaxInfo: {},
            taxForm: this.$form.createForm(this),
            isAdd: false,
            loading: false,
            radioValue: 0,
            customerTaxInfo: [],
            invoiceModal: false,
            returnInvoiceInfo: []
        }
    },
    methods: {
        addEditTaxCancel () {
            this.addEdit.addEditTaxModal = false
            this.$emit('setOpenFlag', false)
        },
        addEditTaxSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { taxForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.addEditTaxInfo.id
                    }
                    values.type = this.radioValue
                    values.customerCode = this.customerInfo.customerCode
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerInvoice' : 'CustomerManageUpdateCustomerInvoice',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEdit.addEditTaxModal = false
                            this.queryInvoiceList()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        delTaxInfo (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                zIndex: 9999,
                onOk () {
                    axios({
                        path: 'CustomerManageDelCustomerInvoice',
                        method: 'post',
                        body: {
                            id: id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.queryInvoiceList()
                        }
                    })
                }
            })
        },
        queryInvoiceList () {
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerCode: this.customerInfo.customerCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.customerTaxInfo = res.data
                        this.taxModal = true
                    } else {
                        this.customerTaxInfo = []
                    }
                }
            })
        },
        async toPrintInvoice (invoiceInfo) {
            await this.queryInvoiceInfo(invoiceInfo)
        },
        async queryInvoiceInfo (invoiceInfo) {
            const res = await axios({
                path: 'NuonuoInvoiceRequestBilling',
                method: 'post',
                body: {
                    orderIds: this.orderIds,
                    invoiceType: 1,
                    operationType: this.operationType,
                    customerInvoiceInfo: invoiceInfo
                }
            })
            if (res.flag === 1) {
                const data = res.data
                data.forEach(item => {
                    item.orderInfo.upActualPrice = lowToUp(item.orderInfo.actualPay)
                    item.src = jrQrcode.getQrBase64(`http://nnfp.jss.com.cn/invoice/scan/k0.action?id=${item.invoiceSerialNum}`, {
                        width: 100,
                        height: 100
                    })
                })
                this.returnInvoiceInfo = [...data]
                this.invoiceModal = true
                console.log('查询到的发票信息', this.returnInvoiceInfo)
            }
        },
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        invoiceListClose () {
            this.invoiceList.addEditTaxModal = false
            this.$emit('setOpenFlag', false)
        },
        printTicketCancel () {
            this.invoiceModal = false
            this.$emit('setOpenFlag', false)
        }
    },
    watch: {
        openFlag (val) {
            console.log('*************', val)
            this.invoiceList.taxModal = val
            if (val) {
                console.log('*************', this.customerInfo)
                this.queryInvoiceList()
                this.invoiceList.taxTitle = this.customerInfo.customerName + '的税票信息'
            }
        }
    }
}
</script>

<style lang="less" scoped>
.taxOptions {
  a{
    text-decoration: none;
    margin-left: 10px;
  }
}
</style>

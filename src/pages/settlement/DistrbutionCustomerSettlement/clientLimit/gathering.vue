<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-06-24 17:57:27
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="客户收款选择"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row class="doc">
          <a-col :span="4">付款截止日期</a-col>
          <a-col :span="20">
            <a-date-picker
              style="width: 100%"
              :disabledDate="signDtDisabledDate"
              :defaultValue="byTime"
              @change="seach"
              allowClear/>
          </a-col>
        </a-row>
        <a-row style="margin-top:10px;">
          <a-table
            rowKey="id"
            :scroll="{x:1350}"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
            :columns="columns"
            :dataSource="dataSource"
            size="small"
            bordered>
            <template slot="footer">
              <h3 style="display:inline;">总计：</h3>
              <span style="margin-left:30px">收款数量：</span>
              <span>{{ receiptNumber }}</span>
              <span style="margin-left:100px">收款价格/折让：</span>
              <span>{{ sumChangeM(receivingThePrice) }}</span>
              <span style="margin-left:100px">收款金额：</span>
              <span>{{ sumChangeM(receivableAmount) }}</span>
            </template>
          </a-table>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small">选择</a-button>
      </div>
      </a-spin></a-modal>
  </div>
</template>
<style lang="less" scoped>
    @import "../../../../assets/modalStyle.less";
</style>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
import moment from 'moment'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '类型', dataIndex: 'wholesaleTypeName', width: 100 },
                { title: '源单据号', dataIndex: 'wholesaleCode', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 150 },
                { title: '单位', dataIndex: 'basicUnit', width: 100 },
                { title: '税率', dataIndex: 'taxRates', width: 100 },
                { title: '收款数量', dataIndex: 'numbers', width: 100 },
                { title: '收款价格/折让', dataIndex: 'unitPrice', width: 200 },
                { title: '收款金额', dataIndex: 'amountPay', width: 100 },
                { title: '审核时间', dataIndex: 'auditTime', width: 200 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            byTime: {},
            reserveByTime: {},
            receiptNumber: '0.00',
            receivingThePrice: '0.00',
            receivableAmount: '0.00'

        }
    },
    mounted () {
        this.byTime = this.signDtDefaultValue
    },
    computed: {

        signDtDefaultValue () {
            return moment().subtract(1, 'days')
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isAfter()
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            this.reserveByTime = e
            if (e.target === undefined) {
                this.reserveByTime = e
            } else {
                this.reserveByTime = moment()
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    closeTime: moment(e).format('YYYY-MM-DD')
                })
            }, 300)
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.id, this.selectedRowKeys))
            console.log('确认选择', this.reserveByTime)
            const Obj = {
                time: this.reserveByTime,
                arr: selectDatas
            }
            if (selectDatas.length > 0) {
                console.log(selectDatas, '选中')
                this.$emit('onSelect', Obj)
                this.selectedRowKeys.length = 0
            }
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}) {
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'BillReceivablesAddFindDetail',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res, '弹框数据')
                    const arr = res.data
                    arr.forEach(i => {
                        i.taxRates = this.rateTransform(i.taxRate)
                        i.unitPrice = this.sumChangeM(i.unitPrice)
                        i.amountPay = this.sumChangeM(i.amountPay)
                    })
                    this.dataSource = res.data
                    this.total(this.dataSource)
                }
            })
        },
        total (data) {
            const { add } = this.$math
            const receiptNumberArr = []// 收款数量
            const receivingThePriceArr = []// 收款价格
            const receivableAmountArr = []// 收款金额
            for (const item of data) {
                receiptNumberArr.push(item.numbers)
                receivingThePriceArr.push(this.sumChangeS(item.unitPrice))
                receivableAmountArr.push(this.sumChangeS(item.amountPay))
            }
            this.receiptNumber = receiptNumberArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.receivingThePrice = receivingThePriceArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.receivableAmount = receivableAmountArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-04-23 17:32:16
 * @LastEditTime: 2019-05-17 14:01:09
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择分销单结算"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-row>
        <a-col :span="24">
          截止日期:<a-date-picker :defaultValue="defaultValue" :disabledDate="signDtDisabledDate" @change="seachReat"></a-date-picker>
        </a-col>
      </a-row>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination="{defaultPageSize:5}"
        :dataSource="blendData"
        :columns="columns"
        :loading="loading"
        rowKey="id"
        :scroll="{x: 2500}"
        size="small"
        bordered>
        <template v-for="col in ['number', 'payPrice']" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input-number
              v-if="record.Bool && col === 'number'"
              style="margin: -5px 0;width:100%;"
              :min="0"
              :max="Number.MAX_SAFE_INTEGER"
              :step="1"
              :value="text"
              @change="e => InputStorageChange(e, record.id, col)" />
            <a-input-number
              v-else-if="record.Bool && col === 'payPrice'"
              style="margin: -5px 0;width:100%;"
              :min="0"
              :max="Number.MAX_SAFE_INTEGER"
              :step="1"
              :precision="2"
              :value="text"
              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
              @change="e => InputStorageChange(e, record.id, col)" />
            <template v-else>{{ text }}</template>
          </div>
        </template>
        <template slot="footer">
          <h3 style="display:inline;">总计：</h3>
          <span style="margin-left:120px">结算数量:</span>
          <span>{{ numbers }}</span>
          <span style="margin-left:120px">结算金额:</span>
          <span>{{ amounts }}</span>
        </template>
      </a-table>
      <div slot="footer">
        <a-button @click="() => {$emit('update:visible', false)}" size="small" >取消</a-button>
        <a-button v-if="!isOk" @click="Submit" type="primary" size="small" >确认</a-button>
        <a-popconfirm v-if="isOk" title="明细中已存在选中数据,是否替换为当前选中?" @confirm="Submit" okText="是" cancelText="否">

          <a-button size="small" type="primary">确认</a-button>
        </a-popconfirm>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import moment from 'moment'
import is from 'is_js'
const columns = [
    { title: '类型', dataIndex: 'typeName', width: 100, align: 'center' },
    { title: '源单据号', dataIndex: 'wholesaleCode', width: 100, align: 'center' },
    { title: '发生位置编码', dataIndex: 'storeCode', width: 150, align: 'center' },
    { title: '发生位置名称', dataIndex: 'storeName', width: 150, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 100, align: 'center' },
    { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
    { title: '单位', dataIndex: 'basicUnit', width: 100, align: 'center' },
    { title: '税率', dataIndex: 'taxRates', width: 150, align: 'center' },
    { title: '成本价', dataIndex: 'amountCost', width: 150, align: 'center' },
    { title: '分销价', dataIndex: 'wholesalePrice', width: 150, align: 'center' },
    { title: '未结算数量', dataIndex: 'noNumber', width: 150, align: 'center' },
    { title: '结算数量', dataIndex: 'number', width: 150, align: 'center', scopedSlots: { customRender: 'number' } },
    { title: '结算单价/折让价', dataIndex: 'payPrice', width: 150, align: 'center', scopedSlots: { customRender: 'payPrice' } },
    { title: '结算金额', dataIndex: 'amount', width: 150, align: 'center' },
    { title: '备注', dataIndex: 'note', width: 200, align: 'center' }
]
export default {
    name: 'SelectiveDistribution',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        multiple: {
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
            isOk: false,
            // 状态
            loading: false,
            numbers: 0,
            amounts: 0,
            blendData: [],
            columns,
            // 多选选中数据
            selectedRowKeys: [],
            // 默认截止日期
            defaultValue: moment().subtract(1, 'days')
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 确认选中
         */
        Submit () {
            const selectDatas = this.blendData.filter(o => is.inArray(o.id, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                selectDatas.forEach(o => {
                    o.detailId = o.id
                })
                this.isOk = false
                this.$emit('onSelect', selectDatas)
                this.$emit('update:visible', false)
                this.selectedRowKeys.length = 0
            } else {
                this.$message.error('未选中数据!')
            }
        },
        /**
         * @name:监听入库单表格编辑
         */
        InputStorageChange (val, count, key) {
            console.log(val)
            if (!val || is.not.number(val)) return
            const newData = [...this.blendData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                if (key === 'number' && val > target.noNumber) {
                    target['number'] = 0
                    this.$message.warning('结算数不能大于未结算数!')
                }
                this.onPitch(target)
                this.totalizator()
                // this.totalizator()
                this.blendData = newData
            }
        },
        /**
         * @name: 监听选中
         */
        onSelectChange (e) {
            this.selectedRowKeys = e
            this.blendData.forEach(i => {
                if (!is.inArray(i.id, this.selectedRowKeys)) {
                    if (i.type === 'bill_wholesale_pay_detail_type:1') {
                        i.payPrice = i.wholesalePrice
                    }
                    i.number = 0
                    i.amount = '￥' + 0
                    i.Bool = false
                } else {
                    console.log(i, '选中')
                    if (!i.number) {
                        i.number = i.noNumber
                    }
                    i.Bool = true
                    this.onPitch(i)
                }
            })
            const arr = this.tableData.filter(o => is.inArray(o.detailId, this.selectedRowKeys))
            if (arr.length > 0) {
                this.isOk = true
            } else {
                this.isOk = false
            }
            this.totalizator()
        },
        /**
         * @name: 选中计算行内数据
         */
        onPitch (obj) {
            const { mul } = this.$math
            if (obj.number && obj.payPrice) {
                const str = mul(obj.number, obj.payPrice)
                obj.amount = '￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
        },
        /**
         * @name: 计算总计:
         */
        totalizator () {
            const { add } = this.$math
            const arr = []
            const amount = []
            if (this.selectedRowKeys.length > 0) {
                this.blendData.forEach(obj => {
                    arr.push(obj.number)
                    amount.push(obj.amount.replace(/\￥\s?|(,*)/g, ''))
                    const strAmount = amount.reduce((prev, cur) => {
                        return add(prev, cur, 2)
                    }, 0)
                    const str = arr.reduce((prev, cur) => {
                        return add(prev, cur, 2)
                    }, 0)
                    console.log(amount, strAmount, '总计')
                    this.amounts = '￥' + strAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    this.numbers = '￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                })
            } else {
                this.amounts = '￥' + 0
                this.numbers = 0
            }
        },
        /**
         * @name:查询
         */
        async seach (e, arr, table) {
            this.tableData = table
            this.loading = true
            const pams = {
                storeCode: this.$store.getters.storeInfo.code,
                custNo: this.$props.pams.custNo,
                closeTime: e.format('YYYY-MM-DD')
            }
            console.log(pams)
            // 获取分销单表格
            const res = await axios({
                path: 'WholesalePayFindConsignmentAndDiscount',
                method: 'post',
                body: pams
            })
            if (res.flag === 1) {
                this.loading = false
                console.log(res.data, '55555555555555555555555555555555555555555')
                res.data.forEach(i => {
                    i.taxRates = this.rateTransform(i.taxRate)
                    if (table.length > 0) {
                        table.forEach(j => {
                            if (i.id === j.detailId) {
                                console.log(i.payPrice, j.payPrice, '回显数据')
                                i.number = j.number
                                i.payPrice = j.payPrice
                            }
                        })
                    }
                })
                this.blendData = res.data
                this.onSelectChange(arr)
            }
        },
        async seachReat (e) {
            this.loading = true
            const pams = {
                storeCode: this.$store.getters.storeInfo.code,
                custNo: this.$props.pams.custNo,
                closeTime: e.format('YYYY-MM-DD')
            }
            console.log(pams)
            // 获取分销单表格
            const res = await axios({
                path: 'WholesalePayFindConsignmentAndDiscount',
                method: 'post',
                body: pams
            })
            if (res.flag === 1) {
                this.loading = false
                console.log(res.data, '55555555555555555555555555555555555555555')
                res.data.forEach(i => {
                    i.taxRates = this.rateTransform(i.taxRate)
                    if (this.tableData.length > 0) {
                        this.tableData.forEach(j => {
                            if (i.id === j.detailId) {
                                console.log(i.payPrice, j.payPrice, '回显数据')
                                i.number = j.number
                                i.payPrice = j.payPrice
                            }
                        })
                    }
                })
                this.blendData = res.data
                this.onSelectChange(this.selectedRowKeys)
            }
        },
        /**
         * @name: 时间过滤
         */
        signDtDisabledDate (e) {
            return moment(e).isAfter(moment().startOf('day'))
        }
    }
}
</script>

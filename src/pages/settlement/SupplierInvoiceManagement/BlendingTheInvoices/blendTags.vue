<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-21 14:32:43
 * @LastEditTime: 2019-07-19 09:12:11
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="发票勾兑"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="1200"
      class="doc mat"
      destroyOnClose
      :bodyStyle="{height:'650px',width:'1200px'}"
      centered>
      <a-tabs defaultActiveKey="1" @change="callback" size="small">
        <a-tab-pane tab="商品入库单核销" key="1">
          <a-row :gutter="24" v-if="false">
            <a-col :span="8">
              <a-input-search v-model="skuCode" addonBefore="商品编码" @search="skuCodeSeach('skuCode')" />
            </a-col>
            <a-col :span="8">
              <a-input-search v-model="count" addonBefore="开票数" @search="skuCodeSeach('count')" />
            </a-col>
            <a-col :span="8">
              <a-input-search v-model="price" addonBefore="开票不含税价" @search="skuCodeSeach('price')" enterButton>
                <a-button slot="enterButton"><a-icon type="enter"></a-icon></a-button>
              </a-input-search>
            </a-col>
          </a-row>
          <a-row :gutter="24" v-if="false">
            <a-col :span="8">
              <a-input id="1" addonBefore="扫描验收单" @pressEnter="onSeach" />
            </a-col>
            <a-col :span="8">
              <a-input id="2" addonBefore="扫描原始单" @pressEnter="onSeach" />
            </a-col>
          </a-row>
          <br>
          <a-table
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :pagination="false"
            :dataSource="blendData"
            :columns="columns"
            rowKey="id"
            id="mite"
            :scroll="scroll"
            size="small"
            bordered>
            <template v-for="col in ['invQtty', 'priceExcludingTax']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <a-input-number
                  v-if="record.Bool && col === 'invQtty'"
                  style="margin: -5px 0;width:100%;"
                  :min="minimum"
                  :max="maximum"
                  :step="1"
                  :precision="0"
                  :value="text"
                  @change="e => InputStorageChange(e, record.id, col)" />
                <a-input-number
                  v-else-if="record.Bool && col === 'priceExcludingTax'"
                  style="margin: -5px 0;width:100%;"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="7"
                  :value="text"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  @change="e => InputStorageChange(e, record.id, col)" />
                <template v-else>{{ text }}</template>
              </div>
            </template>
            <template slot="footer" slot-scope="currentPageData">
              <h3 style="display:inline;">总计：</h3>
              <span style="margin-left:120px">开票数:</span>
              <span>{{ qtty }}</span>
              <span style="margin-left:120px">不含税总额:</span>
              <span>{{ oNpriceExcludingTax }}</span>
            </template>
          </a-table>
          <div>
            <a-row>
              <a-col :span="6">
                <a-input addonBefore="验收单号" v-model="billForm.checkCode" @keyup.enter.native="setTableScroll(billForm)"/>
              </a-col>
              <a-col :span="6" v-if="false">
                <a-input addonBefore="商品编码" v-model="billForm.skuCode" />
              </a-col>
              <a-col :span="6">
                <a-input addonBefore="数量" v-model="billForm.amount" @keyup.enter.native="getPaid()"/>
              </a-col>
              <a-col :span="6">
                <a-input addonBefore="进价" v-model="billForm.purPrice" @keyup.enter.native="getPaid()" />
              </a-col>
            </a-row>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="供应商费用核销" key="2" forceRender>
          <a-table
            :rowSelection="{selectedRowKeys: proSelectedRowKeys, onChange: onProSelectChange}"
            :pagination="false"
            :dataSource="blendProData"
            :columns="proColumns"
            rowKey="id"
            :scroll="{x: 2500,y:400}"
            size="small"
            bordered>
            <template v-for="col in ['feeProfit']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <a-input-number
                  v-if="record.Bool && col === 'feeProfit'"
                  style="margin: -5px 0;width:100%;"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :value="text"
                  @change="e => InputChange(e, record.id, col)" />
                <template v-else>{{ text }}</template>
              </div>
            </template>
            <template slot="footer" slot-scope="currentPageData">
              <h3 style="display:inline;">总计：</h3>
              <span style="margin-left:120px">实收费用:</span>
              <span>{{ feeProfit }}</span>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <div>
        <a-row>
          <a-col :span="6">
            税票金额: {{ taxReceiptObj.invoiceAmount }}
          </a-col>
          <a-col :span="6">
            红字金额: {{ taxReceiptObj.redAmount }}
          </a-col>
          <a-col :span="6">
            蓝字金额: {{ taxReceiptObj.blueAmount }}
          </a-col>
          <a-col :span="6">
            勾兑差额: {{ taxReceiptObj.balance }}
          </a-col>
        </a-row>
      </div>
      <div slot="footer">
        <a-button @click="() => {$emit('update:visible', false)}" size="small" >取消</a-button>
        <a-button @click="blendProSubmit" type="primary" size="small" >确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
const columns = [
    { title: '验收单号', dataIndex: 'code', width: 200, align: 'center' },
    { title: '入库数', dataIndex: 'entryQtty', width: 100, align: 'center' },
    { title: '开票数', dataIndex: 'invQtty', width: 100, align: 'center', scopedSlots: { customRender: 'invQtty' } },
    { title: '未开票数', dataIndex: 'noInv', width: 100, align: 'center' },
    { title: '不含税进价', dataIndex: 'priceExcludingTax', width: 200, align: 'center', scopedSlots: { customRender: 'priceExcludingTax' } },
    { title: '发票含税进价', dataIndex: 'priceIncludingTax', width: 200, align: 'center' },
    { title: '验收含税进价', dataIndex: 'priceIn', width: 200, align: 'center' },
    { title: '不含税总额', dataIndex: 'oNpriceExcludingTax', width: 200, align: 'center' },
    { title: '差额', dataIndex: 'margin', width: 200, align: 'center' },
    { title: '税额', dataIndex: 'actualTax', width: 200, align: 'center' },
    { title: '税率', dataIndex: 'taxRates', width: 200, align: 'center' },
    { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
    { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
    { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
    { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
    { title: '分店编码', dataIndex: 'storeCode', width: 100, align: 'center' },
    { title: '分店名称', dataIndex: 'storeName', width: 100, align: 'center' },
    { title: '商品SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
    { title: '商品SKU名称', dataIndex: 'skuName', width: 300, align: 'center' },
    { title: '原始单号', dataIndex: 'sourceCode', width: 150, align: 'center' },
    { title: '审核时间', dataIndex: 'auditTime', width: 200, align: 'center' },
    { title: '规格型号', dataIndex: 'model', width: 300, align: 'center' }
]
const blendData = []
const proColumns = [
    { title: '监控单号', dataIndex: 'code', width: 200, align: 'center' },
    { title: '应收费用', dataIndex: 'fee', width: 100, align: 'center' },
    { title: '实收费用', dataIndex: 'feeProfit', width: 150, align: 'center', scopedSlots: { customRender: 'feeProfit' } },
    { title: '欠收费用', dataIndex: 'calculator', width: 200, align: 'center' },
    { title: '审核时间', dataIndex: 'auditTime', width: 150, align: 'center' },
    { title: '经营类型', dataIndex: 'goodsTypeName', width: 100, align: 'center' },
    { title: '费用项目', dataIndex: 'name', width: 150, align: 'center' },
    { title: '税率', dataIndex: 'taxRates', width: 100, align: 'center' },
    { title: '分店编码', dataIndex: 'storeCode', width: 150, align: 'center' },
    { title: '分店名称', dataIndex: 'storeName', width: 150, align: 'center' },
    { title: '分类编码', dataIndex: 'classCode', width: 150, align: 'center' },
    { title: '分类名称', dataIndex: 'className', width: 150, align: 'center' },
    { title: '品牌', dataIndex: 'brandCode', width: 150, align: 'center' },
    { title: '品牌', dataIndex: 'brandName', width: 150, align: 'center' },
    { title: '备注', dataIndex: 'note', width: 500, align: 'center' }
]
const blendProData = []
export default {
    name: 'BlendTags',
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
            scroll: { x: 4000, y: 400 },
            taxReceiptObj: {},
            billForm: {
                checkCode: null,
                skuCode: null,
                amount: null,
                purPrice: null
            },
            feeProfit: 0,
            qtty: 0,
            oNpriceExcludingTax: 0,
            // 限制开票数最小值
            minimum: 0,
            // 限制开票数最大值
            maximum: Number.MAX_SAFE_INTEGER,
            // 入库单表格表头
            columns,
            // 入库单表格数据
            blendData,
            // 费用单表格表头
            proColumns,
            // 费用单表格数据
            blendProData,
            // 商品编码搜索
            skuCode: '',
            // 开票数
            count: '',
            // 不含税价
            price: '',
            // 入库表格选中项
            selectedRowKeys: [],
            // 供应商费用表格选中项
            proSelectedRowKeys: [],
            pitchOn: [],
            exist: false
        }
    },
    methods: {
        setTableScrollTop (index) {
            if (index !== 0 || index !== -1) {
                const currPosition = index * 38
                document.getElementsByClassName('ant-table-body')[2].scrollTo(0, currPosition)
                // console.log(document.getElementsByClassName('ant-table-body'), '滚动位置')
                // console.log(index, currPosition, '获取选中')
            }
        },
        /**
         * @name: 进价 / 数量输入
         */
        getPaid () {
            if (this.billForm.checkCode || this.billForm.skuCode) {
                const reg = new RegExp(/^[0-9]+.?[0-9]*$/)
                if (this.billForm.purPrice && reg.test(this.billForm.purPrice)) {
                    for (const i of this.blendData) {
                        if (is.inArray(i.id, this.selectedRowKeys)) {
                            i.priceExcludingTax = this.billForm.purPrice
                            console.log(i.id, this.billForm.purPrice, i.priceExcludingTax, '555555555555555')
                        }
                    }
                }
                if (this.billForm.amount && reg.test(this.billForm.amount)) {
                    let mun = this.billForm.amount
                    for (const i of this.blendData) {
                        for (const o of this.pitchOn) {
                            if (i.id === o.id) {
                                if (i.noInv >= mun) {
                                    i.invQtty = mun
                                    mun = 0
                                    break
                                } else if (i.noInv < mun) {
                                    i.invQtty = i.noInv
                                    mun = mun - i.noInv
                                }
                            }
                        }
                    }
                }
                this.totalizator()
                this.onPitch()
            }
        },
        /**
         * @name: 查询筛选
         */
        setTableScroll (e) {
            this.pitchOn = []
            if (e.checkCode && !e.skuCode) {
                const arr = []
                let sum = null
                for (const i of this.blendData) {
                    if (i.code === e.checkCode) {
                        arr.push(i.id)
                        sum = i
                        this.pitchOn.push(i)
                    }
                }
                this.onSelectChange([...arr])
                this.setTableScrollTop(this.blendData.indexOf(sum))
            }

            // 判断数量和进价已经输入
            if (this.billForm.purPrice || this.billForm.amount) {
                this.getPaid()
            }
        },
        /**
         * @name: 获取税票金额
         */
        obtainForm (obj) {
            const { add, sub } = this.$math
            this.billForm = {}
            console.log(obj, '税票金额')
            this.taxReceiptObj = { ...obj }
            this.taxReceiptObj.balance = sub(this.taxReceiptObj.invoiceAmount, add(this.feeProfit, this.oNpriceExcludingTax))
        },
        rateTransform (rate) {
            const { mul } = this.$math
            console.log(rate, '税率')
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 清空总计
         */
        EmptyTotal () {
            this.qtty = 0
            this.oNpriceExcludingTax = 0
        },
        /**
         * @name:提交选中
         */
        blendProSubmit () {
            // 费用核销选中数据
            const proSelectDatas = this.blendProData.filter(o => is.inArray(o.id, this.proSelectedRowKeys))
            // 入库单核销选中数据
            const storageSelectDatas = this.blendData.filter(o => is.inArray(o.id, this.selectedRowKeys))
            // 费用核销加入判断pro=1为费用核销
            const selectDatasAll = []
            const { sub, add, div, mul } = this.$math
            for (const i in proSelectDatas) {
                if (!proSelectDatas[i].feeProfit) {
                    return this.$message.warning('实收费用不能为空!')
                }
                selectDatasAll.push({
                    providerFeeDetailId: proSelectDatas[i].id,
                    // 税率
                    taxRate: proSelectDatas[i].taxRate,
                    taxRates: this.rateTransform(proSelectDatas[i].taxRate),
                    // 备注
                    note: proSelectDatas[i].note,
                    // 序号
                    sequenceNumber: 1 + Number(i),
                    // id
                    blendId: proSelectDatas[i].id,
                    // 核销类型
                    recordType: '费用核销',
                    // 数量
                    qtty: 1,
                    // 单据号
                    billCode: proSelectDatas[i].code,
                    // 分店
                    storeCode: proSelectDatas[i].storeCode,
                    storeName: proSelectDatas[i].storeName,
                    // 分类
                    classCode: proSelectDatas[i].classCode,
                    className: proSelectDatas[i].className,
                    // 品牌
                    brandCode: proSelectDatas[i].brandCode,
                    brandName: proSelectDatas[i].brandName,
                    // 规格
                    model: proSelectDatas[i].name,
                    // 经营类型
                    goodsType: proSelectDatas[i].goodsType,
                    goodsTypeName: proSelectDatas[i].goodsTypeName,
                    // // 应核销 = 欠收费用
                    fee: proSelectDatas[i].calculator,
                    // // 勾兑差额(含税) = - 实收费用
                    recordDifferences: -proSelectDatas[i].feeProfit,
                    // // 勾兑差额(不含税) = (勾兑差额(含税) /(1+税率%),2) / 税率接口暂无,数字代替
                    onRecordDifferences: div(-proSelectDatas[i].feeProfit, add(1, proSelectDatas[i].taxRate)),
                    // // 勾兑金额 = (勾兑差额(含税) /(1+税率%),2)
                    recordAmount: div(-proSelectDatas[i].feeProfit, add(1, proSelectDatas[i].taxRate))
                })
            }
            // 入库单加入判断pro=2 为商品核销
            if (storageSelectDatas.length > 0) {
                for (const j of storageSelectDatas) {
                    if (!j.priceExcludingTax || !j.invQtty) {
                        return this.$message.warning('开票数和不含税进价不能为空!')
                    }
                    j.blendId = j.id
                    j.recordType = '商品核销'
                    selectDatasAll.push({
                        providerFeeDetailId: j.id,
                        // 备注
                        note: j.note,
                        // id
                        blendId: j.id,
                        // 核销类型
                        recordType: '商品核销',
                        // 数量
                        qtty: j.invQtty,
                        // 原进价 = 验收函数进价
                        priceCost: j.priceIn,
                        // 税票价 = 发票含税进价
                        priceCostInvoice: j.priceIncludingTax,
                        // 单据号
                        billCode: j.code,
                        // 分店
                        storeCode: j.storeCode,
                        storeName: j.storeName,
                        // 分类
                        classCode: j.classCode,
                        className: j.className,
                        // 品牌
                        brandCode: j.brandCode,
                        brandName: j.brandName,
                        // 商品sku编码
                        skuCode: j.skuCode,
                        // 商品名称
                        name: j.skuName,
                        oNpriceExcludingTax: 0,
                        priceExcludingTax: 0,
                        // 规格
                        model: j.model,
                        // 税率(无接口,暂时数字)
                        taxRate: j.taxRate,
                        taxRates: this.rateTransform(j.taxRate),
                        // 勾兑差额(含税) = 发票含税进价 - 验收含税进价 * 数量
                        onRecordDifferences: mul(sub(j.priceIncludingTax, j.priceIn), j.invQtty),
                        // 勾兑差额(不含税) = (勾兑差额(含税) /(1+税率%)
                        recordDifferences: div(mul(sub(j.priceIncludingTax, j.priceIn), j.invQtty), add(1, j.taxRate)),
                        // 勾兑金额 = (数量*税票价/(1+税率%),2)
                        recordAmount: div(mul(j.invQtty, j.priceIncludingTax), add(1, j.taxRate))
                    })
                }
            } else {
                console.log('啊啊啊啊')
            }
            // 合并选组数据
            // const selectDatasAll = [ ...storageSelectDatas, ...proSelectDatas ]
            // 将费用核销表 + 入库单选中数据push进明细
            if (selectDatasAll.length > 0) {
                this.$emit('onSelect', selectDatasAll)
                this.proSelectedRowKeys.length = 0
                this.selectedRowKeys.length = 0
            } else {
                return this.$message.warning('提交确认不能为空!')
            }
            this.$emit('update:visible', false)
        },
        /**
         * @name:tags切换
         */
        callback (key) {
            console.log(key, '切换')
        },
        /**
         * @name: 查询入库单
         */
        skuCodeSeach (e) {
            if (e === 'skuCode') {
                console.log(this.skuCode, '商品')
            } else if (e === 'count') {
                console.log(this.count, '开票')
            } else if (e === 'price') {
                console.log(this.price, '不含税价')
            }
        },
        /**
         * @name: 扫描入库单
         */
        onSeach (e) {
            if (e.target.id === '1') {
                console.log(e.target.value, '扫描验收单')
            } else if (e.target.id === '2') {
                console.log(e.target.value, '扫描原始单')
            }
        },
        /**
         * @name: 监听入库单表格选中
         */
        onSelectChange (e) {
            this.selectedRowKeys = e
            for (const i of this.blendData) {
                console.log(i)
                if (!is.inArray(i.id, this.selectedRowKeys)) {
                    i.Bool = false
                    i.invQtty = 0
                    i.margin = 0
                    i.actualTax = 0
                    i.priceIncludingTax = 0
                    i.priceExcludingTax = 0
                    i.oNpriceExcludingTax = 0
                } else {
                    i.Bool = true
                }
            }
            if (this.selectedRowKeys.length < 1) return
            this.onPitch()
            this.totalizator()
        },
        /**
         * @name: 监听供应商费用单表格选中
         */
        onProSelectChange (e) {
            this.proSelectedRowKeys = e
            for (const i of this.blendProData) {
                if (!is.inArray(i.id, this.proSelectedRowKeys)) {
                    i.Bool = false
                    i.feeProfit = 0
                } else {
                    i.Bool = true
                }
            }
            if (this.proSelectedRowKeys.length < 1) return
            this.realPrice()
        },
        /**
         * @name: 查询入库单表格
         */
        async seach (pams, obj) {
            pams.storeCode = this.$store.getters.storeInfo.code
            // 获取入库单表格
            const res = await axios({
                path: 'InvoiceBlendFindEntryByProvider',
                method: 'post',
                body: pams
            })
            // 获取供应商费用数据
            const proRes = await axios({
                path: 'ProviderMonitorFindDetailByProvider',
                method: 'post',
                body: pams
            })
            if (proRes.flag === 1) {
                console.log(proRes.data.list, '费用表格')
                const arr = []
                const { sub } = this.$math
                for (const i of proRes.data.list) {
                    i.taxRates = this.rateTransform(i.taxRate)
                    if (i.feeProfit && i.fee) {
                        arr.push(i.id)
                        i['calculator'] = sub(i['fee'], i['feeProfit'])
                    }
                }
                this.blendProData = proRes.data.list
                this.onProSelectChange(arr)
            }
            if (res.flag === 1) {
                const { sub, mul, add } = this.$math
                console.log(res.data.list, '入库表格')
                const arr = []
                for (const i of res.data.list) {
                    i.taxRates = this.rateTransform(i.taxRate)
                    i.Bool = false
                    if (i.invQtty && i.priceExcludingTax) {
                        arr.push(i.id)
                        // 发票含税金额：发票不含税进价 * （1+税率）
                        i['priceIncludingTax'] = mul(i['priceExcludingTax'], add(1, i['taxRate']))
                        // 不含税总额：发票不含税进价 * 开票数
                        i['oNpriceExcludingTax'] = mul(i['priceExcludingTax'], i['invQtty'])
                        // 税额（总税额）：（发票含税进价-发票不含税进价） * 开票数
                        i['actualTax'] = mul(sub(i['priceIncludingTax'], i['priceExcludingTax']), i['invQtty'])
                        i['margin'] = mul(sub(i['priceIn'], i['priceIncludingTax']), i['invQtty'])
                    }
                }
                this.blendData = res.data.list
                this.onSelectChange(arr)
            }
        },
        /**
         * @name:选中计算开票数
         */
        onPitch () {
            const { add, div, mul, sub } = this.$math
            const qttyArr = []
            for (const i of this.blendData) {
                if (is.inArray(i.id, this.selectedRowKeys)) {
                    if (!i.invQtty) {
                        i.invQtty = i.noInv
                        i.priceExcludingTax = div(i.priceIn, add(1, i.taxRate), 6)
                        i['priceIncludingTax'] = mul(i['priceExcludingTax'], add(1, i['taxRate']))
                        // 不含税总额：发票不含税进价 * 开票数
                        i['oNpriceExcludingTax'] = mul(i['priceExcludingTax'], i['invQtty'])
                        // 税额（总税额）：（发票含税进价-发票不含税进价） * 开票数
                        i['actualTax'] = mul(sub(i['priceIncludingTax'], i['priceExcludingTax']), i['invQtty'])
                        i['margin'] = mul(sub(i['priceIn'], i['priceIncludingTax']), i['invQtty'])
                    } else {
                        // i.priceExcludingTax = div(i.priceIn, add(1, i.taxRate), 6)
                        i['priceIncludingTax'] = mul(i['priceExcludingTax'], add(1, i['taxRate']))
                        // 不含税总额：发票不含税进价 * 开票数
                        i['oNpriceExcludingTax'] = mul(i['priceExcludingTax'], i['invQtty'])
                        // 税额（总税额）：（发票含税进价-发票不含税进价） * 开票数
                        i['actualTax'] = mul(sub(i['priceIncludingTax'], i['priceExcludingTax']), i['invQtty'])
                        i['margin'] = mul(sub(i['priceIn'], i['priceIncludingTax']), i['invQtty'])
                    }
                    qttyArr.push(i.invQtty)
                }
            }
            this.qtty = qttyArr.reduce((prev, cur) => {
                return add(prev, cur, 0)
            }, 0)
        },
        // 不含税进价计算
        // priceExcludingTax () {
        //     const { add, mul, sub } = this.$math
        //     for (const i of this.blendData) {
        //         if (is.inArray(i.id, this.selectedRowKeys)) {
        //             if (i.priceExcludingTax) {
        //                 // i.priceExcludingTax = div(i.priceIn, add(1, i.taxRate), 6)
        //                 i['priceIncludingTax'] = mul(i['priceExcludingTax'], add(1, i['taxRate']))
        //                 // 不含税总额：发票不含税进价 * 开票数
        //                 i['oNpriceExcludingTax'] = mul(i['priceExcludingTax'], i['invQtty'])
        //                 // 税额（总税额）：（发票含税进价-发票不含税进价） * 开票数
        //                 i['actualTax'] = mul(sub(i['priceIncludingTax'], i['priceExcludingTax']), i['invQtty'])
        //                 i['margin'] = mul(sub(i['priceIn'], i['priceIncludingTax']), i['invQtty'])
        //             }
        //         }
        //     }
        // },
        /**
         * @name: 计算总额
         */
        totalizator () {
            const { add, sub } = this.$math
            const oNpriceExcludingTaxArr = []
            for (const i of this.blendData) {
                if (!i.oNpriceExcludingTax) {
                    i.oNpriceExcludingTax = 0
                }
                if (is.inArray(i.id, this.selectedRowKeys)) {
                    oNpriceExcludingTaxArr.push(i.oNpriceExcludingTax)
                }
            }
            const str = oNpriceExcludingTaxArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.oNpriceExcludingTax = '￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            console.log(str, '不含税总计')
            this.taxReceiptObj.balance = sub(this.taxReceiptObj.invoiceAmount, add(str, this.feeProfit))
            // console.log('￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        },
        /**
         * @name:计算实收费用
         */
        realPrice () {
            const { add } = this.$math
            const feeProfitArr = []
            const { sub } = this.$math
            for (const i of this.blendProData) {
                if (!i.feeProfit) {
                    i.feeProfit = i.fee
                    i['calculator'] = sub(i['fee'], i['feeProfit'])
                }
                if (is.inArray(i.id, this.proSelectedRowKeys)) {
                    feeProfitArr.push(i.feeProfit)
                }
            }
            const str = feeProfitArr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.feeProfit = '￥' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            this.taxReceiptObj.balance = sub(this.taxReceiptObj.invoiceAmount, add(str, this.sumChangeS(this.oNpriceExcludingTax)))
        },
        /**
         * @name:监听费用单表格编辑
         */
        InputChange (val, count, key) {
            if (!val || is.not.number(val)) return
            console.log(val, count, key, '监听')
            const newData = [...this.blendProData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                const { sub } = this.$math
                this.realPrice()
                target['calculator'] = sub(target['fee'], target['feeProfit'])
                this.blendProData = newData
            }
        },
        /**
         * @name:监听入库单表格编辑
         */
        InputStorageChange (val, count, key) {
            console.log(val, '66666666666666666666')
            if (!val || is.not.number(val)) return
            const { sub, mul, add, abs } = this.$math
            // console.log(val, count, key, '监听输入变化')
            const newData = [...this.blendData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                target[key] = val
                if (key === 'invQtty') {
                    console.log(Number(abs(val, 0)), Number(abs(val, 0)), '未开票')
                    if (Number(abs(val, 0)) > Number(abs(target['noInv'], 0))) {
                        target['invQtty'] = 0
                        this.qtty = 0
                        this.$message.warning('开票数不能大于未开票数,请先核对开票数!')
                    }
                }
                // 判断不含税进价存在
                if (target['priceExcludingTax']) {
                    // 发票含税金额：发票不含税进价 * （1+税率）
                    target['priceIncludingTax'] = mul(target['priceExcludingTax'], add(1, target['taxRate']))
                }
                // 判断开票数 / 不含税进价都存在计算
                if (target['priceExcludingTax'] && target['invQtty']) {
                    // 不含税总额：发票不含税进价 * 开票数
                    target['oNpriceExcludingTax'] = mul(target['priceExcludingTax'], target['invQtty'])
                    // 税额（总税额）：（发票含税进价-发票不含税进价） * 开票数
                    target['actualTax'] = mul(sub(target['priceIncludingTax'], target['priceExcludingTax']), target['invQtty'])
                }
                if (target['invQtty'] && target['priceIncludingTax']) {
                    // 差额：（验收含税进价-发票含税进价）* 开票数
                    target['margin'] = mul(sub(target['priceIn'], target['priceIncludingTax']), target['invQtty'])
                }
                if (target['oNpriceExcludingTax']) {
                    this.totalizator()
                }
                if (target['invQtty']) {
                    this.onPitch()
                }
                this.blendData = newData
            }
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        }
    },
    watch: {
        visible (val) {
            if (val) {
                console.log(2343)
                this.seach(this.pams)
                this.selectedRowKeys.length = 0
            }
        }
    }
}
</script>
<style lang="less">
    @import "../../../../assets/modalStyle.less";
    .mat {
        .ant-modal-body {
            padding-top: 0;
        }
    }
</style>

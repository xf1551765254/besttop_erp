<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 15:13:20
 -->
<template>
  <preview
    v-model="previewVisbel"
    :tags="tags"
    title="自营合同"
    :orderId="orderCode"
    :headers="previewHeaders"
    :content="previewContent"
    :fileList="previewFileList">
    <div slot="summary">
      <pre>{{ `本合同由以下当事人订立，并于${previewSignDt}签订；` }}</pre>
      <pre>{{ `       甲方：${previewFootersA.providerName || ''}        乙方：${previewFootersB.name || ''}` }}</pre>
    </div>
    <div slot="A" title="结算信息">
      <a-row>
        <a-col :sm="4" :md="4" :xl="2">月扣返点</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ previewSum.month }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">正常返点</a-col>
        <a-col :sm="20" :md="8" :xl="10"><span class="text">{{ previewSum.rateReturnMonth }}%</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">特价返点</a-col>
        <a-col :sm="20" :md="8" :xl="10"><span class="text">{{ previewSum.specialRateReturnMonth }}%</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">季扣返点</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ previewSum.quarter }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">达标类型</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">
          <a-select
            style="width:100%"
            :options="returnQuarterTypeArr"
            disabled
            v-model="previewSum.returnQuarterType"/></span></a-col>
        <a-col :sm="4" :md="4" :xl="2">达标值</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.returnQuarterAmount }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">正常返点</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.rateReturnQuarter }}%</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">特价返点</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.specialRateReturnQuarter }}%</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">半年扣返点</a-col>
        <a-col :sm="20" :md="20" :xl="22"><span class="text">{{ previewSum.halfyear }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">达标类型</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">
          <a-select
            style="width:100%"
            :options="returnQuarterTypeArr"
            disabled
            v-model="previewSum.returnHalfyearType"/></span></a-col>
        <a-col :sm="4" :md="4" :xl="2">达标值</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.returnHalfyearAmount }}</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">正常返点</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.rateReturnHalfyear }}%</span></a-col>
        <a-col :sm="4" :md="4" :xl="2">特价返点</a-col>
        <a-col :sm="20" :md="8" :xl="4"><span class="text">{{ previewSum.specialRateReturnHalfyear }}%</span></a-col>
      </a-row>
    </div>
    <div slot="C" title="品类品牌" :isTable="true" :columns="categoryinfoColumns" :data="categoryinfoData"></div>
    <div slot="D" title="销售机构" :isTable="true" :columns="effectivescopeColumns" :data="effectivescopeData"></div>
    <!-- <div slot="E" title="供货信息" :isTable="true" :columns="supplyinfoColumns" :data="supplyinfoData"></div> -->
    <div slot="compactTable">
      <a-table
        defaultExpandAllRows
        rowKey="web_index"
        :scroll="{ x:2300}"
        :columns="supplyinfoColumns"
        :dataSource="supplyinfoData"
        :pagination="pagination"
        size="small"
        bordered/>
    </div>
    <div slot="footer">
      <a-row>
        <a-col :span="12">
          <pre>{{ `甲方：${previewFootersA.providerName || ''}` }}</pre>
          <pre>{{ `联系人：${previewFootersA.linkMan || ''}` }}</pre>
          <pre>{{ `联系电话：${previewFootersA.linkTele || ''}` }}</pre>
          <pre>{{ `开户银行：${previewFootersA.accountBank || ''}` }}</pre>
          <pre>{{ `银行账户：${previewFootersA.accountNo || ''}` }}</pre>
          <pre>{{ `地址：${previewFootersA.address || ''}` }}</pre>
        </a-col>
        <a-col :span="12">
          <pre>{{ `乙方：${previewFootersB.name || ''}` }}</pre>
          <pre>{{ `联系人：${previewFootersB.linkMan || ''}` }}</pre>
          <pre>{{ `联系电话：${previewFootersB.linkTele || ''}` }}</pre>
          <pre>{{ `开户银行：${previewFootersB.accountBank || ''}` }}</pre>
          <pre>{{ `银行账户：${previewFootersB.accountNo || ''}` }}</pre>
          <pre>{{ `地址：${previewFootersB.address || ''}` }}</pre>
        </a-col>
      </a-row>
    </div>
  </preview>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
export default {
    components: { Preview },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            pagination: {
                total: 0,
                showTotal: total => `共${total}条`,
                defaultPageSize: 15
            },
            previewVisbel: false,
            orderCode: '',
            tags: [],
            // 基础信息
            previewHeaders: [
                { key: 'providerContractName', name: '合同名称' },
                { key: 'providerName', name: '供应商' },
                // { key: 'organizeName', name: '组织机构' },
                { key: 'signName', name: '签订人' },
                { key: 'buyName', name: '采购人' },
                { key: 'signAddressName', name: '签约机构' },
                { key: 'signDt', name: '签订时间' },
                { key: 'effectDate', name: '生效时间' },
                { key: 'expiryDate', name: '失效时间' },
                { key: 'linkMan', name: '供应商联系人' },
                { key: 'linkTele', name: '供应商电话' },
                { key: 'linkFax', name: '供应商传真' },
                { key: 'linkEmail', name: '供应商邮箱' },
                { key: 'accountBank', name: '供应商开户行' },
                { key: 'accountNo', name: '供应商银行账号' },
                { key: 'address', name: '供应商地址' },
                { key: 'note', name: '供应商备注' }
            ],
            previewContent: {},
            previewSignDt: '-年-月-日',
            previewSum: {},
            previewFootersA: {},
            previewFootersB: {},
            previewFileList: [],
            categoryinfoColumns: [ // 品类品牌表头
                { title: '品类编码', dataIndex: 'classCode', width: 80 },
                { title: '品类名称', dataIndex: 'className', width: 200 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName' }
            ],
            categoryinfoData: [], // 品类品牌表体
            effectivescopeColumns: [// 生效分店列表表头
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 250 },
                { title: '备注', dataIndex: 'note' }
            ],
            effectivescopeData: [], // 生效分店表体
            supplyinfoColumns: [// 供货信息
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 200 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 50 },
                { title: 'SKU属性', dataIndex: 'skuProperty', width: 300 },
                { title: '税率', dataIndex: 'skuTaxRate', width: 50, align: 'right' },
                { title: '正常返点', dataIndex: 'normalRebate', width: 100, align: 'right' },
                { title: '特价返点', dataIndex: 'specialRebate', width: 100, align: 'right' },
                { title: '进货价', dataIndex: 'stockPrice', width: 100, align: 'right' },
                { title: '零售价', dataIndex: 'skuPrice', width: 100, align: 'right' },
                { title: '分销价', dataIndex: 'skuPriceW', width: 100, align: 'right' },
                { title: '限制价格', dataIndex: 'isPrice', width: 100, align: 'right' },
                { title: '状态', dataIndex: 'statusName' }
            ],
            supplyinfoData: [], // 供货信息
            returnQuarterTypeArr: []
        }
    },
    computed: {
        total: {
            get (val) {
                return val
            },
            set (val) {
                return val
            }
        }
    },
    methods: {
        getReturnQuarterTypeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'provider_contract_sum_return_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.returnQuarterTypeArr = [...data]
                }
            })
        },
        getProvider (code) {
            if (code) {
                axios({
                    path: 'OrganizationGroupFrameworkFindStoreByCode',
                    method: 'post',
                    body: { code }
                }).then(res => {
                    if (res.flag === 1) {
                        this.previewFootersB = res.data
                    }
                })
            }
        },
        findDetail (id) {
            axios({
                path: 'ProviderQueryProprietaryDetail',
                method: 'post',
                body: {
                    id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const { mul } = this.$math
                    const {
                        contract,
                        provider,
                        sum,
                        skus,
                        stores,
                        classGrands,
                        files
                    } = res.data
                    this.getProvider(contract.organizeCode)
                    this.orderCode = contract.code
                    this.previewSignDt = contract.signDt
                    this.previewFootersA = {
                        providerContractName: provider.providerContractName,
                        providerName: provider.name,
                        linkMan: provider.linkMan,
                        linkTele: provider.linkTele,
                        accountBank: provider.accountBank,
                        accountNo: provider.accountNo,
                        address: provider.address
                    }
                    this.previewSum = {}
                    if (sum.rateReturnMonth > 0 || sum.specialRateReturnMonth > 0) {
                        this.previewSum.month = '是'
                        this.previewSum.rateReturnMonth = sum.rateReturnMonth ? mul(sum.rateReturnMonth,100,2) : 0
                        this.previewSum.specialRateReturnMonth = sum.specialRateReturnMonth ? mul(sum.specialRateReturnMonth, 100,2) : 0
                    }
                    if (sum.returnQuarterAmount > 0 || sum.rateReturnQuarter > 0 || sum.specialRateReturnQuarter > 0) {
                        this.previewSum.quarter = '是'
                        this.previewSum.returnQuarterAmount = sum.returnQuarterAmount
                        this.previewSum.rateReturnQuarter =  sum.rateReturnQuarter ? mul(sum.rateReturnQuarter,100,2) : 0
                        this.previewSum.specialRateReturnQuarter = sum.specialRateReturnQuarter ? mul(sum.specialRateReturnQuarter,100,2) : 0
                        this.previewSum.returnQuarterType = sum.returnQuarterType
                    }
                    if (sum.returnHalfyearAmount > 0 || sum.rateReturnHalfyear > 0 || sum.specialRateReturnHalfyear > 0) {
                        this.previewSum.halfyear = '是'
                        this.previewSum.returnHalfyearAmount = sum.returnHalfyearAmount
                        this.previewSum.rateReturnHalfyear = sum.rateReturnHalfyear ? mul(sum.rateReturnHalfyear,100,2) : 0
                        this.previewSum.specialRateReturnHalfyear = sum.specialRateReturnHalfyear ? mul(sum.specialRateReturnHalfyear,100,2) : 0
                        this.previewSum.returnHalfyearType = sum.returnHalfyearType
                    }
                    if (contract.status === 'provider_contract_status:1') { this.tags = ['unconfirm'] }
                    if (contract.status === 'provider_contract_status:2') { this.tags = ['check'] }
                    if (contract.status === 'provider_contract_status:3') { this.tags = ['uncheck'] }
                    if (contract.status === 'provider_contract_status:4') { this.tags = ['effective'] }
                    if (contract.status === 'provider_contract_status:5') { this.tags = ['noeffective'] }
                    if (contract.status === 'provider_contract_status:6') { this.tags = ['stoped'] }
                    // contract.organizeName = contract.organizeCode ? `${contract.organizeCode}-${contract.organizeName}` : ''
                    contract.signName = contract.signBy ? `${contract.signBy}-${contract.signName}` : ''
                    contract.buyName = contract.buyBy ? `${contract.buyBy}-${contract.buyName}` : ''
                    contract.signAddressName = contract.signAddress ? `${contract.signAddress}-${contract.signAddressName}` : ''
                    this.previewContent.headers = { ...contract, ...provider, providerName: provider.name }
                    const brandList = classGrands.brandList
                    brandList.forEach(b => {
                        b.key = `${b.classCode}${b.brandCode}`
                    })
                    this.categoryinfoData = [...brandList]
                    const skuList = skus.skuList
                    this.pagination.total = skuList.length
                    this.total = skuList.length
                    console.log(this.pagination.total, '77777777777777777777777777777')
                    let num = 1
                    skuList.forEach(s => {
                        s.index = num++
                        s.key = s.skuCode
                        s.skuTaxRate = this.rateTransform(s.skuTaxRate)
                        s.normalRebate = this.rateTransform(s.normalRebate)
                        s.specialRebate = this.rateTransform(s.specialRebate)
                    })
                    this.supplyinfoData = [...skuList]
                    const storesList = stores.stores
                    this.effectivescopeData = [...storesList]
                    this.previewFileList = []
                    if (files) {
                        const pic = files.split(',')
                        pic.forEach(item => {
                            this.previewFileList.push({
                                url: item,
                                fileUrl: item
                            })
                        })
                    }
                    this.previewVisbel = true
                }
            })
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        detailsSumbit () {
            this.supplyinfoData.length = 0
            this.categoryinfoData.length = 0
            this.effectivescopeData.length = 0
            axios({
                path: 'ProviderQueryProprietary',
                method: 'POST',
                body: { code: this.orderId }
            }).then(res => {
                if (res.flag === 1) {
                    const e = res.data.list[0]
                    this.findDetail(e.id)
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.getReturnQuarterTypeArr()
                this.detailsSumbit()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

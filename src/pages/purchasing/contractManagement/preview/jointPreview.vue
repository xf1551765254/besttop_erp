<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-06-21 09:49:21
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 15:22:01
 -->
<template>
  <preview
    v-model="previewVisbel"
    title="联营合同"
    :tags="tags"
    :orderId="orderCode"
    :headers="previewHeaders"
    :content="previewContent"
    :fileList="previewFileList">
    <div slot="summary">
      <pre>{{ `本合同由以下当事人订立，并于${previewSignDt}签订；` }}</pre>
      <pre>{{ `       甲方：${previewFootersA.providerName || ''}        乙方：${previewFootersB.name || ''}` }}</pre>
    </div>
    <div slot="A" title="结算信息">
      <a-row v-show="previewSum.caseModal">
        <a-col :sm="3" :md="3" :xl="3">扣率</a-col>
        <a-col :sm="5" :md="5" :xl="5"><span class="text">{{ previewSum.torqueRate }}</span></a-col>
        <a-col :span="24" v-for="(item, index) in previewSum.BinningList" :key="index">
          <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级分档周期</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ previewSum.BinningList[index].gradeMonth }}</span></a-col>
          <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级分档金额</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ previewSum.BinningList[index].gradeAmount }}</span></a-col>
          <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级分档扣率</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ previewSum.BinningList[index].gradeRate }}</span></a-col>
        </a-col>
      </a-row>
      <a-row v-show="!previewSum.caseModal">
        <a-col :sm="3" :md="3" :xl="3">租金金额</a-col>
        <a-col :sm="5" :md="5" :xl="5"><span class="text">{{ previewSum.shareSales }}</span></a-col>
        <a-col :sm="3" :md="3" :xl="3">是否保底</a-col>
        <a-col :sm="5" :md="5" :xl="5"><span class="text">{{ previewSum.isMinimum }}</span></a-col>
        <a-col :sm="3" :md="3" :xl="3">分摊到月</a-col>
        <a-col :sm="5" :md="5" :xl="5"><span class="text">{{ previewSum.month }}</span></a-col>
        <a-col :span="24" v-for="(item, index) in previewSum.changeMonthData" :key="index+5">
          <a-col :sm="3" :md="3" :xl="3">财务月</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ item.monthName }}</span></a-col>
          <a-col :sm="3" :md="3" :xl="3">分摊金额</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ item.shareSales }}</span></a-col>
          <a-col :sm="3" :md="3" :xl="3">备注</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ item.note }}</span></a-col>
        </a-col>
        <a-col :span="24" v-for="(item, index) in previewSum.BinningList" :key="index">
          <!-- <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级超保周期</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ item.gradeMonth }}</span></a-col> -->
          <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级超保金额</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ item.gradeAmount }}</span></a-col>
          <a-col :sm="3" :md="3" :xl="3">{{ index+1 }}级超保扣率</a-col>
          <a-col :sm="5" :md="5" :xl="5"><span class="title">{{ $math.mul(item.gradeRate,100,2) }}%</span></a-col>
        </a-col>
      </a-row>
    </div>
    <div slot="B" title="费用明细" :isTable="true" :columns="feeColumns" :data="feeData"></div>
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
        :pagination="{defaultPageSize:15}"
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
import is from 'is_js'
import map from 'lodash.map'
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
            previewVisbel: false,
            previewFooters: {},
            previewContent: {},
            previewSignDt: '-年-月-日',
            previewFootersA: {},
            previewFootersB: {},
            previewSum: {},
            previewFileList: [],
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
            detailsColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'center' },
                { title: '新含税进价', dataIndex: 'ptIn', width: 150, align: 'center' },
                { title: '原含税进价', dataIndex: 'ptInOrig', width: 150, align: 'center' },
                { title: '新扣率', dataIndex: 'deductionRate', width: 100, align: 'center' },
                { title: '原扣率', dataIndex: 'deductionRateOrigs', width: 100, align: 'center' },
                { title: '变更类型', dataIndex: 'type', width: 100, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
                { title: '原因', dataIndex: 'reason', align: 'center' }
            ],
            billsData: [],
            feeColumns: [
                { title: '收取方式', dataIndex: 'receiveModeName', width: 100 },
                { title: '费用类型', dataIndex: 'feeTypeName', width: 100 },
                { title: '金额', dataIndex: 'feeAmount', width: 100 },
                { title: '比率', dataIndex: 'feeRate', width: 100 },
                { title: '备注', dataIndex: 'note' }
            ],
            feeData: [],
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
                { title: '商品sku编码', dataIndex: 'skuCode', width: 200 },
                { title: '商品sku名称', dataIndex: 'skuName', width: 300 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '商品单位', dataIndex: 'skuUnit', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 200 },
                { title: 'SKU属性', dataIndex: 'skuProperty', width: 300 },
                { title: '税率', dataIndex: 'skuTaxRate', width: 100 },
                { title: '扣率', dataIndex: 'skuDRate', width: 100 },
                { title: '进货价', dataIndex: 'stockPrice', width: 100 },
                { title: '零售价', dataIndex: 'skuPrice', width: 100 },
                { title: '分销价', dataIndex: 'skuPriceW', width: 100 },
                { title: '限制价格', dataIndex: 'isPrice', width: 100 },
                { title: '是否管库存', dataIndex: 'isStock', width: 100 },
                { title: '状态', dataIndex: 'statusName', width: 100 }
            ],
            supplyinfoData: [],
            orderCode: ''
        }
    },
    methods: {
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
                path: 'ProviderQueryDetail',
                method: 'post',
                body: {
                    id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const { contract, provider, sumPool, skus, stores, classGrands, fees, files } = res.data
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
                    if (contract.status === 'provider_contract_status:1') { this.tags = ['unconfirm'] }
                    if (contract.status === 'provider_contract_status:2') { this.tags = ['check'] }
                    if (contract.status === 'provider_contract_status:3') { this.tags = ['uncheck'] }
                    if (contract.status === 'provider_contract_status:4') { this.tags = ['effective'] }
                    if (contract.status === 'provider_contract_status:5') { this.tags = ['noeffective'] }
                    if (contract.status === 'provider_contract_status:6') { this.tags = ['stoped'] }
                    if (is.object(sumPool)) {
                        if (sumPool.sumType === '租金') {
                            this.previewSum.caseModal = false
                            this.previewSum.isMinimum = sumPool.isMinimum === 1 ? '是' : '否'
                            this.previewSum.changeMonthData = []
                            const data = []
                            sumPool.poolPlan.forEach(o => {
                                data.push({
                                    monthName: `${o.month}月`,
                                    month: o.month,
                                    shareSales: o.shareSales,
                                    note: o.note
                                })
                            })
                            data.sort((a, b) => { return a.month - b.month })
                            this.previewSum.changeMonthData = [...data]
                            this.previewSum.month = (map(this.previewSum.changeMonthData, 'month')).join(',')
                            this.previewSum.BinningList = [...sumPool.poolMinimum].sort((a, b) => { return a.gradeNo - b.gradeNo })
                            this.previewSum.shareSales = sumPool.rent
                        } else {
                            this.previewSum.caseModal = true
                            this.previewSum.torqueRate = sumPool.torqueRate
                            this.previewSum.BinningList = [...sumPool.poolMinimum].sort((a, b) => { return a.gradeNo - b.gradeNo })
                        }
                    }
                    // contract.organizeName = contract.organizeCode ? `${contract.organizeCode}-${contract.organizeName}` : ''
                    contract.signName = contract.signBy ? `${contract.signBy}-${contract.signName}` : ''
                    contract.buyName = contract.buyBy ? `${contract.buyBy}-${contract.buyName}` : ''
                    contract.signAddressName = contract.signAddress ? `${contract.signAddress}-${contract.signAddressName}` : ''
                    this.previewContent.headers = { ...contract, ...provider, providerName: provider.name }
                    this.feeData = [...fees.fees]
                    const skuList = skus.skuList
                    skuList.forEach(s => {
                        s.key = s.skuCode
                        s.skuTaxRate = this.$math.mul(s.skuTaxRate, 100)
                        s.isStock = s.isStock === 1 ? '是' : '否'
                    })
                    this.supplyinfoData = [...skuList]
                    const storesList = stores.stores
                    this.effectivescopeData = [...storesList]
                    const brandList = classGrands.brandList
                    this.categoryinfoData = [...brandList]
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
        detailsSumbit () {
            this.feeData.length = 0
            this.supplyinfoData.length = 0
            this.categoryinfoData.length = 0
            this.effectivescopeData.length = 0
            this.previewSum = {}
            axios({
                path: 'ProviderQuery',
                method: 'POST',
                body: {
                    code: this.orderId
                }
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
                this.detailsSumbit()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-03-25 10:46:38
 * @LastEditTime: 2019-08-15 14:39:52
 -->
<template>
  <div class="page-header-index-wide">
    <a-tabs :activeKey="activeKey" tabPosition="left" @change="tabChange" size="large">
      <a-tab-pane tab="基本设置" :key="1">
        <div class="setting-box">
          <BaseSetting/>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="安全设置" :key="2">
        <div class="setting-box">
          <Security/>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="个性设置" :key="3">
        <div class="setting-box">
          <Custom/>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="账户绑定" :key="4">
        <div class="setting-box">
          <Binding/>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="消息通知" :key="5">
        <div class="setting-box">
          <Notification/>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="待办事项" :key="6">
        <div class="setting-box">
          <ToDoList @onShowPreview="onShowPreview"/>
        </div>
      </a-tab-pane>
    </a-tabs>
    <purchaseFundPreview v-model="previewVisbel.purchaseFund" :orderId="orderId"></purchaseFundPreview>
    <discountApprovalPreview v-model="previewVisbel.DistributionDiscountApprovalForm" :orderId="orderId"></discountApprovalPreview>
    <SupplierPaymentPreview v-model="previewVisbel.SupplierPayment" :orderId="orderId"></SupplierPaymentPreview>
    <jointPreview v-model="previewVisbel.jointVentureContract" :orderId="orderId"></jointPreview>
    <selfPreview v-model="previewVisbel.selfOperatedContract" :orderId="orderId"></selfPreview>
    <acquisitionStrategyPreview v-model="previewVisbel.acquisitionStrategy" :orderId="orderId"></acquisitionStrategyPreview>
    <purchaseOrderPreview v-model="previewVisbel.purchaseOrder" :orderId="orderId"></purchaseOrderPreview>
    <goodsPresellDeployPreview v-model="previewVisbel.goodsPresellDeploy" :orderId="orderId"></goodsPresellDeployPreview>
    <goodsStatusChangePreview v-model="previewVisbel.goodsStatusChange" :orderId="orderId"></goodsStatusChangePreview>
    <retailPricePreview v-model="previewVisbel.retailPrice" :orderId="orderId"></retailPricePreview>

    <wholesalePriceListPreview v-model="previewVisbel.wholesalePriceList" :orderId="orderId"></wholesalePriceListPreview>
    <wholesalePriceExaminePreview v-model="previewVisbel.wholesalePriceExamine" :orderId="orderId"></wholesalePriceExaminePreview>
    <wholesaleChannelPreview v-model="previewVisbel.wholesaleChannelist" :orderId="orderId"></wholesaleChannelPreview>
    <insideSellPricePreview v-model="previewVisbel.insideSellPriceStrategy" :orderId="orderId"></insideSellPricePreview>
    <allotInteriorPreview v-model="previewVisbel.allotInterior" :orderId="orderId"></allotInteriorPreview>
    <allotPrototypePreview v-model="previewVisbel.allotPrototype" :orderId="orderId"></allotPrototypePreview>
    <venderPrototypeBePutInStoragePreview v-model="previewVisbel.venderPrototypeBePutInStorage" :orderId="orderId"></venderPrototypeBePutInStoragePreview>
    <venderPrototypeCancellingStocksPreview v-model="previewVisbel.venderPrototypeCancellingStocks" :orderId="orderId"></venderPrototypeCancellingStocksPreview>
    <AdvanceReceiptManagementPreview v-model="previewVisbel.AdvanceReceiptManagement" :orderId="orderId"></AdvanceReceiptManagementPreview>
    <BlendingTheInvoicePreview v-model="previewVisbel.BlendingTheInvoice" :orderId="orderId"></BlendingTheInvoicePreview>

    <ManufacturerOfDiscountPreview v-model="previewVisbel.ManufacturerOfDiscount" :orderId="orderId"></ManufacturerOfDiscountPreview>
    <SupplierExpenseMonitoringSheetPreview v-model="previewVisbel.SupplierExpenseMonitoringSheet" :orderId="orderId"></SupplierExpenseMonitoringSheetPreview>
    <SupplierExpenseVerificationSheetPreview v-model="previewVisbel.SupplierExpenseVerificationSheet" :orderId="orderId"></SupplierExpenseVerificationSheetPreview>
    <SupplierSettlementPreview v-model="previewVisbel.SupplierSettlement" :orderId="orderId"></SupplierSettlementPreview>
    <CustomerQuotaManagementPreview v-model="previewVisbel.CustomerQuotaManagement" :orderId="orderId"></CustomerQuotaManagementPreview>
    <CustomerCollectionManagementPreview v-model="previewVisbel.CustomerCollectionManagement" :orderId="orderId"></CustomerCollectionManagementPreview>
    <CustomerAdvanceCollectionManagementPreview v-model="previewVisbel.CustomerAdvanceCollectionManagement" :orderId="orderId"></CustomerAdvanceCollectionManagementPreview>
    <CommissionSettlementPreview v-model="previewVisbel.CommissionSettlement" :orderId="orderId"></CommissionSettlementPreview>
    <ServiceRegistrationFormPreview v-model="previewVisbel.ServiceRegistrationForm" :orderId="orderId"></ServiceRegistrationFormPreview>
    <ArbitrageInFullGiftPreview v-model="previewVisbel.ArbitrageInFullGift" :orderId="orderId"></ArbitrageInFullGiftPreview>

    <ArbitrageInFullReturnPreview v-model="previewVisbel.ArbitrageInFullReturn" :orderId="orderId"></ArbitrageInFullReturnPreview>
    <ArbitrageInFullSubtractPreview v-model="previewVisbel.ArbitrageInFullSubtract" :orderId="orderId"></ArbitrageInFullSubtractPreview>
    <FullFreeActivePreview v-model="previewVisbel.FullFreeActive" :orderId="orderId"></FullFreeActivePreview>
    <SingleItemFullGiftPreview v-model="previewVisbel.SingleItemFullGift" :orderId="orderId"></SingleItemFullGiftPreview>
    <SingleItemFullReturnPreview v-model="previewVisbel.SingleItemFullReturn" :orderId="orderId"></SingleItemFullReturnPreview>
    <SingleItemFullSubtractPreview v-model="previewVisbel.SingleItemFullSubtract" :orderId="orderId"></SingleItemFullSubtractPreview>
    <vouchersActivityRulesPreview v-model="previewVisbel.VouchersActivityRules" :orderId="orderId"></vouchersActivityRulesPreview>
    <payeeControlPreview v-model="previewVisbel.PayeeControl" :orderId="orderId"></payeeControlPreview>
    <bundledGoodsPreview v-model="previewVisbel.BundledGoodsSettings" :orderId="orderId"></bundledGoodsPreview>
    <AAccountSettingsPreview v-model="previewVisbel.AAccountSettings" :orderId="orderId"></AAccountSettingsPreview>

    <BAccountItemSettingsPreview v-model="previewVisbel.BAccountItemSettings" :orderId="orderId"></BAccountItemSettingsPreview>
    <BAccountUsageSettingsPreview v-model="previewVisbel.BAccountUsageSettings" :orderId="orderId"></BAccountUsageSettingsPreview>
    <productInventoryPreview v-model="previewVisbel.ProductInventory" :orderId="orderId"></productInventoryPreview>
    <CommodityProfitAndLossPreview v-model="previewVisbel.CommodityProfitAndLoss" :orderId="orderId"></CommodityProfitAndLossPreview>
    <commodityUsePreview v-model="previewVisbel.CommodityUse" :orderId="orderId"></commodityUsePreview>
    <InventoryTypeChangePreview v-model="previewVisbel.InventoryTypeChange" :orderId="orderId"></InventoryTypeChangePreview>
    <RebateConfirmationPreview v-model="previewVisbel.RebateConfirmation" :orderId="orderId"></RebateConfirmationPreview>
    <DistributionDiscountFormPreview v-model="previewVisbel.DistributionDiscountForm" :orderId="orderId"></DistributionDiscountFormPreview>
  </div>
</template>

<script>
import { mixinDevice } from '@/utils/mixin.js'
import BaseSetting from './BaseSetting'
import Binding from './Binding'
import ToDoList from './ToDoList'
import Notification from './Notification'
import Security from './Security'
import Custom from './Custom'
// 预览
import purchaseFundPreview from '@pages//purchasing/purchaseFund/preview/purchaseFundPreview'
import jointPreview from '@pages/purchasing/contractManagement/preview/jointPreview'
import selfPreview from '@pages/purchasing/contractManagement/preview/selfPreview'
import acquisitionStrategyPreview from '@pages/purchasing/acquisitionStrategy/preview/acquisitionStrategyPreview'
import purchaseOrderPreview from '@pages/purchasing/purchaseOrder/preview/purchaseOrderPreview'
import goodsPresellDeployPreview from '@pages/purchasing/goodsPresellDeploy/preview/goodsPresellDeployPreview'
import goodsStatusChangePreview from '@pages/purchasing/goodsStatusChange/preview/goodsStatusChangePreview'
import retailPricePreview from '@pages/purchasing/pricePolicyManage/preview/retailPricePreview'
import wholesalePriceListPreview from '@pages/purchasing/pricePolicyManage/preview/wholesalePriceListPreview'
import wholesalePriceExaminePreview from '@pages/purchasing/pricePolicyManage/preview/wholesalePriceExaminePreview'
import wholesaleChannelPreview from '@pages/purchasing/pricePolicyManage/preview/wholesaleChannelPreview'
import insideSellPricePreview from '@pages/purchasing/pricePolicyManage/preview/insideSellPricePreview'
import allotInteriorPreview from '@pages/purchasing/allotManage/preview/allotInteriorPreview'
import allotPrototypePreview from '@pages/purchasing/allotManage/preview/allotPrototypePreview'
import venderPrototypeBePutInStoragePreview from '@pages/purchasing/venderPrototypeManage/preview/venderPrototypeBePutInStoragePreview'
import venderPrototypeCancellingStocksPreview from '@pages/purchasing/venderPrototypeManage/preview/venderPrototypeCancellingStocksPreview'

import AdvanceReceiptManagementPreview from '@pages/storage/SRWarehous/preview/AdvanceReceiptManagementPreview'

import SupplierPaymentPreview from '@pages/settlement/SupplierSettlementManagement/preview/SupplierPaymentPreview'
import BlendingTheInvoicePreview from '@pages/settlement/SupplierInvoiceManagement/preview/BlendingTheInvoicePreview'
import ManufacturerOfDiscountPreview from '@pages/settlement/SupplierInvoiceManagement/preview/ManufacturerOfDiscountPreview'
import SupplierExpenseMonitoringSheetPreview from '@pages/settlement/SupplierCostManagement/preview/SupplierExpenseMonitoringSheetPreview'
import SupplierExpenseVerificationSheetPreview from '@pages/settlement/SupplierCostManagement/preview/SupplierExpenseVerificationSheetPreview'
import SupplierSettlementPreview from '@pages/settlement/SupplierSettlementManagement/preview/SupplierSettlementPreview'
import CustomerQuotaManagementPreview from '@pages/settlement/DistrbutionCustomerSettlement/preview/CustomerQuotaManagementPreview'
import CustomerCollectionManagementPreview from '@pages/settlement/DistrbutionCustomerSettlement/preview/CustomerCollectionManagementPreview'
import CommissionSettlementPreview from '@pages/settlement/DistrbutionCustomerSettlement/preview/CommissionSettlementPreview'
import CustomerAdvanceCollectionManagementPreview from '@pages/settlement/DistrbutionCustomerSettlement/preview/CustomerAdvanceCollectionManagementPreview'

import ServiceRegistrationFormPreview from '@pages/aftersales/ServiceRegistrationForm/preview/ServiceRegistrationFormPreview'

import discountApprovalPreview from '@pages/marketing/DistributionManagement/DistributionDiscountApprovalForm/preview/preview'
import ArbitrageInFullGiftPreview from '@pages/marketing/ActivityRuleSheet/preview/ArbitrageInFullGiftPreview'
import ArbitrageInFullReturnPreview from '@pages/marketing/ActivityRuleSheet/preview/ArbitrageInFullReturnPreview'
import ArbitrageInFullSubtractPreview from '@pages/marketing/ActivityRuleSheet/preview/ArbitrageInFullSubtractPreview'
import FullFreeActivePreview from '@pages/marketing/ActivityRuleSheet/preview/FullFreeActivePreview'
import SingleItemFullGiftPreview from '@pages/marketing/ActivityRuleSheet/preview/SingleItemFullGiftPreview'
import SingleItemFullReturnPreview from '@pages/marketing/ActivityRuleSheet/preview/SingleItemFullReturnPreview'
import SingleItemFullSubtractPreview from '@pages/marketing/ActivityRuleSheet/preview/SingleItemFullSubtractPreview'
import vouchersActivityRulesPreview from '@pages/marketing/MarketingScheduleManagement/preview/vouchersActivityRulesPreview'
import payeeControlPreview from '@pages/marketing/MarketingScheduleManagement/preview/payeeControlPreview'
import bundledGoodsPreview from '@pages/marketing/BundledGoodsSettings/preview/bundledGoodsPreview'
import AAccountSettingsPreview from '@pages/marketing/StoreManagerCouponManagement/preview/AAccountSettingsPreview'
import BAccountItemSettingsPreview from '@pages/marketing/StoreManagerCouponManagement/preview/BAccountItemSettingsPreview'
import BAccountUsageSettingsPreview from '@pages/marketing/StoreManagerCouponManagement/preview/BAccountUsageSettingsPreview'
import productInventoryPreview from '@pages/marketing/InventoryManagement/preview/productInventoryPreview'
import CommodityProfitAndLossPreview from '@pages/marketing/WarehouseManagement/preview/CommodityProfitAndLossPreview'
import commodityUsePreview from '@pages/marketing/WarehouseManagement/preview/commodityUsePreview'
import InventoryTypeChangePreview from '@pages/marketing/WarehouseManagement/preview/InventoryTypeChangePreview'
import RebateConfirmationPreview from '@pages/marketing/DistributionManagement/preview/RebateConfirmationPreview'
import DistributionDiscountFormPreview from '@pages/marketing/DistributionManagement/preview/DistributionDiscountFormPreview'

export default {
    name: 'SettingsIndex',
    components: {
        BaseSetting,
        Binding,
        ToDoList,
        Notification,
        Security,
        Custom,
        purchaseFundPreview,
        discountApprovalPreview,
        SupplierPaymentPreview,
        jointPreview,
        selfPreview,
        acquisitionStrategyPreview,
        purchaseOrderPreview,
        goodsPresellDeployPreview,
        goodsStatusChangePreview,
        retailPricePreview,
        wholesalePriceListPreview,
        wholesalePriceExaminePreview,
        wholesaleChannelPreview,
        insideSellPricePreview,
        allotInteriorPreview,
        allotPrototypePreview,
        venderPrototypeBePutInStoragePreview,
        venderPrototypeCancellingStocksPreview,
        AdvanceReceiptManagementPreview,
        BlendingTheInvoicePreview,
        ManufacturerOfDiscountPreview,
        SupplierExpenseMonitoringSheetPreview,
        SupplierExpenseVerificationSheetPreview,
        SupplierSettlementPreview,
        CustomerQuotaManagementPreview,
        CustomerCollectionManagementPreview,
        CommissionSettlementPreview,
        CustomerAdvanceCollectionManagementPreview,
        ServiceRegistrationFormPreview,
        ArbitrageInFullGiftPreview,
        ArbitrageInFullReturnPreview,
        ArbitrageInFullSubtractPreview,
        FullFreeActivePreview,
        SingleItemFullGiftPreview,
        SingleItemFullReturnPreview,
        SingleItemFullSubtractPreview,
        vouchersActivityRulesPreview,
        payeeControlPreview,
        bundledGoodsPreview,
        AAccountSettingsPreview,
        BAccountItemSettingsPreview,
        BAccountUsageSettingsPreview,
        productInventoryPreview,
        CommodityProfitAndLossPreview,
        commodityUsePreview,
        InventoryTypeChangePreview,
        RebateConfirmationPreview,
        DistributionDiscountFormPreview
    },
    mixins: [mixinDevice],
    data () {
        return {
            activeKey: 1,
            previewVisbel: {
                // 分销折让审批
                DistributionDiscountApprovalForm: false,
                // 资金拨付审批
                purchaseFund: false,
                // 供应商付款
                SupplierPayment: false,
                // 联营合同
                jointVentureContract: false,
                // 自营合同
                selfOperatedContract: false,
                // 采购价格调整
                acquisitionStrategy: false,
                // 采购订单
                purchaseOrder: false,
                // 商品预售配置
                goodsPresellDeploy: false,
                // 商品状态变更
                goodsStatusChange: false,
                // 零售价格调整
                retailPrice: false,
                // 分销价格调整
                wholesalePriceList: false,
                // 分销特价审批单
                wholesalePriceExamine: false,
                // 分销渠道政策配置
                wholesaleChannelist: false,
                // 内部销售价格策略
                insideSellPriceStrategy: false,
                // 内部调拨
                allotInterior: false,
                // 样机调拨
                allotPrototype: false,
                // 厂家样机入库申请
                venderPrototypeBePutInStorage: false,
                // 厂家样机退库申请
                venderPrototypeCancellingStocks: false,
                // 预收/退库管理
                AdvanceReceiptManagement: false,
                // 发票勾兑
                BlendingTheInvoice: false,
                // 厂家折让
                ManufacturerOfDiscount: false,
                // 供应商费用监控单
                SupplierExpenseMonitoringSheet: false,
                // 供应商费用核销单
                SupplierExpenseVerificationSheet: false,
                // 供应商结算
                SupplierSettlement: false,
                // 客户限额管理
                CustomerQuotaManagement: false,
                // 客户预收款管理
                CustomerAdvanceCollectionManagement: false,
                // 客户结算管理
                CommissionSettlement: false,
                // 客户收款管理
                CustomerCollectionManagement: false,
                // 服务登记单
                ServiceRegistrationForm: false,
                ArbitrageInFullGift: false,
                ArbitrageInFullReturn: false,
                ArbitrageInFullSubtract: false,
                FullFreeActive: false,
                SingleItemFullGift: false,
                SingleItemFullReturn: false,
                SingleItemFullSubtract: false,
                // 用券活动规则单
                VouchersActivityRules: false,
                // 收款方式控制
                PayeeControl: false,
                // 捆绑商品设置
                BundledGoodsSettings: false,
                // A账户设置
                AAccountSettings: false,
                // B账户
                BAccountItemSettings: false,
                BAccountUsageSettings: false,
                ProductInventory: false,
                // 商品损益
                CommodityProfitAndLoss: false,
                // 商品领用
                CommodityUse: false,
                // 库存类型变更
                InventoryTypeChange: false,
                // 返利确认
                RebateConfirmation: false,
                // 分销折让单
                DistributionDiscountForm: false
            },
            orderId: '',
            approvalList: []
        }
    },
    created () {
        const key = this.$route.params
        this.activeKey = key.activeKey || 1
    },
    methods: {
        tabChange (e) {
            this.activeKey = e
            switch (e) {
            case 1:
                this.$route.meta.title = '基本设置'
                break
            case 2:
                this.$route.meta.title = '安全设置'
                break
            case 3:
                this.$route.meta.title = '个性化'
                break
            case 4:
                this.$route.meta.title = '账户绑定'
                break
            case 5:
                this.$route.meta.title = '新消息通知'
                break
            case 6:
                this.$route.meta.title = '待办事项'
                break
            default:
                break
            }
        },
        onShowPreview (item) {
            this.orderId = item.billCode
            if (item.contactId) {
                this.previewVisbel[item.contactId] = true
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .setting-box{
        padding: 20px;
    }
</style>

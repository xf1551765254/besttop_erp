/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-28 13:43:06
 */
// enum	        枚举类型	                        string	-
// len	        字段长度	                        number	-
// max	        最大长度	                        number	-
// message	    校验文案	                        string	-
// min	        最小长度	                        number	-
// pattern	    正则表达式校验	                     RegExp	-
// required	    是否必选	                        boolean	false
// transform	校验前转换字段值	                 function(value) => transformedValue:any	-
// type	        内建校验类型，可选项	              string	'string'
// whitespace	必选时，空格是否会被视为错误	        boolean	false

import is from 'is_js'
const VALIDATIONS = {
    base: {// 基础
        phone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        password: [{ pattern: /^[a-zA-Z0-9]{5,20}$/, message: '密码5-20位数字或字母' }, { required: true, message: '请输入密码' }],
        captcha: [{ required: true, message: '请输入验证码' }]
    },
    login: {// 登录
        username: [{ required: true, message: '请输入帐户名或邮箱地址' }]
    },
    user: {
        name: [{ required: true, message: '请输入用户名称!' }, { max: 10, message: '请输入10个字以内的用户名称' }],
        phone: [{ required: true, message: '请输入手机号!' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址!' }],
        storeId: [{ required: true, message: '请选择所属机构!' }]
    },
    rolemanage: {
        name: [{ required: true, message: '请输入角色名称!' }, { max: 10, message: '请输入10个字以内的角色名称' }]
    },
    store: {// 门店
        name: [{ required: true, message: '请输入机构全称' }, { max: 50, message: '请输入50个字以内的机构全称' }],
        region: [{ required: true, message: '请选择经营区域' }],
        // tele: [{ pattern: /(^([0-9]{2,3}-)?([0-9]{3,4}-)?([0-9]{7,8})$)|(^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$)/, message: '请输入正确的电话' }],
        type: [{ required: true, message: '请选择类型' }],
        chargerId: [{ required: true, message: '请选择负责人' }],
        sname: [{ required: true, message: '请输入简称' }, { max: 50, message: '请输入50个字以内的机构简称' }],
        bank: [{ max: 50, message: '请输入50个字以内的开户行' }],
        taxNo: [{ pattern: /^[a-zA-Z0-9]{0,18}$/, message: '请输入18位以内数字或字母' }],
        fax: [{ pattern: /^[0-9]{1}([0-9]|[-]){0,24}$/, message: '请输入25位以内数字或-' }],
        acctNo: [{ pattern: /^[a-zA-Z0-9]{0,20}$/, message: '请输入20位以内数字或字母' }]
    // address: [{ required: true, message: '请输入地址' }]
    },
    brand: {// 商品品牌
        name: [{ required: true, message: '请输入品牌名称' }, { max: 50, message: '请输入50字以内品牌名称' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    // 商品品类
    category: {
        name: [{ required: true, message: '请输入品类名称' }, { max: 50, message: '请输入50字以内品类名称' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    // 商品品类属性
    classProperty: {
        classId: [{ required: true, message: '请选择品类编码!' }],
        name: [{ required: true, message: '请输入品类属性名称!' }]
    },
    // 商品信息
    goods: {
        name: [{ required: true, message: '请输入商品名称' }, { max: 50, message: '请输入50字以内商品名称' }],
        shortName: [{ required: true, message: '请输入商品简称' }, { max: 50, message: '请输入50字以商品名称' }],
        classId: [{ required: true, message: '请选择商品品类' }],
        brandId: [{ required: true, message: '请选择品牌编码' }],
        model: [{ required: true, message: '请输入规格型号' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    SKU: {
        goodsCode: [{ required: true, message: '请选择商品' }],
        name: [{ required: true, message: '请输入SKU名称' }],
        discount: [{ required: true, message: '折扣最大值为100' }]
    },
    channel: {
        name: [{ required: true, message: '请输入客户名称' }, { max: 50, message: '请输入50字以内的客户名称!' }],
        sname: [{ required: true, message: '请输入客户简称' }, { max: 50, message: '请输入50字以内的客户简称!' }],
        person: [{ max: 50, message: '请输入50字以内的联系人!' }],
        telephone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        fax: [{ pattern: /^[0-9]{1}([0-9]|[-]){0,24}$/, message: '请输入25位以内数字或-' }],
        account: [{ pattern: /^[a-zA-Z0-9]{0,20}$/, message: '请输入20位以内数字或字母' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    provider: { // 供应商
        name: [{ required: true, message: '请输入供应商名称' }, { max: 50, message: '请输入50字以内的供应商名称!' }],
        type: [{ required: true, message: '请选择供应商类型' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    organization: {// 组织架构
        name: [{ required: true, message: '请输入架构名称' }, { max: 50, message: '请输入50字以内的架构名称!' }],
        type: [{ required: true, message: '请选择机构类型' }],
        status: [{ required: true, message: '请选择状态' }],
        // telephone: [{ pattern: /(^([0-9]{2,3}-)?([0-9]{3,4}-)?([0-9]{7,8})$)|(^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$)/, message: '请输入正确的电话' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    quarters: {// 岗位架构
        name: [{ required: true, message: '请输入岗位名称' }],
        organization: [{ required: true, message: '请选择隶属机构' }],
        note: [{ max: 255, message: '最长支持255个字符!' }],
        qualify: [{ max: 255, message: '最长支持255个字符!' }],
        duty: [{ max: 255, message: '最长支持255个字符!' }],
        auxiliaryDuty: [{ max: 255, message: '最长支持255个字符!' }]
    },
    floor: {// 店面楼层
        storeId: [{ required: true, message: '请选择机构' }],
        name: [{ required: true, message: '请输入楼层' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    layout: {// 店面地块
        floorId: [{ required: true, message: '请选择楼层' }],
        note: [{ max: 255, message: '最长支持255个字符!' }]
    },
    contract: {// 合同
        providerContractName: [{ required: true, message: '请输入合同名称' }],
        supplierCode: [{ required: true, message: '请选择供应商' }],
        organizeCode: [{ required: true, message: '请选择机构' }],
        signAddress: [{ required: true, message: '请选择签约地点' }],
        signDt: [{ required: true, message: '请选择签约时间' }],
        effectDate: [{ required: true, message: '请选择生效时间' }],
        expiryDate: [{ required: true, message: '请选择失效时间' }],
        signBy: [{ required: true, message: '请选择签订人' }],
        buyBy: [{ required: true, message: '请选择采购人' }],
        feeType: [{ required: true, message: '请选择费用类型' }],
        // feeAmount: [{ validator: (rule, value, callback) => { return value > 0 }, message: '请输入费用金额' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillPrice: {// 零售价格策略
        effectTime: [{ required: true, message: '请选择生效时间' }],
        originalCode: [{ max: 32, message: '输入内容不能超过32位' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillWholesalePrice: {// 批发价格单
        effectTime: [{ required: true, message: '请选择生效时间' }],
        originalCode: [{ max: 32, message: '输入内容不能超过32位' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillWholesaleApprove: {// 批发价格审批单
        customerCode: [{ required: true, message: '请选择客户' }],
        applyStoreCode: [{ required: true, message: '请选择申请位置' }],
        originalCode: [{ max: 32, message: '输入内容不能超过32位' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillInsidePrice: {// 内部销售价格策略
        effectTime: [{ required: true, message: '请选择生效时间' }],
        originalCode: [{ max: 32, message: '输入内容不能超过32位' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillAppropriation: {// 采购资金拨付
        providerCode: [{ required: true, message: '请选择供应商' }],
        payType: [{ required: true, message: '请选择付款方式' }],
        saleBy: [{ required: true, message: '请选择业务员' }],
        payAmount: [{ required: true, message: '拨款金额不能为空!' }],
        effectTime: [{ required: true, message: '请选择生效时间' }],
        originalCode: [{ max: 32, message: '输入内容不能超过32位' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillPurchasePrice: {// 采购策略
        supplier: [{ required: true, message: '请选择供应商' }],
        contractCode: [{ required: true, message: '请选择合同编码' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    BillOrber: {// 采购订单
        noteC: [{ message: '请输入正确手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        noteA: [{ required: true, message: '请选择供应商' }],
        contractCode: [{ required: true, message: '请选择合同编码' }],
        receiveStoreCode: [{ required: true, message: '请选择收获位置' }],
        type: [{ required: true, message: '请选择采购类型' }],
        expectedArrivalDate: [{ required: true, message: '请选择收货时间' }],
        note: [{ max: 200, message: '输入内容不能超过200字' }]
    },
    Schedule: { // 营销  档期活动定义
        name: [{ required: true, message: '请输入档期名称' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        note: [{ max: 255, message: '输入的档期描述内容不能超过255位' }]
    },
    ElectronicCoinDefine: {
        name: [{ required: true, message: '请输入电子币类型' }, { max: 20, message: '输入的电子币类型不能超过20位' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    CouponDefinition: {
        name: [{ required: true, message: '请输入电子币类型' }, { max: 20, message: '输入的电子币类型不能超过20位' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    ElectronicCoinUse: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的电子币类型不能超过20位' }],
        scheduleCoinTypeDefineCode: [{ required: true, message: '请选择电子币类型' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        coinStandardAmount: [{ required: true, message: '请输入达标金额' }],
        coinReachAmount: [{ required: true, message: '请输入满金额' }],
        coinUseAmount: [{ required: true, message: '请输入用金额' }],
        coinMaxAmount: [{ required: true, message: '请输入上限金额' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    CouponRuleVli: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的电子币类型不能超过20位' }],
        scheduleCouponTypeDefineCode: [{ required: true, message: '请选择促销券类型' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        standardAmount: [{ required: true, message: '请输入达标金额' }],
        reachAmount: [{ required: true, message: '请输入满金额' }],
        useAmount: [{ required: true, message: '请输入用金额' }],
        maxAmount: [{ required: true, message: '请输入上限金额' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    CouponRulePulish: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的电子币类型不能超过20位' }],
        publishRange: [{ required: true, message: '请选择投放范围' }],
        ranges: [{ required: true, message: '请选择投放方式' }],
        status: [{ required: true, message: '请选择状态' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        couponType: [{ required: true, message: '请选择促销券类型' }],
        couponAmount: [{ required: true, message: '请输入券金额' }],
        couponSalePrice: [{ required: true, message: '请输入券销售金额' }],
        publishTotalQuantity: [{ required: true, message: '请输入投放总量' }],
        limitQuantity: [{ required: true, message: '请输入每人限领数' }],
        couponStartTime: [{ required: true, message: '请选择券开始日期' }],
        couponEndTime: [{ required: true, message: '请选择券结束日期' }],
        shareTitle: [{ max: 10, message: '输入的备注内容不能超过10位' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    ActivityRule: { //  营销  档期活动规则
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的规则名称不能超过20位' }],
        scheduleDefineId: [{ required: true, message: '请选择活动名称' }],
        ifChange: [{ required: true, message: '请选择金额是否可修改' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        effectDate: [{ required: true, message: '请选择截至日期' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }],
        scheduleCoinTypeDefineCode: [{ required: true, message: '请选择电子币类型' }],
        standardAmount: [{ required: true, message: '请输入达标金额' }],
        reachAmount: [{ required: true, message: '请输入满金额' }],
        maxAmount: [{ required: true, message: '请输入上限金额' }]
    },
    ServiceCouponRules: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的规则名称不能超过20位' }],
        scheduleDefineCode: [{ required: true, message: '请选择活动名称' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        serviceEffectDate: [{ required: true, message: '请选择服务生效日期' }],
        serviceExpireDate: [{ required: true, message: '请选择服务失效日期' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    LimitedPrice: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的规则名称不能超过20位' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    GiftRuleSheet: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的规则名称不能超过20位' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    ExtendWarranty: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 20, message: '输入的规则名称不能超过20位' }],
        skuType: [{ required: true, message: '请选择商品类型' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    ElectronicTicketDefine: { //  营销  电子券类型定义
        name: [{ required: true, message: '请输入券类型' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }],
        amount: [{ required: true, message: '请输入券金额' }]
    },
    BundleGoods: { //   营销    捆绑商品设置
        applyBy: [{ required: true, message: '请选择申请人' }],
        endTime: [{ required: true, message: '请选择结束时间' }],
        startTime: [{ required: true, message: '请选择开始时间' }],
        bindQuantity: [{ required: true, message: '请选择捆绑限制' }],
        mainSkuPrice: [{ required: true, message: '请输入捆绑后售价' }],
        mainSkuCodeSame: [{ required: true, message: '请输入主销售商品' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    CountDefinition: { //  营销  盘点定义
        storeCode: [{ required: true, message: '请选择盘点分店' }],
        stocktakingTime: [{ required: true, message: '请选择盘点日期' }],
        creatType: [{ required: true, message: '请选择生成标志' }]
    },
    ProductInventory: { // 营销  商品盘点单
        stocktakingBy: [{ required: true, message: '请选择盘点人' }],
        stocktakingTime: [{ required: true, message: '请选择盘点日期' }]
    },
    // 营销 A账户设置
    accountSet: {
        businessUnit: [
            { required: true, message: '请选择机构' }
        ],
        effectTime: [{ required: true, message: '请选择生效时间' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 B账户商品配置
    bAccountltemData: {
        effectTime: [
            { required: true, message: '请选择生效时间！' }
        ],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销  B账户使用配置
    bAccountUsageData: {
        effectTime: [
            { required: true, message: '请选择生效时间' }
        ]
    },
    couponSetting: {
        effectTime: [{ required: true, message: '请选择生效时间' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销  商品损益
    commodityProfitData: {
        billType: [{ required: true, message: '请选择损益类型' }],
        applyBy: [{ required: true, message: '请选择申请人' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 商品领用
    commodityUseData: {
        useBy: [{ required: true, message: '请选择领用人' }],
        type: [{ required: true, message: '请选择领用类型' }],
        useTime: [{ required: true, message: '请选择领用时间' }],
        chargeBy: [{ required: true, message: '请选择负责人' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 库存类型变更
    inventoryTypeData: {
        type: [
            { required: true, message: '请选择变更类型' }
        ],
        applyBy: [
            { required: true, message: '请选择申请人' }
        ],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    bAccountltemDetailsData: {

    },
    // 营销 收款方式控制
    payeeControlData: {
        effectTime: [
            { required: true, message: '请选择生效时间！' }
        ],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 分销折让审批单
    DistributionDiscountApprovalForm: {
        customerCode: [{ required: true, message: '请选择客户' }],
        chargeBy: [{ required: true, message: '请选择负责人' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 分销折让单
    DistributionDiscountForm: {
        customerCode: [{ required: true, message: '请选择客户' }],
        chargeBy: [{ required: true, message: '请选择负责人' }],
        type: [{ required: true, message: '请选择折让类型' }],
        wholesaleAllowancesWay: [{ required: true, message: '请选择折让方式' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销 返利确认
    RebateConfirmation: {
        strategyDefineCode: [{ required: true, message: '请选择政策名称' }],
        customerCode: [{ required: true, message: '请选择客户' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255字' }]
    },
    // 营销  参数配置
    ParameterConfig: {
        type: [{ required: true, message: '请选择参数类型' }],
        effectFlag: [{ required: true, message: '请选择生效类型' }]
    },
    // 导购开票添加顾客
    customer: {
        telephone: [{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        name: [{ required: true, message: '请输入顾客姓名' }],
        sex: [{ required: true, message: '请选择性别' }],
        address: [{ required: true, message: '请添加地址' }],
        addressDetail: [{ required: true, message: '请输入详细地址' }]
    },
    // 导购开票添加税票
    invoice: {
        invoiceName: [{ required: true, message: '请输入发票抬头' }],
        invoiceCode: [{ required: true, message: '请输入纳税人识别号' }],
        telephone: [{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]
    },
    // 导购开票添加顾客地址
    customerAddress: {
        telephone: [{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        name: [{ required: true, message: '请输入顾客姓名' }],
        address: [{ required: true, message: '请输入详细地址' }],
        isDefault: [{ required: true, message: '请选择是否默认' }]
    },
    // 商品预售配置
    billpresale: {
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },

    // 商品状态变更
    billChange: {
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    // 预约管理
    management: {
        bookingTitle: [{ required: true, message: '请输入标题' }, { max: 255, message: '输入内容不能超过255字' }],
        bookingType: [{ required: true, message: '请选择预约类型' }]
    },
    // 发票登记
    InvoiceJion: {
        invoiceTimes: [{ required: true, message: '请选择开票日期!' }],
        provider: [{ required: true, message: '请选择供应商!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    // 批发渠道政策
    wholesaleStrategyDefine: {
        name: [{ required: true, message: '请输入单据名称!' }],
        classCode: [{ required: true, message: '请选择商品品类' }],
        brandCode: [{ required: true, message: '请选择商品品牌!' }],
        beginTime: [{ required: true, message: '请选择开始时间!' }],
        endTime: [{ required: true, message: '请选择结束时间!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    organizational: {

    },
    // 厂家折让
    BillRebate: {
        sourceCode: [{ max: 32, message: '输入内容不能超过32位' }],
        provider: [{ required: true, message: '供应商不能为空!' }]
    },
    // crm 顾客信息  税票
    customerInformation: {
        telephone: [{ required: true, message: '请输入联系方式' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        address: [{ max: 100, message: '输入的地址内容不能超过100位' }],
        addressDetail: [{ max: 100, message: '输入的详情地址内容不能超过100位' }],
        invoiceName: [{ required: true, message: '请输入发票抬头' }, { max: 50, message: '发票抬头输入内容不能超过50位' }],
        invoiceCode: [{ required: true, message: '请输入纳税人识别号' }, { min: 6, message: '识别号输入内容不能小于6位' }, { max: 60, message: '识别号输入内容不能超过50位' }],
        bankName: [{ required: true, message: '请输入开户行名称' }, { max: 50, message: '开户行名称输入内容不能超过50位' }],
        bankCode: [{ required: true, message: '请输入开户行账号' }, { max: 50, message: '开户行账号输入内容不能超过50位' }, { pattern: /^\d+$/, message: '请输入正确的开户行账号' }]
    },
    // crm 新增编辑 顾客信息
    customerAddEditInformation: {
        name: [{ required: true, message: '请输入姓名' }, { max: 50, message: '姓名输入内容不能超过50位' }],
        telephone: [{ required: true, message: '请输入联系方式' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        idCard: [{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号码' }],
        address: [{ required: true, message: '请选择地址' }, { max: 100, message: '输入的地址内容不能超过100位' }],
        addressDetail: [{ max: 100, message: '输入的详情地址内容不能超过100位' }],
        position: [{ max: 30, message: '输入的职位内容不能超过30位' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    // crm 顾客信息 顾客地址
    customerInforAddress: {
        name: [{ required: true, message: '请输入姓名' }, { max: 50, message: '姓名输入内容不能超过50位' }],
        telephone: [{ required: true, message: '请输入联系方式' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        address: [{ required: true, message: '请选择地址' }, { max: 100, message: '输入的地址内容不能超过100位' }],
        addressDetail: [{ max: 100, message: '输入的详情地址内容不能超过100位' }]
    },
    CardTypeDefinition: {
        typeName: [{ required: true, message: '请输入卡类型名称' }, { max: 20, message: '姓名输入内容不能超过20位' }],
        expiryDate: [{ required: true, message: '请输入有效期（月）' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    CustomerTransfer: {
        outStoreCode: [{ required: true, message: '请选择所属机构' }],
        inStoreCode: [{ required: true, message: '请选择所属机构' }],
        transferOutCode: [{ required: true, message: '请选择转出人' }],
        transferInCode: [{ required: true, message: '请选择转入人' }]
    },
    // crm  卡管理   卡定义
    BlankCardStorage: {
        typeName: [{ required: true, message: '请选择卡类型' }],
        beginNumber: [{ required: true, message: '请输入卡开始号码' }, { pattern: /^\d+$/, message: '请输入正确的开始号码' }],
        endNumber: [{ required: true, message: '请输入卡结束号码' }, { pattern: /^\d+$/, message: '请输入正确的结束号码' }]
    },
    // crm  卡管理   卡制作
    cardProduction: {
        typeName: [{ required: true, message: '请选择卡名称' }],
        beginNumber: [{ required: true, message: '请输入卡开始号码' }, { pattern: /^\d{8}$/, message: '请输入正确的开始号码' }],
        endNumber: [{ required: true, message: '请输入卡结束号码' }, { pattern: /^\d{8}$/, message: '请输入正确的结束号码' }]
    },
    // crm  卡管理   卡规则定义
    StoredValueRules: {
        name: [{ required: true, message: '请输入规则名称' }, { max: 50, message: '规则名称输入内容不能超过50位' }],
        limitValue: [{ required: true, message: '请输入定义额度' }],
        sendValue: [{ required: true, message: '请输入赠送额度' }],
        sendValue1: [{ required: true, message: '请输入折扣' }],
        type: [{ required: true, message: '请选择定义类型' }],
        modifyFlag: [{ required: true, message: '请选择是否可修改额度' }],
        startTime: [{ required: true, message: '请选择开始日期' }],
        endTime: [{ required: true, message: '请选择结束日期' }]

    },
    // crm  卡管理   卡领用
    cardRecipients: {
        distributeBy: [{ required: true, message: '请选择领用人' }],
        managerBy: [{ required: true, message: '请选择负责人' }],
        distributeStore: [{ required: true, message: '请选择领用店' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    // crm  卡管理   卡储值
    cardStoredValue: {
        typeName: [{ required: true, message: '请输入卡名称' }, { max: 50, message: '卡名称输入内容不能超过50位' }],
        beginNumber: [{ pattern: /^\d{8}$/, message: '请输入正确的开始号码' }],
        endNumber: [{ pattern: /^\d{8}$/, message: '请输入正确的结束号码' }],
        evaluationBy: [{ required: true, message: '请选择储值人' }],
        cardRuleCode: [{ required: true, message: '请选择规则名称' }],
        cardAmount: [{ required: true, message: '请输入存款额度' }],
        sendAmount: [{ required: true, message: '请输入赠送额度' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    // crm  卡管理   卡维护
    cardMaintenance: {
        telephone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]
    },
    // crm  营销管理   积分生成规则
    IntegralGenerate: {
        paidAmount: [{ required: true, message: '请输入付款金额' }],
        pointAmoun: [{ required: true, message: '请输入积分金额' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    // crm  营销管理   积分生成规则
    IntegralExchange: {
        pointAmount: [{ required: true, message: '请输入积分金额' }],
        couponAmount: [{ required: true, message: '请输入电子券额度' }],
        convertAmount: [{ required: true, message: '请输入可兑换量' }],
        status: [{ required: true, message: '请选择状态' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]
    },
    // crm  营销管理   广告管理
    AdvertisingManagement: {
        titles: [{ required: true, message: '请输入广告标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    // crm  营销管理   活动管理
    ActiveManagement: {
        titles: [{ required: true, message: '请输入广告标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        subtitle: [{ required: true, message: '请输入副标题' }],
        content: [{ required: true, message: '请输入内容' }],
        scheduleType: [{ required: true, message: '请选择活动类型' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    // crm  营销管理   每周推荐
    WeekRecommended: {
        yearWeek: [{ required: true, message: '请选择年周' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    // crm  营销管理   每周推荐
    HotRecommended: {
        salePercent: [{ required: true, message: '请输入销售占比' }],
        newPercent: [{ required: true, message: '请输入新品占比' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    // crm  系统管理 消息模板
    MessageTemplate: {
        newsName: [{ required: true, message: '请输入消息名称' }, { max: 20, message: '输入的消息名称不能超过20位' }],
        pushMode: [{ required: true, message: '请选择推送方式' }],
        pushContent: [{ required: true, message: '请输入推送内容' }],
        operationType: [{ required: true, message: '请选择操作类型' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]

    },
    // crm  系统管理 通知管理
    notificationManagement: {
        titles: [{ required: true, message: '请输入标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        subtitle: [{ required: true, message: '请输入副标题' }, { max: 50, message: '输入的标题不能超过50位' }],
        sendContent: [{ required: true, message: '请输入内容' }],
        userRange: [{ required: true, message: '请选择用户范围' }],
        sendType: [{ required: true, message: '请选择发送类型' }],
        sendMode: [{ required: true, message: '请选择发送方式' }]

    },
    // crm  系统管理 内容管理
    ContentManagement: {
        className: [{ required: true, message: '请输入内容' }],
        titles: [{ required: true, message: '请输入标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        subtitle: [{ required: true, message: '请输入副标题' }, { max: 50, message: '输入的标题不能超过50位' }],
        sendContent: [{ required: true, message: '请输入内容' }],
        status: [{ required: true, message: '请选择状态' }],
        note: [{ max: 255, message: '输入的备注内容不能超过255位' }]

    },
    // crm  系统管理 内容管理
    IntegralDescription: {
        titles: [{ required: true, message: '请输入标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        sendContent: [{ required: true, message: '请输入内容' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    // crm  服务管理 服务内容管理
    ServiceContent: {
        titles: [{ required: true, message: '请输入服务标题' }, { max: 20, message: '输入的标题不能超过20位' }],
        status: [{ required: true, message: '请选择状态' }]
    },
    BillPay: {
        provider: [{ required: true, message: '供应商不能为空!' }],
        contractCode: [{ required: true, message: '合同编码不能为空!' }],
        closeTime: [{ required: true, message: '截止时间不能为空!' }]
    },
    stocktakDefine: {
        stocktakingDate: [{ required: true, message: '盘点日期不能为空!' }],
        stocktakingStart: [{ required: true, message: '开始时间不能为空!' }],
        stocktakingEnd: [{ required: true, message: '结束时间不能为空!' }]
    },
    role: {
        feeName: [{ required: true, message: '请输入费用项目名称!' }, { max: 32, message: '输入内容不能超过32字符' }]
    },
    providerFee: {
        sourceOrganize: [{ required: true, message: '请选择机构!' }],
        type: [{ required: true, message: '请选择单据类型!' }]

    },
    providerFeeFact: {
        provider: [{ required: true, message: '请选择供应商!' }]
    },
    approval: {
        billCode: [{ required: true, message: '请选择单据类型!' }],
        name: [{ required: true, message: '请输入流程名称!' }, { max: 20, message: '流程名称不能超过20字' }],
        storeCode: [{ required: true, message: '请选择机构!' }],
        datatime: [{ required: true, message: '请选择时间!' }],
        note: [{ max: 255, message: '备注内容不能超过255字' }]
    },
    billSum: {
        provider: [{ required: true, message: '请选择供应商!' }],
        payMode: [{ required: true, message: '请选择付款方式!' }],
        payInvno: [{ required: true, message: '请输入付款凭证!' }],
        invoiceNo: [{ required: true, message: '请输入发票号码!' }]
    },
    custDelayPaySet: {// 客户延期付款
        storeCode: [{ required: true, message: '请选择机构!' }],
        custCode: [{ required: true, message: '请选择客户!' }],
        beginTime: [{ required: true, message: '请选择申请开始时间!' }],
        endTime: [{ required: true, message: '请选申请结束时间!' }],
        delayAmount: [{ required: true, message: '请输入金额!' }],
        makeNote: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }],
        payTime: [{ required: true, message: '请选择实际付款日期!' }],
        payNote: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    // 分销退货
    DistributionReturn: {
        customerCode: [{ required: true, message: '请选择客户' }],
        receiveCustomerPhone: [{ required: true, message: '请输入手机号' }],
        receiveCustomerAddress: [{ required: true, message: '请输入地址' }],
        takeType: [{ required: true, message: '请选择提货方式' }],
        takeStoreCode: [{ required: true, message: '请选择提货位置' }],
        wholesaleType: [{ required: true, message: '请选择经营类型' }]

    },
    billCustLimitSet: { // 分销客户限额
        applyUserCode: [{ required: true, message: '请选择申请人!' }]
    },
    billPreReceive: {// 客户预收款单
        applyUserCode: [{ required: true, message: '请选择申请人!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    bill_sample_entry: {// 厂家样机退库
        provider: [{ required: true, message: '请选择供应商!' }],
        storeCode: [{ required: true, message: '请选择退库位置!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    bill_sample_entryA: {// 厂家样机入库
        provider: [{ required: true, message: '请选择供应商!' }],
        storeCode: [{ required: true, message: '请选择收货位置!' }],
        recDt: [{ required: true, message: '请选择收货时间!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    bill_sample_allot: {// 厂家样机调拨
        inStoreCode: [{ required: true, message: '请选择调入位置!' }],
        outStoreCode: [{ required: true, message: '请选择调出位置!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    billReceive: {// 客户收款单
        custNo: [{ required: true, message: '请选择渠道客户!' }],
        receiveMode: [{ required: true, message: '请输入收款方式!' }],
        receiveInvoiceNo: [{ required: true, message: '请输入收款凭证!' }],
        receiveDate: [{ required: true, message: '请选择收货日期!' }],
        invoiceNo: [{ required: true, message: '请输入发票号!' }],
        factReceive: [{ required: true, message: '请输入实收金额!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 200, message: '输入内容不能超过200字' }]
    },
    logisticsRoute: {// 线路管理
        name: [{ required: true, message: '请输入线路名称!' }]
    },
    logisticsVehicle: {// 车辆管理
        code: [{ required: true, pattern: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1,2}$/, message: '请输入正确的车牌号' }],
        style: [{ required: true, message: '请选择车辆类型!' }],
        driverCode: [{ required: true, message: '请选择司机!' }],
        weight: [{ required: true, message: '请输入总重量!' }],
        checkWeight: [{ required: true, message: '请输入核定载重!' }],
        width: [{ required: true, message: '请输入车宽!' }],
        height: [{ required: true, message: '请输入车高!' }],
        axis: [{ required: true, message: '请选择轴数!' }]
    },
    logisticsDriver: {// 司机管理
        name: [{ required: true, message: '请选择司机!' }],
        phone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]
    },
    logisticsHamal: {// 搬运工管理
        name: [{ required: true, message: '请选择司机!' }],
        phone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]
    },
    logisticsTpl: {
        name: [{ required: true, message: '请输入公司名称!' }],
        unitCost: [{ required: true, message: '请输入单件费用!' }],
        contacts: [{ required: true, message: '请输入公司联系人!' }],
        contactsPhone: [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]

    },
    billRequ: {// 门店要货
        fromStoreCode: [{ required: true, message: '请选择出货位置!' }],
        applyBy: [{ required: true, message: '请选择申请人!' }],
        applyTime: [{ required: true, message: '请选择申请时间!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    billAllotC: {// 仓库配货
        sourceStoreCode: [{ required: true, message: '请选择调出位置!' }],
        destinationStoreCode: [{ required: true, message: '请选择调入位置!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    billEntry: {// 预收退货管理
        provider: [{ required: true, message: '请选择供应商!' }],
        recType: [{ required: true, message: '请选择类型!' }],
        recDt: [{ required: true, message: '请选择收/退货日期!' }],
        note: [{ required: false, message: '请输入备注' }, { max: 250, message: '输入内容不能超过250字' }]
    },
    bill_entry: {// 预收退货管理
        provider: [{ required: true, message: '请选择供应商!' }],
        entryBy: [{ required: true, message: '请选择验货人!' }],
        note: [{ max: 250, message: '输入内容不能超过250字' }]
    },
    applyWithdrawing: {// 退库申请
        providerCode: [{ required: true, message: '请选择供应商!' }],
        applyStore: [{ required: true, message: '请选择退货位置!' }],
        applyBy: [{ required: true, message: '请选择申请人!' }],
        note: [{ max: 250, message: '输入内容不能超过250字' }]
    },
    logistics_dispatching_group: {// 调度组管理
        upStoreCode: [{ required: true, message: '请选择公司!' }],
        groupName: [{ required: true, message: '请输入调度组名称!' }],
        sourceType: [{ required: true, message: '请选择派工单来源!' }],
        note: [{ max: 250, message: '输入内容不能超过250字' }]
    },
    // 售后 预约单管理
    ServiceRegistrateForm: {
        type: [{ required: true, message: '请选择单据类型' }],
        orderInstallTime: [{ required: true, message: '请选择预约时间' }],
        troubleApplyNote: [{ max: 255, message: '输入问题描述内容不能超过255字' }],
        troubleTitle: [{ required: true, message: '请输入问题标题' }, { max: 20, message: '输入问题标题内容不能超过20字' }],
        telephone: [{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }]
    },
    // 售后 售后监控管理
    AftersalesMonitoring: {
        chargeBy: [{ required: true, message: '请选择负责人' }],
        dispatchNote: [{ max: 255, message: '输入备注内容不能超过255字' }]
    },
    modelType: {// 件型信息
        name: [{ required: true, message: '请输入件型名称!' }, { max: 32, message: '输入内容不能超过32字符' }],
        description: [{ max: 250, message: '输入件型内容不能超过250字' }]
    },
    customerCRM: {
        name: [{ required: true, message: '请输入顾客姓名!' }],
        telephone: [{ required: true, message: '请输入手机号' }, { pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号' }],
        address: [{ required: true, message: '请选择地址' }],
        addressDetail: [{ required: true, message: '请输入详细地址' }]
    },
    WithdrawingDocuments: {// 采购退库
        entryBy: [{ required: true, message: '请选择验收人！' }]
    },
    cancellingStocks: {// 退库
        provider: [{ required: true, message: '请选择供应商！' }],
        entryBy: [{ required: true, message: '请选择验收人！' }]
    }
}

function plugin (Vue) {
    if (plugin.installed) {
        return
    }
    !Vue.prototype.$check && Object.defineProperties(Vue.prototype, {
        $check: {
            get () {
                return (data, options = {}, handle) => {
                    const [type, key] = data.split('.')
                    let rules
                    if (is.object(VALIDATIONS[type]) && is.array(VALIDATIONS[type][key])) {
                        rules = [...VALIDATIONS[type][key]]
                    } else {
                        rules = []
                    }
                    is.function(handle) && (rules.push({ validator: handle }))
                    if ('rules' in options) { delete options.rules }
                    return [
                        key,
                        {
                            ...options,
                            rules
                        }
                    ]
                }
            }
        }
    })
}
export default plugin

/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-27 10:55:59
 */
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'
import { bxAnaalyse } from '@/core/icons'
/**
 * @name: 用户公共页面
 * @msg:
 * @param {type}
 * @return:
 */
const publicRouterMap = [
    // dashboard
    {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/Workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
            {
                path: '/dashboard/Analysis',
                name: 'Analysis',
                component: () => import('@/views/dashboard/analysis'),
                meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
            },
            {
                path: '/dashboard/Monitor',
                name: 'Monitor',
                component: () => import('@/views/dashboard/Monitor'),
                meta: { title: '监控页', keepAlive: true, permission: [ 'dashboard' ] }
            },
            {
                path: '/dashboard/Workplace',
                name: 'Workplace',
                component: () => import('@/views/dashboard/workplace'),
                meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
            },
            {
                path: '/dashboard/*', redirect: '/403', hidden: true
            }

        ]
    },
    // result
    {
        path: '/result',
        name: 'result',
        component: PageView,
        hidden: true,
        redirect: '/result/success',
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
            {
                path: '/result/success',
                name: 'ResultSuccess',
                component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
                meta: { title: '成功', hiddenHeaderContent: true, permission: [ 'result' ] }
            },
            {
                path: '/result/fail',
                name: 'ResultFail',
                component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
                meta: { title: '失败', hiddenHeaderContent: true, permission: [ 'result' ] }
            },
            {
                path: '/result/*', redirect: '/403', hidden: true
            }
        ]
    },

    // account
    {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        hidden: true,
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
            {
                path: '/account/center',
                name: 'center',
                component: () => import('@/views/account/center/Index'),
                meta: { title: '功能配置', keepAlive: true, permission: [ 'user' ] }
            },
            {
                path: '/account/settings',
                name: 'settings',
                component: () => import('@/views/account/settings/Index'),
                meta: { title: '个人设置', hideHeader: true, keepAlive: true, permission: [ 'user' ] },
                alwaysShow: true
            },
            {
                path: '/account/*', redirect: '/403', hidden: true
            }
        ]
    }
]
/**
 * @name: 元数据路由结构
 * @msg:
 * @param {type}
 * @return:
 */
export const metadataRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '元数据首页' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            // organization
            {
                path: '/organization',
                name: 'organization',
                redirect: '/organization/storefrontInformation',
                component: RouteView, // PageView,
                meta: { title: '组织管理', icon: 'metadata', permission: [ 'organization' ] },
                children: [
                    {
                        path: '/organization/organizationalStructure',
                        name: 'OrganizationalStructure',
                        component: () => import('@/pages/metadata/organization/organizationalStructure'),
                        meta: { title: '架构信息', keepAlive: true, permission: [ 'organizationalStructure' ] }
                    },
                    {
                        path: '/organization/storefrontInformation',
                        name: 'storefrontInformation',
                        component: () => import('@/pages/metadata/organization/storefrontInformation'),
                        meta: { title: '机构信息', keepAlive: true, permission: [ 'storefrontInformation' ] }
                    },
                    // {
                    //     path: '/organization/quartersStructure',
                    //     name: 'quartersStructure',
                    //     component: () => import('@/pages/metadata/organization/quartersStructure'),
                    //     meta: { title: '岗位架构', keepAlive: true, permission: [ 'quartersStructure' ] }
                    // },
                    // {
                    //     path: '/organization/storefrontFloor',
                    //     name: 'storefrontFloor',
                    //     component: () => import('@/pages/metadata/organization/storefrontFloor'),
                    //     meta: { title: '店面楼层', keepAlive: true, permission: [ 'storefrontFloor' ] }
                    // },
                    // {
                    //     path: '/organization/storefrontPlot',
                    //     name: 'storefrontPlot',
                    //     component: () => import('@/pages/metadata/organization/storefrontPlot'),
                    //     meta: { title: '店面地块', keepAlive: true, permission: [ 'storefrontPlot' ] }
                    // },
                    {
                        path: '/organization/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // customerManagement
            {
                path: '/customerManagement',
                name: 'customerManagement',
                component: RouteView,
                redirect: '/customerManagement/supplier',
                meta: { title: '客户管理', icon: 'client', permission: [ 'customerManagement' ] },
                children: [
                    {
                        path: '/customerManagement/supplier',
                        name: 'supplier',
                        component: () => import('@/pages/metadata/customerManagement/supplier'),
                        meta: { title: '供应商管理', keepAlive: true, permission: [ 'supplier' ] }
                    },
                    {
                        path: '/customerManagement/channelCustomers',
                        name: 'channelCustomers',
                        component: () => import('@/pages/metadata/customerManagement/channelCustomers'),
                        meta: { title: '渠道客户管理', keepAlive: true, permission: [ 'channelCustomers' ] }
                    },
                    {
                        path: '/customerManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // commodityManagement
            {
                path: '/commodityManagement',
                name: 'commodityManagement',
                component: RouteView,
                redirect: '/commodityManagement/commodityCategory',
                meta: { title: '商品管理', icon: 'commodityManagement', permission: [ 'commodityManagement' ] },
                children: [
                    {
                        path: '/commodityManagement/commodityCategory',
                        name: 'CommodityCategory',
                        component: () => import('@/pages/metadata/commodityManagement/commodityCategory'),
                        meta: { title: '商品品类', keepAlive: true, permission: [ 'commodityCategory' ] }
                    },
                    {
                        path: '/commodityManagement/commodityBrand',
                        name: 'commodityBrand',
                        component: () => import('@/pages/metadata/commodityManagement/commodityBrand'),
                        meta: { title: '商品品牌', keepAlive: true, permission: [ 'commodityBrand' ] }
                    },
                    {
                        path: '/commodityManagement/commodityInfo',
                        name: 'commodityInfo',
                        component: () => import('@/pages/metadata/commodityManagement/commodityInfo'),
                        meta: { title: '商品信息', keepAlive: true, permission: [ 'commodityInfo' ] }
                    },
                    {
                        path: '/commodityManagement/commoditySKU',
                        name: 'commoditySKU',
                        component: () => import('@/pages/metadata/commodityManagement/commoditySKU'),
                        meta: { title: '商品SKU', keepAlive: true, permission: [ 'commoditySKU' ] }
                    },
                    {
                        path: '/commodityManagement/commodityCategoryProperty',
                        name: 'commodityCategoryProperty',
                        component: () => import('@/pages/metadata/commodityManagement/commodityCategoryProperty'),
                        meta: { title: '品类属性', keepAlive: true, permission: [ 'commodityCategoryProperty' ] }
                    },
                    {
                        path: '/commodityManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // authority
            {
                path: '/authority',
                name: 'authority',
                component: RouteView,
                redirect: '/authority/userManagement',
                meta: { title: '用户权限', icon: 'authority', permission: [ 'authority' ] },
                children: [
                    {
                        path: '/authority/userManagement',
                        name: 'userManagement',
                        component: () => import('@/pages/metadata/authority/userManagement'),
                        meta: { title: '用户管理', keepAlive: true, permission: [ 'userManagement' ] }
                    },
                    {
                        path: '/authority/roleManagement',
                        name: 'roleManagement',
                        component: () => import('@/pages/metadata/authority/roleManagement'),
                        meta: { title: '角色管理', keepAlive: true, permission: [ 'roleManagement' ] }
                    },
                    {
                        path: '/authority/dataPermission',
                        name: 'dataPermission',
                        component: () => import('@/pages/metadata/authority/dataPermission'),
                        meta: { title: '数据权限', keepAlive: true, permission: [ 'dataPermission' ] }
                    },
                    {
                        path: '/authority/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // customiz
            {
                path: '/customiz',
                name: 'customiz',
                component: RouteView,
                redirect: '/customiz/tableHeaderManagement',
                meta: { title: '系统定制', icon: 'systemset', permission: [ 'customiz' ] },
                children: [
                    // {
                    //     path: '/customiz/tableHeaderManagement',
                    //     name: 'tableHeaderManagement',
                    //     component: () => import('@/pages/metadata/customiz/tableHeaderManagement'),
                    //     meta: { title: '表头定制', keepAlive: true, permission: [ 'tableHeaderManagement' ] }
                    // },
                    {
                        path: '/customiz/parameter',
                        name: 'parameter',
                        component: () => import('@/pages/metadata/customiz/parameter'),
                        meta: { title: '参数配置', keepAlive: true, permission: [ 'parameter' ] }
                    },
                    // {
                    //     path: '/customiz/menuCustomiz',
                    //     name: 'menuCustomiz',
                    //     component: () => import('@/pages/metadata/customiz/menuCustomiz'),
                    //     meta: { title: '菜单名称定制', keepAlive: true, permission: [ 'menuCustomiz' ] }
                    // },
                    {
                        path: '/customiz/approvalProcessCustomiz',
                        name: 'approvalProcessCustomiz',
                        component: () => import('@/pages/metadata/customiz/approvalProcessCustomiz'),
                        meta: { title: '审批流程定制', keepAlive: true, permission: [ 'approvalProcessCustomiz' ] }
                    },
                    {
                        path: '/customiz/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // systemManagement
            {
                path: '/systemManagement',
                name: 'systemManagement',
                component: RouteView,
                redirect: '/systemManagement/systemLog',
                meta: { title: '系统管理', icon: 'system', permission: [ 'systemManagement' ] },
                children: [
                    {
                        path: '/systemManagement/systemLog',
                        name: 'systemLog',
                        component: () => import('@/pages/metadata/systemManagement/systemLog'),
                        meta: { title: '系统日志', keepAlive: true, permission: [ 'systemLog' ] }
                    },
                    {
                        path: '/systemManagement/systemTerminal',
                        name: 'systemTerminal',
                        component: () => import('@/pages/metadata/systemManagement/systemTerminal'),
                        meta: { title: '系统终端', keepAlive: true, permission: [ 'systemTerminal' ] }
                    },
                    {
                        path: '/systemManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/Announcements',
                name: 'Announcements',
                component: () => import('@/pages/metadata/Announcements'),
                meta: { icon: 'Announcements', title: '公告管理', keepAlive: true, permission: [ 'Announcements' ] }
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: 采购中心路由结构
 * @msg:
 * @param {type}
 * @return:
 */
export const purchasingRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '采购中心首页' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            // contractManagement
            {
                path: '/contractManagement',
                name: 'contractManagement',
                redirect: '/contractManagement/selfOperatedContract',
                component: RouteView, // PageView,
                meta: { title: '合同管理', icon: 'contractManagement', permission: [ 'contractManagement' ] },
                children: [
                    {
                        path: '/contractManagement/selfOperatedContract',
                        name: 'selfOperatedContract',
                        component: () => import('@/pages/purchasing/contractManagement/selfOperatedContract'),
                        meta: { title: '自营合同', keepAlive: true, permission: [ 'selfOperatedContract' ] }
                    },
                    {
                        path: '/contractManagement/jointVentureContract',
                        name: 'jointVentureContract',
                        component: () => import('@/pages/purchasing/contractManagement/jointVentureContract'),
                        meta: { title: '联营合同', keepAlive: true, permission: [ 'jointVentureContract' ] }
                    },
                    {
                        path: '/contractManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // acquisitionStrategy
            {
                path: '/acquisitionStrategy',
                name: 'acquisitionStrategy',
                component: () => import('@/pages/purchasing/acquisitionStrategy/acquisitionStrategy'),
                meta: { title: '采购价格调整', icon: 'acquisitionStrategy', keepAlive: true, permission: [ 'acquisitionStrategy' ] }
            },
            // purchaseFund
            {
                path: '/purchaseFund',
                name: 'purchaseFund',
                component: () => import('@/pages/purchasing/purchaseFund/purchaseFund'),
                meta: { title: '采购资金拨付', icon: 'purchaseFund', keepAlive: true, permission: [ 'purchaseFund' ] }
            },
            // purchaseOrder
            {
                path: '/purchaseOrder',
                name: 'purchaseOrder',
                component: () => import('@/pages/purchasing/purchaseOrder/purchaseOrder'),
                meta: { title: '采购订单', icon: 'purchaseOrder', keepAlive: true, permission: [ 'purchaseOrder' ] }
            },
            // venderPrototypeManage
            {
                path: '/venderPrototypeManage',
                name: 'venderPrototypeManage',
                redirect: '/venderPrototypeManage/venderPrototypeBePutInStorage',
                component: RouteView, // PageView,
                meta: { title: '厂家样机管理', icon: 'venderPrototypeManage', permission: [ 'venderPrototypeManage' ] },
                children: [
                    {
                        path: '/venderPrototypeManage/venderPrototypeBePutInStorage',
                        name: 'venderPrototypeBePutInStorage',
                        component: () => import('@/pages/purchasing/venderPrototypeManage/venderPrototypeBePutInStorage'),
                        meta: { title: '厂家样机入库申请', keepAlive: true, permission: [ 'venderPrototypeBePutInStorage' ] }
                    },
                    {
                        path: '/venderPrototypeManage/venderPrototypeCancellingStocks',
                        name: 'venderPrototypeCancellingStocks',
                        component: () => import('@/pages/purchasing/venderPrototypeManage/venderPrototypeCancellingStocks'),
                        meta: { title: '厂家样机退库申请', keepAlive: true, permission: [ 'venderPrototypeCancellingStocks' ] }
                    },
                    {
                        path: '/venderPrototypeManage/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // allotManage
            {
                path: '/allotManage',
                name: 'allotManage',
                redirect: '/allotManage/allotInterior',
                component: RouteView, // PageView,
                meta: { title: '调拨管理', icon: 'allotManage', permission: [ 'allotManage' ] },
                children: [
                    {
                        path: '/allotManage/allotInterior',
                        name: 'allotInterior',
                        component: () => import('@/pages/purchasing/allotManage/allotInterior'),
                        meta: { title: '内部调拨申请', keepAlive: true, permission: [ 'allotInterior' ] }
                    },
                    {
                        path: '/allotManage/allotPrototype',
                        name: 'allotPrototype',
                        component: () => import('@/pages/purchasing/allotManage/allotPrototype'),
                        meta: { title: '厂家样机调拨申请', keepAlive: true, permission: [ 'allotPrototype' ] }
                    },
                    {
                        path: '/allotManage/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // withdrawingTheApplication
            {
                path: '/withdrawingTheApplication',
                name: 'withdrawingTheApplication',
                component: () => import('@/pages/purchasing/withdrawingTheApplication/withdrawingTheApplication'),
                meta: { title: '退库申请', icon: 'withdrawingTheApplication', keepAlive: true, permission: [ 'withdrawingTheApplication' ] }
            },
            // goodsPresellDeploy
            {
                path: '/goodsPresellDeploy',
                name: 'goodsPresellDeploy',
                component: () => import('@/pages/purchasing/goodsPresellDeploy/goodsPresellDeploy'),
                meta: { title: '商品预售配置', icon: 'goodsPresellDeploy', keepAlive: true, permission: [ 'goodsPresellDeploy' ] }
            },
            // goodsConfig
            // {
            //     path: '/goodsConfig',
            //     name: 'goodsConfig',
            //     component: () => import('@/pages/purchasing/goodsConfig/goodsConfig'),
            //     meta: { title: '商品配置', icon: 'goodsConfig', keepAlive: true, permission: [ 'goodsConfig' ] }
            // },
            // goodsStatusChange
            // {
            //     path: '/goodsStatusChange',
            //     name: 'goodsStatusChange',
            //     component: () => import('@/pages/purchasing/goodsStatusChange/goodsStatusChange'),
            //     meta: { title: '商品状态变更', icon: 'goodsStatusChange', keepAlive: true, permission: [ 'goodsStatusChange' ] }
            // },
            // channelPolicy
            // {
            //     path: '/channelPolicy',
            //     name: 'channelPolicy',
            //     component: () => import('@/pages/purchasing/channelPolicy/channelPolicy'),
            //     meta: { title: '渠道政策形式定义', icon: 'channelPolicy', keepAlive: true, permission: [ 'channelPolicy' ] }
            // },
            // pricePolicyManage
            {
                path: '/pricePolicyManage',
                name: 'pricePolicyManage',
                redirect: '/pricePolicyManage/retailPrice',
                component: RouteView, // PageView,
                meta: { title: '价格政策管理', icon: 'pricePolicyManage', permission: [ 'pricePolicyManage' ] },
                children: [
                    {
                        path: '/pricePolicyManage/retailPrice',
                        name: 'retailPrice',
                        component: () => import('@/pages/purchasing/pricePolicyManage/retailPrice'),
                        meta: { title: '零售价格调整', keepAlive: true, permission: [ 'retailPrice' ] }
                    },
                    {
                        path: '/pricePolicyManage/wholesalePriceList',
                        name: 'wholesalePriceList',
                        component: () => import('@/pages/purchasing/pricePolicyManage/wholesalePriceList'),
                        meta: { title: '分销价格调整', keepAlive: true, permission: [ 'wholesalePriceList' ] }
                    },
                    {
                        path: '/pricePolicyManage/wholesalePriceExamine',
                        name: 'wholesalePriceExamine',
                        component: () => import('@/pages/purchasing/pricePolicyManage/wholesalePriceExamine'),
                        meta: { title: '分销特价审批单', keepAlive: true, permission: [ 'wholesalePriceExamine' ] }
                    },
                    {
                        path: '/pricePolicyManage/wholesaleChannelist',
                        name: 'wholesaleChannelist',
                        component: () => import('@/pages/purchasing/pricePolicyManage/wholesaleChannelist'),
                        meta: { title: '分销渠道政策配置', keepAlive: true, permission: [ 'wholesaleChannelist' ] }
                    },
                    {
                        path: '/pricePolicyManage/insideSellPriceStrategy',
                        name: 'insideSellPriceStrategy',
                        component: () => import('@/pages/purchasing/pricePolicyManage/insideSellPriceStrategy'),
                        meta: { title: '内部销售价格策略', keepAlive: true, permission: [ 'insideSellPriceStrategy' ] }
                    },
                    {
                        path: '/pricePolicyManage/*', redirect: '/403', hidden: true
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: 营销路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const marketingRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '营销中心' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            // ElectronicCoinManagement
            {
                path: '/ElectronicCoinManagement',
                name: 'ElectronicCoinManagement',
                component: RouteView,
                redirect: '/ElectronicCoinManagement/ElectronicCoinTypeDefine',
                meta: { title: '电子币管理', icon: 'ElectronicCoinManagement', permission: [ 'ElectronicCoinManagement' ] },
                children: [
                    {
                        path: '/ElectronicCoinManagement/ElectronicCoinTypeDefine',
                        name: 'ElectronicCoinTypeDefine',
                        component: () => import('@/pages/marketing/ElectronicCoinManagement/ElectronicCoinTypeDefine'),
                        meta: { title: '电子币类型定义', keepAlive: true, permission: [ 'ElectronicCoinTypeDefine' ] }
                    },
                    {
                        path: '/ElectronicCoinManagement/ElectronicCoinUseRuleSheet',
                        name: 'ElectronicCoinUseRuleSheet',
                        component: () => import('@/pages/marketing/ElectronicCoinManagement/ElectronicCoinUseRuleSheet'),
                        meta: { title: '电子币使用规则单', keepAlive: true, permission: [ 'ElectronicCoinUseRuleSheet' ] }
                    },
                    {
                        path: '/ElectronicCoinManagement/ElectronicCoinShareRuleSheet',
                        name: 'ElectronicCoinShareRuleSheet',
                        component: () => import('@/pages/marketing/ElectronicCoinManagement/ElectronicCoinShareRuleSheet'),
                        meta: { title: '电子币分摊规则单', keepAlive: true, permission: [ 'ElectronicCoinShareRuleSheet' ] }
                    },
                    {
                        path: '/ElectronicCoinManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // MarketingScheduleManagement
            {
                path: '/MarketingScheduleManagement',
                name: 'MarketingScheduleManagement',
                redirect: '/MarketingScheduleManagement/ScheduleActivityDefinition',
                component: RouteView, // PageView,
                meta: { title: '营销档期管理', icon: 'MarketingScheduleManagement', permission: [ 'MarketingScheduleManagement' ] },
                children: [
                    {
                        path: '/MarketingScheduleManagement/ScheduleActivityDefinition',
                        name: 'ScheduleActivityDefinition',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/ScheduleActivityDefinition'),
                        meta: { title: '档期活动定义', keepAlive: true, permission: [ 'ScheduleActivityDefinition' ] }
                    },
                    {
                        path: '/ActivityRuleSheet',
                        name: 'ActivityRuleSheet',
                        redirect: '/ActivityRuleSheet/SingleItemFullReturn',
                        component: RouteView,
                        meta: { title: '活动规则单', permission: [ 'ActivityRuleSheet' ] },
                        children: [
                            {
                                path: '/ActivityRuleSheet/SingleItemFullReturn',
                                name: 'SingleItemFullReturn',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/SingleItemFullReturn'),
                                meta: { title: '单品满返规则单', keepAlive: true, permission: [ 'SingleItemFullReturn' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/SingleItemFullSubtract',
                                name: 'SingleItemFullSubtract',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/SingleItemFullSubtract'),
                                meta: { title: '单品满减规则单', keepAlive: true, permission: [ 'SingleItemFullSubtract' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/SingleItemFullGift',
                                name: 'SingleItemFullGift',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/SingleItemFullGift'),
                                meta: { title: '单品满赠规则单', keepAlive: true, permission: [ 'SingleItemFullGift' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/ArbitrageInFullReturn',
                                name: 'ArbitrageInFullReturn',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/ArbitrageInFullReturn'),
                                meta: { title: '套购满返规则单', keepAlive: true, permission: [ 'ArbitrageInFullReturn' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/ArbitrageInFullSubtract',
                                name: 'ArbitrageInFullSubtract',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/ArbitrageInFullSubtract'),
                                meta: { title: '套购满减规则单', keepAlive: true, permission: [ 'ArbitrageInFullSubtract' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/ArbitrageInFullGift',
                                name: 'ArbitrageInFullGift',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/ArbitrageInFullGift'),
                                meta: { title: '套购满赠规则单', keepAlive: true, permission: [ 'ArbitrageInFullGift' ] }
                            },
                            {
                                path: '/ActivityRuleSheet/FullFreeActive',
                                name: 'FullFreeActive',
                                component: () => import('@/pages/marketing/ActivityRuleSheet/FullFreeActive'),
                                meta: { title: '满免活动规则单', keepAlive: true, permission: [ 'FullFreeActive' ] }
                            }
                        ]
                    },
                    {
                        path: '/MarketingScheduleManagement/GiftRuleSheet',
                        name: 'GiftRuleSheet',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/GiftRuleSheet'),
                        meta: { title: '礼品规则单', keepAlive: true, permission: [ 'GiftRuleSheet' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/LimitedPriceActivitiesConfig',
                        name: 'LimitedPriceActivitiesConfig',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/LimitedPriceActivitiesConfig'),
                        meta: { title: '限量限价活动配置', keepAlive: true, permission: [ 'LimitedPriceActivitiesConfig' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/GoodsServiceConfig',
                        name: 'GoodsServiceConfig',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/GoodsServiceConfig'),
                        meta: { title: '商品服务配置', keepAlive: true, permission: [ 'GoodsServiceConfig' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/ExtendWarrantyServiceRuleSheet',
                        name: 'ExtendWarrantyServiceRuleSheet',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/ExtendWarrantyServiceRuleSheet'),
                        meta: { title: '延保服务规则单', keepAlive: true, permission: [ 'ExtendWarrantyServiceRuleSheet' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/ElectronicTicketDefine',
                        name: 'ElectronicTicketDefine',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/ElectronicTicketDefine'),
                        meta: { title: '电子券定义', keepAlive: true, permission: [ 'ElectronicTicketDefine' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/GiftIoIssue',
                        name: 'GiftIoIssue',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/GiftIoIssue'),
                        meta: { title: '赠品发放', keepAlive: true, permission: [ 'GiftIoIssue' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/VouchersActivityRules',
                        name: 'VouchersActivityRules',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/VouchersActivityRules'),
                        meta: { title: '用券活动规则单', keepAlive: true, permission: [ 'VouchersActivityRules' ] }
                    },
                    {
                        path: '/MarketingScheduleManagement/PayeeControl',
                        name: 'PayeeControl',
                        component: () => import('@/pages/marketing/MarketingScheduleManagement/PayeeControl'),
                        meta: { title: '收款方式控制', keepAlive: true, permission: [ 'PayeeControl' ] }
                    },

                    {
                        path: '/MarketingScheduleManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // CouponManagement
            {
                path: '/CouponManagement',
                name: 'CouponManagement',
                component: RouteView,
                redirect: '/CouponManagement/CouponDefinition',
                meta: { title: '促销券管理', icon: 'CouponManagement', permission: [ 'CouponManagement' ] },
                children: [
                    {
                        path: '/CouponManagement/CouponDefinition',
                        name: 'CouponDefinition',
                        component: () => import('@/pages/marketing/CouponManagement/CouponDefinition'),
                        meta: { title: '促销券定义', keepAlive: true, permission: [ 'CouponDefinition' ] }
                    },
                    {
                        path: '/CouponManagement/CouponUseRule',
                        name: 'CouponUseRule',
                        component: () => import('@/pages/marketing/CouponManagement/CouponUseRule'),
                        meta: { title: '促销券使用规则', keepAlive: true, permission: [ 'CouponUseRule' ] }
                    },
                    {
                        path: '/CouponManagement/CouponShareRule',
                        name: 'CouponUseShareRule',
                        component: () => import('@/pages/marketing/CouponManagement/CouponShareRule'),
                        meta: { title: '促销券分摊规则', keepAlive: true, permission: [ 'CouponShareRule' ] }
                    },
                    {
                        path: '/CouponManagement/CouponPutInRule',
                        name: 'CouponPutInRule',
                        component: () => import('@/pages/marketing/CouponManagement/CouponPutInRule'),
                        meta: { title: '促销券投放规则', keepAlive: true, permission: [ 'CouponPutInRule' ] }
                    },
                    {
                        path: '/CouponManagement/CouponMonitoring',
                        name: 'CouponMonitoring',
                        component: () => import('@/pages/marketing/CouponManagement/CouponMonitoring'),
                        meta: { title: '促销券监控', keepAlive: true, permission: [ 'CouponMonitoring' ] }
                    },
                    {
                        path: '/CouponManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // BundledGoodsSettings
            {
                path: '/BundledGoodsSettings',
                name: 'BundledGoodsSettings',
                // component: RouteView,
                component: () => import('@/pages/marketing/BundledGoodsSettings/BundledGoodsSettings'),
                meta: { title: '捆绑商品设置', icon: 'BundledGoodsSettings', keepAlive: true, permission: [ 'BundledGoodsSettings' ] }
            },
            // StoreManagerCouponManagement
            {
                path: '/StoreManagerCouponManagement',
                name: 'StoreManagerCouponManagement',
                component: RouteView,
                redirect: '/StoreManagerCouponManagement/AAccountSettings',
                meta: { title: '店长优惠券管理', icon: 'StoreManagerCouponManagement', permission: [ 'StoreManagerCouponManagement' ] },
                children: [
                    {
                        path: '/StoreManagerCouponManagement/AAccountSettings',
                        name: 'AAccountSettings',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/AAccountSettings'),
                        meta: { title: 'A账户设置', keepAlive: true, permission: [ 'AAccountSettings' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/BAccountItemSettings',
                        name: 'BAccountItemSettings',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/BAccountItemSettings'),
                        meta: { title: 'B账户商品配置', keepAlive: true, permission: [ 'BAccountItemSettings' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/BAccountUsageSettings',
                        name: 'BAccountUsageSettings',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/BAccountUsageSettings'),
                        meta: { title: 'B账户使用配置', keepAlive: true, permission: [ 'BAccountUsageSettings' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/ManufacturerCouponSettings',
                        name: 'ManufacturerCouponSettings',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/ManufacturerCouponSettings'),
                        meta: { title: '厂家券配置', keepAlive: true, permission: [ 'ManufacturerCouponSettings' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/MallCouponSettings',
                        name: 'MallCouponSettings',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/MallCouponSettings'),
                        meta: { title: '商场券配置', keepAlive: true, permission: [ 'MallCouponSettings' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/balanceMonitoringTable',
                        name: 'balanceMonitoringTable',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/balanceMonitoringTable'),
                        meta: { title: '余额监控表', keepAlive: true, permission: [ 'balanceMonitoringTable' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/happenLog',
                        name: 'happenLog',
                        component: () => import('@/pages/marketing/StoreManagerCouponManagement/happenLog'),
                        meta: { title: '发生日志', keepAlive: true, permission: [ 'happenLog' ] }
                    },
                    {
                        path: '/StoreManagerCouponManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // InventoryManagement
            {
                path: '/InventoryManagement',
                name: 'InventoryManagement',
                component: RouteView,
                redirect: '/InventoryManagement/CountDefinition',
                meta: { title: '盘点管理', icon: 'InventoryManagement', permission: [ 'InventoryManagement' ] },
                children: [
                    {
                        path: '/InventoryManagement/CountDefinition',
                        name: 'CountDefinition',
                        component: () => import('@/pages/marketing/InventoryManagement/CountDefinition'),
                        meta: { title: '盘点定义', keepAlive: true, permission: [ 'CountDefinition' ] }
                    },
                    {
                        path: '/InventoryManagement/ProductInventory',
                        name: 'ProductInventory',
                        component: () => import('@/pages/marketing/InventoryManagement/ProductInventory'),
                        meta: { title: '商品盘点单', keepAlive: true, permission: [ 'ProductInventory' ] }
                    },
                    {
                        path: '/InventoryManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // WarehouseManagement
            {
                path: '/WarehouseManagement',
                name: 'WarehouseManagement',
                component: RouteView,
                redirect: '/WarehouseManagement/CommodityProfitAndLoss',
                meta: { title: '库存管理', icon: 'WarehouseManagement', permission: [ 'WarehouseManagement' ] },
                children: [
                    {
                        path: '/WarehouseManagement/CommodityProfitAndLoss',
                        name: 'CommodityProfitAndLoss',
                        component: () => import('@/pages/marketing/WarehouseManagement/CommodityProfitAndLoss'),
                        meta: { title: '商品损益', keepAlive: true, permission: [ 'CommodityProfitAndLoss' ] }
                    },
                    {
                        path: '/WarehouseManagement/CommodityUse',
                        name: 'CommodityUse',
                        component: () => import('@/pages/marketing/WarehouseManagement/CommodityUse'),
                        meta: { title: '商品领用', keepAlive: true, permission: [ 'CommodityUse' ] }
                    },
                    {
                        path: '/WarehouseManagement/InventoryTypeChange',
                        name: 'InventoryTypeChange',
                        component: () => import('@/pages/marketing/WarehouseManagement/InventoryTypeChange'),
                        meta: { title: '库存类型变更', keepAlive: true, permission: [ 'InventoryTypeChange' ] }
                    },
                    {
                        path: '/WarehouseManagement/GiftRecipients',
                        name: 'GiftRecipients',
                        component: () => import('@/pages/marketing/WarehouseManagement/GiftRecipients'),
                        meta: { title: '赠品领用', keepAlive: true, permission: [ 'GiftRecipients' ] }
                    },
                    {
                        path: '/WarehouseManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // RetailManagement
            {
                path: '/RetailManagement',
                name: 'RetailManagement',
                component: RouteView,
                redirect: '/RetailManagement/ShoppingGuideBilling',
                meta: { title: '零售管理', icon: 'RetailManagement', permission: [ 'RetailManagement' ] },
                children: [
                    {
                        path: '/RetailManagement/ShoppingGuideBilling',
                        name: 'ShoppingGuideBilling',
                        component: () => import('@/pages/marketing/RetailManagement/ShoppingGuideBilling'),
                        meta: { title: '导购开票', keepAlive: true, permission: [ 'ShoppingGuideBilling' ] }
                    },
                    {
                        path: '/RetailManagement/RetailReceipt',
                        name: 'RetailReceipt',
                        component: () => import('@/pages/marketing/RetailManagement/RetailReceipt'),
                        meta: { title: '零售收款', keepAlive: true, permission: [ 'RetailReceipt' ] }
                    },
                    {
                        path: '/RetailManagement/OrdinaryReturn',
                        name: 'OrdinaryReturn',
                        component: () => import('@/pages/marketing/RetailManagement/OrdinaryReturn'),
                        meta: { title: '普通退货登记', keepAlive: true, permission: [ 'OrdinaryReturn' ] }
                    },
                    {
                        path: '/RetailManagement/OriginalReturn',
                        name: 'OriginalReturn',
                        component: () => import('@/pages/marketing/RetailManagement/OriginalReturn'),
                        meta: { title: '原单退货登记', keepAlive: true, permission: [ 'OriginalReturn' ] }
                    },
                    {
                        path: '/RetailManagement/ExchangeApplication',
                        name: 'ExchangeApplication',
                        component: () => import('@/pages/marketing/RetailManagement/ExchangeApplication'),
                        meta: { title: '换货申请登记', keepAlive: true, permission: [ 'ExchangeApplication' ] }
                    },
                    {
                        path: '/RetailManagement/RefundManagement',
                        name: 'RefundManagement',
                        component: () => import('@/pages/marketing/RetailManagement/RefundManagement'),
                        meta: { title: '退款管理', keepAlive: true, permission: [ 'RefundManagement' ] }
                    },
                    {
                        path: '/RetailManagement/DepositRefund',
                        name: 'DepositRefund',
                        component: () => import('@/pages/marketing/RetailManagement/DepositRefund'),
                        meta: { title: '定金退款管理', keepAlive: true, permission: [ 'DepositRefund' ] }
                    },
                    {
                        path: '/RetailManagement/CommissionedDeliveryMonitoring',
                        name: 'CommissionedDeliveryMonitoring',
                        component: () => import('@/pages/marketing/RetailManagement/CommissionedDeliveryMonitoring'),
                        meta: { title: '委托送货监控', keepAlive: true, permission: [ 'CommissionedDeliveryMonitoring' ] }
                    },
                    {
                        path: '/RetailManagement/BookingDelivery',
                        name: 'BookingDelivery',
                        component: () => import('@/pages/marketing/RetailManagement/BookingDelivery'),
                        meta: { title: '预售转送货', keepAlive: true, permission: [ 'BookingDelivery' ] }
                    },
                    {
                        path: '/RetailManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/ElectronicShelf',
                name: 'ElectronicShelf',
                component: RouteView,
                redirect: '/ElectronicShelf/ElShelf',
                meta: { title: '电子货架管理', icon: 'ElectronicShelf', permission: [ 'ElectronicShelf' ] },
                children: [
                    {
                        path: '/ElectronicShelf/ElShelf',
                        name: 'ElShelf',
                        component: () => import('@/pages/marketing/ElectronicShelf/ElShelf'),
                        meta: { title: '电子货架', keepAlive: true, permission: [ 'ElShelf' ] }
                    },
                    {
                        path: '/ElectronicShelf/ElShelfData',
                        name: 'ElShelfData',
                        component: () => import('@/pages/marketing/ElectronicShelf/ElShelfData'),
                        meta: { title: '货架热度分析', keepAlive: true, permission: [ 'ElShelfData' ] }
                    },
                    {
                        path: '/ElectronicShelf/*', redirect: '/403', hidden: true
                    }
                ]
            },

            // DistributionManagement
            {
                path: '/DistributionManagement',
                name: 'DistributionManagement',
                component: RouteView,
                redirect: '/DistributionManagement/CommodityWholesaleOrder',
                meta: { title: '分销管理', icon: 'DistributionManagement', permission: [ 'DistributionManagement' ] },
                children: [
                    {
                        path: '/DistributionManagement/DistributionOrder',
                        name: 'DistributionOrder',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionOrder'),
                        meta: { title: '分销订单', keepAlive: true, permission: [ 'DistributionOrder' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionInvoice',
                        name: 'DistributionInvoice',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionInvoice'),
                        meta: { title: '分销开票', keepAlive: true, permission: [ 'DistributionInvoice' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionOrderList',
                        name: 'DistributionOrderList',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionOrderList'),
                        meta: { title: '分销订单列表', keepAlive: true, permission: [ 'DistributionOrderList' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionInvoiceList',
                        name: 'DistributionInvoiceList',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionInvoiceList'),
                        meta: { title: '分销开票列表', keepAlive: true, permission: [ 'DistributionInvoiceList' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionReturn',
                        name: 'DistributionReturn',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionReturn'),
                        meta: { title: '分销退货', keepAlive: true, permission: [ 'DistributionReturn' ] }
                    },
                    {
                        path: '/DistributionManagement/ChannelRebateReport',
                        name: 'ChannelRebateReport',
                        component: () => import('@/pages/marketing/DistributionManagement/ChannelRebateReport'),
                        meta: { title: '渠道返利报表', keepAlive: true, permission: [ 'ChannelRebateReport' ] }
                    },
                    {
                        path: '/DistributionManagement/RebateConfirmation',
                        name: 'RebateConfirmation',
                        component: () => import('@/pages/marketing/DistributionManagement/RebateConfirmation'),
                        meta: { title: '返利确认单', keepAlive: true, permission: [ 'RebateConfirmation' ] }
                    },
                    {
                        path: '/DistributionManagement/RebateMonitoringReport',
                        name: 'RebateMonitoringReport',
                        component: () => import('@/pages/marketing/DistributionManagement/RebateMonitoringReport'),
                        meta: { title: '返利监控报表', keepAlive: true, permission: [ 'RebateMonitoringReport' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionDiscountApprovalForm',
                        name: 'DistributionDiscountApprovalForm',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionDiscountApprovalForm'),
                        meta: { title: '分销折让审批单', keepAlive: true, permission: [ 'DistributionDiscountApprovalForm' ] }
                    },
                    {
                        path: '/DistributionManagement/DistributionDiscountForm',
                        name: 'DistributionDiscountForm',
                        component: () => import('@/pages/marketing/DistributionManagement/DistributionDiscountForm'),
                        meta: { title: '分销折让单', keepAlive: true, permission: [ 'DistributionDiscountForm' ] }
                    },
                    {
                        path: '/DistributionManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            // RetailPaymentMethod
            // {
            //     path: '/RetailPaymentMethod',
            //     name: 'RetailPaymentMethod',
            //     component: () => import('@/pages/marketing/RetailPaymentMethod/RetailPaymentMethod'),
            //     meta: { title: '零售支付方式', icon: 'system', keepAlive: true, permission: [ 'RetailPaymentMethod' ] }
            // },
            {
                path: '/PaymentMethodConfiguration',
                name: 'PaymentMethodConfiguration',
                component: () => import('@/pages/marketing/RetailPaymentMethod/PaymentMethodConfiguration'),
                meta: { title: '收款方式配置', icon: 'system', keepAlive: true, permission: [ 'PaymentMethodConfiguration' ] }
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: 仓储物流路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const storageRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '仓储物流中心' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            {
                path: '/LocationManagement',
                name: 'LocationManagement',
                redirect: '/LocationManagement/LocationInformation',
                component: RouteView,
                meta: { title: '货位管理', icon: 'LocationManagement', permission: [ 'LocationManagement' ] },
                children: [
                    {
                        path: '/LocationManagement/LocationInformation',
                        name: 'LocationInformation',
                        component: () => import('@/pages/storage/LocationManagement/LocationInformation'),
                        meta: { title: '区域信息', keepAlive: true, permission: [ 'LocationInformation' ] }
                    },
                    {
                        path: '/LocationManagement/ShelfInformation',
                        name: 'ShelfInformation',
                        component: () => import('@/pages/storage/LocationManagement/ShelfInformation'),
                        meta: { title: '货架信息', keepAlive: true, permission: [ 'ShelfInformation' ] }
                    },
                    {
                        path: '/LocationManagement/TDShelfInformation',
                        name: 'TDShelfInformation',
                        component: () => import('@/pages/storage/LocationManagement/TDShelfInformation'),
                        meta: { title: '立体货架信息', keepAlive: true, permission: [ 'TDShelfInformation' ] }
                    },
                    {
                        path: '/LocationManagement/Warehousing',
                        name: 'Warehousing',
                        component: () => import('@/pages/storage/LocationManagement/Warehousing'),
                        meta: { title: '货位入库', keepAlive: true, permission: [ 'Warehousing' ] }
                    },
                    {
                        path: '/LocationManagement/PositionAdjustment',
                        name: 'PositionAdjustment',
                        component: () => import('@/pages/storage/LocationManagement/PositionAdjustment'),
                        meta: { title: '货位调整', keepAlive: true, permission: [ 'PositionAdjustment' ] }
                    },
                    {
                        path: '/LocationManagement/RetailOutbound',
                        name: 'RetailOutbound',
                        component: () => import('@/pages/storage/LocationManagement/RetailOutbound'),
                        meta: { title: '零售出库', keepAlive: true, permission: [ 'RetailOutbound' ] }
                    },
                    {
                        path: '/LocationManagement/Wholesale',
                        name: 'Wholesale',
                        component: () => import('@/pages/storage/LocationManagement/Wholesale'),
                        meta: { title: '批发出库', keepAlive: true, permission: [ 'Wholesale' ] }
                    },
                    {
                        path: '/LocationManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/LogisticsBasicInformation',
                name: 'LogisticsBasicInformation',
                redirect: '/LogisticsBasicInformation/LineManagement',
                component: RouteView,
                meta: { title: '物流基础管理', icon: 'LogisticsBasicInformation', permission: [ 'LogisticsBasicInformation' ] },
                children: [
                    {
                        path: '/LogisticsBasicInformation/LineManagement',
                        name: 'LineManagement',
                        component: () => import('@/pages/storage/LogisticsBasicInformation/LineManagement'),
                        meta: { title: '线路管理', keepAlive: true, permission: [ 'LineManagement' ] }
                    },
                    {
                        path: '/LogisticsBasicInformation/VehicleManagement',
                        name: 'VehicleManagement',
                        component: () => import('@/pages/storage/LogisticsBasicInformation/VehicleManagement'),
                        meta: { title: '车辆管理', keepAlive: true, permission: [ 'VehicleManagement' ] }
                    },
                    {
                        path: '/LogisticsBasicInformation/LineDriverManage',
                        name: 'LineDriverManage',
                        component: () => import('@/pages/storage/LogisticsBasicInformation/LineDriverManage'),
                        meta: { title: '线路司机管理', keepAlive: true, permission: [ 'LineDriverManage' ] }
                    },
                    {
                        path: '/LogisticsBasicInformation/ThirdPartyLogistics',
                        name: 'ThirdPartyLogistics',
                        component: () => import('@/pages/storage/LogisticsBasicInformation/ThirdPartyLogistics'),
                        meta: { title: '第三方物流', keepAlive: true, permission: [ 'ThirdPartyLogistics' ] }
                    },
                    {
                        path: '/LogisticsBasicInformation/DispatcherManagement',
                        name: 'DispatcherManagement',
                        component: () => import('@/pages/storage/LogisticsBasicInformation/DispatcherManagement'),
                        meta: { title: '调度组管理', keepAlive: true, permission: [ 'DispatcherManagement' ] }
                    },
                    {
                        path: '/aTypeOfManagement',
                        name: 'aTypeOfManagement',
                        redirect: '/aTypeOfManagement/aTypeOfInformation',
                        component: RouteView,
                        meta: { title: '件型管理', permission: [ 'aTypeOfManagement' ] },
                        children: [
                            {
                                path: '/aTypeOfManagement/aTypeOfInformation',
                                name: 'aTypeOfInformation',
                                component: () => import('@/pages/storage/aTypeOfManagement/aTypeOfInformation'),
                                meta: { title: '件型信息', keepAlive: true, permission: [ 'aTypeOfInformation' ] }
                            },
                            {
                                path: '/aTypeOfManagement/linePartsManagement',
                                name: 'linePartsManagement',
                                component: () => import('@/pages/storage/aTypeOfManagement/linePartsManagement'),
                                meta: { title: '线路件型费用管理', keepAlive: true, permission: [ 'linePartsManagement' ] }
                            },
                            {
                                path: '/aTypeOfManagement/productTypeManagement',
                                name: 'productTypeManagement',
                                component: () => import('@/pages/storage/aTypeOfManagement/productTypeManagement'),
                                meta: { title: '件型商品配置', keepAlive: true, permission: [ 'productTypeManagement' ] }
                            }
                        ]
                    },
                    {
                        path: '/LogisticsBasicInformation/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/SRWarehous',
                name: 'SRWarehous',
                component: RouteView,
                redirect: '/SRWarehous/AdvanceReceiptManagement',
                meta: { title: '仓储管理', icon: 'SRWarehous', permission: [ 'SRWarehous' ] },
                children: [
                    {
                        path: '/SRWarehous/AdvanceReceiptManagement',
                        name: 'AdvanceReceiptManagement',
                        component: () => import('@/pages/storage/SRWarehous/AdvanceReceiptManagement'),
                        meta: { title: '预收/退库管理', keepAlive: true, permission: [ 'AdvanceReceiptManagement' ] }
                    },
                    {
                        path: '/SRWarehous/InboundManagement',
                        name: 'InboundManagement',
                        component: () => import('@/pages/storage/SRWarehous/InboundManagement'),
                        meta: { title: '采购入库', keepAlive: true, permission: [ 'InboundManagement' ] }
                    },
                    {
                        path: '/SRWarehous/ReturnManagement',
                        name: 'ReturnManagement',
                        component: () => import('@/pages/storage/SRWarehous/ReturnManagement'),
                        meta: { title: '采购退库', keepAlive: true, permission: [ 'ReturnManagement' ] }
                    },
                    {
                        path: '/SRWarehous/LogisticsWarehousing',
                        name: 'LogisticsWarehousing',
                        component: () => import('@/pages/storage/SRWarehous/LogisticsWarehousing'),
                        meta: { title: '物流入库', keepAlive: true, permission: [ 'LogisticsWarehousing' ] }
                    },
                    {
                        path: '/SRWarehous/OutboundLogistics',
                        name: 'OutboundLogistics',
                        component: () => import('@/pages/storage/SRWarehous/OutboundLogistics'),
                        meta: { title: '物流出库', keepAlive: true, permission: [ 'OutboundLogistics' ] }
                    },
                    {
                        path: '/LogisticsTemporaryManagement',
                        name: 'LogisticsTemporaryManagement',
                        component: RouteView,
                        redirect: '/LogisticsTemporaryManagement/TemporaryManagement',
                        meta: { title: '暂存', permission: [ 'LogisticsTemporaryManagement' ] },
                        children: [
                            {
                                path: '/LogisticsTemporaryManagement/TemporaryManagement',
                                name: 'TemporaryManagement',
                                component: () => import('@/pages/storage/LogisticsTemporaryManagement/TemporaryManagement'),
                                meta: { title: '暂存登记/出库', keepAlive: true, permission: [ 'TemporaryManagement' ] }
                            },
                            {
                                path: '/LogisticsTemporaryManagement/TemporaryReport',
                                name: 'TemporaryReport',
                                component: () => import('@/pages/storage/LogisticsTemporaryManagement/TemporaryReport'),
                                meta: { title: '暂存报表', keepAlive: true, permission: [ 'TemporaryReport' ] }
                            },
                            {
                                path: '/LogisticsTemporaryManagement/*', redirect: '/403', hidden: true
                            }
                        ]
                    },
                    {
                        path: '/SRWarehous/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/LogisticsDistributionManagement',
                name: 'LogisticsDistributionManagement',
                component: RouteView,
                redirect: '/LogisticsDistributionManagement/WaitingDeliveryManagement',
                meta: { title: '物流配送管理', icon: 'LogisticsDistribution', permission: [ 'LogisticsDistributionManagement' ] },
                children: [
                    {
                        path: '/DeliverGoodsManage',
                        name: 'DeliverGoodsManage',
                        redirect: '/DeliverGoodsManage/SortingManage',
                        component: RouteView,
                        meta: { title: '送货管理', permission: [ 'DeliverGoodsManage' ] },
                        children: [
                            {
                                path: '/DeliverGoodsManage/SortingManage',
                                name: 'SortingManage',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/DeliverGoodsManage/SortingManage'),
                                meta: { title: '分拣管理', keepAlive: true, permission: [ 'SortingManage' ] }
                            },
                            {
                                path: '/DeliverGoodsManage/DispatchingManage',
                                name: 'DispatchingManage',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/DeliverGoodsManage/DispatchingManage'),
                                meta: { title: '派工管理', keepAlive: true, permission: [ 'DispatchingManage' ] }
                            },
                            {
                                path: '/DeliverGoodsManage/DispatchingAffirmManage',
                                name: 'DispatchingAffirmManage',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/DeliverGoodsManage/DispatchingAffirmManage'),
                                meta: { title: '派工确认管理', keepAlive: true, permission: [ 'DispatchingAffirmManage' ] }
                            },
                            {
                                path: '/DeliverGoodsManage/AffirmSignInManage',
                                name: 'AffirmSignInManage',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/DeliverGoodsManage/AffirmSignInManage'),
                                meta: { title: '确认签收管理', keepAlive: true, permission: [ 'AffirmSignInManage' ] }
                            }
                        ]
                    },
                    {
                        path: '/ReturnGoodsManagement',
                        name: 'ReturnGoodsManagement',
                        component: RouteView,
                        meta: { title: '退货管理', permission: ['ReturnGoodsManagement'] },
                        children: [
                            {
                                path: '/ReturnGoodsManagement/DispatchingManagement',
                                name: 'DispatchingManagement',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ReturnGoodsManagement/DispatchingManagement'),
                                meta: { title: '派工管理', keepAlive: true, permission: ['DispatchingManagement'] }
                            },
                            {
                                path: '/ReturnGoodsManagement/AssignWorkersToConfirmManagement',
                                name: 'AssignWorkersToConfirmManagement',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ReturnGoodsManagement/AssignWorkersToConfirmManagement'),
                                meta: { title: '派工确认管理', keepAlive: true, permission: ['AssignWorkersToConfirmManagement'] }
                            },
                            {
                                path: '/ReturnGoodsManagement/ConfirmReceiptManagement',
                                name: 'ConfirmReceiptManagement',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ReturnGoodsManagement/ConfirmReceiptManagement'),
                                meta: { title: '确认签收管理', keepAlive: true, permission: ['ConfirmReceiptManagement'] }
                            }
                        ]
                    },
                    {
                        path: '/ExchangeGoodsManagement',
                        name: 'ExchangeGoodsManagement',
                        component: RouteView,
                        meta: { title: '换货管理', permission: ['ExchangeGoodsManagement'] },
                        children: [
                            {
                                path: '/ExchangeGoodsManagement/ExchangeDispatching',
                                name: 'ExchangeDispatching',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ExchangeGoodsManagement/ExchangeDispatching'),
                                meta: { title: '派工管理', keepAlive: true, permission: ['ExchangeDispatching'] }
                            },
                            {
                                path: '/ExchangeGoodsManagement/ExchangeConfirmation',
                                name: 'ExchangeConfirmation',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ExchangeGoodsManagement/ExchangeConfirmation'),
                                meta: { title: '派工确认管理', keepAlive: true, permission: ['ExchangeConfirmation'] }
                            },
                            {
                                path: '/ExchangeGoodsManagement/AReplacementReceipt',
                                name: 'AReplacementReceipt',
                                component: () => import('@/pages/storage/LogisticsDistributionManagement/ExchangeGoodsManagement/AReplacementReceipt'),
                                meta: { title: '派工签收管理', keepAlive: true, permission: ['AReplacementReceipt'] }
                            }
                        ]
                    },
                    // {
                    //     path: '/LogisticsDistributionManagement/TheAssigningOfTheTask',
                    //     name: 'TheAssigningOfTheTask',
                    //     component: () => import('@/pages/storage/LogisticsDistributionManagement/TheAssigningOfTheTask'),
                    //     meta: { title: '待派工管理', keepAlive: true, permission: [ 'TheAssigningOfTheTask' ] }
                    // },
                    // {
                    //     path: '/LogisticsDistributionManagement/CustomerService',
                    //     name: 'CustomerService',
                    //     component: () => import('@/pages/storage/LogisticsDistributionManagement/CustomerService'),
                    //     meta: { title: '顾客承职服务单管理', keepAlive: true, permission: [ 'CustomerService' ] }
                    // },
                    // {
                    //     path: '/LogisticsDistributionManagement/ThirdPartyDeliveryOrder',
                    //     name: 'ThirdPartyDeliveryOrder',
                    //     component: () => import('@/pages/storage/LogisticsDistributionManagement/ThirdPartyDeliveryOrder'),
                    //     meta: { title: '第三方派单管理', keepAlive: true, permission: [ 'ThirdPartyDeliveryOrder' ] }
                    // },
                    {
                        path: '/LogisticsDistributionManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/InventoryReport',
                name: 'InventoryReport',
                component: RouteView,
                redirect: '/InventoryReport/storeList',
                meta: { title: '库存报表', icon: 'InventoryReport', permission: [ 'InventoryReport' ] },
                children: [
                    {
                        path: '/InventoryReport/storeList',
                        name: 'storeList',
                        component: () => import('@/pages/storage/InventoryReport/storeList'),
                        meta: { title: '商品库存清单', keepAlive: true, permission: [ 'storeList' ] }
                    },
                    {
                        path: '/InventoryReport/InventoryDistribution',
                        name: 'InventoryDistribution',
                        component: () => import('@/pages/storage/InventoryReport/InventoryDistribution'),
                        meta: { title: '商品库存分布', keepAlive: true, permission: [ 'InventoryDistribution' ] }
                    },
                    {
                        path: '/InventoryReport/BatchInventoryReport',
                        name: 'BatchInventoryReport',
                        component: () => import('@/pages/storage/InventoryReport/BatchInventoryReport'),
                        meta: { title: '批次库存报表', keepAlive: true, permission: [ 'BatchInventoryReport' ] }
                    },
                    {
                        path: '/InventoryReport/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/FactoryPrototypeManagement',
                name: 'FactoryPrototypeManagement',
                component: RouteView,
                redirect: '/FactoryPrototypeManagement/FactoryPrototypeStorage',
                meta: { title: '厂家样机管理', icon: 'FactoryPrototypeManagement', permission: [ 'FactoryPrototypeManagement' ] },
                children: [
                    {
                        path: '/FactoryPrototypeManagement/FactoryPrototypeStorage',
                        name: 'FactoryPrototypeStorage',
                        component: () => import('@/pages/storage/FactoryPrototypeManagement/FactoryPrototypeStorage'),
                        meta: { title: '厂家样机入库申请', keepAlive: true, permission: [ 'FactoryPrototypeStorage' ] }
                    },
                    {
                        path: '/FactoryPrototypeManagement/FactoryPrototypeReturn',
                        name: 'FactoryPrototypeReturn',
                        component: () => import('@/pages/storage/FactoryPrototypeManagement/FactoryPrototypeReturn'),
                        meta: { title: '厂家样机退库申请', keepAlive: true, permission: [ 'FactoryPrototypeReturn' ] }
                    },
                    {
                        path: '/FactoryPrototypeManagement/FactoryPrototypeRegion',
                        name: 'FactoryPrototypeRegion',
                        component: () => import('@/pages/storage/FactoryPrototypeManagement/FactoryPrototypeRegion'),
                        meta: { title: '厂家样机库存分布', keepAlive: true, permission: [ 'FactoryPrototypeRegion' ] }
                    },
                    {
                        path: '/FactoryPrototypeManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/InternalTransferManagement',
                name: 'InternalTransferManagement',
                component: RouteView,
                redirect: '/InternalTransferManagement/StoreGoods',
                meta: { title: '调拨管理', icon: 'InternalTransfer', permission: [ 'InternalTransferManagement' ] },
                children: [
                    {
                        path: '/InternalTransferManagement/internalTransference',
                        name: 'internalTransference',
                        component: () => import('@/pages/storage/InternalTransferManagement/internalTransference'),
                        meta: { title: '内部调拨申请', keepAlive: true, permission: [ 'internalTransference' ] }
                    },
                    {
                        path: '/InternalTransferManagement/FactoryPrototypeTransfer',
                        name: 'FactoryPrototypeTransfer',
                        component: () => import('@/pages/storage/InternalTransferManagement/FactoryPrototypeTransfer'),
                        meta: { title: '厂家样机调拨申请', keepAlive: true, permission: [ 'FactoryPrototypeTransfer' ] }
                    },
                    // {
                    //     path: '/InternalTransferManagement/StoreGoods',
                    //     name: 'StoreGoods',
                    //     component: () => import('@/pages/storage/InternalTransferManagement/StoreGoods'),
                    //     meta: { title: '门店要货', keepAlive: true, permission: [ 'StoreGoods' ] }
                    // },
                    // {
                    //     path: '/InternalTransferManagement/WarehousDistribution',
                    //     name: 'WarehousDistribution',
                    //     component: () => import('@/pages/storage/InternalTransferManagement/WarehousDistribution'),
                    //     meta: { title: '仓库配货', keepAlive: true, permission: [ 'WarehousDistribution' ] }
                    // },
                    // {
                    //     path: '/InternalTransferManagement/StoreReturn',
                    //     name: 'StoreReturn',
                    //     component: () => import('@/pages/storage/InternalTransferManagement/StoreReturn'),
                    //     meta: { title: '店面退配', keepAlive: true, permission: [ 'StoreReturn' ] }
                    // },
                    // {
                    //     path: '/InternalTransferManagement/WarehousTransfer',
                    //     name: 'WarehousTransfer',
                    //     component: () => import('@/pages/storage/InternalTransferManagement/WarehousTransfer'),
                    //     meta: { title: '库间调拨', keepAlive: true, permission: [ 'WarehousTransfer' ] }
                    // },
                    // {
                    //     path: '/InternalTransferManagement/StoreTransfer',
                    //     name: 'StoreTransfer',
                    //     component: () => import('@/pages/storage/InternalTransferManagement/StoreTransfer'),
                    //     meta: { title: '店间调拨', keepAlive: true, permission: [ 'StoreTransfer' ] }
                    // },
                    {
                        path: '/InternalTransferManagement/*', redirect: '/403', hidden: true
                    }
                ]
            }
            // {
            //     path: '/LogisticsTemporaryManagement',
            //     name: 'LogisticsTemporaryManagement',
            //     component: RouteView,
            //     redirect: '/LogisticsTemporaryManagement/TemporaryManagement',
            //     meta: { title: '物流暂存管理', icon: 'LogisticsTemporary', permission: [ 'LogisticsTemporaryManagement' ] },
            //     children: [
            //         {
            //             path: '/LogisticsTemporaryManagement/TemporaryManagement',
            //             name: 'TemporaryManagement',
            //             component: () => import('@/pages/storage/LogisticsTemporaryManagement/TemporaryManagement'),
            //             meta: { title: '暂存登记/出库', keepAlive: true, permission: [ 'TemporaryManagement' ] }
            //         },
            //         {
            //             path: '/LogisticsTemporaryManagement/TemporaryReport',
            //             name: 'TemporaryReport',
            //             component: () => import('@/pages/storage/LogisticsTemporaryManagement/TemporaryReport'),
            //             meta: { title: '暂存报表', keepAlive: true, permission: [ 'TemporaryReport' ] }
            //         },
            //         {
            //             path: '/LogisticsTemporaryManagement/*', redirect: '/403', hidden: true
            //         }
            //     ]
            // }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: 结算中心路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const settlementRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '结算中心' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            {
                path: '/SupplierInvoiceManagement',
                name: 'SupplierInvoiceManagement',
                redirect: '/SupplierInvoiceManagement/InvoiceRegister',
                component: RouteView,
                meta: { title: '供应商发票管理', icon: 'SupplierInvoiceManagement', permission: [ 'SupplierInvoiceManagement' ] },
                children: [
                    {
                        path: '/SupplierInvoiceManagement/InvoiceRegister',
                        name: 'InvoiceRegister',
                        component: () => import('@/pages/settlement/SupplierInvoiceManagement/InvoiceRegister'),
                        meta: { title: '发票登记', keepAlive: true, permission: [ 'InvoiceRegister' ] }
                    },
                    {
                        path: '/SupplierInvoiceManagement/InvoiceDelivery',
                        name: 'InvoiceDelivery',
                        component: () => import('@/pages/settlement/SupplierInvoiceManagement/InvoiceDelivery'),
                        meta: { title: '发票交接', keepAlive: true, permission: [ 'InvoiceDelivery' ] }
                    },
                    {
                        path: '/SupplierInvoiceManagement/BlendingTheInvoice',
                        name: 'BlendingTheInvoice',
                        component: () => import('@/pages/settlement/SupplierInvoiceManagement/BlendingTheInvoice'),
                        meta: { title: '发票勾兑', keepAlive: true, permission: [ 'BlendingTheInvoice' ] }
                    },
                    {
                        path: '/SupplierInvoiceManagement/InvoiceConfirm',
                        name: 'InvoiceConfirm',
                        component: () => import('@/pages/settlement/SupplierInvoiceManagement/InvoiceConfirm'),
                        meta: { title: '发票确认', keepAlive: true, permission: [ 'InvoiceConfirm' ] }
                    },
                    {
                        path: '/SupplierInvoiceManagement/ManufacturerOfDiscount',
                        name: 'ManufacturerOfDiscount',
                        component: () => import('@/pages/settlement/SupplierInvoiceManagement/ManufacturerOfDiscount'),
                        meta: { title: '厂家折让', keepAlive: true, permission: [ 'ManufacturerOfDiscount' ] }
                    },
                    {
                        path: '/SupplierInvoiceManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/SupplierCostManagement',
                name: 'SupplierCostManagement',
                redirect: '/SupplierCostManagement/SupplierExpenseItem',
                component: RouteView,
                meta: { title: '供应商费用管理', icon: 'SupplierCostManagement', permission: [ 'SupplierCostManagement' ] },
                children: [
                    {
                        path: '/SupplierCostManagement/SupplierExpenseItem',
                        name: 'SupplierExpenseItem',
                        component: () => import('@/pages/settlement/SupplierCostManagement/SupplierExpenseItem'),
                        meta: { title: '供应商费用项目', keepAlive: true, permission: [ 'SupplierExpenseItem' ] }
                    },
                    {
                        path: '/SupplierCostManagement/SupplierExpenseMonitoringSheet',
                        name: 'SupplierExpenseMonitoringSheet',
                        component: () => import('@/pages/settlement/SupplierCostManagement/SupplierExpenseMonitoringSheet'),
                        meta: { title: '供应商费用监控单', keepAlive: true, permission: [ 'SupplierExpenseMonitoringSheet' ] }
                    },
                    {
                        path: '/SupplierCostManagement/SupplierExpenseVerificationSheet',
                        name: 'SupplierExpenseVerificationSheet',
                        component: () => import('@/pages/settlement/SupplierCostManagement/SupplierExpenseVerificationSheet'),
                        meta: { title: '供应商费用核销单', keepAlive: true, permission: [ 'SupplierExpenseVerificationSheet' ] }
                    },
                    {
                        path: '/SupplierCostManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/SupplierSettlementManagement',
                name: 'SupplierSettlementManagement',
                component: RouteView,
                redirect: '/SupplierSettlementManagement/ConsignmentSupplierSettlement',
                meta: { title: '供应商结算管理', icon: 'SupplierSettlementManagement', permission: [ 'SupplierSettlementManagement' ] },
                children: [
                    {
                        path: '/SupplierSettlementManagement/SupplierSettlement',
                        name: 'SupplierSettlement',
                        component: () => import('@/pages/settlement/SupplierSettlementManagement/SupplierSettlement'),
                        meta: { title: '供应商结算', keepAlive: true, permission: [ 'SupplierSettlement' ] }
                    },
                    {
                        path: '/SupplierSettlementManagement/SupplierPayment',
                        name: 'SupplierPayment',
                        component: () => import('@/pages/settlement/SupplierSettlementManagement/SupplierPayment'),
                        meta: { title: '供应商付款', keepAlive: true, permission: [ 'SupplierPayment' ] }
                    },
                    {
                        path: '/SupplierSettlementManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/DistrbutionCustomerSettlement',
                name: 'DistrbutionCustomerSettlement',
                component: RouteView,
                redirect: '/DistrbutionCustomerSettlement/CustomerQuotaManagement',
                meta: { title: '分销客户结算', icon: 'DistrbutionCustomerSettlement', permission: [ 'DistrbutionCustomerSettlement' ] },
                children: [
                    {
                        path: '/DistrbutionCustomerSettlement/CustomerQuotaManagement',
                        name: 'CustomerQuotaManagement',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/CustomerQuotaManagement'),
                        meta: { title: '客户限额管理', keepAlive: true, permission: [ 'CustomerQuotaManagement' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/CustomerAdvanceCollectionManagement',
                        name: 'CustomerAdvanceCollectionManagement',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/CustomerAdvanceCollectionManagement'),
                        meta: { title: '客户预收款管理', keepAlive: true, permission: [ 'CustomerAdvanceCollectionManagement' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/CustomerCostManagement',
                        name: 'CustomerCostManagement',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/CustomerCostManagement'),
                        meta: { title: '客户延期付款管理', keepAlive: true, permission: [ 'CustomerCostManagement' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/CommissionSettlement',
                        name: 'CommissionSettlement',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/CommissionSettlement'),
                        meta: { title: '客户结算管理', keepAlive: true, permission: [ 'CommissionSettlement' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/CustomerCollectionManagement',
                        name: 'CustomerCollectionManagement',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/CustomerCollectionManagement'),
                        meta: { title: '客户收款管理', keepAlive: true, permission: [ 'CustomerCollectionManagement' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/ChannelCustomerQuotaMonitoring',
                        name: 'ChannelCustomerQuotaMonitoring',
                        component: () => import('@/pages/settlement/DistrbutionCustomerSettlement/ChannelCustomerQuotaMonitoring'),
                        meta: { title: '渠道客户限额管理报表', keepAlive: true, permission: [ 'ChannelCustomerQuotaMonitoring' ] }
                    },
                    {
                        path: '/DistrbutionCustomerSettlement/*', redirect: '/403', hidden: true
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]

/**
 * @name: 盘点中心路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const stocktakingRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '盘点中心' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            {
                path: '/inventorySetting',
                name: 'inventorySetting',
                redirect: '/inventorySetting/stocktak',
                component: RouteView,
                meta: { title: '盘点设定', icon: 'systemset', permission: [ 'inventorySetting' ] },
                children: [
                    {
                        path: '/inventorySetting/stocktak',
                        name: 'stocktak',
                        component: () => import('@/pages/stocktaking/inventorySetting/stocktak'),
                        meta: { title: '盘点设定', keepAlive: true, permission: [ 'stocktak' ] }
                    },
                    {
                        path: '/inventorySetting/appointment',
                        name: 'appointment',
                        component: () => import('@/pages/stocktaking/inventorySetting/appointment'),
                        meta: { title: '预约管理', keepAlive: true, permission: [ 'appointment' ] }
                    },
                    {
                        path: '/inventorySetting/reservation',
                        name: 'reservation',
                        component: () => import('@/pages/stocktaking/inventorySetting/reservation'),
                        meta: { title: '预约确认', keepAlive: true, permission: [ 'reservation' ] }
                    },
                    {
                        path: '/inventorySetting/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/stocktakingManagement',
                name: 'stocktakingManagement',
                redirect: '/stocktakingManagement/importGoods',
                component: RouteView,
                meta: { title: '盘点管理', icon: 'stocktakingManagement', permission: [ 'stocktakingManagement' ] },
                children: [
                    {
                        path: '/stocktakingManagement/importGoods',
                        name: 'importGoods',
                        component: () => import('@/pages/stocktaking/stocktakingManagement/importGoods'),
                        meta: { title: '商品导入', keepAlive: true, permission: [ 'importGoods' ] }
                    },
                    {
                        path: '/stocktakingManagement/regional',
                        name: 'regional',
                        component: () => import('@/pages/stocktaking/stocktakingManagement/regional'),
                        meta: { title: '区域管理', keepAlive: true, permission: [ 'regional' ] }
                    },
                    {
                        path: '/stocktakingManagement/importInventory',
                        name: 'importInventory',
                        component: () => import('@/pages/stocktaking/stocktakingManagement/importInventory'),
                        meta: { title: '库存导入', keepAlive: true, permission: [ 'importInventory' ] }
                    },
                    {
                        path: '/stocktakingManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/countComparison',
                name: 'countComparison',
                component: RouteView,
                redirect: '/countComparison/drawComparison',
                meta: { title: '盘点比对', icon: 'countComparison', permission: [ 'countComparison' ] },
                children: [
                    {
                        path: '/countComparison/uncountedGoodsStatistics',
                        name: 'uncountedGoodsStatistics',
                        component: () => import('@/pages/stocktaking/countComparison/uncountedGoodsStatistics'),
                        meta: { title: '未盘商品统计', keepAlive: true, permission: [ 'uncountedGoodsStatistics' ] }
                    },
                    {
                        path: '/countComparison/drawComparison',
                        name: 'drawComparison',
                        component: () => import('@/pages/stocktaking/countComparison/drawComparison'),
                        meta: { title: '抽盘比对', keepAlive: true, permission: [ 'drawComparison' ] }
                    },
                    {
                        path: '/countComparison/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/differenceManagement',
                name: 'differenceManagement',
                component: RouteView,
                redirect: '/differenceManagement/accountComparison',
                meta: { title: '差异管理', icon: 'marketing', permission: [ 'differenceManagement' ] },
                children: [
                    {
                        path: '/differenceManagement/accountComparison',
                        name: 'accountComparison',
                        component: () => import('@/pages/stocktaking/differenceManagement/accountComparison'),
                        meta: { title: '账实比对', keepAlive: true, permission: [ 'accountComparison' ] }
                    },
                    {
                        path: '/differenceManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/statistics',
                name: 'statistics',
                component: RouteView,
                redirect: '/statistics/uncountedGoodsStatistics',
                meta: { title: '盘点统计', icon: 'statistics', permission: [ 'statistics' ] },
                children: [
                    {
                        path: '/statistics/countingStatistics',
                        name: 'countingStatistics',
                        component: () => import('@/pages/stocktaking/statistics/countingStatistics'),
                        meta: { title: '盘点统计', keepAlive: true, permission: [ 'countingStatistics' ] }
                    },
                    {
                        path: '/statistics/countDifference',
                        name: 'countDifference',
                        component: () => import('@/pages/stocktaking/statistics/countDifference'),
                        meta: { title: '盘点差异', keepAlive: true, permission: [ 'countDifference' ] }
                    },
                    {
                        path: '/statistics/inventoryLossAbnormal',
                        name: 'inventoryLossAbnormal',
                        component: () => import('@/pages/stocktaking/statistics/inventoryLossAbnormal'),
                        meta: { title: '损耗异常分析', keepAlive: true, permission: [ 'inventoryLossAbnormal' ] }
                    },
                    {
                        path: '/statistics/inventoryLossRanking',
                        name: 'inventoryLossRanking',
                        component: () => import('@/pages/stocktaking/statistics/inventoryLossRanking'),
                        meta: { title: '盘点损耗排名', keepAlive: true, permission: [ 'inventoryLossRanking' ] }
                    },
                    {
                        path: '/statistics/countingLossRiseRanking',
                        name: 'countingLossRiseRanking',
                        component: () => import('@/pages/stocktaking/statistics/countingLossRiseRanking'),
                        meta: { title: '盘点损耗上升排名', keepAlive: true, permission: [ 'countingLossRiseRanking' ] }
                    },
                    {
                        path: '/statistics/inventoryLossAnnualRanking',
                        name: 'inventoryLossAnnualRanking',
                        component: () => import('@/pages/stocktaking/statistics/inventoryLossAnnualRanking'),
                        meta: { title: '盘点损耗年度排名', keepAlive: true, permission: [ 'inventoryLossAnnualRanking' ] }
                    },
                    {
                        path: '/statistics/*', redirect: '/403', hidden: true
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: CRM中心路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const crmRouterMap = [

    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: 'CRM系统' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            {
                path: '/CRMcustomerManagement',
                name: 'CRMcustomerManagement',
                redirect: '/CRMcustomerManagement/customerInformation',
                component: RouteView,
                meta: { title: '顾客管理', icon: 'CRMcustomerManagement', permission: [ 'CRMcustomerManagement' ] },
                children: [
                    {
                        path: '/CRMcustomerManagement/customerInformation',
                        name: 'customerInformation',
                        component: () => import('@/pages/crm/CRMcustomerManagement/customerInformation'),
                        meta: { title: '顾客信息', keepAlive: true, permission: [ 'customerInformation' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/CustomerManagement',
                        name: 'CustomerManagement',
                        component: () => import('@/pages/crm/CRMcustomerManagement/CustomerManagement'),
                        meta: { title: '集客管理', keepAlive: true, permission: [ 'CustomerManagement' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/CustomerTransferLog',
                        name: 'CustomerTransferLog',
                        component: () => import('@/pages/crm/CRMcustomerManagement/CustomerTransferLog'),
                        meta: { title: '顾客转移日志', keepAlive: true, permission: [ 'CustomerTransferLog' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/customerMarketing',
                        name: 'customerMarketing',
                        component: () => import('@/pages/crm/CRMcustomerManagement/customerMarketing'),
                        meta: { title: '顾客营销', keepAlive: true, permission: [ 'customerMarketing' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/customerInteraction',
                        name: 'customerInteraction',
                        component: () => import('@/pages/crm/CRMcustomerManagement/customerInteraction'),
                        meta: { title: '顾客互动', keepAlive: true, permission: [ 'customerInteraction' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/customerAnalysis',
                        name: 'customerAnalysis',
                        component: () => import('@/pages/crm/CRMcustomerManagement/customerAnalysis'),
                        meta: { title: '顾客分析', keepAlive: true, permission: [ 'customerAnalysis' ] }
                    },
                    {
                        path: '/CRMcustomerManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/cardManagement',
                name: 'cardManagement',
                redirect: '/cardManagement/BlankCardStorage',
                component: RouteView,
                meta: { title: '卡管理', icon: 'cardManagement', permission: [ 'cardManagement' ] },
                children: [
                    {
                        path: '/cardManagement/CardTypeDefinition',
                        name: 'CardTypeDefinition',
                        component: () => import('@/pages/crm/cardManagement/CardTypeDefinition'),
                        meta: { title: '卡类型定义', keepAlive: true, permission: [ 'CardTypeDefinition' ] }
                    },
                    {
                        path: '/cardManagement/BlankCardStorage',
                        name: 'BlankCardStorage',
                        component: () => import('@/pages/crm/cardManagement/BlankCardStorage'),
                        meta: { title: '空白卡入库', keepAlive: true, permission: [ 'BlankCardStorage' ] }
                    },
                    {
                        path: '/cardManagement/DefinitionStoredValueRules',
                        name: 'DefinitionStoredValueRules',
                        component: () => import('@/pages/crm/cardManagement/DefinitionStoredValueRules'),
                        meta: { title: '储值规则定义', keepAlive: true, permission: [ 'DefinitionStoredValueRules' ] }
                    },
                    {
                        path: '/cardManagement/cardProduction',
                        name: 'cardProduction',
                        component: () => import('@/pages/crm/cardManagement/cardProduction'),
                        meta: { title: '卡制作', keepAlive: true, permission: [ 'cardProduction' ] }
                    },
                    {
                        path: '/cardManagement/cardRecipients',
                        name: 'cardRecipients',
                        component: () => import('@/pages/crm/cardManagement/cardRecipients'),
                        meta: { title: '卡领用', keepAlive: true, permission: [ 'cardRecipients' ] }
                    },
                    {
                        path: '/cardManagement/cardStoredValue',
                        name: 'cardStoredValue',
                        component: () => import('@/pages/crm/cardManagement/cardStoredValue'),
                        meta: { title: '卡储值', keepAlive: true, permission: [ 'cardStoredValue' ] }
                    },
                    {
                        path: '/cardManagement/SalesStoredValueCARDS',
                        name: 'SalesStoredValueCARDS',
                        component: () => import('@/pages/crm/cardManagement/SalesStoredValueCARDS'),
                        meta: { title: '储值卡销售', keepAlive: true, permission: [ 'SalesStoredValueCARDS' ] }
                    },
                    {
                        path: '/cardManagement/cardMaintenance',
                        name: 'cardMaintenance',
                        component: () => import('@/pages/crm/cardManagement/cardMaintenance'),
                        meta: { title: '卡维护', keepAlive: true, permission: [ 'cardMaintenance' ] }
                    },
                    {
                        path: '/cardManagement/cardStatement',
                        name: 'cardStatement',
                        component: () => import('@/pages/crm/cardManagement/cardStatement'),
                        meta: { title: '卡报表', keepAlive: true, permission: [ 'cardStatement' ] }
                    },
                    {
                        path: '/cardManagement/cardUsageReport',
                        name: 'cardUsageReport',
                        component: () => import('@/pages/crm/cardManagement/cardUsageReport'),
                        meta: { title: '卡使用报表', keepAlive: true, permission: [ 'cardUsageReport' ] }
                    },
                    {
                        path: '/cardManagement/cardLog',
                        name: 'cardLog',
                        component: () => import('@/pages/crm/cardManagement/cardLog'),
                        meta: { title: '卡日志', keepAlive: true, permission: [ 'cardLog' ] }
                    },
                    {
                        path: '/cardManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/systemSettings',
                name: 'systemSettings',
                redirect: '/systemSettings/classifyManagement',
                component: RouteView,
                meta: { title: '系统设置', icon: 'cardManagement', permission: [ 'classifyManagement' ] },
                children: [
                    {
                        path: '/systemSettings/messageTemplate',
                        name: 'messageTemplate',
                        component: () => import('@/pages/crm/systemSettings/messageTemplate'),
                        meta: { title: '消息模板', keepAlive: true, permission: [ 'messageTemplate' ] }
                    },
                    {
                        path: '/systemSettings/notificationManagement',
                        name: 'notificationManagement',
                        component: () => import('@/pages/crm/systemSettings/notificationManagement'),
                        meta: { title: '通知管理', keepAlive: true, permission: [ 'notificationManagement' ] }
                    },
                    {
                        path: '/systemSettings/classifyManagement',
                        name: 'classifyManagement',
                        component: () => import('@/pages/crm/systemSettings/classifyManagement'),
                        meta: { title: '分类管理', keepAlive: true, permission: [ 'classifyManagement' ] }
                    },
                    {
                        path: '/systemSettings/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/ContentSettings',
                name: 'ContentSettings',
                redirect: '/ContentSettings/ContentManagement',
                component: RouteView,
                meta: { title: '内容设置', icon: 'ContentSettings', permission: [ 'ContentSettings' ] },
                children: [
                    {
                        path: '/ContentSettings/ContentManagement',
                        name: 'ContentManagement',
                        component: () => import('@/pages/crm/ContentSettings/ContentManagement'),
                        meta: { title: '内容管理', keepAlive: true, permission: [ 'ContentManagement' ] }
                    },
                    {
                        path: '/ContentSettings/IntegralDescription',
                        name: 'IntegralDescription',
                        component: () => import('@/pages/crm/ContentSettings/IntegralDescription'),
                        meta: { title: '积分说明', keepAlive: true, permission: [ 'IntegralDescription' ] }
                    },
                    {
                        path: '/ContentSettings/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/MarketingManagement',
                name: 'MarketingManagement',
                redirect: '/MarketingManagement/IntegralGenerateRuleDefinie',
                component: RouteView,
                meta: { title: '营销管理', icon: 'MarketingManagement', permission: [ 'MarketingManagement' ] },
                children: [
                    {
                        path: '/MarketingManagement/IntegralGenerateRuleDefinie',
                        name: 'IntegralGenerateRuleDefinie',
                        component: () => import('@/pages/crm/MarketingManagement/IntegralGenerateRuleDefinie'),
                        meta: { title: '积分生成规则定义', keepAlive: true, permission: [ 'IntegralGenerateRuleDefinie' ] }
                    },
                    {
                        path: '/MarketingManagement/IntegralExchangeRuleDefinie',
                        name: 'IntegralExchangeRuleDefinie',
                        component: () => import('@/pages/crm/MarketingManagement/IntegralExchangeRuleDefinie'),
                        meta: { title: '积分兑换规则定义', keepAlive: true, permission: [ 'IntegralExchangeRuleDefinie' ] }
                    },
                    {
                        path: '/MarketingManagement/AdvertisingManagement',
                        name: 'AdvertisingManagement',
                        component: () => import('@/pages/crm/MarketingManagement/AdvertisingManagement'),
                        meta: { title: '广告管理', keepAlive: true, permission: [ 'AdvertisingManagement' ] }
                    },
                    {
                        path: '/MarketingManagement/WeekRecommendedManagement',
                        name: 'WeekRecommendedManagement',
                        component: () => import('@/pages/crm/MarketingManagement/WeekRecommendedManagement'),
                        meta: { title: '每周推荐管理', keepAlive: true, permission: [ 'WeekRecommendedManagement' ] }
                    },
                    {
                        path: '/MarketingManagement/ActiveManagement',
                        name: 'ActiveManagement',
                        component: () => import('@/pages/crm/MarketingManagement/ActiveManagement'),
                        meta: { title: '活动管理', keepAlive: true, permission: [ 'ActiveManagement' ] }
                    },
                    {
                        path: '/MarketingManagement/HotRecommendedSetting',
                        name: 'HotRecommendedSetting',
                        component: () => import('@/pages/crm/MarketingManagement/HotRecommendedSetting'),
                        meta: { title: '热门推荐设置', keepAlive: true, permission: [ 'HotRecommendedSetting' ] }
                    },
                    {
                        path: '/MarketingManagement/*', redirect: '/403', hidden: true
                    }
                ]
            },
            {
                path: '/ServiceManagement',
                name: 'ServiceManagement',
                redirect: '/ServiceManagement/ServiceContentManagement',
                component: RouteView,
                meta: { title: '服务管理', icon: 'ServiceManagement', permission: [ 'ServiceManagement' ] },
                children: [
                    {
                        path: '/ServiceManagement/ServiceContentManagement',
                        name: 'ServiceContentManagement',
                        component: () => import('@/pages/crm/ServiceManagement/ServiceContentManagement'),
                        meta: { title: '服务内容管理', keepAlive: true, permission: [ 'ServiceContentManagement' ] }
                    },
                    {
                        path: '/ServiceManagement/*', redirect: '/403', hidden: true
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * @name: 售后中心路由系统
 * @msg:
 * @param {type}
 * @return:
 */
export const aftersalesRouterMap = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '售后中心首页' },
        redirect: '/dashboard/Workplace',
        children: [
            ...publicRouterMap,
            // AftersalesBooking
            {
                path: '/ServiceRegistrationForm',
                name: 'ServiceRegistrationForm',
                component: () => import('@/pages/aftersales/ServiceRegistrationForm/ServiceRegistrationForm'),
                meta: { title: '服务登记单', icon: 'ServiceRegistrationForm', keepAlive: true, permission: [ 'ServiceRegistrationForm' ] }
            },
            // AftersalesProblem
            {
                path: '/CustomerServiceOrder',
                name: 'CustomerServiceOrder',
                component: () => import('@/pages/aftersales/CustomerServiceOrder/CustomerServiceOrder'),
                meta: { title: '客户服务单', icon: 'CustomerServiceOrder', keepAlive: true, permission: [ 'CustomerServiceOrder' ] }
            },

            // AftersalesMonitoring
            {
                path: '/AftersalesMonitoring',
                name: 'AftersalesMonitoring',
                component: () => import('@/pages/aftersales/AftersalesMonitoring/AftersalesMonitoring'),
                meta: { title: '售后监控管理', icon: 'AftersalesMonitoring', keepAlive: true, permission: ['AftersalesMonitoring'] }
            },
            // AftersalesReport
            {
                path: '/AftersalesReport',
                name: 'AftersalesReport',
                redirect: '/AftersalesReport/MaintenanceReport',
                component: RouteView, // PageView,
                meta: { title: '售后报表管理', icon: 'AftersalesReport', permission: ['AftersalesReport'] },
                children: [
                    {
                        path: '/AftersalesReport/MaintenanceReport',
                        name: 'MaintenanceReport',
                        component: () => import('@/pages/aftersales/AftersalesReport/MaintenanceReport'),
                        meta: { title: '维修报表', keepAlive: true, permission: [ 'MaintenanceReport' ] }
                    },
                    {
                        path: '/AftersalesReport/InstallationReport',
                        name: 'InstallationReport',
                        component: () => import('@/pages/aftersales/AftersalesReport/InstallationReport'),
                        meta: { title: '安装报表', keepAlive: true, permission: [ 'InstallationReport' ] }
                    },
                    {
                        path: '/AftersalesReport/*', redirect: '/403', hidden: true
                    }
                ]
            }
        ]
    },
    {
        path: '*', redirect: '/404', hidden: true
    }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
    {
        path: '/user',
        component: UserLayout,
        redirect: '/user/login',
        hidden: true,
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
            },
            {
                path: 'register',
                name: 'register',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
            },
            {
                path: 'recover',
                name: 'recover',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/Recover')
            },
            {
                path: 'register-result',
                name: 'registerResult',
                component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
            },
            {
                path: '/pdf',
                name: 'PDF',
                component: () => import('@/components/upload/PDF.vue')
            }
        ]
    },
    {
        path: '/test',
        component: BlankLayout,
        redirect: '/test/home',
        children: [
            {
                path: 'home',
                name: 'TestHome',
                component: () => import('@/views/Home')
            }
        ]
    },
    {
        path: '/locking',
        name: 'locking',
        component: () => import(/* webpackChunkName: "fail" */ '@comp/lockscreen/components/locking-page.vue')
    },
    {
        path: '/403',
        name: '403',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403')
    },
    {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
    },
    {
        path: '/500',
        name: '500',
        component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500')
    }

]

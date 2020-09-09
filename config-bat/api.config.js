/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: lmt
 * @Date: 2019-04-01 13:56:33
 * @LastEditTime: 2019-08-14 09:39:48
 */
// 环境
// const env = true
export const env = process.env.NODE_ENV === 'production'
// 是否云端环境
export const isCloudEnv = true

// 主API
const URL = env && isCloudEnv
    ? 'https://8f9ada4e8570491b808fbd13af80ee4c.besttop.top'
    : 'http://192.168.198.124:10011'
// 文件服务
const UPLOAD = env && isCloudEnv
    ? 'https://upload-server.besttop.top'
    : 'http://192.168.198.124:10081'
// 文件预览
const FILE_REVIEW = env && isCloudEnv
    ? 'https://upload-server.besttop.top/review'
    : 'http://192.168.198.124:10081/file/download'

// 表头服务
const TABLEHEADER = env && isCloudEnv
    ? 'https://8f9ada4e8570491b808fbd13af80ee4c.besttop.top'
    : 'http://192.168.198.124:10011'

/**
* @description 微信服务
*/
const WECHAT = 'https://weapp-server.besttop.top'

// 是否对接老系统 (SKU辅助信息)
const isConnectOldErp = false

// 是否公司环境
export const isCompanyEnv = true
/**
 * @description 免权接口定义
 */
const PATH = {
    // 日志
    logApi: '/api-service-log/sys/record/addBatch',
    // 心跳
    heartUrl: '/api-service-message/sys/message/countMessages',
    // 登录
    login: '/api-user/logon',
    // 设置登录门店
    PermissionsRoleMenuQueryStoreInfo: '/api-goods/organization/store/queryStoreInfo',
    // 锁屏解锁
    unlock: '/api-user/validatePwd',
    // 获取用户权限
    getRole: '/api-user/permissions/roleMenu/queryAuthorizationForLogin',
    // 登录窗检查账户下分店
    getLoginStore: '/api-user/permissions/data/findStorePermission',
    // getLoginStore: '/api-user/permissions/data/queryStorePermission',
    // 获取表头
    tableHead: '/api-service-tablehead/table/column/findByTableCode',
    devFlushToTest: '/api-service-tablehead/table/column/devFlushToTest',
    // 微信服务
    WechatGetQrCode: '/wechat/getQrCode',
    // 赋权接口
    ActionMenuFunctionFindAllMenu: '/api-user/action/menuFunction/findAllMenu',
    ActionMenuFunctionFindActionByMenu: '/api-user/action/menuFunction/findActionByMenu',
    ActionMenuFunctionFindAllApi: '/api-user/action/menuFunction/findAllApi',
    ActionMenuFunctionAddAction: '/api-user/action/menuFunction/addAction',
    ActionMenuFunctionFindSysList: '/api-user/action/menuFunction/findSysList',
    ActionMenuFunctionFindMenuList: '/api-user/action/menuFunction/findMenuList',
    ActionMenuFunctionAddButton: '/api-user/action/menuFunction/addButton',
    ActionMenuFunctionDeleteByCodes: '/api-user/action/menuFunction/deleteByCodes',
    ActionMenuFunctionUpdateMenu: '/api-user/action/menuFunction/updateMenu',

    // 选择器接口
    OrganizationStoreFindCondition: '/api-goods/organization/store/findCondition',
    CustomerSupplierFindCondition: '/api-goods/customer/supplier/findCondition',
    GoodsBrandFindCondition: '/api-goods/goods/brand/findCondition',
    GoodsCategoryFindCondition: '/api-goods/goods/category/findCondition',
    GoodsSkuFindCondition: '/api-goods/goods/sku/findCondition',
    // 数据大盘
    dashboardFindStocktakePerson: '/api-stocktaking/dashboard/findStocktakePerson',
    dashboardFindDifference: '/api-stocktaking/dashboard/findDifference',
    DashboardFindDifferenceRanking: '/api-stocktaking/dashboard/findDifferenceRanking',
    WechatFindStatisticUser: '/api-stocktaking/wechat/findStatisticUser',
    // 富文本简介
    IntroductionSaveIntroduction: '/api-goods/introduction/saveIntroduction',
    IntroductionFindIntroduction: '/api-goods/introduction/findIntroduction',
    // 上传文件
    upDate: '/file/upload',
    getUrl: '/api-metadata/file/getUrl',
    /* 系统参数下拉框，只需要传type */
    // 店面信息：经营区域、类型、系统参数条件查询、商品信息商品类型接口 / 税率 / 季节 /管理标志 / 标签类型、店面信息新增页面店面类型接口
    OrganizationConfigFindByType: '/api-user/organization/config/findByType',
    OrganizationConfigFindByTypes: '/api-user/organization/config/findByTypes',
    // 查询数据权限是否免权
    PermissionsDataIsPrivilege: '/api-user/permissions/data/isPrivilege',
    // 电子货架
    OrganizationGroupFrameworkQueryOrganizationTree: '/api-goods/organization/groupFramework/queryOrganizationTree',
    ShelfModelAddModel: '/api-marketing/shelf/model/addModel',
    ShelfModelUpdateElectronicShelfModel: '/api-marketing/shelf/model/updateElectronicShelfModel',
    ShelfGoodsAddElectronicShelfGoods: '/api-marketing/shelf/goods/addElectronicShelfGoods ',
    ShelfModelQueryByStoreCode: '/api-marketing/shelf/model/queryByStoreCode',
    ShelfModelUpdateStatusUpdateStatus: '/api-marketing/shelf/model/updateStatus',
    ShelfModelUpdateStatusDeleteModel: '/api-marketing/shelf/model/deleteModel',
    ShelfModelQueryModelDetail: '/api-marketing/shelf/model/queryModelDetail',
    ShelfModelDeleteModel: '/api-marketing/shelf/model/deleteModelId',
    // 新版表格内置选择器
    OrganizationStoreFindBySelected: '/api-goods/organization/store/findStoreList',
    GoodsCategoryFindClassTree: '/api-goods/goods/category/findClassTree',
    GoodsCategoryFindChildren: '/api-goods/goods/category/findChildren',
    goodsSkuFindSkuList: '/api-goods/goods/sku/findSkuList',
    /**
     *
     * 多语言自定义修改
     */
    // 获取多语言
    getI18n: '/api-goods/menuCustomiz/i18n/query',
    updateI18n: '/api-goods/menuCustomiz/i18n/update',
    resetI18n: '/api-goods/menuCustomiz/i18n/reset',
    getHeaderNotice: '/api-service-message/sys/message/findSysMessageList',
    updateHeaderNotice: '/api-service-message/sys/message/updateMessageStatus',
    SysMessageFindApprovalList: '/api-service-message/sys/message/findApprovalList',
    SysApprovalDefineSubmitApproval: '/api-service-approval/sysApprovalDefine/submitApproval',
    SysApprovalLogFindLogList: '/api-service-approval/sysApprovalLog/findLogList',
    SysApprovalDefineFindNodeByResult: '/api-service-approval/sysApprovalDefine/findNodeByResult',
    // 修改用户头像
    PermissionsUserUpdateAvatar: '/api-user/permissions/user/updateAvatar',
    // 修改密码
    PermissionsUserUpdatePwd: '/api-user/permissions/user/updatePwd',
    // 修改用户信息
    PermissionsUserUpdate: '/api-user/permissions/user/update',
    // 查询架构信息树
    OrganizationGroupFrameworkFindAll: '/api-goods/organization/groupFramework/findAll',

    // 查询部门
    queryStoreList: '/api-old-new/goods/queryStoreList',
    // 查询供应商
    queryProviderList: '/api-old-new/goods/queryProviderList',
    // 查询经营类型
    queryContractType: '/api-old-new/goods/queryContractType'

}
const CONFIG = {
    url: '/',
    method: 'post', // 默认是 post
    params: {},
    paramsSerializer (params) {},
    data: {},
    timeout: 120000,
    responseType: 'json', // 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    maxContentLength: 40000,
    validateStatus (status) {
        return status >= 200 && status < 300
    },
    maxRedirects: 10,
    withCredentials: false, // 跨域请求时不需要使用凭证
    changeOrigin: true, // 允许跨域
    isSteamData: false
}
export {
    URL, UPLOAD, PATH, CONFIG, TABLEHEADER, WECHAT, FILE_REVIEW, isConnectOldErp
}

/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-31 14:49:01
 */
/**
 * addRouters：路由
 * actions：按钮权限
 * pageRoles：页面权限
 * system：系统权限
 * name：用户名
 * avatar：头像
 * userInfo：用户信息
 * storeInfo：当前登录门店信息
 * token：登录态
 * welcome：欢迎语
 * color：颜色
 * theme：主题
 * device：设备类型
 * pageName：页面名
 * windowHeight：窗口高度
 */
const getters = {
    code: state => state.user.code,
    device: state => state.app.device,
    theme: state => state.app.theme,
    color: state => state.app.color,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    welcome: state => state.user.welcome,
    userInfo: state => state.user.info,
    storeInfo: state => state.user.storeInfo,
    addRouters: state => state.permission.addRouters,
    multiTab: state => state.app.multiTab,
    pageRoles: state => state.user.pageRoles,
    system: state => state.user.system,
    actions: state => state.user.actions,
    lastSystemName: state => state.user.lastSystemName,
    pageName: state => state.app.pageName,
    themeSetting: state => state.app.themeSetting,
    windowHeight: state => state.app.windowHeight,
    windowWidth: state => state.app.windowWidth,
    chooseStore: state => state.app.chooseStore,
    // 税率
    taxRate: state => state.user.taxRate,
    // 销项税率
    taxRateSale: state => state.user.taxRateSale,
    messageCount: state => state.user.messageCount,
    // 导购开票 -> 顾客id
    customerId: state => state.customer.customerId,
    customerName: state => state.customer.customerName,
    customerTelephone: state => state.customer.customerTelephone

}

export default getters

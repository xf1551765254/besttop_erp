/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-03 09:34:30
 */
/**
 * 项目默认配置项
 * Author - 版权
 * user - 客户
 * system - 系统名
 * Version - 版本
 * miniApp - 小程序名
 * miniAppId - 小程序appid
 * primaryColor - 默认主题色
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */
export default {

    /** 可手配 */
    Author: '西安贝图科技有限公司',
    userfullname: '西安贝图科技有限公司',
    user: '新百电器',
    system: '企业数字化平台',
    Version: 'V0.0.13',
    miniApp: '',
    miniAppId: '',

    /** 自动获取，不建议手动改 */
    primaryColor: '#1890FF',
    navTheme: 'dark',
    layout: 'sidemenu',
    contentWidth: 'Fixed',
    fixedHeader: true,
    fixSiderbar: true,
    autoHideHeader: true,
    colorWeak: false,
    multiTab: true,
    taxRate: [{ title: 0.13, value: 0.13 }, { title: 0.16, value: 0.16 }],
    taxRateSale: [{ title: 0.13, value: 0.13 }, { title: 0.16, value: 0.16 }],

    /** 静态配置，勿动 */
    storageOptions: {
        namespace: 'BTP__',
        name: 'ls',
        storage: 'local'
    }
}

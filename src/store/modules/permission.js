/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lin
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-05-22 17:23:11
 */
import {
    metadataRouterMap,
    marketingRouterMap,
    purchasingRouterMap,
    constantRouterMap,
    storageRouterMap,
    settlementRouterMap,
    stocktakingRouterMap,
    crmRouterMap,
    aftersalesRouterMap
} from '@/config/router.config'
import is from 'is_js'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
    if (route.meta && route.meta.permission) {
        let flag = false
        for (let i = 0, len = permission.length; i < len; i++) {
            flag = route.meta.permission.includes(permission[i])
            if (flag) {
                return true
            }
        }
        return false
    }
    return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
    if (route.meta && route.meta.roles) {
        return route.meta.roles.includes(roles.id)
    } else {
        return true
    }
}

function filterAsyncRouter (routerMap, roles) {
    const accessedRouters = routerMap.filter(route => {
        if (hasPermission(roles, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes ({ commit }, data) {
            return new Promise(resolve => {
                const roles = [...['dashboard', 'result', 'user'], ...data.roles]
                const routerMap = {
                    metadata: metadataRouterMap,
                    marketing: marketingRouterMap,
                    purchasing: purchasingRouterMap,
                    storage: storageRouterMap,
                    settlement: settlementRouterMap,
                    stocktaking: stocktakingRouterMap,
                    crm: crmRouterMap,
                    aftersales: aftersalesRouterMap
                }
                if (is.array(routerMap[data.system])) {
                    commit('SET_LAST_SYSTEM_NAME', data.system)
                    const accessedRouters = filterAsyncRouter(routerMap[data.system], roles)
                    commit('SET_ROUTERS', accessedRouters)
                }
                resolve()
            })
        }
    }
}

export default permission

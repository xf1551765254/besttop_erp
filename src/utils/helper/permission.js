/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-18 16:57:29
 */
import store from '../../store'

function plugin (Vue) {
    if (plugin.installed) {
        return
    }

    !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
        $auth: {
            get () {
                const _this = this
                return (permissions) => {
                    const [permission, action] = permissions.split('.')
                    const permissionList = _this.$store.getters.actions
                    permissionList.find((val) => {
                        return val.permissionId === permission
                    }).actions.findIndex((val) => {
                        return val === action
                    })
                    return false
                }
            }
        }
    })

    !Vue.prototype.$action && Object.defineProperties(Vue.prototype, {
        $action: {
            get () {
                return (val) => {
                    if (!val) {
                        Vue.prototype.$logger.error('尚未给右键菜单配置权限,请参阅语雀文档！', true)
                        return true
                    }
                    const [permissionId, actionName] = val.split('.')
                    const roles = store.getters.actions
                    let actions = []
                    roles.forEach(p => {
                        if (p.permissionId !== permissionId) {
                            return
                        }
                        actions = p.actions
                    })
                    if (actions.indexOf(actionName) < 0) {
                        Vue.prototype.$logger.warning(`无权-->${actionName}`, true)
                        return true
                    } else {
                        return false
                    }
                }
            }
        }
    })
}

export default plugin

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-02-28 10:43:24
 -->
<script>
export default {
    name: 'RouteView',
    data () {
        return {}
    },
    render () {
        const { $route: { meta }, $store: { getters } } = this

        const inKeep = (
            <keep-alive>
                <router-view />
            </keep-alive>
        )
        const notKeep = (
            <router-view />
        )
        // 这里增加了 multiTab 的判断，当开启了 multiTab 时
        // 应当全部组件皆缓存，否则会导致切换页面后页面还原成原始状态
        // 若确实不需要，可改为 return meta.keepAlive ? inKeep : notKeep
        return meta.keepAlive || getters.multiTab ? inKeep : notKeep
    }
}
</script>

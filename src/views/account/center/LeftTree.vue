<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: zcc
 * @LastEditors: zcc
 * @Date: 2019-08-7 19:08:49
 * @LastEditTime: 2019-08-9 19:08:49
 -->
<script>
import { axios } from '@/utils/request'
import { isCompanyEnv } from '@/config/api.config'

export default {
    inheritAttrs: false,
    methods: {
        Actions ({ code, title }) {
            return isCompanyEnv && (
                <a class='action'>
                    {/* <a-icon type="edit" />
                    <a-divider type="vertical" /> */}
                    <a-popconfirm
                        title={'确定要删除'}
                        onConfirm={() => this.deleteById(code)} >
                        <a-icon type="delete" />
                    </a-popconfirm>
                </a>
            )
        },
        async deleteById (code) {
            if (!code) {
                return this.$message.warn('请先删除该菜单下的所有子菜单!')
            }
            const { flag } = await axios({
                path: 'ActionMenuFunctionDeleteByCodes',
                body: { code }
            })
            flag && this.$emit('reload')
        },
        TreeNode (arr) {
            return arr.map(props => {
                const title = <span>{props.title}{this.Actions(props)} </span>
                props = { ...props, title }
                return (
                    <a-tree-node {...{ props } } >
                        {props.children && this.TreeNode(props.children)}
                    </a-tree-node>
                )
            })
        }
    },
    render () {
        const { treeData, loading } = this.$attrs
        return (
            <a-directory-tree
                defaultExpandAll
                loading={loading}
                on={this.$listeners} >
                {this.TreeNode(treeData)}
            </a-directory-tree>
        )
    }
}
</script>
<style lang="less" scoped>
.action{
    position: relative;
    z-index: 100;
    float: right;
}
/deep/.ant-tree-node-selected {
    .action{
        color: white
    }
}
/deep/ .ant-tree-node-content-wrapper{
    width:100%;
    white-space: nowrap;
    overflow: hidden;
    padding-right: 40px!important
}
</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: lmt
 * @Date: 2019-03-07 09:00:27
 * @LastEditTime: 2019-08-01 13:50:50
 -->
<template>
  <div>
    <div style="position:relative;height:40px;line-height:40px">
      <a-button type="primary" @click="getData" style="position:fixed;right:30px">刷新</a-button>
    </div>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
    ></NewTable>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
export default {
    name: 'SystemTerminal',
    components: { NewTable },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            MenuOperations: [
                { name: '退出登录', action: 'systemTerminal.edit', fc: this.logout }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'bcece477bb0449c5905af97923150795:systemTerminal'
            this.tableApiPath = 'FindUserStatusList'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
    },
    methods: {
        /**
         * @name: 刷新表格
         */
        getData () {
            this.$refs.newTable.setTableData('3d20a18d0f3b4f3e9703a7a43a8ed47c:systemTerminal', { path: 'FindUserStatusList' })
        },
        /**
         * @name: logout
         */
        logout (row) {
            axios({
                path: 'Logout', // 接口path名，必传
                method: 'post',
                body: {
                    token: row.token
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                }
            })
        }
    }
}
</script>

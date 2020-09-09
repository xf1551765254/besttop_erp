<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-01 19:32:03
 * @LastEditTime: 2019-04-05 01:04:18
 -->
<template>
  <div>
    <!-- 搜索框预留 start -->

    <!-- end -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
<style lang="less" scoped>

</style>
<script>
import NewTable from '@comp/newTable'
export default {
    name: 'MenuCustomiz',
    data () {
        return {
            tableCode: '',
            tableApiPath: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'eac52fec609045f5bf9e60e645f40884:menuCustomiz'
            this.tableApiPath = 'getI18n'
        })
    },
    components: {
        NewTable
    }
}
</script>

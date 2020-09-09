<!--
 * @Description: ERP
 * @Version: V0.0.10
 * @Company: BestTop
 * @Author: shuai
 * @Date: 2019-06-27 11:28:17
 * @LastEditors: shuai
 * @LastEditTime: 2019-06-27 15:24:50
 -->
<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-27 10:50:33
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'GoodsConfig',
    components: {
        NewTable,
        SeachBox
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: 'DistributionSkuStockSelectReportFormSkuStockBatch',
            seachValue: {
                storeCodes: [this.$store.getters.storeInfo.code]
            },
            btns: ['export', 'print'],
            conditions: [
                {
                    title: '分店',
                    type: 'select',
                    key: 'storeCodes',
                    path: 'OrganizationStoreFind',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    multiple: true,
                    mode: 'multiple',
                    maxTagCount: 99
                },
                {
                    title: '供应商',
                    type: 'select',
                    key: 'providerCodes',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99
                },
                {
                    title: '批次号',
                    type: 'input',
                    key: 'batchNumber'
                },
                {
                    title: '商品SKU',
                    type: 'input',
                    key: 'code'
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '760002a42a294b4b8c73a9b9f84e107d:BatchInventoryReport'
        })
    },
    methods: {
        // 搜索框方法
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {

            } else if (e === 'edit') {

            } else if (e === 'del') {

            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionSkuStockSelectReportFormSkuStockBatch', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'DistributionSkuStockSelectReportFormSkuStockBatch'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'BatchInventoryReport') {
            }
        }
    }
}
</script>

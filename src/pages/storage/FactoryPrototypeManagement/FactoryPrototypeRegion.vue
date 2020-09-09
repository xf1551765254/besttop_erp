<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-22 16:33:11
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>
<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
export default {
    name: 'FactoryPrototypeRegion',
    components: { seachBox, NewTable, BtModal },
    data () {
        return {
            tags: [],
            orderId: '',
            // 表头id
            tableCode: '',
            // 负责人
            customerLIst: [],
            // 接口
            tableApiPath: '',
            // 工具栏搜索框
            conditions: [
                {
                    title: 'SKU编码/名称',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '机构编码/名称',
                    key: 'storeCodes',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'OrganizationStoreFindOption',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99
                },
                {
                    title: '品类编码/名称',
                    key: 'classCodes',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'GoodsCategoryFindTreeOption',
                    filter: true,
                    mode: 'multiple',
                    maxTagCount: 99
                },
                {
                    title: '品牌编码/名称',
                    key: 'brandCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'GoodsBrandFindOption',
                    filter: true
                }
            ],
            // 工具栏按钮定义
            btns: ['export', 'print'],
            // 搜索框默认值
            seachValue: {

            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '7d06125a5e424325808bb70e37bf3b56:FactoryPrototypeRegion'
            this.tableApiPath = 'SampleSkuStockFind'
        })
    },
    methods: {
    /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'SampleSkuStockFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SampleSkuStockFind', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        }
    }
}
</script>

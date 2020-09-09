<!--
 * @Description:未盘点商品统计
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-12 21:32:08
 * @LastEditTime: 2019-04-23 18:11:52
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onClick"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :rowSelect="false"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </div>
</template>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'UncountedGoodsStatistics',
    components: {
        NewTable,
        SeachBox
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '8fcba14e78e949269074abb5e2237ff4:uncountedGoodsStatistics'
            // this.tableApiPath = 'StocktakeStatisticalFindNoInputGoods'
        })
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: 'StocktakeStatisticalFindNoInputGoods',
            // 工具栏按钮组
            btns: ['export'],
            // 工具栏表单组
            conditions: [
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '分店',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'defineCode',
                    type: 'select',
                    title: '盘点编码',
                    label: ['code', 'stocktakingDate'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    key: 'classCode',
                    type: 'input',
                    title: '分类'
                },
                {
                    key: 'brandCode',
                    type: 'select',
                    title: 'U课',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'GoodsBrandFindOption'
                },
                {
                    key: 'skuCode',
                    type: 'input',
                    title: '商品编码'
                },
                {
                    key: 'skuName',
                    type: 'input',
                    title: '商品名称'
                }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 选中的单行数据
            selectedSingleRow: {}
        }
    },
    methods: {
        // 工具栏按钮监听
        onClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('StocktakeStatisticalFindNoInputGoods', this.seachValue)
            }
        },
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'StocktakeStatisticalFindNoInputGoods'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    },
    watch: {
        'seachValue.storeCode': {
            handler (val) {
                if (val) {
                    this.$set(this.seachValue, 'defineCode', '')
                    axios({
                        path: 'StocktakeDefineFindDefineByStoreCode',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.conditions[1], 'selectDataArr', res.data)
                        }
                    })
                } else {
                    this.$set(this.conditions[1], 'selectDataArr', [])
                }
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
</style>

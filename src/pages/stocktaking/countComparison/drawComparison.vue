<!--
 * @Description: 抽盘比对
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: lmt
 * @Date: 2019-03-13 08:57:12
 * @LastEditTime: 2019-04-16 10:38:59
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
      :rowSelect="false"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      ref="newTable">
    </NewTable>
  </div>
</template>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'DrawComparison',
    components: {
        NewTable,
        SeachBox
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '22a1939aa94b40fc95d6db408bf1dda6:drawComparison'
            this.$refs.newTable.setTableColumns(this.tableCode)
        })
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: 'InventoryContrastFindSpotCheck',
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
                    key: 'regionCode',
                    type: 'select',
                    title: '区域',
                    label: ['code', 'name'],
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
                { key: 'skuCode', type: 'input', title: '商品编码' },
                { title: '商品名称', type: 'input', key: 'skuName' },
                { key: 'barCode', type: 'input', title: '商品条码' }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 重绘工具栏标识
            refresh: true,
            defineCode: ''
        }
    },
    methods: {
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
            e.path = 'InventoryContrastFindSpotCheck'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onClick (e) {
            if (e === 'export') {
                console.log(this.defineCode)
                if (this.defineCode === '' || this.defineCode === undefined) {
                    this.$message.error('请先选择要导出的盘点编码')
                    return
                }
                this.$refs.newTable.exportFile('InventoryContrastFindSpotCheck', this.seachValue)
            }
        }
    },
    watch: {
        'seachValue.defineCode': {
            handler (val) {
                this.defineCode = val
            }
        },
        'seachValue.storeCode': {
            handler (val) {
                this.$set(this.seachValue, 'defineCode', '')
                this.$set(this.seachValue, 'regionCode', '')
                if (val) {
                    axios({
                        path: 'StocktakeDefineFindDefineByStoreCode',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.conditions[1], 'selectDataArr', res.data)
                        }
                    })
                    axios({
                        path: 'StocktakeRegionFindOption',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.conditions[2], 'selectDataArr', res.data)
                        }
                    })
                } else {
                    this.$set(this.conditions[1], 'selectDataArr', [])
                    this.$set(this.conditions[2], 'selectDataArr', [])
                }
            }
        }
    }
}
</script>

<style lang="less">

</style>

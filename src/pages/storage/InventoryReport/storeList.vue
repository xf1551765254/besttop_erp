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
            tableApiPath: 'DistributionSkuStockSelectReportFormSkuStock',
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
                    maxTagCount: 1
                },
                {
                    title: '品类',
                    type: 'treeSelect',
                    key: 'classCodes',
                    filter: true,
                    selectDataArr: [],
                    multiple: true,
                    mode: 'multiple',
                    maxTagCount: 1
                },
                {
                    title: '品牌',
                    type: 'select',
                    key: 'brandCodes',
                    path: 'GoodsBrandFind',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    multiple: true,
                    mode: 'multiple',
                    maxTagCount: 1
                },
                {
                    title: '商品',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '规格型号',
                    type: 'input',
                    key: 'model'
                },
                {
                    title: '商品类型',
                    type: 'select',
                    key: 'goodsType',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: {
                        type: 'goods_type'
                    }
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd350101e10d44fdabaa6df0bcddf6c39:storeList'
            // this.tableApiPath = 'DistributionSkuStockSelectReportFormSkuStock'
        })
        this.queryType()
    },
    methods: {
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        queryType () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                console.log('品类', res)
                if (res.flag === 1) {
                    const data = res.data
                    this.typeArr = this.initTree(data)
                    this.$set(this.conditions[1], 'selectDataArr', this.typeArr)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
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
                this.$refs.newTable.exportFile('DistributionSkuStockSelectReportFormSkuStock', this.seachValue)
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
            e.path = 'DistributionSkuStockSelectReportFormSkuStock'
            this.$refs.newTable.setTableData(this.tableCode, e)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'storeList') {
                this.queryType()
            }
        }
    }
}
</script>

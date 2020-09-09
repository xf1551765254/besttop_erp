<!--
 * @Description: 监控
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-07-04 20:53:57
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :rowSelect="false"
      :pams="seachValue">
    </NewTable>
  </div>
</template>
<style lang="less">

</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    components: { NewTable, SeachBox },
    name: 'BalanceMonitoringTable',
    data () {
        return {
            conditions: [
                {
                    key: 'storeCode',
                    type: 'treeSelect',
                    title: '组织机构',
                    filter: true,
                    selectDataArr: []
                },
                {
                    key: 'classCode',
                    type: 'treeSelect',
                    title: '品类编码',
                    filter: true,
                    selectDataArr: []
                },
                {
                    key: 'brandCode',
                    type: 'select',
                    title: '品牌编码',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'GoodsBrandFindOption'
                }
            ],
            btns: ['export', 'print'],
            seachValue: {}, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '' // path
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '5cdb2784507e4e7e9a313ef64509ae31:balanceMonitoringTable'
            this.tableApiPath = 'CouponsBalanceQueryCoupons'
        })
        this.getOrganizeCodeData()
        this.getObjCategory()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CouponsBalanceQueryCoupons'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('CouponsBalanceQueryCoupons')
            }
        },
        /*
          * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        getOrganizeCodeData () {
            let newArr = []
            axios({
                path: 'OrganizationGroupFrameworkFindOptionTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    newArr = this.initTree(data)
                    this.$set(this.conditions[0], 'selectDataArr', newArr)
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
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        getObjCategory () {
            let newArr = []
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    newArr = this.initTree(data)
                    this.$set(this.conditions[1], 'selectDataArr', newArr)
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'BalanceMonitoringTable') {
                this.getOrganizeCodeData()
                this.getObjCategory()
            }
        }
    }
}
</script>

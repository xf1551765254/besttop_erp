<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-10 16:21:24
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
    <bt-modal
      v-model="editModel"
      title="商品配置"
      :popconfirm="false"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <a-form :form="form" class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          bordered
          :scroll="scrollXY"
        >
          <template v-for="col in ['discountRate', 'priceMin']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'discountRate'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                :value="text"
                :precision="2"
                @change="e => InputChange(e, record.tb_web_id, col)" />
              <a-input-number
                v-else-if="col === 'priceMin'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.tb_web_id, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
      </a-form>
    </bt-modal>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import clonedeep from 'lodash.clonedeep'
export default {
    name: 'GoodsConfig',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            seachValue: {

            },
            btns: ['export', 'print'],
            conditions: [
                {
                    title: 'sku编码/名称',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '品牌编码/名称',
                    type: 'input',
                    key: 'brandCode'
                },
                {
                    title: '品类编码/名称',
                    type: 'select',
                    key: 'classCode',
                    path: 'GoodsCategoryFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    body: {
                        type: 'code'
                    }
                },
                // {
                //     title: '商品类型',
                //     type: 'select',
                //     key: 'skuStatus',
                //     path: 'OrganizationConfigFindByType',
                //     label: 'value',
                //     value: ['type', 'configKey'],
                //     filter: true,
                //     body: { type: 'base_sku_status' }
                // },
                {
                    title: '主商品编码/名称',
                    type: 'input',
                    key: 'goodsCode'
                }
            ],
            rightMenu: [
                {
                    name: '编辑',
                    action: 'goodsConfig.edit',
                    fc: this.editHandler
                }
            ], // 右键菜单
            editModel: false,
            submitLoading: false,
            form: this.$form.createForm(this),
            categoryinfoSelectedRowKeys: [], // 商品详情选中项
            categoryinfoColumns: [ // 商品配置表头
                { title: '分店', dataIndex: 'storeCode', align: 'center', width: 100 },
                { title: '分店名称', dataIndex: 'storeName', align: 'center', width: 200 },
                { title: '本店扣率（%）', dataIndex: 'discountRate', align: 'center', width: 100 },
                { title: '零售价', dataIndex: 'price', align: 'center', width: 100 },
                { title: '限价', dataIndex: 'priceMin', align: 'center', width: 150, scopedSlots: { customRender: 'priceMin' } },
                { title: '分销价', dataIndex: 'priceWholesale', align: 'center', width: 100 },
                { title: '存量', dataIndex: 'currentNumber', align: 'center', width: 100 }
            ],
            categoryinfoData: [], // 表体
            scrollXY: {
                x: 950
            },
            categoryinfoID: 0 // 行唯一
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9ff58440c66740038a23609baf2c50c3:goodsConfig'
            this.tableApiPath = 'GoodsSkuFindSkuSearchSansList'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
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
                this.$refs.newTable.exportFile('GoodsSkuFindSkuSearchSansList', this.seachValue)
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
            e.path = 'GoodsSkuFindSkuSearchSansList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (e) {
            console.log(e)
            this.editModel = true
            axios({
                path: 'BillSaleFindCommodityConfigure',
                method: 'post',
                body: {
                    skuCode: e.code
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    const { mul } = this.$math
                    const arr = res.data
                    arr.forEach(i => {
                        this.categoryinfoID++
                        i.tb_web_id = this.categoryinfoID++
                        if (!i.discountRate) {
                            i.discountRate = ''
                        } else {
                            i.discountRate = mul(i.discountRate, 100, 2) + '%'
                        }
                    })
                    this.categoryinfoData = arr
                }
            })
        },
        /**
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.editModel = false
        },
        /**
         * @name: 编辑弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            this.submitLoading = true
            e.preventDefault() // 防止事件穿透
            const tableData = clonedeep(this.categoryinfoData)
            for (const i of tableData) {
                i.discountRate = i.discountRate / 100
            }
            console.log(tableData)
            axios({
                path: 'BillSaleUpdateCommodityConfigureDetail',
                method: 'post',
                body: {
                    commodityConfigureDetails: tableData
                },
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    this.editModel = false
                    console.log(res)
                }
            })
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            // console.log('弹框新增')
            this.selectCategory = true
            const { categoryinfoData } = this
            const newData = {
                tb_web_id: this.categoryinfoID,
                storeCode: '',
                storeName: '',
                discountRate: '',
                priceAmount: '',
                priceMin: '',
                priceWholesale: '',
                currentNumber: '',
                dRateReg: ''

            }
            this.categoryinfoData = [...categoryinfoData, newData]
            // console.log('订单详情', this.categoryinfoData)
            this.categoryinfoID++
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'goodsConfig') {

            }
        }
    }
}
</script>

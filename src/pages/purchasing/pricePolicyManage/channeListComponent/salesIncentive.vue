<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-23 17:50:11
 -->
<template>
  <div>
    <h4 class="baseInfo">销售奖励机型</h4>
    <a-row>
      <a-button class="categoryinfo-btn" @click="categoryinfoAdd">新增</a-button>
      <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
        <a-button class="categoryinfo-btn" type="danger">删除</a-button>
      </a-popconfirm>
    </a-row>
    <a-table
      rowKey="tbWebId"
      :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
      :columns="categoryinfoColumns"
      :dataSource="categoryinfoData"
      size="small"
      :pagination="false"
      :scroll="scrollXY"
      bordered
    >
      <template v-for="col in ['strategyPrice','note']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input-number
            v-if="col === 'strategyPrice'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="Number.MAX_SAFE_INTEGER"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-input
            v-else-if="col === 'note'"
            style="margin: -5px 0; width:100%"
            :value="text"
            @change="e => InputChange(e.target.value, record.tbWebId, col)"
          />
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.tbWebId)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <goods :visible.sync="goodsQuery" :pams="classBrand" @onSelect="onSelect" multiple/>
  </div>
</template>
<style lang="less">
.baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import goods from '@comp/BasicQuery/goods'
export default {
    name: 'SalesIncentive',
    components: {
        goods
    },
    props: {
        detailsObj: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            goodsQuery: false,
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoData: [], // 表体
            categoryinfoColumns: [ // 表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '销售奖励', dataIndex: 'strategyPrice', width: 150, scopedSlots: { customRender: 'strategyPrice' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            classBrand: {},
            flagNum: 0,
            scrollXY: {
                x: 1350,
                y: 350
            },
            indexNumber: 1
        }
    },
    mounted () {

    },
    methods: {
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (tbWebId) {
            if (tbWebId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].tbWebId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.tbWebId !== tbWebId)
            }
        },
        /**
         * @name: 搜索弹框事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (arr) {
            console.log(arr, '选择商品')
            this.categoryinfoSelectedRowKeys = []
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                console.log('过滤', has)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        tbWebId: i.skuCode,
                        skuCode: i.skuCode,
                        skuName: i.goodsName,
                        skuModel: i.goodsModel,
                        strategyPrice: 0
                    })
                } else {
                    error.push(i.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            if (this.detailsObj.classCodeId.length === 0) {
                return this.$message.warning('请选择商品品类！')
            }
            if (!this.detailsObj.brandCodeId) {
                return this.$message.warning('请选择商品品牌！')
            }
            const objArr = []
            const arr = [...this.detailsObj.classCodeId]
            for (const item of arr) {
                objArr.push({ classCode: item, brandCode: this.detailsObj.brandCodeId })
            }
            this.classBrand = {
                include: { classBrand: objArr }
            }
            this.goodsQuery = true
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
        categoryinfoDataFun () {
            const arr = [...this.categoryinfoData]
            return arr
        },
        /**
         * @name: 编辑时设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        editSetBody (data) {
            const arr = [...data]
            for (const i of arr) {
                i.tbWebId = this.flagNum++
                i.index = this.indexNumber++
            }
            this.categoryinfoData = arr
        }

    },
    watch: {
    }
}
</script>

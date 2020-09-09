<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-23 17:53:01
 -->
<template>
  <div>
    <h4 class="baseInfo">追加政策</h4>
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
      bordered
      :scroll="scrollXY"
      :pagination="false"
    >
      <template v-for="col in ['strategyPrice','startTime','finishTime','note']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input-number
            v-if="col === 'strategyPrice'"
            style="margin: -5px 0;width:100%;"
            :min="0"
            :max="Number.MAX_SAFE_INTEGER"
            :value="text"
            :precision="2"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-date-picker
            v-else-if="col === 'startTime'"
            style="margin: -5px 0;width:100%;"
            v-model="record.startTime"
            @change="e => InputChange(e, record.tbWebId, col)" />
          <a-date-picker
            v-else-if="col === 'finishTime'"
            style="margin: -5px 0;width:100%;"
            v-model="record.finishTime"
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
import moment from 'moment'
import goods from '@comp/BasicQuery/goods'
export default {
    name: 'Policy',
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
                { title: '开始时间', dataIndex: 'startTime', width: 200, scopedSlots: { customRender: 'startTime' } },
                { title: '结束时间', dataIndex: 'finishTime', width: 200, scopedSlots: { customRender: 'finishTime' } },
                { title: '限时抢购价', dataIndex: 'strategyPrice', width: 150, scopedSlots: { customRender: 'strategyPrice' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            classBrand: {},
            flagNum: 0,
            scrollXY: {
                x: 1650,
                y: 350
            },
            indexNumber: 1
        }
    },
    mounted () {

    },
    methods: {
        // timeClear () {

        // },
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
                if (col === 'startTime') {
                    if (Number(target.startTime.unix()) < Number(this.detailsObj.startTime.unix())) {
                        this.$message.warning(`政策开始时间为${moment(this.detailsObj.startTime).format('YYYY-MM-DD')}，不能选择${moment(target.startTime).format('YYYY-MM-DD')}`)
                        target.startTime = this.detailsObj.startTime
                        return
                    }
                }
                if (col === 'finishTime') {
                    if (Number(target.finishTime.unix()) > Number(this.detailsObj.finishTime.unix())) {
                        this.$message.warning(`政策结束时间为${moment(this.detailsObj.finishTime).format('YYYY-MM-DD')}，不能选择${moment(target.finishTime).format('YYYY-MM-DD')}`)
                        target.finishTime = this.detailsObj.finishTime
                        return
                    }
                }
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
            // console.log(this.detailsObj)
            // console.log('开始时间', moment(this.detailsObj.startTime).format('YYYY-MM-DD'), '结束时间', moment(this.detailsObj.finishTime).format('YYYY-MM-DD'))
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
                i.index = this.indexNumber++
                i.tbWebId = this.flagNum++
                if (!i.startTime) {
                    i.startTime = {}
                } else {
                    i.startTime = moment(i.startTime)
                }
                if (!i.finishTime) {
                    i.finishTime = {}
                } else {
                    i.finishTime = moment(i.finishTime)
                }
            }
            this.categoryinfoData = arr
        }

    },
    watch: {
    }
}
</script>

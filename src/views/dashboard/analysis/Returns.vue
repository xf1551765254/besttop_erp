<template>
  <a-col :sm="24" :md="24" :xl="12">
    <div class="returns order-returns reset">
      <ITItle text="退货统计" color="#fff" style="display:inline-block;" />
      <div style="float:right;">
        <a-radio-group :options="['日', '月']" defaultValue="日" />
        <a-date-picker />
      </div>
      <a-row
        style="margin-top:27px"
        type="flex"
        justify="space-around"
        align="middle"
      >
        <a-col :span="6" class="num-1">78<span>单</span> </a-col>
        <a-col :span="6" class="num-2">
          <div>2000</div>
          <span>订货总额(元)</span>
        </a-col>
        <a-col :span="6" class="num-2">
          <div>2000</div>
          <span>退货数量(个)</span>
        </a-col>
        <a-col :span="6" class="num-2">
          <div>2000</div>
          <span>入库合计</span>
        </a-col>
      </a-row>
    </div>
    <a-table
      class="mini-table"
      :showHeader="false"
      :columns="columns"
      :customRow="customRow"
      :pagination="false"
      :dataSource="dataSource"
      size="middle"
    />
  </a-col>
</template>
<script>
import ITItle from '../component/Title'

export default {
    components: {
        ITItle
    },
    data () {
        return {
            columns: [
                { title: 'SKU编码', align: 'center', dataIndex: 'code' },
                { title: 'SKU名称', align: 'center', dataIndex: 'name' },
                { title: '规格型号', align: 'center', dataIndex: 'type' },
                { title: '调入位置', align: 'center', dataIndex: 'inot' },
                { title: '调出位置', align: 'center', dataIndex: 'out' },
                { title: '数量', align: 'center', dataIndex: 'num' }
            ],
            dataSource: [
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' },
                { name: '青岛电器销售公司', type: '订货额：4000.00', into: '订货数量：40 ', out: '3000' }
            ]
        }
    },
    methods: {
        dateChange () {

        },
        customRow (row, index) {
            return {
                style: {
                    height: '30px',
                    background: index % 2 === 1 && '#f5f5f58a'
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
@import url("./mixin");
</style>

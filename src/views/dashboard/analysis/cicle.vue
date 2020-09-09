<template>
  <div>
    <a-input-group compact style="text-align:right" >
      <a-select v-model="dateType" >
        <a-select-option :value="1">日</a-select-option>
        <a-select-option :value="2">月</a-select-option>
      </a-select>
      <a-date-picker v-if="dateType===1" />
      <a-month-picker v-else placeholder="请选择月份" />
    </a-input-group>
    <v-chart
      :forceFit="true"
      :height="370"
      :data="data"
      padding="auto"
      :scale="scale">
      <v-tooltip :showTitle="false" dataKey="item*percent" />
      <v-axis />
      <v-legend marker="square" dataKey="item" />
      <v-pie
        position="percent"
        :color="color"
        :vStyle="pieStyle"
        :label="labelConfig" />
      <v-coord
        type="theta"
        :radius="0.75"
        :innerRadius="0.6" />
    </v-chart>
  </div>
</template>

<script>
const DataSet = require('@antv/data-set')

const sourceData = [
    { item: '零售', count: 40 },
    { item: '第三方物流', count: 21 },
    { item: '内部', count: 17 },
    { item: '分销', count: 13 }
]

const scale = [{
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
}]

const dv = new DataSet.View().source(sourceData)
dv.transform({
    type: 'percent',
    field: 'count',
    dimension: 'item',
    as: 'percent'
})
const data = dv.rows

export default {
    data () {
        return {
            data,
            scale,
            marker (x, y, r) {
                return [
                    [ 'M', x - r, y ],
                    [ 'L', x + r, y ]
                ]
            },
            dateType: 1,
            height: 400,
            color: ['item', [
                'l(45) 0:#08CEAF 1:#8DDAD5',
                'l(146) 0:#FBDFEA 1:#F3E3EB',
                'l(220) 0:#C49DFF 1:#60BFFF',
                'l(308) 0:#E693E2 1:#FA8C8D'
            ]],
            pieStyle: {
                stroke: '#fff',
                lineWidth: 1
            },
            labelConfig: ['percent', {
                formatter: (val, item) => {
                    return item.point.item + ': ' + val
                }
            }]
        }
    }
}
</script>

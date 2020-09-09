<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-06 22:51:32
 * @LastEditTime: 2019-04-06 22:53:14
 -->
<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data">
      <v-coord type="rect" direction="LB" />
      <v-tooltip />
      <v-axis dataKey="country" :label="label" />
      <v-bar position="country*population" />
    </v-chart>
  </div>
</template>
<style lang="less">

</style>

<script>
const DataSet = require('@antv/data-set')
export default {
    name: 'Strip',
    data: function () {
        return {

        }
    },
    methods: {

    }
}
</script>

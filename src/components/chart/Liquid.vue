<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-06 20:14:28
 -->
<template>
  <div>
    <v-chart
      :forceFit="true"
      :height="height"
      :width="width"
      :data="data"
      :scale="scale"
      :padding="0">
      <v-tooltip />
      <v-interval
        :shape="['liquid-fill-gauge']"
        position="transfer*value"
        color=""
        :v-style="{
          lineWidth: 10,
          opacity: 0.75
        }"
        :tooltip="[
          'transfer*value',
          (transfer, value) => {
            return {
              name: transfer,
              value,
            };
          },
        ]"
      ></v-interval>
      <v-guide
        v-for="(row, index) in data"
        :key="index"
        type="text"
        :top="true"
        :position="{
          gender: row.transfer,
          value: 45
        }"
        :content="row.value + '%'"
        :v-style="{
          fontSize: 100,
          textAlign: 'center',
          opacity: 0.75,
        }"
      />
    </v-chart>
  </div>
</template>

<script>
export default {
    name: 'Liquid',
    props: {
        height: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style scoped>

</style>

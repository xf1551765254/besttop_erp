<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-06 20:16:03
 -->
<template>
  <v-chart :forceFit="true" height="400" :data="data" :padding="[20, 20, 95, 20]" :scale="scale">
    <v-tooltip></v-tooltip>
    <v-axis :dataKey="axis1Opts.dataKey" :line="axis1Opts.line" :tickLine="axis1Opts.tickLine" :grid="axis1Opts.grid" />
    <v-axis :dataKey="axis2Opts.dataKey" :line="axis2Opts.line" :tickLine="axis2Opts.tickLine" :grid="axis2Opts.grid" />
    <v-legend dataKey="user" marker="circle" :offset="30" />
    <v-coord type="polar" radius="0.8" />
    <v-line position="item*score" color="user" :size="2" />
    <v-point position="item*score" color="user" :size="4" shape="circle" />
  </v-chart>
</template>

<script>
const axis1Opts = {
    dataKey: 'item',
    line: null,
    tickLine: null,
    grid: {
        lineStyle: {
            lineDash: null
        },
        hideFirstLine: false
    }
}
const axis2Opts = {
    dataKey: 'score',
    line: null,
    tickLine: null,
    grid: {
        type: 'polygon',
        lineStyle: {
            lineDash: null
        }
    }
}

const scale = [
    {
        dataKey: 'score',
        min: 0,
        max: 80
    }, {
        dataKey: 'user',
        alias: '类型'
    }
]

export default {
    name: 'Radar',
    props: {
        data: {
            type: Array,
            default: null
        }
    },
    data () {
        return {
            axis1Opts,
            axis2Opts,
            scale
        }
    }
}
</script>

<style scoped>

</style>

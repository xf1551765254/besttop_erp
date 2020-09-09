<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-07 00:20:54
 * @LastEditTime: 2019-04-08 18:15:32
 -->
<template>
  <chart-card :loading="loading" title="本店差异金额" :total="`￥${differencePrice}`">
    <a-tooltip title="本店本次盘点差异金额统计" slot="action">
      <a-icon type="info-circle-o" />
    </a-tooltip>
    <div>
      <trend :flag="yearRate>=0?'up':'down'" style="margin-right: 16px;"> <span slot="term">年同比</span> {{ yearRate }}% </trend>
      <trend :flag="monthRate>=0?'up':'down'"> <span slot="term">月同比</span> {{ monthRate }}% </trend>
    </div>
    <template slot="footer">平均差异<span>￥{{ average }}</span></template>
  </chart-card>
</template>

<script>
import ChartCard from '@/components/chart/ChartCard'
import Trend from '@/components/Trend'
import { axios } from '@/utils/request'
export default {
    name: 'DifferenceAmount',
    components: {
        ChartCard,
        Trend
    },
    data: function () {
        return {
            loading: true,
            differencePrice: 0,
            average: 0,
            monthRate: 0,
            yearRate: 0
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getData () {
            this.loading = true
            axios({
                path: 'dashboardFindDifference',
                method: 'post',
                body: { storeCode: this.$store.getters.storeInfo.code }
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    this.differencePrice = Number(res.data.differencePrice).toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?:$|\.))/g, '$1,')
                    this.average = Number(res.data.average).toFixed(2).toString().replace(/(\d)(?=(?:\d{3})+(?:$|\.))/g, '$1,')
                    this.yearRate = Number(res.data.yearRate).toFixed(2)
                    this.monthRate = Number(res.data.monthRate).toFixed(2)
                }
            })
        }
    }
}
</script>

<style scoped>

</style>

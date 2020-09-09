<!--
 * @Description: 盘点历史人数仪表盘
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-07 01:16:45
 -->
<template>
  <chart-card :loading="loading" title="盘点参与人数" :total="currentSum+''">
    <a-tooltip title="历次参与的人数" slot="action">
      <a-icon type="info-circle-o" />
    </a-tooltip>
    <div>
      <div class="antv-chart-mini">
        <div class="chart-wrapper" :style="{ height: 46 }">
          <v-chart
            :force-fit="true"
            :height="height"
            :data="data"
            :scale="scale"
            :padding="[36, 0, 18, 0]">
            <v-tooltip />
            <v-smooth-area position="key*value" />
          </v-chart>
        </div>
      </div>
    </div>
    <template slot="footer">历史参与人数<span> {{ popSum }}</span></template>
  </chart-card>

</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
import ChartCard from '@/components/chart/ChartCard'
import moment from 'moment'
const DataSet = require('@antv/data-set')

export default {
    name: 'InventoryHistorical',
    components: {
        ChartCard
    },
    data () {
        return {
            height: 100,
            loading: true,
            data: [],
            currentSum: 0,
            popSum: 0,
            scale: [
                { dataKey: 'value', alias: '参与人数', min: 0 },
                { dataKey: 'key', type: 'timeCat', min: 0, max: 1 }
            ]
        }
    },
    mounted () {
        this.getPop()
    },
    methods: {
        ...mapGetters(['storeInfo']),
        /**
         * @name: 获取本店盘点人数数据
         * @msg:
         * @param {type}
         * @return:
         */
        getPop () {
            this.loading = true
            axios({
                path: 'dashboardFindStocktakePerson',
                method: 'post',
                body: { storeCode: this.storeInfo().code }
            }).then(res => {
                this.loading = false
                const data = []
                if (res.data.list.length < 2) { data.push({ key: '2019-01-01', value: 0 }) }
                res.data.list.forEach(d => {
                    data.push({
                        key: d.date,
                        value: d.num
                    })
                })
                const dv = new DataSet.View().source(data)
                dv.transform({
                    type: 'sort',
                    callback (a, b) {
                        return moment(a.key).isBefore(moment(b.key))
                    }
                })
                this.data = dv.rows
                this.currentSum = res.data.currentSum
                this.popSum = res.data.sum
            })
        }
    }
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>

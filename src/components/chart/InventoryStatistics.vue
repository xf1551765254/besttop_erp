<!--
 * @Description: 盘点盈亏统计
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-06 23:07:47
 * @LastEditTime: 2019-04-17 13:41:47
 -->
<template>
  <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
    <div class="salesCard">
      <a-tabs v-model="activeKey" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
        <div class="extra-wrapper" slot="tabBarExtraContent">
          <div class="extra-item">
            <a @click="getToday">今日</a>
            <a @click="getWeek">本周</a>
            <a @click="getMonth">本月</a>
            <a @click="getYear">本年</a>
          </div>
          <a-range-picker
            :style="{width: '256px'}"
            format="YYYY-MM-DD"
            v-model="rangeValue"
            @change="rangeChange"
            allowClear/>
        </div>
        <a-tab-pane loading="true" tab="盈亏金额" key="1">
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{ padding: '0 0 32px 32px' }">
                <h4 :style="{ marginBottom: '20px' }">盈亏金额排行</h4>
                <v-chart
                  :forceFit="true"
                  :height="height"
                  :data="sourceData"
                  padding="auto">
                  <v-tooltip></v-tooltip>
                  <v-coord type="rect" direction="LB"></v-coord>
                  <v-axis dataKey="brandName" :label="{offset:10}" :title="null"></v-axis>
                  <v-axis dataKey="differencePrice" position="right" :title="null" :tickLine="null" :label="{formatter:val=>'￥'+ val}"></v-axis>
                  <v-stack-bar position="brandName*differencePrice" :color="color"></v-stack-bar>
                </v-chart>
              </div>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list title="盈亏金额排行" :list="rankList"/>
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="盈亏数量" key="2">
          <a-row>
            <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
              <div :style="{ padding: '0 0 32px 32px' }">
                <h4 :style="{ marginBottom: '20px' }">盈亏数量排行</h4>
                <v-chart
                  :forceFit="true"
                  :height="height"
                  :data="sourceDataCont"
                  padding="auto">
                  <v-tooltip></v-tooltip>
                  <v-coord type="rect" direction="LB"></v-coord>
                  <v-axis dataKey="brandName" :label="{offset:10}" :title="null"></v-axis>
                  <v-axis dataKey="differenceCount" position="right" :title="null" :tickLine="null" :label="{formatter:val=>val}"></v-axis>
                  <v-stack-bar position="brandName*differenceCount" :color="colorCont"></v-stack-bar>
                </v-chart>
              </div>
            </a-col>
            <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
              <rank-list title="盈亏数量排行" :list="rankListCont"/>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>
<style lang="less">
    .extra-wrapper {
        line-height: 55px;
        padding-right: 24px;

        .extra-item {
            display: inline-block;
            margin-right: 24px;

            a {
                margin-left: 24px;
            }
        }
    }
</style>

<script>
import RankList from '@/components/chart/RankList'
import is from 'is_js'
import { axios } from '../../utils/request'
import moment from 'moment'
const DataSet = require('@antv/data-set')

// dv.transform({
//     type: 'sort-by',
//     fields: [ 'population' ],
//     order: 'ASC' // ASC，DESC
// })

export default {
    name: 'InventoryStatistics',
    components: {
        RankList
    },
    data: function () {
        return {
            activeKey: '1',
            height: 364,
            loading: true,
            rankList: [],
            label: { offset: 12 },
            sourceData: [],
            scale: [
                { dataKey: 'brandName', alias: 'U课', min: 0 },
                { dataKey: 'differencePrice', tickInterval: 30, min: 0, max: 1 }
            ],
            color: ['differencePrice', opinion => this.getColor(opinion)],
            sourceDataCont: [],
            rankListCont: [],
            scaleCont: [
                { dataKey: 'brandName', alias: 'U课', min: 0 },
                { dataKey: 'differenceCount', tickInterval: 30, min: 0, max: 1 }
            ],
            colorCont: ['differenceCount', opinion => this.getColor(opinion)],
            rangeValue: []
        }
    },
    mounted () {
        this.getMonth()
    },
    methods: {
        rangeChange (dates, [stocktakingStartDate, stocktakingEndDate]) {
            if (stocktakingStartDate && stocktakingEndDate) {
                this.getData({
                    stocktakingStartDate,
                    stocktakingEndDate
                })
            }
        },
        getToday () {
            this.rangeValue.length = 0
            const stocktakingStartDate = moment().startOf('day').format('YYYY-MM-DD')
            const stocktakingEndDate = moment().endOf('day').format('YYYY-MM-DD')
            this.getData({
                stocktakingStartDate,
                stocktakingEndDate
            })
        },
        getWeek () {
            this.rangeValue.length = 0
            const weekOfday = moment().format('E')
            const stocktakingStartDate = moment().subtract(weekOfday - 1, 'days').format('YYYY-MM-DD')
            const stocktakingEndDate = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD')
            this.getData({
                stocktakingStartDate,
                stocktakingEndDate
            })
        },
        getMonth () {
            this.rangeValue.length = 0
            const stocktakingStartDate = moment().startOf('month').format('YYYY-MM-DD')
            const stocktakingEndDate = moment().endOf('month').format('YYYY-MM-DD')
            this.getData({
                stocktakingStartDate,
                stocktakingEndDate
            })
        },
        getYear () {
            this.rangeValue.length = 0
            const stocktakingStartDate = moment().startOf('year').format('YYYY-MM-DD')
            const stocktakingEndDate = moment().endOf('year').format('YYYY-MM-DD')
            this.getData({
                stocktakingStartDate,
                stocktakingEndDate
            })
        },
        getColor (val) {
            if (is.array(val)) {
                if (val[1] > 0) {
                    return '#1890ff'
                } else {
                    return '#f5222c'
                }
            }
        },
        getData (date = {}) {
            this.loading = true
            axios({
                path: 'DashboardFindDifferenceRanking',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    ...date
                }
            }).then(res => {
                this.loading = false
                this.getPrice(res.data.priceList)
                this.getCont(res.data.countList)
            })
        },
        getPrice (data) {
            const { abs } = this.$math
            const dv = new DataSet.View().source(data)
            dv.transform({
                type: 'sort',
                callback (a, b) {
                    return abs(a.differencePrice) - abs(b.differencePrice)
                }
            })
            this.sourceData = dv.rows
            const arr = []
            for (const d of dv.rows) {
                arr.push({
                    name: d.brandName,
                    total: d.differencePrice
                })
            }
            this.rankList = arr.sort((a, b) => abs(b.total) - abs(a.total))
        },
        getCont (data) {
            const { abs } = this.$math
            const dv = new DataSet.View().source(data)
            dv.transform({
                type: 'sort',
                callback (a, b) {
                    return abs(a.differenceCount) - abs(b.differenceCount)
                }
            })
            this.sourceDataCont = dv.rows
            const arr = []
            for (const d of dv.rows) {
                arr.push({
                    name: d.brandName,
                    total: d.differenceCount
                })
            }
            this.rankListCont = arr.sort((a, b) => abs(b.total) - abs(a.total))
        }
    }
}
</script>

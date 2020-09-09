<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-18 11:06:49
 -->
<template>
  <div>
    <a-row>
      <a-col :span="24" v-if="hasData">
        <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="[30, 0, 50, 0]">
          <v-tooltip :showTitle="false" dataKey="item*percent" />
          <v-axis />
          <v-legend dataKey="item" />
          <v-pie position="percent" color="item" :v-style="pieStyle" :label="labelConfig" />
          <v-coord type="theta" />
        </v-chart>
      </a-col>
      <a-col :span="24" v-if="hasData" style="margin-top:-30px;height:30px;">
        <span style="margin-left:20px;font-weight: bold;">自动刷新</span>
        <a-switch style="margin-left:20px;" checkedChildren="开" unCheckedChildren="关" v-model="autoGet" @change="autoChange"/>
        <span v-if="autoGet" style="margin-left:20px;color:#e54d42;">{{ autoText }}</span>
      </a-col>
      <a-col :span="24">
        <a-card title="已参与">
          <a-card-grid style="width:25%;textAlign:'center';" v-for="(item, index) in finishedUser" :key="index">
            <div>
              <a-avatar v-if="item.headimgurl" class="avatar" :src="item.headimgurl"/>
              <a-avatar v-else class="avatar" icon="user"/>
              <span style="margin-left:20px;">{{ `${item.erp_code} - ${item.name}` }}</span>
            </div>
          </a-card-grid>
          <span v-if="finishedUser.length===0">暂无数据</span>
        </a-card>
      </a-col>
      <a-col :span="24" style="margin-top:10px;">
        <a-card title="未参与">
          <a-card-grid style="width:25%;textAlign:'center'" v-for="(item, index) in unfinishedUser" :key="index">
            <div>
              <a-avatar v-if="item.headimgurl" class="avatar" :src="item.headimgurl"/>
              <a-avatar v-else class="avatar" icon="user"/>
              <span style="margin-left:20px;">{{ `${item.erp_code} - ${item.name}` }}</span>
            </div>
          </a-card-grid>
          <span v-if="unfinishedUser.length===0">暂无数据</span>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="less" scoped>

</style>

<script>
import { axios } from '../../utils/request'

const DataSet = require('@antv/data-set')

const scale = [{
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
}]
let timer = null
let timerT = null
export default {
    name: 'Monitor',
    data: function () {
        return {
            autoGet: false,
            hasData: false,
            autoText: '刷新中',
            data: [],
            scale,
            height: 300,
            pieStyle: {
                stroke: '#fff',
                lineWidth: 1
            },
            labelConfig: ['percent', {
                formatter: (val, item) => {
                    return item.point.item + ': ' + val
                }
            }],
            finishedUser: [],
            unfinishedUser: []
        }
    },
    mounted () {
        this.getData()
    },
    methods: {
        getText () {
            timerT = setInterval(() => {
                if (this.autoText === '刷新中......') {
                    this.autoText = '刷新中'
                } else {
                    this.autoText += '.'
                }
            }, 500)
        },
        autoChange (e) {
            if (e) {
                this.getText()
                timer = setInterval(() => {
                    this.getData()
                }, 5000)
            } else {
                if (timer != null) {
                    clearInterval(timer)
                }
                if (timerT != null) {
                    clearInterval(timerT)
                }
            }
        },
        getData () {
            axios({
                path: 'WechatFindStatisticUser',
                method: 'post',
                body: { storeCode: this.$store.getters.storeInfo.code }
            }).then(res => {
                if (res.flag === 1) {
                    this.hasData = true
                    const { finishedUser, unfinishedUser } = res.data
                    this.finishedUser = [...finishedUser]
                    this.unfinishedUser = [...unfinishedUser]
                    const sourceData = [
                        { item: '已参与', count: finishedUser.length },
                        { item: '未参与', count: unfinishedUser.length > 0 ? unfinishedUser.length : 1 }
                    ]
                    const dv = new DataSet.View().source(sourceData)
                    dv.transform({
                        type: 'percent',
                        field: 'count',
                        dimension: 'item',
                        as: 'percent'
                    })
                    this.data = dv.rows
                } else {
                    this.hasData = false
                }
            })
        }
    },
    beforeDestroy () {
        if (timer != null) {
            clearInterval(timer)
        }
        if (timerT != null) {
            clearInterval(timerT)
        }
    }
}
</script>

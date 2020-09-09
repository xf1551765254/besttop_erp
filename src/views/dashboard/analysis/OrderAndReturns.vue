<template>
  <Card title="订单/退货统计" style="margin-bottom:12px">
    <div class="date">
      <a-radio-group
        :options="[{ value: 1, label: '日' }, { value: 2, label: '月' }]"
        v-model="dateType"
      />
      <a-date-picker v-if="dateType === 1" v-model="dateTime" />
      <a-month-picker v-else v-model="dateTime" />
    </div>
    <a-row :gutter="12">
      <a-col :sm="24" :md="24" :xl="12">
        <div class="order order-returns reset">
          <ITItle text="订单统计" color="#fff" />
          <a-row
            style="margin-top:27px"
            type="flex"
            justify="space-around"
            align="middle"
          >
            <a-col
              :span="8"
              class="num-1"
            >{{ order.storeTotal }}<span>单</span>
            </a-col>
            <a-col :span="8" class="num-2">
              <div>{{ order.orderTotal }}</div>
              <span>订货总额(元)</span>
            </a-col>
            <a-col :span="8" class="num-2">
              <div>{{ order.orderNum }}</div>
              <span>入库合计</span>
            </a-col>
          </a-row>
        </div>
        <div class="footer"></div>
      </a-col>
      <a-col :sm="24" :md="24" :xl="12">
        <div class="returns order-returns reset">
          <ITItle text="退货统计" color="#fff" />
          <a-row
            style="margin-top:27px"
            type="flex"
            justify="space-around"
            align="middle"
          >
            <a-col
              :span="6"
              class="num-1"
            >{{ order.storeTotal }}<span>单</span>
            </a-col>
            <a-col :span="6" class="num-2">
              <div>{{ order.orderTotal }}</div>
              <span>退货总额(元)</span>
            </a-col>
            <a-col :span="6" class="num-2">
              <div>{{ order.orderNum }}</div>
              <span>退货数量</span>
            </a-col>
          </a-row>
        </div>
        <div class="footer"></div>
      </a-col>
    </a-row>
  </Card>
</template>

<script>
import ITItle from '../component/Title'
import Card from '../component/Card'

import { axios } from '@/utils/request'
import moment from 'moment'

export default {
    components: {
        ITItle,
        Card
    },
    created () {
        this.getData()
    },
    data () {
        return {
            dateType: 2,
            dateTime: moment(new Date()),
            order: {
                orderCount: 0,
                orderNum: 0,
                orderTotal: 0,
                storeTotal: 0,
                orderCount1: 0,
                orderCount2: 0,
                orderCount3: 0
            },
            retruns: {
                orderCount: 0,
                orderNum: 0,
                orderTotal: 0,
                storeTotal: 0,
                orderCount1: 0,
                orderCount2: 0,
                orderCount3: 0
            }
        }
    },
    methods: {
        dateChange () {
            this.getData()
        },
        getData () {
            const body = {
                dateType: this.dateType,
                dateTime: moment(this.dateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            axios({ path: 'orderStatistics', body }).then(({ data }) => {
                this.order.orderCount = data.orderCount
                this.order.orderNum = data.orderNum
                this.order.orderTotal = data.orderTotal
                this.order.storeTotal = data.storeTotal
            })
            axios({ path: 'returnStatistics', body }).then(({ data }) => {
                this.retruns.orderCount = data.orderCount
                this.retruns.orderNum = data.orderNum
                this.retruns.orderTotal = data.orderTotal
                this.retruns.storeTotal = data.storeTotal
            })
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
.footer {
  height: 40px;
  margin: 0 10px;
  background: rgba(245, 247, 250, 1);
}
.date {
  text-align: right;
  margin-bottom: 19px;
}
</style>

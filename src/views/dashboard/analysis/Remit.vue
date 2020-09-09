<template>
  <a-col :sm="24" :md="24" :xl="7" style="height:394px;padding-right:0">
    <Card title="打款统计" style="height:394px">
      <div class="date-box">
        <a-radio-group
          class="mg-b"
          :options="[{ value: 1, label: '日' }, { value: 2, label: '月' }]"
          v-model="dateType"
          style="margin-right:40px"
        />
        <a-date-picker v-if="dateType === 1" v-model="dateTime" class="mg-b" />
        <a-month-picker v-else v-model="dateTime" class="mg-b" />
      </div>
      <div class="remit-count">
        <span style="margin-right:12px">{{ totalPrices }}</span>
        <span style="font-size:14px">元</span>
      </div>
      <div class="remit-list" v-for="(item, i) in dataSource" :key="i">
        <span class="left">{{ item.providerName }} </span>
        <span class="right">{{ item.payAmount }}元</span>
      </div>
    </Card>
  </a-col>
</template>

<script>
import Card from '../component/Card'
import { axios } from '@/utils/request'
import moment from 'moment'
export default {
    components: {
        Card
    },
    created () {
        this.getData()
    },
    computed: {
        totalPrices () {
            return this.dataSource.reduce((total, now) => total + now.payAmount, 0)
        }
    },
    data () {
        return {
            dataSource: [],
            dateType: 2,
            dateTime: moment(new Date())
        }
    },
    watch: {
        dateTime () {
            this.getData()
        }
    },
    methods: {
        getData () {
            const { dateType, dateTime } = this
            const body = {
                dateType,
                dateTime: moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            axios({ path: 'remitStatistics', body }).then(({ data }) => {
                this.dataSource = data
            })
        }
    }
}
</script>
<style lang="less" scoped>
.remit-count {
  text-align: center;
  margin: 0 -20px;
  height: 120px;
  line-height: 120px;
  background: rgba(233, 244, 254, 1);
  font-size: 60px;
  font-family: HiraMaruPro-W4;
  font-weight: normal;
  color: rgba(24, 144, 255, 1);
}
.date-box {
  padding-left: 94px;
  .mg-b {
    margin-bottom: 20px;
  }
}
.remit-list {
  height: 30px;
  font-size: 12px;
  padding: 10px 24px;
  font-weight: 400;
  color: rgba(144, 147, 153, 1);
  .left {
    float: left;
  }
  .right {
    float: right;
  }
}
</style>

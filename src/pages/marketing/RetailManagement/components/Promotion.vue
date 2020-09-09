<!--
 * @Description: 促销记录
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-21 16:54:38
 * @LastEditors: haile
 * @LastEditTime: 2019-06-27 10:45:10
 -->
<template>
  <div class="box">
    <p style="font-size:16px;color:rgba(0,0,0,0.85)">促销记录</p>
    <a-row>
      <a-col :span="12" class="promotion-left">
        <!-- 单品活动 -->
        <div v-if="singleActivity.length>0">
          <a-row v-for="(item,index) in singleActivity" :key="index">
            <a-col :span="6">{{ item.activityName }} : </a-col>
            <a-col :span="18">{{ item.scheduleRuleName }} {{ item.scheduleAmount }}</a-col>
          </a-row>
        </div>
        <!-- 套购活动 -->
        <div v-if="arbitrageActivity.length>0">
          <a-row v-for="(item,index) in arbitrageActivity" :key="index">
            <a-col :span="6">{{ item.activityName }} : </a-col>
            <a-col :span="18">{{ item.scheduleRuleName }} {{ item.scheduleAmount }}</a-col>
          </a-row>
        </div>
        <!-- 单品满赠和套购满赠 -->
        <div v-if="gifts.length>0">
          <a-row v-for="(item,index) in gifts" :key="index">
            <a-col :span="6">赠品 ：</a-col>
            <a-col :span="18">
              <a-col :span="24">{{ item.name }} x{{ item.quantity }}</a-col>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :span="12" class="promotion-right">
        <!-- 满用 -->
        <!-- <div v-if="fullUseActivity.length>0">
          <a-row v-for="(item,index) in fullUseActivity" :key="index">
            <a-col :span="6">满用: </a-col>
            <a-col :span="18">满 {{ item.standard }}用{{ item.scheduleAmount }}</a-col>
          </a-row>
        </div> -->
        <!-- 满减 -->
        <!-- AB券 -->
        <a-row>
          <a-col :span="6">A账户: </a-col>
          <a-col :span="18">{{ auseAmount }}</a-col>
        </a-row>
        <a-row>
          <a-col :span="6">B账户: </a-col>
          <a-col :span="18">{{ buseAmount }}</a-col>
        </a-row>
        <!-- 电子券 -->
        <a-row v-for="(item,index) in electronic" :key="index">
          <a-col :span="6">电子券: </a-col>
          <a-col :span="18">{{ item.scheduleRuleName }}{{ item.scheduleAmount }}</a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
export default {
    name: 'Promotion',
    props: {
        orderIds: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            // 左侧数据
            gifts: [],
            singleActivity: [],
            arbitrageActivity: [],
            // 右侧数据
            auseAmount: 0,
            buseAmount: 0,
            electronic: [],
            fullUseActivity: [],
            amountList: {}

        }
    },
    mounted () {
        this.querySumActivity()
    },
    methods: {
        /**
         * @name: 获取促销记录
         * @msg:
         * @param {Array} orderIds
         * @return:
         */
        querySumActivity () {
            axios({
                path: 'ShoppingScheduleQuerySalesPromotion',
                method: 'POST',
                body: {
                    orderIds: this.orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询促销记录：', res.data)
                    this.amountList = {
                        shouldPay: res.data.shouldPay,
                        actualPay: res.data.actualPay,
                        unPay: res.data.actualPay
                    }
                    this.$emit('setAmount', this.amountList)
                    this.auseAmount = res.data.auseAmount
                    this.buseAmount = res.data.buseAmount
                    this.gifts = res.data.gifts
                    this.arbitrageActivity = res.data.arbitrageActivity
                    this.electronic = res.data.electronic
                    this.fullUseActivity = res.data.fullUseActivity
                    this.singleActivity = res.data.singleActivity
                    this.singleActivity.forEach(item => {
                        if (item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                            item.activityName = '单品满返'
                        } else if (item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                            item.activityName = '单品满减'
                        }
                    })
                    this.arbitrageActivity.forEach(item => {
                        if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                            item.activityName = '套购满返'
                        } else if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                            item.activityName = '套购满减'
                        }
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.box {
    .promotion-left,
    .promotion-right{
        box-sizing: border-box;
        padding: 10px;
        .ant-col-6 {
            text-align: right;
            color: #1980ff;
            padding-right:10px;
        }

    }
    .promotion-left {
      border-right: 1px solid #ccc;
    }
}
</style>

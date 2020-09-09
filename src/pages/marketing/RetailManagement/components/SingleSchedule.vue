<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-08 09:43:16
 * @LastEditors: haile
 * @LastEditTime: 2019-07-12 14:17:47
 -->
<template>
  <div class="box">
    <a-card
      class="activity-style"
      v-for="(item, index) in singleSchedule"
      :key="index"
      :class="item.selected?'active':''"
      @click.stop="chooseActivity(item)">
      <div class="activity-box">
        <span :class="['span-style', item.selected?'span-active':'']">
          {{ item.activityName }}
        </span>
        <div class="activity-desc">
          {{ item.desc }}
        </div>
        <div class="amount">
          <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'">应减：{{ item.shouldRateAmount }}</div>
          <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'" @click.stop.prevent>
            实减：
            <a-input-number
              :min="1"
              :max="item.maxAmount"
              v-model="actualSub"
              :disabled="item.isChange === '0'"
              @change="value=>activityChangeHandler(0,value,item.maxAmount)"/>
          </div>
          <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'">应返：{{ item.shouldRateAmount }}</div>
          <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'" @click.stop.prevent>
            实返：
            <a-input-number
              :min="1"
              :max="item.maxAmount"
              v-model="actualReturn"
              :disabled="item.isChange === '0'"
              @change="value=>activityChangeHandler(1,value,item.maxAmount)"/>
          </div>
        </div>
      </div>
      <div class="gift" v-if="item.gifts" >
        <a-checkbox-group @change="giftChange(item)" v-model="giftsArr" :disabled="disableChooseGift">
          <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
            <div @click.stop>
              <a-checkbox :value="gift.skuCode"></a-checkbox>
            </div>
            <div class="gift-img">
              <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
            </div>
            <div class="gift-info">
              <a-row>
                <p>{{ gift.skuName }}</p>
                <p>{{ initPrice(gift.skuPrice) }}</p>
                <p>x{{ gift.skuNum }}</p>
              </a-row>
            </div>
          </div>
        </a-checkbox-group>
      </div>
    </a-card>
  </div>
</template>

<script>
export default {
    name: 'SingleSchedule',
    props: {
        singleSchedule: {
            type: Array,
            default: () => []
        },
        initData: {
            type: Object,
            default: () => {}
        },
        disableOpt: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            disableChooseGift: false,
            giftDisable: false,
            giftsArr: [],
            actualSub: 0,
            actualReturn: 0,
            chosenActivity: {}
        }
    },
    mounted () {
        this.initActivity()
    },
    methods: {
        initActivity () {
            this.singleSchedule.forEach((item, index) => {
                if (this.initData.shoppingScheduleRule !== null && this.initData.shoppingScheduleRule.scheduleEffectType === item.effectType && this.initData.shoppingScheduleRule.scheduleType === item.scheduleType) {
                    this.isSchedule = 1
                    this.isActivityActive = this.activityPre = index
                    this.chosenActivity = { ...item }
                    if (this.initData.shoppingScheduleRule.scheduleType === 'schedule_rule_define_schedule_type:1') {
                        this.actualReturn = this.initData.shoppingScheduleRule.scheduleAmount
                        item.selected = true
                    } else if (this.initData.shoppingScheduleRule.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        this.actualSub = this.initData.shoppingScheduleRule.scheduleAmount
                        item.selected = true
                    } else if (this.chosenActivity.gifts) {
                        this.initData.shoppingTrolleySkuList.forEach(subItem => {
                            if (subItem.isGroupFlag === 2) {
                                item.selected = true
                                this.giftsArr.push(subItem.code)
                                subItem.unit_price = subItem.unitPrice
                                subItem.id = ''
                                this.gifts.push(subItem)
                                console.log('++++++++++', this.giftsArr)
                            }
                        })
                    }
                }
            })
        },
        chooseActivity (activity) {
            if (this.disableOpt) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                if (activity.scheduleType === 'schedule_rule_define_schedule_type:1' || activity.scheduleType === 'schedule_rule_define_schedule_type:2') {
                    console.log('1111111111111111111111111')
                    this.giftsArr = []
                    this.gifts = []
                    this.singleSchedule.forEach(item => {
                        if (item.scheduleType === activity.scheduleType) {
                            item.selected = !item.selected
                            if (item.selected === true) {
                                activity.startTime = activity.updateTime = activity.endTime = null
                                activity.scheduleRuleName = activity.name
                                activity.makeStoreCode = this.$store.getters.storeInfo.code
                                activity.standard = activity.reachUnitPrice
                                this.chosenActivity = { ...activity }
                                console.log('选择的营销活动：', this.chosenActivity)
                            } else {
                                this.chosenActivity = {}
                                console.log('选择的营销活动：', this.chosenActivity)
                            }
                        } else {
                            item.selected = false
                        }
                    })
                } else {
                    return false
                }
            }
        },
        giftChange (schedule) {
            if (this.disableOpt) {
                this.disableChooseGift = true
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {
                if (schedule.isShow === '0') {
                    this.disableChooseGift = true
                } else {
                    this.gifts = []
                    this.disableChooseGift = false
                    const newGift = this.giftsArr[this.giftsArr.length - 1]
                    this.giftsArr.splice(0, this.giftsArr.length)
                    this.giftsArr.push(newGift)
                    if (this.giftsArr[0] !== undefined) {
                        this.singleSchedule.forEach(item => {
                            if (item.gifts) {
                                item.selected = true
                                item.gifts.forEach(subItem => {
                                    if (subItem.skuCode === this.giftsArr[0]) {
                                        subItem = {
                                            isGroupFlag: 2,
                                            storeCode: this.$store.getters.storeInfo.code,
                                            name: subItem.skuName,
                                            code: subItem.skuCode,
                                            picture: subItem.skuPic,
                                            unit_price: subItem.skuPrice,
                                            quantity: subItem.skuNum,
                                            skuType: subItem.giftType
                                        }
                                        this.gifts.push(subItem)
                                    }
                                })
                            } else {
                                item.selected = false
                            }
                        })
                        schedule.startTime = schedule.updateTime = schedule.endTime = null
                        schedule.scheduleRuleName = schedule.name
                        schedule.makeStoreCode = this.$store.getters.storeInfo.code
                        schedule.standard = schedule.reachUnitPrice
                        this.chosenActivity = { ...schedule }
                    } else {
                        schedule.selected = false
                        this.chosenActivity = {}
                    }
                }
            }
        },
        clearSchedule () {
            this.singleSchedule.forEach(item => {
                item.selected = false
            })
            this.giftsArr = []
            this.gifts = []
            this.chosenActivity = {}
        },
        activityChangeHandler () {},
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {
        singleSchedule (val, oldVal) {
            if (val) {
                val.forEach(item => {
                    if (item.scheduleType === 'schedule_rule_define_schedule_type:3') {
                        if (item.isShow === '0') {
                            console.log(11111111111111)
                            this.disableChooseGift = true
                            this.giftDisable = true
                        } else {
                            console.log(2222222222222)
                            this.giftDisable = false
                            this.disableChooseGift = false
                        }
                    } else if (item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        console.log(3333333333333333)
                        this.actualSub = item.shouldRateAmount
                    } else if (item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                        console.log(4444444444444)
                        this.actualReturn = item.shouldRateAmount
                    }
                })
            }
        },
        initData (val, oldVal) {
            if (val) {
                // this.initActivity()
            }
        }
    }
}
</script>

<style lang="less" scoped>
.ant-card-body{
  display: flex;
  padding: 10px;
  .activity-desc{
    height:32px;
    line-height: 32px;
    flex: 3;
  }
  .amount {
    display: flex;
    height:32px;
    line-height: 32px;
    flex:1;
    div{
      flex: 1;
    }
  }
}

.gift {
  margin-bottom: 10px;
  .ant-checkbox-wrapper {
    width: 80px;
    text-align: center;
    height: 90px;
    line-height: 90px;
  }
  .gift-box{
    display: flex;
    .gift-img {
      width: 70px;
      height: 90px;
      line-height: 90px;
      margin: 10px;
      img{
        display: inline-block;
        width: auto;
        height: 90px;
      }
    }
    .gift-info {
      padding-top: 10px;
      flex:1;
      p{
        margin-bottom: 12px;
        font-weight: 700;
      }
    }
  }
}
.active{
  border:1px solid rgb(56,173,255);
  color: rgb(56,173,255);
}
.span-style{
  display: inline-block;
  width: 80px;
  height: 30px;
  margin-right: 10px;
  padding: 5px;
  font-size:12px;
  border:1px dotted #eee;
  color:#aaa;
  text-align:center;
}
.span-active{
  font-size:12px;
  background: rgb(56,173,255);
  color: #fff;
  text-align:center;
  border:1px dotted #eee;
}
</style>

<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-21 16:22:24
 * @LastEditors: haile
 * @LastEditTime: 2019-07-06 18:02:10
 -->
<template>
  <div class="box">
    <a-tabs defaultActiveKey="1" @change="switchActivity">
      <a-tab-pane tab="套购满返" key="1">
        <div class="activity-container">
          <div class="activity-item" v-for="(item,index) in fullReturn" :key="index" @click="selectActivity(item)" :class="{'active': item.data.selected}">
            <p class="title">
              满{{ item.data.reachAmount }}返{{ item.data.rateAmount }}电子券
            </p>
            <p>
              <span>实际返：</span>
              <span @click.stop.prevent>
                <a-input-number
                  :max="item.data.maxAmount"
                  :disabled="item.data.isChange==='0'"
                  v-model="item.data.actualAmount"
                  @change="val => amountChange(val,item.data.id)"
                  size="small"/>
              </span>
            </p>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="套购满减" key="2">
        <div class="activity-container">
          <div class="activity-item" v-for="(item,index) in fullReduction" :key="index" @click="selectActivity(item)" :class="{'active': item.data.selected}">
            <p class="title">
              满{{ item.data.reachAmount }}减{{ item.data.rateAmount }}
            </p>
            <p>
              <span>实际减：</span>
              <span @click.stop.prevent>
                <a-input-number
                  :max="item.data.maxAmount"
                  :disabled="item.data.isChange==='0'"
                  v-model="item.data.actualAmount"
                  @change="val => amountChange(val,item.data.id)"
                  size="small"/>
              </span>
            </p>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="套购满增" key="3">
        <div class="activity-container">
          <div class="activity" v-for="(item,index) in fullGift" :key="index">
            <p style="color:#1890ff;margin-bottom:4px;">{{ item.activityName }}</p>
            <div class="gift-list">
              <a-checkbox-group @change="val => giftChange(val, index)" v-model="checkedObj[index]">
                <a-row v-for="(gift, i) in item.list" :key="i">
                  <a-col :span="6">
                    <img src="" alt="" width="90" height="90">
                  </a-col>
                  <a-col :span="15">
                    <p class="pro-title">{{ gift.skuName }}</p>
                    <p class="pro-pc">
                      <span class="price">{{ initPrice(gift.skuPrice) }}</span>
                      <span class="count">x{{ gift.skuNum }}</span>
                    </p>
                  </a-col>
                  <a-col :span="3"><a-checkbox :value="gift"></a-checkbox></a-col>
                </a-row>
              </a-checkbox-group>
            </div>
            <div class="footer">
              <a-row>
                <a-col :span="12" v-for="(code, k) in item.codeList" :key="k">
                  <div>{{ code }}</div>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="满免活动" key="4">
        <div class="free-list" v-if="fullExemption.length>0">
          <a-checkbox-group @change="freeChange">
            <a-row v-for="(item,index) in fullExemption" :key="index">
              <p>{{ item.title }}</p>
              <a-col :span="6">
                <img :src="item.skuInfo.picture" alt="" width="90" height="90">
              </a-col>
              <a-col :span="15">
                <p class="pro-title">{{ item.skuInfo.name }}</p>
                <p class="pro-pc">
                  <span class="price">{{ initPrice(item.skuInfo.actualPrice) }}</span>
                  <span class="count">x{{ item.skuInfo.quantity }}</span>
                </p>
              </a-col>
              <a-col :span="3"><a-checkbox :value="item.data"></a-checkbox></a-col>
            </a-row>
          </a-checkbox-group>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="footer-option">
      <a-button @click="closeArbitrage">取消</a-button>
      <a-button type="primary" @click="confirmArbitrage">确认</a-button>
    </div>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
export default {
    name: 'ArbitrageActivity',
    props: {
        orderCodeList: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            fullExemption: [],
            fullReturn: [],
            fullReduction: [],
            fullGift: [],
            // 保存入参:选中的规则单集合
            shoppingScheduleRuleList: [],
            // 保存入参:赠品集合
            shoppingSaleRecordList: [],
            preKey: '-1',
            nowKey: '1',
            orderCode: '',
            checkedObj: {},
            actualAmount: 0
        }
    },
    created () {
        this.queryMultipleActivity(this.orderCodeList, 3)
    },
    methods: {
        amountChange (val, scheduleId) {
            this.shoppingScheduleRuleList.forEach(item => {
                if (item.id === scheduleId) {
                    item.scheduleAmount = val
                    if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                        item.title = `满${item.rateAmount}减${val}`
                    } else if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                        item.title = `满${item.rateAmount}返${val}`
                    }
                }
            })
        },
        selectActivity (schedule) {
            schedule.data.selected = !schedule.data.selected
            if (schedule.data.selected) {
                // 选中
                const scheduleRule = {
                    id: schedule.data.id,
                    reachAmount: schedule.data.reachAmount,
                    scheduleRuleCode: schedule.data.code,
                    scheduleRuleName: schedule.data.scheduleDefineId,
                    shoppingTrolleyCode: schedule.orderCode,
                    scheduleType: schedule.data.scheduleType,
                    scheduleEffectType: schedule.data.effectType,
                    makeStoreCode: this.$store.getters.storeInfo.code,
                    scheduleAmount: schedule.data.actualAmount,
                    standard: schedule.data.reachAmount,
                    rateAmount: schedule.data.rateAmount,
                    maxAmount: schedule.data.maxAmount
                }
                this.shoppingScheduleRuleList.push(scheduleRule)
            } else {
                // 取消选中
                this.shoppingScheduleRuleList = this.shoppingScheduleRuleList.filter(item => item.id !== schedule.data.id)
            }
            console.log('选中的套购活动', this.shoppingScheduleRuleList)
        },
        switchActivity (key) {
            this.nowKey = key
            this.shoppingScheduleRuleList = []
            this.shoppingSaleRecordList = []
            if (this.nowKey !== this.preKey) {
                this.clearSchedule(this.preKey)
                this.preKey = this.nowKey
                if (key === '1') {
                    this.queryMultipleActivity(this.orderCodeList, 3)
                } else if (key === '2') {
                    this.queryMultipleActivity(this.orderCodeList, 2)
                } else if (key === '3') {
                    this.queryMultipleActivity(this.orderCodeList, 4)
                } else {
                    this.queryMultipleActivity(this.orderCodeList, 1)
                }
            }
        },
        clearSchedule (preKey) {
            if (preKey === '1') {
                this.fullReturn.forEach(item => {
                    item.data.selected = false
                })
            } else if (preKey === '2') {
                this.fullReduction.forEach(item => {
                    item.data.selected = false
                })
            } else if (preKey === '3') {
                this.queryMultipleActivity(this.orderCodeList, 4)
            } else {
                this.queryMultipleActivity(this.orderCodeList, 1)
            }
        },
        giftChange (checkedValue, index) {
            this.shoppingScheduleRuleList = []
            this.shoppingSaleRecordList = []
            if (checkedValue.length > 0) {
                const tempObj = checkedValue[checkedValue.length - 1]
                checkedValue.splice(0, checkedValue.length)
                checkedValue.push(tempObj)
                this.checkedObj[index] = checkedValue
            } else {
                this.checkedObj[index] = []
            }
            for (const key in this.checkedObj) {
                this.checkedObj[key].forEach(item => {
                    const scheduleRule = {
                        title: `赠品：${item.skuName} x ${item.skuNum}`,
                        id: item.data.id,
                        scheduleRuleCode: item.data.code,
                        scheduleRuleName: item.data.scheduleDefineId,
                        shoppingTrolleyCode: item.orderCode,
                        scheduleType: item.data.scheduleType,
                        scheduleEffectType: item.data.effectType,
                        makeStoreCode: this.$store.getters.storeInfo.code,
                        scheduleAmount: 0,
                        standard: item.reachAmount,
                        rateAmount: 0,
                        maxAmount: 0,
                        note: item.note,
                        rateProviderAmount: item.rateAmount
                    }
                    const gift = {
                        storeCode: this.$store.getters.storeInfo.code,
                        orderId: item.orderCode,
                        guider: this.$store.getters.userInfo.name,
                        guiderCode: this.$store.getters.userInfo.code,
                        skuModel: item.skuModel,
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        skuPicture: item.picture,
                        skuType: item.giftType,
                        unitPrice: item.skuPrice,
                        actualPrice: item.skuPrice,
                        quantity: item.skuNum,
                        isGroupFlag: 2
                    }
                    this.shoppingScheduleRuleList.push(scheduleRule)
                    this.shoppingSaleRecordList.push(gift)
                })
            }
        },
        clearGift () {
            for (const key in this.checkedObj) {
                this.checkedObj[key] = []
            }
            console.log('清除赠品', this.checkedObj)
        },
        freeChange (checkedValue) {
            if (checkedValue.length > 0) {
                this.shoppingScheduleRuleList = []
                this.shoppingSaleRecordList = []
                checkedValue.forEach(item => {
                    const scheduleRule = {
                        id: item.id,
                        scheduleRuleCode: item.code,
                        scheduleRuleName: item.scheduleDefineId,
                        shoppingTrolleyCode: item.orderCode,
                        scheduleType: item.scheduleType,
                        scheduleEffectType: item.effectType,
                        makeStoreCode: this.$store.getters.storeInfo.code,
                        scheduleAmount: item.skuInfo.actualAmount,
                        standard: item.reachAmount,
                        rateAmount: item.skuInfo.actualAmount,
                        maxAmount: item.maxAmount,
                        note: item.note,
                        rateProvider: item.rateProvider,
                        title: `满免：${item.skuInfo.actualAmount}`
                    }
                    this.shoppingScheduleRuleList.push(scheduleRule)
                })
            } else {
                this.shoppingScheduleRuleList = []
            }
        },
        closeArbitrage () {
            this.$emit('onArbitrageActivityClose')
        },
        confirmArbitrage () {
            this.$emit('setArbitrageData', [this.shoppingScheduleRuleList, this.shoppingSaleRecordList])
        },
        queryMultipleActivity (orderCodeList, activityType) {
            const self = this
            axios({
                path: 'ScheduleGiftQueryMultipleActivity',
                method: 'post',
                body: {
                    orderCodeList: orderCodeList,
                    activityType: activityType,
                    storeCode: self.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (activityType === 1) {
                        // 满免
                        const data = res.data
                        data.forEach(item => {
                            item.data.orderCode = item.orderCode
                            item.data.title = item.title
                            item.data.rateProvider = item.rate
                            item.skuInfo.actualAmount = item.skuInfo.actualPrice
                            item.data.skuInfo = item.skuInfo
                            item.data.note = item.title
                            item.data.rateProvider = item.rate
                        })
                        this.fullExemption = res.data
                    } else if (activityType === 2) {
                        // 满减
                        const data = res.data
                        data.forEach(item => {
                            item.data.actualAmount = item.actualAmount
                            item.data.selected = false
                            item.data.title = `满${item.data.reachAmount}减${item.data.rateAmount}  实际减${item.data.scheduleAmount}`
                        })
                        this.fullReduction = data
                        console.log('满减：', this.fullReduction)
                    } else if (activityType === 3) {
                        // 满返
                        const data = res.data
                        data.forEach(item => {
                            item.data.actualAmount = item.actualAmount
                            item.data.selected = false
                            item.data.title = `满${item.data.reachAmount}返${item.data.rateAmount}  实际返${item.data.scheduleAmount}`
                        })
                        this.fullReturn = data
                        console.log('满返', this.fullReturn)
                    } else {
                        // 满赠
                        const data = res.data
                        data.forEach(item => {
                            item.codeList = item.orderCode.split(',')
                            item.list.forEach(subItem => {
                                subItem.selected = false
                                subItem.data = item.data
                                subItem.orderCode = item.orderCode
                                subItem.note = item.activityName
                            })
                        })
                        this.fullGift = data
                    }
                }
            })
        },
        clearAll () {
            this.fullExemption = []
            this.fullReturn = []
            this.fullReduction = []
            this.fullGift = []
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }

}
</script>

<style lang="less" scoped>
.ant-checkbox-group{
  width: 100%;
  height:100%;
}
.activity-container {
  .activity-item {
    border:1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    p {
      margin-bottom: 10px;
      span {
        font-size: 12px;
      }
      .anticon {
        float: right;
      }
    }
    .title {
      color: #1980ff;
    }
  }
  .active {
    border: 1px solid #1980ff;
  }
  .activity {
    margin-bottom: 15px;
    .gift-list {
      border:1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      .ant-row {
        margin-bottom: 10px;
        .ant-col-3 {
          text-align: right;
          height: 70px;
          line-height: 70px;
        }
        .count {
          float: right;
        }
      }
    }
    .footer {
      border: 1px solid #ccc;
      margin-top: -1px;
      .ant-col-12 {
        padding: 5px 10px;
        div{
          border:1px solid #ccc;
          text-align: center;
        }
      }
    }
  }
}
.free-list {
  width: 100%;
  .ant-row {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    p {
      padding: 10px 0 0 10px;
    }
    .ant-col-3 {
      text-align: right;
      height: 70px;
      line-height: 70px;
    }
    .count {
      float: right;
    }
  }
}
.footer-option {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  .ant-btn {
    margin-left: 10px;
  }
}
</style>

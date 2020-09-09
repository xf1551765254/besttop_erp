<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-13 11:02:56
 * @LastEditors: haile
 * @LastEditTime: 2019-07-13 15:21:53
 -->
<template>
  <div class="box">
    <a-card style="margin-top:-1px;" v-for="(item,index) in arbitrageSchedule" :key="index">
      <div class="activity-box">
        <span class="span-style">
          {{ item.activityName }}
        </span>
        <div class="activity-desc">
          {{ item.desc }}
        </div>
        <div class="amount">
        </div>
      </div>
      <div class="gift" v-if="item.gifts">
        <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
          <div class="gift-img">
            <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70">
          </div>
          <div class="gift-info">
            <p>{{ gift.skuName }}</p>
            <p>{{ initPrice(gift.skuPrice) }}</p>
            <p>x{{ gift.skuNum }}</p>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { axios } from '@/utils/request'

export default {
    name: 'OtherSchedule',
    props: {
        goodsInfo: {
            type: Object,
            default: () => {}
        },
        actualPrice: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            arbitrageSchedule: []
        }
    },
    async mounted () {
        await this.queryArbitrageSchedule()
        // await this.queryFullUseSchedule()
    },
    methods: {
        async queryArbitrageSchedule () {
            this.arbitrageSchedule = []
            const self = this
            const res = await axios({
                path: 'ScheduRuleGetArbitrageSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    skuCode: self.goodsInfo.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                const data = res.data
                if (data.length > 0) {
                    data.forEach(item => {
                        if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                            item.activityName = '套购满返'
                            item.desc = `满${item.reachAmount}返${item.rateAmountT}`
                        } else if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                            item.activityName = '套购满减'
                            item.desc = `满${item.reachAmount}减${item.rateAmountT}`
                        } else {
                            item.activityName = '套购满赠'
                            item.desc = `满${item.reachAmount}赠以下商品`
                            item.src = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                        }
                    })
                }
                this.arbitrageSchedule = data
                this.queryFullUseSchedule()
            }
        },
        // 查询满用活动
        async queryFullUseSchedule () {
            const self = this
            const res = await axios({
                path: 'ScheduRuleGetFullUseSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    skuCode: self.goodsInfo.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            })
            if (res.flag === 1) {
                console.log('满用活动', res.data)
                const data = res.data
                if (data.length > 0) {
                    data.forEach(item => {
                        item.activityName = '满用'
                        item.desc = `满${item.reachUnitPrice}可用${item.rateAmount}电子券`
                    })
                    this.arbitrageSchedule.push(data[0])
                }
            }
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {
        goodsInfo (val, oldVal) {
            if (JSON.stringify('val') !== '{}') {
                this.queryArbitrageSchedule()
                // this.queryFullUseSchedule()
            }
        }
    }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-body {
  padding:10px;
  .activity-box{
    display: flex;
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
}
// 赠品样式重写
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
      width: 90px;
      height: 90px;
      line-height: 90px;
      margin: 10px;
      text-align: center;
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
</style>

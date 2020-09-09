<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-13 15:27:40
 * @LastEditors: haile
 * @LastEditTime: 2019-07-13 16:24:49
 -->
<template>
  <a-row>
    <a-col :span="12">
      <a-col :span="24" class="mark-conter" style="font-weight:bold;padding-left:20px;">A账户可用额度：{{ initPrice(coupons.acanUse) }}</a-col>
      <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">B账户可用额度：{{ initPrice(coupons.bcanUse) }}</a-col>
      <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">当笔提成：{{ initPrice(coupons.bBushMoney) }}</a-col>
    </a-col>
    <a-col :span="12">
      <a-col :span="8" class="mark-title">A账户实用额：</a-col>
      <a-col :span="16" class="mark-conter">
        <a-input-number
          :min="0"
          :max="coupons.acanUse"
          size="small"
          v-model="aUseAmount"
          :disabled="disableOpt"
          @change="aChangeHandler"/>
      </a-col>
      <a-col :span="8" class="mark-title">B账户实用额：</a-col>
      <a-col :span="16" class="mark-conter">
        <a-input-number
          :min="0"
          :max="coupons.bcanUse"
          size="small"
          v-model="bUseAmount"
          :disabled="disableOpt"
          @change="bChangeHandler"/>
      </a-col>
    </a-col>
  </a-row>
</template>

<script>
import { axios } from '@/utils/request'
export default {
    name: 'Coupons',
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
        },
        disableOpt: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            coupons: {},
            aUseAmount: 0,
            bUseAmount: 0
        }
    },
    mounted () {
        this.queryCoupons()
    },
    methods: {
        aChangeHandler (val) {
            if (val > this.coupons.acanUse) {
                this.aUseAmount = this.coupons.acanUse
                this.$message.warning('使用额超过可用额度')
            }
        },
        bChangeHandler (val) {
            const { add } = this.$math
            if (val > Number(add(this.coupons.bcanUse, this.coupons.bBushMoney))) {
                this.$message.warning('使用额超过可用额度')
            }
        },
        queryCoupons () {
            const self = this
            axios({
                path: 'CouponsUseGetCoupons',
                method: 'POST',
                body: {
                    skuCode: self.goodsInfo.code,
                    storeCode: this.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.coupons = res.data
                }
            })
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {

    }
}
</script>

<style lang="less" scoped>
.mark-title{
    text-align: right;
    font-weight: bold;
    padding-right: 10px;
    font-size: 12px;
    line-height: 34px;
}
.mark-conter{
    font-size: 12px;
    line-height:34px;
}
</style>

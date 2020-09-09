<!--
 * @Description: 金额列表
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 14:40:10
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 17:21:14
 -->
<template>
  <div class="amount-box">
    <!-- 减免金额 -->
    <div class="sub-amount">
      <p>
        <span>使用电子币：</span>
        <span>{{ initPrice(amountList.coinUsed) }}</span>
      </p>
      <p>
        <span>补贴促销券：</span>
        <span>{{ initPrice(amountList.subsidiesAmount) }}</span>
      </p>
      <p>
        <span>电子币补扣：</span>
        <span>{{ initPrice(amountList.coinBuckleAmount) }}</span>
      </p>
      <p>
        <span>促销补扣：</span>
        <span>{{ initPrice(amountList.promotionBuckleAmount) }}</span>
      </p>
    </div>
    <!-- 金额列表 -->
    <div class="amount-list">
      <p>
        <span>原价金额：</span>
        <span>{{ initPrice(amountList.originalAmount) }}</span>
      </p>
      <p>
        <span>折扣金额：</span>
        <span>{{ initPrice(amountList.discountAmount) }}</span>
      </p>
      <p>
        <span>应收金额：</span>
        <span>{{ initPrice(amountList.shouldPayAmount) }}</span>
      </p>
      <p>
        <span>实收金额</span>
        <span style="color:#408BFF">{{ initPrice(amountList.actualAmount) }}</span>
      </p>
      <a-divider />
      <p>
        <span>尾款金额</span>
        <span style="color:#FF2323;font-weight:700">{{ initPrice(amountList.balanceAmount) }}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
    name: 'AmountList',
    props: {
        list: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            amountList: {
                coinUsed: 0, // 电子币使用金额
                subsidiesAmount: 0, // 补贴促销券
                coinBuckleAmount: 0, // 电子币补扣
                promotionBuckleAmount: 0, // 促销补扣
                originalAmount: 0, // 原价金额
                discountAmount: 0, // 折扣金额
                shouldPayAmount: 0, // 应退金额
                actualAmount: 0, // 实退金额
                balanceAmount: 0 // 尾款金额
            }
        }
    },
    methods: {
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {
        list: {
            handler (val, oldVal) {
                console.log('金额列表', val)
                this.amountList = val
            },
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
.amount-box {
    height: 258px;
    .sub-amount,
    .amount-list {
        border-radius: 6px;
        background: #fff;
        padding: 10px;
        margin-top: 5px;
        p {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .ant-divider {
            margin: 5px 0;
        }
    }
}
</style>

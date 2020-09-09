<!--
 * @Description: 支付方式及支付
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-08-14 15:43:21
 * @LastEditors: haile
 * @LastEditTime: 2019-08-14 16:03:29
 -->
<template>
  <div class="pay-box">
    <div><span><img src="@assets/RetailManagement/cash.png" alt="现金"></span><span>现金F1</span></div>
    <div><span><img src="@assets/RetailManagement/scan.png" alt="扫码"></span><span>扫码F2</span></div>
    <div><span><img src="@assets/RetailManagement/bank.png" alt="银联"></span><span>银联F3</span></div>
  </div>
</template>

<script>
export default {
    name: 'Payment',
    props: {

    },
    data () {
        return {

        }
    },
    mounted () {
        const self = this
        document.onkeydown = function (e) {
            const key = window.event.keyCode
            if (key === 112) {
                // 现金支付F1
                e.preventDefault()
                console.log('现金支付F1')
            } else if (key === 113) {
                // 扫码支付F2
                e.preventDefault()
                console.log('扫码支付F2')
            } else if (key === 114) {
                // 银联支付F3
                e.preventDefault()
                console.log('银联支付F3')
            }
        }
    }
}
</script>
<style lang="less" scoped>
.pay-box {
    display: flex;
    height: 80px;
    margin-top: 10px;
    border-radius: 6px;
    padding: 0 55px;
    background: #fff;
    > div {
        display: flex;
        flex: 1;
        padding: 10px 0;
        flex-direction: column;
    }
}
</style>

<!--
 * @Description: 商品详情
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-18 11:07:59
 * @LastEditors: haile
 * @LastEditTime: 2019-07-18 11:12:01
 -->
<template>
  <div class="box">
    商品详情
    <a-button type="primary" @click="toGoodsList">商品列表</a-button>
  </div>
</template>

<script>
export default {
    name: 'GoodsDetail',
    methods: {
        toGoodsList () {
            this.$emit('activeComponent', 0)
        }
    }
}
</script>

<style lang="less" scoped>

</style>

<!--
 * @Description: 销售单详情
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-10 16:31:09
 * @LastEditors: haile
 * @LastEditTime: 2019-06-10 16:36:27
 -->
<template>
  <div class="box">
    <!-- 销售单列表 -->
    <div class="list-box">
      <a-card v-for="(item,index) in salesList" :key="index">
        <div class="card-header">
          <div class="header-text">
            <span>流水号：{{ item.payNumber }}</span>
            <span>销售店：西城店</span>
            <span>提货位置：西城仓</span>
            <span>导购：{{ item.guideName }} {{ item.guideCode }}</span>
            <span>顾客：{{ item.customerName }} {{ item.telephone }}</span>
            <span>结算时间：2019-06-10 16:34:22</span>
          </div>
        </div>
        <div class="card-content">
          <a-row class="order" v-for="(order,i) in item.shoppingTrolleyDetailList" :key="i">
            <a-col :span="12" class="order-left">
              <p>销售单号：<span style="margin-right:10px">{{ order.code }}</span></p>
              <div>
                <img src="https://img12.360buyimg.com/n5/s54x54_jfs/t29338/297/862339806/61742/72dc83bd/5c00ac2cNe242a4d4.jpg" height="90" width="90">
                <div class="order-info">
                  <p>
                    <span>{{ order.skuName }}</span>
                    <span style="margin-left:10px">{{ order.skuCode }}</span>
                  </p>
                  <p>
                    <span>{{ order.skuProperty }}</span>
                    <span style="margin-left:10px">x{{ order.skuQuantity }}</span>
                  </p>
                  <p>售价: {{ initPrice(order.skuActualPrice) }}</p>
                </div>
              </div>
            </a-col>
            <a-col :span="12" class="order-right">
              <p>收货人：{{ order.customeName }}</p>
              <p>手机号: {{ order.customeTelephone }}</p>
              <p>地址：{{ order.customerAddress }}</p>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SalesOrderList',
    data () {

    }
}
</script>

<style lang="less" scoped>

</style>

<!--
 * @Description: 赠品发放/回收小票
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-13 16:30:47
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-01 18:24:37
 -->
<template>
  <div class="box">
    <p class="title">{{ ticketTitle }}</p>
    <a-row>
      <a-col :span="6">赠品编码</a-col>
      <a-col :span="18">{{ ticketData.code }}</a-col>
      <a-col :span="6">赠品名称</a-col>
      <a-col :span="18">{{ ticketData.skuName }}</a-col>
      <a-col :span="6">销售单号</a-col>
      <a-col :span="18">
        <a-row>
          <a-col :span="24" v-for="(orderCode,index) in ticketData.orderCodeList" :key="index">{{ orderCode }}</a-col>
        </a-row>
      </a-col>
      <a-col :span="6" v-if="type===1">发放人</a-col>
      <a-col :span="6" v-if="type===0">回收人</a-col>
      <a-col :span="18">{{ ticketData.updateBy }}</a-col>
      <a-col :span="6" v-if="type===1">发放时间</a-col>
      <a-col :span="6" v-if="type===0">回收时间</a-col>
      <a-col :span="18">{{ ticketData.updateTime }}</a-col>
      <a-col :span="6" v-if="type===1">发放位置</a-col>
      <a-col :span="6" v-if="type===0">回收位置</a-col>
      <a-col :span="18">{{ `${ticketData.storeCode }-${ticketData.storeName}` }}</a-col>
    </a-row>
    <div class="ticket-code">
      <VueBarcode :value="ticketData.code" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
    </div>
  </div>
</template>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'Ticket',
    components: {
        VueBarcode
    },
    props: {
        type: {
            type: Number,
            default: 1
        },
        ticketData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        ticketTitle: {
            type: String,
            default: ''
        }
    },
    data () {
        return {

            barCodeOptions: {
                format: 'CODE128',
                displayValue: false,
                height: 50,
                background: '#ffffff',
                lineColor: '#000000'
            }
        }
    },
    mounted () {

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.box {
  padding: 10px;
  font-size: 16px;
  width: 400px;
  margin-bottom: 10px;
  .title {
    text-align: center
  }
  .ant-col-6,
  .ant-col-18 {
    margin-bottom: 5px;
  }
  .ticket-code {
      text-align: center;
      /deep/ svg{
        width: 100%;
      }
    }
}
</style>

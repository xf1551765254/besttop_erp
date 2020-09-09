<!--
 * @Description: 发票预览模板
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-07 20:54:56
 * @LastEditTime: 2019-08-19 19:14:17
 -->
<template>
  <div class="invoicetpl-box">
    <div class="list-item" v-for="(item, index) in list" :key="index">
      <p class="invoice-header">商品销售小票</p>
      <div>客户名称：{{ item.orderInfo.customerName }}</div>
      <div>销售单号：{{ item.orderInfo.code }}</div>
      <div class="barcode-box">
        <VueBarcode :value="item.orderInfo.code" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
      </div>
      <div>销售单位：{{ item.orderInfo.storeId }}</div>
      <div>开票日期：{{ item.orderInfo.createTime }}</div>
      <div class="title-row">
        <span>编码/名称</span>
        <span>数量</span>
        <span>单价</span>
        <span>金额</span>
      </div>
      <a-divider dashed/>
      <a-divider dashed/>
      <div class="content-row">
        <span>{{ item.orderInfo.skuCode }}</span>
        <span>{{ item.orderInfo.skuQuantity }}</span>
        <span>{{ item.orderInfo.skuUnitPrice }}</span>
        <span>{{ item.orderInfo.skuActualPrice }}</span>
      </div>
      <div>{{ item.orderInfo.skuName }}[{{ item.orderInfo.skuCode }}] [收券]</div>
      <a-divider dashed/>
      <a-divider dashed/>
      <div>小写合计：{{ item.orderInfo.actualPay }}</div>
      <div>大写合计：{{ item.orderInfo.upActualPrice }}</div>
      <div>发票申请码：{{ item.invoiceSerialNum }}</div>
      <div>注：通过扫描二维码获取电子发票信息。</div>
      <div id="qr-code">
        <img :src="item.src">
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
/deep/ .ant-divider-horizontal {
    margin: 3px 0;
  }
  .invoicetpl-box {
    page-break-before: always;
    page-break-inside: avoid;
    width: 400px;
    padding: 10px;
    font-size: 16px;
    page-break-after: always;
    page-break-inside: avoid;
      .list-item {
        .invoice-header {
          text-align: center;
        }
        .barcode-box{
          /deep/ svg{
            width: 100%;
          }
        }
        .title-row,
        .content-row {
          display: flex;
          justify-content: space-between;
          span {
            margin-right: 20px;
            text-align: left;
          }
        }
        #qr-code {
          text-align: center;
          img {
            display: inline-block;
            width: 200px;
            height: 200px;
          }
        }
      }
  }
</style>

<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'Invoicetpl',
    components: {
        VueBarcode
    },
    props: {
        invoiceList: {
            type: Array,
            default: () => []
        }
    },
    mounted () {
        console.log('传入发票组件的信息：', this.$props.invoiceList)
    },
    data () {
        return {
            qrSrcArr: [],
            barCodeOptions: {
                format: 'CODE128',
                displayValue: false,
                height: 50,
                background: '#ffffff',
                lineColor: '#000000'
            },
            list: []
        }
    },
    watch: {
        invoiceList: {
            handler (val, oldval) {
                this.list = val
                console.log(val)
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

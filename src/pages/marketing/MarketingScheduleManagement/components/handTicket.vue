<!--
 * @Description: 手工满赠小票
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-05 16:48:11
 * @LastEditors: lin
 * @LastEditTime: 2019-08-05 17:33:49
 -->
<template>
  <div class="box">
    <a-modal
      title="发放小票"
      v-model="visible"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :zIndex="1001"
      destroyOnClose
      centered >
      <div id="print-box">
        <p class="title">发放小票</p>
        <a-row>
          <a-col :span="6">赠品编码</a-col>
          <a-col :span="18">{{ ticketData.manualCode }}</a-col>
          <a-col :span="6">赠品名称</a-col>
          <a-col :span="18">{{ ticketData.skuName }}</a-col>
          <a-col :span="6">发放单号</a-col>
          <a-col :span="18">{{ ticketData.manualCode }}</a-col>
          <a-col :span="6">发放人</a-col>
          <a-col :span="18">{{ ticketData.issuercode }}-{{ ticketData.issuerName }}</a-col>
          <a-col :span="6">发放时间</a-col>
          <a-col :span="18">{{ ticketData.issuerTime }}</a-col>
          <a-col :span="6">发放位置</a-col>
          <a-col :span="18">{{ `${ticketData.storeCode }-${ticketData.storeName}` }}</a-col>
        </a-row>
        <div class="ticket-code">
          <VueBarcode :value="ticketData.manualCode" :options="barCodeOptions" tag="svg">生成失败</VueBarcode>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import print from 'print-js'
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
    name: 'Ticket',
    components: {
        VueBarcode
    },
    props: {
        ticketData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        visible: {
            type: Boolean,
            default: false
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
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
            this.$emit('onConfirm')
            this.$emit('update:visible', false)
        },
        printTicketCancel () {
            this.$emit('onConfirm')
            this.$emit('update:visible', false)
        }
    },
    watch: {
        visible (val) {
            if (val) {

            }
        }
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

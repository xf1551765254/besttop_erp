<!--
 * @Description: 赠品规则单
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-06-22 17:51:56
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-22 11:27:40
 -->
<template>
  <div class="box">
    <!-- 赠品规则单 -->
    <a-card>
      <a-card class="gift-list" v-for="(item,index) in giftsList" :key="index">
        <div class="card-header">
          <div>
            销售单号：
            <span>{{ item.orderCode }}</span>
          </div>
          <a-button v-if="defaultActiveKey==='1'" @click="visbel(item)">{{ item.define.code }}-{{ flag === 0 ? '单品满赠' : '套购满赠' }}</a-button>
        </div>
        <div class="card-content">
          <p>
            可领赠品
            <a-button @click="toConfirmGrant(item.orderCode)" size="small" :disabled="JSON.stringify(giftsObjtect[item.orderCode])==='{}'">{{ defaultActiveKey==='1'?"发放":"回收" }}</a-button>
          </p>
          <div>
            <!-- 赠品表格 -->
            <a-table
              rowKey="skuCode"
              :columns=" defaultActiveKey==='1'?columns:recycColumns"
              :dataSource="item.gifts"
              size="small"
              :rowSelection="{selectedRowKeys: item.selectedRowKeys,type: 'radio', onChange: onSelectChange}"
              bordered>
              <div slot="giftPicture" slot-scope="text">
                <img :src="text" alt="" class="img-box" @click="imgClick(text)">
              </div>
            </a-table>
          </div>
        </div>
      </a-card>
    </a-card>
    <!-- 图片预览 -->
    <a-modal
      v-model="previewVisible"
      :footer="null"
      @cancel="previewCancel"
      :bodyStyle="{padding:'40px', maxWidth:'960px'}"
      destroyOnClose
      centered>
      <img alt="example" style="width: 100%" :src="imgSrc"/>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ScheduleItem',
  props: {
    giftsList: {
      type: Array,
      default: () => []
    },
    flag: {
      type: Number,
      default: 0
    },
    defaultActiveKey: {
      type: String,
      default: '1'
    },
    previewVisbel: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columns: [
        { title: '赠品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
        { title: '赠品图片', dataIndex: 'picture', align: 'center', width: 100, scopedSlots: { customRender: 'giftPicture' } },
        { title: '赠品名称', dataIndex: 'skuName', align: 'center', width: 100 },
        { title: '数量', dataIndex: 'skuQuantity', align: 'center', width: 100 },
        { title: '赠品类型', dataIndex: 'note', align: 'center', width: 100 },
        { title: '发放状态', dataIndex: 'issue', align: 'center', width: 100 }
      ],
      recycColumns: [
        { title: '赠品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
        { title: '赠品图片', dataIndex: 'skuPicture', align: 'center', width: 100, scopedSlots: { customRender: 'giftPicture' } },
        { title: '赠品名称', dataIndex: 'skuName', align: 'center', width: 100 },
        { title: '数量', dataIndex: 'skuQuantity', align: 'center', width: 100 },
        { title: '赠品类型', dataIndex: 'skuTypeName', align: 'center', width: 100 },
        { title: '发放状态', dataIndex: 'typeName', align: 'center', width: 100 }
      ],
      dataSource: [],
      // 图片预览
      previewVisible: false,
      imgSrc: '',
      confirmData: {},
      giftsObjtect: {}
      // selectedRowKeys: {}

    }
  },
  watch: {
    giftsList () {
      console.log('aaaa')
      this.giftsList.forEach(el => {
        this.giftsObjtect[el.orderCode] = {}
        // this.selectedRowKeys[el.orderCode] = []
      })
      this.giftsObjtect = { ...this.giftsObjtect }
    }
  },
  mounted () {
    console.log('传入的giftList', this.giftsList)
    this.giftsList.forEach(el => {
      this.giftsObjtect[el.orderCode] = {}
      // this.selectedRowKeys[el.orderCode] = []
    })
    this.giftsObjtect = { ...this.giftsObjtect }
    // this.$nextTick(() => {
    //     // this.selectedRowKeys = { ...this.selectedRowKeys }
    // })
  },
  methods: {
    // 图片预览
    imgClick (imgSrc) {
      console.log(imgSrc)
      this.imgSrc = imgSrc
      this.previewVisible = true
    },
    // 取消预览
    previewCancel () {
      this.previewVisible = false
    },
    onSelectChange (key, row) {
      console.log(key, row)

      // let schedule = {}
      const gift = row[0]
      this.giftsList.forEach(item => {
        if (item.orderCode === gift.orderCode) {
          item.selectedRowKeys = key
        }
      })
      const confirmData = {
        id: gift.id,
        orderCode: gift.orderCode,
        payNumber: gift.payNumber,
        storeCode: this.$store.getters.storeInfo.code,
        skuCode: gift.skuCode,
        scheduleRuleGiftsId: gift.id,
        scheduleRuleDefineId: gift.scheduleRuleDefineId,
        quantity: gift.skuQuantity,
        skuPicture: gift.picture,
        skuModel: gift.skuModel,
        skuType: gift.giftType,
        priceCost: gift.skuPrice,
        skuName: gift.skuName
      }
      console.log(this.giftsObjtect[gift.orderCode])
      this.giftsObjtect[gift.orderCode] = confirmData
      this.giftsObjtect = { ...this.giftsObjtect }

      console.log(this.giftsObjtect)
    },
    toConfirmGrant (orderCode) {
      console.log(orderCode)

      this.confirmData = this.giftsObjtect[orderCode]
      console.log(this.confirmData)
      this.$emit('openGrantModal', this.confirmData)
    },
    visbel (item) {
      console.log(item.define.code)

      this.$emit('update:previewVisbel', true)
      this.$emit('update:orderId', item.define.code)
      // this.previewVisbel = true
    }
  }
}
</script>

<style lang="less" scoped>
.gift-list {
    margin-bottom: 10px;
    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      span {
        margin-right: 15px;
      }
    }
    .card-content {
      p {
        margin-bottom: 10px;
        .ant-btn {
          float: right;
        }
      }
    }
  }
</style>

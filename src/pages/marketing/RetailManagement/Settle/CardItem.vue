<template>
  <div>
    <a-card v-if="nonDepositList.length > 0" >
      <div slot="title">
        <span style="color:rgba(144,147,153,1);">顾客：</span>
        <span> {{ customer.name }} </span>
      </div>
      <a-row
        class="item-box"
        :class="{ border: i === 0 }"
        v-for="(item, i) in nonDepositList"
        :key="i" >
        <a-col class="item" style="border-right: 1px solid #e8e8e8;" :span="12">
          <div style="display:flex">
            <a-checkbox
              :checked="isChecked(item)"
              :autoFocus="i === 0"
              class="check"
              @change="change(item)"
            />
            <div style="flex: 1">
              <a-row style="margin-bottom:10px">
                <a-col :span="12" >
                  单号：{{ item.trolleySku.shoppingTrolleyId }}
                </a-col >
                <a-col :span="12" class="guide">导购： {{ item.trolley.guideName }} </a-col>
              </a-row>
              <div style="display:flex;">
                <img class="img" :src="item.trolleySku.picture" alt="" />
                <div style="flex: 1">
                  <div class="color-b" v-text="item.trolleySku.name" />
                  <div v-text="item.trolleySku.model" />
                  <div class="color-b">
                    ￥{{ item.trolleySku.actualPrice }}
                    <span style="float:right;margin-right:40px" v-text="'x' + item.trolleySku.quantity" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col class="item" :span="12">
          <div style="margin-left:30px">
            <a-row>
              <a-col :span="12" style="margin-bottom:15px">
                提货方式：
                <span class="color-green" v-text="item.trolley.stockOut" />
              </a-col>
              <a-col :span="12">
                提货位置：<span class="color-b" v-text="item.trolley.pickStoreCode" />
              </a-col>
            </a-row>
            <div style="margin-bottom:10px;">
              <a-icon type="user" class="mr-10" />
              <span class="color-b" >
                {{ item.trolley.consigneeName }}
                <span class="mr-10" v-text="item.trolley.consigneeTelephone" />
              </span>
            </div>
            <div>
              <a-icon type="pushpin" class="mr-10" />
              <span class="color-b" v-text="item.trolley.consigneeAddress + item.trolley.consigneeAddressDetail " />
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="footer">
        <!-- <div class="left all-checked">
          全选 <a-checkbox @change="handleAllChecked" />
        </div> -->
        <div class="left">
          收款金额：<span v-text="totalPrices_1" class="total" />
        </div>
        <div class="right">
          <a-button type="primary" @click="submit">收款</a-button>
        </div>
      </div>
    </a-card>
    <!-- 付了定金 -->
    <a-card style="margin-top:12px" v-if="depositList.length>0" >
      <div slot="title">
        <span style="color:rgba(144,147,153,1);">顾客：</span>
        <span> {{ customer.name }} </span>
      </div>
      <span class="tag" slot="extra">定金收款</span>
      <a-row
        class="item-box"
        v-for="(item, i) in depositList"
        :key="i" >
        <a-col class="item" :span="24">
          <div style="display:flex">
            <a-radio class="check" :checked="currentChecked===item.trolley.code" @change="depositChange(item)"/>
            <div style="flex: 1">
              <a-row style="margin-bottom:10px">
                <a-col :span="12" >单号：{{ item.trolleySku.shoppingTrolleyId }}</a-col >
                <a-col :span="12" class="guide">导购：{{ item.trolley.guideName }} </a-col>
              </a-row>
              <div style="display:flex;">
                <img class="img" :src="item.trolleySku.picture" alt="" />
                <div style="flex: 1">
                  <div class="color-b" v-text="item.trolleySku.name" />
                  <div v-text="item.trolleySku.model" />
                  <div class="color-b">
                    ￥{{ item.trolleySku.actualPrice }}
                    <span style="float:right;margin-right:40px" v-text="'x' + item.trolleySku.quantity" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <div class="footer">
        <div class="left">
          收款金额：<span v-text="totalPrices_2" class="total" />
        </div>
        <div class="right">
          <a-button type="primary" @click="depositSubmit">收款 </a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            checked: [],
            currentChecked: ''// 已付定金当前选中项
        }
    },
    computed: {
        totalPrices_1 () {
            return '￥' + this.checked.reduce((total, item) => {
                return total + item.trolleySku.actualPrice * item.trolleySku.quantity
            }, 0)
        },
        totalPrices_2 () {
            const currentItem = this.depositList.find(v => v.trolley.code === this.currentChecked)
            return currentItem ? currentItem.trolleySku.actualPrice : 0
        },
        checkedCodes () {
            return this.checked.map(v => v.trolley.code)
        },
        customer () {
            return this.data.customer || {}
        },
        nonDepositList () {
            return this.data.nonDepositList
        },
        depositList () {
            return this.data.depositList
        }
    },
    methods: {
        isChecked (item) {
            return this.checkedCodes.includes(item.trolley.code)
        },
        submit () {
            this.$emit('queryOrderInfo', { orderCodes: this.checkedCodes })
        },
        depositSubmit () {
            this.$emit('queryOrderInfo', { orderCodes: [this.currentChecked], ifDeposit: true })
        },
        handleAllChecked () {
            this.checked = this.checked.length > 0 ? [] : this.nonDepositList
        },
        depositChange (item) {
            this.currentChecked = item.trolley.code
        },
        change (e) {
            let hasItem = false
            this.checked.find((v, i) => {
                if (v.trolley.code === e.trolley.code) {
                    // 如果当前项已被选中 则取消选中
                    this.checked.splice(i, 1)
                    hasItem = true
                    return true
                }
            })
            !hasItem && this.checked.push(e)
        },
        focusChange (e, callback) {
            const isHas = ['ant-checkbox-input', 'ant-radio-input'].includes(e.target.className)
            if (isHas) {
                callback()
                e.path[5].classList.add('border')
            } else {
                callback()
            }
        }
    },
    beforeDestroy () {
        document.body.removeEventListener('focus', this.focusChange)
    },
    mounted () {
        this.$nextTick(() => {
            const cardBody = document.getElementsByClassName('ant-card-body')
            const removeAll = () => Array.from(cardBody).forEach(el => {
                Array.from(el.childNodes).forEach(childEl => {
                    childEl.classList.remove('border')
                })
            })
            document.body.addEventListener('focus', (e) => {
                this.focusChange(e, removeAll)
            }, true)
        })
    }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-body {
  padding: 0;
}

/deep/.ant-card-head {
  background: rgba(245, 247, 250, 1);
  min-height: 30px;
  font-size: 12px;
  padding-left:12px;
  padding-right: 20px;
  border-radius: 4px 4px 0 0;
}
/deep/.ant-card-head-title {
 padding: 6px 0
}
/deep/ .ant-card-extra{
    padding: 6px 0
}
/deep/.ant-radio-inner{
    border-radius: 0
}
.border {
  border-radius: 4px;
  border: 1px dotted #408bff !important;
}
.guide{
    text-align:right;
    padding-right:20px
}
.tag {
  padding: 0 5px;
  width: 60px;
  height: 20px;
  border-radius: 1px;
  font-size: 12px;
  color: rgba(255, 85, 51, 1);
  border: 1px solid rgba(255, 85, 51, 1);
}
.total {
  font-size: 20px;
  font-weight: 500;
  color: rgba(255, 85, 51, 1);
}
.check {
  height: 90px;
  padding: 0 12px;
  line-height: 90px;
}
.mr-10 {
  margin-right: 10px;
}
.color-b {
  color: rgba(48, 49, 51, 1);
}
.color-green {
  color: rgba(119, 179, 0, 1);
}
.item {
  font-size: 12px;
  color: rgba(144, 147, 153, 1);
  font-family: PingFangSC;
  font-weight: 400;
  height: 90px;
  .img {
    width: 60px;
    height: 60px;
    margin-right: 12px;
  }
}
.item-box {
  padding: 10px 0;
  border: 1px solid  transparent ;
  border-bottom: 1px solid #e8e8e8;
}
.footer {
  height: 39px;
  line-height: 39px;
  border-top: none;
  padding: 0 12px;
  .all-checked {
    margin-left: -8px;
    margin-right: 5px;
  }
  .right {
    float: right;
  }
  .left {
    height: 39px;
    line-height: 39px;
    float: left;
  }
}
</style>

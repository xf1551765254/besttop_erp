<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-12 15:08:44
 * @LastEditors: haile
 * @LastEditTime: 2019-07-12 17:05:34
 -->
<template>
  <div class="box">
    <a-checkbox-group @change="bindChange" v-model="bindArr" :disabled="disableOpt">
      <a-card v-for="(item,index) in group.bindGoods" :key="index">
        <div class="bind-box">
          <div class="check-box">
            <a-checkbox :value="item.skuCode"></a-checkbox>
          </div>
          <div class="goods-box">
            <div class="img-box">
              <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
            </div>
            <div class="goods-info">
              <p>{{ item.skuCode }}</p>
              <p>{{ item.skuName }}</p>
              <p>{{ initPrice(item.priceDisc) }}</p>
            </div>
            <div class="goods-quantity">
              x{{ item.quantity }}
            </div>
          </div>
        </div>
      </a-card>
    </a-checkbox-group>
  </div>
</template>

<script>
import { axios } from '@/utils/request'

export default {
    name: 'BindGoods',
    props: {
        goodsInfo: {
            type: Object,
            default: () => {}
        },
        initData: {
            type: Array,
            default: () => []
        },
        disableOpt: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            bindArr: [],
            group: {}
        }
    },
    mounted () {
        console.log('---------------------------------------', this.goodsInfo)
        this.queryBindingGoods()
    },
    methods: {
        bindChange () {
            if (this.disableOpt) {
                this.$message.warning('当前页面不允许此操作')
                return false
            } else {

            }
        },
        queryBindingGoods () {
            const self = this
            axios({
                path: 'GroupDefineQueryBindingGoods',
                method: 'POST',
                body: {
                    skuCode: self.goodsInfo.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询捆绑商品', res.data)
                    const data = res.data
                    this.group = data
                }
            })
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }
}
</script>

<style lang="less" scoped>
/deep/.ant-card-body {
  padding: 10px;
  .bind-box {
    display: flex;
    height: 100px;
    .check-box{
      width: 30px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .goods-box {
      display: flex;
      flex: 1;
      .img-box{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 90px;
        line-height: 90px;
        margin: 10px;
      }
      .goods-info{
        padding-top: 10px;
        flex:8;
        p{
          margin-bottom: 12px;
          font-weight: 700;
        }
      }
      .goods-quantity{
        flex:2;
        height:100px;
        line-height: 100px;
      }
    }
  }
}
</style>

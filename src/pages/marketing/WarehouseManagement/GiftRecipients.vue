<!--
 * @Description: 赠品领用
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-02 14:25:42
 * @LastEditors: lin
 * @LastEditTime: 2019-08-20 19:09:26
 -->
<template>
  <div style="padding:0 100px">
    <a-row style="">
      <a-col :span="16">
        <a-input-search
          placeholder="请输入小票号码（或扫描小票）"
          @search="onSearch">
        </a-input-search>
      </a-col>
    </a-row>
    <!-- 赠品信息 -->
    <div style="padding:10px 0">
      <a-row style="font-size:16px;font-weight:700;margin-bottom:5px;">赠品信息</a-row>
      <a-card :bodyStyle="{padding:'10px 15px'}" v-if="Object.keys(goodsData).length!==0">
        <a-row>票据号码：{{ seachValue }}</a-row>
        <!-- 商品 -->
        <a-row style="margin-top:10px">
          <a-col :span="20">
            <div style="float:left">
              <img
                v-if="goodsData.picture"
                :src="goodsData.picture"
                alt=""
                height="90"
                width="110"
                :onerror="defaultImgUrl">
              <img
                v-else
                class=""
                alt="example"
                height="90"
                width="110"
                style="height:90px"
                src="@assets/goods.png" />
            </div>
            <div style="" class="goodsRight">
              <div style="">
                <div>{{ `${goodsData.skuCode}-${goodsData.skuName}` }}
                </div>
                <div>{{ goodsData.skuModel }}</div>
              </div>
              <div>零售价：￥{{ goodsData.skuPrice }}</div>
            </div>
          </a-col>
          <a-col :span="4" style="text-align:right;height:90px;line-height:90px">{{ goodsData.skuQuantity }}</a-col>
        </a-row>
        <a-row style="margin-top:10px">
          备注：{{ goodsData.note }}
          <div style="height：auto"></div>
        </a-row>
      </a-card>
      <a-card v-else style="text-align:center">
        暂无商品数据
      </a-card>
      <a-row style="text-align:right" class="Btnfooter">
        <a-button type="primary" @click="confirm" >确认领用</a-button>
      </a-row>
    </div>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
export default {
    name: 'GiftRecipients',
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            goodsData: {},
            loading: false,
            seachValue: ''
        }
    },
    mounted () {
        for (const key in this.goodsData) {
            delete this.goodsData[key]
        }
    },
    methods: {
        onSearch (value) {
            this.loading = false
            axios({
                path: 'ScheduleGiftQueryReceiveGift', // 接口path名，必传
                method: 'post',
                body: {
                    code: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.seachValue = value
                    this.loading = true
                    this.goodsData = { ...res.data }
                }
            })
        },
        confirm () {
            const _this = this
            if (Object.keys(this.goodsData).length === 0) {
                this.$message.warning('请进行小票查询')
                return
            }
            this.$confirm({
                title: '提示',
                content: '是否确认领用?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduleGiftReceiveGift', // 接口path名，必传
                        method: 'post',
                        body: {
                            code: _this.seachValue
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            // for (const key in this.goodsData) {
                            //     delete this.goodsData[key]
                            // }
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        }

    }
}
</script>
<style lang="less" scoped>
.Btnfooter{
   position: fixed;
   bottom:45px;
   right:10px;
 }
 .goodsRight{
   margin-left:120px;
   height: 90px;
   display: flex;
   display: -webkit-flex;
    flex-direction:column;
    -webkit-flex-direction: column;
-webkit-justify-content: space-between;
    justify-content: space-between;
 }
</style>

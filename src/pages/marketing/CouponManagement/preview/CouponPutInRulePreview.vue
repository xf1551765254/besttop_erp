<!--
 * @Description: 促销券投放规则
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-12 13:58:17
 * @LastEditors: lin
 * @LastEditTime: 2019-08-12 16:22:04
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="促销券投放规则"
      :orderId="orderId" >
      <div slot="A" title="投放规则信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">规则名称：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.name }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">投放范围：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.publishRangeName }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">投放方式：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.publishWayName }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">状态：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.statusName }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.startTime }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.endTime }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">备注：</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-tooltip placement="topLeft" >
              <template slot="title">
                <span>{{ previewForm.note }}</span>
              </template>
              <span class="text"> {{ previewForm.note }}</span>
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
      <div slot="B" title="促销券信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">促销券类型：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ `${previewForm.couponType}-${previewForm.typeName}` }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">券金额：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.couponAmount }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">券销售金额：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.couponSalePrice }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">投放总量：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.publishQuantity }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">每人限领：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.publishMaxQuantity }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">券开始日期：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.couponStartTime }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">券结束日期：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.couponEndTime }}</a-col>
        </a-row>
      </div>
      <div slot="C" title="赠送信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">是否允许赠送：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewForm.ifSend?'是':'否' }}</a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewForm.ifSend">赠送总量：</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="previewForm.ifSend"> {{ previewForm.sendQuantity }}</a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewForm.ifSend">赠送限领：</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="previewForm.ifSend"> {{ previewForm.sendMaxQuantity }}</a-col>
        </a-row>
      </div>
      <div slot="D" title="分享信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">是否允许分享：</a-col>
          <a-col :sm="16" :md="8" :xl="5" > {{ previewForm.ifShare?'是':'否' }}</a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewForm.ifShare">分享标题：</a-col>
          <a-col :sm="16" :md="8" :xl="13" v-if="previewForm.ifShare"> {{ previewForm.shareTitle }}</a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3" v-if="previewForm.ifShare">分享图片：</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto" v-if="previewForm.ifShare">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              disabled>
              <div @click="previewVisibleIMG=true">
                <img
                  v-if="previewForm.sharePicture"
                  eight="90"
                  width="110"
                  :src="previewForm.sharePicture"
                  alt="avatar"
                  :onerror="defaultImgUrl"/>
                <img
                  v-else
                  class=""
                  alt="example"
                  height="90"
                  width="110"
                  style="height:90px"
                  src="@assets/goods.png" />
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisibleIMG"
              :footer="null"
              :bodyStyle="{padding:'40px', maxWidth:'800px'}"
              destroyOnClose
              @cancel="previewVisibleIMG=false">
              <img alt="example" style="width: 100%" :src="previewForm.sharePicture" />
            </a-modal>
          </a-col>
        </a-row>
      </div>
    </Preview>
  </div>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
export default {
    components: { Preview },
    props: {
        value: {
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
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            previewVisibleIMG: false,
            previewVisbel: false,
            previewTags: [],

            previewForm: {}

        }
    },
    methods: {
        detailsSumbit () {
            axios({
                path: 'ScheduPublishQueryDetail',
                method: 'post',
                body: {
                    code: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = { ...res.data }
                    this.previewForm = { ...detailData }
                    this.previewVisbel = true
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>
<style lang="less">
.text{
    display : inline-block;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space : nowrap;
    width : 100%;
    text-align: left;
    font-weight: normal;
    padding-left: 10px;
    font-size: 12px;
    }
</style>

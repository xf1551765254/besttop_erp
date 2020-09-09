<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-05 09:52:40
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-23 14:58:45
 -->
<template>
  <div class="box">
    <bt-modal
      :title="title"
      :subBtn="false"
      :popconfirm="false"
      v-model="previewVisbel">
      <div class="boxHead">
        <div class="headTop">
          <div class="headTopSKu">
            <div class="headImg">
              <img :src="pams.skuImg" alt="找不到图片" v-if="pams.skuImg" :onerror="defaultImgUrl">
              <img src="@assets/goods.png" v-else>
            </div>
            <div class="headDetail">
              <div class="skuContent">
                <span>{{ pams.skuName }}</span>
                <span>{{ pams.skuCode }}</span>
              </div>
              <div >
                <span style="margin-right: 10px">{{ pams.skuModel }}</span>
                <span v-if="pams.deliveInstall">是否送按一体: {{ pams.deliveInstall }}</span>
              </div>
              <div>数量: {{ pams.skuNum }}</div>
            </div>
          </div>
          <div class="headTopSite">
            <pre> <a-icon type="user" /> {{ pams.custName }}  {{ pams.custPhone }}</pre>
            <pre> <a-icon type="environment" style="color: red" /> {{ pams.custAddr }}</pre>
          </div>
        </div>
        <div class="headBottom">
          <a-row class="doc boxRow">
            <a-col
              :sm="12"
              :md="8"
              :xl="6"
              class="boxCol"
              v-for="(item, index) in pams.list"
              :key="index"
              v-if="item.code">
              <pre>{{ `${item.name}:${item.code}` }}</pre>
            </a-col>
          </a-row>
          <a-row>
            <a-col>备注:{{ pams.note }}</a-col>
          </a-row>
        </div>
      </div>
      <div class="StateTracking">
        <a-timeline>
          <a-timeline-item v-for="(item, index) in pams.deliveryStatusList" :key="index" class="timelines">
            <div class="stateCur">
              <div class="stateHead">
                <span>{{ item.typeValue }}</span>
                <span>{{ item.createTime }}</span>
                <span>{{ item.happenType }}</span>
              </div>
              <div class="stateNav">
                <div v-if="item.imgUrl" class="stateImg" @click="openImg(item.imgUrl)"><img :src="item.imgUrl" :onerror="defaultImgUrl"></div>
                <div class="driver">
                  <!-- <pre>司机: {{ item.driverName }}  司机手机号: {{ item.driverPhone }}  配送车辆:{{ item.vehicle }}</pre> -->
                  <span v-if="item.driverName">司机:{{ item.driverName }}</span>
                  <span v-if="item.phone">司机手机号:{{ item.phone }}</span>
                  <span v-if="item.vehicle">配送车辆:{{ item.vehicle }}</span>
                  <div v-if="item.note">备注: {{ item.note }}</div>
                </div>
              </div>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </bt-modal>
    <a-modal v-model="imgVisbel" :footer="null" :mask="false" class="imgModal" :closable="false">
      <div class="feedbackImg">
        <img :src="image" alt="暂无图片">
      </div>
    </a-modal>
  </div>
</template>
<script>
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
export default {
    components: { BtModal },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '详情'
        },
        pams: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            image: '',
            imgVisbel: false,
            skuImg: false,
            previewVisbel: false,
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"'
        }
    },
    methods: {
        openImg (e) {
            console.log(e)
            if (e) {
                this.image = e
                this.imgVisbel = true
            } else {
                this.$message.warning('暂无图片!')
            }
        },
        async onSeach () {
            const res = await axios({
                path: 'BillDeliverQueryDeliverLog',
                mounted: 'post',
                body: {
                    deliverCode: this.$props.pams.code
                }
            })
            if (res.flag === 1) {
                const data = res.data.list
                for (const i of data) {
                    i.vehicle = this.pams.vehicle
                }
                data.unshift({
                    typeValue: this.pams.statusName,
                    note: this.pams.note
                })
                this.pams.deliveryStatusList = [...data]
                this.previewVisbel = true
                console.log(res.data, '获取状态信息')
            }
        }
    },
    watch: {
        value (val) {
            if (val && this.pams.code) {
                this.onSeach()
            }
        },
        previewVisbel (val) {
            if (!val) {
                this.$emit('input', val)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.box {
    .ant-modal-body {
        padding: 0;
    }
    .boxHead {
        border: 1px solid #ccc;
        border-bottom: 0;
        font-size: 12px;
        .headTop {
            height: 50%;
            overflow: hidden;
            border-bottom: 1px solid #ccc;
            .headTopSKu {
                width: 600px;
                height: 100%;
                float: left;
                border-right: 1px solid #ccc;
                .headImg {
                    width: 90px;
                    height: 90px;
                    margin: 10px;
                    display: inline-block;
                    img {
                        width: 100%;
                        height: 100%;
                        padding: 0;
                        margin: 0;
                        display: inline-block;
                    }
                }
                .headDetail {
                    font-size: 12px;
                    display: inline-block;
                    vertical-align: middle;
                    .skuContent {
                        span {
                            margin-right: 20px;
                        }
                    }
                    div {
                        margin-bottom:10px;
                    }
                }
            }
            .headTopSite {
                width: 100%;
                height: 100%;
                font-size: 12px;
                padding-top: 17px;
                padding-left:600px;
            }
        }
        .headBottom {
            height: 50%;
            padding: 0 10px;
            font-size: 12px;
            .boxRow {
                .boxCol {
                    margin-bottom: 0;
                }
            }
        }
    }
    .StateTracking {
        height: 450px;
        padding: 10px;
        min-width: 700px;
        overflow-y: auto;
        border: 1px solid #ccc;
        .timelines {
          padding-bottom: 0;
        }
        .stateCur {
          width:100%;
          height: 80px;
          font-size: 12px;
          .stateHead {
            height: 24px;
            padding: 0 5px;
            span {
              margin-right: 10px;
              &:nth-child(1) {
                font-weight:700;
                font-size: 14px;
              }
            }
          }
          .stateNav {
            height: 50px;
            padding: 5px;
            .stateImg {
              width: 40px;
              height: 40px;
              display: inline-block;
              margin-right: 5px;
              img {
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                display: inline-block;
              }
            }
            .driver {
              width:95%;
              display: inline-block;
              vertical-align: middle;
              span {
                margin-right: 10px;
              }
              div {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                text-overflow:ellipsis;
              }
            }
          }
        }
    }
}
.imgModal {
  .feedbackImg {
    width: 100%;
    img {
      display: inline-block;
      width: 100%;
    }
  }
}

</style>

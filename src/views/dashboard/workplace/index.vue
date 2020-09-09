<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-15 15:35:16
 -->
<template>
  <div class="workplace">
    <div class="header">
      <div class="avatar">
        <a-avatar :src="avatar" class="img" />
        <div class="job">{{ userInfo.name }}</div>
      </div>
      <div class="welcome">
        <div>{{ welcome }}</div>
        <span>{{ userInfo.code }}</span>
      </div>
      <a-divider type="vertical" />
      <div class="notice">
        <img class="img" :src="noticeContent.pic || avatar" alt="公告封面" />
        <div class="right">
          <h2 class="notice-title">
            <span>{{ noticeContent.name }}</span>
            <a style="float:right" @click="noticeSaveClicks">查看详情 ></a>
          </h2>
          <div class="notice-content" v-html="noticeContent.content" />
        </div>
      </div>
    </div>
    <a-row>
      <a-col
        :span="showRightCard ? 19 : 24"
        :style="{ paddingRight: showRightCard ? '30px' : '26px' }" >
        <Card title="待处理" style="height:258px;margin-bottom:14px">
          <a-col :span="4" class="card-item" @click="jump">
            <a-row type="flex">
              <a-col :span="12">
                <div class="title">采购资金</div>
                <div class="status">未审核</div>
              </a-col>
              <a-col class="num" :span="12">80</a-col>
            </a-row>
          </a-col>
        </Card>
        <Card title="提示/预警" style="height:270px;margin-bottom:14px">
          <a-row :gutter="22">
            <a-col :span="12">
              <a-row class="hint hint-left" type="flex" justify="center">
                <a-col :span="8" class="one">
                  <span>合同到期天数</span>
                  <div class="btn">30</div>
                </a-col>
                <a-col :span="8">
                  <div class="num">80</div>
                  <span class="text">自营合同</span>
                </a-col>
                <a-col :span="8">
                  <div class="num">80</div>
                  <span class="text">联营合同</span>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <a-row class="hint hint-right" type="flex" justify="center">
                <a-col :span="12" class="one">
                  <span>预收货到期天数</span>
                  <div class="btn">30</div>
                </a-col>
                <a-col :span="12">
                  <div class="num">80</div>
                  <span class="text">采购订单</span>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </Card>
      </a-col>
      <span
        @click="toggleMenu"
        :class="['btn-toggle', showRightCard ? 'right' : 'left']" >
        <template v-if="showRightCard">
          |<a-icon type="caret-right" />
        </template>
        <template v-else>
          <a-icon type="caret-left" />|
        </template>
      </span>
      <a-col :span="showRightCard ? 5 : 0" class="menu-nav">
        <Card title="菜单导航">
          <a-button
            slot="extra"
            type="primary"
            @click="showTreeModal(true)"
          >设置</a-button >
          <h3>模块名称</h3>
          <a-button type="primary" ghost>Primary</a-button>
        </Card>
      </a-col>
    </a-row>
    <TreeModal :visible="visible" @close="showTreeModal(false)" />
    <a-modal
      :getContainer="() => $el"
      wrapClassName="modal-notice"
      style="width:60vw"
      title="公告详情"
      :footer="null"
      v-model="showNoticeDetails"
    >
      <div class="details">
        <span class="label">标题:</span>
        <span class="text" v-text="noticeContent.name"/>
      </div>
      <div class="details">
        <span class="label">内容:</span>
        <span class="text" v-html="noticeContent.content" />
      </div>
      <div class="readCount">阅读量：{{ readCount }} </div>
    </a-modal>
  </div>
</template>

<script>

import Card from '../component/Card'
import TreeModal from './TreeModal'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'

export default {
    name: 'Workplace',
    components: {
        Card,
        TreeModal
    },
    computed: {
        ...mapGetters(['userInfo', 'welcome']),
        avatar () {
            return this.$store.getters.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        }

    },
    data () {
        return {
            showRightCard: true,
            showNoticeDetails: false,
            noticeContent: {},
            pending: {},
            warning: {},
            visible: false,
            menus: [],
            readCount: 0
        }
    },
    created () {
        axios({ path: 'SysNoticeFindNotice' }).then(({ data, flag }) => {
            if (flag) {
                this.noticeContent = data
                this.readCount = data.readCount
            }
        })
    },
    mounted () { },
    methods: {
        jump (path) {
            this.$router.push({
                path,
                params: {}
            })
        },
        showTreeModal (state) {
            this.visible = state
        },
        noticeSaveClicks () {
            this.showNoticeDetails = true
            this.readCount += 1
            axios({
                path: 'SysNoticeSaveClicks',
                body: { id: this.noticeContent.id }
            })
        },
        toggleMenu () {
            this.showRightCard = !this.showRightCard
        }
    }
}
</script>

<style lang="less" scoped>
.notice {
  display: flex;
  flex: 1;
  // margin: -35px 0 12px 29px;
  .img {
    width: 100px;
    height: 100px;
  }
  .right {
    flex: 1;
    margin-left: 15px;
  }
}

.notice-title {
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(48, 49, 51, 1);
  line-height: 20px;
  a {
    font-size: 12px;
  }
}
.notice-content {
  height: 34px;
  font-size: 12px;
  font-family: PingFangSC;
  font-weight: 400;
  color: rgba(144, 147, 153, 1);
  line-height: 17px;
}
.readCount{
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size:12px;
    font-family:PingFangSC;
    font-weight:400;
    color:rgba(144,147,153,1);
    line-height:17px;
}
/deep/.modal-notice {
  .details {
    font-size: 12px;
    font-family: PingFangSC;
    display: flex;
    margin-bottom: 20px;
    .label {
      white-space: nowrap;
      margin-right: 20px;
    }
    .text {
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
    }
  }
  .ant-modal {
    width: 60vw !important;
    position: relative;
  }
}
/deep/ .ant-btn {
  width: 100%;
  height: 35px;
  border-radius: 4px !important;
}
/deep/ .ant-card-head {
  height: 40px;
  .ant-card-extra {
    padding: 0;
  }
  .ant-btn {
    height: 30px;
  }
}
/deep/ .ant-divider-vertical {
  height: 80%;
}
/deep/ .ant-table-content {
  border-radius: 4px;
  border: 1px solid rgba(225, 228, 235, 1);
  .ant-table-row {
    td {
      padding: 14px 16px;
    }
  }
}
.workplace {
  margin: 19px 20px 29px;
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
    height: 140px;
    line-height: 140px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    .avatar {
      margin-left: 40px;
      margin-right: 20px;
      .img {
        margin: 0 auto;
        display: block;
        width: 80px;
        height: 80px;
      }
      .job {
        position: relative;
        top: -10px;
        line-height: 24px;
        padding: 3px 16px 4px;
        font-size: 12px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(24, 144, 255, 1);
        background: rgba(255, 255, 255, 1);
        border-radius: 15px;
        border: 1px solid rgba(24, 144, 255, 1);
      }
    }

    .welcome {
      width: 320px;
      height: 90px;
      font-size: 30px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
      line-height: 42px;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(144, 147, 153, 1);
      }
    }
  }
  .btn-toggle {
    cursor: pointer;
    position: relative;
    z-index: 100;
    margin-left: -26px;
    margin-top: 300px;
    float: left;
    width: 26px;
    height: 68px;
    line-height: 68px;
    text-align: center;
    color: #ccc;
    background: rgba(255, 255, 255, 1);
    border-radius: 15px 0px 0px 15px;
  }
  .left {
    border-radius: 0 15px 15px 0;
  }
  .right {
    border-radius: 15px 0px 0px 15px;
    overflow: hidden;
  }
  .hint {
    color: #fff;
    text-align: center;
    height: 180px;
    box-shadow: 0px 0px 14px 0px rgba(250, 53, 93, 0.3);
    .text {
      font-size: 12px;
    }
    border-radius: 4px;
    .num {
      margin: 42px auto 21px;
      height: 68px;
      line-height: 68px;
      font-size: 68px;
    }
    .one {
      margin-top: 61px;
      .btn {
        text-align: center;
        width: 80%;
        margin: 10px auto 0;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 1);
      }
    }
  }
  .hint-left {
    background: linear-gradient(
      317deg,
      rgba(250, 51, 92, 1) 0%,
      rgba(255, 178, 132, 1) 100%
    );
  }
  .hint-right {
    background: linear-gradient(
      317deg,
      rgba(80, 91, 247, 1) 0%,
      rgba(55, 189, 246, 1) 100%
    );
  }

  .card-item {
    height: 80px;
    cursor: pointer;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 10px 0px rgba(6, 125, 236, 0.15);
    border-radius: 4px;
    padding: 12px 20px;
    text-align: center;
    .title {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(48, 49, 51, 1);
      line-height: 20px;
      margin-bottom: 12px;
    }
    .status {
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 85, 51, 1);
      line-height: 17px;
    }
    .num {
      text-align: center;
      font-size: 50px;
      font-family: HiraMaruPro-W4;
      font-weight: normal;
      color: rgba(24, 144, 255, 1);
      line-height: 56px;
    }
  }
  .menu-nav {
    position: relative;
    height: 680px;
    background: #fff;
    // overflow: auto;
  }
}
</style>

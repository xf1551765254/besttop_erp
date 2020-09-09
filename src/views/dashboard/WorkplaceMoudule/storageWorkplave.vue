<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-12 09:40:19
 -->
<template>
  <page-layout :avatar="avatar">
    <div class="heard-box detail">
      <div class="main">
        <div class="row">
          <div v-if="avatar" class="avatar">
            <a-avatar :src="avatar"/>
          </div>
          <div class="headerContent">
            <div class="title">{{ timeFix }}，{{ userInfo.name }}<span class="welcome-text">，{{ welcome() }}</span></div>
            <!-- <div>{{ `未知岗位 | ${config.user} - 未知机构 - ${$store.getters.storeInfo.name}` }}</div> -->
            <div>{{ $store.getters.storeInfo.name || '未知机构' }}</div>
          </div>
          <div class="extra">
            <h3>公告标题
              <a-button icon="plus" size="small" style="float: right;">更多</a-button>
            </h3>
            <div class="extraTitle">本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！本系统正在努力升级中！</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <a-row class="content_t">
        <a-col class="content_left" :span="this.flagShowHidden?'24':'19'">
          <div class="content_icon" @click="contentIconFun">
            <a-icon class="icon_right" style="color: #fff;" :type="this.flagShowHidden?'left':'right'" />
          </div>
          <div class="table_top">
            <h3>待处理(12)</h3>

          </div>
          <div class="table_bottom">
            <h3>预警提示(13)</h3>
          </div>
        </a-col>
        <a-col class="content_right" :span="this.flagShowHidden?'0':'5'">
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>
<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import PageLayout from '@/components/page/PageLayout'
import config from '@/config/defaultSettings'
export default {
    name: 'StorageWorkplave',
    components: {
        PageLayout
    },
    data () {
        return {
            timeFix: timeFix(),
            config,
            flagShowHidden: false
        }
    },
    created () {

    },
    mounted () {

    },
    computed: {
        userInfo () {
            return this.$store.getters.userInfo
        },
        avatar () {
            return this.$store.getters.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        }
    },
    methods: {
        ...mapGetters(['name', 'welcome']),
        contentIconFun () {
            this.flagShowHidden = !this.flagShowHidden
        }
    }
}
</script>

<style lang="less" scoped>
// 内容区域
.content_t{
    height: 900px;
    margin: 0 15px;
    .content_left{
        height: 900px;
        position: relative;
        .content_icon{
            position: absolute;
            right: 0;
            top: 50%;
            bottom: 50%;
            width: 25px;
            height: 40px;
            background: #999999;
            border-radius: 20px 0px 0px 20px;
            .icon_right{
                margin: 13px 10px 10px 10px;
            }
        }
        .table_top{
            height: 450px;
            overflow: auto;
            padding: 10px;
        }
        .table_bottom{
            height: 450px;
            overflow: auto;
            padding: 10px;
        }

    }
    .content_right{
        height: 900px;
        background: #999999;
    }
}
//用户信息部分
.heard-box{
    background: #fff;
    padding: 16px 32px 0;
    border-bottom: 1px solid #e8e8e8;
}
.detail {
        display: flex;
        .avatar {
            flex: 0 1 72px;
            margin: 0 24px 8px 0;
            transition: all 10s;
            & > span {
                border-radius: 72px;
                display: block;
                width: 72px;
                height: 72px;
            }
        }
        .avatar:hover{
            transform: rotate(10turn)
        }
        .main {
            width: 100%;
            flex: 0 1 auto;
            .row {
                display: flex;
                width: 100%;
                .avatar {
                    margin-bottom: 16px;
                }
            }
            .title {
                font-size: 20px;
                font-weight: 500;
                font-size: 20px;
                line-height: 28px;
                font-weight: 500;
                color: rgba(0,0,0,.85);
                margin-bottom: 16px;
                flex: auto;
            }
            .logo {
                width: 28px;
                height: 28px;
                border-radius: 4px;
                margin-right: 16px;
            }
            .content, .headerContent {
                flex: auto;
                color: rgba(0,0,0,.45);
                line-height: 22px;

                .link {
                    margin-top: 16px;
                    line-height: 24px;

                    a {
                        font-size: 14px;
                        margin-right: 32px;
                    }
                }
            }
            .extra {
                flex: 0 1 auto;
                width: 550px;
                height: 90px;
                font-family:PingFangSC-Regular;
                color: rgba(0, 0, 0, 0.45);
            }
            .extraTitle{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
                font-size: 12px;
            }
            .action {
                margin-left: 56px;
                min-width: 266px;
                flex: 0 1 auto;
                text-align: right;
                &:empty {
                display: none;
                }
            }
        }
    }
</style>

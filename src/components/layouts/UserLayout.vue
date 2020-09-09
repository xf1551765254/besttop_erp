<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-11 17:56:18
 -->
<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <div class="top">
      <div class="header">
        <a href="/">
          <img src="~@/assets/new_logo.svg" class="logo" alt="logo">
          <span class="title">贝图{{ config.system }}</span>
        </a>
      </div>
      <!-- <div class="desc">
        BestTop 是先进的企业级平台打造商
      </div> -->
    </div>
    <div class="init-db-box" @click.stop="initDBBTN"></div>
    <div class="init-url-box" @click.stop="chooseUrl"></div>
    <a-col :span="24" class="container">
      <a-col :sm="24" :md="16" :xl="16" :xxl="14">
        <div class="leftMainFir">{{ `致力于打造最好的${config.system}` }}</div>
        <div class="leftMainSec">重塑体验、智慧运营、开放互联、洞察认识、敏捷创新</div>
      </a-col>
      <a-col :sm="24" :md="8" :xl="8" :xxl="10">
        <route-view></route-view>
      </a-col>
    </a-col>
    <div class="footer">
      <div class="links">
        <a href="_self">帮助</a>
        <a href="_self">隐私</a>
        <a href="_self">条款</a>
      </div>
      <div class="copyright">
        Copyright &copy; 2019 {{ config.Author }} {{ config.Version }}
      </div>
    </div>
    <a-modal
      v-model="urlVis"
      @ok="inputUrl"
      title="修改服务器API"
      :maskClosable="false"
      :keyboard="false"
      :closable="false"
      centered>
      <a-row>
        <a-input placeholder="请输入请求URL" v-model="url"/>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import RouteView from '@/components/layouts/RouteView'
import { mixinDevice } from '@/utils/mixin.js'
import config from '@/config/defaultSettings'
import { URL } from '@/config/api.config.js'
export default {
    name: 'UserLayout',
    components: { RouteView },
    mixins: [mixinDevice],
    data () {
        return {
            config,
            urlVis: false,
            url: URL
        }
    },
    mounted () {
        document.body.classList.add('userLayout')
    },
    beforeDestroy () {
        document.body.classList.remove('userLayout')
    },
    methods: {
        initDBBTN () {
            const self = this
            self.$confirm({
                title: '提示',
                content: '确定运行初始化程序?',
                onOk () {
                    self.$idb.close()
                    indexedDB.deleteDatabase('erp_web')
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                },
                onCancel () {}
            })
        },
        chooseUrl () {
            this.urlVis = true
        },
        inputUrl () {
            this.$ls.set('SERVER_API', this.url)
            this.$message.success('设置成功，若要恢复，请安全退出！')
            this.urlVis = false
        }
    }
}
</script>

<style lang="less" scoped>
  #userLayout.user-layout-wrapper {
    height: 100%;
    .init-db-box{
        position: absolute;
        top:0px;
        left:0px;
        height: 30px;
        width:30px;
    }
    .init-url-box{
        position: absolute;
        top:0px;
        right:0px;
        height: 30px;
        width:30px;
    }
    &.mobile {
      .container {
        .main {
          max-width: 368px;
          width: 98%;
        }
      }
    }
    .top {
        height: 10%;
        display: flex;
        align-items: center;
        padding-left: 20px;
        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 23px;
            color: rgba(0, 0, 0, .85);
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }
    .container {
      width: 100%;
      min-height: 80%;
      background: #f0f2f5 url(~@/assets/background.png) no-repeat 50%;
      background-size: 80%;
      background-color: #000814;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      text-align: center;
      a {
        text-decoration: none;
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
      .leftMainFir{
        color: white;
        font-size: 40px;
      }
      .leftMainSec{
        color: white;
        font-size: 25px;
      }

    }
    .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        // padding: 0 16px;
        // margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
  }
</style>

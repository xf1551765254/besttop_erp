<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-13 14:46:36
 -->
<template>
  <div class="main" :loading="cardLoading">
    <!-- <div class="init-db-box" @click.stop="initDBBTN"></div>
    <div class="init-url-box" @click.stop="chooseUrl"></div> -->
    <a-card class="Logincard">
      <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
      >
        <a-tabs
          :activeKey="customActiveKey"
          :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
          @change="handleTabClick"
        >
          <a-tab-pane key="tab1" tab="账号密码登录">
            <a-form-item>
              <a-input
                size="large"
                type="text"
                placeholder="帐户名或邮箱地址"
                v-decorator="$check('login.username', {}, handleUsernameOrEmail)"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>

            <a-form-item>
              <a-input
                size="large"
                type="password"
                autocomplete="false"
                placeholder="密码"
                v-decorator="$check('base.password', {validateTrigger:'change'})"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
            <captcha appkey="FFFF0N000000000061C8" scene="nc_message" width="100%" @callback="onCaptcha"></captcha>
          </a-tab-pane>

          <a-tab-pane key="tab2" tab="手机号登录" disabled>
            <a-form-item>
              <a-input size="large" type="text" placeholder="手机号" v-decorator="$check('base.phone', {validateTrigger:'blur'})">
                <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="16">
                <a-form-item>
                  <a-input size="large" type="text" placeholder="验证码" v-decorator="$check('base.captcha', {validateTrigger:'blur'})">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-button
                  class="getCaptcha"
                  tabindex="-1"
                  :disabled="state.smsSendBtn"
                  @click.stop.prevent="getCaptcha"
                  v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                ></a-button>
              </a-col>
            </a-row>
            <captcha appkey="FFFF0N000000000061C8" scene="nc_message" width="100%" @callback="onCaptcha"></captcha>
          </a-tab-pane>
        </a-tabs>

        <a-form-item>
          <a-checkbox v-decorator="$check('base.rememberMe', {initialValue:false})" style="float:left;">自动登录</a-checkbox>
          <!-- <router-link
          :to="{ name: 'recover', params: { user: 'aaa'} }"
          class="forge-password"
          style="float: right;"
        >忘记密码</router-link> -->
          <a @click="$message.error('暂不支持找回密码，修改密码请登录后修改')" class="forge-password" style="float: right;">忘记密码</a>
        </a-form-item>

        <a-form-item style="margin-top:24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn || !isOnCaptcha"
          >确定</a-button>
        </a-form-item>

        <div v-if="config.miniAppId.length>0" class="user-login-other">
          <span>盘点小程序</span>
          <wechat>
            <a-icon class="item-icon" type="wechat" />
          </wechat>
          <a class="register" @click="$message.error('暂不支持注册账户')">注册账户</a>
        <!-- <router-link class="register" :to="{ name: 'register' }">注册账户</router-link> -->
        </div>
      </a-form>
    </a-card>
    <!-- <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha> -->
    <!-- <choose-store v-model="selectStoreVisible" :storeArr="storeArr" @onChange="chooseStore"/> -->
    <a-modal
      v-model="selectStoreVisible"
      @ok="selectStore"
      @cancel="selectStore(-1)"
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
      closable
      centered
    >
      <a-card title="选择登录机构" class="action-card">
        <template v-if="storeArr.length>0">
          <a-spin :spinning="spinLoading" tip="请稍后...">
            <a-card-grid class="store-action" style="width:50%;textAlign:'center'" v-for="(item, index) in storeArr" :key="index" @click="selectStore(item)">
              <a-row><span class="noselect">{{ `编号：${item.code}` }}</span></a-row>
              <a-row>
                <a-tooltip
                  placement="top"
                  :title="item.name"
                  :mouseEnterDelay="0.3"
                  arrowPointAtCenter>
                  <span class="noselect text">{{ `机构：${item.name}` }}</span>
                </a-tooltip>
              </a-row>
            </a-card-grid>
          </a-spin>
        </template>
        <template v-else>
          <a-row><span style="margin-left:120px;">您还没有可以授权登录的机构</span></a-row>
        </template>
      </a-card>
    </a-modal>
  </div>
</template>

<script>
import md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import captcha from '@/components/tools/captcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, getStore } from '@/api/login'
import wechat from './wechat'
import config from '@/config/defaultSettings'
import { axios } from '@/utils/request'
import heart from '@/utils/heartbeat'
export default {
    components: {
        TwoStepCaptcha, captcha, wechat
    },
    data () {
        return {
            config,
            customActiveKey: 'tab1',
            isOnCaptcha: false,
            selectStoreVisible: false,
            storeArr: [],
            cardLoading: false,
            spinLoading: false,
            loginBtn: false,
            // login type: 0 email, 1 username, 2 telephone
            loginType: 0,
            // requiredTwoStepCaptcha: false,
            // stepCaptchaVisible: false,
            form: this.$form.createForm(this),
            state: {
                time: 60,
                loginBtn: false,
                // login type: 0 email, 1 username, 2 telephone
                loginType: 0,
                smsSendBtn: false
            },
            IP: '',
            userCode: ''
            // urlVis: false,
            // url: 'https://8f9ada4e8570491b808fbd13af80ee4c.besttop.top'
        }
    },
    created () {
        // get2step({ })
        //     .then(res => {
        //         this.requiredTwoStepCaptcha = res.result.stepCode
        //     })
        //     .catch(() => {
        //         this.requiredTwoStepCaptcha = false
        //     })
        // this.requiredTwoStepCaptcha = true
        const self = this
        try {
            findIP(function (ip) {
                self.IP = ip
            })
        } catch (error) {
            this.$logger.error(error)
        }
    },
    methods: {
        ...mapActions(['Login', 'Logout', 'setStore']),
        /**
         * @name: 滑动认证
         * @msg:
         * @param {type}
         * @return:
         */
        onCaptcha (e) {
            this.nc = e.nc
            this.isOnCaptcha = true
        },
        // handler
        handleUsernameOrEmail (rule, value, callback) {
            const { state } = this
            const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
            if (regex.test(value)) {
                state.loginType = 0
            } else {
                state.loginType = 1
            }
            callback()
        },
        handleTabClick (key) {
            this.customActiveKey = key
            // this.form.resetFields()
        },
        handleSubmit (e) {
            e.preventDefault()
            const {
                form: { validateFields },
                state,
                customActiveKey,
                Login
            } = this

            state.loginBtn = true

            const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'rememberMe'] : ['mobile', 'captcha', 'rememberMe']
            validateFields(validateFieldsKey, { force: true }, (err, values) => {
                if (!err) {
                    const loginParams = { ...values }
                    delete loginParams.username
                    loginParams[!state.loginType ? 'email' : 'code'] = values.username
                    loginParams.password = md5(values.password)
                    loginParams.headers = { 'Erp-Ip': this.IP, Authorization: '' }
                    Login(loginParams)
                        .then(async (res) => {
                            if (res.flag === 1) {
                                this.userCode = loginParams.code
                                this.getStoreArr(res.data)
                            }
                        })
                        .finally(() => {
                            state.loginBtn = false
                            this.isOnCaptcha = false
                            this.nc.reset()
                        })
                } else {
                    setTimeout(() => {
                        state.loginBtn = false
                        this.isOnCaptcha = false
                        this.nc.reset()
                    }, 600)
                }
            })
        },
        getCaptcha (e) {
            e.preventDefault()
            const { form: { validateFields }, state } = this

            validateFields(['mobile'], { force: true }, (err, values) => {
                if (!err) {
                    state.smsSendBtn = true

                    const interval = window.setInterval(() => {
                        if (state.time-- <= 0) {
                            state.time = 60
                            state.smsSendBtn = false
                            window.clearInterval(interval)
                        }
                    }, 1000)

                    const hide = this.$message.loading('验证码发送中..', 0)
                    getSmsCaptcha({ mobile: values.mobile }).then(res => {
                        setTimeout(hide, 2500)
                        this.$notification['success']({
                            message: '提示',
                            description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                            duration: 8
                        })
                    }).catch(err => {
                        setTimeout(hide, 1)
                        clearInterval(interval)
                        state.time = 60
                        state.smsSendBtn = false
                        this.$logger.error(err)
                    })
                }
            })
        },
        chooseStore (e) {
            if (e) {
                this.loginSuccess()
            } else {
                this.Logout().then(() => {
                    this.selectStoreVisible = false
                    this.$message.error('已经退出登录')
                    this.$router.push({ name: 'login' })
                })
            }
        },
        // stepCaptchaSuccess () {
        //     this.loginSuccess()
        // },
        // stepCaptchaCancel () {
        //     this.Logout().then(() => {
        //         this.loginBtn = false
        //         // this.stepCaptchaVisible = false
        //     })
        // },
        loginSuccess () {
            this.$logger.info('初始化数据库', true)
            this.$logger.info('清空数据库', true)
            this.$idb.transaction(['api'], 'readwrite').objectStore('api').clear()
            this.$idb.transaction(['app'], 'readwrite').objectStore('app').clear()
            this.$idb.transaction(['columns'], 'readwrite').objectStore('columns').clear()
            this.$logger.info('已清空数据库', true)
            this.$router.push({ name: 'dashboard' })
            setTimeout(() => {
                this.$notification.success({
                    message: '欢迎',
                    description: `${timeFix()}，欢迎回来`
                })
            }, 1000)
            heart()
        },
        getStoreArr (user) {
            this.cardLoading = true
            getStore({ userId: this.userCode }).then(res => {
                if (res.flag === 1) {
                    this.storeArr = res.data
                    // 判断登录类型 所属机构登录
                    if (user.userInfo.loginType === 'base_user_login_type:2') {
                        const store = this.storeArr.filter(o => o.id === user.userInfo.storeId)
                        if (store.length > 0) {
                            this.selectStore(store[0])
                        } else {
                            this.storeArr = []
                            this.selectStoreVisible = true
                        }
                    } else {
                        if (this.storeArr.length === 1) {
                            this.selectStore(this.storeArr[0])
                        } else {
                            this.selectStoreVisible = true
                        }
                    }
                    return true
                }
                this.cardLoading = false
                return false
            })
        },
        selectStore (store) {
            this.spinLoading = true
            if (this.$store.getters.storeInfo && store.code === this.$store.getters.storeInfo.code) {
                this.$message.info('您当前就登录在此店！')
                this.chooseStore(false)
                this.spinLoading = false
                return
            }
            if (store === -1) {
                this.spinLoading = false
                this.chooseStore(false)
            } else {
                axios({
                    path: 'PermissionsRoleMenuQueryStoreInfo',
                    method: 'post',
                    body: { loginStoreId: store.id }
                }).then(res => {
                    if (res.flag === 1) {
                        this.setStore(store)
                        this.chooseStore(store)
                    }
                    this.spinLoading = false
                })
            }
        }
    }
}
function findIP (callback) {
    var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
    var pc = new PeerConnection({ iceServers: [] })
    var noop = function () {}
    var localIPs = {}
    var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
    function ipIterate (ip) {
        if (!localIPs[ip]) callback(ip)
        localIPs[ip] = true
    }
    pc.createDataChannel('')
    pc.createOffer().then(function (sdp) {
        sdp.sdp.split('\n').forEach(function (line) {
            if (line.indexOf('candidate') < 0) return
            line.match(ipRegex).forEach(ipIterate)
        })
        pc.setLocalDescription(sdp, noop, noop)
    })
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
        ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
    }
}
</script>

<style lang="less" scoped>
// .init-db-box{
//     position: absolute;
//     top:0px;
//     left:0px;
//     height: 30px;
//     width:30px;
// }
// .init-url-box{
//     position: absolute;
//     top:0px;
//     right:0px;
//     height: 30px;
//     width:30px;
// }
.Logincard{
    border-radius: 10px;
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

    .user-login-other {
        text-align: left;
        margin-top: 24px;
        line-height: 22px;
        .item-icon {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.2);
            margin-left: 16px;
            vertical-align: middle;
            cursor: pointer;
            transition: color 0.3s;
            &:hover {
                color: #1890ff;
            }
        }
        .register {
            float: right;
        }
    }
}
.action-card{
    margin-top:15px;
    max-height:520px;
    overflow:auto;
    .store-action:active{
        background-color: #b6b6b6;
    }
    .noselect {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .text{
        display : inline-block;
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
        width : 100%;
    }
}

</style>

<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-03-25 10:46:38
 * @LastEditTime: 2019-08-01 17:10:15
 -->
<template>
  <div>
    <a-list
      itemLayout="horizontal"
      :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>

      </a-list-item>
    </a-list>
    <!-- 修改密码模态框 -->
    <a-modal
      title="修改密码"
      v-model="resetPasswordModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="500"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="psdloading" @click="handleResetPsd">
          确定
        </a-button>
      </template>
      <a-form :form="psdForm">
        <a-row class="doc">
          <a-col :span="6">原密码</a-col>
          <a-col :span="18">
            <a-form-item>
              <a-input type="password" placeholder="请输入原密码" v-decorator="$check('updatepsd.oldPassword',{},validateToNextPassword)"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">新密码</a-col>
          <a-col :span="18">
            <a-form-item>
              <a-input
                type="password"
                placeholder="请输入新密码"
                v-decorator="$check('updatepsd.password',{},validateToNextPassword)"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">确认新密码</a-col>
          <a-col :span="18">
            <a-form-item>
              <a-input
                type="password"
                placeholder="请输入新密码"
                v-decorator="$check('base.passwordtwo',{}, compareToFirstPassword)"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :span="6">密码类型</a-col>
          <a-col :span="18">
            <a-form-item>
              <a-radio-group v-decorator="$check('updatepsd.type', {initialValue:1})">
                <a-radio :value="1">
                  登录密码
                </a-radio>
                <a-radio :value="2">
                  工作密码
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col> -->
        </a-row>
      </a-form>
    </a-modal>

    <!-- 修改邮箱 -->
    <a-modal
      title="修改邮箱"
      v-model="resetemailModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="400"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleResetEmail">
          确定
        </a-button>
      </template>
      <a-form :form="emailForm">
        <a-row class="doc">
          <a-col :span="6">邮箱</a-col>
          <a-col :span="18">
            <a-form-item>
              <a-input
                placeholder="请输入邮箱"
                v-decorator="$check('user.email',{}, validateToEmail)"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import md5 from 'md5'
export default {
    mounted () {

    },
    data () {
        return {
            data: [
                { title: '账户密码', description: '当前密码强度', value: '一般', actions: { title: '修改', callback: () => { this.chanagPasswordHandler() } } },
                // { title: '密保手机', description: '已绑定手机', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success') } } },
                // { title: '密保问题', description: '未设置密保问题，密保问题可有效保护账户安全', value: '', actions: { title: '设置', callback: () => { this.$message.error('This is a message of error') } } },
                { title: '邮箱', description: this.$store.getters.userInfo.email ? '已绑定邮箱' : '未绑定邮箱', value: this.$store.getters.userInfo.email || '', actions: { title: '修改', callback: () => { this.chanagemailHandler() } } }
                // { title: 'MFA 设备', description: '未绑定 MFA 设备，绑定后，可以进行二次确认', value: '', actions: { title: '绑定', callback: () => { this.$message.info('This is a normal message') } } }
            ],
            // 加载标识
            loading: false,
            psdloading: false,
            resetPasswordModal: false,
            resetemailModal: false,
            psdForm: this.$form.createForm(this),
            emailForm: this.$form.createForm(this)
        }
    },
    methods: {
        chanagPasswordHandler () {
            this.resetPasswordModal = true
        },
        chanagemailHandler () {
            this.resetemailModal = true
        },
        validateToNextPassword  (rule, value, callback) {
            const regex = /^[a-zA-Z0-9]{5,20}$/
            if (value && regex.test(value)) {
                callback()
            } else {
                callback(new Error('密码为5-20位数字或字母'))
            }
        },
        compareToFirstPassword  (rule, value, callback) {
            if (!value || value !== this.psdForm.getFieldValue('password')) {
                callback(new Error('两次密码不一致'))
            } else {
                callback()
            }
        },
        validateToEmail (rule, value, callback) {
            const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
            if (regex.test(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的邮箱地址'))
            }
        },
        // 模态框关闭
        subCancel () {
            this.resetPasswordModal = false
            this.resetemailModal = false
        },
        // 修改密码
        handleResetPsd (e) {
            e.preventDefault() // 防止事件穿透
            const { psdForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.psdloading = true
                    const updateParams = {}
                    updateParams.id = this.$store.getters.userInfo.id
                    updateParams.oldPassword = md5(values.oldPassword)
                    // if (values.type === 1) {
                    updateParams.password = md5(values.password)
                    // } else {
                    //     updateParams.passwordWork = md5(values.password)
                    // }
                    axios({
                        path: 'PermissionsUserUpdatePwd',
                        method: 'post',
                        body: updateParams
                    }).then(res => {
                        if (res.flag === 1) {
                            this.resetPasswordModal = false
                        }
                        this.psdloading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 修改邮箱
        handleResetEmail (e) {
            e.preventDefault() // 防止事件穿透
            const { emailForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.id = this.$store.getters.userInfo.id
                    axios({
                        path: 'PermissionsUserUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.data[1].description = '已绑定邮箱'
                            this.data[1].value = values.email
                            this.resetemailModal = false
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2018-12-27 18:41:20
 * @LastEditors: Oak
 * @LastEditTime: 2019-04-23 16:22:45
 -->
<style lang="less">
  @import '../styles/unlock.less';
</style>

<template>
  <transition name="show-unlock">
    <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleClickAvator">
      <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
        <a-avatar class="unlock-avator-img" size="small" :src="avatar()"/>
        <div class="unlock-avator-cover">
          <span class="action">
            <a-icon type="unlock" />
          </span>
          <p>解锁</p>
        </div>
      </div>
      <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
      <div class="unlock-input-con">
        <div class="unlock-input-overflow-con">
          <div class="unlock-overflow-body" :style="{right: inputLeft}">
            <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="密码同登录密码" />
          </div>
        </div>
      </div>
      <div class="unlock-locking-tip-con">已锁定</div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
import md5 from 'md5'
export default {
    name: 'Unlock',
    data () {
        return {
            avatorLeft: '0px',
            inputLeft: '400px',
            password: '',
            check: null
        }
    },
    props: {
        showUnlock: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        ...mapGetters(['avatar']),
        handleClickAvator () {
            if (this.password !== '') {
                axios({
                    path: 'unlock',
                    method: 'post',
                    body: {
                        password: md5(this.password)
                    }
                }).then(res => {
                    console.log(res)
                    if (res.flag === 1) {
                        this.avatorLeft = '0px'
                        this.inputLeft = '400px'
                        this.password = ''
                        this.$ls.set('LOCK_SCREEN_STATUS', false)
                        this.$emit('on-unlock')
                    } else {
                        this.$message.error('密码错误,请重新输入。')
                    }
                })
            } else {
                if (this.avatorLeft === '-100px') {
                    this.avatorLeft = '0px'
                    this.inputLeft = '400px'
                } else {
                    this.avatorLeft = '-100px'
                    this.inputLeft = '0px'
                    this.$refs.inputEle.focus()
                }
            }
        },
        unlockMousedown () {
            this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn'
        },
        unlockMouseup () {
            this.$refs.unlockBtn.className = 'unlock-btn'
        }
    }
}
</script>

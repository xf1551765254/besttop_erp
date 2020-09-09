<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-03-25 10:46:38
 * @LastEditTime: 2019-04-08 16:04:42
 -->
<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical">
          <a-form-item label="昵称" >
            <a-input placeholder="给自己起个名字" v-model="name"/>
          </a-form-item>
          <a-form-item label="简介" >
            <a-textarea rows="4" placeholder="请用一段话介绍自己." v-model="note"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="handleSubmit">提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>

      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1, $store.getters.avatar)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="$store.getters.avatar"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal" @change="avatarChange"/>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { axios } from '@/utils/request'
export default {
    components: { AvatarModal },
    data () {
        return {
            name: '',
            note: '',
            avatar: ''
        }
    },
    mounted () {
        console.log(this.$store.getters)
        this.user = this.$store.getters.userInfo
        this.name = this.user.name
        this.note = this.user.introduction
    },
    methods: {
        avatarChange (e) {
            this.avatar = e
            this.loading = true
            axios({
                path: 'PermissionsUserUpdateAvatar',
                method: 'post',
                body: {
                    id: this.user.id,
                    avatar: this.avatar
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.$message.success('操作成功')
                }
                this.loading = false
            })
        },
        handleSubmit (e) {
            this.loading = true
            axios({
                path: 'PermissionsUserUpdate',
                method: 'post',
                body: {
                    id: this.user.id,
                    name: this.name,
                    introduction: this.note.length > 0 ? this.note : '无'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.$message.success('操作成功')
                }
                this.loading = false
            })
        }
    }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>

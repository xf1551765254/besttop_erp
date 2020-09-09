<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-06 14:36:11
 * @LastEditTime: 2019-04-30 15:39:56
 -->
<style lang="less">
    @import './403.less';
</style>

<template>
  <div class="error403">
    <div class="error403-body-con">
      <a-card>
        <div class="error403-body-con-title">4<span class="error403-0-span">
          <a-icon color="#ed3e13" type="quanxian"/>
        </span><span class="error403-key-span">
          <a-icon style="font-size:180px;margin-top: 20px;" color="#2e8cf0" type="thunderbolt" theme="filled"/>
        </span></div>
        <p class="error403-body-con-message">您没有权限访问此页面</p>
        <div class="error403-btn-con">
          <a-button @click="goHome" size="large" style="width: 200px;" type="primary">返回首页</a-button>
          <a-button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</a-button></div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Error403',
    methods: {
        backPage () {
            this.$router.go(-1)
        },
        goHome () {
            this.$router.push({
                name: 'user/login'
            })
        }
    }
}
</script>

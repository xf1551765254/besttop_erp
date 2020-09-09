<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-06 14:36:12
 * @LastEditTime: 2019-04-30 15:40:00
 -->
<style lang="less">
    @import './404.less';
</style>

<template>
  <div class="error404">
    <div class="error404-body-con">
      <a-card>
        <div class="error404-body-con-title">4<span>
          <a-icon style="font-size:180px;" type="compass" />
        </span>4</div>
        <p class="error404-body-con-message">您访问的路径有误</p>
        <div class="error404-btn-con">
          <a-button @click="goHome" size="large" style="width: 200px;" type="primary">返回首页</a-button>
          <a-button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Error404',
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

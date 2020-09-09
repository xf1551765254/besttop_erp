<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-06 14:36:12
 * @LastEditTime: 2019-04-30 15:40:05
 -->
<style lang="less">
    @import './500.less';
</style>

<template>
  <div class="error500">
    <div class="error500-body-con">
      <a-card>
        <div class="error500-body-con-title">
          5<span class="error500-0-span">
            <a-icon style="font-size:100px;margin: 0 0 25px 5px;" type="api" />
          </span><span class="error500-0-span">
            <a-icon style="font-size:100px;margin: 0 0 25px 5px;" type="api" />
          </span>
        </div>
        <p class="error500-body-con-message">哦买噶！服务器出错了！</p>
        <div class="error500-btn-con">
          <a-button @click="goHome" size="large" style="width: 200px;" type="primary">返回首页</a-button>
          <a-button @click="backPage" size="large" style="width: 200px;margin-left: 40px;" type="primary">返回上一页</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Error500',
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

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-04 13:37:55
 -->
<template>
  <div class="footer">
    <!-- <div class="links">
      <a href="https://www.besttop.top/" target="_blank">贝图首页</a>
    </div> -->
    <div class="copyright">
      Copyright
      <a-icon type="copyright"/>
      2019 <span>{{ config.Author }}</span>
      {{ config.Version }}
    </div>
  </div>
</template>

<script>
import config from '@/config/defaultSettings'
export default {
    name: 'LayoutFooter',
    data () {
        return {
            config
        }
    }
}
</script>

<style lang="less" scoped>
.footer {
    // padding: 0 16px;
    // margin: 48px 0 24px;
    text-align: center;

    .links {
        margin-bottom: 8px;

        a {
            color: rgba(0, 0, 0, .45);

            &:hover {
                color: rgba(0, 0, 0, .65);
            }

            &:not(:last-child) {
                margin-right: 40px;
            }
        }
    }
    .copyright {
        color: rgba(0, 0, 0, .45);
        font-size: 14px;
    }
}
</style>

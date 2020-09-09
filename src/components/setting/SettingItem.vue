<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-03-18 16:33:34
 -->
<template>
  <div class="setting-drawer-index-item">
    <h3 class="setting-drawer-index-title">{{ title }}</h3>
    <slot></slot>
    <a-divider v-if="divider"/>
  </div>
</template>

<script>
export default {
    name: 'SettingItem',
    props: {
        title: {
            type: String,
            default: ''
        },
        divider: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="less" scoped>

  .setting-drawer-index-item {
    margin-bottom: 24px;

    .setting-drawer-index-title {
      font-size: 14px;
      color: rgba(0, 0, 0, .85);
      line-height: 22px;
      margin-bottom: 12px;
    }

  }
</style>

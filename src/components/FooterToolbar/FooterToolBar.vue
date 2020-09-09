<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-02-28 20:06:04
 -->
<template>
  <div :class="prefixCls">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
    name: 'FooterToolBar',
    props: {
        prefixCls: {
            type: String,
            default: 'ant-pro-footer-toolbar'
        },
        extra: {
            type: [String, Object],
            default: ''
        }
    }
}
</script>

<style lang="less" scoped>

</style>

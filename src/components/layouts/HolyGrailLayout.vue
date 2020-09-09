<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-04-14 14:41:21
 * @LastEditTime: 2019-08-06 18:56:00
 -->
<template>
  <div class="holy-layout">
    <div class="left" :style="{flexBasis: collapsed ? left : '0px', maxWidth: collapsed ? left : '0px'}">
      <slot name="left"></slot>
      <div v-if="!hideClose" class="trigger-box" @click="clickHideLeft" :style="`height:${$store.getters.windowHeight-200}px;`">
        <a-icon class="iconCls" :type="collapsed?'left':'right'"></a-icon>
      </div>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right" :style="{flexBasis: right, maxWidth:right}">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<style lang="less" scoped>
.holy-layout{
    display: flex;
    display: -webkit-flex;
    // width: 100%;
    .left {
        order: -1;
        position: relative;
    }
    .center {
        flex-grow:1;
        width: 0;
    }
    .right {

    }
    .trigger-box{
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        .iconCls{
            font-size: 20px;
        }
    }
}
</style>
<script>
export default {
    name: 'HolyGrailLayout',
    data: function () {
        return {
            collapsed: true
        }
    },
    props: {
        left: {
            type: String,
            default: '0px'
        },
        right: {
            type: String,
            default: '0px'
        },
        hideClose: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        clickHideLeft () {
            this.collapsed = !this.collapsed
        }
    }
}
</script>

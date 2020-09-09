<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-04 13:34:39
 -->
<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title || config.system }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/new_logo.svg?inline'

import config from '@/config/defaultSettings'

export default {
    name: 'Logo',
    components: {
        LogoSvg
    },
    props: {
        title: {
            type: String,
            default: null,
            required: false
        },
        showTitle: {
            type: Boolean,
            default: true,
            required: false
        }
    },
    data () {
        return {
            config
        }
    }
}
</script>

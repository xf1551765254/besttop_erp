<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-10 18:55:34
 -->
<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo />
    <a-menu v-if="collapsed" :inlineCollapsed="collapsed" :theme="theme" :mode="mode">
      <a-sub-menu>
        <span slot="title"><a-icon type="compass" spin/></span>
        <a-menu-item v-for="(item, index) in system()" :key="index">
          <a href="javascript:;" @click="chooseSystem(item)">
            <icon-font :type="`icon-${item}`" />
            <span>{{ $t(`menu.${item}`) }}</span>
          </a>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <a-dropdown v-if="!collapsed">
      <div class="action ant-dropdown-link user-dropdown-menu">
        <a-icon type="compass" spin style="margin-right:5px;"/>
        <span>{{ $t(`menu.${lastSystemName()}`) }}</span>
      </div>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item v-for="(item, index) in system()" :key="index">
          <a href="javascript:;" @click="chooseSystem(item)">
            <icon-font :type="`icon-${item}`" />
            <span>{{ $t(`menu.${item}`) }}</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
    ></s-menu>
  </a-layout-sider>

</template>
<script>
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import Logo from '../tools/Logo'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin.js'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'SideMenu',
    components: { ALayoutSider, Logo, SMenu },
    mixins: [mixin, mixinDevice],
    props: {
        mode: {
            type: String,
            required: false,
            default: 'inline'
        },
        theme: {
            type: String,
            required: false,
            default: 'dark'
        },
        collapsible: {
            type: Boolean,
            required: false,
            default: false
        },
        collapsed: {
            type: Boolean,
            required: false,
            default: false
        },
        menus: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            systemList: []
        }
    },
    created () {
        const system = this.system()
        this.systemList = [{
            key: '1',
            children: system
        }]
    },
    methods: {
        ...mapActions(['setLastSystemName']),
        ...mapGetters(['system', 'lastSystemName']),
        onSelect (obj) {
            this.$emit('menuSelect', obj)
        },
        /**
         * @name: 选择系统
         * @msg:
         * @param {type}
         * @return:
         */
        chooseSystem (system) {
            if (this.lastSystemName() === system) {
                this.$message.info(`切换失败，您已经在[${this.$t(`menu.${system}`)}]系统！`)
                return
            }
            this.$router.push({ name: 'index' })
            this.setLastSystemName(system)
            setTimeout(() => {
                window.location.reload()
            }, 500)
        }
    }
}
</script>

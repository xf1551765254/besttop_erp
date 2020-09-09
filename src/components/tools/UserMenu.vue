<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-06 18:48:41
 -->
<template>
  <div class="user-wrapper">
    <fullScreen v-model="isFullScreen" @on-change="fullscreenChange" class="action" />
    <lockScreen class="action"/>
    <header-notice class="action"/>
    <span @click="themeChange" class="action ant-dropdown-link user-dropdown-menu">
      <a-tooltip placement="bottom" >
        <template slot="title">
          <span>主题设置</span>
        </template>
        <a-icon type="bg-colors" style="margin-right:5px;"/>
      </a-tooltip>
    </span>
    <span @click="storeChange" class="action ant-dropdown-link user-dropdown-menu">
      <a-tooltip placement="bottom" >
        <template slot="title">
          <span>切换机构</span>
        </template>
        <a-icon type="shop" style="margin-right:5px;"/>
        <span>{{ $store.getters.storeInfo.name }}</span>
      </a-tooltip>
    </span>
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-icon type="compass" spin style="margin-right:5px;"/>
        <span>{{ $t(`menu.${lastSystemName()}`) }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item v-for="(item, index) in system()" :key="index">
          <a href="javascript:;" @click="chooseSystem(item)">
            <icon-font :type="`icon-${item}`" />
            <span>{{ $t(`menu.${item}`) }}</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>

    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar" size="small" :src="avatar()"/>
        <span>{{ name() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <a-menu-item key="0" v-if="isProd">
          <router-link :to="{ name: 'center' }">
            <a-icon type="user"/>
            <span>功能配置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ name: 'settings' }">
            <a-icon type="setting"/>
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" v-if="isProd">
          <a href="javascript:;" @click="initDBBTN">
            <a-icon type="setting"/>
            <span>重置数据库(测试)</span>
          </a>
        </a-menu-item>
        <a-menu-divider/>
        <a-menu-item key="3">
          <a href="javascript:;" @click="handleLogout">
            <a-icon type="logout"/>
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>
<style lang="less" scoped>
    .btn{
        margin-right: 10px;
    }
    .avatar {
        transition: all 10s;
    }
    .avatar:hover{
        transform: rotate(10turn)
    }
</style>

<script>
import HeaderNotice from './HeaderNotice'
import fullScreen from './fullscreen'
import lockScreen from '@comp/lockscreen/lockscreen.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'UserMenu',
    components: {
        HeaderNotice,
        fullScreen,
        lockScreen
    },
    data () {
        return {
            isFullScreen: false,
            isProd: true, // process.env.NODE_ENV !== 'production',
            chooseStore: false
        }
    },
    methods: {
        ...mapActions(['Logout', 'setLastSystemName', 'setThemeSetting', 'setChooseStore']),
        ...mapGetters(['name', 'avatar', 'system', 'lastSystemName', 'pageRoles', 'themeSetting']),
        storeChange () {
            this.setChooseStore(true)
        },
        themeChange () {
            const themeV = this.themeSetting()
            this.setThemeSetting(!themeV)
        },
        initDBBTN () {
            const self = this
            self.$confirm({
                title: '提示',
                content: '确定重新初始化本地数据库?',
                onOk () {
                    try {
                        self.$idb.close()
                        indexedDB.deleteDatabase('erp_web')
                    } catch (error) {
                        console.error(error)
                    }
                    setTimeout(() => {
                        location.reload()
                    }, 1500)
                },
                onCancel () {}
            })
        },
        handleLogout () {
            const that = this

            this.$confirm({
                title: '提示',
                content: '确认要注销登录吗 ?',
                onOk () {
                    return that.Logout({}).then(() => {
                        window.location.reload()
                    }).catch(err => {
                        that.$message.error({
                            title: '错误',
                            description: err.message
                        })
                    })
                },
                onCancel () {
                }
            })
        },
        fullscreenChange (isFullScreen) {

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

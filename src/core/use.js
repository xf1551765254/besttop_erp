/*
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-04-06 19:18:33
 */
import Vue from 'vue'
import VueStorage from 'vue-ls'
import config from '@/config/defaultSettings'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import PermissionHelper from '@/utils/helper/permission'
import validation from '@/utils/helper/validation'
import math from '@/utils/helper/math'
import logger from '@/utils/helper/logger'
import card from '@/utils/card'

import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'

import fullscreen from 'vue-fullscreen'
import VueScrollLock from 'vue-scroll-lock'

VueClipboard.config.autoSetContainer = true

Vue.use(VueScrollLock)
Vue.use(Antd)
Vue.use(Viser)

Vue.use(contentmenu)

Vue.use(VueStorage, config.storageOptions)
Vue.use(VueClipboard)
Vue.use(PermissionHelper)
Vue.use(validation)
Vue.use(math)
Vue.use(logger)
Vue.use(fullscreen)
Vue.use(card)

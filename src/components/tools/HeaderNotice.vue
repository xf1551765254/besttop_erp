<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-16 09:44:28
 -->
<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    :overlayStyle="{ width: '300px', top: '50px'}">
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs @change="changeTab" v-model="activeKey">
          <a-tab-pane tab="通知" key="notice" :style="`max-height:${getHeight}px;overflow:auto;`">
            <a-list v-if="notes.length>0">
              <a-list-item v-for="(item, index) in notes" :key="index">
                <a-list-item-meta :title="item.title" :description="getTime(item.time)">
                  <a-avatar style="background-color: white" slot="avatar" :src="getIcon(item.type)"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="消息" key="message">
            <a-list v-if="notes.length>0">
              <a-list-item v-for="(item, index) in notes" :key="index">
                <a-list-item-meta :title="item.title" :description="getTime(item.time)">
                  <a-avatar style="background-color: white" slot="avatar" :src="getIcon(item.type)"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="待办" key="toDolist">
            <!-- <a-list v-if="notes.length>0">
              <a-list-item v-for="(item, index) in notes" :key="index">
                <a-list-item-meta :title="item.title" :description="getTime(item.time)">
                  <a-avatar style="background-color: white" slot="avatar" :src="getIcon(item.type)"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list> -->
            <a-list v-if="approvalList.length>0">
              <a-list-item v-for="(item, index) in approvalList" :key="index">
                <a-list-item-meta :title="item.title" :description="getTime(item.time)">
                  <a-avatar style="background-color: white" slot="avatar" :src="getIcon()"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
        <div v-if="notes.length<1&&approvalList.length<1" style="text-align: center">暂时没有新消息</div>
        <div v-if="notes.length>0" class="header-notice-floor">
          <a style="width:50%" @click="delMessage">全部标记已读</a>
          <a style="width:50%" @click="showAll">查看全部</a>
        </div>
        <div v-if="approvalList.length>0" class="header-notice-floor">
          <a style="width:100%" @click="showAll">查看全部</a>
        </div>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge :count="$store.getters.messageCount">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import { timeToText } from '@/utils/util'
import { axios } from '@/utils/request'
export default {
    name: 'HeaderNotice',
    data () {
        return {
            loadding: false,
            visible: false,
            showButton: false,
            activeKey: 'notice',
            notes: [],
            ids: [],
            count: 0,
            approvalList: []
        }
    },
    computed: {
        getHeight () {
            return document.documentElement.clientHeight * 0.25
        }
    },
    methods: {
        getIcon (type) {
            switch (type) {
            case 'message':
                return 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
            case 'remind':
                return '@assets/message.png'
            case 'warning':
                return '@assets/message.png'
            case 'error':
                return '@assets/message.png'
            default:
                return 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
            }
        },
        getTime (time) {
            return timeToText(time)
        },
        fetchNotice () {
            if (!this.visible) {
                if (this.activeKey === 'toDolist') {
                    this.getApprovalList()
                } else {
                    const type = this.activeKey === 'notice' ? 1 : 2
                    this.getMessage(type)
                }
            }
            this.visible = !this.visible
        },
        /**
         * @name: tab切换
         * @msg:
         * @param {type}
         * @return:
         */
        changeTab (e) {
            // this.showButton = false
            this.notes = []
            if (e === 'notice') {
                this.getMessage(1)
            } else if (e === 'message') {
                this.getMessage(2)
            } else {
                // this.getMessage(3)
                this.getApprovalList()
            }
        },
        getMessage (type) {
            this.approvalList = []
            this.loadding = true
            this.ids = []
            const code = this.$store.getters.code
            axios({
                path: 'getHeaderNotice',
                method: 'post',
                body: {
                    receiveCode: code,
                    type: type,
                    status: 0
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        this.ids.push(item.id)
                        item.key = item.id
                        item.title = item.topic
                        item.time = item.updateTime
                    })
                    this.notes = [...data]
                    // this.showButton = this.notes.length > 0
                }
                this.loadding = false
            })
        },
        getApprovalList () {
            this.notes = []
            this.loadding = true
            axios({
                path: 'SysMessageFindApprovalList',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    status: 0
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list || []
                    data.forEach((item, index) => {
                        item.key = index
                        item.title = `您有一个${item.billName}待处理`
                        item.time = item.createTime
                    })
                    this.approvalList = [...data]
                    // this.showButton = this.approvalList.length > 0
                }
                this.loadding = false
            })
        },
        delMessage () {
            this.loadding = true
            axios({
                path: 'updateHeaderNotice',
                method: 'post',
                body: { ids: this.ids }
            }).then(res => {
                if (res.flag === 1) {
                    this.notes = []
                    // this.showButton = false
                    const messageCount = this.$store.getters.messageCount
                    if (messageCount > 0) {
                        this.$store.commit('SET_MESSAGE_COUNT', messageCount - this.ids.length)
                    }
                }
                this.loadding = false
            })
        },
        showAll () {
            const activeKey = this.activeKey === 'toDolist' ? 6 : 5
            this.$router.push({ name: 'settings', params: { activeKey } })
            this.visible = false
        }
    },
    watch: {
        '$store.getters.messageCount': (newval, oldval) => {
            if (oldval && newval > oldval) {
                this.$notification.info({
                    message: '通知',
                    description: '您有一条新消息，请及时查收。'
                })
            }
        }
    }
}
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
  .header-notice-floor{
      text-align: center;
      display: flex;
  }

</style>

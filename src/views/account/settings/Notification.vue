<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-03-25 10:46:38
 * @LastEditTime: 2019-06-18 17:42:34
 -->
<template>
  <a-list itemLayout="horizontal" :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
    <a-tabs @change="changeTab" v-model="activeKey">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name">
        <div v-if="!showButton" style="text-align: center">暂时没有新消息</div>
        <div v-if="activeKey==1&&showButton">
          <div><a-button @click="delAllMessage">全部标记已读</a-button></div>
        </div>
        <a-list-item v-for="(item, index) in notes" :key="index">
          <a-list-item-meta class="notification-list-item" :title="item.title" :description="item.creator" @click="onclick(item)">
            <a-avatar :icon="getIcon(item.type)" :style="{backgroundColor: item.status === 1 ? '#aaaaaa' : '#e54d42'}" slot="avatar"/>
          </a-list-item-meta>
          <collapseTransition>
            <div v-show="item.showMore" v-html="item.content"></div>
          </collapseTransition>
        </a-list-item>
      </a-tab-pane>
    </a-tabs>
  </a-list>
</template>

<script>
import { axios } from '@/utils/request'
import collapseTransition from '@comp/seachBox/transition'

export default {
    components: { collapseTransition },
    data () {
        return {
            notes: [],
            ids: [],
            showButton: false,
            messages: [],
            tabs: [{ key: 1, name: '未处理' }, { key: 2, name: '已处理' }],
            activeKey: 1
        }
    },
    mounted () {
        this.getMessage(0)
    },
    methods: {
        changeTab () {
            if (this.activeKey === 1) {
                this.getMessage(0)
            } else {
                this.getMessage(1)
            }
        },
        onclick (item) {
            item.showMore = !item.showMore
            if (item.status === 0) {
                this.delMessage(item)
            }
        },
        getIcon (type) {
            switch (type) {
            case 1: // 通知
                return 'mail'
            case 2: // 消息
                return 'message'
            case 3: // 待办
                return 'pushpin'
            default:
                return 'bell'
            }
        },
        getMessage (status) {
            this.ids = []
            axios({
                path: 'getHeaderNotice',
                method: 'post',
                body: {
                    typeList: [1, 2],
                    status
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        this.ids.push(item.id)
                        item.key = item.id
                        item.title = item.topic
                        item.creator = `创建人：${item.createBy || ''} 创建时间：${item.createTime}`
                        item.showMore = false
                    })
                    this.notes = [...data]
                    this.showButton = this.notes.length > 0
                }
            })
        },
        delAllMessage () {
            this.loadding = true
            axios({
                path: 'updateHeaderNotice',
                method: 'post',
                body: {
                    ids: this.ids
                }
            }).then(res => {
                if (res.flag === 1) {
                    // const notes = [...this.notes]
                    // notes.map(o => { o.status = 1 })
                    // this.notes = notes
                    // this.messages = [...this.messages, ...this.ids]
                    this.notes.length = 0
                    const messageCount = this.$store.getters.messageCount
                    this.$store.commit('SET_MESSAGE_COUNT', messageCount - this.ids.length)
                    this.showButton = false
                }
            })
        },
        delMessage (item) {
            axios({
                path: 'updateHeaderNotice',
                method: 'post',
                body: {
                    ids: [item.id]
                }
            }).then(res => {
                if (res.flag === 1) {
                    item.status = 1
                    const notes = [...this.notes]
                    this.notes = notes.filter(o => o.status === 0)
                    const messageCount = this.$store.getters.messageCount
                    if (messageCount > 0) {
                        this.$store.commit('SET_MESSAGE_COUNT', messageCount - 1)
                    }
                }
            })
        }
    }
}
</script>

<style lang='less' scoped>
    .ant-list-item{
        flex-direction: column;
        align-items:flex-start;

        &-meta{
            width: 100%;
            background-color: white;
            padding: 15px;
            line-height: 50px;
            border-top: 1px rgba(0, 0, 0, 0.25) solid;
            border-left: 1px rgba(0, 0, 0, 0.25) solid;
            border-right: 1px rgba(0, 0, 0, 0.25) solid;
        }
    }

</style>
<style lang='less'>
    .ant-list-item-content{
        width: 100%;
        justify-content: flex-start;
        padding: 0 15px;
        background-color: white;
        line-height: 2;
        // border-top: 1px rgba(0, 0, 0, 0.25) dashed;
        border-left: 1px rgba(0, 0, 0, 0.25) solid;
        border-right: 1px rgba(0, 0, 0, 0.25) solid;
        border-bottom: 1px rgba(0, 0, 0, 0.25) solid;
    }
</style>

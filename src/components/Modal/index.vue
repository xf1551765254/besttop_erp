<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-04-22 14:24:33
 * @LastEditTime: 2019-07-20 11:18:37
 -->
<template>
  <collapseTransition>
    <div
      v-if="value"
      class="layout-box"
      :style="{paddingTop:paddingTop, width:boxWidth+'px'}">
      <div class="box" :style="{height:boxHeight+'px'}">
        <div class="header">
          <div class="left"><a-tag v-if="orderId!=''" color="blue">编号：{{ orderId }}</a-tag></div>
          <div class="title">{{ title }}</div>
          <div class="right">
            <a-tag v-if="tags.indexOf('uncheck')>=0" color="green">未审核</a-tag>
            <a-tag v-if="tags.indexOf('check')>=0" color="#87d068">已审核</a-tag>
            <a-tag v-if="tags.indexOf('obsolete')>=0" color="#f50">已作废</a-tag>
            <a-tag v-if="tags.indexOf('expired')>=0" color="#f50">已过期</a-tag>
            <a-tag v-if="tags.indexOf('unconfirm')>=0" color="cyan">未确认</a-tag>
            <a-tag v-if="tags.indexOf('confirm')>=0" color="pink">已确认</a-tag>
            <a-tag v-if="tags.indexOf('uneffective')>=0" color="cyan">未生效</a-tag>
            <a-tag v-if="tags.indexOf('effective')>=0" color="#108ee9">已生效</a-tag>
            <a-tag v-if="tags.indexOf('noeffective')>=0" color="#f50">已失效</a-tag>
            <a-tag v-if="tags.indexOf('stoped')>=0" color="#f5222c">已终止</a-tag>
            <a-tag v-if="tags.indexOf('submit')>=0" color="green">已提交</a-tag>
            <a-tag v-if="tags.indexOf('notsubmitted')>=0" color="green">未提交</a-tag>
            <a-tag v-if="tags.indexOf('invoice')>=0" color="green">已确认</a-tag>
            <a-tag v-if="tags.indexOf('notinvoiced')>=0" color="green">待确认</a-tag>

          </div>
        </div>
        <div class="center">
          <a-spin :spinning="loading">
            <slot></slot>
          </a-spin>
        </div>
        <div class="footer">
          <div class="button-box">
            <a-popconfirm v-if="popconfirm" title="确认放弃已填写的信息？" @confirm="submitCancel">
              <a-icon slot="icon" type="question-circle-o" style="color: red" />
              <a-button>关闭</a-button>
            </a-popconfirm>
            <a-button v-else @click="submitCancel">关闭</a-button>
            <slot name="footer"></slot>
            <a-button
              v-if="subBtn"
              type="primary"
              style="margin-left:10px;"
              :loading="submitLoading"
              @click="submitClick"
              :disabled="loading">提交</a-button>
          </div>
        </div>
      </div>
    </div>
  </collapseTransition>
</template>
<style lang="less">
.layout-box{
    margin: 24px 0 0;
    position: absolute;
    top:0;
    z-index:2;
    .box{
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        .header{
            order: -1;
            flex-basis:64px;
            max-height:64px;
            height:64px;
            width:100%;
            background-color: #fff;
            display: flex;
            display: -webkit-flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            border-bottom:1px solid #e8e8e8;
            .left{
                width:30%;
                text-align:center;
            }
            .title{
                width:40%;
                font-size: 16px;
                font-weight: bold;
                text-align:center;
            }
            .right{
                width:30%;
                text-align:center;
            }
        }
        .center {
            flex-grow:1;
            height: 0;
            background-color: #fff;
            padding:20px;
            width:100%;
            overflow:auto;
            .ant-col-3,
            .ant-col-4,
            .ant-col-5,
            .ant-col-6,
            .ant-col-8,
            .ant-col-16,
            .ant-col-18,
            .ant-col-sm-16,
            .ant-col-sm-8,
            .ant-col-md-20,
            .ant-col-md-8,
            .ant-col-md-4,
            .ant-col-xl-21,
            .ant-col-xl-13,
            .ant-col-xl-5,
            .ant-col-xl-3{
                height: 36px;
                line-height: 36px;
                margin-bottom: 20px;
            }
            .ant-col-3,
            .ant-col-4,
            .ant-col-6,
            .ant-col-sm-8,
            .ant-col-md-4,
            .ant-col-xl-3{
                text-align: right;
                font-weight: bold;
                padding-right: 10px;
                font-size: 12px;
            }
        }
        .footer{
            flex-basis:50px;
            max-height:50px;
            height:50px;
            line-height:50px;
            width:100%;
            padding:0 20px;
            background-color: #fff;
            flex-direction: row;
            justify-content: flex-end;
            border-top:1px solid #e8e8e8;
            .button-box{
                height:100%;
                display: flex;
                display: -webkit-flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
            }
        }
    }
}
</style>
<script>
import collapseTransition from '@comp/seachBox/transition'
import { mixin, mixinDevice } from '@/utils/mixin.js'
export default {
    name: 'BtModal',
    components: { collapseTransition },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '标题'
        },
        popconfirm: {
            type: Boolean,
            default: false
        },
        submitClick: {
            type: Function,
            default: () => { console.error('未定义提交/确认函数') }
        },
        loading: {
            type: Boolean,
            default: false
        },
        submitLoading: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        },
        tags: {
            type: Array,
            default: () => []
        },
        subBtn: {
            type: Boolean,
            default: true
        }
    },
    data: function () {
        return {
            paddingTop: '44px',
            outHeight: 0,
            boxWidth: 0
        }
    },
    mixins: [mixin, mixinDevice],

    computed: {
        boxHeight () {
            return this.$store.getters.windowHeight - this.outHeight
        }
    },
    methods: {
        submitCancel () {
            this.$emit('input', false)
            this.$emit('afterClose')
        }
    },
    watch: {
        '$store.state.app.fixedHeader': (val) => {
            if (val) {
                this.paddingTop = '44px'
                this.outHeight = 88
            } else {
                this.paddingTop = '0'
                this.outHeight = 0
            }
        },
        '$store.getters.windowHeight': {
            handler (val) {
                if (this.fixSidebar) {
                    this.paddingTop = '44px'
                    this.outHeight = 88
                } else {
                    this.paddingTop = '0'
                    this.outHeight = 0
                }
            }
        },
        '$store.getters.windowWidth': {
            handler (val) {
                if (!this.fixSidebar || this.isMobile()) {
                    this.boxWidth = val
                    return
                }
                if (this.sidebarOpened) {
                    this.boxWidth = val - 256
                } else {
                    this.boxWidth = val - 80
                }
            },
            immediate: true
        },
        sidebarOpened (val) {
            const w = this.$store.getters.windowWidth
            if (!this.fixSidebar || this.isMobile()) {
                this.boxWidth = w
                return
            }
            if (val) {
                this.boxWidth = w - 256
            } else {
                this.boxWidth = w - 80
            }
        },
        value (val) {
            if (val) {
                if (this.fixSidebar) {
                    this.paddingTop = '44px'
                    this.outHeight = 88
                } else {
                    this.paddingTop = '0'
                    this.outHeight = 0
                }
            } else {
                this.$emit('onClose')
            }
        }
    }
}
</script>

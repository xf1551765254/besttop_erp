<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-12 09:39:20
 -->
<template>
  <page-layout :avatar="avatar">
    <div class="heard-box detail">
      <div class="main">
        <div class="row">
          <div v-if="avatar" class="avatar">
            <a-avatar :src="avatar"/>
          </div>
          <div class="headerContent">
            <div class="title">{{ timeFix }}，{{ userInfo.name }}<span class="welcome-text">，{{ welcome() }}</span></div>
            <!-- <div>{{ `未知岗位 | ${config.user} - 未知机构 - ${$store.getters.storeInfo.name}` }}</div> -->
            <div>{{ $store.getters.storeInfo.name || '未知机构' }}</div>
          </div>
          <div class="extra">
            <a-row class="more-info">
              <a-col :span="8">
                <head-info title="待审核" content="0" :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="8">
                <head-info title="业绩/任务" content="0/0" :center="false" :bordered="false"/>
              </a-col>
              <a-col :span="8">
                <head-info title="效率指数" content="0.00" :center="false" />
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="集团内部公告"
            :body-style="{ padding: 0 }">
            <a slot="extra">全部公告</a>
            <div>
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.cover"/>
                      <a>{{ item.title }}</a>
                    </div>
                    <div slot="description" class="card-description">
                      {{ item.description }}
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a href="/#/">{{ config.user }}</a>
                    <span class="datetime">{{ item.time }}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
          <!-- <a-card :loading="loading" title="动态" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.user.avatar" />
                  <div slot="title">
                    <span>{{ item.user.name }}</span>&nbsp;
                    在&nbsp;<a href="#">{{ item.project.name }}</a>&nbsp;
                    <span>{{ item.project.action }}</span>&nbsp;
                    <a href="#">{{ item.project.event }}</a>
                  </div>
                  <div slot="description">{{ item.time }}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card> -->
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a v-for="(item, index) in todos" :key="index" :href="item.path">{{ item.name }}</a>
              <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
            </div>
          </a-card>
          <!-- <a-card title="XX 指数" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" :body-style="{ padding: 0 }">
            <div style="min-height: 400px;">
              <radar :data="radarData" />
            </div>
          </a-card> -->
          <!-- <a-card :loading="loading" title="团队" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <span class="member">{{ item.name }}</span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card> -->
        </a-col>
      </a-row>
    </div>
  </page-layout>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'

import PageLayout from '@/components/page/PageLayout'
import HeadInfo from '@/components/tools/HeadInfo'
import Radar from '@/components/chart/Radar'
import config from '@/config/defaultSettings'

const DataSet = require('@antv/data-set')

export default {
    name: 'MetadataWorkplace',
    components: {
        PageLayout,
        HeadInfo,
        Radar
    },
    data () {
        return {
            timeFix: timeFix(),
            config,
            projects: [
                {
                    title: '财务报告',
                    cover: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
                    description: '季度财务报告已出炉',
                    time: '2019-04-01 09:00:00'
                }
            ],
            loading: true,
            radarLoading: true,
            activities: [],
            teams: [],
            todos: [],

            // data
            axis1Opts: {
                dataKey: 'item',
                line: null,
                tickLine: null,
                grid: {
                    lineStyle: {
                        lineDash: null
                    },
                    hideFirstLine: false
                }
            },
            axis2Opts: {
                dataKey: 'score',
                line: null,
                tickLine: null,
                grid: {
                    type: 'polygon',
                    lineStyle: {
                        lineDash: null
                    }
                }
            },
            scale: [{
                dataKey: 'score',
                min: 0,
                max: 80
            }],
            axisData: [
                { item: '引用', a: 70, b: 30, c: 40 },
                { item: '口碑', a: 60, b: 70, c: 40 },
                { item: '产量', a: 50, b: 60, c: 40 },
                { item: '贡献', a: 40, b: 50, c: 40 },
                { item: '热度', a: 60, b: 70, c: 40 },
                { item: '引用', a: 70, b: 50, c: 40 }
            ],
            radarData: []
        }
    },
    computed: {
        userInfo () {
            return this.$store.getters.userInfo
        },
        avatar () {
            return this.$store.getters.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        }
    },
    mounted () {
        this.getActivity()
        this.getTeams()
        this.initRadar()
        setTimeout(() => {
            this.loading = false
        }, 1500)
    },
    methods: {
        ...mapGetters(['name', 'welcome']),
        getActivity () {
            this.activities = [
                {
                    'id': 1,
                    'user': {
                        'nickname': 'Christopher Martinez',
                        'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                    },
                    'project': {
                        'name': '白鹭酱油开发组',
                        'action': '更新',
                        'event': '番组计划'
                    },
                    'time': '2018-08-23 14:47:00'
                }
            ]
        },
        getTeams () {
            this.teams = [
                {
                    'id': 1,
                    'name': '科学搬砖组',
                    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                }
            ]
        },
        initRadar () {
            this.radarLoading = true
            const dv = new DataSet.View().source([
                {
                    'item': '引用',
                    '个人': 70,
                    '团队': 30,
                    '部门': 40
                },
                {
                    'item': '口碑',
                    '个人': 60,
                    '团队': 70,
                    '部门': 40
                },
                {
                    'item': '产量',
                    '个人': 50,
                    '团队': 60,
                    '部门': 40
                },
                {
                    'item': '贡献',
                    '个人': 40,
                    '团队': 50,
                    '部门': 40
                },
                {
                    'item': '热度',
                    '个人': 60,
                    '团队': 70,
                    '部门': 40
                },
                {
                    'item': '引用',
                    '个人': 70,
                    '团队': 50,
                    '部门': 40
                }
            ])
            dv.transform({
                type: 'fold',
                fields: ['个人', '团队', '部门'],
                key: 'user',
                value: 'score'
            })

            this.radarData = dv.rows
            this.radarLoading = false
        }
    }
}
</script>

<style lang="less" scoped>
.heard-box{
    background: #fff;
    padding: 16px 32px 0;
    border-bottom: 1px solid #e8e8e8;
}
    .project-list {
        .card-title {
            font-size: 0;
            a {
                color: rgba(0, 0, 0, 0.85);
                margin-left: 12px;
                line-height: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: top;
                font-size: 14px;

                &:hover {
                color: #1890ff;
                }
            }
        }
        .card-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
        .project-item {
            display: flex;
            margin-top: 8px;
            overflow: hidden;
            font-size: 12px;
            height: 20px;
            line-height: 20px;
            a {
                color: rgba(0, 0, 0, 0.45);
                display: inline-block;
                flex: 1 1 0;

                &:hover {
                color: #1890ff;
                }
            }
            .datetime {
                color: rgba(0, 0, 0, 0.25);
                flex: 0 0 auto;
                float: right;
            }
        }
        .ant-card-meta-description {
            color: rgba(0, 0, 0, 0.45);
            height: 44px;
            line-height: 22px;
            overflow: hidden;
        }
    }

    .item-group {
        padding: 20px 0 8px 24px;
        font-size: 0;
        a {
            color: rgba(0, 0, 0, 0.65);
            display: inline-block;
            font-size: 14px;
            margin-bottom: 13px;
            width: 25%;
        }
    }

    .members {
        a {
            display: block;
            margin: 12px 0;
            line-height: 24px;
            height: 24px;
            .member {
                font-size: 14px;
                color: rgba(0, 0, 0, .65);
                line-height: 24px;
                max-width: 100px;
                vertical-align: top;
                margin-left: 12px;
                transition: all 0.3s;
                display: inline-block;
            }
            &:hover {
                span {
                color: #1890ff;
                }
            }
        }
    }

    .mobile {
        .project-list {
            .project-card-grid {
                width: 100%;
            }
        }

        .more-info {
            border: 0;
            padding-top: 16px;
            margin: 16px 0 16px;
        }

        .headerContent .title .welcome-text {
            display: none;
        }
    }
    .detail {
        display: flex;
        .avatar {
            flex: 0 1 72px;
            margin: 0 24px 8px 0;
            transition: all 10s;
            & > span {
                border-radius: 72px;
                display: block;
                width: 72px;
                height: 72px;
            }
        }
        .avatar:hover{
            transform: rotate(10turn)
        }
        .main {
            width: 100%;
            flex: 0 1 auto;
            .row {
                display: flex;
                width: 100%;
                .avatar {
                    margin-bottom: 16px;
                }
            }
            .title {
                font-size: 20px;
                font-weight: 500;

                font-size: 20px;
                line-height: 28px;
                font-weight: 500;
                color: rgba(0,0,0,.85);
                margin-bottom: 16px;
                flex: auto;
            }
            .logo {
                width: 28px;
                height: 28px;
                border-radius: 4px;
                margin-right: 16px;
            }
            .content, .headerContent {
                flex: auto;
                color: rgba(0,0,0,.45);
                line-height: 22px;

                .link {
                    margin-top: 16px;
                    line-height: 24px;

                    a {
                        font-size: 14px;
                        margin-right: 32px;
                    }
                }
            }
            .extra {
                flex: 0 1 auto;
                margin-left: 88px;
                min-width: 242px;
                text-align: right;
            }
            .action {
                margin-left: 56px;
                min-width: 266px;
                flex: 0 1 auto;
                text-align: right;
                &:empty {
                display: none;
                }
            }
        }
    }
    .mobile {
        .main {
            .row {
                flex-wrap: wrap;
                .avatar {
                    flex: 0 1 25%;
                    margin: 0 2% 8px 0;
                }
                .content, .headerContent {
                    flex: 0 1 70%;

                    .link {
                        margin-top: 16px;
                        line-height: 24px;
                        a {
                            font-size: 14px;
                            margin-right: 10px;
                        }
                    }
                }
                .extra {
                    flex: 1 1 auto;
                    margin-left: 0;
                    min-width: 0;
                    text-align: right;
                }
                .action {
                    margin-left: unset;
                    min-width: 266px;
                    flex: 0 1 auto;
                    text-align: left;
                    margin-bottom: 12px;

                    &:empty {
                        display: none;
                    }
                }
            }
        }
    }

</style>

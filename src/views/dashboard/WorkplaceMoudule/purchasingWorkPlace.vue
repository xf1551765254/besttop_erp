<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-08-12 13:50:26
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
            <h3>公告标题
              <a-button icon="plus" size="small" style="float: right;">更多</a-button>
            </h3>
            <div class="extraTitle">本系统正在努力升级中!</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <a-row class="content_t">
        <a-col class="content_left" :span="this.flagShowHidden?'24':'19'">
          <div class="content_icon" @click="contentIconFun">
            <a-icon class="icon_right" style="color: #fff;" :type="this.flagShowHidden?'left':'right'" />
          </div>
          <div class="tables_top">
            <h3>待处理({{ num }})</h3>
            <a-table
              rowKey="code"
              :columns="categoryinfoColumns"
              :dataSource="categoryinfoData"
              size="small"
              :scroll="{ x:1500,y: 350 }"
              bordered
              :loading="loading"
              :pagination="false">
              <template slot="code" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span>
                    <a @click="editChenkFun(record)">{{ record.code }}</a>
                  </span>
                </div>
              </template>
              <template slot="action" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span>
                    <a @click="anditChenkFun(record)">{{ record.button }}</a>
                  </span>
                </div>
              </template>
            </a-table>
          </div>
          <div class="tables_bottom">
            <h3>预警提示({{ earlyWarninnum }})</h3>
            <a-table
              rowKey="code"
              :columns="earlyWarningColumns"
              :dataSource="earlyWarningData"
              size="small"
              :scroll="{ x:1500,y: 350 }"
              :loading="earlyWarninloading"
              bordered
              :pagination="false">
            </a-table>
          </div>
        </a-col>
        <a-col class="content_right" :span="this.flagShowHidden?'0':'5'">
          <menuRight/>
        </a-col>
      </a-row>
    </div>
    <GoodsPresellDeployEdit v-model="editObj.goodsPresellDeploy" :code="pamsCode" />
  </page-layout>
</template>
<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'
import PageLayout from '@/components/page/PageLayout'
import config from '@/config/defaultSettings'
import { axios } from '@/utils/request'
import menuRight from '@/views/dashboard/WorkplaceMoudule/menuRight'
import GoodsPresellDeployEdit from '@pages/purchasing/purchasingEdit/GoodsPresellDeployEdit'
export default {
    name: 'PurchasingWorkPlace',
    components: {
        PageLayout,
        menuRight,
        GoodsPresellDeployEdit
    },
    data () {
        return {
            timeFix: timeFix(),
            config,
            flagShowHidden: true,
            categoryinfoColumns: [
                { title: '模块名称', dataIndex: 'moduleName', width: 200, align: 'center' },
                { title: '单据号', dataIndex: 'code', width: 200, align: 'center', scopedSlots: { customRender: 'code' } },
                { title: '单据状态', dataIndex: 'statusName', width: 150, align: 'center' },
                { title: '新增时间', dataIndex: 'createTime', width: 200, align: 'center' },
                { title: '新增人', dataIndex: 'createName', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' },
                { title: '操作', dataIndex: 'button', fixed: 'right', width: 100, align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData: [],
            loading: false,
            num: '0',
            earlyWarningColumns: [
                { title: '模块名称', dataIndex: 'moduleName', width: 200, align: 'center' },
                { title: '单据号', dataIndex: 'code', width: 200, align: 'center', scopedSlots: { customRender: 'code' } },
                { title: '单据状态', dataIndex: 'statusName', width: 150, align: 'center' },
                { title: '新增时间', dataIndex: 'createTime', width: 200, align: 'center' },
                { title: '新增人', dataIndex: 'createName', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            earlyWarninloading: false,
            earlyWarningData: [],
            earlyWarninnum: '0',
            editObj: {
                goodsPresellDeploy: false
            },
            pamsCode: ''
        }
    },
    created () {

    },
    mounted () {
        this.getData()
        this.earlyWarningFun()
    },
    computed: {
        userInfo () {
            return this.$store.getters.userInfo
        },
        avatar () {
            return this.$store.getters.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
        }
    },
    methods: {
        ...mapGetters(['name', 'welcome']),
        contentIconFun () {
            this.flagShowHidden = !this.flagShowHidden
        },
        /**
         * @name: 编辑处理
         * @msg:
         * @param {type}
         * @return:
         */
        editChenkFun (e) {
            console.log(e)
            this.pamsCode = e.code
            this.editObj[e.moduleType] = true
        },
        /**
         * @name: 审核处理
         * @msg:
         * @param {type}
         * @return:
         */
        anditChenkFun (e) {
            console.log(e)
            const that = this
            this.$confirm({
                title: '提示',
                content: `是否${e.button}当前信息?`,
                onOk () {
                    axios({
                        path: e.buttonUrl,
                        method: 'post',
                        body: {
                            id: e.id
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.getData()
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 请求数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData () {
            this.loading = true
            axios({
                path: 'BillMeterFindMeterDataTodo',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取待处理信息', res.data)
                    this.categoryinfoData = res.data
                    this.num = this.categoryinfoData.length
                    this.loading = false
                }
            })
        },
        earlyWarningFun () {
            this.earlyWarningloading = true
            axios({
                path: 'BillMeterFindMeterDataEarlyWarning',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取待处理信息', res.data)
                    this.earlyWarningData = res.data
                    this.earlyWarninnum = this.earlyWarningData.length
                    this.earlyWarningloading = false
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'purchasingWorkPlace') {
                this.getData()
                this.earlyWarningFun()
            }
        }
    }
}
</script>

<style lang="less" scoped>
// 内容区域
.content_t{
    height: 900px;
    margin: 0 15px;
    .content_left{
        height: 900px;
        position: relative;
        .content_icon{
            position: absolute;
            right: 0;
            top: 50%;
            bottom: 50%;
            width: 25px;
            height: 40px;
            background: #999999;
            border-radius: 20px 0px 0px 20px;
            .icon_right{
                margin: 13px 10px 10px 10px;
            }
        }
        .tables_top{
            height: 450px;
            padding: 10px;
            overflow: hidden;
        }
        .tables_bottom{
            height: 450px;
            padding: 10px;
            overflow: hidden;
        }

    }
    .content_right{
        height: 900px;
        background: #999999;
        padding: 10px;
    }
}
//用户信息部分
.heard-box{
    background: #fff;
    padding: 16px 32px 0;
    border-bottom: 1px solid #e8e8e8;
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
                width: 550px;
                height: 90px;
                font-family:PingFangSC-Regular;
                color: rgba(0, 0, 0, 0.45);
            }
            .extraTitle{
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp:2;
                font-size: 12px;
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
</style>

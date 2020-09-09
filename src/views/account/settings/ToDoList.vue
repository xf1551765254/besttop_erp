<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-03-25 10:46:38
 * @LastEditTime: 2019-08-16 09:58:05
 -->
<template>
  <div>
    <a-list itemLayout="horizontal" :style="`height:${$store.getters.windowHeight-190}px;overflow:auto;`">
      <a-tabs @change="changeTab" v-model="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.name">
          <div v-if="approvalList.length<1" style="text-align: center">暂时没有新消息</div>
          <a-collapse accordion v-if="approvalList.length > 0" defaultActiveKey="0">
            <a-collapse-panel v-for="(item, index) in approvalList" :header="`${item.billName}  ${item.billCode}`" :key="index" :disabled="false">
              <a-table
                defaultExpandAllRows
                rowKey="id"
                :columns="columns"
                :dataSource="item.log"
                :pagination="false"
                :scroll="{x:500}"
                size="small"
                bordered>
              </a-table>
              <div class="rowCss" v-if="isShowAction(item)">
                <div class="title">请处理：</div>
                <a-radio-group v-model="item.result" @change="radioBoxChange($event,item)">
                  <a-radio v-for="i in item.funKeyArr" :key="i.key" :value="i.value" :disabled="item.receiveType==1&&item.readStatus==1&&i.value!='approval_fun_key:4'">{{ i.title }}</a-radio>
                </a-radio-group>
              </div>
              <div class="rowCss" v-if="item.result == 'approval_fun_key:1' && nextNodeArr.length>0">
                <div class="title">下一位处理人：</div>
                <a-select :style="{width : `calc(100% - 100px)`}" placeholder="请选择下一位处理人" v-model="item.nextNode" :options="nextNodeArr" allowClear></a-select>
              </div>
              <div class="rowCss" v-if="item.result == 'approval_fun_key:2' && item.receiveType!=0">
                <div class="title">驳回节点：</div>
                <a-select :style="{width : `calc(100% - 100px)`}" placeholder="请选择驳回节点" v-model="item.backNode" :options="nextNodeArr" allowClear></a-select>
              </div>
              <div class="rowCss" v-if="item.result == 'approval_fun_key:4'">
                <div class="title">阅办人员：</div>
                <a-select
                  :style="{width : `calc(100% - 100px)`}"
                  placeholder="请选择阅办人"
                  v-model="item.readNode"
                  mode="multiple"
                  :options="nextNodeArr"
                  allowClear></a-select>
              </div>
              <div class="rowCss" v-if="isShow(item)">
                <div class="title">审批备注：</div>
                <a-textarea :style="{width : `calc(100% - 100px)`}" placeholder="请输入备注" v-model="item.note" :autosize="true"/>
              </div>
              <div class="footerCss" v-if="activeKey == 0">
                <a-button type="primary" size="small" @click="showDetail(item)">详情</a-button>
                <a-button
                  v-if="isShow(item)"
                  class="margin-l"
                  type="primary"
                  size="small"
                  @click="subOk(item)"
                  :loading="item.loading">提交</a-button>
                <a-button v-else class="margin-l" type="primary" size="small" @click="delMessage(item)">已读</a-button>
              </div>
              <div class="footerCss" v-else>
                <a-button type="primary" size="small" @click="showDetail(item)">详情</a-button>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </a-list>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import collapseTransition from '@comp/seachBox/transition'
import is from 'is_js'
export default {
    components: { collapseTransition },
    data () {
        return {
            orderId: '',
            notes: [],
            ids: [],
            messages: [],
            approvalList: [],
            columns: [
                { title: '审批人', dataIndex: 'userName', width: 250 },
                { title: '结果', dataIndex: 'result', width: 100, align: 'center' },
                { title: '时间', dataIndex: 'createTime', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            tabs: [{ key: 0, name: '未处理' }, { key: 1, name: '我已处理' }, { key: 2, name: '我申请的' }, { key: 3, name: '抄送我的' }],
            activeKey: 0,
            funKeyConfig: [],
            nextNodeArr: []
        }
    },
    mounted () {
        this.getConfigType()
        this.activeKey = 0
    },
    methods: {
        isShowAction (item) {
            if (this.activeKey === 0) {
                if (item.receiveType === 0 || item.receiveType === 1) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        isShow (item) {
            if (this.activeKey === 0) {
                if (item.receiveType === 0 || item.receiveType === 1 || item.receiveType === 3) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        radioBoxChange (e, item) {
            this.nextNodeArr = []
            const value = e.target.value
            if (value !== 'approval_fun_key:3') {
                axios({
                    path: 'SysApprovalDefineFindNodeByResult',
                    method: 'post',
                    body: {
                        result: value,
                        billCode: item.billCode,
                        sort: item.sort
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.peopleList || []
                        if (value === 'approval_fun_key:2') {
                            data.forEach((item, index) => {
                                item.key = index
                                item.title = item.nodeName ? `${item.nodeName}：${item.code}-${item.name}` : `${item.code}-${item.name}`
                                item.value = `${item.code}-${item.name}-${item.nodeSort}`
                            })
                        } else {
                            data.forEach((item, index) => {
                                item.key = index
                                item.title = item.storeName ? `${item.storeName}：${item.code}-${item.name}` : `${item.code}-${item.name}`
                                item.value = `${item.code}-${item.name}-${index}`
                            })
                        }
                        this.nextNodeArr = [...data]
                    }
                })
            }
        },
        // 折叠面板点击
        collaoseChange (id) {
            if (id) {
                this.delMessage(id)
            }
        },
        changeTab () {
            this.getApprovalList()
        },
        getApprovalList (p = { page: 1, rows: 20 }) {
            this.approvalList = []
            const pams = (this.activeKey === 0 || this.activeKey === 1) ? { status: this.activeKey } : (this.activeKey === 2 ? { receiveType: 4 } : { receiveType: 2 })
            axios({
                path: 'SysMessageFindApprovalList',
                method: 'post',
                body: { ...p, ...pams }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list || []
                    data.forEach(item => {
                        item.billCode = item.content
                        item.defineId = item.topic
                        item.inter = item.contactId
                        item.log.forEach((i, index) => {
                            i.id = i.logId
                            i.userName = `${i.nodeName} : ${i.userName}`
                        })
                        if (this.activeKey === 0) {
                            item.note = ''
                            item.result = ''
                            // receiveType 0 部门负责人，默认同意，驳回，完成功能。 1审批人。2抄送人 只要已读功能。3阅办人，备注和提交。4.发起人
                            if (item.receiveType === 0) {
                                item.funKeyArr = this.funKeyConfig.filter(o => o.value !== 'approval_fun_key:4')
                            } else {
                                const funKeyList = item.funKey ? item.funKey.split(',') : []
                                item.funKeyArr = this.funKeyConfig.filter(o => is.inArray(o.value, funKeyList))
                            }
                        }
                    })
                    this.approvalList = [...data]
                    console.log(this.approvalList)
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
                    // item.status = 1
                    this.getApprovalList()
                    const messageCount = this.$store.getters.messageCount
                    if (messageCount > 0) {
                        this.$store.commit('SET_MESSAGE_COUNT', messageCount - 1)
                    }
                }
            })
        },
        subOk (item) {
            this.$set(item, 'loading', true)
            let pams = {}
            if (item.receiveType !== 3) {
                if (item.result.length < 1) {
                    this.$set(item, 'loading', false)
                    return this.$message.warning('请选择处理意见')
                }
                if (item.result === 'approval_fun_key:1') {
                    if (item.nextNode && item.nextNode.length > 0) {
                        pams = {
                            nextCode: item.nextNode.split('-')[0],
                            nextName: item.nextNode.split('-')[1]
                        }
                    } else if (this.nextNodeArr.length > 0) {
                        this.$set(item, 'loading', false)
                        return this.$message.warning('请选择下一位处理人')
                    }
                } else if (item.result === 'approval_fun_key:2' && item.receiveType !== 0) {
                    if (item.backNode && item.backNode.length > 0) {
                        // const key = item.backNode.split('-')[2]
                        // const obj = this.nextNodeArr.find(o => o.key.toString() === key)
                        pams = {
                            nextName: item.backNode.split('-')[1],
                            nextCode: item.backNode.split('-')[0],
                            sort: item.backNode.split('-')[2]
                        }
                    } else {
                        this.$set(item, 'loading', false)
                        return this.$message.warning('请选择驳回节点')
                    }
                } else if (item.result === 'approval_fun_key:4') {
                    if (item.readNode && item.readNode.length > 0) {
                        const readCodes = []
                        const readNames = []
                        item.readNode.forEach(o => {
                            readNames.push(o.split('-')[1])
                            readCodes.push(o.split('-')[0])
                        })
                        pams = item.logId ? { readNames, readCodes, logId: item.logId } : { readNames, readCodes }
                    } else {
                        this.$set(item, 'loading', false)
                        return this.$message.warning('请选择阅办人')
                    }
                }
            }
            // else {
            //     // 阅办人提交
            //     pams = {
            //         logId: item.logId
            //     }
            // }
            const pamsBase = {
                defineId: item.defineId,
                billCode: item.billCode,
                userCode: this.$store.getters.code,
                userName: this.$store.getters.name,
                note: item.note,
                result: item.result,
                receiveType: item.receiveType,
                inter: item.inter,
                messageId: item.id,
                logId: item.logId
            }
            axios({
                path: 'SysApprovalDefineSubmitApproval',
                method: 'post',
                body: { ...pamsBase, ...pams }
            }).then(res => {
                if (res.flag === 1) {
                    const messageCount = this.$store.getters.messageCount
                    if (messageCount > 0) {
                        this.$store.commit('SET_MESSAGE_COUNT', messageCount - 1)
                    }
                    this.$set(item, 'loading', false)
                    this.getApprovalList()
                }
            })
        },
        showDetail (item) {
            if (item.billCode) {
                this.$emit('onShowPreview', item)
            }
        },
        /**
         * @name:新增/编辑模态框获取单据类型
         */
        getConfigType () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'approval_fun_key'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const funData = res.data
                    funData.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.funKeyConfig = [...funData]
                }
                this.getApprovalList()
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
    .rowCss{
        margin-top:10px;
        display: flex;
        height: 30px;
        align-items: center;
        .title{
            width: 100px;
        }
    }
    .footerCss{
        text-align: right;
        margin-top: 5px;
    }
    .margin-l{
        margin-left: 5px;
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

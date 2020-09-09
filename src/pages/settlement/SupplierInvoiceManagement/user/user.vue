<!--
 * @Description:用户选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-27 17:55:13
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择用户"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-col :span="24">
                <a-input addonBefore="编码/名称" placeholder="请输入搜索值" @change="seach" />
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:480}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  :pagination="pagination"
                  @change="pagingChange"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.code)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.name||'未选择'}]-详情` }}</div>
              </template>
              <a-row v-for="(item, index) in details" :key="index">
                <span class="title">{{ `${item.name}：` }}</span>
                <span>{{ cacheObj[item.key] }}</span>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" :disabled="isNotSelect">确认交接</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    .ant-modal-wrap{
        z-index: 4000;
    }
    .card-box{
        max-height:540px;
        overflow:auto;
        .title{
            font-weight: bold;
        }
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
</style>

<script>
import { axios } from '@/utils/request'
import is from 'is_js'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            pagination: {
                total: 0,
                current: 1,
                pageSize: 12,
                showQuickJumper: true
            },
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '用户编码', dataIndex: 'code', width: 90 },
                { title: '用户名称', dataIndex: 'name', width: 150 },
                { title: '手机号', dataIndex: 'phone', width: 150 },
                { title: '电话', dataIndex: 'telephone', width: 120 },
                { title: '邮箱', dataIndex: 'email', width: 200 },
                { title: '职务', dataIndex: 'job', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '用户编码', key: 'code' },
                { name: '用户名称', key: 'name' },
                { name: '手机号', key: 'phone' },
                { name: '电话', key: 'telephone' },
                { name: '邮箱', key: 'email' },
                { name: '职务', key: 'job' }
            ],
            isUser: ''
        }
    },
    computed: {
        isNotSelect () {
            return this.selectedRowKeys.length > 0
        },
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        /**
         * @name: 手动设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        setTableData (data) {
            this.dataSource = data
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            if (e) {
                this.isUser = e.target.value
            }
            this.pagination.current = 1
            console.log(e)
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    condition: this.isUser
                })
            }, 500)
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData({
                skuCode: this.isUser
            })
        },
        /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */
        customRow (record, index) {
            return {
                props: {

                },
                on: {
                    click: () => {
                        this.cacheObj = record
                        if (is.empty(this.cacheObj)) {
                            this.isLoading = true
                        } else {
                            this.isLoading = false
                        }
                    },
                    mouseenter: (e) => {
                        // console.log(e);
                        // console.log(index);
                        // console.log(record);
                        // this.cacheObj = record;
                    }
                }
            }
        },
        /**
         * @name: 确认交接
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            console.log(this.$props.pams, '交接数据')
            axios({
                path: 'InvoiceJionAuditUserCode',
                method: 'past',
                body: this.$props.pams
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    this.$emit('onSelect', {})
                    this.$emit('update:visible', false)
                }
            })
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (key) {
            console.log(key)
            this.$props.pams.jionUserCode = key
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys, '222222')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}) {
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: this.pagination.current,
                rows: this.pagination.pageSize
            }, newPams)
            axios({
                path: 'PermissionsUserFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data.list, '用户')
                    this.dataSource = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
            }
        }
    }
}
</script>

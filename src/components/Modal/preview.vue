<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-04-29 16:05:34
 * @LastEditTime: 2019-08-17 17:23:07
 -->
<style lang="less">
    @import './preview.less';
</style>
<template>
  <bt-modal
    v-model="visbel"
    :title="title || $t(`menu.${$store.getters.pageName}`)"
    :orderId="orderId"
    :tags="tags"
    class="preview"
    :subBtn="false">
    <a-row>
      <a-col :span="24" v-if="$slots.summary"><div class="bisc">摘要信息</div></a-col>
      <a-col :span="24" v-if="$slots.summary">
        <div class="content">
          <slot name="summary"></slot>
        </div>
      </a-col>
      <a-col :span="24" v-if="headers.length>0"><div class="bisc">基础信息</div></a-col>
      <a-col :span="24" class="content" v-if="headers.length>0">
        <template v-for="(item, index) in headers">
          <a-col :sm="8" :md="4" :xl="3" :key="'header-l-'+index">{{ item.name }}</a-col>
          <a-col :sm="16" :md="8" :xl="5" :key="'header-r-'+index">
            <a-tooltip
              placement="top"
              :title="getHeaders(item.key)"
              :mouseEnterDelay="0.3"
              arrowPointAtCenter>
              <span class="text">{{ getHeaders(item.key) }}</span>
            </a-tooltip>
          </a-col>
        </template>
      </a-col>
    </a-row>
    <a-row>
      <div v-for="(name, index) in slotName" :key="'slot-'+index">
        <template v-if="$slots[name]">
          <a-col :span="24"><div class="bisc">{{ getSlotObj($slots[name][0]).title }}</div></a-col>
          <a-col :span="24" class="content">
            <a-table
              v-if="getSlotObj($slots[name][0]).isTable"
              rowKey="web_index"
              :scroll="{ x:widths[name], y:heights[name]}"
              :columns="columnsList[name]"
              :dataSource="dataSource[name]"
              :pagination="{hideOnSinglePage:true, defaultPageSize:9999}"
              size="small"
              bordered/>
            <slot :name="name" v-else></slot>
          </a-col>
        </template>
      </div>
    </a-row>
    <a-row>
      <a-col :span="24" v-if="$slots.compactTable"><div class="bisc">供货信息</div></a-col>
      <a-col :span="24" v-if="$slots.compactTable" class="content">
        <slot name="compactTable"></slot>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" v-if="footers.length>0"><div class="bisc">附加信息</div></a-col>
      <a-col :span="24" class="content">
        <template v-for="(item, index) in footers">
          <a-col :sm="8" :md="4" :xl="3" :key="'footer-l-'+index">{{ item.name }}</a-col>
          <a-col :sm="16" :md="8" :xl="5" :key="'footer-r-'+index">
            <a-tooltip
              placement="top"
              :title="getFooters(item.key)"
              :mouseEnterDelay="0.3"
              arrowPointAtCenter>
              <span class="text">{{ getFooters(item.key) }}</span>
            </a-tooltip>
          </a-col>
        </template>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" v-if="fileList.length>0"><div class="bisc">附件信息</div></a-col>
      <a-col :span="24" v-if="fileList.length>0" class="content">
        <upload :fileList="fileList" noUpload/>
      </a-col>
      <a-col :span="24" v-if="$slots.footer"><div class="bisc">落款信息</div></a-col>
      <a-col :span="24" v-if="$slots.footer" class="content">
        <slot name="footer"></slot>
      </a-col>
    </a-row>
    <a-row v-if="isShowApprove">
      <a-col :span="24"><div class="bisc">审批信息</div></a-col>
      <a-col :span="24" class="content">
        <a-table
          defaultExpandAllRows
          rowKey="id"
          :columns="columns"
          :dataSource="approvalList"
          :pagination="false"
          size="small"
          bordered/>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24" v-if="$slots.tag" class="content">
        <slot name="tag"></slot>
      </a-col>
    </a-row>
  </bt-modal>
</template>

<script>
import BtModal from './index'
import NewTable from '@comp/newTable'
import upload from '@comp/upload'
import is from 'is_js'
import { axios } from '@/utils/request'
export default {
    name: 'Preview',
    components: { BtModal, NewTable, upload },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        headers: {
            type: Array,
            default: () => []
        },
        content: {
            type: Object,
            default: () => {}
        },
        footers: {
            type: Array,
            default: () => []
        },
        orderId: {
            type: String,
            default: ''
        },
        tags: {
            type: Array,
            default: () => []
        },
        fileList: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            visbel: false,
            slotName: [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
            heights: {},
            columnsList: {},
            dataSource: {},
            widths: {},
            slotObj: {},
            approvalList: [],
            isShowApprove: false,
            columns: [
                { title: '审批人', dataIndex: 'userName', width: 200 },
                { title: '结果', dataIndex: 'result', width: 100, align: 'center' },
                { title: '时间', dataIndex: 'createTime', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ]
        }
    },
    methods: {
        initTable () {
            this.heights = {}
            this.slotObj = this.$slots
            console.log(this.$slots)
            Object.keys(this.slotObj).forEach(k => {
                const { isTable, columns, data } = this.slotObj[k][0].data && this.slotObj[k][0].data.attrs
                if (isTable) {
                    if (is.array(columns) && is.array(data)) {
                        const cols = columns.filter(o => (o.scopedSlots && o.scopedSlots.customRender) !== 'action')
                        let width = 200
                        const colunmArr = [{
                            title: '序号',
                            dataIndex: 'web_index',
                            width: 80,
                            align: 'center',
                            fixed: true
                        }, ...cols]
                        colunmArr.forEach(c => {
                            if (is.number(c.width)) {
                                width += c.width
                            }
                        })
                        data.forEach((i, index) => {
                            i.web_index = index + 1
                        })
                        this.columnsList[k] = colunmArr
                        this.dataSource[k] = data
                        this.widths[k] = width
                        this.heights[k] = 110 + 42 * data.length
                    }
                }
            })
        },
        getSlotObj (e) {
            return e.data && e.data.attrs
        },
        getHeaders (key) {
            const { headers } = this.$props.content
            if (headers) {
                return headers[key] || ''
            } else {
                return ''
            }
        },
        getFooters (key) {
            const { footers } = this.$props.content
            if (footers) {
                return footers[key] || ''
            } else {
                return ''
            }
        },
        getApprovalList () {
            this.isShowApprove = false
            this.approvalList.length = 0
            if (this.$props.orderId.length <= 0) {
                return
            }
            axios({
                path: 'SysApprovalLogFindLogList',
                method: 'post',
                body: {
                    billCode: this.$props.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data || []
                    data.forEach((i, index) => {
                        i.id = i.logId
                        i.userName = `${i.nodeName} : ${i.userName}`
                    })
                    this.approvalList = [...data]
                    this.isShowApprove = this.approvalList.length > 0
                }
            })
        }
    },
    watch: {
        value (val) {
            this.visbel = val
        },
        visbel (val) {
            if (!val) {
                this.$emit('input', false)
            } else {
                this.$nextTick(() => {
                    this.getApprovalList()
                    this.initTable()
                })
            }
        }
        // slotObj: {
        //     handler (val, oldval) {
        //         console.log('1111111111111111111', this.$slots)
        //         let hasTabelChange = false
        //         Object.keys(val).forEach(k => {
        //             const { isTable, data } = val[k][0].data && val[k][0].data.attrs
        //             if (isTable) {
        //                 hasTabelChange = true
        //                 console.log('data',data)
        //             }
        //         })
        //         if (hasTabelChange) {
        //             this.initTable()
        //         }
        //     },
        //     deep: true
        // }
    }
}
</script>

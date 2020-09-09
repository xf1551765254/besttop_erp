<!--
 * @Description: 用户选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-01 11:18:02
 -->
<template>
  <div>
    <bt-modal
      :subBtn="false"
      v-model="visbel"
      :title="title"
      :popconfirm="false"
      :orderId="orderId"
      :tags="tags"
    >
      <!--内容区-->
      <div>
        <a-row class="doc">
          <a-col :span="6">
            <slot name="timeLeft"></slot>
          </a-col>
          <a-col :span="18">
            <div class="tableRight">
              <a-col :span="24" v-if="headers.length>0"><div class="bisc">单据信息</div></a-col>
              <a-col :span="24" class="content">
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
              <a-col :span="24"><div class="bisc">商品信息</div></a-col>
              <a-col :span="24">
                <a-table
                  rowKey="skuCode"
                  :columns="categoryinfoColumns"
                  :dataSource="categoryinfoData"
                  :pagination="false"
                  size="small"
                  bordered
                  :scroll="scroll">
                </a-table>
              </a-col>
              <a-col :span="24">
                <a-col :span="24"><div class="bisc">派工信息</div></a-col>
                <a-col :span="24" class="content">
                  <template v-for="(item, index) in footers">
                    <a-col :sm="8" :md="4" :xl="3" :key="'header-l-'+index">{{ item.name }}</a-col>
                    <a-col :sm="16" :md="8" :xl="5" :key="'header-r-'+index">
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
              </a-col>
            </div>
          </a-col>
        </a-row>
      </div>
    </bt-modal>
  </div>
</template>
<style lang="less" scoped>
.bisc{
        width:100%;
        height:40px;
        line-height: 40px;
        margin: 10px 0 10px 0;
        padding: 0 20px;
        font-weight: bold;
        background-color: #f4f4f4;
        border: 1px solid #e1e1e1;
        @media print{
            background-color: #fff;
            border: none;
        }
}
.tableRight{
    padding-left: 30px;
    border-left: 2px solid #eeeeee;
    z-index: 555;
}
.tableRight:after{
        display: block;
        clear: both;
        content: '';
    }
</style>
<script>
import BtModal from '@comp/Modal'
export default {
    components: { BtModal },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: () => { return '' }
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
        scroll: {
            type: Object,
            default: () => {}
        },
        categoryinfoColumns: {
            type: Array,
            default: () => []
        },
        categoryinfoData: {
            type: Array,
            default: () => []
        },
        orderId: {
            type: String,
            default: () => { return '' }
        },
        tags: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            visbel: false
        }
    },
    methods: {
        getHeaders (key) {
            const { headers } = this.content
            if (headers) {
                return headers[key] || ''
            } else {
                return ''
            }
        },
        getFooters (key) {
            const { footers } = this.content
            if (footers) {
                return footers[key] || ''
            } else {
                return ''
            }
        },
        previewEditionFun (e) {
            console.log(e, '123456798')
        }
    },
    watch: {
        value (val) {
            this.visbel = val
        },
        visbel (val) {
            if (!val) {
                this.$emit('input', false)
            }
        }
    }
}
</script>

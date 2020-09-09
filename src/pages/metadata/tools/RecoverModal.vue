<!--
 * @Description: ERP
 * @Version: ^0.0.7
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-05-09 09:51:05
 * @LastEditTime: 2019-08-09 17:00:08
 -->
<template>
  <div>
    <bt-modal
      v-model="visible"
      title="删除恢复"
      :subBtn="false">
      <a-row>
        <a-popconfirm title="是否确认恢复?" @confirm="handleSubmit">
          <a-button class="btn" type="primary" size="small">恢复</a-button>
        </a-popconfirm>
        <a-popconfirm title="彻底删除后将不可恢复,是否确认删除?" @confirm="deleteRows">
          <a-button class="btn" size="small">彻底删除</a-button>
        </a-popconfirm>
      </a-row>
      <a-table
        size="small"
        rowKey="code"
        :dataSource="dataSource"
        :columns="columns"
        :pagination="{defaultPageSize:100,hideOnSinglePage:true}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
        :loading="loading"
        :scroll="{ x:getWidth, y:scrollHeight }"
        bordered>
      </a-table>
    </bt-modal>
  </div>
</template>

<script>
import is from 'is_js'
import { axios } from '@/utils/request'
import { initTableColumns } from '@comp/newTable/init'
import BtModal from '@comp/Modal'
import map from 'lodash.map'
import Formatter from '@comp/newTable/formatterComp'
export default {
    name: 'RecoverModal',
    components: { BtModal, Formatter },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            default: '1'
        },
        tableCode: {
            type: String,
            default: 'none'
        }
    },
    data () {
        return {
            visible: false,
            // 滚动区域高度
            scrollHeight: this.$store.getters.windowHeight - 310,
            columns: [],
            dataSource: [],
            loading: false,
            selectedRows: [],
            selectedRowKeys: []
        }
    },
    computed: {
        getWidth () {
            let width = 280
            this.columns.forEach(c => {
                if (is.number(c.width)) {
                    width += c.width
                }
            })
            return width
        }
    },
    methods: {
        handleSubmit () {
            if (this.selectedRows.length <= 0) {
                return this.$message.warning('请选择要恢复的数据')
            }
            const ids = map(this.selectedRows, 'id')
            axios({
                path: 'GoodsBrandRecoverList',
                method: 'post',
                body: {
                    status: this.$props.status,
                    ids: ids
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.$emit('onReload')
                    this.$emit('input', false)
                }
            })
        },
        deleteRows () {
            if (this.selectedRows.length <= 0) {
                return this.$message.warning('请选择要删除的数据')
            }
            const ids = map(this.selectedRows, 'id')
            axios({
                path: 'GoodsBrandDeleteBatch',
                method: 'post',
                body: {
                    status: this.$props.status,
                    ids: ids
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.$emit('onReload')
                    this.$emit('input', false)
                }
            })
        },
        onChange (selectedRowKeys, selectedRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRows = [...selectedRows]
        },
        getDelList () {
            this.dataSource.length = 0
            this.selectedRows.length = 0
            if (this.$props.status) {
                this.loading = true
                axios({
                    path: 'GoodsBrandFindDelList',
                    method: 'post',
                    body: {
                        status: this.$props.status
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data) {
                            for (let i = 1; i <= res.data.list.length; i++) {
                                res.data.list[i - 1]['web_index'] = i
                            }
                            this.dataSource = [...res.data.list]
                        }
                    }
                    this.loading = false
                })
            }
        },
        /**
         * @name: 设置表头
         * @msg:
         * @param {type}
         * @return:
         */
        async setTableColumns (data) {
            this.columns.length = 0
            const res = await initTableColumns(data)
            this.columns = [{
                title: '序号',
                dataIndex: 'web_index',
                width: 80,
                align: 'center',
                fixed: true
            }]
            res.forEach(item => {
                if (item.formatter !== 'Image' && item.formatter !== 'Html') {
                    this.columns.push({
                        title: item.title,
                        dataIndex: item.dataIndex,
                        width: item.width,
                        align: 'center'
                    })
                }
            })
        }
    },
    watch: {
        value (val) {
            this.visible = val
            if (val) {
                this.selectedRowKeys.length = 0
                this.setTableColumns(this.$props.tableCode).then()
                this.getDelList()
            }
        },
        visible (val) {
            this.$emit('input', val)
        }
    }

}
</script>
<style lang="less" scoped>
    .btn{
        margin:8px;
    }
</style>

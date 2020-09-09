<!--
 * @Description: 用户选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-27 09:25:55
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择商品"
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
                  rowKey="id"
                  :scroll="{x:480}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  @change="handleTableChange"
                  :pagination="pagination"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.id)" size="small" :disabled="isNotSelect">选择</a-button>
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
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple" :disabled="isNotMulSelect">选择</a-button>
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
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '商品SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 200, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 150, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 100, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '商品SKU编码', key: 'skuCode' },
                { name: '商品SKU名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '单位', key: 'skuUnit' }
            ],
            isNotSelect: false,
            pagination: {
                total: 0,
                pageSize: 12,
                current: 1,
                showQuickJumper: true
            },
            seachId: ''
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        handleTableChange (pagination) {
            console.log(pagination)
            this.pagination.current = pagination.current
            this.getData({
                condition: this.seachId
            })
        },
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
            this.seachId = e.target.value
            this.pagination.current = 1
            this.seachTimer = setTimeout(() => {
                this.getData({
                    condition: e.target.value
                })
            }, 300)
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
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.id, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                for (const i of selectDatas) {
                    i.detailId = i.id
                }
                this.$emit('onSelect', selectDatas)
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (key) {
            const selectDatas = this.dataSource.filter(o => o.id === key)
            if (selectDatas.length > 0) {
                for (const i of selectDatas) {
                    i.detailId = i.id
                }
                this.$emit('onSelect', [selectDatas[0]])
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
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
                path: 'SampleSampleExitFindExitSkuByProvider',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data.list, '商品')
                    this.pagination.total = res.data.total
                    this.dataSource = res.data.list
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-27 17:56:09
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择供应商"
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
                  :scroll="{x:1100}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  :pagination="pagination"
                  @change="pagingChange"
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
                <span>{{ cacheObj[item.id] }}</span>
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
                { title: '供应商编码', dataIndex: 'providerCode', width: 100, scopedSlots: { customRender: 'skuCode' } },
                { title: '供应商名称', dataIndex: 'providerName', width: 200 },
                { title: '合同编码', dataIndex: 'code', width: 100 },
                { title: '品类', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'businessType', width: 100 },
                { title: '操作', id: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '供应商编码', id: 'providerCode' },
                { name: '供应商名称', id: 'providerName' },
                { name: '合同编码', id: 'code' },
                { name: '品类', id: 'classCode' },
                { name: '品类名称', id: 'className' },
                { name: '品牌', id: 'brandCode' },
                { name: '品牌名称', id: 'brandName' },
                { name: '经营类型', id: 'businessType' }
            ],
            isNotSelect: false,
            isPro: ''
        }
    },
    computed: {
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
                this.isPro = e.target.value
            }
            this.pagination.current = 1
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    provider: this.isPro
                })
            }, 500)
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData({
                skuCode: this.isPro
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
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            console.log('表中的数据', this.dataSource)
            const selectDatas = this.dataSource.filter(o => is.inArray(o.id, this.selectedRowKeys))
            if (selectDatas.length > 0) {
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
        select (code) {
            const selectDatas = this.dataSource.filter(o => o.id === code)
            if (selectDatas.length > 0) {
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
                path: 'ProviderMonitorSelectProviderContractSkus',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res)
                    const arr = res.data.list
                    arr.forEach(i => {
                        if (i.businessType === 'provider_contract_business_type:1') {
                            i.businessType = '自营'
                        }
                        if (i.businessType === 'provider_contract_business_type:2' || i.businessType === 'provider_contract_business_type:3') {
                            i.businessType = '联营'
                        }
                    })
                    this.dataSource = arr
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
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

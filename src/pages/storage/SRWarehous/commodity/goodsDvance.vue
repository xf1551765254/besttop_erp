<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-06-28 15:08:34
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择预收货单"
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
            <a-row class="doc">
              <a-col :span="4">
                <span>单据号:</span>
              </a-col>
              <a-col :span="20">
                <a-input v-model="billSlelect.code" placeholder="请输入搜索值" @change="seach" />
              </a-col>
              <a-col :span="4">
                <span>开始时间:</span>
              </a-col>
              <a-col :span="8">
                <a-date-picker v-model="billSlelect.timeA" placeholder="请输入搜索值" @change="seach" />
              </a-col>
              <a-col :span="4">
                <span>结束时间:</span>
              </a-col>
              <a-col :span="8">
                <a-date-picker v-model="billSlelect.timeB" placeholder="请输入搜索值" @change="seach" />
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
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.id, record.code)" size="small" :disabled="isNotSelect">选择</a-button>
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
        <a-button @click="() => {$emit('update:visible', false)}" size="small">取消</a-button>
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
            billSlelect: {
                code: ''
                // timeA: '',
                // timeB: ''
            },
            sourceCode: '',
            invoiceAmount: '0.00',
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '单据号', dataIndex: 'code', width: 150, align: 'center' },
                { title: '供应商', dataIndex: 'providerName', width: 150, align: 'center' },
                { title: '类型', dataIndex: 'recTypeName', width: 200, align: 'center' },
                { title: '收货位置', dataIndex: 'storeName', width: 200, align: 'center' },
                { title: '收货日期', dataIndex: 'recDt', width: 100, align: 'center' },
                { title: '收货人', dataIndex: 'recByName', width: 200, align: 'center' },
                { title: '负责人', dataIndex: 'chargeUserName', width: 150, align: 'center' },
                { title: '制单时间', dataIndex: 'makeTime', width: 150, align: 'center' },
                { title: '审核时间', dataIndex: 'auditTime', width: 200, align: 'center' },
                { title: '审核人', dataIndex: 'auditUserName', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', width: 200, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '单据号', key: 'code' },
                { name: '供应商', key: 'providerName' },
                { name: '类型', key: 'recTypeName' },
                { name: '收货位置', key: 'storeName' },
                { name: '收货日期', key: 'recDt' },
                { name: '收货人', key: 'recByName' },
                { name: '负责人', key: 'chargeUserName' },
                { name: '制单时间', key: 'makeTime' },
                { name: '审核时间', key: 'auditTime' },
                { name: '审核人', key: 'auditUserName' },
                { name: '备注', key: 'note' }
            ],
            isNotSelect: false
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
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
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData(this.billSlelect)
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.code, this.selectedRowKeys))
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
        select (key, code) {
            // const selectDatas = this.dataSource.filter(o => o.code === key)
            this.sourceCode = code
            if (this.pams.billsData.length > 0) {
                const that = this
                that.$confirm({
                    title: '',
                    content: '当前操作将会清除明细列表,是否继续?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        that.findSelete(key)
                    },
                    onCancel () {

                    }
                })
            } else {
                this.findSelete(key)
            }
        },
        /**
         * @name: 获取明细
         */
        findSelete (key) {
            if (key) {
                axios({
                    path: 'DistributionBillPreEntryGet',
                    method: 'post',
                    body: {
                        id: key
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        res.data.preEntryDetaillist[0].sourceCode = this.sourceCode
                        this.$emit('onSelect', res.data.preEntryDetaillist)
                    }
                })
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
                recType: 'bill_pre_entry_rec_type:1',
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'DistributionBillPreEntryFindRkd',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                console.log(res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    console.log(this.dataSource, '预收货')
                } else {
                    this.dataSource.length = 0
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

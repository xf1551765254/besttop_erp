<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-05 16:52:20
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择采购订单"
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
                <a-date-picker v-model="billSlelect.auditTimeA" placeholder="请输入搜索值" @change="seach" />
              </a-col>
              <a-col :span="4">
                <span>结束时间:</span>
              </a-col>
              <a-col :span="8">
                <a-date-picker v-model="billSlelect.auditTimeB" placeholder="请输入搜索值" @change="seach" />
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
            billSlelect: {},
            sourceCode: '',
            invoiceAmount: '0.00',
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '单据号', dataIndex: 'code', width: 150, align: 'center' },
                { title: '制单店', dataIndex: 'storeName', width: 200, align: 'center' },
                { title: '收货店', dataIndex: 'receiveStoreCodeName', width: 200, align: 'center' },
                { title: '供应商', dataIndex: 'noteName', width: 100, align: 'center' },
                { title: '预计到货时间', dataIndex: 'expectedArrivalDate', width: 150, align: 'center' },
                { title: '收货联系电话', dataIndex: 'noteC', width: 150, align: 'center' },
                { title: '制单人', dataIndex: 'createName', width: 200, align: 'center' },
                { title: '制单日期', dataIndex: 'createTime', width: 200, align: 'center' },
                { title: '审核人', dataIndex: 'approveName', width: 100, align: 'center' },
                { title: '审核时间', dataIndex: 'approveTime', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', width: 200, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '单据号', key: 'code' },
                { name: '制单店', key: 'storeName' },
                { name: '收货店', key: 'receiveStoreCodeName' },
                { name: '供应商', key: 'noteName' },
                { name: '预计到货时间', key: 'expectedArrivalDate' },
                { name: '收货联系电话', key: 'noteC' },
                { name: '制单人', key: 'createName' },
                { name: '制单日期', key: 'createTime' },
                { name: '审核人', key: 'approveName' },
                { name: '审核时间', key: 'approveTime' },
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
                        that.findSelete(code)
                    },
                    onCancel () {

                    }
                })
            } else {
                this.findSelete(code)
            }
        },
        /**
         * @name: 获取明细
         */
        findSelete (key) {
            if (key) {
                axios({
                    path: 'DistributionBillEntryFindBillOrderDetail',
                    method: 'post',
                    body: {
                        code: key
                    }
                }).then(res => {
                    console.log(res.data, '采购订单明细')
                    if (res.flag === 1) {
                        res.data[0].sourceCode = this.sourceCode
                        this.$emit('onSelect', res.data)
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
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'DistributionBillEntryFindBillOrder',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                console.log(res)
                if (res.flag === 1) {
                    this.dataSource = res.data
                    console.log(this.dataSource, '采购订单')
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

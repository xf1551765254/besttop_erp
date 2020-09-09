<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-03 18:54:46
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="供应商付款选择"
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
              <a-col :span="4">付款截止日期</a-col>
              <a-col :span="20">
                <a-date-picker
                  style="width: 100%"
                  :disabledDate="signDtDisabledDate"
                  v-model="byTime"
                  @change="seach"
                  allowClear/>
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
                <div>{{ `详情` }}</div>
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
    @import "../../../../assets/modalStyle.less";
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
import moment from 'moment'
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
        },
        defaultSelect: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '结算单号', dataIndex: 'code', width: 80 },
                { title: '销售额', dataIndex: 'amountIn', width: 150 },
                { title: '应付金额', dataIndex: 'shouldPay', width: 50 }, // 新增
                { title: '制单人', dataIndex: 'makeUserName', width: 150 },
                { title: '制单时间', dataIndex: 'makeTime', width: 150 },
                { title: '制单位置', dataIndex: 'makeStoreName', width: 150 },
                { title: '审核人', dataIndex: 'auditUserName', width: 150 },
                { title: '审核时间', dataIndex: 'auditTime', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '结算单号', key: 'code' },
                { name: '销售额', key: 'amountIn' },
                { name: '应付金额', key: 'shouldPay' },
                { name: '制单人', key: 'makeUserName' },
                { name: '制单时间', key: 'makeTime' },
                { name: '制单位置', key: 'makeStoreName' },
                { name: '审核人', key: 'auditUserName' },
                { name: '审核时间', key: 'auditTime' }
            ],
            byTime: moment().subtract(1, 'days'),
            reserveByTime: {},
            isNotSelect: false

        }
    },
    mounted () {
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isAfter()
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
            this.reserveByTime = e
            if (e.target === undefined) {
                this.reserveByTime = e
            } else {
                this.reserveByTime = moment()
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    closeTime: moment(this.byTime).format('YYYY-MM-DD')
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
            console.log('确认选择', this.reserveByTime)
            const Obj = {
                time: this.reserveByTime,
                arr: selectDatas
            }
            if (selectDatas.length > 0) {
                this.$emit('onSelect', Obj)
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
            console.log('确认单选', this.reserveByTime)
            const Obj = {
                time: this.reserveByTime,
                arr: [selectDatas[0]]
            }
            if (selectDatas.length > 0) {
                this.$emit('onSelect', Obj)
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
                path: 'SupplierPayFindNoSum',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res)
                    this.dataSource = res.data.list
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                if (this.$props.defaultSelect.length > 0) {
                    this.selectedRowKeys = [...this.$props.defaultSelect]
                } else {
                    this.selectedRowKeys.length = 0
                }
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

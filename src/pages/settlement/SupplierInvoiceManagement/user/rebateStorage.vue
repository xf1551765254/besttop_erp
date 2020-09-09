<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-27 10:22:08
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择单据"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc antModal"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      @cancel="cancel"
      centered>
      <a-spin :spinning="spinning">
        <a-row class="doc">
          <a-form :form="form">
            <a-col :span="3">单据号:</a-col>
            <a-col :span="4">
              <a-form-item>
                <a-input v-decorator="$check('BillRebate.code')" placeholder="请输入搜索值" />
              </a-form-item>
            </a-col>
            <a-col :span="3">开始时间:</a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker
                  style="width: 100%"
                  :disabledDate="signDtDisabledBeginTime"
                  v-decorator="$check('BillRebate.beginTime',{initialValue: beginTime})"
                />
              </a-form-item>
            </a-col>
            <a-col :span="3">结束时间:</a-col>
            <a-col :span="4">
              <a-form-item>
                <a-date-picker
                  style="width: 100%"
                  :disabledDate="signDtDisabledDate"
                  v-decorator="$check('BillRebate.endTime',{initialValue: endTime})"
                />
              </a-form-item>
            </a-col>
            <a-col :span="2">
              <a-button type="primary" @click="seach">查询</a-button>
            </a-col>
          </a-form>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="24">
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:480}"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  :pagination="pagination"
                  @change="pagingChange"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record)" size="small" >选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>

        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="() => {$emit('update:visible', false)}" size="small" >取消</a-button>
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
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>

<script>
import moment from 'moment'
import { axios } from '@/utils/request'
import is from 'is_js'
export default {
    name: 'RebateStorage',
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
            endTime: moment().startOf('day'),
            beginTime: moment().startOf('day').subtract({ days: 7 }),
            form: this.$form.createForm(this),
            rebateSelect: {},
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '验收单号', dataIndex: 'code', width: 150, align: 'center' },
                { title: '验收位置', dataIndex: 'entryMakeStoreCode', width: 150, align: 'center' },
                { title: '验收位置', dataIndex: 'entryMakeStoreName', width: 150, align: 'center' },
                { title: '供应商编码', dataIndex: 'provider', width: 200, align: 'center' },
                { title: '供应商名称', dataIndex: 'providerName', width: 200, align: 'center' },
                { title: '收货人', dataIndex: 'entryByName', width: 200, align: 'center' },
                { title: '收货时间', dataIndex: 'entryTime', width: 200, align: 'center' },
                { title: '订货位置编码', dataIndex: 'orderMakeStoreCode', width: 200, align: 'center' },
                { title: '订货位置名称', dataIndex: 'orderMakeStoreName', width: 200, align: 'center' },
                { title: '订货人', dataIndex: 'orderByName', width: 200, align: 'center' },
                { title: '负责人', dataIndex: 'directorByName', width: 200, align: 'center' },
                { title: '发票总额', dataIndex: 'amountInvoice', width: 200, align: 'center' },
                { title: '源单据号', dataIndex: 'sourceCode', width: 200, align: 'center' },
                { title: '订单号', dataIndex: 'orderCode', width: 100, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '验收单号', key: 'code' },
                { name: '验收位置', key: 'entryMakeStoreCode' },
                { name: '验收位置', key: 'entryMakeStoreName' },
                { name: '供应商编码', key: 'provider' },
                { name: '供应商名称', key: 'providerName' },
                { name: '源单据号', key: 'sourceCode' },
                { name: '订单号', key: 'orderCode' },
                { name: '收货人', key: 'entryByName' },
                { name: '收货时间', key: 'entryTime' },
                { name: '订货位置编码', key: 'orderMakeStoreCode' },
                { name: '订货位置名称', key: 'orderMakeStoreName' },
                { name: '订货人', key: 'orderByName' },
                { name: '负责人', key: 'directorByName' },
                { name: '发票总额', key: 'amountInvoice' }
            ],
            seachObj: {}
        }
    },
    methods: {
        cancel () {
            console.log(222222)
            this.$emit('update:visible', false)
        },
        signDtDisabledBeginTime (e) {
            // return moment(e).isBefore(moment().startOf({ days: 6 }), moment())
            return moment(e).add({ days: 1 }).isAfter()
        },
        signDtDisabledDate (e) {
            return moment(e).isAfter(moment().startOf('day'))
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
        seach () {
            this.pagination.current = 1
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    if (Number(values.beginTime.unix()) > Number(values.endTime.unix())) {
                        return this.$message.warning('开始时间不能大于结束时间!')
                    }
                    values.beginTime = moment(values.beginTime).format('YYYY-MM-DD')
                    values.endTime = moment(values.endTime).format('YYYY-MM-DD')
                    this.seachObj = values
                    this.getData(values)
                }
            })
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData(
                this.seachObj
            )
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
                this.selectedRowKeys.length = 0
            }
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
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (row) {
            console.log(row)
            if (row.code) {
                axios({
                    path: 'InvoiceRebateFindEntryDetailByEntryCode',
                    method: 'POST',
                    body: {
                        entryCode: row.code
                    }
                }).then(res => {
                    console.log(res, 'danxuan')
                    if (res.data.list.length > 0) {
                        res.data.list[0].amountInvoice = row.amountInvoice
                        this.$emit('amountInvoice', row.amountInvoice)
                        this.$emit('update:visible', false)
                    } else {
                        this.$message.warning('当前单据下未查到数据!')
                    }
                    if (res.flag === 1) {
                        console.log(res.data, '明细')
                        for (const i of res.data.list) {
                            i.Bool = true
                            i.entryDetailId = i.id
                        }
                        this.$emit('onSelect', res.data.list)
                    }
                })
            }
        },
        /**
         * @name: 时间监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (date) {
            console.table(date, '时间')
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
                path: 'InvoiceRebateFindAuditEntryByProvider',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                console.log(res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({})
                this.selectedRowKeys.length = 0
            }
        }
    }
}
</script>

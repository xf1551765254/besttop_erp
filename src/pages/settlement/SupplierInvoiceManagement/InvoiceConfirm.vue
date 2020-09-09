<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-07-29 17:28:28
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach" >
      <a-button v-action:verify style="margin-left:10px;" type="primary" size="small" @click="verify(1)">发票确认</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      @onSelect="onChangeTable">
    </NewTable>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'InvoiceConfirm',
    components: { seachBox, NewTable },
    data () {
        return {
            // 主表多选选中
            deleteAll: [],
            // 表头id
            tableCode: '',
            // 接口
            tableApiPath: '',
            // 搜索框默认值
            seachValue: {
                beginMakeTime: moment().subtract({ days: 7 }),
                endMakeTime: moment()
            },
            // 工具栏搜索框
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单开始时间',
                    key: 'beginMakeTime',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'endMakeTime',
                    type: 'date'
                },
                {
                    // title: '确认状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'invoice_record_confirm_status', grade: '1' }
                    title: '确认状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'makeUserCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }

            ],
            // 工具栏按钮定义
            btns: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '512d4a3a365c4c4b9201e06d1ca74cf8:InvoiceConfirm'
            this.tableApiPath = 'InvoiceBlendFindConfirmation'
        })
        getStatus('invoice_record_confirm_status', this.conditions[3])
        this.seachValue = {
            status: 'invoice_record_confirm_status:1',
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment()
        }
    },
    methods: {
        verify () {
            if (this.deleteAll.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
                return
            }
            const that = this
            this.$confirm({
                title: '发票确认',
                content: '是否确认当前选中?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'InvoiceBlendUpdateConfirmation',
                        method: 'post',
                        body: { ids: that.deleteAll }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.getDate()
                        }
                    })
                }
            })
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'InvoiceBlendFindConfirmation'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('512d4a3a365c4c4b9201e06d1ca74cf8:InvoiceConfirm', { path: 'InvoiceBlendFindConfirmation' })
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: Reat
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-27 09:28:33
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach" >
      <a-button v-action:verify style="margin-left:10px;" type="primary" size="small" @click="userSelect">交接人</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      @onSelect="onChangeTable">
    </NewTable>
    <users :visible.sync="userQuery" @onSelect="onUserSelect" :pams="userAll"></users>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>
<script>
import users from '@pages/settlement/SupplierInvoiceManagement/user/user'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import is from 'is_js'
import map from 'lodash.map'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'InvoiceDelivery',
    components: { seachBox, NewTable, users },
    data () {
        return {
            // 控制交接人弹窗
            userQuery: false,
            // 主表多选选中
            userAll: {
                ids: []
            },
            // 表头id
            tableCode: '',
            // 接口
            tableApiPath: '',
            // 搜索框默认值
            seachValue: {
                timeA: moment().subtract({ days: 7 }),
                timeB: moment()
            },
            // 工具栏搜索框
            conditions: [
                {
                    title: '供应商',
                    type: 'select',
                    key: 'provider',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                },
                {
                    title: '交接时间',
                    key: 'timeA',
                    type: 'date'
                },
                {
                    title: '至',
                    key: 'timeB',
                    type: 'date'
                },
                {
                    // title: '交接状态',
                    // type: 'select',
                    // key: 'jionStatus',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'invoice_jion_jion_status', grade: '1' }
                    title: '交接状态',
                    key: 'jionStatus',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '交接人',
                    key: 'jionUserCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }

            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'ad3c696738064d1bae8a5fce31e3a540:InvoiceDelivery'
            this.tableApiPath = 'InvoiceJionFindJion'
        })
        getStatus('invoice_jion_jion_status', this.conditions[3])
        this.seachValue = {
            jionStatus: 'invoice_jion_jion_status:1',
            timeA: moment().subtract({ days: 7 }),
            timeB: moment()
        }
    },
    methods: {
        userSelect () {
            if (this.userAll['ids'].length === 0) {
                return this.$message.warning('请先选择交接单!')
            }
            this.userQuery = true
        },
        /**
         * @name:确认交接
         */
        onUserSelect (e) {
            this.userAll = e
            console.log(e, '55555555555')
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
            e.path = 'InvoiceJionFindJion'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.userAll.ids = []
            for (const i of rows) {
                this.userAll.ids.push(i.id)
            }
            console.log(this.userAll, '多选')
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('ad3c696738064d1bae8a5fce31e3a540:InvoiceDelivery', { path: 'InvoiceJionFindJion' })
        }
    },
    watch: {
        userQuery: {
            handler (val, oldval) {
                if (!val) {
                    this.getDate()
                    if (this.userAll['ids']) {
                        this.userAll['ids'].length = 0
                    }
                }
            }
        }
    }
}
</script>

<!--
 * @Description: 促销券监控
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-09 10:12:32
 * @LastEditors: lin
 * @LastEditTime: 2019-08-14 14:01:41
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :rowSelect="false"
      :pams="seachValue">
    </NewTable>
    <!-- 详情弹框 -->
    <a-modal
      v-model="previewVisible"
      title="详情"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-table
        rowKey="id"
        :columns="tableColumns"
        :dataSource="tableData"
        :scroll="{x:1470 ,y:460}"
        size="small"
        :pagination="false"
        bordered >
      </a-table>
      <div slot="footer">
        <a-button @click="previewVisible=false" type="primary" size="small">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    components: { NewTable, SeachBox },
    name: 'HappenLog',
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '编码'
                },
                {
                    key: 'name',
                    type: 'input',
                    title: '规则名称'
                },
                {
                    key: 'validateStartTime',
                    type: 'date',
                    title: '创建开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'validateEndTime',
                    type: 'date',
                    title: '创建结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'label',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                },
                {
                    key: 'publishRange',
                    type: 'select',
                    title: '投放范围',
                    label: 'label',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                }
            ],
            btns: ['export', 'print'],
            seachValue: {
                validateStartTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                validateEndTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path

            moenuOPT: [
                { name: '预览',
                    action: 'CouponMonitoring.get',
                    fc: this.detailHandler
                }
            ],
            // 预览
            previewVisible: false,
            spinning: false,
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '顾客编码', dataIndex: 'customerCode', align: 'center', width: 100 },
                { title: '顾客名称', dataIndex: 'customerName', align: 'center', width: 120 },
                { title: '顾客手机号', dataIndex: 'customerPhone', align: 'center', width: 120 },
                { title: '券金额', dataIndex: 'couponAmount', align: 'center', width: 100 },
                { title: '状态', dataIndex: 'stateName', align: 'center', width: 100 },
                { title: '领用时间', dataIndex: 'createTime', align: 'center', width: 150 },
                { title: '被转增人编码', dataIndex: 'sendBy', align: 'center', width: 100 },
                { title: '被转赠人', dataIndex: 'sendByName', align: 'center', width: 100 },
                { title: '转赠时间', dataIndex: 'sendTime', align: 'center', width: 150 },
                { title: '分享人编码', dataIndex: 'shareBy', align: 'center', width: 100 },
                { title: '分享人', dataIndex: 'shareByName', align: 'center', width: 100 },
                { title: '分享时间', dataIndex: 'shareTime', align: 'center', width: 150 }
            ],
            tableData: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '98748bc8024c4050ad57b0387bf31db6:CouponMonitoring'
            this.tableApiPath = 'ScheduMoniterQueryList'
            this.$refs.newTable.setContextmenu(this.moenuOPT)
        })
        this.getPublishRangeDropArr()
        this.getStatusDropArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'ScheduMoniterQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('ScheduMoniterQueryList')
            }
        },
        /**
         * @name:范围
         */
        getPublishRangeDropArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'schedule_coupon_publish_publish_range'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.label = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[5], 'selectDataArr', dataArr)
                }
            })
        },
        // 状态
        getStatusDropArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'schedule_coupon_publish_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.label = i.value
                        i.key = `${i.type}:${i.configKey}`
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[4], 'selectDataArr', dataArr)
                }
            })
        },
        detailHandler (detailData) {
            this.previewVisible = true
            this.tableData = [...detailData.customerScheduleCouponList]
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CouponMonitoring') {
                this.getPublishRangeDropArr()
                this.getStatusDropArr()
            }
        },
        'seachValue.validateStartTim' (val, oldVal) {
            if (val && this.seachValue.validateEndTime) {
                if (moment(val).isAfter(this.seachValue.validateEndTime)) {
                    this.seachValue.validateEndTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.validateEndTime' (val, oldVal) {
            if (val && this.seachValue.validateStartTim) {
                if (moment(val).isBefore(this.seachValue.validateStartTim)) {
                    this.seachValue.validateStartTim = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: V0.0.10
 * @Company: BestTop
 * @Author: shuai
 * @Date: 2019-07-29 19:38:14
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 15:00:49
 -->
<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-07-24 12:16:04
 -->
<template>
  <div>
    <div style="margin:10px 0px">
      <a-button
        class="billType"
        v-for="(item, index) in billTypeList"
        :key="index"
        @click="billTypeChange(item)"
        :style="{background: item.backColor, color: item.color}"
      >{{ item.name }}({{ item.am }})
      </a-button>
    </div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="workOrderAffirm(-1)">派工确认</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="canCelWorkOrder(-1)">暂不发货</a-button>
    </seachBox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <!-- 取消派工 -->
    <a-modal
      v-model="dispatchOffVisible"
      title="取消派工"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="400"
      class="doc"
      :bodyStyle="{height:'250px',width:'400px'}"
      destroyOnClose
      centered>
      <div>
        <h4>确定取消派工?</h4>
        <div>
          取消原因:
          <a-select
            style="width: 100%"
            v-model="dispatchOffObj.chacelNote"
            :options="cancelList"
            allowClear
            showSearch/>
        </div>
        预约送货时间:
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :disabledDate="disabledDate"
          showTime
          v-model="dispatchOffObj.sendTime"
          style="width: 100%"
        />
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="dispatchOffObj.note" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => dispatchOffVisible = false" size="small" >取消</a-button>
        <a-button @click="oncancelSelect(1)" type="primary" size="small" >待派工</a-button>
        <a-button @click="oncancelSelect(0)" type="primary" size="small" >待分拣</a-button>
      </div>
    </a-modal>
    <!-- 派工确认 -->
    <a-modal
      v-model="affirmVisible"
      title="派工确认"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="400"
      class="doc"
      :bodyStyle="{height:'250px',width:'400px'}"
      destroyOnClose
      centered>
      <h4>是否确认派工?</h4>
      <div>
        预约送货时间:
        <div>
          <span class="time">{{ storageObj.sendTime }}</span>
          <a-time-picker @change="onTimeChange" v-model="sendTimes" style="width: 76%" />
        </div>
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="storageObj.note" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => affirmVisible = false" size="small" >否</a-button>
        <a-button @click="onaffirmSelect(storageObj)" type="primary" size="small" >是</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<style lang="less" scoped>
.billType {
    margin: 0 10px;
}
.time {
    display: inline-block;
    line-height: 30px;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    padding-left: 10px;
    border-right:0;
    background:rgb(250, 250, 250);
}
</style>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
export default {
    name: 'DispatchingAffirmManage',
    components: {
        SeachBox,
        NewTable,
        detailsPreview
    },
    data () {
        return {
            sendTimes: moment(),
            pams: {},
            detailsTitle: '派工确认管理详情',
            previewVisbel: false,
            // title按钮
            billTypeList: [
                {
                    name: '全部',
                    am: 0,
                    billType: '',
                    backColor: '#1890ff',
                    color: '#fff'
                },
                {
                    name: '零售',
                    am: 0,
                    billType: 'bill_deliver_sale_type:1',
                    color: '#606266'
                },
                {
                    name: '分销',
                    am: 0,
                    billType: 'bill_deliver_sale_type:2',
                    color: '#606266'
                },
                {
                    name: '内部调拨',
                    am: 0,
                    billType: 'bill_deliver_sale_type:3',
                    color: '#606266'
                },
                {
                    name: '第三方派单',
                    am: 0,
                    billType: 'bill_deliver_sale_type:4',
                    color: '#606266'
                }
            ],
            billTypeBtn: '',
            // 工具栏
            conditions: [
                {
                    key: 'dateType',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 0, label: '销售日期' },
                        { value: 1, label: '预约送货时间' }
                    ]
                },
                {
                    title: '开始时间',
                    key: 'saleDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'saleAsDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '综合查询',
                    type: 'input',
                    key: 'condy',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '提货位置',
                    key: 'pickStoreCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    title: '品牌',
                    type: 'input',
                    key: 'brandCode',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '品类',
                    key: 'classCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'GoodsCategoryFindTreeOption'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 'bill_deliver_status:3', label: '待确认' },
                        { value: 'bill_deliver_status:4', label: '待出库' }
                    ]
                },
                {
                    title: '线路',
                    key: 'route',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                }
            ],
            btns: ['del', 'export', 'print'],
            seachValue: {
                saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: 1,
                status: 'bill_deliver_status:3'
            },
            // 主表
            tableCode: 'f9f2ed8775264ec49ddec81c5726aabd:DispatchingAffirmManage',
            tableApiPath: 'DeliverDivisionFindAffirm',
            disContextMenu: [],
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '派工确认',
                    action: 'DispatchingAffirmManage.add',
                    fc: this.workOrderAffirm
                },
                {
                    name: '暂不发货',
                    action: 'DispatchingAffirmManage.add',
                    fc: this.canCelWorkOrder
                },
                {
                    name: '预览',
                    action: 'DispatchingAffirmManage.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            // 取消派工
            dispatchOffVisible: false,
            dispatchOffObj: {},
            cancelList: [],
            cancelId: [],
            affirmVisible: false,
            storageObj: {}

        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableCode = 'f9f2ed8775264ec49ddec81c5726aabd:DispatchingAffirmManage'
            // this.tableApiPath = 'DeliverDivisionFindAffirm'
            this.$refs.newTable.setTableColumns(this.tableCode)
            this.$refs.newTable.setContextmenu(this.rightMenu)
            this.onSeach(this.seachValue)
        })
    },
    methods: {
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '送货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '送货单来源', code: e.billTypeName },
                { name: '预约送货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        /**
         * @name: 派工确认
         * @msg:
         * @param {type}
         * @return:
         */
        onaffirmSelect (e) {
            if (!this.sendTimes) { return this.$message.error('请选择预约送货时间!') }
            const obj = { ...e }
            obj.sendTime = moment(this.sendTimes).format('YYYY-MM-DD HH:mm:ss')
            obj.ids = this.cancelId
            axios({
                path: 'BillDeliverUpdateConfirmDispatching',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    this.onSeach(this.seachValue)
                    this.affirmVisible = false
                }
            })
        },
        onTimeChange (time) {
            console.log(time, '444444444444444')
        },
        workOrderAffirm (e) {
            this.cancelId = []
            this.storageObj = {}
            this.sendTimes = moment()
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                this.cancelId = map(this.selectArr, 'id')
                this.storageObj.sendTime = moment().format('YYYY-MM-DD')
                this.sendTimes = moment()
            } else {
                this.cancelId = [e.id]
                this.storageObj.sendTime = moment(e.sendTime).format('YYYY-MM-DD')
                this.sendTimes = moment(e.sendTime)
            }
            this.affirmVisible = true
        },
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        },
        /**
         * @name: 取消派工
         * @msg:
         * @param {type}
         * @return:
         */
        oncancelSelect (e) {
            console.log(this.dispatchOffObj)
            if (!this.dispatchOffObj.sendTime) { return this.$message.error('请选择预约取货时间!') }
            if (!this.dispatchOffObj.chacelNote) { return this.$message.error('请选择取消原因!') }
            const obj = { ...this.dispatchOffObj }
            obj.sendTime = moment(obj.sendTime).format('YYYY-MM-DD HH:mm:ss')
            if (e === 0) {
                obj.changeType = 0
            } else {
                obj.changeType = 1
            }
            obj.ids = this.cancelId
            axios({
                path: 'BillDeliverUpdateCancelDispatching',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    this.dispatchOffObj = {}
                    this.onSeach(this.seachValue)
                    this.dispatchOffVisible = false
                }
            })
        },
        /**
         * @name: 取消派工
         * @msg:
         * @param {type}
         * @return:
         */
        canCelWorkOrder (e) {
            this.dispatchOffObj = {}
            this.cancelId = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                this.cancelId = map(this.selectArr, 'id')
            } else {
                this.cancelId = [e.id]
            }
            this.onSelectConfig('bill_deliver_log_happen_type_work')
            this.dispatchOffVisible = true
        },
        /**
         * @name: 取消原因
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectConfig (type) {
            // 取消原因
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: type
                }
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('取消原因', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.configKey
                        i.title = i.value
                    })
                    this.cancelList = [...data]
                }
            })
        },
        /**
         * @name: title按钮切换
         * @msg:
         * @param {type}
         * @return:
         */
        billTypeChange (e) {
            this.billTypeBtn = e.billType
            for (const i of this.billTypeList) {
                if (e.billType === i.billType) {
                    i.backColor = '#1890ff'
                    i.color = '#fff'
                } else {
                    i.backColor = ''
                    i.color = '#606266'
                }
            }
            this.seachValue.billType = e.billType
            this.onSeach(this.seachValue)
        },
        /**
         * @name: 工具栏按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'add') {
                // console.log('新增')
            } else if (e === 'del') {
                // console.log('批量删除')
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DeliverDivisionFindAffirm', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {
                billType: this.billTypeBtn
            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            axios({
                path: 'DeliverDivisionFindAffirm',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    // 获取单据状态数量
                    this.billTypeList.forEach(e => {
                        if (e.billType === '') {
                            e.am = data.typeDsf + data.typeLs + data.typeFx + data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:1') {
                            e.am = data.typeLs
                        } else if (e.billType === 'bill_deliver_sale_type:2') {
                            e.am = data.typeFx
                        } else if (e.billType === 'bill_deliver_sale_type:3') {
                            e.am = data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:4') {
                            e.am = data.typeDsf
                        }
                    })
                    this.$set(this.conditions[8], 'selectDataArr', data.routes)
                    // this.$refs.newTable.setTableData(data.list, { path: 'DeliverDivisionFindAffirm' })
                    const obj = Object.assign(this.seachValue, { path: 'DeliverDivisionFindAffirm' })
                    this.$refs.newTable.reload(this.tableCode, obj)
                }
            })
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            // if (status === 'bill_deliver_status:1') {
            //     this.disContextMenu = []
            // } else if (status === 'bill_deliver_status:2') {
            //     this.disContextMenu = []
            // }
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
        },
        disabledDates (current) {
            return true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'DispatchingAffirmManage') {
            }
        }
    }
}
</script>

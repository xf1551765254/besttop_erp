<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-30 09:14:23
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 16:16:31
 -->
<!-- 派工确认管理 -->
<template>
  <div class="mine">
    <header>
      <span class="headTypeBtn">
        <a-button
          v-action:query
          v-for="(item, index) in TypeBtnList"
          :key="index"
          @click="billTypeChange(item)"
          :style="{background: item.backColor, color: item.color}"
          class="billType">{{ item.name }}({{ item.am }})
        </a-button>
      </span>
    </header>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:add style="margin-right:20px;" type="primary" size="small" @click="onDispatchConfirmation(-1)">派工确认</a-button>
      <a-button v-action:add type="primary" size="small" @click="onCancelDispatching(-1)">暂不取货</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onChangeTable">
    </NewTable>
    <!-- 取消派工 -->
    <a-modal
      v-model="cancelDispatchVisible"
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
        <h4>是否确认取消当前已派工单据?</h4>
        <div>
          取消原因:
          <a-select
            style="width: 100%"
            v-model="cancelObj.cancelReason"
            :options="cancelList"
            allowClear
            showSearch/>
        </div>
        预约取货时间:
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :disabledDate="disabledDate"
          :defaultValue="reginsterDates"
          showTime
          v-model="cancelObj.sendTimes"
          style="width: 100%"
        />
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="cancelObj.sendNote" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => cancelDispatchVisible = false" size="small" >否</a-button>
        <a-button @click="oncancelSelect(cancelObj)" type="primary" size="small" >是</a-button>
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
      <div>
        预约送货时间:
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :disabledDate="disabledDate"
          :defaultValue="reginsterDates"
          showTime
          v-model="storageObj.sendTimes"
          style="width: 100%"
        />
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="storageObj.sendNote" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => affirmVisible = false" size="small" >否</a-button>
        <a-button @click="onaffirmSelect(storageObj)" type="primary" size="small" >是</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import user from '@pages/storage/LogisticsDistributionManagement/users/user'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import moment from 'moment'
export default {
    name: 'ExchangeConfirmation',
    components: { NewTable, seachBox, user, detailsPreview },
    data () {
        return {
            pams: {},
            detailsTitle: '派工确认详情',
            previewVisbel: false,
            storageObj: {
                sendTimes: moment()
            },
            cancelList: [],
            cancelObj: {
                sendTimes: moment()
            },
            codes: '',
            userPams: {},
            tempObjArr: [],
            auxiliaryArr: [],
            vehicleArr: [],
            driverArr: [],
            dispatchObj: {},
            affirmVisible: false,
            deliveryVisible: false,
            cancelDispatchVisible: false,
            reginsterDates: moment(),
            dispatchTable: '',
            schedulingGroupArr: [],
            disContextMenu: [],
            schedulingGroupCodeName: '',
            btns: ['export', 'print'],
            seachValue: {},
            tableCode: '',
            tableApiPath: '',
            MenuOperations: [
                {
                    name: '派工确认',
                    action: 'ExchangeConfirmation.add',
                    fc: this.onDispatchConfirmation
                },
                {
                    name: '暂不取货',
                    action: 'ExchangeConfirmation.add',
                    fc: this.onCancelDispatching
                },
                {
                    name: '预览',
                    action: 'ExchangeConfirmation.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            conditions: [
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
                    title: '退货位置',
                    key: 'pickStoreCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    title: '线路',
                    key: 'routeCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'DistributionReturnsFindRouteNumber'
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
                }
            ],
            TypeBtnList: [
                {
                    name: '全部',
                    am: 0,
                    billType: '',
                    backColor: 'rgba(24,144,255,1)',
                    color: '#fff'
                },
                {
                    name: '零售',
                    am: 0,
                    billType: 'bill_deliver_sale_type:1',
                    color: '#000'
                },
                {
                    name: '分销',
                    am: 0,
                    billType: 'bill_deliver_sale_type:2',
                    color: '#000'
                }
            ]
        }
    },
    mounted () {
        this.seachValue = {
            saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            pickStoreCode: this.$store.getters.storeInfo.code
        }
        this.$nextTick(() => {
            this.$refs.newTable.setContextmenu(this.MenuOperations)
            this.tableCode = '9323ead611ec471182310c8957692c74:AssignWorkersToConfirmManagement'
            this.tableApiPath = 'DistributionReturnsFindChangeConfirm'
        })
        this.getAll()
        this.getTypeStatistics()
    },
    methods: {
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '换货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '预约取货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_returns_status:2') {
                this.disContextMenu = ['暂不取货']
            } else {
                this.disContextMenu = ['派工确认']
            }
        },
        /**
         * @name:派工确认
         */
        onDispatchConfirmation (e) {
            const err = []
            if (this.deleteAll.length > 0 && e === -1) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:2') {
                        err.push(i)
                    }
                }
            } else if (this.deleteAll.length === 0 && e === -1) {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `单据${i.code}状态为:${i.statusName},无法操作派工确认!`
                    })
                }
            } else {
                if (e !== -1) {
                    this.deleteAll = [e]
                }
                this.affirmVisible = true
            }
        },
        /**
         * @name:派工确认提交
         */
        onaffirmSelect (e) {
            const ids = []
            console.log(e)
            if (!e.sendTimes) { return this.$message.error('请选择预约送货时间!') }
            e.sendTime = moment(e.sendTimes).format('YYYY-MM-DD HH:mm:ss')
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            console.log(e)
            axios({
                path: 'DistributionReturnsUpdateConfirmDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.storageObj = {}
                    this.getDate()
                    this.getTypeStatistics()
                    this.affirmVisible = false
                }
            })
        },
        /**
           * @name:点击取消派工按钮
           */
        onCancelDispatching (e) {
            this.dispatchObj = {}
            const err = []
            if (this.deleteAll.length > 0 && e === -1) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:2') {
                        if (i.status !== 'bill_returns_status:3') {
                            err.push(i)
                        }
                    }
                }
            } else if (this.deleteAll.length === 0 && e === -1) {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `单据${i.code}状态为:${i.statusName},无法操作取消派工!`
                    })
                }
            } else {
                this.cancelDispatchVisible = true
            }
        },
        /**
           * @name:派工取消提交
           */
        oncancelSelect (e) {
            console.log(e, '555')
            const ids = []
            if (!e.sendTimes) { return this.$message.error('请选择预约取货时间!') }
            if (!e.cancelReason) { return this.$message.error('请选择取消原因!') }
            e.sendTime = moment(e.sendTimes).format('YYYY-MM-DD HH:mm:ss')
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            console.log(e)
            axios({
                path: 'DistributionReturnsUpdateCancelDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.getDate()
                    this.cancelDispatchVisible = false
                }
            })
        },
        /**
         * @name: 类型数量统计
         */
        getTypeStatistics () {
            const obj = { ...this.seachValue }
            obj.serviceType = 'bill_returns_service_type:2'
            obj.status = 'bill_returns_status:2'
            console.log(obj, '查询数量')
            axios({
                path: 'DistributionReturnsFindChangeConfirm',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    for (const i of this.TypeBtnList) {
                        if (i.billType === 'bill_deliver_sale_type:1') {
                            i.am = data.typeLs || 0
                        } else if (i.billType === 'bill_deliver_sale_type:2') {
                            i.am = data.typeFx || 0
                        } else {
                            i.am = this.$math.add(data.typeLs || 0, data.typeFx || 0, 0)
                        }
                    }
                }
            })
        },
        /**
           * @name:点击单据类型
           */
        billTypeChange (e) {
            // console.log(e)
            for (const i of this.TypeBtnList) {
                if (e.billType === i.billType) {
                    i.backColor = '#1890ff'
                    i.color = '#fff'
                } else {
                    i.backColor = ''
                    i.color = '#000'
                }
            }
            // this.billMessage({ billType: e.billType })
            this.seachValue.billType = e.billType
            this.onSeach(this.seachValue)
        },
        getAll () {
            // 取消派工原因
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_deliver_log_happen_type_out'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('取消原因', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.configKey
                        i.title = i.value
                    })
                    this.cancelList = [...data]
                }
            })
            // 机构
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.$set(this.conditions[3], 'selectDataArr', data)
                }
            })
        },
        onSeach (e = {}) {
            this.seachValue.path = 'DistributionReturnsFindChangeConfirm'
            this.$refs.newTable.setTableData(this.tableCode, e)
            this.getTypeStatistics()
        },
        /**
           * @name:监听工具栏按钮
           */
        onSeachClick (e) {
            if (e === 'add') {
                // console.log('新增')
            } else if (e === 'del') {
                // console.log('批量删除')
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionReturnsFindChangeConfirm', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        onReload () {
            this.seachValue = {}
        },
        /**
           * @name:表格多选方法
           */
        onChangeTable (keys, rows) {
            this.deleteAll = [...rows]
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        getDate () {
            this.$refs.newTable.setTableData('9323ead611ec471182310c8957692c74:AssignWorkersToConfirmManagement', { path: 'DistributionReturnsFindChangeConfirm' })
        },
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        }
    }
}
</script>
  <style lang="less" scoped>
  @import "../map/map";
  .mapAll {
      position: fixed;
      top: 200px;
      right: 0;
      left: 60%;
      bottom: 10%;
      background: pink;
      transition: 1.5s;
      z-index: 2;
      .maskRight{
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 100;
      }
  }
  header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      .headTypeBtn {
          float: left;
          .billType {
          margin-left: 20px;
          }
      }
      .headNapControl {
          float: right;
      }
  }
  .clientService {
      overflow-y: auto;
      padding: 5px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      .doc {
          .ant-input-number {
              width:100%;
          }
      }
      .mintBox {
          margin-bottom: 10px;
          font-size: 12px;
          border: 1px solid #ccc;
          hr {
              margin: 0;
          }
          .mintHead {
              padding: 5px;
          }
          .mintMid {
              height: 82px;
              box-sizing: border-box;
              overflow: hidden;
              .mintImg {
                  .img {
                      padding:0;
                      border:0;
                      width: 60px;
                      height: 60px;
                      position: absolute;
                      top: 50%;
                      margin-top: -30px;
                  }
                  width: 80px;
                  height: 80px;
                  position: relative;
                  padding: 0 10px;
                  float: left;
              }
              .mintMidSku {
                  /* height: 82px;
                  line-height: 34px;
                  display: inline-block; */
                  padding: 16px 0;
                  span {
                      margin-right: 10px;
                  }
              }
          }
      }
  }
  </style>


<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-30 09:13:25
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-27 17:00:36
 -->
<!-- 派工管理 -->
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
      <span class="headNapControl">
        <span>
          调度组:
          <a-select
            showSearch
            v-model="dispatchTable"
            placeholder="请选择调度组"
            :options="schedulingGroupArr"
            :filterOption="filterOption"
            @change="dispatchTableFun"
            style="width:200px; margin-right: 20px;"/>
        </span>
        <a-button type="primary" @click="onLeffMap">
          <a-icon type="caret-down" v-if="!controlMap" />
          <a-icon type="caret-up" v-if="controlMap" />
          {{ mapText }}
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
      <a-button v-action:add style="margin-right:20px;" type="primary" size="small" @click="onDispatch(-1)">派工</a-button>
      <a-button v-action:add type="primary" size="small" @click="onCancelDispatching(-1)">取消派工</a-button>
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
    <!-- 派工 -->
    <a-modal
      v-model="deliveryVisible"
      title="派工"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="1200"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'700px',width:'1200px'}"
      centered>
      <h4>派工信息</h4>
      <a-row class="doc">
        <a-col :span="4">司机</a-col>
        <a-col :span="8">
          <a-select
            placeholder="请选择司机"
            style="width:100%"
            allowClear
            showSearch
            :options="driverArr"
            v-model="dispatchObj.driverCode"
            @change="driverChange"
          />
        </a-col>
        <a-col :span="4">司机电话</a-col>
        <a-col :span="8">
          <a-input v-model="dispatchObj.driverPhone" disabled/>
        </a-col>
        <a-col :span="4">配送车辆</a-col>
        <a-col :span="8">
          <a-select
            placeholder="请选择车辆"
            style="width:100%"
            :options="vehicleArr"
            v-model="vehicle"
          />
        </a-col>
        <a-col :span="4">辅助人</a-col>
        <a-col :span="8">
          <a-select
            placeholder="请选择用户编码/名称"
            style="width:85%"
            ref="storeRef"
            mode="multiple"
            :maxTagCount="1"
            :options="auxiliaryArr"
            :open="false"
            @focus="selectFocusEffect"
            v-model="tempObjArr"
            allowClear
          />
          <a href="javascript:;" @click="selectFocusEffect">
            <a-icon style="width:15%;line-height:36px;" type="edit" />
          </a>
        </a-col>
      </a-row>
      <div style="margin: 5px 0;">
        <span>退货单信息({{ schedulingGroupCodeName }})</span>
        <div style="float: right;display:inline-block">
          <span><a-input placeholder="请输入/扫描送货单号" size="small" style="width: 200px" v-model="codes"/></span>
          <span><a-button size="small" @click="onFind(codes)">添加</a-button></span>
        </div>
      </div>
      <div class="clientService" style="height: 500px">
        <a-row v-for="(item, index) in billsList" :key="index" type="flex" align="middle" justify="space-around">
          <a-col :span="24">
            <div class="mintBox">
              <div class="mintHead">
                <a-row>
                  <a-col :span="3">送货单号单号:</a-col>
                  <a-col :span="4">{{ item.code }}</a-col>
                  <a-col :span="3">预约送货时间:</a-col>
                  <a-col :span="4">{{ item.sendTime }}</a-col>
                  <a-col :span="1">线路:</a-col>
                  <a-col :span="4">{{ item.routeName }}</a-col>
                  <a-col :span="1">状态:</a-col>
                  <a-col :span="2">{{ item.statusName }}</a-col>
                  <a-col :span="1">
                    <a-button type="primary" size="small" style="margin: 0 5px" @click="onBillsDel(index)">删除</a-button>
                  </a-col>
                  <a-col :span="2">备注:</a-col>
                  <a-col :span="10">{{ item.sendNote }}</a-col>
                </a-row>
              </div>
              <hr>
              <div class="mintMid">
                <div class="cutoffRule"></div>
                <a-row type="flex" align="middle">
                  <a-col :span="12" style="border-right: 1px solid #ccc;">
                    <div class="mintImg">
                      <img :src="item.imgUrl" class="img" v-if="item.imgUrl">
                      <img src="@assets/goods.png" class="img" v-else>
                    </div>
                    <div class="mintMidSku">
                      <div>
                        <span>{{ item.skuName }}</span><span style="margin-left: 10px">{{ item.skuCode }}</span>
                      </div>
                      <div style="margin: 8px 0">{{ item.skuModel }}</div>
                      <div>{{ `数量:${item.skuNum || ''}台` }}</div>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <pre>  <a-icon type="user" /> {{ item.custName }}  {{ item.custPhone }}</pre>
                    <pre>  <a-icon type="environment" style="color: red" /> {{ item.custAddr }}</pre>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div slot="footer">
        <a-button @click="() => deliveryVisible = false" size="small">取消</a-button>
        <a-button @click="onDispatchConfirm(dispatchObj)" type="primary" size="small" >确定</a-button>
      </div>
      <user
        :visible.sync="usersVisible"
        @onSelect="onUsersSelect"
        :pams="userPams"
        :defaultSelect="tempObjArr"
        :title="title"
        multiple/>
    </a-modal>
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
    <div :style="activeAll" class="mapAll">
      <mapDrag ref="mapDrag" @drag="dragMap"></mapDrag>
      <div class="maskRight" v-if="maskRight">
        <div class="contentRight">
          <div class="title">
            <span>{{ addressDetails.statusName }}</span><span>{{ addressDetails.code }}</span>
          </div>
          <div class="namePone">
            <span>{{ addressDetails.custName }}</span><span>{{ addressDetails.custPhone }}</span>
          </div>
          <div class="address">
            <span>{{ addressDetails.custAddr }}</span>
          </div>
          <div class="line" @mouseover="elementBMouseOver" @mouseleave="elementBMouseLeave">
            <span>{{ addressDetails.routeName || '暂无线路' }}</span>
          </div>
        </div>
        <div :class="maskHS?'maskS':'maskH'" @mouseover="elementBMouseOver" @mouseleave="elementBMouseLeave">
          <div class="lineRight">
            <div>请选择切换线路</div>
            <div class="lineArr" >
              <div v-for="(item, index) in routerList" :key="index" class="lineFind" @click="routesFun(item)">
                <span class="path">{{ item.name }}</span>
                <span>{{ item.numbers }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import mapDrag from '@pages/storage/LogisticsDistributionManagement/map'
import user from '@pages/storage/LogisticsDistributionManagement/users/user'
import getStatus from '@comp/statusAll/getStatus'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import map from 'lodash.map'
import difference from 'lodash.difference'
import moment from 'moment'
export default {
    name: 'DispatchingManagement',
    components: { NewTable, seachBox, user, mapDrag, detailsPreview },
    data () {
        return {
            pams: {},
            detailsTitle: '派工详情',
            clientID: '',
            routerList: [],
            vehicle: '',
            addressDetails: {},
            // 地图按钮
            controlMap: false,
            maskHS: false,
            maskRight: false,
            mapText: '显示地图',
            cancelList: [],
            cancelObj: {
                sendTimes: moment()
            },
            title: '用户列表',
            usersVisible: false,
            billsList: [],
            codes: '',
            userPams: {},
            tempObjArr: [],
            auxiliaryArr: [],
            vehicleArr: [],
            driverArr: [],
            dispatchObj: {},
            deliveryVisible: false,
            cancelDispatchVisible: false,
            reginsterDates: moment(),
            dispatchTable: '',
            schedulingGroupArr: [],
            disContextMenu: [],
            schedulingGroupCodeName: '',
            btns: ['export', 'print'],
            seachValue: {},
            tableCode: 'e2b09af8d3f545828a3593a6196e883e:DispatchingManagement',
            tableApiPath: '',
            previewVisbel: false,
            MenuOperations: [
                {
                    name: '派工',
                    action: 'DispatchingManagement.add',
                    fc: this.onDispatch
                },
                {
                    name: '取消派工',
                    action: 'DispatchingManagement.add',
                    fc: this.onCancelDispatching
                },
                {
                    name: '预览',
                    action: 'DispatchingManagement.get',
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
                    title: '状态',
                    type: 'select',
                    key: 'status',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
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
    computed: {
        activeAll () {
            let sum = null
            if (!this.controlMap) {
                sum = { opacity: 0 }
            } else {
                sum = { opacity: 1 }
            }
            return sum
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.$refs.newTable.setContextmenu(this.MenuOperations)
            this.$refs.newTable.setTableColumns(this.tableCode)
            getStatus('bill_returns_status', this.conditions[4])
        })
        this.seachValue = {
            saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
            status: 'bill_returns_status:1',
            pickStoreCode: this.$store.getters.storeInfo.code
        }
        this.getAll()
        this.gainScheduling()
    },
    methods: {
        /**
         * @name: 派工
         * @msg:
         * @param {type}
         * @return:
         */
        onDelivery (e) {
            console.log(e)
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_deliver_status:3') {
                        this.$message.warning('选中数据存在待确认数据！')
                        return
                    } else {
                        this.billsList = [...this.selectArr]
                    }
                }
            } else {
                this.billsList = [e]
            }
            this.dispatchObj = {}
            this.tempObjArr = []
            this.deliveryVisible = true
        },
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '退货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '预约取货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        /**
         * @name: 切换线路
         * @msg:
         * @param {type}
         * @return:
         */
        routesFun (e) {
            console.log(e)
            const that = this
            this.$confirm({
                title: '切换线路',
                content: '是否确认切换到当前线路?',
                onOk () {
                    axios({
                        path: 'DistributionReturnsUpdateRoute',
                        method: 'post',
                        body: {
                            id: that.clientID,
                            routeCode: e.code,
                            routeName: e.name
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.onSeach()
                            that.maskRight = false
                        }
                    })
                },
                onCancel () {}
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
                if (e !== -1) {
                    this.deleteAll = [e]
                }
                this.cancelObj.sendTimes = moment()
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
                    this.onSeach()
                    this.cancelObj = {}
                    this.cancelDispatchVisible = false
                }
            })
        },
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_returns_status:1') {
                this.disContextMenu = ['取消派工']
            } else if (status === 'bill_returns_status:2') {
                this.disContextMenu = ['派工']
            } else {
                this.disContextMenu = ['派工', '取消派工']
            }
        },
        /**
         * @name:派工
         */
        onDispatch (e) {
            this.dispatchObj = {}
            this.tempObjArr = []
            const err = []
            if (this.deleteAll.length > 0 && e === -1) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:1') {
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
                        description: `单据${i.code}状态为:${i.statusName},无法操作派工!`
                    })
                }
            } else {
                if (e === -1) {
                    this.billsList = [...this.deleteAll]
                } else {
                    this.billsList = [e]
                }
                this.deliveryVisible = true
            }
        },
        /**
         * @name:派工提交
         */
        onDispatchConfirm (e) {
            const obj = { ...e }
            obj.vehicle = this.vehicle
            const ids = []
            if (!obj.driverCode) { return this.$message.error('请选择司机!') }
            obj.assistCodes = this.tempObjArr.join(',')
            this.billsList.forEach(i => {
                ids.push(i.id)
            })
            obj.groupCode = this.dispatchTable
            obj.ids = [...ids]
            axios({
                path: 'DistributionReturnsUpdateDispatching',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    this.onSeach()
                    this.deliveryVisible = false
                }
            })
        },
        /**
         * @name:扫描查询
         */
        onFind (code) {
            // console.log(code, '12346798')
            if (!code) { return }
            const err = this.billsList.filter(o => o.code === code)
            if (err.length > 0) {
                return this.$message.error('当前查询单号已存在,请查询后再试!')
            }
            const obj = Object.assign({ code: code }, this.seachValue, { status: 'bill_deliver_status:2' })
            axios({
                path: 'BillDeliverFindStatistics',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    const arr = res.data.list
                    const codeArr = map(this.billsList, 'code')
                    const codesArr = map(arr, 'code')
                    const codeAdd = difference(codesArr, codeArr)
                    const dataAdd = []
                    for (const itemA of codeAdd) {
                        for (const itemB of arr) {
                            if (itemA === itemB.code) {
                                if (itemB.status === 'bill_deliver_status:2') {
                                    dataAdd.push(itemB)
                                }
                            }
                        }
                    }
                    this.billsList.push(...dataAdd)
                }
            })
        },
        /**
         * @name:派工删除单据
         */
        onBillsDel (del) {
            // console.log(del)
            this.billsList.splice(del, 1)
        },
        /**
         * @name: 切换调度组
         */
        dispatchTableFun (e) {
            this.schedulingGroup = e
            this.seachValue.groupCode = e
            for (const i of this.schedulingGroupArr) {
                if (i.code === e) {
                    this.schedulingGroupCodeName = `${i.code}:${i.groupName}`
                }
            }
            this.onSeach({ groupCode: e })
        },
        selectFocusEffect () {
            this.userPams = {
                include: {
                    type: 'sys_user_type:2,sys_user_type:1'
                }
            }
            this.usersVisible = true
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
               * @name: 监听司机
               */
        driverChange (e) {
            if (!e) { return }
            const arr = this.driverArr.filter(o => o.code === e)
            console.log(arr, '选中司机')
            this.dispatchObj.driverName = arr[0].name
            this.$set(this.dispatchObj, 'driverPhone', arr[0].phone)
            // console.log(arr, '手机')
            axios({
                path: 'DistributionVehicleFindAll',
                method: 'post',
                body: { driverCode: e }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = i.code
                        i.value = i.code
                    })
                    this.vehicleArr = [...data]
                    this.vehicle = data[0].code
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
        /**
         * @name: 类型数量统计
         */
        getTypeStatistics () {
            const obj = { ...this.seachValue }
            obj.groupCode = this.dispatchTable
            obj.serviceType = 'bill_returns_service_type:1'
            axios({
                path: 'DistributionReturnsFindRetreatDispatching',
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
        gainScheduling () {
            // 获取调度组
            axios({
                path: 'DistributionDispatchingGroupFindByUser',
                method: 'post'
            }).then(res => {
                const data = res.data
                console.log(res.data, '666666666666666666666666666666666666666666666')
                if (res.flag === 1) {
                    if (data.length > 0) {
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}:${i.groupName}`
                            i.value = i.code
                        })
                        this.schedulingGroupArr = [...data]
                        this.dispatchTable = data[0].code
                        this.$nextTick(() => {
                            this.seachValue.groupCode = data[0].code
                            this.onDriver()
                            this.onSeach()
                        })
                    } else {
                        this.$message.warning('您不在当前公司调度组内!')
                    }
                }
            })
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
            
            // 辅助人
            axios({
                path: 'PermissionsUserQuery',
                method: 'post',
                body: {
                    type: 'sys_user_type:2,sys_user_type:1'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('辅助人', res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.auxiliaryArr = [...data]
                    // console.log('辅助人', this.auxiliaryArr)
                }
            })
        },
        onDriver () {
            // 司机
            axios({
                path: 'DistributionReturnsFindDrivers',
                method: 'post',
                body: {
                    groupCode: this.dispatchTable
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.driverArr = [...data]
                }
            })
        },
        onSeach (e = {}) {
            this.seachValue.groupCode = this.dispatchTable
            const obj = Object.assign(e, this.seachValue)
            this.getTypeStatistics()
            axios({
                path: 'DistributionReturnsFindRetreatDispatching',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '获取线路')
                    const data = res.data
                    this.routerList = data.routes
                    // this.$refs.newTable.setTableColumns(this.tableCode)
                    this.$refs.newTable.setTableData(data.list, { path: 'DistributionReturnsFindRetreatDispatching' })
                }
            })
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
                this.$refs.newTable.exportFile('DistributionReturnsFindRetreatDispatching', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        onReload () {
            this.seachValue = {}
            this.getTypeStatistics()
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.maskRight = false
            this.deleteAll = [...rows]
            this.$refs.mapDrag.drawFun(rows)
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
       * @name:用户返回数据
       */
        onUsersSelect (e) {
            // console.log(e, '55555555')
            const arr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...arr, ...map(e, 'code')])]
        },
        // getDate () {
        //     this.$refs.newTable.setTableData('e2b09af8d3f545828a3593a6196e883e:DispatchingManagement', { path: 'DistributionReturnsFindRetreatDispatching' })
        // },
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        },
        onLeffMap () {
            if (this.controlMap) {
                this.controlMap = false
                this.mapText = '显示地图'
            } else {
                this.controlMap = true
                this.mapText = '隐藏地图'
            }
        },
        /**
         * @name: 地图返回id
         * @msg:
         * @param {type}
         * @return:
         */
        dragMap (e) {
            console.log(e)
            if (e) {
                this.clientID = e
                this.maskRight = true
                const list = this.deleteAll.filter(i => i.id === e)
                console.log(list, '数据选中')
                this.addressDetails = list[0]
            }
        },
        /**
         * @name: 移出
         * @msg:
         * @param {type}
         * @return:
         */
        elementBMouseLeave (e) {
            this.maskHS = false
        },
        /**
         * @name:移入
         * @msg:
         * @param {type}
         * @return:
         */
        elementBMouseOver (e) {
            this.maskHS = true
        },
        onRoute () {
            axios({
                path: 'DistributionReturnsFindRetreatDispatching',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, '获取线路')
                    this.routerList = res.data.routes
                }
            })
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
            height: 102px;;
            box-sizing: border-box;
            overflow: hidden;
            .mintImg {
                .img {
                    padding:0;
                    border:0;
                    width: 80px;
                height: 80px;
                    position: absolute;
                    top: 50%;
                    margin-top: -38px;
                }
                width: 95px;
                height: 95px;
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

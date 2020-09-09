<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-06-05 09:31:47
 * @LastEditors: Reat
 * @LastEditTime: 2019-07-30 19:22:33
 -->

<template>
  <div>
    <div class="mintHeat">
      <div class="mintHeatBtn" :style="{width: item.width + 'px', color: item.backColor}" v-for="(item, index) in list" :key="index" @click="dispatchingTypeChange(item)">
        {{ item.size }} ({{ item.numbers }})<span class="iconfont" :style="{color: item.color}">&#xe61a;</span>
      </div>
      <div class="mintHeatBtnRight">
        <a-button type="primary" size="small" @click="controlMap = !controlMap"><a-icon type="caret-down" v-if="!controlMap" /><a-icon type="caret-up" v-if="controlMap" />隐藏地图</a-icon></a-button>
      </div>
    </div>
    <div class="mintMap" :style="{height: heightMap + 'px' }">
      <mapDrag
        :lat="lat"
        :lng="lng"
        :height="heightMap"
        :coordinate="coordinate"
        :routeList="routeList"
        :centralPoint="centralPoint"
        @obtain="onObtain"
        :status="statusObj"/>
      <div class="mintMapRight" :style="{width: mintWidth + 'px'}">
        <div class="mintMRshrink">
          <a-icon :type="iconType" @click="selectIcon" class="icon"/>
        </div>
        <div class="mintMapCircuit">
          <a-select
            placeholder="请输入线路编码/名称"
            style="width: 100%;"
            :options="customerList"
            allowClear
            showSearch
            @change="selectPath"/>
          <div class="MapPaths" @click="pathChange('0')">
            <a-row>
              <a-col :span="20" class="puthName"><div>未分配线路</div></a-col>
              <a-col :span="4" style="text-align: center">{{ nuRoute }}</a-col>
            </a-row>
          </div>
          <div class="mintPath">
            <a-radio-group @change="onRadioChange" v-for="(item, index) in pathList" :key="index">
              <a-row type="flex">
                <a-col :span="2" style="margin: 7px 4px"><a-radio :value="item" v-if="radio"></a-radio></a-col>
                <a-col :span="21">
                  <div class="mintMapPath" @click="pathChange(item)">
                    <a-row>
                      <a-col :span="20" class="puthName">{{ item.name }}</a-col>
                      <a-col :span="4" style="text-align: center">{{ item.numbers }}</a-col>
                    </a-row>
                  </div>
                </a-col>
              </a-row>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="mintMission">
      <a-row>
        <a-col :span="8" style="text-align:center;">
          <div class="titles">派工</div>
          <div>
            <a-button type="primary" size="small" style="margin: 0 5px" @click="onDispatch">派工</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px" @click="onDispatchConfirmation">派工确认</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px" @click="onCancelDispatching">取消派工</a-button>
          </div>
        </a-col>
        <a-col :span="8" style="text-align:center;">
          <div class="titles">出库</div>
          <div>
            <a-button type="primary" size="small" @click="onDeliveryStorage">出库</a-button>
          </div>
        </a-col>
        <a-col :span="8" style="text-align:center;">
          <div class="titles">物流</div>
          <div>
            <a-button type="primary" size="small" style="margin: 0 5px" @click="onPutStorage">入库</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px" @click="onConfirmSignature">确认签收</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:get style="margin-left:10px;" type="primary" size="small" @click="previewFun">顾客承职服务单详情</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <a-modal
      v-model="DispatchVisible"
      title="派工"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
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
        <a-col :span="4">配送车辆</a-col>
        <a-col :span="8">
          <a-select
            placeholder="请选择车辆"
            style="width:100%"
            :options="vehicleArr"
            v-model="dispatchObj.vehicle"
          />
        </a-col>
        <a-col :span="4">司机电话</a-col>
        <a-col :span="8">
          <a-input v-model="dispatchObj.driverPhone" disabled/>
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
        <span style="margin-right: 378px">顾客承职服务单信息</span>
        <span><a-input placeholder="请输入/扫描承职服务单号" size="small" style="width: 200px" v-model="codes"/></span>
        <span><a-button size="small" @click="onFind(codes)">添加</a-button></span>
      </div>
      <div class="clientService">
        <a-row v-for="(item, index) in billsList" :key="index" type="flex" align="middle" justify="space-around">
          <a-col :span="24">
            <div class="mintBox">
              <div class="mintHead">
                <a-row>
                  <a-col :span="3">承职服务单号:</a-col>
                  <a-col :span="4">{{ item.code }}</a-col>
                  <a-col :span="3">预约送货时间:</a-col>
                  <a-col :span="5">{{ item.sendTime }}</a-col>
                  <a-col :span="2">状态:</a-col>
                  <a-col :span="5">{{ item.statusName }}</a-col>
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
                      <img :src="item.imgUrl" alt="暂无图片" class="img" v-if="item.imgUrl">
                      <img src="@assets/goods.png" class="img" v-else>
                    </div>
                    <div class="mintMidSku">
                      <pre>{{ item.skuName }}  {{ item.skuCode }}  {{ item.skuModel }}</pre>
                      <pre>{{ `数量:${item.skuNum || ''}台` }}</pre>
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
        <a-button @click="() => DispatchVisible = false" size="small">取消</a-button>
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
        <h4>确定取消当前选中单据的派工?</h4>
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
    <previewEdition
      v-model="modalVisible"
      :title="titleB"
      :headers="previewHeaders"
      :footers="previewFooters"
      :content="previewContent"
      :categoryinfoColumns="categoryinfoColumns"
      :categoryinfoData="categoryinfoData"
      :scroll="scroll"
      :orderId="orderId"
    >
      <div slot="timeLeft">
        <div class="aTimeline">
          <a-timeline>
            <a-timeline-item v-for="(item, index) in aTimelineArr" :key="index">
              <div class="aTimelineTitle">
                <span>{{ item.deliverType }}</span>
                <span>{{ item.createName }}</span>
              </div>
              <div>
                <a-row :span="24" class="aTimelineTime">
                  <span>{{ item.createTime }}</span>
                  <span>{{ item.happenType }}</span>
                </a-row>
              </div>
              <div style="padding: 10px 0 10px 0">
                <a-row :span="24">
                  <a-col v-if="item.imgUrl?true:false" :span="6"><img class="aTimelineImg" :src="item.imgUrl" alt="" :onerror="defaultImgUrl"></a-col>
                  <a-col :span="item.imgUrl?6:18">
                    <div class="aTimelineNote">
                      <span>{{ item.note }}</span>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
      </div>
    </previewEdition>
  </div>
</template>
<script>
import mapDrag from '@pages/storage/LogisticsDistributionManagement/magData/mapDrag'
import { axios } from '@/utils/request'
import user from '@pages/storage/LogisticsDistributionManagement/users/user'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import map from 'lodash.map'
import moment from 'moment'
import previewEdition from '@pages/storage/LogisticsDistributionManagement/users/previewEdition'
export default {
    name: 'CustomerService',
    components: { mapDrag, seachBox, NewTable, user, previewEdition },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            statusObj: {
                status1: 'bill_returns_status:1',
                status2: 'bill_returns_status:2',
                status3: 'bill_returns_status:3',
                status4: 'bill_returns_status:4',
                status5: 'bill_returns_status:5',
                status6: 'bill_returns_status:6'
            },
            centralPoint: [],
            routeList: [],
            nuRoute: '',
            cancelList: [],
            cancelObj: {
                sendTimes: moment()
            },
            seachData: {},
            codes: '',
            storageObj: {
                sendTimes: moment()
            },
            pathData: {},
            customerList: [],
            billsList: [
                { code: 12345, keepSendPreTime: '2019-5-5', statusName: '可以的', keepNote: '测试一下么!' },
                { code: 12345, keepSendPreTime: '2019-5-5', statusName: '可以的', keepNote: '测试一下么!' },
                { code: 12345, keepSendPreTime: '2019-5-5', statusName: '可以的', keepNote: '测试一下么!' },
                { code: 12345, keepSendPreTime: '2019-5-5', statusName: '可以的', keepNote: '测试一下么!' },
                { code: 12345, keepSendPreTime: '2019-5-5', statusName: '可以的', keepNote: '测试一下么!' }
            ],
            pathLists: [],
            isActive: false,
            clientID: '',
            radio: false,
            pathList: [],
            iconType: 'right',
            coordinate: [],
            auxiliaryArr: [],
            tempObjArr: [],
            title: '用户选择',
            userPams: {},
            cancelDispatchVisible: false,
            affirmVisible: false,
            usersVisible: false,
            DispatchVisible: false, // 派工按钮控制
            vehicleArr: [],
            driverArr: [],
            dispatchObj: {}, // 派工数据
            lng: '108.93',
            lat: '34.27',
            controlMap: false, // 控制地图显示
            deleteAll: [],
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮定义
            btns: ['export', 'print'],
            // 搜索框默认值
            seachValue: {
                beginTime: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
            },
            reginsterDates: moment(),
            conditions: [
                {
                    title: '调度组',
                    key: 'groupCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'groupName'],
                    value: 'code',
                    path: 'DistributionDispatchingGroupFindByUser'
                },
                {
                    title: '开始时间',
                    key: 'beginTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'endTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '综合查询',
                    type: 'input',
                    key: 'vague',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '提/退货位置',
                    key: 'pickStoreCode',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'code',
                    selectDataArr: []
                    // label: ['code', 'name'],
                    // value: 'code',
                    // path: 'OrganizationStoreFindCondition',
                    // body: { type: 'store_type:2' }
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
                    title: '单据来源',
                    type: 'select',
                    key: 'billSource',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'bill_returns_bill_source', grade: '1' }
                },
                {
                    title: '服务类型',
                    type: 'select',
                    key: 'serviceType',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    body: { type: 'bill_returns_service_type', grade: '1' }
                },
                {
                    title: '调度组',
                    type: 'select',
                    key: 'groupCode',
                    path: 'DistributionDispatchingGroupFindByUser',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true
                }
            ],
            list: [
                {
                    width: 80,
                    numbers: 0,
                    size: '全部',
                    status: '',
                    color: '#bfbfbf'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待派工',
                    status: 'bill_returns_status:1',
                    color: '#d4237a',
                    backColor: 'skyblue'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待确认',
                    status: 'bill_returns_status:2',
                    color: '#d81e06'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待出库',
                    status: 'bill_returns_status:3',
                    color: '#f4ea2a'
                },
                {
                    width: 100,
                    numbers: 0,
                    size: '取货在途',
                    status: 'bill_returns_status:4',
                    color: '#1296db'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '已入库',
                    status: 'bill_returns_status:5',
                    color: '#f4ea2a'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '已签收',
                    status: 'bill_returns_status:6',
                    color: '#1afa29'
                }
            ],
            // 预览
            modalVisible: false,
            titleB: '顾客承职服务单详情',
            previewFooters: [
                { key: 'driverCode', name: '司机姓名' },
                { key: 'vehicle', name: '配送车辆' },
                { key: 'driverPhone', name: '司机手机号' },
                { key: 'assistCodes', name: '辅助人' }
            ],
            previewContent: {},
            previewHeaders: [
                { key: 'returnApplyCode', name: '源单号' },
                { key: 'sourceCode', name: '源销售单号' },
                { key: 'sendTime', name: '预约取货日期' },
                { key: 'serviceType', name: '服务类型' },
                { key: 'billType', name: '单据类型' },
                { key: 'billSource', name: '单据来源' },
                { key: 'custName', name: '顾客姓名' },
                { key: 'custPhone', name: '手机号' },
                { key: 'routeCode', name: '线路' },
                { key: 'custAddr', name: '取货地址' },
                { key: 'pickStoreCode', name: '收货位置' },
                { key: 'workCount', name: '派工次数' },
                { key: 'note', name: '备注' }
            ],
            categoryinfoColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 200, align: 'center' },
                { title: '品牌', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '分类', dataIndex: 'className', width: 50, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 250, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '数量', dataIndex: 'skuNum', width: 150 },
                { title: '备注', dataIndex: 'note', width: 150 }
            ],
            categoryinfoData: [],
            scroll: { x: 1300 },
            aTimelineArr: [],
            orderId: '',
            MenuOperations: [
                {
                    name: '派工',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'dispatching')
                    }
                },
                {
                    name: '取消派工',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'cancelDispatching')
                    }
                },
                {
                    name: '派工确认',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'dispatchingAffirm')
                    }
                },
                {
                    name: '出库',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'cargoStorage')
                    }
                },
                {
                    name: '入库',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'cancelCargoStorage')
                    }
                },
                {
                    name: '确认签收',
                    action: 'CustomerService.add',
                    fc: row => {
                        this.getRow(row, 'signFor')
                    }
                }
            ]
        }
    },
    computed: {
        heightMap () {
            let sum = null
            if (this.controlMap) {
                sum = '0'
            } else {
                sum = '400'
            }
            return sum
        },
        mintWidth () {
            let sum = null
            if (this.iconType === 'left') {
                sum = 15
            } else if (this.iconType === 'right') {
                sum = 240
            }
            return sum
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '4c03e3a1aad9408bb7d7b4f8f2332194:CustomerService'
            this.tableApiPath = 'DistributionReturnsFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.pickUpTheGoodsLocation()
        this.onSelectConfig()
        this.seachValue.status = 'bill_returns_status:1'
        this.stateCollection(this.seachValue)
        this.pathChange()
        this.getMap(this.seachValue)
        this.onOrigin()
        // this.coordinate = [
        //     { lng: 108.93, lat: 34.27 },
        //     { lng: 108.93, lat: 34.271 },
        //     { lng: 108.932, lat: 34.053 }
        // ]
    },
    methods: {
        /**
         * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        pickUpTheGoodsLocation () {
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post',
                body: {
                    type: 'store_type:2'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.$set(this.conditions[3], 'selectDataArr', data)
                    this.seachValue = {
                        pickStoreCode: this.$store.getters.storeInfo.code,
                        beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            })
        },
        previewFun () {
            console.log('执行')
            if (this.deleteAll.length === 0) {
                return this.$message.warning('请选择单据!')
            } else if (this.deleteAll.length > 1) {
                return this.$message.warning('不可多选，请重新选择!')
            } else {
                const e = this.deleteAll[0]
                console.log(e, '123456')
                this.orderId = e.code
                this.previewContent.headers = {
                    returnApplyCode: e.returnApplyCode,
                    sourceCode: e.sourceCode,
                    sendTime: e.sendTime,
                    serviceType: e.serviceTypeName,
                    billType: e.billTypeName,
                    billSource: e.billSourceName,
                    custName: e.custName,
                    custPhone: e.custPhone,
                    routeCode: `${e.routeCode}--${e.routeName}`,
                    custAddr: e.custAddr,
                    pickStoreCode: `${e.pickStoreCode}--${e.pickStoreName}`,
                    workCount: e.workCount,
                    note: e.note
                }
                this.previewContent.footers = {
                    driverCode: `${e.driverCode}--${e.driverName}`,
                    vehicle: e.vehicle,
                    driverPhone: e.driverPhone,
                    assistCodes: e.assistNames
                }
                axios({
                    path: 'BillDeliverQueryDeliverLog',
                    method: 'post',
                    body: {
                        deliverCode: e.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res, '物流详情')
                        this.aTimelineArr = res.data.list
                    }
                })
                // 表格信息
                var arr = [{ ...e }]
                console.log(arr)
                this.categoryinfoData = arr
                this.modalVisible = true
            }
        },
        /**
               * @name:表格编辑
               */
        getRow (e, mun) {
            if (mun === 'dispatching') { // 派工
                this.deleteAll = [e]
                this.onDispatch()
            } else if (mun === 'cancelDispatching') { // 取消派工
                this.deleteAll = [e]
                this.onCancelDispatching()
            } else if (mun === 'dispatchingAffirm') { // 派工确认
                this.deleteAll = [e]
                this.onDispatchConfirmation()
            } else if (mun === 'cargoStorage') { // 出库
                this.deleteAll = [e]
                this.onDeliveryStorage()
            } else if (mun === 'cancelCargoStorage') { // 入库
                this.deleteAll = [e]
                this.onPutStorage()
            } else if (mun === 'signFor') { // 确认签收
                this.deleteAll = [e]
                this.onConfirmSignature()
            }
        },
        /**
         * @name: 选择未分配线路
         */
        undistributedPath () {

        },
        /**
         * @name: 获取地图点标记返回id
         */
        onObtain (e) {
            console.log(e, '顾客id')
            if (e) {
                this.radio = true
                this.clientID = e
            } else {
                this.$message.warning('请选择顾客地址!')
            }
        },
        /**
         * @name: 选中线路
         */
        onRadioChange (Radio) {
            console.log(Radio)
            if (this.clientID) {
                const that = this
                this.$confirm({
                    title: '切换线路',
                    content: '是否确认切换到' + Radio.target.value.name + '线路',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'DistributionReturnsUpdateRoute',
                            method: 'post',
                            body: {
                                id: that.clientID,
                                routeCode: Radio.target.value.code,
                                routeName: Radio.target.value.name
                            }
                        }).then(res => {
                            that.radio = false
                            if (res.flag === 1) {
                                that.getDate()
                                this.stateCollection(this.seachValue)
                            }
                        })
                    },
                    onCancel () {
                        that.radio = false
                    }
                })
            }
        },
        /**
         * @name: 线路选择
         */
        pathChange (e) {
            console.log(e, '选中线路')
            this.routeList = []
            if (e && e !== '0') {
                const arr = this.pathLists.filter(i => i.code === e.code)
                if (arr.length > 0) {
                    arr[0].routeInfoList.forEach(i => {
                        this.routeList.push([i.longitude, i.latitude])
                    })
                    this.centralPoint = [arr[0].longitude, arr[0].latitude]
                    console.log(arr, '线路区域')
                }
                this.seachValue.routeCode = e.code
            } else {
                this.seachValue.routeCode = ''
            }
            axios({
                path: 'DistributionReturnsFind',
                method: 'post',
                body: this.seachValue
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.lat = i.latitude
                        i.lng = i.longitude
                    }
                    this.coordinate = [...res.data.list]
                    console.log(this.coordinate, '获取地址坐标')
                    this.getDate()
                }
            })
        },

        /**
         * @name:派工
         */
        onDispatch () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:1') {
                        err.push(i)
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.custName}顾客承职服务单状态:${i.statusName},无法操作派工!`
                    })
                }
            } else {
                this.billsList = [...this.deleteAll]
                this.tempObjArr = []
                this.getAll()
                this.DispatchVisible = true
            }
        },
        /**
         * @name:派工提交
         */
        onDispatchConfirm (e) {
            const ids = []
            if (!e.driverCode) { return this.$message.error('请选择司机!') }
            e.assistCodes = this.tempObjArr.join(',')
            this.billsList.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            console.log(e)
            axios({
                path: 'DistributionReturnsUpdateDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.dispatchObj = {}
                    this.deleteAll = []
                    this.billsList = []
                    this.getDate()
                    this.stateCollection(this.seachValue)
                    this.DispatchVisible = false
                }
            })
        },
        /**
         * @name:派工确认
         */
        onDispatchConfirmation () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:2') {
                        err.push(i)
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.custName}顾客承职服务单状态:${i.statusName},无法操作派工确认!`
                    })
                }
            } else {
                this.billsList = [...this.deleteAll]
                this.tempObjArr = []
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
                    this.deleteAll = []
                    this.getDate()
                    this.stateCollection(this.seachValue)
                    this.affirmVisible = false
                }
            })
        },
        /**
         * @name:取消派工
         */
        onCancelDispatching () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:2') {
                        if (i.status !== 'bill_returns_status:3') {
                            err.push(i)
                        }
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.custName}顾客承职服务单状态:${i.statusName},无法操作取消派工!`
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
                    this.dispatchObj = {}
                    this.deleteAll = []
                    this.getDate()
                    this.stateCollection(this.seachValue)
                    this.cancelDispatchVisible = false
                }
            })
        },
        /**
         * @name:出库
         */
        onDeliveryStorage () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.serviceType !== 'bill_returns_service_type:2') {
                        if (i.status !== 'bill_returns_status:3') {
                            err.push(i)
                        }
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.code}单据为退货单,单据状态为:${i.statusName},无法操作入库!`
                    })
                }
            } else {
                const arr = []
                this.deleteAll.forEach(i => { arr.push(i.id) })
                const that = this
                this.$confirm({
                    title: '出库确认',
                    content: '是否确认出库?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'DistributionReturnsUpdateOutWarehouse',
                            method: 'post',
                            body: { ids: arr }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.deleteAll = []
                                that.getDate()
                                that.stateCollection(this.seachValue)
                            }
                        })
                    }
                })
            }
        },
        /**
         * @name:入库
         */
        onPutStorage () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:4') {
                        err.push(i)
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.custName}顾客承职服务单状态:${i.statusName},无法操作入库!`
                    })
                }
            } else {
                const arr = []
                this.deleteAll.forEach(i => { arr.push(i.id) })
                const that = this
                this.$confirm({
                    title: '入库确认',
                    content: '是否已收到商品?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'DistributionReturnsUpdateInWarehouse',
                            method: 'post',
                            body: { ids: arr }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.deleteAll = []
                                that.getDate()
                                that.stateCollection(this.seachValue)
                            }
                        })
                    }
                })
            }
        },
        /**
         * @name:确认签收
         */
        onConfirmSignature () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_returns_status:5') {
                        err.push(i)
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.custName}顾客承职服务单状态:${i.statusName},无法操作确认签收!`
                    })
                }
            } else {
                const arr = []
                this.deleteAll.forEach(i => { arr.push(i.id) })
                const that = this
                this.$confirm({
                    title: '确认签收',
                    content: '是否确认签收?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'DistributionReturnsUpdateConfirmReceipt',
                            method: 'post',
                            body: { ids: arr }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.deleteAll = []
                                that.getDate()
                                that.stateCollection(this.seachValue)
                            }
                        })
                    }
                })
            }
        },
        /**
         * @name: 搜索线路
         */
        selectPath (e = '') {
            console.log(e)
            if (this.pathList.length > 0 && e) {
                const newData = [...this.pathLists]
                const arr = newData.filter(o => o.code === e)
                this.pathList = arr
            } else if (!e) {
                this.pathList = [...this.pathLists]
            }
            // axios({
            //     path: 'DistributionReturnsFindRouteNumber',
            //     method: 'post',
            //     body: this.seachValue
            // }).then(res => {
            //     if (res.flag === 1) {
            //         this.pathList = [...res.data.list]
            //         console.log('获取线路', this.pathList)
            //     }
            // })
        },
        // pathAmd (e) {
        //     axios({
        //         path: 'DistributionReturnsFindRouteNumber',
        //         method: 'post',
        //         body: e
        //     }).then(res => {
        //         if (res.flag === 1 && this.pathList.length > 0) {
        //             for (const i of this.pathList) {
        //                 i.amount = res.data[i.code]
        //                 if (!i.amount) { i.amount = 0 }
        //             }
        //             console.log('66666666666666666', this.pathList)
        //         }
        //     })
        // },
        /**
         * @name: 获取单据状态集合
         */
        stateCollection (e) {
            axios({
                path: 'DistributionReturnsFindNumber',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    let sum = 0
                    this.list.forEach(i => {
                        i.numbers = res.data[i.status]
                        if (!i.numbers) { i.numbers = 0 }
                        sum += i.numbers
                    })
                    this.list[0].numbers = sum
                }
            })
        },
        selectIcon () {
            if (this.iconType === 'right') {
                this.iconType = 'left'
            } else if (this.iconType === 'left') {
                this.iconType = 'right'
            }
        },
        /**
         * @name:派工删除单据
         */
        onBillsDel (del) {
            console.log(del)
            this.billsList.splice(del, 1)
        },
        /**
         * @name:用户返回数据
         */
        onUsersSelect (e) {
            console.log(e, '55555555')
            const arr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...arr, ...map(e, 'code')])]
        },
        driverChange (e) {
            const arr = this.driverArr.filter(o => o.code === e)
            this.dispatchObj.driverName = arr[0].name
            this.dispatchObj.vehicle = arr[0].carCode
            this.$set(this.dispatchObj, 'driverPhone', arr[0].phone)
            console.log(arr, '手机')
            axios({
                path: 'DistributionVehicleFindAll',
                method: 'post',
                body: { driverCode: e }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('车辆', res.data.list)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = i.code
                        i.value = i.code
                    })
                    this.vehicleArr = [...data]
                }
            })
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
            } else if (e === 'del') {
                console.log('批量删除')
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionReturnsFind', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = [...rows]
            console.log(this.deleteAll, '多选')
            // for (const i of rows) {
            //     this.deleteAll.push(i.id)
            // }
            // console.log(this.deleteAll, '多选')
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
            Object.assign(this.seachValue, e)
            console.log(e, '搜索框数据')
            this.seachData = this.seachValue
            this.seachValue.path = 'DistributionReturnsFind'
            this.$refs.newTable.setTableData(this.tableCode, this.seachValue)
            this.stateCollection(this.seachValue)
            this.pathChange()
            this.getMap(this.seachValue)
        },
        getMap (e) {
            axios({
                path: 'DistributionReturnsFindRouteNumber',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    this.nuRoute = res.data.size
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.pathList = [...data]
                    this.pathLists = [...data]
                    this.customerList = [...data]
                }
            })
        },
        /**
         * @name:扫描查询
         */
        onFind (code) {
            axios({
                path: 'DistributionReturnsFind',
                method: 'post',
                body: {
                    code: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const err = res.data.list.filter(o => o.status !== 'bill_returns_status:1')
                    if (err.length > 0) {
                        return this.$message.error('当前查询单号不为待派工状态,请查询后再试!')
                    }
                    this.billsList.push(...res.data.list)
                }
            })
        },
        onSelectConfig () {
            // 派工取消原因
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
        },
        /**
         * @name: 司机 / 辅助人 下拉框
         */
        getAll () {
            // 司机
            axios({
                path: 'DistributionReturnsFindDriver',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取司机', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.driverArr = [...data]
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
                    console.log('辅助人', res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.auxiliaryArr = [...data]
                    console.log('辅助人', this.auxiliaryArr)
                }
            })
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
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        },
        onOrigin () {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data, 'j4444444444444444444')
                    this.lng = res.data.list[0].longitude.toString()
                    this.lat = res.data.list[0].latitude.toString()
                }
            })
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('4c03e3a1aad9408bb7d7b4f8f2332194:CustomerService', { path: 'DistributionReturnsFind' })
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {
            // console.log(billStatus)
            // if (billStatus === 'bill_sample_entry_status:1') {
            //     this.disContextMenu = []
            // } else {
            //     this.disContextMenu = ['新增', '编辑', '审核', '删除']
            // }
        },
        /**
               * @name: 点击派工状态
               */
        dispatchingTypeChange (e) {
            for (const i of this.list) {
                if (e.status === i.status) {
                    i.backColor = 'skyblue'
                } else {
                    i.backColor = ''
                }
            }
            // this.billMessage({ status: e.status })
            this.seachValue.status = e.status
            this.onSeach(this.seachValue)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CustomerService') {
                this.pickUpTheGoodsLocation()
            }
        }
    }
}
</script>
<style lang='less'>
    @font-face {
        font-family: 'iconfont';  /* project id 1246232 */
        src: url('//at.alicdn.com/t/font_1246232_aaq8k34o546.eot');
        src: url('//at.alicdn.com/t/font_1246232_aaq8k34o546.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1246232_aaq8k34o546.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1246232_aaq8k34o546.woff') format('woff'),
        url('//at.alicdn.com/t/font_1246232_aaq8k34o546.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1246232_aaq8k34o546.svg#iconfont') format('svg');
    }
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .bisc{
        width:100%;
        height:40px;
        line-height: 40px;
        margin: 10px 0 10px 0;
        padding: 0 20px;
        font-weight: bold;
        background-color: #f4f4f4;
        border: 1px solid #e1e1e1;
        @media print{
            background-color: #fff;
            border: none;
        }
    }
    // 预览
    .aTimeline{
        padding: 20px;
        margin-top: 30px;
        min-width: 270px;
    }
    .aTimelineTitle>span:nth-child(1){
        font-size: 16px;
        font-weight: bold;
        float: left;
        vertical-align: bottom;
        color: #38adff;
    }
    .aTimelineTitle:after{
        display: block;
        clear: both;
        content: '';
    }
    .aTimelineImg{
        width:50px;
        height: 50px;
    }
    .aTimelineTime>span:nth-child(1){
        float: left;
    }
    .aTimelineTitle>span:nth-child(2){
        float: left;
        margin-left:20px;
    }
    .aTimelineNote{
        text-align: left;
        word-wrap : break-word;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
        padding: 0;
    }
  .mintHeat {
    width: 100%;
    height: 30px;
    min-width: 800px;
    overflow: hidden;
    padding-bottom: 2px;
  }
  .mintHeat .mintHeatBtn {
    text-align: center;
    line-height: 28px;
    font-size: 12px;
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
  .mintHeat .mintHeatBtn:hover {
    cursor:pointer;
    color:#38adff;
    border-bottom: 1px solid #38adff;
  }
  .mintHeat .mintHeatBtnRight {
    float: right;
  }
  .mintMap {
    width: 100%;
    position: relative;
  }
  .mintMap .mintMapRight {
    height: 100%;
    background:#fff;
    opacity: 0.8;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 8px 0 0 8px;
    box-sizing: border-box;
    transition: 0.5s;
  }
  .mintMapRight .mintMRshrink {
    width: 14px;
    height: 100%;
    position: relative;
    display: inline-block;
    box-sizing: border-box;
  }
  .mintMRshrink .icon {
    position: absolute;
    top: 50%;
    margin-top: -14px;
  }
  .mintMapRight .mintMapCircuit {
        width: 225px;
        float: right;
        padding-top: 10px;
        .ant-radio-group  {
            width: 100%;
        }
        .mintPath {
            height: 310px;
            overflow-y: auto;
        }
        .mintPath::-webkit-scrollbar {
            display: none;
        }
        .MapPaths {
            width: 88%;
            line-height: 30px;
            border: 1px solid #ccc;
            border-radius: 50px;
            margin-top: 3px;
            margin-left: 27px;
            padding-left: 4px;
            :hover {
                cursor: pointer;
            }
            :active {
                background: pink;
                border-radius: 50px;
            }
        }
  }
  .mintMapCircuit .ant-select-selection {
    border-radius: 50px;
    margin-bottom: 5px;
  }
  .mintMapCircuit .mintMapPath {
    width: 100%;
    line-height: 30px;
    border: 1px solid #ccc;
    border-radius: 50px;
    margin-top: 3px;
    .puthName {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 6px;
        font-size: 12px;
        font-weight: bold;
    }
    :hover {
        cursor: pointer;
    }
    :active {
        background: pink;
        border-radius: 50px;
    }
  }
  .mintMapPath .ant-col-8 {
    text-align: center;
  }
  .mintMission {
    width: 100%;
    height: 94px;
  }
  .mintMission .titles {
    font-size: 12px;
    margin: 5px 0;
  }

  .clientService {
    height: 422px;
    overflow-y: auto;
    padding: 5px;
    border: 1px solid #ccc;
    box-sizing: border-box;
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
        .mintImg {
            .img {
                width: 60px;
                height: 60px;
                position: absolute;
                top: 50%;
                margin-top: -30px;
            }
            width: 80px;
            height: 80px;
            position: relative;
            padding-left: 10px;
            display: inline-block;
        }
        .mintMidSku {
            display: inline-block;
        }
      }
    }
  }
.ant-col-20 {
    font-weight: bold;
}
.bisc{
        width:100%;
        height:40px;
        line-height: 40px;
        margin: 10px 0 10px 0;
        padding: 0 20px;
        font-weight: bold;
        background-color: #f4f4f4;
        border: 1px solid #e1e1e1;
        @media print{
            background-color: #fff;
            border: none;
        }
    }
    //去除地图图标
    .amap-logo {
        bottom:-100px;
        display: none;
    }
    .amap-copyright {
        bottom:-100px;
        display: none;
    }
    // 预览
    .aTimeline{
        padding: 20px;
        margin-top: 30px;
        min-width: 270px;
    }
    .aTimelineTitle>span:nth-child(1){
        font-size: 16px;
        font-weight: bold;
        float: left;
        vertical-align: bottom;
        color: #38adff;
    }
    .aTimelineTitle:after{
        display: block;
        clear: both;
        content: '';
    }
    .aTimelineImg{
        width:50px;
        height: 50px;
    }
    .aTimelineTime>span:nth-child(1){
        float: left;
    }
    .aTimelineTitle>span:nth-child(2){
        float: left;
        margin-left:20px;
    }
    .aTimelineNote{
        text-align: left;
        word-wrap : break-word;
        font-size: 12px;
        line-height: 16px;
        margin: 0;
        padding: 0;
    }
</style>

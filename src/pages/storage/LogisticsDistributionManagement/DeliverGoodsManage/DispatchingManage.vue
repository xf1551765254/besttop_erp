<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 18:49:03
 -->
<template>
  <div style="min-width:850px;">
    <div style="margin:10px 0px">
      <a-button
        class="billType"
        v-for="(item, index) in billTypeList"
        :key="index"
        @click="billTypeChange(item)"
        :style="{background: item.backColor, color: item.color}"
      >{{ item.name }}({{ item.am }})
      </a-button>
      <a-button class="mapbtn" type="primary" @click="controlMapFun"><a-icon type="caret-down" v-if="controlMap" /><a-icon type="caret-up" v-if="!controlMap" />隐藏地图</a-icon></a-button>
      <div class="schedulingGroupStyle">
        <span style="width:30%">调度组:</span>
        <a-select
          showSearch
          placeholder="请选择调度组"
          @change="dispatchTableFun"
          v-model="schedulingGroup"
          :options="schedulingGroupArr"
          :filterOption="filterOption"
          style="width:70%;"/>
      </div>
    </div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="onDelivery(-1)">派工</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="assistWorkOrder(-1)">辅助派工</a-button>
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="canCelWorkOrder(-1)">取消派工</a-button>
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
    <div :class="controlMap?'mapS':'mapH'">
      <div class="map">
        <mapDrag ref="mapDrag" @drag="dragMap"></mapDrag>
        <div class="maskRight" v-if="maskRight">
          <div class="contentRight">
            <div class="title">
              <span>{{ billData.statusName }}</span><span>{{ billData.code }}</span>
            </div>
            <div class="namePone">
              <span>{{ billData.custName }}</span><span>{{ billData.custPhone }}</span>
            </div>
            <div class="address">
              <span>{{ billData.custAddr }}</span>
            </div>
            <div class="line" @mouseover="elementBMouseOver" @mouseleave="elementBMouseLeave">
              <span>{{ billData.routeName || "暂无线路" }}</span>
            </div>
          </div>
          <div :class="maskHS?'maskS':'maskH'" @mouseover="elementBMouseOver" @mouseleave="elementBMouseLeave">
            <div class="lineRight">
              <div>请选择切换线路</div>
              <div class="lineArr">
                <div @click="routesFun(item)" v-for="(item,index) of routesArr" :key="index">{{ item.name }} ({{ item.driverNum }})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        <span>送货单信息</span>
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
                      <div>{{ item.skuModel }}</div>
                      <div>{{ `数量:${item.skuNum || ''}台` }}</div>
                      <!-- <pre>{{ item.skuName }}  {{ item.skuCode }}  {{ item.skuModel }}</pre>
                      <pre>{{ `数量:${item.skuNum || ''}台` }}</pre> -->
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
        <a-button @click="onDispatch(dispatchObj)" type="primary" size="small" >确定</a-button>
      </div>
      <user
        :visible.sync="usersVisible"
        @onSelect="onUsersSelect"
        :pams="userPams"
        :defaultSelect="tempObjArr"
        title="用户选择"
        multiple/>
    </a-modal>
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
    <!-- 辅助派工 -->
    <a-modal
      v-model="assistVisible"
      title="辅助派工"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="300"
      class="doc"
      :bodyStyle="{height:'200px',width:'400px'}"
      destroyOnClose
      centered>
      <h3>是否进行辅助派工?</h3>
      <div>
        车辆满载量:
        <a-input-number :min="1" v-model="assistObj.assist" style="width: 100%"/>
      </div>
      <div>
        调度组:
        <a-select
          showSearch
          v-model="assistObj.assistDispatch"
          placeholder="请选择调度组"
          :options="schedulingGroupArr"
          :filterOption="filterOption"
          style="width:100%"/>
      </div>
      <div slot="footer">
        <a-button @click="() => assistVisible = false" size="small" >取消</a-button>
        <a-button @click="assistSelect(assistObj)" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <!-- 辅助派工 -->
    <a-modal
      v-model="billsAssistVisible"
      title="辅助派工"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      :bodyStyle="{height:'500px',width:'800px'}"
      destroyOnClose
      centered>
      <a-row class="search">
        <a-col :span="3">司机</a-col>
        <a-col :span="5">
          <a-input placeholder="请输入司机名称/编码" v-model="nameless.driverCode" />
        </a-col>
        <a-col :span="3">品类</a-col>
        <a-col :span="5">
          <a-select
            style="width: 100%"
            v-model="nameless.classCode"
            :options="classList"
            allowClear
            showSearch/>
        </a-col>
        <a-col :span="3">品牌</a-col>
        <a-col :span="5">
          <a-select
            style="width: 100%"
            v-model="nameless.brandCode"
            :options="brandList"
            allowClear
            showSearch/>
        </a-col>
        <a-col :span="3" style="line-height: 30px;">满载</a-col>
        <a-col :span="5">
          <a-input :min="1" v-model="nameless.carFullLoad" style="width: 100%"/>
        </a-col>
        <a-col :span="2" style="margin-left: 437px">
          <a-button @click="onSeachAssist(nameless)">查询</a-button>
        </a-col>
      </a-row>
      <div class="sorll">
        <a-table
          rowKey="code"
          size="small"
          :columns="assistColumns"
          :dataSource="assistData"
          :pagination="false"
          bordered
          :scroll="{x:1500,y: 380}">
          <template v-for="col in ['driverCode']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-select
                v-if="col === 'driverCode'"
                :options="driverArr"
                :defaultValue="record.driverCode"
                style="margin: -5px 0;width:100%;"
                @change="e => InputChange(e, record.code, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
      </div>
      <div slot="footer">
        <a-button @click="() => billsAssistVisible = false" size="small" >取消</a-button>
        <a-button @click="onAssistSelect" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<style scoped lang="less">
@import "../map/map";
.billType {
    margin: 0 10px;
}
.mapbtn{
    float: right;
}
.schedulingGroupStyle{
    box-sizing: border-box;
    width: 20%;
    float: right;
}
// 派工
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
        height: 102px;
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
            height: 82px;
            line-height: 34px;
            display: inline-block;
            span {
                margin-right: 10px;
            }
        }
    }
    }
}
// 辅助
.search {
    .ant-col-3 {
        text-align: right;
        padding-right: 20px;
        line-height: 32px;
    }
}
.sorll {
    height: 411px;
}
</style>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import user from '@pages/storage/LogisticsDistributionManagement/users/user'
import mapDrag from '@pages/storage/LogisticsDistributionManagement/map'
import difference from 'lodash.difference'
export default {
    name: 'DispatchingManage',
    components: {
        SeachBox,
        NewTable,
        mapDrag,
        user,
        detailsPreview
    },
    data () {
        return {
            pams: {},
            detailsTitle: '派工管理详情',
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
                        { value: 'bill_deliver_status:2', label: '待派工' },
                        { value: 'bill_deliver_status:3', label: '待确认' }
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
                status: 'bill_deliver_status:2'
            },
            // 主表
            tableCode: '086c88b61e2345658050774579ef7c50:DispatchingManage',
            tableApiPath: 'DeliverDivisionFindDeliver',
            disContextMenu: [],
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '派工',
                    action: 'DispatchingManage.add',
                    fc: this.onDelivery
                },
                {
                    name: '辅助派工',
                    action: 'DispatchingManage.add',
                    fc: this.assistWorkOrder
                },
                {
                    name: '取消派工',
                    action: 'DispatchingManage.add',
                    fc: this.canCelWorkOrder
                },
                {
                    name: '预览',
                    action: 'DispatchingManage.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            schedulingGroup: '', // 调度组
            schedulingGroupArr: [],
            // 地图按钮
            controlMap: false,
            maskHS: false,
            maskRight: false,
            billData: {},
            routesArr: [],
            clientID: '',
            // 派工
            deliveryVisible: false,
            driverArr: [], // 司机
            dispatchObj: {},
            tempObjArr: [],
            codes: '',
            billsList: [],
            vehicleArr: [],
            auxiliaryArr: [],
            // user 弹框
            usersVisible: false,
            userPams: {},
            // 取消派工
            dispatchOffVisible: false,
            dispatchOffObj: {},
            cancelList: [],
            cancelId: [],
            // 辅助派工1
            assistVisible: false,
            assistObj: {},
            // 辅助派工2
            billsAssistVisible: false,
            nameless: {},
            assistColumns: [
                { title: '司机', dataIndex: 'driverCode', width: 250, align: 'center', scopedSlots: { customRender: 'driverCode' } },
                { title: '送货地址', dataIndex: 'custAddr', width: 300, align: 'center' },
                { title: '顾客姓名', dataIndex: 'custName', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '预约送货时间', dataIndex: 'sendTime', width: 100, align: 'center' },
                { title: '单据类型', dataIndex: 'statusName', width: 100, align: 'center' },
                { title: '线路', dataIndex: 'routeName', width: 100, align: 'center' }
            ],
            assistData: [],
            brandList: [],
            classList: []
        }
    },
    mounted () {
        this.getAll()
        this.goodsType()
        this.$nextTick(() => {
            // this.tableCode = '9ef9e84a3e60425e9792bad18ac0773c:DispatchingManage'
            // this.tableApiPath = 'DeliverDivisionFindDeliver'
            this.$refs.newTable.setTableColumns(this.tableCode)
            this.schedulingGroupFun()
            this.$refs.newTable.setContextmenu(this.rightMenu)
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
         * @name: 辅助派工确认
         * @msg:
         * @param {type}
         * @return:
         */
        onAssistSelect () {
            for (const i of this.assistData) {
                if (!i.driverCode) {
                    return this.$message.warning('当前数据未分配司机,请选择司机!')
                }
            }
            axios({
                path: 'BillDeliverUpdateAuxiliaryDispatching',
                method: 'post',
                body: {
                    delivers: this.assistData
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.assistData = []
                    this.nameless = {}
                    this.onSeach(this.seachValue)
                    this.billsAssistVisible = false
                }
            })
        },
        InputChange (val, count, key) {
            console.log(val, count, key)
            const newData = [...this.assistData]
            const target = newData.filter(item => count === item.code)[0]
            if (target) {
                target[key] = val
                console.log()
                this.assistData = newData
            }
        },
        /**
         * @name: 查询辅助单据
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachAssist (data = {}) {
            axios({
                path: 'BillDeliverQueryAuxiliaryDispatching',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    this.assistData = res.data.list
                    this.billsAssistVisible = true
                    this.assistVisible = false
                }
            })
        },
        goodsType () {
            // 品类
            axios({
                path: 'GoodsCategoryFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.classList = [...data]
                }
            })
            // 品牌
            axios({
                path: 'GoodsBrandFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.brandList = [...data]
                }
            })
        },
        /**
         * @name: 确定辅助派工
         * @msg:
         * @param {type}
         * @return:
         */
        assistSelect (e) {
            console.log(e)
            if (!e.assist) { return this.$message.warning('请输入车辆满载量!') }
            if (!e.assistDispatch) { return this.$message.warning('请选择调度组!') }
            this.nameless.carFullLoad = e.assist
            const obj = Object.assign(this.nameless, this.seachValue, { groupCode: e.assistDispatch })
            this.onSeachAssist(obj)
        },
        /**
         * @name: 辅助派工
         * @msg:
         * @param {type}
         * @return:
         */
        assistWorkOrder () {
            this.assistObj = {}
            this.assistVisible = true
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
            if (!this.dispatchOffObj.note) { return this.$message.error('请选择取消原因!') }
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
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_deliver_status:2') {
                        this.$message.warning('选中数据存在待派工数据！')
                        return
                    } else {
                        this.cancelId = map(this.selectArr, 'id')
                    }
                }
            } else {
                this.cancelId = [e.id]
            }
            this.onSelectConfig('bill_deliver_log_happen_type_work')
            this.dispatchOffVisible = true
        },
        /**
         * @name: 用户返回
         * @msg:
         * @param {type}
         * @return:
         */
        onUsersSelect (e) {
            const arr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...arr, ...map(e, 'code')])]
        },
        /**
         * @name: 派工提交
         * @msg:
         * @param {type}
         * @return:
         */
        onDispatch (e) {
            if (!e.driverCode) { return this.$message.warning('请选择司机!') }
            e.delivers = []
            e.assistCodes = this.tempObjArr.join(',')
            e.groupCode = this.schedulingGroup
            e.delivers.push(...this.billsList)
            axios({
                path: 'BillDeliverUpdateDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.billsList = []
                    this.onSeach(this.seachValue)
                    this.deliveryVisible = false
                }
            })
        },
        /**
         * @name: 删除派工
         * @msg:
         * @param {type}
         * @return:
         */
        onBillsDel (del) {
            this.billsList.splice(del, 1)
        },
        /**
         * @name: 扫描
         * @msg:
         * @param {type}
         * @return:
         */
        onFind (code) {
            if (!code) { return }
            const err = this.billsList.filter(o => o.code === code)
            if (err.length > 0) {
                return this.$message.warning('当前查询单号已存在,请查询后再试!')
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
         * @name: 司机监听
         * @msg:
         * @param {type}
         * @return:
         */
        driverChange (e) {
            const arr = this.driverArr.filter(o => o.code === e)
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
                    console.log(data, arr[0].carCode)
                    this.vehicleArr = [...data]
                    this.dispatchObj = {
                        vehicle: arr[0].carCode,
                        driverPhone: arr[0].phone,
                        driverCode: e,
                        driverName: arr[0].name
                    }
                }
            })
        },
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
         * @name: 切换线路
         * @msg:
         * @param {type}
         * @return:
         */
        dispatchTableFun (e) {
            this.seachValue.groupCode = e
            this.onSeach(this.seachValue)
            this.driverFun()
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
                content: `是否确认切换到${e.name}线路?`,
                onOk () {
                    axios({
                        path: 'BillDeliverUpdateRouteChange',
                        method: 'post',
                        body: {
                            id: that.clientID,
                            routeCode: e.code,
                            routeName: e.name
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.mapDrag.drawFun(that.selectArr)
                            that.maskRight = false
                            that.onSeach(that.seachValue)
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 地图返回id
         * @msg:
         * @param {type}
         * @return:
         */
        dragMap (e) {
            console.log(e)
            this.clientID = e
            if (e) {
                this.maskRight = true
            } else {
                this.maskRight = false
            }
            const has = this.selectArr.filter(o => o.id === e)
            this.billData = has[0]
            console.log(this.billData)
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
        /**
         * @name: 地图按钮点击
         * @msg:
         * @param {type}
         * @return:
         */
        controlMapFun () {
            this.controlMap = !this.controlMap
            this.maskRight = false
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
                this.$refs.newTable.exportFile('DeliverDivisionFindDeliver', this.seachValue)
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
            let obj = Object.assign(e, { groupCode: this.schedulingGroup })
            axios({
                path: 'DeliverDivisionFindDeliver',
                method: 'post',
                body: obj
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
                    this.routesArr = data.routes
                    obj = Object.assign(obj, { path: 'DeliverDivisionFindDeliver' })
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
            if (status === 'bill_deliver_status:2') {
                this.disContextMenu = ['取消派工']
            } else if (status === 'bill_deliver_status:3') {
                this.disContextMenu = ['派工', '辅助派工']
            }
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
            this.$refs.mapDrag.drawFun(rows)
            if (this.selectArr.length === 0) {
                this.maskRight = false
            }
        },
        schedulingGroupFun () {
            // 调度组
            axios({
                path: 'DeliverDivisionFindGroupMaps',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.schedulingGroupArr = [...data]
                    this.schedulingGroup = this.schedulingGroupArr[0].code
                    this.$nextTick(() => {
                        this.seachValue.groupCode = this.schedulingGroup
                        this.driverFun()
                        this.onSeach(this.seachValue)
                    })
                }
            })
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        driverFun () {
            // 司机
            axios({
                path: 'DistributionReturnsFindDrivers',
                method: 'post',
                body: {
                    groupCode: this.schedulingGroup
                }
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('获取司机', res.data)
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
        getAll () {
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
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.auxiliaryArr = [...data]
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
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'DispatchingManage') {
                this.schedulingGroupFun()
                this.getAll()
                this.goodsType()
            }
        }
    }
}
</script>

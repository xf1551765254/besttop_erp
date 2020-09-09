<!--
 * @Description: ERP
 * @Version: V0.0.10
 * @Company: BestTop
 * @Author: shuai
 * @Date: 2019-06-18 09:10:39
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-02 13:44:44
 -->
<template>
  <div style="min-width:1200px">
    <div style="padding:0 10px 0 10px">
      <div style="height: 50px;display: inline-block;">
        <a-button
          size="small"
          v-for="(item, index) in billTypeList"
          :key="index"
          @click="billTypeChange(item)"
          :style="{background: item.backColor, color: item.color}"
          class="billType">{{ item.name }}({{ item.am }})
        </a-button>
      </div>
      <div class="mintHeatBtnRight">
        <a-button type="primary" size="small" @click="controlMap = !controlMap"><a-icon type="caret-down" v-if="!controlMap" /><a-icon type="caret-up" v-if="controlMap" />隐藏地图</a-icon></a-button>
      </div>
      <div class="mintHeat">
        <div class="mintHeatBtn" :style="{width: item.width + 'px', color: item.backColor}" v-for="(item, index) in list" :key="index" @click="dispatchingTypeChange(item)">
          <span class="iconfont" :style="{color: item.color}">&#xe61a;</span>
          {{ item.size }} ({{ item.numbers }})
          <!-- <a-icon type="picture" style="margin-left:5px;"/> -->
        </div>
        <div class="schedulingGroupStyle">
          <!-- <span style="width:30%">调度组:</span> -->
          <a-select
            showSearch
            size="small"
            v-model="dispatchTable"
            @change="dispatchTableFun"
            placeholder="请选择调度组"
            :options="schedulingGroupArr"
            :filterOption="filterOption"
            style="width:100%"/>
        </div>
      </div>
      <div class="mintMap" :style="{height: heightMap + 'px' }">
        <mapDrag
          :lat="lat"
          :lng="lng"
          :height="heightMap"
          :coordinate="coordinate"
          :status="statusObj"
          :routeList="routeList"
          :centralPoint="centralPoint"
          @obtain="onObtain"/>
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
            <div class="MapPaths" @click="undistributedPath">
              <a-row>
                <a-col :span="20" class="puthName">未分配线路</a-col>
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
                        <a-col :span="4" style="text-align: center">{{ item.driverNum }}</a-col>
                      </a-row>
                    </div>
                  </a-col>
                </a-row>
              </a-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="btnImg">
        <div @click="onSeparateBill" :class="flagImg1 ? 'btnImg1' : 'btnImgA'">
          <div>拆单</div>
        </div>
        <div @click="onSorting" :class="flagImg2 ? 'btnImg2' : 'btnImgB'">
          <div>分拣</div>
        </div>
        <div @click="onSortingOff" :class="flagImg3 ? 'btnImg3' : 'btnImgC'">
          <div>取消分拣</div>
        </div>
        <div @click="assistWorkOrder" :class="flagImg4 ? 'btnImg4' : 'btnImgD'">
          <div>辅助派工</div>
        </div>
        <div @click="onDelivery" :class="flagImg5 ? 'btnImg5' : 'btnImgE'">
          <div>派工</div>
        </div>
        <div @click="onCancelDispatching" :class="flagImg6 ? 'btnImg6' : 'btnImgF'">
          <div>取消派工</div>
        </div>
        <div @click="onDispatchAffirm" :class="flagImg7 ? 'btnImg7' : 'btnImgG'">
          <div>派工确认</div>
        </div>
        <div @click="onSignForSelect" :class="flagImg8 ? 'btnImg8' : 'btnImgH'">
          <div>确认签收</div>
        </div>
      </div>
    </div>
    <!-- <div class="mintMission">
      <a-row>
        <a-col :span="2" style="text-align:center;">
          <div class="btnsStyle">
            <a-button type="primary" size="small" @click="onSeparateBill">拆单</a-button>
          </div>
        </a-col>
        <a-col :span="4" style="text-align:center;">
          <div class="btnsStyle">
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onSorting">分拣</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onSortingOff">取消分拣</a-button>
          </div>
        </a-col>
        <a-col :span="6" style="text-align:center;">
          <div class="btnsStyle">
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onDelivery">派工</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="() => {assistVisible = true}">辅助派工</a-button>
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onCancelDispatching">取消派工</a-button>
          </div>
        </a-col>
        <a-col :span="2" style="text-align:center;">
          <div class="btnsStyle">
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onDispatchAffirm">派工确认</a-button>
          </div>
        </a-col>
        <a-col :span="2" style="text-align:center;">
          <div class="btnsStyle">
            <a-button type="primary" size="small" style="margin: 0 5px 2px 0" @click="onSignForSelect">确认签收</a-button>
          </div>
        </a-col>
        <a-col :span="2" style="text-align:center;">
          <div class="titles">出库</div>
          <div>
            <a-button type="primary" style="margin: 0 5px 2px 0" size="small" @click="deliveryStorage">出库</a-button>
            <a-button type="primary" style="margin: 0 5px 2px 0" size="small" @click="onStorageCon">取消出库</a-button>
          </div>
        </a-col>
      </a-row>
    </div> -->
    <!-- 拆单 -->
    <a-modal
      v-model="DispatchVisible"
      title="拆单"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="600"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'300px',width:'600px'}"
      centered>
      <div class="clientService" style="height: 260px">
        <a-row type="flex" align="middle" justify="space-around">
          <a-col :span="24">
            <div class="mintBox">
              <div class="mintHead">
                <a-row>
                  <a-col :span="3">送货单号:</a-col>
                  <a-col :span="5">{{ billObj.code }}</a-col>
                  <a-col :span="4">预约送货时间:</a-col>
                  <a-col :span="5">{{ billObj.sendTime }}</a-col>
                </a-row>
              </div>
              <hr>
              <div class="mintMid">
                <div class="mintImg">
                  <img :src="billObj.imgUrl" alt="暂无图片" class="img" v-if="billObj.imgUrl">
                  <img src="@assets/goods.png" class="img" v-else>
                </div>
                <div class="mintMidSku">
                  <pre>{{ billObj.skuName }}  {{ billObj.skuCode }}  {{ billObj.skuModel }}</pre>
                  <span>原数量: {{ billObj.skuNums }}</span>
                  <span>拆分后数量: {{ amounts }}</span>
                </div>
              </div>
            </div>
            <a-row class="doc">
              <a-col :span="4">拆分数量</a-col>
              <a-col :span="8"><a-input-number :min="0" v-model="billObj.am" @change="amountChange" /></a-col>
              <a-col :span="4">预约送货时间</a-col>
              <a-col :span="8"><a-date-picker format="YYYY-MM-DD HH:mm:ss" :disabledDate="disabledDate" style="width: 100%" v-model="billObj.sendTimes" showTime /></a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div slot="footer">
        <a-button @click="() => DispatchVisible = false" size="small">取消</a-button>
        <a-button @click="onDispatchConfirm(billObj)" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <!-- 取消分拣 -->
    <a-modal
      v-model="cancelDispatchVisible"
      title="取消分拣"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="400"
      class="doc"
      :bodyStyle="{height:'250px',width:'400px'}"
      destroyOnClose
      centered>
      <h4>确定取消分拣?</h4>
      <div>
        取消原因:
        <a-select
          style="width: 100%"
          v-model="cancelObj.chacelNote"
          :options="cancelList"
          allowClear
          showSearch/>
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="cancelObj.sendNote" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => cancelDispatchVisible = false" size="small" >否</a-button>
        <a-button @click="onSortingOffSelect(cancelObj)" type="primary" size="small" >是</a-button>
      </div>
    </a-modal>
    <!-- 派工 -->
    <a-modal
      v-model="deliveryVisible"
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
            v-model="vehicle"
            @change="vehicleChange"
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
        <span>送货单信息 (调度组：{{ schedulingGroupCodeName }})</span>
        <div style="float: right;display:inline-block">
          <span><a-input placeholder="请输入/扫描送货单号" size="small" style="width: 200px" v-model="codes"/></span>
          <span><a-button size="small" @click="onFind(codes)">添加</a-button></span>
        </div>
      </div>
      <div class="clientService" style="height: 418px">
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
        <a-button @click="() => deliveryVisible = false" size="small">取消</a-button>
        <a-button @click="onDispatch(dispatchObj)" type="primary" size="small" >确定</a-button>
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
      <h4>是否确认派工?</h4>
      <div>
        预约送货时间:
        <a-date-picker
          format="YYYY-MM-DD HH:mm:ss"
          :disabledDate="disabledDates"
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
          v-model="dispatchOffObj.sendTimes"
          style="width: 100%"
        />
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="dispatchOffObj.sendNote" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
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
        <a-input-number :min="1" v-model="assist" style="width: 100%"/>
      </div>
      <div>
        调度组:
        <a-select
          showSearch
          v-model="schedulingGroup"
          placeholder="请选择调度组"
          :options="schedulingGroupArr"
          :filterOption="filterOption"
          style="width:100%"/>
      </div>
      <div slot="footer">
        <a-button @click="() => assistVisible = false" size="small" >取消</a-button>
        <a-button @click="assistSelect" type="primary" size="small" >确定</a-button>
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
        <a-col :span="3">车辆满载数</a-col>
        <a-col :span="5">
          <a-input-number :min="1" v-model="nameless.carFullLoad" style="width: 100%"/>
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
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => saveRow(record.bt_web_id)" style="margin-right:10px;">保存</a>
                <a-popconfirm title="是否取消编辑?" @confirm="() => cancelRow(record.bt_web_id)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => edit(record.bt_web_id)" style="margin-right:10px;" v-if="editDel">编辑</a>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.bt_web_id)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <div slot="footer">
        <a-button @click="() => billsAssistVisible = false" size="small" >取消</a-button>
        <a-button @click="onAssistSelect" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <!-- 取消出库 -->
    <a-modal
      v-model="cancelVisible"
      title="取消出库"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="400"
      class="doc"
      :bodyStyle="{height:'250px',width:'400px'}"
      destroyOnClose
      centered>
      <div>
        <h4>确定取消出库?</h4>
        <div>
          取消原因:
          <a-select
            style="width: 100%"
            v-model="cancelStorageObj.chacelNote"
            :options="cancelList"
            allowClear
            showSearch/>
        </div>
      </div>
      <div>
        备注: <a-textarea placeholder="请输入备注" v-model="cancelStorageObj.sendNote" :rows="2" :autosize="{ minRows: 1, maxRows: 2 }" maxlength="250" />
      </div>
      <div slot="footer">
        <a-button @click="() => cancelVisible = false" size="small" >否</a-button>
        <a-button @click="onCancelStorage(cancelStorageObj)" type="primary" size="small" >是</a-button>
      </div>
    </a-modal>
    <!-- 确认签收 -->
    <a-modal
      v-model="signForVisible"
      title="确认签收"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="300"
      class="doc"
      :bodyStyle="{height:'200px',width:'400px'}"
      destroyOnClose
      centered>
      <h3>是否确认签收?</h3>
      <div v-if="verification">
        验证码:
        <a-input v-model="verificationCode" placeholder="请输入验证码" style="width: 100%"/>
      </div>
      <div slot="footer">
        <a-button @click="() => signForVisible = false" size="small" >取消</a-button>
        <a-button @click="signForSelect" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <!-- <a-button type="primary" size="small" @click="ScanningOutboundOpen">扫码出库</a-button> -->
      <a-button v-action:get style="margin-left:10px;" type="primary" size="small" @click="previewFun">派工单详情</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <ScanningOutbound ref="OutboundRef" onSearch="monitor"/>
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
                <span>{{ item.typeValue }}</span>
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
import ScanningOutbound from '@pages/storage/LogisticsDistributionManagement/users/ScanningOutbound'
import user from '@pages/storage/LogisticsDistributionManagement/users/user'
import previewEdition from '@pages/storage/LogisticsDistributionManagement/users/previewEdition'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import map from 'lodash.map'
import difference from 'lodash.difference'
import moment from 'moment'
import { setTimeout } from 'timers'
export default {
    name: 'TheAssigningOfTheTask',
    components: { mapDrag, seachBox, NewTable, user, ScanningOutbound, previewEdition },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            assistColumns: [
                { title: '司机', dataIndex: 'driverCode', width: 150, align: 'center', scopedSlots: { customRender: 'driverCode' } },
                { title: '送货地址', dataIndex: 'custAddr', width: 300, align: 'center' },
                { title: '顾客姓名', dataIndex: 'custName', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '预约送货时间', dataIndex: 'sendTime', width: 100, align: 'center' },
                { title: '单据类型', dataIndex: 'statusName', width: 100, align: 'center' },
                { title: '线路', dataIndex: 'routeName', width: 100, align: 'center' }
            ],
            statusObj: {
                status1: 'bill_deliver_status:1',
                status2: 'bill_deliver_status:2',
                status3: 'bill_deliver_status:3',
                status4: 'bill_deliver_status:4',
                status5: 'bill_deliver_status:5',
                status6: 'bill_deliver_status:6'
            },
            vehicle: '',
            centralPoint: [],
            routeList: [],
            disContextMenu: [],
            isActive: false,
            clientID: '',
            radio: false,
            verification: false,
            verificationCode: '',
            cancelStorageObj: {},
            assistData: [],
            nameless: {},
            brandList: [],
            classList: [],
            assist: '',
            schedulingGroup: '',
            dispatchOffObj: {
                sendTimes: moment()
            },
            storageObj: {
                sendTimes: moment()
            },
            reginsterDates: moment(),
            billsList: [],
            title: '用户选择',
            codes: '',
            tempObjArr: [],
            userPams: {},
            auxiliaryArr: [],
            vehicleArr: [],
            driverArr: [],
            dispatchObj: {},
            billObj: { // 拆单单据数据
                sendTimes: moment(),
                code: '',
                sendTime: '',
                skuName: '',
                skuCode: '',
                skuModel: '',
                skuNums: 0,
                am: 0
            },
            cancelList: [],
            cancelObj: {},
            signForVisible: false,
            cancelVisible: false,
            billsAssistVisible: false,
            assistVisible: false,
            dispatchOffVisible: false,
            affirmVisible: false,
            usersVisible: false,
            deliveryVisible: false, // 控制派工
            cancelDispatchVisible: false, // 控制取消分拣
            DispatchVisible: false, // 控制拆单
            deleteAll: [],
            tableCode: '9c30addb0f8a4fab9dd4938f3fd5afdd:TheAssigningOfTheTask',
            tableApiPath: 'BillDeliverFindStatistics',
            iconType: 'right',
            nuRoute: 0,
            pathList: [], // 所有线路
            pathLists: [],
            coordinate: [], // 地图点标记数据
            customerList: [], // 线路下拉数据
            lng: '108.93',
            lat: '34.27',
            // 工具栏按钮定义
            btns: ['export', 'print'],
            // 搜索框默认值
            seachValue: {
                saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: 1,
                status: 'bill_deliver_status:1',
                groupCode: ''
            },
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
                    color: '#000'
                },
                {
                    name: '分销',
                    am: 0,
                    billType: 'bill_deliver_sale_type:2',
                    color: '#000'
                },
                {
                    name: '内部调拨',
                    am: 0,
                    billType: 'bill_deliver_sale_type:3',
                    color: '#000'
                },
                {
                    name: '第三方派单',
                    am: 0,
                    billType: 'bill_deliver_sale_type:4',
                    color: '#000'
                }
            ],
            controlMap: false,
            conditions: [
                // {
                //     title: '调度组',
                //     key: 'groupCode',
                //     type: 'select',
                //     filter: true,
                //     label: ['code', 'groupName'],
                //     value: 'code',
                //     path: 'DistributionDispatchingGroupFindByUser'
                // },
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
                    // path: 'OrganizationStoreFindCondition'
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
                    key: 'isReturn',
                    type: 'select',
                    title: '是否退货',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 'true', label: '是' },
                        { value: 'false', label: '否' }
                    ]
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
                    size: '待分拣',
                    status: 'bill_deliver_status:1',
                    color: '#bfbfbc',
                    backColor: '#1890ff'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待派工',
                    status: 'bill_deliver_status:2',
                    color: '#d4237a'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待确认',
                    status: 'bill_deliver_status:3',
                    color: '#d81e06'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '待出库',
                    status: 'bill_deliver_status:4',
                    color: '#f4ea2a'
                },
                {
                    width: 100,
                    numbers: 0,
                    size: '配送在途',
                    status: 'bill_deliver_status:5',
                    color: '#1296db'
                },
                {
                    width: 90,
                    numbers: 0,
                    size: '配送完成',
                    status: 'bill_deliver_status:6',
                    color: '#1afa29'
                }
            ],
            MenuOperations: [
                {
                    name: '拆单',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'separateBill')
                    }
                },
                {
                    name: '分拣',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'sorting')
                    }
                },
                {
                    name: '取消分拣',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'cancelSorting')
                    }
                },
                {
                    name: '派工',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'dispatching')
                    }
                },
                {
                    name: '取消派工',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'cancelDispatching')
                    }
                },
                {
                    name: '派工确认',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'dispatchingAffirm')
                    }
                },
                {
                    name: '出库',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'cargoStorage')
                    }
                },
                {
                    name: '取消出库',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'cancelCargoStorage')
                    }
                },
                {
                    name: '确认签收',
                    action: 'TheAssigningOfTheTask.add',
                    fc: row => {
                        this.getRow(row, 'signFor')
                    }
                }
            ],
            // 预览
            modalVisible: false,
            titleB: '待派工详情',
            previewFooters: [

                { key: 'vehicle', name: '配送车辆' },
                { key: 'driverName', name: '司机姓名' },
                { key: 'driverPhone', name: '司机手机号' },
                { key: 'assistCodes', name: '辅助人' },
                { key: 'workTime', name: '派工时间' }
            ],
            previewContent: {},
            previewHeaders: [
                { key: 'saleStoreCode', name: '销货位置' },
                { key: 'sendTime', name: '预约取货日期' },
                { key: 'routeName', name: '线路' },
                { key: 'billType', name: '单据类型' },
                { key: 'custName', name: '顾客姓名' },
                { key: 'custPhone', name: '手机号' },
                { key: 'custAddr', name: '地址' },
                { key: 'pickStoreCode', name: '提货位置' },
                { key: 'pickType', name: '提货方式' },
                { key: 'parentCode', name: '原送货单号' },
                { key: 'saleReturn', name: '是否退货' },
                { key: 'workCount', name: '派工次数' },
                { key: 'sourceCode', name: '源销售单号' },
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
                { title: '是否安装', dataIndex: 'pickType', width: 100 },
                { title: '原数量', dataIndex: 'parentSkuNum', width: 150 },
                { title: '备注', dataIndex: 'note', width: 150 }
            ],
            categoryinfoData: [],
            scroll: { x: 1300 },
            aTimelineArr: [],
            orderId: '',
            schedulingGroupArr: [], // 调度组
            dispatchTable: '',
            schedulingGroupCodeName: '',
            flagImg1: true,
            flagImg2: true,
            flagImg3: true,
            flagImg4: true,
            flagImg5: true,
            flagImg6: true,
            flagImg7: true,
            flagImg8: true
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
        },
        amounts () {
            let sum = null
            if (this.billObj.am === 0) {
                sum = 0
            } else {
                sum = this.billObj.skuNums - this.billObj.am
            }
            return sum
        }
    },
    created () {
        this.schedulingGroupFun()
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableCode = '9c30addb0f8a4fab9dd4938f3fd5afdd:TheAssigningOfTheTask'
            // this.tableApiPath = 'BillDeliverFindStatistics'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
            this.billMessage()
        })
        this.pickUpTheGoodsLocation()
    },
    methods: {
        btnsFlagImg () {
            this.flagImg1 = true
            this.flagImg2 = true
            this.flagImg3 = true
            this.flagImg4 = true
            this.flagImg5 = true
            this.flagImg6 = true
            this.flagImg7 = true
            this.flagImg8 = true
        },
        /**
         * @name: 辅助派工
         * @msg:
         * @param {type}
         * @return:
         */
        assistWorkOrder () {
            this.btnsFlagImg()
            this.flagImg4 = false
            this.assistVisible = true
        },
        /**
         * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        pickUpTheGoodsLocation () {
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
                    this.$set(this.conditions[4], 'selectDataArr', data)
                    this.seachValue.pickStoreCode = this.$store.getters.storeInfo.code
                }
            })
        },
        previewFun () {
            // console.log('执行')
            if (this.deleteAll.length === 0) {
                return this.$message.warning('请选择单据!')
            } else if (this.deleteAll.length > 1) {
                return this.$message.warning('不可多选，请重新选择!')
            } else {
                const e = this.deleteAll[0]
                // console.log(e, '123456')
                this.orderId = e.code
                this.previewContent.headers = {
                    saleStoreCode: `${e.saleStoreCode}--${e.saleStoreName}`,
                    sendTime: e.sendTime,
                    routeName: e.routeName,
                    billType: e.billName,
                    custName: e.custName,
                    custPhone: e.custPhone,
                    custAddr: e.custAddr,
                    pickStoreCode: `${e.pickStoreCode}--${e.pickStoreName}`,
                    pickType: e.pickType,
                    parentCode: e.parentCode,
                    saleReturn: e.saleReturnName,
                    workCount: String(e.workCount),
                    sourceCode: e.sourceCode,
                    note: e.note
                }
                this.previewContent.footers = {
                    driverName: e.driverName,
                    vehicle: e.vehicle,
                    driverPhone: e.driverPhone,
                    assistCodes: e.assistNames,
                    workTime: e.workTime
                }
                axios({
                    path: 'BillDeliverQueryDeliverLog',
                    method: 'post',
                    body: {
                        deliverCode: e.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        // console.log(res, '物流详情')
                        this.aTimelineArr = res.data.list
                    }
                })
                // 表格信息
                var arr = [{ ...e }]
                // console.log(arr)
                this.categoryinfoData = arr
                this.modalVisible = true
            }
        },
        /**
               * @name:表格编辑
               */
        getRow (e, mun) {
            if (mun === 'separateBill') { // 分拣
                this.deleteAll = [e]
                this.onSeparateBill()
                // console.log(e, '6666')
            } else if (mun === 'sorting') { // 分拣
                this.deleteAll = [e]
                this.onSorting()
                // console.log(e, '6666')
            } else if (mun === 'cancelSorting') { // 取消分拣
                this.deleteAll = [e]
                this.onSortingOff()
            } else if (mun === 'dispatching') { // 派工
                this.deleteAll = [e]
                this.onDelivery()
            } else if (mun === 'cancelDispatching') { // 取消派工
                this.deleteAll = [e]
                this.dispatchOffObj.sendTimes = moment()
                this.onCancelDispatching()
            } else if (mun === 'dispatchingAffirm') { // 派工确认
                this.deleteAll = [e]
                this.onDispatchAffirm()
            } else if (mun === 'cargoStorage') { // 出库
                this.deleteAll = [e]
                this.deliveryStorage()
            } else if (mun === 'cancelCargoStorage') { // 取消出库
                this.deleteAll = [e]
                this.onStorageCon()
            } else if (mun === 'signFor') { // 确认签收
                this.deleteAll = [e]
                this.onSignForSelect()
            }
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
               * @name: 选中线路
               */
        onRadioChange (Radio) {
            // console.log(Radio)
            if (this.clientID) {
                const that = this
                this.$confirm({
                    title: '切换线路',
                    content: '是否确认切换到' + Radio.target.value.name + '线路',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'BillDeliverUpdateRouteChange',
                            method: 'post',
                            body: {
                                id: that.clientID,
                                routeCode: Radio.target.value.code,
                                routeName: Radio.target.value.name
                            }
                        }).then(res => {
                            that.radio = false
                            if (res.flag === 1) {
                                that.billMessage()
                                that.getDate()
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
               * @name:监听扫码出库返回
               */
        monitor (e) {
            if (e === '1') {
                this.billMessage()
                this.getDate()
            }
        },
        /**
               * @name: 获取地图点标记返回id
               */
        onObtain (e) {
            // console.log(e, '顾客id')
            if (e) {
                this.radio = true
                this.clientID = e
            } else {
                this.$message.warning('请选择顾客地址!')
            }
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
               * @name:判断退库
               */
        statusJudge (e) {
            const err = []
            let bool = true
            e.forEach(i => {
                if (i.saleReturn !== 'bill_deliver_make_status:1' || i.makeBillStatus !== 'bill_deliver_make_status:1') {
                    err.push(i)
                }
            })
            if (err.length > 0) {
                bool = false
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.code}单据已经申请退货,无法进行操作!`
                    })
                }
            }
            return bool
        },
        /**
               * @name:点击分拣
               */
        onSorting () {
            this.btnsFlagImg()
            this.flagImg2 = false
            const err = []
            const bool = this.statusJudge(this.deleteAll)
            if (!bool) { return }
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:1') {
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
                        description: `${i.code}单据状态为:${i.statusName},无法进行分拣!`
                    })
                }
            } else {
                const arr = []
                this.deleteAll.forEach(i => { arr.push(i.id) })
                const that = this
                this.$confirm({
                    title: '分拣',
                    content: '是否确认单据分拣?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'BillDeliverUpdateSorting',
                            method: 'post',
                            body: { ids: arr }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.billMessage()
                                that.getDate()
                            }
                        })
                    }
                })
            }
        },
        /**
               * @name:点击拆单按钮
               */
        onSeparateBill (e) {
            console.log(e)
            this.btnsFlagImg()
            this.flagImg1 = false
            const obj = { ...this.deleteAll[0] }
            obj.skuNums = obj.skuNum
            // console.log(obj, '666666')
            if (this.deleteAll.length !== 1) { return this.$message.warning('当前操作应选中一条单据,请重新选择单据!') }
            if (obj.saleReturn !== 'bill_deliver_make_status:1' || obj.makeBillStatus !== 'bill_deliver_make_status:1') { return this.$message.warning('当前单据已申请退货,不能拆单!') }
            if (obj.status === 'bill_deliver_status:1' || obj.status === 'bill_deliver_status:2') {
                if (obj.skuNums <= 1) { return this.$message.warning('送货数量小于等于1,不能拆单!') }
                // this.billObj = { ...this.deleteAll[0] }
                this.billObj = Object.assign(this.billObj, obj)
                this.DispatchVisible = true
            } else {
                return this.$message.warning(`当前选中单据状态为:${obj.statusName},不能拆单!`)
            }
        },
        /**
               * @name:取消分拣按钮
               */
        onSortingOff () {
            this.btnsFlagImg()
            this.flagImg3 = false
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:2') {
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
                        description: `${i.code}单据状态:${i.statusName},无法操作取消分拣!`
                    })
                }
            } else {
                this.onSelectConfig('bill_deliver_log_happen_type_sorting')
                this.cancelDispatchVisible = true
            }
        },
        /**
               * @name:取消分拣提交
               */
        onSortingOffSelect (e) {
            // console.log(e, '555')
            const ids = []
            if (!e.chacelNote) { return this.$message.error('请选择取消原因!') }
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            // console.log(e)
            axios({
                path: 'BillDeliverUpdateCancelSorting',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.cancelObj = {}
                    this.billMessage()
                    this.getDate()
                    this.cancelDispatchVisible = false
                }
            })
        },
        /**
               * @name:拆单提交
               */
        onDispatchConfirm (e) {
            if (!e.sendTimes) { return this.$message.warning('请选择预约送货时间') }
            e.sendTime = e.sendTimes.format('YYYY-MM-DD HH:mm:ss')
            e.skuNum = e.am
            axios({
                path: 'BillDeliverAddSplit',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.billMessage()
                    this.getDate()
                    this.DispatchVisible = false
                }
            })
        },
        /**
               * @name:派工按钮
               */
        onDelivery () {
            this.btnsFlagImg()
            this.flagImg5 = false
            const err = []
            this.dispatchObj = {}
            this.vehicle = ''
            if (this.deleteAll.length > 0) {
                const bool = this.statusJudge(this.deleteAll)
                if (!bool) { return }
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:2') {
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
                        description: `${i.code}单据状态为:${i.statusName},无法操作派工!`
                    })
                }
            } else {
                // console.log(this.deleteAll)
                this.billsList = [...this.deleteAll]
                this.tempObjArr = []
                this.getAll()
                this.deliveryVisible = true
            }
        },
        /**
               * @name:派工提交
               */
        onDispatch (e) {
            if (!e.driverCode) { return this.$message.error('请选择司机!') }
            e.assistCodes = this.tempObjArr.join(',')
            e.delivers = []
            e.vehicle = this.vehicle
            e.groupCode = this.schedulingGroup
            e.delivers.push(...this.billsList)
            // console.log(e)
            axios({
                path: 'BillDeliverUpdateDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    // this.dispatchObj = {}
                    this.billsList = []
                    this.billMessage()
                    this.getDate()
                    this.deliveryVisible = false
                }
            })
        },
        /**
               * @name: 点击派工确认
               */
        onDispatchAffirm () {
            this.btnsFlagImg()
            this.flagImg7 = false
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:3') {
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
                        description: `${i.code}单据状态为:${i.statusName},无法操作派工确认!`
                    })
                }
            } else {
                this.affirmVisible = true
            }
        },
        /**
               * @name:派工确认提交
               */
        onaffirmSelect (e) {
            const ids = []
            // console.log(e)
            if (!e.sendTimes) { return this.$message.error('请选择预约送货时间!') }
            e.sendTime = moment(e.sendTimes).format('YYYY-MM-DD HH:mm:ss')
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            // console.log(e)
            axios({
                path: 'BillDeliverUpdateConfirmDispatching',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.storageObj = {}
                    this.billMessage()
                    this.getDate()
                    this.affirmVisible = false
                }
            })
        },
        /**
               * @name:取消派工
               */
        onCancelDispatching () {
            this.btnsFlagImg()
            this.flagImg6 = false
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:3') {
                        if (i.status !== 'bill_deliver_status:4') {
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
                        description: `${i.code}单据状态为:${i.statusName},无法操作取消派工!`
                    })
                }
            } else {
                this.onSelectConfig('bill_deliver_log_happen_type_work')
                this.dispatchOffVisible = true
            }
        },
        /**
               * @name:派工取消提交
               */
        oncancelSelect (e) {
            // console.log(e, '555')
            const ids = []
            if (!this.dispatchOffObj.sendTimes) { return this.$message.error('请选择预约取货时间!') }
            if (!this.dispatchOffObj.chacelNote) { return this.$message.error('请选择取消原因!') }
            this.dispatchOffObj.sendTime = moment(this.dispatchOffObj.sendTimes).format('YYYY-MM-DD HH:mm:ss')
            if (e === 0) {
                this.dispatchOffObj.changeType = 0
            } else {
                this.dispatchOffObj.changeType = 1
            }
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            this.dispatchOffObj.ids = [...ids]
            // console.log(e)
            axios({
                path: 'BillDeliverUpdateCancelDispatching',
                method: 'post',
                body: this.dispatchOffObj
            }).then(res => {
                if (res.flag === 1) {
                    this.dispatchOffObj = {}
                    this.billMessage()
                    this.getDate()
                    this.dispatchOffVisible = false
                }
            })
        },
        /**
               * @name:确定辅助派工
               */
        assistSelect () {
            this.assistData = []
            if (!this.assist) { return this.$message.warning('请输入车辆满载量!') }
            if (!this.schedulingGroup) { return this.$message.warning('请选择调度组!') }
            this.nameless.carFullLoad = this.assist
            const obj = Object.assign(this.nameless, this.seachValue, { groupCode: this.schedulingGroup })
            this.onSeachAssist(obj)
        },
        /**
               * @name: 查询辅助单据
               */
        onSeachAssist (data = {}) {
            axios({
                path: 'BillDeliverQueryAuxiliaryDispatching',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    // console.log(res.data)
                    this.assistData = res.data.list
                    this.billsAssistVisible = true
                    this.assistVisible = false
                    this.getAll()
                    this.goodsType()
                }
            })
        },
        /**
               * @name: 辅助派工确认
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
                    this.billMessage()
                    this.getDate()
                    this.billsAssistVisible = false
                }
            })
        },
        /**
               * @name:出库
               */
        deliveryStorage () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:4') {
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
                        description: `${i.code}单据状态:${i.statusName},无法操作出库!`
                    })
                }
            } else {
                const arr = []
                this.deleteAll.forEach(i => { arr.push(i.id) })
                const that = this
                this.$confirm({
                    title: '出库确认',
                    content: '是否确认出库?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'BillDeliverUpdateConfirmOutbound',
                            method: 'post',
                            body: { ids: arr }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.billMessage()
                                that.getDate()
                            }
                        })
                    }
                })
            }
        },
        /**
               * @name: 取消出库
               */
        onStorageCon () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:5') {
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
                        description: `${i.code}单据状态为:${i.statusName},无法取消出库!`
                    })
                }
            } else {
                this.onSelectConfig('bill_deliver_log_happen_type_out')
                this.cancelVisible = true
            }
        },
        /**
               * @name: 取消出库确认
               */
        onCancelStorage (e) {
            if (!e.chacelNote) { return this.$message.error('请选择取消原因!') }
            const ids = []
            this.deleteAll.forEach(i => {
                ids.push(i.id)
            })
            e.ids = [...ids]
            axios({
                path: 'BillDeliverUpdateCancelOutbound',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    this.cancelStorageObj = {}
                    this.billMessage()
                    this.getDate()
                    this.cancelVisible = false
                }
            })
        },
        /**
               * @name: 确认签收
               */
        onSignForSelect () {
            this.btnsFlagImg()
            this.flagImg8 = false
            if (this.deleteAll.length === 0) {
                return this.$message.warning('请选择单据!')
            }
            let err = {}
            if (this.deleteAll[0].billType === 'bill_deliver_sale_type:1') {
                this.verification = true
            }
            if (this.deleteAll.length === 1) {
                if (this.deleteAll[0].status !== 'bill_deliver_status:5') {
                    err = { ...this.deleteAll[0] }
                }
            } else if (this.deleteAll.length >= 1) {
                return this.$message.warning('只能选中一条数据!')
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.code) {
                this.$notification.error({
                    message: '提示',
                    description: `${err.code}单据状态为:${err.statusName},无法确认签收!`
                })
            } else {
                this.signForVisible = true
            }
        },
        /**
               * @name: 签收确认提交
               */
        signForSelect (e) {
            if (this.verification) {
                if (!this.verificationCode) { return this.$message.error('请输入验证码!') }
            }
            axios({
                path: 'BillDeliverUpdateConfirmSign',
                method: 'post',
                body: {
                    id: this.deleteAll[0].id,
                    authCode: this.verificationCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.verificationCode = ''
                    this.billMessage()
                    this.getDate()
                    this.signForVisible = false
                }
            })
        },
        /**
               * @name:
               */
        amountChange () {
            if (this.billObj.am >= this.billObj.skuNums) {
                this.billObj.am = this.billObj.skuNums - 1
            }
        },
        vehicleChange (e) {
            // console.log(e)
            this.dispatchObj.vehicle = e
            // this.$set(this.dispatchObj, 'vehicle', e)
        },
        /**
               * @name: 监听司机
               */
        driverChange (e) {
            const arr = this.driverArr.filter(o => o.code === e)
            this.dispatchObj.driverName = arr[0].name
            this.vehicle = arr[0].carCode
            this.$set(this.dispatchObj, 'driverPhone', arr[0].phone)
            // console.log(arr, '手机')
            axios({
                path: 'DistributionVehicleFindAll',
                method: 'post',
                body: { driverCode: e }
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('车辆', res.data.list)
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
               * @name:获取单据信息
               */
        billMessage  (e = {}) {
            const obj = Object.assign(e, this.seachValue)
            axios({
                path: 'BillDeliverFindStatistics',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    for (const i of data.list) {
                        i.lng = i.longitude
                        i.lat = i.latitude
                    }
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
                    // 获取派工状态数量
                    this.list.forEach(e => {
                        if (e.status === '') {
                            e.numbers = data.statusDpg + data.statusDqr + data.statusDck + data.statusPszt + data.statusPswc + data.statusDfj
                        } else if (e.status === 'bill_deliver_status:1') {
                            e.numbers = data.statusDfj
                        } else if (e.status === 'bill_deliver_status:2') {
                            e.numbers = data.statusDpg
                        } else if (e.status === 'bill_deliver_status:3') {
                            e.numbers = data.statusDqr
                        } else if (e.status === 'bill_deliver_status:4') {
                            e.numbers = data.statusDck
                        } else if (e.status === 'bill_deliver_status:5') {
                            e.numbers = data.statusPszt
                        } else if (e.status === 'bill_deliver_status:6') {
                            e.numbers = data.statusPswc
                        }
                    })
                    if (data.routes.length > 0) {
                        data.routes.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                    }
                    this.customerList = data.routes
                    this.pathList = data.routes
                    this.pathLists = data.routes
                    this.coordinate = data.list
                    this.nuRoute = data.nuRoute
                    // console.log(data.list, '获取所有数据')
                }
            })
        },
        /**
               * @name:点击单据类型
               */
        billTypeChange (e) {
            // console.log(e)
            for (const i of this.billTypeList) {
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
               * @name: 点击派工状态
               */
        dispatchingTypeChange (e) {
            for (const i of this.list) {
                if (e.status === i.status) {
                    i.backColor = '#1890ff'
                } else {
                    i.backColor = ''
                }
            }
            // this.billMessage({ status: e.status })
            this.seachValue.status = e.status
            this.onSeach(this.seachValue)
        },
        /**
               * @name: 线路选择
               */
        pathChange (e) {
            this.isActive = true
            this.routeList = []
            const arr = this.pathLists.filter(i => i.code === e.code)
            arr[0].routeInfoList.forEach(i => {
                this.routeList.push([i.longitude, i.latitude])
            })
            this.centralPoint = [arr[0].longitude, arr[0].latitude]
            // console.log(this.routeList, '999999999')
            this.onSeach({ routeCode: e.code })
        },
        undistributedPath () {
            this.routeList = []
            this.centralPoint = [this.pathLists[0].longitude, this.pathLists[0].latitude]
            // this.billMessage({ routeCode: 'nu-ll' })
            this.onSeach({ routeCode: 'nu-ll' })
        },
        selectIcon () {
            if (this.iconType === 'right') {
                this.iconType = 'left'
            } else if (this.iconType === 'left') {
                this.iconType = 'right'
            }
        },
        /**
               * @name: 搜索线路
               */
        selectPath (e = '') {
            // console.log(e)
            if (this.pathList.length > 0 && e) {
                const newData = [...this.pathLists]
                const arr = newData.filter(o => o.code === e)
                this.pathList = arr
            } else if (!e) {
                this.pathList = [...this.pathLists]
            }
        },
        /**
               * @name:获取搜索框数据
               */
        onSeach (e = {}) {
            this.seachValue.path = 'BillDeliverFindStatistics'
            const obj = Object.assign(e, this.seachValue)
            this.$refs.newTable.setTableData(this.tableCode, obj)
            this.billMessage(obj)
        },
        /**
               * @name:监听单据表格编辑
               */
        InputChange (val, count, key) {
            // console.log(val, count, key)
            const newData = [...this.assistData]
            const target = newData.filter(item => count === item.code)[0]
            if (target) {
                target[key] = val
                this.assistData = newData
            }
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
                this.$refs.newTable.exportFile('BillDeliverFindStatistics', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        /**
               * @name: 清空搜索
               */
        onReload () {
            this.seachValue = {
                dateType: 1
            }
        },
        /**
               * @name:表格多选方法
               */
        onChangeTable (keys, rows) {
            this.deleteAll = [...rows]
            // console.log(this.deleteAll, '多选')
        },
        /**
               * @name: 刷新表格
               */
        getDate () {
            this.$refs.newTable.setTableData('9c30addb0f8a4fab9dd4938f3fd5afdd:TheAssigningOfTheTask', { path: 'BillDeliverFindStatistics' })
        },
        disabledDate (current) {
            return current && current <= moment().subtract(1, 'days')
        },
        disabledDates (e) {
            return e !== moment()
        },
        /**
               * @name:用户返回数据
               */
        onUsersSelect (e) {
            // console.log(e, '55555555')
            const arr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...arr, ...map(e, 'code')])]
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
               * @name:派工删除单据
               */
        onBillsDel (del) {
            // console.log(del)
            this.billsList.splice(del, 1)
        },
        /**
               * @name: 司机 / 辅助人 下拉框
               */
        getAll () {
            // 司机
            axios({
                path: 'DistributionReturnsFindDrivers',
                method: 'post',
                body: {
                    groupCode: '010'
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
        selectFocusEffect () {
            this.userPams = {
                include: {
                    type: 'sys_user_type:2,sys_user_type:1'
                }
            }
            this.usersVisible = true
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
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
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        ScanningOutboundOpen () {
            this.$refs.OutboundRef.scanOpen()
        },
        schedulingGroupFun () {
            // 调度组
            axios({
                path: 'DistributionDispatchingGroupFindByUser',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.groupName}`
                        i.value = i.code
                    })
                    this.schedulingGroupArr = [...data]
                    this.schedulingGroup = this.schedulingGroupArr[0].code
                    this.dispatchTable = this.schedulingGroupArr[0].code
                    this.schedulingGroupCodeName = `${this.schedulingGroupArr[0].code}:${this.schedulingGroupArr[0].groupName}`
                    this.seachValue.groupCode = this.dispatchTable
                    this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                }
            })
        },
        dispatchTableFun (e) {
            this.schedulingGroup = e
            this.seachValue.groupCode = e
            for (const i of this.schedulingGroupArr) {
                if (i.code === e) {
                    this.schedulingGroupCodeName = `${i.code}:${i.groupName}`
                }
            }
            setTimeout(() => {
                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
            }, 200)
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'TheAssigningOfTheTask') {
                this.schedulingGroupFun()
                this.pickUpTheGoodsLocation()
            }
        }
    }
}
</script>
<style lang="less">
// 按钮组
.btnImg{
    box-sizing: border-box;
    padding: 30px 0;
    div{
        width: 12.5%;
        height: 40px;
        display: inline-block;
        div{
            font-size: 16px;
            width: 100%;
            height: 100%;
            text-align: center;
            line-height: 40px;
            font-family: PingFangSC-Medium;
            font-weight: bold;
        }
    }
    .btnImg1{
        background: url('../../../assets/workOrderImg/1-1.png');
        background-size: 100% 100%;
    }
    .btnImgA{
        background: url('../../../assets/workOrderImg/1-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg1:hover{
        background: url('../../../assets/workOrderImg/1-2.png');
        background-size: 100% 100%;
    }
    .btnImg2{
        background: url('../../../assets/workOrderImg/2-1.png');
        background-size: 100% 100%;
    }
    .btnImgB{
        background: url('../../../assets/workOrderImg/2-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg2:hover{
        background: url('../../../assets/workOrderImg/2-2.png');
        background-size: 100% 100%;
    }
    .btnImg3{
        background: url('../../../assets/workOrderImg/3-1.png');
        background-size: 100% 100%;
    }
    .btnImgC{
        background: url('../../../assets/workOrderImg/3-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg3:hover{
        background: url('../../../assets/workOrderImg/3-2.png');
        background-size: 100% 100%;
    }
    .btnImg4{
        background: url('../../../assets/workOrderImg/4-1.png');
        background-size: 100% 100%;
    }
    .btnImgD{
        background: url('../../../assets/workOrderImg/4-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg4:hover{
        background: url('../../../assets/workOrderImg/4-2.png');
        background-size: 100% 100%;
    }
    .btnImg5{
        background: url('../../../assets/workOrderImg/5-1.png');
        background-size: 100% 100%;
    }
    .btnImgE{
        background: url('../../../assets/workOrderImg/5-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg5:hover{
        background: url('../../../assets/workOrderImg/5-2.png');
        background-size: 100% 100%;
    }
    .btnImg6{
        background: url('../../../assets/workOrderImg/6-1.png');
        background-size: 100% 100%;
    }
    .btnImgF{
        background: url('../../../assets/workOrderImg/6-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg6:hover{
        background: url('../../../assets/workOrderImg/6-2.png');
        background-size: 100% 100%;
    }
    .btnImg7{
        background: url('../../../assets/workOrderImg/7-1.png');
        background-size: 100% 100%;
    }
    .btnImgG{
        background: url('../../../assets/workOrderImg/7-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg7:hover{
        background: url('../../../assets/workOrderImg/7-2.png');
        background-size: 100% 100%;
    }
    .btnImg8{
        background: url('../../../assets/workOrderImg/8-1.png');
        background-size: 100% 100%;
    }
    .btnImgH{
        background: url('../../../assets/workOrderImg/8-3.png');
        background-size: 100% 100%;
        color: #fff;
    }
    .btnImg8:hover{
        background: url('../../../assets/workOrderImg/8-2.png');
        background-size: 100% 100%;
    }
}

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
.active {
    background: pink;
}
.search {
    .ant-col-3 {
        text-align: right;
        padding-right: 20px;
        line-height: 32px;
    }
}
.sorll {
    height: 411px;
    /* overflow-y: auto; */
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
.mintHeatBtnRight {
    float: right;
    button{
        font-size: 12px;
        padding: 7px 19px 25px 19px;
    }
}
.mintMap {
    width: 100%;
    transition: 0.2s;
    position: relative;
}
.mintMap .mintMapRight {
    height: 100%;
    background:#fff;
    opacity: 0.9;
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
/* // .mintMission {
    // width: 100%;
    // height: 90px;
    // .ant-btn-primary {
    //     width: 70px;
    // }
// } */
.schedulingGroupStyle{
    width: 290px;
    float: right;
    box-sizing: border-box;
    padding-left: 50px;
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
    /* // 预览 */
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
.ant-col-20 {
font-weight: bold;
}
.amap-logo {
    bottom:-100px;
    display: none;
}
.amap-copyright {
    bottom:-100px;
    display: none;
}
.billType {
    margin: 0 10px;
    font-size: 12px;
    padding: 7px 19px 25px 19px;
}
</style>

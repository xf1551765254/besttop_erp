<!--
 * @Description: 监控管理
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-05-22 16:21:53
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 16:31:51
 -->
<template>
  <div>
    <a-tabs @change="callback">
      <a-tab-pane tab="售后监控" key="afterSelas" />
      <a-tab-pane tab="物流监控" key="logistics" />
    </a-tabs>
    <!-- 地图状态 -->
    <div>
      <div class="mintHeat" v-if="tabName==='afterSelas'">
        <div :class="['mintHeatBtn',afterSelasStatus===item.status?'mintHeatBtnChose':'']" :style="{width: item.width + 'px'}" v-for="(item, index) in mapSelasList" :key="index" @click="onSeach({status: item.status})">
          {{ item.name }}({{ item.numbers }})<span class="iconfont" :style="{'color':item.iconColor}">&#xe61a;</span>
        </div>
        <div class="mintHeatBtnRight">
          <a-button type="primary" size="small" @click="controlMap = !controlMap">
            <a-icon :type="!controlMap?'caret-down':'caret-up'"/> {{ controlMap?'打开图片':'隐藏图片' }}
          </a-button>
        </div>
      </div>
      <div class="mintHeat" v-else>
        <div :class="['mintHeatBtn',logisticsStatus===item.status?'mintHeatBtnChose':'']" :style="{width: item.width + 'px'}" v-for="(item, index) in mapLogisticsList" :key="index" @click="onSeach({status: item.status})">
          {{ item.name }}({{ item.numbers }})<span class="iconfont" :style="{'color':item.iconColor}">&#xe61a;</span>
        </div>
        <div class="mintHeatBtnRight">
          <a-button type="primary" size="small" @click="controlLogisticsMap = !controlLogisticsMap">
            <a-icon :type="!controlMap?'caret-down':'caret-up'"/>{{ controlMap?'打开图片':'隐藏图片' }}
          </a-button>
        </div>
      </div>
      <div class="mintMap" :style="{height: tabName==='afterSelas'?heightMap + 'px':logisticsheightMap + 'px' }">
        <!-- <div class="mintMap" :style="{height: heightMap + 'px' }"> -->
        <mapMar
          ref="mapMar"
          :lat="lat"
          :lng="lng"
          :height="tabName==='afterSelas'?heightMap:logisticsheightMap"
          :coordinate="coordinate" />
      </div>
    </div>
    <!-- 搜索工具 -->
    <div style="margin-top:10px">
      <div v-if="tabName==='afterSelas'">
        <seach-box
          :conditions="conditionsOne"
          :btns="btns"
          v-model="seachValueOne"
          @onReload="onReload"
          @onClick="onSeachClick"
          @onSeach="onSeach">
          <div class="btn-box">
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="sortingHandler()">分拣</a-button>
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="assigningHandler()">派工</a-button>
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="confirmHandler()">派工确认</a-button>
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="afterConfirmHandler()">服务确认</a-button>
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="evaluationHandler()">评价</a-button>
            <a-button size="small" type="primary" style="margin-right:10px" v-action:edit @click="invalidHandler()">作废</a-button>
            <a-button size="small" type="primary" v-action:edit @click="cancelHandler(-1)">取消</a-button>
          </div>
        </seach-box>
      </div>
      <div v-else>
        <seach-box
          :conditions="conditionsTow"
          :btns="btns"
          v-model="seachValueTow"
          @onReload="onReload"
          @onClick="onSeachClick"
          @onSeach="onSeach">
        </seach-box>
      </div>
    </div>
    <!-- main table -->
    <NewTable
      ref="newTable"
      :height="tableHeight"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="tabName==='afterSelas'?seachValueOne:seachValueTow"
      :rowSelect="tabName==='afterSelas'?true:false"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect" />
    <!-- 监控流程 弹框 -->
    <bt-modal
      v-model="processModal"
      :title="processTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading" >
      <a-card class="cardBody">
        <a-steps :current="stepsIndex" labelPlacement="vertical">
          <a-step title="新增" >
          </a-step>
          <a-step title="分拣" >
          </a-step>
          <a-step title="派工" >
          </a-step>
          <a-step title="派工确认">
          </a-step>
          <a-step title="服务">
          </a-step>
          <a-step title="评价">
          </a-step>
          <a-step title="服务完成">
          </a-step>
        </a-steps>
      </a-card>
      <!-- 派工 -->
      <a-card v-if="stepsIndex===2" title="派工信息" style="margin-top:10px" :bodyStyle="{padding:'15px'}" :headStyle="{padding:'0 15px'}">
        <a-form :form="form">
          <a-row>
            <a-col :sm="8" :md="4" :xl="2">负责人</a-col>
            <a-col :sm="16" :md="8" :xl="6">
              <a-form-item>
                <a-select
                  showSearch
                  placeholder="请选择负责人人"
                  style="width: 100%"
                  :filterOption="false"
                  @search="handlecreateByDorpArr"
                  :options="createByDorpArr"
                  v-decorator="$check('AftersalesMonitoring.chargeBy',{})"
                  allowClear/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="2">参与人</a-col>
            <a-col :sm="16" :md="8" :xl="6">
              <a-form-item>
                <a-select
                  showSearch
                  placeholder="请选择参与人"
                  style="width: 100%"
                  mode="multiple"
                  @search="handlecreateByDorpArr"
                  :filterOption="false"
                  :options="createByDorpArr"
                  v-decorator="$check('AftersalesMonitoring.joinBy',{})"
                  allowClear/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="2">费用</a-col>
            <a-col :sm="16" :md="8" :xl="6">
              <a-form-item>
                <a-input-number
                  style="width:100%"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :precision="2"
                  v-decorator="$check('AftersalesMonitoring.servicePrice', {initialValue:0.00})"
                  placeholder="请输入费用"/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="2">配件费用</a-col>
            <a-col :sm="16" :md="8" :xl="6">
              <a-form-item>
                <a-input-number
                  style="width:100%"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :precision="2"
                  v-decorator="$check('AftersalesMonitoring.partsPrice', {initialValue:0.00})"
                  placeholder="请输入配件费用"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="2">备注</a-col>
            <a-col :sm="16" :md="20" :xl="22">
              <a-form-item>
                <a-textarea
                  placeholder="请输入备注"
                  :row="2"
                  v-decorator="$check('AftersalesMonitoring.dispatchNote', {initialValue:''})"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
      <!-- 商品 -->
      <a-card style="margin-top:10px" :bodyStyle="{padding:'15px'}" :headStyle="{padding:'0 15px'}">
        <div slot="title">
          <a-checkbox
            :indeterminate="indeterminate"
            @change="onCheckAllChange"
            :checked="checkAll">
          </a-checkbox>
          {{ `当前${processTitle}的商品` }}
        </div>
        <a-checkbox-group @change="onChangeCheckbox" style="width:100%" v-model="goodScelect">
          <a-row
            v-for="(item,index) in processDataArr"
            :key="index"
            type="flex"
            justify="start"
            align="middle"
            class="cardLists">
            <a-col :span="1">
              <p><a-checkbox :value="item.id" style="width:100%"></a-checkbox></p>
            </a-col>
            <a-col :span="23" >
              <div style="border:1px solid #d9d9d9">
                <!-- 派工信息  可输入 -->
                <div v-if="stepsIndex===4" style="border-bottom:1px solid #d9d9d9">
                  <a-form>
                    <a-row style="padding:15px">派工信息</a-row>
                    <a-row style="padding-right:5px">
                      <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
                      <a-col :sm="16" :md="8" :xl="5">
                        <a-form-item>
                          <a-select
                            placeholder="请选择分责人"
                            showSearch
                            style="width: 100%"
                            @search="handlecreateByDorpArr"
                            :filterOption="false"
                            v-model="item.chargeBy"
                            :options="createByDorpArr"/>
                        </a-form-item>
                      </a-col>
                      <a-col :sm="8" :md="4" :xl="3">参与人</a-col>
                      <a-col :sm="16" :md="8" :xl="5">
                        <a-form-item>
                          <a-select
                            placeholder="请选择参与人"
                            showSearch
                            style="width: 100%"
                            v-model="item.joinBy"
                            @search="handlecreateByDorpArr"
                            :filterOption="false"
                            mode="multiple"
                            :maxTagCount="1"
                            allowClear
                            :options="createByDorpArr"/>
                        </a-form-item>
                      </a-col>
                      <a-col :sm="8" :md="4" :xl="3">费用</a-col>
                      <a-col :sm="16" :md="8" :xl="5">
                        <a-form-item>
                          <a-input-number
                            placeholder="请输入费用"
                            style="width:100%;"
                            :min="0"
                            :max="Number.MAX_SAFE_INTEGER"
                            :step="1"
                            :precision="2"
                            v-model="item.servicePrice" />
                        </a-form-item>
                      </a-col>
                      <a-col :sm="8" :md="4" :xl="3">配件费用</a-col>
                      <a-col :sm="16" :md="8" :xl="5">
                        <a-form-item>
                          <a-input-number
                            placeholder="请输入配件费用"
                            style="width:100%;"
                            :min="0"
                            :max="Number.MAX_SAFE_INTEGER"
                            :step="1"
                            :precision="2"
                            v-model="item.partsPrice" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row style="padding-right:5px" v-if="stepsIndex===2">
                      <a-col :sm="8" :md="4" :xl="3">备注</a-col>
                      <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
                        <a-textarea
                          placeholder="请输入备注"
                          :row="2"
                          style="width:100%"
                          v-model="item.dispatchNote" />
                      </a-col>
                    </a-row>
                    <a-row style="padding-right:5px" v-if="stepsIndex===4">
                      <a-col :sm="8" :md="4" :xl="3">备注</a-col>
                      <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:20">
                        <a-textarea
                          placeholder="请输入备注"
                          :row="2"
                          style="width:100%"
                          v-model="item.operateNote" />
                      </a-col>
                    </a-row>
                  </a-form>
                </div>
                <!-- 派工信息  不可输入 -->
                <div style="border-bottom:1px solid #d9d9d9;padding:10px 20px" v-if="stepsIndex===3||stepsIndex===5" class="process">
                  <a-row>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">负责人：{{ item.chargeBy+'-'+item.chargeName }}</a-col>
                    <a-col :sm="24" :md="24" :xl="12" class="processCol ColHeightNo">参与人：
                      <a-tooltip placement="topLeft" autoAdjustOverflow>
                        <template slot="title">
                          <span> {{ item.joinS }}</span>
                        </template>
                        {{ item.joinS }}
                      </a-tooltip>
                    </a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">费用：{{ item.servicePrice }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">配件费用：{{ item.partsPrice }}</a-col>
                  </a-row>
                  <a-row>
                    <a-col class="processCol">
                      备注：{{ item.additionalNote }}
                    </a-col>
                  </a-row>
                </div>
                <!-- 商品信息-->
                <a-row style="border-bottom:1px solid #d9d9d9">
                  <!-- 左 -->
                  <a-col :span="12" style="border-right:1px solid #d9d9d9">
                    <div>
                      <a-row :gutter="20" style="padding:5px">
                        <a-col :span="7">
                          <div style="height:90px; width:110px">
                            <img
                              v-if="item.pic"
                              style="display:block"
                              :src="item.pic.split(',')[0]"
                              alt=""
                              height="90"
                              width="110"
                              :onerror="defaultImgUrl">
                            <img
                              v-else
                              class=""
                              alt="example"
                              height="90"
                              width="110"
                              style="height:90px"
                              src="@assets/goods.png" />
                          </div>
                        </a-col>
                        <a-col style="height:90px" :span="17">
                          <div class="goodsFlex">
                            <div style="margin-top:1em">
                              <span>{{ item.skuName }}</span>
                            </div>
                            <div>
                              <span style="">{{ item.skuCode }}</span> <span style="margin-left:10px">{{ item.skuModel }}</span>
                            </div>
                            <div>
                              <p>数量：{{ item.skuQuantity }}</p>
                            </div>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                  </a-col>
                  <!-- 右 -->
                  <a-col :span="12">
                    <div style="height:90px;margin-left:20px">
                      <div class="goodsFlex">
                        <div style="margin-top:1em">
                          <p><a-icon type="user"/><span style="margin-left:10px">{{ item.customerName }}</span> <span style="margin-left:10px">{{ item.customerTelephone }}</span></p>
                        </div>
                        <div class="">
                          <p><a-icon type="environment" /><span style="margin-left:10px">{{ item.customerAddress }}</span></p>
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
                <!-- 订单物流信息 -->
                <div style="padding:10px 20px" class="process" v-if="item.serviceName==='安装'">
                  <a-row>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">预约配送时间：{{ item.sendTime }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">下单时间：{{ item.sourceTime }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">送货单号：{{ item.logisticsCode }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">物流状态：{{ item.logisticsStatusName }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">类型：安装</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">服务预约时间：{{ item.orderInstallTime }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">来源：{{ item.sourceName }}</a-col>
                  </a-row>
                  <a-row>
                    <a-col class="processCol">
                      备注：{{ item.sendNote }}
                    </a-col>
                  </a-row>
                </div>
                <div style="padding:10px 20px" class="process" v-else>
                  <a-row>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">类型：{{ item.serviceName }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">服务预约时间：{{ item.orderInstallTime }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8" class="processCol">来源：{{ item.sourceName }}</a-col>
                  </a-row>
                  <a-row>
                    <a-col class="processCol">
                      备注：{{ item.sendNote }}
                    </a-col>
                  </a-row>
                </div>
                <!-- 服务时间 -->
                <div style="border-top:1px solid #d9d9d9;padding:10px" v-if="stepsIndex===3" class="doc">
                  <a-row>
                    <a-col :sm="4" :md="4" :xl="3" style="text-align:right;line-height:32px;margin-bottom:0;">服务状态：</a-col>
                    <a-col :sm="20" :md="20" :xl="8" style="line-height:32px;margin-bottom:0;">
                      <a-radio-group buttonStyle="solid" v-model="item.needService">
                        <!-- <a-radio-button value="1">需要服务</a-radio-button> -->
                        <!-- <a-radio-button value="0">暂不服务</a-radio-button> -->
                        <a-radio value="1">需要服务</a-radio>
                        <a-radio value="0">暂不服务</a-radio>
                      </a-radio-group>
                    </a-col>
                    <a-col :sm="4" :md="4" :xl="3" style="text-align:right;line-height:32px;margin-bottom:0;">预约时间：</a-col>
                    <a-col :sm="20" :md="20" :xl="10" style="margin-bottom:0;">
                      <div>
                        <a-row type="flex" justify="start" v-if="item.needService==='1'">
                          <a-col >
                            <a-date-picker
                              disabled
                              placeholder=""
                              suffixIcon=""
                              v-model="item.orderInstallDateOne"
                              format="YYYY-MM-DD"/>
                          </a-col>
                          <a-col>
                            <a-time-picker v-model="item.orderInstallTimePackOne" format="HH:mm" />
                          </a-col>
                        </a-row>
                        <a-row v-else type="flex" justify="start">
                          <a-col>
                            <a-date-picker
                              :disabledDate="disabledDateOrder"
                              placeholder=""
                              v-model="item.orderInstallDateTow"
                              format="YYYY-MM-DD"/>
                          </a-col>
                          <a-col>
                            <a-time-picker v-model="item.orderInstallTimePackTow" format="HH:mm" />
                          </a-col>
                        </a-row>
                      </div>
                    </a-col>
                  </a-row>
                  <a-row style="margin-top:10px">
                    <a-col :sm="4" :md="4" :xl="2" style="text-align:right;line-height:32px;margin-bottom:0;">备注：</a-col>
                    <a-col :sm="20" :md="20" :xl="22" style="height:auto;margin-bottom:0">
                      <a-textarea
                        placeholder="请输入备注"
                        :row="2"
                        style="width:100%"
                        v-model="item.dispatchConfirmNote" />
                    </a-col>
                  </a-row>
                </div>
                <!-- 评价 -->
                <div style="border-top:1px solid #d9d9d9;padding:10px" v-if="stepsIndex===5">
                  <a-row style="padding-right:5px">
                    <a-col :sm="4" :md="3" :xl="2" style="text-align:right;">备注：</a-col>
                    <a-col :sm="20" :md="21" :xl="22" style="height:auto;margin-bottom:0">
                      <a-textarea
                        placeholder="请输入备注"
                        :row="2"
                        style="width:100%"
                        v-model="item.commentNote" />
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :sm="4" :md="3" :xl="2" style="text-align:right;line-height:39px">评分：</a-col>
                    <a-col :sm="19" :md="20" :xl="21" style="height:auto;margin-bottom:0">
                      <a-rate allowHalf v-model="item.commentScore" allowClear >
                        <a-icon slot="character" type="heart"/>
                      </a-rate>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-card>
    </bt-modal>
    <!-- 详情 -->
    <div>
      <preview
        v-model="previewVisbel"
        :headers="previewHeaders"
        :content="previewContent"
        class="margnTop">
        <div slot="A" title="商品和订单信息">
          <a-row style="border:1px solid #d9d9d9">
            <!-- 左 -->
            <a-col :span="12" style="border-right:1px solid #d9d9d9">
              <div>
                <a-row :gutter="20" style="padding:5px">
                  <a-col :span="7">
                    <div style="height:90px; width:110px">
                      <img
                        v-if="previewDetailData.pic"
                        :src="previewDetailData.pic.split(',')[0]"
                        alt=""
                        height="90"
                        width="110"
                        :onerror="defaultImgUrl">
                      <img
                        v-else
                        class=""
                        height="90"
                        width="110"
                        alt=""
                        style="height:90px"
                        src="@assets/goods.png" />
                    </div>
                  </a-col>
                  <a-col style="height:90px" :span="17">
                    <div class="goodsFlex">
                      <div style="margin-top:1em">
                        <span>{{ previewDetailData.skuName }}</span>
                      </div>
                      <div>
                        <span style="">{{ previewDetailData.skuCode }}</span> <span style="margin-left:10px">{{ previewDetailData.skuModel }}</span>
                      </div>
                      <div>
                        <p>数量：{{ previewDetailData.skuQuantity }}</p>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-col>
            <!-- 右 -->
            <a-col :span="12">
              <div style="height:90px;margin-left:20px">
                <div class="goodsFlex">
                  <div style="margin-top:1em">
                    <p><a-icon type="user"/><span style="margin-left:10px">{{ previewDetailData.customerName }}</span> <span style="margin-left:10px">{{ previewDetailData.customerTelephone }}</span></p>
                  </div>
                  <div class="">
                    <p><a-icon type="environment" /><span style="margin-left:10px">{{ previewDetailData.customerAddress }}</span></p>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
          <div style="padding:10px;border:1px solid #d9d9d9;margin-top:10px" v-if="previewDetailData.serviceName==='安装'">
            <a-row>
              <a-col :sm="24" :md="12" :xl="8">预约配送时间：{{ logisticsData.sendTime }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">下单时间：{{ logisticsData.sourceTime }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">送货单号：{{ logisticsData.logisticsCode }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">物流状态：{{ logisticsData.logisticsStatusName }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">类型：安装</a-col>
              <a-col :sm="24" :md="12" :xl="8">服务预约时间：{{ logisticsData.orderInstallTime }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">来源：{{ logisticsData.sourceName }}</a-col>
            </a-row>
            <a-row>
              备注：{{ logisticsData.sendNote }}
            </a-row>
          </div>
          <div style="padding:10px;border:1px solid #d9d9d9;margin-top:10px" v-if="previewDetailData.serviceName!=='安装'">
            <a-row>
              <a-col :sm="24" :md="12" :xl="8">类型：{{ logisticsData.serviceName }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">服务预约时间：{{ logisticsData.orderInstallTime }}</a-col>
              <a-col :sm="24" :md="12" :xl="8">来源：{{ logisticsData.sourceName }}</a-col>
            </a-row>
            <a-row>
              备注：{{ logisticsData.note }}
            </a-row>
          </div>
        </div>
        <div slot="B" title="流程">
          <div v-if="previewDetailArr.length===0">
            <a-row style="text-align:center;font-size:20px;color:#C0C4CC">暂无流程信息</a-row>
          </div>
          <div v-else>
            <a-steps direction="vertical" :current="previewDetailArr.length-1">
              <a-step v-for="(item,index) in previewDetailArr" :key="index">
                <a-icon type="setting" slot="icon" v-if="item.operateName==='分拣'"/>
                <a-icon type="solution" slot="icon" v-if="item.operateName==='派工'"/>
                <a-icon type="check-square" slot="icon" v-if="item.operateName==='派工确认'"/>
                <a-icon type="smile" slot="icon" v-if="item.operateName==='评价'"/>
                <a-icon type="close-circle" slot="icon" v-if="item.operateName==='取消'"/>
                <a-icon type="appstore" slot="icon" v-if="item.operateName==='服务确认'"/>
                <a-icon type="check-circle" slot="icon" v-if="item.operateName==='安装完成'"/>
                <a-icon type="stop" slot="icon" v-if="item.operateName==='作废'"/>
                <a-icon type="shopping" slot="icon" v-if="item.operateName==='退货'"/>
                <a-row slot="title" type="flex">
                  <a-col>
                    {{ item.statusName }}
                  </a-col>
                  <a-col style="margin-left:20px;color:#409EFF">
                    {{ item.operateName }}
                  </a-col>
                </a-row>
                <div slot="description">
                  <a-row v-if="item.status!=='service_bill_log_status:6'">
                    <a-col :sm="24" :md="12" :xl="8">操作人：{{ item.createBy+"-"+item.createName }} </a-col>
                    <a-col :sm="24" :md="12" :xl="8">操作店：{{ item.makeStoreCode+"-"+item.makeStoreName }}</a-col>
                    <a-col :sm="24" :md="12" :xl="8">操作时间：{{ item.createTime }}</a-col>
                  </a-row>
                  <!-- 派工 -->
                  <div v-if="item.status==='service_bill_log_status:2'">
                    <div style="border:1px solid #d9d9d9;margin-top:5px;background-color:rgba(63, 81, 181, 0.08);padding:10px">
                      <a-row>
                        <a-col :sm="24" :md="12" :xl="8">
                          负责人：{{ item.chargeBy+'-'+item.chargeName }}
                        </a-col>
                        <a-col :sm="24" :md="24" :xl="12" class="aColHeightNo">参与人：
                          <a-tooltip placement="topLeft" autoAdjustOverflow>
                            <template slot="title">
                              <span> {{ item.joinS }}</span>
                            </template>
                            {{ item.joinS }}
                          </a-tooltip>
                        </a-col>
                        <a-col :sm="24" :md="12" :xl="8">费用：{{ item.servicePrice }}</a-col>
                        <a-col :sm="24" :md="12" :xl="8">配件费用：{{ item.partsPrice }}</a-col>
                      </a-row>
                      <a-row>
                        备注：{{ item.operateNote }}
                      </a-row>
                    </div>
                  </div>
                  <!-- 派工确认 -->
                  <div v-if="item.status==='service_bill_log_status:3'">
                    <div style="border:1px solid #d9d9d9;margin-top:5px;background-color:rgba(63, 81, 181, 0.08);padding:10px">
                      <a-row>
                        <a-col :sm="24" :md="12" :xl="8">服务状态：{{ item.needService==='是'?'需要服务':'暂不服务' }}</a-col>
                        <a-col :sm="24" :md="24" :xl="12">预约时间：{{ item.orderInstallTime }}</a-col>
                      </a-row>
                      <a-row>
                        备注：{{ item.operateNote }}
                      </a-row>
                    </div>
                  </div>
                  <!-- 4服务确认 -->
                  <div v-if="item.status==='service_bill_log_status:4'">
                    <div style="border:1px solid #d9d9d9;margin-top:5px;background-color:rgba(63, 81, 181, 0.08);padding:10px">
                      <a-row>
                        <a-col :sm="24" :md="12" :xl="8">负责人：{{ item.chargeBy+'-'+item.chargeName }}</a-col>
                        <a-col :sm="24" :md="24" :xl="12" class="aColHeightNo">参与人：
                          <a-tooltip placement="top" autoAdjustOverflow>
                            <template slot="title">
                              <span> {{ item.joinS }}</span>
                            </template>
                            {{ item.joinS }}
                          </a-tooltip>
                        </a-col>
                        <a-col :sm="24" :md="12" :xl="8">费用：{{ item.servicePrice }}</a-col>
                        <a-col :sm="24" :md="12" :xl="8">配件费用：{{ item.partsPrice }}</a-col>
                      </a-row>
                      <a-row>
                        备注：{{ item.operateNote }}
                      </a-row>
                    </div>
                  </div>
                  <!-- 5评价 -->
                  <div v-if="item.status==='service_bill_log_status:5'">
                    <div style="border:1px solid #d9d9d9;margin-top:5px;background-color:rgba(63, 81, 181, 0.08);padding:10px">
                      <a-row>
                        评分：
                        <a-rate allowHalf v-model="item.commentScore" disabled>
                          <a-icon slot="character" type="heart"/>
                        </a-rate>
                      </a-row>
                      <a-row>
                        备注：{{ item.operateNote }}
                      </a-row>
                    </div>
                  </div>
                </div>
              </a-step>
            </a-steps>
          </div>
        </div>
      </preview>
    </div>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.margnTop{
    .ant-spin-container>.ant-row:first-child{
        display: none;
    }
}

</style>

<style lang="less" scoped>
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
}
.goodsFlex{
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: space-around;
    justify-content: space-around;
}
.cardLists{
    margin-top:15px;
}
.cardLists:first-child{
    margin-top:0px;
}
.ColHeightNo{
 overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.aColHeightNo{
  height:22px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.process .ant-row .processCol{
  line-height: 24px
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
.mintHeat {
    width: 100%;
    height: 30px;
    min-width: 800px;
    overflow: hidden;
    padding-bottom: 2px;
    .mintHeatBtn {
      text-align: center;
      line-height: 28px;
      font-size: 12px;
      display: inline-block;
      margin-left: 10px;
      margin-right: 10px;
    }
    .mintHeatBtn:hover {
      cursor:pointer;
      color:#38adff;
      border-bottom: 1px solid #38adff;
    }
    .mintHeatBtnChose{
      color:#38adff;
      border-bottom: 1px solid #38adff;
    }
    .mintHeatBtnRight {
      float: right;
    }
  }
.mintMap {
  width: 100%;
  position: relative;
  .mintMapRight {
    height: 100%;
    background:#fff;
    opacity: 0.8;
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from '@comp/Modal/preview'
import mapMar from './component/map'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'AftersalesMonitoring',
    components: { mapMar, NewTable, SeachBox, BtModal, Preview },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            // 地图
            mapSelasList: [
                { width: 80, numbers: 0, name: '全部', status: '', iconColor: '#bfbfbf' },
                { width: 90, numbers: 0, name: '待分拣', status: 'service_bill_status:1', iconColor: '#707070' },
                { width: 90, numbers: 0, name: '待派工', status: 'service_bill_status:2', iconColor: '#d4237a' },
                { width: 110, numbers: 0, name: '派工待确认', status: 'service_bill_status:3', iconColor: '#d81e06' },
                { width: 110, numbers: 0, name: '服务待确认', status: 'service_bill_status:4', iconColor: '#f4ea2a' },
                { width: 90, numbers: 0, name: '待评价', status: 'service_bill_status:5', iconColor: '#1296db' },
                { width: 100, numbers: 0, name: '服务完成', status: 'service_bill_status:6', iconColor: '#1afa29' }
            ],
            controlMap: false, // 控制地图显示
            lng: '108.93',
            lat: '34.27',
            coordinate: [],
            afterSelasStatus: 'service_bill_status:1',

            mapLogisticsList: [
                { width: 80, numbers: 0, name: '全部', status: '', iconColor: '#bfbfbf' },
                { width: 90, numbers: 0, name: '待分拣', status: 'bill_deliver_status:1', iconColor: '#707070' },
                { width: 90, numbers: 0, name: '待派工', status: 'bill_deliver_status:2', iconColor: '#d4237a' },
                { width: 90, numbers: 0, name: '待确认', status: 'bill_deliver_status:3', iconColor: '#d81e06' },
                { width: 90, numbers: 0, name: '待出库', status: 'bill_deliver_status:4', iconColor: '#f4ea2a' },
                { width: 110, numbers: 0, name: '配送在途', status: 'bill_deliver_status:5', iconColor: '#1296db' },
                { width: 110, numbers: 0, name: '配送完成', status: 'bill_deliver_status:6', iconColor: '#1afa29' }
            ],
            controlLogisticsMap: false, // 控制地图显示
            logisticsStatus: 'bill_deliver_status:6',
            logisticsCoordinate: [],
            isLogisticRE: false,

            count: 1,
            // 搜索
            tabName: 'afterSelas',
            conditionsOne: [
                {
                    key: 'type',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: '0', label: '预约时间' },
                        { value: '1', label: '制单时间' }
                    ]
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                }
            ],
            conditionsTow: [
                {
                    key: 'code',
                    type: 'input',
                    title: '送货单号'
                },
                {
                    key: 'saleDate',
                    type: 'date',
                    title: '开始时间',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    key: 'saleAsDate',
                    type: 'date',
                    title: '结束时间',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                }
            ],
            btns: ['export', 'print'],
            seachValueOne: {
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD'),
                status: 'service_bill_status:1',
                type: '1'
            },
            seachValueTow: {
                saleDate: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
                saleAsDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 'bill_deliver_status:6'
            },
            // 表格赋值
            tableCode: '',
            tableApiPath: '',
            // 单行选中的值
            tableSingleData: {},
            //  表格多选框的值
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOPT: [
                {
                    name: '详情',
                    action: 'AftersalesMonitoring.get',
                    fc: this.detailHandler
                }
            ],
            menuOPTTow: [],
            //  流程
            processModal: false,
            processTitle: '',
            submitLoading: false,
            stepsIndex: 1,
            processDataArr: [{}], // 商品数据
            goodScelect: [], // 商品选中的值
            form: this.$form.createForm(this),
            needService: false,
            indeterminate: false,
            checkAll: false,

            // 详情
            previewVisbel: false,
            previewHeaders: [],
            previewContent: {},
            previewDetailData: {},
            previewDetailArr: [],
            logisticsData: {},

            // 下拉框
            createByDorpArr: []
        }
    },
    computed: {
        heightMap () {
            return this.controlMap ? '0' : (this.$store.getters.windowHeight * 0.35).toString()
        },
        logisticsheightMap () {
            return this.controlLogisticsMap ? '0' : (this.$store.getters.windowHeight * 0.35).toString()
        },
        tableHeight () {
            if (this.tabName === 'afterSelas') {
                return this.controlMap ? this.$store.getters.windowHeight - 275 : this.$store.getters.windowHeight * 0.65 - 275
            } else {
                return this.controlLogisticsMap ? this.$store.getters.windowHeight - 275 : this.$store.getters.windowHeight * 0.65 - 275
            }
        },
        heightLogisticsMap () {
            return this.controlLogisticsMap ? '0' : (this.$store.getters.windowHeight * 0.35).toString()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'a66262e947ec4e13857ce4986858224b:AftersalesMonitoring'
            this.tableApiPath = 'ServiceBillQueryServiceBill'
            if (this.tabName === 'afterSelas') {
                this.$refs.newTable.setContextmenu(this.menuOPT)
            } else {
                this.$refs.newTable.setContextmenu(this.menuOPTTow)
            }
        })
        this.getCreateByDorpArrAll()
        this.coordinate = []
        this.getMapData()
    },
    methods: {
        /**
         * @name: 表格切换
         * @msg:
         * @param {type}
         * @return:
         */
        callback (e) {
            this.tabName = e
            this.seachBoxValue = {}
            if (e === 'afterSelas') {
                this.$refs.newTable.setContextmenu(this.menuOPT)
                this.tableCode = 'a66262e947ec4e13857ce4986858224b:AftersalesMonitoring'
                this.tableApiPath = 'ServiceBillQueryServiceBill'
                this.disContextMenu = []
                this.getMapData()
                console.log(1)
            } else {
                this.$refs.newTable.setContextmenu(this.menuOPTTow)
                this.tableCode = '9bfbda1ac77d4bfb9e24a62eb3c3c560:AftersalesMonitoring'
                this.tableApiPath = 'ServiceBillQueryLogisticsStatistics'
                this.getMapLogisticData()
                this.disContextMenu = ['详情']
                console.log(2)
            }
        },
        /**
         * @name: 获取售后监控地图信息
         * @msg:
         * @param {type}
         * @return:
         */
        getMapData () {
            //  const {div}=this.$math
            axios({
                path: 'ServiceBillQueryStatistics',
                method: 'post',
                body: this.seachValueOne
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('地图', 'res')
                    this.mapSelasList[1].numbers = res.data.sortingNum
                    this.mapSelasList[2].numbers = res.data.dispatchingNum
                    this.mapSelasList[3].numbers = res.data.confirmNum
                    this.mapSelasList[4].numbers = res.data.serviceNum
                    this.mapSelasList[5].numbers = res.data.appraiseNum
                    this.mapSelasList[6].numbers = res.data.finishNum
                    this.mapSelasList[0].numbers = res.data.sum
                    const newData = [...res.data.customer]
                    this.coordinate = newData
                    this.$refs.mapMar.onMarker(this.coordinate)
                }
            })
        },
        getMapLogisticData () {
            const obj = this.seachValueTow
            obj.pageSize = 9999
            obj.pages = 1
            axios({
                path: 'ServiceBillQueryLogisticsStatistics',
                method: 'post',
                body: obj
            }).then(res => {
                if (res.flag === 1) {
                    const numbers1 = res.data.statusDfj
                    const numbers2 = res.data.statusDpg
                    const numbers3 = res.data.statusDqr
                    const numbers4 = res.data.statusDck
                    const numbers5 = res.data.statusPszt
                    const numbers6 = res.data.statusPswc
                    const numbers0 = numbers1 + numbers2 + numbers3 + numbers4 + numbers5 + numbers6
                    this.mapLogisticsList[1].numbers = numbers1
                    this.mapLogisticsList[2].numbers = numbers2
                    this.mapLogisticsList[3].numbers = numbers3
                    this.mapLogisticsList[4].numbers = numbers4
                    this.mapLogisticsList[5].numbers = numbers5
                    this.mapLogisticsList[6].numbers = numbers6
                    this.mapLogisticsList[0].numbers = numbers0
                    const newData = [...res.data.list]
                    newData.forEach(item => {
                        item.name = item.custName
                        item.telephone = item.custPhone
                        item.logisticsStatusName = item.statusName
                        item.address = item.custAddr
                    })
                    this.logisticsCoordinate = [...res.data.list]
                    // const timename = setTimeout(this.$refs.mapMar.onMarker(this.logisticsCoordinate), 30)
                }
            })
        },
        onSeach (e) {
            if (this.tabName === 'afterSelas') {
                if (e.status || e.status === '') {
                    this.afterSelasStatus = e.status
                }
                e.path = 'ServiceBillQueryServiceBill'
                Object.assign(this.seachValueOne, e, { status: this.afterSelasStatus })
                // console.log(this.seachValueOne)
                this.$refs.newTable.setTableData(this.tableCode, this.seachValueOne)
                this.getMapData()
            } else {
                if (e.status || e.status === '') {
                    this.logisticsStatus = e.status
                }
                e.path = 'ServiceBillQueryLogisticsStatistics'
                Object.assign(this.seachValueTow, e, { status: this.logisticsStatus })
                this.$refs.newTable.setTableData(this.tableCode, this.seachValueTow)
                this.getMapLogisticData()
            }
        },
        onReload () {
            if (this.tabName === 'afterSelas') {
                this.seachValueOne = {}
            } else {
                this.seachValueTow = {}
            }
        },
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('ServiceBillQueryServiceBill')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ServiceBillQueryServiceBill' })
            this.getMapData()
        },
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
        },
        /**
         * @name: 获取表格数据的详情
         * @msg:
         * @param {type} ids: ['id']
         * @return:
         */
        getServiceDetail (pamas) {
            this.indeterminate = false
            this.checkAll = false
            const codeList = map(this.tableRowsArr, 'code')
            this.goodScelect = []
            axios({
                path: 'ServiceBillQueryServiceBillDetail',
                method: 'post',
                body: {
                    codeList: codeList,
                    status: pamas
                }
            }).then(res => {
                if (res.flag === 1) {
                    const newData = [...res.data.list]
                    newData.forEach(item => {
                        item.orderInstallDateOne = moment(item.orderInstallTime)
                        item.orderInstallDateTow = moment(item.orderInstallTime)
                        item.orderInstallTimePackOne = moment(item.orderInstallTime)
                        item.orderInstallTimePackTow = moment(item.orderInstallTime)
                        item.joinS = []
                        item.additionalNote = item.operateNote
                        if (item.joinBy) {
                            item.joinBy = item.joinBy.split(',')
                            item.joinName = item.joinName.split(',')
                            item.joinBy.forEach((o, k) => {
                                item.joinName.forEach((i, j) => {
                                    if (k === j) {
                                        item.joinS.push(o + '-' + i)
                                    }
                                })
                            })
                        } else {
                            item.joinBy = []
                            item.joinName = []
                            item.joinS = []
                        }
                        item.joinS = item.joinS.join(',')
                    })
                    this.processDataArr = newData
                }
            })
        },
        /**
         * @name: 分拣
         * @msg:
         * @param {type}
         * @return:
         */
        sortingHandler () {
            this.needService = false
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isSorting = newData.filter(o => o.status !== 'service_bill_status:1')
            if (isSorting.length > 0) {
                this.$message.warning('只有待分拣状态的才能进行此操作')
            } else {
                const obj = this.tableRowsArr[0]
                this.getServiceDetail('service_bill_status:1')
                this.processTitle = '分拣'
                const stepsArr = obj.status.split(':')
                this.stepsIndex = Number(stepsArr[1])
                this.processModal = true
            }
        },
        /**
         * @name: 待派工
         * @msg:
         * @param {type}
         * @return:
         */
        assigningHandler () {
            this.needService = false
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isaAssigning = newData.filter(o => o.status !== 'service_bill_status:2')
            if (isaAssigning.length > 0) {
                this.$message.warning('只有待派工状态的才能进行此操作')
            } else {
                const obj = this.tableRowsArr[0]
                // console.log(obj)
                this.getServiceDetail('service_bill_status:2')

                this.processTitle = '派工'
                const stepsArr = obj.status.split(':')
                this.stepsIndex = Number(stepsArr[1])
                this.processModal = true
            }
        },
        /**
         * @name: 派工待确认
         * @msg:
         * @param {type}
         * @return:
         */
        confirmHandler () {
            this.needService = true
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isConfirm = newData.filter(o => o.status !== 'service_bill_status:3')
            if (isConfirm.length > 0) {
                this.$message.warning('只有派工待确认状态的才能进行此操作')
            } else {
                const obj = this.tableRowsArr[0]
                this.getServiceDetail('service_bill_status:3')
                this.processTitle = '派工确认'
                const stepsArr = obj.status.split(':')
                this.stepsIndex = Number(stepsArr[1])
                this.processModal = true
            }
        },
        /**
         * @name: 服务确认
         * @msg:
         * @param {type}
         * @return:
         */
        afterConfirmHandler () {
            this.needService = false
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isaAfterConfirm = newData.filter(o => o.status !== 'service_bill_status:4')
            if (isaAfterConfirm.length > 0) {
                this.$message.warning('只有服务待确认状态的才能进行此操作')
            } else {
                const obj = this.tableRowsArr[0]
                // console.log(obj)
                this.getServiceDetail('service_bill_status:4')
                this.processTitle = '服务确认'
                const stepsArr = obj.status.split(':')
                this.stepsIndex = Number(stepsArr[1])
                this.processModal = true
            }
        },
        /**
         * @name: 评价
         * @msg:
         * @param {type}
         * @return:
         */
        evaluationHandler () {
            this.needService = false
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isEvaluation = newData.filter(o => o.status !== 'service_bill_status:5')
            if (isEvaluation.length > 0) {
                this.$message.warning('只有待评价状态的才能进行此操作')
            } else {
                const obj = this.tableRowsArr[0]
                // console.log(obj)
                this.getServiceDetail('service_bill_status:5')
                this.processTitle = '评价'
                const stepsArr = obj.status.split(':')
                this.stepsIndex = Number(stepsArr[1])
                this.processModal = true
            }
        },
        /**
         * @name: 作废
         * @msg:
         * @param {type}
         * @return:
         */
        invalidHandler () {
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isInvalid = newData.filter(o => o.status === 'service_bill_status:4' || o.status === 'service_bill_status:5' || o.status === 'service_bill_status:6' || o.status === 'service_bill_status:7')
            if (isInvalid.length > 0) {
                this.$message.warning('只有待分拣状态、待派工状态、派工待确认状态的才能进行此操作')
            } else {
                const _this = this
                const arr = []
                newData.forEach(item => {
                    const obj = {
                        id: item.id,
                        status: 'service_bill_status:7',
                        makeStoreCode: this.$store.getters.storeInfo.code
                    }
                    arr.push(obj)
                })
                this.$confirm({
                    title: '提示',
                    content: '此操作将进行作废，作废后将不可进行修改, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'ServiceBillUpdateServiceBill',
                            method: 'post',
                            body: {
                                voList: arr
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        /**
         * @name: 取消
         * @msg:
         * @param {type}
         * @return:
         */
        cancelHandler () {
            if (this.tableRowsArr.length === 0) {
                this.$message.warning('请选择要进行此操作的列表')
                return
            }
            const newData = [...this.tableRowsArr]
            const isCancel = []
            newData.forEach(item => {
                if (item.status === 'service_bill_status:1') {
                    isCancel.push(item)
                }
                if (item.status === 'service_bill_status:5') {
                    isCancel.push(item)
                }
                if (item.status === 'service_bill_status:6') {
                    isCancel.push(item)
                }
                if (item.status === 'service_bill_status:7') {
                    isCancel.push(item)
                }
                if (item.status === 'service_bill_status:8') {
                    isCancel.push(item)
                }
            })
            if (isCancel.length > 0) {
                this.$message.warning('只有待派工状态、派工待确认状态、服务待确认状态的才能进行此操作')
            } else {
                const _this = this
                const arr = []
                newData.forEach(item => {
                    const obj = {
                        id: item.id,
                        status: 'service_bill_status:0',
                        makeStoreCode: this.$store.getters.storeInfo.code
                    }
                    arr.push(obj)
                })
                this.$confirm({
                    title: '提示',
                    content: '此操作将进行取消，取消后将不可进行修改, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'ServiceBillUpdateServiceBill',
                            method: 'post',
                            body: {
                                voList: arr
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        /**
         * @name:流程提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (this.goodScelect.length === 0) {
                        return this.$message.error('请选择此流程要处理的商品')
                    }
                    const arr = []
                    this.goodScelect.forEach(item => {
                        arr.push(this.processDataArr.filter(o => o.id === item)[0])
                    })
                    if (this.processTitle === '派工') {
                        // console.log('派工')
                        arr.forEach(item => {
                            item.joinBy = values.joinBy
                            item.chargeBy = values.chargeBy
                            item.servicePrice = values.servicePrice
                            item.partsPrice = values.partsPrice
                            item.dispatchNote = values.dispatchNote
                        })
                    }
                    if (this.processTitle === '服务确认') {
                        // console.log('服务确认')
                        const noteArr = arr.filter(o => o.operateNote && o.operateNote.length > 255)
                        if (noteArr.length > 0) {
                            return this.$message.error('输入的备注内容不能大于255字')
                        }
                    }
                    if (this.processTitle === '派工确认') {
                        // console.log('派工确认')
                        const noteArr = arr.filter(o => o.dispatchConfirmNote && o.dispatchConfirmNote.length > 255)
                        if (noteArr.length > 0) {
                            return this.$message.error('输入的备注内容不能大于255字')
                        }
                        arr.forEach(item => {
                            let data = ''
                            if (item.needService === '1') {
                                data = moment(item.orderInstallDateOne).format('YYYY-MM-DD')
                                const time = moment(item.orderInstallTimePackOne).format('HH:mm')
                                item.orderInstallTime = data + ' ' + time
                            } else {
                                data = moment(item.orderInstallDateTow).format('YYYY-MM-DD')
                                const time = moment(item.orderInstallTimePackTow).format('HH:mm')
                                item.orderInstallTime = data + ' ' + time
                            }
                            // const time = moment(item.orderInstallTimePack).format('HH:mm')
                            // item.orderInstallTime = data + ' ' + time
                        })
                    }
                    if (this.processTitle === '评价') {
                        const noteArr = arr.filter(o => o.commentNote && o.commentNote.length > 255)
                        if (noteArr.length > 0) {
                            return this.$message.error('输入的备注内容不能大于255字')
                        }
                    }
                    console.log(arr)

                    arr.forEach(item => {
                        if (item.joinBy && Array.isArray(item.joinBy)) {
                            item.joinBy = item.joinBy.join(',')
                        }
                    })
                    axios({
                        path: 'ServiceBillUpdateServiceBill',
                        method: 'post',
                        body: {
                            voList: arr
                        }
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.processModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 流程全选
         * @msg:
         * @param {type}
         * @return:
         */
        onCheckAllChange (e) {
            Object.assign(this, {
                goodScelect: e.target.checked ? map(this.processDataArr, 'id') : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
        },
        /**
         * @name: 商品信息 多选框
         */
        onChangeCheckbox (checkedValues) {
            this.goodScelect = checkedValues
            this.indeterminate = !!checkedValues.length && (checkedValues.length < this.processDataArr.length)
            this.checkAll = checkedValues.length === this.processDataArr.length
        },
        /**
         * @name: 预约时间的禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateOrder (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        range (start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },
        disabledDateTime (curent) {
            return {
                disabledHours: () => this.range(0, moment(curent).hour() - 1),
                disabledMinutes: () => this.range(0, moment(curent).minute()),
                disabledSeconds: () => []
            }
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        handlecreateByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.applyByDorpArr.length = 0
                this.getApplyByDorpArr(value)
            }, 300)
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        getCreateByDorpArr (value) {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    'type': 'sys_user_type:6',
                    page: 1,
                    rows: 20,
                    name: value
                }
            }).then(res => {
                // console.log('负责人',res)
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.createByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 负责人所有
         * @msg:
         * @param {type}
         * @return:
         */
        getCreateByDorpArrAll () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    'type': 'sys_user_type:6',
                    page: 1
                }
            }).then(res => {
                // console.log('负责人',res)
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.createByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 下拉框过滤修改
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 详情接口
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.previewVisbel = true
            this.previewDetailData = { ...detailData }
            console.log(detailData)
            axios({
                path: 'ServiceBillQueryLogs',
                method: 'post',
                body: {
                    serviceBillCode: detailData.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    // this.previewDetailArr = res.data
                    const newData = [...res.data.serviceBillLogDtos]
                    this.logisticsData = { ...res.data }
                    newData.forEach(item => {
                        if (item.joinBy && item.joinName) {
                            item.joinS = []
                            item.joinBy = item.joinBy.split(',')
                            item.joinName = item.joinName.split(',')
                            item.joinBy.forEach((o, k) => {
                                item.joinName.forEach((i, j) => {
                                    if (k === j) {
                                        item.joinS.push(o + '-' + i)
                                    }
                                })
                            })
                        } else {
                            item.joinBy = []
                            item.joinName = []
                            item.joinS = []
                        }
                        item.joinS = item.joinS.join(',')
                    })
                    console.log(newData)
                    this.previewDetailArr = newData
                    // if(res.data.length)
                }
            })
        }

    },
    watch: {
        '$store.state.app.pageName' (to) {
            if (to === 'AftersalesMonitoring') {
                this.getCreateByDorpArrAll()
            }
        },
        'seachValueOne.startTime' (val) {
            if (val && this.seachValueOne.endTime) {
                if (moment(val).isAfter(this.seachValueOne.endTime)) {
                    this.seachValueOne.endTime = moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValueOne.endTime' (val) {
            if (val && this.seachValueOne.startTime) {
                if (moment(val).isBefore(this.seachValueOne.startTime)) {
                    this.seachValueOne.startTime = moment(val).subtract(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValueTow.saleDate' (val) {
            if (val && this.seachValueTow.saleAsDate) {
                if (moment(val).isAfter(this.seachValueTow.saleAsDate)) {
                    this.seachValueTow.saleAsDate = moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValueTow.saleAsDate' (val) {
            if (val && this.seachValueTow.saleDate) {
                if (moment(val).isBefore(this.seachValueTow.saleDate)) {
                    this.seachValueTow.saleDate = moment(val).subtract(7, 'days').format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>

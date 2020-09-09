<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-22 11:03:57
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-15 14:13:25
 -->
<template>
  <div class="goodsDetail" id="goodsDetail">
    <div class="goods-back">
      <a-button type="primary" @click="back">&lt;	返回</a-button>
      <div class="customer">
        <span @click="showCustomerDrawer" style="cursor: pointer;">当前客户：{{ currentCustomer.name||'' }} - {{ currentCustomer.telephone||'' }}</span>
        <a-button type="primary" @click="addEdit(-1)" class="addcustomer">添加顾客</a-button>
      </div>
    </div>
    <div class="goodshandle">
      <img src="" alt="" >
      <div class="handler">
        <div class="goodmsg">
          <div class="good-title">
            <p>{{ goodsDetail.brandName }} {{ goodsDetail.model }} &nbsp;{{ goodsDetail.name }}</p>
            <h3>{{ initPrice(goodsDetail.unitPrice) }}</h3>
          </div>
          <div class="goods-activity" v-if="JSON.stringify(singleLimit)!=='{}'">
            <div class="activity-detail" :class="{active:detail.activity}" @click="updateActivity">
              <a-button class="activityname" type="danger">限量促销</a-button>
              <div class="activity-msg">
                <span class="activity-value">
                  {{ initPrice(singleLimit.maxPrice) }}
                </span>
                <span class="activity-lable">
                  剩余数：
                </span>
                <span class="activity-value">
                  {{ singleLimit.maxQuantity }}
                  台
                </span>
                <span class="activity-lable">
                  剩余时间：
                </span>
                <span class="time">
                  <span>{{ endTimeH }}</span>:<span>{{ endTimeM }}</span>:<span>{{ endTimeS }}</span>
                </span>
              </div>
            </div>
            <p class="check-activity">
              查看可享受的套购活动>
            </p>
          </div>
          <div class="goods-model">
            <span class="model" style="float:left;">规格型号</span>
            <a-radio-group v-model="detail.model" buttonStyle="solid" @change="changeModel" style="width: 900px;float: left;">
              <a-radio-button :value="model.skuCode" v-for="model in goodsModel" :key="model.skuCode">{{ model.specs }}</a-radio-button>
            </a-radio-group>

          </div>
          <div class="goods-model">
            <span class="model">出库方式 </span>
            <a-select v-model="shoppingTrolley.stockOut" style="width: 120px" @change="outboundChange">
              <a-select-option :value="stockOut.code" v-for="stockOut in goodsStockOut" :key="stockOut.code">{{ stockOut.value }}</a-select-option>
            </a-select>
            <a-checkbox :checked="shoppingTrolley.ifDeposit===1" :value="shoppingTrolley.ifDeposit" @change="priceChange">是否定金销售</a-checkbox>
          </div>
          <div class="goods-model" v-if="isBaseStore">
            <span class="model">{{ shoppingTrolley.pickStoreCode==='shopping_stock_out:3' ? '送货厂家': '提货位置' }}</span>
            <a-select v-model="shoppingTrolley.pickStoreCode" style="width: 120px" @change="pickupChange">
              <a-select-option :value="baseStore.code" v-for="baseStore in goodsBaseStore" :key="baseStore.code">{{ baseStore.name }}</a-select-option>
            </a-select>

          </div>
        </div>
        <div class="goodsprice">
          <div class="price">
            实际收款
            <span>{{ initPrice(detail.actualPrice) }}</span>限价：{{ initPrice(goodsDetail.priceMin) }}
          </div>
          <div class="totle">
            <span>可卖数：{{ goodsDetail.inventory }}</span>
            <a-input-number :min="1" :max="10" v-model="detail.quantity" />
            <a-button type="primary" @click="addShoppingTrolley">加入销售开单(Enter)</a-button>
          </div>
        </div>

      </div>
    </div>
    <div class="fixed-price" v-if="isfixed">
      <div class="price">
        实际收款
        <span>{{ initPrice(detail.actualPrice) }}</span>限价：{{ initPrice(goodsDetail.priceMin) }}
      </div>
      <div class="totle">
        <span>可卖数：{{ goodsDetail.inventory }}</span>
        <a-input-number :min="1" :max="10" v-model="detail.quantity" @change="quantityChange" />
        <a-button type="primary" @click="addShoppingTrolley">加入销售开单(Enter)</a-button>
      </div>
    </div>
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="基本信息" key="1">
        <a-collapse :defaultActiveKey="activeKey">
          <a-collapse-panel header="顾客电子卷" key="1">
            <a-checkbox-group @change="eleRollChange" v-model="detail.eleRoll">
              <a-checkbox value="A" class="aaaa">
                <div class="ele-roll">
                  <div class="rollmsg">
                    <p>51满返电子券</p>
                    <span>有效期：14天后过期</span>
                  </div>
                  <div class="rollpice">
                    ¥20
                  </div>
                </div>
              </a-checkbox>
              <a-checkbox value="B">
                <div class="ele-roll">
                  <div class="rollmsg">
                    <p>51满返电子券</p>
                    <span>有效期：14天后过期</span>
                  </div>
                  <div class="rollpice">
                    ¥20
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
          </a-collapse-panel>
          <a-collapse-panel header="档期活动" key="2">
            <a-radio-group @change="auctionChange" v-model="detail.auction">
              <a-radio :value="schedule.code" v-for="schedule in singleSchedule" :key="schedule.code">
                <div class="auction">
                  <!-- <div class="auction-type">
                    {{ schedule.scheduleType==="schedule_rule_define_schedule_type:1"?"单品满返":schedule.scheduleType==="schedule_rule_define_schedule_type:2"?"单品满减":schedule.scheduleType==="schedule_rule_define_schedule_type:3"?"单品满赠":"" }}
                  </div> -->
                  <div class="auction-type">
                    <div>
                      <p>
                        满
                        <span v-if="schedule.scheduleType==='schedule_rule_define_schedule_type:3'">{{ schedule.reachUnitPrice }}</span>
                        <span v-else>{{ schedule.reachAmount }}</span>

                      </p>
                      <p>
                        {{ schedule.scheduleType==="schedule_rule_define_schedule_type:1"?"返":schedule.scheduleType==="schedule_rule_define_schedule_type:2"?"减":schedule.scheduleType==="schedule_rule_define_schedule_type:3"?"赠":"" }}
                        <!-- <span v-if="schedule.scheduleType==='schedule_rule_define_schedule_type:3'">{{ schedule.skuCode }} - {{ schedule.skuName }}</span>
                      <span v-else> {{ schedule.shouldRateAmount }}</span> -->
                        <span v-if="schedule.scheduleType!=='schedule_rule_define_schedule_type:3'"> {{ schedule.rateAmount }}</span>
                      </p>
                    </div>

                  </div>
                  <div class="auctionmsg">
                    <p>
                      {{ schedule.name }}
                    </p>
                    <p v-if="schedule.scheduleType!=='schedule_rule_define_schedule_type:3'">
                      <!-- 满
                      <span v-if="schedule.scheduleType==='schedule_rule_define_schedule_type:3'">{{ schedule.standardAmount }}</span>
                      <span v-else>{{ schedule.reachAmount }}</span> -->
                      应
                      {{ schedule.scheduleType==="schedule_rule_define_schedule_type:1"?"返":schedule.scheduleType==="schedule_rule_define_schedule_type:2"?"减":schedule.scheduleType==="schedule_rule_define_schedule_type:3"?"赠":"" }}
                      ：{{ schedule.shouldRateAmount.toFixed(2) }}
                      <span v-if="schedule.ifChange==='1'">实返：<a-input placeholder="" v-model="schedule.scheduleAmount" class="schedule-price"/></span>
                      <span v-else>实返：{{ schedule.shouldRateAmount.toFixed(2) }}</span>
                    </p>
                    <p v-else>
                      {{ schedule.skuCode }} - {{ schedule.skuName }}
                    </p>
                    <span>有效期：{{ moment(schedule.startTime).format('YYYY-MM-DD') }}至{{ moment(schedule.endTime).format('YYYY-MM-DD') }}</span>
                  </div>
                </div>
              </a-radio>
            </a-radio-group>
          </a-collapse-panel>
          <a-collapse-panel header="服务卷" key="3" >
            <!-- <a-radio-group @change="serveChange" v-model="value">
              <a-radio :value="1" v-for="severEl in severCoupon" :key="severEl">
                <div class="serve">
                  <div class="auctionmsg">
                    <p>2年延保服务：500.00元</p>
                    <span>有效期：2019-02-28至2019-03-28</span>
                  </div>
                </div>
              </a-radio>
            </a-radio-group>
              -->
            <a-checkbox-group @change="serveChange" v-model="detail.serveChange">
              <a-checkbox :value="severEl.brandCode" v-for="(severEl,index) in severCoupon" :key="severEl.brandCode+index">
                <div class="serve">
                  <div class="auctionmsg">
                    <p>{{ severEl.skuName }}：{{ initPrice(severEl.skuPrice) }}元</p>
                    <span>有效期：{{ moment(severEl.startTime).format('YYYY-MM-DD') }}至{{ moment(severEl.endTime).format('YYYY-MM-DD') }}</span>
                  </div>
                </div>
              </a-checkbox>

            </a-checkbox-group>
          </a-collapse-panel>
          <a-collapse-panel header="捆绑商品" key="4" >
            <a-checkbox-group :value="detail.bindingGoods" @change="goodsChange">
              <a-checkbox :value="goods.skuCode" v-for="goods in bindingGoods.bindGoods" :key="goods.skuCode">
                <div class="goods">
                  <img v-if="goods.pic" :src="goods.pic" @error.once="moveErrorImg($event)" :alt="goods.skuName" class="goods-img">
                  <img v-else src="@assets/goods.png" :alt="goods.skuName" class="goods-img">
                  <div class="goods-msg">
                    <p>
                      {{ goods.skuCode }} - {{ goods.skuName }}
                    </p>
                    <span>
                      {{ initPrice(goods.price) }}
                    </span>
                    <span class="totle">
                      x {{ goods.quantity }}
                    </span>
                  </div>
                </div>
              </a-checkbox>

            </a-checkbox-group>
          </a-collapse-panel>
        </a-collapse>
        <a-collapse class="stroeroll" :defaultActiveKey="activeKey">
          <a-collapse-panel header="店长优惠卷" key="5">
            <div class="store">
              <div>
                <p>A账户可用额度：{{ initPrice(shoppingTrolley.aAmount) }}</p>
                <div class="limit">
                  <span>A账户实用额度：</span>
                  <!-- <a-input placeholder=""/> -->
                  <a-input-number
                    v-model="shoppingTrolley.aUseAmount"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}.00`"
                    :parser="value => value.replace('.00', '')"
                  />
                </div>
              </div>
              <div>
                <p>B账户可用额度：{{ initPrice(shoppingTrolley.bAmount) }}</p>
                <p>当笔提成:{{ initPrice(shoppingTrolley.bPushAmount) }}</p>
                <div class="limit">
                  <span>A账户实用额度：</span>
                  <!-- <a-input placeholder=""/> -->
                  <a-input-number
                    v-model="shoppingTrolley.bUseAmount"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}.00`"
                    :parser="value => value.replace('.00', '')"
                  />
                </div>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel header="厂家/商场卷" key="6">
            <div class="store">
              <div>
                <p>厂家可用额：{{ initPrice(shoppingTrolley.manufacturerCouponAmount||0) }}</p>
                <div class="limit">
                  <span>实用额度：</span>
                  <!-- <a-input placeholder=""/> -->
                  <a-input-number
                    v-model="shoppingTrolley.marketCouponUseAmount"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}.00`"
                    :parser="value => value.replace('.00', '')"
                  />
                </div>
              </div>
              <div>
                <p>商场可用额：{{ initPrice(shoppingTrolley.marketCouponAmount||0) }}</p>
                <div class="limit">
                  <span>实用额度：</span>
                  <!-- <a-input placeholder=""/> -->
                  <a-input-number
                    v-model="shoppingTrolley.marketCouponUseAmount"
                    :min="0"
                    :max="100"
                    :formatter="value => `${value}.00`"
                    :parser="value => value.replace('.00', '')"
                  />
                </div>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <a-collapse :defaultActiveKey="activeKey">
          <a-collapse-panel header="配送地址" key="7">
            <div class="address">

              <div class="addres-time">
                <a-checkbox :checked="shoppingTrolley.ifInstall===1" :value="shoppingTrolley.ifInstall" @change="installChange">需要安装请勾选</a-checkbox>
                <p>
                  <span>
                    配送时间
                  </span>
                  <a-date-picker
                    showTime
                    :disabledDate="disabledDate"
                    :disabledTime="disabledDateTime"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="请选择时间"
                    :allowClear="false"
                    @change="onTimeChange"
                  />
                </p>
              </div>
            </div>
            <p style="font-weight:700;margin-bottom:10px;position:relative">
              收货人信息
              <a href="#" class="addAddress" @click="addEditAddress(-1)">新增收货地址</a>
            </p>
            <p class="customer-address" v-for="(item, index) in userAddress" :key="index" @click="chooseAddress(index,item.id)">
              <span :class="[addressLeft, isAddressActive===index?'default':'']">{{ item.name }}</span>
              <span>{{ item.address }}</span>
              <span class="address-right" v-if="item.isDefault">默认地址</span>
              <span class="address-opts">
                <a href="#" @click.stop="addEditAddress(0, item)">编辑</a>
                <a href="#" @click.stop="deleteAddress(item.id)">删除</a>
              </span>
            </p>
            <!-- <div class="address">
              <div class="addres-time">
                <a-checkbox @change="onChange">需要安装请勾选</a-checkbox>
                <p>
                  <span>
                    配送时间
                  </span>
                  <a-date-picker
                    showTime
                    :disabledDate="disabledDate"
                    :disabledTime="disabledDateTime"
                    format="YYYY-MM-DD HH:mm"
                    placeholder="请选择时间"
                    :allowClear="false"
                  />
                </p>
                <span>
                  选择收货地址
                </span>
              </div>
              <p>
                <span>
                  顾客姓名：张三
                </span>
                <span>
                  顾客电话：13259497983
                </span>
                <span>
                  顾客地址：陕西省西安市雁塔区丈八东村蓝海大厦11086
                </span>
              </p>
            </div> -->
          </a-collapse-panel>
        </a-collapse>
      </a-tab-pane>
      <a-tab-pane tab="图文详情" key="2">Content of Tab Pane 2</a-tab-pane>
    </a-tabs>
    <!-- 新增/编辑用户信息 -->
    <a-modal
      :title="addEditTitle"
      v-model="addEditModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      :z-index="99"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
          确定
        </a-button>
      </template>
      <!-- 顾客信息表单 -->
      <a-form :form="userForm">
        <a-row class="doc">
          <a-col :span="4">电话:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone', {initialValue:addEditUser.telephone || '', validateTrigger:'blur'}, queryCustomer)" :disabled="addEditUser.type === 1"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name', {initialValue:addEditUser.name || ''})" :disabled="disableEdit"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">性别:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.sex', {initialValue:addEditUser.sex || 0})" :disabled="disableEdit" >
                <a-radio :value="0">
                  男
                </a-radio>
                <a-radio :value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入详细地址" v-decorator="$check('customer.address', {initialValue:addEditUser.address || ''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、楼牌号等" v-decorator="$check('customer.addressDetail', {initialValue:addEditUser.addressDetail || ''})" :disabled="disableEdit"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragCustomerMap" :mapWidth="'100%'" :mapHeight="'300px'" :zoom="13"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 新增/编辑收货地址 -->
    <a-modal
      :title="addEditAddressTitle"
      v-model="addEditAddressModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="addressCancel">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="addressSubmit">
          确定
        </a-button>
      </template>
      <!-- 顾客信息表单 -->
      <a-form :form="addressForm">
        <a-row class="doc">
          <a-col :span="4">电话:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customerAddress.telephone', {initialValue:customerAddressInfo.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customerAddress.name', {initialValue:customerAddressInfo.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('customerAddress.address', {initialValue:customerAddressInfo.address || ''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、门牌号等" v-decorator="$check('customerAddress.addressDetail', {initialValue:customerAddressInfo.addressDetail || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">默认收货地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customerAddress.isDefault', {initialValue:customerAddressInfo.isDefault || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragAddressMap" :mapWidth="'100%'" :mapHeight="'400px'" :lat="customerAddressInfo.latitude" :lng="customerAddressInfo.longitude"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 顾客表抽屉 -->
    <a-drawer
      width="520"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
      <ul class="user-list">
        <li @click="passUserInfo({})">
          <div class="user-info">普通顾客</div>
          <div class="user-cart"></div>
          <div class="user-edit" @click.stop="addEdit(-1)"><a-icon type="plus-circle" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
        </li>
        <li v-for="(item,index) in customerList" :key="index" @click="passUserInfo(item)">
          <div class="user-info">{{ item.name }}<span v-if="item.telephone">:{{ item.telephone }}</span></div>
          <div class="user-cart" @click.stop="showChildrenDrawer(1, item)"><a-icon type="shopping-cart" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
          <div class="user-edit" @click.stop="addEdit(0, item)"><a-icon type="edit" style="font-size:16px;color:rgb(56,173,255)"/></div>
        </li>
      </ul>
      <!-- 顾客待结算商品抽屉 -->
      <a-drawer
        :title="subUserNameTel"
        width="420"
        :closable="false"
        :z-index="9999"
        @close="onChildrenDrawerClose"
        :visible="childrenDrawer"
      >
        <a-checkbox-group v-model="settleGoods" @change="onChange">
          <a-row class="pro" v-for="(item,index) in userCart" :key="index">
            <a-col :span="3" class="fbox"><a-checkbox :value="item"></a-checkbox></a-col>
            <a-col :span="6"><img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70"></a-col>
            <a-col :span="15" class="pro-info">
              <p class="pro-title">{{ item.skuName }}</p>
              <p class="pro-pc">
                <span class="price">¥{{ item.skuActualPrice }}</span>
                <span class="count">x{{ item.skuQuantity }}</span>
              </p>
              <p>{{ item.code }}</p>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <div v-show="userCart.length === 0" style="margin-top:-24px">暂无待结算商品</div>
        <div
          :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }"
        >
          <span style="float:left;padding-left:10px;">
            <a-checkbox
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
              :disabled="userCart.length===0"
            >
              全选
            </a-checkbox>
            <span>{{ initPrice(settlePrice) }}</span>
          </span>
          <a-button @click="toSettle" type="primary" :disabled="userCart.length === 0">
            结算
          </a-button>
        </div>
      </a-drawer>
    </a-drawer>

  </div>
</template>
<script>
import moment from 'moment'
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import userPhoto from '@assets/goods.png'
import Amap from '@comp/Amap'
export default {
    name: 'GoodsDetail',
    props: {
        goodsData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        currentCustomer: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    components: {
        Amap
    },
    data () {
        return {
            // 商品信息
            goodsDetail: {},
            // 商品规格
            goodsModel: [],
            // 商品出库方式
            goodsStockOut: [],
            // 集中配送时才有提货位置
            goodsBaseStore: [],
            // 集中配送时才有提货位置
            goodsProvider: [],
            // 捆绑商品
            bindingGoods: {},
            // 店长优惠卷
            coupons: {},
            // 单品
            singleSchedule: [],
            // 限价数据
            singleLimit: {},
            // 电子币
            customerCoupon: [],
            // 服务卷
            severCoupon: [],
            // 查询厂家卷
            coupon: {},
            // 活动倒计时
            endTimeH: '00',
            endTimeM: '00',
            endTimeS: '00',
            endTime: null,
            // 提交商品信息
            detail: {
                activity: false,
                // 价格
                price: '',
                // 规格
                model: '',
                // 实际价格
                actualPrice: '',
                // 数量
                quantity: 1,
                // 选择的捆绑商品
                bindingGoods: [],
                // 选择的电子券
                eleRoll: [],
                // 档期活动选择
                auction: '',
                // 服务卷选择
                serveChange: []

            },
            // 提交的商品主单信息
            shoppingTrolley: {
                storeCode: '', // 登录店
                guideCode: '', // 登录账号
                guideName: '', // 登录 姓名
                customerCode: '', // 顾客编码
                customerAddressId: '', //   地址iD
                consigneeName: '', // 收货人姓名
                consigneeTelephone: '', // 电话
                consigneeAddress: '', // 地址
                consigneeAddressDetail: '', //  详细地址
                consigneeLongitude: '', // 精度
                consigneeLatitude: '', // 维度
                ifDeposit: 0, // 是否定金销售  0 否  1是
                stockOut: '', // 出库方式
                pickStoreCode: '', //   提货位置
                marketCouponAmount: '', // 商场卷可用额
                marketCouponUseAmount: '', // 实用额
                manufactorCouponAmount: '', // 厂家卷可用额
                manufactorCouponUseAmount: '', // 实用额
                ifInstall: 0, //  是否安装  0 否  1是
                sendTime: '', // 配送时间
                aAmount: '', // a 可用额
                aUseAmount: '', // a 实用额
                bAmount: '', // b可用额
                bPushAmount: '', // B当笔提成
                bUseAmount: '', // B 实用额
                note: '', // 备注
                limitCode: '' // 限价限量
            },
            // 提交的 商品 信息
            shoppingTrolleySkuList: [],
            // 档期规则
            shoppingScheduleRuleList: [],
            //  '送货厂家: '/'提货位置：'  是否显示
            isBaseStore: false,
            activeKey: ['1', '2', '3', '4', '5', '6', '7'],
            customerCode: '',
            value: '',
            isfixed: false,
            // 地址
            isAddressActive: -1,
            customerAddressId: '',
            customerAddressInfo: {},
            addressLeft: 'address-left',
            // 顾客默认地址
            userAddress: [],
            // 新增/编辑顾客地址标题
            addEditAddressTitle: '',
            // 新增/编辑顾客地址标识
            addEditAddressModal: false,
            // 新增/编辑顾客信息标题
            addEditTitle: '',
            // 新增/编辑顾客信息标识
            addEditModal: false,
            loading: false,
            // 顾客表单
            userForm: this.$form.createForm(this),
            addressForm: this.$form.createForm(this),

            addEditUser: {},
            addedCustomerId: '',
            // 添加顾客标识
            isAdd: false,
            // 修改客户抽屉
            visible: false,
            subUserNameTel: '',
            addressInfo: {},
            settleGoods: [],

            userCart: [],
            settlePrice: 0,
            indeterminate: true,
            checkAll: false,
            childrenDrawer: false,
            cartDrawer: false,
            disableEdit: true,
            customerList: []
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    async mounted () {
        console.log(this.currentCustomer)
        await this.getSkuDetail()
        await this.getGoodsDetail()
        await this.getGoodsModel()
        await this.getGoodsStockOut()
        await this.getCoupons()
        await this.getBindingGoods()
        await this.getSingleSchedule()
        await this.getSingleLimit()
        await this.getCustomerAddress()
        await this.getCustomerCoupon()
        await this.getSeverCoupon()
        window.addEventListener('scroll', this.handleScroll, true) // 监听（绑定）滚轮滚动事件
    },
    beforeDestroy () {
        console.log('ssssss')
        console.log(this.endTime)

        clearInterval(this.endTime)
        window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
        // this.endTime = null
    },
    watch: {
        'shoppingTrolley.stockOut': function (newData, oldData) {
            console.log(newData)
            // 现场提货
            if (newData === 'shopping_stock_out:1') {
                this.isBaseStore = false
            // 集中配送
            } else if (newData === 'shopping_stock_out:2') {
                this.getBaseStore()
                this.isBaseStore = true
            // 厂家送货
            } else if (newData === 'shopping_stock_out:3') {
                this.getProvider()
                this.isBaseStore = true
            }
        },
        'detail.actualPrice': function (newData, oldData) {
            console.log(newData)
            this.getCoupons()
            this.shoppingTrolleySkuList[0].actualPrice = newData
        },
        'detail.price': function (newData, oldData) {
            console.log(newData)
            // this.getCoupons()
            this.detail.actualPrice = this.detail.price * this.detail.quantity
            this.shoppingTrolleySkuList[0].actualPrice = this.detail.actualPrice
        },
        'detail.quantity': function (newData, oldData) {
            console.log(newData)
            // this.getCoupons()
            this.detail.actualPrice = this.detail.price * this.detail.quantity
            this.shoppingTrolleySkuList[0].quantity = newData
            this.shoppingTrolleySkuList[0].actualPrice = this.detail.actualPrice
        }
    },
    methods: {
        moment,

        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        // 返回列表页
        back () {
            this.$emit('activeComponent', 0)
        },
        handleScroll: function () {
            // console.log(document.getElementsByClassName('desktop')[0].scrollTop)
            // console.log(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop

            // 滚动条到底部的条件
            // console.log(scrollObj, scrollTop, scrollHeight)

            if (scrollTop >= 444) {
                this.isfixed = true
                // div 到头部的距离 + 屏幕高度 = 可滚动的总高度
            } else {
                this.isfixed = false
            }
        },
        // 选择 优惠活动
        updateActivity () {
            this.detail.activity = !this.detail.activity
            this.shoppingTrolley.limitCode = this.detail.activity ? this.singleLimit.defineCode : ''
        },
        // 选择商品规格
        changeModel (event) {
            console.log(event.target.value)
        },
        // 选择出库方式
        outboundChange (value) {
            console.log(`selected ${value}`)
        },
        // 选择提货方式
        pickupChange (value) {
            console.log(`selected ${value}`)
        },
        // 是否定金销售
        priceChange (e) {
            console.log(e)
            console.log(`checked = ${e.target.checked}`)
            this.shoppingTrolley.ifDeposit = e.target.checked ? 1 : 0
            console.log(this.shoppingTrolley.ifDeposit)
        },
        // 是否安装
        installChange (e) {
            console.log(e)
            console.log(`checked = ${e.target.checked}`)
            this.shoppingTrolley.ifInstall = e.target.checked ? 1 : 0
            console.log(this.shoppingTrolley.ifInstall)
        },
        // 选择配送时间
        onTimeChange (date, dateString) {
            console.log(date, dateString)
            this.shoppingTrolley.sendTime = date._d
        },
        // 修改商品数量
        quantityChange (e) {
            console.log(`checked = ${e.target.checked}`)
        },
        callback (key) {
            console.log(key)
        },
        // 选择电子券
        eleRollChange (e) {
            console.log(e)

            // console.log('radio checked', e.target.value)
        },
        // 档期活动选择
        auctionChange (e) {
            console.log('radio checked', e.target.value)
        },
        // 服务卷选择
        serveChange (e) {
            console.log(e)

            // console.log('radio checked', e.target.value)
        },
        // 选择捆绑商品
        goodsChange (e) {
            console.log(e)
            console.log(e.length, this.bindingGoods.bindNum)

            if (e.length <= this.bindingGoods.bindNum || this.bindingGoods.bindNum === 0) {
                this.detail.bindingGoods = e
                this.detail.actualPrice = this.bindingGoods.mainSkuPrice
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `当前捆绑商品只能选择选择${this.bindingGoods.bindNum}个`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
            // console.log('radio checked', e.target.value)
        },
        // 配送时间选择限制 start
        range (start, end) {
            const result = []
            for (let i = start; i < end; i++) {
                result.push(i)
            }
            return result
        },
        disabledDate (current) {
            return moment(current).isBefore(moment().startOf('day'))
        },
        disabledDateTime () {
            return {
                disabledHours: () => this.range(0, 24).splice(0, moment().hours()),
                disabledMinutes: () => this.range(0, moment().minutes()),
                disabledSeconds: () => [0, 59]
            }
        },
        // 配送时间选择限制 end
        /**
         * @name:价格格式化
         * @msg:
         * @param {type}
         * @return:
         */
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        // 获取商品信息
        async getSkuDetail () {
            // shoppingTrolleyDetailsQueryShoppingTrolleySkuDetails
            // shopping/trolleyDetails/queryShoppingTrolleySkuContract
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuDetails',
                method: 'post',
                body: {
                    code: this.$props.goodsData.skuCode
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
            }
        },
        // 获取商品信息
        async getGoodsDetail () {
            // shoppingTrolleyDetailsQueryShoppingTrolleySkuContract
            // dist/originData/findSkuPropertyBySkuCode
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuContract',
                method: 'post',
                body: {
                    code: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code

                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsDetail = res.data
                this.shoppingTrolleySkuList.push(res.data)
                this.detail.actualPrice = this.goodsDetail.unitPrice
                this.detail.price = this.goodsDetail.unitPrice
            }
        },
        // 获取商品规格
        async getGoodsModel () {
            // shoppingTrolleyDetailsQueryShoppingTrolleySkuContract
            // distOriginDataFindSkuPropertyBySkuCode
            const res = await axios({
                path: 'DistOriginDataFindSkuPropertyBySkuCode',
                method: 'post',
                body: {
                    code: this.$props.goodsData.skuCode
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsModel = res.data
                res.data.forEach(el => {
                    if (el.current) {
                        this.detail.model = el.skuCode
                    }
                })
            }
        },
        // 获取提货方式
        async getGoodsStockOut () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryStockOut',
                method: 'post',
                body: {
                    code: this.storeInfo.code,
                    isInventory: this.goodsDetail.ifStock
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                res.data.forEach(el => {
                    el.code = el.type + ':' + el.configKey
                })
                console.log('sssssssssss', this.goodsStockOut)
                this.goodsStockOut = res.data
                this.shoppingTrolley.stockOut = this.goodsStockOut[0].code
            }
        },
        // 集中配送时才有提货位置
        async getBaseStore () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryBaseStore',
                method: 'post',
                body: {
                    code: this.storeInfo.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsBaseStore = res.data
                this.shoppingTrolley.pickStoreCode = this.goodsBaseStore[0].code
            }
        },
        // 厂家送货时才有提货位置
        async getProvider () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryProviderBySku',
                method: 'post',
                body: {
                    code: this.$props.goodsData.skuCode
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsBaseStore = res.data
                this.shoppingTrolley.pickStoreCode = this.goodsBaseStore[0].code
            }
        },
        // 捆绑商品
        async getBindingGoods () {
            const res = await axios({
                path: 'GroupDefineQueryBindingGoods',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.bindingGoods = res.data
                if (this.bindingGoods.bindGoods) {
                    this.bindingGoods.bindGoods.forEach(el => {
                        const pic = el.skuUrl ? el.skuUrl.split(',') : ['']
                        // console.log(pic)
                        el.pic = pic[0]
                    })
                }
            }
        },
        // 查询店长优惠券
        async getCoupons () {
            const res = await axios({
                path: 'CouponsUseGetCoupons',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code,
                    classCode: this.goodsDetail.classCode,
                    brandCode: this.goodsDetail.brandCode,
                    salesAmount: this.detail.actualPrice,
                    saleNum: this.detail.quantity
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.coupons = res.data
                this.shoppingTrolley.aAmount = res.data.acanUse
                this.shoppingTrolley.aUseAmount = 0
                this.shoppingTrolley.bAmount = res.data.bcanUse
                this.shoppingTrolley.bPushAmount = res.data.bBushMoney
                this.shoppingTrolley.bUseAmount = 0
            }
        },
        // 单品接口
        async getSingleSchedule () {
            const res = await axios({
                path: 'ScheduRuleGetSingleSchedule',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code,
                    classCode: this.goodsDetail.classCode,
                    brandCode: this.goodsDetail.brandCode,
                    // salesAmount: this.detail.actualPrice,
                    salesAmount: '3000',
                    saleNum: this.detail.quantity
                }
            })
            if (res.flag === 1 && res.data) {
                console.log(res.data)
                const data = JSON.parse(JSON.stringify(res.data))
                res.data.forEach((el, index) => {
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:3') {
                        if (Array.isArray(el.gifts)) {
                            el.gifts.forEach(item => {
                                item.standardAmount = el.standardAmount
                                item.reachUnitPrice = el.reachUnitPrice
                                item.scheduleType = el.scheduleType
                                item.name = el.name
                                item.code = el.code + ':' + item.skuCode
                            })
                            data.push(...el.gifts)
                            data.splice(index, 1)
                        }
                    } else {
                        data[index].scheduleAmount = el.shouldRateAmount
                    }
                })
                console.log(data)

                this.singleSchedule = data
            }
        },
        // 查询限价限量
        async getSingleLimit () {
            const res = await axios({
                path: 'ScheduleLimitQuerySingleLimit',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code,
                    lowestPrice: '2000'
                    // lowestPrice: this.goodsDetail.priceMin,
                }
            })
            if (res.flag === 1 && res.data) {
                this.singleLimit = res.data

                this.shoppingTrolley.marketCouponAmount = res.data.marketCouponAmount // 商场卷可用额
                this.shoppingTrolley.marketCouponUseAmount = 0// 实用额
                this.shoppingTrolley.manufactorCouponAmount = res.data.manufactorCouponAmount // 厂家卷可用额
                this.shoppingTrolley.manufactorCouponUseAmount = 0 // 实用额
                console.log(this.singleLimit)

                if (res.data && res.data.endTime) {
                    this.updatTime()
                }
            } else {
                this.singleLimit = {}
                await this.getCoupon()
            }
        },
        // 查询厂家卷
        async getCoupon () {
            const res = await axios({
                path: 'CouponQueryCouponBySku',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code,
                    brandCode: this.goodsDetail.brandCode,
                    actualPrice: this.detail.actualPrice,
                    quantity: this.detail.quantity

                }
            })

            if (res.flag === 1) {
                this.coupon = res.data
                console.log(this.coupon)
            }
        },
        // 查询服务卷 schedule/service/queryServiceCouponBySkuInfo
        async getSeverCoupon () {
            const res = await axios({
                path: 'ScheduleServiceQueryServiceCouponBySkuInfo',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    brandCode: this.goodsDetail.brandCode,
                    storeCode: this.storeInfo.code,
                    // unitPrice: this.goodsDetail.unitPrice,
                    'unitPrice': 5000
                }
            })

            if (res.flag === 1) {
                console.log(res.data)
                this.severCoupon = res.data
            }
        },
        // 新增开单
        async addShoppingTrolley () {
            var bindingGoods = []
            var auction = {}
            var auctionGoods = []
            // var eleRoll = []
            // var serveChange = []
            if (this.detail.bindingGoods.length > 0) {
                const goods = this.bindingGoods.bindGoods.filter(el => {
                    return this.detail.bindingGoods.includes(el.skuCode)
                })
                console.log(goods)

                bindingGoods = goods.map(el => {
                    return {
                        unitPrice: el.price, // 零售价
                        actualPrice: el.price, // 实际售价 （自加）
                        quantity: el.quantity,
                        code: el.skuCode, // 商品编码
                        name: el.skuName, //
                        model: el.skuModel, // 规格型号
                        picture: el.skuUrl
                    }
                })
                console.log(bindingGoods)
            }
            if (this.detail.auction) {
                const actions = this.singleSchedule.filter(el => {
                    return el.code === this.detail.auction
                })[0]
                console.log(actions)

                auction = {
                    scheduleRuleCode: actions.code, // 规则单号
                    scheduleRuleName: actions.anem, // 名称
                    scheduleType: actions.scheduleType, // 类型
                    makeStoreCode: this.storeInfo.code, // 当前登录店
                    scheduleAmount: actions.shouldRateAmount, // 实际金额
                    customerCouponCode: '', // 电子券code  （仅电子券）
                    rateProvider: actions.rateProvider, // 供应商分摊比例
                    rateProviderAmount: actions.scheduleType === 'schedule_rule_define_schedule_type:3' ? actions.rateAmount : '' //  金额(赠品才有)
                }
                if (actions.scheduleType === 'schedule_rule_define_schedule_type:3') {
                    auctionGoods = [
                        {
                            unitPrice: auction.price, // 零售价
                            actualPrice: auction.price, // 实际售价 （自加）
                            quantity: auction.skuQuantity,
                            code: auction.skuCode, // 商品编码
                            name: auction.skuName, //
                            model: auction.skuModel || '', // 规格型号
                            picture: auction.skuUrl || ''
                        }
                    ]
                }
            }
            // console.log()
            const shoppingTrolley = this.shoppingTrolley
            shoppingTrolley.storeCode = this.storeInfo.code// 登录店
            shoppingTrolley.guideCode = this.userInfo.code // 登录账号
            shoppingTrolley.guideName = this.userInfo.name// 登录 姓名
            console.log(bindingGoods)
            console.log(auction)
            console.log(this.shoppingTrolley)

            // const res = await axios({
            //     path: 'ShoppingTrolleyAddShoppingTrolley',
            //     method: 'post',
            //     body: {
            //         skuCode: this.$props.goodsData.skuCode,
            //         storeCode: this.storeInfo.code,
            //         brandCode: this.goodsDetail.brandCode,
            //         actualPrice: this.detail.actualPrice
            //     }
            // })

            // if (res.flag === 1) {
            //     // this.coupon = res.data
            //     console.log(res.data)
            // }
        },
        // 计算时间
        updatTime () {
            let timeNum = moment(this.singleLimit.endTime).valueOf() - moment(new Date()).valueOf()
            timeNum = parseInt(timeNum / 1000)
            // console.log(timeNum)

            this.endTime = setInterval(() => {
                timeNum = timeNum - 1
                // 时间转换
                if (timeNum > 0) {
                    this.filters(timeNum)
                } else {
                    clearInterval(this.endTime)
                }
                // this.statusTime = timeNum
                // this.statusTime=this.formatSeconds(timeNum)
            }, 1000)
        },
        // 秒数转换时分秒
        filters (value) {
            if (value === null || value === '' || value === 0 || typeof value === 'undefined') {
                this.endTimeH = '00'
                this.endTimeM = '00'
                this.endTimeS = '00'
                clearInterval(this.endTime)
                return
            }
            // var secondTime = parseInt(value) // 秒
            var secondTime = value // 秒
            // console.log(secondTime)

            var minuteTime = 0 // 分
            var hourTime = 0 // 小时

            if (secondTime > 60) {
                // 如果秒数大于60，将秒数转换成整数
                // 获取分钟，除以60取整数，得到整数分钟
                minuteTime = parseInt(secondTime / 60)

                // 获取秒数，秒数取佘，得到整数秒数
                secondTime = parseInt(secondTime % 60)

                // 如果分钟大于60，将分钟转换成小时
                if (minuteTime > 60) {
                    // 获取小时，获取分钟除以60，得到整数小时
                    hourTime = parseInt(minuteTime / 60)
                    // 获取小时后取佘的分，获取分钟除以60取佘的分
                    minuteTime = parseInt(minuteTime % 60)
                }
            }
            if (minuteTime < 10) {
                minuteTime = '0' + minuteTime
            }
            if (hourTime < 10) {
                hourTime = '0' + hourTime
            }
            if (secondTime < 10) {
                secondTime = '0' + secondTime
            }
            // var result = hourTime + ':' + minuteTime + ':' + secondTime
            // console.log(result)

            this.endTimeH = hourTime
            this.endTimeM = minuteTime
            this.endTimeS = secondTime
            // return result
        },
        // 查询电子卷 schedule/coupon/queryCustomerCouponBySkuInfo
        async getCustomerCoupon () {
            const res = await axios({
                path: 'ScheduleCouponQueryCustomerCouponBySkuInfo',
                method: 'post',
                body: {
                    skuCode: this.$props.goodsData.skuCode,
                    storeCode: this.storeInfo.code,
                    brandCode: this.goodsDetail.brandCode,
                    quantity: this.detail.quantity,
                    unitPrice: this.goodsDetail.unitPrice,
                    customerCode: this.currentCustomer.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
            }
        },
        /**
         * @name:查询顾客地址
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerAddress (id) {
            if (this.currentCustomer.id !== '' || id) {
                axios({
                    path: 'CustomerManageQueryUserAddress',
                    method: 'POST',
                    body: {
                        id: this.currentCustomer.id || id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.userAddress = [...res.data]
                        console.log('顾客默认地址:', res.data)
                    }
                })
            } else {
                this.userAddress = []
            }
        },
        /**
         * @name:新增/编辑地址关闭
         * @msg:
         * @param {type}
         * @return:
         */
        addEditAddress (index, addressInfo) {
            if (index === -1) {
                this.isAdd = true
                this.customerAddressInfo = {}
                this.addEditAddressTitle = '新增收货地址'
            } else {
                this.isAdd = false
                console.log('选中的顾客地址信息：', addressInfo)
                this.customerAddressInfo = addressInfo
                this.customerAddressId = addressInfo.id
                this.addEditAddressTitle = '编辑收货地址'
            }
            this.addEditAddressModal = true
        },
        /**
         * @name: 删除地址
         * @msg:
         * @param {type}
         * @return:
         */
        deleteAddress (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'CustomerManageDeleteCustomerAddress',
                        method: 'post',
                        body: {
                            id: id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('删除顾客地址成功')
                            self.getCustomerAddress()
                        }
                    })
                }
            })
        },
        /**
         * @name:新增/编辑地址关闭
         * @msg:
         * @param {type}
         * @return:
         */
        addressCancel () {
            this.addEditAddressModal = false
        },
        /**
         * @name:新增/编辑地址提交
         * @msg:
         * @param {type}
         * @return:
         */
        addressSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { addressForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.customerAddressId
                    }
                    this.loading = true
                    values.customerId = this.currentCustomer.id
                    values.latitude = this.addressInfo.lat
                    values.longitude = this.addressInfo.lng
                    values.province = this.addressInfo.province
                    values.city = this.addressInfo.city
                    values.area = this.addressInfo.area
                    console.log('提交的新增地址信息：', values)
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAddress' : 'CustomerManageUpdateCustomerAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditAddressModal = false
                            this.passUserInfo(res.data)
                            this.getCustomerAddress()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:新增/编辑模态框关闭
         * @msg:
         * @param {type}
         * @return:
         */
        subCancel () {
            this.addEditModal = false
            this.disableEdit = true
        },
        /**
         * @name:选中顾客信息
         * @msg:
         * @param {type}
         * @return:
         */
        passUserInfo (customerInfo) {
            if (JSON.stringify(customerInfo) !== '{}') {
                this.customerInfo = customerInfo
                this.userNameTel = customerInfo.telephone ? `${customerInfo.name}:${customerInfo.telephone}` : customerInfo.name
            } else {
                this.customerInfo = {}
                this.userNameTel = '普通顾客'
            }
            this.$emit('updateCustomer', this.customerInfo)
            this.onClose()
        },
        /**
         * @name: 根据手机号查询顾客信息
         * @msg:
         * @param {type}
         * @return:
         */
        async queryCustomer (rule, value, callback) {
            const self = this
            if (value) {
                const res = await axios({
                    path: 'CustomerManageQueryInfo',
                    method: 'post',
                    body: {
                        telephone: value
                    }
                })
                if (res.flag === 1) {
                    if (res.data.length > 0) {
                        console.log('====================')
                        this.disableEdit = true
                        const data = res.data[0]
                        data.customerName = data.name
                        data.customerTelephone = data.telephone
                        self.userForm.setFieldsValue({ 'telephone': data.telephone, 'name': data.name, 'sex': data.sex, 'address': data.address, 'addressDetail': data.addressDetail })
                        this.getCustomerAddress(data.id)
                        if (this.isAdd) {
                            this.passUserInfo(data)
                            this.addEditModal = false
                        }
                    } else {
                        self.userForm.setFieldsValue({ 'name': '', 'sex': '', 'address': '', 'addressDetail': '' })
                        this.disableEdit = false
                    }
                }
            }
            callback()
        },
        /**
         * @name:新增/编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            const self = this
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.latitude = this.customerInfo.lat || this.addEditUser.latitude
                    values.longitude = this.customerInfo.lng || this.addEditUser.latitude
                    values.province = this.customerInfo.province
                    values.city = this.customerInfo.city
                    values.area = this.customerInfo.area
                    if (this.isAdd === false) {
                        values.id = this.addEditUser.id
                        values.type = this.addEditUser.type
                    } else {
                        const customerAddress = [{}]
                        customerAddress[0] = { ...values }
                        customerAddress[0].isDefault = 1
                        values.customerAddress = [ ...customerAddress ]
                    }

                    this.userNameTel = `${values.name}:${values.telephone}`
                    console.log('添加顾客地址税票信息：', values)
                    axios({
                        path: self.isAdd ? 'CustomerManageAddCustomerAndAddress' : 'CustomerManageUpdateCustomer',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('添加顾客成功：', res.data)
                            // 添加税票信息时使用
                            this.addEditModal = false
                            this.getUsers()
                            if (res.data) {
                                this.passUserInfo(res.data)
                            }
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /** 添加顾客地图拖动监听
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        dragCustomerMap (data) {
            this.customerInfo.address = data.address
            this.userForm.setFieldsValue({
                address: this.customerInfo.address
            })
            this.customerInfo.lat = data.position.lat
            this.customerInfo.lng = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
            console.log('用户地址信息：', this.customerInfo)
        },
        /**
         * @name: 新增/编辑地址地图拖动监听
         * @msg:
         * @param {type}
         * @return:
         */
        dragAddressMap (data) {
            console.log('新增地址拖动：', data)
            this.addressInfo.address = data.address
            this.addressForm.setFieldsValue({
                address: this.addressInfo.address
            })
            this.addressInfo.lat = data.position.lat
            this.addressInfo.lng = data.position.lng
            this.addressInfo.province = data.addressComponent.province
            this.addressInfo.city = data.addressComponent.city
            this.addressInfo.area = data.addressComponent.district
            console.log('用户地址信息：', this.addressInfo)
        },
        showCustomerDrawer () {
            this.getCustomerList()
            this.visible = true
        },
        // 查询待结算顾客列表
        async getCustomerList () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryUnsettledCustomerList',
                method: 'POST',
                body: {
                    guideCode: this.$store.getters.userInfo.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                this.customerList = res.data
            }
        },
        onCheckAllChange (e) {
            Object.assign(this, {
                settleGoods: e.target.checked ? this.userCart : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
            this.calcuSettlePrice()
        },
        calcuSettlePrice () {
            this.settlePrice = 0
            this.settleGoods.forEach(item => {
                this.settlePrice += item.actualPay
            })
        },
        onChange (checkedList) {
            this.indeterminate = !!checkedList.length && (checkedList.length < this.userCart.length)
            this.checkAll = checkedList.length === this.userCart.length
            this.calcuSettlePrice()
        },
        onChildrenDrawerClose () {
            this.childrenDrawer = false
            this.cartDrawer = false
            this.settlePrice = 0
            this.settleGoods = []
        },
        toSettle () {
        },
        onClose () {
            this.visible = false
        },
        addEdit (flag, customerInfo) {
            if (flag === -1) {
                this.isAdd = true
                this.addEditTitle = '添加顾客信息'
                this.addEditUser = {}
            } else {
                this.isAdd = false
                this.addEditTitle = '编辑顾客信息'
                this.addEditUser = { ...customerInfo }
            }
            this.addEditModal = true
        }

    }
}
</script>

<style lang="less" scoped>
.goodsDetail{
    height: 100%;
    background-color: #ffffff;
    padding: 0 30px 30px;
    .goods-back{
        height: 54px;
        width: 100%;
        padding: 12px 0;

        .customer{
            float: right;
            .addcustomer{
                margin-left: 16px;
            }
        }
    }
    .goodshandle{
        overflow: hidden;
        >img{
            width: 350px;
            height: 320px;
            border:1px solid #E1E1E1;
            float: left;
        }
        .handler{
            width: calc(100% - 350px);
            float: left;
            .goodmsg{
                margin-left: 26px;
                border-bottom:1px solid #E1E1E1;
                padding-bottom: 20px;
            }
            .good-title{
                color: #333333;
                *{
                    margin: 0;
                    // padding: 0;
                }
                >p{
                    font-size: 18px;
                    // display: inline-block;
                }
                >h3{
                    font-size: 30px;
                    font-weight: normal;
                    // display: inline-block;
                }
                .addcustomer{
                    float: right;
                }
            }
            .goods-activity{
                overflow: hidden;
                .activity-msg{
                    float: left;
                    height: 100%;
                    line-height: 34px;
                    padding-left: 20px;
                }
                .activity-detail{
                    width:520px;
                    height:38px;
                    border:1px solid #F4F4F4;
                    // line-height: 38px;
                    float: left;
                    cursor: pointer;
                    .activityname{
                        width:101px;
                        height:36px;
                        background:#F4F4F4;
                        border: none;
                        color: #666666;
                        float: left;

                    }
                    .activity-value{
                        font-size:19px;
                        font-weight:bold;
                        color:#333333;
                        float: left;
                        line-height: 34px;
                        height: 100%;

                    }
                    .activity-lable{
                        font-size:13px;
                        font-weight:bold;
                        color:#666666;
                        float: left;
                        line-height: 34px;
                        height: 100%;
                        margin-left: 18px;

                    }
                    .time{
                        >span{
                            width:25px;
                            height:26px;
                            background:#BEBEBE;
                            border-radius:6px;
                            color: #ffffff;
                            display: inline-block;
                            text-align: center;
                            line-height: 26px;

                        }
                    }
                }
                .activity-detail.active{
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(255, 0, 0, 1);
                    .activityname{
                        background:rgba(255,0,0,1);
                        border: none;
                        color: #ffffff;
                    }
                    .activity-value{
                        color:rgba(255,0,0,1);
                    }
                    .activity-lable{
                        color:rgba(51,51,51,1);

                    }
                    .time{
                        >span{
                            background:rgba(255,0,0,1);
                        }
                    }
                }
                .check-activity{
                    float: right;
                    width:150px;
                    height:14px;
                    font-size:14px;
                    font-weight:400;
                    color:rgba(57,173,255,1);
                    line-height:14px;
                    cursor: pointer;
                }
            }
            .goods-model{
                clear: both;
                margin-top: 14px;
                >span{
                    margin-right: 16px;
                }
                .ant-radio-button-wrapper{
                    border-radius: 0;
                    margin-right: 12px;
                    height: 30px;
                    margin-bottom: 14px;
                }
                /deep/.ant-select-selection.ant-select-selection--single{
                    border-radius: 0;
                    height:30px;
                }
                .ant-checkbox-wrapper{
                    float: right;
                }
            }
            .goodsprice{
                margin-left: 26px;
                overflow: hidden;
                margin-top: 14px;
                color: #999999;
                line-height: 46px;
                .price{
                    float: left;
                    line-height: 46px;
                    // *{
                    //     float: left;
                    // }
                    >span{
                        display: inline-block;
                        margin-right: 12px;
                        margin-left: 12px;
                        width:140px;
                        height:30px;
                        line-height: 30px;
                        text-align: center;
                        border:1px solid rgba(225, 225, 225, 1);
                        font-size:18px;
                        font-weight:400;
                        color:rgba(57,173,255,1);
                    }
                }
                .totle{
                    float: right;
                    *{
                        float: left;
                    }
                    .ant-input-number{
                        height: 46px;
                        margin-left: 12px;
                        border-radius: 0;
                        /deep/ .ant-input-number-input-wrap{
                            height: 46px;
                        }
                        /deep/ .ant-input-number-input{
                            height: 46px;
                        }
                    }
                    .ant-btn {
                        height: 46px;
                        margin-left: 12px;
                    }
                }
            }

        }
    }
    .fixed-price{
        clear: both;
        overflow: hidden;
        color: #999999;
        position: fixed;
        top: 0;
        width: calc(100% - 316px);
        background-color: #F4F4F4;
        z-index: 99;
        padding-left: 14px;
        .price{
            float: left;
            line-height: 46px;
            // *{
            //     float: left;
            // }
            >span{
                display: inline-block;
                margin-right: 12px;
                margin-left: 12px;
                width:140px;
                height:30px;
                line-height: 30px;
                text-align: center;
                border:1px solid rgba(225, 225, 225, 1);
                font-size:18px;
                font-weight:400;
                color:rgba(57,173,255,1);
            }
        }
        .totle{
            float: right;
            line-height: 46px;
            *{
                float: left;
            }
            .ant-input-number{
                height: 46px;
                margin-left: 12px;
                border-radius: 0;
                /deep/ .ant-input-number-input-wrap{
                    height: 46px;
                }
                /deep/ .ant-input-number-input{
                    height: 46px;
                }
            }
            .ant-btn {
                height: 46px;
                margin-left: 12px;
            }
        }
    }
    /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header{
        color: #666666;
        padding-left: 16px;
        border-radius: 0;
    }
    /deep/ .ant-collapse > .ant-collapse-item > .ant-collapse-header .arrow{
        right: 16px;
        left: inherit;
    }
    .ant-collapse > .ant-collapse-item{
        border: 1px solid #d9d9d9;
        border-radius: 0;
        margin-top: 20px;
        /deep/ .ant-checkbox{
            display: none;
        }
        .ant-checkbox-wrapper{
            /deep/ .ant-checkbox + span{
                display: block;
            }
        }
        .ant-checkbox-wrapper + .ant-checkbox-wrapper{
            margin-left: 0;
        }
        // 电子卷
        .ele-roll{
            overflow: hidden;
            width: 310px;
            font-size: 14px;
            .rollmsg{
                float: left;
                width:238px;
                height:70px;
                border:1px dashed #999999;
                padding: 14px;
                >p{
                    margin: 0;
                    color: #333333;
                    font-size: 14px;
                }
                >span{
                    color: #666666;
                    font-size: 12px;
                }
            }
            .rollpice{
                float: left;
                width:72px;
                height:70px;
                border:1px dashed #999999;
                border-left: none;
                text-align: center;
                line-height: 70px;
                color: #666666;

            }
        }
        .ant-checkbox-wrapper-checked .ele-roll{
            background-color: #39ADFF;
            .rollmsg{
                border:1px dashed #ffffff;

                >p{
                    margin: 0;
                    color: #ffffff;
                    font-size: 14px;
                }
                >span{
                    color: #ffffff;
                    font-size: 12px;
                }
            }
            .rollpice{
                border:1px dashed #ffffff;
                color: #ffffff;

            }
        }
        // 服务卷
        .serve{
            border:1px dashed #999999;
            width:340px;
            height:70px;
            padding: 14px;
            .auctionmsg{
                float: left;
                // border-left:1px dashed #999999;
                // height: 70px;
                >p{
                    margin: 0;
                    color: #333333;
                    width: 222px;
                    font-size: 12px;
                    white-space: initial;
                    word-wrap: break-word;
                }
                >span{
                    color: #666666;
                    font-size: 12px;
                }
            }
        }
        .ant-checkbox-wrapper-checked  .serve{
            background-color: #39ADFF;
            border:1px dashed #ffffff;
            .auctionmsg{
                float: left;
                // border-left:1px dashed #999999;
                // height: 70px;
                >p{

                    color: #ffffff;
                }
                >span{
                    color: #ffffff;
                }
            }
        }
        // 档期活动
        /deep/ .ant-radio{
            display: none;
        }
        .ant-radio-wrapper{
            /deep/ span.ant-radio + *{
                display: block;
            }
        }

        .auction{
            border:1px dashed #999999;
            width:340px;
            height:98px;
            padding: 14px;
            .auction-type{
                width:50px;
                height:70px;
                float: left;
                text-align: center;
                font-size: 12px;
                margin-right: 14px;
                >div{
                    height: 70px;
                    display: table-cell;
                    vertical-align: middle;
                    color: #333333;
                }
                p{
                    text-align: center;
                    margin: 0;
                    width: 50px;
                }
            }
            .auctionmsg{
                float: left;
                border-left:1px dashed #999999;
                height: 70px;
                padding-left: 14px;
                display: table-cell;
                vertical-align: middle;
                    // color: #333333;
                >p{
                    margin: 0;
                    color: #333333;
                    width: 222px;
                    font-size: 12px;
                    white-space: initial;
                    word-wrap: break-word;
                    >span{
                        display: inline-block;
                        margin-left: 20px;
                    }
                }
                >span{
                    color: #666666;
                    font-size: 12px;
                }
                .schedule-price{
                    height: 30px;
                    border-radius: 0;
                    width: 80px;
                    display: inline-block;
                    line-height: 30px;
                }
            }
        }
        .ant-radio-wrapper-checked{

            .auction{
                background-color: #39ADFF;
                border:1px dashed #ffffff;
                .auction-type{
                    color: #ffffff;
                    >div{
                        color: #ffffff;
                    }
                }
                .auctionmsg{
                    float: left;
                    border-left:1px dashed #ffffff;

                    >p{
                        color: #ffffff;
                    }
                    >span{
                        color: #ffffff;
                    }
                    .schedule-price{
                        background-color: #39adff;
                        border-color: white;
                        color: white;
                    }
                }
            }
        }
        // 捆绑商品
        .goods{
            overflow: hidden;
            width: 330px;
            font-size: 14px;
            padding: 14px;
            border:1px solid rgba(220,220,220,1);
            height: 74px;
            .goods-msg{
                float: left;
                width:230px;
                // height:70px;
                >p{
                    margin: 0;
                    color: #333333;
                    font-size: 12px;
                }
                >span{
                    color: #39ADFF;
                    font-size: 12px;
                }
                .totle{
                    float: right;
                    font-size: 12px;
                    color: #333333;
                }
            }
            .goods-img{
                float: left;
                width:56px;
                height:46px;
                line-height: 70px;
                margin-right: 14px;
            }
        }
        .ant-checkbox-wrapper-checked .goods{
            border:1px solid #39ADFF;
            background-color: #39ADFF;
            .goods-msg{
                float: left;
                width:230px;
                // height:70px;
                >p{
                    margin: 0;
                    color: #ffffff;
                    font-size: 12px;
                }
                >span{
                    color: #ffffff;
                    font-size: 12px;
                }
                .totle{
                    float: right;
                    font-size: 12px;
                    color: #ffffff;
                }
            }
        }
        // 店长优惠卷
        .store{
            .ant-input-number{
                border-radius: 0;
            }
            >div{
                overflow: hidden;
                >p{
                    float: left;
                    height: 30px;
                    line-height: 30px;
                    margin: 0;
                    margin-right: 14px;
                }
                .limit{
                    float: right;
                    .ant-input-number{
                        width:115px;

                    }
                }
            }
            >div:first-child{
                margin-bottom: 14px;
            }
        }
        .address{
            /deep/ .ant-checkbox{
                display: inline-block;
            }
            .ant-checkbox-wrapper{
                /deep/ .ant-checkbox + span{
                    display: inline-block;
                }
            }
            .addres-time{
                >p{
                    display: inline-block;
                    margin-left: 50px;

                }
                >span{
                    float: right;
                    color: #39ADFF;
                    cursor: pointer;
                }
            }
            >p{
                color: #666666;
                font-size: 14px;
                margin: 0;
                span{
                    margin-right: 30px;
                }
            }
        }
        .addAddress{
            position: absolute;
            right:10px;
            text-decoration: none;
            color: rgb(56,173,255);
            font-weight: 400;
            font-size:12px;
            }
        // 顾客地址
        .customer-address {
            font-size: 12px;
            position:relative;
            height: 32px;
            line-height: 32px;
            .address-left {
                display: inline-block;
                width: 90px;
                border:1px dotted #eee;
                margin-right: 10px;
                text-align: center
            }
            .address-right {
                padding: 0 2px;
                background: #aaa;
                color: #fff;
                margin-left:10px;
            }
            .default {
                background: rgb(56,173,255);
                color: #fff;
            }
            .address-opts {
                position: absolute;
                right:10px;
                a {
                    text-decoration: none;
                    margin-left: 10px;
                    color: rgb(56,173,255);
                }
            }
        }
        // 选中活动激活样式
        .active{
            border:1px solid rgb(56,173,255);
            color: rgb(56,173,255);
        }
    }
    .ant-collapse > .ant-collapse-item:first-child{
        margin-top: 0;
    }
    .ant-collapse{
        border-radius: 0;
        border:none;
    }
    .stroeroll{
        overflow: hidden;
        margin-bottom: 20px;

    }
    .stroeroll.ant-collapse > .ant-collapse-item:first-child{
        margin-top: 20px;
        margin-right: 20px;
    }
    .stroeroll.ant-collapse > .ant-collapse-item{
        width: calc(50% - 10px);
        float: left;
    }

}
.ant-drawer-body {
    padding: 0;
    .user-list {
      padding: 0;
      list-style: none;
      li {
        cursor: pointer;
        display:flex;
        padding-left: 20px;
        height: 39px;
        line-height:39px;
        border-bottom:1px solid #ccc;
        .user-info {
          flex: 3;
          display: inline-block;
        }
        .user-cart {
          flex: 1;
          display: inline-block;
          text-align: center;
          color: rgb(56,173,255);
        }
        .user-edit {
          flex: 1;
          display: inline-block;
          text-align: center
        }
      }
  }
}
.ant-checkbox-group {
  width: 100%;
  .pro{
    height:100px;
    .fbox {
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    img {
      height: 70px;
      width:70px;
      margin-top: 15px;
    }
    .pro-info {
      display:flex;
      flex-direction: column;
      justify-content:space-between;
      padding: 15px 0 15px 10px;
      .pro-title {
        font-weight: 700;
        padding-right: 15px;
      }
      p {
        height: 20px;
        line-height:20px;
      }
      .pro-pc{
        display: flex;
        justify-content: space-between;
        padding-right: 15px;
        .price {
          color: rgb(56,173,255);
        }
        .count {
          font-size: 12px;
          color: #aaa;
        }
      }
    }
  }
}
.ant-form-item-label{
    color: #909399;
}
</style>

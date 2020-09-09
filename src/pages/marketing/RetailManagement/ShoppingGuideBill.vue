<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: haile
 * @Date: 2019-03-06 16:11:56
 * @LastEditTime: 2019-08-15 15:36:06
 -->
<template>
  <fullscreen
    ref="fullscreen"
    class="fullscreenClass"
    style="background-color:#fff;"
    @change="fullscreenChange">
    <div style="margin:10px">
      <a-row>
        <p style="margin-top:4px;margin-left:10px;font-size:16px;font-weight:700">导购员：{{ $store.getters.userInfo.name }} {{ $store.getters.userInfo.code }}</p>
      </a-row>
      <!-- 工具栏 -->
      <a-row class="seach-box">
        <a-col :xs="2">
          <a-button style="margin-top:4px;margin-left:10px;" shape="circle" :icon="fullscreen?'fullscreen-exit':'fullscreen'" @click="fullClick"/>
        </a-col>
        <a-col :xs="22" :md="10" :lg="12">
          <a-input-search
            placeholder="请输入商品名称或编码"
            size="large"
            @search="onSearch"
            enterButton
          />
        </a-col>
        <a-col :xs="24" :md="12" :lg="10">
          <div class="user" @click="showDrawer">{{ userNameTel }}</div>
          <a-button type="primary" style="margin-left:5px;" size="large" icon="shopping-cart" @click="showChildrenDrawer(0,customerInfo)">待结算</a-button>
          <a-button type="primary" style="margin-left:5px;" size="large" icon="plus" @click="addEdit(-1)">添加</a-button>
        </a-col>
      </a-row>
      <!-- 商品列表瀑布流 -->
      <div>
        <vue-waterfall-easy
          :height="height"
          :imgsArr="goodsList"
          :maxCols="6"
          :loadingTimeOut="500"
          ref="vueWaterfall"
          @click="checkGoods"
          @scrollReachBottom="getData" >
          <div class="img-info" slot-scope="props">
            <a-row>
              <div class="price">{{ initPrice(props.value.unitPrice) }}</div>
            </a-row>
            <a-row>
              <div class="title">{{ props.value.skuName }}</div>
            </a-row>
            <a-row>
              <div class="info">{{ `商品编码：${props.value.skuCode}` }}</div>
            </a-row>
            <a-row>
              <div class="info" v-if="props.value.counts">{{ `已销： ${props.value.counts}` }}</div>
            </a-row>
          </div>
        </vue-waterfall-easy>
      </div>
      <!-- 右侧边栏 -->
      <a-drawer
        width="420"
        :closable="false"
        @close="onClose"
        :z-index="66"
        :visible="visible"
      >
        <ul class="user-list">
          <li @click="passUserInfo()">
            <div class="user-info">普通顾客</div>
            <div class="user-cart"></div>
            <div class="user-edit" @click.stop="addEdit(-1)"><a-icon type="plus-circle" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
          </li>
          <li v-for="(item,index) in users" :key="index" @click="passUserInfo(item)">
            <div class="user-info">{{ item.name }}<span v-if="item.telephone">:{{ item.telephone }}</span></div>
            <div class="user-cart" @click.stop="showChildrenDrawer(1,item)"><a-icon type="shopping-cart" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
            <div class="user-edit" @click.stop="addEdit(0,item)"><a-icon type="edit" style="font-size:16px;color:rgb(56,173,255)"/></div>
          </li>
        </ul>
        <a-drawer
          :title="subUserNameTel"
          width="320"
          :closable="false"
          :zIndex="66"
          @close="onChildrenDrawerClose"
          :visible="childrenDrawer"
        >
          <a-checkbox-group v-model="settleGoods">
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
          <div v-show="flag" style="margin-top:-24px">暂无待结算商品</div>
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
            <a-button @click="toSettle" type="primary">
              结算
            </a-button>
          </div>
        </a-drawer>
      </a-drawer>
      <!-- 顾客商品列表 -->
      <a-drawer
        :title="subUserNameTel"
        width="320"
        :closable="false"
        @close="onChildrenDrawerClose"
        :zIndex="67"
        :visible="cartDrawer"
      >
        <a-checkbox-group v-model="settleGoods">
          <a-row class="pro" v-for="(item,index) in userCart" :key="index">
            <a-col :span="3" class="fbox"><a-checkbox :value="item"></a-checkbox></a-col>
            <a-col :span="6"><img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70"></a-col>
            <a-col :span="15" class="pro-info">
              <p class="pro-title">{{ item.skuName }}</p>
              <p class="pro-pc">
                <span class="price">¥{{ item.skuActualPrice }}</span>
                <span class="count">x{{ item.skuQuantity }}</span>
              </p>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <div v-show="flag" style="margin-top:-24px">暂无待结算商品</div>
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
          <a-button @click="toSettle" type="primary">
            结算
          </a-button>
        </div>
      </a-drawer>
      <!-- 商品详情 -->
      <a-drawer
        title="商品详情"
        placement="bottom"
        :height="height+100"
        @close="onGoodsInfoClose"
        :visible="goodsInfoVisible"
        :closable="false"
        :getContainer="container"
        destroyOnClose>
        <div :style="`height:${height}px;overflow:auto;`">
          <div class="goods-box">
            <img class="goods-box-img" :src="goodsInfo.src" alt="">
            <!-- <img class="goods-box-img" v-if="goodsInfo.src[0]" :src="goodsInfo.src[0]" @error.once="moveErrorImg($event)">
            <img v-else src="@assets/goods.png"> -->
            <a-card class="goods-box-info-box">
              <a-row class="title">{{ `${goodsInfo.name } ${goodsInfo.model} ${goodsInfo.code}` }}</a-row>
              <a-row class="price">{{ initPrice(goodsInfo.unitPrice) }}</a-row>
              <a-row class="property">
                <div style="line-height:40px;font-weight:bold;width:70px">规格型号：</div>
                <div class="right">
                  <span class="btn-style" :class="{defaultStyle:s.current, propertyActive:isActiveProperty===index}" v-for="(s,index) in baseSkuProperties" :key="index" @click="selectProperty(s,index)">{{ s.specs }}</span>
                </div>
              </a-row>
              <a-row class="info store-info">
                <span>出库方式：</span>
                <a-select v-model="defaultStockOut" @change="stockOutChangeHandler" style="min-width:120px;">
                  <a-select-option v-for="item in stockOut" :key="`${item.type}:${item.configKey}`" :value="`${item.type}:${item.configKey}`">{{ item.value }}</a-select-option>
                </a-select>
                <span style="margin-left:20px;" v-if="showbaseStore">{{ defaultStockOut==='shopping_stock_out:3' ? '送货厂家: ': '提货位置：' }}</span>
                <a-select style="min-width:220px;" v-model="pickStoreCode" :options="baseStore" @change="baseStoreChangeHandler" v-if="showbaseStore">
                </a-select>
              </a-row>
              <a-divider dashed />
              <a-row class="btn-box">
                <div class="left-box">
                  <span class="mark-title">实际售价：</span>
                  <a-input-number v-model="actualPrice" @blur="value=>actualPriceChangeHandler(value,goodsInfo.priceMin)"/>
                  <span style="margin-left:10px;">限价：{{ Number(goodsInfo.priceMin).toFixed(2) }}</span>
                </div>
                <div class="right-box">
                  <span style="font-weight:bold;margin-right:20px;" v-if="isShowInventory">可卖数：{{ goodsInfo.inventory }}</span>
                  <a-input-number style="margin-right:10px;" :min="1" v-model="quantity" @change="value=>quantityChangeHandler(value,goodsInfo.inventory)"/>
                  <a-button type="primary" @click="addSalesBill" :disabled="disableAddSalesBill">加入销售开单</a-button>
                </div>
              </a-row>
            </a-card>
          </div>
          <a-collapse v-model="collapseActiveKey">
            <a-collapse-panel header="捆绑商品" key="1" class="bind-goods">
              <a-checkbox-group @change="bindChange" v-model="bindArr">
                <a-card v-for="(item,index) in group.bindGoods" :key="index">
                  <div class="bind-box">
                    <div class="check-box">
                      <a-checkbox :value="item.skuCode"></a-checkbox>
                    </div>
                    <div class="goods-box">
                      <div class="img-box">
                        <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
                      </div>
                      <div class="goods-info">
                        <p>{{ item.skuCode }}</p>
                        <p>{{ item.skuName }}</p>
                        <p>{{ initPrice(item.priceDisc) }}</p>
                      </div>
                      <div class="goods-quantity">
                        x{{ item.quantity }}
                      </div>
                    </div>
                  </div>
                </a-card>
              </a-checkbox-group>
            </a-collapse-panel>
            <a-collapse-panel key="2">
              <template slot="header">
                营销活动
                <a-icon style="margin-left:10px;" type="question-circle-o" />
              </template>
              <a-card
                class="card-style"
                v-for="(item, index) in singleSchedule"
                :key="index"
                :class="item.selected?'active':''"
                @click.stop="chooseActivity(item)">
                <div class="activity-box">
                  <span :class="[spanStyle, item.selected?'span-active':'']">
                    {{ item.activityName }}
                  </span>
                  <div class="activity-desc">
                    {{ item.desc }}
                  </div>
                  <div class="amount">
                    <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'">应减：{{ item.shouldRateAmount }}</div>
                    <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:2'" @click.stop.prevent>
                      实减：
                      <a-input-number
                        :min="1"
                        :max="item.maxAmount"
                        v-model="actualSub"
                        :disabled="item.isChange === '0'"
                        @change="value=>activityChangeHandler(0,value,item.maxAmount)"/>
                    </div>
                    <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'">应返：{{ item.shouldRateAmount }}</div>
                    <div v-if="item.scheduleType==='schedule_rule_define_schedule_type:1'" @click.stop.prevent>
                      实返：
                      <a-input-number
                        :min="1"
                        :max="item.maxAmount"
                        v-model="actualReturn"
                        :disabled="item.isChange === '0'"
                        @change="value=>activityChangeHandler(1,value,item.maxAmount)"/>
                    </div>
                  </div>
                </div>
                <div class="gift" v-if="item.gifts" >
                  <a-checkbox-group @change="giftChange(item)" v-model="giftsArr" :disabled="disableChooseGift">
                    <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
                      <div @click.stop>
                        <a-checkbox :value="gift.skuCode"></a-checkbox>
                      </div>
                      <div class="gift-img">
                        <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
                      </div>
                      <div class="gift-info">
                        <a-row>
                          <p>{{ gift.skuName }}</p>
                          <p>{{ initPrice(gift.skuPrice) }}</p>
                          <p>x{{ gift.skuNum }}</p>
                        </a-row>
                      </div>
                    </div>
                  </a-checkbox-group>
                </div>
              </a-card>
            </a-collapse-panel>
            <a-collapse-panel key="3">
              <template slot="header">
                <span>您还可以参加以下优惠活动，具体操作在结算界面</span>
                <a-icon style="margin-left:10px;" type="question-circle-o" />
              </template>
              <a-card style="margin-top:-1px;" v-for="(item,index) in arbitrageSchedule" :key="index">
                <div class="activity-box">
                  <span :class="spanStyle">
                    {{ item.activityName }}
                  </span>
                  <div class="activity-desc">
                    {{ item.desc }}
                  </div>
                  <div class="amount">
                  </div>
                </div>
                <div class="gift" v-if="item.gifts">
                  <div class="gift-box" v-for="(gift,i) in item.gifts" :key="i">
                    <div class="gift-img">
                      <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70">
                    </div>
                    <div class="gift-info">
                      <p>{{ gift.skuName }}</p>
                      <p>{{ initPrice(gift.skuPrice) }}</p>
                      <p>x{{ gift.skuNum }}</p>
                    </div>
                  </div>
                </div>
              </a-card>
              <!-- <OtherSchedule :goodsInfo="goodsInfo" :actualPrice="actualPrice" :quantity="quantity"/> -->
            </a-collapse-panel>
            <a-collapse-panel header="店长优惠券" key="4">
              <a-col :span="12">
                <a-col :span="24" class="mark-conter" style="font-weight:bold;padding-left:20px;">A账户可用额度：{{ initPrice(coupons.acanUse) }}</a-col>
                <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">B账户可用额度：{{ initPrice(coupons.bcanUse) }}</a-col>
                <a-col :span="12" class="mark-conter" style="font-weight:bold;padding-left:20px;">当笔提成：{{ initPrice(coupons.bBushMoney) }}</a-col>
              </a-col>
              <a-col :span="12">
                <a-col :span="8" class="mark-title">A账户实用额：</a-col>
                <a-col :span="16" class="mark-conter">
                  <a-input-number
                    :min="0"
                    :max="coupons.acanUse"
                    size="small"
                    v-model="aUseAmount"
                    @change="aChangeHandler"/>
                </a-col>
                <a-col :span="8" class="mark-title">B账户实用额：</a-col>
                <a-col :span="16" class="mark-conter">
                  <a-input-number
                    :min="0"
                    :max="coupons.bcanUse"
                    size="small"
                    v-model="bUseAmount"
                    @change="bChangeHandler"/>
                </a-col>
              </a-col>
              <!-- <Coupons :goodsInfo="goodsInfo" :actualPrice="actualPrice" :quantity="quantity"/> -->
            </a-collapse-panel>
            <a-collapse-panel header="配送地址" key="5">
              <div style="margin-bottom:10px;">
                <a-checkbox @change="installChange" :checked="isInstall==='1'?true:false">需要安装请勾选</a-checkbox>
                <div style="display:inline-block;margin-left:20px;">
                  <span style="margin-right:10px">配送时间:</span>
                  <a-date-picker
                    placeholder="请选择配送时间"
                    format="YYYY-MM-DD HH:mm"
                    :disabledDate="disabledDate"
                    v-model="sendTime"
                    :showTime="{ format: 'YYYY-MM-DD HH:mm' }"/>
                </div>
              </div>
              <a-card>
                <p style="font-weight:700;margin-bottom:10px;position:relative">
                  收货人信息
                  <a href="#" class="addAddress" @click="openQueryCustomerModal">选择收货地址</a>
                </p>
                <p class="customer-address" v-if="JSON.stringify(customerAddress)!=='{}'">
                  <span class="address-left">{{ customerAddress.name }}</span>
                  <span>{{ customerAddress.address }}{{ customerAddress.addressDetail }}</span>
                  <span class="address-right" v-if="customerAddress.isDefault">默认地址</span>
                </p>
                <SelectCustomers
                  :openFlag="0"
                  :customerId="customerId"
                  :userInfo="customerInfo"
                  :queryCustomerModal.sync="queryCustomerModal"
                  @closeCustomerModal="queryCustomerModal=false"
                  @setAddress="setAddress"
                  @passUserInfo="passUserInfo"></SelectCustomers>
              </a-card>
              <div style="margin-top:10px">
                <a-textarea placeholder="请输入备注" :autosize="true" v-model="note"/>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </a-drawer>
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
      <!-- 结算 -->
      <a-drawer
        title="结算"
        placement="bottom"
        :height="height+100"
        @close="onSettlementClose"
        :visible="settlementVisible"
        :closable="false"
        :zIndex="99"
        :wrapClassName="'wrap-class'"
        :wrapStyle="wrapStyle"
        destroyOnClose>
        <Settle
          :settleCustomer="settleCustomer"
          :settleGoods="settleGoods"
          :height="height"
          :settleFromFlag="settleFromFlag"
          @setWrapStyle="setWrapStyle"
          @refresh="refreshCart">
        </Settle>
      </a-drawer>
    </div>
  </fullscreen>
</template>
<script>
import vueWaterfallEasy from 'vue-waterfall-easy'
import SelectCustomers from './components/SelectCustomers'
import { axios } from '@/utils/request'
import Amap from '@comp/Amap'
import SettleOld from './components/SettleOld'
import SingleSchedule from './components/SingleSchedule'
import BindGoods from './components/BindGoods'
import OtherSchedule from './components/OtherSchedule'
import Coupons from './components/Coupons'
import moment from 'moment'
import userPhoto from '@assets/goods.png'
export default {
    name: 'ShoppingGuideBilling',
    components: {
        vueWaterfallEasy,
        SettleOld,
        Amap,
        SelectCustomers,
        SingleSchedule,
        BindGoods,
        OtherSchedule,
        Coupons
    },
    data: function () {
        return {
            wrapStyle: {},
            // 搜索
            dataSource: [],
            // 右侧一级边栏标识
            visible: false,
            // 右侧二级边栏标识
            childrenDrawer: false,
            cartDrawer: false,
            fullscreen: false,
            height: 0,
            // 商品列表
            goodsList: [],
            skus: [],
            page: 1,
            rows: 100,
            isDone: false,
            goodsInfoVisible: false,
            collapseActiveKey: ['1', '2', '3', '4', '5'],
            goodsInfo: {},
            // 新增/编辑顾客信息标题
            addEditTitle: '',
            // 新增/编辑顾客信息标识
            addEditModal: false,
            // 加载标识
            loading: false,
            // 顾客表单
            userForm: this.$form.createForm(this),
            // 税票表单
            taxForm: this.$form.createForm(this),
            // 顾客地址表单
            addressForm: this.$form.createForm(this),
            // 待结算顾客列表
            users: [],
            // 选中顾客的id
            customerId: '',
            // 选中的顾客信息
            customerInfo: {},
            userNameTel: '普通顾客',
            subUserNameTel: '',
            // 顾客购物车
            userCart: [],
            addEditUser: {},
            addedCustomerId: '',
            // 添加顾客标识
            isAdd: false,
            // 添加/编辑顾客税票信息标识
            bottomVisible: false,
            skuCode: '',
            // 出库方式
            stockOut: [],
            defaultStockOut: '',
            // 仓库列表
            baseStore: [],
            // 是否显示提货位置标识
            showbaseStore: false,
            // 顾客默认地址
            userAddress: [],
            // 新增/编辑顾客地址标题
            addEditAddressTitle: '',
            // 新增/编辑顾客地址标识
            addEditAddressModal: false,
            // 实际售价
            actualPrice: 0,
            oldPrice: 0,
            // 购买数量
            quantity: 1,
            // 优惠券
            coupons: {},
            // 捆绑商品
            group: {},
            bindArr: [],
            // 单品活动
            singleSchedule: [],
            // 套购用券活动
            arbitrageSchedule: [],
            // 档期活动金额修改值
            scheduleAmount: 0,
            // 选中的活动
            chosenActivity: {},
            // 配送中的备注信息
            note: '',
            // 是否使用优惠券
            isCoupon: 0,
            // 是否捆绑商品
            isGroup: 0,
            // 是否安装
            isInstall: 0,
            // 是否参加营销活动
            isSchedule: 0,
            bindDisabled: false,
            // 营销活动激活标识
            isActivityActive: -1,
            activityPre: -1,
            activityNow: -1,
            // 顾客地址激活标识
            isAddressActive: -1,
            addressPre: -1,
            addressNow: -1,
            customerAddress: {},
            customerAddressInfo: {},
            addressLeft: 'address-left',
            defaultClass: 'default',
            spanStyle: 'span-style',
            // 店长优惠券
            aUseAmount: 0,
            bUseAmount: 0,
            // 主商品标识0/捆绑1/赠品2
            isGroupFlag: 0,
            // 选中的捆绑商品
            bindGroup: [],
            addressInfo: {},
            customerMap: {},
            radioValue: 0,
            // 商品库存
            inventory: 0,
            businessType: '',
            // 添加顾客标识
            isAddCustomer: true,
            bBushMoney: 0,
            // 单品满减数据
            actualSub: 0,
            // 单品满返数据
            actualReturn: 0,
            // 商品sku默认值集合
            defaultSku: [],
            // sku刷新请求参数
            skuProperties: [],
            baseSkuProperty: '',
            // 结算
            settlementVisible: false,
            settleGoods: [],
            settleCustomer: {},
            shouldPay: 0,
            settleFromFlag: 0,
            chosenActivityId: '',
            beforBindPrice: 0,
            pickStoreCode: this.$store.getters.storeInfo.code,
            sendTime: moment(),
            fullscreenClass: 'fullscreenClass',
            container: 'body',
            isFirst: true,
            cartFirst: true,
            flag: false,
            baseSkuProperties: [],
            isActiveProperty: -1,
            isBaseStore: false,
            disableEdit: false,
            giftsArr: [],
            gifts: [],
            customerAddressId: '',
            disableChooseGift: false,
            bMax: 0,
            queryCustomerModal: false,
            // 是否允许加入开单
            disableAddSalesBill: false,
            // 是否显示可卖数
            isShowInventory: false,
            giftDisable: false
        }
    },
    computed: {
        // 总金额
        totalPrice () {
            return Number(this.actualPrice * this.quantity)
        }
    },
    created () {
        this.height = this.getHeight()
        this.getData()
        this.getUsers()
        this.goodsInfo.src = ['']
    },
    methods: {
        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        setAddress (address) {
            this.customerAddress = address
            const data = {
                consigneeName: address.name,
                consigneeTelephone: address.telephone,
                consigneeAddress: address.concatAddress,
                consigneeLongitude: address.longitude,
                consigneeLatitude: address.latitude,
                consigneeAddressDetail: address.addressDetail
            }
            this.customerAddressId = address.id
            this.customerAddress = { ...address, ...data }
            console.log('传入的地址信息：', address)
        },
        openQueryCustomerModal () {
            this.queryCustomerModal = true
        },
        giftChange (activity) {
            if (activity.isShow === '0') {
                this.disableChooseGift = true
                return
            } else {
                this.gifts = []
                this.disableChooseGift = false
                const newGift = this.giftsArr[this.giftsArr.length - 1]
                this.giftsArr.splice(0, this.giftsArr.length)
                this.giftsArr.push(newGift)
                if (this.giftsArr[0] !== undefined) {
                    this.singleSchedule.forEach(item => {
                        if (item.gifts) {
                            item.selected = true
                            item.gifts.forEach(subItem => {
                                if (subItem.skuCode === this.giftsArr[0]) {
                                    subItem = {
                                        isGroupFlag: 2,
                                        storeCode: this.$store.getters.storeInfo.code,
                                        name: subItem.skuName,
                                        code: subItem.skuCode,
                                        picture: subItem.skuPic,
                                        unit_price: subItem.skuPrice,
                                        quantity: subItem.skuNum,
                                        skuType: subItem.giftType
                                    }
                                    this.gifts.push(subItem)
                                }
                            })
                        } else {
                            item.selected = false
                        }
                    })
                    activity.startTime = activity.updateTime = activity.endTime = null
                    activity.scheduleRuleName = activity.name
                    activity.makeStoreCode = this.$store.getters.storeInfo.code
                    activity.standard = activity.reachUnitPrice
                    this.chosenActivity = { ...activity }
                } else {
                    activity.selected = false
                    this.chosenActivity = {}
                }
            }
            console.log('-----------------', this.chosenActivity, this.gifts)
        },
        aChangeHandler (val) {
            if (val > this.coupons.acanUse) {
                this.aUseAmount = this.coupons.acanUse
                this.$message.warning('使用额超过可用额度')
            }
        },
        bChangeHandler (val) {
            const { add } = this.$math
            if (val > Number(add(this.coupons.bcanUse, this.coupons.bBushMoney))) {
                this.$message.warning('使用额超过可用额度')
            }
        },
        refreshCart () {
            this.onSettlementClose()
            // this.getUsers()
            // this.queryUserCart(this.settleCustomer.id)
            this.settleGoods = []
        },
        installChange (e) {
            this.isInstall = e.target.checked ? 1 : 0
        },
        // 查询商品规格型号
        getGoodsSkus (code) {
            this.skus = []
            if (code) {
                axios({
                    path: 'DistOriginDataFindSkuPropertyBySkuCode',
                    method: 'POST',
                    body: { code }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log('商品属性：', res.data)
                        const data = res.data
                        data.forEach(item => {
                            if (item.current) {
                                this.baseSkuProperty = item.specs
                            }
                        })
                        this.baseSkuProperties = data
                    }
                })
            }
        },
        selectProperty (property, index) {
            this.isActiveProperty = index
            this.baseSkuProperty = property.specs
            this.baseSkuProperties.forEach(item => {
                if (item.skuCode === property.skuCode) {
                    item.current = true
                }
                item.current = false
            })
            this.showbaseStore = false
            this.pickStoreCode = this.$store.getters.storeInfo.code
            this.getSkuDetails(property.skuCode)
        },
        /**
         * @name: 关闭商品详情
         * @msg:
         * @param {type}
         * @return:
         */
        onGoodsInfoClose () {
            this.goodsInfoVisible = false
            this.quantity = 1
            this.actualPrice = 0
            this.goodsInfo = {}
            // this.goodsInfo.src = ['']
            this.bindArr = []
            this.arbitrageSchedule = []
            this.isFirst = true
            this.isActiveProperty = -1
            this.isAddressActive = -1
            this.customerAddress = {}
            this.customerAddressId = ''
            this.singleSchedule.forEach(item => { item.selected = false })
            this.giftsArr = []
            this.gifts = []
            this.chosenActivity = {}
            this.showbaseStore = false
            this.aUseAmount = this.bUseAmount = 0
            this.stockOut = this.baseStore = []
        },
        /**
         * @name: 选中商品
         * @msg:
         * @param {type}
         * @return:
         */
        checkGoods (e, { index, value }) {
            e.preventDefault()
            this.goodsInfo = { ...value }
            this.actualPrice = this.oldPrice = this.goodsInfo.unitPrice
            this.getSkuDetails(value.skuCode)
            this.getGoodsSkus(value.skuCode)
            // this.queryStockOut(value.skuCode)
            this.getCustomerAddress()
        },
        /**
         * @name: 商品列表请求数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData () {
            if (this.isDone) {
                // this.$refs.vueWaterfall.waterfallOver()
                return
            }
            // const imgSrc = 'https://img11.360buyimg.com/n1/jfs/t29518/5/50591075/273007/2bc96965/5be66874N2b394fba.jpg'
            // const imgSrc = '@assets/goods.png'
            const newList = [...this.goodsList]
            axios({
                path: 'ShoppingTrolleyDetailsQueryHotShopping',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    guiderCode: this.$store.getters.userInfo.code,
                    orderbyField: 'update_time desc',
                    page: this.page,
                    rows: this.rows
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.list.length < this.rows) {
                        this.isDone = true
                        // this.$refs.vueWaterfall.waterfallOver()
                    } else {
                        this.page++
                        this.getData()
                    }
                    res.data.list.forEach(g => {
                        // g.src = g.skuPicture.split(',')[0] !== '' ? g.skuPicture.split(',')[0] : imgSrc
                        g.src = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                    })
                    this.goodsList = [...newList, ...res.data.list]
                }
            })
        },
        /**
         * @name:搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSearch (value) {
            if (value) {
                // const imgSrc = 'https://img11.360buyimg.com/n1/jfs/t29518/5/50591075/273007/2bc96965/5be66874N2b394fba.jpg'
                axios({
                    path: 'ShoppingTrolleyDetailsSelectProviderContractSkus',
                    method: 'POST',
                    body: {
                        storeCode: this.$store.getters.storeInfo.code,
                        skuName: value,
                        page: this.page,
                        rows: this.rows
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log('商品图片：', res.data.list)
                        res.data.list.forEach(g => {
                            // g.src = g.skuPicture.split(',')[0] !== '' ? g.skuPicture.split(',')[0] : imgSrc
                            g.src = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                        })
                        this.goodsList = res.data.list
                    }
                })
            } else {
                console.log(12121212)
                this.isDone = false
                this.goodsList = []
                this.getData()
            }
        },
        /**
         * @name:搜索自动完成
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearch (value) {
            this.dataSource = []
            if (value) {
                this.dataSource = [
                    value,
                    value + value,
                    value + value + value
                ]
            } else {
                this.dataSource.length = 0
                axios({
                    path: 'ShoppingTrolleyDetailsQueryHotShopping',
                    method: 'POST',
                    body: {
                        storeCode: this.$store.getters.storeInfo.code,
                        guider: this.$store.getters.userInfo.code,
                        orderbyField: 'update_time desc',
                        page: this.page,
                        rows: this.rows
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data.list.length < this.rows) {
                            this.isDone = true
                        } else {
                            this.page++
                        }
                        res.data.list.forEach(g => {
                            g.src = g.skuPicture
                        })
                        this.goodsList = [...res.data.list]
                    }
                })
            }
        },
        showDrawer () {
            this.getUsers()
            this.visible = true
        },
        onClose () {
            this.visible = false
        },
        /**
         * @name:二级抽屉结算
         * @msg:
         * @param {type}
         * @return:
         */
        toSettle () {
            console.log(this.settleGoods)
            if (this.settleGoods.length > 0) {
                this.settleFromFlag = 0
                this.settleGoods.forEach(item => {
                    item.salesAmount = item.actualPay
                    item.saleNum = item.skuQuantity
                    item.storeCode = this.$store.getters.storeInfo.code
                    item.selectedAmount = 0
                })
                this.settlementVisible = true
            } else {
                this.$message.warning('请先选择要结算的商品')
                return false
            }
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSettlementClose () {
            this.setWrapStyle(false)
            this.settlementVisible = false
            this.getUsers()
            this.queryUserCart(this.settleCustomer)
            this.settleGoods = []
            this.shoppingScheduleRuleList = []
            this.shoppingSaleRecordList = []
            if (this.shoppingScheduleRuleList.length > 0) {
                this.$refs.ArbitrageActivity.clearGift()
            }
            for (const key in this.checkedObj) {
                this.checkedObj[key] = []
            }
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        showChildrenDrawer (flag, user) {
            console.log('待结算的顾客信息：', user)
            this.settleCustomer = user
            this.subUserNameTel = user.telephone ? `${user.name}：${user.telephone}` : user.name
            if (user.id) {
                this.userCart = []
                this.queryUserCart(user)
                if (flag === 0) {
                    this.cartDrawer = true
                } else {
                    this.childrenDrawer = true
                }
            } else {
                this.$message.warning('请先选择商品')
                this.userCart = []
                return false
            }
        },
        // 查询顾客待结算商品
        queryUserCart (user) {
            axios({
                path: 'ShoppingTrolleyQueryShoppingTrolleyByCustomerId',
                method: 'POST',
                body: {
                    customerName: user.name,
                    customerTelephone: user.telephone,
                    status: 'shopping_trolley_status:1',
                    guideCode: this.$store.getters.userInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    if (data.length === 0) {
                        this.flag = true
                        this.userCart = res.data
                    } else {
                        data.forEach(item => {
                            item.skuPicture = 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                        })
                        this.flag = false
                        this.userCart = data
                    }
                }
            })
        },
        /**
         * @name:选中顾客信息
         * @msg:
         * @param {type}
         * @return:
         */
        passUserInfo (user) {
            console.log('顾客信息：', user)
            if (user !== undefined) {
                user.customerId = user.id
                this.customerInfo = this.settleCustomer = { ...user }
                this.customerId = user.id
                this.userNameTel = this.customerInfo.telephone ? `${this.customerInfo.name}:${this.customerInfo.telephone}` : this.customerInfo.name
            } else {
                this.customerId = ''
                this.userCart = []
                this.customerInfo = {}
                this.userNameTel = '普通顾客'
            }
            this.$store.dispatch('setCustomerId', this.customerId)
            this.$store.dispatch('setCustomerName', this.customerInfo.customerName)
            this.$store.dispatch('setCustomerTelephone', this.customerInfo.customerTelephone)
            this.onClose()
        },
        /**
         * @name:新增/编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (index, user) {
            if (index === -1) {
                this.isAdd = true
                this.addEditTitle = '添加顾客信息'
                this.addEditUser = {}
            } else {
                this.isAdd = false
                this.disableEdit = false
                this.addEditTitle = '编辑顾客信息'
                this.addEditUser = { ...user }
                console.log('要编辑的顾客信息', this.addEditUser)
            }
            this.addEditModal = true
        },
        /**
         * @name: 用户信息新增/编辑
         * @msg:
         * @param {type}
         * @return:
         */
        userInfoHandler () {
            this.addEditModal = true
        },
        onChildrenDrawerClose () {
            this.childrenDrawer = false
            this.cartDrawer = false
            this.settleGoods = []
        },
        fullClick () {
            this.$refs['fullscreen'].toggle()
        },
        fullscreenChange (fullscreen) {
            this.fullscreen = fullscreen
            if (fullscreen) {
                this.height = document.documentElement.clientHeight - 100
                this.container = '.fullscreenClass'
            } else {
                this.height = this.getHeight()
                this.container = 'body'
            }
        },
        /**
         * @name: 获取高度
         * @msg:
         * @param {type}
         * @return:
         */
        getHeight () {
            return document.documentElement.clientHeight - 220
        },
        /**
         * @name:价格格式化
         * @msg:
         * @param {type}
         * @return:
         */
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        /**
         * @name:新增/编辑地址关闭
         * @msg:
         * @param {type}
         * @return:
         */
        // addEditAddress (index, addressInfo) {
        //     if (index === -1) {
        //         this.isAdd = true
        //         this.customerAddressInfo = {}
        //         this.addEditAddressTitle = '新增收货地址'
        //     } else {
        //         this.isAdd = false
        //         console.log('选中的顾客地址信息：', addressInfo)
        //         addressInfo.latitude = String(addressInfo.latitude)
        //         addressInfo.longitude = String(addressInfo.longitude)
        //         this.customerAddressInfo = addressInfo
        //         this.customerAddressId = addressInfo.id
        //         this.addEditAddressTitle = '编辑收货地址'
        //     }
        //     this.addEditAddressModal = true
        // },
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
            console.log('customerInfo:', this.customerInfo)
            e.preventDefault() // 防止事件穿透
            const { addressForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.customerAddressId
                    }
                    this.loading = true
                    values.customerId = this.customerId
                    values.latitude = this.addressInfo.lat
                    values.longitude = this.addressInfo.lng
                    values.province = this.addressInfo.province
                    values.city = this.addressInfo.city
                    values.area = this.addressInfo.area
                    values.customerName = this.customerInfo.name
                    console.log('提交的新增地址信息：', values)
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAddress' : 'CustomerManageUpdateCustomerAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditAddressModal = false
                            if (JSON.stringify(this.customerInfo) === '{}' || this.customerInfo.customerTelephone === null) {
                                res.data.customerName = res.data.name
                                res.data.customerTelephone = res.data.telephone
                                this.customerAddressId = ''
                                this.passUserInfo(res.data)
                            }
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
        },
        /**
         * @name: 根据手机号查询顾客信息
         * @msg:
         * @param {type}
         * @return:
         */
        queryCustomer (rule, value, callback) {
            console.log(value)
            const self = this
            if (value) {
                axios({
                    path: 'CustomerManageQueryInfo',
                    method: 'post',
                    body: {
                        telephone: value
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log('根据手机号查到的顾客信息：', res.data)
                        if (res.data.length > 0) {
                            this.disableEdit = true
                            const data = res.data[0]
                            data.customerName = data.name
                            data.customerTelephone = data.telephone
                            self.userForm.setFieldsValue({ 'telephone': data.telephone, 'name': data.name, 'sex': data.sex, 'address': data.address, 'addressDetail': data.addressDetail })
                            if (this.isAdd) {
                                this.passUserInfo(data)
                                this.addEditModal = false
                            }
                        } else {
                            self.userForm.setFieldsValue({ 'name': '', 'sex': '', 'address': '', 'addressDetail': '' })
                            this.disableEdit = false
                        }
                    }
                })
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
                    values.longitude = this.customerInfo.lng || this.addEditUser.longitude
                    values.province = this.customerInfo.province
                    values.city = this.customerInfo.city
                    values.area = this.customerInfo.area
                    if (this.isAdd === false) {
                        values.id = this.addEditUser.id
                        values.type = this.addEditUser.type
                        values.oldCustomerName = this.addEditUser.name
                    } else {
                        if (values.address !== '') {
                            const customerAddress = [{}]
                            customerAddress[0] = { ...values }
                            customerAddress[0].isDefault = 1
                            values.customerAddress = [ ...customerAddress ]
                        }
                    }
                    this.userNameTel = `${values.name}:${values.telephone}`
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
                                res.data.customerName = res.data.name
                                res.data.customerTelephone = res.data.telephone
                                res.data.customerId = res.data.id
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
        /**
         * @name: 添加地址税票信息--税票
         * @msg:
         * @param {type}
         * @return:
         */
        addTaxInfo (e) {
            const self = this
            e.preventDefault() // 防止事件穿透
            const taxValidateFields = this.taxForm.validateFields
            taxValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.customerId = this.addedCustomerId
                    console.log('添加顾客地址--税票信息：', values)
                    axios({
                        path: 'CustomerManageAddCustomerInvoice',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            self.addEditModal = false
                            self.isAddCustomer = true
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 加入销售开单
         * @msg:
         * @param {type}
         * @return:
         */
        addSalesBill () {
            // 购买数量小数校验
            if (this.check(this.quantity)) {
                this.quantity = 1
                this.$message.warning('购买数量不能为小数')
                return false
            } else if (this.isBaseStore && this.customerAddressId === '') {
                this.$message.warning('请添加收货地址信息')
                return false
            } else if (this.chosenActivity.scheduleType === 'schedule_rule_define_schedule_type:3') {
                if (this.gifts.length === 0) {
                    this.$message.warning('请选择赠品')
                    return false
                }
            }
            const self = this
            let shoppingScheduleRule = {}
            if (!this.chosenActivity.id) {
                shoppingScheduleRule = null
            } else {
                this.chosenActivity.scheduleEffectType = this.chosenActivity.effectType
                delete this.chosenActivity['id']
                shoppingScheduleRule = { ...this.chosenActivity }
                shoppingScheduleRule.scheduleRuleCode = this.chosenActivity.code !== undefined ? this.chosenActivity.code : null
                shoppingScheduleRule.contractCode = this.goodsInfo.contractCode
                shoppingScheduleRule.providerCode = this.goodsInfo.providerCode
                if (this.chosenActivity.activityName === '单品满减') {
                    shoppingScheduleRule.scheduleAmount = this.actualSub
                } else {
                    shoppingScheduleRule.scheduleAmount = this.actualReturn
                }
                console.log('提交的营销活动：', shoppingScheduleRule)
            }
            // "shoppingTrolley":
            if (this.aUseAmount !== 0 || this.bUseAmount !== 0) {
                this.isCoupon = 1
            }
            const shoppingTrolley = {}
            shoppingTrolley.aamount = this.coupons.acanUse
            shoppingTrolley.auseAmount = this.aUseAmount
            shoppingTrolley.bamount = this.coupons.bcanUse
            shoppingTrolley.bpushAmount = this.coupons.bBushMoney
            shoppingTrolley.buseAmount = this.bUseAmount
            shoppingTrolley.consigneeName = this.customerAddress.consigneeName
            shoppingTrolley.consigneeTelephone = this.customerAddress.consigneeTelephone
            shoppingTrolley.consigneeAddress = this.customerAddress.consigneeAddress + this.customerAddress.consigneeAddressDetail
            // shoppingTrolley.consigneeAddressDetail = this.customerAddress.consigneeAddressDetail
            shoppingTrolley.consigneeLongitude = this.customerAddress.consigneeLongitude
            shoppingTrolley.consigneeLatitude = this.customerAddress.consigneeLatitude
            shoppingTrolley.customerName = this.customerInfo.customerName
            shoppingTrolley.customerTelephone = this.customerInfo.customerTelephone
            shoppingTrolley.customerAddressId = this.customerAddressId
            shoppingTrolley.guideCode = this.$store.getters.userInfo.code
            shoppingTrolley.guideName = this.$store.getters.userInfo.name
            shoppingTrolley.isCoupon = this.isCoupon
            shoppingTrolley.isGroup = this.isGroup
            shoppingTrolley.isInstall = this.isInstall
            shoppingTrolley.isSchedule = this.isSchedule
            shoppingTrolley.note = this.note
            shoppingTrolley.stockOut = this.defaultStockOut
            shoppingTrolley.storeCode = this.$store.getters.storeInfo.code
            shoppingTrolley.pickStoreCode = this.pickStoreCode
            shoppingTrolley.priceMin = this.goodsInfo.priceMin
            shoppingTrolley.sendTime = this.sendTime
            shoppingTrolley.storeId = this.$store.getters.storeInfo.id
            console.log('提交的其他信息：', shoppingTrolley)
            // "shoppingTrolleySkuList": 商品：包含主商品，捆绑商品，满赠商品
            let shoppingTrolleySkuList = []
            shoppingTrolleySkuList[0] = this.goodsInfo
            shoppingTrolleySkuList[0].actualPrice = this.actualPrice
            shoppingTrolleySkuList[0].isGroupFlag = 0
            shoppingTrolleySkuList[0].quantity = this.quantity
            shoppingTrolleySkuList[0].skuProperty = this.baseSkuProperty
            shoppingTrolleySkuList[0].storeCode = this.$store.getters.storeInfo.code
            shoppingTrolleySkuList[0].picture = this.goodsInfo.src
            shoppingTrolleySkuList[0].providerCode = this.goodsInfo.providerCode
            shoppingTrolleySkuList[0].providerName = this.goodsInfo.providerName
            shoppingTrolleySkuList[0].contractCode = this.goodsInfo.contractCode
            shoppingTrolleySkuList[0].businessType = this.goodsInfo.businessType
            shoppingTrolleySkuList[0].ifStock = this.goodsInfo.ifStock
            shoppingTrolleySkuList[0].rate = this.goodsInfo.rate
            shoppingTrolleySkuList[0].taxRate = this.goodsInfo.taxRate
            console.log('加入销售开单-赠品：', this.gifts)
            if (this.gifts.length > 0) {
                shoppingTrolleySkuList = [...shoppingTrolleySkuList, ...this.gifts, ...this.bindGroup]
            } else {
                shoppingTrolleySkuList = [...shoppingTrolleySkuList, ...this.bindGroup]
            }
            console.log('加入销售开单：', { shoppingScheduleRule, shoppingTrolley, shoppingTrolleySkuList })
            axios({
                path: 'ShoppingTrolleyAddShoppingTrolley',
                method: 'post',
                body: {
                    shoppingScheduleRule,
                    shoppingTrolley,
                    shoppingTrolleySkuList
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.customerId !== null) {
                        res.data.name = res.data.customerName
                        res.data.id = res.data.customerId
                        this.customerInfo = this.settleCustomer = { ...res.data }
                        this.customerId = this.customerInfo.id
                        this.userNameTel = this.customerInfo.customerTelephone ? `${this.customerInfo.customerName}:${this.customerInfo.customerTelephone}` : this.customerInfo.customerName
                    }
                    self.onGoodsInfoClose()
                }
            })
        },
        /**
         * @name: 捆绑商品勾选
         * @msg:
         * @param {type}
         * @return:
         */
        bindChange (checkedValues) {
            this.beforBindPrice = this.totalPrice
            if (checkedValues.length > 0) {
                if (this.group.bindNum !== 0 && checkedValues.length > this.group.bindNum) {
                    this.$message.warning(`最多只能选择${this.group.bindNum}个商品`)
                    checkedValues.pop()
                }
                this.isGroup = 1
                this.actualPrice = this.group.mainSkuPrice
                this.refreshActivity()
                this.clearAB()
                this.clearActivity()
                const tempBindGoods = []
                this.group.bindGoods.forEach(item => {
                    item.actualPrice = item.priceDisc
                    item.code = item.skuCode
                    item.name = item.skuName
                    item.isGroupFlag = 1
                    item.storeCode = this.$store.getters.storeInfo.code
                    item.unitPrice = item.unit
                    checkedValues.forEach(subItem => {
                        if (item.skuCode === subItem) {
                            tempBindGoods.push(item)
                        }
                    })
                })
                this.bindGroup = [...tempBindGoods]
            } else {
                this.isGroup = 0
                this.actualPrice = this.oldPrice
                this.bindGroup = []
                this.clearAB()
                this.clearActivity()
                this.refreshActivity()
            }
        },
        // 清除AB
        clearAB () {
            // const { add } = this.$math
            // if (this.aUseAmount > this.coupons.acanUse || this.bUseAmount > Number(add(this.coupons.acanUse, this.coupons.bBushMoney))) {
            this.aUseAmount = this.bUseAmount = 0
            // }
        },
        // 清除活动
        clearActivity () {
            console.log('清除活动')
            this.isActivityActive = this.activityPre = -1
            this.chosenActivity = {}
            this.isSchedule = 0
        },
        /**
         * @name: 选择营销活动
         * @msg:
         * @param {type}
         * @return:
         */
        chooseActivity (activity) {
            if (activity.scheduleType === 'schedule_rule_define_schedule_type:1' || activity.scheduleType === 'schedule_rule_define_schedule_type:2') {
                console.log('1111111111111111111111111')
                this.giftsArr = []
                this.gifts = []
                this.singleSchedule.forEach(item => {
                    if (item.scheduleType === activity.scheduleType) {
                        item.selected = !item.selected
                        if (item.selected === true) {
                            activity.startTime = activity.updateTime = activity.endTime = null
                            activity.scheduleRuleName = activity.name
                            activity.makeStoreCode = this.$store.getters.storeInfo.code
                            activity.standard = activity.reachUnitPrice
                            this.chosenActivity = { ...activity }
                            console.log('选择的营销活动：', this.chosenActivity)
                        } else {
                            this.chosenActivity = {}
                            console.log('选择的营销活动：', this.chosenActivity)
                        }
                    } else {
                        item.selected = false
                    }
                })
            } else {
                return false
            }
        },
        /**
         * @name: 顾客地址选择
         * @msg:
         * @param {type}
         * @return:
         */
        chooseAddress (index, address) {
            this.addressNow = index
            if (this.addressNow === this.addressPre) {
                // 取消选中
                this.isAddressActive = this.addressPre = -1
                this.customerAddress = {}
                this.customerAddressId = ''
                this.isBaseStore = false
            } else {
                // 选中
                this.isAddressActive = this.addressPre = index
                const data = {
                    consigneeName: address.name,
                    consigneeTelephone: address.telephone,
                    consigneeAddress: address.concatAddress,
                    consigneeLongitude: address.longitude,
                    consigneeLatitude: address.latitude,
                    consigneeAddressDetail: address.addressDetail
                }
                this.customerAddressId = address.id
                this.isBaseStore = true
                this.customerAddress = data
                console.log('选中的地址信息：', this.customerAddress)
            }
        },
        /**
         * @name:出库方式监听
         * @msg:
         * @param {type}
         * @return:
         */
        stockOutChangeHandler (value) {
            this.baseStore = []
            this.defaultStockOut = value
            this.showbaseStore = false
            if (value === 'shopping_stock_out:1') {
                this.showbaseStore = false
                this.isBaseStore = false
                this.baseStore = []
                this.pickStoreCode = this.$store.getters.storeInfo.code
                this.refreshInventory()
            } else if (value === 'shopping_stock_out:2') {
                // 仓库送货
                this.showbaseStore = true
                this.isBaseStore = true
                this.queryBaseStore()
            } else if (value === 'shopping_stock_out:3') {
                // 厂家配送
                this.showbaseStore = true
                this.isBaseStore = false
                this.queryProvider()
                // this.pickStoreCode = this.$store.getters.storeInfo.code
                // this.getInventory(this.goodsInfo.code, this.pickStoreCode)
            }
        },
        // 仓库送货
        queryBaseStore () {
            axios({
                path: 'ShoppingTrolleyQueryBaseStore',
                method: 'POST',
                body: {
                    id: this.$store.getters.storeInfo.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.showbaseStore = true
                    const data = res.data
                    data.forEach(item => {
                        item.title = `${item.code}--${item.name}`
                        item.key = item.id
                        item.value = item.code
                    })
                    this.pickStoreCode = data[0].code
                    this.baseStore = [...data]
                    this.refreshInventory()
                }
            })
        },
        // 厂家配送
        queryProvider () {
            axios({
                path: 'ShoppingTrolleyDetailsQueryProviderBySku',
                method: 'POST',
                body: {
                    code: this.goodsInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.length > 0) {
                        this.showbaseStore = true
                        const data = res.data
                        data.forEach(item => {
                            item.title = `${item.code}--${item.name}`
                            item.key = item.id
                            item.value = item.code
                        })
                        this.pickStoreCode = data[0].code
                        this.baseStore = [...data]
                    }
                }
            })
        },
        /**
         * @name: 提货方式监听
         * @msg:
         * @param {type}
         * @return:
         */
        baseStoreChangeHandler (val) {
            this.pickStoreCode = val
            this.refreshInventory()
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
        },
        /**
         * @name:购买数量变化监听
         * @msg:
         * @param {type}
         * @return:
         */
        quantityChangeHandler (val, inventory) {
            if (typeof val === 'string') {
                this.quantity = 1
            } else if (val > inventory && this.isShowInventory) {
                this.$message.warning('库存不足')
                this.disableAddSalesBill = true
            } else {
                this.disableAddSalesBill = false
                this.refreshActivity()
            }
        },
        /**
         * @name: 实际售价变化监听
         * @msg:
         * @param {type}
         * @return:
         */
        actualPriceChangeHandler (val, priceMin) {
            console.log('------实际售价-------', val.target.value)
            if (val.target.value >= priceMin) {
                this.refreshActivity()
            } else {
                this.actualPrice = this.oldPrice
                this.refreshActivity()
            }
        },
        refreshActivity () {
            this.clearAB()
            this.clearActivity()
            this.queryBindingGoods()
            this.queryCoupons()
            this.querySingleSchedule()
            this.queryArbitrageSchedule()
        },
        /**
         * @name: 实减/实返变化监听
         * @msg:
         * @param {type}
         * @return:
         */
        activityChangeHandler (flag, val, max) {
            console.log(val, max)
            if (val <= max) {
                if (flag === 0) {
                    this.actualSub = val
                } else {
                    this.actualReturn = val
                }
            } else {
                this.$message.warning('输入金额不能大于最大金额')
            }
        },
        /**
         * @name: 安装日期禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDate (current) {
            return moment(current).isBefore(moment().subtract(1, 'days'))
        },
        /**
         * @name: 检查小数
         * @msg:
         * @param {type}
         * @return:
         */
        check (c) {
            const r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/
            return r.test(c)
        },
        /**
         * @name:查询待结算用顾客列表
         * @msg:
         * @param {type}
         * @return:
         */
        getUsers () {
            axios({
                path: 'ShoppingTrolleyQueryCommodity',
                method: 'POST',
                body: {
                    guideCode: this.$store.getters.userInfo.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.customerTelephone = item.telephone
                        item.customerName = item.name
                    })
                    this.users = data
                }
            })
        },
        /**
         * @name:查询提货方式
         * @msg:
         * @param {type}
         * @return:
         */
        queryStockOut (skuCode) {
            this.stockOut = []
            axios({
                path: 'ShoppingTrolleyQueryStockOut',
                method: 'POST',
                body: {
                    skuCode: skuCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    let data = res.data
                    this.defaultStockOut = `${data[0].type}:${data[0].configKey}`
                    this.isBaseStore = false
                    if (this.goodsInfo.businessType === 'provider_contract_business_type:2' && this.goodsInfo.ifStock === '0') {
                        data = data.filter(item => item.configKey !== 2)
                        this.isShowInventory = false
                    } else if (this.goodsInfo.businessType === 'provider_contract_business_type:1' && this.goodsInfo.ifStock === '1') {
                        data = data.filter(item => item.configKey !== 3)
                        this.isShowInventory = true
                    } else if (this.goodsInfo.businessType === 'provider_contract_business_type:2' && this.goodsInfo.ifStock === '1') {
                        this.isShowInventory = true
                        data = data.filter(item => item.configKey !== 3)
                    }
                    this.stockOut = [...data]
                }
            })
        },
        // 查询捆绑商品列表
        queryBindingGoods () {
            const self = this
            axios({
                path: 'GroupDefineQueryBindingGoods',
                method: 'POST',
                body: {
                    skuCode: self.goodsInfo.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询捆绑商品', res.data)
                    const data = res.data
                    this.group = data
                }
            })
        },
        // 查询店长优惠券列表
        queryCoupons () {
            const self = this
            axios({
                path: 'CouponsUseGetCoupons',
                method: 'POST',
                body: {
                    skuCode: self.goodsInfo.code,
                    storeCode: this.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.coupons = res.data
                }
            })
        },
        // 查询单品活动
        querySingleSchedule () {
            const self = this
            axios({
                path: 'ScheduRuleGetSingleSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    skuCode: self.goodsInfo.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    if (data.length > 0) {
                        data.forEach(item => {
                            item.selected = false
                            if (item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                                item.activityName = '单品满返'
                                item.desc = `满${item.reachUnitPrice}返${item.rateAmount}`
                                this.actualReturn = item.shouldRateAmount
                            } else if (item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                                item.activityName = '单品满减'
                                item.desc = `满${item.reachUnitPrice}减${item.rateAmount}`
                                this.actualSub = item.shouldRateAmount
                            } else {
                                item.activityName = '单品满赠'
                                item.desc = `满${item.reachAmount}赠以下商品`
                                if (item.isShow === '0') {
                                    this.disableChooseGift = true
                                    this.giftDisable = true
                                } else {
                                    this.giftDisable = false
                                    this.disableChooseGift = false
                                }
                                if (item.gifts.length > 0) {
                                    item.gifts.forEach(item => {
                                        // item.src = item.picture ? item.picture.split(',') : ['']
                                        item.src = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                                    })
                                }
                            }
                        })
                    }
                    this.singleSchedule = data
                    console.log('单品活动：', this.singleSchedule)
                }
            })
        },
        // 查询套购活动
        queryArbitrageSchedule () {
            this.arbitrageSchedule = []
            const self = this
            axios({
                path: 'ScheduRuleGetArbitrageSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    skuCode: self.goodsInfo.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    if (data.length > 0) {
                        data.forEach(item => {
                            if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                                console.log(1)
                                item.activityName = '套购满返'
                                item.desc = `满${item.reachAmount}返${item.rateAmountT}`
                            } else if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                                console.log(2)
                                item.activityName = '套购满减'
                                item.desc = `满${item.reachAmount}减${item.rateAmountT}`
                            } else {
                                console.log(3)
                                item.activityName = '套购满赠'
                                item.desc = `满${item.reachAmount}赠以下商品`
                                item.src = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                            }
                        })
                    }
                    this.arbitrageSchedule = data
                    this.queryFullUseSchedule()
                    console.log('套购活动：', res.data)
                }
            })
        },
        // 查询满用活动
        queryFullUseSchedule () {
            const self = this
            axios({
                path: 'ScheduRuleGetFullUseSchedule',
                method: 'POST',
                body: {
                    storeCode: self.$store.getters.storeInfo.code,
                    classCode: self.goodsInfo.classCode,
                    brandCode: self.goodsInfo.brandCode,
                    skuCode: self.goodsInfo.code,
                    salesAmount: self.actualPrice,
                    saleNum: self.quantity
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('满用活动', res.data)
                    const data = res.data
                    if (data.length > 0) {
                        data.forEach(item => {
                            item.activityName = '满用'
                            item.desc = `满${item.reachUnitPrice}可用${item.rateAmount}电子券`
                        })
                        this.arbitrageSchedule.push(data[0])
                    }
                }
            })
        },
        /**
         * @name:查询顾客地址
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerAddress () {
            console.log('this.customerId', this.customerId)
            if (this.customerId !== '') {
                axios({
                    path: 'CustomerManageQueryUserAddress',
                    method: 'POST',
                    body: {
                        id: this.customerId
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
         * @name: 查询商品详情
         * @msg:
         * @param {type}
         * @return:
         */
        getSkuDetails (code, pickStoreCode) {
            const self = this
            axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuDetails',
                method: 'POST',
                body: {
                    noteA: pickStoreCode,
                    code: code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    self.getInventory(code, pickStoreCode)
                }
            })
        },
        getInventory (code, pickStoreCode) {
            const self = this
            axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuContract',
                method: 'POST',
                body: {
                    noteA: pickStoreCode,
                    code: code,
                    storeCode: self.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    self.goodsInfo = {
                        code: res.data.code,
                        name: res.data.name,
                        model: res.data.model,
                        unitPrice: res.data.unitPrice,
                        businessType: res.data.businessType,
                        batchNo: res.data.batchNo,
                        providerCode: res.data.providerCode,
                        providerName: res.data.providerName,
                        contractCode: res.data.contractCode,
                        brandCode: res.data.brandCode,
                        className: res.data.className,
                        priceMin: Number(res.data.priceMin),
                        skuType: res.data.skuType,
                        classCode: res.data.classCode,
                        brandName: res.data.brandName,
                        rate: res.data.rate,
                        taxRate: res.data.taxRate,
                        ifStock: res.data.ifStock,
                        inventory: res.data.inventory,
                        src: 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                        // src: res.data.picture ? res.data.picture.split(',') : ['']
                    }
                    self.actualPrice = self.oldPrice = res.data.unitPrice
                    self.isInstall = res.data.isInstall
                    self.queryStockOut(res.data.code)
                    self.queryBindingGoods()
                    self.queryCoupons()
                    self.querySingleSchedule()
                    self.queryArbitrageSchedule()
                    this.disableAddSalesBill = false
                    self.goodsInfoVisible = true
                } else {
                    this.disableAddSalesBill = true
                }
            })
        },
        refreshInventory () {
            axios({
                path: 'ShoppingTrolleyDetailsQueryStockInfo',
                method: 'POST',
                body: {
                    storeCode: this.pickStoreCode, // 切换到仓库code
                    code: this.goodsInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.goodsInfo.inventory = res.data.inventory
                }
            })
        },
        setWrapStyle (type) {
            console.log(type)
            if (type) {
                this.wrapStyle = {
                    transform: 'translateY(0px)'
                }
            } else {
                this.wrapStyle = {}
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ShoppingGuideBilling') {
                this.getData()
                this.getUsers()
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
.vue-waterfall-easy{
    left: 0 !important;
    margin-left: 0 !important;
    width: 100% !important;
    height: 100%;
    flex-wrap: wrap;
    display: flex;
    .img-box{
        position: static !important;
    }
}
</style>
<style lang="less" scoped>
img {
  display: block
}
.btn-box{
    width:100%;
    display: flex;
    display: -webkit-inline-flex;
    flex-flow:row nowrap;
    justify-content: space-between;
    align-items:center;
    line-height:32px;
    font-size:14px;
    .left-box{
        width: 50%;
        flex-flow:row nowrap;
        justify-content: flex-start;
    }
    .right-box{
        width: 50%;
        flex-flow:row nowrap;
        justify-content: flex-end;
    }
}
.mark-title{
    text-align: right;
    font-weight: bold;
    padding-right: 10px;
    font-size: 12px;
    line-height: 34px;
}
.mark-conter{
    font-size: 12px;
    line-height:34px;
}
.goods-box{
    display: flex;
    display: -webkit-inline-flex;
    width: 100%;
    min-height: 270px;
    padding-left: 20px;
    margin-bottom: 10px;
    flex-flow:row nowrap;
    justify-content: flex-start;
    &-img{
        min-width: 270px;
        max-width:400px;
        width:auto;
        height: 270px;
        display: block;
    }
    &-info-box{
        min-height: 270px;
        width:100%;
        .title{
            font-weight: bold;
            font-size: 20px;
            line-height: 40px;
            color:#000;
            margin-right: 5px;
        }
        .price{
            font-weight: bold;
            font-size: 30px;
            line-height: 40px;
            color:#000;
            // margin-right: 5px;
        }
        .info{
            font-weight: bold;
            font-size: 14px;
            line-height: 40px;
            margin-right: 5px;
        }
        .property {
          margin: 10px 0;
          display: flex;
          .right {
            span {
              margin: 0 10px 10px 0;
            }
          }
        }
        .store-info{
            // display: flex;
            // display: -webkit-inline-flex;
            // flex-flow:row nowrap;
            // justify-content: flex-start;
        }
    }
}
// 商品瀑布流
.img-info{
    padding: 0 10px;
    width:100%;
    .price{
        font-weight: bold;
        font-size: 1.5;
        line-height: 2;
        color:#000;

    }
    .title{
        font-size: 14px;
        line-height: 2;
        color:#000;
    }
    .info{
        font-size: 14px;
        line-height: 2;
        color:#9fa8bb;
    }
}
.seach-box{
    margin-bottom: 10px;
}
img{
  width:auto;
  height: auto;
  max-width: 100%;
  display: block;
}
.user {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
}
// 抽屉样式
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
// 购物车复选框组样式
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
  cursor: pointer;
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
.span-style{
  display: inline-block;
  width: 80px;
  height: 30px;
  margin-right: 10px;
  padding: 5px;
  font-size:12px;
  border:1px dotted #eee;
  color:#aaa;
  text-align:center;
}
.span-active{
  font-size:12px;
  background: rgb(56,173,255);
  color: #fff;
  text-align:center;
  border:1px dotted #eee;
}
//营销活动样式重写
/deep/.ant-card-body {
  padding:10px;
  .activity-box{
    display: flex;
    .activity-desc{
      height:32px;
      line-height: 32px;
      flex: 3;
    }
    .amount {
      display: flex;
      height:32px;
      line-height: 32px;
      flex:1;
      div{
        flex: 1;
      }
    }
  }
}

// 赠品样式重写
.gift {
  margin-bottom: 10px;
  .ant-checkbox-wrapper {
    width: 80px;
    text-align: center;
    height: 90px;
    line-height: 90px;
  }
  .gift-box{
    display: flex;
    .gift-img {
      width: 70px;
      height: 90px;
      line-height: 90px;
      margin: 10px;
      img{
        display: inline-block;
        width: auto;
        height: 90px;
      }
    }
    .gift-info {
      padding-top: 10px;
      flex:1;
      p{
        margin-bottom: 12px;
        font-weight: 700;
      }
    }
  }
}
// 捆绑商品样式重写
.bind-goods{
  /deep/.ant-card-body {
    padding: 10px;
    .bind-box {
      display: flex;
      height: 100px;
      .check-box{
        width: 30px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .goods-box {
        display: flex;
        flex: 1;
        .img-box{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 90px;
          line-height: 90px;
          margin: 10px;
        }
        .goods-info{
          padding-top: 10px;
          flex:8;
          p{
            margin-bottom: 12px;
            font-weight: 700;
          }
        }
        .goods-quantity{
          flex:2;
          height:100px;
          line-height: 100px;
        }
      }
    }
  }
}
// 结算
.settle {
  padding: 10px;
  .goods-info {
    .img-box {
      padding-left: 22px;
      text-align: center;
      img {
        width: 70px;
      }
    }
    .ant-col-16 {
      p{
        font-weight: 700;
      }
    }
    .skucode{
      display: inline-block;
      padding: 0 5px;
      background-color: #eee;
      color: rgb(56,173,255);
    }
  }
  .ticket {
    border-left:1px solid #eee;
    padding-left: 10px;
    .chosen-tickets {
      margin-top: 10px;
      .ant-row > div {
        background: transparent;
        border: 0;
      }
      .gutter-box {
        padding: 4px;
        margin-bottom: 10px;
        text-align: center;
        font-size: 12px;
        border:1px dotted rgb(56,173,255);
        background-color: rgb(56,173,255);
        color: #fff;
      }
    }
  }
}
// 规格型号
.btn-style {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  border: 1px solid #ccc;
  text-align: center;
  padding: 0 10px;
  border-radius: 3px;
  cursor: pointer;
}
.defaultStyle,
.propertyActive {
  background: #1890ff;
  color: #fff;
  border: none;
}
/deep/ .ant-drawer-open{
  transform: translateY(0px) !important
}

// 瀑布流图片
/deep/ .alink .img-wraper{
    width: 240px  !important;
    height: 249px !important;
}

</style>

<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-07-30 15:57:21
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-27 17:20:37
 -->
<template>
  <div class="goodsDetail">
    <div class="detail-header">
      <a-button type="primary" class="back" v-if="goodsDetailStatus!==0" icon="double-left" @click="back">返回</a-button>
      <div class="address" :class="{active: goodsDetailStatus===0}">
        <div class="customer" v-if="goodsDetailStatus===0">
          当前顾客：{{ customer.userName||'' }} - {{ customer.userTelephone||'' }}
        </div>
        <div class="customer" v-else>
          当前顾客：{{ shoppingTrolley.consigneeName||'' }} - {{ shoppingTrolley.consigneeTelephone||'' }}
        </div>

        <div class="line"></div>

        <div class="address-detail">
          <div v-if="goodsDetailStatus===0">
            收货地址：{{ customer.name||'' }}  {{ customer.telephone||'' }} {{ customer.concatAddress||'' }}
          </div>
          <div v-else>
            收货地址：{{ shoppingTrolley.consigneeName||'' }}  {{ shoppingTrolley.consigneeTelephone||'' }} {{ shoppingTrolley.consigneeAddressDetail||shoppingTrolley.consigneeAddress||'' }}
          </div>
        </div>
        <div class="address-action">
          <a-button icon="environment" :disabled="goodsDetailStatus===1" @click="queryCustomerModal=true" >选择地址</a-button>
          <a-button icon="plus" @click="addEdit(-1)" :disabled="goodsDetailStatus===1">添加顾客</a-button>
          <a-button type="primary" @click="checkGoodsHandler" :disabled="goodsDetailStatus===1" icon="search">选择商品</a-button>
        </div>
      </div>
    </div>

    <a-affix :offsetTop="this.top" style="margin-top:10px;">
      <div class="goods-sub">
        <div class="goods-quantity">
          <span>
            购买数量
          </span>
          <a-input-number
            :min="1"
            style="width:50px;"
            :disabled="shoppingTrolley.ifDeposit===1||goodsDetailStatus===1"
            v-model="detail.quantity"/>{{ goodsDetail.unit }}
          <span v-if="goodsDetail.ifStock==='1'">可卖数：{{ goodsDetail.inventory }}{{ goodsDetail.unit }}</span>
          <span style="color: #FF5533;" v-if="goodsDetail.ifStock==='1'&& goodsDetail.norNumber===0">
            预售商品，暂时不能送货
          </span>
        </div>
        <div class="goods-action">
          <span>
            实际售价(元)：
          </span>
          <div class="price">
            <a-input-number
              :disabled="detail.activity||goodsDetailStatus===1"
              :min="0"
              v-model="detail.actualPrice"
              @change="priceMin"
              @blur="priceMax" />
            <span class="priceMin" @click="showCheckList">结算售价：{{ initPrice(detail.actualPrice*detail.quantity||0) }}
              <a-icon type="up" v-if="isCheckList" />
              <a-icon type="down" v-else />
            </span>
          </div>
          <!-- <a-radio-group :options="options"/> -->
          <a-radio :checked="shoppingTrolley.ifDeposit===1" :disabled="goodsDetailStatus===1" value="shoppingTrolley.ifDeposit" @click="priceChange"><span >是否定金销售</span></a-radio>
          <a-button
            type="primary"
            class="notaccount"
            @click="notaccountHandler"
            style="width:100px;"
            :disabled="goodsDetailStatus===1">待结算({{ trolleyDetailCount }})</a-button>
          <a-button type="primary" :disabled="goodsDetailStatus===1" @click="addShoppingTrolley">加入销售开票</a-button>
        </div>
      </div>
      <div class="check-msg" v-if="isCheckList">
        <p>
          当笔使用：
          <span v-if="detail.eleRollCont">
            顾客优惠券合计：{{ detail.eleRollCont }}
          </span>
          <span v-if="detail.rule==='schedule_rule_define_schedule_type:2'">
            {{ `满${singleSchedule.reachAmount}减${singleSchedule.rateAmount} 实减：${singleSchedule.actualAmount}` }}
          </span>

          <span v-for="(item,index) in couponsCheckList" :key="index">
            {{ item.title }}:{{ item.price.toFixed(2) }}
          </span>
          <span class="totial">
            优惠小计：<span>{{ initPrice(totialAmount) }}</span>
          </span>
        </p>
        <p>
          顾客获赠：
          <span v-for="bind in detail.bindingGoodsLsit" :key="bind.skuCode">
            捆绑：{{ bind.skuCode }}-{{ bind.skuName }}
          </span>
          <span v-for="(warr,index) in detail.warrantyCheck" :key="index">
            延保服务：{{ warr.acppTypeName }}
          </span>
          <span v-for="serve in detail.serveChangeList" :key="serve.skuCode">
            服务劵：{{ serve.skuCode }}-{{ serve.skuName }}
          </span>
          <span v-if="detail.rule==='schedule_rule_define_schedule_type:1'">
            {{ `满${fullReturn.reachAmount}返${fullReturn.rateAmount} 实返：${fullReturn.actualAmount}` }}
          </span>
          <span v-for="comp in detail.complimentaryCheck" :key="comp.skuCode" v-if="detail.rule==='schedule_rule_define_schedule_type:3'">
            单品满赠：{{ comp.skuCode }}-{{ comp.skuName }}
          </span>

        </p>
      </div>
    </a-affix>
    <div class="goodshandle">
      <a-carousel>
        <div v-for="(img,index) in goodsDetail.pic" :key="index">
          <img v-if="img" :src="img" @error.once="moveErrorImg($event)" :alt="goodsDetail.skuName" class="goods-img">
          <img v-else src="@assets/goods.png" :alt="goodsDetail.skuName" class="goods-img">
        </div>
      </a-carousel>
      <div class="handler">
        <div class="good-title">
          <p>{{ goodsDetail.brandName }} {{ goodsDetail.model }} &nbsp;{{ goodsDetail.name }}  &nbsp;{{ skuCode }}</p>
        </div>
        <div class="good-price">
          <div class="original-prcie">
            <span class="">
              销售价：
            </span>
            <span class="price">
              {{ initPrice(goodsDetail.unitPrice||0) }}
            </span>
          </div>
          <div class="actual-price" v-if="singleLimitShow" :class="{active:detail.activity}" @click="updateActivity">
            <div class="activity">
              限时抢购
            </div>
            <div class="price-msg">
              <span>抢购价：
                <span class="price">
                  {{ initPrice(singleLimit.maxPrice) }}
                </span>
              </span>
              <span>剩余数量：{{ singleLimit.maxQuantity }}</span>
              <span class="activity-lable">
                剩余时间：
                <span class="time">
                  <span>{{ endTimeH }}</span>:<span>{{ endTimeM }}</span>:<span>{{ endTimeS }}</span>
                </span>
              </span>
            </div>
            <!-- <p class="check-activity">
              查看可享受的套购活动<a-icon type="double-right" />
            </p> -->
          </div>
        </div>
        <div class="goods-model" v-if="goodsModel.length>0">
          <span class="model" style="float:left;">商品规格：</span>
          <a-radio-group v-model="theGoodsModel" buttonStyle="solid" @change="changeModel" :disabled="goodsDetailStatus===1">
            <a-radio-button :value="model.skuCode" v-for="model in goodsModel" :key="model.skuCode">
              <div class="model-item">
                <img v-if="goodsDetail.pic" :src="goodsDetail.pic" @error.once="moveErrorImg($event)" class="goods-img">
                <img v-else src="@assets/goods.png" class="goods-img">
                <span>
                  {{ model.specs }}
                </span>
              </div>

            </a-radio-button>
          </a-radio-group>
        </div>

        <div class="goods-model" v-if="warranty.length>0">
          <span class="model" style="float:left;">延保服务：</span>
          <a-checkbox-group :value="detail.warranty" @change="warrantyHanler" :disabled="goodsDetailStatus===1">
            <a-checkbox :value="warr.id" v-for="warr in warranty" :key="warr.id">
              <div class="goods" style="line-height: 42px;text-align: center;">
                <span>
                  【 {{ warr.acppTypeName }} 】 {{ warr.acppAmount }}元
                </span>
              </div>
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <div class="goods-model" v-if="Array.isArray(bindingGoods.bindGoods)">
          <span class="model" style="float:left;">捆绑商品：</span>
          <a-checkbox-group :value="detail.bindingGoods" @change="goodsChange" :disabled="goodsDetailStatus===1">
            <a-checkbox :value="goods.skuCode" v-for="goods in bindingGoods.bindGoods" :key="goods.skuCode">
              <div class="goods">
                <img v-if="goods.pic" :src="goods.pic" @error.once="moveErrorImg($event)" class="goods-img">
                <img v-else src="@assets/goods.png" class="goods-img">
                <div class="goods-msg">
                  <p>
                    {{ goods.skuCode }} {{ goods.skuModel }}  {{ goods.skuName }} x {{ goods.quantity }}
                  </p>
                </div>
              </div>
            </a-checkbox>

          </a-checkbox-group>
        </div>
        <div class="pick" v-if="goodsStockOut.length>0">
          <span class="model">出库方式： </span>
          <a-select v-model="shoppingTrolley.stockOut" style="width: 120px" @change="outboundChange" :disabled="goodsDetailStatus===1">
            <a-select-option :value="stockOut.code" v-for="stockOut in goodsStockOut" :key="stockOut.code">{{ stockOut.value }}</a-select-option>
          </a-select>
          <span class="model" v-if="isBaseStore">{{ shoppingTrolley.pickStoreCode==='shopping_stock_out:3' ? '送货厂家': '提货位置' }}</span>
          <a-select v-model="shoppingTrolley.pickStoreCode" v-if="isBaseStore" style="width: 200px" @change="pickupChange" :disabled="goodsDetailStatus===1">
            <a-select-option :value="baseStore.code" v-for="baseStore in goodsBaseStore" :key="baseStore.code">{{ baseStore.code }}-{{ baseStore.name }}</a-select-option>
          </a-select>
          <a-radio :checked="shoppingTrolley.ifInstall===1" :value="shoppingTrolley.ifInstall" :disabled="goodsDetailStatus===1" @click="installChange"><span>需要安装请勾选</span></a-radio>

          <span class="model">
            配送时间
            <a-date-picker
              showTime
              :disabled="goodsDetailStatus===1"
              :value="sendTime"
              :disabledDate="disabledDate"
              :disabledTime="disabledDateTime"
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择时间"
              :allowClear="false"
              @change="onTimeChange"
            />
          </span>

        </div>
      </div>

    </div>
    <a-tabs defaultActiveKey="1" @change="callback" class="detail-content">

      <a-tab-pane tab="基本信息" key="1">
        <div class="cont-left">
          <div class="coupon">
            <h3 class="title">顾客优惠券
              <span>(当前商品可用：{{ initPrice(maxUseAmount) }}； 使用合计：{{ initPrice(detail.eleRollCont) }})</span>
            </h3>
            <a-checkbox-group @change="eleRollChange" :value="detail.eleRoll" :disabled="goodsDetailStatus===1" v-if="customerCoupon.length>0">
              <a-checkbox :value="coupon.code" v-for="coupon in customerCoupon" :key="coupon.code">
                <div class="ele-roll">
                  <div class="rollpice">
                    {{ initPrice(coupon.couponAmount) }}
                  </div>
                  <p>{{ coupon.name }}</p>

                  <div class="rollmsg">
                    <span style="display: block;">
                      实用金额：{{ initPrice(coupon.couponUseAmount) }}
                    </span>
                    <span>有效期：{{ moment(coupon.couponStartTime).format("YYYY年MM月DD日") }}-{{ moment(coupon.couponEndTime).format("YYYY年MM月DD日") }}</span>
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
            <div class="not-data" v-else>
              <span>暂无可用优惠券</span>
            </div>
          </div>
          <div class="mall">
            <h3 class="title">商场优惠劵
              <span>(使用合计：{{ initPrice(couponsTotial) }})</span>
              <a-button
                type="primary"
                :disabled="Object.keys(goodsDetail).length===0|| goodsDetailStatus===1||this.shoppingTrolley.ifDeposit===1"
                @click="couponsModal=true"
                style="float:right;margin-top: 9px;margin-right: 10px;">添加</a-button>
            </h3>
            <ul v-if="couponsCheckList.length>0">
              <li v-for="(item,index) in couponsCheckList" :key="item.code">
                <div>
                  <!-- <span class="mall-name">{{ item.name==='0'?"A账户":item.name==='1'?"B账户":item.name==='2'?"厂家劵":item.name==='3'?"商家劵":"" }}</span> -->
                  <span>{{ item.title }}</span>
                  <span class="mall-price">
                    实用：{{ initPrice(item.price) }}
                    <a-button icon="delete" v-if="item.isAction" @click="delCoupons(index)">
                      <!-- <a-icon type="delete "@click="delCoupons(index)" /> -->
                    </a-button>

                  </span>
                </div>

              </li>
            </ul>
            <div class="not-data" v-else>
              <span>请点击添加按钮增加商场优惠券</span>
            </div>
          </div>
          <div class="full-return" :class="{active:this.detail.rule==='schedule_rule_define_schedule_type:2'}" @click="ruleHandler(singleSchedule.scheduleType)">
            <h3 class="title">单品满减</h3>
            <p v-if="Object.keys(singleSchedule).length>0">
              满
              {{ singleSchedule.reachAmount }}减 {{ singleSchedule.rateAmount }}
              <span @click.stop.prevent>
                实减：
                <a-input-number @click.stop.prevent :disabled="singleSchedule.ifChange==='0'||goodsDetailStatus!==0" :min="1" :max="singleSchedule.maxAmount" v-model="singleSchedule.actualAmount" />
              </span>

            </p>
            <div class="not-data" v-else>
              <span>
                暂无满减活动
              </span>
            </div>
          </div>
        </div>
        <div class="cont-right">
          <div class="schedule" :class="{active:this.detail.rule==='schedule_rule_define_schedule_type:3'}">
            <h3 class="title">单品满赠
              <span v-if="complimentary&&complimentary.length>0">(满{{ complimentary[0].standardAmount }}选赠以下商品)</span>
            </h3>
            <a-checkbox-group @change="auctionChange" :value="detail.auction" v-if="complimentary.length>0">
              <a-checkbox :value="schedule.skuCode" v-for="schedule in complimentary" :key="schedule.skuCode" :disabled="goodsDetailStatus===1">
                <div class="auction">
                  <!-- <img :src="schedule.picture" alt=""> -->
                  <img v-if="schedule.pic" :src="schedule.pic" @error.once="moveErrorImg($event)" class="goods-img">
                  <img v-else src="@assets/goods.png" class="goods-img">
                  <span>
                    {{ schedule.skuCode }} - {{ schedule.skuName }}
                    <span>x {{ schedule.skuQuantity }}</span>
                  </span>
                </div>
              </a-checkbox>
            </a-checkbox-group>
            <div class="not-data" v-else>
              <span>
                暂无可用赠品
              </span>
            </div>
          </div>

          <div class="schedule" >
            <h3 class="title">赠服务</h3>
            <a-checkbox-group @change="serveChange" :value="detail.serveChange" v-if="Object.keys(severCoupon).length>0">
              <a-checkbox :value="severEl.skuCode" v-for="(severEl,index) in severCoupon.details" :key="severEl.skuCode+index" :disabled="goodsDetailStatus===1">
                <div class="serve">
                  <div class="auctionmsg">
                    <img v-if="severEl.pic" :src="severEl.pic" @error.once="moveErrorImg($event)" class="goods-img">
                    <img v-else src="@assets/goods.png" class="goods-img">
                    <p>{{ severEl.skuName }} <span>x {{ severEl.quantity }}</span></p>
                    <span>有效期：{{ moment(severEl.startTime).format('YYYY-MM-DD') }}至{{ moment(severEl.endTime).format('YYYY-MM-DD') }} <span>
                      {{ initPrice(severEl.skuPrice) }}元</span></span>
                  </div>
                </div>
              </a-checkbox>
            </a-checkbox-group>
            <div class="not-data" v-else>
              <span>
                暂无可用赠服务
              </span>
            </div>
          </div>

          <div class="full-return" :class="{active:this.detail.rule==='schedule_rule_define_schedule_type:1'}" @click="ruleHandler(fullReturn.scheduleType)">
            <h3 class="title">单品满返</h3>
            <p v-if="Object.keys(fullReturn).length>0">
              满
              {{ fullReturn.reachAmount }}返 {{ fullReturn.rateAmount }}
              <span @click.stop.prevent>
                实返：
                <a-input-number
                  :disabled="fullReturn.ifChange ==='0'||goodsDetailStatus!==0"
                  :min="1"
                  :max="fullReturn.maxAmount"
                  v-model="fullReturn.actualAmount" />
              </span>
            </p>
            <div class="not-data" v-else>
              <span>
                暂无满返活动
              </span>
            </div>
          </div>
        </div>

      </a-tab-pane>
      <a-tab-pane tab="商品详情" key="2">Content of Tab Pane 2</a-tab-pane>
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

    <!-- 选择优惠劵 -->
    <a-modal
      title="商场优惠"
      v-model="couponsModal"
    >
      <a-form
        :form="form"
      >

        <a-form-item
          label="优惠名称："
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-select
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请选择优惠券/账户名称' }]}
            ]"
            placeholder="请选择优惠券/账户名称"
            @change="handleSelectChange"
          >
            <a-select-option v-for="(el,index) in couponsList" :value="el.code" :key="el.code" :disabled="deabledIndex.includes(index)">
              {{ el.name }}
            </a-select-option>

          </a-select>
        </a-form-item>
        <a-row style="padding-left: 29px;margin-bottom:24px;">
          <a-col :span="12">可用金额：{{ couponsPrice }}</a-col>
          <a-col :span="12" v-if="couponsPushAmount">提成：{{ couponsPushAmount }}</a-col>
        </a-row>
        <a-form-item
          label="实用："
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
        >
          <a-input-number
            width="100%"
            style="width: 100%;"
            v-decorator="[
              'price',
              {rules: [{ required: true, message: '请输入大于0的小于可用余额的整数' }]}
            ]"
            :min="0"
            placeholder="请输入大于0,小于可用余额的整数"
          />
        </a-form-item>
      </a-form>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="priceCancel">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" @click="handleOk">
          添加
        </a-button>
      </template>
    </a-modal>
    <!-- 添加顾客 -->
    <SelectCustomers :queryCustomerModal.sync="queryCustomerModal" :customerCode="customer.code" @closeCustomerModal="queryCustomerModal=false" @customer="getCustomer"></SelectCustomers>
    <!-- 商品选择 -->
    <a-modal
      title="选择商品"
      v-model="checkGoodsModal"
      :footer="null"
      :width="1280"
    >
      <div class="check-goods">
        <div class="components-input-demo-presuffix">
          <a-input placeholder="请输入商品名称/商品编码/规格型号" v-model="goodsName" @keyup.enter="onSearch" ref="userNameInput">
            <a-icon slot="prefix" type="search" />
            <a-icon v-if="goodsName" slot="suffix" type="close-circle" @click="emitEmpty" />
          </a-input>
        </div>
        <a-row class="list-box">
          <ul class="goods-list">
            <li v-for="(item, index) in goodsList" :key="index" @click="toGoodsDetail(item)">
              <img v-if="item.mainGoodsPic[0]" :src="item.mainGoodsPic[0]" @error.once="moveErrorImg($event)" >
              <img v-else src="@assets/goods.png">
              <div>
                <h6>{{ item.skuName }}</h6>
                <p>型号：{{ item.skuCode }}</p>
                <!-- <p v-if="item.counts">已销：{{ item.counts }}</p> -->
                <h6 class="price">{{ initPrice(item.unitPrice) }}</h6>

              </div>
              <div class="limit" v-if="item.ifLimit">
                <p>
                  限时抢购
                </p>
              </div>
            </li>
          </ul>
          <a-pagination showQuickJumper :defaultCurrent="page.currentPage" :total="page.total" :pageSize.sync="this.page.pageSize" @change="pageChange" />
        </a-row>
      </div>
    </a-modal>
    <a-modal
      title="待结算"
      v-model="notaccountModal"
      :footer="null"
      :width="1280"
    >
      <div class="store-goods">
        <a-tabs :defaultActiveKey="defaultActiveKey" @change="notcallback">
          <a-tab-pane tab="待结算" key="shopping_trolley_status:1">
            <a-row class="list-box">
              <ul class="goods-list">
                <li v-for="(item, index) in notaccountData" :key="index">
                  <div class="goods-msg">
                    <h2>
                      <span>{{ item.customerName }}  {{ item.customerTelephone }}</span>
                      <span>单号  {{ item.code }}</span>
                    </h2>
                    <img v-if="item.mainGoodsPic[0]" :src="item.mainGoodsPic[0]" @error.once="moveErrorImg($event)">
                    <img v-else src="@assets/goods.png">
                    <div>
                      <h5>{{ item.skuName }}</h5>
                      <p>型号：{{ item.skuModel }}</p>
                      <!-- <p v-if="item.counts">已销：{{ item.counts }}</p> -->
                      <h6 class="price">
                        <span>销售价：</span>
                        <span style="color:#303133;margin-right:10px;">{{ initPrice(item.skuUnitPrice) }}</span>
                        <span>结算价：</span>
                        <span style="color:#FF5533;">{{ initPrice(item.skuActualPrice) }}</span>
                      </h6>
                    </div>

                  </div>
                  <div class="goods-action" @click="deleteShoppingTrolley(item.code)">
                    <a-icon type="delete" />
                  </div>
                </li>
              </ul>
              <a-pagination showQuickJumper :defaultCurrent="notPage.currentPage" :total="notPage.total" :pageSize.sync="this.notPage.pageSize" @change="notPageChange" />
            </a-row>
          </a-tab-pane>
          <a-tab-pane tab="已结算" key="shopping_trolley_status:4">
            <a-row class="list-box">
              <ul class="goods-list">
                <li v-for="(item, index) in notaccountData" :key="index">
                  <div class="goods-msg">
                    <h2>
                      <span>{{ item.customerName }}  {{ item.customerTelephone }}</span>
                      <span>单号  {{ item.code }}</span>
                    </h2>
                    <img v-if="item.mainGoodsPic[0]" :src="item.mainGoodsPic[0]" @error.once="moveErrorImg($event)" >
                    <img v-else src="@assets/goods.png" >
                    <div>
                      <h5>{{ item.skuName }}</h5>
                      <p>型号：{{ item.skuModel }}</p>
                      <!-- <p v-if="item.counts">已销：{{ item.counts }}</p> -->
                      <h6 class="price">
                        <span>销售价：</span>
                        <span style="color:#303133;margin-right:10px;">{{ initPrice(item.skuUnitPrice) }}</span>
                        <span>结算价：</span>
                        <span style="color:#FF5533;">{{ initPrice(item.skuActualPrice) }}</span>
                      </h6>
                    </div>

                  </div>
                  <!-- <div class="goods-action" @click="deleteShoppingTrolley(item.code)">
                    <a-icon type="delete" />
                  </div> -->
                </li>
              </ul>
              <a-pagination showQuickJumper :defaultCurrent="notPage.currentPage" :total="notPage.total" :pageSize.sync="this.notPage.pageSize" @change="notPageChange" />
            </a-row>
          </a-tab-pane>
        </a-tabs>

      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import userPhoto from '@assets/goods.png'
import Amap from '@comp/Amap'
import SelectCustomers from './components/SelectCustomers'

export default {
    name: 'GoodsDetail',
    components: {
        SelectCustomers,
        Amap

    },
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
        },
        goodsDetailStatus: {
            type: Number,
            default: 0
        },
        orderCode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            customer: {},
            // 商品搜索
            goodsName: '',
            // 查询条件（商品code）
            skuCode: '',
            page: {
                currentPage: 1,
                pageSize: 15,
                total: 0
            },
            goodsList: [],
            // 商品选择对话框
            checkGoodsModal: false,
            // 待结算
            notaccountModal: false,
            notaccountData: [],
            defaultActiveKey: 'shopping_trolley_status:1',
            notPage: {
                currentPage: 1,
                pageSize: 14,
                total: 0
            },
            trolleyDetailCount: 0,
            top: 10,
            // 是否显示已选
            isCheckList: false,
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
            // 店长优惠劵
            coupons: {},
            // 单品集合
            singleScheduleList: [],
            // 满减
            singleSchedule: {},
            // 满返
            fullReturn: {},
            // 赠品
            complimentary: [],
            // 限价数据
            singleLimit: {},
            // 电子币
            customerCoupon: [],
            // 电子币可用额
            maxUseAmount: 0,
            // 服务劵
            severCoupon: {},
            // 延保服务
            warranty: [],
            // 查询厂家劵
            coupon: {},
            // 获取顾客对话框
            queryCustomerModal: false,
            // 活动倒计时
            endTimeH: '00',
            endTimeM: '00',
            endTimeS: '00',
            endTime: null,
            // 规格
            theGoodsModel: '',
            // 提交商品信息
            detail: {
                activity: false,
                // 价格
                price: 0,

                // 实际价格
                actualPrice: 0,
                // 数量
                quantity: 1,
                // 选择的捆绑商品
                bindingGoods: [],
                bindingGoodsLsit: [],

                // 选择的电子券
                eleRoll: [],
                eleRollCont: 0,
                eleRollCheck: [],
                // 规则选中
                rule: '',
                // 赠品选择
                auction: [],
                // 赠品选择中
                complimentaryCheck: [],
                // 服务劵选择
                serveChange: [],
                // 选中的服务劵
                serveChangeList: [],
                // 延保服务
                warranty: [],
                // 选中延保
                warrantyCheck: []

            },
            // 优惠小计
            // totialAmount: '',
            // 当笔使用
            userEmploy: [],

            // 优惠劵对话框
            couponsModal: false,
            couponsTotial: 0,
            couponsPrice: '',
            couponsPushAmount: '',
            couponsList: [
                {
                    name: 'A账户',
                    code: '0'
                },
                {
                    name: 'B账户',
                    code: '1'
                },
                {
                    name: '厂家券',
                    code: '2'
                },
                {
                    name: '商家券',
                    code: '3'
                }
            ],
            couponsCheckList: [],
            // 优惠总金额
            // totialAmount: 0,
            deabledIndex: [],
            formLayout: 'horizontal',
            form: this.$form.createForm(this),
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
                marketCouponAmount: '', // 商场劵可用额
                marketCouponUseAmount: '', // 实用额
                manufactorCouponAmount: '', // 厂家劵可用额
                manufactorCouponUseAmount: '', // 实用额
                ifInstall: 0, //  是否安装  0 否  1是
                sendTime: '', // 配送时间
                // aamount: null, // a 可用额
                // auseAmount: null, // a 实用额
                // bamount: null, // b可用额
                // bpushAmount: null, // B当笔提成
                // buseAmount: null, // B 实用额
                note: '', // 备注
                limitCode: '', // 限价限量
                couponCode: ''
            },
            sendTime: undefined, // 配送时间
            // 提交的 商品 信息
            shoppingTrolleySkuList: [],
            // 档期规则
            shoppingScheduleRuleList: [],
            //  '送货厂家: '/'提货位置：'  是否显示
            isBaseStore: false,
            activeKey: ['1', '2', '3', '4', '5', '6', '7'],
            customerCode: '',
            value: '',

            // 地址
            isAddressActive: -1,

            // 新增/编辑顾客信息标题
            addEditTitle: '',
            // 新增/编辑顾客信息标识
            addEditModal: false,
            loading: false,
            customerInfo: {},
            disableEdit: true,
            // 顾客表单
            userForm: this.$form.createForm(this),

            addEditUser: {},
            addedCustomerId: '',
            // 添加顾客标识
            isAdd: false,
            // 修改客户抽屉
            timeNum: 0,
            singleLimitShow: false

        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo']),
        // 优惠小计
        // totialAmount: function () {
        //     console.log(this.couponsTotial)
        //     // if (this.detail.rule) {

        //     // }
        //     return this.singleSchedule.actualAmount + this.fullReturn.actualAmount + this.couponsTotial
        // }
        totialAmount: function () {
            return this.detail.rule === 'schedule_rule_define_schedule_type:2'
                ? this.$math.add(this.singleSchedule.actualAmount, this.$math.add(this.couponsTotial, this.detail.eleRollCont, 2), 2)
                : this.detail.rule === 'schedule_rule_define_schedule_type:1'
                    ? this.$math.add(this.fullReturn.actualAmount, this.$math.add(this.couponsTotial, this.detail.eleRollCont, 2), 2) : this.$math.add(this.couponsTotial, this.detail.eleRollCont, 2)
        }
    },
    async mounted () {
        console.log(this.customer)
        this.skuCode = this.$props.goodsData.skuCode
        console.log(this.skuCode)
        // console.log(this.$math.add(1, 1, 1, 2))

        if (this.skuCode) {
            await this.getSkuDetail()
            await this.getGoodsDetail()
            await this.getGoodsModel()
            await this.getGoodsStockOut()
            await this.getCoupons()
            await this.getBindingGoods()
            await this.getSingleSchedule()
            await this.getSingleLimit(0)
            // await this.getCustomerAddress()
            // await this.getCustomerCoupon()
            if (this.customer.code && this.goodsDetail.skuCode) {
                await this.getCustomerCoupon()
            }
            await this.getSeverCoupon()
            await this.queryDefineBySkuInfo()
        }
        await this.queryTrolleyDetailCount()

        if (this.goodsDetailStatus !== 0) {
            await this.queryShoppingTrolley()
        }
    },
    beforeDestroy () {
        console.log('ssssss')
        console.log(this.endTime)
        this.queryCustomerModal = false
        clearInterval(this.endTime)
    },
    watch: {
    // checkGoodsModal (newData) {
    //     if (!newData) {
    //         this.goodsName = ''
    //     }
    // },
        'shoppingTrolley.pickStoreCode': function (newData) {
            if (newData) {
                console.log(newData)
                if (this.goodsDetail.ifStock === '1') {
                    this.queryStockInfo(newData)
                }
            }
        },
        'shoppingTrolley.stockOut': async function (newData, oldData) {
            console.log(newData)
            // 现场提货
            if (newData === 'shopping_stock_out:1') {
                this.isBaseStore = false
                await this.queryStockInfo(this.storeInfo.code)
                this.shoppingTrolley.pickStoreCode = this.storeInfo.code
                // 集中配送
            } else if (newData === 'shopping_stock_out:2') {
                await this.getBaseStore()
                this.isBaseStore = true
                await this.queryStockInfo(this.shoppingTrolley.pickStoreCode)

                // 厂家送货
            } else if (newData === 'shopping_stock_out:3') {
                await this.getProvider()
                this.isBaseStore = true
                await this.queryStockInfo(this.shoppingTrolley.pickStoreCode)
            }
        },
        'detail.actualPrice': {

            handler (newData, oldeDate) {
                console.log(newData)
                if (newData) {
                    this.shoppingTrolleySkuList[0].actualPrice = newData
                    if (this.coupon.manufacturerCouponAmount !== 0) {
                        const index = this.deabledIndex.indexOf(2)
                        console.log(index)
                        this.$delete(this.deabledIndex, index)// vue方法
                        this.couponsCheckList.forEach((el, index) => {
                            if (parseInt(el.name) === 2) {
                                this.$delete(this.couponsCheckList, index)// vue方法
                            }
                        })
                    }
                    if (this.coupon.marketCouponAmount !== 0) {
                        const index = this.deabledIndex.indexOf(3)
                        console.log(this.deabledIndex)
                        console.log(index)
                        this.$delete(this.deabledIndex, index)// vue方法
                        this.couponsCheckList.forEach((el, index) => {
                            if (parseInt(el.name) === 3) {
                                this.$delete(this.couponsCheckList, index)// vue方法
                            }
                        })
                    }
                    if (this.coupons.acanUse !== 0) {
                        const index = this.deabledIndex.indexOf(0)
                        console.log(this.deabledIndex)
                        console.log(index)
                        this.$delete(this.deabledIndex, index)// vue方法
                        this.couponsCheckList.forEach((el, index) => {
                            if (parseInt(el.name) === 0) {
                                this.$delete(this.couponsCheckList, index)// vue方法
                            }
                        })
                    }
                    if (this.coupons.bcanUse !== 0) {
                        const index = this.deabledIndex.indexOf(1)
                        console.log(this.deabledIndex)
                        console.log(index)
                        this.$delete(this.deabledIndex, index)// vue方法
                        this.couponsCheckList.forEach((el, index) => {
                            if (parseInt(el.name) === 1) {
                                this.$delete(this.couponsCheckList, index)// vue方法
                            }
                        })
                    }
                    // this.couponsCheckList = []
                    // this.deabledIndex = []
                    console.log('商家劵', this.couponsCheckList, this.deabledIndex)

                    console.log(this.customer.code, this.skuCode)
                }
            },
            deep: true
        },
        'detail.price': function (newData, oldData) {
            console.log(newData)
            // this.getCoupons()
            // this.detail.actualPrice = this.detail.price * this.detail.quantity
            this.shoppingTrolleySkuList[0].actualPrice = this.detail.actualPrice
        },
        'detail.quantity': function (newData, oldData) {
            console.log(newData)
            // this.getCoupons()
            // this.detail.actualPrice = this.detail.price * this.detail.quantity
            this.shoppingTrolleySkuList[0].quantity = newData
            this.shoppingTrolleySkuList[0].actualPrice = this.detail.actualPrice
            if (this.customer.code && this.skuCode) {
                this.getCustomerCoupon()
            }
            this.getBindingGoods()
            this.getCoupons()
            this.getSingleSchedule()
            this.getSeverCoupon()
        },
        // currentCustomer(newData){
        //     debugger
        //     console.log(newData);

        //     if (this.skuCode) {
        //             this.getCustomerCoupon()
        //         }
        //     // this.getCoupons()
        //     // this.detail.actualPrice = this.detail.price * this.detail.quantity
        // },
        customer: {
            handler (newData, oldeDate) {
                console.log(newData)
                if (newData.code && this.skuCode) {
                    this.getCustomerCoupon()
                }
            },
            deep: true
            // this.getCoupons()
            // this.detail.actualPrice = this.detail.price * this.detail.quantity
        },
        'goodsData.skuCode': async function (newData) {
            console.log(newData)
            this.skuCode = newData
            await this.reloadDefaultData()
            await this.getSkuDetail()
            await this.getGoodsDetail()
            await this.getGoodsModel()
            await this.getGoodsStockOut()
            await this.getCoupons()
            await this.getSingleLimit()
            await this.getBindingGoods()
            await this.getSingleSchedule()
            // await this.getCustomerAddress()
            if (this.customer.code && this.skuCode) {
                await this.getCustomerCoupon()
            }
            await this.getSeverCoupon()
            await this.queryDefineBySkuInfo()
            await this.queryTrolleyDetailCount()
            // handler () {

            // },
            // deep: true
        },
        couponsCheckList: function (newData) {
            console.log(newData)
            let price = 0
            // if (this.detail.rule==='schedule_rule_define_schedule_type:2') {
            //     price=price+
            // }
            newData.forEach(el => {
                console.log(el.price)
                price = this.$math.add(price, el.price, 2)
                console.log(price)
            })
            this.couponsTotial = price
        },
        'detail.activity': function (newData) {
            console.log('是否抢购', newData)

            if (newData) {
                console.log(this.coupons)
                console.log(this.coupon)

                // if (this.coupons.acanUse !== 0) {
                //     const values = {}
                //     this.shoppingTrolley.aamount = this.coupons.acanUse
                //     this.shoppingTrolley.auseAmount = this.coupons.acanUse
                //     values.title = 'A账户'
                //     values.code = '0'
                //     values.price = this.coupons.acanUse
                //     this.deabledIndex.push(0)
                //     this.couponsCheckList.push(values)
                // }
                // if (this.coupons.bcanUse !== 0) {
                //     const values = {}
                //     this.shoppingTrolley.bamount = this.coupons.bcanUse
                //     this.shoppingTrolley.bpushAmount = this.coupons.bpushAmount
                //     this.shoppingTrolley.buseAmount = this.coupons.bcanUse
                //     values.title = 'B账户'
                //     values.code = '1'
                //     values.price = this.coupons.bcanUse

                //     this.deabledIndex.push(1)
                //     this.couponsCheckList.push(values)
                // }
                if (this.coupon.manufacturerCouponAmount !== 0 && this.deabledIndex.indexOf(2) === -1) {
                    const values = {}
                    this.shoppingTrolley.manufactorCouponAmount = this.coupon.manufactorCouponAmount
                    this.shoppingTrolley.manufactorCouponUseAmount = this.coupon.manufactorCouponAmount
                    values.title = '厂家券户'
                    values.isAction = false
                    values.name = '2'
                    values.price = this.coupon.marketCouponAmount

                    this.deabledIndex.push(2)
                    this.couponsCheckList.push(values)
                }
                if (this.coupon.marketCouponAmount !== 0 && this.deabledIndex.indexOf(3) === -1) {
                    const values = {}
                    this.shoppingTrolley.marketCouponAmount = this.coupon.marketCouponAmount

                    this.shoppingTrolley.marketCouponUseAmount = this.coupon.marketCouponAmount
                    values.title = '商家券'
                    values.isAction = false
                    values.name = '3'
                    values.price = this.coupon.marketCouponAmount

                    // this.deabledIndex.push(1)
                    this.deabledIndex.push(3)

                    this.couponsCheckList.push(values)
                }
            } else {
                // if (condition) {

                // }
                // if (this.coupon.manufacturerCouponAmount !== 0) {
                //     const index = this.deabledIndex.indexOf(2)
                //     console.log(index)
                //     this.$delete(this.deabledIndex, index)// vue方法
                //     this.couponsCheckList.forEach((el, index) => {
                //         if (parseInt(el.code) === 2) {
                //             this.$delete(this.couponsCheckList, index)// vue方法
                //         }
                //     })
                // }
                // if (this.coupon.marketCouponAmount !== 0) {
                //     const index = this.deabledIndex.indexOf(3)
                //     console.log(this.deabledIndex)
                //     console.log(index)
                //     this.$delete(this.deabledIndex, index)// vue方法
                //     this.couponsCheckList.forEach((el, index) => {
                //         if (parseInt(el.code) === 3) {
                //             this.$delete(this.couponsCheckList, index)// vue方法
                //         }
                //     })
                // }
                // this.couponsCheckList = []
                // this.deabledIndex = []
            }
            if (this.customer.code && this.skuCode) {
                this.getCustomerCoupon()
            }
            this.getBindingGoods()
            this.getCoupons()
            this.getSingleSchedule()
            this.getSeverCoupon()
            this.queryDefineBySkuInfo()
        }

    },

    methods: {
        moment,

        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        fomatFloat (x) {
            var f = parseFloat(x)
            if (isNaN(f)) {
                return
            }
            f = Math.round(x * 100) / 100
            return f
        },
        returnDE (value) {
            console.log(value)
            this.fullReturn.actualAmount = value
        },
        // 实际价格小于限价时提示
        async priceMin (e) {

            // await this.getSingleLimit()
        },
        async priceMax () {
            console.log(parseInt(this.detail.actualPrice))
            // if (!e) {
            //     this.detail.actualPrice=
            // } else {
            // this.detail.actualPrice = e ? e.toFixed(2) : this.goodsDetail.unitPrice.toFixed(2) || '0.00'
            this.detail.actualPrice = this.detail.actualPrice ? this.fomatFloat(this.detail.actualPrice) : this.fomatFloat(this.goodsDetail.unitPrice)
            // }
            // 是否定金销售
            // if (this.shoppingTrolley.ifDeposit === 1) {
            //     return
            // }
            if (this.goodsDetail.priceMin !== 0 && this.detail.actualPrice < this.goodsDetail.priceMin) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `实际金额不能小于最低限价￥${this.goodsDetail.priceMin}`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                this.detail.actualPrice = this.goodsDetail.priceMin
            }
            if (this.skuCode) {
                // await this.getCoupons()
                // await this.getSeverCoupon()
                // await this.queryDefineBySkuInfo()
                // await this.getSingleSchedule()
                // await this.reloadDefaultData()
                this.couponsPrice = ''
                this.detail.rule = ''
                this.detail.auction = []
                this.detail.eleRoll = []
                this.detail.eleRollCont = 0
                this.detail.eleRollCheck = []
                this.detail.serveChange = []
                this.detail.serveChangeList = []
                this.detail.warranty = []
                this.detail.warrantyCheck = []
                await this.getCoupons()
                await this.getSingleSchedule()
                await this.getSingleLimit()
                await this.getSeverCoupon()
                await this.queryDefineBySkuInfo()
                if (this.customer.code && this.skuCode) {
                    await this.getCustomerCoupon()
                }
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `选择商品`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
            if (this.detail.actualPrice > this.goodsDetail.unitPrice && this.shoppingTrolley.ifDeposit === 1) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `定金价格不能大于商品销售价格`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                this.detail.actualPrice = this.goodsDetail.unitPrice
            }
        },
        // 查询
        async queryShoppingTrolley () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryShoppingTrolley',
                method: 'POST',
                body: {
                    code: this.goodsData.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.shoppingTrolley = res.data.shoppingTrolley
                this.detail.activity = !!this.shoppingTrolley.limitCode
                this.detail.warranty[0] = [this.shoppingTrolley.acppId]
                this.sendTime = moment(this.shoppingTrolley.sendTime)
                if (this.shoppingTrolley.auseAmount > 0) {
                    const values = {
                        name: '0',
                        price: this.shoppingTrolley.auseAmount,
                        title: 'A账户',
                        isAction: true
                    }
                    this.couponsCheckList.push(values)
                }
                if (this.shoppingTrolley.buseAmount > 0) {
                    const values = {
                        name: '1',
                        price: this.shoppingTrolley.buseAmount,
                        title: 'B账户',
                        isAction: true
                    }
                    this.couponsCheckList.push(values)
                }
                if (this.shoppingTrolley.manufactorCouponUseAmount > 0) {
                    const values = {
                        name: '2',
                        price: this.shoppingTrolley.manufactorCouponUseAmount,
                        title: '厂家券',
                        isAction: !this.detail.activity
                    }
                    this.couponsCheckList.push(values)
                } if (this.shoppingTrolley.marketCouponUseAmount > 0) {
                    const values = {
                        name: '3',
                        price: this.shoppingTrolley.marketCouponUseAmount,
                        title: '商家券',
                        isAction: !this.detail.activity
                    }
                    this.couponsCheckList.push(values)
                }

                this.shoppingTrolleySkuList = [JSON.parse(JSON.stringify(res.data.shoppingTrolleySkuList))[0]]
                res.data.shoppingTrolleySkuList.forEach(el => {
                    if (el.ifGroupFlag === 1) {
                        this.detail.bindingGoods.push(el.code)
                    } else if (el.ifGroupFlag === 2) {
                        this.detail.auction = [el.code]
                    } else if (el.ifGroupFlag === 4) {
                        this.detail.serveChange.push(el.code)
                    }
                })
                this.detail.actualPrice = this.shoppingTrolleySkuList[0].actualPrice
                this.detail.quantity = this.shoppingTrolleySkuList[0].quantity
                this.detail.bindingGoodsLsit = this.bindingGoods.bindGoods.filter(el => {
                    return this.detail.bindingGoods.includes(el.skuCode)
                })
                console.log('查询单品满赠', this.complimentary)

                this.detail.complimentaryCheck = this.complimentary.filter(el => {
                    return this.detail.auction.includes(el.skuCode)
                })
                // this.detail.complimentaryCheck = this.complimentary.filter(el => {
                // // console.log(el)

                //     return el.skuCode === this.detail.auction[0]
                // })
                this.detail.serveChangeList = this.severCoupon.details.filter(el => {
                    return this.detail.serveChange.includes(el.skuCode)
                })
                // this.shoppingScheduleRuleList = res.data.shoppingScheduleRuleList
                this.detail.eleRoll = []
                this.detail.eleRollCheck = []
                res.data.shoppingScheduleRuleList.forEach(el => {
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        this.detail.rule = 'schedule_rule_define_schedule_type:2'
                    }
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:1') {
                        this.detail.rule = 'schedule_rule_define_schedule_type:1'
                    }
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:3') {
                        this.detail.rule = 'schedule_rule_define_schedule_type:3'
                    }
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:9') {
                        this.detail.eleRoll.push(el.code)
                        this.detail.eleRollCheck.push(el)
                    }
                })
                console.log(this.detail)
            }
        },
        // 待结算
        notaccountHandler () {
            this.notaccountModal = true
            this.getTrolleyDetail()
        },
        notcallback (value) {
            console.log(value)
            this.defaultActiveKey = value
            this.getTrolleyDetail()
        },
        // ShoppingTrolleyQueryTrolleyDetailCount
        // 查询待结算数量
        async queryTrolleyDetailCount () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryTrolleyDetailCount',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code

                }
            })
            if (res.flag === 1) {
                this.trolleyDetailCount = res.data
            }
        },
        notPageChange (currentPage) {
            this.notPage.currentPage = currentPage
            this.getTrolleyDetail()
        },
        // 删除待计算
        async deleteShoppingTrolley (code) {
            const res = await axios({
                path: 'ShoppingTrolleyDeleteShoppingTrolley',
                method: 'POST',
                body: {
                    ids: [code]

                }
            })
            if (res.flag === 1) {
                this.queryTrolleyDetailCount()
                this.getTrolleyDetail()
            }
        },
        // 查询待结算、已结算
        async getTrolleyDetail () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryTrolleyDetail',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    status: this.defaultActiveKey,
                    page: this.notPage.currentPage,
                    rows: this.notPage.pageSize
                }
            })
            if (res.flag === 1) {
                if (res.data.list.length > 0) {
                    this.notaccountData = res.data.list
                    this.notaccountData.forEach(item => {
                        const pic = item.skuPicture ? item.skuPicture.split(',') : ['']
                        item.mainGoodsPic = pic
                    })
                    this.notPage.total = res.data.total
                    this.notPage.currentPage = res.data.pageNum
                } else {
                    this.notaccountData = []
                    this.notPage.currentPage = 1
                    this.notPage.total = 0
                }
            }
        },

        // 商品
        emitEmpty () {
            this.$refs.userNameInput.focus()
            this.goodsName = ''
        },
        async toGoodsDetail (goodsInfo) {
            console.log(goodsInfo)

            // this.$emit('activeComponent', 1)
            // this.$emit('updateData', { type: 0, data: goodsInfo })
            this.skuCode = goodsInfo.skuCode
            this.checkGoodsModal = false
            await this.reloadDefaultData()
            await this.getSkuDetail()
            await this.getGoodsDetail()
            await this.getGoodsModel()
            await this.getGoodsStockOut()
            await this.getCoupons()
            await this.getSingleLimit()
            await this.getBindingGoods()
            await this.getSingleSchedule()
            // await this.getCustomerAddress()
            if (this.customer.code && this.skuCode) {
                await this.getCustomerCoupon()
            }
            await this.getSeverCoupon()
            await this.queryDefineBySkuInfo()
            await this.queryTrolleyDetailCount()
            this.goodsName = ''
        },

        // 查询热门商品列表
        async getGoodsList () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryHotShopping',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    guiderCode: this.$store.getters.userInfo.code,
                    orderbyField: 'update_time desc',
                    page: this.page.currentPage,
                    rows: this.page.pageSize
                }
            })
            if (res.flag === 1) {
                if (res.data.list.length > 0) {
                    this.goodsList = res.data.list
                    this.goodsList.forEach(item => {
                        const pic = item.skuPicture ? item.skuPicture.split(',') : ['']
                        item.mainGoodsPic = pic
                    })
                    this.page.total = res.data.total
                    this.page.currentPage = res.data.pageNum
                } else {
                    this.goodsList = []
                    this.page.currentPage = 1
                    this.page.total = 0
                }
            }
        },
        pageChange (currentPage) {
            this.page.currentPage = currentPage
            this.getGoodsList()
        },
        checkGoodsHandler () {
            this.checkGoodsModal = true
            this.getGoodsList()
        },
        // 搜索商品
        onSearch (e) {
            const keyCode = window.event ? e.keyCode : e.which
            //  console.log('回车搜索',keyCode,e);
            if (keyCode === 13 && this.goodsName) {
                axios({
                    path: 'ShoppingTrolleyDetailsSelectProviderContractSkus',
                    method: 'POST',
                    body: {
                        storeCode: this.$store.getters.storeInfo.code,
                        skuName: this.goodsName,
                        page: this.page.currentPage,
                        rows: this.page.pageSize
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        if (res.data.list.length > 0) {
                            this.goodsList = res.data.list
                            this.goodsList.forEach(item => {
                                const pic = item.skuPicture ? item.skuPicture.split(',') : ['']
                                item.mainGoodsPic = pic
                            })
                            this.page.total = res.data.total
                            this.page.currentPage = res.data.pageNum
                        } else {
                            this.goodsList = []
                            this.page.currentPage = 1
                            this.page.total = 0
                        }
                    }
                })
            }
        },
        // 返回列表页
        back () {
            this.$emit('activeComponent', 1)
        },
        getCustomer (customer) {
            console.log(customer)
            this.shoppingTrolley.customerCode = customer.code
            this.shoppingTrolley.customerAddressId = customer.id
            this.shoppingTrolley.consigneeName = customer.name
            this.shoppingTrolley.consigneeTelephone = customer.telephone
            this.shoppingTrolley.consigneeAddress = customer.address
            this.shoppingTrolley.consigneeAddressDetail = customer.concatAddress
            this.shoppingTrolley.consigneeLongitude = customer.longitude
            this.shoppingTrolley.consigneeLatitude = customer.latitude
            customer.userName = this.customer.userName
            customer.userTelephone = this.customer.userTelephone
            this.customer = customer
            // this.$emit('updateCustomer', customer)
            // console.log(customer)
        },

        // 删除优惠
        delCoupons (index) {
            console.log(index)
            // console.log(this.couponsCheckList)
            const nameIndex = this.deabledIndex.indexOf(parseInt(this.couponsCheckList[index].name))
            if (this.couponsCheckList[index].name === '0') {
                this.$delete(this.shoppingTrolley, 'aamount')
                this.$delete(this.shoppingTrolley, 'auseAmount')

                // this.shoppingTrolley.aamount = 0
                // this.shoppingTrolley.auseAmount = 0
            } else if (this.couponsCheckList[index].name === '1') {
                this.$delete(this.shoppingTrolley, 'bamount')
                this.$delete(this.shoppingTrolley, 'bpushAmount')
                this.$delete(this.shoppingTrolley, 'buseAmount')

                // this.shoppingTrolley.bamount = 0
                // this.shoppingTrolley.bpushAmount = 0
                // this.shoppingTrolley.buseAmount = 0
            } else if (this.couponsCheckList[index].name === '2') {
                this.$delete(this.shoppingTrolley, 'manufactorCouponAmount')
                this.$delete(this.shoppingTrolley, 'manufactorCouponUseAmount')
                // this.shoppingTrolley.manufactorCouponAmount = 0
                // this.shoppingTrolley.manufactorCouponUseAmount = 0
            } else if (this.couponsCheckList[index].name === '3') {
                this.$delete(this.shoppingTrolley, 'marketCouponAmount')
                this.$delete(this.shoppingTrolley, 'marketCouponUseAmount')
                // this.shoppingTrolley.marketCouponAmount = 0
                // this.shoppingTrolley.marketCouponUseAmount = 0
            }
            this.$delete(this.couponsCheckList, index)// vue方法
            this.$delete(this.deabledIndex, nameIndex)// vue方法
        },
        handleOk (e) {
            e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    // console.log(title);
                    if (values.price <= 0) {
                        let secondsToGo = 3
                        const modal = this.$success({
                            title: '提示',
                            content: `实际金额不能小于0`
                        })
                        const interval = setInterval(() => {
                            secondsToGo -= 1
                        }, 1000)
                        setTimeout(() => {
                            clearInterval(interval)
                            modal.destroy()
                        }, secondsToGo * 1000)
                        return
                    }
                    if (values.price > this.couponsPrice) {
                        let secondsToGo = 3
                        const modal = this.$success({
                            title: '提示',
                            content: `实际金额不能大于可用金额`
                        })
                        const interval = setInterval(() => {
                            secondsToGo -= 1
                        }, 1000)
                        setTimeout(() => {
                            clearInterval(interval)
                            modal.destroy()
                        }, secondsToGo * 1000)
                        return
                    }
                    if (values.name === '0') {
                        this.shoppingTrolley.aamount = this.couponsPrice
                        this.shoppingTrolley.auseAmount = values.price
                        values.title = 'A账户'
                        values.isAction = true

                        this.deabledIndex.push(0)
                    } else if (values.name === '1') {
                        this.shoppingTrolley.bamount = this.couponsPrice
                        this.shoppingTrolley.bpushAmount = this.couponsPushAmount
                        this.shoppingTrolley.buseAmount = values.price
                        values.title = 'B账户'
                        values.isAction = true

                        this.deabledIndex.push(1)
                    } else if (values.name === '2') {
                        this.shoppingTrolley.manufactorCouponAmount = this.couponsPrice
                        this.shoppingTrolley.manufactorCouponUseAmount = values.price
                        values.title = '厂家券'
                        values.isAction = true

                        this.deabledIndex.push(2)
                        if (JSON.stringify(this.singleLimit) === '{}') {
                            this.shoppingTrolley.couponCode = this.coupon.manufacturerCouponCode
                        } else {
                            this.shoppingTrolley.couponCode = this.singleLimit.code
                        }
                    } else if (values.name === '3') {
                        this.shoppingTrolley.marketCouponAmount = this.couponsPrice
                        this.shoppingTrolley.marketCouponUseAmount = values.price
                        values.title = '商家券'
                        values.isAction = true
                        this.deabledIndex.push(3)
                        if (JSON.stringify(this.singleLimit) === '{}') {
                            this.shoppingTrolley.couponCode = this.coupon.manufacturerCouponCode
                        } else {
                            this.shoppingTrolley.couponCode = this.singleLimit.code
                        }
                    }
                    this.couponsCheckList.push(values)
                    this.form.resetFields()
                    this.couponsPushAmount = ''
                    this.couponsModal = false
                }
            })
        },
        priceCancel () {
            this.form.resetFields()
            this.couponsPushAmount = ''
            this.couponsModal = false
        },
        handleSelectChange (value) {
            console.log(value)
            if (value === '0') {
                this.couponsPrice = this.coupons.acanUse
                //    this.couponsPushAmount= this.coupons.acanUse
                this.couponsPushAmount = ''
            } else if (value === '1') {
                this.couponsPrice = this.coupons.bcanUse
                this.couponsPushAmount = this.coupons.bBushMoney
            } else if (value === '2') {
                this.couponsPrice = this.coupon.manufacturerCouponAmount
                this.couponsPushAmount = ''
            } else if (value === '3') {
                this.couponsPrice = this.coupon.marketCouponAmount
                this.couponsPushAmount = ''
            }
            console.log(this.couponsPrice)
        },
        showCheckList () {
            this.isCheckList = !this.isCheckList
        },
        // 选择 优惠活动
        updateActivity () {
            if (this.shoppingTrolley.ifDeposit === 0) {
                this.detail.activity = !this.detail.activity
                this.shoppingTrolley.limitCode = this.detail.activity ? this.singleLimit.defineCode : ''
                this.detail.actualPrice = this.detail.activity ? this.singleLimit.maxPrice : this.goodsDetail.unitPrice
            } else {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `您已选定金销售不能选择限时抢购`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        },
        // 选择商品规格
        async changeModel (event) {
            console.log(event.target.value)
            this.skuCode = event.target.value
            await this.reloadDefaultData()
            await this.getSkuDetail()
            await this.getGoodsDetail()
            await this.getGoodsModel()
            await this.getGoodsStockOut()
            await this.getCoupons()
            await this.getSingleLimit()
            await this.getBindingGoods()
            await this.getSingleSchedule()
            // await this.getCustomerAddress()
            if (this.customer.code && this.skuCode) {
                await this.getCustomerCoupon()
            }
            await this.getSeverCoupon()
            await this.queryDefineBySkuInfo()
            await this.queryTrolleyDetailCount()
        },
        warrantyHanler (event) {
            console.log(event)
            // this.warranty.forEach(el => {
            //     if (event === el.id) {
            //         this.detail.warrantyCheck = el
            //     }
            // })
            if (this.shoppingTrolley.ifDeposit === 1) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `您已选定金销售，不能选择延保服务`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (event.length > 1) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `延保服务只能选一个`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (event.length > 0) {
                const e = event[event.length - 1]
                this.detail.warrantyCheck = this.warranty.filter(el => {
                    return e.includes(el.id)
                })
                this.detail.warranty = event
            } else {
                this.detail.warranty = []
                this.detail.warrantyCheck = []
            }
        },
        // 选择出库方式
        outboundChange (value) {
            console.log(`selected ${value}`)
            // if (value) {

            // }
        },
        // 选择提货方式
        pickupChange (value) {
            console.log(`selected ${value}`)
            // if (this.goodsDetail.ifStock === '1') {
            //     this.queryStockInfo(value)
            // }
        },
        // 是否定金销售
        priceChange (e) {
            console.log(e)
            console.log(`checked = ${this.shoppingTrolley.ifDeposit}`)
            if (this.detail.activity) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `您已选定限时抢购，不能选择定金销售`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            this.shoppingTrolley.ifDeposit = !this.shoppingTrolley.ifDeposit ? 1 : 0
            if (this.shoppingTrolley.ifDeposit === 1) {
                this.reloadDefaultData(true)
                this.detail.actualPrice = this.goodsDetail.unitPrice
                if (this.coupons.acanUse === 0) {
                    this.deabledIndex.push(0)
                }
                if (this.coupons.bcanUse === 0) {
                    this.deabledIndex.push(1)
                }
                if (this.coupon.manufacturerCouponAmount === 0) {
                    this.deabledIndex.push(2)
                }
                if (this.coupon.marketCouponAmount === 0) {
                    this.deabledIndex.push(3)
                }
            }

            // else{
            //     await this.getCoupons()
            //     await this.getSeverCoupon()
            //     await this.queryDefineBySkuInfo()
            //     await this.getSingleSchedule()
            // }
            console.log(this.shoppingTrolley.ifDeposit)
        },
        // 是否安装
        installChange (e) {
            console.log(e)
            console.log(`checked = ${this.shoppingTrolley.ifInstall}`)

            this.shoppingTrolley.ifInstall = !this.shoppingTrolley.ifInstall ? 1 : 0
            console.log(this.shoppingTrolley.ifInstall)
        },
        // 选择配送时间
        onTimeChange (date, dateString) {
            console.log(date, dateString)
            this.sendTime = date
        },
        // 修改商品数量
        quantityChange (e) {
            console.log(`checked = ${e.target.checked}`)
        },
        callback (key) {
            console.log(key)
        },
        // 选择促销券
        eleRollChange (e) {
            console.log(e)
            // this.$math.mul(record.billPrice, record.billQuantity, 2) }
            if (this.ifDeposit()) {
                console.log('是否定金销售' + this.ifDeposit())
                this.detail.eleRoll = e
                this.detail.eleRollCheck = this.customerCoupon.filter(el => {
                    return e.includes(el.code)
                })
                this.detail.eleRollCont = 0
                this.customerCoupon.forEach(el => {
                    if (e.includes(el.code)) {
                        this.detail.eleRollCont = this.$math.add(this.detail.eleRollCont, el.couponAmount, 2)
                    }
                })
            }
            console.log(this.detail.eleRollCheck)

            // console.log('radio checked', e.target.value)
        },
        // 定金销售不能选择优惠等策略
        ifDeposit () {
            if (this.shoppingTrolley.ifDeposit === 1) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `定金销售不能选择商品优惠等`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return false
            } else {
                return true
            }
        },

        // 档期活动选择
        ruleHandler (type) {
            console.log(type)
            // console.log(!this.ifDeposit())

            if (!this.ifDeposit() || this.goodsDetailStatus === 1) {
                return
            }
            // if (type === 'schedule_rule_define_schedule_type:3' && this.complimentary.length === 0) {
            //     return false
            // }
            // if (type === 'schedule_rule_define_schedule_type:2' && this.singleSchedule === '{}') {
            //     return false
            // }
            // if (type === 'schedule_rule_define_schedule_type:1' && this.fullReturn === '{}') {
            //     return false
            // }
            if (typeof type === 'undefined') {
                return false
            }
            if (this.detail.rule === type) {
                this.detail.rule = ''
            } else {
                if (type !== 'schedule_rule_define_schedule_type:3') {
                    this.detail.auction = []
                    this.detail.complimentaryCheck = []
                }
                this.detail.rule = type
                console.log(this.singleScheduleList.filter(el => {
                    console.log(el)

                    return el.scheduleType === this.detail.rule
                })[0])
            }
        },
        auctionChange (event) {
            console.log('radio checked', event)
            if (this.shoppingTrolley.ifDeposit === 1) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `您已选定金销售，不能选择赠品`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (event.length > 1) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `赠品只能选一个`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (event.length > 0) {
                const e = event[event.length - 1]
                this.detail.complimentaryCheck = this.complimentary.filter(el => {
                    return e.includes(el.skuCode)
                })
                this.detail.auction = event
                this.detail.rule = 'schedule_rule_define_schedule_type:3'
            } else {
                this.detail.auction = []
                this.detail.complimentaryCheck = []
                this.detail.rule = ''
            }

            // this.detail.complimentaryCheck = this.complimentary.filter(el => {
            //     console.log(el)

            //     return el.skuCode === e.target.value
            // })
            console.log(this.detail.complimentaryCheck)
        },
        // 服务劵选择
        serveChange (e) {
            console.log(e)
            // console.log(!this.ifDeposit())

            if (!this.ifDeposit()) {
                this.detail.serveChange = []
                return
            }
            this.detail.serveChange = e
            this.detail.serveChangeList = this.severCoupon.details.filter(el => {
                return e.includes(el.skuCode)
            })
            // console.log('radio checked', e.target.value)
        },
        // 选择捆绑商品
        goodsChange (e) {
            console.log(e)
            console.log(e.length, this.bindingGoods.bindNum)
            if (!this.ifDeposit()) {
                return
            }
            if (this.detail.activity) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: `已选择限量限价不能选择捆绑商品`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            // if (e.length === 0) {
            //     this.detail.actualPrice = this.goodsDetail.unitPrice
            //     console.log(this.detail.actualPrice)
            // }
            if (this.bindingGoods.bindNum === 0 || e.length <= this.bindingGoods.bindNum) {
                this.detail.bindingGoods = e
                this.detail.actualPrice = e.length !== 0 ? this.bindingGoods.mainSkuPrice : this.goodsDetail.unitPrice
            } else {
                let secondsToGo = 3
                const modal = this.$warning({
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
            this.detail.bindingGoodsLsit = this.bindingGoods.bindGoods.filter(el => {
                return this.detail.bindingGoods.includes(el.skuCode)
            })
            console.log(this.detail.bindingGoodsLsit)

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
                disabledMinutes: () => this.range(0, moment().minutes())
                // disabledSeconds: () => [0, 59]
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
                    code: this.skuCode
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
                    code: this.skuCode,
                    storeCode: this.storeInfo.code

                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.shoppingTrolleySkuList = []
                this.goodsDetail = res.data
                this.goodsDetail.pic = this.goodsDetail.picture ? this.goodsDetail.picture.split(',') : ['']
                this.goodsDetail.ifGroupFlag = 0
                this.goodsDetail.quantity = 1
                this.goodsDetail.unitPrice = this.fomatFloat(this.goodsDetail.unitPrice)
                this.shoppingTrolleySkuList.push(res.data)
                this.detail.actualPrice = this.goodsDetail.unitPrice
                this.detail.price = this.goodsDetail.unitPrice
                this.shoppingTrolley.ifInstall = parseInt(res.data.ifInstall)

                this.sendTime = moment(new Date()).add(1, 'days')
                console.log(moment(new Date()).add(1, 'days'))
            }
        },
        // 查询商品库存 （更换提货位置，选择现场提货）
        async queryStockInfo (code) {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryStockInfo',
                method: 'post',
                body: {
                    code: this.skuCode,
                    storeCode: code
                    // ifStock :"" //是否管库存
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsDetail.inventory = res.data.inventory
                this.goodsDetail.norNumber = res.data.norNumber
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
                    code: this.skuCode
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.goodsModel = res.data
                res.data.forEach(el => {
                    if (el.current) {
                        this.theGoodsModel = el.skuCode
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
                if (res.data.length > 0) {
                    res.data.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                    })
                    console.log('sssssssssss', this.goodsStockOut)
                    this.goodsStockOut = res.data
                    if (this.goodsStockOut.length > 1) {
                        this.shoppingTrolley.stockOut = this.goodsStockOut[0].code
                        if (this.shoppingTrolley.stockOut === 'shopping_stock_out:1') {
                            this.isBaseStore = false
                            this.queryStockInfo(this.storeInfo.code)
                            // 集中配送
                        } else if (this.shoppingTrolley.stockOut === 'shopping_stock_out:2') {
                            this.getBaseStore()
                            this.isBaseStore = true
                            // 厂家送货
                        } else if (this.shoppingTrolley.stockOut === 'shopping_stock_out:3') {
                            this.getProvider()
                            this.isBaseStore = true
                        }
                    }
                } else {
                    this.goodsStockOut = []
                }
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
                if (res.data.length > 0) {
                    this.goodsBaseStore = res.data
                    this.shoppingTrolley.pickStoreCode = this.goodsBaseStore[0].code
                } else {
                    this.goodsBaseStore = []
                }
            }
        },
        // 厂家送货时才有提货位置
        async getProvider () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryProviderBySku',
                method: 'post',
                body: {
                    code: this.skuCode
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                if (res.data.length > 0) {
                    this.goodsBaseStore = res.data
                    this.shoppingTrolley.pickStoreCode = this.goodsBaseStore[0].code
                } else {
                    this.goodsBaseStore = []
                }
            }
        },
        // 捆绑商品
        async getBindingGoods () {
            const res = await axios({
                path: 'GroupDefineQueryBindingGoods',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                if (res.data.bindGoods.length > 0) {
                    this.bindingGoods = res.data
                    if (this.bindingGoods.bindGoods) {
                        this.bindingGoods.bindGoods.forEach(el => {
                            const pic = el.skuUrl ? el.skuUrl.split(',') : ['']
                            // console.log(pic)
                            el.pic = pic[0]
                        })
                    }
                } else {
                    this.bindingGoods = {}
                }
            }
        },
        // 查询店长优惠券
        async getCoupons () {
            const res = await axios({
                path: 'CouponsUseGetCoupons',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code,
                    classCode: this.goodsDetail.classCode,
                    brandCode: this.goodsDetail.brandCode,
                    salesAmount: this.detail.actualPrice,
                    saleNum: this.detail.quantity
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                await this.setCoupons(res.data)
            }
        },
        async setCoupons (data) {
            this.coupons = data
            if (this.coupons.acanUse === 0) {
                this.deabledIndex.push(0)
            }
            if (this.coupons.bcanUse === 0) {
                this.deabledIndex.push(1)
            }

            console.log('优惠价', this.coupons)
        },
        // 单品接口
        async getSingleSchedule () {
            const res = await axios({
                path: 'ScheduRuleGetSingleSchedule',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code,
                    classCode: this.goodsDetail.classCode,
                    brandCode: this.goodsDetail.brandCode,
                    salesAmount: this.detail.actualPrice,
                    // salesAmount: '3000',
                    saleNum: this.detail.quantity
                }
            })
            if (res.flag === 1 && res.data && res.data.length > 0) {
                console.log(res.data)
                this.singleScheduleList = JSON.parse(JSON.stringify(res.data))
                // if (res.data.length === 0) {
                //     this.complimentary = []
                //     this.singleSchedule = []
                //     this.fullReturn = []
                // }
                this.complimentary = []
                this.singleSchedule = {}
                this.fullReturn = {}
                res.data.forEach((el, index) => {
                    if (el.scheduleType === 'schedule_rule_define_schedule_type:3') {
                        if (Array.isArray(el.gifts)) {
                            el.gifts.forEach(item => {
                                item.standardAmount = el.standardAmount
                                item.reachUnitPrice = el.reachUnitPrice
                                item.scheduleType = el.scheduleType
                                item.name = el.name
                                item.code = el.code + ':' + item.skuCode
                                item.pic = item.picture ? item.picture.split(',')[0] : ['']
                            })
                            //   this.complimentary = Object.assign({}, el.gifts)
                            this.complimentary = el.gifts
                        }
                    } else if (el.scheduleType === 'schedule_rule_define_schedule_type:2') {
                        // data[index].scheduleAmount = el.shouldRateAmount
                        // 满减

                        el.actualAmount = this.singleScheduleList[index].shouldRateAmount
                        // this.singleSchedule = Object.assign({}, el)
                        this.singleSchedule = el

                        // this.userEmploy.push({
                        //     title:`满${singleSchedule.reachAmount}减${singleSchedule.shouldRateAmount} 实减`,
                        //     price:""
                        // })
                    } else if (el.scheduleType === 'schedule_rule_define_schedule_type:1') {
                        // data[index].scheduleAmount = el.shouldRateAmount
                        // 满返
                        el.actualAmount = this.singleScheduleList[index].shouldRateAmount
                        // this.fullReturn = Object.assign(el)
                        this.fullReturn = el
                    }
                    console.log(this.complimentary, this.singleSchedule, this.fullReturn)
                })
            } else {
                this.complimentary = []
                this.singleSchedule = {}
                this.fullReturn = {}
            }
        },
        // 查询限价限量
        async getSingleLimit (state) {
            const res = await axios({
                path: 'ScheduleLimitQuerySingleLimit',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code,
                    // lowestPrice: '2000'
                    lowestPrice: this.goodsDetail.priceMin
                }
            })
            if (res.flag === 1 && res.data) {
                // if (res.data.manufacturerCouponAmount === 0 && res.data.marketCouponAmount === 0) {
                //     // await this.getCoupon()
                // } else {
                //     await this.setSingleLimit(res.data)
                // }

                await this.setSingleLimit(res.data)

                this.singleLimit = res.data
                const timeNum = moment(this.singleLimit.endTime).valueOf() - moment(Date.now()).valueOf()
                console.log('剩余时间', timeNum)

                this.singleLimitShow = timeNum > 0
                this.shoppingTrolley.limitCode = this.singleLimit.defineCode
                this.detail.actualPrice = state === 0 ? res.data.maxPrice : this.detail.actualPrice
                this.detail.activity = state === 0
                clearInterval(this.endTime)
                if (res.data && res.data.endTime) {
                    this.updatTime()
                }
            } else {
                this.singleLimit = {}
                this.singleLimitShow = false
                await this.getCoupon()
            }
        },
        setSingleLimit (data) {
            this.coupon.manufacturerCouponAmount = this.singleLimit.manufacturerCouponAmount
            this.coupon.marketCouponAmount = this.singleLimit.marketCouponAmount

            // this.shoppingTrolley.marketCouponAmount = res.data.marketCouponAmount // 商场劵可用额
            // this.shoppingTrolley.marketCouponUseAmount = 0// 实用额
            // this.shoppingTrolley.manufactorCouponAmount = res.data.manufactorCouponAmount // 厂家劵可用额
            // this.shoppingTrolley.manufactorCouponUseAmount = 0 // 实用额
            console.log(this.singleLimit)

            if (this.coupon.manufacturerCouponAmount === 0) {
                this.deabledIndex.push(2)
            }

            if (this.coupon.marketCouponAmount === 0) {
                this.deabledIndex.push(3)
            }
        },
        // 查询厂家劵
        async getCoupon () {
            const res = await axios({
                path: 'CouponQueryCouponBySku',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code,
                    brandCode: this.goodsDetail.brandCode,
                    actualPrice: this.detail.actualPrice,
                    quantity: this.detail.quantity

                }
            })

            if (res.flag === 1) {
                this.coupon = res.data

                if (this.coupon.manufacturerCouponAmount === 0) {
                    this.deabledIndex.push(2)
                }
                if (this.coupon.marketCouponAmount === 0) {
                    this.deabledIndex.push(3)
                }
                // this.detail.activity = true
                console.log(this.coupon)
            }
        },
        // 查询服务劵 schedule/service/queryServiceCouponBySkuInfo
        async getSeverCoupon () {
            const res = await axios({
                path: 'ScheduleServiceQueryServiceCouponBySkuInfo',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    brandCode: this.goodsDetail.brandCode,
                    storeCode: this.storeInfo.code,
                    unitPrice: this.detail.actualPrice
                    // 'unitPrice': 5000
                }
            })

            if (res.flag === 1) {
                console.log(res.data)
                if (res.data.details.length > 0) {
                    this.severCoupon = res.data
                    this.severCoupon.details.forEach(item => {
                        item.pic = item.picture ? item.picture.split(',')[0] : ['']
                    })
                    console.log(this.severCoupon)
                } else {
                    this.severCoupon = {}
                }
            }
        },
        // 延保服务劵
        async queryDefineBySkuInfo () {
            const res = await axios({
                path: 'AcppRuleDefineQueryDefineBySkuInfo',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    goodsType: this.goodsDetail.skuType,
                    storeCode: this.storeInfo.code,
                    // unitPrice: this.goodsDetail.unitPrice,
                    actualAmount: this.detail.actualPrice
                    // actualAmount: 1000
                }
            })

            if (res.flag === 1) {
                console.log(res.data)
                if (res.data.length > 0) {
                    this.warranty = res.data
                } else {
                    this.warranty = []
                }
            }
        },
        // 新增开单
        async addShoppingTrolley () {
            if (Object.keys(this.customer).length === 0 || !this.customer.code) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请选择顾客'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (this.shoppingTrolleySkuList.length < 1) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请选择商品'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            // if (this.goodsDetail.ifStock === '1' && this.goodsDetail.inventory === 0) {
            //     let secondsToGo = 3
            //     const modal = this.$warning({
            //         title: '提示',
            //         content: '商品库存不足'
            //     })
            //     const interval = setInterval(() => {
            //         secondsToGo -= 1
            //     }, 1000)
            //     setTimeout(() => {
            //         clearInterval(interval)
            //         modal.destroy()
            //     }, secondsToGo * 1000)
            //     // return
            // }
            // 判断出库方式为集中配送和厂家配送没有收货地址的不能提交
            if (this.shoppingTrolley.stockOut !== 'shopping_stock_out:1' && !this.shoppingTrolley.consigneeAddress) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '缺少收货地址,不能开票'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
                return
            }
            if (this.shoppingTrolley.ifDeposit === '0' && this.goodsDetail.ifStock === '1' && this.detail.quantity > this.goodsDetail.inventory) {
                // let secondsToGo = 3
                // const modal = this.$warning({
                //     title: '提示',
                //     content: '商品库存不足'
                // })
                // const interval = setInterval(() => {
                //     secondsToGo -= 1
                // }, 1000)
                // setTimeout(() => {
                //     clearInterval(interval)
                //     modal.destroy()
                // }, secondsToGo * 1000)
                this.$message.warning('商品库存不足')
            }

            const data = {
                shoppingTrolley: {},
                shoppingTrolleySkuList: [],
                shoppingScheduleRuleList: []
            }
            data.shoppingTrolleySkuList = JSON.parse(JSON.stringify(this.shoppingTrolleySkuList))
            // var eleRoll = []
            // var serveChange = []
            // 捆绑商品
            if (this.detail.bindingGoods.length > 0) {
                const goods = this.bindingGoods.bindGoods.filter(el => {
                    return this.detail.bindingGoods.includes(el.skuCode)
                })
                console.log(goods)

                const bindingGoods = goods.map(el => {
                    return {
                        unitPrice: el.price, // 零售价
                        actualPrice: el.price, // 实际售价 （自加）
                        quantity: el.quantity,
                        code: el.skuCode, // 商品编码
                        name: el.skuName, //
                        model: el.skuModel, // 规格型号
                        picture: el.skuUrl,
                        ifGroupFlag: 1
                    }
                })
                console.log(bindingGoods)
                data.shoppingTrolleySkuList.push(...bindingGoods)
            }
            // 单品
            if (this.detail.rule) {
                const actions = this.singleScheduleList.filter(el => {
                    console.log(el)

                    return el.scheduleType === this.detail.rule
                })[0]
                console.log(actions)

                const auction = {
                    scheduleRuleCode: actions.code, // 规则单号
                    scheduleRuleName: actions.name, // 名称
                    scheduleType: actions.scheduleType, // 类型
                    makeStoreCode: this.storeInfo.code, // 当前登录店
                    scheduleAmount: actions.actualAmount, // 实际金额
                    shouldScheduleAmount: actions.shouldRateAmount,
                    customerCouponCode: '', // 电子券code  （仅电子券）
                    rateProvider: actions.rateProvider, // 供应商分摊比例
                    rateProviderAmount: actions.scheduleType === 'schedule_rule_define_schedule_type:3' ? actions.shouldRateAmount : '' //  金额(赠品才有)
                }
                if (this.detail.rule === 'schedule_rule_define_schedule_type:1') {
                    console.log(this.fullReturn.actualAmount)

                    auction.scheduleAmount = this.fullReturn.actualAmount
                } else if (this.detail.rule === 'schedule_rule_define_schedule_type:2') {
                    console.log(this.singleSchedule.actualAmount)

                    auction.scheduleAmount = this.singleSchedule.actualAmount
                }
                data.shoppingScheduleRuleList.push(auction)

                if (this.detail.rule === 'schedule_rule_define_schedule_type:3' && this.detail.complimentaryCheck.length > 0) {
                    const complimentary = this.detail.complimentaryCheck[0]

                    const auctionGoods = [
                        {
                            unitPrice: complimentary.price, // 零售价
                            actualPrice: complimentary.price, // 实际售价 （自加）
                            quantity: complimentary.skuQuantity,
                            code: complimentary.skuCode, // 商品编码
                            name: complimentary.skuName, //
                            ifGroupFlag: 2,
                            model: complimentary.skuModel || '', // 规格型号
                            picture: complimentary.skuUrl || ''
                        }
                    ]
                    data.shoppingTrolleySkuList.push(...auctionGoods)
                }
            }
            // 服务劵选择
            if (this.detail.serveChange.length > 0) {
                const serve = {
                    scheduleRuleCode: this.severCoupon.define.code, // 规则单号
                    scheduleRuleName: this.severCoupon.define.name, // 名称
                    scheduleType: 'schedule_rule_define_schedule_type:10', // 类型
                    makeStoreCode: this.storeInfo.code // 当前登录店
                    // scheduleAmount: this.severCoupon.shouldRateAmount // 实际金额
                    // customerCouponCode: '', // 电子券code  （仅电子券）
                    // rateProvider: this.severCoupon.rateProvider, // 供应商分摊比例
                    // rateProviderAmount: this.severCoupon.scheduleType
                }
                data.shoppingScheduleRuleList.push(serve)

                const serveLsit = this.detail.serveChangeList.map(el => {
                    return {
                        unitPrice: el.skuPrice, // 零售价
                        actualPrice: el.skuPrice, // 实际售价 （自加）
                        quantity: el.quantity,
                        code: el.skuCode, // 商品编码
                        name: el.skuName, //
                        ifGroupFlag: 4,
                        model: el.skuModel, // 规格型号
                        picture: el.picture
                    }
                })
                data.shoppingTrolleySkuList.push(...serveLsit)
            }
            // 促销劵
            if (this.detail.eleRoll.length > 0) {
                const eleRollCheckList = this.detail.eleRollCheck.map(el => {
                    return {
                        scheduleRuleCode: el.useDefineCode, // 规则单号
                        scheduleRuleName: el.name, // 名称
                        scheduleType: 'schedule_rule_define_schedule_type:9', // 类型
                        makeStoreCode: this.storeInfo.code, // 当前登录店
                        scheduleAmount: el.couponUseAmount, // 实际金额
                        shouldScheduleAmount: el.couponAmount,
                        customerCouponCode: el.code // 电子券code  （仅电子券）
                        // rateProvider: el.rateProvider, // 供应商分摊比例
                    }
                })
                let scheduleAmount = 0
                let shouldScheduleAmount = 0
                this.detail.eleRollCheck.forEach(el => {
                    scheduleAmount = this.$math.add(scheduleAmount, el.couponUseAmount, 2)
                    shouldScheduleAmount = this.$math.add(shouldScheduleAmount, el.couponAmount, 2)
                })

                data.shoppingScheduleRuleList.push(...eleRollCheckList)
                // data.shoppingScheduleRuleList.push({
                //     scheduleRuleCode: this.detail.eleRollCheck[0].useDefineCode, // 规则单号
                //     scheduleRuleName: this.detail.eleRollCheck[0].name, // 名称
                //     scheduleType: 'schedule_rule_define_schedule_type:8', // 类型
                //     makeStoreCode: this.storeInfo.code, // 当前登录店
                //     scheduleAmount: scheduleAmount > this.detail.eleRollCheck[0].couponUseAmount ? this.detail.eleRollCheck[0].couponUseAmount : scheduleAmount, // 实际金额
                //     shouldScheduleAmount: shouldScheduleAmount,
                //     customerCouponCode: this.detail.eleRollCheck[0].code // 电子券code  （仅电子券）
                // })
            }
            // 延保服务
            if (this.detail.warranty.length > 0) {
                // const warranty = this.detail.warrantyCheck.map(el => {
                //     return {
                //         acppId: el.id // 零售价
                //     }
                // })
                this.shoppingTrolley.acppId = this.detail.warranty[0]
                // data.shoppingTrolleySkuList.push(...warranty)
            }

            // console.log()
            // 更新顾客信息
            this.shoppingTrolley.sendTime = this.sendTime._d
            this.shoppingTrolley.customerCode = this.customer.code
            this.shoppingTrolley.customerAddressId = this.customer.id
            this.shoppingTrolley.consigneeName = this.customer.name
            this.shoppingTrolley.consigneeTelephone = this.customer.telephone
            this.shoppingTrolley.consigneeAddress = this.customer.address
            this.shoppingTrolley.consigneeAddressDetail = this.customer.concatAddress
            this.shoppingTrolley.consigneeLongitude = this.customer.longitude
            this.shoppingTrolley.consigneeLatitude = this.customer.latitude
            const shoppingTrolley = this.shoppingTrolley
            shoppingTrolley.storeCode = this.storeInfo.code// 登录店
            shoppingTrolley.guideCode = this.userInfo.code // 登录账号
            shoppingTrolley.guideName = this.userInfo.name// 登录 姓名

            // console.log(bindingGoods)
            // console.log(auction)
            // console.log(this.shoppingTrolley)
            data.shoppingTrolley = shoppingTrolley
            console.log(data)

            const res = await axios({
                path: 'ShoppingTrolleyAddShoppingTrolley',
                method: 'post',
                body: data
            })

            if (res.flag === 1) {
                // this.coupon = res.data
                console.log(res.data)

                // this.shoppingTrolley
                // 初始化数据
                await this.reloadDefaultData()
                await this.getSkuDetail()
                await this.getGoodsDetail()
                await this.getGoodsModel()
                await this.getGoodsStockOut()
                await this.getCoupons()
                await this.getBindingGoods()
                await this.getSingleSchedule()
                await this.getSingleLimit(0)
                if (this.customer.code && this.skuCode) {
                    await this.getCustomerCoupon()
                }
                await this.getSeverCoupon()
                await this.queryDefineBySkuInfo()
                await this.queryTrolleyDetailCount()
            }
        },
        reloadDefaultData (ifDeposit) {
            this.detail = {
                activity: false,
                // 价格
                price: 0,
                // 实际价格
                actualPrice: 0,
                // 数量
                quantity: 1,
                // 选择的捆绑商品
                bindingGoods: [],
                bindingGoodsLsit: [],
                // 选择的电子券
                eleRoll: [],
                eleRollCont: 0,
                eleRollCheck: [],
                // 规则选中
                rule: '',
                // 赠品选择
                auction: [],
                // 赠品选择中
                complimentaryCheck: [],
                // 服务劵选择
                serveChange: [],
                // 选中的服务劵
                serveChangeList: [],
                // 延保服务
                warranty: [],
                // 选中延保
                warrantyCheck: []

            }
            this.couponsPrice = ''

            this.deabledIndex = []
            // 判断是否定金销售初始化数据
            if (!ifDeposit) {
                this.shoppingTrolley.ifDeposit = 0 // 是否定金销售  0 否  1是
                this.shoppingTrolley.stockOut = '' // 出库方式
                this.shoppingTrolley.pickStoreCode = '' //   提货位置
            }
            this.shoppingTrolley.marketCouponAmount = ''// 商场劵可用额
            this.shoppingTrolley.marketCouponUseAmount = '' // 实用额
            this.shoppingTrolley.manufactorCouponAmount = ''// 厂家劵可用额
            this.shoppingTrolley.manufactorCouponUseAmount = '' // 实用额
            this.shoppingTrolley.ifInstall = 0 //  是否安装  0 否  1是
            this.shoppingTrolley.limitCode = '' // 限价限量
            this.shoppingTrolley.couponCode = ''
            this.shoppingTrolley.aamount = null
            this.shoppingTrolley.auseAmount = null
            this.shoppingTrolley.bamount = null
            this.shoppingTrolley.bpushAmount = null
            this.shoppingTrolley.buseAmount = null
            this.couponsTotial = 0
            this.couponsPrice = ''
            this.couponsPushAmount = ''
            this.couponsCheckList = []
        },
        // 计算时间
        updatTime () {
            console.log('结束时间', this.singleLimit.endTime, moment(this.singleLimit.endTime).format('YYYY-MM-DD HH:mm:ss'))
            console.log('当前时间', new Date(), moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'))
            let timeNum = moment(this.singleLimit.endTime).valueOf() - moment(Date.now()).valueOf()
            // let timeNum = 60 * 1000 * 60
            //   this.timeNum = timeNum
            timeNum = parseInt(timeNum / 1000)
            // timeNum = 10
            // console.log(timeNum)

            this.endTime = setInterval(() => {
                timeNum = timeNum - 1
                // 时间转换
                // console.log(timeNum);

                if (timeNum > 0) {
                    this.filters(timeNum)
                } else {
                    this.detail.activity = false
                    this.singleLimitShow = false
                    clearInterval(this.endTime)
                    this.endTime = null
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
        // 查询电子劵
        async getCustomerCoupon () {
            const res = await axios({
                path: 'ScheduleCouponRuleDefineQueryCustomerCoupon',
                method: 'post',
                body: {
                    skuCode: this.skuCode,
                    storeCode: this.storeInfo.code,
                    brandCode: this.goodsDetail.brandCode,
                    skuQuantity: this.detail.quantity,
                    skuPrice: this.detail.actualPrice,
                    customerCode: this.customer.code
                    // customerCode: this.customer.code
                }
            })
            if (res.flag === 1 && res.data) {
                console.log(res.data)
                this.customerCoupon = res.data.coupons
                this.maxUseAmount = res.data.maxUseAmount
                if (this.goodsDetailStatus === 0) {
                    this.detail.eleRollCheck = this.customerCoupon.filter(el => {
                        return el.select
                    })
                    this.detail.eleRoll = this.customerCoupon.map(el => {
                        return el.code
                    })
                }
                this.detail.eleRollCont = 0
                this.customerCoupon.forEach(el => {
                    if (this.detail.eleRoll.includes(el.code)) {
                        this.detail.eleRollCont = this.$math.add(this.detail.eleRollCont, el.couponAmount, 2)
                    }
                })
            } else {
                this.customerCoupon = []
                this.maxUseAmount = 0
                this.detail.eleRollCont = 0
            }
        },
        /**
         * @name:查询顾客地址
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerAddress (id) {
            if (this.customer.id !== '' || id) {
                axios({
                    path: 'CustomerManageQueryUserAddress',
                    method: 'POST',
                    body: {
                        id: this.customer.id || id
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
                const customer = JSON.parse(JSON.stringify(customerInfo))
                this.customerInfo = customerInfo
                customer.concatAddress = customer.address + customer.addressDetail
                this.shoppingTrolley.customerCode = customerInfo.code
                this.shoppingTrolley.customerAddressId = customerInfo.id
                this.shoppingTrolley.consigneeName = customerInfo.name
                this.shoppingTrolley.consigneeTelephone = customerInfo.telephone
                this.shoppingTrolley.consigneeAddress = customer.address
                this.shoppingTrolley.consigneeAddressDetail = customer.addressDetail
                this.shoppingTrolley.consigneeLongitude = customerInfo.longitude
                this.shoppingTrolley.consigneeLatitude = customerInfo.latitude
                customer.userName = customerInfo.name
                customer.userTelephone = customerInfo.telephone
                this.customer = customer

                // this.$emit('updateCustomer', customer)
                // this.getCustomerCoupon()
                // this.userNameTel = customerInfo.telephone ? `${customerInfo.name}:${customerInfo.telephone}` : customerInfo.name
            } else {
                this.customerInfo = {}
                // this.userNameTel = '普通顾客'
                this.customer = {}
                // this.$emit('updateCustomer', {})
            }
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
                        // this.getCustomerAddress(data.id)
                        if (this.isAdd) {
                            // this.passUserInfo(data)
                            this.customer.code = data.code
                            this.customer.userName = data.name
                            this.customer.userTelephone = data.telephone
                            this.queryCustomerAddressList(data.code)
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
        // 查询地址
        queryCustomerAddressList (code) {
            console.log(code)

            axios({
                path: 'DistCustomerServiceFindCustomerAddressList',
                method: 'POST',
                body: {
                    customerCode: code || this.customerValue
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    if (res.data) {
                        // this.customerInfo = res.data
                        const data = res.data.filter(el => {
                            return el.isDefault === 1
                        })[0]
                        console.log(data)

                        data.code = code
                        this.passUserInfo(data)
                    } else {
                        this.customerInfo = []
                    }
                }
            })
        },
        /**
         * @name:新增/编辑用户提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            const self = this
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                console.log(err)

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

                    // this.userNameTel = `${values.name}:${values.telephone}`
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
                            if (res.data) {
                                const data = res.data

                                // this.passUserInfo(res.data)
                                this.customer.code = data.code
                                this.customer.userName = data.name
                                this.customer.userTelephone = data.telephone
                                this.queryCustomerAddressList(res.data.code)
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
            console.log(data)
            this.customerInfo.address = data.address
            this.userForm.setFieldsValue({
                'address': this.customerInfo.address
            })
            this.customerInfo.lat = data.position.lat
            this.customerInfo.lng = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
            console.log('用户地址信息：', this.customerInfo)
        },

        toSettle () {
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
@import "../../../../assets/modalStyle.less";
.goodsDetail{
    height: 100%;
    padding: 0 10px 30px;
    overflow-y: auto;
    .detail-header{
        width: 100%;
        overflow: hidden;
         >.back{
            height: 40px;
            margin-top: 10px;
            margin-right: 20px;
            float: left;
        }
    }
    .address.active{
        width: 100%;
    }
    .address{
        width: calc(100% - 102px);
        height:60px;
        background:rgba(255,255,255,1);
        float: left;
        >div{
            float: left;
            color: #606266;
        }
        .customer{
            height: 20px;
            line-height: 20px;
            margin: 20px;
        }
        .line{
            height: 20px;
            line-height: 20px;
            border-left: 1px solid #C0C4CC;
            margin: 20px 0;
        }
        .address-detail{
            // height: 20px;
            // line-height: 20px;
            // border-left: 1px solid #C0C4CC;
            // margin: 20px;
            height: 60px;

            margin-left: 0;
            padding-left: 20px;
            width: calc(100% - 670px);
            >div{
                display: table-cell;
                height: 60px;
                vertical-align: middle;
            }

        }
        .address-action{
            float: right;
            >.ant-btn{
                margin-top: 10px;
                height:40px;
                margin-right: 10px;
            }
            >.ant-btn.ant-btn-default{
                color: #1890FF;
                border-color: #1890FF;
            }

        }
    }
    .not-data{
        text-align: center;
        color: #909399;
        font-size: 14px;
        display: table-cell;
        height: calc(100% - 50px);
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
    }
    .goods-sub{
        width:100%;
        height:90px;
        background:rgba(255,255,255,1);
        box-shadow:0px -1px 14px 0px rgba(0,0,0,0.1);
        color: #606266;
        .goods-quantity{
            float: left;
            font-size: 12px;
            line-height: 90px;
            padding: 0 10px 0 20px;
            >span{
                margin-right: 10px;

            }
            .ant-input-number{
                margin-right: 10px;
            }
        }
        .goods-action{
            float: right;
            >*{
                float: left;
                height: 90px;
                // display: inline-block;
                line-height: 90px
            }
            >span{
                color: #909399;
                line-height: 70px;
            }
            .notaccount{
                background-color:#E6F7FF;
                color:#1890FF;
                width:180px;
                border-color: #E6F7FF;
            }
            .price{
                min-width: 150px;
                max-width: 196px;
                line-height: 30px;
                font-size: 12px;
                margin-right: 10px;
                cursor: pointer;
                .ant-input-number{
                    width: 100%;
                    height: 45px;
                    border: 1px solid #E1E4EB;
                    border-radius: 4px;
                    margin-top: 10px;
                }
                /deep/ .ant-input-number-input{
                    text-align: center;
                    font-size: 28px;
                    color: #FF5533;
                    line-height: 45px;
                    height: 45px;
                }
                .priceMin{
                    display: block;
                    color: #909399;
                    .anticon-up{
                        float: right;
                        line-height: 30px;
                    }
                    .anticon-down{
                        float: right;
                        line-height: 30px;
                    }
                }
            }
            .ant-radio-group{
                margin-right: 10px;
                color: #909399;
            }
        }

    }
    .goods-sub::after{
        content: '';
        clear: both;
    }
    .check-msg{
        width: 100%;
        // height: 100px;
        // line-height: 100px;
        background-color: #ffffff;
        font-size: 12px;
        padding: 0 10px;
        padding-top: 20px;
        margin-top: 10px;
        >p{
            display: inline-block;
            width: 100%;
            line-height: 30px;
            span{
                // float: left;
                display: inline-block;
                // border: 1px dashed #1890FF;dotted
                border: 1px dotted #1890FF;
                border-radius: 2px;
                height:24px;
                text-align: center;
                line-height: 24px;
                padding: 0 6px;
                color: #1890FF;
                margin-right: 10px;
            }
            .totial{
                float: right;
                font-size: 12px;
                color: #606266;
                border:none;
                >span{
                    font-size: 20px;
                    color: #FF5533;
                border:none;

                }
            }
        }
    }
    .goodshandle{
        background-color: #ffffff;
        margin-top:10px;
        overflow: hidden;
        clear: both;
        .ant-carousel{
            width: 260px;
            float: left;
            height: 260px;
            margin: 14px;
        }
        .ant-carousel /deep/ .slick-slide {
            text-align: center;
            height: 260px;
            overflow: hidden;
        }

        .ant-carousel /deep/ .slick-slide  .goods-img {
            width: 260px;
            height: 260px;
        }
        .handler{
            width: calc(100% - 288px);
            float: left;
            padding: 30px;
            .good-title{
                font-size: 18px;
                line-height: 44px;
                color: #303133;
                margin-bottom: 26px;
                // p{
                //     margin: 0;
                // }
            }
            .good-price{
                width: 100%;
                // overflow: hidden;
                .original-prcie{
                    float: left;
                    width: calc(40% - 6px);
                    margin-right: 6px;
                    background:rgba(245,247,250,1);
                    height: 60px;
                    border-radius:4px;
                    padding-left: 20px;
                    line-height: 60px;
                    >span{
                        color: #909399;
                        font-size: 12px;
                    }
                    .price{
                        font-size: 20px;
                        color:#FF5533;
                        display: inline-block
                    }
                    .price:first-letter{
                        font-size: 12px;
                    }
                }
                .actual-price{
                    float: left;
                    width: calc(60% - 6px);
                    margin-left: 6px;
                    height: 60px;
                    box-shadow:0px 0px 8px 0px rgba(144,147,153,0.2);
                    // box-shadow: 1px 2px 3px 0px rgba(144,147,153,1);
                    border-radius:4px;
                    position: relative;
                    font-size: 12px;
                    .check-activity{
                        // float: right;
                        // width:150px;
                        height:14px;
                        font-size:14px;
                        font-weight:400;
                        color:rgba(57,173,255,1);
                        line-height:14px;
                        cursor: pointer;
                        position: absolute;
                        right: 0;
                        top: -30px;
                    }
                    >span{
                        color: #909399;
                        font-size: 12px;
                    }
                    .activity{
                        background:rgba(245,247,250,1);
                        top: -36px;
                        position: absolute;
                        height: 36px;
                        width: 100px;
                        line-height: 36px;
                        text-align: center;
                    }
                    .activity::before{
                        position: absolute;
                        content: '';
                        z-index: 1;/*堆叠层推到宿主元素后面，避免遮住内容*/
                        // background:rgba(245,247,250,1);
                        border-width: 36px 36px 0 36px;
                        border-style: solid;
                        border-color: transparent transparent transparent rgba(245,247,250,1);
                        // border-radius:4px;
                        left: 100px;
                    }

                    .price{
                        font-size: 20px;
                        color:#FF5533;
                        display: inline-block;
                    }
                    .price::first-letter{
                        font-size: 12px;
                    }
                    .price-msg{
                        line-height: 60px;
                        display: flex;
                        justify-content:space-around;
                        cursor: pointer;
                    }

                    .time{
                        >span{
                            width:25px;
                            height:26px;
                            background:rgba(245,247,250,1);
                            border-radius:6px;
                            color: #909399;
                            display: inline-block;
                            text-align: center;
                            line-height: 26px;

                        }
                    }
                }
                .actual-price.active{
                        //
                    box-shadow:0px 0px 8px 0px rgba(24,144,255,0.2);

                    .activity{
                        background-color: #1890FF;
                        cursor: pointer;
                        color: #fff;
                    }
                    .activity::before{
                        border-color: transparent transparent transparent #1890FF;
                        cursor: pointer;

                    }
                    .time>span{
                        background-color: #E6F7FF;
                        color: #1890FF;
                    }
                }

            }
            .good-price:after{
                clear: both;
                content:"";
                display: block;
            }
            .goods-model{
                clear: both;
                margin-top: 14px;
                overflow: hidden;
                >span{
                    margin-right: 16px;
                    font-size: 14px;
                }
                .ant-radio-group{
                    float: left;
                    // width: (100% - 70px);
                }
                .ant-radio-button-wrapper{
                    border-radius: 4px;
                    margin-right: 12px;
                    height:62px;
                    // margin-bottom: 14px;
                    padding: 7px;
                }
                .ant-radio-button-wrapper-checked{
                    border-color: #1890FF;
                    color: #1890FF;
                    background:rgba(230,247,255,1);
                    border-radius: 4px;

                }
                /deep/.ant-select-selection.ant-select-selection--single{
                    border-radius: 0;
                    height:30px;
                }
                .ant-checkbox-wrapper{
                    float: left;
                    margin: 0;
                }
                .model-item{
                    .goods-img{
                        width:46px;
                        height:46px;
                    }
                    span{
                        display: inline-block;
                        margin: 0 10px;
                        height: 100%;
                        line-height: 46px;
                    }
                }

                 // 捆绑商品
                 .ant-checkbox-group{
                    float: left;
                    width: calc(100% - 90px);
                    /deep/ .ant-checkbox + span{
                        display: block;
                        padding: 0;
                    }
                 }
                /deep/ .ant-checkbox{
                     display: none;
                 }
                .goods{
                    overflow: hidden;
                    border-radius: 0;
                    margin-right: 12px;
                    height: 62px;
                    margin-bottom: 14px;
                    padding: 7px;
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    // width: 220px;
                    .goods-msg{
                        float: left;
                        // width:230px;
                        width: calc(100% - 60px);
                        // height:70px;
                        >p{
                            margin: 0;
                            color: #333333;
                            font-size: 14px;
                            line-height: 42px;
                        }
                    }
                    .goods-img{
                        float: left;
                        width:46px;
                        height:46px;
                        line-height: 70px;
                        margin-right: 14px;
                    }
                }
                .ant-checkbox-wrapper-checked .goods{
                    border-color: #1890FF;
                    color: #1890FF;
                    background: #e6f7ff;
                    .goods-msg{
                        float: left;
                        // width:230px;
                        // height:70px;
                        >p{
                            margin: 0;
                            color: #1890FF;
                            // font-size: 12px;
                        }
                    }
                }
            }
            .pick{
                clear: both;
                .model,.ant-radio-wrapper{
                    display: inline-block;
                    margin-left: 10px;
                    margin-right: 10px;
                }
                .model:first-child{
                    margin-left: 0;
                }
            }
        }
    }
    /deep/ .ant-tabs-nav-scroll{
        text-align: center;
        background-color: #F5F7FA;
        .ant-tabs-nav{
            height: 60px;
        }
        .ant-tabs-nav .ant-tabs-tab{
            padding: 18px 16px;
            font-size: 16px;
            color:#909399;
        }
    }
    .detail-content{
        background-color: #ffffff;
        .ant-tabs-tabpane {
            padding: 24px;
        }
        .ant-tabs-bar{
            margin: 0;
        }
        .cont-left{
            float: left;
            // width: 850px;
            width: calc(100% - 500px);
            margin-right: 20px;
        }
        .cont-right{
            float: left;
            // width: calc(100% - 870px);
            width: 480px;

        }
        .title{
            height: 50px;
            font-size: 16px;
            color: #606266;
            font-weight: inherit;
            line-height: 50px;
            background-color: #E1E4EB;
            padding-left: 20px;
            margin:0;
            >span{
                color: #909399;
                font-size: 14px;
                display: inline-block;
                margin-left: 14px;
            }

        }
        .coupon{
            // float: left;
            // width: 850px;
            width: 100%;
            height: 320px;
            border-radius:4px;
            margin-bottom: 20px;
            border:1px solid rgba(225,228,235,1);
            /deep/ .ant-checkbox{
                display: none;
            }
            .ant-checkbox-wrapper{
                /deep/ .ant-checkbox + span{
                    display: block;
                    background-color: rgba(24,144,255,0.09);
                    padding: 0;
                    // filter: blur(20px);
                }
            }
            .ant-checkbox-group{
                padding: 20px;
                height: 270px;
                overflow-y: auto;
                display: flex;
                flex-flow: wrap;
                justify-content: space-around;
                margin: auto;
                .ant-checkbox-wrapper:nth-child(3n+1){
                    margin-left: 0px;
                }
                .ant-checkbox-wrapper{
                    margin-left: 10px;
                }
            }
            // 电子劵
            .ele-roll{
                width:260px;
                height:130px;
                box-shadow:0px 2px 15px 0px rgba(24,144,255,0.15);
                font-size: 14px;
                background-image: url(../../../../assets/coupon.png);
                text-align: center;
                background-size: 100% 100%;
                margin-bottom: 20px;
                .rollpice{
                    font-size: 24px;
                    color: #1890FF;
                    height: 48px;
                    line-height: 48px;
                }
                >p{
                    font-size: 14px;
                    color: #1890FF;
                    height: 20px;
                    line-height: 20px;
                }
                .rollmsg{
                    color: #909399;
                    font-size: 12px;
                    height: 40px;
                    line-height: 20px;
                }
            }
            .ant-checkbox-wrapper-checked .ele-roll{
                background-image: url(../../../../assets/coupon-active.png);

            }
        }

        .schedule{
            // width: calc(100% - 870px);
            width: 100%;
            // float: left;
            // margin-left: 20px;
            height: 260px;
            border-radius: 4px;
            margin-bottom: 20px;
            border:1px solid rgba(225,228,235,1);

            /deep/ span.ant-radio + *{
                display: inline-block;
                width: 100%;
            }
            /deep/  .ant-radio{
                float: left;
                margin-top: 10px;
            }
            .ant-radio-group{
                padding: 0 20px;
                height: 210px;
                overflow-y: auto;
            }
            .goods-img{
                width: 36px;
                height: 36px;
                float: left;
            }
            .auction{
                // display: table-cell;
                // vertical-align: middle;
                    width: 100%;
                >span{
                    white-space: initial;
                    word-wrap: break-word;
                    /* line-height: 10px; */
                    /* display: table-cell; */
                    /* vertical-align: middle; */
                    line-height: 18px;
                    margin-left: 10px;
                    float: left;
                    width: calc(100% - 48px);
                    span{
                        float:right;
                    }
                }
            }
            .ant-radio-wrapper{
                padding: 14px 0;
                width: 100%;
                margin: 0;
            }
            .ant-radio-wrapper+.ant-radio-wrapper{
                border-top: 1px solid #F5F7FA;
            }
            .ant-checkbox-group{
                padding: 0 20px;
                height: 210px;
                overflow-y: auto;
                .ant-checkbox-wrapper{
                    width: 100%;
                    padding: 14px 0;
                    border-top: 1px solid #F5F7FA;
                }
                /deep/ .ant-checkbox{
                    float: left;
                    margin-top: 12px;
                }
                /deep/ .ant-checkbox + span{
                    display: inline-block;
                    width: calc(100% - 16px);
                }
                .serve{
                    display: inline-block;
                    width: 100%;
                }
                .ant-checkbox-wrapper + .ant-checkbox-wrapper{
                    margin-left: 0;
                }
                .auctionmsg{
                    display: inline-block;
                    width: 100%;
                    .goods-img{
                        margin-right: 10px;
                    }
                    p{
                        margin: 0;
                        width: calc(100% - 46px);
                        font-size: 14px;
                        float: left;
                        span{
                            color: #909399;
                            float: right;
                            font-size: 12px;

                        }
                    }
                    >span{
                        display: inline-block;
                        width: calc(100% - 46px);
                        color: #909399;
                        font-size: 12px;
                        span{
                            float: right;
                        }
                    }
                }
            }
        }
        .schedule.active{
            border-color: #1890FF;
        }
        .mall{
            // width: 850px;
            width: 100%;
            height: 200px;
            border-radius:4px;
            // float: left;
            border:1px solid rgba(225,228,235,1);
            margin-bottom: 20px;
            ul{
                margin: 0;
                padding: 20px;
                overflow: hidden;
                li{
                    list-style: none;
                    margin: 0;
                    width: 50%;
                    float: left;
                    height: 50px;
                    // line-height: 50px;
                    border-bottom:1px solid #F5F7FA;
                    >div{
                        height: 20px;
                        margin-top: 15px;
                        display: inline-block;
                        width: 100%;
                        padding-right: 20px;
                        .mall-name{
                            float: left;
                        }
                        .mall-price{
                            float: right;
                            .ant-btn-default{
                                color: #FF5533;
                                margin-left: 16px;
                                border:none;
                            }
                            .anticon-delete{
                                color: #FF5533;
                                margin-left: 16px;
                            }
                        }
                    }
                }
                li:nth-child(2n){
                    >div{
                        padding-left: 20px;
                        padding-right: 0px;
                        border-left: 1px solid #F5F7FA;
                    }
                }
            }
        }
        .full-return{
            width: 100%;
            height: 100px;
            border-radius:4px;
            border:1px solid rgba(225,228,235,1);
            p{
                height: 50px;
                line-height: 50px;
                margin: 0;
                padding:0 20px;
                span{
                    float: right;
                }
            }
        }
        .full-return.active{
            border-color: #1890FF
        }
    }
}
.check-goods{
    // height: 680px;
    overflow-y: auto;
    .components-input-demo-presuffix .anticon-close-circle {
        cursor: pointer;
        color: #ccc;
        transition: color 0.3s;
        font-size: 12px;
    }
    .components-input-demo-presuffix .anticon-close-circle:hover {
        color: #999;
    }
    .components-input-demo-presuffix .anticon-close-circle:active {
        color: #666;
    }
    .goods-list{
        // height: 630px;
        min-height: 350px;
        max-height: 500px;
        overflow: auto;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap:wrap;
        // justify-content:space-around;
        align-content: flex-start;
        cursor: pointer;
        >li:nth-child(3n+1){
            margin-left: 0;
        }
        >li:hover{
            border-color: #1890FF;
        }
        >li{
            list-style: none;
            padding: 0;
            margin: 0;
            width:400px;
            height:134px;
            border-radius:4px;
            border:1px solid rgba(192,196,204,1);
            margin-left: 10px;
            margin-top: 10px;
            padding:10px;
            position: relative;
            .limit{
                background-color: #FF5533;
                color: #ffffff;
                width:70px;
                height:24px;
                border-radius:4px 0px 4px 0px;
                text-align: center;
                line-height: 24px;
                position: absolute;
                left: 0;
                top: 0;
                font-size: 12px;
                margin: 0;
                p{
                    color: #ffffff;
                }
            }
            >img{
                width:110px;
                height:110px;
                float: left;
            }
            >div{
                width: 257px;
                float: left;
                margin-left: 10px;
                .price{
                    color: #FF5533;
                    font-size: 20px;
                }
                p{
                    color: #909399;
                    font-size: 12px;
                }
                h4{
                    font-size: 14px;
                    color: #303133;
                }
            }

        }

    }
    .ant-pagination {
        text-align: center;
        margin-top: 10px;
    }
}
.store-goods{
    // /deep/ .ant-tabs .ant-tabs-top-conten{
    //     min-height: 500px;
    //     overflow-y: auto;
    // }
    .list-box{
        min-height: 500px;
        overflow-y: auto;
    }
    .goods-list{
        min-height: 350px;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap:wrap;
        // justify-content:space-around;
        align-content: flex-start;
        cursor: pointer;
            >li{
                list-style: none;
                padding: 0;
                margin: 0;
                width:560px;
                height:160px;
                background:rgba(255,255,255,1);
                border-radius:4px;
                border:1px solid rgba(225,228,235,1);
                margin-left: 10px;
                margin-top: 10px;
                padding:10px;
                position: relative;
                .goods-msg{
                    width: 450px;
                    float: left;
                    >h2{
                        width:100%;
                        color: #909399;
                        font-size: 12px;
                        font-weight: inherit;
                        span{
                            display: inline-block;
                            width: 50%;
                        }
                        color: #909399;
                    }

                    >img{
                        width:103px;
                        height:103px;
                        float: left;
                    }
                    div{
                        float: left;
                        width: 300px;
                        margin-left: 10px;
                        p{
                            color: #909399;
                            font-size: 12px;
                        }
                        h4{
                            font-size: 14px;
                            color: #303133;
                        }

                        .price{
                            color: #909399;
                            font-size: 12px;
                            span{
                                display: inline-block;
                            }
                        }
                    }
                }
                .goods-msg{
                    width: 429px;
                    float: left;
                    height: 100px;
                    >div h5{
                        height: 48px;
                        line-height: 24px;
                        font-size: 14px;
                        color: #303133;
                    }
                    .anticon-delete{
                        color: #FF5533;
                        font-size: 18px;
                    }
                }
                .goods-action{
                    float: left;
                    width: 109px;
                    border-left: 1px solid #E1E4EB;
                    height: 109px;
                    margin-top: 16px;
                    line-height: 109px;
                    text-align: center;
                    color: #FF5533;
                    font-size: 18px;
                }

            }
    }
    .ant-pagination {
        text-align: center;
        margin-top: 10px;
    }
}
.box{
    height: 100%;
}
</style>

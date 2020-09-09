<!--
 * @Description: 结算
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-20 11:16:53
 * @LastEditors: haile
 * @LastEditTime: 2019-08-28 16:04:28
 -->
<template>
  <fullscreen
    ref="fullscreen"
    id="fullscreen"
    class="fullscreenClass"
    style="background-color:#f8f8f8;"
    @change="fullscreenChange">
    <div class="settle-box" @keydown.tab="tabHandler($event)" @keydown.space="spaceHandler($event)" @keydown.up="currentIndex--" @keydown.down="currentIndex++">
      <!-- 顶部 -->
      <div class="header">
        <div class="full-toggle">
          <a-button style="margin: 5px 10px 0 0" shape="circle" :icon="fullscreen?'fullscreen-exit':'fullscreen'" @click="fullClick"/>
        </div>
        <div class="customer-info">
          <p> 顾客：{{ currentCustomer.customerName }}</p>
          <p>{{ currentCustomer.customerPhone }}</p>
        </div>
        <div class="search-box">
          <a-input-search
            placeholder="请输入顾客/单号(或扫描票据)"
            @search="onSearch"
            v-model="searchCondition"
            enterButton
            autoFocus
            size="large"
            ref="search-input"
            style="width:80%;margin-left:10%;margin-bottom:20px"/>
        </div>
        <a-button type="primary" @click="toOrderList">待结算</a-button>
      </div>
      <!-- 主体内容 -->
      <div class="main" ref="main">
        <div class="left">
          <!-- 交易记录 -->
          <div class="pay-record">
            <a-table rowKey="id" :columns="columns" :dataSource="dataSource" :pagination="false" :scroll="{ y: tbodyHeight}">
              <template slot="payTypeName" slot-scope="text">
                <div class="text-overflow">{{ text }}</div>
              </template>
              <template slot="referNumber" slot-scope="text">
                <div class="text-overflow">{{ text }}</div>
              </template>
            </a-table>
            <a-row style="margin:10px 0">
              <a-col :span="8">
                <a-select ref="payType" size="small" v-model="pay.payType" style="width:90%">
                  <a-select-option :value="1">微信</a-select-option>
                  <a-select-option :value="2">支付宝</a-select-option>
                  <a-select-option :value="0">现金</a-select-option>
                  <a-select-option :value="3">新百卡</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="8"></a-col>
              <a-col :span="8">
                <a-input
                  :disabled="pay.disabled"
                  @pressEnter="wzPayHandle(pay.payType)"
                  ref="payNum"
                  size="small"
                  v-model="wzPay.wzAmount" />
              </a-col>
            </a-row>
          </div>
          <!-- 减免金额 -->
          <div class="sub-amount">
            <p>
              <span>使用电子币：</span>
              <span>{{ initPrice(amountList.coinUsed) }}</span>
            </p>
            <p>
              <span>补贴促销券：</span>
              <span>{{ initPrice(amountList.subsidiesAmount) }}</span>
            </p>
          </div>
          <!-- 金额列表 -->
          <div class="amount-list">
            <p>
              <span>原价金额：</span>
              <span>{{ initPrice(amountList.originalAmount) }}</span>
            </p>
            <p>
              <span>折扣金额：</span>
              <span>{{ initPrice(amountList.discountAmount) }}</span>
            </p>
            <p>
              <span>应收金额：</span>
              <span>{{ initPrice(amountList.shouldPayAmount) }}</span>
            </p>
            <p>
              <span>实收金额</span>
              <span style="color:#408BFF">{{ initPrice(amountList.actualAmount) }}</span>
            </p>
            <a-divider />
            <p>
              <span>尾款金额</span>
              <span style="color:#FF2323;font-weight:700">{{ initPrice(amountList.balanceAmount) }}</span>
            </p>
          </div>
          <!-- 快捷支付方式 -->
          <div class="pay-methods">
            <a-row>
              <a-col :span="8" v-for="(item, index) in payMethods" :key="index">{{ `${item.name} ${item.shortcuts}` }}</a-col>
            </a-row>
          </div>
        </div>
        <div class="center">
          <!-- 订单列表 -->
          <div class="order-list">
            <div class="list-header">
              <div></div>
              结算商品列表
            </div>
            <div class="list-content">
              <div class="list-item" v-for="(order, oi) in singleList" :key="oi">
                <div class="item-header">
                  <p>
                    <span>订单号：{{ order.code }}</span>
                    <span style="float: right;color: #FF2323;cursor: pointer;" :id="order.index" :class="{delActive: currentIndex === order.index}">删除</span>
                  </p>
                  <div class="goods-info">
                    <div class="img-box">
                      <img style="display:block;width:100%;height:auto;" v-if="order.skuInfo.mainGoodsPic[0]" :src="order.skuInfo.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="order.skuInfo.name">
                      <img style="display:block;width:100%;height:auto;" v-else src="@assets/goods.png" :alt="order.skuInfo.name">
                    </div>
                    <div class="detail-text">
                      <p style="font-weight: 700;">{{ order.skuInfo.name }} - {{ order.skuInfo.code }}</p>
                      <p>{{ order.skuInfo.model }}</p>
                      <p>数量：x{{ order.skuInfo.quantity }}</p>
                    </div>
                    <div class="service-list" v-if="order.acppDetails.length > 0">
                      <div v-for="(acpp, ai) in order.acppDetails" :key="ai">
                        <div class="triangle-topleft"></div>
                        【送】{{ acpp.acppTypeName }} {{ acpp.acppAmount }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-activity" v-if="!order.ifDeposit">
                  <div class="ele">
                    <div class="item-activity-name">
                      使用电子币：
                    </div>
                    <div class="item-activity-list">
                      <div v-if="order.electronic.length > 0">
                        <div class="ele">
                          <div v-for="(ele, ei) in order.electronic" :key="ei" class="ele-item">
                            <span>{{ ele.scheduleRuleDefineName }}</span>
                            <span>{{ initPrice(ele.actualAmount) }}</span>
                            <div class="triangle-topleft"></div>
                          </div>
                        </div>
                      </div>
                      <div v-else>暂无可用电子币</div>
                    </div>
                  </div>
                  <div class="other-all">
                    <div class="item-activity-name">
                      其他促销券：
                    </div>
                    <div class="item-activity-list">
                      <div class="promotion">
                        <div v-for="(promotion, pi) in order.promotionCoupons" :key="pi">
                          <span>{{ promotion.scheduleRuleName ? promotion.scheduleRuleName : '促销券' }}</span>
                          <span>{{ initPrice(promotion.scheduleAmount) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                        <div v-if="order.aUseAmount !== 0">
                          <span>A账户</span>
                          <span>{{ initPrice(order.aUseAmount) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                        <div v-if="order.bUseAmount !== 0">
                          <span>B账户</span>
                          <span>{{ initPrice(order.bUseAmount) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                        <div v-if="order.marketCouponAmount && order.marketCouponAmount !== 0">
                          <span>商场券</span>
                          <span>{{ initPrice(order.marketCouponAmount ? order.marketCouponAmount : 0) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                        <div v-if="order.manufacturerCouponAmount && order.manufacturerCouponAmount !== 0">
                          <span>厂家券</span>
                          <span>{{ initPrice(order.manufacturerCouponAmount ? order.manufacturerCouponAmount: 0) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                        <div v-if="order.reduceDefine && JSON.stringify(order.reduceDefine) !== '{}' ">
                          <span>满{{ order.reduceDefine.reachAmount }}减{{ order.reduceDefine.rateAmount }}</span>
                          <span>{{ initPrice(order.reduceDefine.actualAmount) }}</span>
                          <div class="triangle-topleft"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item-footer" :class="{'advance-footer': order.ifDeposit}">
                  <div v-if="!order.ifDeposit">共优惠：{{ initPrice(order.discountsAmount) }}</div>
                  <div v-else class="advance-sale">定金预售</div>
                  <div>销售价：<span style="display: inline-block;width: auto;color:#FF2323;font-size:14px;font-weight:700">{{ initPrice(order.shouldPay) }}</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 套购满免/满减 -->
          <div class="free-sub">
            <div class="activity-header">
              <div></div>
              套购活动列表
            </div>
            <a-row class="activity-content" :gutter="10">
              <a-col :span="12" v-if="freeList.length !== 0">
                <div
                  v-for="(freeItem, fi) in freeList"
                  :key="fi"
                  class="free-sub-item"
                  :class="{active: freeItem.isChoosePc && freeItem.isSingle, pending: currentIndex === freeItem.index}"
                  :id="freeItem.index"
                >
                  <div class="header" :class="{'header-active': freeItem.isChoosePc && freeItem.isSingle, 'pending-header': currentIndex === freeItem.index}">
                    {{ freeItem.title }}:【{{ toPercent(freeItem.exemptionRate) }}】{{ freeItem.skuInfo.code }}-{{ freeItem.skuInfo.name }}
                    <div class="triangle-topleft" v-if="freeItem.isChoosePc && freeItem.isSingle"></div>
                  </div>
                  <div class="footer">
                    <div>
                      <p v-for="(orderCode, index) in freeItem.orderCodeList" :key="index">{{ orderCode }}</p>
                    </div>
                    <div style="display: flex;align-items: center">
                      当前免金额：<span style="color: #408BFF">{{ Number(freeItem.data.actualAmount).toFixed(2) }}</span>
                    </div>
                  </div>
                </div>
              </a-col>
              <a-col :span="12" v-for="(reduceItem, i) in reduceList" :key="i" :id="reduceItem.index" >
                <div class="free-sub-item" :class="{active: reduceItem.isChoosePc && reduceItem.isSingle, pending: currentIndex === reduceItem.index}">
                  <div class="header" :class="{'header-active': reduceItem.isChoosePc && reduceItem.isSingle, 'pending-header': currentIndex === reduceItem.index}">
                    {{ reduceItem.data.name }} 满{{ reduceItem.data.reachAmount }}减{{ reduceItem.data.rateAmount }}
                    <div class="triangle-topleft" v-if="reduceItem.isChoosePc && reduceItem.isSingle"></div>
                  </div>
                  <div class="footer">
                    <div>
                      <p v-for="(orderCode, index) in reduceItem.orderCodeList" :key="index">
                        {{ orderCode }}
                      </p>
                    </div>
                    <div style="display: flex;align-items: center">
                      <span @click.stop>实减：
                        <a-input-number
                          size="small"
                          :min="0"
                          :id="reduceItem.id"
                          ref="reduce"
                          :max="reduceItem.data.maxAmount"
                          v-model="reduceItem.data.actualAmount"
                          style="width: 60px;"
                          :tab-index="9999"
                          :disabled="reduceItem.data.ifChange === 0"
                          @change="val => reduceAmountChange(val, reduceItem)"/>
                      </span>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="right">
          <!-- 顾客权益列表 -->
          <div class="rights-list">
            <div class="rights-header">
              <div></div>
              顾客权益列表
            </div>
            <div class="right-content">
              <div class="single-right active" v-for="(order, i) in rightsList" :key="i" v-show="order.show">
                <div v-if="order">
                  <div class="single-header">
                    单号：{{ order.code }}
                    <span class="triangle-topleft"></span>
                  </div>
                  <div class="single-content">
                    <div v-if="order.bindingGoods && order.bindingGoods.length > 0">
                      <div class="activity-name">捆绑：</div>
                      <div class="goods">
                        <p v-for="(goods, bi) in order.bindingGoods" :key="bi">
                          <span>{{ goods.name }}</span>
                          <span>x{{ goods.quantity }}</span>
                        </p>
                      </div>
                    </div>
                    <div v-if="order.serviceCoupons && order.serviceCoupons.length > 0">
                      <div class="activity-name">服务：</div>
                      <div class="goods">
                        <p v-for="(service, si) in order.serviceCoupons" :key="si">
                          <span>{{ service.name }}</span>
                          <span>x{{ service.quantity }}</span>
                        </p>
                      </div>
                    </div>
                    <div v-if="order.backDefine && JSON.stringify(order.backDefine) !== '{}'">
                      <div class="activity-name">满返：</div>
                      <div class="goods">
                        <p>
                          <span>满{{ order.backDefine.reachAmount }}返{{ order.backDefine.rateAmount }},实返{{ order.backDefine.actualAmount }}</span>
                        </p>
                      </div>
                    </div>
                    <div v-if="order.gifts && order.gifts.length > 0">
                      <div class="activity-name">满赠：</div>
                      <div class="goods">
                        <p>
                          <span>{{ order.gifts[0].code }}-{{ order.gifts[0].name }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 套购满返/满赠 -->
          <div class="arbitrage">
            <div
              class="arbitrage-item"
              :class="{pending: currentIndex === returnItem.index, active: returnItem.isChoosePc && returnItem.isSingle}"
              v-for="returnItem in returnList"
              :key="returnItem.id"
              v-show="returnList.length > 0"
              :id="returnItem.index">
              <div class="arbitrage-item-header" :class="{active: returnItem.isChoosePc && returnItem.isSingle, 'pending-header': currentIndex === returnItem.index}">
                <div>单号：</div>
                <div>
                  <p v-for="(orderCode, oi) in returnItem.orderCodeList" :key="oi">{{ orderCode }}</p>
                </div>
                <span class="triangle-topleft" v-if="returnItem.isChoosePc && returnItem.isSingle"></span>
              </div>
              <div class="arbitrage-item-content">
                <p>{{ returnItem.data.name }}满{{ returnItem.data.reachAmount }}返{{ returnItem.data.rateAmount }}</p>
                <p @click.stop>
                  实返：
                  <a-input-number
                    size="small"
                    :tab-index="9999"
                    :min="1"
                    :max="returnItem.data.maxAmount"
                    :disabled="returnItem.data.ifChange === 0"
                    ref="return"
                    style="width: 60px;"
                    v-model="returnItem.data.actualAmount"
                    @change="val => returnAmountChange(val, returnItem)"/>
                </p>
              </div>
            </div>
            <div v-if="settleFlag !== 1">
              <div
                class="arbitrage-item"
                :class="{pending: currentIndex === item.index, active: item.isChoosePc && item.isSingle}"
                v-for="(item, index) in giftList"
                :key="index"
                :id="item.index">
                <div class="arbitrage-item-header" :class="{active: item.isChoosePc && item.isSingle, 'pending-header': currentIndex === item.index}">
                  <div>单号：</div>
                  <div>
                    <p v-for="(orderCode, i) in item.orderCodeList" :key="i">{{ orderCode }}</p>
                  </div>
                  <span class="triangle-topleft" v-if="item.isChoosePc && item.isSingle"></span>
                </div>
                <div class="arbitrage-item-content">
                  <p>{{ item.activityName }}</p>
                  <p>
                    【赠】{{ item.gift.skuCode }}{{ item.gift.skuName }}
                  </p>
                </div>
              </div>
            </div>
            <div v-if="settleFlag === 1">
              <div
                class="arbitrage-item"
                v-for="(item, index) in giftList"
                :key="index"
                :id="item.index">
                <div class="arbitrage-item-header">
                  <div>单号：</div>
                  <div>
                    <p v-for="(orderCode, i) in item.orderCodeList" :key="i">{{ orderCode }}</p>
                  </div>
                </div>
                <div class="arbitrage-item-content">
                  <p>{{ item.activityName }}</p>
                  <p>
                    【赠】{{ item.skuCode }}{{ item.skuName }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  微信/支付宝支付 -->
    <a-modal
      :title="wzPay.wzTitle"
      v-model="wzPay.wzModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :getContainer="() => $refs.fullscreen.$el"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button @click="cancelWzPay">关闭</a-button>
        <a-button
          type="primary"
          :loading="loading"
          :disabled="wzPay.wzTitle !== '现金支付' && magneticStripe.length!==18"
          @click="wzPayment"
        >确定</a-button>
      </template>
      <div class="wz-container">
        <a-row>
          <a-col :span="6">支付金额</a-col>
          <a-col :span="18">
            <a-input-number disabled :autoFocus="true" v-model="wzPay.wzAmount" :max="amountList.balanceAmount" />
          </a-col>
          <a-col :span="6" v-if="wzPay.wzTitle !== '现金支付'">扫码流水号</a-col>
          <a-col :span="18" v-if="wzPay.wzTitle !== '现金支付'">
            <a-input placeholder="请扫描顾客支付码" v-model="magneticStripe"></a-input>
          </a-col>
        </a-row>
      </div>
    </a-modal>
    <a-modal
      title="分期贷"
      v-model="loanModal.loanVisiable"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :getContainer="() => $refs.fullscreen.$el"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button key="back" @click="loanModal.loanVisiable = false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="loanSubmit">
          确定
        </a-button>
      </template>
      <a-form :form="loanForm">
        <a-row class="doc">
          <a-col :span="4">贷款金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入贷款金额" v-decorator="$check('loan.creditAmount')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">期数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入期数" v-decorator="$check('loan.creditDivide')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">贷款公司:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 100%" v-decorator="$check('loan.company', {initialValue:loanModal.loanCompanyDefault})" :options="loanModal.loanCompany" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">分期产品:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 100%" v-decorator="$check('loan.type', {initialValue:loanModal.loanProDefault})" :options="loanModal.loanPro" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">合同号:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入合同号" v-decorator="$check('loan.contractCode')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客姓名</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('loan.customerName')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客电话</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客电话" v-decorator="$check('loan.customerTelephone')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">身份证号</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入身份证号" v-decorator="$check('loan.customerIdentity')"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 新百卡支付 -->
    <a-modal
      :title="cardPay.cardPayTitle"
      v-model="cardPay.cardPayModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :getContainer="() => $refs.fullscreen.$el"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="cardPayCancel">取消</a-button>
        <a-button type="primary" :loading="loading" @click="toPay">
          确定
        </a-button>
      </template>
      <div class="xb-box" >
        <div class="pay-info">
          <p>
            <span>消费总费用：</span>
            {{ Number(amountList.shouldPayAmount).toFixed(2) }}
          </p>
          <p>
            <span>尾款：</span>
            {{ Number(amountList.balanceAmount).toFixed(2) }}
          </p>
        </div>
        <a-divider />
        <div class="card-info">
          <div><span>刷卡信息：</span></div>
          <div>
            <span>卡余额：</span>
            {{ Number(cardPay.cardBalance).toFixed(2) }}
          </div>
          <p>
            <span>实付额：</span>
            <a-input placeholder="0.0" v-model="cardPay.payAmount"/>
          </p>
          <p v-if="payType==='shopping_pay_record_pay_type:4'">
            <span>校验码：</span>
            <a-input placeholder="新百卡末四位" v-model="cardPay.cardNo"/>
          </p>
        </div>
      </div>
    </a-modal>
    <a-modal
      title="收款成功"
      v-model="paySuccessModel"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :getContainer="() => $refs.fullscreen.$el"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" :loading="loading" @click="paySuccessCancel">
          取消
        </a-button>
        <a-button type="primary" :loading="loading" @click="paySuccessModel = false" v-if="amountList.balanceAmount > 0">
          继续付款
        </a-button>
        <a-button type="primary" :loading="loading" @click="showInvoiceList" v-if="amountList.balanceAmount === 0">
          打印发票
        </a-button>
        <a-button type="primary" :loading="loading" @click="toPrintTicket" v-if="amountList.balanceAmount === 0">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="@assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ paySuccessInfo.payNumber }}</p>
      <p><span>本次收款：</span>{{ initPrice(paySuccessInfo.payAmount) }}</p>
      <p><span>尾款金额：</span>{{ initPrice(paySuccessInfo.balanceAmount) }}</p>
      <p><span>支付时间：</span>{{ paySuccessInfo.payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in singleList" :key="index">
            {{ goods.skuInfo.name }}    x{{ goods.skuInfo.quantity }}
          </p>
        </div>
      </div>
    </a-modal>
    <a-modal
      title="小票打印"
      v-model="ticketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :getContainer="() => $refs.fullscreen.$el"
      :zIndex="10001"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="ticketModal = false">取消</a-button>
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box" style="width:400px;">
        <Ticket :ticketInfo="ticketInfo" v-if="ifDeposit === 0"></Ticket>
        <DepositTicket :ticketInfo="ticketInfo" v-else></DepositTicket>
      </div>
    </a-modal>
    <!-- <div style="height:1px;over-flow:hidden;">
      <div id="print-box" style="width:400px;">
        <Ticket :ticketInfo="ticketInfo" v-if="ifDeposit === 0"></Ticket>
        <DepositTicket :ticketInfo="ticketInfo" v-else></DepositTicket>
      </div>
    </div> -->
    <a-modal
      :title="invoiceList.taxTitle"
      v-model="invoiceList.taxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="9999"
      :getContainer="() => $refs.fullscreen.$el"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button key="back" @click="invoiceListClose">关闭</a-button>
        <a-button key="submit" type="primary" @click.stop="addEditTax(-1)">
          新增发票
        </a-button>
      </template>
      <div>
        <a-collapse accordion v-if="customerTaxInfo.length > 0">
          <a-collapse-panel v-for="(item,index) in customerTaxInfo" :key="index">
            <template slot="header">
              <a-row>
                <a-col :span="6">{{ item.invoiceName }}</a-col>
                <a-col :span="8" :offset="10" class="taxOptions">
                  <!-- <a href="#" @click="toPrintInvoice(item)">打印</a>
                  <a href="#" @click.stop="addEditTax(0, item)">编辑</a>
                  <a href="#" @click.stop="delTaxInfo(item.id)">删除</a> -->
                  <a-button type="link" @click="toPrintInvoice(item)">打印</a-button>
                  <a-button type="link" @click.stop="addEditTax(0, item)">编辑</a-button>
                  <a-button type="link" @click.stop="delTaxInfo(item.id)">删除</a-button>
                </a-col>
              </a-row>
            </template>
            <div v-if="item.type===2">
              <p>发票抬头：{{ item.invoiceName }}</p>
              <p>纳税人识别号：{{ item.invoiceCode }}</p>
              <p>地址：{{ item.address }}</p>
              <p>电话号码：{{ item.telephone }}</p>
              <p>开户行名称：{{ item.bankName }}</p>
              <p>开户行账号：{{ item.bankCode }}</p>
            </div>
            <div v-else>
              <p>发票抬头：{{ item.invoiceName }}</p>
              <p>电话号码：{{ item.telephone }}</p>
              <p>地址：{{ item.address }}</p>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <div v-else>
          暂无发票信息
        </div>
      </div>
    </a-modal>
    <a-modal
      :title="addEdit.addEditTaxTitle"
      v-model="addEdit.addEditTaxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10000"
      :getContainer="() => $refs.fullscreen.$el"
      class="doc"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button @click="addEditTaxCancel">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="addEditTaxSubmit">
          确定
        </a-button>
      </template>
      <a-form :form="taxForm">
        <a-row class="doc">
          <a-col :span="4">税票类型:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-model="radioValue">
                <a-radio :value="2">公司</a-radio>
                <a-radio :value="1">个人</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">发票抬头:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入发票抬头" v-decorator="$check('customer.invoiceName',{initialValue:addEditTaxInfo.invoiceName || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">纳税人识别号:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入纳税人识别号" v-decorator="$check('customer.invoiceCode',{initialValue:addEditTaxInfo.invoiceCode || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">电话号码:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入电话号码" v-decorator="$check('customer.telephone',{initialValue:addEditTaxInfo.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">开户行名称:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入开户行名称" v-decorator="$check('customer.bankName',{initialValue:addEditTaxInfo.bankName || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4" v-if="radioValue===2">开户行账号:</a-col>
          <a-col :span="8" v-if="radioValue===2">
            <a-form-item>
              <a-input placeholder="请输入开户行账号" v-decorator="$check('customer.bankCode',{initialValue:addEditTaxInfo.bankCode || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="radioValue===2?8:20">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('customer.address',{initialValue:addEditTaxInfo.address || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="发票打印"
      v-model="invoiceModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10001"
      :getContainer="() => $refs.fullscreen.$el"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printInvoice" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-invoice" >
        <div style="margin-top:80px">
          <Invoicetpl :invoiceList="returnInvoiceInfo"></Invoicetpl>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model="delModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :z-index="10001"
      :getContainer="() => $refs.fullscreen.$el"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button @click="delModal = false">取消</a-button>
        <a-button @click="doDelete" type="danger">
          确定
        </a-button>
      </template>
      <a-row>
        <a-col :span="2">
          <a-icon type="question-circle" style="font-size: 16px;font-weight: 700;color: rgb(250,173,20)"/>
        </a-col>
        <a-col :span="22">
          <p style="font-size:16px;font-weight:700;margin-bottom: 10px;">删除提示</p>
          <p>确定删除选中项? 删除后将不可恢复</p>
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      :getContainer="()=>$el"
      wrapClassName="modal-pay"
      destroyOnClose
      v-model="showCard"
      :title="(searchResult.customer||{}).name+'顾客的待收款列表'"
      :footer="null" >
      <CardItem @queryOrderInfo="queryOrderInfoFromModal" :data="searchResult" />
    </a-modal>
  </fullscreen>
</template>

<script>
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import moment from 'moment'
import print from 'print-js'
import card from '@/utils/card'
import { lowToUp } from '@utils/util'
import jrQrcode from 'jr-qrcode'
import Invoicetpl from '../components/Invoicetpl'
import goodsPhoto from '@assets/goods.png'
import Ticket from '../components/Ticket'
import DepositTicket from '../components/DepositTicket'
import CardItem from './CardItem'
export default {
    name: 'Settle',
    components: {
        Ticket,
        DepositTicket,
        Invoicetpl,
        CardItem
    },
    props: {
        settleCustomer: {
            type: Object,
            default: () => {}
        },
        settleOrders: {
            type: Array,
            default: () => []
        },
        settleFlag: {
            type: Number,
            default: 2
        },
        ifDeposit: {
            type: Number,
            default: 1
        }
    },
    data () {
        return {
            // 查询结果
            searchResult: {},
            showCard: false,
            pay: {
                payType: 2,
                disabled: false
            },
            fullscreenClass: 'fullscreenClass',
            fullscreen: false,
            container: 'body',
            searchCondition: '',
            columns: [
                {
                    title: '支付方式',
                    dataIndex: 'payTypeName',
                    width: '33%',
                    scopedSlots: { customRender: 'payTypeName' }
                },
                {
                    title: '支付凭证',
                    dataIndex: 'referNumber',
                    width: '33%',
                    scopedSlots: { customRender: 'referNumber' }
                },
                {
                    title: '支付金额',
                    dataIndex: 'payAmount',
                    width: '33%'
                }
            ],
            dataSource: [],
            amountList: {
                coinUsed: 0,
                subsidiesAmount: 0,
                originalAmount: 0,
                discountAmount: 0,
                shouldPayAmount: 0,
                actualAmount: 0,
                balanceAmount: 0
            },
            loading: false,
            magneticStripe: '',
            wzPay: {
                wzTitle: '',
                wzModal: false,
                wzAmount: 0
            },
            loanForm: this.$form.createForm(this),
            loanModal: {
                loanVisiable: false,
                loanCompany: [],
                loanPro: [],
                loanCompanyDefault: '',
                loanProDefault: ''
            },
            cardPay: {
                cardPayTitle: '',
                cardPayModal: false,
                cardBalance: 0,
                payAmount: 0,
                cardNo: '',
                cardName: ''
            },
            payMethods: [],
            // orderCodeList: ['TEST001-00001480', 'TEST001-00001479'],
            orderCodeList: [],
            // orderCodeList: ['TEST001-00001526'],
            giftList: [],
            freeList: [],
            reduceList: [],
            returnList: [],
            singleList: [],
            rightsList: [],
            currentCustomer: {},
            checkedEle: {},
            // 选中的套购活动
            chosenArbitrageActivity: {
                // 保存入参:选中的规则单集合
                shoppingScheduleRuleList: [],
                // 保存入参:赠品集合
                shoppingSaleRecordList: []
            },
            arbitrageType: -1,
            payNumber: '',
            payType: '',
            paySuccessInfo: {},
            paySuccessModel: false,
            ticketModal: false,
            ticketInfo: {},
            optionList: [],
            currentIndex: 0,
            lengthList: {
                orderLength: 0,
                freeLength: 0,
                reduceLength: 0,
                returnLength: 0,
                giftLength: 0,
                totalLength: 0
            },
            skuCode: '',
            openFlag: false,
            errorMessage: '',
            isSaved: false,
            tbodyHeight: 240,
            // 顾客税票信息
            invoiceList: {
                taxTitle: '',
                taxModal: false
            },
            customerTaxInfo: [],
            addEdit: {
                addEditTaxTitle: '',
                addEditTaxModal: false
            },
            addEditTaxInfo: {},
            taxForm: this.$form.createForm(this),
            isAdd: false,
            radioValue: 0,
            invoiceModal: false,
            returnInvoiceInfo: [],
            notQueryMul: false,
            delModal: false,
            delOrderCode: ''
        }
    },
    computed: {
        ...mapGetters(['windowHeight'])
    },
    async created () {
        this.isSaved = false
        if (this.settleFlag !== 2) {
            this.currentCustomer = this.settleCustomer
            this.settleOrders.forEach(item => {
                this.orderCodeList.push(item.code)
            })
            if (this.ifDeposit === 1) {
                this.skuCode = this.settleOrders[0].skuCode
                this.getPayMethods(2)
            } else {
                this.getPayMethods(1)
            }
        }
        if (this.orderCodeList.length > 0) {
            await this.queryOrderInfo()
            if (this.ifDeposit === 0 && this.settleFlag !== 1) {
                await this.queryMultipleActivity()
            }
            await this.queryPayRecord()
            this.collectArbitrageInfo()
            this.calculatTotalPromotion()
            this.calculatTotalEle()
            this.calculatAmountList()
        }
    },
    mounted () {
        this.tbodyHeight = this.$refs.main.clientHeight - 372
        const self = this
        document.onkeydown = function (e) {
            const key = window.event.keyCode
            if (key === 112) {
                // 微信支付F1
                e.preventDefault()
                self.keyDownToChangePayType(1)
                // self.wzPayHandle(1)
            } else if (key === 113) {
                // 支付宝支付F2
                e.preventDefault()
                self.keyDownToChangePayType(2)

                // self.wzPayHandle(2)
            } else if (key === 114) {
                // 新百卡支付F3
                if (self.ifDeposit === 1) {
                    return false
                }
                e.preventDefault()
                self.keyDownToChangePayType(0)
                // self.cardPayHandle(0)
            } else if (key === 115) {
                // 现金支付F4
                e.preventDefault()
                self.keyDownToChangePayType(3)
                // self.wzPayHandle(3)
            } else if (key === 116) {
                // 分期贷F5
                if (self.ifDeposit === 1) {
                    return false
                }
                e.preventDefault()
                self.openLoanModal()
            } else if (key === 117) {
                // 储值卡支付F6
                if (self.ifDeposit === 1) {
                    return false
                }
                e.preventDefault()
                self.cardPayHandle(1)
            }
        }
    },
    methods: {
        keyDownToChangePayType (type) {
            if (this.pay.disabled) {
                this.wzPayHandle(type)
            } else {
                this.pay.payType = type
                this.$refs.payNum.$el.focus()
            }
        },
        printTicketCancel () {
            this.invoiceModal = false
        },
        addEditTaxCancel () {
            this.addEdit.addEditTaxModal = false
        },
        addEditTaxSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { taxForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.addEditTaxInfo.id
                    }
                    values.type = this.radioValue
                    values.customerCode = this.currentCustomer.customerCode
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerInvoice' : 'CustomerManageUpdateCustomerInvoice',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEdit.addEditTaxModal = false
                            this.queryInvoiceList()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        queryInvoiceList () {
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerCode: this.currentCustomer.customerCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.customerTaxInfo = res.data
                        this.invoiceList.taxModal = true
                    } else {
                        this.customerTaxInfo = []
                    }
                }
            })
        },
        delTaxInfo (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                zIndex: 9999,
                onOk () {
                    axios({
                        path: 'CustomerManageDelCustomerInvoice',
                        method: 'post',
                        body: {
                            id: id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.queryInvoiceList()
                        }
                    })
                }
            })
        },
        async toPrintInvoice (invoiceInfo) {
            await this.queryInvoiceInfo(invoiceInfo)
        },
        async queryInvoiceInfo (invoiceInfo) {
            const res = await axios({
                path: 'NuonuoInvoiceRequestBilling',
                method: 'post',
                body: {
                    orderIds: this.orderCodeList,
                    invoiceType: 1,
                    operationType: 1,
                    customerInvoiceInfo: invoiceInfo
                }
            })
            if (res.flag === 1) {
                const data = res.data
                data.forEach(item => {
                    item.orderInfo.upActualPrice = lowToUp(item.orderInfo.actualPay)
                    item.src = jrQrcode.getQrBase64(`http://nnfp.jss.com.cn/invoice/scan/k0.action?id=${item.invoiceSerialNum}`, {
                        width: 100,
                        height: 100
                    })
                })
                this.returnInvoiceInfo = [...data]
                this.invoiceModal = true
                console.log('查询到的发票信息', this.returnInvoiceInfo)
            }
        },
        addEditTax (index, item) {
            if (index === -1) {
                this.isAdd = true
                this.addEdit.addEditTaxTitle = '新增发票信息'
            } else {
                this.isAdd = false
                this.addEditTaxInfo = item
                this.radioValue = item.type
                this.addEdit.addEditTaxTitle = '编辑发票信息'
            }
            this.addEdit.addEditTaxModal = true
        },
        invoiceListClose () {
            this.invoiceList.taxModal = false
        },
        moveErrorImg (event) {
            event.currentTarget.src = goodsPhoto
        },
        tabHandler (e) {
            if (this.dataSource.length === 0 || (this.dataSource.length === 1 && this.dataSource[0].payTypeName === '定金支付')) {
                e.preventDefault()
                this.currentIndex++
                if (this.currentIndex > this.lengthList.totalLength + 2) {
                    console.log(this.currentIndex)
                    this.currentIndex = 0
                    this.$refs['search-input'].focus()
                }
                console.log(this.currentIndex)
            } else {
                return false
            }
        },
        spaceHandler (e) {
            e.preventDefault()
            if (this.currentIndex === 1) {
                this.onSearch(this.searchCondition)
            } else if (this.currentIndex === 2) {
                this.toOrderList()
            } else if (this.currentIndex >= 3 && this.currentIndex < 3 + this.lengthList.orderLength) {
                // 空格执行订单删除操作
                this.singleList.forEach(item => {
                    if (item.index === this.currentIndex) {
                        this.delOrder(item.code)
                    }
                })
            } else if (this.currentIndex >= 3 + this.lengthList.orderLength) {
                // 空格执行套购活动的选中和取消操作
                const currentActivity = this.optionList[this.currentIndex - 3]
                if (currentActivity.data.scheduleType === 'schedule_rule_define_schedule_type:7') {
                    this.chooseArbitrageActivity(this.freeList[0])
                } else if (currentActivity.data.scheduleType === 'schedule_rule_define_schedule_type:5') {
                    this.reduceList.forEach((item, index) => {
                        if (item.id === currentActivity.id) {
                            console.log('---item---', item)
                            this.chooseArbitrageActivity(item)
                            if (item.isChoosePc) {
                                this.$refs.reduce[index].focus()
                            }
                        }
                    })
                } else if (currentActivity.data.scheduleType === 'schedule_rule_define_schedule_type:4') {
                    this.returnList.forEach((item, index) => {
                        if (item.id === currentActivity.id) {
                            this.chooseArbitrageActivity(item)
                            if (item.isChoosePc) {
                                this.$refs.return[index].focus()
                            }
                        }
                    })
                } else {
                    this.giftList.forEach(item => {
                        if (item.id === currentActivity.id) {
                            this.chooseArbitrageActivity(item)
                        }
                    })
                }
            }
        },
        toPrintTicket () {
            if (this.ifDeposit === 0) {
                this.queryTicketInfo()
            } else {
                this.queryDepositTicketInfo()
            }
        },
        showInvoiceList () {
            // this.openFlag = true
            this.queryInvoiceList()
            this.invoiceList.taxTitle = this.currentCustomer.customerName + '的税票信息'
        },
        setOpenFlag (data) {
            this.openFlag = data
        },
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        printInvoice () {
            print({
                printable: 'print-invoice',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
            this.printTicketCancel()
            this.invoiceList.taxModal = false
        },
        async onSearch (val) {
            if (this.orderCodeList.includes(val)) {
                this.$message.warning('订单已存在')
            } else if (this.dataSource.length !== 0) {
                return false
            }
            if (val === '') {
                return false
            }
            axios({ path: 'ShoppingScheduleQuerySettlementList', body: { telephone: val } })
                .then(async ({ data, flag }) => {
                    if (flag) {
                        const { depositList, nonDepositList } = data
                        if (depositList.length > 0 || nonDepositList.length > 0) {
                            this.showCard = true
                            this.searchResult = data
                        } else {
                            this.orderCodeList = []
                            this.currentCustomer = {}
                            this.orderCodeList.push(val)
                            const statusList = ['shopping_trolley_status:1']
                            await this.queryOrderInfo(statusList)
                            if (!this.notQueryMul) {
                                await this.queryMultipleActivity()
                            }
                            await this.queryPayRecord()
                            this.searchCondition = ''
                        }
                    }
                })
        },
        toPay () {
            if (this.payType === 'shopping_pay_record_pay_type:4') {
                if (this.cardPay.payAmount > this.cardPay.cardBalance) {
                    this.cardPay.payAmount = 0
                    this.$message.warning('余额不足')
                    return false
                } else if (this.cardPay.payAmount <= 0) {
                    this.$message.warning('请输入合法金额')
                    return false
                } else if (this.cardPay.payAmount > this.amountList.balanceAmount) {
                    this.$message.warning('支付金额不能大于尾款')
                    this.cardPay.payAmount = 0
                    return false
                } else if (this.cardPay.cardNo.length !== 4) {
                    this.$message.warning('请输入新百卡后四位')
                    this.cardPay.cardNo = ''
                    return false
                } else if (this.magneticStripe === '') {
                    this.$message.warning('请刷卡')
                    return false
                } else {
                    this.payment(this.cardPay.payAmount, this.cardPay.cardNo)
                }
            }
        },
        payment (payAmount, cardNo, cardName) {
            this.loading = true
            const payParams = {
                orderIds: this.orderCodeList,
                payType: this.payType,
                storeId: this.$store.getters.storeInfo.code,
                guideCode: this.$store.getters.userInfo.code,
                guideName: this.$store.getters.userInfo.name,
                payAmount: payAmount,
                shouldAmount: this.amountList.originalAmount,
                balanceAmount: this.amountList.balanceAmount,
                actualAmount: this.amountList.shouldPayAmount,
                customerId: this.currentCustomer.customerCode,
                cardNo: cardNo,
                cardName: cardName,
                magneticStripe: this.magneticStripe
            }
            axios({
                path: 'ApiPaymentPayShoppingTrolley',
                method: 'POST',
                body: payParams
            }).then(async res => {
                if (res.flag === 1) {
                    this.loading = false
                    this.amountList.balanceAmount = Number(res.data.balanceAmount)
                    this.paySuccessInfo = {
                        payNumber: res.data.payNumber,
                        balanceAmount: this.amountList.balanceAmount,
                        payAmount: payAmount,
                        payTime: moment(res.data.payTime).format('YYYY-MM-DD HH:mm:ss')
                    }
                    if (this.payType === 'shopping_pay_record_pay_type:2' || this.payType === 'shopping_pay_record_pay_type:3' || this.payType === 'shopping_pay_record_pay_type:10') {
                        this.cancelWzPay()
                    } else if (this.payType === 'shopping_pay_record_pay_type:4' || this.payType === 'shopping_pay_record_pay_type:9') {
                        this.cardPayCancel()
                    }
                    if (this.amountList.balanceAmount === 0 && this.settleFlag !== 1) {
                        this.dataSource = []
                        this.paySuccessHandle()
                    }
                    if (!this.isSaved && this.settleFlag !== 1) {
                        this.addElectronicCoin()
                        this.addArbitrage()
                        this.isSaved = true
                    }
                    this.paySuccessModel = true
                    if (this.amountList.balanceAmount !== 0) {
                        this.queryPayRecord()
                    }
                } else {
                    this.loading = false
                }
            })
        },
        async depositPay (skuCode) {
            this.loading = true
            const res = await axios({
                path: 'ApiPaymentPayDeposit',
                method: 'POST',
                body: {
                    orderIds: this.orderCodeList,
                    customerId: this.currentCustomer.customerCode,
                    payType: this.payType,
                    payAmount: this.amountList.originalAmount,
                    shouldAmount: this.amountList.originalAmount,
                    guideCode: this.$store.getters.userInfo.code,
                    guideName: this.$store.getters.userInfo.name,
                    magneticStripe: this.magneticStripe,
                    storeId: this.$store.getters.storeInfo.code,
                    skuCode: skuCode
                }
            })
            if (res.flag === 1) {
                this.loading = false
                this.amountList.balanceAmount = Number(res.data.balanceAmount)
                this.paySuccessInfo = {
                    payNumber: res.data.payNumber,
                    balanceAmount: this.amountList.balanceAmount,
                    payAmount: this.amountList.originalAmount,
                    payTime: moment(res.data.payTime).format('YYYY-MM-DD HH:mm:ss')
                }
                if (this.payType === 'shopping_pay_record_pay_type:2' || this.payType === 'shopping_pay_record_pay_type:3') {
                    this.cancelWzPay()
                }
                this.paySuccessModel = true
            } else {
                this.loading = false
            }
        },
        paySuccessHandle (payNumber) {
            axios({
                path: 'ApiPaymentPaySuccessHandle',
                method: 'post',
                body: {
                    orderIds: this.orderCodeList,
                    payNumber: this.paySuccessInfo.payNumber
                }
            }).then(res => {
                if (res.flag === 1) {
                }
            })
        },
        paySuccessCancel () {
            this.paySuccessModel = false
            this.wzPay.wzModal = false
            this.singleList = []
            this.rightsList = []
            this.giftList = []
            this.freeList = []
            this.reduceList = []
            this.returnList = []
            this.dataSource = []
            this.checkedEle = {}
            this.orderCodeList = []
            this.amountList = {
                coinUsed: 0,
                subsidiesAmount: 0,
                originalAmount: 0,
                discountAmount: 0,
                shouldPayAmount: 0,
                actualAmount: 0,
                balanceAmount: 0
            }
            this.$emit('clearData')
        },
        // 保存电子币
        async addElectronicCoin () {
            const shoppingScheduleRuleList = []
            this.singleList.forEach(item => {
                item.electronic.forEach(ele => {
                    const tempObj = {
                        scheduleType: 'schedule_rule_define_schedule_type:12',
                        customerCoinCode: ele.code,
                        shoppingTrolleyCode: item.code,
                        makeStoreCode: this.$store.getters.storeInfo.code,
                        scheduleAmount: ele.actualAmount,
                        shouldScheduleAmount: ele.actualAmount,
                        scheduleRuleCode: ele.scheduleRuleDefineCode,
                        scheduleRuleName: ele.scheduleRuleDefineName
                    }
                    shoppingScheduleRuleList.push(tempObj)
                })
            })
            const res = await axios({
                path: 'ShoppingScheduleAddElectronicCoin',
                method: 'POST',
                body: {
                    customerCode: this.currentCustomer.customerCode,
                    shoppingScheduleRuleList,
                    payNumber: this.payNumber
                }
            })
            if (res.flag === 1) {
            }
        },
        // 保存套购活动
        async addArbitrage () {
            this.chosenArbitrageActivity.shoppingSaleRecordList.forEach(item => {
                item.payNumber = this.paySuccessInfo.payNumber
            })
            const res = await axios({
                path: 'ShoppingScheduleAddArbitrage',
                method: 'post',
                body: {
                    shoppingScheduleRuleList: this.chosenArbitrageActivity.shoppingScheduleRuleList,
                    shoppingSaleRecordList: this.chosenArbitrageActivity.shoppingSaleRecordList
                }
            })
            if (res.flag === 1) {
            }
        },
        async chooseArbitrageActivity (schedule) {
            console.log('聚焦的套购活动', schedule)
            if (!schedule.isSingle) {
                this.$message.warning('不能选择该活动')
                return false
            } else {
                schedule.isChoosePc = !schedule.isChoosePc
                if (schedule.data.scheduleType === 'schedule_rule_define_schedule_type:7') {
                    //  满免
                    if (schedule.isChoosePc) {
                        this.clearGift()
                        this.clearReturn()
                        this.clearReduce()
                    }
                } else if (schedule.data.scheduleType === 'schedule_rule_define_schedule_type:5') {
                    // 满减
                    if (schedule.isChoosePc) {
                        this.clearGift()
                        this.clearReturn()
                        this.clearFree()
                    }
                } else if (schedule.data.scheduleType === 'schedule_rule_define_schedule_type:4') {
                    // 满返
                    if (schedule.isChoosePc) {
                        this.clearGift()
                        this.clearReduce()
                        this.clearFree()
                    }
                } else {
                    // 满赠
                    if (schedule.isChoosePc) {
                        this.clearReduce()
                        this.clearReturn()
                        this.clearFree()
                        // 同一规则单互斥，清空单内其他赠品，不同规则单直接选中
                        this.giftList.forEach(gift => {
                            if (schedule.data.id === gift.data.id && schedule.id !== gift.id) {
                                gift.isChoosePc = false
                            }
                        })
                    }
                }

                this.collectArbitrageInfo()
                this.calculatTotalPromotion()
                this.calculatTotalEle()
                this.calculatAmountList()
            }
        },
        clearGift () {
            this.giftList.forEach(gift => {
                gift.isChoosePc = false
            })
        },
        clearReduce () {
            this.reduceList.forEach(item => {
                item.isChoosePc = false
            })
        },
        clearReturn () {
            this.returnList.forEach(item => {
                item.isChoosePc = false
            })
        },
        clearFree () {
            this.freeList.forEach(freeItem => {
                freeItem.isChoosePc = false
            })
        },
        // 收集套购活动数据并重新计算补贴促销券，折扣金额
        collectArbitrageInfo () {
            this.chosenArbitrageActivity.shoppingScheduleRuleList = []
            this.chosenArbitrageActivity.shoppingSaleRecordList = []
            this.freeList.forEach(freeItem => {
                if (freeItem.isChoosePc) {
                    freeItem.data.scheduleRuleCode = freeItem.data.code
                    freeItem.data.scheduleRuleName = freeItem.data.name
                    freeItem.data.shouldScheduleAmount = freeItem.data.actualAmount
                    freeItem.data.scheduleAmount = freeItem.data.actualAmount
                    freeItem.data.exemptionCode = freeItem.skuInfo.shoppingTrolleyId
                    this.chosenArbitrageActivity.shoppingScheduleRuleList.push(freeItem.data)
                }
            })
            this.reduceList.forEach(reduceItem => {
                if (reduceItem.isChoosePc) {
                    reduceItem.data.scheduleRuleCode = reduceItem.data.code
                    reduceItem.data.scheduleRuleName = reduceItem.data.name
                    reduceItem.data.shouldScheduleAmount = reduceItem.actualAmount
                    reduceItem.data.scheduleAmount = reduceItem.data.actualAmount
                    this.chosenArbitrageActivity.shoppingScheduleRuleList.push(reduceItem.data)
                }
            })
            this.returnList.forEach(returnItem => {
                if (returnItem.isChoosePc) {
                    returnItem.data.scheduleRuleCode = returnItem.data.code
                    returnItem.data.scheduleRuleName = returnItem.data.name
                    returnItem.data.shouldScheduleAmount = returnItem.actualAmount
                    returnItem.data.scheduleAmount = returnItem.data.actualAmount
                    this.chosenArbitrageActivity.shoppingScheduleRuleList.push(returnItem.data)
                }
            })
            this.giftList.forEach(giftItem => {
                if (giftItem.isChoosePc) {
                    giftItem.data.scheduleRuleCode = giftItem.data.code
                    giftItem.data.scheduleRuleName = giftItem.data.name
                    giftItem.gift.unitPrice = giftItem.gift.skuPrice
                    giftItem.gift.actualPrice = giftItem.gift.skuPrice
                    giftItem.gift.quantity = giftItem.gift.skuQuantity
                    giftItem.gift.customerCode = this.currentCustomer.customerCode
                    giftItem.gift.cashierCode = this.$store.getters.userInfo.code
                    giftItem.gift.cashier = this.$store.getters.userInfo.name
                    giftItem.gift.guiderCode = this.$store.getters.userInfo.code
                    giftItem.gift.guider = this.$store.getters.userInfo.name
                    giftItem.gift.storeCode = this.$store.getters.storeInfo.code
                    giftItem.gift.orderId = this.orderCodeList.join(',')
                    this.chosenArbitrageActivity.shoppingScheduleRuleList.push(giftItem.data)
                    this.chosenArbitrageActivity.shoppingSaleRecordList.push(giftItem.gift)
                }
            })
            console.log('选中的套购活动信息：', this.chosenArbitrageActivity)
        },
        async queryPayRecord () {
            const res = await axios({
                path: 'ShoppingPayRecordQueryShoppingPayRecord',
                method: 'POST',
                body: {
                    orderIds: this.orderCodeList,
                    status: 1,
                    storeCode: this.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
                this.dataSource = []
                this.amountList.actualAmount = 0
                const data = res.data.shoppingPayRecords
                if (data) {
                    data.forEach(item => {
                        this.amountList.actualAmount += item.payAmount
                        const row = {
                            payTypeName: item.payTypeName,
                            payAmount: item.payAmount,
                            id: item.id
                        }
                        if (item.payType === 'shopping_pay_record_pay_type:4' || item.payType === 'shopping_pay_record_pay_type:9') {
                            row.referNumber = item.cardNo
                        } else if (item.payType === 'shopping_pay_record_pay_type:2' || item.payType === 'shopping_pay_record_pay_type:3') {
                            row.referNumber = item.referNumber
                        } else {
                            row.referNumber = '--'
                        }
                        this.dataSource.push(row)
                    })
                }
            }
        },
        queryOrderInfoFromModal ({ orderCodes, ifDeposit }) {
            this.getPayMethods(ifDeposit ? 2 : 1)
            ifDeposit && (this.ifDeposit = 1)
            this.wzPay.wzAmount = 0
            this.pay.disabled = false
            this.showCard = false
            this.queryOrderInfo([], orderCodes, ifDeposit)
            this.queryMultipleActivity(orderCodes)
        },
        async queryOrderInfo (statusList, orderIds, ifDeposit) {
            const res = await axios({
                path: 'ShoppingScheduleQuerySettlementDetail',
                method: 'POST',
                body: {
                    orderIds: orderIds || this.orderCodeList,
                    customerCode: this.currentCustomer.customerCode || '',
                    storeCode: this.$store.getters.storeInfo.code,
                    statusList: statusList || []
                }
            })
            if (res.flag === 1) {
                if (JSON.stringify(res.data) !== '{}') {
                    if (ifDeposit) {
                        this.wzPay.wzAmount = res.data.balanceAmount
                        this.pay.disabled = true
                    }
                    this.optionList = []
                    this.orderCodeList = []
                    // 处理订单列表数据
                    res.data.singleList.forEach((item, index) => {
                        const pic = item.skuInfo.picture ? item.skuInfo.picture.split(',') : ['']
                        item.skuInfo.mainGoodsPic = pic
                        this.orderCodeList.push(item.code)
                        item.show = false
                        item.eleSum = 0
                        if (item.electronic.length > 0) {
                            item.electronic.forEach(ele => {
                                item.eleSum += ele.actualAmount
                            })
                        }
                        if (item.gifts.length > 0 || item.bindingGoods.length > 0 || (item.backDefine && JSON.stringify(item.backDefine) !== '{}') || item.serviceCoupons.length > 0) {
                            item.show = true
                        }
                    })
                    this.rightsList = res.data.singleList
                    this.lengthList.orderLength = res.data.singleList.length
                    this.optionList = [...res.data.singleList]
                    this.errorMessage = res.data.errorMessage
                    const multipleList = res.data.multipleList
                    this.notQueryMul = false
                    for (const key in multipleList) {
                        if (multipleList[key].length > 0) {
                            this.notQueryMul = true
                        }
                    }
                    if (this.ifDeposit === 1 || this.settleFlag === 1 || this.notQueryMul) {
                        console.log('====================', this.notQueryMul)
                        const multipleList = res.data.multipleList
                        delete multipleList.freeDefine
                        for (const key in multipleList) {
                            if (multipleList[key].length > 0) {
                                multipleList[key].forEach(item => {
                                    item.title = item.name
                                    if (key === 'gifts') {
                                        item.orderCodeList = item.orderId.split(',')
                                    } else {
                                        item.orderCodeList = item.multipleCode.split(',')
                                    }
                                    item.data = Object.assign({}, item)
                                })
                                this.optionList = [...this.optionList, ...multipleList[key]]
                                console.log(';;;;;;;;;;;;;;;;;;;;', this.optionList)
                            }
                        }
                        this.bindIndex()
                    }
                    // this.selectAllEle()
                    this.amountList = { ...res.data }
                    res.data.customer.customerName = res.data.customer.name
                    res.data.customer.customerPhone = res.data.customer.telephone
                    res.data.customer.customerCode = res.data.customer.code
                    this.currentCustomer = res.data.customer
                }
            }
        },
        async queryMultipleActivity (orderCodeList) {
            const self = this
            const res = await axios({
                path: 'ScheduleGiftQueryMultipleActivity',
                method: 'post',
                body: {
                    orderCodeList: orderCodeList || this.orderCodeList,
                    storeCode: self.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                // 套购满免
                if (res.data.freeList.length > 0) {
                    this.lengthList.freeLength = res.data.freeList.length
                    res.data.freeList[0].orderCodeList = res.data.freeList[0].orderCode.split(',')
                    res.data.freeList[0].data.actualAmount = res.data.freeList[0].exemptionAmount
                    res.data.freeList[0].data.shoppingTrolleyCode = res.data.freeList[0].orderCode
                    this.optionList = [...this.optionList, ...res.data.freeList]
                } else {
                    this.lengthList.freeLength = 0
                }
                // 套购满减
                if (res.data.reduceList.length > 0) {
                    this.lengthList.reduceLength = res.data.reduceList.length
                    res.data.reduceList.forEach(item => {
                        item.orderCodeList = item.orderCode.split(',')
                        item.data.actualAmount = item.actualAmount
                        item.data.shoppingTrolleyCode = item.orderCode
                    })
                    this.optionList = [...this.optionList, ...res.data.reduceList]
                } else {
                    this.lengthList.reduceLength = 0
                }
                // 套购满返
                if (res.data.backList && res.data.backList.length > 0) {
                    this.lengthList.returnLength = res.data.backList.length
                    res.data.backList.forEach(item => {
                        item.orderCodeList = item.orderCode.split(',')
                        item.data.actualAmount = item.actualAmount
                        item.data.shoppingTrolleyCode = item.orderCode
                    })
                    this.optionList = [...this.optionList, ...res.data.backList]
                } else {
                    this.lengthList.returnLength = 0
                }
                // 套购满赠
                if (res.data.giftList.length > 0) {
                    let giftActivity = []
                    res.data.giftList.forEach(item => {
                        item.list.forEach(subItem => {
                            subItem.data = item.data
                            subItem.isSingle = item.isSingle
                            subItem.data.shoppingTrolleyCode = item.orderCode
                            subItem.orderCodeList = item.orderCode.split(',')
                        })
                        giftActivity = [...giftActivity, ...item.list]
                    })
                    this.lengthList.giftLength = giftActivity.length
                    this.optionList = [...this.optionList, ...giftActivity]
                } else {
                    this.lengthList.giftLength = 0
                }
                this.bindIndex()
            } else {
                this.orderCodeList = []
                this.currentCustomer = {}
            }
        },
        bindIndex () {
            this.lengthList.totalLength = 0
            for (const key in this.lengthList) {
                if (key !== 'totalLength') {
                    this.lengthList.totalLength += this.lengthList[key]
                }
            }
            this.freeList = []
            this.reduceList = []
            this.returnList = []
            this.giftList = []
            this.singleList = []
            this.optionList.forEach((item, index) => {
                item.index = index + 3
                if (item.data) {
                    if (item.data.scheduleType === 'schedule_rule_define_schedule_type:7') {
                        this.freeList = []
                        this.freeList.push(item)
                    } else if (item.data.scheduleType === 'schedule_rule_define_schedule_type:5') {
                        this.reduceList.push(item)
                    } else if (item.data.scheduleType === 'schedule_rule_define_schedule_type:4') {
                        this.returnList.push(item)
                    } else if (item.data.scheduleType === 'schedule_rule_define_schedule_type:6') {
                        this.giftList.push(item)
                    }
                } else {
                    this.singleList.push(item)
                }
            })
            this.collectArbitrageInfo()
        },
        // 查询新百卡信息
        async queryXinBaiCardInfo (cardId) {
            const res = await axios({
                path: 'ApiXinBaiPayQueryXinBaiCardInfo',
                method: 'POST',
                body: {
                    magneticStripe: cardId
                }
            })
            if (res.flag === 1) {
                this.cardPay.cardBalance = res.data.balance
            }
        },
        // 查询储值卡信息
        async queryValueCardBalance () {
            const res = axios({
                path: 'ShoppingValueCardPayQueryValueCardBalance',
                method: 'POST',
                body: {
                    magneticStripe: '1094834b-2819-12ae-db54-9978774096e5'
                }
            })
            if (res.flag === 1) {
            }
        },
        // 查询小票信息
        async queryTicketInfo () {
            const res = await axios({
                path: 'ApiPaymentQueryPrintPayInfo',
                method: 'post',
                body: {
                    orderIds: this.orderCodeList
                }
            })
            if (res.flag === 1) {
                this.ticketInfo = res.data
                this.ticketModal = true

                // this.printTag()
            }
        },
        async queryDepositTicketInfo () {
            const res = await axios({
                path: 'ApiPaymentQueryDepositPrintPayInfo',
                method: 'post',
                body: {
                    payNumber: this.paySuccessInfo.payNumber
                }
            })
            if (res.flag === 1) {
                this.ticketInfo = res.data
                // this.printTag()
                this.ticketModal = true
            }
        },
        selectAllEle () {
            this.singleList.forEach(item => {
                this.checkedEle[item.code] = []
                item.electronic.forEach(ele => {
                    this.checkedEle[item.code].push(ele.id)
                })
            })
        },
        delOrder (orderCode) {
            this.delModal = true
            this.delOrderCode = orderCode
        },
        async doDelete () {
            this.currentIndex = 0
            this.$refs['search-input'].focus()
            this.orderCodeList.splice(this.orderCodeList.indexOf(this.delOrderCode), 1)
            if (this.orderCodeList.length > 0) {
                await this.queryOrderInfo()
                if (!this.notQueryMul) {
                    await this.queryMultipleActivity()
                }
            } else {
                this.singleList = []
                this.rightsList = []
                this.giftList = []
                this.freeList = []
                this.reduceList = []
                this.returnList = []
                this.checkedEle = {}
                this.amountList = {
                    coinUsed: 0,
                    subsidiesAmount: 0,
                    originalAmount: 0,
                    discountAmount: 0,
                    shouldPayAmount: 0,
                    actualAmount: 0,
                    balanceAmount: 0
                }
            }
            this.delModal = false
        },
        cardPayCancel () {
            this.cardPay.balanceAmount = 0
            this.cardPay.cardNo = ''
            this.cardPay.payAmount = 0
            card.readStop()
            this.cardPay.cardPayModal = false
        },
        loanSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { loanForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.receiveAmount = this.amountList.shouldPayAmount
                    values.guideCode = this.$store.getters.userInfo.code
                    if (values.creditAmount > this.amountList.balanceAmount) {
                        this.$message.warning('贷款金额不能大于尾款')
                        this.loading = false
                        return false
                    }
                    axios({
                        path: 'ApiCreditPayAddCreditPayInfo',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('贷款成功：', res.data)
                            this.payType = 'shopping_pay_record_pay_type:6'
                            this.payment(res.data.creditAmount)
                            this.loanModal.loanVisiable = false
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        async openLoanModal () {
            await this.queryLoanCompany()
            await this.queryLoanPro()
            this.loanModal.loanVisiable = true
        },
        async queryLoanCompany () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryCreditType',
                method: 'POST',
                body: {
                    type: 'shopping_installment_credit_company'
                }
            })
            if (res.flag === 1) {
                console.log('分期贷公司:', res.data)
                const data = res.data
                data.forEach(item => {
                    item.title = item.value
                    item.key = `${item.type}:${item.configKey}`
                    item.value = `${item.type}:${item.configKey}`
                })
                console.log(this.loanModal)
                console.log(data[0].value)

                this.loanModal.loanCompanyDefault = data[0].value
                this.loanModal.loanCompany = [...data]
            }
        },
        async queryLoanPro () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryCreditType',
                method: 'POST',
                body: {
                    type: 'shopping_installment_credit_type'
                }
            })
            if (res.flag === 1) {
                console.log('分期贷产品:', res.data)
                const data = res.data
                data.forEach(item => {
                    item.title = item.value
                    item.key = `${item.type}:${item.configKey}`
                    item.value = `${item.type}:${item.configKey}`
                })
                this.loanModal.loanProDefault = data[0].value
                this.loanModal.loanPro = [...data]
            }
        },
        wzPayHandle (flag) {
            if (flag === 1) {
                this.wzPay.wzTitle = '微信支付'
                this.payType = 'shopping_pay_record_pay_type:3'
            } else if (flag === 2) {
                this.wzPay.wzTitle = '支付宝支付'
                this.payType = 'shopping_pay_record_pay_type:2'
            } else {
                this.wzPay.wzTitle = '现金支付'
                this.payType = 'shopping_pay_record_pay_type:10'
            }
            // if (this.ifDeposit === 0) {
            //     this.wzPay.wzAmount = this.amountList.balanceAmount
            // } else {
            //     this.wzPay.wzAmount = this.amountList.balanceAmount
            // }
            // this.wzPay.wzAmount = this.amountList.balanceAmount
            this.wzPay.wzModal = true
        },
        wzPayment () {
            if (this.ifDeposit === 1) {
                this.depositPay(this.skuCode)
            } else {
                this.payment(this.wzPay.wzAmount)
            }
        },
        cancelWzPay () {
            this.wzPay.wzAmount = 0
            this.magneticStripe = ''
            this.loading = false
            this.wzPay.wzModal = false
        },
        cardPayHandle (flag) {
            if (flag === 0) {
                this.cardPay.cardPayTitle = '新百卡支付'
                this.payType = 'shopping_pay_record_pay_type:4'
            } else {
                this.cardPay.cardPayTitle = '储值卡支付'
                this.payType = 'shopping_pay_record_pay_type:9'
            }
            this.cardPay.cardPayModal = true
            card.onRead((res, err) => {
                console.log('刷卡器返回信息', res)
                if (!err) {
                    this.magneticStripe = res
                    this.queryXinBaiCardInfo(res)
                    card.readStop()
                }
            })
        },
        getPayMethods (effectType) {
            axios({
                path: 'MarketingConfigQueryPayMethod',
                method: 'POST',
                body: {
                    effectApp: 1,
                    effectType: effectType
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.payMethods = [...data]
                }
            })
        },
        toOrderList () {
            this.$emit('activeComponent', 1)
        },
        // eleChangeHandler () {},
        reduceAmountChange (val, reduceItem) {
            console.log('套购满减：', val, reduceItem)
            if (reduceItem.isChoosePc) {
                this.calculatTotalPromotion()
                this.calculatTotalEle()
                this.calculatAmountList()
                this.collectArbitrageInfo()
            } else {
                return false
            }
        },
        returnAmountChange (val, returnItem) {
            console.log('套购满返：', val, returnItem)
            if (returnItem.isChoosePc) {
                this.calculatTotalPromotion()
                this.calculatTotalEle()
                this.calculatAmountList()
                this.collectArbitrageInfo()
            } else {
                return false
            }
        },
        // 计算单笔订单下电子币总和
        calculatOrderEle (orderCode) {
            if (this.checkedEle[orderCode].length === 0) {
                this.singleList.forEach(order => {
                    if (order.code === orderCode) {
                        order.eleSum = 0
                    }
                })
            } else {
                this.singleList.forEach(order => {
                    if (order.code === orderCode) {
                        order.eleSum = 0
                        order.electronic.forEach(ele => {
                            this.checkedEle[orderCode].forEach(checkedEle => {
                                if (ele.id === checkedEle) {
                                    order.eleSum += ele.actualAmount
                                }
                            })
                        })
                    }
                })
            }
        },
        // 计算单笔订单下的共优惠金额
        calculatorderFreeSum (orderCode) {
            this.singleList.forEach(order => {
                if (order.code === orderCode) {
                    order.discountsAmount = 0
                    order.discountsAmount += order.aUseAmount
                    order.discountsAmount += order.bUseAmount
                    order.discountsAmount += order.manufacturerCouponAmount || 0
                    order.discountsAmount += order.marketCouponAmount || 0
                    if (order.promotionCoupons.length > 0) {
                        order.promotionCoupons.forEach(item => {
                            order.discountsAmount += item.scheduleAmount
                        })
                    }
                    if (order.reduceDefine && JSON.stringify(order.reduceDefine) !== '{}') {
                        order.discountsAmount += order.reduceDefine.actualAmount
                    }
                    order.discountsAmount += order.eleSum
                    console.log('订单下的共优惠金额：', order.discountsAmount)
                }
            })
        },
        // 计算所有订单促销总和
        calculatTotalPromotion () {
            let totalPromotion = 0
            this.singleList.forEach(order => {
                totalPromotion += order.aUseAmount
                totalPromotion += order.bUseAmount
                totalPromotion += order.manufacturerCouponAmount || 0
                totalPromotion += order.marketCouponAmount || 0
                if (order.promotionCoupons.length > 0) {
                    order.promotionCoupons.forEach(item => {
                        totalPromotion += item.scheduleAmount
                    })
                }
                if (order.reduceDefine && JSON.stringify(order.reduceDefine) !== '{}') {
                    totalPromotion += order.reduceDefine.actualAmount
                }
            })
            if (this.chosenArbitrageActivity.shoppingScheduleRuleList.length > 0) {
                this.chosenArbitrageActivity.shoppingScheduleRuleList.forEach(item => {
                // 满减或满免金额
                    if (item.scheduleType === 'schedule_rule_define_schedule_type:5' || item.scheduleType === 'schedule_rule_define_schedule_type:7') {
                        totalPromotion += item.actualAmount
                    }
                })
            }
            this.amountList.subsidiesAmount = totalPromotion
        },
        // 计算所有订单电子币总和
        calculatTotalEle () {
            this.amountList.coinUsed = 0
            this.singleList.forEach(order => {
                this.amountList.coinUsed += order.actualCoinAmount
            })
        },
        // 计算总的折扣金额
        calculatAmountList () {
            this.amountList.discountAmount = this.amountList.coinUsed + this.amountList.subsidiesAmount
            this.amountList.shouldPayAmount = this.amountList.originalAmount - this.amountList.discountAmount
            this.amountList.balanceAmount = this.amountList.shouldPayAmount - this.amountList.actualAmount
        },
        fullClick () {
            this.$refs['fullscreen'].toggle()
        },
        fullscreenChange (fullscreen) {
            this.fullscreen = fullscreen
            this.tbodyHeight = this.$refs.main.clientHeight - 372
            console.log('---------------', this.$refs.main.clientHeight, this.tbodyHeight)
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        },
        toPercent (point) {
            let str = Number(point * 100).toFixed(1)
            str += '%'
            return str
        }
    },
    watch: {
        windowHeight (val) {
            this.height = this.windowHeight - 230 + 'px'
        }
    }
}
</script>

<style lang="less">
@import "../../../../assets/modalStyle.less";
</style>

<style lang="less" scoped>
p {
    margin-bottom: 5px;
}
.fullscreenClass {
    height: 100%;
}
/deep/.modal-pay .ant-modal{
    width: 80vw!important;
    // .ant-modal-body{
    //     max-height: 60vh;
    //     overflow: scroll
    // }
}
/deep/ .ant-table-header {
    background: #408BFF;
    .ant-table-thead > tr > th {
        background: #408BFF;
        color: #fff;
        border: none;
        padding: 16px 6px!important;
    }
}

.settle-box {
    background-color: #eee;
    height: 100%;
    font-size: 12px;
    .header {
        box-sizing: content-box;
        padding: 10px;
        display: flex;
        height: 50px;
        .customer-info {
            height: 40px;
            p {
                color: #408BFF;
                font-size: 14px;
                margin-bottom: 5px;
            }
        }
        .ant-btn{
            height: 40px;
            border: 1px solid #fff;
            border-radius: 10px;
        }
        .search-box {
            flex: 1
        }
    }
    .main {
        width: 100%;
        height: calc(100% - 70px);
        padding: 10px;
        display: flex;
        // background: #eee;
        .left {
            min-width: 290px;
            flex: 1;
            height: 100%;
            margin-right: 5px;
            display: flex;
            flex-direction: column;
            >div {
                width: 100%;
                padding: 10px;
                border-radius: 6px;
                background: #fff;
                margin-bottom: 5px;
            }
            .pay-record {
                flex: 1;
            }
            .sub-amount,
            .amount-list {
                p {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                .ant-divider {
                    margin: 5px 0;
                }
            }
            .pay-methods {
                margin: 0;
                .ant-col-8 {
                    text-align: center;
                }
            }
        }
        .right {
            min-width: 250px;
            flex: 1;
            height: 100%;
            margin-left: 5px;
            display: flex;
            flex-direction: column;
            >div {
                width: 100%;
                border-radius: 6px;
                background: #fff;
            }
            // 顾客权益列表
            .rights-list {
                flex: 1;
                margin-bottom: 5px;
                .rights-header {
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    padding-left: 10px;
                    >div {
                        display: inline-block;
                        width: 4px;
                        height: 14px;
                        border-radius: 2px;
                        background: #408BFF;
                    }
                }
                .right-content {
                    padding: 5px;
                    height: calc(100% - 30px);
                    // max-height: ;
                    overflow-y: auto;
                    .single-right {
                        border: 1px dotted #ccc;
                        margin-bottom: 5px;
                        .single-header {
                            position: relative;
                            height: 40px;
                            line-height: 40px;
                            background-color: rgb(245,249,255);
                            padding-left: 10px;
                            .triangle-topleft{
                              position: absolute;
                              top: 0;
                              left: 0;
                              width: 0;
                              height: 0;
                              border-top: 15px solid #408BFF;
                              border-right: 15px solid transparent;
                            }
                        }
                        .single-content {
                            >div {
                                display: flex;
                                padding-left: 10px;
                                .activity-name {
                                    width: 45px;
                                }
                                .goods {
                                    flex: 1;
                                    p {
                                      margin-bottom: 5px;
                                      height: 20px;
                                      line-height: 20px;
                                      span:first-of-type {
                                          display: inline-block;
                                          width: 90%;
                                          overflow: hidden;
                                          text-overflow:ellipsis;
                                          white-space: nowrap;
                                      }
                                    }
                                }
                            }
                        }
                    }
                    .active {
                        border: 1px dotted #408BFF;
                        border-radius: 2px;
                    }
                }
            }
            // 套购满返/满赠
            .arbitrage {
                flex: 1;
                overflow-y: auto;
                background: #fff;
                padding: 5px;
                .arbitrage-item {
                    margin-bottom: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    overflow: hidden;
                    .arbitrage-item-header {
                        display: flex;
                        position: relative;
                        background-color: #E6E6E6;
                        padding-left: 10px;
                        >div p{
                            margin-bottom: 2px;
                        }
                        .triangle-topleft{
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 0;
                            height: 0;
                            border-top: 15px solid #408BFF;
                            border-right: 15px solid transparent;
                        }
                        .triangle-active {
                            border-top: 15px solid #408BFF;
                        }
                    }
                    .active {
                        background:#f5f9ff;
                        border: none;
                    }
                    .pending-header {
                        background: #F5F9FF;
                    }
                    .arbitrage-item-content {
                        padding-left: 5px;
                        p {
                            margin-bottom: 5px;
                            width: 100%;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
                .pending {
                    border: 1px dashed #408BFF;
                }
                .active {
                    border: 1px solid #408BFF;
                }
            }
        }
        .center {
            height: 100%;
            flex: 3;
            display: flex;
            flex-direction: column;
            // 订单列表
            .order-list {
                height: 70%;
                background: #fff;
                margin-bottom: 5px;
                border-radius: 6px;
                .list-header {
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    padding-left: 10px;
                    >div {
                        display: inline-block;
                        width: 4px;
                        height: 14px;
                        border-radius: 2px;
                        background: #408BFF;
                    }
                }
                .list-content {
                    height: calc(100% - 30px);
                    max-height: calc(100% - 30px);
                    padding: 5px;
                    overflow-y: auto;
                    .list-item {
                        border: 1px dotted #408BFF;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-bottom: 10px;
                        .item-header {
                            background: #F5F9FF;
                            padding: 6px 12px;
                            .goods-info {
                                display: flex;
                                .img-box {
                                    display: flex;
                                    align-content: centerl;
                                    width: 60px;
                                    height: 60px;
                                    background: #fff;
                                    img {
                                        display: inline-block;
                                        width: 100%;
                                        height: auto;
                                    }
                                }
                                .detail-text {
                                    flex: 1;
                                    padding-left: 12px;
                                }
                                .service-list {
                                    width: 200px;
                                    > div {
                                        position: relative;
                                        width: 160px;
                                        height: 24px;
                                        overflow: hidden;
                                        text-overflow:ellipsis;
                                        white-space: nowrap;
                                        line-height: 24px;
                                        background:rgba(255,255,255,1);
                                        border-radius: 2px;
                                        border: 1px solid rgba(64,139,255,1);
                                        .triangle-topleft{
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            width: 0;
                                            height: 0;
                                            border-top: 8px solid #408BFF;
                                            border-right: 8px solid transparent;
                                        }
                                    }
                                }
                            }
                            .delActive {
                                font-size: 14px;
                                font-weight: bold;
                            }
                        }
                        .item-footer {
                            font-size: 12px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 0 20px;
                            height: 30px;
                            line-height: 30px;
                            background: #F5F9FF;
                            .advance-sale {
                                width: 72px;
                                height: 24px;
                                line-height: 24px;
                                text-align: center;
                                background: #408BFF;
                                color: #fff;
                            }
                        }
                        .advance-footer {
                            background: #FFF;
                        }
                        .item-activity {
                            font-size: 12px;
                            padding: 5px 12px;
                            >div {
                                display: flex;
                                margin-bottom: 10px;
                                .item-activity-name {
                                    width: 72px;
                                }
                                .item-activity-list {
                                    flex: 1;
                                    .promotion {
                                        >div {
                                            position: relative;
                                            display: inline-block;
                                            height: 24px;
                                            padding: 2px 0;
                                            margin-right: 10px;
                                            margin-bottom: 5px;
                                            border-radius: 2px;
                                            border: 1px solid #408BFF;
                                            .triangle-topleft{
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                width: 0;
                                                height: 0;
                                                border-top: 8px solid #408BFF;
                                                border-right: 8px solid transparent;
                                            }
                                            span {
                                                display: inline-block;
                                                padding: 0 5px;
                                            }
                                            span:first-of-type {
                                                border-right: 1px solid #E6E6E6;
                                            }
                                        }
                                    }
                                    .ele {
                                        .ele-item {
                                            position: relative;
                                            display: inline-block;
                                            height: 24px;
                                            padding: 2px 0;
                                            margin-right: 10px;
                                            margin-bottom: 5px;
                                            border-radius: 2px;
                                            border: 1px solid #408BFF;
                                            .triangle-topleft{
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                width: 0;
                                                height: 0;
                                                border-top: 8px solid #408BFF;
                                                border-right: 8px solid transparent;
                                            }
                                            span {
                                                display: inline-block;
                                                padding: 0 5px;
                                            }
                                            span:first-of-type {
                                                border-right: 1px solid #E6E6E6;
                                            }
                                        }
                                    }
                                    .ant-checkbox-wrapper.ele-item {
                                        /deep/ .ant-checkbox {
                                            display: none;
                                        }
                                        /deep/ .ant-checkbox + span {
                                            position: relative;
                                            display: block!important;
                                            padding: 2px 0;
                                            font-size: 12px;
                                            border: 1px solid #E6E6E6;
                                            >span{
                                                display: inline-block;
                                                padding: 0 5px;
                                                border-right: 1px solid #E6E6E6;
                                            }
                                            .ant-inout-number {
                                                font-size: 12px;
                                            }
                                            .triangle-topleft{
                                                position: absolute;
                                                top: 0;
                                                left: 0;
                                                width: 0;
                                                height: 0;
                                                border-top: 8px solid #E6E6E6;
                                                border-right: 8px solid transparent;
                                            }
                                        }
                                    }
                                    .ant-checkbox-wrapper-checked.ele-item {
                                        /deep/ .ant-checkbox + span {
                                            border: 1px solid #408BFF!important;
                                            .triangle-topleft{
                                                border-top: 8px solid #408BFF;
                                                border-right: 8px solid transparent;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
            // 套购满免/满减
            .free-sub {
                flex: 1;
                background: #fff;
                padding: 5px;
                border-radius: 6px;
                box-sizing: border-box;
                overflow-y: auto;
                .activity-header {
                    height: 30px;
                    line-height: 30px;
                    font-size: 14px;
                    font-weight: 700;
                    padding-left: 10px;
                    >div {
                        display: inline-block;
                        width: 4px;
                        height: 14px;
                        border-radius: 2px;
                        background: #408BFF;
                    }
                }
                .activity-content {
                    height: calc(100% - 30px);
                    overflow-y: auto;
                    .free-sub-item {
                        border: 1px dotted #ccc;
                        margin-bottom: 5px;
                        border-radius: 4px;
                        font-size: 12px;
                        overflow: hidden;
                        .header {
                            background: rgb(248,248,248);
                            width: 100%;
                            position: relative;
                            height: 40px;
                            line-height: 40px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: normal;
                            padding: 0 10px;
                            .triangle-topleft{
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 0;
                                height: 0;
                                border-top: 15px solid #408BFF;
                                border-right: 15px solid transparent;
                            }
                        }
                        .header-active {
                            background:#f5f9ff;
                        }
                        .pending-header {
                            background: #F5F9FF;
                        }
                        .footer {
                            display: flex;
                            padding: 0 10px;
                            min-height: 56px;
                            justify-content: space-between;
                            >div {
                                padding: 5px;
                            }
                        }
                    }
                    .active {
                        border: 1px solid #408BFF;
                    }
                    .pending {
                        border: 1px dashed #408BFF;
                    }
                }
            }
        }
    }
}
.ant-checkbox-group {
    width: 100%;
}
.wz-container{
  .ant-col-6,
  .ant-col-18 {
    height: 40px;
    line-height: 40px;
    .ant-input-number {
      width: 100%;
    }
  }
  .ant-col-6 {
    text-align: right;
    padding-right: 10px;
  }
}
.goods-list {
  display: flex;
  .item-name {
    width:70px;
  }
  .list-box {
    flex: 1;
    p {
      text-align: left;
    }
  }
}
/deep/ .ant-table-tbody{
    td {
        display: inline-block;
        width: 33.33%;
        padding: 16px 10px;
    }
}
// 表格单元格超出...
.text-overflow {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
// 新百卡/储值卡支付
.xb-box {
  .pay-info {
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
  }
  .card-info {
    div{
      height:32px;
      line-height: 32px;
      span {
        display: inline-block;
        width: 89px;
        text-align: right;
      }
    }
    p {
      display: flex;
      span {
        display: inline-block;
        width: 100px;
        height: 32px;
        line-height: 32px;
        text-align: right;
      }
    }
  }
}
.taxOptions {
    text-align: right;
    .ant-btn-link {
        background: transparent;
        border: none;
        display: inline-block;
        padding: 5px;
    }
}
</style>

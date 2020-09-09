<!--
 * @Description: 结算
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-05-06 10:00:48
 * @LastEditTime: 2019-08-15 15:30:30
 -->
<template>
  <div>
    <div :style="`height:${height}px;overflow:auto;`">
      <!-- 结算商品信息 -->
      <a-card :title="`${settleCustomer.name}`">
        <div>
          <a-row class="settle" v-for="(goods,index) in settleGoods" :key="index">
            <a-col :span="12" class="goods-info">
              <a-col :span="4" class="img-box">
                <!-- <img :src="goods.skuPicture" alt=""> -->
                <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="">
              </a-col>
              <a-col :span="16">
                <p>{{ goods.skuName }}</p>
                <p>{{ goods.skuModel }}</p>
                <p>{{ initPrice(goods.skuActualPrice) }}</p>
              </a-col>
              <a-col :span="4" style="text-align:right;padding-right:10px;">
                <p class="skucode">{{ goods.skuCode }}</p>
                <pre >x{{ goods.skuQuantity }} </pre>
              </a-col>
            </a-col>
            <a-col :span="12" class="ticket">
              <a-row>
                <a-col :span="4" style="font-weight:700">电子券</a-col>
                <a-col :span="4" :offset="16" style="text-align:right;font-size:12px;cursor:pointer;color:rgb(55,173,255)" @click="chooseTicket(goods)">选择电子券></a-col>
              </a-row>
              <a-row :gutter="16" class="chosen-tickets">
                <a-col
                  class="gutter-row"
                  :xs="24"
                  :sm="12"
                  :md="8"
                  :lg="6"
                  v-for="(ticket, i) in ticketsList"
                  v-show="ticket.selectedBy===goods.code"
                  :key="i">
                  <div class="gutter-box" >{{ ticket.scheduleName }}：{{ ticket.useAmount }}</div>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
        <template slot="actions">
          <a-row style="font-size:16px">
            <a-col :span="2">销售金额：</a-col>
            <a-col :span="4" :offset="18" style="">{{ initPrice(shouldPay) }}</a-col>
          </a-row>
        </template>
      </a-card>
      <!-- 套购活动 -->
      <a-card title="套购活动">
        <a href="#" slot="extra" style="text-decoration: none;" @click="openArbitrageActivity">选择套购活动></a>
        <div v-if="shoppingScheduleRuleList.length>0" style="padding:10px 10px 0px 32px">
          <p v-for="(item,index) in shoppingScheduleRuleList" :key="index" >
            <span style="color:#1980ff">{{ item.title }}</span>
          </p>
        </div>
      </a-card>
      <!-- 促销记录 -->
      <a-card class="promotion">
        <Promotion :orderIds="orderIds" @setAmount="setAmount"/>
      </a-card>
      <!-- 应付款金额 -->
      <a-card class="should-pay">
        <a-row>
          <a-col :span="2" style="font-size:16px;color:rgba(0,0,0,0.85)">应付款金额</a-col>
          <a-col :span="4" :offset="18" style="text-align:right;padding-right:10px;color:rgb(55,173,255);">{{ initPrice(actualPay) }}</a-col>
        </a-row>
      </a-card>
      <!-- 收款记录 -->
      <a-card class="receive" v-if="payRecord.length>0">
        <a-row>
          <div style="font-size:16px;color:rgba(0,0,0,0.85)">收款记录</div>
          <div class="pay-list">
            <p v-for="(item,index) in payRecord" :key="index">
              <span class="pay-type-name">{{ item.payTypeName }}:</span>
              <span class="pay-type-amount">{{ initPrice(item.payAmount) }}</span>
            </p>
          </div>
        </a-row>
      </a-card>
      <!-- 尾款金额 -->
      <a-card class="left-pay">
        <a-row>
          <a-col :span="2" style="font-size:16px;color:rgba(0,0,0,0.85)">尾款金额</a-col>
          <a-col :span="4" :offset="18" style="text-align:right;padding-right:10px;color:rgb(55,173,255);">{{ initPrice(unPay) }}</a-col>
        </a-row>
      </a-card>
      <!-- 收款方式 -->
      <a-card title="选择收款方式">
        <a-row class="pay-methods">
          <a-col :span="4" v-for="(method,mi) in payMethods" :key="mi" @click="toPay(method)">
            <img src="../images/loan.png" width="24">
            <p>{{ method.description }}</p>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <!-- 电子券列表 -->
    <a-drawer
      placement="right"
      :closable="false"
      :width="400"
      @close="onTicketListClose"
      :visible="ticketVisible"
    >
      <div class="list-header">
        <p>{{ settleCustomer.name }}的电子账户</p>
        <div>
          <p>
            可用券额度：
            <a-input-number
              size="small"
              :min="1"
              :max="orderTickets.maxAmount"
              v-model="scheduleRuleUseList[scheduleIndex].canUseAmount"
              :disabled="orderTickets.isChange==='1'?false:true"
              @change="value => amountChangeHandler(value,orderTickets.maxAmount)" />
          </p>
          <p class="used">已选电子券额度：{{ selectedAmount }}</p>
          <p>初始券额度：{{ initalAmount }}</p>
        </div>
      </div>
      <div class="wrapper" v-for="(ticket,index) in ticketsList" :key="index" @click="selectTicket(ticket)">
        <div :class="[content, ticket.selected ? 'gray': '']">
          <p class="ticket-name">{{ ticket.scheduleName }}</p>
          <p class="data-validity">有效期至：{{ ticket.endTime }}</p>
        </div>
        <div class="divider"></div>
        <div :class="[amount, ticket.selected ? 'gray': '']">
          {{ initPrice(ticket.useAmount) }}
        </div>
      </div>
    </a-drawer>
    <!-- 套购活动列表 -->
    <a-drawer
      placement="right"
      :closable="false"
      :width="400"
      @close="onArbitrageActivityClose"
      :visible="arbitrageActivityVisible"
      :zIndex="1111"
    >
      <ArbitrageActivity
        @onArbitrageActivityClose="onArbitrageActivityClose"
        @setArbitrageData="setArbitrageData"
        :orderCodeList="orderIds"
        ref="ArbitrageActivity"/>
    </a-drawer>
    <!-- 分期贷 -->
    <a-modal
      title="分期贷"
      v-model="loanModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="loanCancel">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
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
              <a-select style="width: 100%" v-decorator="$check('loan.company', {initialValue:loanCompanyDefault.value})" :options="loanCompany" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">分期产品:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 100%" v-decorator="$check('loan.type', {initialValue:loanProDefault.value})" :options="loanPro" allowClear/>
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
    <!-- 贷款成功 -->
    <a-modal
      title="收款成功"
      v-model="loanedModal"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="cancelPay">
          取消
        </a-button>
        <a-button type="primary" @click="continuePay" v-if="loanLeft > 0">
          继续付款
        </a-button>
        <a-button type="primary" @click="showTaxInfo(settleCustomer,settleGoods)" v-if="loanLeft === 0">
          打印发票
        </a-button>
        <a-button type="primary" @click="toPrintTicket()" v-if="loanLeft === 0">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ this.payedInfo.payedNumber }}</p>
      <p><span>本次收款：</span>{{ this.payedInfo.payAmount }}</p>
      <p><span>尾款金额：</span>{{ Number(this.loanLeft).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ this.payedInfo.payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
      </div>
    </a-modal>
    <!-- 款台收款成功 -->
    <a-modal
      title="收款成功"
      v-model="payedModal"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="cashPayedConfirm">
          关闭
        </a-button>
        <a-button type="primary" @click="showTaxInfo(settleCustomer,settleGoods)">
          打印发票
        </a-button>
        <a-button type="primary" @click="toPrintTicket()">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ this.payedInfo.payedNumber }}</p>
      <p><span>应付款金额：</span>{{ Number(this.payedInfo.payAmount).toFixed(2) }}</p>
      <p><span>收款金额：</span>{{ Number(this.payedInfo.payAmount).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ this.payedInfo.payTime }}</p>
    </a-modal>
    <!-- 款台支付打印小票 -->
    <a-modal
      title="小票打印"
      v-model="cashTicketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box">
        <CashTicket :ticketInfo="ticketInfo"></CashTicket>
      </div>
    </a-modal>
    <!-- 非款台支付打印小票 -->
    <a-modal
      title="小票打印"
      v-model="ticketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box">
        <Ticket :ticketInfo="ticketInfo"></Ticket>
      </div>
    </a-modal>
    <!-- 顾客发票信息列表模态框 -->
    <a-modal
      :title="taxTitle"
      v-model="taxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button key="back" @click="() => {this.taxModal = false}">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click.stop="addEditTax(-1)">
          新增发票
        </a-button>
      </template>
      <div>
        <a-collapse accordion v-if="customerTaxInfo&&customerTaxInfo.length>0">
          <a-collapse-panel v-for="(item,index) in customerTaxInfo" :key="index">
            <template slot="header">
              <a-row>
                <a-col :span="6">{{ item.invoiceName }}</a-col>
                <a-col :span="4" :offset="14" class="taxOptions">
                  <a href="#" @click="toPrintInvoice(item)">打印</a>
                  <a href="#" @click.stop="addEditTax(0, item)">编辑</a>
                  <a href="#" @click.stop="delTaxInfo(item.id)">删除</a>
                </a-col>
              </a-row>
            </template>
            <div v-if="item.type===0">
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
    <!-- 打印发票 -->
    <a-modal
      title="发票打印"
      v-model="invoiceModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="printTicketCancel">取消</a-button>
        <a-button @click="printTag" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box" >
        <div style="margin-top:80px" v-for="(item,index) in returnInvoiceInfo" :key="index">
          <Invoice :invoiceInfo="item"></Invoice>
        </div>
      </div>
    </a-modal>
    <!-- 新增/编辑发票信息模态框 -->
    <a-modal
      :title="addEditTaxTitle"
      v-model="addEditTaxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="addEditTaxModal=false">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button>关闭</a-button>
        </a-popconfirm>
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
    <!-- 新百卡支付 -->
    <a-modal
      :title="cardPayTitle"
      v-model="cardModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" @click="cardPayCancel">取消</a-button>
        <a-button @click="pay(payType, cardAmount, unPay)" :loading="loading" type="primary">
          确定
        </a-button>
      </template>
      <div class="xb-box" >
        <div class="pay-info">
          <p>
            <span>消费总费用：</span>
            {{ Number(actualPay).toFixed(2) }}
          </p>
          <p>
            <span>尾款：</span>
            {{ Number(unPay).toFixed(2) }}
          </p>
        </div>
        <a-divider />
        <div class="card-info">
          <div><span>刷卡信息：</span></div>
          <div>
            <span>卡余额：</span>
            {{ Number(cardBalance).toFixed(2) }}
          </div>
          <p>
            <span>实付额：</span>
            <a-input placeholder="0.0" v-model="cardAmount"/>
          </p>
          <p v-if="payType==='shopping_pay_record_pay_type:4'">
            <span>校验码：</span>
            <a-input placeholder="新百卡末四位" v-model="cardNo"/>
          </p>
        </div>
      </div>
    </a-modal>
    <!-- 新百卡支付成功 -->
    <a-modal
      title="收款成功"
      v-model="cardPayedModel"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" :loading="loading" @click="cardCancelPay">
          取消
        </a-button>
        <a-button type="primary" :loading="loading" @click="cardContinuePay" v-if="unPay > 0">
          继续付款
        </a-button>
        <a-button type="primary" :loading="loading" @click="showTaxInfo(settleCustomer,settleGoods)" v-if="unPay === 0.00">
          打印发票
        </a-button>
        <a-button type="primary" :loading="loading" @click="toPrintTicket()" v-if="unPay === 0.00">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ payedInfo.payedNumber }}</p>
      <p><span>应付款金额：</span>{{ actualPay }}</p>
      <p><span>尾款金额：</span>{{ unPay }}</p>
      <p><span>支付时间：</span>{{ payedInfo.payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
      </div>
    </a-modal>
    <!-- 微信/支付宝支付 -->
    <a-modal
      :title="wzTitle"
      v-model="wzModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button @click="wzCancelPay">关闭</a-button>
        <a-button
          type="primary"
          :loading="loading"
          :disabled="magneticStripe.length!==18"
          @click="pay(payType, wzAmount, unPay)">确定</a-button>
      </template>
      <div class="wz-container">
        <a-row>
          <a-col :span="6">当前收款金额</a-col>
          <a-col :span="18">
            <a-input-number v-model="wzAmount" :max="Number(unPay)" @change="wzAmountChange"/>
          </a-col>
          <a-col :span="6">扫码流水号</a-col>
          <a-col :span="18">
            <a-input placeholder="请扫描顾客支付码" v-model="magneticStripe"></a-input>
          </a-col>
          <a-col :span="6">剩余金额：</a-col>
          <a-col :span="18">{{ Number(unPay - wzAmount).toFixed(2) }}</a-col>
        </a-row>
      </div>
    </a-modal>
    <!-- 微信/支付宝支付成功 -->
    <a-modal
      title="收款成功"
      v-model="wzPayedModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" :loading="loading" @click="cancelPay">
          取消
        </a-button>
        <a-button type="primary" :loading="loading" @click="wzContinuePay" v-if="unPay > 0">
          继续付款
        </a-button>
        <a-button type="primary" :loading="loading" @click="showTaxInfo(settleCustomer,settleGoods)" v-if="unPay === 0">
          打印发票
        </a-button>
        <a-button type="primary" :loading="loading" @click="toPrintTicket()" v-if="unPay === 0">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ payedInfo.payedNumber }}</p>
      <p><span>本次收款：</span>{{ Number(wzAmount).toFixed(2) }}</p>
      <p><span>尾款金额：</span>{{ Number(unPay).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ payedInfo.payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import moment from 'moment'
import print from 'print-js'
import card from '@/utils/card'
import VueBarcode from '@chenfengyuan/vue-barcode'
import jrQrcode from 'jr-qrcode'
import CashTicket from './CashTicket'
import Invoicetpl from './Invoicetpl'
import Ticket from './Ticket'
import Promotion from './Promotion'
import ArbitrageActivity from './ArbitrageActivity'
import { lowToUp } from '@utils/util'
export default {
    name: 'SettleOld',
    components: {
        VueBarcode,
        CashTicket,
        Invoicetpl,
        Ticket,
        Promotion,
        ArbitrageActivity
    },
    props: {
        settleCustomer: {
            type: Object,
            required: true,
            default: () => {}
        },
        settleGoods: {
            type: Array,
            required: true,
            default: () => []
        },
        height: {
            type: Number,
            required: true,
            default: 0
        },
        settleFromFlag: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            wzPayedModal: false,
            wzTitle: '',
            wzModal: false,
            wzAmount: 0,
            payType: '',
            cardModal: false,
            cardPayedModel: false,
            // 新百卡余额
            cardBalance: 0,
            cardAmount: 0.00,
            cardNo: '',
            radioValue: 0,
            isAdd: false,
            loading: false,
            // 促销记录单品活动
            shoppingScheduleRuleList: [],
            shoppingSaleRecordList: [],
            //  促销记录AB账户使用记录
            use: [],
            // 收款记录
            payRecord: [],
            // 支付方式
            payMethods: [],
            shouldPay: 0,
            actualPay: 0,
            unPay: 0,
            // 分期贷
            loanForm: this.$form.createForm(this),
            loanModal: false,
            loanLeft: 0,
            // 分期贷公司：
            loanCompany: [],
            loanCompanyDefault: {},
            // 分期贷产品
            loanPro: [],
            loanProDefault: {},
            // 付款金额
            payAmount: 0,
            // 电子券列表标识
            ticketVisible: false,
            // 要选择电子券的订单
            orderTickets: {},
            // 初始券额度
            initalAmount: 0,
            // 已选电子券额度
            selectedAmount: 0,
            ticketsList: [],
            // 电子券样式类名
            content: 'content',
            amount: 'amount',
            gray: 'gray',
            // 选择的电子券Code
            orderCode: '',
            // 保存电子券
            saveScheduleRuleList: [],
            scheduleRuleUseList: [{}],
            // 结算中档期规则集合
            scheduleList: [],
            // 结算中电子券和档期规则是否保存
            isSaved: false,
            // 付款后返回信息
            payedInfo: {},
            // 款台付款信息标识
            payedModal: false,
            cashTicketModal: false,
            // 顾客税票列表标识
            taxModal: false,
            // 发票打印预览标识
            invoiceModal: false,
            // 顾客税票列表
            customerTaxInfo: [],
            // 返回的税票信息
            returnInvoiceInfo: [],
            // 打印税票中订单号集合
            printTaxCode: [],
            taxCustomerId: '',
            // 打印小票信息
            ticketInfo: {},
            // 新增/编辑税票信息标识
            addEditTaxModal: false,
            addEditTaxTitle: '',
            addEditTaxInfo: {},
            taxForm: this.$form.createForm(this),
            loanedModal: false,
            ticketModal: false,
            scheduleIndex: 0,
            cardPayTitle: '',
            magneticStripe: '',
            disableEdit: false,
            cardName: '',
            taxTitle: '',
            lastTime: new Date().getTime(),
            nextTime: new Date().getTime(),
            lastCode: '',
            nextCode: '',
            orderIds: [],
            amountList: {},
            arbitrageActivityVisible: false,
            // 电子券总金额
            totalTicketAmount: 0,
            // 套购总金额
            totalArbitrageAmount: 0
        }
    },
    mounted () {
        // this.$nextTick(() => {
        //     document.addEventListener('keypress', (e) => {
        //         this.nextCode = e.which
        //         this.nextTime = new Date().getTime()
        //         if (this.lastCode != null && this.lastTime != null && this.nextTime - this.lastTime <= 99) {
        //             this.magneticStripe += String.fromCharCode(this.lastCode)
        //             console.log(this.magneticStripe)
        //         } else if (this.lastCode != null && this.lastTime != null && this.nextTime - this.lastTime > 100) {
        //             this.magneticStripe = ''
        //         }
        //         this.lastCode = this.nextCode
        //         this.lastTime = this.nextTime
        //     })
        // })
        this.settleGoods.forEach(item => {
            this.orderIds.push(item.code)
        })
        // this.querySumActivity()
        this.queryPayMethods()
        this.queryLoanCompany()
        this.queryLoanPro()
        if (this.settleFromFlag === 1) {
            // 从未完成进入
            this.queryScheduleRule()
            this.queryPayRecord()
        } else {
            this.getTickets()
        }
    },
    methods: {
        async addArbitrage () {
            const res = await axios({
                path: 'ShoppingScheduleAddArbitrage',
                method: 'post',
                body: {
                    shoppingScheduleRuleList: this.shoppingScheduleRuleList,
                    shoppingSaleRecordList: this.shoppingSaleRecordList
                }
            })
            if (res.flag === 1) {
                console.log(res.data)
            }
        },
        // 套购活动抽屉关闭
        onArbitrageActivityClose () {
            this.$emit('setWrapStyle', false)
            this.arbitrageActivityVisible = false
        },
        setArbitrageData (data) {
            console.log('传入的套购活动信息', data)
            this.unPay = this.amountList.unPay
            this.actualPay = this.amountList.actualPay
            this.arbitrageActivityVisible = false
            this.totalArbitrageAmount = 0
            if (data[0].length > 0) {
                data[0].forEach(item => {
                    if (item.scheduleType === 'schedule_rule_define_schedule_type:5' || item.scheduleType === 'schedule_rule_define_schedule_type:7') {
                        this.totalArbitrageAmount += item.scheduleAmount
                    } else {
                        this.totalArbitrageAmount = 0
                    }
                })
                data[0].forEach(item => {
                    if (item.scheduleType === 'schedule_rule_define_schedule_type:5') {
                        item.title = `满${item.reachAmount} 减 ${item.rateAmount}  实际减：${item.scheduleAmount}`
                    } else if (item.scheduleType === 'schedule_rule_define_schedule_type:4') {
                        item.title = `满${item.reachAmount} 返 ${item.rateAmount}  实际返：${item.scheduleAmount}`
                    }
                })
                this.shoppingScheduleRuleList = data[0]
                this.shoppingSaleRecordList = data[1]
            } else {
                this.shoppingScheduleRuleList = []
                this.unPay = this.amountList.unPay
                this.actualPay = this.amountList.actualPay
                this.totalArbitrageAmount = 0
            }
            this.actualPay = this.actualPay - this.totalArbitrageAmount - this.totalTicketAmount
            this.unPay = this.unPay - this.totalArbitrageAmount - this.totalTicketAmount
        },
        setAmount (data) {
            this.amountList = data
            this.shouldPay = data.shouldPay
            this.actualPay = data.actualPay
            this.unPay = data.actualPay
        },
        wzAmountChange (val) {
            if (val > this.unPay) {
                this.$message.warning('付款金额不能大于尾款')
            }
        },
        // 微信/支付宝支付取消
        wzCancelPay () {
            this.wzAmount = 0
            this.magneticStripe = ''
            this.queryPayRecord()
            this.wzModal = false
        },
        cardContinuePay () {
            if (this.unPay > 0) {
                this.queryPayRecord()
                this.cardPayedModel = false
                this.cardBalance = this.cardAmount = 0
                this.cardNo = ''
            } else {
                this.$message.warning('支付金额不能大于尾款金额')
                this.cardPayedModel = false
                this.onSettlementClose()
            }
        },
        // 去支付
        toPay (methods) {
            if (this.unPay > 0) {
                if (methods.description === '分期贷款支付') {
                    this.queryLoanCompany()
                    this.queryLoanPro()
                    this.loanModal = true
                } else if (methods.description === '款台支付') {
                    this.payType = 'shopping_pay_record_pay_type:7'
                    let balanceAmount = 0
                    this.payAmount = balanceAmount = this.actualPay
                    this.pay(this.payType, this.payAmount, balanceAmount)
                } else if (methods.description === '新百卡支付') {
                    this.cardPayTitle = '新百卡支付'
                    this.payType = 'shopping_pay_record_pay_type:4'
                    this.cardModal = true
                    card.onRead((res, err) => {
                        if (!err) {
                            console.log(res)
                            this.magneticStripe = res
                            this.queryXinBaiCardInfo(res)
                            card.readStop()
                        }
                    })
                } else if (methods.description === '储值卡支付') {
                    this.cardPayTitle = '储值卡支付'
                    this.magneticStripe = '1094834b-2819-12ae-db54-9978774096e5'
                    this.payType = 'shopping_pay_record_pay_type:9'
                    this.queryValueCardBalance()
                } else if (methods.value === 'alipay') {
                    this.payType = 'shopping_pay_record_pay_type:2'
                    this.wzTitle = '支付宝支付'
                    this.wzAmount = this.unPay
                    this.wzModal = true
                } else if (methods.value === 'wechat_pay') {
                    this.payType = 'shopping_pay_record_pay_type:3'
                    this.wzTitle = '微信支付'
                    this.wzAmount = this.unPay
                    this.wzModal = true
                }
            } else {
                this.$message.warning('支付已完成')
            }
        },
        // 支付
        pay (payType, payAmount, balanceAmount) {
            if (!this.isSaved) {
                this.addScheduleRule()
                this.addArbitrage()
                this.isSaved = true
            }
            if (payType === 'shopping_pay_record_pay_type:4') {
                this.loading = true
                if (this.cardAmount <= 0) {
                    this.$message.warning('请输入合法金额')
                    this.loading = false
                    return false
                } else if (this.cardAmount > this.unPay) {
                    this.$message.warning('实付额不能大于尾款金额')
                    this.loading = false
                    return false
                } else if (this.cardNo === '') {
                    this.$message.warning('请输入新百卡末四位')
                    this.loading = false
                    return false
                } else if (this.magneticStripe === '') {
                    this.$message.warning('请刷卡')
                    this.loading = false
                    return false
                }
            } else if (payType === 'shopping_pay_record_pay_type:9') {
                this.loading = true
                if (this.cardAmount <= 0) {
                    this.$message.warning('请输入合法金额')
                    this.loading = false
                    return false
                } else if (this.cardAmount > this.unPay) {
                    this.$message.warning('实付额不能大于尾款金额')
                    this.loading = false
                    return false
                }
            } else if (payType === 'shopping_pay_record_pay_type:2' || payType === 'shopping_pay_record_pay_type:3') {
                if (this.magneticStripe.length !== 18) {
                    this.loading = false
                    this.magneticStripe = ''
                    this.$message.warning('错误条形码')
                    return false
                }
            }
            const payParams = {}
            payParams.orderIds = []
            this.settleGoods.forEach(item => {
                payParams.orderIds.push(item.code)
            })
            payParams.payType = payType
            payParams.storeId = this.$store.getters.storeInfo.code
            payParams.guideCode = this.$store.getters.userInfo.code
            payParams.guideName = this.$store.getters.userInfo.name
            payParams.payAmount = payAmount
            payParams.shouldAmount = this.shouldPay
            payParams.actualAmount = this.actualPay
            payParams.balanceAmount = balanceAmount
            payParams.customerId = this.settleCustomer.customerId
            payParams.cardNo = this.cardNo
            payParams.cardName = this.cardName
            payParams.magneticStripe = this.magneticStripe
            axios({
                path: 'ApiPaymentPayShoppingTrolley',
                method: 'POST',
                body: payParams
            }).then(async res => {
                if (res.flag === 1) {
                    this.totalTicketAmount = 0
                    this.totalArbitrageAmount = 0
                    this.disableEdit = true
                    this.payedInfo.payTime = moment(res.data.payTime).format('YYYY-MM-DD HH:mm:ss')
                    this.payedInfo.payedNumber = res.data.payNumber
                    this.payedInfo.payAmount = Number(payAmount).toFixed(2)
                    this.unPay = Number(Number(res.data.balanceAmount).toFixed(2))
                    if (this.shoppingSaleRecordList.length > 0) {
                        this.shoppingSaleRecordList.forEach(item => {
                            item.payNumber = this.payedInfo.payedNumber
                        })
                    }
                    if (!this.isSaved) {
                        await this.addScheduleRule()
                        await this.addArbitrage()
                        this.isSaved = true
                    }
                    if (payType === 'shopping_pay_record_pay_type:7') {
                        this.payedModal = true
                    } else if (payType === 'shopping_pay_record_pay_type:4') {
                        if (this.unPay === 0.00) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedInfo.payedNumber)
                        }
                        this.cardAmount = 0.0
                        this.magneticStripe = ''
                        this.cardModal = false
                        this.cardBalance = 0
                        this.cardPayedModel = true
                        this.loading = false
                    } else if (payType === 'shopping_pay_record_pay_type:9') {
                        if (this.unPay === 0.00) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedInfo.payedNumber)
                            this.cardPayedModel = true
                        }
                        this.queryValueCardBalance()
                        this.loading = false
                    } else if (payType === 'shopping_pay_record_pay_type:2' || payType === 'shopping_pay_record_pay_type:3') {
                        if (this.unPay === 0) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedInfo.payedNumber)
                        }
                        this.payAmount = this.wzAmount
                        this.wzModal = false
                        this.magneticStripe = ''
                        this.wzPayedModal = true
                    } else {
                        if (this.loanLeft === 0) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedInfo.payedNumber)
                        }
                        this.loanedModal = true
                    }
                }
            })
        },
        // 保存活动
        async addScheduleRule () {
            const ids = [] // 券id
            this.saveScheduleRuleList.forEach(item => {
                ids.push(item.id)
                item.scheduleRuleCode = item.scheduleCode
                item.scheduleRuleName = item.scheduleName
                item.shoppingTrolleyCode = this.orderTickets.shoppingTrolleyCode
                item.rateProvider = this.orderTickets.rateProvider
                item.makeStoreCode = this.$store.getters.storeInfo.code
                item.rateAmount = item.useAmount
                item.customerCouponId = item.id
            })
            this.getUniqueScheduleList()
            this.saveScheduleRuleList = this.saveScheduleRuleList.concat(this.scheduleList)
            this.saveScheduleRuleList.forEach(item => {
                delete item.id
                delete item.startTime
                delete item.endTime
                delete item.updateTime
            })
            if (this.saveScheduleRuleList.length > 0) {
                // 选中了电子券调用保存接口
                console.log('保存活动：', this.saveScheduleRuleList)
                const res = await axios({
                    path: 'ShoppingScheduleAddScheduleRule',
                    method: 'POST',
                    body: {
                        ids: ids, // 活动id集合
                        shoppingScheduleRuleList: this.saveScheduleRuleList // 活动信息集合
                    }
                })
                if (res.flag === 1) {
                    console.log('订单选择的活动:', res.data)
                    this.saveScheduleRuleList = []
                    this.scheduleRuleUseList = [{}]
                }
            }
        },
        // 对象数组去重
        getUniqueScheduleList () {
            const tempArr = []
            const result = []
            const obj = {}
            this.saveScheduleRuleList.forEach(item => {
                this.scheduleRuleUseList.forEach(subItem => {
                    if (item.selectedBy === subItem.shoppingTrolleyCode) {
                        tempArr.push(subItem)
                    }
                })
            })
            console.log('tempArr', tempArr)
            for (let i = 0; i < tempArr.length; i++) {
                if (!obj[tempArr[i].shoppingTrolleyCode]) {
                    result.push(tempArr[i])
                    obj[tempArr[i].shoppingTrolleyCode] = true
                }
            }
            console.log('去重的活动规则信息集合：', result, this.settleGoods)
            result.forEach(schedule => {
                schedule.scheduleRuleCode = schedule.code
                schedule.scheduleRuleName = schedule.name
                schedule.scheduleEffectType = schedule.effectType
                schedule.makeStoreCode = this.$store.getters.storeInfo.code
                schedule.scheduleAmount = schedule.canUseAmount
                // schedule.rateAmount = this.initalAmount
                this.settleGoods.forEach(goods => {
                    if (goods.code === schedule.shoppingTrolleyCode) {
                        schedule.providerCode = goods.contractCode
                        schedule.contractCode = goods.providerCode
                    }
                })
            })
            this.scheduleList = result
        },
        // 新百卡支付取消监听
        cardPayCancel () {
            this.cardNo = ''
            this.cardAmount = 0.00
            this.cardBalance = 0
            if (this.actualPay !== this.unPay) {
                this.queryPayRecord()
            }
            this.cardModal = false
        },
        // 新百卡支付成功取消
        cardCancelPay () {
            this.cardPayedModel = false
            this.cardModal = false
            this.cardBalance = 0
            this.cardNo = ''
            this.cardAmount = 0
            this.cardAmount = 0
            this.$emit('refresh')
        },
        // 查询新百卡信息
        queryXinBaiCardInfo () {
            axios({
                path: 'ApiXinBaiPayQueryXinBaiCardInfo',
                method: 'POST',
                body: {
                    magneticStripe: '940195036409515197305184909868599316'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询到的新百卡信息：', res.data)
                    this.cardBalance = res.data.balance
                    this.cardModal = true
                }
            })
        },
        // 查询储值卡信息
        queryValueCardBalance () {
            axios({
                path: 'ShoppingValueCardPayQueryValueCardBalance',
                method: 'POST',
                body: {
                    magneticStripe: '1094834b-2819-12ae-db54-9978774096e5'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询到的储值卡信息：', res.data)
                    this.cardBalance = Number(res.data.actualAmount)
                    this.cardNo = res.data.cardNo
                    this.cardName = res.data.typeName
                    this.cardModal = true
                }
            })
        },
        // 取消打印
        printTicketCancel () {
            this.ticketModal = false
            this.cashTicketModal = false
            this.invoiceModal = false
        },
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        // 小票预览
        toPrintTicket (payNumber) {
            const orderIds = []
            if (payNumber) {
                payNumber.shoppingTrolleyDetailList.forEach(item => {
                    orderIds.push(item.code)
                })
            } else {
                this.settleGoods.forEach(item => {
                    orderIds.push(item.code)
                })
            }
            axios({
                path: 'ApiPaymentQueryPrintPayInfo',
                method: 'post',
                body: {
                    orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询到小票信息', res.data)
                    this.ticketInfo = res.data
                    this.updateTime = res.data.orderInfoList[0].updateTime
                    this.ticketPayNumber = res.data.orderInfoList[0].payNumber
                    this.cashierCode = res.data.orderInfoList[0].cashierCode
                    this.cashierNmae = res.data.orderInfoList[0].cashierNmae
                    if (this.ticketInfo.shoppingPayRecordList[0].payType === 'shopping_pay_record_pay_type:7') {
                        this.customerName = res.data.customerName
                        this.cashTicketModal = true
                    } else {
                        this.ticketModal = true
                    }
                }
            })
        },
        // 税票预览
        toPrintInvoice (invoiceInfo) {
            console.log('要打印的税票信息', invoiceInfo)
            if (invoiceInfo.type === 1) {
                invoiceInfo.invoiceCode = ''
                invoiceInfo.bankName = ''
                invoiceInfo.bankCode = ''
            }
            axios({
                path: 'NuonuoInvoiceRequestBilling',
                method: 'post',
                body: {
                    orderIds: this.printTaxCode,
                    invoiceType: 1,
                    operationType: 2,
                    customerInvoiceInfo: invoiceInfo
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.orderInfo.upActualPrice = lowToUp(item.orderInfo.actualPay)
                        item.src = jrQrcode.getQrBase64(item.invoiceSerialNum, {
                            width: 100,
                            height: 100
                        })
                    })
                    this.returnInvoiceInfo = data
                    console.log('查询到的发票信息', this.returnInvoiceInfo)
                    this.invoiceModal = true
                }
            })
        },
        // 发票信息提交
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
                    values.customerId = this.taxCustomerId
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerInvoice' : 'CustomerManageUpdateCustomerInvoice',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditTaxModal = false
                            this.getCustomerTalkRecord()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 删除发票信息
        delTaxInfo (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'CustomerManageDelCustomerInvoice',
                        method: 'post',
                        body: {
                            id: id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.getCustomerTalkRecord()
                        }
                    })
                }
            })
        },
        // 新增/编辑税票
        addEditTax (index, item) {
            console.log('-------------', item)
            if (index === -1) {
                this.isAdd = true
                this.addEditTaxTitle = '新增发票信息'
            } else {
                this.isAdd = false
                this.addEditTaxInfo = item
                this.radioValue = item.type
                this.addEditTaxTitle = '编辑发票信息'
            }
            this.addEditTaxModal = true
        },
        // 展示税票列表
        showTaxInfo (customer, orderInfo) {
            this.taxTitle = customer.name + '的税票信息'
            const orderIds = []
            if (orderInfo.length > 0) {
                orderInfo.forEach(item => {
                    orderIds.push(item.code)
                })
            } else {
                orderIds.push(orderInfo.code)
            }
            this.printTaxCode = orderIds
            this.taxCustomerId = customer.id
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerId: customer.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('用户税票信息：', res.data)
                    this.customerTaxInfo = res.data
                    this.taxModal = true
                }
            })
        },
        // 款台付款成功关闭
        cashPayedConfirm () {
            this.payedModal = false
            this.$emit('refresh')
        },
        // 可用额度变化监听
        amountChangeHandler (val, maxAmount) {
            if (val > maxAmount) {
                this.$message.warning('可用额度不能超过上限')
            }
            this.orderTickets.scheduleAmount = val
            this.saveScheduleRuleList = this.saveScheduleRuleList.filter(item => item.selectedBy !== this.orderTickets.shoppingTrolleyCode)
            this.ticketsList.forEach(item => {
                if (item.selectedBy === this.orderTickets.shoppingTrolleyCode) {
                    item.selectedBy = ''
                    item.scheduleAmount = 0
                    item.selected = false
                }
            })
            this.selectedAmount = 0
        },
        // 选择电子券
        selectTicket (ticket) {
            console.log('电子券----：', ticket)
            if (ticket.selectedBy === '') {
                // 该电子券没有被选中记录
                if (this.selectedAmount < this.scheduleRuleUseList[this.scheduleIndex].canUseAmount) {
                    ticket.selectedBy = this.orderCode
                    ticket.selected = true
                    this.selectedAmount += ticket.useAmount
                    if (this.selectedAmount > this.scheduleRuleUseList[this.scheduleIndex].canUseAmount) {
                        // 最后一张券的实际使用额度
                        ticket.scheduleAmount = ticket.useAmount - (this.selectedAmount - this.scheduleRuleUseList[this.scheduleIndex].canUseAmount)
                    } else {
                        ticket.scheduleAmount = ticket.useAmount
                    }
                    this.saveScheduleRuleList.push(ticket)
                    console.log('要保存的电子券：', this.saveScheduleRuleList)
                } else {
                    this.$message.warning('已达到可用券额度')
                    return false
                }
                this.settleGoods.forEach(item => {
                    if (item.code === this.orderCode) {
                        item.selectedAmount = this.selectedAmount
                    }
                })
            } else {
                // 该电子券有被选中记录
                if (ticket.selectedBy === this.orderCode) {
                    ticket.selected = false
                    ticket.selectedBy = ''
                    ticket.scheduleAmount = 0
                    this.selectedAmount -= ticket.useAmount
                    this.saveScheduleRuleList.forEach((item, index) => {
                        if (item.selectedBy === ticket.selectedBy) {
                            this.saveScheduleRuleList.splice(index, 1)
                            return true
                        }
                    })
                    console.log('要保存的电子券：', this.saveScheduleRuleList)
                    this.settleGoods.forEach(item => {
                        if (item.code === this.orderCode) {
                            item.selectedAmount = this.selectedAmount
                        }
                    })
                } else {
                    this.$message.warning('其他订单已使用该优惠券')
                    return false
                }
            }
        },
        // 打开电子券列表
        chooseTicket (goods) {
            console.log('909090909090', goods)
            if (this.disableEdit === 1) {
                // 由未完成页面进入
                this.$message.warning('当前只允许付款操作')
                return false
            } else {
                const tempArr = []
                console.log(this.scheduleRuleUseList)
                this.scheduleRuleUseList.forEach((item, index) => {
                    if (item.shoppingTrolleyCode === goods.code) {
                        this.scheduleIndex = index
                        item.standard = item.reachUnitPrice
                        item.rateAmount = item.shouldRateAmount
                        tempArr.push(item)
                    }
                })
                console.log('筛选：', tempArr)
                if (tempArr.length > 0) {
                    this.orderCode = goods.code
                    this.selectedAmount = goods.selectedAmount
                    this.orderTickets = { ...tempArr[0] }
                    this.initalAmount = this.orderTickets.shouldRateAmount
                    this.$emit('setWrapStyle', true)
                    this.ticketVisible = true
                } else {
                    this.$message.warning('没有可用的电子券')
                    return false
                }
            }
        },
        // 电子券列表关闭
        onTicketListClose () {
            this.actualPay = this.amountList.actualPay
            this.unPay = this.amountList.unPay
            this.totalTicketAmount = 0
            this.ticketsList.forEach(item => {
                if (item.scheduleAmount) {
                    this.totalTicketAmount += item.scheduleAmount
                }
            })
            this.actualPay = this.actualPay - this.totalArbitrageAmount - this.totalTicketAmount
            this.unPay = this.unPay - this.totalArbitrageAmount - this.totalTicketAmount
            this.initalAmount = 0
            this.ticketVisible = false
            this.$emit('setWrapStyle', false)
        },
        // 分期贷继续付款
        continuePay () {
            if (this.loanLeft > 0) {
                // 获取付款记录
                this.queryPayRecord()
                this.loanedModal = false
            } else {
                this.$message.warning('支付金额不能大于尾款金额')
            }
        },
        wzContinuePay () {
            if (this.unPay > 0) {
                this.queryPayRecord()
                this.wzPayedModal = false
            } else {
                this.$message.warning('支付金额不能大于尾款金额')
                this.wzPayedModal = false
                this.$emit('refresh')
            }
        },
        // 分期贷取消继续付款
        cancelPay () {
            this.loanedModal = false
            this.wzPayedModal = false
            this.queryPayRecord()
            this.$emit('refresh')
        },
        // 套购活动抽屉打开
        openArbitrageActivity () {
            if (this.disableEdit === true) {
                this.$message.warning('当前页面只允许付款操作')
            } else {
                this.$emit('setWrapStyle', true)
                this.arbitrageActivityVisible = true
            }
        },
        // 分期贷取消贷款
        loanCancel () {
            this.loanModal = false
        },
        // 分期贷提交贷款
        loanSubmit (e) {
            const { sub } = this.$math
            const orderIds = []
            this.settleGoods.forEach(item => {
                orderIds.push(item.code)
            })
            e.preventDefault() // 防止事件穿透
            const { loanForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.receiveAmount = this.shouldPay
                    values.guideCode = this.$store.getters.userInfo.code
                    if (values.creditAmount > this.unPay) {
                        this.$message.warning('贷款金额不能大于尾款')
                        this.loading = false
                        return false
                    }
                    console.log(values)
                    axios({
                        path: 'ApiCreditPayAddCreditPayInfo',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.loanModal = false
                            const payType = 'shopping_pay_record_pay_type:6'
                            this.payAmount = values.creditAmount
                            this.loanLeft = Number(sub(this.unPay, this.payAmount))
                            this.pay(payType, this.payAmount, this.unPay)
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 支付成功处理函数
        paySuccessHandle (orderIds, payNumber) {
            axios({
                path: 'ApiPaymentPaySuccessHandle',
                method: 'post',
                body: {
                    orderIds,
                    payNumber
                }
            }).then(res => {
                if (res.flag === 1) {
                }
            })
        },
        // 查询分期贷公司
        queryLoanCompany () {
            axios({
                path: 'ShoppingTrolleyQueryCreditType',
                method: 'POST',
                body: {
                    type: 'shopping_installment_credit_company'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('分期贷公司:', res.data)
                    const data = res.data
                    data.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.loanCompanyDefault = data[0]
                    this.loanCompany = [...data]
                }
            })
        },
        // 查询分期待产品
        queryLoanPro () {
            axios({
                path: 'ShoppingTrolleyQueryCreditType',
                method: 'POST',
                body: {
                    type: 'shopping_installment_credit_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('分期贷产品:', res.data)
                    const data = res.data
                    data.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.loanProDefault = data[0]
                    this.loanPro = [...data]
                }
            })
        },
        // 查询顾客税票列表
        getCustomerTalkRecord () {
            const self = this
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerId: self.taxCustomerId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.customerTaxInfo = data
                }
            })
        },
        // 查询订单选中的电子券
        queryScheduleRule () {
            const orderIds = []
            this.settleGoods.forEach(item => {
                orderIds.push(item.code)
            })
            axios({
                path: 'ShoppingScheduleQueryScheduleRule',
                method: 'POST',
                body: {
                    orderIds: orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('订单选择的活动:', res.data)
                    const data = res.data.electronic
                    if (data) {
                        data.forEach(item => {
                            item.useAmount = item.scheduleAmount
                            item.selectedBy = item.shoppingTrolleyCode
                            item.scheduleName = item.scheduleRuleName
                        })
                        this.ticketsList = [...data]
                        console.log('获取订单选中电子券：', this.ticketsList)
                    }
                }
            })
        },
        // 获取电子券列表
        getTickets () {
            this.settleGoods.forEach(item => {
                item.skuAmount = item.skuActualPrice * item.skuQuantity
            })
            axios({
                path: 'CustomerManageQueryValueCardDefine',
                method: 'POST',
                body: {
                    customerName: this.settleCustomer.customerName,
                    customerTelephone: this.settleCustomer.customerTelephone,
                    storeCode: this.$store.getters.storeInfo.code,
                    scheduleUseList: this.settleGoods
                }
            }).then(res => {
                if (res.flag === 1) {
                    const tempTicketsList = res.data.valueCardDefinePageInfo.list
                    // if (tempTicketsList.length > 0) {
                    tempTicketsList.forEach(ticket => {
                        // 电子券是否选中标识
                        ticket.selected = false
                        // 电子券被某个订单选中记录
                        ticket.selectedBy = ''
                    })
                    this.ticketsList = [...tempTicketsList]
                    if (res.data.scheduleRuleUseList.length > 0) {
                        res.data.scheduleRuleUseList.forEach(item => {
                            item.canUseAmount = item.shouldRateAmount
                        })
                        this.scheduleRuleUseList = [...res.data.scheduleRuleUseList]
                    }
                    // }
                }
            })
        },
        // 获取收款记录
        queryPayRecord () {
            const { sub } = this.$math
            const orderIds = []
            this.settleGoods.forEach(item => {
                orderIds.push(item.code)
            })
            axios({
                path: 'ShoppingPayRecordQueryShoppingPayRecord',
                method: 'POST',
                body: {
                    orderIds: orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询收款记录：', res.data)
                    this.totalPay = res.data.totalPay
                    this.unPay = Number(Number(sub(this.actualPay, res.data.totalPay)))
                    this.shouldPay = res.data.shouldAmount
                    if (res.data.shoppingPayRecords) {
                        this.payRecord = [ ...res.data.shoppingPayRecords ]
                    }
                }
            })
        },
        // 获取支付方式
        queryPayMethods () {
            axios({
                path: 'MarketingConfigQueryPayMethod',
                method: 'POST',
                body: {
                    type: 1,
                    effectFlag: 1
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('结算方式:', res.data)
                    const data = res.data
                    this.payMethods = [...data]
                }
            })
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }
}
</script>

<style lang="less" scoped>
.ant-card {
  margin-top: 20px;
  /deep/.ant-card-actions > li{
    margin: 0;
  }
  /deep/.ant-card-actions > li > span{
    display:block;
    width: 100%;
    height:42px;
    .ant-row {
      height: 42px;
      line-height: 42px;
      font-size: 12px;
    }
  }
}
// 结算电子券列表
.list-header {
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  p {
    font-weight:700;
  }
  div {
    p {
      font-size: 12px;
      padding: 4px;
    }
    .used {
      color: rgb(56,173,255)
    }
  }
}
.wrapper {
  display: flex;
  width: 300px;
  height: 60px;
  position: relative;
  margin-bottom: 10px;
  cursor:pointer;
  .content {
    flex: 3;
    background-color: rgb(55,177,255);
    border-radius: 8px;
    p{
      margin: 0;
      text-align: center;
      color: #fff;
    }
    .ticket-name{
      margin-top: 10px;
    }
    .data-validity {
      font-size: 12px;
    }
  }
  .divider {
    position: absolute;
    height: 100%;
    right: 75px;
    width: 0;
    border: 1px dotted #fff;
  }
  .amount {
    flex: 1;
    background-color: rgb(55,177,255);
    border-radius: 8px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    color: #fff;
  }
  .gray{
    background: #ccc;
  }
}
// 结算商品
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
// 促销记录
.promotion,
.should-pay,
.receive,
.left-pay{
  padding: 10px 10px 10px 32px;
}
.receive {
  .pay-list {
    display:inline-block;
    float: right;
    p{
      padding-right: 10px;
      margin-bottom: 10px;
      .pay-type-name{
        display: inline-block;
        width: 100px;
        text-align: right;
        color:rgb(56,173,255)
      }
      .pay-type-amount {
        text-align: left;
      }
    }
  }
}
.promotion {
  .content {
    display:flex;
    .activity {
      flex: 1;
      border-right: 1px solid #eee;
      padding-left: 10px;
    }
    .ab-acount {
      flex: 1;
      padding-left: 10px;
    }
  }
}
// 付款方式
.pay-methods {
  padding: 20px 0 10px;
  .ant-col-4 {
    cursor: pointer;
    text-align: center;
    margin-bottom: 20px;
    img{
      display: inline-block;
    }
    &:hover{
      color: #1890ff;
    }
    p{
      margin-bottom: 0;
      margin-top: 5px;
    }
  }
}
// 顾客税票
.taxOptions {
  a{
    text-decoration: none;
    margin-left: 10px;
  }
}
// 贷款成功提示
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
// 新百卡支付
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
</style>

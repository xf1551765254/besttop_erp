<!--
 * @Description:零售收款
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-03-06 22:03:20
 * @LastEditTime: 2019-08-14 09:23:10
 -->
<template>
  <div>
    <a-row>
      <a-col :span="16" :offset="4">
        <a-input-search
          placeholder="请输入导购/顾客/订单号"
          @search="onSearch"
          v-model="searchCondition"
          enterButton
          size="large"
          style="width:80%;margin-left:10%;margin-bottom:20px"/>
        <a-tabs @change="callback" type="card">
          <a-tab-pane :tab="`待结算(${unsettledOrdersCount})`" key="1">
            <a-card :title="item.nameAndPhone" v-for="(item,index) in unsettledOrders" :key="index">
              <a-button type="primary" @click="addCustomer" slot="extra" v-if="item.customerName==='普通顾客'">添加顾客</a-button>
              <!-- 顾客对应商品列表 -->
              <a-checkbox-group @change="checkChangeHandler(item)" v-model="checkedObj[item.customerId]">
                <div class="goods" v-for="(goods,i) in item.shoppingTrolleySkuResponseList" :key="i">
                  <a-row>
                    <a-col :span="1" style="padding:35px 0"><a-checkbox :value="goods" :disabled="goods.disabled"></a-checkbox></a-col>
                    <!-- 商品图片 -->
                    <a-col :span="3" style="padding:0 10px">
                      <img :src="goods.skuPicture" style="display:block;width:100%;height:auto;">
                    </a-col>
                    <!-- 商品信息 -->
                    <a-col :span="10">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    </a-col>
                    <!-- 商品数量和库存 -->
                    <a-col :span="4" style="padding-top:20px">
                      <pre>购买数量：{{ goods.skuQuantity }}</pre>
                    </a-col>
                    <!-- 商品操作 -->
                    <a-col :span="6" class="right">
                      <p>
                        <a href="#" :class="(isActiveCustomer===index)&&(isActiveaClass===i)&&isActivea?'active':''" @click="handleClick(0, i, index, goods, item.customerId)">详情</a>
                        <a href="#" :class="(isActiveCustomer===index)&&(isActivebClass===i)&&isActiveb?'active':''" @click="handleClick(1, i, index, goods, item.customerId)">编辑</a>
                        <a href="#" v-action:delete :class="(isActiveCustomer===index)&&(isActivecClass===i)&&isActivec?'active':''" @click="handleClick(2, i, index,goods)">删除</a>
                      <!-- <a href="#" :class="{active: isActived}" @click="handleClick(3)">配送</a> -->
                      </p>
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.createTime }}</p>
                    </a-col>
                  </a-row>
                </div>
              </a-checkbox-group>
              <template slot="actions">
                <div class="unsettle-footer">
                  <div class="checkall">
                    <a-checkbox @change="onCheckAllChange(item, $event)" :indeterminate="item.indeterminate" :checked="item.checkAll">全选</a-checkbox>
                  </div>
                  <div class="unsettle-right">
                    <div>
                      收款金额：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ Number(item.totalPrice).toFixed(2) }}</span>
                    </div>
                    <a-button type="primary" v-action:query @click="toSettle(0,item)">收款</a-button>
                  </div>
                </div>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :tab="`未支付(${unpayOrdersCount})`" key="2">
            <a-card :title="item.nameAndPhone" v-for="item in unpayOrders" :key="item.customerId">
              <!-- 流水号 -->
              <div class="payNumberBox" v-for="payNumber in item.shoppingTrolleySkuResponseList" :key="payNumber.payNumber">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="toPrintTicket(payNumber)">补打小票</a>
                  </div>
                </div>
                <!-- 顾客对应商品列表 -->
                <div class="goods" v-for="goods in payNumber.shoppingTrolleyDetailList" :key="goods.id">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px">
                      <!-- <img :src="goods.skuPicture"> -->
                      <img :src="goods.skuPicture" style="display:block;width:100%;height:auto;">
                    </a-col>
                    <a-col :span="12">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    <!-- 商品属性后台接口无对应字段，预留 -->
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="right" style="padding-top:20px">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.createTime }}</p>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :tab="`未完成(${uncompletedOrdersCount})`" key="3">
            <a-card :title="item.nameAndPhone" v-for="item in uncompletedOrders" :key="item.customerId">
              <!-- 流水号 -->
              <div class="payNumberBox" v-for="(payNumber,index) in item.shoppingTrolleySkuResponseList" :key="index">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="getPayRecord(payNumber)" class="payRecord">收款记录</a>
                  </div>
                </div>
                <!-- 顾客对应商品列表 -->
                <div class="goods" v-for="goods in payNumber.shoppingTrolleyDetailList" :key="goods.id">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px">
                      <img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" style="display:block;width:100%;height:auto;">
                    </a-col>
                    <a-col :span="12">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    <!-- 商品属性后台接口无对应字段，预留 -->
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="order-info">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.createTime }}</p>
                    </a-col>
                  </a-row>
                </div>
                <!-- 流水对应结算 -->
                <div class="payNumber-pay">
                  <div>
                    已支付：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ initPrice(Number(payNumber.shoppingPayRecordVO.totalPay)) }}</span>
                  </div>
                  <div class="pay-right">
                    <div>
                      尾款金额：<span style="font-size:16px;font-weight:700;color:#1890ff">{{ initPrice(Number(payNumber.shoppingPayRecordVO.shouldAmount-payNumber.shoppingPayRecordVO.totalPay)) }}</span>
                    </div>
                    <a-button type="primary" @click="toSettle(1,item,payNumber)">继续收款</a-button>
                  </div>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane :tab="`已完成(${completedOrdersCount})`" key="4">
            <a-card :title="item.nameAndPhone" v-for="item in completedOrders" :key="item.customerId">
              <!-- 流水号 -->
              <div class="payNumberBox" v-for="payNumber in item.shoppingTrolleySkuResponseList" :key="payNumber.payNumber">
                <div class="payNumber">
                  <div class="number">流水号：{{ payNumber.payNumber }}</div>
                  <div class="payNumberOpt">
                    <a href="#" @click="getPayRecord(payNumber)" class="payRecord">收款记录</a>
                    <a href="#" @click="toPrintTicket(payNumber)">补打小票</a>
                  </div>
                </div>
                <!-- 顾客对应商品列表 -->
                <div class="goods" v-for="goods in payNumber.shoppingTrolleyDetailList" :key="goods.id">
                  <a-row>
                    <a-col :span="3" style="padding:0 10px;">
                      <img :src="goods.skuPicture" style="display:block;width:100%;height:auto">
                    </a-col>
                    <a-col :span="10">
                      <p>
                        {{ goods.skuName }}
                        <span style="padding:2px;font-size:12px;color:#1890ff;background:#eee;font-weight:400;margin-left:5px">
                          {{ goods.skuCode }}
                        </span>
                      </p>
                      <p>{{ goods.skuModel }}</p>
                      <p>{{ initPrice(goods.skuUnitPrice) }}</p>
                      <p style="color:red">{{ initPrice(goods.skuActualPrice) }}</p>
                    <!-- 商品属性后台接口无对应字段，预留 -->
                    </a-col>
                    <a-col :span="3" style="padding-top:30px">
                      <p>x{{ goods.skuQuantity }}</p>
                    </a-col>
                    <a-col :span="6" class="order-info">
                      <p>订单号：{{ goods.code }}</p>
                      <p>{{ goods.createTime }}</p>
                    </a-col>
                    <a-col :span="2" style="padding-top:35px">
                      <a href="#" @click="showTaxInfo(item, goods)" v-if="goods.returnedFlag==='0'">补打发票</a>
                      <a href="#" @click="invoiceCancellation(payNumber.payNumber, goods)" v-else>补冲发票</a>
                    </a-col>
                    <div class="returned" v-if="goods.returnedFlag==='1'">
                      <img src="@assets/refunded_icon.png" width="50" height="50">
                    </div>
                  </a-row>
                </div>
              </div>
            </a-card>
          </a-tab-pane>
        </a-tabs>
        <!-- 分页 -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
          <a-pagination
            :pageSizeOptions="pageSizeOptions"
            :total="total"
            showSizeChanger
            :pageSize="pageSize"
            v-model="current"
            @showSizeChange="onShowSizeChange"
            @change="pageChange"
          >
            <template slot="buildOptionText" slot-scope="props">
              <span v-if="props.value!=='50'">{{ props.value }}条/页</span>
              <span v-if="props.value==='50'">全部</span>
            </template>
          </a-pagination>
        </div>
      </a-col>
    </a-row>
    <!-- 新增/编辑用户信息 -->
    <a-modal
      :title="addEditTitle"
      v-model="addEditModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
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
        <a-row class="row-style">
          <a-col :span="3">联系电话:</a-col>
          <a-col :span="21">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone')"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="row-style">
          <a-col :span="3">顾客名称:</a-col>
          <a-col :span="4">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name')"/>
            </a-form-item>
          </a-col>
          <a-col :span="3">性别:</a-col>
          <a-col :span="4">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.sex')">
                <a-radio value="0">
                  男
                </a-radio>
                <a-radio value="1">
                  女
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="row-style">
          <a-col :span="3">详细地址:</a-col>
          <a-col :span="21">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.address')"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 顾客发票信息列表模态框 -->
    <a-modal
      :title="taxTitle"
      v-model="taxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="9999"
      destroyOnClose
      centered
    >
      <!-- 页脚 -->
      <template slot="footer">
        <a-button key="back" @click="taxCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click.stop="addEditTax(-1)">
          新增发票
        </a-button>
      </template>
      <div>
        <a-collapse accordion v-if="customerTaxInfo.length > 0">
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
    <!-- 新增/编辑发票信息模态框 -->
    <a-modal
      :title="addEditTaxTitle"
      v-model="addEditTaxModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10000"
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
    <!-- 结算 -->
    <a-drawer
      title="结算"
      placement="bottom"
      :height="height+100"
      @close="onSettlementClose"
      :visible="settlementVisible"
      :closable="false"
      destroyOnClose>
      <div :style="`height:${height}px;overflow:auto;`">
        <!-- 结算商品&电子券 -->
        <a-card :title="`${settleCustomer.customerName}`">
          <div>
            <a-row class="settle" v-for="(goods,index) in settleGoods" :key="index">
              <!-- 待结算商品信息 -->
              <a-col :span="12" class="goods-info">
                <a-col :span="4" class="img-box">
                  <!-- <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" alt=""> -->
                  <img :src="goods.skuPicture" alt="">
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
              <!-- 电子券 -->
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
            <a-col :span="4" v-for="(method,mi) in payMethods" :key="mi" v-action:add @click="toPay(method)">
              <img src="./images/loan.png" width="24">
              <p>{{ method.description }}</p>
            </a-col>
          </a-row>
        </a-card>
      </div>
    </a-drawer>
    <!-- 电子券列表 -->
    <a-drawer
      placement="right"
      :closable="false"
      :width="400"
      @close="onTicketListClose"
      :visible="ticketVisible"
    >
      <div class="list-header">
        <p>{{ settleCustomer.customerName }}的电子账户</p>
        <div>
          <p>
            可用券额度：
            <a-input-number
              size="small"
              :min="1"
              :max="orderTickets.maxAmount"
              :disabled="orderTickets.isChange==='1'?false:true"
              v-model="scheduleRuleUseList[scheduleIndex].canUseAmount"
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
    <!-- 款台收款成功 -->
    <a-modal
      title="收款成功"
      v-model="payedModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" :loading="loading" @click="cashPayedConfirm">
          关闭
        </a-button>
        <a-button type="primary" :loading="loading" @click="showTaxInfo(settleCustomer,settleGoods)" >
          打印发票
        </a-button>
        <a-button type="primary" :loading="loading" @click="toPrintTicket()">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ this.payedNumber }}</p>
      <p><span>应付款金额：</span>{{ Number(this.payAmount).toFixed(2) }}</p>
      <p><span>收款金额：</span>{{ Number(this.payAmount).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ this.payTime }}</p>
    </a-modal>
    <!-- 贷款成功 -->
    <a-modal
      title="收款成功"
      v-model="loanedModal"
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
        <a-button type="primary" :loading="loading" @click="continuePay" v-if="loanLeft > 0">
          继续付款
        </a-button>
        <a-button type="primary" :loading="loading" @click="showTaxInfo(settleCustomer,settleGoods)" v-if="loanLeft === 0.00">
          打印发票
        </a-button>
        <a-button type="primary" :loading="loading" @click="toPrintTicket()" v-if="loanLeft === 0.00">
          打印小票
        </a-button>
      </template>
      <div style="text-align:center;margin-bottom:30px;">
        <img src="../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ payedNumber }}</p>
      <p><span>本次收款：</span>{{ Number(payAmount).toFixed(2) }}</p>
      <p><span>尾款金额：</span>{{ Number(loanLeft).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
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
        <img src="../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ payedNumber }}</p>
      <p><span>本次收款：</span>{{ Number(payAmount).toFixed(2) }}</p>
      <p><span>尾款金额：</span>{{ Number(unPay).toFixed(2) }}</p>
      <p><span>支付时间：</span>{{ payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
      </div>
    </a-modal>
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
      <!-- 页脚 -->
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
    <!-- 流水收款记录 -->
    <a-modal
      title="收款记录"
      v-model="payRecordModal"
      :closable="false"
      :keyboard="false"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button type="primary" :loading="loading" @click="() => {this.payRecordModal=false}">
          关闭
        </a-button>
      </template>
      <p v-for="(item,index) in shoppingPayRecords" :key="index">
        <span style="display:inline-block;width:150px;text-align:right;color:#1890ff;">{{ item.payTypeName }} ： </span>
        <span>{{ initPrice(item.payAmount) }}</span>
      </p>
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
        <a-button @click="printTag" key="submit" type="primary">
          确定
        </a-button>
      </template>
      <div id="print-box">
        <Ticket :ticketInfo="ticketInfo"></Ticket>
      </div>
    </a-modal>
    <!-- 款台支付打印小票 -->
    <a-modal
      title="小票打印"
      v-model="cashTicketModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-Index="9999"
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
    <!-- 打印发票 -->
    <a-modal
      title="发票打印"
      v-model="invoiceModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :z-index="10001"
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
          <Invoicetpl :invoiceInfo="item"></Invoicetpl>
        </div>
      </div>
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
        <a-button @click="pay(payType, cardAmount, unPay)" type="primary" :loading="loading">
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
        <img src="../../../assets/pay_success.png" style="display:inline-block">
      </div>
      <p><span>流水号：</span>{{ payedNumber }}</p>
      <p><span>应付款金额：</span>{{ actualPay }}</p>
      <p><span>尾款金额：</span>{{ unPay }}</p>
      <p><span>支付时间：</span>{{ payTime }}</p>
      <div class="goods-list">
        <div class="item-name">收款商品：</div>
        <div class="list-box">
          <p v-for="(goods,index) in settleGoods" :key="index">
            {{ goods.skuName }}    x{{ goods.skuQuantity }}
          </p>
        </div>
      </div>
    </a-modal>
    <!-- 商品详情 -->
    <a-drawer
      title="商品详情"
      placement="bottom"
      :height="height+100"
      @close="onGoodsInfoClose"
      :visible="goodsInfoVisible"
      :closable="false"
      destroyOnClose>
      <GoodsDetail
        ref="goodsDetailRef"
        :height="height"
        :goodsInfo="goodsInfo"
        :customerId="customerId"
        :editable="editable"
        @refreshUnSettleOrders="onGoodsInfoClose"></GoodsDetail>
    </a-drawer>
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
            <a-input-number v-model="wzAmount" :max="unPay" @change="wzAmountChange"/>
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
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import { lowToUp } from '@utils/util'
import moment from 'moment'
import print from 'print-js'
import card from '@/utils/card'
import VueBarcode from '@chenfengyuan/vue-barcode'
import jrQrcode from 'jr-qrcode'
import CashTicket from './components/CashTicket'
import Ticket from './components/Ticket'
import Invoicetpl from './components/Invoicetpl'
import GoodsDetail from './components/GoodsDetail'
import ArbitrageActivity from './components/ArbitrageActivity'
import Promotion from './components/Promotion'
export default {
    name: 'RetailReceipt',
    components: {
        VueBarcode,
        CashTicket,
        Ticket,
        Invoicetpl,
        GoodsDetail,
        ArbitrageActivity,
        Promotion
    },
    data () {
        return {
            wzPayedModal: false,
            wzTitle: '',
            wzModal: false,
            wzAmount: 0,
            otherActivities: [],
            arbitrageActivityVisible: false,
            scheduleIndex: 0,
            cardModal: false,
            cardPayedModel: false,
            // 新百卡余额
            cardBalance: 0,
            cardAmount: 0.00,
            cardNo: '',
            cardName: '',
            // 待结算列表
            unsettledOrders: [],
            // 未支付列表
            unpayOrders: [],
            // 未完成列表
            uncompletedOrders: [],
            // 已完成列表
            completedOrders: [],
            // 导购name
            guiderName: '',
            // 导购code
            guiderCode: '',
            // 顾客信息
            customerList: [],
            // 激活类标识
            isActivea: false,
            isActiveb: false,
            isActivec: false,
            isActived: false,
            // 待结算一条记录
            isActiveaClass: -1,
            isActivebClass: -1,
            isActivecClass: -1,
            isActiveCustomer: -1,
            // 待结算单数
            unsettledOrdersCount: 0,
            // 未支付单数
            unpayOrdersCount: 0,
            // 未完成单数
            uncompletedOrdersCount: 0,
            // 已完成单数
            completedOrdersCount: 0,
            // 新增/编辑顾客信息标题
            addEditTitle: '',
            // 新增/编辑顾客信息标识
            addEditModal: false,
            // 分期贷标识
            loanModal: false,
            // 加载标识
            loading: false,
            // 顾客表单
            userForm: this.$form.createForm(this),
            // 税票表单
            taxForm: this.$form.createForm(this),
            // 分期贷表单
            loanForm: this.$form.createForm(this),
            // 发票信息模态框标识
            taxModal: false,
            // 税票新增/编辑标题
            addEditTaxTitle: '',
            taxTitle: '',
            // 税票新增/编辑标识
            addEditTaxModal: false,
            // 添加标识
            isAdd: true,
            // radio
            radioValue: 0,
            // 待结算选中商品
            checkedObj: {},
            indeterminate: true,
            idsList: [],
            goodsInfoVisible: false,
            goodsInfo: {},
            height: 0,
            // 结算标识
            settlementVisible: false,
            // 结算商品
            settleGoods: [],
            // 结算顾客id
            settleCustomerId: '',
            // 结算顾客
            settleCustomer: {},
            // 结算金额
            settlePrice: 0,
            // 电子券列表标识
            ticketVisible: false,
            // 商品对应电子券使用
            scheduleRuleUseList: [{}],
            // 电子券列表
            ticketsList: [],
            content: 'content',
            amount: 'amount',
            gray: 'gray',
            amountGray: 'amount-gray',
            isGray: -1,
            ticketPre: -1,
            ticketNow: -1,
            // 要选择电子券的订单
            orderTickets: {},
            // 初始券额度
            initalAmount: 0,
            // 已选电子券额度
            selectedAmount: 0,
            // 选择的电子券集合
            selectedTicketsArr: [],
            // 选择的电子券Code
            orderCode: '',
            // 销售金额
            actualPay: 0,
            // 应收款金额
            shouldPay: 0,
            // 尾款金额
            unPay: 0,
            //  促销记录AB账户使用记录
            use: [],
            // 选中套购活动
            shoppingScheduleRuleList: [],
            // 选中套购赠品
            shoppingSaleRecordList: [],
            // 收款记录
            payRecord: [],
            // 付款方式
            payMethods: [],
            // 付款成功
            payedModal: false,
            payedNumber: '',
            payTime: moment(),
            // 结算页面是否可编辑标识
            allowEdit: true,
            // 分期贷公司：
            loanCompany: [],
            loanCompanyDefault: {},
            // 分期贷产品
            loanPro: [],
            loanProDefault: {},
            // 付款金额
            payAmount: 0,
            // 尾款金额
            balanceAmount: 0,
            // 贷款成功标识
            loanedModal: false,
            // 贷款金额
            creditAmount: 0,
            // 结算中选中电子券集合
            saveScheduleRuleList: [],
            // 结算中档期规则集合
            scheduleList: [],
            // 结算中电子券和档期规则是否保存
            isSaved: false,
            payRecordModal: false,
            shoppingPayRecords: [],
            // 结算标识
            settleFlag: 0,
            loanedFlag: false,
            loanLeft: 0,
            ticketModal: false,
            cashTicketModal: false,
            // 打印小票信息
            ticketInfo: {},
            updateTime: '',
            ticketPayNumber: '',
            cashierCode: '',
            cashierNmae: '',
            customerName: '',
            // 打印发票信息
            invoiceModal: false,
            customerTaxInfo: [],
            taxCustomerId: '',
            addEditTaxInfo: {},
            printTaxInfo: {},
            printTaxCode: [],
            returnInvoiceInfo: [],
            qrSrcArr: [],
            customerId: '',
            editable: false,
            initData: {},
            payType: '',
            cardPayTitle: '',
            magneticStripe: '',
            // 分页
            pageSizeOptions: ['10', '20', '30', '40', '50'],
            current: 1,
            pageSize: 10,
            total: 0,
            orderIds: [],
            activeKey: 1,
            amountList: {},
            searchCondition: '',
            // 电子券总金额
            totalTicketAmount: 0,
            // 套购总金额
            totalArbitrageAmount: 0

        }
    },
    mounted () {
        this.height = this.getHeight()
        this.guiderName = this.$store.getters.name
        this.guiderCode = this.$store.getters.code
        this.getUnsettledOrders()
        this.getUnpayOrders()
        this.getUncompletedOrders()
        this.getCompletedOrders()
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
            if (this.settleFlag === 1) {
                this.queryPayRecord()
            }
        },
        wzAmountChange (val) {
            if (val > this.unPay) {
                this.$message.warning('付款金额不能大于尾款')
            }
        },
        // 套购活动抽屉打开
        openArbitrageActivity () {
            if (this.allowEdit === false) {
                this.$message.warning('当前只允许付款操作')
                return false
            } else {
                this.arbitrageActivityVisible = true
            }
        },
        // 套购活动抽屉关闭
        onArbitrageActivityClose () {
            this.arbitrageActivityVisible = false
        },
        // 分页
        onShowSizeChange (current, pageSize) {
            this.pageSize = pageSize
        },
        pageChange (current) {
            this.current = current
            if (this.activeKey === 1) {
                this.getUnsettledOrders()
            } else if (this.activeKey === 2) {
                this.getUnpayOrders()
            } else if (this.activeKey === 3) {
                this.getUncompletedOrders()
            } else {
                this.getCompletedOrders()
            }
        },
        // 进入商品详情时初始化数据
        getOrderDetails (code) {
            axios({
                path: 'ShoppingTrolleyQueryShoppingTrolley',
                method: 'post',
                body: {
                    code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.initData = { ...res.data }
                    console.log('initData:', this.initData)
                    this.$refs.goodsDetailRef.setInitData(this.initData)
                }
            })
        },
        // 打印
        printTag () {
            print({
                printable: 'print-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        /**
         * @name: 关闭商品详情
         * @msg:
         * @param {type}
         * @return:
         */
        onGoodsInfoClose () {
            this.goodsInfoVisible = false
            this.goodsInfo = {}
            this.getUnsettledOrders()
            this.$refs.goodsDetailRef.closeHandler()
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
        open () {
            this.taxModal = true
        },
        /**
         * @name: 搜索框监听
         * @msg:
         * @param {type}
         * @return:
         */
        onSearch (value) {
            if (this.activeKey === 1) {
                this.getUnsettledOrders(value)
            } else if (this.activeKey === 2) {
                this.getUnpayOrders(value)
            } else if (this.activeKey === 3) {
                this.getUncompletedOrders(value)
            } else {
                this.getCompletedOrders(value)
            }
            this.searchCondition = ''
        },
        /**
         * @name: tab切换监听
         * @msg:
         * @param {type}
         * @return:
         */
        callback (key) {
            this.pageSize = 10
            this.current = 1
            if (key === '1') {
                this.settleGoods = []
                this.activeKey = 1
                this.getUnsettledOrders()
            } else if (key === '2') {
                this.getUnpayOrders()
                this.activeKey = 2
                this.total = this.unpayOrdersCount
            } else if (key === '3') {
                this.getUncompletedOrders()
                this.activeKey = 3
                this.total = this.uncompletedOrdersCount
            } else {
                this.getCompletedOrders()
                this.activeKey = 4
                this.total = this.completedOrdersCount
            }
        },
        /**
         * @name: 卡片右上角选择监听
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (e) {
            console.log(e)
        },
        /**
         * @name: 数字输入框监听
         * @msg:
         * @param {type}
         * @return:
         */
        quantityChangeHandler (val) {
            console.log('修改商品数量：', val)
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        unsettledChange (goods) {
            console.log('待结算选中的商品：', goods)
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
         * @name:新增/编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { userForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.addEditUser.id
                    }
                    console.log(values)
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAndAddress' : 'CustomerManageUpdateCustomer',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.getUsers()
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 激活类控制
         * @msg:
         * @param val:区分三个按钮;i区分一条商品;index区分一位顾客
         * @return:
         */
        handleClick (val, i, index, orderInfo, customerId) {
            console.log('订单详情：', orderInfo, customerId)
            const self = this
            console.log('val', val, i)
            if (val === 0) {
                // 详情
                this.isActiveCustomer = index
                this.isActiveaClass = i
                this.isActivea = true
                this.isActiveb = this.isActivec = this.isActived = false
                this.goodsInfo = orderInfo
                this.customerId = customerId
                this.editable = true
                this.goodsInfoVisible = true
            } else if (val === 1) {
                // 编辑
                this.isActivebClass = i
                this.isActiveb = true
                this.isActivea = this.isActivec = this.isActived = false
                this.goodsInfo = orderInfo
                this.customerId = customerId
                this.editable = false
                this.goodsInfoVisible = true
            } else if (val === 2) {
                // 删除
                this.isActivecClass = i
                this.isActivec = true
                this.isActivea = this.isActiveb = this.isActived = false
                const ids = []
                ids.push(orderInfo.id)
                this.$confirm({
                    title: '删除提示',
                    content: '确定删除选中项？删除将不可恢复',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'ShoppingTrolleyDeleteShoppingTrolley',
                            method: 'post',
                            body: {
                                ids: ids
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                self.getUnsettledOrders()
                            }
                        })
                    },
                    onCancel () {
                        self.$message.info('已取消')
                    }
                })
            } else {
                this.isActive = i
                this.isActived = true
                this.isActivea = this.isActiveb = this.isActivec = false
            }
        },
        /**
         * @name: 发票信息模态框关闭
         * @msg:
         * @param {type}
         * @return:
         */
        taxCancel () {
            this.taxModal = false
        },
        /**
         * @name: 新增/编辑发票信息
         * @msg:
         * @param {type}
         * @return:
         */
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
        /**
         * @name: 删除顾客发票信息
         * @msg:
         * @param {type}
         * @return:
         */
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
        /**
         * @name: 新增/编辑税票信息关闭
         * @msg:
         * @param {type}
         * @return:
         */
        addEditTaxCancel () {
            console.log(121231215)
            this.addEditTaxModal = false
        },
        /**
         * @name: 新增/编辑税票信息提交
         * @msg:
         * @param {type}
         * @return:
         */
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
        /**
         * @name: 打印发票监听
         * @msg:
         * @param {type}
         * @return:
         */
        showTaxInfo (customer, orderInfo) {
            console.log('顾客税票', customer, orderInfo)
            this.taxTitle = customer.customerName + '的税票信息'
            const orderIds = []
            if (orderInfo.length > 0) {
                orderInfo.forEach(item => {
                    orderIds.push(item.code)
                })
            } else {
                orderIds.push(orderInfo.code)
            }
            this.printTaxCode = orderIds
            this.taxCustomerId = customer.customerId
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerId: customer.customerId
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('用户税票信息：', res.data)
                    this.customerTaxInfo = res.data
                    this.taxModal = true
                }
            })
        },
        /**
         * @name:待结算选中
         * @msg:
         * @param {type}
         * @return:
         */
        checkChangeHandler (item) {
            item.totalPrice = 0
            console.log('选中的商品：', this.checkedObj)
            this.checkedObj = Object.assign({}, this.checkedObj)
            const checkedList = this.checkedObj[item.customerId]
            checkedList.forEach(goods => {
                item.totalPrice += goods.skuQuantity * goods.skuActualPrice
            })
            item.indeterminate = !!checkedList.length && (checkedList.length < item.shoppingTrolleySkuResponseList.length)
            item.checkAll = checkedList.length === item.shoppingTrolleySkuResponseList.length
        },
        /**
         * @name: 全选全不选
         * @msg:
         * @param {type}
         * @return:
         */
        onCheckAllChange (item, e) {
            this.checkedObj[item.customerId] = e.target.checked ? item.shoppingTrolleySkuResponseList : []
            if (this.checkedObj[item.customerId].length > 0) {
                this.checkedObj[item.customerId].forEach(goods => {
                    item.totalPrice += goods.skuQuantity * goods.skuActualPrice
                })
            } else {
                item.totalPrice = 0
            }
            item.indeterminate = false
            item.checkAll = e.target.checked
            console.log('全选/全不选', item, this.checkedObj)
        },
        /**
         * @name: 打开结算弹窗
         * @msg:
         * @param {type}
         * @return:
         */
        toSettle (index, customer, payNumber) {
            this.settleFlag = index
            this.orderIds = []
            // 从待结算页面进入结算
            if (index === 0) {
                this.allowEdit = true
                console.log('*****', customer.customerId, this.checkedObj[customer.customerId])
                if (this.checkedObj[customer.customerId] === undefined || this.checkedObj[customer.customerId].length === 0) {
                    this.$message.warning('请先选择要结算的商品')
                    return false
                } else {
                    this.checkedObj[customer.customerId].forEach(item => {
                        item.skuAmount = item.skuActualPrice * item.skuQuantity
                        item.selectedAmount = 0
                        item.salesAmount = item.actualPay
                        item.saleNum = item.skuQuantity
                        item.storeCode = this.$store.getters.storeInfo.code
                    })
                    this.settleGoods = [...this.checkedObj[customer.customerId]]
                    this.settleGoods.forEach(item => {
                        this.orderIds.push(item.code)
                    })
                    this.settleCustomerId = customer.customerId
                    this.settleCustomer = { ...customer }
                    this.settlePrice = Number(customer.totalPrice).toFixed(2)
                    console.log('结算顾客:', this.settleCustomer)
                    console.log('结算商品:', this.settleGoods)
                    // 获取电子券
                    this.getTickets()
                    // 获取支付方式
                    this.getPayMethods()
                    this.settlementVisible = true
                }
            } else {
                // 从未完成页面进入结算
                this.allowEdit = false
                console.log('从未完成页面进入结算', customer, payNumber)
                payNumber.shoppingTrolleyDetailList.forEach(item => {
                    item.skuPicture = 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
                })
                this.settleGoods = [...payNumber.shoppingTrolleyDetailList]
                this.settleGoods.forEach(item => {
                    this.orderIds.push(item.code)
                })
                this.settleCustomerId = customer.customerId
                this.settleCustomer = { ...customer }
                // 获取支付方式
                // this.queryPayRecord()
                this.getPayMethods()
                this.settlementVisible = true
            }
        },
        /**
         * @name: 关闭结算弹窗
         * @msg:
         * @param {type}
         * @return:
         */
        onSettlementClose () {
            this.settlementVisible = false
            this.getUnsettledOrders()
            this.getUnpayOrders()
            this.getUncompletedOrders()
            this.getCompletedOrders()
            this.isSaved = false
            this.shoppingScheduleRuleList = []
            this.shoppingSaleRecordList = []
            this.payRecord = []
            if (this.shoppingScheduleRuleList.length > 0) {
                this.$refs.ArbitrageActivity.clearGift()
            }
            for (const key in this.checkedObj) {
                this.checkedObj[key] = []
            }
        },
        /**
         * @name: 电子券列表选择电子券
         * @msg:
         * @param {type}
         * @return:
         */
        selectTicket (ticket) {
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
                    this.selectedAmount -= ticket.useAmount
                    ticket.scheduleAmount = 0
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
        // 筛选活动信息
        filterScheduleInfo () {
            const tempScheduleArr = []
            const result = []
            const obj = {}
            this.saveScheduleRuleList.forEach(item => {
                this.scheduleList.forEach(subItem => {
                    if (item.selectedBy === subItem.shoppingTrolleyCode) {
                        tempScheduleArr.push(subItem)
                    }
                })
            })
            console.log('筛选活动信息', this.tempScheduleArr)
            for (var i = 0; i < tempScheduleArr.length; i++) {
                if (!obj[tempScheduleArr[i].shoppingTrolleyCode]) {
                    result.push(tempScheduleArr[i])
                    obj[tempScheduleArr[i].shoppingTrolleyCode] = true
                }
            }
        },
        /**
         * @name:待结算列表数据请求
         * @msg:
         * @param {type}
         * @return:
         */
        getUnsettledOrders (searchCondition) {
            axios({
                path: 'ShoppingTrolleyQueryUnSettledOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    rows: this.pageSize,
                    page: this.current,
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    searchCondition: searchCondition
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    this.unsettledOrdersCount = this.total = res.data.total
                    data.forEach(item => {
                        this.checkedObj[item.customerId] = []
                        if (item.customerPhone) {
                            item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        } else {
                            item.nameAndPhone = item.customerName
                        }
                        if (item.shoppingTrolleySkuResponseList.length > 0) {
                            item.totalPrice = 0
                            item.checkAll = false
                            // 顾客待结算所有商品结合
                            item.idsList = [...item.shoppingTrolleySkuResponseList]
                            const goods = item.shoppingTrolleySkuResponseList
                            goods.forEach(subItem => {
                                subItem.disabled = false
                                subItem.skuPicture = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                            })
                        }
                    })
                    this.unsettledOrders = [...data]
                    console.log('待结算--', this.unsettledOrders)
                }
            })
        },
        /**
         * @name:未支付列表数据请求
         * @msg:
         * @param {type}
         * @return:
         */
        getUnpayOrders (searchCondition) {
            axios({
                path: 'ShoppingTrolleyQueryCompletedOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    status: 'shopping_trolley_status:2',
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    rows: this.pageSize,
                    page: this.current,
                    searchCondition: searchCondition
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('未支付--', res.data)
                    const data = res.data.list
                    this.unpayOrdersCount = res.data.total
                    data.forEach(item => {
                        if (item.customerPhone) {
                            item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        } else {
                            item.nameAndPhone = item.customerName
                        }
                        if (item.shoppingTrolleySkuResponseList.length > 0) {
                            const payNumber = item.shoppingTrolleySkuResponseList
                            payNumber.forEach(subItem => {
                                const goods = subItem.shoppingTrolleyDetailList
                                goods.forEach(ssitem => {
                                    ssitem.skuPicture = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                                })
                            })
                        }
                    })
                    this.unpayOrders = [...data]
                }
            })
        },
        /**
         * @name:未完成列表数据请求
         * @msg:
         * @param {type}
         * @return:
         */
        getUncompletedOrders (searchCondition) {
            axios({
                path: 'ShoppingTrolleyQueryCompletedOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    status: 'shopping_trolley_status:3',
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    rows: this.pageSize,
                    page: this.current,
                    searchCondition: searchCondition
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('未完成--', res.data)
                    const data = res.data.list
                    this.uncompletedOrdersCount = res.data.total
                    data.forEach(item => {
                        if (item.customerPhone) {
                            item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        } else {
                            item.nameAndPhone = item.customerName
                        }
                        item.shoppingTrolleySkuResponseList.forEach(subItem => {
                            subItem.payAccount = 0
                            subItem.shouldPay = 0
                            // 对象键名称转换，计算已支付金额
                            for (const key in subItem.payRecordCount) {
                                if (key === 'totalPay') {
                                    delete subItem.payRecordCount[key]
                                } else if (key === 'unPay') {
                                    delete subItem.payRecordCount[key]
                                } else if (subItem.payRecordCount[key] !== '0.00') {
                                    subItem.payAccount += Number(subItem.payRecordCount[key])
                                    if (key === 'card') {
                                        subItem.payRecordCount['银行卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'alipay') {
                                        subItem.payRecordCount['支付宝'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'weChat') {
                                        subItem.payRecordCount['微信'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'xinBai') {
                                        subItem.payRecordCount['新百卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'wuMart') {
                                        subItem.payRecordCount['美通卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'credit') {
                                        subItem.payRecordCount['分期贷'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'cashDesk') {
                                        subItem.payRecordCount['款台支付'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'other') {
                                        subItem.payRecordCount['其他支付'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    }
                                } else {
                                    delete subItem.payRecordCount[key]
                                }
                            }
                            // 求总的应付金额
                            subItem.shoppingTrolleyDetailList.forEach(order => {
                                subItem.shouldPay += Number(order.skuActualPrice) * Number(order.skuQuantity)
                            })
                        })
                    })
                    this.uncompletedOrders = [...data]
                }
            })
        },
        /**
         * @name:已完成列表数据请求
         * @msg:
         * @param {type}
         * @return:
         */
        getCompletedOrders (searchCondition) {
            axios({
                path: 'ShoppingTrolleyQueryCompletedOrders',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    status: 'shopping_trolley_status:4',
                    ifPc: 0,
                    customerName: this.$store.getters.customerName,
                    customerTelephone: this.$store.getters.customerTelephone,
                    rows: this.pageSize,
                    page: this.current,
                    searchCondition: searchCondition
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('已完成--', res.data)
                    const data = res.data.list
                    this.completedOrdersCount = res.data.total
                    data.forEach(item => {
                        if (item.customerPhone) {
                            item.nameAndPhone = `${item.customerName} ：${item.customerPhone}`
                        } else {
                            item.nameAndPhone = item.customerName
                        }
                        const payNumber = item.shoppingTrolleySkuResponseList
                        payNumber.forEach(subItem => {
                            const goods = subItem.shoppingTrolleyDetailList
                            for (const key in subItem.payRecordCount) {
                                if (key === 'totalPay') {
                                    item.totalPay = subItem.payRecordCount['totalPay']
                                    delete subItem.payRecordCount[key]
                                } else if (key === 'unPay') {
                                    item.unPay = subItem.payRecordCount['unPay']
                                    delete subItem.payRecordCount[key]
                                } else if (subItem.payRecordCount[key] > 0) {
                                    if (key === 'card') {
                                        subItem.payRecordCount['银行卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'alipay') {
                                        subItem.payRecordCount['支付宝'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'weChat') {
                                        subItem.payRecordCount['微信'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'xinBai') {
                                        subItem.payRecordCount['新百卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'wuMart') {
                                        subItem.payRecordCount['美通卡'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'credit') {
                                        subItem.payRecordCount['分期贷'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'cashDesk') {
                                        subItem.payRecordCount['款台支付'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    } else if (key === 'other') {
                                        subItem.payRecordCount['其他支付'] = subItem.payRecordCount[key]
                                        delete subItem.payRecordCount[key]
                                    }
                                } else {
                                    delete subItem.payRecordCount[key]
                                }
                            }
                            goods.forEach(ssitem => {
                                ssitem.skuPicture = 'https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg'
                            })
                        })
                    })
                    this.completedOrders = [...data]
                }
            })
        },
        /**
         * @name:根据顾客id查询税票信息列表
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerTalkRecord () {
            axios({
                path: 'CustomerManageQueryCustomerInvoice',
                method: 'POST',
                body: {
                    customerId: this.taxCustomerId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.customerTaxInfo = data
                }
            })
        },
        /**
         * @name: 查询商品sku详情
         * @msg:
         * @param {type}
         * @return:
         */
        getSkuDetails (code) {
            axios({
                path: 'ShoppingTrolleyDetailsQueryShoppingTrolleySkuDetails',
                method: 'POST',
                body: {
                    code: code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('商品sku详情:', res.data)
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
            axios({
                path: 'ShoppingTrolleyQueryStockOut',
                method: 'POST',
                body: {
                    skuCode: skuCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('提货方式:', res.data)
                    const data = res.data
                    this.stockOut = [...data]
                }
            })
        },
        /**
         * @name:获取活动
         * @msg:
         * @param {type}
         * @return:
         */
        getActivities (skuCode, salesAmount, classCode, brandCode) {
            axios({
                path: 'CouponsUseQueryActivities',
                method: 'POST',
                body: {
                    skuCode: skuCode,
                    storeCode: this.$store.getters.storeInfo.code,
                    salesAmount: `${salesAmount}`,
                    saleNum: '1',
                    classCode: classCode,
                    brandCode: brandCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    // 店长优惠券
                    this.coupons = { ...res.data.coupon }
                    console.log('店长优惠券：', this.coupons)
                    this.aAmount = this.coupons.acanUse
                    this.bAmount = this.coupons.bcanUse
                    this.bPushAmount = this.coupons.bBushMoney
                    // 绑定商品
                    this.group = { ...res.data.group }
                    console.log('捆绑商品列表：', this.group)
                    // 单品营销活动
                    const danpin = res.data.schedule.slice(0, 3)
                    // 套购营销活动
                    const other = res.data.schedule.slice(3)
                    danpin.forEach(item => {
                        item.scheduleAmount = 0
                        if (item.effectType === 'schedule_rule_define_effect_type:1' && item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                            item.activityName = '单品满返'
                            item.desc = `满${item.standard}返${item.rateAmount}`
                        } else if (item.effectType === 'schedule_rule_define_effect_type:1' && item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                            item.activityName = '单品满减'
                            item.desc = `满${item.standard}减${item.rateAmount}`
                        } else if (item.effectType === 'schedule_rule_define_effect_type:1' && item.scheduleType === 'schedule_rule_define_schedule_type:3') {
                            item.activityName = '单品满赠'
                            item.desc = `满${item.standard}赠以下商品`
                        }
                    })
                    other.forEach(item => {
                        if (item.effectType === 'schedule_rule_define_effect_type:2' && item.scheduleType === 'schedule_rule_define_schedule_type:1') {
                            item.activityName = '套购满返'
                            item.desc = `满${item.standard}返${item.rateAmount}`
                        } else if (item.effectType === 'schedule_rule_define_effect_type:2' && item.scheduleType === 'schedule_rule_define_schedule_type:2') {
                            item.activityName = '套购满减'
                            item.desc = `满${item.standard}返${item.rateAmount}`
                        } else if (item.effectType === 'schedule_rule_define_effect_type:2' && item.scheduleType === 'schedule_rule_define_schedule_type:3') {
                            item.activityName = '套购满赠'
                            item.desc = `满${item.standard}赠以下商品`
                        } else if (item.effectType === 'schedule_rule_define_effect_type:3') {
                            item.activityName = '用券'
                            item.desc = `满${item.standard}可用${item.rateAmount}`
                        }
                    })
                    this.schedule = [...danpin]
                    this.otherSchedule = [...other]
                    console.log('活动信息:', this.schedule)
                }
            })
        },
        /**
         * @name: 结算中获取电子券
         * @msg:
         * @param {type}
         * @return:
         */
        getTickets () {
            axios({
                path: 'CustomerManageQueryValueCardDefine',
                method: 'POST',
                body: {
                    customerName: this.settleCustomer.customerName,
                    customerTelephone: this.settleCustomer.customerPhone,
                    scheduleUseList: this.settleGoods,
                    storeCode: this.$store.getters.storeInfo.code
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
        // 查询新百卡信息
        queryXinBaiCardInfo (cardId) {
            axios({
                path: 'ApiXinBaiPayQueryXinBaiCardInfo',
                method: 'POST',
                body: {
                    magneticStripe: cardId
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('查询到的新百卡信息：', res.data)
                    this.cardBalance = res.data.balance
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
        /**
         * @name: 获取收款记录
         * @msg:
         * @param {type}
         * @return:
         */
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
                    this.totalPay = res.data.totalPay
                    this.unPay = Number(Number(sub(this.actualPay, res.data.totalPay)))
                    this.shouldPay = Number(res.data.shouldAmount)
                    if (res.data.shoppingPayRecords) {
                        this.payRecord = [ ...res.data.shoppingPayRecords ]
                    }
                }
            })
        },
        /**
         * @name: 结算中获取付款方式
         * @msg:
         * @param {type}
         * @return:
         */
        getPayMethods () {
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
        /**
         * @name: 查询结算中分期贷公司
         * @msg:
         * @param {type}
         * @return:
         */
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
        /**
         * @name: 查询结算中分期贷产品
         * @msg:
         * @param {type}
         * @return:
         */
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
        /**
         * @name:结算中查询订单对应的活动
         * @msg:
         * @param {type}
         * @return:
         */
        // queryScheduleRule () {
        //     const orderIds = []
        //     this.settleGoods.forEach(item => {
        //         orderIds.push(item.code)
        //     })
        //     axios({
        //         path: 'ShoppingScheduleQueryScheduleRule',
        //         method: 'POST',
        //         body: {
        //             orderIds: orderIds
        //         }
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             console.log('订单选择的活动:', res.data)
        //             const data = res.data.electronic
        //             if (data) {
        //                 data.forEach(item => {
        //                     item.useAmount = item.scheduleAmount
        //                     item.selectedBy = item.shoppingTrolleyCode
        //                     item.scheduleName = item.scheduleRuleName
        //                 })
        //                 this.ticketsList = [...data]
        //                 console.log('获取订单选中电子券：', this.ticketsList)
        //             }
        //         }
        //     })
        // },
        /**
         * @name: 结算页面保存活动
         * @msg:
         * @param {type}
         * @return:
         */
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
                delete item.createTime
                delete item.endTime
                delete item.startTime
                delete item.updateTime
            })
            if (this.saveScheduleRuleList.length > 0) {
                const res = await axios({
                    path: 'ShoppingScheduleAddScheduleRule',
                    method: 'POST',
                    body: {
                        ids: ids, // 活动id集合
                        shoppingScheduleRuleList: this.saveScheduleRuleList // 活动信息集合
                    }
                })
                if (res.flag === 1) {
                    this.saveScheduleRuleList = []
                    this.schedulleRuleUseList = [{}]
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
            console.log('去重的活动规则信息集合：', result, this.settleGoods)
            this.scheduleList = result
        },
        /**
         * @name: 电子券关闭
         * @msg:
         * @param {type}
         * @return:
         */
        onTicketListClose () {
            this.actualPay = this.amountList.actualPay
            this.unPay = this.amountList.unPay
            this.totalTicketAmount = 0
            this.ticketsList.forEach(item => {
                if (item.scheduleAmount) {
                    this.totalTicketAmount += item.scheduleAmount
                }
            })
            this.initalAmount = 0
            this.ticketVisible = false
            this.actualPay = Number(this.actualPay) - Number(this.totalArbitrageAmount) - this.totalTicketAmount
            this.unPay = Number(this.unPay) - Number(this.totalArbitrageAmount) - this.totalTicketAmount
        },
        /**
         * @name: 选择电子券
         * @msg:
         * @param {type}
         * @return:
         */
        chooseTicket (goods) {
            if (this.allowEdit === false) {
                // 由未完成页面进入
                this.$message.warning('当前只允许付款操作')
                return false
            } else {
                // 由待结算页面进入
                const tempArr = []
                this.scheduleRuleUseList.forEach((item, index) => {
                    if (item.shoppingTrolleyCode === goods.code) {
                        this.scheduleIndex = index
                        item.standard = item.reachUnitPrice
                        item.rateAmount = item.shouldRateAmount
                        tempArr.push(item)
                    }
                })
                if (tempArr.length > 0) {
                    this.orderCode = goods.code
                    this.selectedAmount = goods.selectedAmount
                    this.orderTickets = { ...tempArr[0] }
                    this.initalAmount = this.orderTickets.shouldRateAmount
                    this.ticketVisible = true
                } else {
                    this.$message.warning('没有可用的电子券')
                    return false
                }
            }
            console.log('活动规则：', this.scheduleList)
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
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
        cardPayCancel () {
            this.cardNo = ''
            this.cardAmount = 0.00
            this.cardBalance = 0
            if (this.actualPay !== this.unPay) {
                this.allowEdit = false
                this.queryPayRecord()
            }
            this.cardModal = false
        },
        // 微信/支付宝支付取消
        wzCancelPay () {
            this.wzAmount = 0
            this.magneticStripe = ''
            this.queryPayRecord()
            this.wzModal = false
        },
        /**
         * @name:支付
         * @msg:
         * @param {type}
         * @return:
         */
        toPay (methods) {
            console.log('选择的支付方式：', methods)
            if (this.unPay > 0) {
                let balanceAmount = 0
                if (methods.value === 'credit_pay') {
                    this.queryLoanCompany()
                    this.queryLoanPro()
                    this.loanModal = true
                } else if (methods.value === 'cash_pay') {
                    this.payType = 'shopping_pay_record_pay_type:7'
                    this.payAmount = balanceAmount = this.actualPay
                    this.pay(this.payType, this.payAmount, balanceAmount)
                } else if (methods.value === 'xinbai_pay') {
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
                } else if (methods.value === 'valuecard_pay') {
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
        pay (payType, payAmount, balanceAmount) {
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
                this.loading = true
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
            payParams.balanceAmount = balanceAmount
            payParams.actualAmount = this.actualPay
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
                    this.payTime = moment(res.data.payTime).format('YYYY-MM-DD HH:mm:ss')
                    this.payedNumber = res.data.payNumber
                    this.unPay = Number(Number(res.data.balanceAmount).toFixed(2))
                    this.totalTicketAmount = 0
                    this.totalArbitrageAmount = 0
                    if (this.shoppingSaleRecordList.length > 0) {
                        this.shoppingSaleRecordList.forEach(item => {
                            item.payNumber = this.payedNumber
                        })
                    }
                    if (!this.isSaved && this.settleFlag === 0) {
                        await this.addScheduleRule()
                        await this.addArbitrage()
                        this.isSaved = true
                    }
                    if (payType === 'shopping_pay_record_pay_type:7') {
                        this.payedModal = true
                    } else if (payType === 'shopping_pay_record_pay_type:4') {
                        if (this.unPay === 0.00) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedNumber)
                        }
                        this.cardAmount = 0.0
                        this.magneticStripe = ''
                        this.cardModal = false
                        this.cardBalance = 0
                        this.cardPayedModel = true
                        this.loading = false
                    } else if (payType === 'shopping_pay_record_pay_type:9') {
                        if (this.unPay === 0.00) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedNumber)
                            this.cardPayedModel = true
                        }
                        this.cardAmount = 0.0
                        this.queryValueCardBalance()
                        this.loading = false
                    } else if (payType === 'shopping_pay_record_pay_type:2' || payType === 'shopping_pay_record_pay_type:3') {
                        if (this.unPay === 0) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedNumber)
                        }
                        this.payAmount = this.wzAmount
                        this.wzModal = false
                        this.magneticStripe = ''
                        this.wzPayedModal = true
                    } else {
                        if (this.loanLeft === 0) {
                            await this.paySuccessHandle(payParams.orderIds, this.payedNumber)
                        }
                        this.loanedModal = true
                    }
                    this.loading = false
                } else {
                    this.loading = false
                }
            })
        },
        /**
         * @name: 款台支付成功
         * @msg:
         * @param {type}
         * @return:
         */
        cashPayedConfirm () {
            this.payedModal = false
            this.onSettlementClose()
            this.getUnsettledOrders()
            this.getUnpayOrders()
        },
        /**
         * @name:贷款成功，放弃继续付款
         * @msg:
         * @param {type}
         * @return:
         */
        cancelPay () {
            if (this.settleFlag === 0) {
                this.getUnsettledOrders()
                this.getUncompletedOrders()
                this.getCompletedOrders()
            } else {
                this.getUnsettledOrders()
                this.getUncompletedOrders()
                this.getCompletedOrders()
                this.queryPayRecord()
            }
            this.loanedModal = false
            this.wzPayedModal = false
            this.onSettlementClose()
        },
        cardCancelPay () {
            if (this.settleFlag === 0) {
                this.getUnsettledOrders()
                this.getUncompletedOrders()
                this.getCompletedOrders()
            } else {
                this.getUnsettledOrders()
                this.getUncompletedOrders()
                this.getCompletedOrders()
                this.queryPayRecord()
            }
            this.cardPayedModel = false
            this.cardModal = false
            this.cardNo = ''
            this.cardAmount = 0
            this.cardBalance = 0
            this.onSettlementClose()
        },
        confirmPay () {
            this.loanedModal = false
            this.onSettlementClose()
            this.getUnsettledOrders()
            this.getCompletedOrders()
        },
        /**
         * @name: 贷款成功，继续付款
         * @msg:
         * @param {type}
         * @return:
         */
        continuePay () {
            if (this.loanLeft > 0) {
                this.allowEdit = false
                // 获取付款记录
                this.queryPayRecord()
                this.loanedModal = false
            } else {
                this.$message.warning('支付金额不能大于尾款金额')
                this.loanedModal = false
                this.onSettlementClose()
            }
        },
        wzContinuePay () {
            if (this.unPay > 0) {
                this.queryPayRecord()
                this.wzPayedModal = false
            } else {
                this.$message.warning('支付金额不能大于尾款金额')
                this.wzPayedModal = false
                this.onSettlementClose()
            }
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
        /**
         * @name: 分期贷关闭
         * @msg:
         * @param {type}
         * @return:
         */
        loanCancel () {
            this.loanModal = false
            this.getUnsettledOrders()
        },
        /**
         * @name: 分期贷款提交
         * @msg:
         * @param {type}
         * @return:
         */
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
                            console.log('贷款成功：', res.data)
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
        /**
         * @name: 根据流水号查看对应支付记录
         * @msg:
         * @param {type}
         * @return:
         */
        getPayRecord (payNumber) {
            const orderIds = []
            payNumber.shoppingTrolleyDetailList.forEach(item => {
                orderIds.push(item.code)
            })
            axios({
                path: 'ShoppingPayRecordQueryShoppingPayRecord',
                method: 'post',
                body: {
                    orderIds
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log('查询到的订单付款记录', data)
                    this.shoppingPayRecords = [...data.shoppingPayRecords]
                }
            })
            this.payRecordModal = true
        },
        /**
         * @name: 打印发票
         * @msg:
         * @param {type}
         * @return:
         */
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
                        item.src = jrQrcode.getQrBase64(`http://nnfp.jss.com.cn/invoice/scan/k0.action?id=${item.invoiceSerialNum}`, {
                            width: 100,
                            height: 100
                        })
                    })
                    this.returnInvoiceInfo = [...data]
                    console.log('查询到的发票信息', this.returnInvoiceInfo)
                    this.invoiceModal = true
                }
            })
        },
        // 补充发票
        invoiceCancellation (payNumber, orderInfo) {
            axios({
                path: 'NuonuoInvoiceRequestBilling',
                method: 'post',
                body: {
                    orderIds: [orderInfo.code],
                    invoiceType: 2,
                    operationType: 2,
                    payNumber: payNumber
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                }
            })
        },
        /**
         * @name: 打印小票
         * @msg:
         * @param {type}
         * @return:
         */
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
        printTicketCancel () {
            this.ticketModal = false
            this.cashTicketModal = false
            this.invoiceModal = false
        },
        /**
         * @name: 金额格式化
         * @msg:
         * @param {type}
         * @return:
         */
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'RetailReceipt') {
                this.getUnsettledOrders()
                this.getUnpayOrders()
                this.getUncompletedOrders()
                this.getCompletedOrders()
                this.settleGoods = []
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
</style>

<style lang="less" scoped>
// tab样式
/deep/.ant-tabs-nav-scroll {
  border: 1px solid #ddd;
  background: #fff;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
  border:none;
  border-radius: 0;
  margin: 0;
  background: #fff;
}
/deep/.ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
  background: #1890ff;
  color: #fff;
}
/deep/.ant-card-bordered {
  margin-bottom: 20px;
  .ant-card-body {
    padding: 0;
    .payNumber {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #eee;
      height:24px;
      line-height: 24px;
      margin-top: 15px;
      div{
        display: inline-block;
      }
      .number{
        padding-left: 30px;
      }
      .payNumberOpt{
        padding-right:20px;
        a{
          text-decoration: none;
        }
        .payRecord {
          margin-right: 10px;
        }
      }
    }
  }
}
// 流水号对应结算
.payNumber-pay {
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #eee;
  padding-left: 24px;
  .pay-right {
    display: flex;
    padding-right:30px;
    .ant-btn {
      margin-top:9px;
      margin-left: 10px;
    }
  }
}
// 商品列表
.goods {
  border-bottom: 1px solid #eee;
  padding:15px;
  .ant-row {
    position: relative;
    .returned {
      position: absolute;
      left: 50%;
      top: 50%;
      width:50px;
      height: 50px;
    }
  }
  .ant-col-3 {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      display: inline-block;
      height: 99px;
      width: auto;
    }
  }
  .ant-col-8,
  .ant-col-10,
  .ant-col-12 {
    p {
      font-weight: 700;
      margin: 3px;
    }
  }
  .order-info,
  .pay-record {
    padding-top: 10px;
    padding-left: 10px;
    pre {
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 2px;
      // text-align: center;
    }
  }
  .order-info{
    p{
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 10px;
      text-align: center;
    }
  }
}
// 详情/编辑/删除/配送激活类
.right {
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  p{
    margin-bottom: 10px;
  }
  a {
    text-decoration: none;
    font-size: 12px;
    color:rgba(0,0,0,0.65);
    margin-right: 5px;
  }
  .active {
    color: #1890ff;
  }
}
// 未支付底部样式
.unsettle-footer{
  display: flex;
  justify-content: space-between;
  height: 50px;
  line-height: 50px;
  .checkall{
    padding-left: 15px;
  }
  .unsettle-right{
    display:flex;
    padding-right: 30px;
    .ant-btn{
      margin-top: 5px;
      margin-left: 10px;
    }
  }
}
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
.pay-detail {
  font-size: 12px;
  font-weight: 400;
  color: #ccc;
  border-left: 1px solid #eee;
  text-align: center;
}
// 顾客税票
.taxOptions {
  a{
    text-decoration: none;
    margin-left: 10px;
  }
}
.ant-checkbox-group{
  width: 100%;
  height:100%;
}
// 结算/已选电子券
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
// 结算/电子券列表
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
// 结算主页
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
// 促销记录
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
#print-box {
  width: 400px;
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
/deep/ .ant-tabs-nav-scroll {
  border: none;
  .ant-tabs-nav .ant-tabs-tab {
    margin: 0;
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

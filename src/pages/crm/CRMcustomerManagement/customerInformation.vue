<!--
 * @Description: 顾客信息
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-03 11:04:00
 * @LastEditTime: 2019-08-28 11:14:58
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          type="primary"
          v-action:edit
          size="small"
          style="margin-right:10px"
          icon="lock"
          @click="freezeHandler('isM')">冻结</a-button>
        <a-button
          type="primary"
          size="small"
          style="margin-right:0px"
          v-action:edit
          icon="unlock"
          @click="thawHandler('isM')">解冻</a-button>
      </div>
    </seachBox>
    <!-- 主表 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增  编辑 顾客信息 -->
    <bt-modal
      v-model="addEditModal"
      :title="addEditModalTitle"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :submitClick="submitClick"
      centered>
      <a-form :form="form">
        <a-row class="titleSet">基础信息</a-row>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">姓名</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入姓名"
                v-decorator="$check('customerAddEditInformation.name',{initialValue:tableSingleData.name})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">手机号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入联系方式"
                v-decorator="$check('customerAddEditInformation.telephone',{initialValue:tableSingleData.telephone})"
              />
            </a-form-item>
          </a-col>

          <a-col :sm="8" :md="4" :xl="3">性别</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-radio-group
                style="width:100%"
                v-decorator="$check('customerAddEditInformation.sex',{initialValue:tableSingleData.sex||0})"
              >
                <a-radio :value="0">女</a-radio>
                <a-radio :value="1">男</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">身份证号码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入身份证号码"
                v-decorator="$check('customerAddEditInformation.idCard',{initialValue:tableSingleData.idCard})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地址</a-col>
          <a-col :sm="16" :md="8" :xl="13">
            <a-form-item>
              <a-input
                style="width:100%"
                disabled
                placeholder=""
                v-decorator="$check('customerAddEditInformation.address',{initialValue:tableSingleData.address})">
                <a-icon slot="addonAfter" type="environment" @click="amapAddEditModal=true"/>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">详细地址</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <a-form-item>
              <a-textarea
                style="width:100%"
                :autosize="{ minRows: 1}"
                placeholder="请输入地址、门牌号"
                v-decorator="$check('customerAddEditInformation.addressDetail',{initialValue:tableSingleData.addressDetail})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="titleSet">其他信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">学历</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                placeholder="请选择学历"
                v-decorator="$check('customerAddEditInformation.education',{initialValue:tableSingleData.education})"
              >
                <a-select-option value="初中">初中</a-select-option>
                <a-select-option value="高中">高中</a-select-option>
                <a-select-option value="大专">大专</a-select-option>
                <a-select-option value="本科">本科</a-select-option>
                <a-select-option value="硕士">硕士</a-select-option>
                <a-select-option value="博士">博士</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收入</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                placeholder="请选择收入"
                v-decorator="$check('customerAddEditInformation.income',{initialValue:tableSingleData.income})"
              >
                <a-select-option value="3000以下">3000以下</a-select-option>
                <a-select-option value="3000-5000">3000-5000</a-select-option>
                <a-select-option value="5000-7000">5000-7000</a-select-option>
                <a-select-option value="7000-10000">7000-10000</a-select-option>
                <a-select-option value="10000-20000">10000-20000</a-select-option>
                <a-select-option value="20000以上">20000以上</a-select-option>
                <a-select-option value="其他">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">职位</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入职位"
                v-decorator="$check('customerAddEditInformation.position',{initialValue:tableSingleData.position})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :autosize="{ minRows: 2 }"
                v-decorator="$check('customerAddEditInformation.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 地图 -->
        <amapAddEditCompoent v-model="amapAddEditModal" @dragMap="dragMapAddEdit" :addressData="amapAddEditForm"></amapAddEditCompoent>
      </a-form>
    </bt-modal>
    <!-- 税票信息 -->
    <a-modal
      v-model="TaxBillModal"
      title="税票信息"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      wrapClassName="setTaxBillCss"
      centered>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="submitLoading" @click="TaxBillModal=false">关闭</a-button>
      </template>
      <div>
        <a-button size="small" v-action:add style="margin-bottom:5px" @click="addEditTaxBillFn($event,-1)" :disabled="tableSatus!=='customer_status:2'?false:true">新增</a-button>
      </div>
      <a-spin :spinning="TaxBillSpin">
        <div v-if="TaxBillDataArr.length>0">
          <a-collapse defaultActiveKey="0">
            <a-collapse-panel v-for="(item,index) in TaxBillDataArr" :key="index">
              <template slot="header">
                <a-row type="flex" justify="space-between" align="middle">
                  <a-col :span="20">
                    <div class="height-50">
                      {{ item.invoiceName }}
                      <span style="color:#909399">（{{ item.type===1?'个人/事业单位':'企业' }}）</span>
                    </div>
                  </a-col>
                  <a-col :span="2" v-if="tableSatus!=='customer_status:2'">
                    <a v-action:edit href="javascript:;" class="height-100" @click.stop="addEditTaxBillFn($event,item)">编辑</a>
                  </a-col>
                  <a-col :span="2" v-if="tableSatus!=='customer_status:2'">
                    <a v-action:delete href="javascript:;" style="color:#F56C6C;" class="height-100" @click.stop="deleteTaxBill($event,item)">删除</a>
                  </a-col>
                </a-row>
              </template>
              <a-form>
                <a-row class="doc" v-if="item.type===2">
                  <a-col :span="4">发票抬头</a-col>
                  <a-col :span="20">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder=""
                        :value="item.invoiceName"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc" v-if="item.type===1">
                  <a-col :span="4">发票抬头</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder="请输入发票抬头"
                        :value="item.invoiceName"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">联系方式</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder="请输入联系方式"
                        :value="item.telephone"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc" v-if="item.type===2">
                  <a-col :span="4">联系方式</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder=""
                        :value="item.telephone"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">纳税人识别号</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder=""
                        :value="item.invoiceCode"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc" v-if="item.type===2">
                  <a-col :span="4">开户行名称</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder=""
                        :value="item.bankName"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="4">开户行账号</a-col>
                  <a-col :span="8">
                    <a-form-item>
                      <a-input
                        disabled
                        style="width:100%"
                        placeholder=""
                        :value="item.bankCode"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="lastChildCrm">
                  <a-col :span="4">详细地址</a-col>
                  <a-col :span="20">
                    <a-form-item>
                      <a-textarea
                        disabled
                        :autosize="{ minRows: 1, maxRows: 3 }"
                        style="width:100%"
                        placeholder=""
                        :value="item.address"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div v-else>
          <a-card style="text-align:center;color:#C0C4CC">
            暂无数据
          </a-card>
        </div>
      </a-spin>
    </a-modal>
    <!-- 税票新增 编辑 -->
    <a-modal
      v-model="addEditTaxBillModal"
      :title="addEditTaxBillModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="addEditTaxBillModal=false">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="submitTaxLoading" @click="submitTaxBillClick">提交</a-button>
      </template>
      <a-form :form="TaxBillForm">
        <a-row class="doc">
          <a-col :span="4">税票类型</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group
                style="width:100%"
                @change="changeTypeValue"
                v-decorator="$check('customerInformation.type',{initialValue:TaxBillData.type||typeValue})"
              >
                <a-radio :value="1">个人/事业单位</a-radio>
                <a-radio :value="2">企业</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc" v-if="typeValue===2">
          <a-col :span="4">发票抬头</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入发票抬头"
                v-decorator="$check('customerInformation.invoiceName',{initialValue:TaxBillData.invoiceName})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc" v-if="typeValue===1">
          <a-col :span="4">发票抬头</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入发票抬头"
                v-decorator="$check('customerInformation.invoiceName',{initialValue:TaxBillData.invoiceName})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">联系方式</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入联系方式"
                v-decorator="$check('customerInformation.telephone',{initialValue:TaxBillData.telephone})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc" v-if="typeValue===2">
          <a-col :span="4">联系方式</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入联系方式"
                v-decorator="$check('customerInformation.telephone',{initialValue:TaxBillData.telephone})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">纳税人识别号</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入纳税人识别号"
                v-decorator="$check('customerInformation.invoiceCode',{initialValue:TaxBillData.invoiceCode})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc" v-if="typeValue===2">
          <a-col :span="4">开户行名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入开户行名称"
                v-decorator="$check('customerInformation.bankName',{initialValue:TaxBillData.bankName})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">开户行账号</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入开户行账号"
                v-decorator="$check('customerInformation.bankCode',{initialValue:TaxBillData.bankCode})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">详细地址</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                style="width:100%"
                :autosize="{ minRows: 2, maxRows: 3 }"
                placeholder="请输入详细地址"
                v-decorator="$check('customerInformation.address',{initialValue:TaxBillData.address})"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 顾客地址 -->
    <a-modal
      v-model="harvestAddressModal"
      title="收货地址"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      wrapClassName="setTaxBillCss"
      centered>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="submitLoading" @click="harvestAddressModal=false">关闭</a-button>
      </template>
      <div>
        <a-row>
          <a-col :span="12" style="color:#303133">收货人信息</a-col>
          <a-col :span="12" style="text-align:right">
            <a v-action:add href="javascript:;" @click="addEditAddress(-1)" v-if="tableSatus!=='customer_status:2'">新增收货地址</a>
          </a-col>
        </a-row>
        <a-spin :spinning="loadingListAddress">
          <a-list
            class="customerloadmore-list"
            itemLayout="horizontal"
            :dataSource="addressDataArr">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a v-action:edit v-if="tableSatus!=='customer_status:2'" slot="actions" herf="javascript:;" @click="addEditAddress(item)">编辑</a>
              <a
                v-action:delete
                v-if="tableSatus!=='customer_status:2'"
                slot="actions"
                style="color:#F56C6C"
                herf="javascript:;"
                @click="deleteAddress(item)">删除</a>
              <a-list-item-meta>
                <a-row slot="title" :gutter="16" type="flex" align="middle">
                  <a-col :xs="{ span: 5}" :md="{ span: 4 }">
                    <div :class="item.isDefault===0?'nameBorder':'nameBorderChose'">
                      {{ item.name }}
                    </div>
                    <span></span>
                  </a-col>
                  <a-col :xs="{ span:7 }" :md="{ span: 12}">
                    <!-- <a-tooltip placement="topLeft" :title="item.address" :defaultVisible="true"> -->
                    <p class="nowarp" style="margin-bottom:0px">{{ item.concatAddress }}</p>
                    <!-- </a-tooltip> -->
                  </a-col>
                  <a-col :xs="{ span: 7}" :md="{ span: 4}">{{ item.telephone }}</a-col>
                  <a-col v-if="item.isDefault===0" :xs="{ span: 5 }" :md="{ span: 3 }">
                    <div v-action:edit v-if="tableSatus!=='customer_status:2'" style="cursor:pointer;text-align:center" class="addressHover" @click="changeAddress(item)">设为默认</div>
                  </a-col>
                  <a-col :xs="{ span: 5 }" :md="{ span: 3}" v-if="item.isDefault===1" class="setAddress">默认地址</a-col>
                </a-row>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-spin>
      </div>
    </a-modal>
    <!-- 顾客地址 新增  编辑 -->
    <a-modal
      v-model="addEditAddressModal"
      :title="addEditAddressTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="addEditAddressModal=false">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="submitAddressLoading" @click="submittAddressClick">提交</a-button>
      </template>
      <a-form :form="addressForm">
        <a-row class="doc">
          <a-col :span="4">收货人</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入姓名"
                v-decorator="$check('customerInforAddress.name',{initialValue:addressFormData.name})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">联系方式</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入联系方式"
                v-decorator="$check('customerInforAddress.telephone',{initialValue:addressFormData.telephone})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">性别</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group
                style="width:100%"
                v-decorator="$check('customerInforAddress.sex',{initialValue:addressFormData.sex||0})"
              >
                <a-radio :value="0">女</a-radio>
                <a-radio :value="1">男</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">地址</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input
                style="width:100%"
                disabled
                placeholder=""
                v-decorator="$check('customerInforAddress.address',{initialValue:addressFormData.address})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">详细地址</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                style="width:100%"
                :autosize="{ minRows: 2, maxRows: 3 }"
                placeholder="请输入街道、门牌号"
                v-decorator="$check('customerInforAddress.addressDetail',{initialValue:addressFormData.addressDetail})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 地图 -->
        <Amap @drag="dragMap" :mapWidth="'100%'" :mapHeight="'400px'" :lat="lat" :lng="lng"></Amap>
      </a-form>
    </a-modal>
    <!-- 交易记录 -->
    <a-modal
      v-model="transactionModal"
      title="交易记录"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="this.$store.getters.windowWidth * 0.6"
      destroyOnClose
      class="doc"
      :bodyStyle="{'height':`${this.$store.getters.windowHeight-200}px`,'min-height':'150px'}"
      centered>
      <template slot="footer">
        <a-button key="submit" type="primary" @click="transactionModal=false">关闭</a-button>
      </template>
      <a-spin :spinning="transactionSpin">
        <div class="table-nowrap">
          <a-table
            rowKey="id"
            size="small"
            :columns="transactionColumns"
            bordered
            :scroll="{ x:1200,y:this.$store.getters.windowHeight-350}"
            :pagination="{defaultPageSize:20,hideOnSinglePage:true}"
            :dataSource="transactionData">
            <template slot="skuName" slot-scope="text, record, index">
              <div>
                <a-tooltip v-if="text&&text.length > 18" :key="text" :title="text">
                  <span>{{ `${text.slice(0, 18)}...` }}</span>
                </a-tooltip>
                <span v-else> {{ text }} </span>
              </div>
            </template>
          </a-table>
        </div>
      </a-spin>
    </a-modal>
    <!-- 顾客详情-->
    <preview v-model="previewVisbel" :orderId="orderId" :orderCode="orderCode"></preview>

  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.table-nowrap{
  white-space:nowrap;
  text-overflow:ellipsis;
  margin: 0 10px;
}
.detailsCss .ant-input-disabled{
  color:#303133;
}
.detailsCss .ant-radio-wrapper-disabled>span{
 color:#303133;
}
.customerloadmore-list .ant-list-item-action{
  margin-left:2px
}
.setCard .ant-card-body{
  padding:8px
}
.btn-box{
  display: flex;
  display: -webkit-flex;
  flex-flow:row nowrap;
}
.lastChildCrm{
  .ant-form-explain{
      display: none;
    }
}
</style>
<style lang="less" scoped>
  .setTableA a{
    display: block;
    width: 100%;
    height:100%;
  }
  .customerloadmore-list .nowarp{
    overflow: hidden;
    // white-space: nowrap;
    text-overflow: ellipsis;
  }
  .setTaxBillCss .ant-input-disabled{
      background-color: #fff
  }
  .setTaxBillCss .ant-input-disabled{
    color:#303133;
  }
  .nameBorder{
      border:1px solid #DCDFE6;
      text-align:center;
      padding:2px;
      border-radius:2px;
  }
  .setAddress{
      text-align:center;
      background-color:#909399;
      color:#fff;
  }
  .nameBorderChose{
      border:1px solid #409EFF;
      text-align:center;
      padding:2px;
      border-radius:2px;
  }
  .addressHover:hover{
      color:#409EFF
  }
  .setCard{
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content:flex-start;
    margin-right:10px;
    .setChaseBack {
      background-color: #409EFF;
      color:#fff
    }
    .ant-card-bordered {
      border-radius:10px;
      border: 4px solid #F2F6FC;
    }
    .setBack {
      background-color: #DCDFE6;
      color:#606266
    }
  }

  .lastChildCrm{
      border:1px solid #e8e8e8;
      background-color: #f5f5f5;
      .ant-form-item  {
          margin-bottom:0px;
      }
      .ant-col-4 {
          text-align: right;
          font-weight: bold;
          padding-right: 10px;
          font-size: 12px;
          background-color: #f5f5f5;
          line-height: 36px;
      }
      textarea.ant-input {
          margin-bottom:0px;
          min-height: 36px;
          border-radius:0;
      }

  }
  .tableIcon{
        /deep/ .ant-table-row-expand-icon-cell,/deep/ .ant-table-expand-icon-th{
              display: none;
          }
        /deep/ .ant-table-expand-icon-col:first-child{
          display: none;
        }
        /deep/ .ant-table-expanded-row{
            >td:first-child{
                display: none;
            }
            >td{
                padding: 0;
            }

        }
  }
  .titleSet{
    font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
  }
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import amapAddEditCompoent from './tool/amap'
import preview from './preview/customerInformationPreview'
import { axios } from '@/utils/request'
import Amap from '@comp/Amap'
import map from 'lodash.map'
import moment from 'moment'
export default {
    name: 'CustomerInformation',
    components: { NewTable, SeachBox, Amap, BtModal, amapAddEditCompoent, preview },
    data () {
        return {
            // 搜索
            conditions: [
                {
                    title: '手机号',
                    type: 'input',
                    key: 'telephone'
                },
                {
                    title: '顾客名称',
                    type: 'input',
                    key: 'name'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '顾客状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'customer_status'
                    }
                }

            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {},
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            menuOpt: [
                { name: '编辑',
                    action: 'customerInformation.edit',
                    fc: this.addEdit
                }, { name: '冻结',
                    action: 'customerInformation.edit',
                    fc: this.freezeHandler
                }, { name: '解冻',
                    action: 'customerInformation.edit',
                    fc: this.thawHandler
                },
                { name: '删除',
                    action: 'customerInformation.delete',
                    fc: this.deleteHandler
                },
                { name: '收货地址',
                    action: 'customerInformation.add',
                    fc: this.harvestAddress
                }, { name: '交易记录',
                    action: 'customerInformation.get',
                    fc: this.transactionRecords
                },
                { name: '税票信息',
                    action: 'customerInformation.add',
                    fc: this.TaxBill
                },
                { name: '顾客详情',
                    action: 'customerInformation.get',
                    fc: this.customerDetails
                }
            ],
            disContextMenu: [],
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            tableSatus: '0', // 数据状态
            spinning: false, // 表格加载

            // 新增 编辑
            addEditModal: false,
            addEditModalTitle: '',
            submitLoading: false,
            form: this.$form.createForm(this),
            isAdd: false,
            // 地址地图
            amapAddEditModal: false,
            amapAddEditForm: {
                address: '',
                lat: '', // 纬度
                lng: '', // 经度
                province: '', // 省
                city: '', // 市
                area: '' // 区
            }, // 地图获取的信息

            // 税票信息
            TaxBillSpin: false,
            TaxBillModal: false,
            TaxBillDataArr: [],
            addEditTaxBillModal: false, /// 税票新增
            addEditTaxBillModalTitle: '新增税票信息',
            TaxBillForm: this.$form.createForm(this),
            isAddTax: false,
            TaxBillData: {},
            submitTaxLoading: false,
            typeValue: 1,

            // 收货地址
            harvestAddressModal: false,
            loadingListAddress: false,
            addressDataArr: [],

            // 新增 编辑 收货地址
            addEditAddressModal: false,
            addEditAddressTitle: '',
            submitAddressLoading: false, // 加载
            isAddress: false,
            addressForm: this.$form.createForm(this),
            addressFormData: {},
            lat: '', // 纬度
            lng: '', // 经度
            province: '', // 省
            city: '', // 市
            area: '', // 区

            // 交易记录
            transactionSpin: false,
            transactionModal: false,
            transactionColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '商品编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 200, align: 'center', scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '订单号', dataIndex: 'orderId', width: 150, align: 'center' },
                { title: '销售价格', dataIndex: 'actualPrice', width: 100, align: 'center' },
                { title: '数量', dataIndex: 'quantity', width: 100, align: 'center' },
                { title: '实际应付金额', dataIndex: 'actualPay', width: 100, align: 'center' },
                { title: '应付总金额', dataIndex: 'shouldPay', width: 100, align: 'center' },
                { title: '购买时间', dataIndex: 'createTime', width: 150, align: 'center' }
            ],
            transactionData: [],

            // 顾客详情
            previewVisbel: false,
            orderId: '',
            orderCode: ''
        }
    },
    computed: {},
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '23a18aaaa341446c813d7c2890fb7c1a:customerInformation'
            this.tableApiPath = 'CustomerUserQueryCustomers'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CustomerUserQueryCustomers'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            // console.log(e)
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CustomerUserQueryCustomers')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CustomerUserQueryCustomers' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSatus = tableRow.status
            this.tableSingleData = { ...tableRow }
            this.tableSingleData.activeTime = moment(tableRow.activeTime)
            this.tableSingleData.createTime = moment(tableRow.createTime)
            this.tableSingleData.updateTime = moment(tableRow.updateTime)
            if (tableRow.status === 'customer_status:1') {
                this.disContextMenu = ['解冻']
            } else {
                this.disContextMenu = ['冻结', '编辑', '标签设置']
            }
        },
        /**
         * @name:删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isfress = newData.filter(o => o.status === '1')
                if (isfress.length > 0) {
                    this.$message.warning('只有激活状态的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            const that = this
            this.$confirm({
                title: '删除提示',
                content: '删除后不可恢复，确定继续?',
                okType: 'danger',
                onOk () {
                    axios({
                        path: 'CustomerUserDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 冻结
         * @msg:
         * @param {type}
         * @return:
         */
        freezeHandler (dataSingFree) {
            const that = this
            let arr = []
            if (dataSingFree === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要冻结的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isFreeze = newData.filter(o => o.status !== 'customer_status:1')
                if (isFreeze.length > 0) {
                    this.$message.warning('只有激活状态才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(dataSingFree.id)
            }
            this.$confirm({
                title: '冻结提示',
                content: '冻结后不可进行操作，确定继续?',
                onOk () {
                    axios({
                        path: 'CustomerUserBlockCustomer',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 解冻
         * @msg:
         * @param {type}
         * @return:
         */
        thawHandler (dataSingThaw) {
            const that = this
            let arr = []
            if (dataSingThaw === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要解冻的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isFreeze = newData.filter(o => o.status !== 'customer_status:2')
                if (isFreeze.length > 0) {
                    this.$message.warning('只有冻结状态才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(dataSingThaw.id)
            }
            this.$confirm({
                title: '解冻提示',
                content: '确定要进行解冻?',
                onOk () {
                    axios({
                        path: 'CustomerUserUnBlockCustomer',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 密码重置
         * @msg:
         * @param {type}
         * @return:
         */
        passwordReset (passwordData) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否确认密码重置?',
                onOk () {
                    that.$message.info('等待中')
                    // axios({
                    //     psth: 'PermissionsUserResetPwd',
                    //     method: 'post',
                    //     body: {

                    //     }
                    // }).then(res => {
                    //     if (res.flag === 1) {
                    //         this.reLoadTableData()
                    //     }
                    // })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },
        /**
         * @name:收货地址
         * @msg:
         * @param {type}
         * @return:
         */
        harvestAddress () {
            this.harvestAddressModal = true
            this.getAddreonCancel()
        },
        /**
         * @name: 获取地址列表
         * @msg:
         * @param {type}
         * @return:
         */
        getAddreonCancel () {
            this.loadingListAddress = true
            axios({
                path: 'CustomerAddressAddressQuery',
                method: 'past',
                body: {
                    customerCode: this.tableSingleData.code
                }
            }).then(res => {
                this.loadingListAddress = false
                if (res.flag === 1) {
                    const newData = [...res.data.list]
                    newData.forEach(item => {
                        item.addressId = item.id
                    })
                    this.addressDataArr = res.data.list
                }
            })
        },
        /**
         * @name: 设置默认地址
         * @msg:
         * @param {type}
         * @return:
         */
        changeAddress (data) {
            axios({
                path: 'CustomerAddressAddressUpdateDefault',
                method: 'post',
                body: {
                    customerCode: this.tableSingleData.code,
                    id: data.id,
                    isDefault: 1
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.getAddreonCancel()
                }
            })
            console.log(this.changeAddress)
        },
        /**
         * @name: 删除地址
         * @msg:
         * @param {type}
         * @return:
         */
        deleteAddress (addressDalete) {
            const that = this
            this.$confirm({
                title: '删除提示',
                content: '删除后不可恢复，确定继续?',
                okType: 'danger',
                onOk () {
                    axios({
                        path: 'CustomerAddressAddressDelete',
                        method: 'post',
                        body: {
                            ids: [addressDalete.id]
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.getAddreonCancel()
                        }
                    })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 收货地址新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEditAddress (addEditdata) {
            this.addEditAddressModal = true
            if (addEditdata === -1) {
                this.lng = ''
                this.lat = ''
                this.isAddress = true
                this.addressFormData = {}
                this.addEditAddressTitle = '新增收货地址'
            } else {
                this.isAddress = false
                this.lng = addEditdata.longitude + ''
                this.lat = addEditdata.latitude + ''
                this.addressFormData = { ...addEditdata }
                this.addEditAddressTitle = '编辑收货地址'
            }
        },
        /**
         * @name: 收货地址新增编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submittAddressClick (e) {
            e.preventDefault()
            const { addressForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.isDefault = 0
                    if (!this.isAddress) {
                        values.id = this.addressFormData.id
                        values.isDefault = this.addressFormData.isDefault
                    }
                    values.customerCode = this.tableSingleData.code
                    if (values.address) {
                        values.longitude = this.lng
                        values.latitude = this.lat
                        values.province = this.province
                        values.city = this.city
                        values.area = this.area
                    }
                    this.submitAddressLoading = true
                    axios({
                        path: this.isAddress ? 'CustomerAddressAddressAdd' : 'CustomerAddressAddressUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitAddressLoading = false
                        if (res.flag === 1) {
                            this.addEditAddressModal = false
                            this.getAddreonCancel()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:地图返回的参数
         * @msg:
         * @param {type}
         * @return:
         */
        dragMap (data) {
            this.addressForm.setFieldsValue({
                address: data.address
            })
            this.lng = data.position.lng + ''
            this.lat = data.position.lat + ''
            this.province = data.addressComponent.province
            this.city = data.addressComponent.city
            this.area = data.addressComponent.area
        },
        /**
         * @name: 交易记录
         * @msg:
         * @param {type}
         * @return:
         */
        transactionRecords (transactionData) {
            this.transactionModal = true
            this.transactionSpin = true
            axios({
                path: 'CustomerUserQueryShoppingSaleRecord',
                method: 'post',
                body: {
                    customerCode: transactionData.code
                }
            }).then(res => {
                this.transactionSpin = false
                // console.log(res)
                if (res.flag === 1) {
                    this.transactionData = res.data.data.shoppingSaleRecords
                }
            })
        },
        /**
         * @name: 税票信息
         * @msg:
         * @param {type}
         * @return:
         */
        TaxBill () {
            this.typeValue = 1
            this.TaxBillModal = true
            this.getTaxtList()
        },
        getTaxtList () {
            this.TaxBillSpin = true
            axios({
                path: 'CustomerInvoiceQuery',
                methods: 'post',
                body: {
                    customerCode: this.tableSingleData.code
                }
            }).then(res => {
                this.TaxBillSpin = false
                if (res.flag === 1) {
                    this.TaxBillDataArr = res.data
                }
            })
        },
        /**
         * @name: 新增 编辑 税票信息
         * @msg:
         * @param {type}
         * @return:
         */
        addEditTaxBillFn (e, addEditTax) {
            this.addEditTaxBillModal = true
            if (addEditTax === -1) {
                this.isAddTax = true
                this.TaxBillData = {}
                this.addEditTaxBillModalTitle = '新增税票信息'
            } else {
                e.preventDefault()
                this.TaxBillData = { ...addEditTax }
                this.typeValue = addEditTax.type
                this.addEditTaxBillModalTitle = '编辑税票信息'
                this.isAddTax = false
            }
        },
        /**
         * @name: 税票类型 变更
         * @msg:
         * @param {type}
         * @return:
         */
        changeTypeValue (typeValueP) {
            // console.log(typeValueP)
            this.typeValue = typeValueP.target.value
        },
        /**
         * @name: 新增 编辑 税票信息 提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitTaxBillClick (e) {
            e.preventDefault()
            const { TaxBillForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    if (!this.isAddTax) {
                        values.id = this.TaxBillData.id
                    }
                    values.customerCode = this.tableSingleData.code
                    this.submitTaxLoading = true
                    axios({
                        path: this.isAddTax ? 'CustomerInvoiceAdd' : 'CustomerInvoiceUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitTaxLoading = false
                        if (res.flag === 1) {
                            this.addEditTaxBillModal = false
                            this.getTaxtList()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 税票信息 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteTaxBill (e, deleteData) {
            // console.log(e)
            e.preventDefault()
            const that = this
            this.$confirm({
                title: '删除提示',
                content: '删除后不可恢复，确定继续?',
                okType: 'danger',
                onOk () {
                    axios({
                        path: 'CustomerInvoiceDelete',
                        method: 'post',
                        body: {
                            id: deleteData.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            that.getTaxtList()
                        }
                    })
                },
                onCancel () {
                    that.$message.info('已取消')
                }
            })
        },

        /**
         * @name: 新增 编辑 弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.addEditModal = true
            if (addEditData === -1) {
                this.lng = ''
                this.lat = ''
                this.tableSingleData = {}
                this.addEditModalTitle = '新增顾客信息'
                this.isAdd = true
                this.amapAddEditForm.address = ''
                this.amapAddEditForm.lat = ''
                this.amapAddEditForm.lng = ''
                this.amapAddEditForm.province = ''
                this.amapAddEditForm.city = ''
                this.amapAddEditForm.area = ''
            } else {
                this.addEditModalTitle = '编辑顾客信息'
                this.isAdd = false
                this.lng = addEditData.longitude + ''
                this.lat = addEditData.latitude + ''
                // 新增地图 弹窗
                this.amapAddEditForm.address = addEditData.address
                this.amapAddEditForm.lat = addEditData.latitude + ''
                this.amapAddEditForm.lng = addEditData.longitude + ''
                this.amapAddEditForm.province = addEditData.province
                this.amapAddEditForm.city = addEditData.city
                this.amapAddEditForm.area = addEditData.area
                // console.log(this.lng)
                this.tableSingleData = { ...addEditData }
            }
        },
        /**
         * @name: 新增编辑地图
         */
        dragMapAddEdit (data) {
            // this.$nextTick(() => {
            console.log(data)
            this.amapAddEditForm.address = data.address
            this.amapAddEditForm.lat = data.lat + ''
            this.amapAddEditForm.lng = data.lng + ''
            this.amapAddEditForm.province = data.province
            this.amapAddEditForm.city = data.city
            this.amapAddEditForm.area = data.area
            this.form.setFieldsValue({
                address: this.amapAddEditForm.address
            })
        },
        /**
         * @name:  新增  编辑 提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.originate = 'customer_originate:2'
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.originate = this.tableSingleData.originate
                    }
                    values.latitude = this.amapAddEditForm.lat
                    values.longitude = this.amapAddEditForm.lng
                    values.province = this.amapAddEditForm.province
                    values.city = this.amapAddEditForm.city
                    values.area = this.amapAddEditForm.area
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'CustomerUserAdd' : 'CustomerUserUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 储蓄卡 点击卡片
         * @msg:
         * @param {type}
         * @return:
         */
        onTabChangeCard (cardIndex, cardRow) {
            axios({
                // TradeRecordQueryValueRecords
                path: 'TradeRecordQueryValueRecords',
                method: 'post',
                body: {
                    cardNo: cardRow.cardNo,
                    typeName: cardRow.typeName
                }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                }
            })
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        customerDetails (detailData) {
            this.orderId = detailData.id
            this.orderCode = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'CustomerInformation') {
            }
        }
    }
}
</script>

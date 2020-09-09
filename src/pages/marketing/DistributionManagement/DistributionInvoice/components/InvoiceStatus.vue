<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: haile
 * @Date: 2019-04-18 15:07:08
 * @LastEditTime: 2019-08-20 19:58:32
 -->
<template>
  <div class="Invoice">
    <div class="home" @click="isChange(0)">
      新增开票
    </div>
    <a-tabs :defaultActiveKey="activeKey" @change="callback">
      <a-tab-pane tab="订单" key="0">
        <div class="submitted">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
          <div class="goods-list">
            <a-table
              :columns="columns"
              :dataSource="data"
              expandRowByClick

              :loading="loading"
              :pagination="false"
              class="goods-i">
              <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
                <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                  <div class="goods-d">
                    <img v-if="goods.goodPic[0]" :src="goods.goodPic[0]" @error.once="moveErrorImg($event)" alt="">
                    <img v-else src="@assets/goods.png" alt="">
                    <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  </div>
                  <a-table
                    :columns="itemColumns"
                    :pagination="false"
                    :dataSource="goods.wholesaleOrderDetailList"
                    class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  </a-table>
                </div>
                <div class="goods-footer">
                  <p>
                    收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                  </p>
                  <div class="price">
                    <div>
                      SKU种类：<span>{{ record.skuNum }}</span>
                      数量总计：<span>{{ record.totalNum }}</span>
                      合计金额：<span>{{ record.saleAmount }}</span>
                      <a-button type="primary" @click="addDistributionBill(record)">导入开票</a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-table>
          </div>
        </div>

      </a-tab-pane>
      <a-tab-pane tab="特价审批单" key="1">
        <div class="submitted">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
          <div class="goods-list">
            <a-table
              :columns="specialColumns"
              :dataSource="data"
              expandRowByClick

              :loading="loading"
              :pagination="false"
              class="goods-i">
              <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
                <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                  <div class="goods-d">
                    <img v-if="goods.goodPic[0]" :src="goods.goodPic[0]" @error.once="moveErrorImg($event)" alt="">
                    <img v-else src="@assets/goods.png" alt="">
                    <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>

                  </div>
                  <a-table
                    :columns="itemColumns"
                    :pagination="false"
                    :dataSource="goods.wholesaleBillDetailList"
                    class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  </a-table>
                </div>
                <div class="goods-footer">
                  <p>
                    收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                  </p>
                  <div class="price">
                    <div>
                      SKU种类：<span>{{ record.skuNum }}</span>
                      数量总计：<span>{{ record.totalNum }}</span>
                      合计金额：<span>{{ record.saleAmount }}</span>
                      <a-button type="primary" @click="leadIn(record)">导入开票</a-button>
                    </div>
                  </div>
                </div>
              </div>
            </a-table>
          </div>
        </div>

      </a-tab-pane>
      <a-tab-pane tab="待确认" key="2">
        <div class="haveNot">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="goods-list">
          <a-table
            :columns="notBillColumns"
            :dataSource="data"
            expandRowByClick

            :loading="loading"
            :pagination="false"
            class="goods-i">
            <a-button
              slot="action"
              type="primary"
              slot-scope="record"
              @click.stop="addGoods(record)"
              size="small"
              v-if="record.sourceType===3">追加商品</a-button>
            <div slot="expandedRowRender" slot-scope="record,index" style="margin: 0" class="good-item">
              <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                <!-- <a-checkbox
                  @change="onChangeGood(record,goods,index,$event)"
                  :indeterminate="goods.indeterminate"
                  :checked="goods.checkAll"
                  v-if="record.sourceType===3"></a-checkbox> -->
                <div class="goods-d">
                  <img v-if="goods.goodPic[0]" @error.once="moveErrorImg($event)" :src="goods.goodPic[0]" alt="">
                  <img v-else src="@assets/goods.png" alt="">
                  <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  <a-button @click="editorDetail(record,i)" v-if="record.sourceType===3">编辑</a-button>
                  <!-- <a-button @click="editorDetail(record,index)" >编辑</a-button> -->
                </div>
                <a-table
                  :columns="itemColumns"
                  :pagination="false"
                  :rowSelection="record.sourceType===-1?{selectedRowKeys: selectedRowKeys[record.code+goods.goodCode],onSelect:onSelect, onChange: onSelectChange,hideDefaultSelections:true ,getCheckboxProps:()=>record,index}:null"
                  :dataSource="goods.wholesaleBillDetailList"
                  class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  <a-button
                    slot="action"
                    type="primary"
                    slot-scope="text,sku,skuIndex"
                    @click.stop="deleteSku(record,goods,sku,skuIndex)"
                    size="small"
                    v-if="record.sourceType!==2">删除</a-button>
                </a-table>
              </div>
              <div class="goods-footer">
                <p>
                  收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                </p>
                <div class="price">
                  <!-- <a-checkbox
                    @change="onChange(record,index,$event)"
                    :indeterminate="record.indeterminate"
                    :checked="record.checkAll"
                    v-if="record.sourceType===3">全选</a-checkbox> -->
                  <span style="color:red;cursor:pointer;" @click="deleteOrder(record,index)" >删除</span>
                  <div>
                    SKU种类：<span>{{ record.skuNum }}</span>
                    数量总计：<span>{{ record.totalNum }}</span>
                    合计金额：<span>{{ record.saleAmount }}</span>
                    <a-button type="primary" @click="updateCommitOrde(record)">确认开票</a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="已确认" key="3">
        <div class="submitted">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
          <div class="goods-list">
            <a-table
              :columns="billColumns"
              :dataSource="data"
              expandRowByClick

              :loading="loading"
              :pagination="false"
              class="goods-i">
              <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
                <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                  <div class="goods-d">
                    <img v-if="goods.goodPic[0]" @error.once="moveErrorImg($event)" :src="goods.goodPic[0]" alt="">
                    <img v-else src="@assets/goods.png" alt="">
                    <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  </div>
                  <a-table
                    :columns="itemColumns"
                    :pagination="false"
                    :dataSource="goods.wholesaleBillDetailList"
                    class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  </a-table>
                </div>
                <div class="goods-footer">
                  <p>
                    收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                  </p>
                  <div class="price">
                    <div>
                      SKU种类：<span>{{ record.skuNum }}</span>
                      数量总计：<span>{{ record.totalNum }}</span>
                      合计金额：<span>{{ record.saleAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      title="提示信息"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form
        :form="specialForm"
        @submit="handleSubmit"
      >
        <a-form-item
          label="经销类型"
        >
          <a-select

            v-decorator="[
              'wholesaleType',
              {rules: [{ required: true, message: '请选择经销类型!' }]}
            ]"
            placeholder="请选择经销类型"
          >
            <a-select-option value="0">
              经销
            </a-select-option>
            <a-select-option value="1">
              代销
            </a-select-option>

          </a-select>
        </a-form-item>
        <a-form-item
          label="提货类型"
        >
          <a-select
            v-decorator="[
              'takeType',
              {rules: [{ required: true, message: '请选择提货类型!' }]}
            ]"
            placeholder="请选择提货类型"

          >
            <a-select-option :value="item.value" v-for="(item,index) in pickupType" :key="index">{{ item.key }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="提货位置"
        >
          <a-select
            v-decorator="[
              'takeStoreCode',
              {rules: [{ required: true, message: '请选择提货位置!' }]}
            ]"
            placeholder="请选择提货位置"

          >
            <a-select-option :value="item.code" v-for="(item,index) in WarehouseList" :key="index">{{ item.code }}-{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
import userPhoto from '@assets/goods.png'

export default {
    name: 'InvoiceStatus',
    components: {
        seachBox
    },
    props: {
        isSpecial: {
            type: Number,
            default: 0
        },
        customer: {
            type: String,
            default: ''
        },
        customerCode: {
            type: String,
            default: ''
        },
        goodsId: {
            type: Object,
            default: function () {
                return {}
            }
        },
        salesApproach: {
            type: String,
            default: ''
        },
        warehouse: {
            type: Object,
            default: function () {
                return {}
            }
        },
        packupCode: {
            type: String,
            default: ''
        },
        selectBillCount: {
            type: Number,
            default: 0
        },
        billSelectSkuCount: {
            type: Number,
            default: 0
        },
        isAdd: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            // 提价审批单对话框
            // POST DistWholesaleBillAddDistributionBill POST DistWholesaleBillFindBillEdit
            // POST  DistWholesaleBillUpdateCommitBill
            visible: false,
            // 对话框loading
            confirmLoading: false,
            formLayout: 'horizontal',
            specialForm: this.$form.createForm(this),

            specialItem: {},
            // 提货类型
            pickupType: [
                {
                    value: '1',
                    key: '客户自提'
                }, {
                    value: '2',
                    key: '集中配送'
                }
            ],
            // 提货位置
            WarehouseList: [],

            // tab 默认
            activeKey: '0',
            timer: {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            },
            form: this.$form.createForm(this),
            // form: {
            //     searchParam: '',
            //     code: '',
            //     startTime: '',
            //     endTime: ''
            // },
            // 订单表格
            columns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '提货类型', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => `${record.takeType === '1' ? '客户自提' : '集中配送'}` },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                { title: '分销类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => `${record.wholesaleType === '0' ? '经销' : '代销'}` },
                { title: '制单人', dataIndex: 'createBy', key: 'createBy' },
                { title: '制单位置', dataIndex: 'saleStoreName', key: 'saleStoreName' },
                { title: '下单时间', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => `${moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}` }

            ],
            // 未提交
            notBillColumns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '提货类型', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => `${record.takeType === '1' ? '客户自提' : '集中配送'}` },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                { title: '分销类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => `${record.wholesaleType === '0' ? '经销' : '代销'}` },
                { title: '制单人', dataIndex: 'createBy', key: 'createBy' },
                { title: '制单位置', dataIndex: 'saleStoreName', key: 'saleStoreName' },
                { title: '下单时间', dataIndex: 'orderTime', key: 'orderTime', customRender: (text, record, index) => `${moment(record.orderTime).format('YYYY-MM-DD HH:mm:ss')}` },
                { title: '导入时间', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => `${moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}` },
                { title: '单据来源', dataIndex: 'sourceType', key: 'sourceType', customRender: (text, record, index) => `${record.sourceType === 1 ? '订单' : record.sourceType === 2 ? '审批单' : '手动录入'}` },
                {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            // 已提交
            billColumns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '提货类型', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => `${record.takeType === '1' ? '客户自提' : '集中配送'}` },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                { title: '分销类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => `${record.wholesaleType === '0' ? '经销' : '代销'}` },
                { title: '制单人', dataIndex: 'createBy', key: 'createBy' },
                { title: '制单位置', dataIndex: 'saleStoreName', key: 'saleStoreName' },
                { title: '下单时间', dataIndex: 'orderTime', key: 'orderTime', customRender: (text, record, index) => `${moment(record.orderTime).format('YYYY-MM-DD HH:mm:ss')}` },
                { title: '单据来源', dataIndex: 'sourceType', key: 'sourceType', customRender: (text, record, index) => `${record.sourceType === 1 ? '订单' : record.sourceType === 2 ? '审批单' : '手动录入'}` }
            ],
            // 特价审批单
            specialColumns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '下单时间', dataIndex: 'approveOrderTime', key: 'approveOrderTime', customRender: (text, record, index) => `${moment(record.approveOrderTime).format('YYYY-MM-DD HH:mm:ss')}` }
            ],
            // 二级表格
            itemColumns: [
                { title: '商品规格', dataIndex: 'skuModel', key: 'skuModel', width: 360, customRender: (text, record, index) => `${record.skuCode + ' ' + record.skuModel + ' ' + record.skuName}` },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '分销价(元)', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => `${record.billPrice.toFixed(2)}` },
                { title: '优惠活动', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '金额(元)', dataIndex: 'price', key: 'price', customRender: (text, record, index) => this.$math.mul(record.billPrice, record.billQuantity, 2) },
                {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            // 表格数据
            data: [],
            // 表格展开的行
            expandedRowKeys: [],
            // 表格复选
            selectedRowKeys: {},
            loading: false,
            // 单选选中
            keys: [],
            keysPrice: [],
            // 是否用户特价审批单
            customerSpecial: false,
            customerCodeArr: []
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])

    },
    created () {
        console.log(this.$props.isSpecial)
        this.getCustomerCodeDorpArr()
        if (this.$props.isSpecial === 2) {
            this.activeKey = '1'
            this.timer.startTime = ''
            this.timer.endTime = ''
            this.customerSpecial = true
            // this.findSpecialPriceList()
        } else if (this.$props.isSpecial === 3) {
            this.activeKey = '2'
            this.timer = {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }
        } else {
            this.timer = {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }
        }
    },
    /**
     * @name: 判断跳转状态
     * @msg:
     * @param {type}
     * @return:
     */
    mounted () {
        // console.log(this.warehouse, this.customerCode)
        console.log(this.$props.isSpecial)
        if (this.$props.isSpecial === 1 && this.customerCode) {
            this.form.setFieldsValue({ searchParam: this.customerCode })
            this.form.setFieldsValue({ startTime: '' })
            this.form.setFieldsValue({ endTime: '' })
            this.findOrderListByParam()
        } else if (this.$props.isSpecial === 2) {
            this.activeKey = '1'
            this.findSpecialPriceListByCustomerCode()
        } else if (this.$props.isSpecial === 3) {
            this.callback('2')
        } else {
            this.findOrderListByParam()
            // this.queryStoreWarehouseList()
        }
        this.queryStoreWarehouseList()
    },
    methods: {
        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        /**
         * @name: 客户
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerCodeDorpArr () {
            axios({
                path: 'CustomerDistributorsFindBySelected',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)

                    // const dataArr = [...res.data.list]
                    // dataArr.forEach(i => {
                    //     i.title = `${i.code}-${i.name}`
                    //     i.value = i.code
                    //     i.key = i.code
                    // })
                    this.customerCodeArr = res.data.list
                }
            })
        },
        // 追加商品
        async addGoods (el) {
            console.log(el)
            const warehouse = {
                code: el.takeStoreCode,
                name: el.takeStoreName
            }
            await this.$emit('updates', 'customer', el.customerName)
            await this.$emit('updates', 'customerCode', el.customerCode)
            await this.$emit('updates', 'salesApproach', el.wholesaleType)
            await this.$emit('updates', 'packupCode', el.takeType)
            await this.$emit('updates', 'warehouse', warehouse)
            this.isChange(0)
        },

        /**
         * @name: // 获取订单接口
         * @msg:
         * @param {type}
         * @return:
         */

        findOrderListByParam () {
            this.loading = true
            const data = {
                // takeStoreCode: this.warehouse.code,
                // takeStoreCode: this.storeInfo.code,
                saleStoreCode: this.storeInfo.code,
                createBy: this.userInfo.code,
                // customerCode: this.customerCode,
                status: '1',
                searchParam: this.form.getFieldValue('searchParam'),
                code: this.form.getFieldValue('code'),
                startTime: this.form.getFieldValue('startTime') ? moment(this.form.getFieldValue('startTime')._d).format('YYYY-MM-DD') : '',
                // startTime: '2019-01-01',
                endTime: this.form.getFieldValue('endTime') ? moment(this.form.getFieldValue('endTime')._d).format('YYYY-MM-DD') : ''
            }
            console.log(data)
            axios({
                // path: 'DistWholesaleOrderFindOrderListByParam',DistWholesaleOrderFindOrderList4BillByParam
                path: 'DistWholesaleOrderFindOrderList4BillByParam',
                method: 'post',
                body: data
            }).then(res => {
                console.log(res)
                this.loading = false
                if (res.flag === 1) {
                    if (res.data) {
                        res.data.forEach(good => {
                            good.saleAmount = 0
                            good.totalNum = 0
                            good.skuNum = 0
                            if (good.wholesaleGoodList) {
                                good.wholesaleGoodList.forEach((el, index) => {
                                    el.wholesaleOrderDetailList.forEach(item => {
                                        console.log(item.billQuantity, item.billPrice)
                                        good.saleAmount = good.saleAmount + item.billQuantity * item.billPrice
                                        // el.saleAmount =
                                        good.totalNum += item.billQuantity
                                        good.skuNum += 1
                                    })
                                    el.goodPic = el.goodPic ? el.goodPic.split(',') : ['']
                                })
                                good.saleAmount = good.saleAmount.toFixed(2)
                            }
                        })
                        // this.data = []
                        // this.data = JSON.parse(JSON.stringify(res.data))
                        this.data = []
                        this.$nextTick(() => {
                            this.data = JSON.parse(JSON.stringify(res.data))
                            console.log(this.data)
                        })
                        console.log(this.data)
                    } else {
                        this.data = []
                    }

                    // this.data[0].wholesaleOrderDetailList.push(this.data[0].wholesaleOrderDetailList[0])
                }
            })
        },
        /**
         * @name: 获取当前店铺提货位置
         * @msg:
         * @param {type}
         * @return:
         */
        async queryStoreWarehouseList () {
            const data = {
                code: this.storeInfo.code
            }
            axios({
                path: 'DistOriginDataQueryStoreWarehouseList',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.WarehouseList = res.data
                        // if (res.data.length > 0) {
                        //     this.$store.dispatch('warehouse', res.data[0]).then(() => {
                        //         this.findOrderListByParam()
                        //         if (this.customerCode) {
                        //             this.$store.dispatch('agetCounts')
                        //             // this.selectOrderCount()
                        //             // this.selectSkuCount()
                        //         }
                        //     }).catch(err => {
                        //         console.log(err)
                        //     })
                        // }
                    }
                }
            })
        },
        /**
         * @name: 获取特价审批单
         * @msg:
         * @param {type}
         * @return:
         */
        findSpecialPriceList () {
            this.loading = true

            const data = {
                // createBy: this.userInfo.code,
                // saleStoreCode: this.storeInfo.code,
                takeStoreCode: this.storeInfo.code,
                // saleStoreCode: this.storeInfo.code,
                status: '1',
                searchParam: this.form.getFieldValue('searchParam'),
                code: this.form.getFieldValue('code'),
                startTime: this.form.getFieldValue('startTime') ? moment(this.form.getFieldValue('startTime')._d).format('YYYY-MM-DD') : '',
                // startTime: '2019-01-01',
                endTime: this.form.getFieldValue('endTime') ? moment(this.form.getFieldValue('endTime')._d).format('YYYY-MM-DD') : ''
            }
            axios({
                path: 'DistPurchaseFindSpecialPriceList',
                method: 'post',
                body: data
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    if (res.data) {
                        res.data.forEach(good => {
                            good.saleAmount = 0
                            good.totalNum = 0
                            good.skuNum = 0
                            if (good.wholesaleGoodList) {
                                good.wholesaleGoodList.forEach((el, index) => {
                                    el.wholesaleBillDetailList.forEach(item => {
                                        console.log(item.billQuantity, item.billPrice)
                                        good.saleAmount = good.saleAmount + item.billQuantity * item.billPrice
                                        // el.saleAmount =
                                        good.totalNum += item.billQuantity
                                        good.skuNum += 1
                                    })
                                    el.goodPic = el.goodPic ? el.goodPic.split(',') : ['']
                                })
                                good.saleAmount = good.saleAmount.toFixed(2)
                            }
                        })

                        // this.data = JSON.parse(JSON.stringify(res.data))
                        this.data = []
                        this.$nextTick(() => {
                            this.data = JSON.parse(JSON.stringify(res.data))
                            console.log(this.data)
                        })
                    } else {
                        this.data = []
                    }

                    // this.data[0].wholesaleOrderDetailList.push(this.data[0].wholesaleOrderDetailList[0])
                }
            })
        },
        /**
         * @name: 当前用户特价审批查询
         * @msg:
         * @param {type}
         * @return:
         */
        findSpecialPriceListByCustomerCode () {
            this.form.setFieldsValue({ searchParam: this.customerCode })
            this.form.setFieldsValue({ code: '' })
            // this.form.setFieldsValue({ startTime: '' })
            // this.form.setFieldsValue({ endTime: '' })
            console.log(this.form.getFieldsValue())

            const data = {
                // takeStoreCode: this.warehouse.code,
                createBy: this.userInfo.code,
                takeStoreCode: this.storeInfo.code,
                // customerCode: this.customerCode,
                status: '1',
                searchParam: this.form.getFieldValue('searchParam'),
                code: this.form.getFieldValue('code'),
                startTime: this.form.getFieldValue('startTime') ? moment(this.form.getFieldValue('startTime')._d).format('YYYY-MM-DD') : '',
                // startTime: '2019-01-01',
                endTime: this.form.getFieldValue('endTime') ? moment(this.form.getFieldValue('endTime')._d).format('YYYY-MM-DD') : ''
            }
            console.log(data)

            axios({
                path: 'DistPurchaseFindSpecialPriceListByCustomerCode',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res)
                    if (res.data) {
                        // this.data = res.data
                        this.data = []
                        this.$nextTick(() => {
                            this.data = res.data
                        })
                    }
                }
            })
        },
        /**
         * @name: tab页切换请求数据
         * @msg:
         * @param {type}
         * @return:
         */
        callback (key) {
            // debugger
            this.activeKey = key
            this.expandedRowKeys = []
            this.data = []
            this.$nextTick(() => {
                switch (key) {
                case '0':
                    this.findOrderListByParam()
                    break
                case '1':
                    this.findSpecialPriceList()
                    break
                case '2':
                    this.findInvoiceListByParam('1')
                    break
                case '3':
                    this.findInvoiceListByParam('2')
                    break
                default:
                    break
                }
                this.customerSpecial = false
            })
            // console.log(this.form)
            // this.form.setFieldsValue({ searchParam: '' })
            // this.form.setFieldsValue({ code: '' })
            // this.form.setFieldsValue({ startTime: moment().startOf('day').subtract({ days: 7 }) })
            // this.form.setFieldsValue({ endTime: moment().startOf('day') })
            // this.timer = {
            //     startTime: moment().startOf('day').subtract({ days: 7 }),
            //     endTime: moment().startOf('day')
            // }
        },
        /**
         * @name: 提交按钮
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault()
            console.log(e)
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    if (this.activeKey === '1' && this.customerSpecial) {
                        this.findSpecialPriceListByCustomerCode()
                        this.customerSpecial = false
                    } else {
                        this.callback(this.activeKey)
                    }
                }
            })
        },
        // 页面跳转
        isChange (com) {
            this.$emit('activeComponent', com)
        },
        /**
         * @name: 获取列表
         * @msg:
         * @param {type}
         * @return:
         */
        findInvoiceListByParam (type) {
            this.loading = true
            const data = {
                // takeStoreCode: this.storeInfo.code,
                createBy: this.userInfo.code,
                saleStoreCode: this.storeInfo.code,
                // customerCode: this.customerCode,
                status: type,
                sourceType: '',
                searchParam: this.form.getFieldValue('searchParam'),
                code: this.form.getFieldValue('code'),
                startTime: this.form.getFieldValue('startTime') ? moment(this.form.getFieldValue('startTime')._d).format('YYYY-MM-DD') : '',
                // startTime: '2019-01-01',
                endTime: this.form.getFieldValue('endTime') ? moment(this.form.getFieldValue('endTime')._d).format('YYYY-MM-DD') : '' }
            console.log(data)
            axios({
                path: 'DistWholesaleBillQueryBillByParam',
                method: 'post',
                body: data
            }).then(res => {
                console.log(res)
                this.loading = false
                if (res.flag === 1) {
                    if (res.data) {
                        if (type === '1') {
                            res.data.forEach(el => {
                                el.saleAmount = 0
                                el.totalNum = 0
                                el.checkAll = false
                                el.indeterminate = false
                                el.skuNum = 0

                                el.wholesaleGoodList.forEach(goods => {
                                    goods.checkAll = false
                                    goods.indeterminate = false
                                    // this.selectedRowKeys[el.code].push({
                                    //     [goods.goodCode]: []
                                    // })
                                    goods.wholesaleBillDetailList.forEach(item => {
                                        console.log(item.billQuantity, item.billPrice)
                                        el.saleAmount = el.saleAmount + item.billQuantity * item.billPrice
                                        // el.saleAmount =
                                        el.totalNum += item.billQuantity
                                        el.skuNum += 1
                                    })
                                    goods.goodPic = goods.goodPic ? goods.goodPic.split(',') : ['']

                                    this.selectedRowKeys[el.code + goods.goodCode] = []
                                })
                                el.saleAmount = el.saleAmount.toFixed(2)
                            })
                            console.log(res.data)
                        } else {
                            res.data.forEach(good => {
                                good.saleAmount = 0
                                good.totalNum = 0
                                good.skuNum = 0
                                if (good.wholesaleGoodList) {
                                    good.wholesaleGoodList.forEach((el, index) => {
                                        el.wholesaleBillDetailList.forEach(item => {
                                            console.log(item.billQuantity, item.billPrice)
                                            good.saleAmount = good.saleAmount + item.billQuantity * item.billPrice
                                            // el.saleAmount =
                                            good.totalNum += item.billQuantity
                                            good.skuNum += 1
                                        })
                                        el.goodPic = el.goodPic ? el.goodPic.split(',') : ['']
                                    })
                                    good.saleAmount = good.saleAmount.toFixed(2)
                                }
                            })
                        }

                        this.data = []
                        this.$nextTick(() => {
                            this.data = JSON.parse(JSON.stringify(res.data))
                        })
                        console.log(this.data)
                    } else {
                        this.data = []
                    }
                }
            })
        },
        /**
         * @name: // 选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectedRowKeys, selectedRows) {
            console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
            this.keys = selectedRowKeys
        },
        onChangeGood (row, good, index, e) {
            console.log(row, index)
            const codelist = []
            good.wholesaleBillDetailList.forEach((el, index) => {
                codelist.push(index)
            })
            this.selectedRowKeys[row.code + good.goodCode] = e.target.checked ? codelist : []
            this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            good.checkAll = e.target.checked
            good.indeterminate = false
            row.indeterminate = row.wholesaleGoodList.every(f => f.checkAll === true) ? false : row.wholesaleGoodList.some(f => f.checkAll === true)
            row.checkAll = row.wholesaleGoodList.every(f => f.checkAll === true)
            console.log(row.wholesaleGoodList.every(f => f.checkAll === true), row.wholesaleGoodList.some(f => f.checkAll === true))

            // console.log(this.selectedRowKeys)

            console.log(this.selectedRowKeys[row.code + good.goodCode])

            if (e.target.checked) {
                console.log(row.saleAmount)
                row.saleAmount = parseFloat(row.saleAmount)
                good.wholesaleBillDetailList.forEach(item => {
                    console.log(item.billQuantity, item.billPrice)
                    row.saleAmount = row.saleAmount + item.billQuantity * item.billPrice
                    // el.saleAmount =
                    row.totalNum += item.billQuantity
                    row.skuNum += 1
                })
                console.log(row.saleAmount)

                row.saleAmount = row.saleAmount.toFixed(2)
            } else {
                row.saleAmount = parseFloat(row.saleAmount)
                good.wholesaleBillDetailList.forEach(item => {
                    console.log(item.billQuantity, item.billPrice)
                    row.saleAmount = row.saleAmount - item.billQuantity * item.billPrice
                    // el.saleAmount =
                    row.totalNum = row.totalNum - item.billQuantity
                    row.skuNum = row.skuNum - 1
                })
                row.saleAmount = row.saleAmount.toFixed(2)
            }
        },
        /**
         * @name: 全选
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (row, index, e) {
            console.log(row, index)
            // this.selectedRowKeys[row.code] = []wholesaleGoodList
            this.data[index].wholesaleGoodList.forEach((el, index) => {
                el.checkAll = e.target.checked
                el.indeterminate = false
                const codelist = []
                el.wholesaleBillDetailList.forEach((el, index) => {
                    codelist.push(index)
                })
                this.selectedRowKeys[row.code + el.goodCode] = e.target.checked ? codelist : []
            })

            // this.data[index].wholesaleBillDetailList.forEach((el, index) => {
            //     codelist.push(index)
            // })
            this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            row.checkAll = e.target.checked
            row.indeterminate = false
            console.log(this.selectedRowKeys)
            row.saleAmount = 0
            row.totalNum = 0
            row.skuNum = 0

            console.log(this.selectedRowKeys[row.code])
            if (e.target.checked) {
                row.wholesaleGoodList.forEach((el, index) => {
                    el.wholesaleBillDetailList.forEach(item => {
                        console.log(item.billQuantity, item.billPrice)
                        row.saleAmount = row.saleAmount + item.billQuantity * item.billPrice
                        // el.saleAmount =
                        row.totalNum += item.billQuantity
                        row.skuNum += 1
                    })
                })
                row.saleAmount = row.saleAmount.toFixed(2)
            } else {
                row.saleAmount = 0
                row.totalNum = 0
                row.skuNum = 0
            }

            // this.selectedRowKeys
        },
        /**
         * @name: 单选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (record, selected, selectedRows, nativeEvent) {
            console.log(record, selected, selectedRows, nativeEvent)
            // console.log(this.keys)
            if (this.keys.length > 0) {
                this.selectedRowKeys[record.wholesaleBillCode + record.goodCode] = []
                this.selectedRowKeys[record.wholesaleBillCode + record.goodCode] = this.keys
                this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            } else {
                this.selectedRowKeys[record.wholesaleBillCode + record.goodCode] = []
                this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            }
            this.data.forEach((el) => {
                // debugger
                if (record.wholesaleBillCode === el.code) {
                    el.wholesaleGoodList.forEach(item => {
                        if (record.goodCode === item.goodCode) {
                            if (item.wholesaleBillDetailList.length === this.keys.length) {
                                item.checkAll = true
                                item.indeterminate = false
                                // console.log(el.wholesaleGoodList.every(f => f.checkAll === true),);

                                el.indeterminate = el.wholesaleGoodList.every(f => f.checkAll === true) ? false : el.wholesaleGoodList.some(f => f.checkAll === true)
                                el.checkAll = el.wholesaleGoodList.every(f => f.checkAll === true)
                            } else if (item.wholesaleBillDetailList.length > this.keys.length && this.keys.length > 0) {
                                item.checkAll = false
                                item.indeterminate = true
                                el.indeterminate = true
                                el.checkAll = false
                            } else {
                                item.checkAll = false
                                item.indeterminate = false
                                console.log(el.wholesaleGoodList.some(f => f.checkAll === true) || el.wholesaleGoodList.some(f => f.indeterminate === true))
                                el.indeterminate = el.wholesaleGoodList.some(f => f.checkAll === true) || el.wholesaleGoodList.some(f => f.indeterminate === true)
                                el.checkAll = false
                            }
                            if (selected) {
                                console.log(el.saleAmount)
                                el.saleAmount = parseFloat(el.saleAmount)
                                // selectedRows.forEach(item => {
                                console.log(record.billQuantity, record.billPrice)
                                el.saleAmount = el.saleAmount + record.billQuantity * record.billPrice
                                // el.saleAmount =
                                el.totalNum += record.billQuantity
                                el.skuNum += 1
                                // })
                                console.log(el.saleAmount)

                                el.saleAmount = el.saleAmount.toFixed(2)
                            } else {
                                el.saleAmount = parseFloat(el.saleAmount)
                                // selectedRows.forEach(item => {
                                console.log(record.billQuantity, record.billPrice)
                                el.saleAmount = el.saleAmount - record.billQuantity * record.billPrice
                                // el.saleAmount =
                                el.totalNum = el.totalNum - record.billQuantity
                                el.skuNum = el.skuNum - 1
                                // })
                                el.saleAmount = el.saleAmount.toFixed(2)
                            }
                        }
                    })
                }
            })
            this.data = Object.assign([], this.data)
            console.log(this.data)
        },
        /**
         * @name: 跳转详情页面 并更新详情页面数据
         * @msg:
         * @param {type}
         * @return:
         */
        async editorDetail (row, index) {
            const el = JSON.parse(JSON.stringify(row)).wholesaleGoodList[index]
            Object.assign(row, el)
            delete row.wholesaleGoodList
            // await this.$store.dispatch('setGoodsId', row)
            await this.$emit('updates', 'goodsId', row)

            // this.$store.dispatch('isAdd', false)
            await this.$emit('updates', 'isAdd', false)
            this.isChange(1)
        },
        /**
         * @name: 导入开票
         * @msg:
         * @param {type}
         * @return:
         */
        addDistributionBill (record) {
            console.log(record)
            const data = JSON.parse(JSON.stringify(record))
            data.sourceType = '1'
            data.sourceCode = data.code
            data.orderTime = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
            data.createTime = moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
            data.saleStoreCode = data.saleStoreCode || this.storeInfo.code//*  店code
            data.makeStoreCode = data.makeStoreCode || this.storeInfo.code // *    店code
            // data.wholesaleBillDetailList = data.wholesaleOrderDetailList // *    店code
            // delete data.wholesaleOrderDetailList
            const list = []
            data.wholesaleGoodList.forEach(el => {
                // this.selectedRowKeys[record.code + el.goodCode].forEach(index => {
                list.push(...el.wholesaleOrderDetailList)
                // })
            })
            delete data.wholesaleGoodList
            data.wholesaleBillDetailList = list

            console.log(data)

            if (record.saleAmount !== 0 && record.totalNum !== 0) {
                axios({
                    path: 'DistWholesaleBillAddDistributionBill',
                    method: 'post',
                    body: {
                        wholesaleBillVoList: [data]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.callback(this.activeKey)
                    }
                // this.skuCount = res.data.orderCount
                })
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择商品！'
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
        /**
         * @name: 新增/导入开票
         * @msg:
         * @param {type}
         * @return:
         */
        updateCommitOrde (record) {
            console.log(record)
            const list = []
            const data = JSON.parse(JSON.stringify(record))
            data.wholesaleGoodList.forEach(el => {
                // this.selectedRowKeys[record.code + el.goodCode].forEach(index => {
                list.push(...el.wholesaleBillDetailList)
                // })
            })
            delete data.wholesaleGoodList

            data.auditBy = this.userInfo.code
            data.wholesaleBillDetailList = list
            // if (record.totalNum > 0) {
            axios({
                path: 'DistWholesaleBillUpdateCommitBill',
                method: 'post',
                body: {
                    wholesaleBillVoList: [data]
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.callback(this.activeKey)
                }
                // this.skuCount = res.data.orderCount
            })
            // } else {
            //     let secondsToGo = 3
            //     const modal = this.$success({
            //         title: '提示',
            //         content: '请选择商品！'
            //     })
            //     const interval = setInterval(() => {
            //         secondsToGo -= 1
            //     }, 1000)
            //     setTimeout(() => {
            //         clearInterval(interval)
            //         modal.destroy()
            //     }, secondsToGo * 1000)
            // }

            // }
        },

        /**
         * @name: 删除 订单
         * @msg:
         * @param {type}
         * @return:
         */
        deleteOrder (record, index) {
            this.$confirm({
                title: '提示信息',
                content: '确认删除此订单吗？',
                okText: '是',
                cancelText: '否',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        const data = {
                            code: record.code,
                            wholesaleBillDetailList: [],
                            sourceCode: record.sourceType !== 2 ? null : record.sourceCode
                        }
                        record.wholesaleGoodList.forEach(el => {
                            el.wholesaleBillDetailList.forEach(index => {
                                // list.push(el.wholesaleBillDetailList[index])
                                data.wholesaleBillDetailList.push({
                                    skuCode: index.skuCode,
                                    wholesaleBillCode: index.wholesaleBillCode
                                })
                            })
                        })
                        // DistWholesaleBilldeleteApplyBill
                        // DistWholesaleOrderDetailFindEditPrototypeByCumstomerCode
                        // DistWholesaleBillDeleteApplyBill
                        axios({
                            path: record.sourceType !== 2 ? 'DistWholesaleBillDeleteBill' : 'DistWholesaleBillDeleteApplyBill',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                this.$message.success(
                                    res.message
                                )
                                this.callback(this.activeKey)
                            }
                            // this.skuCount = res.data.orderCount
                        })

                        resolve()
                    }).catch((err) => console.log(err))
                },
                onCancel: () => {
                    return new Promise((resolve, reject) => {
                        this.visible = false
                        resolve()
                    }).catch(err => console.log(err))
                }

            })
        },
        /**
         * @name: 特价审批单
         * @msg:
         * @param {type}
         * @return:
         */
        leadIn (data) {
            this.visible = true
            this.specialItem = data
        },
        /**
         * @name: 特价审批单  对话框提交
         * @msg:
         * @param {type}
         * @return:
         */
        async handleOk () {
            // e.preventDefault()
            // console.log(e)
            this.specialForm.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    const data = JSON.parse(JSON.stringify(this.specialItem))
                    console.log(data)

                    data.wholesaleType = values.wholesaleType
                    data.takeType = values.takeType
                    data.takeStoreCode = values.takeStoreCode
                    data.sourceType = '2'
                    data.sourceCode = data.code
                    data.chargeByName = this.userInfo.name
                    data.chargeByCode = this.userInfo.code
                    // data.approveOrderTime = data.orderTime
                    data.orderTime = moment(data.approveOrderTime).format('YYYY-MM-DD HH:mm:ss')
                    data.saleStoreCode = data.saleStoreCode || this.storeInfo.code//*  店code
                    data.makeStoreCode = data.makeStoreCode || this.storeInfo.code // *    店code
                    const list = []

                    data.wholesaleGoodList.forEach(el => {
                        // this.selectedRowKeys[record.code + el.goodCode].forEach(index => {
                        list.push(...el.wholesaleBillDetailList)
                        // })
                    })
                    delete data.wholesaleGoodList
                    data.wholesaleBillDetailList = list

                    console.log(data)
                    if (data.totalNum > 0) {
                        this.confirmLoading = true
                        axios({
                            path: 'DistWholesaleBillAddDistributionBill',
                            method: 'post',
                            body: {
                                wholesaleBillVoList: [data]
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                this.callback(this.activeKey)
                                this.visible = false
                                this.specialForm.resetFields()
                            }
                            this.confirmLoading = false
                            // this.skuCount = res.data.orderCount
                        }).catch(err => {
                            console.log(err)
                            this.confirmLoading = false
                        })
                    } else {
                        let secondsToGo = 3
                        const modal = this.$success({
                            title: '提示',
                            content: '请选择商品！'
                        })
                        const interval = setInterval(() => {
                            secondsToGo -= 1
                        }, 1000)
                        setTimeout(() => {
                            clearInterval(interval)
                            modal.destroy()
                        }, secondsToGo * 1000)
                    }
                    // this.findOrderListByParam()
                }
            })
        },

        /**
         * @name: 特价审批单  对话框取消
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.specialForm.resetFields()
            this.visible = false
        },
        /**
         * @name: 表格展开
         * @msg:
         * @param {type}
         * @return:
         */
        expandedRowsChange (expandedRows) {
            console.log(expandedRows)
            this.expandedRowKeys = expandedRows
        },
        // 删除sku
        deleteSku (main, good, sku, index) {
            console.log(main, good, sku, index)
            this.$confirm({
                title: '提示信息',
                content: '确认删除此订单吗？',
                okText: '是',
                cancelText: '否',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        const data = {
                            code: main.code,
                            wholesaleBillDetailList: []

                        }

                        // list.push(el.wholesaleBillDetailList[index])
                        data.wholesaleBillDetailList.push({
                            skuCode: sku.skuCode,
                            wholesaleBillCode: sku.wholesaleBillCode
                        })

                        // DistWholesaleBilldeleteApplyBill
                        // DistWholesaleOrderDetailFindEditPrototypeByCumstomerCode
                        // DistWholesaleBillDeleteApplyBill
                        axios({
                            path: 'DistWholesaleBillDeleteBill',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                // this.$message.success(
                                //     res.message
                                // )
                                this.callback(this.activeKey)
                                // this.$delete(good, index)
                                // main.saleAmount = 0
                                // main.totalNum = 0
                                // main.skuNum = 0
                                // if (main.wholesaleGoodList) {
                                //     main.wholesaleGoodList.forEach((el, index) => {
                                //         el.wholesaleBillDetailList.forEach(item => {
                                //             console.log(item.billQuantity, item.billPrice)
                                //             main.saleAmount = main.saleAmount + item.billQuantity * item.billPrice
                                //             // el.saleAmount =
                                //             main.totalNum += item.billQuantity
                                //             main.skuNum += 1
                                //         })
                                //     })
                                //     main.saleAmount = main.saleAmount.toFixed(2)
                                // }
                                // this.data = JSON.parse(JSON.stringify(this.data))
                            }
                            // this.skuCount = res.data.orderCount
                        })

                        resolve()
                    }).catch((err) => console.log(err))
                },
                onCancel: () => {
                    return new Promise((resolve, reject) => {
                        this.visible = false
                        resolve()
                    }).catch(err => console.log(err))
                }

            })
        }
    }
}
</script>
<style lang="less" scoped>
.Invoice{
    position: relative;
    background-color: #fff;
    >.home{
        color: #fff;
        width: 80px;
        height: 30px;
        border-radius: 3px;
        position: absolute;
        line-height: 30px;
        text-align: center;
        background: #1790ff;
        right: 5px;
        top: 7px;
        cursor: pointer;
        z-index:2;
    }
    .haveNot{
        // height: 60px;
        // overflow: hidden;
        background-color: #fff;
    }
    .goods-list{
        margin: 0;
        padding: 0;
        margin-top: 10px;
        background-color: #fff;
        /deep/ .ant-table-row-expand-icon-cell,/deep/ .ant-table-expand-icon-th{
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
        .item-list{
                width: 100%;
                padding-left: 14px;
                clear: both;
                border: 1px solid #e8e8e8;
                overflow: hidden;
            /deep/ .ant-table-thead   .ant-table-selection{
                display: none;
            }
            >.ant-checkbox-wrapper{
                float: left;
                line-height: 220px;
            }
            .goods-d{
                width: 250px;
                height: 220px;
                float: left;
                text-align: center;
                padding: 23px 0;
                border-left: 1px solid #e8e8e8;
                border-right: 1px solid #e8e8e8;
                border-bottom: 1px solid #e8e8e8;
                margin-left: 10px;
                >img{
                    width: 150px;
                    height: 100px;
                }
                >p{
                    color: #666;
                    margin: 10px 0;
                }
                >.ant-btn-default{
                    border-radius: 0;
                    border:none;
                    color: #1790ff;
                    background-color: transparent;
                    box-shadow: none;
                }
            }
            .item-table{
                float: left;
                width: calc(100% - 290px );
                border-left: 1px solid #e8e8e8;
            }
        }
        .goods-footer{
            clear: both;
            >p{
                height: 46px;
                line-height: 46px;
                margin: 0;
                padding-left: 10px;
                >span{
                    display: inline-block;
                    margin-right: 16px;
                }
            }
            .price{
                height: 50px;
                line-height: 50px;
                background-color: #E7E7E7;
                padding: 0 0 0 10px;
                >div{
                    float: right;
                    >span{
                        color: #1890ff;
                        display: inline-block;
                        margin-right: 10px;
                    }
                    .ant-btn-primary{
                        height: 50px;
                        border: none;
                        line-height: 50px;
                        padding:0 30px;
                        border-radius: 0;
                    }
                }
            }
        }

    }
    .submitted{
        .goods-list{
            margin: 0;
            padding: 0;
            margin-top: 10px;
            background-color: #fff;
            /deep/ .ant-table-row-expand-icon-cell,/deep/ .ant-table-expand-icon-th{
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
            .item-list{
                // height: 220px;
                // padding-left: 14px;
                padding-left: 0;
                border: 1px solid #e8e8e8;
                /deep/ .ant-table-thead   .ant-table-selection{
                    display: none;
                }
                >.ant-checkbox-wrapper{
                    float: left;
                    line-height: 220px;
                }
                .goods-d{
                    width: 250px;
                    height: 220px;
                    float: left;
                    text-align: center;
                    padding: 23px 0;
                    border-left: 1px solid #e8e8e8;
                    border-right: 1px solid #e8e8e8;
                    margin-left: 0px;
                    >img{
                        width: 150px;
                        height: 100px;
                    }
                    >p{
                        color: #666;
                        margin: 10px 0;
                    }
                    >.ant-btn-default{
                        border-radius: 0;
                        border:none;
                        color: #1790ff;
                        background-color: transparent;
                        box-shadow: none;
                    }
                }
                .item-table{
                    float: left;
                    width: calc(100% - 250px )
                }
            }
            .goods-footer{
                clear: both;
                >p{
                    height: 46px;
                    line-height: 46px;
                    margin: 0;
                    padding-left: 10px;
                    >span{
                        display: inline-block;
                        margin-right: 16px;
                    }
                }
                .price{
                    height: 50px;
                    line-height: 50px;
                    background-color: #E7E7E7;
                    padding: 0 0px 0 10px;
                    >div{
                        float: right;
                        >span{
                            color: #1890ff;
                            display: inline-block;
                            margin-right: 10px;
                        }
                        .ant-btn-primary{
                            height: 50px;
                            border: none;
                            line-height: 50px;
                            padding:0 30px;
                            border-radius: 0;
                        }
                    }
                }
            }
        }
    }
}
ul{
    margin: 0;
    padding: 0;
}
li{
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>

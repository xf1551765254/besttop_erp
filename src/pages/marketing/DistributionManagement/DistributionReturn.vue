<!--
 * @Description: 分销订单列表
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-04-17 11:16:48
 * @LastEditTime: 2019-08-27 18:00:20
 -->
<template>
  <div class="distributionReturn" :style="{height:windowHeight-150+'px'}">
    <SeachBox
      :conditions="conditions"
      :btns="btns"
      :rowSelect="true"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <!-- 这里可以自定义组件没有提供的特殊按钮 -->
      <a-button type="primary" v-action:edit size="small" @click="auditHandler(0)">确认退货</a-button>
    </Seachbox>
    <!-- 数据表格 -->
    <div class="goods-list">
      <!-- 数据表格 -->
      <NewTable
        ref="newTable"
        :tableCode="tableCode"
        :tableApiPath="tableApiPath"
        :slots="['expandedRowRender']"
        @onSelect="onSelect"
        :disContextMenu="disContextMenu"
        @onContextmenuChange="onContextmenuChange"
        :pams="seachValue">
        <template slot="expandedRowRender" slot-scope="{text, record}">
          <div style="margin: 0" class="good-item">

            <a-table
              :columns="itemColumns"
              :pagination="false"
              :dataSource="text.wholesaleBillDetailList"
              class="item-table">
            </a-table>

          </div>
        </template>

      </NewTable>

    </div>

    <bt-modal
      v-model="addEditModal"
      :title="`${addEditTitle}退货单`"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :tags="tags"
      :subBtn="isAdd!==2"
      class="model">
      <a-form :form="form">
        <div class="model-title">
          <h3>基本信息</h3>
          <a-button type="primary" size="small" :disabled="this.tableSingleData.sourceType==='3'||this.isAdd===2" @click="addBillReturn">选择分销开票单</a-button>
        </div>
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">客户</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                @change="queryCustomerInfo"
                style="width:100%"
                placeholder="请选择客户"
                showSearch
                :disabled="tableSingleData.sourceType==='1'||isAdd===2"
                v-decorator="$check('DistributionReturn.customerCode',{initialValue:tableSingleData.customerCode})"
                allowClear>
                <a-select-option v-for="item in customerCodeArr" :key="item.code" :value="item.code">{{ item.code }}-{{ item.name }}</a-select-option>
              </a-select>

            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">手机号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入手机号"
                v-decorator="$check('DistributionReturn.receiveCustomerPhone',{initialValue:tableSingleData.receiveCustomerPhone||''})"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地址</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入地址"
                v-decorator="$check('DistributionReturn.receiveCustomerAddress',{initialValue:tableSingleData.receiveCustomerAddress||''})"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">提货方式</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                placeholder="请选择提货方式"
                showSearch
                :disabled="tableSingleData.sourceType==='1'||isAdd===2"
                v-decorator="$check('DistributionReturn.takeType',{initialValue:tableSingleData.takeType||''})"
                allowClear>
                <a-select-option :value="item.value" v-for="(item,index) in pickupType" :key="item.value">{{ item.key }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">提货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                placeholder="请选择提货位置"
                showSearch
                :disabled="tableSingleData.sourceType==='1'||isAdd===2"
                v-decorator="$check('DistributionReturn.takeStoreCode',{initialValue:tableSingleData.takeStoreCode||''})"
                allowClear>
                <a-select-option v-for="item in WarehouseList" :key="item.code" :value="item.code">{{ item.code }}-{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                placeholder="请选择经营类型"
                showSearch
                :disabled="tableSingleData.sourceType==='1'||isAdd===2"
                v-decorator="$check('DistributionReturn.wholesaleType',{initialValue:tableSingleData.wholesaleType||''})"
                allowClear>
                <a-select-option :value="item.value" v-for="item in salesApproach" :key="item.value">{{ item.key }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

        </a-row>
        <div class="model-title">
          <h3>详细信息</h3>

        </div>
        <div>
          <a-button @click="goodsQuery=true" :disabled="isAdd===2||this.tableSingleData.sourceType==='1'">
            增加商品
          </a-button>
          <a-button @click="deleteReturnGoods" :disabled="isAdd===2">
            删除
          </a-button>
        </div>
        <a-table
          size="small"
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: returnSelectedRowKeys, onChange: returnOnSelectChange}"
          :columns="columns"
          :dataSource="orderList"
          :pagination="false"
          bordered
        >
          <template v-for="col in ['applyQuantity','applyPrice','note']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <!-- <div v-if="col==='skuName'||col==='concatClass'||col==='concatBrand'">
                <a-tooltip v-if="text&&text.length > 18" :key="text" :title="text">
                  <span>{{ `${text.slice(0, 18)}...` }}</span>
                </a-tooltip>
                <span v-else> {{ text }} </span>
              </div> -->
              <a-input-number
                v-if="col === 'applyPrice'"
                style="margin: -3px 0; width:100%;height:28px"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                :disabled="isAdd===2"
                @change="e => InputDetailDataChange(e, record, col)" />
              <a-input-number
                v-if="col === 'applyQuantity'"
                style="margin: -3px 0; width:100%;height:28px"
                :disabled="isAdd===2||record.strategyDefineType==='wholesale_strategy_define_type:7'"
                :min="0.00"
                :max="100"
                :step="1"
                :precision="2"
                :value="text"

                @change="e => InputDetailDataChange(e, record, col)" />

              <a-input
                v-else-if="col === 'note'"
                style="margin: -3px 0; width:100%;height:28px"
                :value="text"
                :disabled="isAdd===2"
                @change="e => InputDetailDataChange(e.target.value, record, col)"/>
            </div>
          </template>
        </a-table>
        <div class="model-title">
          <h3>
            落款信息
          </h3>

        </div>
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">制单人：</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="制单人"
                v-decorator="$check('DistributionReturn.createByName',{initialValue:tableSingleData.createByName||''})"
                disabled
              />

            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间：</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                showTime
                disabled
                v-decorator="$check('DistributionReturn.createTime',{initialValue:tableSingleData.createTime})"
                format="YYYY-MM-DD HH:mm"
                placeholder="制单时间"
                :allowClear="false"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">备注：</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                v-decorator="$check('DistributionReturn.note',{initialValue:tableSingleData.note||''})"
                :disabled="isAdd===2"
                :autosize="{ minRows: 2, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>

      </a-form>
    </bt-modal>
    <a-modal
      title="选择分销开票单"
      v-model="checkBill"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="1100"
      :z-index="99"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" type="primary" @click="checkBill=false">取消</a-button>
        <a-button key="submit" type="primary" @click="checkBillOrder">
          确定
        </a-button>
      </template>
      <!-- 顾客信息表单 -->
      <div>
        <a-form
          layout="inline"
        >
          <a-form-item
            label="客户"
          >
            <a-input
              v-model="billForm.searchParam"
              placeholder="请输入编码/名称"
            />
          </a-form-item>
          <a-form-item
            label="订单号"
          >
            <a-input
              v-model="billForm.code"
              placeholder="请输入订单号"
            />
          </a-form-item>
          <a-form-item
            label="制单日期"
          >
            <a-date-picker v-model="billForm.startTime" />
          </a-form-item>
          <a-form-item
            label="至"
          >
            <a-date-picker v-model="billForm.endTime" />
          </a-form-item>
          <a-form-item
          >
            <a-button
              type="primary"
              @click="queryBuill"
            >
              查询
            </a-button>
          </a-form-item>
        </a-form>
        <a-table
          rowKey="code"
          size="small"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :columns="billColumns"
          :dataSource="billList"
          :pagination="pagination"
          @change="handleTableChange"
          bordered
        >
        </a-table>
        <a-table
          size="small"
          :columns="billSkuColumns"
          :dataSource="billorder"
          :pagination="false"
          bordered
        >
        </a-table>
      </div>

    </a-modal>
    <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple/>
  </div>
</template>

<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import moment from 'moment'
import { mapGetters } from 'vuex'
import BtModal from '@comp/Modal'
import map from 'lodash.map'
// import goods from '../BundledGoodsSettings/goods'
import goods from '@/pages/marketing/DistributionManagement/DistributionDiscountApprovalForm/components/goods'
// import goods from '@/pages/marketing/BundledGoodsSettings/goods'

export default {
    name: 'DistributionReturn',
    components: {
        SeachBox,
        NewTable,
        goods,
        BtModal
    },
    data: function () {
        return {

            sendContent: '',
            conditions: [
                {
                    key: 'searchParam',
                    type: 'select',
                    title: '客户编码/名称',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'CustomerDistributorsFindBySelected'

                },
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'name',
                    value: 'code',
                    filter: true,
                    selectDataArr: [
                        {
                            code: '1',
                            name: '待确认'
                        },
                        {
                            code: '2',
                            name: '已确认'
                        }
                    ]
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '制单开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制单结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '制单人',
                    filter: true,
                    path: 'PermissionsUserFindOption',
                    label: ['code', 'name'],
                    value: 'code'

                }

            ],

            btns: ['add', 'edit', 'del', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            seachValue: {
                searchParam: '',
                saleStoreCode: '',
                takeStoreCode: '',
                createBy: '',
                status: '1',
                code: '',
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }, // 搜索的值
            // 表格
            // 主表格
            tableCode: '',
            tableApiPath: '',
            tableIdsArr: [],
            tableRowsArr: [],
            // 单行选中的值
            tableSingleData: {},
            form: this.$form.createForm(this),
            strategyDefineValue: '', // 政策
            customerValue: '', // 客户
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                {
                    name: '编辑',
                    action: 'DistributionReturn.edit',
                    fc: this.addEdit
                },
                {
                    name: '确认退货',
                    action: 'DistributionReturn.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'DistributionReturn.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'DistributionReturn.query',
                    fc: this.detailHandler
                }
            ],
            tags: [],
            paramsList: [],
            addEditTitle: '',
            addEditModal: false,
            submitLoading: false,
            orderId: '',
            goods: {},
            isAdd: 0,
            // 二级表格
            itemColumns: [
                { title: 'sku编码', dataIndex: 'skuCode', key: 'skuCode' },
                { title: 'sku名称', dataIndex: 'skuName', key: 'skuName' },
                { title: '规格型号', dataIndex: 'skuModel', key: 'skuModel' },
                // { title: '商品规格', dataIndex: 'skuModel', key: 'skuModel', width: 360, customRender: (text, record, index) => `${record.skuCode + ' ' + record.skuModel + ' ' + record.skuName}` },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '品牌编码', dataIndex: 'brandCode', key: 'brandCode' },
                { title: '品牌名称', dataIndex: 'brandCodeName', key: 'brandCodeName' },
                { title: '退货数量', dataIndex: 'applyQuantity', key: 'applyQuantity' },
                { title: '退货价', dataIndex: 'applyPrice', key: 'applyPrice', customRender: (text, record, index) => `${record.applyPrice.toFixed(2)}` },
                { title: '政策', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '退货总金额', dataIndex: 'returnedAmount', key: 'returnedAmount', customRender: (text, record, index) => `${record.returnedAmount.toFixed(2)}` },
                { title: '备注', dataIndex: 'note', key: 'note' }
            ],
            columns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                // { title: 'sku编号', dataIndex: 'skuCode', key: 'skuCode' },
                { title: 'sku名称', dataIndex: 'skuName', key: 'skuName' },
                { title: '品牌名称', dataIndex: 'brandCodeName', key: 'brandCodeName' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '规格型号', dataIndex: 'skuModel', key: 'skuModel' },
                { title: '分销价', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => record.billPrice.toFixed(2) },
                { title: '退货价', dataIndex: 'applyPrice', key: 'applyPrice', scopedSlots: { customRender: 'applyPrice' } },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '已退数量', dataIndex: 'returnedQuantity', key: 'returnedQuantity' },
                { title: '退货数量', dataIndex: 'applyQuantity', key: 'applyQuantity', scopedSlots: { customRender: 'applyQuantity' } },
                { title: '政策', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '金额(元)', customRender: (text, record, index) => this.$math.mul(record.applyPrice, record.applyQuantity, 2) },
                // { title: '源单号', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '备注', dataIndex: 'note', key: 'note', scopedSlots: { customRender: 'note' } }
            ],
            billColumns: [
                { title: '单号', dataIndex: 'code', key: 'code' },
                { title: '单据状态', dataIndex: 'status', key: 'status' },
                { title: '客户编码/名称', dataIndex: 'customerCode', key: 'customerCode', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '分销类型', dataIndex: 'wholesaleTypeName', key: 'wholesaleTypeName' },
                { title: '提货方式', dataIndex: 'takeTypeName', key: 'takeTypeName' },
                { title: '提货位置', dataIndex: 'takeStoreName', key: 'takeStoreName' },
                { title: '订单金额', dataIndex: 'saleAmount', key: 'saleAmount', customRender: (text, record, index) => `${record.saleAmount.toFixed(2)}` },
                { title: '下单时间', dataIndex: 'orderTime', key: 'orderTime' },
                { title: '制单人', dataIndex: 'createBy', key: 'createBy', customRender: (text, record, index) => `${record.createBy}-${record.createByName}` },
                { title: '制单位置', dataIndex: 'makeStoreCode', key: 'makeStoreCode', customRender: (text, record, index) => `${record.makeStoreCode}-${record.makeStoreName}` }

            ],
            billSkuColumns: [
                { title: 'sku编码', dataIndex: 'skuCode', key: 'skuCode' },
                { title: 'sku名称', dataIndex: 'skuName', key: 'skuName' },
                { title: '规格型号', dataIndex: 'skuModel', key: 'skuModel' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '品牌编码', dataIndex: 'brandCode', key: 'brandCode' },
                { title: '品牌名称', dataIndex: 'brandCodeName', key: 'brandCodeName' },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '分销价', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => `${record.billPrice.toFixed(2)}` },
                { title: '已退数', dataIndex: 'returnedQuantity', key: 'returnedQuantity' },
                { title: '政策', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '金额', dataIndex: 'saleAmount', key: 'saleAmount', customRender: (text, record, index) => `${record.saleAmount}` },
                { title: '备注', dataIndex: 'note', key: 'note' }
            ],
            // 提货位置
            WarehouseList: [],
            // 渠道客户
            customerCodeArr: [],
            // 提货类型
            pickupType: [
                {
                    value: '2',
                    key: '集中配送'
                },
                {
                    value: '1',
                    key: '客户自提'
                }
            ],
            salesApproach: [
                {
                    value: '0',
                    key: '经销'
                },
                {
                    value: '1',
                    key: '代销'
                }
            ],
            // 客户地址
            customerInfo: {},
            // 选择开票单
            checkBill: false,
            billForm: {
                searchParam: '',
                code: '',
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            },
            billList: [],
            billorder: [],
            billCustomer: {},
            // 分销选中
            selectedRowKeys: [],
            // 退货选中
            returnSelectedRowKeys: [],
            pagination: {
                defaultCurrent: 1,
                pageSize: 15,
                total: 0
            },
            orderList: [],
            // 添加商品
            goodsQuery: false
            // billForm: this.$form.createForm(this)

        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo', 'windowHeight'])
    },
    mounted () {
        this.seachValue.saleStoreCode = this.storeInfo.code
        this.seachValue.startTime = moment(this.seachValue.startTime).format('YYYY-MM-DD')
        this.seachValue.endTime = moment(this.seachValue.endTime).format('YYYY-MM-DD')
        this.$nextTick(() => {
            this.tableCode = '916fc05b81214186ae6bbd07c4409c8b:DistributionReturn'
            this.tableApiPath = 'DistWholesaleBillFindWholesaleReturnGoodsPageList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.queryStoreWarehouseList()
    },
    methods: {
        moment,
        async queryStoreWarehouseList () {
            const data = {
                code: this.storeInfo.code
            }
            axios({
                path: 'DistOriginDataQueryStoreWarehouseList',
                method: 'post',
                body: data
            }).then(async res => {
                if (res.flag === 1 && res.data && res.data.length > 0) {
                    this.WarehouseList = res.data
                } else {
                    this.WarehouseList = []
                }
            })
        },
        // 查询 详情
        queryDetail (code) {
            axios({
                path: 'DistWholesaleBillFineReturnGoodDetail',
                method: 'post',
                body: {
                    code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = JSON.parse(JSON.stringify(res.data))
                    data.createTime = moment(res.data.createTime)
                    this.tableSingleData = { ...data }
                    // this.tableSingleData
                    console.log(this.tableSingleData)
                    this.orderList = res.data.wholesaleBillDetailList
                }
            })
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
                    this.customerCodeArr = res.data.list
                }
            })
        },
        // 查询分销开票
        queryBuill () {
            axios({
                path: 'DistWholesaleBillFindWholesaleBillPageList',
                method: 'post',
                body: {
                    saleStoreCode: this.storeInfo.code,
                    createBy: this.userInfo.code,
                    startTime: moment(this.billForm.startTime).format('YYYY-MM-DD'),
                    endTime: moment(this.billForm.endTime).format('YYYY-MM-DD'),
                    code: this.billForm.code,
                    searchParam: this.billForm.searchParam,
                    status: '2',
                    page: this.pagination.defaultCurrent,
                    rows: this.pagination.pageSize
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    this.billList = res.data.list
                }
            })
        },
        // 开票选择转新增
        checkBillOrder () {
            this.orderList = JSON.parse(JSON.stringify(this.billorder))
            this.checkBill = false
        },
        // 分页
        handleTableChange (pagination, filters, sorter) {
            console.log(pagination)
            const pager = { ...this.pagination }
            pager.current = pagination.current
            this.pagination = pager
            // this.fetch({
            //     results: pagination.pageSize,
            //     page: pagination.current,
            //     sortField: sorter.field,
            //     sortOrder: sorter.order,
            //     ...filters
            // })
        },
        // 退货选中删除
        deleteReturnGoods () {
            // this.returnSelectedRowKeys.forEach(el => {
            //     console.log(el)
            //     // delete this.orderList[el]
            // })
            this.orderList = this.orderList.filter(el => {
                // console.log(!this.returnSelectedRowKeys.includes(el.skuCode))
                return !this.returnSelectedRowKeys.includes(el.skuCode)
            })
            // this.orderList.filter(el=>)
            this.returnSelectedRowKeys = []
            this.orderList = [...this.orderList]
            console.log(this.orderList)
        },
        // 退货选中
        returnOnSelectChange (record, selected, selectedRows, nativeEvent) {
            console.log(record, selected, selectedRows, nativeEvent)

            this.returnSelectedRowKeys = record
        },
        // 选择开票
        onSelectChange (record, selected, selectedRows, nativeEvent) {
            console.log('selectedRowKeys changed: ', record, selected, selectedRows, nativeEvent)
            if (record.length > 1) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: `只能选择一个分销单`
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else if (record.length === 1) {
                this.selectedRowKeys = record
                const billList = []
                const data = JSON.parse(JSON.stringify(selected))[0]
                delete data.wholesaleGoodList
                data.sourceType = '1'
                this.tableSingleData = data
                selected[0].wholesaleGoodList.forEach(el => {
                    billList.push(...el.wholesaleBillDetailList)
                })
                this.billorder = JSON.parse(JSON.stringify(billList))
                this.billorder.forEach((el, index) => {
                    // el.returnQuantity = billList[index].returnedQuantity
                    el.applyQuantity = billList[index].billQuantity
                    el.applyPrice = billList[index].billPrice
                })
            } else {
                this.selectedRowKeys = record
                this.billorder = []
            }
            console.log(this.billorder)
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputDetailDataChange (val, record, key) {
            console.log(val, record, key)
            record[key] = val
        },
        // 打开开票选择框
        addBillReturn () {
            this.checkBill = true
            this.queryBuill()
        },
        // handleSubmit (e) {
        //     e.preventDefault()
        //     this.form.validateFields((err, values) => {
        //         if (!err) {
        //             console.log('Received values of form: ', values)
        //         }
        //     })
        // },
        /**
         * @name: 增加 的商品
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectAddGoods (addSeleckData) {
            console.log(addSeleckData)

            const error = []
            addSeleckData.forEach(mun => {
                const has = this.orderList.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    this.orderList.push({
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        unit: mun.skuUnit,
                        brandCodeName: mun.brandName,
                        skuModel: mun.skuModel,
                        price: mun.skuPriceW,
                        billPrice: mun.skuPriceW,
                        applyPrice: mun.skuPriceW,
                        billQuantity: '',
                        returnedQuantity: '',
                        applyQuantity: 0,
                        strategyDefineName: '',
                        note: '',
                        goodCode: mun.mainSkuCode,
                        contractCode: mun.code,
                        contractType: mun.businessType,
                        providerCode: mun.providerCode,
                        providerName: mun.providerName
                    })
                } else {
                    error.push(mun.skuCode)
                }
            })
            this.tableSingleData.sourceType = '3'
            this.tableSingleData.code = null
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        queryCustomerInfo (customer) {
            console.log(customer)
            if (customer) {
                axios({
                    path: 'DistOriginDataFindCustomerInfoByCode',
                    method: 'post',
                    body: {
                        customerCode: customer
                    }
                }).then(res => {
                    if (res.flag === 1 && res.data) {
                        console.log(res.data)
                        this.customerInfo = res.data
                        this.form.setFieldsValue({
                            receiveCustomerPhone: this.customerInfo.receiveCustomerPhone, // ;"收货电话"
                            receiveCustomerName: this.customerInfo.receiveCustomerName, // ;"收货客户名称"
                            receiveCustomerAddress: this.customerInfo.receiveCustomerAddress, // ;"收货地址"
                            longitude: this.customerInfo.longitude, // ;"经度"
                            latitude: this.customerInfo.latitude // ;"纬度"
                        })
                        this.tableSingleData.longitude = this.customerInfo.longitude
                        this.tableSingleData.latitude = this.customerInfo.latitude
                        this.tableSingleData.customerName = this.customerInfo.receiveCustomerName
                    } else {
                        this.customerInfo = {}
                        this.form.setFieldsValue({
                            receiveCustomerPhone: '', // ;"收货电话"
                            receiveCustomerName: '', // ;"收货客户名称"
                            receiveCustomerAddress: '', // ;"收货地址"
                            longitude: '', // ;"经度"
                            latitude: '' // ;"纬度"
                        })
                    }
                })
            }
        },
        // 新增
        // POST DistWholesaleOrderFindWholesaleOrderPageList
        // POST DistWholesaleBillFindWholesaleBillPageList
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            console.log(e)
            e.path = 'DistWholesaleBillFindWholesaleReturnGoodsPageList'
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
            console.log(this.seachValue)
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                console.log(this.tableIdsArr)

                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'edit') {
                if (this.tableIdsArr.length === 0 || this.tableIdsArr.length > 1) {
                    this.$message.warning('请选择要编辑的一组数据')
                } else if (this.tableIdsArr.length === 1) {
                    this.addEdit(this.tableRowsArr[0])
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistWholesaleBillFindWholesaleReturnGoodsPageList')
            }
        },
        onSelect (ketIndex, keyRows) {
            console.log(keyRows)

            this.tableIdsArr = map(keyRows, 'code')

            this.tableRowsArr = keyRows
            console.log(this.tableIdsArr, this.tableRowsArr)
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistWholesaleBillFindWholesaleReturnGoodsPageList' })
        },
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === '2') {
                this.disContextMenu = ['确认退货']
            } else {
                this.disContextMenu = []
            }
        },
        /**
         * @name: 删除表格
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            console.log(delEventData)

            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                console.log(newData)

                const isAuit = newData.every(o => o.status === '1')
                console.log(isAuit)
                if (!isAuit) {
                    this.$message.warning('只有未确认退货的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.code)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除后将不可更改',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistWholesaleBillBatchDeleteBill', // 接口path名，必传
                        method: 'post',
                        body: {
                            codeList: arr,
                            createBy: _this.userInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'code')
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            console.log(autiData)

            // const _this = this
            // let arr = []
            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === '1')
                if (!isAuit) {
                    this.$message.warning('只有未确认退货的才能进行此操作')
                    return
                }
            }
            if (autiData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.$confirm({
                    title: '提示',
                    content: '此操作将进确认退货，确认后将不可进行修改, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'DistWholesaleBillAuditReturnGoodsBycode', // 接口path名，必传
                            method: 'post',
                            body: {
                                codeList: autiData === 0 ? _this.tableIdsArr : [autiData.code],
                                createBy: _this.userInfo.code
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
            // console.log(_this.tableIdsArr)
        },
        detailHandler (addEditData) {
            this.isAdd = 2
            this.addEditTitle = '预览'
            this.addEditModal = true
            this.queryDetail(addEditData.code)
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            console.log(addEditData)
            if (addEditData === -1) {
                this.isAdd = 0
                this.addEditTitle = '新增'
                this.addEditModal = true
                this.getCustomerCodeDorpArr()
                this.billorder = []
                this.orderList = []
                console.log(this.seachValue)
                this.tableSingleData = {}
            } else {
                this.isAdd = 1
                this.addEditTitle = '编辑'
                this.billorder = []
                this.orderList = []
                this.getCustomerCodeDorpArr()

                this.addEditModal = true
                this.queryDetail(addEditData.code)
            }
        },
        // 新增提交
        submitInfo (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    console.log(err)

                    this.orderList.forEach(el => {
                        if (el.applyQuantity <= 0) {
                            let secondsToGo = 3
                            const modal = this.$warning({
                                title: '提示',
                                content: `商品${el.skuCode}${el.skuName}退货数量为0`
                            })
                            const interval = setInterval(() => {
                                secondsToGo -= 1
                            }, 1000)
                            setTimeout(() => {
                                clearInterval(interval)
                                modal.destroy()
                            }, secondsToGo * 1000)
                            return false
                        }
                    })
                    const data = {
                        code: this.tableSingleData.code,
                        sourceType: this.tableSingleData.sourceType, // "来源类型：（1.分销开票单，3.手动录入）
                        saleStoreCode: this.storeInfo.code, // ;销售店
                        takeType: values.takeType, // 提货类型
                        takeStoreCode: values.takeStoreCode, // "提货店"
                        customerCode: values.customerCode, // "客户代码"
                        customerName: this.tableSingleData.customerName, // ;"客户名称"
                        wholesaleType: values.wholesaleType, // ;"分销类型：0经销分销，1代销分销")
                        makeStoreCode: this.storeInfo.code, // ;"制单店"
                        note: values.note, // ;"备注"
                        receiveCustomerPhone: values.receiveCustomerPhone, // ;"收货电话"
                        receiveCustomerName: this.tableSingleData.customerName, // ;"收货客户名称"
                        receiveCustomerAddress: values.receiveCustomerAddress, // ;"收货地址"
                        longitude: this.tableSingleData.longitude, // ;"经度"
                        latitude: this.tableSingleData.latitude, // ;"纬度"
                        sourceCode: this.tableSingleData.code, // :"string",//源开票单单号,手动新增为null
                        createBy: this.userInfo.code, // :"string",//当前登陆人code
                        detailList: this.orderList
                    }
                    console.log(data)
                    axios({
                        path: this.isAdd === 0 ? 'DistWholesaleBillAddWholesaleReturnGoods' : 'DistWholesaleBillUpdateReturnGoodsByParma', // 接口path名，必传
                        method: 'post',
                        body: data
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                            console.log(res.data)
                        }
                    })
                }
            })
        },
        addGoods (good) {
            console.log(good)

            this.goods = good
            // console.log(good.status)

            this.modalVisible = true
            this.tags = []
            if (good.status === '未提交') {
                this.tags.push('notsubmitted')
            } else if (good.status === '已提交') {
                this.tags.push('submit')
            } else if (good.status === '已开票') {
                this.tags.push('invoice')
            }

            console.log(this.tags)
            // let newList=[]
            // this.list.forEach(el => {
            //     let obj={}
            //     obj.value = el.deviceName
            //     obj.title = el.wDeviceId
            //     newList.push(obj)
            // })
        }
    }
}
</script>

<style scoped lang="less">
.distributionReturn{
    overflow: auto;
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
        /deep/ .ant-table-pagination.ant-pagination{
            display: block;
            float: none;
            text-align: center
        }

    }
}

</style>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
    .model{
        .model-title{
            height: 50px;
            border-bottom:1px solid rgba(227, 227, 227, 1);
            width: 100%;
            line-height: 50px;
            margin-bottom: 20px;
            >h3{
                display: inline-block;
                color: #39ADFF;
                font-size: 16px;
                width: calc(100% - 120px);
            }
            .ant-btn-primary{
                display: inline-block;
            }
        }
        // .setDocCss{
        //     border-bottom:1px solid rgba(227, 227, 227, 1);
        // }

    }
    .ant-table-fixed-left{
        width: 0px;
    }
</style>

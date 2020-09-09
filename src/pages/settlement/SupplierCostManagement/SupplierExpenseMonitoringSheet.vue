<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 18:38:18
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      title="供应商费用监控单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">机构信息</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-tree-select
                style="width: 100%"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="organizeCodeData"
                @change="onChangeSourceOrganize"
                treeDefaultExpandAll
                v-decorator="$check('providerFee.sourceOrganize',{initialValue:BaseMessageObj.sourceOrganize})"
                showSearch
                allowClear>
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('providerFee.chargeUserno', {initialValue:BaseMessageObj.chargeUserno})"
                :options="customerList"
                @search="applicantSearch"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">单据类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                @change="onChangeBillsType"
                :options="billsType"
                v-decorator="$check('providerFee.type',{initialValue:BaseMessageObj.type})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">费用金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                :disabled="!showH"
                style="width: 100%"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                @change="onChangeFeeAmount"
                v-decorator="$check('providerFee.feeAmount',{initialValue:BaseMessageObj.feeAmount})"/>
            </a-form-item>
          </a-col>
          <div v-if="showH">
            <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-date-picker
                  style="width: 100%"
                  :disabledDate="signDtDisabledDate"
                  @change="onChangeStartDate"
                  v-decorator="$check('providerFee.startDate',{initialValue:BaseMessageObj.startDate})"
                  allowClear/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-date-picker
                  style="width: 100%"
                  @change="onChangeEndDate"
                  :disabledDate="signDtDisabledDate"
                  v-decorator="$check('providerFee.endDate',{initialValue:BaseMessageObj.endDate})"
                  allowClear/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">费用类型</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  style="width: 100%"
                  @change="onChangeFeeType"
                  showSearch
                  :options="typeOfExpenseArr"
                  v-decorator="$check('providerFee.feeType',{initialValue:BaseMessageObj.feeType})"
                  allowClear/>
              </a-form-item>
            </a-col>
          </div>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('providerFee.note',{initialValue:BaseMessageObj.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">监控单详情</h4>
        <div v-if="showH">
          <a-row>
            <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">分摊</a-button>
          </a-row>
          <a-table
            rowKey="id"
            :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
            :columns="categoryinfoColumns"
            :dataSource="categoryinfoData"
            size="small"
            bordered
            :scroll="scrollXY">
            <template v-for="col in ['fee','note']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <a-input-number
                  v-if="col === 'fee'"
                  style="width:100%;"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => shareChange(e, record.id, col)" />
                <a-input
                  v-else-if="col === 'note'"
                  style="width:100%;"
                  :value="text"
                  @change="e => shareChange(e, record.id, col)" />
                <span v-else>{{ text }}</span>
              </div>
            </template>
            <template slot="footer">
              <h3 style="display:inline;">总计：</h3>
              <span style="margin-left:30px">总销售数量：</span>
              <span>{{ totalQuantity }}</span>
              <span style="margin-left:120px">总销售金额：</span>
              <span>{{ salesAmount }}</span>
              <span style="margin-left:120px">总费用：</span>
              <span>{{ allinCost }}</span>
            </template>
          </a-table>
        </div>
        <div v-if="!showH">
          <a-row>
            <a-button class="categoryinfo-btn" @click="supplierAdd" size="small">添加供应商</a-button>
            <a-button class="categoryinfo-btn" @click="setAdd" size="small">设置费用金额</a-button>
            <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)" size="small">删除</a-button>
          </a-row>
          <a-table
            rowKey="id"
            :rowSelection="{selectedRowKeys: fixationSelectedRowKeys, onChange: fixationChange}"
            :columns="fixationColumns"
            :dataSource="fixationData"
            size="small"
            bordered
            :scroll="{x:2000}">
            <template v-for="col in ['storeCode','storeName','name','fee', 'note']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <a-select
                  v-if="col === 'storeCode'"
                  style="width:100%;"
                  :value="text"
                  @focus="focus(record.id, col)"
                  @change="e => InputChange(e, record.id, col)"
                  :options="storeCodeArr"
                  showSearch
                  allowClear/>
                <a-select
                  v-else-if="col === 'storeName'"
                  style="width:100%;"
                  :value="text"
                  @focus="e => focus(record.id, col)"
                  @change="e => InputChange(e, record.id, col)"
                  :options="storeNameArr"
                  showSearch
                  allowClear/>
                <a-select
                  v-else-if="col === 'name'"
                  style="width:100%;"
                  :value="text"
                  @change="e => InputChange(e, record.id, col)"
                  :options="typeOfExpenseArr"
                  showSearch
                  allowClear/>
                <a-input-number
                  v-else-if="col === 'fee'"
                  style="width:100%;"
                  :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.id, col)" />
                <a-input
                  v-else-if="col === 'note'"
                  style="width:100%;"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.id, col)" />
                <span v-else>{{ text }}</span>
              </div>
            </template>
            <template slot="action" slot-scope="text, record">
              <div class="editable-row-operations">
                <span>
                  <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.id)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
            <template slot="footer">
              <h3 style="display:inline;">总计：</h3>
              <span style="margin-left:120px">总费用：￥</span>
              <span>{{ TotalFee }}</span>
            </template>
          </a-table>
          <a-modal
            title="设置金额"
            :visible="visibleM"
            @ok="handleOk"
            class="doc"
            :confirmLoading="confirmLoading"
            @cancel="handleCancel"
          >
            <a-row class="doc">
              <a-col :sm="8" :md="4" :xl="3">费用类型</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select
                    style="width: 100%"
                    @change="onChangeFeeTypeModal"
                    :options="typeOfExpenseArr"
                    allowClear/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">费用金额</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input
                    @change="onChangeMoneyModal"
                    style="width:100%;"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-modal>
        </div>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('providerFee.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('providerFee.auditUserno')"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('providerFee.auditTime')"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" :pams="pams" @onSelect="onSelect" multiple/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
.baseInfo {
    margin-bottom: 10px;
    padding-left: 25px;
    color: #38adff;
    padding-top: 10px;
}
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import difference from 'lodash.difference'
import clonedeep from 'lodash.clonedeep'
import moment from 'moment'
import find from 'lodash.find'
import goods from '@pages/settlement/SupplierCostManagement/toop/goods'
import BtModal from '@comp/Modal'
import Preview from './preview/SupplierExpenseMonitoringSheetPreview'
import getStatus from '@comp/statusAll/getStatus'
export default {
    name: 'SupplierExpenseMonitoringSheet',
    components: {
        NewTable,
        SeachBox,
        goods,
        BtModal,
        Preview
    },
    data () {
        return {
            // 负责人
            customerList: [],
            typeFlag: '',
            confirmLoading: false,
            visibleM: false,
            goodsQuery: false,
            pams: {},
            showH: true,
            allSaveArr: [],
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '供应商',
                    type: 'input',
                    key: 'provider'
                },
                {
                    title: '单据状态',
                    type: 'select',
                    key: 'status',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '制单时间开始范围',
                    type: 'date',
                    key: 'beginMakeTime'
                },
                {
                    title: '制单时间结束范围',
                    type: 'date',
                    key: 'endMakeTime'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'SupplierExpenseMonitoringSheet.edit',
                    fc: this.editHandler
                },
                {
                    name: '审核',
                    action: 'SupplierExpenseMonitoringSheet.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'SupplierExpenseMonitoringSheet.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '预览',
                    action: 'SupplierExpenseMonitoringSheet.get',
                    fc: this.previewFun
                }
            ],
            // 新增model
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {
            },
            contractCodeArr: [],
            receiveStoreCode: [],
            commodityType: [],
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [ // 表头
                {
                    title: '机构编码',
                    dataIndex: 'storeCode',
                    width: 80
                },
                {
                    title: '机构名称',
                    dataIndex: 'storeName',
                    width: 100
                },
                {
                    title: '供应商编码',
                    dataIndex: 'provider',
                    width: 100
                },
                {
                    title: '供应商名称',
                    dataIndex: 'providerName',
                    width: 100
                },
                {
                    title: '品类',
                    dataIndex: 'classCode',
                    width: 100
                },
                {
                    title: '品类名称',
                    dataIndex: 'className',
                    width: 100
                },
                {
                    title: '品牌',
                    dataIndex: 'brandCode',
                    width: 100
                },
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    width: 100
                },
                {
                    title: '经营类型',
                    dataIndex: 'goodsType',
                    width: 100
                },
                {
                    title: '销售数量',
                    dataIndex: 'saleNumber',
                    width: 100,
                    align: 'right'
                },
                {
                    title: '销售金额',
                    dataIndex: 'saleAmount',
                    width: 100,
                    align: 'right'
                },
                {
                    title: '销售占比',
                    dataIndex: 'shareRates',
                    width: 50,
                    align: 'right'
                },
                {
                    title: '费用',
                    dataIndex: 'fee',
                    width: 200,
                    align: 'right',
                    scopedSlots: { customRender: 'fee' }
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    scopedSlots: { customRender: 'note' }
                }
            ],
            categoryinfoData: [], // 表体
            rowId: '',
            scrollXY: {
                x: 2200
            },
            multiple: true, // 是否多选模式，可选，默认单选。
            addEdit: '', // 控制新增编辑
            disContextMenu: [], // 右键菜单的name
            seachValue: {
                beginMakeTime: moment().subtract(7, 'days'),
                endMakeTime: moment()
            },
            organizeCodeData: [], // 组织机构
            typeOfExpenseArr: [], // 费用类型
            sourceOrganizeId: '',
            feeTypeId: '',
            startDateId: '',
            endDateId: '',
            feeAmountId: '',
            totalQuantity: '0', // 总销售数量
            salesAmount: '0', // 销售金额
            allinCost: '0', // 总费用
            editstartDate: '',
            editendDate: '',
            fixationSelectedRowKeys: [],
            fixationColumns: [
                {
                    title: '供应商编码',
                    dataIndex: 'provider',
                    width: 100
                },
                {
                    title: '供应商名称',
                    dataIndex: 'providerName',
                    width: 100
                },
                {
                    title: '机构编码',
                    dataIndex: 'storeCode',
                    width: 100,
                    scopedSlots: { customRender: 'storeCode' }
                },
                {
                    title: '机构名称',
                    dataIndex: 'storeName',
                    width: 100,
                    scopedSlots: { customRender: 'storeName' }
                },
                {
                    title: '品类',
                    dataIndex: 'classCode',
                    width: 100
                },
                {
                    title: '品类名称',
                    dataIndex: 'className',
                    width: 100
                },
                {
                    title: '品牌',
                    dataIndex: 'brandCode',
                    width: 100
                },
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    width: 100
                },
                {
                    title: '经营类型',
                    dataIndex: 'goodsType',
                    width: 100
                },
                {
                    title: '税率',
                    dataIndex: 'taxRates',
                    width: 50,
                    align: 'right'
                },
                {
                    title: '费用类型',
                    dataIndex: 'name',
                    width: 150,
                    scopedSlots: { customRender: 'name' }
                },
                {
                    title: '费用',
                    dataIndex: 'fee',
                    width: 150,
                    align: 'right',
                    scopedSlots: { customRender: 'fee' }
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    scopedSlots: { customRender: 'note' }
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 50,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            fixationData: [],
            billsType: [
                {
                    key: 0,
                    title: '销售分摊'
                },
                {
                    key: 1,
                    title: '固定费用'
                }
            ],
            TotalFee: '0',
            moneyModal: '',
            feeTypeModal: '',
            storeCodeArr: [],
            storeNameArr: [],
            pitchOnArr: [], // 分摊选中数组
            orderId: '',
            tags: [],
            // 预览
            previewVisbel: false,
            flag: false,
            index: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '095842f3288a4cee9ac7d0edb092850a:SupplierExpenseMonitoringSheet'
            this.tableApiPath = 'ProviderMonitorFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('provider_fee_status', this.conditions[2])
        this.seachValue = {
            status: 'provider_fee_status:1',
            beginMakeTime: moment().subtract({ days: 7 }),
            endMakeTime: moment()
        }
        this.getOrganizeCodeData()
        this.typeOfExpense()
        getStatus('provider_fee_status', this.conditions[2])
        this.seachValue.status = 'provider_fee_status:1'
    },
    computed: {
        signDtDefaultValue () {
            return moment()
        }
    },

    methods: {
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        applicantSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'PermissionsUserFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.customerList = [...data]
                    }
                })
            }, 300)
        },
        focus (count, col) {
            console.log(count, col)
            const newData = [...this.fixationData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                console.log('获取焦点时得本行数据', target)

                axios({
                    path: 'ProviderMonitorSelectProviderContractStore',
                    method: 'post',
                    body: {
                        providerContractId: target.providerContractId
                    },
                    headers: {}
                }).then(res => {
                    if (res.flag === 1) {
                        this.storeCodeArr = []
                        this.storeNameArr = []
                        console.log('详细信息focus', res.data)
                        const arr = res.data
                        arr.forEach(i => {
                            this.storeCodeArr.push({
                                key: i.storeCode,
                                title: i.storeCode
                            })
                            this.storeNameArr.push({
                                key: i.storeCode,
                                title: i.storeName
                            })
                        })
                    }
                })
            }
        },
        onChangeMoneyModal (e) {
            this.moneyModal = e.target.value
            console.log('金钱', this.moneyModal)
        },
        onChangeFeeTypeModal (e) {
            this.feeTypeModal = e
            console.log('费用类型', this.feeTypeModal)
        },
        handleOk (e) {
            if (this.fixationData.length === 0) {
                this.$message.warning('请添加供应商！')
            } else {
                this.confirmLoading = true
                if (!this.feeTypeModal) {
                    this.$message.warning('请添加费用类型！')
                    return
                }
                if (!this.moneyModal) {
                    this.$message.warning('请添加费用金额！')
                    return
                }
                this.fixationData.forEach(i => {
                    i.name = this.feeTypeModal
                    i.fee = this.moneyModal
                })
                this.total(this.fixationData)
                this.visibleM = false
                this.confirmLoading = false
            }
        },
        handleCancel (e) {
            this.visibleM = false
        },
        /**
         * @name: 搜索弹框事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.fixationData.filter(o => o.monitoringId === i.id)
                if (has.length === 0) {
                    this.fixationData.push({
                        index: this.index++,
                        id: i.id,
                        providerContractId: i.providerContractId,
                        storeCode: i.storeCode,
                        storeName: i.storeName,
                        provider: i.providerCode,
                        providerName: i.providerName,
                        classCode: i.classCode,
                        className: i.className,
                        brandCode: i.brandCode,
                        brandName: i.brandName,
                        goodsType: i.businessType,
                        taxRate: i.skuTaxRate,
                        taxRates: this.rateTransform(i.skuTaxRate),
                        name: i.name,
                        fee: i.fee,
                        monitoringId: i.id
                    })
                } else {
                    error.push(i.providerName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        onChangeBillsType (type) {
            console.log('单据类型', type)
            this.form.setFieldsValue({
                sourceOrganize: '',
                feeAmount: ''
            })
            this.typeFlag = type
            if (type === 0 || type === undefined) {
                this.showH = true
            } else {
                this.showH = false
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        fixationChange (selectedRowKeys) {
            this.fixationSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (id) {
            if (id === -1) {
                const fixationData = [...this.fixationData]
                for (const i in this.fixationSelectedRowKeys) {
                    for (const j in fixationData) {
                        if (fixationData[j].id === this.fixationSelectedRowKeys[i]) {
                            fixationData.splice(j, 1)
                        }
                    }
                }
                this.fixationData = fixationData
            } else {
                const fixationData = [...this.fixationData]
                this.fixationData = fixationData.filter(item => item.id !== id)
            }
            this.total(this.fixationData)
        },
        /**
         * @name: 设置费用金额
         * @msg:
         * @param {type}
         * @return:
         */
        setAdd () {
            console.log('设置费用金额')
            this.visibleM = true
        },
        /**
         * @name: 添加供应商
         * @msg:
         * @param {type}
         * @return:
         */
        supplierAdd () {
            console.log('添加供应商')
            this.goodsQuery = true
        },
        onChangeSourceOrganize (e) {
            console.log(e)
            this.sourceOrganizeId = e
            this.flag = true
        },
        onChangeFeeType (e) {
            console.log(e)
            this.feeTypeId = e
        },
        onChangeStartDate (e) {
            console.log(e)
            this.startDateId = e
        },
        onChangeEndDate (e) {
            console.log(e)
            this.endDateId = e
        },
        onChangeFeeAmount (e) {
            console.log(e)
            this.feeAmountId = e
        },
        /**
         * @name: 分摊
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            console.log('弹框新增')
            if (this.sourceOrganizeId === '' || this.sourceOrganizeId === undefined) {
                this.$message.warning('请选择发生机构！')
                return
            } else if (this.feeTypeId === '' || this.feeTypeId === undefined) {
                this.$message.warning('请选择费用类型！')
                return
            } else if (this.startDateId === '' || this.startDateId === null) {
                this.$message.warning('请选择开始时间！')
                return
            } else if (this.endDateId === '' || this.endDateId === null) {
                this.$message.warning('请选择结束时间！')
                return
            } else if (this.feeAmountId === '' || this.feeAmountId === undefined) {
                this.$message.warning('请选择费用金额！')
                return
            }
            axios({
                path: 'ProviderMonitorFindShare',
                method: 'post',
                body: {
                    sourceOrganize: this.sourceOrganizeId,
                    feeType: this.feeTypeId,
                    startDate: this.startDateId,
                    endDate: this.endDateId,
                    feeAmount: this.feeAmountId
                },
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    console.log('详细信息', res.data)
                    const arr = res.data
                    for (const item of arr) {
                        if (item.goodsType === 'provider_contract_business_type:1') {
                            item.goodsType = '自营'
                        }
                        if (item.goodsType === 'provider_contract_business_type:2' || item.goodsType === 'provider_contract_business_type:3') {
                            item.goodsType = '联营'
                        }
                        item.saleAmount = `￥ ${item.saleAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        this.allSaveArr.push(item.id)
                        item.shareRates = this.rateTransform(item.shareRate)
                        this.categoryinfoSelectedRowKeys.push(item.id)
                    }
                    this.categoryinfoData = arr
                    this.pitchOnArr = arr
                    this.apportionTotal(this.categoryinfoData)
                }
            })
        },
        /**
         * @name: 分摊总计
         * @msg:
         * @param {type}
         * @return:
         */
        apportionTotal (data) {
            console.log('----------------', data)
            const numArr = [...data]
            const totalQuantityArr = []
            const salesAmountArr = []
            const feeArr = []
            for (const item of numArr) {
                totalQuantityArr.push(item.saleNumber)
                salesAmountArr.push(item.saleAmount.replace(/\￥\s?|(,*)/g, ''))
                feeArr.push(item.fee)
            }
            const { add } = this.$math
            this.totalQuantity = totalQuantityArr.reduce(function (prev, cur) {
                return add(prev, cur, 0)
            }, 0)
            const numSalesAmount = salesAmountArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.salesAmount = `￥ ${numSalesAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            const numFee = feeArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
            this.allinCost = `￥ ${numFee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        },
        /**
         * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        getOrganizeCodeData () {
            axios({
                path: 'OrganizationGroupFrameworkFindOptionTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log('组织机构', data)
                    this.organizeCodeData = this.initTree(data)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        /**
         * @name: 费用类型
         * @msg:
         * @param {type}
         * @return:
         */
        typeOfExpense () {
            axios({
                path: 'ProviderSetSelectFeeSet',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取费用类型', res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.feeName
                        i.title = i.feeName
                    })
                    this.typeOfExpenseArr = [...data]
                }
            })
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'provider_fee_status:1') {
                this.disContextMenu = []
            } else if (status === 'provider_fee_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isAfter(moment().startOf('day'))
        },
        // 搜索框方法
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ProviderMonitorFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ProviderMonitorFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            // console.log(keys, rows)
            this.selectArr = rows
        },
        /**
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (e) {
            console.log('编辑', e)
            this.addData(e)
            this.rowId = e.id
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'ProviderMonitorAudit',
                        method: 'post',
                        body: {
                            id: e.id
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 表格右击删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (row) {
            this.onDel(row)
        },
        /**
         * @name: 删除方法
         * @msg:
         * @param {type}
         * @return:
         */
        onDel (e) {
            console.log(e)
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'provider_fee_status：2') {
                        this.$message.error('选中数据存在已审核数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'ProviderMonitorDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        } else if (res.flag === 6) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                console.log('新增')
                this.addEdit = 'add'
                this.orderId = ''
                this.tags = []
                this.typeFlag = 0
                this.allSaveArr = []
                this.categoryinfoSelectedRowKeys = []
                this.BaseMessageObj = {
                    type: 0,
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.sourceOrganizeId = ''
                this.feeTypeId = ''
                this.startDateId = ''
                this.endDateId = ''
                this.feeAmountId = ''
                this.emptyFun()
                this.showH = true
                this.addEditModel = true
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEdit = 'edit'
                this.allSaveArr = []
                this.categoryinfoSelectedRowKeys = []
                this.editAssign(index)
                this.fixationData = []
            }
            this.index = 1
        },
        /**
         * @name: 编辑赋初值操作
         * @msg:
         * @param {type}
         * @return:
         */
        editAssign (e) {
            axios({
                path: 'ProviderMonitorFindDetail',
                method: 'post',
                body: {
                    feeId: e.id
                },
                headers: {}
            }).then(res => {
                console.log('详细信息', res)
                if (res.flag === 1) {
                    if (res.data.providerFeeDetails.length !== 0) {
                        this.addEditModel = true
                        if (res.data.type === 0) {
                            this.showH = true
                            this.BaseMessageObj = {
                                sourceOrganize: res.data.sourceOrganize,
                                type: res.data.type,
                                feeType: res.data.feeType,
                                startDate: moment(res.data.startDate),
                                endDate: moment(res.data.endDate),
                                feeAmount: res.data.feeAmount,
                                chargeUserno: res.data.chargeUserno,
                                makeTime: res.data.makeTime
                            }
                            this.orderId = res.data.code
                            this.tags = ['uncheck']

                            this.sourceOrganizeId = res.data.sourceOrganize
                            this.feeTypeId = res.data.feeType
                            this.startDateId = moment(res.data.startDate)
                            this.endDateId = moment(res.data.endDate)
                            this.feeAmountId = res.data.feeAmount
                            this.typeFlag = res.data.type
                            this.allinCost = `￥ ${res.data.feeAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            const arr = res.data.providerFeeDetails
                            const totalQuantityArr = []
                            const salesAmountArr = []
                            for (const item of arr) {
                                item.shareRates = this.rateTransform(item.shareRate)
                                if (item.goodsType === 'provider_contract_business_type:1') {
                                    item.goodsType = '自营'
                                }
                                if (item.goodsType === 'provider_contract_business_type:2' || item.goodsType === 'provider_contract_business_type:3') {
                                    item.goodsType = '联营'
                                }
                                item.saleAmount = `￥ ${item.saleAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                this.allSaveArr.push(item.id)
                                if (item.note) {
                                    this.categoryinfoSelectedRowKeys.push(item.id)
                                    totalQuantityArr.push(item.saleNumber)
                                    salesAmountArr.push(item.saleAmount.replace(/\￥\s?|(,*)/g, ''))
                                }
                            }
                            this.$nextTick(() => {
                                this.categoryinfoData = arr
                            })
                            this.pitchOnArr = arr
                            const { add } = this.$math
                            this.totalQuantity = totalQuantityArr.reduce(function (prev, cur) {
                                return add(prev, cur, 0)
                            }, 0)
                            const numSalesAmount = salesAmountArr.reduce(function (prev, cur) {
                                return add(prev, cur, 3)
                            }, 0)
                            this.salesAmount = `￥ ${numSalesAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            this.onFormData(res.data.providerFeeDetails, this.salesAmount)
                        } else {
                            this.showH = false
                            this.BaseMessageObj = {
                                sourceOrganize: res.data.sourceOrganize,
                                type: res.data.type,
                                feeAmount: res.data.feeAmount,
                                makeTime: res.data.makeTime,
                                chargeUserno: res.data.chargeUserno
                            }
                            const arr = res.data.providerFeeDetails
                            for (const item of arr) {
                                item.index = this.index++
                                if (item.shareRate) {
                                    item.shareRates = this.rateTransform(item.shareRate)
                                }
                                if (item.goodsType === 'provider_contract_business_type:1') {
                                    item.goodsType = '自营'
                                }
                                if (item.goodsType === 'provider_contract_business_type:2' || item.goodsType === 'provider_contract_business_type:3') {
                                    item.goodsType = '联营'
                                }
                            }
                            this.fixationData = arr
                            this.total(arr)
                        }
                    } else {
                        this.$message.warning('该条信息没有监控单详情，请删除重新添加！')
                    }
                }
            })
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            var newData = []
            console.log('提交判断', this.typeFlag)
            if (this.typeFlag === 0) {
                newData = clonedeep(this.pitchOnArr)
                if (newData.length === 0) {
                    this.$message.warning('请添加供应商监控单详情信息！')
                    return
                }
                console.log('-----', this.allinCost.replace(/\￥\s?|(,*)/g, ''), this.feeAmountId)
                if (Number(this.allinCost.replace(/\￥\s?|(,*)/g, '')) !== Number(this.feeAmountId)) {
                    this.$message.warning('费用金额与分摊合计不等,无法分摊！')
                    return
                }
                for (const item of newData) {
                    if (item.goodsType === '自营') {
                        item.goodsType = 'provider_contract_business_type:1'
                    }
                    if (item.goodsType === '联营') {
                        item.goodsType = 'provider_contract_business_type:3'
                    }
                    item.saleAmount = item.saleAmount.replace(/\￥\s?|(,*)/g, '')
                }
            } else {
                newData = clonedeep(this.fixationData)
                if (newData.length === 0) {
                    this.$message.warning('请添加供应商监控单详情！')
                    return
                } else {
                    newData.forEach(item => {
                        if (item.storeCode === '' || item.storeCode === undefined) {
                            this.$message.warning(`${item.provider}-${item.providerName}-此供应商未选择分店编码,请选择分店编码！`)
                            return
                        }
                        if (item.storeName === '' || item.storeName === undefined) {
                            this.$message.warning(`${item.provider}-${item.providerName}-此供应商未选择分店名称,请选择分店名称！`)
                            return
                        }
                        if (item.name === '' || item.name === undefined) {
                            this.$message.warning(`${item.provider}-${item.providerName}-此供应商未选择费用类型,请选择费用类型！`)
                            return
                        }
                        if (item.fee === '' || item.fee === undefined) {
                            this.$message.warning(`${item.provider}-${item.providerName}-此供应商未输入费用金额,请输入费用金额！`)
                            return
                        }
                        if (item.goodsType === '自营') {
                            item.goodsType = 'provider_contract_business_type:1'
                        }
                        if (item.goodsType === '联营') {
                            item.goodsType = 'provider_contract_business_type:3'
                        }
                    })
                }
            }

            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    console.log(newData)
                    const addArr = Object.assign(values, { providerFeeDetails: newData }, { makeStoreCode: this.$store.getters.storeInfo.code })
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        axios({
                            path: 'ProviderMonitorAdd',
                            method: 'post',
                            body: addArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        const editArr = Object.assign(addArr, { id: this.rowId })
                        axios({
                            path: 'ProviderMonitorUpdate',
                            method: 'post',
                            body: editArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    }
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            const { div, mul } = this.$math
            this.pitchOnArr = []
            console.log('全部选中', this.allSaveArr)
            console.log('全部数据', this.categoryinfoData)
            this.categoryinfoSelectedRowKeys = selectedRowKeys
            const RowIdArr = difference(this.allSaveArr, selectedRowKeys)
            console.log('选中行Id', selectedRowKeys)
            console.log('未选的值', RowIdArr)
            RowIdArr.forEach(i => {
                const x = find(this.categoryinfoData, (o) => { if (o.id === i) return o })
                x.fee = '0'
                x.shareRate = '0'
                x.shareRates = '0'
                x.note = ''
            })
            selectedRowKeys.forEach(i => {
                const x = find(this.categoryinfoData, (o) => { if (o.id === i) return o })
                this.pitchOnArr.push(x)
            })
            this.apportionTotal(this.pitchOnArr)
            for (const i of this.pitchOnArr) {
                i.shareRates = this.rateTransform(div(i.saleAmount.replace(/\￥\s?|(,*)/g, ''), this.salesAmount.replace(/\￥\s?|(,*)/g, ''), 6))
                console.log(i.shareRates, '比率')
                i.shareRate = div(i.saleAmount.replace(/\￥\s?|(,*)/g, ''), this.salesAmount.replace(/\￥\s?|(,*)/g, ''), 6)
                if (this.addEdit === 'add') {
                    i.fee = mul(this.feeAmountId, i.shareRate, 2)
                    i.note = `从${moment(this.startDateId).format('YYYY-MM-DD')}到${moment(this.endDateId).format('YYYY-MM-DD')}销售额${i.saleAmount}占总销售额${this.salesAmount}的比率${i.shareRates}分摊${i.type}${i.fee}元`
                } else {
                    console.log('----------', this.feeAmountId, i.shareRate)
                    i.fee = mul(this.feeAmountId, i.shareRate, 2)
                    i.note = `从${moment(this.BaseMessageObj.startDate).format('YYYY-MM-DD')}到${moment(this.BaseMessageObj.endDate).format('YYYY-MM-DD')}销售额${i.saleAmount}占总销售额${this.allinCost}的比率${i.shareRates}分摊${i.type}${i.fee}元`
                }
            }
            // this.pitchOnArr.forEach(i => {
            //     i.shareRates = this.rateTransform(div(i.saleAmount.replace(/\￥\s?|(,*)/g, ''), this.salesAmount.replace(/\￥\s?|(,*)/g, ''), 6))
            //     i.shareRate = div(i.saleAmount.replace(/\￥\s?|(,*)/g, ''), this.salesAmount.replace(/\￥\s?|(,*)/g, ''), 6)
            //     if (this.addEdit === 'add') {
            //         i.fee = mul(this.feeAmountId, i.shareRate, 2)
            //         i.note = `从${moment(this.startDateId).format('YYYY-MM-DD')}到${moment(this.endDateId).format('YYYY-MM-DD')}销售额${i.saleAmount}占总销售额${this.salesAmount}的比率${i.shareRates}分摊${i.type}${i.fee}元`
            //     } else {
            //         console.log('----------', this.feeAmountId, i.shareRate)
            //         i.fee = mul(this.feeAmountId, i.shareRate, 2)
            //         i.note = `从${moment(this.BaseMessageObj.startDate).format('YYYY-MM-DD')}到${moment(this.BaseMessageObj.endDate).format('YYYY-MM-DD')}销售额${i.saleAmount}占总销售额${this.allinCost}的比率${i.shareRates}分摊${i.type}${i.fee}元`
            //     }
            // })

            this.apportionTotal(this.pitchOnArr)
        },
        onFormData (data, numSalesAmount) {
            for (const i of data) {
                const { div, mul } = this.$math
                console.log(numSalesAmount, '转换')
                i.shareRate = div(i.saleAmount.replace(/\￥\s?|(,*)/g, ''), numSalesAmount.replace(/\￥\s?|(,*)/g, ''), 6)
                i.shareRates = this.rateTransform(i.shareRate)
                console.log(numSalesAmount, '比率')
                i.fee = mul(this.feeAmountId, i.shareRate, 2)
                i.note = `从${moment(this.startDateId).format('YYYY-MM-DD')}到${moment(this.endDateId).format('YYYY-MM-DD')}销售额${i.saleAmount}占总销售额${this.salesAmount}的比率${i.shareRates}分摊${i.type}${i.fee}元`
            }
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.fixationData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                console.log('编辑室的本行数据', target)
                target[col] = val
                this.fixationData = newData
                if (col === 'storeCode') {
                    if (val === undefined) {
                        target.storeName = ''
                        return
                    }
                    const x = find(this.storeNameArr, (o) => { if (o.key === val) return o })
                    target.storeName = x.title
                }
                if (col === 'storeName') {
                    target.storeCode = val
                }
            }
            if (col === 'fee') {
                this.total(newData)
            }
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        shareChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                console.log('编辑室的本行数据', target)
                target[col] = val
                this.categoryinfoData = newData
            }
            this.apportionTotal(newData)
        },

        total (data) {
            console.log('1235646546', data.length)
            const { add } = this.$math
            const feeArr = []
            for (const item of data) {
                if (item.fee === '' || item.fee === undefined) {
                    item.fee = 0
                }
                feeArr.push(item.fee)
            }
            if (this.typeFlag === 0) {
                const num = feeArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.TotalFee = num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.form.setFieldsValue({
                    feeAmount: this.TotalFee
                })
            } else {
                this.TotalFee = feeArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.form.setFieldsValue({
                    feeAmount: this.TotalFee
                })
            }
        },
        emptyFun () {
            this.totalQuantity = '0'
            this.salesAmount = '0'
            this.allinCost = '0'
            this.TotalFee = '0'
            this.categoryinfoData = []
            this.fixationData = []
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'SupplierExpenseMonitoringSheet') {
                this.getOrganizeCodeData()
                this.typeOfExpense()
            }
        },
        typeFlag: {
            handler (val, oldval) {
                this.emptyFun()
            }
        },
        sourceOrganizeId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flag) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.form.setFieldsValue({
                                    type: 0,
                                    sourceOrganize: '',
                                    feeAmount: '',
                                    feeType: '',
                                    chargeUserno: ''
                                })
                                that.totalQuantity = '0'
                                that.salesAmount = '0'
                                that.allinCost = '0'
                                that.categoryinfoData = []
                            },
                            onCancel () {
                                console.log(oldval)
                                that.sourceOrganizeId = oldval
                                that.form.setFieldsValue({ sourceOrganize: oldval })
                            }
                        })
                    }
                }
                this.flag = false
            }
        }
    }
}
</script>

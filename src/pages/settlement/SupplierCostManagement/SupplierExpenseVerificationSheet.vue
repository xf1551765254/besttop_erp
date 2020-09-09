<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 18:34:15
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
      title="供应商费用核销单"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick">
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                @change="onChangeNoteA"
                @search="priverSearch"
                :options="noteAArr"
                showSearch
                v-decorator="$check('providerFeeFact.provider',{initialValue:this.BaseMessageObj.provider})"
                allowClear/>
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                v-decorator="$check('providerFeeFact.makeStoreCode',{initialValue:this.$store.getters.storeInfo.name})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('providerFeeFact.note',{initialValue:BaseMessageObj.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">核销单详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">新增</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" size="small">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="tbWebId"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scrollXY"
        >
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:20px">应核销费用：</span>
            <span>{{ shouldCancelAfterVerification }}</span>
            <span style="margin-left:40px">净毛利核销(含税)：</span>
            <span>{{ netMarginH }}</span>
            <span style="margin-left:40px">净毛利核销(未税)：</span>
            <span>{{ netMarginW }}</span>
            <span style="margin-left:40px">赞返核销：</span>
            <span>{{ whoReturnToCancelAfterVerification }}</span>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.tbWebId)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('providerFeeFact.makeUserCode', {initialValue:this.$store.getters.name})"
                showSearch
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('providerFeeFact.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('providerFeeFact.auditUserCode', {initialValue:BaseMessageObj.auditUserCode})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('providerFeeFact.auditTime', {initialValue:BaseMessageObj.auditTime})"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      </a-modal>
      <!-- 详情选择框 -->
      <a-modal
        v-model="visible"
        title="供应商费用核销选择"
        :closable="false"
        :keyboard="false"
        :maskClosable="false"
        :width="800"
        destroyOnClose
        class="doc"
        centered>
        <a-row style="margin-top:10px;">
          <a-col :span="24" class="table-nowrap">
            <a-table
              rowKey="tbWebId"
              :scroll="{x:2100}"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
              :columns="columns"
              :dataSource="dataSource"
              size="small"
              bordered>
              <template slot="footer">
                <h3 style="display:inline;">总计：</h3>
                <span style="margin-left:10px">应收费用：</span>
                <span>{{ sumChangeM(legalFeesReceivalbe) }}</span>
                <span style="margin-left:30px">实收毛利核销：</span>
                <span>{{ sumChangeM(grossMarginCost) }}</span>
                <span style="margin-left:30px">赞返核销：</span>
                <span>{{ sumChangeM(assistToReturn) }}</span>
                <span style="margin-left:30px">欠收费用：</span>
                <span>{{ sumChangeM(oweFees) }}</span>
              </template>
              <template v-for="col in ['feeProfit','feeSponsor']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-input-number
                    v-if="record.editable && col === 'feeProfit'"
                    style="margin: -5px 0;width:100%;"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    :step="1"
                    :precision="2"
                    :value="text"
                    @change="e => InputChange(e, record.tbWebId, col)" />
                  <a-input-number
                    v-else-if="record.editable && col === 'feeSponsor'"
                    style="margin: -5px 0;width:100%;"
                    :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                    :min="0"
                    :max="Number.MAX_SAFE_INTEGER"
                    :step="1"
                    :precision="2"
                    :value="text"
                    @change="e => InputChange(e, record.tbWebId, col)" />
                  <span v-else>{{ text }}</span>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <template slot="footer">
          <a-popconfirm title="确认放弃已填写的信息？" @confirm="submitClose">
            <a-icon slot="icon" type="question-circle-o" style="color: red" />
            <a-button key="back">关闭</a-button>
          </a-popconfirm>
          <a-button key="submit" type="primary" :loading="submitLoading" @click="submitSelect">选择</a-button>
        </template>
      </a-modal>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .categoryinfo-btn{
        margin:8px;
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:auto;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import find from 'lodash.find'
import is from 'is_js'
import clonedeep from 'lodash.clonedeep'
import goods from '@pages/purchasing/purchaseOrder/goods'
import BtModal from '@comp/Modal'
import getStatus from '@comp/statusAll/getStatus'
import Preview from './preview/SupplierExpenseVerificationSheetPreview'
const categoryinfoData = []
export default {
    name: 'SupplierExpenseVerificationSheet',
    components: {
        NewTable,
        SeachBox,
        goods,
        BtModal,
        Preview
    },
    data () {
        this.cacheData = categoryinfoData.map(item => ({ ...item }))
        return {
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
                    type: 'select',
                    key: 'provider',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
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
                    key: 'auditTimeA'
                },
                {
                    title: '制单时间结束范围',
                    type: 'date',
                    key: 'auditTimeB'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'SupplierExpenseVerificationSheet.edit',
                    fc: this.editHandler
                },
                {
                    name: '删除',
                    action: 'SupplierExpenseVerificationSheet.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '确认',
                    action: 'SupplierExpenseVerificationSheet.verify',
                    fc: this.affirmHandler
                },

                { name: '取消确认',
                    action: 'SupplierExpenseVerificationSheet.verify',
                    fc: this.cancelAffirmHandler
                },
                {
                    name: '审核',
                    action: 'SupplierExpenseVerificationSheet.verify',
                    fc: this.auditHandler
                },
                {
                    name: '预览',
                    action: 'SupplierExpenseVerificationSheet.get',
                    fc: this.previewFun
                }
            ],
            // 新增model
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            // 基础信息默认值
            BaseMessageObj: {},
            contractCodeArr: [],
            receiveStoreCode: [],
            commodityType: [],
            categoryinfoSelectedRowKeys: [], // 详情选中项
            categoryinfoColumns: [ // 详情表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'goodsType', width: 100 },
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 100 },
                { title: '费用监控单号', dataIndex: 'feeCode', width: 100 },
                { title: '费用项目', dataIndex: 'name', width: 100 },
                { title: '净毛利核销(含税)', dataIndex: 'feeProfit', width: 100, align: 'right' },
                { title: '净毛利核销(未税)', dataIndex: 'feeProfitW', width: 100, align: 'right' },
                { title: '赞返核销', dataIndex: 'feeSponsor', width: 100, align: 'right' },
                { title: '未核销费用', dataIndex: 'fee', width: 100, align: 'right' },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData, // 表体
            categoryinfoID: 0, // 行唯一
            rowId: '',
            scrollXY: {
                x: 1900,
                y: 350
            },
            multiple: true, // 是否多选模式，可选，默认单选。
            addEdit: '', // 控制新增编辑
            disContextMenu: [], // 右键菜单的name
            seachValue: {
                auditTimeA: moment().subtract(7, 'days'),
                auditTimeB: moment()
            },
            typeOfExpenseArr: [], // 费用类型
            noteAArr: [],
            visible: false,
            selectedRowKeys: [],
            columns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '监控单号', dataIndex: 'code', width: 100 },
                { title: '审核时间', dataIndex: 'auditTime', width: 100 },
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 100 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '经营类型', dataIndex: 'goodsType', width: 100 },
                { title: '费用项目', dataIndex: 'name', width: 100 },
                { title: '应收费用', dataIndex: 'fee', width: 100, align: 'right' },
                { title: '实收毛利核销', dataIndex: 'feeProfit', width: 100, align: 'right', scopedSlots: { customRender: 'feeProfit' } },
                { title: '实收赞返核销', dataIndex: 'feeSponsor', width: 100, align: 'right', scopedSlots: { customRender: 'feeSponsor' } },
                { title: '欠收费用', dataIndex: 'oweFees', width: 100, align: 'right' },
                { title: '备注', dataIndex: 'note', width: 600 }
            ],
            dataSource: [],
            noteAId: '',
            monitoringArr: [],
            legalFeesReceivalbe: '0.00', // 应收费用总计
            grossMarginCost: '0.00', // 毛利费用总计
            assistToReturn: '0.00', // 赞返
            oweFees: '0.00', // 欠收费用
            shouldCancelAfterVerification: '0.00',
            netMarginH: '0.00', // 净毛利核销含税
            netMarginW: '0.00', // 净毛利核销未税
            whoReturnToCancelAfterVerification: '0.00', // 赞返
            orderId: '',
            tags: [],
            // 预览
            previewVisbel: false,
            index: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '47a10ac891bb4f93acb583a1abad7cad:SupplierExpenseVerificationSheet'
            this.tableApiPath = 'ProviderFactSelectFeeFact'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        getStatus('provider_fee_fact_status', this.conditions[2])
        this.seachValue = {
            status: 'provider_fee_fact_status:1',
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment()
        }
        getStatus('provider_fee_fact_status', this.conditions[2])
        this.seachValue.status = 'provider_fee_fact_status:1'
    },
    computed: {
        signDtDefaultValue () {
            return moment()
        }
    },
    methods: {
        priverSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'CustomerSupplierFindOption',
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
                        this.noteAArr = [...data]
                    }
                })
            }, 300)
        },
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        onChangeNoteA (id) {
            this.noteAId = id
        },
        onChange (selectedRowKeys) {
            console.log(selectedRowKeys)
            const { add, sub } = this.$math
            this.selectedRowKeys = selectedRowKeys
            const arr = []
            for (const i of this.dataSource) {
                if (!is.inArray(i.id, selectedRowKeys)) {
                    if (!i.feeProfit) {
                        i.feeProfit = '0'
                    }
                    if (!i.feeSponsor) {
                        i.feeSponsor = '0'
                    }
                    i.feeProfit = '0'
                    i.oweFees = this.sumChangeM(sub(this.sumChangeS(i.fee), add(i.feeProfit, i.feeSponsor, 2)))
                    i.editable = false
                }
            }
            this.selectedRowKeys.forEach(i => {
                const x = find(this.dataSource, (o) => { if (o.id === i) return o })
                if (!x.feeProfit) {
                    x.feeProfit = '0'
                }
                if (!x.feeSponsor) {
                    x.feeSponsor = '0'
                }
                x.editable = true
                x.feeProfit = this.sumChangeS(x.fee)
                x.oweFees = this.sumChangeM(sub(this.sumChangeS(x.fee), add(x.feeProfit, x.feeSponsor, 2)))
                arr.push(x)
            })
            this.monitoringArr = arr
            console.log(arr)
            const legalFeesReceivalbeArr = []
            const grossMarginCostArr = []
            const oweFeesArr = []
            const assistToReturnArr = []
            arr.forEach(i => {
                legalFeesReceivalbeArr.push(this.sumChangeS(i.fee))
                grossMarginCostArr.push(i.feeProfit)
                oweFeesArr.push(this.sumChangeS(i.oweFees))
                assistToReturnArr.push(i.feeSponsor)
            })
            this.legalFeesReceivalbe = legalFeesReceivalbeArr.reduce(function (prev, cur) {
                return add(prev, cur, 3)
            }, 0)
            this.grossMarginCost = grossMarginCostArr.reduce(function (prev, cur) {
                return add(prev, cur, 3)
            }, 0)
            this.oweFees = oweFeesArr.reduce(function (prev, cur) {
                return add(prev, cur, 3)
            }, 0)
            this.assistToReturn = assistToReturnArr.reduce(function (prev, cur) {
                return add(prev, cur, 3)
            }, 0)
        },
        submitSelect () {
            const { add, div } = this.$math
            const arr = [...this.categoryinfoData]

            const error = []
            this.monitoringArr.forEach(i => {
                const has = arr.filter(o => o.chargeOffId === i.id)
                if (has.length === 0) {
                    i.index = this.index++
                    i.chargeOffId = i.id
                    i.feeCode = i.code
                    i.fee = this.sumChangeS(i.oweFees)
                    i.feeProfitW = div(i.feeProfit, add(1, i.taxRate), 6)
                    i.providerFeeDetailId = i.id
                    this.categoryinfoData.push(i)
                } else {
                    error.push(i.className)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.totalJMeter(this.categoryinfoData)
            this.visible = false
        },
        totalJMeter (data) {
            this.$nextTick(() => {
                console.log('表体', data)
                const { add } = this.$math
                const shouldCancelAfterVerificationArr = []
                const netMarginHArr = []
                const netMarginWArr = []
                const whoReturnToCancelAfterVerificationArr = []
                data.forEach(i => {
                    shouldCancelAfterVerificationArr.push(i.fee)
                    netMarginHArr.push(i.feeProfit)
                    netMarginWArr.push(i.feeProfitW)
                    whoReturnToCancelAfterVerificationArr.push(i.feeSponsor)
                })
                this.shouldCancelAfterVerification = shouldCancelAfterVerificationArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.netMarginH = netMarginHArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.netMarginW = netMarginWArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.whoReturnToCancelAfterVerification = whoReturnToCancelAfterVerificationArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
            })
        },
        /**
         * @name: 选择弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitClose () {
            this.visible = false
        },
        /**
         * @name: 新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            console.log('弹框新增')
            this.legalFeesReceivalbe = '0.00'
            this.grossMarginCost = '0.00'
            this.assistToReturn = '0.00'
            this.oweFees = '0.00'
            if (this.noteAId === '') {
                this.$message.warning('请选择供应商！')
                return
            }
            this.selectedRowKeys = []
            this.visible = true
            axios({
                path: 'ProviderMonitorFindDetailByProvider',
                method: 'post',
                body: {
                    provider: this.noteAId
                },
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    console.log('监控单', res)
                    const arr = res.data.list
                    arr.forEach(i => {
                        i.tbWebId = i.id
                        i.fee = `￥ ${i.fee}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        i.oweFees = i.fee
                        if (i.goodsType === 'provider_contract_business_type:1') {
                            i.goodsType = '自营'
                        }
                        if (i.goodsType === 'provider_contract_business_type:2' || i.goodsType === 'provider_contract_business_type:3') {
                            i.goodsType = '联营'
                        }
                    })
                    this.dataSource = arr
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
            if (status === 'provider_fee_fact_status:1') {
                this.disContextMenu = ['审核', '取消确认']
            } else if (status === 'provider_fee_fact_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核', '确认', '取消确认']
            } else if (status === 'provider_fee_fact_status:3') {
                this.disContextMenu = ['编辑', '删除', '确认']
            }
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
                this.$refs.newTable.exportFile('ProviderFactSelectFeeFact', this.seachValue)
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
            e.path = 'ProviderFactSelectFeeFact'
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
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'ProviderFactAuditFeeFact',
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
         * @name: 确认
         * @msg:
         * @param {type}
         * @return:
         */
        affirmHandler (e) {
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否确认当前信息?',
                onOk () {
                    axios({
                        path: 'ProviderFactAuditPreliminary',
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
         * @name: 取消确认
         * @msg:
         * @param {type}
         * @return:
         */
        cancelAffirmHandler (e) {
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否对当前信息取消确认?',
                onOk () {
                    axios({
                        path: 'ProviderFactAuditPreliminaryCancel',
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
                    if (statusArr[item] === 'provider_fee_fact_status:2' || statusArr[item] === 'provider_fee_fact_status:3') {
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
                        path: 'ProviderFactDeleteFeeFact',
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
                this.categoryinfoData = []
                this.BaseMessageObj = {
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.noteAId = ''
                this.shouldCancelAfterVerification = '0.00'
                this.netMarginH = '0.00'
                this.netMarginW = '0.00'
                this.whoReturnToCancelAfterVerification = '0.00'
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEdit = 'edit'
                this.editAssign(index)
                this.index = 1
            }
            // 打开modal
            this.addEditModel = true
        },
        /**
         * @name: 编辑赋初值操作
         * @msg:
         * @param {type}
         * @return:
         */
        editAssign (e) {
            axios({
                path: 'ProviderFactDetailSelectFeeFactDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('详细信息', res)
                    this.orderId = res.data.code
                    this.tags = ['uncheck']

                    const arr = res.data.providerFeeFactDetails
                    this.BaseMessageObj = {
                        provider: res.data.provider,
                        makeTime: res.data.makeTime
                    }
                    this.noteAId = res.data.provider
                    const { add, mul } = this.$math
                    arr.forEach(i => {
                        if (i.goodsType === 'provider_contract_business_type:1') {
                            i.goodsType = '自营'
                        }
                        if (i.goodsType === 'provider_contract_business_type:2' || i.goodsType === 'provider_contract_business_type:3') {
                            i.goodsType = '联营'
                        }
                        i.index = this.index++
                        i.tbWebId = i.id
                        i.feeProfitW = mul(i.feeProfit, add(1, i.taxRate), 6)
                    })
                    this.categoryinfoData = arr
                    this.totalJMeter(this.categoryinfoData)
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
            const newData = clonedeep(this.categoryinfoData)
            if (newData.length === 0) {
                this.$message.error('请添加供应商核销单详情信息')
                return
            }
            for (const item of newData) {
                if (item.goodsType === '自营') {
                    item.goodsType = 'provider_contract_business_type:1'
                }
                if (item.goodsType === '联营') {
                    item.goodsType = 'provider_contract_business_type:3'
                }
            }
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    console.log(newData)
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        const addArr = Object.assign(values, { providerFeeFactDetails: newData }, { makeStoreCode: this.$store.getters.storeInfo.code })
                        axios({
                            path: 'ProviderFactAddFeeFact',
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
                        const editArr = Object.assign(values, { id: this.rowId }, { providerFeeFactDetails: newData }, { makeStoreCode: this.$store.getters.storeInfo.code })
                        axios({
                            path: 'ProviderFactUpdateFeeFact',
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
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (tbWebId) {
            if (tbWebId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].tbWebId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.tbWebId !== tbWebId)
            }
            this.totalJMeter(this.categoryinfoData)
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            if (val === '' || val === undefined || val === '-' || val === null) {
                val = 0
            }
            const { add, sub, abs } = this.$math
            const newData = [...this.dataSource]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                target[col] = val
                this.dataSource = newData
                // console.log('编辑室的本行数据', target)
                if (target.feeSponsor === null || target.feeSponsor === '' || target.feeSponsor === undefined) {
                    target.feeSponsor = '0.00'
                }
                target.oweFees = this.sumChangeM(sub(this.sumChangeS(target.fee), add(target.feeProfit, target.feeSponsor, 6), 6))
                if (Number(abs(add(target.feeProfit, target.feeSponsor, 6))) > Number(this.sumChangeS(target.fee))) {
                    if (col === 'feeProfit') {
                        target.oweFees = this.sumChangeM(sub(this.sumChangeS(target.fee), target.feeSponsor, 6))
                        target.feeProfit = 0
                    } else if (col === 'feeSponsor') {
                        target.oweFees = this.sumChangeM(sub(this.sumChangeS(target.fee), target.feeProfit, 6))
                        target.feeSponsor = 0
                    }
                    this.$message.warning('实收毛利核销费用与实收赞返核销费用之和不能大于应收费用！')
                }
                // 编辑时计算总计
                const arrX = []
                this.selectedRowKeys.forEach(i => {
                    const x = find(newData, (o) => { if (o.id === i) return o })
                    arrX.push(x)
                })

                const grossMarginCostArr = []
                const assistToReturnArr = []
                arrX.forEach(i => {
                    grossMarginCostArr.push(i.feeProfit)
                    assistToReturnArr.push(i.feeSponsor)
                })
                this.grossMarginCost = grossMarginCostArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.assistToReturn = assistToReturnArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
            }
        },
        sumChangeS (a) {
            return a.replace(/\￥\s?|(,*)/g, '')
        },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    }
}
</script>

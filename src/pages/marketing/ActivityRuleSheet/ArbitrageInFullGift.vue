<!--
 * @Description: 套购满赠
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-18 11:09:33
 * @LastEditors: lin
 * @LastEditTime: 2019-08-28 17:14:43
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
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :disContextMenu="disContextMenu"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增 编辑 弹框 -->
    <bt-modal
      :title="AddEditModalTitle"
      v-model="AddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="titleSet" style="">基础信息</a-row>
        <a-row class="">
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('ActivityRule.name', {initialValue:tableSingleData.name||''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">活动名称 </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item class="activeNameSet">
              <a-select
                ref="scheduleRef"
                placeholder="请选择活动名称"
                :open="false"
                style="width:85%"
                v-decorator="$check('ActivityRule.scheduleDefineId',{initialValue:tableSingleData.scheduleDefineId}) "
                :options="scheduleDefineIdDorpArr"
                allowClear>
              </a-select>
              <a href="javascript:;" @click="selectScheduleClick">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
            <!-- 活动名称 -->
            <activeRuleName :visible.sync="scheduleQuery" @onSelect="onStoreSchedule" :defaultSelect="ScheduleArr" :multiple="false"/>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeEffectRef"
                placeholder="请选择生效机构"
                mode="multiple"
                :maxTagCount="1"
                :open="false"
                style="width:85%"
                v-model="tempObjArrEffect"
                :options="effectStoreArr"
                :autoFocus="true"
                allowClear>
              </a-select>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
              <!-- 生效分店 -->
              <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledStartDate"
                @change="handleStartChange"
                v-decorator="$check('ActivityRule.startTime',{initialValue:tableSingleData.startTime||setStartTime})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledEndDate"
                @change="handleEndChange"
                v-decorator="$check('ActivityRule.endTime', {initialValue:tableSingleData.endTime||setEndTime})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">达标金额</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                placeholder="请输入达标金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('ActivityRule.standardAmount', {initialValue:tableSingleData.standardAmount||0},standardAmountHandler)"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" >与单品同时使用</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择"
                style="width:100%"
                v-decorator="$check('ActivityRule.ifSingle', {initialValue:tableSingleData.ifSingle})">
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">达标品类</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择达标品类"
                style="width:100%"
                :options="rateClassCountArr"
                v-decorator="$check('ActivityRule.rateClassCount', {initialValue:tableSingleData.rateClassCount||0})">
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('ActivityRule.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 商品列表 -->
      <div>
        <a-row class="titleSet" style="">商品列表</a-row>
        <!-- 详情表格上方按钮 -->
        <div>
          <a-button size="small" @click="addDetails" style="margin-bottom:5px">选择商品</a-button>
        </div>
        <div>
          <a-table
            rowKey="tb_web_id"
            :columns="tableColumns"
            size="small"
            bordered
            :pagination="false"
            :scroll="{ x: 1400}"
            :dataSource="detailTableData" >
            <template v-for="col in ['skuName','concatClass','concatBrand','reachUnitPrice','note']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <div v-if="col==='skuName'||col==='concatClass'||col==='concatBrand'">
                  <a-tooltip v-if="text&&text.length > 20" :key="text" :title="text">
                    <span>{{ `${text.slice(0, 20)}...` }}</span>
                  </a-tooltip>
                  <span v-else> {{ text }} </span>
                </div>
                <a-input-number
                  v-if="col === 'reachUnitPrice'"
                  style="margin: -5px 0; width:100%;"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputDetailDataChange(e, record.tb_web_id, col)" />
                <a-input
                  v-else-if="col === 'note'"
                  style="margin: -5px 0; width:100%;"
                  :value="text"
                  @change="e => InputDetailDataChange(e.target.value, record.tb_web_id, col)"/>
              </div>
            </template>
          </a-table>
        </div>
      </div>
      <!-- 赠品规则 -->
      <div>
        <a-row class="titleSet" style="margin-top:10px">赠品规则</a-row>
        <a-row>
          <a-button size="small" @click="giftGoodsQuery=true" style="margin-left:5px;margin-bottom:5px">选择赠品</a-button>
          <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteGiftDataRow(-1)">删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :columns="tableColumnsGift"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x: 1540 }"
          :dataSource="detailDataGift"
          :rowSelection="{selectedRowKeys: selectedRowKeysGift, onChange: onSelectChangeGift}" >
          <template v-for="col in ['skuName','reachAmount','note','skuQuantity','maxAmount','rateAmount','ifEffect']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <div v-if="col==='skuName'">
                <a-tooltip v-if="text&&text.length > 20" :key="text" :title="text">
                  <span>{{ `${text.slice(0,20)}...` }}</span>
                </a-tooltip>
                <span v-else> {{ text }} </span>
              </div>
              <a-input-number
                v-if="col === 'reachAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputGiftDataChange(e, record.skuCode, col)" />
              <a-input-number
                v-if="col === 'skuQuantity'"
                style="margin: -5px 0;width:100%;"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputGiftDataChange(e, record.skuCode, col)" />
              <a-input-number
                v-if="col === 'maxAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputGiftDataChange(e, record.skuCode, col)" />
              <a-input-number
                v-if="col === 'rateAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputGiftDataChange(e, record.skuCode, col)" />
              <a-select
                v-if="col === 'ifEffect'"
                style="width: 100%"
                placeholder="请选择是否有效"
                :value="text"
                @change="e => InputGiftDataChange(e, record.skuCode, col)">
                <a-select-option value="0">否</a-select-option>
                <a-select-option value="1">是</a-select-option>
              </a-select>
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputGiftDataChange(e.target.value, record.skuCode, col)"/>
            </div>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteGiftDataRow(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <!-- 落款信息 -->
      <a-form>
        <a-row class="titleSet" style="margin-top:10px">落款信息</a-row>
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeBy}-${defauilForm.makeName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.makeTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!--增加商品 -->
    <classBrandSku ref="classBrandSkuRef" :visible.sync="detailQuery" @onSelect="selectSku"></classBrandSku>
    <!-- 赠品选择器 -->
    <giftGoods
      :visible.sync="giftGoodsQuery"
      @onSelect="onSelectGiftGoods"
      isType="定值"
      :pams="{type: 'goods_type:1'}"
      multiple/>
    <!--  更改结束时间 -->
    <a-modal
      v-model="changeTimeModal"
      title="更改结束日期"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="300"
      style="top: 20px;"
      destroyOnClose
      centered>
      <div>
        <a-row>
          <a-col :span="6">结束日期</a-col>
          <a-col :span="18">
            <a-date-picker
              size="small"
              :disabledDate="disabledDateChange"
              v-model="changeTimeDate" />
          </a-col>
        </a-row>
      </div>
      <template slot="footer">
        <a-button key="back" size="small" @click="changeTimeModal=false">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          size="small"
          :loading="changeLoading"
          @click="submitChangeTime()">确定</a-button>
      </template>
    </a-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
import { uuid } from 'vue-uuid'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import activeRuleName from '../MarketingScheduleManagement/components/activeName'
import classBrandSku from './components/classBrandSku'
import giftGoods from './components/giftGoods'
import Preview from '@pages/marketing/ActivityRuleSheet/preview/ArbitrageInFullGiftPreview'
import store from '@comp/BasicQuery/store'
export default {
    name: 'ArbitrageInFullGift',
    components: { NewTable, SeachBox, BtModal, activeRuleName, store, classBrandSku, giftGoods, Preview },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
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
                    key: 'status',
                    type: 'select',
                    title: '审核状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'schedule_rule_define_status'
                    }
                },
                {
                    key: 'makeBy',
                    type: 'select',
                    title: '制单人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'defineName',
                    type: 'input',
                    title: '活动名称'
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                scheduleType: 'schedule_rule_define_schedule_type:6',
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值

            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'ArbitrageInFullGift.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'ArbitrageInFullGift.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'ArbitrageInFullGift.verify',
                    fc: this.auditHandler
                }, { name: '更改结束时间',
                    action: 'ArbitrageInFullGift.edit',
                    fc: this.changeTime
                }, { name: '终止活动',
                    action: 'ArbitrageInFullGift.edit',
                    fc: this.stopTime
                }, { name: '预览',
                    action: 'ArbitrageInFullGift.get',
                    fc: this.detailHandler
                }
            ],

            // 新增编辑弹框
            tags: ['uncheck'], // 单据状态
            AddEditModal: false,
            isAdd: false,
            // 新增编辑模态框头
            AddEditModalTitle: '',
            subLoading: false,
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                makeBy: `${this.$store.getters.code}`,
                makeName: `${this.$store.getters.name}`,
                makeTime: moment().format('YYYY-MM-DD HH:mm')
            },

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值
            // 活动 名称 弹框
            scheduleQuery: false,
            ScheduleArr: [],
            // 开始时间 ，结束时间
            startValue: moment(),
            endValue: moment().add(1, 'days'),
            startValueChoose: moment(),
            endValueChoose: moment().add(1, 'days'),

            // 商品列表
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'concatClass', align: 'center', width: 200, scopedSlots: { customRender: 'concatClass' } },
                { title: '品牌', dataIndex: 'concatBrand', align: 'center', width: 200, scopedSlots: { customRender: 'concatBrand' } },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 100 },
                { title: '单位', dataIndex: 'unit', align: 'center', width: 80 },
                { title: '达标单价（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 120, scopedSlots: { customRender: 'reachUnitPrice' } },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } }
            ],
            detailTableData: [],
            thisUuid: uuid.v1().replace(/-/g, ''),
            reachUnitPriceCB: '0', // 有品牌品类的分摊bilv
            noteCB: '',

            // 赠品规则表格
            tableColumnsGift: [
                { title: '序号', fixed: 'left', width: 80, align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '达标金额（元）', dataIndex: 'reachAmount', align: 'center', width: 120, scopedSlots: { customRender: 'reachAmount' } },
                { title: '赠品编码', dataIndex: 'skuCode', align: 'center', width: 120 },
                { title: '赠品名称', dataIndex: 'skuName', align: 'center', width: 200, scopedSlots: { customRender: 'skuName' } },
                { title: '类型', dataIndex: 'giftTypeName', align: 'center', width: 150 },
                { title: '赠品单价（元）', dataIndex: 'skuPrice', align: 'center', width: 120 },
                { title: '赠品数量', dataIndex: 'skuQuantity', align: 'center', width: 120, scopedSlots: { customRender: 'skuQuantity' } },
                { title: '赠品数量上限', dataIndex: 'maxAmount', align: 'center', width: 120, scopedSlots: { customRender: 'maxAmount' } },
                { title: '分担金额（元）', dataIndex: 'rateAmount', align: 'center', width: 120, scopedSlots: { customRender: 'rateAmount' } },
                { title: '是否有效', dataIndex: 'ifEffect', align: 'center', width: 120, scopedSlots: { customRender: 'ifEffect' } },
                { title: '备注说明', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', align: 'center', fixed: 'right', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            detailDataGift: [],
            selectedRowKeysGift: [],

            // 增加商品弹框
            detailQuery: false,

            giftGoodsQuery: false, // 赠品

            // 更改时间
            changeTimeModal: false,
            changeLoading: false,
            changeTimeDate: moment().startOf('day'),

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: [],
            applyByDorpArr: [], // 制单人
            scheduleDefineIdDorpArr: [], // 活动名称
            rateClassCountArr: [
                { title: '不限品类', value: 0, key: 0 },
                { title: '2个品类', value: 2, key: 2 },
                { title: '3个品类', value: 3, key: 3 },
                { title: '4个品类', value: 4, key: 4 },
                { title: '5个品类', value: 5, key: 5 },
                { title: '6个品类', value: 6, key: 6 }
            ]// 达标品类
        }
    },
    computed: {
        setStartTime () {
            return moment()
        },
        setEndTime () {
            return moment().add({ days: 1 })
        }
    },
    mounted () {
        this.seachValue.scheduleType = 'schedule_rule_define_schedule_type:6'
        this.$nextTick(() => {
            this.tableCode = 'ab1b581fe18f46d5aa963b148e4621e8:ArbitrageInFullGift'
            this.tableApiPath = 'ScheduRuleQueryScheduleRule'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
        this.getScheduleDefineIdDorpArr()
    },
    methods: {
    // 主表格搜索
    /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ScheduRuleQueryScheduleRule'
            this.seachValue.scheduleType = 'schedule_rule_define_schedule_type:6'
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
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ScheduRuleQueryScheduleRule')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduRuleQueryScheduleRule' })
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
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'schedule_rule_define_status:1') {
                this.disContextMenu = ['更改结束时间', '终止活动']
            } else if (tableRow.status === 'schedule_rule_define_status:3') {
                this.disContextMenu = ['编辑', '审核', '删除']
            } else if (tableRow.status === 'schedule_rule_define_status:2') {
                this.disContextMenu = ['编辑', '审核', '删除']
            } else {
                this.disContextMenu = ['编辑', '审核', '删除', '更改结束时间', '终止活动']
            }
        },
        /**
         * @name: 主表删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'schedule_rule_define_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduRuleDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 主表审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduRuleAudit', // 接口path名，必传
                        method: 'post',
                        body: {
                            ruleDefines: [{ id: autiData.id }]
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '新增套购满赠活动规则单'
                this.tableSingleData = { ifSingle: 1 }
                this.tempObjArrEffect = [] // 生效机构
                this.detailTableData = [] // 表格数据
                this.detailDataGift = [] // 表格数据
                this.$nextTick(() => {
                    this.startValueChoose = moment()
                    this.endValueChoose = moment().add(1, 'days')
                })
                this.startValue = moment()
                this.endValue = moment().add(1, 'days')

                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.makeBy = `${this.$store.getters.code}`
                this.defauilForm.makeName = `${this.$store.getters.name}`
                this.defauilForm.makeTime = moment().format('YYYY-MM-DD HH:mm')
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑套购满赠活动规则单'
                const obj = { ...addEditData }
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.makeBy = obj.makeBy
                this.defauilForm.makeName = obj.makeName
                this.defauilForm.makeTime = moment(obj.makeTime).format('YYYY-MM-DD HH:mm')
                this.startValue = obj.startTime = moment(obj.startTime)
                this.endValue = obj.endTime = moment(obj.endTime)
                const newObj = this.scheduleDefineIdDorpArr.filter(o => o.id === obj.scheduleDefineId)[0]
                if (newObj) {
                    this.$nextTick(() => {
                        this.endValueChoose = moment(newObj.endTime)
                        this.startValueChoose = moment(newObj.startTime)
                    })
                }
                if (!obj.storeCode) {
                    this.tempObjArrEffect = []
                } else {
                    obj.storeCode = obj.storeCode.split(',')
                    this.tempObjArrEffect = [...obj.storeCode]
                }
                this.tableSingleData = obj
                axios({
                    path: 'ScheduRuleQueryDetail',
                    methods: 'post',
                    body: {
                        ruleDefineId: addEditData.id,
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data.defineDetails]
                        const dataTow = [...res.data.ruleGifts]
                        data.forEach(item => {
                            item.tb_web_id = item.id
                        })
                        this.detailTableData = data
                        this.detailDataGift = dataTow
                    }
                })
            }
            this.AddEditModal = true
        },
        /**
         * @name: 弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const newData = [...this.detailTableData]
                    const newDataTow = [...this.detailDataGift]
                    if (newData.length === 0) {
                        return this.$message.error('请选择商品列表')
                    }
                    if (newDataTow.length === 0) {
                        return this.$message.error('请选择赠品商品列表')
                    }
                    for (const i of newDataTow) {
                        if (i.reachAmount < values.standardAmount) {
                            return this.$message.error('赠品商品列表的达标金额要大于等于基础信息的达标金额')
                        }
                    }
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                    }
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.scheduleType = 'schedule_rule_define_schedule_type:6'
                    values.storeCode = this.tempObjArrEffect.join(',')
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.detailSpans = newData
                    values.ruleGifts = newDataTow
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ScheduRuleAddScheduleRule' : 'ScheduRuleUpdateScheduleRule',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.subLoading = false
                        if (res.flag === 1) {
                            this.AddEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 活动名称
         * @msg:
         * @param {type}
         * @return:
         */
        selectScheduleClick () {
            this.scheduleQuery = true
            this.ScheduleArr = []
            this.$refs.scheduleRef.blur()
        },
        onStoreSchedule (mainArr) {
            const targetObj = this.scheduleDefineIdDorpArr.filter(o => o.id === mainArr[0].id)[0]
            if (targetObj) {
                this.form.setFieldsValue({
                    scheduleDefineId: targetObj.id,
                    startTime: moment(targetObj.startTime),
                    endTime: moment(targetObj.endTime)
                })
                this.endValue = moment(targetObj.endTime)
                this.startValue = moment(targetObj.startTime)
                this.endValueChoose = moment(targetObj.endTime)
                this.startValueChoose = moment(targetObj.startTime)
            }
        },
        /**
         * @name: 生效机构弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效机构
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 开始时间禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledStartDate (curent) {
            const form = this.form
            const activeName = form.getFieldValue('scheduleDefineId')
            if (!activeName) {
                return false
            }
            return moment(curent).isBefore(this.startValueChoose) || moment(curent).isAfter(this.endValueChoose)
        },
        /**
         * @name: 结束时间禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledEndDate (curent) {
            const form = this.form
            const activeName = form.getFieldValue('scheduleDefineId')
            if (!activeName) {
                return false
            }
            return moment(curent).isBefore(this.startValueChoose) || moment(curent).isAfter(this.endValueChoose)
        },
        handleStartChange (starttimeVal) {
            this.startValue = starttimeVal
        },
        handleEndChange (endtimeVal) {
            this.endValue = endtimeVal
        },
        /**
         * @name: 达标金额校验
         * @msg:
         * @param {type}
         * @return:
         */
        standardAmountHandler (rule, value, callback) {
            if (value === 0) {
                const str = '输入的金额不能为0'
                callback(str)
            } else {
                callback()
            }
        },
        /**
         * @name: 有效期时间的禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateOrder (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputDetailDataChange (val, count, key) {
            const newData = [...this.detailTableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (key === 'reachUnitPrice') {
                    target[key] = val || 0
                } else {
                    target[key] = val
                }
                this.detailTableData = newData
            }
        },
        /**
         * @name: 商品列表新增
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            const tableDataArr = [...this.detailTableData]
            const obj = {
                categoryTagArr: [],
                brandTagArr: [],
                tableData: []
            }
            this.rateProviderOneCB = '0'
            this.noteCB = ''
            if (tableDataArr.length > 0) {
                const skuTableArr = tableDataArr.filter(o => o.concatSku)
                obj.tableData = [...skuTableArr]
                const target = tableDataArr[0]
                // console.log(target)
                if (target.concatClass && !target.concatSku) {
                    obj.categoryTagArr = target.concatClass.split(',')
                    this.reachUnitPriceCB = target.reachUnitPrice
                    this.noteCB = target.note
                }
                if (target.concatBrand && !target.concatSku) {
                    obj.brandTagArr = target.concatBrand.split(',')
                    this.reachUnitPriceCB = target.reachUnitPrice
                    this.noteCB = target.note
                }
            }
            // console.log(obj)
            this.$refs.classBrandSkuRef.getDataArr(obj)
            this.detailQuery = true
        },
        /**
         * @name:商品明细选择
         * @msg:
         * @param {type}
         * @return:
         */
        selectSku (obj) {
            const tableDataArr = []
            if (obj.categoryTagArr.length !== 0 || obj.brandTagArr.length !== 0) {
                tableDataArr.push({
                    concatClass: obj.categoryTagArr.join(','),
                    concatBrand: obj.brandTagArr.join(','),
                    reachUnitPrice: this.reachUnitPriceCB,
                    concatSku: '',
                    skuCode: '',
                    skuName: '',
                    skuModel: '',
                    unit: '',
                    skuPrice: '',
                    note: this.noteCB,
                    tb_web_id: uuid.v1().replace(/-/g, '')
                })
            }
            if (obj.tableData.length !== 0) {
                obj.tableData.forEach(item => {
                    tableDataArr.push({
                        concatSku: `${item.skuCode}-${item.skuName}`,
                        concatClass: item.concatClass,
                        concatBrand: item.concatBrand,
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        unit: item.unit,
                        skuPrice: item.skuPrice,
                        skuModel: item.skuModel,
                        className: item.className,
                        brandName: item.brandName,
                        reachUnitPrice: item.reachUnitPrice,
                        note: item.note,
                        tb_web_id: uuid.v1().replace(/-/g, '')

                    })
                })
            }
            this.detailTableData = [...tableDataArr]
        },
        /**
         * @name: 赠品规则选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChangeGift (key, Row) {
            this.selectedRowKeysGift = key
        },
        /**
         * @name: 赠品详情表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputGiftDataChange (val, keyID, key) {
            const newData = [...this.detailDataGift]
            const target = newData.filter(o => o.skuCode === keyID)[0]
            if (target) {
                if (key === 'reachAmount' || key === 'rateAmount') {
                    target[key] = val || 0
                } else if (key === 'skuQuantity' || key === 'maxAmount') {
                    target[key] = val || 1
                } else {
                    target[key] = val
                }
                this.detailDataGift = newData
            }
        },
        /**
         * @name: 赠品详情表格删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteGiftDataRow (keyId) {
            if (keyId === -1) {
                const deleteData = [...this.detailDataGift]
                for (const i in this.selectedRowKeysGift) {
                    for (const j in deleteData) {
                        if (deleteData[j].skuCode === this.selectedRowKeysGift[i]) {
                            deleteData.splice(j, 1)
                        }
                    }
                }
                this.detailDataGift = deleteData
            } else {
                const newData = [...this.detailDataGift]
                this.detailDataGift = newData.filter(o => o.skuCode !== keyId)
            }
        },
        /**
         * @name: 赠品选择器选择提交
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectGiftGoods (giftGoodsArr) {
            const newData = [...this.detailDataGift]
            const error = []
            console.log('pic', giftGoodsArr)
            giftGoodsArr.forEach(item => {
                const has = newData.filter(o => o.skuCode === item.skuCode)
                if (has.length === 0) {
                    this.detailDataGift.push({
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        classCode: item.classCode,
                        brandCode: item.brandCode,
                        giftType: item.type === 'goods_type:1' ? 'schedule_rule_gifts_gift_type:3' : 'schedule_rule_gifts_gift_type:2',
                        giftTypeName: item.typeConfig,
                        skuPrice: item.skuPrice,
                        skuQuantity: 1,
                        maxAmount: 1,
                        reachAmount: 0,
                        rateAmount: 0,
                        ifEffect: '1',
                        picture: item.pic,
                        note: ''
                    })
                } else {
                    error.push(item.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-商品已经添加过了`
                })
            }
        },
        /**
         * @name:  生效机构
         * @msg:
         * @param {type}
         * @return:
         */
        getEffectStoreArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = `${i.code}:${i.name}`
                        i.title = `${i.code}--${i.name}`
                        i.value = i.code
                    })
                    this.effectStoreArr = [...data]
                }
            })
        },
        /**
         * @name:  活动名称
         * @msg:
         * @param {type}
         * @return:
         */
        getScheduleDefineIdDorpArr () {
            axios({
                path: 'ScheduDefineQuery',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = `${i.code}:${i.name}`
                        i.title = `${i.code}--${i.name}`
                        i.value = i.id
                    })
                    this.scheduleDefineIdDorpArr = [...data]
                }
            })
        },
        /**
         * @name: 更改结束日期禁止
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateChange (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        changeTime () {
            this.changeTimeModal = true
            this.changeTimeDate = moment(this.tableSingleData.endTime)
        },
        /**
         * @name: 确定
         */
        submitChangeTime () {
            if (!this.changeTimeDate) {
                return this.$message.error('请选择更改的结束日期')
            }
            this.changeLoading = true
            axios({
                path: 'ScheduRuleExtended', // 接口path名，必传
                method: 'post',
                body: {
                    ruleDefines: [
                        { id: this.tableSingleData.id, endTime: this.changeTimeDate.format('YYYY-MM-DD') }
                    ]
                }
            }).then(res => {
                this.changeLoading = false
                if (res.flag === 1) {
                    this.reLoadTableData()
                    this.changeTimeModal = false
                }
            })
        },
        /**
         * @name: 终止活动
         * @msg:
         * @param {type}
         * @return:
         */
        stopTime (timeStopP) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '确定选中项终止？终止将不可恢复',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduRuleTermination', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: [timeStopP.id]
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
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'ArbitrageInFullGift') {
                this.getEffectStoreArr()
                this.getScheduleDefineIdDorpArr()
            }
        },
        'seachValue.startTime' (val, oldVal) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val, oldVal) {
            if (val && this.seachValue.startTime) {
                if (moment(val).isBefore(this.seachValue.startTime)) {
                    this.seachValue.startTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        startValue (val) {
            if (val && this.endValue) {
                if (val.isAfter(this.endValue)) {
                    this.form.setFieldsValue({
                        endTime: moment(val)
                    })
                }
            }
        },
        endValue (val) {
            if (val && this.startValue) {
                if (val.isBefore(this.startValue)) {
                    this.form.setFieldsValue({
                        startTime: moment(val)
                    })
                }
            }
        }
    }
}
</script>
<style lang="less">
.activeNameSet .ant-select-arrow svg{
    display:none;
}
</style>
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

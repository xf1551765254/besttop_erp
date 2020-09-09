<!--
 * @Description: 用卷规则单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 11:01:00
 * @LastEditTime: 2019-07-03 11:19:11
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
          icon="calendar"
          @click="changeTime('isM')">更改结束时间</a-button>
        <a-button
          type="primary"
          v-action:edit
          size="small"
          style="margin-right:10px"
          icon="stop"
          @click="stopTime('isM')">终止活动</a-button>
        <a-button
          type="primary"
          v-action:verify
          size="small"
          icon="audit"
          @click="auditHandler('isM')">审核</a-button>
      </div>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 单据 -->
    <bt-modal
      :title="VouchersRulesTitle"
      v-model="AddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">制单位置 </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="effectStoreArr"
                disabled
                v-decorator="$check('VounchersRule.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">活动名称 </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item class="activeNameSet">
              <a-select
                ref="scheduleRef"
                style="width:85%"
                :open="false"
                v-decorator="$check('VounchersRule.scheduleDefineId',{initialValue:tableSingleData.scheduleDefineId}) "
                :options="scheduleDefineIdDorpArr"
                allowClear/>
              <a href="javascript:;" @click="selectScheduleClick">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
            <!-- 活动名称 -->
            <activeRuleName :visible.sync="scheduleQuery" @onSelect="onStoreSchedule" :defaultSelect="ScheduleArr" :multiple="false"/>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">金额是否可修改 </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择"
                style="width:100%"
                allowClear
                v-decorator="$check('VounchersRule.isChange', {initialValue:tableSingleData.isChange||'0'})">
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDateStart"
                @change="changeDataStartTime"
                v-decorator="$check('VounchersRule.startTime',{initialValue:tableSingleData.startTime||setStartTime})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="disabledDateEnd"
                @change="changeDataEndTime"
                v-decorator="$check('VounchersRule.endTime', {initialValue:tableSingleData.endTime||setEndTime})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效分店 </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeEffectRef"
                mode="multiple"
                :maxTagCount="1"
                :open="false"
                style="width:90%"
                v-model="tempObjArrEffect"
                :options="effectStoreArr"
                allowClear/>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:10%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
            <!-- 生效分店 -->
            <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button size="small" @click="addDetail" style="margin-bottom:5px">新增</a-button>
        <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格  -->
      <div class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumns"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x: 1470 }"
          :dataSource="VouchersActiveData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
          <template
            v-for="col in ['rateAmount','maxAmount','reachUnitPrice','rateProvider']"
            :slot="col"
            slot-scope="text, record,index">
            <div :key="col">
              <a-input-number
                v-if="col === 'rateProvider'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :value="text"
                :formatter="value => `${value}`"
                :parser="value => value"
                :precision="2"
                @change="e => tableSoltChange(e, record.tb_web_id, col)"
              />
              <a-input-number
                v-else-if="col === 'rateAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="record.maxAmount"
                :precision="2"
                :step="1"
                :value="text"
                @change="e => tableSoltChange(e, record.tb_web_id, col)"
              />
              <a-input-number
                v-else-if="col === 'maxAmount'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                :value="text"
                @change="e => tableSoltChange(e, record.tb_web_id, col)"
              />
              <a-input-number
                v-else-if="col === 'reachUnitPrice'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                :value="text"
                @change="e => tableSoltChange(e, record.tb_web_id, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.tb_web_id)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <a-divider dashed />
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-select
                disabled
                style="width: 100%"
                :options="applyByDorpArr"
                v-decorator="$check('VounchersRule.makeBy',{initialValue:tableSingleData.createBy||`${this.$store.getters.code}`})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-date-picker
                disabled
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                v-decorator="$check('VounchersRule.createTime', {initialValue:tableSingleData.createTime ||setMakeTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-select
                disabled
                style="width: 100%"
                :options="applyByDorpArr"
                v-decorator="$check('VounchersRule.auditBy',{initialValue:tableSingleData.auditBy})"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3"> 审核时间 </a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-date-picker
                placeholder=""
                format="YYYY-MM-DD HH:mm:ss"
                disabled
                style="width: 100%"
                v-decorator="$check('VounchersRule.auditTime', {initialValue:tableSingleData.auditTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row >
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('VounchersRule.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 商品 用卷规则设置 -->
    <a-modal
      v-model="GoodsSetingModal"
      class="doc"
      title="用卷规则设置"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      style="top: 20px;"
      wrapClassName="setDocCss"
      destroyOnClose
      centered>
      <a-form :form="formGoodsSet">
        <a-row class="doc">
          <a-col :span="4">达标金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入达标金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('VounchersRule.reachUnitPrice', {initialValue:0})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">使用金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入使用金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('VounchersRule.rateAmount', {initialValue:0})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">上限金额</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入上限金额"
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                @change="e=>this.maxAmountValue=Number(e)"
                v-decorator="$check('VounchersRule.maxAmount', {initialValue:0})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">分摊比率</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                placeholder="请输入分摊比率"
                style="width:100%;"
                :min="0"
                :max="100"
                :step="1"
                :precision="2"
                v-decorator="$check('VounchersRule.rateProvider', {initialValue:0})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <div>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="categoryQuery=true">品类选择</a-button>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="brandQuery=true">品牌选择</a-button>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="brandCategoryQuery=true">品类品牌选择</a-button>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="setGoodsQuery=true">商品选择</a-button>
      </div>
      <div class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumnsGoodsSet"
          size="small"
          bordered
          :pagination="{defaultPageSize:7,hideOnSinglePage:true}"
          :scroll="{ x: 750 }"
          :dataSource="DataGoodsSet"
        ></a-table>
      </div>
      <template slot="footer">
        <a-button @click="GoodsSetingModal=false">关闭</a-button>
        <a-button key="submit" type="primary" @click="handleGoodsSetSubmit">确定</a-button>
      </template>
      <!-- 品类 -->
      <category :visible.sync="categoryQuery" @onSelect="onSelectCategory" multiple :pams="{level: 2}"/>
      <!--  品牌 -->
      <brand :visible.sync="brandQuery" @onSelect="onSelectbrand" multiple/>
      <!-- 品类  品牌 -->
      <brandCategory :visible.sync="brandCategoryQuery" @onSelect="onSelectBrandCategory" multiple/>
      <!-- 商品 -->
      <setGoods :visible.sync="setGoodsQuery" @onSelect="onSelectSetGoods" multiple/>
    </a-modal>
    <!-- 更改时间 弹框 -->
    <a-modal
      v-model="changeTimeModal"
      title="更改结束时间"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="300"
      style="top: 20px;"
      destroyOnClose
      centered>
      <div>
        <a-row>
          <a-col :span="6">结束时间</a-col>
          <a-col :span="16">
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
          v-if="isChangeM"
          :loading="changeLoading"
          @click="submitChangeTime('isM')">确定</a-button>
        <a-button
          key="submit"
          type="primary"
          size="small"
          v-if="!isChangeM"
          :loading="changeLoading"
          @click="submitChangeTime()">确定</a-button>
      </template>
    </a-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang='less'>
 @import "../../../assets/modalStyle.less";
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        margin: 0 10px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
    .activeNameSet .ant-select-arrow svg{
        display:none;
    }
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
</style>
<script>
// import { mapGetters } from 'vuex'
import store from '@comp/BasicQuery/store'
import activeRuleName from './components/activeName'
import category from '@comp/BasicQuery/category'
import brandCategory from './components/brandCategory'
import brand from '@comp/BasicQuery/brand'
import setGoods from './components/goods'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/vouchersActivityRulesPreview'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
export default {
    name: 'VouchersActivityRules',
    components: { NewTable, SeachBox, store, activeRuleName, category, brand, brandCategory, setGoods, BtModal, Preview },
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
                    key: 'makeBy',
                    type: 'input',
                    title: '制单人'
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
                    key: 'defineName',
                    type: 'input',
                    title: '活动名称'
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'VouchersActivityRules.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'VouchersActivityRules.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'VouchersActivityRules.verify',
                    fc: this.auditHandler
                }, { name: '更改结束时间',
                    action: 'VouchersActivityRules.edit',
                    fc: this.changeTime
                }, { name: '终止活动',
                    action: 'VouchersActivityRules.edit',
                    fc: this.stopTime
                }, { name: '预览',
                    action: 'VouchersActivityRules.get',
                    fc: this.detailHandler
                }
            ],
            // 选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],

            //  单据
            tags: ['uncheck'], // 单据状态
            AddEditModal: false,
            VouchersRulesTitle: '',
            subLoading: false,
            isAdd: false,
            // 单据 表单
            form: this.$form.createForm(this),

            disabledDateString: moment(), // 开始时间的值
            defaultStartTime: moment(), // 开始时间的默认值
            endTimeData: moment().add({ days: 1 }), // 结束时间的值
            defaultEndTime: moment().add({ days: 1 }), // 结束时间按的默认值
            storeQueryEffect: false, // 生效分店
            tempObjArrEffect: [], // 选中的值
            // 活动 名称
            scheduleQuery: false,
            ScheduleArr: [],

            // 单据 表格
            tableColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 100 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 150 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 150 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '使用金额（元）', dataIndex: 'rateAmount', align: 'center', width: 100, scopedSlots: { customRender: 'rateAmount' } },
                { title: '上限金额（元）', dataIndex: 'maxAmount', align: 'center', width: 100, scopedSlots: { customRender: 'maxAmount' } },
                { title: '达标金额（元）', dataIndex: 'reachUnitPrice', align: 'center', width: 100, scopedSlots: { customRender: 'reachUnitPrice' } },
                { title: '分摊比率（%）', dataIndex: 'rateProvider', align: 'center', width: 100, scopedSlots: { customRender: 'rateProvider' } },
                { title: '操作', key: 'operation', fixed: 'right', align: 'center', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            VouchersActiveData: [], // 表体
            selectedRowKeys: [], // 选中的值
            selectedRows: [], // 选中的值
            delIdArr: [], // 单据删除的id

            // 明细 商品 增加
            GoodsSetingModal: false,
            formGoodsSet: this.$form.createForm(this),
            tableColumnsGoodsSet: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类编码', dataIndex: 'classCode', align: 'center', width: 100 },
                { title: '品类名称', dataIndex: 'className', align: 'center', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', align: 'center', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', align: 'center', width: 100 },
                { title: '商品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: '商品名称', dataIndex: 'skuName', align: 'center', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 }
            ],
            DataGoodsSet: [],
            count: 0,
            maxAmountValue: 0, //  上限金额
            // 选择器
            categoryQuery: false, // 品类
            brandQuery: false, // 品牌
            brandCategoryQuery: false, // 品类 品牌
            setGoodsQuery: false, // 商品

            // 更改时间
            changeTimeModal: false,
            changeLoading: false,
            isChangeM: false,
            changeTimeDate: moment(),

            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            effectStoreArr: [],
            applyByDorpArr: [], // 制单人
            // 活动名成
            scheduleDefineIdDorpArr: []
        }
    },
    computed: {
        setStartTime () {
            return this.defaultStartTime
        },
        setEndTime () {
            return this.defaultEndTime
        },
        setMakeTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'a028b9d112194e31ab502d9dbb25790f:VouchersActivityRules'
            this.tableApiPath = 'ScheduRuleQueryVouchers'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
        this.getApplyByDorpArr()
        this.getScheduleDefineIdDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            if (typeof (e.endTime) === 'object') {
                e.endTime = e.endTime.startOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
            if (typeof (e.startTime) === 'object') {
                e.startTime = e.startTime.startOf('day').format('YYYY-MM-DD HH:mm:ss')
            }
            e.path = 'ScheduRuleQueryVouchers'
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
                this.$refs.newTable.exportFile('ScheduRuleQueryVouchers')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduRuleQueryVouchers' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(this.tableSingleData)
            if (tableRow.status === 'schedule_rule_define_status:1') {
                this.disContextMenu = ['更改结束时间', '终止活动']
            } else if (tableRow.status === 'schedule_rule_define_status:3' || tableRow.status === 'schedule_rule_define_status:2') {
                this.disContextMenu = ['编辑', '审核', '删除']
            } else {
                this.disContextMenu = ['编辑', '审核', '删除', '更改结束时间', '终止活动']
            }
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
         * @name: 删除
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
         * @name: 审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            const _this = this
            const arr = []
            if (autiData === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要更改的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'schedule_rule_define_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                _this.tableIdsArr.forEach(item => {
                    const newObj = {
                        id: item
                    }
                    arr.push(newObj)
                })
            } else {
                arr.push({ id: autiData.id })
            }
            _this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    // console.log(autiData)
                    axios({
                        path: 'ScheduRuleAudit', // 接口path名，必传
                        method: 'post',
                        body: { 'ruleDefines': arr }
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
         * @name: 更改结束时间
         * @msg:
         * @param {type}
         * @return:
         */
        changeTime (e) {
            // console.log(1233)
            this.changeTimeDate = moment()
            if (e === 'isM') {
                this.isChangeM = true
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要更改的列表')
                } else {
                    const changeArr = []
                    this.tableRowsArr.forEach(item => {
                        if (item.status === 'schedule_rule_define_status:1' || item.status === 'schedule_rule_define_status:4' || item.status === 'schedule_rule_define_status:5') {
                            changeArr.push(item)
                        }
                    })
                    if (changeArr.length > 0) {
                        this.$message.warning('只有已生效和已审核状态的列表可以进行此操作')
                        return
                    }
                    this.changeTimeModal = true
                }
            } else {
                this.isChangeM = false
                this.changeTimeModal = true
            }
        },
        submitChangeTime (timeP) {
            // console.log(timeP)
            const arr = []
            const _this = this
            if (timeP === 'isM') {
                _this.tableIdsArr.forEach(item => {
                    const newObj = { id: item, endTime: _this.changeTimeDate.startOf('day').format('YYYY-MM-DD') }
                    arr.push(newObj)
                })
            } else {
                arr.push({ id: _this.tableSingleData.id, endTime: _this.changeTimeDate.startOf('day').format('YYYY-MM-DD') })
            }
            this.changeLoading = true
            // console.log('LINTIME', arr)
            axios({
                path: 'ScheduRuleExtended', // 接口path名，必传
                method: 'post',
                body: {
                    ruleDefines: arr
                }
            }).then(res => {
                this.changeLoading = false
                if (res.flag === 1) {
                    _this.changeTimeModal = false
                    _this.reLoadTableData()
                }
            })
        },
        /**
         * @name: 更改时间提交
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateChange (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 终止操作
         * @msg:
         * @param {type}
         * @return:
         */
        stopTime (timeStopP) {
            let arr = []
            const _this = this
            if (timeStopP === 'isM') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要更改的列表')
                    return
                } else {
                    const changeArr = []
                    this.tableRowsArr.forEach(item => {
                        if (item.status === 'schedule_rule_define_status:1' || item.status === 'schedule_rule_define_status:4' || item.status === 'schedule_rule_define_status:5') {
                            changeArr.push(item)
                        }
                    })
                    if (changeArr.length > 0) {
                        this.$message.warning('只有已生效和已审核状态的列表可以进行此操作')
                        return
                    }
                    arr = this.tableIdsArr
                }
            } else {
                arr.push(timeStopP.id)
            }
            // console.log(arr)
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
                            ids: arr
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
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.AddEditModal = true
            if (addEditData === -1) {
                this.$nextTick(() => {
                    this.disabledDateString = moment()
                    this.defaultStartTime = moment()
                })
                this.tempObjArrEffect = []
                this.tableSingleData = {}
                this.VouchersActiveData = []
                this.isAdd = true
                this.VouchersRulesTitle = '新增用券规则单'
            } else {
                const { mul } = this.$math
                this.delIdArr = []
                this.isAdd = false
                this.VouchersRulesTitle = '编辑用券规则单'
                const obj = { ...addEditData }
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                obj.createTime = moment(obj.createTime)
                this.$nextTick(() => {
                    if (moment().isBefore(obj.startTime)) {
                        this.disabledDateString = obj.startTime
                    }
                    const newObj = this.scheduleDefineIdDorpArr.filter(o => o.id === obj.scheduleDefineId)[0]
                    if (newObj) {
                        if (moment().isBefore(newObj.startTime)) {
                            this.defaultStartTime = moment(newObj.startTime)
                        } else {
                            this.defaultStartTime = moment()
                        }
                    }
                })
                if (!obj.storeCode) {
                    obj.storeCode = []
                } else {
                    obj.storeCode = obj.storeCode.split(',')
                }
                this.endTimeData = obj.endTime
                this.tableSingleData = obj
                this.tempObjArrEffect = [...obj.storeCode]
                axios({
                    path: 'ScheduRuleQueryDetail',
                    method: 'post',
                    body: {
                        ruleDefineId: addEditData.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        // console.log(res)
                        const tableData = [...res.data.defineDetails]
                        for (const i of tableData) {
                            i.rateProvider = mul(i.rateProvider, 100, 2)
                            if (i.classCode && i.brandCode) {
                                i.keyCode = i.classCode + i.brandCode
                            } else if (i.classCode && !i.brandCode) {
                                i.keyCode = i.classCode
                            } else if (!i.classCode && i.brandCode) {
                                i.keyCode = i.brandCode
                            } else {
                                i.keyCode = i.skuCode
                            }
                            i.tb_web_id = i.id
                        }
                        this.VouchersActiveData = tableData
                    }
                })
            }
        },
        // 单据 关闭
        formCancel () {
            this.AddEditModal = false
        },
        /**
         * @name: 开始时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateStart (curent) {
            return moment(curent).isBefore(this.defaultStartTime.startOf('day'))
        },
        /**
         * @name: 开始时间变化
         * @msg:
         * @param {type}
         * @return:
         */
        changeDataStartTime (data, dataString) {
            // console.log(dataString)
            this.disabledDateString = dataString
        },
        /**
         * @name:结束时间禁止
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateEnd (curent) {
            // console.log(this.stateTime)
            return moment(curent).isBefore(moment(this.disabledDateString).startOf('day'))
        },
        /**
         * @name: 结束时间
         * @msg:
         * @param {type}
         * @return:
         */
        changeDataEndTime (endtimeVal, endtimeValString) {
            this.endTimeData = endtimeValString
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelectEffect (arr) {
            // const newarr = [...this.tempObjArrEffect]
            this.tempObjArrEffect = [...map(arr, 'code')]

            // this.tempObjArrEffect = [...new Set([...newarr, ...map(arr, 'code')])] // 将门店选择器选中的项目显示在选择框中
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
            if (mainArr.length === 1) {
                const targetObj = mainArr[0]
                this.form.setFieldsValue({
                    scheduleDefineId: targetObj.id
                })
                // 默认值
                if (moment().isAfter(moment(targetObj.startTime))) {
                    // console.log(targetObj.startTime)
                    this.defaultStartTime = moment()
                    this.disabledDateString = moment()
                } else {
                    // console.log(targetObj.startTime)
                    this.defaultStartTime = moment(targetObj.startTime)
                    this.disabledDateString = moment(targetObj.startTime)
                }
                if (moment().isAfter(moment(targetObj.endTime))) {
                    this.defaultEndTime = moment()
                } else {
                    this.defaultEndTime = moment(targetObj.endTime)
                }
            }
        },
        /**
         * @name:  生效分店 制单位置
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
                    const data = res.data
                    // console.log(data)
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
         * @name: 制单人
         * @msg:
         * @param {type}
         * @return:
         */
        getApplyByDorpArr () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.applyByDorpArr = dataArr
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
                    // console.log('活动名称', data)
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
         * @name:  明细删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.VouchersActiveData]
                const hasIdArr = map(this.selectedRows, 'id')
                if (hasIdArr.length > 0) {
                    hasIdArr.forEach(item => {
                        this.delIdArr.push(item)
                    })
                }
                // console.log(this.delIdArr)
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.VouchersActiveData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.VouchersActiveData]
                this.VouchersActiveData = newData.filter(item => item.tb_web_id !== keyId)
                const selectId = newData.filter(item => item.tb_web_id === keyId)[0]
                // console.log(selectId)
                if (selectId.id) {
                    this.delIdArr.push(selectId.id)
                }
                // console.log(this.delIdArr)
            }
        },
        /**
         * @name: 表格选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = selectKeys
            this.selectedRows = selectRows
        },
        /**
         * @name: 明细单行编辑
         * @msg:
         * @param {type}
         * @return:
         */
        tableSoltChange (val, count, key) {
            const newData = [...this.VouchersActiveData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                // console.log(val, count, key, '监听')
                if (!val) {
                    console.log('123')
                    target[key] = 0
                } else {
                    target[key] = val
                }
                this.VouchersActiveData = newData
            }
        },
        /**
         * @name: 单击提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            const _this = this
            const { div } = this.$math
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!_this.isAdd) {
                        values.id = _this.tableSingleData.id
                        values.effectType = _this.tableSingleData.effectType
                    };
                    if (_this.VouchersActiveData.length === 0) {
                        _this.$message.warning('您没有增加明细')
                    } else {
                        const tableData = [..._this.VouchersActiveData]
                        tableData.forEach(item => {
                            item.rateProvider = div(item.rateProvider, 100, 4)
                        })
                        values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                        values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                        values.createTime = values.createTime.format('YYYY-MM-DD HH:mm:ss')
                        values.storeCode = _this.tempObjArrEffect.join(',')
                        values.ids = _this.delIdArr
                        values.detailSpans = tableData
                        _this.subLoading = true
                        axios({
                            path: _this.isAdd ? 'ScheduRuleAddVouchers' : 'ScheduRuleUpdateScheduleRule',
                            method: 'post',
                            body: values
                        }).then(res => {
                            _this.subLoading = false
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                                _this.AddEditModal = false
                            }
                        })
                    }
                } else {
                    _this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 明细  规则活动设置
        formCancelGoodsSet () {
            this.GoodsSetingModal = false
        },
        /**
         * @name: 规则活动提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleGoodsSetSubmit (e) {
            e.preventDefault()
            const { formGoodsSet: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const error = []
                    this.DataGoodsSet.forEach(item => {
                        const has = this.VouchersActiveData.filter(o => o.keyCode === item.keyCode)
                        if (has.length === 0) {
                            this.VouchersActiveData.push({
                                classCode: item.classCode,
                                className: item.className,
                                brandCode: item.brandCode,
                                brandName: item.brandName,
                                skuCode: item.skuCode,
                                skuName: item.skuName,
                                skuModel: item.skuModel,
                                rateAmount: values.rateAmount,
                                maxAmount: values.maxAmount,
                                reachUnitPrice: values.reachUnitPrice,
                                rateProvider: values.rateProvider,
                                keyCode: item.keyCode,
                                tb_web_id: item.tb_web_id
                            })
                        } else {
                            error.push(item.className)
                        }
                    })
                    if (error.length > 0) {
                        this.$notification.error({
                            message: '提示',
                            description: `有${error.length}项添加失败，已经添加过了`
                        })
                    }
                    this.GoodsSetingModal = false
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 用卷规则 设置打开
         * @msg:
         * @param {type}
         * @return:
         */
        addDetail () {
            this.GoodsSetingModal = true
            this.DataGoodsSet = []
        },
        // 选择器
        /**
         * @name: 品类 选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectCategory (categoryArr) {
            const newData = [...this.DataGoodsSet]
            const error = []
            categoryArr.forEach(item => {
                const has = newData.filter(o => o.category_code === item.code)
                if (has.length === 0) {
                    this.DataGoodsSet.push({
                        classCode: item.code,
                        className: item.name,
                        category_code: item.code,
                        brand_code: '',
                        category_brand_code: '',
                        skuCode: '',
                        brandCode: '',
                        brandName: '',
                        skuModel: '',
                        skuName: '',
                        keyCode: item.code,
                        tb_web_id_set: this.count++,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品类已经添加过了`
                })
            }
            // console.log(this.DataGoodsSet)
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectbrand (brandArr) {
            const newData = [...this.DataGoodsSet]
            const error = []
            brandArr.forEach(item => {
                const has = newData.filter(o => o.category_code === item.code)
                if (has.length === 0) {
                    this.DataGoodsSet.push({
                        classCode: '',
                        className: '',
                        category_code: item.code,
                        brand_code: '',
                        category_brand_code: '',
                        skuCode: '',
                        brandCode: item.code,
                        brandName: item.name,
                        skuModel: '',
                        skuName: '',
                        keyCode: item.code,
                        tb_web_id_set: this.count++,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品牌已经添加过了`
                })
            }
        },
        /**
         * @name: 品类 品牌 选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectBrandCategory (brandCategoryArr) {
            const newData = [...this.DataGoodsSet]
            const error = []
            brandCategoryArr.forEach(item => {
                const has = newData.filter(o => o.category_brand_code === item.id)
                if (has.length === 0) {
                    this.DataGoodsSet.push({
                        classCode: item.classCode,
                        className: item.className,
                        category_code: '',
                        brand_code: '',
                        category_brand_code: item.id,
                        skuCode: '',
                        brandCode: item.brandCode,
                        brandName: item.brandName,
                        skuModel: '',
                        skuName: '',
                        keyCode: item.classCode + item.brandCode,
                        tb_web_id_set: this.count++,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.classCode + '+' + item.brandCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品类品牌已经添加过了`
                })
            }
        },
        /**
         * @name: 商品选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectSetGoods (SetGoodsArr) {
            const newData = [...this.DataGoodsSet]
            const error = []
            SetGoodsArr.forEach(item => {
                const has = newData.filter(o => o.skuCode === item.skuCode)
                if (has.length === 0) {
                    this.DataGoodsSet.push({
                        classCode: item.classCode,
                        className: item.className,
                        category_code: '',
                        brand_code: '',
                        category_brand_code: '',
                        skuCode: item.skuCode,
                        brandCode: item.brandCode,
                        brandName: item.brandName,
                        skuModel: item.skuModel,
                        skuName: item.skuName,
                        keyCode: item.skuCode,
                        tb_web_id_set: this.count++,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.skuCode)
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
            if (to === 'VouchersActivityRules') {
                this.getEffectStoreArr()
                this.getApplyByDorpArr()
                this.getScheduleDefineIdDorpArr()
            }
        },
        disabledDateString (val, oldval) {
            if (val) {
                if ((moment(val)).isAfter(this.endTimeData)) {
                    // console.log('shijian ', 123)
                    this.form.setFieldsValue({
                        endTime: moment(val)
                    })
                }
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
        }
    }

}
</script>

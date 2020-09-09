<!--
 * @Description: 商品盘点单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 11:01:00
 * @LastEditTime: 2019-08-20 14:29:54
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
      v-model="addEditModel"
      :title="ProductAddEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <a-form :form="form">
        <a-row class="setDocCss">
          <!-- <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                disabled
                v-decorator="$check('ProductInventory.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">盘点人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择盘点人"
                style="width: 100%"
                :options="makeByDropArr"
                @search="handleApplyByDorpArr"
                :filterOption="false"
                v-decorator="$check('ProductInventory.stocktakingBy',{initialValue:tableSingleData.stocktakingBy})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">盘点日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDate"
                v-decorator="$check('ProductInventory.stocktakingTime', {initialValue:tableSingleData.stocktakingTime||setStocktakingTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :rows="2"
                v-decorator="$check('ProductInventory.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-row style="margin:0 5px" type="flex" justify="space-between">
          <a-col>
            <a-button size="small" @click="goodsQuery = true" style="margin-bottom:5px">新增</a-button>
            <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
          </a-col>
        </a-row>
      </div>
      <div class="table-nowrap">
        <a-table
          :loading="isTableLoad"
          rowKey="skuCode"
          :columns="tableColumns"
          bordered
          size="small"
          :scroll="{ x:2580}"
          :pagination="false"
          :dataSource="ProductInventoryData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['stocktakingNumber']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input-number
                v-if="col === 'stocktakingNumber'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
            </div>
          </template>
          <div v-if="!isAdd" slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="custom-filter-dropdown">
            <a-input
              v-ant-ref="c => searchInput = c"
              placeholder="查询商品编码"
              :value="selectedKeys[0]"
              @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="() => handleSearch(selectedKeys, confirm)"
              style="width: 188px; margin-bottom: 8px; display: block;"
            />
            <a-button
              type="primary"
              @click="() => handleSearch(selectedKeys, confirm)"
              icon="search"
              size="small"
              style="width: 90px; margin-right: 8px"
            >查询</a-button>
            <a-button
              @click="() => handleReset(clearFilters)"
              size="small"
              style="width: 90px"
            >取消</a-button>
          </div>
          <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
          <template slot="customRender" slot-scope="text">
            <span v-if="searchText&&!isAdd">
              <template v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))">
                <mark v-if="fragment.toLowerCase() === searchText.toLowerCase()" :key="i" class="highlight">{{ fragment }}</mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <template v-else>{{ text }}</template>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.bt_web_id)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <a-divider dashed/>
      <a-form :form="form">
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <!-- 新增 增加的  的表格 -->
      <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple/>
    </bt-modal>
    <!-- 盘点录入 -->
    <a-modal
      v-model="enteringModal"
      title="盘点数据录入"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered>
      <a-row>
        <a-col :span="24">
          <a-button size="small" style="margin-left:10px" @click="addEnterData">新增</a-button>
          <a-button type="danger" size="small" style="margin-left:10px" @click="deleteEnterRow(-1)">删除</a-button>
        </a-col>
      </a-row>
      <div class="table-nowrap singleTable-wrap">
        <a-table
          rowKey="en_web_id"
          :columns="enterTableColumns"
          bordered
          size="small"
          :scroll="{ x:1340}"
          style="margin-top:10px"
          :dataSource="enteringData"
          :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
          :rowSelection="{selectedRowKeys: selectedEnterRowKeys, onChange: onSelectEnterChange}"
        >
          <template v-for="col in ['skuCode','quantity','sampleQuantity','defectiveQuantity']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input
                ref="skuCodeRef"
                v-if="col === 'skuCode'&& record.editable"
                style=" width:100%"
                :value="text"
                @pressEnter="e=>InputEnterChangeSkuCode(e.target.value, record.en_web_id, col)"
                @change="e => InputEnterChange(e.target.value, record.en_web_id, col)"
              />
              <a-input-number
                v-else-if="col === 'quantity'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :value="text"
                @change="e => InputEnterChange(e, record.en_web_id, col)" />
              <a-input-number
                v-else-if="col === 'sampleQuantity'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :value="text"
                @change="e => InputEnterChange(e, record.en_web_id, col)" />
              <a-input-number
                v-else-if=" col === 'defectiveQuantity'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :value="text"
                @change="e => InputEnterChange(e, record.en_web_id, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteEnterRow(record.en_web_id)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <template slot="footer" >
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="formEnterCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submitEn" type="primary" :loading="submitInfoLoading" @click="submitInfoEnter">
          录入盘点
        </a-button>
        <a-button key="submitSave" type="primary" :loading="submitSaveLoading" @click="submitSaveEnter">
          保存
        </a-button>
      </template>
    </a-modal>
    <!-- 2 -->
    <a-modal
      v-model="enteringModalTow"
      title="盘点数据录入"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered>
      <div class="table-nowrap">
        <a-table
          rowKey="id"
          size="small"
          :columns="enterTableColumnsTow"
          bordered
          :scroll="{ x:1100}"
          style="margin-top:10px"
          :pagination="{defaultPageSize:15,hideOnSinglePage:true}"
          :dataSource="enteringDataTow">
        </a-table>
      </div>
      <template slot="footer" >
        <a-button key="submit" type="primary" :loading="submitLoading" @click="enteringModalTow=false">
          关闭
        </a-button>
      </template>
    </a-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        margin: 0 10px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
</style>
<style lang="less" scoped>
    .custom-filter-dropdown {
        padding: 8px;
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
</style>

<script>
// import { mapGetters } from 'vuex'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/productInventoryPreview'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import goods from './tools/goods'
const ProductInventoryData = []
export default {
    name: 'ProductInventory',
    components: { NewTable, SeachBox, goods, BtModal, Preview },
    data () {
        this.cancelData = ProductInventoryData.map(item => ({ ...item }))
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
                    type: 'select',
                    title: '制单人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
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
                        type: 'stocktaking_status'
                    }
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
            // 菜单
            menuOpt: [
                { name: '编辑',
                    action: 'ProductInventory.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'ProductInventory.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'ProductInventory.verify',
                    fc: this.auditHandler
                }, { name: '盘点录入',
                    action: 'ProductInventory.add',
                    fc: this.enteringHander
                }, { name: '预览',
                    action: 'ProductInventory.get',
                    fc: this.detailHandler
                }
            ],
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键 选中的数据
            tableSingleData: {},
            disContextMenu: [],

            //  单据
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            ProductAddEditModalTitle: '',
            isAdd: false, // 是否为 新增编辑
            submitLoading: false,
            // 单据 表单
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm')
            },
            // 单据 表格
            delIdArr: [], // 详情表格删除的id
            tableColumns: [ // 表头
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '分类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '分类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', width: 150, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '商品条码', dataIndex: 'skuBarcode', width: 150, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 70, align: 'center' },
                { title: '成本价（元）', dataIndex: 'priceCost', width: 100, align: 'center' },
                { title: '零售价（元）', dataIndex: 'price', width: 100, align: 'center' },
                { title: '税率（%）',
                    dataIndex: 'skuRate',
                    width: 70,
                    align: 'center',
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}`

                },
                { title: '账面存量', dataIndex: 'origNumber', width: 100, align: 'center' },
                { title: '待送货量', dataIndex: 'tobeSendNumber', width: 100, align: 'center' },
                { title: '系统实物存量', dataIndex: 'systemQuantity', width: 150, align: 'center' },
                { title: '账面库存金额（元）', dataIndex: 'origAmount', width: 150, align: 'center' },
                { title: '系统实物库存金额（元）', dataIndex: 'systemAmount', width: 160, align: 'center' },
                { title: '盘点实物存量', dataIndex: 'stocktakingNumber', width: 150, align: 'center', scopedSlots: { customRender: 'stocktakingNumber' } },
                { title: '盘点实物库存金额（元）', dataIndex: 'stocktakingAmount', width: 160, align: 'center' },
                { title: '差异金额（元）', dataIndex: 'differenceAmount', width: 150, align: 'center' },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            // 单据 表体
            ProductInventoryData,
            // 单据  选中的key直
            selectedRowKeys: [],
            // 单据 选中 的值
            selectedRows: [],
            // 编辑时商品编码search
            searchText: '',
            searchInput: null,

            // 单据 新增商品
            /// 增加的商品
            goodsQuery: false, // 打开 组建

            // 盘点录入 1
            enteringModal: false,
            enteringData: [],
            selectedEnterRowKeys: [],
            onSelectEnterRows: [],
            enterTableColumns: [ // 表头
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '状态', dataIndex: 'statusName', width: 70, align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', width: 200, align: 'center', scopedSlots: { customRender: 'skuCode' } },
                { title: '商品名称', dataIndex: 'skuName', width: 100, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 50, align: 'center' },
                { title: '正品数量', dataIndex: 'quantity', width: 100, align: 'center', scopedSlots: { customRender: 'quantity' } },
                { title: '样品量', dataIndex: 'sampleQuantity', width: 100, align: 'center', scopedSlots: { customRender: 'sampleQuantity' } },
                { title: '残次品', dataIndex: 'defectiveQuantity', width: 100, align: 'center', scopedSlots: { customRender: 'defectiveQuantity' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            count: 1,
            submitInfoLoading: false,
            submitSaveLoading: false,
            delIdEnterArr: [], // 盘点录入 删除数据
            // 盘点 录入 2
            enteringModalTow: false,
            enterTableColumnsTow: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '状态', dataIndex: 'statusName', width: 70, align: 'center' },
                { title: '商品编码', dataIndex: 'skuCode', width: 120, align: 'center' },
                { title: '商品名称', dataIndex: 'skuName', width: 100, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '规格型号', dataIndex: 'model', width: 100, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 50, align: 'center' },
                { title: '正品数量', dataIndex: 'quantity', width: 70, align: 'center' },
                { title: '样品量', dataIndex: 'sampleQuantity', width: 70, align: 'center' },
                { title: '残次品', dataIndex: 'defectiveQuantity', width: 70, align: 'center' }
            ],
            enteringDataTow: [],

            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            stocktakingNameDorpArr: [],
            makeByDropArr: [],
            isTableLoad: false
        }
    },
    computed: {
        setStocktakingTime () {
            return moment().add({ days: 1 }).startOf('day')
        },
        setStartTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '5a8c06fc16c446ccb4341e52b41d3191:ProductInventory'
            this.tableApiPath = 'StocktakingStocktQuery'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        handleSearch (selectedKeys, confirm) {
            confirm()
            this.searchText = selectedKeys[0]
        },

        handleReset (clearFilters) {
            clearFilters()
            this.searchText = ''
        },
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
            e.path = 'StocktakingStocktQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
            this.tableIdsArr = []
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
                this.$refs.newTable.exportFile('StocktakingStocktQuery')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'StocktakingStocktQuery' })
            this.tableIdsArr = []
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = tableRow
            console.log(this.tableSingleData)
            if (tableRow.status !== 'stocktaking_status:1') {
                this.disContextMenu = ['编辑', '删除', '审核', '盘点录入']
            } else {
                this.disContextMenu = []
            }
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, newTabkeRows) {
            this.tableIdsArr = map(newTabkeRows, 'id')
            this.tableRowsArr = newTabkeRows
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
                const isAuit = newData.filter(o => o.status !== 'stocktaking_status:1')
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
                        path: 'StocktakingStocktDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                            _this.tableIdsArr = []
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
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'StocktakingStocktAudit', // 接口path名，必传
                        method: 'post',
                        body: {
                            id: autiData.id
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

        // 单据
        /**
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditP) {
            this.delIdArr = []
            if (addEditP === -1) {
                this.isAdd = true
                this.ProductAddEditModalTitle = '新增商品盘点单'
                this.tableSingleData = {}
                this.ProductInventoryData = []
                this.tableColumns[5] = { title: '商品编码',
                    dataIndex: 'skuCode',
                    width: 150,
                    align: 'center'
                }
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm')
            } else {
                this.ProductAddEditModalTitle = '编辑商品盘点单'
                const obj = { ...addEditP }
                obj.stocktakingTime = moment(obj.stocktakingTime)
                obj.createTime = moment(obj.createTime)
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm')
                this.tableSingleData = obj
                axios({
                    path: 'StocktakingStocktQueryDetail',
                    method: 'post',
                    body: {
                        stocktakingId: addEditP.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const dataArr = [...res.data.list]
                        for (const i of dataArr) {
                            i.bt_web_id = i.skuCode
                        }
                        this.ProductInventoryData = dataArr
                    }
                })
                this.tableColumns[5] = {
                    title: '商品编码',
                    dataIndex: 'skuCode',
                    width: 150,
                    align: 'center',
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'customRender'
                    },
                    onFilter: (value, record) => record.skuCode.toLowerCase().includes(value.toLowerCase()),
                    onFilterDropdownVisibleChange: (visible) => {
                        if (visible) {
                            setTimeout(() => {
                                this.searchInput.focus()
                            })
                        }
                    }
                }
                this.isAdd = false
            }
            this.addEditModel = true
        },
        /**
         * @name: 查询盘点人 
         */        
        handleApplyByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.makeByDropArr.length = 0
                this.getMakeByDropArr(value)
            }, 300)
        },
        /**
         * @name: 制单人
         * @msg:
         * @param {type}
         * @return:
         */
        getMakeByDropArr (value) {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    name: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.makeByDropArr = dataArr
                }
            })
        },
        /**
         * @name: 时间禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDate (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        // 明细 商品

        /**
         * @name: 明细 表格多选框
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = selectKeys
            this.selectedRows = selectRows
        },
        /**
         * @name: 详情 表格的行 值改变
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, key) {
            const { mul, sub } = this.$math
            const newData = [...this.ProductInventoryData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                // console.log(val, count, key, '监听', target)
                target[key] = val || 0
                if (target.stocktakingNumber >= 0) {
                    target['origAmount'] = mul(target['origNumber'], target['priceCost'])
                    target['systemAmount'] = mul(target['systemQuantity'], target['priceCost'])
                    target['stocktakingAmount'] = mul(target['stocktakingNumber'], target['priceCost'])
                    target['differenceAmount'] = sub(mul(target['stocktakingNumber'], target['priceCost']), mul(target['origNumber'], target['priceCost']))
                }
                this.ProductInventoryData = newData
            }
        },
        /**
         * @name: 明细 商品删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.ProductInventoryData]
                const hasIdArr = map(this.selectedRows, 'id')
                if (hasIdArr.length > 0) {
                    hasIdArr.forEach(item => {
                        this.delIdArr.push(item)
                    })
                }
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].bt_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.ProductInventoryData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.ProductInventoryData]
                this.ProductInventoryData = newData.filter(item => item.bt_web_id !== keyId)
                const selectId = newData.filter(item => item.bt_web_id === keyId)[0]
                // console.log(selectId)
                if (selectId.id) {
                    this.delIdArr.push(selectId.id)
                }
            }
        },
        // 单据 内 新增的表格
        onSelectAddGoods (addSeleckData) {
            const { mul, sub, add } = this.$math
            console.log(addSeleckData, '选择商品')
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.ProductInventoryData.filter(o => o.skuCode === mun.skuCode)
                const priceCostValue = mun.priceCost ? mun.priceCost : 0
                if (has.length === 0) {
                    this.ProductInventoryData.push({
                        bt_web_id: mun.skuCode,
                        classCode: mun.classCode,
                        className: mun.className,
                        brandCode: mun.brandCode,
                        brandName: mun.brandName,
                        skuBarcode: mun.barCode,
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        skuModel: mun.model,
                        priceCost: priceCostValue,
                        unit: mun.basicUnit,
                        price: mun.price,
                        skuRate: mun.skuRate,
                        origNumber: mun.bookNumbers,
                        tobeSendNumber: mun.tobeSendNumber ? mun.tobeSendNumber : 0.00,
                        systemQuantity: add(add(mun.curNumber, mun.moveOutNumber, 0), mun.tobeSendNumber, 0),
                        stocktakingNumber: 0,
                        origAmount: mul(mun['bookNumbers'], priceCostValue),
                        systemAmount: mul(add(add(mun.curNumber, mun.moveOutNumber), mun.tobeSendNumber), priceCostValue),
                        stocktakingAmount: mul(0, priceCostValue),
                        differenceAmount: sub(mul(0, priceCostValue), mul(mun['bookNumbers'], priceCostValue))
                    })
                } else {
                    error.push(mun.skuCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 弹框取消
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.addEditModel = false
        },
        /**
         * @name: 表单提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            const _this = this
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                // console.log(values)
                if (!err) {
                    if (_this.ProductInventoryData.length === 0) {
                        _this.$message.warning('您没有添加详情信息')
                        return
                    }
                    if (!_this.isAdd) {
                        values.id = _this.tableSingleData.id
                    }
                    _this.submitLoading = true
                    values.stocktakingTime = values.stocktakingTime.format('YYYY-MM-DD HH:mm:ss')
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.createTime = this.defauilForm.createTime.format('YYYY-MM-DD HH:mm:ss')
                    values.ids = _this.delIdArr
                    values.detail = _this.ProductInventoryData
                    axios({
                        path: _this.isAdd ? 'StocktakingStocktAdd' : 'StocktakingStocktUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        _this.submitLoading = false
                        if (res.flag === 1) {
                            _this.addEditModel = false
                            _this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 盘点录入
        /**
         * @name: 弹框录入
         * @msg:
         * @param {type}
         * @return:
         */
        enteringHander (tableDdtaSingle) {
            this.enteringData = []
            axios({
                path: 'StocktakingInputQuery',
                method: 'post',
                body: {
                    stocktakingId: tableDdtaSingle.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.list.length === 0) {
                        console.log(1)
                        this.delIdEnterArr = []
                        const { count, enteringData } = this
                        const newData = {
                            en_web_id: count,
                            status: '',
                            classCode: '',
                            className: '',
                            brandCode: '',
                            brandName: '',
                            skuCode: '',
                            skuName: '',
                            skuBarCode: '',
                            unit: '',
                            skuModel: '',
                            quantity: 0,
                            sampleQuantity: 0,
                            defectiveQuantity: 0,
                            editable: true
                        }
                        this.enteringData = [...enteringData, newData]
                        this.count = count + 1
                        this.enteringModal = true
                    } else {
                        const getNewData = [...res.data.list]
                        const target = getNewData.filter(item => item.status === 'stocktating_input_status:2')
                        if (target.length > 0) {
                            getNewData.forEach(item => {
                                item.en_web_id = item.id
                            })
                            this.enteringDataTow = getNewData
                            this.enteringModalTow = true
                        } else {
                            getNewData.forEach(item => {
                                item.en_web_id = item.id
                            })
                            this.enteringData = getNewData
                            this.enteringModal = true
                            this.delIdEnterArr = []
                        }
                    }

                    console.log(res)
                }
            })
        },
        /**
         * @name: 新增盘点数据
         * @msg:
         * @param {type}
         * @return:
         */
        addEnterData () {
            const { count, enteringData } = this
            const newData = {
                en_web_id: count,
                status: '',
                classCode: '',
                className: '',
                brandCode: '',
                brandName: '',
                skuCode: '',
                skuName: '',
                skuBarcode: '',
                unit: '',
                skuModel: '',
                quantity: 0,
                sampleQuantity: 0,
                defectiveQuantity: 0,
                editable: true
            }
            this.enteringData = [...enteringData, newData]
            this.count = count + 1
        },
        /**
         * @name: 表格 选择的值
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectEnterChange (selectEntRowKeys, selectEntRows) {
            this.selectedEnterRowKeys = selectEntRowKeys
            this.onSelectEnterRows = selectEntRows
        },
        /**
         * @name: 盘点数据录入 行变化
         * @msg:
         * @param {type}
         * @return:
         */
        InputEnterChange (enterVal, count, key) {
            const newData = [...this.enteringData]
            const target = newData.filter(item => count === item.en_web_id)[0]
            if (target) {
                // console.log(enterVal, count, key, '监听')
                if (key === 'skuCode') {
                    const skuCodeValue = enterVal.replace(/\s*/g, '')
                    target[key] = skuCodeValue
                } else {
                    target[key] = enterVal
                }

                this.enteringData = newData
            }
        },
        /**
         * @name: 商品编码 按回车的调用
         * @msg:
         * @param {type}
         * @return:
         */
        InputEnterChangeSkuCode (enterVal, count, key) {
            // console.log(123, enterVal, count)
            const newData = [...this.enteringData]
            const target = newData.filter(item => enterVal === item.skuCode)[0]
            let exitesSkuCode = []
            if (newData.length > 0) {
                exitesSkuCode = newData.filter(item => enterVal === item.skuCode)
            }
            // console.log(newData, exitesSkuCode)
            if (exitesSkuCode.length > 1) {
                this.$message.warning('此商品已经存在')
                return
            }
            const skuCodeValue = enterVal.replace(/\s*/g, '')
            if (skuCodeValue) {
                if (key === 'skuCode') {
                    axios({
                        path: 'StocktakingInputCheckSku',
                        method: 'post',
                        body: {
                            skuCode: skuCodeValue,
                            stocktakingId: this.tableSingleData.id
                        }
                    }).then(res => {
                    // console.log(res)
                        if (res.flag === 1) {
                            const newObj = { ...res.data }
                            if (target) {
                                target['classCode'] = newObj.classCode
                                target['className'] = newObj.className
                                target['brandCode'] = newObj.brandCode
                                target['brandName'] = newObj.brandName
                                target['skuCode'] = newObj.skuCode
                                target['skuName'] = newObj.skuName
                                target['skuBarcode'] = newObj.skuBarcode
                                target['unit'] = newObj.unit
                                target['skuModel'] = newObj.skuModel
                                delete target.editable
                                target.statusName = '未保存'
                                this.enteringData = newData
                            }
                        } else {
                            if (target) {
                                target[key] = enterVal
                                target['classCode'] = ''
                                target['className'] = ''
                                target['brandCode'] = ''
                                target['brandName'] = ''
                                target['skuCode'] = ''
                                target['skuName'] = ''
                                target['skuBarcode'] = ''
                                target['unit'] = ''
                                target['skuModel'] = ''
                                target.statusName = ''
                                target.editable = true
                                this.enteringData = newData
                            }
                        }
                    })
                }
            }
        },
        /**
         * @name: 盘点数据录入  删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteEnterRow (keyIdEnter) {
            if (keyIdEnter === -1) {
                const deleteEnterData = [...this.enteringData]
                const hasIdArr = map(this.onSelectEnterRows, 'id')
                if (hasIdArr.length > 0) {
                    hasIdArr.forEach(item => {
                        this.delIdEnterArr.push(item)
                    })
                }
                for (const i in this.selectedEnterRowKeys) {
                    for (const j in deleteEnterData) {
                        if (deleteEnterData[j].en_web_id === this.selectedEnterRowKeys[i]) {
                            deleteEnterData.splice(j, 1)
                        }
                    }
                }
                this.enteringData = deleteEnterData
            } else {
                const newData = [...this.enteringData]
                this.enteringData = newData.filter(item => item.en_web_id !== keyIdEnter)
                const selectId = newData.filter(item => item.en_web_id === keyIdEnter)[0]
                // console.log(selectId)
                if (selectId.id) {
                    this.delIdEnterArr.push(selectId.id)
                }
            }
        },
        /**
         * @name: 关闭  盘点单1
         * @msg:
         * @param {type}
         * @return:
         */
        formEnterCancel () {
            this.enteringModal = false
        },
        /**
         * @name: 录入 盘点
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfoEnter () {
            const _this = this
            if (_this.enteringData.length === 0) {
                _this.$message.warning('请新增盘点录入数据')
                return
            }
            const noSave = []
            const noSkuCode = []
            _this.enteringData.forEach(item => {
                if (!item.statusName || item.statusName === '未保存') {
                    noSave.push(item)
                }
                if (!item.skuCode) {
                    noSkuCode.push(item)
                }
            })
            if (noSkuCode.length > 0) {
                _this.$message.warning('存在有商品编码为空的数据，请输入商品编码或条码进行商品查询')
                return
            }
            if (noSave.length > 0) {
                _this.$message.warning('存在有数据状态不是未录入的数据，请先保存')
                return
            }
            _this.submitInfoLoading = true
            _this.$confirm({
                title: '提示',
                content: '此操作成功将不可更改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'StocktakingInputAddStocktating',
                        method: 'post',
                        body: {
                            id: _this.tableSingleData.id,
                            ids: _this.delIdEnterArr,
                            stocktakingInputList: _this.enteringData
                        }
                    }).then(res => {
                        _this.submitInfoLoading = false
                        if (res.flag === 1) {
                            _this.enteringModal = false
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                    _this.submitInfoLoading = false
                },
                class: 'test'
            })
        },
        /**
         * @name: 保存数据
         * @msg:
         * @param {type}
         * @return:
         */
        submitSaveEnter () {
            if (this.enteringData.length === 0) {
                this.$message.warning('请新增盘点录入数据')
                return
            }
            const noSkuCode = []
            this.enteringData.forEach(item => {
                if (!item.skuCode) {
                    noSkuCode.push(item)
                }
            })
            if (noSkuCode.length > 0) {
                this.$message.warning('存在有商品编码为空的数据，请输入商品编码或条码进行商品查询')
                return
            }
            const noSave = []
            this.enteringData.forEach(item => {
                if (!item.statusName) {
                    noSave.push(item)
                }
            })
            // if (noSave.length > 0) {
            //     this.$message.warning('存在有商品明细里不存在的商品')
            //     return
            // }
            this.submitSaveLoading = true
            axios({
                path: 'StocktakingInputAdd',
                method: 'post',
                body: {
                    id: this.tableSingleData.id,
                    ids: this.delIdEnterArr,
                    stocktakingInputList: this.enteringData
                }
            }).then(res => {
                this.submitSaveLoading = false
                if (res.flag === 1) {
                    this.enteringModal = false
                }
            })
        },
        /**
         * @name: 编辑 skucode搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachSkuCode (e) {
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getEditDataSkuCode({
                    skuCode: e.target.value
                })
            }, 300)
        },
        getEditDataSkuCode (params = {}) {
            this.isTableLoad = true
            const newObj = Object.assign(params, { stocktakingId: this.tableSingleData.id })
            axios({
                path: 'StocktakingStocktQueryDetail',
                method: 'POST',
                body: newObj
            }).then(res => {
                this.isTableLoad = false
                // this.spinning = false
                // console.log('goods', res)
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    for (const i of dataArr) {
                        i.bt_web_id = i.skuCode
                    }
                    this.ProductInventoryData = dataArr
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
        '$store.state.app.pageName' (to, from) {
            if (to === 'ProductInventory') {
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

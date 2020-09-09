<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:28:26
 * @LastEditTime: 2019-08-26 13:54:51
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
      <a-button
        @click="updateSkuStatus"
        icon="save"
        size="small"
        v-action:confirm
        type="primary">确认下发</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <bt-modal
      v-model="storefrontAddEditModal"
      :title="storefrontAddEditModalTitle"
      :submitClick="handleSubmit"
      :submitLoading="loading"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">商品名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-show="false" v-decorator="$check('SKU.goodsId', {initialValue:selectedSingleRow.goodsId || ''})"/>
              <a-input ref="goodsInput" placeholder="请选择商品" @click="goodsinfoAdd" v-decorator="$check('SKU.goodsCode', {initialValue:selectedSingleRow.goodsCode || ''})" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">品牌编码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="展示品牌编码" v-decorator="$check('SKU.brandCode', {initialValue:selectedSingleRow.brandCode || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">品牌名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="展示品牌名称" v-decorator="$check('SKU.brandName', {initialValue:selectedSingleRow.brandName || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">品类编码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="展示品类编码" v-decorator="$check('SKU.classCode', {initialValue:selectedSingleRow.classCode || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">品类名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="展示品类名称" v-decorator="$check('SKU.className', {initialValue:selectedSingleRow.className || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">规格型号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="展示规格型号" v-decorator="$check('SKU.model', {initialValue:selectedSingleRow.model || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">SKU编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('SKU.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">SKU名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入SKU名称" v-decorator="$check('SKU.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('SKU.status', {initialValue:selectedSingleRow.status})" :options="statusArr" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">成本价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number style="width: 100%" placeholder="请输入成本价" :min="0" v-decorator="$check('SKU.ptCost', {initialValue:selectedSingleRow.ptCost || 0})" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">零售价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                placeholder="请输入零售价"
                @blur="e=>onPriceBlur(e)"
                :min="0"
                v-decorator="$check('SKU.price', {initialValue:selectedSingleRow.price || 0})"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">分销价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                placeholder="请输入分销价"
                :min="0"
                v-decorator="$check('SKU.priceW', {initialValue:selectedSingleRow.priceW || 0})"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">限价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                placeholder="请输入限价"
                :min="0"
                v-decorator="$check('SKU.priceMin', {initialValue:selectedSingleRow.priceMin || 0})"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">扣率</a-col>
          <a-col :sm="16" :md="isAdd?20:8" :xl="isAdd?21:13">
            <a-form-item>
              <a-input-number
                :min="0"
                :max="1"
                :precision="4"
                :step="1"
                style="width: 100%"
                @focus="$event.currentTarget.select()"
                placeholder="请输入扣率"
                v-decorator="$check('SKU.rate', {initialValue:selectedSingleRow.rate || 0})"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">地市县扣率</a-col>
          <a-col :sm="16" :md="isAdd?20:8" :xl="isAdd?21:13">
            <a-form-item>
              <a-input-number
                :min="0"
                :max="1"
                :precision="4"
                :step="1"
                @focus="$event.currentTarget.select()"
                style="width: 100%"
                placeholder="请输入地市县扣率"
                v-decorator="$check('SKU.rateReg', {initialValue:selectedSingleRow.rateReg || 0})"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3" >品类属性</a-col>
          <a-col :sm="16" :md="20" :xl="21" >
            <a-form-item class="check-box" style="border: 1px solid #d9d9d9;border-radius: 4px;line-height:200px;height:200px;">
              <div class="check-box-g" v-for="(item,index) in onList" :key="index">
                <a-checkbox-group v-model="checkInSelete">
                  <a-checkbox :value="item.name" @change="seleteChange" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'">{{ item.name }}</a-checkbox>
                  <a-radio-group
                    :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"
                    :options="item.value.split(',')"
                    @change="onPropertyChange(item)"
                    v-model="checkLastSelete[item.name]"/>
                    <!-- v-if="checkInSelete.indexOf(item.name)>-1" -->
                </a-checkbox-group>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="isLinkOldErp" style="margin-top: 180px;border-top: 1px dashed #d9d9d9;padding-top: 10px;">
          <a-col :sm="8" :md="4" :xl="3">部门</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select showSearch :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="otherSkuInfo.c_adno" :options="oldErpStoreArr" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                notFoundContent="请输入关键字进行检索"
                :filterOption="false"
                :getPopupContainer="triggerNode => triggerNode.parentNode"
                v-model="otherSkuInfo.c_provider"
                @search="getOldErpProvider"
                :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'">
                <a-select-option v-for="d in oldErpProviderArr" :key="d.value">{{ d.title }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">经营类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" @focus="queryOldErpContractType" v-model="otherSkuInfo.c_i_type" :options="oldErpContractTypeArr" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_sku_status:1'"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">提成</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                :min="0"
                style="width: 100%"
                v-model="otherSkuInfo.c_push_money"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地市县扣率</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                :min="0"
                :max="1"
                :precision="4"
                :step="1"
                style="width: 100%"
                v-model="otherSkuInfo.c_d_rate_reg"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods"/>
    </bt-modal>
    <!-- 导出 -->
    <ExportToFile
      v-model="exportVisbel"
      :path="exportPath"
      :body="exportBody"
      :cols="exportCols"></ExportToFile>
    <!--商品条码 -->
    <a-modal
      :visible="barCodeModal"
      title="商品条码"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc barCodeModalCss"
      destroyOnClose
      centered>
      <a-row >
        <a-col :span="24">
          <a-row>
            <a-col :span="24" class="barCodeBtnDiv">
              <a-button key="submit" type="primary" size="small" @click="addBarCode">新增</a-button>
              <!-- <a-button type="primary" size="small" >打印</a-button> -->
              <a-button type="primary" size="small" @click="exportBarCode">导出</a-button>
            </a-col>
          </a-row>
          <a-row style="margin-top:10px;">
            <a-col :span="24" class="table-nowrap">
              <a-table
                ref="barcodeTable"
                rowKey="barcode"
                :scroll="{x:500}"
                size="small"
                :pagination="{defaultPageSize:100}"
                :columns="barCodeColumns"
                :dataSource="barCodeData">
                <span slot="action" slot-scope="index,record">
                  <a href="javascript:;" @click="updateBarCode(record)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="是否要删除?" @confirm="handleDelBarcode(index,record)" okText="确定" cancelText="取消">
                    <a href="javascript:;" >删除</a>
                  </a-popconfirm>
                </span>
              </a-table>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <div slot="footer">
        <a-button @click="subCancel">关闭</a-button>
      </div>
    </a-modal>
    <!-- 新增条码 -->
    <a-modal
      :visible="AddCodeModal"
      :title="AddCodeModalTitle"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="600"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button type="primary" :loading="autoloading" :disabled="!isAddBarCode" @click="autoBarCode">生成自制码</a-button>
        <a-button @click="addcodeCancel">关闭</a-button>
        <a-button type="primary" :loading="loading" @click="handleAddCodeSubmit">确定</a-button>
      </template>
      <a-form :form="codeForm">
        <a-row class="doc">
          <a-col :span="4">SKU编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('sku.skuCode', {initialValue:selectedSingleRow.code})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">条码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('sku.barcode',{initialValue:selectedRow.barcode})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">制作方式</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-radio-group
                v-decorator="$check('sku.buildMethods', {initialValue:selectedRow.buildMethods||'厂家'})">
                <a-radio :value="`厂家`">厂家</a-radio>
                <a-radio :value="`自制`">自制</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">含量</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('sku.content', {initialValue:selectedRow.content||'1'})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">折扣</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                type="number"
                v-decorator="[
                  'discount',
                  {
                    initialValue:selectedRow.discount||100,
                    rules: [{ validator:check, message: '最大值为100!' }]
                  }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">是否主条码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-radio-group
                v-decorator="$check('sku.isMaster', {initialValue:selectedRow.isMaster||0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea
                placeholder="备注"
                v-decorator="$check('sku.note', {initialValue:selectedRow.note})"
                :autosize="{minRows: 2, maxRows: 4}"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
    .check-box{
        overflow:auto;
        padding-left:20px;
        &-g{
            .ant-radio-group{
                border-bottom: none;
            }
        }
    }
    .barCodeModalCss{
        .barCodeBtnDiv{
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #e8e8e8;
        }
       .ant-btn{
           margin: 0 5px;
       }
        .ant-modal-body{
            padding:0px;
        }
    }
    @import "../../../assets/modalStyle.less";
</style>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import goods from './tools/goods'
import ExportToFile from '@comp/exportToFile'
import BtModal from '@comp/Modal'
import { isConnectOldErp } from '@/config/api.config'
export default {
    name: 'CommoditySKU',
    components: {
        NewTable,
        seachBox,
        goods,
        ExportToFile,
        BtModal
    },
    data () {
        return {
            isLinkOldErp: isConnectOldErp,
            // 表单
            form: this.$form.createForm(this),
            codeForm: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: '',
            // 右键菜单
            menuOpt: [
                { name: '商品条码',
                    action: 'commoditySKU.edit',
                    fc: this.barCodeHander
                },
                { name: '编辑',
                    action: 'commoditySKU.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'commoditySKU.get',
                    fc: e => this.$refs.newTable.showDetails('商品SKU详情', e)
                }, { name: '删除',
                    action: 'commoditySKU.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, { name: '确认下发',
                    action: 'commoditySKU.edit',
                    fc: ({ id }) => { this.onUpdateStatus(id) }
                    // autoDis: [{ key: 'status', undis: ['base_sku_status:1'] }] /* key: 要检查的字段，dis:[] 满足则禁用，undis:[] 不满足则禁用，都传则并集 */
                }
            ],
            // 工具栏按钮组
            btns: ['add', 'del', 'export'],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 工具栏搜索文本框组
            conditions: [
                { title: '商品编码/名称', type: 'input', key: 'goodsName' },
                { title: 'SKU编码/名称', type: 'input', key: 'name' },
                { title: '品类',
                    type: 'treeSelect',
                    key: 'classCodes',
                    filter: true,
                    selectDataArr: [],
                    maxTagCount: 99,
                    multiple: true
                },
                {
                    title: '品牌',
                    type: 'selectBySeach',
                    key: 'brandCodes',
                    path: 'GoodsBrandFindCondition',
                    label: ['code', 'name'],
                    value: 'code',
                    maxTagCount: 99,
                    mode: 'multiple'
                },
                { title: '规格型号', type: 'input', key: 'model' },
                { title: '状态',
                    type: 'select',
                    key: 'status',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: { type: 'base_sku_status' }
                }
            ],
            // 添加/编辑模态框标题
            storefrontAddEditModalTitle: '',
            // 添加/编辑模态框显示隐藏标识
            storefrontAddEditModal: false,
            // 以下数组为模态框中下拉菜单数据
            classIdArr: [],
            brandIdArr: [],
            flag: [],
            quarter: [],
            labelType: [],
            type: [],
            statusArr: [],
            loading: false,
            autoloading: false,
            isAdd: true,
            // 表格右键选中的单行数据
            selectedSingleRow: {},
            // 单项/批量删除id
            tableSelectRows: [],
            // 新增/编辑复选框全选样式控制标识
            indeterminate: true,
            // 复选框全选标识
            checkAll: false,
            // 新增/编辑商品下拉框数据
            // goodsArr: [],
            // 新增/编辑商品状态框数据
            // goodsStatus: [],
            onList: [],
            checkInSelete: [],
            checkLastSelete: {},
            goodsQuery: false,
            AddCodeModal: false,
            AddCodeModalTitle: '',
            isAddBarCode: false,
            // 商品条码
            barCodeModal: false,
            barCodeColumns: [
                { title: '商品条码', dataIndex: 'barcode', align: 'center', width: 100 },
                { title: '制作方式', dataIndex: 'buildMethods', align: 'center', width: 50 },
                { title: '含量', dataIndex: 'content', align: 'center', width: 50 },
                { title: '折扣', dataIndex: 'discount', align: 'center', width: 50 },
                {
                    title: '是否主条码(否:0 是:1)',
                    dataIndex: 'isMaster',
                    isHidden: true,
                    align: 'center',
                    width: 100,
                    customRender: (vl) => vl ? '是' : '否'
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    align: 'center',
                    width: 150,
                    customRender: (vl) => (
                        <a-tooltip
                            placement="top"
                            title={vl}
                            mouseEnterDelay={0.3}
                            arrowPointAtCenter>
                            <span style='width:130px' class="text">{vl}</span>
                        </a-tooltip>
                    )
                },
                { title: '操作', key: 'operation', align: 'center', width: 80, scopedSlots: { customRender: 'action' } }
            ],
            barCodeData: [],
            selectedRow: {},
            // 导出
            exportVisbel: false,
            exportPath: '',
            exportBody: {},
            exportCols: [],
            // 表格右键禁用按钮
            disContextMenu: [],
            goodsType: '',
            otherSkuInfo: {},
            oldErpStoreArr: [],
            oldErpProviderArr: [],
            oldErpContractTypeArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '3a87dfa6952940b38d709be270a6d944:commoditySKU'
            this.tableApiPath = 'GoodsSkuFindSkuSearch'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getSKUStatus()
        this.getGoodsCategoryFindBySelected()
    },
    methods: {
        check (k, vl, cb) {
            // eslint-disable-next-line standard/no-callback-literal
            vl > 100 ? cb('最大值为100') : cb()
        },
        onPriceBlur (e) {
            this.form.setFieldsValue({
                priceW: e.target.value,
                priceMin: e.target.value
            })
        },
        onPropertyChange (item) {
            if (this.checkInSelete.indexOf(item.name) < 0) {
                this.checkInSelete.push(item.name)
            }
            const propeytyValue = Object.values(this.checkLastSelete).join('-')
            const name = `${this.form.getFieldsValue().goodsCode.split('-')[1]}-${propeytyValue}`
            this.$nextTick(() => {
                this.form.setFieldsValue({ name: name })
            })
        },
        /**
         * @name: 表格右击
         */
        onContextmenuChange (row) {
            this.disContextMenu = []
            if (row.status !== 'base_sku_status:1') {
                this.disContextMenu = ['删除', '确认下发']
            }
        },
        barCodeHander (row) {
            this.barCodeData = []
            axios({
                path: 'GoodsSkuGetSkuBarcodeBySkuCode',
                method: 'POST',
                body: {
                    skuCode: row.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.barCodeData = [...data]
                }
            })
            this.selectedSingleRow = { ...row }
            this.barCodeModal = true
        },
        loadBarCode () {
            axios({
                path: 'GoodsSkuGetSkuBarcodeBySkuCode',
                method: 'POST',
                body: {
                    skuCode: this.selectedSingleRow.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.isMasterShow = item.isMaster === 1 ? '是' : '否'
                    })
                    this.barCodeData = [...data]
                }
            })
        },
        // 新增条码
        addBarCode () {
            this.selectedRow = {}
            this.isAddBarCode = true
            this.AddCodeModalTitle = '新增条码'
            this.AddCodeModal = true
        },
        updateBarCode (row) {
            this.selectedRow = { ...row }
            this.isAddBarCode = false
            this.AddCodeModalTitle = '编辑条码'
            this.AddCodeModal = true
        },
        addcodeCancel () {
            this.AddCodeModal = false
        },
        // 自动生成商品自制码
        autoBarCode () {
            this.codeForm.validateFields((err) => {
                if (!err) {
                    this.autoloading = true
                    axios({
                        path: 'GoodsBarcodeCreateBarcode',
                        method: 'post'
                    }).then(res => {
                        if (res.flag === 1) {
                            this.codeForm.setFieldsValue({
                                barcode: res.data.barcode,
                                buildMethods: '自制'
                            })
                        }
                        this.autoloading = false
                    })
                }
            })
        },
        // 删除条码
        handleDelBarcode (row) {
            if (row.id) {
                this.loading = true
                axios({
                    path: 'GoodsBarcodeDel',
                    method: 'post',
                    body: {
                        ids: [row.id]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.loadBarCode()
                    }
                    this.loading = false
                })
            } else {
                this.loadBarCode()
            }
        },
        // 新增条码保存
        handleAddCodeSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { codeForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!values.barcode) {
                        this.$message.warning('商品条码不能为空')
                        return
                    }
                    if (values.isMaster === 1) {
                        const anr = this.barCodeData.find(item => (item.isMaster === 1 && item.barcode !== values.barcode))
                        if (anr) {
                            this.$message.warning('该商品已有主条码')
                            return
                        }
                    }
                    this.loading = true
                    if (!this.isAddBarCode) {
                        values.id = this.selectedRow.id
                    }
                    axios({
                        path: this.isAddBarCode ? 'GoodsBarcodeAdd' : 'GoodsBarcodeUpdate',
                        method: 'post',
                        body: { baseBarcodeSkus: [values] }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.loadBarCode()
                            this.AddCodeModal = false
                        } else if (res.flag === 2) {
                            this.$message.error('该商品已有主条码 不能新增主条码')
                        }
                        this.loading = false
                    })
                }
            })
        },
        // 导出
        exportBarCode () {
            this.exportPath = 'GoodsSkuGetSkuBarcodeBySkuCode'
            this.exportBody = { skuCode: this.selectedSingleRow.code }
            const cols = []
            this.barCodeColumns.forEach(c => {
                if (c.dataIndex !== 'web_index' && c.key !== 'operation') {
                    cols.push({
                        key: c.dataIndex,
                        name: c.title
                    })
                }
            })
            this.exportCols = cols
            this.exportVisbel = true
        },
        goodsinfoAdd () {
            this.goodsQuery = true
            this.$refs.goodsInput.blur()
        },
        onSelectAddGoods (data) {
            this.goodsType = data[0].type
            this.$nextTick(() => {
                this.form.setFieldsValue({
                    goodsId: data[0].goodsId,
                    goodsCode: `${data[0].goodsCode}-${data[0].goodsName}`,
                    brandCode: data[0].brandCode,
                    brandName: data[0].brandName,
                    classCode: data[0].classCode,
                    className: data[0].className,
                    model: data[0].goodsModel,
                    name: data[0].goodsName
                })
            })
            if (data[0].classCode) {
                axios({
                    path: 'GoodsCategoryAttributesFindAll',
                    body: {
                        classCode: data[0].classCode
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.onList = res.data
                        this.checkLastSelete = {}
                        this.checkInSelete.length = 0
                    }
                })
            }
        },
        /**
         * @name: 如果取消复选框，则清空对应单选
         * @msg:
         * @param {type}
         * @return:
         */
        seleteChange (e) {
            if (!e.target.checked) {
                delete this.checkLastSelete[e.target.value]
                const propeytyValue = Object.values(this.checkLastSelete).join('-')
                const name = `${this.form.getFieldsValue().goodsCode.split('-')[1]}-${propeytyValue}`
                this.$nextTick(() => {
                    this.form.setFieldsValue({ name: name })
                })
            }
        },
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'GoodsSkuFindSkuSearch'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 工具栏功能按键事件监听
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.isAdd = true
                this.otherSkuInfo = {
                    c_adno: '',
                    c_provider: '',
                    c_i_type: '',
                    c_push_money: 0,
                    c_d_rate_reg: 0
                }
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('GoodsSkuFindSkuSearch', this.seachValue)
            }
        },
        /** 确认下发 */
        updateSkuStatus () {
            if (this.tableSelectRows.length > 0) {
                this.onUpdateStatus(-1)
            } else {
                this.$message.warning('您尚未选中任何数据！')
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            if (this.isLinkOldErp) {
                this.queryOldErpStoreList()
            }
            this.getSKUStatus()
            if (index === -1) {
                // 清除数据
                this.selectedSingleRow = {}
                this.onList = []
                this.storefrontAddEditModalTitle = '新增商品SKU信息'
            } else {
                this.storefrontAddEditModalTitle = '编辑商品SKU信息'
            }
            this.storefrontAddEditModal = true
        },
        /**
         * @name:请求商品状态数据
         */
        getSKUStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'base_sku_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.statusArr = [...data]
                    if (this.isAdd) {
                        this.selectedSingleRow.status = data[0].value
                    }
                }
            })
        },
        // 工具栏方法定义--end
        // 表格方法定义--start
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.otherSkuInfo = {}
            this.isAdd = false
            this.selectedSingleRow = { ...row }
            this.selectedSingleRow.goodsCode = this.selectedSingleRow.goodsCode + '-' + this.selectedSingleRow.goodsName
            this.goodsType = row.goodsType
            this.onList = []
            if (this.isLinkOldErp) {
                if (this.isJSON(row.noteA)) {
                    this.otherSkuInfo = JSON.parse(row.noteA)
                }
            }
            this.addEditStorefront()
            if (row.classCode) {
                axios({
                    path: 'GoodsCategoryAttributesFindAll',
                    body: {
                        classCode: row.classCode
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.onList = res.data
                        this.checkLastSelete = {}
                        this.checkInSelete.length = 0
                        if (row.propertyList) {
                            row.propertyList.forEach(item => {
                                this.checkInSelete.push(item.classPropertyName)
                                this.$set(this.checkLastSelete, item.classPropertyName, item.classPropertyValue)
                            })
                        }
                    }
                })
            }
        },
        isJSON (str) {
            if (typeof str === 'string') {
                try {
                    const obj = JSON.parse(str)
                    if (typeof obj === 'object' && obj) { return true } else { return false }
                } catch (e) {
                    return false
                }
            }
        },
        onUpdateStatus (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '下发后不可恢复，确定下发吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'GoodsInformationChangeBatchStatus',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData(self.tableCode, { path: self.tableApiPath })
                        }
                    })
                }
            })
        },
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'GoodsSkuDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    // 自营商品
                    if (this.goodsType === 'goods_type:1' || this.goodsType === 'goods_type:5') {
                        if (!values.ptCost || values.ptCost <= 0) {
                            this.loading = false
                            return this.$message.warning('自营商品成本价需大于0')
                        }
                        if (!values.price || values.price <= 0) {
                            this.loading = false
                            return this.$message.warning('自营商品零售价需大于0')
                        }
                        if (!values.priceW || values.priceW <= 0) {
                            this.loading = false
                            return this.$message.warning('自营商品分销价需大于0')
                        }
                        if (!values.priceMin || values.priceMin <= 0) {
                            this.loading = false
                            return this.$message.warning('自营商品限价需大于0')
                        }
                    }
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    values.goodsCode = values.goodsCode.split('-')[0]
                    values.baseSkuProperties = []
                    if (this.onList.length > 0 && this.checkInSelete.length === 0) {
                        this.loading = false
                        return this.$message.warning('请选择品类属性')
                    }
                    let flag = false
                    this.onList.forEach(item => {
                        const goodCategory = this.checkInSelete.find(o => o === item.name)
                        if (goodCategory) {
                            const obj = {
                                classPropertyId: item.id,
                                classPropertyName: item.name,
                                classPropertyValue: this.checkLastSelete[item.name]
                            }
                            if (!this.checkLastSelete[item.name]) {
                                flag = true
                                return
                            }
                            values.baseSkuProperties.push(obj)
                        }
                    })
                    if (flag) {
                        this.loading = false
                        return this.$message.warning('请选择属性值')
                    }
                    if (this.isLinkOldErp) {
                        if (!this.otherSkuInfo.c_adno) {
                            this.loading = false
                            return this.$message.warning('请选择部门')
                        }
                        if (!this.otherSkuInfo.c_provider) {
                            this.loading = false
                            return this.$message.warning('请选择供应商')
                        }
                        values.noteA = JSON.stringify(this.otherSkuInfo)
                    }
                    axios({
                        path: this.isAdd ? 'GoodsSkuAdd' : 'GoodsSkuUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.storefrontAddEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 模态框关闭
        subCancel () {
            // this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
            this.barCodeModal = false
        },
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
        // 查询品类下拉
        getGoodsCategoryFindBySelected () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'POST'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    const newArr = this.initTree(data)
                    this.$set(this.conditions[2], 'selectDataArr', newArr)
                }
            })
        },
        // 查询部门
        queryOldErpStoreList () {
            axios({
                // URL: 'http://192.168.198.134:8082',
                path: 'queryStoreList',
                method: 'POST'
                // isOld: true
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data || []
                    data.forEach((i, index) => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.oldErpStoreArr = [...data]
                }
            })
        },
        getOldErpProvider (e) {
            if (e && e.length > 1) {
                if (this.timer) { clearTimeout(this.timer) }
                this.timer = setTimeout(() => {
                    this.queryOldErpProviderList(e)
                }, 300)
            }
        },
        // 查询供应商
        queryOldErpProviderList (e) {
            axios({
                // URL: 'http://192.168.198.134:8082',
                path: 'queryProviderList',
                method: 'POST',
                // isOld: true,
                body: {
                    page: 1,
                    rows: 50,
                    condition: e
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list || []
                    data.forEach((i, index) => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = `${i.code}-${i.name}`
                    })
                    this.oldErpProviderArr = [...data]
                }
            })
        },
        // 查询经营机构
        queryOldErpContractType () {
            this.oldErpContractTypeArr = []
            if (this.form.getFieldsValue().classCode && this.otherSkuInfo.c_provider) {
                axios({
                    path: 'queryContractType',
                    method: 'POST',
                    body: {
                        classCode: this.form.getFieldsValue().classCode,
                        brandCode: this.form.getFieldsValue().brandCode,
                        providerCode: this.otherSkuInfo.c_provider.split('-')[0]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data || []
                        const arr = []
                        data.forEach((i, index) => {
                            arr.push({
                                key: index,
                                title: i,
                                value: i
                            })
                        })
                        this.oldErpContractTypeArr = [...arr]
                    }
                })
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CommoditySKU') {
                this.getSKUStatus()
                this.getGoodsCategoryFindBySelected()
            }
        }
    }
}
</script>

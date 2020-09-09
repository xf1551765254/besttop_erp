<!--
 * @Description: 捆绑商品
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lin
 * @Date: 2019-03-07 17:30:03
 * @LastEditTime: 2019-08-27 13:58:22
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
    <!-- 单据 新增和编辑 -->
    <bt-modal
      v-model="addEditModel"
      :title="BundGoodsAddEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">申请人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :filterOption="false"
                v-decorator="$check('BundleGoods.applyBy',{initialValue:tableSingleData.applyBy})"
                placeholder="请选择申请人"
                :options="applyByDorpArr"
                @search="handleApplyByDorpArr"
                showSearch
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeEffectRef"
                mode="multiple"
                :maxTagCount="1"
                placeholder="请选择生效分店,默认为全选"
                style="width: 85%"
                :open="false"
                :options="makeStoreCodeDorpArr"
                v-model="tempObjArrEffect"
                allowClear/>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                :disabledDate="disabledDateStar"
                style="width:100%"
                v-decorator="$check('BundleGoods.startTime', {initialValue:tableSingleData.startTime||setStartTime})"
                @change="changeData"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDateEnd"
                @change="changeDataEndTime"
                v-decorator="$check('BundleGoods.endTime', {initialValue:tableSingleData.endTime||setEndTime})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">捆绑限制</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%px"
                placeholder="请选择捆绑限制"
                v-decorator="$check('BundleGoods.bindQuantity',{initialValue:tableSingleData.bindQuantity||0})"
                allowClear
                showSearch
                :filterOption="filterOption"
                @change="handleBindtityChange">
                <a-select-option :value="0">0-不限制</a-select-option>
                <a-select-option :value="1">1-只能选一个</a-select-option>
                <a-select-option :value="2" >2-最多选两个</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">主销售商品</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item class="mainStore">
              <a-input
                ref="mainSkuCode"
                style="width:85%"
                disabled
                placeholder="请选择主销售商品"
                v-decorator="$check('BundleGoods.mainSkuCodeSame', {initialValue:tableSingleData.mainSkuCodeSame})"
                allowClear/>
              <a href="javascript:;" @click="selectFocusMain">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">主商品零售价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder=""
                disabled
                v-decorator="$check('BundleGoods.price', {initialValue:tableSingleData.price})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">主销售商品规格</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder=""
                disabled
                v-decorator="$check('BundleGoods.mainSkuModel', {initialValue:tableSingleData.mainSkuModel})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">捆绑后售价</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                placeholder="请输入捆绑后售价"
                v-decorator="$check('BundleGoods.mainSkuPrice', {initialValue:tableSingleData.mainSkuPrice||0.00})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('BundleGoods.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 生效分店 -->
      <store :visible.sync="storeQueryEffect" @onSelect="onStoreSelectEffect" :defaultSelect="tempObjArrEffect" multiple/>
      <!-- 主销售商品 -->
      <goods :visible.sync="storeQueryMain" @onSelect="onStoreSelectMain" :defaultSelect="tempObjArrMain" :multiple="false"/>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div>
        <a-button size="small" @click="addDetails" style="margin-bottom:5px">新增</a-button>
        <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="skuCode"
          :columns="tableColumns"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x: 1040 }"
          :dataSource="BundleGoodsData"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['priceDisc','quantity',]" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input-number
                v-if="col === 'priceDisc'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.tb_web_id, col)" />
              <a-input-number
                v-else-if="col === 'quantity'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.tb_web_id, col)" />
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
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeBy}-${defauilForm.makeName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.makeTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        margin: 0 10px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
    .mainStore .ant-select-arrow svg{
        display:none;
    }
</style>
<script>
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from '@pages/marketing/BundledGoodsSettings/preview/bundledGoodsPreview'
import { axios } from '@/utils/request'
import moment from 'moment'
import goods from './goods'
import store from '@comp/BasicQuery/store'
export default {
    name: 'BundledGoodsSettings',
    components: { NewTable, SeachBox, goods, store, BtModal, Preview },
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
                        type: 'group_goods_define_status'
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
                    key: 'mainSkuCode',
                    type: 'input',
                    title: '商品编码'
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
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'BundledGoodsSettings.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'BundledGoodsSettings.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'BundledGoodsSettings.verify',
                    fc: this.auditHandler
                },
                { name: '预览',
                    action: 'BundledGoodsSettings.get',
                    fc: this.detailHandler
                }
            ],
            // 新增 编辑 单据
            // 弹框
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            BundGoodsAddEditModalTitle: '', // 弹框title
            submitLoading: false,
            // 表单
            form: this.$form.createForm(this),
            disabledDateString: moment(), // 开始时间的值
            endTimeData: moment().add({ days: 1 }), // 结束时间的值
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                makeBy: `${this.$store.getters.code}`,
                makeName: `${this.$store.getters.name}`,
                makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 表格
            selectedRowKeys: [], // 选中的值 skucode
            selectedRows: [], // 选中的值
            tableColumns: [ // 表头
                { title: '序号', width: 70, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '捆绑商品编码', dataIndex: 'skuCode', width: 150, align: 'center', sorter: (a, b) => a.skuCode - b.skuCode },
                { title: '捆绑商品名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '捆绑商品规格', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'unit', width: 100, align: 'center' },
                { title: '零售价（元）', dataIndex: 'price', width: 100, align: 'center' },
                { title: '捆绑设定价（元）', dataIndex: 'priceDisc', width: 150, align: 'center', scopedSlots: { customRender: 'priceDisc' } },
                { title: '捆绑数量', dataIndex: 'quantity', width: 100, align: 'center', scopedSlots: { customRender: 'quantity' } },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            BundleGoodsData: [], // 表体
            delIdArr: [], // 详情表格删除的id
            /// 增加的商品
            goodsQuery: false,
            isAdd: false, // 判断是不是新增
            muchNum: 0, // 捆绑商品数量
            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            applyByDorpArr: [], // 申请人
            makeStoreCodeDorpArr: [], // 制单位置
            tempObjArrEffect: [], // 生效分店
            storeQueryEffect: false, // 生效分店
            storeQueryMain: false,
            tempObjArrMain: [],
            tempObjArrMainString: ''
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
        this.$nextTick(() => {
            console.log(this.$refs.newTable)
            this.tableCode = '246965cf384d4fb8824dc234a77c490d:BundledGoodsSettings'
            this.tableApiPath = 'GroupDefineQuery'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getMakeStoreCodeDorpArr()
    },
    methods: {
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
        selectFocusMain () {
            this.storeQueryMain = true
            this.tempObjArrMain = []
            this.$refs.mainSkuCode.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        onStoreSelectMain (mainArr) {
            const targetObj = { ...mainArr[0] }
            // const targetObj = newData.filter(item => item.skuCode === mainArr[0].skuCode)[0]
            if (targetObj) {
                this.form.setFieldsValue({
                    mainSkuCodeSame: `${targetObj.skuCode} - ${targetObj.skuName}`,
                    price: targetObj.skuPrice,
                    mainSkuModel: targetObj.skuModel
                })
                this.tableSingleData.mainSkuCode = targetObj.skuCode
            } else {
                this.form.setFieldsValue({
                    price: '',
                    mainSkuModel: ''
                })
            }
        },
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'GroupDefineQuery'
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
                this.$refs.newTable.exportFile('GroupDefineQuery')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'GroupDefineQuery' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(tableRow)
            if (tableRow.status === 'group_goods_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
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
                const isAuit = newData.filter(o => o.status !== 'group_goods_define_status:1')
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
                        path: 'GroupDefineDelete', // 接口path名，必传
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
                        path: 'GroupDefineAudit', // 接口path名，必传
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
        /**
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (tableSingleDataP) {
            this.delIdArr = []
            this.addEditModel = true
            if (tableSingleDataP === -1) {
                this.$nextTick(() => {
                    this.disabledDateString = moment()
                })
                this.isAdd = true
                this.BundGoodsAddEditModalTitle = '新增捆绑商品'
                this.tableSingleData = {}
                this.BundleGoodsData = []
                this.tempObjArrEffect = []
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.makeBy = `${this.$store.getters.code}`
                this.defauilForm.makeName = `${this.$store.getters.name}`
                this.defauilForm.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.isAdd = false
                this.BundGoodsAddEditModalTitle = '编辑捆绑商品'
                const obj = { ...tableSingleDataP }
                obj.mainSkuCodeSame = `${obj.mainSkuCode} - ${obj.mainSkuName}`
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.makeBy = obj.makeBy
                this.defauilForm.makeName = obj.makeName
                this.defauilForm.makeTime = moment(obj.makeTime).format('YYYY-MM-DD HH:mm:ss')
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                obj.makeTime = moment(obj.makeTime)
                this.$nextTick(() => {
                    this.disabledDateString = obj.startTime
                })
                this.endTimeData = obj.endTime
                this.getApplyByDorpArr(obj.applyBy)
                if (!obj.storeCode) {
                    this.tempObjArrEffect = []
                } else {
                    obj.storeCode = obj.storeCode.split(',')
                    this.tempObjArrEffect = [...obj.storeCode]
                }
                this.tableSingleData = obj
                console.log(this.tableSingleData)
                this.tableSingleData.price = this.tableSingleData.price.toFixed(2)
                axios({
                    path: 'GroupDefineQueryDetail',
                    method: 'post',
                    body: {
                        groupDefineId: tableSingleDataP.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        for (const i of res.data.list) {
                            i.tb_web_id = i.skuCode
                        }
                        this.BundleGoodsData = res.data.list
                    }
                })
            }
        },
        /**
         * @name: 查询申请人
         */
        handleApplyByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.applyByDorpArr.length = 0
                this.getApplyByDorpArr(value)
            }, 300)
        },
        /**
         * @name: 申请人
         * @msg:
         * @param {type}
         * @return:
         */
        getApplyByDorpArr (value) {
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
                    this.applyByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 机构
         * @msg:
         * @param {type}
         * @return:
         */
        getMakeStoreCodeDorpArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.makeStoreCodeDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 下拉框过滤修改
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 开始时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateStar (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 开始时间改变时
         * @msg:
         * @param {type}
         * @return:
         */
        changeData (data, dataString) {
            this.disabledDateString = dataString
            return dataString
        },
        /**
         * @name:结束时间
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateEnd (curent) {
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
         * @name: 捆绑限制 value 切换
         * @msg:
         * @param {type}
         * @return:
         */
        handleBindtityChange (value) {
            this.muchNum = 0
        },
        /**
         * @name: 详情 新增
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            if (!this.$refs.mainSkuCode.value) {
                this.$message.warning('请选择主销售商品')
            } else {
                this.goodsQuery = true
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
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.BundleGoodsData]
                const hasIdArr = map(this.selectedRows, 'id')
                if (hasIdArr.length > 0) {
                    hasIdArr.forEach(item => {
                        this.delIdArr.push(item)
                    })
                }
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.BundleGoodsData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.BundleGoodsData]
                this.BundleGoodsData = newData.filter(item => item.tb_web_id !== keyId)
                const selectId = newData.filter(item => item.tb_web_id === keyId)[0]
                if (selectId.id) {
                    this.delIdArr.push(selectId.id)
                }
            }
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, key) {
            const newData = [...this.BundleGoodsData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (!val) {
                    target[key] = 0
                } else {
                    target[key] = val
                }
                this.BundleGoodsData = newData
            }
        },
        /**
         * @name: 增加 的商品
         */
        onSelectAddGoods (addSeleckData) {
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.BundleGoodsData.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    this.BundleGoodsData.push({
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        skuModel: mun.skuModel,
                        price: mun.skuPrice,
                        unit: mun.skuUnit,
                        tb_web_id: mun.skuCode,
                        priceDisc: Number(0).toFixed(2),
                        quantity: 1
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
        submitInfo (e) {
            const _this = this
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (_this.BundleGoodsData.length === 0) {
                        _this.$message.warning('您没有添加明细')
                        return
                    }
                    if (!_this.isAdd) {
                        values.id = _this.tableSingleData.id
                    }
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.makeTime = this.defauilForm.makeTime
                    values.storeCode = this.tempObjArrEffect.join(',')
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.ids = _this.delIdArr
                    values.mainSkuCode = this.tableSingleData.mainSkuCode
                    values.detail = _this.BundleGoodsData
                    _this.submitLoading = true
                    axios({
                        path: _this.isAdd ? 'GroupDefineAdd' : 'GroupDefineUpdate',
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
            if (to === 'BundledGoodsSettings') {
                this.getMakeStoreCodeDorpArr()
            }
        },
        disabledDateString (val, oldval) {
            if (val) {
                if ((moment(val)).isAfter(this.endTimeData)) {
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

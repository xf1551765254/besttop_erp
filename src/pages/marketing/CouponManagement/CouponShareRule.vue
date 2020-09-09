<!--
 * @Description: 促销券分摊
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-06 11:16:35
 * @LastEditors: lin
 * @LastEditTime: 2019-08-19 15:02:39
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
    <!-- 新增 编辑  -->
    <bt-modal
      :title="AddEditModalTitle"
      v-model="AddEditModal"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <a-form :form="form">
        <a-row class="titleSet" style="">基础信息</a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">促销券类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择促销券类型"
                :filterOption="filterOption"
                style="width: 100%"
                :options="couponTypeDropArr"
                v-decorator="$check('CouponRuleVli.scheduleCouponTypeDefineCode', {initialValue:tableSingleData.scheduleCouponTypeDefineCode})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('CouponRuleVli.name', {initialValue:tableSingleData.name||''})"/>
            </a-form-item>
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
          <a-col :sm="8" :md="4" :xl="3" >有效期类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择有效期类型"
                style="width:100%"
                v-decorator="$check('CouponRuleVli.effectType', {initialValue:tableSingleData.effectType||0})">
                <a-select-option :value="1">临时有效</a-select-option>
                <a-select-option :value="0">长期有效</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">开始日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                :disabledDate="disabledDateStart"
                style="width:100%"
                v-decorator="$check('CouponRuleVli.startTime', {initialValue:tableSingleData.startTime})"
                @change="changeData"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">结束日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width:100%"
                :disabledDate="disabledDate"
                v-decorator="$check('CouponRuleVli.endTime', {initialValue:tableSingleData.endTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('CouponRuleVli.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 商品列表 -->
      <div>
        <a-row class="titleSet" style="">商品列表</a-row>
        <a-button size="small" @click="addDetails('detailOne')" style="margin-bottom:5px">选择商品</a-button>
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumns"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x: 1400}"
          :dataSource="detailTableData" >
          <template v-for="col in ['skuName','concatClass','concatBrand','rateProviderOne','note']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <div v-if="col==='skuName'||col==='concatClass'||col==='concatBrand'">
                <a-tooltip v-if="text&&text.length > 18" :key="text" :title="text">
                  <span>{{ `${text.slice(0, 18)}...` }}</span>
                </a-tooltip>
                <span v-else> {{ text }} </span>
              </div>
              <a-input-number
                v-if="col === 'rateProviderOne'"
                style="margin: -3px 0; width:100%;height:28px"
                :min="0.00"
                :max="100"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputDetailDataChange(e, record.tb_web_id, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -3px 0; width:100%;height:28px"
                :value="text"
                @change="e => InputDetailDataChange(e.target.value, record.tb_web_id, col)"/>
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
    <classBrandSku ref="classBrandSkuRef" :visible.sync="detailQuery" :btnTitleType="false" :pams="getUseCoinData" @onSelect="value=>selectSku(value,'dateilOne')"></classBrandSku>
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
import store from '@comp/BasicQuery/store'
import classBrandSku from '@pages/marketing/ActivityRuleSheet/components/classBrandSku'
import Preview from '@pages/marketing/CouponManagement/preview/CouponShareRulePreview'
export default {
    name: 'CouponShareRule',
    components: { NewTable, SeachBox, BtModal, store, classBrandSku, Preview },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
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
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
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
                    action: 'CouponShareRule.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'CouponShareRule.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'CouponShareRule.verify',
                    fc: this.auditHandler
                }, { name: '预览',
                    action: 'CouponShareRule.get',
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
                makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 时间
            disabledDateStarting: moment().startOf('day'),

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值

            // 商品列表
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类', dataIndex: 'concatClass', align: 'center', width: 200, scopedSlots: { customRender: 'concatClass' } },
                { title: '品牌', dataIndex: 'concatBrand', align: 'center', width: 200, scopedSlots: { customRender: 'concatBrand' } },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 120 },
                { title: '零售价（元）', dataIndex: 'skuPrice', align: 'center', width: 100 },
                { title: '单位', dataIndex: 'unit', align: 'center', width: 80 },
                { title: '分摊比率（%）', dataIndex: 'rateProviderOne', align: 'center', width: 120, scopedSlots: { customRender: 'rateProviderOne' } },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } }
            ],
            detailTableData: [],

            noteCB: '',
            rateProviderOneCB: '0', // 有品牌品类的分摊比率

            // 增加商品弹框
            detailQuery: false,
            getUseCoinData: {
                makeStoreCode: this.$store.getters.storeInfo.code,
                typeDefineCode: ''
            },

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: [],
            couponTypeDropArr: [] //
        }
    },
    computed: {},
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '6d74fdc202e242809e6d25ce381587cf:CouponShareRule'
            this.tableApiPath = 'ScheduleCouponShareDefineFindRuleDefinePageList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getCouponTypeDropArr()
        this.getEffectStoreArr()
        this.getStatusDropArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'ScheduleCouponShareDefineFindRuleDefinePageList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = { }
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
                this.$refs.newTable.exportFile('ScheduleCouponShareDefineFindRuleDefinePageList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ScheduleCouponShareDefineFindRuleDefinePageList' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'code')
            this.tableRowsArr = KeyRows
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
            if (tableRow.status === 'schedule_coupon_share_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
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
                const isAuit = newData.filter(o => o.status !== 'schedule_coupon_share_define_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delEventData.code)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'ScheduleCouponShareDefineBatchDelete', // 接口path名，必传
                        method: 'post',
                        body: {
                            codeList: arr,
                            makeBy: _this.$store.getters.code
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
                        path: 'ScheduleCouponShareDefineBatchVerify', // 接口path名，必传
                        method: 'post',
                        body: {
                            codeList: [ autiData.code ],
                            makeBy: _this.$store.getters.code
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
                this.AddEditModalTitle = '新增促销券分摊规则'
                this.tableSingleData = {}
                this.tempObjArrEffect = [] // 有效机构
                this.detailTableData = []
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.makeBy = `${this.$store.getters.code}`
                this.defauilForm.makeName = `${this.$store.getters.name}`
                this.defauilForm.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.$nextTick(() => {
                    this.disabledDateStarting = moment().startOf('day')
                })
            } else {
                const { mul } = this.$math
                this.isAdd = false
                this.AddEditModalTitle = '编辑促销券分摊规则'
                const obj = { ...addEditData }
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.makeBy = obj.createBy
                this.defauilForm.makeName = obj.createByName
                this.defauilForm.makeTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                obj.startTime = moment(obj.startTime)
                obj.endTime = moment(obj.endTime)
                this.$nextTick(() => {
                    this.disabledDateStarting = obj.startTime
                })
                this.tempObjArrEffect = obj.effectStoreCode
                this.tableSingleData = obj
                axios({
                    path: 'ScheduleCouponShareDefineFindOne',
                    methods: 'post',
                    body: {
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data.detailList]
                        data.forEach(item => {
                            item.tb_web_id = item.id
                            item.rateProviderOne = mul(item.rateProvider, 100, 2)
                            item.concatClass = item.classCodeName
                            item.concatBrand = item.brandCodeName
                            if (item.skuCode) {
                                item.classCodeName = undefined
                                item.brandCodeName = undefined
                            }
                        })
                        this.detailTableData = data
                    }
                })
            }
            this.AddEditModal = true
        },
        /* @name: 弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const { div } = this.$math
                    const newData = [...this.detailTableData]
                    if (newData.length === 0) {
                        return this.$message.error('请选择商品明细')
                    }
                    newData.forEach(item => {
                        item.rateProvider = div(item.rateProviderOne, 100, 4)
                        if (!item.skuCode) {
                            item.classCodeName = item.concatClass
                            item.brandCodeName = item.concatBrand
                        }
                    })
                    values.createBy = this.defauilForm.makeBy
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    if (!this.isAdd) {
                        values.code = this.tableSingleData.code
                    }
                    values.endTime = values.endTime.startOf('day').format('YYYY-MM-DD')
                    values.startTime = values.startTime.startOf('day').format('YYYY-MM-DD')
                    values.effectStoreCode = this.tempObjArrEffect
                    values.detailList = newData
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ScheduleCouponShareDefineAddSelective' : 'ScheduleCouponShareDefineUpdateSelective',
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
         * @name: 生效分店弹框
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效分店
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 时间
         */
        disabledDateStart (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        changeData (data, dataStarting) {
            if (data) {
                this.disabledDateStarting = data.startOf('day')
            } else {
                this.disabledDateStarting = moment().startOf('day')
            }

            const form = this.form
            const endTime = form.getFieldValue('endTime')
            if (endTime) {
                if (data.isAfter(endTime)) {
                    this.form.setFieldsValue({
                        endTime: moment(data)
                    })
                }
            }
        },
        disabledDate (curent) {
            return moment(curent).isBefore(this.disabledDateStarting)
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
                if (key === 'rateProviderOne') {
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
        addDetails (data) {
            const obj = {
                categoryTagArr: [],
                brandTagArr: [],
                tableData: []
            }
            let tableDataArr = []
            tableDataArr = [...this.detailTableData]
            this.noteCB = ''
            this.rateProviderOneCB = '0'
            if (tableDataArr.length > 0) {
                const skuTableArr = tableDataArr.filter(o => o.skuCode)
                obj.tableData = [...skuTableArr]
                const target = tableDataArr[0]
                // console.log(target)
                if (target.concatClass && !target.skuCode) {
                    obj.categoryTagArr = target.concatClass.split(',')
                    this.rateProviderOneCB = target.rateProviderOne
                    this.noteCB = target.note
                }
                if (target.concatBrand && !target.skuCode) {
                    obj.brandTagArr = target.concatBrand.split(',')
                    this.rateProviderOneCB = target.rateProviderOne
                    this.noteCB = target.note
                }
            }
            this.$refs.classBrandSkuRef.getDataArr(obj)
            this.getUseCoinData.typeDefineCode = this.form.getFieldValue('scheduleCouponTypeDefineCode') || ''
            this.detailQuery = true
        },
        /**
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        selectSku (obj, key) {
            const tableDataArr = []
            if (obj.categoryTagArr.length !== 0 || obj.brandTagArr.length !== 0) {
                tableDataArr.push({
                    concatClass: obj.categoryTagArr.join(','),
                    concatBrand: obj.brandTagArr.join(','),
                    rateProviderOne: this.rateProviderOneCB,
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
                        concatClass: item.concatClass,
                        concatBrand: item.concatBrand,
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        unit: item.unit,
                        skuPrice: item.skuPrice,
                        skuModel: item.skuModel,
                        className: item.className,
                        brandName: item.brandName,
                        rateProviderOne: item.rateProviderOne,
                        note: item.note,
                        tb_web_id: uuid.v1().replace(/-/g, '')

                    })
                })
            }
            this.detailTableData = [...tableDataArr]
        },
        /**
         * @name: 券类型
         */
        getCouponTypeDropArr () {
            axios({
                path: 'ScheduleCouponTypeDefineQueryDefineList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.couponTypeDropArr = dataArr
                }
            })
        },
        /**
         * @name:状态
         */
        getStatusDropArr () {
            axios({
                path: 'DistOriginDataQueryScheduleCouponShareDefineStatusList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    this.$set(this.conditions[1], 'selectDataArr', dataArr)
                }
            })
        },
        /**
         * @name:  生效机构
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
         * @name: 搜索
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /* @name: 详情
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'CouponShareRule') {
                this.getCouponTypeDropArr()
                this.getEffectStoreArr()
                this.getStatusDropArr()
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
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

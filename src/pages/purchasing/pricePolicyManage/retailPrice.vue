<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-07 09:00:27
 * @LastEditTime: 2019-08-26 16:07:24
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange"
    ></NewTable>
    <!-- 弹窗 -->
    <bt-modal
      v-model="editVisible"
      title="零售价格调整"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPrice.originalCode', {initialValue:billsForm.originalCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效机构</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="storeRef"
                mode="multiple"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请选择生效机构"
                :maxTagCount="1"
                style="width:85%"
                :options="effectStoreLIst"
                :open="false"
                @focus="selectFocusEffect"
                v-model="tempObjArr"
                allowClear/>
              <a href="javascript:;" @click="selectFocusEffect">
                <a-icon style="width:15%;line-height:36px;" type="edit" />
              </a>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">生效日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('contract.effectTime',{initialValue:billsForm.effectTime || effectTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width:100%"
                placeholder="请检索负责人"
                v-decorator="$check('BillPrice.managerBy', {initialValue:billsForm.managerBy})"
                :options="managerLyList"
                :filterOption="false"
                @search="applicantSearch"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPrice.storeCode', { initialValue:billsForm.storeCode || storeCode})" disabled/>
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
                v-decorator="$check('BillPrice.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">零售价格明细</h4>
        <a-button class="editable-add-btn" @click="addRow">新增</a-button>
        <a-button class="editable-add-btn" type="danger" @click="onDelete(-1)">删除</a-button>
        <a-table
          rowKey="bt_web_id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="scrollXY">
          <template v-for="col in ['priceMin','newPrice', 'deductionRate']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input-number
                v-if="col === 'newPrice'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-input-number
                v-else-if="col === 'deductionRate'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :step="1"
                :precision="2"
                :formatter="value => `${value}% `"
                :parser="value => value.replace('%', '')"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <a-input-number
                v-else-if="col === 'priceMin'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span v-if="record.editable">
                <a @click="() => saveRow(record.bt_web_id)" style="margin-right:10px;">保存</a>
                <a-popconfirm title="是否取消编辑?" @confirm="() => cancelRow(record.bt_web_id)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="() => edit(record.bt_web_id)" style="margin-right:10px;" v-if="editDel">编辑</a>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(record.bt_web_id)" okText="是" cancelText="否">
                  <a href="#">删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>

        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPrice.createBy', {initialValue:billsForm.createBy || createBy})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3"></a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillPrice.createTime', {initialValue:billsForm.createTime || createTime})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelect" multiple/>
      <!-- 生效分店 -->
      <schemaInformation :visible.sync="storeQuery" @onSelect="onStoreSelect" :pams="storeStatus" :defaultSelect="tempObjArr" multiple/>
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
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>
<script>
import goods from '@pages/purchasing/pricePolicyManage/toop/goods'
// 导入生效分店组件
import schemaInformation from '@pages/purchasing/pricePolicyManage/toop/schemaInformation'
import Preview from '@pages/purchasing/pricePolicyManage/preview/retailPricePreview'
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
import is from 'is_js'
import map from 'lodash.map'
import Order from '@comp/order'
import getStatus from '@comp/statusAll/getStatus'
const billsData = []
export default {
    name: 'RetailPrice',
    components: { seachBox, NewTable, goods, schemaInformation, BtModal, Preview, Order },
    data () {
        this.cacheData = billsData.map(item => ({ ...item }))
        return {
            previewVisbel: false,
            totalAmount: 0,
            storeStatus: {
                include: {}
            },
            tags: [],
            orderId: '',
            editDel: false,
            storeQuery: false,
            tempObjArr: [],
            bt_id: '',
            disContextMenu: [],
            bt_Save: false,
            effectTime: moment().add({ days: 1 }),
            storeCode: `${this.$store.getters.storeInfo.code}-${this.$store.getters.storeInfo.name}`,
            createBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`,
            createTime: '',
            billsForm: {},
            goodsQuery: false,
            count: 0,
            // 单据表体
            billsData,
            // 单据表头
            columns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '审定售价', dataIndex: 'newPrice', width: 100, align: 'center', scopedSlots: { customRender: 'newPrice' } },
                { title: '限价', dataIndex: 'priceMin', width: 100, align: 'center', scopedSlots: { customRender: 'priceMin' } },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '单位', dataIndex: 'unit', width: 50, align: 'left' },
                { title: '原售价', dataIndex: 'origPrice', align: 'right', width: 100 },
                { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            // 生效分店展示数量
            maxTagCount: 1,
            // 获取分店
            effectStoreLIst: [],
            // 获取申请人
            managerLyList: [],
            // 弹窗标题
            title: '',
            // 按钮状态
            loading: false,
            // 弹窗开关
            editVisible: false,
            // 表单
            form: this.$form.createForm(this),
            // 单据表格选中数据
            selectedRowKeys: [],

            // 右击选中数据
            auditObj: [],
            // 删除选中
            deleteAll: [],
            // 绑定搜索
            seachValue: {
                auditTimeA: moment().subtract({ days: 7 }),
                auditTimeB: moment()
            },
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            // 工具栏搜索框
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单开始时间',
                    key: 'auditTimeA',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'auditTimeB',
                    type: 'date'
                },
                {
                    title: '单据状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '制单人',
                    key: 'createBy',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                }

            ],
            tableCode: '',
            tableApiPath: '',
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'retailPrice.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'retailPrice.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'retailPrice.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'retailPrice.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ],
            scrollXY: {
                x: 1450,
                y: 350
            },
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '350963ba01ae4de9b4601a122e061747:retailPrice'
            this.tableApiPath = 'BillPriceQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_price_status', this.conditions[3])
        this.seachValue = {
            status: 'bill_price_status:1',
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment()
        }
        this.organizationFun()
    },
    methods: {
        organizationFun () {
            axios({
                path: 'OrganizationStoreQueryStoreByOrganize',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data)
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.effectStoreLIst = [...data]
                    console.log(this.effectStoreLIst, '6666666666666666666666')
                }
            })
        },
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        onAmount (data) {
            const arr = []
            const { add } = this.$math
            for (const i of data) {
                arr.push(i.countNow)
            }
            // 零售价总额
            const amountSaleAll = arr.reduce((prev, cur) => {
                return add(prev, cur, 2)
            }, 0)
            this.totalAmount = amountSaleAll.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            console.log(this.totalAmount, '调整价格')
        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 删除
         */
        onDelete (del) {
            const that = this
            this.$confirm({
                title: '删除',
                content: '是否确认删除当前选中信息?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    that.categoryinfoDelete(del)
                },
                onCancel () {

                }
            })
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            const newarr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...newarr, ...map(arr, 'code')])] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQuery = true
            this.$refs.storeRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name:获取选中商品
         */
        onSelect (e) {
            console.log(e, '选择商品')
            const { mul } = this.$math
            const error = []
            e.forEach(mun => {
                const has = this.billsData.filter(o => o.skuCode === mun.code)
                if (has.length === 0) {
                    this.billsData.push({
                        index: this.indexNumber++,
                        skuCode: mun.code,
                        skuName: mun.name,
                        skuModel: mun.model,
                        unit: mun.basicUnit,
                        skuType: mun.status,
                        skuTypeName: mun.skuStatus,
                        origPrice: mun.price,
                        goodsNum: mun.numbers,
                        bt_web_id: mun.code,
                        newPrice: mun.price,
                        origDeductionRate: mun.rate,
                        origDeductionRates: this.rateTransform(mun.rate),
                        deductionRate: mul(mun.rate, 100),
                        countNow: 0,
                        priceMin: 0

                    })
                } else {
                    error.push(mun.name)
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
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del)
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].bt_web_id === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.bt_web_id !== del)
            }
            this.selectedRowKeys = []
        },
        /**
         * @name: 保存编辑
         */
        saveRow (e) {
            console.log(e)
            const newData = [...this.billsData]
            const target = newData.filter(item => e === item.bt_web_id)[0]
            if (target) {
                console.log(target)
                delete target.editable
                this.billsData = newData
                this.cacheData = newData.map(item => ({ ...item }))
            }
        },
        /**
         * @name:监听单据表格编辑
         */
        InputChange (val, count, key) {
            if (!val || is.not.number(val)) return
            const { sub, mul } = this.$math
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                target[key] = val
                if (key === 'newPrice') {
                    for (const i of newData) {
                        if (i.bt_web_id === count) {
                            Object.assign(target, { countNow: mul(sub(val, i.origPrice), i.goodsNum) })
                        }
                    }
                }
                console.log(target, '监听')
                // this.onAmount(newData)
                this.billsData = newData
            }
        },
        /**
         * @name: 单据表格行编辑按钮
         */
        edit (index) {
            console.log(index)
            const newData = [...this.billsData]
            console.log(newData, '编辑')
            this.cacheData = newData.map(item => ({ ...item }))
            let target = newData[index]
            for (const item of newData) {
                if (item.bt_web_id === index) {
                    target = item
                }
            }
            if (target) {
                target.editable = true
                this.billsData = newData
            }
        },
        /**
         * @name: 取消单据行编辑
         */
        cancelRow (key) {
            const newData = [...this.billsData]
            const target = newData.filter(item => key === item.bt_web_id)[0]
            if (target) {
                console.log(target)
                Object.assign(target, this.cacheData.filter(item => key === item.bt_web_id)[0])
                delete target.editable
                this.billsData = newData
            }
        },
        /**
         * @name: 单据表格新增行
         */
        addRow () {
            this.goodsQuery = true
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 生效时间过滤
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
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
                        this.managerLyList = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 关闭弹窗
         */
        subCancel () {
            this.editVisible = false
        },

        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('b880163d580c4797a89535bf7e0f7aef:retailPrice', { path: 'BillPriceQuery' })
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            if (status === 'bill_price_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            this.organizationFun()
            const { sub, mul } = this.$math
            const arr = { ...e }
            this.orderId = arr.code
            this.tags = ['uncheck']
            this.bt_id = arr.id
            this.editVisible = true
            if (arr.effectStore) {
                arr.effectStore = arr.effectStore.split(',')
                this.tempObjArr = arr.effectStore
            }
            arr.effectTime = moment(arr.effectTime)
            arr.storeCode = `${arr.storeCode}-${arr.storeName}`
            arr.createBy = `${arr.createBy}-${arr.createName}`
            arr.managerBy = arr.managerBy ? `${arr.managerBy}-${arr.managerByName}` : ''
            console.log(arr, '是按啊   ')
            this.billsForm = { ...arr }
            axios({
                path: 'BillPritailQuetyByCode',
                method: 'post',
                body: {
                    priceBillCode: arr.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.index = this.indexNumber++
                        i.bt_web_id = i.skuCode
                        i.origDeductionRates = this.rateTransform(i.origDeductionRate)
                        i.deductionRate = mul(i.deductionRate, 100)
                        Object.assign(i, { countNow: mul(sub(i.newPrice, i.origPrice), i.goodsNum) })
                    }
                    this.billsData = res.data.list
                    // if (this.billsData.length > 0) {
                    //     this.onAmount(this.billsData)
                    // }
                }
            })
        },
        /**
         * @name: 保存
         */
        submitData (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    const { div } = this.$math
                    console.log(formDate, '保存')
                    formDate.effectTime = moment(values.effectTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    formDate.billPriceDetails = [...this.billsData]
                    formDate.storeCode = formDate.storeCode.split('-')[0]
                    formDate.createBy = formDate.createBy.split('-')[0]

                    formDate.managerBy = formDate.managerBy ? formDate.managerBy.split('-')[0] : ''

                    if (formDate.billPriceDetails.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                    }
                    if (is.array(this.tempObjArr)) {
                        formDate.effectStore = this.tempObjArr.join(',')
                    }
                    formDate.billPriceDetails.forEach(item => {
                        item.deductionRate = item.deductionRate ? div(item.deductionRate, 100) : 0
                    })
                    this.loading = true
                    axios({
                        path: this.bt_Save ? 'BillPriceUpdate' : 'BillPriceAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.editVisible = false
                            this.getDate()
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.editVisible = true
                this.bt_Save = false
                this.billsData = []
                this.billsForm = {
                    managerBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.tempObjArr = []
                this.orderId = ''
                this.tags = []
                this.title = '新增'
            } else if (e === 'del') {
                console.log('批量删除')
                if (this.deleteAll.length < 1) {
                    return this.$message.warning('您尚未选中任何数据！')
                }
                this.onDel(1)
            } else if (e === 'export') {
                console.log('打印')
                this.$refs.newTable.exportFile('BillPriceQuery', this.seachValue)
            } else if (e === 'print') {
                console.log('导出')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            console.log(e, '编辑')
            if (mun === 'edit') {
                console.log(e, '编辑')
                this.editRow(e)
                this.title = '编辑'
                this.billsData = []
                this.bt_Save = true
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
            }
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, '搜索框数据')
            e.path = 'BillPriceQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            console.log(this.deleteAll.length)
            if (e === 1) {
                if (this.deleteAll.length > 0) {
                    arr = this.deleteAll
                } else {
                    this.$message.warning('您尚未选中任何数据!')
                }
            } else {
                arr.push(e.id)
            }
            const that = this
            this.$confirm({
                title: '删除确认',
                content: '删除后不可恢复，确定继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillPriceDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {

                }
            })
        },
        /**
         * @name: 审核
         */
        auditSumbit (e) {
            const that = this
            this.$confirm({
                title: '审核确认',
                content: '是否确认审核当前信息?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillPriceAudit',
                        method: 'post',
                        body: {
                            id: e.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.getDate()
                        }
                    })
                },
                onCancel () {

                }
            })
        }
    },
    watch: {
        '$store.stare.app.pageName' (val) {
            if (val === 'retailPrice') {
                this.getDate()
                this.organizationFun()
            }
        },
        editVisible (val) {
            if (!val) {
                this.billsData = []
                this.indexNumber = 1
            }
        }
    }
}
</script>

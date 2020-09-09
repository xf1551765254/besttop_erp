<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-07 09:00:27
 * @LastEditTime: 2019-08-23 18:23:05
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
      title="分销价格单"
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
              <a-input v-decorator="$check('BillWholesalePrice.originalCode', {initialValue:billsForm.originalCode})"/>
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
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('BillWholesalePrice.note',{initialValue:billsForm.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">分销价格明细</h4>
        <a-button class="editable-add-btn" @click="()=>{goodsQuery = true}">新增</a-button>
        <a-button class="editable-add-btn" type="danger" @click="categoryinfoDelete(-1)">删除</a-button>
        <a-table
          rowKey="bt_web_id"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          :pagination="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          bordered
          :scroll="scrollXY">
          <template v-for="col in ['applyPrice','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input
                v-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.bt_web_id, col)"
              />
              <a-input-number
                v-else-if="col === 'applyPrice'"
                style="margin: -5px 0;width:100%;"
                :min="0.00"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :value="text"
                @change="e => InputChange(e, record.bt_web_id, col)" />
              <span v-else>{{ text }}</span>
            </div></template>
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
              <a-input v-decorator="$check('BilBillWholesalePricelPrice.createBy', {initialValue:billsForm.createBy || `${$store.getters.userInfo.code}:${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('BillWholesalePrice.createTime', {initialValue:billsForm.createTime || createTime})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelect" multiple/>
      <schemaInformation :visible.sync="storeQuery" :pams="storeStatus" @onSelect="onStoreSelect" multiple :defaultSelect="tempObjArr"/>
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
import schemaInformation from '@pages/purchasing/pricePolicyManage/toop/schemaInformation'
import Preview from '@pages/purchasing/pricePolicyManage/preview/wholesalePriceListPreview'
import goods from '@pages/purchasing/pricePolicyManage/toop/goods'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import moment from 'moment'
import map from 'lodash.map'
import is from 'is_js'
import getStatus from '@comp/statusAll/getStatus'
const billsData = []
export default {
    name: 'WholesalePriceList',
    components: { seachBox, NewTable, goods, schemaInformation, BtModal, Preview },
    data () {
        this.cacheData = billsData.map(item => ({ ...item }))
        return {
            previewVisbel: false,
            storeStatus: {
                include: {}
            },
            tags: [],
            orderId: '',
            editDel: false,
            tempObjArr: [],
            storeQuery: false,
            bt_id: '',
            loading: false,
            bt_Save: false,
            disContextMenu: [],
            // 单据表体
            billsData,
            effectTime: moment().add({ days: 1 }),
            createTime: '',
            billsForm: {},
            // 单据表格选中数据
            selectedRowKeys: [],
            // 获取分店
            effectStoreLIst: [],
            // 弹窗标题
            title: '',
            // 表单
            form: this.$form.createForm(this),
            // 商品弹窗控制
            goodsQuery: false,
            // 表单控制
            editVisible: false,
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
                    // title: '单据状态',
                    // type: 'select',
                    // key: 'status',
                    // path: 'OrganizationConfigFindByType',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // body: { type: 'bill_wholesale_price_status', grade: '1' }
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
            // 单据表头
            columns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
                { title: '规格型号', dataIndex: 'skuModel', width: 300 },
                { title: '原分销价', dataIndex: 'wholesalePrice', width: 100, align: 'right' },
                { title: '现分销价', dataIndex: 'applyPrice', width: 150, align: 'center', scopedSlots: { customRender: 'applyPrice' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', dataIndex: 'operation', width: 50, fixed: 'right', align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'wholesalePriceList.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'wholesalePriceList.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'wholesalePriceList.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                {
                    name: '预览',
                    action: 'wholesalePriceList.get',
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
            this.tableCode = '24887c2430a14571ad4768bd0a8b8454:wholesalePriceList'
            this.tableApiPath = 'BillSalepriceQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_wholesale_price_status', this.conditions[3])
        this.seachValue = {
            status: 'bill_wholesale_price_status:1',
            auditTimeA: moment().subtract({ days: 7 }),
            auditTimeB: moment()
        }
        this.getStore()
    },
    methods: {
        detailsSumbit (e) {
            console.log(e, '详情')
            this.orderId = e.code
            this.previewVisbel = true
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
            const error = []
            e.forEach(mun => {
                const has = this.billsData.filter(o => o.skuCode === mun.code)
                if (has.length === 0) {
                    this.billsData.push({
                        index: this.indexNumber++,
                        skuCode: mun.code,
                        skuName: mun.name,
                        skuModel: mun.model,
                        skuTyp: mun.goodsType,
                        wholesalePrice: mun.priceW,
                        goodsNum: mun.numbers,
                        bt_web_id: mun.code,
                        applyPrice: 0,
                        note: ''
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
         * @name: 保存
         */
        submitData (e) {
            this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.code = this.billsForm.code
                    formDate.effectTime = moment(values.effectTime).startOf('day').format('YYYY-MM-DD HH:mm:ss')
                    formDate.billWholesalePriceDetails = [...this.billsData]
                    formDate.createBy = formDate.createBy.split('-')[0]
                    if (formDate.billWholesalePriceDetails.length < 1) {
                        this.loading = false
                        return this.$message.warning('请先添加明细')
                    }
                    if (this.bt_Save) {
                        formDate.id = this.bt_id
                        console.log(this.bt_id, 'ids')
                    } else {
                        formDate.storeCode = this.$store.getters.storeInfo.code
                    }
                    if (is.array(this.tempObjArr)) {
                        formDate.effectStore = this.tempObjArr.join(',')
                    }
                    axios({
                        path: this.bt_Save ? 'BillSalepriceUpdate' : 'BillSalepriceAdd',
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
         * @name:右键编辑按钮
         */
        editRow (e) {
            this.getStore()
            const arr = { ...e }
            this.orderId = arr.code
            this.tags = ['uncheck']
            console.log(arr, '编辑')
            this.bt_id = arr.id
            if (arr.effectStore) {
                arr.effectStore = arr.effectStore.split(',')
                this.tempObjArr = arr.effectStore
            }
            this.editVisible = true
            arr.effectTime = moment(arr.effectTime)
            arr.createBy = `${arr.createBy}-${arr.createName}`
            this.billsForm = { ...arr }
            axios({
                path: 'BillSpricetailQueryByCode',
                method: 'post',
                body: {
                    whPriceCode: arr.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of res.data.list) {
                        i.bt_web_id = i.skuCode
                        i.index = this.indexNumber++
                    }
                    this.billsData = res.data.list
                }
            })
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
         * @name: 保存单据行编辑
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
         * @name:监听单据表格编辑
         */
        InputChange (val, count, key) {
            const newData = [...this.billsData]
            const target = newData.filter(item => count === item.bt_web_id)[0]
            if (target) {
                console.log(val, count, key, '监听')
                target[key] = val
                this.billsData = newData
            }
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_wholesale_price_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.editVisible = true
                this.bt_Save = false
                this.billsData = []
                this.billsForm = {}
                this.tempObjArr = []
                this.orderId = ''
                this.tags = []
                this.title = '新增'
                this.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else if (e === 'del') {
                console.log('批量删除')
                if (this.deleteAll.length < 1) {
                    return this.$message.warning('您尚未选中任何数据！')
                }
                this.onDel(1)
            } else if (e === 'export') {
                console.log('打印')
                this.$refs.newTable.exportFile('BillSalepriceQuery', this.seachValue)
            } else if (e === 'print') {
                console.log('导出')
            }
        },
        /**
         * @name:表格编辑/删除/审核操作监听
         */
        getRow (e, mun) {
            if (mun === 'edit') {
                console.log(mun, e, '编辑')
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
        // /**
        //  * @name:表格多选方法
        //  */
        // onChange (keys, rows) {
        //     console.log(keys, rows)
        //     this.deleteAll = rows
        // },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            if (e === 1) {
                if (this.deleteAll.length > 0) {
                    arr = this.deleteAll
                } else {
                    this.$message.warning('请选择最少一条数据!')
                }
            } else {
                arr.push(e.id)
            }
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据！')
                return
            }
            const that = this
            this.$confirm({
                title: '删除确认',
                content: '删除后不可恢复，确定继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'BillSalepriceDelete',
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
                        path: 'BillSalepriceAudit',
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
        },
        /**
         * @name:生效分店
         */
        getStore () {
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
            e.path = 'BillSalepriceQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            console.log(rows, '多选')
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
        },
        /**
         * @name: 生效时间过滤
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('cf564715bd9a45fe88dc09fe0e16774f:wholesalePriceList', { path: 'BillSalepriceQuery' })
        }
    },
    watch: {
        editVisible (val) {
            if (!val) {
                this.billsData = []
                this.indexNumber = 1
            }
        }
    }
}
</script>

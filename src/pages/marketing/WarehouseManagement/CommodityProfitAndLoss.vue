<!--
 * @Description: 商品损益
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-26 14:18:20
 * @LastEditTime: 2019-08-20 18:48:27
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
      @onSeach="onSeach"
    />
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    >

    </NewTable>
    <!-- 新增编辑模态框 -->
    <bt-modal
      v-model="commodityAddEditModal"
      :title="commodityAddEditModalTitle"
      :submitClick="isAdd?submitInfo:editSubmitInfo"
      :popconfirm="false"
      :submitLoading="isAdd?submitAddLoading:submitEditLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <!-- 头部信息 -->
      <a-form :form="baseInfoData">
        <a-row class="setDocCss">
          <!-- <a-col :sm="8" :md="4" :xl="3">
            制单位置
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                disabled
                v-decorator="$check('commodityProfitData.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">
            损益类型
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="billsTypeArr"
                v-decorator="$check('commodityProfitData.billType',{initialValue:tableSingleData.billType})"
                allowClear
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            申请人
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="applyerArr"
                v-decorator="$check('commodityProfitData.applyBy',{initialValue:tableSingleData.applyBy})"
                allowClear
                @search="handleApplyByDorpArr"
                :filterOption="false" >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('commodityProfitData.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button type="primary" size="small" @click="addDetails">新增</a-button>
        <a-button class="editable-add-btn" type="danger" size="small" @click="deleteRow(-1)" style="margin-left:10px;margin-right:10px">删除</a-button>
        <!-- <a-button type="primary" size="small" @click="checkInHandler">串号登记</a-button> -->
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="skuCode"
          size="small"
          :columns="tableColumns"
          :dataSource="tableData"
          bordered
          :pagination="false"
          :scroll="{ x:2210}"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['incomeNumber','note']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input-number
                v-if=" col === 'incomeNumber'"
                style="margin: -5px 0;width:100%;"
                :min="-100"
                :max="100"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.tb_web_id, col)"
              />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0"
                :value="text"
                @change="e => InputChange(e.target.value, record.tb_web_id, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => deleteRow(record.skuCode)" okText="是" cancelText="否">
                  <a href=" ">删除</a >
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <a-divider dashed />
      <!-- 尾部信息 -->
      <a-form :form="baseInfoData">
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeBy}-${defauilForm.makeName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.makeTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <!-- 新增 增加的  的表格 -->
      <goods :visible.sync="bGoodsQuery" @onSelect="onSelectAddGoods" :pams="pams" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/CommodityProfitAndLossPreview'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import goods from '@pages/marketing/WarehouseManagement/toop/goods'
export default {
    name: 'CommodityProfitAndLoss',
    components: {
        NewTable,
        SeachBox,
        goods,
        BtModal,
        Preview
    },
    data () {
        return {
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '制单开始日期',
                    type: 'date',
                    key: 'startTime'
                },
                {
                    title: '制单结束日期',
                    type: 'date',
                    key: 'endTime'
                },
                {
                    title: '单据状态',
                    type: 'select',
                    key: 'status',
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    body: {
                        type: 'income_statement_status'
                    },
                    filter: true
                },
                {
                    key: 'makeBy',
                    type: 'select',
                    title: '制单人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            // 搜索的值
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            // 右键菜单
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'CommodityProfitAndLoss.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'CommodityProfitAndLoss.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'CommodityProfitAndLoss.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                }, { name: '预览',
                    action: 'CommodityProfitAndLoss.get',
                    fc: this.detailHandler
                }
            ],
            // 新增编辑模态框
            tags: ['uncheck'], // 单据状态
            commodityAddEditModal: false,
            // 新增编辑模态框头
            commodityAddEditModalTitle: '',
            // form表单数据
            baseInfoData: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                makeBy: `${this.$store.getters.code}`,
                makeName: `${this.$store.getters.name}`,
                makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 生效分店数组
            makeStoreCodeDorpArr: [],
            // 申请人数组
            applyerArr: [],
            // 单据类型数组
            billsTypeArr: [],
            // 详情弹框
            bGoodsQuery: false,
            // 详情表头
            tableColumns: [
                {
                    title: '序号',
                    width: 50,
                    align: 'center',
                    customRender: (text, record, index) => `${index + 1}`,
                    fixed: 'left'
                },
                {
                    title: '品类名称',
                    dataIndex: 'className',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '品类编码',
                    dataIndex: 'classCode',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '品牌编码',
                    dataIndex: 'brandCode',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '商品SKU名称',
                    dataIndex: 'skuName',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '商品SKU编码',
                    dataIndex: 'skuCode',
                    width: 120,
                    align: 'center'
                },
                {
                    title: '规格型号',
                    dataIndex: 'skuModel',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '商品条码',
                    dataIndex: 'barcode',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '零售价',
                    dataIndex: 'price',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '成本价',
                    dataIndex: 'priceCost',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '税率（%）',
                    dataIndex: 'taxRate',
                    width: 100,
                    align: 'center',
                    customRender: (text, record) => `${Number(text * 100).toFixed(2)}`
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '库存数量',
                    dataIndex: 'stockNumber',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '损溢数量',
                    dataIndex: 'incomeNumber',
                    width: 100,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'incomeNumber'
                    }
                },
                {
                    title: '成本金额(含税)',
                    dataIndex: 'taxCost',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '成本金额(不含税)',
                    dataIndex: 'taxFreeCost',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    width: 220,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'note'
                    }
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 70,
                    align: 'center',
                    scopedSlots: { customRender: 'operation' }
                }
            ],
            // 详情表体
            tableData: [],
            // 新增编辑提交确定按钮
            isAdd: true,
            submitAddLoading: false,
            submitEditLoading: false,
            delId: [], // 编辑id
            // 详情表格多选数组classCode
            selectedRowKeys: [],
            // 详情表格多选数组数据
            selectedRowRows: [],
            // 请求品类品牌传的参数
            pams: {},
            // 行信息
            rowObj: {},
            // 转换数量变更标识
            changeFlag: 0,

            // 预览
            previewVisbel: false,
            orderId: ''
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
            this.tableCode = '42616ad945f84432ae143ecbff2ffd9c:commodityProfitAndLoss'
            this.tableApiPath = 'InventoryIncomeStatementQueryIncomeStatement'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'InventoryIncomeStatementQueryIncomeStatement'
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
                    this.$message.warning('请选择要删除的商品')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('InventoryIncomeStatementQueryIncomeStatement', this.seachValue)
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(
                this.tableCode,
                {
                    path: 'InventoryIncomeStatementQueryIncomeStatement'
                }
            )
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = tableRow
            this.tableSingleData.makeTime = moment(tableRow.makeTime).format('YYYY-MM-DD hh:mm:ss')
            if (tableRow.status === 'income_statement_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (k, r) {
            this.tableIdsArr = map(r, 'id')
            this.tableRowsArr = r
        },
        /**
         * @name: 表格编辑、删除、审核操作监听
         * @msg:
         * @param {type}
         * @return:
         */
        getRow (e, mun) {
            this.rowObj = e
            if (mun === 'edit') {
                this.addEdit(e)
            } else if (mun === 'del') {
                this.deleteHandler(e)
            } else if (mun === 'audit') {
                this.isCheck = true
                this.auditHandler(e)
            }
        },
        /**
         * @name: 新增 编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (index) {
            this.queryBillsType()
            if (index === -1) {
                this.isAdd = true
                this.tableData = []
                this.rowObj = {}
                this.tableSingleData = {}
                this.commodityAddEditModalTitle = '新增商品损益'
                this.tableData.forEach(i => {
                    i.incomeNumber = 1
                })
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.makeBy = `${this.$store.getters.code}`
                this.defauilForm.makeName = `${this.$store.getters.name}`
                this.defauilForm.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.isAdd = false
                this.commodityAddEditModalTitle = '编辑商品损益'
                this.defauilForm.makeStoreCode = this.rowObj.makeStoreCode
                this.defauilForm.makeStoreName = this.rowObj.makeStoreName
                this.defauilForm.makeBy = this.rowObj.makeBy
                this.defauilForm.makeName = this.rowObj.makeName
                this.defauilForm.makeTime = moment(this.rowObj.makeTime).format('YYYY-MM-DD HH:mm:ss')
                this.queryReceiveArr(index.applyBy)
                axios({
                    path: 'InventoryIncomeStatementQueryIncomeStatementDetailPage',
                    body: {
                        id: this.rowObj.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(item => {
                            item.tb_web_id = item.id
                        })
                        this.tableData = [ ...data ]
                    }
                })
            }
            this.commodityAddEditModal = true
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
                this.applyerArr.length = 0
                this.queryReceiveArr(value)
            }, 300)
        },
        /**
         * @name: 请求申请人
         */
        queryReceiveArr (value) {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    name: value
                }
            }).then(res => {
                // console.log(res);
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.applyerArr = dataArr
                }
            })
        },
        // 请求单据类型
        queryBillsType () {
            axios({
                path: 'OrganizationConfigFindByType',
                body: {
                    type: 'income_statement_bill_type'
                }
            }).then(res => {
                console.log(res)
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.label = item.value
                        item.value = `${item.type}:${item.configKey}`
                        item.key = `${item.type}:${item.configKey}`
                    })
                    this.billsTypeArr = [...data]
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
         * @name: 新增详情
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            this.bGoodsQuery = true
            this.pams.storeCode = this.$store.getters.storeInfo.code
        },
        /**
         * @name: 详情表格多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectedRowKeys, selectedRowRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRowRows = selectedRowRows
        },
        /**
         * @name: 选择按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectAddGoods (addSeleckData) {
            const { mul, add, div, abs } = this.$math
            // console.log('商品选择器选择的商品---', addSeleckData)
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.tableData.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    this.tableData.push({
                        tb_web_id: mun.skuCode,
                        skuCode: mun.skuCode,
                        className: mun.className,
                        brandName: mun.brandName,
                        brandCode: mun.brandCode,
                        skuName: mun.skuName,
                        skuModel: mun.model,
                        barcode: mun.barCode,
                        price: mun.price,
                        priceCost: mun.priceCost,
                        taxRate: mun.skuRate,
                        unit: mun.basicUnit,
                        stockNumber: mun.curNumber,
                        skuFlag: mun.skuFlag,
                        classCode: mun.classCode,
                        incomeNumber: 1,
                        taxCost: abs(mul(mun.priceCost, 1)),
                        taxFreeCost: abs(mul(1, div(mun.priceCost, add(1, mun.skuRate))))
                    })
                } else {
                    error.push('此类' + mun.skuName)
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
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}classCode
         * @return:
         */
        InputChange (val, count, key) {
            // console.log(56565, val, count, key)
            if (val === undefined) {
                return
            }
            const newData = [...this.tableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                target[key] = val
                if (key === 'incomeNumber') {
                    // 大于库存量判断
                    if (val > target.stockNumber) {
                        this.$message.warning(`${target.skuName}库存数量为${target.stockNumber}，库存数量不足，请重新输入数量`)
                        val = 0
                        this.changeFlag = 1
                    } else if (val === 0) {
                        this.$message.warning('损溢数量不能为0')
                        this.changeFlag = 2
                        return
                    } else if (val === '') {
                        target[key] = 1
                    } else if (val > 0) {
                        const { mul, add, div } = this.$math
                        target['taxCost'] = mul(target['priceCost'], val)
                        target['taxFreeCost'] = mul(val, div(target['priceCost'], add(1, target['taxRate'])))
                    }
                } else {
                    target[key] = val
                }
                this.tableData = newData
            }
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (index) {
            if (index === -1) {
                if (this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择需要删除的数据！')
                    return
                }
                const arr = []
                this.selectedRowRows.forEach(item => {
                    if (item.id) {
                        arr.push(item.id)
                    }
                })
                this.delId = arr
                const infoData = [...this.tableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in infoData) {
                        if (infoData[j].skuCode === this.selectedRowKeys[i]) {
                            infoData.splice(j, 1)
                        }
                    }
                }
                this.tableData = infoData
            } else {
                const infoData = [...this.tableData]
                this.tableData = infoData.filter(item => item.skuCode !== index)
                const target = infoData.filter(item => item.skuCode === index)[0]
                if (target.id) {
                    // console.log()
                    this.delId.push(target.id)
                }
            }
        },
        /**
         * @name: 确认关闭弹框按钮
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.commodityAddEditModal = false
        },
        /**
         * @name: 新增保存按钮
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            const _this = this
            // 清除默认行为
            e.preventDefault()
            const { baseInfoData: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.makeTime = this.defauilForm.makeTime
                    console.log(747474, this.tableData)
                    let detailSubmit = true
                    this.tableData.forEach(item => {
                        item.id = null
                        if (item.incomeNumber === 0) {
                            detailSubmit = false
                        }
                    })
                    formDate.makeStoreCode = this.$store.getters.storeInfo.code
                    if (this.tableData <= 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    } else if (!detailSubmit) {
                        this.$message.warning('请选择损益数量！')
                        return
                    } else if (formDate.billType === undefined) {
                        this.$message.warning('请选择损益类型！')
                        return
                    } else if (formDate.applyBy === undefined) {
                        this.$message.warning('请选择申请人！')
                        return
                    }
                    const addData = {}
                    addData.incomeStatement = formDate
                    addData.incomeStatementDetailList = [...this.tableData]
                    this.submitAddLoading = true
                    axios({
                        path: 'InventoryIncomeStatementAddIncomeStatement',
                        body: addData
                    }).then(res => {
                        this.submitAddLoading = false
                        console.log(res)
                        if (res.flag === 1) {
                            _this.commodityAddEditModal = false
                            _this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 编辑确定按钮
         * @msg:
         * @param {type}
         * @return:
         */
        editSubmitInfo (e) {
            const _this = this
            // alert('222');
            // 防止事件穿透
            e.preventDefault()
            // 引入validateFields
            const { baseInfoData: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.useTime = moment(values.useTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.makeTime
                    formDate.makeStoreCode = this.defauilForm.makeStoreCode
                    formDate.id = this.rowObj.id
                    formDate.ids = this.delId
                    let detailSubmit = true
                    this.tableData.forEach(item => {
                        if (item.incomeNumber === 0) {
                            detailSubmit = false
                        }
                    })
                    if (this.tableData <= 0) {
                        this.$message.warning('请添加详细信息！')
                    } else if (!detailSubmit) {
                        this.$message.warning('请选择损益数量！')
                        return
                    }
                    const addData = {}
                    addData.incomeStatement = formDate
                    addData.incomeStatementDetailList = [...this.tableData]
                    this.submitEditLoading = true
                    axios({
                        path: 'InventoryIncomeStatementUpdateIncomeStatement',
                        body: addData
                    }).then(res => {
                        this.submitEditLoading = false
                        console.log(res)
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                            _this.commodityAddEditModal = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
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
                const isAuit = newData.filter(o => o.status !== 'income_statement_status:1')
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
                        path: 'InventoryIncomeStatementDeleteIncomeStatement', // 接口path名，必传
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
                        path: 'InventoryIncomeStatementAuditIncomeStatement', // 接口path名，必传
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
        * @name:登记串号按钮监听
        * @msg:
        * @param {type}
        * @return:
        */
        checkInHandler () {
            if (this.selectedRowRows[0].skuFlag !== 1) {
                console.log(999999, this.selectedRowRows)
                this.$message.warning(`勾选的${this.selectedRowRows[0].skuName}商品无串号管理，不用录入串号`)
            } else if (this.selectedRowRows[0].incomeNumber === undefined) {
                this.$message.waring('请先输入领用数量')
            } else {
                this.checkInModal = true
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
<style  lang="less">
    @import "../../../assets/modalStyle.less";
    .documentNo {
        display: inline-block;
        border: 1px solid #38adff;
        width: 100px;
        height: 25px;
        margin-left: 10px;
        vertical-align: middle;
        background: #ebf7ff;
        border-radius: 2px;
        color: #38adff;
        text-align: center;
        font-size: 12px;
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        margin: 0 10px;
    }
    .buttonMargin {
        margin: 0 10px 10px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
</style>

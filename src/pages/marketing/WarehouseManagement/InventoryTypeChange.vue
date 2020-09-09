<!--
 * @Description: 库存变更
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-26 14:18:20
 * @LastEditTime: 2019-08-20 15:49:34
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
      v-model="inventoryTypeAddEditModal"
      :title="inventoryTypeAddEditModalTitle"
      :submitClick="isAdd?submitInfo:editSubmitInfo"
      :popconfirm="false"
      :submitLoading="isAdd?submitAddLoading:submitEditLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
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
                v-decorator="$check('inventoryTypeData.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">
            变更类型
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="changeTypeArr"
                v-decorator="$check('inventoryTypeData.type',{initialValue:tableSingleData.type||'inventory_type_turn_type:1'})"
                @change="typeChangeHandler"
                :filterOption="filterOption">
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
                v-decorator="$check('inventoryTypeData.applyBy',{initialValue:tableSingleData.applyBy})"
                allowClear
                @search="handleApplyByDorpArr"
                :filterOption="false">
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
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('inventoryTypeData.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button type="primary" size="small" @click="addDetails" style="margin-left:10px;margin-right:10px">新增</a-button>
        <a-button class="editable-add-btn" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="skuCode"
          :pagination="false"
          :columns="tableColumns"
          :dataSource="tableData"
          size="small"
          bordered
          :scroll="{ x:1390}"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['turnQuantity', 'reason']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <!-- <div v-if=" col === 'turnQuantity'"> -->
              <a-input-number
                v-if="col === 'turnQuantity'&&(changeType ==='inventory_type_turn_type:1'||changeType ==='inventory_type_turn_type:2')"
                style="margin: -5px 0;width:100%;"
                :max="record.quantity"
                :step="1"
                :precision="0"
                :min="0"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <a-input-number
                v-else-if=" col === 'turnQuantity'&&(changeType ==='inventory_type_turn_type:3'||changeType ==='inventory_type_turn_type:4')"
                style="margin: -5px 0;width:100%;"
                :max="record.sampleQuantity"
                :step="1"
                :precision="0"
                :min="0"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <a-input-number
                v-else-if=" col === 'turnQuantity'&&(changeType ==='inventory_type_turn_type:5'||changeType ==='inventory_type_turn_type:6')"
                style="margin: -5px 0;width:100%;"
                :max="record.sampleQuantity"
                :step="1"
                :precision="0"
                :min="0"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <!-- </div> -->

              <a-select
                v-else-if=" col === 'reason'"
                style="margin: -5px 0;width:100%"
                :value="text"
                :options="reasonArr"
                @change="e => InputChange(e, record.skuCode, col)">
              </a-select>
              <span v-else>{{ text }}</span>
            </div>
          </template>

          <template slot="operation" slot-scope="text, record">
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
      <!-- 落款信息 -->
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
      <goodsChange :visible.sync="bGoodsQuery" @onSelect="onSelectAddGoods" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/InventoryTypeChangePreview'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import goodsChange from '@pages/marketing/WarehouseManagement/toop/goodsChange'
export default {
    name: 'CommodityUse',
    components: {
        NewTable,
        SeachBox,
        goodsChange,
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
                        type: 'coupon_define_status'
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
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 选中的数据
            tableSingleData: {

            },
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            // 右键菜单
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'InventoryTypeChange.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'InventoryTypeChange.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'InventoryTypeChange.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                { name: '预览',
                    action: 'InventoryTypeChange.get',
                    fc: this.detailHandler
                }
            ],
            // 新增编辑模态框
            tags: ['uncheck'], // 单据状态
            inventoryTypeAddEditModal: false,
            // 新增编辑模态框头
            inventoryTypeAddEditModalTitle: '',
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
            // 变更类型数组
            changeTypeArr: [],
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
                    title: '商品编码',
                    dataIndex: 'skuCode',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '商品名称',
                    dataIndex: 'skuName',
                    width: 150,
                    align: 'center'
                },
                {
                    title: '规格型号',
                    dataIndex: 'skuModel',
                    width: 100,
                    align: 'center'
                }, {
                    title: '零售价',
                    dataIndex: 'price',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '正品存量',
                    dataIndex: 'quantity',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '样品存量',
                    dataIndex: 'sampleQuantity',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '残次存量',
                    dataIndex: 'defectiveQuantity',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '在维修量',
                    dataIndex: 'repairQuantity',
                    width: 100,
                    align: 'center'
                },
                {
                    title: '转换数量',
                    dataIndex: 'turnQuantity',
                    width: 100,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'turnQuantity'
                    }
                },
                {
                    title: '转换原因',
                    dataIndex: 'reason',
                    width: 220,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'reason'
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
            // 详情弹框
            bGoodsQuery: false,
            changeType: 'inventory_type_turn_type:1',
            // 新增编辑保存确定按钮
            isAdd: true,
            submitAddLoading: false,
            submitEditLoading: false,
            delId: [], // 编辑id
            // 详情表格多选数组classCode
            selectedRowKeys: [],
            // 详情表格多选数组数据
            selectedRowRows: [],
            // 行信息
            rowObj: {},
            // 申请人
            applyerArr: [],
            // 原因
            reasonArr: [],
            // 变更类型
            changeTye: '',
            // 转换数量变更
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
            this.tableCode = 'fbe8ac616a77468bb947331a7a95908b:InventoryTypeChange'
            this.tableApiPath = 'InventoryTurnQuery'
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
            if (typeof (e.endTime) === 'object') {
                e.endTime = e.endTime.startOf('day').format('YYYY-MM-DD')
            }
            if (typeof (e.startTime) === 'object') {
                e.startTime = e.startTime.startOf('day').format('YYYY-MM-DD')
            }
            e.path = 'InventoryTurnQuery'
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
                this.$refs.newTable.exportFile('InventoryTurnQuery', this.seachValue)
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(
                this.tableCode,
                {
                    path: 'InventoryTurnQuery'
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
            if (tableRow.status === 'inventory_type_turn_status:1') {
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
            this.queryChangeType()
            this.queryReasonArr()
            this.tableData = []
            if (index === -1) {
                this.isAdd = true
                this.tableSingleData = {}
                this.inventoryTypeAddEditModalTitle = '新增库存类型变更'
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.makeBy = `${this.$store.getters.code}`
                this.defauilForm.makeName = `${this.$store.getters.name}`
                this.defauilForm.makeTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.isAdd = false
                this.inventoryTypeAddEditModalTitle = '编辑库存类型变更'
                this.rowObj.effectTime = moment(this.rowObj.effectTime)
                this.defauilForm.makeStoreCode = this.rowObj.makeStoreCode
                this.defauilForm.makeStoreName = this.rowObj.makeStoreName
                this.defauilForm.makeBy = this.rowObj.makeBy
                this.defauilForm.makeName = this.rowObj.makeName
                this.defauilForm.makeTime = moment(this.rowObj.makeTime).format('YYYY-MM-DD HH:mm:ss')
                this.tableSingleData.note = this.rowObj.note
                this.changeType = this.rowObj.type
                this.queryApplyerArr(index.applyBy)
                axios({
                    path: 'InventoryTurnQueryDetail',
                    body: {
                        inventoryTypeTurnId: this.rowObj.id
                    }
                }).then(res => {
                    // console.log(res)
                    if (res.flag === 1) {
                        this.tableData = res.data.list
                    }
                })
            }
            this.inventoryTypeAddEditModal = true
        },
        /**
         * @name: 生效分店
         * @msg:
         * @param {type}
         * @return:
         */
        effectiveBranch () {
            axios({
                path: 'OrganizationStoreFindOption'
            }).then(res => {
                // console.log(res);
                if (res.flag === 1) {
                    res.data.forEach(item => {
                        item.label = item.code + ':' + item.name
                        item.value = item.code
                        item.key = item.code
                    })
                    this.makeStoreCodeDorpArr = res.data
                }
            })
        },
        /**
         * @name: 变更类型
         * @msg:
         * @param {type}
         * @return:
         */
        queryChangeType () {
            axios({
                path: 'OrganizationConfigFindByType',
                body: {
                    type: 'inventory_type_turn_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    res.data.forEach(item => {
                        item.label = item.value
                        item.value = item.type + ':' + item.configKey
                        item.key = item.type + ':' + item.configKey
                    })
                    this.changeTypeArr = res.data
                }
            })
        },
        /**
         * @name: 搜索申请人
         */
        handleApplyByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.applyerArr.length = 0
                this.queryApplyerArr(value)
            }, 300)
        },
        /**
         * @name: 请求申请人
         */
        queryApplyerArr (value) {
            axios({
                path: 'PermissionsUserFindOption',
                methods: 'post',
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
         * @name: 选择原因
         * @msg:
         * @param {type}
         * @return:
         */
        queryReasonArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                methods: 'post',
                body: {
                    type: 'inventory_type_turn_detail_reason'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.label = item.value
                        item.value = `${item.type}:${item.configKey}`
                        item.key = `${item.type}:${item.configKey}`
                    })
                    this.reasonArr = [...data]
                }
            })
        },
        /**
         * @name: 新增详情
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            this.bGoodsQuery = true
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
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.tableData.filter(o => o.skuCode === mun.skuCode)
                if (has.length === 0) {
                    this.tableData.push({
                        skuCode: mun.skuCode,
                        skuName: mun.skuName,
                        skuModel: mun.skuModel,
                        price: mun.skuPrice,
                        unit: mun.basicUnit,
                        quantity: mun.quantity,
                        sampleQuantity: mun.sampleQuantity,
                        defectiveQuantity: mun.defectiveQuantity,
                        repairQuantity: mun.repairQuantity,
                        turnQuantity: Number(1).toFixed(2)
                    })
                } else {
                    error.push(mun.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，此类${error.join(',')}-已经添加过了`
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
            const newData = [...this.tableData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[key] = val
                // 转换数量判断
                if (key === 'turnQuantity') {
                    if (this.changeType === 'inventory_type_turn_type:1' || this.changeType === 'inventory_type_turn_type:2') {
                        // 正品转样品/次品
                        if (val > target.quantity) {
                            this.$message.warning(`${target.skuName}正品存量不足，请重新输入转换数量`)
                            this.changeFlag = 1
                            val = 0
                        } else if (val === 0) {
                            this.$message.warning('转换数量不能为0')
                            return
                        } else if (val === '') {
                            this.$message.warning('请输入转换数量')
                            return
                        }
                    } else if (this.changeType === 'inventory_type_turn_type:3' || this.changeType === 'inventory_type_turn_type:4') {
                        // 转品转正品/样品
                        if (val > target.sampleQuantity) {
                            this.$message.warning(`${target.skuName}样品存量不足，请重新输入转换数量`)
                            this.changeFlag = 2
                            val = 0
                        } else if (val === 0) {
                            this.$message.warning('转换数量不能为0')
                            return
                        } else if (val === '') {
                            this.$message.warning('请输入转换数量')
                            return
                        }
                    } else {
                        // 残次转样品/正品
                        if (val > target.defectiveQuantity) {
                            this.$message.warning(`${target.skuName}残次存量不足，请重新输入转换数量`)
                            this.changeFlag = 3
                            val = 0
                        } else if (val === 0) {
                            this.$message.warning('转换数量不能为0')
                            return
                        } else if (val === '') {
                            this.$message.warning('请输入转换数量')
                            return
                        }
                    }
                }
                this.tableData = newData
            }
        },
        /**
         * @name: 工具栏变更类型变更监听
         * @msg:
         * @param {type}
         * @return:
         */
        typeChangeHandler (value) {
            // inventory_type_turn_type:1
            this.changeType = value
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
            this.inventoryTypeAddEditModal = false
        },
        /**
         * @name: 新增保存按钮
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            const _this = this
            e.preventDefault() // 清除默认行为
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData <= 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.makeTime
                    formDate.makeStoreCode = this.$store.getters.storeInfo.code
                    formDate.detail = newData
                    this.submitAddLoading = true
                    axios({
                        path: 'InventoryTurnAdd',
                        body: formDate
                    }).then(res => {
                        this.submitAddLoading = false
                        if (res.flag === 1) {
                            _this.inventoryTypeAddEditModal = false
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
            // alert('222');
            // 防止事件穿透
            e.preventDefault()
            // 引入validateFields
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData <= 0) {
                        this.$message.warning('请添加详细信息！')
                    }
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.makeTime
                    formDate.makeStoreCode = this.defauilForm.makeStoreCode
                    formDate.detail = newData
                    formDate.id = this.rowObj.id
                    formDate.ids = this.delId
                    this.submitEditLoading = true
                    axios({
                        path: 'InventoryTurnUpdate',
                        body: formDate
                    }).then(res => {
                        this.submitEditLoading = false
                        if (res.flag === 1) {
                            this.inventoryTypeAddEditModal = false
                            this.reLoadTableData()
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
                const isAuit = newData.filter(o => o.status !== 'inventory_type_turn_status:1')
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
                        path: 'InventoryTurnDelete', // 接口path名，必传
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
            console.log(_this.$store.getters.userInfo, autiData)
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'InventoryTurnAudit', // 接口path名，必传
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
        margin: 0 10px;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
</style>

<!--
 * @Description: B账户商品
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-22 21:39:13
 * @LastEditTime: 2019-08-20 16:45:17
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
      @onSeach="onSeach"
    ></seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onSelect"
      @onContextmenuChange="onContextmenuChange"
    >
    </NewTable>
    <!-- 新增、编辑模态框 -->
    <bt-modal
      v-model="bAccountltemAddEditModal"
      :title="bAccountltemAddEditModalTitle"
      :submitClick="isAdd?submitInfo:editSubmitInfo"
      :popconfirm="false"
      :submitLoading="isAdd?submitAddLoading:submitEditLoading"
      :orderId="tableSingleData.code"
      :tags="tags"
    >
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
                v-decorator="$check('bAccountltemData.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">
            生效日期
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('bAccountltemData.effectTime', {initialValue:tableSingleData.effectTime || setEndTime})"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">
            生效分店
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-select
              mode="multiple"
              style="width:90%"
              placeholder="请选择生效分店"
              :options="makeStoreCodeDorpArr"
              :maxTagCount="1"
              :open="false"
              v-model="tempObjArr"
              allowClear
              ref="storeRef"/>
            <a href="javascript:;" @click="selectFocusEffect">
              <a-icon style="width:10%;line-height:36px;" type="edit" />
            </a>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('bAccountltemData.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button type="primary" size="small" @click="addDetails" style="border-radius: 0px;">新增</a-button>
        <!-- <a-button type="danger" size="small" style="border-radius: 0px;" @click="deleteRow(-1)">删除</a-button> -->
        <a-button class="editable-add-btn" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <div class="table-nowrap">
        <a-table
          rowKey="skuCode"
          :columns="tableColumns"
          :dataSource="tableData"
          bordered
          :pagination="false"
          size="small"
          :scroll="{ x:1150}"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['pushMoney', 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if=" col === 'pushMoney'"
                style="margin: -5px 0;width:100%;"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <a-input
                v-else-if=" col === 'note'"
                style="margin: -5px 0"
                :value="text"
                @change="e => InputChange(e.target.value, record.skuCode, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <!-- <span v-if="record.editable">
                            <a @click="() => saveRow(record.skuCode)" style="margin-right:10px;">保存</a>
                            <a-popconfirm title="Sure to cancel?" @confirm="() => cancelRow(record.skuCode)">
                                <a>取消</a>
                            </a-popconfirm>
                            </span> -->
              <span>
                <!-- <a @click="() => editRow(record.skuCode)" style="margin-right:10px;">编辑</a> -->
                <a-popconfirm title="是否确认删除?" @confirm="() => deleteRow(record.skuCode)" okText="是" cancelText="否">
                  <a href=" ">删除</a >
                </a-popconfirm>

              </span>
            </div>
          </template>

        </a-table>
      </div>
      <a-divider dashed />
      <a-form :form="baseInfoData">
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
      <!-- 生效分店 -->
      <store :visible.sync="storeQuery" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
// 导入组建
// 搜索框组建
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
import goods from '@comp/BasicQuery/goods'
import BtModal from '@comp/Modal'
import Preview from './preview/BAccountItemSettingsPreview'
import store from '@comp/BasicQuery/store'
import is from 'is_js'
import map from 'lodash.map'
export default {
    name: 'BAccountItemSettings',
    components: {
        SeachBox,
        NewTable,
        goods,
        store,
        BtModal,
        Preview
    },
    data () {
        return {
            // 搜索框的设置
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
            // 按钮
            btns: ['add', 'del', 'export', 'print'],
            // 搜索的值
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            // 表格Id
            tableCode: '',
            // 表格数据路径
            tableApiPath: '',
            // 右键菜单
            disContextMenu: [],
            // 右键菜单
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'BAccountItemSettings.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                }, {
                    name: '删除',
                    action: 'BAccountItemSettings.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                }, {
                    name: '审核',
                    action: 'BAccountItemSettings.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                }, { name: '预览',
                    action: 'BAccountItemSettings.get',
                    fc: this.detailHandler
                }
            ],
            // 多选
            tableIdsArr: [],
            tableRowsArr: [],
            // 新增/编辑模态框
            tags: ['uncheck'], // 单据状态
            bAccountltemAddEditModal: false,
            // 新增/编辑模态框头
            bAccountltemAddEditModalTitle: '',
            // 新增提交按钮
            isAdd: false,
            submitAddLoading: false,
            submitEditLoading: false,
            delId: [], // 编辑删除的id
            // 详情模态框
            goodsQuery: false,
            tempObjArr: [],
            // 新增表格数据
            baseInfoData: this.$form.createForm(this),
            // 表格单选数据
            tableSingleData: {},
            // 生效分店数组
            makeStoreCodeDorpArr: [],
            // 生效分店模态框
            storeQuery: false,
            // 详情表格头部
            tableColumns: [
                {
                    title: '序号',
                    width: 70,
                    align: 'center',
                    customRender: (text, record, index) => `${index + 1}`,
                    fixed: 'left'
                },
                {
                    title: '商品编码',
                    width: 180,
                    align: 'center',
                    dataIndex: 'skuCode'
                },
                {
                    title: '商品名称',
                    width: 180,
                    align: 'center',
                    dataIndex: 'skuName'
                },
                {
                    title: '规格型号',
                    width: 180,
                    align: 'center',
                    dataIndex: 'skuModel'
                },
                {
                    title: '提成金额（元）',
                    width: 180,
                    align: 'center',
                    dataIndex: 'pushMoney',
                    scopedSlots: {
                        customRender: 'pushMoney'
                    }
                },
                {
                    title: '备注',
                    width: 180,
                    align: 'center',
                    dataIndex: 'note',
                    scopedSlots: {
                        customRender: 'note'
                    }
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 100,
                    align: 'center',
                    scopedSlots: { customRender: 'operation' }
                }
            ],
            // 详情表格表体
            tableData: [],
            // 选择生效分店得到的数据
            takeEffect: [],
            // 详情表格多选数组classCode
            selectedRowKeys: [],
            // 详情表格多选数组数据
            selectedRowRows: [],
            // 行信息
            rowObj: {},
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },

            // 预览
            previewVisbel: false,
            orderId: '',
            // 下拉框
            applyByDorpArr: [] // 制单人
        }
    },
    computed: {
        setStartTime () {
            return moment()
        },
        setEndTime () {
            return moment().startOf('day').add({ days: 1 })
        }
    },
    mounted () {
        // 默认加载
        this.$nextTick(() => {
            this.tableCode = '9e127ed5e6d54bf79a7d5676fac34aa6:BAccountItemSettings'
            this.tableApiPath = 'CouponBQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.effectiveBranch()
    },
    methods: {
        /**
         * @name: 点击功能按钮的事件
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditBAccountltem(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length <= 0) {
                    this.$message.warning('请选择需要删除的数据！')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CouponBQuery', this.seachValue)
            }
        },
        /**
         * @name: 表格数据搜索
         */
        onSeach (e) {
            e.path = 'CouponBQuery'
            this.$refs.newTable.setTableData(this.tableCode, e, true)
        },
        /**
         * @name: 清空搜索条件
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 表格更新
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(
                this.tableCode,
                {
                    path: 'CouponBQuery'
                })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            if (tableRow.status === 'coupon_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
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
                this.addEditBAccountltem(e)
            } else if (mun === 'del') {
                this.deleteHandler(e)
            } else if (mun === 'audit') {
                this.auditHandler(e)
            }
        },
        /**
         * @name: 新增/编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEditBAccountltem (index) {
            if (index === -1) {
                this.isAdd = true
                this.tableData = []
                this.tempObjArr = []
                this.tableSingleData = {}
                this.bAccountltemAddEditModalTitle = '新增B账户商品设置'
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.delId = []
                this.isAdd = false
                this.bAccountltemAddEditModalTitle = '编辑B账户商品设置'
                const obj = { ...index }
                obj.effectTime = moment(obj.effectTime)
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                if (this.rowObj.storeCode) {
                    this.tempObjArr = this.rowObj.storeCode.split(',')
                } else {
                    this.tempObjArr = []
                }
                this.tableSingleData = obj
                axios({
                    path: 'CouponBQueryDetail',
                    body: {
                        couponBDefineId: this.rowObj.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.tableData = res.data.list
                    }
                })
            }
            this.bAccountltemAddEditModal = true
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
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(item => {
                        item.label = item.code + '--' + item.name
                        item.value = item.code
                    })
                    this.makeStoreCodeDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 确认关闭弹框按钮
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.tempObjArr = []
            this.bAccountltemAddEditModal = false
            this.tableData = []
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            this.tempObjArr = [...map(arr, 'code')]
        },
        /**
         * @name: 新增详情
         * @msg:
         * @param {type}
         * @return:
         */
        addDetails () {
            this.goodsQuery = true
        },
        /**
         * @name: 生效日期校验
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
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
         * @name: 根据生效分店请求详情
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (e) {
            this.takeEffect.push(e)
            axios({
                path: 'CouponBGetSkuByStore',
                body: {
                    storeCode: this.takeEffect
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.detailsModalTableData = []
                    this.detailsModalTableData = res.data.list
                }
            })
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
                        skuModel: mun.goodsModel,
                        pushMoney: Number(1).toFixed(2)
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
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                if (this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择需要删除的数据！')
                    return
                }
                const infoData = [...this.tableData]
                const arr = []
                this.selectedRowRows.forEach(item => {
                    if (item.id) {
                        arr.push(item.id)
                    }
                })
                this.delId = arr
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
                const target = infoData.filter(item => item.skuCode === keyId)[0]
                if (target.id) {
                    this.delId.push(target.id)
                }
                this.tableData = infoData.filter(item => item.skuCode !== keyId)
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
                this.tableData = newData
            }
        },
        /**
         * @name: 新增保存按钮
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault() // 清除默认行为
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData.length === 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.makeTime
                    formDate.storeCode = this.tempObjArr
                    if (is.array(formDate.storeCode)) {
                        formDate.storeCode = this.tempObjArr.join(',')
                    }
                    formDate.makeStoreCode = this.$store.getters.storeInfo.code

                    formDate.detail = newData
                    this.submitAddLoading = true
                    axios({
                        path: 'CouponBAdd',
                        body: formDate
                    }).then(res => {
                        this.submitAddLoading = false
                        if (res.flag === 1) {
                            this.bAccountltemAddEditModal = false
                            this.reLoadTableData()
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
            // 防止事件穿透
            e.preventDefault()
            const { baseInfoData: { validateFields } } = this
            const newData = [...this.tableData]
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData.length === 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.makeTime
                    formDate.makeStoreCode = this.defauilForm.makeStoreCode
                    formDate.storeCode = this.tempObjArr
                    formDate.detail = newData
                    formDate.id = this.rowObj.id
                    formDate.ids = this.delId
                    if (is.array(formDate.storeCode)) {
                        formDate.storeCode = this.tempObjArr.join(',')
                    }
                    this.submitEditLoading = true
                    axios({
                        path: 'CouponBUpdate',
                        body: formDate
                    }).then(res => {
                        this.submitEditLoading = false
                        if (res.flag === 1) {
                            this.bAccountltemAddEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
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
                        path: 'CouponBAudit',
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
                const isAuit = newData.filter(o => o.status !== 'coupon_define_status:1')
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
                content: '确定选中项全部删除？删除将不可恢复！',
                okText: '确定',
                okType: 'danger',
                canelText: '取消',
                onOk () {
                    axios({
                        path: 'CouponBDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
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
        '$store.state.app.pageName' (to, from) {
            if (to === 'BAccountItemSettings') {
                this.effectiveBranch()
            }
        }
    }

}
</script>
<style lang="less">
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
        margin-left: 10px;
    }
    .activeNameSet .ant-select-arrow svg{
        display:none;
    }
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
</style>

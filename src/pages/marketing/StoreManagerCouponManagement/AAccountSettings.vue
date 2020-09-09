<!--
 * @Description: A账户设置
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 10:23:30
 * @LastEditTime: 2019-08-21 16:26:03
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
      v-model="aACcountAddEditModal"
      :title="aACcountAddEditModalTitle"
      :submitClick="isAdd?submitInfo:editSubmitInfo"
      :popconfirm="false"
      :submitLoading="isAdd?submitAddLoading:submitEditLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <!-- 模态框详情信息 -->
      <a-form :form="formData">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            生效机构
          </a-col>
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
          <a-col :sm="8" :md="4" :xl="3">
            生效日期
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('accountSet.effectTime', {initialValue:tableSingleData.effectTime || setEndTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('accountSet.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button type="primary" size="small" @click="addDetails" style="border-radius: 0px;">新增</a-button>
        <a-button class="editable-add-btn" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumns"
          :scroll="{ x:1270}"
          bordered
          :pagination="false"
          :dataSource="tableData"
          size="small"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['amount', 'useRateOne','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if=" col === 'amount'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :precision="2"
                :max="Number.MAX_SAFE_INTEGER"
                :value="text"
                @change="e => InputChange(e, record.tb_web_id, col)" />
              <a-input-number
                v-else-if=" col === 'useRateOne'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :value="text"
                :formatter="value => `${value}`"
                :parser="value => value"
                :precision="2"
                @change="e => InputChange(e, record.tb_web_id, col)" />
              <a-input
                v-else-if=" col === 'note'"
                style="margin: -5px 0"
                :value="text"
                @change="e => InputChange(e.target.value, record.tb_web_id, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确认删除?" @confirm="() => deleteRow(record.tb_web_id)" okText="是" cancelText="否">
                  <a href="javascript:;">删除</a >
                </a-popconfirm>

              </span>
            </div>
          </template>

        </a-table>
      </div>
      <a-divider dashed />
      <!-- 落款信息 -->
      <a-form :form="formData">
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" :pams="pams" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import SeachBox from '@comp/seachBox'
// 导入时间
import moment from 'moment'
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import Preview from './preview/AAccountSettingsPreview'
import { axios } from '@/utils/request'
import store from '@comp/BasicQuery/store'
import goods from '@pages/marketing/StoreManagerCouponManagement/toop/goods'
export default {
    name: 'AAccountSettings',
    components: { SeachBox, NewTable, goods, BtModal, Preview, store },
    data () {
        return {
            // 搜索框设置
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
                    action: 'AAccountSettings.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'AAccountSettings.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '审核',
                    action: 'AAccountSettings.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                },
                { name: '预览',
                    action: 'AAccountSettings.get',
                    fc: this.detailHandler
                }
            ],
            // 新增、编辑模态框
            tags: ['uncheck'], // 单据状态
            aACcountAddEditModal: false,
            // 新增、编辑模态框头
            aACcountAddEditModalTitle: '',
            // 基础信息默认值
            tableSingleData: {},
            formData: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            // 详情表头
            tableColumns: [
                { title: '序号', width: 80, align: 'center', customRender: (text, record, index) => `${index + 1}`, fixed: 'left' },
                { title: '机构代码', dataIndex: 'storeCode', width: 100, align: 'center' },
                { title: '机构名称', dataIndex: 'storeName', width: 180, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '额度(元)', dataIndex: 'amount', width: 120, align: 'center', scopedSlots: { customRender: 'amount' } },
                { title: '使用比率（%）', dataIndex: 'useRateOne', width: 120, align: 'center', scopedSlots: { customRender: 'useRateOne' } },
                { title: '备注', dataIndex: 'note', width: 200, align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            // 详情表格表体
            tableData: [],
            // 品类品牌弹框
            goodsQuery: false,
            // 请求品类品牌传的参数
            pams: {},
            // 新增提交按钮
            isAdd: false,
            submitEditLoading: false,
            submitAddLoading: false,
            delId: [], // 编辑传的id
            // 详情表格多选数组classCode
            selectedRowKeys: [],
            // 详情表格多选数组数据
            selectedRowRows: [],
            // 多选
            tableIdsArr: [],
            tableRowsArr: [],
            // 行信息
            rowObj: {},
            makeByDropArr: [],

            // 生效分店
            effectStoreArr: [],
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值

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
            return moment().startOf('day').add({ days: 1 })
        }
    },
    mounted () {
        // 默认加载
        this.$nextTick(() => {
            this.tableCode = '8244954bff834281aaf618b8667af422:AAccountSettings'
            this.tableApiPath = 'CouponAQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.getEffectStoreArr()
    },
    methods: {
        /**
         * @name: 点击功能按钮的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditAAccount(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length <= 0) {
                    this.$message.warning('请选择需要删除的数据！')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CouponAQuery', this.seachValue)
            }
        },
        /**
        * @name: 清空搜索条件
        */
        onReload () {
            this.seachValue = {}
        },
        /**
        * @name: 表格数据搜索
        */
        onSeach (e) {
            e.path = 'CouponAQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
        * @name: 表格更新
        */
        reLoadTableData () {
            this.$refs.newTable.setTableData(
                this.tableCode,
                {
                    path: 'CouponAQuery'
                })
        },
        /**
        * @name: 表格的多选
        */
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        /**
        * @name: 表格右击
        */
        onContextmenuChange (tableRow) {
            this.tableSingleData = tableRow
            if (tableRow.status === 'coupon_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
        * @name: 表格编辑、删除、审核操作监听
        */
        getRow (e, mun) {
            this.rowObj = e
            if (mun === 'edit') {
                this.addEditAAccount(e)
            } else if (mun === 'del') {
                this.deleteHandler(e)
            } else if (mun === 'audit') {
                this.auditHandler(e)
            }
        },
        /**
        * @name: 新增/编辑弹框
        */
        addEditAAccount (index) {
            if (index === -1) {
                this.tableSingleData.businessUnit = ''
                this.tableSingleData.note = ''
                this.tableSingleData.code = ''
                this.tableData = []
                this.tempObjArrEffect = [] // 生效机构
                this.isAdd = true
                this.aACcountAddEditModalTitle = '新增A账户设置'
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                const { mul } = this.$math
                this.delId = []
                this.isAdd = false
                const obj = { ...index }
                this.aACcountAddEditModalTitle = '编辑A账户设置'
                obj.effectTime = moment(obj.effectTime)
                this.tableSingleData = obj
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                if (!obj.storeCode) {
                    this.tempObjArrEffect = []
                } else {
                    obj.storeCode = obj.storeCode.split(',')
                    this.tempObjArrEffect = [...obj.storeCode]
                }
                axios({
                    path: 'CouponAQueryDetail',
                    body: {
                        couponADefineId: this.rowObj.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const newData = [...res.data.list]
                        newData.forEach(item => {
                            item.tb_web_id = item.id
                            item.unquid = item.storeCode + item.classCode + item.brandCode
                            item.useRateOne = mul(item.useRate, 100, 2)
                        })
                        this.tableData = newData
                    }
                })
            }
            this.aACcountAddEditModal = true
        },
        /**
         * @name:  生效机构
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
        * @name: 生效日期禁选
        */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        },
        /**
        * @name: 新增详情
        */
        addDetails () {
            if (this.tempObjArrEffect.length === 0) {
                this.$message.warning('请选择机构！')
                return
            }
            this.pams.codes = this.tempObjArrEffect
            this.goodsQuery = true
        },
        /**
        * @name: 获取品类品牌
        */
        onSelectAddGoods (addSeleckData) {
            const error = []
            addSeleckData.forEach(mun => {
                const has = this.tableData.filter(o => o.unquid === mun.storeCode + mun.classCode + mun.brandCode)
                if (has.length === 0) {
                    this.tableData.push({
                        tb_web_id: mun.id,
                        storeCode: mun.storeCode,
                        storeName: mun.storeName,
                        classCode: mun.classCode,
                        className: mun.className,
                        brandCode: mun.brandCode,
                        brandName: mun.brandName,
                        amount: Number(1).toFixed(2),
                        useRateOne: 0,
                        unquid: mun.storeCode + mun.classCode + mun.brandCode
                    })
                } else {
                    error.push('此类' + mun.storeCode + '店代码')
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
                        if (infoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            infoData.splice(j, 1)
                        }
                    }
                }
                this.tableData = infoData
            } else {
                const infoData = [...this.tableData]
                this.tableData = infoData.filter(item => item.tb_web_id !== index)
                const target = infoData.filter(item => item.tb_web_id === index)[0]
                if (target.id) {
                    this.delId.push(target.id)
                }
            }
        },
        /**
         * @name: 详情表格多选
        */
        onSelectChange (selectedRowKeys, selectedRowRows) {
            this.selectedRowKeys = selectedRowKeys
            this.selectedRowRows = selectedRowRows
        },
        /**
        * @name: 编辑 表格 编辑时
        */
        InputChange (val, count, key) {
            const newData = [...this.tableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                target[key] = val
                this.tableData = newData
            }
        },
        /**
        * @name: 新增保存按钮
        */
        submitInfo (e) {
            const { div } = this.$math
            e.preventDefault() // 清除默认行为
            const { formData: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.createTime
                    formDate.storeCode = this.tempObjArrEffect.join(',')
                    formDate.detail = [...this.tableData]
                    if (this.tableData.length === 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    this.submitAddLoading = true
                    formDate.detail.forEach(item => {
                        item.id = null
                        item.useRate = div(item.useRateOne, 100, 4)
                    })
                    axios({
                        path: 'CouponAAdd',
                        body: formDate
                    }).then(res => {
                        this.submitAddLoading = false
                        if (res.flag === 1) {
                            this.aACcountAddEditModal = false
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
        */
        editSubmitInfo (e) {
            const { div } = this.$math
            e.preventDefault()
            const { formData: { validateFields } } = this
            const newData = [...this.tableData]
            newData.forEach(item => {
                item.useRate = div(item.useRateOne, 100, 4)
            })
            validateFields((err, values) => {
                values.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                values.makeTime = this.defauilForm.createTime
                values.makeStoreCode = this.defauilForm.makeStoreCode
                if (!err) {
                    if (this.tableData.length === 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    let addData = {}
                    addData = values
                    addData.detail = newData
                    addData.id = this.rowObj.id
                    addData.ids = this.delId
                    addData.storeCode = this.tempObjArrEffect.join(',')
                    this.submitEditLoading = true
                    axios({
                        path: 'CouponAUpdate',
                        body: addData
                    }).then(res => {
                        this.submitEditLoading = false
                        if (res.flag === 1) {
                            this.aACcountAddEditModal = false
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
                        path: 'CouponADelete',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        console.log(res)
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                }
            })
        },
        /**
        * @name: 审核
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
                        path: 'CouponAAudit',
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
         * @name: 生效机构弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效机构
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
        * @name: 预览
        */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'AAccountSettings') {
                this.getEffectStoreArr()
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

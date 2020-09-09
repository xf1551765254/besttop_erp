<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-11 10:31:52
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
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :orderId="orderId"
      :tags="tags"
      :loading="submitLoading"
      :submitClick="submitClick">
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">提货类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择提货类型"
                :filterOption="filterOption"
                style="width:100%"
                v-decorator="$check('billEntry.provider',{initialValue:BaseMessageObj.provider})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">单据类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billEntry.storeCode', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">提货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择类型"
                :filterOption="filterOption"
                style="width:100%"
                v-decorator="$check('billEntry.recType',{initialValue:BaseMessageObj.recType})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">预约送货时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('billEntry.recDt',{initialValue:BaseMessageObj.recDt})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="baseInfo">顾客信息</div>
        <a-row>
          <a-button class="categoryinfo-btn" style="float:right;margin-bottom:10px" @click="clientAdd()" >添加顾客</a-button>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">顾客姓名</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billEntry.storeCode', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">手机号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billEntry.storeCode', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地址</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billEntry.storeCode', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="goodsAdd(1)" >添加商品</a-button>
          <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)" >删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scroll">
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-for="col in ['recN','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'recN'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :formatter="value => `-${value}`"
                :parser="value => value.replace('-', '')"
                :value="text"
                @change="e => InputChangeLose(e, record.skuCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChangeLose(e.target.value, record.skuCode, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billEntry.makeUser', {initialValue:`${this.$store.getters.code}-${this.$store.getters.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billEntry.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billEntry.auditUser')"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">审核时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billEntry.auditTime')"
                disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('billEntry.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 2, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <clientAdd :visible.sync="goodsQuery" @onSelect="onSelect"/>
  </div>
</template>
<style lang="less">
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import moment from 'moment'
import clientAdd from '@pages/storage/LogisticsDistributionManagement/popoutModule/clientAdd'
export default {
    name: 'ThirdPartyDeliveryOrder',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        clientAdd
    },
    data () {
        return {
            title: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '审核人',
                    key: 'makeUser',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
                {
                    title: '单据状态',
                    type: 'select',
                    key: 'billStatus',
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    label: 'value',
                    value: ['type', 'configKey'],
                    body: {
                        type: 'bill_pre_entry_status'
                    }
                },
                {
                    title: '制单开始时间',
                    type: 'date',
                    key: 'timeA'
                },
                {
                    title: '制单结束时间',
                    type: 'date',
                    key: 'timeB'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'ThirdPartyDeliveryOrder.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'ThirdPartyDeliveryOrder.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'ThirdPartyDeliveryOrder.verify',
                    fc: this.auditHandler
                }
            ],
            seachValue: {
                timeA: moment().subtract({ months: 1 }),
                timeB: moment()
            },
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            rowId: '',
            categoryinfoSelectedRowKeys: [], // 选中项
            categoryinfoColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode1', width: 90, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName2', width: 200, align: 'center' },
                { title: '品牌', dataIndex: 'brandName3', width: 60, align: 'center' },
                { title: '分类', dataIndex: 'skuUnit4', width: 50, align: 'center' },
                { title: '单位', dataIndex: 'skuModel5', width: 250, align: 'center' },
                { title: '规格型号', dataIndex: 'barCode', width: 100, align: 'center' },
                { title: '数量', dataIndex: 'recN', width: 150, scopedSlots: { customRender: 'recN' } },
                { title: '是否安装', dataIndex: 'recN4', width: 150, scopedSlots: { customRender: 'recN' } },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ], // 表头
            categoryinfoData: [], // 表体
            orderId: '',
            tags: [],
            scroll: { x: 1600 },
            goodsQuery: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '02c25aab347949e3ad28b034ae8fd030:ThirdPartyDeliveryOrder'
            this.tableApiPath = 'DistributionBillPreEntryFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        console.log(this.$store.getters, '123456456')
    },
    methods: {
        onSelect (e) {
            console.log(e)
        },
        clientAdd () {
            this.goodsQuery = true
        },
        goodsAdd (e) {

        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const newData = [...this.categoryinfoData]
            if (newData.length === 0) {
                this.$message.warning(`请添加预收/退货商品!`)
                return
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                let addArr = {}
                values.storeCode = this.$store.getters.storeInfo.code
                values.makeUser = this.$store.getters.code
                values.recDt = moment(values.recDt).format('YYYY-MM-DD')
                addArr = Object.assign(values, { billPreEntryDetailList: newData })
                if (this.addEdit === 'edit') {
                    addArr = Object.assign(addArr, { id: this.rowId })
                }
                if (!err) {
                    this.submitLoading = true
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionBillPreEntryAdd' : 'DistributionBillPreEntryUpdate',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus)
            if (billStatus === 'bill_pre_entry_status:1') {
                this.disContextMenu = []
            } else if (billStatus === 'bill_pre_entry_status:2') {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
        // 搜索框方法
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addData(-1)
            } else if (e === 'edit') {

            } else if (e === 'del') {
                this.onDel(-1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionBillPreEntryFind', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'DistributionBillPreEntryFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
        },
        /**
         * @name: 表格右击删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (row) {
            this.onDel(row)
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'DistributionBillPreEntryAudit',
                        method: 'post',
                        body: {
                            id: e.id,
                            sourceStoreCode: that.$store.getters.storeInfo.code
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 删除方法
         * @msg:
         * @param {type}
         * @return:
         */
        onDel (e) {
            console.log(e)
            let arr = []
            if (e === -1) {
                if (this.selectArr.length === 0) {
                    this.$message.warning('您尚未选中任何数据！')
                    return
                }
                const statusArr = map(this.selectArr, 'billStatus')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_pre_entry_status:2') {
                        this.$message.warning('选中数据存在已审核数据，不可删除')
                        return
                    } else {
                        arr = map(this.selectArr, 'id')
                    }
                }
            } else {
                arr.push(e.id)
            }
            console.log('删除的数组', arr)
            const that = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定继续?',
                onOk () {
                    axios({
                        path: 'DistributionBillPreEntryDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addData (index) {
            if (index < 0) {
                /**
                 * 新增
                 * 清空表单
                 */
                this.addEdit = 'add'
                this.BaseMessageObj = {

                }
                this.title = '新增第三方派单'
                this.addEditModel = true
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEdit = 'edit'
                this.title = '编辑第三方派单'
                const arr = { ...index }
                this.editTheDetails(arr)
            }
            // 打开modal
        },
        /**
         * @name: 编辑详情
         * @msg:
         * @param {type}
         * @return:
         */
        editTheDetails (e) {
            console.log('编辑', e)
            axios({
                path: 'DistributionBillPreEntryGet',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    this.addEditModel = true
                    const { abs } = this.$math
                    console.log('编辑详情', res.data)
                    const editArr = res.data.preEntryDetaillist
                    editArr.forEach(i => {
                        i.skuUnit = i.basicUnit
                        i.skuModel = i.model
                        if (e.recType === 'bill_pre_entry_rec_type:2') {
                            i.recN = abs(i.recN, 0)
                        }
                    })
                    this.categoryinfoData = editArr
                }
            })
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (skuCode) {
            console.log(skuCode)
            if (skuCode === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.skuCode !== skuCode)
            }
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isBefore()
        },
        /**
         * @name: 监听表格负数编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChangeLose (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ThirdPartyDeliveryOrder') {
            }
        }
    }
}
</script>

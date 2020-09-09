<!--
 * @Description: 积分生成规则定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-19 17:31:29
 * @LastEditors: lin
 * @LastEditTime: 2019-07-03 14:00:28
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
      @onSeach="onSeach" >
      <div class="btn-box">
        <a-button
          size="small"
          type="primary"
          icon="play-circle"
          style="margin-right:10px"
          v-action:enable
          @click="enableHandler(-1)">启用</a-button>
        <a-button size="small" type="primary" icon="stop" v-action:disable @click="disableHandler(-1)">停用</a-button>
      </div>
    </seachBox>
    <!-- main table -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 单据 -->
    <bt-modal
      v-model="addEditModel"
      :title="addEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">付款金额</a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                v-decorator="$check('IntegralGenerate.paidAmount', {initialValue:0.00},handleAmount)"
                placeholder="请输入付款金额"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">积分金额</a-col>
          <a-col :sm="16" :md="8" :xl="9">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                v-decorator="$check('IntegralGenerate.pointAmount', {initialValue:0.00},handleAmount)"
                placeholder="请输入积分金额"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :row="2"
                v-decorator="$check('IntegralGenerate.note', {initialValue:''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <div>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="categoryQuery=true">品类选择</a-button>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="brandQuery=true">品牌选择</a-button>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="brandCategoryQuery=true">品类品牌选择</a-button>
        <a-button type="danger" size="small" :disabled="selectedRowKeys.length===0" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
      </div>
      <a-table
        rowKey="tb_web_id"
        :columns="DetailtableColumns"
        size="small"
        bordered
        :pagination="false"
        :scroll="{ x: 1030 }"
        :dataSource="DetailtableData"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <template slot="note" slot-scope="text, record, index">
          <div>
            <a-input
              style="margin: -5px 0; width:100%"
              :value="text"
              @change="e => InputChange(e.target.value, record.tb_web_id)"/>
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
      <!-- 品类选择 -->
      <category :visible.sync="categoryQuery" @onSelect="onSelectCategory" multiple :pams="{level: 2}"/>
      <!--  品牌 选择-->
      <brand :visible.sync="brandQuery" @onSelect="onSelectbrand" multiple/>
      <!-- 品类  品牌 选择-->
      <brandCategory :visible.sync="brandCategoryQuery" @onSelect="onSelectBrandCategory" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <Preview
      v-model="previewVisbel"
      :tags="previewTags"
      :orderId="previewDetailData.code"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="积分生成规则详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData"></div>
    </Preview>
  </div>
</template>
<style lang="less">
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
  }
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from '@comp/Modal/preview'
import category from '@comp/BasicQuery/category'
import brand from '@comp/BasicQuery/brand'
import brandCategory from './components/brandCategory'
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    name: 'IntegralGenerateRuleDefinie',
    components: { NewTable, SeachBox, BtModal, category, brand, brandCategory, Preview },
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
                    key: 'auditStatus',
                    type: 'select',
                    title: '审核状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'marketing_points_define_audit_status'
                    }
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '启用状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'marketing_points_define_status'
                    }
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
                    action: 'IntegralGenerateRuleDefinie.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'IntegralGenerateRuleDefinie.delete',
                    fc: this.deleteHandler
                },
                { name: '审核',
                    action: 'IntegralGenerateRuleDefinie.verify',
                    fc: this.auditHandler
                },
                { name: '启用',
                    action: 'IntegralGenerateRuleDefinie.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'IntegralGenerateRuleDefinie.disable',
                    fc: this.disableHandler
                },
                { name: '预览',
                    action: 'IntegralGenerateRuleDefinie.get',
                    fc: this.detailHandler
                }
            ],

            // 新增 编辑 单据
            // 弹框
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            addEditModalTitle: '',
            submitLoading: false,
            // form
            form: this.$form.createForm(this),
            isAdd: false,
            // 详情表格
            DetailtableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', width: 350, align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 100, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            DetailtableData: [],
            selectedRowKeys: [], // 选中的值 skucode
            selectedRows: [], // 选中的值

            // 预览
            previewVisbel: false,
            previewTags: [],
            previewHeaders: [
                { key: 'paidAmount', name: '付款金额' },
                { key: 'pointAmount', name: '积分金额' },
                { key: 'status', name: '启用状态' },
                { key: 'note', name: '备注' }
            ],
            previewContent: {},
            previewDetailData: {},
            epreviewTableData: [],
            previewColumns: [
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],

            // 选择器
            categoryQuery: false, // 品类
            brandQuery: false, // 品牌
            brandCategoryQuery: false // 品类 品牌
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '326e08fe410c4c82847c26976ecc80ca:IntegralGenerateRuleDefinie'
            this.tableApiPath = 'PointDefineQueryPointsDefine'
            this.$refs.newTable.setContextmenu(this.menuOpt)
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
            e.path = 'PointDefineQueryPointsDefine'
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
            this.$refs.newTable.setTableData(this.tableCode, { path: 'PointDefineQueryPointsDefine' })
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
            // console.log(tableRow)
            if (tableRow.auditStatus === 'marketing_points_define_audit_status:1') {
                this.disContextMenu = ['启用', '停用']
            } else {
                if (tableRow.status === 'marketing_points_define_status:0') {
                    this.disContextMenu = ['编辑', '审核', '删除']
                } else if (tableRow.status === 'marketing_points_define_status:1') {
                    this.disContextMenu = ['编辑', '启用', '审核', '删除']
                } else if (tableRow.status === 'marketing_points_define_status:2') {
                    this.disContextMenu = ['编辑', '停用', '审核', '删除']
                }
            }
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delData) {
            let arr = []
            const _this = this
            if (delData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.auditStatus !== 'marketing_points_define_audit_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'PointDefineDeletePointsDefine', // 接口path名，必传
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
                title: '审核提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'PointDefineAuditPointsDefine', // 接口path名，必传
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
         * @name: 启用
         * @msg:
         * @param {type}
         * @return:
         */
        enableHandler (enableData) {
            const self = this
            let arr = []
            if (enableData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要启用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.auditStatus === 'marketing_points_define_audit_status:1')
                if (isDisabled.length > 0) {
                    this.$message.warning('存在有未审核的操作，只有审核后才能进行启用操作')
                    return
                } else {
                    const isEnableT = newData.filter(o => o.status === 'marketing_points_define_status:1')
                    if (isEnableT.length > 0) {
                        this.$message.warning('只有初始状态和停用状态才能进行启用操作')
                        return
                    }
                }
                arr = this.tableIdsArr
            } else {
                arr.push(enableData.id)
            }
            this.$confirm({
                title: '启用提示',
                content: '此操作将进行启用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'PointDefineUpdatePointsDefineStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_points_define_status:1'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 停用
         * @msg:
         * @param {type}
         * @return:
         */
        disableHandler (disableData) {
            const self = this
            let arr = []
            if (disableData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要停用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isEnable = newData.filter(o => o.auditStatus === 'marketing_points_define_audit_status:1')
                if (isEnable.length > 0) {
                    this.$message.warning('存在有未审核的操作，只有审核后才能进行停用操作')
                    return
                } else {
                    const isEnableT = newData.filter(o => o.status === 'marketing_points_define_status:2')
                    if (isEnableT.length > 0) {
                        this.$message.warning('只有初始状态和启用状态才能进行停用操作')
                        return
                    }
                }
                arr = this.tableIdsArr
            } else {
                arr.push(disableData.id)
            }
            this.$confirm({
                title: '停用提示',
                content: '此操作将进行停用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'PointDefineUpdatePointsDefineStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'marketing_points_define_status:2'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 新增编辑数据
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = true
                this.addEditModalTitle = '新增生成规则定义'
                this.DetailtableData = []
            } else {
                this.isAdd = false
                this.addEditModalTitle = '编辑生成规则定义'
                this.tableSingleData = { ...addEditData }
                this.$nextTick(() => {
                    this.form.setFieldsValue({
                        paidAmount: addEditData.paidAmount,
                        pointAmount: addEditData.pointAmount,
                        note: addEditData.note
                    })
                })
                axios({
                    path: 'PointDefineQueryDetail',
                    method: 'post',
                    body: {
                        marketingPointsDefineCode: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const detailData = [...res.data.list]
                        detailData.forEach(item => {
                            item.tb_web_id = item.id
                            if (item.skuCode) {
                                item.keyCode = item.skuCode
                            } else if (item.classCode && item.brandCode) {
                                item.keyCode = item.classCode + item.brandCode
                            } else if (item.classCode && !item.brandCode) {
                                item.keyCode = item.classCode
                            } else if (!item.classCode && item.brandCode) {
                                item.keyCode = item.brandCode
                            }
                        })
                        this.DetailtableData = detailData
                    }
                })
            }
            this.addEditModel = true
        },
        /**
         * @name: 新增编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (this.DetailtableData.length === 0) {
                        return this.$message.warning('请添加品类品牌')
                    }
                    if (!this.isAdd) {
                        values.code = this.tableSingleData.code
                        values.id = this.tableSingleData.id
                    }
                    values.detailList = this.DetailtableData
                    axios({
                        path: this.isAdd ? 'PointDefineAddPointsDefine' : 'PointDefineUpdatePointsDefine',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModel = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 表单校验
         * @msg:
         * @param {type}
         * @return:
         */
        handleAmount (rule, value, callback) {
            if (value === 0) {
                const str = '输入的金额不能为0'
                callback(str)
            } else {
                callback()
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
                const deleteoData = [...this.DetailtableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.DetailtableData = deleteoData
            } else {
                const newData = [...this.DetailtableData]
                this.DetailtableData = newData.filter(item => item.tb_web_id !== keyId)
            }
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count) {
            const newData = [...this.DetailtableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                target['note'] = val
                this.DetailtableData = newData
            }
        },
        // 选择器
        /**
         * @name: 品类 选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectCategory (categoryArr) {
            // console.log(categoryArr, '品类')
            const newData = [...this.DetailtableData]
            const error = []
            categoryArr.forEach(item => {
                const has = newData.filter(o => o.keyCode === item.code)
                if (has.length === 0) {
                    this.DetailtableData.push({
                        classCode: item.code,
                        className: item.name,
                        brandCode: '',
                        brandName: '',
                        note: '',
                        keyCode: item.code,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品类已经添加过了`
                })
            }
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectbrand (brandArr) {
            // console.log(brandArr, '品牌')
            const newData = [...this.DetailtableData]
            const error = []
            brandArr.forEach(item => {
                const has = newData.filter(o => o.keyCode === item.code)
                if (has.length === 0) {
                    this.DetailtableData.push({
                        classCode: '',
                        className: '',
                        brandCode: item.code,
                        brandName: item.name,
                        note: '',
                        keyCode: item.code,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品牌已经添加过了`
                })
            }
        },
        /**
         * @name: 品类 品牌 选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectBrandCategory (brandCategoryArr) {
            // console.log('品类品牌', brandCategoryArr)
            const newData = [...this.DetailtableData]
            const error = []
            brandCategoryArr.forEach(item => {
                const has = newData.filter(o => o.keyCode === item.classCode + item.brandCode)
                if (has.length === 0) {
                    this.DetailtableData.push({
                        classCode: item.classCode,
                        className: item.className,
                        brandCode: item.brandCode,
                        brandName: item.brandName,
                        note: '',
                        keyCode: item.classCode + item.brandCode,
                        tb_web_id: item.id
                    })
                } else {
                    error.push(item.classCode + '+' + item.brandCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-品类品牌已经添加过了`
                })
            }
        },
        /**
         * @name: 详情
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.previewVisbel = true
            this.previewDetailData = { ...detailData }
            if (detailData.auditStatus === 'marketing_points_define_audit_status:1') {
                this.previewTags = ['uncheck']
            } else {
                this.previewTags = ['check']
            }
            this.previewContent.headers = {
                paidAmount: detailData.paidAmount,
                pointAmount: detailData.pointAmount,
                note: detailData.note,
                status: detailData.statusName
            }
            axios({
                path: 'PointDefineQueryDetail',
                method: 'post',
                body: {
                    marketingPointsDefineCode: detailData.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.list
                }
            })
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

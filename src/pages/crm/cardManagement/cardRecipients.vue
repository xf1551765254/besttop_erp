<!--
 * @Description: 卡领用
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-08-23 19:02:05
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          type="primary"
          size="small"
          style="margin-right:10px"
          icon="audit"
          v-action:verify
          @click="auditHandler('isM')">审核</a-button>
      </div>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增弹框 -->
    <bt-modal
      v-model="AddEditModal"
      :title="AddEditModalTile"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags">
      <!--  基础 -->
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">领用人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择领用人"
                style="width: 100%"
                :options="applyByDorpArr"
                @search="handleApplyByDorpArr"
                :filterOption="false"
                v-decorator="$check('cardRecipients.distributeBy',{initialValue:tableSingleData.distributeBy})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择负责人"
                style="width: 100%"
                :filterOption="false"
                :options="managerByDorpArr"
                @search="handlemanagerByDorpArr"
                v-decorator="$check('cardRecipients.managerBy',{initialValue:tableSingleData.managerBy})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">领用店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                placeholder="请选择领用店"
                :filterOption="false"
                :options="makeStoreCodeDorpArr"
                @search="handerDistributeStore"
                v-decorator="$check('cardRecipients.distributeStore',{initialValue:tableSingleData.distributeStore})"
                allowClear/>
            </a-form-item>
          </a-col>
          <!-- <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                style="width: 100%"
                :options="makeStoreCodeDorpArr"
                disabled
                v-decorator="$check('cardRecipients.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
                allowClear/>
            </a-form-item>
          </a-col> -->
          <a-col :sm="8" :md="4" :xl="3">卡名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                ref="typeNameRef"
                showSearch
                placeholder="请选择卡名称"
                style="width: 100%"
                :options="typeNameArr"
                :filterOption="false"
                @search="handletypeNameDorpArr"
                @select="changeTypeNameValue"
                v-decorator="$check('cardRecipients.typeName',{initialValue:tableSingleData.typeName})"/>
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
                :rows="2"
                v-decorator="$check('cardRecipients.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed/>
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button type="primary" size="small" @click="chooseCard" style="margin:0 10px 5px 10px">选择卡</a-button>
        <a-button class="editable-add-btn" :disabled="selectedRowKeys.length===0" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumns"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x: 1050 }"
          :dataSource="tableData"
          :rowSelection="{onChange: onSelectChange}"
        >
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
      <a-divider dashed/>
      <!-- 落款 -->
      <a-form :form="form">
        <a-row class="" style="margin-left:28px">
          <a-col :md="4" :lg="3" :xl="3">制单人：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 内部增加卡信息 -->
    <a-modal
      v-model="chooseCardModal"
      title="选择卡信息"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      style="top: 20px;"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <!-- 搜索按钮 -->
      <div>
        <a-row type="flex" align="middle" style="margin-bottom:5px;margin-left:5px">
          <!-- <a-col :span="3" style="text-align:right">卡名称：</a-col> -->
          <a-col :span="3" style="text-align:right">卡开始号码：</a-col>
          <a-col :span="4">
            <a-input
              ref="beginNumberRef"
              v-model="chooseSearchForm.beginNumber"
              placeholder="请输入开始号码"/>
          </a-col>
          <a-col :span="3" style="text-align:right">卡结束号码：</a-col>
          <a-col :span="4">
            <a-input
              ref="endNumberRef"
              v-model="chooseSearchForm.endNumber"
              placeholder="请输入结束号码"/>
          </a-col>
          <!-- <a-col :span="3" style="text-align:right">储蓄状态：</a-col>
          <a-col :span="4">
            <a-select
              placeholder="请选择状态"
              style="width: 100%"
              allowClear
              v-model="chooseSearchForm.evaluateFlag">
              <a-select-option value="0">未储值</a-select-option>
              <a-select-option value="1">已储值</a-select-option>
            </a-select>
          </a-col> -->
          <a-col :span="2">
            <a-button
              size="small"
              style="margin-left:10px"
              type="primary"
              icon="search"
              @click="searchSubmit">
              搜索
            </a-button></a-col>
        </a-row>
      </div>
      <a-spin :spinning="spinning">
        <div class="table-nowrap">
          <a-table
            rowKey="id"
            :columns="chooseCardColumns"
            size="small"
            bordered
            :pagination="{defaultPageSize:10,hideOnSinglePage:true}"
            :scroll="{ x: 1400 }"
            :dataSource="chooseCardTableData"
            :rowSelection="{onChange: onSelectCardChange}">
          </a-table>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button size="small" @click="chooseCardModal=false">关闭</a-button>
        <a-button size="small" type="primary" @click="chooseCardSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.table-nowrap{
    white-space:nowrap;
    text-overflow:ellipsis;
    margin: 0 10px;
}
.setDocCss .ant-select-disabled svg{
    display: none;
}
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
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox, BtModal },
    name: 'CardRecipients',
    data () {
        return {
            conditions: [
                {
                    key: 'typeName',
                    type: 'select',
                    title: '卡名称',
                    label: 'typeName',
                    value: 'typeName',
                    filter: true,
                    path: 'CardDefineQueryAllName'
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
                    key: 'distributeBy',
                    type: 'select',
                    title: '领用人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'card_distribute_status'
                    }
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
            menuOpt: [
                { name: '编辑',
                    action: 'cardRecipients.edit',
                    fc: this.addEditHandler
                },
                { name: '审核',
                    action: 'cardRecipients.verify',
                    fc: this.auditHandler
                },
                { name: '删除',
                    action: 'cardRecipients.delete',
                    fc: this.deleteHandler
                }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            // 新增
            tags: ['uncheck'],
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },
            AddEditModal: false, //
            AddEditModalTile: '',
            subLoading: false,
            isAdd: false, // 判断 是否为新增  编辑

            // 表格
            selectedRowKeys: [], // 选中的值
            selectedRows: [], // 选中的值
            tableColumns: [ // 表头
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '卡名称', dataIndex: 'typeName', width: 150, align: 'center' },
                { title: '卡号', dataIndex: 'cardNo', width: 150, align: 'center' },
                { title: '存款', dataIndex: 'cardAmount', width: 150, align: 'center' },
                { title: '制卡人编码', dataIndex: 'makeBy', width: 150, align: 'center' },
                { title: '制卡人', dataIndex: 'makeName', width: 150, align: 'center' },
                { title: '制卡时间', dataIndex: 'makeTime', width: 150, align: 'center' },
                // { title: '储值人编码', dataIndex: 'evaluationBy', width: 150, align: 'center', scopedSlots: { customRender: 'priceDisc' } },
                // { title: '储值人', dataIndex: 'evaluationName', width: 150, align: 'center', scopedSlots: { customRender: 'priceDisc' } },
                // { title: '储值时间', dataIndex: 'evaluateTime', width: 150, align: 'center', scopedSlots: { customRender: 'quantity' } },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            tableData: [], // 表体
            delIdArr: [], // 详情表格删除的id
            typeNameValue: '', // 卡名称选择的值

            // 选择卡信息表格
            spinning: false,
            chooseCardModal: false,
            selectedCardRowKeys: [],
            selectedCardRow: [],
            chooseCardColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '卡名称', dataIndex: 'typeName', width: 150, align: 'center' },
                { title: '卡号', dataIndex: 'cardNo', width: 150, align: 'center' },
                { title: '存款', dataIndex: 'cardAmount', width: 150, align: 'center' },
                { title: '制卡人编码', dataIndex: 'makeBy', width: 150, align: 'center' },
                { title: '制卡人', dataIndex: 'makeName', width: 150, align: 'center' },
                { title: '制卡时间', dataIndex: 'makeTime', width: 150, align: 'center' },
                { title: '储值人编码', dataIndex: 'evaluationBy', width: 150, align: 'center' },
                { title: '储值人', dataIndex: 'evaluationName', width: 150, align: 'center' },
                { title: '储值时间', dataIndex: 'evaluateTime', width: 150, align: 'center' }
            ],
            chooseCardTableData: [],
            // 搜索值
            chooseSearchForm: {
                beginNumber: '',
                endNumber: ''
            },
            beginNumber: '',
            endNumber: '',
            minNUm: '2',
            maxNum: '2',
            typeName: '', //

            // 下拉框
            applyByDorpArr: [], // 领用人
            managerByDorpArr: [], // 负责人
            makeStoreCodeDorpArr: [], // 制单位置
            typeNameArr: [] // 卡名称
        }
    },
    computed: {
        setStartTime () {
            return moment()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '7ea76201ae19417fb9aa77cfa3d26825:cardRuleDefinition'
            this.tableApiPath = 'CardDistributeQueryDistributeCards'
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
            e.path = 'CardDistributeQueryDistributeCards'
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
            if (e === 'export') {
                this.$refs.newTable.exportFile('CardDistributeQueryDistributeCards')
            } else if (e === 'add') {
                this.addEditHandler(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            }
        },
        /**
         * @name: 刷新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardDistributeQueryDistributeCards' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'card_distribute_status:0') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['删除', '编辑', '审核']
            }
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
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
            if (this.tableIdsArr.length === 0) {
                this.$message.warning('请选择要删除的列表')
                return
            }
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const NoDel = newData.filter(o => o.status !== 'card_distribute_status:0')
                if (NoDel.length > 0) {
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
                        path: 'CardDistributeDeleteDistributeCard', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
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
         */
        auditHandler (auditData) {
            let arr = []
            const _this = this
            if (auditData === 'isM') {
                const newData = [...this.tableRowsArr]
                const NoAudit = newData.filter(o => o.status !== 'card_distribute_status:0')
                if (NoAudit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(auditData.id)
            }
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CardDistributeAudit', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            store: _this.$store.getters.storeInfo.code
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
         * @name: 弹框关闭
         */
        formCancel () {
            this.AddEditModal = false
        },
        /**
         * @name: 新增:
         */
        addEditHandler (addEditDate) {
            this.AddEditModal = true
            if (addEditDate === -1) {
                this.isAdd = true
                this.AddEditModalTile = '新增卡领用'
                this.tableSingleData = {}
                this.tableData = []
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                this.isAdd = false
                this.AddEditModalTile = '编辑卡领用'
                const objTime = { ...addEditDate }
                objTime.createTime = moment(objTime.createTime)
                this.defauilForm.makeStoreCode = objTime.makeStoreCode
                this.defauilForm.makeStoreName = objTime.makeStoreName
                this.defauilForm.createBy = objTime.createBy
                this.defauilForm.createName = objTime.createName
                this.defauilForm.createTime = moment(objTime.createTime).format('YYYY-MM-DD HH:mm:ss')
                this.typeNameValue = objTime.typeName
                this.getManagerByDorpArr(objTime.managerBy)
                this.getApplyByDorpArr(objTime.distributeBy)
                this.getTypeNameArr(objTime.typeCode)
                this.getMakeStoreCodeDorpArr(objTime.distributeStore)
                axios({
                    path: 'CardDistributeQueryDistributeCard',
                    method: 'post',
                    body: {
                        id: addEditDate.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        for (const i of res.data.queryVoList) {
                            i.tb_web_id = i.id
                        }
                        const obj = { ...res.data }
                        this.tableSingleData = { ...res.data }
                        if (obj.auditTime) {
                            obj.auditTime = moment(obj.auditTime)
                        }
                        obj.createTime = moment(obj.createTime)
                        this.tableSingleData = { ...obj }
                        this.tableSingleData.typeName = addEditDate.typeName
                        this.tableData = res.data.queryVoList
                    }
                })
            }
        },
        /**
         * @name:  查询领用人
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
         * @name: 领用人
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
         * @name: 查询负责人
         */        
        handlemanagerByDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.managerByDorpArr.length = 0
                this.getManagerByDorpArr(value)
            }, 300)
        },
        /**
         * @name: 分责人
         */
        getManagerByDorpArr (value) {
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
                    this.managerByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 查询店
         */        
        handerDistributeStore (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.makeStoreCodeDorpArr.length = 0
                this.getMakeStoreCodeDorpArr(value)
            }, 300)
        },
        /**
         * @name: 领用店
         * 
         */
        getMakeStoreCodeDorpArr (value) {
            axios({
                path: 'OrganizationStoreFind',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    condition: value
                }
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
         * @name: 卡名称
         */
        handletypeNameDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.typeNameArr.length = 0
                this.getTypeNameArr(value)
            }, 300)
        },
        /**
         * @name: 获取卡名称
         */
        getTypeNameArr (value) {
            axios({
                path: 'CardDefineQueryAllDefineName',
                method: 'post',
                body: {
                    status: 'card_type_define_status:1'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.typeCode}-${i.typeName}`
                        i.title = `${i.typeCode}-${i.typeName}`
                        i.value = i.typeName
                    })
                    this.typeNameArr = [...data]
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
         * @name: 详情选择卡弹框
         * @msg:
         * @param {type}
         * @return:
         */
        chooseCard () {
            // this.chooseSearchForm = {
            //     beginNumber: '',
            //     endNumber: ''
            // }
            if (!this.$refs.typeNameRef.value) {
                this.$message.warning('请选择卡名称')
                return
            }
            this.chooseCardTableData = []
            this.chooseCardModal = true
            // this.selectedRowKeys = []
            const newDta = [...this.typeNameArr]
            const target = newDta.filter(o => o.value === this.typeNameValue)[0]
            this.minNum = target.minNum
            this.maxNum = target.maxNum
            this.chooseSearchForm.beginNumber = target.minNum
            this.chooseSearchForm.endNumber = target.maxNum
            this.getChooseTableData()
        },
        /**
         * @name: 详情表格选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = map(selectRows, 'tb_web_id')
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
                const deleteoData = [...this.tableData]
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
                this.tableData = deleteoData
            } else {
                const newData = [...this.tableData]
                this.tableData = newData.filter(item => item.tb_web_id !== keyId)
                const selectId = newData.filter(item => item.tb_web_id === keyId)[0]
                if (selectId.id) {
                    this.delIdArr.push(selectId.id)
                }
            }
        },
        /**
         * @name:新增 编辑 弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData.length === 0) {
                        this.$message.warning('请选择详情数据')
                        return
                    }
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                    }

                    values.createTime = this.defauilForm.createTime
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.ids = map(this.tableData, 'tb_web_id')
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'CardDistributeAddDistributeCard' : 'CardDistributeUpdateDistributeCard',
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
         * @name: 选择卡 表格 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        searchSubmit () {
            if (!this.chooseSearchForm.beginNumber) {
                this.chooseSearchForm.beginNumber = undefined
            } else if (this.chooseSearchForm.beginNumber.length !== 8) {
                this.$message.error('请输入8位开始号码')
                return
            }
            if (!this.chooseSearchForm.endNumber) {
                this.chooseSearchForm.endNumber = undefined
            } else if (this.chooseSearchForm.endNumber.length !== 8) {
                this.$message.error('请输入8结束号码')
                return
            }
            if (Number(this.chooseSearchForm.beginNumber) < Number(this.minNum)) {
                this.$message.error('输入的开始号码不能小于该卡的开始号码')
                return
            }
            this.getChooseTableData()
        },
        /**
         * @name: 获取选择卡的数据
         * @msg:
         * @param {type}
         * @return:
         */
        getChooseTableData () {
            this.chooseSearchForm.typeName = this.$refs.typeNameRef.value
            this.chooseSearchForm.distributeFlag = '0'
            this.chooseSearchForm.status = 'card_make_status:0'
            this.spinning = true
            axios({
                path: 'CardDistributeQueryCardEvaluationAndMake',
                method: 'post',
                body: this.chooseSearchForm
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    if (res.data.length === 0) {
                        this.$message.warning('此卡名称已经被领完')
                        this.chooseCardTableData = res.data
                    } else {
                        this.chooseCardTableData = res.data
                    }
                }
            })
        },
        /**
         * @name: 卡名称值改变
         * @msg:
         * @param {type}
         * @return:
         */
        changeTypeNameValue (value) {
            const _this = this
            if (this.typeNameValue === '') {
                this.typeNameValue = value
            } else if (this.typeNameValue !== value) {
                if (this.tableData.length > 0) {
                    _this.$confirm({
                        title: '提示',
                        content: '此操作进行将会清空详情数据, 是否继续?',
                        okText: '确定',
                        cancelText: '取消',
                        onOk () {
                            _this.tableData = []
                            _this.typeNameValue = value
                        },
                        onCancel () {
                            _this.form.setFieldsValue({
                                typeName: _this.typeNameValue
                            })
                            _this.$message.info('已取消')
                        },
                        class: 'test'
                    })
                } else {
                    this.typeNameValue = value
                }
            }
        },
        switchTypeNameValue (value, oldValue) {
            const _this = this
            if (this.tableData.length > 0) {
                _this.$confirm({
                    title: '提示',
                    content: '此操作进行将会清空详情数据, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        _this.tableData = []
                        const newArr = [..._this.typeNameArr]
                        const target = newArr.filter(o => o.typeCode === value)[0]
                        _this.minNum = target.minNum
                        _this.maxNum = target.maxNum
                        _this.chooseSearchForm.beginNumber = target.minNum
                        _this.chooseSearchForm.endNumber = target.maxNum
                    },
                    onCancel () {
                        _this.form.setFieldsValue({
                            typeName: oldValue
                        })
                        // _this.typeNameValue = oldValue
                        _this.$message.info('已取消')
                    },
                    class: 'test'
                })
            } else {
                const newArr = [..._this.typeNameArr]
                const target = newArr.filter(o => o.typeName === value)[0]
                this.minNum = target.minNum
                this.maxNum = target.maxNum
                this.chooseSearchForm.beginNumber = target.minNum
                this.chooseSearchForm.endNumber = target.maxNum
            }
        },
        /**
         * @name: 选择卡 表格选择信息
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectCardChange (keys, keyRow) {
            this.selectedCardRow = keyRow
        },
        /**
         * @name: 选择卡信息提交
         * @msg:
         * @param {type}
         * @return:
         */
        chooseCardSubmit () {
            const error = []
            // console.log(this.selectedCardRow)
            this.selectedCardRow.forEach(item => {
                const has = this.tableData.filter(o => o.tb_web_id === item.id)
                if (has.length === 0) {
                    this.tableData.push({
                        tb_web_id: item.id,
                        typeName: item.typeName,
                        cardNo: item.cardNo,
                        cardAmount: item.cardAmount,
                        makeBy: item.makeBy,
                        makeName: item.makeName,
                        makeTime: item.makeTime,
                        evaluationBy: item.evaluationBy,
                        evaluationName: item.evaluationName,
                        evaluateTime: item.evaluateTime
                    })
                } else {
                    error.push(item.cardNo)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.chooseCardModal = false
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'cardRecipients') {
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

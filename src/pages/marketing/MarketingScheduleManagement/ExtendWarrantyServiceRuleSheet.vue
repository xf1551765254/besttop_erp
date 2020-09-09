<!--
 * @Description: 延保服务规则单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-01 16:38:55
 * @LastEditors: lin
 * @LastEditTime: 2019-08-20 18:16:58
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
    <!-- 新增 编辑 -->
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
          <a-col :sm="8" :md="4" :xl="3">商品类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择商品类型"
                style="width:85%"
                v-decorator="$check('ExtendWarranty.skuType',{initialValue:tableSingleData.skuType||'goods_type:2'}) "
                :options="skuTypeDorpArr"
                allowClear>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                placeholder="请输入规则名称"
                v-decorator="$check('ExtendWarranty.name', {initialValue:tableSingleData.name||''})"/>
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
          <a-col :sm="8" :md="4" :xl="3">品类</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择品类"
                style="width:100%"
                mode="multiple"
                :maxTagCount="1"
                v-decorator="$check('ExtendWarranty.effectClassCode',{initialValue:tableSingleData.effectClassCode||[]}) "
                :options="effectClassCodeDorpArr"
                allowClear>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('ExtendWarranty.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 详情表格 -->
      <div class="table-input-inner">
        <a-row class="titleSet" style="">延保商品列表</a-row>
        <a-button size="small" @click="addDetails" style="margin-bottom:5px">新增</a-button>
        <a-button type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
        <!-- 详情表格 -->
        <div class="table-nowrap">
          <a-table
            rowKey="tb_web_id"
            :columns="tableColumns"
            size="small"
            :pagination="false"
            :scroll="{ x: 1220}"
            :dataSource="detailTableData"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            bordered>
            <template v-for="col in ['minAmount','maxAmount','thirdPartyCode','acppType','acppAmount','note']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <a-input-number
                  v-if="col === 'minAmount'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0.00"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input
                  v-else-if="col === 'thirdPartyCode'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.tb_web_id, col)"/>
                <a-input-number
                  v-else-if="col === 'maxAmount'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-select
                  v-else-if="col === 'acppType'"
                  style="width: 100%"
                  placeholder="请选延保类型"
                  :value="text"
                  :options="acppTypeDataArr"
                  @change="e => InputChange(e, record.tb_web_id, col)"/>
                <a-input-number
                  v-else-if="col === 'acppAmount'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :min="0"
                  :max="Number.MAX_SAFE_INTEGER"
                  :step="1"
                  :precision="2"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input
                  v-else-if="col === 'note'"
                  style="margin: -3px 0; width:100%;height:30px"
                  :value="text"
                  @change="e => InputChange(e.target.value, record.tb_web_id, col)"/>
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
        </div>
      </div>
      <!-- 落款信息 -->
      <a-form>
        <a-row class="titleSet" style="margin-top:10px">落款信息</a-row>
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
import Preview from '@pages/marketing/MarketingScheduleManagement/preview/ExtendWarrantyServiceRuleSheetPre'
export default {
    components: { NewTable, SeachBox, BtModal, store, Preview },
    name: 'ExtendWarrantyServiceRuleSheet',
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
                    key: 'status',
                    type: 'select',
                    title: '审核状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'DistOriginDataQueryAcppRuleDefineStatusList'
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
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'ExtendWarrantyServiceRuleSheet.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'ExtendWarrantyServiceRuleSheet.delete',
                    fc: this.deleteHandler
                },
                { name: '审核',
                    action: 'ExtendWarrantyServiceRuleSheet.verify',
                    fc: this.auditHandler
                },
                { name: '预览',
                    action: 'ExtendWarrantyServiceRuleSheet.get',
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
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')
            },

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值

            // 商品列表
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '起始价格（元）', dataIndex: 'minAmount', align: 'center', width: 150, scopedSlots: { customRender: 'minAmount' } },
                { title: '截止价格（元）', dataIndex: 'maxAmount', align: 'center', width: 150, scopedSlots: { customRender: 'maxAmount' } },
                { title: '延保类型', dataIndex: 'acppType', align: 'center', width: 150, scopedSlots: { customRender: 'acppType' } },
                { title: '延保金（元）', dataIndex: 'acppAmount', align: 'center', width: 150, scopedSlots: { customRender: 'acppAmount' } },
                { title: '编码', dataIndex: 'thirdPartyCode', align: 'center', width: 150, scopedSlots: { customRender: 'thirdPartyCode' } },
                { title: '备注', dataIndex: 'note', align: 'center', width: 200, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            detailTableData: [],
            selectedRowKeys: [], // 选中的值

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: [],
            skuTypeDorpArr: [],
            effectClassCodeDorpArr: [],
            acppTypeDataArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '50280a3bf7aa476598b596de6cfac020:ExtendWarrantyServiceRuleSheet'
            this.tableApiPath = 'AcppRuleDefineFindRuleDefinePageList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
        this.getSkuTypeDorpArr()
        this.getEffectClassDorpArr()
        this.getAcppTypeDataArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'AcppRuleDefineFindRuleDefinePageList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         */
        onReload () {
            this.seachValue = { }
        },
        /**
         * @name: 工具栏功能按键
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
                this.$refs.newTable.exportFile('AcppRuleDefineFindRuleDefinePageList')
            }
        },
        /**
         * @name: 更新表格
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'AcppRuleDefineFindRuleDefinePageList' })
        },
        /**
         * @name: 表格的多选
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'code')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 表格右击
         */
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'acpp_rule_define_status:1') {
                this.disContextMenu = []
            } else if (tableRow.status === 'acpp_rule_define_status:2') {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        /**
         * @name: 主表删除
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'acpp_rule_define_status:1')
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
                        path: 'AcppRuleDefineBatchDelete', // 接口path名，必传
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
                        path: 'AcppRuleDefineBatchVerify', // 接口path名，必传
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
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '新增延保服务规则单'
                this.tableSingleData = { }
                this.tempObjArrEffect = [] // 生效机构
                this.detailTableData = [] // 表格数据
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑延保服务规则单'
                const obj = { ...addEditData }
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createByName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                this.tempObjArrEffect = obj.effectStoreCode
                this.tableSingleData = obj
                axios({
                    path: 'AcppRuleDefineFindOne',
                    methods: 'post',
                    body: {
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data.detailBOList]
                        data.forEach(item => {
                            item.tb_web_id = item.detailId
                        })
                        this.detailTableData = data
                    }
                })
            }
            this.AddEditModal = true
        },
        /**
         * @name: 弹框提交
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const newData = [...this.detailTableData]
                    if (newData.length === 0) {
                        return this.$message.error('请选择延保商品列表')
                    }
                    values.effectStoreCode = this.tempObjArrEffect
                    values.makeStoreCode = this.defauilForm.makeStoreCode
                    values.makeStoreName = this.defauilForm.makeStoreName
                    values.createBy = this.$store.getters.code
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                        values.makeStoreName = this.tableSingleData.makeStoreName
                        values.createBy = this.tableSingleData.createBy
                    }
                    values.acppDetailList = newData
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'AcppRuleDefineAddSelective' : 'AcppRuleDefineUpdateSelective',
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
         * @name: 生效机构弹框
         */
        selectFocusEffect () {
            this.storeQueryEffect = true
            this.$refs.storeEffectRef.blur() // 取消选择框的焦点，防止重复触发选择器
        },
        /**
         * @name: 门店选择器 生效机构
         */
        onStoreSelectEffect (arr) {
            this.tempObjArrEffect = [...map(arr, 'code')] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 表格选择
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = selectKeys
        },
        /**
         * @name: 详情 新增
         */
        addDetails () {
            const obj = {
                minAmount: '0',
                maxAmount: '0',
                acppType: 'acpp_type:1',
                acppAmount: '0',
                thirdPartyCode: '',
                note: '',
                tb_web_id: uuid.v1().replace(/-/g, '')
            }
            this.detailTableData.push(obj)
        },
        /**
         * @name: 订单详情删除
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.detailTableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.detailTableData = deleteoData
                this.selectedRowKeys = []
            } else {
                const newData = [...this.detailTableData]
                this.detailTableData = newData.filter(item => item.tb_web_id !== keyId)
            }
        },
        /**
         * @name: 编辑 表格 编辑时
         */
        InputChange (val, count, key) {
            const newData = [...this.detailTableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (key === 'thirdPartyCode') {
                    if (val) {
                        console.log(val)
                        if (!Number(val)) {
                            this.$message.error('请输入数字')
                            target[key] = 0
                        } else if (val.length >= 50) {
                            this.$message.error('编码位数最大50位')
                            target[key] = 0
                        } else {
                            target[key] = val
                        }
                    } else {
                        target[key] = val
                    }
                } else if (key === 'minAmount' || key === 'maxAmount' || key === 'acppAmount') {
                    target[key] = val || 0
                } else {
                    target[key] = val
                }
                this.detailTableData = newData
            }
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
         * @name:  商品类型
         */
        getSkuTypeDorpArr () {
            axios({
                path: 'DistOriginDataQuerySkuTypeList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.code}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.skuTypeDorpArr = [...data]
                }
            })
        },
        /**
         * @name: 品类
         * @msg:
         * @param {type}
         * @return:
         */
        getEffectClassDorpArr () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: {
                    level: 2
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.effectClassCodeDorpArr = data
                }
            })
        },
        /**
         * @name: 延保类型
         * @msg:
         * @param {type}
         * @return:
         */
        getAcppTypeDataArr () {
            axios({
                path: 'DistOriginDataQueryAcppRuleDefineTypeList',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.code}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.acppTypeDataArr = [...data]
                }
            })
        },
        /**
         * @name: 详情
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'ExtendWarrantyServiceRuleSheet') {
                this.getEffectStoreArr()
                this.getSkuTypeDorpArr()
                this.getEffectClassDorpArr()
                this.getAcppTypeDataArr()
            }
        },
        'seachValue.limitStartTime' (val, oldVal) {
            if (val && this.seachValue.limitEndTime) {
                if (moment(val).isAfter(this.seachValue.limitEndTime)) {
                    this.seachValue.limitEndTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.limitEndTime' (val, oldVal) {
            if (val && this.seachValue.limitStartTime) {
                if (moment(val).isBefore(this.seachValue.limitStartTime)) {
                    this.seachValue.limitStartTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>
<style lang="less">
.table-input-inner{
    .ant-input-number-input{
        height: 28px;
    }
}
</style>
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

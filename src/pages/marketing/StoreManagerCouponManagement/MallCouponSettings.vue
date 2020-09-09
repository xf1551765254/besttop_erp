<!--
 * @Description: 商场券配置
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-26 09:32:08
 * @LastEditors: lin
 * @LastEditTime: 2019-08-19 15:07:30
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
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增 编辑 -->
    <bt-modal
      :title="addEditModalTitle"
      v-model="addEditModel"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <!-- 基础信息 -->
      <a-form :form="form">
        <a-row class="titleSet" style="">基础信息</a-row>
        <a-row>
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
          <a-col :sm="8" :md="4" :xl="3">
            生效日期
          </a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('couponSetting.effectTime', {initialValue:tableSingleData.effectTime||setEffectTime})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3"> 备注 </a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :rows="2" v-decorator="$check('couponSetting.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 商品信息 -->
      <div>
        <a-button type="primary" size="small" @click="addDetails" style="margin-left:5px;margin-bottom:5px">增加</a-button>
        <a-button class="editable-add-btn" type="danger" size="small" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
        <div class="table-nowrap">
          <a-table
            rowKey="tb_web_id"
            :columns="tableColumns"
            :scroll="{ x:1150}"
            bordered
            :pagination="false"
            :dataSource="detailTableData"
            size="small"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          >
            <template v-for="col in ['amount', 'couponRateOne','note']" :slot="col" slot-scope="text, record">
              <div :key="col">
                <a-input-number
                  v-if=" col === 'amount'"
                  style="margin: -3px 0; width:100%;height:28px"
                  :min="0"
                  :precision="2"
                  :max="Number.MAX_SAFE_INTEGER"
                  :value="text"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input-number
                  v-else-if=" col === 'couponRateOne'"
                  style="margin: -3px 0; width:100%;height:28px"
                  :min="0"
                  :max="100"
                  :value="text"
                  :formatter="value => `${value}`"
                  :parser="value => value"
                  :precision="2"
                  @change="e => InputChange(e, record.tb_web_id, col)" />
                <a-input
                  v-else-if=" col === 'note'"
                  style="margin: -3px 0; width:100%;height:28px"
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
    <!-- 选择品类 品牌弹窗 -->
    <goods :visible.sync="goodsQuery" @onSelect="onSelectAddGoods" :pams="pams" multiple/>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
import { uuid } from 'vue-uuid'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import store from '@comp/BasicQuery/store'
import goods from '@pages/marketing/StoreManagerCouponManagement/toop/goods'
import Preview from '@pages/marketing/StoreManagerCouponManagement/preview/MallCouponSettingsPreview'
export default {
    components: { NewTable, SeachBox, BtModal, store, goods, Preview },
    name: 'MallCouponSettings',
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
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'coupon_define_status'
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
                type: 'coupon_define_type:2',
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
                    action: 'MallCouponSettings.edit',
                    fc: this.addEdit
                }, { name: '删除',
                    action: 'MallCouponSettings.delete',
                    fc: this.deleteHandler
                }, { name: '审核',
                    action: 'MallCouponSettings.verify',
                    fc: this.auditHandler
                },
                { name: '预览',
                    action: 'MallCouponSettings.get',
                    fc: this.detailHandler
                }
            ],

            // 新增编辑弹框
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            isAdd: false,
            // 新增编辑模态框头
            addEditModalTitle: '',
            subLoading: false,
            form: this.$form.createForm(this),
            defauilForm: {
                makeStoreCode: `${this.$store.getters.storeInfo.code}`,
                makeStoreName: `${this.$store.getters.storeInfo.name}`,
                createBy: `${this.$store.getters.code}`,
                createName: `${this.$store.getters.name}`,
                createTime: moment().format('YYYY-MM-DD HH:mm')
            },

            // 生效分店
            storeQueryEffect: false,
            tempObjArrEffect: [], // 选中的值

            // 商品列表
            // 详情表头
            tableColumns: [
                { title: '序号', width: 80, align: 'center', customRender: (text, record, index) => `${index + 1}`, fixed: 'left' },
                { title: '机构代码', dataIndex: 'storeCode', width: 100, align: 'center' },
                { title: '机构名称', dataIndex: 'storeName', width: 180, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 100, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'center' },
                { title: '使用比例（%）', dataIndex: 'couponRateOne', width: 120, align: 'center', scopedSlots: { customRender: 'couponRateOne' } },
                { title: '备注', dataIndex: 'note', width: 200, align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, align: 'center', scopedSlots: { customRender: 'operation' } }
            ],
            detailTableData: [],
            selectedRowKeys: [],
            selectedRowRows: [],

            // 品类品牌弹框
            goodsQuery: false,
            pams: {},

            // 预览
            previewVisbel: false,
            orderId: '',

            // 下拉框
            effectStoreArr: []

        }
    },
    computed: {
        setEffectTime () {
            return moment().startOf('day').add({ days: 1 })
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '37496acfc65f4de48f8e1cc92f497206:MallCouponSettings'
            this.tableApiPath = 'CouponQueryList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectStoreArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CouponQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {
                type: 'coupon_define_type:2'
            }
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
                this.$refs.newTable.exportFile('CouponQueryList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CouponQueryList' })
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
            console.log(tableRow)
            if (tableRow.status === 'coupon_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
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
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CouponDeleteCouponDefine', // 接口path名，必传
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
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CouponUpdateCouponDefineStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: [autiData.id]
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
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.addEditModel = true
            if (addEditData === -1) {
                this.isAdd = true
                this.addEditModalTitle = '新增商场券配置'
                this.tableSingleData = {}
                this.detailTableData = [] // 表格数据
                this.tempObjArrEffect = [] // 生效机构
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                const { mul } = this.$math
                this.isAdd = false
                this.addEditModalTitle = '编辑商场券配置'
                const obj = { ...addEditData }
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                if (!obj.effectStore) {
                    this.tempObjArrEffect = []
                } else {
                    obj.effectStore = obj.effectStore.split(',')
                    this.tempObjArrEffect = [...obj.effectStore]
                }
                obj.effectTime = moment(obj.effectTime)
                this.tableSingleData = obj
                axios({
                    path: 'CouponQueryCouponDefineDetail',
                    method: 'post',
                    body: {
                        id: addEditData.id,
                        code: addEditData.code
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = [...res.data]
                        data.forEach(item => {
                            item.tb_web_id = item.id
                            item.couponRateOne = mul(item.couponRate, 100, 2)
                        })
                        this.detailTableData = data
                    }
                })
            }
        },
        /**
         * @name: 弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const { div } = this.$math
                    const newData = [...this.detailTableData]
                    if (newData.length === 0) {
                        return this.$message.error('请选择商品列表')
                    }
                    newData.forEach(item => {
                        item.couponRate = div(item.couponRateOne, 100, 4)
                    })
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.code = this.tableSingleData.code
                    } else {
                        values.makeStoreCode = this.defauilForm.makeStoreCode
                    }
                    values.effectTime = values.effectTime.startOf('day').format('YYYY-MM-DD')
                    values.effectStore = this.tempObjArrEffect.join(',')
                    values.detailList = newData
                    values.type = 'coupon_define_type:2'
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'CouponAddCouponDefine' : 'CouponUpdateCouponDefine',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.subLoading = false
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
         * @name: 生效日期校验
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 订单详情删除
        */
        deleteRow (index) {
            if (index === -1) {
                if (this.selectedRowKeys.length === 0) {
                    this.$message.warning('请选择需要删除的数据！')
                    return
                }
                const infoData = [...this.detailTableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in infoData) {
                        if (infoData[j].tb_web_id === this.selectedRowKeys[i]) {
                            infoData.splice(j, 1)
                        }
                    }
                }
                this.detailTableData = infoData
            } else {
                const infoData = [...this.detailTableData]
                this.detailTableData = infoData.filter(item => item.tb_web_id !== index)
            }
        },
        /**
         * @name: 编辑 表格 编辑时
        */
        InputChange (val, count, key) {
            const newData = [...this.detailTableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
            if (target) {
                if (key === 'couponRateOne') {
                    target[key] = val || 0
                } else {
                    target[key] = val
                }
                this.detailTableData = newData
            }
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
        * @name: 新增详情
        */
        addDetails () {
            if (this.tempObjArrEffect.length === 0) {
                this.$message.warning('请选择生效机构！')
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
                const has = this.detailTableData.filter(o => o.unquid === mun.storeCode + mun.classCode + mun.brandCode)
                if (has.length === 0) {
                    this.detailTableData.push({
                        tb_web_id: uuid.v1().replace(/-/g, ''),
                        storeCode: mun.storeCode,
                        storeName: mun.storeName,
                        classCode: mun.classCode,
                        className: mun.className,
                        brandCode: mun.brandCode,
                        brandName: mun.brandName,
                        amount: Number(1).toFixed(2),
                        couponRateOne: 0,
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
         * @name: 详情
         */
        detailHandler (detailData) {
            this.orderId = detailData.code
            this.previewVisbel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'MallCouponSettings') {
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
<style lang="less" scoped>
.titleSet{
   font-size:14px;font-weight: bold;margin-bottom:5px;color:#409EFF
}
</style>

<!--
 * @Description: 热门推荐
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-19 17:32:22
 * @LastEditors: lin
 * @LastEditTime: 2019-07-03 12:33:09
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
    <!-- 新增编辑 -->
    <bt-modal
      v-model="addEditModel"
      :title="AddEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择状态"
                style="width: 100%"
                :options="statusArr"
                :disabled="isAdd"
                v-decorator="$check('HotRecommended.status',{initialValue:tableSingleData.status||'marketing_hot_commodities_status:2'})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider dashed />
      <div>
        <a-button size="small" style="margin-bottom:5px;margin-left:5px" @click="goodsQuery=true">增加商品</a-button>
        <a-button type="danger" size="small" :disabled="selectedRowKeys.length===0" style="margin-left:5px;margin-bottom:5px" @click="deleteRow(-1)">删除</a-button>
      </div>
      <a-table
        rowKey="skuCode"
        :columns="DetailtableColumns"
        size="small"
        bordered
        :pagination="false"
        :scroll="{ x: 1160 }"
        :dataSource="DetailtableData"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <template v-for="col in ['sort','note','skuName','skuModel']" :slot="col" slot-scope="text, record, index">
          <div :key="col">
            <a-input-number
              v-if="col==='sort'"
              style="margin: -5px 0; width:100%"
              :min="1"
              :value="text"
              :precision="0"
              :max="Number.MAX_SAFE_INTEGER"
              @change="e => InputChange(e, record.skuCode,col)" />
            <a-input
              v-if="col==='note'"
              style="margin: -5px 0; width:100%"
              :value="text"
              @change="e => InputChange(e.target.value, record.skuCode,col)"/>
            <div v-if="col==='skuName'">
              <a-tooltip v-if="text.length&&text.length > 10" :title="text">
                <span>{{ `${text.slice(0, 10)}...` }}</span>
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
            <div v-if="col==='skuModel'">
              <a-tooltip v-if="text.length&&text.length > 10" :title="text">
                <span>{{ `${text.slice(0, 10)}...` }}</span>
              </a-tooltip>
              <span v-else>{{ text }}</span>
            </div>
          </div>
        </template>
        <template slot="action" slot-scope="text, record, index">
          <div class="editable-row-operations">
            <span>
              <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.skuCode)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
      <!-- goods选择-->
      <goods :visible.sync="goodsQuery" @onSelect="onSelectGoods" multiple/>
    </bt-modal>
    <!-- 单据预览 -->
    <preview
      v-model="previewVisbel"
      :orderId="tableSingleData.code"
      :tags="previewTags"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="B" title="热门推荐详情" :isTable="true" :columns="previewColumns" :data="epreviewTableData">
      </div>
    </preview>
  </div>
</template>
<style lang="less">

</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from '@comp/Modal/preview'
import goods from './components/goods'
import map from 'lodash.map'
import moment from 'moment'
import { axios } from '@/utils/request'
export default {
    name: 'HotRecommendedSetting',
    components: { NewTable, SeachBox, BtModal, Preview, goods },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '编号'
                },
                {
                    key: 'firstTime',
                    type: 'date',
                    title: '新增开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'lastTime',
                    type: 'date',
                    title: '新增结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    filter: true,
                    label: 'title',
                    value: ['type', 'configKey'],
                    selectDataArr: []
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                firstTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                lastTime: moment().format('YYYY-MM-DD')
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
                    action: 'HotRecommendedSetting.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'HotRecommendedSetting.delete',
                    fc: this.deleteHandler
                },
                { name: '启用',
                    action: 'HotRecommendedSetting.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'HotRecommendedSetting.disable',
                    fc: this.disableHandler
                },
                { name: '预览',
                    action: 'HotRecommendedSetting.get',
                    fc: this.detailHandler
                }
            ],

            // 新增 编辑 单据
            // 弹框
            tags: ['uncheck'], // 单据状态
            addEditModel: false,
            AddEditModalTitle: '', // 弹框title
            submitLoading: false,
            isAdd: false,
            // 表单
            form: this.$form.createForm(this),
            // 详情表格
            DetailtableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 180, align: 'center', scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, align: 'center', scopedSlots: { customRender: 'skuModel' } },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'center' },
                { title: '排序', dataIndex: 'sort', width: 100, align: 'center', scopedSlots: { customRender: 'sort' } },
                { title: '备注', dataIndex: 'note', width: 350, align: 'center', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 100, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            DetailtableData: [],
            selectedRowKeys: [], // 选中的值 skucode
            selectedRows: [], // 选中的值
            goodsQuery: false,

            // 预览
            previewVisbel: false,
            previewTags: [],
            // 基础信息
            previewHeaders: [
                { key: 'status', name: '状态' }
            ],
            previewContent: {},
            previewColumns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '零售价', dataIndex: 'price', width: 150, align: 'center' },
                { title: '排序', dataIndex: 'sort', width: 100, align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' }
            ],
            epreviewTableData: [],

            // 下拉款
            statusArr: []
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
            this.tableCode = 'b51ca6ca59ad4f79b70fffa8eb9fa241:HotRecommendedSetting'
            this.tableApiPath = 'HotCommoditiesQueryList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getStatusDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'HotCommoditiesQueryList'
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
                this.$refs.newTable.exportFile('HotCommoditiesQueryList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'HotCommoditiesQueryList' })
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
            if (tableRow.status === 'marketing_hot_commodities_status:1') {
                this.disContextMenu = ['启用', '删除']
            } else {
                this.disContextMenu = ['停用']
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
            const self = this
            if (delData === -1) {
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'marketing_hot_commodities_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行删除操作')
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
                        path: 'HotCommoditiesDeleteHotCommodities', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
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
            this.$confirm({
                title: '启用提示',
                content: '确定选中项全部启用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'HotCommoditiesUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            id: enableData.id,
                            status: 'marketing_hot_commodities_status:1'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 停用
         * @msg:
         * @param {type}
         * @return:
         */
        disableHandler (disData) {
            let arr = []
            const self = this
            if (disData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要停用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isEnable = newData.filter(o => o.status !== 'marketing_hot_commodities_status:1')
                if (isEnable.length > 0) {
                    this.$message.warning('只有启用状态的才能进行停用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(disData.id)
            }
            this.$confirm({
                title: '停用提示',
                content: '确定选中项全部停用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'HotCommoditiesUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            id: disData.id,
                            status: 'marketing_hot_commodities_status:2'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        addEdit (addEditData) {
            this.addEditModel = true
            if (addEditData === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '热门推荐新增'
                this.tableSingleData = {}
                this.DetailtableData = []
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '热门推荐编辑'
                const obj = { ...addEditData }
                this.tableSingleData = obj
                axios({
                    path: 'HotCommoditiesQueryDetail',
                    method: 'post',
                    body: {
                        id: addEditData.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.DetailtableData = res.data.details
                    }
                })
            }
        },
        /**
         * @name: 新增 编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    if (this.DetailtableData.length === 0) {
                        return this.$message.warning('请选择商品明细')
                    }
                    values.details = this.DetailtableData
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'HotCommoditiesAddHotCommodities' : 'HotCommoditiesUpdateHotCommodities',
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
                        if (deleteoData[j].skuCode === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.DetailtableData = deleteoData
            } else {
                const newData = [...this.DetailtableData]
                this.DetailtableData = newData.filter(item => item.skuCode !== keyId)
            }
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, key) {
            const newData = [...this.DetailtableData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[key] = val
                this.DetailtableData = newData
            }
        },
        /**
         * @name:选择商品
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectGoods (goodArr) {
            const newData = [...this.DetailtableData]
            const error = []
            goodArr.forEach(item => {
                const has = newData.filter(o => o.skuCode === item.skuCode)
                if (has.length === 0) {
                    this.DetailtableData.push({
                        skuCode: item.skuCode,
                        skuName: item.skuName,
                        skuModel: item.skuModel,
                        price: item.skuPrice,
                        pic: item.pic,
                        sort: this.DetailtableData.length + 1,
                        note: ''
                        // tb_web_id: item.skuCode
                    })
                } else {
                    error.push(item.skuCode)
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
         * @name: 获取状态
         * @msg:
         * @param {type}
         * @return:
         */
        getStatusDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'marketing_hot_commodities_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[3], 'selectDataArr', dataArr)
                    this.statusArr = dataArr
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
            this.previewContent.headers = {
                status: detailData.statusName
            }
            axios({
                path: 'HotCommoditiesQueryDetail',
                method: 'post',
                body: {
                    id: detailData.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.epreviewTableData = res.data.details
                    this.previewVisbel = true
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'HotRecommendedSetting') {
                this.getStatusDorpArr()
            }
        },
        'seachValue.firstTime' (val, oldVal) {
            if (val && this.seachValue.lastTime) {
                if (moment(val).isAfter(this.seachValue.lastTime)) {
                    this.seachValue.lastTime = moment(val).add({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.lastTime' (val, oldVal) {
            if (val && this.seachValue.firstTime) {
                if (moment(val).isBefore(this.seachValue.firstTime)) {
                    this.seachValue.firstTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
                }
            }
        }
    }
}
</script>

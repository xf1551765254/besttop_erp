<!--
 * @Description: B账户 使用配置
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-07 18:26:36
 * @LastEditTime: 2019-08-20 16:43:54
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
      @onSeach="onSeach">
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onSelect"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 新增、编辑模态框 -->
    <bt-modal
      v-model="bAccountUsageAddEditModal"
      :title="bAccountUsageAddEditModalTitle"
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
                v-decorator="$check('bAccountUsageData.makeStoreCode',{initialValue:tableSingleData.makeStoreCode||`${this.$store.getters.storeInfo.code}`})"
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
                v-decorator="$check('bAccountUsageData.effectTime', {initialValue:tableSingleData.effectTime || setEndTime})"
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
        <a-button class="editable-add-btn" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <!-- 详情表格 -->
      <div class="table-nowrap">
        <a-table
          rowKey="tb_web_id"
          :columns="tableColumns"
          :dataSource="tableData"
          bordered
          :pagination="false"
          size="small"
          :scroll="{ x:1340}"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template v-for="col in ['useRate','note']" :slot="col" slot-scope="text, record, index">
            <div :key="col">
              <a-input-number
                v-if=" col === 'useRate'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="100"
                :value="text"
                :formatter="value => `${value}`"
                :parser="value =>value"
                :precision="2"
                @change="e => InputChange(e, record.tb_web_id, col)"
              />
              <a-input
                v-else-if=" col === 'note'"
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
                <a-popconfirm title="是否确认删除?" @confirm="() => deleteRow(record.id)" okText="是" cancelText="否">
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
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.createBy}-${defauilForm.createName}` }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单时间：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ defauilForm.createTime }}</a-col>
          <a-col :md="4" :lg="3" :xl="3">制单位置：</a-col>
          <a-col :md="8" :lg="5" :xl="5"> {{ `${defauilForm.makeStoreCode}-${defauilForm.makeStoreName}` }}</a-col>
        </a-row>
      </a-form>
      <!-- 生效分店 -->
      <store :visible.sync="storeQuery" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" multiple/>
      <!-- 新增 增加的  的表格 -->
      <bGoods :visible.sync="bGoodsQuery" @onSelect="onSelectAddGoods" multiple/>
    </bt-modal>
    <!-- 预览 -->
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import store from '@comp/BasicQuery/store'
import BtModal from '@comp/Modal'
import Preview from './preview/BAccountUsageSettingsPreview'
import is from 'is_js'
import map from 'lodash.map'
import bGoods from '@pages/marketing/StoreManagerCouponManagement/toop/bGoods'
export default {
    name: 'BAccountUsageSettings',
    components: {
        NewTable,
        SeachBox,
        BtModal,
        store,
        bGoods,
        Preview
    },
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
                    fliter: true
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
                    action: 'BAccountUsageSettings.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                }, {
                    name: '删除',
                    action: 'BAccountUsageSettings.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                }, {
                    name: '审核',
                    action: 'BAccountUsageSettings.verify',
                    fc: row => {
                        this.getRow(row, 'audit')
                    }
                }, { name: '预览',
                    action: 'BAccountUsageSettings.get',
                    fc: this.detailHandler
                }

            ],
            // 新增、编辑模态框
            tags: ['uncheck'], // 单据状态
            bAccountUsageAddEditModal: false,
            // 新增、编辑模态框头
            bAccountUsageAddEditModalTitle: '',
            // 多选
            tableIdsArr: [],
            tableRowsArr: [],
            // 行信息
            rowObj: {},
            // 新增表格数据
            baseInfoData: this.$form.createForm(this),
            // 生效分店数组
            makeStoreCodeDorpArr: [],
            // 生效分店模态框
            storeQuery: false,
            bGoodsQuery: false,
            // 表格单选数据
            tableSingleData: { },
            tempObjArr: [],
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
                    title: '品类编码',
                    dataIndex: 'classCode',
                    width: 180,
                    align: 'center'
                },
                {
                    title: '品类名称',
                    dataIndex: 'className',
                    width: 180,
                    align: 'center'
                },
                {
                    title: '品牌编码',
                    dataIndex: 'brandCode',
                    width: 180,
                    align: 'center'
                },
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    width: 180,
                    align: 'center'
                },
                {
                    title: '使用率(%)',
                    dataIndex: 'useRate',
                    width: 150,
                    align: 'center',
                    scopedSlots: {
                        customRender: 'useRate'
                    }
                },
                {
                    title: '备注',
                    dataIndex: 'note',
                    width: 200,
                    align: 'center',
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
            // 详情表格多选数组classCode
            selectedRowKeys: [],
            // 详情表格多选数组数据
            selectedRowRows: [],
            // 新增、编辑保存按钮
            isAdd: true,
            delId: [],
            submitAddLoading: false,
            submitEditLoading: false,
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
            this.tableCode = '658eeadf382146f8876ba908a834423d:BAccountUsageSettings'
            this.tableApiPath = 'CouponBuseQuery'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.effectiveBranch()
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
                this.addEditBAccountUsage(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length <= 0) {
                    this.$message.warning('请选择需要删除的数据！')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('CouponBuseQuery', this.seachValue)
            }
        },
        /**
         * @name: 清空搜索条件
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CouponBuseQuery'
            this.$refs.newTable.setTableData(this.tableCode, e)
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
                    path: 'CouponBuseQuery'
                }, true)
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
         * @name: 表格编辑、删除、审核操作监听
         * @msg:
         * @param {type}
         * @return:
         */
        getRow (e, mun) {
            this.rowObj = e
            if (mun === 'edit') {
                this.addEditBAccountUsage(e)
            } else if (mun === 'del') {
                this.deleteHandler(e)
            } else if (mun === 'audit') {
                this.auditHandler(e)
            }
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(this.tableSingleData)
            if (tableRow.status === 'coupon_define_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
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
         * @name: 新增/编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEditBAccountUsage (index) {
            // 加载生效分店信息
            if (index === -1) {
                this.tableData = []
                this.tempObjArr = []
                this.tableSingleData = {}
                this.isAdd = true
                this.bAccountUsageAddEditModalTitle = '新增B账户使用配置'
                this.defauilForm.makeStoreCode = `${this.$store.getters.storeInfo.code}`
                this.defauilForm.makeStoreName = `${this.$store.getters.storeInfo.name}`
                this.defauilForm.createBy = `${this.$store.getters.code}`
                this.defauilForm.createName = `${this.$store.getters.name}`
                this.defauilForm.createTime = moment().format('YYYY-MM-DD HH:mm:ss')
            } else {
                const { mul } = this.$math
                this.isAdd = false
                this.delId = []
                this.bAccountUsageAddEditModalTitle = '编辑B账户使用配置'
                const obj = { ...index }
                obj.effectTime = moment(obj.effectTime)
                this.defauilForm.makeStoreCode = obj.makeStoreCode
                this.defauilForm.makeStoreName = obj.makeStoreName
                this.defauilForm.createBy = obj.createBy
                this.defauilForm.createName = obj.createName
                this.defauilForm.createTime = moment(obj.createTime).format('YYYY-MM-DD HH:mm:ss')
                if (obj.storeCode) {
                    this.tempObjArr = obj.storeCode.split(',')
                } else {
                    this.tempObjArr = []
                }
                this.tableSingleData = obj
                axios({
                    path: 'CouponBuseQueryDetail',
                    body: {
                        couponBUseId: this.rowObj.id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.tableData = res.data.list
                        const newData = [...res.data.list]
                        newData.forEach(item => {
                            item.tb_web_id = item.id
                            item.unquId = item.classCode + item.brandCode
                            item.useRate = mul(Number(item.useRate), 100, 2)
                        })
                    }
                })
            }
            this.bAccountUsageAddEditModal = true
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
                        item.key = item.code
                    })
                    this.makeStoreCodeDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.storeQuery = true
            // 取消选择框的焦点，防止重复触发选择器
            this.$refs.storeRef.blur()
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            // const newarr = [...this.tempObjArr]
            this.tempObjArr = [...map(arr, 'code')]
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
                const has = this.tableData.filter(o => o.unquId === mun.classCode + mun.brandCode)
                if (has.length === 0) {
                    this.tableData.push({
                        tb_web_id: mun.id,
                        classCode: mun.classCode,
                        className: mun.className,
                        brandCode: mun.brandCode,
                        brandName: mun.brandName,
                        useRate: Number(0).toFixed(2),
                        unquId: mun.classCode + mun.brandCode
                    })
                } else {
                    error.push(mun.classCode)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，此类的品类${error.join(',')}-已经添加过了`
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
            // console.log(this.selectedRowKeys)
            if (index === -1) {
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
                        if (infoData[j].id === this.selectedRowKeys[i]) {
                            infoData.splice(j, 1)
                        }
                    }
                }
                this.tableData = infoData
            } else {
                const infoData = [...this.tableData]
                this.tableData = infoData.filter(item => item.id !== index)
                const target = infoData.filter(item => item.id === index)[0]
                if (target.id) {
                    // console.log()
                    this.delId.push(target.id)
                }
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
         * @name: 确认关闭弹框按钮
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.bAccountUsageAddEditModal = false
        },
        /**
         * @name: 编辑 表格 编辑时
         * @msg:
         * @param {type}classCode
         * @return:
         */
        InputChange (val, count, key) {
            // console.log(val, count, key, '监听')
            const newData = [...this.tableData]
            const target = newData.filter(item => count === item.tb_web_id)[0]
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
            // const _this = this
            // 清除默认行为
            const { div } = this.$math
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
                    formDate.makeTime = this.defauilForm.createTime
                    formDate.makeStoreCode = this.defauilForm.makeStoreCode
                    formDate.storeCode = this.tempObjArr
                    if (is.array(formDate.storeCode)) {
                        formDate.storeCode = this.tempObjArr.join(',')
                    }
                    newData.forEach(item => {
                        item.id = null
                        item.useRate = div(item.useRate, 100, 4)
                    })
                    formDate.detail = newData
                    this.submitAddLoading = true
                    axios({
                        path: 'CouponBuseAdd',
                        body: formDate
                    }).then(res => {
                        this.submitAddLoading = false
                        if (res.flag === 1) {
                            this.bAccountUsageAddEditModal = false
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
            const { div } = this.$math
            // 防止事件穿透
            e.preventDefault()
            // 引入validateFields
            const { baseInfoData: { validateFields } } = this

            const newData = [...this.tableData]
            newData.forEach(item => {
                item.useRate = div(item.useRate, 100, 4)
            })
            validateFields((err, values) => {
                if (!err) {
                    if (this.tableData.length === 0) {
                        this.$message.warning('请添加详细信息！')
                        return
                    }
                    const formDate = { ...values }
                    formDate.effectTime = moment(values.effectTime).format('YYYY-MM-DD HH:mm:ss')
                    formDate.makeTime = this.defauilForm.createTime
                    formDate.storeCode = this.tempObjArr
                    formDate.detail = newData
                    formDate.id = this.rowObj.id
                    formDate.ids = this.delId
                    formDate.makeStoreCode = this.defauilForm.makeStoreCode
                    if (is.array(formDate.storeCode)) {
                        formDate.storeCode = this.tempObjArr.join(',')
                    }
                    this.submitEditLoading = true
                    axios({
                        path: 'CouponBuseUpdate',
                        body: formDate
                    }).then(res => {
                        this.submitEditLoading = false
                        // newData = [];
                        if (res.flag === 1) {
                            this.bAccountUsageAddEditModal = false
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
                        path: 'CouponBuseDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        // console.log(res)
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
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
            // console.log(_this.$store.getters.userInfo, autiData + '测试')
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        // 接口path名，必传
                        path: 'CouponBuseAudit',
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
        },
        '$store.state.app.pageName' (to, from) {
            if (to === 'BAccountUsageSettings') {
                this.effectiveBranch()
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

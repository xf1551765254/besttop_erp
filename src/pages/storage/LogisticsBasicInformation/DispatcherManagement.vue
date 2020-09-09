<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-05-29 17:16:41
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-28 09:21:54
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="clientVisible"
      title="调度组管理"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">公司</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                v-decorator="$check('logistics_dispatching_group.upStoreCode', {initialValue:billsForm.upStoreCode})"
                :options="storeList"
                placeholder="请选择公司"
                :filterOption="filterOption"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">调度组名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入调度组名称" v-decorator="$check('logistics_dispatching_group.groupName',{initialValue:billsForm.groupName})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">派工单据来源</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请选择派工单据来源"
                v-decorator="$check('logistics_dispatching_group.sourceType', {initialValue:billsForm.sourceType})"
                :options="workOrderArr"
                :maxTagCount="1"
                mode="multiple"
                :filterOption="filterOption"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">是否送安一体</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-checkbox
                :checked="deliveInstall"
                @change="onChange"
              >是</a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">调度组描述</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请选择调度组描述" v-decorator="$check('logistics_dispatching_group.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="调度员" key="1">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">选择调度</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  style="width: 100%"
                  placeholder="请检索调度编号姓名"
                  @search="handleSearch"
                  @change="handleChange"
                  :options="dispatchList"
                  :filterOption="false"
                  allowClear
                  v-model="yardman"
                  showSearch/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">
              <a-button style="margin-top:4px" class="editable-add-btn" type="danger" @click="onDelete(-1)">删除</a-button>
            </a-col>
          </a-row>
          <!-- <a-button class="editable-add-btn" @click="addYardman(1)">添加调度员</a-button>
            <a-button class="editable-add-btn" type="danger" @click="onDelete(-1)">删除</a-button> -->
          <a-table
            rowKey="userCode"
            size="small"
            :columns="columnsYardman"
            :dataSource="billsDataYardman"
            :rowSelection="{selectedRowKeys: yardmanSelectedRowKeys, onChange: onSelectChangeYardman}"
            bordered
            :scroll="{x:1000, y: 300}">
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="司机" key="2">
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">选择司机</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  style="width: 100%"
                  placeholder="请检索司机编号姓名"
                  @search="handleSearchDriver"
                  @change="handleChangeDriver"
                  :options="DriverList"
                  :filterOption="false"
                  v-model="Driver"
                  allowClear
                  showSearch/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">
              <a-button style="margin-top:4px" class="editable-add-btn" type="danger" @click="onDelete(-2)">删除</a-button>
            </a-col>
          </a-row>
          <!-- <a-button class="editable-add-btn" @click="addDriver">添加司机</a-button>
            <a-button class="editable-add-btn" type="danger" @click="onDelete(-2)">删除</a-button> -->
          <a-table
            rowKey="userCode"
            size="small"
            :columns="columnsDriver"
            :dataSource="billsDataDriver"
            :rowSelection="{selectedRowKeys: driverSelectedRowKeys, onChange: onSelectChangeDriver}"
            bordered
            :scroll="{x:800, y: 300}">
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="品牌品类" key="3">
          <a-col :sm="8" :md="4" :xl="3">选择品类</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索品类"
                @search="classSearch"
                @change="classChange"
                :options="classList"
                :filterOption="false"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <div class="classTag">
            <a-tag v-for="(item,index) in classTagList" :key="index" closable @close="classTagClone(item.code)">{{ item.code }}-{{ item.name }}</a-tag>
          </div>
          <a-col style="margin-top:20px" :sm="8" :md="4" :xl="3">选择品牌</a-col>
          <a-col style="margin-top:20px" :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                placeholder="请检索品牌"
                @search="brandSearch"
                @change="brandChange"
                :options="brandList"
                :filterOption="false"
                allowClear
                showSearch/>
            </a-form-item>
          </a-col>
          <div class="classTag">
            <a-tag v-for="(item,index) in brandTagList" :key="index" closable @close="brandTagClone(item.code)">{{ item.code }}-{{ item.name }}</a-tag>
          </div>
          <a-row>
            <a-col style="margin-top:20px" :sm="8" :md="4" :xl="3">选择商品</a-col>
            <a-col style="margin-top:20px" :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-select
                  style="width: 100%"
                  placeholder="请检索商品"
                  @search="handleSearchGoods"
                  @change="handleChangeGoods"
                  :options="goodsList"
                  :filterOption="false"
                  v-model="goods"
                  allowClear
                  showSearch/>
              </a-form-item>
            </a-col>
            <a-col :sm="8" :md="4" :xl="3">
              <a-button style="margin-top:24px" class="editable-add-btn" type="danger" @click="onDelete(-3)">删除</a-button>
            </a-col>
          </a-row>
          <a-table
            rowKey="goodsCode"
            size="small"
            :columns="columnsGoods"
            :dataSource="billsDataGoods"
            :rowSelection="{selectedRowKeys: goodsSelectedRowKeys, onChange: onSelectChangegoods}"
            bordered
            :scroll="{x:800, y: 300}">
          </a-table>
        </a-tab-pane>
      </a-tabs>
      <!-- <users :visible.sync="usersVisible" @onSelect="onUsersSelect" :pams="userPams" :title="title" multiple/> -->
    </bt-modal>
    <a-modal
      title="调度组成员"
      v-model="dispatchVisible"
      :mask="false"
      width="800"
      centered
      :bodyStyle="{height:'600px',width:'800px'}"
      style="margin-left: 50px">
      <h5>调度员</h5>
      <div class="driver">
        <a-table
          :scroll="{ y: 220 }"
          :pagination="false"
          rowKey="userCode"
          size="small"
          bordered
          :columns="yardmanColumns"
          :dataSource="yardmanData"></a-table>
      </div>
      <h5>司机</h5>
      <div class="driver">
        <a-table
          :scroll="{ y: 220 }"
          :pagination="false"
          rowKey="userCode"
          size="small"
          bordered
          :columns="driverColumns"
          :dataSource="driverData"></a-table>
      </div>
      <div slot="footer">
        <a-button @click="() => {dispatchVisible = false}" size="small">关闭</a-button>
      </div>
    </a-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
// import users from '@comp/BasicQuery/users'
import BtModal from '@comp/Modal'
import Preview from './preview/DispatcherManagementPreview'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'

const columnsYardman = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '调度员编码', dataIndex: 'userCode', width: 90, align: 'center' },
    { title: '调度员名称', dataIndex: 'userName', width: 200, align: 'center' },
    { title: '手机号', dataIndex: 'phone', width: 150, align: 'center' },
    { title: '备注', dataIndex: 'note', align: 'center' }
]
const columnsDriver = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '司机编码', dataIndex: 'userCode', width: 90, align: 'center' },
    { title: '司机名称', dataIndex: 'userName', width: 200, align: 'center' },
    { title: '手机号', dataIndex: 'phone', width: 150, align: 'center' },
    { title: '备注', dataIndex: 'note', align: 'center' }
]
export default {
    name: 'DispatcherManagement',
    components: { seachBox, NewTable, Preview, BtModal },
    data () {
        return {
            goods: null,
            Driver: null,
            yardman: null,
            bt_Save: false,
            // title: '',
            // userPams: {},
            // usersVisible: false, // 选择用户
            driverSelectedRowKeys: [], // 司机多选
            billsDataDriver: [], // 司机明细数据
            columnsDriver, // 司机明细表头
            billsDataYardman: [], // 调度明细数据
            columnsYardman, // 调度明细表头
            yardmanSelectedRowKeys: [], // 调度多选
            billsForm: {},
            storeList: [],
            loading: false,
            clientVisible: false,
            previewVisbel: false,
            detailsColumns: [

            ],
            billsData: [],
            driverColumns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '司机编码', dataIndex: 'userCode', width: 80, align: 'center' },
                { title: '司机名称', dataIndex: 'userName', width: 100, align: 'center' },
                { title: '手机号', dataIndex: 'phone', width: 80, align: 'center' },
                { title: '新增人', dataIndex: 'createByName', width: 100, align: 'center' },
                { title: '新增时间', dataIndex: 'createTime', width: 150, align: 'center' }
            ],
            driverData: [],
            yardmanColumns: [ // 调度员表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '调度员编码', dataIndex: 'userCode', width: 100, align: 'center' },
                { title: '调度员名称', dataIndex: 'userName', width: 100, align: 'center' },
                { title: '手机号', dataIndex: 'phone', width: 100, align: 'center' },
                { title: '新增人', dataIndex: 'createByName', width: 100, align: 'center' },
                { title: '新增时间', dataIndex: 'createTime', width: 150, align: 'center' }
            ],
            yardmanData: [], // 调度员数据
            dispatchVisible: false, // 组员明细
            tags: [],
            orderId: '',
            editVisible: false, // 单据控制
            // 多选选中
            deleteAll: [],
            // 控制右键菜单
            disContextMenu: [],
            // 接口
            tableApiPath: '',
            // 表头id
            tableCode: '',
            // 搜索框默认值
            seachValue: {},
            form: this.$form.createForm(this), // 表单
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '调度组',
                    key: 'code',
                    type: 'select',
                    label: ['code', 'groupName'],
                    value: 'code',
                    path: 'DistributionDispatchingGroupFind'
                },
                {
                    title: '公司',
                    key: 'upStoreCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'OrganizationStoreFindSubStores'
                },
                {
                    title: '调度人',
                    key: 'userCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption',
                    body: {
                        type: 'sys_user_type:5'
                    }
                },
                {
                    title: '调度司机',
                    key: 'driverCode',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption',
                    body: {
                        type: 'sys_user_type:2'
                    }
                }
            ],
            MenuOperations: [
                {
                    name: '编辑',
                    action: 'ReturnManagement.edit',
                    fc: row => {
                        this.getRow(row, 'edit')
                    }
                },
                {
                    name: '删除',
                    action: 'ReturnManagement.delete',
                    fc: row => {
                        this.getRow(row, 'del')
                    }
                },
                {
                    name: '预览',
                    action: 'ReturnManagement.get',
                    fc: row => {
                        this.getRow(row, 'details')
                    }
                }
            ],
            editId: '',
            workOrderArr: [], // 派工单来源
            dispatchList: [], // 调度员
            serialNumber: 1, // 序号
            DriverList: [], // 司机
            classList: [], // 品类数据
            classTagList: [], // 品类已添加
            brandList: [], // 品牌数据
            brandTagList: [], // 品牌数据
            goodsSelectedRowKeys: [], // 商品选中
            columnsGoods: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '商品编码', dataIndex: 'goodsCode', width: 150, align: 'center' },
                { title: '商品名称', dataIndex: 'goodsName', align: 'center' }
            ], // 商品表头
            billsDataGoods: [], // 商品表体
            goodsList: [], // 搜索下拉
            deliveInstall: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '872ca2e3fc154e8db6f5b8bba7121526:DispatcherManagement'
            this.tableApiPath = 'DistributionDispatchingGroupFind'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.workOrderFun()
        this.getDate()
        this.getAll()
    },
    methods: {
        onChange (e) {
            console.log(e)
            this.deliveInstall = e.target.checked
        },
        /**
         * @name: 商品搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchGoods (value) {
            console.log(value.length)
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.goodsGetData({
                    condition: value
                })
            }, 300)
        },
        /**
         * @name: 商品数据
         * @msg:
         * @param {type}
         * @return:
         */
        goodsGetData (pams = {}) {
            this.goodsList.length = 0
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: 'GoodsInformationSearch',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.goodsList = data
                }
            })
        },
        /**
         * @name: 商品选中
         * @msg:
         * @param {type}
         * @return:
         */
        handleChangeGoods (value) {
            console.log(value)
            if (!value) {
                return
            }
            const arr = this.goodsList.filter(o => o.code === value)
            console.log(arr)
            const error = []
            arr.forEach(i => {
                const has = this.billsDataGoods.filter(o => o.goodsCode === i.code)
                if (has.length === 0) {
                    this.billsDataGoods.push({
                        index: this.billsDataGoods.length + 1,
                        goodsCode: i.code,
                        goodsName: i.name
                    })
                } else {
                    error.push(i.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.goods = ''
        },
        /**
         * @name: 品牌标签
         * @msg:
         * @param {type}
         * @return:
         */
        brandTagClone (e) {
            console.log(e)
            console.log(this.brandTagList)
            for (const i of this.brandTagList) {
                if (i.code === e) {
                    i.code = ''
                    i.name = ''
                }
            }
            console.log(this.brandTagList)
        },
        /**
         * @name: 品牌搜索
         * @msg:
         * @param {type}
         * @return:
         */
        brandSearch (value) {
            console.log(value)
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.brandGetData({
                    condition: value,
                    orderbyField: 'code asc'
                })
            }, 300)
        },
        /**
         * @name: 品牌获取
         * @msg:
         * @param {type}
         * @return:
         */
        brandGetData (pams = {}) {
            this.brandList.length = 0
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: 'GoodsBrandFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.brandList = data
                }
            })
        },
        /**
         * @name: 品牌选中
         * @msg:
         * @param {type}
         * @return:
         */
        brandChange (value) {
            console.log(value)
            if (!value) {
                return
            }
            const arr = this.brandList.filter(o => o.code === value)
            const error = []
            const has = this.brandTagList.filter(o => o.code === arr[0].code)
            if (has.length === 0) {
                this.brandTagList.push({
                    code: arr[0].code,
                    name: arr[0].name
                })
            } else {
                error.push(arr[0].name)
            }
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 品类标签
         * @msg:
         * @param {type}
         * @return:
         */
        classTagClone (e) {
            console.log(e)
            console.log(this.classTagList)
            for (const i of this.classTagList) {
                if (i.code === e) {
                    i.code = ''
                    i.name = ''
                }
            }
            console.log(this.classTagList)
        },
        /**
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        classSearch (value) {
            console.log(value)
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.classGetData({
                    condition: value,
                    orderbyField: 'code asc'
                })
            }, 300)
        },
        /**
         * @name: 品类获取
         * @msg:
         * @param {type}
         * @return:
         */
        classGetData (pams = {}) {
            this.classList.length = 0
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: 'GoodsCategoryFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    this.classList = data
                }
            })
        },
        /**
         * @name: 品类选中
         * @msg:
         * @param {type}
         * @return:
         */
        classChange (value) {
            console.log(value)
            if (!value) {
                return
            }
            const arr = this.classList.filter(o => o.code === value)
            const error = []
            const has = this.classTagList.filter(o => o.code === arr[0].code)
            if (has.length === 0) {
                this.classTagList.push({
                    code: arr[0].code,
                    name: arr[0].name
                })
            } else {
                error.push(arr[0].name)
            }
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 司机搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchDriver (value) {
            console.log(value)
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    condition: value,
                    type: 'sys_user_type:2'
                }, 'driver')
            }, 300)
        },
        /**
         * @name: 司机选中
         * @msg:
         * @param {type}
         * @return:
         */
        handleChangeDriver (value) {
            console.log(value)
            if (!value) {
                return
            }
            const arr = this.DriverList.filter(o => o.code === value)
            console.log(arr)
            const error = []
            arr.forEach(i => {
                const has = this.billsDataDriver.filter(o => o.userCode === i.code)
                if (has.length === 0) {
                    this.billsDataDriver.push({
                        index: this.billsDataDriver.length + 1,
                        userCode: i.code,
                        userName: i.name,
                        phone: i.phone,
                        note: i.note,
                        userType: 2
                    })
                } else {
                    error.push(i.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.Driver = ''
        },
        /**
         * @name: 调度员搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearch (value) {
            console.log(value)
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    condition: value,
                    type: 'sys_user_type:5'
                }, 'dispatch')
            }, 300)
        },
        /**
         * @name: 调度选中
         * @msg:
         * @param {type}
         * @return:
         */
        handleChange (value) {
            console.log(this.yardman)
            if (!value) {
                return
            }
            const arr = this.dispatchList.filter(o => o.code === value)
            console.log(arr)
            const error = []
            arr.forEach(i => {
                const has = this.billsDataYardman.filter(o => o.userCode === i.code)
                if (has.length === 0) {
                    this.billsDataYardman.push({
                        index: this.billsDataYardman.length + 1,
                        userCode: i.code,
                        userName: i.name,
                        phone: i.phone,
                        note: i.note,
                        userType: 1
                    })
                } else {
                    error.push(i.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
            this.yardman = null
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}, val) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: 'PermissionsUserFindOption',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}:${i.name}`
                        i.value = i.code
                    })
                    if (val === 'dispatch') {
                        this.dispatchList = data
                    } else {
                        this.DriverList = data
                    }
                }
            })
        },
        workOrderFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_deliver_sale_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    console.log(data, '派工单')
                    this.workOrderArr = [...data]
                }
            })
        },
        detailsSumbit (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        /**
         * @name: 返回用户数据
         */
        // onUsersSelect (e) {
        //     console.log(e, 'rrrrrrrrrrrrrrrrr')
        //     const error = []
        //     for (const i of e) {
        //         if (this.userPams.type === 'sys_user_type:2' && i.type.split(',').includes('sys_user_type:2')) {
        //             console.log('司机', i)
        //             const err = this.billsDataDriver.filter(o => o.userCode === i.code)
        //             if (err.length === 0) {
        //                 this.billsDataDriver.unshift({
        //                     index: e.indexOf(i) + 1,
        //                     userCode: i.code,
        //                     userName: i.name,
        //                     phone: i.phone,
        //                     note: i.note,
        //                     userType: 2
        //                 })
        //             } else {
        //                 error.push(i.name)
        //             }
        //         } else if (this.userPams.type === 'sys_user_type:5' && i.type.split(',').includes('sys_user_type:5')) {
        //             console.log('调度', i)
        //             const err = this.billsDataYardman.filter(o => o.userCode === i.code)
        //             if (err.length === 0) {
        //                 this.billsDataYardman.unshift({
        //                     index: e.indexOf(i) + 1,
        //                     userCode: i.code,
        //                     userName: i.name,
        //                     phone: i.phone,
        //                     note: i.note,
        //                     userType: 1
        //                 })
        //             } else {
        //                 error.push(i.name)
        //             }
        //         }
        //     }
        //     if (error.length > 0) {
        //         this.$notification.error({
        //             message: '提示',
        //             description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
        //         })
        //     }
        // },
        /**
         * @name:右键编辑按钮
         */
        editRow (e) {
            console.log(e)
            const item = { ...e }
            this.editId = item.id
            this.orderId = item.code
            if (item.deliveInstall === '是') {
                this.deliveInstall = true
            } else {
                this.deliveInstall = false
            }
            item.sourceType = item.sourceType.split(',')
            this.billsForm = { ...item }
            axios({
                path: 'DistributionDispatchingGroupFindDetail',
                method: 'post',
                body: {
                    code: item.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '明细')
                    for (const i of res.data.dispatchingUsers) {
                        i.index = res.data.dispatchingUsers.indexOf(i) + 1
                    }
                    for (const i of res.data.driverUsers) {
                        i.index = res.data.driverUsers.indexOf(i) + 1
                    }
                    this.classTagList = []
                    this.brandTagList = []
                    this.billsDataGoods = []
                    for (const i of res.data.logisticsDispatchingPowers) {
                        if (i.classCode) {
                            this.classTagList.push({
                                code: i.classCode,
                                name: i.className
                            })
                        }
                        if (i.brandCode) {
                            this.brandTagList.push({
                                code: i.brandCode,
                                name: i.brandName
                            })
                        }
                        if (i.goodsCode) {
                            this.billsDataGoods.push({
                                goodsCode: i.goodsCode,
                                goodsName: i.goodsName,
                                index: this.billsDataDriver.length + 1
                            })
                        }
                    }
                    this.billsDataYardman = res.data.dispatchingUsers
                    this.billsDataDriver = res.data.driverUsers
                }
            })
        },
        /**
        * @name:保存单据
        */
        submitData (e) {
            // this.loading = true
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const formDate = { ...values }
                    formDate.deliveInstall = this.deliveInstall ? '是' : '否'
                    formDate.sourceType = formDate.sourceType.join(',')
                    const logisticsDispatchingPowers = []
                    formDate.logisticsDispatchingUsers = [...this.billsDataDriver, ...this.billsDataYardman]
                    console.log(this.classTagList, this.brandTagList, this.billsDataGoods, '提交数组')
                    const max = Math.max(this.classTagList.length, this.brandTagList.length, this.billsDataGoods.length)
                    const classTagList = [...this.classTagList]
                    for (let item = this.classTagList.length; item < max; item++) {
                        classTagList.push({
                            code: '',
                            name: ''
                        })
                    }
                    const brandTagList = [...this.brandTagList]
                    for (let item = this.brandTagList.length; item < max; item++) {
                        brandTagList.push({
                            code: '',
                            name: ''
                        })
                    }
                    const billsDataGoods = [...this.billsDataGoods]
                    for (let item = this.billsDataGoods.length; item < max; item++) {
                        billsDataGoods.push({
                            goodsCode: '',
                            goodsName: ''
                        })
                    }
                    console.log(classTagList, brandTagList, billsDataGoods, '处理数组')
                    for (let item = 0; item < max; item++) {
                        logisticsDispatchingPowers.push({
                            classCode: classTagList[item].code,
                            brandCode: brandTagList[item].code,
                            goodsCode: billsDataGoods[item].goodsCode
                        })
                    }
                    formDate.logisticsDispatchingPowers = logisticsDispatchingPowers
                    if (this.bt_Save) {
                        formDate.id = this.editId
                    } else {
                        formDate.makeStoreCode = this.$store.getters.storeInfo.code
                    }
                    console.log(333333333333, formDate)
                    axios({
                        path: this.bt_Save ? 'DistributionDispatchingGroupUpdate' : 'DistributionDispatchingGroupAdd',
                        method: 'post',
                        body: formDate
                    }).then(res => {
                        this.loading = false
                        if (res.flag === 1) {
                            console.log(res)
                            this.clientVisible = false
                            this.getDate()
                        }
                    })
                } else {
                    this.loading = false
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 添加调度员
         */
        // addYardman () {
        //     this.userPams = {
        //         type: 'sys_user_type:5'
        //     }
        //     this.usersVisible = true
        //     this.title = '添加调度员'
        // },
        /**
         * @name: 添加司机
         */
        // addDriver () {
        //     this.userPams = {
        //         type: 'sys_user_type:2'
        //     }
        //     this.title = '添加司机'
        //     this.usersVisible = true
        // },
        /**
         * @name:鼠标左键单击
         */
        onClickChange (data) {
            // @onClickChange="onClickChange"
            console.log(data)
            axios({
                path: 'DistributionDispatchingGroupFindDetail',
                method: 'post',
                body: {
                    code: data.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res, '明细')
                    for (const i of res.data.dispatchingUsers) {
                        i.index = res.data.dispatchingUsers.indexOf(i) + 1
                    }
                    for (const i of res.data.driverUsers) {
                        i.index = res.data.driverUsers.indexOf(i) + 1
                    }
                    this.yardmanData = res.data.dispatchingUsers
                    this.driverData = res.data.driverUsers
                    this.dispatchVisible = true
                }
            })
        },
        /**
            * @name:监听工具栏按钮
            */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
                this.orderId = ''
                this.editId = ''
                this.deliveInstall = false
                this.billsDataYardman = []
                this.billsDataDriver = []
                this.classTagList = []
                this.brandTagList = []
                this.billsDataGoods = []
                this.bt_Save = false
                this.billsForm = {}
                this.clientVisible = true
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionDispatchingGroupFind', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
            * @name:表格编辑/删除/审核操作监听
            */
        getRow (e, mun) {
            if (mun === 'edit') {
                this.editRow(e)
                this.billsDataYardman = []
                this.billsDataDriver = []
                this.bt_Save = true
                this.clientVisible = true
            } else if (mun === 'del') {
                console.log('删除')
                this.onDel(e)
            } else if (mun === 'audit') {
                console.log('审核')
                this.auditSumbit(e)
            } else if (mun === 'cancelAffirm') {
                console.log('取消确认')
                this.cancelAffirm(e)
            } else if (mun === 'details') {
                console.log('详情')
                this.detailsSumbit(e)
            }
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            e.path = 'DistributionDispatchingGroupFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {

        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 下拉框
         */
        getAll () {
            axios({
                path: 'OrganizationStoreFindSubStores',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.storeList = [...data]
                }
            })
        },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            if (e === 1) {
                arr = [...this.deleteAll]
            } else {
                arr.push(e.id)
            }
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据')
                return
            }
            const that = this
            this.$confirm({
                title: '删除确认',
                content: '删除后不可恢复，确定继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistributionDispatchingGroupDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll = []
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {

                }
            })
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('0bb4f2904e8646f294fd2e34e9cd3a31:DispatcherManagement', { path: 'DistributionDispatchingGroupFind' })
        },
        /**
         * @name: 删除
         */
        onDelete (del) {
            if (del === -1 && this.yardmanSelectedRowKeys.length === 0) {
                return this.$message.warning('当前暂未选中数据！')
            }
            if (del === -2 && this.driverSelectedRowKeys.length === 0) {
                return this.$message.warning('当前暂未选中数据！')
            }
            if (del === -3 && this.goodsSelectedRowKeys.length === 0) {
                return this.$message.warning('当前暂未选中数据！')
            }
            const that = this
            this.$confirm({
                title: '删除',
                content: '是否确认删除当前选中信息?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    that.categoryinfoDelete(del)
                },
                onCancel () {

                }
            })
        },
        /**
        * @name:单据表格删除
        */
        categoryinfoDelete (del) {
            console.log(del, '单据删除')
            this.serialNumber = 1
            if (del === -1) {
                const categoryinfoData = [...this.billsDataYardman]
                for (const i in this.yardmanSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].userCode === this.yardmanSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                for (const i of categoryinfoData) {
                    i.index = this.serialNumber++
                }
                this.billsDataYardman = categoryinfoData
                this.yardmanSelectedRowKeys = []
            } else if (del === -2) {
                const categoryinfoData = [...this.billsDataDriver]
                for (const i in this.driverSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].userCode === this.driverSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                for (const i of categoryinfoData) {
                    i.index = this.serialNumber++
                }
                this.billsDataDriver = categoryinfoData
                this.driverSelectedRowKeys = []
            } else if (del === -3) {
                const categoryinfoData = [...this.billsDataGoods]
                console.log(categoryinfoData)
                for (const i in this.goodsSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].goodsCode === this.goodsSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                for (const i of categoryinfoData) {
                    i.index = this.serialNumber++
                }
                this.billsDataGoods = categoryinfoData
                this.goodsSelectedRowKeys = []
            }
        },
        infoDelete (del) {
            console.log(del, '单据删除')
            const categoryinfoData = [...this.billsDataDriver]
            this.billsDataDriver = categoryinfoData.filter(item => item.userCode !== del)
            this.driverSelectedRowKeys = []
        },
        /**
         * @name: 调度选中
         */
        onSelectChangeYardman (e) {
            this.yardmanSelectedRowKeys = e
        },
        /**
         * @name:司机多选
         */
        onSelectChangeDriver (e) {
            this.driverSelectedRowKeys = e
            console.log(this.driverSelectedRowKeys)
        },
        /**
         * @name:商品多选
         */
        onSelectChangegoods (e) {
            console.log(e)
            this.goodsSelectedRowKeys = e
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'DispatcherManagement') {
                this.workOrderFun()
            }
        }
    }
}
</script>
<style scoped>
    .driver {
        height: 260px;
        overflow-y: auto;
    }
    .driver::-webkit-scrollbar {
        display: none;
    }
    .classTag {
        width: 100%;
        height: 60px;
        border: 2px solid #eeeeee;
        border-radius: 5px;
        margin-top:50px;
        overflow-y: scroll;
        padding: 10px;
    }
    .ant-tag{
        margin: 5px;
    }
</style>

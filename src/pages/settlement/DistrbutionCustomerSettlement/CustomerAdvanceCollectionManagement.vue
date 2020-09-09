<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-27 17:51:34
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
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :options="customerList"
                @search="handleSearchBuyBy"
                placeholder="请检索负责人"
                :filterOption="false"
                showSearch
                v-decorator="$check('billPreReceive.chargeUserCode',{initialValue:BaseMessageObj.chargeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">申请人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                :filterOption="false"
                placeholder="请检索申请人"
                @search="handleSearchBuyBy"
                :options="customerList"
                v-decorator="$check('billPreReceive.applyUserCode',{initialValue:BaseMessageObj.applyUserCode})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">销售店</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                style="width: 100%"
                v-decorator="$check('billPreReceive.storeCode',{initialValue:BaseMessageObj.storeCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                v-decorator="$check('billPreReceive.makeStoreCode',{initialValue:BaseMessageObj.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('billPreReceive.note',{initialValue:this.BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">预收详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">新增渠道客户</a-button>
          <a-popconfirm title="请选择要删除的客户信息?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" size="small">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="custNo"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          bordered
          :pagination="false"
          :scroll="{x:550,y:350}"
        >
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:30px">应收费用：</span>
            <span>{{ sumChangeM(receiveFee) }}</span>
          </template>
          <template v-for="col in ['receive','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'receive'"
                style="width:100%;"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                :value="text"
                @change="e => InputChange(e, record.custNo, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.custNo, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.custNo)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('billPreReceive.makeUserCode', {initialValue:BaseMessageObj.makeUserCode || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billPreReceive.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <clientLimit :visible.sync="storeQuery" :pams="pams" @onSelect="onProviderSelect" multiple/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
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
import clientLimit from '@pages/settlement/DistrbutionCustomerSettlement/clientLimit/clientLimit'
import map from 'lodash.map'
import moment from 'moment'
import BtModal from '@comp/Modal'
import getStatus from '@comp/statusAll/getStatus'
import Preview from './preview/CustomerAdvanceCollectionManagementPreview'
export default {
    name: 'SupplierExpenseItem',
    components: {
        NewTable,
        SeachBox,
        clientLimit,
        BtModal,
        Preview
    },
    data () {
        return {
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
                    title: '单据状态',
                    type: 'select',
                    key: 'status',
                    label: 'title',
                    value: ['type', 'configKey'],
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '制单时间开始范围',
                    type: 'date',
                    key: 'timeA'
                },
                {
                    title: '制单时间结束范围',
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
                    action: 'CustomerAdvanceCollectionManagement.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'CustomerAdvanceCollectionManagement.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '审核',
                    action: 'CustomerAdvanceCollectionManagement.verify',
                    fc: this.auditHandler
                },
                {
                    name: '预览',
                    action: 'CustomerAdvanceCollectionManagement.get',
                    fc: this.previewFun
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false, // 新增模态框显示隐藏
            submitLoading: false, // 按钮loading状态
            form: this.$form.createForm(this),
            BaseMessageObj: {},
            categoryinfoSelectedRowKeys: [], // 详情选中项
            categoryinfoColumns: [ // 采购订单详情表头
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '客户编码', dataIndex: 'custNo', width: 100 },
                { title: '客户名称', dataIndex: 'custName', width: 100 },
                { title: '预收款', dataIndex: 'receive', width: 100, scopedSlots: { customRender: 'receive' } },
                { title: '备注', dataIndex: 'note', width: 200, scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData: [], // 表体
            storeQuery: false, // 组件弹框
            multiple: true, // 是否多选模式，可选，默认单选。
            pams: {},
            // 负责人
            customerList: [],
            title: '',
            rowId: '', // 编辑时行id
            receiveFee: '0.00',
            orderId: '',
            tags: [],
            // 预览
            previewVisbel: false,
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '0b7657069ff9426e87856b0af7b8c8bf:CustomerAdvanceCollectionManagement'
            this.tableApiPath = 'BillReceiveFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        // this.getData()
        getStatus('bill_pre_receive_status', this.conditions[1])
        this.seachValue = {
            status: 'bill_pre_receive_status:1',
            timeA: moment().subtract(7, 'days'),
            timeB: moment()
        }
    },
    computed: {

    },
    methods: {
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.customerList.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
        getData (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.customerList = data
                }
            })
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        previewFun (e) {
            this.orderId = e.code
            this.previewVisbel = true
        },
        total () {
            const { add } = this.$math
            const arr = [...this.categoryinfoData]
            const receiveArr = []
            for (const item of arr) {
                receiveArr.push(item.receive)
            }
            console.log(receiveArr, '-----------------')
            this.receiveFee = receiveArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.custNo)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
            this.total()
        },
        onProviderSelect (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.custNo === i.code)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        custNo: i.code,
                        custName: i.name,
                        receive: 0
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
            console.log('获取表格中的数据', this.categoryinfoData)
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (code) {
            if (code === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].custNo === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.custNo !== code)
            }
            this.total()
        },
        /**
         * @name: 新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            console.log('弹框新增')
            this.storeQuery = true
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            const newData = [...this.categoryinfoData]
            validateFields((err, values) => {
                values.makeStoreCode = values.makeStoreCode ? values.makeStoreCode.split('-')[0] : ''
                values.storeCode = values.storeCode ? values.storeCode.split('-')[0] : ''
                values.makeUserCode = values.makeUserCode ? values.makeUserCode.split('-')[0] : ''
                values.chargeUserCode = values.chargeUserCode ? values.chargeUserCode.split('-')[0] : ''
                values.applyUserCode = values.applyUserCode ? values.applyUserCode.split('-')[0] : ''
                if (!err) {
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        if (newData.length === 0) {
                            this.$message.warning('您尚未添加预收款详情！')
                            return
                        }
                        for (const i of newData) {
                            if (i.receive === 0) {
                                this.$message.warning(`客户编码为${i.custNo}的预收款为0，请输入预收款!`)
                                return
                            }
                        }
                        const addArr = Object.assign(values, { billPreReceiveDetails: newData })
                        axios({
                            path: 'BillReceiveAdd',
                            method: 'post',
                            body: addArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        const editArr = Object.assign(values, { billPreReceiveDetails: newData }, { id: this.rowId })
                        axios({
                            path: 'BillReceiveUpdate',
                            method: 'post',
                            body: editArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                console.log(res)
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    }
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (e) {
            if (e.id === undefined || e.id === '') {
                this.$message.warning('您尚未选中任何数据！')
            }
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否审核当前信息?',
                onOk () {
                    axios({
                        path: 'BillReceiveAudit',
                        method: 'post',
                        body: {
                            id: e.id
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
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'bill_pre_receive_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '删除', '审核']
            }
        },
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
                this.$refs.newTable.exportFile('BillReceiveFind', this.seachValue)
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
            e.path = 'BillReceiveFind'
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
                const statusArr = map(this.selectArr, 'status')
                for (const item in statusArr) {
                    console.log(statusArr[item])
                    if (statusArr[item] === 'bill_pre_receive_status:2') {
                        this.$message.error('选中数据存在已审核数据，不可删除')
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
                        path: 'BillReceiveDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
                        } else if (res.flag === 6) {
                            that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
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
                console.log('新增')
                this.addEdit = 'add'
                this.title = '新增预收款单'
                this.BaseMessageObj = {
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                this.receiveFee = '0.00'
                this.categoryinfoData = []
                this.orderId = ''
                this.tags = []
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑', index)
                this.rowId = index.id
                this.addEdit = 'edit'
                this.title = '编辑预收款单'
                this.editAssign(index)
            }
            // 打开modal
            this.addEditModel = true
        },
        editAssign (e) {
            axios({
                path: 'BillReceiveFindDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    this.orderId = e.code
                    this.tags = ['uncheck']
                    this.BaseMessageObj = {
                        makeUserCode: e.makeUserCode ? `${e.makeUserCode}-${e.makeUserName}` : '',
                        makeStoreCode: e.makeStoreCode ? `${e.makeStoreCode}-${e.makeStoreName}` : '',
                        storeCode: e.storeCode ? `${e.storeCode}-${e.storeName}` : '',
                        code: e.code,
                        chargeUserCode: e.chargeUserCode ? `${e.chargeUserCode}-${e.chargeUserName}` : '',
                        applyUserCode: e.applyUserCode ? `${e.applyUserCode}-${e.applyUserName}` : '',
                        makeTime: e.makeTime
                    }
                    const data = res.data
                    data.forEach(i => {
                        i.index = this.indexNumber++
                    })
                    this.categoryinfoData = data
                    this.total()
                }
            })
        },
        /**
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
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
         * @name:负责人
         */
        // getData () {
        //     // 获取用户信息
        //     axios({
        //         path: 'PermissionsUserFindOption',
        //         method: 'post'
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             console.log(data)
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.customerList = [...data]
        //         }
        //     })
        // },
        sumChangeM (a) {
            return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CustomerAdvanceCollectionManagement') {
                // this.getData()
            }
        },
        addEditModel (val) {
            if (!val) {
                this.categoryinfoData = []
                this.indexNumber = 1
                this.BaseMessageObj = {}
            }
        }

    }
}
</script>

<!--
 * @Description: 预约确认
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: Oak
 * @Date: 2019-03-13 08:57:12
 * @LastEditTime: 2019-04-18 19:59:59
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
      <a-button size="small" type="primary" v-action:edit @click="onConfirmClick">批量确认</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onSelect"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 新增 -->
    <a-modal
      :title="addModalTitle"
      v-model="addModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">盘点分店</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                optionFilterProp="children"
                :filterOption="filterOption"
                v-decorator="$check('store.storeCode')"
                :options="storeArr"
                allowClear
                @change="handleStoreChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">盘点编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                style="width: 100%"
                showSearch
                optionFilterProp="children"
                :filterOption="filterOption"
                v-decorator="$check('confirm.defineCode')"
                :options="defineCodeArr"
                allowClear
                :disabled="codeDisable"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">添加内部员工</a-col>
          <a-col :span="20">
            <a-select
              mode="multiple"
              style="width:90%"
              placeholder="请选择员工"
              :options="usersArr"
              :maxTagCount="3"
              :open="false"
              v-model="tempObjArr"
              allowClear
              ref="userRef"/>
            <a href="javascript:;" @click="selectFocusEffect">
              <a-icon style="width:10%;line-height:36px;" type="edit" />
            </a>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入描述" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('confirm.bookingDescription', {initialValue:selectedSingleRow.bookingDescription || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('confirm.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <usersByStore :visible.sync="userModal" @onSelect="onStoreSelect" :defaultSelect="tempObjArr" multiple/>
    </a-modal>
    <!-- 明细 -->
    <a-modal
      title="预约确认"
      v-model="detailModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="detailSubmit">确定</a-button>
      </template>
      <a-form :form="detailForm">
        <a-row class="doc detail">
          <a-col :span="4">申请人姓名</a-col>
          <a-col :span="8">{{ detailInfo.name }}</a-col>
          <a-col :span="4">工号</a-col>
          <a-col :span="8">{{ detailInfo.code }}</a-col>
          <a-col :span="4">类型</a-col>
          <a-col :span="8">{{ detailInfo.userType }}</a-col>
          <a-col :span="4">身份证号码</a-col>
          <a-col :span="8">{{ detailInfo.cardNo }}</a-col>
          <a-col :span="4">手机号</a-col>
          <a-col :span="8">{{ detailInfo.phone }}</a-col>
          <a-col :span="4">性别</a-col>
          <a-col :span="8">{{ detailInfo.sex }}</a-col>
          <a-col :span="4">申请时间</a-col>
          <a-col :span="8">{{ detailInfo.applyTime }}</a-col>
          <a-col :span="4">申请人数</a-col>
          <a-col :span="8">{{ detailInfo.applyPersonCount }}</a-col>
          <a-col :span="4">确认人数</a-col>
          <a-col :span="8">{{ detailInfo.confirmPersonCount }}</a-col>
          <a-col :span="4"></a-col>
          <a-col :span="8"></a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('detailInfo.note')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import usersByStore from './tools/usersByStore'
export default {
    name: 'Reservation',
    components: {
        NewTable,
        SeachBox,
        usersByStore
    },
    data () {
        return {
            // 表单
            form: this.$form.createForm(this),
            detailForm: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['add', 'del'],
            // 工具栏表单组
            conditions: [
                {
                    key: 'userCode',
                    type: 'select',
                    title: '分店名称',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'defineCode',
                    type: 'select',
                    title: '盘点编码',
                    label: ['code', 'stocktakingDate'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    key: 'confirmStatus',
                    type: 'select',
                    title: '状态',
                    label: 'name',
                    value: 'code',
                    selectDataArr: [{ name: '未确认', code: 0 }, { name: '已确认', code: 1 }]
                }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 表格右键菜单
            menuOpt: [
                { name: '预约确认', action: 'reservation.edit', fc: this.detailHandler },
                { name: '删除', action: 'reservation.delete', fc: ({ id }) => { this.onDel(id) } }
            ],
            // 添加标识
            isAdd: true,
            tableSelectRows: [],
            // 加载标识
            loading: false,
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增/编辑模态框标题
            addModalTitle: '',
            // 新增/编辑模态框打开/关闭标识
            addModal: false,
            // 明细模态框打开/关闭标识
            detailModal: false,
            // 表格右键菜单禁用
            disContextMenu: [],
            // 盘点编码
            defineCodeArr: [],
            // 明细信息
            detailInfo: {},
            // 新增模态框盘点分店数据
            storeArr: [],
            // 用户选择器标识
            userModal: false,
            tempObjArr: [],
            // 用户分组
            usersArr: [],
            // 盘点编码禁用标识
            codeDisable: true,
            defaultCode: '',
            defaultName: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            const code = this.$store.getters.storeInfo.code || ''
            this.$set(this.seachValue, 'userCode', code)
            this.tableCode = '9d2f77dba2874ded8052439909b19e90:reservation'
            this.tableApiPath = 'BookingConfirmFind'
            console.log(this.$store.getters.storeInfo)
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getStoreArr()
        this.getUsers()
    },
    methods: {
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'BookingConfirmFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit()
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            }
        },
        // 盘点编码搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        // 新增/编辑模态框
        addEdit (index) {
            this.isAdd = true
            this.selectedSingleRow = {}
            this.tempObjArr = []
            this.addModalTitle = '新增预约确认信息'
            this.addModal = true
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        onContextmenuChange (row) {
            this.disContextMenu = []
            if (row.confirmStatus === 1) {
                this.disContextMenu = ['预约确认', '删除']
            }
        },
        /**
         * @name:表格右击明细监听
         */
        detailHandler (row) {
            this.selectedSingleRow = { ...row }
            axios({
                path: 'BookingConfirmFindDetail',
                method: 'POST',
                body: { id: row.id }
            }).then(res => {
                if (res.flag === 1) {
                    this.detailInfo = res.data
                }
            })
            this.detailModal = true
        },
        /**
         * @name:删除
         */
        onDel (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'BookingConfirmDel',
                        method: 'post',
                        body: { ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData(self.tableCode, { path: self.tableApiPath })
                        }
                    })
                }
            })
        },
        /**
         * @name:批量确认
         */
        onConfirmClick () {
            if (this.tableSelectRows.length <= 0) {
                return this.$message.warning('您尚未选中任何数据！')
            }
            const self = this
            this.$confirm({
                title: '提示',
                content: '确认进行批量确认吗？',
                onOk () {
                    const ids = map(self.tableSelectRows, 'id')
                    axios({
                        path: 'BookingConfirmAddBatch',
                        method: 'post',
                        body: { ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData(self.tableCode, { path: self.tableApiPath })
                        }
                    })
                }
            })
        },
        /**
         * @name: 明细提交
         */
        detailSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { detailForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.id = this.selectedSingleRow.id
                    axios({
                        path: 'BookingConfirm',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.detailModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 模态框关闭
        subCancel () {
            this.addModal = false
            this.detailModal = false
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    console.log('values-----------', values)
                    this.loading = true
                    // values.applyTime = moment().format('x')
                    values.userCode = this.tempObjArr.join(',')
                    axios({
                        path: 'BookingConfirmAddInternal',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        disabledStartDate (current) {
            return moment(current).isBefore(moment().startOf('minute'))
        },
        // 新增模态框获取盘点分店数据
        getStoreArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = index + 1
                        item.title = item.code + '-' + item.name
                        item.value = item.code
                    })
                    this.storeArr = [...data]
                }
            })
        },
        /**
         * @name: 获取用户数据
         */
        getUsers () {
            axios({
                path: 'PermissionsUserFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach((item, index) => {
                        item.key = index + 1
                        item.title = item.name
                        item.value = item.code
                    })
                    this.usersArr = [...data]
                }
            })
        },
        handleStoreChange (value) {
            if (value === undefined) {
                this.codeDisable = true
                this.form.setFieldsValue({
                    defineCode: ''
                })
                return false
            }
            this.codeDisable = false
            axios({
                path: 'StocktakeDefineFindExistBooking',
                method: 'post',
                body: {
                    storeCode: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = index + 1
                        item.title = `${moment().format('YYYY-MM-DD')}--${item.code}`
                        item.value = item.code
                    })
                    this.defineCodeArr = [...data]
                }
            })
        },
        /**
         * @name: 用户选择器
         */
        onStoreSelect (arr) {
            const newarr = [...this.tempObjArr]
            this.tempObjArr = [...new Set([...newarr, ...map(arr, 'code')])] // 将门店选择器选中的项目显示在选择框中
        },
        /**
         * @name: 生效分店弹框
         * @msg:
         * @param {type}
         * @return:
         */
        selectFocusEffect () {
            this.userModal = true
            this.$refs.userRef.blur() // 取消选择框的焦点，防止重复触发选择器
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'reservation') {
                this.getStoreArr()
                this.getUsers()
            }
        },
        'seachValue.userCode': {
            handler (val) {
                if (val) {
                    axios({
                        path: 'StocktakeDefineFindDefineByStoreCode',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.seachValue, 'defineCode', '')
                            this.$set(this.conditions[1], 'selectDataArr', res.data)
                        }
                    })
                } else {
                    this.$set(this.conditions[1], 'selectDataArr', [])
                }
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
.detail{
    .ant-col-8-8{
        padding-left: 10px;
    }
}
</style>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-28 09:15:29
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
      :submitClick="submitClick"
    >

      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">费用项目名称</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input placeholder="请输入项目名称" v-decorator="$check('role.feeName', {initialValue:BaseMessageObj.feeName || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('role.note', {initialValue:BaseMessageObj.note || ''})" :autosize="{ minRows: 10, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
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
import moment from 'moment'
import BtModal from '@comp/Modal'
export default {
    name: 'SupplierExpenseItem',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            title: '新增费用项目',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '费用项目名称',
                    type: 'input',
                    key: 'feeName'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'SupplierExpenseItem.edit',
                    fc: this.editHandler
                },
                {
                    name: '删除',
                    action: 'SupplierExpenseItem.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'LineManagement.get',
                    fc: e => this.$refs.newTable.showDetails('费用项目详情', e)
                }
            ],
            seachValue: {
                auditTimeA: moment().subtract({ months: 1 }),
                auditTimeB: moment()
            },
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            costOfName: '',
            rowId: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '1ca3fc75773a4f4fafc85127e23bf1cf:SupplierExpenseItem'
            this.tableApiPath = 'ProviderSetSelectFeeSet'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
        this.tableData()
    },
    computed: {
        signDtDefaultValue () {
            return moment().add({ days: 1 })
        }
    },

    methods: {
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    for (const item of this.costOfName) {
                        if (item === values.feeName) {
                            this.$message.warning('供应商费用名称重复，请重新输入!')
                            return
                        }
                    }
                    this.submitLoading = true
                    if (this.addEdit === 'add') {
                        axios({
                            path: 'ProviderSetAdd',
                            method: 'post',
                            body: {
                                feeName: values.feeName,
                                note: values.note
                            },
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                                this.addEditModel = false
                            }
                        })
                    } else {
                        axios({
                            path: 'ProviderSetUpdateFeeSet',
                            method: 'post',
                            body: {
                                feeName: values.feeName,
                                note: values.note,
                                id: this.rowId
                            },
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            console.log(res, '415135')
                            if (res.flag === 1) {
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
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ isEnabled }) {
            console.log(isEnabled)
            if (isEnabled) {
                this.disContextMenu = ['编辑', '删除', '审核']
            } else {
                this.disContextMenu = []
            }
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
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
                this.$refs.newTable.exportFile('ProviderSetSelectFeeSet', this.seachValue)
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
            e.path = 'ProviderSetSelectFeeSet'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            console.log(keys, rows)
            this.selectArr = rows
        },
        /**
         * @name: 表格右击编辑
         * @msg:
         * @param {type}
         * @return:
         */
        editHandler (e) {
            console.log('编辑', e)
            this.rowId = e.id
            this.addData(e)
            this.BaseMessageObj.feeName = e.feeName
            this.BaseMessageObj.note = e.note
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
                arr = map(this.selectArr, 'id')
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
                        path: 'ProviderSetDelete',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        console.log('删除时的flag', res)
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
         * @name:点击取消弹框
         * @msg:
         * @param {type}
         * @return:
         */
        submitCancel () {
            this.addEditModel = false
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
                this.BaseMessageObj = {}
                this.title = '新增费用项目'
                this.addEditModel = true
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.addEdit = 'edit'
                this.addEditModel = true
                this.title = '编辑费用项目'
            }
            // 打开modal
        },
        tableData () {
            axios({
                path: 'ProviderSetSelectFeeSet',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    console.log('主表信息', res.data.list)
                    this.costOfName = _.map(res.data.list, 'feeName')
                }
            })
        }

    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'SupplierExpenseItem') {
                this.tableData()
            }
        }
    }
}
</script>

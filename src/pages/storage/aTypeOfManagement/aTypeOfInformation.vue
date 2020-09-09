<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-26 14:42:59
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
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :loading="submitLoading"
      :submitClick="submitClick"
      :orderId="orderId"
    >
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">件型名称</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input placeholder="请输入件型名称" v-decorator="$check('modelType.name', {initialValue:BaseMessageObj.name})" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">件型描述</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入件型描述" v-decorator="$check('modelType.description',{initialValue:BaseMessageObj.description})" :autosize="{ minRows: 8, maxRows: 2 }" />
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
import BtModal from '@comp/Modal'
export default {
    name: 'ATypeOfInformation',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            orderId: '',
            title: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '件型',
                    type: 'input',
                    key: 'code'
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'aTypeOfInformation.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'aTypeOfInformation.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'aTypeOfInformation.get',
                    fc: e => this.$refs.newTable.showDetails('件型信息详情', e)
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            rowId: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '369c41fe14a34bd995efefcc10462b26:aTypeOfInformation'
            this.tableApiPath = 'DistributionModelTypeFind'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })
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
                    this.submitLoading = true
                    console.log(values, '------------------')
                    if (this.addEdit === 'edit') {
                        values.id = this.rowId
                    }
                    axios({
                        path: this.addEdit === 'add' ? 'DistributionModelTypeAdd' : 'DistributionModelTypeUpdate',
                        method: 'post',
                        body: values,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
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
                this.$refs.newTable.exportFile('DistributionModelTypeFind', this.seachValue)
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
            e.path = 'DistributionModelTypeFind'
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
                        path: 'DistributionModelTypeDel',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.$refs.newTable.del(arr, 'id')
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
                console.log('新增件型信息')
                this.addEdit = 'add'
                this.BaseMessageObj = {}
                this.title = '新增件型信息'
                this.orderId = ''
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑件型信息', index)
                const arr = { ...index }
                this.rowId = arr.id
                this.BaseMessageObj = arr
                this.addEdit = 'edit'
                this.title = '编辑件型信息'
                this.orderId = arr.code
            }
            // 打开modal
            this.addEditModel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'aTypeOfInformation') {
            }
        }
    }
}
</script>

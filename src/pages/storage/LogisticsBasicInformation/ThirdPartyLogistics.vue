<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-05 16:41:36
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
    >
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">公司名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入公司名称" v-decorator="$check('logisticsTpl.name', {initialValue:BaseMessageObj.name})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">单件费用(元)</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width: 100%"
                :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="2"
                v-decorator="$check('logisticsTpl.unitCost',{initialValue:BaseMessageObj.unitCost})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">公司联系人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入公司联系人" v-decorator="$check('logisticsTpl.contacts', {initialValue:BaseMessageObj.contacts})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">联系电话</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('logisticsTpl.contactsPhone', {initialValue:BaseMessageObj.contactsPhone})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width:100%"
                :options="statusArr"
                v-decorator="$check('logisticsTpl.status',{initialValue:BaseMessageObj.status})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">公司规模</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请选择公司规模"
                style="width:100%"
                :options="scaleArr"
                v-decorator="$check('logisticsTpl.scale',{initialValue:BaseMessageObj.scale})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">地址</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('logisticsTpl.address', {initialValue:BaseMessageObj.address})" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea placeholder="请输入备注" v-decorator="$check('logisticsTpl.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 2, maxRows: 2 }" />
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
    name: 'ThirdPartyLogistics',
    components: {
        NewTable,
        SeachBox,
        BtModal
    },
    data () {
        return {
            title: '',
            tableCode: '',
            tableApiPath: '',
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '编号',
                    type: 'input',
                    key: 'code'
                },
                {
                    title: '公司名称',
                    type: 'input',
                    key: 'name'
                },
                {
                    title: '状态',
                    type: 'select',
                    key: 'status',
                    filter: true,
                    label: 'title',
                    value: 'key',
                    selectDataArr: []
                }
            ],
            // 表格多选，选中项数组
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '编辑',
                    action: 'ThirdPartyLogistics.edit',
                    fc: this.addData
                },
                {
                    name: '删除',
                    action: 'ThirdPartyLogistics.delete',
                    fc: this.deleteHandler
                },
                {
                    name: '详情',
                    action: 'ThirdPartyLogistics.get',
                    fc: e => this.$refs.newTable.showDetails('第三方物流管理详情', e)
                }
            ],
            seachValue: {},
            disContextMenu: [],
            addEditModel: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            BaseMessageObj: {},
            addEdit: '',
            costOfName: '',
            rowId: '',
            scaleArr: [
                {
                    key: '小于50人',
                    title: '小于50人'
                },
                {
                    key: '50~99人',
                    title: '50~99人'
                },
                {
                    key: '100~499人',
                    title: '100~499人'
                },
                {
                    key: '500~999人',
                    title: '500~999人'
                },
                {
                    key: '1000~4999人',
                    title: '1000~4999人'
                },
                {
                    key: '5000~9999人',
                    title: '5000~9999人'
                },
                {
                    key: '10000人以上',
                    title: '10000人以上'
                }
            ],
            statusArr: [
                {
                    key: '正常',
                    title: '正常'
                },
                {
                    key: '作废',
                    title: '作废'
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '92779e0ec157408ab9ee2201fceaf4ba:ThirdPartyLogistics'
            this.tableApiPath = 'DistributionTplFindAll'
            this.$refs.newTable.setContextmenu(this.rightMenu)
        })

        this.$set(this.conditions[2], 'selectDataArr', this.statusArr)
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
                        path: this.addEdit === 'add' ? 'DistributionTplAdd' : 'DistributionTplUpdate',
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
                this.$refs.newTable.exportFile('DistributionTplFindAll', this.seachValue)
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
            e.path = 'DistributionTplFindAll'
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
                    if (statusArr[item] === 'provider_fee_status：2') {
                        this.$message.warning('选中得数据存在已审核数据，不可删除')
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
                        path: 'DistributionTplDelete',
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
                console.log('新增')
                this.addEdit = 'add'
                this.BaseMessageObj = {
                    status: '正常',
                    unitCost: '0.00'
                }
                this.title = '新增第三方物流'
            } else {
                /**
                 * 编辑
                 */
                console.log('编辑')
                this.rowId = index.id
                this.BaseMessageObj = index
                this.addEdit = 'edit'
                this.title = '编辑第三方物流'
            }
            // 打开modal
            this.addEditModel = true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ThirdPartyLogistics') {
            }
        }
    }
}
</script>

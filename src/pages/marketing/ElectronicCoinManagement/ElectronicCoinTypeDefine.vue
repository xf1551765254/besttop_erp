<!--
 * @Description: 电子币定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-24 11:06:11
 * @LastEditors: haile
 * @LastEditTime: 2019-08-21 11:28:47
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
    <!-- 主表 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect" >
    </NewTable>
    <!-- 新增 编辑 -->
    <a-modal
      v-model="addEditModal"
      :title="addEditModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered >
      <template slot="footer">
        <a-button @click="addEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="submitClick">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">电子币类型</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入电子币类型"
                v-decorator="$check('ElectronicCoinDefine.name',{initialValue:tableSingleData.name})"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">备注</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                style="width:100%"
                :rows="2"
                placeholder="请输入备注"
                v-decorator="$check('ElectronicCoinDefine.note',{initialValue:tableSingleData.note})"
              />
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
import map from 'lodash.map'
import { axios } from '@/utils/request'
import moment from 'moment'
export default {
    name: 'ElectronicCoinDefine',
    components: { NewTable, SeachBox },
    data () {
        return {
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '编码'
                },
                {
                    key: 'type',
                    type: 'input',
                    title: '电子币类型'
                },
                {
                    key: 'makeBy',
                    type: 'select',
                    title: '创建人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '创建开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '创建结束日期',
                    mat: 'YYYY-MM-DD'
                }

            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 主表格
            tableCode: '',
            tableApiPath: '',
            disContextMenu: [],
            moenuOPT: [
                { name: '编辑',
                    action: 'ElectronicCoinTypeDefine.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'ElectronicCoinTypeDefine.delete',
                    fc: this.deleteHandler
                }
            ],
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // form
            addEditModal: false,
            addEditModalTitle: '',
            submitLoading: false,
            form: this.$form.createForm(this)
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'e48eb24188ab444cbd0d51f52bdad7f8:ElectronicCoinTypeDefine'
            this.tableApiPath = 'CoinTypeQueryDefineList'
            this.$refs.newTable.setContextmenu(this.moenuOPT)
        })
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CoinTypeQueryDefineList'
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
                this.$refs.newTable.exportFile('CoinTypeQueryDefineList')
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CoinTypeQueryDefineList' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            // this.tableSingleData = { ...tableRow }
        },
        /**
         * @name: 主表删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
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
                        path: 'CoinTypeDeleteDefine', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 新增编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.addEditModal = true
            if (addEditData === -1) {
                this.tableSingleData = {}
                this.addEditModalTitle = '新增电子币类型定义'
                this.isAdd = true
            } else {
                this.addEditModalTitle = '编辑电子币类型定义'
                this.isAdd = false
                this.tableSingleData = { ...addEditData }
            }
        },
        /**
         * @name: 新增编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                    }
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'CoinTypeAddCoinTypeDefine' : 'CoinTypeUpdateCoinTypeDefine',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
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
        }
    }
}
</script>
<style lang="less" scoped>
.lastChildCrm{
    border:1px solid #e8e8e8;
    background-color: #f5f5f5;
    .ant-form-item  {
        margin-bottom:0px;
    }
    .ant-col-4 {
        text-align: right;
        font-weight: bold;
        padding-right: 10px;
        font-size: 12px;
        background-color: #f5f5f5;
        line-height: 36px;
    }
    textarea.ant-input {
        margin-bottom:0px;
        min-height: 36px;
        border-radius:0;
    }

}
</style>

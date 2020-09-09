<!--
 * @Description: 卡类型定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-21 18:41:33
 * @LastEditors: lin
 * @LastEditTime: 2019-08-21 19:52:05
 -->
<template>
  <div>
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
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增弹框 -->
    <a-modal
      v-model="AddEditModal"
      :title="AddEditModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">卡类型名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                style="width:100%"
                placeholder="请输入卡类型名称"
                v-decorator="$check('CardTypeDefinition.typeName',{initialValue:tableSingleData.typeName})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4">有效期（月）</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="0"
                v-decorator="$check('CardTypeDefinition.expiryDate', {initialValue:tableSingleData.expiryDate||120})"
                placeholder="请输入有效期（月）"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">备注</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :autosize="{minRows: 2}"
                style="width:100%;min-height:36px"
                v-decorator="$check('CardTypeDefinition.note', {initialValue:tableSingleData.note||''})" >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-button key="back" @click="AddEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="subLoading" @click="handleSubmit">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox },
    name: 'CardTypeDefinition',
    data () {
        return {
            conditions: [
                {
                    key: 'typeName',
                    type: 'input',
                    title: '卡类型名称'
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
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '创建人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '卡类型状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'card_type_define_status'
                    }
                }

            ],
            btns: ['add'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            menuOpt: [
                { name: '编辑',
                    action: 'CardTypeDefinition.edit',
                    fc: this.addEdit
                }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // 新增
            form: this.$form.createForm(this),
            AddEditModal: false, //
            AddEditModalTitle: '',
            subLoading: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '5c859bcac6f94761813893ca56b8592c:CardTypeDefinition'
            this.tableApiPath = 'CardTypeQueryList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
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
            e.path = 'CardTypeQueryList'
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
            if (e === 'export') {
                this.$refs.newTable.exportFile('CardTypeQueryList')
            } else if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            }
        },
        /**
         * @name: 刷新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardTypeQueryList' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'card_type_define_status:1') {
                this.disContextMenu = ['编辑']
            } else {
                this.disContextMenu = [ ]
            }
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
         * @name: 新增 编辑
         */
        addEdit (addEditData) {
            this.AddEditModal = true
            if (addEditData === -1) {
                this.isAdd = true
                this.AddEditModalTitle = '新增卡类型定义'
                this.tableSingleData = { }
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑卡类型定义'
                this.tableSingleData = { ...addEditData }
            }
            this.AddEditModal = true
        },
        /**
         * @name:弹框体提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.makeStoreCode = this.$store.getters.storeInfo.code
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                    }
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'CardTypeAddCardTypeDefine' : 'CardTypeUpdateCardTypeDefine',
                        body: values
                    }).then(res => {
                        this.subLoading = false
                        // console.log(res)
                        if (res.flag === 1) {
                            this.AddEditModal = false
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
        },
    }  
}
</script>
<style lang="less">
@import "../../../assets/modalStyle.less";
</style>
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
        height: 100%;
    }

}
</style>

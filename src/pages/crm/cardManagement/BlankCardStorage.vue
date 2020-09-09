<!--
 * @Description: 空白卡定义
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-08-23 14:05:31
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
      v-model="AddModal"
      class="doc"
      title="新增卡定义"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      wrapClassName="setDocCss"
      style="top: 20px;"
      destroyOnClose
      centered>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">卡类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择卡类型"
                style="width: 100%"
                :options="typeNameArr"
                :filterOption="filterOption"
                @search="handleTypeName"
                @select="changeTypeNameValue"
                v-decorator="$check('BlankCardStorage.typeCode')"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">有效期（月）</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                disabled
                placeholder="请输入有效期（月）"
                v-decorator="$check('BlankCardStorage.expiryDate', {initialValue:120})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">卡开始号码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                ref="beginNumberRef"
                placeholder="请输入卡开始号码"
                @blur="setCardName"
                v-decorator="$check('BlankCardStorage.beginNumber',{})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">卡结束号码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                ref="endNumberRef"
                @blur="setCardName"
                placeholder="请输入卡结束号码"
                v-decorator="$check('BlankCardStorage.endNumber',{})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4" class="">
            卡入库数量（张）
          </a-col>
          <a-col :span="20" style="">
            <a-form-item class="">
              <a-input
                disabled
                placeholder=""
                v-decorator="$check('BlankCardStorage.cardNumbber')"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="formCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="subLoading" @click="handleSubmit">提交</a-button>
      </template>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
.table-nowrap{
    white-space:nowrap;
    text-overflow:ellipsis;
    margin: 0 10px;
}
.setDocCss .ant-select-disabled svg{
    display: none;
}
.lastChildCrm{
  .ant-form-explain{
      display: none;
    }
}
</style>
<style lang="less" scoped>

.lastChildCrm{
    border:1px solid #e8e8e8;
    background-color: #f5f5f5;
    .ant-form-item {
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
    textarea.ant-input{
        margin-bottom:0px;
        min-height: 36px;
    }
}

</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
export default {
    components: { NewTable, SeachBox },
    name: 'BlankCardStorage',
    data () {
        return {
            conditions: [
                {
                    key: 'cardNo',
                    type: 'input',
                    title: '卡号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '定义开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '定义结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'defineBy',
                    type: 'select',
                    title: '定义人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
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
                // { name: '删除',
                //     action: 'BlankCardStorage.delete',
                //     fc: this.deleteHandler
                // }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            // 新增
            form: this.$form.createForm(this),
            AddModal: false, //
            subLoading: false,

            // 下拉框
            typeNameArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'f66cbc8c3b524243b1a5a76ceba2a25a:BlankCardStorage'
            this.tableApiPath = 'CardDefineQueryCardsDefine'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'CardDefineQueryCardsDefine'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('CardDefineQueryCardsDefine')
            } else if (e === 'add') {
                this.addHandler()
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
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardDefineQueryCardsDefine' })
        },
        /**
         * @name: 表格右击
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
        },
        /**
         * @name: 表格的多选
         */
        onSelect (keyId, KeyRows) {
            this.tableIdsArr = map(KeyRows, 'id')
            this.tableRowsArr = KeyRows
        },
        /**
         * @name: 删除
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
                        path: 'CardDefineDeleteCards', // 接口path名，必传
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
         * @name: 弹框关闭
         */
        formCancel () {
            this.AddModal = false
        },
        /**
         * @name: 新增
         */
        addHandler () {
            this.AddModal = true
        },
        /**
         * @name: 开始号码
         */
        changeBeginNumber (e) {
            const endNum = this.$refs.endNumberRef.value
            if (e.target.value > endNum) {
                this.$message.warning('开始号码不能大于结束号码')
            }
        },
        /**
         * @name: 结束号码改变时
         */
        changeEndNumber (e) {
            const startNum = this.$refs.beginNumberRef.value
            if (e.target.value < startNum) {
                this.$message.warning('结束号码不能小于开始号码')
            }
        },
        /**
         * @name:弹框体提交
         */
        handleSubmit (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (values.beginNumber.length !== values.endNumber.length) {
                        return this.$message.error('卡开始号码的位数要等于卡结束号码的位数')
                    }
                    if (values.beginNumber > values.endNumber) {
                        return this.$message.error('卡开始号码不能大于卡结束号码')
                    }
                    values.defineStore = this.$store.getters.storeInfo.code
                    this.subLoading = true
                    axios({
                        path: 'CardDefineAddBatch',
                        body: values
                    }).then(res => {
                        this.subLoading = false
                        // console.log(res)
                        if (res.flag === 1) {
                            this.AddModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 卡类型
         * @msg:
         * @param {type}
         * @return:
         */
        changeTypeNameValue (value) {
            const obj = this.typeNameArr.filter(o => o.typeCode === value)[0]
            if (obj) {
                this.form.setFieldsValue({
                    expiryDate: obj.expiryDate
                })
            }
        },
        /**
         * @name: 下拉框过滤修改
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        setCardName (e) {
            const form = this.form
            if (form.getFieldValue('endNumber') !== undefined && form.getFieldValue('beginNumber') !== undefined) {
                const beginNumber = Number(form.getFieldValue('beginNumber'))
                const endNumber = Number(form.getFieldValue('endNumber'))
                if (form.getFieldValue('beginNumber').length !== form.getFieldValue('endNumber').length) {
                    form.setFieldsValue({
                        cardNumbber: ''
                    })
                    return this.$message.error('卡开始号码的位数要等于卡结束号码的位数')
                }
                if (form.getFieldValue('beginNumber') > form.getFieldValue('endNumber')) {
                    form.setFieldsValue({
                        cardNumbber: ''
                    })
                    return this.$message.error('卡开始号码不能大于卡结束号码')
                }
                form.setFieldsValue({
                    cardNumbber: endNumber - beginNumber + 1
                })
            }
        },
        /**
         * @name:
         */
        handleTypeName (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.typeNameArr.length = 0
                this.getTypeNameArr(value)
            }, 300)
        },
        /**
         * @name: 获取卡类型
         */
        getTypeNameArr (value) {
            axios({
                path: 'CardTypeQueryList',
                method: 'post',
                body: {
                    typeCode: value
                }
            }).then(res => {
                console.log('卡类型', res)
                const dataArr = [...res.data.list]
                dataArr.forEach(i => {
                    i.title = `${i.typeCode}-${i.typeName}`
                    i.value = i.typeCode
                    i.key = i.typeCode
                })
                this.typeNameArr = dataArr
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

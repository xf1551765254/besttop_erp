<!--
 * @Description: 卡储值
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-18 10:22:37
 * @LastEditTime: 2019-07-11 14:23:10
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          type="primary"
          size="small"
          style="margin-right:10px"
          icon="plus"
          v-action:add
          @click="addStoreValue()">储值</a-button>
      </div>
    </seachbox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </newtable>
    <!-- 储值卡 -->
    <bt-modal
      v-model="StoreValueModal"
      title="卡储值"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="subLoading">
      <a-form :form="form">
        <a-row class="setDocCss">
          <a-col :sm="8" :md="4" :xl="3">卡名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择卡名称"
                style="width: 100%"
                :options="typeNameArr"
                :filterOption="filterOption"
                @change="changeTypeNameValue"
                v-decorator="$check('cardStoredValue.typeName')"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">卡开始号码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                ref="beginNumberRef"
                placeholder="请输入卡开始号码"
                v-decorator="$check('cardStoredValue.beginNumber')"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">卡结束号码</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                ref="endNumberRef"
                placeholder="请输入卡结束号码"
                v-decorator="$check('cardStoredValue.endNumber')"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">储值人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择储值人"
                style="width: 100%"
                :options="evaluationByDorpArr"
                :filterOption="filterOption"
                v-decorator="$check('cardStoredValue.evaluationBy')"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">储值位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                disabled
                placeholder=""
                v-decorator="$check('cardStoredValue.evaluationStore',{initialValue:`${this.$store.getters.storeInfo.code}--${this.$store.getters.storeInfo.name}`})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">规则名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择规则名称"
                style="width: 100%"
                :options="cardRuleArr"
                :filterOption="filterOption"
                @change="changecardRuleValue"
                v-decorator="$check('cardStoredValue.cardRuleCode')"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">是否修改额度</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-select
              placeholder=""
              disabled
              style="width: 100%"
              v-model="modifyFlag">
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">存款额度</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                :disabled="modifyFlag===1?false:true"
                placeholder="请输入存款额度"
                v-decorator="$check('cardStoredValue.cardAmount')"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">赠送额度</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="2"
                :step="1"
                :disabled="modifyFlag===1?false:true"
                placeholder="请输入赠送额度"
                v-decorator="$check('cardStoredValue.sendAmount')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">
            备注
          </a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :rows="2"
                v-decorator="$check('cardStoredValue.note', {initialValue:tableSingleData.note||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-row type="flex" justify="end">
        <a-col :span="3" style="margin:10px 0;">
          <a-button
            v-action:add
            type="primary"
            size="small"
            key="submit"
            :loading="confirmLoading"
            style="margin-left:10px"
            @click="storeValueSubmit">储值确认</a-button>
        </a-col>
      </a-row>
      <a-divider dashed/>
      <!-- 详情表格上方按钮 -->
      <div class="buttonMargin">
        <a-button class="editable-add-btn" :disabled="selectedRowKeys.length===0" type="danger" size="small" @click="deleteRow(-1)">删除</a-button>
      </div>
      <div class="table-nowrap">
        <a-table
          rowKey="bt_web_id"
          size="small"
          :columns="tableColumns"
          bordered
          :pagination="{defaultPageSize:7,hideOnSinglePage:true}"
          :rowSelection="{onChange: onSelectChange}"
          :dataSource="tableData">
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.bt_web_id)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template slot="footer" slot-scope="currentPageData">
            <a-row type="flex" justify="space-between">
              <a-col :span="2" style="font-size:15px;margin-right:4%"><h4 >总计：</h4></a-col>
              <a-col :span="7"><span>存款额度：{{ cardAmoutTotal }}</span></a-col>
              <a-col :span="7"><span>赠送金额：{{ sendAmountTotal }}</span></a-col>
              <a-col :span="7"><span>卡金额：{{ totalAmountTotal }}</span>
              </a-col>
            </a-row>
          </template>
        </a-table>
      </div>
    </bt-modal>
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
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
}
</style>
<style lang="less" scoped>
.editable-add-btn{
    margin-bottom:5px;
    margin-left:10px;
}
</style>

<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    components: { SeachBox, NewTable, BtModal },
    name: 'CardStoredValue',
    data () {
        return {
            conditions: [
                {
                    key: 'typeName',
                    type: 'select',
                    title: '卡名称',
                    label: 'typeName',
                    value: 'typeName',
                    filter: true,
                    path: 'CardDefineQueryAllName'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '储值开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '储值结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'cardNo',
                    type: 'input',
                    title: '卡号'
                },
                {
                    key: 'evaluationBy',
                    type: 'select',
                    title: '储值人',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                }

            ],
            btns: ['export', 'print'],
            seachValue: {
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            tableCode: '', // id
            tableApiPath: '', // path
            menuOpt: [
                // { name: '删除',
                //     action: 'cardStoredValue.delete',
                //     fc: this.deleteHandler
                // }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // 卡储值
            StoreValueModal: false,
            form: this.$form.createForm(this),
            confirmLoading: false,
            subLoading: false,
            minNum: 0,
            maxNum: 0,
            modifyFlag: 1, // 是否可修改
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '卡名称', dataIndex: 'typeName', align: 'center' },
                { title: '卡号', dataIndex: 'cardNo', align: 'center' },
                { title: '存款(元)', dataIndex: 'cardAmount', align: 'center' },
                { title: '赠送(元)', dataIndex: 'sendAmount', align: 'center' },
                { title: '卡金额(元)', dataIndex: 'totalAmount', align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            tableData: [],
            selectedRowKeys: [],
            selectedRows: [],
            cardAmoutTotal: '0.00', // 存款
            sendAmountTotal: '0.00', // 赠送
            totalAmountTotal: '0.00', // 卡金额
            totalForm: {}, // 提交的数据

            // 下拉框
            typeNameArr: [], // 卡名称
            evaluationByDorpArr: [], // 储值人
            cardRuleArr: [] // 规则名称
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '09f7894ac258450085c19d77059190ba:cardStoredValue'
            this.tableApiPath = 'CardEvaluationQueryEvaluationCards'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTypeNameArr()
        this.getcardRuleDorpArr()
        this.getApplyByDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'CardEvaluationQueryEvaluationCards'
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
                this.$refs.newTable.exportFile('CardEvaluationQueryEvaluationCards')
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
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardEvaluationQueryEvaluationCards' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            // if (tableRow.status === 'schedule_rule_define_status:1') {
            //     this.disContextMenu = []
            // } else {
            //     this.disContextMenu = ['删除']
            // }
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
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            let arr = []
            const _this = this
            if (delEventData === -1) {
                // const newData = [...this.tableRowsArr]
                // const NoDel = newData.filter(o => o.status !== 'schedule_rule_define_status:1')
                // if (NoDel.length > 0) {
                //     this.$message.warning('只有未审核的才能进行此操作')
                //     return
                // }
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
                        path: 'CardEvaluationDelete', // 接口path名，必传
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
         * @name: 获取卡名称
         * @msg:
         * @param {type}
         * @return:
         */
        getTypeNameArr () {
            axios({
                path: 'CardDefineQueryAllName',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.typeName
                        i.title = i.typeName
                        i.value = i.typeName
                    })
                    this.typeNameArr = [...data]
                    if (this.typeNameArr.length > 0) {
                        this.typeNameArrFirst = this.typeNameArr[0]
                        this.minNum = this.typeNameArrFirst.minNum
                        this.maxNum = this.typeNameArrFirst.maxNum
                    }
                }
            })
        },
        /**
         * @name: 人
         * @msg:
         * @param {type}
         * @return:
         */
        getApplyByDorpArr () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.evaluationByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 规则名称
         * @msg:
         * @param {type}
         * @return:
         */
        getcardRuleDorpArr () {
            axios({
                path: 'CardRuleQueryCardRules',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.cardRuleArr = dataArr
                }
            })
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
        /**
         * @name: 卡储值
         * @msg:
         * @param {type}
         * @return:
         */
        addStoreValue () {
            this.tableData = []
            this.StoreValueModal = true
            this.cardAmoutTotal = '0.00' // 存款
            this.sendAmountTotal = '0.00' // 赠送
            this.totalAmountTotal = '0.00' // 卡金额
        },
        /**
         * @name: 卡名称值改变
         * @msg:
         * @param {type}
         * @return:
         */
        changeTypeNameValue (value) {
            const newArr = [...this.typeNameArr]
            const target = newArr.filter(o => o.typeName === value)[0]
            this.minNum = target.minNum
            this.maxNum = target.maxNum
            this.form.setFieldsValue({
                beginNumber: target.minNum,
                endNumber: target.maxNum
            })
        },
        /**
         * @name: 规则名称改变
         * @msg:
         * @param {type}
         * @return:
         */
        changecardRuleValue (value) {
            const newArr = [...this.cardRuleArr]
            const target = newArr.filter(o => o.code === value)[0]
            this.form.setFieldsValue({
                sendAmount: target.sendValue,
                cardAmount: target.limitValue
            })
            this.modifyFlag = target.modifyFlag
        },
        /**
         * @name: 详情表格选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRowKeys = map(selectRows, 'bt_web_id')
            // selectKeys
            this.selectedRows = selectRows
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            if (keyId === -1) {
                const deleteoData = [...this.tableData]
                for (const i in this.selectedRowKeys) {
                    for (const j in deleteoData) {
                        if (deleteoData[j].bt_web_id === this.selectedRowKeys[i]) {
                            deleteoData.splice(j, 1)
                        }
                    }
                }
                this.tableData = deleteoData
            } else {
                const newData = [...this.tableData]
                this.tableData = newData.filter(item => item.bt_web_id !== keyId)
                // const selectId = newData.filter(item => item.tb_web_id === keyId)[0]
            }
            this.count(this.tableData)
        },
        /**
         * @name: 合计计算
         * @msg:
         * @param {type}
         * @return:
         */
        count (arrData) {
            const { add } = this.$math
            const cardAmoutArr = []
            const sendAmountArr = []
            const totalAmountArr = []
            if (arrData.length === 0) {
                this.cardAmoutTotal = '0.00'
                this.sendAmountTotal = '0.00'
                this.totalAmountTotal = '0.00'
            } else {
                for (const item of arrData) {
                    cardAmoutArr.push(item.cardAmount)
                    sendAmountArr.push(item.sendAmount)
                    totalAmountArr.push(item.totalAmount)
                }
                this.cardAmoutTotal = cardAmoutArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.sendAmountTotal = sendAmountArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
                this.totalAmountTotal = totalAmountArr.reduce(function (prev, cur) {
                    return add(prev, cur, 2)
                }, 0)
            }

            // console.log(this.cardAmoutTotal, this.sendAmountTotal, this.totalAmountTotal)
        },
        /**
         * @name: 卡储值确定
         * @msg:
         * @param {type}
         * @return:
         */
        storeValueSubmit (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!values.beginNumber) {
                        values.beginNumber = undefined
                    }
                    if (!values.endNumber) {
                        values.endNumber = undefined
                    }
                    if (values.cardAmount === 0) {
                        this.$message.error('存款金额不能为0')
                        return
                    }
                    if (Number(values.beginNumber) > Number(values.endNumber)) {
                        this.$message.error('卡开始号码不能大于卡结束号码')
                        return
                    } else if (Number(this.maxNum) < Number(values.endNumber)) {
                        this.$message.error('输入的结束号码不能大于该卡的结束号码')
                        return
                    } else if (Number(values.beginNumber) < Number(this.minNum)) {
                        this.$message.error('输入的开始号码不能小于该卡的开始号码')
                        return
                    }
                    if (Number(values.cardAmount) < Number(values.sendAmount)) {
                        this.$message.error('存款金额不能小于赠送金额')
                        return
                    }
                    values.evaluateFlag = '0'
                    values.status = 'card_make_status:0'
                    this.confirmLoading = true
                    axios({
                        path: 'CardEvaluationQueryByRule',
                        method: 'POST',
                        body: values
                    }).then(res => {
                        this.confirmLoading = false
                        if (res.flag === 1) {
                            const data = [...res.data]
                            data.forEach(o => {
                                o.bt_web_id = o.id
                            })
                            if (data.length > 0) {
                                this.count(data)
                                this.totalForm = values
                            } else {
                                this.$message.warning('此类名称的卡已经储值完')
                            }
                            this.tableData = data
                            this.selectedRows = []
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 储值弹框关闭
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            this.StoreValueModal = false
        },
        /**
         * @name:储值卡提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit () {
            if (this.tableData.length === 0) {
                this.$message.warning('您没有添加储值卡信息，请进行储值确认生成卡信息')
            } else {
                this.subLoading = true
                this.totalForm.makeParams = this.tableData
                this.totalForm.evaluationStore = this.$store.getters.storeInfo.code
                axios({
                    path: 'CardEvaluationAdd',
                    method: 'post',
                    body: this.totalForm
                }).then(res => {
                    this.subLoading = false
                    if (res.flag === 1) {
                        this.reLoadTableData()
                        this.StoreValueModal = false
                    }
                })
            }
        }
    },
    watch: {
        '$store.state.app.pageName' (to, from) {
            if (to === 'cardStoredValue') {
                this.getTypeNameArr()
                this.getcardRuleDorpArr()
                this.getApplyByDorpArr()
            }
        },
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

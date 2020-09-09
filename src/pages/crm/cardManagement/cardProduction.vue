<!--
 * @Description: 卡制作
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-08-23 14:37:41
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
          @click="addHandler()">制卡</a-button>
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
    </NewTable>
    <!-- 新增弹框 -->
    <a-modal
      v-model="AddModal"
      class="doc"
      title="制卡"
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
          <a-col :span="4">卡名称</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择卡名称"
                style="width: 100%"
                :options="typeNameArr"
                @search="handletypeNameDorpArr"
                @select="changeTypeNameValue"
                :filterOption="false"
                v-decorator="$check('cardProduction.typeName',{initialValue:typeNameArrFirst.typeName})"/>
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
                v-decorator="$check('cardProduction.beginNumber',{initialValue:minNum})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">卡结束号码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input
                ref="endNumberRef"
                placeholder="请输入卡结束号码"
                v-decorator="$check('cardProduction.endNumber',{initialValue:maxNum})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-row type="flex" justify="end">
        <a-col :span="4" style="margin:10px 0;">
          <a-button type="primary" key="submit" style="margin-left:10px" :loading="subLoading" @click="productionCard">{{ subLoading?'请刷卡...':'开始制卡' }}</a-button>
        </a-col>
      </a-row>
      <div class="table-nowrap">
        <a-table
          rowKey="id"
          size="small"
          :columns="CardColumns"
          bordered
          :pagination="{defaultPageSize:10,hideOnSinglePage:true}"
          :dataSource="CardData">
        </a-table>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="formCancel">关闭</a-button>
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
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
}
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import card from '@/utils/card'

export default {
    components: { NewTable, SeachBox },
    name: 'CardProduction',
    data () {
        return {
            subLoading: false,
            conditions: [
                {
                    key: 'cardNo',
                    type: 'input',
                    title: '卡号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '制卡开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制卡结束日期',
                    mat: 'YYYY-MM-DD'
                },
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
                    key: 'makeBy',
                    type: 'select',
                    title: '制卡人',
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
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            menuOpt: [
                // { name: '删除',
                //     action: 'cardProduction.delete',
                //     fc: this.deleteHandler
                // }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            // 新增
            form: this.$form.createForm(this),
            AddModal: false,
            minNum: 0,
            maxNum: 0,
            // 写卡表格
            CardColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '卡名称', dataIndex: 'typeName', align: 'center' },
                { title: '卡号', dataIndex: 'cardNo', align: 'center' },
                { title: '磁条号', dataIndex: 'magneticStripe', align: 'center' }
            ],
            CardData: [],

            // 下拉框
            typeNameArr: [], // 卡名称
            typeNameArrFirst: {}
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'f3dc642c361b4af6a199306e1c6e6645:cardProduction'
            this.tableApiPath = 'CardMakeQueryCardMake'
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
            e.path = 'CardMakeQueryCardMake'
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
                this.$refs.newTable.exportFile('CardMakeQueryCardMake')
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
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardMakeQueryCardMake' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
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
                        path: 'CardRuleDelete', // 接口path名，必传
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
         * @name: 卡名称
         */
        handletypeNameDorpArr (value) {
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
         * @name: 获取卡名称
         */
        getTypeNameArr (value) {
            axios({
                path: 'CardDefineQueryAllDefineName',
                method: 'post',
                body: {
                    status: 'card_type_define_status:1',
                    typeCode: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = [...res.data]
                    data.forEach(i => {
                        i.key = `${i.typeCode}-${i.typeName}`
                        i.title = `${i.typeCode}-${i.typeName}`
                        i.value = i.typeCode
                    })
                    this.typeNameArr = [...data]
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
            this.CardData = []
            this.AddModal = true
        },
        /**
         * @name: 卡名称值改变
         */
        changeTypeNameValue (value) {
            const newArr = [...this.typeNameArr]
            const target = newArr.filter(o => o.typeCode === value)[0]
            this.minNum = target.minNum
            this.maxNum = target.maxNum
            this.form.setFieldsValue({
                beginNumber: target.minNum,
                endNumber: target.maxNum
            })
        },
        /**
         * @name: 开始号码
         * @msg:
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
        doRriteCard (values) {
            this.subLoading = true
            const self = this
            const cardId = `${moment().format('x')}${Math.floor(Math.random() * 89999999 + 10000000)}`
            values.magneticStripe = cardId
            // card.initCard()
            card.onWrite(cardId, (res, err) => {
                console.log('卡制作', res, err)
                if (res && res.flag === 1) {
                    axios({
                        path: 'CardMakeAdd',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            self.CardData.unshift(res.data)
                            self.reLoadTableData()
                            self.$confirm({
                                title: '提示',
                                content: '刷卡成功！是否继续下一张？',
                                onOk () {
                                    self.doRriteCard(values)
                                },
                                onCancel () {
                                    self.subLoading = false
                                }
                            })
                        }
                    })
                } else {
                    self.$message.error('写卡失败！')
                    this.subLoading = false
                }
            })
        },
        /**
         * @name:制作卡
         */
        productionCard (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (values.beginNumber < this.minNum) {
                        this.$message.error('卡开始号码不能小于此卡名称的最小卡号码')
                        return
                    }
                    if (values.endNumber > this.maxNum) {
                        this.$message.error('卡结束号码不能大于此卡名称的最大卡号码')
                        return
                    }
                    if (values.beginNumber > values.endNumber) {
                        this.$message.error('卡开始号码不能大于卡结束号码')
                        return
                    }
                    values.makeStore = this.$store.getters.storeInfo.code
                    this.doRriteCard(values)
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

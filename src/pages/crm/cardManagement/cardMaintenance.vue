<!--
 * @Description: 卡维护
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-04-15 18:52:24
 * @LastEditTime: 2019-07-11 16:11:12
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
          v-action:edit
          icon="lock"
          @click="freezeFn(-1)">冻结</a-button>
        <a-button
          type="primary"
          size="small"
          icon="unlock"
          v-action:edit
          @click="thawFn(-1)">解冻</a-button>
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
    <!-- 实名认证弹框 -->
    <a-modal
      v-model="AddModal"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      wrapClassName="setDocCss"
      style="top: 20px;"
      destroyOnClose
      centered>
      <template slot="title" >
        <p style="display: inline-block;margin-bottom: 0;vertical-align: middle;">实名认证</p>
      </template>
      <a-row type="flex" align="middle" style="margin-bottom:10px;">
        <a-col :span="21">
          <a-form :form="form">
            <a-row class="doc">
              <a-col :span="4">姓名</a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-input
                    ref="beginNumberRef"
                    placeholder="请输入姓名"
                    v-decorator="$check('cardMaintenance.name')"/>
                </a-form-item>
              </a-col>
              <a-col :span="4">手机号</a-col>
              <a-col :span="8">
                <a-form-item>
                  <a-input
                    ref="beginNumberRef"
                    placeholder="请输入手机号"
                    v-decorator="$check('cardMaintenance.telephone')"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :span="2">
          <a-button
            type="primary"
            size="small"
            key="submit"
            icon="search"
            :loading="subLoading"
            style="margin-left:10px"
            @click="searchSubmit">查询</a-button>
        </a-col>
      </a-row>
      <div class="table-nowrap">
        <a-table
          rowKey="id"
          size="small"
          :columns="realNameColumns"
          bordered
          :pagination="{defaultPageSize:10,hideOnSinglePage:true}"
          :rowSelection="{onChange: onSelectChange}"
          :dataSource="realNameTableData">
        </a-table>
      </div>
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="formCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button type="primary" :loading="sumbitLoad" @click="Sumbit">提交</a-button>
      </template>
    </a-modal>
    <!-- 重写 -->
    <a-modal
      v-model="rewriteMadal"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="300"
      style="top: 20px;"
      destroyOnClose
      centered>
      <template slot="title" >
        <p style="display: inline-block;margin-bottom: 0;vertical-align: middle;">卡号：{{ tableSingleData.cardNo }}</p>
      </template>
      <div style="font-size:20px;text-align:center">
        <p style="">等待写入，请刷卡</p>
        <a-button size="small" :loading="bruchSubLoading" @click="rewriteSub">{{ bruchSubLoading?'请刷卡...':'开始刷卡' }}</a-button>
      </div>
      <template slot="footer">
        <a-button size="small" type="primary" @click="closeRewrite">关闭</a-button>
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
    name: 'CardMaintenance',
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
                    key: 'status',
                    type: 'select',
                    title: '卡状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'card_make_status'
                    }
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
                { name: '实名认证',
                    action: 'cardMaintenance.add',
                    fc: this.realNameFn
                },
                { name: '解绑',
                    action: 'cardMaintenance.edit',
                    fc: this.unbundling
                },
                { name: '冻结',
                    action: 'cardMaintenance.edit',
                    fc: this.freezeFn
                },
                { name: '解冻',
                    action: 'cardMaintenance.edit',
                    fc: this.thawFn
                },
                { name: '重写',
                    action: 'cardMaintenance.edit',
                    fc: row => {
                        // this.rewriteFn
                        this.rewriteMadal = true
                    }
                }
            ],
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},

            // 实名新增
            form: this.$form.createForm(this),
            AddModal: false, //
            subLoading: false,
            sumbitLoad: false,
            // 实名表格
            realNameColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '姓名', dataIndex: 'name', align: 'center' },
                { title: '手机号', dataIndex: 'telephone', align: 'center' }
            ],
            realNameTableData: [],
            selectedRows: [], // 实名的选择

            // 重写
            rewriteMadal: false,
            bruchSubLoading: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '29eb6c3d408c4fc3833951e2a58dd529:cardMaintenance'
            this.tableApiPath = 'CardMakeQueryCardUpHold'
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
            e.path = 'CardMakeQueryCardUpHold'
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
                this.$refs.newTable.exportFile('CardMakeQueryCardUpHold')
            }
        },
        /**
         * @name: 刷新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CardMakeQueryCardUpHold' })
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'card_make_status:2') {
                this.disContextMenu = ['实名认证', '冻结', '重写', '解绑']
            } else {
                if (tableRow.customerName) {
                    this.disContextMenu = ['解冻', '实名认证']
                } else {
                    this.disContextMenu = ['解冻', '解绑']
                }
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
        doRriteCard (values) {
            this.bruchSubLoading = true
            const self = this
            const cardId = `${moment().format('x')}${Math.floor(Math.random() * 89999999 + 10000000)}`
            values.magneticStripe = cardId
            card.onWrite(cardId, (res, err) => {
                console.log('123', res, err)
                if (res && res.flag === 1) {
                    axios({
                        path: 'CardMakeUpdate',
                        body: values
                    }).then(res => {
                        self.bruchSubLoading = false
                        if (res.flag === 1) {
                            self.reLoadTableData()
                            self.rewriteMadal = false
                        }
                    })
                } else {
                    self.$message.error('写卡失败！')
                }
            })
        },
        /**
         * @name: 重写刷卡
         * @msg:
         * @param {type}
         * @return:
         */
        rewriteSub () {
            const obj = {
                id: this.tableSingleData.id,
                makeStore: this.$store.getters.storeInfo.code,
                typeName: this.tableSingleData.typeName,
                cardNo: this.tableSingleData.cardNo
            }
            this.doRriteCard(obj)
            // axios({
            //     path: 'CardMakeUpdate',
            //     method: 'poth',
            //     body: obj
            // }).then(res => {
            //     if (res.flag === 1) {
            //         this.rewriteMadal = false
            //         this.reLoadTableData()
            //     }
            // })
        },
        /**
         * @name: 重写关闭
         * @msg:
         * @param {type}
         * @return:
         */
        closeRewrite () {
            this.rewriteMadal = false
        },
        /**
         * @name: 冻结
         * @msg:
         * @param {type}
         * @return:
         */
        freezeFn (freezeData) {
            let arr = []
            const _this = this
            if (freezeData === -1) {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要冻结的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isF = newData.filter(o => o.status === 'card_make_status:2')
                if (isF.length > 0) {
                    this.$message.warning('只有初始状态正常状态下才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(freezeData.id)
            }
            _this.$confirm({
                title: '提示',
                content: '此操作将进行冻结，冻结后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CardMakeFreeze', //
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'card_make_status:2',
                            store: _this.$store.getters.storeInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name:解冻
         * @msg:
         * @param {type}
         * @return:
         */
        thawFn (thawData) {
            let arr = []
            const _this = this
            if (thawData === -1) {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要解冻的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isF = newData.filter(o => o.status !== 'card_make_status:2')
                if (isF.length > 0) {
                    this.$message.warning('只有冻结状态下才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(thawData.id)
            }
            this.$confirm({
                title: '提示',
                content: '此操作将进行解冻，是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CardMakeFreeze', //
                        method: 'post',
                        body: {
                            'ids': arr,
                            status: 'card_make_status:1',
                            store: _this.$store.getters.storeInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 实名认证弹框
         * @msg:
         * @param {type}
         * @return:
         */
        realNameFn (realNameData) {
            this.AddModal = true
            this.getName()
        },
        /**
         * @name: 解绑
         * @msg:
         * @param {type}
         * @return:
         */
        unbundling (realNameData) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '此操作将进行解绑，是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'CardMakeUnTying', //
                        method: 'post',
                        body: {
                            id: realNameData.id,
                            typeName: realNameData.typeName,
                            cardNo: realNameData.cardNo,
                            makeStore: _this.$store.getters.storeInfo.code
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 实名认证搜索接口
         * @msg:
         * @param {type}
         * @return:
         */
        getName (pams = {}) {
            axios({
                path: 'CustomerUserQueryCustomer',
                method: 'post',
                body: pams
            }).then(res => {
                if (res.flag === 1) {
                    this.realNameTableData = res.data.list
                }
            })
        },
        /**
         * @name:实名搜索
         * @msg:
         * @param {type}
         * @return:
         */
        searchSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.getName(values)
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 实名表格选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectKeys, selectRows) {
            this.selectedRows = selectRows
        },
        /**
         * @name: 弹框关闭
         * @msg:
         * @param {type}
         * @return:
         */
        formCancel () {
            // this.reLoadTableData()
            this.AddModal = false
        },
        /**
         * @name:实名提交
         * @msg:
         * @param {type}
         * @return:
         */
        Sumbit () {
            if (this.selectedRows.length !== 1) {
                this.$message.warning('请选择一个用户进行实名认证')
                return
            }
            this.sumbitLoad = true

            axios({
                path: 'CardMakeRealName',
                method: 'post',
                body: {
                    id: this.tableSingleData.id,
                    customerId: this.selectedRows[0].id,
                    customerPhone: this.selectedRows[0].telephone,
                    customerName: this.selectedRows[0].name,
                    typeName: this.tableSingleData.typeName,
                    cardNo: this.tableSingleData.cardNo,
                    makeStore: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                this.sumbitLoad = false
                if (res.flag === 1) {
                    this.AddModal = false
                    this.reLoadTableData()
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to, form) {
            if (to === 'cardMaintenance') {

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

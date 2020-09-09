<!--
 * @Description: 原单退货登记
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-17 09:53:36
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-27 18:33:28
 -->
<template>
  <div class="originalReturn">
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
    </seachbox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect"
    />
    <!-- 修改 -->
    <bt-modal
      v-model="addEditModal"
      :title="addEditTitle"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :loading="loading"
      :subBtn="isDelatis!==0"
      :class="{model:isDelatis===0}">
      <!-- 基础信息 -->
      <Handle :isDelatis="isDelatis" :returnData.sync="returnData" :type="2"></Handle>
      <a-divider dashed/>
      <!-- 添加表格 -->
    </bt-modal>
    <a-modal
      title="物流信息"
      :width="900"
      :visible="visible"
    >
      <div class="logistics">
        <a-tabs :defaultActiveKey="0" :tabPosition="'left'" :style="{ height: '500px'}" @prevClick="callback" @nextClick="callback">
          <a-tab-pane :tab="`物流单号${el.code}`" :key="index" v-for="(el,index) in logistics">
            <a-timeline>
              <a-timeline-item color="green" v-for="logs in el.logs" :key="logs.id">
                <p>{{ logs.happenType }}</p>
                <div>
                  <span>{{ logs.createName }}</span>
                  <span>{{ logs.createTime }}</span>
                  <span>{{ logs.note }}</span>
                </div>
              </a-timeline-item>

            </a-timeline>
          </a-tab-pane>

        </a-tabs>
      </div>
      <template slot="footer">
        <a-button key="back" @click="visible=false">关闭</a-button>
      </template>

    </a-modal>
  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import moment from 'moment'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import BtModal from '@comp/Modal'
import Handle from './OrdinaryReturn/components/Handle'
import { mapGetters } from 'vuex'

export default {
    name: 'OriginalReturn',
    components: {
        seachBox,
        NewTable,
        BtModal,
        Handle
    },
    data () {
        return {
            conditions: [
                { title: '申请单号', type: 'input', key: 'codeSearch' },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'name',
                    value: 'code',
                    filter: true,
                    selectDataArr: [
                        {
                            code: '',
                            name: '全部'
                        },
                        {
                            code: 'return_apply_status:1',
                            name: '未审核'
                        },
                        {
                            code: 'return_apply_status:2',
                            name: '已审核'
                        }
                    ]
                },
                { title: '导购姓名', type: 'input', key: 'guidSearch' },
                { title: '顾客姓名', type: 'input', key: 'customerSearch' },

                {
                    key: 'startTime',
                    type: 'date',
                    title: '开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '结束日期',
                    mat: 'YYYY-MM-DD'
                }

            ], // array,编辑框的配置
            seachValue: {
                source: '1',
                startTime: moment().subtract({ days: 7 }).format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            }, // json,默认值，编辑框的值，双向绑定
            btns: ['add', 'edit', 'del', 'verify', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            // 主表格
            tableCode: '',
            tableApiPath: '',
            tableIdsArr: [],
            tableRowsArr: [],
            // 单行选中的值
            tableSingleData: {},
            form: this.$form.createForm(this),
            strategyDefineValue: '', // 政策
            customerValue: '', // 客户
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                {
                    name: '编辑',
                    action: 'OriginalReturn.edit',
                    fc: this.auditHandler
                },
                {
                    name: '审核',
                    action: 'OriginalReturn.verify',
                    fc: this.auditCancel
                },
                {
                    name: '删除',
                    action: 'OriginalReturn.delete',
                    fc: this.deleteHandler
                },
                { name: '预览',
                    action: 'OriginalReturn.query',
                    fc: this.detailHandler
                },
                { name: '查看物流',
                    action: 'OriginalReturn.get',
                    fc: this.getLogistics
                }
            ],
            tags: ['uncheck'],
            addEditTitle: '',
            addEditModal: false,
            submitLoading: false,

            loading: false,
            // 是否查看 0：查看 1：新增  2：修改
            isDelatis: 0,
            // 列表数据
            returnList: [],
            // 查询code
            seachCode: '',
            notTotal: 0,
            thenTotal: 0,
            returnData: {},
            // 物流信息
            visible: false,
            logistics: []

        }
    },
    computed: {
        ...mapGetters(['userInfo', 'windowHeight', 'storeInfo'])
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
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '1900f681c2474b1e9e6fc8ebbdd4bdcd:OriginalReturn'
            this.tableApiPath = 'DistReturnApplyFindByPrimaryKey2ReturnGoods'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        moment,
        onReload () { // 清空的实现，将seachValue置空。
            this.seachValue = {
                source: '1'
            }
        },
        onSeach (e) { // 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
            console.log(e)
            this.reLoadTableData()
        },
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
                this.$refs.newTable.exportFile('DistReturnApplyFindByPrimaryKey2ReturnGoods')
            }
        },
        onSelect (ketIndex, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistReturnApplyFindByPrimaryKey2ReturnGoods' })
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'return_apply_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['审核', '查看物流', '删除', '编辑']
            }
        },
        // 预览
        async detailHandler (autiData) {
            this.addEditTitle = '预览'
            this.isDelatis = 0
            // this.seachCode = code
            await this.queryCodeReturn(autiData.code)
            this.addEditModal = true
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delEventData) {
            console.log(delEventData)

            const _this = this
            if (delEventData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'return_apply_status:1')
                if (!isAuit) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
            }
            if (delEventData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                const codes = this.tableRowsArr.map(el => {
                    return el.code
                })
                this.$confirm({
                    title: '提示',
                    content: '确定选中项全部删除？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'DistReturnApplyDeleteByApplyCode', // 接口path名，必传
                            method: 'post',
                            body: {
                                codes: delEventData === 0 ? codes : [delEventData.code]
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },

        /**
         * @name: 编辑
         * @msg:
         * @param {type}
         * @return:
         */

        async auditHandler (autiData) {
            console.log(autiData)

            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'return_apply_status:1')
                if (!isAuit) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
            }
            if (autiData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.handleTitle = '编辑'
                this.isDelatis = 2
                // this.seachCode = code
                await this.queryCodeReturn(autiData.code)
                this.addEditModal = true
            }
        },
        // 审核
        auditCancel (autiData) {
            console.log(autiData)
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === 'return_apply_status:1')
                if (!isAuit) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
            }
            const _this = this
            if (autiData === 0 && _this.tableIdsArr.length === 0) {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择数据！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                this.$confirm({
                    title: '提示',
                    content: '此操作将进行审核, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'DistReturnApplyAuditByApplyCode', // 接口path名，必传
                            method: 'post',
                            body: {
                                code: autiData.code,
                                updateBy: _this.userInfo.code
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                _this.reLoadTableData()
                            }
                        })
                    },
                    onCancel () {
                        _this.$message.info('已取消')
                    }
                })
            }
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.addEditTitle = '新增'
                this.isDelatis = 1
                this.returnData = {
                    applyMain: {
                        storeCode: this.storeInfo.code, // 申请店code
                        createBy: this.userInfo.code, // 申请店codecreateBy
                        guideCode: this.userInfo.code, // 导购编码
                        guideName: this.userInfo.name, // 导购姓名
                        customerCode: '', // 顾客编码
                        customerName: '', // 顾客姓名
                        customerTelephone: '', // 客户电话
                        pickUpTime: moment().add(1, 'days'), // 预约取货时间
                        auditBy: '', // 审核人
                        auditTime: null, // 审核时间
                        status: '', // 审核状态
                        type: '1', // 服务类型
                        note: '' // 审核备注
                    // 'ifIntsall': '' // 审核备注
                    },
                    applyDetail: []
                }
                this.addEditModal = true
            }
        },
        // 关闭申请退换货
        closeApplyModal () {
            this.addEditModal = false
        },
        handleSubmit () {
            // DistReturnApplyUpdateByPrimaryKeySelective
            const data = Object.assign({}, this.returnData.applyMain)
            data.applyDetail = this.returnData.applyDetail

            console.log(data)
            if (this.returnData.applyDetail.length === 0) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请选择商品！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else if (this.returnData.applyMain.customerName === '') {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请添加顾客！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                const isapplyReason = this.returnData.applyDetail.every(element => {
                    return element.applyReason === ''
                })
                const quantity = this.returnData.applyDetail.every(element => {
                    return element.quantity === 0
                })
                console.log(isapplyReason)
                if (this.returnData.applyMain.type === '') {
                    let secondsToGo = 3
                    const modal = this.$warning({
                        title: '提示',
                        content: '请选择服务类型！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else if (isapplyReason) {
                    let secondsToGo = 3
                    const modal = this.$warning({
                        title: '提示',
                        content: '请选择申请原因！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else if (quantity) {
                    let secondsToGo = 3
                    // console.warn();

                    const modal = this.$warning({
                        title: '提示',
                        content: '商品数量不能为0！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else {
                    if (this.isDelatis === 1) {
                        axios({
                            path: 'DistReturnApplyAddSelective2ReturnGoods',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                this.addEditModal = false
                                // this.queryReturnList()
                                this.reLoadTableData()
                            }
                        })
                    } else if (this.isDelatis === 2) {
                        axios({
                            path: 'DistReturnApplyUpdateByPrimaryKeySelective',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                this.addEditModal = false
                                // this.queryReturnList()
                                this.reLoadTableData()
                            }
                        })
                    }
                }
            }
        },
        // tab切换
        callback (key) {
            console.log(key)
            this.activeKey = key
            this.queryReturnList()
        },
        getLogistics (returnApplyCode, sourceCode) {
            axios({
                path: 'DistLogisticsFindReturnsDeliverByParam',
                method: 'post',
                body: {
                    returnApplyCode,
                    sourceCode
                }
            }).then(res => {
                console.log(res.data)
                if (res.flag === 1 && res.data && res.data.length > 0) {
                    this.logistics = res.data
                    this.visible = true
                } else {
                    this.logistics = []
                }
            })
        },
        getDeliverBySourceCode (sourceCode) {

        },
        // 查询code对应信息
        queryCodeReturn (code) {
            axios({
                path: 'DistReturnApplyFindOne',
                method: 'post',
                body: {
                    codeSearch: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.returnData = res.data
                    if (this.returnData.applyDetail[0].source === '第三方售后') {
                        this.isAddGoods = 2
                    } else {
                        this.isAddGoods = 1
                    }
                    this.returnData.applyMain.pickUpTime = moment(this.returnData.applyMain.pickUpTime)
                    console.log(this.returnData)
                }
            })
        }
    }

}
</script>

<style lang="less" scoped>
.originalReturn{

}
</style>

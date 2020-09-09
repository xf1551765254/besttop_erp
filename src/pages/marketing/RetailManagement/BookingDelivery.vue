<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-08-27 10:43:58
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-27 18:21:03
 -->
<template>
  <div class="booking-delivery">
    <SeachBox
      :conditions="conditions"
      :btns="btns"
      :rowSelect="true"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" v-action:edit size="small" @click="auditHandler(0)">转送货</a-button>
      <!-- 这里可以自定义组件没有提供的特殊按钮 -->
    </Seachbox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      @onSelect="onSelect"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      :pams="seachValue">
    </NewTable>
  </div>
</template>

<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import moment from 'moment'
import { mapGetters } from 'vuex'
import map from 'lodash.map'

export default {
    name: 'BookingDelivery',
    components: {
        SeachBox,
        NewTable
    },
    data () {
        return {
            // "storeCode":"0333",
            //  "guideCode":"",
            //  "skuCode":"",
            //  "customerCode":"",
            //  "startTime":"",
            //  "endTime":"",
            //  "sendStartTime":"",
            //  "sendEndTime":"",
            conditions: [
                {
                    key: 'customerCode',
                    type: 'input',
                    title: '顾客姓名/手机号'
                },
                // {
                //     key: 'customerCode',
                //     type: 'select',
                //     title: '客户编码/名称',
                //     label: ['code', 'name'],
                //     value: 'code'
                //     // filter: true,
                //     // path: 'CustomerDistributorsFindBySelected'

                // },
                {
                    key: 'skuCode',
                    type: 'input',
                    title: 'sku编码/名称/规格型号'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'name',
                    value: 'code',
                    // filter: true,
                    allowClear: true,
                    selectDataArr: [
                        {
                            code: 'shopping_trolley_status:4',
                            name: '未处理'
                        },
                        {
                            code: 'shopping_trolley_status:8',
                            name: '已处理'
                        },
                        {
                            code: 'shopping_trolley_status:7',
                            name: '已退款'
                        }
                    ]
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '下单开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '下单结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'sendStartTime',
                    type: 'date',
                    title: '送货开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'sendEndTime',
                    type: 'date',
                    title: '送货结束日期',
                    mat: 'YYYY-MM-DD'
                }

            ],
            btns: ['add', 'edit', 'del', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            seachValue: {
                storeCode: '',
                guideCode: '',
                skuCode: '',
                customerCode: '',
                status: 'shopping_trolley_status:4'
                // startTime: moment().startOf('day').subtract({ days: 7 }),
                // endTime: moment().startOf('day'),
                // sendStartTime: moment().startOf('day').subtract({ days: 7 }),
                // sendEndTime: moment().startOf('day')
            }, // 搜索的值

            // 表格
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
                    name: '转送货',
                    action: 'BookingDelivery.verify',
                    fc: this.auditHandler
                }
            ],
            tags: []
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    mounted () {
        this.seachValue.storeCode = this.storeInfo.code
        this.seachValue.guideCode = this.userInfo.code
        // this.seachValue.startTime = moment(this.seachValue.startTime).format('YYYY-MM-DD')
        // this.seachValue.endTime = moment(this.seachValue.endTime).format('YYYY-MM-DD')
        this.$nextTick(() => {
            this.tableCode = 'ca1bd22579194cfa83110712d67d2340:BookingDelivery'
            this.tableApiPath = 'ShoppingTrolleyQueryPreSaleOrder'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        moment,
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            console.log(e)
            e.path = 'ShoppingTrolleyQueryPreSaleOrder'
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
            this.seachValue.storeCode = this.storeInfo.code
            this.seachValue.guideCode = this.userInfo.code
            console.log(this.seachValue)
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            console.log(e)
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                console.log(this.tableIdsArr)

                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'edit') {
                if (this.tableIdsArr.length === 0 || this.tableIdsArr.length > 1) {
                    this.$message.warning('请选择要编辑的一组数据')
                } else if (this.tableIdsArr.length === 1) {
                    this.addEdit(this.tableRowsArr[0])
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ShoppingTrolleyQueryPreSaleOrder')
            }
        },
        //
        onSelect (ketIndex, keyRows) {
            console.log(keyRows)

            this.tableIdsArr = map(keyRows, 'code')

            this.tableRowsArr = keyRows
            console.log(this.tableIdsArr, this.tableRowsArr)
        },
        onContextmenuChange (tableRow) {
            console.log(tableRow)
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'shopping_trolley_status:4') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['转送货']
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'ShoppingTrolleyQueryPreSaleOrder' })
        },
        /**
         * @name: 转送货
         * @msg:
         * @param {type}
         * @return:
         */
        auditHandler (autiData) {
            console.log(autiData)
            // const _this = this
            // let arr = []
            const _this = this
            if (autiData === 0) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.every(o => o.status === '1')
                if (!isAuit) {
                    this.$message.warning('只有未转送货的才能进行此操作')
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
                this.$confirm({
                    title: '提示',
                    content: '此操作将进确认退货，确认后将不可进行修改, 是否继续?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk () {
                        axios({
                            path: 'DistWholesaleBillAuditReturnGoodsBycode', // 接口path名，必传
                            method: 'post',
                            body: {
                                codeList: autiData === 0 ? _this.tableIdsArr : [autiData.code],
                                createBy: _this.userInfo.code
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
            // console.log(_this.tableIdsArr)
        }
    }
}
</script>

<style lang="less" scoped>
.booking-delivery{

}

</style>

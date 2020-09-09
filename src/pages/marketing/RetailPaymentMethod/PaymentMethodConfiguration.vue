<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-08-27 10:53:54
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-27 18:00:24
 -->
<template>
  <div class="PaymentMethodConfiguration">
    <SeachBox
      :conditions="conditions"
      :btns="btns"
      :rowSelect="true"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" v-action:edit size="small" @click="auditHandler(0)">确认退货</a-button>
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
      <template v-for="col in ['name', 'age', 'address']" :slot="col" slot-scope="text, record, index">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record, index">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.key)">Save</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
              <a>Cancel</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">Edit</a>
          </span>
        </div>
      </template>
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
    name: 'PaymentMethodConfiguration',
    components: {
        SeachBox,
        NewTable
    },
    data () {
        return {
            conditions: [
                {
                    key: 'searchParam',
                    type: 'select',
                    title: '客户编码/名称',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'CustomerDistributorsFindBySelected'

                },
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'name',
                    value: 'code',
                    filter: true,
                    selectDataArr: [
                        {
                            code: '1',
                            name: '待确认'
                        },
                        {
                            code: '2',
                            name: '已确认'
                        }
                    ]
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '制单开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制单结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'createBy',
                    type: 'select',
                    title: '制单人',
                    filter: true,
                    path: 'PermissionsUserFindOption',
                    label: ['code', 'name'],
                    value: 'code'

                }

            ],
            btns: ['add', 'edit', 'del', 'export', 'print'], // 定义要显示的按钮，默认内置这5个。
            seachValue: {
                searchParam: '',
                saleStoreCode: '',
                takeStoreCode: '',
                createBy: '',
                status: '1',
                code: '',
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
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
                    name: '编辑',
                    action: 'PaymentMethodConfiguration.edit',
                    fc: this.addEdit
                },
                {
                    name: '确认退货',
                    action: 'PaymentMethodConfiguration.verify',
                    fc: this.auditHandler
                }

            ],
            tags: []
        }
    },
    mounted () {
        this.seachValue.saleStoreCode = this.storeInfo.code
        this.seachValue.startTime = moment(this.seachValue.startTime).format('YYYY-MM-DD')
        this.seachValue.endTime = moment(this.seachValue.endTime).format('YYYY-MM-DD')
        this.$nextTick(() => {
            this.tableCode = '3f993686f7734e988a019dc22789447d:PaymentMethodConfiguration'
            this.tableApiPath = 'DistWholesaleBillFindWholesaleReturnGoodsPageList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.queryStoreWarehouseList()
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
            e.path = 'DistWholesaleBillFindWholesaleReturnGoodsPageList'
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
                this.$refs.newTable.exportFile('DistWholesaleBillFindWholesaleReturnGoodsPageList')
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
            if (tableRow.status === '2') {
                this.disContextMenu = ['确认退货']
            } else {
                this.disContextMenu = []
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'DistWholesaleBillFindWholesaleReturnGoodsPageList' })
        },

        edit (key) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                target.editable = true
                this.data = newData
            }
        },
        save (key) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                delete target.editable
                this.data = newData
                this.cacheData = newData.map(item => ({ ...item }))
            }
        },
        cancel (key) {
            const newData = [...this.data]
            const target = newData.filter(item => key === item.key)[0]
            if (target) {
                Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
                delete target.editable
                this.data = newData
            }
        }
    }
}
</script>

<style lang="less" scoped>
.PaymentMethodConfiguration{

}
</style>

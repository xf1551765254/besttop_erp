<!--
 * @Description: ERP
 * @Version: ^0.0.8
 * @Company: BestTop
 * @Author: Reat
 * @LastEditors: shuai
 * @Date: 2019-03-08 13:29:15
 * @LastEditTime: 2019-08-23 15:45:55
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :rowSelect="false"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onChangeTable"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('prototypeCancellingStocks.provider',{initialValue:BaseMessageObj.provider})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('prototypeCancellingStocks.makeStoreCode',{initialValue:BaseMessageObj.makeStoreCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">退库位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('prototypeCancellingStocks.storeCode',{initialValue:BaseMessageObj.storeCode})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('prototypeCancellingStocks.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row> -->
        <h4 class="baseInfo">商品详情</h4>
        <a-table
          rowKey="id"
          size="small"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          :pagination="false"
          bordered
          :scroll="scroll">
          <!-- <template v-for="col in [ 'note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input
                v-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputStorageChange(e.target.value, record.id, col)"
              />
            </div>
          </template> -->
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('prototypeCancellingStocks.makeUserno', {initialValue:BaseMessageObj.makeUserno})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('prototypeCancellingStocks.makeDt', {initialValue: BaseMessageObj.makeDt} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import moment from 'moment'
import BtModal from '@comp/Modal'
import getStatus from '@comp/statusAll/getStatus'
import Preview from '../preview/ReturnManagementPrototypeCancellingStocksPreview'
export default {
    name: 'PrototypeCancellingStocks',
    components: { seachBox, NewTable, Preview, BtModal },
    data () {
        return {
            tags: [],
            orderId: '',
            billsData: [],
            previewVisbel: false,
            // 多选选中
            deleteAll: [],
            // 控制右键菜单
            disContextMenu: [],
            // 接口
            tableApiPath: '',
            // 表头id
            tableCode: '',
            // 搜索框默认值
            seachValue: {
                beginMakeTime: moment().subtract({ days: 7 }),
                endMakeTime: moment()
            },
            // 工具栏按钮定义
            btns: ['export', 'print'],
            conditions: [
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '制单人',
                    key: 'makeUserno',
                    type: 'select',
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption'
                },
                {
                    title: '供应商',
                    key: 'provider',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'CustomerSupplierFindOption'
                },
                {
                    title: '制单开始时间',
                    key: 'beginMakeTime',
                    type: 'date'
                },
                {
                    title: '制单结束时间',
                    key: 'endMakeTime',
                    type: 'date'
                }
            ],
            MenuOperations: [
                {
                    name: '退库',
                    action: 'ReturnManagement.verify',
                    fc: this.cancellingStocksHandler
                },
                {
                    name: '预览',
                    action: 'ReturnManagement.get',
                    fc: this.detailsSumbit
                }
            ],
            addEditModel: false,
            submitLoading: false,
            BaseMessageObj: {},
            scroll: { x: 1350, y: 350 },
            title: '退库',
            form: this.$form.createForm(this),
            categoryinfoColumns: [
                { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
                { title: '申请退库数量', dataIndex: 'recN', width: 100, align: 'right' },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
                { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
                { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'left' },
                { title: '品牌名称', dataIndex: 'brandName', width: 100, align: 'left' },
                { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
                { title: '备注', dataIndex: 'note', align: 'left', scopedSlots: { customRender: 'note' } }
            ], // 表头
            categoryinfoData: [], // 表体
            rowId: '',
            indexNumber: 1
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '4c98f216810d45b3934cf44a26e53cc4:prototypeCancellingStocks'
            this.tableApiPath = 'SampleSampleExitFindExitConfirm'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        getStatus('bill_sample_entry_status', this.conditions[1])
        this.seachValue = {
            billStatus: 'bill_sample_entry_status:1',
            beginMakeTime: moment().subtract(7, 'days'),
            endMakeTime: moment()
        }
    },
    methods: {
        /**
         * @name: 提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            axios({
                path: 'SampleSampleExitAuditExit',
                method: 'post',
                body: {
                    id: this.rowId
                },
                headers: {}
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                    this.addEditModel = false
                }
            })
            // const { form: { validateFields } } = this // 引入validateFields
            // validateFields((err, values) => {
            //     if (!err) {
            //         let addArr = {}
            //         this.submitLoading = true
            //         addArr = Object.assign({ note: values.note }, { id: this.rowId })
            //         axios({
            //             path: 'SampleSampleExitAuditExit',
            //             method: 'post',
            //             body: addArr,
            //             headers: {}
            //         }).then(res => {
            //             this.submitLoading = false
            //             if (res.flag === 1) {
            //                 this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
            //                 this.addEditModel = false
            //             }
            //         })
            //     } else {
            //         this.$message.error(Object.values(err)[0]['errors'][0]['message'])
            //     }
            // })
        },
        detailsSumbit (e) {
            console.log(e, '本行数据')
            this.orderId = e.code
            this.previewVisbel = true
        },
        cancellingStocksHandler (e) {
            console.log(e)
            this.rowId = e.id
            const row = { ...e }
            row.provider = `${row.provider}-${row.providerName}`
            row.makeStoreCode = `${row.makeStoreCode}-${row.makeStoreName}`
            row.storeCode = `${row.storeCode}-${row.storeName}`
            row.makeUserno = `${row.makeUserno}-${row.makeUserName}`
            this.BaseMessageObj = { ...row }
            axios({
                path: 'SampleSampleExitFindExitDetail',
                method: 'post',
                body: {
                    id: e.id
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.index = this.indexNumber++
                    })
                    this.categoryinfoData = data
                }
                this.addEditModel = true
            })
        },
        /**
         * @name:监听工具栏按钮
         */
        onSeachClick (e) {
            if (e === 'add') {
                console.log('新增')
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SampleSampleExitFindExitConfirm', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {
            console.log(billStatus, '审核状态')
            if (billStatus === 'bill_entry_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['新增', '编辑', '审核', '删除']
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            e.path = 'SampleSampleExitFindExitConfirm'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {}
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ReturnManagement') {

            }
        },
        addEditModel (val) {
            if (!val) {
                this.categoryinfoData = []
                this.BaseMessageObj = {}
                this.indexNumber = 1
            }
        }
    }
}
</script>

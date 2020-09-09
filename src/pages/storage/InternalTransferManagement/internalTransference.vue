<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-08-22 15:39:12
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
      @onSeach="onSeach"/>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <InternalTransferenceEdit v-model="EditModel" :title="title" :code="pamsCode" />
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less">
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
</style>
<script>
import InternalTransferenceEdit from '@pages/storage/edit/InternalTransferenceEdit'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import moment from 'moment'
import Preview from './preview/internalTransferencePreview'
import getStatus from '@comp/statusAll/getStatus'
export default {
  name: 'InternalTransference',
  components: {
    NewTable,
    SeachBox,
    Preview,
    InternalTransferenceEdit
  },
  data () {
    return {
      pamsCode: '',
      title: '',
      tableCode: '',
      tableApiPath: '',
      btns: ['add', 'del', 'export', 'print'],
      conditions: [
        {
          title: '单据号',
          type: 'input',
          key: 'code'
        },
        {
          title: '审核人',
          key: 'auditBy',
          type: 'select',
          filter: true,
          label: ['code', 'name'],
          value: 'code',
          path: 'PermissionsUserFindOption'
        },
        {
          title: '单据状态',
          type: 'select',
          key: 'billStatus',
          filter: true,
          label: 'title',
          value: ['type', 'configKey'],
          selectDataArr: []
        },
        {
          title: '制单开始时间',
          type: 'date',
          key: 'auditTimeA'
        },
        {
          title: '制单结束时间',
          type: 'date',
          key: 'auditTimeB'
        }
      ],
      // 表格多选，选中项数组
      selectArr: [],
      // 右键菜单
      rightMenu: [
        {
          name: '编辑',
          action: 'internalTransference.edit',
          fc: this.addData
        },
        {
          name: '删除',
          action: 'internalTransference.delete',
          fc: this.deleteHandler
        },
        {
          name: '确认',
          action: 'internalTransference.confirm',
          fc: this.auditHandler
        },
        {
          name: '取消确认',
          action: 'internalTransference.cancel',
          fc: this.cancelTheConfirmation
        },
        {
          name: '预览',
          action: 'internalTransference.get',
          fc: this.previewFun
        }
      ],
      seachValue: {
        billStatus: 'bill_allot_status:1',
        auditTimeA: moment().subtract(7, 'days'),
        auditTimeB: moment()
      },
      disContextMenu: [],
      EditModel: false,
      form: this.$form.createForm(this),
      submitLoading: false,
      BaseMessageObj: {},
      addEdit: '',
      rowId: '',
      categoryinfoSelectedRowKeys: [], // 选中项
      categoryinfoColumns: [
        { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
        { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'center' },
        { title: 'SKU名称', dataIndex: 'skuName', width: 200, align: 'center' },
        { title: '品牌', dataIndex: 'brandName', width: 100, align: 'center' },
        { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'center' },
        { title: '规格型号', dataIndex: 'skuModel', width: 250, align: 'center' },
        { title: '调拨数量', dataIndex: 'qtty', width: 100, align: 'center', scopedSlots: { customRender: 'qtty' } },
        { title: '现库存', dataIndex: 'curNumber', align: 'center', width: 100 },
        { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
        { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
      ], // 表头
      categoryinfoData: [], // 表体
      orderId: '',
      tags: [],
      scroll: { x: 1850 },
      storeQuery: false,
      distributionCenterArr: [], // 收获位置
      applicantArr: [], // 负责人
      theGoodsLocationId: '',
      pamsBounced: {},
      totalQuantity: '0',
      retailPrice: '0.00', // 零售价
      costPrice: '0.00', // 成本价
      // 预览
      previewVisbel: false,
      addEditModel: false,
      indexNumber: 1
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.tableCode = '78f92c44e1c24f0d9394ad05befb08e7:internalTransference'
      this.tableApiPath = 'DistributionBillAllotFind'
      this.$refs.newTable.setContextmenu(this.rightMenu)
    })
    getStatus('bill_allot_status', this.conditions[2])
    this.seachValue = {
      billStatus: 'bill_allot_status:1',
      auditTimeA: moment().subtract(7, 'days'),
      auditTimeB: moment()
    }
  },
  methods: {
    /**
         * @name: 取消确认
         * @msg:
         * @param {type}
         * @return:
         */
    cancelTheConfirmation (e) {
      const that = this
      this.$confirm({
        title: '提示',
        content: '是否取消确认?',
        onOk () {
          axios({
            path: 'DistributionBillAllotsPurchaseWithdraw',
            method: 'post',
            body: {
              id: e.id
            },
            headers: {}
          }).then(res => {
            if (res.flag === 1) {
              that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
            }
          })
        },
        onCancel () {}
      })
    },
    previewFun (e) {
      this.orderId = e.code
      this.previewVisbel = true
    },
    /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
    onContextmenuChange (e) {
      console.log(e.billStatus)
      if (e.billStatus === 'bill_allot_status:1') {
        this.disContextMenu = ['取消确认']
      } else if (e.billStatus === 'bill_allot_status:2' || e.billStatus === 'bill_allot_status:3') {
        this.disContextMenu = ['编辑', '删除', '确认', '取消确认']
      } else if (e.billStatus === 'bill_allot_status:4') {
        this.disContextMenu = ['编辑', '删除', '确认']
      }
    },
    // 搜索框方法
    /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
    onReload () {
      this.seachValue = {}
    },
    /**
         * @name:功能按钮时的事件
         * @msg:
         * @param {type}
         * @return:
         */
    onSeachClick (e) {
      console.log(e)
      if (e === 'add') {
        this.addData(-1)
      } else if (e === 'edit') {

      } else if (e === 'del') {
        this.onDel(-1)
      } else if (e === 'export') {
        this.$refs.newTable.exportFile('DistributionBillAllotFind', this.seachValue)
      } else if (e === 'print') {

      }
    },
    /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
    onSeach (e) {
      e.path = 'DistributionBillAllotFind'
      this.$refs.newTable.setTableData(this.tableCode, e)
    },
    /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
    onSelectChange (keys, rows) {
      this.selectArr = rows
    },
    /**
         * @name: 表格右击删除
         * @msg:
         * @param {type}
         * @return:
         */
    deleteHandler (row) {
      this.onDel(row)
    },
    /**
         * @name: 表格右击审核
         * @msg:
         * @param {type}
         * @return:
         */
    auditHandler (e) {
      const that = this
      this.$confirm({
        title: '提示',
        content: '是否确认当前信息?',
        onOk () {
          axios({
            path: 'DistributionBillAllotsPurchaseConfirm',
            method: 'post',
            body: {
              id: e.id
            },
            headers: {}
          }).then(res => {
            if (res.flag === 1) {
              that.$refs.newTable.reload(that.tableCode, { path: that.tableApiPath })
            }
          })
        },
        onCancel () {}
      })
    },
    /**
         * @name: 删除方法
         * @msg:
         * @param {type}
         * @return:
         */
    onDel (e) {
      console.log(e)
      let arr = []
      if (e === -1) {
        if (this.selectArr.length === 0) {
          this.$message.warning('您尚未选中任何数据！')
          return
        }
        const statusArr = map(this.selectArr, 'status')
        for (const item in statusArr) {
          console.log(statusArr[item])
          if (statusArr[item] === 'bill_allot_status:2') {
            this.$message.warning('选中数据存在已审核数据，不可删除')
            return
          } else {
            arr = map(this.selectArr, 'id')
          }
        }
      } else {
        arr.push(e.id)
      }
      console.log('删除的数组', arr)
      const that = this
      this.$confirm({
        title: '提示',
        content: '删除后不可恢复，确定继续?',
        onOk () {
          axios({
            path: 'DistributionBillAllotDelete',
            method: 'post',
            body: {
              ids: arr
            },
            headers: {}
          }).then(res => {
            if (res.flag === 1) {
              that.$refs.newTable.del(arr, 'id')
            }
          })
        },
        onCancel () {}
      })
    },
    /**
         * @name: 控制新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
    addData (index) {
      if (index < 0) {
        this.title = '新增调拨单'
        console.log(this.EditModel, '新增')
        this.pamsCode = ''
      } else {
        console.log('编辑')
        this.pamsCode = index.code
        this.title = '编辑调拨单'
      }
      // 打开modal
      this.EditModel = true
    },
    /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
    signDtDisabledDate (e) {
      return moment(e).isAfter()
    },
    sumChangeM (a) {
      return `￥ ${a}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  watch: {
    EditModel (val) {
      if (!val) {
        this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
      }
    }
  }
}
</script>

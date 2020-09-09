<!--
 * @Description: 分销订单列表
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: haile
 * @Date: 2019-04-17 11:16:48
 * @LastEditTime: 2019-08-22 18:11:48
 -->
<template>
  <div class="distributionOrderList" :style="{height:windowHeight-150+'px'}">
    <SeachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <!-- 这里可以自定义组件没有提供的特殊按钮 -->
    </Seachbox>
    <!-- 数据表格 -->
    <div class="goods-list">
      <a-table
        :columns="notBillColumns"
        :dataSource="tableData"
        expandRowByClick
        :pagination="pagination"
        @change="handleTableChange"
        class="goods-i">
        <a-button slot="action" type="primary" slot-scope="record" @click.stop="addGoods(record)" size="small">详情</a-button>
        <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
          <a-table
            :columns="itemColumns"
            :pagination="false"
            :dataSource="record.wholesaleOrderDetailList"
            class="item-table">
          </a-table>
        </div>
      </a-table>
    </div>

    <bt-modal
      v-model="modalVisible"
      title="分销订单预览"
      :popconfirm="false"
      :orderId="goods.code"
      :tags="tags"
      :subBtn="false"
      class="model">

      <a-row class="doc">
        <a-col :sm="16" :md="8" :xl="5">
          下单时间：{{ goods.createTime }}
        </a-col>
      </a-row>
      <h4 class="baseInfo">基础信息</h4>
      <a-row class="doc">
        <a-col :sm="8" :md="4" :xl="3">客户名称：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ goods.customerCode + '-' + goods.customerName }}
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">经营类型：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ goods.wholesaleType === '0' ? '经销' : '代销' }}
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">提货方式：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ goods.takeType === 1 ? '客户自提' : '集中配送' }}
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">原单据：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          <!-- {{ goods.createTime }} -->
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">提货位置：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ goods.takeStoreCode+'-'+goods.takeStoreName }}
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">订单金额：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ goods.saleAmount?goods.saleAmount.toFixed(2):0 }}
        </a-col>
      </a-row>
      <h4 class="baseInfo">商品信息</h4>

      <a-table
        rowKey="bt_web_id"
        size="small"
        :columns="columns"
        :dataSource="goods.wholesaleOrderDetailList"
        :pagination="{defaultPageSize:5}"
        bordered
      >
      </a-table>
      <h4 class="baseInfo">落款信息</h4>
      <a-row class="doc textLenght">
        <a-col :sm="8" :md="4" :xl="3">下单人：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ `${goods.chargeByCode}${goods.chargeByName}` }}
        </a-col>
        <a-col :sm="8" :md="4" :xl="3">下单位置：</a-col>
        <a-col :sm="16" :md="8" :xl="5">
          {{ `${goods.saleStoreCode}-${goods.saleStoreName}` }}
        </a-col>
      </a-row>
      <a-row>
        <a-col :sm="8" :md="4" :xl="3">备注：</a-col>
        <a-col :sm="16" :md="20" :xl="21">
          {{ goods.note }}
        </a-col>
      </a-row>
    </bt-modal>
  </div>

</template>

<script>
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import moment from 'moment'
import { mapGetters } from 'vuex'
import BtModal from '@comp/Modal'
export default {
    name: 'DistributionOrderList',
    components: {
        SeachBox,
        BtModal
    },
    data: function () {
        return {
            notBillColumns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code' },
                { title: '单据状态', dataIndex: 'status', key: 'status' },
                { title: '客户编码/名称', dataIndex: 'customerCode', key: 'customerCode', customRender: (text, record, index) => `${record.customerCode + '-' + record.customerName}` },
                { title: '经营类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => record.wholesaleType === '0' ? '经销' : '代销' },
                { title: '提货方式', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => record.takeType === 1 ? '客户自提' : '集中配送' },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                // { title: '原单据号', dataIndex: 'receiveCustomerName', key: 'receiveCustomerName' },
                { title: '订单金额', dataIndex: 'saleAmount', key: 'saleAmount', customRender: (text, record, index) => record.saleAmount.toFixed(2) },
                { title: '下单时间', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => `${moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}` },
                { title: '下单人', dataIndex: 'chargeByCode', key: 'chargeByCode', customRender: (text, record, index) => `${record.chargeByCode}${record.chargeByName}` },
                { title: '下单位置', dataIndex: 'saleStoreCode', key: 'saleStoreCode', customRender: (text, record, index) => `${record.saleStoreCode}-${record.saleStoreName}` },
                { title: '备注', dataIndex: 'note', key: 'note' },
                {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            // 二级表格
            itemColumns: [

                { title: '商品编号', dataIndex: 'skuCode', key: 'skuCode' },
                { title: '商品名称', dataIndex: 'skuName', key: 'skuName' },
                { title: '规格型号', dataIndex: 'skuModel', key: 'skuModel' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '零售价', dataIndex: 'price', key: 'price', customRender: (text, record, index) => record.price.toFixed(2) },
                { title: '税率', dataIndex: 'taxRate', key: 'taxRate', customRender: (text, record, index) => (record.taxRate * 100).toFixed(2) + '%' },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '分销价(元)', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => record.billPrice.toFixed(2) },
                { title: '原分销价(元)', customRender: (text, record, index) => record.billPrice.toFixed(2) },
                { title: '金额(元)', customRender: (text, record, index) => this.$math.mul(record.billPrice, record.billQuantity, 2) },
                // { title: '源单号', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '备注', dataIndex: 'note', key: 'note' }
            ],
            columns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: 'sku编号', dataIndex: 'skuCode', key: 'skuCode' },
                { title: 'sku名称', dataIndex: 'skuName', key: 'skuName' },
                { title: '规格型号', dataIndex: 'skuModel', key: 'skuModel' },
                { title: '单位', dataIndex: 'unit', key: 'unit' },
                { title: '零售价', dataIndex: 'price', key: 'price', customRender: (text, record, index) => record.price.toFixed(2) },
                { title: '税率', dataIndex: 'taxRate', key: 'taxRate', customRender: (text, record, index) => (record.taxRate * 100).toFixed(2) + '%' },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '政策', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '分销价(元)', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => record.billPrice.toFixed(2) },
                { title: '原分销价(元)', customRender: (text, record, index) => record.billPrice.toFixed(2) },
                { title: '金额(元)', customRender: (text, record, index) => this.$math.mul(record.billPrice, record.billQuantity, 2) },
                // { title: '源单号', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '备注', dataIndex: 'note', key: 'note' }
            ],
            tableData: [],
            pagination: {
                current: 1,
                pageSize: 20,
                total: 0,
                showSizeChanger: true,
                showQuickJumper: true
            },
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
                    title: '订单号'
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
                            code: '0',
                            name: '未提交'
                        },
                        {
                            code: '1',
                            name: '已提交'
                        },
                        {
                            code: '2',
                            name: '已开票'
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
                }

            ],
            btns: [],
            seachValue: {
                searchParam: '',
                code: '',
                status: '0',
                takeStoreCode: '',
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            disContextMenu: [],
            tableIdsArr: [],
            tableRowsArr: [],
            tableSingleData: {},
            modalVisible: false,
            orderId: '',
            goods: {},
            tags: []
        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo', 'windowHeight'])
    },
    mounted () {
        this.seachValue.startTime = moment(this.seachValue.startTime).format('YYYY-MM-DD')
        this.seachValue.endTime = moment(this.seachValue.endTime).format('YYYY-MM-DD')
        this.findWholesaleOrderPageList()
    },
    methods: {
        handleTableChange (pagination, filters, sorter) {
            console.log(pagination)
            this.pagination.pageSize = pagination.pageSize
            this.pagination.current = pagination.current
            this.findWholesaleOrderPageList()
        },
        findWholesaleOrderPageList () {
            const data = {
                createBy: this.userInfo.code,
                saleStoreCode: this.storeInfo.code,
                status: this.seachValue.status,
                searchParam: this.seachValue.searchParam,
                startTime: this.seachValue.startTime,
                code: this.seachValue.code,
                endTime: this.seachValue.endTime,
                page: this.pagination.current,
                rows: this.pagination.pageSize
            }
            console.log(data)

            axios({
                path: 'DistWholesaleOrderFindWholesaleOrderPageList',
                method: 'post',
                body: data
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.tableData = res.data.list
                        if (this.tableData) {
                            this.tableData.forEach(el => {
                                const wholesaleOrderDetailList = []

                                el.wholesaleGoodList.forEach(item => {
                                    wholesaleOrderDetailList.push(...item.wholesaleOrderDetailList)
                                })
                                el.wholesaleOrderDetailList = wholesaleOrderDetailList
                            })
                            this.pagination.total = res.data.total
                        }
                    }
                }
            })
        },
        // POST DistWholesaleOrderFindWholesaleOrderPageList
        // POST DistWholesaleBillFindWholesaleBillPageList
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            console.log(e)
            this.seachValue = e
            this.findWholesaleOrderPageList()
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
            if (e === 'export') {
                this.$refs.newTable.exportFile('CouponsBalanceQueryCoupons')
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
        addGoods (good) {
            console.log(good)

            this.goods = good
            // console.log(good.status)

            this.modalVisible = true
            this.tags = []
            if (good.status === '未提交') {
                this.tags.push('notsubmitted')
            } else if (good.status === '已提交') {
                this.tags.push('submit')
            } else if (good.status === '已开票') {
                this.tags.push('invoice')
            }

            console.log(this.tags)
        }
    }
}
</script>

<style scoped lang="less">
.distributionOrderList{
    overflow: auto;
    .goods-list{
        margin: 0;
        padding: 0;
        margin-top: 10px;
        background-color: #fff;
        /deep/ .ant-table-row-expand-icon-cell,/deep/ .ant-table-expand-icon-th{
            display: none;
        }
        /deep/ .ant-table-expanded-row{
            >td:first-child{
                display: none;
            }
            >td{
                padding: 0;
            }

        }
        /deep/ .ant-table-pagination.ant-pagination{
            display: block;
            float: none;
            text-align: center
        }

    }
}
.model{
    /deep/ .button-box {
        /deep/ .ant-btn-primary {
            display: none !important;
        }
    }
}
</style>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .textLenght {
        textarea {
            resize: none;
        }
    }
</style>

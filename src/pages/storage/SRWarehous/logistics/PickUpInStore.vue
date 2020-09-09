<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-22 09:35:01
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-07 10:36:36
 -->
<!-- 自提入库 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" size="small" v-action:add style="margin-right: 10px" @click="onScanCode">扫码入库</a-button>
      <a-button type="primary" size="small" v-action:add @click="deliveryStorage">入库</a-button>
    </seachBox>
    <!-- 表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onChangeTable">
    </NewTable>
    <a-modal
      v-model="scanVisible"
      title="扫码入库"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="1200"
      class="doc"
      :bodyStyle="{height:'600px',width:'1200px'}"
      destroyOnClose
      centered>
      <div>
        <a-input-search
          placeholder="请输入司机编号/司机名称/送货单号/商品编码"
          style="width: 100%"
          v-model="bills"
          v-focus="true"
          autoFocus
          :disabled="disabled"
          @keyup.enter="KeyUpEnter"
          @blur="blur"
          ref="btInput"
        />
      </div>
      <div class="tabBox">
        <div class="tabHead">{{ panes.customerCode }}</div>
        <div class="tabTable" v-for="(item, index) in panes.delivers" :key="index">
          <div class="tabLeft">
            <div>
              <span class="tabName">{{ item.skuName }}</span>
              <span class="tabName">{{ item.skuCode }}</span>
              <span class="tabName">{{ item.skuModel }}</span>
            </div>
            <div style="margin-top: 5px">
              <span class="tabName">数量: {{ item.quantity }}</span>
            </div>
          </div>
          <div class="tabLeft">
            <div>
              <span class="tabName">销售单号: {{ item.sourceCode }}</span>
            </div>
            <div style="margin: 5px 10px">
              备注: {{ item.note }}
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <a-button size="small" @click="scanVisible=false">取消</a-button>
        <a-button type="primary" size="small" @click="deliveryStorage(1)">确定</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import getStatus from '@comp/statusAll/getStatus'
import { axios } from '@/utils/request'
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import moment from 'moment'
export default {
    name: 'ChangingOrRefunding',
    components: { seachBox, NewTable, getStatus, detailsPreview },
    data () {
        return {
            previewVisbel: false,
            pams: {},
            detailsTitle: '现场提货退库入库详情',
            bills: null,
            driverChange: null,
            disabled: false,
            panes: {},
            scanVisible: false,
            deleteAll: [],
            // 接口
            tableApiPath: '',
            // 表头id
            tableCode: '',
            seachValue: {},
            btns: ['export', 'print'],
            MenuOperations: [
                {
                    name: '预览',
                    action: 'LogisticsWarehousing.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            conditions: [
                {
                    title: '退货申请开始时间',
                    key: 'startTime',
                    type: 'date'
                },
                {
                    title: '退货申请结束时间',
                    key: 'endTime',
                    type: 'date'
                },
                {
                    title: '状态',
                    type: 'select',
                    key: 'status',
                    label: 'name',
                    value: 'value',
                    selectDataArr: [
                        { value: '1', label: '未入库' },
                        { value: '2', label: '已入库' }
                    ]
                },
                {
                    title: '单据号',
                    type: 'input',
                    key: 'sourceCodeSearch',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '出货位置',
                    key: 'storeCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    title: '顾客',
                    type: 'input',
                    key: 'customerSearch',
                    label: 'value',
                    value: 'code',
                    filter: true
                }
            ]
        }
    },
    directives: {
        focus: {
            inserted (el) {
                el.focus()
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'c003d8f92b4f486fbf62edabfd1e02c8:LogisticsWarehousing'
            this.tableApiPath = 'MarkePickFindSceneIn'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.onStatus()
        this.seachValue = {
            storeCode: this.$store.getters.storeInfo.code,
            startTime: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment().format('YYYY-MM-DD HH:mm:ss')
        }
    },
    methods: {
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '单号', code: e.code },
                { name: '入货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '申请退货时间', code: e.sendTime },
                { name: '申请原因', code: e.applyReason },
                { name: '问题描述', code: e.applyDescription }
            ]
            this.previewVisbel = true
        },
        blur () {
            this.$refs.btInput.focus()
            // document.getElementsByClassName('ant-input')[0].focus()
        },
        /**
         * @name:入库
         */
        deliveryStorage (num) {
            const err = []
            let delivers = []
            if (num !== 1) {
                if (this.deleteAll.length > 0) {
                    for (const i of this.deleteAll) {
                        if (i.status !== 2) {
                            err.push(i)
                        }
                    }
                } else {
                    return this.$message.warning('请选择单据!')
                }
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.code}单据状态:${i.statusName},无法操作入库!`
                    })
                }
            } else {
                if (num !== 1) {
                    delivers = this.deleteAll
                } else {
                    delivers = this.panes.delivers
                }
                const that = this
                this.$confirm({
                    title: '入库确认',
                    content: '是否确认入库?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'MarkePickUpdateSceneIn',
                            method: 'post',
                            body: { applyOutPuts: delivers }
                        }).then(res => {
                            that.bills = ''
                            if (res.flag === 1) {
                                that.getDate()
                                that.panes = {}
                            }
                        })
                    }
                })
            }
        },
        /**
         * @name: 扫码
         */
        async KeyUpEnter (e) {
            const str = e.target.value
            if (str === '') { return this.$message.warning('当前扫码输入为空!') }
            if (Object.prototype.toString.call(str) !== '[object String]') { return this.$message.warning('扫码格式错误!') }
            const res = await axios({
                path: 'MarkePickFindSceneIn',
                mounted: 'path',
                body: {
                    codeOrPayNum: str
                }
            })
            if (res.flag === 1) {
                if (res.data.list.length === 0) {
                    this.$message.warning('未查到当前扫描信息!')
                } else {
                    const data = res.data.list
                    if (Object.keys(this.panes).length === 0) {
                        this.panes = {
                            customerCode: `${data[0].customerCode}:${data[0].customerName}`,
                            delivers: []
                        }
                        const list = []
                        for (const i of data) {
                            list.push({
                                code: i.code,
                                skuCode: i.skuCode,
                                skuName: i.skuName,
                                skuModel: i.skuModel,
                                sourceCode: i.sourceCode,
                                quantity: i.quantity,
                                note: i.note
                            })
                        }
                        this.panes.delivers = [...list]
                    } else {
                        this.$message.warning('当前存在待入库信息,请先确认或取消!')
                    }
                }
            }
        },

        /**
         * @name:点击扫码入库
         */
        onScanCode () {
            // this.panes = {}
            this.scanVisible = true
        },
        /**
         * @name: 单独入库
         */
        onAloneStorage (e) {
            if (e.skuScanNum < e.skuNum) {
                this.$message.warning('当前确认入库数量异常,请确认后提交!')
                return
            }
            const deliverList = [e]
            axios({
                path: 'DeliverStockUpdateStockIn',
                method: 'post',
                body: {
                    changeType: 1,
                    delivers: deliverList
                }
            }).then(res => {
                if (res.flag === 1) {
                    const list = this.panes.filter(i => i.driverCode === this.driverChange)
                    list[0].delivers.splice(e, 1)
                    this.getDate()
                }
            })
        },
        /**
         * @name:选项卡
         */
        callback (e) {
            this.driverChange = e
            console.log(e, '选择司机')
        },
        onStatus () {
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    console.log(data, '出货')
                    this.$set(this.conditions[4], 'selectDataArr', data)
                }
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
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('MarkePickFindSceneIn', this.seachValue)
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
                this.deleteAll.push(i)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {
                storeCode: this.$store.getters.storeInfo.code,
                billType: 'bill_deliver_sale_type:3,bill_deliver_sale_type:4',
                status: '1'
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, this.conditions[2], '点击搜索')
            e.path = 'MarkePickFindSceneIn'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('16c88e98322547deb1218df075c61af4:LogisticsWarehousing', { path: 'MarkePickFindSceneIn' })
        }
    }
}
</script>
<style lang="less">
.tabBox {
    height: 470px;
    .ant-tabs-content {
        height: 470px;
        padding: 5px;
        border: 1px solid #ccc;
        overflow-y: auto;
    }
    .tabHead {
        width: 100%;
        height: 40px;
        padding-left:20px;
        line-height: 40px;
    }
}
.tabTable {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    border: 1px solid #ccc;
    .tabLeft {
        width: 50%;
        padding: 10px 10px;
        border-right: 1px solid #ccc;
        .tabName {
            margin: 5px 10px;
            display: inline;
        }
    }

}
</style>

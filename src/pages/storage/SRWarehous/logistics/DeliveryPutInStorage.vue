<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-22 09:31:55
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-23 14:24:05
 -->
<!-- 送货入库 -->
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
          ref="btInput"
          style="width: 100%"
          v-model="bills"
          v-focus="true"
          autoFocus
          :readonly="readonly"
          @keyup.enter="KeyUpEnter"
          @blur="blur"
          @compositionstart="onInputMethod"
        />
      </div>
      <div class="tabBox">
        <a-tabs @change="callback" type="card" v-model="activeKey">
          <a-tab-pane v-for="pane in panes" :tab="pane.driverName" :key="pane.driverCode">
            <div class="tabTable" v-for="(item, index) in pane.delivers" :key="index">
              <div class="tabLeft">
                <div>
                  <span class="tabName">{{ item.skuName }}</span>
                  <span class="tabName">{{ item.skuCode }}</span>
                  <span class="tabName">{{ item.skuModel }}</span>
                </div>
                <div style="margin-top: 5px">
                  <span class="tabName">数量: {{ item.skuNum }}</span>
                  <span class="tabName">
                    扫描数量: {{ item.skuScanNum }}
                    <!-- <a-input-number size="small" :min="0" :max="item.skuNum" v-model="item.skuScanNum" /> -->
                  </span>
                </div>
              </div>
              <div class="tabLeft">
                <div>
                  <span class="tabName">送货单号: {{ item.code }}</span>
                  <span class="tabName">预约送货时间: {{ item.sendTime }}</span>
                </div>
                <div style="margin: 5px 10px">
                  备注: {{ item.keepNote }}
                </div>
              </div>
              <div class="tabRight">
                <a-button type="primary" size="small" style="margin-right: 10px" @click="onAloneStorage(item)">确认入库</a-button>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div slot="footer">
        <a-button size="small" @click="scanVisible=false">取消</a-button>
        <a-button type="primary" size="small" @click="onDriverStorage">确定</a-button>
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
    name: 'DeliveryPutInStorage',
    components: { seachBox, NewTable, getStatus, detailsPreview },
    data () {
        return {
            previewVisbel: false,
            pams: {},
            detailsTitle: '送货入库详情',
            readonly: false,
            activeKey: null,
            setTime: moment().get('second'),
            bills: null,
            driverChange: null,
            disabled: false,
            panes: [],
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
                    title: '预约送货开始时间',
                    key: 'sendTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '预约送货结束时间',
                    key: 'sendEndTime',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '状态',
                    type: 'select',
                    key: 'status',
                    label: 'name',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '单据号',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '单据来源',
                    type: 'select',
                    key: 'billType',
                    label: 'name',
                    value: 'value',
                    filter: true,
                    selectDataArr: []
                },
                {
                    title: '提货位置',
                    key: 'pickStoreCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    title: '收货方',
                    type: 'input',
                    key: 'custCode',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '司机',
                    key: 'driverCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'PermissionsUserFindOption',
                    body: {
                        type: 'sys_user_type:2'
                    }
                },
                {
                    title: '商品',
                    type: 'input',
                    key: 'skuCode',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '品牌',
                    type: 'input',
                    key: 'brandCode',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '品类',
                    key: 'classCode',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    path: 'GoodsCategoryFindTreeOption'
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
            this.tableCode = '2b4280f3e4e741a1a2878ff4b40af5fc:LogisticsWarehousing'
            this.tableApiPath = 'DeliverStockFindStockIn'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.onStatus()
        this.seachValue = {
            pickStoreCode: this.$store.getters.storeInfo.code,
            billType: 'bill_deliver_sale_type:3,bill_deliver_sale_type:4',
            status: 'bill_deliver_status:5',
            sendTime: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            sendEndTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
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
                { name: '退货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '预约取货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        onInputMethod () {
            this.readonly = true
            this.$message.warning('扫码输入暂不支持中文输入，请切换英文输入！')
            console.log('这是什么输入法?')
        },
        blur () {
            this.$refs.btInput.focus()
        },
        /**
         * @name:入库
         */
        deliveryStorage () {
            const err = []
            if (this.deleteAll.length > 0) {
                for (const i of this.deleteAll) {
                    if (i.status !== 'bill_deliver_status:5') {
                        err.push(i)
                    }
                }
            } else {
                return this.$message.warning('请选择单据!')
            }
            if (err.length > 0) {
                for (const i of err) {
                    this.$notification.error({
                        message: '提示',
                        description: `${i.code}单据状态:${i.statusName},无法操作入库!`
                    })
                }
            } else {
                const delivers = []
                this.deleteAll.forEach(i => {
                    const obj = { id: i.id }
                    delivers.push(obj)
                })
                const that = this
                this.$confirm({
                    title: '入库确认',
                    content: '是否确认入库?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'DeliverStockUpdateStockIn',
                            method: 'post',
                            body: { delivers: delivers }
                        }).then(res => {
                            if (res.flag === 1) {
                                that.getDate()
                            }
                        })
                    }
                })
            }
        },
        isJSON (str) {
            if (typeof str === 'string') {
                try {
                    const obj = JSON.parse(str)
                    if (typeof obj === 'object' && obj) { return true } else { return false }
                } catch (e) {
                    return false
                }
            }
        },
        /**
         * @name: 获取入库数据
         */
        gainStorage (e, type) {
            axios({
                path: 'DeliverStockFindStockInScan',
                method: 'post',
                body: {
                    scandy: e
                }
            }).then(res => {
                this.bills = null
                this.disabled = false
                if (res.flag === 1) {
                    const data = res.data
                    if (data.length === 0) { return this.$message.warning('未查到信息!') }
                    if (this.panes.length === 0) {
                        this.panes = [...data]
                        this.activeKey = data[0].driverCode
                        return
                    }
                    if (type === 'user') { // 查询司机
                        this.panes.push(...data)
                        this.activeKey = e
                    } else if (type === 'order') { // 操作单号
                        // 找到当前选中司机, 添加单据
                        if (data[0].driverCode !== this.activeKey) {
                            return this.$message.warning('当前司机不存在该单据!')
                        }
                        for (const i of this.panes) {
                            if (i.driverCode === this.activeKey) {
                                i.delivers.push(...data[0].delivers)
                            }
                        }
                    } else if (type === 'goods') {
                        this.onSkuCode(this.panes, data)
                    }
                }
            })
        },
        /**
         * @name: 扫码
         */
        KeyUpEnter (e) {
            const str = e.target.value
            this.readonly = false
            this.bills = null
            if (this.isJSON(str)) {
                const obj = JSON.parse(str)
                console.log(obj, Object.keys(obj), '获取输入')
                // 无单据, 无司机直接获取接口数据
                if (this.panes.length === 0) {
                    if (Object.keys(obj).includes('erpcode')) { // 判断输入是司机 / 单号
                        this.gainStorage(obj.erpcode, obj.type)
                    } else {
                        obj.code = obj.code.toUpperCase()
                        this.gainStorage(obj.code, obj.type)
                    }
                    return
                }
                if (obj.type === 'user') { // 输入司机
                    console.log('司机')
                    const driver = this.panes.filter(i => i.driverCode === obj.erpcode)
                    if (driver.length > 0) {
                        this.disabled = false
                        this.bills = null
                        this.$message.warning('当前扫描司机已存在,请重新扫描!')
                    } else {
                        this.gainStorage(obj.erpcode, obj.type)
                    }
                } else if (obj.type === 'order') {
                    obj.code = obj.code.toUpperCase()
                    console.log('送货单号')
                    const driver = this.panes.filter(i => i.driverCode === this.activeKey)
                    // 获取当前选中司机数据, 判断当前司机下是否已存在该单据/ 如果存在不获取数据
                    // 查询当前输入,
                    const data = driver[0].delivers.filter(i => i.code === obj.code)
                    // 判断当前输入是否已存在, 如果存在提示, 不存在走接口
                    if (data.length > 0) {
                        this.disabled = false
                        this.bills = null
                        this.$message.warning('该司机已存在当前扫描单据, 请重新扫描!')
                    } else {
                        this.gainStorage(obj.code, obj.type)
                    }
                }
            } else if (typeof Number(str) === 'number') {
                // 没有司机存在先输入司机
                if (this.panes.length === 0) {
                    this.$message.warning('请先选中司机!')
                } else {
                    axios({
                        path: 'GoodsBarcodeFindSkuByBarcode',
                        method: 'post',
                        body: {
                            barcode: str
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res, '商品')
                            this.onSkuCode(res.data.code)
                        } else {
                            this.$message.warning('未查到SKU商品!')
                        }
                    })
                }
            } else {
                this.bills = null
                this.disabled = false
                this.$message.warning('输入有误!')
            }
        },
        /**
         * @name: 判断商品条码
         */
        onSkuCode (code) {
            for (const i of this.panes) {
                if (i.driverCode === this.activeKey) {
                    for (const o of i.delivers) {
                        if (o.skuCode === code && o.skuNum > o.skuScanNum) {
                            o.skuScanNum = Number(o.skuScanNum) + 1
                            // this.defaultActiveKey = i.driverCode
                            this.$notification.error({
                                message: '提示',
                                description: `${o.code}单据内${o.skuName}商品添加成功!`
                            })
                            break
                        }
                    }
                }
            }
        },

        /**
         * @name:点击扫码入库
         */
        onScanCode () {
            this.panes = []
            this.scanVisible = true
        },
        /**
         * @name: 扫码查询
         */
        onSearch (e) {

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
                    for (const i of this.panes) {
                        if (i.driverCode === this.activeKey) {
                            this.panes.splice(i, 1)
                        }
                    }
                }
            })
        },
        /**
         * @name: 扫码入库提交
         */
        onDriverStorage () {
            const list = this.panes.filter(i => i.driverCode === this.activeKey)
            let errList = []
            let deliverList = []
            console.log(list, '获取当前司机')
            if (list.length === 1) {
                deliverList = list[0].delivers
                errList = deliverList.filter(i => i.skuNum !== i.skuScanNum)
                console.log(errList, '存在差异数据!')
            }
            if (errList.length > 0) {
                const err = []
                for (const i of errList) {
                    err.push(i.code)
                }
                this.$notification.error({
                    message: '提示',
                    description: `送货单${err.join('，')}扫描入库商品数量异常,无法入库!`
                })
            } else {
                axios({
                    path: 'DeliverStockUpdateStockIn',
                    method: 'post',
                    body: {
                        changeType: 1,
                        delivers: deliverList
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        for (const i of this.panes) {
                            if (i.driverCode === this.activeKey) {
                                this.panes.splice(i, 1)
                            }
                        }
                    }
                })
            }
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
                path: 'DeliverStockGetOption',
                method: 'past',
                body: {
                    status: 'bill_deliver_status:5,bill_deliver_status:6'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.name = i.value
                        i.title = i.value
                        i.value = i.type
                        i.key = i.type
                    })
                    console.log(data, '获取状态')
                    this.$set(this.conditions[2], 'selectDataArr', data)
                }
            })
            axios({
                path: 'DeliverStockGetTypeOption',
                method: 'post',
                body: {
                    billType: 'bill_deliver_sale_type:3,bill_deliver_sale_type:4'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.name = i.value
                        i.title = i.value
                        i.key = i.type
                        i.value = i.type
                    })
                    console.log(data, '单据来源')
                    this.$set(this.conditions[4], 'selectDataArr', data)
                }
            })
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
                    console.log(data, '提货')
                    this.$set(this.conditions[5], 'selectDataArr', data)
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
                this.$refs.newTable.exportFile('DeliverStockFindStockIn', this.seachValue)
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
            }
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            console.log(e, this.conditions[2], '点击搜索')
            e.path = 'DeliverStockFindStockIn'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('1b3a5a3a1d574d06b33e7d92b1d8bcbd:LogisticsWarehousing', { path: 'DeliverStockFindStockIn' })
        }
    }
}
</script>
<style lang="less">
.tabBox {
    .ant-tabs-content {
    height: 470px;
    padding: 5px;
    border: 1px solid #ccc;
    overflow-y: auto;
    }
}
.tabTable {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    border: 1px solid #ccc;
.tabLeft {
    width: 550px;
    padding: 10px 10px;
    border-right: 1px solid #ccc;
    .tabName {
        margin: 5px 10px;
        display: inline;
    }
}
    .tabRight {
        width: 100px;
        padding: 0 14px;
        line-height: 80px;
    }
}
</style>

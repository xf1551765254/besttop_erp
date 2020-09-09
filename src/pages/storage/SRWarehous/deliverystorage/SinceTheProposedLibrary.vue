<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-07-22 09:31:55
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-23 13:10:02
 -->
<!-- 自提出库 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" size="small" v-action:add style="margin-right: 10px" @click="onScanCode">扫码出库</a-button>
      <a-button type="primary" size="small" v-action:add @click="deliveryStorage">出库</a-button>
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
      title="扫码出库"
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
          @keyup.enter="KeyUpEnter"
          @blur="blur"
          ref="btInput"
        />
      </div>
      <div class="tabBox">
        <div class="tabHead">{{ panes.customerCode }}</div>
        <nav>
          <div class="tabTable" v-for="(item, index) in panes.delivers" :key="index">
            <div class="tabLeft">
              <div>
                <span class="tabName">{{ item.skuName }}</span>
                <span class="tabName">{{ item.skuCode }}</span>
                <span class="tabName">{{ item.skuModel }}</span>
              </div>
              <div style="margin-top: 5px">
                <span class="tabName">数量: {{ item.skuQuantity }}</span>
              </div>
            </div>
            <div class="tabLeft">
              <div>
                <span class="tabName">销售单号: {{ item.code }}</span>
              </div>
              <div style="margin: 5px 10px">
                备注: {{ item.note }}
              </div>
            </div>
          </div>
        </nav>
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
    name: 'SinceTheProposedLibrary',
    components: { seachBox, NewTable, getStatus, detailsPreview },
    data () {
        return {
            previewVisbel: false,
            pams: {},
            detailsTitle: '现场提货出库入库详情',
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
                // {
                //     name: '预览',
                //     action: 'OutboundLogistics.get',
                //     fc: row => {
                //         this.detailsSumbit(row)
                //     }
                // },
                {
                    name: '详情',
                    action: 'OutboundLogistics.get',
                    fc: e => this.$refs.newTable.showDetails('现场提货详情', e)
                }
            ],
            conditions: [
                {
                    title: '起始销售时间',
                    key: 'startTime',
                    type: 'date'
                },
                {
                    title: '结束销售时间',
                    key: 'endTime',
                    type: 'date'
                },
                {
                    title: '状态',
                    type: 'select',
                    key: 'ifOutOf',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: '0', label: '未出库' },
                        { value: '1', label: '已出库' }
                    ]
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
                    key: 'customerCode',
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
            this.tableCode = '5e8086677ddb4c87860685e0f91d53bc:SinceTheProposedLibrary'
            this.tableApiPath = 'MarkePickFindSceneOut'
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
                { name: '出货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '销售时间', code: e.updateTime }
            ]
            this.previewVisbel = true
        },
        blur () {
            this.$refs.btInput.focus()
        },
        /**
         * @name:出库
         */
        deliveryStorage (num) {
            const err = []
            let delivers = []
            if (num !== 1) {
                if (this.deleteAll.length > 0) {
                    for (const i of this.deleteAll) {
                        if (i.ifOutOf !== 0) {
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
                        description: `${i.code}单据状态:${i.ifOutOfName},无法操作出库!`
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
                    title: '出库确认',
                    content: '是否确认出库?',
                    okText: '是',
                    cancelText: '否',
                    onOk () {
                        axios({
                            path: 'MarkePickUpdateSceneOut',
                            method: 'post',
                            body: { refundList: delivers }
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
                path: 'MarkePickFindSceneOut',
                mounted: 'past',
                body: {
                    totallyCode: str
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
                                pickStoreCode: i.pickStoreCode,
                                skuCode: i.skuCode,
                                skuName: i.skuName,
                                skuModel: i.skuModel,
                                code: i.code,
                                skuQuantity: i.skuQuantity,
                                note: i.note
                            })
                        }
                        this.panes.delivers = [...list]
                    } else {
                        this.$message.warning('当前存在待出库信息,请先确认或取消!')
                    }
                }
            }
        },

        /**
         * @name:点击扫码入库
         */
        onScanCode () {
            this.panes = {}
            this.scanVisible = true
        },
        /**
                       * @name: 单独出库
                       */
        onAloneStorage (e) {
            if (e.skuScanNum < e.skuNum) {
                this.$message.warning('当前确认入库数量异常,请确认后提交!')
                return
            }
            const deliverList = [e]
            axios({
                path: 'DistributionReturnsUpdateStockOut',
                method: 'post',
                body: {
                    changeType: 1,
                    billReturnsList: deliverList
                }
            }).then(res => {
                if (res.flag === 1) {
                    for (const i of this.panes) {
                        if (i.driverCode === this.driverChange) {
                            this.panes.splice(i, 1)
                        }
                    }
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
                    console.log(data, '提货')
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
                this.$refs.newTable.exportFile('MarkePickFindSceneOut', this.seachValue)
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
            // for (const i of rows) {
            //     this.deleteAll.push(i)
            // }
            this.deleteAll = [...rows]
            console.log(this.deleteAll, '多选')
        },
        /**
                       * @name: 清空搜索
                       */
        onReload () {
            this.seachValue = {}
        },
        /**
                       * @name:获取搜索框数据
                       */
        onSeach (e) {
            console.log(e, this.conditions[2], '点击搜索')
            e.path = 'MarkePickFindSceneOut'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
                       * @name: 刷新表格
                       */
        getDate () {
            this.$refs.newTable.setTableData('c205648a158f4b07a0ab09b2fe55fc4e:SinceTheProposedLibrary', { path: 'MarkePickFindSceneOut' })
        }
    }
}
</script>
<style lang="less">
.tabBox {
    height: 470px;
    nav {
        height: 500px;
        width: 100%;
        overflow-y: auto;
        border: 1px solid #ccc;
        padding: 5px;
        .tabTable {
            width: 100%;
            height: 80px;
            display: flex;
            justify-content: center;
            border: 1px solid #ccc;
            margin-bottom: 5px;
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
    }
    .tabHead {
        width: 100%;
        height: 40px;
        padding-left:20px;
        line-height: 40px;
        font-size: 16px;
        font-weight: 700;
    }
}

</style>

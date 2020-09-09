<!--
 * @Description: ERP
 * @Version: V0.0.10
 * @Company: BestTop
 * @Author: shuai
 * @Date: 2019-07-29 19:38:14
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-22 19:49:58
 -->
<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-07-24 12:16:04
 -->
<template>
  <div>
    <div style="margin:10px 0px">
      <a-button
        class="billType"
        v-for="(item, index) in billTypeList"
        :key="index"
        @click="billTypeChange(item)"
        :style="{background: item.backColor, color: item.color}"
      >{{ item.name }}({{ item.am }})
      </a-button>
    </div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button v-action:add style="margin-left:10px;" type="primary" size="small" @click="notOnSignForSelect(-1)">无验证码签收</a-button>
    </seachBox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelectChange"
      :tableApiPath="tableApiPath">
    </NewTable>
    <!-- 确认签收 -->
    <a-modal
      v-model="signForVisible"
      title="确认签收"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="300"
      class="doc"
      :bodyStyle="{width:'400px'}"
      destroyOnClose
      centered>
      <h3>是否确认签收?</h3>
      <div v-if="verification">
        验证码:
        <a-input v-model="verificationCode" placeholder="请输入验证码" style="width: 100%"/>
      </div>
      <div slot="footer">
        <a-button @click="() => signForVisible = false" size="small" >取消</a-button>
        <a-button @click="signForSelect" type="primary" size="small" >确定</a-button>
      </div>
    </a-modal>
    <detailsPreview v-model="previewVisbel" :title="detailsTitle" :pams="pams" />
  </div>
</template>
<style lang="less">
.billType {
    margin: 0 10px;
}
</style>
<script>
import detailsPreview from '@pages/storage/LogisticsDistributionManagement/preview/detailsPreview'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import map from 'lodash.map'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
export default {
    name: 'AffirmSignInManage',
    components: {
        SeachBox,
        NewTable,
        detailsPreview
    },
    data () {
        return {
            pams: {},
            detailsTitle: '确认签收详情',
            previewVisbel: false,
            // title按钮
            billTypeList: [
                {
                    name: '全部',
                    am: 0,
                    billType: '',
                    backColor: '#1890ff',
                    color: '#fff'
                },
                {
                    name: '零售',
                    am: 0,
                    billType: 'bill_deliver_sale_type:1',
                    color: '#606266'
                },
                {
                    name: '分销',
                    am: 0,
                    billType: 'bill_deliver_sale_type:2',
                    color: '#606266'
                },
                // {
                //     name: '内部调拨',
                //     am: 0,
                //     billType: 'bill_deliver_sale_type:3',
                //     color: '#606266'
                // },
                {
                    name: '第三方派单',
                    am: 0,
                    billType: 'bill_deliver_sale_type:4',
                    color: '#606266'
                }
            ],
            billTypeBtn: '',
            // 工具栏
            conditions: [
                {
                    key: 'dateType',
                    type: 'select',
                    title: '时间类型',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 0, label: '销售日期' },
                        { value: 1, label: '预约送货时间' }
                    ]
                },
                {
                    title: '开始时间',
                    key: 'saleDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '结束时间',
                    key: 'saleAsDate',
                    type: 'date',
                    mat: 'YYYY-MM-DD HH:mm:ss'
                },
                {
                    title: '综合查询',
                    type: 'input',
                    key: 'condy',
                    label: 'value',
                    value: 'code',
                    filter: true
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
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'label',
                    value: 'value',
                    selectDataArr: [
                        { value: 'bill_deliver_status:5', label: '配送在途' },
                        { value: 'bill_deliver_status:6', label: '配送完成' }
                    ]
                },
                {
                    title: '线路',
                    key: 'route',
                    type: 'select',
                    filter: true,
                    label: ['code', 'name'],
                    value: 'code',
                    selectDataArr: []
                }
            ],
            btns: ['del', 'export', 'print'],
            seachValue: {
                saleDate: moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                saleAsDate: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                dateType: 1,
                status: 'bill_deliver_status:5'
            },
            // 主表
            tableCode: '6785eb2b051647f4885c8a4d5c916b38:AffirmSignInManage',
            tableApiPath: 'DeliverDivisionFindToSign',
            disContextMenu: [],
            selectArr: [],
            // 右键菜单
            rightMenu: [
                {
                    name: '确认签收',
                    action: 'AffirmSignInManage.add',
                    fc: this.onSignForSelect
                },
                {
                    name: '预览',
                    action: 'AffirmSignInManage.get',
                    fc: row => {
                        this.detailsSumbit(row)
                    }
                }
            ],
            // 确认签收
            cancelId: '',
            signForVisible: false,
            verification: false,
            verificationCode: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableCode = '6785eb2b051647f4885c8a4d5c916b38:AffirmSignInManage'
            // this.tableApiPath = 'DeliverDivisionFindToSign'
            this.$refs.newTable.setTableColumns(this.tableCode)
            this.$refs.newTable.setContextmenu(this.rightMenu)
            this.onSeach(this.seachValue)
        })
    },
    methods: {
        /**
         * @name: 详情
         */
        detailsSumbit (e) {
            console.log(e, '详情')
            this.pams = { ...e }
            this.pams.list = [ // 单据信息
                { name: '送货单号', code: e.code },
                { name: '提货位置', code: `${e.pickStoreCode}:${e.pickStoreName}` },
                { name: '源销售单号', code: e.sourceCode },
                { name: '原送货单号', code: e.deliverCode },
                { name: '送货单来源', code: e.billTypeName },
                { name: '预约送货时间', code: e.sendTime },
                { name: '打印次数', code: e.printCount }
            ]
            this.previewVisbel = true
        },
        notOnSignForSelect () {
            const arr = map(this.selectArr, 'id')
            const that = this
            this.$confirm({
                title: '提示',
                content: '是否进行无验证码签收?',
                onOk () {
                    axios({
                        path: 'BillDeliverUpdateCodelessSign',
                        method: 'post',
                        body: {
                            ids: arr
                        },
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            that.onSeach(that.seachValue)
                        }
                    })
                },
                onCancel () {}
            })
        },
        signForSelect () {
            if (this.verification) {
                if (!this.verificationCode) { return this.$message.error('请输入验证码!') }
            }
            axios({
                path: 'BillDeliverUpdateConfirmSign',
                method: 'post',
                body: {
                    id: this.cancelId,
                    authCode: this.verificationCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.verificationCode = ''
                    this.onSeach(this.seachValue)
                    this.signForVisible = false
                }
            })
        },
        /**
         * @name: 确认签收
         * @msg:
         * @param {type}
         * @return:
         */
        onSignForSelect (e) {
            console.log(e)
            this.cancelId = e.id
            if (e.billType === 'bill_deliver_sale_type:1') {
                this.verification = true
            } else {
                this.verification = false
            }
            this.signForVisible = true
        },
        /**
         * @name: title按钮切换
         * @msg:
         * @param {type}
         * @return:
         */
        billTypeChange (e) {
            this.billTypeBtn = e.billType
            for (const i of this.billTypeList) {
                if (e.billType === i.billType) {
                    i.backColor = '#1890ff'
                    i.color = '#fff'
                } else {
                    i.backColor = ''
                    i.color = '#606266'
                }
            }
            this.seachValue.billType = e.billType
            this.onSeach(this.seachValue)
        },
        /**
         * @name: 工具栏按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'add') {
                // console.log('新增')
            } else if (e === 'del') {
                // console.log('批量删除')
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DeliverDivisionFindToSign', this.seachValue)
                // console.log('导出')
            } else if (e === 'print') {
                // console.log('打印')
            }
        },
        /**
         * @name:搜索框清空
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {
                billType: this.billTypeBtn
            }
        },
        /**
         * @name: 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            axios({
                path: 'DeliverDivisionFindToSign',
                method: 'post',
                body: e
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    // 获取单据状态数量
                    this.billTypeList.forEach(e => {
                        if (e.billType === '') {
                            e.am = data.typeDsf + data.typeLs + data.typeFx + data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:1') {
                            e.am = data.typeLs
                        } else if (e.billType === 'bill_deliver_sale_type:2') {
                            e.am = data.typeFx
                        } else if (e.billType === 'bill_deliver_sale_type:3') {
                            e.am = data.typeNbdb
                        } else if (e.billType === 'bill_deliver_sale_type:4') {
                            e.am = data.typeDsf
                        }
                    })
                    this.$set(this.conditions[8], 'selectDataArr', data.routes)
                    // this.$refs.newTable.setTableData(data.list, { path: 'DeliverDivisionFindToSign' })
                    const obj = Object.assign(this.seachValue, { path: 'DeliverDivisionFindToSign' })
                    this.$refs.newTable.reload(this.tableCode, obj)
                }
            })
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            // if (status === 'bill_deliver_status:1') {
            //     this.disContextMenu = ['取消分拣']
            // } else if (status === 'bill_deliver_status:2') {
            //     this.disContextMenu = ['拆单', '分拣']
            // }
        },
        /** 表格多选方法
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (keys, rows) {
            this.selectArr = rows
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'AffirmSignInManage') {
            }
        }
    }
}
</script>

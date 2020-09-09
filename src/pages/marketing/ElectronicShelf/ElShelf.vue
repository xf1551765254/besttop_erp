<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-08 15:50:18
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-23 10:23:47
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
      @onSeach="onSeach">
      <a-button
        class="btn"
        @click="stopScreen"
        icon="stop"
        size="small"
        type="primary">停投</a-button>
    </seachBox>
    <div class="modal-box">
      <a-row v-if="modals.length > 0">
        <a-col
          :xs="24"
          :md="12"
          :xl="8"
          :xxl="6"
          v-for="(item, index) in modals"
          :key="index">
          <div class="card">
            <span class="card-title">编号：</span><span>{{ item.code }}</span><br/>
            <span class="card-title">名称：</span><span>{{ item.name }}</span><br/>
            <span class="card-title">创建时间：</span><span>{{ item.createTime }}</span><br/>
            <span class="card-title">创建人：</span><span>{{ item.createBy }}</span><br/>
            <span class="card-title">状态：</span><span>{{ item.status===1 ? '启用' : '停用' }}</span><br/>
            <a-dropdown-button
              class="card-btn-box"
              @click="handleButtonClick(item.id, item.status===1)"
              :trigger="['click']">
              投屏
              <a-menu slot="overlay" @click="e=>handleMenuClick(e, item)">
                <a-menu-item key="detail"><a-icon type="user" />详情</a-menu-item>
                <a-menu-item key="edit" :disabled="item.status===1"><a-icon type="edit" />修改</a-menu-item>
                <a-menu-item key="start" :disabled="item.status===1"><a-icon type="play-circle" />启用</a-menu-item>
                <a-menu-item key="stop" :disabled="item.status!==1"><a-icon type="stop" />停用</a-menu-item>
                <a-menu-item key="del" :disabled="item.status===1"><a-icon type="delete" />删除</a-menu-item>
              </a-menu>
            </a-dropdown-button>
          </div>
        </a-col>
      </a-row>
      <a-row v-else>
        <a-col span="24">暂无数据</a-col>
      </a-row>
    </div>
    <!-- 新增编辑 -->
    <bt-modal
      v-model="modalVisble"
      :title="modalTitle"
      :submitLoading="submitLoading"
      :submitClick="handleSubmit"
      :subBtn="!isDetail"
    >
      <a-form :form="form">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">模板编码</a-col>
          <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
            <a-form-item>
              <a-input v-model="code" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">模板名称</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-model="name" :disabled="isDetail"/>
            </a-form-item>
          </a-col>
        </a-row>
        <el-divider content-position="left">
          <a-tooltip placement="bottomLeft" >
            <template slot="title">
              <span>生效门店范围</span>
            </template>
            <a-icon type="question-circle" style="margin-right:10px"/>
          </a-tooltip>
          <span style="padding-right:20px;">生效门店范围</span>
          <a-radio-group v-model="hasStore" :disabled="isDetail">
            <a-radio :value="0">全局</a-radio>
            <a-radio :value="1">定义店</a-radio>
          </a-radio-group>
        </el-divider>
        <a-row>
          <order
            ref="storeTableRef"
            v-if="hasStore === 1"
            :headerData="storeHeaderData"
            :canEditCell="storeCanEditCell"
            :data="storeData"
            :height="250">
          </order>
          <div v-else style="padding-left:40px;">全局生效</div>
        </a-row>
        <el-divider content-position="left">
          <a-tooltip placement="bottomLeft" >
            <template slot="title">
              <span>商品组定义</span>
            </template>
            <a-icon type="question-circle" style="margin-right:10px"/>
          </a-tooltip>
          商品组定义
        </el-divider>
        <a-row>
          <order
            ref="goodsTableRef"
            :headerData="goodsHeaderData"
            :canEditCell="goodsCanEditCell"
            :data="goodsData"
            :height="250">
          </order>
        </a-row>
        <el-divider content-position="left">
          <a-tooltip placement="bottomLeft" >
            <template slot="title">
              <span>组商品定义</span>
            </template>
            <a-icon type="question-circle" style="margin-right:10px"/>
          </a-tooltip>
          组商品
        </el-divider>
        <a-row>
          <order
            ref="sellerGoodsTableRef"
            :headerData="sellerGoodsHeaderData"
            :canEditCell="sellerGoodsCanEditCell"
            :data="sellerGoodsData"
            :showGoodsHeader="showGoodsHeader"
            :height="250"
            @getSelectOption="getSelectOption">
          </order>
        </a-row>
        <el-divider content-position="left">
          <a-tooltip placement="bottomLeft" >
            <template slot="title">
              <span>展示商品范围定义</span>
            </template>
            <a-icon type="question-circle" style="margin-right:10px"/>
          </a-tooltip>
          <span style="padding-right:20px;">展示商品范围</span>
          <a-radio-group v-model="hasGoods" :disabled="isDetail">
            <a-radio :value="0">全量商品</a-radio>
            <a-radio :value="1">自定义范围</a-radio>
          </a-radio-group>
        </el-divider>
        <a-row>
          <order
            ref="otherGoodsTableRef"
            v-if="hasGoods === 1"
            :headerData="otherGoodsHeaderData"
            :canEditCell="otherGoodsCanEditCell"
            :data="otherGoodsData"
            :showGoodsHeader="showGoodsHeader"
            :height="250">
          </order>
          <div v-else style="padding-left:40px;">全量商品</div>
        </a-row>
      </a-form>
    </bt-modal>
    <a-modal
      title="绑定屏幕"
      :visible="screenIdVisible"
      @ok="screenIdOk"
      :confirmLoading="screenIdLoading"
      @cancel="screenIdCancel">
      <div>
        <a-input v-model="screenId" placeholder="请输入电子货架大屏显示的ID"></a-input>
      </div>
    </a-modal>
    <a-modal
      title="解绑屏幕"
      :visible="stopScreenIdVisible"
      @ok="stopScreenIdOk"
      :confirmLoading="stopScreenIdLoading"
      @cancel="stopScreenIdCancel">
      <div>
        <a-input v-model="stopScreenId" placeholder="请输入电子货架大屏显示的ID"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import BtModal from '@comp/Modal'
import Order from '@comp/order'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import compact from 'lodash.compact'
import fromPairs from 'lodash.frompairs'
import zip from 'lodash.zip'

export default {
    components: {
        SeachBox,
        NewTable,
        BtModal,
        Order
    },
    data () {
        return {
            // 表单
            form: this.$form.createForm(this),
            btns: ['add', 'del', 'recover', 'export'],
            conditions: [
                { title: '模板编码', type: 'input', key: 'code' },
                { title: '模板名称', type: 'input', key: 'name' },
                { title: '屏幕编码', type: 'input', key: 'screenCode' },
                { title: '展示状态', type: 'select', key: 'type', label: 'value', value: 'status', body: {} }
            ],
            seachValue: {},
            modals: [],
            modalVisble: false,
            screenIdVisible: false,
            screenIdLoading: false,
            stopScreenIdVisible: false,
            stopScreenIdLoading: false,
            stopScreenId: '',
            submitLoading: false,
            modalTitle: '新增模板',
            isAdd: false,
            isDetail: false,
            hasStore: 0,
            hasGoods: 0,
            showGoodsHeader: ['code', 'name'],
            storeData: [],
            // 门店选择表头
            storeHeaderData: [
                {
                    sortable: true,
                    title: '生效店编码',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'storeCode',
                    key: 'storeCode',
                    modalType: 'store',
                    chooseIndex: {
                        code: 'storeCode',
                        name: 'effectStoreName'
                    }
                },
                {
                    sortable: true,
                    title: '生效店名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'effectStoreName',
                    key: 'effectStoreName'
                }
            ],
            // 门店选择后可编辑的格子
            storeCanEditCell: [
                { dataIndex: 'storeCode' }
            ],
            goodsData: [],
            // 商品组定义选择表头
            goodsHeaderData: [
                {
                    sortable: false,
                    title: '组类型',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'type',
                    key: 'type',
                    type: 'select',
                    selectOptions: [{ key: 1, label: '主推', value: 'electronic_shelf_goods_type:1' }, { key: 2, label: '畅销', value: 'electronic_shelf_goods_type:2' }]
                },
                {
                    sortable: true,
                    title: '组名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'name',
                    key: 'name',
                    type: 'input'
                },
                {
                    sortable: true,
                    title: '营销海报',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'url',
                    key: 'url',
                    modalType: 'file',
                    chooseIndex: {
                        url: 'url'
                    },
                    fileProportion: {
                        // 图片宽高比
                        fixedNumber: [1, 1],
                        // 自定义宽高比
                        fixedCustom: {
                            key: 'type',
                            value: 'electronic_shelf_goods_type:1',
                            fixedNumber: [2, 1]
                        }
                    }
                }
            ],
            // 主推商品选择后可编辑的格子
            goodsCanEditCell: [
                { dataIndex: 'name' },
                { dataIndex: 'type' },
                { dataIndex: 'url' }
            ],
            sellerGoodsData: [],
            // 畅销商品选择表头
            sellerGoodsHeaderData: [
                {
                    sortable: true,
                    title: '商品组',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'groupCode',
                    key: 'groupCode',
                    type: 'select',
                    isEmit: true,
                    selectOptions: []
                },
                {
                    sortable: true,
                    title: '商品编码',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'goodsCode',
                    key: 'goodsCode',
                    modalType: 'goods',
                    chooseIndex: {
                        code: 'goodsCode',
                        name: 'goodsName',
                        model: 'model'
                    }
                },
                {
                    sortable: true,
                    title: '商品名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'goodsName',
                    key: 'goodsName'
                },
                {
                    sortable: true,
                    title: '规格型号',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'model',
                    key: 'model'
                }
            ],
            // 畅销商品选择后可编辑的格子
            sellerGoodsCanEditCell: [
                { dataIndex: 'groupCode' },
                { dataIndex: 'goodsCode' }
            ],
            otherGoodsData: [],
            // 其他商品选择表头
            otherGoodsHeaderData: [
                {
                    sortable: true,
                    title: '品类编码',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'classCode',
                    key: 'classCode',
                    modalType: 'class',
                    chooseIndex: {
                        code: 'classCode',
                        name: 'className'
                    }
                },
                {
                    sortable: true,
                    title: '品类名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'className',
                    key: 'className'
                },
                {
                    sortable: true,
                    title: '品牌编码',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'brandCode',
                    key: 'brandCode',
                    modalType: 'brand',
                    chooseIndex: {
                        code: 'brandCode',
                        name: 'brandName'
                    }
                },
                {
                    sortable: true,
                    title: '品牌名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'brandName',
                    key: 'brandName'
                },
                {
                    sortable: true,
                    title: '商品编码',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'goodsCode',
                    key: 'goodsCode',
                    modalType: 'goods',
                    chooseIndex: {
                        code: 'goodsCode',
                        name: 'goodsName',
                        model: 'model'
                    }
                },
                {
                    sortable: true,
                    title: '商品名称',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'goodsName',
                    key: 'goodsName'
                },
                {
                    sortable: true,
                    title: '规格型号',
                    align: 'center',
                    isHidden: 0,
                    dataIndex: 'model',
                    key: 'model'
                }
            ],
            // 其他商品选择后可编辑的格子
            otherGoodsCanEditCell: [
                { dataIndex: 'classCode' },
                { dataIndex: 'brandCode' },
                { dataIndex: 'goodsCode' }
            ],
            modelId: '',
            screenId: '',
            name: '',
            code: '',
            id: ''
        }
    },
    async created () {
        await this.getModalsData()
        await this.getPermissionsDataIsPrivilege()
    },
    methods: {
        async stopScreenIdOk () {
            if (!this.stopScreenId) {
                this.$message.error('请输入屏幕ID！')
                return
            }
            this.stopScreenIdLoading = true
            axios({
                path: 'ShelfModelDeleteModel',
                body: {
                    key: this.stopScreenId
                }
            }).then(res => {
                this.stopScreenIdLoading = false
                if (res.flag === 1) {
                    this.$message.success('解绑成功！')
                    this.stopScreenId = ''
                    this.stopScreenIdVisible = false
                }
            })
        },
        stopScreen () {
            this.stopScreenIdVisible = true
        },
        stopScreenIdCancel () {
            this.stopScreenId = ''
            this.stopScreenIdVisible = false
        },
        async getPermissionsDataIsPrivilege () {
            const { flag, data } = await axios({
                path: 'PermissionsDataIsPrivilege',
                body: { objType: 4 }
            })
            if (flag === 1) {
                console.log(data)
            }
        },
        async getModalsData () {
            const { flag, data } = await axios({
                path: 'ShelfModelQueryByStoreCode',
                body: {
                    storeCode: this.$ls.get('STORE_INFO').code
                }
            })
            if (flag === 1) {
                this.modals = data.list
            }
        },
        handleButtonClick (code, isStatus) {
            if (isStatus) {
                this.screenIdVisible = true
                this.modelId = code
                this.screenId = ''
            } else {
                this.$message.error('请先启用模板！')
            }
        },
        screenIdCancel () {
            this.screenIdVisible = false
        },
        screenIdOk () {
            if (!this.screenId) {
                this.$message.error('请输入屏幕ID！')
                return
            }
            this.screenIdLoading = true
            axios({
                path: 'ShelfModelAddModel',
                body: {
                    modelId: this.modelId,
                    key: this.screenId
                }
            }).then(res => {
                this.screenIdLoading = false
                if (res.flag === 1) {
                    this.$message.success('投屏成功！')
                    this.screenIdVisible = false
                }
            })
        },
        async handleMenuClick (e, item) {
            const { key } = e
            switch (key) {
            case 'start':
                await axios({ path: 'ShelfModelUpdateStatusUpdateStatus', body: { code: item.code, status: 1 } })
                await this.getModalsData()
                break
            case 'stop':
                await axios({ path: 'ShelfModelUpdateStatusUpdateStatus', body: { code: item.code, status: 0 } })
                await this.getModalsData()
                break
            case 'del':
                const { flag } = await axios({ path: 'ShelfModelUpdateStatusDeleteModel', body: { ids: [item.id] } })
                if (flag === 1) {
                    await this.getModalsData()
                }
                break
            case 'edit':
                const res = await axios({ path: 'ShelfModelQueryModelDetail', body: { id: item.id } })
                if (res.flag === 1) {
                    this.isDetail = false
                    this.id = res.data.id
                    this.code = res.data.code || ''
                    this.name = res.data.name || ''
                    let codes = res.data.storeCode || ''
                    let names = res.data.storeCodeName || ''
                    this.storeData = []
                    if (codes.length > 0) {
                        codes = codes.split(',')
                        names = names.split(',')
                        const _codes = []
                        codes.forEach(element => { _codes.push('storeCode') })
                        const _names = []
                        names.forEach(element => { _names.push('effectStoreName') })
                        const storeCodes = zip(_codes, codes)
                        const storeNames = zip(_names, names)
                        for (let i = 0; i < storeCodes.length; i++) {
                            this.storeData.push(fromPairs([storeCodes[i], storeNames[i]]))
                        }
                    }
                    this.goodsData = []
                    const groups = res.data.groups || []
                    groups.forEach(g => {
                        this.goodsData.push({
                            // id: g.id,
                            name: g.name,
                            type: g.type,
                            url: g.url,
                            code: g.code
                        })
                    })
                    this.sellerGoodsData = []
                    const goods = res.data.goods || []
                    goods.forEach(g => {
                        this.sellerGoodsData.push({
                            groupCode: g.groupCode,
                            goodsCode: g.goodsCode,
                            goodsName: g.goodsName,
                            model: g.model,
                            type: g.type
                        })
                    })
                    this.otherGoodsData = []
                    const others = res.data.others || []
                    others.forEach(g => {
                        this.otherGoodsData.push({
                            brandCode: g.brandCode,
                            brandName: g.brandName,
                            classCode: g.classCode,
                            className: g.className,
                            goodsCode: g.goodsCode,
                            goodsName: g.goodsName,
                            model: g.model,
                            type: g.type
                        })
                    })
                    this.hasStore = this.storeData.length > 0 ? 1 : 0
                    this.hasGoods = this.otherGoodsData.length > 0 ? 1 : 0
                    this.storeCanEditCell = [
                        { dataIndex: 'storeCode' }
                    ]
                    this.goodsCanEditCell = [
                        { dataIndex: 'name' },
                        { dataIndex: 'type' },
                        { dataIndex: 'url' }
                    ]
                    this.sellerGoodsCanEditCell = [
                        { dataIndex: 'groupCode' },
                        { dataIndex: 'goodsCode' }
                    ]
                    this.otherGoodsCanEditCell = [
                        { dataIndex: 'classCode' },
                        { dataIndex: 'brandCode' },
                        { dataIndex: 'goodsCode' }
                    ]
                    this.addEditShelf(1)
                    this.getSelectOptionInit()
                }
                break
            case 'detail':
                const detailRes = await axios({ path: 'ShelfModelQueryModelDetail', body: { id: item.id } })
                if (detailRes.flag === 1) {
                    this.isDetail = true
                    this.id = detailRes.data.id
                    this.code = detailRes.data.code || ''
                    this.name = detailRes.data.name || ''
                    this.storeData = []
                    let codes = detailRes.data.storeCode || ''
                    let names = detailRes.data.storeCodeName || ''
                    if (codes.length > 0) {
                        codes = codes.split(',')
                        names = names.split(',')
                        const _codes = []
                        codes.forEach(element => { _codes.push('storeCode') })
                        const _names = []
                        names.forEach(element => { _names.push('effectStoreName') })
                        const storeCodes = zip(_codes, codes)
                        const storeNames = zip(_names, names)
                        for (let i = 0; i < storeCodes.length; i++) {
                            this.storeData.push(fromPairs([storeCodes[i], storeNames[i]]))
                        }
                    }
                    this.goodsData = detailRes.data.groups || []
                    this.sellerGoodsData = detailRes.data.goods || []
                    this.otherGoodsData = detailRes.data.others || []
                    this.hasStore = this.storeData.length > 0 ? 1 : 0
                    this.hasGoods = this.otherGoodsData.length > 0 ? 1 : 0
                    this.storeCanEditCell = []
                    this.goodsCanEditCell = []
                    this.sellerGoodsCanEditCell = []
                    this.otherGoodsCanEditCell = []
                    this.addEditShelf(1)
                    this.getSelectOptionInit()
                }
                break
            default:
                break
            }
        },
        addEditShelf (index) {
            if (index < 0) {
                this.isDetail = false
                this.id = ''
                this.name = ''
                this.hasStore = 0
                this.hasGoods = 0
                this.storeData.length = 0
                this.goodsData.length = 0
                this.sellerGoodsData.length = 0
                this.otherGoodsData.length = 0
                this.storeCanEditCell = [
                    { dataIndex: 'storeCode' }
                ]
                this.goodsCanEditCell = [
                    { dataIndex: 'name' },
                    { dataIndex: 'type' },
                    { dataIndex: 'url' }
                ]
                this.sellerGoodsCanEditCell = [
                    { dataIndex: 'groupCode' },
                    { dataIndex: 'goodsCode' }
                ]
                this.otherGoodsCanEditCell = [
                    { dataIndex: 'classCode' },
                    { dataIndex: 'brandCode' },
                    { dataIndex: 'goodsCode' }
                ]
                this.isAdd = true
            } else {
                this.isAdd = false
            }
            this.modalVisble = true
        },
        onReload () {

        },
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditShelf(-1)
            }
        },
        onSeach () {

        },
        handleSubmit () {
            if (!this.name) {
                this.$message.error('请输入模板名称！')
                return
            }
            let storeCodes = []
            let goods = []
            let otherGoodsList = []
            if (this.hasStore === 1) {
                const storeList = this.$refs.storeTableRef.getTableData()
                storeCodes = compact(map(storeList, 'storeCode'))
            }
            const groups = this.$refs.goodsTableRef.getTableData().filter(o => o.name && o.type)
            groups.map((o, index) => { o.id = o.__id })
            const sellerGoodsList = this.$refs.sellerGoodsTableRef.getTableData().filter(o => o.goodsCode)
            sellerGoodsList.forEach(e => {
                const has = groups.find(o => o.id === e.groupCode || o.code === e.groupCode)
                if (has) {
                    e.groupCode = has.id
                    e.type = has.type
                }
            })
            if (this.hasGoods === 1) {
                otherGoodsList = this.$refs.otherGoodsTableRef.getTableData().filter(o => o.goodsCode || o.classCode || o.brandCode)
                otherGoodsList.map(o => { o.type = 'electronic_shelf_goods_type:3' })
            }
            goods = [...sellerGoodsList, ...otherGoodsList]
            const body = {
                storeCodes,
                groups,
                goods,
                name: this.name
            }
            if (!this.isAdd) {
                body.id = this.id
            }
            this.submitLoading = true
            axios({
                path: this.isAdd ? 'ShelfGoodsAddElectronicShelfGoods' : 'ShelfModelUpdateElectronicShelfModel',
                body
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    this.modalVisble = false
                    this.getModalsData().then()
                }
            })
        },
        getSelectOptionInit () {
            const data = []
            this.goodsData.forEach((e, index) => {
                data.push({
                    key: index,
                    label: e.name,
                    value: e.code
                })
            })
            this.$set(this.sellerGoodsHeaderData[0], 'selectOptions', data)
        },
        getSelectOption (e) {
            const groups = this.$refs.goodsTableRef.getTableData().filter(o => o.name && o.type)
            const data = []
            groups.forEach((e, index) => {
                if (e.code) {
                    data.push({
                        key: index,
                        label: e.name,
                        value: e.code
                    })
                } else {
                    data.push({
                        key: e.__id,
                        label: e.name,
                        value: e.__id
                    })
                }
            })
            this.$set(this.sellerGoodsHeaderData[0], 'selectOptions', data)
        }
    }
}
</script>
<style lang="less" scoped>
.modal-box{
    padding: 10px;
    background-color: #fff;
    .card{
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 10px;
        margin: 5px;
        transition: all 0.3s;
        position:relative;
        &-title{
            font-weight: bold;
            white-space: nowrap;
        }
        &-btn-box{
            padding-top: 10px;
            position:absolute;
            right:10px;
            top: 70px;
        }
    }
}
</style>

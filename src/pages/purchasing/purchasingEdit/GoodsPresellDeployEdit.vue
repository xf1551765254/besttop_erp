<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-10 15:43:54
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 15:41:57
 -->
<template>
  <div>
    <bt-modal
      v-model="addEditModel"
      :title="title ? title : '编辑商品预售配置'"
      :popconfirm="false"
      :loading="submitLoading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitClick">
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form" class="table-nowrap">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                style="width: 100%"
                :filterOption="false"
                :options="managerByArr"
                :getPopupContainer="trigger => trigger.parentNode"
                placeholder="请检索负责人"
                @search="handleSearchManagerBy"
                showSearch
                v-decorator="$check('billpresale.managerBy',{initialValue:this.BaseMessageObj.managerBy})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea
                style="width:100%;"
                placeholder="请输入备注"
                v-decorator="$check('billpresale.note',{initialValue:this.BaseMessageObj.note})"
                :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">订单详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="categoryinfoAdd">新增</a-button>
          <a-popconfirm title="是否确定批量删除?" @confirm="() => categoryinfoDelete(-1)">
            <a-button class="categoryinfo-btn" type="danger">删除</a-button>
          </a-popconfirm>
        </a-row>
        <a-table
          rowKey="tbWebId"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          bordered
          :pagination="false"
          :scroll="scrollXY"
        >
          <template v-for="col in [ 'preSaleQuantity','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'preSaleQuantity'"
                style="margin: -5px 0;width:100%;"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.tbWebId, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0; width:100%"
                :value="text"
                @change="e => InputChange(e.target.value, record.tbWebId, col)"
              />
              <span v-else>{{ text }}</span>
            </div>
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.tbWebId)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                v-decorator="$check('BillPrice.createBy', {initialValue: BaseMessageObj.createBy || `${this.$store.getters.storeInfo.code}-${this.$store.getters.storeInfo.name}`})"
                disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                :disabledDate="signDtDisabledDate"
                style="width: 100%"
                disabled
                v-decorator="$check('BillOrber.createTime',{initialValue:this.BaseMessageObj.createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goods ref="goodsRef" :visible.sync="goodsQuery" :pams="pams" @onSelect="onSelect" multiple/>
    </bt-modal>
  </div>
</template>
<script>
import moment from 'moment'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import goods from '@pages/purchasing/goodsPresellDeploy/goods'
const categoryinfoColumns = [ // 采购订单详情表头
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'model', width: 300 },
    { title: '账面库存', dataIndex: 'currentNumber', width: 60, align: 'right' },
    { title: '允许预售数量', dataIndex: 'preSaleQuantity', width: 100, scopedSlots: { customRender: 'preSaleQuantity' } },
    { title: '生效位置', dataIndex: 'storeName', width: 200 },
    { title: '备注', dataIndex: 'note', align: 'center', scopedSlots: { customRender: 'note' } },
    { title: '操作', key: 'operation', fixed: 'right', width: 50, align: 'right', scopedSlots: { customRender: 'action' } }
]
export default {
    components: {
        goods,
        BtModal
    },
    props: {
        title: {
            type: String,
            default: String
        },
        code: {
            type: String,
            default: String
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.getData(this.code)
                // this.BaseMessageObjManagerBy()
            }
        },
        addEditModel (val) {
            if (!val) {
                this.$emit('input', false)
                this.indexNumber = 1
            }
        }
    },
    data () {
        return {
            pams: {},
            tags: [],
            rowId: '',
            orderId: '',
            managerByArr: [], // 负责人
            goodsQuery: false,
            BaseMessageObj: {},
            categoryinfoColumns,
            addEditModel: false,
            submitLoading: false,
            categoryinfoData: [],
            scrollXY: { x: 1650, y: 350 },
            categoryinfoSelectedRowKeys: [],
            form: this.$form.createForm(this),
            indexNumber: 1
        }
    },
    computed: {
        signDtDefaultValue () {
            return moment()
        }
    },
    methods: {
        handleSearchManagerBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.managerByArr.length = 0
                this.getDataManagerBy({
                    condition: value
                }, path)
            }, 300)
        },
        getDataManagerBy (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.managerByArr = data
                }
            })
        },
        /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            if (code) {
                const res = await axios({
                    path: 'BillSaleFind',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    this.rowId = data.id
                    this.orderId = ''
                    this.tags = ['uncheck']
                    data.type = Number(data.type)
                    data.managerBy = data.managerBy ? `${data.managerBy}-${data.managerName}` : ''
                    data.createBy = `${data.createBy}-${data.createName}`
                    data.expectedArrivalDate = moment(data.expectedArrivalDate)
                    this.BaseMessageObj = { ...data }
                    if (res.data.list.length !== 0) {
                        this.addEditModel = true
                        const detail = await axios({
                            path: 'BillSaleDetailFindDetail',
                            method: 'post',
                            body: {
                                preSaleId: this.BaseMessageObj.id
                            }
                        })
                        if (detail.flag === 1) {
                            detail.data.list.forEach(i => {
                                i.index = this.indexNumber++
                                i.tbWebId = i.skuCode + i.storeId
                            })
                            this.categoryinfoData = [...detail.data.list]
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            } else {
                this.orderId = ''
                this.tags = []
                this.categoryinfoData = []
                this.BaseMessageObj = {
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    managerBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.BaseMessageObj.expectedArrivalDate = this.signDtDefaultValue
                this.BaseMessageObj.type = 1
                this.addEditModel = true
            }
        },
        /**
         * @name: 新增弹框提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            const newData = [...this.categoryinfoData]
            if (newData.length === 0) {
                return this.$message.error('您没有添加商品信息')
            }
            for (const i of newData) {
                if (!i.preSaleQuantity || i.preSaleQuantity === '0') {
                    return this.$message.warning(`商品名称为${i.skuName}预售数量有误，请输入预售数量!`)
                }
            }
            validateFields((err, values) => {
                if (!err) {
                    this.submitLoading = true
                    console.log(values, '134568312564562')
                    values.managerBy = values.managerBy ? values.managerBy.split('-')[0] : ''
                    if (!this.code) {
                        const saveArr = Object.assign(values, { billPreSaleDetails: newData })
                        axios({
                            path: 'BillSaleAdd',
                            method: 'post',
                            body: saveArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.addEditModel = false
                            }
                        })
                    } else {
                        values.createBy = values.createBy.split('-')[0]
                        const saveArr = Object.assign(values, { id: this.rowId }, { billPreSaleDetails: newData })
                        axios({
                            path: 'BillSaleUpdate',
                            method: 'post',
                            body: saveArr,
                            headers: {}
                        }).then(res => {
                            this.submitLoading = false
                            if (res.flag === 1) {
                                this.addEditModel = false
                            }
                        })
                    }
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 搜索弹框事件
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (arr) {
            this.categoryinfoSelectedRowKeys = []
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        tbWebId: i.skuCode,
                        storeName: i.storeName,
                        storeId: i.storeCode,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        model: i.model,
                        currentNumber: i.currentNumber,
                        preSaleQuantity: 1,
                        note: i.note
                    })
                } else {
                    error.push(i.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 获取负责人
         * @msg:
         * @param {type}
         * @return:
         */
        // BaseMessageObjManagerBy () {
        //     axios({
        //         path: 'PermissionsUserFindOption',
        //         method: 'post',
        //         body: { },
        //         headers: {}
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.managerByArr = [...data]
        //         }
        //     })
        // },
        /**
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (tbWebId) {
            if (tbWebId === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].tbWebId === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.tbWebId !== tbWebId)
            }
        },
        /**
         * @name: 订单详情多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys) {
            this.categoryinfoSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.tbWebId)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        /**
         * @name: 订单详情新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            this.goodsQuery = true
            this.$refs.goodsRef.delForm()
        },
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().subtract({ days: 1 }))
        }
    }
}
</script>
<style lang="less">
.baseInfo {
    margin-bottom: 10px;
    padding-left: 25px;
    color: #38adff;
    padding-top: 10px;
}
</style>

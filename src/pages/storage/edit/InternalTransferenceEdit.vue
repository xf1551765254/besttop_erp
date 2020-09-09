<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-10 10:48:40
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 19:23:21
 -->
<template>
  <div>
    <bt-modal
      v-model="addEditModel"
      :title="title"
      :popconfirm="false"
      :orderId="orderId"
      :tags="tags"
      :loading="submitLoading"
      :submitClick="submitClick"
    >
      <div class="baseInfo">
        基础信息
      </div>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">调出位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索调出位置"
                :options="distributionCenterArr"
                @change="theGoodsLocation"
                @search="LocationSearch"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('billAllotC.sourceStoreCode',{initialValue:BaseMessageObj.sourceStoreCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">调入位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索调入位置"
                :options="distributionCenterArr"
                @change="theGoodsLocation"
                @search="LocationSearch"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('billAllotC.destinationStoreCode',{initialValue:BaseMessageObj.destinationStoreCode})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billAllotC.makeStoreId', {initialValue:`${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索负责人"
                :options="applicantArr"
                showSearch
                :filterOption="false"
                @search="applicantSearch"
                style="width:100%"
                v-decorator="$check('billAllotC.chargeBy',{initialValue:BaseMessageObj.chargeBy})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('billAllotC.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">商品详情</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="goodsAdd(1)">选择调拨商品</a-button>
          <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)">删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          :pagination="false"
          size="small"
          bordered
          :scroll="scroll">
          <template slot="footer">
            <h3 style="display:inline;">总计：</h3>
            <span style="margin-left:100px">总数量：</span>
            <span>{{ totalQuantity }}</span>
            <!-- <span style="margin-left:150px">成本总额：</span>
                  <span>{{ sumChangeM(costPrice) }}</span>
                  <span style="margin-left:100px">零售总额：</span>
                  <span>{{ sumChangeM(retailPrice) }}</span> -->
          </template>
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-for="col in ['qtty','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="col === 'qtty'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="Number.MAX_SAFE_INTEGER"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChange(e, record.skuCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChange(e.target.value, record.skuCode, col)" />
              <span v-else>{{ text }}</span>
            </div>
          </template>
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billAllotC.createBy', {initialValue:`${this.$store.getters.code}-${this.$store.getters.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billAllotC.createTime', {initialValue:BaseMessageObj.createTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsBounced :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="onSelectBounced"/>
    </bt-modal>
  </div>
</template>
<script>
import is from 'is_js'
import moment from 'moment'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsB'
const categoryinfoColumns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90, align: 'left' },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300, align: 'left' },
    { title: '品牌', dataIndex: 'brandName', width: 100, align: 'left' },
    { title: '单位', dataIndex: 'skuUnit', width: 50, align: 'left' },
    { title: '规格型号', dataIndex: 'skuModel', width: 300, align: 'left' },
    { title: '调拨数量', dataIndex: 'qtty', width: 90, align: 'right', scopedSlots: { customRender: 'qtty' } },
    { title: '现库存', dataIndex: 'curNumber', align: 'right', width: 100 },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
    { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
] // 表头
export default {
    components: {
        BtModal,
        goodsBounced
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
            }
        },
        addEditModel (val) {
            if (!val) {
                this.$emit('input', false)
                this.BaseMessageObj = {}
                this.categoryinfoData = []
                this.indexNumber = 1
            }
        }
    },
    data () {
        return {
            tags: [],
            rowId: '',
            orderId: '',
            pamsBounced: {},
            applicantArr: [], // 负责人
            storeQuery: false,
            BaseMessageObj: {},
            totalQuantity: '0',
            scroll: { x: 1500, y: 350 },
            categoryinfoColumns,
            addEditModel: false,
            submitLoading: false,
            categoryinfoData: [],
            distributionCenterArr: [], // 收获位置
            categoryinfoSelectedRowKeys: [], // 选中项
            form: this.$form.createForm(this),
            addEdit: '',
            indexNumber: 1
        }
    },
    methods: {
    /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            if (code) {
                const res = await axios({
                    path: 'DistributionBillAllotFind',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    this.rowId = data.id
                    this.orderId = data.code
                    this.tags = ['uncheck']
                    data.createBy = `${data.createBy}-${data.createByName}`
                    data.sourceStoreCode = `${data.sourceStoreCode}-${data.sourceStoreName}`
                    data.destinationStoreCode = `${data.destinationStoreCode}-${data.destinationStoreName}`
                    data.chargeBy = data.chargeBy ? `${data.chargeBy}-${data.chargeByName}` : ''
                    this.theGoodsLocationId = data.destinationStoreCode
                    this.BaseMessageObj = { ...data }
                    if (res.data.list.length !== 0) {
                        this.addEditModel = true
                        const detail = await axios({
                            path: 'DistributionBillAllotDetailFindDetail',
                            method: 'post',
                            body: {
                                code: code
                            }
                        })
                        if (detail.flag === 1) {
                            const data = detail.data
                            data.forEach(i => {
                                i.index = this.indexNumber++
                            })
                            this.categoryinfoData = data
                            this.total()
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
                this.addEdit = 'edit'
            } else {
                this.orderId = ''
                this.tags = []
                this.theGoodsLocationId = ''
                this.categoryinfoData = []
                this.totalQuantity = '0'
                this.addEditModel = true
                this.BaseMessageObj = {
                    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    chargeBy: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.addEdit = 'add'
                console.log('应该新增啊')
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
            validateFields((err, values) => {
                const newData = [...this.categoryinfoData]
                if (newData.length === 0) {
                    this.$message.warning(`请添加需要调拨商品!`)
                    return
                }
                for (const i of newData) {
                    if (i.qtty === 0) {
                        this.$message.warning(`商品编码为${i.skuCode}调拨数量为0，请输入调拨 数量!`)
                        return
                    } else if (i.curNumber === 0 || !i.curNumber) {
                        return this.$message.warning(`商品编码为${i.skuCode}现库存为0，不能提交!`)
                    }
                }
                if (values.sourceStoreCode === values.destinationStoreCode) {
                    return this.$message.warning(`调入位置和调出位置不能相同!`)
                }
                let addArr = {}
                values.makeStoreId = values.makeStoreId.split('-')[0]
                values.createBy = values.createBy.split('-')[0]
                values.sourceStoreCode = values.sourceStoreCode.split('-')[0]
                values.destinationStoreCode = values.destinationStoreCode.split('-')[0]
                values.chargeBy = values.chargeBy ? values.chargeBy.split('-')[0] : ''

                addArr = Object.assign(values, { billAllotDetails: newData }, { sourceType: 'allot_source_type:2' })
                if (this.addEdit === 'edit') {
                    addArr = Object.assign(addArr, { id: this.rowId })
                } else {
                    addArr = Object.assign(addArr, { billType: 'bill_allot_type:1' })
                }
                if (!err) {
                    this.submitLoading = true
                    axios({
                        path: this.code ? 'DistributionBillAllotUpdate' : 'DistributionBillAllotAdd',
                        method: 'post',
                        body: addArr,
                        headers: {}
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModel = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        onSelectBounced (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        index: this.indexNumber++,
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        skuModel: i.model,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        skuUnit: i.basicUnit,
                        curNumber: i.curNumber,
                        qtty: 0
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
            this.totalQuantity = '0'
            this.total()
        },
        theGoodsLocation (e) {
            this.theGoodsLocationId = e
            this.BaseMessageObj = {
                createTime: moment().format('YYYY-MM-DD HH:mm:ss')

            }
            this.categoryinfoData = []
        },
        /**
         * @name: 总计
         * @msg:
         * @param {type}
         * @return:
         */
        total () {
            const { add } = this.$math
            const totalArr = [...this.categoryinfoData]
            const totalQuantityArr = []
            // const retailPriceArr = []
            // const costPriceArr = []
            for (const item of totalArr) {
                totalQuantityArr.push(item.qtty)
            }
            this.totalQuantity = totalQuantityArr.reduce(function (prev, cur) {
                return add(prev, cur, 2)
            }, 0)
        },
        /**
         * @name: 监听单据表格编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChange (val, count, col) {
            console.log(val, count, col)
            if (col === 'qtty') {
                if (!val || is.not.number(val) || val < 0) return
            }
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[col] = val
                if (Number(target.qtty) > Number(target.curNumber)) {
                    this.$message.warning(`${target.skuName}商品的sku库存量为${target.curNumber}，不能配出${target.qtty}，请重新输入`)
                    target.qtty = 0
                }
                this.categoryinfoData = newData
                this.total()
            }
        },
        LocationSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    code: this.$store.getters.storeInfo.code,
                    condition: e,
                    status: '0',
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'OrganizationStoreFindStoreAndDirect',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        console.log(data, '---------')
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.distributionCenterArr = [...data]
                    }
                })
            }, 300)
        },
        applicantSearch (e) {
            if (!e) { return }
            clearTimeout(this.createSetTimeout)
            this.createSetTimeout = setTimeout(() => {
                const data = {
                    name: e,
                    page: 1,
                    rows: 20
                }
                axios({
                    path: 'PermissionsUserFindOption',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data.list
                        data.forEach(i => {
                            i.key = i.code
                            i.title = `${i.code}-${i.name}`
                            i.value = i.code
                        })
                        this.applicantArr = [...data]
                    }
                })
            }, 300)
        },
        /**
         * @name: 获取下拉框
         * @msg:
         * @param {type}
         * @return:
         */
        distributionCenter () {
            axios({
                path: 'OrganizationStoreFindStoreAndDirect',
                method: 'post',
                body: {
                    code: this.$store.getters.storeInfo.code,
                    status: 0
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取收获位置', res.data)
                    const arr = res.data
                    arr.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.distributionCenterArr = [...arr]
                }
            })
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {},
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取负责人', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.applicantArr = [...data]
                }
            })
        },
        /**
         * @name: 订单详情删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (skuCode) {
            console.log(skuCode)
            if (skuCode === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                for (const i in this.categoryinfoSelectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.categoryinfoSelectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.categoryinfoData = categoryinfoData
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.skuCode !== skuCode)
            }
            this.total()
        },
        goodsAdd (e) {
            if (!this.theGoodsLocationId) {
                this.$message.warning('请选择调入位置！')
            } else {
                this.storeQuery = true
                this.pamsBounced = {
                    storeCode: this.form.getFieldValue('sourceStoreCode').split('-')[0]
                }
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
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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

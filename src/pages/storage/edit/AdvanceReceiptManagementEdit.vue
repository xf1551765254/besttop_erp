<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-12 10:22:27
 * @LastEditors: shuai
 * @LastEditTime: 2019-08-26 19:13:32
 -->
 <!-- 预收货管理 -->
<template>
  <div>
    <bt-modal
      v-model="addEditModel"
      :title="title ? title : '编辑预收/退货单'"
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
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请检索供应商"
                :options="providerArr"
                @change="theGoodsLocation"
                @search="handleSearchProvider"
                :filterOption="false"
                style="width:100%"
                v-decorator="$check('billEntry.provider',{initialValue:BaseMessageObj.provider})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input disabled v-decorator="$check('billEntry.storeCode', {initialValue: BaseMessageObj.storeCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">类型</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择类型"
                :options="recTypeArr"
                @change="recTypeChange"
                :filterOption="filterOption"
                style="width:100%"
                v-decorator="$check('billEntry.recType',{initialValue:BaseMessageObj.recType})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">是否核销</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择类型"
                :options="verificationStatusArr"
                style="width:100%"
                v-decorator="$check('billEntry.verificationStatus',{initialValue:BaseMessageObj.verificationStatus})"/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收/退货日期</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-date-picker
                style="width: 100%"
                :disabledDate="signDtDisabledDate"
                v-decorator="$check('billEntry.recDt',{initialValue:BaseMessageObj.recDt})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">负责人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                placeholder="请检索负责人"
                :options="applicantArr"
                showSearch
                allowClear
                :filterOption="false"
                @search="handleSearchChargeUser"
                style="width:100%"
                v-decorator="$check('billEntry.chargeUser',{initialValue:BaseMessageObj.chargeUser})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('billEntry.note',{initialValue:BaseMessageObj.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row>
        <h4 class="baseInfo">详情信息</h4>
        <a-row>
          <a-button class="categoryinfo-btn" @click="goodsAdd(1)" >添加商品</a-button>
          <a-button class="categoryinfo-btn" @click="categoryinfoDelete(-1)" >删除</a-button>
        </a-row>
        <a-table
          rowKey="skuCode"
          :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
          :columns="categoryinfoColumns"
          :dataSource="categoryinfoData"
          size="small"
          :pagination="false"
          bordered
          :scroll="scroll">
          <template slot="action" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => categoryinfoDelete(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
          <template v-for="col in ['recN','note']" :slot="col" slot-scope="text, record">
            <div :key="col">
              <a-input-number
                v-if="storageType==='receivableInAdvance' && col === 'recN'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="10000"
                :step="1"
                :precision="0"
                :value="text"
                @change="e => InputChangeJust(e, record.skuCode, col)" />
              <a-input-number
                v-else-if="storageType==='salesReturn' && col === 'recN'"
                style="margin: -5px 0;width:100%;"
                :min="0"
                :max="10000"
                :step="1"
                :precision="0"
                :formatter="value => `-${value}`"
                :parser="value => value.replace('-', '')"
                :value="text"
                @change="e => InputChangeLose(e, record.skuCode, col)" />
              <a-input
                v-else-if="col === 'note'"
                style="margin: -5px 0;width:100%;"
                :value="text"
                @change="e => InputChangeJust(e.target.value, record.skuCode, col)" />
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
                v-decorator="$check('billEntry.makeUser', {initialValue: BaseMessageObj.makeUser || `${this.$store.getters.code}-${this.$store.getters.name}`})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                disabled
                v-decorator="$check('billEntry.makeTime', {initialValue:BaseMessageObj.makeTime})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <goodsBounced :flagObj="flagObj" :visible.sync="storeQuery" :pams="pamsBounced" @onSelect="onSelectBounced"/>
    </bt-modal>
  </div>
</template>
<script>
import moment from 'moment'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import goodsBounced from '@pages/storage/InternalTransferManagement/BouncedComponents/goodsBounced'
const categoryinfoColumns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'skuModel', width: 300 },
    { title: '发生数量', dataIndex: 'recN', width: 80, align: 'right', scopedSlots: { customRender: 'recN' } },
    { title: '品牌', dataIndex: 'brandName', width: 100 },
    { title: '单位', dataIndex: 'skuUnit', width: 50 },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
    { title: '操作', key: 'operation', fixed: 'right', width: 50, scopedSlots: { customRender: 'action' } }
]
export default {
    components: {
        BtModal,
        goodsBounced
    },
    data () {
        return {
            flag: '',
            rowId: '',
            orderId: '',
            recTypeId: '',
            providerId: '',
            storageType: 'receivableInAdvance',
            tags: [],
            flagObj: {},
            recTypeArr: [],
            providerArr: [],
            pamsBounced: {},
            applicantArr: [],
            BaseMessageObj: {},
            categoryinfoData: [],
            verificationStatusArr: [],
            categoryinfoSelectedRowKeys: [],
            storeQuery: false,
            addEditModel: false,
            submitLoading: false,
            scroll: { x: 1550, y: 350 },
            categoryinfoColumns,
            form: this.$form.createForm(this)
        }
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
    methods: {
        /**
     * @name: 序号
     */
        taIndex (data) {
            let num = 1
            data.forEach(i => {
                i.index = num++
            })
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchChargeUser (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.applicantArr.length = 0
                this.getDataFun({
                    condition: value
                }, path)
            }, 300)
        },
        /**
         * @name: 供应商搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchProvider (value) {
            console.log(value)
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.providerArr.length = 0
                this.getDataFun({
                    name: value
                }, path)
            }, 300)
        },
        /**
         * @name: 数据
         * @msg:
         * @param {type}
         * @return:
         */
        getDataFun (pams = {}, path) {
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
                    if (path === 'CustomerSupplierFindOption') {
                        this.providerArr = data
                    } else if (path === 'PermissionsUserFindOption') {
                        this.applicantArr = data
                    }
                }
            })
        },
        /**
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            this.categoryinfoData = []
            if (code) {
                const res = await axios({
                    path: 'DistributionBillPreEntryFind',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    if (data.recType === 'bill_pre_entry_rec_type:1') {
                        this.storageType = 'receivableInAdvance'
                    } else {
                        this.storageType = 'salesReturn'
                    }
                    this.rowId = data.id
                    data.recDt = moment(data.recDt)
                    data.provider = `${data.provider}-${data.providerName}`
                    data.chargeUser = data.chargeUser ? `${data.chargeUser}-${data.chargeUserName}` : ''
                    data.storeCode = `${data.storeCode}-${data.storeName}`
                    data.makeUser = `${data.makeUser}-${data.makeUserName}`
                    this.addEdit = 'edit'
                    this.orderId = data.code
                    this.tags = ['uncheck']
                    this.providerId = data.provider.split('-')[0]
                    this.recTypeId = data.recType
                    this.BaseMessageObj = { ...data }
                    if (res.data.list.length !== 0) {
                        this.addEditModel = true
                        const detail = await axios({
                            path: 'DistributionBillPreEntryGet',
                            method: 'post',
                            body: {
                                id: data.id
                            }
                        })
                        if (detail.flag === 1) {
                            const { abs } = this.$math
                            console.log('编辑详情', detail.data)
                            const editArr = detail.data.preEntryDetaillist
                            editArr.forEach(i => {
                                i.skuUnit = i.basicUnit
                                i.skuModel = i.model
                                if (data.recType === 'bill_pre_entry_rec_type:2') {
                                    i.recN = abs(i.recN, 0)
                                }
                            })
                            this.categoryinfoData = editArr
                            this.taIndex(this.categoryinfoData)
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            } else {
                this.BaseMessageObj = {
                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    recDt: moment(),
                    recType: 'bill_pre_entry_rec_type:1',
                    chargeUser: `${this.$store.getters.userInfo.code}-${this.$store.getters.userInfo.name}`
                }
                this.orderId = ''
                this.tags = []
                this.providerId = ''
                this.storageType = 'receivableInAdvance'
                this.recTypeId = 'bill_pre_entry_rec_type:1'
                this.addEditModel = true
                this.$nextTick(() => {
                    this.form.setFieldsValue({ verificationStatus: 'bill_pre_entry_verification:1' })
                })
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
                    this.$message.warning(`请添加预收/退货商品!`)
                    return
                }
                for (const i of newData) {
                    if (i.recN === 0 || !i.recN) {
                        this.$message.warning(`商品编码为${i.skuCode}发生数量为0，请输入发生数量!`)
                        return
                    }
                }
                let addArr = {}
                values.provider = values.provider.split('-')[0]
                values.storeCode = values.storeCode.split('-')[0]
                values.makeUser = values.makeUser.split('-')[0]
                values.recDt = moment(values.recDt).format('YYYY-MM-DD')
                values.chargeUser = values.chargeUser ? values.chargeUser.split('-')[0] : ''
                addArr = Object.assign(values, { billPreEntryDetailList: newData })
                if (this.addEdit === 'edit') {
                    addArr = Object.assign(addArr, { id: this.rowId })
                }
                if (!err) {
                    this.submitLoading = true
                    axios({
                        path: this.$props.code ? 'DistributionBillPreEntryUpdate' : 'DistributionBillPreEntryAdd',
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
        goodsAdd (e) {
            if (!this.providerId) {
                this.$message.warning('请选择供应商！')
            } else if (!this.recTypeId) {
                this.$message.warning('请选择类型！')
            } else {
                this.storeQuery = true
                this.pamsBounced = {
                    storeCode: this.$store.getters.storeInfo.code,
                    provider: this.providerId,
                    recType: this.recTypeId

                }
                this.flagObj = {
                    url: true,
                    flag: 1
                }
            }
        },
        recTypeChange (e) {
            console.log(e)
            this.recTypeId = e
            this.flag = true
        },
        /**
         * @name: 监听表格正数编辑
         * @msg:
         * @param {type}
         * @return:
         */
        InputChangeJust (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            const target = newData.filter(item => count === item.skuCode)[0]
            if (target) {
                target[col] = val
                this.categoryinfoData = newData
            }
        },
        onSelectBounced (arr) {
            console.log(arr, '选择商品')
            const error = []
            arr.forEach(i => {
                const has = this.categoryinfoData.filter(o => o.skuCode === i.skuCode)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        skuCode: i.skuCode,
                        skuName: i.skuName,
                        skuModel: i.skuModel,
                        brandName: i.brandName,
                        brandCode: i.brandCode,
                        skuUnit: i.skuUnit,
                        recN: 0,
                        // barCode: i.barCode,
                        ptIn: i.stockPrice
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
            this.taIndex(this.categoryinfoData)
        },
        /**
         * @name: 负责人
         * @msg:
         * @param {type}
         * @return:
         */
        // applicant () {
        //     axios({
        //         path: 'PermissionsUserFindOption',
        //         method: 'post',
        //         body: {},
        //         headers: {}
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             console.log('获取负责人', res.data)
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.applicantArr = [...data]
        //         }
        //     })
        // },
        /**
         * @name: 类型
         * @msg:
         * @param {type}
         * @return:
         */
        recTypeFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_pre_entry_rec_type'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取类型', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.recTypeArr = [...data]
                }
            })
        },
        /**
         * @name: 核销类型
         * @msg:
         * @param {type}
         * @return:
         */
        verificationStatusFun () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'bill_pre_entry_verification'
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    console.log('获取类型', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.verificationStatusArr = [...data]
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
        /** 禁用时间
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).add(1, 'days').isBefore()
        },
        /**
         * @name: 获取供应商
         * @msg:
         * @param {type}
         * @return:
         */
        // providerFun () {
        //     axios({
        //         path: 'CustomerSupplierFindOption',
        //         method: 'post',
        //         body: {},
        //         headers: {}
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             console.log('获取供应商', res.data)
        //             res.data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.providerArr = [...res.data]
        //         }
        //     })
        // },
        theGoodsLocation (e) {
            this.providerId = e
            this.flag = true
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    },
    watch: {
        value (val) {
            if (val) {
                // this.providerFun()
                // this.applicant()
                this.recTypeFun()
                this.verificationStatusFun()
                this.getData(this.$props.code)
            }
        },
        addEditModel (val) {
            if (!val) {
                this.$emit('input', false)
            }
        },
        providerId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flag) {
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    recDt: moment(),
                                    recType: 'bill_pre_entry_rec_type:1',
                                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                                that.$nextTick(() => {
                                    that.form.setFieldsValue({ verificationStatus: 'bill_pre_entry_verification:1' })
                                })
                            },
                            onCancel () {
                                console.log(oldval)
                                that.providerId = oldval
                                that.form.setFieldsValue({ provider: oldval })
                            }
                        })
                    }
                }
                this.flag = false
            }
        },
        recTypeId: {
            handler (val, oldval) {
                console.log(val, oldval)
                if (this.flag) {
                    if (val === 'bill_pre_entry_rec_type:1') {
                        this.storageType = 'receivableInAdvance'
                    } else {
                        this.storageType = 'salesReturn'
                    }
                    if (this.categoryinfoData.length !== 0) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '已存在明细数据，是否清空?',
                            onOk () {
                                that.BaseMessageObj = {
                                    recDt: moment(),
                                    makeTime: moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                                that.categoryinfoData = []
                            },
                            onCancel () {
                                console.log(oldval, '----------------')
                                that.recTypeId = oldval
                                that.form.setFieldsValue({ recType: oldval })
                            }
                        })
                    }
                }
                this.flag = false
            }
        }
    }
}
</script>

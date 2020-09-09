<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @LastEditors: haile
 * @Date: 2019-04-18 15:07:08
 * @LastEditTime: 2019-08-20 19:58:42
 -->
<template>
  <div class="order">
    <div class="home" @click="isChange(0)">
      <a-icon type="home" />首页
    </div>
    <a-tabs :defaultActiveKey="activeKey" @change="callback">
      <a-tab-pane tab="未提交" key="0">
        <div class="haveNot">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
        </div>
        <div class="goods-list">
          <a-table
            :columns="columns"
            :dataSource="data"
            expandRowByClick
            :loading="loading"
            :pagination="false"
            class="goods-i">

            <a-button slot="action" type="primary" slot-scope="record" @click.stop="addGoods(record)" size="small" >追加商品</a-button>
            <div slot="expandedRowRender" slot-scope="record,index" style="margin: 0" class="good-item">
              <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                <a-checkbox
                  @change="onChangeGood(record,goods,index,$event)"
                  :indeterminate="goods.indeterminate"
                  :checked="goods.checkAll"></a-checkbox>
                <div class="goods-d">
                  <img v-if="goods.goodPic[0]" @error.once="moveErrorImg($event)" :src="goods.goodPic[0]" alt="">
                  <img v-else src="@assets/goods.png" alt="">
                  <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  <a-button @click="editorDetail(record,i)">编辑</a-button>
                </div>
                <a-table
                  :columns="itemColumns"
                  :pagination="false"
                  :rowSelection="{selectedRowKeys: selectedRowKeys[record.code+goods.goodCode],onSelect:onSelect, onChange: onSelectChange,hideDefaultSelections:true ,getCheckboxProps:()=>record,index}"
                  :dataSource="goods.wholesaleOrderDetailList"
                  class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                </a-table>
              </div>
              <div class="goods-footer">
                <p>
                  收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                </p>
                <div class="price">
                  <a-checkbox
                    @change="onChange(record,index,$event)"
                    :indeterminate="record.indeterminate"
                    :checked="record.checkAll">全选</a-checkbox>
                  <span style="color:red;cursor:pointer;" @click="deleteOrder(record,index)">删除</span>
                  <div>
                    SKU种类：<span>{{ record.skuNum }}</span>
                    数量总计：<span>{{ record.totalNum }}</span>
                    合计金额：<span>{{ record.saleAmount }}</span>
                    <a-button type="primary" @click="updateCommitOrde(record)">提交订单</a-button>
                  </div>
                </div>
              </div>
            </div>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="已提交" key="1">
        <div class="submitted">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>

              </a-select>

              <!-- <a-input
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称"
              /> -->
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
          <div class="goods-list">
            <a-table
              :columns="columns1"
              :dataSource="data"
              expandRowByClick
              :loading="loading"
              :pagination="false"
              class="goods-i">
              <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
                <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                  <div class="goods-d">
                    <img v-if="goods.goodPic[0]" @error.once="moveErrorImg($event)" :src="goods.goodPic[0]" alt="">
                    <img v-else src="@assets/goods.png" alt="">
                    <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  </div>
                  <a-table
                    :columns="itemColumns"
                    :pagination="false"
                    :dataSource="goods.wholesaleOrderDetailList"
                    class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  </a-table>
                </div>
                <div class="goods-footer">
                  <p>
                    收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                  </p>
                  <div class="price">
                    <div>
                      SKU种类：<span>{{ record.skuNum }}</span>
                      数量总计：<span>{{ record.totalNum }}</span>
                      合计金额：<span>{{ record.saleAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-table>
          </div>
        </div>

      </a-tab-pane>
      <a-tab-pane tab="已开票" key="2">
        <div class="submitted">
          <a-form
            layout="inline"
            :form="form"
            :label-col="'100px'"
            @submit="handleSubmit"
          >
            <a-form-item
              label="客户编码/名称"
            >
              <a-select
                style="width: 200px"
                allowClear
                showSearch
                v-decorator="[
                  'searchParam'
                ]"
                placeholder="请输入客户编码/名称 "
              >
                <a-select-option :value="el.code" v-for="el in customerCodeArr" :key="el.code">{{ el.code+'-'+el.name }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="单号"
            >
              <a-input
                v-decorator="[
                  'code'
                ]"
                placeholder="请输入单号"
              />
            </a-form-item>
            <a-form-item
              label="下单时间"
            >
              <a-date-picker
                v-decorator="['startTime', {initialValue:timer.startTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>
            <a-form-item
              label="至"
            >
              <a-date-picker
                v-decorator="['endTime', {initialValue:timer.endTime}]"
                :format="'YYYY-MM-DD'"
                show-time
              />
            </a-form-item>

            <a-form-item
              :wrapper-col="{ span: 12, offset: 5 }"
            >
              <a-button
                type="primary"
                html-type="submit"
              >
                搜索
              </a-button>
            </a-form-item>
          </a-form>
          <div class="goods-list">
            <a-table
              :columns="columns1"
              :dataSource="data"
              expandRowByClick
              :loading="loading"
              :pagination="false"
              class="goods-i">
              <div slot="expandedRowRender" slot-scope="record" style="margin: 0" class="good-item">
                <div class="item-list" v-for="(goods,i) in record.wholesaleGoodList" :key="i">
                  <div class="goods-d">
                    <img v-if="goods.goodPic[0]" @error.once="moveErrorImg($event)" :src="goods.goodPic[0]" alt="">
                    <img v-else src="@assets/goods.png" alt="">
                    <p>{{ goods.goodName }} {{ goods.goodCode }} {{ goods.skuModel }}</p>
                  </div>
                  <a-table
                    :columns="itemColumns"
                    :pagination="false"
                    :dataSource="goods.wholesaleOrderDetailList"
                    class="item-table">
                  <!-- <span slot="billQuantity" slot-scope="text, record">
                    <a-input-number :min="0" v-model="record.billQuantity" @change="onChange" />
                  </span> -->
                  </a-table>
                </div>
                <div class="goods-footer">
                  <p>
                    收货地址：<span>{{ record.receiveCustomerAddress }}</span><span>{{ record.receiveCustomerName }}</span><span>{{ record.receiveCustomerPhone }}</span>
                  </p>
                  <div class="price">
                    <div>
                      SKU种类：<span>{{ record.skuNum }}</span>
                      数量总计：<span>{{ record.totalNum }}</span>
                      合计金额：<span>{{ record.saleAmount }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { axios } from '@/utils/request'
import userPhoto from '@assets/goods.png'

export default {
    name: 'OrderStatus',
    components: {
        seachBox
    },
    props: {
        isSpecial: {
            type: String,
            default: ''
        },
        customer: {
            type: String,
            default: ''
        },
        customerCode: {
            type: String,
            default: ''
        },
        goodsId: {
            type: Object,
            default: function () {
                return {}
            }
        },
        salesApproach: {
            type: String,
            default: ''
        },
        warehouse: {
            type: Object,
            default: function () {
                return {}
            }
        },
        packupCode: {
            type: String,
            default: ''
        },
        notSubmittedCount: {
            type: Number,
            default: 0
        },
        skuCount: {
            type: Number,
            default: 0
        },
        isAdd: {
            type: Boolean,
            default: true
        },
        code: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            activeKey: '0',
            timer: {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            },
            form: this.$form.createForm(this),
            columns: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '提货类型', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => `${record.takeType === '1' ? '客户自提' : '集中配送'}` },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                { title: '分销类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => `${record.wholesaleType === '0' ? '经销' : '代销'}` },
                { title: '下单时间', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => `${moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}` },
                {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            columns1: [
                { title: '序号', customRender: (text, record, index) => `${index + 1}` },
                { title: '单号', dataIndex: 'code', key: 'code', width: 200 },
                { title: '下单客户', dataIndex: 'customerName', key: 'customerName', customRender: (text, record, index) => `${record.customerCode}-${record.customerName}` },
                { title: '提货类型', dataIndex: 'takeType', key: 'takeType', customRender: (text, record, index) => `${record.takeType === '1' ? '客户自提' : '集中配送'}` },
                { title: '提货位置', dataIndex: 'takeStoreCode', key: 'takeStoreCode', customRender: (text, record, index) => `${record.takeStoreCode}-${record.takeStoreName}` },
                { title: '分销类型', dataIndex: 'wholesaleType', key: 'wholesaleType', customRender: (text, record, index) => `${record.wholesaleType === '0' ? '经销' : '代销'}` },
                { title: '制单人', dataIndex: 'createBy', key: 'createBy' },
                { title: '制单位置', dataIndex: 'saleStoreName', key: 'saleStoreName' },
                { title: '下单时间', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => `${moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}` }
            ],
            itemColumns: [
                { title: '商品规格', dataIndex: 'skuModel', key: 'skuModel', width: 360, customRender: (text, record, index) => `${record.skuCode + ' ' + record.skuModel + ' ' + record.skuName}` },
                { title: '数量', dataIndex: 'billQuantity', key: 'billQuantity' },
                { title: '分销价(元)', dataIndex: 'billPrice', key: 'billPrice', customRender: (text, record, index) => `${record.billPrice.toFixed(2)}` },
                { title: '优惠活动', dataIndex: 'strategyDefineName', key: 'strategyDefineName' },
                { title: '金额(元)', dataIndex: 'createTime', key: 'createTime', customRender: (text, record, index) => this.$math.mul(record.billPrice, record.billQuantity, 2) }
            ],

            data: [],
            selectedRowKeys: {},
            loading: false,
            keys: [],
            keysPrice: [],
            // 客户列表
            customerCodeArr: []

        }
    },
    computed: {
        ...mapGetters(['storeInfo', 'userInfo'])
    },
    created () {
        this.getCustomerCodeDorpArr()
        console.log(this.$props.isSpecial)
        if (this.$props.isSpecial === '1' && this.customerCode) {
            this.form.setFieldsValue({ searchParam: this.customerCode })
            this.form.setFieldsValue({ startTime: '' })
            this.form.setFieldsValue({ endTime: '' })
            console.log(this.form.getFieldsValue())
        }
    },
    mounted () {
        // console.log(this.warehouse, this.customerCode)
        if (this.$props.isSpecial === '1' && this.customerCode) {
            this.form.setFieldsValue({ searchParam: this.customerCode })
            this.form.setFieldsValue({ startTime: '' })
            this.form.setFieldsValue({ endTime: '' })
        }
        this.findOrderListByParam()
    },
    methods: {
        moveErrorImg: function (event) {
            event.currentTarget.src = userPhoto
        },
        /**
         * @name: 客户
         * @msg:
         * @param {type}
         * @return:
         */
        getCustomerCodeDorpArr () {
            axios({
                path: 'CustomerDistributorsFindBySelected',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)

                    // const dataArr = [...res.data.list]
                    // dataArr.forEach(i => {
                    //     i.title = `${i.code}-${i.name}`
                    //     i.value = i.code
                    //     i.key = i.code
                    // })
                    this.customerCodeArr = res.data.list
                }
            })
        },
        // 追加商品
        async addGoods (el) {
            console.log(el)
            const warehouse = {
                code: el.takeStoreCode,
                name: el.takeStoreName
            }
            await this.$emit('updates', 'customer', el.customerName)
            await this.$emit('updates', 'customerCode', el.customerCode)
            await this.$emit('updates', 'code', el.code)
            await this.$emit('updates', 'salesApproach', el.wholesaleType)
            await this.$emit('updates', 'packupCode', el.takeType)
            await this.$emit('updates', 'warehouse', warehouse)
            this.isChange(0)
        },
        /**
         * @name: tab页切换请求数据
         * @msg:
         * @param {type}
         * @return:
         */
        callback (key) {
            console.log(key)
            // debugger
            // console.log(this.activeKey)
            this.activeKey = key
            // this.form.setFieldsValue({ searchParam: '' })
            // this.form.setFieldsValue({ code: '' })
            // this.form.setFieldsValue({ startTime: moment().startOf('day').subtract({ days: 7 }) })
            // this.form.setFieldsValue({ endTime: moment().startOf('day') })

            this.findOrderListByParam()
        },
        /**
         * @name: 提交按钮
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            e.preventDefault()
            console.log(e)

            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    this.findOrderListByParam()
                }
            })
        },
        // 页面跳转
        isChange (com) {
            this.$emit('activeComponent', com)
        },
        /**
         * @name: 获取列表
         * @msg:
         * @param {type}
         * @return:
         */
        findOrderListByParam () {
            // this.loading = true
            const data = {
                // takeStoreCode: this.warehouse.code,
                createBy: this.userInfo.code,

                saleStoreCode: this.storeInfo.code,

                // customerCode: this.customerCode,
                status: this.activeKey,
                searchParam: this.form.getFieldValue('searchParam'),
                code: this.form.getFieldValue('code'),
                startTime: this.form.getFieldValue('startTime') ? moment(this.form.getFieldValue('startTime')._d).format('YYYY-MM-DD') : '',
                // startTime: '2019-01-01',
                endTime: this.form.getFieldValue('endTime') ? moment(this.form.getFieldValue('endTime')._d).format('YYYY-MM-DD') : ''
            }
            console.log(data)

            axios({
                path: 'DistWholesaleOrderFindOrderListByParam',
                method: 'post',
                body: data
            }).then(res => {
                console.log(res)
                // this.loading = false
                if (res.flag === 1) {
                    if (res.data) {
                        if (this.activeKey === '0') {
                            res.data.forEach(el => {
                                el.saleAmount = 0
                                el.totalNum = 0
                                el.checkAll = false
                                el.indeterminate = false
                                el.skuNum = 0

                                el.wholesaleGoodList.forEach(goods => {
                                    goods.checkAll = false
                                    goods.indeterminate = false
                                    goods.goodPic = goods.goodPic ? goods.goodPic.split(',') : ['']
                                    this.selectedRowKeys[el.code + goods.goodCode] = []
                                })
                            })
                        } else {
                            res.data.forEach(good => {
                                good.saleAmount = 0
                                good.totalNum = 0
                                good.skuNum = 0
                                if (good.wholesaleGoodList) {
                                    good.wholesaleGoodList.forEach((el, index) => {
                                        el.wholesaleOrderDetailList.forEach(item => {
                                            console.log(item.billQuantity, item.billPrice)
                                            good.saleAmount = good.saleAmount + item.billQuantity * item.billPrice
                                            // el.saleAmount =
                                            good.totalNum += item.billQuantity
                                            good.skuNum += 1
                                        })
                                        console.log(el.goodPic)

                                        el.goodPic = el.goodPic ? el.goodPic.split(',') : ['']
                                    })
                                    good.saleAmount = good.saleAmount.toFixed(2)
                                }
                            })
                        }
                        this.data = []
                        this.$nextTick(() => {
                            this.data = res.data
                        })

                        console.log(this.data)
                    } else {
                        this.data = []
                    }

                    // this.data[0].wholesaleOrderDetailList.push(this.data[0].wholesaleOrderDetailList[0])
                }
            })
        },
        /**
         * @name: 选择
         * @msg:
         * @param {type}
         * @return:
         */
        onSelectChange (selectedRowKeys, selectedRows) {
            // console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows)
            this.keys = selectedRowKeys
        },
        /**
         * @name: 全选
         * @msg:
         * @param {type}
         * @return:
         */
        onChangeGood (row, good, index, e) {
            console.log(row, index)
            const codelist = []
            good.wholesaleOrderDetailList.forEach((el, index) => {
                codelist.push(index)
            })
            this.selectedRowKeys[row.code + good.goodCode] = e.target.checked ? codelist : []
            this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            good.checkAll = e.target.checked
            good.indeterminate = false
            row.indeterminate = row.wholesaleGoodList.every(f => f.checkAll === true) ? false : row.wholesaleGoodList.some(f => f.checkAll === true)
            row.checkAll = row.wholesaleGoodList.every(f => f.checkAll === true)
            console.log(row.wholesaleGoodList.every(f => f.checkAll === true), row.wholesaleGoodList.some(f => f.checkAll === true))

            // console.log(this.selectedRowKeys)

            console.log(this.selectedRowKeys[row.code + good.goodCode])

            if (e.target.checked) {
                console.log(row.saleAmount)
                row.saleAmount = parseFloat(row.saleAmount)
                good.wholesaleOrderDetailList.forEach(item => {
                    console.log(item.billQuantity, item.billPrice)
                    row.saleAmount = row.saleAmount + item.billQuantity * item.billPrice
                    // el.saleAmount =
                    row.totalNum += item.billQuantity
                    row.skuNum += 1
                })
                console.log(row.saleAmount)

                row.saleAmount = row.saleAmount.toFixed(2)
            } else {
                row.saleAmount = parseFloat(row.saleAmount)
                good.wholesaleOrderDetailList.forEach(item => {
                    console.log(item.billQuantity, item.billPrice)
                    row.saleAmount = row.saleAmount - item.billQuantity * item.billPrice
                    // el.saleAmount =
                    row.totalNum = row.totalNum - item.billQuantity
                    row.skuNum = row.skuNum - 1
                })
                row.saleAmount = row.saleAmount.toFixed(2)
            }
        },

        /**
         * @name: 全选
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (row, index, e) {
            console.log(row, index)
            // this.selectedRowKeys[row.code] = []wholesaleGoodList
            this.data[index].wholesaleGoodList.forEach((el, index) => {
                el.checkAll = e.target.checked
                el.indeterminate = false
                const codelist = []
                el.wholesaleOrderDetailList.forEach((el, index) => {
                    codelist.push(index)
                })
                this.selectedRowKeys[row.code + el.goodCode] = e.target.checked ? codelist : []
            })

            // this.data[index].wholesaleOrderDetailList.forEach((el, index) => {
            //     codelist.push(index)
            // })
            this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            row.checkAll = e.target.checked
            row.indeterminate = false
            console.log(this.selectedRowKeys)
            row.saleAmount = 0
            row.totalNum = 0
            row.skuNum = 0

            console.log(this.selectedRowKeys[row.code])
            if (e.target.checked) {
                row.wholesaleGoodList.forEach((el, index) => {
                    el.wholesaleOrderDetailList.forEach(item => {
                        console.log(item.billQuantity, item.billPrice)
                        row.saleAmount = row.saleAmount + item.billQuantity * item.billPrice
                        // el.saleAmount =
                        row.totalNum += item.billQuantity
                        row.skuNum += 1
                    })
                })
                row.saleAmount = row.saleAmount.toFixed(2)
            } else {
                row.saleAmount = 0
                row.totalNum = 0
                row.skuNum = 0
            }

            // this.selectedRowKeys
        },
        /**
         * @name: 单选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (record, selected, selectedRows, nativeEvent) {
            console.log(record, selected, selectedRows, nativeEvent)
            // console.log(this.keys)
            if (this.keys.length > 0) {
                this.selectedRowKeys[record.wholesaleOrderCode + record.goodCode] = []
                this.selectedRowKeys[record.wholesaleOrderCode + record.goodCode] = this.keys
                this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            } else {
                this.selectedRowKeys[record.wholesaleOrderCode + record.goodCode] = []
                this.selectedRowKeys = Object.assign({}, this.selectedRowKeys)
            }
            this.data.forEach((el) => {
                // debugger
                if (record.wholesaleOrderCode === el.code) {
                    el.wholesaleGoodList.forEach(item => {
                        if (record.goodCode === item.goodCode) {
                            if (item.wholesaleOrderDetailList.length === this.keys.length) {
                                item.checkAll = true
                                item.indeterminate = false
                                // console.log(el.wholesaleGoodList.every(f => f.checkAll === true),);

                                el.indeterminate = el.wholesaleGoodList.every(f => f.checkAll === true) ? false : el.wholesaleGoodList.some(f => f.checkAll === true)
                                el.checkAll = el.wholesaleGoodList.every(f => f.checkAll === true)
                            } else if (item.wholesaleOrderDetailList.length > this.keys.length && this.keys.length > 0) {
                                item.checkAll = false
                                item.indeterminate = true
                                el.indeterminate = true
                                el.checkAll = false
                            } else {
                                item.checkAll = false
                                item.indeterminate = false
                                console.log(el.wholesaleGoodList.some(f => f.checkAll === true) || el.wholesaleGoodList.some(f => f.indeterminate === true))
                                el.indeterminate = el.wholesaleGoodList.some(f => f.checkAll === true) || el.wholesaleGoodList.some(f => f.indeterminate === true)
                                el.checkAll = false
                            }
                            if (selected) {
                                console.log(el.saleAmount)
                                el.saleAmount = parseFloat(el.saleAmount)
                                // selectedRows.forEach(item => {
                                console.log(record.billQuantity, record.billPrice)
                                el.saleAmount = el.saleAmount + record.billQuantity * record.billPrice
                                // el.saleAmount =
                                el.totalNum += record.billQuantity
                                el.skuNum += 1
                                // })
                                console.log(el.saleAmount)

                                el.saleAmount = el.saleAmount.toFixed(2)
                            } else {
                                el.saleAmount = parseFloat(el.saleAmount)
                                // selectedRows.forEach(item => {
                                console.log(record.billQuantity, record.billPrice)
                                el.saleAmount = el.saleAmount - record.billQuantity * record.billPrice
                                // el.saleAmount =
                                el.totalNum = el.totalNum - record.billQuantity
                                el.skuNum = el.skuNum - 1
                                // })
                                el.saleAmount = el.saleAmount.toFixed(2)
                            }
                        }
                    })
                }
            })
            this.data = Object.assign([], this.data)
            console.log(this.data)
        },
        // 跳转详情页面 并更新详情页面数据
        async editorDetail (row, index) {
            console.log(row)

            const el = JSON.parse(JSON.stringify(row)).wholesaleGoodList[index]
            // row. = { ...el }
            Object.assign(row, el)
            delete row.wholesaleGoodList
            // await this.$store.dispatch('setGoodsId', row)
            await this.$emit('updates', 'goodsId', row)

            // this.$store.dispatch('isAdd', false)
            await this.$emit('updates', 'isAdd', false)

            this.isChange(1)
        },
        /**
         * @name: 提价订单
         * @msg:
         * @param {type}
         * @return:
         */
        updateCommitOrde (record) {
            console.log(record)
            // if (this.totalNUm > 0) {
            const list = []
            const data = JSON.parse(JSON.stringify(record))
            data.wholesaleGoodList.forEach(el => {
                this.selectedRowKeys[record.code + el.goodCode].forEach(index => {
                    list.push(el.wholesaleOrderDetailList[index])
                })
            })
            delete data.wholesaleGoodList
            data.wholesaleOrderDetailList = list
            console.log(data)

            if (record.totalNum > 0) {
                axios({
                    path: 'DistWholesaleOrderUpdateCommitOrder',
                    method: 'post',
                    body: {
                        wholesaleOrderVoList: [data]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.findOrderListByParam()
                    }
                    // this.skuCount = res.data.orderCount
                })
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择商品！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
            // }
        },
        /**
         * @name: 删除 订单
         * @msg:
         * @param {type}
         * @return:
         */
        deleteOrder (record, index) {
            // const data = JSON.parse(JSON.stringify(record))
            const data = {
                code: record.code,
                wholesaleOrderDetailList: []
            }
            record.wholesaleGoodList.forEach(el => {
                this.selectedRowKeys[record.code + el.goodCode].forEach(index => {
                    // list.push(el.wholesaleOrderDetailList[index])
                    data.wholesaleOrderDetailList.push({
                        skuCode: el.wholesaleOrderDetailList[index].skuCode,
                        wholesaleOrderCode: el.wholesaleOrderDetailList[index].wholesaleOrderCode
                    })
                })
            })

            console.log(data)
            if (data.wholesaleOrderDetailList.length > 0) {
                axios({
                    path: 'DistWholesaleOrderDeleteOrder',
                    method: 'post',
                    body: data
                }).then(res => {
                    if (res.flag === 1) {
                        this.$message.success(
                            res.message
                        )
                        this.findOrderListByParam()
                    }
                // this.skuCount = res.data.orderCount
                })
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择要删除的项！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        }
    }
}
</script>
<style lang="less" scoped>
.order{
    position: relative;
    background-color: #fff;
    >.home{
        color: #fff;
        width: 80px;
        height: 30px;
        border-radius: 3px;
        position: absolute;
        line-height: 30px;
        text-align: center;
        background: #1790ff;
        right: 5px;
        top: 7px;
        cursor: pointer;
        z-index:2;
    }
    .haveNot{
        // height: 60px;
        // overflow: hidden;
        background-color: #fff;
    }
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
        .item-list{
                width: 100%;
                padding-left: 14px;
                clear: both;
                border: 1px solid #e8e8e8;
                overflow: hidden;
            /deep/ .ant-table-thead   .ant-table-selection{
                display: none;
            }
            >.ant-checkbox-wrapper{
                float: left;
                line-height: 220px;
            }
            .goods-d{
                width: 250px;
                height: 220px;
                float: left;
                text-align: center;
                padding: 23px 0;
                border-left: 1px solid #e8e8e8;
                border-right: 1px solid #e8e8e8;
                border-bottom: 1px solid #e8e8e8;
                margin-left: 10px;
                >img{
                    width: 150px;
                    height: 100px;
                }
                >p{
                    color: #666;
                    margin: 10px 0;
                }
                >.ant-btn-default{
                    border-radius: 0;
                    border:none;
                    color: #1790ff;
                    background-color: transparent;
                    box-shadow: none;
                }
            }
            .item-table{
                float: left;
                width: calc(100% - 290px );
                border-left: 1px solid #e8e8e8;
            }
        }
        .goods-footer{
            clear: both;
            >p{
                height: 46px;
                line-height: 46px;
                margin: 0;
                padding-left: 10px;
                >span{
                    display: inline-block;
                    margin-right: 16px;
                }
            }
            .price{
                height: 50px;
                line-height: 50px;
                background-color: #E7E7E7;
                padding: 0 0 0 10px;
                >div{
                    float: right;
                    >span{
                        color: #1890ff;
                        display: inline-block;
                        margin-right: 10px;
                    }
                    .ant-btn-primary{
                        height: 50px;
                        border: none;
                        line-height: 50px;
                        padding:0 30px;
                        border-radius: 0;
                    }
                }
            }
        }

    }
    .submitted{
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
            .item-list{
                height: 220px;
                // padding-left: 14px;
                padding-left: 0;
                border: 1px solid #e8e8e8;
                /deep/ .ant-table-thead   .ant-table-selection{
                    display: none;
                }
                >.ant-checkbox-wrapper{
                    float: left;
                    line-height: 220px;
                }
                .goods-d{
                    width: 250px;
                    height: 220px;
                    float: left;
                    text-align: center;
                    padding: 23px 0;
                    border-left: 1px solid #e8e8e8;
                    border-right: 1px solid #e8e8e8;
                    margin-left: 0px;
                    >img{
                        width: 150px;
                        height: 100px;
                    }
                    >p{
                        color: #666;
                        margin: 10px 0;
                    }
                    >.ant-btn-default{
                        border-radius: 0;
                        border:none;
                        color: #1790ff;
                        background-color: transparent;
                        box-shadow: none;
                    }
                }
                .item-table{
                    float: left;
                    width: calc(100% - 250px )
                }
            }
            .goods-footer{
                clear: both;
                >p{
                    height: 46px;
                    line-height: 46px;
                    margin: 0;
                    padding-left: 10px;
                    >span{
                        display: inline-block;
                        margin-right: 16px;
                    }
                }
                .price{
                    height: 50px;
                    line-height: 50px;
                    background-color: #E7E7E7;
                    padding: 0 10px 0 10px;
                    >div{
                        float: right;
                        >span{
                            color: #1890ff;
                            display: inline-block;
                            margin-right: 10px;
                        }
                        .ant-btn-primary{
                            height: 50px;
                            border: none;
                            line-height: 50px;
                            padding:0 30px;
                            border-radius: 0;
                        }
                    }
                }
            }
        }
    }
}
ul{
    margin: 0;
    padding: 0;
}
li{
    margin: 0;
    padding: 0;
    list-style: none;
}
</style>

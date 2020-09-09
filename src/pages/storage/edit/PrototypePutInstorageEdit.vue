<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-08-12 15:21:20
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-23 15:00:28
 -->
 <!-- 样机入库 -->
<template>
  <div>
    <bt-modal
      v-model="clientVisible"
      title="样机入库"
      :popconfirm="false"
      :loading="loading"
      :orderId="orderId"
      :tags="tags"
      :submitClick="submitData">
      <a-form :form="form">
        <h4 class="baseInfo">基础信息</h4>
        <a-row class="doc">
          <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input
                style="width: 100%"
                v-decorator="$check('bill_entry.provider', {initialValue:billsForm.provider})"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.sourceCode',{initialValue:billsForm.sourceCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeStoreCode',{initialValue:billsForm.makeStoreCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">收货位置</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.storeCode',{initialValue:billsForm.storeCode || `${$store.getters.storeInfo.code}-${$store.getters.storeInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-textarea v-decorator="$check('bill_entry.note',{initialValue:billsForm.note})" :autosize="{ minRows: 1, maxRows: 2 }" />
            </a-form-item>
          </a-col>
        </a-row> -->
        <h4 class="baseInfo">入库明细</h4>
        <a-table
          rowKey="skuCode"
          size="small"
          :columns="columns"
          :dataSource="billsData"
          bordered
          :pagination="false"
          :scroll="{x:1500, y: 350}">
        </a-table>
        <h4 class="baseInfo">落款信息</h4>
        <a-row class="doc textLenght">
          <a-col :sm="8" :md="4" :xl="3">制单人</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeUserno', {initialValue:billsForm.makeUserno || `${$store.getters.userInfo.code}-${$store.getters.userInfo.name}`})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :sm="8" :md="4" :xl="3">制单时间</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-input v-decorator="$check('bill_entry.makeDt', {initialValue: billsForm.makeDt || makeTime} )" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import BtModal from '@comp/Modal'
import moment from 'moment'
const columns = [
    { title: '序号', dataIndex: 'index', width: 50, align: 'center' },
    { title: '入库数量', dataIndex: 'recN', width: 80, align: 'right', scopedSlots: { customRender: 'recN' } },
    { title: 'SKU编码', dataIndex: 'skuCode', width: 90 },
    { title: 'SKU名称', dataIndex: 'skuName', width: 300 },
    { title: '规格型号', dataIndex: 'skuModel', width: 300 },
    { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
    { title: '品牌名称', dataIndex: 'brandName', width: 100 },
    { title: '单位', dataIndex: 'skuUnit', width: 50 },
    { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } }
]
export default {
    components: {
        BtModal
    },
    data () {
        return {
            columns,
            orderId: '',
            tags: [],
            billsForm: {},
            billsData: [],
            providerList: [],
            selectedRowKeys: [],
            loading: false,
            clientVisible: false,
            form: this.$form.createForm(this),
            makeTime: moment().format('YYYY-MM-DD hh:mm:ss')
        }
    },
    props: {
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
                this.getData(this.$props.code)
                console.log(val, '555555555555555555')
            }
        },
        clientVisible (val) {
            if (!val) {
                this.$emit('input', false)
            }
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
         * @name: 打开弹窗
         */
        async getData (code) {
            console.log(code, 'code')
            this.billsData = []
            if (code) {
                const res = await axios({
                    path: 'SampleSampleEntryFindEntry',
                    method: 'post',
                    body: {
                        code: code
                    }
                })
                if (res.flag === 1) {
                    const data = res.data.list[0]
                    this.orderId = data.code
                    this.tags = ['confirm']
                    this.billsForm = {
                        id: data.id,
                        provider: `${data.provider}-${data.providerName}`,
                        sourceCode: data.originalCode,
                        makeStoreCode: `${data.makeStoreCode}-${data.makeStoreName}`,
                        storeCode: `${data.storeCode}-${data.storeName}`,
                        makeUserno: `${data.makeUserno}-${data.makeUserName}`,
                        makeDt: data.makeDt
                    }
                    if (res.data.list.length !== 0) {
                        this.clientVisible = true
                        const detail = await axios({
                            path: 'SampleSampleEntryFindEntryDetail',
                            method: 'post',
                            body: {
                                id: data.id
                            }
                        })
                        if (detail.flag === 1) {
                            this.billsData = [...detail.data]
                            this.taIndex(this.billsData)
                        }
                    } else {
                        this.$message.warning('查询失败,未查到当前选中数据!')
                    }
                }
            }
        },
        /**
           * @name:提交
           */
        submitData (id) {
            this.loading = true
            axios({
                path: 'SampleSampleEntryAuditEntry',
                method: 'post',
                body: {
                    id: this.billsForm.id
                }
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    console.log(res)
                    this.clientVisible = false
                }
            })
        },
        /**
         * @name: 删除
         */
        onDelete (del) {
            if (this.selectedRowKeys.length < 1) { return this.$message.warning('您尚未选中数据!') }
            const that = this
            this.$confirm({
                title: '删除',
                content: '是否确认删除当前选中信息?',
                okText: '是',
                cancelText: '否',
                onOk () {
                    that.categoryinfoDelete(del)
                },
                onCancel () {

                }
            })
        },
        /**
         * @name:单据表格删除
         */
        categoryinfoDelete (del) {
            console.log(del, '单据删除')
            if (del === -1) {
                const categoryinfoData = [...this.billsData]
                for (const i in this.selectedRowKeys) {
                    for (const j in categoryinfoData) {
                        if (categoryinfoData[j].skuCode === this.selectedRowKeys[i]) {
                            categoryinfoData.splice(j, 1)
                        }
                    }
                }
                this.billsData = categoryinfoData
            } else {
                const categoryinfoData = [...this.billsData]
                this.billsData = categoryinfoData.filter(item => item.skuCode !== del)
            }
            this.selectedRowKeys = []
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 单据表格多选
         */
        onSelectChange (selectedRowKeys) {
            console.log(selectedRowKeys, '多选选中')
            this.selectedRowKeys = selectedRowKeys
        }
    }
}
</script>

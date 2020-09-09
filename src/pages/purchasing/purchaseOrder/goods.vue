<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-26 16:46:17
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择商品"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-col :span="24">
                <a-input addonBefore="编码/名称" placeholder="请输入搜索值" @change="seach" />
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="skuCode"
                  :scroll="{x:1500}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :pagination="pagination"
                  @change="pagingChange"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.skuCode)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.skuName||'未选择'}]-详情` }}</div>
              </template>
              <a-row v-for="(item, index) in details" :key="index">
                <span class="title">{{ `${item.name}：` }}</span>
                <span>{{ cacheObj[item.key] }}</span>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple" :disabled="isNotMulSelect">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    .ant-modal-wrap{
        z-index: 4000;
    }
    .card-box{
        max-height:540px;
        overflow:auto;
        .title{
            font-weight: bold;
        }
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
</style>

<script>
import { axios } from '@/utils/request'
import is from 'is_js'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            pagination: {
                total: 0,
                current: 1,
                pageSize: 12,
                showQuickJumper: true
            },
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '商品编码', dataIndex: 'skuCode', width: 100, scopedSlots: { customRender: 'skuCode' } },
                { title: '商品名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '每包含量', dataIndex: 'orderPack', width: 100, align: 'right' },
                { title: '供价（进货价)', dataIndex: 'stockPrice', width: 100, align: 'right' },
                { title: '零售价', dataIndex: 'skuPrice', width: 100, align: 'right' },
                { title: '商品条码', dataIndex: 'barcode', width: 100 },
                { title: '单位', dataIndex: 'skuUnit', width: 100 },
                { title: '税率', dataIndex: 'skuTaxRates', width: 100, align: 'right' },
                { title: '扣率（%）', dataIndex: 'skuDRates', width: 100, align: 'right' },
                { title: '倒1周', dataIndex: 'saleNWeek1', width: 100, align: 'right' },
                { title: '倒2周', dataIndex: 'saleNWeek2', width: 100, align: 'right' },
                { title: '倒3周', dataIndex: 'saleNWeek3', width: 100, align: 'right' },
                { title: '倒4周', dataIndex: 'saleNWeek4', width: 100, align: 'right' },
                { title: '操作', key: 'operation', fixed: 'right', width: 50, align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '商品编码', key: 'skuCode' },
                { name: '商品名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '商品条码', key: 'barcode' },
                { name: '单位', key: 'skuUnit' },
                { name: '每包含量', key: 'orderPack' },
                { name: '税率', key: 'skuTaxRate' },
                { name: '扣率（%）', key: 'skuDRate' },
                { name: '倒1周', key: 'saleNWeek1' },
                { name: '倒2周', key: 'saleNWeek2' },
                { name: '倒3周', key: 'saleNWeek3' },
                { name: '倒4周', key: 'saleNWeek4' },
                { name: '供价（进货价)', key: 'stockPrice' },
                { name: '零售价', key: 'skuPrice' }
            ],
            isNotSelect: false,
            isSku: ''
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        /**
         * @name: 手动设置表体
         * @msg:
         * @param {type}
         * @return:
         */
        setTableData (data) {
            this.dataSource = data
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e = '') {
            if (e) {
                this.isSku = e.target.value
            }
            this.pagination.current = 1
            console.log(e, '666666666666666')
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    skuCode: this.isSku
                })
            }, 300)
        },
        /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */
        customRow (record, index) {
            return {
                props: {

                },
                on: {
                    click: () => {
                        this.cacheObj = record
                        if (is.empty(this.cacheObj)) {
                            this.isLoading = true
                        } else {
                            this.isLoading = false
                        }
                    },
                    mouseenter: (e) => {
                    }
                }
            }
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.skuCode, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                this.$emit('onSelect', selectDatas)
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (code) {
            const selectDatas = this.dataSource.filter(o => o.skuCode === code)
            if (selectDatas.length > 0) {
                this.$emit('onSelect', [selectDatas[0]])
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
            this.$emit('update:visible', false)
        },
        /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData({
                skuCode: this.isSku
            })
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}) {
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            axios({
                path: 'ProviderSkuSelectProviderSkuOrder',
                method: 'POST',
                body: {
                    barcode: newPams.type,
                    skuCode: newPams.skuCode,
                    providerContractId: newPams.providerContractId,
                    skuProperty: this.$store.getters.storeInfo.code,
                    page: this.pagination.current,
                    rows: this.pagination.pageSize
                }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    const arr = res.data.list
                    arr.forEach(i => {
                        i.skuTaxRates = this.rateTransform(i.skuTaxRate)
                        i.skuDRates = this.rateTransform(i.skuDRate)
                    })
                    this.dataSource = arr
                    this.pagination.total = res.data.total
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

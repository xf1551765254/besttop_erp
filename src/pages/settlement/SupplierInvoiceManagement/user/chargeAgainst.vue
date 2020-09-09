<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-27 10:36:41
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="增加商品"
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
                  rowKey="id"
                  :scroll="{x:480}"
                  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  :pagination="pagination"
                  @change="pagingChange"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.id)" size="small">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.name||'未选择'}]-详情` }}</div>
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
        <a-button @click="() => {$emit('update:visible', false)}" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    @import "../../../../assets/modalStyle.less";
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
    .textLenght {
        textarea {
            resize: none;
        }
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
                pageSize: 13,
                showQuickJumper: true
            },
            rebateSelect: '',
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '商品SKU编码', dataIndex: 'skuCode', width: 100, align: 'center' },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 150, align: 'center' },
                { title: '品类编码', dataIndex: 'classCode', width: 100, align: 'center' },
                { title: '品类名称', dataIndex: 'className', width: 150, align: 'center' },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100, align: 'center' },
                { title: '品牌名称', dataIndex: 'brandName', width: 150, align: 'center' },
                { title: '进货价', dataIndex: 'stockPrice', width: 150, align: 'center' },
                { title: '规格', dataIndex: 'skuModel', width: 150, align: 'center' },
                { title: '单位', dataIndex: 'skuUnit', width: 150, align: 'center' },
                { title: '零售价', dataIndex: 'skuPrice', width: 150, align: 'center' },
                { title: '税率', dataIndex: 'skuTaxRate', width: 100, align: 'center' }
            ],
            dataSource: [],
            datas: {},
            cacheObj: {},
            details: [
                { name: '商品SKU编码', key: 'skuCode' },
                { name: '商品SKU名称', key: 'skuName' },
                { name: '品类编码', key: 'classCode' },
                { name: '品类名称', key: 'className' },
                { name: '品牌编码', key: 'brandCode' },
                { name: '品牌名称', key: 'brandName' },
                { name: '进货价', key: 'stockPrice' },
                { name: '规格', key: 'skuModel' },
                { name: '单位', key: 'skuUnit' },
                { name: '零售价', key: 'skuPrice' },
                { name: '税率', key: 'skuTaxRate' }
            ]
        }
    },
    methods: {
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
        seach (e) {
            if (e) {
                this.rebateSelect = e.target.value
            }
            this.pagination.current = 1
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({ skuCode: this.rebateSelect })
            }, 500)
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData({ skuCode: this.rebateSelect })
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
                        // console.log(e);
                        // console.log(index);
                        // console.log(record);
                        // this.cacheObj = record;
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.id, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                selectDatas.forEach(o => {
                    o.entryDetailId = o.id
                    o.model = o.skuModel
                    o.basicUnit = o.skuUnit
                    o.price = o.skuPrice
                    o.taxRate = o.skuTaxRate
                    o.priceInOrig = o.stockPrice
                    o.priceIn = o.stockPrice
                })
                this.$emit('onSelectForm', selectDatas)
                this.selectedRowKeys.length = 0
            }
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
            this.$emit('update:visible', false)
        },
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (key) {
            const selectDatas = this.dataSource.filter(o => o.id === key)
            if (selectDatas.length > 0) {
                selectDatas.forEach(o => {
                    o.entryDetailId = o.id
                    o.model = o.skuModel
                    o.basicUnit = o.skuUnit
                    o.price = o.skuPrice
                    o.taxRate = o.skuTaxRate
                    o.priceInOrig = o.stockPrice
                })
                this.$emit('onSelectForm', selectDatas)
            }
            this.$emit('update:visible', false)
        },
        /**
         * @name:选中
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (data) {
            this.selectedRowKeys = data
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
            const p = Object.assign({
                page: this.pagination.current,
                rows: this.pagination.pageSize
            }, newPams)
            axios({
                path: 'InvoiceRebateSelectProviderContractSkus',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                console.log(res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
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
            }
        }
    }
}
</script>

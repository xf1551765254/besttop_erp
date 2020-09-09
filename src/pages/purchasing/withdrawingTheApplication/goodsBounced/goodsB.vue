<!--
 * @Description: 商品选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-26 17:17:26
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
        <a-row class="doc">
          <a-col :span="3">SKU编码</a-col>
          <a-col :span="8">
            <a-input
              placeholder="请选输入SKU编码/SKU名称"
              style="width: 100%"
              @change="skuSeach"
              allowClear/>
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :span="3">品牌</a-col>
          <a-col :span="8">
            <a-input
              style="width: 100%"
              placeholder="请输入品牌编码/名称"
              @change="brandSeach"
              allowClear/>
          </a-col>
        </a-row>
        <a-row style="margin-top:10px;">
          <a-col :span="24" class="table-nowrap">
            <a-table
              rowKey="batchId"
              :scroll="{x:950}"
              :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onChange}"
              :columns="columns"
              :pagination="pagination"
              @change="pagingChange"
              :dataSource="dataSource"
              size="small"
              bordered>
            </a-table>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
    @import "../../../../assets/modalStyle.less";
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
                showQuickJumper: true,
                hideOnSinglePage: true
            },
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100 },
                { title: '批次号', dataIndex: 'batchNumber', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '品牌', dataIndex: 'brandName', width: 100 },
                { title: '单位', dataIndex: 'unit', width: 100 },
                { title: '零售价', dataIndex: 'price', width: 100, align: 'right' },
                { title: '税率', dataIndex: 'skuTaxRates', width: 100, align: 'right' },
                { title: '成本价(含税)', dataIndex: 'skuPtCost', width: 150, align: 'right' }
            ],
            dataSource: [],
            skuSeachId: '',
            brandSeachId: ''
        }
    },
    mounted () {},
    methods: {
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        },
        skuSeach (e) {
            console.log(e.target.value)
            this.skuSeachId = e.target.value
            this.seach()
        },
        brandSeach (e) {
            console.log(e.target.value)
            this.brandSeachId = e.target.value
            this.seach()
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            this.pagination.current = 1
            this.seachTimer = setTimeout(() => {
                this.getData({
                    skuCode: this.skuSeachId,
                    brandCode: this.brandSeachId
                })
            }, 800)
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @retuflagObj
         */
        handleOk () {
            const selectDatas = this.dataSource.filter(o => is.inArray(o.batchId, this.selectedRowKeys))
            if (selectDatas.length > 0) {
                this.$emit('onSelect', selectDatas)
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
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (selectedRowKeys) {
            console.table(selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        pagingChange (e) {
            this.pagination.current = e.current
            this.getData({
                skuCode: this.skuSeachId,
                brandCode: this.brandSeachId
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
            const p = Object.assign({
                page: this.pagination.current,
                rows: this.pagination.pageSize
            }, newPams)
            axios({
                path: 'ApplyWithdrawingSelectSkuStockBatchPurchase',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res)
                    res.data.list.forEach(i => {
                        i.skuTaxRates = this.rateTransform(i.rate)
                    })
                    this.dataSource = res.data.list
                    this.pagination.total = res.data.total
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.skuSeachId = ''
                this.brandSeachId = ''
                this.seach()
                this.selectedRowKeys.length = 0
            }
        }
    }
}
</script>

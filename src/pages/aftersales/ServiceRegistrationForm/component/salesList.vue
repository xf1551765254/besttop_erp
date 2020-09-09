<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-05-29 09:23:22
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 16:08:33
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择销售单"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="900"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-form>
                <a-row class="doc">
                  <a-col :span="6">顾客名称/电话</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachName" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">导购名称</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachTelephone" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">销售单号</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachCode" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="bt_web_id"
                  :scroll="{x:2090}"
                  :pagination="{defaultPageSize:10}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record.bt_web_id)" size="small" :disabled="isNotSelect">选择</a-button>
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
                <span v-if="item.key==='skuRate' ">{{ Number(`${cacheObj[item.key]}`*100).toFixed(2) }}</span>
                <span v-else>{{ cacheObj[item.key] }}</span>
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
        // tmp: {
        //     type: String,
        //     default: () => { return {} }
        // }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            isNotSelect: false,
            selectedRowKeys: [],
            columns: [
                { title: '单据号', dataIndex: 'orderId', width: 150 },
                { title: '单据状态', dataIndex: 'statusName', width: 100 },
                { title: '销售位置编码', dataIndex: 'storeCode', width: 100 },
                { title: '销售位置名称', dataIndex: 'storeName', width: 100 },
                { title: 'SKU编码', dataIndex: 'skuCode', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: '数量', dataIndex: 'quantity', width: 100 },
                { title: '顾客名称', dataIndex: 'customerName', width: 100 },
                { title: '顾客电话', dataIndex: 'telephone', width: 100 },
                { title: '顾客地址', dataIndex: 'address', width: 200 },
                { title: '导购编码', dataIndex: 'guideCode', width: 200 },
                { title: '导购名称', dataIndex: 'guideName', width: 200 },
                { title: '制单人编码', dataIndex: 'createBy', width: 100 },
                { title: '制单人名称', dataIndex: 'createByName', width: 100 },
                { title: '制单位置名称', dataIndex: 'makeStoreCode', width: 110 },
                { title: '制单位置编码', dataIndex: 'makeStoreName', width: 110 },
                { title: '制单时间', dataIndex: 'createTime', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '单据号', key: 'orderId' },
                { name: '单据状态', key: 'statusName' },
                { name: '销售位置编码', key: 'storeCode' },
                { name: '销售位置名称', key: 'storeName' },
                { name: 'SKU编码', key: 'skuCode' },
                { name: 'SKU名称', key: 'skuName' },
                { name: '规格型号', key: 'skuModel' },
                { name: '数量', key: 'quantity' },
                { name: '顾客名称', key: 'customerName' },
                { name: '顾客电话', key: 'telephone' },
                { name: '顾客地址', key: 'address' },
                { name: '导购编码', key: 'guideCode' },
                { name: '导购名称', key: 'guideName' },
                { name: '制单人编码', key: 'createBy' },
                { name: '制单人名称', key: 'createByName' },
                { name: '制单位置编码', key: 'makeStoreCode' },
                { name: '制单位置名称', key: 'makeStoreName' },
                { name: '制单时间', key: 'createTime' }
            ],

            customerId: '', // 名称
            guideCode: '', // 电话
            code: ''// 单号
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    mounted () {
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
         * @name: 电话搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachTelephone (e) {
            this.guideCode = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        /**
         * @name: code搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachCode (e) {
            this.code = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        /**
         * @name: 名称搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachName (e) {
            this.customerId = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.bt_web_id, this.selectedRowKeys))
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
        select (key) {
            const selectDatas = this.dataSource.filter(o => o.bt_web_id === key)
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
            // console.table(selectedRowKeys, '监听')
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData () {
            const pams = {
                guideCode: this.guideCode,
                code: this.code,
                customerId: this.customerId
            }
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 10
            }, newPams)
            // console.log(pams, '测试')
            axios({
                path: 'TroubleApplyFindSaleRecord',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                // console.log(6666666, res)
                if (res.flag === 1) {
                    this.dataSource = res.data
                    console.log(res.data)
                    for (const i of this.dataSource) {
                        i.bt_web_id = i.id
                    }
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seachCode({ target: { value: '' } })
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

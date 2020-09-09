<!--
 * @Description: 要货单组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-06-22 13:47:06
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="要货单选择"
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
          <a-col :span="3">要货单号</a-col>
          <a-col :span="8">
            <a-input
              placeholder="请选输入要货单号"
              style="width: 100%"
              @change="skuSeach"
              allowClear/>
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :span="3">审核时间</a-col>
          <a-col :span="8">
            <a-range-picker
              style="width: 100%"
              @change="supplierSeach"
              allowClear/>
          </a-col>
        </a-row>
        <a-row style="margin-top:10px;">
          <a-col :span="24" class="table-nowrap">
            <a-table
              rowKey="id"
              :scroll="{x:800}"
              :columns="columns"
              :dataSource="dataSource"
              :pagination="{defaultPageSize:8}"
              size="small"
              bordered>
              <a-button slot="action" slot-scope="record" @click="select(record.code)" size="small" :disabled="isNotSelect">选择</a-button>
            </a-table>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
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
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        },
        defaultSelect: {
            type: Array,
            default: () => []
        },
        flagObj: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            columns: [
                { title: '要货单号', dataIndex: 'code', width: 100 },
                { title: '收货位置', dataIndex: 'toStoreCode', width: 100 },
                { title: '出货位置', dataIndex: 'fromStoreCode', width: 100 },
                { title: '制单时间', dataIndex: 'createTime', width: 100 },
                { title: '制单人', dataIndex: 'createBy', width: 100 },
                { title: '审核时间', dataIndex: 'auditTime', width: 100 },
                { title: '审核人', dataIndex: 'auditBy', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 80, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            skuSeachId: '',
            supplierSeachId: '',
            isNotSelect: false
        }
    },
    mounted () {
    },
    methods: {
        /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
        select (code) {
            const selectDatas = this.dataSource.filter(o => o.code === code)
            const objReturn = Object.assign({ objArr: [selectDatas[0]] }, { obj: 'empty' })
            if (selectDatas.length === 0) {
                this.$message.warning('请选择商品！')
            } else {
                if (this.flagObj.flagLength === 0) {
                    this.$emit('onSelect', objReturn)
                    this.$emit('update:visible', false)
                } else {
                    if (!this.flagObj.sourceCode) {
                        const that = this
                        this.$confirm({
                            title: '提示',
                            content: '该操作将清空已选的负责人，商品明细等信息，是否继续?',
                            onOk () {
                                that.$emit('onSelect', objReturn)
                                that.$emit('update:visible', false)
                            },
                            onCancel () {}
                        })
                    } else {
                        this.$emit('onSelect', objReturn)
                        this.$emit('update:visible', false)
                    }
                }
            }
        },
        skuSeach (e) {
            console.log(e.target.value)
            this.skuSeachId = e.target.value
            this.seach()
        },
        supplierSeach (e) {
            console.log(e)
            this.supplierSeachId = e
            this.seach()
        },
        /**
         * @name: 模糊搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            this.seachTimer = setTimeout(() => {
                this.getData({
                    code: this.skuSeachId,
                    auditTimeA: this.supplierSeachId[0],
                    auditTimeB: this.supplierSeachId[1]
                })
            }, 500)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.$emit('update:visible', false)
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
                page: 1,
                rows: 9999,
                // makeStoreCode
                billStatus: 'bill_requ_bill_status:2'
            }, newPams)
            axios({
                path: 'DistributionBillRequFindCkph',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res)
                    this.dataSource = res.data.list
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.skuSeachId = ''
                this.supplierSeachId = ''
                this.seach()
            }
        }
    }
}
</script>

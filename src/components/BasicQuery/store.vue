<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-19 16:35:29
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择机构"
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
                  rowKey="code"
                  :scroll="{x:600, y:460}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :pagination="false"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <div v-for="(item, index) in columns" :key="index" :slot="item.dataIndex" slot-scope="text" :style="{maxWidth:(item.width || 280)-17+'px'}">
                    <span class="text">{{ text }}</span>
                  </div>
                  <a-button slot="action" slot-scope="record" @click="select(record.code)" size="small" :disabled="isNotSelect">选择</a-button>
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
        },
        defaultSelect: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            isNotSelect: false,
            columns: [
                { title: '编码', dataIndex: 'code', width: 50, scopedSlots: { customRender: 'code' } },
                { title: '名称', dataIndex: 'name', width: 200, scopedSlots: { customRender: 'name' } },
                { title: '类型', dataIndex: 'typeName', width: 100, scopedSlots: { customRender: 'typeName' } },
                { title: '隶属公司', dataIndex: 'upStoreName', width: 100, scopedSlots: { customRender: 'upStoreName' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '店代码', key: 'code' },
                { name: '全称', key: 'name' },
                { name: '简称', key: 'sname' },
                { name: '地址', key: 'address' },
                { name: '电话', key: 'tele' },
                { name: '传真', key: 'fax' },
                { name: '区域', key: 'regionName' },
                { name: '类型', key: 'typeName' },
                { name: '对应配送中心', key: 'storeName' },
                { name: '负责人', key: 'chargeUserName' },
                { name: '是否独立核算', key: 'isSub' },
                { name: '经营面积', key: 'area' },
                { name: '人员数', key: 'numberEmp' },
                { name: '隶属公司', key: 'upStoreName' },
                { name: '是否执行地市县扣点', key: 'isDRateReg' },
                { name: '对应组织机构代码', key: 'organizeName' },
                { name: '是否总部直接配送', key: 'isSend' },
                { name: '是否打印发票', key: 'isPrnInv' },
                { name: '是否启用条码管理', key: 'isBarcode' },
                { name: '是否启用新百卡', key: 'isCkAbk' },
                { name: '是否启用导购开票', key: 'isGuide' },
                { name: '内部供应商', key: 'providerName' },
                { name: '开户行', key: 'bank' },
                { name: '账号', key: 'acctNo' },
                { name: '税号', key: 'taxNo' },
                { name: '税票电话', key: 'telTax' },
                { name: '税票地址', key: 'addressTax' },
                { name: '是否启用税控', key: 'isTaxcon' },
                { name: '是否启用签批', key: 'isSign' },
                { name: '是否内部代销批发', key: 'isWs' },
                { name: '税控企业APPid', key: 'appId' },
                { name: '税控企业签名', key: 'businessSign' },
                { name: '电子发票部门ID', key: 'deptId' }
            ]
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
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
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    condition: e.target.value
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
            const selectDatas = this.dataSource.filter(o => is.inArray(o.code, this.selectedRowKeys))
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
            const selectDatas = this.dataSource.filter(o => o.code === code)
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
            this.selectedRowKeys = selectedRowKeys
            this.isNotSelect = this.selectedRowKeys.length > 0
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
                condition: '',
                include: {
                    type: ['store_type:3']
                },
                // exclude: {
                //     type: 'provider_type:3'
                // },
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    console.log(this.dataSource, '所有分店')
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.seach({ target: { value: '' } })
                if (this.$props.defaultSelect.length > 0) {
                    this.selectedRowKeys = [...this.$props.defaultSelect]
                } else {
                    this.selectedRowKeys.length = 0
                }
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

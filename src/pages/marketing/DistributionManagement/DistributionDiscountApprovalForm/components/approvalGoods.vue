<!--
 * @Description: 分销批发选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-20 15:46:08
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择折让审批单"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc setSeach"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning" class="col6">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-form>
              <a-row class="doc">
                <a-col :span="6" class="">单据号</a-col>
                <a-col :span="18" class="">
                  <a-form-item>
                    <a-input placeholder="请输入编码" @change="seach" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc">
                <a-col :span="6">制单开始时间</a-col>
                <a-col :span="18">
                  <a-form-item>
                    <a-date-picker placeholder="请选择开始时间" @change="seachStartTime" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc">
                <a-col :span="6">制单结束时间</a-col>
                <a-col :span="18">
                  <a-form-item>
                    <a-date-picker placeholder="请选择结束时间" @change="seachEndTime" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:1750}"
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
<style lang="less">
    .setSeach .col7 .col5{
        text-align: right;
        font-weight: bold;
        font-size: 12px;
        background-color: #f5f5f5;
    }
    .setSeach .col6 .col7 .col6{
      padding-right: 0px;
    }
</style>

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
            seachTimer: '',
            isLoading: true,
            spinning: true,
            selectedRowKeys: [],
            columns: [
                { title: '单据号', dataIndex: 'code', width: 150 },
                { title: '折让店编码', dataIndex: 'storeCode', width: 150 },
                { title: '折让店名称', dataIndex: 'storeName', width: 150 },
                { title: '客户编码', dataIndex: 'customerCode', width: 150 },
                { title: '客户名称', dataIndex: 'customerName', width: 150 },
                { title: '制单时间', dataIndex: 'createTime', width: 150 },
                { title: '制单人编码', dataIndex: 'createBy', width: 150 },
                { title: '制单人名称', dataIndex: 'createName', width: 150 },
                { title: '制单位置编码', dataIndex: 'makeStoreCode', width: 150 },
                { title: '制单位置名称', dataIndex: 'makeStoreName', width: 150 },
                { title: '审核人编码', dataIndex: 'auditBy', width: 150 },
                { title: '审核人名称', dataIndex: 'auditName', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],

            dataSource: [],
            cacheObj: {},
            details: [
                { name: '单据号', key: 'code' },
                { name: '折让店编码', key: 'storeCode' },
                { name: '折让店名称', key: 'storeName' },
                { name: '客户编码', key: 'customerCode' },
                { name: '客户名称', key: 'customerName' },
                { name: '制单时间', key: 'createTime' },
                { name: '制单人编码', key: 'createBy' },
                { name: '制单人名称', key: 'createName' },
                { name: '制单位置编码', key: 'makeStoreCode' },
                { name: '制单位置名称', key: 'makeStoreName' },
                { name: '审核人编码', key: 'auditBy' },
                { name: '审核人名称', key: 'auditName' }
            ],
            // 下拉框
            categoryArr: [], // 品类
            brandArr: [], // 品牌
            prividorArr: [], // 供应商

            code: '',
            startTime: '',
            endTime: '',
            isNotSelect: false
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    mounted () {
        this.getObjCategory()
        this.getObjBrandArr()
        this.getPrividorArr()
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
            this.code = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        seachStartTime (data, dataString) {
            this.startTime = dataString
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        seachEndTime (data, dataString) {
            this.endTime = dataString
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
                axios({
                    path: 'DistWholesaleRebatePlanQueryWholesaleRebatePlanDetailList',
                    method: 'post',
                    body: {
                        wholesaleRebatePlanId: selectDatas[0].id
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.$emit('onSelect', res.data, selectDatas)
                        this.$emit('update:visible', false)
                    }
                })
            }
            this.selectedRowKeys.length = 0
            this.isNotSelect = this.selectedRowKeys.length > 0
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
         * @name: 搜索品牌和供应商
         * @msg:
         * @param {type}
         * @return:
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        getObjCategory () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.categoryArr = this.initTree(data)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        /**
         * @name: 获取品牌
         * @msg:
         * @param {type}
         * @return:
         */
        getObjBrandArr () {
            axios({
                path: 'GoodsBrandFindOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('获取品牌', res.data)
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = [...data]
                }
            })
        },
        /**
         * @name: 获取供应商
         * @msg:
         * @param {type}
         * @return:
         */
        getPrividorArr () {
            axios({
                path: 'GoodsCategoryFindOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.prividorArr = [...data]
                }
            })
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData () {
            const pams = {
                code: this.code,
                startTime: this.startTime,
                endTime: this.endTime
            }
            // console.log(pams)
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 10
            }, newPams)
            axios({
                path: 'DistWholesaleRebatePlanQueryAvailablePlans',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = res.data
                    for (const i of this.dataSource) {
                        i.bt_web_id = i.code
                    }
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

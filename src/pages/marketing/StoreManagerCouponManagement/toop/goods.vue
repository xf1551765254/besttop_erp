<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-03-20 08:43:49
 * @LastEditTime: 2019-08-19 16:27:45
 -->

<template>
  <div>
    <a-modal
      v-model="visible"
      title="品类品牌"
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
            <a-form>
              <a-row class="doc">
                <a-col :span="6">品类编码/名称</a-col>
                <a-col :span="18">
                  <a-form-item>
                    <a-input placeholder="请输入搜索值" @change="seach" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc">
                <a-col :span="6">品牌编码/名称</a-col>
                <a-col :span="18">
                  <a-form-item>
                    <a-input placeholder="请输入搜索值" @change="seachbrand" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="bt_web_id"
                  :scroll="{x:850}"
                  :pagination="{defaultPageSize:11}"
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
            selectedRowKeys: [],
            columns: [
                {
                    title: '店代码',
                    dataIndex: 'storeCode',
                    width: 100
                },
                {
                    title: '店名称',
                    dataIndex: 'storeName',
                    width: 150
                },
                {
                    title: '品类编码',
                    dataIndex: 'classCode',
                    width: 100
                },
                {
                    title: '品类名称',
                    dataIndex: 'className',
                    width: 150
                },
                {
                    title: '品牌编码',
                    dataIndex: 'brandCode',
                    width: 100
                },
                {
                    title: '品牌名称',
                    dataIndex: 'brandName',
                    width: 150
                },
                {
                    title: '操作',
                    key: 'operation',
                    fixed: 'right',
                    width: 100,
                    scopedSlots: { customRender: 'action' }
                }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                {
                    name: '分店代码',
                    key: 'storeCode'
                },
                {
                    name: '分店名称',
                    key: 'storeName'
                },
                {
                    name: '品类编码',
                    key: 'classCode'
                },
                {
                    name: '品类名称',
                    key: 'className'
                },
                {
                    name: '品牌编码',
                    key: 'brandCode'
                },
                {
                    name: '品牌名称',
                    key: 'brandName'
                }
            ],
            classCode: '', // 品类
            brandCode: '', // 品牌
            isNotSelect: ''
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
         * @name: 品类搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seach (e) {
            this.classCode = e.target.value
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData()
            }, 300)
        },
        /**
         * @name: 品牌搜索
         * @msg:
         * @param {type}
         * @return:
         */
        seachbrand (e) {
            this.brandCode = e.target.value
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
            console.log(this.dataSource)
            const selectDatas = this.dataSource.filter(o => is.inArray(o.bt_web_id, this.selectedRowKeys))
            console.log(selectDatas)
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
            console.log(selectDatas)
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
            console.table(selectedRowKeys, '监听')
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
                classCode: this.classCode,
                brandCode: this.brandCode
            }
            this.spinning = true
            const newPams = Object.assign(pams, this.$props.pams)
            const p = Object.assign({
                page: 1,
                rows: 15
            }, newPams)
            axios({
                path: 'CouponAQueryGoodsClassAndBrand',
                body: p,
                method: 'POST'
            }).then(res => {
                this.spinning = false
                // console.log(res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    // console.log(res.data.list)
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
                this.seach({ target: { value: '' } })
                this.brandCode = ''
                this.selectedRowKeys.length = 0
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
        }
    }
}
</script>

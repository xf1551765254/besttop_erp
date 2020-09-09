<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-08-22 19:09:49
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
            <a-form>
              <a-row class="doc">
                <a-col :span="6">架构编码/名称</a-col>
                <a-col :span="18">
                  <a-form-item>
                    <a-tree-select
                      :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                      :treeData="treeAllData"
                      treeNodeFilterProp="title"
                      showSearch
                      @change="frameworkChange"
                      allowClear/>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:560, y:460}"
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
            spinning: false,
            selectedRowKeys: [],
            isNotSelect: false,
            columns: [
                { title: '编码', dataIndex: 'code', width: 100, scopedSlots: { customRender: 'code' } },
                { title: '名称', dataIndex: 'name', width: 150, scopedSlots: { customRender: 'name' } },
                { title: '类型', dataIndex: 'typeName', width: 100, scopedSlots: { customRender: 'typeName' } },
                { title: '隶属公司', dataIndex: 'upStoreName', width: 100, scopedSlots: { customRender: 'upStoreName' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 70, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '编码', key: 'code' },
                { name: '名称', key: 'name' },
                { name: '类型', key: 'typeName' },
                { name: '隶属公司', key: 'upStoreName' }
            ],
            treeAllData: []
        }
    },
    computed: {
        isNotMulSelect () {
            return this.selectedRowKeys.length === 0
        }
    },
    methods: {
        frameworkChange (e) {
            if (!e) {
                return
            }
            console.log(e)
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.getData({
                    code: e
                })
            }, 300)
        },
        organizationFun () {
            axios({
                path: 'OrganizationGroupFrameworkFindAll',
                method: 'post',
                body: {
                    page: 1,
                    row: 9999
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data.list)
                    this.treeAllData = this.initAllTreeData(this.initChildData('0', res.data.list))
                }
            })
        },
        initChildData (id, arr) {
            const endArr = []
            const pArr = arr.filter(o => o.parentId === id)
            pArr.forEach(i => {
                const x = arr.filter(o => o.parentId === id)
                if (x.length > 0) {
                    i.children = this.initChildData(i.id, arr)
                }
                i.key = i.id
                i.title = i.name
                endArr.push(i)
            })
            return endArr
        },
        initAllTreeData (arr) {
            const newArr = []
            arr.forEach(i => {
                const x = {}
                x.title = i.name
                x.key = i.id
                x.value = i.code ? i.code : i.id
                x.code = i.code
                if ('children' in i) {
                    x.children = this.initAllTreeData(i.children)
                } else {
                    x.isLeaf = false
                }
                newArr.push(x)
            })
            newArr.sort((a, b) => { return a.code - b.code })
            return newArr
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
        // seach (e) {
        //     clearTimeout(this.seachTimer)
        //     this.seachTimer = setTimeout(() => {
        //         this.getData({
        //             condition: e.target.value
        //         })
        //     }, 300)
        // },
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
                path: 'OrganizationStoreQueryStoreByOrganize',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = res.data
                    console.log(this.dataSource, '所有分店')
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.organizationFun()
                // this.seach({ target: { value: '' } })
                if (this.$props.defaultSelect.length > 0) {
                    this.selectedRowKeys = [...this.$props.defaultSelect]
                } else {
                    this.selectedRowKeys.length = 0
                }
                this.isNotSelect = this.selectedRowKeys.length > 0
            }
            if (!val) {
                this.dataSource = []
            }
        }
    }
}
</script>

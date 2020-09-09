<!--
 * @Description: 门店选择组件
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-07-18 16:10:58
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择品类"
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
          <a-col :span="16">
            <a-row>
              <a-col :span="24">
                <a-input addonBefore="编码/名称" placeholder="请输入搜索值" @change="seach" />
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="code"
                  :scroll="{x:400, y:420}"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <a-button slot="action" slot-scope="record" @click="select(record)" size="small" :disabled="isNotSelect||record.noselect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8">
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
            columns: [
                { title: '编码', dataIndex: 'code', width: 150 },
                { title: '名称', dataIndex: 'name' },
                { title: '操作', key: 'operation', width: 80, scopedSlots: { customRender: 'action' } }
            ],
            dataSource: [],
            cacheObj: {},
            details: [
                { name: '编码', key: 'code' },
                { name: '名称', key: 'name' },
                { name: '商品最大数量', key: 'kindLimit' },
                { name: '是否核算级', key: 'isCheck' },
                { name: '备注', key: 'note' },
                { name: '等级', key: 'grade' }
            ],
            isNotSelect: false
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
                this.getData(e.target.value)
            }, 1000)
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
        select (selectDatas) {
            this.$emit('onSelect', [selectDatas])
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
        getData (val) {
            this.spinning = true
            const p = {
                condition: val,
                orderbyField: 'code asc',
                page: 1,
                rows: 9999
            }
            axios({
                path: 'GoodsCategoryFindCondition',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.dataSource = initTreeData(res.data.list)
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.getData('')
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
function initTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const pArr = arr.filter(o => i.parentId && o.id === i.parentId)
        if (pArr.length < 1) {
            const children = insertTreeData(i.id, arr)
            if (children.length > 0) {
                i.noselect = true
                i.children = [...children]
            }
            newArr.push(i)
        }
    })
    newArr.sort((a, b) => { return a.key - b.key })
    return newArr
}
function insertTreeData (id, arr) {
    const endArr = []
    const pArr = arr.filter(o => o.parentId === id)
    pArr.forEach(i => {
        const x = arr.filter(o => o.parentId === id)
        if (x.length > 0) {
            const children = insertTreeData(i.id, arr)
            if (children.length > 0) {
                i.noselect = true
                i.children = [...children]
            }
        }
        endArr.push(i)
    })
    return endArr
}
</script>

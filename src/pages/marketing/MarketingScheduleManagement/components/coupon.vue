<!--
 * @Description:赠券选择
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @LastEditors: lin
 * @Date: 2019-02-21 15:50:19
 * @LastEditTime: 2019-06-12 17:32:18
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择赠券"
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
                <a-input addonBefore="赠券编码/类型" placeholder="请输入搜索值" @change="seach" />
              </a-col>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="bt_web_id"
                  :scroll="{x:600}"
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
                { title: '赠券编码', dataIndex: 'code', width: 100 },
                { title: '赠券类型', dataIndex: 'name', width: 250 },
                { title: '赠券金额', dataIndex: 'amount', width: 150 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],

            dataSource: [],
            cacheObj: {},
            details: [
                { name: '赠券编码', key: 'code' },
                { name: '赠券类型', key: 'name' },
                { name: '赠券金额', key: 'amount' }
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
                this.getData({
                    code: e.target.value
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
            // console.table(selectedRowKeys)
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
                page: 1,
                rows: 9999
            }, newPams)
            axios({
                path: 'ElectronicCouponQueryList',
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                // console.log('goods', res)
                if (res.flag === 1) {
                    this.dataSource = res.data.list
                    // console.log(res.data)
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

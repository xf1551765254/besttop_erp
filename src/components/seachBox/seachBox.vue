<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-05 09:10:50
 * @LastEditTime: 2019-08-23 11:04:18
 -->
<template>
  <div style="margin:0 10px 0;">
    <a-row class="seach-btn-box">
      <div class="left-box">
        <a-alert v-if="seachValue.length>0" style="margin:10px 10px;" type="info" showIcon >
          <div slot="message">
            <a-tag color="pink">筛选中</a-tag>
            <a-tag color="blue" style="position: absolute;right: 0" @click="deleteSeach">清空筛选条件</a-tag>
          </div>
        </a-alert>
      </div>
      <div class="right-box">
        <!-- <a-tag v-if="seachValue.length>0" color="pink">筛选中</a-tag> -->
        <div class="btn">
          <slot name="start"></slot>
        </div>
        <div class="btn">
          <slot></slot>
        </div>
        <a-button
          class="btn"
          v-if="getBtn('add')"
          @click="onClick('add')"
          v-action:add
          icon="plus"
          size="small"
          type="primary">新增</a-button>
        <a-button
          class="btn"
          v-if="getBtn('edit')"
          @click="onClick('edit')"
          v-action:edit
          icon="edit"
          size="small"
          type="primary">编辑</a-button>
        <a-button
          class="btn"
          v-if="getBtn('del')"
          @click="onClick('del')"
          v-action:delete
          icon="delete"
          size="small"
          type="primary">删除</a-button>
        <a-button
          class="btn"
          v-if="getBtn('recover')"
          @click="onClick('recover')"
          v-action:recover
          icon="rollback"
          size="small"
          type="primary">删除恢复</a-button>
        <a-button
          class="btn"
          v-if="getBtn('export')"
          @click="onClick('export')"
          v-action:export
          icon="download"
          size="small"
          type="primary">导出</a-button>
        <a-button
          class="btn"
          v-if="getBtn('print')"
          @click="onClick('print')"
          v-action:print
          icon="printer"
          size="small"
          type="primary"
          disabled>打印</a-button>
        <a-button
          v-action:query
          v-if="hasBtn"
          class="btn"
          @click="doSeach"
          icon="filter"
          size="small"
          type="primary">筛选</a-button>
      </div>
    </a-row>
    <a-modal
      :title="seachTitle"
      v-model="filterVisbel"
      :closable="false"
      :keyboard="false"
      :mask="false"
      :width="350"
      wrapClassName="modalSea"
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="del" @click="reload">清空</a-button>
        <a-button key="submit" type="primary" @click="seach">确定</a-button>
      </template>
      <div class="box">
        <a-row>
          <a-col :span="24" class="seach-input" v-if="showOrganize">
            <a-col :span="8" class="seach-title"><a-tooltip placement="top" title="架构编码"><span>架构编码:</span></a-tooltip></a-col>
            <a-col :span="16">
              <a-tree-select
                :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
                v-model="value['organize']"
                style="width:100%"
                :treeData="organizationArr"
                treeNodeFilterProp="title"
                showSearch
                allowClear/>
            </a-col>
          </a-col>
          <a-col :span="24" class="seach-input" v-for="(item, index) in conditions" :key="index">
            <edit :item="item" v-model="value"/>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less">
    .modalSea{
        .ant-modal{
            float: right;
            margin-top: 50px;
        }
    }
    .seach-btn-box{
        .ant-alert-icon{
            top:7px;
        }
        .btn{
            margin: 0 5px;
        }
    }
</style>
<style lang="less" scoped>
    .seach-input{
        margin-bottom: 5px;
    }
    .seach-btn-box{
        margin-bottom: 10px;
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
        justify-content:space-between;
        .left-box{
            display: flex;
            display: -webkit-flex;
            justify-content:flex-start;
            width: 40%;
            .ant-alert{
                height: 30px;
                width: 100%;
                display: flex;
                align-items: center;
                margin: 0 !important;
            }
        }
        .right-box{
            display: flex;
            display: -webkit-flex;
            justify-content:flex-end;
            min-width: 60%;
            align-items: center;
        }
    }
    .seach-title{
        font-weight: bold;
        // text-align:right;
        line-height: 32px;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }
    .box{
        // width:300px;
        height:300px;
        max-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        margin-bottom: 10px;
    }
</style>
<script>
import collapseTransition from './transition'
import edit from './edit'
import { axios } from '@/utils/request'
export default {
    name: 'SeachBox',
    components: { collapseTransition, edit },
    props: {
        conditions: {
            type: Array,
            default: () => { return [] }
        },
        btns: {
            type: Array,
            default: () => { return [] }
        },
        value: {
            type: Object,
            default: () => { return {} }
        },
        showOrganize: {
            type: Boolean,
            default: false
        },
        seachTitle: {
            type: String,
            default: '筛选'
        }
    },
    data: function () {
        return {
            organizationArr: [],
            filterVisbel: false,
            seachValue: [],
            isShowTreeCode: false
        }
    },
    created () {
        if (this.$props.showOrganize) {
            this.getStatus()
        }
    },
    computed: {
        hasBtn () {
            return this.$props.conditions.length > 0
        }
    },
    methods: {
        getBtn (T) {
            return this.$props.btns.indexOf(T) >= 0
        },
        reload () {
            this.$emit('onReload')
        },
        deleteSeach () {
            this.seachValue = []
            this.$emit('onReload')
            setTimeout(() => {
                this.$emit('onSeach', {})
            }, 500)
        },
        seach () {
            this.seachValue.length = 0
            Object.keys(this.$props.value).forEach(o => {
                if (o !== 'path') {
                    this.seachValue.push(o)
                }
            })
            this.filterVisbel = false
            this.$emit('onSeach', this.$props.value)
        },
        onClick (e) {
            this.$emit('onClick', e)
        },
        doSeach () {
            this.filterVisbel = true
        },
        subCancel () {
            this.filterVisbel = false
        },
        /**
         * 是否显示架构树编码
         */
        getStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'organize_code_is',
                    configKey: 1
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data || []
                    this.isShowTreeCode = data.length > 0 ? data[0].value === '是' : false
                    this.getOrganizeTree()
                }
            })
        },
        getOrganizeTree () {
            axios({
                path: 'OrganizationGroupFrameworkFindAll',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.organizationArr = this.insertData('0', res.data.list)
                }
            })
        },
        insertData (id, arr) {
            const endArr = []
            const pArr = arr.filter(o => o.parentId === id)
            pArr.forEach(i => {
                const x = arr.filter(o => o.parentId === id)
                if (x.length > 0) {
                    i.children = this.insertData(i.id, arr)
                }
                i.key = i.id
                i.value = i.code
                i.title = this.isShowTreeCode ? (i.code ? `${i.code}-${i.name}` : i.name) : i.name
                // i.title = i.code ? `${i.code}-${i.name}` : i.name
                endArr.push(i)
            })
            endArr.sort((a, b) => { return a.value - b.value })
            return endArr
        }
    },
    watch: {
        value (val) {
            console.log('jianting')
            if (val) {
                this.seachValue.length = 0
                Object.keys(val).forEach(o => {
                    if (o !== 'path') {
                        this.seachValue.push(o)
                    }
                })
            } else {
                this.seachValue.length = 0
            }
        }
        // conditions: {
        //     handler (val, oldval) {
        //         // this.conditions = [...val]
        //         // const arr = [...val]
        //         // if (this.$props.showOrganize) {
        //         //     this.buttonObj.more = arr.length > 2
        //         //     this.heardConditions = arr.slice(0, 2)
        //         //     this.bottomConditions = drop(arr, 2)
        //         // } else {
        //         //     this.buttonObj.more = arr.length > 3
        //         //     this.heardConditions = arr.slice(0, 3)
        //         //     this.bottomConditions = drop(arr, 3)
        //         // }
        //     },
        //     deep: true,
        //     immediate: true
        // }
    }
}
</script>

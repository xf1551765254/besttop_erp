<!--
 * @Description: ERP
 * @Version: ^0.0.4
 * @Company: BestTop
 * @Author: lmt
 * @LastEditors: lmt
 * @Date: 2019-04-14 14:41:21
 * @LastEditTime: 2019-08-13 09:13:33
 -->
<template>
  <div>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${ height || ($store.getters.windowHeight-178)}px;overflow:auto`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <a-directory-tree
            :expandedKeys="expandedKeys"
            @expand="onExpand"
            :autoExpandParent="autoExpandParent"
            :treeData="treeData"
            @select="onTreeSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <slot name="table"></slot>
      </div>
    </holy-grail-layout>
  </div>
</template>
<script>
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import { axios } from '@/utils/request'
export default {
    name: 'HolyGrailTree',
    components: {
        HolyGrailLayout
    },
    data: function () {
        return {
            expandedKeys: [],
            autoExpandParent: true,
            treeData: [],
            treeDataSearch: [],
            isShowTreeCode: false
        }
    },
    props: {
        height: {
            type: Number,
            default: 0
        }
    },
    mounted () {
        this.getStatus()
        // this.getTree()
    },
    methods: {
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'OrganizationGroupFrameworkFindAll',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = [...res.data.list]
                    data.push({
                        parentId: '',
                        id: '0',
                        name: '所有数据'
                    })
                    this.treeData = this.insertData('', data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['0']
                }
            })
        },
        getParentKey (value, tree) {
            const newArr = []
            tree.forEach(item => {
                if (item.title.indexOf(value) >= 0) {
                    this.expandedKeys.push(item.key)
                    newArr.push(item)
                } else if (item.children) {
                    const data = this.getParentKey(value, item.children)
                    if (data.length > 0) {
                        item.children = data
                        newArr.push(item)
                    }
                }
            })
            return newArr
        },
        onExpand  (expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        /**
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {
            if (e.target.value) {
                const newData = JSON.parse(JSON.stringify(this.treeDataSearch))
                this.expandedKeys.length = 0
                const data = this.getParentKey(e.target.value, newData)
                this.autoExpandParent = true
                this.treeData = [...data]
            } else {
                this.treeData = JSON.parse(JSON.stringify(this.treeDataSearch))
            }
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onTreeSelect (keys, e) {
            const value = e.node.dataRef.value
            this.$emit('onTreeSelect', value)
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
                    this.getTree()
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
                i.value = i.id
                i.title = this.isShowTreeCode ? (i.code ? `${i.code}-${i.name}` : i.name) : i.name
                endArr.push(i)
            })
            endArr.sort((a, b) => { return a.value - b.value })
            return endArr
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^0.0.10
 * @Company: BestTop
 * @Author: Reat
 * @Date: 2019-05-31 11:01:37
 * @LastEditors: Reat
 * @LastEditTime: 2019-08-23 14:50:01
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="请输入线路编码/线路名称" @change="onChange" />
          <a-directory-tree
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            defaultExpandAll
            :autoExpandParent="autoExpandParent"
            :selectedKeys.sync="selectedKeys"
            :treeData="treeData"
            :loading="loading"
            @select="onSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onChangeTable">
        </NewTable>
      </div>
    </holy-grail-layout>
    <users :visible.sync="usersVisible" @onSelect="onUsersSelect" :pams="userPams" :title="title" multiple/>
  </div>
</template>
<script>
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import users from '@comp/BasicQuery/users'
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'LineDriverManage',
    components: { seachBox, NewTable, HolyGrailLayout, users },
    data () {
        return {
            selectedKeys: [],
            addDriver: {},
            title: '',
            userPams: {},
            usersVisible: false,
            expandedKeys: [],
            tableCode: '',
            tableApiPath: '',
            disContextMenu: [],
            treeData: [],
            loading: false,
            autoExpandParent: true,
            deleteAll: [],
            // 搜索框默认值
            seachValue: {
                routeCode: '-1'
            },
            // 工具栏按钮定义
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    title: '司机',
                    type: 'input',
                    key: 'code',
                    label: 'value',
                    value: 'code',
                    filter: true
                },
                {
                    title: '手机号',
                    type: 'input',
                    key: 'phone',
                    label: 'value',
                    value: 'phone',
                    filter: true
                }
            ],
            MenuOperations: [
                {
                    name: '删除',
                    action: 'LineDriverManage.delete',
                    fc: row => {
                        this.onDel(row, 'del')
                    }
                }
            ]
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '1520a9cc7b23449f9030912760717b27:LineDriverManage'
            this.tableApiPath = 'DistributionDriverFindAll'
            this.$refs.newTable.setContextmenu(this.MenuOperations)
        })
        this.getTree()
    },
    methods: {
        onUsersSelect (e) {
            this.addDriver.drivers = e
            axios({
                path: 'DistributionDriverAdd',
                method: 'post',
                body: this.addDriver
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    console.log(res)
                    this.usersVisible = false
                    this.getDate()
                    this.getTree()
                    this.addDriver = {}
                }
            })
        },
        /**
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {
            console.log(e.target.value)
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
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keys, e) {
            console.log(e.node.dataRef)
            const id = e.node.dataRef.code
            this.$set(this.seachValue, 'routeCode', id)
            this.addDriver.code = e.node.dataRef.code
            this.addDriver.name = e.node.dataRef.name
            this.treeId = e.node.dataRef
            this.$refs.newTable.setTableData('88c504f58f514babb03ef97647b29fe0:LineDriverManage', {
                path: 'DistributionDriverFindAll',
                routeCode: id
            })
        },
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'DistributionRouteFindAll',
                method: 'post',
                body: {
                    orderbyField: 'code',
                    treeList: true
                }
            }).then(res => {
                if (res.flag === 1) {
                    res.data.name = '所有线路'
                    res.data.code = '-1'
                    res.data.children = [...res.data.list]
                    const data = [res.data]
                    console.log('组织机构', data)
                    this.treeData = this.initTree(data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['-1']
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                if (d.code === '-1') {
                    d.title = d.name
                } else {
                    d.title = `${d.code}-${d.name}`
                }

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
         * @name:右击表格
         */
        onContextmenuChange ({ billStatus }) {

        },
        /**
         * @name:表格多选方法
         */
        onChangeTable (keys, rows) {
            this.deleteAll = []
            for (const i of rows) {
                this.deleteAll.push(i.id)
            }
            console.log(this.deleteAll, '多选')
        },
        /**
            * @name:监听工具栏按钮
            */
        onSeachClick (e) {
            if (e === 'add') {
                if (!this.addDriver.code || this.addDriver.code === '-1') {
                    return this.$message.warning('请选择线路!')
                }
                console.log('新增')
                this.userPams = {
                    // include: {
                    type: 'sys_user_type:2'
                    // }
                }
                this.title = '所有司机'
                this.usersVisible = true
            } else if (e === 'del') {
                console.log('批量删除')
                this.onDel(1)
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('DistributionDriverFindAll', this.seachValue)
                console.log('导出')
            } else if (e === 'print') {
                console.log('打印')
            }
        },
        /**
         * @name:主表删除
         */
        onDel (e) {
            let arr = []
            if (e === 1) {
                arr = [...this.deleteAll]
            } else {
                arr.push(e.id)
            }
            if (arr.length === 0) {
                this.$message.warning('您尚未选中任何数据')
                return
            }
            const that = this
            this.$confirm({
                title: '删除确认',
                content: '删除后不可恢复，确定继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'DistributionDriverDelete',
                        method: 'post',
                        body: { ids: arr }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res)
                            that.deleteAll = []
                            that.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {

                }
            })
        },
        /**
         * @name:获取搜索框数据
         */
        onSeach (e) {
            e.path = 'DistributionDriverFindAll'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空搜索
         */
        onReload () {
            this.seachValue = {
                routeCode: '-1'
            }
            this.selectedKeys = ['-1']
        },
        /**
         * @name: 刷新表格
         */
        getDate () {
            this.$refs.newTable.setTableData('88c504f58f514babb03ef97647b29fe0:LineDriverManage', { path: 'DistributionDriverFindAll' })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'LineDriverManage') {
                this.getTree()
            }
        }
    }
}
</script>

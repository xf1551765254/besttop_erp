<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:30:41
 * @LastEditTime: 2019-08-10 14:33:15
 -->
<template>
  <div>
    <div class="seachDiv">
      <seachBox
        :conditions="pageName==='user'?conditions:conditionsSup"
        :btns="btns"
        v-model="seachBoxValue"
        @onReload="onReload"
        @onSeach="onSeach"/>
    </div>
    <a-tabs @change="callback" v-model="pageName">
      <a-tab-pane tab="用户权限" key="user" />
      <a-tab-pane tab="供应商权限" key="supplier" />
    </a-tabs>
    <!-- 工具栏 -->
    <holy-grail-tree @onTreeSelect="onSelect" v-show="pageName==='user'" :height="height" :showBtn="false">
      <div slot="table">
        <NewTable
          ref="userTable"
          :height="height"
          :pams="seachBoxValue"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          @onContextmenuChange="onContextmenuChange">
        </NewTable>
      </div>
    </holy-grail-tree>
    <NewTable
      v-show="pageName!=='user'"
      ref="table"
      :height="height"
      :pams="seachBoxValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <a-modal
      class="dataPermissionModal"
      title="用户赋权"
      :visible="visible"
      :bodyStyle="{maxHeight:`${$store.getters.windowHeight-220}px`}"
      :width="800"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      centered
    >
      <div slot="footer">
        <a-button style="margin: 0 10px;" key="back" @click="authorizationCancel">关闭</a-button>
        <a-popconfirm
          v-action:unauthorization
          :visible="popVisible"
          @visibleChange="handleVisibleChange(privilege)"
          title="确定设置此用户超级权限？"
          @cancel="cancel"
          @confirm="allOk">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button
            key="all"
            type="danger"
            :disabled="privilege"
            v-action:unauthorization
            :loading="allLoading">{{ privilege?'超级权限':'赋超级权限' }}</a-button>
        </a-popconfirm>
        <a-button style="margin: 0 10px;" key="submit" type="primary" :loading="confirmLoading" @click="authorizationOk">确定</a-button>
      </div>
      <a-spin :spinning="spinning">
        <a-tabs @change="onChangeTabs" v-model="activeKey">
          <a-tab-pane tab="机构权限" key="subbranch">
          </a-tab-pane>
          <a-tab-pane tab="品类权限" key="strain">
          </a-tab-pane>
          <a-tab-pane tab="品牌权限" key="brand">
          </a-tab-pane>
          <a-tab-pane tab="客户权限" key="client">
          </a-tab-pane>
          <!-- <a-tab-pane tab="架构权限" key="DataOrganizer">
          </a-tab-pane> -->
        </a-tabs>
        <a-input-search style="margin-bottom: 8px" placeholder="搜索编号或者名称" @change="onChange" v-model="seachValue" />
        <a-card hoverable class="action-card">
          <a-directory-tree
            checkable
            defaultExpandAll
            v-infinite-scroll="loadMore"
            :treeData="treeData"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
          />
        </a-card>
        <!-- </a-tab-pane>
        </a-tabs> -->
      </a-spin>
    </a-modal>
    <!-- 供应商赋权 -->
    <a-modal
      class="dataPermissionModal"
      :bodyStyle="{maxHeight:`${$store.getters.windowHeight-220}px`}"
      title="供应商权限"
      :visible="supplierVisible"
      @ok="authorizationOk"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      centered
    >
      <template slot="footer">
        <a-button style="margin: 0 10px;" key="back" @click="authorizationCancel">关闭</a-button>
        <a-popconfirm
          v-action:unauthorization
          :visible="popVisible"
          @visibleChange="handleVisibleChange(privilege)"
          title="确定设置此用户超级权限？"
          @cancel="cancel"
          @confirm="allOk">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button
            key="all"
            type="danger"
            :disabled="privilege"
            v-action:unauthorization
            :loading="allLoading">{{ privilege?'超级权限':'赋超级权限' }}</a-button>
        </a-popconfirm>
        <!-- <a-button v-show="privilege" key="all1" type="danger" v-action:unauthorization disabled>超级权限</a-button> -->
        <a-button style="margin: 0 10px;" key="submit" type="primary" :loading="confirmLoading" @click="authorizationOk">确定</a-button>
      </template>
      <a-input-search style="margin-bottom: 8px" placeholder="搜索编号或者名称" @change="onChange" v-model="seachValue" />
      <a-card hoverable class="action-card">
        <a-directory-tree
          checkable
          defaultExpandAll
          v-infinite-scroll="loadMore"
          :treeData="treeData"
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          v-model="checkedKeys">
        </a-directory-tree>
      </a-card>
    </a-modal>
  </div>
</template>
<style lang="less">
.dataPermissionModal{
    .ant-modal-body{
        padding: 5px 24px;
    }
}
</style>
<style lang="less" scoped>
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        overflow:auto;
    }
    .action-card{
        margin-bottom: 10px;
        max-height:calc(100vh - 360px);
        overflow:auto;
    }
    .seachDiv{
        width: 50%;
        position: absolute;
        right: 0;
        z-index:10;
        // height: 45px;
        // line-height: 45px;
    }
</style>
<script>
import { axios } from '@/utils/request'
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import HolyGrailTree from '../tools/HolyGrailTree'
export default {
    name: 'DataPermission',
    components: { NewTable, SeachBox, HolyGrailTree },
    data () {
        const self = this
        return {
            seachTimer: '',
            seachValue: '',
            title: '赋权',
            tableCode: '',
            tableApiPath: '',
            contextmenuArr: [
                { name: '用户赋权', action: 'dataPermission.authorization', fc: this.showModal },
                { name: '赋所有超级权限', action: 'dataPermission.unauthorization', fc: this.addBatchPrivilege }
                // { name: '分店权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('subbranch') } },
                // { name: '品类权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('strain') } },
                // { name: '品牌权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('brand') } },
                // { name: '客户权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('client') } },
                // { name: '组织权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('DataOrganizer') } }
            ],
            supplierMenuArr: [
                { name: '供应商权限', action: 'dataPermission.authorization', fc: () => { self.getTreeData('supplier') } }
            ],
            pageName: 'user',
            height: this.$store.getters.windowHeight - 200,
            visible: false,
            supplierVisible: false,
            confirmLoading: false,
            allLoading: false,
            // isTable: true,
            treeData: [],
            treeDataSearch: [],
            checkedKeys: [],
            row: {},
            objType: null,
            // 是否免权
            privilege: false,
            tableCol: [
                { title: '编码', dataIndex: 'code', width: 100 },
                { title: '名称', dataIndex: 'name' }
            ],
            // 工具栏按钮组
            btns: [],
            // 工具栏表单搜索内容对象
            seachBoxValue: {},
            // 工具栏搜索表单配置
            conditions: [
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '机构编码',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'OrganizationStoreFindOption'
                },
                { title: '用户编码/姓名', type: 'input', key: 'code' }
            ],
            conditionsSup: [
                { title: '供应商编码', type: 'input', key: 'code' }
            ],
            activeKey: 'subbranch',
            expandedKeys: [],
            autoExpandParent: true,
            spinning: false,
            count: 50,
            popVisible: false
        }
    },
    mounted () {
        this.pageName = 'user'
        this.$nextTick(() => {
            this.tableCode = '863c331a8a7c4d53b0d76351e23182ea:dataPermission'
            this.tableApiPath = 'PermissionsUserQuery'
            this.$refs.userTable.setContextmenu(this.contextmenuArr)
        })
    },
    methods: {
        loadMore () {
            if (this.treeDataSearch.length > 0 && this.treeDataSearch[0].children.length > this.count) {
                this.count += 50
                const data = { ...this.treeDataSearch[0] }
                data.children = data.children.slice(0, this.count)
                this.treeData = []
                this.treeData.push(data)
            }
        },
        showModal () {
            this.popVisible = false
            this.getTreeData(this.activeKey)
            this.visible = true
        },
        onChangeTabs (key) {
            this.getTreeData(key)
        },
        onReload () {
            this.seachBoxValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            if (this.pageName === 'user') {
                e.path = 'PermissionsUserQuery'
                this.$refs.userTable.setTableData(this.tableCode, e)
            } else {
                e.path = 'CustomerSupplierFind'
                this.$refs.table.setTableData(this.tableCode, e)
            }
        },
        /**
         * @name: 获取权限列表
         * @msg:
         * @param {type}
         * @return:
         */
        getTreeData (type) {
            this.count = 50
            this.spinning = true
            this.seachValue = ''
            this.treeData.length = 0
            this.treeDataSearch.length = 0
            this.privilege = false
            switch (type) {
            case 'subbranch':
                this.objType = 4
                this.getTreeDataAxios({
                    userId: this.row.id,
                    objType: 4
                })
                break
            case 'strain':
                this.objType = 2
                this.getTreeAxios({
                    userId: this.row.id,
                    objType: 2
                })
                // this.getTreeAxios({
                //     userId: this.row.id,
                //     objType: 2
                // }).then(res => {
                //     if (res) {
                //         this.treeDataSearch = JSON.parse(JSON.stringify([res.tree]))
                //         const data = { ...res.tree }
                //         data.children = data.children ? data.children.slice(0, this.count) : []
                //         this.treeData.push(data)
                //         this.expandedKeys = ['000']
                //         this.$nextTick(() => {
                //             this.checkedKeys = [ ...res.choose ]
                //         })
                //     }
                //     this.spinning = false
                // })
                break
            case 'brand':
                this.objType = 3
                this.getTreeDataAxios({
                    userId: this.row.id,
                    objType: 3
                })
                break
            case 'client':
                this.objType = 1
                this.getTreeDataAxios({
                    userId: this.row.id,
                    objType: 1
                })
                break
            case 'DataOrganizer':
                this.objType = 6
                this.getTreeAxios({
                    userId: this.row.id,
                    objType: 6
                })
                break
            case 'supplier':
                this.popVisible = false
                this.supplierVisible = true
                this.objType = 5
                this.getTreeDataAxios({
                    userId: this.row.id,
                    objType: 5
                })
                break
            default:
                this.$message.error('右键菜单配置错误')
                break
            }
        },
        getTreeDataAxios (pams) {
            axios({
                path: 'PermissionsDataQueryPermission',
                method: 'post',
                body: pams
            }).then(res => {
                if (res.flag === 1) {
                    this.privilege = res.data.privilege
                    const resData = res.data
                    if (resData.tree) {
                        this.treeDataSearch.push(resData.tree)
                        const data = { ...resData.tree }
                        data.children = data.children ? data.children.slice(0, this.count) : []
                        this.treeData.push(data)
                        this.expandedKeys = ['000']
                        this.$nextTick(() => {
                            this.checkedKeys = [ ...resData.choose ]
                        })
                    }
                }
                this.spinning = false
            })
        },
        async getTreeAxios (pams) {
            await axios({
                path: 'PermissionsDataQueryTreePermission',
                method: 'post',
                body: pams
            }).then(res => {
                if (res.flag === 1) {
                    this.privilege = res.data.privilege
                    const resData = res.data
                    if (resData.tree) {
                        const data = resData.tree
                        data.children = initTreeData(data.children)
                        this.treeDataSearch.push(data)
                        const dataArr = { ...data }
                        dataArr.children = dataArr.children ? dataArr.children.slice(0, this.count) : []
                        this.treeData.push(dataArr)
                        this.expandedKeys = ['000']
                        this.$nextTick(() => {
                            this.checkedKeys = [ ...resData.choose ]
                        })
                    }
                }
                this.spinning = false
            })

            return false
        },
        /**
         * @name: 赋权
         * @msg:
         * @param {type}
         * @return:
         */
        authorizationOk () {
            const userId = this.row.id
            const objType = this.objType
            const objCodes = this.checkedKeys
            this.confirmLoading = true
            axios({
                path: 'PermissionsDataAdd',
                method: 'post',
                body: {
                    userId,
                    objType,
                    objCodes
                }
            }).then(res => {
                this.confirmLoading = false
                if (res.flag === 1) {
                    this.privilege = false
                    this.supplierVisible = false
                }
            })
        },
        /**
         * @name: 一键免权
         * @msg:
         * @param {type}
         * @return:
         */
        allOk () {
            this.allLoading = true
            const userId = this.row.id
            const objType = this.objType
            axios({
                path: 'PermissionsDataAddPrivilege',
                method: 'post',
                body: { userId, objType }
            }).then(res => {
                this.allLoading = false
                if (res.flag === 1) {
                    this.privilege = true
                    this.supplierVisible = false
                    this.popVisible = false
                }
            })
        },
        /**
         * @name: 取消赋权
         * @msg:
         * @param {type}
         * @return:
         */
        authorizationCancel () {
            this.visible = false
            this.supplierVisible = false
        },
        getParentKey (value, tree, isStore) {
            const newArr = []
            tree.forEach(item => {
                if (item.title.indexOf(value) >= 0) {
                    if (isStore) {
                        this.storeExpandedKeys.push(item.key)
                    } else {
                        this.expandedKeys.push(item.key)
                    }
                    newArr.push(item)
                } else if (item.children) {
                    const data = this.getParentKey(value, item.children, isStore)
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
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.onChangeData(e.target.value)
            }, 500)
        },
        onChangeData (value) {
            if (value) {
                if (this.activeKey === 'strain' || this.activeKey === 'DataOrganizer') {
                    const newData = JSON.parse(JSON.stringify(this.treeDataSearch))
                    this.expandedKeys.length = 0
                    const data = this.getParentKey(value, newData)
                    this.autoExpandParent = true
                    this.treeData = [...data]
                } else {
                    const newData = this.treeDataSearch[0].children.filter(o => o.title.indexOf(value) >= 0)
                    this.treeData[0].children = [...newData]
                }
            } else {
                const data = JSON.parse(JSON.stringify(this.treeDataSearch))
                data[0].children = data.length > 0 ? data[0].children.slice(0, this.count) : []
                this.treeData = [...data]
                this.$nextTick(() => {
                    const keys = this.checkedKeys
                    this.checkedKeys = [...keys]
                })
            }
        },
        /**
         * @name: 表格切换
         * @msg:
         * @param {type}
         * @return:
         */
        callback (e) {
            this.seachBoxValue = {}
            if (e === 'user') {
                this.tableCode = '863c331a8a7c4d53b0d76351e23182ea:dataPermission'
                this.tableApiPath = 'PermissionsUserQuery'
                this.$refs.userTable.setContextmenu(this.contextmenuArr)
            } else {
                this.tableCode = '830ef9e5d86b48aaa243f3701170e387:dataPermission'
                this.tableApiPath = 'CustomerSupplierFind'
                this.$refs.table.setContextmenu(this.supplierMenuArr)
            }
        },
        /**
         * @name: 监听右键
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (row) {
            this.row = { ...row }
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (code) {
            this.$set(this.seachBoxValue, 'organize', code)
            this.$refs.userTable.setTableData(this.tableCode, {
                path: 'PermissionsUserQuery',
                organize: code
            })
        },
        addBatchPrivilege () {
            const userId = this.row.id
            axios({
                path: 'PermissionsDataAddBatchPrivilege',
                method: 'post',
                body: { userId }
            }).then(res => {
                if (res.flag === 1) {
                    // this.$message.warning('赋权成功')
                }
            })
        },
        /**
         * 气泡框显示与隐藏
         */
        handleVisibleChange (privilege) {
            if (privilege) {
                this.popVisible = false
            } else {
                this.popVisible = true
            }
        },
        cancel () {
            this.popVisible = false
        }
    }
}
function initTreeData (arr) {
    const newArr = []
    arr.forEach(i => {
        const pArr = arr.filter(o => i.parentId && o.id === i.parentId)
        if (pArr.length < 1) {
            i.children = insertTreeData(i.id, arr)
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
                i.children = [...children]
            }
        }
        endArr.push(i)
    })
    return endArr
}
</script>

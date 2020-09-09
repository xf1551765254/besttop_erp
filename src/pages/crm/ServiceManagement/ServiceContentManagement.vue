<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-26 09:08:47
 * @LastEditors: lin
 * @LastEditTime: 2019-07-04 20:22:59
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          size="small"
          type="primary"
          icon="play-circle"
          style="margin-right:10px"
          v-action:enable
          @click="enableHandler(-1)">启用</a-button>
        <a-button size="small" type="primary" icon="stop" v-action:disable @click="disableHandler(-1)">停用</a-button>
      </div>
    </seachBox>
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onChange" />
          <a-directory-tree
            :defaultSelectedKeys="['6']"
            defaultExpandAll
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :treeData="treeData"
            :loading="loading"
            @select="onTreeSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          :slots="slots"
          :disContextMenu="disContextMenu"
          @onContextmenuChange="onContextmenuChange"
          @onSelect="onSelect">
          <template v-for="col in slots" :slot="col" slot-scope="{text, record}">
            <div :key="col" class="setTableA" v-action:get>
              <a-tooltip
                v-if="col==='readQuantity'"
                placement="top"
                :mouseEnterDelay="0.3"
                arrowPointAtCenter>
                <span slot="title" v-html="text"></span>
                <a harf="javascript:;" @click="TableModal(col,record)"><span>{{ text }}</span></a>
              </a-tooltip>
              <div v-else>
                <a harf="javascript:;" @click="TableModal(col,record)"><span>服务详情</span></a>
              </div>
            </div>
          </template>
        </NewTable>
      </div>
    </holy-grail-layout>
    <!-- 新增 编辑 -->
    <bt-modal
      v-model="addEditModel"
      :title="AddEditModalTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code" >
      <a-form :form="form" class="setCol">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">分类名称</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input
                disabled
                v-decorator="$check('ServiceContent.codeName', {initialValue:tableSingleData.codeName||SecondLevelTitle})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">服务标题</a-col>
          <a-col :sm="16" :md="20" :xl="21">
            <a-form-item>
              <a-input
                placeholder="请输入服务标题"
                v-decorator="$check('ServiceContent.titles', {initialValue:tableSingleData.titles||''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">服务详情</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:0" class="setEdit">
            <a-form-item>
              <editor v-model="modalText" style="height:500px"></editor>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">状态</a-col>
          <a-col :sm="16" :md="8" :xl="5">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择状态"
                style="width: 100%"
                :options="statusArr"
                v-decorator="$check('ServiceContent.status',{initialValue:tableSingleData.status||'system_service_status:1'})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </bt-modal>
    <!-- 阅读量弹框 -->
    <a-modal
      v-model="readModal"
      title="阅读情况"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      style="top: 20px;"
      destroyOnClose
      :bodyStyle="{'padding-top':'10px'}"
      centered>
      <!-- 搜索按钮 -->
      <div>
        <a-row type="flex" align="middle" style="margin-bottom:5px;margin-left:5px">
          <a-col :span="4" style="text-align:right">顾客姓名/手机：</a-col>
          <a-col :span="5">
            <a-input
              ref="endNumberRef"
              v-model="customerName"
              placeholder="请输入顾客姓名/手机"/>
          </a-col>
          <a-col :span="4" style="text-align:right">问题是否解决：</a-col>
          <a-col :span="5">
            <a-select
              placeholder="请选择状态"
              style="width: 100%"
              allowClear
              v-model="useful">
              <a-select-option value="system_service_log_useful:0">否</a-select-option>
              <a-select-option value="system_service_log_useful:1">是</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="2">
            <a-button
              size="small"
              style="margin-left:10px"
              type="primary"
              icon="search"
              @click="searchSubmit">
              搜索
            </a-button></a-col>
        </a-row>
      </div>
      <a-spin :spinning="spinning">
        <div class="table-nowrap">
          <a-table
            rowKey="id"
            :columns="readColumns"
            size="small"
            bordered
            :pagination="{defaultPageSize:10,hideOnSinglePage:true}"
            :scroll="{ x:850 }"
            :dataSource="readTableData">
          </a-table>
        </div>
      </a-spin>
      <template slot="footer">
        <a-button type="primary" @click="readModal=false">关闭</a-button>
      </template>
    </a-modal>
    <!-- 服务内容 -->
    <a-modal
      v-model="serviceModal"
      title="服务详情"
      class="doc"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      style="top: 20px;"
      destroyOnClose
      :bodyStyle="{'padding-top':'10px'}"
      centered >
      <div>
        <p v-html="serviceContent"></p>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="serviceModal=false">关闭</a-button>
      </template>
    </a-modal>
    <!-- 预览 -->
    <a-modal
      title="广告管理预览"
      :visible="previewDetail"
      centered
      :maskClosable="false"
      :closable="false"
      width="900px"
      wrapClassName="aCol" >
      <template slot="footer">
        <a-button type="primary" @click="previewDetail=false">关闭</a-button>
      </template>
      <a-form>
        <a-row>
          <a-col :span="3" >服务编码：</a-col>
          <a-col :span="5" style="">
            <a-input
              disabled
              v-model="tableSingleData.code" />
          </a-col>
          <a-col :span="3">服务状态： </a-col>
          <a-col :span="5" style="">
            <a-input
              disabled
              v-model="tableSingleData.statusName" />
          </a-col>
          <a-col :span="3">阅读量：</a-col>
          <a-col :span="5" style="">
            <a-input
              disabled
              v-model="tableSingleData.readQuantity" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3">服务标题：</a-col>
          <a-col :span="21" style="">
            <a-input
              disabled
              v-model="tableSingleData.title" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3">分类名称：</a-col>
          <a-col :span="21" style="">
            <a-input
              disabled
              :value="`${tableSingleData.classCode}-${tableSingleData.className}`" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3">服务详情：</a-col>
          <a-col :span="21" style="height:auto;margin-bottom:0">
            <p v-html="tableSingleData.sendContent"></p>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3">新增人：</a-col>
          <a-col :span="9" style="">
            <a-input
              disabled
              :value="`${tableSingleData.createBy}-${tableSingleData.createByName}`" />
          </a-col>
          <a-col :span="3" >新增时间</a-col>
          <a-col :span="9" style="">
            <a-input
              disabled
              v-model="tableSingleData.createTime" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="3" >修改人：</a-col>
          <a-col :span="9" style="">
            <a-input
              disabled
              :value="`${tableSingleData.updateBy}-${tableSingleData.updateByName}`" />
          </a-col>
          <a-col :span="3" >修改时间</a-col>
          <a-col :span="9" style="">
            <a-input
              disabled
              v-model="tableSingleData.updateTime" />
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
.btn-box{
    display: flex;
    display: -webkit-flex;
    flex-flow:row nowrap;
}
</style>
<style lang="less" scoped>
.aCol{
    .ant-col-3{
        text-align: right;
        font-weight: 700;
        padding-right: 10px;
        font-size: 12px;
        height: 32px;
        line-height: 32px;
        margin-bottom: 20px;
    }
}
.setTableA a{
  display: block;
  width: 100%;
  height:100%;
}
.setEdit{
    /deep/ .ant-spin-container{
                height: 100%;
                /deep/ .editor{
                    height: 100% !important;
                    /deep/  .ql-container{
                            height: calc(100% - 66px);
                    }
                }
            }
}
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
import BtModal from '@comp/Modal'
import editor from '@comp/editor/editor'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'ServiceContentManagement',
    components: { NewTable, SeachBox, HolyGrailLayout, BtModal, editor },
    data () {
        return {
            // 工具栏按钮组
            btns: ['add', 'del', 'export'],
            // 工具栏表单数据收集
            seachValue: {
                id: '6',
                titles: '',
                status: ''
            },
            // 工具栏表单配置
            conditions: [
                {
                    key: 'titles',
                    type: 'input',
                    title: '服务标题'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    filter: true,
                    label: 'title',
                    value: ['type', 'configKey'],
                    selectDataArr: []
                }
            ],

            // 左树
            treeAllData: [],
            expandedKeys: [],
            autoExpandParent: true,
            treeDataSearch: [],
            // 加载标识
            loading: false,
            // 树形数据
            treeData: [],
            // 树形选中数据
            treeSelectData: [],

            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 单行选中的数据
            tableSingleData: {},
            // 表格选中的id
            tableIdsArr: [],
            tableRowsArr: [],
            slots: ['readQuantity', 'sendContent'],
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'ServiceContentManagement.edit',
                    fc: this.addEdit
                },
                { name: '删除',
                    action: 'ServiceContentManagement.delete',
                    fc: this.deleteHandler
                },
                { name: '启用',
                    action: 'ServiceContentManagement.enable',
                    fc: this.enableHandler
                },
                { name: '停用',
                    action: 'ServiceContentManagement.disable',
                    fc: this.disableHandler
                },
                { name: '预览',
                    action: 'ServiceContentManagement.get',
                    fc: this.detailHandler
                }
            ],

            // 新增 编辑 单据
            // 弹框
            isSecondLevel: false,
            SecondLevelTitle: '',
            tags: [ ], // 单据状态
            addEditModel: false,
            AddEditModalTitle: '', // 弹框title
            submitLoading: false,
            isAdd: false,
            // 表单
            form: this.$form.createForm(this),
            modalText: '', // 文本编辑器

            // 阅读量信息
            spinning: false,
            readModal: false,
            readColumns: [
                { title: '序号', width: 50, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '顾客姓名', dataIndex: 'customerName', width: 150, align: 'center' },
                { title: '顾客手机', dataIndex: 'customerTelephone', width: 150, align: 'center' },
                { title: '问题是否解决', dataIndex: 'usefulName', width: 150, align: 'center' },
                { title: '创建时间', dataIndex: 'createTime', width: 150, align: 'center' },
                { title: '未解决的问题', dataIndex: 'note', width: 550, align: 'center' }
            ],
            readTableData: [],
            // 搜索值
            readSearchForm: { },
            customerName: '',
            useful: '',
            systemServiceCode: '',

            // 服务内容
            serviceModal: false,

            // 预览
            previewDetail: false,
            serviceContent: '',

            // 下拉框
            statusArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '76a5be7e55434d998e6d456071e92da8:ServiceContentManagement'
            this.tableApiPath = 'SystemServiceQueryList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        // this.getStatusDorpArr()
        this.getTree()
        this.getStatusDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'SystemServiceQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue.titles = ''
            this.seachValue.status = ''
        },
        /**
         * @name: 工具栏功能按键
         * @msg:
         * @param {type}
         * @return:
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deleteHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('SystemServiceQueryList')
            }
        },
        /**
         * @name: 树搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onChange (e) {
            console.log(e)
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
        onExpand  (expandedKeys) {
            this.expandedKeys = expandedKeys
            this.autoExpandParent = false
        },
        /**
         * @name: 获取树数据
         * @msg:
         * @param {type}
         * @return:
         */
        getTree () {
            axios({
                path: 'SystemClassifyQueryList',
                method: 'post',
                body: {
                    typeId: '4'
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log('tree', res.data)
                    const data = [...res.data]
                    this.treeData = this.insertData(data)
                    this.treeDataSearch = JSON.parse(JSON.stringify(this.treeData))
                    this.expandedKeys = ['0']
                }
            })
        },
        // 递归组装树
        insertData (arr) {
            const endArr = []
            arr.forEach(d => {
                d.key = d.id
                d.title = d.classCode ? `${d.classCode}-${d.className}` : `${d.typeName}`
                d.value = d.id
                if ('children' in d) {
                    d.children = this.insertData(d.children)
                } else {
                    d.isLeaf = true
                }
                endArr.push(d)
            })
            return endArr
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onTreeSelect (keys, e) {
            console.log(keys, e)
            const id = e.node.dataRef.id
            this.$set(this.seachValue, 'id', id)
            this.$refs.newTable.setTableData('edfc85f0a37249df9c3169cc0d5a3aa5:ServiceContentManagement', {
                path: 'SystemServiceQueryList',
                id: id
            })
            if (e.node.dataRef.classCode) {
                this.isSecondLevel = true
                this.SecondLevelTitle = e.node.dataRef.title
            } else {
                this.isSecondLevel = false
                this.SecondLevelTitle = ''
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
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'SystemServiceQueryList' })
        },
        /**
         * @name: 表格的多选
         * @msg:
         * @param {type}
         * @return:
         */
        onSelect (keyId, keyRows) {
            this.tableIdsArr = map(keyRows, 'id')
            this.tableRowsArr = keyRows
        },
        /**
         * @name: 表格右击
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            console.log(tableRow)
            if (tableRow.status === 'system_service_status:1') {
                console.log(1)
                this.disContextMenu = ['启用', '删除']
            } else {
                console.log(2)
                this.disContextMenu = ['停用']
            }
        },
        /**
         * @name: 删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteHandler (delData) {
            let arr = []
            const self = this
            if (delData === -1) {
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'system_service_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行删除操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除将不可恢复',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemServiceDeleteSystemService', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 启用
         * @msg:
         * @param {type}
         * @return:
         */
        enableHandler (enableData) {
            let arr = []
            const self = this
            if (enableData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要启用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isDisabled = newData.filter(o => o.status !== 'system_service_status:2')
                if (isDisabled.length > 0) {
                    this.$message.warning('只有停用状态的才能进行启用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(enableData.id)
            }
            this.$confirm({
                title: '启用提示',
                content: '确定选中项全部启用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemServiceUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'system_service_status:1'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 停用
         * @msg:
         * @param {type}
         * @return:
         */
        disableHandler (disData) {
            let arr = []
            const self = this

            if (disData === -1) {
                if (self.tableIdsArr.length === 0) {
                    return self.$message.warning('请选择要停用的列表')
                }
                const newData = [...this.tableRowsArr]
                const isEnable = newData.filter(o => o.status !== 'system_service_status:1')
                if (isEnable.length > 0) {
                    this.$message.warning('只有启用状态的才能进行停用操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(disData.id)
            }
            this.$confirm({
                title: '停用提示',
                content: '确定选中项全部停用？确认请点确定按钮',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'SystemServiceUpdateStatus', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr,
                            status: 'system_service_status:2'
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    self.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 新增编辑弹框
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditDate) {
            if (addEditDate === -1) {
                if (this.isSecondLevel) {
                    this.isAdd = true
                    this.AddEditModalTitle = '新增服务内容管理'
                    this.tableSingleData = {}
                    this.modalText = ''
                    this.addEditModel = true
                } else {
                    this.$message.warning('请选择二级分类进行数据新增')
                }
            } else {
                this.isAdd = false
                this.AddEditModalTitle = '编辑服务内容管理'
                const obj = { ...addEditDate }
                this.modalText = obj.sendContent
                obj.codeName = `${obj.classCode}- ${obj.className}`
                this.tableSingleData = obj
                this.addEditModel = true
            }
        },
        /**
         * @name: 新增 编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitInfo (e) {
            e.preventDefault() // 清除默认行为
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    if (!this.modalText) {
                        return this.$message.error('请输入服务详情')
                    } else {
                        values.sendContent = this.modalText
                    }
                    const nameArr = values.codeName.split('-')
                    values.classCode = nameArr[0]
                    values.className = nameArr[1]
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'SystemServiceAddSystemService' : 'SystemServiceUpdateSystemService',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModel = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 主表格阅读弹框
         * @msg:
         * @param {type}
         * @return:
         */
        TableModal (key, row) {
            if (key === 'readQuantity') {
                this.readModal = true
                this.customerName = ''
                this.useful = ''
                this.systemServiceCode = row.code
                this.getReadModelData()
            } else {
                this.serviceModal = true
                this.serviceContent = row.sendContent
            }
        },
        /**
         * @name: 阅读弹框数据
         * @msg:
         * @param {type}
         * @return:
         */
        getReadModelData () {
            this.spinning = true
            axios({
                path: 'SystemServiceQueryLogByCode',
                method: 'post',
                body: {
                    customerName: this.customerName,
                    useful: this.useful,
                    systemServiceCode: this.systemServiceCode
                }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.readTableData = res.data
                }
            })
        },
        /**
         * @name: 选择卡 表格 搜索
         * @msg:
         * @param {type}
         * @return:
         */
        searchSubmit () {
            this.getReadModelData()
        },
        /**
         * @name: 获取状态
         * @msg:
         * @param {type}
         * @return:
         */
        getStatusDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'system_service_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.$set(this.conditions[1], 'selectDataArr', dataArr)
                    this.statusArr = dataArr
                }
            })
        },
        detailHandler () {
            this.previewDetail = true
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ServiceContentManagement') {
                this.getTree()
                this.getStatusDorpArr()
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:31:46
 * @LastEditTime: 2019-08-12 14:18:47
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <div class="seachDiv">
      <seachBox
        :conditions="conditions"
        :btns="btns"
        v-model="seachValue"
        @onReload="onReload"
        @onSeach="onSeach">
        <a-button
          type="primary"
          size="small"
          style="margin-left:10px"
          v-action:add
          :disabled="disableAdd"
          @click="addEditParams(-1)">新增</a-button>
        <a-button
          type="danger"
          size="small"
          v-action:delete
          :disabled="disableDelete"
          style="margin-left:10px"
          @click="onDel(-1)">批量删除</a-button>
      </seachBox>
    </div>
    <!-- 顶部参数级别tab栏切换 -->
    <a-tabs @change="callback" v-model="activeKey">
      <a-tab-pane tab="一级参数" :key="1" />
      <a-tab-pane tab="二级参数" :key="2" />
      <a-tab-pane tab="三级参数" :key="3" />
    </a-tabs>
    <!-- 数据表格 -->
    <holy-grail-layout left="220px" style="margin:0px 10px;">
      <div slot="left">
        <a-card hoverable :style="`height:${height}px;overflow-y:auto;`">
          <a-button style="margin-bottom:8px;" type="primary" size="small" v-if="isCompanyEnv" @click="clickAddType">新增</a-button>
          <a-button style="margin-left:10px;margin-bottom:8px;" type="primary" size="small" v-if="isCompanyEnv" @click="clickEditType">编辑</a-button>
          <a-button style="margin-left:10px;margin-bottom:8px;" type="primary" size="small" v-if="isCompanyEnv" @click="clickDeleteType">删除</a-button>
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onTreeChange" />
          <a-tree
            :treeData="treeData"
            @select="onTreeSelect"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          :height="height"
          ref="table"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="{...seachValue, grade: activeKey}"
          :disContextMenu="disContextMenu"
          @onSelect="onSelect">
        </NewTable>
      </div>
    </holy-grail-layout>
    <!--  新增/编辑模态框 -->
    <a-modal
      :title="paramterAddEditModalTitle"
      v-model="paramterAddEditModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">参数类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                placeholder="请选择参数类型"
                style="width: 100%"
                v-decorator="$check('systemConfig.typeId', {initialValue:selectedSingleRow.typeId || ''})"
                :options="pamsTypeArr"
                allowClear
                :disabled="disableAdd"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">排序</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number :disabled="activeKey == 1" style="width:100%" :min="0" :max="100" v-decorator="$check('systemConfig.keySort', {initialValue:selectedSingleRow.keySort || 0})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">配置值</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input :disabled="activeKey == 1" placeholder="请输入配置值" v-decorator="$check('systemConfig.value', {initialValue:selectedSingleRow.value || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">是否启用</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-radio-group v-decorator="$check('systemConfig.isEnable', {initialValue:selectedSingleRow.isEnable!=0 ? 1 : 0})">
                <a-radio :value="1">启用</a-radio>
                <a-radio :value="0">停用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea :disabled="activeKey == 1" placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 4}" v-decorator="$check('systemConfig.note', {initialValue:selectedSingleRow.note || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <a-modal
      title="新增参数类型"
      v-model="addParameterTypeModal"
      :confirmLoading="addTypeloading"
      :width="500"
      @ok="submitAdd"
      destroyOnClose
      maskClosable
      center>
      <a-form :form="addTypeForm">
        <a-form-item
          label="参数类型"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'type', {initialValue: treeSelectRow.type, rules: [{ required: true, message: '请输入参数类型' }]} ]" />
        </a-form-item>
        <a-form-item
          label="配置名称"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'name', {initialValue: treeSelectRow.name, rules: [{ required: true, message: '请输入配置名称' }]} ]" />
        </a-form-item>
        <a-form-item
          label="配置等级"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }">
          <a-select style="width: 100%" v-decorator="[ 'grade', {initialValue: treeSelectRow.grade, rules: [{ required: true, message: '请选择配置等级' }]} ]">
            <a-select-option :value="1">一级参数</a-select-option>
            <a-select-option :value="2">二级参数</a-select-option>
            <a-select-option :value="3">三级参数</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="备注"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }">
          <a-input v-decorator="[ 'note', {initialValue: treeSelectRow.note, rules: [{ max: 255, message: '备注内容不能超过255字' }]} ]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
</style>
<style lang="less" scoped>
    .seachDiv{
        width: 55%;
        position: absolute;
        right: 0;
        z-index:10;
        // height: 45px;
        // line-height: 45px;
    }
</style>

<script>
import { isCompanyEnv } from '@/config/api.config'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import map from 'lodash.map'
import seachBox from '@comp/seachBox'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
export default {
    name: 'Parameter',
    components: {
        NewTable,
        seachBox,
        HolyGrailLayout
    },
    data () {
        return {
            isCompanyEnv,
            height: this.$store.getters.windowHeight - 200,
            timer: '',
            tableCode: '',
            tableApiPath: '',
            // 选中行id收集
            tableSelectRows: [],
            // 新增/编辑表单
            form: this.$form.createForm(this),
            addTypeForm: this.$form.createForm(this),
            // 新增/编辑模态框标题
            paramterAddEditModalTitle: '',
            // 新增/编辑模态框打开关闭标识
            paramterAddEditModal: false,
            // 新增/编辑模态框参数类型下拉框数据
            pamsTypeArr: [],
            // 加载标识
            loading: false,
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增标识
            isAdd: true,
            // 表格右击菜单参数
            menuOpt: [
                { name: '编辑', action: 'parameter.edit', fc: this.editHandler },
                { name: '详情', action: 'parameter.get', fc: e => this.$refs.table.showDetails('系统参数详情', e) },
                { name: '删除', action: 'parameter.delete', fc: ({ id }) => { this.onDel(id) } }
            ],
            //  表格右键禁用按钮
            disContextMenu: [],
            // 是否允许新增,默认不允许添加
            disableAdd: true,
            // 是否允许批量删除,默认不允许
            disableDelete: true,
            activeKey: 1,
            conditions: [
                // {
                //     title: '配置描述',
                //     type: 'select',
                //     key: 'description',
                //     selectDataArr: [],
                //     label: 'description',
                //     value: 'description',
                //     filter: true
                // },
                {
                    title: '配置值',
                    type: 'input',
                    key: 'value'
                },
                {
                    title: '备注',
                    type: 'input',
                    key: 'note'
                }
            ],
            btns: [],
            seachValue: {},
            treeData: [],
            treeDataSearch: [],
            // 参数类型相关
            addParameterTypeModal: false,
            addTypeloading: false,
            isAddType: false,
            treeSelectRow: {}
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd97af9a1e32f4021bcd484eecaf4b7b1:parameter'
            this.tableApiPath = 'OrganizationConfigQueryList'
            this.disContextMenu = ['删除']
            this.$refs.table.reload(this.tableCode, {
                path: this.tableApiPath,
                grade: 1
            })
            this.$refs.table.setContextmenu(this.menuOpt)
        })
        this.treeSelectRow = {}
        this.getPamsTypeArr(1)
    },
    methods: {
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'OrganizationConfigQueryList'
            this.$refs.table.setTableData(this.tableCode, e)
        },
        /**
         * @name: tab栏切换事件监听
         */
        callback (e) {
            this.treeSelectRow = {}
            this.seachValue = {}
            let params = {}
            if (e === 1) {
                // 一级参数表格参数
                params = {
                    path: this.tableApiPath,
                    grade: 1
                }
                this.disContextMenu = ['删除']
                this.getPamsTypeArr(1)
                this.disableAdd = true
                this.disableDelete = true
            } else if (e === 2) {
                params = {
                    path: this.tableApiPath,
                    grade: 2
                }
                this.disContextMenu = ['删除']
                this.getPamsTypeArr(2)
                this.disableAdd = true
                this.disableDelete = true
            } else if (e === 3) {
                params = {
                    path: this.tableApiPath,
                    grade: 3
                }
                this.disContextMenu = []
                this.getPamsTypeArr(3)
                this.disableAdd = false
                this.disableDelete = false
            } else if (e === 4) {
                params = {
                    path: this.tableApiPath,
                    grade: 4
                }
                this.disContextMenu = ['编辑', '删除']
                this.getPamsTypeArr(4)
                this.disableAdd = false
                this.disableDelete = false
            }
            this.$refs.table.reload(this.tableCode, params)
        },
        /**
         * @name: 表格多选
         */
        onSelect (k, r) {
            this.tableSelectRows = [...r]
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
         * @name: 参数类型数据获取
         */
        getPamsTypeArr (grade) {
            axios({
                path: 'OrganizationConfigQueryTypes',
                method: 'post',
                body: {
                    grade
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.key = item.id
                        item.title = item.name
                        item.value = item.id
                    })
                    // const desobj = {}
                    // const desData = data.reduce((cur, next) => {
                    //     // eslint-disable-next-line
                    //     desobj[next.description] ? '' : desobj[next.description] = true && cur.push(next)
                    //     return cur
                    // }, [])
                    this.treeData = [...data]
                    this.treeDataSearch = [...data]
                    this.pamsTypeArr = [ ...data ]
                }
            })
        },
        /**
         * @name: 表格右键编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            this.addEditParams()
        },
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            const self = this
            if (id < 0 && this.tableSelectRows.length <= 0) {
                this.$message.warning('您尚未选中任何数据！')
            } else {
                this.$confirm({
                    title: '提示',
                    content: '删除后不可恢复，确定删除吗？',
                    onOk () {
                        let ids = []
                        if (id < 0) {
                            ids = map(self.tableSelectRows, 'id')
                        } else {
                            ids = [id]
                        }
                        axios({
                            path: 'SysValueDel',
                            method: 'post',
                            body: {
                                ids: ids
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                self.$refs.table.del(ids)
                            }
                        })
                    }
                })
            }
        },
        /**
         * @name: 新增/编辑处理函数
         */
        addEditParams (index) {
            this.paramterAddEditModal = true
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.paramterAddEditModalTitle = '新增参数'
            } else {
                this.isAdd = false
                this.paramterAddEditModalTitle = '编辑参数'
            }
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                        values.configKey = this.selectedSingleRow.configKey
                    }
                    axios({
                        path: this.isAdd ? 'SysValueAdd' : 'SysValueUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.paramterAddEditModal = false
                            this.$refs.table.setTableData(this.tableCode, { path: this.tableApiPath, grade: this.activeKey })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        onTreeSelect (keys, e) {
            this.treeSelectRow = { ...e.node.dataRef }
            const val = e.node.dataRef.id
            this.$set(this.seachValue, 'typeId', val)
            this.$refs.table.setTableData(this.tableCode, {
                path: 'OrganizationConfigQueryList',
                typeId: val
            })
        },
        onTreeChange (e) {
            if (e.target.value) {
                if (this.timer) { clearTimeout(this.timer) }
                this.timer = setTimeout(() => {
                    const newData = this.treeDataSearch.filter(o => o.name.indexOf(e.target.value) >= 0)
                    this.treeData = [...newData]
                }, 300)
            } else {
                this.treeData = JSON.parse(JSON.stringify(this.treeDataSearch))
            }
        },
        /**
         * @name: 模态框关闭
         */
        subCancel () {
            this.paramterAddEditModal = false
        },
        /**
         * 新增系统参数类型
         */
        clickAddType () {
            this.treeSelectRow = {}
            this.isAddType = true
            this.addParameterTypeModal = true
        },
        /**
         * 编辑系统参数类型
         */
        clickEditType () {
            if (Object.keys(this.treeSelectRow).length === 0) {
                return this.$message.warning('请选择参数类型')
            }
            this.isAddType = false
            this.addParameterTypeModal = true
        },
        /**
         * 删除系统参数类型
         */
        clickDeleteType () {
            if (Object.keys(this.treeSelectRow).length === 0) {
                return this.$message.warning('请选择参数类型')
            }
            axios({
                path: 'SysTypeDelete',
                method: 'post',
                body: {
                    ids: [this.treeSelectRow.id]
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.getPamsTypeArr(this.activeKey)
                }
            })
        },
        /**
         * 添加参数类型
         */
        submitAdd (e) {
            e.preventDefault() // 防止事件穿透
            const { addTypeForm: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.addTypeloading = true
                    if (!this.isAddType) {
                        values.id = this.treeSelectRow.id
                    }
                    axios({
                        path: this.isAddType ? 'SysTypeAdd' : 'SysTypeUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addParameterTypeModal = false
                            this.getPamsTypeArr(this.activeKey)
                        }
                        this.addTypeloading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }
    }
}
</script>

<!--
 * @Description: 商品品类属性
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:28:43
 * @LastEditTime: 2019-07-17 18:54:59
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
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <a-modal
      :title="addEditModalTitle"
      v-model="addEditModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="800"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">品类编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select :filterOption="filterOption" showSearch v-decorator="$check('classProperty.classId', {initialValue: selectedSingleRow.classId?(selectedSingleRow.classId+'-'+selectedSingleRow.classCode):''})" :options="ClassIdArr" allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">品类属性名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入品类属性名称" v-decorator="$check('classProperty.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc" v-for="(item, index) in propertiesArr" :key="index">
          <a-col :span="4">属性值-{{ index + 1 }}</a-col>
          <a-col :span="16">
            <a-input placeholder="请输入品类属性值" v-model="propertiesArr[index].text" :disabled="item.disabled"/>
          </a-col>
          <a-col :span="4">
            <a-col :span="12">
              <a-button v-if="index===propertiesArr.length-1" icon="plus" type="primary" @click="changeCategoryPropertyList(1)"/>
            </a-col>
            <a-col :span="12">
              <a-button v-if="index>0" icon="delete" type="danger" :disabled="item.disabled" @click="changeCategoryPropertyList(-1,index)"/>
            </a-col>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";

</style>
<script>
import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
import map from 'lodash.map'
export default {
    name: 'CommodityCategoryProperty',
    components: {
        NewTable,
        seachBox
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: '',
            // 表格右键菜单
            menuOpt: [
                { name: '编辑',
                    action: 'commodityCategoryProperty.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'commodityCategoryProperty.get',
                    fc: e => this.$refs.newTable.showDetails('品类属性详情', e)
                }, { name: '删除',
                    action: 'commodityCategoryProperty.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }
            ],
            // 工具栏按钮组
            btns: ['add', 'del', 'export'],
            // 工具栏表单收据收集
            seachValue: {},
            // 工具栏输入框定义
            conditions: [
                { title: '品类编码/名称', type: 'input', key: 'className' },
                { title: '属性编码/名称', type: 'input', key: 'name' }
            ],
            // 新增/编辑模态框标题
            addEditModalTitle: '',
            // 新增/编辑模态框打开关闭标识
            addEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            // 加载标识
            loading: false,
            // 是否进行添加操作标识
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增/编辑品类编码下拉框数据
            ClassIdArr: [],
            // 新增/编辑中可添加删除属性值列表
            propertiesArr: [{ text: '', disabled: false }],
            tableSelectRows: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd1a4757b46394e8a960634648543d103:commodityCategoryProperty'
            this.tableApiPath = 'GoodsCategoryAttributesFindList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        changeCategoryPropertyList (type, index) {
            if (type < 0) {
                this.propertiesArr.splice(index, 1)
            } else {
                this.propertiesArr.push({ text: '', disabled: false })
            }
        },
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
            e.path = 'GoodsCategoryAttributesFindList'
            this.$refs.newTable.reload(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('GoodsCategoryAttributesFindList', this.seachValue)
            }
        },
        /**
         * @name:表格多选
         */
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            // console.log(1111111, row)
            this.selectedSingleRow = { ...row }
            axios({
                path: 'GoodsCategoryAttributesFindById',
                method: 'post',
                body: {
                    id: this.selectedSingleRow.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.selectedSingleRow = { ...res.data }
                    this.propertiesArr = this.selectedSingleRow.propertValue
                    this.addEditStorefront()
                }
            })
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getClassIdArr()
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.propertiesArr = [{ text: '', disabled: false }]
                this.addEditModalTitle = '新增商品品类属性信息'
            } else {
                this.isAdd = false
                this.addEditModalTitle = '编辑商品品类属性信息'
            }
            this.addEditModal = true
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            const self = this
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
                        path: 'GoodsCategoryAttributesDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
        },
        /**
         * @name: 获取下拉
         */
        getClassIdArr () {
            axios({
                path: 'GoodsCategoryFindTopOption',
                method: 'post',
                body: {
                    page: 1,
                    rows: 9999
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.key = `${item.id}:${item.code}`
                        item.title = `${item.code}-${item.name}`
                        item.value = `${item.id}-${item.code}`
                    })
                    this.ClassIdArr = [ ...data ]
                }
            })
        },
        // 模态框关闭
        subCancel () {
            this.loading = false
            this.addEditModal = false
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.value = (map(this.propertiesArr, 'text')).join(',')
                    if (values.value.length <= 0) {
                        return this.$message.warning('请输入品类属性值！')
                    }
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    const arr = values.classId.split('-')
                    values.classId = arr[0]
                    values.classCode = arr[1]
                    this.loading = true
                    axios({
                        path: this.isAdd ? 'GoodsCategoryAttributesAdd' : 'GoodsCategoryAttributesUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.reload(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }
    }

}
</script>

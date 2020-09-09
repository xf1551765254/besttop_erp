<!--
 * @Description: 区域管理
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @LastEditors: haile
 * @Date: 2019-03-13 08:57:12
 * @LastEditTime: 2019-05-07 20:25:03
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onSeach="onSeach"
      @onReload="onReload"
      @onClick="onSeachClick">
      <a-button
        @click="printVisbelChange(-1)"
        icon="barcode"
        size="small"
        v-action:print
        type="primary">打印标签</a-button>
    </seachBox>
    <!-- 搜索树和数据表格 -->
    <holy-grail-layout left="300px" style="margin:0px 10px;">
      <div slot="left">
        <!-- 树形搜索 -->
        <a-card hoverable :style="`height:${$store.getters.windowHeight-220}px;overflow:auto;`">
          <a-input-search style="margin-bottom: 8px" placeholder="搜索" @change="onTreeChange" />
          <a-directory-tree
            defaultExpandAll
            :treeData="treeData"
            :loading="loading"
            @select="SelectTreeNode"
          />
        </a-card>
      </div>
      <div slot="center">
        <NewTable
          ref="newTable"
          :tableCode="tableCode"
          :tableApiPath="tableApiPath"
          :pams="seachValue"
          @onSelect="onSelect"
        >
        </NewTable>
      </div>
    </holy-grail-layout>
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
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">区域名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('region.regionName', {initialValue:selectedSingleRow.regionName || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">所属分店</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select style="width: 100%" v-decorator="$check('region.storeCode', {initialValue:curStoreCode || ''})" :options="storeArr" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="4">区域数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number :disabled="!isAdd" style="width:100%;" :min="1" :max="100" v-decorator="$check('region.regionCount', {initialValue:selectedSingleRow.regionCount || '1'})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">标签</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('region.label', {initialValue:selectedSingleRow.label || '前场'})" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('region.note', {initialValue:selectedSingleRow.note || ''})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 打印标签 -->
    <a-modal
      title="打印标签"
      v-model="printVisbel"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="850"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="printVisbel = false">关闭</a-button>
        <a-button key="submit" type="primary" @click="printTag">打印</a-button>
      </template>
      <a-row class="doc">
        <a-col :span="4">纸张</a-col>
        <a-col :span="8">
          <a-select :defaultValue="6" :options="papeOption" style="width:100%;" @change="e=>pageChange(e,'pape')" size="small"/>
        </a-col>
        <a-col :span="4">打印类型</a-col>
        <a-col :span="8">
          <a-select defaultValue="Color" :options="colorOption" style="width:100%;" @change="e=>pageChange(e,'color')" size="small"/>
        </a-col>
        <a-col :span="4">颜色</a-col>
        <a-col :span="8">
          <a-select defaultValue="#e54d42" style="width:100%;" @change="e=>pageChange(e,'type')" size="small">
            <a-select-option v-for="(item, index) in typeOption" :key="index" :value="item.value">{{ item.label }} <a-icon type="smile" :style="{color: item.value}"/></a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">标签数</a-col>
        <a-col :span="8">
          <a-input v-model="papes" disabled></a-input>
        </a-col>
      </a-row>
      <div class="print-box">
        <div id="printJS-box" style="width:100%;">
          <a-row>
            <a-col :span="pageSpan" v-for="(item, index) in printData" :key="index">
              <tags :item="item" :colorType="colorType" :typeType="typeType"></tags>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less">
    @import "../../../assets/modalStyle.less";
    .print-box{
        max-height: 500px;
        width: 794px;
        overflow:auto;
        margin-top: 10px;
    }

</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import tags from './tools/tags'
import { axios } from '@/utils/request'
import print from 'print-js'
import map from 'lodash.map'
import is from 'is_js'
import HolyGrailLayout from '@comp/layouts/HolyGrailLayout'
export default {
    name: 'Regional',
    components: {
        NewTable,
        SeachBox,
        tags,
        HolyGrailLayout
    },
    computed: {
        getHeight () {
            return document.documentElement.clientHeight - 220
        }
    },
    data () {
        return {
            // 表单
            form: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: '',
            // 工具栏按钮组
            btns: ['add', 'del'],
            // 工具栏表单组
            conditions: [
                { title: '分店', type: 'input', key: 'storeCode', disabled: true },
                {
                    key: 'regionCode',
                    type: 'select',
                    title: '区域编码',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    selectDataArr: []
                }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 表格右键菜单
            menuOpt: [
                { name: '编辑',
                    action: 'regional.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'regional.get',
                    fc: e => this.$refs.newTable.showDetails('预约管理详情', e)
                }, { name: '删除',
                    action: 'regional.delete',
                    fc: e => this.deleteHandler(e)
                }, { name: '打印',
                    action: 'regional.print',
                    fc: e => this.printVisbelChange(e)
                }
            ],
            // 添加标识
            isAdd: true,
            // 加载标识
            loading: false,
            // 选中的单行数据
            selectedSingleRow: {},
            // 新增/编辑模态框标题
            addEditModalTitle: '',
            // 新增/编辑模态框打开/关闭标识
            addEditModal: false,
            // 盘点编码
            defineCodeArr: [],
            // 左侧搜索树数据
            treeData: [],
            treeDataSearch: [],
            // 新增/编辑中所属分店
            storeArr: [],
            // 左侧树选择的分店
            curStoreCode: '',
            printVisbel: false,
            printData: [],

            papeOption: [
                { label: 'A4', value: 6 },
                { label: '标签', value: 24 }
            ],
            colorOption: [
                { label: '黑白', value: 'Gray' },
                { label: '彩色', value: 'Color' }
            ],
            typeOption: [
                { label: '嫣红', value: '#e54d42' },
                { label: '桔橙', value: '#f37b1d' },
                { label: '明黄', value: '#fbbd08' },
                { label: '橄榄', value: '#8dc63f' },
                { label: '森绿', value: '#39b54a' },
                { label: '天青', value: '#1cbbb4' },
                { label: '海蓝', value: '#0081ff' },
                { label: '蓝紫', value: '#5e00ff' },
                { label: '姹紫', value: '#6739b6' },
                { label: '木槿', value: '#9c26b0' },
                { label: '桃粉', value: '#e03997' },
                { label: '棕褐', value: '#a5673f' },
                { label: '玄灰', value: '#8799a3' },
                { label: '草灰', value: '#aaaaaa' }
            ],
            pageSpan: 6,
            colorType: 'Color',
            typeType: '#e54d42',
            papes: 0,
            selectRows: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b4cccf5a1e3640c0be7841e51dee8fcb:regional'
            this.tableApiPath = 'StocktakeRegionFind'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getTree()
        this.getStoreArr()
    },
    methods: {
        pageChange (v, t) {
            if (t === 'pape') {
                this.pageSpan = v
            }
            if (t === 'color') {
                this.colorType = v
            }
            if (t === 'type') {
                this.typeType = v
            }
        },
        printTag () {
            print({
                printable: 'printJS-box',
                type: 'html',
                targetStyles: ['*'] // 继承原来的所有样式
            })
        },
        printVisbelChange (e) {
            this.colorType = 'Color'
            this.typeType = '#e54d42'
            if (e < 0) {
                if (this.selectRows.length === 0) {
                    this.$message.error('请最少选择一个标签')
                    return
                }
                // TODO
                this.printData = [...this.selectRows]
                this.printVisbel = true
            } else {
                this.printData = [e]
                this.printVisbel = true
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
            e.path = 'StocktakeRegionFind'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.selectRows.length > 0) {
                    this.onDel()
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            }
        },
        // 新增/编辑模态框
        addEdit (index) {
            if (index === -1) {
                this.isAdd = true
                this.selectedSingleRow = {}
                this.addEditModalTitle = '新增区域管理信息'
            } else {
                this.isAdd = false
                this.addEditModalTitle = '编辑区域管理信息'
            }
            this.addEditModal = true
        },
        // 单项/多项删除
        onDel (e = null) {
            let ids = []
            if (is.not.null(e)) {
                ids.push(e.id)
            } else {
                ids = map(this.selectRows, 'id')
            }
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'StocktakeRegionDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids, 'id')
                        }
                    })
                }
            })
        },
        /**
         * @name: 表格选择
         */
        onSelect (k, r) {
            this.selectRows = [...r]
            this.papes = r.length
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.selectedSingleRow = { ...row }
            console.log(2222222, this.selectedSingleRow)
            this.addEdit()
        },
        /**
         * @name:表格右击删除监听
         */
        deleteHandler (row) {
            this.onDel(row)
        },
        // 模态框关闭
        subCancel () {
            this.addEditModal = false
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    console.log('values-----------', values)
                    this.loading = true
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    axios({
                        path: this.isAdd ? 'StocktakeRegionAdd' : 'StocktakeRegionUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath, ...this.seachValue })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 获取左侧数据
         */
        getTree () {
            this.loading = true
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                this.loading = false
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(item => {
                        item.parentId = '0'
                        item.key = item.code
                        item.children = []
                        item.title = item.code + '-' + item.name
                        item.isLeaf = true
                    })
                    this.treeData = [...data]
                    this.treeDataSearch = [...data]
                }
            })
        },
        /**
         * @name: 树选中
         * @msg:
         * @param {type}
         * @return:
         */
        SelectTreeNode (keys, e) {
            this.curStoreCode = e.node.dataRef.code
            this.$set(this.seachValue, 'storeCode', this.curStoreCode)
            this.$refs.newTable.setTableData('b4cccf5a1e3640c0be7841e51dee8fcb:regional', {
                path: 'StocktakeRegionFind',
                storeCode: this.curStoreCode
            })
        },

        /**
         * @name: 树过滤
         */
        onTreeChange (e) {
            if (e.target.value) {
                const newData = [...this.treeDataSearch]
                const data = newData.filter(item => item.name.indexOf(e.target.value) >= 0 || item.code.indexOf(e.target.value) >= 0)
                this.treeData = [...data]
            } else {
                this.treeData = [...this.treeDataSearch]
            }
        },
        /**
         * @name: 新增/编辑所属分店数据请求
         */
        getStoreArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.key = index + 1
                        item.title = item.name
                        item.value = item.code
                    })
                    this.storeArr = [...data]
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'Regional') {
                this.getTree()
                this.getStoreArr()
            }
        },
        'seachValue.storeCode' (val) {
            if (val) {
                axios({
                    path: 'StocktakeRegionFindOption',
                    method: 'post',
                    body: { storeCode: val }
                }).then(res => {
                    if (res.flag === 1) {
                        this.$set(this.seachValue, 'regionCode', '')
                        this.$set(this.conditions[1], 'selectDataArr', res.data)
                    }
                })
            } else {
                this.$set(this.conditions[1], 'selectDataArr', [])
            }
        }
    }
}
</script>

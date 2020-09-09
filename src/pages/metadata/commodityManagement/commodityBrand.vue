<!--
 * @Description:U课
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:27:46
 * @LastEditTime: 2019-08-09 14:32:24
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
      :title="storefrontAddEditModalTitle"
      v-model="storefrontAddEditModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="600"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
          提交
        </a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4" v-if="!isAdd">品牌编码</a-col>
          <a-col :span="20" v-if="!isAdd">
            <a-form-item>
              <a-input v-decorator="$check('brand.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">品牌名称</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入品牌名称" v-decorator="$check('brand.name', {initialValue:selectedSingleRow.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item>
              <a-textarea placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 6 }" v-decorator="$check('brand.note', {initialValue:selectedSingleRow.note || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <upload :fileList="fileList" :fixedNumber="[2,1]" :fileLength="fileLength" @uploadFileList="uploadFileList"></upload>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <editor-modal v-model="editVisble" :pams="editPams" type="brand"/>
    <recover-modal v-model="recoverVisble" status="2" :tableCode="tableCode" @onReload="onReloadAfterRecover"/>
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
import upload from '../tools/upload'
import EditorModal from '@comp/editor/EditorModal'
import RecoverModal from '../tools/RecoverModal'
export default {
    name: 'CommodityBrand',
    components: {
        NewTable,
        seachBox,
        upload,
        EditorModal,
        RecoverModal
    },
    data () {
        return {
            // 表格数据定义--start
            tableCode: '',
            tableApiPath: '',
            editVisble: false,
            editPams: {},
            menuOpt: [
                { name: '编辑',
                    action: 'commodityBrand.edit',
                    fc: this.editHandler
                }, { name: '详情',
                    action: 'commodityBrand.get',
                    fc: e => this.$refs.newTable.showDetails('商品品牌详情', e)
                }, { name: '删除',
                    action: 'commodityBrand.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, {
                    name: '品牌文案',
                    action: 'commodityBrand.edit',
                    fc: e => this.editText(e)
                }
            ],
            // 表格数据定义--end
            // 工具栏数据定义--start
            btns: ['add', 'del', 'export', 'recover'],
            seachValue: {},
            conditions: [
                { title: '品牌编码', type: 'input', key: 'code' },
                { title: '品牌名称', type: 'input', key: 'name' }
            ],
            // 工具栏数据定义--end
            // 模态框数据定义--start
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            floorId: [],
            plotRankArr: [],
            runBrandArr: [],
            // 模态框数据定于--end
            loading: false,
            // 模态框数据定于--end
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            tableSelectRows: [],
            fileList: [],
            fileLength: ['上传LOGO'],
            recoverVisble: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '234247c637af484797270e041bcee69b:commodityBrand'
            this.tableApiPath = 'GoodsBrandFindBySelected'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        onReloadAfterRecover () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'GoodsBrandFindBySelected' })
        },
        // 图片上传
        uploadFileList (data) {
            console.log(data)
            this.fileList = data
        },
        // 工具栏方法定义--start
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
            e.path = 'GoodsBrandFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e)
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
                this.$refs.newTable.exportFile('GoodsBrandFindBySelected', this.seachValue)
            } else if (e === 'recover') {
                this.recoverVisble = true
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            if (index === -1) {
                // 清除数据
                this.isAdd = true
                this.selectedSingleRow = {}
                this.fileList = []
                this.storefrontAddEditModalTitle = '新增品牌信息'
            } else {
                this.isAdd = false
                this.storefrontAddEditModalTitle = '编辑品牌信息'
            }
            this.storefrontAddEditModal = true
        },
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        editText (row) {
            this.selectedSingleRow = row
            this.editPams = { id: row.id }
            this.editVisble = true
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.fileList = []
            this.selectedSingleRow = { ...row }
            if (row.logoUrl) {
                const pic = row.logoUrl.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
            }
            this.addEditStorefront()
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
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
                        path: 'GoodsBrandDel',
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
        subCancel () {
            this.storefrontAddEditModal = false
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
                    }
                    const fileList = this.fileList.map(x => x.fileUrl)
                    values.logoUrl = fileList.join(',')
                    axios({
                        path: this.isAdd ? 'GoodsBrandAdd' : 'GoodsBrandUpdate',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.storefrontAddEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }
        // 模态框方法定义--end
    }
}

</script>

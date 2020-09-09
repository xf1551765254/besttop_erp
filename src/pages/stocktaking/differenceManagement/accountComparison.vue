<!--
 * @Description:账实比对
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-12 21:32:08
 * @LastEditTime: 2019-04-29 09:40:05
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onClick"
      @onFilter="onFilter"
      @onSeach="onSeach">
      <a-button
        class="btn"
        @click="confirmCode"
        size="small"
        icon="stop"
        v-action:edit
        type="primary">确定录入</a-button>
      <a-button
        class="btn"
        @click="lockHandler"
        size="small"
        icon="lock"
        v-action:edit
        type="primary">盘点锁定</a-button>
      <a-button
        class="btn"
        @click="exportTxt"
        size="small"
        icon="export"
        v-action:export
        type="primary">导出TXT</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      :rowSelect="false"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      ref="newTable">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <a-modal
      title="盘点调整"
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
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">盘点分店</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.defineCode', {initialValue:defineCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">盘点编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.storeCode', {initialValue:selectedSingleRow.storeCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">商品编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.skuCode', {initialValue:selectedSingleRow.skuCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">商品名称</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.skuName', {initialValue:selectedSingleRow.skuName})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">区域编码</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('stocktakDefine.regionCode', {initialValue:selectedSingleRow.regionCode})" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="4">调整数</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number v-decorator="$check('stocktakDefine.inputCount')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import { axios } from '@/utils/request'
export default {
    name: 'AccountComparison',
    components: {
        NewTable,
        SeachBox
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'd6b94f8e1b464f10aa12b71c066a1728:accountComparison'
            this.$refs.newTable.setTableColumns(this.tableCode)
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    data () {
        return {
            tableCode: '',
            tableApiPath: 'InventoryContrastFindBook',
            // 工具栏按钮组
            btns: ['filter', 'export'],
            form: this.$form.createForm(this),
            // 工具栏表单组
            conditions: [
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '分店',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'OrganizationStoreFindOption'
                },
                {
                    key: 'defineCode',
                    type: 'select',
                    title: '盘点编码',
                    label: ['code', 'stocktakingDate'],
                    value: 'code',
                    selectDataArr: []
                },
                {
                    key: 'classCode',
                    type: 'input',
                    title: '分类'
                },
                {
                    key: 'brandCode',
                    type: 'select',
                    title: 'U课',
                    label: ['code', 'name'],
                    filter: true,
                    value: 'code',
                    path: 'GoodsBrandFindOption'
                },
                {
                    key: 'skuCode',
                    type: 'input',
                    title: '商品编码'
                },
                {
                    key: 'skuName',
                    type: 'input',
                    title: '商品名称'
                }
            ],
            // 表格右键菜单
            menuOpt: [
                {
                    name: '盘点调整',
                    action: 'accountComparison.edit',
                    fc: this.editHandler
                }
            ],
            // 工具栏搜索表单数据收集
            seachValue: {},
            // 重绘工具栏标识
            refresh: true,
            // 编辑实盘数量模态框标识
            addEditModal: false,
            // 加载标识
            // loading: false,
            // form表单
            // form: this.$form.createForm(this),
            // 选中的单行数据
            selectedSingleRow: {},
            defineCode: ''
        }
    },
    methods: {
        /**
         * @name: 筛选
         * @msg:
         * @param {type}
         * @return:
         */
        onFilter () {
            this.$refs.newTable.doFilter()
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
            e.path = 'InventoryContrastFindBook'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onClick (e) {
            if (e === 'export') {
                console.log(this.defineCode)
                if (this.defineCode === '' || this.defineCode === undefined) {
                    this.$message.error('请先选择要导出的盘点编码')
                    return
                }
                this.$refs.newTable.exportFile('InventoryContrastExportBookExcel', this.seachValue, true)
            }
        },
        exportTxt () {
            console.log(this.defineCode)
            if (this.defineCode === '' || this.defineCode === undefined) {
                this.$message.error('请先选择要导出的盘点编码')
                return
            }
            this.$refs.newTable.exportFile('InventoryContrastExportBookForTxt', this.seachValue, true, 'txt')
        },
        subCancel () {
            this.addEditModal = false
        },
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    axios({
                        path: 'StocktakeInputAddAdjust',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * 盘点调整
         */
        editHandler (row) {
            console.log(row)
            this.selectedSingleRow = { ...row }
            this.addEditModal = true
        },
        /**
         * @name: 盘点确定录入
         */
        confirmCode (e) {
            if (!this.defineCode) {
                this.$message.error('请选择要确定录入的盘点编码！')
                return false
            }
            const self = this
            this.$confirm({
                title: '警告',
                content: `确认将盘点编码：${this.defineCode}的状态改为已录入状态吗？`,
                onOk () {
                    axios({
                        path: 'InventoryContrastSubmitInput',
                        method: 'POST',
                        body: {
                            defineCode: self.defineCode
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$message.success(res.message)
                        }
                    })
                },
                onCancel () {}
            })
        },
        lockHandler () {
            if (!this.defineCode) {
                this.$message.error('请选择要锁定的盘点编码！')
                return false
            }
            const self = this
            this.$confirm({
                title: '提示',
                content: '一旦锁定无法进行调整，确认要进行盘点锁定吗 ?',
                onOk () {
                    axios({
                        path: 'StocktakeDefineAddLock',
                        method: 'post',
                        body: { code: self.defineCode }
                    }).then(res => {
                        if (res.flag === 1) {
                            const data = res.data
                            console.log(data)
                        }
                    })
                }
            })
        }
    },
    watch: {
        'seachValue.defineCode': {
            handler (val) {
                this.defineCode = val
            }
        },
        'seachValue.storeCode': {
            handler (val) {
                if (val) {
                    axios({
                        path: 'StocktakeDefineFindDefineByStoreCode',
                        method: 'post',
                        body: { storeCode: val }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$set(this.seachValue, 'defineCode', '')
                            this.$set(this.conditions[1], 'selectDataArr', res.data)
                            this.conditions.forEach(item => {
                                item.disabled = false
                            })
                        }
                    })
                } else {
                    this.$set(this.conditions[1], 'selectDataArr', [])
                }
            }
        }
    }
}
</script>

<style lang="less">
@import "../../../assets/modalStyle.less";
.ant-input-number{
    width: 100%;
}
</style>

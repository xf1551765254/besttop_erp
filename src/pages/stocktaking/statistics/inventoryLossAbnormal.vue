<!--
 * @Description: 损耗异常分析
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-21 22:37:15
 * @LastEditTime: 2019-04-23 18:14:59
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      :btns="btns"
      @onClick="onClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :rowSelect="false"
      :pams="seachValue"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
    >
    </NewTable>
    <!-- 编辑模态框 -->
    <a-modal
      title="损耗异常分析原因"
      v-model="reasonModal"
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
          <a-col :span="4">原因</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea placeholder="请输入分析原因" style="height:40px;padding:0 5px;max-height:40px;width:100%" v-decorator="$check('confirm.note')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import SeachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
export default {
    name: 'InventoryLossAbnormal',
    components: {
        SeachBox,
        NewTable
    },
    data: function () {
        return {
            btns: ['export'],
            // 表单
            form: this.$form.createForm(this),
            tableCode: '',
            tableApiPath: 'StocktakeStatisticalFindAbnormal',
            // 工具栏表单组
            conditions: [
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '分店',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
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
                { title: '开始时间', type: 'date', key: 'stocktakingStart' },
                { title: '结束时间', type: 'date', key: 'stocktakingEnd' },
                {
                    key: 'classCode',
                    type: 'input',
                    title: '分类'
                },
                {
                    key: 'uclassCode',
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
            menuOpt: [
                { name: '编辑',
                    action: 'inventoryLossAbnormal.edit',
                    fc: this.editHandler
                }
            ],
            // 工具栏表单数据收集
            seachValue: {},
            // 模态框打开关闭标识
            reasonModal: false,
            selectedRow: {},
            // 加载标识
            loading: false
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b8644c8b301f4cad97ff1af5e9f1295b:inventoryLossAbnormal'
            // this.tableApiPath = 'StocktakeStatisticalFindAbnormal'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
    },
    methods: {
        // 工具栏按钮监听
        onClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('StocktakeStatisticalFindAbnormal', this.seachValue)
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
            e.path = 'StocktakeStatisticalFindAbnormal'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        editHandler (row) {
            this.selectedRow = { ...row }
            this.reasonModal = true
        },
        // 模态框关闭
        subCancel () {
            this.reasonModal = false
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
                    values.id = this.selectedRow.id
                    axios({
                        path: 'StocktakeStatisticalUpdateReason',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addModal = false
                            this.reasonModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        }
    },
    watch: {
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

<style scoped>

</style>

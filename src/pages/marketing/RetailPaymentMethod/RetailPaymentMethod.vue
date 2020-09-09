<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-04 19:29:27
 * @LastEditors: lin
 * @LastEditTime: 2019-07-06 12:50:27
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
    </seachbox>
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :rowSelect="false"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <!-- 新增 编辑 -->
    <a-modal
      v-model="addEditModal"
      :title="addEditModalTitle"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      class="doc"
      centered>
      <template slot="footer">
        <a-button key="back" @click="addEditModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="submitClick">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">参数类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                :disabled="!isAdd"
                placeholder="请选择参数类型"
                style="width: 100%"
                :options="MarketTypeArr"
                v-decorator="$check('ParameterConfig.type',{initialValue:tableSingleData.type})"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">生效类型</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                :disabled="!isAdd"
                placeholder="请选择生效类型"
                style="width: 100%"
                :options="EffectTypeArr"
                v-decorator="$check('ParameterConfig.effectFlag',{initialValue:tableSingleData.effectFlag})"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="doc">
          <a-col :span="4">排序</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="1"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="0"
                v-decorator="$check('ParameterConfig.keySort', {initialValue:tableSingleData.keySort||1})"
                placeholder="请输入排序"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">配置健</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                style="width:100%"
                :min="0"
                :disabled="!isAdd"
                :max="Number.MAX_SAFE_INTEGER"
                :precision="0"
                v-decorator="$check('ParameterConfig.configKey', {initialValue:tableSingleData.configKey||0})"
                placeholder="请输入配置健"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">配置值</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                placeholder="请输入配置值"
                :autosize="{minRows: 1}"
                :disabled="!isAdd"
                style="width:100%;min-height:36px"
                v-decorator="$check('ParameterConfig.value', {initialValue:tableSingleData.value||''})" >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">描述</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                placeholder="请输入描述"
                :autosize="{minRows: 1}"
                style="width:100%;min-height:36px"
                v-decorator="$check('ParameterConfig.description', {initialValue:tableSingleData.description||''})" >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">备注</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                :autosize="{minRows: 1}"
                style="width:100%;min-height:36px"
                v-decorator="$check('ParameterConfig.note', {initialValue:tableSingleData.note||''})" >
              </a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="lastChildCrm">
          <a-col :span="4">上传图片</a-col>
          <a-col :span="20">
            <div style="height:121px;background-color:#fff">
              <upload :fileList="fileList" :fileLength="['上传图片']" @uploadFileList="uploadFileList" />
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less">
@import "../../../assets/modalStyle.less";
.lastChildCrm {
    .has-error .ant-form-explain {
        display: none;
    }
}
</style>
<style lang="less" scoped>
.lastChildCrm{
    border:1px solid #e8e8e8;
    background-color: #f5f5f5;
    .ant-form-item  {
        margin-bottom:0px;
    }
    .ant-col-4 {
        text-align: right;
        font-weight: bold;
        padding-right: 10px;
        font-size: 12px;
        background-color: #f5f5f5;
        line-height: 36px;
    }
    textarea.ant-input {
        margin-bottom:0px;
        min-height: 36px;
        border-radius:0;
        height: 100%;
    }

}
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import upload from '@comp/upload'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'ParameterConfig',
    components: { NewTable, SeachBox, upload },
    data () {
        // 工具栏按钮组
        return {
            btns: ['add'],
            // 工具栏表单数据收集
            seachValue: {},
            // 工具栏表单配置
            conditions: [
                {
                    key: 'type',
                    type: 'select',
                    title: '参数类型',
                    filter: true,
                    label: 'name',
                    value: 'code',
                    selectDataArr: []
                },
                {
                    key: 'effectFlag',
                    type: 'select',
                    title: '生效类型',
                    filter: true,
                    label: 'name',
                    value: 'code',
                    selectDataArr: []
                }
            ],
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            // 单行选中的数据
            tableSingleData: {},
            // 右键菜单
            disContextMenu: [],
            menuOpt: [
                { name: '编辑',
                    action: 'ParameterConfig.edit',
                    fc: this.addEdit
                },
                { name: '失效',
                    action: 'ParameterConfig.disable',
                    fc: this.failureHandler
                }
            ],

            // 新增 编辑
            addEditModal: false,
            addEditModalTitle: '',
            submitLoading: false,
            form: this.$form.createForm(this),
            isAdd: false,
            fileList: [], // 轮播图

            // 下拉框
            EffectTypeArr: [],
            MarketTypeArr: []
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b516142e9f91445e863fadf9753faa9a:ParameterConfig'
            this.tableApiPath = 'MarketingConfigQueryMarketingConfig'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getEffectDorpArr()
        this.getMarketDorpArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         * @msg:
         * @param {type}
         * @return:
         */
        onSeach (e) {
            e.path = 'MarketingConfigQueryMarketingConfig'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮
         * @msg:
         * @param {type}
         * @return:
         */
        onReload () {
            this.seachValue = {}
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
            }
        },
        /**
         * @name: 更新表格
         * @msg:
         * @param {type}
         * @return:
         */
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'MarketingConfigQueryMarketingConfig' })
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
        },
        /**
         * @name: 失效
         * @msg:
         * @param {type}
         * @return:
         */
        failureHandler (failData) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '是否确认失效，失效后将不可进行恢复, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'MarketingConfigDeleteMarketingConfig', // 接口path名，必传
                        method: 'post',
                        body: {
                            id: failData.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                },
                class: 'test'
            })
        },
        /**
         * @name: 新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            this.fileList = []
            if (addEditData === -1) {
                this.addEditModalTitle = '新增参数配置'
                this.isAdd = true
                this.tableSingleData = {}
            } else {
                this.addEditModalTitle = '编辑参数配置'
                this.isAdd = false
                const obj = { ...addEditData }
                if (obj.coverPictur) {
                    const pic = obj.coverPicture.split(',')
                    pic.forEach(item => {
                        this.fileList.push({
                            url: item,
                            fileUrl: item
                        })
                    })
                }
            }
            this.addEditModal = true
        },
        /**
         * @name: 新增编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        submitClick (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                    }
                    this.submitLoading = true
                    if (this.fileList.length === 0) {
                        values.picture = ''
                    } else {
                        const fileList = this.fileList.map(x => x.fileUrl)
                        values.picture = fileList.join(',')
                    }
                    if (!values.value) {
                        return this.$message.error('请输入配置值')
                    }
                    axios({
                        path: this.isAdd ? 'MarketingConfigAddMarketingConfig' : 'MarketingConfigUpdateMarketingConfig',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 图片上传
         * @msg:
         * @param {type}
         * @return:
         */
        uploadFileList (data) {
            this.fileList = data
        },
        /**
         * @name: 获取生效类型
         * @msg:
         * @param {type}
         * @return:
         */
        getEffectDorpArr () {
            axios({
                path: 'MarketingConfigQueryMarketingConfigEffectType',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.key = item.code
                        item.value = item.code
                        item.title = item.name
                    })
                    this.$set(this.conditions[1], 'selectDataArr', dataArr)
                    this.EffectTypeArr = dataArr
                }
            })
        },
        /**
         * @name: 获取参数类型
         * @msg:
         * @param {type}
         * @return:
         */
        getMarketDorpArr () {
            axios({
                path: 'MarketingConfigQueryMarketingConfigType',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.key = item.code
                        item.value = item.code
                        item.title = item.name
                    })
                    this.$set(this.conditions[0], 'selectDataArr', dataArr)
                    this.MarketTypeArr = dataArr
                }
            })
        }

    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'ParameterConfig') {
                this.getEffectDorpArr()
                this.getMarketDorpArr()
            }
        }
    }
}
</script>

<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-12 21:31:34
 * @LastEditTime: 2019-04-28 16:23:10
 -->
<template>
  <a-spin :spinning="quillUpdateImg" :tip="uploadTip">
    <a-upload
      class="avatar-uploader"
      :action="serverUrl"
      accept=".txt"
      name="file"
      :headers="getHeader()"
      :data="getData"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
      @change="imgChange"
    ></a-upload>
    <a-upload
      class="txt-uploader"
      :action="serverUrl2"
      accept=".txt"
      name="file"
      :headers="getHeader()"
      :data="getData"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
      @change="imgChange"
    ></a-upload>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button
        @click="onClick(-1)"
        icon="upload"
        size="small"
        v-action:import
        type="primary">商品主档导入</a-button>
      <a-button
        @click="onClick(1)"
        icon="upload"
        size="small"
        v-action:import
        type="primary">账面库存导入</a-button>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :rowSelect="false"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
    <a-modal
      title="选择要导入的盘点"
      v-model="importModal"
      :maskClosable="false"
      :closable="false"
      :keyboard="false"
      :width="500"
      class="doc"
      destroyOnClose
      centered
    >
      <template slot="footer">
        <a-button key="back" @click="subCancel">关闭</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
      <a-row class="doc">
        <a-col :span="4">盘点编码</a-col>
        <a-col :span="20">
          <a-form-item>
            <a-select
              style="width: 100%"
              showSearch
              optionFilterProp="children"
              :filterOption="filterOption"
              v-model="defineCode"
              :options="defineCodeArr"
              allowClear/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-modal>
  </a-spin>
</template>
<style lang="less">
@import "../../../assets/modalStyle.less";
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
</style>

<script>
import seachBox from '@comp/seachBox'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { URL } from '@/config/api.config'
import { axios } from '@/utils/request'
import moment from 'moment'
import is from 'is_js'
import { uuid } from 'vue-uuid'
import NewTable from '@comp/newTable'

let thisUuid = ''
let thisIndex = 0

export default {
    name: 'ImportInventory',
    components: {
        seachBox,
        NewTable
    },
    data: function () {
        return {
            tableCode: '',
            tableApiPath: 'StocktakeGoodsFindBySelected',
            defineCode: '',
            defineCodeArr: [],
            importModal: false,
            quillUpdateImg: false,
            uploadTip: '导入中...',
            conditions: [
                {
                    key: 'storeCode',
                    type: 'select',
                    title: '分店名称',
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
            btns: [],
            seachValue: {},
            index: 0,
            serverUrl: `${URL}/api-stocktaking/stocktake/goods/importStock`,
            serverUrl2: `${URL}/api-stocktaking/stocktake/goods/importGoods`
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '94f59d8f7bcc4933b574ad0e583e055e:importInventory'
            // this.tableApiPath = 'StocktakeGoodsFindBySelected'
        })
    },
    methods: {
        getHeader () {
            return {
                Authorization: Vue.ls.get(ACCESS_TOKEN),
                singleKey: thisUuid
            }
        },
        // 盘点编码搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        getData () {
            return {
                defineCode: this.defineCode
            }
        },
        subCancel () {
            this.importModal = false
        },
        handleSubmit () {
            if (is.empty(this.defineCode)) {
                this.$message.error('请选择需要导入库存的盘点')
                return
            }
            this.importModal = false
            if (this.index > 0) {
                document.querySelector('.avatar-uploader input').click()
            } else {
                document.querySelector('.txt-uploader input').click()
            }
        },
        onSeachClick () {

        },
        onReload () {
            this.seachValue = {}
        },
        onSeach (e) {
            e.path = 'StocktakeGoodsFindBySelected'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onClick (index) {
            this.index = index
            this.getDefineCode()
            this.importModal = true
        },
        // 导入前
        beforeUpload () {
            thisUuid = uuid.v1().replace(/-/g, '')
            thisIndex = 0
            this.quillUpdateImg = true
        },
        /**
         * @name: 新增/编辑模态框中盘点编码数据获取
         */
        getDefineCode () {
            axios({
                path: 'StocktakeDefineFindOption',
                method: 'post',
                body: { storeCode: this.seachValue.storeCode }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((item, index) => {
                        item.stocktakingDate = moment(item.stocktakingDate).format('YYYY-MM-DD')
                        item.key = index + 1
                        item.title = `${item.code}-${item.storeName}-${item.stocktakingDate}`
                        item.value = item.code
                    })
                    this.defineCodeArr = [...res.data]
                }
            })
        },
        imgChange ({ file, fileList, event }) {
            console.log(file, fileList, event)
            if (file.status === 'done') {
                const { flag, message } = file.response
                // 如果导入成功
                if (flag === 1) {
                    this.uploadTip = '正在解析文件...'
                    this.getEvent()
                    this.$message.success(message)
                } else {
                    this.$message.error(message)
                    this.quillUpdateImg = false
                    this.uploadTip = '导入中...'
                }
            }
            if (file.status === 'uploading') {
                if (event) {
                    const l = Number(event.percent).toFixed(2)
                    const d = (Number(event.loaded) / 1024).toFixed(2)
                    const t = (Number(event.total) / 1024).toFixed(2)
                    this.uploadTip = `${l}% [${d}kb/${t}kb]`
                }
            }
            if (file.status === 'error') {
                this.quillUpdateImg = false
                this.$message.error('导入失败')
                this.uploadTip = '导入中...'
            }
        },
        getEvent () {
            thisIndex++
            console.log('第', thisIndex, '次')
            axios({
                path: 'StocktakeGoodsQueryImportSchedule',
                method: 'POST',
                headers: { singleKey: thisUuid }
            }).then(res => {
                if (res.flag === 1) {
                    const currentTotal = Number(res.data.currentTotal)
                    const total = Number(res.data.total)
                    if (res.data.status === 1) {
                        this.quillUpdateImg = false
                        this.uploadTip = '导入中...'
                    } else {
                        const l = (currentTotal / total * 100).toFixed(2)
                        this.uploadTip = `正在解析文件...${l}% [${currentTotal}条/${total}条]`
                        if (thisIndex < 600) {
                            setTimeout(() => {
                                this.getEvent()
                            }, 1000)
                        } else {
                            this.quillUpdateImg = false
                            this.uploadTip = '导入中...'
                            this.$message.error('解析失败，请重试')
                        }
                    }
                } else {
                    this.quillUpdateImg = false
                    this.uploadTip = '导入中...'
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

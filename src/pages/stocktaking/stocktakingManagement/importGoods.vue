<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-12 21:31:34
 * @LastEditTime: 2019-04-16 10:20:02
 -->
<template>
  <a-spin :spinning="quillUpdateImg" :tip="uploadTip">
    <a-upload
      class="avatar-uploader"
      :action="serverUrl1"
      accept="application/vnd.ms-excel,.csv"
      name="file"
      :headers="getHeader()"
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
      <div class="btn-box">
        <a-button
          style="margin-right:10px;"
          @click="onClick(1)"
          icon="upload"
          size="small"
          v-action:import
          type="primary">元数据基础信息导入</a-button>
        <a-button
          @click="onClick(-1)"
          icon="upload"
          size="small"
          v-action:import
          type="primary">商品主档导入</a-button>
      </div>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :pams="seachValue"
      :rowSelect="false"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath">
    </NewTable>
  </a-spin>
</template>
<style lang="less">
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
</style>

<script>
import seachBox from '@comp/seachBox'
import NewTable from '@comp/newTable'
import { axios } from '@/utils/request'
import { uuid } from 'vue-uuid'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { URL } from '@/config/api.config'

let thisUuid = ''
let thisIndex = 0

export default {
    name: 'ImportGoods',
    components: {
        seachBox,
        NewTable
    },
    data: function () {
        return {
            tableCode: '',
            tableApiPath: '',
            quillUpdateImg: false,
            uploadTip: '导入中...',
            conditions: [
                { title: '商品编码', type: 'input', key: 'skuCode' },
                { title: '商品名称', type: 'input', key: 'name' }
            ],
            btns: [],
            seachValue: {},
            serverUrl1: `${URL}/api-stocktaking/stocktake/goods/importExcel`,
            serverUrl2: `${URL}/api-stocktaking/stocktake/goods/importGoods`
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b738cbce2d3241f0abf0d2ecbf59fedc:commodityInfo'
            this.tableApiPath = 'GoodsInformationSearch'
        })
    },
    methods: {
        getHeader () {
            return {
                Authorization: Vue.ls.get(ACCESS_TOKEN),
                singleKey: thisUuid
            }
        },
        onSeachClick () {

        },
        onReload () {
            this.seachValue = {}
        },
        onSeach (e) {
            e.path = 'GoodsInformationSearch'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onClick (index) {
            if (index > 0) {
                document.querySelector('.avatar-uploader input').click()
            } else {
                document.querySelector('.txt-uploader input').click()
            }
        },
        // 导入前
        beforeUpload () {
            thisUuid = uuid.v1().replace(/-/g, '')
            thisIndex = 0
            this.quillUpdateImg = true
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
    }
}
</script>

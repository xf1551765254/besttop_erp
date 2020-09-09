<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-01 21:58:08
 * @LastEditTime: 2019-04-29 09:09:16
 -->
<template>
  <a-modal
    title="导出"
    v-model="value"
    :maskClosable="false"
    :closable="false"
    :keyboard="false"
    :width="600"
    destroyOnClose
    centered>
    <template slot="footer">
      <a-button key="back" @click="subCancel" :disabled="loading">关闭</a-button>
      <a-button key="submit" type="primary" :loading="loading" @click="exportFile">确定</a-button>
    </template>
    <a-spin :spinning="spinLoading" tip="正在生成...">
      <div :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom:'20px' }">
        <a-checkbox
          :indeterminate="indeterminate"
          @change="onCheckAllChange"
          :checked="checkAll"
        >全选</a-checkbox>
      </div>
      <br />
      <a-checkbox-group v-model="colValue" @change="onChange">
        <a-row>
          <a-col :span="8" v-for="(col, index) in cols" :key="index">
            <a-checkbox :value="col">{{ col.name }}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-spin>
  </a-modal>
</template>

<style scoped>

</style>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
import moment from 'moment'
export default {
    name: 'ExportToFile',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        path: {
            type: String,
            default: ''
        },
        body: {
            type: Object,
            default: () => {}
        },
        cols: {
            type: Array,
            default: () => []
        },
        isDiy: {
            type: Boolean,
            default: false
        },
        fileType: {
            type: String,
            default: 'excel'
        },
        fileName: {
            type: String,
            default: '文件'
        }
    },
    data: function () {
        return {
            indeterminate: false,
            checkAll: false,
            colValue: [],
            loading: false,
            spinLoading: false
        }
    },
    methods: {
        exportFile () {
            if (is.empty(this.$props.path)) {
                this.$message.error('缺少path')
                return
            }
            if (this.colValue.length === 0 && this.$props.fileType !== 'txt') {
                this.$message.error('请最少选择一列')
                return
            }
            this.spinLoading = true
            this.loading = true
            const body = {
                ...this.$props.body,
                page: 1,
                rows: 2147483647
            }
            const headers = {}
            if (this.$props.isDiy) {
                body.showExportFields = [...this.colValue]
            } else {
                body.showEd7309fcb2c0 = [...this.colValue]
                headers.export = this.$props.fileType
            }

            axios({
                path: this.$props.path,
                method: 'post',
                headers,
                body,
                config: { responseType: 'arraybuffer', isSteamData: true }
            }).then(res => {
                this.spinLoading = false
                this.loading = false
                if (res.status > 200) {
                    // eslint-disable-next-line
                    const message = new Buffer.from(res.data).toString()
                    this.$message.error(message)
                    return
                }
                if (res.data) {
                    let blob = ''
                    let fileName = ''
                    const pageTitle = this.$route.meta.title
                    if (this.$props.fileType === 'excel') {
                        blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
                        fileName = `${this.$props.fileName}-${moment().format('YYYY-MM-DD HH:mm:ss SSS')}.xlsx`
                    } else if (this.$props.fileType === 'txt') {
                        blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' })
                        fileName = `${this.$props.fileName}-${moment().format('YYYY-MM-DD HH:mm:ss SSS')}.txt`
                    }
                    const link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = fileName
                    link.click()
                    window.URL.revokeObjectURL(link.href)
                    this.colValue.length = 0
                    this.checkAll = false
                    this.$emit('input', false)
                } else {
                    this.$message.error('导出失败')
                }
            })
        },
        subCancel () {
            this.colValue.length = 0
            this.checkAll = false
            this.$emit('input', false)
        },
        onChange () {
            this.indeterminate = !!this.colValue.length && (this.colValue.length < this.$props.cols.length)
            this.checkAll = this.colValue.length === this.$props.cols.length
        },
        onCheckAllChange (e) {
            Object.assign(this, {
                colValue: e.target.checked ? this.$props.cols : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
        }
    },
    watch: {
        value: {
            handler (val) {
                if (val) {
                    if (this.$props.fileType === 'txt') {
                        this.exportFile()
                        this.$emit('input', false)
                    }
                }
            },
            immediate: true
        }
    }
}
</script>

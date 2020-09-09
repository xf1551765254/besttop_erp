<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lmt
 * @Date: 2019-08-06 14:28:24
 * @LastEditors: lmt
 * @LastEditTime: 2019-08-23 10:16:54
 -->
<template>
  <a-modal
    title="图片上传"
    v-model="visible"
    :maskClosable="false"
    :width="800"
    destroyOnClose
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="24" :style="{height: '400px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :autoCrop="options.autoCrop"
          :fixedBox="options.fixedBox"
          :centerBox="options.centerBox"
          :fixed="true"
          :fixedNumber="fixedNumber"
          :full="true"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
    </a-row>
    <template slot="footer">
      <div class="upload-select">
        <label class="ant-btn ant-btn-primary" style="line-height: 32px;" for="fileinp">选择图片
          <input
            style="display:none;"
            type="file"
            accept="image/*"
            :value="imgFile"
            id="fileinp"
            @change="uploadImg" />
        </label>
      </div>
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { UPLOAD } from '@/config/api.config'
import { axios } from '@/utils/request'
export default {
    name: 'UploadModal',
    components: { VueCropper },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        // autoCropWidth: {
        //     type: Number,
        //     default: 320
        // },
        // autoCropHeight: {
        //     type: Number,
        //     default: 320
        // },
        img: {
            type: String,
            default: ''
        },
        fixedNumber: {
            type: Array,
            default: function () {
                return [1, 1]
            }
        }
    },
    data () {
        return {
            visible: false,
            confirmLoading: false,
            options: {
                img: '',
                autoCrop: true,
                outputType: 'png',
                fixedBox: true,
                centerBox: true
            },
            afterCrop: {},
            fileName: '',
            imgFile: ''
        }
    },
    methods: {
        cancelHandel () {
            this.$set(this.options, 'img', '')
            this.$emit('input', false)
        },
        okHandel () {
            this.$refs.cropper.getCropData((data) => {
                const formData = new FormData()
                formData.append('file', dataURLtoFile(data, this.fileName))
                this.confirmLoading = true
                axios({
                    path: 'upDate',
                    URL: UPLOAD,
                    method: 'POST',
                    formData
                }).then(res => {
                    if (res.flag === 1) {
                        this.imgFile = ''
                        console.log('fileUrl', res.data.url)
                        this.$emit('on-choose', { url: res.data.url })
                        this.cancelHandel()
                    }
                    this.confirmLoading = false
                })
            })
        },

        realTime (data) {
            this.afterCrop = data
        },
        uploadImg (e) {
            this.imgFile = ''
            const file = e.target.files[0]
            if (!file.type.includes('image/')) {
                alert('请选择图片文件')
                return
            }
            this.fileName = file.name
            if (typeof FileReader === 'function') {
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.$set(this.options, 'img', e.target.result)
                }
                reader.readAsDataURL(file)
            }
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.options = {
                    img: this.$props.img,
                    autoCrop: true,
                    outputType: 'png',
                    fixedBox: true,
                    centerBox: true
                }
                // this.$set(this.options, 'img', this.$props.img)
            }
            this.visible = val
        }
    }
}

// 将base64转换为文件
function dataURLtoFile (dataurl, filename) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
}
</script>

<style lang="less" scoped>
    .right-box{
        height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .upload-select{
        // position: absolute;
        float:right;
        margin-left: 10px;
        // text-align: center;
        // width: 100%;
        // bottom: 0%;
    }
    .upload-preview {
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
        }
    }
</style>

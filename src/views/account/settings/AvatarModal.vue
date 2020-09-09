<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-02-27 19:08:49
 * @LastEditTime: 2019-07-18 10:55:48
 -->
<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img"/>
        </div>
        <div class="avatar-upload-select">
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
      </a-col>
    </a-row>

    <template slot="footer">
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
    components: { VueCropper },
    data () {
        return {
            visible: false,
            id: null,
            confirmLoading: false,

            options: {
                img: '',
                autoCrop: true,
                autoCropWidth: 180,
                autoCropHeight: 180,
                outputType: 'png',
                fixedBox: true,
                centerBox: true
            },
            previews: {},
            fileName: '',
            imgFile: ''
        }
    },
    methods: {
        edit (id, img) {
            /* 获取原始头像 */
            this.options.img = img
            this.visible = true
            this.id = id
        },
        close () {
            this.id = null
            this.options.img = ''
            this.visible = false
        },
        cancelHandel () {
            this.close()
        },
        okHandel () {
            const { $store } = this
            this.$refs.cropper.getCropData((data) => {
                const formData = new FormData()
                formData.append('file', dataURLtoFile(data, 'avatar.png'))
                this.confirmLoading = true
                axios({
                    path: 'upDate',
                    URL: UPLOAD,
                    method: 'POST',
                    formData
                }).then(res => {
                    if (res.flag === 1) {
                        this.imgFile = ''
                        $store.commit('SET_AVATAR', res.data.url)
                        this.$emit('change', res.data.url)
                        this.close()
                    }
                    this.confirmLoading = false
                })
            })
        },

        realTime (data) {
            this.previews = data
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
                    this.options.img = e.target.result
                    // this.$refs.cropper.replace(e.target.result)
                }
                reader.readAsDataURL(file)
            }
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

    .avatar-upload-preview {
        position: absolute;
        top: 50%;
        transform: translate(50%, -50%);
        width: 180px;
        height: 180px;
        border-radius: 50%;
        box-shadow: 0 0 4px #ccc;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
        }
    }
    .avatar-upload-select{
        position: absolute;
        text-align: center;
        width: 100%;
        bottom: 0%;
    }
    .btn-upload{

    }
</style>

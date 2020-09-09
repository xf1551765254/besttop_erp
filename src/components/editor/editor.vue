<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-30 21:18:13
 * @LastEditTime: 2019-08-23 11:31:21
 -->
<template>
  <a-spin :spinning="quillUpdateImg" :tip="uploadTip">
    <a-upload
      class="avatar-uploader"
      :action="serverUrl"
      accept="image/*"
      name="file"
      :headers="header"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
      @change="imgChange"
      multiple></a-upload>
    <a-upload
      class="video-uploader"
      :action="serverUrl"
      accept="video/*"
      name="file"
      :headers="header"
      :showUploadList="false"
      :beforeUpload="beforeUpload"
      @change="imgChange"
    ></a-upload>
    <quill-editor
      class="editor ql-editor"
      :style="`height:${height}px;`"
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </a-spin>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor, Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
// import { ImageDrop } from 'quill-image-drop-module'

import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { UPLOAD } from '@/config/api.config'

// Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

export default {
    name: 'Editor',
    components: {
        quillEditor
    },
    props: {
        /* 编辑器的内容 */
        value: {
            type: String,
            default: ''
        },
        /* 图片大小 */
        maxSize: {
            type: Number,
            default: 4096 // kb
        }
    },
    data: function () {
        const self = this
        return {
            height: self.$store.getters.windowHeight - 300,
            content: '',
            quillUpdateImg: false,
            uploadTip: '上传中...',
            isUploadImage: true,
            accept: 'image/*',
            editorOption: {
                placeholder: '',
                theme: 'snow', // 主题
                modules: {
                    // imageDrop: true,
                    imageResize: {
                        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                    },
                    toolbar: {
                        container: [ // 工具栏选项
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image', 'video']
                        ],
                        handlers: {
                            image: function (value) {
                                if (value) {
                                    self.isUploadImage = true
                                    document.querySelector('.avatar-uploader input').click()
                                } else {
                                    self.quill.format('image', false)
                                }
                            },
                            video: function (value) {
                                if (value) {
                                    self.isUploadImage = false
                                    document.querySelector('.video-uploader input').click()
                                } else {
                                    self.quill.format('video', false)
                                }
                            }
                        }
                    }
                }
            },
            serverUrl: `${UPLOAD}/file/upload`,
            header: {
                Authorization: Vue.ls.get(ACCESS_TOKEN)
            }
        }
    },
    methods: {
        onEditorBlur (quill) {

        },
        onEditorFocus (quill) {

        },
        onEditorReady (quill) {

        },
        onEditorChange ({ quill, html, text }) {
            this.$emit('input', html)
            this.$emit('change', html)
        },
        // 富文本图片上传前
        beforeUpload (file, fileList) {
            this.quillUpdateImg = true
        },
        imgChange ({ file, fileList, event }) {
            if (file.status === 'done') {
                this.$logger.info(`上传成功${JSON.stringify(file.response)}`)
                const { flag, data, message } = file.response
                const quill = this.$refs.myQuillEditor.quill
                // 如果上传成功
                if (flag === 1) {
                    // 获取光标所在位置
                    const length = quill.getSelection().index
                    // 插入图片
                    if (this.isUploadImage) {
                        quill.insertEmbed(length, 'image', data.url)
                    } else {
                        quill.insertEmbed(length, 'video', data.url)
                    }
                    // 移动光标到最后
                    quill.setSelection(length + 1)
                } else {
                    if (this.isUploadImage) {
                        this.$message.error('图片插入失败:' + message)
                    } else {
                        this.$message.error('视频插入失败:' + message)
                    }
                }
                this.quillUpdateImg = false
                this.uploadTip = '上传中...'
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
                if (this.isUploadImage) {
                    this.$message.error('图片插入失败')
                } else {
                    this.$message.error('视频插入失败')
                }
                this.uploadTip = '上传中...'
            }
        }
    },
    watch: {
        // value (val) {
        //     this.content = val
        // },
        // watch 默认初始时时不会监听的  需要添加immediate
        value: {
            handler (val) {
                this.content = val
            },
            immediate: true
        },
        '$store.getters.windowHeight': {
            handler (val) {
                this.height = val - 290
            }
        }
    }
}
</script>

<style>
.ant-spin-nested-loading > div > .ant-spin {
    max-height: 550px;
}
.editor {
  line-height: normal; /*!important;*/
  /* height: 550px; */
}
.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>

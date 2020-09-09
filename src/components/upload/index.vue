<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-03-15 15:38:50
 * @LastEditTime: 2019-04-30 11:35:50
 -->
<template>
  <div class="upload-box">
    <div
      class="demo-upload-list"
      v-for="(item,index) in fileList"
      :key="index">
      <template>
        <img :src="getUrl(item.url)">
        <div class="demo-upload-list-cover">
          <a-icon type="eye" @click="handlePreview(item)"/>
          <a-icon type="delete" @click="handleRemove(item,index)"/>
        </div>
      </template>
    </div>
    <a-upload
      class="upload"
      :action="action"
      :accept="fileAccept"
      :headers="header"
      listType="picture-card"
      :showUploadList="false"
      @change="handleChange"
      :beforeUpload="beforeUpload"
      name="file"
      :multiple="multiple"
      :directory="directory"
    >
      <div v-if="(fileLength.length===0 || fileList.length < fileLength.length)&& !noUpload">
        <a-icon type="plus" />
        <div class="ant-upload-text">{{ fileLength.length > 0 ? fileLength[fileList.length]:'请上传' }}</div>
      </div>
    </a-upload>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      :bodyStyle="{padding:'40px', maxWidth:'800px'}"
      destroyOnClose
      centered>
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<style lang="less" scoped>
canvas {
  display: block;
  border-bottom: 1px solid black;
}
    .upload-box{
        padding: 0 10px;
        .upload{
            display:inline-block;
            float: left;
            margin: 5px 0;
        }
        .demo-upload-list {
            display: inline-block;
            width: 104px;
            height: 104px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            margin-right: 4px;
            flex-shrink: 0;
            float: left;
            margin: 5px 0;

        }

        .demo-upload-list img {
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover {
            display: block;
        }
        .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 0 2px;
        }
        .demo-upload-list {
            display: inline-block;
            width: 104px;
            height: 104px;
            text-align: center;
            line-height: 60px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            background: #fff;
            position: relative;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            margin-right: 4px;
        }
        .demo-upload-list img {
            width: 100%;
            height: 100%;
        }
        .demo-upload-list-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
        }
        .demo-upload-list:hover .demo-upload-list-cover {
            display: block;
        }
        .demo-upload-list-cover i {
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin: 40px 5px;
        }
    }
    .ant-upload-select-picture-card i {
        font-size: 20px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        color: #666;
    }
</style>

<script>
import Vue from 'vue'
import { UPLOAD, PATH, FILE_REVIEW } from '@/config/api.config'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import is from 'is_js'
const Base64 = require('js-base64').Base64
export default {
    name: 'Upload',

    props: {
        // 默认文件数组
        fileList: {
            type: Array,
            default: function () {
                return []
            }
        },
        // 最多上传的文件个数 默认无限制
        fileLength: {
            type: Array,
            default: () => []
        },
        // 最大上传的文件大小 默认为5M
        fileSize: {
            type: Number,
            default: 20
        },
        // 是否支持多选文件
        multiple: {
            type: Boolean,
            default: false
        },
        // 接受上传的文件类型 默认只上传图片
        accept: {
            type: Array,
            default: function () {
                return ['IMG']
            }
        },
        // 支持上传文件夹 默认不支持
        directory: {
            type: Boolean,
            default: false
        },
        // PDF是否添加水印
        watermark: {
            type: Boolean,
            default: true
        },
        noUpload: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            title: '查看合同',
            pdfDoc: null,

            previewVisible: false,
            // 文件预览地址
            previewImage: '',
            action: `${UPLOAD}${PATH.upDate}`,
            header: { Authorization: Vue.ls.get(ACCESS_TOKEN) },
            // 文件数组

            fileAccept: '',
            fileType: {
                // pdf格式
                PDF: ['.pdf'],
                // excel格式
                EXCEL: ['.xlsx', '.csv', '.xls'],
                // 图片格式
                IMG: ['.png', '.jpeg', '.jpg', '.gif', '.svg', '.psd', '.ai', '.bmp', '.tif', '.cdr'],
                // ppt格式
                PPT: ['.ppt', '.key'],
                // 文本格式
                TXT: ['.txt'],
                // word格式
                WORD: ['.docx', '.doc', '.wps'],
                // 压缩文件格式
                RAR: ['.zip']
            },
            // 其他类型图标
            otherIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM5MTQ0NjkwRjJFMzExRTg5NDlFOTQ5ODIxOUVGQzVEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM5MTQ0NjkxRjJFMzExRTg5NDlFOTQ5ODIxOUVGQzVEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzkxNDQ2OEVGMkUzMTFFODk0OUU5NDk4MjE5RUZDNUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzkxNDQ2OEZGMkUzMTFFODk0OUU5NDk4MjE5RUZDNUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz71wlgMAAADYElEQVR42uxaiVIaQRDtvXB33V0FRMADNcZojh/Jd5jf8odyVUwqVcZoypRGokZgQQ4hQrqHQyCWNTGJLDsz1JTUgsW+16/f9PSO8vL19nMA2MKZBrFGFuemKih46GDeUgUF3yNBBcGHJEASIAmQBEgCJAGSAEmAJEDUoY/iRyMRA2zbAtvCaZvs7+HRMeQLxXARoCgKmObENdAOaF3XwqcAVVV70WRAcVqmideVcKbAlOd2gLZBU6SF8oBHayv/JWXisek7/e+P8/z4mOBtabSyvHivBMhlMEg3c3V1BW/ffeT6rm2ZsLG+Gi4CaMVIJWe4vmvoevgUoCgqzKWTshQW2gNevXnP5wFYgzx9vBY2D1BhYT7Fd+NB84BcrgDT0x4DQSOf98H1HNA1jUW2dlmHSYxas9kE3y9BNDp1YyGUnJ0ZvxQ4+HrEChHPdXq1v1+8AGfShtUHGbbL84slBjCFAA+PsoysRuMn2xkOpwFv1dgle+QEJJMJyOULbD/Q3ekVS2VIJGKgoQJIHR6q4fTsHE7wxuuNBlvvY6iC/srvj+qAIHmAxTZCCgNLsx0hQEJMqNUukYwLdo0iruIHhqHDwlwKypXqbx6wlJnn9AAtWB7Aok4y78iScr0d1SaLFkn+En0gHouydCigDwzLn2Q9E4+Onwfs7H7pAR7whoNDWF5aANeZHASKL8exb4xivV7n9gDDMIJBQBo9wMfavFqtMcDZkzOIoMw9zx3oE5BBVms1SKUSTO7H2VOmiH4P2P6wM34eUK5UwJyYgDQCo6gs4lpe8IvMCGl/TyRQ7Z5ZnGfXu4PIGvaA1ZUM129qmhqcFBiu38kIKbLd6M4m4r3PaDW4TdbkFcKWwq1WC0qoGq6qERVAhVWoCCAj3dndF3cvQHm9sf6QTwGKEr4UoAWSOj1Ce0CB8+kQqcV1nfB5wOf9A5E9QINnT/hAKeH0AHpwGrnfJgwIPgLnAXucHjByAj7hDnD44ejf5iWtAvd9RuDOBFCTo9vo6O70LHo0bpkDhx/+RdtqLFKg2WxBuVxhs3/cdECCOkLCeAC1xGjm+h7eEgHXBynaKdQSyQSpN+g3Sqw1Nuohj8lJAiQBkgBJgCRAEiAJkARIAgQmICsw/u9EwAt6IyD4bzg3fwkwAIQJAFaf1FpCAAAAAElFTkSuQmCC',
            // pdf格式下图标
            pdfIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlFMkMyRjhDRjJFMzExRTg5NkUwREU1M0YyRDY5MEI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlFMkMyRjhERjJFMzExRTg5NkUwREU1M0YyRDY5MEI3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUUyQzJGOEFGMkUzMTFFODk2RTBERTUzRjJENjkwQjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUUyQzJGOEJGMkUzMTFFODk2RTBERTUzRjJENjkwQjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Q+fdlAAAEjklEQVR42uyZW2xURRjH/3suu2cvBEIqBRtLpYSQyFIaU4qCIF6gJFoJJUKUGCMEE4OCtTZRvLxQayG+GKJPJEaKEgKIKb40XBJ9EDAFa4uWNlKM1KXt1i2WvZ6bM3Pas5JgQgS3285McrIz26Sn32+++X//b+qJ1axdA2AfeWaBrxEhz2aJ0+AxGvM+idPgXQgSOB8CgAAgAAgAAoAAIAAIAAKAACAA8DmUnL/R44G2YSN8q6oAnxeZ1lYkD+wHDIMPAL5Vq6Gtfza7froa1vXrSB87yscRUB9ZwT4zp09CP3eWzeVZM/nRALmkxAFw8gTs+A02t2/EOQGgqvBoGptaf8YgFcwYnQ9xAsCy/rGwIc10Ut/s6+MEgGnCTqedFxcWkgwocLj0XeVHA6xrEfbpXbaclUQ7nYIVjfIDwLx82ZGD5Suya9vmB4DR9Yvjh4ggOusuvqyw8eOFm9edHXwBsIaGYHRfcuqArsP8+SJ/zZD125VsWQwEOAMgy1ArKh0d8Png3/gcXwDUisXwTJvmrr1PPAl5zhx+APhWV7nNkHGpi3mBwLbtblWY1ADk4tlQwgvZPH38OJKffsLuAeTiYmjPb5r8ALSa9U7pu9gJkwihefV3JJv3O5nxVDXUxZWTF4B0bxHUh5c6u3/sK/f79Dct0M+3sXngtR2Q7yvOKYCc3Qj5aYqT8272dEO/cD77A/Jd+shhKAvCrFUO7nyHmKPO0YbRghUbhtXfD/NKL3toQzXhACjz50OtXMLmqUMHoZSVQQ2XQZ43D3JpKSmHWjZTCu6B99GVt/w9diLBbpFoBtHjczeGJ1az9v/tRMgOT2naQ0pdqev+bqX4dop0hX/0QZ5dwrwC3enMme8hhaZAKipyW+cxA5X8/DMipC35nQFyyf1M+MaCd5sgEpzZ28saI1oKzZ4e0hIPOj5h6TIEd9QyCNLUqYg3NrA7BIl4B+XBCviqn4FMgPhffIkdDf2Hc/mXAUrZImjraqA8sCC7w2TnDXL29bNn2B9N0/nfhnflYwi8so1lj9HdjcTuRljDw6NOSkWw/i2o5eWklf4VI/V1+ZMB0oxCBLa+DGVR+c3ef2AAI2/Wwo7f3uVn5vQp5g8Cr26HQnQitPsj4hn2EvEknSQBSXWEAmDHJV+OAC1xdNfGLj2ZWtOzbNtI7P34toN3IXz3Ldn1GIJv1EOaPp1Uh/dgtLdD72gnArrQ7Szzwgf4qtYgWFvHgrcGB506T9KX1fmWr2H8x5bX6OjASN3rrk+g1cO/6QV2xBw/cXT8M0AJh+HfspXNaX1PHfwSoXffJ2glJnDJA8131jpHo4h/sIu9x/s4aZyIobKGosicaIXe1jb+ALQNTjtr/NSOFAk2+PZOeEIhpuqJPU13zbjQbKBP3jlBZe5c16SEGptYmbNH/kK8YVdWufN43DEAm6i1R1GgLnnISdlIBPEPG8b1nx05FcHUF83MqFgD/UgdPkREq3bCBJ8bKzzZM0AAEAAEAAFAABAABAABQAAQAAQAAWCiAohwHP81CmALnXAYPL202Py3AAMAqTWxcO8U7p0AAAAASUVORK5CYII=',
            // excel格式文件图标
            excelIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIwRjg3M0U3RjJFMzExRTg5NzIyQTFDRjExQkFEQkEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIwRjg3M0U4RjJFMzExRTg5NzIyQTFDRjExQkFEQkEwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjBGODczRTVGMkUzMTFFODk3MjJBMUNGMTFCQURCQTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjBGODczRTZGMkUzMTFFODk3MjJBMUNGMTFCQURCQTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7TeJqqAAAFWklEQVR42uyae0xbVRzHvy2llFIehbaUUsooD2EIQtwfzE0hkzhBjUZdjDp0gwU3Q/ZIcImCuJiJE83cpmbqwCUkYmLcEk2WkbD4x2bUyJw4laG8yrOMFhiFQqGl9dyLNoO241FGKT0nueHcy72n/X3O7/E955YTW5KTB6CGHFHwraYlRxHXR43HfzbXcH3UeDsELny8UQAUAAVAAVAAFAAFQAFQABQABUABUAC+2Hie+NAAfz4kIeEQB4UgXqZCVlIGQkTBOPTFUUxbzOsHQCBfAFlYBJThUVBJFEiOjkdipApqWQxkoeHE/Tj2e80WCywzFu/0gCCBENLgcMTJVdiojEeyXA2FWIpEeSxCAkWLGkMz2AOrzeZ9AD54+Q08kZmDAD9/t8aJkUShZm8lOFyO3S+4HOIjHA7mcrHBj+uHWxMG9I/oUHn+tGcBbE/d7Lbxs3lBgC3xGeDx+OASA2esM8RwR49gLnEJJH+eH3vucQAavRZpMYluA+jR9+Ght3faz5mZd9UYMA8kZKLuwHHPh4B1hWLR6sTIOzXjlGlt6ICVEhJM0rxw+HM0lJ1FgnzDwok3QOC9QshomnC4xiexn0pCKZEYz1SUhdpKFQy3Q2D+9xgyjKD86xPERSexLSULu7Y9zV4/feFLnLvWAP34MB5J3Yqqlw7Pea5Lp8Wj7+4myc8K82L0AMe2NgBwnIify82NMJon8XPb73YAJxtqYZqZZvs7s59yGEfA84dIEESMN2OcwFtIFK2UB7gdAjbb3PQlFASi9tUqtj9tmcblvxphmpy0G787+xmkxyY5jBMplqCx8hya3vsOD96zacngPRcCTmbi/oR7kaFMRlNvCyrOfwQxmdnZxCXEW8+WOB3HZJ5iPcdGQqBtoGvhmbNx1gYArot6fWZfJTaX72AlruZ/1Vjwustxum72o7j6zWXnHs9VARcApCFi5G7Msp9vSkhH3n1bXQ4THS5DaX4hDubtIosn+fpYDf7accPeb+3tZGfNleOKhEEoyStg+809regdHlgVH7hrAMrOVkE3OczWd7KcwahpDC+eOIS6gx86vX9wdAgFp15jc8GAQbeM+uOhELBaHcXwBJGpX12rZ/tHnjuA0scK2f6P7U3QDPU7F0eTRrTru9F9S4upGfMqmX8XlKCVlMXH39lDtL2NXc6+kJWPopwd9v/v+6TM6XPMXkLbyUvoPPU9shIyVi0LrjiAHv0AtGN68MiSNj8ze/ZDyNJVHR7D9m/oNPi0vs7huSmzGfqxEQwahmAwjnlvEowKk+DP4xcxbjIi9LbdoNr9x3Ds22r83deBH1qu4pXtz89Z8rZrNch/v3gJZXCNJEHuvGjk+/PZv6HztsKUEQp8XFjhcrmrkkajJLcAFhJC3/xykXjDsPeXwTvLh7ngRIFClD45myw1um7UX7+yvgHMbyMTBuz/7Agb/23DfcuqPl4NoFc3gCsdvy36fh1JmGsCgJwkvZVooYHByE3bAn4An5le9j0BszfAuU1uM3nDn8djxVKmMmVtALje/Q8eTsty+4uoZFGoLj666p7nNoC9NRWQiMIQLZZDLVNCTbJ52oZkKMSRiJEqiB7gLjIEtCg+U46ZJex0WKwWzwNgdnC0ozr2uKr5w36deXkhFoZAEhQGJYGTEZeCpOg4qCKioCaqj8+b+y4hgqwem7Ud3ucBrhrzYkM/PsIeLTc7canlJ3v5E/ICoAiTsfI3XqpCekwSOH5g1aOFPLcuALjeQbLBaDahldR65vB0oz+QoAAoAAqAAqAAKAAKgAKgACgACsBnAWh92P4BBsAepuODxjNbz0X/CjAAydu9ArBWijMAAAAASUVORK5CYII=',
            // 图片格式图标
            imgIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFENUYwNDQ1RjJFMzExRThBMTYwODE0REE4NUJBQ0VBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFENUYwNDQ2RjJFMzExRThBMTYwODE0REE4NUJBQ0VBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUQ1RjA0NDNGMkUzMTFFOEExNjA4MTREQTg1QkFDRUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUQ1RjA0NDRGMkUzMTFFOEExNjA4MTREQTg1QkFDRUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5p/zbrAAADCElEQVR42uyYS0wTURSG/5m+S1tLX/SVCEIUtKVEkAZEMEaMaKIrY6KJCpWQyEYTXys3mpiIC2M0rrpwxdqlxoVro4kJ0cRgYuKDooRGFlLQAt5bpaKl0MdAh845yU2nM3faOd/899z/XmF0uLMHQJQ1D5QVMdYiokKTx5+co6JCk09DEKHwIAAEgAAQAAJAAAgAASAABIAAEAACQAAIgPJCXdTNBgfsjf0wetshqnVITIwgPhLFzOSb8geg0tvg734AtdGVPmd0t8DgCmHs2UUkvr4q7yFg23Hqn+QXQxA1cLZcKP8aYKhqznpNa6lmw8NORbCsASTGX2S99mPqPZKJSckeUmPywbXrkrwAxF8/RPL7l4zzC/M/MfHyjmQPqNJZ4d07BEvtYegqt8oHwNzsN3x43Iepd48wNxPHfHIa07Hn+PR0ULIZQNRUpJLnCmDlFbZAr+QAhNHhzgU5jk0+m3i7brFiu3OpvvDxyQBm42/LvQgKcIWv/Jc81kQF6waggrnFzISWD3uoH+bN3Vl+pw06W/3GAmCuOQj3nhtwNA1yba/Yd1PdUVQ2nFzZhAXObBwA1vrjqApfhSCoWBWvg7n6QHaV+HbD2Xw+BzW1QW9vkDsAgUl5gL31c6njtLyDEQgqXUZvvX073O3XVlXIXxX0yhgAS8LVeplJ+UTm6outH6zbjmUYHU/nTQZGn/NfGD3hFDTZARBUWng6rsOy5VDWPhwMNzhLjc7i97wWZBKoQFIAKePSNcTGcseq/WyB06lP/uZ/G538w+hphd4RkAcAvj/g23cXBldTTv0ttUfYm79dtIyLVYEkADQmL/z776WqfO5lQi3JGOabMHpnsHQAtNZalvz9gmUsRdgDfaUBYHA2ws9kz+VfyuAOs1AVFAyAmxY+hkWtSRarh0JVUBAAS00P3GyqW87QlFIFBmdo7QFwa8tXatzayi1swfxVINv9gPUK2hQlAASAABAAAkAACAABIAAEgAAQAAJAAAiAIgHEFJz/OAdwlh8oMPnPrEV+CTAAoAt/EH950k4AAAAASUVORK5CYII=',
            // ppt文件图标
            pptIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFFRTFCQTkzRjJFMzExRTg4NDI0QkI5MkM2QzkxODQ2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFFRTFCQTk0RjJFMzExRTg4NDI0QkI5MkM2QzkxODQ2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUVFMUJBOTFGMkUzMTFFODg0MjRCQjkyQzZDOTE4NDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUVFMUJBOTJGMkUzMTFFODg0MjRCQjkyQzZDOTE4NDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4vG/7cAAAB+UlEQVR42uzaPUhCURQH8ONX6qOgLaQgiNYgigYboq8lqjFqasigCIKGhpYaWhqioTajIKigpihyCacggiBwaAsCKdPIlAwNP1/3SglmSg0PXvf+D1wQ8ck7P98759yHhtf+ugEi2mbLQXJFkC2XgQE8Sph8AcEocfI8HEaSPAAAAAAAAAAAAAAAAAAAAAAAADKGWbMv7holU6vzV59V42+Uu70hNRalrO9MDACevHV47M/Hqe8JyviuKLmzSrm7a/luAYNdIYuzm6rdHrItbMldA6r6hsi+fCB3EeRXg3lw6v/VgHKRi4QpfeEtPok2J5nqG8seYx2ZoIzHLQaA+vJMyY25oveSn13DPr+SrwElBZXhGJvaNSmKurkFMueHlDzeL3+iDc3i14D00WbFtio8gBq5xyhcaVoUHqBSu+OjstAAvMrbxmfLj8esSArRBklR8i2vEDW1ZG7pIEtn748tkEfKeyLOIMR7urK4/qfNUWpvTc4iyJNPLE1r2h10C5AN+PPJa/18wKy3xL/2Ct/HZWEA+GWde/AXJx1+YivEfu1Lzaq9fnaDLPn4TI9urjg8FQYAAAAAAAAAQN7QbBBKn+7mJ7uSSTAW1RUA/7e4ilsAAAAAAAAAAAAAAAAAAAAAAAAgH0BQ4vxDHGCSv5Aw+QBbrg8BBgBkSZPCLI0iWAAAAABJRU5ErkJggg==',
            // 文本图标
            txtIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkIzMTUzOTcwRjJFMzExRTg4RjRBQUE5NjREN0Y4QTBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkIzMTUzOTcxRjJFMzExRTg4RjRBQUE5NjREN0Y4QTBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QjMxNTM5NkVGMkUzMTFFODhGNEFBQTk2NEQ3RjhBMEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QjMxNTM5NkZGMkUzMTFFODhGNEFBQTk2NEQ3RjhBMEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75gpfeAAAF6klEQVR42uxb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',
            // word文件图标
            wordIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkFCRkM2NkY0RjJFMzExRTg5OENEQ0Q0Q0NCNDA2MUUwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkFCRkM2NkY1RjJFMzExRTg5OENEQ0Q0Q0NCNDA2MUUwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QUJGQzY2RjJGMkUzMTFFODk4Q0RDRDRDQ0I0MDYxRTAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QUJGQzY2RjNGMkUzMTFFODk4Q0RDRDRDQ0I0MDYxRTAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4cqsdFAAAC/UlEQVR42uyY30tTYRjHH0dUFCE6am02l79SzlrCRKXUoESo8LZdBF0Z0U3QhX9IUBd54UUEQnRRFxFBhJFWajgSUQym5UasBSJeFNlN+VSTs/d9nrPmOacNzvPAgZ337Dmc5/N8n+f9UWUkRs4DwOjWFQRvWXbrGvJ5NHj4G/Ooz6PBb0PwgcdNAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACACP2S47zneG+6Gvs0kbz2TX4dyNB6zftUEDrl/uJZ+dvXoXchub5LOnNy9COFijjSeG78NCZuP/K+Dl7Co5jh8ZqN7D+vXEI+yz/niYfUYFj7B3GrxtAGPjqZIDQTDxKB9k3KBP6Qe7aJ/puXR5e0ByIVNSIFYZRuuK1ZPjndEQOf5s+kN5AbxK0mVwvOUwOX66I2L5Pn/NfoiGq/X3HdPft7b+FSYXv5QXwMOJ5ZL6QEcsrAWh2oVTjdpYfUiv/5n5tN3Ptw8AOzZXBqrcL51phn17dxcN4kRrYbZ7jUOaH9qj8feVsQ7gykDtA+r90koOUqtrml9bU6Dg/mSszhX5OwaAKwO1D6gNbupdGibmPml+mG1z11cV4ZT8HQPAlYG5D6CMscGZ7cnrld9zOM7lVl0/Eqp1Rf6OLoW5Msj3gYHuBk3C+QUMNZd3t/9RC84IKjin5O8oAErK5rrPB0RJmJrL8+rpa69zTf6OAuCkjH0As6guY1+8/bj9G7NJTYeonuaI3zX5O74bfP4mRWZSzeK37z/g8UymaFZbj/qh4Uit5uuU/B0HgE2NsoGeloL72Xm9YSYXs+Tqr60xUNS3YgBwZaAGQe0icWOF2bXys9qBVsyBCFUG2n+SdBaXlnOWfgjIagdaEQC4MjDvHrkDD24qdUv+rgDgyuBfguRWlG7J3/aRGGe3x6bY/Tu3XsivKG/dm4TgwQMlH8Ds1KqMxMhP8LDJsbgAEAACQAAIAAEgAASAABAAAkAACAABIAAEgBcBZD0c/2cEcAV/eDB4PJ0d+iXAAEtxDxv9tXW/AAAAAElFTkSuQmCC'
        }
    },
    mounted () {
        this.getAccept()
    },

    methods: {
        getAccept () {
            const accept = this.$props.accept.length ? this.$props.accept : Object.keys(this.fileType)
            const fileAccept = []
            accept.forEach(item => {
                fileAccept.push(...this.fileType[item])
            })
            this.fileAccept = fileAccept.join(',')
        },
        // 文件预览
        handlePreview (file) {
            const {
                name,
                url,
                thumbUrl,
                fileUrl
            } = file
            let ex = ''
            if (name) {
                ex = '.' + name.replace(/.+\./, '').toLowerCase()
            } else if (url) {
                ex = '.' + url.replace(/.+\./, '').toLowerCase()
            } else if (fileUrl) {
                ex = '.' + fileUrl.replace(/.+\./, '').toLowerCase()
            }
            if (is.inArray(ex, this.fileType.IMG)) {
                this.previewImage = url || thumbUrl || fileUrl
                this.previewVisible = true
            } else if (is.inArray(ex, this.fileType.PDF)) {
                const routeUrl = this.$router.resolve({
                    name: 'PDF',
                    query: { url: Base64.encode(file.fileUrl), watermark: Base64.encode(this.watermark) }
                })
                window.open(routeUrl.href)
            }
        },
        // 上传状态发生改变时
        handleChange (info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (info.file.status === 'done') {
                this.handleSuccess(info.file)
            } else if (info.file.status === 'removed') {
                this.$message.error(`${info.file.name} 删除成功！`)
                this.$emit('uploadFileList', info.fileList)
            } else if (info.file.status === 'error') {
                this.$message.error(`${info.file.name} 上传失败！`)
            }
        },
        // 操作成功父组件返回
        handleSuccess (file) {
            file.thumbUrl = ''
            const ex = '.' + file.name.replace(/.+\./, '').toLowerCase()
            const icon = this.getIcon(ex)
            if (file.response.flag === 1) {
                this.$message.success(`${file.name} 上传成功！`)
                const responseFile = {
                    name: file.name,
                    uid: file.uid,
                    path: file.response.data.path,
                    server: file.response.data.server,
                    fileUrl: `${FILE_REVIEW}/${file.response.data.path}`, // file.response.data.url,
                    url: is.inArray(ex, this.fileType.IMG) ? file.response.data.url : icon
                }
                const newFile = [...this.fileList, responseFile]
                this.$emit('uploadFileList', newFile)
            }
        },
        // 取消预览
        handleCancel () {
            this.previewVisible = false
        },
        // 图片删除
        handleRemove (item, index) {
            const newFileList = [...this.fileList]
            newFileList.splice(index, 1)
            this.$emit('uploadFileList', newFileList)
        },
        // 文件上传前事件
        beforeUpload (file) {
            // const isJPG = file.type === 'image/jpeg'
            // if (!isJPG) {
            //     this.$message.error('You can only upload JPG file!')
            // }
            // if (!('name' in file) || typeof (file.name.replace(/.+\./, '').toLowerCase()) !== 'string') {
            //     this.$message.error(`无法识别的文件类型不支持上传！[${file.name}]`)
            //     return false
            // }
            if (file.size === 0) {
                this.$message.error(`空文件不允许上传！[${file.name}]-->${file.size / 1000}KB`)
                return false
            }
            if (is.number(this.fileSize) && file.size / 1024 / 1024 > this.fileSize) {
                this.$message.error(`文件大小超过${this.fileSize}M`)
                return false
            }
            // const accept = [...this.PDF, ...this.EXCEL, ...this.IMG, ...this.PPT, ...this.TXT, ...this.WORD, ...this.RAR]
            // if (is.not.inArray(file.name.replace(/.+\./, '').toLowerCase(), accept)) {
            //     this.$message.error(`不支持的文件类型！[${file.name}]`)
            //     return false
            // }
            return true
        },
        getIcon (ex) {
            if (is.inArray(ex, this.fileType.PDF)) return this.pdfIcon
            if (is.inArray(ex, this.fileType.EXCEL)) return this.excelIcon
            if (is.inArray(ex, this.fileType.PPT)) return this.pptIcon
            if (is.inArray(ex, this.fileType.TXT)) return this.txtIcon
            if (is.inArray(ex, this.fileType.WORD)) return this.wordIcon
            if (is.inArray(ex, this.fileType.RAR)) return this.otherIcon
            return this.otherIcon
        },
        getUrl (url) {
            const ex = '.' + url.replace(/.+\./, '').toLowerCase()
            if (is.inArray(ex, this.fileType.IMG)) {
                return url
            } else {
                return this.getIcon(ex)
            }
        }
    }
}
</script>

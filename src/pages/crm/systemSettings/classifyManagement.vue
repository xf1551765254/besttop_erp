<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-06-15 17:42:53
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-04 10:39:40
 -->
<template>
  <div class="classifyManagement" :style="{height:windowHeight+'px'}">
    <div class="class-tree">
      <a-tree
        :treeData="treeData"
        :selectedKeys.sync="classCodes"
        autoExpandParent
        checkStrictly
        defaultExpandAll
        @select="handSelect"
      >
      </a-tree>
    </div>
    <div class="class-content">
      <div class="content-top">
        详情介绍
      </div>
      <div class="content-action">
        <a-button @click="handleAdd">新增</a-button>
        <a-button @click="handleDel" :disabled="isDelete">删除</a-button>
        <a-button @click="hadnleUp">编辑</a-button>
      </div>
      <div class="content-footer">
        <div class="classify-message">
          <h3>分类信息</h3>
          <div>
            <a-form>
              <a-row class="doc">
                <a-col :span="12">
                  <a-form-item
                    label="分类编码"
                    :label-col="{ span: 6 }"

                    :wrapper-col="{ span: 16 }">
                    <a-input placeholder="" disabled v-if="type===2" v-model="classifyDetail.classCode"/>
                    <a-input placeholder="" disabled v-else v-model="classifyDetail.typeCode"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="分类名称"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span: 16 }">
                    <a-input
                      placeholder=""
                      disabled
                      v-if="type===2"
                      v-model="classifyDetail.className"/>           <a-input placeholder="" disabled v-else v-model="classifyDetail.typeName"/>

                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    label="上级分类"
                    :label-col="{ span: 6 }"
                    :wrapper-col="{ span: 16 }">
                    <a-input placeholder="" disabled v-model="classifyDetail.superCode"/>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row class="doc">
                <a-col :span="12">
                  <a-form-item
                    label="图片"
                    :label-col="{ span: 6}"
                    :wrapper-col="{ span: 16 }">
                    <!-- <a-input placeholder="" /> -->
                    <img
                      class="classify-img"
                      v-if="classifyDetail.picture"
                      :src="classifyDetail.picture"
                      alt=""
                      srcset=""
                      @click="imgVisible=true">
                    <img v-else class="classify-img" src="@assets/goods.png" @click="imgVisible=true" alt="">
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </div>
        <div class="active-message">
          <h3>操作信息</h3>
          <a-form>
            <a-row class="doc">
              <a-col :span="12">
                <a-form-item
                  label="创建人"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }">
                  <a-input placeholder="" disabled v-model="classifyDetail.createBy"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="创建时间"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }">
                  <a-input placeholder="" disabled v-model="classifyDetail.createTime"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="修改人"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }">
                  <a-input placeholder="" disabled v-model="classifyDetail.updateBy"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="修改时间"
                  :label-col="{ span: 6 }"
                  :wrapper-col="{ span: 16 }">
                  <a-input placeholder="" disabled v-model="classifyDetail.updateTime"/>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
    <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form
        :form="form"
      >
        <a-form-item
          label="上级分类"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <span v-if="isFrist===1">{{ classCode+'-'+className }}</span>
          <span v-if="isFrist===2">{{ superCode+'-'+superName }}</span>
          <!-- <a-input
            v-decorator="[
              'note',
              {rules: [{ required: true, message: 'Please input your note!' }]}
            ]"
          /> -->
        </a-form-item>
        <a-form-item
          label="分类名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'className',
              {rules: [{ required: true, message: '请输入分类名称!' },{
                max:20,message:'分类名称最多可输入20个字符'
              }]}
            ]"

          />

        </a-form-item>
        <a-form-item
          label="图标"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <div class="dropbox">
            <upload :fileList="fileList" :fileLength="['图标']" @uploadFileList="uploadFileList"></upload>
          </div>
        </a-form-item>

      </a-form>
    </a-modal>
    <a-modal
      :title="title"
      :visible="picvisible"
      @ok="picHandleOk"
      :confirmLoading="confirmLoading"
      @cancel="picvisible=false"
    >
      <a-form
        :form="picform"
      >
        <a-form-item
          label="分类名称"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <span v-if="isFrist===1">{{ classCode+'-'+className }}</span>
          <span v-if="isFrist===2">{{ superCode+'-'+superName }}</span>
          <!-- <a-input
            v-decorator="[
              'note',
              {rules: [{ required: true, message: 'Please input your note!' }]}
            ]"
          /> -->
        </a-form-item>
        <a-form-item
          label="图标"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <div class="dropbox">
            <upload :fileList="fileList" :fileLength="['图标']" @uploadFileList="uploadFileList"></upload>
          </div>
        </a-form-item>

      </a-form>
    </a-modal>
    <a-modal
      title="图片预览"
      :width="900"
      :visible="imgVisible"
      @ok="imgVisible=false"
      @cancel="imgVisible=false">
      <img style="width:100%" v-if="classifyDetail.picture" :src="classifyDetail.picture" alt="" srcset="">
      <img style="width:100%" v-else src="@assets/goods.png" alt="">
    </a-modal></div>
</template>

<script>
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import upload from '@comp/upload'
import { setTimeout } from 'timers'

export default {
    name: 'ClassifyManagement',
    components: {
        upload
    },
    data () {
        return {
            treeData: [],
            id: '',
            className: '',
            classCode: '',
            classCodes: [],
            confirmLoading: false,
            visible: false,
            classifyDetail: {},
            title: '新增',
            isFrist: 0,
            superCode: '',
            superName: '',
            // 表单
            formLayout: 'horizontal',
            form: this.$form.createForm(this),
            picform: this.$form.createForm(this),
            loading: false,

            imageUrl: '',
            imgVisible: false,
            fileList: [],
            isAdd: undefined,
            isDelete: true,
            type: '',
            picvisible: false

        }
    },
    created () {
        this.getClassify()
    },
    computed: {
        ...mapGetters(['userInfo', 'windowHeight', 'storeInfo'])
    },
    methods: {
        /// SystemClassifyQueryList
        // 详情 SystemClassifyDetailSystemClassify
        // SystemClassifyAddSystemClassifyType
        // 新增 url：SystemClassifyAddSystemClassify
        // 参数：{"superCode":"01","className":"哇啦啦"}
        // 修改url:SystemClassifyUpdateSystemClassify
        // 参数：{"id":"259c88fbd7644f7fa739c6d2c8f533cc","className":"测试用的11"}
        // 删除  url:SystemClassifyDeleteSystemClassify
        getClassify (isFrist) {
            axios({
                path: 'SystemClassifyQueryList',
                method: 'post',
                body: {
                    typeId: 1
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    res.data.forEach(el => {
                        el.key = el.id
                        el.title = el.typeName
                        // el.disabled = true
                        if (el.children) {
                            el.children.forEach(item => {
                                item.key = item.id
                                item.title = item.className
                            })
                        }
                    })
                    this.treeData = res.data
                    if (typeof isFrist === 'undefined') {
                        this.classCodes = [this.treeData[0].id]
                        this.id = this.treeData[0].id
                        this.type = this.treeData[0].type
                        this.isFrist = this.treeData[0].superCode ? 2 : 1
                        this.classCode = this.treeData[0].typeCode
                        this.superCode = this.treeData[0].typeCode
                        this.className = this.treeData[0].typeName
                        this.superCode = this.treeData[0].typeName
                        this.isDelete = true
                    }
                    this.getDetail()
                }
            })
        },
        handleOk () {
            this.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values)
                    console.log(values)
                    axios({
                        path: this.isAdd ? 'SystemClassifyAddSystemClassify' : 'SystemClassifyUpdateSystemClassify',
                        method: 'post',
                        body: {
                            superCode: this.isAdd ? this.classCode : null,
                            id: this.isAdd ? null : this.classifyDetail.id,
                            className: values.className,
                            picture: this.fileList.length > 0 ? this.fileList[0].fileUrl : null

                            // ...this.visible
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log(res.data)
                            if (res.data.id) {
                                this.classCodes = [res.data.id]
                                this.id = res.data.id
                                this.type = 2
                            }
                            this.getClassify(1)

                            // this.classifyDetail = res.data || {}
                        }
                    })
                    this.visible = false
                }
            })
        },
        handleCancel () {
            this.visible = false
        },
        handleAdd () {
            if (this.type === 1) {
                this.visible = true
                this.title = '新增'
                this.isAdd = true
                setTimeout(() => {
                    this.form.setFieldsValue({
                        className: ''
                    })
                }, 0)
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择一级菜单！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        },
        handleDel () {
            this.$confirm({
                title: '提示信息',
                content: '确认删除此分类吗？',
                okText: '是',
                cancelText: '否',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        axios({
                            path: 'SystemClassifyDeleteSystemClassify',
                            method: 'post',
                            body: {
                                id: this.id
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                this.id =
                                this.getClassify()
                                // this.classifyDetail = {}
                            }
                        })
                        resolve()
                    }).catch((err) => console.log(err))
                },
                onCancel: () => {
                    return new Promise((resolve, reject) => {
                        this.visible = false
                        resolve()
                    }).catch(err => console.log(err))
                }

            })
        },
        hadnleUp () {
            if (this.type === 1) {
                this.picvisible = true
                this.title = '编辑'
                this.fileList = this.classifyDetail.picture ? [{ url: this.classifyDetail.picture }] : []
            } else {
                console.log(this.classifyDetail)
                this.visible = true
                this.title = '编辑'
                setTimeout(() => {
                    this.form.setFieldsValue({
                        className: this.classifyDetail.className
                    })
                }, 0)
                this.isAdd = false
                this.fileList = this.classifyDetail.picture ? [{ url: this.classifyDetail.picture }] : []
                console.log(this.fileList)
            }
        },
        handSelect (selectedKeys, e) {
            console.log(selectedKeys)
            console.log(e)

            console.log(this.isFrist)
            if (selectedKeys.length > 0) {
                this.id = selectedKeys[0]
                this.className = e.node.title
                this.classCode = e.node.dataRef.typeCode
                this.superCode = e.node.dataRef.superCode
                this.type = e.node.dataRef.type
                console.log(this.type)

                const code = selectedKeys[0]
                this.treeData.forEach(el => {
                    // console.log(el)

                    if (code === el.id && this.type === 1) {
                        console.log(el.children.length)

                        this.isDelete = el.children.length > 0
                        console.log(el.children.length > 0)
                    }
                    if (this.type === 2) {
                        this.isDelete = false
                    }
                    if (this.superCode === el.typeCode) {
                        this.superName = el.typeName
                    }
                })
                this.isFrist = e.node.dataRef.superCode ? 2 : 1
            } else {
                this.isDelete = true
                this.getClassify()
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请选择菜单！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
            this.getDetail()
        },
        getDetail () {
            // if (this.isFrist === 2 && this.id) {
            axios({
                path: 'SystemClassifyQuerySystemClassifyDetail',
                method: 'post',
                body: {
                    id: this.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)
                    this.classifyDetail = res.data
                }
            })
            // } else {
            // this.classifyDetail = {}
            // }
        },
        picHandleOk () {
            if (this.fileList.length > 0) {
                axios({
                    path: 'SystemClassifyAddSystemClassifyType',
                    method: 'post',
                    body: {
                        id: this.classifyDetail.id,
                        picture: this.fileList[0].fileUrl

                    }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res.data)
                        this.getClassify(1)
                        // this.classifyDetail = res.data || {}
                        this.picvisible = false
                    }
                })
            } else {
                let secondsToGo = 3
                const modal = this.$success({
                    title: '提示',
                    content: '请上传图片'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            }
        },
        // 图片上传
        uploadFileList (data) {
            console.log(data)
            this.fileList = data
            // this.fileList = data
        }
    }

}
</script>

<style lang="less" scoped>
    .classifyManagement{
        background-color: #fff;
        height: 100%;
        /deep/ .li.ant-tree-treenode-disabled >.ant-tree-node-content-wrapper /deep/ span{
            color: rgba(0, 0, 0, .65)
        }
        .doc{
            margin:0 30px;
        }
        .class-tree{
            width: 360px;
            padding-top: 20px;
            height: 100%;
            float: left;
            overflow: auto;
        }
        .class-content{
            padding-top: 20px;
            width: calc(100% - 360px);
            overflow: auto;
            height: 100%;
            border-left: 1px solid #ccc;
            padding-left: 40px;
            float: left;
            .content-top{
                font-size: 18px;

            }
            .content-action{
                padding: 20px;
                float: right;
                button{
                    margin-right: 15px;
                }
            }
            .classify-img{
                // width: 300px;
                width: 160px;
                height: auto;
            }
        }
        .content-footer{
            clear: both;
        }
    }
</style>

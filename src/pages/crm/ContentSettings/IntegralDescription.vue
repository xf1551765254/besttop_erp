<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-06-26 09:54:18
 * @LastEditors: laikt
 * @LastEditTime: 2019-07-03 17:31:03
 -->
<template>
  <div class="IntegralDescription">
    <div class="action">
      <div>
        <a-button
          size="small"
          type="primary"
          icon="plus"
          style="margin-right:10px"
          :disabled="disable"
          @click="addHandler()">新增</a-button>
        <a-button
          size="small"
          style="margin-right:10px"
          type="primary"
          icon="edit"
          :disabled="!disable"
          @click="updateHandler()">编辑</a-button>
        <a-button size="small" type="primary" icon="delete" @click="deleteHandler()">删除</a-button>
      </div>

    </div>
    <h3>详情介绍</h3>
    <div class="content" v-if="isShow">
      <p style="text-align:center">
        暂无数据

      </p>
    </div>

    <div class="content" v-else>
      <a-form layout="inline">
        <a-row class="setDocCss">
          <a-form-item>
            <label for="" class="cont-label">标题：</label>
            <a-input
              style="width:200px"
              disabled
              :value="detailDate.titles"
            />
          </a-form-item>
          <a-form-item>
            <label for="" class="cont-label">编码：</label>
            <a-input
              style="width:200px"
              disabled
              :value="detailDate.code"
            />
          </a-form-item>
        </a-row>
        <a-row>
          <label for="" class="cont-label">内容：</label>
          <div class="cont-msg" v-html="detailDate.sendContent">
          </div>
        </a-row>
        <a-row>
          <label for="" class="cont-label">状态：</label>
          <div class="cont-msg">
            <a-select
              style="width:200px"
              disabled
              :value="detailDate.status"
            >
              <a-select-option v-for="item in status" :key="item.code" :value="item.code">{{ item.value }}</a-select-option>
            </a-select>
          </div>
        </a-row>
      </a-form>

    </div>
    <!-- 预览 -->
    <a-modal
      :title="title"
      :width="900"
      :visible="addMoal"
      @cancel="addMoal=false"
      @ok="submitInfo"
    >
      <div class="content">
        <a-form :form="form">

          <a-row class="setDocCss">
            <a-col :sm="8" :md="4" :xl="3">标题名称</a-col>
            <a-col :sm="16" :md="8" :xl="5">
              <a-form-item>
                <a-input
                  style="width:100%"
                  placeholder="请输入标题名称"
                  v-decorator="$check('IntegralDescription.titles',{initialValue:data.titles||''})"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="min-height:350px;">
            <a-col :sm="8" :md="4" :xl="3">内容</a-col>
            <a-col :sm="16" :md="17" :xl="18" class="clear content" style="height: auto">
              <a-form-item>
                <editor
                  v-model="data.sendContent"
                  style="width:100%;height:300px;"
                ></editor>
                <a-input
                  style="display:none;"
                  placeholder="请输入内容"
                  v-decorator="$check('IntegralDescription.sendContent',{initialValue:data.sendContent||''})"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :md="4" :xl="3">状态</a-col>
            <a-col :sm="16" :md="8" :xl="5" class="clear" >
              <a-form-item>
                <a-select
                  placeholder="请选择发送类型"
                  showSearch
                  v-decorator="$check('IntegralDescription.status',{initialValue:data.status||''})"
                  allowClear
                >
                  <a-select-option v-for="item in status" :key="item.code" :value="item.code">{{ item.value }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
  </div></template>

<script>
import { axios } from '@/utils/request'
import editor from '@comp/editor/editor'

export default {
    name: 'IntegralDescription',
    components: {
        editor
    },
    data () {
        return {
            addMoal: false,
            disable: true,
            detailDate: {},
            form: this.$form.createForm(this),
            status: [],
            data: {},
            isAdd: true,
            title: '',
            isShow: false
        }
    },
    mounted () {
        this.QueryDetail()
        this.getMsgStaticData()
    },
    watch: {
        'data.sendContent' (val, oldVal) {
            console.log(val)
            // this.tableSingleData.sendContent = val
            this.form.setFieldsValue({ sendContent: val

            })
            // console.log(this.tableSingleData.sendContent)
        }
    },
    methods: {
        /**
         //IntroductionScoreAddIntroductionScore  新增
         IntroductionScoreUpdateIntroductionScore  编辑
         IntroductionScoreQueryIntroductionScoreDetail   详情
        IntroductionScoreDeleteIntroductionScore   删除
         */
        getMsgStaticData () {
            axios({
                path: 'OrganizationConfigFindByType', // 接口path名，必传
                method: 'post',
                body: {
                    type: 'system_introduction_score_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.status = res.data
                    this.status.forEach(el => {
                        el.code = el.type + ':' + el.configKey
                        // console.log(el.code)
                    })
                }
            })
        },
        QueryDetail () {
            axios({
                path: 'IntroductionScoreQueryIntroductionScoreDetail',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    this.detailDate = res.data || {}
                    if (!res.data) {
                        this.isShow = true
                    } else {
                        this.isShow = false
                    }
                    this.disable = !!this.detailDate.id
                }
            })
        },
        addHandler () {
            this.data = {
                titles: '',
                sendContent: '',
                status: 'system_introduction_score_status:1'
            }
            this.addMoal = true
            this.isAdd = true
            this.title = '新增'
        },
        updateHandler () {
            this.data = JSON.parse(JSON.stringify(this.detailDate))
            this.addMoal = true
            this.isAdd = false
            this.title = '修改'
        },
        submitInfo () {
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const data = values
                    data.id = this.data.id
                    axios({
                        path: this.isAdd ? 'IntroductionScoreAddIntroductionScore' : 'IntroductionScoreUpdateIntroductionScore',
                        method: 'post',
                        body: data
                    }).then(res => {
                        if (res.flag === 1) {
                            this.QueryDetail()
                            this.addMoal = false
                            // this.detailDate = res.data || {}
                        }
                    })
                }
            })
        },
        deleteHandler () {
            axios({
                path: 'IntroductionScoreDeleteIntroductionScore',
                method: 'post',
                body: {
                    id: this.detailDate.id
                }
            }).then(res => {
                if (res.flag === 1) {
                    // this.detailDate = res.data || {}
                    this.QueryDetail()
                }
            })
        }

    }
}
</script>

<style lang="less" scoped>
.IntegralDescription{
    height: 100%;
    padding: 0 20px;
    background-color: #ffffff;
    .action{
        padding: 20px;
        overflow: hidden;
        border-bottom: 1px solid #ccc;

        >div{
            float: right;
        }
    }
    >h3{
        border-bottom: 1px solid #ccc;
        padding: 16px 0;
    }
    .content{
        .cont-label{
            float: left;
            width: 120px;
            text-align: right;
        }
        .cont-msg{
            float: left;
            width: calc(100% - 120px);
            min-height: 300px;
        }
    }
}
        .content{
            /deep/ .ant-spin-container{
                height: 100%;
                /deep/ .editor{
                    height: 100% !important;
                    /deep/  .ql-container{
                            height: calc(100% - 66px);
                    }
                }
            }
        }
</style>

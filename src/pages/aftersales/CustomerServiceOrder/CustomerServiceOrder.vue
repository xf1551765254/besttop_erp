<!--
 * @Description: 客户服务单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-05-22 16:15:02
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 16:17:13
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seach-box
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <!-- <a-button size="small" type="primary" v-action:add @click="confirmHandler(-1)">确认</a-button> -->
      </div>
    </seach-box>
    <!-- main table -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- confrim  modal -->
    <a-modal
      title="确认/拒绝"
      v-model="confrimModal"
      centered
      :destroyOnClose="true"
      :maskClosable="false"
      :closable="false"
      width="400px">
      <div>
        <a-form :form="form">
          <a-form-item
            label="服务确认"
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 19 }">
            <a-radio-group
              style="width:100%"
              @change="onChange"
              buttonStyle="solid"
              v-decorator="[
                'status',
                {initialValue: 'trouble_record_status:2' }]">
              <a-radio-button style="width:50%;text-align:center" value="trouble_record_status:2">确认</a-radio-button>
              <a-radio-button style="width:50%;text-align:center" value="trouble_record_status:3">拒绝</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="备注"
            :label-col="{ span: 5}"
            :wrapper-col="{ span: 19 }">
            <a-textarea
              placeholder="请输入"
              v-decorator="[
                'confirmNote',
                {rules: [{max:200,message: '输入的备注内容不能超过200字' }]}
              ]"/>
          </a-form-item>
        </a-form>
      </div>
      <template slot="footer">
        <a-button @click="confrimModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :submitLoading="submitLoading" @click="submit">确认</a-button>
      </template>
    </a-modal>
    <!-- 预览 -->
    <preview
      v-model="previewVisbel"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="顾客信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">顾客电话</a-col>
          <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.customerTelephone }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">顾客姓名</a-col>
          <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.customerName }}</a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">顾客地址</a-col>
          <a-col :sm="16" :md="20" :xl="21" class="aColHeightNo">
            <a-tooltip placement="topLeft" autoAdjustOverflow>
              <template slot="title">
                <span> {{ previewDetailData.customerAddress }}</span>
              </template>
              {{ previewDetailData.customerAddress }}
            </a-tooltip>
          </a-col>
        </a-row>
      </div>
      <div slot="B" title="问题描述">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">服务标题：</a-col>
          <a-col :sm="16" :md="20" :xl="21">{{ previewDetailData.troubleTitle }}</a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">服务描述：</a-col>
          <a-col :sm="16" :md="20" :xl="21" class="aColHeightNo">
            <a-tooltip placement="topLeft" autoAdjustOverflow>
              <template slot="title">
                <span>{{ previewDetailData.troubleDescribe }}</span>
              </template>
              {{ previewDetailData.troubleDescribe }}
            </a-tooltip>
          </a-col>
        </a-row>
        <a-row style="margin:10px 0" type="flex" justify="start">
          <a-col :sm="8" :md="4" :xl="3">图片展示</a-col>
          <a-col :sm="16" :md="20" :xl="21" style="min-height:100px;height:auto;padding:5px 5px">
            <div class="formImg">
              <!-- <div v-if="previewImage.length===0">
                <img class="" alt="example" style="height:90px" src="@assets/goods.png" />
              </div> -->
              <div v-for="(item, index) in previewImage" :key="`IMG-${index}`">
                <img
                  v-if="item"
                  class=""
                  alt="example"
                  height="90"
                  width="110"
                  :src="item"
                  :onerror="defaultImgUrl"/>
                <img
                  v-else
                  class=""
                  alt="example"
                  height="90"
                  width="110"
                  style="height:90px"
                  src="@assets/goods.png" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div slot="footer">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">确认人</a-col>
          <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.confirmBy }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">确认时间</a-col>
          <a-col :sm="16" :md="8" :xl="9">{{ previewDetailData.confirmTime }}</a-col>
        </a-row>
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">备注</a-col>
          <a-col :sm="16" :md="20" :xl="21">{{ previewDetailData.note }}</a-col>
        </a-row>
      </div>
    </preview>
  </div>
</template>
<style lang="less" scoped>
    .btn-box{
        display: flex;
        display: -webkit-flex;
        flex-flow:row nowrap;
    }
    .formImg{
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    .aColHeightNo{
        height:22px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import Preview from '@comp/Modal/preview'
import moment from 'moment'
import map from 'lodash.map'
import { axios } from '@/utils/request'
export default {
    name: 'CustomerServiceOrder',
    components: { NewTable, SeachBox, Preview },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            // 搜索工具
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '申请开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '申请结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'trouble_record_status'
                    }
                },
                {
                    key: 'customerName',
                    type: 'input',
                    title: '顾客名称/电话'
                }
            ],
            btns: ['export', 'print'],
            seachValue: {
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            // 表格赋值
            tableCode: '',
            tableApiPath: '',
            // 右键菜单
            disContextMenu: [],
            menuOPT: [
                {
                    name: '确认',
                    action: 'CustomerServiceOrder.add',
                    fc: this.confirmHandler
                },
                {
                    name: '预览',
                    action: 'CustomerServiceOrder.get',
                    fc: this.detailHandler
                }
            ],
            tableIdsArr: [],
            tableRowsArr: [],
            // 确认弹框
            confrimModal: false,
            confrimValue: '1',
            form: this.$form.createForm(this),
            submitLoading: false,
            confrimID: [],

            // 预览
            previewVisbel: false,
            // 基础信息
            previewHeaders: [
                { key: 'code', name: '单据号' },
                { key: 'statusName', name: '状态' },
                { key: 'troubleTypeName', name: '服务类型' }
            ],
            previewContent: {},
            previewImage: [], // 问题图片
            // 落款
            previewDetailData: {}
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '2a3406288ea74936b2483d419eb162c9:CustomerServiceOrder'
            this.tableApiPath = 'TroubleRecordQueryList'
            this.$refs.newTable.setContextmenu(this.menuOPT)
        })
    },
    methods: {
        onSeach (e) {
            e.path = 'TroubleRecordQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onReload () {
            this.seachValue = {}
        },
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('TroubleRecordQueryList')
            }
        },
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        onContextmenuChange (tableRow) {
            this.tableSingData = { ...tableRow }
            if (tableRow.status === 'trouble_record_status:1') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['确认']
            }
        },
        confirmHandler (confrimData) {
            const arr = []
            if (confrimData === -1) {
                if (this.tableRowsArr.length === 0) {
                    this.$message.warning('请选择要进行此操作的列表')
                    return
                }
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'trouble_record_status:1')
                if (isAuit.length > 0) {
                    this.$message.warning('只有是申请中的状态的才能进行此操作')
                    return
                }
                this.tableIdsArr.forEach(item => {
                    const obj = { 'id': item }
                    arr.push(obj)
                })
            } else {
                arr.push({ 'id': confrimData.id })
            }
            this.confrimID = arr
            this.confrimModal = true
        },
        onChange (e) {
            // console.log(e)
        },
        submit (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    const obj = {
                        id: this.tableSingData.id,
                        status: values.status,
                        confirmNote: values.confirmNote
                    }
                    this.submitLoading = true
                    axios({
                        path: 'TroubleRecordAuditRecord', // 接口path名，必传
                        method: 'post',
                        body: obj
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.confrimModal = false
                            this.$refs.newTable.setTableData(this.tableCode, { path: 'TroubleRecordQueryList' })
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 预览
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.previewVisbel = true
            this.previewContent.headers = {
                code: detailData.code,
                statusName: detailData.statusName,
                troubleTypeName: detailData.troubleTypeName
            }
            this.previewDetailData = {
                note: detailData.confirmNote,
                confirmBy: detailData.confirmBy ? `${detailData.confirmBy}-${detailData.confirmByName}` : '',
                confirmTime: detailData.confirmTime,
                customerTelephone: detailData.customerTelephone,
                customerName: detailData.customerName,
                customerAddress: detailData.customerAddress,
                troubleTitle: detailData.troubleTitle,
                troubleDescribe: detailData.troubleDescribe
            }
            this.previewImage = detailData.troublePicture ? detailData.troublePicture.split(',') : []
            //      TroubleRecordRecordDetail
        }
    },
    watch: {
        'seachValue.startTime' (val) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime -= moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val) {
            if (moment(val).isBefore(this.seachValue.startTime)) {
                this.seachValue.startTime = moment(val).subtract(7, 'days').format('YYYY-MM-DD')
            }
        }
    }
}
</script>

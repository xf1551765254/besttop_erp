<!--
 * @Description: 服务登记单
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-05-22 16:17:27
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 16:10:00
 -->
<template>
  <div>
    <!-- 搜索工具 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach" />
    <!-- 主表 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :slots="slots"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect" >
      <template slot="troubleTitle" slot-scope="{text, record}">
        <div class="setTableA" >
          <a harf="javascript:;" @click="TableProblemModal(record)"><span>{{ text }}</span></a>
        </div>
      </template>
    </NewTable>
    <!-- 单据 -->
    <bt-modal
      v-model="addEditModal"
      :title="addEditTitle"
      :submitClick="submitInfo"
      :popconfirm="false"
      :submitLoading="submitLoading"
      :orderId="tableSingleData.code"
      :tags="tags" >
      <div>
        <a-tabs defaultActiveKey="第三方售后服务登记" type="card" @change="tabCallback" v-model="tabsActiveKey">
          <a-tab-pane tab="第三方售后服务登记" key="第三方售后服务登记" :disabled="!isAdd&&tabsActiveKey!=='第三方售后服务登记'">
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">顾客信息
              <a-button size="small" type="primary" style="margin-left:5px" @click="addFustomerFn">添加客户</a-button>
            </a-row>
            <a-form :form="formOne">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3">顾客手机号</a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerTelephone',{initialValue:tableSingleData.customerTelephone})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">顾客姓名</a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerName',{initialValue:tableSingleData.customerName})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">顾客地址</a-col>
                <a-col :sm="16" :md="20" :xl="21">
                  <a-form-item>
                    <a-input
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerAddress',{initialValue:tableSingleData.customerAddress})">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">问题记录</a-row>
            <a-form :form="formOne">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3">单据类型</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width:100%"
                      placeholder="请选择单据来源"
                      :options="typeArr"
                      :filterOption="filterOption"
                      v-decorator="$check('ServiceRegistrateForm.type',{initialValue:tableSingleData.type||'trouble_record_trouble_type:1'})"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">预约时间</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      placeholder="请选择预约时间"
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm"
                      :disabledDate="disabledDateOrder"
                      :showTime="{ format: 'HH:mm' }"
                      v-decorator="$check('ServiceRegistrateForm.orderInstallTime', {initialValue:tableSingleData.orderInstallTime||setOrderInstallTime})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">问题标题</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      placeholder="请输入问题标题"
                      v-decorator="$check('ServiceRegistrateForm.troubleTitle',{initialValue:tableSingleData.troubleTitle})">
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">品类</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-tree-select
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      :treeData="categoryArr"
                      treeDefaultExpandAll
                      dropdownMatchSelectWidth
                      treeNodeFilterProp="title"
                      v-decorator="$check('ServiceRegistrateForm.classCode',{initialValue:tableSingleData.classCode})"
                      showSearch
                      allowClear>
                    </a-tree-select>

                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">品牌</a-col>
                <a-col ::sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      showSearch
                      placeholder="请选择品牌"
                      :filterOption="false"
                      @search="handlebrandDorpArr"
                      style="width: 100%"
                      :options="brandArr"
                      v-decorator="$check('ServiceRegistrateForm.brandCode',{initialValue:tableSingleData.brandCode})"
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">商品名称</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      placeholder="请输入商品名称"
                      v-decorator="$check('ServiceRegistrateForm.skuName',{initialValue:tableSingleData.skuName})">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :sm="8" :md="4" :xl="3" class="">
                  问题描述
                </a-col>
                <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
                  <a-form-item class="">
                    <a-textarea
                      placeholder="请输入问题描述"
                      :rows="2"
                      v-decorator="$check('ServiceRegistrateForm.troubleApplyNote', {initialValue:tableSingleData.troubleApplyNote||''})"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">落款信息 </a-row>
            <a-form :form="formOne">
              <a-row class="setDocCss">
                <a-col :sm="8" :md="4" :xl="3">
                  制单人
                </a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      disabled
                      showSearch
                      style="width: 100%"
                      :options="createByDorpArr"
                      v-decorator="$check('ServiceRegistrateForm.createBy',{initialValue:tableSingleData.createBy||`${this.$store.getters.code}`})"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">
                  制单时间
                </a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      disabled
                      placeholder=""
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      v-decorator="$check('ServiceRegistrateForm.createTime', {initialValue:tableSingleData.createTime || setStartTime})"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-tab-pane>
          <a-tab-pane tab="系统售后服务登记" key="系统售后服务登记" :disabled="!isAdd&&tabsActiveKey!=='系统售后服务登记'">
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">单据信息
              <a-button size="small" type="primary" style="margin-left:5px" @click="chaceSalesListFn">选择销售单</a-button>
            </a-row>
            <a-form :form="formTow">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3">单据类型</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width:100%"
                      placeholder="请选择单据来源"
                      :options="typeArr"
                      :filterOption="filterOption"
                      v-decorator="$check('ServiceRegistrateForm.type',{initialValue:tableSingleData.type||'trouble_record_trouble_type:1'})"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">源单据号</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      v-decorator="$check('ServiceRegistrateForm.sourceCode',{initialValue:tableSingleData.sourceCode})"
                      disabled >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">销售位置</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width:100%"
                      :options="saleStoreCodeArr"
                      disabled
                      :filterOption="filterOption"
                      placeholder=""
                      v-decorator="$check('ServiceRegistrateForm.saleStoreCode',{initialValue:tableSingleData.saleStoreCode})"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">预约时间</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      placeholder="请选择预约时间"
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm"
                      :disabledDate="disabledDateOrder"
                      :showTime="{ format: 'HH:mm' }"
                      v-decorator="$check('ServiceRegistrateForm.orderInstallTime', {initialValue:tableSingleData.orderInstallTime||setOrderInstallTime})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">问题标题</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      placeholder="请输入问题标题"
                      v-decorator="$check('ServiceRegistrateForm.troubleTitle',{initialValue:tableSingleData.troubleTitle})">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :sm="8" :md="4" :xl="3" class="">
                  问题描述
                </a-col>
                <a-col :sm="16" :md="20" :xl="21" style="height:auto;margin-bottom:-7px">
                  <a-form-item class="">
                    <a-textarea
                      placeholder="请输入问题描述"
                      :rows="2"
                      v-decorator="$check('ServiceRegistrateForm.troubleApplyNote', {initialValue:tableSingleData.troubleApplyNote||''})"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">顾客信息 </a-row>
            <a-form :form="formTow">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3">顾客手机号</a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerTelephone',{initialValue:tableSingleData.customerTelephone})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">顾客姓名</a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerName',{initialValue:tableSingleData.customerName})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">顾客地址</a-col>
                <a-col :sm="16" :md="20" :xl="21">
                  <a-form-item>
                    <a-input
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.customerAddress',{initialValue:tableSingleData.customerAddress})">
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <a-row style="color:#38adff;font-size:15px;margin:10px 0">商品信息
            </a-row>
            <a-form :form="formTow">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3">品类</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-tree-select
                      style="width: 100%"
                      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
                      :treeData="categoryArr"
                      treeDefaultExpandAll
                      dropdownMatchSelectWidth
                      disabled
                      treeNodeFilterProp="title"
                      v-decorator="$check('ServiceRegistrateForm.classCode',{initialValue:tableSingleData.classCode})"
                      showSearch
                      allowClear>
                    </a-tree-select>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">品牌</a-col>
                <a-col ::sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <!-- <a-select
                      showSearch
                      style="width: 100%"
                      :options="brandArr"
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.brandCode',{initialValue:tableSingleData.brandCode})"
                      allowClear/> -->
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      :value="`${brandCodeName.brandCode}-${brandCodeName.brandName}`">
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">SKU编码</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      disabled
                      placeholder=""
                      v-decorator="$check('ServiceRegistrateForm.skuCode',{initialValue:tableSingleData.skuCode})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">SKU名称</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      placeholder=""
                      disabled
                      v-decorator="$check('ServiceRegistrateForm.skuName',{initialValue:tableSingleData.skuName})"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">规格型号</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      style="width:100%"
                      disabled
                      placeholder=""
                      v-decorator="$check('ServiceRegistrateForm.skuModel',{initialValue:tableSingleData.skuModel})"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">数量</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input-number
                      placeholder=""
                      style="width:100%;"
                      :min="1"
                      :max="Number.MAX_SAFE_INTEGER"
                      :step="1"
                      disabled
                      :precision="0"
                      v-decorator="$check('ServiceRegistrateForm.skuQuantity', {initialValue:tableSingleData.skuQuantity})"/>
                  </a-form-item>
                </a-col>

              </a-row>
            </a-form>
            <a-row style="color:#38adff;font-size:15px;margin-bottom:10px">落款信息 </a-row>
            <a-form :form="formTow">
              <a-row class="setDocCss">
                <a-col :sm="8" :md="4" :xl="3">
                  制单人
                </a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      disabled
                      showSearch
                      style="width: 100%"
                      :options="createByDorpArr"
                      v-decorator="$check('ServiceRegistrateForm.createBy',{initialValue:tableSingleData.createBy||`${this.$store.getters.code}`})"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">
                  制单时间
                </a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      disabled
                      placeholder=""
                      style="width: 100%"
                      format="YYYY-MM-DD HH:mm:ss"
                      v-decorator="$check('ServiceRegistrateForm.createTime', {initialValue:tableSingleData.createTime || setStartTime})"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </bt-modal>

    <!-- 销售单弹框 -->
    <salesList :visible.sync="salesListQuery" @onSelect="onSelectAddSales"/>

    <!-- 添加顾客 -->
    <addCustomer :visible.sync="add" @onClose="getCustomerData"></addCustomer>
    <!-- 问题描述 -->
    <a-modal
      v-model="problemDescriptionVisible"
      :footer="null"
      title="服务描述"
      @cancel="problemDescriptionVisible=false"
      :bodyStyle="{padding:'40px', maxWidth:'960px'}"
      destroyOnClose
      centered>
      <a-row>服务标题：{{ problemDescription.troubleTitle }}</a-row>
      <a-row>服务描述：{{ problemDescription.troubleDescribe }}</a-row>
      <a-row style="margin-top:10px">
        <a-col :sm="24" :md="12" :xl="8" v-for="(item, index) in problemDescription.troublePicture" :key="`IMG-${index}`">
          <img alt="example" style="width: 100%" :src="item"/>
        </a-col>
      </a-row>
    </a-modal>

    <!-- 单据预览 -->
    <preview v-model="previewVisbel" :tabsActiveKeyPre="tabsActiveKeyPre" :orderId="orderId"></preview>
  </div>
</template>
<style lang="less" scoped>
    .setTableA a{
        display: block;
        width: 100%;
        height:100%;
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
    .isNone{
      display: none;
    }
</style>
<style lang="less">
@import "../../../assets/modalStyle.less";
    .setDocCss .ant-select-disabled svg{
        display: none;
    }
    .img-box{
        max-height: 18px;
        width: auto;
        max-width:100%;
    }
    .AfterTimeNone .ant-calendar-date-panel .ant-calendar-time-picker-combobox{
       .ant-calendar-time-picker-select:last-child {
         display: none
       }
      .ant-calendar-time-picker-select{
          width:50%
      }
      .ant-calendar-time-picker-select:nth-child(2) {
        border-right:0
       }
    }
    .setTableNowarp {
      // .ant-table td {
      //   white-space: nowrap;
      // }
      .ant-table{
        overflow: hidden;
      }
    }
</style>

<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import BtModal from '@comp/Modal'
import Preview from './preview/ServiceRegistrationFormPreview'
import addCustomer from './component/addCustomer'
import salesList from './component/salesList'
import moment from 'moment'
import { axios } from '@/utils/request'
import map from 'lodash.map'
export default {
    name: 'ServiceRegistrationForm',
    components: { NewTable, SeachBox, BtModal, Preview, salesList, addCustomer },
    data () {
        return {
            defaultImgUrl: 'this.src="' + require('@assets/goods.png') + '"',
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '单据号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '制单开始时间',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '制单结束时间',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'status',
                    type: 'select',
                    title: '单据状态',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'trouble_apply_status'
                    }

                },
                {
                    key: 'source',
                    type: 'select',
                    title: '单据来源',
                    label: 'value',
                    value: ['type', 'configKey'],
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'trouble_apply_source'
                    }
                }
            ],
            btns: ['add', 'del', 'export', 'print'],
            seachValue: {
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD')
            },
            // 主表
            tableCode: '',
            tableApiPath: '',
            slots: ['troubleTitle'],
            // 单行选中的值
            tableSingleData: {},
            // 表格选中的值
            tableIdsArr: [],
            tableRowsArr: [],
            // 右键菜单
            disContextMenu: [],
            menuOPT: [
                {
                    name: '编辑',
                    action: 'ServiceRegistrationForm.edit',
                    fc: this.addEdit
                },
                {
                    name: '审核',
                    action: 'ServiceRegistrationForm.verify',
                    fc: this.auditHandler
                },
                {
                    name: '删除',
                    action: 'ServiceRegistrationForm.delete',
                    fc: this.deletelHandler
                },
                {
                    name: '预览',
                    action: 'ServiceRegistrationForm.get',
                    fc: this.detailHandler
                }
            ],
            // 单据
            addEditModal: false,
            addEditTitle: '',
            submitLoading: false,
            isAdd: false,
            tabsActiveKey: '第三方售后服务登记', // 标签页切换
            tags: ['uncheck'],
            // form
            formTow: this.$form.createForm(this),
            formOne: this.$form.createForm(this),
            // 系统售后服务登记品牌
            brandCodeName: {
                brandCode: '',
                brandName: ''
            },

            // 服务问题描述
            problemDescription: {
                troubleTitle: '',
                troubleDescribe: '',
                troublePicture: []
            },
            // 问题描述
            problemDescriptionVisible: false,

            // 选择销售单
            salesListQuery: false,
            saleTime: '', // 销售时间

            // 添加顾客信息
            lat: '',
            lng: '',
            province: '',
            city: '',
            area: '',
            disableEdit: false,

            // 添加顾客
            add: false,
            customerData: {},

            // 预览
            previewVisbel: false,
            orderId: '',
            tabsActiveKeyPre: '第三方售后服务登记',

            // 下拉框
            sourceArr: [],
            saleStoreCodeArr: [],
            createByDorpArr: [],
            typeArr: [],
            customerTelephoneAll: [],
            categoryArr: [], // 品类
            brandArr: [] // 品牌
        }
    },
    computed: {
        setStartTime () {
            return moment()
        },
        setOrderInstallTime () {
            return moment().add(1, 'days')
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '9c89220d29fc4123a839fe5849673907:ServiceRegistrationForm'
            this.tableApiPath = 'TroubleApplyQueryList'
            this.$refs.newTable.setContextmenu(this.menuOPT)
        })
        this.getCreateByDorpArr()
        this.getSaleStoreCodeDorpArr()
        this.getSourceDorpArr()
        this.getTypeDorpArr()
        this.getObjCategory()
        this.getObjBrandArr()
    },
    methods: {
        onSeach (e) {
            e.path = 'TroubleApplyQueryList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        onReload () {
            this.seachValue = {}
        },
        onSeachClick (e) {
            if (e === 'add') {
                this.addEdit(-1)
            } else if (e === 'del') {
                if (this.tableIdsArr.length === 0) {
                    this.$message.warning('请选择要删除的列表')
                } else {
                    this.deletelHandler(-1)
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('TroubleApplyQueryList')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'TroubleApplyQueryList' })
        },
        onSelect (keyIndex, keyRow) {
            this.tableIdsArr = map(keyRow, 'id')
            this.tableRowsArr = keyRow
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = { ...tableRow }
            if (tableRow.status === 'trouble_apply_status:2') {
                this.disContextMenu = []
            } else {
                this.disContextMenu = ['编辑', '审核', '删除']
            }
        },
        deletelHandler (delData) {
            let arr = []
            const _this = this
            if (delData === -1) {
                const newData = [...this.tableRowsArr]
                const isAuit = newData.filter(o => o.status !== 'trouble_apply_status:2')
                if (isAuit.length > 0) {
                    this.$message.warning('只有未审核的才能进行此操作')
                    return
                }
                arr = this.tableIdsArr
            } else {
                arr.push(delData.id)
            }
            this.$confirm({
                title: '删除提示',
                content: '确定选中项全部删除？删除后将不可更改',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'TroubleApplyDeleteApply', // 接口path名，必传
                        method: 'post',
                        body: {
                            ids: arr
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.$refs.newTable.del(arr, 'id')
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        auditHandler (auditData) {
            const _this = this
            this.$confirm({
                title: '提示',
                content: '此操作将进行审核，审核后将不可进行修改, 是否继续?',
                okText: '确定',
                cancelText: '取消',
                onOk () {
                    axios({
                        path: 'TroubleApplyAuditApply', // 接口path名，必传
                        method: 'post',
                        body: {
                            id: auditData.id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            _this.reLoadTableData()
                        }
                    })
                },
                onCancel () {
                    _this.$message.info('已取消')
                }
            })
        },
        /**
         * @name: 问题描述
         * @msg:
         * @param {type}
         * @return:
         */
        TableProblemModal (row) {
            this.problemDescriptionVisible = true
            this.problemDescription.troubleTitle = row.troubleTitle
            this.problemDescription.troubleDescribe = row.troubleApplyNote
            if (row.troublePicture) {
                this.problemDescription.troublePicture = row.troublePicture.split(',')
            }
        },
        /**
         * @name:新增编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit (addEditData) {
            if (addEditData === -1) {
                this.addEditTitle = '新增售后预约单'
                this.isAdd = true
                this.tableSingleData = {}
                this.tabsActiveKey = '第三方售后服务登记'
                this.brandCodeName.brandCode = ''
                this.brandCodeName.brandName = ''
            } else {
                this.addEditTitle = '编辑售后预约单'
                this.isAdd = false
                this.saleTime = addEditData.saleTime
                const obj = { ...addEditData }
                obj.createTime = moment(obj.createTime)
                obj.orderInstallTime = moment(obj.orderInstallTime)
                this.tableSingleData = obj
                this.tabsActiveKey = obj.applyType
                if (this.tabsActiveKey === '系统售后服务登记') {
                    this.brandCodeName.brandCode = obj.brandCode
                    this.brandCodeName.brandName = obj.brandName
                }
            }
            this.addEditModal = true
        },
        submitInfo (e) {
            e.preventDefault()
            let validateFields = ''
            if (this.tabsActiveKey === '第三方售后服务登记') {
                validateFields = this.formOne.validateFields
            } else {
                validateFields = this.formTow.validateFields
            }
            validateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.tableSingleData.id
                        values.makeStoreCode = this.tableSingleData.makeStoreCode
                    } else {
                        values.makeStoreCode = this.$store.getters.storeInfo.code
                    }
                    if (this.tabsActiveKey === '第三方售后服务登记' && !values.customerTelephone) {
                        this.$notification['error']({
                            message: '错误',
                            description: '请点击添加客户按钮，选择或输入手机号'
                        })
                        return
                    }
                    if (this.tabsActiveKey === '系统售后服务登记' && !values.sourceCode) {
                        this.$notification['error']({
                            message: '错误',
                            description: '请点击选择销售单按钮，选择要进行服务的商品信息'
                        })
                        return
                    }
                    if (this.tabsActiveKey === '系统售后服务登记') {
                        values.brandCode = this.brandCodeName.brandCode
                    }
                    values.longitude = this.customerData.longitude
                    values.latitude = this.customerData.latitude
                    values.applyType = this.tabsActiveKey
                    values.saleTime = this.saleTime
                    values.createTime = values.createTime.format('YYYY-MM-DD HH:mm:ss')
                    values.orderInstallTime = moment(values.orderInstallTime).format('YYYY-MM-DD HH:mm')
                    this.submitLoading = true
                    axios({
                        path: this.isAdd ? 'TroubleApplyAddApply' : 'TroubleApplyUpdateApply',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 标签切换
         * @msg:
         * @param {type}
         * @return:
         */
        tabCallback (key) {
            this.tabsActiveKey = key
        },
        /**
         * @name: 销售弹框打开
         */
        chaceSalesListFn () {
            this.salesListQuery = true
            this.CustomeData = {}
        },
        /**
         * @name: 选择销售单
         */
        onSelectAddSales (arr) {
            const obj = arr[0]
            this.formTow.setFieldsValue({
                type: 'trouble_record_trouble_type:1',
                sourceCode: obj.orderId,
                saleStoreCode: obj.storeCode,
                customerTelephone: obj.telephone,
                customerName: obj.customerName,
                customerAddress: obj.address,
                skuCode: obj.skuCode,
                skuModel: obj.skuModel,
                skuName: obj.skuName,
                skuQuantity: obj.quantity,
                classCode: obj.classCode,
                brandCode: obj.brandCode
            })
            this.brandCodeName.brandCode = obj.brandCode
            this.brandCodeName.brandName = obj.brandName
            this.saleTime = obj.createTime
            this.CustomeData.longitude = obj.consigneeLongitude
            this.CustomeData.latitude = obj.consigneeLatitude
        },
        /**
         * @name: 预约时间的禁用
         * @msg:
         * @param {type}
         * @return:
         */
        disabledDateOrder (curent) {
            return moment(curent).isBefore(moment().startOf('day'))
        },
        /**
         * @name: 顾客信息弹框打开
         */
        addFustomerFn () {
            this.add = true
            this.CustomeData = {}
        },
        /**
         * @name: 添加顾客
        */        
        getCustomerData (data) {
            console.log(data)
            this.customerData.longitude = data.lng
            this.customerData.latitude = data.lat
            this.formOne.setFieldsValue({
                customerTelephone: data.telephone,
                customerName: data.name,
                customerAddress: data.address + data.addressDetail
            })
        },
        /**
         * @name: 审核人
         */
        getCreateByDorpArr () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post',
                body: {
                    name: this.$store.getters.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.createByDorpArr = dataArr
                }
            })
        },
        /**
         * @name: 制单位置
         */
        getSaleStoreCodeDorpArr () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post',
                body: {
                    name: this.$store.getters.storeInfo.code
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.saleStoreCodeArr = dataArr
                }
            })
        },
        /**
         * @name: 下拉框过滤修改
         */
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 单据类型
         * @msg:
         * @param {type}
         * @return:
         */
        getSourceDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'trouble_apply_source'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.sourceArr = dataArr
                }
            })
        },
        /**
         * @name:  单据来源
         * @msg:
         * @param {type}
         * @return:
         */
        getTypeDorpArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'trouble_record_trouble_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                        i.key = `${i.type}:${i.configKey}`
                    })
                    this.typeArr = dataArr
                }
            })
        },
        /**
         * @name: 获取顾客信息所有的数据
         */
        getCustomer () {
            axios({
                path: 'TroubleApplyFindCustomer',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    this.customerTelephoneAll = dataArr
                }
            })
        },
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        getObjCategory () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: { },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    this.categoryArr = this.initTree(data)
                }
            })
        },
        initTree (data) {
            const arr = []
            data.forEach(d => {
                d.key = d.code
                d.title = `${d.code}-${d.name}`
                d.value = d.code
                if ('children' in d) {
                    d.children = this.initTree(d.children)
                } else {
                    d.isLeaf = true
                }
                arr.push(d)
            })
            return arr
        },
        /**
         * @name: 品牌查询
         */
        handlebrandDorpArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.brandArr.length = 0
                this.getObjBrandArr(value)
            }, 300)
        },
        /**
         * @name: 获取品牌
         * @msg:
         * @param {type}
         * @return:
         */
        getObjBrandArr (value) {
            axios({
                path: 'GoodsBrandFindCondition',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    condition: value
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    // console.log('获取品牌', res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.brandArr = [...data]
                }
            })
        },
        /**
         * @name:  预览
         * @msg:
         * @param {type}
         * @return:
         */
        detailHandler (detailData) {
            this.tabsActiveKeyPre = detailData.applyType
            this.orderId = detailData.code
            this.previewVisbel = true
        }

    },
    watch: {
        '$store.state.app.pageName' (to) {
            if (to === 'ServiceRegistrationForm') {
                this.getCreateByDorpArr()
                this.getSaleStoreCodeDorpArr()
                this.getSourceDorpArr()
                this.getTypeDorpArr()
                this.getObjCategory()
                this.getObjBrandArr()
            }
        },
        'seachValue.startTime' (val) {
            if (val && this.seachValue.endTime) {
                if (moment(val).isAfter(this.seachValue.endTime)) {
                    this.seachValue.endTime = moment(val).add(7, 'days').format('YYYY-MM-DD')
                }
            }
        },
        'seachValue.endTime' (val) {
            if (moment(val).isBefore(this.seachValue.startTime)) {
                this.seachValue.startTime = moment(val).subtract({ days: 7 }).format('YYYY-MM-DD')
            }
        }
    }
}
</script>

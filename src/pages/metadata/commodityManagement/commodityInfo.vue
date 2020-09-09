<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: lmt
 * @Date: 2019-03-01 19:28:05
 * @LastEditTime: 2019-08-23 14:00:36
 -->
<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onClick="onSeachClick"
      @onReload="onReload"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onContextmenuChange="onContextmenuChange"
      @onSelect="onSelect">
    </NewTable>
    <!-- 新增/编辑模态框 -->
    <bt-modal
      v-model="storefrontAddEditModal"
      :title="storefrontAddEditModalTitle"
      @afterClose="initAddModalStatus"
      :subBtn="false"
    >
      <template slot="footer">
        <a-button type="primary" @click="nextTickt(-1)" style="margin-left:10px;" :disabled="activeKey==1">上一步</a-button>
        <a-button type="primary" @click="nextTickt(1)" style="margin-left:10px;" :disabled="activeKey==2">下一步</a-button>
        <a-button type="primary" :loading="loading" @click="handleSubmit" style="margin-left:10px;">提交</a-button>
      </template>
      <a-tabs v-model="activeKey" @change="changeTab">
        <a-tab-pane tab="商品信息" :key="1">
          <a-form :form="form">
            <div class="title-info">基本信息</div>
            <a-row>
              <a-col :sm="8" :md="4" :xl="3" v-if="!isAdd">商品编码</a-col>
              <a-col :sm="16" :md="8" :xl="5" v-if="!isAdd">
                <a-form-item>
                  <a-input v-decorator="$check('goods.code', {initialValue:selectedSingleRow.code || ''})" disabled/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">商品名称</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入商品名称" @blur="e=>onBlur(e)" v-decorator="$check('goods.name', {initialValue:selectedSingleRow.name || ''})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">商品简称</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入商品简称" v-decorator="$check('goods.shortName', {initialValue:selectedSingleRow.shortName || ''})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">商品品类</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input ref="categoryInput" placeholder="请选择商品品类" @click="categoryinfoAdd" v-decorator="$check('goods.classId', {initialValue:selectedSingleRow.classCodeName || ''})" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">品牌编码</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input ref="brandInput" placeholder="请选择品牌编码" @click="brandinfoAdd" v-decorator="$check('goods.brandId', {initialValue:selectedSingleRow.brandCodeName || ''})" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">货号</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入厂家号" v-decorator="$check('goods.goodNo', {initialValue:selectedSingleRow.goodNo || '0'})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">包装含量</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="1" :max="99999999" v-decorator="$check('goods.content', {initialValue:selectedSingleRow.content || 1})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">规格型号</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入规格型号" v-decorator="$check('goods.model', {initialValue:selectedSingleRow.model || ''})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">单位</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入单位" v-decorator="$check('goods.basicUnit', {initialValue:selectedSingleRow.basicUnit || '台'})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">进货单位</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入进货单位" v-decorator="$check('goods.inUnit', {initialValue:selectedSingleRow.inUnit || '件'})"/>
                </a-form-item>
              </a-col>
            </a-row>
            <div class="title-info">其他信息</div>
            <a-row>
              <a-col :sm="8" :md="4" :xl="3">管理标志</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('goods.flag', {initialValue:selectedSingleRow.flag})" :options="flag" @change="flagChange" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">串号长度</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入串号长度" v-decorator="$check('goods.barcodeLen', {initialValue:selectedSingleRow.barcodeLen || 0},checkBarcodeLen)" :disabled="barcodeLenDisabled||selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">商品状态</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('goods.status', {initialValue:selectedSingleRow.status})" :options="statusArr" disabled/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">产地</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入产地" v-decorator="$check('goods.produce', {initialValue:selectedSingleRow.produce || ''})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">季节</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('goods.quarter', {initialValue:selectedSingleRow.quarter})" :options="quarter"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">标签类型</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('goods.labelType', {initialValue:selectedSingleRow.labelType})" :options="labelType"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">销项税率</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="$check('goods.taxRateSale', {initialValue:selectedSingleRow.taxRateSale||$store.getters.taxRateSale[0].value})"
                    :options="$store.getters.taxRateSale"
                    :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">税率</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="$check('goods.taxRate', {initialValue:selectedSingleRow.taxRate||$store.getters.taxRate[0].value})"
                    :options="$store.getters.taxRate"
                    :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">商品类型</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select :getPopupContainer="triggerNode => triggerNode.parentNode" v-decorator="$check('goods.type', {initialValue:selectedSingleRow.type})" :options="type" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">保存期(天)</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width:100%;" :min="0" :max="99999999" placeholder="请输入保存期(天)" v-decorator="$check('goods.odDay', {initialValue:selectedSingleRow.odDay || 0})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">售后周期(年)</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="0" :max="99999999" placeholder="请输入售后周期" v-decorator="$check('goods.afterSaleCycle', {initialValue:selectedSingleRow.afterSaleCycle})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">是否安装</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-radio-group v-decorator="$check('goods.isInstall', {initialValue:selectedSingleRow.isInstall || 0})">
                    <a-radio :value="1">
                      是
                    </a-radio>
                    <a-radio :value="0">
                      否
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">订货周期</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="0" :max="99999999" placeholder="请输入订货周期" v-decorator="$check('goods.orderingCycle', {initialValue:selectedSingleRow.orderingCycle || 0})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">安全天数</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="0" :max="99999999" placeholder="请输入安全天数" v-decorator="$check('goods.safeDays', {initialValue:selectedSingleRow.safeDays || 0})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">满货位量</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="0" :max="99999999" placeholder="请输入满货位量" v-decorator="$check('goods.fullVolume', {initialValue:selectedSingleRow.fullVolume || 0})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">引入日期</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input placeholder="请输入" v-decorator="$check('goods.introduceDate', {initialValue:selectedSingleRow.introduceDate || introduceDate})" :disabled="selectedSingleRow.status&&selectedSingleRow.status!=='base_goods_status:1'"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">预计日销量</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-input-number style="width: 100%" :min="0" :max="99999999" placeholder="请输入预计日销量" v-decorator="$check('goods.dailySalesVolume', {initialValue:selectedSingleRow.dailySalesVolume || 0})"/>
                </a-form-item>
              </a-col>
              <a-col :sm="8" :md="4" :xl="3">重要性</a-col>
              <a-col :sm="16" :md="8" :xl="5">
                <a-form-item>
                  <a-select
                    :getPopupContainer="triggerNode => triggerNode.parentNode"
                    v-decorator="$check('goods.abc', {initialValue:selectedSingleRow.abc})"
                    :options="abcArr"/>
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <a-form-item>
                  <a-textarea placeholder="请输入备注" :autosize="{minRows: 2, maxRows: 6}" v-decorator="$check('goods.note', {initialValue:selectedSingleRow.note || ''})" />
                </a-form-item>
              </a-col>
              <a-col :span="24">
                <upload :fileList="fileList" :fileLength="fileLength" @uploadFileList="uploadFileList"></upload>
              </a-col>
            </a-row>
          </a-form>
          <category :visible.sync="categoryQuery" @onSelect="onCategorySelect"/>
          <brand :visible.sync="brandQuery" @onSelect="onBrandIdSelect"/>
        </a-tab-pane>
        <a-tab-pane tab="商品SKU" :key="2">
          <a-row>
            <a-button @click="skuAdd" size="small" type="primary" :disabled="skuAddDisabled">新增</a-button>
          </a-row>
          <a-row v-for="(row, index) in skuRows" :key="index" style="display:flex;align-items: center; margin-top:10px;">
            <a-col :span="22" style="border: 1px solid #d9d9d9;padding: 10px 10px 0;">
              <a-row>
                <a-col :sm="8" :md="4" :xl="3" v-if="row.code">SKU编码</a-col>
                <a-col :sm="16" :md="20" :xl="5" v-if="row.code">
                  <a-input v-model="row.code" disabled/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">SKU名称</a-col>
                <a-col :sm="16" :md="20" :xl="13">
                  <a-input placeholder="请输入SKU名称" v-model="row.name"/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">状态</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-select v-model="row.status" style="width: 100%" :options="skuStatusArr" disabled/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">成本价</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-input-number style="width: 100%" :min="0" placeholder="请输入成本价" v-model="row.ptCost" :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">零售价</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-input-number
                    style="width: 100%"
                    @blur="e=>onPriceBlur(e, row)"
                    :min="0"
                    placeholder="请输入零售价"
                    v-model="row.price"
                    :disabled="row.status&&row.status!=='base_sku_status:1'" />
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">分销价</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-input-number
                    style="width: 100%"
                    placeholder="请输入分销价"
                    :min="0"
                    v-model="row.priceW"
                    :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">限价</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input-number
                      style="width: 100%"
                      placeholder="请输入限价"
                      :min="0"
                      v-model="row.priceMin"
                      :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">扣率</a-col>
                <a-col :sm="16" :md="8" :xl="row.code?5:13">
                  <a-input-number
                    :min="0"
                    :max="1"
                    :precision="4"
                    :step="1"
                    style="width: 100%"
                    @focus="$event.currentTarget.select()"
                    placeholder="请输入扣率"
                    v-model="row.rate"
                    :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3" >品类属性</a-col>
                <a-col :sm="16" :md="20" :xl="21" style="min-height:50px;border: 1px solid #d9d9d9;border-radius: 4px;display:table;">
                  <div class="check-box-g" style="margin-left: 10px;" v-for="(item, i) in onSkuPropertyList" :key="i">
                    <a-checkbox-group v-model="row.checkInSelete">
                      <a-checkbox :value="item.name" @change="seleteChange($event,row)" :disabled="row.status&&row.status!=='base_sku_status:1'">{{ item.name }}</a-checkbox>
                      <a-radio-group
                        :disabled="row.status&&row.status!=='base_sku_status:1'"
                        :options="item.value.split(',')"
                        @change="onPropertyChange(row,item)"
                        v-model="row.checkLastSelete[item.name]"/>
                      <!-- v-if="row.checkInSelete&&row.checkInSelete.indexOf(item.name)>-1" -->
                    </a-checkbox-group>
                  </div>
                </a-col>
              </a-row>
              <a-row v-if="isLinkOldErp" style="border-top: 1px dashed #d9d9d9;padding-top: 10px;">
                <a-col :sm="8" :md="4" :xl="3">部门</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      showSearch
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      v-model="row.noteA.c_adno"
                      :options="oldErpStoreArr"
                      :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      showSearch
                      notFoundContent="请输入关键字进行检索"
                      :filterOption="false"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      v-model="row.noteA.c_provider"
                      @search="getOldErpProvider"
                      :disabled="row.status&&row.status!=='base_sku_status:1'">
                      <a-select-option v-for="d in oldErpProviderArr" :key="d.value">{{ d.title }}</a-select-option>
                    </a-select>
                    <!-- <a-select style="width: 100%" :getPopupContainer="triggerNode => triggerNode.parentNode" v-model="row.noteA.c_provider" :options="oldErpProviderArr" @change="queryOldErpContractType(row)"/> -->
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">经营类型</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :getPopupContainer="triggerNode => triggerNode.parentNode"
                      @focus="queryOldErpContractType(row)"
                      v-model="row.noteA.c_i_type"
                      :options="oldErpContractTypeArr"
                      :disabled="row.status&&row.status!=='base_sku_status:1'"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">提成</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input-number :min="0" style="width: 100%" v-model="row.noteA.c_push_money"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">地市县扣率</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input-number :min="0" :max="1" :precision="4" style="width: 100%" v-model="row.noteA.c_d_rate_reg"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="2" style="text-align:center;">
              <a-button size="small" @click="deleteSku(index)" :disabled="row.status&&row.status!=='base_sku_status:1'">删除</a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </bt-modal>
    <editor-modal v-model="editVisble" :pams="editPams" type="goods" :goods="selectedSingleRow"/>
    <bt-modal
      v-model="previewGoods"
      title="商品预览"
      :subBtn="false">
      <div class="goods" type="flex" justify="center">
        <div class="details">
          <div class="left">
            <div style="width: 400px; height: 400px;border: 1px solid #F5F5F5;" >
              <img style="width: 100%; height: 100%;" :src="bigImg" />
            </div>
            <div class="spec-list">
              <span class="el-icon-arrow-left spec-icon" @click="clickPrev()"></span>
              <div class="spec-items">
                <ul ref="specUl">
                  <li v-for="(i,index) in selectedSingleRow.goodsPic" :key="index">
                    <img :src="i" @click="clickImg(i)"/>
                  </li>
                </ul>
              </div>
              <span class="el-icon-arrow-right spec-icon" @click="clickNext(selectedSingleRow.goodsPic)"></span>
            </div>
          </div>
          <div class="operation">
            <h1>{{ selectedSingleRow.code }}  {{ selectedSingleRow.name }}  {{ selectedSingleRow.model }} </h1>
            <div class="specifications">
              <div v-for="item in skuInfo" :key="item.skuCode" class="sku-item">
                <div class="item-title">
                  <span>{{ item.code }} {{ item.name }}</span>
                </div>
                <div class="item-price">零售价：
                  <span style="color: red;">
                    ¥ {{ item.price }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="introdution ql-editor" v-html="introduction"></div>
      </div>
    </bt-modal>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NewTable from '@comp/newTable'
import seachBox from '@comp/seachBox'
import EditorModal from '@comp/editor/EditorModal'
import { axios } from '@/utils/request'
import moment from 'moment'
import map from 'lodash.map'
import category from './tools/category'
import brand from '@comp/BasicQuery/brand'
import BtModal from '@comp/Modal'
import upload from '../tools/upload'
import { isConnectOldErp } from '@/config/api.config'
export default {
    name: 'CommodityInfo',
    components: {
        NewTable,
        seachBox,
        EditorModal,
        category,
        brand,
        BtModal,
        upload
    },
    data () {
        return {
            isLinkOldErp: isConnectOldErp,
            // 表格数据定义--start
            tableCode: '',
            tableApiPath: '',
            categoryQuery: false,
            brandQuery: false,
            editVisble: false,
            barcodeLenDisabled: true,
            menuOpt: [
                { name: '编辑',
                    action: 'commodityInfo.edit',
                    fc: e => this.editHandler(e)
                }, { name: '详情',
                    action: 'commodityInfo.get',
                    fc: e => this.$refs.newTable.showDetails('商品信息详情', e)
                }, { name: '删除',
                    action: 'commodityInfo.delete',
                    fc: ({ id }) => { this.onDel(id) }
                }, {
                    name: '商品文案',
                    action: 'commodityInfo.edit',
                    fc: e => this.editText(e)
                }, {
                    name: '文案预览',
                    action: 'commodityInfo.edit',
                    fc: e => this.previewText(e)
                }
            ],
            // 表格数据定义--end
            // 工具栏数据定义--start
            btns: ['add', 'del', 'export'],
            seachValue: {},
            conditions: [
                { title: '商品编码/名称', type: 'input', key: 'name' },
                { title: '品类',
                    type: 'treeSelect',
                    key: 'classCodes',
                    filter: true,
                    multiple: true,
                    maxTagCount: 99,
                    selectDataArr: []
                },
                {
                    title: '品牌',
                    type: 'selectBySeach',
                    key: 'brandCodes',
                    path: 'GoodsBrandFindCondition',
                    label: ['code', 'name'],
                    value: 'code',
                    maxTagCount: 99,
                    mode: 'multiple'
                },
                { title: '规格型号', type: 'input', key: 'model' },
                { title: '是否关联SKU',
                    type: 'select',
                    key: 'count',
                    selectDataArr: [{ title: '是', value: 1 }, { title: '否', value: 0 }],
                    label: 'title',
                    value: 'value'
                }
            ],
            // 工具栏数据定义--end
            // 模态框数据定义--start
            storefrontAddEditModalTitle: '',
            storefrontAddEditModal: false,
            // 表单
            form: this.$form.createForm(this),
            flag: [],
            quarter: [],
            labelType: [],
            type: [],
            statusArr: [],
            abcArr: [],
            loading: false,
            isAdd: true,
            // 选中的单行数据
            selectedSingleRow: {},
            editPams: {},
            // 单项/多项删除
            tableSelectRows: [],
            // 引入时间默认值
            introduceDate: moment().format('YYYY-MM-DD'),
            // 选择的商品编码和商品品类
            classId: '',
            brandId: '',
            fileList: [],
            fileLength: ['上传图片', '上传图片', '上传图片', '上传图片', '上传图片'],
            // 表格右键禁用按钮
            disContextMenu: [],
            activeKey: 1,
            // 商品sku信息
            skuRows: [],
            // 商品品类属性信息
            onSkuPropertyList: [],
            ids: [],
            isFirstNext: false,
            skuStatusArr: [],
            isSKUAdd: false,
            skuAddDisabled: false,
            previewGoods: false,
            introduction: '',
            skuInfo: [],
            oldErpStoreArr: [],
            oldErpProviderArr: [],
            oldErpContractTypeArr: [],
            imgLeftNum: 4,
            bigImg: ''
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'b738cbce2d3241f0abf0d2ecbf59fedc:commodityInfo'
            this.tableApiPath = 'GoodsInformationSearch'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getConfig()
        this.getGoodsCategoryFindBySelected()
    },
    methods: {
        initAddModalStatus () {
            // 关闭弹窗是 将input输入的disable 状态重置
            this.barcodeLenDisabled = true
        },
        onBlur (e) {
            this.form.setFieldsValue({
                shortName: e.target.value
            })
        },
        onPriceBlur (e, row) {
            this.$set(row, 'priceW', e.target.value)
            this.$set(row, 'priceMin', e.target.value)
        },
        /**
         * @name: 表格右击
         */
        onContextmenuChange (row) {
            this.disContextMenu = []
            if (row.status !== 'base_goods_status:1') {
                this.disContextMenu = ['删除']
            }
        },
        // 图片上传
        uploadFileList (data) {
            this.fileList = data
        },
        /**
         * @name: 根据管理标志设置串号长度
         * @msg:
         * @param {type}
         * @return:
         */
        flagChange (v) {
            if (v !== 'manage_flag_type:1') {
                this.barcodeLenDisabled = false
                const barcodelen = this.form.getFieldValue('barcodeLen')
                this.form.setFieldsValue({ barcodeLen: barcodelen || 15 })
            } else {
                this.barcodeLenDisabled = true
                this.form.setFieldsValue({ barcodeLen: 0 })
            }
        },
        categoryinfoAdd () {
            this.$refs.categoryInput.blur()
            this.categoryQuery = true
        },
        brandinfoAdd () {
            this.$refs.brandInput.blur()
            this.brandQuery = true
        },
        /**
         * @name: 品类选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onCategorySelect (arr) {
            this.form.setFieldsValue({
                classId: `${arr[0].code || ''}-${arr[0].name || ''}`
            })
            this.classId = `${arr[0].id || ''}-${arr[0].code || ''}-${arr[0].name || ''}`
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onBrandIdSelect (arr) {
            this.form.setFieldsValue({
                brandId: `${arr[0].code || ''}-${arr[0].name || ''}`
            })
            this.brandId = `${arr[0].id || ''}-${arr[0].code || ''}-${arr[0].name || ''}`
        },
        checkBarcodeLen  (rule, value, callback) {
            const regex = /^[1-9]\d*$/
            if (this.form.getFieldValue('flag') !== 'manage_flag_type:1' && !regex.test(value)) {
                callback(new Error('串号长度有误'))
            } else {
                callback()
            }
        },
        editText (row) {
            row.goodsPic = row.pic ? row.pic.split(',') : []
            this.selectedSingleRow = { ...row }
            this.editPams = { id: row.id }
            this.editVisble = true
        },
        previewText (row) {
            row.goodsPic = row.pic ? row.pic.split(',') : []
            this.bigImg = row.goodsPic[0]
            this.selectedSingleRow = { ...row }
            this.introduction = ''
            this.getSkuInfo(row.code)
            axios({
                path: 'IntroductionFindIntroduction',
                method: 'post',
                body: {
                    id: row.id,
                    type: 'goods'
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data && res.data[0] && res.data[0].introduction) {
                        this.introduction = res.data[0].introduction
                    }
                    this.previewGoods = true
                }
            })
        },
        getSkuInfo (code) {
            this.skuInfo = []
            axios({
                path: 'GoodsSkuCopywriterPriview',
                method: 'POST',
                body: {
                    goodsCode: code,
                    page: 1,
                    rows: 100
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.skuInfo = [...res.data.list]
                }
            })
        },
        // 工具栏方法定义--start
        /**
         * @name: 清空的实现，将seachValue置空。
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 搜索，入参e为对象，也可读取本地this.seachValue，两者相同
         */
        onSeach (e) {
            e.path = 'GoodsInformationSearch'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 用户点击功能按钮时的事件，入参是按钮名。
         */
        onSeachClick (e) {
            if (e === 'add') {
                this.isAdd = true
                this.isSKUAdd = true
                this.addEditStorefront(-1)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.onDel(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('GoodsInformationSearch', this.seachValue)
            }
        },
        // 新增/编辑模态框
        addEditStorefront (index) {
            this.getConfig()
            this.getSKUStatus()
            if (this.isLinkOldErp) {
                this.queryOldErpStoreList()
                this.queryOldErpProviderList()
            }
            this.activeKey = 1
            this.isFirstNext = true
            this.skuRows.length = 0
            this.storefrontAddEditModal = true
            if (index === -1) {
                this.selectedSingleRow = {}
                this.fileList = []
                this.classId = ''
                this.brandId = ''
                this.storefrontAddEditModalTitle = '新增商品信息'
            } else {
                this.storefrontAddEditModalTitle = '编辑商品信息'
            }
        },
        /**
         * @name:请求系统参数数据
         */
        getConfig () {
            axios({
                path: 'OrganizationConfigFindByTypes',
                method: 'post',
                body: {
                    types: ['goods_type', 'label_type', 'base_goods_status', 'seasons_type', 'manage_flag_type', 'base_goods_abc']
                }
            }).then(res => {
                if (res.flag === 1) {
                    const goodsData = res.data.goods_type
                    const labelData = res.data.label_type
                    const goodsStatusData = res.data.base_goods_status
                    const seasonsData = res.data.seasons_type
                    const managerFlagData = res.data.manage_flag_type
                    const abcData = res.data.base_goods_abc
                    goodsData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.type = [...goodsData]
                    labelData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.labelType = [...labelData]
                    goodsStatusData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.statusArr = [...goodsStatusData]
                    seasonsData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.quarter = [...seasonsData]
                    managerFlagData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.flag = [...managerFlagData]
                    abcData.forEach((item) => {
                        item.key = `${item.type}:${item.configKey}`
                        item.title = item.value
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.abcArr = [...abcData]
                    if (this.isAdd) {
                        this.selectedSingleRow.type = goodsData[0].value
                        this.selectedSingleRow.labelType = labelData[0].value
                        this.selectedSingleRow.status = goodsStatusData[0].value
                        this.selectedSingleRow.quarter = seasonsData[0].value
                        this.selectedSingleRow.flag = managerFlagData[0].value
                        this.selectedSingleRow.abc = abcData[0].value
                    }
                }
            })
        },
        // 工具栏方法定义--end
        // 表格方法定义--start
        onSelect (k, r) {
            this.tableSelectRows = [...r]
        },
        /**
         * @name:表格右击编辑监听
         */
        editHandler (row) {
            this.isAdd = false
            this.isSKUAdd = false
            this.selectedSingleRow = { ...row }
            this.classId = row.classId + '-' + row.classCode + '-' + row.className
            this.selectedSingleRow.classCodeName = `${row.classCode || ''} - ${row.className || ''}`
            this.brandId = row.brandId + '-' + row.brandCode + '-' + row.brandName
            this.selectedSingleRow.brandCodeName = `${row.brandCode || ''} - ${row.brandName || ''}`
            this.selectedSingleRow.barcodeLen = row.barcodeLen
            this.barcodeLenDisabled = row.flag === 'manage_flag_type:1'
            this.fileList = []
            if (row.pic) {
                const pic = row.pic.split(',')
                pic.forEach(item => {
                    this.fileList.push({
                        url: item,
                        fileUrl: item
                    })
                })
            }
            this.$nextTick(() => {
                this.addEditStorefront()
            })
        },
        /**
         * @name:表格右击详情监听
         */
        detailHandler (row) {},
        /**
         * @name: 单项删除和多项删除
         */
        onDel (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'GoodsInformationDel',
                        method: 'post',
                        body: {
                            ids: ids
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                }
            })
        },
        /**
         * @name: 新增/编辑表单数据提交
         */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    // 判断商品sku是否重复
                    if (this.skuRows.length > 0) {
                        const hashName = {}
                        const hashPro = {}
                        let flag = false
                        for (var i in this.skuRows) {
                            if (this.skuRows[i].name.length < 1) {
                                this.loading = false
                                return this.$message.error('请输入sku名称')
                            }
                            // 自营商品
                            if (values.type === 'goods_type:1' || values.type === 'goods_type:5') {
                                if (!this.skuRows[i].ptCost || this.skuRows[i].ptCost <= 0) {
                                    this.loading = false
                                    return this.$message.warning('自营商品成本价需大于0')
                                }
                                if (!this.skuRows[i].price || this.skuRows[i].price <= 0) {
                                    this.loading = false
                                    return this.$message.warning('自营商品零售价需大于0')
                                }
                                if (!this.skuRows[i].priceW || this.skuRows[i].priceW <= 0) {
                                    this.loading = false
                                    return this.$message.warning('自营商品分销价需大于0')
                                }
                                if (!this.skuRows[i].priceMin || this.skuRows[i].priceMin <= 0) {
                                    this.loading = false
                                    return this.$message.warning('自营商品限价需大于0')
                                }
                            }
                            if (this.onSkuPropertyList.length > 0 && this.skuRows[i].checkInSelete.length === 0) {
                                this.loading = false
                                return this.$message.warning('请选择品类属性')
                            }
                            this.skuRows[i].baseSkuProperties = []
                            this.onSkuPropertyList.forEach(item => {
                                const goodCategory = this.skuRows[i].checkInSelete.find(o => o === item.name)
                                if (goodCategory) {
                                    const obj = {
                                        classPropertyId: item.id,
                                        classPropertyName: item.name,
                                        classPropertyValue: this.skuRows[i].checkLastSelete[item.name]
                                    }
                                    if (!this.skuRows[i].checkLastSelete[item.name]) {
                                        flag = true
                                        return
                                    }
                                    this.skuRows[i].baseSkuProperties.push(obj)
                                }
                            })
                            if (flag) {
                                this.loading = false
                                return this.$message.warning('请选择属性值')
                            }
                            const skuProperty = map(this.skuRows[i].baseSkuProperties, 'classPropertyValue')
                            if (hashName[this.skuRows[i].name] || hashPro[skuProperty]) {
                                this.loading = false
                                return this.$message.error('商品SKU名称/属性不能重复')
                            }
                            hashName[this.skuRows[i].name] = true
                            skuProperty.length > 0 && (hashPro[skuProperty] = true)
                        }
                    }
                    if (!this.isAdd) {
                        values.id = this.selectedSingleRow.id
                    }
                    const classArr = this.classId.split('-')
                    values.classId = classArr[0]
                    values.classCode = classArr[1]
                    values.className = classArr[2]
                    const brandArr = this.brandId.split('-')
                    values.brandId = brandArr[0]
                    values.brandCode = brandArr[1]
                    values.brandName = brandArr[2]
                    const fileList = this.fileList.map(x => x.fileUrl)
                    values.pic = fileList.join(',')
                    // sku信息
                    let skuInfo = {}
                    const skus = JSON.parse(JSON.stringify(this.skuRows))
                    if (!this.isFirstNext) {
                        if (this.isLinkOldErp) {
                            for (var s in skus) {
                                if (!skus[s].noteA.c_adno) {
                                    this.loading = false
                                    return this.$message.warning('请选择部门')
                                }
                                if (!skus[s].noteA.c_provider) {
                                    this.loading = false
                                    return this.$message.warning('请选择供应商')
                                }
                                skus[s].noteA = JSON.stringify(skus[s].noteA)
                            }
                        }
                        skuInfo = {
                            ids: this.ids,
                            skuList: skus
                        }
                    }
                    axios({
                        path: this.isAdd ? 'GoodsInformationAddGoodsAndSku' : 'GoodsInformationUpdateGoodsAndSku',
                        method: 'post',
                        body: {
                            baseGoodsAdjustGoods: values,
                            skuInfo
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            this.$refs.newTable.setTableData(this.tableCode, { path: this.tableApiPath })
                            this.storefrontAddEditModal = false
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        // 下拉框搜索
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name:请求商品状态数据
         */
        getSKUStatus () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'base_sku_status'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach((i, index) => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.skuStatusArr = [...data]
                }
            })
        },
        getSkuList () {
            this.skuRows.length = 0
            const goodsCode = this.form.getFieldValue('code')
            axios({
                path: 'GoodsSkuFindSkuListByGoodsCode',
                method: 'POST',
                body: {
                    goodsCode: goodsCode,
                    page: 1,
                    rows: 100
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    if (data.length > 0) {
                        data.forEach(o => {
                            if (o.baseSkuProperties) {
                                o.checkInSelete = []
                                o.checkLastSelete = {}
                                o.baseSkuProperties.forEach(item => {
                                    o.checkInSelete.push(item.classPropertyName)
                                    this.$set(o.checkLastSelete, item.classPropertyName, item.classPropertyValue)
                                })
                            }
                            if (this.isLinkOldErp) {
                                let json = {}
                                if (this.isJSON(o.noteA)) {
                                    json = JSON.parse(o.noteA)
                                }
                                o.noteA = Object.assign({
                                    c_adno: '',
                                    c_provider: '',
                                    c_i_type: '',
                                    c_push_money: 0,
                                    c_d_rate_reg: 0
                                }, json)
                            }
                        })
                        this.skuRows = [...data]
                        console.log(this.skuRows)
                        this.skuAddDisabled = this.onSkuPropertyList.length === 0
                    }
                }
            })
        },
        isJSON (str) {
            if (typeof str === 'string') {
                try {
                    const obj = JSON.parse(str)
                    if (typeof obj === 'object' && obj) { return true } else { return false }
                } catch (e) {
                    return false
                }
            }
        },
        skuAdd () {
            const name = this.form.getFieldValue('name')
            this.skuRows.unshift({
                status: this.skuStatusArr[0].value,
                name: name,
                ptCost: 0,
                price: 0,
                priceW: 0,
                priceMin: 0,
                rate: 0,
                checkInSelete: [],
                checkLastSelete: {},
                noteA: {
                    c_adno: '',
                    c_provider: '',
                    c_i_type: '',
                    c_push_money: 0,
                    c_d_rate_reg: 0
                }
            })
            this.skuAddDisabled = this.onSkuPropertyList.length === 0
        },
        getAttributes () {
            this.onSkuPropertyList.length = 0
            const classCode = this.form.getFieldValue('classId').split('-')[0]
            if (classCode) {
                axios({
                    path: 'GoodsCategoryAttributesFindAll',
                    body: {
                        classCode
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        this.onSkuPropertyList = res.data
                        this.skuAddDisabled = this.skuRows.length > 0 && this.onSkuPropertyList.length === 0
                    }
                })
            }
        },
        changeTab () {
            if (this.activeKey === 1) {
                this.nextTickt(-1)
            } else {
                this.nextTickt(1)
            }
        },
        // 模态框方法定义--end
        nextTickt (val) {
            if (val > 0) {
                // 商品sku
                if (this.form.getFieldValue('classId')) {
                    this.getAttributes()
                    if (this.isFirstNext) {
                        this.isFirstNext = false
                        this.ids.length = 0
                        this.skuRows.length = 0
                        // if (this.isAdd) {
                        //     this.skuAdd()
                        // } else {
                        //     this.getSkuList()
                        // }
                        this.skuAddDisabled = false
                        if (!this.isAdd) {
                            this.getSkuList()
                        }
                    }
                } else {
                    this.skuAddDisabled = true
                }
                this.activeKey = 2
            } else {
                // 商品信息
                this.activeKey = 1
            }
        },
        onPropertyChange (row, item) {
            if (row.checkInSelete.indexOf(item.name) < 0) {
                row.checkInSelete.push(item.name)
            }
            const propeytyValue = Object.values(row.checkLastSelete).join('-')
            const goodsName = this.form.getFieldValue('name')
            const name = `${goodsName}-${propeytyValue}`
            this.$set(row, 'name', name)
        },
        /**
         * @name: 如果取消复选框，则清空对应单选
         * @msg:
         * @param {type}
         * @return:
         */
        seleteChange (e, row) {
            if (!e.target.checked) {
                delete row.checkLastSelete[e.target.value]
                const goodsName = this.form.getFieldValue('name')
                const propeytyValue = Object.values(row.checkLastSelete).join('-')
                const name = propeytyValue ? `${goodsName}-${propeytyValue}` : goodsName
                this.$set(row, 'name', name)
            }
        },
        /**
         * 删除sku
         */
        deleteSku (index) {
            const skuRows = [...this.skuRows]
            if (skuRows[index].id) {
                this.ids.push(skuRows[index].id)
            }
            skuRows.splice(index, 1)
            this.skuRows = skuRows
            this.skuAddDisabled = this.skuRows.length > 0 && this.onSkuPropertyList.length === 0
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
        // 查询品类下拉
        getGoodsCategoryFindBySelected () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'POST'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    const newArr = this.initTree(data)
                    this.$set(this.conditions[1], 'selectDataArr', newArr)
                }
            })
        },
        // 查询部门
        queryOldErpStoreList () {
            axios({
                // URL: 'http://192.168.198.134:8082',
                path: 'queryStoreList',
                method: 'POST'
                // isOld: true
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data || []
                    data.forEach((i, index) => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.oldErpStoreArr = [...data]
                }
            })
        },
        getOldErpProvider (e) {
            if (e && e.length > 1) {
                if (this.timer) { clearTimeout(this.timer) }
                this.timer = setTimeout(() => {
                    this.queryOldErpProviderList(e)
                }, 300)
            }
        },
        // 查询供应商
        queryOldErpProviderList (e) {
            axios({
                // URL: 'http://192.168.198.134:8082',
                path: 'queryProviderList',
                method: 'POST',
                // isOld: true,
                body: {
                    page: 1,
                    rows: 50,
                    condition: e
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list || []
                    data.forEach((i, index) => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = `${i.code}-${i.name}`
                    })
                    this.oldErpProviderArr = [...data]
                }
            })
        },
        // 查询经营机构
        queryOldErpContractType (row) {
            this.oldErpContractTypeArr = []
            if (this.form.getFieldsValue().classId && row.noteA.c_provider) {
                axios({
                    path: 'queryContractType',
                    method: 'POST',
                    body: {
                        classCode: this.form.getFieldsValue().classId.split('-')[0],
                        brandCode: this.form.getFieldsValue().brandId.split('-')[0],
                        providerCode: row.noteA.c_provider.split('-')[0]
                    }
                }).then(res => {
                    if (res.flag === 1) {
                        const data = res.data || []
                        const arr = []
                        data.forEach((i, index) => {
                            arr.push({
                                key: index,
                                title: i,
                                value: i
                            })
                        })
                        this.oldErpContractTypeArr = [...arr]
                    }
                })
            }
        },
        clickPrev () {
            if (this.imgLeftNum > 4) {
                this.imgLeftNum -= 4
                const specDiv = this.$refs.specUl
                specDiv.style.left = `${(4 - this.imgLeftNum) * 85}px`
            }
        },
        clickNext (imgList) {
            if (imgList.length > 4 && imgList.length > this.imgLeftNum) {
                this.imgLeftNum += 4
                const specDiv = this.$refs.specUl
                specDiv.style.left = `${(4 - this.imgLeftNum) * 85}px`
            }
        },
        clickImg (img) {
            this.bigImg = img
        }
    },
    watch: {
        '$store.state.app.pageName' (val) {
            if (val === 'CommodityInfo') {
                this.getConfig()
                this.getGoodsCategoryFindBySelected()
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .title-info{
        margin-left: 25px;
        color: #38adff;
        margin-bottom: 10px;
    }
    .goods{
        width: calc(100% * 0.8);
        margin: 0 auto;
        // overflow: hidden;
        .details{
            overflow: hidden;
            margin-bottom: 10px;
            .left{
                float: left;
                width: 400px;
                .spec-list{
                    margin-bottom: 18px;
                    height: 100px;
                    .spec-icon{
                        font-size: 21px;
                        // display: block;
                        width: 30px;
                        height: 80px;
                        float: left;
                        line-height: 80px;
                        font-weight: 800;
                        cursor: pointer;
                    }
                    .spec-items {
                        float: left;
                        width: 340px;
                        height: 80px;
                        position: relative;
                        overflow: hidden;
                        margin: 0 auto;
                        ul{
                            list-style: none;
                            width: 100%;
                            padding: 0;
                            position: absolute;
                            height: 100%;
                            left: 0;
                            display: flex;
                            flex-wrap: nowrap;
                            li{
                                margin: 0 3px;
                            }
                            img{
                                border: 2px solid #fff;
                                vertical-align: middle;
                                width: 75px;
                                height: 75px;
                            }
                        }
                    }
                }
            }
            .operation{
                float: left;
                width: calc(100% - 430px);
                margin-left: 20px;
                >h1{
                    color: #333333;
                    font-size: 20px;
                }
                >h3{
                    color: #333333;
                    span{
                        color: #D35C57;
                    }

                }
                .sku-item{
                    border-bottom: 1px solid #989898;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: nowrap;
                    .item-title{
                        width: 60%;
                        line-height: 40px;
                    }
                    .item-price{
                        width: 40%;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        line-height: 40px;
                        text-align: right;
                    }
                }
            }

        }
        .introdution{
            width:100%;
            padding-top: 10px;
            border-top: 1px solid #989898;
        }
    }
</style>

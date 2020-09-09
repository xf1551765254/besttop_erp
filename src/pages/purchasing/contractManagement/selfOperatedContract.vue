<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-06 16:05:34
 * @LastEditTime: 2019-08-26 15:54:03
 -->

<template>
  <div>
    <!-- 工具栏 -->
    <seachBox
      :conditions="conditions"
      :btns="btns"
      showOrganize
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach"/>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :disContextMenu="disContextMenu"
      :pams="seachValue"
      @onSelect="onTableSelect"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="editVisible"
      title="自营合同"
      :loading="spinning"
      :submitLoading="subLoading"
      :submitClick="subClick"
      :tags="tags"
      :orderId="orderId"
      popconfirm>
      <template slot="footer">
        <a-button type="primary" @click="nextTickt(-1)" style="margin-left:10px;" :disabled="ActiveKey<2">上一步</a-button>
        <a-button type="primary" @click="nextTickt(1)" style="margin-left:10px;" :disabled="ActiveKey>5">下一步</a-button>
      </template>
      <div>
        <a-form :form="form">
          <a-tabs v-model="ActiveKey">
            <a-tab-pane tab="基础信息" :key="1">
              <a-row class="doc">
                <a-col :sm="8" :md="4" :xl="3">合同名称</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-input
                      style="width:100%;"
                      placeholder="请输入合同名称"
                      v-decorator="$check('contract.providerContractName')"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">供应商</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :filterOption="false"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.supplierCode')"
                      :options="supplierAllList"
                      placeholder="请检索供应商"
                      @search="handleSearchSupplierCode"
                      @change="supplierChange"
                      :disabled="isUpdate"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <!-- <a-col :sm="8" :md="4" :xl="3">选择机构信息</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-tree-select
                      style="width: 100%"
                      treeNodeFilterProp="title"
                      :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                      :treeData="organizeCodeData"
                      treeDefaultExpandAll
                      v-decorator="$check('contract.organizeCode')"
                      :disabled="isUpdate"
                      showSearch
                      allowClear>
                    </a-tree-select>
                  </a-form-item>
                </a-col> -->
                <a-col :sm="8" :md="4" :xl="3">签订人</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :filterOption="false"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.signBy')"
                      :options="usersArr"
                      @search="handleSearchBuyBy"
                      placeholder="请检索签订人"
                      :disabled="isUpdate"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">采购人</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :filterOption="false"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.buyBy')"
                      placeholder="请检索采购人"
                      :options="usersArr"
                      :disabled="isUpdate"
                      @search="handleSearchBuyBy"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">签约机构</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :filterOption="filterOption"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.signAddress',{initialValue:$store.getters.storeInfo.code || ''})"
                      :options="signAddressList"
                      :disabled="isUpdate"
                      showSearch
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">签订时间</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      style="width: 100%"
                      :disabledDate="signDtDisabledDate"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.signDt',{initialValue:signDtDefaultValue})"
                      :disabled="isUpdate"
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">生效时间</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      style="width: 100%"
                      :disabledDate="signDtDisabledDate"
                      v-decorator="$check('contract.effectDate',{initialValue:signDtDefaultValue})"
                      :disabled="isUpdate"
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3">失效时间</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-date-picker
                      style="width: 100%"
                      :disabledDate="expiryDateDisabledDate"
                      v-decorator="$check('contract.expiryDate',{initialValue:expiryDateDefaultValue})"
                      allowClear/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商联系人</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.linkMan" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商电话</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.linkTele" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商传真</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.linkFax" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商邮箱</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.linkEmail" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商开户行</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.accountBank" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商银行账号</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.accountNo" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商地址</span></a-col>
                <a-col :sm="16" :md="8" :xl="5"><a-input v-model="provider.address" disabled/></a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">供应商备注</span></a-col>
                <a-col :sm="16" :md="8" :xl="21"><a-input v-model="provider.note" disabled/></a-col>
                <a-col :span="24">
                  <a-form-item>
                    <a-textarea
                      placeholder="备注"
                      v-decorator="$check('contract.note')"
                      :autosize="{minRows: 2, maxRows: 4}"/>
                  </a-form-item>
                </a-col>
                </a-col></a-row>
            </a-tab-pane>
            <a-tab-pane tab="结算信息" :key="2" forceRender>
              <a-row class="doc">
                <a-col :sm="8" :md="4" :xl="3"><span class="title">月扣返点</span></a-col>
                <a-col :sm="16" :md="20" :xl="21">
                  <a-switch style="margin-left:20px" v-model="month">
                    <a-icon type="check" slot="checkedChildren"/>
                    <a-icon type="close" slot="unCheckedChildren"/>
                  </a-switch>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">正常返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width: 100%"
                      :min="0"
                      :max="100"
                      @focus="$event.currentTarget.select()"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      @change="rateReturnMonthFun"
                      v-decorator="$check('contract.rateReturnMonth',{initialValue:0})"
                      :disabled="!month"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">特价返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width: 100%"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      v-decorator="$check('contract.specialRateReturnMonth',{initialValue:0})"
                      :disabled="!month"
                      @change="specialRateReturnMonthFun"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">季扣返点</span></a-col>
                <a-col :sm="16" :md="20" :xl="21">
                  <a-switch style="margin-left:20px" v-model="quarter">
                    <a-icon type="check" slot="checkedChildren"/>
                    <a-icon type="close" slot="unCheckedChildren"/>
                  </a-switch>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">达标类型</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-select
                      style="width:100%"
                      :options="returnQuarterTypeArr"
                      :getPopupContainer="trigger => trigger.parentNode"
                      :disabled="!quarter"
                      @change="onTypeChange"
                      v-decorator="$check('contract.returnQuarterType')"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">达标值</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="99999999"
                      :precision="2"
                      :step="0.01"
                      v-decorator="$check('contract.returnQuarterAmount',{initialValue:0})"
                      :disabled="!quarter"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">正常返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      v-decorator="$check('contract.rateReturnQuarter',{initialValue:0})"
                      :disabled="!quarter"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">特价返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      v-decorator="$check('contract.specialRateReturnQuarter',{initialValue:0})"
                      :disabled="!quarter"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">半年扣返点</span></a-col>
                <a-col :sm="16" :md="20" :xl="21">
                  <a-switch style="margin-left:20px" v-model="halfyear">
                    <a-icon type="check" slot="checkedChildren"/>
                    <a-icon type="close" slot="unCheckedChildren"/>
                  </a-switch>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">达标类型</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-select
                      style="width:100%"
                      :getPopupContainer="trigger => trigger.parentNode"
                      :options="returnQuarterTypeArr"
                      :disabled="!halfyear"
                      @change="onTypeChange"
                      v-decorator="$check('contract.returnHalfyearType')"/>
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">达标值</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="99999999"
                      :precision="2"
                      :step="0.01"
                      v-decorator="$check('contract.returnHalfyearAmount',{initialValue:0})"
                      :disabled="!halfyear"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">正常返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      v-decorator="$check('contract.rateReturnHalfyear',{initialValue:0})"
                      :disabled="!halfyear"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
                <a-col :sm="8" :md="4" :xl="3"><span class="title">特价返点</span></a-col>
                <a-col :sm="16" :md="8" :xl="9">
                  <a-form-item>
                    <a-input-number
                      style="width:100%;"
                      :min="0"
                      :max="100"
                      :precision="2"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      v-decorator="$check('contract.specialRateReturnHalfyear',{initialValue:0})"
                      :disabled="!halfyear"
                      @focus="$event.currentTarget.select()"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="品类品牌" :key="3">
              <a-row>
                <a-button class="categoryinfo-btn" @click="categoryinfoAdd" size="small">新增</a-button>
                <a-popconfirm title="是否确认删除?" @confirm="() => categoryinfoDelete(-1)">
                  <a-button size="small">删除</a-button>
                </a-popconfirm>
              </a-row>
              <a-table
                rowKey="key"
                :rowSelection="{selectedRowKeys: categoryinfoSelectedRowKeys, onChange: categoryinfoSelectChange}"
                :columns="categoryinfoColumns"
                :dataSource="categoryinfoData"
                :scroll="{x:800}"
                size="small"
                bordered>
                <template slot="action" slot-scope="record">
                  <a-button v-if="isUpdate&&record.id" type="danger" size="small" disabled>删除</a-button>
                  <a-popconfirm v-else title="是否确认删除?" @confirm="() => categoryinfoDelete(record.key)">
                    <a-button size="small">删除</a-button>
                  </a-popconfirm>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="生效机构" :key="4">
              <a-row>
                <a-button class="categoryinfo-btn" @click="effectivescopeAdd" size="small">新增</a-button>
                <a-popconfirm title="是否确认删除?" @confirm="() => effectivescopeDelete(-1)">
                  <a-button size="small">删除</a-button>
                </a-popconfirm>
              </a-row>
              <a-table
                rowKey="storeCode"
                :rowSelection="{selectedRowKeys: effectivescopeSelectedRowKeys, onChange: effectivescopeSelectChange}"
                :columns="effectivescopeColumns"
                :dataSource="effectivescopeData"
                size="small"
                :scroll="{x:900}"
                bordered>
                <template slot="action" slot-scope="record">
                  <a-popconfirm title="是否确认删除?" @confirm="() => effectivescopeDelete(record.storeCode)">
                    <a-button size="small">删除</a-button>
                  </a-popconfirm>
                </template>
                <template slot="note" slot-scope="text, record">
                  <a-input style="width:100%;" :value="text" @change="e=>effectivescopeCellChange(e.target.value, record.storeCode)"/>
                  <!-- <editTableInput :text="text" @change="e=>effectivescopeCellChange(e,record.storeCode)"/> -->
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="供货信息" :key="5">
              <a-row>
                <a-button class="categoryinfo-btn" @click="supplyinfoAdd" size="small">新增</a-button>
                <a-popconfirm title="是否确认删除?" @confirm="() => supplyinfoDelete(-1)">
                  <a-button size="small">删除</a-button>
                </a-popconfirm>
              </a-row>
              <div class="table-nowrap">
                <a-table
                  rowKey="key"
                  :rowSelection="{selectedRowKeys: supplyinfoSelectedRowKeys, onChange: supplyinfoSelectChange}"
                  :columns="supplyinfoColumns"
                  :dataSource="supplyinfoData"
                  :scroll="{x:1800}"
                  size="small"
                  bordered>
                  <template v-for="col in ['normalRebate','specialRebate','stockPrice', 'skuPrice', 'skuPriceW', 'isPrice']" :slot="col" slot-scope="text, record">
                    <div :key="col">
                      <a-input-number
                        v-if="col === 'normalRebate'"
                        style="width:100%;"
                        :min="0"
                        :max="100"
                        :precision="2"
                        :value="text"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        @change="e => InputChange(e, record.key, col)"
                      />
                      <a-input-number
                        v-if="col === 'specialRebate'"
                        style="width:100%;"
                        :min="0"
                        :max="100"
                        :precision="2"
                        :value="text"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        @change="e => InputChange(e, record.key, col)"
                      />
                      <a-input-number
                        v-else-if="col === 'stockPrice'"
                        style="width:100%;"
                        :min="0.00"
                        :max="99999999"
                        :step="1"
                        :precision="2"
                        :value="text"
                        @focus="$event.currentTarget.select()"
                        @change="e => InputChange(e, record.key, col)"
                        :disabled="isUpdate&&!record.isAdd" />
                      <a-input-number
                        v-else-if="col === 'skuPrice'"
                        style="width:100%;"
                        :min="0.00"
                        :max="99999999"
                        :step="1"
                        :precision="2"
                        :value="text"
                        @focus="$event.currentTarget.select()"
                        @change="e => InputChange(e, record.key, col)"
                        :disabled="isUpdate&&!record.isAdd" />
                      <a-input-number
                        v-else-if="col === 'skuPriceW'"
                        style="width:100%;"
                        :min="0.00"
                        :max="99999999"
                        :step="1"
                        :precision="2"
                        @focus="$event.currentTarget.select()"
                        :value="text"
                        @change="e => InputChange(e, record.key, col)"
                        :disabled="isUpdate&&!record.isAdd" />
                      <a-input-number
                        v-else-if="col === 'isPrice'"
                        style="width:100%;"
                        :min="0.00"
                        :max="99999999"
                        :step="1"
                        :precision="2"
                        @focus="$event.currentTarget.select()"
                        :value="text"
                        @change="e => InputChange(e, record.key, col)"
                        :disabled="isUpdate&&!record.isAdd" />
                    </div>
                  </template>
                  <template slot="action" slot-scope="record">
                    <a-button v-if="isUpdate&&record.id" type="danger" size="small" disabled>删除</a-button>
                    <a-popconfirm v-else title="是否确认删除?" @confirm="() => supplyinfoDelete(record.key)">
                      <a-button size="small">删除</a-button>
                    </a-popconfirm>
                  </template>
                </a-table>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="附件" :key="6">
              <upload :fileList="fileList" @uploadFileList="uploadFileList" :accept="fileType"/>
            </a-tab-pane>
          </a-tabs>
        </a-form>
      </div>
      <category :visible.sync="categoryQuery" :pams="{ level: 2 }" @onSelect="onCategorySelect"/>
      <brand :visible.sync="brandQuery" @onSelect="onBrandSelect" multiple/>
      <store :visible.sync="storeQuery" :pams="storeStatus" @onSelect="onStoreSelect" multiple/>
      <goods :visible.sync="goodsQuery" :pams="classBrand" @onSelect="onGoodsSelect" multiple/>
    </bt-modal>
    <preview v-model="previewVisbel" :orderId="orderId"></preview>
  </div>
</template>
 <style lang="less">
    .categoryinfo-btn{
        margin:8px;
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import upload from '@comp/upload'
import store from '@comp/BasicQuery/store'
import category from '@comp/BasicQuery/category'
import brand from '@comp/BasicQuery/brand'
import goods from '@comp/BasicQuery/goods'
import { axios } from '@/utils/request'
import editTableInput from './tools/input'
import BtModal from '@comp/Modal'
import Preview from '@pages/purchasing/contractManagement/preview/selfPreview'
import is from 'is_js'
import map from 'lodash.map'
import clonedeep from 'lodash.clonedeep'
import config from '@/config/defaultSettings'
import getStatus from '@comp/statusAll/getStatus'
import moment from 'moment'
export default {
    name: 'SelfOperatedContract',
    components: {
        NewTable,
        SeachBox,
        editTableInput,
        store,
        category,
        brand,
        goods,
        upload,
        BtModal,
        Preview
    },
    data: function () {
        return {
            config,
            previewVisbel: false,
            fileList: [],
            fileType: ['PDF', 'EXCEL', 'IMG', 'PPT', 'TXT', 'WORD', 'RAR'],
            tags: [],
            orderId: '',
            form: this.$form.createForm(this),
            spinning: true,
            ActiveKey: 1,
            storeQuery: false,
            categoryQuery: false,
            brandQuery: false,
            goodsQuery: false,
            supplierAllList: [],
            usersArr: [],
            disContextMenu: [],
            tableCode: '',
            tableApiPath: '',
            seachValue: { businessType: 'provider_contract_business_type:1' },
            storeStatus: {
                include: {
                    type: ['store_type:3', 'store_type:6']
                }
            },
            btns: ['add', 'del', 'export', 'print'],
            conditions: [
                {
                    key: 'code',
                    type: 'input',
                    title: '合同编码'
                },
                {
                    // key: 'status',
                    // type: 'select',
                    // title: '合同状态',
                    // label: 'value',
                    // value: ['type', 'configKey'],
                    // filter: true,
                    // path: 'OrganizationConfigFindByType',
                    // body: {
                    //     type: 'provider_contract_status'
                    // }
                    title: '合同状态',
                    key: 'status',
                    type: 'select',
                    filter: true,
                    label: 'title',
                    value: 'value',
                    selectDataArr: []
                },
                {
                    title: '供应商',
                    type: 'select',
                    key: 'providerCode',
                    path: 'CustomerSupplierFindOption',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true
                },
                // {
                //     key: 'organizeCode',
                //     title: '组织机构',
                //     type: 'treeSelect',
                //     filter: true,
                //     selectDataArr: []
                // },
                {
                    key: 'effectDate',
                    type: 'date',
                    title: '生效时间'
                },
                {
                    key: 'expiryDate',
                    type: 'date',
                    title: '失效时间'
                },
                {
                    key: 'createTime',
                    type: 'date',
                    title: '创建时间'
                }
            ],
            menuOpt: [
                { name: '预览', action: 'selfOperatedContract.get', fc: (row) => { this.providerQueryDetail(row) } },
                { name: '编辑', action: 'selfOperatedContract.edit', fc: (row) => { this.providerEdit(row) } },
                { name: '变更', action: 'selfOperatedContract.update', fc: (row) => { this.providerUpdate(row) } },
                { name: '删除', action: 'selfOperatedContract.delete', fc: ({ id }) => { this.del(id) } },
                { name: '确认', action: 'selfOperatedContract.confirm', fc: ({ id }) => { this.providerAuditBegin(id) } },
                { name: '取消', action: 'selfOperatedContract.cancel', fc: ({ id }) => { this.providerAuditCancel(id) } },
                { name: '审核', action: 'selfOperatedContract.verify', fc: ({ id }) => { this.providerAudit(id) } },
                { name: '终止', action: 'selfOperatedContract.stop', fc: ({ id }) => { this.providerStop(id) } }
            ],
            isAdd: true,
            isUpdate: false,
            editVisible: false,
            subLoading: false,
            signAddressList: [],
            organizeCodeData: [],
            returnQuarterTypeArr: [],
            month: false,
            quarter: false,
            halfyear: false,
            categoryinfoColumns: [ // 品类品牌表头
                { title: '品类编码', dataIndex: 'classCode', width: 80 },
                { title: '品类名称', dataIndex: 'className', width: 200 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 80 },
                { title: '品牌名称', dataIndex: 'brandName' },
                { title: '操作', key: 'operation', fixed: 'right', width: 80, scopedSlots: { customRender: 'action' } }
            ],
            categoryinfoData: [], // 品类品牌表体
            categoryinfoSelectedRowKeys: [], // 品类品牌选中项
            effectivescopeColumns: [// 生效分店列表表头
                { title: '机构编码', dataIndex: 'storeCode', width: 100 },
                { title: '机构名称', dataIndex: 'storeName', width: 250 },
                { title: '备注', dataIndex: 'note', scopedSlots: { customRender: 'note' } },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            effectivescopeData: [], // 生效分店表体
            effectivescopeSelectedRowKeys: [], // 生效分店选中项
            supplyinfoColumns: [// 供货信息
                { title: '商品sku编码', dataIndex: 'skuCode', width: 100 },
                { title: '商品SKU名称', dataIndex: 'skuName', width: 200 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '商品单位', dataIndex: 'skuUnit', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: 'SKU属性', dataIndex: 'skuProperty', width: 100 },
                { title: '税率', dataIndex: 'skuTaxRates', width: 100 },
                // { title: '扣率', dataIndex: 'skuDRate', width: 100, scopedSlots: { customRender: 'skuDRate' } },
                { title: '正常返点', dataIndex: 'normalRebate', width: 100, scopedSlots: { customRender: 'normalRebate' } },
                { title: '特价返点', dataIndex: 'specialRebate', width: 100, scopedSlots: { customRender: 'specialRebate' } },
                { title: '进货价', dataIndex: 'stockPrice', width: 100, scopedSlots: { customRender: 'stockPrice' } },
                { title: '零售价', dataIndex: 'skuPrice', width: 100, scopedSlots: { customRender: 'skuPrice' } },
                { title: '分销价', dataIndex: 'skuPriceW', width: 100, scopedSlots: { customRender: 'skuPriceW' } },
                { title: '限制价格', dataIndex: 'isPrice', width: 100, scopedSlots: { customRender: 'isPrice' } },
                // { title: '是否管库存', dataIndex: 'isStock', width: 100, scopedSlots: { customRender: 'isStock' } },
                { title: '状态', dataIndex: 'statusName', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            supplyinfoData: [], // 供货信息
            supplyinfoSelectedRowKeys: [], // 供货信息
            categoryCodeCacheInfo: {}, // 缓存选择的品类，级联选品牌用
            tableSelectRows: [],
            classBrand: {},
            contractID: {},
            /**
             * 整理字段
             */
            // 基础信息
            contract: {},
            // 结算信息
            sum: {},
            // 供应商信息
            provider: {},
            // 品类品牌
            classGrands: [],
            // 生效门店
            stores: [],
            // 供货信息
            skus: [],
            // 合同附件
            files: '',
            rateReturnMonthId: '', // 正常返点
            specialRateReturnMonthId: '', // 特价返点
            skuListId: [] // 编辑时供货信息ID
        }
    },
    computed: {
        signDtDefaultValue () {
            return moment()
        },
        expiryDateDefaultValue () {
            return moment().add({ years: 1 }).subtract({ days: 1 })
        },
        isSubReady () {
            return this.supplyinfoData.length === 0
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '22507a0a19e5424fa4f3c95117dc605a:selfOperatedContract'
            this.tableApiPath = 'ProviderQueryProprietary'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        getStatus('provider_contract_status', this.conditions[1])
        this.seachValue = {
            status: 'provider_contract_status:1'
        }
        // this.getSupplierAllList()
        this.getSignAddressList()
        this.getOrganizeCodeData()
        this.getReturnQuarterTypeArr()
    // this.getUsersArr()
    },
    methods: {
    /**
         * @name: 签订人
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchBuyBy (value) {
            if (!value) {
                return
            }
            const path = 'PermissionsUserFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.usersArr.length = 0
                this.getData({
                    condition: value
                }, path)
            }, 300)
        },
        /**
         * @name: 供应商搜索
         * @msg:
         * @param {type}
         * @return:
         */
        handleSearchSupplierCode (value) {
            if (!value) {
                return
            }
            const path = 'CustomerSupplierFindOption'
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.supplierAllList.length = 0
                this.getData({
                    name: value
                }, path)
            }, 300)
        },
        /**
         * @name: 数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (pams = {}, path) {
            const p = Object.assign({
                page: 1,
                rows: 20
            }, pams)
            axios({
                path: path,
                method: 'POST',
                body: p
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    if (path === 'CustomerSupplierFindOption') {
                        this.supplierAllList = data
                    } else if (path === 'PermissionsUserFindOption') {
                        this.usersArr = data
                    }
                }
            })
        },
        specialRateReturnMonthFun (e) {
            this.specialRateReturnMonthId = e
            console.log(this.specialRateReturnMonthId, '特价返点')
        },
        rateReturnMonthFun (e) {
            this.rateReturnMonthId = e
            console.log(this.rateReturnMonthId, '正常返点')
        },
        /**
         * @name:监听表格编辑
         */
        InputChange (val, count, key) {
            const newData = [...this.supplyinfoData]
            const target = newData.filter(item => count === item.key)[0]
            if (target) {
                target[key] = val
                this.supplyinfoData = newData
            }
        },
        /**
         * @name: 获取组织机构税票信息
         * @msg:
         * @param {type}
         * @return:
         */
        getProvider (code) {
            if (code) {
                axios({
                    path: 'OrganizationGroupFrameworkFindStoreByCode',
                    method: 'post',
                    body: { code }
                }).then(res => {
                    if (res.flag === 1) {
                        console.log(res.data)
                        this.previewFootersB = res.data
                    }
                })
            }
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        uploadFileList (data) {
            this.fileList = data
        },
        /**
         *@name: 合同变更
         */
        providerUpdate (row) {
            const self = this
            self.$confirm({
                title: '警告',
                content: '是否要变更合同？',
                onOk () {
                    self.providerEdit(row, false, true)
                },
                onCancel () {}
            })
        },
        /**
         * @name: 合同终止
         * @msg:
         * @param {type}
         * @return:
         */
        providerStop (id) {
            const self = this
            self.$confirm({
                title: '警告',
                content: '终止合同操作不可恢复，是否继续？',
                onOk () {
                    axios({
                        path: 'ProviderTermination',
                        method: 'POST',
                        body: { id }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                                path: 'ProviderQueryProprietary'
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 合同编辑
         * @msg:
         * @param {type}
         * @return:
         */
        providerEdit (row, isAdd = false, isUpdate = false) {
            console.log(row)
            this.skuListId = []
            this.spinning = true
            this.isAdd = isAdd
            this.isUpdate = isUpdate
            const id = row.id
            if (!isAdd) {
                this.orderId = row.code
                if (row.status === 'provider_contract_status:1') { this.tags = ['unconfirm'] }
            }
            axios({
                path: 'ProviderQueryProprietaryDetail',
                method: 'POST',
                body: { id }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    console.log(res.data)
                    const { contract, provider, sum, skus, stores, classGrands, files } = res.data
                    this.editVisible = true
                    this.ActiveKey = 1
                    this.provider = provider
                    this.contractID.contractID = contract.id
                    this.contractID.sunId = sum.id
                    this.rateReturnMonthId = sum.rateReturnMonth ? sum.rateReturnMonth * 100 : 0 // 正常返点
                    this.specialRateReturnMonthId = sum.specialRateReturnMonth ? sum.specialRateReturnMonth * 100 : 0 // 特价返点
                    this.contractID.providerId = provider.id
                    this.$nextTick(() => {
                        if (sum.rateReturnMonth > 0 || sum.specialRateReturnMonth > 0) {
                            this.month = true
                            this.form.setFieldsValue({
                                rateReturnMonth: sum.rateReturnMonth ? sum.rateReturnMonth * 100 : 0,
                                specialRateReturnMonth: sum.specialRateReturnMonth ? sum.specialRateReturnMonth * 100 : 0
                            })
                        }
                        if (sum.returnQuarterAmount > 0 || sum.rateReturnQuarter > 0 || sum.specialRateReturnQuarter > 0) {
                            this.quarter = true
                            this.form.setFieldsValue({
                                returnQuarterAmount: sum.returnQuarterAmount,
                                rateReturnQuarter: sum.rateReturnQuarter ? sum.rateReturnQuarter * 100 : 0,
                                specialRateReturnQuarter: sum.specialRateReturnQuarter ? sum.specialRateReturnQuarter * 100 : 0,
                                returnQuarterType: sum.returnQuarterType
                            })
                        }
                        if (sum.returnHalfyearAmount > 0 || sum.rateReturnHalfyear > 0 || sum.specialRateReturnHalfyear > 0) {
                            this.halfyear = true
                            this.form.setFieldsValue({
                                returnHalfyearAmount: sum.returnHalfyearAmount,
                                rateReturnHalfyear: sum.rateReturnHalfyear ? sum.rateReturnHalfyear * 100 : 0,
                                specialRateReturnHalfyear: sum.specialRateReturnHalfyear ? sum.specialRateReturnHalfyear * 100 : 0,
                                returnHalfyearType: sum.returnHalfyearType
                            })
                        }
                        const skuList = skus.skuList
                        skuList.forEach(s => {
                            s.key = s.skuCode
                            s.skuTaxRates = this.rateTransform(s.skuTaxRate)
                            s.normalRebate = s.normalRebate ? s.normalRebate * 100 : 0
                            s.specialRebate = s.specialRebate ? s.specialRebate * 100 : 0
                        })
                        this.supplyinfoData = [...skuList]
                        const storesList = stores.stores
                        this.effectivescopeData = [...storesList]
                        const brandList = classGrands.brandList
                        brandList.forEach(b => {
                            b.key = `${b.classCode}${b.brandCode}`
                        })
                        this.categoryinfoData = [...brandList]
                        this.form.setFieldsValue({
                            providerContractName: contract.providerContractName,
                            supplierCode: `${provider.code}-${provider.name}`,
                            // organizeCode: contract.organizeCode
                            effectDate: moment(contract.effectDate),
                            expiryDate: moment(contract.expiryDate),
                            signAddress: contract.signAddress,
                            signDt: moment(contract.signDt),
                            signBy: `${contract.signBy}-${contract.signName}`,
                            buyBy: `${contract.buyBy}-${contract.buyName}`,
                            // businessType: contract.businessType,
                            note: contract.note
                        })
                        this.fileList = []
                        if (files) {
                            const pic = files.split(',')
                            pic.forEach(item => {
                                this.fileList.push({
                                    url: item,
                                    fileUrl: item
                                })
                            })
                        }
                    })
                }
            })
        },
        /**
         * @name: 查询合同详情
         * @msg:
         * @param {type}
         * @return:
         */
        providerQueryDetail (row) {
            this.orderId = row.code
            this.previewVisbel = true
        },
        /**
         * @name: 商品选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onGoodsSelect (arr) {
            const error = []
            arr.forEach(g => {
                const has = this.supplyinfoData.filter(o => o.key === g.skuCode)
                if (has.length === 0) {
                    this.supplyinfoData.push({
                        key: g.skuCode,
                        classCode: g.skuClassCode,
                        className: g.skuClassName,
                        brandCode: g.brandCode,
                        brandName: g.brandName,
                        skuCode: g.skuCode,
                        skuName: g.skuName,
                        skuUnit: g.skuBasicUnit,
                        skuModel: g.goodsModel,
                        skuProperty: g.skuProperty,
                        skuTaxRate: g.goodsTaxRate,
                        skuTaxRates: this.rateTransform(g.goodsTaxRate),
                        skuDRate: g.skuDrate,
                        stockPrice: g.skuPtCost,
                        skuPtCost: g.skuPtCost,
                        skuPrice: g.skuPrice,
                        skuPriceW: g.skuPriceW,
                        isPrice: g.priceMin,
                        // isStock: 1,
                        status: g.skuStatus,
                        statusName: g.skuStatusName,
                        mainSkuCode: g.goodsCode,
                        isAdd: true,
                        normalRebate: Number(this.rateReturnMonthId ? this.rateReturnMonthId : 0),
                        specialRebate: Number(this.specialRateReturnMonthId ? this.specialRateReturnMonthId : 0)
                    })
                } else {
                    error.push(g.skuName)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-商品已经添加过了`
                })
            }
        },
        /**
         * @name: 查询供应商信息
         * @msg:
         * @param {type}
         * @return:
         */
        supplierChange (value) {
            if (is.not.string(value)) {
                this.provider = {}
            } else {
                axios({
                    path: 'CustomerSupplierFindById',
                    method: 'post',
                    body: { code: value }
                }).then(res => {
                    if (res.flag === 1) {
                        this.provider = res.data
                    }
                })
            }
        },
        /**
         * @name: 品牌选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onBrandSelect (arr) {
            const error = []
            arr.forEach(b => {
                const key = `${this.categoryCodeCacheInfo.code}${b.code}`
                const has = this.categoryinfoData.filter(o => o.key === key)
                if (has.length === 0) {
                    this.categoryinfoData.push({
                        // classId: this.categoryCodeCacheInfo.id,
                        classCode: this.categoryCodeCacheInfo.code,
                        className: this.categoryCodeCacheInfo.name,
                        // brandId: b.id,
                        brandCode: b.code,
                        brandName: b.name,
                        key
                    })
                } else {
                    error.push(`${this.categoryCodeCacheInfo.name}-${b.name}`)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-组合已经添加过了`
                })
            }
        },
        /**
         * @name: 品类选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onCategorySelect (arr) {
            let isHasNew = false
            arr.forEach(s => {
                this.categoryCodeCacheInfo = {
                    id: s.id,
                    code: s.code,
                    name: s.name
                }
                isHasNew = true
            })
            if (isHasNew) {
                this.brandQuery = true
            }
        },
        /**
         * @name: 门店选择器
         * @msg:
         * @param {type}
         * @return:
         */
        onStoreSelect (arr) {
            const error = []
            arr.forEach(s => {
                const has = this.effectivescopeData.filter(o => o.storeCode === s.code)
                if (has.length === 0) {
                    this.effectivescopeData.push({
                        storeCode: s.code,
                        storeName: s.name,
                        note: s.note
                    })
                } else {
                    error.push(s.name)
                }
            })
            if (error.length > 0) {
                this.$notification.error({
                    message: '提示',
                    description: `有${error.length}项添加失败，${error.join(',')}-已经添加过了`
                })
            }
        },
        /**
         * @name: 供货信息删除
         * @msg:
         * @param {type}
         * @return:
         */
        supplyinfoDelete (key) {
            if (key === -1) {
                const supplyinfoData = [...this.supplyinfoData]
                this.supplyinfoData = supplyinfoData.filter(item => is.not.inArray(item.key, this.supplyinfoSelectedRowKeys))
                if (!this.isAdd) {
                    this.skuListId.push(...map(supplyinfoData.filter(o => is.inArray(o.key, this.supplyinfoSelectedRowKeys)), 'id'))
                }
            } else {
                const supplyinfoData = [...this.supplyinfoData]
                this.supplyinfoData = supplyinfoData.filter(item => item.key !== key)
                if (!this.isAdd) {
                    this.skuListId.push(...map(supplyinfoData.filter(o => o.key === key), 'id'))
                }
            }
            console.log(this.skuListId)
        },
        /**
         * @name: 供货信息新增
         * @msg:
         * @param {type}
         * @return:
         */
        supplyinfoAdd () {
            if (this.categoryinfoData.length === 0) {
                this.$message.error('请先配置品类品牌')
                return
            }
            if (this.effectivescopeData.length === 0) {
                this.$message.error('请先配置生效范围')
                return
            }
            const supplyinfoDataCode = map(this.supplyinfoData, 'skuCode')
            this.classBrand = {
                status: 'base_sku_status:2',
                types: ['goods_type:1', 'goods_type:5'],
                include: {
                    classBrand: [...this.categoryinfoData]
                },
                exclude: {
                    code: supplyinfoDataCode
                }
            }
            this.goodsQuery = true
        },
        /**
         * @name: 供货信息编辑
         * @msg:
         * @param {type}
         * @return:
         */
        supplyinfoCellChange (key, dataIndex) {
            return (value) => {
                const supplyinfoData = [...this.supplyinfoData]
                const target = supplyinfoData.filter(item => item.key === key)[0]
                if (target) {
                    target[dataIndex] = value
                    this.supplyinfoData = supplyinfoData
                }
            }
        },
        /**
         * @name: 供货信息选中事件
         * @msg:
         * @param {type}
         * @return:
         */
        supplyinfoSelectChange (selectedRowKeys, row) {
            if (this.isUpdate) {
                const data = row.filter(item => { return !item.id })
                this.supplyinfoSelectedRowKeys = map(data || [], 'key')
            } else {
                this.supplyinfoSelectedRowKeys = selectedRowKeys
            }
        },
        /**
         * @name:生效范围
         * @msg:
         * @param {type}
         * @return:
         */
        effectivescopeAdd () {
            this.storeQuery = true
        },
        /**
         * @name: 生效范围分店信息表格操作
         * @msg:
         * @param {type}
         * @return:
         */
        effectivescopeDelete (storeCode) {
            if (storeCode === -1) {
                const effectivescopeData = [...this.effectivescopeData]
                this.effectivescopeData = effectivescopeData.filter(item => is.not.inArray(item.storeCode, this.effectivescopeSelectedRowKeys))
            } else {
                const effectivescopeData = [...this.effectivescopeData]
                this.effectivescopeData = effectivescopeData.filter(item => item.storeCode !== storeCode)
            }
        },
        /**
         * @name: 生效范围编辑
         * @msg:
         * @param {type}
         * @return:
         */
        effectivescopeCellChange (value, storeCode) {
            console.log(value, storeCode)
            const effectivescopeData = [...this.effectivescopeData]
            const target = effectivescopeData.filter(item => item.storeCode === storeCode)[0]
            if (target) {
                target.note = value
                this.effectivescopeData = effectivescopeData
            }
        },
        /**
         * @name: 生效范围多选改变
         * @msg:
         * @param {type}
         * @return:
         */
        effectivescopeSelectChange (selectedRowKeys) {
            this.effectivescopeSelectedRowKeys = selectedRowKeys
        },
        /**
         * @name: 品类品牌删除
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoDelete (key) {
            if (key === -1) {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => is.not.inArray(item.key, this.categoryinfoSelectedRowKeys))
            } else {
                const categoryinfoData = [...this.categoryinfoData]
                this.categoryinfoData = categoryinfoData.filter(item => item.key !== key)
            }
        },
        /**
         * @name: 品类品牌新增
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoAdd () {
            this.categoryQuery = true
        },
        /**
         * @name: 品类品牌多选
         * @msg:
         * @param {type}
         * @return:
         */
        categoryinfoSelectChange (selectedRowKeys, row) {
            if (this.isUpdate) {
                const data = row.filter(item => { return !item.id })
                this.categoryinfoSelectedRowKeys = map(data || [], 'key')
            } else {
                this.categoryinfoSelectedRowKeys = selectedRowKeys
            }
        },
        /**
         * @name: 生效时间过滤&失效时间
         * @msg:
         * @param {type}
         * @return:
         */
        signDtDisabledDate (e) {
            return moment(e).isBefore(moment().startOf('day'))
        },
        expiryDateDisabledDate (e) {
            if (this.isUpdate) {
                const date = this.form.getFieldsValue().effectDate
                return moment(e).isBefore(moment().startOf('day')) || moment(e).isBefore(moment(date).startOf('day'))
            } else {
                return moment(e).isBefore(moment().startOf('day'))
            }
        },
        /**
         * @name: 提交
         * @msg:
         * @param {type}
         * @return:
         */
        subClick (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    const contract = {
                        providerContractName: values.providerContractName,
                        providerCode: values.supplierCode.split('-')[0],
                        // organizeCode: values.organizeCode,
                        effectDate: moment(values.effectDate).startOf('day').format('YYYY-MM-DD'),
                        expiryDate: moment(values.expiryDate).startOf('day').format('YYYY-MM-DD'),
                        signAddress: values.signAddress,
                        signDt: moment(values.signDt).startOf('day').format('YYYY-MM-DD'),
                        signBy: values.signBy.split('-')[0],
                        buyBy: values.buyBy.split('-')[0],
                        businessType: 'provider_contract_business_type:1',
                        note: values.note
                    }
                    const sum = {
                        rateReturnMonth: values.rateReturnMonth ? values.rateReturnMonth / 100 : 0,
                        specialRateReturnMonth: values.specialRateReturnMonth ? values.specialRateReturnMonth / 100 : 0,
                        returnQuarterType: values.returnQuarterType,
                        returnQuarterAmount: values.returnQuarterAmount,
                        rateReturnQuarter: values.rateReturnQuarter ? values.rateReturnQuarter / 100 : 0,
                        specialRateReturnQuarter: values.specialRateReturnQuarter ? values.specialRateReturnQuarter / 100 : 0,
                        returnHalfyearType: values.returnHalfyearType,
                        returnHalfyearAmount: values.returnHalfyearAmount,
                        rateReturnHalfyear: values.rateReturnHalfyear ? values.rateReturnHalfyear / 100 : 0,
                        specialRateReturnHalfyear: values.specialRateReturnHalfyear ? values.specialRateReturnHalfyear / 100 : 0
                    }
                    const classGrands = { brandList: [...this.categoryinfoData] }
                    const stores = { stores: [...this.effectivescopeData] }
                    // this.supplyinfoData.forEach(item => {
                    //     item.skuDRate = item.skuDRate ? item.skuDRate / 100 : 0
                    // })
                    const skus = { skuList: clonedeep(this.supplyinfoData), delIds: this.skuListId }
                    for (const item of skus.skuList) {
                        item.normalRebate = item.normalRebate ? item.normalRebate / 100 : 0
                        item.specialRebate = item.specialRebate ? item.specialRebate / 100 : 0
                        if (Number(item.stockPrice) === 0) {
                            return this.$message.error(`商品${item.skuName}的进货价格不能为0,请输入!`)
                        }
                        if (Number(item.skuPrice) === 0) {
                            return this.$message.error(`商品${item.skuName}的零售价格不能为0,请输入!`)
                        }
                        if (Number(item.skuPriceW) === 0) {
                            return this.$message.error(`商品${item.skuName}的分销价格不能为0,请输入!`)
                        }
                        // if (Number(item.isPrice) === 0) {
                        //     return this.$message.error(`商品${item.skuName}的限制价格不能为0,请输入!`)
                        // }
                    }
                    const fileList = this.fileList.map(x => x.fileUrl)
                    const files = fileList.join(',')
                    if (!this.isAdd) {
                        contract.id = this.contractID.contractID
                        sum.id = this.contractID.sunId
                        this.provider.id = this.contractID.providerId
                    }
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ProviderAdd' : (this.isUpdate ? 'ProviderUpdateAudit' : 'ProviderUpdate'),
                        method: 'POST',
                        body: {
                            contract,
                            sum,
                            classGrands,
                            stores,
                            skus,
                            files,
                            provider: this.provider
                        }
                    }).then(res => {
                        this.subLoading = false
                        if (res.flag === 1) {
                            this.editVisible = false
                            this.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                                path: 'ProviderQueryProprietary'
                            })
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        subCancel () {
            this.editVisible = false
        },
        onReload () {
            this.seachValue = {}
        },
        onSeachClick (e) {
            console.log(this.specialRateReturnMonthId, this.rateReturnMonthId)
            if (e === 'add') {
                this.orderId = ''
                this.tags.length = 0
                this.isAdd = true
                this.isUpdate = false
                this.editVisible = true
                this.month = false
                this.quarter = false
                this.halfyear = false
                this.categoryinfoData.length = 0
                this.effectivescopeData.length = 0
                this.specialRateReturnMonthId = 0
                this.rateReturnMonthId = 0
                this.supplyinfoData.length = 0
                this.ActiveKey = 1
                this.provider = {}
                this.contractID = {}
                this.fileList.length = 0
                setTimeout(() => {
                    this.spinning = false
                }, 500)
            } else if (e === 'del') {
                if (this.tableSelectRows.length > 0) {
                    this.del(-1)
                } else {
                    this.$message.warning('您尚未选中任何数据！')
                }
            } else if (e === 'export') {
                this.$refs.newTable.exportFile('ProviderQueryProprietary', this.seachValue)
            } else if (e === 'print') {

            }
        },
        /**
         * @name: 右键菜单监听
         * @msg:
         * @param {type}
         * @return:
         */
        onContextmenuChange ({ status }) {
            console.log(status)
            if (status === 'provider_contract_status:1') {
                this.disContextMenu = ['变更', '审核', '取消', '终止']
            } else if (status === 'provider_contract_status:2') {
                this.disContextMenu = ['编辑', '删除', '确认', '审核', '取消']
            } else if (status === 'provider_contract_status:3') {
                this.disContextMenu = ['编辑', '变更', '删除', '确认', '终止']
            } else if (status === 'provider_contract_status:4') {
                this.disContextMenu = ['编辑', '删除', '确认', '审核', '取消']
            } else if (status === 'provider_contract_status:5') {
                this.disContextMenu = ['编辑', '变更', '删除', '确认', '审核', '取消', '终止']
            } else if (status === 'provider_contract_status:6') {
                this.disContextMenu = ['编辑', '变更', '删除', '确认', '审核', '取消', '终止']
            } else {
                this.disContextMenu = ['预览', '编辑', '变更', '确认', '审核', '取消', '终止']
            }
        },
        onSeach (e) {
            if (this.seachValue.createTime) {
                this.$set(this.seachValue, 'createTime', moment(this.seachValue.createTime).format('YYYY-MM-DD HH:mm:ss'))
            }
            e.path = 'ProviderQueryProprietary'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        // 获取供应商列表
        // getSupplierAllList () {
        //     axios({
        //         path: 'CustomerSupplierFindOption',
        //         method: 'post'
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.supplierAllList = [...data]
        //         }
        //     })
        // },
        /**
         * @name: 门店
         * @msg:
         * @param {type}
         * @return:
         */
        getSignAddressList () {
            axios({
                path: 'OrganizationStoreFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data.list
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.signAddressList = [...data]
                }
            })
        },
        /**
         * @name: 获取达标类型选项框
         * @msg:
         * @param {type}
         * @return:
         */
        getReturnQuarterTypeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'provider_contract_sum_return_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = `${i.type}:${i.configKey}`
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.returnQuarterTypeArr = [...data]
                }
            })
        },
        /**
         * @name: 组织机构
         * @msg:
         * @param {type}
         * @return:
         */
        getOrganizeCodeData () {
            axios({
                path: 'OrganizationGroupFrameworkFindOptionTree',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log('组织机构', data)
                    this.organizeCodeData = this.initTree(data)
                    this.$set(this.conditions[3], 'selectDataArr', this.organizeCodeData)
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
         * @name: 切换tabs
         * @msg:
         * @param {type}
         * @return:
         */
        nextTickt (step) {
            if (step > 0) {
                if (this.ActiveKey < 6) this.ActiveKey++
            } else {
                if (this.ActiveKey > 1) this.ActiveKey--
            }
        },
        /**
         * @name: 选择用户
         * @msg:
         * @param {type}
         * @return:
         */
        // getUsersArr () {
        //     axios({
        //         path: 'PermissionsUserFindOption',
        //         method: 'post'
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = `${i.code}-${i.name}`
        //                 i.value = i.code
        //             })
        //             this.usersArr = [...data]
        //         }
        //     })
        // },
        /**
         * @name: 删除合同
         * @msg:
         * @param {type}
         * @return:
         */
        del (id) {
            const self = this
            self.$confirm({
                title: '警告',
                content: '删除操作不可恢复，是否继续？',
                onOk () {
                    let ids = []
                    if (id < 0) {
                        ids = map(self.tableSelectRows, 'id')
                    } else {
                        ids = [id]
                    }
                    axios({
                        path: 'ProviderDelete',
                        method: 'POST',
                        body: { ids }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.del(ids)
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 表格多选
         * @msg:
         * @param {type}
         * @return:
         */
        onTableSelect (selectedRowKeys, selectedRows) {
            this.tableSelectRows = [...selectedRows]
        },
        /**
         * @name: 合同审核
         * @msg:
         * @param {type}
         * @return:
         */
        providerAudit (id) {
            const self = this
            this.$confirm({
                title: '警告',
                content: '审核后不可取消，是否继续？',
                onOk () {
                    axios({
                        path: 'ProviderAudit',
                        method: 'POST',
                        body: {
                            id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                                path: 'ProviderQueryProprietary'
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 合同确认
         * @msg:
         * @param {type}
         * @return:
         */
        providerAuditBegin (id) {
            const self = this
            this.$confirm({
                title: '警告',
                content: '确定确认合同？',
                onOk () {
                    axios({
                        path: 'ProviderAuditBegin',
                        method: 'POST',
                        body: {
                            id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                                path: 'ProviderQueryProprietary'
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 取消确认
         * @msg:
         * @param {type}
         * @return:
         */
        providerAuditCancel (id) {
            const self = this
            this.$confirm({
                title: '警告',
                content: '确定解除合同的确认状态？',
                onOk () {
                    axios({
                        path: 'ProviderAuditCancel',
                        method: 'POST',
                        body: {
                            id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            self.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                                path: 'ProviderQueryProprietary'
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 达标类型变化
         * @msg:
         * @param {type}
         * @return:
         */
        onTypeChange (value, type) {

        },
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
        }
    },
    watch: {
        month (val, oldval) {
            if (!val) {
                this.form.setFieldsValue({
                    rateReturnMonth: 0,
                    specialRateReturnMonth: 0
                })
            }
        },
        quarter (val, oldval) {
            if (!val) {
                this.form.setFieldsValue({
                    returnQuarterType: '',
                    returnQuarterAmount: 0,
                    rateReturnQuarter: 0,
                    specialRateReturnQuarter: 0
                })
            }
        },
        halfyear (val, oldval) {
            if (!val) {
                this.form.setFieldsValue({
                    returnHalfyearType: '',
                    returnHalfyearAmount: 0,
                    rateReturnHalfyear: 0,
                    specialRateReturnHalfyear: 0
                })
            }
        },
        '$store.state.app.pageName' (val) {
            if (val === 'selfOperatedContract') {
                // this.getSupplierAllList()
                this.getSignAddressList()
                this.getOrganizeCodeData()
                this.getReturnQuarterTypeArr()
                // this.getUsersArr()
                this.$refs.newTable.setTableData('a8d5001fe3f14e6da92251fde424348d:selfOperatedContract', {
                    path: 'ProviderQueryProprietary'
                })
            }
        }
    }
}
</script>

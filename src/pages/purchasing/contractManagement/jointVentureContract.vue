<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-06 16:05:34
 * @LastEditTime: 2019-08-27 18:40:31
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
      :pams="seachValue"
      :disContextMenu="disContextMenu"
      @onSelect="onTableSelect"
      @onContextmenuChange="onContextmenuChange">
    </NewTable>
    <bt-modal
      v-model="editVisible"
      title="联营合同"
      :loading="spinning"
      :submitLoading="subLoading"
      :submitClick="subClick"
      :tags="tags"
      :orderId="orderId"
      popconfirm>
      <template slot="footer">
        <a-button type="primary" @click="nextTickt(-1)" style="margin-left:10px;" :disabled="ActiveKey<2">上一步</a-button>
        <a-button type="primary" @click="nextTickt(1)" style="margin-left:10px;" :disabled="ActiveKey>6">下一步</a-button>
      </template>
      <div>
        <a-form :form="form">
          <a-tabs v-model="ActiveKey">
            <a-tab-pane tab="基础信息" :key="1">
              <a-row class="doc">
                <!-- <a-col :sm="8" :md="4" :xl="3">合同类型</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-select
                      style="width: 100%"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.businessType',{initialValue:'provider_contract_business_type:3'})"
                      :options="businessTypeList"
                      :disabled="isUpdate"/>
                  </a-form-item>
                </a-col> -->
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
                <!-- <a-col :sm="8" :md="4" :xl="3">组织机构</a-col>
                <a-col :sm="16" :md="8" :xl="5">
                  <a-form-item>
                    <a-tree-select
                      treeNodeFilterProp="title"
                      style="width: 100%"
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
                      placeholder="请检索签订人"
                      @search="handleSearchBuyBy"
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
                      :disabled="isUpdate"
                      :getPopupContainer="trigger => trigger.parentNode"
                      v-decorator="$check('contract.signAddress', {initialValue:$store.getters.storeInfo.code || ''})"
                      :options="signAddressList"
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
              </a-row>
            </a-tab-pane>
            <a-tab-pane tab="结算信息" :key="2" forceRender>
              <a-radio-group
                style="margin-left: 20px;margin-bottom: 20px;"
                :options="[{label:'销售倒扣',value:1},{label:'租金',value:2}]"
                v-model="caseModal"/>
              <collapseTransition>
                <a-row class="doc" v-show="caseModal==1">
                  <a-col :sm="8" :md="4" :xl="3"><span class="title">扣率</span></a-col>
                  <a-col :sm="16" :md="8" :xl="9">
                    <a-form-item>
                      <a-input-number
                        style="width: 100%"
                        :min="0"
                        :max="100"
                        :precision="2"
                        @focus="$event.currentTarget.select()"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        v-decorator="$check('contract.torqueRate',{initialValue:0})"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :sm="8" :md="4" :xl="3"><span class="title">是否分档</span></a-col>
                  <a-col :sm="16" :md="8" :xl="9">
                    <a-switch style="margin-left:20px" v-model="isGrade" @change="isGradeChange">
                      <a-icon type="check" slot="checkedChildren"/>
                      <a-icon type="close" slot="unCheckedChildren"/>
                    </a-switch>
                    <span v-if="isGrade" style="margin-left:10px;color:#888888;font-size:10px;">最少1级，最多10级</span>
                  </a-col>
                  <template v-if="isGrade">
                    <a-col :span="24" v-for="(item, index) in BinningList" :key="index">
                      <a-col :span="3"><span class="title">{{ index+1 }}级分档周期(月)</span></a-col>
                      <a-col :span="4" style="padding-right: 0;">
                        <a-input-number
                          style="width: 100%"
                          :precision="0"
                          :min="0"
                          :max="1200"
                          @blur="e=>{if(index!==0&&e.target.value<=BinningList[index-1].gradeMonth){return $message.error('分档周期必须大于上级分档周期')}}"
                          v-model="BinningList[index].gradeMonth"
                        />
                      </a-col>
                      <a-col :span="3"><span class="title">{{ index+1 }}级分档金额</span></a-col>
                      <a-col :span="4" style="padding-right: 0;">
                        <a-form-item>
                          <a-input-number
                            style="width: 100%"
                            :precision="2"
                            @focus="$event.currentTarget.select()"
                            @blur="e=>{if(index!==0&&e.target.value<=BinningList[index-1].gradeAmount){return $message.error('分档金额必须大于上级分档金额')}}"
                            :min="0"
                            :max="99999999"
                            v-model="BinningList[index].gradeAmount"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="3"><span class="title">{{ index+1 }}级分档扣率</span></a-col>
                      <a-col :span="4" style="padding-right: 0;">
                        <a-form-item>
                          <a-input-number
                            style="width: 100%"
                            :min="0"
                            :max="100"
                            :precision="2"
                            @focus="$event.currentTarget.select()"
                            :formatter="value => `${value}%`"
                            :parser="value => value.replace('%', '')"
                            v-model="BinningList[index].gradeRate"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="3" class="no-text" style="padding-right: 0;">
                        <a-row type="flex" justify="space-around" align="middle">
                          <a @click="BinningAdd(index)" :disabled="getBinningListLength>=10">增加</a>
                          <a @click="BinningDel(index)" :disabled="getBinningListLength<=1">删除</a>
                        </a-row>
                      </a-col>
                    </a-col>
                  </template>
                </a-row>
              </collapseTransition>
              <collapseTransition>
                <div v-show="caseModal==2">
                  <a-row class="doc">
                    <a-col :sm="8" :md="4" :xl="3"><span class="title">租金金额</span></a-col>
                    <a-col :sm="16" :md="8" :xl="9">
                      <a-form-item>
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="99999999"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          :step="1"
                          v-decorator="$check('contract.shareSales',{initialValue:0})"
                        />
                      </a-form-item>
                    </a-col>
                    <a-col :sm="8" :md="4" :xl="3"><span class="title">是否保底</span></a-col>
                    <a-col :sm="16" :md="8" :xl="9">
                      <a-radio-group
                        style="margin-left: 20px;"
                        v-model="isMinimum"
                        :options="[{label:'是',value:1},{label:'否',value:0}]"/>
                    </a-col>
                    <a-col :sm="8" :md="4" :xl="3"><span class="title">分摊到月</span></a-col>
                    <a-col :sm="16" :md="19" :xl="20" style="margin-bottom:10px;">
                      <a-col :span="21">
                        <a-form-item>
                          <a-select
                            mode="multiple"
                            v-decorator="$check('contract.month',{initialValue:[]})"
                            :options="filteredOptions"
                            @change="monthChange"
                            style="width: 100%"
                            allowClear/>
                        </a-form-item>
                      </a-col>
                      <a-col :span="3">
                        <a-button
                          style="height:100%;"
                          type="primary"
                          @click="changeMonthCase(-1)"
                          icon="edit">调整</a-button>
                      </a-col>
                    </a-col>
                  </a-row>
                  <a-row>
                    <a-col :span="1"></a-col>
                    <a-col :span="7" class="zoningPlan">
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">一级超保金额</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="99999999"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          :step="1"
                          :formatter="value => `￥${value}`"
                          :parser="value => value.replace('￥', '')"
                          v-model="gradeAmount[0]"
                          :disabled="!isMinimum"
                        />
                      </a-col>
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">一级超保扣率</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="100"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          :step="1"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          v-model="gradeRate[0]"
                          :disabled="!isMinimum"
                        />
                      </a-col>
                    </a-col>
                    <a-col :span="1" class="leftImg">
                      <img src="@/assets/hetong.png" alt="">
                    </a-col>
                    <a-col :span="7" class="zoningPlan">
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">二级超保金额</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="99999999"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          @blur="e=>{if(e.target.value.replace('￥', '')<gradeAmount[0] && Number(e.target.value.replace('￥', '')) !== 0){return $message.error('二级超保金额不能小于一级超保金额')}}"
                          :step="1"
                          :formatter="value => `￥${value}`"
                          :parser="value => value.replace('￥', '')"
                          v-model="gradeAmount[1]"
                          :disabled="!isMinimum"
                        />
                      </a-col>
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">二级超保扣率</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="100"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          :step="1"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          v-model="gradeRate[1]"
                          :disabled="!isMinimum"
                        />
                      </a-col>

                    </a-col>
                    <a-col :span="1" class="leftImg">
                      <img src="@/assets/hetong.png" alt="">
                    </a-col>
                    <a-col :span="7" class="zoningPlan">
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">三级超保金额</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="99999999"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          @blur="e=>{if(e.target.value.replace('￥', '')<gradeAmount[1] && Number(e.target.value.replace('￥', '')) !== 0){return $message.error('三级超保金额不能小于二级超保金额')}}"
                          :step="1"
                          :formatter="value => `￥${value}`"
                          :parser="value => value.replace('￥', '')"
                          v-model="gradeAmount[2]"
                          :disabled="!isMinimum"
                        />
                      </a-col>
                      <a-col :sm="8" :md="12" :xl="8"><span class="title">三级超保扣率</span></a-col>
                      <a-col :sm="16" :md="12" :xl="16">
                        <a-input-number
                          style="width:100%;"
                          :min="0"
                          :max="100"
                          :precision="2"
                          @focus="$event.currentTarget.select()"
                          :step="1"
                          :formatter="value => `${value}%`"
                          :parser="value => value.replace('%', '')"
                          v-model="gradeRate[2]"
                          :disabled="!isMinimum"
                        />
                      </a-col>
                    </a-col>
                    <!-- <a-col :sm="8" :md="3" :xl="3"><span class="title">一级超保周期(月)</span></a-col>
                    <a-col :sm="16" :md="5" :xl="5">
                      <a-input-number
                        style="width:100%;"
                        :precision="0"
                        :min="0"
                        :max="1200"
                        v-model="gradeMonth[0]"
                        :disabled="!isMinimum"
                      />
                    </a-col> -->
                    <!-- <a-col :sm="8" :md="3" :xl="3"><span class="title">二级超保周期(月)</span></a-col>
                    <a-col :sm="16" :md="5" :xl="5">
                      <a-input-number
                        style="width:100%;"
                        :precision="0"
                        @blur="e=>{if(e.target.value<gradeMonth[0]){return $message.error('二级超保周期不能小于一级超保周期')}}"
                        :min="0"
                        :max="1200"
                        v-model="gradeMonth[1]"
                        :disabled="!isMinimum"
                      />
                    </a-col> -->
                    <!-- <a-col :sm="8" :md="3" :xl="3"><span class="title">三级超保周期(月)</span></a-col>
                    <a-col :sm="16" :md="5" :xl="5">
                      <a-input-number
                        style="width:100%;"
                        :precision="0"
                        @blur="e=>{if(e.target.value<gradeMonth[1]){return $message.error('三级超保周期不能小于二级超保周期')}}"
                        :min="0"
                        :max="1200"
                        v-model="gradeMonth[2]"
                        :disabled="!isMinimum"
                      />
                    </a-col> -->
                  </a-row>
                  <a-row>
                    <span class="footerRight">(一级超保金额<二级超保金额<三级超保金额)</span>
                  </a-row>
                </div>
              </collapseTransition>
            </a-tab-pane>
            <a-tab-pane tab="费用明细" :key="3" forceRender>
              <a-row>
                <a-button class="categoryinfo-btn" @click="feeAdd" size="small">新增</a-button>
                <a-popconfirm title="是否确认删除?" @confirm="() => feeDelete(-1)">
                  <a-button size="small">删除</a-button>
                </a-popconfirm>
              </a-row>
              <a-table
                rowKey="key"
                :rowSelection="{selectedRowKeys: feeSelectedRowKeys, onChange: feeSelectChange}"
                :columns="feeColumns"
                :dataSource="feeData"
                :scroll="{x:750}"
                size="small"
                bordered>
                <template slot="feeRate" slot-scope="text">
                  <span class="text">{{ (Number(text)*100).toFixed(2) }}%</span>
                </template>
                <template slot="action" slot-scope="record">
                  <a-popconfirm title="是否确认删除?" @confirm="() => feeDelete(record.key)">
                    <a-button size="small">删除</a-button>
                  </a-popconfirm>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="品类品牌" :key="4">
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
            <a-tab-pane tab="生效机构" :key="5">
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
                :scroll="{x:800}"
                :pagination="{defaultPageSize:10, hideOnSinglePage: true}"
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
            <a-tab-pane tab="供货信息" :key="6">
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
                  <template v-for="col in ['skuDRate','stockPrice', 'skuPrice', 'skuPriceW', 'isPrice', 'isStock']" :slot="col" slot-scope="text, record">
                    <div :key="col">
                      <a-input-number
                        v-if="col === 'skuDRate'"
                        style="width:100%;"
                        :min="0"
                        :max="100"
                        :precision="2"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        :value="text"
                        @focus="$event.currentTarget.select()"
                        @change="e => InputChange(e, record.key, col)"
                        :disabled="isUpdate&&!record.isAdd" />
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
                      <a-select v-else-if="col === 'isStock'" :defaultValue="record.isStock" @change="e => InputChange(e, record.key, col)" :disabled="isUpdate&&!record.isAdd">
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="0">否</a-select-option>
                      </a-select>
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
            <a-tab-pane tab="附件" :key="7">
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
    <a-modal
      v-model="changeMonthCaseModal"
      title="调整分摊金额"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="500"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="changeMonthCase(0)">关闭</a-button>
        <a-button type="primary" @click="changeMonthCase(1)">确定</a-button>
      </template>
      <a-alert
        :message="`租金金额：￥${shareSales}，已分摊：￥${shareSalesSum}，未分摊：￥${shareSalesRemaining}`"
        :type="shareSalesRemaining==0 ? 'success':'error'"
        style="margin-bottom:10px;"
        showIcon/>
      <a-table
        rowKey="month"
        :columns="changeMonthColumns"
        :dataSource="changeMonthData"
        size="small"
        :scroll="{x:200}"
        :pagination="{defaultPageSize:20,hideOnSinglePage:true}"
        bordered>
        <template slot="shareSales" slot-scope="text, record">
          <a-input-number
            style="width:100%;"
            :min="0"
            :max="99999999"
            :precision="2"
            @focus="$event.currentTarget.select()"
            :step="1"
            :value="text"
            @change="e=>changeMonthCaseChange(e, record.month)"
          />
        </template>
        <template slot="note" slot-scope="text, record">
          <!-- <editTableInput :text="text" @change="e=>changeMonthCaseCellChange(record.month, 'note',e)"/> -->
          <a-textarea :autosize="{minRows: 1, maxRows: 3}" :value="text" @change="e=>changeMonthCaseCellChange(record.month, 'note',e.target.value)"/>
        </template>
      </a-table>
    </a-modal>
    <a-modal
      v-model="feeModal"
      title="新增费用明细"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="600"
      class="doc"
      destroyOnClose
      centered>
      <template slot="footer">
        <a-button key="back" @click="feeModalchange(0)">关闭</a-button>
        <a-button type="primary" @click="feeModalchange(1)">确定</a-button>
      </template>
      <a-form class="doc" :form="forma" style="border-left: none;">
        <a-row>
          <a-col :span="4"><span class="title">收取方式</span></a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                v-decorator="$check('contract.receiveMode',{initialValue:'provider_contract_sum_fee_receive_mode:1'})"
                :options="receiveModeOptions"
                :getPopupContainer="trigger => trigger.parentNode"
                style="width: 100%"
                @change="receiveModeOptionsFun"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4"><span class="title">费用类型</span></a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                v-decorator="$check('contract.feeType',{initialValue:''})"
                :getPopupContainer="trigger => trigger.parentNode"
                :options="feeTypeOptions"
                style="width: 100%"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4"><span class="title">费用金额</span></a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                :disabled="receiveFlag"
                style="width:100%;"
                :min="0"
                :max="99999999"
                :precision="2"
                @focus="$event.currentTarget.select()"
                :step="1"
                :formatter="value => `￥${value}`"
                :parser="value => value.replace('￥', '')"
                v-decorator="$check('contract.feeAmount',{initialValue:0})"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4"><span class="title">费用比率</span></a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input-number
                :disabled="!receiveFlag"
                style="width:100%;"
                :min="0"
                :max="100"
                :precision="2"
                @focus="$event.currentTarget.select()"
                :step="1"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                v-decorator="$check('contract.feeRate',{initialValue:0})"
              />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="4"><span class="title">备注</span></a-col> -->
          <a-col :span="24">
            <a-form-item>
              <a-textarea
                placeholder="请输入备注"
                style="width:100%;"
                v-decorator="$check('contract.note',{initialValue:''})"
                :autosize="{minRows: 5, maxRows: 5}"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
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
    .no-text{
        -moz-user-select: none;
        -o-user-select:none;
        -khtml-user-select:none;
        -webkit-user-select:none;
        -ms-user-select:none;
        user-select:none;
    }
    .leftImg{
        position: relative;
        display: inline-block;
        height: 140px;
    }
    .leftImg>img{
        width: 30px;
        height: 30px;
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        margin:auto;
    }
    .zoningPlan{
        border: 2px solid #eeeeee;
        border-radius: 5px;
        padding: 23px 5px 0 0;
    }
    .footerRight{
        font-size: 12px;
        color: red;
        float: right;
    }
</style>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import store from '@comp/BasicQuery/store'
import category from '@comp/BasicQuery/category'
import brand from '@comp/BasicQuery/brand'
import goods from '@comp/BasicQuery/goods'
import { axios } from '@/utils/request'
import editTableInput from './tools/input'
import BtModal from '@comp/Modal'
import Preview from '@pages/purchasing/contractManagement/preview/jointPreview'
import is from 'is_js'
import map from 'lodash.map'
import clonedeep from 'lodash.clonedeep'
import collapseTransition from '@comp/seachBox/transition'
import moment from 'moment'
import getStatus from '@comp/statusAll/getStatus'
import upload from '@comp/upload'
export default {
    name: 'JointVentureContract',
    components: {
        NewTable,
        SeachBox,
        editTableInput,
        store,
        category,
        brand,
        goods,
        collapseTransition,
        BtModal,
        Preview,
        upload
    },
    data: function () {
        return {
            form: this.$form.createForm(this),
            forma: this.$form.createForm(this),
            previewVisbel: false,
            isGrade: false,
            orderId: '',
            tags: [],
            BinningList: [],
            feeTypeOptions: [], // 费用类型选项
            receiveModeOptions: [], // 费用收取方式
            // businessTypeList: [], // 合同类型
            caseModal: 1,
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
            seachValue: {
                status: 'provider_contract_status:1'
            },
            classBrand: {},
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
                { name: '预览', action: 'jointVentureContract.get', fc: (row) => { this.providerQueryDetail(row) } },
                { name: '编辑', action: 'jointVentureContract.edit', fc: (row) => { this.providerEdit(row) } },
                { name: '变更', action: 'jointVentureContract.update', fc: (row) => { this.providerUpdate(row) } },
                { name: '删除', action: 'jointVentureContract.delete', fc: ({ id }) => { this.del(id) } },
                { name: '确认', action: 'jointVentureContract.confirm', fc: ({ id }) => { this.providerAuditBegin(id) } },
                { name: '取消', action: 'jointVentureContract.cancel', fc: ({ id }) => { this.providerAuditCancel(id) } },
                { name: '审核', action: 'jointVentureContract.verify', fc: ({ id }) => { this.providerAudit(id) } },
                { name: '终止', action: 'jointVentureContract.stop', fc: ({ id }) => { this.providerStop(id) } },
                { name: '复制', action: 'jointVentureContract.copy', fc: ({ id }) => { this.cloneProvider(id) } }
            ],
            isAdd: true,
            isUpdate: false,
            editVisible: false,
            changeMonthCaseModal: false,
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
                { title: '商品sku名称', dataIndex: 'skuName', width: 200 },
                { title: '品类编码', dataIndex: 'classCode', width: 100 },
                { title: '品类名称', dataIndex: 'className', width: 100 },
                { title: '品牌编码', dataIndex: 'brandCode', width: 100 },
                { title: '品牌名称', dataIndex: 'brandName', width: 100 },
                { title: '商品单位', dataIndex: 'skuUnit', width: 100 },
                { title: '规格型号', dataIndex: 'skuModel', width: 100 },
                { title: 'SKU属性', dataIndex: 'skuProperty', width: 100 },
                { title: '税率', dataIndex: 'skuTaxRates', width: 100 },
                { title: '扣率', dataIndex: 'skuDRate', width: 100, scopedSlots: { customRender: 'skuDRate' } },
                { title: '进货价', dataIndex: 'stockPrice', width: 100, scopedSlots: { customRender: 'stockPrice' } },
                { title: '零售价', dataIndex: 'skuPrice', width: 100, scopedSlots: { customRender: 'skuPrice' } },
                { title: '分销价', dataIndex: 'skuPriceW', width: 100, scopedSlots: { customRender: 'skuPriceW' } },
                { title: '限制价格', dataIndex: 'isPrice', width: 100, scopedSlots: { customRender: 'isPrice' } },
                { title: '是否管库存', dataIndex: 'isStock', width: 100, scopedSlots: { customRender: 'isStock' } },
                { title: '状态', dataIndex: 'statusName', width: 100 },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            monthArr: [
                { value: 1, title: 1 },
                { value: 2, title: 2 },
                { value: 3, title: 3 },
                { value: 4, title: 4 },
                { value: 5, title: 5 },
                { value: 6, title: 6 },
                { value: 7, title: 7 },
                { value: 8, title: 8 },
                { value: 9, title: 9 },
                { value: 10, title: 10 },
                { value: 11, title: 11 },
                { value: 12, title: 12 }
            ],
            changeMonthColumns: [
                { title: '财务月', dataIndex: 'monthName', width: 80 },
                { title: '分摊金额', dataIndex: 'shareSales', width: 80, scopedSlots: { customRender: 'shareSales' } },
                { title: '备注', dataIndex: 'note', width: 150, scopedSlots: { customRender: 'note' } }
            ],
            changeMonthData: [],
            selectedItems: [],
            supplyinfoData: [], // 供货信息
            supplyinfoSelectedRowKeys: [], // 供货信息
            categoryCodeCacheInfo: {}, // 缓存选择的品类，级联选品牌用
            tableSelectRows: [],
            contractID: {},
            feeModal: false, // 费用明细窗口
            feeSelectedRowKeys: [], // 费用明细多选缓存
            feeColumns: [
                { title: '收取方式', dataIndex: 'receiveModeName', width: 100 },
                { title: '费用类型', dataIndex: 'feeTypeName', width: 100 },
                { title: '金额', dataIndex: 'feeAmount', width: 100 },
                { title: '比率', dataIndex: 'feeRate', width: 100, scopedSlots: { customRender: 'feeRate' } },
                // { title: '收取状态', dataIndex: 'status', width: 100 },
                { title: '备注', dataIndex: 'note' },
                { title: '操作', key: 'operation', fixed: 'right', width: 100, scopedSlots: { customRender: 'action' } }
            ],
            feeData: [],
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
            fileList: [],
            fileType: ['PDF', 'EXCEL', 'IMG', 'PPT', 'TXT', 'WORD', 'RAR'],
            isMinimum: 0, // 是否保底
            // 是否已经调整
            isMonthChange: false,
            // 超保周期临时变量
            gradeAmount: [0, 0, 0],
            gradeMonth: [0, 0, 0],
            gradeRate: [0, 0, 0],
            averageCost: 0,
            shareSales: 0,
            receiveFlag: false,
            skuListId: []// 编辑时供货信息ID
        }
    },
    computed: {
        shareSalesRemaining () {
            const { sub } = this.$math
            return sub(this.shareSales, this.shareSalesSum)
        },
        shareSalesSum () {
            const sums = map(this.changeMonthData, 'shareSales')
            return sums.reduce(function (prev, cur) {
                return (Number(prev) + Number(cur)).toFixed(2)
            }, 0)
        },
        signDtDefaultValue () {
            return moment()
        },
        expiryDateDefaultValue () {
            return moment().add({ years: 1 }).subtract({ days: 1 })
        },
        isSubReady () {
            return this.supplyinfoData.length === 0
        },
        filteredOptions () {
            return this.monthArr.filter(o => is.not.inArray(o.value, this.selectedItems))
        },
        getBinningListLength () {
            return this.BinningList.length
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = '3f90c305af0546f9a5a20232293e28aa:jointVentureContract'
            this.tableApiPath = 'ProviderQuery'
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
        this.getFeeTypeOptions()
        this.getReceiveModeOptions()
    // this.getBusinessTypeList()
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
        /**
         * @name: 收取方式
         * @msg:
         * @param {type}
         * @return:
         */
        receiveModeOptionsFun (e) {
            console.log(e)
            if (e === 'provider_contract_sum_fee_receive_mode:4' || e === 'provider_contract_sum_fee_receive_mode:6') {
                this.receiveFlag = true
            } else {
                this.receiveFlag = false
            }
        },
        uploadFileList (data) {
            this.fileList = data
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
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 分档增加
         * @msg:
         * @param {type}
         * @return:
         */
        BinningAdd (index) {
            this.BinningList.splice(index + 1, 0, {
                gradeAmount: 0, gradeMonth: 0, gradeRate: 0
            })
        },
        /**
         * @name: 分档删除
         * @msg:
         * @param {type}
         * @return:
         */
        BinningDel (index) {
            this.BinningList.splice(index, 1)
        },
        /**
         * @name: 是否分档开关
         * @msg:
         * @param {type}
         * @return:
         */
        isGradeChange (e) {
            if (e) {
                this.BinningList = [{
                    gradeAmount: 0, gradeMonth: 0, gradeRate: 0
                }]
            } else {
                this.BinningList.length = 0
            }
        },
        /**
         * @name: 分摊表格的编辑处理
         * @msg:
         * @param {type}
         * @return:
         */
        changeMonthCaseCellChange (month, dataIndex, e) {
            const changeMonthData = [...this.changeMonthData]
            const target = changeMonthData.find(item => item.month === month)
            if (target) {
                target[dataIndex] = e
                this.changeMonthData = changeMonthData
            }
        },
        changeMonthCaseChange (e, month) {
            const changeMonthData = [...this.changeMonthData]
            const target = changeMonthData.find(item => item.month === month)
            if (target) {
                target.shareSales = e
                this.changeMonthData = changeMonthData
            }
        },
        feeModalchange (index) {
            if (index > 0) {
                const { forma: { validateFields } } = this
                validateFields((err, values) => {
                    if (!err) {
                        const feeTypeName = this.feeTypeOptions.find(o => o.value === values.feeType)['title']
                        const receiveModeName = this.receiveModeOptions.find(o => o.value === values.receiveMode)['title']
                        const key = this.feeData.length + 1
                        if (!this.receiveFlag) {
                            values.feeRate = 0
                            if (!values.feeAmount) {
                                return this.$message.warning('请输入费用金额！')
                            }
                        } else {
                            values.feeAmount = 0
                            if (!values.feeRate) {
                                return this.$message.warning('请输入费用比率！')
                            }
                        }
                        this.feeData.push({
                            key,
                            feeType: values.feeType,
                            receiveMode: values.receiveMode,
                            feeTypeName: feeTypeName,
                            receiveModeName: receiveModeName,
                            feeAmount: values.feeAmount,
                            feeRate: values.feeRate ? values.feeRate / 100 : 0,
                            note: values.note
                        })
                        console.log(this.feeData)
                        this.feeModal = false
                    } else {
                        this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                    }
                })
            } else {
                this.feeModal = false
            }
        },
        /**
         * @name: 调整分摊金额
         * @msg:
         * @param {type}
         * @return:
         */
        changeMonthCase (index) {
            if (index < 0) {
                const { shareSales } = this.form.getFieldsValue()
                if (shareSales <= 0) {
                    this.$message.error('填写租金金额之后才可调整金额')
                    return
                }
                if (this.selectedItems.length > 0) {
                    this.shareSales = shareSales
                    const data = []
                    if (this.changeMonthData.length === 0) {
                        const { div } = this.$math
                        this.averageCost = div(shareSales, this.selectedItems.length)
                        this.selectedItems.forEach(o => {
                            data.push({
                                monthName: `${o}月`,
                                month: o,
                                shareSales: this.averageCost
                            })
                        })
                        this.changeMonthData = [...data]
                    }
                    this.changeMonthCaseModal = true
                } else {
                    this.$message.error('选择分摊月份之后才可调整金额')
                }
            } else if (index > 0) {
                // eslint-disable-next-line
                if (this.shareSalesRemaining != 0) {
                    this.$message.error('已分摊金额和总金额不符')
                } else {
                    this.changeMonthCaseModal = false
                }
            } else {
                this.changeMonthCaseModal = false
            }
        },
        /**
         * @name: 合同复制
         * @msg:
         * @param {type}
         * @return:
         */
        cloneProvider (id) {
            const self = this
            self.$confirm({
                title: '提示',
                content: '是否复制合同？',
                onOk () {
                    self.providerEdit({ id }, true)
                },
                onCancel () {}
            })
        },
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
                            self.$refs.newTable.setTableData('24f3d653345f48c688db3ef7aa5e9772:jointVentureContract', {
                                path: 'ProviderQuery'
                            })
                        }
                    })
                },
                onCancel () {}
            })
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
         * @name: 合同编辑
         * @msg:
         * @param {type}
         * @return:
         */
        providerEdit (row, isAdd = false, isUpdate = false) {
            this.skuListId = []
            this.BinningList = []
            this.isGrade = false
            this.isMinimum = 0
            const id = row.id
            this.spinning = true
            this.isAdd = isAdd
            this.isUpdate = isUpdate
            this.isMonthChange = true
            if (!isAdd) {
                this.orderId = row.code
                if (row.status === 'provider_contract_status:1') { this.tags = ['unconfirm'] }
            }
            axios({
                path: 'ProviderQueryDetail',
                method: 'POST',
                body: { id }
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    this.editVisible = true
                    this.ActiveKey = 1
                    const { contract, provider, sumPool, skus, stores, classGrands, fees, files } = res.data
                    this.provider = provider
                    this.contractID.contractID = contract.id
                    this.contractID.providerId = provider.id
                    this.$nextTick(() => {
                        if (is.object(sumPool)) {
                            if (sumPool.sumType === '租金') {
                                this.contractID.sumPool2Id = sumPool.id
                                this.caseModal = 2
                                this.isMinimum = sumPool.isMinimum
                                const changeData = []
                                sumPool.poolPlan.forEach(o => {
                                    changeData.push({
                                        monthName: `${o.month}月`,
                                        month: o.month,
                                        shareSales: o.shareSales,
                                        note: o.note
                                    })
                                })
                                this.changeMonthData = [...changeData].sort((a, b) => { return a.month.toString() - b.month.toString() })
                                this.selectedItems = (map(this.changeMonthData, 'month'))
                                this.gradeMonth = []
                                this.gradeAmount = []
                                this.gradeRate = []
                                sumPool.poolMinimum.forEach(p => {
                                    this.gradeMonth[p.gradeNo - 1] = p.gradeMonth
                                    this.gradeAmount[p.gradeNo - 1] = p.gradeAmount
                                    this.gradeRate[p.gradeNo - 1] = p.gradeRate ? p.gradeRate * 100 : 0
                                })
                                this.form.setFieldsValue({
                                    shareSales: sumPool.rent,
                                    month: this.selectedItems
                                })
                            } else {
                                this.caseModal = 1
                                this.isGrade = sumPool.isGrade === 1
                                this.contractID.sumPool1Id = sumPool.id
                                this.form.setFieldsValue({
                                    torqueRate: sumPool.torqueRate ? sumPool.torqueRate * 100 : 0
                                })
                                sumPool.poolMinimum.forEach(p => {
                                    p.gradeRate = p.gradeRate ? p.gradeRate * 100 : 0
                                })
                                this.BinningList = [...sumPool.poolMinimum].sort((a, b) => { return a.gradeNo - b.gradeNo })
                            }
                        }
                        if (is.array(fees.fees)) {
                            fees.fees.forEach(f => {
                                f.key = f.id
                            })
                            this.feeData = [...fees.fees]
                        }
                        const skuList = skus.skuList
                        skuList.forEach(item => {
                            item.key = item.skuCode
                            item.skuTaxRates = this.rateTransform(item.skuTaxRate)
                            item.skuDRate = item.skuDRate ? item.skuDRate * 100 : 0
                        })
                        this.supplyinfoData = [...skuList]
                        const storesList = stores.stores
                        this.effectivescopeData = [...storesList]
                        const brandList = classGrands.brandList
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
                        brandList.forEach(b => {
                            b.key = `${b.classCode}${b.brandCode}`
                        })
                        this.categoryinfoData = [...brandList]
                        this.form.setFieldsValue({
                            providerContractName: contract.providerContractName,
                            supplierCode: `${provider.code}-${provider.name}`,
                            // organizeCode: contract.organizeCode,
                            effectDate: moment(contract.effectDate),
                            expiryDate: moment(contract.expiryDate),
                            signAddress: contract.signAddress,
                            signDt: moment(contract.signDt),
                            signBy: `${contract.signBy}-${contract.signName}`,
                            buyBy: `${contract.buyBy}-${contract.buyName}`,
                            businessType: contract.businessType,
                            note: contract.note
                        })
                    })
                }
            })
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
                        this.previewFootersB = res.data
                    }
                })
            }
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
                        skuDRate: g.skuDrate ? g.skuDrate * 100 : 0,
                        stockPrice: g.skuPtCost,
                        skuPtCost: g.skuPtCost,
                        skuPrice: g.skuPrice,
                        skuPriceW: g.skuPriceW,
                        isPrice: g.priceMin,
                        isStock: 0,
                        status: g.skuStatus,
                        statusName: g.skuStatusName,
                        mainSkuCode: g.goodsCode,
                        isAdd: true
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
        rateTransform (rate) {
            const { mul } = this.$math
            return mul(rate, 100) + '%'
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
                        classCode: this.categoryCodeCacheInfo.code,
                        className: this.categoryCodeCacheInfo.name,
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
                types: ['goods_type:2', 'goods_type:3', 'goods_type:4', 'goods_type:6'],
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
                const target = supplyinfoData.find(item => item.key === key)
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
         * @name: 合同费用明细删除
         * @msg:
         * @param {type}
         * @return:
         */
        feeDelete (key) {
            if (key === -1) {
                const feeData = [...this.feeData]
                this.feeData = feeData.filter(item => is.not.inArray(item.key, this.feeSelectedRowKeys))
            } else {
                const feeData = [...this.feeData]
                this.feeData = feeData.filter(item => item.key !== key)
            }
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
         * @name: 费用明细新增
         * @msg:
         * @param {type}
         * @return:
         */
        feeAdd () {
            this.feeModal = true
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
         * @name: 费用明细多选
         * @msg:
         * @param {type}
         * @return:
         */
        feeSelectChange (selectedRowKeys) {
            this.feeSelectedRowKeys = selectedRowKeys
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
            // eslint-disable-next-line
            if (this.caseModal !== 1 && Number(this.shareSalesRemaining) != 0) {
                this.ActiveKey = 2
                this.changeMonthCase(-1)
                return
            }
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    if (moment(values.effectDate).startOf('day') >= moment(values.expiryDate).startOf('day')) {
                        this.ActiveKey = 1
                        return this.$message.warning('失效时间不能小于生效时间')
                    }
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
                        businessType: 'provider_contract_business_type:2',
                        note: values.note
                    }
                    const poolMinimum = []
                    const sumPool1 = {}
                    const sumPool2 = {}
                    if (this.caseModal === 1) {
                        for (let i = 0; i < this.BinningList.length; i++) {
                            if (i !== 0) {
                                if (this.BinningList[i].gradeMonth <= this.BinningList[i - 1].gradeMonth || this.BinningList[i].gradeAmount <= this.BinningList[i - 1].gradeAmount) {
                                    this.ActiveKey = 2
                                    return this.$message.error('分档周期和分档金额必须大于上级分档周期和分档金额')
                                }
                            }
                            poolMinimum.push({
                                gradeNo: i + 1,
                                gradeMonth: this.BinningList[i].gradeMonth,
                                gradeAmount: this.BinningList[i].gradeAmount,
                                gradeRate: this.BinningList[i].gradeRate ? this.BinningList[i].gradeRate / 100 : 0
                            })
                        }
                        sumPool1.sumType = '销售倒扣'
                        sumPool1.torqueRate = values.torqueRate ? values.torqueRate / 100 : 0
                        sumPool1.isGrade = this.isGrade ? 1 : 0
                        sumPool1.poolMinimum = poolMinimum
                    } else {
                        for (let i = 0; i < this.gradeMonth.length; i++) {
                            if (i !== 0) {
                                if (this.gradeMonth[i] < this.gradeMonth[i - 1] || this.gradeAmount[i] < this.gradeAmount[i - 1]) {
                                    this.ActiveKey = 2
                                    if (this.gradeMonth[i] !== 0 || this.gradeAmount[i] !== 0) {
                                        return this.$message.error('超保周期和超保金额不能小于上级超保周期和超保金额')
                                    }
                                }
                            }
                            poolMinimum.push({
                                gradeNo: i + 1,
                                gradeMonth: this.gradeMonth[i],
                                gradeAmount: this.gradeAmount[i],
                                gradeRate: this.gradeRate[i] ? this.gradeRate[i] / 100 : 0
                            })
                        }
                        sumPool2.sumType = '租金'
                        sumPool2.rent = values.shareSales
                        sumPool2.isMinimum = this.isMinimum ? 1 : 0
                        sumPool2.isGrade = poolMinimum.length > 0 ? 1 : 0
                        sumPool2.poolPlan = [...this.changeMonthData]
                        sumPool2.poolMinimum = poolMinimum
                    }

                    const classGrands = { brandList: [...this.categoryinfoData] }
                    const stores = { stores: [...this.effectivescopeData] }
                    const skus = { skuList: clonedeep(this.supplyinfoData) }
                    for (const item of skus.skuList) {
                        if (Number(item.stockPrice) === 0) {
                            return this.$message.error(`商品${item.skuName}的进货价格不能为0,请输入!`)
                        }
                        if (Number(item.skuPrice) === 0) {
                            return this.$message.error(`商品${item.skuName}的零售价格不能为0,请输入!`)
                        }
                        if (Number(item.skuPriceW) === 0) {
                            return this.$message.error(`商品${item.skuName}的分销价格不能为0,请输入!`)
                        }
                        item.skuDRate = item.skuDRate ? item.skuDRate / 100 : 0
                        // if (Number(item.isPrice) === 0) {
                        //     return this.$message.error(`商品${item.skuName}的限制价格不能为0,请输入!`)
                        // }
                    }
                    const fees = { fees: [...this.feeData] }
                    const fileList = this.fileList.map(x => x.fileUrl)
                    const files = fileList.join(',')
                    if (!this.isAdd) {
                        contract.id = this.contractID.contractID
                        this.provider.id = this.contractID.providerId
                    }
                    const body = {
                        contract,
                        fees,
                        classGrands,
                        stores,
                        skus,
                        files,
                        provider: this.provider
                    }
                    if (this.caseModal === 1) {
                        if (!this.isAdd) {
                            sumPool1.id = this.contractID.sumPool1Id
                        }
                        body.sumPool = sumPool1
                    } else {
                        if (!this.isAdd) {
                            sumPool2.id = this.contractID.sumPool2Id
                        }
                        body.sumPool = sumPool2
                    }
                    this.subLoading = true
                    axios({
                        path: this.isAdd ? 'ProviderAdd' : (this.isUpdate ? 'ProviderUpdateAudit' : 'ProviderUpdate'),
                        method: 'POST',
                        body
                    }).then(res => {
                        this.subLoading = false
                        if (res.flag === 1) {
                            this.editVisible = false
                            this.$refs.newTable.setTableData('f51e035a6dc94cbba4f5df1259635e41:SelfOperatedContract', {
                                path: 'ProviderQuery'
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
            if (e === 'add') {
                this.orderId = ''
                this.tags.length = 0
                this.isAdd = true
                this.editVisible = true
                this.isUpdate = false
                this.month = false
                this.quarter = false
                this.halfyear = false
                this.categoryinfoData.length = 0
                this.effectivescopeData.length = 0
                this.supplyinfoData.length = 0
                this.feeData.length = 0
                this.ActiveKey = 1
                this.provider = {}
                this.contractID = {}
                this.caseModal = 1
                this.isGrade = false
                this.isMinimum = 0
                this.isMonthChange = false
                this.BinningList.length = 0
                this.selectedItems.length = 0
                this.changeMonthData.length = 0
                this.shareSales = 0
                this.gradeAmount = [0, 0, 0]
                this.gradeMonth = [0, 0, 0]
                this.gradeRate = [0, 0, 0]
                this.monthArr = [
                    { value: 1, title: 1 },
                    { value: 2, title: 2 },
                    { value: 3, title: 3 },
                    { value: 4, title: 4 },
                    { value: 5, title: 5 },
                    { value: 6, title: 6 },
                    { value: 7, title: 7 },
                    { value: 8, title: 8 },
                    { value: 9, title: 9 },
                    { value: 10, title: 10 },
                    { value: 11, title: 11 },
                    { value: 12, title: 12 }
                ]
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
                this.$refs.newTable.exportFile('ProviderQuery', this.seachValue)
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
                this.disContextMenu = ['变更', '审核', '取消', '终止', '复制']
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
            e.path = 'ProviderQuery'
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
        nextTickt (step) {
            if (step > 0) {
                if (this.ActiveKey < 7) this.ActiveKey++
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
                            self.$refs.newTable.setTableData('24f3d653345f48c688db3ef7aa5e9772:jointVentureContract', {
                                path: 'ProviderQuery'
                            })
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
                            self.$refs.newTable.setTableData('24f3d653345f48c688db3ef7aa5e9772:jointVentureContract', {
                                path: 'ProviderQuery'
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
                            self.$refs.newTable.setTableData('24f3d653345f48c688db3ef7aa5e9772:jointVentureContract', {
                                path: 'ProviderQuery'
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
                            self.$refs.newTable.setTableData('24f3d653345f48c688db3ef7aa5e9772:jointVentureContract', {
                                path: 'ProviderQuery'
                            })
                        }
                    })
                },
                onCancel () {}
            })
        },
        /**
         * @name: 获取费用类型选项
         * @msg:
         * @param {type}
         * @return:
         */
        getFeeTypeOptions () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: { type: 'provider_contract_sum_fee_type' }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.feeTypeOptions = data
                }
            })
        },
        /**
         * @name: 获取费用收取方式
         * @msg:
         * @param {type}
         * @return:
         */
        getReceiveModeOptions () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: { type: 'provider_contract_sum_fee_receive_mode' }
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    console.log(data, '获取费用收取方式')
                    data.forEach(i => {
                        i.key = i.code
                        i.title = i.value
                        i.value = `${i.type}:${i.configKey}`
                    })
                    this.receiveModeOptions = data
                }
            })
        },
        // getBusinessTypeList () {
        //     axios({
        //         path: 'OrganizationConfigFindByType',
        //         method: 'post',
        //         body: { type: 'provider_contract_business_type' }
        //     }).then(res => {
        //         if (res.flag === 1) {
        //             const data = res.data
        //             data.forEach(i => {
        //                 i.key = i.code
        //                 i.title = i.value
        //                 i.value = `${i.type}:${i.configKey}`
        //             })
        //             this.businessTypeList = data.filter(o => o.value !== 'provider_contract_business_type:1')
        //         }
        //     })
        // },
        /**
         * @name: 财务月
         * @msg:
         * @param {type}
         * @return:
         */
        monthChange (selectedItems) {
            this.selectedItems = selectedItems.sort((a, b) => { return a.toString() - b.toString() })
            this.isMonthChange = false
        },
        /**
         * @name: 达标类型变化
         * @msg:
         * @param {type}
         * @return:
         */
        onTypeChange (value, type) {

        }
    },
    watch: {
        selectedItems (val, oldval) {
            if (val.length > 0 && !this.isMonthChange) {
                const { shareSales } = this.form.getFieldsValue()
                this.shareSales = shareSales
                if (shareSales <= 0) {
                    this.$message.error('请填写租金金额')
                    return
                }
                const data = []
                const { div } = this.$math
                this.averageCost = div(shareSales, this.selectedItems.length)
                this.selectedItems.forEach(o => {
                    data.push({
                        monthName: `${o}月`,
                        month: o,
                        shareSales: this.averageCost
                    })
                })
                this.changeMonthData = [...data]
            }
        },
        // month (val, oldval) {
        //     if (!val) {
        //         this.form.setFieldsValue({
        //             rateReturnMonth: 0,
        //             specialRateReturnMonth: 0
        //         })
        //     }
        // },
        // quarter (val, oldval) {
        //     if (!val) {
        //         this.form.setFieldsValue({
        //             returnQuarterType: '',
        //             returnQuarterAmount: 0,
        //             rateReturnQuarter: 0,
        //             specialRateReturnQuarter: 0
        //         })
        //     }
        // },
        // halfyear (val, oldval) {
        //     if (!val) {
        //         this.form.setFieldsValue({
        //             returnHalfyearType: '',
        //             returnHalfyearAmount: 0,
        //             rateReturnHalfyear: 0,
        //             specialRateReturnHalfyear: 0
        //         })
        //     }
        // },
        isMinimum (val, oldval) {
            if (!val) {
                this.gradeAmount = [0, 0, 0]
                this.gradeMonth = [0, 0, 0]
                this.gradeRate = [0, 0, 0]
            }
        },
        '$store.state.app.pageName' (val) {
            if (val === 'jointVentureContract') {
                // this.getSupplierAllList()
                this.getSignAddressList()
                this.getOrganizeCodeData()
                this.getReturnQuarterTypeArr()
                // this.getUsersArr()
                this.getFeeTypeOptions()
                this.getReceiveModeOptions()
                // this.getBusinessTypeList()
            }
        }
    }
}
</script>

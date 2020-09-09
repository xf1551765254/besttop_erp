<!--
 * @Description: 顾客信息
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-21 16:19:44
 * @LastEditors: lin
 * @LastEditTime: 2019-08-28 14:41:06
 -->
<template>
  <div>
    <Preview
      v-model="previewVisbel"
      title="顾客信息"
      :headers="previewHeaders"
      :content="previewContent" >
      <div slot="A" title="其他信息">
        <a-row>
          <a-col :sm="8" :md="4" :xl="3">学历：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewFooters.education }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">收入：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewFooters.income }}</a-col>
          <a-col :sm="8" :md="4" :xl="3">职位：</a-col>
          <a-col :sm="16" :md="8" :xl="5"> {{ previewFooters.position }}</a-col>
        </a-row>
      </div>
      <div slot="B" title="账户信息">
        <a-tabs defaultActiveKey="1" @change="callTabsBack">
          <a-tab-pane tab="储值账户" key="1">
            <div v-if="StoredValueArr.length===0">
              <span style="text-align:center;color:#C0C4CC;font-size:14px;display:block">暂无数据</span>
            </div>
            <div v-else>
              <div class="heard">
                <div :class="['tabsCententFirst',{'tabsCententFirstColor':classCardChaseI===index}]" v-for="(item,index) in StoredValueArr" :key="index">
                  <div @click="switchCard(item,index)">
                    <a-row>
                      <a-col :span="12">
                        <div class="tabsCententType" style="vertical-align:top;margin-top:2px"><a-icon type="credit-card" theme="filled" style="font-size:20px"/></div>
                        <div class="tabsCententType" style="margin-left:10px">
                          <div>{{ item.typeName }}</div>
                          <div>{{ item.cardNo }}</div>
                        </div>
                      </a-col>
                      <a-col :span="12" style="text-align:right">
                        <div style="font-size:18px">￥:{{ item.amount }}</div>
                        <div style="font-size:4px">剩余金额</div>
                      </a-col>
                    </a-row>
                    <div class="cententTabBootm">有效期：{{ item.expiryDate }}</div>
                  </div>
                </div>
              </div>
              <div class="bottom">
                <a-spin :spinning="transactionSpin">
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <div>充值记录</div>
                      <div class="bottomContent">
                        <a-card v-if="StoredValueArrTopUp.length===0">
                          <span style="text-align:center;color:#C0C4CC;font-size:14px;display:block">暂无数据</span>
                        </a-card>
                        <a-card v-else :bodyStyle="{padding:'10px'}" class="card" v-for="(item,index) in StoredValueArrTopUp" :key="index" >
                          <a-row type="flex" justify="space-between">
                            <a-col :span="12">充值金额</a-col >
                            <a-col :span="12" style="text-align:right">{{ item.totalAmount }}</a-col >
                          </a-row>
                          <a-row type="flex" justify="space-between">
                            <a-col :span="12">充值时间</a-col >
                            <a-col :span="12" style="text-align:right">{{ item.createTime }}</a-col >
                          </a-row>
                        </a-card>
                      </div>
                    </a-col>
                    <a-col :span="12">
                      <div>消费记录</div>
                      <div class="bottomContent">
                        <a-card v-if="StoredValueArrConsumption.length===0">
                          <span style="text-align:center;color:#C0C4CC;font-size:14px;display:block">暂无数据</span>
                        </a-card>
                        <a-card v-else :bodyStyle="{padding:'10px'}" class="card" v-for="(item,index) in StoredValueArrConsumption" :key="index">
                          <a-row type="flex" justify="space-between">
                            <a-col :span="12">使用金额</a-col >
                            <a-col :span="12" style="text-align:right">{{ item.payAmount }}</a-col >
                          </a-row>
                          <a-row type="flex" justify="space-between">
                            <a-col :span="12">使用时间</a-col >
                            <a-col :span="12" style="text-align:right">{{ item.createTime }}</a-col >
                          </a-row>
                          <a-row type="flex" justify="space-between">
                            <a-col :span="5">购买商品</a-col >
                            <a-col :span="19" style="text-align:right">
                              <div v-for="(i,key) in item.detailList" :key="key">
                                <span>{{ `${i.skuCode}-${i.skuName} ` }}</span>
                                <span style="margin-left:5px">{{ `X${i.quantity}` }}</span>
                              </div>
                            </a-col >
                          </a-row>
                        </a-card>
                      </div>
                    </a-col>
                  </a-row>
                </a-spin>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="电子币账户" key="2" forceRender>
            <a-spin :spinning="transactionSpin">
              <a-table
                rowKey="id"
                :columns="columnsTow"
                :dataSource="dataSourceTow"
                :pagination="false"
                size="small"
                bordered>
                <template slot="action" slot-scope="text, record, index">
                  <div class="editable-row-operations">
                    <a-row :gutter="4">
                      <a-col :span="12">
                        <a-popover trigger="click" >
                          <template slot="content">
                            <div>流水号：{{ record.payNumber }}</div>
                            <div>
                              <span>商品：
                                <div style="padding-left:20px" v-for="(item,key) in record.logs" :key="key">
                                  <span>{{ `${item.skuCode}-${item.skuName}-${item.skuModel}` }}</span>
                                  <span style="margin-left:10px">{{ `x${item.quantity}` }}</span>
                                </div>
                              </span>
                            </div>
                          </template>
                          <a>获得详情</a>
                        </a-popover>
                      </a-col>
                      <a-col :span="12"><a @click="getCoinDetain(record)">使用详情</a></a-col>
                    </a-row>
                  </div>
                </template>
              </a-table>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane tab="服务券" key="3" forceRender>
            <a-spin :spinning="transactionSpin">
              <a-table
                rowKey="id"
                :columns="columnsThree"
                :dataSource="dataSourceThree"
                :pagination="false"
                size="small"
                bordered></a-table>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane tab="定金" key="4">
            <a-spin :spinning="transactionSpin">
              <a-table
                rowKey="id"
                :columns="columnsFour"
                :dataSource="dataSourceFour"
                :pagination="false"
                size="small"
                bordered></a-table>
            </a-spin>
          </a-tab-pane>
        </a-tabs>
        <!-- 电子币使用详情 -->
        <a-modal
          :visible="coinDetailModal"
          title="使用详情"
          :closable="false"
          :keyboard="false"
          :maskClosable="false"
          :width="this.$store.getters.windowWidth * 0.6"
          destroyOnClose
          centered >
          <template slot="footer">
            <a-button key="submit" type="primary" @click="coinDetailModal=false">关闭</a-button>
          </template>
          <a-spin :spinning="transactionSpin">
            <a-table
              rowKey="id"
              :columns="columnsCoinDetail"
              :dataSource="dataSourceCoinDetail"
              :pagination="false"
              size="small"
              bordered></a-table>
          </a-spin>
        </a-modal>
      </div>

      <div slot="footer">
        <a-row>
          <a-col :sm="8" :md="4" :xl="2">推荐人：</a-col>
          <a-col :sm="16" :md="8" :xl="4"> {{ previewFooters.guider }}</a-col>
          <a-col :sm="8" :md="4" :xl="2">顾客来源：</a-col>
          <a-col :sm="16" :md="8" :xl="4"> {{ previewFooters.originateName }}</a-col>
          <a-col :sm="8" :md="4" :xl="2">来源机构：</a-col>
          <a-col :sm="16" :md="8" :xl="4"> {{ previewFooters.sourceStoreCodeName }}</a-col>
          <a-col :sm="8" :md="4" :xl="2">录入时间：</a-col>
          <a-col :sm="16" :md="8" :xl="4"> {{ previewFooters.createTime }}</a-col>
        </a-row>
      </div>
    </Preview>
  </div>
</template>
<script>
import Preview from '@comp/Modal/preview'
import { axios } from '@/utils/request'
export default {
    components: { Preview },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        orderId: {
            type: String,
            default: ''
        },
        orderCode: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            previewVisbel: false,
            previewFooters: {},
            previewContent: {},
            // 基础信息
            previewHeaders: [
                { key: 'name', name: '顾客姓名' },
                { key: 'telephone', name: '手机号' },
                { key: 'sex', name: '性别' },
                { key: 'idCard', name: '身份证号' },
                { key: 'addressDetail', name: '详细地址' }
            ],
            transactionSpin: false,
            // 储值账户
            classCardChaseI: 0,
            StoredValueArr: [],
            StoredValueArrTopUp: [],
            StoredValueArrConsumption: [],
            // 电子币
            columnsTow: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '电子币类型', dataIndex: 'scheduleRuleDefineName', align: 'center' },
                { title: '获得电子币', dataIndex: 'coinAmount', align: 'center' },
                { title: '获得方式', dataIndex: 'originate', align: 'center' },
                { title: '获得时间', dataIndex: 'createTime', align: 'center' },
                { title: '截至日期', dataIndex: 'expireDate', align: 'center' },
                { title: '备注', dataIndex: 'note', align: 'center' },
                { title: '操作', key: 'operation', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            dataSourceTow: [],
            coinDetailModal: false,
            columnsCoinDetail: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '使用额度', dataIndex: 'payAmount', align: 'center' },
                { title: '使用时间', dataIndex: 'createTime', align: 'center' },
                { title: '流水号', dataIndex: 'payNumber', align: 'center' },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center' },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center' },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center' },
                { title: '数量', dataIndex: 'quantity', align: 'center' }
            ],
            dataSourceCoinDetail: [],
            // 服务券
            columnsThree: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '服务编码', dataIndex: 'scheduleServiceDefineCode', align: 'center' },
                { title: '服务名称', dataIndex: 'serviceName', align: 'center' },
                { title: '服务状态', dataIndex: 'statusName', align: 'center' },
                { title: '服务生效日期', dataIndex: 'effectDate', align: 'center' },
                { title: '服务失效日期', dataIndex: 'expireDate', align: 'center' },
                { title: '服务申请时间', dataIndex: 'createTime', align: 'center' },
                { title: '服务完成时间', dataIndex: 'updateTime', align: 'center' }
            ],
            dataSourceThree: [],
            // 定金
            columnsFour: [
                { title: '序号', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '流水号', dataIndex: 'payNumber', align: 'center' },
                { title: '操作位置', dataIndex: 'storeCode', align: 'center' },
                { title: '操作人员', dataIndex: 'createBy', align: 'center' },
                { title: '定金', dataIndex: 'shouldAmount', align: 'center' },
                { title: '定金支付时间', dataIndex: 'createTime', align: 'center' }
            ],
            dataSourceFour: []
        }
    },
    methods: {
        detailsSumbit () {
            axios({
                path: 'CustomerUserGetCustomer',
                method: 'post',
                body: {
                    id: this.orderId
                }
            }).then(res => {
                if (res.flag === 1) {
                    const detailData = res.data
                    this.previewContent.headers = {
                        name: detailData.name,
                        telephone: detailData.telephone,
                        sex: detailData.sex ? '男' : '女',
                        idCard: detailData.idCard,
                        addressDetail: detailData.name
                    }
                    this.previewFooters = {
                        education: detailData.education,
                        income: detailData.income,
                        position: detailData.position,
                        originateName: detailData.originateName,
                        sourceStoreCodeName: detailData.sourceStoreCodeName,
                        guider: detailData.guider ? `${detailData.guider} - ${detailData.guiderName}` : '',
                        createTime: detailData.createTime
                    }
                }
                this.previewVisbel = true
                this.getStoredValueData()
            })
        },
        callTabsBack (value) {
            if (value === '4') {
                this.getDeposit()
            } else if (value === '2') {
                this.getCoinTableData()
            } else if (value === '3') {
                this.getServiceVoucher()
            } else if (value === '1') {
                this.getStoredValueData()
            }
        },
        /**
         * @name: 电子币
         */
        getCoinTableData () {
            this.transactionSpin = true
            axios({
                path: 'CustomerCoinQueryTotalByCustomer',
                method: 'post',
                body: {
                    customerCode: this.orderCode
                }
            }).then(res => {
                this.transactionSpin = false
                if (res.flag === 1) {
                    this.dataSourceTow = [...res.data.customerScheduleCoinVos]
                }
            })
        },
        /**
         * @name: 服务券
         */
        getServiceVoucher () {
            this.transactionSpin = true
            axios({
                path: 'CustomerServiceQueryServiceList',
                method: 'post',
                body: {
                    customerCode: this.orderCode
                }
            }).then(res => {
                this.transactionSpin = false
                if (res.flag === 1) {
                    this.dataSourceThree = [...res.data]
                }
            })
        },
        /**
         * @name: 订金
         */
        getDeposit () {
            this.transactionSpin = true
            axios({
                path: 'CustomerDepositQueryListByCustomerCode',
                method: 'post',
                body: {
                    customerCode: this.orderCode
                }
            }).then(res => {
                this.transactionSpin = false
                if (res.flag === 1) {
                    this.dataSourceFour = [...res.data]
                }
            })
        },
        /**
         * @name: 电子币详情
         */
        getCoinDetain (row) {
            this.coinDetailModal = true
            this.transactionSpin = true
            axios({
                path: 'CustomerCoinQueryUseLogByCode',
                method: 'post',
                body: {
                    id: row.id,
                    type: '1'
                }
            }).then(res => {
                this.transactionSpin = false
                if (res.flag === 1) {
                    this.dataSourceCoinDetail = [...res.data]
                }
            })
        },
        /**
         * @name: 储值账户 的储值卡
         */
        getStoredValueData () {
            axios({
                path: 'CardMakeQueryCustomerCardsAndRecords',
                method: 'post',
                body: {
                    customerCode: this.orderCode
                }
            }).then(res => {
                if (res.flag === 1) {
                    const obj = { ...res.data }
                    this.StoredValueArr = [...obj.customerCardVos]
                    this.StoredValueArrTopUp = [...obj.evaluationRecord]
                    this.StoredValueArrConsumption = [...obj.cardTradeRecords]
                }
            })
        },
        /**
         * @name: 切换储值卡片
         */
        switchCard (row, key) {
            this.classCardChaseI = key
            this.transactionSpin = true
            axios({
                path: 'CardMakeQueryCardsRecords',
                method: 'most',
                body: {
                    typeName: row.typeName,
                    cardNo: row.cardNo
                }
            }).then(res => {
                this.transactionSpin = false
                if (res.flag === 1) {
                    const obj = { ...res.data }
                    this.StoredValueArrTopUp = [...obj.evaluationRecord]
                    this.StoredValueArrConsumption = [...obj.cardTradeRecords]
                }
            })
        }
    },
    watch: {
        value (val) {
            if (val) {
                this.detailsSumbit()
            }
        },
        previewVisbel (val) {
            this.$emit('input', val)
        }
    }
}
</script>
<style lang="less" scoped>
.heard{
  zoom: 1;
  .tabsCententFirst{
    border: 1px solid #e8e8e8;
    padding:10px;
    width:calc(100%/3 - 10px);
    margin-bottom: calc(10px*3 /2);
    float: left;
    margin-right: calc(10px*3 /2);
    height: 100px;
    background:#F2F6FC;
    border-radius: 4px;
    .tabsCententType{
      display: inline-block;
    }
    .cententTabBootm{
      border-top:1px solid #ccc;
      text-align: right;
      font-size: 14px;
      margin-top:20px;
    }
  }
  .tabsCententFirstColor{
    background:#e8e8e8;
    border:1px solid #ccc;
  }
  .tabsCententFirst:nth-child(3){
    margin-right: 0;
  }
}
.heard:after{
  display: block;
  clear: both;
  content:'';
}
.bottom{
  .bottomContent{
    margin-top:5px;
    border:1px solid  #e8e8e8;
    padding: 15px;
    .ant-card{
      width: 100%;
      margin-bottom: 10px;
    }
    .ant-card:last-child{
      margin-bottom: 0px;
    }
  }
}
</style>

<!--
 * @Description: 退/换货管理
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-05-27 09:25:26
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-19 19:07:58
 -->
<template>
  <div class="returnHandling" :style="{height:windowHeight-150+'px'}">
    <!-- 顶部工具栏 -->
    <seachBox
      :conditions="conditions"
      v-model="seachValue"
      @onReload="onReload"
      @onSeach="onSeach">
      <a-button type="primary" @click="handleAdd('新增')" size="small">申请退/换货</a-button>
    </seachbox>
    <!-- 退换货管理列表 -->
    <div class="list-box">
      <a-tabs @change="callback" v-model="activeKey">
        <a-tab-pane :tab="`待审核(${notTotal})`" key="1">
          <a-card v-for="(item,index) in returnList" :key="index">
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="header-text">
                <span>单号：{{ item.applyMain.code }}</span>
                <span>{{ item.applyMain.createTime }}</span>
                <span>导购：{{ item.applyMain.guideName }}</span>
                <span>顾客：{{ item.applyMain.customerName }}</span>
              </div>
              <div class="header-btn">
                <a-button type="primary" @click="handleDetails('详情',item.applyMain.code)" size="small">详情</a-button>
                <a-button type="primary" @click="handleDele(item.applyMain.code)" size="small">删除</a-button>
                <a-button type="primary" @click="handleaudit(item.applyMain.code)" size="small">审核</a-button>
                <a-button type="primary" @click="handleEidte('编辑',item.applyMain.code)" size="small">编辑</a-button>
                <span class="trigon"><span>{{ item.applyMain.typeName }}</span></span>
              </div>
            </div>
            <!-- 卡片内容 -->
            <div class="card-content" >
              <a-row class="order" v-for="(el,eli) in item.applyDetail" :key="eli">
                <a-col :span="12" class="order-left">
                  <p>销售单号：{{ el.sourceCode }}</p>
                  <div>
                    <img :src="el.picture" height="90" width="90">
                    <div class="order-info">
                      <p>
                        <span>{{ el.skuName }}</span>
                        <span>{{ el.skuCode }}</span>
                      </p>
                      <p>
                        <span>{{ el.skuModel }}</span>
                        <span>x{{ el.quantity }}</span>
                      </p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="6" class="order-right">
                  <p>收货人：{{ el.consigneeTelephone }}</p>
                  <p>地址：{{ el.consigneeAddressDetail }}</p>
                  <p>销售店：{{ ` ${el.saleStoreCode}-${el.saleStoreName}` }}</p>
                  <p> <span>提货方式：{{ `${el.stockOutName}` }}</span> <span style="margin-left:20px">提货位置：{{ ` ${el.pickStoreCode}-${el.pickStoreName}` }}</span> </p>
                  <p>申请原因： {{ el.applyReasonName }}</p>
                </a-col>

              </a-row>
            </div>
          </a-card>
        </a-tab-pane>
        <a-tab-pane :tab="`已审核(${thenTotal})`" key="2">
          <a-card v-for="(item,index) in returnList" :key="index">
            <!-- 卡片头部 -->
            <div class="card-header" >
              <div class="header-text">
                <span>单号：{{ item.applyMain.code }}</span>
                <span>{{ item.applyMain.createTime }}</span>
                <span>导购：{{ item.applyMain.guideName }}</span>
                <span>顾客：{{ item.applyMain.customerName }}</span>
              </div>
              <div class="header-btn">
                <a-button type="primary" @click="handleDetails('详情',item.applyMain.code)" size="small">详情</a-button>
                <span class="trigon"><span>{{ item.applyMain.typeName }}</span></span>
              </div>
            </div>
            <!-- 卡片内容 -->
            <div class="card-content" >
              <a-row class="order" v-for="(el,eli) in item.applyDetail" :key="eli">
                <a-col :span="12" class="order-left">
                  <p>销售单号：{{ el.customerCode }}</p>
                  <div>
                    <img :src="el.picture" height="90" width="90">
                    <div class="order-info">
                      <p>
                        <span>{{ el.skuName }}</span>
                        <span>{{ el.skuCode }}</span>
                      </p>
                      <p>
                        <span>{{ el.skuModel }}</span>
                        <span>x{{ el.quantity }}</span>
                      </p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="12" class="order-right">
                  <p>收货人：{{ el.consigneeName }}</p>
                  <p>地址：{{ el.consigneeAddressDetail }}</p>
                  <p>申请原因： {{ el.applyReasonName }}</p>
                  <!-- <p class="order-right" v-if="activeKey==='2'" > -->
                  <a-button type="primary" size="small" style="float:right" @click="getLogistics(item.applyMain.code ,item.applyMain.storeCode)">查看物流</a-button>
                  <!-- </p> -->
                </a-col>
                <!-- <a-col :span="6" class="order-right" >
                </a-col> -->
              </a-row>
            </div>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 申请退换货 -->
    <bt-modal
      v-model="refundVisible"
      :title="handleTitle"
      :submitClick="handleSubmit"
      :popconfirm="false"
      :loading="loading"
      :class="{model:isDelatis===0}"
    >
      <Handle :isDelatis="isDelatis" :returnData.sync="returnData"></Handle>
    </bt-modal>
    <a-modal
      title="物流信息"
      :width="900"
      :visible="visible"
    >
      <div class="logistics">
        <a-tabs :defaultActiveKey="0" :tabPosition="'left'" :style="{ height: '500px'}" @prevClick="callback" @nextClick="callback">
          <a-tab-pane :tab="`物流单号${el.code}`" :key="index" v-for="(el,index) in logistics">
            <a-timeline>
              <a-timeline-item :color="index===el.logs.length-1?'red':''" v-for="(logs,index) in el.logs" :key="logs.id">
                <p>{{ logs.happenType }}</p>
                <div>
                  <span>{{ logs.createName }}</span>
                  <span>{{ logs.createTime }}</span>
                  <span>{{ logs.note }}</span>
                </div>
              </a-timeline-item>

            </a-timeline>
          </a-tab-pane>

        </a-tabs>
      </div>
      <template slot="footer">
        <a-button key="back" @click="visible=false">关闭</a-button>
      </template>

    </a-modal>

  </div>
</template>

<script>
import seachBox from '@comp/seachBox'
import Handle from './components/Handle'
import BtModal from '@comp/Modal'
import { axios } from '@/utils/request'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
    name: 'ReturnHandling',
    components: {
        seachBox,
        BtModal,
        Handle
    },
    data () {
        return {
            seachValue: {},
            conditions: [
                { title: '销售单号', type: 'input', key: 'sourceCodeSearch' },
                { title: '导购姓名', type: 'input', key: 'guidSearch' },
                { title: '顾客姓名', type: 'input', key: 'customerSearch' }

            ],
            activeKey: '1',
            refundVisible: false,
            // 标题
            handleTitle: '',
            loading: false,
            // 是否查看 0：查看 1：新增  2：修改
            isDelatis: 0,
            // 列表数据
            returnList: [],
            // 查询code
            seachCode: '',
            notTotal: 0,
            thenTotal: 0,
            returnData: {},
            // 物流信息
            visible: false,
            logistics: []

        }
    },
    computed: {
        ...mapGetters(['userInfo', 'windowHeight', 'storeInfo'])
    },
    created () {
        this.queryReturnList()
        console.log(moment('2019-06-25'))
    },
    watch: {
        refundVisible (newValue) {
            if (!newValue) {
                this.seachCode = ''
            }
        }
    },
    methods: {
        moment,
        // DistReturnApplyFindOne
        // 新增
        // DistReturnApplyDeleteByApplyCode
        // 修改
        // DistReturnApplyUpdateByPrimaryKeySelective
        // DistReturnApplyFindByPrimaryKey
        // DistReturnApplyAddSelective
        queryReturnList () {
            axios({
                path: 'DistReturnApplyFindByPrimaryKey',
                method: 'post',
                body: {
                    sourceCodeSearch: this.seachValue.sourceCodeSearch,
                    guidSearch: this.seachValue.guidSearch,
                    customerSearch: this.seachValue.customerSearch,
                    status: this.activeKey
                }
            }).then(res => {
                if (res.flag === 1 && res.data) {
                    console.log(res.data)
                    this.returnList = res.data
                } else {
                    this.returnList = []
                }
            })
            this.getTotal()
            // axios({
            //     path: 'DistReturnApplyFindByPrimaryKeyCount',
            //     method: 'post',
            //     body: {
            //         sourceCodeSearch: this.seachValue.sourceCodeSearch,
            //         guidSearch: this.seachValue.guidSearch,
            //         customerSearch: this.seachValue.customerSearch,
            //         status: this.activeKey
            //     }
            // }).then(res => {
            //     if (res.flag === 1 && res.data) {
            //         if (this.activeKey === '1') {
            //             this.notTotal = res.data.total
            //         } else {
            //             this.thenTotal = res.data.total
            //         }
            //     }
            // })
        },
        getTotal () {
            axios({
                path: 'DistReturnApplyFindByPrimaryKeyCount',
                method: 'post',
                body: {
                    sourceCodeSearch: this.seachValue.sourceCodeSearch,
                    guidSearch: this.seachValue.guidSearch,
                    customerSearch: this.seachValue.customerSearch,
                    status: '1'
                }
            }).then(res => {
                if (res.flag === 1 && res.data) {
                    this.notTotal = res.data.total
                }
            })
            axios({
                path: 'DistReturnApplyFindByPrimaryKeyCount',
                method: 'post',
                body: {
                    sourceCodeSearch: this.seachValue.sourceCodeSearch,
                    guidSearch: this.seachValue.guidSearch,
                    customerSearch: this.seachValue.customerSearch,
                    status: '2'
                }
            }).then(res => {
                if (res.flag === 1 && res.data) {
                    this.thenTotal = res.data.total
                }
            })
        },
        // 工具栏清空
        onReload () {
            this.seachValue = {}
        },
        // 工具栏搜索
        onSeach (e) {
            console.log(e)
            this.queryReturnList()
        },
        // 查看
        async handleDetails (title, code) {
            this.handleTitle = title
            this.isDelatis = 0
            this.seachCode = code
            await this.queryCodeReturn(code)
            this.refundVisible = true
        },
        // 新增
        handleAdd (title) {
            this.refundVisible = true
            this.handleTitle = title
            this.isDelatis = 1
            this.returnData = {
                'applyMain': {
                    'storeCode': this.storeInfo.code, // 申请店code
                    'createBy': this.userInfo.code, // 申请店codecreateBy
                    'guideCode': this.userInfo.code, // 导购编码
                    'guideName': this.userInfo.name, // 导购姓名
                    'customerCode': '', // 顾客编码
                    'customerName': '', // 顾客姓名
                    customerTelephone: '', // 客户电话
                    'pickUpTime': moment().add(1, 'days'), // 预约取货时间
                    'auditBy': '', // 审核人
                    'auditTime': null, // 审核时间
                    'status': '', // 审核状态
                    'type': '1', // 服务类型
                    'note': '' // 审核备注
                    // 'ifIntsall': '' // 审核备注
                },
                'applyDetail': []
            }
        },
        // 修改
        async handleEidte (title, code) {
            console.log(code)

            // this.refundVisible = true
            this.handleTitle = title
            this.isDelatis = 2
            // this.seachCode = code
            await this.queryCodeReturn(code)
            this.refundVisible = true
        },
        // 删除
        handleDele (code) {
            this.$confirm({
                title: '删除提示',
                content: '删除后不可恢复，确认删除？',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        axios({
                            path: 'DistReturnApplyDeleteByApplyCode',
                            method: 'post',
                            body: {
                                code
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                this.queryReturnList()
                            }
                        })
                        resolve()
                    }).catch((err) => console.log(err))
                },
                onCancel: () => {
                    return new Promise((resolve, reject) => {
                        resolve()
                    }).catch(err => console.log(err))
                }
            })
        },
        // 审核
        handleaudit (code) {
            this.$confirm({
                title: '审核提示',
                content: '是否审核当前信息？',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        axios({
                            path: 'DistReturnApplyAuditByApplyCode',
                            method: 'post',
                            body: {
                                code,
                                updateBy: this.userInfo.code
                            }
                        }).then(res => {
                            if (res.flag === 1) {
                                this.queryReturnList()
                            }
                        })
                        resolve()
                    }).catch((err) => console.log(err))
                },
                onCancel: () => {
                    return new Promise((resolve, reject) => {
                        resolve()
                    }).catch(err => console.log(err))
                }
            })
        },
        // 关闭申请退换货
        closeApplyModal () {
            this.refundVisible = false
        },
        handleSubmit () {
            // DistReturnApplyUpdateByPrimaryKeySelective
            const data = Object.assign({}, this.returnData.applyMain)
            data.applyDetail = this.returnData.applyDetail

            console.log(data)
            if (this.returnData.applyDetail.length === 0) {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请选择商品！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else if (this.returnData.applyMain.customerName === '') {
                let secondsToGo = 3
                const modal = this.$warning({
                    title: '提示',
                    content: '请添加顾客！'
                })
                const interval = setInterval(() => {
                    secondsToGo -= 1
                }, 1000)
                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                }, secondsToGo * 1000)
            } else {
                const isapplyReason = this.returnData.applyDetail.every(element => {
                    return element.applyReason === ''
                })
                const quantity = this.returnData.applyDetail.every(element => {
                    return element.quantity === 0
                })
                console.log(isapplyReason)
                if (this.returnData.applyMain.type === '') {
                    let secondsToGo = 3
                    const modal = this.$warning({
                        title: '提示',
                        content: '请选择服务类型！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else if (isapplyReason) {
                    let secondsToGo = 3
                    const modal = this.$warning({
                        title: '提示',
                        content: '请选择申请原因！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else if (quantity) {
                    let secondsToGo = 3
                    // console.warn();

                    const modal = this.$warning({
                        title: '提示',
                        content: '商品数量不能为0！'
                    })
                    const interval = setInterval(() => {
                        secondsToGo -= 1
                    }, 1000)
                    setTimeout(() => {
                        clearInterval(interval)
                        modal.destroy()
                    }, secondsToGo * 1000)
                } else {
                    if (this.isDelatis === 1) {
                        axios({
                            path: 'DistReturnApplyAddSelective',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                this.refundVisible = false
                                this.queryReturnList()
                            }
                        })
                    } else if (this.isDelatis === 2) {
                        axios({
                            path: 'DistReturnApplyUpdateByPrimaryKeySelective',
                            method: 'post',
                            body: data
                        }).then(res => {
                            if (res.flag === 1) {
                                this.refundVisible = false
                                this.queryReturnList()
                            }
                        })
                    }
                }
            }
        },
        // tab切换
        callback (key) {
            console.log(key)
            this.activeKey = key
            this.queryReturnList()
        },
        getLogistics (returnApplyCode, sourceCode) {
            axios({
                path: 'DistLogisticsFindReturnsDeliverByParam',
                method: 'post',
                body: {
                    returnApplyCode,
                    sourceCode
                }
            }).then(res => {
                console.log(res.data)
                if (res.flag === 1 && res.data && res.data.length > 0) {
                    this.logistics = res.data
                    this.visible = true
                } else {
                    this.logistics = []
                }
            })
        },
        getDeliverBySourceCode (sourceCode) {

        },
        // 查询code对应信息
        queryCodeReturn (code) {
            axios({
                path: 'DistReturnApplyFindOne',
                method: 'post',
                body: {
                    codeSearch: code
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.returnData = res.data
                    if (this.returnData.applyDetail[0].source === '第三方售后') {
                        this.isAddGoods = 2
                    } else {
                        this.isAddGoods = 1
                    }
                    this.returnData.applyMain.pickUpTime = moment(this.returnData.applyMain.pickUpTime)
                    console.log(this.returnData)
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.returnHandling{
    background-color: #fff;
    padding-top:15px;
    overflow: auto;
}
    /deep/.ant-card-bordered {
    margin-bottom: 20px;
        .ant-card-body {
            padding: 10px;
        }
    }
    .list-box {
        .ant-card-body {
            .card-header {
                display: flex;
                justify-content: space-between;
                height: 34px;
                line-height: 28px;
                border-bottom: 1px solid #ccc;
                .header-text {
                    span {
                        margin-right: 30px;
                    }
                }
                .header-btn{
                    .ant-btn{
                        margin-right: 15px;
                    }
                    >.trigon{
                        position: relative;
                        z-index: 0;
                        >span{
                            transform: rotate(45deg);
                            display: inline-block;
                            position: relative;
                            top: -7px;
                            color: #fff;
                        }
                    }
                    >.trigon::after{
                        border-color: transparent #bdec87;
                        border-style: solid;
                        border-width: 0px 45px 45px 0px;
                        -webkit-box-sizing: content-box;
                        box-sizing: content-box;
                        content: '';
                        position: absolute;
                        right: 0;
                        top: -15px;
                        z-index: -1;
                    }
                }
            }
            .card-content {
                .order {
                    border-bottom: 1px solid #ccc;
                    .order-left {
                        padding: 10px 0;
                        div {
                            display: flex;
                                img {
                                    display: block;
                                }
                                .order-info {
                                    display: block;
                                    padding-left: 20px;
                                }
                        }
                    }
                    .order-right {
                        padding: 10px;
                        border-left: 1px solid #ccc;

                    }
                }
            }
            .card-footer {
                display: flex;
                font-size: 16px;
                height: 49px;
                line-height: 49px;
                justify-content: space-between;
                .footer-left {
                    p {
                        height: 24px;
                        line-height: 24px;
                        margin: 0;
                    }
                }
                .footer-right {
                    .ant-btn {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
// }
.model{
    /deep/ .button-box {
        /deep/ .ant-btn-primary {
            display: none !important;
        }
    }
}

</style>

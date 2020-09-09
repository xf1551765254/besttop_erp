<!--
 * @Description: ERP
 * @Version: ^1.0.0
 * @Company: BestTop
 * @Author: haile
 * @Date: 2019-07-18 10:46:27
 * @LastEditors: haile
 * @LastEditTime: 2019-07-25 16:45:35
 -->
<template>
  <fullscreen
    ref="fullscreen"
    class="fullscreenClass"
    style="background-color:#fff;"
    @change="fullscreenChange">
    <div class="container">
      <!-- 当前登陆人 -->
      <a-row>
        <p style="margin-top:4px;margin-left:10px;font-size:16px;font-weight:700">导购员：{{ $store.getters.userInfo.name }} {{ $store.getters.userInfo.code }}</p>
      </a-row>
      <!-- 工具栏 -->
      <a-row class="seach-box">
        <a-col :xl="2" :lg="2" :md="2" :sm="3">
          <a-button style="margin-top:4px;margin-left:10px;" shape="circle" :icon="fullscreen?'fullscreen-exit':'fullscreen'" @click="fullClick"/>
        </a-col>
        <a-col :xl="10" :lg="10" :md="10" :sm="9">
          <a-input-search
            placeholder="请输入商品名称或编码"
            size="large"
            @search="onSearch"
            enterButton
          />
        </a-col>
        <a-col :xl="12" :lg="12" :md="12" :sm="12" class="box-right">
          <div class="user" @click="showCustomerDrawer">当前顾客:{{ userNameTel }}</div>
          <a-button type="primary" style="margin-left:5px;" size="large" icon="shopping-cart" @click="showChildrenDrawer(0, customerInfo)">待结算</a-button>
          <a-button type="primary" style="margin-left:5px;" size="large" icon="plus" @click="addEdit(-1)">添加顾客</a-button>
        </a-col>
      </a-row>
      <!-- 商品列表 -->
      <a-row class="list-box">
        <ul class="goods-list">
          <li v-for="(item, index) in goodsList" :key="index" @click="toGoodsDetail(item)">
            <img v-if="item.mainGoodsPic[0]" :src="item.mainGoodsPic[0]" @error.once="moveErrorImg($event)" :alt="item.skuName">
            <img v-else src="@assets/goods.png" :alt="item.skuName">
            <h6>{{ initPrice(item.unitPrice) }}</h6>
            <h6>{{ item.skuName }}</h6>
            <h6>商品编码：{{ item.skuCode }}</h6>
            <p v-if="item.counts">已销：{{ item.counts }}</p>
          </li>
        </ul>
        <a-pagination showQuickJumper :defaultCurrent="page.currentPage" :total="page.total" :pageSize.sync="this.page.pageSize" @change="pageChange" />
      </a-row>
      <!-- 顾客表抽屉 -->
      <a-drawer
        width="520"
        :closable="false"
        @close="onClose"
        :visible="visible"
      >
        <ul class="user-list">
          <li @click="passUserInfo({})">
            <div class="user-info">普通顾客</div>
            <div class="user-cart"></div>
            <div class="user-edit" @click.stop="addEdit(-1)"><a-icon type="plus-circle" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
          </li>
          <li v-for="(item,index) in customerList" :key="index" @click="passUserInfo(item)">
            <div class="user-info">{{ item.name }}<span v-if="item.telephone">:{{ item.telephone }}</span></div>
            <div class="user-cart" @click.stop="showChildrenDrawer(1, item)"><a-icon type="shopping-cart" style="font-size:16px;color:rgb(56,173,255);cursor:pointer"/></div>
            <div class="user-edit" @click.stop="addEdit(0, item)"><a-icon type="edit" style="font-size:16px;color:rgb(56,173,255)"/></div>
          </li>
        </ul>
        <!-- 顾客待结算商品抽屉 -->
        <a-drawer
          :title="subUserNameTel"
          width="420"
          :closable="false"
          :z-index="9999"
          @close="onChildrenDrawerClose"
          :visible="childrenDrawer"
        >
          <a-checkbox-group v-model="settleGoods" @change="onChange">
            <a-row class="pro" v-for="(item,index) in userCart" :key="index">
              <a-col :span="3" class="fbox"><a-checkbox :value="item"></a-checkbox></a-col>
              <a-col :span="6"><img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70"></a-col>
              <a-col :span="15" class="pro-info">
                <p class="pro-title">{{ item.skuName }}</p>
                <p class="pro-pc">
                  <span class="price">¥{{ item.skuActualPrice }}</span>
                  <span class="count">x{{ item.skuQuantity }}</span>
                </p>
                <p>{{ item.code }}</p>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <div v-show="userCart.length === 0" style="margin-top:-24px">暂无待结算商品</div>
          <div
            :style="{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }"
          >
            <span style="float:left;padding-left:10px;">
              <a-checkbox
                :indeterminate="indeterminate"
                @change="onCheckAllChange"
                :checked="checkAll"
                :disabled="userCart.length===0"
              >
                全选
              </a-checkbox>
              <span>{{ initPrice(settlePrice) }}</span>
            </span>
            <a-button @click="toSettle" type="primary" :disabled="userCart.length === 0">
              结算
            </a-button>
          </div>
        </a-drawer>
      </a-drawer>
      <!-- 顾客待结算商品抽屉 -->
      <a-drawer
        :title="subUserNameTel"
        width="420"
        :closable="false"
        @close="onChildrenDrawerClose"
        :visible="cartDrawer"
      >
        <a-checkbox-group v-model="settleGoods" @change="onChange">
          <a-row class="pro" v-for="(item,index) in userCart" :key="index">
            <a-col :span="3" class="fbox"><a-checkbox :value="item"></a-checkbox></a-col>
            <a-col :span="6"><img src="https://img11.360buyimg.com/n7/jfs/t1/6350/31/9335/346484/5c136a1dE32b7b86b/cfaa654ebfa098db.jpg" alt="" width="70" height="70"></a-col>
            <a-col :span="15" class="pro-info">
              <p class="pro-title">{{ item.skuName }}</p>
              <p class="pro-pc">
                <span class="price">¥{{ item.skuActualPrice }}</span>
                <span class="count">x{{ item.skuQuantity }}</span>
              </p>
              <p>{{ item.code }}</p>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <div v-show="userCart.length === 0" style="margin-top:-24px">暂无待结算商品</div>
        <div
          :style="{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }"
        >
          <span style="float:left;padding-left:10px;">
            <a-checkbox
              :indeterminate="indeterminate"
              @change="onCheckAllChange"
              :checked="checkAll"
              :disabled="userCart.length===0"
            >
              全选
            </a-checkbox>
            <span>{{ initPrice(settlePrice) }}</span>
          </span>
          <a-button @click="toSettle" type="primary" :disabled="userCart.length === 0">
            结算
          </a-button>
        </div>
      </a-drawer>
      <!-- 添加顾客表单 -->
      <a-modal
        :title="addEditTitle"
        v-model="addEditModal"
        :closable="false"
        :keyboard="false"
        :maskClosable="false"
        :width="800"
        class="doc"
        destroyOnClose
        centered
      >
        <template slot="footer">
          <a-popconfirm title="确认放弃已填写的信息？" @confirm="subCancel">
            <a-icon slot="icon" type="question-circle-o" style="color:red" />
            <a-button key="back">关闭</a-button>
          </a-popconfirm>
          <a-button key="submit" type="primary" :loading="loading" @click="handleSubmit">
            确定
          </a-button>
        </template>
        <!-- 顾客信息表单 -->
        <a-form :form="userForm">
          <a-row class="doc">
            <a-col :span="4">电话:</a-col>
            <a-col :span="8">
              <a-form-item>
                <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone', {initialValue:addEditUser.telephone || '', validateTrigger:'blur'}, queryCustomer)" :disabled="addEditUser.type === 1"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">顾客名称:</a-col>
            <a-col :span="8">
              <a-form-item>
                <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name', {initialValue:addEditUser.name || ''})" :disabled="disableEdit"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">性别:</a-col>
            <a-col :span="20">
              <a-form-item>
                <a-radio-group v-decorator="$check('customer.sex', {initialValue:addEditUser.sex || 0})" :disabled="disableEdit" >
                  <a-radio :value="0">
                    男
                  </a-radio>
                  <a-radio :value="1">
                    女
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="4">地址:</a-col>
            <a-col :span="20">
              <a-form-item>
                <a-input placeholder="请输入详细地址" v-decorator="$check('customer.address', {initialValue:addEditUser.address || ''})" :disabled="true"/>
              </a-form-item>
            </a-col>
            <a-col :span="4">详细地址:</a-col>
            <a-col :span="20">
              <a-form-item>
                <a-input placeholder="街道、楼牌号等" v-decorator="$check('customer.addressDetail', {initialValue:addEditUser.addressDetail || ''})" :disabled="disableEdit"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <Amap @drag="dragCustomerMap" :mapWidth="'100%'" :mapHeight="'300px'" :zoom="13"></Amap>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </fullscreen>
</template>

<script>
import { axios } from '@/utils/request'
import Amap from '@comp/Amap'
import goodsPhoto from '@assets/goods.png'
export default {
    name: 'GoodsList',
    components: {
        Amap
    },
    data () {
        return {
            fullscreenClass: 'fullscreenClass',
            height: 0,
            fullscreen: false,
            container: 'body',
            userNameTel: '普通顾客',
            page: {
                currentPage: 1,
                pageSize: 15,
                total: 0
            },
            goodsList: [],
            visible: false,
            childrenDrawer: false,
            cartDrawer: false,
            customerList: [],
            subUserNameTel: '',
            settleGoods: [],
            userCart: [],
            indeterminate: true,
            checkAll: false,
            settlePrice: 0,
            customerInfo: {},
            userForm: this.$form.createForm(this),
            addEditModal: false,
            addEditTitle: '',
            addEditUser: {},
            disableEdit: true,
            isAdd: false,
            loading: false
        }
    },
    created () {
        this.height = this.getHeight()
        this.getGoodsList()
    },
    methods: {
        onSearch (value) {
            axios({
                path: 'ShoppingTrolleyDetailsSelectProviderContractSkus',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    skuName: value,
                    page: this.page.currentPage,
                    rows: this.page.pageSize
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data.list.length > 0) {
                        this.goodsList = res.data.list
                        this.goodsList.forEach(item => {
                            const pic = item.skuPicture ? item.skuPicture.split(',') : ['']
                            item.mainGoodsPic = pic
                        })
                        this.page.total = res.data.total
                        this.page.currentPage = res.data.pageNum
                    } else {
                        this.goodsList = []
                        this.page.currentPage = 1
                        this.page.total = 0
                    }
                }
            })
        },
        toGoodsDetail (goodsInfo) {
            this.$emit('activeComponent', 1)
            this.$emit('updateData', { type: 0, data: goodsInfo })
        },
        toSettle () {
        },
        async queryCustomer (rule, value, callback) {
            const self = this
            if (value) {
                const res = await axios({
                    path: 'CustomerManageQueryInfo',
                    method: 'post',
                    body: {
                        telephone: value
                    }
                })
                if (res.flag === 1) {
                    if (res.data.length > 0) {
                        console.log('====================')
                        this.disableEdit = true
                        const data = res.data[0]
                        data.customerName = data.name
                        data.customerTelephone = data.telephone
                        self.userForm.setFieldsValue({ 'telephone': data.telephone, 'name': data.name, 'sex': data.sex, 'address': data.address, 'addressDetail': data.addressDetail })
                        if (this.isAdd) {
                            this.passUserInfo(data)
                            this.addEditModal = false
                        }
                    } else {
                        self.userForm.setFieldsValue({ 'name': '', 'sex': '', 'address': '', 'addressDetail': '' })
                        this.disableEdit = false
                    }
                }
            }
            callback()
        },
        addEdit (flag, customerInfo) {
            if (flag === -1) {
                this.isAdd = true
                this.addEditTitle = '添加顾客信息'
                this.addEditUser = {}
            } else {
                this.isAdd = false
                this.addEditTitle = '编辑顾客信息'
                this.addEditUser = { ...customerInfo }
            }
            this.addEditModal = true
        },
        dragCustomerMap (data) {
            this.customerInfo.address = data.address
            this.userForm.setFieldsValue({
                address: this.customerInfo.address
            })
            this.customerInfo.lat = data.position.lat
            this.customerInfo.lng = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
        },
        handleSubmit (e) {
            const self = this
            e.preventDefault()
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.latitude = this.customerInfo.lat || this.addEditUser.latitude
                    values.longitude = this.customerInfo.lng || this.addEditUser.latitude
                    values.province = this.customerInfo.province
                    values.city = this.customerInfo.city
                    values.area = this.customerInfo.area
                    if (this.isAdd === false) {
                        values.id = this.addEditUser.id
                        values.type = this.addEditUser.type
                        values.oldCustomerName = this.addEditUser.name
                    } else {
                        if (values.address !== '') {
                            const customerAddress = [{}]
                            customerAddress[0] = { ...values }
                            customerAddress[0].isDefault = 1
                            values.customerAddress = [ ...customerAddress ]
                        }
                    }
                    this.userNameTel = `${values.name}:${values.telephone}`
                    axios({
                        path: self.isAdd ? 'CustomerManageAddCustomerAndAddress' : 'CustomerManageUpdateCustomer',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            this.getCustomerList()
                            if (res.data) {
                                res.data.customerName = res.data.name
                                res.data.customerTelephone = res.data.telephone
                                res.data.customerId = res.data.id
                                this.passUserInfo(res.data)
                            }
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        subCancel () {
            this.addEditModal = false
            this.disableEdit = true
        },
        showCustomerDrawer () {
            this.getCustomerList()
            this.visible = true
        },
        passUserInfo (customerInfo) {
            if (JSON.stringify(customerInfo) !== '{}') {
                this.customerInfo = customerInfo
                this.userNameTel = customerInfo.telephone ? `${customerInfo.name}:${customerInfo.telephone}` : customerInfo.name
            } else {
                this.customerInfo = {}
                this.userNameTel = '普通顾客'
            }
            this.$emit('updateCustomer', this.customerInfo)
            this.onClose()
        },
        onChange (checkedList) {
            this.indeterminate = !!checkedList.length && (checkedList.length < this.userCart.length)
            this.checkAll = checkedList.length === this.userCart.length
            this.calcuSettlePrice()
        },
        onCheckAllChange (e) {
            Object.assign(this, {
                settleGoods: e.target.checked ? this.userCart : [],
                indeterminate: false,
                checkAll: e.target.checked
            })
            this.calcuSettlePrice()
        },
        // 顾客待结算列表计算结算价
        calcuSettlePrice () {
            this.settlePrice = 0
            this.settleGoods.forEach(item => {
                this.settlePrice += item.actualPay
            })
        },
        onClose () {
            this.visible = false
        },
        onChildrenDrawerClose () {
            this.childrenDrawer = false
            this.cartDrawer = false
            this.settlePrice = 0
            this.settleGoods = []
        },
        async showChildrenDrawer (flag, customerInfo) {
            console.log('66666666666666666666666', customerInfo)
            if (JSON.stringify(customerInfo) !== '{}') {
                this.userCart = []
                await this.queryUserCart(customerInfo)
                this.subUserNameTel = `${customerInfo.name}:${customerInfo.telephone}`
                if (flag === 0) {
                    this.cartDrawer = true
                } else {
                    this.childrenDrawer = true
                }
            } else {
                this.$message.warning('请先选择商品')
                return false
            }
        },
        pageChange (currentPage) {
            this.page.currentPage = currentPage
            this.getGoodsList()
        },
        // 查询待结算顾客列表
        async getCustomerList () {
            const res = await axios({
                path: 'ShoppingTrolleyQueryUnsettledCustomerList',
                method: 'POST',
                body: {
                    guideCode: this.$store.getters.userInfo.code,
                    storeCode: this.$store.getters.storeInfo.code
                }
            })
            if (res.flag === 1) {
                this.customerList = res.data
            }
        },
        // 查询热门商品列表
        async getGoodsList () {
            const res = await axios({
                path: 'ShoppingTrolleyDetailsQueryHotShopping',
                method: 'POST',
                body: {
                    storeCode: this.$store.getters.storeInfo.code,
                    guiderCode: this.$store.getters.userInfo.code,
                    orderbyField: 'update_time desc',
                    page: this.page.currentPage,
                    rows: 3
                }
            })
            if (res.flag === 1) {
                if (res.data.list.length > 0) {
                    this.goodsList = res.data.list
                    this.goodsList.forEach(item => {
                        const pic = item.skuPicture ? item.skuPicture.split(',') : ['']
                        item.mainGoodsPic = pic
                    })
                    this.page.total = res.data.total
                    this.page.currentPage = res.data.pageNum
                } else {
                    this.goodsList = []
                    this.page.currentPage = 1
                    this.page.total = 0
                }
            }
        },
        // 查询顾客待结算商品列表
        async queryUserCart (user) {
            const res = await axios({
                path: 'ShoppingTrolleyQueryShoppingTrolleyByCustomerId',
                method: 'POST',
                body: {
                    customerName: user.name,
                    customerTelephone: user.telephone,
                    status: 'shopping_trolley_status:1',
                    guideCode: this.$store.getters.userInfo.code
                }
            })
            if (res.flag === 1) {
                this.userCart = res.data
            }
        },
        moveErrorImg: function (event) {
            event.currentTarget.src = goodsPhoto
        },
        fullClick () {
            this.$refs['fullscreen'].toggle()
        },
        fullscreenChange (fullscreen) {
            this.fullscreen = fullscreen
            if (fullscreen) {
                this.height = document.documentElement.clientHeight - 100
                this.container = '.fullscreenClass'
            } else {
                this.height = this.getHeight()
                this.container = 'body'
            }
        },
        getHeight () {
            return document.documentElement.clientHeight
        },
        initPrice (p) {
            return `￥${Number(p).toFixed(2)}`
        }
    }
}
</script>

<style lang="less">
@import "../../../../assets/modalStyle.less";
</style>

<style lang="less" scoped>
.container {
    padding: 10px;
    height: calc(100% - 104px);
    // 工具栏
    .seach-box {
        .box-right {
            display: flex;
            justify-content: flex-end;
            .user {
                display: inline-block;
                height: 40px;
                line-height: 40px;
                padding: 0 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 5px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    // 商品列表
    .goods-list {
        display: flex;
        flex-wrap:  wrap ;
        justify-content:flex-start;
        margin: 0;
        margin-top:20px;
        padding: 0;
        >li{
            list-style:none;
            flex-basis: 225px;
            padding: 10px 20px;
            width: 225px;
            box-sizing: content-box;
            cursor: pointer;
            >img{
                width:100%;
                height: 140px;
                display: block
            }
            >h6{
                width: 100%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                margin:15px 0;
                height: 18px;
            }
            >p{
                color: red;
                >span{
                    font-size: 16px;
                }
            }
        }
        >li:hover{
            box-shadow: #ccc 1px 1px 3px;
        }
    }
}
.ant-drawer-body {
    padding: 0;
    .user-list {
      padding: 0;
      list-style: none;
      li {
        cursor: pointer;
        display:flex;
        padding-left: 20px;
        height: 39px;
        line-height:39px;
        border-bottom:1px solid #ccc;
        .user-info {
          flex: 3;
          display: inline-block;
        }
        .user-cart {
          flex: 1;
          display: inline-block;
          text-align: center;
          color: rgb(56,173,255);
        }
        .user-edit {
          flex: 1;
          display: inline-block;
          text-align: center
        }
      }
  }
}
.ant-checkbox-group {
  width: 100%;
  .pro{
    height:100px;
    .fbox {
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    img {
      height: 70px;
      width:70px;
      margin-top: 15px;
    }
    .pro-info {
      display:flex;
      flex-direction: column;
      justify-content:space-between;
      padding: 15px 0 15px 10px;
      .pro-title {
        font-weight: 700;
        padding-right: 15px;
      }
      p {
        height: 20px;
        line-height:20px;
      }
      .pro-pc{
        display: flex;
        justify-content: space-between;
        padding-right: 15px;
        .price {
          color: rgb(56,173,255);
        }
        .count {
          font-size: 12px;
          color: #aaa;
        }
      }
    }
  }
}
/deep/ .ant-pagination {
    text-align: center;
    margin-top: 10px;
}
</style>

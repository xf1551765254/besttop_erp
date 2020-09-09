<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-05-28 14:40:16
 * @LastEditors: laikt
 * @LastEditTime: 2019-08-23 15:32:16
 -->
<template>
  <div class="selectCustomers">
    <!-- 查询顾客信息列表 -->
    <a-modal
      title="选择地址"
      v-model="queryCustomerModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
      :zIndex="999"
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelQueryCustomer">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" @click="confirmCustomer">
          确定
        </a-button>
      </template>
      <div>
        <div class="search-box">
          <div class="left">
            <!-- <div>顾客姓名</div>
            <a-select
              showSearch
              v-model="customerValue"
              placeholder="请输入顾客姓名/手机号"
              style="width: 200px"
              :defaultActiveFirstOption="false"
              :showArrow="false"
              :filterOption="false"
              @search="handleSearch"
              @change="handleChange"
              :notFoundContent="null"
              allowClear
            >
              <a-select-option v-for="d in customerList" :key="d.id">{{ d.code+'-'+d.name }}</a-select-option>
            </a-select> -->
          </div>
          <div class="right">
            <!-- <a-button @click="handleQuery()">查询</a-button> -->
            <!-- <a-button @click="addEdit()" style="margin-left:10px;">新增</a-button> -->
            <a-button @click="addEditAddress(-1) " :disabled="!customerCode" style="margin-left:10px;">新增地址</a-button>
          </div>
        </div>
        <div class="list-box">
          <div>
            <h4>顾客信息</h4>
          </div>
          <div v-if="customerInfo.length>0" class="customer">
            <div v-for="(add,index) in customerInfo" :key="index">
              <a-button @click="emitCustomer(add)" style="width:80px;" :class="{active:add.isDefault===1}">
                {{ add.name }}
              </a-button>
              <span style="width:340px;">
                {{ add.concatAddress }}
              </span>
              <span>
                {{ add.telephone }}
              </span>
              <a-button @click="addEditAddress(index,add)">
                编辑
              </a-button>
              <a-button @click="deleteAddress(add.id)">
                删除
              </a-button>
            </div>

          </div>
          <div v-else>暂无顾客信息</div>

        </div>
      </div>
    </a-modal>
    <!-- 新增/编辑用户信息 -->
    <a-modal
      title="添加顾客地址"
      v-model="customerModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
      class="doc"
    >
      <template slot="footer">
        <a-popconfirm title="确认放弃已填写的信息？" @confirm="cancelAddCustomer">
          <a-icon slot="icon" type="question-circle-o" style="color:red" />
          <a-button key="back">关闭</a-button>
        </a-popconfirm>
        <a-button key="submit" type="primary" :loading="loading" @click="addressSubmit">
          确定
        </a-button>
      </template>
      <a-form :form="addressForm">
        <a-row class="doc">
          <a-col :span="4">电话:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入联系电话" v-decorator="$check('customerAddress.telephone', {initialValue:customerAddressInfo.telephone || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customerAddress.name', {initialValue:customerAddressInfo.name || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="请输入地址" v-decorator="$check('customerAddress.address', {initialValue:customerAddressInfo.address || ''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、门牌号等" v-decorator="$check('customerAddress.addressDetail', {initialValue:customerAddressInfo.addressDetail || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">默认收货地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customerAddress.isDefault', {initialValue:customerAddressInfo.isDefault || 0})">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragAddressMap" :mapWidth="'100%'" :mapHeight="'400px'" :lat="customerAddressInfo.latitude" :lng="customerAddressInfo.longitude"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 新增/编辑用户信息 -->
    <a-modal
      title="新增顾客信息"
      v-model="addEditModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      :z-index="99"
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
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone', {initialValue:addEditUser.telephone || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name', {initialValue:addEditUser.name || ''})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">性别:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.sex', {initialValue:addEditUser.sex || 0})" >
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
              <a-input placeholder="街道、楼牌号等" v-decorator="$check('customer.addressDetail', {initialValue:addEditUser.addressDetail || ''})"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <Amap @drag="dragCustomerMap" :mapWidth="'100%'" :mapHeight="'300px'" :zoom="13"></Amap>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { axios } from '@/utils/request'
import Amap from '@comp/Amap'

export default {
    name: 'SelectCustomers',
    props: {
        queryCustomerModal: {
            type: Boolean,
            default: false
        },
        customerCode: {
            type: String,
            default: ''
        }
    },
    components: {
        Amap

    },
    data () {
        return {
            customerModal: false,
            loading: false,
            // 客户搜索
            customerValue: undefined,
            // 返回客户列表
            customerList: [],
            // 客户信息
            // userForm: [],
            customerInfo: [],
            addEditAddressTitle: '',
            customerAddressInfo: {},
            addressInfo: {},
            customerAddressId: '',
            addressForm: this.$form.createForm(this),
            isAdd: false,
            // 新增/编辑顾客信息标识
            addEditModal: false,
            // 顾客表单
            userForm: this.$form.createForm(this),
            addEditUser: {},
            userInfo: {},
            customerDetail: {}
        }
    },
    created () {
        this.handleSearch()
    },
    watch: {
        queryCustomerModal (newData) {
            if (newData) {
                if (this.$props.customerCode) {
                    this.queryCustomer(this.$props.customerCode)
                }
            }
        }
    },
    mounted () {

    },
    methods: {
        // DistCustomerServiceFindCustomerInfoList
        // DistCustomerServiceFindCustomerAddressList
        // 搜索客户
        handleQuery () {
            this.handleSearch(
                this.customerValue
            )
        },
        handleSearch (value) {
            console.log(value, this.customerValue)
            this.customerValue = value
            axios({
                path: 'DistCustomerServiceFindCustomerInfoList',
                method: 'POST',
                body: {
                    telephone: value || this.customerValue
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        console.log(res.data)
                        this.customerList = res.data
                    } else {
                        this.customerList = []
                    }
                }
            })
        },
        // 选择客户
        handleChange (value) {
            console.log(value)

            this.customerValue = value
            const customer = this.customerList.filter(el => {
                return el.id === value
            })
            this.customerDetail = customer[0]
            this.queryCustomer()
            console.log(value)
        },
        queryCustomer (code) {
            axios({
                path: 'DistCustomerServiceFindCustomerAddressList',
                method: 'POST',
                body: {
                    customerCode: code || this.customerValue
                }
            }).then(res => {
                if (res.flag === 1) {
                    console.log(res.data)

                    if (res.data) {
                        this.customerInfo = res.data
                    } else {
                        this.customerInfo = []
                    }
                }
            })
        },
        emitCustomer (customer) {
            customer.code = this.customerCode
            customer.userName = this.customerDetail.name
            customer.userTelephone = this.customerDetail.telephone
            this.$emit('customer', customer)
            this.$emit('closeCustomerModal')
            // this.queryCustomerModal = false
        },
        // 关闭查询顾客列表模态框
        cancelQueryCustomer () {
            // this.queryCustomerModal = false
            this.$emit('closeCustomerModal')
        },
        // 确认选中顾客
        confirmCustomer () {
            // this.queryCustomerModal = false
            this.$emit('closeCustomerModal')
        },
        // 关闭添加顾客模态框
        cancelAddCustomer () {
            this.customerModal = false
        },
        // 新增/编辑顾客信息
        addEditCustomer (index) {
            this.goodsIndex = index
            // this.queryCustomerModal = true
            this.$emit('closeCustomerModal')
        },
        // 提交添加顾客信息
        // confirmAddCustomer (e) {
        //     e.preventDefault() // 防止事件穿透
        //     const customerValidateFields = this.userForm.validateFields
        //     customerValidateFields((err, values) => {
        //         if (!err) {
        //             this.customerInfo = { ...this.customerInfo, ...values }
        //             console.log('顾客表单提交信息:', this.customerInfo)
        //             this.customerModal = false
        //         }
        //     })
        // },
        /**
         * @name:新增/编辑地址关闭
         * @msg:
         * @param {type}
         * @return:
         */
        addEditAddress (index, addressInfo) {
            if (index === -1) {
                this.isAdd = true
                this.customerAddressInfo = {}
                this.addEditAddressTitle = '新增收货地址'
            } else {
                this.isAdd = false
                console.log('选中的顾客地址信息：', addressInfo)
                addressInfo.latitude = String(addressInfo.latitude)
                addressInfo.longitude = String(addressInfo.longitude)
                this.customerAddressInfo = addressInfo
                this.customerAddressId = addressInfo.id
                this.addEditAddressTitle = '编辑收货地址'
            }
            this.customerModal = true
        },
        /**
         * @name: 删除地址
         * @msg:
         * @param {type}
         * @return:
         */
        deleteAddress (id) {
            const self = this
            this.$confirm({
                title: '提示',
                content: '删除后不可恢复，确定删除吗？',
                onOk () {
                    axios({
                        path: 'CustomerManageDeleteCustomerAddress',
                        method: 'post',
                        body: {
                            id: id
                        }
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('删除顾客地址成功')
                            self.getCustomerAddress()
                        }
                    })
                }
            })
        },
        /**
         * @name:新增/编辑地址提交
         * @msg:
         * @param {type}
         * @return:
         */
        addressSubmit (e) {
            e.preventDefault() // 防止事件穿透
            // debugger
            // const { addressForm: { validateFields } } = this
            // const validateFields = this.userForm.validateFields
            const customerValidateFields = this.addressForm.validateFields

            customerValidateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.customerAddressId
                    }
                    // this.loading = true
                    // values.customerId = this.customerValue
                    values.latitude = this.addressInfo.lat
                    values.longitude = this.addressInfo.lng
                    values.province = this.addressInfo.province
                    values.city = this.addressInfo.city
                    values.area = this.addressInfo.area
                    values.customerCode = this.$props.customerCode
                    console.log('提交的新增地址信息：', values)
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAddress' : 'CustomerManageUpdateCustomerAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.customerModal = false
                            // this.passUserInfo(res.data)
                            this.queryCustomer(this.$props.customerCode)
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },

        // 添加顾客拖动地图
        dragAddressMap (data) {
            this.addressForm.setFieldsValue({
                address: data.address
            })
            console.log(data)
            this.addressInfo.lat = data.position.lat
            this.addressInfo.lng = data.position.lng
            this.addressInfo.province = data.addressComponent.province
            this.addressInfo.city = data.addressComponent.city
            this.addressInfo.area = data.addressComponent.district
            this.addressInfo.address = data.address
            console.log('拖动地图后的customerInfo:', this.addressInfo)
        },
        openQueryCustomerModal () {
            this.queryCustomerModal = true
        },
        /**
         * @name:新增/编辑模态框关闭
         * @msg:
         * @param {type}
         * @return:
         */
        subCancel () {
            this.addEditModal = false
        },
        /**
         * @name:新增/编辑提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleSubmit (e) {
            // const self = this
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.latitude = this.userInfo.latitude
                    values.longitude = this.userInfo.longitude
                    values.province = this.userInfo.province
                    values.city = this.userInfo.city
                    values.area = this.userInfo.area
                    // if (this.isAdd === false) {
                    //     values.id = this.addEditUser.id
                    //     values.type = this.addEditUser.type
                    //     values.oldCustomerName = this.addEditUser.name
                    // } else {
                    if (values.address !== '') {
                        const customerAddress = [{}]
                        customerAddress[0] = { ...values }
                        customerAddress[0].isDefault = 1
                        values.customerAddress = [ ...customerAddress ]
                    }
                    // }

                    axios({
                        path: 'CustomerManageAddCustomerAndAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            console.log('添加顾客成功：', res.data)
                            // 添加税票信息时使用
                            this.addEditModal = false
                            // this.getUsers()
                            if (res.data) {
                                this.userInfo = res.data
                                this.queryCustomer(res.data.id)

                                // res.data.customerName = res.data.name
                                // res.data.customerTelephone = res.data.telephone
                                // res.data.customerId = res.data.id
                                // this.passUserInfo(res.data)
                            }
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /** 添加顾客地图拖动监听
         * @name:
         * @msg:
         * @param {type}
         * @return:
         */
        dragCustomerMap (data) {
            this.userInfo.address = data.address
            this.userForm.setFieldsValue({
                address: data.address
            })
            this.userInfo.latitude = data.position.lat
            this.userInfo.longitude = data.position.lng
            this.userInfo.province = data.addressComponent.province
            this.userInfo.city = data.addressComponent.city
            this.userInfo.area = data.addressComponent.district
        },
        /**
         * @name:新增/编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit () {
            // if (index === -1) {
            //     this.isAdd = true
            //     this.addEditTitle = '添加顾客信息'
            //     this.addEditUser = {}
            // } else {
            //     this.isAdd = false
            //     this.addEditTitle = '编辑顾客信息'
            //     this.addEditUser = { ...user }
            //     console.log('要编辑的顾客信息', this.addEditUser)
            // }
            this.addEditModal = true
        }

    }
}
</script>

<style lang="less" scoped>
@import "../../../../../assets/modalStyle.less";

.selectCustomers{
    padding: 0;
}
.search-box {
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  .left {
    flex: 1;
    display: flex;
    div {
      width: 120px;
      height: 32px;
      line-height: 32px;
    }
  }
  .right {
    flex: 2;
    text-align: right;
  }
}
.list-box {
  padding-top: 20px;
  .customer{
      clear: both;
    >div{
        margin: 14px 0;
        >button{
            margin: 0 10px;
        }
        .active{
            border-color: #1890FF;
        }
        span{
            margin: 0 10px;
            display: inline-block;
        }
    }
  }

  p {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>

<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: laikt
 * @Date: 2019-05-28 14:40:16
 * @LastEditors: haile
 * @LastEditTime: 2019-07-05 11:36:16
 -->
<template>
  <div class="selectCustomers">
    <!-- 查询顾客信息列表 -->
    <a-modal
      title="选择顾客"
      v-model="queryCustomerModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      destroyOnClose
      centered
      :zIndex="1001"
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
            <div>顾客姓名</div>
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
              :disabled="disableSearch"
              allowClear
            >
              <a-select-option v-for="d in customerList" :key="d.id">{{ d.name + '--' + d.telephone }}</a-select-option>
            </a-select>
          </div>
          <div class="right">
            <a-button @click="handleQuery()" :disabled="disableSearch">查询</a-button>
            <a-button @click="addEdit()" style="margin-left:10px;" :disabled="disableOpt">新增顾客</a-button>
            <a-button @click="addEditAddress(-1) " style="margin-left:10px;">新增地址</a-button>
          </div>
        </div>
        <div class="list-box">
          <div>
            <h4>顾客信息</h4>
          </div>
          <div v-if="customerAddressList.length>0" class="customer">
            <div v-for="(add,index) in customerAddressList" :key="index">
              <a-button @click="emitCustomer(add)" style="width:80px;overflow: hidden;text-overflow: ellipsis;white-space:nowrap;">
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
      :title="addEditAddressTitle"
      v-model="customerModal"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      :zIndex="1002"
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
      :z-index="1002"
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
        openFlag: {
            type: Number,
            default: 0
        },
        // customerId: {
        //     type: String,
        //     default: ''
        // },
        userInfo: {
            type: Object,
            default: () => {}
        },
        addressFlag: {
            type: Boolean,
            default: false
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
            customerInfo: {},
            customerAddressList: [],
            addEditAddressTitle: '',
            customerAddressInfo: {},
            addressInfo: {},
            customerAddressId: '',
            customerId: '',
            addressForm: this.$form.createForm(this),
            isAdd: false,
            // 新增/编辑顾客信息标识
            addEditModal: false,
            // 顾客表单
            userForm: this.$form.createForm(this),
            addEditUser: {},
            disableOpt: false,
            disableSearch: false

        }
    },
    watch: {
        userInfo (val) {
            if (JSON.stringify(val) !== '{}' && typeof val !== 'undefined') {
                if (val.telephone) {
                    this.disableOpt = true
                    this.customerValue = `${val.name} -- ${val.telephone}`
                    if (this.openFlag === 1) {
                        this.disableSearch = true
                    }
                } else {
                    this.disableOpt = false
                    this.customerValue = `${val.name}`
                }
            }
            this.customerId = val.customerId
            this.queryCustomer(val.customerId)
        }
    },
    mounted () {
        if (JSON.stringify(this.userInfo) !== '{}') {
            if (this.userInfo.telephone) {
                this.disableOpt = true
                this.disableSearch = true
                this.customerValue = `${this.userInfo.name} -- ${this.userInfo.telephone}`
            } else {
                this.disableOpt = false
                this.customerValue = `${this.userInfo.name}`
            }
        }
        this.customerId = this.userInfo.customerId
        this.queryCustomer(this.userInfo.id)
    },
    methods: {
        // 搜索客户
        handleQuery () {
            this.handleSearch(this.customerValue)
        },
        handleSearch (value) {
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
                        this.customerList = res.data
                    } else {
                        this.customerList = []
                    }
                }
            })
        },
        // 选择客户
        handleChange (value) {
            this.customerId = value
            const customer = this.customerList.filter(el => {
                return el.id === value
            })
            if (customer.length > 0) {
                customer[0].customerName = customer[0].name
                customer[0].customerTelephone = customer[0].telephone
                this.$emit('passUserInfo', customer[0])
            }
            this.queryCustomer(value)
        },
        // 根据顾客id查询顾客地址列表
        queryCustomer (id) {
            axios({
                path: 'CustomerManageQueryUserAddress',
                method: 'POST',
                body: {
                    id: id || this.customerValue
                }
            }).then(res => {
                if (res.flag === 1) {
                    if (res.data) {
                        this.customerAddressList = res.data
                    } else {
                        this.customerAddressList = []
                    }
                }
            })
        },
        emitCustomer (address) {
            this.$emit('setAddress', address)
            this.$emit('closeCustomerModal')
        },
        // 关闭查询顾客列表模态框
        cancelQueryCustomer () {
            this.$emit('closeCustomerModal')
        },
        // 确认选中顾客
        confirmCustomer () {
            this.$emit('closeCustomerModal')
        },
        // 关闭添加顾客模态框
        cancelAddCustomer () {
            this.customerModal = false
        },
        // 新增/编辑顾客信息
        addEditCustomer (index) {
            this.goodsIndex = index
            this.$emit('closeCustomerModal')
        },
        // 提交添加顾客信息
        confirmAddCustomer (e) {
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.customerInfo = { ...this.customerInfo, ...values }
                    this.customerModal = false
                }
            })
        },
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
                zIndex: 1002,
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
                            self.queryCustomer(self.customerId)
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
            const customerValidateFields = this.addressForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    if (!this.isAdd) {
                        values.id = this.customerAddressId
                    }
                    // this.loading = true
                    values.customerId = this.userInfo.customerId
                    values.latitude = this.addressInfo.lat
                    values.longitude = this.addressInfo.lng
                    values.province = this.addressInfo.province
                    values.city = this.addressInfo.city
                    values.area = this.addressInfo.area
                    values.customerName = this.userInfo.name
                    console.log('提交的新增地址信息：', values)
                    axios({
                        path: this.isAdd ? 'CustomerManageAddCustomerAddress' : 'CustomerManageUpdateCustomerAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.customerModal = false
                            if (!this.userInfo.telephone) {
                                console.log('asdfasdfasdfasdf')
                                this.customerId = res.data.id
                                this.customerValue = `${res.data.name} -- ${res.data.telephone}`
                                this.queryCustomer(res.data.id)
                                this.$emit('passUserInfo', res.data)
                            } else {
                                console.log('/////////////////////////////')
                                this.queryCustomer(this.userInfo.customerId)
                            }
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
            this.addressInfo.lat = data.position.lat
            this.addressInfo.lng = data.position.lng
            this.addressInfo.province = data.addressComponent.province
            this.addressInfo.city = data.addressComponent.city
            this.addressInfo.area = data.addressComponent.district
            this.addressInfo.address = data.address
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
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    this.loading = true
                    values.latitude = this.customerInfo.latitude
                    values.longitude = this.customerInfo.longitude
                    values.province = this.customerInfo.province
                    values.city = this.customerInfo.city
                    values.area = this.customerInfo.area
                    if (values.address !== '') {
                        const customerAddress = [{}]
                        customerAddress[0] = { ...values }
                        customerAddress[0].isDefault = 1
                        values.customerAddress = [ ...customerAddress ]
                    }
                    axios({
                        path: 'CustomerManageAddCustomerAndAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            this.addEditModal = false
                            if (res.data) {
                                res.data.customerName = res.data.name
                                res.data.customerTelephone = res.data.telephone
                                res.data.customerId = res.data.id
                                this.customerId = res.data.id
                                // this.customerValue = res.data.id
                                this.queryCustomer(res.data.id)
                                this.$emit('passUserInfo', res.data)
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
            this.customerInfo.address = data.address
            this.userForm.setFieldsValue({
                address: this.customerInfo.address
            })
            this.customerInfo.latitude = data.position.lat
            this.customerInfo.longitude = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
        },
        /**
         * @name:新增/编辑
         * @msg:
         * @param {type}
         * @return:
         */
        addEdit () {
            this.addEditModal = true
        }

    }
}
</script>

<style lang="less" scoped>
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

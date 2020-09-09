<!--
 * @Description: 添加顾客
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-23 15:02:08
 * @LastEditors: lin
 * @LastEditTime: 2019-08-23 15:52:43
 -->
<template>
  <div>
    <a-modal
      title="添加顾客"
      v-model="visible"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      :width="800"
      class="doc"
      :z-index="99"
      destroyOnClose
      centered>
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
              <a-input placeholder="请输入联系电话" v-decorator="$check('customer.telephone', {initialValue:'', validateTrigger:'blur'}, queryCustomer)"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客名称:</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input placeholder="请输入顾客姓名" v-decorator="$check('customer.name', {initialValue: ''})" :disabled="disableEdit"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">性别:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-radio-group v-decorator="$check('customer.sex', {initialValue: 0})" :disabled="disableEdit" >
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
              <a-input placeholder="请输入详细地址" v-decorator="$check('customer.address', {initialValue:''})" :disabled="true"/>
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址:</a-col>
          <a-col :span="20">
            <a-form-item>
              <a-input placeholder="街道、楼牌号等" v-decorator="$check('customer.addressDetail', {initialValue:''})" :disabled="disableEdit"/>
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
import Amap from '@comp/Amap'
import { axios } from '@/utils/request'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    components: { Amap },
    data () {
        return {
            userForm: this.$form.createForm(this),
            loading: false,
            customerInfo: {}, // 给后端得传参
            disableEdit: true, // 禁止选择
            customerData: {
                code: '',
                name: '',
                telephone: '',
                lat: '',
                lng: '',
                province: '',
                city: '',
                area: ''
            } // 返回的参数
        }
    },
    methods: {
    /**
    * @name: 根据手机号查询顾客信息
    */
        async queryCustomer (rule, value, callback) {
            const self = this
            if (value) {
                const res = await axios({
                    path: 'TroubleApplyFindCustomer',
                    method: 'post',
                    body: {
                        telephone: value
                    }
                })
                if (res.flag === 1) {
                    if (res.data.list.length > 0) {
                        this.disableEdit = true
                        const data = res.data.list[0]
                        data.customerName = data.name
                        data.customerTelephone = data.telephone
                        self.userForm.setFieldsValue({
                            'telephone': data.telephone,
                            'name': data.name,
                            'sex': data.sex,
                            'address': data.address,
                            'addressDetail': data.addressDetail
                        })
                        self.customerData.code = data.code
                        self.customerData.telephone = data.telephone
                        self.customerData.name = data.name
                        self.customerData.lat = data.latitude
                        self.customerData.lng = data.longitude
                        self.customerData.province = data.province
                        self.customerData.city = data.city
                        self.customerData.area = data.area
                        self.customerData.address = data.address
                        self.customerData.addressDetail = data.addressDetail
                        this.$emit('update:visible', false)
                        this.$emit('onClose', self.customerData)
                    } else {
                        self.userForm.setFieldsValue({ 'name': '', 'sex': '', 'address': '', 'addressDetail': '' })
                        this.disableEdit = false
                    }
                }
            }
            callback()
        },
        /** 添加顾客地图拖动监听 */
        dragCustomerMap (data) {
            this.customerInfo.address = data.address
            this.userForm.setFieldsValue({
                'address': this.customerInfo.address
            })
            this.customerInfo.lat = data.position.lat
            this.customerInfo.lng = data.position.lng
            this.customerInfo.province = data.addressComponent.province
            this.customerInfo.city = data.addressComponent.city
            this.customerInfo.area = data.addressComponent.district
            //   console.log('用户地址信息：', this.customerInfo)
        },
        /**
     * @name: 提交
     */
        handleSubmit (e) {
            e.preventDefault() // 防止事件穿透
            const customerValidateFields = this.userForm.validateFields
            customerValidateFields((err, values) => {
                if (!err) {
                    values.latitude = this.customerInfo.lat
                    values.longitude = this.customerInfo.lng
                    values.province = this.customerInfo.province
                    values.city = this.customerInfo.city
                    values.area = this.customerInfo.area
                    this.loading = true
                    axios({
                        path: 'TroubleApplyAddCustomerAndAddress',
                        method: 'post',
                        body: values
                    }).then(res => {
                        if (res.flag === 1) {
                            const data = { ...res.data }
                            this.customerData.code = data.code
                            this.customerData.telephone = data.telephone
                            this.customerData.name = data.name
                            this.customerData.lat = data.latitude
                            this.customerData.lng = data.longitude
                            this.customerData.province = data.province
                            this.customerData.city = data.city
                            this.customerData.area = data.area
                            this.customerData.address = data.address
                            this.customerData.addressDetail = data.addressDetail
                            this.$emit('update:visible', false)
                            this.$emit('onClose', this.customerData)
                        }
                        this.loading = false
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        subCancel () {
            this.$emit('update:visible', false)
        }
    },
    watch: {
        visible (val) {
            if (val) {
                this.disableEdit = true
                // for (const i in this.customerData) {
                //   delete this.customerData[i]
                // }
            }
        }
    }
}
</script>
<style lang="less" >
@import "../../../../assets/modalStyle.less";
</style>

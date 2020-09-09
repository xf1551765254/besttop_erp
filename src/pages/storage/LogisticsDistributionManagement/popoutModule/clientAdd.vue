<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: shuai
 * @Date: 2019-03-01 19:27:00
 * @LastEditTime: 2019-06-11 10:46:58
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="选择顾客"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row>
          <div class="baseInfo">
            选择顾客
          </div>
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-input ref="name" addonBefore="顾客姓名" placeholder="请输入顾客姓名/手机号"/>
          </a-col>
          <a-col :span="6">
          </a-col>
          <a-col :span="3">
            <a-button @click="seach">查询</a-button>
          </a-col>
          <a-col :span="3">
            <a-button @click="customerFun">新增</a-button>
          </a-col>
          <div class="baseInfo">
            顾客信息
          </div>
          <a-col :span="24">
            <a-table
              rowKey="id"
              :columns="categoryinfoColumns"
              :dataSource="categoryinfoData"
              :pagination="{defaultPageSize:5}"
              :showHeader="false"
            >
              <template v-for="col in ['name']" :slot="col" slot-scope="text, record">
                <div :key="col">
                  <a-button
                    icon="user"
                    v-if="col === 'name'"
                    style="margin: -5px 0; width:100%"
                    :value="text"
                    :class="record.flag?'pitchOn':'unselected'"
                    @click="e => nameBtn(e.target.value, record.id, col)"
                    size="small"
                  >{{ record.name }}</a-button>
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">关闭</a-button>
        <a-button @click="handleOk" type="primary" size="small">提交</a-button>
      </div>
    </a-modal>
    <a-modal
      v-model="customerAdd"
      title="新增顾客"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">顾客姓名</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('customerCRM.name', {initialValue:BaseMessageObj.name})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">手机号</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('customerCRM.telephone', {initialValue:BaseMessageObj.telephone})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">地址</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input disabled v-decorator="$check('customerCRM.address', {initialValue:BaseMessageObj.address})" />
            </a-form-item>
          </a-col>
          <a-col :span="4">详细地址</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-input v-decorator="$check('customerCRM.addressDetail', {initialValue:BaseMessageObj.addressDetail})" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <Amap
        style="margin-top:20px"
        @drag="dragMap"
        :mapWidth="'100%'"
        :mapHeight="'400px'"
        :lat="lat"
        :lng="lng"></Amap>
      <div slot="footer">
        <a-button @click="customerCancel" size="small">取消</a-button>
        <a-button @click="customerOk" type="primary" size="small">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../../assets/modalStyle.less";
    .baseInfo {
        margin-bottom: 10px;
        padding-left: 25px;
        color: #38adff;
        padding-top: 10px;
    }
    .unselected{
        background:#d9d9d9;
    }
    .pitchOn{
        background: skyblue;
        color: aliceblue
    }
</style>
<script>
import { axios } from '@/utils/request'
import Amap from '@comp/Amap'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Amap
    },
    data () {
        return {
            form: this.$form.createForm(this),
            categoryinfoColumns: [ // 采购订单详情表头
                { title: '顾客姓名', dataIndex: 'name', align: 'center', scopedSlots: { customRender: 'name' }, width: 150 },
                { title: '地址', dataIndex: 'address', align: 'center', width: 300 },
                { title: '手机号', dataIndex: 'telephone', align: 'center' }
            ],
            categoryinfoData: [],
            customerAdd: false,
            spinning: false,
            value: 1,
            lat: '',
            lng: '',
            BaseMessageObj: {}
        }
    },
    methods: {
        // 地图返回数据
        dragMap (data) {
            console.log(data)
            this.form.setFieldsValue({
                address: data.address
            })
            this.lat = data.position.lat + ''
            this.lng = data.position.lng + ''
        },
        onChange (e) {
            console.log('radio checked', e.target.value)
        },
        seach () {
            console.log(this.$refs.name.stateValue)
            if (!this.$refs.name.stateValue) {
                return this.$message.warning('请输入顾客姓名或手机号!')
            }
            this.getData(this.$refs.name.stateValue)
        },
        customerFun () {
            this.customerAdd = true
        },
        nameBtn (val, count, col) {
            console.log(val, count, col)
            const newData = [...this.categoryinfoData]
            for (const item of newData) {
                item.flag = false
            }
            const target = newData.filter(item => count === item.id)[0]
            if (target) {
                console.log('编辑室的本行数据', target)
                target[col] = val
                target.flag = true
                this.categoryinfoData = newData
            }
        },
        customerCancel () {
            this.customerAdd = false
        },
        customerOk (e) {
            e.preventDefault() // 防止事件穿透
            const { form: { validateFields } } = this // 引入validateFields
            validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    values.longitude = this.lat
                    values.latitude = this.lng
                    this.customerAdd = false
                    axios({
                        path: 'DistributionTplAddCustomer',
                        method: 'post',
                        body: values,
                        headers: {}
                    }).then(res => {
                        if (res.flag === 1) {
                            this.categoryinfoData = [
                                {
                                    name: values.name,
                                    address: values.address,
                                    telephone: values.telephone,
                                    flag: true,
                                    id: 1
                                }
                            ]
                            this.customerAdd = false
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            console.log('执行')
            const arr = []
            for (const item of this.categoryinfoData) {
                if (item.flag) {
                    arr.push(item)
                }
            }
            if (arr.length === 0) {
                return this.$message.warning('请选择顾客')
            }
            this.$emit('onSelect', arr)
            this.$emit('update:visible', false)
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            console.log('执行')
            this.$emit('update:visible', false)
        },
        /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
        getData (e) {
            this.spinning = true
            axios({
                path: 'DistributionTplSelectCustomer',
                method: 'POST',
                body: {
                    name: e
                }
            }).then(res => {
                this.spinning = false
                console.log(res, '111111111111111111')
                if (res.flag === 1) {
                    const arr = res.data
                    arr.forEach(i => {
                        if (arr.length === 1) {
                            i.flag = true
                        } else {
                            i.flag = false
                        }
                    })
                    this.categoryinfoData = arr
                }
            })
        }
    },
    watch: {
    }
}
</script>

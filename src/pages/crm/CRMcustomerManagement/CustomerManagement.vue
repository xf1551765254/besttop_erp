<!--
 * @Description: 集客管理
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-26 17:07:21
 * @LastEditors: lin
 * @LastEditTime: 2019-08-27 15:33:37
 -->
<template>
  <div>
    <seachBox
      :conditions="conditions"
      :btns="btns"
      v-model="seachValue"
      @onReload="onReload"
      @onClick="onSeachClick"
      @onSeach="onSeach">
      <div class="btn-box">
        <a-button
          type="primary"
          size="small"
          style="margin-right:10px"
          icon="plus"
          @click="customerTransfer=true">顾客转移</a-button>
      </div>
    </seachBox>
    <!-- 数据表格 -->
    <NewTable
      ref="newTable"
      :tableCode="tableCode"
      :tableApiPath="tableApiPath"
      :rowSelect="false"
      :pams="seachValue"
      @onContextmenuChange="onContextmenuChange" >
    </newtable>
    <!-- 标签设置 -->
    <a-modal
      v-model="tabModal"
      title="标签设置"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      class="doc"
      :width="800"
      centered >
      <template slot="footer">
        <a-button @click="tabModal=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="submitFn">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="doc">
          <a-col :span="4">顾客分级</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择顾客分级"
                style="width: 100%"
                :options="customerGradeArr"
                v-model="labObj.customerGrade"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客分类</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择顾客分类"
                style="width: 100%"
                :options="customerTypeArr"
                v-model="labObj.customerType"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">顾客性格</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择顾客性格"
                style="width: 100%"
                :options="customerCharacterArr"
                v-model="labObj.customerCharacter"
                allowClear/>
            </a-form-item>
          </a-col>
          <a-col :span="4">消费等级</a-col>
          <a-col :span="8">
            <a-form-item>
              <a-select
                showSearch
                placeholder="请选择消费等级"
                style="width: 100%"
                :options="consumeLevelArr"
                v-model="labObj.consumeLevel"
                allowClear/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 顾客转移 -->
    <a-modal
      v-model="customerTransfer"
      title="顾客转移"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      destroyOnClose
      width="600"
      :bodyStyle="{height:'500px',width:'800px'}"
      centered >
      <template slot="footer">
        <a-button @click="customerTransfer=false">关闭</a-button>
        <a-button key="submit" type="primary" :loading="submitLoading" @click="transfersubmitFn">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row :gutter="32">
          <a-col :span="12">
            <div style="font-size:16px">转出人</div>
            <div style="" class="content" >
              <a-form-item
                label="所属机构："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                <a-select
                  showSearch
                  placeholder="请选择所属机构"
                  style="width: 100%"
                  :options="outStoreCodeArr"
                  :filterOption="false"
                  @search="handleOutStoreCodeArr"
                  @select="selectOutStoreCode"
                  @change="changeOutStoreCode"
                  v-decorator="$check('CustomerTransfer.outStoreCode', {initialValue:tableSingleData.outStoreCode})"
                  allowClear/>
              </a-form-item>
              <a-form-item
                label="转出人："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                <a-select
                  showSearch
                  placeholder="请选择转出人"
                  style="width: 100%"
                  :options="transferOutCodeArr"
                  :filterOption="filterOption"
                  @select="selectTransferOutCodeArr"
                  @change="changeTransferOutCodeArr"
                  v-decorator="$check('CustomerTransfer.transferOutCode', {initialValue:tableSingleData.transferOutCode})"
                  allowClear/>
              </a-form-item>
              <a-form-item
                label="顾客数量："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                {{ customerTransferNum.customerQuantityOUT }}
              </a-form-item>
            </div>
          </a-col>
          <a-col :span="12">
            <div style="font-size:16px">转入人</div>
            <div class="content">
              <a-form-item
                label="所属机构："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                <a-select
                  showSearch
                  placeholder="请选择所属机构"
                  style="width: 100%"
                  :options="inStoreCodeArr"
                  :filterOption="false"
                  @search="handleInStoreCode"
                  @select="selectInStoreCode"
                  @change="changeInStoreCode"
                  v-decorator="$check('CustomerTransfer.inStoreCode', {initialValue:tableSingleData.inStoreCode})"
                  allowClear/>
              </a-form-item>
              <a-form-item
                label="转入人："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                <a-select
                  showSearch
                  placeholder="请选择转入人"
                  style="width: 100%"
                  :options="transferInCodeArr"
                  :filterOption="filterOption"
                  @select="selectTransferInCodeArr"
                  @change="changeTransferInCodeArr"
                  v-decorator="$check('CustomerTransfer.transferInCode', {initialValue:tableSingleData.transferInCode})"
                  allowClear/>
              </a-form-item>
              <a-form-item
                label="顾客数量："
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 15 }" >
                {{ customerTransferNum.customerQuantityIN }}
              </a-form-item>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import NewTable from '@comp/newTable'
import SeachBox from '@comp/seachBox'
import moment from 'moment'
import { axios } from '../../../utils/request'
export default {
    components: { NewTable, SeachBox },
    name: 'CustomerManagement',
    data () {
        return {
            conditions: [
                {
                    key: 'guider',
                    type: 'select',
                    title: '用户',
                    label: ['code', 'name'],
                    value: 'code',
                    filter: true,
                    path: 'PermissionsUserFindOption'
                },
                {
                    key: 'telephone',
                    type: 'input',
                    title: '顾客姓名/手机号'
                },
                {
                    key: 'startTime',
                    type: 'date',
                    title: '注册开始日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'endTime',
                    type: 'date',
                    title: '注册结束日期',
                    mat: 'YYYY-MM-DD'
                },
                {
                    key: 'consumeLevel',
                    type: 'select',
                    title: '消费级别',
                    label: 'value',
                    value: ['type', 'configKey'],
                    filter: true,
                    path: 'OrganizationConfigFindByType',
                    body: {
                        type: 'customer_consume_level'
                    }
                }
            ],
            btns: ['export', 'print'],
            seachValue: {
                startTime: moment().startOf('day').subtract({ days: 7 }),
                endTime: moment().startOf('day')
            }, // 搜索的值
            // 表格
            tableCode: '', // id
            tableApiPath: '', // path
            menuOpt: [
                { name: '标签设置',
                    action: 'CustomerManagement.edit',
                    fc: this.LabelSetHandler
                }
            ],
            tableSingleData: {},
            // 标签设置
            tabModal: false,
            form: this.$form.createForm(this),
            submitLoading: false,
            labObj: {},
            // 顾客转移
            customerTransfer: false,
            customerTransferNum: {
                customerQuantityOUT: '',
                customerQuantityIN: ''
            },

            // 下拉框
            customerGradeArr: [],
            customerTypeArr: [],
            consumeLevelArr: [],
            customerCharacterArr: [],
            outStoreCodeArr: [],
            inStoreCodeArr: [],
            transferOutCodeArr: [],
            transferInCodeArr: []

        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableCode = 'fa5ac3ad6e38498498cf44da25d6b01e:CustomerManagement'
            this.tableApiPath = 'CustomerUserQueryLabelList'
            this.$refs.newTable.setContextmenu(this.menuOpt)
        })
        this.getCustomerTypeArr()
        this.getCustomerGradeArr()
        this.getConsumeLevelArr()
        this.getCustomerCharacterArr()
    },
    methods: {
        /**
         * @name: // 表格数据搜索
         */
        onSeach (e) {
            e.path = 'CustomerUserQueryLabelList'
            this.$refs.newTable.setTableData(this.tableCode, e)
        },
        /**
         * @name: 清空按钮pe}
         */
        onReload () {
            this.seachValue = {}
        },
        /**
         * @name: 工具栏功能按键
         */
        onSeachClick (e) {
            if (e === 'export') {
                this.$refs.newTable.exportFile('CustomerUserQueryLabelList')
            }
        },
        reLoadTableData () {
            this.$refs.newTable.setTableData(this.tableCode, { path: 'CustomerUserQueryLabelList' })
        },
        onContextmenuChange (tableRow) {
            this.tableSingleData = tableRow
        },
        LabelSetHandler (row) {
            this.tabModal = true
        },
        submitFn () {
            this.labObj.id = this.tableSingleData.id
            this.submitLoading = true
            axios({
                path: 'CustomerUserUpdateCustomerLabel',
                method: 'post',
                body: this.labObj
            }).then(res => {
                this.submitLoading = false
                if (res.flag === 1) {
                    this.reLoadTableData()
                    this.tabModal = false
                }
            })
        },
        /**
         * @name: 转出人所属机构
         */
        selectOutStoreCode (value) {
            const form = this.form
            form.setFieldsValue({
                transferOutCode: undefined
            })
            axios({
                path: 'PermissionsUserFindUserListByCode',
                method: 'post',
                body: {
                    code: value
                }
            }).then(res => {
                const dataArr = [...res.data]
                dataArr.forEach(i => {
                    i.title = `${i.code}-${i.name}`
                    i.value = i.code
                    i.key = i.code
                })
                this.transferOutCodeArr = dataArr
            })
        },
        /**
         * @name:  转出人所属机构改变值
         */
        changeOutStoreCode (value) {
            console.log(value)
            if (value === undefined) {
                this.form.setFieldsValue({
                    transferOutCode: undefined
                })
                this.transferOutCodeArr = []
            }
        },
        /**
         * @name: 转入人所属机构
         */
        selectInStoreCode (value) {
            const form = this.form
            form.setFieldsValue({
                transferInCode: undefined
            })
            axios({
                path: 'PermissionsUserFindUserListByCode',
                method: 'post',
                body: {
                    code: value
                }
            }).then(res => {
                const dataArr = [...res.data]
                dataArr.forEach(i => {
                    i.title = `${i.code}-${i.name}`
                    i.value = i.code
                    i.key = i.code
                })
                this.transferInCodeArr = dataArr
            })
        },
        /**
         * @name: 转入人所属机构改变值
         */
        changeInStoreCode (value) {
            console.log(value)
            if (value === undefined) {
                this.form.setFieldsValue({
                    transferInCode: undefined
                })
                this.transferInCodeArr = []
            }
        },
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        /**
         * @name: 选择转出人
         */
        selectTransferOutCodeArr (value) {
            this.customerTransferNum.customerQuantityOUT = ''
            axios({
                path: 'CustomerUserQueryByGuider',
                method: 'post',
                body: {
                    guider: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.customerTransferNum.customerQuantityOUT = res.data
                }
            })
        },
        /**
         * @name: 转出人改变
         */
        changeTransferOutCodeArr (value) {
            if (value === undefined) {
                this.customerTransferNum.customerQuantityOUT = ''
            }
        },
        /**
         * @name: 选择转入人
         */
        selectTransferInCodeArr (value) {
            this.customerTransferNum.customerQuantityIN = ''
            axios({
                path: 'CustomerUserQueryByGuider',
                method: 'post',
                body: {
                    guider: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    this.customerTransferNum.customerQuantityIN = res.data
                }
            })
        },
        /**
         * @name: 转入人改变
         */
        changeTransferInCodeArr (value) {
            if (value === undefined) {
                this.customerTransferNum.customerQuantityIN = ''
            }
        },
        /**
         * @name: 转移提交
         */
        transfersubmitFn (e) {
            e.preventDefault()
            const { form: { validateFields } } = this
            validateFields((err, values) => {
                if (!err) {
                    values.customerQuantity = this.customerTransferNum.customerQuantityOUT
                    this.submitLoading = true
                    axios({
                        path: 'CustomerUserUpdateGuider',
                        method: 'post',
                        body: values
                    }).then(res => {
                        this.submitLoading = false
                        if (res.flag === 1) {
                            this.customerTransfer = false
                            this.reLoadTableData()
                        }
                    })
                } else {
                    this.$message.error(Object.values(err)[0]['errors'][0]['message'])
                }
            })
        },
        getCustomerTypeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'customer_customer_type'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.customerTypeArr = dataArr
                }
            })
        },
        getCustomerGradeArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'customer_customer_grade'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.customerGradeArr = dataArr
                }
            })
        },
        getConsumeLevelArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'customer_consume_level'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.consumeLevelArr = dataArr
                }
            })
        },
        getCustomerCharacterArr () {
            axios({
                path: 'OrganizationConfigFindByType',
                method: 'post',
                body: {
                    type: 'customer_customer_character'
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(item => {
                        item.title = item.value
                        item.key = `${item.type}:${item.configKey}`
                        item.value = `${item.type}:${item.configKey}`
                    })
                    this.customerCharacterArr = dataArr
                }
            })
        },
        handleOutStoreCodeArr (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.outStoreCodeArr.length = 0
                this.getOutStoreCodeArr(value)
            }, 300)
        },
        getOutStoreCodeArr (value) {
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    condition: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.outStoreCodeArr = dataArr
                }
            })
        },
        handleInStoreCode (value) {
            if (!value) {
                return
            }
            clearTimeout(this.seachTimer)
            this.seachTimer = setTimeout(() => {
                this.inStoreCodeArr.length = 0
                this.getInStoreCodeArr(value)
            }, 300)
        },
        getInStoreCodeArr (value) {
            axios({
                path: 'OrganizationStoreFindCondition',
                method: 'post',
                body: {
                    page: 1,
                    rows: 20,
                    condition: value
                }
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.inStoreCodeArr = dataArr
                }
            })
        }
    },
    watch: {
        '$store.state.app.pageName' (to) {
            if (to === 'CustomerManagement') {
                this.getCustomerTypeArr()
                this.getCustomerGradeArr()
                this.getConsumeLevelArr()
                this.getCustomerCharacterArr()
            }
        }
    }

}
</script>
<style lang="less" scoped>
@import "../../../assets/modalStyle.less";
.content{
    border:1px solid #e8e8e8;
    height:400px;
    margin-top:10px;
    padding:15px;
}
</style>
<style lang="less">
.content{
    .ant-col-8{
        text-align: right;

    }
}
</style>

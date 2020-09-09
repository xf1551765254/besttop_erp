<!--
 * @Description: 手工发放历史数据
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-08-03 17:12:08
 * @LastEditors: lin
 * @LastEditTime: 2019-08-05 11:01:22
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      title="发放历史"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="800"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">关闭</a-button>
      </div>
      <!-- 工具栏 -->
      <div>
        <a-row type="flex" align="middle" style="margin-bottom:5px;margin-left:5px">
          <a-col :span="3" style="text-align:right">发放单号：</a-col>
          <a-col :span="5">
            <a-input
              ref="beginNumberRef"
              v-model="chooseSearchForm.code"
              placeholder="请输入编码"/>
          </a-col>
          <a-col :span="3" style="text-align:right">顾客：</a-col>
          <a-col :span="5">
            <a-input
              ref="endNumberRef"
              v-model="chooseSearchForm.customerCode"
              placeholder="请输入手机号/姓名"/>
          </a-col>
          <a-col :span="3" style="text-align:right">发放人：</a-col>
          <a-col :span="5">
            <a-select
              placeholder="请选择状态"
              style="width: 100%"
              allowClear
              :options="customerCodeArr"
              v-model="chooseSearchForm.issuerCode">
            </a-select>
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" style="margin-bottom:5px;margin-left:5px">
          <a-col :span="3" style="text-align:right">开始日期：</a-col>
          <a-col :span="5">
            <a-date-picker
              style="width:100%"
              @change="(e,v)=>onDataChange(e,v,'start')"
            />
          </a-col>
          <a-col :span="3" style="text-align:right">结束日期：</a-col>
          <a-col :span="5">
            <a-date-picker
              style="width:100%"
              @change="(e,v)=>onDataChange(e,v,'end')"
            />
          </a-col>
          <a-col :span="8" style="text-align:right">
            <a-button
              size="small"
              style="margin-left:10px"
              type="primary"
              icon="search"
              @click="getData">
              搜索
            </a-button></a-col>
        </a-row>
      </div>
      <!-- 表格 -->
      <div>
        <a-spin :spinning="spinning">
          <a-table
            rowKey="manualCode"
            :columns="tableColumns"
            size="small"
            :pagination="false"
            :scroll="{x: 1890,y: 560}"
            :dataSource="detailTableData"
            bordered >
            <template v-for="col in ['skuName','note','address']" :slot="col" slot-scope="text, record, index">
              <div :key="col">
                <a-tooltip v-if="text&&text.length > 10" :key="text" :title="text">
                  <span>{{ `${text.slice(0, 10)}...` }}</span>
                </a-tooltip>
                <span v-else> {{ text }} </span>
              </div>
            </template>
          </a-table>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import moment from 'moment'
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            // 搜索值
            chooseSearchForm: {},
            customerCodeArr: [],
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: '发放单号', dataIndex: 'manualCode', align: 'center', width: 180 },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 150, scopedSlots: { customRender: 'skuName' } },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 100 },
                { title: '零售价', dataIndex: 'skuPrice', align: 'center', width: 120 },
                { title: '数量', dataIndex: 'skuQuantity', align: 'center', width: 120 },
                { title: '分摊金额（元）', dataIndex: 'rateAmount', align: 'center', width: 120 },
                { title: '顾客姓名', dataIndex: 'customerName', align: 'center', width: 120 },
                { title: '顾客手机号', dataIndex: 'telephone', align: 'center', width: 120 },
                { title: '顾客地址', dataIndex: 'address', align: 'center', width: 150, scopedSlots: { customRender: 'address' } },
                { title: '发放位置', dataIndex: 'storeCode', align: 'center', width: 120 },
                { title: '发放人', dataIndex: 'issuerName', align: 'center', width: 120 },
                { title: '发放时间', dataIndex: 'issuerTime', align: 'center', width: 150 },
                { title: '备注', dataIndex: 'note', align: 'center', width: 150, scopedSlots: { customRender: 'note' } }
            ],
            detailTableData: [],
            spinning: false,
            startTimeStr: '',
            endTimeStr: ''
        }
    },
    mounted () {
        this.getCustomerCodeArr()
    },
    methods: {
        /**
         * @name: 关闭窗口
         */
        handleCancel () {
            this.$emit('update:visible', false)
        },
        searchSubmit () {},
        onDataChange (data, DataStr, key) {
            console.log(data, DataStr)
            if (key === 'start') {
                this.chooseSearchForm.startTime = DataStr
            } else {
                this.chooseSearchForm.endTime = DataStr
            }
        },
        getCustomerCodeArr () {
            axios({
                path: 'PermissionsUserFindOption',
                method: 'post'
            }).then(res => {
                if (res.flag === 1) {
                    const dataArr = [...res.data]
                    dataArr.forEach(i => {
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                        i.key = i.code
                    })
                    this.customerCodeArr = dataArr
                }
            })
        },
        getData () {
            this.spinning = true
            // this.chooseSearchForm.startTime = this.startTimeStr
            // this.chooseSearchForm.entTime = this.endTimeStr
            axios({
                path: 'ScheduleGiftQueryRecordHistory',
                method: 'post',
                body: this.chooseSearchForm
            }).then(res => {
                this.spinning = false
                if (res.flag === 1) {
                    const dataArr = [...res.data.list]
                    this.detailTableData = dataArr
                }
            })
        }
    },
    watch: {
        visible (val) {
            if (val) {
                for (const key in this.chooseSearchForm) {
                    delete this.chooseSearchForm[key]
                }
                this.getData()
            }
        }
    }
}
</script>
<style>

</style>

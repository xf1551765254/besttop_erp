<!--
 * @Description: 增加赠品
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-06-12 15:04:52
 * @LastEditors: lin
 * @LastEditTime: 2019-08-22 17:19:56
 -->
<template>
  <div>
    <a-modal
      v-model="visible"
      :title="title"
      :closable="false"
      :keyboard="false"
      :maskClosable="false"
      width="900"
      class="doc"
      destroyOnClose
      :bodyStyle="{height:'584px',width:'800px'}"
      centered>
      <a-spin :spinning="spinning">
        <a-row :gutter="20">
          <a-col :span="14">
            <a-row>
              <a-form>
                <a-row class="doc">
                  <a-col :span="6">商品类型</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-select
                        @change="seachBusinessTy"
                        placeholder="请选择搜索值"
                        :filterOption="filterOption"
                        style="width: 100%"
                        defaultValue="goods_type:6"
                        v-model="pams.type"
                        :options="businessTypeArr"
                        :disabled="isType===''?false:true"
                        allowClear/>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">商品编码/名称</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachSku" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row class="doc">
                  <a-col :span="6">规格型号</a-col>
                  <a-col :span="18">
                    <a-form-item>
                      <a-input placeholder="请输入搜索值" @change="seachSkuModel" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-row>
            <a-row style="margin-top:10px;">
              <a-col :span="24" class="table-nowrap">
                <a-table
                  rowKey="bt_web_id"
                  :scroll="{x:1080,y:380}"
                  :pagination="false"
                  :rowSelection="multiple?{selectedRowKeys: selectedRowKeys, onChange: onChange}:null"
                  :columns="columns"
                  :dataSource="dataSource"
                  :customRow="customRow"
                  size="small"
                  bordered>
                  <div v-for="col in ['skuName','providerName']" :slot="col" slot-scope="text, record, index" :key="col">
                    <a-tooltip v-if="text&&text.length > 15" :key="text" :title="text">
                      <span>{{ `${text.slice(0,15)}...` }}</span>
                    </a-tooltip>
                    <span v-else> {{ text }} </span>
                  </div>
                  <a-button slot="action" slot-scope="record" @click="select(record.bt_web_id)" size="small" :disabled="isNotSelect">选择</a-button>
                </a-table>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="10">
            <a-card :loading="isLoading" hoverable class="card-box table-nowrap">
              <template slot="title">
                <div>{{ `[${cacheObj.name||'未选择'}]-详情` }}</div>
              </template>
              <a-row v-for="(item, index) in details" :key="index">
                <span class="title">{{ `${item.name}：` }}</span>
                <span>{{ cacheObj[item.key] }}</span>
              </a-row>
            </a-card>
          </a-col>
        </a-row>
      </a-spin>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small" v-if="multiple" :disabled="isNotMulSelect">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<style lang="less">
@import "../../../../assets/modalStyle.less";
</style>
<style lang="less" scoped>
    .ant-modal-wrap{
        z-index: 4000;
    }
    .card-box{
        max-height:540px;
        overflow:auto;
        .title{
            font-weight: bold;
        }
    }
    .table-nowrap{
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow-x:auto;
        overflow-y:auto;
    }
</style>

<script>
import { axios } from '@/utils/request'
import is from 'is_js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '赠品选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    pams: {
      type: Object,
      default: () => { return {} }
    },
    isType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      seachTimer: '',
      isLoading: true,
      spinning: true,
      isNotSelect: false,
      selectedRowKeys: [],
      columns: [
        { title: '赠品编码', dataIndex: 'skuCode', align: 'center', width: 100 },
        { title: '赠品名称', dataIndex: 'skuName', align: 'center', width: 200, scopedSlots: { customRender: 'skuName' } },
        { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
        { title: '赠品单价', dataIndex: 'skuPrice', align: 'center', width: 100 },
        { title: '供应商编码', dataIndex: 'providerCode', align: 'center', width: 100 },
        { title: '供应商名称', dataIndex: 'providerName', align: 'center', width: 210, scopedSlots: { customRender: 'providerName' } },
        { title: '商品类型', dataIndex: 'typeConfig', align: 'center' },
        { title: '操作', key: 'operation', fixed: 'right', align: 'center', width: 70, scopedSlots: { customRender: 'action' } }
      ],
      dataSource: [],
      cacheObj: {},
      details: [
        { name: '赠品编码', key: 'skuCode' },
        { name: '赠品名称', key: 'skuName' },
        { name: '规格型号', key: 'skuModel' },
        { name: '赠品单价', key: 'skuPrice' },
        { name: '供应商编码', key: 'providerCode' },
        { name: '供应商名称', key: 'providerName' },
        { name: '商品类型', key: 'typeConfig' }
      ],
      // 下拉框
      businessTypeArr: [
        { key: 'goods_type:1', title: '自营单品', value: 'goods_type:1' },
        { key: 'goods_type:6', title: '联营服务', value: 'goods_type:6' }
      ], // 规格型号
      // 搜索框
      type: 'goods_type:6', // 商品类型
      skuModel: '', // 规格型号
      skuCode: ''// sku
    }
  },
  computed: {
    isNotMulSelect () {
      return this.selectedRowKeys.length === 0
    }
  },
  mounted () {},
  methods: {
    /**
         * @name: 手动设置表体
         * @msg:
         * @param {type}
         * @return:
         */
    setTableData (data) {
      this.dataSource = data
    },
    /**
         * @name: 规格型号搜索
         * @msg:
         * @param {type}
         * @return:
         */
    seachSkuModel (e) {
      this.skuModel = e.target.value
      clearTimeout(this.seachTimer)
      this.seachTimer = setTimeout(() => {
        this.getData()
      }, 300)
    },
    /**
         * @name: 商品类型搜索
         * @msg:
         * @param {type}
         * @return:
         */
    seachBusinessTy (e) {
      this.type = e
      clearTimeout(this.seachTimer)
      this.seachTimer = setTimeout(() => {
        this.getData()
      }, 300)
    },
    /**
         * @name: sku搜索
         * @msg:
         * @param {type}
         * @return:
         */
    seachSku (e) {
      this.skuCode = e.target.value
      clearTimeout(this.seachTimer)
      this.seachTimer = setTimeout(() => {
        this.getData()
      }, 300)
    },
    /**
         * @name: 行事件
         * @msg:
         * @param {type}
         * @return:
         */
    customRow (record, index) {
      return {
        props: {

        },
        on: {
          click: () => {
            this.cacheObj = record
            if (is.empty(this.cacheObj)) {
              this.isLoading = true
            } else {
              this.isLoading = false
            }
          },
          mouseenter: (e) => { }
        }
      }
    },
    /**
         * @name: 确认选择
         * @msg:
         * @param {type}
         * @return:
         */
    handleOk () {
      const selectDatas = this.dataSource.filter(o => is.inArray(o.bt_web_id, this.selectedRowKeys))
      if (selectDatas.length > 0) {
        this.$emit('onSelect', selectDatas)
      }
      this.selectedRowKeys.length = 0
      this.isNotSelect = this.selectedRowKeys.length > 0
      this.$emit('update:visible', false)
    },
    /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
    handleCancel () {
      this.selectedRowKeys.length = 0
      this.isNotSelect = this.selectedRowKeys.length > 0
      this.$emit('update:visible', false)
    },
    /**
         * @name: 表内单选
         * @msg:
         * @param {type}
         * @return:
         */
    select (key) {
      const selectDatas = this.dataSource.filter(o => o.bt_web_id === key)
      if (selectDatas.length > 0) {
        this.$emit('onSelect', [selectDatas[0]])
      }
      this.selectedRowKeys.length = 0
      this.isNotSelect = this.selectedRowKeys.length > 0
      this.$emit('update:visible', false)
    },
    /**
         * @name: 多选改变的监听
         * @msg:
         * @param {type}
         * @return:
         */
    onChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      this.isNotSelect = this.selectedRowKeys.length > 0
    },
    /**
         * @name: 搜索品牌
         * @msg:
         * @param {type}
         * @return:
         */
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    /**
         * @name: 获取数据
         * @msg:
         * @param {type}
         * @return:
         */
    getData () {
      const pams = {
        type: this.type,
        skuModel: this.skuModel,
        skuCode: this.skuCode
      }
      this.spinning = true
      const newPams = Object.assign(pams, this.$props.pams)
      const p = Object.assign({
        type: 'goods_type:1',
        page: 1,
        rows: 15
      }, newPams)
      axios({
        path: 'ScheduDefineQueryRuleGifts',
        method: 'POST',
        body: p
      }).then(res => {
        this.spinning = false
        if (res.flag === 1) {
          this.dataSource = res.data.list
          for (const i of this.dataSource) {
            i.bt_web_id = i.skuCode
          }
        }
      })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.seachSku({ target: { value: '' } })
        this.selectedRowKeys.length = 0
        this.isNotSelect = this.selectedRowKeys.length > 0
      }
    }
  }
}
</script>

<!--
 * @Description: 品类 品牌
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: lin
 * @Date: 2019-07-19 10:31:25
 * @LastEditors: lin
 * @LastEditTime: 2019-08-15 13:57:07
 -->
<template>
  <div>
    <!-- 增加商品弹框 -->
    <a-modal
      v-model="visible"
      class="doc"
      :closable="false"
      :keyboard="false"
      title="增加商品"
      :maskClosable="false"
      :width="800"
      style="top: 20px;"
      wrapClassName="setDocCss"
      :bodyStyle="{'height':'584px',width:'800px',margin:'0 -1px','overflow-y':'auto',padding:'15px 24px'}"
      destroyOnClose
      centered >
      <div v-if="Object.keys(pams).length !== 0">
        <a-row type="flex" justify="end" style="margin-bottom:10px;margin-top:-5px">
          <a-col>
            <a-button v-if="btnTitleType" @click="getUseCoinDada" type="primary" size="small"> 取用币规则商品 </a-button>
            <a-button v-else @click="getUseCouponDada" type="primary" size="small">  取促销券使用规则商品 </a-button>
          </a-col>
        </a-row>
      </div>

      <a-row>
        <a-col :span="2" style="text-align:right;line-height:30px">品类：</a-col>
        <a-col :span="6">
          <a-select
            showSearch
            @select="changeClassCode"
            placeholder="请选择品类"
            :filterOption="filterOption"
            style="width: 100%"
            :options="categoryDropArr"
            allowClear/>
        </a-col>
        <a-col :span="15" style="" :offset="1">
          <a-card :loading="categoryTagArr.length===0" class="card-box" :bodyStyle="{padding:0,'min-height':'30px'}">
            <template v-for="(tag, index) in categoryTagArr">
              <a-tooltip v-if="tag.length > 10" :key="tag" :title="tag">
                <a-tag color="blue" :key="tag" closable style="margin:5px" :afterClose="() => handleClose('category',tag)">
                  {{ `${tag.slice(0, 10)}...` }}
                </a-tag>
              </a-tooltip>
              <a-tag
                color="blue"
                v-else
                :key="tag"
                closable
                :afterClose="() => handleClose('category',tag)"
                style="margin:5px">
                {{ tag }}
              </a-tag>
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-row style="margin-top:10px">
        <a-col :span="2" style="text-align:right;line-height:30px">品牌：</a-col>
        <a-col :span="6">
          <a-select
            showSearch
            :value="brandValue"
            placeholder="请输入搜索值"
            style="width: 100%"
            class="selSeachBlock"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="brandHandleSearch"
            @select="brandHandleChange"
            :notFoundContent="null" >
            <a-select-option v-for="d in brandDataArr" :key="d.title" :value="d.value">{{ d.title }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="15" :offset="1" >
          <a-card :loading="brandTagArr.length===0" class="card-box" :bodyStyle="{padding:0,'min-height':'30px'}">
            <template v-for="(tag, index) in brandTagArr">
              <a-tooltip v-if="tag.length > 10" :key="tag" :title="tag">
                <a-tag color="blue" :key="tag" closable style="margin:5px" :afterClose="() => handleClose('brand',tag)">
                  {{ `${tag.slice(0, 10)}...` }}
                </a-tag>
              </a-tooltip>
              <a-tag
                color="blue"
                v-else
                :key="tag"
                closable
                :afterClose="() => handleClose('brand',tag)"
                style="margin:5px">
                {{ tag }}
              </a-tag>
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-row style="margin-top:10px">
        <a-col :span="2" style="text-align:right;line-height:30px">商品：</a-col>
        <a-col :span="6">
          <a-select
            showSearch
            :value="skuValue"
            placeholder="请输入搜索值"
            style="width: 100%;"
            class="selSeachBlock"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="skuHandleSearch"
            @select="skuHandleChange"
            :notFoundContent="null" >
            <a-select-option v-for="d in skuDataArr" :key="d.title" :value="d.value">{{ d.title }}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <div style="margin-top:10px;width:100%">
        <a-table
          rowKey="skuCode"
          :columns="tableColumns"
          size="small"
          bordered
          :pagination="false"
          :scroll="{ x:900}"
          :dataSource="tableData" >
          <template slot="action" slot-scope="text, record, index">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm title="是否确定删除?" @confirm="() => deleteRow(record.skuCode)">
                  <a>删除</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
      </div>
      <div slot="footer">
        <a-button @click="handleCancel" size="small">取消</a-button>
        <a-button @click="handleOk" type="primary" size="small">选择</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { axios } from '@/utils/request'
import is from 'is_js'
let timeout
let currentValue
function fetchBrand (value, callback) {
    if (timeout) {
        clearTimeout(timeout)
        timeout = null
    }
    currentValue = value
    function fake () {
        axios({
            path: 'GoodsBrandFindCondition',
            method: 'post',
            body: {
                condition: value,
                orderbyField: 'codeasc',
                page: 1,
                rows: 20
            }
        }).then(res => {
            if (res.flag === 1 && currentValue === value) {
                const data = res.data.list
                data.forEach(i => {
                    i.key = i.code
                    i.title = `${i.code}-${i.name}`
                    i.value = i.code
                })
                callback(data)
            }
        })
    }
    timeout = setTimeout(fake, 300)
}
function fetchSku (value, callback) {
    if (timeout) {
        clearTimeout(timeout)
        timeout = null
    }
    currentValue = value
    function fake () {
        axios({
            path: 'ScheduDefineQueryProviderSku',
            method: 'post',
            body: {
                skuCode: value,
                page: 1,
                rows: 20
            }
        }).then(res => {
            if (res.flag === 1 && currentValue === value) {
                const data = res.data.list
                data.forEach(i => {
                    i.key = i.skuCode
                    i.title = `${i.skuCode}-${i.skuName}`
                    i.value = i.skuCode
                })
                callback(data)
            }
        })
    }
    timeout = setTimeout(fake, 300)
}
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        pams: {
            type: Object,
            default: () => { return {} }
        },
        btnTitleType: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            cardLoading: false,
            categoryTagArr: [], // 品类标签
            categoryTagCodeArr: [], // 品类code标签
            brandTagArr: [], // 品牌标签
            brandTagCodeArr: [], // 品牌code标签
            brandValue: undefined,
            skuValue: undefined, // 商品选择
            // 商品列表
            tableColumns: [
                { title: '序号', width: 80, fixed: 'left', align: 'center', customRender: (text, record, index) => `${index + 1}` },
                { title: 'SKU编码', dataIndex: 'skuCode', align: 'center', width: 100 },
                { title: 'SKU名称', dataIndex: 'skuName', align: 'center', width: 200 },
                { title: '品类',
                    dataIndex: 'concatClass',
                    align: 'center',
                    width: 150 },
                { title: '品牌',
                    dataIndex: 'concatBrand',
                    align: 'center',
                    width: 150 },
                { title: '规格型号', dataIndex: 'skuModel', align: 'center', width: 150 },
                { title: '操作', key: 'operation', width: 70, fixed: 'right', align: 'center', scopedSlots: { customRender: 'action' } }
            ],
            tableData: [],

            // 下拉框
            categoryDropArr: [], // 品类
            brandDataArr: [],
            skuDataArr: []
        }
    },
    mounted () {
        this.getObjCategory()
    },
    methods: {
        /**
         * @name: 设置品牌 品类 商品的数据
         * @msg:
         * @param {type}
         * @return:
         */
        getDataArr (obj) {
            this.categoryTagArr = obj.categoryTagArr
            this.brandTagArr = obj.brandTagArr
            this.tableData = obj.tableData
            this.brandValue = undefined
            this.skuValue = undefined
        },
        /**
         * @name: 关闭窗口
         * @msg:
         * @param {type}
         * @return:
         */
        handleCancel () {
            this.$emit('update:visible', false)
        },
        /**
         * @name: 确认提交
         * @msg:
         * @param {type}
         * @return:
         */
        handleOk () {
            if (this.tableData.length === 0 && this.brandTagArr.length === 0 && this.categoryTagArr.length === 0) {
                return this.$message.warning('请选择品类/品牌/商品')
            }
            const obj = {
                categoryTagArr: this.categoryTagArr,
                brandTagArr: this.brandTagArr,
                tableData: this.tableData
            }
            this.$emit('onSelect', obj)
            this.$emit('update:visible', false)
        },
        /**
         * @name: 品类值得变化
         * @msg:
         * @param {type}
         * @return:
         */
        changeClassCode (value) {
            if (value) {
                const selectTagValue = this.categoryDropArr.filter(o => o.value === value)[0].title
                let categoryTagArr = this.categoryTagArr
                if (selectTagValue && categoryTagArr.indexOf(selectTagValue) === -1) {
                    categoryTagArr = [...categoryTagArr, selectTagValue]
                }
                Object.assign(this, {
                    categoryTagArr
                })
            }
        },
        /**
         * @name: 品类标签移除
         * @msg:
         * @param {type}
         * @return:
         */
        handleClose (key, removedTag) {
            if (key === 'category') {
                const tags = this.categoryTagArr.filter(tag => tag !== removedTag)
                this.categoryTagArr = tags
            } else {
                const tags = this.brandTagArr.filter(tag => tag !== removedTag)
                this.brandTagArr = tags
            }
        },
        /**
         * @name: 品牌所搜
         * @msg:
         * @param {type}
         * @return:
         */
        brandHandleSearch (value) {
            const self = this
            if (value) {
                fetchBrand(value, function (data) {
                    self.brandDataArr = data
                })
            }
        },
        /**
         * @name: 品牌值改变
         * @msg:
         * @param {type}
         * @return:
         */
        brandHandleChange (value) {
            const self = this
            self.brandValue = value
            if (value) {
                const selectTagValue = this.brandDataArr.filter(o => o.value === value)[0].title
                let brandTagArr = this.brandTagArr
                if (selectTagValue && brandTagArr.indexOf(selectTagValue) === -1) {
                    brandTagArr = [...brandTagArr, selectTagValue]
                }
                Object.assign(this, {
                    brandTagArr
                })
            }
        },
        /**
        * @name: 商品值搜索
        */
        skuHandleSearch (value) {
            const self = this
            if (value) {
                console.log(value)
                fetchSku(value, function (data) {
                    self.skuDataArr = data
                })
            }
        },
        skuHandleChange (value) {
            this.skuValue = value
            if (value) {
                const selectValue = this.skuDataArr.filter(o => o.skuCode === value)[0]
                if (selectValue) {
                    const has = this.tableData.filter(o => o.skuCode === selectValue.skuCode)
                    if (has.length === 0) {
                        this.tableData.push({
                            skuCode: selectValue.skuCode,
                            skuName: selectValue.skuName,
                            skuModel: selectValue.skuModel,
                            unit: selectValue.skuUnit,
                            skuPrice: selectValue.skuPrice,
                            concatClass: `${selectValue.classCode}-${selectValue.className}`,
                            concatBrand: `${selectValue.brandCode}-${selectValue.brandName}`,
                            rateProviderOne: '0',
                            reachUnitPrice: '0'
                        })
                    } else {
                        this.$notification.error({
                            message: '提示',
                            description: `${selectValue.skuCode}已经添加了`
                        })
                    }
                }
            }
        },
        /**
         * @name: 商品表格删除
         * @msg:
         * @param {type}
         * @return:
         */
        deleteRow (keyId) {
            const newData = [...this.tableData]
            this.tableData = newData.filter(item => item.skuCode !== keyId)
        },
        /**
         * @name: 获取品类
         * @msg:
         * @param {type}
         * @return:
         */
        getObjCategory () {
            axios({
                path: 'GoodsCategoryFindTreeOption',
                method: 'post',
                body: {
                    level: 2
                },
                headers: {}
            }).then(res => {
                if (res.flag === 1) {
                    const data = res.data
                    data.forEach(i => {
                        i.key = i.code
                        i.title = `${i.code}-${i.name}`
                        i.value = i.code
                    })
                    this.categoryDropArr = data
                }
            })
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
         * @name: 获取用币规则
         * @msg:
         */
        getUseCoinDada () {
            axios({
                path: 'CoinRuleQueryByCode',
                method: 'post',
                body: this.$props.pams
            }).then(res => {
                if (res.flag === 1) {
                    const newData = [...res.data.skuVoList]
                    const brandDataStr = res.data.brandStr
                    const classDataStr = res.data.classStr
                    const err = []
                    newData.forEach(item => {
                        const has = this.tableData.filter(o => o.skuCode === item.skuCode)
                        if (has.length === 0) {
                            this.tableData.push({
                                skuCode: item.skuCode,
                                skuName: item.skuName,
                                skuModel: item.skuModel,
                                unit: item.unit,
                                skuPrice: item.skuPrice,
                                concatClass: `${item.classCode}-${item.className}`,
                                concatBrand: `${item.brandCode}-${item.brandName}`,
                                rateProviderOne: '0',
                                reachUnitPrice: '0'
                            })
                        } else {
                            err.push(item.skuCode)
                        }
                    })
                    if (err.length > 0) {
                        this.$notification.error({
                            message: '提示',
                            description: `有${err.length}项添加失败，${err.join(',')}-商品已经添加过了`
                        })
                    }
                    const brandDataArr = brandDataStr ? brandDataStr.split(',') : []
                    let brandTagArr = this.brandTagArr
                    const classDataArr = classDataStr ? classDataStr.split(',') : []
                    let categoryTagArr = this.categoryTagArr
                    brandDataArr.forEach(item => {
                        if (item && brandTagArr.indexOf(item) === -1) {
                            brandTagArr = [...brandTagArr, item]
                        }
                    })
                    classDataArr.forEach(item => {
                        if (item && categoryTagArr.indexOf(item) === -1) {
                            categoryTagArr = [...categoryTagArr, item]
                        }
                    })
                    Object.assign(this, {
                        categoryTagArr,
                        brandTagArr
                    })
                }
            })
        },
        /**
         * @name:促销券使用规则
         */
        getUseCouponDada () {
            axios({
                path: 'ScheduleCouponRuleDefineFindCollection4ShareDefine',
                method: 'post',
                body: this.$props.pams
            }).then(res => {
                if (res.flag === 1) {
                    const newData = [...res.data.skuList]
                    const brandDataStr = res.data.brandList
                    const classDataStr = res.data.classList
                    if (newData.length === 0 && !brandDataStr && !classDataStr) {
                        return this.$message.warning('此促销券类型再无使用规则的商品数据')
                    }
                    const err = []
                    newData.forEach(item => {
                        const has = this.tableData.filter(o => o.skuCode === item.skuCode)
                        if (has.length === 0) {
                            this.tableData.push({
                                skuCode: item.skuCode,
                                skuName: item.skuName,
                                skuModel: item.skuModel,
                                unit: item.unit,
                                skuPrice: item.skuPrice,
                                concatClass: item.classCodeName,
                                concatBrand: item.brandCodeName,
                                rateProviderOne: '0',
                                reachUnitPrice: '0'
                            })
                        } else {
                            err.push(item.skuCode)
                        }
                    })
                    if (err.length > 0) {
                        this.$notification.error({
                            message: '提示',
                            description: `有${err.length}项添加失败，${err.join(',')}-商品已经添加过了`
                        })
                    }
                    const brandDataArr = brandDataStr ? brandDataStr.brandCodeName.split(',') : []
                    let brandTagArr = this.brandTagArr
                    const classDataArr = classDataStr ? classDataStr.classCodeName.split(',') : []
                    let categoryTagArr = this.categoryTagArr
                    brandDataArr.forEach(item => {
                        if (item && brandTagArr.indexOf(item) === -1) {
                            brandTagArr = [...brandTagArr, item]
                        }
                    })
                    classDataArr.forEach(item => {
                        if (item && categoryTagArr.indexOf(item) === -1) {
                            categoryTagArr = [...categoryTagArr, item]
                        }
                    })
                    Object.assign(this, {
                        categoryTagArr,
                        brandTagArr
                    })
                }
            })
        }
    },
    watch: {
        visible (val) {
            console.log(this.$props.pams)
        }
    }
}
</script>
<style lang="less" scoped>
.card-box{
    max-height:540px;
    min-height: 32px;
    overflow:auto;
    .title{
        font-weight: bold;
    }
}

</style>

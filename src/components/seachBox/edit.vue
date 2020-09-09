<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: laikt
 * @Date: 2019-03-05 11:58:10
 * @LastEditTime: 2019-08-27 18:20:50
 -->
<template>
  <div>
    <template v-if="item.type==='input'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-input
          v-model="value[item.key]"
          :addonAfter="item.fix || ''"
          :disabled="item.disabled"
          allowClear/>
      </a-col>
    </template>
    <template v-else-if="item.type==='number'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-input-number
          style="width:100%"
          :min="item.min || Number.MIN_SAFE_INTEGER"
          :max="item.max || Number.MAX_SAFE_INTEGER"
          v-model="value[item.key]"
          :step="item.step || 1"
          :precision="item.pre || 0"
          :disabled="item.disabled"/>
      </a-col>
    </template>
    <template v-else-if="item.type==='date'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-date-picker
          style="width:100%"
          @change="e=>onDateChange(e, item.mat, item.key)"
          :value="dateMat(item.key)"
          :format="item.mat ||'YYYY-MM-DD' "
          :disabledDate="item.disabled||disabledDate"
          :allowClear="!item.unAllowClear"
          :showTime="item.showTime || false"/>
      </a-col>
    </template>
    <template v-else-if="item.type==='select'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-select
          v-model="value[item.key]"
          style="width:100%"
          :filterOption="filterOption"
          :showSearch="item.filter"
          :mode="item.mode || 'default'"
          :maxTagCount="item.maxTagCount || 1"
          @focus="getSelectData(item)"
          @mouseenter="getSelectDataM(item)"
          :disabled="item.disabled"
          :allowClear="!item.allowClear">
          <a-select-option
            v-for="(i, index) in selectDataArr[item.key]"
            :key="index"
            :value="getKey(i, item.value)">{{ getLabel(i, item.label) }}</a-select-option>
        </a-select>
      </a-col>
    </template>
    <template v-else-if="item.type==='treeSelect'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-tree-select
          :dropdownStyle="{ maxHeight: `${$store.getters.windowHeight/2}px`, overflow: 'auto' }"
          v-model="value[item.key]"
          style="width:100%"
          :treeData="selectDataArr[item.key]"
          treeNodeFilterProp="title"
          :showSearch="item.filter"
          :multiple="item.multiple"
          :maxTagCount="item.maxTagCount || 1"
          :disabled="item.disabled"
          allowClear/>
      </a-col>
    </template>
    <template v-else-if="item.type==='selectBySeach'" >
      <a-col :span="8" class="seach-title"><a-tooltip placement="top" :title="`${item.title}:`"><span>{{ `${item.title}:` }}</span></a-tooltip></a-col>
      <a-col :span="16">
        <a-select
          showSearch
          :mode="item.mode || 'default'"
          :maxTagCount="item.maxTagCount || 1"
          v-model="value[item.key]"
          style="width:100%"
          :filterOption="false"
          notFoundContent="请输入两位关键字检索"
          @search="getSelectDataBySeach($event, item)"
          allowClear>
          <a-select-option
            v-for="(i, index) in selectDataArr[item.key]"
            :key="index"
            :value="getKey(i, item.value)">{{ getLabel(i, item.label) }}</a-select-option>
        </a-select>
      </a-col>
    </template>
  </div>
</template>
<style lang="less" scoped>
    .seach-title{
        font-weight: bold;
        // text-align:right;
        line-height: 32px;
        white-space:nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }
</style>
<script>
import { axios } from '@/utils/request'
import moment from 'moment'
import is from 'is_js'
export default {
    props: {
        item: {
            type: Object,
            default: () => { return {} }
        },
        value: {
            type: Object,
            default: () => { return {} }
        }
    },
    data () {
        return {
            timer: '',
            selectDataArr: {}
        }
    },
    computed: {

    },
    methods: {
        filterOption (input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        },
        getArr () {
            if (is.array(this.$props.item.selectDataArr)) {
                const arr = [...this.$props.item.selectDataArr]
                return arr
            } else {
                return []
            }
        },
        getKey (item, key) {
            if (is.array(key)) {
                return `${item[key[0]]}:${item[key[1]]}`
            } else {
                return item[key]
            }
        },
        getLabel (item, key) {
            if (is.array(key)) {
                return `${item[key[0]]}--${item[key[1]]}`
            } else {
                return item[key]
            }
        },
        onDateChange (e, mat, key) {
            if (is.not.null(e)) {
                this.$set(this.$props.value, key, e.format(mat || 'YYYY-MM-DD'))
            } else {
                this.$delete(this.$props.value, key)
            }
        },
        dateMat (key) {
            return is.not.undefined(this.$props.value[key]) ? moment(new Date(this.$props.value[key])) : null
        },
        disabledDate () {
            return false
        },
        getSelectData (item) {
            if (is.string(item.path)) {
                axios({ path: item.path, method: 'post', body: item.body || {} }).then(res => {
                    if (res.flag === 1) {
                        if (res.flag === 1) {
                            if (is.array(res.data)) {
                                this.$set(this.selectDataArr, item.key, res.data)
                            } else if (is.array(res.data.list)) {
                                this.$set(this.selectDataArr, item.key, res.data.list)
                            } else {
                                this.$logger.error('搜索框配置的接口错误或服务器出错!')
                            }
                        }
                    }
                })
            } else {
                if ('userSelectArr' in item && item.userSelectArr.length > 0) {
                    this.$set(this.selectDataArr, item.key, item.userSelectArr)
                }
            }
        },
        getSelectDataM (item) {
            if (!item.mode || item.mode === 'default') return
            if (is.string(item.path)) {
                axios({ path: item.path, method: 'post', body: item.body || {} }).then(res => {
                    if (res.flag === 1) {
                        if (res.flag === 1) {
                            if (is.array(res.data)) {
                                this.$set(this.selectDataArr, item.key, res.data)
                            } else if (is.array(res.data.list)) {
                                this.$set(this.selectDataArr, item.key, res.data.list)
                            } else {
                                this.$logger.error('搜索框配置的接口错误或服务器出错!')
                            }
                        }
                    }
                })
            } else {
                if ('userSelectArr' in item && item.userSelectArr.length > 0) {
                    this.$set(this.selectDataArr, item.key, item.userSelectArr)
                }
            }
        },
        getSelectByCondition (e, item) {
            if (is.string(item.path)) {
                item.flag = true
                const p = Object.assign({
                    condition: e,
                    orderbyField: 'code asc',
                    page: 1,
                    rows: 50
                }, item.body || {})
                axios({ path: item.path, method: 'post', body: p }).then(res => {
                    if (res.flag === 1) {
                        if (is.array(res.data)) {
                            this.$set(this.selectDataArr, item.key, res.data)
                        } else if (is.array(res.data.list)) {
                            this.$set(this.selectDataArr, item.key, res.data.list)
                        } else {
                            this.$logger.error('搜索框配置的接口错误或服务器出错!')
                        }
                    }
                    item.flag = false
                })
            } else {
                if ('userSelectArr' in item && item.userSelectArr.length > 0) {
                    this.$set(this.selectDataArr, item.key, item.userSelectArr)
                }
            }
        },
        getSelectDataBySeach (e, item) {
            if (!item.flag && e && e.trim().length > 1) {
                if (this.timer) { clearTimeout(this.timer) }
                this.timer = setTimeout(() => {
                    this.getSelectByCondition(e, item)
                }, 300)
            }
        }
    },
    watch: {
        'item': {
            handler (val, oldval) {
                if (is.array(val.selectDataArr)) {
                    const arr = this.getArr()
                    this.$set(this.selectDataArr, this.$props.item.key, arr)
                    if (val.selectDataArr.length === 0) {
                        this.$delete(this.$props.value, this.$props.item.key)
                    }
                }
            },
            deep: true,
            immediate: true
        }
    }
}
</script>

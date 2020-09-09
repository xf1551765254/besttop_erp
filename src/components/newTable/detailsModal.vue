<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @Date: 2019-01-21 09:52:13
 * @LastEditors: Oak
 * @LastEditTime: 2019-03-14 20:46:26
 -->
<template>
  <a-modal
    v-model="value"
    :title="title"
    :closable="false"
    :keyboard="false"
    :maskClosable="false"
    :width="900"
    class="doc"
    destroyOnClose
    centered>
    <template slot="footer">
      <a-button key="back" @click="close()">关闭</a-button>
    </template>
    <a-row class="d-box">
      <template v-for="(i, index) in keys">
        <a-col :span="3" :key="'title-'+index" class="title-span">
          <a-tooltip placement="top" >
            <template slot="title">
              <span>{{ `${cols[i].title}:` }}</span>
            </template>
            <span>{{ `${cols[i].title}:` }}</span>
          </a-tooltip>
        </a-col>
        <a-col :span="5" :key="'text-'+index" class="text-span">
          <a-tooltip placement="top" >
            <template slot="title">
              <span>{{ formatter(data[i], cols[i].formatter) }}</span>
            </template>
            <span style="margin-left:5px;">{{ formatter(data[i], cols[i].formatter) }}</span>
          </a-tooltip>
        </a-col>
      </template>
    </a-row>
  </a-modal>
</template>
<style lang='less' scoped>
    .text-span{
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        font-size: 10px;
        height: 28px;
        line-height: 28px;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
    }
    .title-span{
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        text-align: right;
        font-weight: bold;
        padding-right: 10px;
        font-size: 10px;
        background-color: rgb(245,245,245);
        height: 28px;
        line-height: 28px;
        border-right: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
    }
    .d-box{
        margin: 0 20px;
        border-left: 1px solid #e8e8e8;
        border-top: 1px solid #e8e8e8;
    }
</style>
<script>
'use strict'
import formatter from './formatter.js'
import keyby from 'lodash.keyby'
import map from 'lodash.map'
export default {
    components: { },
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            keys: [],
            cols: {},
            data: {},
            title: '详情',
            formatter
        }
    },
    methods: {
        close () {
            this.$emit('update:value', false)
        },
        setCols (title, columns, data) {
            const arr = []
            columns.forEach(i => {
                if ('dataIndex' in i && 'title' in i) {
                    arr.push({
                        key: i.dataIndex,
                        title: i.title,
                        formatter: i.formatter
                    })
                }
            })
            this.keys = map(arr, 'key')
            this.cols = keyby(arr, 'key')
            this.data = { ...data }
            this.title = title
        }
    }
}
</script>

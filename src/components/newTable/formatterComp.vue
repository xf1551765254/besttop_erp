<!--
 * @Description: ERP
 * @Version: ^0.0.3
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Oak
 * @Date: 2019-04-08 18:58:07
 * @LastEditTime: 2019-04-30 11:43:38
 -->
<template>
  <div>
    <img v-if="mat === 'Image'" class="img-box" :src="value && value.split(',')[0]" @click="imgClick(value)">
    <template v-else-if="mat === 'Html'">
      <a-tooltip
        placement="top"
        :mouseEnterDelay="0.3"
        arrowPointAtCenter>
        <span slot="title" v-html="value"></span>
        <span v-html="value" class="text"></span>
      </a-tooltip>
    </template>
    <template v-else>
      <a-tooltip
        placement="top"
        :title="getFormatter(value, mat)"
        :mouseEnterDelay="0.3"
        arrowPointAtCenter>
        <span class="text">{{ getFormatter(value, mat) }}</span>
      </a-tooltip>
    </template>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      :bodyStyle="{padding:'40px', maxWidth:'960px'}"
      destroyOnClose
      centered>
      <a-row>
        <a-col :sm="24" :md="12" :xl="8" v-for="(item, index) in previewImage" :key="`IMG-${index}`">
          <img alt="example" style="width: 100%" :src="item" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<style lang="less">
    .img-box{
        max-height: 18px;
        width: auto;
        max-width:100%;
    }
    .text{
        display : inline-block;
        overflow : hidden;
        text-overflow : ellipsis;
        white-space : nowrap;
        width : 100%;
    }
</style>

<script>
import formatter from './formatter.js'
export default {
    name: 'Formatter',
    // eslint-disable-next-line
    props: ['value', 'mat'],
    data: function () {
        return {
            previewVisible: false,
            previewImage: ''
        }
    },
    methods: {
        getFormatter (value, mat) {
            return formatter(value, mat)
        },
        getPopupContainer (trigger) {
            return trigger.parentElement
        },
        imgClick (s) {
            const ex = '.' + s.replace(/.+\./, '').toLowerCase()
            if (['.png', '.jpeg', '.jpg', '.gif', '.svg', '.psd', '.ai', '.bmp', '.tif', '.cdr'].indexOf(ex) >= 0) {
                this.previewImage = s.split(',')
                this.previewVisible = true
            }
        },
        handleCancel () {
            this.previewVisible = false
        }
    }
}
</script>

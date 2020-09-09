<!--
 * @Description: ERP
 * @Version: ^1.2.0
 * @Company: BestTop
 * @Author: Oak
 * @LastEditors: Reat
 * @Date: 2019-02-20 13:13:17
 * @LastEditTime: 2019-04-28 09:44:54
 -->
<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper" >
      <a-input-number :value="value" @change="handleChange" @pressEnter="check" style="width:85%;margin-right:5px"/>
      <a-icon type="check" class="editable-cell-icon-check" @click="check" />
    </div>
    <div v-else class="editable-cell-text-wrapper" >
      {{ Number(value) || '0' }}
      <a-icon type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
export default {
    name: 'EditTableInput',
    props: {
        // eslint-disable-next-line
        text: String
    },
    data () {
        return {
            value: this.text,
            editable: false
        }
    },
    methods: {
        handleChange (e) {
            const value = Number(e) || 0
            this.value = value || '0'
        },
        check () {
            this.editable = false
            this.$emit('change', this.value)
        },
        edit () {
            this.editable = true
        }
    }
}
</script>
